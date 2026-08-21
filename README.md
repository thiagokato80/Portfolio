# Portfólio — Thiago Seiki Kato

Site estático publicado em <https://thiagokato.github.io/Portfolio/>.
Sem build de produção: o GitHub Pages serve os arquivos deste repositório como estão.

## Como editar projetos e artigos

`data/projetos.json` e `data/artigos.json` são as fontes de verdade. A partir delas são gerados:

- `projetos/<slug>.html` — uma página de caso por projeto
- `Artigos/<slug>.html` — uma página por artigo, em HTML indexável (não iframe de PDF)
- os blocos de cards das seções Projetos e Artigos em `index.html`, entre os marcadores
  `PROJETOS:INICIO`/`PROJETOS:FIM` e `ARTIGOS:INICIO`/`ARTIGOS:FIM`
- `sitemap.xml`
- `PROJETOS.md` — fichas usadas para currículo e LinkedIn

**Depois de qualquer alteração nesses arquivos, rode:**

```bash
node scripts/gerar.mjs      # regenera tudo
node scripts/verificar.mjs  # confere a integridade da saída
```

Sem isso, o `index.html` e as páginas ficam fora de sincronia.

Não edite `PROJETOS.md`, `sitemap.xml` nem os arquivos em `projetos/` e `Artigos/`
à mão — são sobrescritos na próxima geração.

O tempo de leitura de cada artigo é calculado pelo gerador a partir da contagem de
palavras. Não é campo do JSON, justamente para não desatualizar.

O gerador só escreve no `index.html` entre os marcadores. Se algum sumir, ele falha
com erro e não grava nada, em vez de reescrever o arquivo.

**Atenção ao escrever HTML dentro dos campos `corpo`:** o site estiliza seletores de
elemento nus — `header` é barra fixa, `nav` tem altura de 72px e `section` recebe
80-140px de padding. As páginas geradas neutralizam isso em `styles.css`, e
`scripts/lib/estilos.test.mjs` guarda essa neutralização. Não remova essas regras.

## Testes

```bash
node --test "scripts/**/*.test.mjs"
```

Requer apenas Node.js 18 ou superior. Não há dependências: nada de `npm install`.

> As aspas no glob são necessárias — e `node --test scripts/` **não** funciona
> no Node 24, que resolve o caminho como módulo em vez de varrer o diretório.

## Idiomas

Todo campo textual do JSON tem a forma `{ "pt": "...", "en": "" }` — inclusive
`tags`, que é `{ "pt": [], "en": [] }` com as duas listas do mesmo tamanho.

Um item só é publicado em inglês quando está **integralmente** traduzido: título,
`seo` e todas as seções. `temTraducao()` decide isso, e a consequência é
deliberada — meia tradução publicada faria o `hreflang` apontar para uma página
incompleta, e o buscador trata isso como erro.

Para o que está traduzido, o gerador emite:

- `projetos/en/<slug>.html` e `Artigos/en/<slug>.html`
- o par de `hreflang` cruzado, **apenas nessas páginas**
- um alternador de idioma na navegação, que leva à contraparte
- as URLs em inglês no `sitemap.xml`

No `index.html`, o alternador PT/EN troca texto **e destino** dos cards: eles
carregam `data-href-pt` e `data-href-en`. Item sem tradução aponta o destino
"en" para a própria página em português, nunca para um 404.

Para traduzir mais alguma coisa, preencha os campos `en` no JSON e rode o
gerador. Nada mais precisa mudar.

## Autoria

Cada projeto declara `autoria.tipo`: `autoral`, `sob contrato` ou
`desenvolvido internamente`. O campo existe para obrigar a escolha da palavra
certa antes de publicar — o site é registro público e datado — e para calibrar a
redação do currículo, gerado da mesma fonte.
