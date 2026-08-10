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
    initStickyLegal();
    initBacCalculator();
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

// Sticky legal bar — present on all pages. Keeps the required legal links
// (privacy, terms, impressum) reachable from any scroll position so they are
// always on screen. Shown whenever the footer (which carries the same links) is
// out of view; hidden once the footer is reached to avoid duplication.
function initStickyLegal() {
    const bar = document.getElementById('sticky-cta');
    if (!bar) return;
    const footer = document.querySelector('.glass-footer');
    if (!footer) {
        // No footer to key off — keep the links visible.
        bar.classList.add('visible');
        return;
    }
    const observer = new IntersectionObserver(entries => {
        bar.classList.toggle('visible', !entries[0].isIntersecting);
    }, { threshold: 0 });
    observer.observe(footer);
}

// Blood-alcohol (promille) calculator on the promille-calculator article.
// A direct port of the app's services/bac.ts — the numbers shown here and in the app
// must match exactly, so do not "improve" the maths on one side only. In particular the
// missing absorption correction is deliberate: raw Widmark assumes all the ethanol
// reaches the blood, which over-estimates, and every rounding here points the same way
// (higher value, longer wait) because that is the only direction that cannot hurt
// someone acting on the result.
function initBacCalculator() {
    const root = document.querySelector('.bac-calc');
    if (!root) return; // script.js loads on every page; the widget is on one article.

    const ELIMINATION_PER_HOUR = 0.15;
    const LEGAL_MARKER_PROMILLE = 0.5;
    const DEFAULT_BODY_WEIGHT_KG = 75;

    const locale = root.dataset.locale || 'en';
    const unitH = root.dataset.unitH || 'h';
    const unitMin = root.dataset.unitMin || 'min';
    const belowStart = root.dataset.belowStart || '';

    const el = id => root.querySelector('#' + id);
    const inGrams = el('bac-grams');
    const inWeight = el('bac-weight');
    const inGender = el('bac-gender');
    const inHours = el('bac-hours');
    const outHours = el('bac-hours-out');
    const outCurrent = el('bac-current');
    const outPeak = el('bac-peak');
    const outMarker = el('bac-marker');
    const outZero = el('bac-zero');
    if (!inGrams || !inWeight || !inGender || !inHours) return;

    // Widmark distribution factor r — the fraction of body mass alcohol spreads into.
    // 'other'/unset falls back to the midpoint rather than guessing a body composition.
    function distributionFactor(gender) {
        if (gender === 'male') return 0.7;
        if (gender === 'female') return 0.6;
        return 0.65;
    }

    function hoursToTarget(peak, target) {
        return Math.max(0, (peak - target) / ELIMINATION_PER_HOUR);
    }

    // Whole hours + minutes, rounded UP to the next 5 minutes: rounding down would
    // understate a wait, which is the unsafe direction.
    function formatDuration(hours) {
        const totalMin = Math.ceil((Math.max(0, hours) * 60) / 5) * 5;
        const h = Math.floor(totalMin / 60);
        const m = totalMin % 60;
        if (h === 0) return `${m} ${unitMin}`;
        if (m === 0) return `${h} ${unitH}`;
        return `${h} ${unitH} ${m} ${unitMin}`;
    }

    // Two decimals: one collapses all resolution around the 0.5 marker, three implies
    // a precision this estimate does not have.
    function formatPromille(value) {
        return value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ‰';
    }

    function update() {
        const grams = Math.max(0, parseFloat(inGrams.value) || 0);
        const rawWeight = parseFloat(inWeight.value) || 0;
        const weight = rawWeight > 0 ? rawWeight : DEFAULT_BODY_WEIGHT_KG;
        const hours = Math.max(0, parseFloat(inHours.value) || 0);
        const r = distributionFactor(inGender.value);

        // Widmark: c = A / (m x r). The whole day's intake is treated as the peak at t=0.
        const peak = grams / (weight * r);
        const current = Math.max(0, peak - ELIMINATION_PER_HOUR * hours);

        if (outHours) outHours.textContent = hours.toLocaleString(locale, { maximumFractionDigits: 1 }) + ' ' + unitH;
        if (outCurrent) outCurrent.textContent = formatPromille(current);
        if (outPeak) outPeak.textContent = formatPromille(peak);
        // null when the peak never exceeded the marker, so we can say "below from the
        // start" rather than a misleading "0 min".
        if (outMarker) outMarker.textContent = peak > LEGAL_MARKER_PROMILLE
            ? formatDuration(hoursToTarget(peak, LEGAL_MARKER_PROMILLE))
            : belowStart;
        if (outZero) outZero.textContent = formatDuration(hoursToTarget(peak, 0));
    }

    [inGrams, inWeight, inGender, inHours].forEach(input => {
        input.addEventListener('input', update);
        input.addEventListener('change', update);
    });
    update();
}

// Scroll-spy for section sidebar nav
// 4. Smooth Scroll for Anchor Links (Chrome/Safari compatibility)
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const rawHash = this.getAttribute('href').substring(1);
            // Fragments for non-ASCII headings (DE/RU TOCs) arrive percent-encoded,
            // but the element IDs are literal Unicode — decode before lookup.
            let targetId = rawHash;
            try { targetId = decodeURIComponent(rawHash); } catch (err) { /* malformed, keep raw */ }
            const targetElement = document.getElementById(targetId) || document.getElementById(rawHash);

            if (targetElement) {
                e.preventDefault();
                // Rely on CSS scroll-padding-top for the sticky header offset.
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Update URL without jump
                history.pushState(null, null, `#${rawHash}`);
            }
        });
    });
}
