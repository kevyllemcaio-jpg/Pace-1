// "O MAIS FRACO DA CIDADE" — cidade com neve, escadaria, cachoeira congelada, ponte, campo, janelas, criatura de gelo
Object.assign(CAST, {
  bruno: { skin: '#c98e66', hair: 'curly', hc: '#1b1212', pj: '#2a9d8f', pj2: '#8ee0d4', pat: 'none', pants: '#3a4a7a', slip: '#ffffff' },
  lucas: { skin: '#f1c9a5', hair: 'cap', hc: '#ff8a1f', pj: '#3a6bd9', pj2: '#9fbaf5', pat: 'none', pants: '#2b2d42', slip: '#e63946' },
  mestre: { skin: '#e0b08a', hair: 'bunTop', hc: '#eeeeee', pj: '#8a5a33', pj2: '#b98a5f', pat: 'none', pants: '#4a3526', slip: '#3a2a20', adult: true, mustache: true },
  v1: { skin: '#f1c9a5', hair: 'bob', hc: '#7a4a2a', pj: '#e63946', pj2: '#ff8fa3', pat: 'none', pants: '#2d3b55', slip: '#ffffff' },
  v2: { skin: '#8b5a3c', hair: 'puffs', hc: '#1e1414', band: '#ffd23f', pj: '#3a86ff', pj2: '#a0c4ff', pat: 'none', pants: '#3a2a55', slip: '#ffd23f' },
  v3: { skin: '#e8b48a', hair: 'pony', hc: '#f0c34a', band: '#8338ec', pj: '#8338ec', pj2: '#c8b6ff', pat: 'none', pants: '#5c4b3a', slip: '#ffffff' },
  v4: { skin: '#c98e66', hair: 'cap', hc: '#2a9d8f', pj: '#ffd23f', pj2: '#fff3b0', pat: 'none', pants: '#2d3b55', slip: '#3a2a20' },
  v5: { skin: '#f6e3d3', hair: 'braids', hc: '#d9542b', band: '#3a86ff', pj: '#ff5fa2', pj2: '#ffc8dd', pat: 'none', pants: '#2d3b55', slip: '#ffffff' },
  v6: { skin: '#6e432b', hair: 'curly', hc: '#1b1212', pj: '#22b573', pj2: '#95d5b2', pat: 'none', pants: '#2d3b55', slip: '#ffffff' },
  v7: { skin: '#f1c9a5', hair: 'buns', hc: '#5a3420', band: '#ff5fa2', pj: '#f4a261', pj2: '#ffd6a5', pat: 'none', pants: '#2d3b55', slip: '#e63946' },
  vit: { skin: '#e8b48a', hair: 'curly', hc: '#3a2314', pj: '#5a9bd5', pj2: '#bde0fe', pat: 'none', pants: '#2b2d42', slip: '#ffffff' },
});
// ---- número no peito + cachecol (desenhado por cima do boneco)
const _drawKidN = drawKid;
drawKid = function (ctx, a, f) {
  const r = _drawKidN(ctx, a, f);
  if (a.num == null && !a.scarf) return r;
  const c = CAST[a.who], s = a.s || 0.5, up = c.adult ? 240 : 0;
  ctx.save(); ctx.translate(a.x, a.y - (a.hop || 0)); if (a.rot) ctx.rotate(a.rot); ctx.scale(s * (a.flip || 1), s);
  const t = f / FPS, seed = hashStr(a.who), walking = a.walk != null;
  const bob = (a.bob || 0) + (walking ? -Math.abs(Math.sin(a.walk)) * 30 : 0) + Math.sin(t * 2.1 + seed) * 4;
  const cy = -430 - up + bob;
  if (a.scarf) { rr(ctx, -150, cy - 175, 300, 70, 34); paint(ctx, a.scarf, PLUM, wink() / s); rr(ctx, 40, cy - 130, 70, 170, 20); paint(ctx, a.scarf, PLUM, wink() / s); }
  if (a.num != null) {
    const glow = a.num === 100 ? '#ff4d6d' : a.num <= 29 ? '#7bf1a8' : '#ffd23f';
    ctx.save(); if ((a.flip || 1) < 0) ctx.scale(-1, 1);
    const pulse = 1 + (a.numPop || 0) * 0.35;
    ctx.translate(0, cy + 30); ctx.scale(pulse, pulse);
    ell(ctx, 0, 0, 82, 82); ctx.fillStyle = '#1c1430'; ctx.fill(); ctx.lineWidth = 14; ctx.strokeStyle = glow; ctx.stroke();
    ctx.font = `900 ${String(a.num).length > 2 ? 64 : 84}px Arial Black, Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 10; ctx.strokeStyle = glow; ctx.strokeText(String(a.num), 0, 6); ctx.fillStyle = '#ffffff'; ctx.fillText(String(a.num), 0, 6);
    ctx.restore();
  }
  ctx.restore(); return r;
};
// ---- cenários
function snowCap(ctx, x, y, w, h) { ctx.beginPath(); ctx.moveTo(x - 30, y + 10); ctx.quadraticCurveTo(x + w / 2, y - h, x + w + 30, y + 10); for (let i = 6; i >= 0; i--) ctx.quadraticCurveTo(x + (i + 0.5) * w / 7, y + 46 + (i % 2) * 20, x + i * w / 7, y + 18); ctx.closePath(); paint(ctx, '#f4f8ff', INK, wink(0.8)); }
function pine(ctx, x, y, k = 1, night) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); rr(ctx, -28, -120, 56, 130, 6); paint(ctx, '#6b4226', INK, wink(0.7));
  for (let i = 0; i < 3; i++) { const w = 300 - i * 80, yy = -120 - i * 170; ctx.beginPath(); ctx.moveTo(-w, yy); ctx.lineTo(0, yy - 330); ctx.lineTo(w, yy); ctx.closePath(); paint(ctx, night ? '#1e4a3a' : '#2f7a55', INK, wink(0.7)); ctx.beginPath(); ctx.moveTo(-w * 0.45, yy - 180); ctx.lineTo(0, yy - 330); ctx.lineTo(w * 0.45, yy - 180); ctx.quadraticCurveTo(0, yy - 150, -w * 0.45, yy - 180); paint(ctx, '#f4f8ff'); }
  ctx.restore();
}
function sky(ctx, mode) {
  const g = ctx.createLinearGradient(0, -3200, 0, 0);
  if (mode === 'noite') { g.addColorStop(0, '#0b1240'); g.addColorStop(1, '#2b3d8f'); }
  else if (mode === 'aurora') { g.addColorStop(0, '#7a5cc7'); g.addColorStop(0.55, '#ff9eb5'); g.addColorStop(1, '#ffd6a5'); }
  else if (mode === 'tarde') { g.addColorStop(0, '#5a4fcf'); g.addColorStop(1, '#ff9f68'); }
  else { g.addColorStop(0, '#3ea8ff'); g.addColorStop(1, '#bfe7ff'); }
  ctx.fillStyle = g; ctx.fillRect(-6000, -3600, 14000, 3700);
  if (mode === 'noite') { for (let i = 0; i < 90; i++) { ell(ctx, -5000 + hash(i) * 12000, -3400 + hash(i + 7) * 2200, 6, 6); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fill(); } ell(ctx, 1500, -2700, 170, 170); paint(ctx, '#fff6d6', INK, wink()); }
}
function mountain(ctx, f, mode, glow) {
  ctx.beginPath(); ctx.moveTo(-3600, 0); ctx.lineTo(-600, -2500); ctx.lineTo(0, -2900); ctx.lineTo(700, -2400); ctx.lineTo(3800, 0); ctx.closePath(); paint(ctx, mode === 'noite' ? '#4a5a9a' : '#c9d8f0', INK, wink());
  ctx.beginPath(); ctx.moveTo(-600, -2500); ctx.lineTo(0, -2900); ctx.lineTo(700, -2400); ctx.lineTo(380, -2300); ctx.lineTo(160, -2420); ctx.lineTo(-150, -2280); ctx.lineTo(-380, -2380); ctx.closePath(); paint(ctx, '#ffffff', INK, wink(0.8));
  // fenda
  const k = glow == null ? 0.6 + 0.4 * Math.abs(Math.sin(f * 0.08)) : glow;
  ctx.save(); ctx.shadowColor = `rgba(255,120,40,${k})`; ctx.shadowBlur = 60 * k;
  ctx.beginPath(); ctx.moveTo(60, -2150); ctx.lineTo(160, -1850); ctx.lineTo(40, -1600); ctx.lineTo(190, -1250); ctx.lineTo(90, -900); ctx.lineTo(10, -1250); ctx.lineTo(-70, -1600); ctx.lineTo(60, -1850); ctx.lineTo(-20, -2150); ctx.closePath();
  paint(ctx, `rgb(255,${Math.round(110 + 80 * k)},40)`, INK, wink()); ctx.restore();
}
function house(ctx, x, w, h, col, night) {
  rr(ctx, x, -h, w, h, 0); paint(ctx, col, INK, wink());
  snowCap(ctx, x - 20, -h, w + 40, 120);
  for (const wx of [x + 70, x + w - 250]) { rr(ctx, wx, -h + 160, 180, 190, 10); paint(ctx, night ? '#ffd27a' : '#cfe9ff', INK, wink()); rr(ctx, wx + 82, -h + 160, 16, 190, 0); paint(ctx, '#fff', null); snowCap(ctx, wx - 10, -h + 160, 200, 10); }
  rr(ctx, x + w / 2 - 110, -330, 220, 330, [18, 18, 0, 0]); paint(ctx, '#7a3b2e', INK, wink());
}
function arch(ctx) {
  for (const x of [-560, 460]) { rr(ctx, x, -1350, 100, 1350, 10); paint(ctx, '#d62828', INK, wink()); }
  rr(ctx, -760, -1500, 1520, 110, 30); paint(ctx, '#1c1c22', INK, wink()); rr(ctx, -700, -1400, 1400, 90, 10); paint(ctx, '#d62828', INK, wink());
  rr(ctx, -620, -1130, 1240, 70, 10); paint(ctx, '#d62828', INK, wink()); snowCap(ctx, -770, -1500, 1540, 40);
  for (const x of [-330, 330]) { ell(ctx, x, -980, 60, 80); paint(ctx, '#ffe7a8', INK, wink()); }
}
function lamp(ctx, x, night) { rr(ctx, x - 14, -1150, 28, 1150, 6); paint(ctx, '#2b2b33', INK, wink()); ell(ctx, x, -1180, 60, 60); paint(ctx, night ? '#fff1b8' : '#f5f0e0', INK, wink()); snowCap(ctx, x - 60, -1236, 120, 10); }
function ground(ctx) { const g = ctx.createLinearGradient(0, 0, 0, 1400); g.addColorStop(0, '#e9f1ff'); g.addColorStop(1, '#ffffff'); ctx.fillStyle = g; ctx.fillRect(-6000, 0, 14000, 2000); ctx.strokeStyle = 'rgba(150,170,210,.35)'; ctx.lineWidth = 10; for (let i = -20; i < 40; i++) { ctx.beginPath(); ctx.moveTo(i * 300, 60 + (i % 3) * 140); ctx.lineTo(i * 300 + 120, 60 + (i % 3) * 140); ctx.stroke(); } }
const _drawSetN = drawSet;
drawSet = function (ctx, st, cam, f) {
  const m = st.mode || 'dia', night = m === 'noite';
  if (st.set === 'vila') {
    sky(ctx, m); mountain(ctx, f, m, st.glow);
    for (let i = 0; i < 16; i++) pine(ctx, -4200 + i * 560 + (i % 2) * 140, -60, 0.9, night);
    const cols = ['#ffb4a2', '#a8dadc', '#ffd166', '#cdb4db', '#b5e48c', '#ffc8dd', '#90e0ef', '#f4a261'];
    for (let i = 0; i < 8; i++) house(ctx, -4600 + i * 1150 + (i >= 4 ? 1500 : 0), 900, 1150 + (i % 3) * 120, cols[i], night);
    ground(ctx);
    for (const x of [-1700, 1700, -3200, 3200]) lamp(ctx, x, night);
    if (st.arch !== false) arch(ctx);
    if (st.poster) { rr(ctx, -1220, -1300, 36, 1300, 6); paint(ctx, '#6b4226', INK, wink()); rr(ctx, -1430, -1250, 460, 600, 10); paint(ctx, '#fbf6e8', INK, wink());
      ctx.fillStyle = '#1c1222'; ctx.font = '900 58px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.fillText('TREINE COM', -1200, -1140); ctx.fillStyle = '#d62828'; ctx.font = '900 74px Arial Black, Arial'; ctx.fillText('O MESTRE', -1200, -1040); ctx.fillStyle = '#1c1222'; ctx.font = '900 56px Arial Black, Arial'; ctx.fillText('30 DIAS', -1200, -940); ctx.font = '900 40px Arial Black, Arial'; ctx.fillText('PRAÇA · AMANHECER', -1200, -860); }
    if (st.bench) { rr(ctx, 900, 120, 560, 50, 10); paint(ctx, '#8a5a33', INK, wink()); for (const x of [930, 1390]) { rr(ctx, x, 160, 30, 120, 4); paint(ctx, '#3a2a20', INK, wink()); } }
    if (st.crack) { ctx.save(); ctx.translate(st.crack[0], st.crack[1]); ctx.strokeStyle = '#9be7ff'; ctx.lineWidth = 16; ctx.shadowColor = '#9be7ff'; ctx.shadowBlur = 30; for (let k = 0; k < 8; k++) { let x = 0, y = 0, a = k * 0.8; ctx.beginPath(); ctx.moveTo(0, 0); for (let j = 0; j < 4; j++) { a += (hash(k * 9 + j) - 0.5) * 0.9; x += Math.cos(a) * 90 * (st.ck || 1); y += Math.sin(a) * 30 * (st.ck || 1); ctx.lineTo(x, y); } ctx.stroke(); } ctx.restore(); }
    if (st.gorro) { ell(ctx, 300, 260, 110, 60); paint(ctx, '#5a9bd5', INK, wink()); ell(ctx, 300, 205, 34, 34); paint(ctx, '#ffffff', INK, wink()); }
    return;
  }
  if (st.set === 'escada') {
    sky(ctx, m); for (let i = 0; i < 10; i++) pine(ctx, -3000 + i * 700, -1800 + i * 40, 1.1, night);
    ctx.beginPath(); ctx.moveTo(-6000, 600); ctx.lineTo(-1200, 600); ctx.lineTo(3600, -3900); ctx.lineTo(8000, -3900); ctx.lineTo(8000, 2000); ctx.lineTo(-6000, 2000); ctx.closePath(); paint(ctx, '#eef4ff', INK, wink());
    for (let i = 0; i < 40; i++) { const x = -1200 + i * 120, y = 600 - i * 112.5; rr(ctx, x, y - 112, 130, 112, 6); paint(ctx, i % 2 ? '#bfe9ff' : '#d8f3ff', INK, wink(0.6)); }
    const tx = 3600, ty = -3900; rr(ctx, tx + 200, ty - 700, 1100, 700, 10); paint(ctx, '#8b5a33', INK, wink()); for (let j = 0; j < 6; j++) { rr(ctx, tx + 200, ty - 700 + j * 117, 1100, 10, 0); paint(ctx, '#6b4226'); }
    ctx.beginPath(); ctx.moveTo(tx + 120, ty - 680); ctx.lineTo(tx + 750, ty - 1150); ctx.lineTo(tx + 1380, ty - 680); ctx.closePath(); paint(ctx, '#f4f8ff', INK, wink());
    rr(ctx, tx + 640, ty - 360, 220, 360, [16, 16, 0, 0]); paint(ctx, '#5a3420', INK, wink());
    for (let i = 0; i < 8; i++) pine(ctx, -900 + i * 520 + 300, 640 - i * 480 + 300, 0.8, night);
    return;
  }
  if (st.set === 'cachoeira') {
    sky(ctx, m); rr(ctx, -2600, -2600, 5200, 2700, 60); paint(ctx, '#9fb8d6', INK, wink());
    const g = ctx.createLinearGradient(-500, 0, 500, 0); g.addColorStop(0, '#9ad9f7'); g.addColorStop(0.5, '#e8fbff'); g.addColorStop(1, '#9ad9f7');
    rr(ctx, -520, -2600, 1040, 2600, 0); ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 12; for (let i = 0; i < 14; i++) { const x = -480 + i * 70, o = (f * 22 + i * 137) % 600; ctx.beginPath(); ctx.moveTo(x, -2600 + o); ctx.lineTo(x, -2300 + o); ctx.moveTo(x, -1700 + o); ctx.lineTo(x, -1450 + o); ctx.moveTo(x, -900 + o); ctx.lineTo(x, -650 + o); ctx.stroke(); }
    for (let i = 0; i < 18; i++) { const x = -2400 + i * 280; if (Math.abs(x) < 560) continue; ctx.beginPath(); ctx.moveTo(x - 60, -1500); ctx.lineTo(x, -1500 + 300 + hash(i) * 400); ctx.lineTo(x + 60, -1500); ctx.closePath(); paint(ctx, '#d8f6ff', INK, wink(0.6)); }
    ground(ctx); ell(ctx, 0, 150, 1100, 200); paint(ctx, '#a8ddf5', INK, wink());
    for (let i = 0; i < 6; i++) { const t = (f * 0.03 + i / 6) % 1; ell(ctx, -400 + i * 160, 60 - t * 200, 40 + t * 60, 30 + t * 40); ctx.fillStyle = `rgba(255,255,255,${0.7 * (1 - t)})`; ctx.fill(); }
    return;
  }
  if (st.set === 'ponte') {
    sky(ctx, m); for (let i = 0; i < 12; i++) pine(ctx, -3600 + i * 650, -500, 0.9, night);
    rr(ctx, -6000, -300, 4900, 3000, 0); paint(ctx, '#eef4ff', INK, wink()); rr(ctx, 1100, -300, 4900, 3000, 0); paint(ctx, '#eef4ff', INK, wink());
    const g = ctx.createLinearGradient(0, -300, 0, 2500); g.addColorStop(0, '#6c8ccf'); g.addColorStop(1, '#1d2b5c'); ctx.fillStyle = g; ctx.fillRect(-1100, -300, 2200, 2800);
    for (let i = 0; i < 24; i++) { const x = -1100 + i * 95, y = -300 + 180 * Math.sin(Math.PI * (i + 0.5) / 24) - (st.wob || 0) * Math.sin(f * 0.6) * 20 * Math.sin(Math.PI * i / 24); rr(ctx, x, y, 86, 34, 6); paint(ctx, '#a0703a', INK, wink(0.7)); }
    ctx.strokeStyle = '#e0b060'; ctx.lineWidth = 12; for (const dy of [-260]) { ctx.beginPath(); ctx.moveTo(-1100, -300 + dy); ctx.quadraticCurveTo(0, -300 + dy + 340, 1100, -300 + dy); ctx.stroke(); }
    for (const x of [-1150, 1150]) { rr(ctx, x - 26, -620, 52, 340, 8); paint(ctx, '#6b4226', INK, wink()); }
    return;
  }
  if (st.set === 'campo') {
    sky(ctx, m); mountain(ctx, f, m, 0.3); for (let i = 0; i < 14; i++) pine(ctx, -3800 + i * 600, -80, 1, night);
    rr(ctx, 900, -900, 1200, 900, 10); paint(ctx, '#8b5a33', INK, wink()); ctx.beginPath(); ctx.moveTo(820, -880); ctx.lineTo(1500, -1350); ctx.lineTo(2180, -880); ctx.closePath(); paint(ctx, '#f4f8ff', INK, wink());
    ground(ctx); return;
  }
  if (st.set === 'janelas') {
    ctx.fillStyle = '#3a2a55'; ctx.fillRect(-4000, -3000, 8000, 5000);
    for (let k = 0; k < 3; k++) { const cx = -1100 + k * 1100; rr(ctx, cx - 420, -1500, 840, 1100, 0); paint(ctx, ['#ffcad4', '#bde0fe', '#caffbf'][k], null); const g = ctx.createRadialGradient(cx, -1200, 50, cx, -1000, 700); g.addColorStop(0, 'rgba(255,220,140,.9)'); g.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = g; ctx.fillRect(cx - 420, -1500, 840, 1100); }
    return;
  }
  if (st.set === 'chest') { ctx.fillStyle = st.bg || '#f28c28'; ctx.fillRect(-4000, -4000, 8000, 8000); return; }
  return _drawSetN(ctx, st, cam, f);
};
// ---- fx: criatura, parede das janelas, agulha presa, poeira de impacto
const _fxN = drawFx;
drawFx = function (ctx, fx, f) {
  _fxN(ctx, (fx || []).filter((e) => !['monstro', 'ator', 'parede', 'pedra', 'impacto', 'brilho'].includes(e.type)), f);
  for (const e of fx || []) {
    if (e.type === 'monstro') drawMonstro(ctx, e, f);
    if (e.type === 'ator') drawKid(ctx, e.a, f);
    if (e.type === 'parede') { ctx.beginPath(); ctx.rect(-4000, -3000, 8000, 5000); for (let k = 0; k < 3; k++) { const cx = -1100 + k * 1100; ctx.rect(cx + 380, -1460, -760, 1020); } ctx.fillStyle = '#e9d8b4'; ctx.fill('evenodd'); ctx.lineWidth = wink(); ctx.strokeStyle = INK; ctx.stroke();
      for (let k = 0; k < 3; k++) { const cx = -1100 + k * 1100; rr(ctx, cx - 14, -1460, 28, 1020, 0); paint(ctx, '#ffffff', INK, wink(0.7)); rr(ctx, cx - 380, -980, 760, 26, 0); paint(ctx, '#ffffff', INK, wink(0.7)); snowCap(ctx, cx - 420, -1470, 840, 10); rr(ctx, cx - 430, -440, 860, 50, 6); paint(ctx, '#ffffff', INK, wink()); } }
    if (e.type === 'pedra') { ell(ctx, e.x, e.y, 150 * (e.s || 1), 120 * (e.s || 1)); paint(ctx, '#8a8a92', INK, wink()); ell(ctx, e.x - 40, e.y - 40, 40, 24); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fill(); }
    if (e.type === 'impacto') { const k = e.k || 0; if (k <= 0 || k >= 1) continue; for (let i = 0; i < 10; i++) { const a = i * 0.63, r = 80 + k * 380; ell(ctx, e.x + Math.cos(a) * r, e.y + Math.sin(a) * r * 0.4, 40 * (1 - k) + 6, 30 * (1 - k) + 6); ctx.fillStyle = `rgba(255,255,255,${0.9 * (1 - k)})`; ctx.fill(); } ctx.save(); ctx.translate(e.x, e.y - 200); ctx.scale(1 + k, 1 + k); ctx.font = '900 150px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.globalAlpha = 1 - k; ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.strokeText(e.text || 'POW!', 0, 0); ctx.fillStyle = '#ffd23f'; ctx.fillText(e.text || 'POW!', 0, 0); ctx.restore(); }
    if (e.type === 'brilho') { const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r || 400); g.addColorStop(0, e.col || 'rgba(155,231,255,.6)'); g.addColorStop(1, 'rgba(155,231,255,0)'); ctx.fillStyle = g; ctx.fillRect(e.x - (e.r || 400), e.y - (e.r || 400), 2 * (e.r || 400), 2 * (e.r || 400)); }
  }
};
// criatura: e = {x,y,s,flip,walk,aL,aR (rad, 0=pra baixo, + pra frente), elL, elR, roar, rot, lean, eyes}
function drawMonstro(ctx, e, f) {
  const s = e.s || 1, t = f / FPS, w = e.walk;
  const body = '#5b6fd6', dark = '#2e3a86', ice = '#bfefff';
  ctx.save(); ctx.translate(e.x, e.y); if (e.rot) ctx.rotate(e.rot); ctx.scale(s * (e.flip || 1), s);
  const bob = w != null ? -Math.abs(Math.sin(w)) * 40 : Math.sin(t * 2.2) * 12;
  ell(ctx, 0, 0, 420, 60); ctx.fillStyle = 'rgba(20,10,40,.25)'; ctx.fill();
  // pernas
  for (const sd of [-1, 1]) { const ph = w != null ? Math.sin(w + (sd > 0 ? Math.PI : 0)) * 0.4 : 0; ctx.save(); ctx.translate(sd * 170, -900 + bob); ctx.rotate(ph); rr(ctx, -95, 0, 190, 560, 70); paint(ctx, body, INK, wink()); ctx.translate(0, 520); ctx.rotate(-ph * 0.6); rr(ctx, -85, 0, 170, 420, 60); paint(ctx, dark, INK, wink()); for (const k of [-1, 0, 1]) { ctx.beginPath(); ctx.moveTo(k * 60 - 22, 400); ctx.lineTo(k * 60 + 30, 470); ctx.lineTo(k * 60 + 22, 400); ctx.closePath(); paint(ctx, ice, INK, wink(0.6)); } ctx.restore(); }
  ctx.save(); ctx.translate(0, -900 + bob); ctx.rotate((e.lean || 0.12) + Math.sin(t * 2.2) * 0.03);
  // braço de trás
  const arm = (sd, a, el) => { ctx.save(); ctx.translate(sd * 330, -820); ctx.rotate(-sd * 0.15 - a); rr(ctx, -80, 0, 160, 600, 70); paint(ctx, body, INK, wink()); ctx.translate(0, 560); ctx.rotate(-(el || 0)); rr(ctx, -70, 0, 140, 520, 60); paint(ctx, dark, INK, wink());
    ctx.save(); ctx.shadowColor = '#9be7ff'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.moveTo(-40, 480); ctx.lineTo(0, 1380); ctx.lineTo(40, 480); ctx.closePath(); paint(ctx, ice, INK, wink(0.7)); ctx.restore(); ctx.restore(); };
  arm(-1, e.aL != null ? e.aL : 0.25 + Math.sin(t * 1.5) * 0.08, e.elL != null ? e.elL : 0.4);
  // corpo
  ell(ctx, 0, -520, 420, 560); paint(ctx, body, INK, wink()); ell(ctx, 0, -380, 250, 320); paint(ctx, dark, INK, wink(0.8));
  for (let i = 0; i < 5; i++) { ctx.save(); ctx.translate(-240 + i * 120, -1020 + Math.abs(i - 2) * 40); ctx.rotate((i - 2) * 0.25); ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(0, -200); ctx.lineTo(34, 0); ctx.closePath(); paint(ctx, ice, INK, wink(0.7)); ctx.restore(); }
  // cabeça
  ctx.save(); ctx.translate(0, -1080); ctx.rotate(e.head || Math.sin(t * 0.9) * 0.06);
  for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd * 150, -260); ctx.rotate(sd * 0.35); ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(0, -230); ctx.lineTo(30, 0); ctx.closePath(); paint(ctx, ice, INK, wink(0.7)); ctx.restore(); }
  rr(ctx, -260, -300, 520, 380, 150); paint(ctx, body, INK, wink());
  const ro = e.roar || 0; rr(ctx, -200, 20 + ro * 30, 400, 120 + ro * 160, 60); paint(ctx, ro > 0.1 ? '#1b1238' : dark, INK, wink());
  if (ro > 0.1) for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-170 + i * 66, 30 + ro * 30); ctx.lineTo(-140 + i * 66, 90 + ro * 30); ctx.lineTo(-110 + i * 66, 30 + ro * 30); ctx.closePath(); paint(ctx, '#ffffff'); }
  ctx.save(); ctx.shadowColor = '#7ff6ff'; ctx.shadowBlur = 50 + 20 * Math.sin(t * 6); for (const sd of [-1, 1]) { ell(ctx, sd * 110, -130, 70, 44, sd * -0.25); paint(ctx, '#e8ffff', INK, wink(0.6)); } ctx.restore();
  ctx.restore();
  arm(1, e.aR != null ? e.aR : 0.25 + Math.sin(t * 1.5 + 1) * 0.08, e.elR != null ? e.elR : 0.4);
  ctx.restore(); ctx.restore();
}
// ---- neve (tela) + flash
const _scrN = drawScreen;
drawScreen = function (g, items, f) {
  _scrN(g, items.filter((i) => i.type !== 'neve' && i.type !== 'big' && i.type !== 'tag'), f);
  for (const it of items) if (it.type === 'tag' && it.k > 0) { g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.translate(W / 2, it.y || 170); g.scale(it.k, it.k); let fs = 90; g.font = `900 ${fs}px Inter Black, Arial Black, Arial`; while (g.measureText(it.text).width > W - 200 && fs > 40) { fs -= 4; g.font = `900 ${fs}px Inter Black, Arial Black, Arial`; } const w = g.measureText(it.text).width + 80, h = fs * 1.45;
    g.fillStyle = 'rgba(20,10,40,.85)'; g.beginPath(); g.roundRect(-w / 2, -h * 0.58, w, h, 26); g.fill(); g.lineWidth = 8; g.strokeStyle = '#ff5fa2'; g.stroke(); g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(it.text, 0, 0); g.restore(); }
  for (const it of items) {
    if (it.type === 'neve') { g.setTransform(1, 0, 0, 1, 0, 0); const n = it.n || 110; for (let i = 0; i < n; i++) { const sp = 0.4 + hash(i + 3) * 0.8, r = 4 + hash(i) * 9; const y = (hash(i + 11) * H + f * (3 + 5 * sp)) % H, x = (hash(i + 5) * W + Math.sin(f * 0.03 + i) * 40 + W) % W; g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fillStyle = `rgba(255,255,255,${0.55 + 0.4 * sp})`; g.fill(); } }
    if (it.type === 'big') { const k = it.k; if (k <= 0) continue; g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.translate(W / 2, it.y || 760); g.scale(k, k); g.rotate(-0.04); let bf = 300; g.font = `900 ${bf}px Arial Black, Arial`; while (g.measureText(it.text).width > W - 120 && bf > 80) { bf -= 10; g.font = `900 ${bf}px Arial Black, Arial`; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 26; g.strokeStyle = '#1c1222'; g.strokeText(it.text, 0, 0); g.fillStyle = it.col || '#ffd23f'; g.fillText(it.text, 0, 0); g.restore(); }
  }
};
