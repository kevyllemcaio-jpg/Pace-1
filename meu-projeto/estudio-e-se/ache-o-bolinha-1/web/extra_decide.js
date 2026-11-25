// VOCÊ DECIDE #1 — carteira, foto, bilhete, relógio e cartões de escolha
CAST.bia = Object.assign({}, CAST.bia || {}, { skin: '#e8b38b', hair: 'long', hc: '#4a2418', band: '#ff5fa2', pj: '#ff7eb6', pj2: '#ffd0e4', pat: 'none', pants: '#6a3cb4', slip: '#ffffff' });
const _fxD = drawFx;
drawFx = function (ctx, fx, f) {
  _fxD(ctx, (fx || []).filter((e) => !['carteira', 'foto', 'bilhete', 'nota'].includes(e.type)), f);
  for (const e of fx || []) {
    ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); const k = e.s || 1; ctx.scale(k, k);
    if (e.type === 'carteira') { rr(ctx, -170, -110, 340, 220, 34); paint(ctx, '#ff8fc8', INK, wink()); rr(ctx, -170, -110, 340, 90, [34, 34, 0, 0]); paint(ctx, '#ff5fa2', INK, wink()); ell(ctx, 120, -40, 26, 26); paint(ctx, '#ffd23f', INK, wink(0.7)); for (let i = 0; i < 3; i++) { ell(ctx, -90 + i * 50, 50, 10, 10); ctx.fillStyle = '#fff'; ctx.fill(); } }
    if (e.type === 'nota') { for (let i = 0; i < (e.n || 5); i++) { ctx.save(); ctx.translate(-120 + i * 60, -i * 18); ctx.rotate(-0.2 + i * 0.1); rr(ctx, -150, -70, 300, 140, 10); paint(ctx, '#8fd18a', INK, wink(0.7)); ctx.font = '900 64px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#2d6a4f'; ctx.fillText('R$100', 0, 4); ctx.restore(); } }
    if (e.type === 'foto') { rr(ctx, -260, -330, 520, 660, 14); paint(ctx, '#ffffff', INK, wink()); rr(ctx, -220, -290, 440, 500, 6); paint(ctx, '#ffd6e8', null); ctx.save(); ctx.beginPath(); ctx.rect(-220, -290, 440, 500); ctx.clip(); drawKid(ctx, { who: 'bia', x: 0, y: 560, s: 0.62, expr: 'happy', pose: 'wave', look: [0, 0] }, f); ctx.restore(); for (let i = 0; i < 3; i++) { ell(ctx, -150 + i * 150, 270, 18, 16); paint(ctx, '#ff5fa2'); } }
    if (e.type === 'bilhete') { rr(ctx, -380, -300, 760, 600, 10); paint(ctx, '#fffbe6', INK, wink()); ctx.strokeStyle = 'rgba(80,140,220,.35)'; ctx.lineWidth = 4; for (let y = -220; y < 280; y += 70) { ctx.beginPath(); ctx.moveTo(-350, y); ctx.lineTo(350, y); ctx.stroke(); }
      ctx.fillStyle = '#c2185b'; ctx.font = 'italic 700 54px Comic Sans MS, Arial'; ctx.textAlign = 'left'; const lines = (e.text || '').split('\n'); const n = Math.floor((e.k == null ? 1 : e.k) * (e.text || '').length); let c = 0; lines.forEach((ln, i) => { const show = ln.slice(0, Math.max(0, n - c)); c += ln.length; ctx.fillText(show, -330, -230 + i * 70); });
      if (e.heart) { ctx.font = '90px NotoColorEmoji, sans-serif'; ctx.fillText('💗', 230, 230); } }
    ctx.restore();
  }
};
const _scrD = drawScreen;
drawScreen = function (g, items, f) {
  _scrD(g, items.filter((i) => i.type !== 'relogio' && i.type !== 'escolha'), f);
  for (const it of items) {
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (it.type === 'relogio') { const k = it.k; if (k <= 0) continue; g.save(); g.translate(W / 2, 330); g.scale(k, k); g.beginPath(); g.arc(0, 0, 150, 0, 6.3); g.fillStyle = 'rgba(20,10,40,.9)'; g.fill(); g.lineWidth = 16; g.strokeStyle = '#ff4d6d'; g.beginPath(); g.arc(0, 0, 150, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (it.p || 0)); g.stroke();
      g.font = '900 170px Arial Black, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText(String(it.n), 0, 10); g.restore(); }
    if (it.type === 'escolha') {
      for (const [i, lt, txt, col] of [[0, 'A', it.a, '#3a86ff'], [1, 'B', it.b, '#ff5fa2']]) {
        const k = backOut(clamp(it.k - i * 0.35)); if (k <= 0) continue; const y = 520 + i * 470;
        g.save(); g.translate(W / 2 + (1 - k) * (i ? 900 : -900), y); g.rotate(i ? 0.02 : -0.02); if (it.hl === lt) g.scale(1.05, 1.05);
        g.fillStyle = 'rgba(20,10,40,.92)'; g.beginPath(); g.roundRect(-470, -190, 940, 380, 40); g.fill(); g.lineWidth = 12; g.strokeStyle = col; g.stroke();
        g.beginPath(); g.arc(-350, 0, 95, 0, 6.3); g.fillStyle = col; g.fill(); g.font = '900 130px Arial Black, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText(lt, -350, 8);
        g.textAlign = 'left'; let fs = 62; g.font = `900 ${fs}px Arial Black, Arial`; const ls = txt.split('\n'); while (Math.max(...ls.map((l) => g.measureText(l).width)) > 640 && fs > 36) { fs -= 2; g.font = `900 ${fs}px Arial Black, Arial`; }
        ls.forEach((l, j) => g.fillText(l, -220, (j - (ls.length - 1) / 2) * fs * 1.2)); g.restore();
      }
    }
  }
};
