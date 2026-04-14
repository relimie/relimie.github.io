const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

marked.setOptions({ breaks: true, gfm: true });

const root = 'c:/GitHub/relimie.github.io';
const langs = ['en', 'de', 'ru'];
const pagesText = ['privacy', 'impressum', 'terms', 'guide', 'privacy_web', 'support', 'whats_new', 'votes', 'faq', 'android', 'videos'];

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
    'videos': 'videos'
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
        default: return 'Relimie';
    }
}

// Ensure folders exist
langs.forEach(lang => {
    const dirPath = path.join(root, lang);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

function getTemplate(lang, pageName, isIndex, bodyContent) {
    // Generate the HTML that mirrors LeelaClue
    const content = isIndex ? `
        <div class="new-version-banner">
            <p data-i18n="newVersionBanner">Version 2.0.0 is now live! Discover the new interactive Orb and AI logging.</p>
            <a href="whats_new.html" class="banner-cta" data-i18n="seeWhatsNew">See what's new</a>
        </div>
        <div class="hero">
            <div class="hero-content glass-card">
                <div class="hero-left">
                    <div class="store-section">
                        <a href="https://apps.apple.com/us/app/relimie-track-alcohol-limits/id6759795714" target="_blank" rel="noopener">
                            <img alt="Download on the App Store" src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" class="store-badge" />
                        </a>
                        <a href="android.html" class="coming-soon-link">
                            <p class="coming-soon" data-i18n="androidComingSoon">Android app coming soon</p>
                        </a>
                    </div>
                    <a href="videos.html" class="carousel-link" style="display: block; text-decoration: none;">
                        <div class="carousel-container">
                            <img src="../assets/images/screen1.webp" alt="Relimie App Screenshot 1" class="carousel-slide active">
                            <img src="../assets/images/screen2.webp" alt="Relimie App Screenshot 2" class="carousel-slide">
                            <img src="../assets/images/screen3.webp" alt="Relimie App Screenshot 3" class="carousel-slide">
                            <img src="../assets/images/screen4.webp" alt="Relimie App Screenshot 4" class="carousel-slide">
                        </div>
                    </a>
                </div>
                <div class="hero-right">
                    <h1><span data-i18n="heroTitle">Relimie</span> <span class="version-badge">v2.0.0</span></h1>
                    <div class="subtitle" data-i18n="heroSubtitle">Enjoy the moment without losing your edge.</div>
                    <div id="about-content" class="markdown-body">
                        ${bodyContent}
                    </div>
                    <div style="margin-top: 32px;">
                        <a href="guide.html" class="glass-btn primary" data-i18n="readGuide">Read the User Guide</a>
                    </div>
                </div>
            </div>
        </div>
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

    <script src="../assets/js/translations.js"></script>
    <script src="../assets/js/script.js"></script>
</body>
</html>`;
}

langs.forEach(lang => {
    // Render about for index
    const aboutPath = path.join(root, 'assets', 'docs', `about_relimie_${lang}.md`);
    const aboutMd = fs.readFileSync(aboutPath, 'utf8');
    const aboutHtml = marked.parse(aboutMd);

    // Write index
    fs.writeFileSync(path.join(root, lang, 'index.html'), getTemplate(lang, 'index', true, aboutHtml));
    
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
console.log("HTML pages generated with new Community, Support, Website Privacy, and FAQ menus.");
