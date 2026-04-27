const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { gfmHeadingId } = require('marked-gfm-heading-id');

marked.use(gfmHeadingId());
marked.setOptions({ breaks: true, gfm: true });

const root = 'c:/GitHub/relimie.github.io';
const langs = ['en', 'de', 'ru'];
const pagesText = ['privacy', 'impressum', 'terms', 'guide', 'privacy_web', 'support', 'whats_new', 'votes', 'faq', 'android', 'videos', 'cravings'];

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

// Build carousel HTML for a given section folder and path prefix
function buildCarousel(sectionNum) {
    const imgs = getSectionImages(sectionNum);
    if (imgs.length === 0) return '<p style="color:var(--text-secondary);text-align:center">Screenshots coming soon</p>';
    return imgs.map((img, i) =>
        `<img src="../assets/images/section${sectionNum}/${img}" alt="Relimie App Screenshot" class="carousel-slide${i === 0 ? ' active' : ''}">`
    ).join('\n                ');
}

// Ensure folders exist
langs.forEach(lang => {
    const dirPath = path.join(root, lang);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

// Reusable store badge block used in every landing section
const storeBadgeHtml = `
                    <div class="store-section">
                        <a href="https://apps.apple.com/us/app/relimie-track-alcohol-limits/id6759795714" target="_blank" rel="noopener">
                            <img alt="Download on the App Store" src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" class="store-badge" />
                        </a>
                        <a href="android.html" class="coming-soon-link">
                            <p class="coming-soon" data-i18n="androidComingSoon">Android app coming soon</p>
                        </a>
                    </div>`;

function getTemplate(lang, pageName, isIndex, bodyContent) {
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
                    <h1><span data-i18n="heroTitle">Relimie</span> <span class="version-badge">v2.0.1</span></h1>
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
    <title>Relimie - ${getPageTitle(pageName)}</title>
    <link rel="icon" type="image/png" href="../icon.png">
    <link rel="stylesheet" href="../assets/css/style.css">
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
                        <a href="votes.html" data-i18n="featureVotes">Feature Votes</a>
                    </div>
                </div>
                <div class="nav-item has-dropdown">
                    <a href="guide.html" data-i18n="guide">Guide</a>
                    <div class="dropdown-menu">
                        <a href="guide.html" data-i18n="userGuide">User Guide</a>
                        <a href="videos.html" data-i18n="videoGuides">Video Guides</a>
                        <a href="faq.html" data-i18n="faq">FAQ</a>
                        <a href="cravings.html" data-i18n="cravingsBreaker">Cravings Breaker</a>
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
        <a href="https://apps.apple.com/us/app/relimie-track-alcohol-limits/id6759795714" target="_blank" rel="noopener">
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
console.log("HTML pages generated successfully.");
