import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PW || 'playwright');
import fs from 'fs'; import http from 'http'; import path from 'path';
const [out, spec] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const dir = path.dirname(new URL(import.meta.url).pathname);
const srv = http.createServer((q, r) => { let u = decodeURIComponent(q.url.split('?')[0]); const p = u.startsWith('/addons/') ? path.join(process.env.THREE_JSM || path.join(dir, 'node_modules/three/examples/jsm'), u.slice(8)) : path.join(dir, u); const ty = p.endsWith('.js') ? 'text/javascript' : 'text/html'; fs.readFile(p.endsWith('/') ? p + 'index.html' : p, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'Content-Type': ty }); r.end(d); } }); }).listen(8765);
let frames = []; for (const part of spec.split(',')) { const [a, b] = part.split('-').map(Number); if (b == null) frames.push(a); else for (let i = a; i <= b; i++) frames.push(i); }
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('pageerror', (e) => { console.error('PAGEERROR', e.message); process.exit(2); });
page.on('console', (m) => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
await page.goto('http://localhost:8765/index.html'); await page.waitForFunction(() => window.ready === true, null, { timeout: 60000 });
const t0 = Date.now();
for (const f of frames) { const d = await page.evaluate((f) => window.renderFrame(f), f); fs.writeFileSync(path.join(out, `f${String(f).padStart(4, '0')}.jpg`), Buffer.from(d.split(',')[1], 'base64')); }
console.log(`${frames.length} frames, ${((Date.now() - t0) / frames.length).toFixed(0)} ms/frame`);
await browser.close(); srv.close();
