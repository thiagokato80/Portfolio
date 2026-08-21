# Páginas de caso e reestruturação da seção de projetos

**Data:** 2026-08-21
**Status:** design aprovado, aguardando plano de implementação

---

## Problema

O portfólio apresenta 5 projetos como cards estáticos no `index.html`, e cada card
aponta para um PDF em `Projetos/`. Três consequências:

1. **Nada novo aparece.** Onze projetos desenvolvidos desde a última atualização —
   quatro para empresas, sete pessoais — não estão no site.
2. **O conteúdo não é indexável.** As 5 páginas em `Artigos/` são apenas um
   `<iframe>` sobre um PDF. O buscador não atribui o conteúdo do iframe à página
   pai, então o site tem hoje essencialmente uma única página com texto real.
   O mesmo vale para os PDFs de projeto, que sequer têm página HTML.
3. **Não há fonte de verdade.** O texto de cada projeto existe uma vez em HTML e
   outra em `script.js` (traduções), duplicado e fácil de divergir. Currículo e
   LinkedIn são atualizados relendo o site.

O objetivo declarado do dono é usar o portfólio como fonte para atualizar
currículo e LinkedIn em seguida — o que exige dados estruturados, não HTML solto.

## Objetivo

Cada projeto ganha uma página HTML própria, indexável, gerada a partir de um
arquivo de dados único que também alimenta os cards do `index.html` e o
`sitemap.xml`. A seção de projetos passa a organizar 12 projetos em 3 subgrupos
temáticos.

## Não-objetivos

- Reescrever o `index.html` fora do bloco de projetos.
- Trocar o mecanismo de i18n do `index.html` (toggle client-side permanece).
- Introduzir framework, bundler ou dependência de runtime. O site continua
  estático e servido pelo GitHub Pages exatamente como hoje.
- Domínio próprio. Fica registrado como próximo passo de SEO, fora deste escopo.

---

## Arquitetura

### Pipeline

```
data/projetos.json ──► scripts/gerar.mjs ──► projetos/<slug>.html
                                        ──► index.html (bloco entre marcadores)
                                        ──► sitemap.xml
```

O gerador roda na máquina do autor (`node scripts/gerar.mjs`). Só a saída
estática é commitada. O GitHub Pages não executa nada — serve arquivos, como
hoje. Se o gerador for abandonado no futuro, os HTMLs gerados continuam
funcionando isoladamente.

### Injeção no index.html

O gerador substitui apenas o trecho entre dois marcadores HTML:

```html
<!-- PROJETOS:INICIO -->
...bloco gerado...
<!-- PROJETOS:FIM -->
```

Fora desses marcadores, o `index.html` continua editado à mão. O gerador falha
com erro explícito se não encontrar os dois marcadores, em vez de reescrever o
arquivo.

### Schema de `data/projetos.json`

```json
{
  "slug": "match-hub",
  "grupo": "plataformas",
  "destaque": true,
  "icone": "fa-hospital",
  "titulo":    { "pt": "Match Hub", "en": "" },
  "subtitulo": { "pt": "Padronização de insumos hospitalares com IA", "en": "" },
  "resumo":    { "pt": "...", "en": "" },
  "tags": ["Multi-tenant", "Vertex AI", "GCP"],
  "stack": ["Python 3.12", "FastAPI", "Cloud Run", "Firestore", "Gemini Flash"],
  "numeros": [{ "valor": "193", "rotulo": { "pt": "testes automatizados", "en": "" } }],
  "secoes": [
    { "id": "problema",  "titulo": { "pt": "O problema", "en": "" }, "corpo": { "pt": "...", "en": "" } },
    { "id": "solucao",   "titulo": { "pt": "A solução",  "en": "" }, "corpo": { "pt": "...", "en": "" } },
    { "id": "resultado", "titulo": { "pt": "Resultado",  "en": "" }, "corpo": { "pt": "...", "en": "" } }
  ],
  "pdf": null,
  "status": { "pt": "Em produção", "en": "" },
  "seo": { "title": { "pt": "...", "en": "" }, "description": { "pt": "...", "en": "" } }
}
```

**Todo campo textual é `{ pt, en }` desde o primeiro commit**, com `en` vazio
nesta fase. O inglês é requisito conhecido e próximo: preenchê-lo deve ser
escrever texto, nunca alterar estrutura ou template.

`pdf` é caminho relativo à raiz do site (ex.: `Projetos/OmniTwin_Operational_Strategy.pdf`)
ou `null`. `icone` é uma classe Font Awesome já carregada pelo `index.html`.

`corpo` aceita HTML inline restrito (`<strong>`, `<em>`, `<code>`, `<a>`, `<ul>`,
`<li>`, `<p>`). O gerador não escapa esses campos; escapa todos os demais.

---

## Taxonomia — 12 projetos em 3 subgrupos

| Subgrupo (`grupo`) | Projetos |
|---|---|
| `plataformas` — Plataformas de Negócio | Match Hub · Tax-Hub · Procurement Condominial · LexMind · Multi-Agent Assistant · Gestão Lótus Escoteiros |
| `supplychain` — Supply Chain & Inteligência de Decisão | OmniTwin · Supply Chain Pipeline Builder |
| `laboratorio` — Laboratório de Agentes de IA | Ecossistema JARVIS · Dedé · CyberSec Cockpit · AI Talent Simulation |

### Decisões de agrupamento

**Ecossistema JARVIS é um card, não quatro.** JARVIS, Alfred, Lucius e Portaria
são quatro repositórios, mas o que os torna interessantes é serem quatro
processos que conversam por protocolo A2A com identidade compartilhada, com o
fio rodando contra Gemini real. Quatro cards fragmentariam exatamente o
diferencial. O card nomeia os quatro componentes; a página de caso dedica uma
seção a cada um.

**Supply Chain Pipeline Builder continua um card.** A integração de demanda
planejada com o sistema da empresa é capítulo novo do mesmo produto, e entra
como seção destacada na página de caso — não como projeto separado.

### Confidencialidade

Projetos corporativos usam **nome do projeto com cliente descrito genericamente**
(ex.: "Match Hub — healthtech de distribuição hospitalar"). Nenhuma razão social,
nenhum dado de cliente, nenhuma captura de tela com dados reais.

### Fonte dos fatos

O conteúdo de cada página é escrito a partir do repositório correspondente
(`README.md`, `CHANGELOG.md`, `pyproject.toml`, docs de estado), não de memória.
Números citados no site precisam existir no repositório.

| Projeto | Repositório local |
|---|---|
| Match Hub | `~/projects/tsk/s4m/match-hub` |
| Tax-Hub | `~/projects/tsk/yourhub/tax-hub` |
| Procurement Condominial | `~/projects/tsk/bbz/BBZ_Workflow_Procurement` |
| LexMind | `~/projects/tsk/advocacia/LexMind` |
| Supply Chain Pipeline Builder | `~/projects/personal/SupplyChain` |
| Ecossistema JARVIS | `~/projects/personal/{JARVIS,Alfred,Lucius,Portaria}` |
| Dedé | `~/projects/personal/Schooling` |
| CyberSec Cockpit | `~/projects/personal/CyberSec` |

Os 4 projetos restantes (OmniTwin, Multi-Agent Assistant, Lótus, AI Talent
Simulation) têm o PDF em `Projetos/` como única fonte. O Supply Chain Pipeline
Builder tem as duas: repositório e PDF.

---

## Anatomia da página de caso

```
nav (volta ao portfólio)
hero            título · subtítulo · badge de status · tags
faixa de números
"O problema"    2-3 parágrafos
"A solução"     arquitetura em prosa + decisões técnicas
"Stack"         grid de tecnologias
"Resultado"     o que mudou na operação
[PDF embutido + link de download, quando `pdf` != null]
CTA             "Precisa de algo parecido?" → index.html#contact
```

Os 5 projetos que hoje têm PDF em `Projetos/` ganham conteúdo HTML real **acima**
do PDF. O PDF passa a ser anexo, não o conteúdo — é o que resolve a indexação. Os
7 projetos sem PDF têm `pdf: null` e a página termina no CTA.

A página reusa `styles.css`. Classes novas necessárias: faixa de números, grid de
stack, badge de status, cabeçalho de subgrupo.

---

## SEO

Cada página gerada recebe:

- `<title>` e `meta description` próprios, vindos de `seo` no JSON
- `<link rel="canonical">` absoluto
- Open Graph e Twitter Card
- JSON-LD: `SoftwareApplication` (produtos) ou `CreativeWork` (estudos), mais
  `BreadcrumbList`
- `hreflang` cruzado entre pt e en

`sitemap.xml` é regenerado inteiro pelo gerador, incluindo as URLs existentes de
artigos, com `lastmod` na data da geração.

### Divergência deliberada do padrão atual

O `index.html` troca idioma via JavaScript na mesma URL. Isso é invisível para
busca: o Google indexa uma versão apenas. As páginas de caso usam **URL por
idioma** — `projetos/<slug>.html` e `projetos/en/<slug>.html` — com `hreflang`
cruzado, que é o que faz a versão em inglês existir para o buscador. Nessas
páginas o botão de idioma navega em vez de trocar texto.

Essa inconsistência com o `index.html` é aceita conscientemente. Migrar o index
para o mesmo modelo é outro projeto, com impacto em toda a navegação.

---

## Verificação

O repositório não tem framework de teste. O gerador vem acompanhado de
`scripts/verificar.mjs`, que sai com código != 0 quando:

1. Algum `slug` do JSON não produziu arquivo HTML.
2. Existe HTML em `projetos/` sem `slug` correspondente no JSON (órfão).
3. O `sitemap.xml` não corresponde exatamente ao conjunto de páginas.
4. Há `title` ou `meta description` vazio ou duplicado entre páginas.
5. Algum link interno (`href` relativo) aponta para arquivo inexistente.
6. Algum `slug` é duplicado, ou algum campo obrigatório do schema falta.

O verificador é escrito junto com o gerador e roda antes de qualquer afirmação de
conclusão.

---

## Fases

**Fase 1 (este escopo).** `data/projetos.json` com os 12 projetos em pt-BR,
`scripts/gerar.mjs`, `scripts/verificar.mjs`, 12 páginas em `projetos/`, seção 04
do `index.html` reestruturada em 3 subgrupos, `sitemap.xml` regenerado,
`README.md` documentando o comando de build.

**Fase 2.** Os 5 artigos de `Artigos/` convertidos de iframe-sobre-PDF para HTML
completo, reusando o mesmo gerador via `data/artigos.json`. São 93 páginas de
PDF (34, 27, 15, 13 e 4) — o item mais caro do projeto e o de maior risco de erro
de transcrição, motivo pelo qual não bloqueia a Fase 1.

**Fase 3.** Preencher os campos `en` e gerar `projetos/en/`.

## Riscos

| Risco | Mitigação |
|---|---|
| Esquecer de rodar o gerador; index e páginas divergem | `README.md` com o comando; `verificar.mjs` detecta a divergência |
| Erro de transcrição publicado com o nome do autor | Todo número vem do repositório; verificação de fatos na revisão da Fase 2 |
| Exposição de dado de cliente | Cliente descrito genericamente; nenhuma captura com dado real |
| Gerador corromper o `index.html` | Substituição só entre marcadores; erro explícito se ausentes |
