# Páginas de Caso do Portfólio — Plano de Implementação (Fase 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gerar 12 páginas de caso HTML estáticas e indexáveis a partir de um único arquivo de dados, que também produz o bloco de cards do `index.html` e o `sitemap.xml`.

**Architecture:** `data/projetos.json` é a fonte de verdade. `scripts/gerar.mjs` orquestra módulos puros em `scripts/lib/` que transformam dados em strings HTML; a escrita em disco acontece só no orquestrador. `scripts/verificar.mjs` valida a saída. Nada roda em produção — o GitHub Pages serve os arquivos gerados.

**Tech Stack:** Node.js ≥ 18 (ESM, `node:fs`, `node:test`, `node:assert`). Zero dependências externas. HTML/CSS estáticos existentes.

**Spec:** `docs/superpowers/specs/2026-08-21-portfolio-paginas-de-caso-design.md`

## Global Constraints

- **Zero dependências.** Nenhum `npm install`, nenhum `package.json`, nenhum `node_modules` neste repositório. Só a biblioteca padrão do Node.
- **Módulos ESM** com extensão `.mjs`. Testes com `node:test` + `node:assert/strict`, executados por `node --test "scripts/**/*.test.mjs"`.
- **Todo campo textual no JSON é `{ "pt": "...", "en": "" }`.** O `en` fica vazio na Fase 1, mas o campo existe. Nenhuma string solta.
- **`t(campo, lang)` faz fallback para `pt`** quando `en` está vazio. Nunca renderiza string vazia por falta de tradução.
- **Site base:** `https://thiagokato.github.io/Portfolio` (sem barra final nas concatenações).
- **Marcadores obrigatórios:** `<!-- PROJETOS:INICIO -->` e `<!-- PROJETOS:FIM -->`. Se faltarem, o gerador lança erro e não escreve nada.
- **Páginas de caso não carregam `script.js`** — só um script inline de tema.
- **Confidencialidade:** nome do projeto com cliente descrito genericamente. Nenhuma razão social, nenhum dado de cliente.
- **Fatos vêm do repositório.** Todo número publicado tem que existir no repo de origem (tabela na spec).
- **Grupos válidos:** `plataformas`, `supplychain`, `laboratorio`.
- **Autorias válidas:** `autoral`, `sob contrato`, `desenvolvido internamente`.
- **Match Hub e Supply Chain Pipeline Builder são `autoral`.** A redação nunca pode
  sugerir encomenda: proibido "desenvolvido para a empresa", "projeto da empresa"
  ou o nome de qualquer empregador. Ambos foram desenvolvidos fora do contexto de
  trabalho e depois apresentados para adoção — `autoria.nota` registra isso.
- **"sem métrica medida"** é a string literal quando não há número real. Nunca
  estimar, arredondar ou inventar métrica.

---

### Task 1: Fundação — helpers de texto e carga de dados

**Files:**
- Create: `scripts/lib/texto.mjs`
- Create: `scripts/lib/texto.test.mjs`
- Create: `scripts/lib/dados.mjs`
- Create: `scripts/lib/dados.test.mjs`
- Create: `data/projetos.json`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `texto.mjs`: `t(campo, lang = 'pt') -> string`, `escapar(s) -> string`
  - `dados.mjs`: `validar(dados) -> string[]` (lista de erros; vazia = válido), `carregar(caminho) -> {grupos, projetos}` (lança `Error` se inválido), `GRUPOS_VALIDOS` e `AUTORIAS_VALIDAS` (arrays de strings)

- [ ] **Step 1: Escrever o teste que falha para `texto.mjs`**

```js
// scripts/lib/texto.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { t, escapar } from './texto.mjs';

test('t devolve o idioma pedido', () => {
  assert.equal(t({ pt: 'Olá', en: 'Hello' }, 'en'), 'Hello');
});

test('t cai para pt quando en está vazio', () => {
  assert.equal(t({ pt: 'Olá', en: '' }, 'en'), 'Olá');
});

test('t cai para pt quando en está ausente', () => {
  assert.equal(t({ pt: 'Olá' }, 'en'), 'Olá');
});

test('t sem lang usa pt', () => {
  assert.equal(t({ pt: 'Olá', en: 'Hello' }), 'Olá');
});

test('t com campo indefinido devolve string vazia', () => {
  assert.equal(t(undefined, 'pt'), '');
});

test('escapar neutraliza HTML', () => {
  assert.equal(escapar('<a href="x">&</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
});

test('escapar aceita não-string', () => {
  assert.equal(escapar(42), '42');
  assert.equal(escapar(null), '');
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `node --test "scripts/**/*.test.mjs"lib/texto.test.mjs`
Expected: FAIL — `Cannot find module .../texto.mjs`

- [ ] **Step 3: Implementar `texto.mjs`**

```js
// scripts/lib/texto.mjs

/** Extrai o texto de um campo {pt, en}, com fallback para pt. */
export function t(campo, lang = 'pt') {
  if (!campo) return '';
  const valor = campo[lang];
  if (typeof valor === 'string' && valor.trim() !== '') return valor;
  return typeof campo.pt === 'string' ? campo.pt : '';
}

/** Escapa texto para interpolação segura em HTML. */
export function escapar(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `node --test "scripts/**/*.test.mjs"lib/texto.test.mjs`
Expected: PASS — 7 testes.

- [ ] **Step 5: Escrever o teste que falha para `dados.mjs`**

```js
// scripts/lib/dados.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { validar } from './dados.mjs';

function projetoValido(extra = {}) {
  return {
    slug: 'match-hub',
    grupo: 'plataformas',
    destaque: true,
    icone: 'fa-hospital',
    titulo: { pt: 'Match Hub', en: '' },
    subtitulo: { pt: 'Sub', en: '' },
    resumo: { pt: 'Resumo', en: '' },
    tags: ['GCP'],
    stack: ['Python'],
    numeros: [],
    secoes: [{ id: 'problema', titulo: { pt: 'O problema', en: '' }, corpo: { pt: '<p>x</p>', en: '' } }],
    pdf: null,
    status: { pt: 'Em produção', en: '' },
    autoria: { tipo: 'autoral', nota: { pt: 'Projeto autoral.', en: '' } },
    seo: { title: { pt: 'Match Hub', en: '' }, description: { pt: 'desc', en: '' } },
    ...extra,
  };
}

function dadosValidos(projetos) {
  return {
    grupos: [{ id: 'plataformas', titulo: { pt: 'Plataformas', en: '' }, descricao: { pt: 'd', en: '' } }],
    projetos,
  };
}

test('dados válidos não produzem erro', () => {
  assert.deepEqual(validar(dadosValidos([projetoValido()])), []);
});

test('slug duplicado é erro', () => {
  const erros = validar(dadosValidos([projetoValido(), projetoValido()]));
  assert.equal(erros.length, 1);
  assert.match(erros[0], /slug duplicado: match-hub/);
});

test('grupo desconhecido é erro', () => {
  const erros = validar(dadosValidos([projetoValido({ grupo: 'inventado' })]));
  assert.match(erros[0], /grupo inválido/);
});

test('campo obrigatório ausente é erro', () => {
  const p = projetoValido();
  delete p.seo;
  assert.match(validar(dadosValidos([p]))[0], /seo/);
});

test('campo de texto sem pt é erro', () => {
  const erros = validar(dadosValidos([projetoValido({ titulo: { pt: '', en: '' } })]));
  assert.match(erros[0], /titulo.*pt/);
});

test('slug com caractere inválido é erro', () => {
  const erros = validar(dadosValidos([projetoValido({ slug: 'Match Hub!' })]));
  assert.match(erros[0], /slug inválido/);
});

test('autoria com tipo desconhecido é erro', () => {
  const erros = validar(dadosValidos([projetoValido({ autoria: { tipo: 'inventado', nota: { pt: 'x', en: '' } } })]));
  assert.match(erros[0], /autoria\.tipo inválido/);
});

test('autoria ausente é erro', () => {
  const p = projetoValido();
  delete p.autoria;
  assert.match(validar(dadosValidos([p]))[0], /autoria/);
});

test('grupo declarado sem projeto não é erro', () => {
  const d = dadosValidos([projetoValido()]);
  d.grupos.push({ id: 'laboratorio', titulo: { pt: 'Lab', en: '' }, descricao: { pt: 'd', en: '' } });
  assert.deepEqual(validar(d), []);
});
```

- [ ] **Step 6: Rodar e confirmar que falha**

Run: `node --test "scripts/**/*.test.mjs"lib/dados.test.mjs`
Expected: FAIL — módulo inexistente.

- [ ] **Step 7: Implementar `dados.mjs`**

```js
// scripts/lib/dados.mjs
import { readFileSync } from 'node:fs';

export const GRUPOS_VALIDOS = ['plataformas', 'supplychain', 'laboratorio'];
export const AUTORIAS_VALIDAS = ['autoral', 'sob contrato', 'desenvolvido internamente'];

const CAMPOS_TEXTO = ['titulo', 'subtitulo', 'resumo', 'status'];
const CAMPOS_ARRAY = ['tags', 'stack', 'numeros', 'secoes'];

function erroCampoTexto(campo, nome, slug) {
  if (!campo || typeof campo !== 'object') return `${slug}: campo "${nome}" ausente`;
  if (typeof campo.pt !== 'string' || campo.pt.trim() === '') {
    return `${slug}: campo "${nome}" precisa de "pt" não vazio`;
  }
  if (!('en' in campo)) return `${slug}: campo "${nome}" precisa da chave "en" (pode ser "")`;
  return null;
}

/** Valida a estrutura carregada. Devolve lista de erros — vazia significa válido. */
export function validar(dados) {
  const erros = [];

  if (!dados || !Array.isArray(dados.projetos)) {
    return ['arquivo precisa de um array "projetos"'];
  }
  if (!Array.isArray(dados.grupos)) {
    erros.push('arquivo precisa de um array "grupos"');
  }

  const vistos = new Set();
  for (const p of dados.projetos) {
    const slug = p?.slug ?? '(sem slug)';

    if (typeof p.slug !== 'string' || !/^[a-z0-9-]+$/.test(p.slug)) {
      erros.push(`${slug}: slug inválido — use apenas a-z, 0-9 e hífen`);
    } else if (vistos.has(p.slug)) {
      erros.push(`slug duplicado: ${p.slug}`);
    } else {
      vistos.add(p.slug);
    }

    if (!GRUPOS_VALIDOS.includes(p.grupo)) {
      erros.push(`${slug}: grupo inválido "${p.grupo}" — use ${GRUPOS_VALIDOS.join(', ')}`);
    }

    for (const nome of CAMPOS_TEXTO) {
      const e = erroCampoTexto(p[nome], nome, slug);
      if (e) erros.push(e);
    }

    for (const nome of CAMPOS_ARRAY) {
      if (!Array.isArray(p[nome])) erros.push(`${slug}: campo "${nome}" precisa ser array`);
    }

    if (!p.seo) {
      erros.push(`${slug}: campo "seo" ausente`);
    } else {
      for (const nome of ['title', 'description']) {
        const e = erroCampoTexto(p.seo[nome], `seo.${nome}`, slug);
        if (e) erros.push(e);
      }
    }

    if (Array.isArray(p.secoes)) {
      for (const [i, s] of p.secoes.entries()) {
        if (typeof s?.id !== 'string') erros.push(`${slug}: secoes[${i}] precisa de "id"`);
        for (const nome of ['titulo', 'corpo']) {
          const e = erroCampoTexto(s?.[nome], `secoes[${i}].${nome}`, slug);
          if (e) erros.push(e);
        }
      }
    }

    if (p.pdf !== null && typeof p.pdf !== 'string') {
      erros.push(`${slug}: "pdf" precisa ser caminho string ou null`);
    }

    if (!p.autoria) {
      erros.push(`${slug}: campo "autoria" ausente`);
    } else if (!AUTORIAS_VALIDAS.includes(p.autoria.tipo)) {
      erros.push(
        `${slug}: autoria.tipo inválido "${p.autoria.tipo}" — use ${AUTORIAS_VALIDAS.join(', ')}`
      );
    } else {
      const e = erroCampoTexto(p.autoria.nota, 'autoria.nota', slug);
      if (e) erros.push(e);
    }
  }

  return erros;
}

/** Lê e valida o arquivo de dados. Lança Error listando todos os problemas. */
export function carregar(caminho) {
  const bruto = readFileSync(caminho, 'utf8');
  let dados;
  try {
    dados = JSON.parse(bruto);
  } catch (e) {
    throw new Error(`${caminho}: JSON inválido — ${e.message}`);
  }
  const erros = validar(dados);
  if (erros.length > 0) {
    throw new Error(`${caminho}: ${erros.length} problema(s)\n  - ${erros.join('\n  - ')}`);
  }
  return dados;
}
```

- [ ] **Step 8: Rodar e confirmar que passa**

Run: `node --test "scripts/**/*.test.mjs"lib/dados.test.mjs`
Expected: PASS — 9 testes.

- [ ] **Step 9: Criar `data/projetos.json` com os grupos e o primeiro projeto real**

O conteúdo vem de `~/projects/tsk/s4m/match-hub/README.md` e `CHANGELOG.md`. Os 11 projetos restantes entram na Task 9.

```json
{
  "grupos": [
    {
      "id": "plataformas",
      "titulo": { "pt": "Plataformas de Negócio", "en": "" },
      "descricao": { "pt": "Sistemas em operação, construídos para empresas e suas equipes.", "en": "" }
    },
    {
      "id": "supplychain",
      "titulo": { "pt": "Supply Chain & Inteligência de Decisão", "en": "" },
      "descricao": { "pt": "Simulação, previsão e análise para cadeias de suprimento.", "en": "" }
    },
    {
      "id": "laboratorio",
      "titulo": { "pt": "Laboratório de Agentes de IA", "en": "" },
      "descricao": { "pt": "Onde eu testo modelos, protocolos e arquiteturas antes de levá-los para produção.", "en": "" }
    }
  ],
  "projetos": [
    {
      "slug": "match-hub",
      "grupo": "plataformas",
      "destaque": true,
      "icone": "fa-hospital",
      "titulo": { "pt": "Match Hub", "en": "" },
      "subtitulo": { "pt": "Padronização e matching de insumos hospitalares com IA", "en": "" },
      "resumo": { "pt": "Plataforma SaaS multi-tenant que normaliza descrições de insumos hospitalares com LLM, gera embeddings semânticos e encontra itens equivalentes entre catálogos que nunca falaram a mesma língua.", "en": "" },
      "tags": ["Multi-tenant", "Vertex AI", "GCP"],
      "stack": ["Python 3.12", "FastAPI", "Cloud Run", "Firestore", "Vertex AI Vector Search", "Gemini Flash", "React 19", "Cloud Tasks"],
      "numeros": [
        { "valor": "193", "rotulo": { "pt": "testes automatizados", "en": "" } },
        { "valor": "768", "rotulo": { "pt": "dimensões por embedding", "en": "" } },
        { "valor": "2", "rotulo": { "pt": "serviços Cloud Run, mesma imagem", "en": "" } }
      ],
      "secoes": [
        {
          "id": "problema",
          "titulo": { "pt": "O problema", "en": "" },
          "corpo": { "pt": "<p>Cada hospital, distribuidor e fabricante descreve o mesmo item de um jeito. \"Seringa 10ml BD\", \"SER DESC 10 ML\", \"seringa descartável 10 mL c/ agulha\" são o mesmo produto para um comprador e três produtos diferentes para um ERP.</p><p>Sem um catálogo comum, não existe comparação de preço confiável, consolidação de compra nem análise de consumo. A padronização manual não escala: um catálogo de dezenas de milhares de itens consome meses de trabalho especializado e desatualiza enquanto é feito.</p>", "en": "" }
        },
        {
          "id": "solucao",
          "titulo": { "pt": "A solução", "en": "" },
          "corpo": { "pt": "<p>O Match Hub normaliza a descrição com <strong>Gemini Flash</strong>, gera um embedding de 768 dimensões com <code>text-multilingual-embedding-002</code> e busca similares no <strong>Vertex AI Vector Search</strong>. Um segundo passe de LLM re-ranqueia os candidatos, e o que fica ambíguo vai para uma fila de curadoria humana em vez de virar um match errado silencioso.</p><ul><li><strong>Multi-tenant com isolamento por chave de API</strong> — cada cliente enxerga apenas a própria base.</li><li><strong>Catálogo canônico central</strong>, curado pela holding, com fluxo de proposta e aprovação.</li><li><strong>Importação assíncrona</strong> via Cloud Tasks, em lotes de 5.000 itens, sem travar a API.</li><li><strong>Conector pull para ERP</strong> — o Hub puxa o catálogo do cliente e para em revisão, em vez de processar tudo automaticamente.</li><li><strong>Promoção de itens entre bases</strong> reaproveita descrição, embedding e categoria já processados, sem reprocessar no LLM e sem cobrar duas vezes.</li></ul><p>Em produção são dois serviços Cloud Run a partir da mesma imagem, separados pela variável <code>SERVICE_ROLE</code>: um atende requisições, o outro consome a fila.</p>", "en": "" }
        },
        {
          "id": "resultado",
          "titulo": { "pt": "Resultado", "en": "" },
          "corpo": { "pt": "<p>A padronização de um catálogo inteiro passou de projeto de meses para execução assíncrona acompanhada em tela. O trabalho humano deixou de ser digitar e passou a ser decidir os casos que a IA marcou como incertos.</p><p>A arquitetura de cache e promoção foi desenhada em torno de um detalhe de custo: processar o mesmo item duas vezes é dinheiro jogado fora quando o processamento é uma chamada de LLM.</p>", "en": "" }
        }
      ],
      "pdf": null,
      "status": { "pt": "Em produção", "en": "" },
      "autoria": {
        "tipo": "autoral",
        "nota": { "pt": "Projeto autoral. Desenvolvido fora do contexto de trabalho, a partir de uma necessidade identificada de saneamento de base e avaliação de itens similares entre empresas; posteriormente apresentado e incorporado. Lógica, modelagem e bibliotecas de autoria própria.", "en": "" }
      },
      "seo": {
        "title": { "pt": "Match Hub — padronização de insumos hospitalares com IA | Thiago Seiki Kato", "en": "" },
        "description": { "pt": "Plataforma SaaS multi-tenant que padroniza e faz matching de catálogos de insumos hospitalares usando LLM, embeddings de 768 dimensões e busca vetorial no Google Cloud.", "en": "" }
      }
    }
  ]
}
```

- [ ] **Step 10: Confirmar que o arquivo real carrega e valida**

Run: `node -e "import('./scripts/lib/dados.mjs').then(m => { const d = m.carregar('data/projetos.json'); console.log('ok:', d.projetos.length, 'projeto(s),', d.grupos.length, 'grupos'); })"`
Expected: `ok: 1 projeto(s), 3 grupos`

- [ ] **Step 11: Commit**

```bash
git add scripts/lib/texto.mjs scripts/lib/texto.test.mjs scripts/lib/dados.mjs scripts/lib/dados.test.mjs data/projetos.json
git commit -m "feat: helpers de texto, validação de dados e schema de projetos"
```

---

### Task 2: Template da página de caso

**Files:**
- Create: `scripts/lib/template-caso.mjs`
- Create: `scripts/lib/template-caso.test.mjs`

**Interfaces:**
- Consumes: `t`, `escapar` de `scripts/lib/texto.mjs`.
- Produces: `paginaCaso(projeto, opcoes) -> string`, onde `opcoes = { lang = 'pt', site = 'https://thiagokato.github.io/Portfolio' }`. Devolve o documento HTML completo, começando em `<!DOCTYPE html>`.

Regras que o template precisa respeitar:
- `secoes[].corpo` é HTML confiável do autor e **não** é escapado. Todo o resto é escapado.
- Sem `<script src="../script.js">`. Só o script inline de tema.
- `hreflang` cruzado pt/en mesmo com a página `en` ainda não gerada — a URL é estável.

- [ ] **Step 1: Escrever o teste que falha**

```js
// scripts/lib/template-caso.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { paginaCaso } from './template-caso.mjs';

const projeto = {
  slug: 'match-hub',
  grupo: 'plataformas',
  icone: 'fa-hospital',
  titulo: { pt: 'Match Hub', en: '' },
  subtitulo: { pt: 'Padronização com IA', en: '' },
  resumo: { pt: 'Resumo do projeto', en: '' },
  tags: ['GCP', 'Vertex AI'],
  stack: ['Python 3.12', 'FastAPI'],
  numeros: [{ valor: '193', rotulo: { pt: 'testes', en: '' } }],
  secoes: [{ id: 'problema', titulo: { pt: 'O problema', en: '' }, corpo: { pt: '<p>Texto com <strong>negrito</strong></p>', en: '' } }],
  pdf: null,
  status: { pt: 'Em produção', en: '' },
  seo: { title: { pt: 'Título SEO', en: '' }, description: { pt: 'Descrição SEO', en: '' } },
};

test('gera documento HTML completo', () => {
  const html = paginaCaso(projeto);
  assert.match(html, /^<!DOCTYPE html>/);
  assert.match(html, /<html lang="pt-BR"/);
  assert.match(html, /<\/html>\s*$/);
});

test('usa os campos de seo no title e na description', () => {
  const html = paginaCaso(projeto);
  assert.match(html, /<title>Título SEO<\/title>/);
  assert.match(html, /<meta name="description" content="Descrição SEO">/);
});

test('inclui canonical e hreflang cruzado', () => {
  const html = paginaCaso(projeto);
  assert.match(html, /<link rel="canonical" href="https:\/\/thiagokato\.github\.io\/Portfolio\/projetos\/match-hub\.html">/);
  assert.match(html, /hreflang="pt-BR" href="https:\/\/thiagokato\.github\.io\/Portfolio\/projetos\/match-hub\.html"/);
  assert.match(html, /hreflang="en" href="https:\/\/thiagokato\.github\.io\/Portfolio\/projetos\/en\/match-hub\.html"/);
});

test('não escapa o corpo das seções', () => {
  const html = paginaCaso(projeto);
  assert.match(html, /<p>Texto com <strong>negrito<\/strong><\/p>/);
});

test('escapa o título', () => {
  const html = paginaCaso({ ...projeto, titulo: { pt: 'A & B', en: '' } });
  assert.match(html, /A &amp; B/);
  assert.doesNotMatch(html, /<h1[^>]*>A & B/);
});

test('renderiza tags, stack e números', () => {
  const html = paginaCaso(projeto);
  assert.match(html, /Vertex AI/);
  assert.match(html, /FastAPI/);
  assert.match(html, /193/);
  assert.match(html, /testes/);
});

test('omite o bloco de PDF quando pdf é null', () => {
  assert.doesNotMatch(paginaCaso(projeto), /<iframe/);
});

test('inclui o bloco de PDF quando pdf existe', () => {
  const html = paginaCaso({ ...projeto, pdf: 'Projetos/Exemplo.pdf' });
  assert.match(html, /<iframe src="\.\.\/Projetos\/Exemplo\.pdf"/);
  assert.match(html, /href="\.\.\/Projetos\/Exemplo\.pdf"/);
});

test('não carrega script.js', () => {
  assert.doesNotMatch(paginaCaso(projeto), /script\.js/);
});

test('inclui JSON-LD de SoftwareApplication e BreadcrumbList', () => {
  const html = paginaCaso(projeto);
  assert.match(html, /"@type": "SoftwareApplication"/);
  assert.match(html, /"@type": "BreadcrumbList"/);
});

test('em inglês muda lang, caminho e link do par', () => {
  const html = paginaCaso(projeto, { lang: 'en' });
  assert.match(html, /<html lang="en"/);
  assert.match(html, /<link rel="canonical" href="[^"]*\/projetos\/en\/match-hub\.html">/);
  assert.match(html, /href="\.\.\/\.\.\/index\.html"/);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `node --test "scripts/**/*.test.mjs"lib/template-caso.test.mjs`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar `template-caso.mjs`**

```js
// scripts/lib/template-caso.mjs
import { t, escapar } from './texto.mjs';

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

  const tags = projeto.tags.map((tag) => `          <span class="tag">${escapar(tag)}</span>`).join('\n');

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
  <link rel="alternate" hreflang="pt-BR" href="${urlPt}">
  <link rel="alternate" hreflang="en" href="${urlEn}">
  <link rel="alternate" hreflang="x-default" href="${urlPt}">
  <link rel="stylesheet" href="${prefixo}styles.css">
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
        </ul>
      </div>
    </nav>
  </header>

  <main class="container caso">
    <article>
      <header class="caso-hero">
        <div class="caso-hero-icone"><i class="fas ${escapar(projeto.icone)}"></i></div>
        <span class="status-badge">${status}</span>
        <h1>${titulo}</h1>
        <p class="caso-subtitulo">${subtitulo}</p>
        <p class="about-lead">${resumo}</p>
        <div class="project-tags">
${tags}
        </div>
      </header>

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
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `node --test "scripts/**/*.test.mjs"lib/template-caso.test.mjs`
Expected: PASS — 11 testes.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/template-caso.mjs scripts/lib/template-caso.test.mjs
git commit -m "feat: template da página de caso com SEO e hreflang"
```

---

### Task 3: Bloco de cards agrupados do index

**Files:**
- Create: `scripts/lib/template-cards.mjs`
- Create: `scripts/lib/template-cards.test.mjs`

**Interfaces:**
- Consumes: `t`, `escapar` de `scripts/lib/texto.mjs`.
- Produces: `blocoCards(grupos, projetos, lang = 'pt') -> string` — apenas o HTML interno do bloco, sem os marcadores.

Regras:
- Preserva as classes existentes: `.projects-grid`, `.project-card`, `.project-image`, `.project-icon`, `.project-content`, `.project-tags`, `.tag`, `.project-features`, `.project-link`.
- `destaque: true` adiciona a classe `featured`, como os cards atuais.
- Grupos aparecem na ordem em que estão em `grupos`; projetos na ordem do array `projetos`.
- Grupo sem projeto é omitido.
- Cada card mostra até 3 itens da `stack` como features.

- [ ] **Step 1: Escrever o teste que falha**

```js
// scripts/lib/template-cards.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { blocoCards } from './template-cards.mjs';

const grupos = [
  { id: 'plataformas', titulo: { pt: 'Plataformas', en: '' }, descricao: { pt: 'Sistemas em operação.', en: '' } },
  { id: 'laboratorio', titulo: { pt: 'Laboratório', en: '' }, descricao: { pt: 'Experimentos.', en: '' } },
];

const projetos = [
  {
    slug: 'match-hub', grupo: 'plataformas', destaque: true, icone: 'fa-hospital',
    titulo: { pt: 'Match Hub', en: '' }, subtitulo: { pt: 'Sub', en: '' },
    resumo: { pt: 'Resumo A', en: '' }, tags: ['GCP'],
    stack: ['Python', 'FastAPI', 'Firestore', 'React'], numeros: [], secoes: [],
    pdf: null, status: { pt: 'Em produção', en: '' },
    seo: { title: { pt: 'x', en: '' }, description: { pt: 'y', en: '' } },
  },
  {
    slug: 'jarvis', grupo: 'laboratorio', destaque: false, icone: 'fa-robot',
    titulo: { pt: 'Ecossistema JARVIS', en: '' }, subtitulo: { pt: 'Sub', en: '' },
    resumo: { pt: 'Resumo B', en: '' }, tags: ['A2A'],
    stack: ['Python'], numeros: [], secoes: [],
    pdf: null, status: { pt: 'Ativo', en: '' },
    seo: { title: { pt: 'x', en: '' }, description: { pt: 'y', en: '' } },
  },
];

test('cria um cabeçalho por grupo com projeto', () => {
  const html = blocoCards(grupos, projetos);
  assert.match(html, /class="grupo-header"/);
  assert.match(html, /Plataformas/);
  assert.match(html, /Laboratório/);
  assert.match(html, /Sistemas em operação\./);
});

test('omite grupo sem projeto', () => {
  const html = blocoCards([...grupos, { id: 'supplychain', titulo: { pt: 'Vazio', en: '' }, descricao: { pt: 'd', en: '' } }], projetos);
  assert.doesNotMatch(html, /Vazio/);
});

test('aplica featured apenas em destaque', () => {
  const html = blocoCards(grupos, projetos);
  assert.match(html, /class="project-card featured"/);
  assert.match(html, /class="project-card"/);
});

test('link aponta para a página de caso', () => {
  const html = blocoCards(grupos, projetos);
  assert.match(html, /href="projetos\/match-hub\.html"/);
  assert.match(html, /href="projetos\/jarvis\.html"/);
});

test('mostra no máximo 3 itens da stack como features', () => {
  const html = blocoCards(grupos, projetos);
  const cardMatchHub = html.slice(html.indexOf('match-hub') - 2000, html.indexOf('match-hub') + 2000);
  assert.match(cardMatchHub, /Firestore/);
  assert.doesNotMatch(cardMatchHub, /React/);
});

test('escapa conteúdo textual', () => {
  const especial = [{ ...projetos[0], titulo: { pt: 'A & B', en: '' } }];
  assert.match(blocoCards(grupos, especial), /A &amp; B/);
});

test('em inglês o rótulo do link muda', () => {
  assert.match(blocoCards(grupos, projetos, 'en'), /View case study/);
  assert.match(blocoCards(grupos, projetos, 'pt'), /Ver estudo de caso/);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `node --test "scripts/**/*.test.mjs"lib/template-cards.test.mjs`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar `template-cards.mjs`**

```js
// scripts/lib/template-cards.mjs
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
                            <h3>${escapar(t(projeto.titulo, lang))}</h3>
                            <p class="project-subtitulo">${escapar(t(projeto.subtitulo, lang))}</p>
                            <p>${escapar(t(projeto.resumo, lang))}</p>
                            <ul class="project-features">
${features}
                            </ul>
                            <a href="${href}" class="project-link">
                                <span>${rotuloLink}</span>
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
                    <h3 class="grupo-titulo">${escapar(t(grupo.titulo, lang))}</h3>
                    <p class="grupo-desc">${escapar(t(grupo.descricao, lang))}</p>
                </div>
                <div class="projects-grid">
${doGrupo.map((p) => card(p, lang)).join('\n')}
                </div>`);
  }

  return partes.join('\n');
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `node --test "scripts/**/*.test.mjs"lib/template-cards.test.mjs`
Expected: PASS — 7 testes.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/template-cards.mjs scripts/lib/template-cards.test.mjs
git commit -m "feat: bloco de cards agrupados por subgrupo temático"
```

---

### Task 4: Injeção segura no index.html e sitemap

**Files:**
- Create: `scripts/lib/indice.mjs`
- Create: `scripts/lib/indice.test.mjs`
- Create: `scripts/lib/sitemap.mjs`
- Create: `scripts/lib/sitemap.test.mjs`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `indice.mjs`: `MARCA_INICIO`, `MARCA_FIM` (strings), `injetar(html, bloco) -> string` (lança `Error` se algum marcador faltar ou estiver fora de ordem)
  - `sitemap.mjs`: `sitemap(entradas, hoje) -> string`, com `entradas = [{ loc, priority, changefreq }]` e `hoje` no formato `YYYY-MM-DD`

Esta é a tarefa de segurança do plano: `injetar` é o único ponto que toca um arquivo escrito à mão.

- [ ] **Step 1: Escrever o teste que falha para `indice.mjs`**

```js
// scripts/lib/indice.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { injetar, MARCA_INICIO, MARCA_FIM } from './indice.mjs';

const base = `<section>
${MARCA_INICIO}
conteúdo antigo
${MARCA_FIM}
</section>`;

test('substitui apenas o conteúdo entre marcadores', () => {
  const saida = injetar(base, 'NOVO');
  assert.match(saida, /<section>/);
  assert.match(saida, /<\/section>/);
  assert.match(saida, /NOVO/);
  assert.doesNotMatch(saida, /conteúdo antigo/);
});

test('preserva os marcadores para a próxima geração', () => {
  const saida = injetar(base, 'NOVO');
  assert.ok(saida.includes(MARCA_INICIO));
  assert.ok(saida.includes(MARCA_FIM));
  assert.equal(injetar(saida, 'OUTRO').includes('NOVO'), false);
});

test('lança erro se o marcador de início falta', () => {
  assert.throws(() => injetar(`<section>${MARCA_FIM}</section>`, 'X'), /PROJETOS:INICIO/);
});

test('lança erro se o marcador de fim falta', () => {
  assert.throws(() => injetar(`<section>${MARCA_INICIO}</section>`, 'X'), /PROJETOS:FIM/);
});

test('lança erro se os marcadores estão fora de ordem', () => {
  assert.throws(() => injetar(`${MARCA_FIM}x${MARCA_INICIO}`, 'X'), /ordem/);
});

test('não altera nada fora dos marcadores', () => {
  const html = `ANTES${MARCA_INICIO}velho${MARCA_FIM}DEPOIS`;
  const saida = injetar(html, 'novo');
  assert.ok(saida.startsWith('ANTES'));
  assert.ok(saida.endsWith('DEPOIS'));
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `node --test "scripts/**/*.test.mjs"lib/indice.test.mjs`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar `indice.mjs`**

```js
// scripts/lib/indice.mjs

export const MARCA_INICIO = '<!-- PROJETOS:INICIO -->';
export const MARCA_FIM = '<!-- PROJETOS:FIM -->';

/**
 * Substitui o conteúdo entre os marcadores. Nunca reescreve o arquivo inteiro:
 * se um marcador faltar, lança erro e o chamador não deve gravar nada.
 */
export function injetar(html, bloco) {
  const inicio = html.indexOf(MARCA_INICIO);
  if (inicio === -1) {
    throw new Error(`marcador ${MARCA_INICIO} não encontrado — nada foi escrito`);
  }
  const fim = html.indexOf(MARCA_FIM);
  if (fim === -1) {
    throw new Error(`marcador ${MARCA_FIM} não encontrado — nada foi escrito`);
  }
  if (fim < inicio) {
    throw new Error(`marcadores fora de ordem: ${MARCA_FIM} aparece antes de ${MARCA_INICIO}`);
  }

  const antes = html.slice(0, inicio + MARCA_INICIO.length);
  const depois = html.slice(fim);
  return `${antes}\n${bloco}\n                `.concat(depois);
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `node --test "scripts/**/*.test.mjs"lib/indice.test.mjs`
Expected: PASS — 6 testes.

- [ ] **Step 5: Escrever o teste que falha para `sitemap.mjs`**

```js
// scripts/lib/sitemap.test.mjs
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
```

- [ ] **Step 6: Rodar e confirmar que falha**

Run: `node --test "scripts/**/*.test.mjs"lib/sitemap.test.mjs`
Expected: FAIL — módulo inexistente.

- [ ] **Step 7: Implementar `sitemap.mjs`**

```js
// scripts/lib/sitemap.mjs

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
```

- [ ] **Step 8: Rodar e confirmar que passa**

Run: `node --test "scripts/**/*.test.mjs"lib/sitemap.test.mjs`
Expected: PASS — 4 testes.

- [ ] **Step 9: Rodar a suíte inteira**

Run: `node --test "scripts/**/*.test.mjs"`
Expected: PASS — 44 testes acumulados, 0 falhas (texto 7, dados 9, template-caso 11, template-cards 7, indice 6, sitemap 4).

- [ ] **Step 10: Commit**

```bash
git add scripts/lib/indice.mjs scripts/lib/indice.test.mjs scripts/lib/sitemap.mjs scripts/lib/sitemap.test.mjs
git commit -m "feat: injeção entre marcadores e geração de sitemap"
```

---

### Task 5: Fichas de projeto (PROJETOS.md)

**Files:**
- Create: `scripts/lib/ficha.mjs`
- Create: `scripts/lib/ficha.test.mjs`

**Interfaces:**
- Consumes: `t` de `scripts/lib/texto.mjs`.
- Produces: `fichas(dados, lang = 'pt') -> string` — documento Markdown completo, uma seção `##` por projeto.

Formato exigido por ficha, nesta ordem exata:

```markdown
## Nome do Projeto
- Uma linha: o que é, em linguagem de negócio
- Problema: o que existia antes e por que doía
- Arquitetura: como está construído
- Stack: linguagens, frameworks, infra
- Resultado: métrica ou impacto concreto; senão "sem métrica medida"
- Status: produção / piloto / em desenvolvimento / laboratório
- Autoria: autoral, sob contrato, ou desenvolvido internamente
```

Regras:
- O HTML dos campos `corpo` vira texto corrido: tags removidas, `</p>` e `</li>` viram separador, espaços colapsados.
- Seção `resultado` ausente ou vazia escreve literalmente `sem métrica medida`.
- `Autoria` imprime `tipo` seguido de ` — ` e a nota, quando houver nota.

- [ ] **Step 1: Escrever o teste que falha**

```js
// scripts/lib/ficha.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { fichas } from './ficha.mjs';

const base = {
  slug: 'match-hub', grupo: 'plataformas', destaque: true, icone: 'fa-hospital',
  titulo: { pt: 'Match Hub', en: '' },
  subtitulo: { pt: 'Padronização de insumos hospitalares com IA', en: '' },
  resumo: { pt: 'Resumo', en: '' },
  tags: ['GCP'], stack: ['Python 3.12', 'FastAPI', 'Firestore'], numeros: [],
  secoes: [
    { id: 'problema', titulo: { pt: 'O problema', en: '' }, corpo: { pt: '<p>Cada empresa descreve o item de um jeito.</p><p>Não dá para comparar preço.</p>', en: '' } },
    { id: 'solucao', titulo: { pt: 'A solução', en: '' }, corpo: { pt: '<p>LLM normaliza e embedding compara.</p>', en: '' } },
    { id: 'resultado', titulo: { pt: 'Resultado', en: '' }, corpo: { pt: '<p>De meses para execução assíncrona.</p>', en: '' } },
  ],
  pdf: null,
  status: { pt: 'produção', en: '' },
  autoria: { tipo: 'autoral', nota: { pt: 'Desenvolvido fora do contexto de trabalho.', en: '' } },
  seo: { title: { pt: 'x', en: '' }, description: { pt: 'y', en: '' } },
};

const dados = { grupos: [], projetos: [base] };

test('gera um cabeçalho por projeto', () => {
  assert.match(fichas(dados), /^## Match Hub$/m);
});

test('emite os sete campos na ordem exigida', () => {
  const md = fichas(dados);
  const ordem = ['Uma linha:', 'Problema:', 'Arquitetura:', 'Stack:', 'Resultado:', 'Status:', 'Autoria:'];
  let pos = -1;
  for (const campo of ordem) {
    const i = md.indexOf(campo);
    assert.ok(i > pos, `${campo} fora de ordem`);
    pos = i;
  }
});

test('remove HTML do corpo das seções', () => {
  const md = fichas(dados);
  assert.doesNotMatch(md, /<p>/);
  assert.match(md, /Cada empresa descreve o item de um jeito\./);
});

test('junta parágrafos do problema em uma linha', () => {
  const md = fichas(dados);
  const linha = md.split('\n').find((l) => l.startsWith('- Problema:'));
  assert.match(linha, /Não dá para comparar preço\./);
});

test('sem seção de resultado escreve "sem métrica medida"', () => {
  const semResultado = { ...base, secoes: base.secoes.filter((s) => s.id !== 'resultado') };
  const md = fichas({ grupos: [], projetos: [semResultado] });
  assert.match(md, /- Resultado: sem métrica medida/);
});

test('lista a stack separada por vírgula', () => {
  assert.match(fichas(dados), /- Stack: Python 3\.12, FastAPI, Firestore/);
});

test('autoria imprime tipo e nota', () => {
  assert.match(fichas(dados), /- Autoria: autoral — Desenvolvido fora do contexto de trabalho\./);
});

test('autoria sem nota imprime só o tipo', () => {
  const semNota = { ...base, autoria: { tipo: 'sob contrato', nota: { pt: '', en: '' } } };
  const md = fichas({ grupos: [], projetos: [semNota] });
  assert.match(md, /- Autoria: sob contrato$/m);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `node --test "scripts/**/*.test.mjs"lib/ficha.test.mjs`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar `ficha.mjs`**

```js
// scripts/lib/ficha.mjs
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
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `node --test "scripts/**/*.test.mjs"lib/ficha.test.mjs`
Expected: PASS — 8 testes.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/ficha.mjs scripts/lib/ficha.test.mjs
git commit -m "feat: geração das fichas de projeto em PROJETOS.md"
```

---

### Task 6: Orquestrador `gerar.mjs` e marcadores no index

**Files:**
- Create: `scripts/gerar.mjs`
- Modify: `index.html` (inserir os dois marcadores dentro de `<div class="projects-grid">`, seção `#projects`)

**Interfaces:**
- Consumes: `carregar`, `paginaCaso`, `blocoCards`, `injetar`, `MARCA_INICIO`, `MARCA_FIM`, `sitemap`, `fichas`.
- Produces: executável de linha de comando. Sem exports.

Este é o único módulo que escreve em disco. Ordem de operações deliberada: **tudo é montado em memória antes de qualquer escrita**, para que uma falha de marcador não deixe o repositório meio gerado.

- [ ] **Step 1: Substituir o conteúdo da grade de projetos pelos marcadores**

Em `index.html`, dentro de `<section id="projects">`, trocar todo o conteúdo de `<div class="projects-grid"> ... </div>` (os cinco `<article class="project-card">` atuais, hoje entre as linhas 402 e 561) por:

```html
                <!-- PROJETOS:INICIO -->
                <!-- PROJETOS:FIM -->
```

O `<div class="projects-grid">` externo sai junto — agora cada subgrupo cria a própria grade. O `<div class="section-header">` acima permanece intocado.

- [ ] **Step 2: Confirmar que os marcadores estão presentes e na ordem certa**

Run: `grep -n "PROJETOS:INICIO\|PROJETOS:FIM\|projects-grid" index.html`
Expected: duas linhas, `INICIO` antes de `FIM`, e nenhuma ocorrência remanescente de `projects-grid`.

- [ ] **Step 3: Implementar `gerar.mjs`**

```js
#!/usr/bin/env node
// scripts/gerar.mjs — gera páginas de caso, cards do index, sitemap e PROJETOS.md
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { carregar } from './lib/dados.mjs';
import { paginaCaso } from './lib/template-caso.mjs';
import { blocoCards } from './lib/template-cards.mjs';
import { injetar } from './lib/indice.mjs';
import { sitemap } from './lib/sitemap.mjs';
import { fichas } from './lib/ficha.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://thiagokato.github.io/Portfolio';

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

function paginasDeArtigo() {
  try {
    return readdirSync(join(RAIZ, 'Artigos'))
      .filter((f) => f.endsWith('.html'))
      .sort()
      .map((f) => ({
        loc: `${SITE}/Artigos/${encodeURIComponent(f)}`,
        changefreq: 'yearly',
        priority: '0.6',
      }));
  } catch {
    return [];
  }
}

function main() {
  const dados = carregar(join(RAIZ, 'data', 'projetos.json'));
  const data = hoje();

  // ---- montar tudo em memória antes de escrever ----
  const paginas = dados.projetos.map((p) => ({
    caminho: join(RAIZ, 'projetos', `${p.slug}.html`),
    conteudo: paginaCaso(p, { lang: 'pt', site: SITE }),
  }));

  const indexOriginal = readFileSync(join(RAIZ, 'index.html'), 'utf8');
  const indexNovo = injetar(indexOriginal, blocoCards(dados.grupos, dados.projetos, 'pt'));

  const entradas = [
    { loc: `${SITE}/`, changefreq: 'monthly', priority: '1.0' },
    ...dados.projetos.map((p) => ({
      loc: `${SITE}/projetos/${p.slug}.html`,
      changefreq: 'monthly',
      priority: '0.8',
    })),
    ...paginasDeArtigo(),
  ];
  const xml = sitemap(entradas, data);
  const md = fichas(dados, 'pt');

  // ---- escrever ----
  mkdirSync(join(RAIZ, 'projetos'), { recursive: true });
  for (const { caminho, conteudo } of paginas) writeFileSync(caminho, conteudo, 'utf8');
  writeFileSync(join(RAIZ, 'index.html'), indexNovo, 'utf8');
  writeFileSync(join(RAIZ, 'sitemap.xml'), xml, 'utf8');
  writeFileSync(join(RAIZ, 'PROJETOS.md'), md, 'utf8');

  console.log(`${paginas.length} página(s) em projetos/`);
  console.log(`index.html: bloco de projetos atualizado`);
  console.log(`sitemap.xml: ${entradas.length} URL(s)`);
  console.log(`PROJETOS.md: ${dados.projetos.length} ficha(s)`);
}

try {
  main();
} catch (e) {
  console.error(`\nERRO: ${e.message}\n`);
  process.exit(1);
}
```

- [ ] **Step 4: Rodar o gerador**

Run: `node scripts/gerar.mjs`
Expected:
```
1 página(s) em projetos/
index.html: bloco de projetos atualizado
sitemap.xml: 7 URL(s)
PROJETOS.md: 1 ficha(s)
```

- [ ] **Step 5: Confirmar que a falha de marcador é segura**

Run:
```bash
cp index.html /tmp/index.bak
sed -i 's/<!-- PROJETOS:FIM -->//' index.html
node scripts/gerar.mjs; echo "exit=$?"
cp /tmp/index.bak index.html
node scripts/gerar.mjs
```
Expected: a execução do meio imprime `ERRO: marcador <!-- PROJETOS:FIM --> não encontrado — nada foi escrito` e `exit=1`; a última volta ao normal.

- [ ] **Step 6: Rodar a suíte inteira**

Run: `node --test "scripts/**/*.test.mjs"`
Expected: PASS — 52 testes, 0 falhas (os 44 anteriores + 8 de `ficha`).

- [ ] **Step 7: Commit**

```bash
git add scripts/gerar.mjs index.html projetos/ sitemap.xml PROJETOS.md
git commit -m "feat: orquestrador do gerador e marcadores no index"
```

---

### Task 7: Verificador

**Files:**
- Create: `scripts/verificar.mjs`
- Create: `scripts/verificar.test.mjs`

**Interfaces:**
- Consumes: `carregar` de `scripts/lib/dados.mjs`.
- Produces: `checar(raiz) -> string[]` (lista de problemas; vazia = tudo certo) exportada para teste, mais um bloco `main` que imprime e sai com código 1 quando há problema.

As seis checagens da spec: slug sem HTML, HTML órfão, sitemap fora de sincronia, title/description vazio ou duplicado, link interno quebrado, campo obrigatório faltando (já coberto por `carregar`, que lança).

- [ ] **Step 1: Escrever o teste que falha**

```js
// scripts/verificar.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checar } from './verificar.mjs';

const SITE = 'https://thiagokato.github.io/Portfolio';

function projeto(slug) {
  return {
    slug, grupo: 'plataformas', destaque: false, icone: 'fa-cube',
    titulo: { pt: slug, en: '' }, subtitulo: { pt: 's', en: '' }, resumo: { pt: 'r', en: '' },
    tags: [], stack: [], numeros: [], secoes: [],
    pdf: null, status: { pt: 'produção', en: '' },
    autoria: { tipo: 'autoral', nota: { pt: 'n', en: '' } },
    seo: { title: { pt: `T ${slug}`, en: '' }, description: { pt: `D ${slug}`, en: '' } },
  };
}

function montar({ slugs = ['a'], paginas = ['a'], noSitemap = [], titleDuplicado = false } = {}) {
  const raiz = mkdtempSync(join(tmpdir(), 'verif-'));
  mkdirSync(join(raiz, 'data'));
  mkdirSync(join(raiz, 'projetos'));
  mkdirSync(join(raiz, 'Artigos'));

  const projetos = slugs.map(projeto);
  if (titleDuplicado && projetos.length > 1) projetos[1].seo.title = projetos[0].seo.title;
  writeFileSync(join(raiz, 'data', 'projetos.json'), JSON.stringify({ grupos: [], projetos }));

  for (const s of paginas) {
    const p = projetos.find((x) => x.slug === s) || projeto(s);
    writeFileSync(
      join(raiz, 'projetos', `${s}.html`),
      `<title>${p.seo.title.pt}</title><meta name="description" content="${p.seo.description.pt}"><a href="../index.html">v</a>`
    );
  }
  writeFileSync(join(raiz, 'index.html'), '<html></html>');

  const urls = [`${SITE}/`, ...slugs.filter((s) => !noSitemap.includes(s)).map((s) => `${SITE}/projetos/${s}.html`)];
  writeFileSync(
    join(raiz, 'sitemap.xml'),
    `<?xml version="1.0"?><urlset>${urls.map((u) => `<url><loc>${u}</loc></url>`).join('')}</urlset>`
  );
  return raiz;
}

test('projeto bem formado não gera problema', () => {
  const raiz = montar();
  assert.deepEqual(checar(raiz), []);
  rmSync(raiz, { recursive: true, force: true });
});

test('slug sem página gerada é problema', () => {
  const raiz = montar({ slugs: ['a', 'b'], paginas: ['a'] });
  assert.ok(checar(raiz).some((p) => /b\.html.*não existe|falta.*b/i.test(p)));
  rmSync(raiz, { recursive: true, force: true });
});

test('página órfã é problema', () => {
  const raiz = montar({ slugs: ['a'], paginas: ['a', 'zumbi'] });
  assert.ok(checar(raiz).some((p) => /zumbi/.test(p) && /órf/i.test(p)));
  rmSync(raiz, { recursive: true, force: true });
});

test('URL faltando no sitemap é problema', () => {
  const raiz = montar({ slugs: ['a', 'b'], paginas: ['a', 'b'], noSitemap: ['b'] });
  assert.ok(checar(raiz).some((p) => /sitemap/i.test(p) && /b/.test(p)));
  rmSync(raiz, { recursive: true, force: true });
});

test('title duplicado é problema', () => {
  const raiz = montar({ slugs: ['a', 'b'], paginas: ['a', 'b'], titleDuplicado: true });
  assert.ok(checar(raiz).some((p) => /title duplicado/i.test(p)));
  rmSync(raiz, { recursive: true, force: true });
});

test('link interno quebrado é problema', () => {
  const raiz = montar();
  writeFileSync(
    join(raiz, 'projetos', 'a.html'),
    '<title>T a</title><meta name="description" content="D a"><a href="../nao-existe.pdf">x</a>'
  );
  assert.ok(checar(raiz).some((p) => /nao-existe\.pdf/.test(p)));
  rmSync(raiz, { recursive: true, force: true });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `node --test "scripts/**/*.test.mjs"verificar.test.mjs`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar `verificar.mjs`**

```js
#!/usr/bin/env node
// scripts/verificar.mjs — valida a saída do gerador antes do commit
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { carregar } from './lib/dados.mjs';

function texto(caminho) {
  return existsSync(caminho) ? readFileSync(caminho, 'utf8') : '';
}

function extrair(html, regex) {
  const m = html.match(regex);
  return m ? m[1].trim() : '';
}

/** Roda as seis checagens. Devolve lista de problemas — vazia significa tudo certo. */
export function checar(raiz) {
  const problemas = [];

  let dados;
  try {
    dados = carregar(join(raiz, 'data', 'projetos.json'));
  } catch (e) {
    return [e.message];
  }

  const dirProjetos = join(raiz, 'projetos');
  const arquivos = existsSync(dirProjetos)
    ? readdirSync(dirProjetos).filter((f) => f.endsWith('.html'))
    : [];
  const slugs = new Set(dados.projetos.map((p) => p.slug));

  // 1) todo slug virou página
  for (const p of dados.projetos) {
    if (!existsSync(join(dirProjetos, `${p.slug}.html`))) {
      problemas.push(`falta a página projetos/${p.slug}.html — rode node scripts/gerar.mjs`);
    }
  }

  // 2) nenhuma página órfã
  for (const f of arquivos) {
    if (!slugs.has(f.replace(/\.html$/, ''))) {
      problemas.push(`projetos/${f} é órfã — nenhum slug corresponde no JSON`);
    }
  }

  // 3) sitemap em sincronia
  const xml = texto(join(raiz, 'sitemap.xml'));
  for (const p of dados.projetos) {
    if (!xml.includes(`/projetos/${p.slug}.html`)) {
      problemas.push(`sitemap.xml não contém /projetos/${p.slug}.html`);
    }
  }

  // 4) title e description únicos e não vazios  +  5) links internos
  const titles = new Map();
  const descricoes = new Map();

  for (const f of arquivos) {
    const caminho = join(dirProjetos, f);
    const html = texto(caminho);

    const title = extrair(html, /<title>([\s\S]*?)<\/title>/i);
    const desc = extrair(html, /<meta name="description" content="([^"]*)"/i);

    if (!title) problemas.push(`projetos/${f}: <title> vazio`);
    else if (titles.has(title)) problemas.push(`title duplicado entre projetos/${f} e projetos/${titles.get(title)}: "${title}"`);
    else titles.set(title, f);

    if (!desc) problemas.push(`projetos/${f}: meta description vazia`);
    else if (descricoes.has(desc)) problemas.push(`description duplicada entre projetos/${f} e projetos/${descricoes.get(desc)}`);
    else descricoes.set(desc, f);

    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const alvo = m[1];
      if (/^(https?:|mailto:|tel:|#|data:)/.test(alvo)) continue;
      const semAncora = alvo.split('#')[0];
      if (!semAncora) continue;
      const absoluto = resolve(dirProjetos, decodeURIComponent(semAncora));
      if (!existsSync(absoluto)) {
        problemas.push(`projetos/${f}: link interno quebrado — ${alvo}`);
      }
    }
  }

  return problemas;
}

const ehPrincipal = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (ehPrincipal) {
  const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
  const problemas = checar(raiz);
  if (problemas.length === 0) {
    console.log('verificação ok — nenhum problema encontrado');
  } else {
    console.error(`\n${problemas.length} problema(s):\n  - ${problemas.join('\n  - ')}\n`);
    process.exit(1);
  }
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `node --test "scripts/**/*.test.mjs"verificar.test.mjs`
Expected: PASS — 6 testes.

- [ ] **Step 5: Rodar o verificador no repositório real**

Run: `node scripts/verificar.mjs`
Expected: `verificação ok — nenhum problema encontrado`

- [ ] **Step 5b: Rodar a suíte completa**

Run: `node --test "scripts/**/*.test.mjs"`
Expected: PASS — 58 testes, 0 falhas.

- [ ] **Step 6: Commit**

```bash
git add scripts/verificar.mjs scripts/verificar.test.mjs
git commit -m "feat: verificador de integridade da saída gerada"
```

---

### Task 8: Estilos — cards compactos, subgrupos e página de caso

**Files:**
- Modify: `styles.css` (acrescentar ao final; e ajustar `.project-card` conforme abaixo)

Implementa a decisão de UI da spec. Duas frentes: densificar os cards de projeto no index e vestir a página de caso.

- [ ] **Step 1: Conferir o estado atual antes de mexer**

Run: `grep -n "^\.project-card\|^\.project-image\|^\.projects-grid\|^\.project-icon" styles.css`
Anote os números de linha — as regras existentes serão sobrescritas pelas novas, que vão ao final do arquivo (cascata resolve sem precisar apagar as antigas).

- [ ] **Step 2: Acrescentar os estilos ao final de `styles.css`**

```css
/* =========================================
   PROJETOS — GRADE COMPACTA E SUBGRUPOS
   (gerado por scripts/gerar.mjs; ver data/projetos.json)
   ========================================= */

.grupo-header {
    margin: 64px 0 28px;
}

.grupo-header:first-of-type {
    margin-top: 24px;
}

.grupo-titulo {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 8px;
}

.grupo-desc {
    color: var(--text-secondary);
    max-width: 60ch;
}

/* Sobrescreve a grade antiga de largura total */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    align-items: stretch;
}

.projects-grid .project-card {
    display: flex;
    flex-direction: column;
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 16px;
    padding: 28px;
    transition: transform var(--transition-fast), border-color var(--transition-fast);
}

.projects-grid .project-card:hover {
    transform: translateY(-4px);
    border-color: var(--border-accent);
    background: var(--bg-card-hover);
}

.projects-grid .project-card.featured {
    grid-column: span 2;
}

/* O painel de ícone deixa de ser uma coluna morta */
.projects-grid .project-image {
    all: unset;
    display: block;
    margin-bottom: 18px;
}

.projects-grid .project-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 12px;
    background: var(--accent-dim);
    color: var(--accent);
    font-size: 1.15rem;
}

.projects-grid .project-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 0;
}

.project-subtitulo {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--text-dim);
    margin-bottom: 12px;
}

.projects-grid .project-features {
    margin-top: auto;
    padding-top: 16px;
}

@media (max-width: 1024px) {
    .projects-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    .projects-grid .project-card.featured {
        grid-column: span 2;
    }
}

@media (max-width: 768px) {
    .projects-grid {
        grid-template-columns: 1fr;
    }
    .projects-grid .project-card.featured {
        grid-column: span 1;
    }
}

/* =========================================
   PÁGINA DE CASO
   ========================================= */

.caso {
    margin-top: 120px;
    margin-bottom: 80px;
    max-width: 860px;
}

.caso-hero {
    margin-bottom: 48px;
}

.caso-hero-icone {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: var(--accent-dim);
    color: var(--accent);
    font-size: 1.4rem;
    margin-bottom: 20px;
}

.status-badge {
    display: inline-block;
    margin-left: 12px;
    padding: 5px 12px;
    border: 1px solid var(--border-accent);
    border-radius: 999px;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent);
    vertical-align: middle;
}

.caso h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    line-height: 1.15;
    margin: 8px 0 10px;
}

.caso-subtitulo {
    font-family: var(--font-mono);
    color: var(--text-dim);
    margin-bottom: 20px;
}

.caso-numeros {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
    padding: 24px;
    margin-bottom: 48px;
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 16px;
}

.caso-numero {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.caso-numero-valor {
    font-family: var(--font-mono);
    font-size: 1.9rem;
    color: var(--accent);
    line-height: 1;
}

.caso-numero-rotulo {
    font-size: 0.85rem;
    color: var(--text-secondary);
}

.caso-secao {
    margin-bottom: 44px;
}

.caso-secao h2 {
    font-size: 1.4rem;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-subtle);
}

.caso-secao p {
    color: var(--text-secondary);
    margin-bottom: 16px;
}

.caso-secao ul:not(.caso-stack) {
    color: var(--text-secondary);
    padding-left: 20px;
    margin-bottom: 16px;
}

.caso-secao ul:not(.caso-stack) li {
    margin-bottom: 10px;
}

.caso-secao code {
    font-family: var(--font-mono);
    font-size: 0.86em;
    padding: 2px 6px;
    border-radius: 6px;
    background: var(--bg-secondary);
    color: var(--accent);
}

.caso-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    list-style: none;
    padding: 0;
}

.caso-stack li {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    padding: 7px 14px;
    border: 1px solid var(--border-subtle);
    border-radius: 999px;
    background: var(--bg-card);
    color: var(--text-secondary);
}

.caso-pdf {
    width: 100%;
    height: 820px;
    border: none;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    margin-bottom: 20px;
}

.caso-cta {
    padding: 36px;
    border: 1px solid var(--border-accent);
    border-radius: 16px;
    background: var(--bg-card);
    text-align: center;
}

.caso-cta h2 {
    font-size: 1.35rem;
    margin-bottom: 10px;
}

.caso-cta p {
    color: var(--text-secondary);
    margin-bottom: 22px;
}

@media (max-width: 768px) {
    .caso {
        margin-top: 90px;
    }
    .caso-pdf {
        height: 520px;
    }
    .status-badge {
        display: block;
        margin: 12px 0 0;
        width: fit-content;
    }
}
```

- [ ] **Step 3: Tornar os downloads de CV secundários no hero**

Em `index.html`, os três botões do hero estão no bloco `.hero-cta` (por volta da linha 160). Os dois botões de CV têm a classe `btn-secondary`. Acrescentar ao final de `styles.css`:

```css
/* Hero — hierarquia das ações */
.hero-cta .btn-secondary {
    font-size: 0.88rem;
    padding: 12px 20px;
    opacity: 0.85;
}

.hero-cta .btn-secondary:hover {
    opacity: 1;
}
```

Se a classe dos botões de CV não for `btn-secondary`, confirme com `grep -n "hero-cta" -A 12 index.html` e ajuste o seletor para a classe real antes de aplicar.

- [ ] **Step 4: Conferir visualmente**

Run:
```bash
node scripts/gerar.mjs && node scripts/verificar.mjs
```
Abrir `index.html` e `projetos/match-hub.html` no navegador. Confirmar: cards em grade de 3 colunas sem painel vazio; `featured` ocupando 2 colunas; página de caso legível em 1440px e 390px; tema escuro aplicado ao abrir direto a página de caso.

- [ ] **Step 5: Commit**

```bash
git add styles.css index.html
git commit -m "feat: grade compacta de projetos, subgrupos e estilos da página de caso"
```

---

### Task 9: Conteúdo — os 11 projetos restantes

**Files:**
- Modify: `data/projetos.json`

**Interfaces:**
- Consumes: o schema validado na Task 1.
- Produces: `data/projetos.json` com 12 projetos.

**Fontes obrigatórias.** Cada ficha é escrita lendo o repositório correspondente. Nenhum número entra sem existir na fonte.

| slug | grupo | destaque | ícone | Fonte |
|---|---|---|---|---|
| `tax-hub` | plataformas | true | `fa-file-invoice-dollar` | `~/projects/tsk/yourhub/tax-hub/README.md` |
| `procurement-condominial` | plataformas | false | `fa-building` | `~/projects/tsk/bbz/BBZ_Workflow_Procurement/{README,CHANGELOG}.md` |
| `lexmind` | plataformas | true | `fa-scale-balanced` | `~/projects/tsk/advocacia/LexMind/README.md` |
| `multi-agent-assistant` | plataformas | false | `fa-robot` | `Projetos/SAM_Agente_Autônomo_para_Supply4Med.pdf` |
| `lotus-escoteiros` | plataformas | false | `fa-users` | `Projetos/Lotus_Engineering_Case_Study.pdf` + Doc `Case Study: Sistema de Gestão Lótus Escoteiros` |
| `omnitwin` | supplychain | true | `fa-project-diagram` | `Projetos/OmniTwin_Operational_Strategy.pdf` |
| `supply-chain-pipeline-builder` | supplychain | true | `fa-network-wired` | `~/projects/personal/SupplyChain/README.md` + `Projetos/LogiChain_Architect_Pro_Intelligent_Supply_Chain.pdf` |
| `ecossistema-jarvis` | laboratorio | true | `fa-diagram-project` | `~/projects/personal/{JARVIS,Alfred,Lucius,Portaria}` — em especial `JARVIS/docs/ESTADO-2026-08-20.md` |
| `dede` | laboratorio | false | `fa-graduation-cap` | `~/projects/personal/Schooling/README.md` |
| `cybersec-cockpit` | laboratorio | false | `fa-shield-halved` | `~/projects/personal/CyberSec/README.md` |
| `ai-talent-simulation` | laboratorio | false | `fa-users-cog` | `Projetos/AI_Talent_Simulation.pdf` |

**Valores de `pdf`:** `multi-agent-assistant`, `lotus-escoteiros`, `omnitwin`, `supply-chain-pipeline-builder` e `ai-talent-simulation` apontam para o PDF correspondente em `Projetos/`. Os outros seis recebem `null`.

**Valores de `autoria.tipo`:**
- `autoral`: `supply-chain-pipeline-builder`, `ecossistema-jarvis`, `dede`, `cybersec-cockpit`, `omnitwin`, `lotus-escoteiros`, `ai-talent-simulation`
- `sob contrato`: `procurement-condominial`, `lexmind`
- `desenvolvido internamente`: `tax-hub`, `multi-agent-assistant`

Se a leitura da fonte contradisser esta tabela, **pare e pergunte** — autoria não se infere.

**Redação do `supply-chain-pipeline-builder`:** projeto pessoal do autor, hoje em integração com um sistema da empresa onde ele atua, para demanda planejada. A nota de autoria registra exatamente isso. Proibido escrever ou sugerir que foi desenvolvido para a empresa.

**Ecossistema JARVIS — um projeto, quatro componentes.** As seções cobrem: JARVIS (orquestrador e entendedor), Alfred (memória da casa), Lucius (finanças, com painel web próprio) e Portaria (identidade e sessão compartilhadas, instalada pelos dois). Números disponíveis na fonte: 491 testes no Lucius, 183 no JARVIS, 59 no Alfred, 18 na Portaria; sete rotas de leitura no painel do Lucius. O diferencial a destacar é a comunicação A2A entre processos separados, verificada com o modelo real em 17/ago/2026 — não a quantidade de aplicações.

- [ ] **Step 1: Ler as fontes de cada projeto**

Para cada linha da tabela, ler o `README.md` e o `CHANGELOG.md` do repositório (ou o PDF, quando for a fonte). Anotar: o problema de negócio, as decisões de arquitetura, a stack exata dos manifestos (`pyproject.toml`, `package.json`) e qualquer número verificável.

- [ ] **Step 2: Escrever as 11 entradas em `data/projetos.json`**

Seguir exatamente o formato da entrada `match-hub` da Task 1: todos os campos presentes, todo texto em `{ "pt": "...", "en": "" }`, `secoes` com os ids `problema`, `solucao` e `resultado`.

Regras de redação:
- `subtitulo` em linguagem de negócio, não de stack.
- `resumo` de duas a três linhas, terminando no que o sistema resolve.
- `secoes[].corpo` usa apenas `<p>`, `<strong>`, `<em>`, `<code>`, `<ul>`, `<li>`, `<a>`.
- `seo.title` no formato `Nome — o que é | Thiago Seiki Kato`, único entre as 12 páginas.
- `seo.description` entre 120 e 160 caracteres, única.
- Cliente sempre genérico. Nenhuma razão social.
- Sem métrica real, a seção `resultado` descreve a mudança qualitativa; o `PROJETOS.md` escreverá `sem métrica medida` se não houver seção.

- [ ] **Step 3: Validar os dados**

Run: `node -e "import('./scripts/lib/dados.mjs').then(m => { const d = m.carregar('data/projetos.json'); console.log('ok:', d.projetos.length, 'projetos'); })"`
Expected: `ok: 12 projetos`

- [ ] **Step 4: Gerar e verificar**

Run: `node scripts/gerar.mjs && node scripts/verificar.mjs`
Expected: `12 página(s) em projetos/`, `sitemap.xml: 18 URL(s)`, `PROJETOS.md: 12 ficha(s)`, e `verificação ok`.

- [ ] **Step 5: Conferir os textos sensíveis**

Run: `grep -rniE "para a empresa|projeto da empresa|desenvolvido para|yourhub|supply4med|s4m|bbz" data/projetos.json PROJETOS.md projetos/`
Expected: nenhuma ocorrência. Qualquer resultado precisa ser reescrito antes do commit.

- [ ] **Step 6: Commit**

```bash
git add data/projetos.json projetos/ index.html sitemap.xml PROJETOS.md
git commit -m "feat: fichas dos 12 projetos com conteúdo dos repositórios"
```

---

### Task 10: README e fechamento

**Files:**
- Create: `README.md`

- [ ] **Step 1: Escrever o `README.md`**

```markdown
# Portfólio — Thiago Seiki Kato

Site estático publicado em <https://thiagokato.github.io/Portfolio/>.
Sem build de produção: o GitHub Pages serve os arquivos deste repositório como estão.

## Como editar os projetos

`data/projetos.json` é a fonte de verdade. A partir dele são gerados:

- `projetos/<slug>.html` — uma página de caso por projeto
- o bloco de cards da seção Projetos em `index.html` (entre os marcadores `PROJETOS:INICIO` e `PROJETOS:FIM`)
- `sitemap.xml`
- `PROJETOS.md` — fichas usadas para currículo e LinkedIn

**Depois de qualquer alteração em `data/projetos.json`, rode:**

```bash
node scripts/gerar.mjs     # regenera tudo
node scripts/verificar.mjs # confere a integridade da saída
```

Sem isso, o `index.html` e as páginas ficam fora de sincronia.

Não edite `PROJETOS.md`, `sitemap.xml` nem os arquivos em `projetos/` à mão —
são sobrescritos na próxima geração.

## Testes

```bash
node --test "scripts/**/*.test.mjs"
```

Requer apenas Node.js 18 ou superior. Não há dependências: nada de `npm install`.

## Idiomas

Todo campo textual do JSON tem a forma `{ "pt": "...", "en": "" }`. O `en` está
vazio por enquanto; quando preenchido, o gerador emite `projetos/en/<slug>.html`
com `hreflang` cruzado.
```

- [ ] **Step 2: Rodar a suíte completa e o pipeline inteiro**

Run:
```bash
node --test "scripts/**/*.test.mjs" && node scripts/gerar.mjs && node scripts/verificar.mjs
```
Expected: todos os testes passam; 12 páginas geradas; `verificação ok — nenhum problema encontrado`.

- [ ] **Step 3: Conferir que a árvore está limpa depois de gerar**

Run: `node scripts/gerar.mjs && git status --porcelain`
Expected: nenhuma saída — gerar duas vezes seguidas não muda nada (geração determinística, exceto `lastmod` quando o dia vira).

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: README com o fluxo de geração do portfólio"
```
