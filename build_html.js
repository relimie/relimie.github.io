const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { gfmHeadingId } = require('marked-gfm-heading-id');

marked.use(gfmHeadingId());
marked.setOptions({ breaks: true, gfm: true });

const root = 'c:/GitHub/relimie.github.io';
// Semantic app version — shown to users (nav button, schema softwareVersion, What's-New copy).
const APP_VERSION = '2.2.0';
// Cache-bust token appended to CSS/JS URLs as ?v= to force browsers & the GitHub Pages CDN
// to refetch assets. Bump on ANY deploy that changes style.css / script.js / translations.js
// (otherwise a stale translations.js can leave the old copy/banner showing). Not user-visible,
// so it does not need to match APP_VERSION — use a build tag or date.
const ASSET_VERSION = '20260904a';
// Store listings and the official badge images. Apple's badge is an SVG served by
// Apple; Google's is the official Play badge PNG (English is used on all three
// languages, matching the English-only Apple badge).
const IOS_URL     = 'https://apps.apple.com/us/app/relimie-track-alcohol-limits/id6759795714';
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.ikaengel.relimie';
const IOS_BADGE   = 'https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg';
const GP_BADGE    = 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png';

const langs = ['en', 'de', 'ru'];
const pagesText = ['privacy', 'impressum', 'terms', 'guide', 'privacy_web', 'support', 'whats_new', 'faq', 'videos', 'cravings', 'cooperation', 'story'];

// ── Article hub ──────────────────────────────────────────────────────────────
// Informational articles that target top-of-funnel search queries (each one is a
// new "door" into the site). Flat URL structure, same as text pages: /<lang>/<slug>.html.
// To add an article: (1) drop assets/docs/articles/<slug>_<lang>.md for EN/DE/RU,
// (2) add an entry to `articles` below, (3) add its URLs to sitemap-main.xml, (4) rebuild.
//
// Optional per-entry flags:
//   faq: true  -> also emit FAQPage schema, parsed from the article's own
//                 "**Question?**\nAnswer" FAQ section (see getSchemaOrg).
// Article markdown may contain the token [[BAC_CALCULATOR]], which is replaced at
// build time with the localized blood-alcohol calculator widget.
const ARTICLE_HUB_SLUG = 'articles';

const hubMeta = {
    // Breadcrumb label for the hub (per language)
    crumb: { en: 'Articles', de: 'Ratgeber', ru: 'Статьи' },
    title: {
        en: 'Relimie – Mindful Drinking Articles & Guides',
        de: 'Relimie – Ratgeber: achtsam trinken & Alkohol reduzieren',
        ru: 'Relimie – Статьи об осознанном употреблении алкоголя',
    },
    description: {
        en: 'Practical, judgement-free articles on mindful drinking: blood alcohol and promille, alcohol calories, cutting down and cravings, from the makers of Relimie.',
        de: 'Praktische Artikel ohne erhobenen Zeigefinger: Promille und Restalkohol, Alkohol-Kalorien, weniger trinken und Heißhunger, von den Machern von Relimie.',
        ru: 'Практичные статьи без осуждения: промилле и выведение алкоголя, калории, как пить меньше и тяга, от создателей Relimie.',
    },
    // Rendered as the hub page intro (H1 + lead paragraph)
    intro: {
        en: '# Mindful Drinking Articles\n\nClear, supportive guides to help you understand your drinking and make it your own, without lectures or guilt. Fresh reads added over time.',
        de: '# Ratgeber zum achtsamen Trinken\n\nKlare, unterstützende Beiträge, die dir helfen, dein Trinken zu verstehen und selbst zu gestalten, ohne Belehrung und ohne schlechtes Gewissen. Nach und nach kommen neue dazu.',
        ru: '# Статьи об осознанном употреблении\n\nПонятные и поддерживающие материалы, которые помогут разобраться в своих привычках и сделать их своими, без нотаций и чувства вины. Со временем добавляются новые.',
    },
};

const articles = [
    {
        slug: 'sober-after-vacation',
        published: '2026-09-04',
        modified: '2026-09-04',
        faq: true,
        title: {
            en: 'Relimie – Sober After Vacation: How Many Sober Days Bring You Back?',
            de: 'Relimie – Alkoholfrei nach dem Urlaub: Wie viele nüchterne Tage bis zum Referenzwert?',
            ru: 'Relimie – Без алкоголя после отпуска: сколько трезвых дней до ориентира?',
        },
        description: {
            en: 'Back from an all-inclusive week? Work out how many sober days bring your average back to your baseline, log the trip roughly rather than perfectly, and turn the number into your own challenge.',
            de: 'Zurück aus dem All-inclusive-Urlaub? Rechne aus, wie viele nüchterne Tage deinen Durchschnitt zurück auf deinen Referenzwert bringen, trag den Urlaub grob nach und mach aus der Zahl deine Challenge.',
            ru: 'После отпуска «всё включено»: посчитай, сколько трезвых дней вернут твой средний к ориентиру, внеси поездку примерно и сделай из цифры свой челлендж.',
        },
    },
    {
        slug: 'promille-calculator',
        published: '2026-08-10',
        modified: '2026-08-10',
        faq: true,
        title: {
            en: "Relimie – Promille Calculator: Blood Alcohol and How Long Until You're Sober",
            de: 'Relimie – Promille-Rechner: Wie viel Promille hast du und wann bist du wieder nüchtern?',
            ru: 'Relimie – Калькулятор промилле: сколько алкоголя в крови и когда ты снова трезв',
        },
        description: {
            en: 'A free promille calculator plus the Widmark formula explained: work out your blood alcohol from grams of pure alcohol, see how long until it clears, and read an honest account of how far you can trust the number.',
            de: 'Kostenloser Promille-Rechner und die Widmark-Formel erklärt: berechne deinen Blutalkohol aus Gramm reinen Alkohols, sieh wie lange der Abbau von Restalkohol dauert, und lies ehrlich, wie weit du der Zahl trauen kannst.',
            ru: 'Бесплатный калькулятор промилле и формула Видмарка простыми словами: рассчитай алкоголь в крови по граммам чистого спирта, узнай время выведения и насколько можно доверять результату.',
        },
    },
    {
        slug: 'am-i-drinking-too-much',
        published: '2026-07-27',
        modified: '2026-07-27',
        title: {
            en: 'Relimie – Am I Drinking Too Much?',
            de: 'Relimie – Trinke ich zu viel?',
            ru: 'Relimie – Много ли я пью?',
        },
        description: {
            en: 'Am I drinking too much? See the average daily alcohol intake by country, how it compares to the recommended limits, and how to find where you stand. Just the numbers, so you can decide for yourself.',
            de: 'Trinke ich zu viel? Sieh dir den durchschnittlichen Alkoholkonsum pro Tag nach Land an, wie er zur empfohlenen Grenze steht und wie du herausfindest, wo du liegst. Einfach die Zahlen, den Rest entscheidest du.',
            ru: 'Много ли я пью? Посмотри средний уровень алкоголя в день по странам, как он соотносится с рекомендуемыми пределами и как понять, где ты. Только цифры, а выводы за тобой.',
        },
    },
    {
        slug: 'calories-in-alcohol',
        published: '2026-07-21',
        modified: '2026-07-21',
        title: {
            en: 'Relimie – How Many Calories Are in Alcohol? Wine, Beer & Spirits',
            de: 'Relimie – Wie viele Kalorien hat Alkohol? Wein, Bier & Spirituosen',
            ru: 'Relimie – Сколько калорий в алкоголе? Вино, пиво и крепкие напитки',
        },
        description: {
            en: 'How many calories are in wine, beer and spirits? A clear comparison of alcohol calories, why they add up, and how to track them without giving up the glass you enjoy.',
            de: 'Wie viele Kalorien haben Wein, Bier und Spirituosen? Ein klarer Vergleich der Alkohol-Kalorien, warum sie sich summieren und wie du sie trackst, ohne aufs Glas zu verzichten.',
            ru: 'Сколько калорий в вине, пиве и крепких напитках? Понятное сравнение калорий в алкоголе и как их отслеживать, не отказываясь от любимого бокала.',
        },
    },
];

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
        case 'videos': return 'Video Guides';
        case 'cravings': return 'Cravings Breaker';
        case 'cooperation': return 'Cooperation';
        case 'story': return 'Founder Story';
        default: return 'Relimie';
    }
};

const getPageTitleFull = (page, lang) => {
    const art = articles.find(a => a.slug === page);
    if (art) return art.title[lang] || art.title.en;
    if (page === ARTICLE_HUB_SLUG) return hubMeta.title[lang] || hubMeta.title.en;
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
    return `Relimie – ${getPageTitle(page)}`;
};

const getPageDescription = (page, lang) => {
    const art = articles.find(a => a.slug === page);
    if (art) return art.description[lang] || art.description.en;
    if (page === ARTICLE_HUB_SLUG) return hubMeta.description[lang] || hubMeta.description.en;
    const desc = {
        en: {
            index: 'Mindful drinking & alcohol tracker app: free drink diary, calorie and spending logging, trigger tracking. Private by design — no account, no cloud.',
            guide: 'How to track alcohol intake and build better drinking habits — complete guide to Relimie: baseline setup, drink logging, alcohol diary, blood alcohol estimate.',
            faq: 'Relimie FAQ: tracking alcohol, setting a baseline, Dry January and sober-curious goals, managing cravings, and staying private.',
            cravings: 'Stop alcohol cravings in real time with guided 4-7-8 breathing. A free mindfulness tool built into Relimie — no premium needed.',
            privacy: 'Relimie privacy policy. All your data stays on your device. No cloud storage, no third-party access, no tracking. Ever.',
            terms: 'Terms of service for Relimie — the mindful drinking and alcohol tracking app.',
            impressum: 'Legal disclosure and contact information for Relimie.',
            whats_new: "What's new in Relimie v2.2.0 — a blood alcohol estimate with time to clear, drink icons under the Orb, a rebuilt consumption overview, and guided tours on every page.",
            videos: 'Video guides for Relimie — tutorials on setting your baseline, logging drinks, and using the Cravings Breaker.',
            support: 'Get support for Relimie. Contact us for help with the mindful drinking tracker app.',
            votes: 'Vote on upcoming features for Relimie — help shape the future of the mindful drinking companion app.',
            privacy_web: 'Website privacy notice for relimie.com — no cookies, no tracking scripts, no personal data collected.',
            cooperation: 'Partner with Relimie. We collaborate with influencers in the alcohol-reduction space and anyone who wants to recommend our mindful drinking app. Email partners@relimie.com.',
            story: 'The story behind Relimie: how one number, average daily alcohol in grams, grew into a mindful drinking app built by an indie developer.',
        },
        de: {
            index: 'Achtsam trinken & Alkohol reduzieren ohne harte Regeln. Kostenloses Trinktagebuch, Kalorien- und Ausgaben-Tracking. Kein Account, keine Cloud.',
            guide: 'Alkoholkonsum kontrollieren Schritt für Schritt: Baseline einstellen, Getränke loggen, Alkohol-Tagebuch führen, Promille schätzen und Heißhunger stoppen.',
            faq: 'Häufige Fragen zu Alkohol-Tracking, Baseline, Dry January, achtsamem und sober-curious Trinken, Heißhunger-Stopper und Datenschutz.',
            cravings: 'Alkoholverlangen sofort stoppen: die 4-7-8-Atemtechnik als mentaler Reset. Kostenlos in Relimie, der App für achtsames Trinken.',
            privacy: 'Datenschutzerklärung für Relimie. Alle Daten bleiben auf deinem Gerät. Kein Cloud-Speicher, kein Tracking.',
            terms: 'Nutzungsbedingungen für Relimie — den achtsamen Trink-Begleiter und Alkohol-Tracker.',
            impressum: 'Impressum für Relimie — gesetzliche Pflichtangaben und Kontaktinformationen.',
            whats_new: 'Neu in Relimie v2.2.0 — Promille-Schätzung mit Zeit bis zum Abbau, Drink-Symbole unter dem Orb, neu gebaute Konsum-Übersicht und geführte Touren auf jeder Seite.',
            videos: 'Video-Anleitungen für Relimie — Tutorials zu Baseline, Getränken und Heißhunger-Stopper.',
            support: 'Support für Relimie — Kontakt bei Fragen zur App.',
            votes: 'Stimme über neue Funktionen für Relimie ab — gestalte die Zukunft der App mit.',
            privacy_web: 'Website-Datenschutz für relimie.com — keine Cookies, kein Tracking.',
            cooperation: 'Kooperiere mit Relimie. Wir arbeiten mit Influencern im Bereich Alkoholreduktion und allen, die unsere achtsame Trink-App weiterempfehlen möchten. partners@relimie.com.',
            story: 'Die Geschichte hinter Relimie: wie aus einer einzigen Zahl, dem täglichen Alkohol-Durchschnitt in Gramm, eine achtsame Trink-App eines Indie-Entwicklers wurde.',
        },
        ru: {
            index: 'Осознанное употребление и снижение алкоголя без жёстких правил. Бесплатный дневник напитков, трекинг триггеров и калорий. Без аккаунта и облака.',
            guide: 'Как снизить употребление алкоголя: настрой ориентир, веди дневник напитков, оценивай промилле, отслеживай триггеры и справляйся с тягой.',
            faq: 'Частые вопросы об отслеживании алкоголя, ориентире, сухом январе, осознанном и трезвом подходе, борьбе с тягой и конфиденциальности.',
            cravings: 'Справиться с тягой к алкоголю прямо сейчас: дыхательная техника 4-7-8 как ментальный сброс. Бесплатно в Relimie.',
            privacy: 'Политика конфиденциальности Relimie. Все данные хранятся только на устройстве. Никаких облаков, никакого отслеживания.',
            terms: 'Условия использования Relimie — осознанного помощника для контроля употребления алкоголя.',
            impressum: 'Юридическая информация и контактные данные Relimie.',
            whats_new: 'Что нового в Relimie v2.2.0 — оценка промилле и время до выведения, значки напитков под Сферой, переработанный обзор потребления и экскурсии по каждой странице.',
            videos: 'Видеогиды по Relimie — уроки по настройке базовой линии, ведению журнала и борьбе с тягой.',
            support: 'Поддержка Relimie — свяжись с нами по вопросам работы приложения.',
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

// Flatten a snippet of Markdown to the plain text schema.org expects in an answer.
function stripMd(text) {
    return text.trim()
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')   // markdown links -> link text
        .replace(/\*\*(.*?)\*\*/g, '$1')       // bold
        .replace(/\*(.*?)\*/g, '$1')           // italic
        .replace(/^\s*[-*]\s+/gm, '')          // list bullets
        .replace(/\s*\n\s*/g, ' ')             // newlines -> space
        .replace(/\s{2,}/g, ' ')               // collapse spaces
        .trim();
}

// Parse an article's FAQ section into schema.org Question entries.
// Convention (see assets/docs/articles/*.md): the last "## " section of the article
// holds pairs of "**Question?**" on one line with the answer on the following line(s),
// separated by blank lines. Returns [] when the article has no such section.
function parseArticleFaq(slug, lang) {
    const filePath = path.join(root, 'assets', 'docs', 'articles', `${slug}_${lang}.md`);
    if (!fs.existsSync(filePath)) return [];
    const md = fs.readFileSync(filePath, 'utf8');
    // Everything from the last H2 to the closing "---" rule (or end of file).
    const sections = md.split(/^##\s+/m);
    const faqSection = sections[sections.length - 1].split(/^---\s*$/m)[0];
    return [...faqSection.matchAll(/^\*\*(.+?)\*\*\s*\n([\s\S]*?)(?=\n\s*\n|$)/gm)]
        .map(m => ({
            "@type": "Question",
            "name": stripMd(m[1]),
            "acceptedAnswer": { "@type": "Answer", "text": stripMd(m[2]) }
        }))
        .filter(q => q.name && q.acceptedAnswer.text);
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
        "${IOS_URL}",
        "${ANDROID_URL}",
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
      "downloadUrl": ["${IOS_URL}", "${ANDROID_URL}"],
      "applicationCategory": "HealthApplication",
      "operatingSystem": "iOS, Android",
      "softwareVersion": "${APP_VERSION}",
      "keywords": "alcohol tracker, alcohol diary, drink tracker, mindful drinking, moderate drinking, sober curious, dry january, reduce drinking, track alcohol units, alcohol calorie counter, cravings breaker, personal baseline, blood alcohol calculator, promille calculator, BAC calculator, Widmark formula",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "url": "${IOS_URL}" },
      "author": { "@id": "https://relimie.com/#organization" },
      "publisher": { "@id": "https://relimie.com/#organization" },
      "inLanguage": ["en", "de", "ru"],
      "featureList": [
        "Personal baseline drinking tracker",
        "Emotional trigger diary",
        "Drinks logging with AI-powered catalog",
        "Analytics Hub with data export",
        "Blood alcohol (promille) estimate using the Widmark formula",
        "Cravings Breaker breathing exercise",
        "WHO-based recommendations"
      ]
    }
    </script>`;
    }

    // Article hub — Blog collection + breadcrumb
    if (pageName === ARTICLE_HUB_SLUG) {
        const hubUrl = `https://relimie.com/${lang}/${ARTICLE_HUB_SLUG}.html`;
        const hubCrumb = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Relimie", "item": `https://relimie.com/${lang}/` },
                { "@type": "ListItem", "position": 2, "name": hubMeta.crumb[lang] || hubMeta.crumb.en, "item": hubUrl }
            ]
        };
        const blog = {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${hubUrl}#blog`,
            "name": (hubMeta.title[lang] || hubMeta.title.en).replace(/^Relimie\s*[–-]\s*/, ''),
            "description": hubMeta.description[lang] || hubMeta.description.en,
            "url": hubUrl,
            "publisher": { "@id": "https://relimie.com/#organization" },
            "inLanguage": lang,
            "blogPost": articles.map(a => ({
                "@type": "BlogPosting",
                "headline": (a.title[lang] || a.title.en).replace(/^Relimie\s*[–-]\s*/, ''),
                "url": `https://relimie.com/${lang}/${a.slug}.html`,
                "datePublished": a.published,
                "dateModified": a.modified
            }))
        };
        return orgSchema
            + `\n    <script type="application/ld+json">\n${JSON.stringify(hubCrumb, null, 4)}\n    </script>`
            + `\n    <script type="application/ld+json">\n${JSON.stringify(blog, null, 4)}\n    </script>`;
    }

    // Individual article — BlogPosting + 3-level breadcrumb
    const articleEntry = articles.find(a => a.slug === pageName);
    if (articleEntry) {
        const url = `https://relimie.com/${lang}/${pageName}.html`;
        const artCrumb = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Relimie", "item": `https://relimie.com/${lang}/` },
                { "@type": "ListItem", "position": 2, "name": hubMeta.crumb[lang] || hubMeta.crumb.en, "item": `https://relimie.com/${lang}/${ARTICLE_HUB_SLUG}.html` },
                { "@type": "ListItem", "position": 3, "name": (articleEntry.title[lang] || articleEntry.title.en).replace(/^Relimie\s*[–-]\s*/, ''), "item": url }
            ]
        };
        const post = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${url}#article`,
            "headline": (articleEntry.title[lang] || articleEntry.title.en).replace(/^Relimie\s*[–-]\s*/, ''),
            "description": articleEntry.description[lang] || articleEntry.description.en,
            "url": url,
            "image": { "@type": "ImageObject", "url": "https://relimie.com/icon.png", "width": 2048, "height": 2048 },
            "author": { "@id": "https://relimie.com/#organization" },
            "publisher": { "@id": "https://relimie.com/#organization" },
            "datePublished": articleEntry.published,
            "dateModified": articleEntry.modified,
            "mainEntityOfPage": { "@type": "WebPage", "@id": url },
            "isPartOf": { "@type": "Blog", "@id": `https://relimie.com/${lang}/${ARTICLE_HUB_SLUG}.html#blog` },
            "about": { "@id": "https://relimie.com/#app" },
            "inLanguage": lang
        };
        let out = orgSchema
            + `\n    <script type="application/ld+json">\n${JSON.stringify(artCrumb, null, 4)}\n    </script>`
            + `\n    <script type="application/ld+json">\n${JSON.stringify(post, null, 4)}\n    </script>`;
        // Opt-in (registry flag `faq: true`): expose the article's own FAQ section as FAQPage.
        if (articleEntry.faq) {
            const questions = parseArticleFaq(pageName, lang);
            if (questions.length > 0) {
                const faqSchema = {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "@id": `${url}#faq`,
                    "isPartOf": { "@id": `${url}#article` },
                    "inLanguage": lang,
                    "mainEntity": questions
                };
                out += `\n    <script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 4)}\n    </script>`;
            } else {
                console.warn(`Warning: faq:true set for "${pageName}" (${lang}) but no questions were parsed.`);
            }
        }
        return out;
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
                        "acceptedAnswer": { "@type": "Answer", "text": stripMd(m[2]) }
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
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2.2 4.8-4.8 2.2 2.2-4.8z"/></svg>',
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h11a1 1 0 0 1 1 1v15H7a2 2 0 0 1-2-2V6a2 2 0 0 1 1-1.7"/><path d="M9 9h6M9 13h4"/></svg>',
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h9a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 12h13a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 16h7a2 2 0 1 1-2 2"/></svg>',
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><rect x="5" y="11" width="3" height="7" rx="1"/><rect x="10.5" y="6" width="3" height="12" rx="1"/><rect x="16" y="13" width="3" height="5" rx="1"/></svg>',
];

// Anchor target for each value card (matches HIGHLIGHT_ICONS / markdown order):
// baseline -> diary -> cravings -> analytics -> logging. Clicking a card scrolls
// to the matching detailed section below.
const HIGHLIGHT_LINKS = ['#ls-logging', '#ls-hero', '#ls-diary', '#ls-cravings', '#ls-analytics'];

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

// Build the article hub body (intro + a linked list of every article).
// Rendered inside the standard .page-card .markdown-body, so no extra CSS is needed.
function buildArticleHub(lang) {
    const intro = marked.parse(hubMeta.intro[lang] || hubMeta.intro.en);
    const items = articles.map(a => {
        const t = (a.title[lang] || a.title.en).replace(/^Relimie\s*[–-]\s*/, '');
        const d = a.description[lang] || a.description.en;
        return `<h2><a href="${a.slug}.html">${t}</a></h2>\n<p>${d}</p>`;
    }).join('\n');
    return intro + items;
}

// ── Blood-alcohol calculator widget ──────────────────────────────────────────
// Injected into article markdown wherever the token [[BAC_CALCULATOR]] appears.
// Static labels are baked per language here (same approach as buildHighlightGrid),
// so translations.js needs no entry; the handful of strings the script builds at
// runtime ride along as data-* attributes on the container.
//
// The maths lives in initBacCalculator() in assets/js/script.js and mirrors the app's
// services/bac.ts exactly: c = A / (m x r), r = 0.7/0.6/0.65, 0.15 permille per hour,
// durations rounded UP to the next 5 minutes, no absorption correction. Keep the two
// in sync — a visitor comparing the page against the app must see identical numbers.
const BAC_CALC_STRINGS = {
    en: {
        title: 'Estimate your blood alcohol',
        lead: 'Enter what you drank in grams of pure alcohol. The table below converts common drinks.',
        grams: 'Pure alcohol (g)', weight: 'Body weight (kg)', gender: 'Gender',
        male: 'Male', female: 'Female', other: 'Other / not specified',
        hours: 'Hours since your last drink',
        current: 'Estimated now', peak: 'Peak', marker: 'Below 0.5 ‰ after', zero: 'Fully cleared after',
        belowStart: 'Below from the start',
        note: 'An estimate from the Widmark formula, not a measurement. Your real level can be considerably higher. Never use this to decide whether you are fit to drive.',
        unitH: 'h', unitMin: 'min',
    },
    de: {
        title: 'Schätze deinen Blutalkohol',
        lead: 'Trag ein, was du getrunken hast, in Gramm reinen Alkohols. Die Tabelle unten rechnet gängige Getränke um.',
        grams: 'Reiner Alkohol (g)', weight: 'Körpergewicht (kg)', gender: 'Geschlecht',
        male: 'Männlich', female: 'Weiblich', other: 'Divers / keine Angabe',
        hours: 'Stunden seit dem letzten Drink',
        current: 'Aktuell geschätzt', peak: 'Spitzenwert', marker: 'Unter 0,5 ‰ nach', zero: 'Vollständig abgebaut nach',
        belowStart: 'Von Anfang an darunter',
        note: 'Eine Schätzung nach der Widmark-Formel, keine Messung. Dein echter Wert kann deutlich höher liegen. Nutze das niemals, um zu entscheiden, ob du fahren kannst.',
        unitH: 'Std.', unitMin: 'Min.',
    },
    ru: {
        title: 'Оцени алкоголь в крови',
        lead: 'Укажи выпитое в граммах чистого алкоголя. Таблица ниже переводит привычные напитки в граммы.',
        grams: 'Чистый алкоголь (г)', weight: 'Вес тела (кг)', gender: 'Пол',
        male: 'Мужской', female: 'Женский', other: 'Другое / не указан',
        hours: 'Часов с последнего напитка',
        current: 'Оценка сейчас', peak: 'Пик', marker: 'Ниже 0,5 ‰ через', zero: 'Полностью выведется через',
        belowStart: 'Ниже с самого начала',
        note: 'Это оценка по формуле Видмарка, а не измерение. Реальное значение может быть заметно выше. Никогда не решай по нему, можно ли садиться за руль.',
        unitH: 'ч', unitMin: 'мин',
    },
};

function buildBacCalculator(lang) {
    const t = BAC_CALC_STRINGS[lang] || BAC_CALC_STRINGS.en;
    return `<div class="bac-calc" data-locale="${lang}" data-unit-h="${t.unitH}" data-unit-min="${t.unitMin}" data-below-start="${t.belowStart}">
    <h2 class="bac-calc-title">${t.title}</h2>
    <p class="bac-calc-lead">${t.lead}</p>
    <div class="bac-calc-grid">
        <div class="bac-field">
            <label for="bac-grams">${t.grams}</label>
            <input type="number" id="bac-grams" value="60" min="0" max="1000" step="1" inputmode="decimal">
        </div>
        <div class="bac-field">
            <label for="bac-weight">${t.weight}</label>
            <input type="number" id="bac-weight" value="80" min="40" max="150" step="1" inputmode="numeric">
        </div>
        <div class="bac-field">
            <label for="bac-gender">${t.gender}</label>
            <select id="bac-gender">
                <option value="male">${t.male}</option>
                <option value="female">${t.female}</option>
                <option value="other">${t.other}</option>
            </select>
        </div>
        <div class="bac-field bac-field-wide">
            <label for="bac-hours">${t.hours} <output id="bac-hours-out" for="bac-hours">0</output></label>
            <input type="range" id="bac-hours" value="0" min="0" max="24" step="0.5">
        </div>
    </div>
    <div class="bac-calc-results">
        <div class="bac-headline">
            <span class="bac-headline-label">${t.current}</span>
            <span class="bac-headline-value" id="bac-current">–</span>
        </div>
        <dl class="bac-rows">
            <div class="bac-row"><dt>${t.peak}</dt><dd id="bac-peak">–</dd></div>
            <div class="bac-row"><dt>${t.marker}</dt><dd id="bac-marker">–</dd></div>
            <div class="bac-row"><dt>${t.zero}</dt><dd id="bac-zero">–</dd></div>
        </dl>
    </div>
    <p class="bac-calc-note">${t.note}</p>
</div>`;
}

// Ensure folders exist
langs.forEach(lang => {
    const dirPath = path.join(root, lang);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

// Official store badges, defined once and reused by the hero and every landing section.
const iosBadgeHtml = `<a href="${IOS_URL}" target="_blank" rel="noopener noreferrer">
                            <img alt="Download on the App Store" src="${IOS_BADGE}" class="store-badge" width="166" height="56" />
                        </a>`;

const androidBadgeHtml = `<a href="${ANDROID_URL}" target="_blank" rel="noopener noreferrer">
                            <img alt="Get it on Google Play" src="${GP_BADGE}" class="store-badge google" width="646" height="250" />
                        </a>`;

// Reusable store badge block used in every landing section
const storeBadgeHtml = `
                    <div class="store-section">
                        ${iosBadgeHtml}
                        ${androidBadgeHtml}
                    </div>`;

// "Back to top" link appended to each landing section's text column
const backToTopHtml = `<a href="#home-hero" class="back-to-top" data-i18n="backToTop">↑ Back to top</a>`;

function getTemplate(lang, pageName, isIndex, bodyContent) {
    const title = getPageTitleFull(pageName, lang);
    const description = getPageDescription(pageName, lang);
    const canonicalUrl = `https://relimie.com/${lang}/${pageName}.html`;
    const noIndexPages = ['privacy', 'impressum', 'terms', 'privacy_web'];
    const isNoIndex = noIndexPages.includes(pageName);
    const isArticle = articles.some(a => a.slug === pageName);

    const content = isIndex ? `
        <!-- Hero: animated Orb + core promise -->
        <header class="home-hero" id="home-hero">
            <div class="hero-slogan">
                <h1 class="hero-tagline" data-i18n="heroTagline">Enjoy Life. Keep Control.</h1>
                <p class="hero-lead" data-i18n="heroLead">Relimie is your companion for mindful, moderate and sober-curious drinking — an alcohol tracker and diary that helps you reduce drinking on your own terms.</p>
            </div>
            
            <div class="hero-interactive">
                <div class="hero-download-left">
                    ${iosBadgeHtml}
                </div>
                <div class="hero-orb">
                    <div class="hero-orb-inner">
                        <img src="../assets/images/mindful_orb.webp" alt="Relimie Orb — the mindful drinking baseline indicator" width="360" height="360" fetchpriority="high">
                    </div>
                </div>
                <div class="hero-download-right">
                    ${androidBadgeHtml}
                </div>
            </div>

            <p class="hero-trust" data-i18n="heroTrust">For iPhone and Android. No account. No cloud. No ads. Your data stays on your device.</p>
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
    <meta property="og:type" content="${(pageName === 'story' || isArticle) ? 'article' : 'website'}">
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
    <link rel="stylesheet" href="../assets/css/style.css?v=${ASSET_VERSION}">${isIndex ? `
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
                <div class="nav-item">
                    <a href="whats_new.html" class="nav-whatsnew" data-i18n="navWhatsNew">Now on Android</a>
                </div>
                <div class="nav-item has-dropdown">
                    <a href="whats_new.html"><span data-i18n="community">Community</span> <span class="dot-new"></span></a>
                    <div class="dropdown-menu">
                        <a href="whats_new.html" data-i18n="releaseNews">Release News</a>
                        <a href="story.html" data-i18n="founderStory">Founder Story</a>
                    </div>
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
                <div class="nav-item">
                    <a href="articles.html" data-i18n="articles">Articles</a>
                </div>
                <div class="nav-item">
                    <a href="cooperation.html" data-i18n="cooperation">Cooperation</a>
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

    <script src="../assets/js/translations.js?v=${ASSET_VERSION}"></script>
    <script src="../assets/js/script.js?v=${ASSET_VERSION}"></script>
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

    // Write the article hub
    fs.writeFileSync(path.join(root, lang, `${ARTICLE_HUB_SLUG}.html`), getTemplate(lang, ARTICLE_HUB_SLUG, false, buildArticleHub(lang)));

    // Write individual articles
    articles.forEach(article => {
        const filePath = path.join(root, 'assets', 'docs', 'articles', `${article.slug}_${lang}.md`);
        let bodyHtml = '';
        if (fs.existsSync(filePath)) {
            // marked leaves the [[BAC_CALCULATOR]] token wrapped in a <p>; swap the whole
            // paragraph so the widget is not nested inside one.
            bodyHtml = marked.parse(fs.readFileSync(filePath, 'utf8'))
                .replace(/<p>\s*\[\[BAC_CALCULATOR\]\]\s*<\/p>/g, () => buildBacCalculator(lang));
        } else {
            console.warn(`Warning: Article file not found: ${filePath}`);
            bodyHtml = `<p>Coming Soon</p>`;
        }
        fs.writeFileSync(path.join(root, lang, `${article.slug}.html`), getTemplate(lang, article.slug, false, bodyHtml));
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
// Append the SEO articles — these are top-of-funnel entry points we want AI agents to ingest.
articles.forEach(article => {
    const filePath = path.join(root, 'assets', 'docs', 'articles', `${article.slug}_en.md`);
    if (fs.existsSync(filePath)) {
        const title = (article.title.en || '').replace(/^Relimie\s*[–-]\s*/, '');
        // Describe the interactive widget rather than leaking its build-time token.
        const body = fs.readFileSync(filePath, 'utf8')
            .replace(/\[\[BAC_CALCULATOR\]\]/g, '(An interactive blood-alcohol calculator is embedded here on the web page: it takes grams of pure alcohol, body weight, gender and hours since the last drink, and returns the estimated per mille value, the peak, the time until below 0.5 permille and the time until fully cleared.)');
        llmsFull += `## ARTICLE: ${title}\n\n` + body + `\n\n---\n\n`;
    }
});
fs.writeFileSync(path.join(root, 'llms-full.txt'), llmsFull);

console.log("HTML pages and llms-full.txt generated successfully.");
