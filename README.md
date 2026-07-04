# Grand Central Vascular Surgery — Eleventy site

Your site, restructured so the header, navigation, contact section, and footer
live in **one place** instead of being copied into every page. The visible
website is unchanged.

## How the project is organized

```
├── eleventy.config.js          Build configuration (you rarely touch this)
├── package.json                Declares the Eleventy dependency
├── .github/workflows/deploy.yml   Auto-builds and publishes on every push
└── src/
    ├── _data/
    │   ├── nav.json            ⭐ The navigation menus — edit here only
    │   └── site.json           ⭐ Phone, email, address — edit here only
    ├── _includes/layouts/
    │   ├── base.njk            Header, contact section, footer (shared by all pages)
    │   ├── page.njk            Layout for condition/procedure detail pages
    │   └── category.njk        Layout for the three category landing pages
    ├── css/style.css           Your stylesheet (unchanged, one bug fixed)
    ├── js/main.js              Your JavaScript (unchanged)
    ├── index.html              Homepage content
    └── *.html                  One small file per page — just its unique content
```

## Everyday tasks

**Edit a page's content** — open its file in `src/`, edit the HTML below the
`---` block, commit, push. GitHub publishes it automatically in about a minute.

**Change the phone number, email, or address** — edit `src/_data/site.json`.
One edit updates every page.

**Add a new condition or procedure:**
1. Add one line to the right category in `src/_data/nav.json`
   (this updates the desktop dropdown, mobile menu, and category page list).
2. Create `src/your-new-page.html`:

```html
---
layout: layouts/page.njk
title: "Your Condition Name"
eyebrow: Arterial Disorders
description: "One-sentence summary for search engines."
---
<p>Your content here…</p>
```

**Preview locally before pushing** (optional — requires Node.js 18+):

```
npm install        (first time only)
npm start          then open http://localhost:8080
```

## One-time GitHub setup

1. Put these files in your repo (replacing the old flat HTML files) and push.
2. In the repo: **Settings → Pages → Build and deployment → Source →
   choose "GitHub Actions"** (instead of "Deploy from a branch").
3. Done. Every push to `main` rebuilds and publishes the site.

The built site is generated into `_site/` — you never edit or commit that
folder (it's listed in `.gitignore`).

## Moving to your custom domain later

Just add a file named `CNAME` (no extension) at the repo root containing your
domain, e.g. `grandcentralvascular.com`, and configure the domain in
Settings → Pages as usual. The workflow detects the CNAME file and adjusts
all links automatically — no other changes needed.

## Notes on what changed

- All internal links are now root-relative (`/sclerotherapy.html`), and the
  build inserts your repo name prefix automatically while you're on
  `username.github.io/repo-name`. Page URLs are unchanged.
- Fixed a CSS bug: the mobile menu's collapse icon showed the literal text
  `\2212` instead of a minus sign (`"\\2212"` → `"\2212"` in style.css).
- Category page link lists now use the same Title Case as the menus
  (they were inconsistently sentence-cased before).
- The contact form still needs a submission handler before launch, and the
  TODO comments (logo, photo, official phone/email) are all preserved.
