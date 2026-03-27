const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'assets/docs');
const outputPath = path.join(__dirname, 'assets/js/content.js');

const langs = ['en', 'de', 'ru'];
const keysMap = {
    'impressum': 'impressum_',
    'terms': 'terms_of_service_',
    'privacy': 'privacy_policy_',
    'guide': 'USER_GUIDE_',
    'about': 'about_relimie_'
};

const siteContent = {};

langs.forEach(lang => {
    siteContent[lang] = {};
    for (const [key, prefix] of Object.entries(keysMap)) {
        const fileName = `${prefix}${lang}.md`;
        const filePath = path.join(docsDir, fileName);
        if (fs.existsSync(filePath)) {
            siteContent[lang][key] = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
        } else {
            console.warn(`File not found: ${filePath}`);
            // Fallback for case sensitivity or different naming
            const altFileName = fileName.toLowerCase();
            const altFilePath = path.join(docsDir, altFileName);
             if (fs.existsSync(altFilePath)) {
                 siteContent[lang][key] = fs.readFileSync(altFilePath, 'utf8').replace(/\r\n/g, '\n');
             } else {
                 siteContent[lang][key] = "";
             }
        }
    }
});

const output = `var siteContent = ${JSON.stringify(siteContent, null, 4)};`;
fs.writeFileSync(outputPath, output);
console.log("Successfully rebuilt assets/js/content.js from individual doc files.");
