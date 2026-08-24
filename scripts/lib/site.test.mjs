import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from './site.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// O bug que motivou este teste: o site declarava canonical em
// thiagokato.github.io enquanto o repositorio e servido de
// thiagokato80.github.io. Cada pagina apontava sua versao oficial para outro
// dominio, e o sitemap listava URLs de host diferente do que o serve.
test('SITE corresponde ao host que o GitHub Pages serve para este repositório', () => {
  const remote = execFileSync('git', ['remote', 'get-url', 'origin'], { cwd: RAIZ, encoding: 'utf8' }).trim();
  const m = remote.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
  assert.ok(m, `remote não reconhecido: ${remote}`);
  const [, dono, repo] = m;
  assert.equal(SITE, `https://${dono}.github.io/${repo}`);
});

test('nenhuma página gerada referencia outro host github.io', () => {
  const hostCerto = new URL(SITE).host;
  const problemas = [];
  for (const dir of ['projetos', 'projetos/en', 'Artigos', 'Artigos/en']) {
    const caminho = join(RAIZ, dir);
    if (!existsSync(caminho)) continue;
    for (const f of readdirSync(caminho).filter((x) => x.endsWith('.html'))) {
      const html = readFileSync(join(caminho, f), 'utf8');
      for (const m of html.matchAll(/https:\/\/([a-z0-9-]+\.github\.io)/g)) {
        if (m[1] !== hostCerto) problemas.push(`${dir}/${f}: ${m[1]}`);
      }
    }
  }
  assert.deepEqual(problemas, []);
});

test('index, sitemap e robots usam o host correto', () => {
  const hostCerto = new URL(SITE).host;
  for (const arq of ['index.html', 'sitemap.xml', 'robots.txt']) {
    const conteudo = readFileSync(join(RAIZ, arq), 'utf8');
    for (const m of conteudo.matchAll(/https:\/\/([a-z0-9-]+\.github\.io)/g)) {
      assert.equal(m[1], hostCerto, `${arq} referencia ${m[1]}`);
    }
  }
});
