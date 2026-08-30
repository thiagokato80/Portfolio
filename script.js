/* =========================================
   THIAGO SEIKI KATO - PORTFOLIO
   JavaScript Interactions & Animations
   ========================================= */

/* =========================================
   TRANSLATIONS
   ========================================= */
const translations = {
    pt: {
        'nav-about': 'Sobre',
        'nav-projects': 'Projetos',
        'nav-articles': 'Artigos',
        'nav-contact': 'Contato',
        'hero-status': 'Head de Inteligência · Supply4Med',
        'hero-greeting': 'Olá, eu sou',
        'hero-description': 'Lidero a área de Inteligência de uma operação de suprimentos hospitalares. Priorizo o portfólio de <span class="text-accent">IA e automação</span>, estruturo o problema antes da solução e respondo pela <span class="text-accent">adoção</span> depois que o sistema entra no ar.',
        'btn-projects': 'Ver Projetos',
        'about-title': 'Sobre Mim',
        'about-lead': 'Base em consultoria estratégica e gestão de operações na <strong>EY</strong>, na <strong>Webb/BrainNet</strong> e no Comitê <strong>Rio 2016</strong>. Depois aprendi a escrever o código que resolve o que eu antes só diagnosticava. Hoje o cargo exige as duas coisas.',
        'about-statement': '"A parte difícil de um projeto de IA não é o modelo. É garantir que alguém seja dono do processo, que a origem do dado seja rastreável e que exista supervisão humana onde o erro custa caro. Sem isso a ferramenta entra no ar e ninguém usa."',
        'about-p1': 'Trabalho no intervalo entre a regra de negócio e a implementação. Levanto o requisito com a área, modelo os dados e escrevo o sistema, o que elimina a perda de tradução entre quem conhece a regra e quem escreve o <span class="text-accent">código</span>.',
        'about-p2': 'São três pontos de contato com <span class="text-accent">saúde e farma</span>: padronização de insumos hospitalares na <strong>Supply4Med</strong>, modelo de risco de crédito para um distribuidor de medicamentos na Advision e arquitetura de RPA e BPMS para a <strong>Eurofarma</strong> na EzTools.',
        'highlight-exp': 'Anos de Experiência',
        'highlight-regional': 'Projetos Regionais',
        'nav-services': 'Atuação',
        'services-title': 'Áreas de Atuação',
        'srv1-title': 'Adoção de IA e Automação',
        'srv1-desc': 'Do caso de uso ao uso real: estruturação do problema com a área dona do processo e acompanhamento da adoção depois do go-live.',
        'srv1-d1': 'Casos de uso estruturados',
        'srv1-d2': 'Requisito antes da solução',
        'srv1-d3': 'Indicadores de adoção',
        'srv2-title': 'Governança e IA Responsável',
        'srv2-desc': 'Proveniência do dado, supervisão humana nos pontos em que o erro custa caro, gestão de acesso por perfil e documentação.',
        'srv2-d1': 'Rastreabilidade da fonte',
        'srv2-d2': 'Supervisão humana',
        'srv2-d3': 'Acesso por perfil (RLS)',
        'srv3-title': 'Plataformas e Integração',
        'srv3-desc': 'Sistemas sobre ERP, CRM e bancos em nuvem, com integração por API, isolamento multi-tenant e migração versionada.',
        'srv3-d1': 'Integração ERP/API',
        'srv3-d2': 'Multi-tenant',
        'srv3-d3': 'Google Cloud e Azure',
        'srv4-title': 'Decisão e Analytics',
        'srv4-desc': 'Modelos preditivos, simulação de eventos discretos e Monte Carlo para dimensionar risco, estoque e impacto financeiro.',
        'srv4-d1': 'Modelos preditivos',
        'srv4-d2': 'Simulação de cenários',
        'srv4-d3': 'KPIs e dashboards',
        'process-title': 'Como conduzo uma iniciativa',
        'step1-title': 'Problema',
        'step1-desc': 'Estruturação do problema com a área dona do processo, antes de escolher a solução.',
        'step2-title': 'Requisito',
        'step2-desc': 'Requisito independente de solução, cobrindo dado, processo e integração, com dono definido.',
        'step3-title': 'Controle',
        'step3-desc': 'Proveniência, supervisão humana, gestão de acesso e documentação definidos antes do go-live.',
        'step4-title': 'Adoção',
        'step4-desc': 'Medição de uso depois da entrega e ajuste do que não pegou.',
        'profile-card': `{
  <span class="code-key">"nome"</span>: <span class="code-string">"Thiago Seiki Kato"</span>,
  <span class="code-key">"cargo"</span>: <span class="code-string">"Head de Inteligência · Supply4Med"</span>,
  <span class="code-key">"local"</span>: <span class="code-string">"São Paulo, Brasil"</span>,
  <span class="code-key">"foco"</span>: [
    <span class="code-string">"Adoção de IA e automação"</span>,
    <span class="code-string">"Governança de dados e portfólio"</span>,
    <span class="code-string">"Operações de saúde"</span>
  ],
  <span class="code-key">"formacao"</span>: <span class="code-string">"Administração + MBA, FGV"</span>,
  <span class="code-key">"idiomas"</span>: [<span class="code-string">"pt-BR"</span>, <span class="code-string">"en (TOEIC 940)"</span>, <span class="code-string">"es"</span>]
}`,
        'projects-title': 'Projetos de Destaque',
        'omnitwin-title': 'De Simulador Técnico a Inteligência de Decisão: A Evolução do OmniTwin',
        'omnitwin-desc': 'Plataforma de <strong>Inteligência de Decisão para Supply Chain</strong> que integra simulação de eventos discretos (Digital Twins), P&L em tempo real e insights por IA — reduzindo o ciclo de análise operacional de dias para <span class="text-accent">minutos</span>.',
        'omnitwin-f1': 'IA Generativa (LLMs)',
        'omnitwin-f2': 'Operação Simulada',
        'omnitwin-f3': 'Supply Chain',
        'omnitwin-link': 'Ver Detalhes',
        'scpb-desc': 'Plataforma No-Code de "Cérebro Digital" que otimiza resiliência e capital de giro em cadeias globais. Funciona como <strong>Agility Layer</strong> sobre SAP IBP e o9 — entregando análise de risco que levaria semanas em <span class="text-accent">uma sessão</span>.',
        'scpb-f1': 'IA Generativa (LLMs)',
        'scpb-f2': 'Simulação de Monte Carlo',
        'scpb-f3': 'Análise de Sensibilidade',
        'scpb-link': 'Ver Detalhes',
        'scpb-link2': 'Ver Novas Funcionalidades',
        'lotusesc-desc': 'Plataforma robusta para o Grupo Escoteiro Lótus (460 membros) que digitalizou mensalidades, reembolsos e progressão de jovens — zerando custo operacional e <span class="text-accent">eliminando 100% dos processos manuais</span>.',
        'ats-desc': 'Plataforma gamificada para seleção de talentos em lógica, pensamento crítico e engenharia de prompts. <strong>Linguagem Natural</strong>.',
        'ats-f1': 'Google Gemini',
        'ats-f2': 'AI Chatbot',
        'ats-f3': 'NLP Interface',
        'ats-link': 'Ver Detalhes',
        'maa-desc': 'Assistente virtual integrada ao Odoo ERP e ao Microsoft Teams, projetada para facilitar a gestão empresarial por meio de comandos em linguagem natural <strong>Linguagem Natural</strong>.',
        'maa-f1': 'Retrievel Augmented Generation (RAG)',
        'maa-f2': 'AI Chatbot',
        'maa-f3': 'NLP Interface',
        'maa-link': 'Ver Detalhes',
        'articles-title': 'Artigos & Insights',
        'art1-title': 'A Produtividade do Vibe Coding e o Rigor da Engenharia',
        'art1-summary': 'Ferramentas de IA aceleram a execução técnica e códigos repetitivos, mas falham em arquitetura e debugging complexo. O engenheiro deve manter soberania sobre o design da solução.',
        'art1-link': 'Ler Artigo',
        'art2-title': 'A Revolução Silenciosa',
        'art2-summary': 'A qualidade e governança dos dados são mais críticas para o sucesso da IA do que os algoritmos. A vantagem competitiva reside na posse de ativos de dados exclusivos e bem preparados.',
        'art2-link': 'Ler Artigo',
        'art3-title': 'Análise de Outlier',
        'art3-summary': 'Outliers podem causar estimativas erradas se não tratados. Apresento métodos estatísticos como Z-score, IQR e DBSCAN para identificá-los e garantir a integridade dos modelos de ML.',
        'art3-link': 'Ler Artigo',
        'art4-title': 'O Paradoxo Cognitivo da IA',
        'art4-summary': 'A IA generativa pode causar "atrofia cognitiva" em profissionais. Proponho o framework HAA (Análise Aumentada por Humanos) para garantir que o julgamento final permaneça humano.',
        'art4-link': 'Ler Artigo',
        'contact-title': 'Vamos Conversar?',
        'contact-subtitle': 'Aberto a conversas sobre liderança de IA e transformação digital. Respondo em até 24h.',
        'form-name': 'Seu nome',
        'form-email': 'Seu email',
        'form-project': 'Sua mensagem',
        'form-submit': 'Enviar Mensagem',
        'footer-tagline': 'Construído com <span class="text-accent">&lt;/&gt;</span> e muita dedicação',
    },
    en: {
        'nav-about': 'About',
        'nav-projects': 'Projects',
        'nav-articles': 'Articles',
        'nav-contact': 'Contact',
        'hero-status': 'Head of Intelligence · Supply4Med',
        'hero-greeting': 'Hello, I am',
        'hero-description': 'I lead the Intelligence function of a hospital supply operation. I prioritise the <span class="text-accent">AI and automation</span> portfolio, frame the problem before the solution, and own <span class="text-accent">adoption</span> once the system is live.',
        'btn-projects': 'View Projects',
        'about-title': 'About Me',
        'about-lead': 'A background in strategic consulting and operations management at <strong>EY</strong>, <strong>Webb/BrainNet</strong> and the <strong>Rio 2016</strong> Organising Committee. Then I learned to write the code that fixes what I used to only diagnose. The job now requires both.',
        'about-statement': '"The hard part of an AI project is not the model. It is making sure someone owns the process, that the data has traceable provenance, and that a human reviews the decisions where an error is expensive. Without that, the tool ships and nobody uses it."',
        'about-p1': 'I work in the gap between the business rule and the implementation. I gather the requirement with the team, model the data and write the system, which removes the loss in translation between whoever knows the rule and whoever writes the <span class="text-accent">code</span>.',
        'about-p2': 'Three points of contact with <span class="text-accent">healthcare and pharma</span>: hospital supply standardisation at <strong>Supply4Med</strong>, a credit risk model for a pharmaceutical distributor at Advision, and RPA and BPMS architecture for <strong>Eurofarma</strong> at EzTools.',
        'highlight-exp': 'Years of Experience',
        'highlight-regional': 'Regional Projects',
        'nav-services': 'Focus',
        'services-title': 'Areas of Focus',
        'srv1-title': 'AI & Automation Adoption',
        'srv1-desc': 'From use case to actual use: framing the problem with the business process owner and tracking adoption after go-live.',
        'srv1-d1': 'Structured use cases',
        'srv1-d2': 'Requirement before solution',
        'srv1-d3': 'Adoption metrics',
        'srv2-title': 'Governance & Responsible AI',
        'srv2-desc': 'Data provenance, human oversight where an error is expensive, role-based access management and documentation.',
        'srv2-d1': 'Source traceability',
        'srv2-d2': 'Human oversight',
        'srv2-d3': 'Role-based access (RLS)',
        'srv3-title': 'Platforms & Integration',
        'srv3-desc': 'Systems over ERP, CRM and cloud databases, with API integration, multi-tenant isolation and versioned migration.',
        'srv3-d1': 'ERP/API integration',
        'srv3-d2': 'Multi-tenant',
        'srv3-d3': 'Google Cloud & Azure',
        'srv4-title': 'Decision & Analytics',
        'srv4-desc': 'Predictive models, discrete event simulation and Monte Carlo to size risk, inventory and financial impact.',
        'srv4-d1': 'Predictive models',
        'srv4-d2': 'Scenario simulation',
        'srv4-d3': 'KPIs & dashboards',
        'process-title': 'How I run an initiative',
        'step1-title': 'Problem',
        'step1-desc': 'Framing the problem with the business process owner, before picking a solution.',
        'step2-title': 'Requirement',
        'step2-desc': 'Solution-agnostic requirement covering data, process and integration, with a named owner.',
        'step3-title': 'Controls',
        'step3-desc': 'Provenance, human oversight, access management and documentation defined before go-live.',
        'step4-title': 'Adoption',
        'step4-desc': 'Measuring usage after delivery and fixing what did not stick.',
        'profile-card': `{
  <span class="code-key">"name"</span>: <span class="code-string">"Thiago Seiki Kato"</span>,
  <span class="code-key">"role"</span>: <span class="code-string">"Head of Intelligence · Supply4Med"</span>,
  <span class="code-key">"location"</span>: <span class="code-string">"São Paulo, Brazil"</span>,
  <span class="code-key">"focus"</span>: [
    <span class="code-string">"AI &amp; automation adoption"</span>,
    <span class="code-string">"Data &amp; portfolio governance"</span>,
    <span class="code-string">"Healthcare operations"</span>
  ],
  <span class="code-key">"education"</span>: <span class="code-string">"Business Admin + MBA, FGV"</span>,
  <span class="code-key">"languages"</span>: [<span class="code-string">"pt-BR"</span>, <span class="code-string">"en (TOEIC 940)"</span>, <span class="code-string">"es"</span>]
}`,
        'projects-title': 'Featured Projects',
        'omnitwin-title': 'From Technical Simulator to Decision Intelligence: The Evolution of OmniTwin',
        'omnitwin-desc': '<strong>Supply Chain Decision Intelligence</strong> platform integrating discrete event simulation (Digital Twins), real-time P&L and AI-generated insights — reducing the operational analysis cycle from days to <span class="text-accent">minutes</span>.',
        'omnitwin-f1': 'Generative AI (LLMs)',
        'omnitwin-f2': 'Simulated Operation',
        'omnitwin-f3': 'Supply Chain',
        'omnitwin-link': 'View Details',
        'scpb-desc': 'No-Code "Digital Brain" platform that optimizes resilience and working capital in global chains. Works as an <strong>Agility Layer</strong> over SAP IBP and o9 — delivering risk analysis that would take weeks in <span class="text-accent">a single session</span>.',
        'lotusesc-desc': 'Robust platform for Lótus Scout Group (460 members) that digitized monthly fees, reimbursements and youth progression — zeroing operational cost and <span class="text-accent">eliminating 100% of manual processes</span>.',
        'scpb-f1': 'Generative AI (LLMs)',
        'scpb-f2': 'Monte Carlo Simulation',
        'scpb-f3': 'Sensitivity Analysis',
        'scpb-link': 'View Details',
        'scpb-link2': 'View New Features',
        'ats-desc': 'Gamified platform for talent selection in logic, critical thinking and prompt engineering. <strong>Natural Language</strong>.',
        'ats-f1': 'Google Gemini',
        'ats-f2': 'AI Chatbot',
        'ats-f3': 'NLP Interface',
        'ats-link': 'View Details',
        'maa-desc': 'Virtual assistant integrated with Odoo ERP and Microsoft Teams, designed to facilitate business management through natural language commands. <strong>Natural Language</strong>.',
        'maa-f1': 'Retrieval Augmented Generation (RAG)',
        'maa-f2': 'AI Chatbot',
        'maa-f3': 'NLP Interface',
        'maa-link': 'View Details',
        'articles-title': 'Articles & Insights',
        'art1-title': 'The Productivity of Vibe Coding and the Rigor of Engineering',
        'art1-summary': 'AI tools accelerate technical execution and repetitive code, but fail at complex architecture and debugging. The engineer must maintain sovereignty over the solution design.',
        'art1-link': 'Read Article',
        'art2-title': 'The Silent Revolution',
        'art2-summary': 'Data quality and governance are more critical to AI success than algorithms. The competitive advantage lies in owning exclusive and well-prepared data assets.',
        'art2-link': 'Read Article',
        'art3-title': 'Outlier Analysis',
        'art3-summary': 'Outliers can cause wrong estimates if not treated. I present statistical methods like Z-score, IQR and DBSCAN to identify them and ensure the integrity of ML models.',
        'art3-link': 'Read Article',
        'art4-title': 'The Cognitive Paradox of AI',
        'art4-summary': 'Generative AI can cause "cognitive atrophy" in professionals. I propose the HAA framework (Human-Augmented Analysis) to ensure the final judgment remains human.',
        'art4-link': 'Read Article',
        'contact-title': "Let's Talk?",
        'contact-subtitle': 'Open to conversations about AI leadership and digital transformation. I reply within 24h.',
        'form-name': 'Your name',
        'form-email': 'Your email',
        'form-project': 'Your message',
        'form-submit': 'Send Message',
        'footer-tagline': 'Built with <span class="text-accent">&lt;/&gt;</span> and great dedication',
    }
};

const typingPhrases = {
    pt: [
        'Head de Inteligência',
        'IA aplicada a operações de saúde',
        'Governança de dados e de portfólio',
        'Transformação digital em setor regulado',
        'Ex-EY · Rio 2016 · MBA FGV'
    ],
    en: [
        'Head of Intelligence',
        'AI applied to healthcare operations',
        'Data and portfolio governance',
        'Digital transformation in regulated sectors',
        'Ex-EY · Rio 2016 · FGV MBA'
    ]
};

let currentLang = localStorage.getItem('lang') || 'pt';

document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
    initTypingEffect();
    initSmoothScroll();
    initMobileMenu();
    initScrollReveal();
    initNavHighlight();
    initLanguageToggle();
    initThemeToggle();
});

/* =========================================
   LANGUAGE TOGGLE
   ========================================= */
function initLanguageToggle() {
    const toggle = document.getElementById('langToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        currentLang = currentLang === 'pt' ? 'en' : 'pt';
        localStorage.setItem('lang', currentLang);
        applyLanguage(currentLang);
    });
}

function applyLanguage(lang) {
    // As traducoes dos cards vem de data/i18n-gerado.js, emitido por
    // scripts/gerar.mjs a partir de data/projetos.json e data/artigos.json.
    // Sem isso, os cards gerados ficariam em portugues ao trocar para EN.
    const geradas = (window.TRADUCOES_GERADAS && window.TRADUCOES_GERADAS[lang]) || {};
    const t = Object.assign({}, translations[lang], geradas);

    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) el.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (t[key] !== undefined) el.innerHTML = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key] !== undefined) el.placeholder = t[key];
    });

    // Os cards gerados carregam os dois destinos; o link segue o idioma
    // escolhido. Sem traducao, data-href-en ja aponta para a pagina em pt.
    document.querySelectorAll('[data-href-pt][data-href-en]').forEach(el => {
        const destino = el.getAttribute(lang === 'en' ? 'data-href-en' : 'data-href-pt');
        if (destino) el.setAttribute('href', destino);
    });

    document.querySelectorAll('.lang-opt').forEach(opt => {
        opt.classList.toggle('lang-active', opt.dataset.lang === lang);
    });

    currentLang = lang;
}

/* =========================================
   THEME TOGGLE
   ========================================= */
function initThemeToggle() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('theme', next);
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

/* =========================================
   TYPING EFFECT
   ========================================= */
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const phrases = typingPhrases[currentLang] || typingPhrases.en;
        const currentPhrase = phrases[phraseIndex % phrases.length];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

/* =========================================
   SMOOTH SCROLL
   ========================================= */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                document.querySelector('.nav-links')?.classList.remove('active');

                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* =========================================
   MOBILE MENU
   ========================================= */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        toggle.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            toggle.classList.remove('active');
        }
    });
}

/* =========================================
   SCROLL REVEAL ANIMATIONS
   ========================================= */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-header, .about-content, .about-card, ' +
        '.skill-category, .project-card, .article-card, ' +
        '.contact-card, .highlight-item'
    );

    revealElements.forEach((el) => {
        el.classList.add('reveal');
        const siblings = el.parentElement.querySelectorAll('.reveal');
        const siblingIndex = Array.from(siblings).indexOf(el);
        el.style.transitionDelay = `${siblingIndex * 0.1}s`;
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/* =========================================
   NAVIGATION HIGHLIGHT
   ========================================= */
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* =========================================
   HEADER SCROLL EFFECT
   ========================================= */
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

/* =========================================
   PARALLAX EFFECT FOR BACKGROUND GLOWS
   ========================================= */
document.addEventListener('mousemove', (e) => {
    const glows = document.querySelectorAll('.bg-glow');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    glows.forEach((glow, index) => {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;

        glow.style.transform = `translate(${x}px, ${y}px)`;
    });
});

/* =========================================
   CONSOLE EASTER EGG
   ========================================= */
console.log(`
%c
    _______ _____ _  __
   /_  __/ / / /_/ / / /
    / / / /_/ /_  __/ /
   / / / __  / / / / /
  /_/ /_/ /_/ /_/ /_/

%c
Obrigado por explorar meu portfolio!
Interessado em colaborar? Entre em contato!

thiagokato@gmail.com
linkedin.com/in/thiago-seiki-kato-93a12b/

`,
    'color: #14f0c7; font-family: monospace;',
    'color: #8a99ab; font-size: 12px;'
);
