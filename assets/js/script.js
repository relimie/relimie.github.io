document.addEventListener('DOMContentLoaded', () => {
    const defaultLang = 'en';

    // 1. Get Language from Path
    function getLanguageFromUrl() {
        const path = window.location.pathname;
        if (path.includes('/de/')) return 'de';
        if (path.includes('/ru/')) return 'ru';
        if (path.includes('/en/')) return 'en';
        return null; // For root index.html
    }

    let currentLang = getLanguageFromUrl() || localStorage.getItem('site_lang') || navigator.language.split('-')[0] || defaultLang;

    if (!['en', 'de', 'ru'].includes(currentLang)) {
        currentLang = defaultLang;
    }
    
    // Attempt saving user preference if we're not at root
    if (getLanguageFromUrl()) {
        localStorage.setItem('site_lang', currentLang);
    }

    // Initialize UI
    loadTranslations(currentLang);
    initHamburger();
    initPrivacyBanner(currentLang);
    initSmoothScroll();
    startCarousel();
    initScrollReveal();
    initStickyCta();
    initScrollSpy();
});

// Load static localized strings via data-i18n tags
function loadTranslations(lang) {
    try {
        const langData = translations[lang] || translations['en'];
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (langData[key]) {
                const text = langData[key];
                element.innerText = text;
            }
        });

        document.documentElement.lang = lang;
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close menu automatically on larger screens
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                hamburger.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
    }
}

// Minimal Privacy/Cookie Banner Logic
function initPrivacyBanner(lang) {
    if (window.location.search.includes('reset=1')) {
        localStorage.removeItem('privacy_accepted');
    }
    if (localStorage.getItem('privacy_accepted')) return;

    const langData = translations[lang] || translations['en'];

    const banner = document.createElement('div');
    banner.className = 'privacy-banner';
    banner.innerHTML = `
        <p>${langData.privacyNotice}</p>
        <button class="privacy-btn">${langData.privacyAccept}</button>
    `;

    document.body.appendChild(banner);

    // Show with slight delay
    setTimeout(() => {
        banner.classList.add('show');
    }, 1000);

    banner.querySelector('.privacy-btn').addEventListener('click', () => {
        banner.classList.remove('show');
        localStorage.setItem('privacy_accepted', 'true');
        setTimeout(() => {
            if (document.body.contains(banner)) {
                document.body.removeChild(banner);
            }
        }, 600);
    });
}
// Carousel Logic — handles multiple independent carousels
function startCarousel() {
    document.querySelectorAll('.ls-carousel').forEach(container => {
        const slides = container.querySelectorAll('.carousel-slide');
        if (slides.length < 2) return;
        let current = 0;
        setInterval(() => {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 4000);
    });
}

// Scroll reveal for landing sections
function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal-section');
    if (targets.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    targets.forEach(el => observer.observe(el));
}

// Sticky App Store CTA — present on all pages.
// Index page: appears once Section 1 store badges scroll out of view.
// All other pages: shown immediately on load.
function initStickyCta() {
    const cta = document.getElementById('sticky-cta');
    if (!cta) return;
    const heroStore = document.querySelector('#ls-hero .store-section');
    if (!heroStore) {
        // Not the index page — show right away
        cta.classList.add('visible');
        return;
    }
    const observer = new IntersectionObserver(entries => {
        cta.classList.toggle('visible', !entries[0].isIntersecting);
    }, { threshold: 0 });
    observer.observe(heroStore);
}

// Scroll-spy for section sidebar nav
function initScrollSpy() {
    const nav = document.getElementById('section-nav');
    if (!nav) return;

    const sectionIds = ['ls-hero', 'ls-diary', 'ls-logging', 'ls-analytics', 'ls-cravings'];
    const items = nav.querySelectorAll('.section-nav-item');

    function updateActive() {
        const center = window.innerHeight / 2;
        let closest = null;
        let minDist = Infinity;

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const dist = Math.abs(rect.top + rect.height / 2 - center);
            if (dist < minDist) { minDist = dist; closest = id; }
        });

        items.forEach(item => {
            item.classList.toggle('active', item.dataset.section === closest);
        });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
}

// 4. Smooth Scroll for Anchor Links (Chrome/Safari compatibility)
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // We use scrollIntoView if available, but calculate manually to respect scroll-padding in JS
                // or just rely on the CSS scroll-padding-top if the browser supports it.
                // Modern browsers supporting scroll-behavior will work with just this.
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Update URL without jump
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}
