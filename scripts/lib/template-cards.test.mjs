import test from 'node:test';
import assert from 'node:assert/strict';
import { blocoCards } from './template-cards.mjs';

const grupos = [
  { id: 'plataformas', titulo: { pt: 'Plataformas', en: '' }, descricao: { pt: 'Sistemas em operação.', en: '' } },
  { id: 'laboratorio', titulo: { pt: 'Laboratório', en: '' }, descricao: { pt: 'Experimentos.', en: '' } },
];

const projetos = [
  {
    slug: 'match-hub', grupo: 'plataformas', destaque: true, icone: 'fa-hospital',
    titulo: { pt: 'Match Hub', en: '' }, subtitulo: { pt: 'Sub', en: '' },
    resumo: { pt: 'Resumo A', en: '' }, tags: { pt: ['GCP'], en: ['GCP'] },
    stack: ['Python', 'FastAPI', 'Firestore', 'React'], numeros: [], secoes: [],
    pdf: null, status: { pt: 'Em produção', en: '' },
    seo: { title: { pt: 'x', en: '' }, description: { pt: 'y', en: '' } },
  },
  {
    slug: 'jarvis', grupo: 'laboratorio', destaque: false, icone: 'fa-robot',
    titulo: { pt: 'Ecossistema JARVIS', en: '' }, subtitulo: { pt: 'Sub', en: '' },
    resumo: { pt: 'Resumo B', en: '' }, tags: { pt: ['A2A'], en: ['A2A'] },
    stack: ['Python'], numeros: [], secoes: [],
    pdf: null, status: { pt: 'Ativo', en: '' },
    seo: { title: { pt: 'x', en: '' }, description: { pt: 'y', en: '' } },
  },
];

test('cria um cabeçalho por grupo com projeto', () => {
  const html = blocoCards(grupos, projetos);
  assert.match(html, /class="grupo-header"/);
  assert.match(html, /Plataformas/);
  assert.match(html, /Laboratório/);
  assert.match(html, /Sistemas em operação\./);
});

test('omite grupo sem projeto', () => {
  const html = blocoCards([...grupos, { id: 'supplychain', titulo: { pt: 'Vazio', en: '' }, descricao: { pt: 'd', en: '' } }], projetos);
  assert.doesNotMatch(html, /Vazio/);
});

test('aplica featured apenas em destaque', () => {
  const html = blocoCards(grupos, projetos);
  assert.match(html, /class="project-card featured"/);
  assert.match(html, /class="project-card"/);
});

test('link aponta para a página de caso', () => {
  const html = blocoCards(grupos, projetos);
  assert.match(html, /href="projetos\/match-hub\.html"/);
  assert.match(html, /href="projetos\/jarvis\.html"/);
});

test('mostra no máximo 3 itens da stack como features', () => {
  const html = blocoCards(grupos, projetos);
  const cardMatchHub = html.slice(Math.max(0, html.indexOf('match-hub') - 2000), html.indexOf('match-hub') + 2000);
  assert.match(cardMatchHub, /Firestore/);
  assert.doesNotMatch(cardMatchHub, /React/);
});

test('escapa conteúdo textual', () => {
  const especial = [{ ...projetos[0], titulo: { pt: 'A & B', en: '' } }];
  assert.match(blocoCards(grupos, especial), /A &amp; B/);
});

test('em inglês o rótulo do link muda', () => {
  assert.match(blocoCards(grupos, projetos, 'en'), /View case study/);
  assert.match(blocoCards(grupos, projetos, 'pt'), /Ver estudo de caso/);
});

test('o card carrega os dois destinos, para o link seguir o idioma', () => {
  const traduzido = [{
    ...projetos[0],
    titulo: { pt: 'Match Hub', en: 'Match Hub' },
    seo: { title: { pt: 'x', en: 'x-en' }, description: { pt: 'y', en: 'y-en' } },
    secoes: [{ id: 'a', titulo: { pt: 'A', en: 'A' }, corpo: { pt: '<p>x</p>', en: '<p>x-en</p>' } }],
  }];
  const html = blocoCards(grupos, traduzido);
  assert.match(html, /data-href-pt="projetos\/match-hub\.html"/);
  assert.match(html, /data-href-en="projetos\/en\/match-hub\.html"/);
});

test('sem tradução, o destino em inglês aponta para a página em português', () => {
  const html = blocoCards(grupos, projetos);
  assert.match(html, /data-href-en="projetos\/match-hub\.html"/);
});
