function escaparUrl(url) {
  return String(url).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Gera o sitemap.xml completo a partir das entradas. */
export function sitemap(entradas, hoje) {
  const urls = entradas
    .map(
      (e) => `  <url>
    <loc>${escaparUrl(e.loc)}</loc>
    <lastmod>${hoje}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join('\n');

  const corpo = urls === '' ? '\n' : `\n${urls}\n`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${corpo}</urlset>
`;
}
