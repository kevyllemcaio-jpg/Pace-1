import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
const W = 1080, H = 1920;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H); renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.35;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color('#2a1446'); scene.fog = new THREE.Fog('#3a1d5e', 11, 26);
const camera = new THREE.PerspectiveCamera(48, W / H, 0.05, 60);

const mat = (c, r = 0.55, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: r, metalness: 0 }, o));
function M(geo, m, p) { const x = new THREE.Mesh(geo, typeof m === 'string' ? mat(m) : m); x.castShadow = true; x.receiveShadow = true; if (p) x.position.set(...p); return x; }
const box = (w, h, d, c, p, r) => M(new THREE.BoxGeometry(w, h, d), mat(c, r ?? 0.7), p);

// ---- cinematic lights: cool purple ambient, warm key, magenta rim, practical ceiling lights
scene.add(new THREE.HemisphereLight('#b39cff', '#4a2a5e', 1.6));
const key = new THREE.DirectionalLight('#ffe2c4', 3.0); key.position.set(3, 7, 7); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10 }); key.shadow.bias = -0.0004; key.shadow.radius = 4; scene.add(key);
const rim = new THREE.DirectionalLight('#ff5fd2', 1.6); rim.position.set(5, 4, -6); scene.add(rim);
const fill = new THREE.PointLight('#ffd6f0', 2.5, 6, 1.5); fill.position.set(-5.0, 2.6, 0.8); scene.add(fill);
const doorLight = new THREE.PointLight('#bfe4ff', 0, 9, 1.5); doorLight.position.set(-7.6, 2.4, -1.2); scene.add(doorLight);
for (const [x, z] of [[-3, -2], [2, -2], [-3, 3], [2, 3]]) { const l = new THREE.PointLight('#d8c6ff', 1.2, 7, 1.8); l.position.set(x, 4.6, z); scene.add(l); const panel = M(new THREE.BoxGeometry(1.6, 0.05, 0.4), mat('#ffffff', 0.3, { emissive: '#e8deff', emissiveIntensity: 1.0 }), [x, 4.95, z]); panel.castShadow = false; scene.add(panel); }

// ---- classroom (camera at the front looking at the students)
const floor = M(new THREE.PlaneGeometry(18, 18), mat('#8a78a8', 0.35)); floor.rotation.x = -Math.PI / 2; scene.add(floor);
const ceil = M(new THREE.PlaneGeometry(18, 18), mat('#2d1b4e', 0.9)); ceil.rotation.x = Math.PI / 2; ceil.position.y = 5; scene.add(ceil);
scene.add(box(18, 5, 0.2, '#6a45a8', [0, 2.5, -6.5]));                       // back wall
scene.add(box(18, 1.4, 0.25, '#3a2366', [0, 0.7, -6.4]));
scene.add(box(0.2, 5, 18, '#7650b4', [-8, 2.5, 0]));                           // left wall (door)
scene.add(box(0.2, 5, 18, '#4a2c7c', [8, 2.5, 0]));
// back wall: shelves with books + window glow
for (let i = 0; i < 3; i++) { scene.add(box(2.6, 0.08, 0.5, '#6b3f2a', [4.2, 1.2 + i * 0.8, -6.15])); for (let b = 0; b < 9; b++) scene.add(box(0.2, 0.55 + (b % 3) * 0.08, 0.35, ['#e63946', '#3a86ff', '#ffbe0b', '#2a9d8f', '#ff5fa2'][(b + i) % 5], [3.1 + b * 0.26, 1.5 + i * 0.8, -6.15])); }
const win = M(new THREE.PlaneGeometry(3, 1.8), mat('#9fd4ff', 0.2, { emissive: '#7fb6ff', emissiveIntensity: 0.5 }), [-2.5, 3, -6.38]); scene.add(win);
// door + sign
scene.add(box(0.3, 3.3, 2.0, '#2b1b45', [-7.85, 1.65, -1.2]));
const doorHole = M(new THREE.PlaneGeometry(1.6, 3.0), mat('#cfe9ff', 0.3, { emissive: '#bfe4ff', emissiveIntensity: 0 }), [-7.88, 1.5, -1.2]); doorHole.rotation.y = Math.PI / 2; scene.add(doorHole);
const doorPivot = new THREE.Group(); doorPivot.position.set(-7.75, 0, -2.0); scene.add(doorPivot);
doorPivot.add(box(0.1, 3.0, 1.6, '#c0563c', [0, 1.5, 0.8], 0.45));
const signTex = (() => { const c = document.createElement('canvas'); c.width = 512; c.height = 160; const g = c.getContext('2d'); g.fillStyle = '#ff5fa2'; g.fillRect(0, 0, 512, 160); g.fillStyle = '#fff'; g.font = '900 100px Arial'; g.textAlign = 'center'; g.fillText('SALA 6', 256, 118); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.44), new THREE.MeshStandardMaterial({ map: signTex, emissive: '#ffffff', emissiveMap: signTex, emissiveIntensity: 0.6 })); sign.position.set(-7.88, 3.6, -1.2); sign.rotation.y = Math.PI / 2; scene.add(sign);

// ---- faces: simple black ovals + line, like the reference look
const faceCache = new Map();
function faceTex(expr, look = 0) {
  const key = expr + look.toFixed(1); if (faceCache.has(key)) return faceCache.get(key);
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); const lx = look * 16;
  g.fillStyle = '#120a1a';
  for (const sx of [-1, 1]) {
    const x = 128 + sx * 40 + lx, y = 112;
    if (expr === 'shock') { g.beginPath(); g.ellipse(x, y, 17, 30, 0, 0, 7); g.fill(); }
    else if (expr === 'smug') { g.beginPath(); g.ellipse(x, y + 4, 13, 18, 0, 0, 7); g.fill(); g.fillStyle = '#f4e9ee'; g.fillRect(x - 20, y - 22, 40, 14); g.fillStyle = '#120a1a'; }
    else { g.beginPath(); g.ellipse(x, y, 13, 24, 0, 0, 7); g.fill(); }
    g.strokeStyle = '#120a1a'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath();
    if (expr === 'worry') { g.moveTo(x - sx * 20, y - 44); g.lineTo(x + sx * 14, y - 52); g.stroke(); }
    if (expr === 'smug') { g.moveTo(x - 18, y - 40 + sx * 6); g.lineTo(x + 18, y - 40 - sx * 6); g.stroke(); }
  }
  g.strokeStyle = '#120a1a'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath();
  if (expr === 'shock') { g.fillStyle = '#120a1a'; g.ellipse(128 + lx, 186, 11, 15, 0, 0, 7); g.fill(); }
  else if (expr === 'worry') { g.moveTo(108 + lx, 186); g.lineTo(148 + lx, 186); g.stroke(); }
  else if (expr === 'smug') { g.moveTo(104 + lx, 182); g.quadraticCurveTo(130 + lx, 196, 156 + lx, 172); g.stroke(); }
  else { g.moveTo(108 + lx, 180); g.quadraticCurveTo(128 + lx, 194, 148 + lx, 180); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; faceCache.set(key, t); return t;
}

// ---- characters: egg heads, rounded bodies, glossy plastic
function limb(len, r, c) { const g = new THREE.Group(); g.add(M(new THREE.CapsuleGeometry(r, len, 6, 14), mat(c, 0.5), [0, -len / 2, 0])); return g; }
function kid(o) {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const legY = o.sit ? 0.48 : 0.55;
  for (const sx of [-1, 1]) {
    const leg = limb(o.sit ? 0.22 : 0.36, 0.085, o.legs); leg.position.set(sx * 0.12, legY, o.sit ? 0.08 : 0); if (o.sit) leg.rotation.x = -1.35; body.add(leg);
    const shoe = M(new THREE.SphereGeometry(0.11, 16, 12), mat(o.shoes, 0.4), [sx * 0.12, o.sit ? 0.45 : 0.06, o.sit ? 0.42 : 0.04]); shoe.scale.set(1, 0.6, 1.4); body.add(shoe);
  }
  const torso = M(new THREE.CapsuleGeometry(0.27, 0.32, 6, 18), mat(o.top, 0.6), [0, legY + 0.36, 0]); torso.scale.z = 0.85; body.add(torso);
  if (o.hood) { const hood = M(new THREE.TorusGeometry(0.22, 0.07, 10, 24), mat(o.top, 0.6), [0, legY + 0.68, -0.05]); hood.rotation.x = Math.PI / 2; body.add(hood); const pocket = M(new THREE.BoxGeometry(0.3, 0.12, 0.05), mat(o.top2 || o.top, 0.6), [0, legY + 0.25, 0.23]); body.add(pocket); }
  if (o.skirt) { body.add(M(new THREE.CylinderGeometry(0.3, 0.4, 0.22, 20), mat('#2b2550', 0.7), [0, legY + 0.04, 0])); }
  const arms = [];
  for (const sx of [-1, 1]) { const a = limb(0.34, 0.07, o.top); a.position.set(sx * 0.31, legY + 0.58, 0); a.rotation.z = sx * 0.18; body.add(a); a.add(M(new THREE.SphereGeometry(0.085, 14, 10), mat(o.hands, 0.45), [0, -0.46, 0])); arms.push(a); }
  const neck = M(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 10), mat(o.skin, 0.4), [0, legY + 0.78, 0]); body.add(neck);
  const head = new THREE.Group(); head.position.y = legY + 1.12; body.add(head);
  const skull = M(new THREE.SphereGeometry(0.3, 40, 30), mat(o.skin, 0.35)); skull.scale.set(1, 1.28, 1); head.add(skull);
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex('happy'), transparent: true, depthWrite: false, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: -2 });
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.302, 40, 30, Math.PI / 2 - Math.PI * 0.3, Math.PI * 0.6, Math.PI * 0.2, Math.PI * 0.55), faceMat); face.scale.set(1, 1.28, 1); head.add(face);
  if (o.hair) {
    const cap = M(new THREE.SphereGeometry(0.315, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.42), mat(o.hair, 0.5)); cap.scale.set(1, 1.28, 1); cap.rotation.x = 0.38; head.add(cap);
    if (o.style === 'buns') for (const sx of [-1, 1]) head.add(M(new THREE.SphereGeometry(0.12, 16, 12), mat(o.hair, 0.5), [sx * 0.22, 0.3, -0.06]));
    if (o.style === 'pony') { const p = M(new THREE.SphereGeometry(0.14, 16, 12), mat(o.hair, 0.5), [0, -0.02, -0.33]); p.scale.set(0.8, 1.7, 0.8); head.add(p); }
    if (o.style === 'long') { const l = M(new THREE.CylinderGeometry(0.29, 0.33, 0.6, 24, 1, true, Math.PI * 0.3, Math.PI * 1.4), mat(o.hair, 0.5, { side: THREE.DoubleSide }), [0, -0.18, -0.01]); head.add(l); }
  }
  root.userData = { head, faceMat, arms, body };
  return root;
}
const GIRL = [['#f1d9cf', '#2b1b1e', 'long'], ['#a86f52', '#1e1414', 'buns'], ['#f6e0d4', '#d9542b', 'pony'], ['#c99273', '#3a2314', 'long'], ['#f1d9cf', '#f0c34a', 'buns'], ['#7b4a33', '#1b1212', 'pony'], ['#efd2c2', '#7a4a2a', 'long'], ['#a86f52', '#1e1414', 'pony'], ['#f1d9cf', '#3a2314', 'buns'], ['#c99273', '#2b1b1e', 'long'], ['#f6e0d4', '#d9542b', 'buns'], ['#7b4a33', '#1b1212', 'long']];
const TOPS = ['#ff5fa2', '#9b5de5', '#2ec4b6', '#ffbe0b', '#3a86ff', '#e76f51'];
const girls = [];
const ROWS = [[-3.8, [-4, -2, 0, 2, 4]], [-1.6, [-4, -2, 2, 4]], [0.6, [-4, -2, 0, 2, 4]]];
let gi = 0;
for (const [z, xs] of ROWS) for (const x of xs) {
  const [skin, hair, style] = GIRL[gi % GIRL.length];
  const k = kid({ skin, hair, style, top: TOPS[gi % TOPS.length], legs: '#2b2550', shoes: '#1d1d2b', hands: skin, skirt: true, sit: true, hood: true });
  k.position.set(x, 0, z); k.userData.seed = gi; scene.add(k); girls.push(k); gi++;
  scene.add(box(1.25, 0.07, 0.7, '#a0673f', [x, 1.02, z + 0.62], 0.4)); scene.add(box(1.1, 0.42, 0.05, '#2d4f8a', [x, 0.76, z + 0.95], 0.5));
  for (const sx of [-1, 1]) scene.add(box(0.05, 1.0, 0.05, '#8a8fa8', [x + sx * 0.55, 0.5, z + 0.95], 0.3));
}
const boy = kid({ skin: '#f4eef2', top: '#F2B705', top2: '#d99e00', legs: '#1F4E9C', shoes: '#ffffff', hands: '#ffffff', hood: true });
scene.add(boy);

// ---- post: bloom + depth of field
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.35, 0.5, 0.9); composer.addPass(bloom);
const bokeh = new BokehPass(scene, camera, { focus: 6, aperture: 0.0025, maxblur: 0.012 }); composer.addPass(bokeh);
composer.addPass(new OutputPass());

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), prog = (f, a, b) => clamp((f - a) / (b - a));
const ss = (t) => { t = clamp(t); return t * t * t * (t * (t * 6 - 15) + 10); }, lerp = (a, b, t) => a + (b - a) * t;
const backOut = (t) => { t = clamp(t); const c = 2.2; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
// camera keys: [frame, position, target, focus distance]
const K = [[0, [1.6, 1.9, 6.4], [-1.0, 1.35, -1.0], 6.5], [60, [1.2, 1.8, 6.0], [-1.6, 1.4, -1.0], 6.0], [76, [0.8, 1.7, 5.4], [-3.5, 1.5, -1.2], 6.5], [112, [-4.4, 1.75, 1.6], [-6.4, 1.62, -1.2], 3.4], [149, [-4.9, 1.7, 0.9], [-6.45, 1.65, -1.2], 2.6]];
function camAt(f) { for (let i = 0; i < K.length - 1; i++) { const [fa, pa, la, da] = K[i], [fb, pb, lb, db] = K[i + 1]; if (f <= fb) { const t = ss((f - fa) / (fb - fa)); return [pa.map((v, j) => lerp(v, pb[j], t)), la.map((v, j) => lerp(v, lb[j], t)), lerp(da, db, t)]; } } const L = K[K.length - 1]; return [L[1], L[2], L[3]]; }
function renderFrame(f) {
  const t = f / 30;
  doorPivot.rotation.y = -1.6 * ss(prog(f, 30, 44));
  const open = ss(prog(f, 30, 44)); doorLight.intensity = open * 6; doorHole.material.emissiveIntensity = open * 1.5;
  const w = prog(f, 40, 70);
  boy.position.set(lerp(-8.6, -6.4, ss(w)), w > 0 && w < 1 ? Math.abs(Math.sin(w * Math.PI * 4)) * 0.05 : 0, -1.2);
  boy.rotation.y = lerp(Math.PI / 2, 1.05, ss(prog(f, 62, 76)));
  const bu = boy.userData;
  bu.arms[1].rotation.z = f > 70 ? lerp(0.18, 2.6, ss(prog(f, 70, 80))) + Math.sin(f * 0.6) * 0.15 : 0.18;
  bu.faceMat.map = faceTex(f < 76 ? 'happy' : f < 100 ? 'shock' : 'worry', 0.4);
  bu.head.rotation.z = Math.sin(t * 2) * 0.03;
  for (const g of girls) {
    const u = g.userData, s = u.seed;
    const snap = backOut(prog(f, 75 + (s % 4), 81 + (s % 4)));
    const toDoor = Math.atan2(-6.4 - g.position.x, -1.2 - g.position.z);
    u.head.rotation.y = lerp(Math.sin(t * 1.3 + s) * 0.35, clamp(toDoor, -1.4, 1.4), snap);
    u.body.position.y = Math.sin(t * 2 + s) * 0.008;
    u.faceMat.map = faceTex(snap > 0.5 ? (s % 3 ? 'shock' : 'smug') : 'happy', 0);
  }
  const [p, l, fd] = camAt(f);
  const shake = f >= 78 && f < 85 ? (f % 2 ? 1 : -1) * 0.05 * (1 - (f - 78) / 7) : 0;
  camera.position.set(p[0] + shake, p[1] + shake * 0.6, p[2]); camera.lookAt(...l);
  bokeh.uniforms.focus.value = fd;
  composer.render();
  return renderer.domElement.toDataURL('image/jpeg', 0.92);
}
window.renderFrame = renderFrame; window.ready = true;
