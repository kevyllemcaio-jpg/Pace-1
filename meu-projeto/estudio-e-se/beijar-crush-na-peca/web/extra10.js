// extras for "últimos humanos": mall, rooftop cinema, bench, ice cream, golf cart, traffic light, board game, bus, crowd shirts
POSES.cone = { L: [12, 6], R: [40, -120] };
POSES.drive = { L: [40, -100], R: [40, -100] };
const _drawProps11 = drawProps;
drawProps = function (ctx, c, a, J, ink, f) {
  _drawProps11(ctx, c, a, J, ink, f);
  const P = a.props || {};
  if (P.cone) { const [hx, hy] = J.R.h; ctx.beginPath(); ctx.moveTo(hx - 36, hy - 50); ctx.lineTo(hx + 36, hy - 50); ctx.lineTo(hx, hy + 40); ctx.closePath(); paint(ctx, '#e9c46a', PLUM, ink); ell(ctx, hx, hy - 80, 44, 40); paint(ctx, '#ffafcc', PLUM, ink); ell(ctx, hx - 8, hy - 120, 34, 30); paint(ctx, '#bde0fe', PLUM, ink); }
  if (P.books) { const [x, y] = [(J.L.h[0] + J.R.h[0]) / 2, (J.L.h[1] + J.R.h[1]) / 2]; ['#e63946', '#3a86ff', '#2a9d8f', '#ffbe0b', '#8338ec'].forEach((col, i) => { rr(ctx, x - 110 + (i % 2) * 14, y - 40 - i * 46, 220, 42, 6); paint(ctx, col, PLUM, ink); }); }
  if (P.glow) { const [hx, hy] = J.R.h; ctx.save(); ctx.translate(hx, hy - 60); ctx.rotate(0.3 + Math.sin(f * 0.3) * 0.3); rr(ctx, -12, -90, 24, 180, 12); paint(ctx, ['#7bd389', '#ff5fa2', '#4cc9f0'][(a.seed || 0) % 3], PLUM, ink); ctx.restore(); }
  if (P.shirt) { ctx.fillStyle = '#1c1222'; rr(ctx, -110, -520, 220, 110, 14); ctx.fill(); ctx.fillStyle = '#ffd23f'; ctx.font = '900 56px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.save(); if ((a.flip || 1) < 0) ctx.scale(-1, 1); ctx.fillText('SHOW', 0, -463); ctx.restore(); }
};
const _drawSet11 = drawSet;
drawSet = function (ctx, st, cam, f) {
  if (st.set === 'mall') {
    ctx.fillStyle = '#f1e3ff'; ctx.fillRect(-3000, -2600, 6000, 2600);
    rr(ctx, -3000, -2000, 6000, 80, 0); paint(ctx, '#c8b6ff', INK, wink());
    for (const [x, name, col] of [[-700, 'LIVRARIA', '#3a86ff'], [700, 'DOCES', '#ff5fa2']]) {
      rr(ctx, x - 620, -1500, 1240, 1500, 10); paint(ctx, col, INK, wink());
      rr(ctx, x - 560, -1120, 1120, 1120, 6); paint(ctx, '#e0f4ff', INK, wink());
      sign(ctx, name, x, -1320, 110, '#ffffff', null);
      if (name === 'LIVRARIA') for (let r = 0; r < 4; r++) for (let b = 0; b < 12; b++) { rr(ctx, x - 520 + b * 86, -1060 + r * 250, 70, 190, 6); paint(ctx, ['#e63946', '#2a9d8f', '#ffbe0b', '#8338ec'][(b + r) % 4], INK, wink(0.5)); }
      else for (let r = 0; r < 4; r++) for (let b = 0; b < 8; b++) { ell(ctx, x - 470 + b * 135, -980 + r * 240, 52, 52); paint(ctx, ['#ff5fa2', '#ffd23f', '#4cc9f0', '#c77dff'][(b + r) % 4], INK, wink(0.6)); }
    }
    tileFloor(ctx, '#e9e2f7', 'rgba(120,100,170,.3)');
    return;
  }
  if (st.set === 'roof') {
    const g = ctx.createLinearGradient(0, -2600, 0, 0); g.addColorStop(0, st.sunset ? '#ff9e7a' : '#0c1748'); g.addColorStop(1, st.sunset ? '#ffd6a5' : '#3d3a8f');
    ctx.fillStyle = g; ctx.fillRect(-4000, -2800, 8000, 2900);
    if (!st.sunset) for (let i = 0; i < 60; i++) { ctx.fillStyle = `rgba(255,250,210,${0.4 + 0.6 * Math.abs(Math.sin(f * 0.05 + i))})`; star(ctx, -3000 + hash(i) * 6000, -2600 + hash(i + 3) * 1800, 8, 3); }
    else { ell(ctx, 0, -500, 260, 260); paint(ctx, '#ffd23f'); }
    for (let i = 0; i < 16; i++) { const x = -3200 + i * 420, h = 500 + hash(i + 2) * 900; rr(ctx, x, -h - 200, 360, h + 200, 0); paint(ctx, st.sunset ? '#7a3b5e' : '#1b1f4a', INK, wink(0.6)); for (let w = 0; w < 8; w++) if (hash(i * 9 + w) > 0.4) { ctx.fillStyle = st.empty ? 'rgba(80,80,110,.6)' : '#ffd56b'; ctx.fillRect(x + 40 + (w % 3) * 100, -h - 120 + Math.floor(w / 3) * 160, 60, 80); } }
    ctx.fillStyle = '#5c677d'; ctx.fillRect(-4000, -200, 8000, 3000);
    rr(ctx, -4000, -230, 8000, 40, 0); paint(ctx, '#8d99ae', INK, wink());
    return;
  }
  if (st.set === 'plaza') {
    _drawSet11(ctx, Object.assign({}, st, { set: 'yard' }), cam, f);
    return;
  }
  _drawSet11(ctx, st, cam, f);
};
const _drawProp11 = drawProp;
drawProp = function (ctx, a, f) {
  if (a.type === 'bench') { ctx.save(); ctx.translate(a.x, a.y); rr(ctx, -420, -260, 840, 50, 12); paint(ctx, '#a0673f', INK, wink()); rr(ctx, -420, -420, 840, 50, 12); paint(ctx, '#a0673f', INK, wink()); for (const sx of [-1, 1]) { rr(ctx, sx * 360 - 16, -420, 32, 420, 8); paint(ctx, '#2b2d42', INK, wink()); } ctx.restore(); return; }
  if (a.type === 'cart') {
    ctx.save(); ctx.translate(a.x, a.y); ctx.scale(a.flip || 1, 1);
    rr(ctx, -420, -880, 840, 40, 14); paint(ctx, '#ffffff', INK, wink());
    for (const sx of [-1, 1]) { rr(ctx, sx * 380 - 12, -860, 24, 560, 6); paint(ctx, '#adb5bd', INK, wink(0.7)); }
    rr(ctx, -460, -330, 920, 230, 50); paint(ctx, '#52b788', INK, wink());
    for (const wx of [-280, 280]) { ell(ctx, wx, -80, 90, 90); paint(ctx, '#1c1222', INK, wink()); ell(ctx, wx, -80, 36, 36); paint(ctx, '#adb5bd', INK, wink(0.6)); }
    ctx.restore(); return;
  }
  if (a.type === 'semaforo') { ctx.save(); ctx.translate(a.x, a.y); rr(ctx, -18, -1300, 36, 1300, 8); paint(ctx, '#5c677d', INK, wink()); rr(ctx, -90, -1700, 180, 420, 30); paint(ctx, '#2b2d42', INK, wink()); const on = Math.floor(f / 15) % 2; ell(ctx, 0, -1600, 54, 54); paint(ctx, '#3a2a10', INK, wink(0.6)); ell(ctx, 0, -1490, 54, 54); paint(ctx, on ? '#ffbe0b' : '#3a2a10', INK, wink(0.6)); ell(ctx, 0, -1380, 54, 54); paint(ctx, '#0f2a1a', INK, wink(0.6)); ctx.restore(); return; }
  if (a.type === 'board') { ctx.save(); ctx.translate(a.x, a.y); rr(ctx, -360, -60, 720, 120, 20); paint(ctx, '#ffffff', INK, wink()); for (let i = 0; i < 8; i++) for (let j = 0; j < 2; j++) { ctx.fillStyle = (i + j) % 2 ? '#e63946' : '#ffd23f'; ctx.fillRect(-340 + i * 85, -50 + j * 50, 85, 50); } ell(ctx, -100, -70, 26, 26); paint(ctx, '#3a86ff', INK, wink(0.7)); ell(ctx, 160, -70, 26, 26); paint(ctx, '#2a9d8f', INK, wink(0.7)); ctx.restore(); return; }
  if (a.type === 'sheet') { ctx.save(); ctx.translate(a.x, a.y); for (const sx of [-1, 1]) { rr(ctx, sx * 520 - 12, -1200, 24, 1200, 6); paint(ctx, '#8d5a3b', INK, wink()); } const w = Math.sin(f * 0.08) * 12; ctx.beginPath(); ctx.moveTo(-500, -1150); ctx.lineTo(500, -1150); ctx.quadraticCurveTo(510 + w, -850, 500, -550); ctx.lineTo(-500, -550); ctx.quadraticCurveTo(-510 - w, -850, -500, -1150); ctx.closePath(); paint(ctx, '#f8f9fa', INK, wink()); const g = ctx.createRadialGradient(0, -850, 0, 0, -850, 420); g.addColorStop(0, 'rgba(255,240,170,.85)'); g.addColorStop(1, 'rgba(255,240,170,0)'); ctx.fillStyle = g; ctx.fillRect(-500, -1150, 1000, 600); ctx.fillStyle = 'rgba(40,20,60,.75)'; ell(ctx, -60, -880, 90, 90); ctx.fill(); ctx.beginPath(); ctx.moveTo(20, -900); ctx.lineTo(160, -980); ctx.lineTo(150, -800); ctx.closePath(); ctx.fill(); ctx.restore(); return; }
  if (a.type === 'bus') { ctx.save(); ctx.translate(a.x, a.y); rr(ctx, -900, -900, 1800, 820, 60); paint(ctx, '#ffbe0b', INK, wink()); for (let i = 0; i < 5; i++) { rr(ctx, -820 + i * 330, -820, 280, 300, 14); paint(ctx, '#bde0fe', INK, wink(0.7)); } rr(ctx, -900, -460, 1800, 60, 0); paint(ctx, '#e76f51', INK, wink(0.7)); for (const wx of [-580, 580]) { ell(ctx, wx, -80, 120, 120); paint(ctx, '#1c1222', INK, wink()); } ctx.restore(); return; }
  if (a.type === 'poster') { ctx.save(); ctx.translate(a.x, a.y); rr(ctx, -260, -380, 520, 760, 12); paint(ctx, '#3a0ca3', INK, wink()); ctx.fillStyle = '#ffd23f'; ctx.font = '900 110px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('SHOW', 0, -180); ctx.font = '900 70px Arial Black, Arial'; ctx.fillStyle = '#ff5fa2'; ctx.fillText('HOJE!', 0, -60); ctx.fillStyle = '#ffffff'; ctx.font = '700 46px Arial'; ctx.fillText('CIDADE VIZINHA', 0, 80); star(ctx, 0, 230, 90, 40, '#ffd23f'); ctx.restore(); return; }
  _drawProp11(ctx, a, f);
};
const _drawFx11 = drawFx;
drawFx = function (ctx, fx, f) {
  _drawFx11(ctx, (fx || []).filter((e) => e.type !== 'nowifi'), f);
  for (const e of fx || []) if (e.type === 'nowifi') { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.k, e.k); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = wink(3); for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(0, 0, i * 60, -Math.PI * 0.75, -Math.PI * 0.25); ctx.stroke(); } ell(ctx, 0, 0, 16, 16); paint(ctx, '#ffffff'); ctx.strokeStyle = '#e63946'; ctx.lineWidth = wink(4); ctx.beginPath(); ctx.moveTo(-130, -200); ctx.lineTo(130, 30); ctx.stroke(); ctx.restore(); }
};
