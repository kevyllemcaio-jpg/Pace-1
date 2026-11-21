// extras for "virasse uma menina" (horizontal): bolinha with long hair / braids, comb + brush stuck, hair ties, shooting star, photo album
CAST.boyL = Object.assign({}, CAST.boy, { hair: 'long', hc: '#6b3f26', band: null });
CAST.boyT = Object.assign({}, CAST.boy, { hair: 'braids', hc: '#6b3f26', band: '#ff5fa2' });
POSES.shrug = { L: [60, 80], R: [60, 80] };
POSES.comb = { L: [12, 6], R: [165, -40] };
POSES.album = { L: [35, -110], R: [35, -110] };
POSES.wrists = { L: [70, -60], R: [70, -60] };
const _drawProps12 = drawProps;
drawProps = function (ctx, c, a, J, ink, f) {
  _drawProps12(ctx, c, a, J, ink, f);
  const P = a.props || {};
  if (P.comb) { ctx.save(); ctx.translate(150, -1010); ctx.rotate(0.5 + Math.sin(f * 0.6) * 0.05); rr(ctx, -90, -18, 180, 36, 8); paint(ctx, '#ff5fa2', PLUM, ink); for (let i = 0; i < 9; i++) { ctx.fillStyle = '#ff5fa2'; ctx.fillRect(-80 + i * 19, 14, 8, 40); } ctx.restore(); }
  if (P.hbrush) { ctx.save(); ctx.translate(-160, -1000); ctx.rotate(-0.6); rr(ctx, -20, -40, 40, 200, 14); paint(ctx, '#3a86ff', PLUM, ink); ell(ctx, 0, -70, 60, 70); paint(ctx, '#3a86ff', PLUM, ink); ctx.restore(); }
  if (P.bands) for (const k of ['L', 'R']) { const [hx, hy] = J[k].h, [ex, ey] = J[k].e; for (let i = 0; i < 3; i++) { const x = lerp(hx, ex, 0.18 + i * 0.1), y = lerp(hy, ey, 0.18 + i * 0.1); ell(ctx, x, y, 40, 14, Math.atan2(hy - ey, hx - ex) + Math.PI / 2); paint(ctx, null, ['#ff5fa2', '#ffd23f', '#4cc9f0'][i], ink * 2.4); } }
  if (P.tie) { const [hx, hy] = J.R.h; ell(ctx, hx, hy - 50, 34, 34); paint(ctx, null, '#ffd23f', ink * 3); }
  if (P.album) { const x = (J.L.h[0] + J.R.h[0]) / 2, y = (J.L.h[1] + J.R.h[1]) / 2 - 80; ctx.save(); ctx.translate(x, y); if ((a.flip || 1) < 0) ctx.scale(-1, 1); rr(ctx, -260, -150, 520, 300, 14); paint(ctx, '#ffe5ec', PLUM, ink); for (const [px, py] of [[-130, -40], [130, -40]]) { rr(ctx, px - 100, py - 80, 200, 170, 6); paint(ctx, '#ffffff', PLUM, ink * 0.8); ell(ctx, px, py, 50, 46); paint(ctx, '#ffd6a5', PLUM, ink * 0.7); ell(ctx, px - 16, py - 6, 6, 6); paint(ctx, INK); ell(ctx, px + 16, py - 6, 6, 6); paint(ctx, INK); } ctx.fillStyle = '#d62839'; ctx.font = '900 40px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.fillText('BEBÊS ♥', 0, 125); ctx.restore(); }
};
const _drawFx12 = drawFx;
drawFx = function (ctx, fx, f) {
  _drawFx12(ctx, (fx || []).filter((e) => !['shoot', 'magic'].includes(e.type)), f);
  for (const e of fx || []) {
    if (e.type === 'shoot') { const t = clamp(e.t); if (t <= 0 || t >= 1) continue; const x = lerp(e.x0, e.x1, t), y = lerp(e.y0, e.y1, t); const g = ctx.createLinearGradient(x, y, x - 400, y - 160); g.addColorStop(0, 'rgba(255,250,200,.95)'); g.addColorStop(1, 'rgba(255,250,200,0)'); ctx.strokeStyle = g; ctx.lineWidth = wink(4); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 400, y - 160); ctx.stroke(); ctx.fillStyle = '#fff59d'; star(ctx, x, y, 34, 14); }
    if (e.type === 'magic') for (let i = 0; i < 8; i++) { const a = f * 0.15 + i * Math.PI / 4; ctx.save(); ctx.translate(e.x + Math.cos(a) * e.r, e.y + Math.sin(a) * e.r * 0.5); ctx.rotate(f * 0.1); ctx.fillStyle = ['#fff59d', '#ffc8dd', '#bde0fe'][i % 3]; star(ctx, 0, 0, 26, 10); ctx.restore(); }
  }
};
