import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checar } from './verificar.mjs';

const SITE = 'https://thiagokato.github.io/Portfolio';

function projeto(slug) {
  return {
    slug, grupo: 'plataformas', destaque: false, icone: 'fa-cube',
    titulo: { pt: slug, en: '' }, subtitulo: { pt: 's', en: '' }, resumo: { pt: 'r', en: '' },
    tags: { pt: [], en: [] }, stack: [], numeros: [], secoes: [],
    pdf: null, status: { pt: 'produção', en: '' },
    autoria: { tipo: 'autoral', nota: { pt: 'n', en: '' } },
    seo: { title: { pt: `T ${slug}`, en: '' }, description: { pt: `D ${slug}`, en: '' } },
  };
}

function montar({ slugs = ['a'], paginas = ['a'], noSitemap = [], titleDuplicado = false } = {}) {
  const raiz = mkdtempSync(join(tmpdir(), 'verif-'));
  mkdirSync(join(raiz, 'data'));
  mkdirSync(join(raiz, 'projetos'));
  mkdirSync(join(raiz, 'Artigos'));

  const projetos = slugs.map(projeto);
  if (titleDuplicado && projetos.length > 1) projetos[1].seo.title = projetos[0].seo.title;
  writeFileSync(join(raiz, 'data', 'projetos.json'), JSON.stringify({ grupos: [], projetos }));

  for (const s of paginas) {
    const p = projetos.find((x) => x.slug === s) || projeto(s);
    writeFileSync(
      join(raiz, 'projetos', `${s}.html`),
      `<title>${p.seo.title.pt}</title><meta name="description" content="${p.seo.description.pt}"><a href="../index.html">v</a>`
    );
  }
  writeFileSync(join(raiz, 'index.html'), '<html></html>');

  const urls = [`${SITE}/`, ...slugs.filter((s) => !noSitemap.includes(s)).map((s) => `${SITE}/projetos/${s}.html`)];
  writeFileSync(
    join(raiz, 'sitemap.xml'),
    `<?xml version="1.0"?><urlset>${urls.map((u) => `<url><loc>${u}</loc></url>`).join('')}</urlset>`
  );
  return raiz;
}

test('projeto bem formado não gera problema', () => {
  const raiz = montar();
  assert.deepEqual(checar(raiz), []);
  rmSync(raiz, { recursive: true, force: true });
});

test('slug sem página gerada é problema', () => {
  const raiz = montar({ slugs: ['a', 'b'], paginas: ['a'] });
  assert.ok(checar(raiz).some((p) => /b\.html/.test(p) && /falta/i.test(p)));
  rmSync(raiz, { recursive: true, force: true });
});

test('página órfã é problema', () => {
  const raiz = montar({ slugs: ['a'], paginas: ['a', 'zumbi'] });
  assert.ok(checar(raiz).some((p) => /zumbi/.test(p) && /órf/i.test(p)));
  rmSync(raiz, { recursive: true, force: true });
});

test('URL faltando no sitemap é problema', () => {
  const raiz = montar({ slugs: ['a', 'b'], paginas: ['a', 'b'], noSitemap: ['b'] });
  assert.ok(checar(raiz).some((p) => /sitemap/i.test(p) && /b/.test(p)));
  rmSync(raiz, { recursive: true, force: true });
});

test('title duplicado é problema', () => {
  const raiz = montar({ slugs: ['a', 'b'], paginas: ['a', 'b'], titleDuplicado: true });
  assert.ok(checar(raiz).some((p) => /title duplicado/i.test(p)));
  rmSync(raiz, { recursive: true, force: true });
});

test('link interno quebrado é problema', () => {
  const raiz = montar();
  writeFileSync(
    join(raiz, 'projetos', 'a.html'),
    '<title>T a</title><meta name="description" content="D a"><a href="../nao-existe.pdf">x</a>'
  );
  assert.ok(checar(raiz).some((p) => /nao-existe\.pdf/.test(p)));
  rmSync(raiz, { recursive: true, force: true });
});

function montarComArtigos({ slugs = ['a1'], paginas = ['a1'], noSitemap = [] } = {}) {
  const raiz = mkdtempSync(join(tmpdir(), 'verifart-'));
  mkdirSync(join(raiz, 'data'));
  mkdirSync(join(raiz, 'projetos'));
  mkdirSync(join(raiz, 'Artigos'));
  writeFileSync(join(raiz, 'index.html'), '<html></html>');
  writeFileSync(join(raiz, 'data', 'projetos.json'), JSON.stringify({ grupos: [], projetos: [] }));

  const artigos = slugs.map((slug) => ({
    slug, icone: 'fa-x', data: '2026-01-01',
    tag: { pt: 'T', en: '' }, titulo: { pt: slug, en: '' }, lead: { pt: 'l', en: '' },
    secoes: [{ id: 's', titulo: { pt: 'S', en: '' }, corpo: { pt: '<p>x</p>', en: '' } }],
    pdf: null, seo: { title: { pt: `TA ${slug}`, en: '' }, description: { pt: `DA ${slug}`, en: '' } },
  }));
  writeFileSync(join(raiz, 'data', 'artigos.json'), JSON.stringify({ artigos }));

  for (const s of paginas) {
    writeFileSync(join(raiz, 'Artigos', `${s}.html`),
      `<title>TA ${s}</title><meta name="description" content="DA ${s}"><a href="../index.html">v</a>`);
  }
  const urls = slugs.filter((s) => !noSitemap.includes(s)).map((s) => `${SITE}/Artigos/${s}.html`);
  writeFileSync(join(raiz, 'sitemap.xml'),
    `<?xml version="1.0"?><urlset>${urls.map((u) => `<url><loc>${u}</loc></url>`).join('')}</urlset>`);
  return raiz;
}

test('artigo bem formado não gera problema', () => {
  const raiz = montarComArtigos();
  assert.deepEqual(checar(raiz), []);
  rmSync(raiz, { recursive: true, force: true });
});

test('artigo sem página gerada é problema', () => {
  const raiz = montarComArtigos({ slugs: ['a1', 'a2'], paginas: ['a1'] });
  assert.ok(checar(raiz).some((p) => /Artigos\/a2\.html/.test(p) && /falta/i.test(p)));
  rmSync(raiz, { recursive: true, force: true });
});

test('página de artigo órfã é problema', () => {
  const raiz = montarComArtigos({ slugs: ['a1'], paginas: ['a1', 'zumbi'] });
  assert.ok(checar(raiz).some((p) => /zumbi/.test(p) && /órf/i.test(p)));
  rmSync(raiz, { recursive: true, force: true });
});

test('artigo fora do sitemap é problema', () => {
  const raiz = montarComArtigos({ slugs: ['a1', 'a2'], paginas: ['a1', 'a2'], noSitemap: ['a2'] });
  assert.ok(checar(raiz).some((p) => /sitemap/i.test(p) && /a2/.test(p)));
  rmSync(raiz, { recursive: true, force: true });
});

test('title duplicado entre projeto e artigo é detectado', () => {
  const raiz = montarComArtigos();
  writeFileSync(join(raiz, 'projetos', 'p1.html'),
    '<title>TA a1</title><meta name="description" content="outra"><a href="../index.html">v</a>');
  assert.ok(checar(raiz).some((p) => /órf/i.test(p)));
  rmSync(raiz, { recursive: true, force: true });
});
