import test from 'node:test';
import assert from 'node:assert/strict';
import { t, escapar, temTraducao } from './texto.mjs';

test('t devolve o idioma pedido', () => {
  assert.equal(t({ pt: 'Olá', en: 'Hello' }, 'en'), 'Hello');
});

test('t cai para pt quando en está vazio', () => {
  assert.equal(t({ pt: 'Olá', en: '' }, 'en'), 'Olá');
});

test('t cai para pt quando en está ausente', () => {
  assert.equal(t({ pt: 'Olá' }, 'en'), 'Olá');
});

test('t sem lang usa pt', () => {
  assert.equal(t({ pt: 'Olá', en: 'Hello' }), 'Olá');
});

test('t com campo indefinido devolve string vazia', () => {
  assert.equal(t(undefined, 'pt'), '');
});

test('escapar neutraliza HTML', () => {
  assert.equal(escapar('<a href="x">&</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
});

test('escapar aceita não-string', () => {
  assert.equal(escapar(42), '42');
  assert.equal(escapar(null), '');
});

test('temTraducao é falso quando os campos en estão vazios', () => {
  const item = {
    titulo: { pt: 'A', en: '' },
    seo: { title: { pt: 'T', en: '' }, description: { pt: 'D', en: '' } },
    secoes: [{ corpo: { pt: '<p>x</p>', en: '' } }],
  };
  assert.equal(temTraducao(item), false);
});

test('temTraducao é verdadeiro quando título, seo e todas as seções têm en', () => {
  const item = {
    titulo: { pt: 'A', en: 'A-en' },
    seo: { title: { pt: 'T', en: 'T-en' }, description: { pt: 'D', en: 'D-en' } },
    secoes: [{ corpo: { pt: '<p>x</p>', en: '<p>x-en</p>' } }],
  };
  assert.equal(temTraducao(item), true);
});

test('temTraducao é falso se uma única seção ficou sem tradução', () => {
  const item = {
    titulo: { pt: 'A', en: 'A-en' },
    seo: { title: { pt: 'T', en: 'T-en' }, description: { pt: 'D', en: 'D-en' } },
    secoes: [
      { corpo: { pt: '<p>x</p>', en: '<p>x-en</p>' } },
      { corpo: { pt: '<p>y</p>', en: '' } },
    ],
  };
  assert.equal(temTraducao(item), false);
});

test('temTraducao é falso se a descrição de seo ficou sem tradução', () => {
  const item = {
    titulo: { pt: 'A', en: 'A-en' },
    seo: { title: { pt: 'T', en: 'T-en' }, description: { pt: 'D', en: '' } },
    secoes: [{ corpo: { pt: '<p>x</p>', en: '<p>x-en</p>' } }],
  };
  assert.equal(temTraducao(item), false);
});
