#!/usr/bin/env node
// scripts/verificar.mjs — valida a saída do gerador antes do commit
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { carregar } from './lib/dados.mjs';

function texto(caminho) {
  return existsSync(caminho) ? readFileSync(caminho, 'utf8') : '';
}

function extrair(html, regex) {
  const m = html.match(regex);
  return m ? m[1].trim() : '';
}

/** Roda as seis checagens. Devolve lista de problemas — vazia significa tudo certo. */
export function checar(raiz) {
  const problemas = [];

  let dados;
  try {
    dados = carregar(join(raiz, 'data', 'projetos.json'));
  } catch (e) {
    return [e.message];
  }

  const dirProjetos = join(raiz, 'projetos');
  const arquivos = existsSync(dirProjetos)
    ? readdirSync(dirProjetos).filter((f) => f.endsWith('.html'))
    : [];
  const slugs = new Set(dados.projetos.map((p) => p.slug));

  // 1) todo slug virou página
  for (const p of dados.projetos) {
    if (!existsSync(join(dirProjetos, `${p.slug}.html`))) {
      problemas.push(`falta a página projetos/${p.slug}.html — rode node scripts/gerar.mjs`);
    }
  }

  // 2) nenhuma página órfã
  for (const f of arquivos) {
    if (!slugs.has(f.replace(/\.html$/, ''))) {
      problemas.push(`projetos/${f} é órfã — nenhum slug corresponde no JSON`);
    }
  }

  // 3) sitemap em sincronia
  const xml = texto(join(raiz, 'sitemap.xml'));
  for (const p of dados.projetos) {
    if (!xml.includes(`/projetos/${p.slug}.html`)) {
      problemas.push(`sitemap.xml não contém /projetos/${p.slug}.html`);
    }
  }

  // 4) title e description únicos e não vazios  +  5) links internos
  const titles = new Map();
  const descricoes = new Map();

  for (const f of arquivos) {
    const caminho = join(dirProjetos, f);
    const html = texto(caminho);

    const title = extrair(html, /<title>([\s\S]*?)<\/title>/i);
    const desc = extrair(html, /<meta name="description" content="([^"]*)"/i);

    if (!title) problemas.push(`projetos/${f}: <title> vazio`);
    else if (titles.has(title)) problemas.push(`title duplicado entre projetos/${f} e projetos/${titles.get(title)}: "${title}"`);
    else titles.set(title, f);

    if (!desc) problemas.push(`projetos/${f}: meta description vazia`);
    else if (descricoes.has(desc)) problemas.push(`description duplicada entre projetos/${f} e projetos/${descricoes.get(desc)}`);
    else descricoes.set(desc, f);

    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const alvo = m[1];
      if (/^(https?:|mailto:|tel:|#|data:)/.test(alvo)) continue;
      const semAncora = alvo.split('#')[0];
      if (!semAncora) continue;
      const absoluto = resolve(dirProjetos, decodeURIComponent(semAncora));
      if (!existsSync(absoluto)) {
        problemas.push(`projetos/${f}: link interno quebrado — ${alvo}`);
      }
    }
  }

  return problemas;
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
