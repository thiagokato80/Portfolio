import { t, escapar } from './texto.mjs';

function card(projeto, lang) {
  const classes = projeto.destaque ? 'project-card featured' : 'project-card';
  const rotuloLink = lang === 'en' ? 'View case study' : 'Ver estudo de caso';
  const href = lang === 'en' ? `projetos/en/${projeto.slug}.html` : `projetos/${projeto.slug}.html`;

  const tags = projeto.tags
    .map((tag) => `                                <span class="tag">${escapar(tag)}</span>`)
    .join('\n');

  const features = projeto.stack
    .slice(0, 3)
    .map(
      (item) =>
        `                                <li><i class="fas fa-check"></i> <span>${escapar(item)}</span></li>`
    )
    .join('\n');

  return `                    <article class="${classes}">
                        <div class="project-image">
                            <div class="project-icon">
                                <i class="fas ${escapar(projeto.icone)}"></i>
                            </div>
                        </div>
                        <div class="project-content">
                            <div class="project-tags">
${tags}
                            </div>
                            <h3 data-i18n="proj-${projeto.slug}-titulo">${escapar(t(projeto.titulo, lang))}</h3>
                            <p class="project-subtitulo" data-i18n="proj-${projeto.slug}-subtitulo">${escapar(t(projeto.subtitulo, lang))}</p>
                            <p data-i18n="proj-${projeto.slug}-resumo">${escapar(t(projeto.resumo, lang))}</p>
                            <ul class="project-features">
${features}
                            </ul>
                            <a href="${href}" class="project-link">
                                <span data-i18n="proj-${projeto.slug}-link">${rotuloLink}</span>
                                <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </article>`;
}

/** Gera o HTML interno do bloco de projetos do index, agrupado. */
export function blocoCards(grupos, projetos, lang = 'pt') {
  const partes = [];

  for (const grupo of grupos) {
    const doGrupo = projetos.filter((p) => p.grupo === grupo.id);
    if (doGrupo.length === 0) continue;

    partes.push(`                <div class="grupo-header">
                    <h3 class="grupo-titulo" data-i18n="grupo-${grupo.id}-titulo">${escapar(t(grupo.titulo, lang))}</h3>
                    <p class="grupo-desc" data-i18n="grupo-${grupo.id}-desc">${escapar(t(grupo.descricao, lang))}</p>
                </div>
                <div class="projects-grid">
${doGrupo.map((p) => card(p, lang)).join('\n')}
                </div>`);
  }

  return partes.join('\n');
}
