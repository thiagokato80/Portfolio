export const MARCA_INICIO = '<!-- PROJETOS:INICIO -->';
export const MARCA_FIM = '<!-- PROJETOS:FIM -->';
export const MARCA_ARTIGOS_INICIO = '<!-- ARTIGOS:INICIO -->';
export const MARCA_ARTIGOS_FIM = '<!-- ARTIGOS:FIM -->';

/**
 * Substitui o conteúdo entre os marcadores. Nunca reescreve o arquivo inteiro:
 * se um marcador faltar, lança erro e o chamador não deve gravar nada.
 */
export function injetar(html, bloco, marcaInicio = MARCA_INICIO, marcaFim = MARCA_FIM) {
  const inicio = html.indexOf(marcaInicio);
  if (inicio === -1) {
    throw new Error(`marcador ${marcaInicio} não encontrado — nada foi escrito`);
  }
  const fim = html.indexOf(marcaFim);
  if (fim === -1) {
    throw new Error(`marcador ${marcaFim} não encontrado — nada foi escrito`);
  }
  if (fim < inicio) {
    throw new Error(`marcadores fora de ordem: ${marcaFim} aparece antes de ${marcaInicio}`);
  }

  const antes = html.slice(0, inicio + marcaInicio.length);
  const depois = html.slice(fim);
  return `${antes}\n${bloco}\n                `.concat(depois);
}
