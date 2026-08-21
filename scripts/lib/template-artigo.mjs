import { t, escapar, temTraducao } from './texto.mjs';

const SITE_PADRAO = 'https://thiagokato.github.io/Portfolio';
const PALAVRAS_POR_MINUTO = 200;
const MIN_SECOES_PARA_SUMARIO = 5;

const MESES_PT = ['janeiro','fevereiro','março','abril','maio','junho',
                  'julho','agosto','setembro','outubro','novembro','dezembro'];
const MESES_EN = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];

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

function semTags(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ');
}

/** Minutos de leitura, a partir da contagem de palavras do corpo. Sempre >= 1. */
export function tempoDeLeitura(artigo, lang = 'pt') {
  const texto = artigo.secoes.map((s) => semTags(t(s.corpo, lang))).join(' ');
  const palavras = texto.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(palavras / PALAVRAS_POR_MINUTO));
}

function dataLegivel(iso, lang) {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return lang === 'en'
    ? `${MESES_EN[mes - 1]} ${dia}, ${ano}`
    : `${dia} de ${MESES_PT[mes - 1]} de ${ano}`;
}

function urlPagina(site, slug, lang) {
  return lang === 'en' ? `${site}/Artigos/en/${slug}.html` : `${site}/Artigos/${slug}.html`;
}

function blocoSumario(artigo, lang) {
  if (artigo.secoes.length < MIN_SECOES_PARA_SUMARIO) return '';
  const titulo = lang === 'en' ? 'In this article' : 'Neste artigo';
  const itens = artigo.secoes
    .map((s) => `          <li><a href="#${escapar(s.id)}">${escapar(t(s.titulo, lang))}</a></li>`)
    .join('\n');
  return `      <nav class="artigo-sumario" aria-label="${titulo}">
        <h2>${titulo}</h2>
        <ul>
${itens}
        </ul>
      </nav>
`;
}

function blocoSecoes(artigo, lang) {
  return artigo.secoes
    .map(
      (s) => `      <section class="artigo-secao" id="${escapar(s.id)}">
        <h2>${escapar(t(s.titulo, lang))}</h2>
        ${t(s.corpo, lang)}
      </section>`
    )
    .join('\n');
}

function blocoPdf(artigo, lang, prefixo) {
  if (!artigo.pdf) return '';
  const legenda = lang === 'en' ? 'Download the original PDF' : 'Baixar o PDF original';
  const caminho = `${prefixo}${artigo.pdf}`;
  return `      <p class="artigo-pdf"><a class="article-link" href="${escapar(caminho)}" target="_blank" rel="noopener">
        <span>${legenda}</span> <i class="fas fa-download"></i>
      </a></p>
`;
}

/** Gera o HTML completo de uma página de artigo. */
export function paginaArtigo(artigo, opcoes = {}) {
  const { lang = 'pt', site = SITE_PADRAO } = opcoes;
  const prefixo = lang === 'en' ? '../../' : '../';
  const url = urlPagina(site, artigo.slug, lang);
  const urlPt = urlPagina(site, artigo.slug, 'pt');
  const urlEn = urlPagina(site, artigo.slug, 'en');

  const traduzido = temTraducao(artigo);
  const alternates = traduzido
    ? `  <link rel="alternate" hreflang="pt-BR" href="${urlPt}">
  <link rel="alternate" hreflang="en" href="${urlEn}">
  <link rel="alternate" hreflang="x-default" href="${urlPt}">
`
    : '';
  const alternador = traduzido
    ? `          <li class="lang-switch"><a href="${lang === 'en' ? '../' + artigo.slug + '.html' : 'en/' + artigo.slug + '.html'}">${lang === 'en' ? 'Português' : 'English'}</a></li>
`
    : '';

  const titulo = escapar(t(artigo.titulo, lang));
  const lead = escapar(t(artigo.lead, lang));
  const tag = escapar(t(artigo.tag, lang));
  const seoTitle = escapar(t(artigo.seo.title, lang));
  const seoDesc = escapar(t(artigo.seo.description, lang));

  const minutos = tempoDeLeitura(artigo, lang);
  const rotuloTempo = lang === 'en' ? `${minutos} min read` : `${minutos} min de leitura`;
  const rotuloVoltar = lang === 'en' ? 'Back to portfolio' : 'Voltar ao portfólio';
  const ctaTitulo = lang === 'en' ? 'Want to discuss this?' : 'Quer conversar sobre isso?';
  const ctaTexto =
    lang === 'en'
      ? 'I work with supply chain, AI and custom systems — from diagnosis to delivery.'
      : 'Trabalho com supply chain, IA e sistemas sob medida — do diagnóstico à entrega.';
  const ctaBotao = lang === 'en' ? 'Start a conversation' : 'Vamos conversar';

  const jsonLd = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: t(artigo.titulo, lang),
          description: t(artigo.seo.description, lang),
          datePublished: artigo.data,
          dateModified: artigo.data,
          url,
          inLanguage: lang === 'en' ? 'en' : 'pt-BR',
          author: { '@type': 'Person', name: 'Thiago Seiki Kato', url: `${site}/` },
          publisher: { '@type': 'Person', name: 'Thiago Seiki Kato' },
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Portfólio', item: `${site}/` },
            { '@type': 'ListItem', position: 2, name: t(artigo.titulo, lang), item: url },
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
  <meta property="article:published_time" content="${artigo.data}">

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
          <li><a href="${prefixo}index.html#articles">${rotuloVoltar}</a></li>
${alternador}        </ul>
      </div>
    </nav>
  </header>

  <main class="container artigo">
    <article>
      <div class="artigo-hero">
        <span class="article-tag">${tag}</span>
        <h1>${titulo}</h1>
        <p class="artigo-lead">${lead}</p>
        <p class="artigo-meta">
          <time datetime="${artigo.data}">${dataLegivel(artigo.data, lang)}</time>
          <span class="artigo-sep">·</span>
          <span>${rotuloTempo}</span>
        </p>
      </div>

${blocoSumario(artigo, lang)}${blocoSecoes(artigo, lang)}

${blocoPdf(artigo, lang, prefixo)}      <section class="caso-cta">
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
