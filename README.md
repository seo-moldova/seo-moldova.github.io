# Ivan Pridorojnov SEO Portfolio

Static multilingual portfolio and service website published with GitHub Pages.

## Local preview

```powershell
python -m http.server 8765
```

Open `http://127.0.0.1:8765/`.

## Structure

- Root pages: Russian version
- `ro/`: Romanian version
- `en/`: English version
- `projects/{lang}/`: localized case studies
- `services/{lang}/`: localized SEO service landing pages
- `css/style.css`: legacy shared component styles
- `css/portfolio.css`: current portfolio, service and responsive UI layer
- `js/site.js`: navigation, forms, analytics consent, project metrics and events
- `js/seo-schema.js`: page-level JSON-LD enrichment
- `images/og/projects/`: project-specific social preview images

## Service pages

Service pages are generated from localized data:

```powershell
node tools/generate-services.mjs
```

After changing service data, regenerate the pages and update `sitemap.xml` if URLs change.

Privacy pages and localized legal/footer copy are synchronized with:

```powershell
node tools/update-privacy.mjs
```

Project Open Graph images are regenerated from the current project screenshots with:

```powershell
node tools/generate-project-og.mjs
```

## Validation

With the local server running:

```powershell
node tools/audit-site.mjs
```

The audit requires Playwright and a Chromium-based browser. It checks every sitemap URL at desktop and mobile widths, including navigation, filters, forms, consent and FAQ interactions, then writes screenshots plus a report to `.audit/`.
