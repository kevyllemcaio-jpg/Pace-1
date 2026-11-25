// criativo animado — celular com checklist, mesa de trabalho, papéis amassados, interrogações, botão de CTA
const _fxAd = drawFx;
const MINE = ['celular', 'mesa', 'papeis', 'interroga', 'xis', 'moedas'];
drawFx = function (ctx, fx, f) {
  _fxAd(ctx, (fx || []).filter((e) => !MINE.includes(e.type)), f);
  for (const e of fx || []) {
    if (!MINE.includes(e.type)) continue;
    ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); const k = e.s == null ? 1 : e.s; ctx.scale(k, k);
    if (e.type === 'celular') {
      rr(ctx, -330, -620, 660, 1240, 80); paint(ctx, '#1c1222', INK, wink()); rr(ctx, -295, -560, 590, 1120, 50); paint(ctx, '#f8f9ff', null);
      rr(ctx, -295, -560, 590, 200, [50, 50, 0, 0]); paint(ctx, '#7b2ff7', null); ctx.fillStyle = '#fff'; ctx.font = '900 58px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('MÉTODO', 0, -490); ctx.font = '900 40px Arial Black, Arial'; ctx.fillText('PASSO A PASSO', 0, -420);
      const items = e.items || []; items.forEach((it, i) => { const a = clamp((e.n || 0) - i); if (a <= 0) return; const y = -280 + i * 170; ctx.save(); ctx.globalAlpha = a; ctx.translate((1 - backOut(a)) * 200, 0);
        rr(ctx, -260, y - 65, 520, 130, 30); paint(ctx, '#eef1ff', '#d0d6ff', 4); ell(ctx, -190, y, 46, 46); paint(ctx, '#22c55e', null); ctx.strokeStyle = '#fff'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-212, y); ctx.lineTo(-195, y + 18); ctx.lineTo(-165, y - 18); ctx.stroke();
        ctx.fillStyle = '#1c1222'; ctx.font = '900 40px Arial Black, Arial'; ctx.textAlign = 'left'; const ls = it.split('\n'); ls.forEach((l, j) => ctx.fillText(l, -120, y + (j - (ls.length - 1) / 2) * 46)); ctx.restore(); });
      rr(ctx, -70, 520, 140, 14, 7); paint(ctx, '#444', null);
    }
    if (e.type === 'mesa') { rr(ctx, -700, -40, 1400, 70, 10); paint(ctx, '#a0703a', INK, wink()); for (const x of [-640, 600]) { rr(ctx, x, 30, 40, 380, 6); paint(ctx, '#7a5228', INK, wink()); }
      rr(ctx, -330, -460, 520, 340, 20); paint(ctx, '#2b2d42', INK, wink()); rr(ctx, -300, -430, 460, 280, 10); paint(ctx, '#4cc9f0', null); ctx.fillStyle = '#fff'; for (let i = 0; i < 5; i++) ctx.fillRect(-270, -400 + i * 50, 200 + ((i * 97 + Math.floor(f / 6) * 31) % 180), 18); rr(ctx, -400, -120, 660, 50, 10); paint(ctx, '#adb5bd', INK, wink());
      for (let i = 0; i < (e.pilha || 0); i++) { rr(ctx, 300, -80 - i * 34, 280, 30, 4); paint(ctx, i % 2 ? '#fff' : '#f1f3f5', INK, wink(0.5)); }
      ell(ctx, 520, -560, 120, 120); paint(ctx, '#fff', INK, wink()); ctx.strokeStyle = INK; ctx.lineWidth = 12; ctx.lineCap = 'round'; const a1 = f * 0.4, a2 = f * 0.033; ctx.beginPath(); ctx.moveTo(520, -560); ctx.lineTo(520 + Math.sin(a1) * 90, -560 - Math.cos(a1) * 90); ctx.moveTo(520, -560); ctx.lineTo(520 + Math.sin(a2) * 60, -560 - Math.cos(a2) * 60); ctx.stroke(); }
    if (e.type === 'papeis') { for (let i = 0; i < (e.n || 6); i++) { const x = -500 + i * 190 + Math.sin(i * 3) * 60, y = 330 + (i % 2) * 60; ell(ctx, x, y, 70, 60); paint(ctx, '#f8f9fa', INK, wink(0.7)); ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 40, y - 10); ctx.lineTo(x + 10, y + 20); ctx.lineTo(x + 40, y - 20); ctx.stroke(); } }
    if (e.type === 'interroga') { for (let i = 0; i < 6; i++) { const t = f * 0.05 + i; ctx.save(); ctx.translate(Math.cos(t) * 360, -Math.abs(Math.sin(t * 0.8)) * 120 - i * 40); ctx.rotate(Math.sin(t) * 0.3); ctx.font = '900 150px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText('?', 0, 0); ctx.fillStyle = ['#ffd23f', '#ff5fa2', '#4cc9f0'][i % 3]; ctx.fillText('?', 0, 0); ctx.restore(); } }
    if (e.type === 'xis') { const a = e.k || 0; if (a > 0) { ctx.save(); ctx.scale(backOut(a), backOut(a)); ctx.strokeStyle = '#ef233c'; ctx.lineWidth = 60; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-160, -160); ctx.lineTo(160, 160); ctx.moveTo(160, -160); ctx.lineTo(-160, 160); ctx.stroke(); ctx.restore(); } }
    if (e.type === 'moedas') { for (let i = 0; i < 9; i++) { const t = (f * 0.012 + hash(i)) % 1; const x = (hash(i + 3) - 0.5) * 1400, y = -t * 1400; ctx.save(); ctx.translate(x, y); ctx.scale(Math.cos(f * 0.1 + i), 1); ell(ctx, 0, 0, 70, 70); paint(ctx, '#ffd23f', INK, wink()); ctx.fillStyle = '#c99700'; ctx.font = '900 80px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$', 0, 6); ctx.restore(); } }
    ctx.restore();
  }
};
const _scrAd = drawScreen;
drawScreen = function (g, items, f) {
  _scrAd(g, items.filter((i) => i.type !== 'cta' && i.type !== 'dor'), f);
  for (const it of items) {
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (it.type === 'dor') { const k = it.k; if (k <= 0) continue; g.save(); g.translate(W / 2, it.y || 330); g.scale(backOut(k), backOut(k)); let fs = 64; g.font = `900 ${fs}px Arial Black, Arial`; while (g.measureText(it.text).width > W - 260 && fs > 34) { fs -= 2; g.font = `900 ${fs}px Arial Black, Arial`; } g.textAlign = 'center'; g.textBaseline = 'middle'; const w = g.measureText(it.text).width + 150; g.fillStyle = 'rgba(20,10,40,.9)'; g.beginPath(); g.roundRect(-w / 2, -70, w, 140, 30); g.fill(); g.lineWidth = 8; g.strokeStyle = '#ef233c'; g.stroke(); g.fillStyle = '#ef233c'; g.fillText('✕', -w / 2 + 60, 4); g.fillStyle = '#fff'; g.fillText(it.text, 30, 4); g.restore(); }
    if (it.type === 'cta') { const k = it.k; if (k <= 0) continue; const p = 1 + 0.05 * Math.sin(f * 0.35); g.save(); g.translate(W / 2, it.y || 1420); g.scale(backOut(k) * p, backOut(k) * p);
      g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.roundRect(-420, -100 + 14, 840, 200, 100); g.fill(); const gr = g.createLinearGradient(0, -100, 0, 100); gr.addColorStop(0, '#4ade80'); gr.addColorStop(1, '#16a34a'); g.fillStyle = gr; g.beginPath(); g.roundRect(-420, -100, 840, 200, 100); g.fill(); g.lineWidth = 10; g.strokeStyle = '#fff'; g.stroke();
      g.font = '900 72px Arial Black, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText(it.text || 'QUERO COMEÇAR', 0, 6);
      const sh = (f * 0.03) % 1.6 - 0.3; g.save(); g.beginPath(); g.roundRect(-420, -100, 840, 200, 100); g.clip(); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(-420 + sh * 840, -100); g.lineTo(-340 + sh * 840, -100); g.lineTo(-420 + sh * 840, 100); g.lineTo(-500 + sh * 840, 100); g.fill(); g.restore();
      g.restore(); g.save(); g.translate(W / 2 + 300, (it.y || 1420) + 130 + 20 * Math.sin(f * 0.3)); g.font = '150px NotoColorEmoji, sans-serif'; g.textAlign = 'center'; g.fillText('👆', 0, 0); g.restore();
      if (it.sub) { g.font = '900 54px Arial Black, Arial'; g.textAlign = 'center'; g.lineWidth = 12; g.strokeStyle = '#1c1222'; g.strokeText(it.sub, W / 2, (it.y || 1420) - 170); g.fillStyle = '#ffd23f'; g.fillText(it.sub, W / 2, (it.y || 1420) - 170); } }
  }
};
