// extras for "virasse um menino" (horizontal): Léo, short-haired Sofia, boys, soccer ball & goal, pockets, hand brush
CAST.leo = { skin: '#efc29f', hair: 'boy', hc: '#2b1b1e', pj: '#2ec4b6', pj2: '#9ff0e8', pat: 'stripes', pants: '#264653', slip: '#ffffff' };
CAST.sofiaB = Object.assign({}, CAST.sofia, { hair: 'boy', hc: '#7a4a2a' });
[['b1', '#8b5a3c', '#1e1414', '#e76f51'], ['b2', '#f2caa6', '#d9a441', '#3a86ff'], ['b3', '#c98e66', '#3a2314', '#52b788']].forEach(([k, skin, hc, pj]) => { CAST[k] = { skin, hair: 'boy', hc, pj, pj2: '#ffffff', pat: 'stripes', pants: '#2b2d42', slip: '#ffffff' }; });
POSES.brushHand = { L: [12, 6], R: [160, -30] };
POSES.kick = { L: [120, 20], R: [120, 20] };
const _drawProps13 = drawProps;
drawProps = function (ctx, c, a, J, ink, f) {
  _drawProps13(ctx, c, a, J, ink, f);
  const P = a.props || {};
  if (P.hbrushHand) { const [hx, hy] = J.R.h; ctx.save(); ctx.translate(hx, hy); ctx.rotate(-2.2); rr(ctx, -18, -20, 36, 160, 12); paint(ctx, '#3a86ff', PLUM, ink); ell(ctx, 0, -60, 52, 60); paint(ctx, '#3a86ff', PLUM, ink); ctx.restore(); }
  if (P.pockets) {
    const n = P.pockets;
    for (const sx of [-1, 1]) { rr(ctx, sx * 150 - 70, -260, 140, 120, 16); paint(ctx, '#a0673f', PLUM, ink); }
    if (n >= 1) { rr(ctx, -200, -330, 110, 80, 10); paint(ctx, '#ffd166', PLUM, ink); }
    if (n >= 2) { rr(ctx, 100, -360, 140, 60, 20); paint(ctx, '#ff5fa2', PLUM, ink); }
    if (n >= 3) { rr(ctx, 120, -420, 90, 130, 6); paint(ctx, '#3a86ff', PLUM, ink); }
    if (n >= 4) { ell(ctx, -150, -360, 50, 50); paint(ctx, '#ffffff', PLUM, ink); star(ctx, -150, -360, 30, 12, '#ffd23f'); }
  }
};
const _drawProp13 = drawProp;
drawProp = function (ctx, a, f) {
  if (a.type === 'ball') { ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.spin || 0); ell(ctx, 0, 0, 46, 46); paint(ctx, '#ffffff', INK, wink()); ctx.fillStyle = INK; for (let i = 0; i < 5; i++) { const ag = i / 5 * Math.PI * 2; ctx.beginPath(); ctx.arc(Math.cos(ag) * 30, Math.sin(ag) * 30, 10, 0, 7); ctx.fill(); } ctx.beginPath(); ctx.arc(0, 0, 13, 0, 7); ctx.fill(); ctx.restore(); return; }
  if (a.type === 'goal') { ctx.save(); ctx.translate(a.x, a.y); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = wink(0.8); for (let i = 0; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(-350 + i * 70, -620); ctx.lineTo(-350 + i * 70, 0); ctx.stroke(); } for (let j = 0; j <= 8; j++) { ctx.beginPath(); ctx.moveTo(-350, -620 + j * 77); ctx.lineTo(350, -620 + j * 77); ctx.stroke(); } rr(ctx, -380, -650, 760, 40, 10); paint(ctx, '#ffffff', INK, wink()); for (const sx of [-1, 1]) { rr(ctx, sx * 360 - 20, -650, 40, 650, 10); paint(ctx, '#ffffff', INK, wink()); } ctx.restore(); return; }
  _drawProp13(ctx, a, f);
};
