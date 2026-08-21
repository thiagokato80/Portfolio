import test from 'node:test';
import assert from 'node:assert/strict';
import { injetar, MARCA_INICIO, MARCA_FIM, MARCA_ARTIGOS_INICIO, MARCA_ARTIGOS_FIM } from './indice.mjs';

const base = `<section>
${MARCA_INICIO}
conteúdo antigo
${MARCA_FIM}
</section>`;

test('substitui apenas o conteúdo entre marcadores', () => {
  const saida = injetar(base, 'NOVO');
  assert.match(saida, /<section>/);
  assert.match(saida, /<\/section>/);
  assert.match(saida, /NOVO/);
  assert.doesNotMatch(saida, /conteúdo antigo/);
});

test('preserva os marcadores para a próxima geração', () => {
  const saida = injetar(base, 'NOVO');
  assert.ok(saida.includes(MARCA_INICIO));
  assert.ok(saida.includes(MARCA_FIM));
  assert.equal(injetar(saida, 'OUTRO').includes('NOVO'), false);
});

test('lança erro se o marcador de início falta', () => {
  assert.throws(() => injetar(`<section>${MARCA_FIM}</section>`, 'X'), /PROJETOS:INICIO/);
});

test('lança erro se o marcador de fim falta', () => {
  assert.throws(() => injetar(`<section>${MARCA_INICIO}</section>`, 'X'), /PROJETOS:FIM/);
});

test('lança erro se os marcadores estão fora de ordem', () => {
  assert.throws(() => injetar(`${MARCA_FIM}x${MARCA_INICIO}`, 'X'), /ordem/);
});

test('não altera nada fora dos marcadores', () => {
  const html = `ANTES${MARCA_INICIO}velho${MARCA_FIM}DEPOIS`;
  const saida = injetar(html, 'novo');
  assert.ok(saida.startsWith('ANTES'));
  assert.ok(saida.endsWith('DEPOIS'));
});

test('aceita um par de marcadores alternativo', () => {
  const html = `A${MARCA_ARTIGOS_INICIO}velho${MARCA_ARTIGOS_FIM}B`;
  const saida = injetar(html, 'novo', MARCA_ARTIGOS_INICIO, MARCA_ARTIGOS_FIM);
  assert.match(saida, /novo/);
  assert.doesNotMatch(saida, /velho/);
});

test('marcadores de artigo e de projeto são distintos', () => {
  assert.notEqual(MARCA_INICIO, MARCA_ARTIGOS_INICIO);
  assert.notEqual(MARCA_FIM, MARCA_ARTIGOS_FIM);
});

test('erro do par alternativo cita o marcador certo', () => {
  assert.throws(() => injetar('nada aqui', 'x', MARCA_ARTIGOS_INICIO, MARCA_ARTIGOS_FIM), /ARTIGOS:INICIO/);
});
