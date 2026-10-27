# Relimie Website — Open Tasks

## SEO

- [ ] **Create OG image** (`assets/images/og-image.png`, 1200×630px)
  - Used by Twitter/X, LinkedIn, iMessage, Slack when anyone shares a relimie.com link
  - Currently pointing to `icon.png` as a fallback — works but shows a small square icon instead of a proper link preview
  - Suggested content: app icon + "Relimie" wordmark on the dark `#0F172A` background, maybe with tagline
  - Once created, update the two lines in `build_html.js` and rebuild:
    ```
    og:image  → https://relimie.com/assets/images/og-image.png
    twitter:image → https://relimie.com/assets/images/og-image.png
    ```
  - Then run `node build_html.js`

- [ ] **Submit sitemap to Google Search Console**
  - URL to submit: `https://relimie.com/sitemap.xml`

- [ ] **Add App Store rating to hero section** (once the app has enough reviews)
  - Suggested placement: below the App Store badge in `storeBadgeHtml` in `build_html.js`
  - Example: `★★★★★ on the App Store`
  - Also add `aggregateRating` to the `MobileApplication` schema in `getSchemaOrg()`

## Release 2.3.0 follow-ups

Tasks 1 (user guide sync, `2b34895`) and 2 (What's New + nav badge, `c475637`) are done. Work through the rest one at a time, all three languages, following the app's text rules (`C:\GitHub\Relimie\.agent\COPY_EXAMPLES.md`): no dashes in German (" - " only if needed), no "(free)"/"(kostenlos)" labels, state the core idea instead of code details, never present Premium as the reason for a behaviour. The user writes the final Russian wording.

- [ ] **Value-grid cards for the Promillerechner and Challenges** (index page)
  - Add two cards to `landing_highlights_[lang].md` (EN/DE/RU), plus matching entries in `HIGHLIGHT_LINKS` and `HIGHLIGHT_ICONS` in `build_html.js` (keep all in the same order)
  - Promillerechner card → `promille-calculator.html` (the article with the live calculator)
  - Challenges card → no index section exists yet; decide the target (e.g. `guide.html#6-challenges`, or a new index section)
  - Check the grid layout with 7 cards at desktop/tablet/phone widths; update CLAUDE.md §4 (currently says 5 cards)

- [ ] **New Ratgeber (article hub) topic**
  - Pick the topic with the user first
  - Follow CLAUDE.md §5.1 "To add an article": md files in 3 languages, `articles` registry entry, sitemap URLs + hub lastmod, `llms.txt`, rebuild

- [ ] **Russian nav badge wording**: currently `V2.3.0 - трекинг может быть весёлым!` (`navWhatsNew` in `translations.js`), placeholder until the user decides

- [ ] **Old "Kostenlos" gift boxes in What's New** (2.2.0 and 2.1.0 sections, all languages): ask the user whether to keep or reword them
