// variação "aniversário da irmã": tiara de unicórnio (no lugar das unhas), glitter (no lugar das tranças), pai com o bolo na janela (no lugar do gato)
CAST.pai = { skin: '#c98e66', hair: 'none', hc: '#2b1b1e', pj: '#3a86ff', pj2: '#9cc3ff', pat: 'none', pants: '#264653', slip: '#3a2a20', adult: true };
function tiara(ctx, a, k) {
  const [hx, hy] = headPos(a), s = a.s || 0.5, top = hy - 300 * s;
  ctx.save(); ctx.translate(hx, top); ctx.rotate(a.tilt || 0); ctx.scale(s * k, s * k);
  ctx.beginPath(); ctx.ellipse(0, 40, 250, 70, 0, Math.PI, 0); ctx.lineWidth = 34; ctx.strokeStyle = '#ff5fa2'; ctx.stroke();
  for (const [x, c] of [[-150, '#ffd23f'], [150, '#9b5de5']]) { ctx.beginPath(); ctx.arc(x, 0, 40, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#3a2a5a'; ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-55, -10); ctx.lineTo(0, -230); ctx.lineTo(55, -10); ctx.closePath(); const g = ctx.createLinearGradient(0, -230, 0, 0); g.addColorStop(0, '#fff3b0'); g.addColorStop(1, '#ffd23f'); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = '#3a2a5a'; ctx.stroke();
  ctx.strokeStyle = '#e09f1f'; ctx.lineWidth = 7; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-50 + i * 10, -10 - i * 50); ctx.lineTo(50 - i * 10, -40 - i * 50); ctx.stroke(); }
  ctx.restore();
}
function glitter(ctx, a, k, f) {
  const [hx, hy] = headPos(a), s = a.s || 0.5, cols = ['#ff5fa2', '#ffd23f', '#4cc9f0', '#c77dff', '#ffffff'];
  const n = Math.floor(28 * k);
  for (let i = 0; i < n; i++) { const ang = hash(i) * 6.28, r = Math.sqrt(hash(i + 7)) * 230 * s; const x = hx + Math.cos(ang) * r * 1.1, y = hy + 40 * s + Math.sin(ang) * r * 0.8; const tw = 0.6 + 0.4 * Math.sin(f * 0.5 + i);
    ctx.fillStyle = cols[i % 5]; ctx.save(); ctx.translate(x, y); ctx.rotate(i); ctx.fillRect(-9 * s * 2 * tw, -9 * s * 2 * tw, 18 * s * 2 * tw, 18 * s * 2 * tw); ctx.restore(); }
}
const _drawKidA = drawKid;
drawKid = function (ctx, a, f) {
  const t = a.nails ? a.nails / 5 : 0, gl = a.braids || 0;
  _drawKidA(ctx, Object.assign({}, a, { nails: 0, braids: 0 }), f);
  if (gl > 0) glitter(ctx, a, gl, f);
  if (t > 0) tiara(ctx, a, backOut(Math.min(1, t)));
};
// gato na janela → pai com o bolo
function cakeFx(ctx, x, y, s, f) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(ctx, -260, -60, 520, 70, 14); paint(ctx, '#e9c46a', INK, wink() / s);
  rr(ctx, -200, -260, 400, 200, 20); paint(ctx, '#ff8fab', INK, wink() / s);
  rr(ctx, -150, -400, 300, 150, 20); paint(ctx, '#ffc8dd', INK, wink() / s);
  for (let i = -2; i <= 2; i++) { rr(ctx, i * 55 - 9, -480, 18, 80, 5); paint(ctx, ['#4cc9f0', '#ffd23f', '#c77dff'][(i + 3) % 3], INK, wink(0.5) / s);
    const fl = 1 + 0.15 * Math.sin(f * 0.8 + i); ctx.beginPath(); ctx.ellipse(i * 55, -505, 14, 26 * fl, 0, 0, Math.PI * 2); ctx.fillStyle = '#ffb703'; ctx.fill(); ctx.beginPath(); ctx.ellipse(i * 55, -500, 7, 14 * fl, 0, 0, Math.PI * 2); ctx.fillStyle = '#fff3b0'; ctx.fill(); }
  ctx.restore();
}
const _drawCatA = drawCat;
drawCat = function (ctx, a, f) {
  if (!a.dad) return _drawCatA(ctx, a, f);
  _drawKidA(ctx, { who: 'pai', x: a.x, y: a.y + 520, s: 0.62, expr: a.happy ? 'grin' : 'surprised', look: [0, 0], pose: 'hang', layer: 'front' }, f);
  cakeFx(ctx, a.x, a.y + 150, 0.42, f);
};
const _drawWindowA = drawWindow;
drawWindow = function (ctx, st, cam, f) {
  _drawWindowA(ctx, st, cam, f);
  if (st.knock) { const sh = Math.sin(f * 2.4) * 10; ctx.save(); ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#1c1222'; ctx.lineWidth = 12; ctx.font = '900 90px Arial Black, Arial'; ctx.textAlign = 'center';
    ['TOC', 'TOC', 'TOC'].forEach((t, i) => { if (f < 880 + i * 7) return; const x = -620 + sh + (i - 1) * 40, y = -1180 + i * 130; ctx.strokeText(t, x, y); ctx.fillText(t, x, y); }); ctx.restore(); }
};
// tempo: a narração nova tem outro ritmo; cada cena antiga é esticada até a palavra correspondente
const WARP = [[0, 0], [2.87, 3.19], [6.43, 6.98], [8.77, 9.40], [11.2, 11.97], [14.37, 15.80], [16.17, 17.97], [19.37, 21.13], [20.87, 22.69], [23.17, 25.09], [25.93, 27.82], [28.7, 30.74], [30.23, 32.73], [32.53, 35.09], [33.93, 37.46], [37.4, 41.4]];
function warp(fNew) { const t = fNew / 30; for (let i = 0; i < WARP.length - 1; i++) { const [o0, n0] = WARP[i], [o1, n1] = WARP[i + 1]; if (t <= n1 || i === WARP.length - 2) return (o0 + (o1 - o0) * Math.min(1, (t - n0) / (n1 - n0))) * 30; } return fNew; }
