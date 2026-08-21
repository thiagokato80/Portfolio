/** Extrai o texto de um campo {pt, en}, com fallback para pt. */
export function t(campo, lang = 'pt') {
  if (!campo) return '';
  const valor = campo[lang];
  if (typeof valor === 'string' && valor.trim() !== '') return valor;
  return typeof campo.pt === 'string' ? campo.pt : '';
}

/** Escapa texto para interpolação segura em HTML. */
export function escapar(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function preenchido(campo) {
  return Boolean(campo && typeof campo.en === 'string' && campo.en.trim() !== '');
}

/**
 * Um item (projeto ou artigo) só conta como traduzido quando título, seo e
 * TODAS as seções têm "en" preenchido. Meia tradução publicada é pior que
 * nenhuma: o hreflang passaria a apontar para uma página incompleta.
 */
export function temTraducao(item) {
  if (!preenchido(item.titulo)) return false;
  if (!item.seo || !preenchido(item.seo.title) || !preenchido(item.seo.description)) return false;
  if (!Array.isArray(item.secoes) || item.secoes.length === 0) return false;
  return item.secoes.every((s) => preenchido(s.corpo));
}
