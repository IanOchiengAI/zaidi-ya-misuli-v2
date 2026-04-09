/* ============================================
   ZAIDI YA MISULI - INTERACTIVE JAVASCRIPT
   ============================================ */
import './src/style.css';
import { trackPageView } from './src/analytics.js';
import { fetchContent } from './src/firebase.js';

// Track page view
trackPageView();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function () {
    // Fetch dynamic content from CMS
    await initFirebaseCMS();

    // Core initializations
    initScrollReveal();
    initNavScrollEffect();
    initBackToTop();
    initSmoothNavLinks();
    initMobileMenu();
    initHeroLogoTilt();
    initCardTiltEffect();
    initA11y();
    initStaggerAnimation();

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

/**
 * Scroll Reveal Animation
 * Uses Intersection Observer for performance
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if (!revealElements.length) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay based on element position
                const delay = entry.target.dataset.delay || (index * 100);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Navigation Background on Scroll
 */
function initNavScrollEffect() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    let backToTopBtn = document.querySelector('.back-to-top');

    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        backToTopBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
        document.body.appendChild(backToTopBtn);
    }

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Smooth Scroll for Navigation Links
 */
function initSmoothNavLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/**
 * Enhanced Mobile Menu
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent bubbling since lucide.createIcons removes e.target
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            menuBtn.querySelector('i, svg')?.setAttribute('data-lucide', 'x');
        } else {
            mobileMenu.classList.add('hidden');
            menuBtn.querySelector('i, svg')?.setAttribute('data-lucide', 'menu');
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });

    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            menuBtn.querySelector('i, svg')?.setAttribute('data-lucide', 'menu');
        }
    });
}

// Utility to safely set text content
const setField = (id, text) => {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
};

// ============================================
// DYNAMIC CMS ROUTER
// ============================================
async function initFirebaseCMS() {
    const path = window.location.pathname;
    
    // Add brief fading class to body to prevent text jumps
    document.body.classList.add('transition-opacity', 'duration-500', 'opacity-0');
    
    if (path === '/' || path.endsWith('index.html')) {
        await initHome();
    } else if (path.includes('about')) {
        await initAbout();
    } else if (path.includes('pillars')) {
        await initPillars();
    } else if (path.includes('resources')) {
        await initResources();
    } else if (path.includes('contact')) {
        await initContact();
    }

    // Fade back in
    requestAnimationFrame(() => {
        document.body.classList.remove('opacity-0');
    });
}

// ============================================
// PAGE-SPECIFIC LOADERS
// ============================================

async function initHome() {
    const data = await fetchContent('home');
    if (!data) return;
    
    setField('home-hero-title', data.heroTitle);
    setField('home-hero-subtitle', data.heroSubtitle);
    setField('home-hero-description', data.heroDescription);
    setField('home-cta-text', data.ctaText);
    setField('home-vision', data.vision);
    setField('home-cta-title', data.ctaTitle);
    setField('home-cta-description', data.ctaDescription);
}

async function initAbout() {
    const data = await fetchContent('about');
    if (!data) return;

    setField('about-history-1', data.history1);
    setField('about-history-2', data.history2);
    setField('about-history-3', data.history3);
    setField('about-team1-name', data.team1Name);
    setField('about-team1-title', data.team1Title);
    setField('about-team1-bio', data.team1Bio);
    setField('about-team2-name', data.team2Name);
    setField('about-team2-title', data.team2Title);
    setField('about-team2-bio', data.team2Bio);
    setField('about-summary', data.summary);
    
    const t1lnk = document.getElementById('about-team1-linkedin');
    if (t1lnk && data.team1LinkedIn) {
        t1lnk.href = data.team1LinkedIn;
        t1lnk.style.display = 'flex';
    }
    const t2lnk = document.getElementById('about-team2-linkedin');
    if (t2lnk && data.team2LinkedIn) {
        t2lnk.href = data.team2LinkedIn;
        t2lnk.style.display = 'flex';
    }
}

async function initPillars() {
    const data = await fetchContent('pillars');
    if (!data) return;

    setField('pillars-quote', data.quote);
    setField('pillar1-title', data.pillar1Title);
    setField('pillar1-description', data.pillar1Description);
    setField('pillar2-title', data.pillar2Title);
    setField('pillar2-description', data.pillar2Description);
    setField('pillar3-title', data.pillar3Title);
    setField('pillar3-description', data.pillar3Description);
}

async function initResources() {
    const data = await fetchContent('resources');
    if (!data || !data.items) return;

    const grid = document.getElementById('resources-grid');
    if (!grid) return;
    
    grid.innerHTML = ''; // clear hardcoded elements
    
    data.items.forEach(item => {
        const isMedia = item.category === 'media';
        const colorClass = isMedia ? 'text-coral' : 'text-primary';
        const bgClass = isMedia ? 'bg-coral/10' : 'bg-primary/10';
        
        const iconSvg = isMedia 
            ? `<i data-lucide="play-circle" class="w-6 h-6 ${colorClass}"></i>`
            : `<i data-lucide="file-text" class="w-6 h-6 ${colorClass}"></i>`;

        const descHTML = item.description 
            ? `<p class="text-sm text-neutral-dark mb-4 group-hover:text-neutral-900 line-clamp-2">${item.description}</p>`
            : '';

        grid.innerHTML += `
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" 
               class="group relative bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block h-full flex flex-col">
                
                <div class="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div class="relative z-10 flex flex-col h-full">
                    <div class="flex items-start justify-between mb-4">
                        <div class="${bgClass} p-3 rounded-xl">
                            ${iconSvg}
                        </div>
                        <i data-lucide="external-link" class="w-5 h-5 text-neutral opacity-0 group-hover:opacity-100 group-hover:${colorClass} transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1"></i>
                    </div>
                    
                    <h3 class="font-display font-bold text-xl text-primary-dark mb-2 group-hover:text-primary transition-colors">${item.title}</h3>
                    
                    ${descHTML}
                    
                    <div class="mt-auto pt-4 flex items-center justify-between border-t border-neutral-light/50">
                        <span class="text-xs font-bold uppercase tracking-wider ${colorClass} bg-white px-3 py-1 rounded-full shadow-sm">
                            ${item.category}
                        </span>
                        <span class="text-xs font-semibold text-neutral flex items-center gap-1 group-hover:${colorClass} transition-colors">
                            View resource <i data-lucide="arrow-right" class="w-3 h-3"></i>
                        </span>
                    </div>
                </div>
            </a>
        `;
    });
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

async function initContact() {
    const data = await fetchContent('contact');
    if (!data) return;

    setField('contact-welcome', data.welcome);
    setField('contact-location', data.location);
    setField('contact-email', data.email);
    setField('contact-phone', data.phone);
}


/**
 * Accessibility Widget Functionality
 */
const a11yWidget = {
    currentZoom: 100,
    isDyslexic: false,

    toggle() {
        const widget = document.getElementById('a11y-widget');
        if (widget) widget.classList.toggle('open');
    },

    adjustText(amount) {
        this.currentZoom += amount;
        this.currentZoom = Math.max(80, Math.min(150, this.currentZoom));
        document.documentElement.style.fontSize = this.currentZoom + '%';
    },

    toggleFilter(className) {
        document.body.classList.toggle(className);
    },

    toggleDyslexic() {
        this.isDyslexic = !this.isDyslexic;
        document.body.classList.toggle('dyslexic-font');
    },

    reset() {
        document.body.className = 'bg-white text-brand-black transition-all duration-300';
        document.documentElement.style.fontSize = '100%';
        this.currentZoom = 100;
        this.isDyslexic = false;
        document.body.classList.remove('dyslexic-font');
    }
};

window.toggleWidget = () => a11yWidget.toggle();
window.adjustText = (amount) => a11yWidget.adjustText(amount);
window.toggleFilter = (className) => a11yWidget.toggleFilter(className);
window.toggleDyslexic = () => a11yWidget.toggleDyslexic();
window.resetA11y = () => a11yWidget.reset();

/**
 * Stagger Animation Helper
 */
function initStaggerAnimation() {
    document.querySelectorAll('.stagger-parent').forEach(parent => {
        const children = parent.querySelectorAll('.stagger-item');
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 150);
                });
                observer.unobserve(parent);
            }
        }, { threshold: 0.2 });
        observer.observe(parent);
    });
}

/**
 * 3D Hero Logo Tilt Effect
 */
function initHeroLogoTilt() {
    const logo = document.querySelector('.animate-float');
    if (!logo) return;

    logo.classList.add('hero-logo-tilt');
    logo.addEventListener('mouseenter', () => {
        logo.classList.remove('animate-float');
        logo.style.animation = 'none';
    });

    logo.addEventListener('mousemove', (e) => {
        const rect = logo.getBoundingClientRect();
        const xRotation = (((e.clientY - rect.top) / rect.height) - 0.5) * -15;
        const yRotation = (((e.clientX - rect.left) / rect.width) - 0.5) * 15;
        logo.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.05)`;
    });

    logo.addEventListener('mouseleave', () => {
        logo.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        setTimeout(() => {
            logo.style.animation = '';
            logo.classList.add('animate-float');
        }, 300);
    });
}

/**
 * Dynamic 3D Card Tilt Effect
 */
function initCardTiltEffect() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const xRotation = (((e.clientY - rect.top) / rect.height) - 0.5) * -15;
            const yRotation = (((e.clientX - rect.left) / rect.width) - 0.5) * 15;
            card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.05)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

/**
 * Initialize Accessibility Widget
 */
function initA11y() {
    const toggleBtn = document.getElementById('a11y-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => a11yWidget.toggle());
    }
}
