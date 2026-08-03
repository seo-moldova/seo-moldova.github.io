import { access, mkdir, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'images', 'og', 'projects');

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    const bundled = path.join(os.homedir(), '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies', 'node', 'node_modules', 'playwright', 'index.mjs');
    return import(pathToFileURL(bundled).href);
  }
}

async function findBrowser() {
  const candidates = [
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
  ];
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {}
  }
  return undefined;
}

const projects = [
  ['vinrecords', 'VinRecords.ca', '73.2K impressions', '+54% keywords'],
  ['tvn', 'TVN', '+60% clicks', '+30% impressions'],
  ['bursa-muncii', 'Bursa Muncii', '+250% traffic', '+300% impressions'],
  ['cetarom', 'CETAROM', '10x visibility', '6x baseline traffic'],
  ['strand', 'Strand', '+230% traffic', '+400% visibility'],
  ['andiva', 'Andiva', '+150% average traffic', '+300% peak traffic'],
  ['loremaesthetic', 'Lorem Aesthetic', '+300% impressions', '+250% clicks'],
  ['taxonest', 'TaxOnest', '+1,200% impressions', '+900% clicks'],
  ['lista', 'Lista.md', '+350% traffic', '1,500+ keywords'],
  ['mobilestyles', 'MobileStyles', '+230% traffic', '6,900+ keywords'],
  ['uls', 'USA Link System', '+650% traffic', 'TOP 10 query'],
  ['exportportal', 'ExportPortal', '+400% traffic', '3,100+ keywords']
];

await mkdir(output, { recursive: true });
const { chromium } = await loadPlaywright();
const browser = await chromium.launch({ headless: true, executablePath: await findBrowser() });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

for (const [slug, name, metricOne, metricTwo] of projects) {
  const image = await readFile(path.join(root, 'images', 'projects', `${slug}-main.webp`));
  const source = `data:image/webp;base64,${image.toString('base64')}`;
  await page.setContent(`<!doctype html>
    <html><head><style>
      *{box-sizing:border-box}html,body{width:1200px;height:630px;margin:0;font-family:Arial,Helvetica,sans-serif;background:#141821;color:#fff}
      body{display:grid;grid-template-columns:58% 42%;overflow:hidden}
      main{display:flex;min-width:0;padding:68px 64px 58px;flex-direction:column;justify-content:space-between}
      .label{display:flex;align-items:center;gap:12px;color:#66d1aa;font-size:17px;font-weight:800;text-transform:uppercase}
      .label:before{width:10px;height:10px;border-radius:50%;background:#66d1aa;content:''}
      h1{max-width:620px;margin:20px 0 34px;font-size:66px;line-height:1.02;letter-spacing:0}
      .metrics{display:flex;gap:10px;flex-wrap:wrap}
      .metric{padding:13px 16px;border:1px solid #48505e;border-radius:6px;background:#1c222d;color:#e7ebf0;font-size:18px;font-weight:700}
      footer{display:flex;align-items:center;justify-content:space-between;color:#aeb7c3;font-size:16px}
      footer strong{color:#fff}
      .rule{width:72px;height:5px;background:#3157e5}
      figure{position:relative;margin:0;overflow:hidden;border-left:1px solid #353b47;background:#fff}
      figure img{width:100%;height:100%;object-fit:cover;object-position:top center}
      figure:after{position:absolute;inset:0;border:16px solid rgba(255,255,255,.12);content:'';pointer-events:none}
    </style></head><body>
      <main>
        <div><div class="label">SEO case study</div><h1>${name}</h1><div class="metrics"><span class="metric">${metricOne}</span><span class="metric">${metricTwo}</span></div></div>
        <footer><span><strong>Ivan Pridorojnov</strong> · SEO portfolio</span><span class="rule"></span></footer>
      </main>
      <figure><img src="${source}" alt=""></figure>
    </body></html>`, { waitUntil: 'load' });
  await page.locator('img').evaluate(image => image.decode());
  await page.screenshot({ path: path.join(output, `${slug}.png`) });
}

await browser.close();
console.log(`Generated ${projects.length} project Open Graph images in ${output}`);
