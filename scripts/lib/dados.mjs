import { readFileSync } from 'node:fs';

export const GRUPOS_VALIDOS = ['plataformas', 'supplychain', 'laboratorio'];
export const AUTORIAS_VALIDAS = ['autoral', 'sob contrato', 'desenvolvido internamente'];

const CAMPOS_TEXTO = ['titulo', 'subtitulo', 'resumo', 'status'];
const CAMPOS_ARRAY = ['tags', 'stack', 'numeros', 'secoes'];

function erroCampoTexto(campo, nome, slug) {
  if (!campo || typeof campo !== 'object') return `${slug}: campo "${nome}" ausente`;
  if (typeof campo.pt !== 'string' || campo.pt.trim() === '') {
    return `${slug}: campo "${nome}" precisa de "pt" não vazio`;
  }
  if (!('en' in campo)) return `${slug}: campo "${nome}" precisa da chave "en" (pode ser "")`;
  return null;
}

/** Valida a estrutura carregada. Devolve lista de erros — vazia significa válido. */
export function validar(dados) {
  const erros = [];

  if (!dados || !Array.isArray(dados.projetos)) {
    return ['arquivo precisa de um array "projetos"'];
  }
  if (!Array.isArray(dados.grupos)) {
    erros.push('arquivo precisa de um array "grupos"');
  }

  const vistos = new Set();
  for (const p of dados.projetos) {
    const slug = p?.slug ?? '(sem slug)';

    if (typeof p.slug !== 'string' || !/^[a-z0-9-]+$/.test(p.slug)) {
      erros.push(`${slug}: slug inválido — use apenas a-z, 0-9 e hífen`);
    } else if (vistos.has(p.slug)) {
      erros.push(`slug duplicado: ${p.slug}`);
    } else {
      vistos.add(p.slug);
    }

    if (!GRUPOS_VALIDOS.includes(p.grupo)) {
      erros.push(`${slug}: grupo inválido "${p.grupo}" — use ${GRUPOS_VALIDOS.join(', ')}`);
    }

    for (const nome of CAMPOS_TEXTO) {
      const e = erroCampoTexto(p[nome], nome, slug);
      if (e) erros.push(e);
    }

    for (const nome of CAMPOS_ARRAY) {
      if (!Array.isArray(p[nome])) erros.push(`${slug}: campo "${nome}" precisa ser array`);
    }

    if (!p.seo) {
      erros.push(`${slug}: campo "seo" ausente`);
    } else {
      for (const nome of ['title', 'description']) {
        const e = erroCampoTexto(p.seo[nome], `seo.${nome}`, slug);
        if (e) erros.push(e);
      }
    }

    if (Array.isArray(p.secoes)) {
      for (const [i, s] of p.secoes.entries()) {
        if (typeof s?.id !== 'string') erros.push(`${slug}: secoes[${i}] precisa de "id"`);
        for (const nome of ['titulo', 'corpo']) {
          const e = erroCampoTexto(s?.[nome], `secoes[${i}].${nome}`, slug);
          if (e) erros.push(e);
        }
      }
    }

    if (p.pdf !== null && typeof p.pdf !== 'string') {
      erros.push(`${slug}: "pdf" precisa ser caminho string ou null`);
    }

    if (!p.autoria) {
      erros.push(`${slug}: campo "autoria" ausente`);
    } else if (!AUTORIAS_VALIDAS.includes(p.autoria.tipo)) {
      erros.push(
        `${slug}: autoria.tipo inválido "${p.autoria.tipo}" — use ${AUTORIAS_VALIDAS.join(', ')}`
      );
    } else {
      const e = erroCampoTexto(p.autoria.nota, 'autoria.nota', slug);
      if (e) erros.push(e);
    }
  }

  return erros;
}

/** Lê e valida o arquivo de dados. Lança Error listando todos os problemas. */
export function carregar(caminho) {
  const bruto = readFileSync(caminho, 'utf8');
  let dados;
  try {
    dados = JSON.parse(bruto);
  } catch (e) {
    throw new Error(`${caminho}: JSON inválido — ${e.message}`);
  }
  const erros = validar(dados);
  if (erros.length > 0) {
    throw new Error(`${caminho}: ${erros.length} problema(s)\n  - ${erros.join('\n  - ')}`);
  }
  return dados;
}
