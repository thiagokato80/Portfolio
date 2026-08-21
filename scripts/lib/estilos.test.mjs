import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const CSS = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'styles.css'), 'utf8');

// O site estiliza seletores de elemento nus. Se alguem remover a neutralizacao,
// as paginas geradas voltam a herdar padding de secao e altura de nav.
test('o site ainda estiliza os seletores de elemento que exigem neutralização', () => {
  assert.match(CSS, /^section \{/m, 'se `section` deixou de ser estilizado, revise a neutralização');
  assert.match(CSS, /^nav \{/m);
  assert.match(CSS, /^header \{/m);
});

test('páginas geradas neutralizam o padding de section', () => {
  assert.match(CSS, /\.caso section,\s*\n\.artigo section \{\s*\n\s*padding: 0;/);
});

test('o sumário de artigo neutraliza a altura fixa de nav', () => {
  assert.match(CSS, /\.artigo-sumario,[\s\S]{0,80}height: auto;/);
});
