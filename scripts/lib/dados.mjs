import { readFileSync } from 'node:fs';

export const GRUPOS_VALIDOS = ['plataformas', 'supplychain', 'laboratorio'];
export const AUTORIAS_VALIDAS = ['autoral', 'sob contrato', 'desenvolvido internamente'];

const CAMPOS_TEXTO = ['titulo', 'subtitulo', 'resumo', 'status'];
const CAMPOS_ARRAY = ['stack', 'numeros', 'secoes'];

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

    if (!p.tags || !Array.isArray(p.tags.pt) || !Array.isArray(p.tags.en)) {
      erros.push(`${slug}: campo "tags" precisa ser { pt: [], en: [] }`);
    } else if (p.tags.pt.length !== p.tags.en.length) {
      erros.push(`${slug}: "tags" tem ${p.tags.pt.length} em pt e ${p.tags.en.length} em en`);
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

/** Valida a estrutura de artigos. Devolve lista de erros — vazia significa válido. */
export function validarArtigos(dados) {
  const erros = [];

  if (!dados || !Array.isArray(dados.artigos)) {
    return ['arquivo precisa de um array "artigos"'];
  }

  const vistos = new Set();
  for (const a of dados.artigos) {
    const slug = a?.slug ?? '(sem slug)';

    if (typeof a.slug !== 'string' || !/^[a-z0-9_]+$/.test(a.slug)) {
      erros.push(`${slug}: slug inválido — use apenas a-z, 0-9 e underscore`);
    } else if (vistos.has(a.slug)) {
      erros.push(`slug duplicado: ${a.slug}`);
    } else {
      vistos.add(a.slug);
    }

    if (typeof a.data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(a.data)) {
      erros.push(`${slug}: campo "data" precisa estar no formato AAAA-MM-DD`);
    }

    // "ordem" é opcional e só rebaixa na vitrine do index — a data segue sendo o registro.
    if (a.ordem !== undefined && !Number.isFinite(a.ordem)) {
      erros.push(`${slug}: campo "ordem" precisa ser número quando presente`);
    }

    for (const nome of ['titulo', 'lead', 'tag']) {
      const e = erroCampoTexto(a[nome], nome, slug);
      if (e) erros.push(e);
    }

    if (!a.seo) {
      erros.push(`${slug}: campo "seo" ausente`);
    } else {
      for (const nome of ['title', 'description']) {
        const e = erroCampoTexto(a.seo[nome], `seo.${nome}`, slug);
        if (e) erros.push(e);
      }
    }

    if (!Array.isArray(a.secoes) || a.secoes.length === 0) {
      erros.push(`${slug}: precisa de pelo menos uma seção em "secoes"`);
    } else {
      for (const [i, s] of a.secoes.entries()) {
        if (typeof s?.id !== 'string') erros.push(`${slug}: secoes[${i}] precisa de "id"`);
        for (const nome of ['titulo', 'corpo']) {
          const e = erroCampoTexto(s?.[nome], `secoes[${i}].${nome}`, slug);
          if (e) erros.push(e);
        }
      }
    }

    if (a.pdf !== null && typeof a.pdf !== 'string') {
      erros.push(`${slug}: "pdf" precisa ser caminho string ou null`);
    }
  }

  return erros;
}

/** Lê e valida o arquivo de artigos. Lança Error listando todos os problemas. */
export function carregarArtigos(caminho) {
  const bruto = readFileSync(caminho, 'utf8');
  let dados;
  try {
    dados = JSON.parse(bruto);
  } catch (e) {
    throw new Error(`${caminho}: JSON inválido — ${e.message}`);
  }
  const erros = validarArtigos(dados);
  if (erros.length > 0) {
    throw new Error(`${caminho}: ${erros.length} problema(s)\n  - ${erros.join('\n  - ')}`);
  }
  return dados;
}
