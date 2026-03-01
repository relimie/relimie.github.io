const fs = require('fs');
const path = require('path');

const pages = ['impressum', 'terms', 'privacy', 'guide'];
const langs = ['en', 'de', 'ru'];
const fileMap = {
    'impressum': 'impressum_{lang}.md',
    'terms': 'terms_of_service_{lang}.md',
    'privacy': 'privacy_policy_{lang}.md',
    'guide': 'USER_GUIDE_{lang}.md'
};

const siteContent = {};

langs.forEach(lang => {
    siteContent[lang] = {};
    pages.forEach(page => {
        const fileName = fileMap[page].replace('{lang}', lang);
        const filePath = path.join(__dirname, 'assets', 'docs', fileName);
        if (fs.existsSync(filePath)) {
            siteContent[lang][page] = fs.readFileSync(filePath, 'utf-8');
            console.log(`- Found ${fileName} for ${lang}/${page} (${siteContent[lang][page].length} chars)`);
        } else {
            siteContent[lang][page] = "";
            console.log(`- NOT FOUND: ${fileName} for ${lang}/${page}`);
        }
    });
});

const js = `var siteContent = ${JSON.stringify(siteContent, null, 4)};`;
fs.writeFileSync(path.join(__dirname, 'assets', 'js', 'content.js'), js);
console.log('Successfully generated assets/js/content.js');
