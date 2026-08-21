import test from 'node:test';
import assert from 'node:assert/strict';
import { paginaArtigo, tempoDeLeitura } from './template-artigo.mjs';
import { SITE } from './site.mjs';

const artigo = {
  slug: 'a_revolucao_silenciosa',
  icone: 'fa-database',
  data: '2026-01-29',
  tag: { pt: 'Data Strategy', en: '' },
  titulo: { pt: 'A Revolução Silenciosa', en: '' },
  lead: { pt: 'Chamada do artigo', en: '' },
  secoes: [
    { id: 'um', titulo: { pt: 'Primeira parte', en: '' }, corpo: { pt: '<p>Texto com <strong>ênfase</strong></p>', en: '' } },
    { id: 'dois', titulo: { pt: 'Segunda parte', en: '' }, corpo: { pt: '<p>Mais texto</p>', en: '' } },
  ],
  pdf: null,
  seo: { title: { pt: 'Título SEO', en: '' }, description: { pt: 'Descrição SEO', en: '' } },
};

test('gera documento HTML completo', () => {
  const html = paginaArtigo(artigo);
  assert.match(html, /^<!DOCTYPE html>/);
  assert.match(html, /<html lang="pt-BR"/);
  assert.match(html, /<\/html>\s*$/);
});

test('usa os campos de seo', () => {
  const html = paginaArtigo(artigo);
  assert.match(html, /<title>Título SEO<\/title>/);
  assert.match(html, /<meta name="description" content="Descrição SEO">/);
});

test('canonical aponta para Artigos com A maiúsculo, no host do site', () => {
  const html = paginaArtigo(artigo);
  assert.ok(html.includes(`<link rel="canonical" href="${SITE}/Artigos/a_revolucao_silenciosa.html">`));
});

test('não escapa o corpo das seções', () => {
  assert.match(paginaArtigo(artigo), /<p>Texto com <strong>ênfase<\/strong><\/p>/);
});

test('escapa o título', () => {
  const html = paginaArtigo({ ...artigo, titulo: { pt: 'A & B', en: '' } });
  assert.match(html, /A &amp; B/);
});

test('inclui data legível e datetime ISO', () => {
  const html = paginaArtigo(artigo);
  assert.match(html, /datetime="2026-01-29"/);
  assert.match(html, /janeiro de 2026/);
});

test('inclui tempo de leitura', () => {
  assert.match(paginaArtigo(artigo), /min de leitura/);
});

test('tempoDeLeitura conta palavras do corpo e arredonda para cima', () => {
  const curto = { ...artigo, secoes: [{ id: 'a', titulo: { pt: 'T', en: '' }, corpo: { pt: '<p>uma duas três</p>', en: '' } }] };
  assert.equal(tempoDeLeitura(curto), 1);
  const palavras = Array(1000).fill('palavra').join(' ');
  const longo = { ...artigo, secoes: [{ id: 'a', titulo: { pt: 'T', en: '' }, corpo: { pt: `<p>${palavras}</p>`, en: '' } }] };
  assert.equal(tempoDeLeitura(longo), 5);
});

test('tempoDeLeitura ignora tags HTML', () => {
  const a = { ...artigo, secoes: [{ id: 'a', titulo: { pt: 'T', en: '' }, corpo: { pt: '<p class="x"><strong>uma</strong> duas</p>', en: '' } }] };
  assert.equal(tempoDeLeitura(a), 1);
});

test('sem sumário quando há poucas seções', () => {
  assert.doesNotMatch(paginaArtigo(artigo), /class="artigo-sumario"/);
});

test('com sumário quando há cinco ou mais seções', () => {
  const muitas = { ...artigo, secoes: Array.from({ length: 5 }, (_, i) => ({ id: `s${i}`, titulo: { pt: `Parte ${i}`, en: '' }, corpo: { pt: '<p>x</p>', en: '' } })) };
  const html = paginaArtigo(muitas);
  assert.match(html, /class="artigo-sumario"/);
  assert.match(html, /href="#s3"/);
});

test('omite o PDF quando null e inclui quando existe', () => {
  assert.doesNotMatch(paginaArtigo(artigo), /\.pdf/);
  const comPdf = paginaArtigo({ ...artigo, pdf: 'Artigos/Exemplo.pdf' });
  assert.match(comPdf, /href="\.\.\/Artigos\/Exemplo\.pdf"/);
});

test('inclui JSON-LD do tipo Article com datePublished', () => {
  const html = paginaArtigo(artigo);
  assert.match(html, /"@type": "Article"/);
  assert.match(html, /"datePublished": "2026-01-29"/);
  assert.doesNotMatch(html, /SoftwareApplication/);
});

test('não carrega script.js', () => {
  assert.doesNotMatch(paginaArtigo(artigo), /script\.js/);
});

test('não usa <header> dentro do artigo — colide com o header fixo do site', () => {
  const corpo = paginaArtigo(artigo).slice(paginaArtigo(artigo).indexOf('<article'));
  assert.doesNotMatch(corpo, /<header/);
});

test('em inglês muda lang e caminho', () => {
  const html = paginaArtigo(artigo, { lang: 'en' });
  assert.match(html, /<html lang="en"/);
  assert.match(html, /canonical" href="[^"]*\/Artigos\/en\/a_revolucao_silenciosa\.html"/);
  assert.match(html, /min read/);
});

function traduzido(base) {
  return {
    ...base,
    titulo: { pt: base.titulo.pt, en: 'Translated title' },
    seo: { title: { pt: base.seo.title.pt, en: 'SEO EN' },
            description: { pt: base.seo.description.pt, en: 'Desc EN' } },
    secoes: base.secoes.map((x) => ({ ...x, corpo: { pt: x.corpo.pt, en: '<p>EN body</p>' } })),
  };
}

test('sem tradução, não declara hreflang alternativo', () => {
  const html = paginaArtigo(artigo);
  assert.doesNotMatch(html, /hreflang="en"/);
  assert.doesNotMatch(html, /hreflang="x-default"/);
  assert.match(html, /rel="canonical"/);
});

test('sem tradução, não mostra o alternador de idioma', () => {
  assert.doesNotMatch(paginaArtigo(artigo), /class="lang-switch"/);
});

test('com tradução, declara o par de hreflang', () => {
  const html = paginaArtigo(traduzido(artigo));
  assert.match(html, /hreflang="pt-BR"/);
  assert.match(html, /hreflang="en"/);
  assert.match(html, /hreflang="x-default"/);
});

test('com tradução, mostra o alternador apontando para a contraparte', () => {
  const pt = paginaArtigo(traduzido(artigo), { lang: 'pt' });
  assert.match(pt, /class="lang-switch"/);
  assert.match(pt, /href="en\//);
  const en = paginaArtigo(traduzido(artigo), { lang: 'en' });
  assert.match(en, /class="lang-switch"/);
  assert.match(en, /href="\.\.\//);
});
