// extras for "sorte": wrist dial, gauge insert, meteor, gold rock, luck stream, gum, pigeon, splat, cap off
POSES.watch = { L: [40, -120], R: [12, 6] };
POSES.crank = { L: [40, -120], R: [40, -110] };
function clover(ctx, x, y, r) { ctx.save(); ctx.translate(x, y); for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 2); ctx.fillStyle = '#52b788'; heart(ctx, 0, -r * 0.55, r * 0.5); ctx.strokeStyle = INK; ctx.lineWidth = wink(0.6); ctx.stroke(); } ctx.restore(); }
function gauge(ctx, x, y, r, v) {
  ctx.save(); ctx.translate(x, y);
  ell(ctx, 0, 0, r, r); paint(ctx, '#2b2d42', INK, wink(1.2));
  ell(ctx, 0, 0, r * 0.86, r * 0.86); paint(ctx, '#fffaf0', INK, wink(0.8));
  for (let i = 0; i <= 10; i++) { const a = Math.PI * (0.75 + 1.5 * i / 10); ctx.strokeStyle = i > 7 ? '#2a9d8f' : INK; ctx.lineWidth = wink(1.2); ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 0.7, Math.sin(a) * r * 0.7); ctx.lineTo(Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8); ctx.stroke(); }
  const a = Math.PI * (0.75 + 1.5 * v / 100);
  ctx.strokeStyle = '#e63946'; ctx.lineWidth = wink(2.2); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r * 0.65, Math.sin(a) * r * 0.65); ctx.stroke();
  ell(ctx, 0, 0, r * 0.08, r * 0.08); paint(ctx, INK);
  rr(ctx, -r * 0.4, r * 0.25, r * 0.8, r * 0.35, r * 0.06); paint(ctx, '#1c1222', INK, wink(0.6));
  ctx.fillStyle = v >= 100 ? '#ffd23f' : '#7bd389'; ctx.font = `900 ${r * 0.28}px Arial Black, Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(Math.round(v)), 0, r * 0.43);
  clover(ctx, 0, -r * 0.4, r * 0.18);
  ctx.restore();
}
const _drawProps5 = drawProps;
drawProps = function (ctx, c, a, J, ink, f) {
  _drawProps5(ctx, c, a, J, ink, f);
  const P = a.props || {};
  if (P.dial != null) {
    const [hx, hy] = J.L.h, [ex, ey] = J.L.e;
    const x = lerp(ex, hx, 0.75), y = lerp(ey, hy, 0.75);
    ell(ctx, x, y, 52, 52); paint(ctx, '#2b2d42', PLUM, ink); ell(ctx, x, y, 40, 40); paint(ctx, P.dial >= 100 ? '#ffd23f' : '#7bd389', PLUM, ink * 0.6);
    ctx.fillStyle = INK; ctx.font = '900 30px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(Math.round(P.dial)), x, y + 2);
  }
  if (P.splat) { ctx.fillStyle = '#ffffff'; ctx.strokeStyle = PLUM; ctx.lineWidth = ink; ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, r = i % 2 ? 50 : 80; ctx.lineTo(Math.cos(a) * r, -1010 + Math.sin(a) * r * 0.6); } ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(30, -990); ctx.quadraticCurveTo(40, -900, 34, -860); paint(ctx, null, '#ffffff', ink * 3); }
};
const _hairFront5 = hairFront;
hairFront = function (ctx, c, ink, a) {
  if (c.hair === 'cap' && a.capOff) { ctx.beginPath(); ctx.moveTo(-200, -860); ctx.quadraticCurveTo(-210, -930, -150, -950); ctx.lineTo(-150, -900); paint(ctx, '#3a2314', PLUM, ink); ctx.beginPath(); ctx.moveTo(200, -860); ctx.quadraticCurveTo(210, -930, 150, -950); ctx.lineTo(150, -900); paint(ctx, '#3a2314', PLUM, ink); return; }
  _hairFront5(ctx, c, ink, a);
};
const _drawProp5 = drawProp;
drawProp = function (ctx, a, f) {
  if (a.type === 'goldrock') {
    ctx.save(); ctx.translate(a.x, a.y);
    ell(ctx, 0, 0, 380, 90); paint(ctx, '#5a3e2b', INK, wink());
    const g = ctx.createRadialGradient(0, -120, 0, 0, -120, 500); g.addColorStop(0, `rgba(255,220,90,${0.7 * (a.glow || 1)})`); g.addColorStop(1, 'rgba(255,220,90,0)'); ctx.fillStyle = g; ctx.fillRect(-500, -620, 1000, 1000);
    ctx.beginPath(); ctx.moveTo(-190, -20); ctx.lineTo(-150, -200); ctx.lineTo(-30, -260); ctx.lineTo(120, -220); ctx.lineTo(200, -80); ctx.lineTo(160, -10); ctx.closePath(); paint(ctx, '#ffd23f', INK, wink());
    ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.moveTo(-100, -180); ctx.lineTo(-30, -230); ctx.lineTo(10, -160); ctx.closePath(); ctx.fill();
    ctx.restore(); return;
  }
  if (a.type === 'pigeon') {
    ctx.save(); ctx.translate(a.x, a.y); ctx.scale(a.s || 1, a.s || 1);
    const w = Math.sin(f * 0.9) * 0.6;
    ell(ctx, 0, 0, 90, 50); paint(ctx, '#8d99ae', INK, wink());
    ell(ctx, 80, -30, 40, 38); paint(ctx, '#8d99ae', INK, wink()); ell(ctx, 92, -36, 6, 6); paint(ctx, INK);
    ctx.beginPath(); ctx.moveTo(118, -30); ctx.lineTo(140, -24); ctx.lineTo(118, -18); ctx.closePath(); paint(ctx, '#ff9f1c', INK, wink(0.6));
    ctx.save(); ctx.rotate(w); ell(ctx, -10, -50, 90, 30, -0.4); paint(ctx, '#adb5bd', INK, wink()); ctx.restore();
    ctx.restore(); return;
  }
  if (a.type === 'gum') {
    ctx.save(); ctx.translate(a.x, a.y);
    ell(ctx, 0, 0, 50, 16); paint(ctx, '#ff8fab', INK, wink(0.7));
    if (a.stretch) { ctx.beginPath(); ctx.moveTo(-10, 0); ctx.quadraticCurveTo(a.dx * 0.5, a.dy * 0.5 + 20, a.dx, a.dy); paint(ctx, null, '#ff8fab', wink(2.4)); }
    ctx.restore(); return;
  }
  if (a.type === 'cap') {
    ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.rot || 0);
    ctx.beginPath(); ctx.ellipse(0, 0, 110, 90, 0, Math.PI, 0); ctx.closePath(); paint(ctx, '#2a4f8f', INK, wink());
    rr(ctx, -20, -12, 150, 26, 12); paint(ctx, '#2a4f8f', INK, wink());
    ctx.restore(); return;
  }
  if (a.type === 'coinfloor') { if (a.k > 0) { ctx.save(); ctx.translate(a.x, a.y); ctx.scale(a.k, a.k); coin(ctx, 0, 0, 30); ctx.restore(); } return; }
  _drawProp5(ctx, a, f);
};
const _drawFx5b = drawFx;
drawFx = function (ctx, fx, f) {
  _drawFx5b(ctx, (fx || []).filter((e) => !['gauge', 'meteor', 'stream', 'clover'].includes(e.type)), f);
  for (const e of fx || []) {
    if (e.type === 'gauge') gauge(ctx, e.x, e.y, e.r, e.v);
    if (e.type === 'clover') clover(ctx, e.x, e.y, e.r);
    if (e.type === 'meteor') { ctx.save(); const g = ctx.createLinearGradient(e.x, e.y, e.x - 600, e.y - 900); g.addColorStop(0, 'rgba(255,210,63,.95)'); g.addColorStop(1, 'rgba(255,120,40,0)'); ctx.strokeStyle = g; ctx.lineWidth = 120; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x - 600, e.y - 900); ctx.stroke(); ell(ctx, e.x, e.y, 90, 90); paint(ctx, '#ffd23f', INK, wink()); ctx.restore(); }
    if (e.type === 'stream') for (let i = 0; i < 10; i++) { const t = ((f * 0.03 + i / 10) % 1); const x = lerp(e.x0, e.x1, t), y = lerp(e.y0, e.y1, t) - Math.sin(t * Math.PI) * 300; clover(ctx, x, y, 34); }
  }
};
