// "Fugir do monstro debaixo da cama: nível 1 vs nível 100" — 1200 frames @30fps (2D)
const TOTAL = 1200;
const FLASHES = [856];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const tag = (f, f0, f1, text, y = 300) => (f >= f0 && f < f1 ? [{ type: 'tag', text, k: pop(f, f0) * (1 - prog(f, f1 - 6, f1)), y }] : []);
const ME = (x, y, o = {}) => G('boy', x, y, Object.assign({ expr: 'scared' }, o));
const lvl = (f, f0, n) => (f >= f0 ? [{ type: 'lvl', n, k: pop(f, f0, f0 + 10), f0 }] : []);
const big = (f, f0, text, y = 1150, col = '#ffffff', size = 150) => (f >= f0 ? [{ type: 'big', text, k: pop(f, f0), y, col, size }] : []);

// ---- set additions: bed, door, ceiling (drawn behind actors)
const BED = { x0: -620, x1: 260, top: -300 };
const _drawSetN = drawSet;
drawSet = function (ctx, st, cam, f) {
  _drawSetN(ctx, Object.assign({}, st, { set: 'bedroom' }), cam, f);
  ctx.fillStyle = '#9aa3f0'; ctx.fillRect(-3000, -2600, 6000, 700); rr(ctx, -3000, -1930, 6000, 40, 0); paint(ctx, '#fffaf0', INK, wink());
  ell(ctx, -200, -2300, 120, 40); paint(ctx, '#fff3c4', INK, wink());
  const x0 = -1500, o = st.door || 0;
  rr(ctx, x0 - 30, -960, 440, 960, [14, 14, 0, 0]); paint(ctx, '#fffaf0', INK, wink());
  rr(ctx, x0, -930, 380, 930, 0); paint(ctx, o > 0 ? '#ffe9a8' : '#2a2340', INK, wink());
  const wv = 380 * Math.cos(o * 75 * D2R);
  ctx.beginPath(); ctx.moveTo(x0, -930); ctx.lineTo(x0 + wv, -930 - 24 * o); ctx.lineTo(x0 + wv, 24 * o); ctx.lineTo(x0, 0); ctx.closePath(); paint(ctx, '#8d5a3b', INK, wink());
  ell(ctx, x0 + wv * 0.85, -460, 18, 18); paint(ctx, '#ffd23f', INK, wink(0.6));
  if (st.bed !== false) {
    rr(ctx, BED.x0 + 20, -130, BED.x1 - BED.x0 - 40, 130, 0); paint(ctx, '#0b0614');
    for (const x of [BED.x0 + 10, BED.x1 - 50]) { rr(ctx, x, -140, 40, 140, 6); paint(ctx, '#6b4226', INK, wink()); }
    rr(ctx, BED.x0, -240, BED.x1 - BED.x0, 110, 16); paint(ctx, '#8d5a3b', INK, wink());
    rr(ctx, BED.x0 + 10, -330, BED.x1 - BED.x0 - 20, 100, 30); paint(ctx, '#ffffff', INK, wink());
    rr(ctx, BED.x0 + 40, -400, 260, 90, 40); paint(ctx, '#ffe0ef', INK, wink());
    if (st.sock) { ctx.save(); ctx.translate(-80, -40); ctx.rotate(0.3); rr(ctx, -40, -20, 90, 40, 18); paint(ctx, '#ff5fa2', INK, wink(0.7)); ctx.restore(); ell(ctx, 120, -40, 34, 26); paint(ctx, '#7d7590', INK, wink(0.6)); }
  }
};

// ---- the monster (original): dark violet fuzzball, two big yellow eyes, wide grin, long 3-finger arms
function fuzz(ctx, cx, cy, rx, ry, n, amp, seed) { ctx.beginPath(); for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, r = 1 + (i % 2 ? amp : -amp * 0.3) * (0.7 + 0.3 * hash(i + seed)); const x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); }
function monsterEyes(ctx, x, y, s, f, o = {}) {
  const bl = o.blink != null ? o.blink : (Math.floor(f / 50) % 4 === 3 && f % 50 < 4 ? 0.1 : 1);
  for (const sx of [-1, 1]) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x + sx * 70 * s, y, 0, x + sx * 70 * s, y, 120 * s); g.addColorStop(0, 'rgba(255,220,60,.55)'); g.addColorStop(1, 'rgba(255,220,60,0)'); ctx.fillStyle = g; ctx.fillRect(x + sx * 70 * s - 120 * s, y - 120 * s, 240 * s, 240 * s); ctx.restore();
    ell(ctx, x + sx * 70 * s, y, 50 * s, 42 * s * bl, sx * 0.15 * (o.friendly ? -1 : 1)); paint(ctx, '#ffe45c', INK, wink());
    if (bl > 0.5) { ell(ctx, x + sx * 70 * s + (o.lx || 0) * 14 * s, y + 4 * s, 12 * s, 30 * s * bl); paint(ctx, INK); }
  }
}
function monster(ctx, e, f) {
  const s = e.s || 1;
  ctx.save(); ctx.translate(e.x, e.y); if (e.flipY) ctx.scale(1, -1); ctx.rotate(e.rot || 0);
  if (e.eyesOnly) { monsterEyes(ctx, 0, 0, s, f, e); ctx.restore(); return; }
  const br = 1 + Math.sin(f * 0.15) * 0.02;
  for (const sx of [-1, 1]) { const a = e.arms ? e.arms[sx < 0 ? 0 : 1] : [sx * 260, 120]; ctx.lineCap = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = 58 * s; ctx.beginPath(); ctx.moveTo(sx * 150 * s, 40 * s); ctx.quadraticCurveTo(sx * 240 * s, 0, a[0] * s, a[1] * s); ctx.stroke(); ctx.strokeStyle = '#4b2a7a'; ctx.lineWidth = 44 * s; ctx.stroke(); for (let k = -1; k <= 1; k++) { ell(ctx, a[0] * s + k * 22 * s, a[1] * s + 26 * s, 13 * s, 26 * s, k * 0.4); paint(ctx, '#4b2a7a', INK, wink(0.7)); } }
  fuzz(ctx, 0, 0, 230 * s * br, 200 * s / br, 46, 0.09, 3); paint(ctx, '#5b2f8f', INK, wink(1.2));
  fuzz(ctx, -30 * s, -30 * s, 150 * s, 120 * s, 30, 0.06, 8); ctx.fillStyle = 'rgba(160,110,230,.35)'; ctx.fill();
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 110 * s, -170 * s); ctx.lineTo(sx * 160 * s, -280 * s); ctx.lineTo(sx * 170 * s, -150 * s); ctx.closePath(); paint(ctx, '#ffd23f', INK, wink()); }
  monsterEyes(ctx, 0, -50 * s, s, f, e);
  if (e.friendly) { ctx.beginPath(); ctx.moveTo(-90 * s, 50 * s); ctx.quadraticCurveTo(0, 140 * s, 90 * s, 50 * s); paint(ctx, null, INK, wink(1.3)); ell(ctx, -150 * s, 40 * s, 30 * s, 16 * s); ctx.fillStyle = 'rgba(255,95,162,.5)'; ctx.fill(); ell(ctx, 150 * s, 40 * s, 30 * s, 16 * s); ctx.fill(); }
  else { ctx.beginPath(); ctx.moveTo(-140 * s, 40 * s); ctx.quadraticCurveTo(0, 170 * s, 140 * s, 40 * s); ctx.quadraticCurveTo(0, 90 * s, -140 * s, 40 * s); paint(ctx, '#1a0b22', INK, wink()); for (let i = 0; i < 6; i++) { const x = -110 * s + i * 44 * s; ctx.beginPath(); ctx.moveTo(x, 50 * s); ctx.lineTo(x + 22 * s, 50 * s); ctx.lineTo(x + 11 * s, 85 * s); ctx.closePath(); paint(ctx, '#ffffff', INK, wink(0.5)); } }
  if (e.apron) { rr(ctx, -120 * s, 60 * s, 240 * s, 150 * s, 20 * s); paint(ctx, '#ff8fab', INK, wink()); ctx.fillStyle = '#ffffff'; ctx.font = `900 ${40 * s}px Arial Black, Arial`; ctx.textAlign = 'center'; ctx.fillText('♥', 0, 150 * s); }
  ctx.restore();
}
function arm(ctx, x0, y0, x1, y1, f, grab) {
  ctx.lineCap = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = 46; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, Math.max(y0, y1) + 30, x1, y1); ctx.stroke(); ctx.strokeStyle = '#4b2a7a'; ctx.lineWidth = 34; ctx.stroke();
  const a = Math.atan2(y1 - y0, x1 - x0); for (let k = -1; k <= 1; k++) { const fa = a + k * (grab ? 0.25 : 0.55); ell(ctx, x1 + Math.cos(fa) * 40, y1 + Math.sin(fa) * 40, 30, 11, fa); paint(ctx, '#4b2a7a', INK, wink(0.7)); ell(ctx, x1 + Math.cos(fa) * 68, y1 + Math.sin(fa) * 68, 9, 8); paint(ctx, '#ffd23f', INK, wink(0.4)); }
}
function blanket(ctx, top, f) {
  ctx.beginPath(); ctx.moveTo(BED.x0 - 10, -150); ctx.lineTo(BED.x0 - 10, top + 30); for (let x = BED.x0; x <= BED.x1 + 10; x += 60) ctx.quadraticCurveTo(x + 30, top - 14 + Math.sin(x * 0.02 + f * 0.05) * 8, x + 60, top + 6); ctx.lineTo(BED.x1 + 10, -150); ctx.closePath(); paint(ctx, '#4cc9f0', INK, wink());
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 18; i++) star(ctx, BED.x0 + 40 + (i % 9) * 100, top + 60 + Math.floor(i / 9) * 90, 22, 9); ctx.restore();
}
function cookie(ctx, x, y, r, bite) { ell(ctx, x, y, r, r * 0.92); paint(ctx, '#d4a373', INK, wink()); for (let i = 0; i < 5; i++) { ell(ctx, x + Math.cos(i * 2.3) * r * 0.5, y + Math.sin(i * 2.3) * r * 0.5, r * 0.12, r * 0.12); paint(ctx, '#5c3a21'); } }
function beam(ctx, x0, y0, x1, y1, w) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, 'rgba(255,245,190,.75)'); g.addColorStop(1, 'rgba(255,245,190,0)'); ctx.fillStyle = g; const a = Math.atan2(y1 - y0, x1 - x0), n = [-Math.sin(a), Math.cos(a)]; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 + n[0] * w, y1 + n[1] * w); ctx.lineTo(x1 - n[0] * w, y1 - n[1] * w); ctx.closePath(); ctx.fill(); ctx.restore(); }

const _drawFxN = drawFx;
drawFx = function (ctx, fx, f) {
  const mine = ['monster', 'arm', 'blanket', 'cookie', 'beam', 'money', 'broom', 'crumbs', 'shield', 'toc'];
  _drawFxN(ctx, (fx || []).filter((e) => !mine.includes(e.type)), f);
  for (const e of fx || []) {
    if (e.type === 'monster') monster(ctx, e, f);
    if (e.type === 'arm') arm(ctx, e.x0, e.y0, e.x1, e.y1, f, e.grab);
    if (e.type === 'blanket') blanket(ctx, e.top, f);
    if (e.type === 'cookie') cookie(ctx, e.x, e.y, e.r || 60);
    if (e.type === 'beam') beam(ctx, e.x0, e.y0, e.x1, e.y1, e.w || 260);
    if (e.type === 'crumbs') for (let i = 0; i < 10; i++) { const t = ((f * 0.05 + hash(i)) % 1); ell(ctx, e.x + (hash(i + 3) - 0.5) * 200, e.y - 80 + t * 160, 10, 8); paint(ctx, '#d4a373', INK, wink(0.4)); }
    if (e.type === 'money') { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || -0.1); rr(ctx, -150, -80, 300, 160, 14); paint(ctx, '#ffffff', INK, wink()); ctx.fillStyle = '#16a34a'; ctx.font = '900 46px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.fillText('ALUGUEL', 0, -12); ctx.font = '900 40px Arial Black, Arial'; ctx.fillText('R$ 50', 0, 46); ctx.restore(); }
    if (e.type === 'broom') { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); rr(ctx, -12, -420, 24, 420, 10); paint(ctx, '#c08552', INK, wink()); ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(70, 0); ctx.lineTo(50, 120); ctx.lineTo(-50, 120); ctx.closePath(); paint(ctx, '#ffd23f', INK, wink()); ctx.restore(); }
    if (e.type === 'shield') { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(120,220,255,${0.8 * e.k})`; ctx.lineWidth = 16; ell(ctx, e.x, e.y, 520, 200); ctx.stroke(); ctx.restore(); }
    if (e.type === 'toc') { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.k, e.k); ctx.rotate(-0.12); ctx.font = '900 110px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(e.text, 0, 0); ctx.fillStyle = e.col || '#ffd23f'; ctx.fillText(e.text, 0, 0); ctx.restore(); }
  }
};

// ---- screen overlays: level card, big text, final card
const _drawScreenN = drawScreen;
drawScreen = function (g, items, f) {
  _drawScreenN(g, items.filter((i) => i.type !== 'lvl' && i.type !== 'big' && i.type !== 'final'), f);
  const T = (txt, y, kk, size, col) => { if (kk <= 0.01) return; g.save(); g.translate(W / 2, y); g.scale(kk, kk); g.rotate(-0.04); g.font = `900 ${size}px Inter, Arial Black`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = size * 0.2; g.strokeStyle = '#1c1222'; g.strokeText(txt, 0, 0); g.fillStyle = col; g.fillText(txt, 0, 0); g.restore(); };
  for (const it of items) {
    if (it.type === 'lvl' && it.k > 0.01) {
      const k = it.k, n = it.n, col = n >= 100 ? '#ffd23f' : n >= 90 ? '#ff2d55' : n >= 50 ? '#c77dff' : n >= 30 ? '#4cc9f0' : n >= 10 ? '#8ce95a' : '#ffffff';
      g.save(); g.translate(W / 2, 250); g.scale(k, k); g.rotate(-0.04);
      g.fillStyle = 'rgba(20,10,40,.88)'; g.beginPath(); g.roundRect(-400, -120, 800, 240, 40); g.fill(); g.lineWidth = 12; g.strokeStyle = col; g.stroke();
      g.font = '900 120px Inter, Arial Black'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText('NÍVEL ' + n, 0, -22);
      g.fillStyle = 'rgba(255,255,255,.2)'; g.beginPath(); g.roundRect(-330, 62, 660, 30, 15); g.fill(); g.fillStyle = col; g.beginPath(); g.roundRect(-330, 62, 660 * Math.max(0.04, n / 100) * clamp((f - it.f0) / 14), 30, 15); g.fill();
      g.restore();
    }
    if (it.type === 'big') T(it.text, it.y, it.k, it.size, it.col);
    if (it.type === 'final') {
      const k = pop(f, it.f0); g.save(); g.fillStyle = 'rgba(20,8,30,.5)'; g.fillRect(0, 0, W, 960 * Math.min(1, k)); g.restore();
      T('QUAL É O SEU', 200, pop(f, it.f0), 100, '#ffffff'); T('NÍVEL? 🛏️👹', 340, pop(f, it.f0 + 8), 120, '#ffd23f');
      [1, 10, 30, 50, 99, 100].forEach((n, i) => { const kk = pop(f, it.f0 + 20 + i * 4); if (kk <= 0.01) return; const x = W / 2 + ((i % 3) - 1) * 320, y = 520 + Math.floor(i / 3) * 170; g.save(); g.translate(x, y); g.scale(kk, kk); g.fillStyle = ['#ffffff', '#8ce95a', '#4cc9f0', '#c77dff', '#ff2d55', '#ffd23f'][i]; g.strokeStyle = '#1c1222'; g.lineWidth = 10; g.beginPath(); g.roundRect(-140, -62, 280, 124, 36); g.fill(); g.stroke(); g.fillStyle = '#1c1222'; g.font = '900 72px Inter, Arial Black'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), 0, 4); g.restore(); });
      if (f > it.f0 + 50) T('COMENTA 👇', 880, pop(f, it.f0 + 50), 74, '#ffd23f');
    }
  }
};

const NIGHT = (o = []) => [{ x: 760, y: -1150, r: 900, i: 0.55, col: 'rgba(120,140,255,.25)' }].concat(o);
const KIDBED = (o = {}) => ME(-180, -250, Object.assign({ s: 0.46, sit: true, pose: { L: [30, -90], R: [30, -90] } }, o));

const SHOTS = [
  { f0: 0, f1: 55, light: () => 'dark', cam: [{ f: 0, x: -180, y: -520, z: 1.9 }, { f: 55, x: -180, y: -480, z: 1.7 }], kicks: [{ f: 0, a: 8 }],
    build(f) { return { world: { door: 0 }, actors: [KIDBED({ expr: 'scared', look: [0, 0.6], sweat: 1 })], fx: [{ type: 'blanket', top: -330 }, { type: 'monster', eyesOnly: true, x: -60, y: -60, s: 0.7, lx: -0.5 }], lights: NIGHT([{ x: -180, y: -620, r: 700, i: 0.6, col: 'rgba(150,170,255,.25)' }]), screen: tag(f, 4, 55, 'NÍVEL 1 vs NÍVEL 100', 240) }; } },
  { f0: 56, f1: 118, light: () => 'dark', cam: [{ f: 56, x: -250, y: -650, z: 0.62 }, { f: 118, x: -230, y: -600, z: 0.72 }],
    build(f) { return { world: {}, actors: [KIDBED({ expr: 'scared', look: [0, 0.6] })], fx: [{ type: 'blanket', top: -330 }, { type: 'monster', eyesOnly: true, x: -60, y: -60, s: 0.7, lx: Math.sin(f * 0.1) }], lights: NIGHT([{ x: -60, y: -60, r: 300, i: 0.4, col: 'rgba(255,220,60,.25)' }]), screen: tag(f, 60, 118, 'DEBAIXO DA CAMA 👹', 240) }; } },
  { f0: 119, f1: 165, light: () => 'dark', cam: [{ f: 119, x: -180, y: -420, z: 0.95 }, { f: 165, x: -180, y: -430, z: 1.05 }],
    build(f) { return { world: {}, actors: [KIDBED({ expr: 'worried', look: [0.4, 0.5] })], fx: [{ type: 'blanket', top: -330 }, { type: 'toc', text: 'TOC... TOC...', x: -100, y: 40, k: pop(f, 132), col: '#c77dff' }], lights: NIGHT([{ x: -180, y: -500, r: 600, i: 0.5 }]), screen: lvl(f, 119, 1) }; } },
  { f0: 166, f1: 218, light: () => 'dark', cam: [{ f: 166, x: -180, y: -600, z: 1.7 }, { f: 218, x: -180, y: -610, z: 2.0 }],
    build(f) { return { world: {}, actors: [KIDBED({ expr: 'shocked', look: [0, 0.8], sweat: 1 })], fx: [{ type: 'blanket', top: -330 }], lights: NIGHT([{ x: -180, y: -620, r: 600, i: 0.6 }]), screen: big(f, 172, '?!', 520, '#ffd23f', 200) }; } },
  { f0: 219, f1: 243, light: () => 'dark', cam: [{ f: 219, x: -180, y: -620, z: 2.1 }, { f: 243, x: -180, y: -620, z: 2.4 }], kicks: [{ f: 219, a: 14 }, { f: 228, a: 10 }],
    build(f) { return { world: {}, actors: [KIDBED({ expr: 'scream', look: [0, 0], pose: 'up' })], fx: [{ type: 'blanket', top: -330 }], lights: NIGHT([{ x: -180, y: -620, r: 700, i: 0.7 }]), screen: big(f, 219, 'MÃÃÃE!', 420, '#ff5fa2', 190) }; } },
  { f0: 244, f1: 290, light: () => 'dark', cam: [{ f: 244, x: -1100, y: -520, z: 0.85 }, { f: 290, x: -1050, y: -520, z: 0.95 }],
    build(f) { return { world: { door: 1 }, actors: [ME(-1300, 80, { expr: 'stern', look: [1, 0.3], pose: { L: [40, -60], R: [40, -60] } })], lights: NIGHT([{ x: -1310, y: -460, r: 900, i: 0.85, col: 'rgba(255,220,140,.35)' }]), screen: lvl(f, 244, 10) }; } },
  { f0: 291, f1: 361, light: () => 'dark', cam: [{ f: 291, x: -800, y: -480, z: 0.62 }, { f: 361, x: -600, y: -460, z: 0.66 }],
    build(f) { const t = prog(f, 296, 344), e = sstep(t); const x = lerp(-1300, -180, e), y = lerp(80, -250, e), hop = Math.sin(t * Math.PI) * 520; const reach = prog(f, 318, 332) * (1 - prog(f, 340, 352));
      return { world: { door: 1 }, actors: [ME(x, y, { s: lerp(ks(80), 0.46, e), hop, rot: t > 0 && t < 1 ? -0.25 : 0, expr: t > 0.1 && t < 0.95 ? 'scream' : 'proud', pose: t > 0 && t < 1 ? 'hero' : 'hips', sit: t >= 1 })], fx: (t >= 1 ? [{ type: 'blanket', top: -230 }] : []).concat(reach > 0 ? [{ type: 'arm', x0: -500, y0: -60, x1: lerp(-500, -900, reach), y1: lerp(-60, -40, reach), grab: true }] : []),
        lights: NIGHT([{ x: -1310, y: -460, r: 900, i: 0.85, col: 'rgba(255,220,140,.35)' }, { x, y: y - 300 - hop, r: 500, i: 0.5 }]), screen: tag(f, 300, 344, 'SLOW MOTION 🎬', 240).concat(f >= 344 ? big(f, 344, 'PÉ SALVO ✅', 1150, '#8ce95a', 120) : []) }; } },
  { f0: 362, f1: 420, light: () => 'dark', cam: [{ f: 362, x: -180, y: -480, z: 1.35 }, { f: 420, x: -180, y: -490, z: 1.5 }],
    build(f) { return { world: {}, actors: [KIDBED({ expr: 'worried', look: [Math.sin(f * 0.15), 0.2] })], fx: [{ type: 'blanket', top: -560 }], lights: NIGHT([{ x: -180, y: -560, r: 650, i: 0.6 }]), screen: lvl(f, 362, 30) }; } },
  { f0: 421, f1: 505, light: () => 'dark', cam: [{ f: 421, x: -200, y: -420, z: 0.85 }, { f: 505, x: -200, y: -430, z: 0.95 }], kicks: [{ f: 452, a: 10 }, { f: 476, a: 10 }],
    build(f) { const p = (s) => Math.max(0, Math.sin(prog(f, s, s + 22) * Math.PI)); const a = Math.max(p(436), p(460)); const hit = (f >= 450 && f < 458) || (f >= 474 && f < 482);
      return { world: {}, actors: [KIDBED({ expr: hit ? 'proud' : 'worried', look: [0, 0.4] })], fx: [{ type: 'blanket', top: -480 }, { type: 'arm', x0: 100, y0: -60, x1: lerp(260, 0, a), y1: lerp(-60, -420, a), grab: false }].concat(hit ? [{ type: 'shield', x: -180, y: -330, k: 1 }] : []), lights: NIGHT([{ x: -180, y: -500, r: 800, i: 0.6 }]), screen: tag(f, 440, 505, 'COBERTOR = ESCUDO 🛡️', 240) }; } },
  { f0: 506, f1: 570, light: () => 'dark', cam: [{ f: 506, x: -260, y: -360, z: 1.0 }, { f: 570, x: -260, y: -340, z: 1.1 }],
    build(f) { const d = prog(f, 520, 545); return { world: {}, actors: [KIDBED({ expr: 'mischief', look: [0.5, 1], pose: { L: [30, -90], R: [70 + d * 30, 10] }, tilt: 0.2 })], fx: [{ type: 'blanket', top: -300 }, { type: 'cookie', x: lerp(-60, 60, d), y: lerp(-300, -20, d), r: 50 }], lights: NIGHT([{ x: -150, y: -350, r: 700, i: 0.6 }]), screen: lvl(f, 506, 50) }; } },
  { f0: 571, f1: 620, light: () => 'dark', cam: [{ f: 571, x: 40, y: -150, z: 1.6 }, { f: 620, x: 40, y: -150, z: 1.8 }], kicks: [{ f: 596, a: 8 }, { f: 606, a: 8 }],
    build(f) { const g = prog(f, 574, 588), back = prog(f, 590, 600); const ax = lerp(-80, 60, g) - back * 140, ay = lerp(-70, -40, g); return { world: {}, actors: [], fx: (back < 1 ? [{ type: 'cookie', x: back > 0 ? ax + 60 : 60, y: -20, r: 50 }] : []).concat([{ type: 'arm', x0: -200, y0: -60, x1: ax, y1: ay, grab: g >= 1 }, { type: 'monster', eyesOnly: true, x: -260, y: -70, s: 0.5, blink: 1 }]).concat(f >= 596 ? [{ type: 'toc', text: 'NHAC!', x: 40, y: -280, k: pop(f, 596), col: '#ffd23f' }, { type: 'crumbs', x: -200, y: -60 }] : []), lights: NIGHT([{ x: 40, y: -80, r: 500, i: 0.6 }]) }; } },
  { f0: 621, f1: 668, light: () => 'dark', cam: [{ f: 621, x: -180, y: -560, z: 1.6 }, { f: 668, x: -180, y: -570, z: 1.75 }],
    build(f) { return { world: {}, actors: [KIDBED({ expr: 'proud', look: [0, 0] })], fx: [{ type: 'blanket', top: -330 }], lights: NIGHT([{ x: -180, y: -600, r: 650, i: 0.65 }]), screen: tag(f, 624, 668, 'PLANO PERFEITO 🍪', 240) }; } },
  { f0: 669, f1: 720, light: () => 'dark', cam: [{ f: 669, x: -560, y: -300, z: 0.9 }, { f: 720, x: -580, y: -290, z: 1.0 }],
    build(f) { return { world: {}, actors: [ME(-1000, 140, { expr: 'stern', look: [1, 0.4], props: { flashlight: 1 }, pose: { L: [40, -60], R: [80, -20] } })], fx: [{ type: 'beam', x0: -880, y0: -260, x1: -100, y1: -60, w: 200 }], lights: NIGHT([{ x: -400, y: -100, r: 600, i: 0.85, col: 'rgba(255,240,180,.4)' }]), screen: lvl(f, 669, 99) }; } },
  { f0: 721, f1: 805, light: () => 'dark', cam: [{ f: 721, x: -150, y: -80, z: 1.5 }, { f: 805, x: -150, y: -80, z: 1.7 }],
    build(f) { return { world: { sock: true }, actors: [], fx: [{ type: 'beam', x0: -1000, y0: -200, x1: 300, y1: -60, w: 160 }], lights: NIGHT([{ x: -150, y: -60, r: 700, i: 0.9, col: 'rgba(255,240,180,.4)' }]), screen: tag(f, 740, 805, '...NADA?', 240) }; } },
  { f0: 806, f1: 850, light: () => 'dark', cam: [{ f: 806, x: -800, y: -700, z: 1.5 }, { f: 850, x: -800, y: -1200, z: 1.0, e: 'l' }],
    build(f) { const k = prog(f, 812, 850); return { world: {}, actors: [ME(-800, 140, { expr: 'scared', look: [0, -1], tilt: -0.25 * k, props: { flashlight: 1 }, pose: { L: [40, -60], R: [100 + k * 60, -10] } })], fx: [{ type: 'beam', x0: -760, y0: -500, x1: -600 + k * 100, y1: lerp(-600, -2200, k), w: 220 }], lights: NIGHT([{ x: -700, y: lerp(-700, -1900, k), r: 600, i: 0.7, col: 'rgba(255,240,180,.35)' }]) }; } },
  { f0: 851, f1: 900, light: () => 'dark', cam: [{ f: 851, x: -600, y: -1950, z: 0.9 }, { f: 900, x: -600, y: -1950, z: 1.15 }], kicks: [{ f: 856, a: 18 }, { f: 864, a: 12 }, { f: 872, a: 8 }],
    build(f) { return { world: {}, actors: [], fx: [{ type: 'monster', x: -600, y: -2150, s: 1.1, flipY: true, arms: [[-330, 260], [330, 260]] }, { type: 'beam', x0: -700, y0: -1300, x1: -600, y1: -2150, w: 320 }], lights: NIGHT([{ x: -600, y: -2050, r: 900, i: 0.85, col: 'rgba(255,240,180,.3)' }]), screen: f >= 860 ? big(f, 860, 'AAAAH!', 1250, '#ff2d55', 190) : [] }; } },
  { f0: 901, f1: 950, light: () => 'day', cam: [{ f: 901, x: 60, y: -540, z: 0.8 }, { f: 950, x: 60, y: -550, z: 0.88 }],
    build(f) { return { world: { sun: 1 }, actors: [KIDBED({ expr: 'proud', look: [1, 0], pose: { L: [30, -90], R: [80, -10] } })], fx: [{ type: 'blanket', top: -260 }, { type: 'monster', x: 380, y: -520, s: 0.7, friendly: true, arms: [[-330, 40], [260, 160]] }, { type: 'money', x: lerp(260, 120, prog(f, 905, 925)), y: -520, rot: -0.15 }], screen: lvl(f, 901, 100) }; } },
  { f0: 951, f1: 1020, light: () => 'day', cam: [{ f: 951, x: 80, y: -540, z: 0.68 }, { f: 1020, x: 100, y: -540, z: 0.74 }],
    build(f) { const sw = Math.sin(f * 0.3); return { world: { sun: 1 }, actors: [KIDBED({ expr: 'bliss', look: [0, 0], pose: { L: [150, -40], R: [150, -40] } })], fx: [{ type: 'blanket', top: -260 }, { type: 'monster', x: 560 + sw * 30, y: -460, s: 0.7, friendly: true, apron: true, arms: [[-280, 230], [-200, 260]] }, { type: 'broom', x: 380 + sw * 60, y: -200, rot: 0.3 + sw * 0.2 }], screen: tag(f, 958, 1020, 'QUARTO ARRUMADO ✨', 240) }; } },
  { f0: 1021, f1: TOTAL - 1, light: () => 'day', cam: [{ f: 1021, x: 80, y: -560, z: 0.62 }, { f: TOTAL - 1, x: 80, y: -560, z: 0.68 }],
    build(f) { return { world: { sun: 1 }, actors: [KIDBED({ expr: 'laugh', look: [1, 0], pose: 'wave' })], fx: [{ type: 'blanket', top: -260 }, { type: 'monster', x: 420, y: -420, s: 0.66, friendly: true, apron: true, arms: [[-300, 120], [300, -260 + Math.sin(f * 0.3) * 40]] }], screen: [{ type: 'final', f0: 1025 }] }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
