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
                                        ──► PROJETOS.md (fichas para currículo)
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
  "autoria": { "tipo": "autoral", "nota": { "pt": "...", "en": "" } },
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

### Autoria e confidencialidade

Projetos corporativos usam **nome do projeto com cliente descrito genericamente**
(ex.: "Procurement Condominial — administradora de condomínios"). Nenhuma razão
social, nenhum dado de cliente, nenhuma captura de tela com dados reais.

Todo projeto declara `autoria.tipo`, com um de três valores: `autoral`,
`sob contrato`, `desenvolvido internamente`. O campo existe porque obriga a
escolher a palavra certa antes de publicar — o site é registro público e datado —
e porque calibra a redação do currículo, gerado da mesma fonte.

**Match Hub e Supply Chain Pipeline Builder são `autoral`.** Ambos foram
desenvolvidos pelo autor fora do contexto de trabalho, a partir de uma
necessidade que ele identificou, e depois apresentados para adoção. A redação
deve refletir isso com precisão e **nunca** usar formulações que sugiram
encomenda — "desenvolvido para a empresa", "projeto da empresa", ou o nome de
qualquer empregador. O campo `autoria.nota` carrega esse histórico por extenso.

### PROJETOS.md

Quarta saída do gerador, na raiz do repositório: uma ficha por projeto com uma
linha de resumo de negócio, problema, arquitetura, stack, resultado, status e
autoria. É o insumo para currículo e LinkedIn.

Gerado, não escrito à mão — para que site e currículo fiquem ancorados na mesma
fonte por construção. `Resultado` sem métrica medida escreve literalmente
"sem métrica medida", nunca um número estimado.

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
Simulation) têm o PDF em `Projetos/` como fonte principal.

Fontes complementares no Google Drive do autor, a usar junto com os repositórios:
`Case Study: Sistema de Gestão Lótus Escoteiros`, `Avaliação de Mercado e
Potencial de Negócios: Match Hub`, `Simulador Tributário Supply4Med`, `Manual do
Usuário — BBZ Procurement`, specs do LexMind. O Supply Chain Pipeline
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

### Decisão de UI (2026-08-21)

A linguagem visual do site é mantida: paleta midnight/teal, Outfit + JetBrains
Mono, numeração das seções. Uma avaliação com capturas em 1440px e 390px
concluiu que o conjunto é coerente e que a seção de Serviços é a referência de
densidade do site.

O que muda é a **seção de Projetos**, que hoje usa cards de largura total com um
painel de ícone de cerca de 30% praticamente vazio — densidade ruim que piora com
12 projetos, e que no mobile empurra o texto para fora da primeira dobra.

- Cards de projeto adotam o formato dos cards de Serviços: grid compacto, ícone
  pequeno inline, sem painel morto.
- `destaque: true` passa a ocupar duas colunas, em vez de largura total.
- No hero, os dois downloads de currículo viram ação secundária, para que
  "Ver Projetos" seja visualmente primário.

**Bug corrigido de passagem:** o card do Lótus Escoteiros reusa as chaves de i18n
`scpb-f1|f2|f3` (`index.html:485-490`), então o JavaScript sobrescreve suas
features com as do Pipeline Builder. Está no ar. A geração por dados elimina a
classe do erro.

---

## SEO

Cada página gerada recebe:

- `<title>` e `meta description` próprios, vindos de `seo` no JSON
- `<link rel="canonical">` absoluto
- Open Graph e Twitter Card
- JSON-LD: `SoftwareApplication` mais `BreadcrumbList`, num `@graph`. Todos os 12
  projetos são software, então não há ramo `CreativeWork`. O nó
  `SoftwareApplication` referencia o autor como `Person`, ligando cada página ao
  `Person` do `index.html`.
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

**Fase 2 — concluída em 2026-08-21.** Os artigos convertidos de iframe-sobre-PDF
para HTML completo, via `data/artigos.json` e o mesmo gerador.

Entregue: 7 artigos, 174 KB de HTML indexável, sitemap com 20 URLs. As 5 páginas
já publicadas mantiveram suas URLs originais, preservando o histórico de
indexação. Entraram dois inéditos — "O Vale da Morte da Automação" e
"Metodologia de Auditoria: SaaS Sprawl"; "Gestão de Supply Chain Cervejaria
Brasil" ficou de fora por decisão do autor.

Descoberta durante a execução: o site estiliza seletores de elemento nus
(`header` fixo, `nav` com altura fixa, `section` com padding de 80-140px), que
vazavam para todo conteúdo gerado. A neutralização está em `styles.css` e é
guardada por `scripts/lib/estilos.test.mjs`. Isso também corrigiu vãos indevidos
nas páginas de caso da Fase 1.

Registro original do planejamento:

Fonte revista em 2026-08-21: 4 dos 5 artigos existem como Google Docs na conta do
autor, o que substitui a transcrição de 93 páginas de PDF por leitura de texto
real e elimina o risco de erro de transcrição. *Análise de Outlier* não foi
localizado como Doc e permanece como leitura de PDF (27 páginas) até que o autor
indique o original.

Há também material inédito no Drive, candidato a entrar nesta fase e ampliar a
superfície indexável: "O Vale da Morte da Automação", "Metodologia de Auditoria:
SaaS Sprawl" e "Gestão de Supply Chain Cervejaria Brasil". A decisão de incluí-los
é do autor, no início da Fase 2.

**Fase 3.** Preencher os campos `en` e gerar `projetos/en/`.

## Riscos

| Risco | Mitigação |
|---|---|
| Esquecer de rodar o gerador; index e páginas divergem | `README.md` com o comando; `verificar.mjs` detecta a divergência |
| Erro de transcrição publicado com o nome do autor | Todo número vem do repositório; verificação de fatos na revisão da Fase 2 |
| Exposição de dado de cliente | Cliente descrito genericamente; nenhuma captura com dado real |
| Gerador corromper o `index.html` | Substituição só entre marcadores; erro explícito se ausentes |
