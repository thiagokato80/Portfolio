/* =========================================
   THIAGO SEIKI KATO - PORTFOLIO
   JavaScript Interactions & Animations
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initTypingEffect();
    initSmoothScroll();
    initMobileMenu();
    initScrollReveal();
    initNavHighlight();
});

/* =========================================
   TYPING EFFECT
   ========================================= */
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const phrases = [
        'Supply Chain Specialist',
        'AI Solutions Architect',
        'Data Science Expert',
        'Process Optimizer',
        'LLM Developer'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

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
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before next phrase
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing after a short delay
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
                // Close mobile menu if open
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

    // Close menu when clicking outside
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
    // Add reveal class to elements
    const revealElements = document.querySelectorAll(
        '.section-header, .about-content, .about-card, ' +
        '.skill-category, .project-card, .article-card, ' +
        '.contact-card, .highlight-item'
    );

    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        // Add stagger delay based on index within parent
        const siblings = el.parentElement.querySelectorAll('.reveal');
        const siblingIndex = Array.from(siblings).indexOf(el);
        el.style.transitionDelay = `${siblingIndex * 0.1}s`;
    });

    // Intersection Observer for reveal
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

    // Add/remove scrolled class for styling
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
