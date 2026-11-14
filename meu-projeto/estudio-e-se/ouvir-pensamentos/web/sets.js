// School sets: 'class', 'hall', 'gym', 'stage'
function sign(ctx, txt, x, y, size, fill, back, padX = 30) {
  ctx.font = `900 ${size}px Arial Black, Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(txt).width + padX * 2, h = size * 1.5;
  if (back) { rr(ctx, x - w / 2, y - h / 2, w, h, 14); paint(ctx, back, INK, wink()); }
  ctx.fillStyle = fill; ctx.fillText(txt, x, y + size * 0.05);
}
function tileFloor(ctx, base, line) {
  ctx.fillStyle = base; ctx.fillRect(-3000, 0, 6000, 3000);
  ctx.strokeStyle = line; ctx.lineWidth = wink(0.8);
  for (let k = 1; k < 30; k++) { const y = 30 * Math.pow(k, 1.5); if (y > 3000) break; ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(3000, y); ctx.stroke(); }
  for (let i = -16; i <= 16; i++) { ctx.beginPath(); ctx.moveTo(i * 200 * 1400 / 4400, 0); ctx.lineTo(i * 200, 3000); ctx.stroke(); }
  const s = ctx.createLinearGradient(0, 0, 0, 140); s.addColorStop(0, 'rgba(30,20,50,.3)'); s.addColorStop(1, 'rgba(30,20,50,0)');
  ctx.fillStyle = s; ctx.fillRect(-3000, 0, 6000, 140);
}
function skyWindow(ctx, x0, y0, w, h, f) {
  rr(ctx, x0 - 26, y0 - 26, w + 52, h + 52, 10); paint(ctx, '#fffaf0', INK, wink());
  ctx.save(); rr(ctx, x0, y0, w, h, 4); ctx.clip();
  const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, '#5ec2ff'); g.addColorStop(1, '#bfe8ff'); ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
  for (let i = 0; i < 3; i++) { const cx = x0 + ((i * 170 + f * 0.6) % (w + 200)) - 100, cy = y0 + 80 + i * 60; for (const [dx, r] of [[-40, 40], [0, 55], [45, 38]]) { ell(ctx, cx + dx, cy, r, r * 0.8); paint(ctx, '#ffffff'); } }
  ell(ctx, x0 + w * 0.5, y0 + h + 40, w * 0.4, 200); paint(ctx, '#52b788', INK, wink());
  ctx.restore();
  rr(ctx, x0 + w / 2 - 10, y0, 20, h, 0); paint(ctx, '#fffaf0', INK, wink(0.7));
}

function drawSet(ctx, st, cam, f) {
  const set = st.set;
  if (set === 'class') {
    ctx.fillStyle = '#f7e3a1'; ctx.fillRect(-3000, -2600, 6000, 2600);
    rr(ctx, -3000, -520, 6000, 520, 0); paint(ctx, '#7cc6b9', INK, wink());
    rr(ctx, -3000, -540, 6000, 30, 0); paint(ctx, '#f6ead2', INK, wink());
    // chalkboard
    rr(ctx, -520, -1500, 1040, 660, 16); paint(ctx, '#8d5a3b', INK, wink());
    rr(ctx, -490, -1470, 980, 600, 8); paint(ctx, '#2f5d50', INK, wink());
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = '700 88px Comic Sans MS, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('1º DIA DE AULA', 0, -1330);
    ctx.font = '700 64px Comic Sans MS, Arial'; ctx.fillText('2 + 2 = 4', -230, -1060);
    ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = wink(1.2); ell(ctx, 260, -1080, 60, 60); ctx.stroke();
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(260 + Math.cos(a) * 80, -1080 + Math.sin(a) * 80); ctx.lineTo(260 + Math.cos(a) * 110, -1080 + Math.sin(a) * 110); ctx.stroke(); }
    rr(ctx, -520, -850, 1040, 30, 6); paint(ctx, '#8d5a3b', INK, wink());
    // door (left)
    const x0 = -1450, o = st.door || 0;
    rr(ctx, x0 - 30, -960, 440, 960, [14, 14, 0, 0]); paint(ctx, '#f6ead2', INK, wink());
    rr(ctx, x0, -930, 380, 930, 0); paint(ctx, '#cde7f0', INK, wink());
    const wv = 380 * Math.cos(o * 75 * D2R);
    ctx.beginPath(); ctx.moveTo(x0, -930); ctx.lineTo(x0 + wv, -930 - 24 * o); ctx.lineTo(x0 + wv, 24 * o); ctx.lineTo(x0, 0); ctx.closePath(); paint(ctx, '#e76f51', INK, wink());
    if (wv > 80) { rr(ctx, x0 + wv * 0.25, -820, wv * 0.5, 220, 6); paint(ctx, '#bfe8ff', INK, wink(0.7)); ell(ctx, x0 + wv * 0.85, -460, 18, 18); paint(ctx, '#ffd23f', INK, wink(0.6)); }
    sign(ctx, 'SALA 6', x0 + 190, -1050, 54, '#ffffff', '#3a0ca3');
    skyWindow(ctx, 760, -1450, 520, 640, f);
    ctx.save(); ctx.translate(-900, -230); drawClock(ctx, st, f); ctx.restore();
    // ABC strip
    ctx.font = '900 60px Arial'; ctx.textAlign = 'center';
    'ABCDEFGHIJ'.split('').forEach((ch, i) => { const x = -1100 + i * 230; rr(ctx, x - 50, -1700, 100, 100, 10); paint(ctx, ['#ff5fa2', '#ffd23f', '#4cc9f0', '#52b788', '#c77dff'][i % 5], INK, wink(0.7)); ctx.fillStyle = '#fff'; ctx.fillText(ch, x, -1648); });
    tileFloor(ctx, '#e8dcc4', 'rgba(120,90,60,.35)');
  }
  if (set === 'hall') {
    ctx.fillStyle = '#cde7f0'; ctx.fillRect(-3000, -2600, 6000, 2600);
    rr(ctx, -3000, -1600, 6000, 30, 0); paint(ctx, '#f6ead2', INK, wink());
    const cols = ['#e76f51', '#f4a261', '#2a9d8f'];
    for (let x = -2900; x < 3000; x += 150) {
      if ((x > -950 && x < -400) || (x > 650 && x < 1200)) continue;
      rr(ctx, x, -760, 140, 740, 8); paint(ctx, cols[Math.abs(Math.round(x / 150)) % 3], INK, wink());
      for (let k = 0; k < 4; k++) { ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(x + 35, -720 + k * 22, 70, 8); }
      rr(ctx, x + 110, -420, 14, 60, 6); paint(ctx, '#dfe3ea', INK, wink(0.6));
    }
    for (const [dx, txt, col, open] of [[-680, 'MENINAS', '#ff5fa2', 0], [920, 'MENINOS', '#3d85e0', st.boyDoor || 0]]) {
      rr(ctx, dx - 200, -960, 400, 960, [14, 14, 0, 0]); paint(ctx, '#f6ead2', INK, wink());
      rr(ctx, dx - 170, -930, 340, 930, 0); paint(ctx, '#3a3550', INK, wink());
      const wv = 340 * Math.cos(open * 75 * D2R);
      ctx.beginPath(); ctx.moveTo(dx - 170, -930); ctx.lineTo(dx - 170 + wv, -930 - 20 * open); ctx.lineTo(dx - 170 + wv, 20 * open); ctx.lineTo(dx - 170, 0); ctx.closePath(); paint(ctx, col, INK, wink());
      sign(ctx, txt, dx, -1080, 62, '#ffffff', col);
    }
    rr(ctx, -150, -1450, 520, 360, 10); paint(ctx, '#c08552', INK, wink());
    [['#fff3b0', -90, -1390], ['#bde0fe', 70, -1360], ['#ffc8dd', 220, -1400], ['#caffbf', 0, -1220], ['#fff3b0', 190, -1210]].forEach(([c, x, y], i) => { rr(ctx, x, y, 130, 110, 4); paint(ctx, c, INK, wink(0.6)); ell(ctx, x + 65, y + 8, 10, 10); paint(ctx, '#e63946'); });
    tileFloor(ctx, '#d7dde8', 'rgba(70,80,110,.35)');
  }
  if (set === 'gym') {
    ctx.fillStyle = '#3c1f6e'; ctx.fillRect(-3000, -2600, 6000, 2600);
    ctx.fillStyle = '#47267f'; for (let x = -3000; x < 3000; x += 240) ctx.fillRect(x, -2600, 120, 2600);
    // string lights
    for (let r = 0; r < 2; r++) {
      const y0 = -1750 + r * 260;
      for (let i = 0; i < 40; i++) { const x = -2600 + i * 140, y = y0 + Math.sin((i % 10) / 10 * Math.PI) * 120; const on = Math.sin(f * 0.3 + i * 1.3 + r) > -0.3; ell(ctx, x, y, 16, 20); paint(ctx, on ? ['#ffd23f', '#ff5fa2', '#4cc9f0', '#52b788'][i % 4] : '#5a4a7a', INK, wink(0.5)); }
    }
    // banner
    ctx.beginPath(); ctx.moveTo(-760, -1330); ctx.lineTo(760, -1330); ctx.lineTo(720, -1180); ctx.lineTo(760, -1030); ctx.lineTo(-760, -1030); ctx.lineTo(-720, -1180); ctx.closePath(); paint(ctx, '#ff5fa2', INK, wink());
    ctx.fillStyle = '#fff3b0'; ctx.font = '900 92px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('BAILE DE FIM DE ANO', 0, -1175);
    // disco ball
    ctx.beginPath(); ctx.moveTo(0, -2600); ctx.lineTo(0, -1880); paint(ctx, null, INK, wink());
    ell(ctx, 0, -1780, 110, 110); paint(ctx, '#c9d6e8', INK, wink());
    ctx.save(); ell(ctx, 0, -1780, 110, 110); ctx.clip();
    for (let i = -5; i <= 5; i++) for (let j = -5; j <= 5; j++) { const v = hash(i * 13 + j + Math.floor(f / 4)); ctx.fillStyle = v > 0.7 ? '#ffffff' : v > 0.4 ? '#9fb3cc' : '#dfe8f5'; ctx.fillRect(i * 22 - 10, -1780 + j * 22 - 10, 19, 19); }
    ctx.restore();
    // scoreboard
    if (st.score != null) {
      rr(ctx, 820, -1080, 420, 360, 18); paint(ctx, '#1b1b26', INK, wink());
      ctx.fillStyle = '#ffd23f'; ctx.font = '900 56px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.fillText('MÚSICA', 1030, -1000);
      rr(ctx, 870, -950, 320, 200, 10); paint(ctx, '#2b0f12', INK, wink(0.6));
      ctx.fillStyle = '#ff3b3b'; ctx.font = '900 170px Arial Black, Arial'; ctx.fillText(String(st.score), 1030, -845);
    }
    // balloons
    for (const bx of [-1350, 1450]) for (let i = 0; i < 5; i++) { const x = bx + (i - 2) * 70, y = -620 - (i % 2) * 110 + Math.sin(f * 0.06 + i) * 10; ctx.beginPath(); ctx.moveTo(x, y + 70); ctx.lineTo(bx, -150); paint(ctx, null, '#ffffff', wink(0.5)); ell(ctx, x, y, 62, 74); paint(ctx, ['#ff5fa2', '#ffd23f', '#4cc9f0', '#c77dff', '#52b788'][i], INK, wink()); }
    st.noRug = true; drawFloor(ctx, st);
    ell(ctx, 0, 520, 700, 180); paint(ctx, null, 'rgba(255,255,255,.6)', wink(1.4));
  }
  if (set === 'stage') {
    ctx.fillStyle = '#7a0f2a'; ctx.fillRect(-3000, -2600, 6000, 2800);
    for (let x = -3000; x < 3000; x += 160) { const g = ctx.createLinearGradient(x, 0, x + 160, 0); g.addColorStop(0, '#5a0a1e'); g.addColorStop(0.5, '#b0183d'); g.addColorStop(1, '#5a0a1e'); ctx.fillStyle = g; ctx.fillRect(x, -2600, 160, 2800); }
    ctx.beginPath(); ctx.moveTo(-3000, -2600); for (let x = -3000; x <= 3000; x += 300) ctx.quadraticCurveTo(x + 150, -2150, x + 300, -2600); ctx.fill();
    ctx.fillStyle = '#c9184a'; ctx.beginPath(); ctx.moveTo(-3000, -2600); for (let x = -3000; x <= 3000; x += 300) ctx.quadraticCurveTo(x + 150, -2250, x + 300, -2600); ctx.fill();
    sign(ctx, 'PARABÉNS, FORMANDOS!', 0, -1500, 80, '#fff3b0', '#3a0ca3', 50);
    // stage floor
    const g = ctx.createLinearGradient(0, 0, 0, 500); g.addColorStop(0, '#9c6644'); g.addColorStop(1, '#c08552');
    ctx.fillStyle = g; ctx.fillRect(-3000, 0, 6000, 520);
    ctx.strokeStyle = 'rgba(60,25,10,.4)'; ctx.lineWidth = wink(0.7); for (let y = 40; y < 520; y += 60 + y * 0.1) { ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(3000, y); ctx.stroke(); }
    rr(ctx, -3000, 520, 6000, 60, 0); paint(ctx, '#6b3f26', INK, wink());
    ctx.fillStyle = '#1d1030'; ctx.fillRect(-3000, 580, 6000, 3000);
    // audience heads silhouettes
    for (let i = 0; i < 40; i++) { const x = -2400 + i * 125 + (i % 2) * 40, y = 820 + (i % 3) * 140 + Math.max(0, Math.sin(f * 0.4 + i)) * -14; ell(ctx, x, y, 62, 70); paint(ctx, '#2e1a47'); }
  }
}

// set furniture as actors (sorted with kids)
function drawProp(ctx, a, f) {
  const k = a.s || 1;
  ctx.save(); ctx.translate(a.x, a.y); ctx.scale(k, k);
  if (a.type === 'desk') {
    rr(ctx, -150, -215, 300, 36, 8); paint(ctx, '#d9a066', INK, wink() / k);
    rr(ctx, -125, -182, 250, 110, 6); paint(ctx, '#4a7fb5', INK, wink() / k);
    for (const sx of [-1, 1]) { rr(ctx, sx * 110 - 8, -75, 16, 75, 4); paint(ctx, '#5c677d', INK, wink(0.7) / k); }
  }
  if (a.type === 'podium') {
    ctx.beginPath(); ctx.moveTo(-170, -520); ctx.lineTo(170, -520); ctx.lineTo(130, 0); ctx.lineTo(-130, 0); ctx.closePath(); paint(ctx, '#7a4a2a', INK, wink() / k);
    rr(ctx, -200, -560, 400, 60, 10); paint(ctx, '#9c6644', INK, wink() / k);
    ell(ctx, 0, -300, 70, 70); paint(ctx, '#ffd23f', INK, wink() / k); star(ctx, 0, -300, 40, 18, '#fff3b0');
    ctx.beginPath(); ctx.moveTo(60, -560); ctx.lineTo(10, -700); paint(ctx, null, INK, wink(1.4) / k); ell(ctx, 8, -715, 18, 24); paint(ctx, '#3a3f58', INK, wink(0.6) / k);
  }
  ctx.restore();
}
