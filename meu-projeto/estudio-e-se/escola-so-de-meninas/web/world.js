// Living-room world. World units ~ px at zoom 1. Wall base at y=0, floor below.
let WALLPAT = null;
function makePatterns(ctx) {
  const c = document.createElement('canvas'); c.width = 180; c.height = 180;
  const g = c.getContext('2d');
  g.fillStyle = '#6cbfb2'; g.fillRect(0, 0, 180, 180);
  g.fillStyle = '#7fcdbf'; g.fillRect(0, 0, 70, 180);
  g.fillStyle = 'rgba(20,60,60,.13)'; g.fillRect(70, 0, 4, 180); g.fillRect(176, 0, 4, 180);
  g.fillStyle = '#fff3d6';
  for (const [x, y] of [[35, 40], [125, 130], [35, 130], [125, 40]]) { star(g, x, y, 11, 5); }
  g.fillStyle = 'rgba(255,255,255,.08)'; for (let i = 0; i < 40; i++) g.fillRect(hash(i) * 180, hash(i + 9) * 180, 3, 9);
  WALLPAT = ctx.createPattern(c, 'repeat');
}

function drawWall(ctx, st, f) {
  ctx.fillStyle = WALLPAT; ctx.fillRect(-2800, -2400, 5600, 2400);
  // ceiling shadow + crown molding
  const g = ctx.createLinearGradient(0, -2400, 0, -1500); g.addColorStop(0, 'rgba(30,20,60,.35)'); g.addColorStop(1, 'rgba(30,20,60,0)');
  ctx.fillStyle = g; ctx.fillRect(-2800, -2400, 5600, 900);
  rr(ctx, -2800, -1720, 5600, 40, 0); paint(ctx, '#f6ead2', INK, wink());
  // baseboard
  rr(ctx, -2800, -70, 5600, 70, 0); paint(ctx, '#f6ead2', INK, wink());
}

function drawFloor(ctx, st) {
  const g = ctx.createLinearGradient(0, 0, 0, 1800); g.addColorStop(0, '#b06a38'); g.addColorStop(1, '#dc9c5c');
  ctx.fillStyle = g; ctx.fillRect(-2800, 0, 5600, 2800);
  ctx.strokeStyle = 'rgba(60,25,10,.55)'; ctx.lineWidth = wink(0.7);
  let prev = 0;
  for (let k = 1; k < 40; k++) {
    const y = 22 * Math.pow(k, 1.55);
    if (y > 2800) break;
    ctx.beginPath(); ctx.moveTo(-2800, y); ctx.lineTo(2800, y); ctx.stroke();
    const sp = 300 * (y + 1400) / 1400;
    for (let i = -14; i <= 14; i++) {
      const x0 = i * 330 + (k % 2) * 165;
      const xa = x0 * (prev + 1400) / 2800, xb = x0 * (y + 1400) / 2800;
      ctx.beginPath(); ctx.moveTo(xa, prev); ctx.lineTo(xb, y); ctx.stroke();
    }
    prev = y;
  }
  const s = ctx.createLinearGradient(0, 0, 0, 120); s.addColorStop(0, 'rgba(40,10,20,.35)'); s.addColorStop(1, 'rgba(40,10,20,0)');
  ctx.fillStyle = s; ctx.fillRect(-2800, 0, 5600, 120);
  // rug
  if (!st.noRug) {
    ell(ctx, 0, 470, 1050, 270); paint(ctx, '#e76f51', INK, wink());
    ell(ctx, 0, 470, 930, 225); ctx.setLineDash([wink(3), wink(2.5)]); paint(ctx, null, '#ffd27a', wink(2)); ctx.setLineDash([]);
    ctx.fillStyle = '#f4a261';
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); const x = i * 220, y = 470; ctx.moveTo(x, y - 60); ctx.lineTo(x + 60, y); ctx.lineTo(x, y + 60); ctx.lineTo(x - 60, y); ctx.closePath(); ctx.fill(); }
  }
  if (st.runway) {
    const rx = 250;
    ctx.beginPath(); ctx.moveTo(rx - 120, 60); ctx.lineTo(rx + 120, 60); ctx.lineTo(rx + 360, 1500); ctx.lineTo(rx - 360, 1500); ctx.closePath();
    paint(ctx, '#c77dff', INK, wink());
    ctx.save(); ctx.clip();
    ctx.fillStyle = '#e0aaff'; ctx.beginPath(); ctx.moveTo(rx - 40, 60); ctx.lineTo(rx + 40, 60); ctx.lineTo(rx + 120, 1500); ctx.lineTo(rx - 120, 1500); ctx.closePath(); ctx.fill();
    ctx.restore();
    for (let i = 0; i < 9; i++) {
      const y = 120 + i * 160, w = 120 + (y - 60) / 1440 * 240;
      for (const sx of [-1, 1]) {
        const on = Math.sin(st.f * 0.5 + i + (sx > 0 ? 1.5 : 0)) > 0;
        ell(ctx, rx + sx * (w + 25), y, 16 + y / 80, 10 + y / 140); paint(ctx, on ? '#fff59d' : '#f9c74f', INK, wink(0.6));
      }
    }
  }
}

function drawDoor(ctx, st) {
  const x0 = -1440, w0 = 380;
  rr(ctx, x0 - 34, -935, w0 + 68, 935, [16, 16, 0, 0]); paint(ctx, '#f6ead2', INK, wink());
  // doorway
  const g = ctx.createLinearGradient(0, -900, 0, 0); g.addColorStop(0, '#141a3d'); g.addColorStop(1, '#2d2457');
  rr(ctx, x0, -900, w0, 900, 0); paint(ctx, g, INK, wink());
  ctx.fillStyle = '#fff6c8'; for (let i = 0; i < 6; i++) { ell(ctx, x0 + 40 + hash(i + 40) * 300, -860 + hash(i + 50) * 300, 4, 4); ctx.fill(); }
  const o = st.door || 0;
  const wv = w0 * Math.cos(o * 78 * D2R), sk = 26 * o;
  ctx.beginPath(); ctx.moveTo(x0, -900); ctx.lineTo(x0 + wv, -900 - sk); ctx.lineTo(x0 + wv, sk); ctx.lineTo(x0, 0); ctx.closePath();
  paint(ctx, '#c0703c', INK, wink());
  if (wv > 60) {
    ctx.strokeStyle = 'rgba(80,30,10,.6)'; ctx.lineWidth = wink(0.8);
    for (const [a, b] of [[-840, -520], [-440, -80]]) { ctx.beginPath(); ctx.rect(x0 + wv * 0.15, a, wv * 0.7, b - a); ctx.stroke(); }
    ell(ctx, x0 + wv * 0.85, -450, 18 * (wv / w0), 18); paint(ctx, '#ffd23f', INK, wink(0.7));
  }
  // light switch
  rr(ctx, 690, -380, 60, 90, 10); paint(ctx, '#fff8e8', INK, wink(0.8));
  rr(ctx, 708, st.lightOff ? -338 : -362, 24, 30, 6); paint(ctx, '#d9d2c0', INK, wink(0.6));
}

function drawWindow(ctx, st, cam, f) {
  const x0 = -850, y0 = -1350, w = 460, h = 620;
  rr(ctx, x0 - 32, y0 - 32, w + 64, h + 64, 14); paint(ctx, '#f6ead2', INK, wink());
  ctx.save(); rr(ctx, x0, y0, w, h, 4); ctx.clip();
  const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, '#0c1748'); g.addColorStop(1, '#3d3a8f');
  ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
  const px = (cam.x + 620) * 0.18, py = (cam.y + 1000) * 0.1;
  for (let i = 0; i < 18; i++) { const tw = 0.5 + 0.5 * Math.sin(f * 0.2 + i * 2); ctx.fillStyle = `rgba(255,250,210,${0.4 + 0.6 * tw})`; star(ctx, x0 + hash(i) * w + px * 0.5, y0 + hash(i + 7) * h * 0.6, 7, 3); }
  ell(ctx, -720 + px, -1215 + py, 72, 72); paint(ctx, '#fff3c4', INK, wink(0.8));
  ctx.fillStyle = 'rgba(220,200,140,.6)'; ell(ctx, -745 + px, -1230 + py, 14, 14); ctx.fill(); ell(ctx, -700 + px, -1195 + py, 9, 9); ctx.fill();
  // rooftops
  ctx.fillStyle = '#1b1f4a';
  for (let i = 0; i < 6; i++) { const bx = x0 - 60 + i * 110 + px * 1.6, bh = 90 + hash(i + 3) * 90; ctx.beginPath(); ctx.moveTo(bx, y0 + h); ctx.lineTo(bx, y0 + h - bh); ctx.lineTo(bx + 50, y0 + h - bh - 50); ctx.lineTo(bx + 100, y0 + h - bh); ctx.lineTo(bx + 100, y0 + h); ctx.fill(); ctx.fillStyle = '#ffd56b'; ctx.fillRect(bx + 35, y0 + h - bh + 20, 22, 26); ctx.fillStyle = '#1b1f4a'; }
  if (st.cat) drawCat(ctx, st.cat, f);
  ctx.restore();
  // mullions
  ctx.fillStyle = '#f6ead2';
  rr(ctx, x0 + w / 2 - 12, y0, 24, h, 0); paint(ctx, '#f6ead2', INK, wink(0.8));
  rr(ctx, x0, y0 + h * 0.45 - 12, w, 24, 0); paint(ctx, '#f6ead2', INK, wink(0.8));
  // sill
  rr(ctx, x0 - 60, y0 + h + 20, w + 120, 46, 10); paint(ctx, '#f6ead2', INK, wink());
  // curtains
  rr(ctx, x0 - 90, y0 - 80, w + 180, 22, 11); paint(ctx, '#8d5a3b', INK, wink(0.8));
  const c = st.curtain == null ? 0.15 : st.curtain;
  for (const sx of [-1, 1]) {
    const cw = 120 + (w / 2 + 10 - 120 + 80) * c;
    const xa = sx < 0 ? x0 - 80 : x0 + w + 80, xb = xa - sx * cw;
    const sway = Math.sin(f * 0.07 + sx) * 8 * (st.curtainSway || 1);
    ctx.beginPath(); ctx.moveTo(xa, y0 - 70); ctx.lineTo(xb, y0 - 70);
    ctx.quadraticCurveTo(xb + sway, y0 + 300, xb + sway * 2, y0 + h + 60);
    const n = 4; for (let i = 0; i < n; i++) { const x1 = xb + sway * 2 + (xa - xb - sway * 2) * (i + 1) / n; ctx.quadraticCurveTo(x1 - (xa - xb) / n / 2, y0 + h + 90, x1, y0 + h + 60); }
    ctx.closePath();
    const lit = st.curtainLit || 0;
    paint(ctx, lit ? `rgb(${255},${150 + 60 * lit},${190 + 40 * lit})` : '#ff8fab', INK, wink());
    ctx.save(); ctx.clip();
    ctx.strokeStyle = 'rgba(190,40,90,.45)'; ctx.lineWidth = wink(1.2);
    for (let i = 1; i < 4; i++) { const xx = xb + (xa - xb) * i / 4; ctx.beginPath(); ctx.moveTo(xx, y0 - 60); ctx.quadraticCurveTo(xx + sway, y0 + 300, xx + sway * 1.5, y0 + h + 80); ctx.stroke(); }
    if (st.paw != null && sx < 0 || st.paw != null && sx > 0) drawPaw(ctx, st.paw, f);
    ctx.restore();
  }
}

// silhouette of a clawed paw scratching down the closed curtain
function drawPaw(ctx, p, f) {
  const y = -1250 + p * 380, x = -640;
  ctx.fillStyle = 'rgba(40,10,50,.75)';
  ell(ctx, x, y, 95, 80); ctx.fill();
  for (let i = 0; i < 4; i++) { ell(ctx, x - 75 + i * 50, y - 85, 30, 34); ctx.fill(); }
  ctx.strokeStyle = 'rgba(40,10,50,.85)'; ctx.lineWidth = wink(2);
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - 75 + i * 50, y - 115); ctx.lineTo(x - 80 + i * 50, y - 160); ctx.stroke(); }
  // scratch marks left behind
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = wink(1.4);
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - 80 + i * 50, -1300); ctx.lineTo(x - 80 + i * 50 + 8, y - 160); ctx.stroke(); }
}

function drawClock(ctx, st, f) {
  const x = 0, y = -1300;
  ell(ctx, x, y, 128, 128); paint(ctx, '#ff9f43', INK, wink());
  ell(ctx, x, y, 104, 104); paint(ctx, '#fffaf0', INK, wink(0.8));
  ctx.strokeStyle = INK;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.lineWidth = wink(i % 3 ? 0.6 : 1.4); ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 82, y + Math.sin(a) * 82); ctx.lineTo(x + Math.cos(a) * 96, y + Math.sin(a) * 96); ctx.stroke(); }
  const m = st.clock != null ? st.clock : 50 + f / 1800; // minutes past 21h
  const am = (m / 60) * Math.PI * 2 - Math.PI / 2, ah = ((9 + m / 60) / 12) * Math.PI * 2 - Math.PI / 2;
  ctx.lineCap = 'round';
  ctx.lineWidth = wink(2.2); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ah) * 52, y + Math.sin(ah) * 52); ctx.stroke();
  ctx.lineWidth = wink(1.5); ctx.strokeStyle = '#d62839'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(am) * 84, y + Math.sin(am) * 84); ctx.stroke();
  ell(ctx, x, y, 10, 10); paint(ctx, INK);
}

function drawDecor(ctx, st, f) {
  // picture: crayon house
  rr(ctx, 360, -1260, 240, 190, 8); paint(ctx, '#ffd23f', INK, wink());
  rr(ctx, 380, -1240, 200, 150, 4); paint(ctx, '#e8f6ff', INK, wink(0.6));
  ctx.beginPath(); ctx.moveTo(430, -1140); ctx.lineTo(480, -1190); ctx.lineTo(530, -1140); ctx.closePath(); paint(ctx, '#ef5350', INK, wink(0.6));
  rr(ctx, 440, -1140, 80, 40, 0); paint(ctx, '#ffb4a2', INK, wink(0.6));
  ell(ctx, 550, -1215, 16, 16); paint(ctx, '#ffd23f');
  // star poster
  rr(ctx, 820, -1380, 200, 270, 8); paint(ctx, '#3a0ca3', INK, wink());
  ctx.fillStyle = '#ffd23f'; star(ctx, 920, -1260, 70, 30); ctx.strokeStyle = INK; ctx.lineWidth = wink(0.7); ctx.stroke();
  // shelf + plant
  rr(ctx, -2100, -900, 360, 30, 6); paint(ctx, '#8d5a3b', INK, wink());
  rr(ctx, -2020, -1010, 90, 110, 12); paint(ctx, '#e76f51', INK, wink(0.8));
  for (let i = 0; i < 5; i++) { ell(ctx, -1975 + (i - 2) * 30, -1060 - (i % 2) * 30, 22, 50, (i - 2) * 0.35 + Math.sin(f * 0.05 + i) * 0.05); paint(ctx, '#52b788', INK, wink(0.6)); }
}

function drawTV(ctx, st, f) {
  rr(ctx, 620, -150, 340, 280, 14); paint(ctx, '#8d5a3b', INK, wink());
  rr(ctx, 645, -110, 130, 90, 8); paint(ctx, '#a06b48', INK, wink(0.6));
  rr(ctx, 805, -110, 130, 90, 8); paint(ctx, '#a06b48', INK, wink(0.6));
  ctx.beginPath(); ctx.moveTo(760, -430); ctx.lineTo(700, -560); ctx.moveTo(820, -430); ctx.lineTo(880, -570); paint(ctx, null, INK, wink(1.2));
  rr(ctx, 600, -440, 380, 290, 22); paint(ctx, '#2d2d3a', INK, wink());
  ctx.save(); rr(ctx, 625, -418, 330, 230, 10); ctx.clip();
  if (st.tvOn !== false) {
    ctx.fillStyle = '#7ec8ff'; ctx.fillRect(625, -418, 330, 230);
    ctx.fillStyle = '#52b788'; ctx.fillRect(625, -240, 330, 60);
    const sc = (f * 4) % 120;
    ctx.fillStyle = '#ffd23f'; for (let i = 0; i < 4; i++) { ell(ctx, 660 + i * 100 - sc, -300, 12, 12); ctx.fill(); }
    ctx.fillStyle = '#7a4a2a'; for (let i = 0; i < 3; i++) ctx.fillRect(700 + i * 130 - sc, -270, 40, 30);
    const jy = Math.abs(Math.sin(f * 0.18)) * 70;
    rr(ctx, 720, -280 - jy, 36, 40, 6); paint(ctx, '#ef5350', INK, wink(0.6));
  } else { ctx.fillStyle = '#1a1a26'; ctx.fillRect(625, -418, 330, 230); }
  ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.moveTo(625, -418); ctx.lineTo(760, -418); ctx.lineTo(680, -188); ctx.lineTo(625, -188); ctx.fill();
  ctx.restore();
}

function drawCouch(ctx, st, f) {
  rr(ctx, -470, -380, 940, 320, 100); paint(ctx, '#e8577a', INK, wink());
  ctx.fillStyle = 'rgba(120,20,50,.35)';
  for (const x of [-235, 0, 235]) { ell(ctx, x, -250, 12, 12); ctx.fill(); }
  ctx.strokeStyle = 'rgba(120,20,50,.35)'; ctx.lineWidth = wink(0.8); ctx.beginPath(); ctx.moveTo(0, -370); ctx.lineTo(0, -130); ctx.stroke();
  if (!st.noCouchPillows) {
    pillowShape(ctx, -330, -230, 190, 150, -0.2, '#ffd23f', wink());
    pillowShape(ctx, 330, -230, 190, 150, 0.2, '#4cc9f0', wink());
  }
  rr(ctx, -430, -160, 425, 120, 40); paint(ctx, '#f47a95', INK, wink());
  rr(ctx, 5, -160, 425, 120, 40); paint(ctx, '#f47a95', INK, wink());
  rr(ctx, -445, -60, 890, 175, 30); paint(ctx, '#c9415f', INK, wink());
  for (const sx of [-1, 1]) {
    rr(ctx, sx > 0 ? 405 : -555, -270, 150, 390, 70); paint(ctx, '#e8577a', INK, wink());
    rr(ctx, sx * 470 - 18, 110, 36, 40, 6); paint(ctx, '#5a3420', INK, wink(0.7));
  }
}

function drawFort(ctx, st, f) {
  for (const p of st.pillows || []) {
    if (p.t <= 0) continue;
    pillowShape(ctx, p.x, p.y, 250 * (1 + p.sq * 0.25), 160 * (1 - p.sq * 0.3), p.rot, p.col, wink());
  }
}

// front-layer props (parallax d < 1)
function drawFront(ctx, items, f) {
  for (const it of items || []) {
    if (it.type === 'popcorn') {
      ctx.save(); ctx.translate(it.x, it.y);
      for (let i = 0; i < 16; i++) { ell(ctx, -150 + hash(i) * 300, -150 - hash(i + 4) * 90, 34, 30); paint(ctx, '#fff6dc', INK, wink(0.8)); }
      ctx.beginPath(); ctx.moveTo(-200, -140); ctx.lineTo(200, -140); ctx.lineTo(150, 120); ctx.lineTo(-150, 120); ctx.closePath(); paint(ctx, '#fff', INK, wink());
      ctx.save(); ctx.clip(); ctx.fillStyle = '#ef233c'; for (let i = -4; i < 5; i += 2) { ctx.beginPath(); ctx.moveTo(i * 45, -140); ctx.lineTo(i * 45 + 45, -140); ctx.lineTo(i * 36 + 36, 120); ctx.lineTo(i * 36, 120); ctx.fill(); } ctx.restore();
      ctx.restore();
    }
    if (it.type === 'plant') {
      ctx.save(); ctx.translate(it.x, it.y);
      for (let i = 0; i < 7; i++) { ell(ctx, (i - 3) * 50, -320 - (i % 2) * 80, 45, 160, (i - 3) * 0.3 + Math.sin(f * 0.04 + i) * 0.04); paint(ctx, '#2d6a4f', INK, wink()); }
      rr(ctx, -130, -200, 260, 220, 30); paint(ctx, '#e9c46a', INK, wink());
      ctx.restore();
    }
  }
}

// ---- effects (world space, drawn over actors) ----
function drawFx(ctx, fx, f) {
  for (const e of fx || []) {
    const k = e.k == null ? 1 : e.k;
    ctx.save(); ctx.globalAlpha = clamp(e.a == null ? 1 : e.a);
    if (e.type === 'note') {
      ctx.translate(e.x, e.y); ctx.rotate(Math.sin(f * 0.15 + e.x) * 0.2);
      ctx.fillStyle = e.col || '#3a0ca3'; ctx.font = `900 ${90 * k}px Arial`; ctx.textAlign = 'center'; ctx.fillText('♪', 0, 0);
    }
    if (e.type === 'dust') { for (let i = 0; i < 5; i++) { const r = (20 + i * 9) * k; ell(ctx, e.x + (i - 2) * 30 * k, e.y - i % 2 * 12 * k, r, r * 0.7); paint(ctx, 'rgba(255,240,220,.85)', INK, wink(0.6)); } }
    if (e.type === 'sparkle') { ctx.translate(e.x, e.y); ctx.rotate(f * 0.05); ctx.fillStyle = e.col || '#fff59d'; star(ctx, 0, 0, 40 * k, 10 * k); ctx.strokeStyle = INK; ctx.lineWidth = wink(0.6); ctx.stroke(); }
    if (e.type === 'confetti') {
      for (let i = 0; i < e.n; i++) {
        const sp = 3 + hash(i) * 4, x = e.x0 + hash(i + 11) * e.w + Math.sin(f * 0.1 + i) * 30, y = e.y0 + ((f - e.f0) * sp + hash(i + 3) * e.h) % e.h;
        ctx.save(); ctx.translate(x, y); ctx.rotate(f * 0.2 + i);
        if (i % 3 === 0) { ell(ctx, 0, 0, 22, 19); paint(ctx, '#fff6dc', INK, wink(0.6)); }
        else { ctx.fillStyle = ['#ff5fa2', '#ffd23f', '#4cc9f0', '#52b788', '#c77dff'][i % 5]; ctx.fillRect(-14, -8, 28, 16); }
        ctx.restore();
      }
    }
    if (e.type === 'speed') { ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = wink(1.6); for (let i = 0; i < 5; i++) { const y = e.y + (i - 2) * 50, x = e.x + hash(i + f) * 40; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 180 * e.dir, y); ctx.stroke(); } }
    if (e.type === 'exclaim') { ctx.translate(e.x, e.y); ctx.scale(k, k); ctx.fillStyle = '#ffd23f'; ctx.strokeStyle = INK; ctx.lineWidth = wink(1.2); ctx.font = '900 130px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.strokeText(e.txt || '!', 0, 0); ctx.fillText(e.txt || '!', 0, 0); }
    if (e.type === 'fear') { ctx.strokeStyle = INK; ctx.lineWidth = wink(1.2); for (let i = 0; i < 3; i++) { ctx.beginPath(); for (let j = 0; j < 6; j++) ctx.lineTo(e.x + (i - 1) * 40 + (j % 2 ? 10 : -10), e.y + j * 20); ctx.stroke(); } }
    if (e.type === 'brushHand') {
      // a friend's arm entering from the right with a nail-polish brush
      ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); ctx.scale(e.sc || 1, e.sc || 1);
      const ink = wink() / (e.sc || 1);
      ctx.lineCap = 'round';
      ctx.strokeStyle = PLUM; ctx.lineWidth = 34 + 2 * ink; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(500, 60); ctx.stroke();
      ctx.strokeStyle = '#ff7eb6'; ctx.lineWidth = 34; ctx.stroke();
      ell(ctx, 0, 0, 24, 24); paint(ctx, '#c98e66', PLUM, ink);
      rr(ctx, -85, -7, 80, 14, 7); paint(ctx, '#2b2b3b', PLUM, ink * 0.6);
      ell(ctx, -92, 0, 12, 8); paint(ctx, '#ff4fa3', PLUM, ink * 0.6);
    }
    if (e.type === 'lines') { ctx.strokeStyle = INK; ctx.lineWidth = wink(1.4); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(e.x + Math.cos(a) * e.r, e.y + Math.sin(a) * e.r); ctx.lineTo(e.x + Math.cos(a) * (e.r + 60 * k), e.y + Math.sin(a) * (e.r + 60 * k)); ctx.stroke(); } }
    ctx.restore();
  }
}
