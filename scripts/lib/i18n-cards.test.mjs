import test from 'node:test';
import assert from 'node:assert/strict';
import { traducoesCards, arquivoTraducoes } from './i18n-cards.mjs';

const grupos = [{ id: 'plataformas', titulo: { pt: 'Plataformas', en: 'Platforms' }, descricao: { pt: 'Sistemas.', en: 'Systems.' } }];
const projetos = [{
  slug: 'match-hub', grupo: 'plataformas', destaque: true, icone: 'fa-x',
  titulo: { pt: 'Match Hub', en: '' }, subtitulo: { pt: 'Sub pt', en: 'Sub en' },
  resumo: { pt: 'Resumo pt', en: 'Summary en' }, tags: [], stack: [], numeros: [], secoes: [],
  pdf: null, status: { pt: 'Produção', en: 'Production' },
  autoria: { tipo: 'autoral', nota: { pt: 'n', en: '' } },
  seo: { title: { pt: 'x', en: '' }, description: { pt: 'y', en: '' } },
}];
const artigos = [{
  slug: 'artigo_um', icone: 'fa-y', data: '2026-01-01',
  tag: { pt: 'Dados', en: 'Data' }, titulo: { pt: 'Título pt', en: 'Title en' },
  lead: { pt: 'Lead pt', en: 'Lead en' },
  secoes: [{ id: 's', titulo: { pt: 'S', en: 'S' }, corpo: { pt: '<p>uma duas</p>', en: '<p>one two</p>' } }],
  pdf: null, seo: { title: { pt: 'x', en: '' }, description: { pt: 'y', en: '' } },
}];

test('gera entradas pt e en para grupos, projetos e artigos', () => {
  const d = traducoesCards(grupos, projetos, artigos);
  assert.equal(d.pt['grupo-plataformas-titulo'], 'Plataformas');
  assert.equal(d.en['grupo-plataformas-titulo'], 'Platforms');
  assert.equal(d.pt['proj-match-hub-resumo'], 'Resumo pt');
  assert.equal(d.en['proj-match-hub-resumo'], 'Summary en');
  assert.equal(d.pt['art-artigo_um-lead'], 'Lead pt');
  assert.equal(d.en['art-artigo_um-lead'], 'Lead en');
});

test('campo sem tradução cai para o português, nunca fica vazio', () => {
  const d = traducoesCards(grupos, projetos, artigos);
  assert.equal(d.en['proj-match-hub-titulo'], 'Match Hub');
});

test('inclui o rótulo do link e o tempo de leitura nos dois idiomas', () => {
  const d = traducoesCards(grupos, projetos, artigos);
  assert.equal(d.pt['proj-match-hub-link'], 'Ver estudo de caso');
  assert.equal(d.en['proj-match-hub-link'], 'View case study');
  assert.match(d.pt['art-artigo_um-meta'], /min de leitura/);
  assert.match(d.en['art-artigo_um-meta'], /min read/);
});

test('arquivoTraducoes gera JS válido que define a global', () => {
  const js = arquivoTraducoes(traducoesCards(grupos, projetos, artigos));
  assert.match(js, /window\.TRADUCOES_GERADAS\s*=/);
  assert.match(js, /gerado por scripts\/gerar\.mjs/);
  const escopo = {};
  new Function('window', js)(escopo);
  assert.equal(escopo.TRADUCOES_GERADAS.en['grupo-plataformas-titulo'], 'Platforms');
});
