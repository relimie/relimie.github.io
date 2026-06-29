# Relimie Website — Project Instructions

> Read this file in full before making any changes.

---

## 1. Project Overview

Relimie is a **mindful drinking companion app** for tracking alcohol consumption, identifying emotional triggers, and habit reflection. This repository hosts the **marketing website** at `https://relimie.com` (GitHub Pages at `relimie.github.io`).

The website is a **static site** built by a Node.js script (`build_html.js`) that reads Markdown source files and generates localized HTML.

**Current App Version**: v2.1.0
**Target Platform**: iOS (Apple App Store); Android marked as "Coming Soon"

---

## 2. Directory Structure

```
relimie.github.io/
├── assets/
│   ├── css/
│   │   └── style.css              # Main stylesheet (Inter font, Obsidian theme)
│   ├── js/
│   │   ├── script.js              # UI logic: carousel, scroll-spy, privacy banner, sticky CTA
│   │   └── translations.js        # All UI strings (EN/DE/RU) via data-i18n attributes
│   ├── docs/                      # Source of Truth: Markdown for every page
│   │   ├── privacy_policy_[lang].md
│   │   ├── terms_of_service_[lang].md
│   │   ├── impressum_[lang].md
│   │   ├── USER_GUIDE_[lang].md
│   │   ├── about_relimie_[lang].md      # Index Section 1: who it's for + baseline
│   │   ├── landing_diary_[lang].md      # Index Section 2: Diary feature
│   │   ├── landing_logging_[lang].md    # Index Section 3: Drinks logging
│   │   ├── landing_analytics_[lang].md  # Index Section 4: Analytics & data export
│   │   ├── cravings_[lang].md           # Index Section 5 + standalone page: Cravings Breaker
│   │   ├── faq_[lang].md
│   │   ├── videos_[lang].md
│   │   ├── whats_new_[lang].md
│   │   ├── android_[lang].md
│   │   ├── privacy_web_[lang].md
│   │   └── support_[lang].md
│   └── images/
│       ├── section1/   # Hero screenshots/videos (carousel) — WebP preferred
│       ├── section2/   # Diary carousel
│       ├── section3/   # Logging carousel
│       ├── section4/   # Analytics carousel
│       └── section5/   # Cravings Breaker carousel
├── en/                 # Generated English pages (do not edit directly)
├── de/                 # Generated German pages
├── ru/                 # Generated Russian pages
├── index.html          # Root redirect — detects browser language
├── build_html.js       # Static Site Generator
├── sitemap.xml         # Sitemap index (references sitemap-main.xml + sitemap-legal.xml)
├── sitemap-main.xml    # Content pages sitemap (homepage, guide, faq, cravings, etc.)
├── sitemap-legal.xml   # Legal pages sitemap (privacy, terms, impressum, privacy_web)
├── robots.txt          # Crawler directives + sitemap reference
├── llms.txt            # AI system self-description (GEO / AI search)
├── TODO.md             # Pending tasks (OG image, GSC submission, App Store rating)
├── icon.png            # App icon (also used as og:image fallback until OG image is created)
├── video.md            # Video hosting decision reference (self-host vs YouTube)
└── README.md           # Technical setup notes
```

---

## 3. Critical Rules

### 3.1 Trilingual Consistency & Tone
- **Every content change must be applied to all three languages**: EN, DE, RU.
- **Tone**: Mindful, personal, and supportive. Avoid "AI fluff" or overly academic/clinical phrasing.
- **German**: Informal **"du"** (lowercase) consistently.
- **Russian**: Informal **"ты"** consistently, correct **"ё"** always. Avoid vulgar/slang terms (e.g., use **"бокалом"** instead of **"выпивкой"**).
- **Terminology**:
    - The app is a **"helper"** (DE: *starker Helfer*, RU: *мощный помощник*), not a "tool."
    - The centerpiece UI is the **"Orb"** (EN), **"Sphäre"** (DE), or **"Сфера"** (RU).
- **Highlighting**: Use the **🎁 Gift icon** inside a **blockquote** to highlight high-value free features.
    - Format: `> 🎁 **[Heading]:** [Description]`
- UI strings (buttons, labels, nav) live in `assets/js/translations.js`.

### 3.2 Build Process
- All HTML in `/en/`, `/de/`, `/ru/` is **generated** — never edit those files directly for structural changes.
- After any change to `build_html.js`, `.md` source files, or template logic, run:
  ```powershell
  node build_html.js
  ```
- Content is hard-baked into HTML at build time (no runtime Markdown rendering).
- **On every app release, bump `APP_VERSION` in `build_html.js`.** It is appended to the CSS/JS URLs as `?v=` for cache-busting — without it, GitHub Pages' CDN can keep serving a stale `translations.js`, which leaves the old version banner showing even after deploy.
- **`whats_new_[lang].md` is a cumulative changelog** (newest version section on top). Add a new `## Version X.Y.Z` section per release rather than replacing the file. Source historical notes from `C:\GitHub\Relimie\metadata\release_notes\` and `C:\GitHub\Relimie\marketing\vXYZ\`.
- `marked-gfm-heading-id` generates stable anchor IDs for all headings (critical for ToC links).
- **SEO functions in `build_html.js`**: `getPageTitleFull(page, lang)` generates `<title>`, `getPageDescription(page, lang)` generates `<meta name="description">`, `getHreflangTags(pageName)` generates hreflang links, `getSchemaOrg(lang, pageName, isIndex)` generates JSON-LD schema. Update these functions when adding new pages.
- **Schema details in `getSchemaOrg`**: index emits Organization + WebSite + MobileApplication (with `keywords`/`downloadUrl`); FAQ emits FAQPage (answers are Markdown-stripped for clean text); the `story` page also emits `Article` and the `guide` page `TechArticle` (author = Organization, founder stays anonymous), plus a BreadcrumbList on all other content pages. `og:type` is `article` for the `story` page (else `website`). Titles/descriptions are intentionally platform-agnostic ("app", not "for iPhone") for broader keyword reach.
- **After adding a new page**, update `getPageDescription()` with trilingual descriptions for all three languages. For high-value content pages (guide, faq, cravings pattern), also add a language-aware case to `getPageTitleFull()` with keyword-rich titles per language.
- **`sitemap-main.xml` and `sitemap-legal.xml`** must be updated manually when pages are added or content significantly changes (lastmod dates). The build script does not auto-generate sitemaps.

### 3.3 Design System (Obsidian Aesthetic)
| Token | Value |
|---|---|
| Primary (Teal) | `#2DD4BF` |
| Secondary (Indigo) | `#6366F1` |
| Background | `#0F172A` |
| Glassmorphism | `backdrop-filter: blur(24px)`, `rgba(255,255,255,0.1)` borders |
| Typography | `Inter` (Google Fonts) |

### 3.4 Privacy & Tracking
- **No cookies.** Local Storage only for language preference and privacy banner state.
- **No external analytics** — no Google Analytics, no tracking scripts.
- Embedded YouTube iframes are incompatible with this policy (see `video.md`).

### 3.5 Scope Discipline
- **ONLY touch files relevant to the requested change.**
- **NEVER modify unrelated pages or shared files unless the task explicitly requires it.**

---

## 4. Architecture: Index Page

The index page leads with an **eye-catcher hero + value grid**, followed by **5 detailed scroll sections**. The hero/grid carry the headline messages; the sections provide depth, screenshots, and SEO body copy. Sections 2–5 animate in on scroll.

### Hero (`#home-hero`) — animated Orb
The page's single `<h1>` lives here. It shows the app's **Orb** as a pure-CSS animation: the source `assets/images/mindful_orb.webp` (a circular-masked WebP exported from the app's `mindful_orb.png`) is wrapped in `.hero-orb` (breathing scale + glow pulse) → `.hero-orb-inner` (slow 50s rotation). Motion is disabled under `prefers-reduced-motion`. The Orb is the LCP element and is `<link rel="preload">`ed in the head (carousel images are all `loading="lazy"`).
- Text via i18n keys: `heroTagline` (the H1), `heroLead` (positioning sentence), `heroTrust` (privacy one-liner). Reuses `storeBadgeHtml` for the CTA.

### Value grid (`.value-grid`)
A centered flex row of 5 **clickable** cards (icon + heading + one sentence) summarizing the key messages. Built by `buildHighlightGrid(lang)` in `build_html.js` from `assets/docs/landing_highlights_[lang].md` (each card = a `### Heading` + a one-line paragraph). Each card is an `<a>` that scrolls to its detailed section below; targets come from the `HIGHLIGHT_LINKS` array (markdown order → `#ls-hero`, `#ls-diary`, `#ls-cravings`, `#ls-analytics`, `#ls-logging`). Icons come from the `HIGHLIGHT_ICONS` array (inline SVGs, `stroke="currentColor"`, tinted teal), assigned by the same order. To change a card, edit the markdown (all 3 langs); to change an icon/target, edit `HIGHLIGHT_ICONS` / `HIGHLIGHT_LINKS` (keep all three arrays/markdown in the same order). Styled under `.value-grid` / `.value-card` / `.value-icon` in `style.css`.

### Detailed sections
| Section | ID | Layout | Content file |
|---|---|---|---|
| 1 — Baseline | `#ls-hero` | media left, text right | `about_relimie_[lang].md` |
| 2 — Diary | `#ls-diary` | text left, media right (reversed) | `landing_diary_[lang].md` |
| 3 — Logging | `#ls-logging` | media left, text right | `landing_logging_[lang].md` |
| 4 — Analytics | `#ls-analytics` | text left, media right (reversed) | `landing_analytics_[lang].md` |
| 5 — Cravings Breaker | `#ls-cravings` | media left, text right | `cravings_[lang].md` |

Each section's `.ls-media` contains an App Store badge block (`storeBadgeHtml`) **above** the carousel. (Note: `#ls-hero` is now the Baseline deep-dive section — its old `<h1>`/subtitle moved to `#home-hero`; its `## ` markdown heading is the section title.)

### Scroll Animations
- Sections 2–5 use `.reveal-section` class.
- Cards scale from 0.85→1.0 with spring easing `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- Children slide in horizontally (90px) with staggered delays.
- Carousel gets a float animation after reveal (`floatPhone` keyframe, 5s).
- Triggered by `initScrollReveal()` via IntersectionObserver (threshold 0.2).

### Sticky Legal Bar (`#sticky-cta`)
- Fixed bottom bar present on **all pages** (index and text pages alike). Carries the required **legal links** (Terms, Privacy, Website Privacy, Impressum) so they are reachable from any scroll position — legal compliance, not a download CTA. (The element id stays `sticky-cta` for backwards compatibility; it is a `<nav aria-label="Legal links">`.)
- Shown whenever the **footer** (which carries the same links) is out of view; hidden once the footer is reached, to avoid duplicating the links at the very bottom. Same behaviour on every page.
- Logic in `initStickyLegal()` in `script.js` (observes `.glass-footer`). Styled under `.sticky-cta` in `style.css`.
- Footer has extra bottom padding to prevent overlap on mobile.

### Carousel
- Each section reads all `.webp/.png/.jpg` files from its `assets/images/sectionN/` folder at build time.
- No code change needed to add/swap images — just drop files in the folder and rebuild.
- `startCarousel()` runs independently per `.ls-carousel` container (4-second interval).
- Carousel frames have a teal border + glow to stand out from the dark background.
- **Prefer WebP**: convert PNG with `ffmpeg -y -i input.png -vf "scale=600:-1" -c:v libwebp -quality 85 output.webp`

---

## 5. Architecture: Text Pages

All non-index pages use the same template: a centered `.glass-card.page-card` wrapping a `.markdown-body` article.

Pages are registered in `build_html.js`:
- `pagesText` array — list of page keys
- `fileMap` — maps page key → MD filename prefix
- `getPageTitle()` — maps page key → HTML `<title>` suffix

**Navigation dropdown placement:**
- Guide dropdown: User Guide, Video Guides, FAQ, Support (Support also keeps its direct link in the footer)
- Community dropdown: Android Open Test, Release News

**`cravings_[lang].md` serves double duty**: it is both Section 5 on the index page AND the standalone `cravings.html` text page.

---

## 6. Common Tasks

### Update Page Content
1. Edit the `.md` file(s) in `assets/docs/` for all three languages.
2. Run `node build_html.js`.

### Add a New Index Section
1. Create `assets/docs/newpage_[lang].md` for EN/DE/RU.
2. Create `assets/images/sectionN/` folder.
3. Add `sN: readMd('newpage_${lang}.md')` to `indexContent` in `build_html.js`.
4. Add the `<section>` block to the `isIndex` template in `getTemplate()`.
5. Optionally add a value-grid card pointing to it (edit `landing_highlights_[lang].md` + `HIGHLIGHT_LINKS`/`HIGHLIGHT_ICONS`).
6. Run `node build_html.js`.

### Add a New Text Page
1. Create `assets/docs/pagename_[lang].md` for EN/DE/RU.
2. Add to `pagesText`, `fileMap`, `getPageTitle` in `build_html.js`.
3. Add nav link in `getTemplate()`.
4. Add translation key to `translations.js` if the nav label needs it.
5. Run `node build_html.js`.

### Sync Legal Documents
Source of truth for privacy/terms/impressum is `C:\GitHub\Relimie\docs\`.
1. Copy updated MD files into `assets/docs/`.
2. Run `node build_html.js`.
3. Commit and push.

### Add Screenshots/Videos to a Section
Drop `.webp`/`.png`/`.jpg` files into the correct `assets/images/sectionN/` folder and run the preparation script:
```powershell
python scripts/prepare_images.py
node build_html.js
```
The script will:
1. Rename original images to `screen<N>-org.webp`.
2. Create `screen<N>.webp` with a background layer (filled from `background.*`) and 10% padding.
3. Remove redundant source files.

For video: self-host short `.mp4` clips (+ `.webm` fallback) in the same folder. See `video.md` for details and ffmpeg commands. Update `buildCarousel()` in `build_html.js` to detect video extensions.

### Update the Privacy Banner
Edit `privacyNotice` and `privacyAccept` in `translations.js`. Logic is in `initPrivacyBanner()` in `script.js`.

---

## 7. Important Notes

- **App Links**: iOS App Store only. Android links must say "Coming Soon" (`androidComingSoon` i18n key).
- **Keep this file current**: Update `CLAUDE.md` after every new feature or structural change.
- **Legal compliance**: Impressum and Privacy Policy must always be accessible across all three languages.
- **Commit prefixes**: `feat:`, `fix:`, `docs:`, `chore:`.
