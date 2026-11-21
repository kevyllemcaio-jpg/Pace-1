// engine: layers (room / mid / front), camera, DOF blur, lighting, post
const CV = document.getElementById('c');
const CTX = CV.getContext('2d');
const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
const LY = { room: mk(), mid: mk(), front: mk(), dark: mk() };

function camAt(sh, f) {
  const K = sh.cam;
  let c;
  if (f <= K[0].f) c = Object.assign({}, K[0]);
  else if (f >= K[K.length - 1].f) c = Object.assign({}, K[K.length - 1]);
  else for (let i = 0; i < K.length - 1; i++) {
    const a = K[i], b = K[i + 1];
    if (f >= a.f && f <= b.f) {
      const t = (f - a.f) / (b.f - a.f);
      const e = b.e === 'o' ? easeOut(t) : b.e === 'l' ? t : sstep(t);
      c = { x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e), z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), e)), r: lerp(a.r || 0, b.r || 0, e) };
    }
  }
  c.r = c.r || 0;
  // creep: nothing is ever static
  c.x += Math.sin(f * 0.031) * 4 / c.z; c.y += Math.cos(f * 0.027) * 4 / c.z;
  // impact kicks (flip-shake, 7 frames)
  for (const k of sh.kicks || []) {
    const d = f - k.f;
    if (d >= 0 && d < 7) { const amp = k.a * (1 - d / 7) * (d % 2 ? 1 : -1); c.x += amp / c.z; c.y += amp * 0.6 / c.z; c.r += amp * 0.08; }
  }
  return c;
}
function setCam(g, cam, d = 1) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.translate(W / 2, H / 2); g.rotate(cam.r * D2R);
  const k = cam.z / d; g.scale(k, k); g.translate(-cam.x, -cam.y);
}
function toScreen(cam, x, y) {
  const dx = (x - cam.x) * cam.z, dy = (y - cam.y) * cam.z, r = cam.r * D2R;
  return [W / 2 + dx * Math.cos(r) - dy * Math.sin(r), H / 2 + dx * Math.sin(r) + dy * Math.cos(r)];
}
function drawActor(g, a, f) { if (a.cat) drawCat(g, a, f); else drawKid(g, a, f); }

function applyLight(mode, lights, cam) {
  const g = CTX;
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (mode === 'eve' || mode === 'gold') {
    g.globalCompositeOperation = 'multiply'; g.fillStyle = mode === 'gold' ? '#ffe6bf' : '#fff0dc'; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'screen';
    const r = g.createRadialGradient(W * 0.3, H * 0.25, 0, W * 0.3, H * 0.25, H * 0.7);
    r.addColorStop(0, mode === 'gold' ? 'rgba(255,200,90,.30)' : 'rgba(255,210,150,.14)'); r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'source-over';
  } else if (mode === 'dark') {
    const d = LY.dark.getContext('2d');
    d.setTransform(1, 0, 0, 1, 0, 0); d.globalCompositeOperation = 'source-over';
    d.clearRect(0, 0, W, H); d.fillStyle = 'rgba(8,12,46,0.84)'; d.fillRect(0, 0, W, H);
    d.globalCompositeOperation = 'destination-out';
    for (const L of lights || []) {
      const [sx, sy] = toScreen(cam, L.x, L.y), r = L.r * cam.z;
      const gr = d.createRadialGradient(sx, sy, 0, sx, sy, r);
      gr.addColorStop(0, `rgba(0,0,0,${L.i})`); gr.addColorStop(0.55, `rgba(0,0,0,${L.i * 0.75})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
      d.fillStyle = gr; d.fillRect(sx - r, sy - r, 2 * r, 2 * r);
    }
    d.globalCompositeOperation = 'source-over';
    g.drawImage(LY.dark, 0, 0);
    g.globalCompositeOperation = 'screen';
    for (const L of lights || []) {
      const [sx, sy] = toScreen(cam, L.x, L.y), r = L.r * cam.z * 0.8;
      const gr = g.createRadialGradient(sx, sy, 0, sx, sy, r);
      gr.addColorStop(0, L.col || 'rgba(255,200,90,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(sx - r, sy - r, 2 * r, 2 * r);
    }
    g.globalCompositeOperation = 'source-over';
  }
}

function renderFrame(f) {
  const sh = shotAt(f);
  const S = sh.build(f, f - sh.f0);
  const cam = camAt(sh, f);
  ZOOM = cam.z; INKPX = clamp(4.2 * Math.pow(cam.z, 0.42), 3, 10);
  const st = Object.assign({ f }, S.world || {});
  const acts = (S.actors || []).slice().sort((a, b) => a.y - b.y);

  const r = LY.room.getContext('2d');
  r.setTransform(1, 0, 0, 1, 0, 0); r.clearRect(0, 0, W, H); setCam(r, cam);
  drawWall(r, st, f); drawDecor(r, st, f); drawClock(r, st, f); drawWindow(r, st, cam, f); drawDoor(r, st); drawFloor(r, st);
  for (const a of acts) if (a.layer === 'back') drawActor(r, a, f);
  drawTV(r, st, f); drawCouch(r, st, f); drawFort(r, st, f);

  const m = LY.mid.getContext('2d');
  m.setTransform(1, 0, 0, 1, 0, 0); m.clearRect(0, 0, W, H); setCam(m, cam);
  for (const a of acts) if (a.layer !== 'back') drawActor(m, a, f);
  drawFx(m, S.fx, f);

  const fr = LY.front.getContext('2d');
  fr.setTransform(1, 0, 0, 1, 0, 0); fr.clearRect(0, 0, W, H);
  if (S.front) { setCam(fr, cam, 0.8); ZOOM = cam.z / 0.8; drawFront(fr, S.front, f); ZOOM = cam.z; }

  const dof = sh.dof || {};
  CTX.setTransform(1, 0, 0, 1, 0, 0); CTX.fillStyle = '#20142c'; CTX.fillRect(0, 0, W, H);
  for (const k of ['room', 'mid', 'front']) {
    const b = dof[k] || 0;
    CTX.filter = b ? `blur(${b}px)` : 'none';
    CTX.drawImage(LY[k], 0, 0);
  }
  CTX.filter = 'none';
  applyLight(sh.light(f), S.lights, cam);
  // grade + vignette
  const v = CTX.createRadialGradient(W / 2, H * 0.45, W * 0.45, W / 2, H * 0.5, H * 0.72);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(30,8,40,.42)');
  CTX.fillStyle = v; CTX.fillRect(0, 0, W, H);
  for (const fl of FLASHES) { const d = f - fl; if (d >= 0 && d < 6) { CTX.fillStyle = `rgba(255,255,255,${1 - d / 6})`; CTX.fillRect(0, 0, W, H); } }
  return CV.toDataURL('image/jpeg', 0.93);
}
makePatterns(CTX);
window.renderFrame = renderFrame;
window.ready = true;
