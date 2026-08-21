import { t } from './texto.mjs';

/** Converte o HTML restrito dos campos "corpo" em texto corrido de uma linha. */
function semHtml(html) {
  return String(html || '')
    .replace(/<\/(p|li|ul|h[1-6])>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function secao(projeto, id, lang) {
  const s = projeto.secoes.find((x) => x.id === id);
  return s ? semHtml(t(s.corpo, lang)) : '';
}

function linhaAutoria(projeto, lang) {
  const nota = t(projeto.autoria.nota, lang);
  return nota ? `${projeto.autoria.tipo} — ${nota}` : projeto.autoria.tipo;
}

/** Gera o PROJETOS.md completo — insumo para currículo e LinkedIn. */
export function fichas(dados, lang = 'pt') {
  const cabecalho = `# Projetos — fichas técnicas

> Arquivo gerado por \`node scripts/gerar.mjs\` a partir de \`data/projetos.json\`.
> Não editar à mão: as alterações são sobrescritas na próxima geração.
`;

  const corpo = dados.projetos
    .map((p) => {
      const resultado = secao(p, 'resultado', lang) || 'sem métrica medida';
      return `## ${t(p.titulo, lang)}
- Uma linha: ${t(p.subtitulo, lang)}
- Problema: ${secao(p, 'problema', lang)}
- Arquitetura: ${secao(p, 'solucao', lang)}
- Stack: ${p.stack.join(', ')}
- Resultado: ${resultado}
- Status: ${t(p.status, lang)}
- Autoria: ${linhaAutoria(p, lang)}`;
    })
    .join('\n\n');

  return `${cabecalho}\n${corpo}\n`;
}
