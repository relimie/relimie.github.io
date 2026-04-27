const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { gfmHeadingId } = require('marked-gfm-heading-id');

marked.use(gfmHeadingId());
marked.setOptions({ breaks: true, gfm: true });

const root = 'c:/GitHub/relimie.github.io';
const langs = ['en', 'de', 'ru'];
const pagesText = ['privacy', 'impressum', 'terms', 'guide', 'privacy_web', 'support', 'whats_new', 'faq', 'android', 'videos', 'cravings'];

const fileMap = {
    'privacy': 'privacy_policy',
    'impressum': 'impressum',
    'terms': 'terms_of_service',
    'guide': 'USER_GUIDE',
    'privacy_web': 'privacy_web',
    'support': 'support',
    'whats_new': 'whats_new',
    'votes': 'votes',
    'faq': 'faq',
    'android': 'android',
    'videos': 'videos',
    'cravings': 'cravings'
};

const getPageTitle = (page) => {
    switch(page) {
        case 'privacy': return 'Privacy Policy';
        case 'privacy_web': return 'Website Privacy';
        case 'impressum': return 'Impressum';
        case 'terms': return 'Terms of Service';
        case 'guide': return 'User Guide';
        case 'support': return 'Support';
        case 'whats_new': return 'Release News';
        case 'votes': return 'Feature Votes';
        case 'faq': return 'FAQ';
        case 'android': return 'Android Open Test';
        case 'videos': return 'Video Guides';
        case 'cravings': return 'Cravings Breaker';
        default: return 'Relimie';
    }
};

const getPageTitleFull = (page, lang) => {
    if (page === 'index') {
        if (lang === 'de') return 'Relimie – Achtsamer Trink-Tracker für iPhone';
        if (lang === 'ru') return 'Relimie – Осознанный трекер употребления алкоголя';
        return 'Relimie – Mindful Drinking Tracker for iPhone';
    }
    if (page === 'guide') {
        if (lang === 'de') return 'Relimie – Alkohol tracken & Getränke loggen | Anleitung';
        if (lang === 'ru') return 'Relimie – Как вести учёт алкоголя | Руководство';
        return 'Relimie – How to Track Alcohol Intake | User Guide';
    }
    if (page === 'faq') {
        if (lang === 'de') return 'Relimie – FAQ: Baseline, Getränke loggen & Heißhunger';
        if (lang === 'ru') return 'Relimie – FAQ: ориентир, журнал и тяга к алкоголю';
        return 'Relimie – Alcohol Tracking FAQ: Baseline, Logging & Cravings';
    }
    if (page === 'cravings') {
        if (lang === 'de') return 'Relimie – Alkoholverlangen stoppen | 4-7-8 Atemübung';
        if (lang === 'ru') return 'Relimie – Справиться с тягой к алкоголю | Дыхание 4-7-8';
        return 'Relimie – Stop Alcohol Cravings | 4-7-8 Breathing Exercise';
    }
    return `Relimie – ${getPageTitle(page)}`;
};

const getPageDescription = (page, lang) => {
    const desc = {
        en: {
            index: 'Reduce alcohol intake mindfully. Free drink logging, calorie & spending tracking, emotional trigger diary. iPhone app — private by design, no account needed.',
            guide: 'How to track alcohol intake and build better drinking habits — complete guide to Relimie: baseline setup, drink logging, triggers, and analytics.',
            faq: 'Answers to common questions about tracking alcohol, setting a baseline, managing cravings, and staying private — Relimie FAQ.',
            cravings: 'Stop alcohol cravings in real time with guided 4-7-8 breathing. A free mindfulness tool built into Relimie — no premium needed.',
            privacy: 'Relimie privacy policy. All your data stays on your device. No cloud storage, no third-party access, no tracking. Ever.',
            terms: 'Terms of service for Relimie — the mindful drinking companion app for iPhone.',
            impressum: 'Legal disclosure and contact information for Relimie.',
            whats_new: "What's new in Relimie v2.0.1 — interactive Orb, AI-powered drink logging, and more.",
            videos: 'Video guides for Relimie — tutorials on setting your baseline, logging drinks, and using the Cravings Breaker.',
            support: 'Get support for Relimie. Contact us for help with the mindful drinking tracker app.',
            android: 'Relimie for Android is coming soon. Join the open test and be the first to try the mindful drinking app on Android.',
            votes: 'Vote on upcoming features for Relimie — help shape the future of the mindful drinking companion app.',
            privacy_web: 'Website privacy notice for relimie.com — no cookies, no tracking scripts, no personal data collected.',
        },
        de: {
            index: 'Alkohol reduzieren ohne harte Regeln. Kostenlose Getränkeprotokollierung, Kalorien- und Ausgaben-Tracking. Kein Account, keine Cloud.',
            guide: 'Alkoholkonsum kontrollieren Schritt für Schritt: Baseline einstellen, Getränke loggen, Auslöser tracken und Heißhunger stoppen.',
            faq: 'Antworten auf häufige Fragen zu Alkohol-Tracking, Baseline, Heißhunger-Stopper und Datenschutz.',
            cravings: 'Alkoholverlangen sofort stoppen: die 4-7-8-Atemtechnik als mentaler Reset. Kostenlos in Relimie für iPhone.',
            privacy: 'Datenschutzerklärung für Relimie. Alle Daten bleiben auf deinem Gerät. Kein Cloud-Speicher, kein Tracking.',
            terms: 'Nutzungsbedingungen für Relimie — den achtsamen Trink-Begleiter für iPhone.',
            impressum: 'Impressum für Relimie — gesetzliche Pflichtangaben und Kontaktinformationen.',
            whats_new: 'Neu in Relimie v2.0.1 — interaktive Sphäre, KI-Protokollierung und mehr.',
            videos: 'Video-Anleitungen für Relimie — Tutorials zu Baseline, Getränken und Heißhunger-Stopper.',
            support: 'Support für Relimie — Kontakt bei Fragen zur App.',
            android: 'Relimie für Android kommt bald. Melde dich zum offenen Test an.',
            votes: 'Stimme über neue Funktionen für Relimie ab — gestalte die Zukunft der App mit.',
            privacy_web: 'Website-Datenschutz für relimie.com — keine Cookies, kein Tracking.',
        },
        ru: {
            index: 'Снижай потребление алкоголя без жёстких правил. Бесплатный журнал напитков, трекинг триггеров и калорий. Только на устройстве, без облака.',
            guide: 'Как снизить употребление алкоголя: настрой ориентир, веди журнал напитков, отслеживай триггеры и справляйся с тягой.',
            faq: 'Ответы на частые вопросы об отслеживании алкоголя, базовой линии, борьбе с тягой и конфиденциальности.',
            cravings: 'Справиться с тягой к алкоголю прямо сейчас: дыхательная техника 4-7-8 как ментальный сброс. Бесплатно в Relimie.',
            privacy: 'Политика конфиденциальности Relimie. Все данные хранятся только на устройстве. Никаких облаков, никакого отслеживания.',
            terms: 'Условия использования Relimie — осознанного помощника для контроля употребления алкоголя.',
            impressum: 'Юридическая информация и контактные данные Relimie.',
            whats_new: 'Что нового в Relimie v2.0.1 — интерактивная Сфера, ИИ-запись напитков и многое другое.',
            videos: 'Видеогиды по Relimie — уроки по настройке базовой линии, ведению журнала и борьбе с тягой.',
            support: 'Поддержка Relimie — свяжись с нами по вопросам работы приложения.',
            android: 'Relimie для Android скоро выйдет. Присоединись к открытому тестированию.',
            votes: 'Голосуй за новые функции Relimie — помоги сформировать будущее приложения.',
            privacy_web: 'Политика конфиденциальности сайта relimie.com — без cookie, без трекинга, без аналитики.',
        }
    };
    return (desc[lang] && desc[lang][page]) || (desc['en'] && desc['en'][page]) || 'Relimie – Mindful drinking companion app for iPhone.';
};

function getHreflangTags(pageName) {
    const base = 'https://relimie.com';
    return langs.map(l =>
        `    <link rel="alternate" hreflang="${l}" href="${base}/${l}/${pageName}.html">`
    ).join('\n') + `\n    <link rel="alternate" hreflang="x-default" href="${base}/en/${pageName}.html">`;
}

function getSchemaOrg(lang, pageName, isIndex) {
    const orgSchema = `    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://relimie.com/#organization",
      "name": "Relimie",
      "url": "https://relimie.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://relimie.com/icon.png"
      },
      "sameAs": ["https://apps.apple.com/us/app/relimie-track-alcohol-limits/id6759795714"]
    }
    </script>`;

    if (isIndex) {
        return orgSchema + `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://relimie.com/#website",
      "url": "https://relimie.com",
      "name": "Relimie",
      "description": "Mindful drinking companion app for tracking alcohol consumption and habit reflection.",
      "publisher": { "@id": "https://relimie.com/#organization" },
      "inLanguage": ["en", "de", "ru"]
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      "@id": "https://relimie.com/#app",
      "name": "Relimie – Track Alcohol Limits",
      "description": "Relimie is a mindful drinking companion that helps you track alcohol consumption, set a personal baseline, identify emotional triggers, and build healthier drinking habits — without guilt or rigid rules.",
      "url": "https://apps.apple.com/us/app/relimie-track-alcohol-limits/id6759795714",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "iOS",
      "softwareVersion": "2.0.1",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "author": { "@id": "https://relimie.com/#organization" },
      "publisher": { "@id": "https://relimie.com/#organization" },
      "inLanguage": ["en", "de", "ru"],
      "featureList": [
        "Personal baseline drinking tracker",
        "Emotional trigger diary",
        "Drinks logging with AI-powered catalog",
        "Analytics Hub with data export",
        "Cravings Breaker breathing exercise",
        "WHO-based recommendations"
      ]
    }
    </script>`;
    }

    if (pageName === 'faq') {
        const faqPath = path.join(root, 'assets', 'docs', `faq_${lang}.md`);
        if (fs.existsSync(faqPath)) {
            const faqMd = fs.readFileSync(faqPath, 'utf8');
            const matches = [...faqMd.matchAll(/### (.*?)\n(.*?)(?=\n###|$)/gs)];
            if (matches.length > 0) {
                const faqSchema = {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": matches.map(m => ({
                        "@type": "Question",
                        "name": m[1].trim(),
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": m[2].trim().replace(/\[(.*?)\]\(.*?\)/g, '$1')
                        }
                    }))
                };
                return orgSchema + `\n    <script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 4)}\n    </script>`;
            }
        }
    }

    return orgSchema + `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Relimie", "item": "https://relimie.com/${lang}/" },
        { "@type": "ListItem", "position": 2, "name": "${getPageTitle(pageName)}", "item": "https://relimie.com/${lang}/${pageName}.html" }
      ]
    }
    </script>`;
}

// Read all image files from a section subfolder
function getSectionImages(sectionNum) {
    const dir = path.join(root, 'assets', 'images', `section${sectionNum}`);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(f => /^screen\d+\.webp$/i.test(f)).sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
    });
}

const sectionAltTexts = {
    1: ['Relimie Orb – Personal Baseline indicator', 'Relimie Home Screen – baseline tracking view', 'Relimie drink logging interface', 'Relimie baseline settings'],
    2: ['Relimie Diary – emotional trigger tags', 'Relimie morning after-effects check-in'],
    3: ['Relimie drink logging screen', 'Relimie AI drink search feature', 'Relimie daily spending and calorie summary', 'Relimie drink catalog'],
    4: ['Relimie Analytics Hub – habits overview', 'Relimie drinking trends and patterns'],
    5: ['Relimie Cravings Breaker – 4-7-8 breathing exercise']
};

// Build carousel HTML for a given section folder and path prefix
function buildCarousel(sectionNum) {
    const alts = sectionAltTexts[sectionNum] || [];
    const imgs = getSectionImages(sectionNum);
    if (imgs.length === 0) return '<p style="color:var(--text-secondary);text-align:center">Screenshots coming soon</p>';
    return imgs.map((img, i) => {
        const alt = alts[i] || `Relimie app screenshot – section ${sectionNum}`;
        const isLCP = (sectionNum === 1 && i === 0);
        const loadAttr = isLCP ? ' fetchpriority="high"' : ' loading="lazy"';
        return `<img src="../assets/images/section${sectionNum}/${img}" alt="${alt}" class="carousel-slide${i === 0 ? ' active' : ''}"${loadAttr}>`;
    }).join('\n                ');
}

// Ensure folders exist
langs.forEach(lang => {
    const dirPath = path.join(root, lang);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

// Reusable store badge block used in every landing section
const storeBadgeHtml = `
                    <div class="store-section">
                        <a href="https://apps.apple.com/us/app/relimie-track-alcohol-limits/id6759795714" target="_blank" rel="noopener noreferrer">
                            <img alt="Download on the App Store" src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" class="store-badge" width="166" height="56" />
                        </a>
                        <a href="android.html" class="coming-soon-link">
                            <p class="coming-soon" data-i18n="androidComingSoon">Android app coming soon</p>
                        </a>
                    </div>`;

function getTemplate(lang, pageName, isIndex, bodyContent) {
    const title = getPageTitleFull(pageName, lang);
    const description = getPageDescription(pageName, lang);
    const canonicalUrl = `https://relimie.com/${lang}/${pageName}.html`;
    const noIndexPages = ['privacy', 'impressum', 'terms', 'privacy_web'];
    const isNoIndex = noIndexPages.includes(pageName);

    const content = isIndex ? `
        <nav class="section-nav" id="section-nav">
            <a href="#ls-hero" class="section-nav-item active" data-section="ls-hero">
                <span class="section-nav-dot"></span>
                <span class="section-nav-label" data-i18n="navStart">Start</span>
            </a>
            <a href="#ls-diary" class="section-nav-item" data-section="ls-diary">
                <span class="section-nav-dot"></span>
                <span class="section-nav-label" data-i18n="navDiary">Diary</span>
            </a>
            <a href="#ls-logging" class="section-nav-item" data-section="ls-logging">
                <span class="section-nav-dot"></span>
                <span class="section-nav-label" data-i18n="navLogging">Logging</span>
            </a>
            <a href="#ls-analytics" class="section-nav-item" data-section="ls-analytics">
                <span class="section-nav-dot"></span>
                <span class="section-nav-label" data-i18n="navAnalytics">Analytics</span>
            </a>
            <a href="#ls-cravings" class="section-nav-item" data-section="ls-cravings">
                <span class="section-nav-dot"></span>
                <span class="section-nav-label" data-i18n="navCravings">Cravings</span>
            </a>
        </nav>

        <div class="new-version-banner">
            <p data-i18n="newVersionBanner">Version 2.0.1 is now live! Discover the new interactive Orb and AI logging.</p>
            <a href="whats_new.html" class="banner-cta" data-i18n="seeWhatsNew">See what's new</a>
        </div>

        <!-- Section 1: Hero — Who it's for + Baseline -->
        <section class="landing-section" id="ls-hero">
            <div class="ls-card glass-card">
                <div class="ls-media">
                    ${storeBadgeHtml}
                    <div class="ls-carousel">
                        ${buildCarousel(1)}
                    </div>
                </div>
                <div class="ls-text">
                    <h1><span data-i18n="heroTitle">Relimie</span> <span class="version-badge" aria-hidden="true">v2.0.1</span></h1>
                    <p class="subtitle" data-i18n="heroSubtitle">Enjoy the moment without losing your edge.</p>
                    <div class="markdown-body">
                        ${bodyContent.s1}
                    </div>
                    <a href="guide.html" class="glass-btn primary" data-i18n="readGuide">Read the User Guide</a>
                </div>
            </div>
        </section>

        <!-- Section 2: Diary -->
        <section class="landing-section reveal-section" id="ls-diary">
            <div class="ls-card glass-card ls-reversed">
                <div class="ls-text">
                    <div class="markdown-body">
                        ${bodyContent.s2}
                    </div>
                </div>
                <div class="ls-media">
                    ${storeBadgeHtml}
                    <div class="ls-carousel">
                        ${buildCarousel(2)}
                    </div>
                </div>
            </div>
        </section>

        <!-- Section 3: Drinks Logging -->
        <section class="landing-section reveal-section" id="ls-logging">
            <div class="ls-card glass-card">
                <div class="ls-media">
                    ${storeBadgeHtml}
                    <div class="ls-carousel">
                        ${buildCarousel(3)}
                    </div>
                </div>
                <div class="ls-text">
                    <div class="markdown-body">
                        ${bodyContent.s3}
                    </div>
                </div>
            </div>
        </section>

        <!-- Section 4: Analytics -->
        <section class="landing-section reveal-section" id="ls-analytics">
            <div class="ls-card glass-card ls-reversed">
                <div class="ls-text">
                    <div class="markdown-body">
                        ${bodyContent.s4}
                    </div>
                </div>
                <div class="ls-media">
                    ${storeBadgeHtml}
                    <div class="ls-carousel">
                        ${buildCarousel(4)}
                    </div>
                </div>
            </div>
        </section>

        <!-- Section 5: Cravings Breaker -->
        <section class="landing-section reveal-section" id="ls-cravings">
            <div class="ls-card glass-card">
                <div class="ls-media">
                    ${storeBadgeHtml}
                    <div class="ls-carousel">
                        ${buildCarousel(5)}
                    </div>
                </div>
                <div class="ls-text">
                    <div class="markdown-body">
                        ${bodyContent.s5}
                    </div>
                </div>
            </div>
        </section>
    ` : `
        <div class="glass-card page-card">
            <article id="content" class="markdown-body">
                ${bodyContent}
            </article>
        </div>
    `;

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0F172A">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonicalUrl}">
${isNoIndex ? '    <meta name="robots" content="noindex, nofollow">' : ''}
${getHreflangTags(pageName)}
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Relimie">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:image" content="https://relimie.com/icon.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="https://relimie.com/icon.png">
    <link rel="icon" type="image/png" href="../icon.png">
    <link rel="apple-touch-icon" href="../icon.png">
    <link rel="alternate" type="text/plain" title="LLM Context" href="../llms.txt">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap">
    <link rel="stylesheet" href="../assets/css/style.css">${isIndex ? `
    <link rel="preload" as="image" href="../assets/images/section1/screen1.webp">` : ''}
${getSchemaOrg(lang, pageName, isIndex)}
</head>
<body>
    <div class="glow-blob blob-1"></div>
    <div class="glow-blob blob-2"></div>

    <header class="glass-header">
        <div class="header-container">
            <div class="logo-container">
                <a href="index.html" class="logo-link">
                    <img src="../icon.png" alt="Relimie Icon" class="logo-img">
                    <span class="brand-name">Relimie</span>
                </a>
            </div>

            <nav class="main-nav">
                <div class="nav-item has-dropdown">
                    <a href="whats_new.html"><span data-i18n="community">Community</span> <span class="dot-new"></span></a>
                    <div class="dropdown-menu">
                        <a href="android.html" data-i18n="androidTest">Android Open Test</a>
                        <a href="whats_new.html" data-i18n="releaseNews">Release News</a>
                    </div>
                </div>
                <div class="nav-item has-dropdown">
                    <a href="guide.html" data-i18n="guide">Guide</a>
                    <div class="dropdown-menu">
                        <a href="guide.html" data-i18n="userGuide">User Guide</a>
                        <a href="videos.html" data-i18n="videoGuides">Video Guides</a>
                        <a href="faq.html" data-i18n="faq">FAQ</a>
                    </div>
                </div>
            </nav>

            <div class="header-right">
                <div class="lang-switch">
                    <a href="../en/${pageName}.html" class="lang-btn ${lang === 'en' ? 'active' : ''}" data-lang="en">EN</a>
                    <a href="../de/${pageName}.html" class="lang-btn ${lang === 'de' ? 'active' : ''}" data-lang="de">DE</a>
                    <a href="../ru/${pageName}.html" class="lang-btn ${lang === 'ru' ? 'active' : ''}" data-lang="ru">RU</a>
                </div>
                <button class="hamburger" aria-label="Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </header>

    <main>
        ${content}
    </main>

    <footer class="glass-footer">
        <div class="footer-links">
            <a href="terms.html" data-i18n="terms">Terms of Service</a>
            <a href="privacy.html" data-i18n="privacy">Privacy Policy</a>
            <a href="privacy_web.html" data-i18n="websitePrivacy">Website Privacy</a>
            <a href="impressum.html" data-i18n="impressum">Impressum</a>
            <a href="support.html" data-i18n="support">Support</a>
        </div>
        <p class="copyright">&copy; 2026 Relimie</p>
    </footer>

    <!-- Sticky App Store CTA — always visible on scroll (all pages) -->
    <div class="sticky-cta" id="sticky-cta">
        <a href="https://apps.apple.com/us/app/relimie-track-alcohol-limits/id6759795714" target="_blank" rel="noopener noreferrer">
            <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" class="store-badge-sm" alt="Download on the App Store">
        </a>
        <a href="android.html" class="coming-soon-link-sm" data-i18n="androidComingSoon">Android app coming soon</a>
    </div>

    <script src="../assets/js/translations.js"></script>
    <script src="../assets/js/script.js"></script>
</body>
</html>`;
}

langs.forEach(lang => {
    // Read 4 section markdown files for index
    const readMd = (filename) => {
        const filePath = path.join(root, 'assets', 'docs', filename);
        return marked.parse(fs.readFileSync(filePath, 'utf8'));
    };

    const indexContent = {
        s1: readMd(`about_relimie_${lang}.md`),
        s2: readMd(`landing_diary_${lang}.md`),
        s3: readMd(`landing_logging_${lang}.md`),
        s4: readMd(`landing_analytics_${lang}.md`),
        s5: readMd(`cravings_${lang}.md`),
    };

    // Write index
    fs.writeFileSync(path.join(root, lang, 'index.html'), getTemplate(lang, 'index', true, indexContent));

    // Write text pages
    pagesText.forEach(page => {
        const fileName = fileMap[page] || page;
        const filePath = path.join(root, 'assets', 'docs', `${fileName}_${lang}.md`);

        let bodyHtml = '';
        if (fs.existsSync(filePath)) {
            const md = fs.readFileSync(filePath, 'utf8');
            bodyHtml = marked.parse(md);
        } else {
            console.warn(`Warning: Content file not found: ${filePath}`);
            bodyHtml = `<p>Coming Soon</p>`;
        }

        fs.writeFileSync(path.join(root, lang, `${page}.html`), getTemplate(lang, page, false, bodyHtml));
    });
});

// Generate llms-full.txt (Aggregate all core documentation for AI agents)
let llmsFull = `# Relimie - Full Documentation\n\n`;
['about_relimie_en.md', 'landing_diary_en.md', 'landing_logging_en.md', 'landing_analytics_en.md', 'cravings_en.md', 'USER_GUIDE_en.md', 'faq_en.md'].forEach(file => {
    const filePath = path.join(root, 'assets', 'docs', file);
    if (fs.existsSync(filePath)) {
        const title = file.replace('_en.md', '').replace(/landing_|about_/g, '').replace(/_/g, ' ').toUpperCase();
        llmsFull += `## SECTION: ${title}\n\n` + fs.readFileSync(filePath, 'utf8') + `\n\n---\n\n`;
    }
});
fs.writeFileSync(path.join(root, 'llms-full.txt'), llmsFull);

console.log("HTML pages and llms-full.txt generated successfully.");
