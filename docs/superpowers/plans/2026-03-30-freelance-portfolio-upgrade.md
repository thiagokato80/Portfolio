# Freelance Portfolio Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio from a job-seeking page into a freelance-optimized site with explicit services, quantified results, contact form, and improved SEO.

**Architecture:** All content lives in `index.html` + `script.js` (for i18n PT/EN) + `styles.css` (visual). New sections use the same design system (CSS variables, `.reveal` scroll animations, `.container` grid). No framework, no build step — plain HTML/CSS/JS deployed to GitHub Pages.

**Tech Stack:** HTML5, CSS3 custom properties, Vanilla JS, formsubmit.co (zero-setup contact form), JSON-LD structured data, sitemap.xml

---

## File Map

| File | Change |
|------|--------|
| `index.html` | JSON-LD, keywords, og:description, hero-status, nav +Serviços, Serviços section, quantify project results, contact form |
| `script.js` | Translations for hero-status, Serviços section, contact form strings |
| `styles.css` | Styles for `.services-grid`, `.service-card`, `.process-steps`, `.contact-form` |
| `sitemap.xml` | New file — index + articles |
| `robots.txt` | New file |

---

## Task 1: SEO — JSON-LD, meta keywords, meta description

**Files:**
- Modify: `index.html` (head section, lines 1-42)

- [ ] **Step 1: Add JSON-LD structured data**

In `index.html`, add before `</head>`:

```html
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Thiago Seiki Kato",
      "jobTitle": "Supply Chain & AI Consultant",
      "url": "https://thiagokato.github.io/Portfolio/",
      "email": "thiagokato@gmail.com",
      "telephone": "+5511981039985",
      "sameAs": [
        "https://www.linkedin.com/in/thiago-seiki-kato-93a12b/",
        "https://github.com/thiagokato80"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "São Paulo",
        "addressRegion": "SP",
        "addressCountry": "BR"
      },
      "knowsAbout": [
        "Supply Chain Optimization",
        "Artificial Intelligence",
        "Data Science",
        "LangChain",
        "Monte Carlo Simulation",
        "Digital Twin",
        "ERP Integration",
        "Next.js",
        "Python",
        "Freelance Consulting"
      ],
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Freelance Supply Chain & AI Consultant",
        "occupationLocation": {
          "@type": "City",
          "name": "São Paulo"
        }
      }
    }
    </script>
```

- [ ] **Step 2: Update meta keywords with long-tail freelancer terms**

Replace the existing `<meta name="keywords"` tag with:

```html
    <meta name="keywords"
        content="Thiago Seiki Kato, Supply Chain, AI, Inteligência Artificial, Data Science, Ciência de Dados, Logística, Otimização, Python, Supply Chain Pipeline Builder, OmniTwin, consultoria supply chain São Paulo, desenvolvimento sistema gestão, automação processos IA, agentes autônomos LangChain, supply chain consultant Brazil, AI automation freelancer, freelancer supply chain, consultoria IA empresa, digital twin supply chain, Next.js developer Brazil">
```

- [ ] **Step 3: Update og:description and meta description**

Replace existing `<meta name="description"` with:

```html
    <meta name="description"
        content="Thiago Seiki Kato — Freelancer especialista em Supply Chain, IA e desenvolvimento de sistemas. Consultoria, automação de processos e plataformas sob medida. São Paulo, Brasil.">
```

Replace existing `<meta property="og:description"` and `<meta property="twitter:description"` with:

```html
    <meta property="og:description"
        content="Freelancer especialista em Supply Chain & IA. Desenvolvimento de sistemas operacionais, automação de processos, Digital Twins e consultoria estratégica. São Paulo, Brasil.">
```

```html
    <meta property="twitter:description"
        content="Freelancer especialista em Supply Chain & IA. Desenvolvimento de sistemas operacionais, automação de processos, Digital Twins e consultoria estratégica. São Paulo, Brasil.">
```

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "seo: add JSON-LD structured data and improve meta tags for freelance positioning"
```

---

## Task 2: Create sitemap.xml and robots.txt

**Files:**
- Create: `sitemap.xml`
- Create: `robots.txt`

- [ ] **Step 1: Create sitemap.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://thiagokato.github.io/Portfolio/</loc>
    <lastmod>2026-03-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://thiagokato.github.io/Portfolio/Artigos/a_produtividade_do_vibe_coding_e_o_rigor_da_engenharia.html</loc>
    <lastmod>2026-03-30</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://thiagokato.github.io/Portfolio/Artigos/a_revolucao_silenciosa.html</loc>
    <lastmod>2026-03-30</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://thiagokato.github.io/Portfolio/Artigos/analise_de_outlier.html</loc>
    <lastmod>2026-03-30</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://thiagokato.github.io/Portfolio/Artigos/o_paradoxo_cognitivo_da_ia.html</loc>
    <lastmod>2026-03-30</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
```

- [ ] **Step 2: Create robots.txt**

```
User-agent: *
Allow: /

Sitemap: https://thiagokato.github.io/Portfolio/sitemap.xml
```

- [ ] **Step 3: Commit**

```bash
git add sitemap.xml robots.txt
git commit -m "seo: add sitemap.xml and robots.txt"
```

---

## Task 3: Hero status and profile.json — freelance positioning

**Files:**
- Modify: `index.html` (hero section, line 96)
- Modify: `script.js` (translations, hero-status and profile-card keys)

- [ ] **Step 1: Update hero-status static text in index.html**

In `index.html` line 97, change the span text:

```html
                        <span data-i18n="hero-status">Disponível para projetos e consultoria</span>
```

- [ ] **Step 2: Update profile.json card — add freelance mode field**

In `index.html`, the `<code data-i18n-html="profile-card">` block, add `"mode"` field after `"available"`:

```html
<pre class="card-code"><code data-i18n-html="profile-card">{
  <span class="code-key">"nome"</span>: <span class="code-string">"Thiago Seiki Kato"</span>,
  <span class="code-key">"role"</span>: <span class="code-string">"Supply Chain & AI Consultant"</span>,
  <span class="code-key">"location"</span>: <span class="code-string">"São Paulo, Brasil"</span>,
  <span class="code-key">"focus"</span>: [
    <span class="code-string">"AI Solutions"</span>,
    <span class="code-string">"Supply Chain Optimization"</span>,
    <span class="code-string">"Data Science"</span>
  ],
  <span class="code-key">"mode"</span>: <span class="code-string">"freelance & consulting"</span>,
  <span class="code-key">"available"</span>: <span class="code-bool">true</span>
}</code></pre>
```

- [ ] **Step 3: Update script.js translations — hero-status PT**

In `translations.pt`, change:
```js
'hero-status': 'Disponível para projetos e consultoria',
```

- [ ] **Step 4: Update script.js translations — hero-status EN**

In `translations.en`, change:
```js
'hero-status': 'Available for freelance projects & consulting',
```

- [ ] **Step 5: Update profile-card translations in script.js (both PT and EN)**

PT `profile-card`:
```js
'profile-card': `{
  <span class="code-key">"nome"</span>: <span class="code-string">"Thiago Seiki Kato"</span>,
  <span class="code-key">"role"</span>: <span class="code-string">"Supply Chain & AI Consultant"</span>,
  <span class="code-key">"location"</span>: <span class="code-string">"São Paulo, Brasil"</span>,
  <span class="code-key">"focus"</span>: [
    <span class="code-string">"AI Solutions"</span>,
    <span class="code-string">"Supply Chain Optimization"</span>,
    <span class="code-string">"Data Science"</span>
  ],
  <span class="code-key">"mode"</span>: <span class="code-string">"freelance & consulting"</span>,
  <span class="code-key">"available"</span>: <span class="code-bool">true</span>
}`,
```

EN `profile-card`:
```js
'profile-card': `{
  <span class="code-key">"name"</span>: <span class="code-string">"Thiago Seiki Kato"</span>,
  <span class="code-key">"role"</span>: <span class="code-string">"Supply Chain & AI Consultant"</span>,
  <span class="code-key">"location"</span>: <span class="code-string">"São Paulo, Brazil"</span>,
  <span class="code-key">"focus"</span>: [
    <span class="code-string">"AI Solutions"</span>,
    <span class="code-string">"Supply Chain Optimization"</span>,
    <span class="code-string">"Data Science"</span>
  ],
  <span class="code-key">"mode"</span>: <span class="code-string">"freelance & consulting"</span>,
  <span class="code-key">"available"</span>: <span class="code-bool">true</span>
}`,
```

- [ ] **Step 6: Commit**

```bash
git add index.html script.js
git commit -m "feat: update hero and profile card for freelance positioning"
```

---

## Task 4: Add Serviços section with "Como Trabalho" process steps

**Files:**
- Modify: `index.html` — add section between `#skills` and `#projects`, update nav, renumber section tags
- Modify: `script.js` — add translation keys for all new content
- Modify: `styles.css` — add styles for `.services`, `.services-grid`, `.service-card`, `.process-steps`

- [ ] **Step 1: Add "Serviços" to nav in index.html**

In the nav `<ul class="nav-links">`, add after the Skills li:

```html
                        <li><a href="#services" data-i18n="nav-services">Serviços</a></li>
```

- [ ] **Step 2: Renumber section tags and update nav order**

The current order is: 01 Sobre, 02 Skills, 03 Projetos, 04 Artigos, 05 Contato.
New order: 01 Sobre, 02 Skills, 03 Serviços (new), 04 Projetos, 05 Artigos, 06 Contato.

Change `<span class="section-tag">03</span>` (Projetos) to `04`.
Change `<span class="section-tag">04</span>` (Artigos) to `05`.
Change `<span class="section-tag">05</span>` (Contato) to `06`.

- [ ] **Step 3: Add Serviços section HTML in index.html**

Insert after the closing `</section>` of `#skills` and before the opening `<section id="projects"`:

```html
        <!-- Services Section -->
        <section id="services" class="services">
            <div class="container">
                <div class="section-header">
                    <span class="section-tag">03</span>
                    <h2 data-i18n="services-title">Serviços</h2>
                    <div class="section-line"></div>
                </div>
                <div class="services-grid">
                    <div class="service-card">
                        <div class="service-icon"><i class="fas fa-truck-loading"></i></div>
                        <h3 data-i18n="srv1-title">Consultoria Supply Chain</h3>
                        <p data-i18n="srv1-desc">Diagnóstico de gargalos, roadmap de otimização e implementação de soluções para cadeias de suprimentos globais.</p>
                        <ul class="service-deliverables">
                            <li data-i18n="srv1-d1">Diagnóstico operacional</li>
                            <li data-i18n="srv1-d2">Roadmap priorizado</li>
                            <li data-i18n="srv1-d3">KPIs e dashboards</li>
                        </ul>
                    </div>
                    <div class="service-card">
                        <div class="service-icon"><i class="fas fa-robot"></i></div>
                        <h3 data-i18n="srv2-title">Automação com IA</h3>
                        <p data-i18n="srv2-desc">Desenvolvimento de agentes autônomos, RAG pipelines e integrações com ERP/Teams para eliminar trabalho repetitivo.</p>
                        <ul class="service-deliverables">
                            <li data-i18n="srv2-d1">Agentes LLM</li>
                            <li data-i18n="srv2-d2">RAG sobre documentos</li>
                            <li data-i18n="srv2-d3">Integração ERP/API</li>
                        </ul>
                    </div>
                    <div class="service-card">
                        <div class="service-icon"><i class="fas fa-laptop-code"></i></div>
                        <h3 data-i18n="srv3-title">Sistemas Operacionais</h3>
                        <p data-i18n="srv3-desc">Plataformas web sob medida para gestão de pessoas, finanças e processos — com custo operacional próximo de zero.</p>
                        <ul class="service-deliverables">
                            <li data-i18n="srv3-d1">Next.js + banco de dados</li>
                            <li data-i18n="srv3-d2">Gestão financeira</li>
                            <li data-i18n="srv3-d3">Controle de acesso</li>
                        </ul>
                    </div>
                    <div class="service-card">
                        <div class="service-icon"><i class="fas fa-chart-area"></i></div>
                        <h3 data-i18n="srv4-title">Data Science & Analytics</h3>
                        <p data-i18n="srv4-desc">Modelos preditivos, simulações de Monte Carlo e dashboards analíticos para decisões baseadas em dados.</p>
                        <ul class="service-deliverables">
                            <li data-i18n="srv4-d1">Modelos preditivos</li>
                            <li data-i18n="srv4-d2">Simulação de cenários</li>
                            <li data-i18n="srv4-d3">Relatórios executivos</li>
                        </ul>
                    </div>
                </div>

                <!-- Process Steps -->
                <div class="process-section">
                    <h3 data-i18n="process-title">Como trabalho</h3>
                    <div class="process-steps">
                        <div class="process-step">
                            <div class="step-number">01</div>
                            <div class="step-content">
                                <h4 data-i18n="step1-title">Discovery</h4>
                                <p data-i18n="step1-desc">Entendimento do problema, contexto e objetivos do projeto.</p>
                            </div>
                        </div>
                        <div class="process-connector"></div>
                        <div class="process-step">
                            <div class="step-number">02</div>
                            <div class="step-content">
                                <h4 data-i18n="step2-title">Proposta</h4>
                                <p data-i18n="step2-desc">Escopo detalhado, cronograma e entregáveis com preço fixo.</p>
                            </div>
                        </div>
                        <div class="process-connector"></div>
                        <div class="process-step">
                            <div class="step-number">03</div>
                            <div class="step-content">
                                <h4 data-i18n="step3-title">Execução</h4>
                                <p data-i18n="step3-desc">Sprints com atualizações regulares e validações com o cliente.</p>
                            </div>
                        </div>
                        <div class="process-connector"></div>
                        <div class="process-step">
                            <div class="step-number">04</div>
                            <div class="step-content">
                                <h4 data-i18n="step4-title">Entrega</h4>
                                <p data-i18n="step4-desc">Deploy, documentação e suporte pós-entrega incluídos.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
```

- [ ] **Step 4: Add translations to script.js — PT**

In `translations.pt`, add after `'highlight-regional'`:

```js
        'nav-services': 'Serviços',
        'services-title': 'Serviços',
        'srv1-title': 'Consultoria Supply Chain',
        'srv1-desc': 'Diagnóstico de gargalos, roadmap de otimização e implementação de soluções para cadeias de suprimentos globais.',
        'srv1-d1': 'Diagnóstico operacional',
        'srv1-d2': 'Roadmap priorizado',
        'srv1-d3': 'KPIs e dashboards',
        'srv2-title': 'Automação com IA',
        'srv2-desc': 'Desenvolvimento de agentes autônomos, RAG pipelines e integrações com ERP/Teams para eliminar trabalho repetitivo.',
        'srv2-d1': 'Agentes LLM',
        'srv2-d2': 'RAG sobre documentos',
        'srv2-d3': 'Integração ERP/API',
        'srv3-title': 'Sistemas Operacionais',
        'srv3-desc': 'Plataformas web sob medida para gestão de pessoas, finanças e processos — com custo operacional próximo de zero.',
        'srv3-d1': 'Next.js + banco de dados',
        'srv3-d2': 'Gestão financeira',
        'srv3-d3': 'Controle de acesso',
        'srv4-title': 'Data Science & Analytics',
        'srv4-desc': 'Modelos preditivos, simulações de Monte Carlo e dashboards analíticos para decisões baseadas em dados.',
        'srv4-d1': 'Modelos preditivos',
        'srv4-d2': 'Simulação de cenários',
        'srv4-d3': 'Relatórios executivos',
        'process-title': 'Como trabalho',
        'step1-title': 'Discovery',
        'step1-desc': 'Entendimento do problema, contexto e objetivos do projeto.',
        'step2-title': 'Proposta',
        'step2-desc': 'Escopo detalhado, cronograma e entregáveis com preço fixo.',
        'step3-title': 'Execução',
        'step3-desc': 'Sprints com atualizações regulares e validações com o cliente.',
        'step4-title': 'Entrega',
        'step4-desc': 'Deploy, documentação e suporte pós-entrega incluídos.',
```

- [ ] **Step 5: Add translations to script.js — EN**

In `translations.en`, add same block:

```js
        'nav-services': 'Services',
        'services-title': 'Services',
        'srv1-title': 'Supply Chain Consulting',
        'srv1-desc': 'Bottleneck diagnosis, optimization roadmap and solution implementation for global supply chains.',
        'srv1-d1': 'Operational diagnosis',
        'srv1-d2': 'Prioritized roadmap',
        'srv1-d3': 'KPIs & dashboards',
        'srv2-title': 'AI Automation',
        'srv2-desc': 'Development of autonomous agents, RAG pipelines and ERP/Teams integrations to eliminate repetitive work.',
        'srv2-d1': 'LLM agents',
        'srv2-d2': 'RAG over documents',
        'srv2-d3': 'ERP/API integration',
        'srv3-title': 'Operational Systems',
        'srv3-desc': 'Custom web platforms for people management, finance and processes — with near-zero operational cost.',
        'srv3-d1': 'Next.js + database',
        'srv3-d2': 'Financial management',
        'srv3-d3': 'Access control',
        'srv4-title': 'Data Science & Analytics',
        'srv4-desc': 'Predictive models, Monte Carlo simulations and analytical dashboards for data-driven decisions.',
        'srv4-d1': 'Predictive models',
        'srv4-d2': 'Scenario simulation',
        'srv4-d3': 'Executive reports',
        'process-title': 'How I work',
        'step1-title': 'Discovery',
        'step1-desc': 'Understanding the problem, context and goals of the project.',
        'step2-title': 'Proposal',
        'step2-desc': 'Detailed scope, timeline and deliverables at a fixed price.',
        'step3-title': 'Execution',
        'step3-desc': 'Sprints with regular updates and client validations.',
        'step4-title': 'Delivery',
        'step4-desc': 'Deploy, documentation and post-delivery support included.',
```

- [ ] **Step 6: Add CSS for new sections in styles.css**

Append to end of `styles.css`:

```css
/* =========================================
   SERVICES SECTION
   ========================================= */
.services {
    padding: var(--section-padding) 0;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px;
    margin-bottom: 72px;
}

.service-card {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 16px;
    padding: 32px 28px;
    transition: all var(--transition-smooth);
    position: relative;
    overflow: hidden;
}

.service-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), transparent);
    opacity: 0;
    transition: opacity var(--transition-smooth);
}

.service-card:hover {
    border-color: var(--border-accent);
    background: var(--bg-card-hover);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.service-card:hover::before {
    opacity: 1;
}

.service-icon {
    width: 52px;
    height: 52px;
    background: var(--accent-dim);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    color: var(--accent);
    margin-bottom: 20px;
}

.service-card h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 12px;
}

.service-card p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 20px;
}

.service-deliverables {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.service-deliverables li {
    font-size: 0.82rem;
    color: var(--text-dim);
    font-family: var(--font-mono);
    padding-left: 16px;
    position: relative;
}

.service-deliverables li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--accent);
    font-size: 0.75rem;
}

/* Process Steps */
.process-section {
    border-top: 1px solid var(--border-subtle);
    padding-top: 56px;
}

.process-section h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--text-primary);
    text-align: center;
    margin-bottom: 48px;
    letter-spacing: 0.02em;
}

.process-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    flex-wrap: wrap;
}

.process-step {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    max-width: 200px;
    flex: 1;
    min-width: 140px;
}

.step-number {
    font-family: var(--font-mono);
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--accent);
    opacity: 0.4;
    line-height: 1;
    flex-shrink: 0;
    padding-top: 2px;
}

.step-content h4 {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 6px;
}

.step-content p {
    font-size: 0.82rem;
    color: var(--text-secondary);
    line-height: 1.5;
}

.process-connector {
    flex: 0 0 40px;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), transparent);
    opacity: 0.3;
    margin-bottom: 20px;
    align-self: flex-start;
    margin-top: 14px;
}

/* Light theme overrides */
[data-theme="light"] .service-card {
    background: #ffffff;
}

[data-theme="light"] .service-card:hover {
    background: #f8fafc;
}

@media (max-width: 768px) {
    .process-steps {
        flex-direction: column;
        align-items: flex-start;
        gap: 32px;
        padding-left: 24px;
    }

    .process-connector {
        display: none;
    }

    .process-step {
        max-width: 100%;
    }
}
```

- [ ] **Step 7: Commit**

```bash
git add index.html script.js styles.css
git commit -m "feat: add services section with process steps"
```

---

## Task 5: Quantify project results in project descriptions

**Files:**
- Modify: `index.html` — update `<p>` descriptions in project cards
- Modify: `script.js` — update PT and EN translation strings for project descriptions

- [ ] **Step 1: Update OmniTwin description — index.html and script.js**

index.html `omnitwin-desc` paragraph:
```html
                            <p data-i18n-html="omnitwin-desc">
                                Plataforma de <strong>Inteligência de Decisão para Supply Chain</strong> que integra simulação de eventos discretos (Digital Twins), P&L em tempo real e insights por IA — reduzindo o ciclo de análise operacional de dias para <span class="text-accent">minutos</span>.
                            </p>
```

script.js PT `omnitwin-desc`:
```js
'omnitwin-desc': 'Plataforma de <strong>Inteligência de Decisão para Supply Chain</strong> que integra simulação de eventos discretos (Digital Twins), P&L em tempo real e insights por IA — reduzindo o ciclo de análise operacional de dias para <span class="text-accent">minutos</span>.',
```

script.js EN `omnitwin-desc`:
```js
'omnitwin-desc': '<strong>Supply Chain Decision Intelligence</strong> platform integrating discrete event simulation (Digital Twins), real-time P&L and AI-generated insights — reducing the operational analysis cycle from days to <span class="text-accent">minutes</span>.',
```

- [ ] **Step 2: Update SC Pipeline Builder description — index.html and script.js**

index.html `scpb-desc` paragraph:
```html
                            <p data-i18n-html="scpb-desc">
                                Plataforma No-Code de "Cérebro Digital" que otimiza resiliência e capital de giro em cadeias globais. Funciona como <strong>Agility Layer</strong> sobre SAP IBP e o9 — entregando análise de risco que levaria semanas em <span class="text-accent">uma sessão</span>.
                            </p>
```

script.js PT `scpb-desc`:
```js
'scpb-desc': 'Plataforma No-Code de "Cérebro Digital" que otimiza resiliência e capital de giro em cadeias globais. Funciona como <strong>Agility Layer</strong> sobre SAP IBP e o9 — entregando análise de risco que levaria semanas em <span class="text-accent">uma sessão</span>.',
```

script.js EN `scpb-desc`:
```js
'scpb-desc': 'No-Code "Digital Brain" platform that optimizes resilience and working capital in global chains. Works as an <strong>Agility Layer</strong> over SAP IBP and o9 — delivering risk analysis that would take weeks in <span class="text-accent">a single session</span>.',
```

- [ ] **Step 3: Update Lótus description — index.html and script.js**

index.html `lotusesc-desc` paragraph:
```html
                            <p data-i18n-html="lotusesc-desc">
                                Plataforma robusta para o Grupo Escoteiro Lótus (460 membros) que digitalizou mensalidades, reembolsos e progressão de jovens — zerando custo operacional e <span class="text-accent">eliminando 100% dos processos manuais</span>.
                            </p>
```

script.js PT `lotusesc-desc`:
```js
'lotusesc-desc': 'Plataforma robusta para o Grupo Escoteiro Lótus (460 membros) que digitalizou mensalidades, reembolsos e progressão de jovens — zerando custo operacional e <span class="text-accent">eliminando 100% dos processos manuais</span>.',
```

script.js EN `lotusesc-desc` (add key to EN translations):
```js
'lotusesc-desc': 'Robust platform for Lótus Scout Group (460 members) that digitized monthly fees, reimbursements and youth progression — zeroing operational cost and <span class="text-accent">eliminating 100% of manual processes</span>.',
```

- [ ] **Step 4: Commit**

```bash
git add index.html script.js
git commit -m "feat: add quantified outcomes to project descriptions"
```

---

## Task 6: Contact form

**Files:**
- Modify: `index.html` — add form inside `#contact` footer section
- Modify: `script.js` — add translation keys for form labels and contact-subtitle
- Modify: `styles.css` — add form styles

- [ ] **Step 1: Update contact-subtitle translation in script.js**

PT:
```js
'contact-subtitle': 'Tem um projeto em mente? Me conta — respondo em até 24h.',
```

EN:
```js
'contact-subtitle': 'Have a project in mind? Tell me — I reply within 24h.',
```

- [ ] **Step 2: Add form translation keys in script.js**

PT (add after `contact-subtitle`):
```js
'form-name': 'Seu nome',
'form-email': 'Seu email',
'form-project': 'Descreva seu projeto ou desafio',
'form-submit': 'Enviar Mensagem',
'form-sending': 'Enviando...',
```

EN (add after `contact-subtitle`):
```js
'form-name': 'Your name',
'form-email': 'Your email',
'form-project': 'Describe your project or challenge',
'form-submit': 'Send Message',
'form-sending': 'Sending...',
```

- [ ] **Step 3: Add form HTML in index.html**

In `#contact` footer, after the `<p data-i18n="contact-subtitle">` and before `<div class="contact-grid">`, insert:

```html
            <form class="contact-form" action="https://formsubmit.co/thiagokato@gmail.com" method="POST">
                <input type="hidden" name="_subject" value="Novo contato do portfólio">
                <input type="hidden" name="_captcha" value="false">
                <input type="hidden" name="_template" value="table">
                <div class="form-row">
                    <input type="text" name="name" data-i18n-placeholder="form-name" placeholder="Seu nome" required>
                    <input type="email" name="email" data-i18n-placeholder="form-email" placeholder="Seu email" required>
                </div>
                <textarea name="message" rows="4" data-i18n-placeholder="form-project" placeholder="Descreva seu projeto ou desafio" required></textarea>
                <button type="submit" class="btn btn-primary form-submit-btn">
                    <span data-i18n="form-submit">Enviar Mensagem</span>
                    <i class="fas fa-paper-plane"></i>
                </button>
            </form>
```

- [ ] **Step 4: Handle placeholder i18n in script.js `applyLanguage` function**

In the `applyLanguage` function, after the `data-i18n-html` querySelectorAll block, add:

```js
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key] !== undefined) el.placeholder = t[key];
    });
```

- [ ] **Step 5: Add contact form CSS in styles.css**

Append to styles.css:

```css
/* =========================================
   CONTACT FORM
   ========================================= */
.contact-form {
    max-width: 700px;
    margin: 0 auto 56px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.contact-form input,
.contact-form textarea {
    width: 100%;
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 10px;
    padding: 14px 18px;
    color: var(--text-primary);
    font-family: var(--font-display);
    font-size: 0.9rem;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    outline: none;
    resize: vertical;
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
    color: var(--text-dim);
}

.contact-form input:focus,
.contact-form textarea:focus {
    border-color: var(--border-accent);
    box-shadow: 0 0 0 3px var(--accent-dim);
}

.form-submit-btn {
    align-self: flex-start;
}

[data-theme="light"] .contact-form input,
[data-theme="light"] .contact-form textarea {
    background: #ffffff;
    border-color: #e2e8f0;
}

@media (max-width: 640px) {
    .form-row {
        grid-template-columns: 1fr;
    }
}
```

- [ ] **Step 6: Commit**

```bash
git add index.html script.js styles.css
git commit -m "feat: add contact form via formsubmit.co"
```

---

## Task 7: Save user memory

- [ ] **Step 1: Save memory about user's freelance pivot**

Save to `C:\Users\ThiagoKato\.claude\projects\D--Apps-Portfolio\memory\user_profile.md` and update `MEMORY.md`.

---

## Self-Review

**Spec coverage check:**
- ✅ JSON-LD structured data — Task 1
- ✅ Long-tail keywords — Task 1
- ✅ Meta description for freelancer — Task 1
- ✅ sitemap.xml — Task 2
- ✅ robots.txt — Task 2
- ✅ Hero status update — Task 3
- ✅ profile.json freelance mode — Task 3
- ✅ Serviços section — Task 4
- ✅ "Como trabalho" process steps — Task 4
- ✅ Quantified project results — Task 5
- ✅ Contact form — Task 6
- ✅ Memory — Task 7

**Placeholder scan:** None found — all code blocks are complete and specific.

**Type consistency:** `data-i18n` attributes in HTML match keys defined in `script.js` translations. `data-i18n-placeholder` handler added to `applyLanguage`. All CSS class names used in HTML are defined in the CSS block.
