// Bean-head cartoon cast. Design units: soles at y=0, kid ~1000 tall. Plum outlines.
const CAST = {
  // the channel's own character "bolinha": smooth white head, yellow jacket, blue pants, white gloves + sneakers
  boy:   { skin: '#F5F5F5', hair: 'none', hc: '#9a6a3a', pj: '#F2B705', pj2: '#ffd34d', pat: 'none', pants: '#1F4E9C', slip: '#ffffff', hand: '#ffffff', bolinha: true },
  bia:   { skin: '#e8b38b', hair: 'long',   hc: '#2b1b1e', band: '#ff5fa2', pj: '#9b5de5', pj2: '#c7a4f5', pat: 'stripes', pants: '#6a3cb4', slip: '#ffd23f' },
  lara:  { skin: '#8b5a3c', hair: 'puffs',  hc: '#1e1414', band: '#ffd23f', pj: '#ffc93c', pj2: '#fff3c2', pat: 'dots',    pants: '#e09f1f', slip: '#3d85e0' },
  rita:  { skin: '#f7d4b6', hair: 'pony',   hc: '#d9542b', band: '#2ec4b6', pj: '#4fd1a1', pj2: '#b4f3dc', pat: 'stripes', pants: '#27a07a', slip: '#ff7eb6' },
  duda:  { skin: '#c98e66', hair: 'bob',    hc: '#3a2314', pj: '#ff7eb6', pj2: '#ffd0e4', pat: 'hearts',  pants: '#e2568f', slip: '#9b5de5' },
  nina:  { skin: '#f2caa6', hair: 'buns',   hc: '#f0c34a', band: '#ff5fa2', pj: '#ff9f43', pj2: '#ffd9ae', pat: 'dots',    pants: '#e5772a', slip: '#4fd1a1' },
  joana: { skin: '#6e432b', hair: 'braids', hc: '#1b1212', band: '#ff5fa2', pj: '#2ec4b6', pj2: '#a8f2ea', pat: 'stars',   pants: '#1d8f85', slip: '#ffc93c' },
  sofia: { skin: '#efc29f', hair: 'curly',  hc: '#7a4a2a', pj: '#c39bd3', pj2: '#ecdcf4', pat: 'hearts',  pants: '#9a6fb0', slip: '#ef5350', glasses: true },
  mom:   { skin: '#e8b38b', hair: 'bunTop', hc: '#2b1b1e', pj: '#3aa66b', pj2: '#86d9a8', pat: 'none',    pants: '#2d6e4f', slip: '#7a4a2a', adult: true, dress: true },
};
const GIRLS = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana', 'sofia'];

const EXPR = {
  neutral:   { eye: 'open', brow: [0, 0], mouth: 'smile0' },
  happy:     { eye: 'open', brow: [-6, 10], mouth: 'smile' },
  grin:      { eye: 'open', brow: [-8, 12], mouth: 'grin' },
  mischief:  { eye: 'half', brow: [18, 2], mouth: 'smirk' },
  surprised: { eye: 'wide', brow: [-14, 32], mouth: 'o' },
  worried:   { eye: 'open', brow: [-24, 18], mouth: 'wavy' },
  bored:     { eye: 'half', brow: [0, -6], mouth: 'flat' },
  bliss:     { eye: 'closedHappy', brow: [-6, 12], mouth: 'smile' },
  squint:    { eye: 'squint', brow: [16, -4], mouth: 'frown' },
  scream:    { eye: 'wide', brow: [-26, 50], mouth: 'scream' },
  scared:    { eye: 'wide', brow: [-26, 30], mouth: 'wavy' },
  proud:     { eye: 'closedHappy', brow: [12, 8], mouth: 'grin' },
  stern:     { eye: 'open', brow: [24, -2], mouth: 'flat' },
  spooky:    { eye: 'half', brow: [22, 0], mouth: 'grin' },
  innocent:  { eye: 'open', brow: [-12, 16], mouth: 'smile' },
  laugh:     { eye: 'closedHappy', brow: [-8, 14], mouth: 'grin' },
  shocked:   { eye: 'wide', brow: [-20, 40], mouth: 'o' },
};

// arm poses: [upper angle, elbow bend] in degrees; 0 = hanging, 90 = out, 180 = up
const POSES = {
  hang:       { L: [12, 6],   R: [12, 6] },
  controller: { L: [20, -110], R: [20, -110] },
  point:      { L: [45, -80], R: [95, -5] },
  wave:       { L: [12, 6],   R: [150, 25] },
  up:         { L: [155, 15], R: [155, 15] },
  cheeks:     { L: [95, 122], R: [95, 122] },
  hero:       { L: [45, -80], R: [168, 0] },
  reachR:     { L: [12, 6],   R: [76, 14] },
  braider:    { L: [150, -55], R: [150, -55] },
  flash:      { L: [12, 6],   R: [0, -162] },
  clap:       { L: [35, -125], R: [35, -125] },
  pillow:     { L: [30, -100], R: [30, -100] },
  hips:       { L: [45, -80], R: [45, -80] },
  card:       { L: [12, 6],   R: [150, 12] },
  cling:      { L: [110, -70], R: [110, -70] },
  boo:        { L: [120, 40], R: [120, 40] },
};
function poseOf(p) { return typeof p === 'string' ? POSES[p] : p; }
function mixPose(a, b, t) {
  a = poseOf(a); b = poseOf(b);
  return { L: [lerp(a.L[0], b.L[0], t), lerp(a.L[1], b.L[1], t)], R: [lerp(a.R[0], b.R[0], t), lerp(a.R[1], b.R[1], t)] };
}

function tube(ctx, pts, w, col, ink) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  ctx.strokeStyle = PLUM; ctx.lineWidth = w + 2 * ink; ctx.stroke();
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
}
function armJoints(side, a1, a2, sh) {
  const e = [sh[0] + side * Math.sin(a1 * D2R) * 150, sh[1] + Math.cos(a1 * D2R) * 150];
  const b = a1 + a2;
  const h = [e[0] + side * Math.sin(b * D2R) * 135, e[1] + Math.cos(b * D2R) * 135];
  return { sh, e, h, b, side };
}

function beanPath(ctx, cx, cy, rx, ry) {
  ctx.beginPath();
  for (let i = 0; i <= 48; i++) {
    const th = (i / 48) * Math.PI * 2;
    const sn = Math.sin(th);
    const x = rx * Math.cos(th) * (1 - 0.13 * Math.max(0, sn)) * (1 + 0.03 * Math.max(0, -sn));
    const y = ry * sn;
    i ? ctx.lineTo(cx + x, cy + y) : ctx.moveTo(cx + x, cy + y);
  }
  ctx.closePath();
}

function pattern(ctx, c, x0, y0, w, h) {
  ctx.fillStyle = c.pj2;
  if (c.pat === 'stripes') for (let x = x0; x < x0 + w; x += 70) ctx.fillRect(x, y0, 30, h);
  if (c.pat === 'dots') for (let y = y0 + 30; y < y0 + h; y += 70) for (let x = x0 + ((y / 70) % 2) * 35; x < x0 + w; x += 70) { ell(ctx, x, y, 14, 14); ctx.fill(); }
  if (c.pat === 'stars') for (let y = y0 + 40; y < y0 + h; y += 90) for (let x = x0 + ((y / 90) % 2) * 45 + 20; x < x0 + w; x += 90) star(ctx, x, y, 20, 9);
  if (c.pat === 'hearts') for (let y = y0 + 40; y < y0 + h; y += 85) for (let x = x0 + ((y / 85) % 2) * 42 + 20; x < x0 + w; x += 85) heart(ctx, x, y, 16);
}
function star(ctx, x, y, r1, r2, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) { const r = i % 2 ? r2 : r1; const a = -Math.PI / 2 + (i * Math.PI) / 5; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
  ctx.closePath(); if (fill) ctx.fillStyle = fill; ctx.fill();
}
function heart(ctx, x, y, r) {
  ctx.beginPath(); ctx.moveTo(x, y + r);
  ctx.bezierCurveTo(x - r * 2, y - r * 0.4, x - r * 0.6, y - r * 1.6, x, y - r * 0.5);
  ctx.bezierCurveTo(x + r * 0.6, y - r * 1.6, x + r * 2, y - r * 0.4, x, y + r);
  ctx.fill();
}

// ---- hair ----
function hairBack(ctx, c, ink, a) {
  ctx.fillStyle = c.hc;
  const st = c.hair;
  const P = () => paint(ctx, c.hc, PLUM, ink);
  if (st === 'long') { rr(ctx, -232, -1000, 464, 480, [210, 210, 80, 80]); P(); }
  if (st === 'bob') { rr(ctx, -236, -1012, 472, 340, [210, 210, 90, 90]); P(); }
  if (st === 'puffs') { ell(ctx, -200, -990, 105, 100); P(); ell(ctx, 200, -990, 105, 100); P(); }
  if (st === 'buns') { ell(ctx, -140, -1035, 82, 80); P(); ell(ctx, 140, -1035, 82, 80); P(); }
  if (st === 'bunTop') { ell(ctx, 0, -1050, 95, 85); P(); }
  if (st === 'pony') { const sw = Math.sin((a.t || 0) * 3.2) * 0.15; ell(ctx, 230, -880, 70, 175, -0.35 + sw); P(); }
  if (st === 'curly') {
    for (let i = 0; i <= 12; i++) { const th = Math.PI * (0.95 + i * 0.1); ell(ctx, Math.cos(th) * 215, -800 + Math.sin(th) * 235, 70, 70); P(); }
    ell(ctx, -215, -700, 66, 66); P(); ell(ctx, 215, -700, 66, 66); P();
  }
  if (st === 'braids') {
    for (const sx of [-1, 1]) {
      for (let i = 0; i < 7; i++) { ell(ctx, sx * (190 + i * 6), -820 + i * 50, 32, 30); P(); }
      ctx.fillStyle = c.band; ell(ctx, sx * 232, -455, 22, 22); paint(ctx, c.band, PLUM, ink);
    }
  }
}
function hairFront(ctx, c, ink, a) {
  const st = c.hair;
  if (st === 'none') return;
  ctx.beginPath();
  ctx.moveTo(-216, -800);
  ctx.bezierCurveTo(-236, -1112, 236, -1112, 216, -800);
  if (st === 'boy') {
    ctx.bezierCurveTo(196, -880, 150, -905, 110, -880);
    ctx.lineTo(70, -915); ctx.lineTo(30, -878); ctx.lineTo(-15, -918); ctx.lineTo(-60, -882); ctx.lineTo(-110, -912);
    ctx.bezierCurveTo(-170, -890, -205, -860, -216, -800);
  } else if (st === 'bob' || st === 'buns') {
    ctx.lineTo(200, -888);
    for (let i = 0; i < 5; i++) { const x0 = 200 - i * 80; ctx.quadraticCurveTo(x0 - 40, -850, x0 - 80, -888); }
    ctx.lineTo(-216, -800);
  } else if (st === 'curly') {
    ctx.lineTo(205, -880);
    for (let i = 0; i < 5; i++) { const x0 = 205 - i * 82; ctx.quadraticCurveTo(x0 - 41, -950, x0 - 82, -880); }
    ctx.lineTo(-216, -800);
  } else {
    ctx.bezierCurveTo(196, -905, 70, -935, 30, -905);
    ctx.bezierCurveTo(-40, -930, -190, -895, -216, -800);
  }
  ctx.closePath(); paint(ctx, c.hc, PLUM, ink);
  if (st === 'boy') {
    ctx.beginPath(); ctx.moveTo(10, -1022); ctx.quadraticCurveTo(50, -1120, 125, -1078); ctx.quadraticCurveTo(70, -1070, 58, -1018); ctx.closePath();
    paint(ctx, c.hc, PLUM, ink);
  }
  if (c.band) { ctx.beginPath(); ctx.ellipse(0, -820, 222, 190, 0, Math.PI * 1.08, Math.PI * 1.92); ctx.strokeStyle = PLUM; ctx.lineWidth = 34 + 2 * ink; ctx.stroke(); ctx.strokeStyle = c.band; ctx.lineWidth = 34; ctx.stroke(); }
  // shine
  ctx.beginPath(); ctx.ellipse(-90, -975, 60, 16, -0.35, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fill();
}

function boyBraids(ctx, c, ink, p, up) {
  if (p <= 0) return;
  for (const sx of [-1, 1]) {
    const pp = sx < 0 ? clamp(p * 2) : clamp(p * 2 - 1);
    if (pp <= 0) continue;
    const g = backOut(pp);
    const ang = up ? -0.5 : 0.75;
    for (let i = 0; i < 4; i++) {
      const d = (60 + i * 45) * g;
      const x = sx * (205 + Math.cos(ang) * d), y = -860 + Math.sin(ang) * d;
      ell(ctx, x, y, 28 * g, 25 * g); paint(ctx, c.hc, PLUM, ink);
    }
    const d = (60 + 4 * 45) * g, bx = sx * (205 + Math.cos(ang) * d), by = -860 + Math.sin(ang) * d;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - 40 * g, by - 32 * g); ctx.lineTo(bx - 40 * g, by + 32 * g); ctx.closePath(); paint(ctx, '#ff5fa2', PLUM, ink);
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + 40 * g, by - 32 * g); ctx.lineTo(bx + 40 * g, by + 32 * g); ctx.closePath(); paint(ctx, '#ff5fa2', PLUM, ink);
    ell(ctx, bx, by, 14 * g, 14 * g); paint(ctx, '#ff8fc0', PLUM, ink);
  }
}

// ---- face ----
function face(ctx, c, a, ink, f, seed) {
  const e = EXPR[a.expr || 'neutral'];
  const look = a.look || [0, 0];
  const bl = a.noBlink ? 0 : blinkAt(f, seed);
  // cheeks
  ctx.fillStyle = 'rgba(255,110,140,.35)'; ell(ctx, -128, -728, 40, 24); ctx.fill(); ell(ctx, 128, -728, 40, 24); ctx.fill();
  for (const sx of [-1, 1]) {
    const x = sx * 72, y = -805;
    if (e.eye === 'closedHappy' || (bl > 0.7 && e.eye !== 'squint')) {
      ctx.beginPath();
      if (e.eye === 'closedHappy') { ctx.moveTo(x - 34, y + 10); ctx.quadraticCurveTo(x, y - 36, x + 34, y + 10); }
      else { ctx.moveTo(x - 34, y + 4); ctx.quadraticCurveTo(x, y + 20, x + 34, y + 4); }
      paint(ctx, null, PLUM, ink * 1.5);
    } else if (e.eye === 'squint') {
      ctx.beginPath(); ctx.moveTo(x - sx * 30, y - 22); ctx.lineTo(x + sx * 24, y); ctx.lineTo(x - sx * 30, y + 22); paint(ctx, null, PLUM, ink * 1.6);
    } else if (c.bolinha) {
      const wide = e.eye === 'wide';
      const rx = wide ? 34 : 27, ry = (wide ? 52 : 42) * (1 - bl * 0.9);
      ell(ctx, x + look[0] * 10, y + look[1] * 10, rx, ry); ctx.fillStyle = '#141414'; ctx.fill();
      ell(ctx, x + look[0] * 10 - 9, y + look[1] * 10 - 14, 8, 10); ctx.fillStyle = '#fff'; ctx.fill();
      if (e.eye === 'half') { ctx.fillStyle = c.skin; ctx.fillRect(x - 50, y - 70, 100, 66); ctx.beginPath(); ctx.moveTo(x - 40, y - 4); ctx.lineTo(x + 40, y - 4); paint(ctx, null, PLUM, ink * 1.3); }
    } else {
      const wide = e.eye === 'wide';
      const rx = wide ? 46 : 38, ry = (wide ? 60 : 50) * (1 - bl * 0.9);
      ell(ctx, x, y, rx, ry); paint(ctx, '#ffffff', PLUM, ink);
      ctx.save(); ell(ctx, x, y, rx, ry); ctx.clip();
      const pr = wide ? 17 : 23;
      ell(ctx, x + look[0] * 15, y + look[1] * 16 + 4, pr, pr); ctx.fillStyle = '#24152c'; ctx.fill();
      ell(ctx, x + look[0] * 15 - 8, y + look[1] * 16 - 6, 7, 7); ctx.fillStyle = '#fff'; ctx.fill();
      if (e.eye === 'half') { ctx.fillStyle = c.skin; ctx.fillRect(x - 60, y - 70, 120, 70); ctx.beginPath(); ctx.moveTo(x - 50, y); ctx.lineTo(x + 50, y); paint(ctx, null, PLUM, ink * 1.3); }
      ctx.restore();
    }
    // brows
    const [ang, raise] = e.brow;
    const by = -880 - raise;
    ctx.beginPath(); ctx.moveTo(sx * 40, by + ang * 1.4); ctx.lineTo(sx * 108, by - ang * 0.5); paint(ctx, null, PLUM, ink * 2.2);
  }
  if (c.glasses) {
    for (const sx of [-1, 1]) { ell(ctx, sx * 72, -805, 62, 58); paint(ctx, 'rgba(200,230,255,.18)', '#5b2a6e', ink * 1.6); }
    ctx.beginPath(); ctx.moveTo(-12, -812); ctx.lineTo(12, -812); paint(ctx, null, '#5b2a6e', ink * 1.6);
  }
  // nose
  if (!c.bolinha) { ctx.beginPath(); ctx.moveTo(-14, -752); ctx.quadraticCurveTo(0, -738, 14, -752); paint(ctx, null, PLUM, ink); }
  // mouth
  const m = a.mouth || e.mouth, my = -700;
  ctx.beginPath();
  if (m === 'smile0') { ctx.moveTo(-38, my - 6); ctx.quadraticCurveTo(0, my + 18, 38, my - 6); paint(ctx, null, PLUM, ink * 1.3); }
  else if (m === 'smile') { ctx.moveTo(-58, my - 14); ctx.quadraticCurveTo(0, my + 44, 58, my - 14); paint(ctx, null, PLUM, ink * 1.4); }
  else if (m === 'grin') {
    ctx.moveTo(-72, my - 22); ctx.lineTo(72, my - 22); ctx.quadraticCurveTo(0, my + 95, -72, my - 22); ctx.closePath(); paint(ctx, '#7a1f3b', PLUM, ink);
    ctx.save(); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(-80, my - 30, 160, 26); ell(ctx, 0, my + 48, 34, 20); ctx.fillStyle = '#ff7b9c'; ctx.fill(); ctx.restore();
  }
  else if (m === 'o') { ell(ctx, 0, my, 22, 28); paint(ctx, '#5a1730', PLUM, ink); }
  else if (m === 'scream') {
    ell(ctx, 0, my + 10, 62, 92); paint(ctx, '#5a1730', PLUM, ink);
    ctx.save(); ell(ctx, 0, my + 10, 62, 92); ctx.clip(); ell(ctx, 0, my + 85, 44, 34); ctx.fillStyle = '#ff7b9c'; ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-60, my - 85, 120, 22); ctx.restore();
  }
  else if (m === 'flat') { ctx.moveTo(-40, my); ctx.lineTo(40, my); paint(ctx, null, PLUM, ink * 1.4); }
  else if (m === 'wavy') { ctx.moveTo(-48, my); for (let i = 1; i <= 6; i++) ctx.lineTo(-48 + i * 16, my + (i % 2 ? -10 : 8)); paint(ctx, null, PLUM, ink * 1.3); }
  else if (m === 'smirk') { ctx.moveTo(-44, my + 2); ctx.quadraticCurveTo(20, my + 18, 54, my - 22); paint(ctx, null, PLUM, ink * 1.4); }
  else if (m === 'frown') { ctx.moveTo(-40, my + 12); ctx.quadraticCurveTo(0, my - 22, 40, my + 12); paint(ctx, null, PLUM, ink * 1.4); }
}

// ---- hands & props ----
function hand(ctx, c, j, ink, a, which) {
  const [hx, hy] = j.h;
  const fingers = which === 'R' && a.nails != null;
  if (fingers) {
    // fingers point along the lower arm
    const dir = [j.side * Math.sin(j.b * D2R), Math.cos(j.b * D2R)];
    const ang = Math.atan2(dir[1], dir[0]);
    for (let i = 0; i < 4; i++) {
      const fa = ang + (-0.75 + i * 0.5);
      const fx = hx + Math.cos(fa) * 46, fy = hy + Math.sin(fa) * 46;
      ell(ctx, fx, fy, 19, 19); paint(ctx, c.hand || c.skin, PLUM, ink);
      if (i < a.nails) { const nx = hx + Math.cos(fa) * 56, ny = hy + Math.sin(fa) * 56; ell(ctx, nx, ny, 11, 9, fa); paint(ctx, '#ff4fa3', PLUM, ink * 0.6); ell(ctx, nx - 3, ny - 3, 3.5, 3.5); ctx.fillStyle = '#fff'; ctx.fill(); }
    }
    // thumb
    const ta = ang + (j.side > 0 ? -1.6 : 1.6);
    ell(ctx, hx + Math.cos(ta) * 36, hy + Math.sin(ta) * 36, 18, 18); paint(ctx, c.hand || c.skin, PLUM, ink);
    if (a.nails >= 5) { ell(ctx, hx + Math.cos(ta) * 46, hy + Math.sin(ta) * 46, 10, 8, ta); paint(ctx, '#ff4fa3', PLUM, ink * 0.6); }
  }
  ell(ctx, hx, hy, 40, 40); paint(ctx, c.hand || c.skin, PLUM, ink);
}

function drawProps(ctx, c, a, J, ink, f) {
  const P = a.props || {};
  if (P.controller) {
    const x = (J.L.h[0] + J.R.h[0]) / 2, y = (J.L.h[1] + J.R.h[1]) / 2 - 10;
    rr(ctx, x - 85, y - 34, 170, 68, 34); paint(ctx, '#4a4f63', PLUM, ink);
    ell(ctx, x + 40, y - 6, 11, 11); paint(ctx, '#ef5350'); ell(ctx, x + 60, y + 10, 11, 11); paint(ctx, '#ffd23f');
    ctx.fillStyle = '#9aa0b8'; ctx.fillRect(x - 60, y - 6, 34, 12); ctx.fillRect(x - 49, y - 17, 12, 34);
  }
  if (P.card) {
    const [hx, hy] = J.R.h;
    rr(ctx, hx - 60, hy - 190, 120, 150, 10); paint(ctx, '#fff', PLUM, ink);
    ctx.fillStyle = '#d62839'; ctx.font = '900 86px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.save(); if ((a.flip || 1) < 0) { ctx.translate(hx, 0); ctx.scale(-1, 1); ctx.translate(-hx, 0); } ctx.fillText('10', hx, hy - 112); ctx.restore();
  }
  if (P.flashlight) {
    const [hx, hy] = J.R.h;
    rr(ctx, hx - 20, hy - 95, 40, 100, 10); paint(ctx, '#ffb703', PLUM, ink);
    rr(ctx, hx - 30, hy - 120, 60, 34, 10); paint(ctx, '#3a3f58', PLUM, ink);
    ell(ctx, hx, hy - 122, 24, 8); paint(ctx, '#fffbe0');
  }
  if (P.pillow) {
    const x = (J.L.h[0] + J.R.h[0]) / 2, y = (J.L.h[1] + J.R.h[1]) / 2;
    pillowShape(ctx, x, y - 20, 300, 200, 0, P.pillow, ink);
  }
  if (P.polish) {
    const [hx, hy] = J.R.h;
    rr(ctx, hx - 22, hy - 100, 44, 60, 10); paint(ctx, '#ff4fa3', PLUM, ink);
    rr(ctx, hx - 12, hy - 135, 24, 40, 6); paint(ctx, '#2b2b3b', PLUM, ink);
  }
}

function pillowShape(ctx, x, y, w, h, rot, col, ink) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const hw = w / 2, hh = h / 2, b = 0.14;
  ctx.beginPath();
  ctx.moveTo(-hw, -hh);
  ctx.quadraticCurveTo(0, -hh - h * b, hw, -hh);
  ctx.quadraticCurveTo(hw + w * b * 0.6, 0, hw, hh);
  ctx.quadraticCurveTo(0, hh + h * b, -hw, hh);
  ctx.quadraticCurveTo(-hw - w * b * 0.6, 0, -hw, -hh);
  ctx.closePath(); paint(ctx, col, INK, ink);
  ctx.save(); ctx.clip();
  ctx.fillStyle = 'rgba(255,255,255,.25)'; ell(ctx, -hw * 0.35, -hh * 0.4, hw * 0.45, hh * 0.25, -0.2); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.12)'; ell(ctx, hw * 0.2, hh * 0.75, hw * 0.9, hh * 0.35); ctx.fill();
  ctx.restore();
  ctx.setLineDash([ink * 2, ink * 2]); rr(ctx, -hw * 0.82, -hh * 0.75, w * 0.82, h * 0.75, 20); ctx.strokeStyle = 'rgba(40,10,40,.35)'; ctx.lineWidth = ink * 0.7; ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
}

// ---- the kid ----
// a: {who,x,y,s,pose,expr,look,tilt,sit,walk,flip,props,nails,braids,braidUp,cape,plaque,hop,sq,rot,bob}
function drawKid(ctx, a, f) {
  const c = CAST[a.who];
  const s = a.s || 0.5, flip = a.flip || 1;
  const ink = INKPX / (ZOOM * s);
  const seed = a.seed != null ? a.seed : hashStr(a.who);
  const t = f / FPS; a.t = t;
  ctx.save();
  ctx.translate(a.x, a.y - (a.hop || 0));
  if (a.rot) ctx.rotate(a.rot);
  const sq = a.sq || 0; // + squash, - stretch
  ctx.scale(s * flip * (1 + sq * 0.5), s * (1 - sq));
  if (!a.sit && !a.noShadow) { ell(ctx, 0, (a.hop || 0) / s, 190 * (1 - Math.min(0.5, (a.hop || 0) / 300)), 34); ctx.fillStyle = 'rgba(30,10,40,.22)'; ctx.fill(); }
  const up = c.adult ? 240 : 0;
  const walking = a.walk != null;
  const bob = (a.bob || 0) + (walking ? -Math.abs(Math.sin(a.walk)) * 30 : 0) + Math.sin(t * 2.1 + seed) * 4;
  const hipY = -250 - up + bob;
  const breath = 1 + 0.014 * Math.sin(t * 2.4 + seed * 5);

  // cape (behind everything)
  if (a.cape) {
    const wv = Math.sin(t * 7 + 1) * 40, wv2 = Math.sin(t * 9) * 30;
    ctx.beginPath();
    ctx.moveTo(-150, -560 - up + bob);
    ctx.quadraticCurveTo(-260 + wv2, -300, -300 + wv, -40);
    for (let i = 0; i < 4; i++) ctx.quadraticCurveTo(-300 + wv + (i + 0.5) * 160, -10 + (i % 2 ? 20 : -30), -300 + wv + (i + 1) * 160, -40 + Math.sin(t * 8 + i) * 20);
    ctx.quadraticCurveTo(300 + wv2, -320, 150, -560 - up + bob);
    ctx.closePath(); paint(ctx, '#e63946', PLUM, ink);
    ctx.save(); ctx.clip(); ctx.fillStyle = '#ffd23f'; for (let i = 0; i < 6; i++) star(ctx, -180 + i * 75 + wv * 0.3, -250 + (i % 2) * 120, 26, 11); ctx.restore();
  }

  // legs
  for (const sx of [-1, 1]) {
    const hip = [sx * 62, hipY];
    let foot;
    if (a.sit) foot = [sx * 92, -110 + bob];
    else {
      const L = 220 + up;
      const ph = walking ? Math.sin(a.walk + (sx > 0 ? Math.PI : 0)) * 0.42 : 0;
      foot = [hip[0] + Math.sin(ph) * L, hip[1] + Math.cos(ph) * L - (walking ? Math.max(0, Math.sin(a.walk + (sx > 0 ? Math.PI : 0))) * 30 : 0)];
      if (!walking) foot[1] = -30;
    }
    tube(ctx, [hip, foot], 84, c.pants, ink);
    ell(ctx, foot[0] + sx * 8, foot[1] + 8, 66, 32); paint(ctx, c.slip, PLUM, ink);
    ell(ctx, foot[0] + sx * 8 - 14, foot[1] - 2, 20, 8); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fill();
  }

  ctx.translate(0, -up + bob);
  ctx.translate(0, -250); ctx.scale(1, breath); ctx.translate(0, 250);

  const tilt = (a.tilt || 0) + Math.sin(t * 1.6 + seed * 2) * 0.02;
  const headT = () => { ctx.translate(0, -580); ctx.rotate(tilt); ctx.translate(0, 580); };

  // back hair
  ctx.save(); headT(); hairBack(ctx, c, ink, a); ctx.restore();

  // torso
  if (c.dress) {
    ctx.beginPath(); ctx.moveTo(-140, -585); ctx.lineTo(140, -585); ctx.lineTo(230, -60); ctx.quadraticCurveTo(0, -20, -230, -60); ctx.closePath();
    paint(ctx, c.pj, PLUM, ink);
    ctx.fillStyle = c.pj2; ctx.fillRect(-150, -330, 300, 26);
  } else {
    rr(ctx, -150, -590, 300, 365, [115, 115, 70, 70]); paint(ctx, c.pj, PLUM, ink);
    ctx.save(); rr(ctx, -150, -590, 300, 365, [115, 115, 70, 70]); ctx.clip(); pattern(ctx, c, -150, -590, 300, 365);
    ctx.fillStyle = 'rgba(40,0,60,.12)'; ctx.fillRect(-150, -300, 300, 80); ctx.restore();
    rr(ctx, -150, -590, 300, 365, [115, 115, 70, 70]); paint(ctx, null, PLUM, ink);
  }
  // collar + buttons
  if (c.bolinha) { rr(ctx, -152, -280, 304, 52, 20); paint(ctx, '#d99e00', PLUM, ink); rr(ctx, -70, -598, 140, 40, 18); paint(ctx, '#d99e00', PLUM, ink); }
  else { ctx.beginPath(); ctx.moveTo(-60, -585); ctx.lineTo(0, -520); ctx.lineTo(60, -585); paint(ctx, c.pj2, PLUM, ink);
  for (let i = 0; i < 3; i++) { ell(ctx, 0, -490 + i * 70, 11, 11); paint(ctx, '#fff', PLUM, ink * 0.6); } }
  // neck
  if (!c.bolinha) { rr(ctx, -38, -612, 76, 40, 16); paint(ctx, c.skin, PLUM, ink); }

  // plaque
  if (a.plaque) {
    const g = backOut(a.plaque);
    ctx.save(); ctx.translate(0, -470); ctx.scale(g, g); ctx.rotate(Math.sin(t * 3) * 0.04);
    ctx.beginPath(); ctx.moveTo(-50, -115); ctx.lineTo(-85, -30); ctx.moveTo(50, -115); ctx.lineTo(85, -30); paint(ctx, null, PLUM, ink);
    rr(ctx, -118, -40, 236, 100, 14); paint(ctx, '#fffaf0', '#d62839', ink * 1.6);
    ctx.fillStyle = '#d62839'; ctx.font = '900 50px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (flip < 0) ctx.scale(-1, 1);
    ctx.fillText('JURADO', 0, 12);
    ctx.restore();
  }

  // head
  ctx.save(); headT();
  if (c.bolinha) { ell(ctx, 0, -800, 222, 222); paint(ctx, c.skin, PLUM, ink); ell(ctx, -80, -905, 70, 32, -0.5); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fill(); ctx.save(); ell(ctx, 0, -800, 222, 222); ctx.clip(); ell(ctx, 60, -700, 230, 200); ctx.fillStyle = 'rgba(120,120,160,.10)'; ctx.fill(); ctx.restore(); }
  else { for (const sx of [-1, 1]) { ell(ctx, sx * 198, -785, 36, 44); paint(ctx, c.skin, PLUM, ink); }
  beanPath(ctx, 0, -790, 205, 228); paint(ctx, c.skin, PLUM, ink); }
  face(ctx, c, a, ink, f, seed);
  hairFront(ctx, c, ink, a);
  if (a.braids) boyBraids(ctx, c, ink, a.braids, a.braidUp);
  ctx.restore();

  // arms
  const pose = poseOf(a.pose || 'hang');
  const swing = walking ? Math.sin(a.walk) * 35 : 0;
  const J = {
    L: armJoints(-1, pose.L[0] + swing, pose.L[1], [-132, -535]),
    R: armJoints(1, pose.R[0] - swing, pose.R[1], [132, -535]),
  };
  for (const k of ['L', 'R']) {
    const j = J[k];
    tube(ctx, [j.sh, j.e, j.h], 62, c.pj, ink);
    hand(ctx, c, j, ink, a, k);
  }
  drawProps(ctx, c, a, J, ink, f);
  // sweat
  if (a.sweat) {
    const sy = ((t * 40) % 60);
    ctx.save(); ctx.translate(230, -930 + sy); ctx.globalAlpha = a.sweat;
    ctx.beginPath(); ctx.moveTo(0, -40); ctx.quadraticCurveTo(28, 0, 0, 22); ctx.quadraticCurveTo(-28, 0, 0, -40); paint(ctx, '#9fe0ff', PLUM, ink);
    ctx.restore();
  }
  ctx.restore();
  return J;
}

// world position of a kid's head centre
function headPos(a) {
  const c = CAST[a.who], s = a.s || 0.5, up = c.adult ? 240 : 0;
  return [a.x, a.y - (a.hop || 0) + (-790 - up) * s * (1 - (a.sq || 0))];
}

// ---- cat ----
function drawCat(ctx, a, f) {
  const s = a.s || 0.5, ink = INKPX / (ZOOM * s), t = f / FPS;
  ctx.save(); ctx.translate(a.x, a.y); ctx.scale(s, s);
  const O = '#f39c3d', CR = '#ffe3c2';
  // tail
  const tw = Math.sin(t * 3) * 40;
  ctx.beginPath(); ctx.moveTo(90, -40); ctx.quadraticCurveTo(230, -60, 200 + tw, -230);
  ctx.strokeStyle = PLUM; ctx.lineWidth = 44 + 2 * ink; ctx.lineCap = 'round'; ctx.stroke(); ctx.strokeStyle = O; ctx.lineWidth = 44; ctx.stroke();
  ell(ctx, 0, -120, 125, 135); paint(ctx, O, PLUM, ink);
  ell(ctx, 0, -95, 68, 92); paint(ctx, CR);
  for (const sx of [-1, 1]) { ell(ctx, sx * 48, -14, 42, 26); paint(ctx, CR, PLUM, ink); }
  // head
  ctx.save(); ctx.translate(0, -300); ctx.rotate(Math.sin(t * 1.3) * 0.08 + (a.tilt || 0)); ctx.translate(0, 300);
  for (const sx of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(sx * 30, -380); ctx.lineTo(sx * 100, -455); ctx.lineTo(sx * 118, -330); ctx.closePath(); paint(ctx, O, PLUM, ink);
    ctx.beginPath(); ctx.moveTo(sx * 55, -380); ctx.lineTo(sx * 96, -425); ctx.lineTo(sx * 104, -355); ctx.closePath(); paint(ctx, '#ff9fb5');
  }
  ell(ctx, 0, -300, 132, 112); paint(ctx, O, PLUM, ink);
  ctx.fillStyle = '#d97a1f'; for (const dx of [-36, 0, 36]) { rr(ctx, dx - 9, -410, 18, 48, 9); ctx.fill(); }
  const bl = blinkAt(f, 77);
  for (const sx of [-1, 1]) {
    if (bl > 0.7 || a.happy) { ctx.beginPath(); ctx.moveTo(sx * 50 - 26, -305); ctx.quadraticCurveTo(sx * 50, -335, sx * 50 + 26, -305); paint(ctx, null, PLUM, ink * 1.5); continue; }
    ell(ctx, sx * 50, -310, 28, 34); paint(ctx, '#9be36d', PLUM, ink);
    ell(ctx, sx * 50, -308, 9, 26); ctx.fillStyle = '#1c1222'; ctx.fill();
    ell(ctx, sx * 50 - 9, -322, 7, 7); ctx.fillStyle = '#fff'; ctx.fill();
  }
  ctx.beginPath(); ctx.moveTo(-12, -270); ctx.lineTo(12, -270); ctx.lineTo(0, -256); ctx.closePath(); paint(ctx, '#ff7b9c', PLUM, ink * 0.6);
  if (a.meow > 0) { ell(ctx, 0, -232, 20, 26 * a.meow + 4); paint(ctx, '#7a1f3b', PLUM, ink); }
  else { ctx.beginPath(); ctx.moveTo(-26, -240); ctx.quadraticCurveTo(-13, -228, 0, -250); ctx.quadraticCurveTo(13, -228, 26, -240); paint(ctx, null, PLUM, ink); }
  ctx.strokeStyle = PLUM; ctx.lineWidth = ink * 0.7;
  for (const sx of [-1, 1]) for (const dy of [-12, 6]) { ctx.beginPath(); ctx.moveTo(sx * 60, -258 + dy * 0.3); ctx.lineTo(sx * 160, -268 + dy); ctx.stroke(); }
  ctx.restore();
  ctx.restore();
}
