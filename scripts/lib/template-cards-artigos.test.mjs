import test from 'node:test';
import assert from 'node:assert/strict';
import { blocoCardsArtigos } from './template-cards-artigos.mjs';

const artigos = [
  { slug: 'saas_repatriation', icone: 'fa-money-bill', data: '2026-03-30',
    tag: { pt: 'SaaS', en: '' }, titulo: { pt: 'SaaS Repatriation', en: '' },
    lead: { pt: 'Resumo A', en: '' },
    secoes: [{ id: 'a', titulo: { pt: 'T', en: '' }, corpo: { pt: '<p>x</p>', en: '' } }],
    pdf: null, seo: { title: { pt: 'x', en: '' }, description: { pt: 'y', en: '' } } },
  { slug: 'o_vale_da_morte', icone: 'fa-robot', data: '2026-06-19',
    tag: { pt: 'IA Agêntica', en: '' }, titulo: { pt: 'O Vale da Morte', en: '' },
    lead: { pt: 'Resumo B', en: '' },
    secoes: [{ id: 'a', titulo: { pt: 'T', en: '' }, corpo: { pt: '<p>x</p>', en: '' } }],
    pdf: null, seo: { title: { pt: 'x', en: '' }, description: { pt: 'y', en: '' } } },
];

test('gera um card por artigo dentro da grade', () => {
  const html = blocoCardsArtigos(artigos);
  assert.match(html, /class="articles-grid"/);
  assert.equal((html.match(/class="article-card"/g) || []).length, 2);
});

test('ordena do mais recente para o mais antigo', () => {
  const html = blocoCardsArtigos(artigos);
  assert.ok(html.indexOf('O Vale da Morte') < html.indexOf('SaaS Repatriation'));
});

test('ordem rebaixa o artigo sem alterar a data', () => {
  const rebaixado = [{ ...artigos[0], ordem: 1 }, artigos[1]];
  const html = blocoCardsArtigos(rebaixado);
  assert.ok(html.indexOf('O Vale da Morte') < html.indexOf('SaaS Repatriation'));

  // o mais antigo sobe quando o mais recente é rebaixado — prova que o campo manda
  const invertido = [artigos[0], { ...artigos[1], ordem: 1 }];
  const html2 = blocoCardsArtigos(invertido);
  assert.ok(html2.indexOf('SaaS Repatriation') < html2.indexOf('O Vale da Morte'));
});

test('artigos sem ordem seguem empatados em 0 e caem na data', () => {
  const html = blocoCardsArtigos(artigos.map((a) => ({ ...a, ordem: 5 })));
  assert.ok(html.indexOf('O Vale da Morte') < html.indexOf('SaaS Repatriation'));
});

test('link aponta para a página em Artigos', () => {
  assert.match(blocoCardsArtigos(artigos), /href="Artigos\/o_vale_da_morte\.html"/);
});

test('não abre em nova aba — é navegação interna', () => {
  assert.doesNotMatch(blocoCardsArtigos(artigos), /target="_blank"/);
});

test('mostra tag, título, lead e tempo de leitura', () => {
  const html = blocoCardsArtigos(artigos);
  assert.match(html, /IA Agêntica/);
  assert.match(html, /Resumo B/);
  assert.match(html, /min de leitura/);
});

test('escapa conteúdo textual', () => {
  const especial = [{ ...artigos[0], titulo: { pt: 'A & B', en: '' } }];
  assert.match(blocoCardsArtigos(especial), /A &amp; B/);
});

test('em inglês o rótulo do link muda', () => {
  assert.match(blocoCardsArtigos(artigos, 'en'), /Read article/);
  assert.match(blocoCardsArtigos(artigos, 'pt'), /Ler artigo/);
});
