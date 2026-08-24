#!/usr/bin/env node
// scripts/verificar.mjs — valida a saída do gerador antes do commit
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { carregar, carregarArtigos } from './lib/dados.mjs';
import { temTraducao } from './lib/texto.mjs';

function texto(caminho) {
  return existsSync(caminho) ? readFileSync(caminho, 'utf8') : '';
}

function extrair(html, regex) {
  const m = html.match(regex);
  return m ? m[1].trim() : '';
}

/**
 * Checa um diretório de páginas geradas contra a lista de slugs esperada.
 * Cobre: slug sem página, página órfã, ausência no sitemap, title/description
 * vazio ou duplicado, e link interno quebrado.
 */
function checarDiretorio(raiz, dir, slugs, xml, titles, descricoes) {
  const problemas = [];
  const caminhoDir = join(raiz, dir);
  const arquivos = existsSync(caminhoDir)
    ? readdirSync(caminhoDir).filter((f) => f.endsWith('.html'))
    : [];
  const esperados = new Set(slugs);

  for (const slug of slugs) {
    if (!existsSync(join(caminhoDir, `${slug}.html`))) {
      problemas.push(`falta a página ${dir}/${slug}.html — rode node scripts/gerar.mjs`);
    }
    if (!xml.includes(`/${dir}/${slug}.html`)) {
      problemas.push(`sitemap.xml não contém /${dir}/${slug}.html`);
    }
  }

  for (const f of arquivos) {
    if (!esperados.has(f.replace(/\.html$/, ''))) {
      problemas.push(`${dir}/${f} é órfã — nenhum slug corresponde nos dados`);
      continue;
    }

    const caminho = join(caminhoDir, f);
    const html = texto(caminho);

    const title = extrair(html, /<title>([\s\S]*?)<\/title>/i);
    const desc = extrair(html, /<meta name="description" content="([^"]*)"/i);

    if (!title) problemas.push(`${dir}/${f}: <title> vazio`);
    else if (titles.has(title)) problemas.push(`title duplicado entre ${dir}/${f} e ${titles.get(title)}: "${title}"`);
    else titles.set(title, `${dir}/${f}`);

    if (!desc) problemas.push(`${dir}/${f}: meta description vazia`);
    else if (descricoes.has(desc)) problemas.push(`description duplicada entre ${dir}/${f} e ${descricoes.get(desc)}`);
    else descricoes.set(desc, `${dir}/${f}`);

    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const alvo = m[1];
      if (/^(https?:|mailto:|tel:|#|data:)/.test(alvo)) continue;
      const semAncora = alvo.split('#')[0];
      if (!semAncora) continue;
      const absoluto = resolve(caminhoDir, decodeURIComponent(semAncora));
      if (!existsSync(absoluto)) {
        problemas.push(`${dir}/${f}: link interno quebrado — ${alvo}`);
      }
    }
  }

  return problemas;
}

/** Roda as checagens sobre projetos e artigos. Vazia significa tudo certo. */
export function checar(raiz) {
  let dados;
  let artigos;
  try {
    dados = carregar(join(raiz, 'data', 'projetos.json'));
  } catch (e) {
    return [e.message];
  }
  try {
    artigos = carregarArtigos(join(raiz, 'data', 'artigos.json')).artigos;
  } catch (e) {
    if (e.code !== 'ENOENT') return [e.message];
    artigos = [];
  }

  const xml = texto(join(raiz, 'sitemap.xml'));
  const titles = new Map();
  const descricoes = new Map();

  // O index e escrito a mao e linka arquivos que ninguem gera — currículo,
  // favicon, foto. Um arquivo renomeado ou removido nao aparecia em lugar
  // nenhum ate alguem clicar.
  const problemasIndex = [];
  const indexHtml = texto(join(raiz, 'index.html'));
  for (const m of indexHtml.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const alvo = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(alvo)) continue;
    const semAncora = alvo.split('#')[0];
    if (!semAncora) continue;
    if (!existsSync(resolve(raiz, decodeURIComponent(semAncora)))) {
      problemasIndex.push(`index.html: link quebrado — ${alvo}`);
    }
  }

  const projetosEn = dados.projetos.filter(temTraducao).map((p) => p.slug);
  const artigosEn = artigos.filter(temTraducao).map((a) => a.slug);

  return [
    ...problemasIndex,
    ...checarDiretorio(raiz, 'projetos', dados.projetos.map((p) => p.slug), xml, titles, descricoes),
    ...checarDiretorio(raiz, 'Artigos', artigos.map((a) => a.slug), xml, titles, descricoes),
    ...checarDiretorio(raiz, 'projetos/en', projetosEn, xml, titles, descricoes),
    ...checarDiretorio(raiz, 'Artigos/en', artigosEn, xml, titles, descricoes),
  ];
}

const ehPrincipal = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (ehPrincipal) {
  const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
  const problemas = checar(raiz);
  if (problemas.length === 0) {
    console.log('verificação ok — nenhum problema encontrado');
  } else {
    console.error(`\n${problemas.length} problema(s):\n  - ${problemas.join('\n  - ')}\n`);
    process.exit(1);
  }
}
