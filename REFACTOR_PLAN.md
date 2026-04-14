# Project Refactor Plan: Moving to a True Static Architecture

## 1. Problem Statement
The current website architecture relies on a single JavaScript file (`assets/js/content.js`) to store all localized content as Markdown strings. This creates a **single point of failure**: any syntax error in this large file (missing comma, unescaped quote) renders the entire site variable `siteContent` undefined, breaking the website completely.

## 2. Objective
Transition the Relimie website to a **Hard-Baked Static Architecture**.
- **Source of Truth**: Individual `.md` files in `assets/docs/`.
- **Build Step**: `build_html.js` will read these Markdown files, render them to HTML, and inject them directly into the generated `.html` files in the language folders (`/en/`, `/de/`, `/ru/`).
- **Runtime**: `script.js` will no longer handle content injection. It will only manage UI logic (language persistence, privacy banner).

## 3. Implementation Steps

### Phase 1: Content Extraction
1.  Identify all content keys in `content.js` that are not yet represented by a standalone file in `assets/docs/`.
2.  Create the following new Markdown files (for each language):
    - `faq_[lang].md`
    - `videos_[lang].md`
    - `whats_new_[lang].md`
    - `android_[lang].md`
    - `privacy_web_[lang].md` (if applicable)
3.  Ensure existing files (`USER_GUIDE_*.md`, `about_relimie_*.md`, etc.) are correctly mapped.

### Phase 2: Build Script Update (`build_html.js`)
1.  **Integrate Markdown Rendering**:
    - Add `const { marked } = require('marked');` to the build script.
2.  **Logic Update**:
    - Create a mapping between `pagesText` (the HTML filenames) and the physical Markdown files in `assets/docs/`.
    - Update the `build` loop to read the corresponding `.md` file for the current page and language.
    - Render the Markdown to HTML string.
3.  **Template Injection**:
    - Update the `getTemplate` function to accept the `renderedBody` and `renderedAbout` as arguments.
    - Replace the current empty placeholders (`<!-- Content injected via script.js -->`) with the actual `${renderedBody}`.

### Phase 3: Client-side Cleanup (`script.js`)
1.  Remove the `initContent()` function or the logic that targets `id="content"` and `id="about-content"`.
2.  Keep the logic for UI-string translations (navigation, buttons) which will still use `translations.js`.
3.  Remove the "Coming Soon" interceptor logic at line 84 of `script.js` if it becomes redundant.

### Phase 4: Decommissioning
1.  **Delete** `assets/js/content.js`.
2.  **Delete** the now-obsolete generator scripts:
    - `generate_content.js`
    - `rebuild_content.js`
    - `update_content.js`
3.  **Update `AGENTS.md`**: Update Sections 3 and 4 to document the new file-based content workflow.

## 4. Verification Plan
1.  Run `node build_html.js`.
2.  Verify that all generated `.html` files in `/en/`, `/de/`, and `/ru/` contain the actual text in their source code.
3.  Verify that browser console shows no "siteContent is undefined" errors.
4.  Ensure language switching still works for navigation and UI strings.
