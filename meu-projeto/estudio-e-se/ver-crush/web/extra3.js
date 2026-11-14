// extras for "aprender": library set, magic tome, guitar, cake, rabbit, test paper, chalkboard text
const CJK = '"WenQuanYi Zen Hei", sans-serif';
POSES.guitar = { L: [40, -120], R: [30, -60] };
POSES.lift = { L: [150, -20], R: [150, -20] };
POSES.write = { L: [30, -100], R: [40, -90] };

const _drawProps3 = drawProps;
drawProps = function (ctx, c, a, J, ink, f) {
  _drawProps3(ctx, c, a, J, ink, f);
  const P = a.props || {};
  if (P.tome) {
    const T = P.tome, x = (J.L.h[0] + J.R.h[0]) / 2, y = (J.L.h[1] + J.R.h[1]) / 2 - 80, sc = T.size || 1;
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); if ((a.flip || 1) < 0) ctx.scale(-1, 1);
    if (T.glow) { const g = ctx.createRadialGradient(0, -40, 0, 0, -40, 420); g.addColorStop(0, `rgba(255,240,150,${0.85 * T.glow})`); g.addColorStop(1, 'rgba(255,240,150,0)'); ctx.fillStyle = g; ctx.fillRect(-420, -460, 840, 840); }
    const o = T.open || 0;
    if (o < 0.5) {
      const w = 260 * (1 - o * 1.2);
      rr(ctx, -w / 2 - 10, -170, w + 20, 300, 14); paint(ctx, T.col || '#7b2d5e', PLUM, ink);
      rr(ctx, -w / 2 + 14, -150, w - 28, 260, 8); paint(ctx, null, '#ffd23f', ink * 0.8);
      if (w > 120) {
        ctx.fillStyle = '#fff3b0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const lines = (T.title || '').split('\n');
        lines.forEach((l, i) => { ctx.font = `900 ${T.fs || 44}px ${T.cjk && i === 0 ? CJK : 'Arial Black, Arial'}`; ctx.fillText(l, 0, -40 + (i - (lines.length - 1) / 2) * (T.fs || 44) * 1.25); });
        if (T.icon) icon(ctx, T.icon, 0, 70, 40);
      }
    } else {
      ctx.beginPath(); ctx.moveTo(0, -150); ctx.lineTo(-300, -175); ctx.lineTo(-300, 140); ctx.lineTo(0, 165); ctx.lineTo(300, 140); ctx.lineTo(300, -175); ctx.closePath(); paint(ctx, '#fffaf0', PLUM, ink);
      ctx.beginPath(); ctx.moveTo(0, -150); ctx.lineTo(0, 165); paint(ctx, null, PLUM, ink);
      if (T.pageText) { ctx.fillStyle = '#d62839'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `900 120px ${CJK}`; ctx.fillText(T.pageText[0], -150, 0); ctx.fillText(T.pageText[1], 150, 0); }
      else { ctx.strokeStyle = 'rgba(60,40,80,.5)'; ctx.lineWidth = ink * 0.8; for (const sx of [-1, 1]) for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(sx * 40, -110 + i * 42); ctx.lineTo(sx * 260, -110 + i * 42); ctx.stroke(); } }
    }
    ctx.restore();
  }
  if (P.guitar) {
    const [hx, hy] = J.L.h;
    ctx.save(); ctx.translate(hx + 40, hy + 40); ctx.rotate(-0.6);
    rr(ctx, -20, -420, 40, 380, 8); paint(ctx, '#7a4a2a', PLUM, ink);
    rr(ctx, -34, -470, 68, 70, 12); paint(ctx, '#3a2314', PLUM, ink);
    ell(ctx, 0, 0, 120, 100); paint(ctx, '#e63946', PLUM, ink); ell(ctx, 0, -110, 90, 75); paint(ctx, '#e63946', PLUM, ink);
    ell(ctx, 0, -50, 30, 30); paint(ctx, '#1c1222');
    ctx.restore();
  }
  if (P.shades) {
    ctx.save(); ctx.translate(0, 0);
    rr(ctx, -150, -840, 130, 70, 20); paint(ctx, '#111', PLUM, ink); rr(ctx, 20, -840, 130, 70, 20); paint(ctx, '#111', PLUM, ink);
    ctx.beginPath(); ctx.moveTo(-20, -815); ctx.lineTo(20, -815); paint(ctx, null, '#111', ink * 1.5);
    ctx.restore();
  }
  if (P.chef) {
    rr(ctx, -150, -1060, 300, 90, 20); paint(ctx, '#ffffff', PLUM, ink);
    for (const [x, r] of [[-100, 80], [0, 100], [100, 80]]) { ell(ctx, x, -1120, r, r * 0.8); paint(ctx, '#ffffff', PLUM, ink); }
  }
};

const _drawSet3 = drawSet;
drawSet = function (ctx, st, cam, f) {
  if (st.set === 'library') {
    ctx.fillStyle = '#e9d8a6'; ctx.fillRect(-3000, -2600, 6000, 2600);
    const bc = ['#e63946', '#3a86ff', '#ffbe0b', '#8338ec', '#2a9d8f', '#fb5607', '#6a994e'];
    for (let s = -3; s <= 3; s++) {
      const x0 = s * 620 - 280;
      rr(ctx, x0, -1900, 560, 1900, 8); paint(ctx, '#8d5a3b', INK, wink());
      for (let r = 0; r < 5; r++) {
        const y = -1800 + r * 360;
        rr(ctx, x0 + 20, y + 300, 520, 26, 0); paint(ctx, '#6b3f26', INK, wink(0.7));
        let x = x0 + 30;
        for (let b = 0; x < x0 + 520; b++) { const w = 40 + hash(s * 50 + r * 7 + b) * 30, h = 200 + hash(b + r) * 90; if (x + w > x0 + 530) break; rr(ctx, x, y + 300 - h, w, h, 4); paint(ctx, bc[(b + r + s + 7) % bc.length], INK, wink(0.5)); x += w + 4; }
      }
    }
    sign(ctx, 'BIBLIOTECA', 0, -2050, 90, '#ffffff', '#3a0ca3', 50);
    tileFloor(ctx, '#c9a66b', 'rgba(80,50,20,.3)');
    return;
  }
  if (st.set === 'class' && st.board) {
    _drawSet3(ctx, st, cam, f);
    rr(ctx, -490, -1470, 980, 600, 8); paint(ctx, '#2f5d50', INK, wink());
    ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.font = '700 104px Comic Sans MS, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    st.board.split('\n').forEach((l, i, A) => ctx.fillText(l, 0, -1170 + (i - (A.length - 1) / 2) * 130));
    return;
  }
  _drawSet3(ctx, st, cam, f);
};

const _drawProp3 = drawProp;
drawProp = function (ctx, a, f) {
  if (a.type === 'cake') {
    ctx.save(); ctx.translate(a.x, a.y); const k = a.s || 1; ctx.scale(k, k);
    rr(ctx, -260, -60, 520, 70, 12); paint(ctx, '#e9c46a', INK, wink() / k);
    rr(ctx, -200, -260, 400, 200, 20); paint(ctx, '#ff8fab', INK, wink() / k);
    rr(ctx, -150, -420, 300, 170, 20); paint(ctx, '#ffc8dd', INK, wink() / k);
    for (let i = -2; i <= 2; i++) { ell(ctx, i * 70, -255, 26, 18); paint(ctx, '#ffffff', INK, wink(0.6) / k); }
    ell(ctx, 0, -450, 34, 34); paint(ctx, '#e63946', INK, wink(0.7) / k);
    if (a.medal) { ctx.beginPath(); ctx.moveTo(140, -380); ctx.lineTo(240, -300); paint(ctx, null, '#3a86ff', wink(2) / k); ell(ctx, 250, -290, 50, 50); paint(ctx, '#ffd23f', INK, wink() / k); ctx.fillStyle = '#7a4a2a'; ctx.font = '900 54px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('1º', 250, -288); }
    ctx.restore(); return;
  }
  if (a.type === 'rabbit') {
    const k = a.k || 0; if (k <= 0) return;
    ctx.save(); ctx.translate(a.x, a.y); ctx.scale(k * (a.s || 1), k * (a.s || 1));
    for (const sx of [-1, 1]) { ell(ctx, sx * 45, -330, 34, 110, sx * 0.15); paint(ctx, '#ffffff', PLUM, wink(0.8)); ell(ctx, sx * 45, -330, 16, 80, sx * 0.15); paint(ctx, '#ffb3c6'); }
    ell(ctx, 0, -170, 115, 105); paint(ctx, '#ffffff', PLUM, wink(0.8));
    for (const sx of [-1, 1]) { ell(ctx, sx * 40, -190, 14, 18); paint(ctx, '#1c1222'); }
    ell(ctx, 0, -150, 14, 10); paint(ctx, '#ff7b9c');
    ctx.restore(); return;
  }
  if (a.type === 'backpack') {
    ctx.save(); ctx.translate(a.x, a.y);
    rr(ctx, -150, -260, 300, 260, 60); paint(ctx, '#e63946', INK, wink());
    rr(ctx, -110, -130, 220, 100, 20); paint(ctx, '#c1121f', INK, wink(0.7));
    ell(ctx, 0, -262, 120, 30); paint(ctx, '#1c1222', INK, wink(0.7));
    ctx.restore(); return;
  }
  if (a.type === 'paper') {
    ctx.save(); ctx.translate(a.x, a.y); ctx.scale(a.s || 1, a.s || 1); ctx.rotate(a.rot || 0);
    rr(ctx, -260, -340, 520, 680, 10); paint(ctx, '#ffffff', INK, wink());
    ctx.fillStyle = '#3a0ca3'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.font = '900 46px Arial Black, Arial'; ctx.fillText('PROVA', -220, -280);
    const L = ['1) 2 + 2 =', '2) 5 × 3 =', '3) 10 − 4 ='], A = ['四', '十五', '六'];
    L.forEach((l, i) => { const y = -170 + i * 160; ctx.fillStyle = '#1c1222'; ctx.font = '700 46px Arial'; ctx.fillText(l, -220, y); if ((a.answers || 0) > i) { ctx.fillStyle = '#d62839'; ctx.font = `900 72px ${CJK}`; ctx.fillText(A[i], 60, y); } });
    ctx.restore(); return;
  }
  _drawProp3(ctx, a, f);
};
