// extras for "sozinhos num planeta" (horizontal): planet set, rocket, Pudim, lake with teeth, shelter, storm, day cards
CAST.boyg = Object.assign({}, CAST.boy, { skin: '#9be36d' });
POSES.hold = { L: [30, -100], R: [30, -100] };
POSES.throwR = { L: [12, 6], R: [150, 40] };
POSES.tarp = { L: [165, 0], R: [165, 0] };
POSES.dance1 = { L: [150, 30], R: [40, -60] };
POSES.dance2 = { L: [40, -60], R: [150, 30] };
POSES.climb = { L: [170, 0], R: [120, 20] };
POSES.flower = { L: [12, 6], R: [85, -10] };

// ---------- props held in hands
const _drawProps10 = drawProps;
drawProps = function (ctx, c, a, J, ink, f) {
  _drawProps10(ctx, c, a, J, ink, f);
  const P = a.props || {};
  const mid = () => [(J.L.h[0] + J.R.h[0]) / 2, (J.L.h[1] + J.R.h[1]) / 2];
  if (P.cookies) { const [x, y] = mid(); rr(ctx, x - 110, y - 90, 220, 90, 16); paint(ctx, '#e63946', PLUM, ink); ctx.fillStyle = '#ffd23f'; ctx.font = '900 40px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('BOLACHA', x, y - 44); if (P.cookies > 1) { ell(ctx, x + 150, y - 60, 46, 46); paint(ctx, '#d4a373', PLUM, ink); for (let i = 0; i < 4; i++) { ell(ctx, x + 135 + (i % 2) * 28, y - 75 + Math.floor(i / 2) * 26, 6, 6); paint(ctx, '#6f3b1f'); } } }
  if (P.manual) { const [x, y] = mid(); ctx.save(); ctx.translate(x, y - 70); if ((a.flip || 1) < 0) ctx.scale(-1, 1); rr(ctx, -150, -100, 300, 200, 10); paint(ctx, '#2a9d8f', PLUM, ink); ctx.fillStyle = '#fff'; ctx.font = '900 34px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('MANUAL DE', 0, -30); ctx.fillText('SOBREVIVÊNCIA', 0, 20); ctx.restore(); }
  if (P.blueprint) { const [x, y] = mid(); ctx.save(); ctx.translate(x, y - 90); rr(ctx, -190, -130, 380, 260, 8); paint(ctx, '#3a6ea5', PLUM, ink); ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = ink * 0.8; ctx.beginPath(); ctx.moveTo(-120, 70); ctx.lineTo(-120, -20); ctx.lineTo(0, -90); ctx.lineTo(120, -20); ctx.lineTo(120, 70); ctx.closePath(); ctx.stroke(); ctx.strokeRect(-40, 10, 80, 60); ctx.restore(); }
  if (P.fruit) { const [hx, hy] = J.R.h; ell(ctx, hx, hy - 50, 50, 56); paint(ctx, '#c77dff', PLUM, ink); ell(ctx, hx - 15, hy - 70, 12, 10); paint(ctx, '#e0aaff'); ctx.beginPath(); ctx.moveTo(hx, hy - 105); ctx.lineTo(hx + 18, hy - 130); paint(ctx, null, '#52b788', ink * 2); }
  if (P.flower) { const [hx, hy] = J.R.h; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 10, hy - 170); paint(ctx, null, '#2d6a4f', ink * 2.5); for (let i = 0; i < 6; i++) { const ag = i / 6 * Math.PI * 2; ell(ctx, hx + 10 + Math.cos(ag) * 34, hy - 190 + Math.sin(ag) * 34, 26, 26); paint(ctx, '#ff5fa2', PLUM, ink * 0.8); } ell(ctx, hx + 10, hy - 190, 22, 22); paint(ctx, '#ffd23f', PLUM, ink * 0.8); }
  if (P.part) { const [hx, hy] = J.L.h; ctx.save(); ctx.translate(hx, hy - 40); ctx.rotate(0.3); rr(ctx, -60, -40, 120, 80, 12); paint(ctx, '#adb5bd', PLUM, ink); ell(ctx, 0, 0, 22, 22); paint(ctx, '#5ef2ff', PLUM, ink * 0.7); ctx.restore(); }
  if (P.radio) { const [x, y] = mid(); ctx.save(); ctx.translate(x, y - 60); rr(ctx, -140, -80, 280, 160, 22); paint(ctx, '#ff9f43', PLUM, ink); ell(ctx, -60, 0, 48, 48); paint(ctx, '#2b2d42', PLUM, ink); rr(ctx, 20, -40, 90, 40, 6); paint(ctx, '#bde0fe', PLUM, ink * 0.7); ctx.beginPath(); ctx.moveTo(90, -80); ctx.lineTo(130, -190); paint(ctx, null, PLUM, ink * 1.5); ctx.restore(); }
  if (P.wrench) { const [hx, hy] = J.R.h; ctx.save(); ctx.translate(hx, hy - 40); ctx.rotate(-0.6 + Math.sin(f * 0.8) * 0.4); rr(ctx, -12, -120, 24, 130, 8); paint(ctx, '#adb5bd', PLUM, ink); ell(ctx, 0, -130, 30, 30); paint(ctx, '#adb5bd', PLUM, ink); ctx.restore(); }
};

// ---------- planet set
const _drawSet10 = drawSet;
drawSet = function (ctx, st, cam, f) {
  if (st.set !== 'planet') return _drawSet10(ctx, st, cam, f);
  const night = st.night || 0;
  const g = ctx.createLinearGradient(0, -3000, 0, 0);
  g.addColorStop(0, night ? '#0c0628' : '#4b1d8f'); g.addColorStop(0.55, night ? '#24104e' : '#b5179e'); g.addColorStop(1, night ? '#3a1d5e' : '#ff9e7a');
  ctx.fillStyle = g; ctx.fillRect(-6000, -3200, 12000, 3300);
  for (let i = 0; i < 90; i++) { const tw = 0.4 + 0.6 * Math.abs(Math.sin(f * 0.05 + i)); ctx.fillStyle = `rgba(255,250,220,${(night ? 0.9 : 0.35) * tw})`; star(ctx, -5000 + hash(i) * 10000, -3100 + hash(i + 7) * 1900, 9, 4); }
  const px = cam.x * 0.15, py = cam.y * 0.1;
  ell(ctx, -900 + px, -2200 + py, 360, 360); paint(ctx, '#ffb3c6', INK, wink()); ctx.fillStyle = 'rgba(200,100,150,.35)'; ell(ctx, -1000 + px, -2280 + py, 70, 60); ctx.fill(); ell(ctx, -780 + px, -2100 + py, 50, 44); ctx.fill();
  ell(ctx, 900 + px * 1.3, -2500 + py, 170, 170); paint(ctx, '#7ae7c7', INK, wink());
  if (st.storm) { ctx.fillStyle = `rgba(80,140,255,${0.45 * st.storm})`; ctx.fillRect(-6000, -3200, 12000, 3300); }
  // far mountains
  ctx.fillStyle = night ? '#1d1240' : '#7b2cbf';
  ctx.beginPath(); ctx.moveTo(-6000, 0); for (let x = -6000; x <= 6000; x += 400) ctx.lineTo(x + px * 0.5, -500 - Math.abs(Math.sin(x * 0.0021)) * 600 - hash(x) * 200); ctx.lineTo(6000, 0); ctx.closePath(); ctx.fill();
  // the tall mountain with the missing part on top
  ctx.beginPath(); ctx.moveTo(1000, 0); ctx.lineTo(2300, -2500); ctx.lineTo(3600, 0); ctx.closePath(); paint(ctx, night ? '#2b1a5a' : '#5a189a', INK, wink());
  ctx.beginPath(); ctx.moveTo(2050, -2050); ctx.lineTo(2300, -2500); ctx.lineTo(2550, -2050); ctx.quadraticCurveTo(2300, -2000, 2050, -2050); paint(ctx, '#e0c3fc', INK, wink());
  if (st.peakPart) { const k = 0.6 + 0.4 * Math.sin(f * 0.3); ctx.fillStyle = `rgba(94,242,255,${0.4 * k})`; ell(ctx, 2300, -2560, 120, 120); ctx.fill(); rr(ctx, 2250, -2600, 100, 70, 10); paint(ctx, '#adb5bd', INK, wink()); ell(ctx, 2300, -2565, 18, 18); paint(ctx, '#5ef2ff'); }
  // ground
  const gg = ctx.createLinearGradient(0, 0, 0, 1600); gg.addColorStop(0, night ? '#2a1f55' : '#6d4bb0'); gg.addColorStop(1, night ? '#3c2a70' : '#9d7ad6');
  ctx.fillStyle = gg; ctx.fillRect(-6000, 0, 12000, 3000);
  for (let i = 0; i < 26; i++) { const x = -4500 + hash(i + 30) * 9000, y = 80 + hash(i + 31) * 1200, r = 60 + hash(i + 32) * 160; ell(ctx, x, y, r, r * 0.3); paint(ctx, night ? 'rgba(20,10,50,.35)' : 'rgba(60,20,120,.35)', null); }
  // alien plants
  for (let i = 0; i < 14; i++) {
    const x = -4200 + i * 640 + hash(i) * 200, h = 300 + hash(i + 3) * 400, sw = Math.sin(f * 0.04 + i) * 20 + (st.storm || 0) * 120 * Math.sin(f * 0.3 + i);
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.quadraticCurveTo(x + sw * 0.5, -h * 0.5, x + sw, -h); paint(ctx, null, '#2ec4b6', wink(3));
    ell(ctx, x + sw, -h - 40, 46, 56); paint(ctx, ['#f72585', '#4cc9f0', '#ffd23f'][i % 3], INK, wink());
    if (night) { ctx.fillStyle = 'rgba(255,255,255,.35)'; ell(ctx, x + sw, -h - 40, 70, 80); ctx.fill(); }
  }
  // glowing lake (with teeth)
  if (st.lake) {
    const lx = -1100, ly = 380, t = st.teeth || 0;
    ell(ctx, lx, ly, 520, 140); paint(ctx, '#5ef2ff', INK, wink(1.2));
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ell(ctx, lx - 120, ly - 30, 160, 26); ctx.fill();
    if (t > 0) {
      const open = t * 90;
      ell(ctx, lx, ly, 380, 40 + open); paint(ctx, '#1b0f2e', INK, wink());
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 9; i++) { const x = lx - 320 + i * 80; ctx.beginPath(); ctx.moveTo(x - 30, ly - 30 - open * 0.9); ctx.lineTo(x + 30, ly - 30 - open * 0.9); ctx.lineTo(x, ly + 20 - open * 0.5); ctx.closePath(); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = wink(0.7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 30, ly + 30 + open * 0.9); ctx.lineTo(x + 30, ly + 30 + open * 0.9); ctx.lineTo(x, ly - 20 + open * 0.5); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    }
  }
  // rocks
  for (const [x, y, r] of [[-500, 200, 110], [1300, 260, 140], [-2200, 300, 160], [300, 520, 90]]) { ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x - r * 0.6, y - r * 0.9); ctx.lineTo(x + r * 0.4, y - r); ctx.lineTo(x + r, y); ctx.closePath(); paint(ctx, '#4a3a7a', INK, wink()); }
};

// ---------- actors: rocket, shelter, Pudim, tarp
const _drawProp10 = drawProp;
drawProp = function (ctx, a, f) {
  if (a.type === 'rocket') {
    ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.tilt || 0); const k = a.s || 1; ctx.scale(k, k);
    if (a.flame) { const fl = a.flame * (1 + 0.2 * Math.sin(f * 1.3)); ctx.beginPath(); ctx.moveTo(-90, 0); ctx.quadraticCurveTo(0, 420 * fl, 90, 0); ctx.closePath(); paint(ctx, '#ffbe0b', INK, wink() / k); ctx.beginPath(); ctx.moveTo(-50, 0); ctx.quadraticCurveTo(0, 250 * fl, 50, 0); ctx.closePath(); paint(ctx, '#ffffff'); }
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 110, -260); ctx.lineTo(sx * 230, 0); ctx.lineTo(sx * 110, -40); ctx.closePath(); paint(ctx, '#e63946', INK, wink() / k); }
    ctx.beginPath(); ctx.moveTo(-130, 0); ctx.lineTo(-130, -700); ctx.quadraticCurveTo(0, -1080, 130, -700); ctx.lineTo(130, 0); ctx.closePath(); paint(ctx, '#f1f3f5', INK, wink() / k);
    rr(ctx, -130, -160, 260, 50, 0); paint(ctx, '#e63946', INK, wink(0.7) / k);
    ell(ctx, 0, -560, 70, 70); paint(ctx, '#3a86ff', INK, wink() / k); ell(ctx, -20, -580, 20, 16); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fill();
    if (a.dent) { ctx.strokeStyle = INK; ctx.lineWidth = wink(1.2) / k; ctx.beginPath(); ctx.moveTo(-80, -330); ctx.lineTo(-20, -290); ctx.lineTo(-60, -240); ctx.lineTo(10, -200); ctx.stroke(); }
    if (a.panelsOff) { rr(ctx, 20, -420, 100, 160, 0); paint(ctx, '#3a3550', INK, wink(0.8) / k); }
    if (a.label) { ctx.fillStyle = '#e63946'; ctx.font = '900 54px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.save(); ctx.translate(0, -360); ctx.rotate(-Math.PI / 2); ctx.fillText(a.label, 0, 18); ctx.restore(); }
    ctx.restore();
    if (a.smoke) for (let i = 0; i < 6; i++) { const t = ((f * 0.02 + i / 6) % 1); ell(ctx, a.x + 60 + Math.sin(i + f * 0.05) * 40, a.y - 500 - t * 700, 60 + t * 90, 50 + t * 70); paint(ctx, `rgba(200,190,230,${0.6 * (1 - t)})`); }
    return;
  }
  if (a.type === 'shelter') {
    const p = a.p == null ? 1 : a.p, roof = a.roof == null ? 1 : a.roof;
    ctx.save(); ctx.translate(a.x, a.y);
    const panels = [[-420, -420, 260, 420, '#dee2e6'], [-150, -420, 260, 420, '#ced4da'], [120, -420, 260, 420, '#e9ecef']];
    panels.forEach(([x, y, w, h, c], i) => { const k = clamp(p * 3 - i); if (k <= 0) return; ctx.save(); ctx.translate(0, (1 - backOut(k)) * -600); rr(ctx, x, y, w, h, 10); paint(ctx, c, INK, wink()); ctx.fillStyle = '#e63946'; ctx.fillRect(x, y + 40, w, 26); ctx.restore(); });
    if (p >= 1) { rr(ctx, -80, -260, 160, 260, [80, 80, 0, 0]); paint(ctx, '#2b2140', INK, wink()); }
    if (roof > 0) { ctx.save(); ctx.translate(roof < 1 ? (1 - roof) * 1400 : 0, roof < 1 ? -(1 - roof) * 900 : 0); ctx.rotate(roof < 1 ? (1 - roof) * 2 : 0); ctx.beginPath(); ctx.moveTo(-520, -420); ctx.quadraticCurveTo(0, -760, 520, -420); ctx.closePath(); paint(ctx, '#f4a261', INK, wink()); ctx.restore(); }
    if (a.lamp) { ctx.fillStyle = 'rgba(255,220,120,.35)'; ell(ctx, 0, -200, 360, 260); ctx.fill(); }
    ctx.restore(); return;
  }
  if (a.type === 'pudim') {
    const k = a.s || 1; ctx.save(); ctx.translate(a.x, a.y - (a.hop || 0)); ctx.scale(k * (1 + (a.sq || 0) * 0.3), k * (1 - (a.sq || 0)));
    ctx.fillStyle = 'rgba(30,10,40,.2)'; ell(ctx, 0, (a.hop || 0) / k, 150, 26); ctx.fill();
    for (const sx of [-1, 1]) { ell(ctx, sx * 70, -10, 40, 22); paint(ctx, '#ff8fab', INK, wink() / k); }
    ell(ctx, 0, -150, 170, 150); paint(ctx, '#ffafcc', INK, wink() / k);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ell(ctx, -60, -230, 50, 22, -0.4); ctx.fill();
    const sleep = a.sleep, bl = blinkAt(f, 99);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
      const x = (c - 1) * 62, y = -200 + r * 55;
      if (sleep || bl > 0.6) { ctx.beginPath(); ctx.moveTo(x - 18, y); ctx.quadraticCurveTo(x, y + 12, x + 18, y); paint(ctx, null, INK, wink(1.2) / k); }
      else { ell(ctx, x, y, a.scream ? 20 : 16, a.scream ? 24 : 20); paint(ctx, '#ffffff', INK, wink(0.8) / k); ell(ctx, x + (a.look || 0) * 6, y + 3, 8, 10); paint(ctx, INK); }
    }
    if (a.scream) { ell(ctx, 0, -70, 48, 40); paint(ctx, '#5a1730', INK, wink() / k); }
    else { ctx.beginPath(); ctx.moveTo(-30, -75); ctx.quadraticCurveTo(0, -50, 30, -75); paint(ctx, null, INK, wink(1.1) / k); }
    ctx.restore(); return;
  }
  if (a.type === 'tarp') {
    ctx.save(); ctx.translate(a.x, a.y); const w = Math.sin(f * 0.7);
    ctx.beginPath(); ctx.moveTo(-260, 0); ctx.quadraticCurveTo(-60, -80 + w * 40, 120 + w * 30, -40); ctx.quadraticCurveTo(320 + w * 60, -140 + w * 60, 480 + w * 80, -60 + w * 50); ctx.lineTo(470 + w * 80, 60 + w * 40); ctx.quadraticCurveTo(200, 90 + w * 30, -260, 120); ctx.closePath();
    paint(ctx, '#f4a261', INK, wink()); ctx.restore(); return;
  }
  if (a.type === 'bigclock') { ctx.save(); ctx.translate(a.x, a.y); ell(ctx, 0, 0, 160, 160); paint(ctx, '#fffaf0', INK, wink(1.4)); const m = a.m || 0; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.lineWidth = wink(2.5); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(m / 60 * Math.PI * 2 - Math.PI / 2) * 120, Math.sin(m / 60 * Math.PI * 2 - Math.PI / 2) * 120); ctx.stroke(); ctx.lineWidth = wink(3.5); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(m / 720 * Math.PI * 2 - Math.PI / 2) * 70, Math.sin(m / 720 * Math.PI * 2 - Math.PI / 2) * 70); ctx.stroke(); ctx.restore(); return; }
  _drawProp10(ctx, a, f);
};

// ---------- storm particles + stone
const _drawFx10 = drawFx;
drawFx = function (ctx, fx, f) {
  _drawFx10(ctx, (fx || []).filter((e) => !['storm', 'stone', 'rain'].includes(e.type)), f);
  for (const e of fx || []) {
    if (e.type === 'storm') for (let i = 0; i < 140; i++) { const sp = 30 + hash(i) * 40; const x = e.x0 + ((f * sp + hash(i + 2) * 6000) % 6000) - 3000, y = e.y0 + hash(i + 5) * 2400; ctx.strokeStyle = `rgba(120,170,255,${0.4 + 0.4 * hash(i + 9)})`; ctx.lineWidth = wink(1.4); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 160, y + 20); ctx.stroke(); }
    if (e.type === 'rain') for (let i = 0; i < 120; i++) { const x = e.x0 + hash(i) * e.w, y = e.y0 + ((f * (40 + hash(i + 1) * 20) + hash(i + 3) * 2400) % 2400); ctx.strokeStyle = 'rgba(190,230,255,.7)'; ctx.lineWidth = wink(1); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 60); ctx.stroke(); }
    if (e.type === 'stone') { ell(ctx, e.x, e.y, 30, 26); paint(ctx, '#6c757d', INK, wink(0.8)); }
  }
};

// ---------- screen-space overlays: day cards
function drawScreen(g, items, f) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  for (const it of items) {
    if (it.type === 'day') {
      const k = it.k; if (k <= 0) continue;
      g.save(); g.translate(120 - (1 - backOut(clamp(k))) * 700, 150); g.rotate(-0.05);
      g.font = '900 150px Inter Black, Arial Black, Arial'; const w = g.measureText(it.text).width + 90;
      g.fillStyle = 'rgba(20,10,40,.85)'; g.beginPath(); g.roundRect(-40, -130, w, 180, 30); g.fill();
      g.lineWidth = 10; g.strokeStyle = '#ffd23f'; g.stroke();
      g.fillStyle = '#ffd23f'; g.textBaseline = 'alphabetic'; g.fillText(it.text, 5, 10);
      g.restore();
    }
    if (it.type === 'tag') {
      const k = it.k; if (k <= 0) continue;
      g.save(); g.translate(W / 2, it.y || 170); g.scale(k, k); g.font = '900 90px Inter Black, Arial Black, Arial'; const w = g.measureText(it.text).width + 80;
      g.fillStyle = 'rgba(20,10,40,.85)'; g.beginPath(); g.roundRect(-w / 2, -75, w, 130, 26); g.fill(); g.lineWidth = 8; g.strokeStyle = '#ff5fa2'; g.stroke();
      g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.fillText(it.text, 0, 25); g.restore();
    }
  }
}
