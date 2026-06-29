const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { gfmHeadingId } = require('marked-gfm-heading-id');

marked.use(gfmHeadingId());
marked.setOptions({ breaks: true, gfm: true });

const root = 'c:/GitHub/relimie.github.io';
// Bump on every release. Appended to CSS/JS URLs as ?v= to bust browser & CDN caches
// (otherwise GitHub Pages can keep serving a stale translations.js, leaving an old version banner).
const APP_VERSION = '2.1.0';
const langs = ['en', 'de', 'ru'];
const pagesText = ['privacy', 'impressum', 'terms', 'guide', 'privacy_web', 'support', 'whats_new', 'faq', 'android', 'videos', 'cravings', 'cooperation', 'story'];

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
    'cravings': 'cravings',
    'cooperation': 'cooperation',
    'story': 'founder_story'
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
        case 'android': return 'Android Test';
        case 'videos': return 'Video Guides';
        case 'cravings': return 'Cravings Breaker';
        case 'cooperation': return 'Cooperation';
        case 'story': return 'Founder Story';
        default: return 'Relimie';
    }
};

const getPageTitleFull = (page, lang) => {
    if (page === 'index') {
        if (lang === 'de') return 'Relimie – Alkohol-Tracker & Trinktagebuch App';
        if (lang === 'ru') return 'Relimie – Трекер алкоголя и дневник употребления';
        return 'Relimie – Mindful Drinking & Alcohol Tracker App';
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
    if (page === 'cooperation') {
        if (lang === 'de') return 'Relimie – Kooperation | Influencer & Partner gesucht';
        if (lang === 'ru') return 'Relimie – Сотрудничество | Партнёрам и блогерам';
        return 'Relimie – Partner With Us | Influencer & Affiliate Cooperation';
    }
    if (page === 'story') {
        if (lang === 'de') return 'Relimie – Die Gründergeschichte: Warum ich Relimie entwickelt habe';
        if (lang === 'ru') return 'Relimie – История создателя: почему я сделал Relimie';
        return 'Relimie – The Founder Story: Why I Built a Mindful Drinking App';
    }
    if (page === 'android') {
        if (lang === 'de') return 'Relimie – Relimie für Android testen | Google Play Test';
        if (lang === 'ru') return 'Relimie – Тестирование Relimie на Android | Google Play';
        return 'Relimie – Test Relimie on Android | Google Play Closed Test';
    }
    return `Relimie – ${getPageTitle(page)}`;
};

const getPageDescription = (page, lang) => {
    const desc = {
        en: {
            index: 'Mindful drinking & alcohol tracker app: free drink diary, calorie and spending logging, trigger tracking. Private by design — no account, no cloud.',
            guide: 'How to track alcohol intake and build better drinking habits — complete guide to Relimie: baseline setup, drink logging, alcohol diary, and analytics.',
            faq: 'Relimie FAQ: tracking alcohol, setting a baseline, Dry January and sober-curious goals, managing cravings, and staying private.',
            cravings: 'Stop alcohol cravings in real time with guided 4-7-8 breathing. A free mindfulness tool built into Relimie — no premium needed.',
            privacy: 'Relimie privacy policy. All your data stays on your device. No cloud storage, no third-party access, no tracking. Ever.',
            terms: 'Terms of service for Relimie — the mindful drinking and alcohol tracking app.',
            impressum: 'Legal disclosure and contact information for Relimie.',
            whats_new: "What's new in Relimie v2.1.0 — full-screen landscape chart, guided in-app tours, Body Recovery Timeline, and faster logging.",
            videos: 'Video guides for Relimie — tutorials on setting your baseline, logging drinks, and using the Cravings Breaker.',
            support: 'Get support for Relimie. Contact us for help with the mindful drinking tracker app.',
            android: 'Help test Relimie on Android. Join our Google Play closed test in three steps and be among the first to use the mindful drinking app on Android.',
            votes: 'Vote on upcoming features for Relimie — help shape the future of the mindful drinking companion app.',
            privacy_web: 'Website privacy notice for relimie.com — no cookies, no tracking scripts, no personal data collected.',
            cooperation: 'Partner with Relimie. We collaborate with influencers in the alcohol-reduction space and anyone who wants to recommend our mindful drinking app. Email partners@relimie.com.',
            story: 'The story behind Relimie: how one number, average daily alcohol in grams, grew into a mindful drinking app built by an indie developer.',
        },
        de: {
            index: 'Achtsam trinken & Alkohol reduzieren ohne harte Regeln. Kostenloses Trinktagebuch, Kalorien- und Ausgaben-Tracking. Kein Account, keine Cloud.',
            guide: 'Alkoholkonsum kontrollieren Schritt für Schritt: Baseline einstellen, Getränke loggen, Alkohol-Tagebuch führen, Auslöser tracken und Heißhunger stoppen.',
            faq: 'Häufige Fragen zu Alkohol-Tracking, Baseline, Dry January, achtsamem und sober-curious Trinken, Heißhunger-Stopper und Datenschutz.',
            cravings: 'Alkoholverlangen sofort stoppen: die 4-7-8-Atemtechnik als mentaler Reset. Kostenlos in Relimie, der App für achtsames Trinken.',
            privacy: 'Datenschutzerklärung für Relimie. Alle Daten bleiben auf deinem Gerät. Kein Cloud-Speicher, kein Tracking.',
            terms: 'Nutzungsbedingungen für Relimie — den achtsamen Trink-Begleiter und Alkohol-Tracker.',
            impressum: 'Impressum für Relimie — gesetzliche Pflichtangaben und Kontaktinformationen.',
            whats_new: 'Neu in Relimie v2.1.0 — Vollbild-Diagramm im Querformat, geführte In-App-Touren, Regenerations-Zeitleiste und schnelleres Erfassen.',
            videos: 'Video-Anleitungen für Relimie — Tutorials zu Baseline, Getränken und Heißhunger-Stopper.',
            support: 'Support für Relimie — Kontakt bei Fragen zur App.',
            android: 'Hilf mit, Relimie auf Android zu testen. Tritt in drei Schritten unserem Google-Play-Test bei und sei unter den Ersten, die die App auf Android nutzen.',
            votes: 'Stimme über neue Funktionen für Relimie ab — gestalte die Zukunft der App mit.',
            privacy_web: 'Website-Datenschutz für relimie.com — keine Cookies, kein Tracking.',
            cooperation: 'Kooperiere mit Relimie. Wir arbeiten mit Influencern im Bereich Alkoholreduktion und allen, die unsere achtsame Trink-App weiterempfehlen möchten. partners@relimie.com.',
            story: 'Die Geschichte hinter Relimie: wie aus einer einzigen Zahl, dem täglichen Alkohol-Durchschnitt in Gramm, eine achtsame Trink-App eines Indie-Entwicklers wurde.',
        },
        ru: {
            index: 'Осознанное употребление и снижение алкоголя без жёстких правил. Бесплатный дневник напитков, трекинг триггеров и калорий. Без аккаунта и облака.',
            guide: 'Как снизить употребление алкоголя: настрой ориентир, веди дневник напитков, отслеживай триггеры и справляйся с тягой.',
            faq: 'Частые вопросы об отслеживании алкоголя, ориентире, сухом январе, осознанном и трезвом подходе, борьбе с тягой и конфиденциальности.',
            cravings: 'Справиться с тягой к алкоголю прямо сейчас: дыхательная техника 4-7-8 как ментальный сброс. Бесплатно в Relimie.',
            privacy: 'Политика конфиденциальности Relimie. Все данные хранятся только на устройстве. Никаких облаков, никакого отслеживания.',
            terms: 'Условия использования Relimie — осознанного помощника для контроля употребления алкоголя.',
            impressum: 'Юридическая информация и контактные данные Relimie.',
            whats_new: 'Что нового в Relimie v2.1.0 — полноэкранный график в горизонтальном режиме, обучающие подсказки, шкала восстановления и быстрая запись.',
            videos: 'Видеогиды по Relimie — уроки по настройке базовой линии, ведению журнала и борьбе с тягой.',
            support: 'Поддержка Relimie — свяжись с нами по вопросам работы приложения.',
            android: 'Помоги протестировать Relimie на Android. Присоединись к закрытому тесту в Google Play за три шага и стань одним из первых, кто пользуется приложением на Android.',
            votes: 'Голосуй за новые функции Relimie — помоги сформировать будущее приложения.',
            privacy_web: 'Политика конфиденциальности сайта relimie.com — без cookie, без трекинга, без аналитики.',
            cooperation: 'Сотрудничество с Relimie. Работаем с блогерами в теме снижения употребления алкоголя и со всеми, кто готов рекомендовать наше приложение. partners@relimie.com.',
            story: 'История Relimie: как одна цифра, средний дневной алкоголь в граммах, выросла в осознанное приложение, созданное инди-разработчиком.',
        }
    };
    return (desc[lang] && desc[lang][page]) || (desc['en'] && desc['en'][page]) || 'Relimie – Mindful drinking and alcohol tracking app.';
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
      "description": "Relimie builds mindful drinking and alcohol tracking apps that help people track alcohol consumption, identify emotional triggers, and build healthier habits.",
      "logo": {
        "@type": "ImageObject",
        "url": "https://relimie.com/icon.png",
        "width": 2048,
        "height": 2048
      },
      "sameAs": [
        "https://apps.apple.com/us/app/relimie-track-alcohol-limits/id6759795714",
        "https://www.youtube.com/@RelimieApp"
      ]
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
      "url": "https://relimie.com",
      "downloadUrl": "https://apps.apple.com/us/app/relimie-track-alcohol-limits/id6759795714",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "iOS",
      "softwareVersion": "2.1.0",
      "keywords": "alcohol tracker, alcohol diary, drink tracker, mindful drinking, moderate drinking, sober curious, dry january, reduce drinking, track alcohol units, alcohol calorie counter, cravings breaker, personal baseline",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "url": "https://apps.apple.com/us/app/relimie-track-alcohol-limits/id6759795714" },
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
                            "text": m[2].trim()
                                .replace(/\[(.*?)\]\(.*?\)/g, '$1')   // markdown links -> link text
                                .replace(/\*\*(.*?)\*\*/g, '$1')       // bold
                                .replace(/\*(.*?)\*/g, '$1')           // italic
                                .replace(/^\s*[-*]\s+/gm, '')          // list bullets
                                .replace(/\s*\n\s*/g, ' ')             // newlines -> space
                                .replace(/\s{2,}/g, ' ')               // collapse spaces
                                .trim()
                        }
                    }))
                };
                return orgSchema + `\n    <script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 4)}\n    </script>`;
            }
        }
    }

    const breadcrumb = `
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

    // Article-type schema for editorial pages (E-E-A-T / AI-citation signal).
    // Author is the Organization (the founder stays anonymous).
    let articleSchema = '';
    const articleType = pageName === 'story' ? 'Article' : (pageName === 'guide' ? 'TechArticle' : null);
    if (articleType) {
        const article = {
            "@context": "https://schema.org",
            "@type": articleType,
            "@id": `https://relimie.com/${lang}/${pageName}.html#article`,
            "headline": getPageTitleFull(pageName, lang).replace(/^Relimie\s*[–-]\s*/, ''),
            "description": getPageDescription(pageName, lang),
            "url": `https://relimie.com/${lang}/${pageName}.html`,
            "image": { "@type": "ImageObject", "url": "https://relimie.com/icon.png", "width": 2048, "height": 2048 },
            "author": { "@id": "https://relimie.com/#organization" },
            "publisher": { "@id": "https://relimie.com/#organization" },
            "datePublished": "2026-04-14",
            "dateModified": "2026-06-28",
            "mainEntityOfPage": { "@type": "WebPage", "@id": `https://relimie.com/${lang}/${pageName}.html` },
            "about": { "@id": "https://relimie.com/#app" },
            "inLanguage": lang
        };
        articleSchema = `\n    <script type="application/ld+json">\n${JSON.stringify(article, null, 4)}\n    </script>`;
    }

    // VideoObject (ItemList) schema for the video guides page — parsed from videos_<lang>.md
    // so the schema always matches the rendered list. Each entry is "### Title\nDescription\n[link](url)".
    let videoSchema = '';
    if (pageName === 'videos') {
        const vidPath = path.join(root, 'assets', 'docs', `videos_${lang}.md`);
        if (fs.existsSync(vidPath)) {
            const md = fs.readFileSync(vidPath, 'utf8');
            const items = [...md.matchAll(/###\s+(.+)\n([^\n]+)\n\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/g)];
            if (items.length > 0) {
                const videos = items.map((m, i) => {
                    const url = m[3].trim();
                    const idMatch = url.match(/shorts\/([A-Za-z0-9_-]+)|v=([A-Za-z0-9_-]+)|youtu\.be\/([A-Za-z0-9_-]+)/);
                    const vid = idMatch ? (idMatch[1] || idMatch[2] || idMatch[3]) : '';
                    return {
                        "@type": "ListItem",
                        "position": i + 1,
                        "item": {
                            "@type": "VideoObject",
                            "name": m[1].trim(),
                            "description": m[2].trim(),
                            "thumbnailUrl": vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : undefined,
                            "uploadDate": "2026-04-14",
                            "contentUrl": url,
                            "embedUrl": vid ? `https://www.youtube.com/embed/${vid}` : url,
                            "publisher": { "@id": "https://relimie.com/#organization" },
                            "inLanguage": lang
                        }
                    };
                });
                const itemList = {
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "itemListElement": videos
                };
                videoSchema = `\n    <script type="application/ld+json">\n${JSON.stringify(itemList, null, 4)}\n    </script>`;
            }
        }
    }

    return orgSchema + breadcrumb + articleSchema + videoSchema;
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
    1: ['Relimie alcohol tracker Orb showing the Personal Baseline', 'Relimie home screen for mindful drinking and baseline tracking', 'Relimie drink logging interface for tracking alcohol intake', 'Relimie baseline settings for moderate drinking goals'],
    2: ['Relimie alcohol diary with emotional trigger tags', 'Relimie morning after-effects and sober-day check-in'],
    3: ['Relimie drink logging screen tracking alcohol units, calories and spending', 'Relimie AI drink search for the alcohol tracker', 'Relimie daily spending and calorie summary', 'Relimie custom drink catalog'],
    4: ['Relimie analytics hub with drinking habits overview', 'Relimie drinking trends, patterns and consumption chart'],
    5: ['Relimie Cravings Breaker 4-7-8 breathing exercise to stop alcohol cravings']
};

// Build carousel HTML for a given section folder and path prefix.
// Carousels now sit below the hero + value grid, so every slide is lazy-loaded
// (the animated Orb in the hero is the LCP element and is preloaded instead).
function buildCarousel(sectionNum) {
    const alts = sectionAltTexts[sectionNum] || [];
    const imgs = getSectionImages(sectionNum);
    if (imgs.length === 0) return '<p style="color:var(--text-secondary);text-align:center">Screenshots coming soon</p>';
    return imgs.map((img, i) => {
        const alt = alts[i] || `Relimie app screenshot – section ${sectionNum}`;
        return `<img src="../assets/images/section${sectionNum}/${img}" alt="${alt}" class="carousel-slide${i === 0 ? ' active' : ''}" loading="lazy">`;
    }).join('\n                ');
}

// Inline SVG icons for the home value grid, one per card (in markdown order).
// stroke="currentColor" so CSS tints them teal. Order: baseline/control, diary,
// cravings breath, analytics, companion compass.
const HIGHLIGHT_ICONS = [
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h11a1 1 0 0 1 1 1v15H7a2 2 0 0 1-2-2V6a2 2 0 0 1 1-1.7"/><path d="M9 9h6M9 13h4"/></svg>',
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h9a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 12h13a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 16h7a2 2 0 1 1-2 2"/></svg>',
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><rect x="5" y="11" width="3" height="7" rx="1"/><rect x="10.5" y="6" width="3" height="12" rx="1"/><rect x="16" y="13" width="3" height="5" rx="1"/></svg>',
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2.2 4.8-4.8 2.2 2.2-4.8z"/></svg>',
];

// Anchor target for each value card (matches HIGHLIGHT_ICONS / markdown order):
// baseline -> diary -> cravings -> analytics -> logging. Clicking a card scrolls
// to the matching detailed section below.
const HIGHLIGHT_LINKS = ['#ls-hero', '#ls-diary', '#ls-cravings', '#ls-analytics', '#ls-logging'];

// Build the home value grid from assets/docs/landing_highlights_<lang>.md.
// Each card is a "### Title" heading followed by a one-sentence paragraph.
function buildHighlightGrid(lang) {
    const filePath = path.join(root, 'assets', 'docs', `landing_highlights_${lang}.md`);
    if (!fs.existsSync(filePath)) return '';
    const raw = fs.readFileSync(filePath, 'utf8');
    const blocks = raw.split(/^###\s+/m).map(s => s.trim()).filter(Boolean);
    return blocks.map((block, i) => {
        const nl = block.indexOf('\n');
        const title = (nl === -1 ? block : block.slice(0, nl)).trim();
        const body = (nl === -1 ? '' : block.slice(nl + 1)).trim();
        const icon = HIGHLIGHT_ICONS[i] || '';
        const link = HIGHLIGHT_LINKS[i] || '#';
        return `<a class="value-card" href="${link}">
                    <span class="value-icon" aria-hidden="true">${icon}</span>
                    <h3>${marked.parseInline(title)}</h3>
                    <p>${marked.parseInline(body)}</p>
                </a>`;
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
                        <a href="android.html" class="android-badge" aria-label="Android app coming soon">
                            <svg class="android-badge-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.43 11.43 0 0 0-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48A10.81 10.81 0 0 0 1 18h22a10.81 10.81 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/></svg>
                            <span class="android-badge-text">
                                <span class="android-badge-top" data-i18n="androidBadgeTop">Coming soon</span>
                                <span class="android-badge-bottom">Android</span>
                            </span>
                        </a>
                    </div>`;

// "Back to top" link appended to each landing section's text column
const backToTopHtml = `<a href="#home-hero" class="back-to-top" data-i18n="backToTop">↑ Back to top</a>`;

function getTemplate(lang, pageName, isIndex, bodyContent) {
    const title = getPageTitleFull(pageName, lang);
    const description = getPageDescription(pageName, lang);
    const canonicalUrl = `https://relimie.com/${lang}/${pageName}.html`;
    const noIndexPages = ['privacy', 'impressum', 'terms', 'privacy_web'];
    const isNoIndex = noIndexPages.includes(pageName);

    const content = isIndex ? `
        <!-- Hero: animated Orb + core promise -->
        <header class="home-hero" id="home-hero">
            <div class="hero-orb">
                <div class="hero-orb-inner">
                    <img src="../assets/images/mindful_orb.webp" alt="Relimie Orb — the mindful drinking baseline indicator" width="360" height="360" fetchpriority="high">
                </div>
            </div>
            <h1 class="hero-tagline" data-i18n="heroTagline">Enjoy Life. Keep Control.</h1>
            <p class="hero-lead" data-i18n="heroLead">Relimie is your companion for mindful, moderate and sober-curious drinking — an alcohol tracker and diary that helps you reduce drinking on your own terms.</p>
            ${storeBadgeHtml}
            <p class="hero-trust" data-i18n="heroTrust">No account. No cloud. Your data stays on your device.</p>
        </header>

        <!-- Value grid: the messages at a glance -->
        <section class="value-grid-section">
            <div class="value-grid">
                ${buildHighlightGrid(lang)}
            </div>
        </section>

        <!-- Section 1: Baseline deep-dive -->
        <section class="landing-section" id="ls-hero">
            <div class="ls-card glass-card">
                <div class="ls-media">
                    ${storeBadgeHtml}
                    <div class="ls-carousel">
                        ${buildCarousel(1)}
                    </div>
                </div>
                <div class="ls-text">
                    <div class="markdown-body">
                        ${bodyContent.s1}
                    </div>
                    <a href="guide.html" class="glass-btn primary" data-i18n="readGuide">Read the User Guide</a>
                    ${backToTopHtml}
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
                    ${backToTopHtml}
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
                    ${backToTopHtml}
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
                    ${backToTopHtml}
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
                    ${backToTopHtml}
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
    <meta property="og:type" content="${pageName === 'story' ? 'article' : 'website'}">
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
    <link rel="stylesheet" href="../assets/css/style.css?v=${APP_VERSION}">${isIndex ? `
    <link rel="preload" as="image" href="../assets/images/mindful_orb.webp">` : ''}
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
                        <a href="android.html" data-i18n="androidTest">Android Test</a>
                        <a href="whats_new.html" data-i18n="releaseNews">Release News</a>
                        <a href="story.html" data-i18n="founderStory">Founder Story</a>
                        <a href="cooperation.html" data-i18n="cooperation">Cooperation</a>
                    </div>
                </div>
                <div class="nav-item">
                    <a href="whats_new.html" class="nav-whatsnew" data-i18n="navWhatsNew">New in 2.1.0</a>
                </div>
                <div class="nav-item has-dropdown">
                    <a href="guide.html" data-i18n="guide">Guide</a>
                    <div class="dropdown-menu">
                        <a href="guide.html" data-i18n="userGuide">User Guide</a>
                        <a href="videos.html" data-i18n="videoGuides">Video Guides</a>
                        <a href="faq.html" data-i18n="faq">FAQ</a>
                        <a href="support.html" data-i18n="support">Support</a>
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

    <!-- Sticky legal bar — keeps the required legal links reachable from any
         scroll position (shown whenever the footer is out of view, all pages) -->
    <nav class="sticky-cta" id="sticky-cta" aria-label="Legal links">
        <a href="terms.html" data-i18n="terms">Terms of Service</a>
        <a href="privacy.html" data-i18n="privacy">Privacy Policy</a>
        <a href="privacy_web.html" data-i18n="websitePrivacy">Website Privacy</a>
        <a href="impressum.html" data-i18n="impressum">Impressum</a>
    </nav>

    <script src="../assets/js/translations.js?v=${APP_VERSION}"></script>
    <script src="../assets/js/script.js?v=${APP_VERSION}"></script>
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
