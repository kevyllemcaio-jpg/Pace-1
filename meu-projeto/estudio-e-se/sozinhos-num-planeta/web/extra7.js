// extras for "dicas": quest banners, XP popups, arrow, HUD, skip button, toothbrush, toys
function questBanner(ctx, e) {
  const k = e.k == null ? 1 : e.k; if (k <= 0) return;
  ctx.save(); ctx.translate(e.x, e.y); ctx.scale(k, k);
  const w = e.w || 820, h = e.text ? 210 : 130;
  rr(ctx, -w / 2, -h / 2, w, h, 26); paint(ctx, 'rgba(20,16,50,.93)', e.col || '#ffd23f', wink(1.6));
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = e.col || '#ffd23f'; ctx.font = '900 52px Arial Black, Arial'; ctx.fillText(e.title, 0, e.text ? -45 : 2);
  if (e.text) { ctx.fillStyle = '#ffffff'; ctx.font = `900 ${e.fs || 46}px Arial Black, Arial`; ctx.fillText(e.text, 0, 40); }
  ctx.restore();
}
function arrowDown(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y + Math.sin(f * 0.4) * 25); ctx.beginPath(); ctx.moveTo(-60, -110); ctx.lineTo(60, -110); ctx.lineTo(60, -20); ctx.lineTo(110, -20); ctx.lineTo(0, 80); ctx.lineTo(-110, -20); ctx.lineTo(-60, -20); ctx.closePath(); paint(ctx, '#ffd23f', INK, wink(1.4)); ctx.restore(); }
function skipBtn(ctx, e, f) {
  ctx.save(); ctx.translate(e.x, e.y); const p = e.press || 0; ctx.scale(1 - 0.08 * p, 1 - 0.08 * p);
  rr(ctx, -320, -110, 640, 220, 50); paint(ctx, e.locked ? '#6c757d' : '#ffffff', INK, wink(1.8));
  ctx.fillStyle = e.locked ? '#dee2e6' : '#1c1222'; ctx.font = '900 96px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('PULAR ▶▶', 0, 6);
  if (e.locked) { ctx.strokeStyle = '#e63946'; ctx.lineWidth = wink(5); ctx.beginPath(); ctx.moveTo(-300, -100); ctx.lineTo(300, 100); ctx.moveTo(300, -100); ctx.lineTo(-300, 100); ctx.stroke(); }
  ctx.restore();
}
function hud(ctx, e) {
  ctx.save(); ctx.translate(e.x, e.y);
  for (let i = 0; i < 3; i++) { ctx.fillStyle = '#ff2d55'; heart(ctx, i * 90, 0, 32); ctx.strokeStyle = INK; ctx.lineWidth = wink(0.8); ctx.stroke(); }
  rr(ctx, 300, -30, 420, 60, 30); paint(ctx, 'rgba(20,16,50,.85)', '#ffffff', wink(1));
  rr(ctx, 308, -22, 404 * (e.xp || 0.3), 44, 22); paint(ctx, '#7bd389');
  ctx.fillStyle = '#ffffff'; ctx.font = '900 34px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(`NÍVEL ${e.lvl || 1}`, 510, 2);
  ctx.restore();
}
const _drawFx8 = drawFx;
drawFx = function (ctx, fx, f) {
  _drawFx8(ctx, (fx || []).filter((e) => !['quest', 'arrow', 'skip', 'hud'].includes(e.type)), f);
  for (const e of fx || []) { if (e.type === 'quest') questBanner(ctx, e); if (e.type === 'arrow') arrowDown(ctx, e, f); if (e.type === 'skip') skipBtn(ctx, e, f); if (e.type === 'hud') hud(ctx, e); }
};
const _drawProps8 = drawProps;
drawProps = function (ctx, c, a, J, ink, f) {
  _drawProps8(ctx, c, a, J, ink, f);
  const P = a.props || {};
  if (P.brush) { const [hx, hy] = J.R.h; ctx.save(); ctx.translate(hx, hy); ctx.rotate(-1.2 + Math.sin(f * 1.5) * 0.25); rr(ctx, -10, -170, 20, 170, 8); paint(ctx, '#4cc9f0', PLUM, ink); rr(ctx, -16, -210, 32, 50, 6); paint(ctx, '#ffffff', PLUM, ink); ctx.restore(); ctx.fillStyle = '#ffffff'; for (let i = 0; i < 4; i++) { ell(ctx, 60 + Math.sin(f * 0.7 + i) * 50, -690 - i * 20, 14, 14); paint(ctx, '#ffffff', PLUM, ink * 0.5); } }
};
const _drawProp8 = drawProp;
drawProp = function (ctx, a, f) {
  if (a.type === 'toys') {
    ctx.save(); ctx.translate(a.x, a.y);
    const n = Math.floor(a.n || 14);
    for (let i = 0; i < n; i++) {
      const x = (hash(i) - 0.5) * 1500, y = hash(i + 4) * 300; ctx.save(); ctx.translate(x, y); ctx.rotate((hash(i + 9) - 0.5) * 1.2);
      const t = i % 4;
      if (t === 0) { rr(ctx, -60, -40, 120, 80, 10); paint(ctx, ['#e63946', '#3a86ff', '#ffbe0b'][i % 3], INK, wink(0.8)); }
      if (t === 1) { ell(ctx, 0, 0, 45, 45); paint(ctx, '#ff9f1c', INK, wink(0.8)); ctx.beginPath(); ctx.moveTo(-45, 0); ctx.lineTo(45, 0); paint(ctx, null, INK, wink(0.6)); }
      if (t === 2) { rr(ctx, -80, -20, 160, 40, 20); paint(ctx, '#8338ec', INK, wink(0.8)); }
      if (t === 3) { ctx.beginPath(); ctx.moveTo(-50, 30); ctx.lineTo(0, -50); ctx.lineTo(50, 30); ctx.closePath(); paint(ctx, '#52b788', INK, wink(0.8)); }
      ctx.restore();
    }
    ctx.restore(); return;
  }
  _drawProp8(ctx, a, f);
};
