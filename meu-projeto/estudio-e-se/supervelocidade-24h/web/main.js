// 3D "E se você tivesse supervelocidade por 24 horas?" — hero ZÁS (original), night city
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const W = 1080, H = 1920, TOTAL = 1800;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
renderer.setSize(W, H); renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, W / H, 0.05, 400);
const out = document.createElement('canvas'); out.width = W; out.height = H; const O = out.getContext('2d');
document.body.appendChild(out);

const mat = (c, r = 0.55, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: r, metalness: 0 }, o));
function M(geo, m, p) { const x = new THREE.Mesh(geo, typeof m === 'string' ? mat(m) : m); x.castShadow = true; x.receiveShadow = true; if (p) x.position.set(...p); return x; }
const box = (w, h, d, c, p, r, o) => M(new THREE.BoxGeometry(w, h, d), mat(c, r ?? 0.7, o), p);
const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), prog = (f, a, b) => clamp((f - a) / (b - a));
const ss = (t) => { t = clamp(t); return t * t * t * (t * (t * 6 - 15) + 10); }, lerp = (a, b, t) => a + (b - a) * t;
const backOut = (t) => { t = clamp(t); const c = 2.2; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));

// ---------- sky + lights
const SKY = tex(64, 1024, (g) => { const gr = g.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, '#05031a'); gr.addColorStop(0.45, '#1d0b4a'); gr.addColorStop(0.75, '#5a1670'); gr.addColorStop(1, '#ff4f7b'); g.fillStyle = gr; g.fillRect(0, 0, 64, 1024); const r = rng(3); g.fillStyle = '#fff'; for (let i = 0; i < 60; i++) g.fillRect(r() * 64, r() * 400, 1, 1); });
scene.background = SKY; scene.fog = new THREE.Fog('#2a0f55', 30, 170);
const hemi = new THREE.HemisphereLight('#8f7cff', '#2a1640', 1.3); scene.add(hemi);
const key = new THREE.DirectionalLight('#a9b8ff', 1.6); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 0.5, far: 60 }); key.shadow.bias = -0.0005; key.shadow.radius = 3; scene.add(key); scene.add(key.target);
const fill = new THREE.PointLight('#ffb27a', 2.0, 14, 1.5); scene.add(fill);
const heroLight = new THREE.PointLight('#ff4a1c', 0, 10, 1.6); scene.add(heroLight);
const portalLight = new THREE.PointLight('#7fd8ff', 0, 40, 1.4); scene.add(portalLight);

// ---------- facade textures
function facade(seed, base, lit) {
  return tex(256, 256, (g) => {
    const r = rng(seed); g.fillStyle = base; g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const on = r() < 0.45; g.fillStyle = on ? lit[Math.floor(r() * lit.length)] : '#0d0a1e';
      g.fillRect(14 + x * 62, 18 + y * 60, 40, 38);
      if (on) { g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(14 + x * 62, 37 + y * 60, 40, 3); }
    }
  });
}
const FAC = [facade(1, '#2b2247', ['#ffd59e', '#ffe9c4', '#9ff0ff']), facade(2, '#3a1f3f', ['#ffb3d9', '#ffd59e']), facade(3, '#1e2a4a', ['#9ff0ff', '#ffe9c4', '#c7b8ff']), facade(4, '#41284f', ['#ffd59e', '#fff3c4'])];
function building(w, h, d, seed, topMat) {
  const t = FAC[seed % 4].clone(); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(Math.max(1, Math.round(w / 4)), Math.max(1, Math.round(h / 4))); t.needsUpdate = true;
  const side = new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: '#ffffff', emissiveIntensity: 0.85, roughness: 0.8 });
  const top = topMat || mat('#241a36', 0.9);
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [side, side, top, top, side, side]); m.receiveShadow = true; return m;
}

// ---------- STREET (road along z, x in [-5,5])
const STREET = new THREE.Group(); scene.add(STREET);
const ROAD_TEX = tex(256, 1024, (g) => { g.fillStyle = '#1b1828'; g.fillRect(0, 0, 256, 1024); const r = rng(9); for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(255,255,255,${r() * 0.05})`; g.fillRect(r() * 256, r() * 1024, 2, 2); } g.fillStyle = '#ffd23f'; g.fillRect(124, 0, 4, 1024); g.fillRect(132, 0, 4, 1024); g.fillStyle = '#e8e8f0'; for (let y = 0; y < 1024; y += 128) { g.fillRect(60, y, 5, 70); g.fillRect(191, y, 5, 70); } });
ROAD_TEX.wrapT = THREE.RepeatWrapping; ROAD_TEX.repeat.set(1, 30);
{
  const road = M(new THREE.PlaneGeometry(10, 320), new THREE.MeshStandardMaterial({ map: ROAD_TEX, roughness: 0.35, metalness: 0.25 })); road.rotation.x = -Math.PI / 2; road.position.z = -110; STREET.add(road);
  for (const sx of [-1, 1]) {
    STREET.add(box(3, 0.18, 320, '#4a4060', [sx * 6.5, 0.09, -110], 0.6));
    STREET.add(box(0.25, 0.22, 320, '#6d6488', [sx * 5.1, 0.11, -110], 0.5));
    const r = rng(sx > 0 ? 11 : 12); let z = 40;
    while (z > -280) { const w = 9 + r() * 6, h = 14 + r() * 34, d = 8 + r() * 6; const b = building(d, h, w, Math.floor(r() * 4)); b.position.set(sx * (8 + d / 2), h / 2, z - w / 2); STREET.add(b); z -= w + 0.4;
      if (r() < 0.5) { const c = ['#ff2d95', '#2de2ff', '#ffd23f', '#b26bff'][Math.floor(r() * 4)]; const s = M(new THREE.BoxGeometry(0.15, 1.2, 3), mat(c, 0.3, { emissive: c, emissiveIntensity: 2.2 }), [sx * 7.9, 4 + r() * 3, z + w / 2]); s.castShadow = false; STREET.add(s); } }
    for (let z2 = 30; z2 > -280; z2 -= 16) { STREET.add(box(0.14, 5, 0.14, '#3a3550', [sx * 5.6, 2.5, z2], 0.4)); STREET.add(box(1.2, 0.1, 0.1, '#3a3550', [sx * 5.1, 5, z2], 0.4)); const l = M(new THREE.BoxGeometry(0.6, 0.12, 0.3), mat('#fff', 0.3, { emissive: '#ffe0a8', emissiveIntensity: 3 }), [sx * 4.6, 4.92, z2]); l.castShadow = false; STREET.add(l); }
  }
  // crosswalk at z=-60
  for (let i = 0; i < 8; i++) { const s = M(new THREE.PlaneGeometry(0.7, 3), mat('#e8e8f0', 0.5)); s.rotation.x = -Math.PI / 2; s.position.set(-4.4 + i * 1.25, 0.012, -60); STREET.add(s); }
  // distant towers at the end of the avenue
  const r = rng(77); for (let i = 0; i < 16; i++) { const h = 40 + r() * 70; const b = building(14, h, 14, i); b.position.set(-60 + i * 8, h / 2, -300 - r() * 40); STREET.add(b); }
  const moon = new THREE.Mesh(new THREE.SphereGeometry(10, 24, 16), new THREE.MeshBasicMaterial({ color: '#ffe9d0', fog: false })); moon.position.set(-60, 120, -330); STREET.add(moon);
}

// ---------- ROOFTOPS (tops at y=0, hero runs along -z)
const ROOF = new THREE.Group(); scene.add(ROOF);
{
  const conc = mat('#5a5070', 0.85); const r = rng(21); let z = 20; window.ROOF_GAPS = [];
  while (z > -330) {
    const len = 16 + r() * 8; const b = building(12, 60, len, Math.floor(r() * 4), conc); b.position.set(0, -30, z - len / 2); ROOF.add(b);
    for (const sx of [-1, 1]) ROOF.add(box(0.3, 0.6, len, '#6e6488', [sx * 5.85, 0.3, z - len / 2], 0.8));
    ROOF.add(box(1.6, 1.0, 1.4, '#8d86a6', [-3.5, 0.5, z - len * 0.3], 0.5)); ROOF.add(box(1.2, 0.8, 1.2, '#8d86a6', [3.6, 0.4, z - len * 0.7], 0.5));
    if (r() < 0.6) { const tk = M(new THREE.CylinderGeometry(1, 1, 1.8, 18), mat('#7a5a44', 0.8), [3.4, 2.0, z - len * 0.3]); ROOF.add(tk); for (const lx of [-0.6, 0.6]) ROOF.add(box(0.1, 1.2, 0.1, '#3a3550', [3.4 + lx, 0.6, z - len * 0.3])); }
    const ant = box(0.06, 3, 0.06, '#aaa', [-4.5, 1.5, z - len * 0.75]); ROOF.add(ant); const bl = M(new THREE.SphereGeometry(0.12, 8, 6), mat('#f00', 0.3, { emissive: '#ff2020', emissiveIntensity: 3 }), [-4.5, 3.05, z - len * 0.75]); bl.castShadow = false; ROOF.add(bl);
    const gap = 2.6 + r() * 1.2; ROOF_GAPS.push([z - len - gap / 2, gap / 2]); z -= len + gap;
  }
  for (const sx of [-1, 1]) { let z2 = 40; while (z2 > -360) { const w = 10 + r() * 10, h = 30 + r() * 80; const b = building(w, h, w, Math.floor(r() * 4)); b.position.set(sx * (22 + r() * 40), -60 + h / 2, z2); ROOF.add(b); z2 -= w + 4; } }
  const gnd = M(new THREE.PlaneGeometry(400, 600), mat('#140c26', 1)); gnd.rotation.x = -Math.PI / 2; gnd.position.set(0, -60, -150); ROOF.add(gnd);
}

// ---------- TIME TUNNEL (hero runs in place at z=0; world scrolls toward -z)
const TUNNEL = new THREE.Group(); scene.add(TUNNEL);
const TUN_TEX = tex(1024, 512, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#0a0430'); gr.addColorStop(0.5, '#2a0b6e'); gr.addColorStop(1, '#0a0430'); g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
  const r = rng(5); g.lineCap = 'round';
  for (let i = 0; i < 26; i++) { g.strokeStyle = i % 3 ? 'rgba(127,216,255,.8)' : 'rgba(255,210,63,.9)'; g.lineWidth = 2 + r() * 5; const y = r() * 512; g.beginPath(); g.moveTo(0, y); g.lineTo(1024, y + (r() - 0.5) * 40); g.stroke(); }
  g.font = '700 54px Georgia, serif'; g.fillStyle = 'rgba(255,233,180,.85)'; const N = ['XII', 'III', 'VI', 'IX', 'I', 'X', 'IV', 'VII']; for (let i = 0; i < 18; i++) g.fillText(N[i % 8], r() * 980, 40 + r() * 460);
});
TUN_TEX.wrapS = TUN_TEX.wrapT = THREE.RepeatWrapping; TUN_TEX.repeat.set(4, 3);
const tunnel = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 260, 40, 1, true), new THREE.MeshBasicMaterial({ map: TUN_TEX, side: THREE.BackSide, fog: false }));
tunnel.rotation.x = Math.PI / 2; tunnel.position.set(0, 3, 0); TUNNEL.add(tunnel);
const PATH = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 260), new THREE.MeshBasicMaterial({ color: '#ffcf5a', transparent: true, opacity: 0.55, fog: false })); PATH.rotation.x = -Math.PI / 2; PATH.position.y = 0.01; TUNNEL.add(PATH);
const CLOCK_TEX = tex(512, 512, (g) => { g.fillStyle = 'rgba(255,240,210,.95)'; g.beginPath(); g.arc(256, 256, 240, 0, 7); g.fill(); g.lineWidth = 22; g.strokeStyle = '#ffb703'; g.stroke(); g.fillStyle = '#2a0b4e'; g.font = '700 58px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].forEach((n, i) => { const a = i / 12 * Math.PI * 2 - Math.PI / 2; g.fillText(n, 256 + Math.cos(a) * 180, 256 + Math.sin(a) * 180); }); });
const HAND_MAT = new THREE.MeshBasicMaterial({ color: '#2a0b4e', fog: false });
function clockFace(r) {
  const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.CircleGeometry(r, 48), new THREE.MeshBasicMaterial({ map: CLOCK_TEX, transparent: true, fog: false })));
  const hh = new THREE.Group(), mh = new THREE.Group(); const a = new THREE.Mesh(new THREE.PlaneGeometry(r * 0.08, r * 0.5), HAND_MAT); a.position.set(0, r * 0.22, 0.01); hh.add(a); const b = new THREE.Mesh(new THREE.PlaneGeometry(r * 0.05, r * 0.75), HAND_MAT); b.position.set(0, r * 0.35, 0.02); mh.add(b); g.add(hh, mh);
  g.userData = { hh, mh }; return g;
}
const clocks = []; { const r = rng(8); for (let i = 0; i < 16; i++) { const c = clockFace(0.9 + r() * 1.2); const a = r() * Math.PI * 2; c.userData.base = [Math.cos(a) * 5.5, 3 + Math.sin(a) * 4.5, 20 - i * 9]; c.userData.spin = (r() - 0.5) * 0.08; TUNNEL.add(c); clocks.push(c); } }
const bigClock = clockFace(5); bigClock.position.set(0, 4, 70); bigClock.rotation.y = Math.PI; TUNNEL.add(bigClock);

// ---------- portal
const PORTAL_TEX = tex(512, 512, (g) => { const gr = g.createRadialGradient(256, 256, 10, 256, 256, 256); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(160,230,255,.95)'); gr.addColorStop(0.6, 'rgba(120,60,255,.8)'); gr.addColorStop(1, 'rgba(40,0,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); g.lineCap = 'round'; for (let i = 0; i < 9; i++) { g.strokeStyle = i % 2 ? 'rgba(255,210,63,.8)' : 'rgba(255,255,255,.7)'; g.lineWidth = 8; g.beginPath(); for (let t = 0; t < 1; t += 0.01) { const a = i / 9 * Math.PI * 2 + t * 5, rr = 30 + t * 210; g.lineTo(256 + Math.cos(a) * rr, 256 + Math.sin(a) * rr); } g.stroke(); } });
const portal = new THREE.Group(); scene.add(portal);
const portalDisc = new THREE.Mesh(new THREE.CircleGeometry(3.2, 64), new THREE.MeshBasicMaterial({ map: PORTAL_TEX, side: THREE.DoubleSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })); portal.add(portalDisc);
const portalRing = new THREE.Mesh(new THREE.TorusGeometry(3.25, 0.22, 16, 80), new THREE.MeshBasicMaterial({ color: '#ffd23f', fog: false })); portal.add(portalRing);
const portalRing2 = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.06, 8, 80), new THREE.MeshBasicMaterial({ color: '#9ff0ff', fog: false })); portal.add(portalRing2);

// ---------- rain (instanced), glass shards, cracks
const RAIN_N = 700, rain = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 4), new THREE.MeshBasicMaterial({ color: '#bfe6ff', transparent: true, opacity: 0.55 }), RAIN_N); rain.frustumCulled = false; scene.add(rain);
const RAIN_SEED = []; { const r = rng(44); for (let i = 0; i < RAIN_N; i++) RAIN_SEED.push([r() * 16 - 8, r() * 10, r() * 22 - 11]); }
const DUMMY = new THREE.Object3D();
function setRain(cx, cz, wt, frozen) { rain.visible = true; for (let i = 0; i < RAIN_N; i++) { const [x, y, z] = RAIN_SEED[i]; const yy = frozen ? y : ((y - wt * 9) % 10 + 10) % 10; DUMMY.position.set(cx + x, yy, cz + z); DUMMY.rotation.set(0, 0, 0); DUMMY.scale.set(1, frozen ? 0.6 : 1.3, 1); DUMMY.updateMatrix(); rain.setMatrixAt(i, DUMMY.matrix); } rain.instanceMatrix.needsUpdate = true; }
const SH_N = 260, shards = new THREE.InstancedMesh(new THREE.BoxGeometry(0.22, 0.3, 0.02), new THREE.MeshStandardMaterial({ color: '#cfefff', emissive: '#9fe8ff', emissiveIntensity: 1.6, roughness: 0.1, transparent: true, opacity: 0.85 }), SH_N); shards.frustumCulled = false; scene.add(shards);
const SH_SEED = []; { const r = rng(55); for (let i = 0; i < SH_N; i++) SH_SEED.push({ sx: r() < 0.5 ? -1 : 1, y: 3 + r() * 14, z: -110 + r() * 100, v: [2 + r() * 6, 2 + r() * 4, (r() - 0.5) * 6], rot: r() * 10 }); }
function setShards(hz) { // a facade bursts when the hero passes its z (hero runs toward +z here)
  shards.visible = true;
  for (let i = 0; i < SH_N; i++) { const s = SH_SEED[i]; const t = Math.max(0, (hz - s.z) / 45); if (t <= 0) { DUMMY.scale.set(0, 0, 0); } else { DUMMY.position.set(s.sx * (7.9 - s.v[0] * t), Math.max(0.05, s.y + s.v[1] * t - 9 * t * t), s.z + s.v[2] * t); DUMMY.rotation.set(s.rot + t * 9, s.rot * 2 + t * 7, 0); DUMMY.scale.set(1, 1, 1); } DUMMY.updateMatrix(); shards.setMatrixAt(i, DUMMY.matrix); }
  shards.instanceMatrix.needsUpdate = true;
}
const CRACK_TEX = tex(256, 512, (g) => { const r = rng(66); g.lineCap = 'round'; const draw = (x, y, a, n, w) => { for (let i = 0; i < n; i++) { const nx = x + Math.sin(a) * 26, ny = y + Math.cos(a) * 26; g.strokeStyle = 'rgba(10,4,6,.95)'; g.lineWidth = w + 6; g.beginPath(); g.moveTo(x, y); g.lineTo(nx, ny); g.stroke(); g.strokeStyle = '#ff7a1a'; g.lineWidth = w; g.stroke(); x = nx; y = ny; a += (r() - 0.5) * 0.9; if (r() < 0.18 && w > 2) draw(x, y, a + (r() < 0.5 ? 1 : -1), 6, w * 0.6); } }; draw(128, 0, 0, 22, 7); });
const cracks = []; for (let i = 0; i < 44; i++) { const c = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 4.4), new THREE.MeshBasicMaterial({ map: CRACK_TEX, transparent: true, depthWrite: false })); c.rotation.x = -Math.PI / 2; c.rotation.z = (i % 3 - 1) * 0.2; c.position.set((i % 2 ? 0.3 : -0.3), 0.02, -200 + i * 2.4); c.userData.z = c.position.z; STREET.add(c); cracks.push(c); }

// ---------- cars
function car(col) {
  const g = new THREE.Group(); const b = new THREE.Group(); g.add(b);
  b.add(box(1.9, 0.62, 4.2, col, [0, 0.62, 0], 0.25, { metalness: 0.5 })); b.add(box(1.62, 0.55, 2.1, '#1a1830', [0, 1.2, -0.2], 0.1, { metalness: 0.6 }));
  b.add(box(1.5, 0.08, 1.9, col, [0, 1.5, -0.2], 0.25, { metalness: 0.5 }));
  for (const sx of [-1, 1]) for (const z of [-1.35, 1.35]) { const w = M(new THREE.CylinderGeometry(0.36, 0.36, 0.26, 18), mat('#111', 0.6), [sx * 0.9, 0.36, z]); w.rotation.z = Math.PI / 2; b.add(w); }
  for (const sx of [-1, 1]) { const h = M(new THREE.BoxGeometry(0.42, 0.16, 0.05), mat('#fff', 0.2, { emissive: '#fff6d8', emissiveIntensity: 3 }), [sx * 0.62, 0.72, 2.11]); h.castShadow = false; b.add(h); const tl = M(new THREE.BoxGeometry(0.42, 0.14, 0.05), mat('#f00', 0.2, { emissive: '#ff1a1a', emissiveIntensity: 2.4 }), [sx * 0.62, 0.74, -2.11]); tl.castShadow = false; b.add(tl); }
  g.userData.body = b; return g;
}
const CAR_COLS = ['#2ec4b6', '#f4f1de', '#8338ec', '#ff006e', '#3a3a5a', '#fb8500', '#219ebc', '#e9ecef', '#6a994e', '#ffb703'];
const cars = CAR_COLS.map((c) => { const k = car(c); scene.add(k); return k; });
const runaway = car('#3a86ff'); scene.add(runaway);
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

// ---------- characters
const HERO_O = { skin: '#f4eef2', top: '#d90429', top2: '#ffb703', legs: '#d90429', shoes: '#ffb703', hands: '#ffb703' };
const GOLD = () => mat('#ffb703', 0.3, { metalness: 0.6, emissive: '#ff9e00', emissiveIntensity: 0.35 });
const EMBLEM = tex(256, 256, (g) => { g.fillStyle = '#ffb703'; g.beginPath(); g.arc(128, 136, 112, 0, 7); g.fill(); g.fillRect(108, 4, 40, 30); g.fillStyle = '#9d0208'; g.beginPath(); g.arc(128, 136, 88, 0, 7); g.fill(); g.fillStyle = '#fff3c4'; g.beginPath(); g.moveTo(80, 86); g.lineTo(176, 86); g.lineTo(112, 160); g.lineTo(170, 160); g.lineTo(150, 196); g.lineTo(76, 196); g.lineTo(140, 122); g.lineTo(86, 122); g.closePath(); g.fill(); });
function suitUp(k) {
  const u = k.userData;
  const em = new THREE.Mesh(new THREE.CircleGeometry(0.115, 32), new THREE.MeshStandardMaterial({ map: EMBLEM, transparent: true, roughness: 0.3, emissive: '#ffb703', emissiveMap: EMBLEM, emissiveIntensity: 0.5 })); em.position.set(0, 1.0, 0.245); u.body.add(em);
  const belt = M(new THREE.TorusGeometry(0.262, 0.03, 8, 30), GOLD(), [0, 0.72, 0]); belt.rotation.x = Math.PI / 2; belt.scale.y = 0.85; u.body.add(belt);
  for (const l of u.legs) { const s = M(new THREE.BoxGeometry(0.03, 0.34, 0.03), GOLD(), [0, -0.2, 0.083]); l.add(s); }
  for (const a of u.arms) { const c = M(new THREE.TorusGeometry(0.075, 0.025, 8, 18), GOLD(), [0, -0.36, 0]); c.rotation.x = Math.PI / 2; a.add(c); }
  const strap = M(new THREE.TorusGeometry(0.25, 0.022, 8, 40), mat('#3a0a10', 0.5), [0, 0.22, 0]); strap.rotation.x = Math.PI / 2; u.head.add(strap);
  for (const sx of [-1, 1]) { const r = M(new THREE.TorusGeometry(0.075, 0.02, 10, 24), GOLD(), [sx * 0.1, 0.24, 0.215]); r.rotation.x = -0.45; u.head.add(r); const ln = M(new THREE.CircleGeometry(0.07, 20), mat('#7fe7ff', 0.1, { emissive: '#4fd8ff', emissiveIntensity: 1.2 }), [sx * 0.1, 0.24, 0.217]); ln.rotation.x = -0.45; u.head.add(ln); }
  return k;
}
const hero = suitUp(kid(HERO_O)); scene.add(hero);
const civ = kid({ skin: '#f4eef2', top: '#F2B705', top2: '#d99e00', legs: '#1F4E9C', shoes: '#ffffff', hands: '#ffffff' }); scene.add(civ);
const ghosts = []; for (let i = 0; i < 5; i++) { const g = suitUp(kid(HERO_O)); const gm = new THREE.MeshBasicMaterial({ color: i % 2 ? '#ffb703' : '#ff3b1f', transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending }); g.traverse((o) => { if (o.isMesh) { o.material = gm; o.castShadow = false; o.receiveShadow = false; } }); g.userData.gm = gm; scene.add(g); ghosts.push(g); }
const PEDS = [['#f1d9cf', '#2b1b1e', 'long', '#2ec4b6'], ['#a86f52', '#1e1414', null, '#3a86ff'], ['#f6e0d4', '#d9542b', 'pony', '#ff5fa2'], ['#7b4a33', '#1b1212', null, '#6a994e'], ['#efd2c2', '#c9c9c9', null, '#8d6e63'], ['#c99273', '#3a2314', 'buns', '#ffbe0b'], ['#f1d9cf', '#f0c34a', 'long', '#9b5de5'], ['#a86f52', '#2b1b1e', null, '#e76f51']];
const peds = PEDS.map(([skin, hair, style, top], i) => { const k = kid({ skin, hair, style: style || 'short', top, legs: i % 2 ? '#2b2550' : '#3d405b', shoes: '#1d1d2b', hands: skin }); if (i === 2 || i === 5) { const um = new THREE.Group(); um.add(M(new THREE.ConeGeometry(0.75, 0.35, 16, 1, true), mat(i === 2 ? '#ff2d95' : '#ffd23f', 0.5, { side: THREE.DoubleSide }), [0, 0.35, 0])); um.add(M(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 6), mat('#333'), [0, -0.05, 0])); um.position.set(0.28, 0.95, 0.08); k.userData.body.add(um); k.userData.umb = um; } k.scale.setScalar(i === 4 ? 1.1 : 1.18); scene.add(k); return k; });

function runPose(k, ph, amt, lean = 0) {
  const u = k.userData; u.legs[0].rotation.x = Math.sin(ph) * 1.15 * amt; u.legs[1].rotation.x = -Math.sin(ph) * 1.15 * amt;
  u.arms[0].rotation.set(-Math.sin(ph) * 1.3 * amt, 0, -0.2 - 0.2 * amt); u.arms[1].rotation.set(Math.sin(ph) * 1.3 * amt, 0, 0.2 + 0.2 * amt);
  u.body.rotation.x = lean; u.body.position.y = Math.abs(Math.cos(ph)) * 0.07 * amt; u.head.rotation.set(-lean * 0.6, 0, 0);
}
function standPose(k) { const u = k.userData; for (const l of u.legs) l.rotation.x = 0; u.arms[0].rotation.set(0, 0, -0.18); u.arms[1].rotation.set(0, 0, 0.18); u.body.rotation.set(0, 0, 0); u.body.position.y = 0; u.head.rotation.set(0, 0, 0); }
function setFace(k, e, look = 0) { k.userData.faceMat.map = faceTex(e, look); }
function placeK(k, s) { k.visible = true; k.position.set(s.x, s.y || 0, s.z); k.rotation.set(0, s.ry || 0, 0); runPose(k, s.ph || 0, s.amt ?? 1, s.lean ?? 0.4); }
let HFN = null;
function heroPath(fn, f, nGhost = 4, dt = 1.5) { HFN = fn; const s = fn(f); placeK(hero, s); for (let i = 0; i < 5; i++) { const g = ghosts[i]; if (i < nGhost) { placeK(g, fn(f - (i + 1) * dt)); g.userData.gm.opacity = 0.32 * (1 - i / nGhost); } else g.visible = false; } return s; }
function traffic(wt, skip = []) { cars.forEach((c, i) => { if (skip.includes(i)) { c.visible = false; return; } c.visible = true; const up = i % 2 === 0; const len = 290; let z = (-20 - i * 27 + (up ? 1 : -1) * wt * 11); z = ((z + 260) % len + len) % len - 260; c.position.set(up ? -2.5 : 2.5, 0, z); c.rotation.set(0, up ? 0 : Math.PI, 0); c.userData.body.rotation.set(0, 0, 0); }); }

// ---------- post
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.55, 0.55, 0.82); composer.addPass(bloom);
const bokeh = new BokehPass(scene, camera, { focus: 4, aperture: 0.0025, maxblur: 0.009 }); composer.addPass(bokeh);
composer.addPass(new OutputPass());

// ---------- overlay helpers
function P(x, y, z) { const v = new THREE.Vector3(x, y, z).project(camera); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H, v.z]; }
function PW(obj, dy = 0) { const v = new THREE.Vector3(); obj.getWorldPosition(v); return P(v.x, v.y + dy, v.z); }
function jag(x1, y1, x2, y2, r, disp, depth, pts) { if (depth === 0) { pts.push([x2, y2]); return; } const mx = (x1 + x2) / 2 + (r() - 0.5) * disp, my = (y1 + y2) / 2 + (r() - 0.5) * disp; jag(x1, y1, mx, my, r, disp / 2, depth - 1, pts); jag(mx, my, x2, y2, r, disp / 2, depth - 1, pts); }
function bolt(x1, y1, x2, y2, seed, col, w = 4, branch = true) {
  const r = rng(seed); const d = Math.hypot(x2 - x1, y2 - y1); const pts = [[x1, y1]]; jag(x1, y1, x2, y2, r, d * 0.45, 5, pts);
  O.save(); O.globalCompositeOperation = 'lighter'; O.lineJoin = 'round'; O.lineCap = 'round';
  for (const [lw, a, c] of [[w * 6, 0.12, col], [w * 2.4, 0.55, col], [w * 0.8, 1, '#ffffff']]) { O.strokeStyle = c; O.globalAlpha = a; O.lineWidth = lw; O.beginPath(); pts.forEach(([x, y], i) => (i ? O.lineTo(x, y) : O.moveTo(x, y))); O.stroke(); }
  O.restore();
  if (branch && d > 60) for (let i = 0; i < 2; i++) { const p = pts[2 + Math.floor(r() * (pts.length - 4))]; const a = r() * 7; bolt(p[0], p[1], p[0] + Math.cos(a) * d * 0.3, p[1] + Math.sin(a) * d * 0.3, seed * 7 + i, col, w * 0.55, false); }
}
const BOLT_COLS = ['#ff2a1a', '#ffc21a', '#ff6a00'];
function heroBox(k = hero) { const h = PW(k.userData.head, 0.3), ft = P(k.position.x, k.position.y, k.position.z); if (h[2] > 1 || ft[2] > 1) return null; const hp = Math.abs(ft[1] - h[1]); return { cx: (h[0] + ft[0]) / 2, cy: (h[1] + ft[1]) / 2, hp, hx: h[0], hy: h[1] }; }
function aura(k, I, f) { const b = heroBox(k); if (!b) return; const R = b.hp * (0.75 + 0.35 * I + Math.sin(f * 0.7) * 0.05); O.save(); O.globalCompositeOperation = 'lighter'; const g = O.createRadialGradient(b.cx, b.cy, 0, b.cx, b.cy, R); g.addColorStop(0, `rgba(255,120,30,${0.35 * Math.min(1, I)})`); g.addColorStop(0.5, `rgba(255,40,20,${0.18 * Math.min(1, I)})`); g.addColorStop(1, 'rgba(255,0,0,0)'); O.fillStyle = g; O.fillRect(b.cx - R, b.cy - R, R * 2, R * 2); O.restore(); }
function heroBolts(k, I, f, seed = 0) {
  const b = heroBox(k); if (!b || I <= 0) return; const r = rng(Math.floor(f / 2) * 131 + seed); const n = Math.round(2 + I * 5);
  for (let i = 0; i < n; i++) { const a = r() * 7, a2 = a + 0.6 + r() * 1.6; const s = b.hp * (0.25 + r() * 0.35 * (0.6 + I * 0.4)); bolt(b.cx + Math.cos(a) * s * 0.6, b.cy + Math.sin(a) * s, b.cx + Math.cos(a2) * s * 0.7 * (1 + I * 0.3), b.cy + Math.sin(a2) * s * 1.1, Math.floor(f / 2) * 17 + i + seed * 3, BOLT_COLS[i % 3], 2 + b.hp / 260 * (0.6 + I * 0.4)); }
}
function trail(f, n = 16, w = 1) {
  if (!HFN) return; O.save(); O.globalCompositeOperation = 'lighter'; O.lineCap = 'round'; O.lineJoin = 'round';
  for (const [dy, col] of [[0.95, '#ff2a1a'], [1.35, '#ffc21a'], [0.6, '#ff6a00']]) {
    const pts = []; for (let j = 0; j <= n; j++) { const s = HFN(f - j * 0.7); const p = P(s.x, (s.y || 0) + dy, s.z); if (p[2] > 1) break; pts.push(p); }
    if (pts.length < 2) continue; for (const [lw, a] of [[28 * w, 0.15], [10 * w, 0.45], [3 * w, 0.9]]) { O.strokeStyle = lw < 5 ? '#fff' : col; O.globalAlpha = a; O.lineWidth = lw; O.beginPath(); pts.forEach(([x, y], i) => (i ? O.lineTo(x + Math.sin(i * 2.3 + f) * 6, y + Math.cos(i * 1.7 + f) * 6) : O.moveTo(x, y))); O.stroke(); }
  }
  O.restore();
}
function speedLines(cx, cy, I, f, col = '255,255,255') { if (I <= 0) return; const r = rng(Math.floor(f) * 7); O.save(); O.globalCompositeOperation = 'lighter'; for (let i = 0; i < 46; i++) { const a = r() * Math.PI * 2, r0 = 380 + r() * 500, len = 150 + r() * 500 * I; O.strokeStyle = `rgba(${col},${(0.1 + r() * 0.25) * I})`; O.lineWidth = 2 + r() * 5; O.beginPath(); O.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); O.lineTo(cx + Math.cos(a) * (r0 + len), cy + Math.sin(a) * (r0 + len)); O.stroke(); } O.restore(); }
function hLines(I, f, dir = 1) { if (I <= 0) return; const r = rng(Math.floor(f) * 3); O.save(); O.globalCompositeOperation = 'lighter'; for (let i = 0; i < 30; i++) { const y = r() * H, x = r() * W, len = 200 + r() * 600; O.strokeStyle = `rgba(255,230,200,${(0.08 + r() * 0.2) * I})`; O.lineWidth = 1 + r() * 4; O.beginPath(); O.moveTo(x, y); O.lineTo(x - dir * len, y); O.stroke(); } O.restore(); }
function desat(k) { if (k <= 0) return; O.save(); O.globalCompositeOperation = 'saturation'; O.globalAlpha = k; O.fillStyle = '#808080'; O.fillRect(0, 0, W, H); O.globalCompositeOperation = 'source-over'; O.globalAlpha = 1; O.fillStyle = `rgba(60,140,255,${0.14 * k})`; O.fillRect(0, 0, W, H); O.restore(); }
function ringFx(x, y, t, col = '255,210,63') { if (t <= 0 || t >= 1) return; O.save(); O.globalCompositeOperation = 'lighter'; const R = 40 + t * 1400; O.strokeStyle = `rgba(${col},${(1 - t) * 0.9})`; O.lineWidth = 40 * (1 - t) + 4; O.beginPath(); O.ellipse(x, y, R, R * 0.35, 0, 0, 7); O.stroke(); O.restore(); }
function tint(c, a) { if (a <= 0) return; O.fillStyle = c.replace('A', a); O.fillRect(0, 0, W, H); }
function smoke(x, y, f, n = 6, k = 1) { for (let i = 0; i < n; i++) { const t = ((f * 0.03 + i / n) % 1); O.fillStyle = `rgba(200,200,215,${0.35 * (1 - t)})`; O.beginPath(); O.arc(x + Math.sin(i * 3 + f * 0.05) * 60 * k, y - t * 220 * k, (40 + t * 90) * k, 0, 7); O.fill(); } }
function embers(f, I, seed = 1) { const r = rng(seed); O.save(); O.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i++) { const x = r() * W, sp = 2 + r() * 6, y = (r() * H - f * sp * 3) % H; O.fillStyle = i % 2 ? `rgba(255,190,40,${0.8 * I})` : `rgba(255,60,20,${0.8 * I})`; O.fillRect(x, (y + H) % H, 4 + r() * 4, 4 + r() * 4); } O.restore(); }
function titleLine(txt, y, k, size, fill) { if (k <= 0.01) return; O.save(); O.translate(W / 2, y); O.scale(k, k); O.rotate(-0.04); O.font = `900 ${size}px Inter, Arial Black, Arial`; O.textAlign = 'center'; O.textBaseline = 'middle'; O.lineJoin = 'round'; O.lineWidth = size * 0.2; O.strokeStyle = '#1a0610'; O.strokeText(txt, 6, 8); O.strokeText(txt, 0, 0); O.fillStyle = fill; O.fillText(txt, 0, 0); O.restore(); }
function heroOnTop() { // re-render only the hero (and ghosts) so they keep full colour over a desaturated frozen world
  const hide = [STREET, ROOF, TUNNEL, portal, rain, shards, civ, runaway, ...cars, ...peds]; const vis = hide.map((o) => o.visible); hide.forEach((o) => (o.visible = false));
  const bg = scene.background; scene.background = null; renderer.setClearColor(0x000000, 0); renderer.render(scene, camera); O.drawImage(renderer.domElement, 0, 0);
  scene.background = bg; hide.forEach((o, i) => (o.visible = vis[i]));
}

// ---------- shots
const T = (f) => f / 30;
function reset() {
  STREET.visible = true; ROOF.visible = false; TUNNEL.visible = false; portal.visible = false; rain.visible = false; shards.visible = false;
  cracks.forEach((c) => (c.visible = false));
  for (const o of [hero, civ, runaway, ...ghosts, ...peds, ...cars]) o.visible = false;
  peds.forEach((p) => { p.scale.setScalar(p === peds[4] ? 1.1 : 1.18); if (p.userData.umb) p.userData.umb.visible = true; });
  standPose(hero); setFace(hero, 'smug'); HFN = null;
  heroLight.intensity = 0; heroLight.color.set('#ff4a1c'); portalLight.intensity = 0; fill.intensity = 2.0; fill.color.set('#ffb27a');
  scene.fog.near = 30; scene.fog.far = 170; scene.fog.color.set('#2a0f55'); renderer.toneMappingExposure = 1.25; hemi.intensity = 1.3;
  bokeh.uniforms.aperture.value = 0.0025; bloom.strength = 0.55;
}
const C = (p, l, d) => ({ p, l, d });
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const GAPS = () => window.ROOF_GAPS;
function roofY(z) { for (const [c, hw] of GAPS()) { const R = hw + 1.8; if (Math.abs(z - c) < R) return 1.5 * (1 - ((z - c) / R) ** 2); } return 0; }

// stage positions
const CROSS = -60, CW = [[-3.2, CROSS - 0.6], [-0.6, CROSS + 0.5], [2.0, CROSS - 0.3]], SAFE = (i) => [7.1, CROSS + 3 - i * 1.4];

const SHOTS = [
  { f0: 0, f1: 99, run(f) { // tease: a streak of red lightning races at the camera
    const fn = (g) => { let z; if (g < 55) z = -110 + 103 * prog(g, 0, 55) ** 1.6; else if (g < 85) z = -7 + 4 * prog(g, 55, 85); else z = -3 + 60 * prog(g, 85, 99) ** 1.4; const ph = g < 55 ? g * 1.3 : g < 85 ? 71.5 + (g - 55) * 0.22 : 78 + (g - 85) * 1.3; return { x: 0.9, z, ry: 0, ph, amt: 1, lean: 0.45 }; };
    const s = heroPath(fn, f, f < 55 || f > 85 ? 4 : 2, f < 55 ? 2.5 : 0.6); traffic(T(f)); setRain(0, 0, T(f), false); setFace(hero, f > 60 ? 'smug' : 'stern');
    heroLight.intensity = 6; heroLight.position.set(s.x, 1.2, s.z);
    const l = [s.x * 0.7, 1.2, Math.min(s.z, -1)]; return { cam: C([-0.9, 0.95, 2.2], l, dist([-0.9, 0.95, 2.2], [s.x, 1.2, s.z])), shake: f > 50 && f < 60 ? 1 : 0.2,
      fx: () => { trail(f, 16, 1.2); aura(hero, 1, f); heroBolts(hero, 1.2, f); speedLines(W / 2, H * 0.48, f < 55 ? 0.7 : f > 85 ? 1 : 0.25, f); if (f < 6) tint('rgba(255,255,255,A)', 1 - f / 6); if (f >= 8 && f < 14) tint('rgba(200,180,255,A)', 0.35 * (1 - prog(f, 8, 14))); } };
  } },
  { f0: 100, f1: 199, run(f) { // ordinary kid walking home in the rain... sparks begin
    const k = Math.min(f - 100, 75), z = -20 + k * 0.045; placeK(civ, { x: 6.3, z, ry: 0, ph: k * 0.22, amt: f < 175 ? 0.42 : 0, lean: 0.03 });
    const up = ss(prog(f, 180, 192)); civ.userData.arms[0].rotation.set(-1.3 * up, 0, -0.2 - 0.2 * up); civ.userData.arms[1].rotation.set(-1.3 * up, 0, 0.2 + 0.2 * up); civ.userData.head.rotation.x = 0.35 * up;
    setFace(civ, f < 178 ? 'happy' : 'shock', 0); traffic(T(f)); setRain(6, z, T(f), false);
    const I = prog(f, 165, 199); heroLight.intensity = I * 5; heroLight.position.set(6.3, 1.2, z + 0.4);
    return { cam: C([5.3, 1.55, z + 3.4 - prog(f, 100, 199) * 0.8], [6.3, 1.35, z], 3.2), shake: I * 0.4,
      fx: () => { aura(civ, I * 0.8, f); heroBolts(civ, I * 0.9, f, 5); } };
  } },
  { f0: 200, f1: 269, run(f) { // the lightning takes him... flash... ZÁS
    const z = -20 + 75 * 0.045; const sw = f >= 242; const k = sw ? hero : civ;
    k.visible = true; k.position.set(6.3, 0, z); k.rotation.set(0, 0, 0); standPose(k);
    if (!sw) { civ.userData.arms[0].rotation.set(-1.3, 0, -0.4); civ.userData.arms[1].rotation.set(-1.3, 0, 0.4); civ.userData.head.rotation.x = 0.3; setFace(civ, 'shock'); civ.position.y = prog(f, 215, 241) * 0.25; }
    else { const r = ss(prog(f, 244, 256)); hero.userData.arms[0].rotation.set(-0.3 * r, 0, -0.5 * r - 0.18); hero.userData.arms[1].rotation.set(-1.6 * r, 0, 0.5); hero.userData.legs[0].rotation.x = -0.25 * r; hero.userData.legs[1].rotation.x = 0.2 * r; setFace(hero, f > 250 ? 'smug' : 'shock'); hero.position.y = 0.25 * (1 - ss(prog(f, 242, 250))); }
    traffic(T(f)); setRain(6, z, T(f), false); heroLight.intensity = sw ? 4 + Math.sin(f * 0.9) : 6 + prog(f, 200, 241) * 6; heroLight.position.set(6.3, 1.3, z + 0.8);
    const cp = sw ? [6.3 + 0.75, 0.75, z + 2.3 - prog(f, 242, 269) * 0.5] : [6.3 + 0.9, 0.85, z + 1.7];
    return { cam: C(cp, [6.3, sw ? 1.3 : 1.55, z], 2.0), shake: sw ? 0.2 : 0.6 + prog(f, 200, 241),
      fx: () => { const I = sw ? 0.9 : 0.9 + prog(f, 200, 241) * 1.6; aura(k, I, f); heroBolts(k, I, f, 9); if (!sw) for (let i = 0; i < 3; i++) { const b = heroBox(k); if (b) bolt(b.cx + (i - 1) * 300, 0, b.cx + (i - 1) * 60, b.cy, f * 3 + i, BOLT_COLS[i], 5); }
        if (f >= 236 && f < 256) tint('rgba(255,250,235,A)', f < 242 ? prog(f, 236, 242) : 1 - prog(f, 242, 256)); } };
  } },
  { f0: 270, f1: 319, run(f) { // one step... and the world stops
    const z = -20 + 75 * 0.045; const st = ss(prog(f, 284, 303)); hero.visible = true; hero.position.set(6.3 - st * 0.55, 0, z); hero.rotation.set(0, -Math.PI / 2, 0); standPose(hero);
    hero.userData.legs[0].rotation.x = -Math.sin(st * Math.PI) * 0.7; hero.userData.legs[1].rotation.x = Math.sin(st * Math.PI) * 0.25; setFace(hero, 'stern');
    const wt = T(Math.min(f, 303)); traffic(wt); setRain(5, z, wt, f >= 303); heroLight.intensity = 3; heroLight.position.set(5.6, 0.6, z + 0.8);
    return { cam: C([3.6, 0.32, z + 2.6], [5.9, 0.55, z], 3.4), shake: f >= 303 && f < 312 ? 1.5 : 0, freeze: ss(prog(f, 303, 316)) * 0.7,
      fx: () => { const p = P(5.7, 0.05, z); ringFx(p[0], p[1], prog(f, 303, 322)); ringFx(p[0], p[1], prog(f, 309, 330), '255,60,30'); } };
  } },
  { f0: 320, f1: 374, run(f) { // wide: everything frozen
    const z = -20 + 75 * 0.045; hero.visible = true; hero.position.set(5.75, 0, z); hero.rotation.set(0, -Math.PI / 2 + Math.sin(T(f) * 2) * 0.3, 0); standPose(hero); hero.userData.head.rotation.y = Math.sin(T(f) * 2.4) * 0.5; setFace(hero, 'shock', Math.sin(T(f) * 2.4) * -0.6);
    const wt = T(303); traffic(wt); setRain(2, z - 4, wt, true);
    placeK(peds[0], { x: 7.2, z: z - 5, ry: Math.PI, ph: 0.9, amt: 0.5, lean: 0.05 }); placeK(peds[1], { x: -6.8, z: z - 8, ry: 0, ph: -0.9, amt: 0.5, lean: 0.05 }); placeK(peds[2], { x: 7.0, z: z - 11, ry: 0, ph: 0.5, amt: 0.5, lean: 0.05 });
    heroLight.intensity = 2.5; heroLight.position.set(5.75, 1.3, z + 1);
    return { cam: C([2.6 + prog(f, 320, 374) * 0.5, 2.3, z + 6.8], [5.2, 1.2, z - 1.5], 7.3), freeze: 0.7, heroTop: true, fx: () => {} };
  } },
  { f0: 375, f1: 439, run(f) { // rain hanging in the air
    const z = -16; hero.visible = true; hero.position.set(3.2, 0, z); hero.rotation.set(0, 0.4, 0); standPose(hero); setFace(hero, f > 412 ? 'happyc' : 'happy', 0.3);
    const r = ss(prog(f, 398, 414)); hero.userData.arms[1].rotation.set(-1.75 * r, -0.2 * r, 0.25); hero.userData.head.rotation.set(-0.15, 0.25, 0);
    traffic(T(303)); setRain(3.2, z, T(303), true); rainLocal(3.2, 1.9, z);
    heroLight.intensity = 2.2; heroLight.position.set(3.6, 2.2, z + 1.2);
    const a = lerp(-0.2, 1.0, prog(f, 375, 439));
    return { cam: C([3.2 + Math.sin(a) * 1.7, 1.85, z + Math.cos(a) * 1.7], [3.2, 1.7, z], 1.7), freeze: 0.65, heroTop: true, ap: 0.006,
      fx: () => { if (f > 414) { const h = PW(hero.userData.arms[1], 0); const p = P(3.2 + 0.32, 2.15, z + 0.55); for (let i = 0; i < 8; i++) { const ag = i / 8 * 7, R = 20 + prog(f, 414, 430) * 60; O.fillStyle = `rgba(190,235,255,${1 - prog(f, 414, 432)})`; O.beginPath(); O.arc(p[0] + Math.cos(ag) * R, p[1] + Math.sin(ag) * R, 7, 0, 7); O.fill(); } } } };
  } },
  { f0: 440, f1: 524, run(f) { // people frozen mid-move
    const z0 = -22, k = prog(f, 440, 524), hz = z0 - k * 6; placeK(hero, { x: 5.3, z: hz, ry: Math.PI, ph: f * 0.18, amt: 0.4, lean: 0.03 });
    const wave = prog(f, 488, 496) - prog(f, 512, 520); if (wave > 0) { const w = Math.sin(f * 0.6) * 0.4; hero.userData.arms[0].rotation.set(-1.5, 0, -0.9 + w); hero.userData.head.rotation.y = -0.5; }
    setFace(hero, f > 495 ? 'smug' : 'happy', f > 488 ? -0.5 : 0);
    placeK(peds[3], { x: 6.9, z: z0 - 7.5, ry: Math.PI / 2 + 0.3, ph: 1.0, amt: 0.6, lean: 0.1 }); setFace(peds[3], 'happy');
    placeK(peds[1], { x: 7.4, y: 0.55, z: z0 - 3.2, ry: Math.PI, ph: 1.4, amt: 0.8, lean: 0.15 }); setFace(peds[1], 'shock');
    placeK(peds[2], { x: 7.6, z: z0 - 1, ry: Math.PI, ph: 0.7, amt: 0.5, lean: 0.05 });
    placeK(peds[6], { x: 7.3, z: z0 - 10, ry: 0.4, ph: -0.8, amt: 0.5, lean: 0.05 }); setFace(peds[6], 'happyc');
    traffic(T(303)); setRain(5, hz - 2, T(303), true); heroLight.intensity = 2.4; heroLight.position.set(5.3, 1.5, hz - 0.8);
    return { cam: C([3.9, 1.65, hz - 4.2], [6.0, 1.4, hz - 0.6], 4.0), freeze: 0.7, heroTop: true, fx: () => {} };
  } },
  { f0: 525, f1: 571, run(f) { // across the rooftops (side tracking)
    STREET.visible = false; ROOF.visible = true;
    const fn = (g) => { const z = 6 - (g - 525) * 0.95; return { x: 0, y: roofY(z), z, ry: Math.PI, ph: g * 1.1, amt: 1, lean: 0.5 }; };
    const s = heroPath(fn, f, 4, 1.3); setFace(hero, 'happyc'); heroLight.intensity = 6; heroLight.position.set(s.x, s.y + 1.2, s.z);
    return { cam: C([-6.8, 1.8, s.z + 1.2], [0, s.y + 0.9, s.z - 1.4], 7), ap: 0.0015, fx: () => { trail(f, 18); aura(hero, 1, f); heroBolts(hero, 1, f); hLines(0.8, f, -1); } };
  } },
  { f0: 572, f1: 619, run(f) { // leaps over the camera
    STREET.visible = false; ROOF.visible = true;
    const zc = 6 - (600 - 525) * 0.95; const slow = (g) => g < 592 ? g : g < 612 ? 592 + (g - 592) * 0.3 : 598 + (g - 612);
    const fn = (g) => { const gg = slow(g); const z = 6 - (gg - 525) * 0.95; const jump = Math.max(0, 1 - ((z - zc + 0.5) / 4.2) ** 2) * 2.4; return { x: 0.3, y: roofY(z) + jump, z, ry: Math.PI, ph: gg * 1.1, amt: 1, lean: 0.45 }; };
    const s = heroPath(fn, f, 3, 1.2); setFace(hero, 'smug'); heroLight.intensity = 6; heroLight.position.set(s.x, s.y + 1.2, s.z);
    const cp = [1.2, 0.35, zc - 1.2]; const l = [s.x, s.y + 1.0, Math.max(s.z, zc - 0.4)];
    return { cam: C(cp, l, dist(cp, [s.x, s.y + 1, s.z])), ap: 0.0015, shake: f > 600 && f < 612 ? 0.5 : 0.1, fx: () => { trail(f, 14); aura(hero, 1, f); heroBolts(hero, 1.1, f); } };
  } },
  { f0: 620, f1: 689, run(f) { // across the city in two seconds
    const fn = (g) => ({ x: 0, z: 20 - (g - 620) * 2.6, ry: Math.PI, ph: g * 1.4, amt: 1, lean: 0.55 });
    const s = heroPath(fn, f, 5, 0.9); setFace(hero, 'happyc'); traffic(T(303)); setRain(0, s.z - 6, T(303), true);
    heroLight.intensity = 7; heroLight.position.set(0, 1.2, s.z);
    return { cam: C([0.7, 1.4, s.z + 4.0], [0, 1.15, s.z - 6], 4.1), ap: 0.0015, shake: 0.3,
      fx: () => { trail(f, 20, 1.3); aura(hero, 1.1, f); heroBolts(hero, 1.2, f); const b = heroBox(); if (b) speedLines(b.cx, b.cy, 1, f); } };
  } },
  { f0: 690, f1: 759, run(f) { // weaving between cars like statues
    const fn = (g) => { const z = -40 - (g - 690) * 1.5; const jump = Math.max(0, 1 - ((z + 95) / 3.4) ** 2) * 2.0; return { x: Math.sin((g - 690) * 0.16) * 0.9, y: jump, z, ry: Math.PI + Math.cos((g - 690) * 0.16) * 0.25, ph: g * 1.3, amt: 1, lean: 0.5 }; };
    const s = heroPath(fn, f, 4, 1.0); setFace(hero, f > 716 ? 'smug' : 'happy');
    traffic(T(303)); cars[1].position.set(0, 0, -95); cars[1].rotation.y = Math.PI; for (let i = 2; i < 10; i++) { cars[i].position.set(i % 2 ? 2.6 : -2.6, 0, -50 - i * 7); cars[i].rotation.y = i % 2 ? Math.PI : 0; }
    setRain(0, s.z - 5, T(303), true); heroLight.intensity = 6; heroLight.position.set(s.x, 1.2, s.z);
    const cp = [0.4, 2.3, s.z - 6.5];
    return { cam: C(cp, [s.x * 0.5, 1.1 + s.y * 0.5, s.z], 6.5), ap: 0.0015, shake: 0.25, fx: () => { trail(f, 16); aura(hero, 1, f); heroBolts(hero, 1, f); } };
  } },
  { f0: 760, f1: 815, run(f) { // then you see it...
    const z = -50; hero.visible = true; hero.position.set(5.9, 0, z); hero.rotation.set(0, -Math.PI * 0.62, 0); standPose(hero);
    const turn = ss(prog(f, 768, 776)); hero.userData.head.rotation.y = lerp(0.6, -0.15, turn); setFace(hero, f < 772 ? 'happy' : f < 798 ? 'shock' : 'stern', -0.3);
    traffic(T(f) + 20, [0]); setRain(5, z, T(f), false); placeCar(runaway, { x: 0.4, z: -150 + (f - 760) * 0.8, ry: Math.sin(f * 0.2) * 0.25, amt: 0 }); runaway.userData.body.rotation.set(0, 0, 0);
    heroLight.intensity = 2.5; heroLight.position.set(5.5, 1.8, z - 1); fill.position.set(4.6, 2, z - 2); fill.color.set('#cfe4ff'); fill.intensity = 2 + Math.max(0, Math.sin(f * 0.25)) * 2;
    return { cam: C([5.05, 1.72, z - 1.25 + prog(f, 760, 815) * 0.25], [5.9, 1.68, z], 1.2), ap: 0.004, fx: () => {} };
  } },
  { f0: 816, f1: 904, run(f) { // runaway car toward the crosswalk
    traffic(T(f) + 20, [0, 1]); setRain(0, -55, T(f), false);
    const cz = -150 + (f - 760) * 0.8; placeCar(runaway, { x: Math.sin(f * 0.12) * 1.3, z: cz, ry: Math.sin(f * 0.21) * 0.35, amt: 0 }); runaway.userData.body.rotation.z = Math.sin(f * 0.21) * 0.05;
    const turn = f > 856; CW.forEach(([x, z], i) => { placeK(peds[i], { x: turn ? x + 1.4 : x + (f - 816) * 0.03, z, ry: turn ? Math.PI : Math.PI / 2, ph: f * 0.2 + i, amt: turn ? 0 : 0.45, lean: 0.03 }); setFace(peds[i], turn ? 'shock' : 'happy'); if (turn) { const u = peds[i].userData; u.arms[0].rotation.set(0, 0, -2.2); u.arms[1].rotation.set(0, 0, 2.2); } });
    fill.position.set(0, 2, cz + 4); fill.color.set('#fff3d0'); fill.intensity = 6;
    return { cam: C([-1.4 + prog(f, 816, 904) * 0.6, 1.25, -49], [0.6, 1.4, -72], 11), shake: 0.25 + prog(f, 870, 904) * 0.5,
      fx: () => { const p = P(runaway.position.x, 0.4, cz - 2); if (p[2] < 1) smoke(p[0], p[1], f, 6, 0.6); } };
  } },
  { f0: 905, f1: 999, run(f) { // the rescue in a blink
    traffic(T(870) + 20, [0, 1]); setRain(0, -60, T(905) + (f - 905) * 0.004, false);
    const cz = f < 970 ? -80 + (f - 905) * 0.21 : f < 985 ? -66.4 + (f - 970) * 1.6 : -42.4 + 0 * (f - 985);
    placeCar(runaway, { x: 0.3, z: cz, ry: f < 985 ? 0.15 : 0.4, amt: 0 });
    const SW = [925, 940, 955];
    CW.forEach(([x, z], i) => { const safe = f >= SW[i]; const [sx, sz] = SAFE(i); placeK(peds[i], { x: safe ? sx : x + 1.4, z: safe ? sz : z, ry: safe ? -Math.PI / 2 : Math.PI, amt: 0 }); setFace(peds[i], 'shock'); const u = peds[i].userData; u.arms[0].rotation.set(0, 0, -2.2); u.arms[1].rotation.set(0, 0, 2.2); });
    const fn = (g) => { for (let i = 0; i < 3; i++) { if (g < SW[i] && g >= SW[i] - 15) { const t = prog(g, SW[i] - 15, SW[i]); const [x, z] = CW[i], [sx, sz] = SAFE(i); const a = t < 0.5 ? ss(t * 2) : 1 - ss((t - 0.5) * 2); return { x: lerp(sx - 1.2, x + 1.4, a), z: lerp(sz, z, a), ry: -Math.PI / 2 + (t < 0.5 ? Math.PI : 0), ph: g * 1.5, amt: 1, lean: 0.5 }; } } return { x: 6.3, z: CROSS + 5, ry: -Math.PI / 2, ph: 0, amt: 0, lean: 0 }; };
    if (f < 958) heroPath(fn, f, 3, 1.2); else if (f < 985) { hero.visible = true; hero.position.set(6.2, 0, CROSS + 5); hero.rotation.set(0, -Math.PI / 2, 0); standPose(hero); setFace(hero, 'smug'); }
    heroLight.intensity = hero.visible ? 5 : 0; heroLight.position.set(hero.position.x, 1.3, hero.position.z);
    fill.position.set(0, 2, cz + 4); fill.color.set('#fff3d0'); fill.intensity = 5;
    return { cam: C([10.5, 8.5, -47], [1.5, 0.3, -61], 17), ap: 0.001, freeze: f < 970 ? 0.35 : 0, shake: f > 970 && f < 990 ? 0.6 : 0,
      fx: () => { if (f < 958) { trail(f, 10, 0.8); heroBolts(hero, 0.8, f); } SW.forEach((s, i) => { if (f >= s && f < s + 8) { const a = P(CW[i][0] + 1.4, 1, CW[i][1]), b = P(...SAFE(i).slice(0, 1), 1, SAFE(i)[1]); bolt(a[0], a[1], b[0], b[1], f * 5 + i, BOLT_COLS[i], 5); } });
        if (f >= 985) { const p = P(runaway.position.x, 0.5, runaway.position.z + 2); smoke(p[0], p[1], f, 6, 0.8); } if (f >= 985 && f < 990) { hero.visible = false; } } };
  } },
  { f0: 1000, f1: 1079, run(f) { // nobody understands what happened
    traffic(T(870) + 20, [0, 1]); setRain(5, -58, T(f), false); placeCar(runaway, { x: 0.3, z: -42.4, ry: 0.4, amt: 0 });
    for (let i = 0; i < 3; i++) { const [sx, sz] = SAFE(i); placeK(peds[i], { x: sx, z: sz, ry: -Math.PI / 2 + Math.sin(T(f) * 1.6 + i) * 0.6, amt: 0, lean: 0 }); const u = peds[i].userData; u.head.rotation.y = Math.sin(T(f) * 2.2 + i * 2) * 0.7; setFace(peds[i], i === 1 ? 'worry' : 'shock', Math.sin(T(f) * 2.2 + i * 2)); u.arms[0].rotation.set(0, 0, -0.6); u.arms[1].rotation.set(0, 0, 0.6); }
    fill.position.set(5, 2.5, -55); fill.intensity = 2.5;
    return { cam: C([3.7, 1.55, -53.2 + prog(f, 1000, 1079) * 0.4], [7.0, 1.55, CROSS + 1.6], 4.6),
      fx: () => { for (let i = 0; i < 3; i++) { const [sx, sz] = SAFE(i); const h = PW(peds[i].userData.head, 0.9); bubble(h[0], h[1] - 30, ['?', '?!', 'QUÊ?'][i], pop(f, 1008 + i * 12), { fs: 64 }); }
        const r = rng(Math.floor(f / 2)); for (let i = 0; i < 3; i++) { const p = P(5 + r() * 1.5, 0.05, CROSS + 4 + r() * 2); bolt(p[0], p[1], p[0] + (r() - 0.5) * 120, p[1] - r() * 60, f + i, BOLT_COLS[i], 2.5 * (1 - prog(f, 1000, 1079)), false); } } };
  } },
  { f0: 1080, f1: 1174, run(f) { // the speed won't stop growing
    const fn = (g) => ({ x: 0, z: -240 + (g - 1080) * 1.5, ry: 0, ph: g * 1.5, amt: 1, lean: 0.55 });
    const s = heroPath(fn, f, 5, 0.8); setFace(hero, f < 1118 ? 'happy' : 'worry'); traffic(T(303));
    const I = 1 + prog(f, 1080, 1174) * 1.4; heroLight.intensity = 6 + I * 3; heroLight.position.set(0, 1.3, s.z + 0.5);
    return { cam: C([0.6, 1.35, s.z + 4.4], [0, 1.25, s.z], 4.4), ap: 0.0015, shake: 0.2 + prog(f, 1080, 1174) * 1.2,
      fx: () => { trail(f, 14); aura(hero, I, f); heroBolts(hero, I, f); const b = heroBox(); if (b) speedLines(b.cx, b.cy, 0.5 + I * 0.25, f); tint('rgba(255,30,10,A)', prog(f, 1100, 1174) * 0.14); if ([1112, 1113, 1150, 1151].includes(f)) tint('rgba(255,230,200,A)', 0.4); } };
  } },
  { f0: 1175, f1: 1240, run(f) { // the bolts explode, the windows burst
    const fn = (g) => ({ x: 0.6, z: -150 + (g - 1175) * 2.4, ry: 0, ph: g * 1.5, amt: 1, lean: 0.55 });
    const s = heroPath(fn, f, 5, 0.8); setFace(hero, 'worry'); traffic(T(303)); setShards(s.z);
    heroLight.intensity = 14; heroLight.position.set(0.6, 1.5, s.z);
    return { cam: C([-4.3, 1.05, -30], [0.2, 2.6, -66], 30), ap: 0.0008, shake: 1.6,
      fx: () => { trail(f, 16, 1.3); aura(hero, 2.2, f); heroBolts(hero, 2.2, f); const b = heroBox(); const r = rng(Math.floor(f / 2) * 9);
        if (b) for (let i = 0; i < 3; i++) { const sx = r() < 0.5 ? -1 : 1; const t = P(sx * 7.9, 3 + r() * 12, s.z - 2 + r() * 6); if (t[2] < 1) bolt(b.cx, b.cy, t[0], t[1], f * 13 + i, BOLT_COLS[i], 6); }
        if (f % 9 < 2) tint('rgba(255,220,180,A)', 0.25); } };
  } },
  { f0: 1241, f1: 1304, run(f) { // the asphalt cracks behind you
    const fn = (g) => ({ x: 0, z: -200 + (g - 1241) * 1.4, ry: 0, ph: g * 1.5, amt: 1, lean: 0.55 });
    const s = heroPath(fn, f, 5, 0.8); setFace(hero, 'worry'); traffic(T(303), [0, 1, 2, 3]);
    cracks.forEach((c) => { const t = clamp((s.z - 1 - c.userData.z) / 3); c.visible = t > 0; c.material.opacity = t; c.scale.set(1, 0.3 + 0.7 * t, 1); });
    heroLight.intensity = 14; heroLight.position.set(0, 1.4, s.z);
    return { cam: C([0.6, 5.2, s.z - 9.5], [0, 0.9, s.z + 5], 10), ap: 0.001, shake: 1.2,
      fx: () => { trail(f, 14); aura(hero, 2.4, f); heroBolts(hero, 2.4, f); embers(f, 0.8, 3); const r = rng(Math.floor(f / 2) * 5); for (let i = 0; i < 2; i++) { const b = heroBox(); const t = P((r() - 0.5) * 9, 0, s.z - 3 - r() * 6); if (b && t[2] < 1) bolt(b.cx, b.cy + b.hp * 0.4, t[0], t[1], f * 7 + i, BOLT_COLS[i + 1], 5); } } };
  } },
  { f0: 1305, f1: 1379, run(f) { // a portal opens ahead
    const fn = (g) => ({ x: 0, z: -130 + (g - 1305) * 1.0, ry: 0, ph: g * 1.4, amt: 1, lean: 0.5 });
    const s = heroPath(fn, f, 4, 1.0); setFace(hero, 'shock'); traffic(T(303), [0, 1, 2, 3, 4, 5]);
    const g = ss(prog(f, 1318, 1352)); portal.visible = true; portal.position.set(0, 3.4, -32); portal.rotation.set(0, 0, 0); portal.scale.setScalar(Math.max(0.001, g * (1 + Math.sin(f * 0.3) * 0.03))); portalDisc.rotation.z = f * 0.09; portalRing2.rotation.z = -f * 0.05;
    portalLight.intensity = g * 12; portalLight.position.set(0, 3.4, -33);
    heroLight.intensity = 9; heroLight.position.set(0, 1.4, s.z);
    return { cam: C([0.9, 1.5, s.z - 4.6], [0, 2.3, s.z + 14], 20), ap: 0.0008, shake: 0.6,
      fx: () => { trail(f, 12); aura(hero, 1.8, f); heroBolts(hero, 1.8, f); if (g > 0) { const p = P(0, 3.4, -32); if (p[2] < 1) { O.save(); O.globalCompositeOperation = 'lighter'; const R = 500 * g; const gr = O.createRadialGradient(p[0], p[1], 0, p[0], p[1], R); gr.addColorStop(0, 'rgba(150,220,255,.45)'); gr.addColorStop(1, 'rgba(120,60,255,0)'); O.fillStyle = gr; O.fillRect(p[0] - R, p[1] - R, R * 2, R * 2); O.restore(); for (let i = 0; i < 3; i++) { const a = f * 0.2 + i * 2.1; bolt(p[0], p[1], p[0] + Math.cos(a) * 260 * g, p[1] + Math.sin(a) * 260 * g, f * 3 + i, i % 2 ? '#9ff0ff' : '#ffd23f', 4); } } } } };
  } },
  { f0: 1380, f1: 1429, run(f) { // the realization on his face
    const fn = (g) => ({ x: 0, z: -55 + (g - 1380) * 0.35, ry: 0, ph: g * 0.6, amt: 1, lean: 0.45 });
    const s = heroPath(fn, f, 2, 2.0); setFace(hero, f < 1404 ? 'shock' : 'stern'); traffic(T(303), [0, 1, 2, 3, 4, 5]);
    portal.visible = true; portal.position.set(0, 3.4, -32); portal.scale.setScalar(1.05); portalDisc.rotation.z = f * 0.09;
    portalLight.intensity = 14; portalLight.position.set(0, 3.4, -33); heroLight.intensity = 5; heroLight.position.set(0, 1.4, s.z - 0.6);
    return { cam: C([-0.55, 1.62, s.z + 2.5 - prog(f, 1380, 1429) * 0.6], [0, 1.6, s.z], 2.2), ap: 0.004, shake: 0.35,
      fx: () => { aura(hero, 1.4, f); heroBolts(hero, 1.4, f); O.save(); O.globalCompositeOperation = 'lighter'; const gr = O.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(120,200,255,.25)'); gr.addColorStop(0.5, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(255,190,60,.18)'); O.fillStyle = gr; O.fillRect(0, 0, W, H); O.restore(); } };
  } },
  { f0: 1430, f1: 1479, run(f) { // inside the time tunnel
    STREET.visible = false; TUNNEL.visible = true; tunnelTick(f);
    hero.visible = true; hero.position.set(0, 0, 0); hero.rotation.set(0, 0, 0); runPose(hero, f * 1.4, 1, 0.5); setFace(hero, 'shock', 0); for (let i = 0; i < 4; i++) { placeK(ghosts[i], { x: 0, z: -(i + 1) * 0.7, ry: 0, ph: (f - i - 1) * 1.4, amt: 1, lean: 0.5 }); ghosts[i].userData.gm.opacity = 0.3 * (1 - i / 4); }
    heroLight.intensity = 6; heroLight.position.set(0, 1.5, 0.6); hemi.intensity = 2;
    return { cam: C([-1.9, 1.35, -3.6], [0, 1.3, 3], 4.0), ap: 0.002, shake: 0.4, fx: () => { aura(hero, 1.5, f); heroBolts(hero, 1.5, f); speedLines(W / 2, H * 0.42, 1, f, '200,230,255'); if (f < 1438) tint('rgba(255,255,255,A)', 1 - prog(f, 1430, 1438)); } };
  } },
  { f0: 1480, f1: 1529, run(f) { // ...he's running back in time
    STREET.visible = false; TUNNEL.visible = true; tunnelTick(f);
    hero.visible = true; hero.position.set(0, 0, 0); hero.rotation.set(0, 0, 0); runPose(hero, f * 1.4, 1, 0.5); setFace(hero, 'stern');
    heroLight.intensity = 6; heroLight.position.set(0, 1.5, -0.8); hemi.intensity = 2;
    return { cam: C([0.35, 0.55, -3.0 - prog(f, 1480, 1529) * 0.8], [0, 3.2, 30], 30), ap: 0.0008, shake: 0.4,
      fx: () => { aura(hero, 1.6, f); heroBolts(hero, 1.6, f); speedLines(W / 2, H * 0.36, 1, f, '255,220,160'); if (f > 1518) tint('rgba(255,255,255,A)', prog(f, 1518, 1529)); } };
  } },
  { f0: 1530, f1: TOTAL - 1, run(f) { // epic finale: running at the camera wrapped in lightning
    const fn = (g) => ({ x: 0, z: -62 + (g - 1530) * 0.05, ry: 0, ph: g * 0.2, amt: 1, lean: 0.5 });
    const s = heroPath(fn, f, 3, 4); setFace(hero, f < 1600 ? 'stern' : 'smug'); traffic(T(303), [0, 1, 2, 3, 4, 5]); setRain(0, s.z + 2, T(303) + (f - 1530) * 0.004, false);
    portal.visible = true; portal.position.set(0, 3.6, -72); portal.scale.setScalar(1.3); portalDisc.rotation.z = f * 0.05; portalLight.intensity = 10; portalLight.position.set(0, 3.6, -71);
    heroLight.intensity = 9; heroLight.position.set(0, 1.4, s.z + 0.8);
    const k = prog(f, 1530, 1799);
    return { cam: C([Math.sin(T(f) * 0.6) * 0.35, 0.9 + k * 0.15, s.z + 4.4 - k * 0.8], [0, 2.15, s.z], 4.4 - k * 0.8), ap: 0.0025, shake: 0.35,
      fx: () => { trail(f, 10, 0.7); aura(hero, 1.4, f); heroBolts(hero, 1.6, f); embers(f, 0.9, 7); if (f < 1536) tint('rgba(255,255,255,A)', 1 - prog(f, 1530, 1536));
        const r = rng(Math.floor(f / 3) * 11); const b = heroBox(); if (b) for (let i = 0; i < 2; i++) bolt(b.cx, b.cy, r() < 0.5 ? -40 : W + 40, r() * H * 0.8, f * 9 + i, BOLT_COLS[i], 5);
        O.save(); O.fillStyle = 'rgba(10,0,20,.35)'; O.fillRect(0, 0, W, 760 * Math.min(1, pop(f, 1538))); O.restore();
        titleLine('VOCÊ AGUENTARIA', 250, pop(f, 1540), 104, '#ffffff'); titleLine('TER ESSE PODER', 400, pop(f, 1575), 104, '#ffffff'); titleLine('POR 24 HORAS?', 580, pop(f, 1600, 1610) * (1 + Math.sin(f * 0.2) * 0.02), 128, '#ffc21a'); } };
  } },
];

function placeCar(c, s) { c.visible = true; c.position.set(s.x, 0, s.z); c.rotation.set(0, s.ry || 0, 0); }
function rainLocal(cx, cy, cz) { rain.visible = true; const r = rng(4); for (let i = 0; i < RAIN_N; i++) { DUMMY.position.set(cx + (r() - 0.5) * 3.5, cy - 1.2 + r() * 2.6, cz + (r() - 0.5) * 3.5); if (Math.hypot(DUMMY.position.x - cx, DUMMY.position.z - cz) < 0.45) DUMMY.position.y += 3; DUMMY.rotation.set(0, 0, 0); DUMMY.scale.set(1.3, 0.35, 1.3); DUMMY.updateMatrix(); rain.setMatrixAt(i, DUMMY.matrix); } rain.instanceMatrix.needsUpdate = true; }
function tunnelTick(f) {
  TUN_TEX.offset.y = f * 0.035; scene.fog.near = 20; scene.fog.far = 140; scene.fog.color.set('#1a0850');
  clocks.forEach((c) => { const [x, y, z] = c.userData.base; let zz = z - f * 0.9; zz = ((zz + 130) % 160 + 160) % 160 - 130; c.position.set(x, y, zz); c.lookAt(0, 3, zz - 6); c.rotateY(Math.PI); c.userData.hh.rotation.z = f * 0.25; c.userData.mh.rotation.z = f * 1.2; });
  bigClock.userData.hh.rotation.z = f * 0.12; bigClock.userData.mh.rotation.z = f * 0.6 * (1 + prog(f, 1480, 1529) * 2);
}

function renderFrame(f) {
  reset();
  const sh = SHOTS.find((s) => f >= s.f0 && f <= s.f1) || SHOTS[SHOTS.length - 1];
  const R = sh.run(f);
  let [px, py, pz] = R.cam.p; const sk = (R.shake || 0) * 0.03; const r = rng(f * 7 + 1);
  px += (r() - 0.5) * sk; py += (r() - 0.5) * sk; pz += (r() - 0.5) * sk * 0.5;
  camera.position.set(px, py, pz); camera.lookAt(...R.cam.l); camera.rotation.z += (r() - 0.5) * sk * 0.15;
  key.position.set(px + 6, 14, pz + 4); key.target.position.set(R.cam.l[0], 0, R.cam.l[2]); key.target.updateMatrixWorld();
  if (fill.intensity === 2.0) fill.position.set(px + 0.8, py + 1.5, pz + 0.5);
  bokeh.uniforms.focus.value = R.cam.d; bokeh.uniforms.aperture.value = R.ap ?? 0.0025;
  composer.render();
  O.globalCompositeOperation = 'source-over'; O.globalAlpha = 1;
  O.drawImage(renderer.domElement, 0, 0);
  if (R.freeze) desat(R.freeze);
  if (R.heroTop && hero.visible) heroOnTop();
  R.fx();
  const v = O.createRadialGradient(W / 2, H * 0.45, W * 0.42, W / 2, H / 2, H * 0.72); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(10,0,25,.5)'); O.fillStyle = v; O.fillRect(0, 0, W, H);
  return out.toDataURL('image/jpeg', 0.9);
}
window.renderFrame = renderFrame; window.ready = true;
