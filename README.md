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

Service pages are generated from localized data in `tools/generate-services.mjs` and `tools/service-expansion.mjs`:

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

## Approved work and reporting

- `ACTION_PLAN.md`: selected scope and task completion. Only selected IDs may be implemented.
- `WORK_LOG.md`: per-task results, evidence and unresolved blockers.
- `research/seo/`: Moldova Keyword Planner data and keyword-to-URL map.
- `research/ai/`: questions, baseline protocol and access limitations.
- `reports/`: case review, static checks and responsive QA scope.

Run `python tools/verify-static.py` for local links, anchors, canonical/hreflang, JSON-LD and release checks. Use `python tools/record-progress.py TASK_ID done|blocked|deferred RESULT VERIFICATION` to record a selected task. The existing Playwright audit remains available for environments with a supported browser.

### Проверка качества

Результаты проверки интерфейса, ссылок, SEO и GEO: [QUALITY_REVIEW](reports/QUALITY_REVIEW.md).

После изменений услуг выполните `node tools/generate-services.mjs`, затем `node tools/structured-data.mjs`. Проверки: `python tools/verify-static.py` и `python tools/verify-quality.py`. Структурированные данные формируются в HTML; старый runtime-файл не должен менять их в браузере.
