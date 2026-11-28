// extras for the ADULT series: grown-up bolinha + date, restaurant set, building door at night, "legenda" captions, candle
Object.assign(CAST, {
  homem: { skin: '#F5F5F5', hair: 'none', hc: '#9a6a3a', pj: '#F2B705', pj2: '#ffd34d', pat: 'none', pants: '#1F4E9C', slip: '#3a2a20', hand: '#ffffff', bolinha: true, adult: true },
  ana: { skin: '#e8b38b', hair: 'long', hc: '#4a2418', pj: '#d62839', pj2: '#ff6b81', pat: 'none', pants: '#9d0208', slip: '#2b1b1e', adult: true, dress: true },
  garcom: { skin: '#c98e66', hair: 'cap', hc: '#2b1b1e', pj: '#ffffff', pj2: '#eeeeee', pat: 'none', pants: '#1c1222', slip: '#1c1222', adult: true, mustache: true },
});
const _drawSet18 = drawSet;
drawSet = function (ctx, st, cam, f) {
  if (st.set === 'rest') {
    ctx.fillStyle = '#6b2737'; ctx.fillRect(-3000, -2600, 6000, 2600);
    ctx.fillStyle = 'rgba(255,255,255,.05)'; for (let x = -3000; x < 3000; x += 160) ctx.fillRect(x, -2600, 70, 2600);
    rr(ctx, -3000, -700, 6000, 700, 0); paint(ctx, '#4a1622', INK, wink()); rr(ctx, -3000, -720, 6000, 30, 0); paint(ctx, '#c9a227', INK, wink(0.8));
    // window with the night city
    rr(ctx, -560, -2000, 1120, 900, 20); paint(ctx, '#3a1c22', INK, wink());
    ctx.save(); rr(ctx, -520, -1960, 1040, 820, 10); ctx.clip(); const g = ctx.createLinearGradient(0, -1960, 0, -1140); g.addColorStop(0, '#0d1b3e'); g.addColorStop(1, '#3a2a6e'); ctx.fillStyle = g; ctx.fillRect(-520, -1960, 1040, 820);
    for (let i = 0; i < 9; i++) { const bx = -520 + i * 120, bh = 200 + hash(i) * 400; ctx.fillStyle = '#16123a'; ctx.fillRect(bx, -1140 - bh, 110, bh); for (let w = 0; w < 10; w++) { if (hash(i * 9 + w) > 0.45) { ctx.fillStyle = '#ffd98a'; ctx.fillRect(bx + 15 + (w % 3) * 30, -1120 - bh + 30 + Math.floor(w / 3) * 50, 16, 22); } } }
    ell(ctx, 330, -1800, 60, 60); ctx.fillStyle = '#fff3c4'; ctx.fill(); ctx.restore();
    rr(ctx, -20, -1960, 40, 820, 0); paint(ctx, '#3a1c22', INK, wink(0.8));
    for (const x of [-1300, 1300]) { ctx.beginPath(); ctx.moveTo(x, -2600); ctx.lineTo(x, -1700); paint(ctx, null, INK, wink()); ctx.beginPath(); ctx.moveTo(x - 160, -1560); ctx.lineTo(x - 70, -1720); ctx.lineTo(x + 70, -1720); ctx.lineTo(x + 160, -1560); ctx.closePath(); paint(ctx, '#c9a227', INK, wink()); const gg = ctx.createRadialGradient(x, -1500, 0, x, -1500, 500); gg.addColorStop(0, 'rgba(255,210,120,.45)'); gg.addColorStop(1, 'rgba(255,210,120,0)'); ctx.fillStyle = gg; ctx.fillRect(x - 500, -2000, 1000, 1000); }
    for (const x of [-1900, 1900]) { rr(ctx, x - 90, -480, 180, 480, 20); paint(ctx, '#8a4b2a', INK, wink()); for (let i = 0; i < 7; i++) { ell(ctx, x + Math.cos(i) * 110, -620 - Math.sin(i * 1.3) * 160, 80, 120, i); paint(ctx, i % 2 ? '#2d6a4f' : '#40916c', INK, wink(0.8)); } }
    tileFloor(ctx, '#3a1c22', 'rgba(255,200,150,.12)');
    return;
  }
  if (st.set === 'porta') {
    const g = ctx.createLinearGradient(0, -2600, 0, 0); g.addColorStop(0, '#0b1230'); g.addColorStop(1, '#2a2a5e'); ctx.fillStyle = g; ctx.fillRect(-3000, -2600, 6000, 2600);
    for (let i = 0; i < 40; i++) { ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fillRect(-3000 + hash(i) * 6000, -2600 + hash(i + 7) * 800, 5, 5); }
    rr(ctx, -2200, -2200, 4400, 2200, 0); paint(ctx, '#8d4b3a', INK, wink());
    ctx.strokeStyle = 'rgba(40,10,10,.35)'; ctx.lineWidth = wink(0.6); for (let y = -2200; y < 0; y += 70) { ctx.beginPath(); ctx.moveTo(-2200, y); ctx.lineTo(2200, y); ctx.stroke(); for (let x = -2200 + ((y / 70) % 2) * 70; x < 2200; x += 140) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 70); ctx.stroke(); } }
    for (const x of [-1500, 1500]) { rr(ctx, x - 260, -1900, 520, 520, 10); paint(ctx, '#ffd98a', INK, wink()); rr(ctx, x - 10, -1900, 20, 520, 0); paint(ctx, '#3a1c22', null); }
    rr(ctx, -380, -1360, 760, 1360, [30, 30, 0, 0]); paint(ctx, '#3a1c22', INK, wink());
    rr(ctx, -340, -1320, 680, 1320, 0); paint(ctx, '#ffd98a', INK, wink());
    const open = st.door == null ? 0 : st.door, w = 680 * open;
    rr(ctx, -340, -1320, Math.max(4, w), 1320, 0); paint(ctx, '#5c2e1e', INK, wink()); if (w > 60) { ell(ctx, -340 + w - 50, -660, 18, 18); paint(ctx, '#c9a227', INK, wink(0.6)); }
    sign(ctx, '42', 0, -1460, 70, '#ffd98a', '#3a1c22');
    const gg = ctx.createRadialGradient(560, -1500, 0, 560, -1500, 700); gg.addColorStop(0, 'rgba(255,210,120,.5)'); gg.addColorStop(1, 'rgba(255,210,120,0)'); ctx.fillStyle = gg; ctx.fillRect(-140, -2200, 1400, 1400);
    rr(ctx, 520, -1600, 80, 140, 20); paint(ctx, '#ffe8a8', INK, wink());
    tileFloor(ctx, '#4a4a6a', 'rgba(255,255,255,.12)');
    return;
  }
  _drawSet18(ctx, st, cam, f);
};
const _drawProp18 = drawProp;
drawProp = function (ctx, a, f) {
  if (a.type === 'dinner') {
    ctx.save(); ctx.translate(a.x, a.y);
    rr(ctx, -640, -300, 1280, 70, 16); paint(ctx, '#ffffff', INK, wink());
    ctx.beginPath(); ctx.moveTo(-640, -232); ctx.lineTo(640, -232); ctx.lineTo(600, 40); ctx.lineTo(-600, 40); ctx.closePath(); paint(ctx, '#f1e3d3', INK, wink());
    for (const sx of [-1, 1]) { ell(ctx, sx * 300, -305, 130, 26); paint(ctx, '#ffffff', INK, wink(0.8)); if (a.food) { ell(ctx, sx * 300, -318, 70, 20); paint(ctx, '#e76f51', INK, wink(0.6)); } rr(ctx, sx * 470 - 16, -440, 32, 130, 10); paint(ctx, 'rgba(200,230,255,.6)', INK, wink(0.7)); rr(ctx, sx * 470 - 22, -400, 44, 60, 8); paint(ctx, '#9d0208', null); }
    rr(ctx, -22, -450, 44, 150, 6); paint(ctx, '#fff3c4', INK, wink(0.8));
    const fl = 1 + Math.sin(f * 0.6) * 0.15; ctx.beginPath(); ctx.moveTo(-16, -450); ctx.quadraticCurveTo(0, -520 * fl, 16, -450); ctx.closePath(); paint(ctx, '#ffba08', INK, wink(0.6));
    const gg = ctx.createRadialGradient(0, -480, 0, 0, -480, 420); gg.addColorStop(0, 'rgba(255,200,90,.35)'); gg.addColorStop(1, 'rgba(255,200,90,0)'); ctx.fillStyle = gg; ctx.fillRect(-420, -900, 840, 840);
    ctx.restore(); return;
  }
  if (a.type === 'chair') { ctx.save(); ctx.translate(a.x, a.y); ctx.scale(a.flip || 1, 1); rr(ctx, -150, -760, 40, 760, 10); paint(ctx, '#3a1c22', INK, wink()); rr(ctx, -150, -260, 300, 40, 10); paint(ctx, '#5c2e1e', INK, wink()); rr(ctx, 110, -230, 30, 230, 6); paint(ctx, '#3a1c22', INK, wink()); ctx.restore(); return; }
  _drawProp18(ctx, a, f);
};
// "LEGENDA": what the person really thinks, in a TV-subtitle box above their head
function legenda(ctx, e) {
  const k = e.k == null ? 1 : e.k; if (k <= 0.01) return;
  ctx.save(); ctx.translate(e.x, e.y); ctx.scale(k, k); ctx.rotate(e.rot || 0);
  const fs = e.fs || 54; ctx.font = `900 ${fs}px Arial Black, Arial`;
  const lines = e.text.split('\n'), w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 80, h = lines.length * fs * 1.2 + 70;
  rr(ctx, -w / 2, -h / 2, w, h, 18); paint(ctx, 'rgba(15,10,25,.92)', '#ffd23f', wink(1.2));
  rr(ctx, -w / 2 + 20, -h / 2 - 34, 230, 58, 12); paint(ctx, '#ffd23f', INK, wink(0.8));
  ctx.fillStyle = '#1c1222'; ctx.font = '900 34px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('LEGENDA', -w / 2 + 135, -h / 2 - 4);
  ctx.fillStyle = '#ffd23f'; ctx.font = `900 ${fs}px Arial Black, Arial`; lines.forEach((l, i) => ctx.fillText(l, 0, (i - (lines.length - 1) / 2) * fs * 1.2 + 14));
  ctx.restore();
}
const _drawFx18 = drawFx;
drawFx = function (ctx, fx, f) { _drawFx18(ctx, (fx || []).filter((e) => e.type !== 'legenda'), f); for (const e of fx || []) if (e.type === 'legenda') legenda(ctx, e); };
