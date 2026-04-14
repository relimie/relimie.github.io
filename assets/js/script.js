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
    startCarousel();
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
// Simple Carousel Logic
function startCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    const intervalTime = 4000; // 4 seconds

    setInterval(() => {
        if (!slides[currentSlide]) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        if (!slides[currentSlide]) return;
        slides[currentSlide].classList.add('active');
    }, intervalTime);
}
