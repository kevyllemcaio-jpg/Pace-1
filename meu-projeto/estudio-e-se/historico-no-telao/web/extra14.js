// extras for "relógio na vida real": Fogaréu, Asinha, Pingo, alien icons, fire, giant robot, circuit interior, soap
CAST.fogareu = { skin: '#ff5400', hair: 'none', pj: '#9d0208', pj2: '#ffba08', pat: 'none', pants: '#370617', slip: '#370617', hand: '#ffba08', bolinha: true };
CAST.asinha = { skin: '#ff8fab', hair: 'none', pj: '#c9184a', pj2: '#ffc8dd', pat: 'none', pants: '#590d22', slip: '#ffffff', hand: '#ffffff', bolinha: true };
CAST.pingo = { skin: '#80ed99', hair: 'none', pj: '#2d6a4f', pj2: '#b7e4c7', pat: 'none', pants: '#1b4332', slip: '#ffffff', hand: '#ffffff', bolinha: true };
const ALIENS = [['bracao', '#ff9f43'], ['zummm', '#4cc9f0'], ['fogareu', '#ff5400'], ['asinha', '#ff8fab'], ['pingo', '#80ed99'], ['x6', '#c77dff'], ['x7', '#ffd23f'], ['x8', '#2ec4b6'], ['x9', '#e63946'], ['x10', '#adb5bd']];
const _drawProps15 = drawProps;
drawProps = function (ctx, c, a, J, ink, f) {
  const P = a.props || {};
  if (P.wings) { for (const sx of [-1, 1]) { ctx.save(); ctx.translate(sx * 120, -500); ctx.rotate(sx * (0.5 + Math.sin(f * 0.9) * 0.4)); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(sx * 300, -260, sx * 420, -80); ctx.quadraticCurveTo(sx * 260, 20, 0, 40); ctx.closePath(); paint(ctx, 'rgba(255,240,250,.9)', PLUM, ink); ctx.restore(); } }
  _drawProps15(ctx, c, a, J, ink, f);
  if (P.flame) { for (let i = 0; i < 5; i++) { const x = -160 + i * 80, h = 140 + Math.sin(f * 0.6 + i * 1.7) * 50; ctx.beginPath(); ctx.moveTo(x - 50, -960); ctx.quadraticCurveTo(x - 20, -960 - h * 0.6, x, -960 - h); ctx.quadraticCurveTo(x + 20, -960 - h * 0.6, x + 50, -960); ctx.closePath(); paint(ctx, i % 2 ? '#ffba08' : '#ff5400', PLUM, ink * 0.8); } }
  if (P.brain) { ell(ctx, 0, -1010, 160, 70); paint(ctx, '#ffafcc', PLUM, ink); ctx.strokeStyle = PLUM; ctx.lineWidth = ink; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-90 + i * 60, -1010, 30, Math.PI, 0); ctx.stroke(); } for (const sx of [-1, 1]) { ell(ctx, sx * 75, -805, 62, 58); paint(ctx, 'rgba(200,230,255,.25)', '#1b4332', ink * 2); } ctx.beginPath(); ctx.moveTo(-12, -812); ctx.lineTo(12, -812); paint(ctx, null, '#1b4332', ink * 2); if (P.brain > 1) { ctx.fillStyle = '#ffffff'; star(ctx, 110, -840, 40, 10); } }
};
function alienIcon(ctx, x, y, r, col, k) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ell(ctx, 0, 0, r, r); paint(ctx, col, INK, wink()); ell(ctx, -r * 0.3, -r * 0.1, r * 0.12, r * 0.2); paint(ctx, INK); ell(ctx, r * 0.3, -r * 0.1, r * 0.12, r * 0.2); paint(ctx, INK); ctx.beginPath(); ctx.moveTo(-r * 0.3, r * 0.3); ctx.quadraticCurveTo(0, r * 0.5, r * 0.3, r * 0.3); paint(ctx, null, INK, wink()); ctx.restore(); }
const _drawFx15 = drawFx;
drawFx = function (ctx, fx, f) {
  _drawFx15(ctx, (fx || []).filter((e) => !['ring', 'fire', 'soap', 'spark2'].includes(e.type)), f);
  for (const e of fx || []) {
    if (e.type === 'ring') { const n = e.n || 10; for (let i = 0; i < n; i++) { const ag = f * 0.03 + i / n * Math.PI * 2; const [, col] = ALIENS[i % ALIENS.length]; ctx.save(); ctx.globalAlpha = 0.9; const gr = ctx.createRadialGradient(e.x + Math.cos(ag) * e.r, e.y + Math.sin(ag) * e.r * 0.45, 0, e.x + Math.cos(ag) * e.r, e.y + Math.sin(ag) * e.r * 0.45, 90); gr.addColorStop(0, 'rgba(190,120,255,.5)'); gr.addColorStop(1, 'rgba(190,120,255,0)'); ctx.fillStyle = gr; ctx.fillRect(e.x + Math.cos(ag) * e.r - 90, e.y + Math.sin(ag) * e.r * 0.45 - 90, 180, 180); alienIcon(ctx, e.x + Math.cos(ag) * e.r, e.y + Math.sin(ag) * e.r * 0.45, 50, col, e.k == null ? 1 : e.k); ctx.restore(); } }
    if (e.type === 'fire') for (let i = 0; i < 12; i++) { const x = e.x - e.w / 2 + (i + 0.5) * e.w / 12, h = (120 + Math.sin(f * 0.5 + i * 1.3) * 60 + hash(i) * 80) * e.k; ctx.beginPath(); ctx.moveTo(x - 50, e.y); ctx.quadraticCurveTo(x - 30, e.y - h * 0.6, x + Math.sin(f * 0.4 + i) * 20, e.y - h); ctx.quadraticCurveTo(x + 30, e.y - h * 0.6, x + 50, e.y); ctx.closePath(); paint(ctx, i % 3 === 0 ? '#ffba08' : i % 3 === 1 ? '#ff5400' : '#e85d04', INK, wink(0.7)); }
    if (e.type === 'soap') for (let i = 0; i < 10; i++) { const t = ((f * 0.02 + i / 10) % 1); ell(ctx, e.x + Math.sin(i * 2 + f * 0.05) * 150, e.y - t * 400, 26 + hash(i) * 20, 26 + hash(i) * 20); ctx.strokeStyle = 'rgba(160,220,255,.9)'; ctx.lineWidth = wink(1.2); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fill(); }
    if (e.type === 'spark2') for (let i = 0; i < 10; i++) { const ag = i / 10 * Math.PI * 2; ctx.strokeStyle = i % 2 ? '#ffd23f' : '#ffffff'; ctx.lineWidth = wink(2); ctx.beginPath(); ctx.moveTo(e.x + Math.cos(ag) * 20, e.y + Math.sin(ag) * 20); ctx.lineTo(e.x + Math.cos(ag) * (60 + 60 * e.k), e.y + Math.sin(ag) * (60 + 60 * e.k)); ctx.stroke(); }
  }
};
const _drawProp15 = drawProp;
drawProp = function (ctx, a, f) {
  if (a.type === 'robot') {
    const k = a.s || 1, on = a.on == null ? 1 : a.on;
    ctx.save(); ctx.translate(a.x, a.y); ctx.scale(k, k); ctx.rotate(a.slump || 0);
    for (const sx of [-1, 1]) { rr(ctx, sx * 220 - 90, -900, 180, 900, 30); paint(ctx, '#6c757d', INK, wink() / k); rr(ctx, sx * 220 - 140, -80, 280, 80, 20); paint(ctx, '#495057', INK, wink() / k); }
    if (a.bolt) { ell(ctx, -220, -300, 40, 40); paint(ctx, '#2b2d42', INK, wink(0.8) / k); }
    rr(ctx, -420, -1900, 840, 1050, 80); paint(ctx, '#adb5bd', INK, wink() / k);
    rr(ctx, -260, -1700, 520, 360, 30); paint(ctx, '#495057', INK, wink() / k);
    for (let i = 0; i < 4; i++) { ell(ctx, -150 + i * 100, -1500, 26, 26); paint(ctx, on && Math.floor(f / 6 + i) % 2 ? '#ff2d55' : '#2b2d42', INK, wink(0.6) / k); }
    for (const sx of [-1, 1]) { rr(ctx, sx * 520 - 90, -1850, 180, 800, 60); paint(ctx, '#868e96', INK, wink() / k); ell(ctx, sx * 520, -1000, 130, 130); paint(ctx, '#495057', INK, wink() / k); }
    rr(ctx, -260, -2400, 520, 460, 60); paint(ctx, '#ced4da', INK, wink() / k);
    for (const sx of [-1, 1]) { ell(ctx, sx * 110, -2200, 80, 60); paint(ctx, on ? '#ff2d55' : '#343a40', INK, wink() / k); if (on) { ctx.fillStyle = 'rgba(255,45,85,.3)'; ell(ctx, sx * 110, -2200, 150, 110); ctx.fill(); } }
    ctx.beginPath(); ctx.moveTo(0, -2400); ctx.lineTo(0, -2600); paint(ctx, null, INK, wink(2) / k); ell(ctx, 0, -2620, 30, 30); paint(ctx, on ? '#ffd23f' : '#495057', INK, wink(0.6) / k);
    ctx.restore(); return;
  }
  if (a.type === 'bigBag') { ctx.save(); ctx.translate(a.x, a.y); ctx.scale(a.s || 1, a.s || 1); rr(ctx, -300, -620, 600, 620, 120); paint(ctx, '#e63946', INK, wink()); rr(ctx, -220, -320, 440, 220, 40); paint(ctx, '#c1121f', INK, wink()); ctx.fillStyle = '#ffd23f'; ctx.font = '900 80px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.fillText('50 KG', 0, -420); ctx.restore(); return; }
  _drawProp15(ctx, a, f);
};
const _drawSet15 = drawSet;
drawSet = function (ctx, st, cam, f) {
  if (st.set === 'circuit') {
    ctx.fillStyle = '#0b0f1e'; ctx.fillRect(-4000, -4000, 8000, 8000);
    for (let i = 0; i < 40; i++) { const y = -2500 + i * 120; ctx.strokeStyle = ['#00f5d4', '#9b5de5', '#f15bb5', '#fee440'][i % 4]; ctx.lineWidth = wink(2.5); ctx.beginPath(); ctx.moveTo(-3000, y); for (let x = -3000; x <= 3000; x += 300) ctx.lineTo(x, y + (hash(i * 31 + x) > 0.5 ? 60 : -60)); ctx.stroke(); }
    for (let i = 0; i < 30; i++) { rr(ctx, -2500 + hash(i) * 5000, -2400 + hash(i + 5) * 3000, 200, 140, 10); paint(ctx, '#1f2a44', '#00f5d4', wink()); }
    if (!st.cut) { ctx.strokeStyle = '#ff2d55'; ctx.lineWidth = wink(8); ctx.beginPath(); ctx.moveTo(-600, -500); ctx.quadraticCurveTo(0, -300, 600, -500); ctx.stroke(); }
    else { ctx.strokeStyle = '#ff2d55'; ctx.lineWidth = wink(8); ctx.beginPath(); ctx.moveTo(-600, -500); ctx.quadraticCurveTo(-200, -380, -40, -360); ctx.moveTo(40, -360); ctx.quadraticCurveTo(200, -380, 600, -500); ctx.stroke(); }
    ctx.fillStyle = '#343a40'; ctx.fillRect(-4000, 0, 8000, 3000);
    return;
  }
  _drawSet15(ctx, st, cam, f);
};
