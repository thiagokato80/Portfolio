#!/usr/bin/env node
// scripts/gerar.mjs — gera páginas de caso, cards do index, sitemap e PROJETOS.md
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { carregar, carregarArtigos } from './lib/dados.mjs';
import { paginaCaso } from './lib/template-caso.mjs';
import { paginaArtigo } from './lib/template-artigo.mjs';
import { blocoCards } from './lib/template-cards.mjs';
import { blocoCardsArtigos } from './lib/template-cards-artigos.mjs';
import { injetar, MARCA_ARTIGOS_INICIO, MARCA_ARTIGOS_FIM } from './lib/indice.mjs';
import { sitemap } from './lib/sitemap.mjs';
import { fichas } from './lib/ficha.mjs';
import { traducoesCards, arquivoTraducoes } from './lib/i18n-cards.mjs';
import { SITE } from './lib/site.mjs';
import { temTraducao } from './lib/texto.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');


function hoje() {
  return new Date().toISOString().slice(0, 10);
}

function main() {
  const dados = carregar(join(RAIZ, 'data', 'projetos.json'));
  const artigos = carregarArtigos(join(RAIZ, 'data', 'artigos.json')).artigos;
  const data = hoje();

  // ---- montar tudo em memória antes de escrever ----
  const paginas = dados.projetos.map((p) => ({
    caminho: join(RAIZ, 'projetos', `${p.slug}.html`),
    conteudo: paginaCaso(p, { lang: 'pt', site: SITE }),
  }));

  const paginasArtigo = artigos.map((a) => ({
    caminho: join(RAIZ, 'Artigos', `${a.slug}.html`),
    conteudo: paginaArtigo(a, { lang: 'pt', site: SITE }),
  }));

  // Versao em ingles so para o que esta integralmente traduzido. Meia
  // traducao publicada faria o hreflang apontar para pagina incompleta.
  const projetosEn = dados.projetos.filter(temTraducao);
  const artigosEn = artigos.filter(temTraducao);

  const paginasEn = [
    ...projetosEn.map((p) => ({
      caminho: join(RAIZ, 'projetos', 'en', `${p.slug}.html`),
      conteudo: paginaCaso(p, { lang: 'en', site: SITE }),
    })),
    ...artigosEn.map((a) => ({
      caminho: join(RAIZ, 'Artigos', 'en', `${a.slug}.html`),
      conteudo: paginaArtigo(a, { lang: 'en', site: SITE }),
    })),
  ];

  const indexOriginal = readFileSync(join(RAIZ, 'index.html'), 'utf8');
  const comProjetos = injetar(indexOriginal, blocoCards(dados.grupos, dados.projetos, 'pt'));
  const indexNovo = injetar(
    comProjetos,
    blocoCardsArtigos(artigos, 'pt'),
    MARCA_ARTIGOS_INICIO,
    MARCA_ARTIGOS_FIM
  );

  const entradas = [
    { loc: `${SITE}/`, changefreq: 'monthly', priority: '1.0' },
    ...dados.projetos.map((p) => ({
      loc: `${SITE}/projetos/${p.slug}.html`,
      changefreq: 'monthly',
      priority: '0.8',
    })),
    ...artigos.map((a) => ({
      loc: `${SITE}/Artigos/${a.slug}.html`,
      changefreq: 'yearly',
      priority: '0.7',
    })),
    ...projetosEn.map((p) => ({
      loc: `${SITE}/projetos/en/${p.slug}.html`,
      changefreq: 'monthly',
      priority: '0.7',
    })),
    ...artigosEn.map((a) => ({
      loc: `${SITE}/Artigos/en/${a.slug}.html`,
      changefreq: 'yearly',
      priority: '0.6',
    })),
  ];
  const xml = sitemap(entradas, data);
  const md = fichas(dados, 'pt');
  const js = arquivoTraducoes(traducoesCards(dados.grupos, dados.projetos, artigos));

  // ---- escrever ----
  mkdirSync(join(RAIZ, 'projetos'), { recursive: true });
  mkdirSync(join(RAIZ, 'Artigos'), { recursive: true });
  if (paginasEn.length > 0) {
    mkdirSync(join(RAIZ, 'projetos', 'en'), { recursive: true });
    mkdirSync(join(RAIZ, 'Artigos', 'en'), { recursive: true });
  }
  for (const { caminho, conteudo } of paginas) writeFileSync(caminho, conteudo, 'utf8');
  for (const { caminho, conteudo } of paginasArtigo) writeFileSync(caminho, conteudo, 'utf8');
  for (const { caminho, conteudo } of paginasEn) writeFileSync(caminho, conteudo, 'utf8');
  writeFileSync(join(RAIZ, 'index.html'), indexNovo, 'utf8');
  writeFileSync(join(RAIZ, 'sitemap.xml'), xml, 'utf8');
  writeFileSync(join(RAIZ, 'PROJETOS.md'), md, 'utf8');
  writeFileSync(join(RAIZ, 'data', 'i18n-gerado.js'), js, 'utf8');

  console.log(`${paginas.length} página(s) em projetos/`);
  console.log(`${paginasArtigo.length} página(s) em Artigos/`);
  console.log(`index.html: bloco de projetos atualizado`);
  console.log(`sitemap.xml: ${entradas.length} URL(s)`);
  console.log(`${paginasEn.length} página(s) em inglês (${projetosEn.length} projeto(s), ${artigosEn.length} artigo(s))`);
  console.log(`PROJETOS.md: ${dados.projetos.length} ficha(s)`);
  console.log(`data/i18n-gerado.js: traduções dos cards`);
}

try {
  main();
} catch (e) {
  console.error(`\nERRO: ${e.message}\n`);
  process.exit(1);
}
