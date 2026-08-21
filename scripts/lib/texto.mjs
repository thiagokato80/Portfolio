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
