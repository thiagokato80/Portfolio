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
node scripts/gerar.mjs      # regenera tudo
node scripts/verificar.mjs  # confere a integridade da saída
```

Sem isso, o `index.html` e as páginas ficam fora de sincronia.

Não edite `PROJETOS.md`, `sitemap.xml` nem os arquivos em `projetos/` à mão —
são sobrescritos na próxima geração.

O gerador só escreve no `index.html` entre os dois marcadores. Se eles sumirem,
ele falha com erro e não grava nada, em vez de reescrever o arquivo.

## Testes

```bash
node --test "scripts/**/*.test.mjs"
```

Requer apenas Node.js 18 ou superior. Não há dependências: nada de `npm install`.

> As aspas no glob são necessárias — e `node --test scripts/` **não** funciona
> no Node 24, que resolve o caminho como módulo em vez de varrer o diretório.

## Idiomas

Todo campo textual do JSON tem a forma `{ "pt": "...", "en": "" }`. O `en` está
vazio por enquanto; quando preenchido, o gerador emite `projetos/en/<slug>.html`
com `hreflang` cruzado.

## Autoria

Cada projeto declara `autoria.tipo`: `autoral`, `sob contrato` ou
`desenvolvido internamente`. O campo existe para obrigar a escolha da palavra
certa antes de publicar — o site é registro público e datado — e para calibrar a
redação do currículo, gerado da mesma fonte.
