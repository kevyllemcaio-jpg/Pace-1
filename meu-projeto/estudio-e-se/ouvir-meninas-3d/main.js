// 3D "E se você pudesse ouvir o que toda menina pensa de você?" — cinematic purple style
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const W = 1080, H = 1920, TOTAL = 894;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H); renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.35;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#2a1446'); scene.fog = new THREE.Fog('#3a1d5e', 12, 30);
const camera = new THREE.PerspectiveCamera(46, W / H, 0.05, 80);
const out = document.createElement('canvas'); out.width = W; out.height = H; const O = out.getContext('2d');
document.body.appendChild(out);

const mat = (c, r = 0.55, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: r, metalness: 0 }, o));
function M(geo, m, p) { const x = new THREE.Mesh(geo, typeof m === 'string' ? mat(m) : m); x.castShadow = true; x.receiveShadow = true; if (p) x.position.set(...p); return x; }
const box = (w, h, d, c, p, r, o) => M(new THREE.BoxGeometry(w, h, d), mat(c, r ?? 0.7, o), p);
const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };

// ---------- lights
scene.add(new THREE.HemisphereLight('#b39cff', '#4a2a5e', 1.6));
const key = new THREE.DirectionalLight('#ffe2c4', 3.0); key.position.set(3, 7, 7); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 }); key.shadow.bias = -0.0004; key.shadow.radius = 4; scene.add(key);
const rim = new THREE.DirectionalLight('#ff5fd2', 1.6); rim.position.set(5, 4, -6); scene.add(rim);
const faceLight = new THREE.PointLight('#ffd6f0', 2.4, 6, 1.5); scene.add(faceLight);
const phoneGlow = new THREE.PointLight('#5ef2ff', 0, 3, 1.6); scene.add(phoneGlow);

// ---------- CLASSROOM (students face +z, toward the board at z=+6.5)
const CLASS = new THREE.Group(); scene.add(CLASS);
{
  const floor = M(new THREE.PlaneGeometry(20, 20), mat('#8a78a8', 0.35)); floor.rotation.x = -Math.PI / 2; CLASS.add(floor);
  const ceil = M(new THREE.PlaneGeometry(20, 20), mat('#2d1b4e', 0.9)); ceil.rotation.x = Math.PI / 2; ceil.position.y = 5; CLASS.add(ceil);
  CLASS.add(box(20, 5, 0.2, '#6a45a8', [0, 2.5, -6.5])); CLASS.add(box(20, 5, 0.2, '#6a45a8', [0, 2.5, 6.6]));
  CLASS.add(box(0.2, 5, 20, '#7650b4', [-8, 2.5, 0])); CLASS.add(box(0.2, 5, 20, '#7650b4', [8, 2.5, 0]));
  CLASS.add(box(20, 1.3, 0.25, '#4b2f7a', [0, 0.65, -6.4])); CLASS.add(box(20, 1.3, 0.25, '#4b2f7a', [0, 0.65, 6.5]));
  const bt = tex(1024, 512, (g) => { g.fillStyle = '#244a40'; g.fillRect(0, 0, 1024, 512); g.fillStyle = 'rgba(255,255,255,.9)'; g.font = '700 96px Comic Sans MS, Arial'; g.textAlign = 'center'; g.fillText('AULA DE HOJE', 512, 190); g.font = '700 78px Comic Sans MS, Arial'; g.fillText('3 × 4 = 12', 512, 360); });
  CLASS.add(box(5.6, 2.9, 0.12, '#6b3f2a', [0, 3.0, 6.42]));
  const board = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 2.6), new THREE.MeshStandardMaterial({ map: bt, roughness: 0.8 })); board.position.set(0, 3.0, 6.35); board.rotation.y = Math.PI; CLASS.add(board);
  for (const [x, z] of [[-3, -2], [2, -2], [-3, 3], [2, 3]]) { const l = new THREE.PointLight('#d8c6ff', 1.2, 7, 1.8); l.position.set(x, 4.6, z); CLASS.add(l); const p = M(new THREE.BoxGeometry(1.6, 0.05, 0.4), mat('#fff', 0.3, { emissive: '#e8deff', emissiveIntensity: 1.0 }), [x, 4.95, z]); p.castShadow = false; CLASS.add(p); }
  for (let i = 0; i < 3; i++) { CLASS.add(box(2.6, 0.08, 0.5, '#6b3f2a', [4.2, 1.2 + i * 0.8, -6.15])); for (let b = 0; b < 9; b++) CLASS.add(box(0.2, 0.55 + (b % 3) * 0.08, 0.35, ['#e63946', '#3a86ff', '#ffbe0b', '#2a9d8f', '#ff5fa2'][(b + i) % 5], [3.1 + b * 0.26, 1.5 + i * 0.8, -6.15])); }
  CLASS.add(M(new THREE.PlaneGeometry(3, 1.8), mat('#9fd4ff', 0.2, { emissive: '#7fb6ff', emissiveIntensity: 0.5 }), [-2.5, 3, -6.38]));
  // posters
  [['#ffbe0b', -5.5], ['#2ec4b6', 5.5]].forEach(([c, x]) => CLASS.add(box(1.2, 1.6, 0.05, c, [x, 3.0, -6.35], 0.6)));
}
// ---------- HALLWAY (lockers both sides, along z)
const HALL = new THREE.Group(); scene.add(HALL);
{
  const floor = M(new THREE.PlaneGeometry(6, 40), mat('#a99cc4', 0.18)); floor.rotation.x = -Math.PI / 2; floor.position.z = -10; HALL.add(floor);
  const ceil = M(new THREE.PlaneGeometry(6, 40), mat('#24143e', 0.9)); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, 4, -10); HALL.add(ceil);
  const cols = ['#2a9d8f', '#3a86ff', '#9b5de5', '#e76f51'];
  for (const sx of [-1, 1]) {
    HALL.add(box(0.2, 4, 40, '#5b3c94', [sx * 2.9, 2, -10]));
    for (let i = 0; i < 30; i++) { const z = 8 - i * 1.0; HALL.add(box(0.5, 2.6, 0.92, cols[(i + (sx > 0 ? 1 : 0)) % 4], [sx * 2.6, 1.3, z], 0.45)); HALL.add(box(0.06, 0.25, 0.06, '#dfe3ea', [sx * 2.33, 1.4, z + 0.3], 0.2)); }
  }
  for (let i = 0; i < 8; i++) { const z = 6 - i * 4; const p = M(new THREE.BoxGeometry(1.2, 0.05, 1.8), mat('#fff', 0.3, { emissive: '#dcd0ff', emissiveIntensity: 1.6 }), [0, 3.97, z]); p.castShadow = false; HALL.add(p); const l = new THREE.PointLight('#cdbcff', 1.4, 7, 1.8); l.position.set(0, 3.6, z); HALL.add(l); }
}

// ---------- faces
const faceCache = new Map();
function faceTex(expr, look = 0) {
  const k = expr + look.toFixed(1); if (faceCache.has(k)) return faceCache.get(k);
  const t = tex(256, 256, (g) => {
    const lx = look * 16, D = '#120a1a';
    g.fillStyle = 'rgba(255,90,140,.28)'; g.beginPath(); g.ellipse(62, 158, 24, 13, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(194, 158, 24, 13, 0, 0, 7); g.fill();
    if (expr === 'blush') { g.fillStyle = 'rgba(255,60,110,.55)'; g.beginPath(); g.ellipse(62, 158, 30, 16, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(194, 158, 30, 16, 0, 0, 7); g.fill(); }
    g.fillStyle = D; g.strokeStyle = D; g.lineCap = 'round';
    for (const sx of [-1, 1]) {
      const x = 128 + sx * 40 + lx, y = 112;
      if (expr === 'shock') { g.beginPath(); g.ellipse(x, y, 17, 30, 0, 0, 7); g.fill(); }
      else if (expr === 'flat' || expr === 'smug' || expr === 'bored') { g.beginPath(); g.ellipse(x, y + 6, 13, 16, 0, 0, 7); g.fill(); g.globalCompositeOperation = 'destination-out'; g.fillRect(x - 20, y - 20, 40, 16); g.globalCompositeOperation = 'source-over'; g.fillStyle = D; g.lineWidth = 5; g.beginPath(); g.moveTo(x - 16, y - 4); g.lineTo(x + 16, y - 4); g.stroke(); }
      else if (expr === 'happyc' || expr === 'blush') { g.lineWidth = 7; g.beginPath(); g.moveTo(x - 16, y + 6); g.quadraticCurveTo(x, y - 14, x + 16, y + 6); g.stroke(); }
      else { g.beginPath(); g.ellipse(x, y, 13, 24, 0, 0, 7); g.fill(); }
      g.lineWidth = 6; g.beginPath();
      if (expr === 'worry' || expr === 'sad') { g.moveTo(x - sx * 20, y - 44); g.lineTo(x + sx * 14, y - 54); g.stroke(); }
      if (expr === 'smug' || expr === 'stern') { g.moveTo(x - sx * 18, y - 52); g.lineTo(x + sx * 16, y - 42); g.stroke(); }
      if (expr === 'shock') { g.moveTo(x - 18, y - 56); g.quadraticCurveTo(x, y - 66, x + 18, y - 56); g.stroke(); }
    }
    g.lineWidth = 7; g.beginPath();
    if (expr === 'shock') { g.ellipse(128 + lx, 186, 11, 15, 0, 0, 7); g.fill(); }
    else if (expr === 'worry' || expr === 'flat' || expr === 'bored') { g.moveTo(110 + lx, 186); g.lineTo(146 + lx, 186); g.stroke(); }
    else if (expr === 'sad') { g.moveTo(108 + lx, 192); g.quadraticCurveTo(128 + lx, 176, 148 + lx, 192); g.stroke(); }
    else if (expr === 'smug') { g.moveTo(104 + lx, 182); g.quadraticCurveTo(130 + lx, 194, 156 + lx, 172); g.stroke(); }
    else if (expr === 'stern') { g.moveTo(108 + lx, 188); g.quadraticCurveTo(128 + lx, 180, 148 + lx, 188); g.stroke(); }
    else { g.moveTo(106 + lx, 178); g.quadraticCurveTo(128 + lx, 196, 150 + lx, 178); g.stroke(); }
  });
  faceCache.set(k, t); return t;
}

// ---------- characters
function limb(len, r, c) { const g = new THREE.Group(); g.add(M(new THREE.CapsuleGeometry(r, len, 6, 14), mat(c, 0.5), [0, -len / 2, 0])); return g; }
function kid(o) {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const legs = [];
  for (const sx of [-1, 1]) {
    const leg = limb(0.36, 0.085, o.legs); leg.position.set(sx * 0.12, 0.55, 0); body.add(leg); legs.push(leg);
    const shoe = M(new THREE.SphereGeometry(0.11, 16, 12), mat(o.shoes, 0.4), [0, -0.5, 0.05]); shoe.scale.set(1, 0.6, 1.4); leg.add(shoe);
  }
  const torso = M(new THREE.CapsuleGeometry(0.27, 0.32, 6, 18), mat(o.top, 0.6), [0, 0.91, 0]); torso.scale.z = 0.85; body.add(torso);
  const hood = M(new THREE.TorusGeometry(0.22, 0.07, 10, 24), mat(o.top, 0.6), [0, 1.23, -0.05]); hood.rotation.x = Math.PI / 2; body.add(hood);
  body.add(M(new THREE.BoxGeometry(0.3, 0.12, 0.05), mat(o.top2 || o.top, 0.6), [0, 0.8, 0.23]));
  if (o.skirt) body.add(M(new THREE.CylinderGeometry(0.3, 0.4, 0.22, 20), mat('#2b2550', 0.7), [0, 0.59, 0]));
  const arms = [];
  for (const sx of [-1, 1]) { const a = limb(0.34, 0.07, o.top); a.position.set(sx * 0.31, 1.13, 0); a.rotation.z = sx * 0.18; body.add(a); a.add(M(new THREE.SphereGeometry(0.085, 14, 10), mat(o.hands, 0.45), [0, -0.46, 0])); arms.push(a); }
  body.add(M(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 10), mat(o.skin, 0.4), [0, 1.33, 0]));
  const head = new THREE.Group(); head.position.y = 1.67; body.add(head);
  const skull = M(new THREE.SphereGeometry(0.3, 40, 30), mat(o.skin, 0.35)); skull.scale.set(1, 1.28, 1); head.add(skull);
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex('happy'), transparent: true, depthWrite: false, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: -2 });
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.302, 40, 30, Math.PI / 2 - Math.PI * 0.3, Math.PI * 0.6, Math.PI * 0.2, Math.PI * 0.55), faceMat); face.scale.set(1, 1.28, 1); head.add(face);
  if (o.hair) {
    const cap = M(new THREE.SphereGeometry(0.315, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.42), mat(o.hair, 0.5)); cap.scale.set(1, 1.28, 1); cap.rotation.x = -0.22; head.add(cap);
    if (o.style === 'buns') for (const sx of [-1, 1]) head.add(M(new THREE.SphereGeometry(0.12, 16, 12), mat(o.hair, 0.5), [sx * 0.22, 0.3, -0.06]));
    if (o.style === 'pony') { const p = M(new THREE.SphereGeometry(0.14, 16, 12), mat(o.hair, 0.5), [0, -0.02, -0.33]); p.scale.set(0.8, 1.7, 0.8); head.add(p); }
    if (o.style === 'long') head.add(M(new THREE.CylinderGeometry(0.29, 0.33, 0.6, 24, 1, true, Math.PI * 0.3, Math.PI * 1.4), mat(o.hair, 0.5, { side: THREE.DoubleSide }), [0, -0.18, -0.01]));
    if (o.bow) { const bw = M(new THREE.SphereGeometry(0.09, 12, 8), mat(o.bow, 0.4), [0.18, 0.36, -0.05]); bw.scale.set(1.6, 0.8, 0.6); head.add(bw); }
  }
  if (o.glasses) for (const sx of [-1, 1]) { const g = M(new THREE.TorusGeometry(0.075, 0.014, 8, 20), mat('#3a1f5c', 0.3), [sx * 0.105, 0.03, 0.29]); head.add(g); }
  let phones = null;
  if (o.phones) {
    phones = new THREE.Group();
    const band = M(new THREE.TorusGeometry(0.34, 0.035, 10, 30, Math.PI), mat('#2b2d42', 0.3)); band.rotation.z = 0; phones.add(band);
    const glowM = mat('#5ef2ff', 0.2, { emissive: '#5ef2ff', emissiveIntensity: 0 });
    for (const sx of [-1, 1]) { const cup = M(new THREE.CylinderGeometry(0.12, 0.12, 0.09, 20), mat('#e63946', 0.35), [sx * 0.33, 0, 0]); cup.rotation.z = Math.PI / 2; phones.add(cup); const ring = M(new THREE.TorusGeometry(0.1, 0.018, 8, 20), glowM, [sx * 0.385, 0, 0]); ring.rotation.y = Math.PI / 2; phones.add(ring); }
    phones.userData.glow = glowM; head.add(phones);
  }
  let book = null;
  if (o.book) { book = M(new THREE.BoxGeometry(0.34, 0.44, 0.06), mat('#3a86ff', 0.5), [0, 0.98, 0.32]); book.rotation.x = -0.4; body.add(book); }
  root.userData = { head, faceMat, arms, legs, body, phones, book };
  return root;
}
const boy = kid({ skin: '#f4eef2', top: '#F2B705', top2: '#d99e00', legs: '#1F4E9C', shoes: '#ffffff', hands: '#ffffff', phones: true }); scene.add(boy);
const GIRL = [['#f1d9cf', '#2b1b1e', 'long'], ['#a86f52', '#1e1414', 'buns'], ['#f6e0d4', '#d9542b', 'pony'], ['#c99273', '#3a2314', 'long'], ['#f1d9cf', '#f0c34a', 'buns'], ['#7b4a33', '#1b1212', 'pony'], ['#efd2c2', '#7a4a2a', 'long'], ['#a86f52', '#1e1414', 'pony'], ['#f1d9cf', '#3a2314', 'buns'], ['#c99273', '#2b1b1e', 'long'], ['#f6e0d4', '#d9542b', 'buns'], ['#7b4a33', '#1b1212', 'long'], ['#efd2c2', '#2b1b1e', 'pony']];
const TOPS = ['#ff5fa2', '#9b5de5', '#2ec4b6', '#ffbe0b', '#3a86ff', '#e76f51'];
const SEATS = [[0.6, [-4, -2, 0, 2, 4]], [-1.6, [-4, -2, 2, 4]], [-3.8, [-4, -2, 0, 2, 4]]];
const seated = [];
let gi = 0;
for (const [z, xs] of SEATS) for (const x of xs) {
  const [skin, hair, style] = GIRL[gi % GIRL.length];
  const k = kid({ skin, hair, style, top: TOPS[gi % TOPS.length], legs: '#2b2550', shoes: '#1d1d2b', hands: skin, skirt: true });
  k.position.set(x, 0, z); k.userData.seed = gi; k.userData.home = [x, z]; CLASS.add(k); seated.push(k); gi++;
}
// desks for every seat incl. the boy's
for (const [z, xs] of SEATS) for (const x of xs.concat(z === -1.6 ? [0] : [])) {
  CLASS.add(box(1.25, 0.07, 0.7, '#a0673f', [x, 1.02, z + 0.62], 0.4)); CLASS.add(box(1.1, 0.42, 0.05, '#2d4f8a', [x, 0.76, z + 0.95], 0.5));
  for (const sx of [-1, 1]) CLASS.add(box(0.05, 1.0, 0.05, '#8a8fa8', [x + sx * 0.55, 0.5, z + 0.95], 0.3));
}
const front = seated[2], side = seated[7];
const leader = kid({ skin: '#f6e0d4', hair: '#d9542b', style: 'long', bow: '#ff2d55', top: '#ff2d55', legs: '#2b2550', shoes: '#1d1d2b', hands: '#f6e0d4', skirt: true }); CLASS.add(leader);
const quiet = kid({ skin: '#efd2c2', hair: '#7a4a2a', style: 'pony', top: '#9b5de5', legs: '#2b2550', shoes: '#1d1d2b', hands: '#efd2c2', skirt: true, glasses: true, book: true }); scene.add(quiet);
const extras = []; for (let i = 0; i < 3; i++) { const [skin, hair, style] = GIRL[(i + 4) % GIRL.length]; const k = kid({ skin, hair, style, top: TOPS[(i + 2) % 6], legs: '#2b2550', shoes: '#1d1d2b', hands: skin, skirt: true }); scene.add(k); extras.push(k); }

function sit(k, on) { const u = k.userData; u.body.position.y = on ? -0.43 : 0; for (const l of u.legs) l.rotation.x = on ? -1.4 : 0; }
function pose(k, L, R) { const a = k.userData.arms; a[0].rotation.set(L[1] || 0, 0, -(L[0])); a[1].rotation.set(R[1] || 0, 0, R[0]); }
const REST = [0.18, 0];

// ---------- post
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.35, 0.5, 0.9));
const bokeh = new BokehPass(scene, camera, { focus: 4, aperture: 0.003, maxblur: 0.012 }); composer.addPass(bokeh);
composer.addPass(new OutputPass());

// ---------- helpers
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), prog = (f, a, b) => clamp((f - a) / (b - a));
const ss = (t) => { t = clamp(t); return t * t * t * (t * (t * 6 - 15) + 10); }, lerp = (a, b, t) => a + (b - a) * t;
const backOut = (t) => { t = clamp(t); const c = 2.2; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const V = (a) => new THREE.Vector3(...a);
function project(obj, dy = 0) { const v = new THREE.Vector3(); obj.getWorldPosition(v); v.y += dy; v.project(camera); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H, v.z]; }
function camKeys(f, K) {
  for (let i = 0; i < K.length - 1; i++) { const a = K[i], b = K[i + 1]; if (f <= b.f) { const t = ss((f - a.f) / (b.f - a.f)); return { p: a.p.map((v, j) => lerp(v, b.p[j], t)), l: a.l.map((v, j) => lerp(v, b.l[j], t)), d: lerp(a.d, b.d, t) }; } }
  const z = K[K.length - 1]; return { p: z.p, l: z.l, d: z.d };
}

// ---------- 2D overlay
function bubble(x, y, text, k, o = {}) {
  if (k <= 0.01) return;
  O.save(); O.translate(x, y); O.scale(k, k);
  O.font = `900 ${o.fs || 50}px Arial Black, Arial`;
  const lines = text.split('\n'), w = Math.max(...lines.map((l) => O.measureText(l).width)) + 90, h = lines.length * (o.fs || 50) * 1.2 + 70;
  O.beginPath(); const n = 12;
  for (let i = 0; i < n; i++) { const a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2, am = (a0 + a1) / 2; const p = (a) => [Math.cos(a) * w / 2, Math.sin(a) * h / 2]; const [x0, y0] = p(a0), [x1, y1] = p(a1); if (!i) O.moveTo(x0, y0); O.quadraticCurveTo(Math.cos(am) * w * 0.62, Math.sin(am) * h * 0.66, x1, y1); }
  O.closePath(); O.fillStyle = o.bg || 'rgba(255,255,255,.96)'; O.fill(); O.lineWidth = 7; O.strokeStyle = '#2a1046'; O.stroke();
  for (let i = 0; i < 3; i++) { O.beginPath(); O.arc((o.tx || 0) * (i + 1) / 4, h / 2 + 24 + i * 30, 16 - i * 4, 0, 7); O.fillStyle = o.bg || '#fff'; O.fill(); O.stroke(); }
  O.fillStyle = o.col || '#2a1046'; O.textAlign = 'center'; O.textBaseline = 'middle';
  lines.forEach((l, i) => O.fillText(l, 0, (i - (lines.length - 1) / 2) * (o.fs || 50) * 1.2 + 3));
  if (o.heart) { O.fillStyle = '#ff2d55'; heart2(w / 2 - 20, -h / 2 + 10, 26); }
  O.restore();
}
function heart2(x, y, r) { O.beginPath(); O.moveTo(x, y + r); O.bezierCurveTo(x - r * 2, y - r * 0.4, x - r * 0.6, y - r * 1.6, x, y - r * 0.5); O.bezierCurveTo(x + r * 0.6, y - r * 1.6, x + r * 2, y - r * 0.4, x, y + r); O.fill(); }
function sweat(x, y, n, f) { for (let i = 0; i < n; i++) { const t = ((f * 0.04 + i * 0.37) % 1); const px = x + (i % 2 ? 1 : -1) * (120 + i * 18), py = y - 60 + t * 160; O.save(); O.globalAlpha = 1 - t; O.translate(px, py); O.beginPath(); O.moveTo(0, -40); O.quadraticCurveTo(30, 0, 0, 24); O.quadraticCurveTo(-30, 0, 0, -40); O.fillStyle = '#9fe0ff'; O.fill(); O.lineWidth = 5; O.strokeStyle = '#2a1046'; O.stroke(); O.restore(); } }
function sparkle(x, y, r, f, col = '#fff59d') { O.save(); O.translate(x, y); O.rotate(f * 0.05); O.beginPath(); for (let i = 0; i < 8; i++) { const rr = i % 2 ? r * 0.3 : r; const a = i * Math.PI / 4; O.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } O.closePath(); O.fillStyle = col; O.fill(); O.restore(); }
function battery(x, y, k, f) { if (k <= 0) return; O.save(); O.translate(x, y); O.scale(k, k); O.fillStyle = 'rgba(20,10,40,.85)'; O.strokeStyle = '#fff'; O.lineWidth = 12; O.beginPath(); O.roundRect(-170, -85, 320, 170, 26); O.fill(); O.stroke(); O.fillStyle = '#fff'; O.fillRect(150, -35, 30, 70); if (Math.floor(f / 7) % 2 === 0) { O.fillStyle = '#ff2d55'; O.fillRect(-150, -65, 60, 130); } O.restore(); }
function calendar(x, y, k, n) { if (k <= 0) return; O.save(); O.translate(x, y); O.scale(k, k); O.rotate(-0.06); O.fillStyle = '#fff'; O.strokeStyle = '#2a1046'; O.lineWidth = 10; O.beginPath(); O.roundRect(-220, -200, 440, 400, 30); O.fill(); O.stroke(); O.fillStyle = '#ff2d55'; O.fillRect(-215, -195, 430, 110); O.fillStyle = '#fff'; O.font = '900 64px Arial Black, Arial'; O.textAlign = 'center'; O.textBaseline = 'middle'; O.fillText('ANOS', 0, -140); O.fillStyle = '#2a1046'; O.font = '900 220px Arial Black, Arial'; O.fillText(String(n), 0, 70); O.restore(); }
function flash(a) { if (a <= 0) return; O.fillStyle = `rgba(255,255,255,${a})`; O.fillRect(0, 0, W, H); }

// ---------- shots
// each shot: f0,f1, set:'class'|'hall', setup(f) -> { cam:{p,l,d}, fx:(f)=>void }
function classDefaults(f, t) {
  CLASS.visible = true; HALL.visible = false; scene.fog.near = 12;
  for (const g of seated) { const u = g.userData, s = u.seed; sit(g, true); pose(g, REST, REST); u.head.rotation.set(0, Math.sin(t * 1.1 + s) * 0.25, 0); u.faceMat.map = faceTex(s % 3 ? 'happy' : 'bored', 0); u.body.rotation.y = 0; }
  boy.position.set(0, 0, -1.6); boy.rotation.set(0, 0, 0); sit(boy, true); pose(boy, REST, REST);
  leader.visible = false; quiet.visible = false; extras.forEach((e) => (e.visible = false));
}
function hallDefaults() {
  CLASS.visible = false; HALL.visible = true;
  boy.position.set(0, 0, 0); boy.rotation.set(0, 0, 0); sit(boy, false); pose(boy, REST, REST);
  quiet.visible = false; extras.forEach((e) => (e.visible = false));
}
function phonesOn(on, glow) { const p = boy.userData.phones; p.visible = on > 0; p.position.y = lerp(0.9, 0, on); p.position.z = lerp(0.5, 0, on); p.userData.glow.emissiveIntensity = glow; phoneGlow.intensity = glow * (CLASS.visible ? 0.25 : 1.2); }

const SHOTS = [
  { f0: 0, f1: 95, run(f, t) { // hook: headphones on, thoughts popping around
    hallDefaults(); phonesOn(1, 1.5 + Math.sin(f * 0.3) * 0.5);
    boy.userData.faceMat.map = faceTex(f < 50 ? 'shock' : 'worry', Math.sin(f * 0.08)); boy.userData.head.rotation.y = Math.sin(f * 0.06) * 0.3;
    extras.forEach((e, i) => { e.visible = true; sit(e, false); const p = [[-1.3, 0, -1.6], [1.3, 0, -1.4], [0.6, 0, -3.4]][i]; e.position.set(...p); e.rotation.y = Math.atan2(-p[0], -p[2]); pose(e, REST, REST); e.userData.faceMat.map = faceTex(['smug', 'bored', 'happy'][i]); e.userData.head.rotation.y = 0; });
    return { cam: camKeys(f, [{ f: 0, p: [0.5, 1.75, 1.9], l: [0, 1.65, 0], d: 1.9 }, { f: 95, p: [-0.3, 1.7, 1.6], l: [0, 1.66, 0], d: 1.6 }]),
      fx: () => { const H1 = project(extras[0].userData.head, 0.7), H2 = project(extras[1].userData.head, 0.7), H3 = project(extras[2].userData.head, 0.7); bubble(H1[0], H1[1], '...', pop(f, 8), { fs: 60 }); bubble(H2[0], H2[1], '?!', pop(f, 20), { fs: 60 }); bubble(H3[0], H3[1], 'HMM', pop(f, 34), { fs: 50 }); const B = project(boy.userData.head, 0); for (let i = 0; i < 3; i++) sparkle(B[0] + Math.cos(f * 0.1 + i * 2) * 470, B[1] - 380 + Math.sin(f * 0.1 + i * 2) * 120, 30, f, '#9ff6ff'); } };
  } },
  { f0: 96, f1: 157, run(f, t) { // put on the magic headphones
    hallDefaults();
    const on = ss(prog(f, 112, 128)); phonesOn(on, on > 0.95 ? 2 : 0.4);
    const up = f < 132 ? ss(prog(f, 100, 112)) : 1 - ss(prog(f, 132, 144));
    pose(boy, [lerp(0.18, 2.7, up), 0], [lerp(0.18, 2.7, up), 0]);
    boy.userData.faceMat.map = faceTex(on > 0.95 ? 'smug' : 'happy', 0);
    return { cam: camKeys(f, [{ f: 96, p: [0, 1.6, 2.3], l: [0, 1.6, 0], d: 2.3 }, { f: 157, p: [0.2, 1.68, 1.5], l: [0, 1.67, 0], d: 1.5 }]),
      fx: () => { if (on > 0.95) { const B = project(boy.userData.head, 0); for (let i = 0; i < 6; i++) sparkle(B[0] + (i % 2 ? 1 : -1) * (430 + Math.sin(f * 0.1 + i) * 40), B[1] - 300 + i * 90, 30, f, '#9ff6ff'); } } };
  } },
  { f0: 158, f1: 241, run(f, t) { // the girl in front: "what weird hair"
    classDefaults(f, t); phonesOn(1, 1.6);
    boy.userData.faceMat.map = faceTex(f > 205 ? 'shock' : 'happy', 0);
    const turn = ss(prog(f, 170, 186)); front.userData.head.rotation.y = lerp(0, 2.4, turn); front.userData.body.rotation.y = lerp(0, 0.5, turn); front.userData.faceMat.map = faceTex(turn > 0.5 ? 'smug' : 'happy');
    return { cam: camKeys(f, [{ f: 158, p: [1.1, 2.3, -3.4], l: [0, 1.4, 0.6], d: 2.6 }, { f: 241, p: [0.9, 2.15, -3.0], l: [0, 1.45, 0.6], d: 2.3 }]),
      fx: () => { const F = project(front.userData.head, 0.75); bubble(F[0], F[1], 'QUE CABELO\nESTRANHO...', pop(f, 194), { fs: 54, tx: -20 }); } };
  } },
  { f0: 242, f1: 295, run(f, t) { // you don't even have hair
    classDefaults(f, t); phonesOn(1, 1.2);
    const r = ss(prog(f, 252, 262)); pose(boy, REST, [lerp(0.18, 2.5, r), lerp(0, -0.3, r)]);
    boy.userData.faceMat.map = faceTex('flat', 0); boy.userData.head.rotation.x = -0.05;
    return { cam: camKeys(f, [{ f: 242, p: [0, 1.55, -0.35], l: [0, 1.3, -1.6], d: 1.3 }, { f: 295, p: [0, 1.53, -0.5], l: [0, 1.3, -1.6], d: 1.15 }]), fx: () => {} };
  } },
  { f0: 296, f1: 363, run(f, t) { // the one beside: "he's sweating"
    classDefaults(f, t); phonesOn(1, 1.4);
    side.userData.head.rotation.y = lerp(0, -0.9, ss(prog(f, 300, 312))); side.userData.faceMat.map = faceTex('bored', -0.6);
    boy.userData.faceMat.map = faceTex(f > 330 ? 'worry' : 'happy', 0.5);
    return { cam: camKeys(f, [{ f: 296, p: [1.15, 1.62, 0.2], l: [1.85, 1.35, -1.6], d: 2.0 }, { f: 363, p: [1.2, 1.6, 0.0], l: [1.85, 1.35, -1.6], d: 1.8 }]),
      fx: () => { const S = project(side.userData.head, 0.72); bubble(S[0], S[1] - 60, 'ELE TÁ\nSUANDO', pop(f, 318), { fs: 54, tx: -40 }); } };
  } },
  { f0: 364, f1: 417, run(f, t) { // now you ARE sweating
    classDefaults(f, t); phonesOn(1, 1.4);
    boy.userData.faceMat.map = faceTex('worry', 0); boy.userData.head.rotation.z = Math.sin(f * 0.8) * 0.02;
    return { cam: camKeys(f, [{ f: 364, p: [0.05, 1.5, -0.6], l: [0, 1.28, -1.6], d: 1.1 }, { f: 417, p: [0.05, 1.45, -0.8], l: [0, 1.28, -1.6], d: 0.9 }]),
      fx: () => { const B = project(boy.userData.head, 0.1); sweat(B[0], B[1], 2 + Math.floor(prog(f, 364, 400) * 4), f); } };
  } },
  { f0: 418, f1: 489, run(f, t) { // class leader: "who is that?"
    classDefaults(f, t); phonesOn(1, 1.4);
    leader.visible = true; sit(leader, false); leader.position.set(1.2, 0, 4.6); leader.rotation.y = Math.PI + 0.25; pose(leader, [0.6, -1.2], [0.6, -1.2]);
    leader.userData.faceMat.map = faceTex(f > 446 ? 'stern' : 'smug', 0); leader.userData.head.rotation.set(0, 0, f > 446 ? 0.12 : 0);
    for (const g of seated) { g.userData.head.rotation.y = 0; g.userData.faceMat.map = faceTex('happy'); }
    return { cam: camKeys(f, [{ f: 418, p: [0.5, 0.95, 1.4], l: [1.2, 1.7, 4.6], d: 3.4 }, { f: 489, p: [0.7, 1.0, 2.0], l: [1.2, 1.75, 4.6], d: 2.8 }]),
      fx: () => { const L = project(leader.userData.head, 0.75); bubble(L[0], L[1], 'QUEM É\nESSE?', pop(f, 447), { fs: 60, tx: 30 }); } };
  } },
  { f0: 490, f1: 567, run(f, t) { // you've studied together for three years
    classDefaults(f, t); phonesOn(1, 1.2);
    boy.userData.faceMat.map = faceTex('shock', 0);
    const n = f < 512 ? 1 : f < 524 ? 2 : 3;
    return { cam: camKeys(f, [{ f: 490, p: [0, 1.58, -0.3], l: [0, 1.3, -1.6], d: 1.35 }, { f: 567, p: [0, 1.55, -0.5], l: [0, 1.3, -1.6], d: 1.15 }]),
      fx: () => { calendar(W / 2, 400, pop(f, 496) * 0.85, n); if (f >= 530 && f < 538) flash(0.3 * (1 - prog(f, 530, 538))); } };
  } },
  { f0: 568, f1: 627, run(f, t) { // you give up and take off the headphones
    hallDefaults();
    const off = ss(prog(f, 588, 602)); phonesOn(1 - off, 0.2);
    const up = f < 600 ? ss(prog(f, 580, 592)) : 1 - ss(prog(f, 600, 614));
    pose(boy, [lerp(0.18, 2.6, up), 0], [lerp(0.18, 2.6, up), 0]);
    boy.userData.faceMat.map = faceTex('sad', 0); boy.userData.head.rotation.x = lerp(0, 0.25, prog(f, 600, 620));
    return { cam: camKeys(f, [{ f: 568, p: [0, 1.5, 3.2], l: [0, 1.4, 0], d: 3.2 }, { f: 627, p: [0, 1.55, 2.6], l: [0, 1.45, 0], d: 2.6 }]), fx: () => {} };
  } },
  { f0: 628, f1: 786, run(f, t) { // the quiet girl walks by and thinks: "he's nice"
    hallDefaults(); phonesOn(0, 0);
    boy.userData.faceMat.map = faceTex('sad', 0); boy.userData.head.rotation.x = 0.25;
    quiet.visible = true; sit(quiet, false);
    const w = prog(f, 650, 800); quiet.position.set(0.7, Math.abs(Math.sin(w * Math.PI * 7)) * 0.04, lerp(-6, 0.6, w)); quiet.rotation.y = 0;
    const qa = quiet.userData; qa.legs[0].rotation.x = Math.sin(w * Math.PI * 14) * 0.45; qa.legs[1].rotation.x = -Math.sin(w * Math.PI * 14) * 0.45; pose(quiet, [0.25, -1.1], [0.25, -1.1]);
    const glance = prog(f, 738, 748) - prog(f, 770, 780); qa.head.rotation.y = -0.9 * ss(glance); qa.faceMat.map = faceTex(f > 744 ? 'blush' : 'happy', -0.5);
    return { cam: camKeys(f, [{ f: 628, p: [-0.2, 1.4, 3.6], l: [0.3, 1.35, -2], d: 3.6 }, { f: 700, p: [-0.4, 1.45, 3.2], l: [0.4, 1.4, -1], d: 3.2 }, { f: 786, p: [-0.5, 1.5, 3.0], l: [0.3, 1.45, 0], d: 3.0 }]),
      fx: () => { const Q = project(qa.head, 0.72); if (Q[2] < 1) bubble(Math.min(W - 260, Math.max(260, Q[0])), Math.max(260, Q[1]), 'ELE É\nLEGAL', pop(f, 746) * (1 - prog(f, 778, 786)), { fs: 56, tx: -30, heart: true }); } };
  } },
  { f0: 787, f1: TOTAL - 1, run(f, t) { // put them back on in a hurry... low battery
    hallDefaults();
    const on = ss(prog(f, 796, 812)); const dead = f >= 848;
    phonesOn(on, dead ? (Math.floor(f / 7) % 2 ? 0.6 : 0) * (1 - prog(f, 860, 880)) : on * 1.8);
    const up = f < 816 ? ss(prog(f, 788, 798)) : 1 - ss(prog(f, 816, 828));
    pose(boy, [lerp(0.18, 2.7, up), 0], [lerp(0.18, 2.7, up), 0]);
    boy.userData.faceMat.map = faceTex(dead ? (f > 868 ? 'flat' : 'shock') : 'happy', 0); boy.userData.head.rotation.x = 0;
    return { cam: camKeys(f, [{ f: 787, p: [0, 1.6, 2.6], l: [0, 1.6, 0], d: 2.6 }, { f: 846, p: [0.15, 1.68, 1.6], l: [0, 1.67, 0], d: 1.6 }, { f: TOTAL - 1, p: [0.15, 1.68, 1.25], l: [0, 1.67, 0], d: 1.25 }]),
      fx: () => { battery(W / 2, 330, pop(f, 849) * 0.8, f); } };
  } },
];
const KICKS = [205, 330, 450, 849];

function renderFrame(f) {
  const t = f / 30;
  const sh = SHOTS.find((s) => f >= s.f0 && f <= s.f1) || SHOTS[SHOTS.length - 1];
  const R = sh.run(f, t);
  let [px, py, pz] = R.cam.p;
  for (const k of KICKS) { const d = f - k; if (d >= 0 && d < 7) { const a = (d % 2 ? 1 : -1) * 0.025 * (1 - d / 7); px += a; py += a * 0.6; } }
  px += Math.sin(f * 0.03) * 0.01; py += Math.cos(f * 0.027) * 0.008;
  camera.position.set(px, py, pz); camera.lookAt(...R.cam.l);
  const hp = new THREE.Vector3(); boy.userData.head.getWorldPosition(hp); faceLight.position.set(hp.x + 0.6, hp.y + 1.3, hp.z + 1.1); faceLight.intensity = CLASS.visible ? 1.1 : 2.2; phoneGlow.position.set(hp.x, hp.y + 0.35, hp.z + 0.1);
  bokeh.uniforms.focus.value = R.cam.d;
  boy.userData.head.rotation.z = Math.sin(t * 2) * 0.025;
  composer.render();
  O.drawImage(renderer.domElement, 0, 0);
  R.fx();
  // soft vignette
  const v = O.createRadialGradient(W / 2, H * 0.45, W * 0.45, W / 2, H / 2, H * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(20,0,40,.45)'); O.fillStyle = v; O.fillRect(0, 0, W, H);
  return out.toDataURL('image/jpeg', 0.92);
}
window.renderFrame = renderFrame; window.ready = true;
