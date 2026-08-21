import test from 'node:test';
import assert from 'node:assert/strict';
import { t, escapar } from './texto.mjs';

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
