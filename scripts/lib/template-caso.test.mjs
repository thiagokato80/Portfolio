import test from 'node:test';
import assert from 'node:assert/strict';
import { paginaCaso } from './template-caso.mjs';

const projeto = {
  slug: 'match-hub',
  grupo: 'plataformas',
  icone: 'fa-hospital',
  titulo: { pt: 'Match Hub', en: '' },
  subtitulo: { pt: 'Padronização com IA', en: '' },
  resumo: { pt: 'Resumo do projeto', en: '' },
  tags: { pt: ['GCP', 'Vertex AI'], en: ['GCP', 'Vertex AI'] },
  stack: ['Python 3.12', 'FastAPI'],
  numeros: [{ valor: '193', rotulo: { pt: 'testes', en: '' } }],
  secoes: [{ id: 'problema', titulo: { pt: 'O problema', en: '' }, corpo: { pt: '<p>Texto com <strong>negrito</strong></p>', en: '' } }],
  pdf: null,
  status: { pt: 'Em produção', en: '' },
  seo: { title: { pt: 'Título SEO', en: '' }, description: { pt: 'Descrição SEO', en: '' } },
};

test('gera documento HTML completo', () => {
  const html = paginaCaso(projeto);
  assert.match(html, /^<!DOCTYPE html>/);
  assert.match(html, /<html lang="pt-BR"/);
  assert.match(html, /<\/html>\s*$/);
});

test('usa os campos de seo no title e na description', () => {
  const html = paginaCaso(projeto);
  assert.match(html, /<title>Título SEO<\/title>/);
  assert.match(html, /<meta name="description" content="Descrição SEO">/);
});

test('inclui canonical absoluto', () => {
  const html = paginaCaso(projeto);
  assert.match(html, /<link rel="canonical" href="https:\/\/thiagokato\.github\.io\/Portfolio\/projetos\/match-hub\.html">/);
});

test('não escapa o corpo das seções', () => {
  const html = paginaCaso(projeto);
  assert.match(html, /<p>Texto com <strong>negrito<\/strong><\/p>/);
});

test('escapa o título', () => {
  const html = paginaCaso({ ...projeto, titulo: { pt: 'A & B', en: '' } });
  assert.match(html, /A &amp; B/);
  assert.doesNotMatch(html, /<h1[^>]*>A & B/);
});

test('renderiza tags, stack e números', () => {
  const html = paginaCaso(projeto);
  assert.match(html, /Vertex AI/);
  assert.match(html, /FastAPI/);
  assert.match(html, /193/);
  assert.match(html, /testes/);
});

test('omite o bloco de PDF quando pdf é null', () => {
  assert.doesNotMatch(paginaCaso(projeto), /<iframe/);
});

test('inclui o bloco de PDF quando pdf existe', () => {
  const html = paginaCaso({ ...projeto, pdf: 'Projetos/Exemplo.pdf' });
  assert.match(html, /<iframe src="\.\.\/Projetos\/Exemplo\.pdf"/);
  assert.match(html, /href="\.\.\/Projetos\/Exemplo\.pdf"/);
});

test('não carrega script.js', () => {
  assert.doesNotMatch(paginaCaso(projeto), /script\.js/);
});

test('inclui JSON-LD de SoftwareApplication e BreadcrumbList', () => {
  const html = paginaCaso(projeto);
  assert.match(html, /"@type": "SoftwareApplication"/);
  assert.match(html, /"@type": "BreadcrumbList"/);
});

test('não usa <header> dentro do artigo — colide com o header fixo do site', () => {
  const html = paginaCaso(projeto);
  const artigo = html.slice(html.indexOf('<article>'));
  assert.doesNotMatch(artigo, /<header/);
});

test('a faixa de números aparece antes da primeira seção', () => {
  const html = paginaCaso(projeto);
  assert.ok(html.indexOf('caso-numeros') < html.indexOf('caso-secao'));
});

test('em inglês muda lang, caminho e link do par', () => {
  const html = paginaCaso(projeto, { lang: 'en' });
  assert.match(html, /<html lang="en"/);
  assert.match(html, /<link rel="canonical" href="[^"]*\/projetos\/en\/match-hub\.html">/);
  assert.match(html, /href="\.\.\/\.\.\/index\.html"/);
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
  const html = paginaCaso(projeto);
  assert.doesNotMatch(html, /hreflang="en"/);
  assert.doesNotMatch(html, /hreflang="x-default"/);
  assert.match(html, /rel="canonical"/);
});

test('sem tradução, não mostra o alternador de idioma', () => {
  assert.doesNotMatch(paginaCaso(projeto), /class="lang-switch"/);
});

test('com tradução, declara o par de hreflang', () => {
  const html = paginaCaso(traduzido(projeto));
  assert.match(html, /hreflang="pt-BR"/);
  assert.match(html, /hreflang="en"/);
  assert.match(html, /hreflang="x-default"/);
});

test('com tradução, mostra o alternador apontando para a contraparte', () => {
  const pt = paginaCaso(traduzido(projeto), { lang: 'pt' });
  assert.match(pt, /class="lang-switch"/);
  assert.match(pt, /href="en\//);
  const en = paginaCaso(traduzido(projeto), { lang: 'en' });
  assert.match(en, /class="lang-switch"/);
  assert.match(en, /href="\.\.\//);
});
