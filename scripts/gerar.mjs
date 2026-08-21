#!/usr/bin/env node
// scripts/gerar.mjs — gera páginas de caso, cards do index, sitemap e PROJETOS.md
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { carregar } from './lib/dados.mjs';
import { paginaCaso } from './lib/template-caso.mjs';
import { blocoCards } from './lib/template-cards.mjs';
import { injetar } from './lib/indice.mjs';
import { sitemap } from './lib/sitemap.mjs';
import { fichas } from './lib/ficha.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://thiagokato.github.io/Portfolio';

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

function paginasDeArtigo() {
  try {
    return readdirSync(join(RAIZ, 'Artigos'))
      .filter((f) => f.endsWith('.html'))
      .sort()
      .map((f) => ({
        loc: `${SITE}/Artigos/${encodeURIComponent(f)}`,
        changefreq: 'yearly',
        priority: '0.6',
      }));
  } catch {
    return [];
  }
}

function main() {
  const dados = carregar(join(RAIZ, 'data', 'projetos.json'));
  const data = hoje();

  // ---- montar tudo em memória antes de escrever ----
  const paginas = dados.projetos.map((p) => ({
    caminho: join(RAIZ, 'projetos', `${p.slug}.html`),
    conteudo: paginaCaso(p, { lang: 'pt', site: SITE }),
  }));

  const indexOriginal = readFileSync(join(RAIZ, 'index.html'), 'utf8');
  const indexNovo = injetar(indexOriginal, blocoCards(dados.grupos, dados.projetos, 'pt'));

  const entradas = [
    { loc: `${SITE}/`, changefreq: 'monthly', priority: '1.0' },
    ...dados.projetos.map((p) => ({
      loc: `${SITE}/projetos/${p.slug}.html`,
      changefreq: 'monthly',
      priority: '0.8',
    })),
    ...paginasDeArtigo(),
  ];
  const xml = sitemap(entradas, data);
  const md = fichas(dados, 'pt');

  // ---- escrever ----
  mkdirSync(join(RAIZ, 'projetos'), { recursive: true });
  for (const { caminho, conteudo } of paginas) writeFileSync(caminho, conteudo, 'utf8');
  writeFileSync(join(RAIZ, 'index.html'), indexNovo, 'utf8');
  writeFileSync(join(RAIZ, 'sitemap.xml'), xml, 'utf8');
  writeFileSync(join(RAIZ, 'PROJETOS.md'), md, 'utf8');

  console.log(`${paginas.length} página(s) em projetos/`);
  console.log(`index.html: bloco de projetos atualizado`);
  console.log(`sitemap.xml: ${entradas.length} URL(s)`);
  console.log(`PROJETOS.md: ${dados.projetos.length} ficha(s)`);
}

try {
  main();
} catch (e) {
  console.error(`\nERRO: ${e.message}\n`);
  process.exit(1);
}
