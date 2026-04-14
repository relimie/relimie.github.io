const fs = require('fs');
const path = require('path');

const root = 'c:/GitHub/relimie.github.io';
const docsDir = path.join(root, 'assets/docs');
const contentFile = path.join(root, 'assets/js/content.js');

// Map: [lang, contentKey] -> md filename
const mappings = [
    ['en', 'privacy',   'privacy_policy_en.md'],
    ['de', 'privacy',   'privacy_policy_de.md'],
    ['ru', 'privacy',   'privacy_policy_ru.md'],
    ['en', 'terms',     'terms_of_service_en.md'],
    ['de', 'terms',     'terms_of_service_de.md'],
    ['ru', 'terms',     'terms_of_service_ru.md'],
    ['en', 'impressum', 'impressum_en.md'],
    ['de', 'impressum', 'impressum_de.md'],
    ['ru', 'impressum', 'impressum_ru.md'],
];

// Read content.js as text and eval to get the object
let contentJs = fs.readFileSync(contentFile, 'utf8');

// We'll do string replacements by re-serialising each key's value
// Parse the siteContent object
eval(contentJs); // loads siteContent into scope

for (const [lang, key, mdFile] of mappings) {
    const mdPath = path.join(docsDir, mdFile);
    const mdText = fs.readFileSync(mdPath, 'utf8').replace(/\r\n/g, '\n').trimEnd();
    siteContent[lang][key] = mdText;
    console.log(`Updated: ${lang}.${key} from ${mdFile}`);
}

// Serialise back to JS file
const output = 'var siteContent = ' + JSON.stringify(siteContent, null, 4) + ';\n';
fs.writeFileSync(contentFile, output, 'utf8');
console.log('content.js updated successfully.');
