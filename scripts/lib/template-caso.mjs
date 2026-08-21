import { t, escapar, temTraducao } from './texto.mjs';

const SITE_PADRAO = 'https://thiagokato.github.io/Portfolio';

const SCRIPT_TEMA = `<script>
(function () {
  try {
    var tema = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', tema);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
</script>`;

function urlPagina(site, slug, lang) {
  return lang === 'en' ? `${site}/projetos/en/${slug}.html` : `${site}/projetos/${slug}.html`;
}

function blocoNumeros(projeto, lang) {
  if (!projeto.numeros.length) return '';
  const itens = projeto.numeros
    .map(
      (n) => `        <div class="caso-numero">
          <span class="caso-numero-valor">${escapar(n.valor)}</span>
          <span class="caso-numero-rotulo">${escapar(t(n.rotulo, lang))}</span>
        </div>`
    )
    .join('\n');
  return `      <div class="caso-numeros">\n${itens}\n      </div>\n`;
}

function blocoSecoes(projeto, lang) {
  return projeto.secoes
    .map(
      (s) => `      <section class="caso-secao" id="${escapar(s.id)}">
        <h2>${escapar(t(s.titulo, lang))}</h2>
        ${t(s.corpo, lang)}
      </section>`
    )
    .join('\n');
}

function blocoStack(projeto) {
  const itens = projeto.stack.map((s) => `          <li>${escapar(s)}</li>`).join('\n');
  return `      <section class="caso-secao" id="stack">
        <h2>Stack</h2>
        <ul class="caso-stack">
${itens}
        </ul>
      </section>`;
}

function blocoPdf(projeto, lang, prefixo) {
  if (!projeto.pdf) return '';
  const legenda = lang === 'en' ? 'Download the full PDF' : 'Baixar o PDF completo';
  const titulo = lang === 'en' ? 'Full document' : 'Documento completo';
  const caminho = `${prefixo}${projeto.pdf}`;
  return `      <section class="caso-secao" id="documento">
        <h2>${titulo}</h2>
        <iframe src="${escapar(caminho)}" class="caso-pdf" title="${escapar(t(projeto.titulo, lang))}" loading="lazy"></iframe>
        <p><a class="project-link" href="${escapar(caminho)}" target="_blank" rel="noopener">
          <span>${legenda}</span> <i class="fas fa-download"></i>
        </a></p>
      </section>`;
}

/** Gera o HTML completo de uma página de caso. */
export function paginaCaso(projeto, opcoes = {}) {
  const { lang = 'pt', site = SITE_PADRAO } = opcoes;
  const prefixo = lang === 'en' ? '../../' : '../';
  const url = urlPagina(site, projeto.slug, lang);
  const urlPt = urlPagina(site, projeto.slug, 'pt');
  const urlEn = urlPagina(site, projeto.slug, 'en');

  const traduzido = temTraducao(projeto);
  const alternates = traduzido
    ? `  <link rel="alternate" hreflang="pt-BR" href="${urlPt}">
  <link rel="alternate" hreflang="en" href="${urlEn}">
  <link rel="alternate" hreflang="x-default" href="${urlPt}">
`
    : '';
  const alternador = traduzido
    ? `          <li class="lang-switch"><a href="${lang === 'en' ? '../' + projeto.slug + '.html' : 'en/' + projeto.slug + '.html'}">${lang === 'en' ? 'Português' : 'English'}</a></li>
`
    : '';

  const titulo = escapar(t(projeto.titulo, lang));
  const subtitulo = escapar(t(projeto.subtitulo, lang));
  const resumo = escapar(t(projeto.resumo, lang));
  const seoTitle = escapar(t(projeto.seo.title, lang));
  const seoDesc = escapar(t(projeto.seo.description, lang));
  const status = escapar(t(projeto.status, lang));

  const rotuloVoltar = lang === 'en' ? 'Back to portfolio' : 'Voltar ao portfólio';
  const ctaTitulo = lang === 'en' ? 'Need something like this?' : 'Precisa de algo parecido?';
  const ctaTexto =
    lang === 'en'
      ? 'I build systems like this one end to end — architecture, implementation and delivery.'
      : 'Construo sistemas como este de ponta a ponta — arquitetura, implementação e entrega.';
  const ctaBotao = lang === 'en' ? 'Start a conversation' : 'Vamos conversar';

  const tags = (projeto.tags[lang] || projeto.tags.pt).map((tag) => `          <span class="tag">${escapar(tag)}</span>`).join('\n');

  const jsonLd = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          name: t(projeto.titulo, lang),
          description: t(projeto.seo.description, lang),
          applicationCategory: 'BusinessApplication',
          url,
          author: { '@type': 'Person', name: 'Thiago Seiki Kato', url: `${site}/` },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Portfólio', item: `${site}/` },
            { '@type': 'ListItem', position: 2, name: t(projeto.titulo, lang), item: url },
          ],
        },
      ],
    },
    null,
    2
  );

  return `<!DOCTYPE html>
<html lang="${lang === 'en' ? 'en' : 'pt-BR'}" data-theme="dark">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${seoDesc}">
  <meta name="author" content="Thiago Seiki Kato">
  <meta name="robots" content="index, follow">

  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${seoTitle}">
  <meta property="og:description" content="${seoDesc}">
  <meta property="og:image" content="${site}/Currículo/Foto.jpg">

  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:title" content="${seoTitle}">
  <meta property="twitter:description" content="${seoDesc}">

  <title>${seoTitle}</title>

  <link rel="canonical" href="${url}">
${alternates}  <link rel="stylesheet" href="${prefixo}styles.css">
  <link rel="icon" type="image/png" href="${prefixo}favicon.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <script type="application/ld+json">
${jsonLd}
  </script>
  ${SCRIPT_TEMA}
</head>

<body>
  <header>
    <nav>
      <div class="nav-container">
        <a href="${prefixo}index.html" class="logo">
          <span class="logo-bracket">[</span>TSK<span class="logo-bracket">]</span>
        </a>
        <ul class="nav-links">
          <li><a href="${prefixo}index.html#projects">${rotuloVoltar}</a></li>
${alternador}        </ul>
      </div>
    </nav>
  </header>

  <main class="container caso">
    <article>
      <div class="caso-hero">
        <div class="caso-hero-icone"><i class="fas ${escapar(projeto.icone)}"></i></div>
        <span class="status-badge">${status}</span>
        <h1>${titulo}</h1>
        <p class="caso-subtitulo">${subtitulo}</p>
        <p class="about-lead">${resumo}</p>
        <div class="project-tags">
${tags}
        </div>
      </div>

${blocoNumeros(projeto, lang)}${blocoSecoes(projeto, lang)}
${blocoStack(projeto)}
${blocoPdf(projeto, lang, prefixo)}
      <section class="caso-cta">
        <h2>${ctaTitulo}</h2>
        <p>${ctaTexto}</p>
        <a class="project-link" href="${prefixo}index.html#contact">
          <span>${ctaBotao}</span> <i class="fas fa-arrow-right"></i>
        </a>
      </section>
    </article>
  </main>

  <footer>
    <p>© 2026 Thiago Seiki Kato</p>
  </footer>
</body>

</html>
`;
}
