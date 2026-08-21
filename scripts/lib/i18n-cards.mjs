import { t } from './texto.mjs';
import { tempoDeLeitura } from './template-artigo.mjs';

const IDIOMAS = ['pt', 'en'];

const ROTULOS = {
  pt: { verCaso: 'Ver estudo de caso', lerArtigo: 'Ler artigo', leitura: (m) => `${m} min de leitura` },
  en: { verCaso: 'View case study', lerArtigo: 'Read article', leitura: (m) => `${m} min read` },
};

/**
 * Monta o dicionário de traduções dos cards gerados, nos dois idiomas.
 * Campo sem "en" cai para o português via t(), para o card nunca ficar vazio.
 */
export function traducoesCards(grupos, projetos, artigos) {
  const d = { pt: {}, en: {} };

  for (const lang of IDIOMAS) {
    const r = ROTULOS[lang];

    for (const g of grupos) {
      d[lang][`grupo-${g.id}-titulo`] = t(g.titulo, lang);
      d[lang][`grupo-${g.id}-desc`] = t(g.descricao, lang);
    }

    for (const p of projetos) {
      d[lang][`proj-${p.slug}-titulo`] = t(p.titulo, lang);
      d[lang][`proj-${p.slug}-subtitulo`] = t(p.subtitulo, lang);
      d[lang][`proj-${p.slug}-resumo`] = t(p.resumo, lang);
      d[lang][`proj-${p.slug}-link`] = r.verCaso;
    }

    for (const a of artigos) {
      d[lang][`art-${a.slug}-tag`] = t(a.tag, lang);
      d[lang][`art-${a.slug}-titulo`] = t(a.titulo, lang);
      d[lang][`art-${a.slug}-lead`] = t(a.lead, lang);
      d[lang][`art-${a.slug}-meta`] = r.leitura(tempoDeLeitura(a, lang));
      d[lang][`art-${a.slug}-link`] = r.lerArtigo;
    }
  }

  return d;
}

/** Serializa o dicionário como arquivo JS carregado pelo index. */
export function arquivoTraducoes(dicionario) {
  return `// gerado por scripts/gerar.mjs a partir de data/*.json — não editar à mão
window.TRADUCOES_GERADAS = ${JSON.stringify(dicionario, null, 2)};
`;
}
