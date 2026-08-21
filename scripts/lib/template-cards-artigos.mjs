import { t, escapar } from './texto.mjs';
import { tempoDeLeitura } from './template-artigo.mjs';

function card(artigo, lang) {
  const rotuloLink = lang === 'en' ? 'Read article' : 'Ler artigo';
  const href = lang === 'en' ? `Artigos/en/${artigo.slug}.html` : `Artigos/${artigo.slug}.html`;
  const minutos = tempoDeLeitura(artigo, lang);
  const rotuloTempo = lang === 'en' ? `${minutos} min read` : `${minutos} min de leitura`;

  return `                    <article class="article-card">
                        <div class="article-icon"><i class="fas ${escapar(artigo.icone)}"></i></div>
                        <span class="article-tag">${escapar(t(artigo.tag, lang))}</span>
                        <h3>${escapar(t(artigo.titulo, lang))}</h3>
                        <p class="article-summary">${escapar(t(artigo.lead, lang))}</p>
                        <p class="article-meta">${rotuloTempo}</p>
                        <a href="${href}" class="article-link">
                            <span>${rotuloLink}</span> <i class="fas fa-arrow-right"></i>
                        </a>
                    </article>`;
}

/** Gera o HTML interno do bloco de artigos do index, do mais recente ao mais antigo. */
export function blocoCardsArtigos(artigos, lang = 'pt') {
  const ordenados = [...artigos].sort((a, b) => b.data.localeCompare(a.data));
  return `                <div class="articles-grid">
${ordenados.map((a) => card(a, lang)).join('\n')}
                </div>`;
}
