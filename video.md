# Video Hosting Decision

This document records the decision on how to host app demo videos for the Relimie landing page sections.

## The Problem

The landing page sections (Diary, Logging, Analytics) may benefit from short app demo videos instead of static screenshots. The choice of hosting method has privacy implications.

## Options Evaluated

### 1. Standard YouTube Embed (NOT recommended)
```html
<iframe src="https://www.youtube.com/embed/VIDEO_ID"></iframe>
```
YouTube immediately loads tracking scripts and sets cookies when the iframe is present on the page — even before the user clicks play. This directly violates `agents.md §3.5` (no external tracking/cookies) and would make the privacy banner misleading.

### 2. YouTube Privacy-Enhanced Embed (partial compromise)
```html
<iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID"></iframe>
```
Uses `youtube-nocookie.com` — YouTube's own privacy mode. No cookies are set until the user interacts with the player. Better, but still loads YouTube JavaScript and shows YouTube branding. Acceptable if self-hosting is not feasible, but not ideal.

### 3. Self-Hosted MP4/WebM (recommended)
```html
<video autoplay muted loop playsinline>
    <source src="../assets/images/section2/demo.webm" type="video/webm">
    <source src="../assets/images/section2/demo.mp4" type="video/mp4">
</video>
```
- Full privacy — zero third-party scripts or cookies
- Consistent with the offline-first, no-tracking architecture
- GitHub Pages serves static files with no size per-file limit (repo soft limit ~1GB)
- A 30–60 second app demo, compressed to H.264/VP9, is typically **5–20 MB**
- Recommended attributes: `autoplay muted loop playsinline` (silent autoplaying loop, no controls needed for a demo)

## Where to Put Video Files

Drop video files into the corresponding section subfolder alongside screenshots:
```
assets/images/
  section1/   ← hero demo
  section2/   ← diary demo
  section3/   ← logging demo
  section4/   ← analytics demo
```

The build script (`build_html.js`) currently reads only image files (`.webp`, `.png`, `.jpg`, `.jpeg`) from these folders. When you add video support, update `buildCarousel()` to detect video files and render a `<video>` element instead of an `<img>`.

## Recommended Compression Settings

Use HandBrake or `ffmpeg` to compress recordings:
```bash
ffmpeg -i input.mov -vcodec libx264 -crf 28 -preset slow -movflags +faststart -an output.mp4
ffmpeg -i input.mov -vcodec libvpx-vp9 -crf 35 -b:v 0 -an output.webm
```
- `-an` removes audio (silent demo loop)
- `-movflags +faststart` allows streaming before full download
- Target: under 20MB per clip
