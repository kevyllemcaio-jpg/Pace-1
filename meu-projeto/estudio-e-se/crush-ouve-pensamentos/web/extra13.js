// extras for "relógio alienígena": TransfoRelógio, Bração (4 arms), Zummm (speed), UFO, car, lamp post, jelly monster, goo
CAST.bracao = { skin: '#ff9f43', hair: 'none', pj: '#e85d04', pj2: '#ffba08', pat: 'none', pants: '#3a0ca3', slip: '#3a0ca3', hand: '#ffd23f', bolinha: true };
CAST.zummm = { skin: '#4cc9f0', hair: 'none', pj: '#1d3557', pj2: '#4cc9f0', pat: 'none', pants: '#1d3557', slip: '#ffffff', hand: '#ffffff', bolinha: true };
POSES.watchUp = { L: [150, -40], R: [12, 6] };
POSES.flex = { L: [100, 80], R: [100, 80] };
POSES.liftCar = { L: [12, 6], R: [168, 0] };
POSES.punch = { L: [85, 0], R: [40, -100] };
POSES.punch2 = { L: [40, -100], R: [85, 0] };
const _dk = drawKid;
drawKid = function (ctx, a, f) { ctx.save(); if (a.alpha != null) ctx.globalAlpha = a.alpha; const r = _dk(ctx, a, f); ctx.restore(); return r; };
const _drawProps14 = drawProps;
drawProps = function (ctx, c, a, J, ink, f) {
  _drawProps14(ctx, c, a, J, ink, f);
  const P = a.props || {};
  if (P.watch) {
    const [hx, hy] = J.L.h, [ex, ey] = J.L.e; const x = lerp(ex, hx, 0.72), y = lerp(ey, hy, 0.72);
    const g = P.watch.glow || 0;
    if (g > 0) { const gr = ctx.createRadialGradient(x, y, 0, x, y, 260 * g); gr.addColorStop(0, `rgba(190,120,255,${0.7 * g})`); gr.addColorStop(1, 'rgba(190,120,255,0)'); ctx.fillStyle = gr; ctx.fillRect(x - 300, y - 300, 600, 600); }
    ell(ctx, x, y, 64, 64); paint(ctx, '#5a189a', PLUM, ink); ell(ctx, x, y, 46, 46); paint(ctx, P.watch.red ? (Math.floor(f / 5) % 2 ? '#ff2d55' : '#7a0019') : '#c77dff', PLUM, ink * 0.7);
    ctx.fillStyle = '#fff3b0'; star(ctx, x, y, 30, 13); if (P.watch.crack) { ctx.strokeStyle = INK; ctx.lineWidth = ink; ctx.beginPath(); ctx.moveTo(x - 30, y - 30); ctx.lineTo(x, y); ctx.lineTo(x - 10, y + 20); ctx.lineTo(x + 25, y + 35); ctx.stroke(); }
  }
  if (P.fourArms) { // the lower pair of arms
    const sw = P.fourArms.sw || 0;
    for (const sx of [-1, 1]) { const sh = [sx * 140, -380]; const e = [sx * (260 + sw * 30), -300]; const h = [sx * (300 + sw * 50), -170 - sw * 60]; tube(ctx, [sh, e, h], 58, c.pj, ink); ell(ctx, h[0], h[1], 40, 40); paint(ctx, c.hand, PLUM, ink); }
  }
  if (P.visor) { rr(ctx, -170, -860, 340, 100, 50); paint(ctx, '#111827', PLUM, ink); ctx.fillStyle = 'rgba(120,220,255,.6)'; ctx.fillRect(-120, -845, 80, 20); ctx.beginPath(); ctx.moveTo(0, -1020); ctx.lineTo(-40, -930); ctx.lineTo(10, -930); ctx.lineTo(-20, -860); ctx.lineTo(60, -960); ctx.lineTo(10, -960); ctx.lineTo(40, -1020); ctx.closePath(); paint(ctx, '#ffd23f', PLUM, ink); }
  if (P.goo) { for (let i = 0; i < 9; i++) { const x = -150 + hash(i) * 300, y = -1000 + hash(i + 4) * 900; ell(ctx, x, y, 50 + hash(i + 2) * 40, 40 + hash(i + 5) * 30); paint(ctx, 'rgba(255,60,110,.85)', PLUM, ink * 0.8); ctx.beginPath(); ctx.moveTo(x, y + 30); ctx.quadraticCurveTo(x + 10, y + 90, x, y + 110 + Math.sin(f * 0.1 + i) * 10); paint(ctx, null, 'rgba(255,60,110,.85)', ink * 3); } }
};
const _drawProp14 = drawProp;
drawProp = function (ctx, a, f) {
  if (a.type === 'ufo') {
    ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.tilt || 0); const k = a.s || 1; ctx.scale(k, k);
    ell(ctx, 0, -120, 200, 150); paint(ctx, 'rgba(160,230,255,.75)', INK, wink() / k);
    ell(ctx, 0, 0, 520, 140); paint(ctx, '#adb5bd', INK, wink() / k); ell(ctx, 0, 30, 440, 90); paint(ctx, '#6c757d', INK, wink(0.8) / k);
    for (let i = 0; i < 6; i++) { ell(ctx, -350 + i * 140, 20, 26, 26); paint(ctx, Math.floor(f / 6 + i) % 2 ? '#c77dff' : '#ffd23f', INK, wink(0.6) / k); }
    ctx.restore();
    if (a.smoke) for (let i = 0; i < 6; i++) { const t = ((f * 0.02 + i / 6) % 1); ell(ctx, a.x + Math.sin(i + f * 0.05) * 60, a.y - 200 - t * 700, 70 + t * 100, 60 + t * 80); paint(ctx, `rgba(200,190,230,${0.6 * (1 - t)})`); }
    return;
  }
  if (a.type === 'watchItem') { ctx.save(); ctx.translate(a.x, a.y + Math.sin(f * 0.15) * 15); const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, 260); gr.addColorStop(0, 'rgba(190,120,255,.8)'); gr.addColorStop(1, 'rgba(190,120,255,0)'); ctx.fillStyle = gr; ctx.fillRect(-260, -260, 520, 520); rr(ctx, -40, -150, 80, 300, 30); paint(ctx, '#3c096c', INK, wink()); ell(ctx, 0, 0, 90, 90); paint(ctx, '#5a189a', INK, wink()); ell(ctx, 0, 0, 66, 66); paint(ctx, '#c77dff', INK, wink(0.7)); ctx.fillStyle = '#fff3b0'; star(ctx, 0, 0, 44, 19); ctx.restore(); return; }
  if (a.type === 'car') { ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.rot || 0); const k = a.s || 1; ctx.scale(k, k); rr(ctx, -380, -240, 760, 170, 50); paint(ctx, a.col || '#3a86ff', INK, wink() / k); ctx.beginPath(); ctx.moveTo(-220, -235); ctx.lineTo(-150, -380); ctx.lineTo(170, -380); ctx.lineTo(250, -235); ctx.closePath(); paint(ctx, a.col || '#3a86ff', INK, wink() / k); rr(ctx, -150, -360, 140, 115, 10); paint(ctx, '#bde0fe', INK, wink(0.7) / k); rr(ctx, 20, -360, 150, 115, 10); paint(ctx, '#bde0fe', INK, wink(0.7) / k); for (const wx of [-230, 230]) { ell(ctx, wx, -60, 80, 80); paint(ctx, '#1c1222', INK, wink() / k); ell(ctx, wx, -60, 34, 34); paint(ctx, '#adb5bd', INK, wink(0.6) / k); } ctx.restore(); return; }
  if (a.type === 'pole') { ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.rot || 0); rr(ctx, -16, -1300, 32, 1300, 8); paint(ctx, '#5c677d', INK, wink()); ctx.beginPath(); ctx.moveTo(0, -1290); ctx.quadraticCurveTo(80, -1380, 200, -1330); paint(ctx, null, '#5c677d', wink(3)); ell(ctx, 210, -1310, 50, 30); paint(ctx, '#fff3b0', INK, wink()); ctx.restore(); return; }
  if (a.type === 'jelly') {
    const k = a.s || 1, col = a.red ? '#ff4d6d' : '#70e000', col2 = a.red ? '#ffb3c1' : '#ccff33';
    ctx.save(); ctx.translate(a.x, a.y); ctx.scale(k * (1 + Math.sin(f * 0.25) * 0.03), k * (1 - Math.sin(f * 0.25) * 0.03 - (a.melt || 0) * 0.6));
    ctx.beginPath(); ctx.moveTo(-600, 0); ctx.quadraticCurveTo(-700, -900, -200, -1250); ctx.quadraticCurveTo(0, -1400, 200, -1250); ctx.quadraticCurveTo(700, -900, 600, 0); for (let i = 0; i < 6; i++) ctx.quadraticCurveTo(600 - i * 200 - 100, 60 + Math.sin(f * 0.2 + i) * 20, 600 - (i + 1) * 200, 0); ctx.closePath();
    ctx.fillStyle = col; ctx.globalAlpha = 0.92; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = INK; ctx.lineWidth = wink(1.4) / k; ctx.stroke();
    ctx.fillStyle = col2; ell(ctx, -250, -1000, 120, 60, -0.5); ctx.fill();
    if (a.inside) { ctx.save(); ctx.globalAlpha = 0.6; ctx.translate(200, -400); ctx.rotate(0.4); ctx.scale(0.5, 0.5); rr(ctx, -380, -240, 760, 170, 50); ctx.fillStyle = '#e63946'; ctx.fill(); ctx.restore(); }
    for (const sx of [-1, 1]) { ell(ctx, sx * 180, -880, 110, 130); paint(ctx, '#ffffff', INK, wink() / k); ell(ctx, sx * 180 + (a.look || 0) * 30, -860, 50, 60); paint(ctx, INK); }
    ctx.beginPath(); ctx.moveTo(-280, -600); ctx.quadraticCurveTo(0, a.mouth ? -250 : -500, 280, -600); ctx.quadraticCurveTo(0, -560, -280, -600); paint(ctx, '#2b0f12', INK, wink() / k);
    if (a.dizzy) for (let i = 0; i < 3; i++) { ctx.fillStyle = '#ffd23f'; star(ctx, Math.cos(f * 0.3 + i * 2) * 300, -1300 + Math.sin(f * 0.3 + i * 2) * 60, 50, 20); }
    ctx.restore(); return;
  }
  _drawProp14(ctx, a, f);
};
