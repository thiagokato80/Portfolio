export const MARCA_INICIO = '<!-- PROJETOS:INICIO -->';
export const MARCA_FIM = '<!-- PROJETOS:FIM -->';

/**
 * Substitui o conteúdo entre os marcadores. Nunca reescreve o arquivo inteiro:
 * se um marcador faltar, lança erro e o chamador não deve gravar nada.
 */
export function injetar(html, bloco) {
  const inicio = html.indexOf(MARCA_INICIO);
  if (inicio === -1) {
    throw new Error(`marcador ${MARCA_INICIO} não encontrado — nada foi escrito`);
  }
  const fim = html.indexOf(MARCA_FIM);
  if (fim === -1) {
    throw new Error(`marcador ${MARCA_FIM} não encontrado — nada foi escrito`);
  }
  if (fim < inicio) {
    throw new Error(`marcadores fora de ordem: ${MARCA_FIM} aparece antes de ${MARCA_INICIO}`);
  }

  const antes = html.slice(0, inicio + MARCA_INICIO.length);
  const depois = html.slice(fim);
  return `${antes}\n${bloco}\n                `.concat(depois);
}
