// extras for "diálogo": game-style option boxes, speech bubbles, stamp, dog icon
function optionsBox(ctx, e, f) {
  const n = e.items.length, w = e.w || 620, h = 96, gap = 20;
  ctx.save(); ctx.translate(e.x, e.y);
  e.items.forEach((txt, i) => {
    const k = e.ks ? e.ks[i] : 1; if (k <= 0) return;
    ctx.save(); ctx.translate(0, i * (h + gap)); ctx.scale(k, k);
    const sel = e.sel === i;
    rr(ctx, -w / 2, -h / 2, w, h, 22); paint(ctx, sel ? '#ffd23f' : 'rgba(25,20,60,.92)', sel ? INK : '#ffffff', wink(1.1));
    ctx.fillStyle = sel ? '#1c1222' : '#ffffff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.font = `900 ${e.fs || 44}px Arial Black, Arial`; ctx.fillText(`${i + 1}. ${txt}`, -w / 2 + 30, 2);
    if (sel && Math.floor(f / 6) % 2 === 0) { ctx.fillStyle = '#ff2d55'; ctx.beginPath(); ctx.moveTo(-w / 2 - 50, -24); ctx.lineTo(-w / 2 - 14, 0); ctx.lineTo(-w / 2 - 50, 24); ctx.closePath(); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = wink(0.8); ctx.stroke(); }
    ctx.restore();
  });
  ctx.restore();
}
function speech(ctx, e) {
  const k = e.k == null ? 1 : e.k; if (k <= 0) return;
  ctx.save(); ctx.translate(e.x, e.y); ctx.scale(k, k);
  ctx.font = `900 ${e.fs || 50}px Arial Black, Arial`;
  const lines = e.text.split('\n'), w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 70, h = lines.length * (e.fs || 50) * 1.2 + 50;
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 40); ctx.moveTo((e.tx || 0) - 30, h / 2 - 2); ctx.lineTo(e.tx || 0, h / 2 + 60); ctx.lineTo((e.tx || 0) + 30, h / 2 - 2);
  paint(ctx, '#ffffff', INK, wink(1.1));
  ctx.fillStyle = e.col || '#1c1222'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, 0, (i - (lines.length - 1) / 2) * (e.fs || 50) * 1.2 + 2));
  ctx.restore();
}
function stamp(ctx, e) {
  const k = e.k; if (k <= 0) return;
  ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(-0.15); ctx.scale(k, k);
  ctx.font = '900 150px Arial Black, Arial'; const w = ctx.measureText(e.text).width + 80;
  rr(ctx, -w / 2, -110, w, 220, 20); paint(ctx, 'rgba(255,255,255,.85)', '#d62839', wink(3));
  ctx.fillStyle = '#d62839'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(e.text, 0, 8);
  ctx.restore();
}
const _icon6 = icon;
icon = function (ctx, kind, x, y, r) {
  if (kind === 'dog') {
    ctx.save(); ctx.translate(x, y);
    for (const sx of [-1, 1]) { ell(ctx, sx * r * 0.75, -r * 0.1, r * 0.3, r * 0.6, sx * 0.3); paint(ctx, '#7a4a2a', INK, wink(0.8)); }
    ell(ctx, 0, 0, r * 0.7, r * 0.65); paint(ctx, '#d4a373', INK, wink(0.8));
    for (const sx of [-1, 1]) { ell(ctx, sx * r * 0.25, -r * 0.1, r * 0.08, r * 0.1); paint(ctx, INK); }
    ell(ctx, 0, r * 0.2, r * 0.15, r * 0.1); paint(ctx, INK);
    ctx.strokeStyle = '#e63946'; ctx.lineWidth = wink(3); ell(ctx, 0, 0, r * 1.05, r * 1.05); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-r * 0.75, -r * 0.75); ctx.lineTo(r * 0.75, r * 0.75); ctx.stroke();
    ctx.restore(); return;
  }
  _icon6(ctx, kind, x, y, r);
};
const _drawFx7 = drawFx;
drawFx = function (ctx, fx, f) {
  _drawFx7(ctx, (fx || []).filter((e) => !['options', 'speech', 'stamp'].includes(e.type)), f);
  for (const e of fx || []) { if (e.type === 'speech') speech(ctx, e); if (e.type === 'options') optionsBox(ctx, e, f); if (e.type === 'stamp') stamp(ctx, e); }
};
