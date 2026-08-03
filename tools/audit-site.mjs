import { access, readFile, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    const bundledPath = path.join(os.homedir(), '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies', 'node', 'node_modules', 'playwright', 'index.mjs');
    return import(pathToFileURL(bundledPath).href);
  }
}

async function findBrowser() {
  const candidates = [
    process.env.BROWSER_PATH,
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
  ].filter(Boolean);
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {}
  }
  return undefined;
}

const { chromium } = await loadPlaywright();
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const paths = [...sitemap.matchAll(/<loc>https:\/\/seo-moldova\.github\.io([^<]*)<\/loc>/g)].map(match => match[1] || '/');
const base = process.env.AUDIT_BASE || 'http://127.0.0.1:8765';
const output = process.env.AUDIT_OUTPUT || path.join(root, '.audit');

await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: await findBrowser()
});
const findings = [];
const profiles = [
  { name: 'desktop', viewport: { width: 1440, height: 1000 } },
  { name: 'mobile', viewport: { width: 390, height: 844 } }
];

for (const profile of profiles) {
  const context = await browser.newContext({ viewport: profile.viewport, deviceScaleFactor: 1 });
  for (const urlPath of paths) {
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(`pageerror: ${error.message}`));
    page.on('response', response => {
      if (response.url().startsWith(base) && response.status() >= 400) {
        pageErrors.push(`HTTP ${response.status()}: ${response.url()}`);
      }
    });

    const response = await page.goto(`${base}${urlPath}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(100);
    const checks = await page.evaluate(() => {
      const jsonErrors = [];
      document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
        try { JSON.parse(script.textContent); } catch (error) { jsonErrors.push(error.message); }
      });
      const brokenImages = [...document.images]
        .filter(image => image.getAttribute('src') && image.complete && image.naturalWidth === 0)
        .map(image => image.getAttribute('src'));
      const h1s = [...document.querySelectorAll('h1')].filter(element => element.getClientRects().length > 0);
      return {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content || '',
        canonical: document.querySelector('link[rel="canonical"]')?.href || '',
        lang: document.documentElement.lang,
        h1Count: h1s.length,
        h1Text: h1s[0]?.textContent.trim() || '',
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        brokenImages,
        jsonErrors,
        mainVisible: Boolean(document.querySelector('main')?.getClientRects().length)
      };
    });

    if (!response || response.status() >= 400) pageErrors.push(`document status: ${response?.status() || 'none'}`);
    if (!checks.title) pageErrors.push('missing title');
    if (!checks.description) pageErrors.push('missing meta description');
    if (!checks.canonical) pageErrors.push('missing canonical');
    if (!checks.lang) pageErrors.push('missing html lang');
    if (checks.h1Count !== 1) pageErrors.push(`visible h1 count: ${checks.h1Count}`);
    if (!checks.mainVisible) pageErrors.push('main is not visible');
    if (checks.overflow > 2) pageErrors.push(`horizontal overflow: ${checks.overflow}px`);
    if (checks.brokenImages.length) pageErrors.push(`broken images: ${checks.brokenImages.join(', ')}`);
    if (checks.jsonErrors.length) pageErrors.push(`invalid JSON-LD: ${checks.jsonErrors.join(', ')}`);
    if (pageErrors.length) findings.push({ profile: profile.name, path: urlPath, errors: [...new Set(pageErrors)] });
    await page.close();
  }
  await context.close();
}

const interactionChecks = [
  async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    const toggle = page.locator('.menu-toggle');
    await toggle.click();
    const opened = await toggle.getAttribute('aria-expanded') === 'true' && await page.locator('header nav').isVisible();
    await page.keyboard.press('Escape');
    const closed = await toggle.getAttribute('aria-expanded') === 'false';
    await page.close();
    if (!opened || !closed) findings.push({ profile: 'interaction', path: '/', errors: ['mobile navigation state failed'] });
  },
  async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(`${base}/projects.html`, { waitUntil: 'domcontentloaded' });
    const metricCount = await page.locator('.project-card-metrics').count();
    await page.locator('[data-filter="recruiting"]').click();
    await page.waitForTimeout(300);
    const visibleCount = await page.locator('.project-card:visible').count();
    const pressed = await page.locator('[data-filter="recruiting"]').getAttribute('aria-pressed');
    const otherPressed = await page.locator('.filter-btn:not([data-filter="recruiting"])[aria-pressed="true"]').count();
    await page.close();
    if (metricCount !== 12 || visibleCount !== 3 || pressed !== 'true' || otherPressed !== 0) {
      findings.push({ profile: 'interaction', path: '/projects.html', errors: [`metrics: ${metricCount}, filtered cards: ${visibleCount}, pressed: ${pressed}, other pressed: ${otherPressed}`] });
    }
  },
  async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${base}/services/ru/seo-promotion.html`, { waitUntil: 'domcontentloaded' });
    await page.locator('.faq-list summary').first().click();
    const expanded = await page.locator('.faq-list details').first().getAttribute('open') !== null;
    await page.close();
    if (!expanded) findings.push({ profile: 'interaction', path: '/services/ru/seo-promotion.html', errors: ['FAQ did not expand'] });
  },
  async () => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(`${base}/en/index.html`, { waitUntil: 'domcontentloaded' });
    const navVisible = await page.locator('header nav').isVisible();
    const navLinks = await page.locator('header nav a').count();
    await context.close();
    if (!navVisible || navLinks < 6) findings.push({ profile: 'interaction', path: '/en/index.html', errors: ['navigation is not available without JavaScript'] });
  },
  async () => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(`${base}/en/index.html`, { waitUntil: 'domcontentloaded' });
    const beforeConsent = await page.locator('script[data-google-analytics]').count();
    const bannerVisible = await page.locator('.consent-banner').isVisible();
    await page.locator('[data-consent="accepted"]').click();
    const afterConsent = await page.locator('script[data-google-analytics]').count();
    const storedChoice = await page.evaluate(() => localStorage.getItem('analytics-consent'));
    await context.close();
    if (beforeConsent !== 0 || !bannerVisible || afterConsent !== 1 || storedChoice !== 'accepted') {
      findings.push({ profile: 'interaction', path: '/en/index.html', errors: [`analytics consent state failed: before ${beforeConsent}, after ${afterConsent}, stored ${storedChoice}`] });
    }
  },
  async () => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(() => localStorage.setItem('analytics-consent', 'declined'));
    const page = await context.newPage();
    await page.goto(`${base}/en/contacts.html`, { waitUntil: 'domcontentloaded' });
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('Test message');
    const withoutConsent = await page.locator('.feedback-form').evaluate(form => form.checkValidity());
    await page.locator('[name="privacy_consent"]').check();
    const withConsent = await page.locator('.feedback-form').evaluate(form => form.checkValidity());
    await context.close();
    if (withoutConsent || !withConsent) findings.push({ profile: 'interaction', path: '/en/contacts.html', errors: ['contact form consent validation failed'] });
  }
];
for (const check of interactionChecks) await check();

const shots = [
  ['home-desktop', '/', { width: 1440, height: 1000 }],
  ['home-mobile', '/', { width: 390, height: 844 }],
  ['service-desktop', '/services/ru/seo-promotion.html', { width: 1440, height: 1000 }],
  ['projects-desktop', '/projects.html', { width: 1440, height: 1000 }]
];
for (const [name, urlPath, viewport] of shots) {
  const page = await browser.newPage({ viewport });
  await page.goto(`${base}${urlPath}`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    const step = Math.max(300, Math.floor(window.innerHeight * 0.8));
    for (let position = 0; position < document.documentElement.scrollHeight; position += step) {
      window.scrollTo(0, position);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    window.scrollTo(0, 0);
    await new Promise(resolve => setTimeout(resolve, 150));
  });
  await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true });
  await page.close();
}

await browser.close();
const report = { pages: paths.length, runs: paths.length * profiles.length, findings };
await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pages: report.pages, runs: report.runs, findings: findings.length }, null, 2));
if (findings.length) {
  console.log(JSON.stringify(findings.slice(0, 30), null, 2));
  process.exitCode = 1;
}
