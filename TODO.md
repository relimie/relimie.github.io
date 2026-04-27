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
