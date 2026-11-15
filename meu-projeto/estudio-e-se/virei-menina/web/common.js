// common helpers (pure functions of the frame)
const W = 1920, H = 1080, FPS = 30;
const INK = '#1c1222', PLUM = '#4a1c42';
let ZOOM = 1, INKPX = 5;

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (t) => { t = clamp(t); return t * t * t * (t * (t * 6 - 15) + 10); };
const easeOut = (t) => 1 - Math.pow(1 - clamp(t), 3);
const easeIn = (t) => Math.pow(clamp(t), 3);
const backOut = (t) => { t = clamp(t); const c = 2.2; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const prog = (f, a, b) => clamp((f - a) / (b - a));
// damped spring 0 -> 1 starting at frame a (overshoot + settle)
const springAt = (f, a, k = 1) => { const t = (f - a) / FPS; if (t <= 0) return 0; return 1 - Math.exp(-7 * t / k) * Math.cos(14 * t / k); };
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const hashStr = (s) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 9973; return h; };
const wob = (t, seed) => Math.sin(t * 1.7 + seed * 3.1) * 0.6 + Math.sin(t * 2.9 + seed * 1.7) * 0.4;
const D2R = Math.PI / 180;

function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function paint(ctx, fill, stroke, lw) {
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
}
function ell(ctx, x, y, rx, ry, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot, 0, Math.PI * 2); }
// world ink width (world units) for the current zoom
const wink = (m = 1) => (INKPX * m) / ZOOM;

// blink 0 (open) .. 1 (closed)
function blinkAt(f, seed) {
  const per = 84 + Math.floor(hash(seed) * 50);
  const ph = (f + Math.floor(hash(seed + 3) * per)) % per;
  if (ph < 2) return ph === 0 ? 0.6 : 1;
  if (ph < 4) return ph === 2 ? 0.8 : 0.3;
  return 0;
}
