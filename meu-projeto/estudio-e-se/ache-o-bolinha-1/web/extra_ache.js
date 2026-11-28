// ACHE O BOLINHA — multidões, holofote de revelação, placar
CAST.boycap = Object.assign({}, CAST.boy, { hair: 'cap', hc: '#e63946' });
CAST.boyr = Object.assign({}, CAST.boy, { slip: '#e63946' });
// sósias de distração: pele bem clara, cabelo claro ou boné branco, roupa amarela
CAST.pal1 = { skin: '#f4efe8', hair: 'bob', hc: '#f3e2b0', pj: '#F2B705', pj2: '#ffd34d', pat: 'none', pants: '#1F4E9C', slip: '#ffffff' };
CAST.pal2 = { skin: '#f6f1ea', hair: 'cap', hc: '#f4f4f4', pj: '#F2B705', pj2: '#ffd34d', pat: 'none', pants: '#2b3a67', slip: '#ffffff' };
CAST.pal3 = { skin: '#f2ebe2', hair: 'curly', hc: '#efe0bd', pj: '#e9b10a', pj2: '#ffd34d', pat: 'none', pants: '#1F4E9C', slip: '#ffffff' };
CAST.pal4 = { skin: '#f5f0ea', hair: 'none', hc: '#ffffff', pj: '#ffd23f', pj2: '#fff3b0', pat: 'none', pants: '#3a2a55', slip: '#ffffff', glasses: true };
CAST.pal5 = { skin: '#f7f2ec', hair: 'buns', hc: '#f6e7c1', band: '#ffd23f', pj: '#F2B705', pj2: '#ffd34d', pat: 'none', pants: '#1F4E9C', slip: '#ffffff' };
const _fxA = drawFx;
drawFx = function (ctx, fx, f) {
  _fxA(ctx, (fx || []).filter((e) => e.type !== 'spot' && e.type !== 'seta'), f);
  for (const e of fx || []) {
    if (e.type === 'spot') { const k = e.k; if (k <= 0) continue; const r = lerp(2600, e.r, sstep(k)); ctx.save(); ctx.beginPath(); ctx.rect(-8000, -8000, 16000, 16000); ctx.arc(e.x, e.y, r, 0, Math.PI * 2, true); ctx.fillStyle = `rgba(10,5,20,${0.78 * clamp(k * 2)})`; ctx.fill('evenodd'); ctx.beginPath(); ctx.arc(e.x, e.y, r, 0, 6.3); ctx.lineWidth = wink(2.2); ctx.strokeStyle = '#ffd23f'; ctx.stroke(); ctx.restore(); }
    if (e.type === 'seta') { const k = e.k; if (k <= 0) continue; ctx.save(); ctx.translate(e.x, e.y - 40 * Math.abs(Math.sin(f * 0.25))); ctx.scale(k, k); ctx.beginPath(); ctx.moveTo(-90, -260); ctx.lineTo(90, -260); ctx.lineTo(90, -120); ctx.lineTo(170, -120); ctx.lineTo(0, 40); ctx.lineTo(-170, -120); ctx.lineTo(-90, -120); ctx.closePath(); paint(ctx, '#ffd23f', INK, wink(1.4)); ctx.restore(); }
  }
};
