import test from 'node:test';
import assert from 'node:assert/strict';
import { fichas } from './ficha.mjs';

const base = {
  slug: 'match-hub', grupo: 'plataformas', destaque: true, icone: 'fa-hospital',
  titulo: { pt: 'Match Hub', en: '' },
  subtitulo: { pt: 'Padronização de insumos hospitalares com IA', en: '' },
  resumo: { pt: 'Resumo', en: '' },
  tags: ['GCP'], stack: ['Python 3.12', 'FastAPI', 'Firestore'], numeros: [],
  secoes: [
    { id: 'problema', titulo: { pt: 'O problema', en: '' }, corpo: { pt: '<p>Cada empresa descreve o item de um jeito.</p><p>Não dá para comparar preço.</p>', en: '' } },
    { id: 'solucao', titulo: { pt: 'A solução', en: '' }, corpo: { pt: '<p>LLM normaliza e embedding compara.</p>', en: '' } },
    { id: 'resultado', titulo: { pt: 'Resultado', en: '' }, corpo: { pt: '<p>De meses para execução assíncrona.</p>', en: '' } },
  ],
  pdf: null,
  status: { pt: 'produção', en: '' },
  autoria: { tipo: 'autoral', nota: { pt: 'Desenvolvido fora do contexto de trabalho.', en: '' } },
  seo: { title: { pt: 'x', en: '' }, description: { pt: 'y', en: '' } },
};

const dados = { grupos: [], projetos: [base] };

test('gera um cabeçalho por projeto', () => {
  assert.match(fichas(dados), /^## Match Hub$/m);
});

test('emite os sete campos na ordem exigida', () => {
  const md = fichas(dados);
  const ordem = ['Uma linha:', 'Problema:', 'Arquitetura:', 'Stack:', 'Resultado:', 'Status:', 'Autoria:'];
  let pos = -1;
  for (const campo of ordem) {
    const i = md.indexOf(campo);
    assert.ok(i > pos, `${campo} fora de ordem`);
    pos = i;
  }
});

test('remove HTML do corpo das seções', () => {
  const md = fichas(dados);
  assert.doesNotMatch(md, /<p>/);
  assert.match(md, /Cada empresa descreve o item de um jeito\./);
});

test('junta parágrafos do problema em uma linha', () => {
  const md = fichas(dados);
  const linha = md.split('\n').find((l) => l.startsWith('- Problema:'));
  assert.match(linha, /Não dá para comparar preço\./);
});

test('sem seção de resultado escreve "sem métrica medida"', () => {
  const semResultado = { ...base, secoes: base.secoes.filter((s) => s.id !== 'resultado') };
  const md = fichas({ grupos: [], projetos: [semResultado] });
  assert.match(md, /- Resultado: sem métrica medida/);
});

test('lista a stack separada por vírgula', () => {
  assert.match(fichas(dados), /- Stack: Python 3\.12, FastAPI, Firestore/);
});

test('autoria imprime tipo e nota', () => {
  assert.match(fichas(dados), /- Autoria: autoral — Desenvolvido fora do contexto de trabalho\./);
});

test('autoria sem nota imprime só o tipo', () => {
  const semNota = { ...base, autoria: { tipo: 'sob contrato', nota: { pt: '', en: '' } } };
  const md = fichas({ grupos: [], projetos: [semNota] });
  assert.match(md, /- Autoria: sob contrato$/m);
});
