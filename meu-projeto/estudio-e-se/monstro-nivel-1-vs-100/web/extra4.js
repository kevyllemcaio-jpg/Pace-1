// extras for "dinheiro infinito": yard set + coin pool, wallet, money fx, candy, RC car, ice-cream cart, crown, chicken
POSES.wallet = { L: [30, -100], R: [30, -100] };
POSES.remote = { L: [25, -110], R: [25, -110] };
function bill(ctx, x, y, rot, s, gray) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(ctx, -70, -36, 140, 72, 6); paint(ctx, gray ? '#b8c4b0' : '#7bd389', INK, wink(0.7) / s);
  ell(ctx, 0, 0, 22, 22); paint(ctx, gray ? '#9aa592' : '#4caf50', INK, wink(0.5) / s);
  ctx.fillStyle = gray ? '#6b7563' : '#2d6a4f'; ctx.font = '900 30px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$', 0, 1);
  ctx.restore();
}
function coin(ctx, x, y, r) { ell(ctx, x, y, r, r * 0.8); paint(ctx, '#ffd23f', INK, wink(0.6)); ell(ctx, x - r * 0.25, y - r * 0.25, r * 0.3, r * 0.2); ctx.fillStyle = '#fff3b0'; ctx.fill(); }

const _drawProps4 = drawProps;
drawProps = function (ctx, c, a, J, ink, f) {
  _drawProps4(ctx, c, a, J, ink, f);
  const P = a.props || {};
  if (P.wallet) {
    const x = (J.L.h[0] + J.R.h[0]) / 2, y = (J.L.h[1] + J.R.h[1]) / 2 - 50, o = P.wallet.open || 0;
    ctx.save(); ctx.translate(x, y);
    rr(ctx, -150, -60, 300, 140, 20); paint(ctx, '#6b3f26', PLUM, ink);
    if (o > 0) { ctx.beginPath(); ctx.moveTo(-150, -60); ctx.lineTo(150, -60); ctx.lineTo(150 - 20 * o, -60 - 110 * o); ctx.lineTo(-150 + 20 * o, -60 - 110 * o); ctx.closePath(); paint(ctx, '#8d5a3b', PLUM, ink); }
    ctx.setLineDash([ink * 2, ink * 2]); rr(ctx, -130, -40, 260, 100, 14); paint(ctx, null, '#d9a441', ink * 0.6); ctx.setLineDash([]);
    ctx.restore();
  }
  if (P.candy) {
    const x = (J.L.h[0] + J.R.h[0]) / 2, y = (J.L.h[1] + J.R.h[1]) / 2 - 20, n = Math.floor(P.candy);
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / 5), px = x + ((i % 5) - 2) * 70 + (row % 2) * 30, py = y - row * 55;
      ctx.save(); ctx.translate(px, py); ctx.rotate((hash(i) - 0.5) * 0.8);
      if (i % 2) { ell(ctx, 0, 0, 34, 34); paint(ctx, ['#ff5fa2', '#4cc9f0', '#ffd23f'][i % 3], PLUM, ink); ctx.beginPath(); ctx.moveTo(0, 34); ctx.lineTo(0, 110); paint(ctx, null, '#fff', ink * 2); }
      else { rr(ctx, -50, -22, 100, 44, 10); paint(ctx, ['#e63946', '#8338ec', '#2a9d8f'][i % 3], PLUM, ink); }
      ctx.restore();
    }
  }
  if (P.crown) {
    ctx.beginPath(); ctx.moveTo(-150, -990); ctx.lineTo(-170, -1150); ctx.lineTo(-80, -1060); ctx.lineTo(0, -1170); ctx.lineTo(80, -1060); ctx.lineTo(170, -1150); ctx.lineTo(150, -990); ctx.closePath(); paint(ctx, '#ffd23f', PLUM, ink);
    for (const x of [-80, 0, 80]) { ell(ctx, x, -1020, 18, 18); paint(ctx, '#e63946', PLUM, ink * 0.6); }
  }
};

const _drawSet4 = drawSet;
drawSet = function (ctx, st, cam, f) {
  if (st.set === 'yard') {
    const g = ctx.createLinearGradient(0, -2600, 0, 0); g.addColorStop(0, '#5ec2ff'); g.addColorStop(1, '#d6f0ff'); ctx.fillStyle = g; ctx.fillRect(-4000, -2600, 8000, 2700);
    for (let i = 0; i < 4; i++) { const cx = -2000 + i * 1300 + (f * 0.6) % 1300, cy = -2000 + (i % 2) * 220; for (const [dx, r] of [[-90, 90], [0, 120], [100, 85]]) { ell(ctx, cx + dx, cy, r, r * 0.75); paint(ctx, '#ffffff'); } }
    // our house (left) + neighbour house (right)
    rr(ctx, -2600, -1500, 1500, 1500, 0); paint(ctx, '#ffb4a2', INK, wink());
    ctx.beginPath(); ctx.moveTo(-2700, -1500); ctx.lineTo(-1850, -2000); ctx.lineTo(-1000, -1500); ctx.closePath(); paint(ctx, '#9d4b3b', INK, wink());
    rr(ctx, -1700, -1200, 300, 300, 8); paint(ctx, '#e0f4ff', INK, wink());
    rr(ctx, 1300, -1500, 1500, 1500, 0); paint(ctx, '#a8dadc', INK, wink());
    ctx.beginPath(); ctx.moveTo(1200, -1500); ctx.lineTo(2050, -2000); ctx.lineTo(2900, -1500); ctx.closePath(); paint(ctx, '#3d5a80', INK, wink());
    rr(ctx, 1500, -1200, 300, 300, 8); paint(ctx, '#e0f4ff', INK, wink());
    // fence
    for (let x = -1100; x < 1400; x += 110) { ctx.beginPath(); ctx.moveTo(x, -480); ctx.lineTo(x + 45, -540); ctx.lineTo(x + 90, -480); ctx.lineTo(x + 90, 0); ctx.lineTo(x, 0); ctx.closePath(); paint(ctx, '#fffaf0', INK, wink(0.8)); }
    rr(ctx, -1100, -380, 2500, 34, 0); paint(ctx, '#f6ead2', INK, wink(0.6));
    ctx.fillStyle = '#7bc96f'; ctx.fillRect(-4000, 0, 8000, 3000);
    ctx.strokeStyle = 'rgba(40,100,40,.35)'; ctx.lineWidth = wink(0.8); for (let i = 0; i < 160; i++) { const x = -2500 + hash(i) * 5000, y = 40 + hash(i + 9) * 1500; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 10, y - 30); ctx.stroke(); }
    if (st.pool) {
      ell(ctx, 0, 450, 820, 230); paint(ctx, '#bde0fe', INK, wink(1.4));
      ctx.save(); ell(ctx, 0, 455, 780, 205); ctx.clip();
      for (let i = 0; i < 220; i++) coin(ctx, -800 + hash(i) * 1600, 260 + hash(i + 50) * 400, 34);
      ctx.restore();
      for (let i = 0; i < 6; i++) { const t = (f * 0.05 + i * 0.17) % 1; ctx.save(); ctx.globalAlpha = Math.sin(t * Math.PI); ctx.fillStyle = '#fff59d'; star(ctx, -600 + i * 240, 400 + (i % 2) * 80, 26, 8); ctx.restore(); }
      // diving board
      rr(ctx, -1100, 120, 420, 60, 10); paint(ctx, '#3a86ff', INK, wink()); rr(ctx, -1080, 180, 60, 200, 6); paint(ctx, '#adb5bd', INK, wink());
    }
    return;
  }
  if (st.set === 'cantina') {
    _drawSet4(ctx, Object.assign({}, st, { set: 'hall' }), cam, f);
    sign(ctx, 'CANTINA', 0, -1700, 90, '#ffffff', '#e63946', 50);
    return;
  }
  _drawSet4(ctx, st, cam, f);
};

const _drawProp4 = drawProp;
drawProp = function (ctx, a, f) {
  const k = a.s || 1;
  if (a.type === 'counter') {
    ctx.save(); ctx.translate(a.x, a.y);
    rr(ctx, -650, -620, 1300, 40, 8); paint(ctx, '#f4a261', INK, wink());
    rr(ctx, -620, -580, 1240, 580, 10); paint(ctx, '#e76f51', INK, wink());
    for (let i = 0; i < 6; i++) { const x = -500 + i * 200, full = a.left == null ? 1 : clamp(a.left * 6 - i); rr(ctx, x - 70, -800, 140, 180, 30); paint(ctx, 'rgba(220,240,255,.7)', INK, wink(0.8)); if (full > 0.1) for (let j = 0; j < 6; j++) { ell(ctx, x - 40 + (j % 3) * 40, -660 - Math.floor(j / 3) * 45, 22, 22); paint(ctx, ['#ff5fa2', '#ffd23f', '#4cc9f0'][(i + j) % 3], INK, wink(0.5)); } rr(ctx, x - 50, -830, 100, 34, 10); paint(ctx, '#e63946', INK, wink(0.6)); }
    ctx.restore(); return;
  }
  if (a.type === 'rccar') {
    ctx.save(); ctx.translate(a.x, a.y); ctx.scale(k, k);
    rr(ctx, -420, -260, 840, 190, 60); paint(ctx, '#e63946', INK, wink() / k);
    ctx.beginPath(); ctx.moveTo(-250, -250); ctx.lineTo(-170, -420); ctx.lineTo(180, -420); ctx.lineTo(280, -250); ctx.closePath(); paint(ctx, '#e63946', INK, wink() / k);
    ctx.beginPath(); ctx.moveTo(-200, -260); ctx.lineTo(-145, -385); ctx.lineTo(-10, -385); ctx.lineTo(-10, -260); ctx.closePath(); paint(ctx, '#bde0fe', INK, wink(0.7) / k);
    ctx.beginPath(); ctx.moveTo(30, -260); ctx.lineTo(30, -385); ctx.lineTo(160, -385); ctx.lineTo(230, -260); ctx.closePath(); paint(ctx, '#bde0fe', INK, wink(0.7) / k);
    ctx.beginPath(); ctx.moveTo(300, -420); ctx.lineTo(330, -620); paint(ctx, null, INK, wink(1.5) / k); ell(ctx, 330, -630, 16, 16); paint(ctx, '#ffd23f', INK, wink(0.5) / k);
    for (const wx of [-260, 260]) { ell(ctx, wx, -60, 95, 95); paint(ctx, '#1c1222', INK, wink() / k); ell(ctx, wx, -60, 40, 40); paint(ctx, '#adb5bd', INK, wink(0.6) / k); const r = a.spin || 0; ctx.beginPath(); ctx.moveTo(wx + Math.cos(r) * 40, -60 + Math.sin(r) * 40); ctx.lineTo(wx - Math.cos(r) * 40, -60 - Math.sin(r) * 40); paint(ctx, null, INK, wink(0.8) / k); }
    ctx.fillStyle = '#ffd23f'; ctx.font = '900 70px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('RC', 0, -165);
    ctx.restore(); return;
  }
  if (a.type === 'icecart') {
    ctx.save(); ctx.translate(a.x, a.y);
    ctx.beginPath(); ctx.moveTo(-40, -520); ctx.lineTo(-40, -1100); paint(ctx, null, INK, wink(1.2));
    ctx.beginPath(); ctx.moveTo(-340, -1080); ctx.quadraticCurveTo(-40, -1300, 260, -1080); ctx.closePath(); paint(ctx, '#ff8fab', INK, wink());
    rr(ctx, -300, -520, 520, 420, 30); paint(ctx, '#fffaf0', INK, wink());
    for (let i = 0; i < 3; i++) { ell(ctx, -180 + i * 130, -560, 50, 46); paint(ctx, ['#ffc8dd', '#caffbf', '#fff3b0'][i], INK, wink(0.7)); }
    for (const wx of [-200, 120]) { ell(ctx, wx, -60, 70, 70); paint(ctx, '#3a3f58', INK, wink()); }
    rr(ctx, -260, -440, 440, 200, 14); paint(ctx, '#ffd23f', INK, wink());
    ctx.fillStyle = '#d62839'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '900 44px Arial Black, Arial'; ctx.fillText('SORVETE', -40, -400);
    const p = a.price || 'R$ 2'; ctx.font = `900 ${p.length > 8 ? 46 : 70}px Arial Black, Arial`; ctx.fillText(p, -40, -310);
    ctx.restore(); return;
  }
  if (a.type === 'barrow') {
    ctx.save(); ctx.translate(a.x, a.y);
    for (let i = 0; i < 26; i++) bill(ctx, -150 + hash(i) * 300, -300 - hash(i + 4) * 200, (hash(i + 8) - 0.5) * 1.2, 1, a.gray);
    ctx.beginPath(); ctx.moveTo(-260, -320); ctx.lineTo(260, -320); ctx.lineTo(180, -120); ctx.lineTo(-180, -120); ctx.closePath(); paint(ctx, '#3a86ff', INK, wink());
    ell(ctx, 0, -60, 60, 60); paint(ctx, '#1c1222', INK, wink());
    ctx.restore(); return;
  }
  if (a.type === 'chicken') {
    ctx.save(); ctx.translate(a.x, a.y); ctx.scale(k, k);
    const t = f * 0.2;
    ell(ctx, 0, -150, 130, 110); paint(ctx, '#ffffff', INK, wink() / k);
    ell(ctx, 110, -270, 60, 62); paint(ctx, '#ffffff', INK, wink() / k);
    ctx.beginPath(); ctx.moveTo(90, -330); ctx.quadraticCurveTo(110, -380, 130, -330); ctx.quadraticCurveTo(150, -370, 160, -320); paint(ctx, '#e63946', INK, wink(0.7) / k);
    ctx.beginPath(); ctx.moveTo(165, -275); ctx.lineTo(215, -262 + Math.sin(t) * 6); ctx.lineTo(165, -250); ctx.closePath(); paint(ctx, '#ff9f1c', INK, wink(0.6) / k);
    ell(ctx, 128, -285, 10, 12); paint(ctx, INK);
    ell(ctx, -20, -160, 70, 50, -0.3); paint(ctx, '#f1f1f1', INK, wink(0.7) / k);
    for (const lx of [-30, 30]) { ctx.beginPath(); ctx.moveTo(lx, -45); ctx.lineTo(lx, 0); paint(ctx, null, '#ff9f1c', wink(1.5) / k); }
    ctx.restore(); return;
  }
  if (a.type === 'egg') {
    const g = a.k || 0; if (g <= 0) return;
    ctx.save(); ctx.translate(a.x, a.y); ctx.scale(g, g);
    const gr = ctx.createRadialGradient(0, -60, 0, 0, -60, 220); gr.addColorStop(0, 'rgba(255,230,120,.8)'); gr.addColorStop(1, 'rgba(255,230,120,0)'); ctx.fillStyle = gr; ctx.fillRect(-220, -280, 440, 440);
    ell(ctx, 0, -60, 52, 66); paint(ctx, '#ffd23f', INK, wink());
    ctx.restore(); return;
  }
  _drawProp4(ctx, a, f);
};
const _drawFx4 = drawFx;
drawFx = function (ctx, fx, f) {
  _drawFx4(ctx, (fx || []).filter((e) => e.type !== 'money'), f);
  for (const e of fx || []) if (e.type === 'money') for (let i = 0; i < e.n; i++) {
    const sp = 2 + hash(i) * 3, x = e.x0 + hash(i + 11) * e.w + Math.sin(f * 0.08 + i) * 60 + (e.wind || 0) * ((f * sp + hash(i) * 500) % 900), y = e.y0 + ((f * sp + hash(i + 3) * e.h) % e.h);
    bill(ctx, x, y, f * 0.06 + i, 0.9, e.gray);
  }
};
