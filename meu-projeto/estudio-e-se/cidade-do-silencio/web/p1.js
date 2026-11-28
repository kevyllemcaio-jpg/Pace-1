// 3D "E se você tivesse supervelocidade por 24 horas?" — hero ZÁS (original), night city
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const W = 1080, H = 1920, TOTAL = 1320;
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
