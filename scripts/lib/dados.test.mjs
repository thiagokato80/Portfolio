import test from 'node:test';
import assert from 'node:assert/strict';
import { validar, validarArtigos } from './dados.mjs';

function projetoValido(extra = {}) {
  return {
    slug: 'match-hub',
    grupo: 'plataformas',
    destaque: true,
    icone: 'fa-hospital',
    titulo: { pt: 'Match Hub', en: '' },
    subtitulo: { pt: 'Sub', en: '' },
    resumo: { pt: 'Resumo', en: '' },
    tags: { pt: ['GCP'], en: ['GCP'] },
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

function artigoValido(extra = {}) {
  return {
    slug: 'a_revolucao_silenciosa',
    icone: 'fa-database',
    data: '2026-01-29',
    tag: { pt: 'Data Strategy', en: '' },
    titulo: { pt: 'A Revolução Silenciosa', en: '' },
    lead: { pt: 'Chamada do artigo', en: '' },
    secoes: [{ id: 's1', titulo: { pt: 'Parte 1', en: '' }, corpo: { pt: '<p>x</p>', en: '' } }],
    pdf: null,
    seo: { title: { pt: 'T', en: '' }, description: { pt: 'D', en: '' } },
    ...extra,
  };
}

test('artigo válido não produz erro', () => {
  assert.deepEqual(validarArtigos({ artigos: [artigoValido()] }), []);
});

test('slug de artigo aceita underscore', () => {
  assert.deepEqual(validarArtigos({ artigos: [artigoValido({ slug: 'saas_repatriation' })] }), []);
});

test('slug de artigo com maiúscula é erro', () => {
  assert.match(validarArtigos({ artigos: [artigoValido({ slug: 'Artigo' })] })[0], /slug inválido/);
});

test('slug de artigo duplicado é erro', () => {
  const erros = validarArtigos({ artigos: [artigoValido(), artigoValido()] });
  assert.match(erros[0], /slug duplicado/);
});

test('data de artigo fora do formato ISO é erro', () => {
  assert.match(validarArtigos({ artigos: [artigoValido({ data: '19/06/2026' })] })[0], /data/);
});

test('artigo sem seções é erro', () => {
  assert.match(validarArtigos({ artigos: [artigoValido({ secoes: [] })] })[0], /pelo menos uma seção/);
});

test('artigo sem lead é erro', () => {
  const a = artigoValido();
  delete a.lead;
  assert.match(validarArtigos({ artigos: [a] })[0], /lead/);
});

test('tags fora do formato {pt, en} é erro', () => {
  const erros = validar(dadosValidos([projetoValido({ tags: ['GCP'] })]));
  assert.match(erros[0], /tags.*pt/);
});

test('tags com quantidades diferentes entre idiomas é erro', () => {
  const erros = validar(dadosValidos([projetoValido({ tags: { pt: ['A', 'B'], en: ['A'] } })]));
  assert.match(erros[0], /2 em pt e 1 em en/);
});
