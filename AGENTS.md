# Relimie Website — Project Instructions

> **These instructions are for any AI agent working on the Relimie GitHub Pages website.**
> Read this file in full before making any changes.

---

## 1. Project Overview

Relimie is a **mindful drinking companion app** designed for tracking alcohol consumption, identifying emotional triggers, and habit reflection. This repository hosts the **marketing website** at `https://relimie.com` (served via GitHub Pages at `relimie.github.io`).

The website is a **static site** that uses a small Node.js script (`build_html.js`) for template-based generation of localized pages.

**Current App Version**: v1.0.0
**Target Platform**: iOS (Apple App Store)

---

## 2. Directory Structure

```
relimie.github.io/
├── assets/
│   ├── css/
│   │   └── style.css        # Main stylesheet (Inter font, Obsidian theme)
│   ├── js/
│   │   ├── script.js        # UI logic, content injection, privacy banner
│   │   ├── translations.js  # Dictionary for UI strings (EN/DE/RU)
│   │   └── content.js       # Main page content (Markdown strings)
│   └── images/              # App icon and screenshots (WebP)
│   └── pictures/            # Source screenshots (PNG)
├── en/                      # English pages (generated)
│   ├── index.html           # Homepage
│   ├── guide.html           # User Guide
│   ├── privacy.html         # App Privacy Policy
│   ├── privacy_web.html     # Website Privacy
│   ├── terms.html           # Terms of Service
│   ├── impressum.html       # Legal Notice
│   ├── support.html         # Support Info
│   ├── whats_new.html       # Release News
│   ├── faq.html             # FAQ
│   └── votes.html           # Feature Votes
├── de/                      # German pages (same structure)
├── ru/                      # Russian pages (same structure)
├── index.html               # Root redirect (detects browser language)
├── build_html.js            # HTML generation script (run after template changes)
├── icon.png                 # Main app icon
└── README.md                # Technical setup notes
```

---

## 3. Critical Rules

### 3.1 Trilingual Consistency
- **Every content change must be applied to all three languages**: `/en/`, `/de/`, `/ru/`.
- German uses informal **"du"** (lowercase) address consistently.
- Russian uses informal **"ты"** address consistently, with correct use of **"ё"**.
- Key translations are managed in `assets/js/translations.js`.

### 3.2 Navigation and Content
- Main page content is stored as Markdown strings in `assets/js/content.js`.
- UI strings (buttons, labels, nav) are in `assets/js/translations.js`.
- Content is injected at runtime using `marked.js`.

### 3.3 The Build Process
- The HTML files in the language folders are **generated**.
- If you modify the global layout (header, footer, head tags), edit `build_html.js` and run it:
  ```powershell
  node build_html.js
  ```
- Do NOT edit the HTML files in `/en/`, `/de/`, or `/ru/` directly if the change is structural; they will be overwritten by the build script.

### 3.4 Design System (Obsidian Aesthetic)
- **Primary Color (Teal)**: `#2DD4BF`
- **Secondary Color (Indigo)**: `#6366F1`
- **Background**: `#0F172A` (Deep navy/black)
- **Glassmorphism**: Large blur values (`24px`), subtle borders (`rgba(255, 255, 255, 0.1)`), and translucent backgrounds.
- **Typography**: `Inter` (Google Fonts).

### 3.5 Privacy & Tracking
- **No Cookies**: The website does NOT use cookies.
- **Local Storage**: Used only for functional purposes (storing language preference and privacy banner acceptance state).
- **No External Analytics**: No Google Analytics or third-party tracking scripts.

---

## 4. Common Tasks

### Updating Page Content
1. Open `assets/js/content.js`.
2. Find the relevant language and page key (e.g., `en.guide`).
3. Edit the Markdown content.
4. Changes are live immediately (no need to run `build_html.js`).

### Adding a New Page to the Template
1. Add the page name to the `pagesText` array in `build_html.js`.
2. Add the title mapping to `getPageTitle` in `build_html.js`.
3. Add the content string to all languages in `assets/js/content.js`.
4. Add the link to the navigation in the `getTemplate` function in `build_html.js`.
5. Run `node build_html.js`.

### Modifying the Privacy Banner
1. Edit the `privacyNotice` and `privacyAccept` strings in `assets/js/translations.js`.
2. The logic is located in `assets/js/script.js` inside `initPrivacyBanner`.

### Updating the Hero Carousel
1. Convert new screenshots to `.webp` format and place them in `assets/images/`.
2. Update the `img` tags in the `carousel-container` section of `build_html.js`.
3. Run `node build_html.js`.

---

## 5. Important Notes

- **App Links**: Relimie is currently only on the Apple App Store. Android links should be marked as "Coming Soon".
- **Documentation**: You MUST update this `AGENTS.md` file after each new feature implementation to ensure all instructions remain accurate.
- **Legal Compliance**: Ensure Impressum and Privacy Policy are always accessible and up to date across all languages.
- **Commit Messages**: Use `feat:`, `fix:`, `docs:`, or `chore:` prefixes.
