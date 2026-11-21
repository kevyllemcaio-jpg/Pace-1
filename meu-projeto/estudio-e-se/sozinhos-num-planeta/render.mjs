// node render.mjs <outdir> "<spec>"   spec: "0-1121" or "5,40,90"
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PW || 'playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const [out, spec] = process.argv.slice(2);
const dir = path.dirname(url.fileURLToPath(import.meta.url));
fs.mkdirSync(out, { recursive: true });
let frames = [];
for (const part of spec.split(',')) { const [a, b] = part.split('-').map(Number); if (b == null) frames.push(a); else for (let i = a; i <= b; i++) frames.push(i); }
if (process.env.RESUME) frames = frames.filter((f) => !fs.existsSync(path.join(out, `f${String(f).padStart(4, '0')}.jpg`)));
const N = Math.min(Number(process.env.WORKERS || 4), frames.length);
const browser = await chromium.launch();
let done = 0; const t0 = Date.now();
await Promise.all([...Array(N)].map(async (_, w) => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', (e) => { console.error('PAGEERROR', e.message); process.exit(2); });
  await page.goto('file://' + path.join(dir, 'web/index.html'));
  await page.waitForFunction(() => window.ready === true);
  for (let i = w; i < frames.length; i += N) {
    const f = frames[i];
    const data = await page.evaluate((f) => window.renderFrame(f), f);
    fs.writeFileSync(path.join(out, `f${String(f).padStart(4, '0')}.jpg`), Buffer.from(data.split(',')[1], 'base64'));
    if (++done % 30 === 0) console.log(`frames ${done}/${frames.length} ${((Date.now() - t0) / done).toFixed(0)}ms/f`);
  }
}));
await browser.close();
console.log(`done ${done}`);
