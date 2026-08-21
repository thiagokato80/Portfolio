import test from 'node:test';
import assert from 'node:assert/strict';
import { validar } from './dados.mjs';

function projetoValido(extra = {}) {
  return {
    slug: 'match-hub',
    grupo: 'plataformas',
    destaque: true,
    icone: 'fa-hospital',
    titulo: { pt: 'Match Hub', en: '' },
    subtitulo: { pt: 'Sub', en: '' },
    resumo: { pt: 'Resumo', en: '' },
    tags: ['GCP'],
    stack: ['Python'],
    numeros: [],
    secoes: [{ id: 'problema', titulo: { pt: 'O problema', en: '' }, corpo: { pt: '<p>x</p>', en: '' } }],
    pdf: null,
    status: { pt: 'Em produção', en: '' },
    autoria: { tipo: 'autoral', nota: { pt: 'Projeto autoral.', en: '' } },
    seo: { title: { pt: 'Match Hub', en: '' }, description: { pt: 'desc', en: '' } },
    ...extra,
  };
}

function dadosValidos(projetos) {
  return {
    grupos: [{ id: 'plataformas', titulo: { pt: 'Plataformas', en: '' }, descricao: { pt: 'd', en: '' } }],
    projetos,
  };
}

test('dados válidos não produzem erro', () => {
  assert.deepEqual(validar(dadosValidos([projetoValido()])), []);
});

test('slug duplicado é erro', () => {
  const erros = validar(dadosValidos([projetoValido(), projetoValido()]));
  assert.equal(erros.length, 1);
  assert.match(erros[0], /slug duplicado: match-hub/);
});

test('grupo desconhecido é erro', () => {
  const erros = validar(dadosValidos([projetoValido({ grupo: 'inventado' })]));
  assert.match(erros[0], /grupo inválido/);
});

test('campo obrigatório ausente é erro', () => {
  const p = projetoValido();
  delete p.seo;
  assert.match(validar(dadosValidos([p]))[0], /seo/);
});

test('campo de texto sem pt é erro', () => {
  const erros = validar(dadosValidos([projetoValido({ titulo: { pt: '', en: '' } })]));
  assert.match(erros[0], /titulo.*pt/);
});

test('slug com caractere inválido é erro', () => {
  const erros = validar(dadosValidos([projetoValido({ slug: 'Match Hub!' })]));
  assert.match(erros[0], /slug inválido/);
});

test('autoria com tipo desconhecido é erro', () => {
  const erros = validar(dadosValidos([projetoValido({ autoria: { tipo: 'inventado', nota: { pt: 'x', en: '' } } })]));
  assert.match(erros[0], /autoria\.tipo inválido/);
});

test('autoria ausente é erro', () => {
  const p = projetoValido();
  delete p.autoria;
  assert.match(validar(dadosValidos([p]))[0], /autoria/);
});

test('grupo declarado sem projeto não é erro', () => {
  const d = dadosValidos([projetoValido()]);
  d.grupos.push({ id: 'laboratorio', titulo: { pt: 'Lab', en: '' }, descricao: { pt: 'd', en: '' } });
  assert.deepEqual(validar(d), []);
});
