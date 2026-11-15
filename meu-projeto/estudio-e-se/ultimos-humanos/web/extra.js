// extras for "pensamentos": teacher, bedroom/lunch/home sets, thought bubbles, icons
CAST.prof = { skin: '#c98e66', hair: 'long', hc: '#3a2314', band: '#ffd23f', pj: '#2a9d8f', pj2: '#8ee0d4', pat: 'none', pants: '#1d6f66', slip: '#2b1b1e', adult: true, dress: true };
POSES.raise = { L: [12, 6], R: [172, 4] };
POSES.raiseNod = { L: [45, -80], R: [172, 4] };

const _drawSet = drawSet;
drawSet = function (ctx, st, cam, f) {
  if (st.set === 'room') { drawWall(ctx, st, f); drawDecor(ctx, st, f); drawClock(ctx, st, f); drawWindow(ctx, st, cam, f); drawDoor(ctx, st); drawFloor(ctx, st); drawTV(ctx, st, f); drawCouch(ctx, st, f); return; }
  if (st.set === 'bedroom') {
    ctx.fillStyle = '#b8c0ff'; ctx.fillRect(-3000, -2600, 6000, 2600);
    ctx.fillStyle = '#c8cfff'; for (let x = -3000; x < 3000; x += 200) ctx.fillRect(x, -2600, 90, 2600);
    // window with neighbourhood
    const x0 = 380, y0 = -1500, w = 760, h = 700;
    rr(ctx, x0 - 30, y0 - 30, w + 60, h + 60, 12); paint(ctx, '#fffaf0', INK, wink());
    ctx.save(); rr(ctx, x0, y0, w, h, 4); ctx.clip();
    const sun = st.sun == null ? 1 : st.sun;
    const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, lerpCol('#1d2a6b', '#ffb36b', sun)); g.addColorStop(1, lerpCol('#3d3a8f', '#ffe3a8', sun));
    ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
    ell(ctx, x0 + w * 0.7, y0 + h * (0.9 - 0.45 * sun), 80, 80); paint(ctx, '#ffd23f', INK, wink(0.7));
    const houses = [[x0 + 20, 260, '#e76f51'], [x0 + 270, 320, '#f4a261'], [x0 + 520, 280, '#2a9d8f']];
    houses.forEach(([hx, hh, col], i) => {
      const top = y0 + h - hh;
      rr(ctx, hx, top, 220, hh + 20, 0); paint(ctx, col, INK, wink());
      ctx.beginPath(); ctx.moveTo(hx - 20, top); ctx.lineTo(hx + 110, top - 90); ctx.lineTo(hx + 240, top); ctx.closePath(); paint(ctx, '#7a3b2e', INK, wink());
      for (let j = 0; j < 2; j++) {
        const wx = hx + 30 + j * 100, wy = top + 50;
        rr(ctx, wx, wy, 70, 80, 4); paint(ctx, '#fff3b0', INK, wink(0.7));
        const pop = st.neighbors ? clamp(st.neighbors * 3 - (i * 2 + j) * 0.25) : 0;
        if (pop > 0) {
          ctx.save(); rr(ctx, wx, wy, 70, 80, 4); ctx.clip();
          const hy = wy + 80 - 60 * backOut(pop);
          ell(ctx, wx + 35, hy, 28, 30); paint(ctx, ['#f2caa6', '#8b5a3c', '#c98e66'][(i + j) % 3], INK, wink(0.6));
          ell(ctx, wx + 26, hy - 4, 4, 5); paint(ctx, INK); ell(ctx, wx + 44, hy - 4, 4, 5); paint(ctx, INK);
          ell(ctx, wx + 35, hy + 12, 5, 6); paint(ctx, INK);
          ctx.restore();
        }
      }
    });
    ctx.restore();
    rr(ctx, x0 + w / 2 - 10, y0, 20, h, 0); paint(ctx, '#fffaf0', INK, wink(0.7));
    // poster + shelf
    rr(ctx, -1050, -1450, 300, 400, 8); paint(ctx, '#ffd23f', INK, wink()); ctx.fillStyle = '#ef5350'; star(ctx, -900, -1250, 110, 45); ctx.stroke();
    // headboard
    rr(ctx, -560, -700, 760, 520, [60, 60, 0, 0]); paint(ctx, '#8d5a3b', INK, wink());
    rr(ctx, -520, -660, 680, 140, 40); paint(ctx, '#a06b48', INK, wink(0.6));
    // nightstand + alarm clock
    rr(ctx, 260, -330, 240, 330, 10); paint(ctx, '#a06b48', INK, wink());
    const ring = st.ring ? Math.sin(f * 2.2) * 0.15 : 0;
    ctx.save(); ctx.translate(380, -420); ctx.rotate(ring);
    ell(ctx, 0, 0, 80, 80); paint(ctx, '#ef5350', INK, wink()); ell(ctx, 0, 0, 60, 60); paint(ctx, '#fffaf0', INK, wink(0.6));
    ell(ctx, -55, -75, 28, 22); paint(ctx, '#ffd23f', INK, wink(0.6)); ell(ctx, 55, -75, 28, 22); paint(ctx, '#ffd23f', INK, wink(0.6));
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -40); ctx.moveTo(0, 0); ctx.lineTo(28, 10); paint(ctx, null, INK, wink(1.2));
    ctx.restore();
    tileFloor(ctx, '#c08552', 'rgba(80,40,20,.35)');
    return;
  }
  if (st.set === 'lunch') { _drawSet(ctx, Object.assign({}, st, { set: 'hall' }), cam, f); return; }
  _drawSet(ctx, st, cam, f);
};
function lerpCol(a, b, t) {
  const p = (c) => [1, 3, 5].map((i) => parseInt(c.substr(i, 2), 16));
  const A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(',')})`;
}

const _drawProp = drawProp;
drawProp = function (ctx, a, f) {
  if (a.type === 'blanket') {
    ctx.save(); ctx.translate(a.x, a.y);
    ctx.beginPath(); ctx.moveTo(-380, -250); ctx.quadraticCurveTo(-180, -300 + (a.lift || 0), 0, -270); ctx.quadraticCurveTo(200, -240, 380, -260); ctx.lineTo(400, 0); ctx.lineTo(-400, 0); ctx.closePath();
    paint(ctx, '#4cc9f0', INK, wink());
    ctx.save(); ctx.clip(); ctx.fillStyle = '#90e0ef'; for (let x = -400; x < 400; x += 100) ctx.fillRect(x, -320, 45, 330); ctx.restore();
    rr(ctx, -420, -20, 840, 70, 10); paint(ctx, '#8d5a3b', INK, wink());
    ctx.restore(); return;
  }
  if (a.type === 'table') {
    ctx.save(); ctx.translate(a.x, a.y);
    rr(ctx, -520, -250, 1040, 60, 14); paint(ctx, '#e9c46a', INK, wink());
    rr(ctx, -500, -195, 1000, 130, 8); paint(ctx, '#c9a227', INK, wink());
    for (const tx of a.trays || []) { rr(ctx, tx - 110, -290, 220, 50, 10); paint(ctx, '#a8dadc', INK, wink(0.7)); ell(ctx, tx - 40, -285, 34, 16); paint(ctx, '#ffd23f', INK, wink(0.5)); rr(ctx, tx + 20, -330, 50, 70, 8); paint(ctx, '#ffffff', INK, wink(0.5)); }
    for (const sx of [-1, 1]) { rr(ctx, sx * 440 - 14, -70, 28, 70, 6); paint(ctx, '#5c677d', INK, wink(0.7)); }
    ctx.restore(); return;
  }
  _drawProp(ctx, a, f);
};

// ---- icons for thought bubbles ----
function icon(ctx, kind, x, y, r) {
  ctx.save(); ctx.translate(x, y);
  const ink = wink(0.8);
  if (kind === 'pizza') {
    ctx.beginPath(); ctx.moveTo(-r, -r * 0.7); ctx.quadraticCurveTo(0, -r * 1.05, r, -r * 0.7); ctx.lineTo(0, r); ctx.closePath(); paint(ctx, '#ffd166', INK, ink);
    rr(ctx, -r * 1.05, -r * 0.95, r * 2.1, r * 0.3, r * 0.15); paint(ctx, '#d4a373', INK, ink);
    for (const [px, py] of [[-0.4, -0.3], [0.35, -0.25], [0, 0.25]]) { ell(ctx, px * r, py * r, r * 0.17, r * 0.17); paint(ctx, '#e63946', INK, ink * 0.7); }
  }
  if (kind === 'heart') { ctx.fillStyle = '#ff4d6d'; heart(ctx, 0, 0, r * 0.6); ctx.strokeStyle = INK; ctx.lineWidth = ink; ctx.stroke(); }
  if (kind === 'note') { ctx.fillStyle = '#3a0ca3'; ctx.font = `900 ${r * 2}px Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('♫', 0, 0); }
  if (kind === 'zzz') { ctx.fillStyle = '#3d85e0'; ctx.font = `900 ${r * 1.3}px Arial Black, Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('Zzz', 0, 0); }
  if (kind === 'book') { rr(ctx, -r, -r * 0.7, r * 2, r * 1.4, 6); paint(ctx, '#ffffff', INK, ink); ctx.beginPath(); ctx.moveTo(0, -r * 0.7); ctx.lineTo(0, r * 0.7); paint(ctx, null, INK, ink); ctx.strokeStyle = '#e63946'; ctx.lineWidth = ink * 2; ctx.beginPath(); ctx.moveTo(-r * 0.7, -r * 0.4); ctx.lineTo(r * 0.7, r * 0.4); ctx.moveTo(r * 0.7, -r * 0.4); ctx.lineTo(-r * 0.7, r * 0.4); ctx.stroke(); }
  if (kind === 'q') { ctx.fillStyle = '#3a0ca3'; ctx.font = `900 ${r * 1.8}px Arial Black, Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', 0, 0); }
  ctx.restore();
}
// thought bubble: {x,y,w,h,hx,hy (head top), text, icons:[[kind,dx,dy,r]], k, shake, col}
function thought(ctx, e, f) {
  const k = e.k == null ? 1 : e.k;
  if (k <= 0.01) return;
  ctx.save();
  const sh = e.shake ? Math.sin(f * 2.3) * e.shake : 0;
  // trailing puffs
  for (let i = 0; i < 3; i++) { const t = (i + 1) / 4; ell(ctx, lerp(e.hx, e.x, t) + sh, lerp(e.hy, e.y + e.h * 0.4, t), (10 + i * 8) * k, (10 + i * 8) * k); paint(ctx, '#ffffff', INK, wink()); }
  ctx.translate(e.x + sh, e.y); ctx.scale(k, k);
  const n = 10;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2, am = (a0 + a1) / 2;
    const p = (a) => [Math.cos(a) * e.w / 2, Math.sin(a) * e.h / 2];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    if (i === 0) ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(Math.cos(am) * e.w * 0.66, Math.sin(am) * e.h * 0.66, x1, y1);
  }
  ctx.closePath(); paint(ctx, e.col || '#ffffff', INK, wink(1.1));
  if (e.text) {
    const lines = e.text.split('\n');
    ctx.fillStyle = e.tcol || '#d62839'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const fs = e.fs || 60; ctx.font = `900 ${fs}px Arial Black, Arial`;
    lines.forEach((l, i) => ctx.fillText(l, 0, (i - (lines.length - 1) / 2) * fs * 1.1));
  }
  for (const [kind, dx, dy, r] of e.icons || []) icon(ctx, kind, dx, dy, r);
  ctx.restore();
}
function waves(ctx, e, f) {
  ctx.save(); ctx.strokeStyle = e.col || 'rgba(255,255,255,.9)'; ctx.lineWidth = wink(1.6);
  for (let i = 0; i < 3; i++) { const r = e.r + ((f * 6 + i * 40) % 120); ctx.globalAlpha = 1 - ((f * 6 + i * 40) % 120) / 120; ctx.beginPath(); ctx.arc(e.x, e.y, r, -Math.PI * 0.9, -Math.PI * 0.1); ctx.stroke(); }
  ctx.restore();
}
function bulb(ctx, e) {
  const k = e.k; if (k <= 0) return;
  ctx.save(); ctx.translate(e.x, e.y); ctx.scale(k, k);
  ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = wink(1.4); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 75, Math.sin(a) * 75); ctx.lineTo(Math.cos(a) * 105, Math.sin(a) * 105); ctx.stroke(); }
  ell(ctx, 0, -10, 55, 58); paint(ctx, '#fff3b0', INK, wink());
  rr(ctx, -26, 40, 52, 34, 6); paint(ctx, '#a0a4b8', INK, wink(0.8));
  ctx.restore();
}
const _drawFx = drawFx;
drawFx = function (ctx, fx, f) {
  _drawFx(ctx, (fx || []).filter((e) => !['thought', 'waves', 'bulb'].includes(e.type)), f);
  for (const e of fx || []) { if (e.type === 'waves') waves(ctx, e, f); if (e.type === 'bulb') bulb(ctx, e); }
  for (const e of fx || []) if (e.type === 'thought') thought(ctx, e, f);
};
