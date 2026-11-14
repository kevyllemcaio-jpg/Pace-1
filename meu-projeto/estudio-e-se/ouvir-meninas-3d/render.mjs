import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('/opt/node-tools/node_modules/playwright/index.js');
import fs from 'fs'; import http from 'http'; import path from 'path';
const [out, spec] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const dir = path.dirname(new URL(import.meta.url).pathname);
const srv = http.createServer((q, r) => { let u = decodeURIComponent(q.url.split('?')[0]); const p = u.startsWith('/addons/') ? path.join('/home/user/Pace-1/meu-projeto/node_modules/three/examples/jsm', u.slice(8)) : path.join(dir, u); const ty = p.endsWith('.js') ? 'text/javascript' : 'text/html'; fs.readFile(p.endsWith('/') ? p + 'index.html' : p, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'Content-Type': ty }); r.end(d); } }); }).listen(Number(process.env.PORT || 8765));
let frames = []; for (const part of spec.split(',')) { const [a, b] = part.split('-').map(Number); if (b == null) frames.push(a); else for (let i = a; i <= b; i++) frames.push(i); }
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
if (process.env.RESUME) frames = frames.filter((f) => !fs.existsSync(path.join(out, `f${String(f).padStart(4, '0')}.jpg`)));
const N = Math.min(Number(process.env.WORKERS || 1), frames.length); const t0 = Date.now(); let done = 0;
await Promise.all([...Array(N)].map(async (_, w) => {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', (e) => { console.error('PAGEERROR', e.message); process.exit(2); });
  page.on('console', (m) => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto('http://localhost:' + (process.env.PORT || 8765) + '/index.html'); await page.waitForFunction(() => window.ready === true, null, { timeout: 120000 });
  for (let i = w; i < frames.length; i += N) { const f = frames[i]; const d = await page.evaluate((f) => window.renderFrame(f), f); fs.writeFileSync(path.join(out, `f${String(f).padStart(4, '0')}.jpg`), Buffer.from(d.split(',')[1], 'base64')); if (++done % 30 === 0) console.log(`frames ${done}/${frames.length} ${((Date.now() - t0) / done).toFixed(0)}ms/f`); }
}));
console.log(`${frames.length} frames, ${((Date.now() - t0) / Math.max(1, frames.length)).toFixed(0)} ms/frame`);
await browser.close(); srv.close();
