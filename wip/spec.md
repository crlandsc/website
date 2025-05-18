# Christopher Landschoot – Personal Website  
Comprehensive Functional & Technical Specification  
_Revision 1 • 2025-05-03_

---

## 1. Goal & Scope  

A single-page, fully-responsive personal website that

* showcases Christopher Landschoot’s profile, work, projects, research, skills, interests, and contact info,
* is **static-site friendly** (no backend; deploy on GitHub Pages),
* is easy for a non-front-end developer to maintain (all content lives in one Markdown/JSON file + media folder),
* uses only vanilla HTML + CSS + ES6 JavaScript (optional SCSS compiled at build time),
* pulls live data from GitHub for project stats,
* supports subtle motion effects but stays performant on mobile.

Cursor AI or any coding agent should be able to scaffold and ship the entire site by following this spec alone.

---

## 2. Tech Stack & Tooling

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Mark-up | Standards-compliant HTML5 (semantic) | Works everywhere, no framework lock-in |
| Styling | CSS3 + CSS custom properties (<link> or single *.css) | Simple; easily themable |
| Script | Vanilla ES6 in a single bundled `main.js` | Few interactive elements needed |
| Build | Optional: Vite or Parcel (0-config) to bundle & minify; **or** direct hand-written files | Keep DX simple |
| Data | `content.json` (or `website.md`) parsed at build time for text copy | One-file updates |
| Deployment | GitHub Pages via `gh-pages` branch | Free, custom domain ready |
| CI | GitHub Action: “build-and-deploy.yml” runs on push to `main` | <20 lines; caches node_modules |

_No React, Vue, Svelte, etc. to honor “as simple as possible.”_

---

## 3. Information Architecture

The site is a single long-scroll page with anchored sections:

1. `#home`   Hero
2. `#about`   About / Personal profile
3. `#experience`   Professional experience timeline
4. `#projects`   Projects (GitHub cards + links)
5. `#education`   Education & Research
6. `#skills`   Skill matrix
7. `#interests`   Visual carousel
8. `#contact`   Contact form / e-mail link
9. `#footer`   Social links & copyright

Navigation links correspond to the anchors.

---

## 4. Page-Level Layout

```
<body>
 ├─ <header>  (sticky nav)
 ├─ <main>
 │   ├─ <section id="home">        Hero
 │   ├─ <section id="about">       About
 │   ├─ <section id="experience">  Timeline
 │   ├─ <section id="projects">    Cards grid
 │   ├─ <section id="education">   Columns
 │   ├─ <section id="skills">      Skill tags
 │   ├─ <section id="interests">   Carousel
 │   ├─ <section id="contact">     Form
 │   └─ <button class="to-top">    Back-to-top (JS)
 └─ <footer>                       Minimal footer
```

---

## 5. Design Tokens

### 5.1 Color Palette (CSS Variables)

```
:root {
  --clr-primary-600:#2563eb;   /* tech blue */
  --clr-primary-500:#3b82f6;
  --clr-primary-100:#e0ebff;

  --clr-neutral-900:#0f172a;
  --clr-neutral-700:#334155;
  --clr-neutral-100:#f1f5f9;
  --clr-neutral-000:#ffffff;

  --clr-accent-500:#38bdf8;    /* subtle cyan highlight */
}
```

All colors can be overridden in `:root {}` for quick theme changes.

### 5.2 Typography

```
font-family:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
  Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
```

Headings: `font-weight:600`  
Body: `font-weight:400`  
Base size: `16px` (rem-based scaling).

### 5.3 Spacing & Breakpoints

```
--space-xs: .5rem;
--space-s : 1rem;
--space-m : 1.5rem;
--space-l : 2.5rem;
--space-xl: 4rem;

@media (min-width: 768px)  { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
```

---

## 6. Component Specs

### 6.1 Navigation Bar (`<header>`)

* Sticky at top (`position:sticky; top:0; backdrop-filter:blur(6px)`).
* Left: site logo text “CHRISTOPHER LANDSCHOOT”.
* Right: horizontal list of anchor links.
* Mobile ≤768 px: hamburger toggles a slide-down menu (`details/summary` or JS).

Accessibility: `<nav aria-label="Primary">`.

### 6.2 Hero (`#home`)

* Full-viewport (`100vh`) section.
* Background: `<video>` or `<img>` with `object-fit:cover;`  
  Source path: `/assets/hero.mp4` or `/assets/hero.jpg`.  Swappable.
* Overlay: semi-transparent gradient → `rgba(15,23,42,.65)`.
* Centered headline:  
  ```
  <h1>Hi, I’m Chris.<br>I love everything to do with sound.</h1>
  <p>Welcome to my site.</p>
  ```
* Optional circular profile photo positioned bottom-left (desktop only).

Motion: fade-in text on load (CSS `@keyframes fadeUp .6s ease-out`).

### 6.3 About (`#about`)

Two-column on desktop, single-column on mobile.  
Left: profile photo (if not in Hero).  
Right: Markdown-converted paragraphs from document.

### 6.4 Experience (`#experience`)

Vertical timeline:

```
<ul class="timeline">
  <li>
    <span class="dot"></span>
    <div class="content">
      <h3>Machine Learning Engineer • Whitebalance</h3>
      <time>Aug 2023 – Present</time>
      <p>Developing deep learning algorithms…</p>
    </div>
  </li>
  …
</ul>
```

### 6.5 Projects (`#projects`)

Grid of responsive cards (`grid-template-columns: repeat(auto-fit,minmax(280px,1fr))`).

Card anatomy:

```
<article class="project-card" data-repo="crlandsc/tiny-audio-diffusion">
  <h4><a href="…">Tiny Audio Diffusion</a></h4>
  <p>Built a lightweight system that applies waveform diffusion…</p>
  <ul class="meta">
    <li class="stars">★ --</li>  ← populated by GitHub API
    <li class="forks">⑂ --</li>
  </ul>
</article>
```

`main.js` fetches `https://api.github.com/repos/{repo}` (rate-limit aware) and inserts stars & forks.

### 6.6 Education & Research (`#education`)

Two stacked cards (`.edu-card`) listing degree, school, dates, GPA.  
Below: “Academic Publications” inline links.

### 6.7 Skills (`#skills`)

3 columns of pill tags grouped under Programming, Music & Audio, Technical.

Style: `.skill-tag { background:var(--clr-primary-100); border-radius:9999px; padding:.25em .75em; }`.

### 6.8 Interests Carousel (`#interests`)

* Horizontally scrollable `<div class="carousel" role="list">` with CSS `scroll-snap-type:x mandatory;`.
* Each item 250 × 250 px image or short muted looping video.
* Prev / next buttons appear on hover (desktop) or always (mobile).
* No lightbox; static display is sufficient.

### 6.9 Contact (`#contact`)

Because no backend is available, provide two alternatives:

```
<form id="contact-form">
  <label>Name <input type="text" name="name" required></label>
  <label>Email <input type="email" name="email" required></label>
  <label>Subject <input type="text" name="subject"></label>
  <label>Message <textarea name="message" rows="5" required></textarea></label>
  <button type="submit">Send</button>
</form>
```

On `submit`, JS opens `mailto:clandschoot@example.com?subject=…&body=…` (URL-encoded).  
Inline validation via `required` attributes.  
If later needed, replace the `action` with Formspree.

### 6.10 Back-to-Top Button

```
<button class="to-top" aria-label="Back to top">↑</button>
```

Hidden until user scrolls >400 px (`opacity:0; pointer-events:none;`).  
Smooth scroll: `window.scrollTo({top:0,behavior:'smooth'})`.

### 6.11 Footer

Flex container centered.

```
<footer>
  <ul class="social">
    <li><a href="…linkedin…">LinkedIn</a></li>
    …
  </ul>
  <small>© 2025 Christopher Landschoot</small>
</footer>
```

---

## 7. Animations & Motion

* Use `prefers-reduced-motion` media query to disable all nonessential motion.
* Default animations:  
  * Fade-up on section entering viewport (Intersection Observer).  
  * Navbar background gains opacity after first scroll.

---

## 8. Accessibility Checklist

1. Headings in logical order (`h1` once, then `h2` per section).  
2. Color contrast ratio ≥ 4.5.  
3. `alt` text on all images; `aria-label` on icon buttons.  
4. Focus outlines not removed.  
5. All interactions keyboard-operable.

---

## 9. Performance & SEO

* Bundle ≤ 100 KB gzipped.  
* Defer non-critical JS; inline critical CSS ≤ 5 KB.  
* Lazy-load carousel media (`loading="lazy"`).  
* Meta tags: `description`, `og:title`, `og:image`, `twitter:card`.  
* Generate XML sitemap `sitemap.xml`.

---

## 10. Repository & File Structure

```
/ (repo root)
├─ index.html
├─ assets/
│   ├─ hero.jpg / hero.mp4
│   ├─ profile.jpg
│   ├─ interests/
│   └─ icons/
├─ css/
│   └─ style.css
├─ js/
│   └─ main.js
├─ content.json            ← editable content
├─ .github/workflows/
│   └─ build-and-deploy.yml
└─ README.md
```

`content.json` mirrors the Markdown headings so updates require **no** HTML edits.

---

## 11. GitHub Action (pseudo-yaml)

```yaml
name: Build & Deploy
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build         # if you use Vite; else skip
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist      # or ./ (root) if no build
```

---

## 12. Maintenance Workflow

1. Edit `content.json` or any image in `/assets`.  
2. Commit & push to `main`.  
3. GitHub Action rebuilds and publishes to `gh-pages`.  
4. DNS `CNAME` points `chrislandschoot.com` → `crlandsc.github.io`.

---

## 13. Open Items / Future Enhancements

* Dark-mode toggle (add CSS class + localStorage).  
* Swap simple mailto for Formspree when backend needed.  
* Replace hero image with WebM video once compressed.  
* Add Spotify embeds (`iframe`) under Projects → Music when desired.

---

### End of Spec