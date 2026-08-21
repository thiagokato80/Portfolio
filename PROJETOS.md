# Projetos — fichas técnicas

> Arquivo gerado por `node scripts/gerar.mjs` a partir de `data/projetos.json`.
> Não editar à mão: as alterações são sobrescritas na próxima geração.

## Match Hub
- Uma linha: Padronização e matching de insumos hospitalares com IA
- Problema: Cada hospital, distribuidor e fabricante descreve o mesmo item de um jeito. "Seringa 10ml BD", "SER DESC 10 ML" e "seringa descartável 10 mL c/ agulha" são o mesmo produto para um comprador e três produtos diferentes para um ERP. Sem um catálogo comum não existe comparação de preço confiável, consolidação de compra nem análise de consumo. A padronização manual não escala: um catálogo de dezenas de milhares de itens consome meses de trabalho especializado e desatualiza enquanto é feito.
- Arquitetura: O Match Hub normaliza a descrição com Gemini Flash, gera um embedding de 768 dimensões com text-multilingual-embedding-002 e busca similares no Vertex AI Vector Search. Um segundo passe de LLM re-ranqueia os candidatos, e o que fica ambíguo vai para uma fila de curadoria humana em vez de virar um match errado silencioso. Multi-tenant com isolamento por chave de API — cada cliente enxerga apenas a própria base. Catálogo canônico central, com fluxo de proposta e aprovação. Importação assíncrona via Cloud Tasks, em lotes de 5.000 itens, sem travar a API. Conector pull para ERP — o Hub puxa o catálogo e para em revisão, em vez de processar tudo automaticamente. Promoção de itens entre bases reaproveita descrição, embedding e categoria já processados, sem reprocessar no LLM e sem cobrar duas vezes. Em produção são dois serviços Cloud Run a partir da mesma imagem, separados pela variável SERVICE_ROLE: um atende requisições, o outro consome a fila.
- Stack: Python 3.12, FastAPI, Cloud Run, Firestore, Vertex AI Vector Search, Gemini Flash, React 19, Cloud Tasks
- Resultado: A padronização de um catálogo inteiro passou de projeto de meses para execução assíncrona acompanhada em tela. O trabalho humano deixou de ser digitar e passou a ser decidir os casos que a IA marcou como incertos. A arquitetura de cache e promoção foi desenhada em torno de um detalhe de custo: processar o mesmo item duas vezes é dinheiro jogado fora quando o processamento é uma chamada de LLM.
- Status: Em produção
- Autoria: autoral — Projeto autoral. Desenvolvido fora do contexto de trabalho, a partir de uma necessidade identificada de saneamento de base e avaliação de itens similares entre empresas; posteriormente apresentado e incorporado. Lógica, modelagem e bibliotecas de autoria própria.
