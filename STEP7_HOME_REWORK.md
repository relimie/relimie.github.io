# Step 7 — Home Page Rework (Issue #9): Progress & Handoff

> Working branch: **`new_home2`** (off `main`). Nothing committed yet.
> Last updated by the implementation session. Pick up from "Remaining work" below.

---

## Goal

The old home page was 5 heavy, text-dense scroll sections — no instant hook. Turn it into an
**eye-catcher**: lead with the app's signature **Orb** as a live animation + a scannable value grid that
carries the key messages, while keeping the detailed sections (and their Step-6 SEO copy) below.

Confirmed decisions:
- **Hybrid structure**: new hero + value grid on top, existing 5 sections kept below.
- **Orb = pure-CSS animation** (no video/Lottie; the app animates it in code, no export exists).
- **Copy rule (saved to memory):** never use the word **"drinkers"**; frame the audience as
  self-confident people who enjoy a fine glass in moderation. Activity terms ("mindful drinking",
  "moderate drinking", "sober-curious") are still fine.
- Trilingual EN/DE/RU; DE informal "du"; RU informal "ты" + "ё".

---

## DONE (all built and previewed, all 3 languages)

### Hero (`#home-hero`)
- Animated **Orb**: `assets/images/mindful_orb.webp` (27 KB, circular-masked WebP exported from the app's
  `C:\GitHub\Relimie\assets\images\mindful_orb.png`). Pure CSS: `.hero-orb` breathes (scale 1→1.06,
  3.5s) + glow pulse (4s); inner `.hero-orb-inner` slow-rotates (50s). Disabled under
  `prefers-reduced-motion`. It is the LCP element (preloaded in `<head>`).
- Single page `<h1>` = tagline **"Enjoy Life. Keep Control."** (i18n `heroTagline`), positioning lead
  (`heroLead`), App Store CTA (reuses `storeBadgeHtml`), trust line `heroTrust`
  ("No account. No cloud. Your data stays on your device.").

### Value grid (`.value-grid`) — 5 clickable cards
- Built by `buildHighlightGrid(lang)` from `assets/docs/landing_highlights_[lang].md`
  (each card = `### Title` + one sentence). Centered flex layout (last row of 2 centers properly).
- Each card is an `<a>` that scrolls to its section. Order & targets (`HIGHLIGHT_LINKS` in `build_html.js`):
  1. Reduce or Quit, Your Call → `#ls-hero` (Baseline)
  2. Feelings, Not Just Numbers → `#ls-diary`
  3. Beat the Urge in the Moment → `#ls-cravings`
  4. Analytics as Precise as You Like → `#ls-analytics`
  5. Made for Self-Confident Individuals → `#ls-logging`
- Icons = `HIGHLIGHT_ICONS` array (inline SVG, teal). Privacy card was **removed** (hero trust line covers it).

### Navigation
- "What's new" page banner **removed**; replaced by a teal nav button **"See what's new in 2.1.0"**
  (`navWhatsNew`) in the shared header, just left of **Guide**. Appears on every page.

### Sections (kept, lightly restructured)
- Old section-1 `<h1>`/subtitle moved into the hero; `#ls-hero` is now the Baseline deep-dive (its `##`
  markdown heading is the section title). Exactly one `<h1>` per page.
- **"↑ Back to top"** link (`backToTop`) appended to every section (→ `#home-hero`).
- **Mobile fix:** reversed sections (Diary, Analytics) now use `column-reverse` on ≤900px, so **every**
  section leads with its carousel then text (was inconsistent before). Carousels are all `loading="lazy"`.

---

## Files touched

- `build_html.js` — hero + value grid markup; `buildHighlightGrid()`, `HIGHLIGHT_ICONS`,
  `HIGHLIGHT_LINKS`, `backToTopHtml`; nav button; LCP preload → Orb; carousels all lazy.
- `assets/css/style.css` — `.home-hero`, `.hero-orb*`, `@keyframes orbBreathe/orbSpin/orbGlow`,
  reduced-motion guard, `.value-grid`/`.value-card`/`.value-icon`, `.back-to-top`, `.nav-whatsnew`,
  mobile `column-reverse` for reversed cards + mobile hero/grid padding.
- `assets/js/translations.js` — new keys (EN/DE/RU): `heroTagline`, `heroLead`, `heroTrust`,
  `navWhatsNew`, `backToTop`. (Old `heroTitle`/`heroSubtitle`/`seeWhatsNew`/`newVersionBanner` left in
  place but no longer used on index.)
- `assets/js/script.js` — `initStickyCta()` now observes `#home-hero .store-section`.
- `assets/docs/landing_highlights_{en,de,ru}.md` — **NEW** (5 cards each).
- `assets/images/mindful_orb.webp` — **NEW** (the Orb).
- `CLAUDE.md` — §4 Architecture: Index Page updated (hero, value grid, clickable cards).
- All `en/ de/ ru/*.html` — regenerated (header nav button = sitewide change).

---

## Remaining work (next session)

1. **Light trim of the 5 section `.md` files** (`about_relimie_*`, `landing_diary_*`,
   `landing_logging_*`, `landing_analytics_*`, `cravings_*`, all 3 langs). The cards now summarize the
   key points, so the section intros partly duplicate them. Cut ~1–2 redundant opening sentences per
   section. **Keep** all bullet lists, 🎁 free-feature blockquotes, feature names, and Step-6 SEO
   keywords. (Optional — page already works without it.)
2. **Commit** on `new_home2` (user controls commit cadence; not done yet).
3. **Optional polish ideas** if wanted: balance the 5-card grid (e.g. tweak card order), revisit hero
   copy wording, measure Lighthouse before/after.
4. **Deploy/GSC** (user action, after merge/push): once live, URL-inspect the homepage in Google Search
   Console.

---

## How to build & preview

```powershell
node build_html.js              # regenerate /en /de /ru from .md + templates
# preview (headless Edge full-page screenshot):
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu `
  --hide-scrollbars --window-size=1280,1400 `
  --screenshot="preview.png" "file:///C:/GitHub/relimie.github.io/en/index.html"
```
Or just open `en/index.html` in a browser (the Orb animates live; it's static in screenshots).

**Note:** `node build_html.js` regenerates HTML; never hand-edit `/en /de /ru/*.html`. To change a
card, edit `landing_highlights_*.md` (all 3) + rebuild. To change a card's icon/target, edit
`HIGHLIGHT_ICONS` / `HIGHLIGHT_LINKS` (keep arrays + markdown in the same order).
