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
        'hero-status': 'Disponível para projetos e consultoria',
        'hero-greeting': 'Olá, eu sou',
        'hero-description': 'Transformando cadeias de suprimentos em operações resilientes através de <span class="text-accent">Inteligência Artificial</span> e <span class="text-accent">Data Science</span>',
        'btn-projects': 'Ver Projetos',
        'about-title': 'Sobre Mim',
        'about-lead': 'Profissional com sólida base em <strong>Consultoria Estratégica</strong> (EY, Webb) e expertise na liderança de projetos complexos de Otimização Operacional, Supply Chain e Compras.',
        'about-statement': '"Dedicado a amplificar o potencial humano através da construção de ecossistemas guiados por IA que eliminam o atrito manual. Sou especialista em \'Devolver Tempo\' às equipes, transferindo o trabalho de tarefas repetitivas e de baixo valor para contribuições estratégicas e de alto impacto por meio de GenAI e agentes autônomos."',
        'about-p1': 'Especialista em unir visão de negócio à tecnologia de ponta, com foco atual no desenvolvimento de ferramentas de <span class="text-accent">Resiliência</span> e <span class="text-accent">Inteligência Analítica</span>.',
        'about-p2': 'Desenvolvedor da plataforma autoral <strong>Supply Chain Pipeline Builder</strong>, um ecossistema de "Cérebro Digital" que utiliza IA Generativa (LLMs) e Simulação de Monte Carlo para otimização de capital de giro e gestão de riscos globais.',
        'highlight-exp': 'Anos de Experiência',
        'highlight-regional': 'Projetos Regionais',
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
        'contact-subtitle': 'Tem um projeto em mente? Me conta — respondo em até 24h.',
        'form-name': 'Seu nome',
        'form-email': 'Seu email',
        'form-project': 'Descreva seu projeto ou desafio',
        'form-submit': 'Enviar Mensagem',
        'footer-tagline': 'Construído com <span class="text-accent">&lt;/&gt;</span> e muita dedicação',
    },
    en: {
        'nav-about': 'About',
        'nav-projects': 'Projects',
        'nav-articles': 'Articles',
        'nav-contact': 'Contact',
        'hero-status': 'Available for freelance projects & consulting',
        'hero-greeting': 'Hello, I am',
        'hero-description': 'Transforming supply chains into resilient operations through <span class="text-accent">Artificial Intelligence</span> and <span class="text-accent">Data Science</span>',
        'btn-projects': 'View Projects',
        'about-title': 'About Me',
        'about-lead': 'Professional with a strong background in <strong>Strategic Consulting</strong> (EY, Webb) and expertise leading complex Operational Optimization, Supply Chain and Procurement projects.',
        'about-statement': '"Dedicated to amplifying human potential by building AI-driven ecosystems that eliminate manual friction. I specialize in \'Returning Time\' to teams by shifting work from repetitive, low-value tasks to strategic, high-impact contributions through GenAI and autonomous agents."',
        'about-p1': 'Specialist in bridging business vision with cutting-edge technology, currently focused on developing <span class="text-accent">Resilience</span> and <span class="text-accent">Analytical Intelligence</span> tools.',
        'about-p2': 'Developer of the proprietary platform <strong>Supply Chain Pipeline Builder</strong>, a "Digital Brain" ecosystem that uses Generative AI (LLMs) and Monte Carlo Simulation for working capital optimization and global risk management.',
        'highlight-exp': 'Years of Experience',
        'highlight-regional': 'Regional Projects',
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
        'contact-subtitle': 'Have a project in mind? Tell me — I reply within 24h.',
        'form-name': 'Your name',
        'form-email': 'Your email',
        'form-project': 'Describe your project or challenge',
        'form-submit': 'Send Message',
        'footer-tagline': 'Built with <span class="text-accent">&lt;/&gt;</span> and great dedication',
    }
};

const typingPhrases = {
    pt: [
        'Especialista em Supply Chain',
        'Arquiteto de Soluções de IA',
        'Especialista em Data Science',
        'Otimizador de Processos',
        'Desenvolvedor LLM'
    ],
    en: [
        'Supply Chain Specialist',
        'AI Solutions Architect',
        'Data Science Expert',
        'Process Optimizer',
        'LLM Developer'
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
    const t = translations[lang];

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
