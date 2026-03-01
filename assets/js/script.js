document.addEventListener('DOMContentLoaded', () => {
    const defaultLang = 'en';

    // 1. Get Language from Path
    function getLanguageFromUrl() {
        const path = window.location.pathname;
        if (path.includes('/de/')) return 'de';
        if (path.includes('/ru/')) return 'ru';
        if (path.includes('/en/')) return 'en';
        return null;
    }

    // 2. Fallback logic
    let currentLang = getLanguageFromUrl() || localStorage.getItem('site_lang') || navigator.language.split('-')[0] || defaultLang;

    if (!['en', 'de', 'ru'].includes(currentLang)) {
        currentLang = defaultLang;
    }

    // 3. Initialize content
    loadContent(currentLang);
    updateNav(currentLang);
});

async function loadContent(lang) {
    const contentEl = document.getElementById('content');
    if (!contentEl) return;

    const path = window.location.pathname;
    let page = path.split('/').pop().replace('.html', '') || 'index';

    // Default page if inside a lang folder without filename
    if (page === 'index' || page === '') page = 'impressum';

    contentEl.innerHTML = `<p class="loading-text">${translations[lang].loading || 'Loading...'}</p>`;

    if (page === 'support') {
        const text = translations[lang].supportContent;
        contentEl.innerHTML = marked.parse(text);
        return;
    }

    try {
        if (typeof siteContent === 'undefined') {
            throw new Error('siteContent variable is not defined. Make sure assets/js/content.js is loaded correctly.');
        }
        if (!siteContent[lang]) {
            throw new Error(`Language "${lang}" not found in siteContent. Available: ${Object.keys(siteContent).join(', ')}`);
        }
        const text = siteContent[lang][page];
        if (text) {
            contentEl.innerHTML = marked.parse(text);

            // SEO and Title
            const pageTitle = translations[lang][page] || 'Relimie';
            document.title = `Relimie - ${pageTitle}`;
        } else {
            throw new Error(`Content for page "${page}" in language "${lang}" is empty or missing. Available pages: ${Object.keys(siteContent[lang]).join(', ')}`);
        }
    } catch (error) {
        console.error('Content Loading Error:', error);
        contentEl.innerHTML = `<p class="loading-text" style="color: #ff4d4d; border: 1px solid rgba(255, 77, 77, 0.3); padding: 24px; border-radius: 12px; background: rgba(255, 77, 77, 0.05);">
            <strong>Error:</strong> ${error.message}<br><br>
            <small>If viewing locally, check if assets/js/content.js exists. Try refreshing the page.</small>
        </p>`;
    }
}

function updateNav(lang) {
    // Highlight active link (sidebar)
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-item').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(page)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Highlight active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const btnLang = btn.innerText.toLowerCase().trim();
        if (btnLang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update link texts from translations
    document.querySelectorAll('[data-id]').forEach(el => {
        const id = el.getAttribute('data-id');
        if (translations[lang][id]) {
            el.innerText = translations[lang][id];
        }
    });
}
