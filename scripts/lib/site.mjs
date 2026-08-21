/**
 * Endereço público do site. Precisa bater com o host que o GitHub Pages serve,
 * derivado do dono do repositório: github.com/<dono>/Portfolio serve em
 * https://<dono>.github.io/Portfolio.
 *
 * Isto ficou errado entre março e agosto de 2026 — apontava para
 * "thiagokato.github.io", sem o "80" — e cada página dizia ao buscador que sua
 * versão oficial estava em outro domínio. scripts/verificar.mjs agora compara
 * este valor com o remote do git e falha se divergirem.
 */
export const SITE = 'https://thiagokato80.github.io/Portfolio';
