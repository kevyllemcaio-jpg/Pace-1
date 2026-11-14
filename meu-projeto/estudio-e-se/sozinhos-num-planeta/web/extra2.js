// extras for "apaixonadas": heart eyes, letters, book, street set, locker, chocolate pile, plain gym
EXPR.love = { eye: 'heart', brow: [-10, 18], mouth: 'smile' };
EXPR.lovegrin = { eye: 'heart', brow: [-10, 18], mouth: 'grin' };
POSES.letter = { L: [12, 6], R: [120, 30] };
POSES.read = { L: [30, -100], R: [30, -100] };
POSES.run = { L: [30, -60], R: [30, -60] };
POSES.fallen = { L: [160, 10], R: [160, 10] };

// heart eyes: wrap face() — draw hearts over the eye area when expr eye === 'heart'
const _face = face;
face = function (ctx, c, a, ink, f, seed) {
  const e = EXPR[a.expr || 'neutral'];
  if (e.eye !== 'heart') return _face(ctx, c, a, ink, f, seed);
  const a2 = Object.assign({}, a, { expr: '_loveBase' });
  EXPR._loveBase = { eye: 'closedHappy', brow: e.brow, mouth: e.mouth };
  _face(ctx, c, a2, ink, f, seed);
  const beat = 1 + 0.12 * Math.max(0, Math.sin(f * 0.6 + seed));
  for (const sx of [-1, 1]) {
    ctx.save(); ctx.translate(sx * 72, -805); ctx.scale(beat, beat);
    ctx.fillStyle = '#ff2d55'; heart(ctx, 0, 0, 36); ctx.strokeStyle = PLUM; ctx.lineWidth = ink; ctx.stroke();
    ell(ctx, -16, -16, 8, 8); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.restore();
  }
};

const _drawProps = drawProps;
drawProps = function (ctx, c, a, J, ink, f) {
  _drawProps(ctx, c, a, J, ink, f);
  const P = a.props || {};
  if (P.letter) {
    const [hx, hy] = J.R.h;
    ctx.save(); ctx.translate(hx, hy - 70); ctx.rotate(-0.15);
    rr(ctx, -80, -55, 160, 110, 8); paint(ctx, '#ffd6e5', PLUM, ink);
    ctx.beginPath(); ctx.moveTo(-80, -55); ctx.lineTo(0, 10); ctx.lineTo(80, -55); paint(ctx, null, PLUM, ink);
    ctx.fillStyle = '#ff2d55'; heart(ctx, 0, 5, 18);
    ctx.restore();
  }
  if (P.book) {
    const x = (J.L.h[0] + J.R.h[0]) / 2, y = (J.L.h[1] + J.R.h[1]) / 2 - 60;
    ctx.save(); ctx.translate(x, y);
    ctx.beginPath(); ctx.moveTo(0, -80); ctx.lineTo(-170, -100); ctx.lineTo(-170, 60); ctx.lineTo(0, 80); ctx.lineTo(170, 60); ctx.lineTo(170, -100); ctx.closePath(); paint(ctx, '#3a86ff', PLUM, ink);
    ctx.beginPath(); ctx.moveTo(0, -80); ctx.lineTo(0, 80); paint(ctx, null, PLUM, ink);
    ctx.restore();
  }
};

const _drawSet2 = drawSet;
drawSet = function (ctx, st, cam, f) {
  if (st.set === 'street') {
    const g = ctx.createLinearGradient(0, -2600, 0, 0); g.addColorStop(0, '#5ec2ff'); g.addColorStop(1, '#ffe3a8');
    ctx.fillStyle = g; ctx.fillRect(-4000, -2600, 12000, 2700);
    for (let i = 0; i < 6; i++) { const cx = -3000 + i * 1600 + (f * 0.8) % 1600, cy = -2100 + (i % 2) * 200; for (const [dx, r] of [[-90, 90], [0, 120], [100, 85]]) { ell(ctx, cx + dx, cy, r, r * 0.75); paint(ctx, '#ffffff'); } }
    // houses along the street (0 = our house)
    const cols = ['#ffb4a2', '#a8dadc', '#ffd166', '#cdb4db', '#b5e48c', '#ffc8dd', '#90e0ef'];
    for (let i = 0; i < 7; i++) {
      const hx = -700 + i * 1100, w = 900, top = -1300;
      rr(ctx, hx, top, w, 1300, 0); paint(ctx, cols[i], INK, wink());
      ctx.beginPath(); ctx.moveTo(hx - 60, top); ctx.lineTo(hx + w / 2, top - 420); ctx.lineTo(hx + w + 60, top); ctx.closePath(); paint(ctx, '#9d4b3b', INK, wink());
      for (const wx of [hx + 80, hx + w - 280]) { rr(ctx, wx, -1100, 200, 220, 8); paint(ctx, '#e0f4ff', INK, wink()); rr(ctx, wx + 90, -1100, 20, 220, 0); paint(ctx, '#fffaf0', INK, wink(0.6)); }
      const dx = hx + w / 2 - 150;
      rr(ctx, dx - 20, -740, 340, 740, [12, 12, 0, 0]); paint(ctx, '#fffaf0', INK, wink());
      rr(ctx, dx, -720, 300, 720, 0); paint(ctx, '#2b2140', INK, wink());
      const o = i === 0 ? (st.door || 0) : 0, wv = 300 * Math.cos(o * 75 * D2R);
      ctx.beginPath(); ctx.moveTo(dx, -720); ctx.lineTo(dx + wv, -720 - 20 * o); ctx.lineTo(dx + wv, 20 * o); ctx.lineTo(dx, 0); ctx.closePath(); paint(ctx, '#7a4a2a', INK, wink());
      if (wv > 60) { ell(ctx, dx + wv * 0.85, -360, 16, 16); paint(ctx, '#ffd23f', INK, wink(0.6)); }
    }
    // corner street sign at the end of the line
    const sx = 6500;
    rr(ctx, sx - 15, -1300, 30, 1300, 6); paint(ctx, '#5c677d', INK, wink());
    sign(ctx, 'ESQUINA', sx, -1330, 70, '#ffffff', '#2a9d8f');
    // sidewalk + street
    ctx.fillStyle = '#d8d8d8'; ctx.fillRect(-4000, 0, 12000, 700);
    ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.lineWidth = wink(0.8); for (let x = -4000; x < 8000; x += 260) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - 80, 700); ctx.stroke(); }
    rr(ctx, -4000, 700, 12000, 40, 0); paint(ctx, '#b0b0b0', INK, wink());
    ctx.fillStyle = '#4a4e69'; ctx.fillRect(-4000, 740, 12000, 2000);
    ctx.fillStyle = '#ffffff'; for (let x = -4000; x < 8000; x += 400) ctx.fillRect(x, 1100, 200, 30);
    return;
  }
  if (st.set === 'hall' && st.locker != null) {
    _drawSet2(ctx, st, cam, f);
    // a big locker at x=0, open
    rr(ctx, -260, -1000, 520, 1000, 10); paint(ctx, '#2a9d8f', INK, wink());
    rr(ctx, -230, -970, 460, 950, 6); paint(ctx, '#203040', INK, wink());
    ctx.fillStyle = '#5c677d'; ctx.fillRect(-230, -800, 460, 16);
    return;
  }
  if (st.set === 'quadra') {
    _drawSet2(ctx, Object.assign({}, st, { set: 'gym', score: null }), cam, f);
    return;
  }
  _drawSet2(ctx, st, cam, f);
};

const _drawProp2 = drawProp;
drawProp = function (ctx, a, f) {
  if (a.type === 'lockerDoor') {
    const o = a.open; ctx.save(); ctx.translate(a.x, a.y);
    const wv = 460 * Math.cos(o * 80 * D2R);
    ctx.beginPath(); ctx.moveTo(-230, -970); ctx.lineTo(-230 - wv * 0.15, -990); ctx.lineTo(-230 - wv * 0.15, 0); ctx.lineTo(-230, -20); ctx.closePath();
    ctx.beginPath(); ctx.moveTo(-230, -970); ctx.lineTo(-230 + wv, -970 - 30 * o); ctx.lineTo(-230 + wv, -20 + 30 * o); ctx.lineTo(-230, -20); ctx.closePath(); paint(ctx, '#2a9d8f', INK, wink());
    if (wv > 80) for (let k = 0; k < 4; k++) { ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-230 + wv * 0.2, -900 + k * 30, wv * 0.6, 10); }
    ctx.restore(); return;
  }
  if (a.type === 'choco') {
    ctx.save(); ctx.translate(a.x, a.y);
    const n = Math.floor(a.n || 24);
    for (let i = 0; i < n; i++) {
      const row = Math.floor(Math.sqrt(i * 2)), x = (hash(i) - 0.5) * (380 - row * 50), y = -220 - row * 60 - hash(i + 3) * 30;
      ctx.save(); ctx.translate(x, y); ctx.rotate((hash(i + 7) - 0.5) * 0.8);
      if (i % 3 === 0) { ctx.fillStyle = ['#e63946', '#ff5fa2', '#c9184a'][i % 3]; heart(ctx, 0, 0, 45); ctx.strokeStyle = INK; ctx.lineWidth = wink(0.8); ctx.stroke(); }
      else { rr(ctx, -60, -28, 120, 56, 8); paint(ctx, '#6f3b1f', INK, wink(0.8)); ctx.fillStyle = '#ffd23f'; ctx.fillRect(-60, -6, 120, 12); }
      ctx.restore();
    }
    ctx.restore(); return;
  }
  _drawProp2(ctx, a, f);
};
