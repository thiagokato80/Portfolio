import test from 'node:test';
import assert from 'node:assert/strict';
import { sitemap } from './sitemap.mjs';

const entradas = [
  { loc: 'https://exemplo.com/', priority: '1.0', changefreq: 'monthly' },
  { loc: 'https://exemplo.com/projetos/match-hub.html', priority: '0.8', changefreq: 'monthly' },
];

test('gera XML válido com todas as entradas', () => {
  const xml = sitemap(entradas, '2026-08-21');
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(xml, /<loc>https:\/\/exemplo\.com\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/exemplo\.com\/projetos\/match-hub\.html<\/loc>/);
  assert.match(xml, /<\/urlset>\s*$/);
});

test('usa a data recebida em todos os lastmod', () => {
  const xml = sitemap(entradas, '2026-08-21');
  assert.equal((xml.match(/<lastmod>2026-08-21<\/lastmod>/g) || []).length, 2);
});

test('escapa & na URL', () => {
  const xml = sitemap([{ loc: 'https://exemplo.com/?a=1&b=2', priority: '0.5', changefreq: 'yearly' }], '2026-08-21');
  assert.match(xml, /a=1&amp;b=2/);
});

test('lista vazia gera urlset vazio e válido', () => {
  const xml = sitemap([], '2026-08-21');
  assert.match(xml, /<urlset[^>]*>\s*<\/urlset>/);
});
