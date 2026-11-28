// extras for "preso no banheiro das meninas": girls' bathroom set, stall interior, toilet, splash, hearts
const _drawSet16 = drawSet;
drawSet = function (ctx, st, cam, f) {
  if (st.set === 'wc') {
    ctx.fillStyle = '#ffd6e5'; ctx.fillRect(-3000, -2600, 6000, 2600);
    ctx.strokeStyle = 'rgba(200,90,140,.35)'; ctx.lineWidth = wink(0.6);
    for (let y = -2600; y < 0; y += 110) { ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(3000, y); ctx.stroke(); }
    for (let x = -3000; x < 3000; x += 110) { ctx.beginPath(); ctx.moveTo(x, -2600); ctx.lineTo(x, 0); ctx.stroke(); }
    rr(ctx, -3000, -560, 6000, 26, 0); paint(ctx, '#ff8fab', INK, wink());
    // mirrors + sinks (left)
    for (const x of [-1700, -1250, -800]) {
      rr(ctx, x - 190, -1500, 380, 520, 30); paint(ctx, '#e8f6ff', INK, wink());
      ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.moveTo(x - 140, -1440); ctx.lineTo(x - 60, -1440); ctx.lineTo(x - 160, -1100); ctx.lineTo(x - 160, -1260); ctx.closePath(); ctx.fill();
      rr(ctx, x - 220, -760, 440, 90, 30); paint(ctx, '#ffffff', INK, wink());
      rr(ctx, x - 16, -860, 32, 110, 10); paint(ctx, '#c9d1e0', INK, wink(0.8)); rr(ctx, x - 16, -860, 90, 26, 10); paint(ctx, '#c9d1e0', INK, wink(0.8));
      rr(ctx, x - 40, -680, 80, 680, 8); paint(ctx, '#ffffff', INK, wink());
    }
    sign(ctx, 'MENINAS', -1250, -1800, 70, '#ffffff', '#ff5fa2');
    // stalls (right)
    for (let i = 0; i < 3; i++) {
      const x = -250 + i * 520;
      rr(ctx, x - 30, -1560, 40, 1480, 6); paint(ctx, '#c77dff', INK, wink());
      const open = (st.open || [])[i] || 0, w = 440 * Math.cos(open * 70 * D2R);
      rr(ctx, x + 10, -1500, 480, 1400, 0); paint(ctx, '#3a2550', null);
      rr(ctx, x + 10, -1500, w, 1400, 10); paint(ctx, i === 1 ? '#e0aaff' : '#d39bff', INK, wink());
      ell(ctx, x + w - 40, -800, 16, 16); paint(ctx, '#ffd23f', INK, wink(0.6));
      if (i === 1 && open < 0.1) { rr(ctx, x + w / 2 - 70, -1380, 140, 50, 12); paint(ctx, st.occupied ? '#ef233c' : '#52b788', INK, wink(0.6)); }
      if (i === 1 && st.feet != null && st.feet > 0) { const lift = (1 - st.feet) * 120; for (const dx of [-60, 60]) { ell(ctx, x + 250 + dx, -38 - lift, 60, 28); paint(ctx, '#ffffff', INK, wink()); } }
    }
    rr(ctx, 1310, -1560, 40, 1480, 6); paint(ctx, '#c77dff', INK, wink());
    tileFloor(ctx, '#f1f3f8', 'rgba(150,120,170,.35)');
    return;
  }
  if (st.set === 'stall') {
    ctx.fillStyle = '#ffe3ee'; ctx.fillRect(-3000, -2600, 6000, 2600);
    ctx.strokeStyle = 'rgba(200,90,140,.35)'; ctx.lineWidth = wink(0.6);
    for (let y = -2600; y < 0; y += 110) { ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(3000, y); ctx.stroke(); }
    for (let x = -3000; x < 3000; x += 110) { ctx.beginPath(); ctx.moveTo(x, -2600); ctx.lineTo(x, 0); ctx.stroke(); }
    rr(ctx, 380, -1250, 200, 230, 20); paint(ctx, '#ffffff', INK, wink()); ell(ctx, 480, -1135, 60, 60); paint(ctx, '#f1f3f8', INK, wink(0.7));
    tileFloor(ctx, '#f1f3f8', 'rgba(150,120,170,.35)');
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 760, -2600); ctx.lineTo(sx * 760, 0); ctx.lineTo(sx * 1400, 900); ctx.lineTo(sx * 3000, 900); ctx.lineTo(sx * 3000, -2600); ctx.closePath(); paint(ctx, '#c77dff', INK, wink()); }
    return;
  }
  _drawSet16(ctx, st, cam, f);
};
const _drawProp16 = drawProp;
drawProp = function (ctx, a, f) {
  if (a.type === 'toilet') {
    ctx.save(); ctx.translate(a.x, a.y); const k = a.s || 1; ctx.scale(k, k);
    rr(ctx, -150, -760, 300, 300, 30); paint(ctx, '#ffffff', INK, wink() / k); rr(ctx, -40, -720, 80, 24, 10); paint(ctx, '#c9d1e0', INK, wink(0.7) / k);
    ctx.beginPath(); ctx.moveTo(-110, -330); ctx.lineTo(110, -330); ctx.lineTo(80, 0); ctx.lineTo(-80, 0); ctx.closePath(); paint(ctx, '#ffffff', INK, wink() / k);
    ell(ctx, 0, -420, 260, 110); paint(ctx, '#ffffff', INK, wink() / k); ell(ctx, 0, -425, 190, 70); paint(ctx, a.splash ? '#9ad7ff' : '#cfeeff', INK, wink(0.7) / k);
    ctx.restore(); return;
  }
  _drawProp16(ctx, a, f);
};
const _drawFx16 = drawFx;
drawFx = function (ctx, fx, f) {
  _drawFx16(ctx, (fx || []).filter((e) => !['splash', 'hearts', 'heads'].includes(e.type)), f);
  for (const e of fx || []) {
    if (e.type === 'splash') { const t = e.t; if (t <= 0 || t >= 1) continue; for (let i = 0; i < 16; i++) { const a = -Math.PI * (0.1 + 0.8 * hash(i)), v = 500 + hash(i + 3) * 700; const x = e.x + Math.cos(a) * v * t, y = e.y + Math.sin(a) * v * t + 1400 * t * t; ell(ctx, x, y, 22 * (1 - t) + 6, 30 * (1 - t) + 8); paint(ctx, '#7cc8ff', INK, wink(0.7)); } }
    if (e.type === 'hearts') for (let i = 0; i < (e.n || 5); i++) { const t = ((f * 0.02 + i / (e.n || 5)) % 1); const x = e.x + Math.sin(i * 2.3 + f * 0.05) * 160, y = e.y - t * 380; ctx.save(); ctx.globalAlpha = Math.sin(t * Math.PI) * (e.k == null ? 1 : e.k); ctx.translate(x, y); ctx.scale(1 + i % 2 * 0.4, 1 + i % 2 * 0.4); ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-60, -10, -30, -55, 0, -25); ctx.bezierCurveTo(30, -55, 60, -10, 0, 30); paint(ctx, '#ff4d8d', INK, wink(0.8)); ctx.restore(); }
  }
};
