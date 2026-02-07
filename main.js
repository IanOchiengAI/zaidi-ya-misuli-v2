/* ============================================
   ZAIDI YA MISULI - INTERACTIVE JAVASCRIPT
   ============================================ */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initNavScrollEffect();
    initBackToTop();
    initSmoothNavLinks();
    initMobileMenu();
    initHeroLogoTilt();
    initCardTiltEffect();

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

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    // Create button if it doesn't exist
    let backToTopBtn = document.querySelector('.back-to-top');

    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        backToTopBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
        document.body.appendChild(backToTopBtn);
    }

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Enhanced Mobile Menu
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('[onclick*="mobile-menu"]');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!menuBtn || !mobileMenu) return;

    // Replace onclick with proper event handling
    menuBtn.removeAttribute('onclick');

    menuBtn.addEventListener('click', () => {
        const isOpen = !mobileMenu.classList.contains('hidden');

        if (isOpen) {
            mobileMenu.classList.add('hidden');
            menuBtn.querySelector('i, svg')?.setAttribute('data-lucide', 'menu');
        } else {
            mobileMenu.classList.remove('hidden');
            menuBtn.querySelector('i, svg')?.setAttribute('data-lucide', 'x');
        }

        // Re-render icon
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

/**
 * Accessibility Widget Functionality
 */
const a11yWidget = {
    currentZoom: 100,

    toggle() {
        const widget = document.getElementById('a11y-widget');
        if (widget) {
            widget.classList.toggle('open');
        }
    },

    adjustText(amount) {
        this.currentZoom += amount;
        this.currentZoom = Math.max(80, Math.min(150, this.currentZoom)); // Clamp between 80-150%
        document.documentElement.style.fontSize = this.currentZoom + '%';
    },

    toggleFilter(className) {
        document.body.classList.toggle(className);
    },

    reset() {
        document.body.className = 'bg-white text-brand-black transition-all duration-300';
        document.documentElement.style.fontSize = '100%';
        this.currentZoom = 100;
    }
};

// Expose to global scope for inline handlers
window.toggleWidget = () => a11yWidget.toggle();
window.adjustText = (amount) => a11yWidget.adjustText(amount);
window.toggleFilter = (className) => a11yWidget.toggleFilter(className);
window.resetA11y = () => a11yWidget.reset();

/**
 * Stagger Animation Helper
 * Add 'stagger-parent' class to container
 * Add 'stagger-item' class to children
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

// Initialize stagger on load
// Initialize stagger on load
document.addEventListener('DOMContentLoaded', initStaggerAnimation);

/**
 * 3D Hero Logo Tilt Effect
 * Reacts to mouse movement over the hero section
 */
function initHeroLogoTilt() {
    const logo = document.querySelector('.animate-float');

    if (!logo) return;

    // Add the specific class for 3D rendering
    logo.classList.add('hero-logo-tilt');

    // Attach listener directly to the logo (like the cards)
    logo.addEventListener('mousemove', (e) => {
        const rect = logo.getBoundingClientRect();

        // Calculate position relative to the element (not viewport)
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation (max 15 degrees)
        // 0.5 is center, result is -0.5 to 0.5
        const xRotation = ((y / rect.height) - 0.5) * -15; // Invert Y
        const yRotation = ((x / rect.width) - 0.5) * 15;

        // Apply transform with perspective
        logo.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.05)`;

        // Pause the floating animation while interacting so tilt is smooth
        logo.style.animationPlayState = 'paused';
    });

    logo.addEventListener('mouseleave', () => {
        // Reset position with smooth transition
        logo.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';

        // Resume floating animation after a short delay to let transition finish
        setTimeout(() => {
            logo.style.animation = 'float 6s ease-in-out infinite';
            logo.style.animationPlayState = 'running';
        }, 300);
    });
}

/**
 * Dynamic 3D Card Tilt Effect
 * Applies to all elements with .tilt-card class
 */
function initCardTiltEffect() {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation (max 10 degrees)
            // 0.5 is center, result is -0.5 to 0.5
            const xRotation = ((y / rect.height) - 0.5) * -10; // Invert Y
            const yRotation = ((x / rect.width) - 0.5) * 10;

            // Use requestAnimationFrame for smoother performance if needed, 
            // but direct style update is usually fine for simple tilt
            card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}
