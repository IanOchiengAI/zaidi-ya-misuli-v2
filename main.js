/* ============================================
   ZAIDI YA MISULI - INTERACTIVE JAVASCRIPT
   ============================================ */
import './src/style.css';
import { inject } from '@vercel/analytics';

// Initialize Vercel Analytics
inject();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
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
