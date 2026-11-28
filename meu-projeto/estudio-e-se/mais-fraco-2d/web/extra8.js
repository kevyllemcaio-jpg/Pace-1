// extras for "crush": heart glasses, heart counters, blush, anger mark, mirror
function hcount(ctx, e) {
  const k = e.k == null ? 1 : e.k; if (k <= 0) return;
  ctx.save(); ctx.translate(e.x, e.y); ctx.scale(k * (e.sc || 1), k * (e.sc || 1));
  ctx.fillStyle = e.gray ? '#adb5bd' : '#ff2d55'; heart(ctx, 0, 0, 70); ctx.strokeStyle = INK; ctx.lineWidth = wink(1.2) / (e.sc || 1); ctx.stroke();
  if (e.gray) { ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(-14, -10); ctx.lineTo(10, 10); ctx.lineTo(0, 60); ctx.strokeStyle = INK; ctx.lineWidth = wink(1.2) / (e.sc || 1); ctx.stroke(); }
  if (e.n != null) { ctx.fillStyle = '#ffffff'; ctx.font = '900 64px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.strokeText(String(e.n), 0, 0); ctx.fillText(String(e.n), 0, 0); }
  ctx.restore();
}
function anger(ctx, e) { if (e.k <= 0) return; ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.k, e.k); ctx.strokeStyle = '#e63946'; ctx.lineWidth = wink(2.4); for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.moveTo(14, -40); ctx.quadraticCurveTo(14, -14, 40, -14); ctx.stroke(); } ctx.restore(); }
const _drawFx9 = drawFx;
drawFx = function (ctx, fx, f) {
  _drawFx9(ctx, (fx || []).filter((e) => !['hcount', 'anger'].includes(e.type)), f);
  for (const e of fx || []) { if (e.type === 'hcount') hcount(ctx, e); if (e.type === 'anger') anger(ctx, e); }
};
const _face9 = face;
face = function (ctx, c, a, ink, f, seed) {
  _face9(ctx, c, a, ink, f, seed);
  if (a.blush) { ctx.save(); ctx.globalAlpha = a.blush; beanPath(ctx, 0, -790, 200, 222); ctx.clip(); ctx.fillStyle = 'rgba(255,60,90,.35)'; ctx.fillRect(-250, -1050, 500, 520); ctx.fillStyle = 'rgba(255,40,80,.6)'; ell(ctx, -128, -728, 60, 34); ctx.fill(); ell(ctx, 128, -728, 60, 34); ctx.fill(); ctx.restore(); }
};
const _drawProps9 = drawProps;
drawProps = function (ctx, c, a, J, ink, f) {
  _drawProps9(ctx, c, a, J, ink, f);
  const P = a.props || {};
  if (P.hglasses) { for (const sx of [-1, 1]) { ctx.save(); ctx.translate(sx * 75, -805); ctx.fillStyle = 'rgba(255,80,130,.45)'; heart(ctx, 0, 0, 52); ctx.strokeStyle = '#d90429'; ctx.lineWidth = ink * 2.2; ctx.stroke(); ctx.restore(); } ctx.beginPath(); ctx.moveTo(-25, -830); ctx.lineTo(25, -830); paint(ctx, null, '#d90429', ink * 2); }
  if (P.glassesHand) { const [hx, hy] = J.R.h; ctx.save(); ctx.translate(hx, hy - 90); for (const sx of [-1, 1]) { ctx.save(); ctx.translate(sx * 60, 0); ctx.fillStyle = 'rgba(255,80,130,.5)'; heart(ctx, 0, 0, 40); ctx.strokeStyle = '#d90429'; ctx.lineWidth = ink * 2; ctx.stroke(); ctx.restore(); } ctx.restore(); }
};
const _drawProp9 = drawProp;
drawProp = function (ctx, a, f) {
  if (a.type === 'mirror') {
    ctx.save(); ctx.translate(a.x, a.y);
    rr(ctx, -330, -1150, 660, 900, 40); paint(ctx, '#d4a373', INK, wink(1.2));
    rr(ctx, -300, -1120, 600, 840, 30); paint(ctx, '#cfe8ff', INK, wink());
    ctx.save(); rr(ctx, -300, -1120, 600, 840, 30); ctx.clip();
    ctx.fillStyle = '#cde7f0'; ctx.fillRect(-300, -1120, 600, 840);
    if (a.inner) { drawKid(ctx, Object.assign({}, a.inner, { x: 0, y: -60 }), f); }
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(-250, -1120); ctx.lineTo(-120, -1120); ctx.lineTo(-300, -800); ctx.lineTo(-300, -900); ctx.closePath(); ctx.fill();
    ctx.restore();
    rr(ctx, -360, -240, 720, 90, 20); paint(ctx, '#ffffff', INK, wink());
    ctx.restore(); return;
  }
  _drawProp9(ctx, a, f);
};
