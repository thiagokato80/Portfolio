import { t, escapar, temTraducao } from './texto.mjs';
import { tempoDeLeitura } from './template-artigo.mjs';

function card(artigo, lang) {
  const rotuloLink = lang === 'en' ? 'Read article' : 'Ler artigo';
  const hrefPt = `Artigos/${artigo.slug}.html`;
  const hrefEn = temTraducao(artigo) ? `Artigos/en/${artigo.slug}.html` : hrefPt;
  const href = lang === 'en' ? hrefEn : hrefPt;
  const minutos = tempoDeLeitura(artigo, lang);
  const rotuloTempo = lang === 'en' ? `${minutos} min read` : `${minutos} min de leitura`;

  return `                    <article class="article-card">
                        <div class="article-icon"><i class="fas ${escapar(artigo.icone)}"></i></div>
                        <span class="article-tag" data-i18n="art-${artigo.slug}-tag">${escapar(t(artigo.tag, lang))}</span>
                        <h3 data-i18n="art-${artigo.slug}-titulo">${escapar(t(artigo.titulo, lang))}</h3>
                        <p class="article-summary" data-i18n="art-${artigo.slug}-lead">${escapar(t(artigo.lead, lang))}</p>
                        <p class="article-meta" data-i18n="art-${artigo.slug}-meta">${rotuloTempo}</p>
                        <a href="${href}" class="article-link" data-href-pt="${hrefPt}" data-href-en="${hrefEn}">
                            <span data-i18n="art-${artigo.slug}-link">${rotuloLink}</span> <i class="fas fa-arrow-right"></i>
                        </a>
                    </article>`;
}

/**
 * Gera o HTML interno do bloco de artigos do index.
 *
 * A ordem é por data, do mais recente ao mais antigo. O campo opcional `ordem`
 * permite rebaixar um artigo sem mexer na data de publicação — a data é registro
 * público e não se altera para efeito de vitrine. Quem não declara `ordem` vale 0,
 * então omitir o campo em todos preserva exatamente a ordenação por data.
 */
export function blocoCardsArtigos(artigos, lang = 'pt') {
  const ordem = (a) => (typeof a.ordem === 'number' ? a.ordem : 0);
  const ordenados = [...artigos].sort(
    (a, b) => ordem(a) - ordem(b) || b.data.localeCompare(a.data)
  );
  return `                <div class="articles-grid">
${ordenados.map((a) => card(a, lang)).join('\n')}
                </div>`;
}
