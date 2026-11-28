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
// ---------- better 3D hair (original): fringe, face-framing locks, layered strands, shine band, styled ends
const HAIR_TEX = tex(256, 256, (g) => { g.fillStyle = '#808080'; g.fillRect(0, 0, 256, 256); const r = rng(77); for (let i = 0; i < 260; i++) { const x = r() * 256, v = 90 + r() * 90; g.strokeStyle = `rgba(${v},${v},${v},.55)`; g.lineWidth = 1 + r() * 2; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + (r() - 0.5) * 20, 90, x + (r() - 0.5) * 20, 170, x + (r() - 0.5) * 16, 256); g.stroke(); } });
HAIR_TEX.colorSpace = THREE.NoColorSpace;
function edgeTex(n, depth, wave) { const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 512, 256); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(0, 0); g.lineTo(512, 0); g.lineTo(512, 256 - depth); for (let i = n; i >= 0; i--) { const x = i / n * 512; const xm = (i - 0.5) / n * 512; g.lineTo(x, 256 - depth); if (i > 0) g.quadraticCurveTo(xm + (wave ? Math.sin(i * 2.1) * 12 : 0), 256 + (wave ? -depth * 0.2 : 0), (i - 1) / n * 512, 256 - depth); } g.closePath(); g.fill(); const t = new THREE.CanvasTexture(c); return t; }
const EDGE_F = edgeTex(7, 70, false), EDGE_B = edgeTex(9, 50, false), EDGE_L = edgeTex(12, 46, true);
const hairMats = new Map();
function hairMat(col, k = 0) { const key = col + k; if (hairMats.has(key)) return hairMats.get(key); const c = new THREE.Color(col); c.offsetHSL(0, 0, k); const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.42, metalness: 0.05, bumpMap: HAIR_TEX, bumpScale: 0.6 }); hairMats.set(key, m); return m; }
function lock(len, w, col, k, tp = 0.5) { const g = new THREE.Group(); const c = M(new THREE.CylinderGeometry(w, w * tp, len, 12, 4), hairMat(col, k), [0, -len / 2, 0]); c.scale.z = 0.62; g.add(c); const e = M(new THREE.SphereGeometry(w * tp, 10, 8), hairMat(col, k), [0, -len, 0]); e.scale.z = 0.62; g.add(e); g.add(M(new THREE.SphereGeometry(w, 10, 8), hairMat(col, k))).scale.z = 0.62; return g; }
function place(head, obj, x, y, z, rx = 0, ry = 0, rz = 0) { obj.position.set(x, y, z); obj.rotation.set(rx, ry, rz); head.add(obj); return obj; }
function hair3d(head, o) {
  const col = o.hair, r = rng(String(col).length * 31 + (o.style || '').length * 7);
  // crown cap (slightly larger than the skull) + shine band
  const cap = M(new THREE.SphereGeometry(0.325, 44, 24, 0, Math.PI * 2, 0, Math.PI * 0.47), hairMat(col)); cap.scale.set(1.04, 1.28, 1.06); cap.rotation.x = -0.3; head.add(cap);
  const shine = M(new THREE.TorusGeometry(0.26, 0.012, 6, 40, Math.PI * 0.9), new THREE.MeshStandardMaterial({ color: new THREE.Color(col).offsetHSL(0, 0, 0.3), roughness: 0.2, emissive: new THREE.Color(col).offsetHSL(0, 0, 0.25), emissiveIntensity: 0.35 })); shine.position.set(0, 0.26, -0.02); shine.rotation.set(-1.05, 0, Math.PI * 0.05 + Math.PI * 0.55); head.add(shine);
  // bangs: a shell over the forehead with a scalloped edge (alpha map), like cartoon fringe
  const bangs = new THREE.Mesh(new THREE.SphereGeometry(0.334, 48, 20, Math.PI / 2 - Math.PI * 0.38, Math.PI * 0.76, Math.PI * 0.1, Math.PI * 0.3), new THREE.MeshStandardMaterial({ color: col, roughness: 0.42, bumpMap: HAIR_TEX, bumpScale: 0.6, alphaMap: o.style === 'bob' ? EDGE_B : EDGE_F, alphaTest: 0.5, side: THREE.DoubleSide }));
  bangs.scale.set(1.04, 1.28, 1.07); bangs.castShadow = true; head.add(bangs);
  // face-framing side locks
  for (const sx of [-1, 1]) { const L = lock(o.style === 'bob' ? 0.34 : 0.5, 0.07, col, 0.03, 0.55); L.scale.z = 0.7; place(head, L, sx * 0.28, 0.2, 0.09, 0.05, 0, sx * 0.08); }
  if (o.style === 'long' || o.style === 'bob') {
    const len = o.style === 'long' ? 0.85 : 0.42;
    const shell = M(new THREE.CylinderGeometry(0.315, o.style === 'long' ? 0.37 : 0.35, len, 40, 6, true, Math.PI * 0.3, Math.PI * 1.4), new THREE.MeshStandardMaterial({ color: col, roughness: 0.42, bumpMap: HAIR_TEX, bumpScale: 0.6, alphaMap: EDGE_L, alphaTest: 0.5, side: THREE.DoubleSide })); shell.position.set(0, 0.27 - len / 2, -0.015); head.add(shell);
    const inner = M(new THREE.CylinderGeometry(0.3, 0.34, len * 0.92, 32, 1, true, Math.PI * 0.3, Math.PI * 1.4), new THREE.MeshStandardMaterial({ color: new THREE.Color(col).offsetHSL(0, 0, -0.08), roughness: 0.6, side: THREE.DoubleSide })); inner.position.set(0, 0.2 - len * 0.46, -0.02); head.add(inner);
  }
  if (o.style === 'pony') {
    const tie = M(new THREE.TorusGeometry(0.06, 0.025, 8, 18), mat(o.bow || '#ff5fa2', 0.4), [0, 0.2, -0.33]); tie.rotation.x = 0.5; head.add(tie);
    let y = 0.2, z = -0.36; for (let i = 0; i < 4; i++) { const w = 0.09 - i * 0.012; const L = lock(0.19, w, col, (i % 2) * 0.04, 0.8); place(head, L, 0, y, z, 0.6 - i * 0.3, 0, 0); y -= 0.15; z -= 0.08 - i * 0.03; }
  }
  if (o.style === 'buns') for (const sx of [-1, 1]) { const b = M(new THREE.SphereGeometry(0.11, 18, 14), hairMat(col), [sx * 0.21, 0.34, -0.05]); head.add(b); const sw = M(new THREE.TorusGeometry(0.075, 0.018, 6, 20), hairMat(col, 0.08), [sx * 0.21, 0.34, 0.04]); head.add(sw); const tie = M(new THREE.TorusGeometry(0.1, 0.02, 6, 20), mat(o.bow || '#ff5fa2', 0.4), [sx * 0.21, 0.28, -0.05]); tie.rotation.x = Math.PI / 2; head.add(tie); }
  if (o.bow) { const g = new THREE.Group(); for (const sx of [-1, 1]) { const w = M(new THREE.ConeGeometry(0.06, 0.12, 12), mat(o.bow, 0.35), [sx * 0.06, 0, 0]); w.rotation.z = -sx * Math.PI / 2; w.scale.z = 0.5; g.add(w); } g.add(M(new THREE.SphereGeometry(0.03, 10, 8), mat(o.bow, 0.3))); place(head, g, 0.19, 0.37, 0.02, 0, 0, -0.4); }
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
  if (o.hair) { if (o.style === 'short' || o.style === 'cap0') { const cap = M(new THREE.SphereGeometry(0.315, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.42), mat(o.hair, 0.5)); cap.scale.set(1, 1.28, 1); cap.rotation.x = -0.22; head.add(cap); } else hair3d(head, o); }
  if (o.glasses) for (const sx of [-1, 1]) { const g = M(new THREE.TorusGeometry(0.068, 0.008, 8, 24), mat('#3a1f5c', 0.3), [sx * 0.1, 0.03, 0.3]); head.add(g); }
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

// ---------- original alien watch (green core + white 4-point star)
function watchTex(c1, c2) { return tex(256, 256, (g) => { const hx = (r) => { g.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + Math.PI / 6; g.lineTo(128 + Math.cos(a) * r, 128 + Math.sin(a) * r); } g.closePath(); }; g.fillStyle = '#0c0a14'; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 6; i++) { const a0 = i / 6 * Math.PI * 2 + 0.12, a1 = (i + 1) / 6 * Math.PI * 2 - 0.12; g.beginPath(); g.arc(128, 128, 118, a0, a1); g.arc(128, 128, 84, a1, a0, true); g.closePath(); const gr = g.createRadialGradient(128, 128, 84, 128, 128, 118); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fill(); } hx(70); const gc = g.createRadialGradient(128, 128, 4, 128, 128, 70); gc.addColorStop(0, '#ffffff'); gc.addColorStop(0.4, c1); gc.addColorStop(1, c2); g.fillStyle = gc; g.fill(); g.fillStyle = '#0c0a14'; g.beginPath(); g.moveTo(128, 76); g.lineTo(150, 128); g.lineTo(128, 180); g.lineTo(106, 128); g.closePath(); g.fill(); g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(128, 92); g.lineTo(140, 128); g.lineTo(128, 164); g.lineTo(116, 128); g.closePath(); g.fill(); }); }
const WT = { green: watchTex('#7dff6a', '#0b8a3a'), red: watchTex('#ff6b6b', '#8a0b16'), gold: watchTex('#ffe27a', '#b8860b'), off: watchTex('#4a4a55', '#1d1d25') };
const WCOL = { green: '#5dff7a', red: '#ff2d3a', gold: '#ffc83a', off: '#222222' };
const watchFaceMat = new THREE.MeshStandardMaterial({ map: WT.green, emissive: '#ffffff', emissiveMap: WT.green, emissiveIntensity: 1.2, roughness: 0.3 });
let WSTATE = 'green';
function setWatch(s, glow) { WSTATE = s; const t = WT[s]; if (watchFaceMat.map !== t) { watchFaceMat.map = t; watchFaceMat.emissiveMap = t; watchFaceMat.needsUpdate = true; } watchFaceMat.emissiveIntensity = glow; }
function makeWatch() {
  const g = new THREE.Group(); const metal = mat('#3c096c', 0.25, { metalness: 0.75 }), dark = mat('#14101e', 0.3, { metalness: 0.6 }), chrome = mat('#d6d9e6', 0.15, { metalness: 0.95 });
  const band = M(new THREE.TorusGeometry(0.088, 0.036, 10, 30), dark); band.rotation.x = Math.PI / 2; band.scale.set(1, 1, 1.6); g.add(band);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; const st = M(new THREE.BoxGeometry(0.018, 0.05, 0.018), chrome, [Math.sin(a) * 0.118, 0, Math.cos(a) * 0.118]); g.add(st); }
  const body = M(new THREE.CylinderGeometry(0.085, 0.09, 0.055, 6), metal, [0, 0, 0.1]); body.rotation.x = Math.PI / 2; body.rotation.y = Math.PI / 6; g.add(body);
  const bez = M(new THREE.TorusGeometry(0.074, 0.013, 6, 6), chrome, [0, 0, 0.128]); bez.rotation.z = Math.PI / 6; g.add(bez);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.07, 6, Math.PI / 6), watchFaceMat); disc.position.z = 0.129; g.add(disc);
  for (const sx of [-1, 1]) { const fin = M(new THREE.BoxGeometry(0.035, 0.07, 0.03), metal, [sx * 0.1, 0, 0.09]); fin.rotation.z = sx * 0.3; g.add(fin); g.add(M(new THREE.SphereGeometry(0.012, 8, 6), mat('#5dff7a', 0.2, { emissive: '#5dff7a', emissiveIntensity: 2 }), [sx * 0.115, 0, 0.108])); }
  return g;
}
const watchLight = new THREE.PointLight('#5dff7a', 0, 4, 1.6); scene.add(watchLight);

// ---------- the boy and his alien forms (all original)
function addWatch(k) { const w = makeWatch(); w.position.set(0, -0.36, 0); k.userData.arms[0].add(w); k.userData.watch = w; return k; }
function form(o, sc, extra) { const k = kid(o); if (extra) extra(k); addWatch(k); k.scale.setScalar(sc); k.userData.sc = sc; scene.add(k); return k; }
function onHead(k, geo, m, x, y, z, rx = 0, rz = 0) { const s = M(geo, m, [x, y, z]); s.rotation.set(rx, 0, rz); k.userData.head.add(s); return s; }
const civ = form({ skin: '#f4eef2', top: '#F2B705', top2: '#d99e00', legs: '#1F4E9C', shoes: '#ffffff', hands: '#ffffff' }, 1);
const pedrao = form({ skin: '#4fbf4a', top: '#2d7a2f', top2: '#1e5a22', legs: '#1e4d22', shoes: '#2a2a2a', hands: '#4fbf4a' }, 1.8, (k) => {
  const rm = mat('#2f8f34', 0.95, { flatShading: true }), r = rng(12);
  for (let i = 0; i < 11; i++) { const th = Math.PI * (0.62 + r() * 0.76), ph = 0.15 + r() * 1.2; onHead(k, new THREE.DodecahedronGeometry(0.06 + r() * 0.06), rm, Math.sin(th) * Math.cos(ph) * 0.3, Math.sin(ph) * 0.38, Math.cos(th) * Math.cos(ph) * 0.3, r() * 3, r() * 3); }
  for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) { const s = M(new THREE.DodecahedronGeometry(0.09 + i * 0.02), rm, [sx * (0.2 + i * 0.07), 1.22 - i * 0.05, -0.05]); k.userData.body.add(s); }
  k.userData.body.children[1].scale.set(1.25, 1, 1);
});
const ZUM_O = { skin: '#4cc9f0', top: '#1d3557', top2: '#ffd23f', legs: '#1d3557', shoes: '#ffffff', hands: '#ffffff' };
const zummm = form(ZUM_O, 1, (k) => {
  for (let i = 0; i < 3; i++) onHead(k, new THREE.ConeGeometry(0.07, 0.34, 10), mat('#ffd23f', 0.4), 0, 0.3 - i * 0.12, -0.18 - i * 0.06, -0.9 - i * 0.3);
  const st = M(new THREE.BoxGeometry(0.07, 0.42, 0.02), mat('#ffd23f', 0.4, { emissive: '#ffb703', emissiveIntensity: 0.4 }), [0, 0.95, 0.235]); st.rotation.z = 0.35; k.userData.body.add(st);
});
const fogareu = form({ skin: '#ff5a1f', top: '#9d0208', top2: '#ffba08', legs: '#370617', shoes: '#370617', hands: '#ffba08' }, 1.15, (k) => {
  const fl = []; for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; const c = onHead(k, new THREE.ConeGeometry(0.09, 0.42, 10), mat(i % 2 ? '#ffd23f' : '#ff7b00', 0.3, { emissive: i % 2 ? '#ffd23f' : '#ff5400', emissiveIntensity: 2.2 }), Math.cos(a) * 0.15, 0.4, Math.sin(a) * 0.15 - 0.04, Math.sin(a) * 0.4, -Math.cos(a) * 0.4); c.castShadow = false; fl.push(c); }
  k.userData.flames = fl;
});
const asinha = form({ skin: '#ff8fab', top: '#c9184a', top2: '#ffc8dd', legs: '#590d22', shoes: '#ffffff', hands: '#ffffff' }, 1, (k) => {
  const wm = mat('#ffc8dd', 0.3, { transparent: true, opacity: 0.8, side: THREE.DoubleSide, emissive: '#ff8fab', emissiveIntensity: 0.6 }); const ws = [];
  for (const sx of [-1, 1]) { const p = new THREE.Group(); p.position.set(sx * 0.12, 1.12, -0.24); const w = new THREE.Mesh(new THREE.CircleGeometry(0.55, 28), wm); w.scale.set(1, 0.55, 1); w.position.x = sx * 0.5; w.rotation.z = sx * 0.35; p.add(w); k.userData.body.add(p); ws.push(p); }
  k.userData.wings = ws; for (const sx of [-1, 1]) onHead(k, new THREE.SphereGeometry(0.07, 12, 8), mat('#ffd23f', 0.3, { emissive: '#ffd23f', emissiveIntensity: 0.6 }), sx * 0.12, 0.47, 0);
});
const bracao = form({ skin: '#ff9f43', top: '#e85d04', top2: '#ffba08', legs: '#3a0ca3', shoes: '#3a0ca3', hands: '#ffd23f' }, 1.5, (k) => {
  const a2 = []; for (const sx of [-1, 1]) { const a = limb(0.3, 0.07, '#e85d04'); a.position.set(sx * 0.31, 0.95, 0.04); a.rotation.z = sx * 0.55; a.add(M(new THREE.SphereGeometry(0.085, 14, 10), mat('#ffd23f', 0.45), [0, -0.42, 0])); k.userData.body.add(a); a2.push(a); }
  k.userData.arms2 = a2;
});
const pingo = form({ skin: '#80ed99', top: '#2d6a4f', top2: '#b7e4c7', legs: '#1b4332', shoes: '#ffffff', hands: '#ffffff' }, 0.12, (k) => {
  for (const sx of [-1, 1]) { onHead(k, new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), mat('#1b4332'), sx * 0.1, 0.48, 0, 0, -sx * 0.3); onHead(k, new THREE.SphereGeometry(0.05, 10, 8), mat('#ffd23f', 0.3, { emissive: '#ffd23f', emissiveIntensity: 0.8 }), sx * 0.15, 0.62, 0); }
});
const colosso = form({ skin: '#ffd23f', top: '#c9a227', top2: '#fff3b0', legs: '#a67c00', shoes: '#7a5c00', hands: '#fff3b0' }, 1, (k) => {
  k.traverse((o) => { if (o.isMesh && o.material !== k.userData.faceMat) { o.material = o.material.clone(); o.material.metalness = 0.65; o.material.roughness = 0.28; o.material.emissive = new THREE.Color('#5a3d00'); o.material.emissiveIntensity = 0.5; } });
  for (let i = 0; i < 5; i++) { const a = (i - 2) * 0.32; onHead(k, new THREE.ConeGeometry(0.06, 0.26, 8), mat('#fff3b0', 0.2, { metalness: 0.8, emissive: '#ffd23f', emissiveIntensity: 0.8 }), Math.sin(a) * 0.24, 0.42, Math.cos(a) * 0.05 - 0.05, 0, -a); }
  const core = new THREE.Mesh(new THREE.CircleGeometry(0.1, 28), watchFaceMat); core.position.set(0, 1.0, 0.246); k.userData.body.add(core);
});
const FORMS = [civ, pedrao, zummm, fogareu, asinha, bracao, pingo, colosso];
const zghosts = []; for (let i = 0; i < 5; i++) { const g = kid(ZUM_O); const gm = new THREE.MeshBasicMaterial({ color: i % 2 ? '#4cc9f0' : '#8ff7ff', transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending }); g.traverse((o) => { if (o.isMesh) { o.material = gm; o.castShadow = false; o.receiveShadow = false; } }); g.userData.gm = gm; scene.add(g); zghosts.push(g); }
const PEDS = [['#f1d9cf', '#2b1b1e', 'long', '#2ec4b6'], ['#a86f52', '#1e1414', null, '#3a86ff'], ['#f6e0d4', '#d9542b', 'pony', '#ff5fa2'], ['#7b4a33', '#1b1212', null, '#6a994e'], ['#efd2c2', '#c9c9c9', null, '#8d6e63'], ['#c99273', '#3a2314', 'buns', '#ffbe0b']];
const peds = PEDS.map(([skin, hair, style, top], i) => { const k = kid({ skin, hair, style: style || 'short', top, legs: i % 2 ? '#2b2550' : '#3d405b', shoes: '#1d1d2b', hands: skin }); k.scale.setScalar(1.15); scene.add(k); return k; });

// ---------- the monster (original: purple blob kaiju)
function makeMonster() {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const mats = { body: mat('#7b2cbf', 0.3, { emissive: '#3c096c', emissiveIntensity: 0.4 }), belly: mat('#c77dff', 0.45), dark: mat('#240046', 0.6), eye: mat('#ffffff', 0.2), pupil: mat('#120018', 0.2, { emissive: '#000000' }) };
  const blob = M(new THREE.SphereGeometry(1, 48, 32), mats.body, [0, 9, 0]); blob.scale.set(7, 9, 6); body.add(blob);
  const belly = M(new THREE.SphereGeometry(1, 32, 24), mats.belly, [0, 7, 2.7]); belly.scale.set(4.6, 5.4, 3.6); body.add(belly);
  const r = rng(31); for (let i = 0; i < 9; i++) { const th = (r() - 0.5) * 2.6 + Math.PI, ph = (r() - 0.5) * 1.6; const s = M(new THREE.SphereGeometry(0.6 + r() * 0.8, 16, 12), mats.dark, [Math.sin(th) * Math.cos(ph) * 6.9, 9 + Math.sin(ph) * 8.9, Math.cos(th) * Math.cos(ph) * 5.9]); s.scale.z = 0.4; s.lookAt(0, 9, 0); body.add(s); }
  const pupils = [];
  for (const sx of [-1, 1]) { body.add(M(new THREE.SphereGeometry(1.5, 24, 16), mats.eye, [sx * 2.6, 13.2, 4.6])); const p = M(new THREE.SphereGeometry(0.75, 16, 12), mats.pupil, [sx * 2.6, 13.1, 5.95]); body.add(p); pupils.push(p); const b = M(new THREE.BoxGeometry(2.8, 0.55, 0.7), mats.dark, [sx * 2.6, 15.1, 5.0]); b.rotation.z = sx * 0.35; body.add(b); }
  const mouth = new THREE.Group(); mouth.position.set(0, 10.0, 5.2); body.add(mouth);
  const mo = M(new THREE.SphereGeometry(1, 24, 16), mats.dark); mo.scale.set(3.2, 1, 1.3); mouth.add(mo);
  for (let i = 0; i < 6; i++) { const t = M(new THREE.ConeGeometry(0.3, 0.8, 8), mats.eye, [-2.2 + i * 0.88, 0.75, 0.9]); t.rotation.x = Math.PI; mouth.add(t); }
  for (const sx of [-1, 1]) { const h = M(new THREE.ConeGeometry(0.9, 3.4, 12), mats.dark, [sx * 3.2, 17.6, 0]); h.rotation.z = -sx * 0.5; body.add(h); }
  const arms = []; for (const sx of [-1, 1]) for (const j of [0, 1]) { const p = new THREE.Group(); p.position.set(sx * 6.2, 12 - j * 4, 0.5); const t = M(new THREE.CapsuleGeometry(0.9 - j * 0.15, 7, 6, 12), mats.body, [0, -4.4, 0]); p.add(t); p.add(M(new THREE.SphereGeometry(1.2, 16, 12), mats.belly, [0, -8.6, 0])); body.add(p); p.userData.sx = sx; p.userData.j = j; arms.push(p); }
  const legs = []; for (const sx of [-1, 1]) { const l = M(new THREE.CapsuleGeometry(1.6, 1.6, 6, 14), mats.body, [sx * 3.2, 1.6, 0]); g.add(l); legs.push(l); }
  g.userData = { body, blob, mouth, mo, arms, mats, pupils, legs }; return g;
}
const monster = makeMonster(); scene.add(monster);
const PURPLE = new THREE.Color('#7b2cbf'), REDM = new THREE.Color('#d00000');
function monsterState(f, o = {}) {
  const u = monster.userData; monster.visible = true;
  const gr = o.grow || 0; u.mats.body.color.lerpColors(PURPLE, REDM, gr); u.mats.body.emissive.set(gr > 0 ? '#ff3c00' : '#3c096c'); u.mats.body.emissiveIntensity = gr > 0 ? 0.08 + gr * 0.22 + Math.sin(f * 0.4) * 0.08 * gr : 0.4;
  u.blob.scale.set(7 * (1 + Math.sin(f * 0.15) * 0.02), 9 * (1 - Math.sin(f * 0.15) * 0.02), 6);
  u.mo.scale.y = 1 + (o.mouth || 0) * 2.2; u.mouth.position.y = 10 - (o.mouth || 0) * 0.8;
  u.arms.forEach((p, i) => { const sx = p.userData.sx; p.rotation.set(0.3 * Math.sin(f * 0.07 + i), 0, sx * (0.55 + p.userData.j * 0.35 + Math.sin(f * 0.09 + i * 1.7) * 0.3) + (o.swing && i === o.swing[0] ? o.swing[1] * -sx : 0)); });
  u.pupils.forEach((p, i) => (p.position.x = (i ? 1 : -1) * 2.6 + (o.look || 0) * 0.5));
  u.legs.forEach((l, i) => (l.position.y = 1.6 + (o.stomp && i === 1 ? o.stomp : 0)));
}

// ---------- props: meteor, crater, the watch on the ground, fireballs, debris
const meteor = M(new THREE.SphereGeometry(0.7, 20, 14), mat('#b9ffb0', 0.2, { emissive: '#5dff7a', emissiveIntensity: 4 })); meteor.castShadow = false; scene.add(meteor);
const meteorLight = new THREE.PointLight('#5dff7a', 0, 60, 1.4); scene.add(meteorLight);
function makeCrater(s) { const g = new THREE.Group(); const d = new THREE.Mesh(new THREE.CircleGeometry(2.6, 32), mat('#0d0a12', 1)); d.rotation.x = -Math.PI / 2; d.position.y = 0.015; g.add(d); const rim = M(new THREE.TorusGeometry(2.4, 0.42, 10, 32), mat('#2a2436', 0.95, { flatShading: true })); rim.rotation.x = Math.PI / 2; rim.scale.z = 0.5; g.add(rim); const r = rng(s); for (let i = 0; i < 14; i++) { const a = r() * 7; const c = M(new THREE.DodecahedronGeometry(0.15 + r() * 0.25), mat('#2a2436', 0.95, { flatShading: true }), [Math.cos(a) * (2.9 + r() * 1.2), 0.1, Math.sin(a) * (2.9 + r() * 1.2)]); g.add(c); } const gl = new THREE.Mesh(new THREE.CircleGeometry(1.4, 32), new THREE.MeshBasicMaterial({ color: '#3dff6a', transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })); gl.rotation.x = -Math.PI / 2; gl.position.y = 0.03; g.add(gl); g.userData.gl = gl; scene.add(g); return g; }
const crater = makeCrater(3), bigCrater = makeCrater(9); bigCrater.scale.setScalar(5);
const watchItem = makeWatch(); watchItem.scale.setScalar(2.2); scene.add(watchItem);
const fireballs = []; for (let i = 0; i < 4; i++) { const b = M(new THREE.SphereGeometry(0.45, 16, 12), mat('#fff3b0', 0.2, { emissive: '#ff8c00', emissiveIntensity: 5 })); b.castShadow = false; scene.add(b); fireballs.push(b); }
const DEB_N = 150, debris = new THREE.InstancedMesh(new THREE.BoxGeometry(0.6, 0.45, 0.5), mat('#5a5070', 0.9), DEB_N); debris.frustumCulled = false; debris.castShadow = true; scene.add(debris);
const DEB = []; { const r = rng(71); for (let i = 0; i < DEB_N; i++) DEB.push({ v: [(r() - 0.5) * 2, 0.4 + r(), (r() - 0.5) * 2], s: 0.5 + r() * 1.6, rot: r() * 9 }); }
function setDebris(f, bursts) { // bursts: [{f0, o:[x,y,z], k: speed, dir:[x,y,z]}], 25 pieces each
  debris.visible = true;
  for (let i = 0; i < DEB_N; i++) { const b = bursts[Math.floor(i / 25)]; const d = DEB[i]; if (!b || f < b.f0) { DUMMY.scale.set(0, 0, 0); } else { const t = (f - b.f0) / 30, k = b.k || 12, dir = b.dir || [0, 0, 0]; const vx = (d.v[0] + dir[0]) * k, vy = (d.v[1] + dir[1]) * k, vz = (d.v[2] + dir[2]) * k; DUMMY.position.set(b.o[0] + vx * t, Math.max(0.2, b.o[1] + vy * t - 9.8 * t * t), b.o[2] + vz * t); DUMMY.rotation.set(d.rot + t * 6, d.rot * 2 + t * 4, 0); DUMMY.scale.setScalar(d.s * (b.sz || 1)); } DUMMY.updateMatrix(); debris.setMatrixAt(i, DUMMY.matrix); }
  debris.instanceMatrix.needsUpdate = true;
}

// ---------- posing helpers
function runPose(k, ph, amt, lean = 0) {
  const u = k.userData; u.legs[0].rotation.x = Math.sin(ph) * 1.15 * amt; u.legs[1].rotation.x = -Math.sin(ph) * 1.15 * amt;
  u.arms[0].rotation.set(-Math.sin(ph) * 1.3 * amt, 0, -0.2 - 0.2 * amt); u.arms[1].rotation.set(Math.sin(ph) * 1.3 * amt, 0, 0.2 + 0.2 * amt);
  u.body.rotation.set(lean, 0, 0); u.body.position.y = Math.abs(Math.cos(ph)) * 0.07 * amt; u.head.rotation.set(-lean * 0.6, 0, 0);
}
function standPose(k) { const u = k.userData; for (const l of u.legs) l.rotation.set(0, 0, 0); u.arms[0].rotation.set(0, 0, -0.18); u.arms[1].rotation.set(0, 0, 0.18); u.body.rotation.set(0, 0, 0); u.body.position.y = 0; u.head.rotation.set(0, 0, 0); }
function setFace(k, e, look = 0) { k.userData.faceMat.map = faceTex(e, look); }
function show(k, x, y, z, ry = 0) { k.visible = true; k.position.set(x, y, z); k.rotation.set(0, ry, 0); k.scale.setScalar(k.userData.sc || 1.15); standPose(k); return k; }
function placeK(k, s) { k.visible = true; k.position.set(s.x, s.y || 0, s.z); k.rotation.set(0, s.ry || 0, 0); runPose(k, s.ph || 0, s.amt ?? 1, s.lean ?? 0.4); }
function checkPose(k, t = 1) { k.userData.arms[0].rotation.set(-1.45 * t, 0, 0.35 * t - 0.18 * (1 - t)); }
function slapPose(k, t) { k.userData.arms[1].rotation.set(-1.3 * t, 0, 0.18 - 0.75 * t); }
let HFN = null;
function heroPath(k, fn, f, nGhost = 4, dt = 1.5) { HFN = fn; const s = fn(f); placeK(k, s); for (let i = 0; i < 5; i++) { const g = zghosts[i]; if (i < nGhost) { placeK(g, fn(f - (i + 1) * dt)); g.userData.gm.opacity = 0.32 * (1 - i / nGhost); } else g.visible = false; } return s; }
function wpos(o) { const v = new THREE.Vector3(); o.getWorldPosition(v); return v; }
function hand(k, i = 1) { return wpos(k.userData.arms[i].children[1]); }
function traffic(wt) { cars.forEach((c, i) => { c.visible = true; const up = i % 2 === 0; const len = 290; let z = (-20 - i * 27 + (up ? 1 : -1) * wt * 11); z = ((z + 260) % len + len) % len - 260; c.position.set(up ? -2.5 : 2.5, 0, z); c.rotation.set(0, up ? 0 : Math.PI, 0); c.userData.body.position.y = 0; c.userData.body.rotation.set(0, 0, 0); }); }
const PARK = [[-2.6, -22, 0.2], [2.8, -31, 2.9], [-3.1, -40, -0.5], [2.4, -47, 3.4], [-2.2, -66, 0.9], [3.2, -70, 2.6], [-3.4, -14, 0.1], [2.6, -9, 3.1], [-2.4, -2, 0], [3.0, 6, 3.2]];
function parkCars(shake = 0, f = 0) { cars.forEach((c, i) => { c.visible = true; const [x, z, ry] = PARK[i]; c.position.set(x, 0, z); c.rotation.set(0, ry, 0); c.userData.body.position.y = shake ? Math.abs(Math.sin(f * 0.9 + i * 2)) * 0.25 * shake : 0; c.userData.body.rotation.set(0, 0, shake ? Math.sin(f * 0.7 + i) * 0.05 * shake : 0); }); }

// ---------- post
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.55, 0.55, 0.82); composer.addPass(bloom);
const bokeh = new BokehPass(scene, camera, { focus: 4, aperture: 0.0025, maxblur: 0.009 }); composer.addPass(bokeh);
composer.addPass(new OutputPass());

// ---------- 2D overlay helpers
function P(x, y, z) { const v = new THREE.Vector3(x, y, z).project(camera); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H, v.z]; }
function PV(v) { return P(v.x, v.y, v.z); }
function PW(obj, dy = 0) { const v = wpos(obj); return P(v.x, v.y + dy, v.z); }
function jag(x1, y1, x2, y2, r, disp, depth, pts) { if (depth === 0) { pts.push([x2, y2]); return; } const mx = (x1 + x2) / 2 + (r() - 0.5) * disp, my = (y1 + y2) / 2 + (r() - 0.5) * disp; jag(x1, y1, mx, my, r, disp / 2, depth - 1, pts); jag(mx, my, x2, y2, r, disp / 2, depth - 1, pts); }
function bolt(x1, y1, x2, y2, seed, col, w = 4, branch = true) {
  const r = rng(seed); const d = Math.hypot(x2 - x1, y2 - y1); const pts = [[x1, y1]]; jag(x1, y1, x2, y2, r, d * 0.45, 5, pts);
  O.save(); O.globalCompositeOperation = 'lighter'; O.lineJoin = 'round'; O.lineCap = 'round';
  for (const [lw, a, c] of [[w * 6, 0.12, col], [w * 2.4, 0.55, col], [w * 0.8, 1, '#ffffff']]) { O.strokeStyle = c; O.globalAlpha = a; O.lineWidth = lw; O.beginPath(); pts.forEach(([x, y], i) => (i ? O.lineTo(x, y) : O.moveTo(x, y))); O.stroke(); }
  O.restore();
  if (branch && d > 60) for (let i = 0; i < 2; i++) { const p = pts[2 + Math.floor(r() * (pts.length - 4))]; const a = r() * 7; bolt(p[0], p[1], p[0] + Math.cos(a) * d * 0.3, p[1] + Math.sin(a) * d * 0.3, seed * 7 + i, col, w * 0.55, false); }
}
const GREENS = ['#5dff7a', '#b8ff5a', '#2bff9a'], BLUES = ['#4cc9f0', '#8ff7ff', '#ffffff'], FIRES = ['#ff5400', '#ffba08', '#ff8c00'], GOLDS = ['#ffd23f', '#fff3b0', '#ffb703'], REDS = ['#ff2d3a', '#ff7b7b', '#ff0040'];
function heroBox(k) { const h = PW(k.userData.head, 0.3 * k.scale.x), ft = P(k.position.x, k.position.y, k.position.z); if (h[2] > 1 || ft[2] > 1) return null; const hp = Math.max(30, Math.abs(ft[1] - h[1])); return { cx: (h[0] + ft[0]) / 2, cy: (h[1] + ft[1]) / 2, hp, hx: h[0], hy: h[1] }; }
function glow(x, y, R, rgb, a) { if (a <= 0 || R <= 0) return; O.save(); O.globalCompositeOperation = 'lighter'; const g = O.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); O.fillStyle = g; O.fillRect(x - R, y - R, R * 2, R * 2); O.restore(); }
function aura(k, I, f, rgb = '93,255,122') { const b = heroBox(k); if (b) glow(b.cx, b.cy, b.hp * (0.75 + 0.3 * I + Math.sin(f * 0.7) * 0.05), rgb, 0.3 * Math.min(1, I)); }
function heroBolts(k, I, f, cols = GREENS, seed = 0) {
  const b = heroBox(k); if (!b || I <= 0) return; const r = rng(Math.floor(f / 2) * 131 + seed); const n = Math.round(2 + I * 4);
  for (let i = 0; i < n; i++) { const a = r() * 7, a2 = a + 0.6 + r() * 1.6; const s = b.hp * (0.25 + r() * 0.35); bolt(b.cx + Math.cos(a) * s * 0.6, b.cy + Math.sin(a) * s, b.cx + Math.cos(a2) * s * 0.75, b.cy + Math.sin(a2) * s * 1.1, Math.floor(f / 2) * 17 + i + seed * 3, cols[i % 3], 2 + b.hp / 300); }
}
function trail(f, n = 16, w = 1, cols = ['#4cc9f0', '#8ff7ff', '#2b7fff']) {
  if (!HFN) return; O.save(); O.globalCompositeOperation = 'lighter'; O.lineCap = 'round'; O.lineJoin = 'round';
  [0.95, 1.35, 0.6].forEach((dy, ci) => {
    const pts = []; for (let j = 0; j <= n; j++) { const s = HFN(f - j * 0.7); const p = P(s.x, (s.y || 0) + dy, s.z); if (p[2] > 1) break; pts.push(p); }
    if (pts.length < 2) return; for (const [lw, a] of [[28 * w, 0.15], [10 * w, 0.45], [3 * w, 0.9]]) { O.strokeStyle = lw < 5 ? '#fff' : cols[ci]; O.globalAlpha = a; O.lineWidth = lw; O.beginPath(); pts.forEach(([x, y], i) => (i ? O.lineTo(x + Math.sin(i * 2.3 + f) * 6, y + Math.cos(i * 1.7 + f) * 6) : O.moveTo(x, y))); O.stroke(); }
  });
  O.restore();
}
function speedLines(cx, cy, I, f, col = '255,255,255') { if (I <= 0) return; const r = rng(Math.floor(f) * 7); O.save(); O.globalCompositeOperation = 'lighter'; for (let i = 0; i < 46; i++) { const a = r() * Math.PI * 2, r0 = 380 + r() * 500, len = 150 + r() * 500 * I; O.strokeStyle = `rgba(${col},${(0.1 + r() * 0.25) * I})`; O.lineWidth = 2 + r() * 5; O.beginPath(); O.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); O.lineTo(cx + Math.cos(a) * (r0 + len), cy + Math.sin(a) * (r0 + len)); O.stroke(); } O.restore(); }
function hLines(I, f, dir = 1) { if (I <= 0) return; const r = rng(Math.floor(f) * 3); O.save(); O.globalCompositeOperation = 'lighter'; for (let i = 0; i < 30; i++) { const y = r() * H, x = r() * W, len = 200 + r() * 600; O.strokeStyle = `rgba(200,240,255,${(0.08 + r() * 0.2) * I})`; O.lineWidth = 1 + r() * 4; O.beginPath(); O.moveTo(x, y); O.lineTo(x - dir * len, y); O.stroke(); } O.restore(); }
function ringFx(x, y, t, col = '93,255,122', R0 = 1400, sq = 0.35) { if (t <= 0 || t >= 1) return; O.save(); O.globalCompositeOperation = 'lighter'; const R = 40 + t * R0; O.strokeStyle = `rgba(${col},${(1 - t) * 0.9})`; O.lineWidth = 40 * (1 - t) + 4; O.beginPath(); O.ellipse(x, y, R, R * sq, 0, 0, 7); O.stroke(); O.restore(); }
function tint(c, a) { if (a <= 0) return; O.fillStyle = c.replace('A', Math.min(1, a)); O.fillRect(0, 0, W, H); }
function smoke(x, y, f, n = 6, k = 1, rgb = '200,200,215', a0 = 0.35) { for (let i = 0; i < n; i++) { const t = ((f * 0.03 + i / n) % 1); O.fillStyle = `rgba(${rgb},${a0 * (1 - t)})`; O.beginPath(); O.arc(x + Math.sin(i * 3 + f * 0.05) * 60 * k, y - t * 220 * k, (40 + t * 90) * k, 0, 7); O.fill(); } }
function dust(x, y, t, k = 1) { if (t <= 0 || t >= 1) return; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; const R = (60 + t * 520) * k; O.fillStyle = `rgba(190,180,205,${0.45 * (1 - t)})`; O.beginPath(); O.arc(x + Math.cos(a) * R, y + Math.sin(a) * R * 0.25 - t * 60 * k, (50 + t * 160) * k, 0, 7); O.fill(); } }
function embers(f, I, seed = 1, warm = true) { const r = rng(seed); O.save(); O.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i++) { const x = r() * W, sp = 2 + r() * 6, y = (r() * H - f * sp * 3) % H; O.fillStyle = warm ? (i % 2 ? `rgba(255,190,40,${0.8 * I})` : `rgba(255,60,20,${0.8 * I})`) : (i % 2 ? `rgba(120,255,140,${0.8 * I})` : `rgba(255,230,120,${0.8 * I})`); O.fillRect(x, (y + H) % H, 4 + r() * 4, 4 + r() * 4); } O.restore(); }
function titleLine(txt, y, k, size, fill) { if (k <= 0.01) return; O.save(); O.translate(W / 2, y); O.scale(k, k); O.rotate(-0.04); O.font = `900 ${size}px Inter, Arial Black, Arial`; O.textAlign = 'center'; O.textBaseline = 'middle'; O.lineJoin = 'round'; O.lineWidth = size * 0.2; O.strokeStyle = '#06140a'; O.strokeText(txt, 6, 8); O.strokeText(txt, 0, 0); O.fillStyle = fill; O.fillText(txt, 0, 0); O.restore(); }
function nameTag(txt, k, col) { if (k <= 0.01) return; titleLine(txt, 330, k, 120, col); }
function watchGlow(k, I, f, rgb = '93,255,122', bolts = GREENS) { const w = k.userData.watch; if (!w.visible) return; const p = PW(w); if (p[2] > 1) return; const d = wpos(w).distanceTo(camera.position); const R = Math.min(380, 110 / d * I); glow(p[0], p[1], R, rgb, d < 1.5 ? 0.3 : 0.5); if (bolts && I > 0.6) { const r = rng(Math.floor(f / 2) * 3); for (let i = 0; i < 3; i++) { const a = r() * 7; bolt(p[0], p[1], p[0] + Math.cos(a) * R * 0.9, p[1] + Math.sin(a) * R * 0.9, f * 5 + i, bolts[i], Math.max(1.5, R / 90), false); } } }
function transformFx(k, t, rgb = '93,255,122', cols = GREENS, f = 0) { // t: 0..1 after the swap
  const b = heroBox(k); if (t < 0.25) tint(`rgba(${rgb},A)`, (1 - t * 4) * 0.55);
  if (!b) return; ringFx(b.cx, b.cy + b.hp * 0.5, t, rgb, 1300); ringFx(b.cx, b.cy + b.hp * 0.5, t * 1.4 - 0.15, '255,255,255', 900);
  const ca = (1 - t) * 0.8; O.save(); O.globalCompositeOperation = 'lighter'; const g = O.createLinearGradient(b.cx - b.hp * 0.45, 0, b.cx + b.hp * 0.45, 0); g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(0.5, `rgba(${rgb},${ca})`); g.addColorStop(1, `rgba(${rgb},0)`); O.fillStyle = g; O.fillRect(b.cx - b.hp * 0.45, 0, b.hp * 0.9, H); O.restore();
  for (let i = 0; i < 26; i++) { const ph = i / 26 * Math.PI * 4 + t * 9, y = b.cy + b.hp * 0.6 - (i / 26) * b.hp * 1.5; glow(b.cx + Math.cos(ph) * b.hp * 0.45, y, 22 + b.hp * 0.03, i % 2 ? '255,255,255' : rgb, (1 - t) * 0.9); }
  heroBolts(k, 2 * (1 - t), f, cols, 77);
}

// ---------- "A cidade do silêncio" — the town (a dollhouse town on a giant girl's bedroom floor)
const BASE = scene.children.filter((o) => !o.isLight);
const K = 24; // giant scale
// --- the giant ROOM (floor y=0). The town sits inside a walled dollhouse yard centred at the origin.
const ROOM = new THREE.Group(); scene.add(ROOM);
const RW = 420, RD = 420, RH = 170;
const CEIL = tex(1024, 1024, (g) => { g.fillStyle = '#8fc9ff'; g.fillRect(0, 0, 1024, 1024); const r = rng(11); for (let i = 0; i < 26; i++) { const x = r() * 1024, y = r() * 1024; g.fillStyle = 'rgba(255,255,255,.92)'; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x + k * 26 - 52, y + Math.sin(k * 1.7) * 10, 26 + r() * 16, 0, 7); g.fill(); } } g.fillStyle = '#fff6b0'; for (let i = 0; i < 30; i++) { const x = r() * 1024, y = r() * 1024; g.beginPath(); for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5, rr2 = k % 2 ? 5 : 12; g.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } g.fill(); } });
const ceilMat = new THREE.MeshStandardMaterial({ map: CEIL, emissive: '#ffffff', emissiveMap: CEIL, emissiveIntensity: 0.25, roughness: 0.9 });
const WALLP = tex(512, 512, (g) => { g.fillStyle = '#ffd6e8'; g.fillRect(0, 0, 512, 512); g.fillStyle = '#ffc2dc'; for (let x = 0; x < 512; x += 64) g.fillRect(x, 0, 24, 512); const r = rng(4); for (let i = 0; i < 26; i++) { const x = r() * 512, y = r() * 512; g.fillStyle = ['#ff8fab', '#ffd23f', '#9bf6ff'][i % 3]; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x + Math.cos(k * 1.26) * 10, y + Math.sin(k * 1.26) * 10, 8, 0, 7); g.fill(); } g.fillStyle = '#fff'; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); } });
WALLP.wrapS = WALLP.wrapT = THREE.RepeatWrapping; WALLP.repeat.set(8, 3);
const roomWallM = new THREE.MeshStandardMaterial({ map: WALLP, roughness: 0.9 });
{
  const WOODR = tex(512, 512, (g) => { g.fillStyle = '#c99a6b'; g.fillRect(0, 0, 512, 512); const r = rng(6); for (let y = 0; y < 512; y += 48) { g.fillStyle = 'rgba(90,50,20,.3)'; g.fillRect(0, y, 512, 3); for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(255,230,190,${r() * 0.12})`; g.fillRect(r() * 512, y + r() * 44, 60 + r() * 90, 2); } } });
  WOODR.wrapS = WOODR.wrapT = THREE.RepeatWrapping; WOODR.repeat.set(6, 6);
  const fl = M(new THREE.PlaneGeometry(RW, RD), new THREE.MeshStandardMaterial({ map: WOODR, roughness: 0.7 })); fl.rotation.x = -Math.PI / 2; fl.position.y = -0.02; ROOM.add(fl);
  const ce = M(new THREE.PlaneGeometry(RW, RD), ceilMat); ce.rotation.x = Math.PI / 2; ce.position.y = RH; ROOM.add(ce);
  const wall = (w, p, ry) => { const m = M(new THREE.PlaneGeometry(w, RH), roomWallM); m.position.set(...p); m.rotation.y = ry; ROOM.add(m); };
  wall(RW, [0, RH / 2, -RD / 2], 0); wall(RW, [0, RH / 2, RD / 2], Math.PI); wall(RD, [-RW / 2, RH / 2, 0], Math.PI / 2); wall(RD, [RW / 2, RH / 2, 0], -Math.PI / 2);
}
// wool rug ("river of wool") right next to the dollhouse
const RUG = tex(512, 512, (g) => { g.fillStyle = '#5ec2c8'; g.fillRect(0, 0, 512, 512); for (let y = 0; y < 512; y += 6) { g.strokeStyle = y % 12 ? 'rgba(255,255,255,.18)' : 'rgba(0,60,90,.18)'; g.lineWidth = 3; g.beginPath(); for (let x = 0; x <= 512; x += 16) g.lineTo(x, y + Math.sin(x * 0.05 + y) * 3); g.stroke(); } });
const rug = new THREE.Mesh(new THREE.CircleGeometry(70, 48), new THREE.MeshStandardMaterial({ map: RUG, roughness: 1 })); rug.rotation.x = -Math.PI / 2; rug.position.set(95, 0.05, 30); rug.receiveShadow = true; ROOM.add(rug);
// the dollhouse yard walls around the town (the "great wall"), 22 tall, with painted flowers on top
const TW = 46, WH = 22;
const DH_WALL = tex(512, 256, (g) => { g.fillStyle = '#f7e1c8'; g.fillRect(0, 0, 512, 256); g.fillStyle = '#e9c9a8'; for (let y = 0; y < 256; y += 32) for (let x = (y / 32) % 2 * 32; x < 512; x += 64) g.fillRect(x, y, 60, 28); });
DH_WALL.wrapS = DH_WALL.wrapT = THREE.RepeatWrapping; DH_WALL.repeat.set(6, 2);
const FLOWERTOP = tex(512, 64, (g) => { g.fillStyle = '#fff0f6'; g.fillRect(0, 0, 512, 64); for (let x = 16; x < 512; x += 48) { g.fillStyle = ['#ff8fab', '#c77dff', '#ffd23f'][(x / 48 | 0) % 3]; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x + Math.cos(k * 1.26) * 10, 32 + Math.sin(k * 1.26) * 10, 8, 0, 7); g.fill(); } g.fillStyle = '#fff'; g.beginPath(); g.arc(x, 32, 5, 0, 7); g.fill(); } });
FLOWERTOP.wrapS = THREE.RepeatWrapping; FLOWERTOP.repeat.set(10, 1);
const TOWNWALL = new THREE.Group(); scene.add(TOWNWALL);
{
  const m = new THREE.MeshStandardMaterial({ map: DH_WALL, roughness: 0.85 }), top = new THREE.MeshStandardMaterial({ map: FLOWERTOP, roughness: 0.6 });
  for (const [x, z, ry] of [[0, -TW, 0], [0, TW, 0], [-TW, 0, Math.PI / 2], [TW, 0, Math.PI / 2]]) {
    const w = M(new THREE.BoxGeometry(TW * 2 + 2, WH, 2), [m, m, top, top, m, m]); w.position.set(x, WH / 2, z); w.rotation.y = ry; TOWNWALL.add(w);
  }
}
// --- TOWN: pastel houses, bell tower, street lamps
const TOWN = new THREE.Group(); scene.add(TOWN);
const HOUSES = [];
{
  const cols = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'], roofs = ['#e63946', '#3a86ff', '#8338ec', '#2a9d8f', '#f4a261'];
  const r = rng(21);
  for (let i = 0; i < 26; i++) {
    const a = i / 26 * Math.PI * 2 + r() * 0.15, d = 14 + (i % 3) * 9 + r() * 3; const x = Math.cos(a) * d, z = Math.sin(a) * d; if (Math.abs(x) < 5 && z > 0) continue;
    const h = new THREE.Group(); const w = 4 + r() * 2, hh = 3.4 + r() * 2.5, dd = 4 + r() * 2;
    h.add(box(w, hh, dd, cols[i % 8], [0, hh / 2, 0], 0.8));
    const roof = M(new THREE.ConeGeometry(Math.max(w, dd) * 0.78, 2.6, 4), mat(roofs[i % 5], 0.7), [0, hh + 1.3, 0]); roof.rotation.y = Math.PI / 4; h.add(roof);
    const winM = mat('#fff3c4', 0.4, { emissive: '#ffcf6b', emissiveIntensity: 0 }); h.userData.win = winM;
    for (const sx of [-1, 1]) h.add(box(0.8, 0.9, 0.06, '#fff3c4', [sx * w * 0.25, hh * 0.62, dd / 2 + 0.03])).material = winM;
    h.add(box(0.9, 1.6, 0.06, '#7f4f24', [0, 0.8, dd / 2 + 0.03]));
    h.position.set(x, 0, z); h.rotation.y = -a - Math.PI / 2; TOWN.add(h); HOUSES.push(h);
  }
  const st = M(new THREE.CircleGeometry(TW - 1, 64), mat('#d8cbb8', 0.95)); st.rotation.x = -Math.PI / 2; st.position.y = 0.02; TOWN.add(st);
  const grass = M(new THREE.RingGeometry(9, 12, 48), mat('#9ed8a0', 0.9)); grass.rotation.x = -Math.PI / 2; grass.position.y = 0.03; TOWN.add(grass);
}
const TOWER = new THREE.Group(); TOWER.position.set(-6, 0, -6); TOWN.add(TOWER);
{ TOWER.add(box(3, 12, 3, '#f1e3d3', [0, 6, 0], 0.8)); TOWER.add(box(3.4, 0.4, 3.4, '#c9ada7', [0, 12.2, 0])); for (const [x, z] of [[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]]) TOWER.add(box(0.3, 3, 0.3, '#c9ada7', [x, 13.9, z])); TOWER.add(box(3.4, 0.4, 3.4, '#c9ada7', [0, 15.6, 0])); const r = M(new THREE.ConeGeometry(2.6, 3, 4), mat('#8338ec', 0.7), [0, 17.3, 0]); r.rotation.y = Math.PI / 4; TOWER.add(r);
  const bell = M(new THREE.CylinderGeometry(0.5, 1.1, 1.6, 24, 1, true), mat('#d4a017', 0.25, { metalness: 0.9, side: THREE.DoubleSide }), [0, 13.6, 0]); TOWER.add(bell); TOWER.userData.bell = bell; TOWER.add(M(new THREE.SphereGeometry(0.5, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat('#d4a017', 0.25, { metalness: 0.9 }), [0, 14.4, 0])); }
const LAMPS = []; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + 0.2; const l = new THREE.Group(); l.position.set(Math.cos(a) * 10.5, 0, Math.sin(a) * 10.5); l.add(M(new THREE.CylinderGeometry(0.08, 0.1, 3, 8), mat('#2b2d42'), [0, 1.5, 0])); const b = M(new THREE.SphereGeometry(0.3, 12, 10), mat('#fff3c4', 0.3, { emissive: '#ffcf6b', emissiveIntensity: 0 }), [0, 3.1, 0]); l.add(b); l.userData.b = b; TOWN.add(l); LAMPS.push(l); }
const nightLights = [0, 1, 2].map((i) => { const L = new THREE.PointLight('#ffcf8a', 0, 26, 1.3); L.position.set(Math.cos(i * 2.1) * 9, 4, Math.sin(i * 2.1) * 9); scene.add(L); return L; });
function townNight(on) { for (const h of HOUSES) h.userData.win.emissiveIntensity = on ? 1.4 : 0; for (const l of LAMPS) l.userData.b.material.emissiveIntensity = on ? 2.2 : 0; nightLights.forEach((L) => (L.intensity = on ? 30 : 0)); }
// props: swing (empty), hat on the street, crib, glass, dog, wedding arch, tea set + shelf, window + eye, square night-light clock
const SWING = new THREE.Group(); SWING.position.set(6, 0, 8); TOWN.add(SWING);
{ for (const sx of [-1, 1]) { const p = M(new THREE.CylinderGeometry(0.08, 0.08, 3.4, 8), mat('#e63946'), [sx * 1.2, 1.6, 0]); p.rotation.z = sx * 0.12; SWING.add(p); } SWING.add(box(2.8, 0.15, 0.15, '#e63946', [0, 3.3, 0])); const seat = new THREE.Group(); seat.position.y = 3.25; SWING.add(seat); for (const sx of [-0.35, 0.35]) seat.add(M(new THREE.CylinderGeometry(0.02, 0.02, 2.3, 6), mat('#555'), [sx, -1.15, 0])); seat.add(box(0.9, 0.08, 0.4, '#ffd23f', [0, -2.3, 0])); SWING.userData.seat = seat; }
const HAT = new THREE.Group(); HAT.position.set(2, 0, 5); TOWN.add(HAT); HAT.add(M(new THREE.CylinderGeometry(0.42, 0.42, 0.04, 20), mat('#3a86ff'))); HAT.add(M(new THREE.SphereGeometry(0.28, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat('#3a86ff'), [0, 0.02, 0])); HAT.rotation.z = 0.2;
const CRIB = new THREE.Group(); scene.add(CRIB);
{ CRIB.add(box(1.8, 0.1, 1.1, '#ffffff', [0, 0.7, 0])); for (let i = 0; i < 9; i++) for (const sz of [-0.55, 0.55]) CRIB.add(box(0.05, 0.7, 0.05, '#ffffff', [-0.85 + i * 0.21, 1.05, sz])); CRIB.add(box(1.8, 0.06, 0.06, '#ffffff', [0, 1.4, -0.55])); CRIB.add(box(1.8, 0.06, 0.06, '#ffffff', [0, 1.4, 0.55])); for (const sx of [-0.9, 0.9]) CRIB.add(box(0.08, 1.4, 1.1, '#ffffff', [sx, 0.7, 0])); CRIB.add(box(1.6, 0.12, 1.0, '#ffc6ff', [0, 0.8, 0])); }
const CUP = new THREE.Group(); scene.add(CUP); { CUP.add(M(new THREE.CylinderGeometry(0.16, 0.12, 0.38, 20, 1, true), new THREE.MeshPhysicalMaterial({ color: '#cfefff', roughness: 0.05, transmission: 0.6, transparent: true, opacity: 0.6, side: THREE.DoubleSide }))); CUP.add(M(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 20), mat('#cfefff', 0.1), [0, -0.19, 0])); }
const SHARDS = []; for (let i = 0; i < 14; i++) { const s = M(new THREE.TetrahedronGeometry(0.06 + (i % 3) * 0.03), new THREE.MeshStandardMaterial({ color: '#dff6ff', roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.85 })); scene.add(s); SHARDS.push(s); }
const DOG = new THREE.Group(); scene.add(DOG);
{ const dm = mat('#d4a373', 0.7); const b = M(new THREE.CapsuleGeometry(0.32, 0.6, 6, 14), dm, [0, 0.62, 0]); b.rotation.x = Math.PI / 2; DOG.add(b); const h = M(new THREE.SphereGeometry(0.3, 18, 14), dm, [0, 0.95, 0.5]); DOG.add(h); DOG.add(M(new THREE.SphereGeometry(0.14, 12, 10), mat('#f1d9b5'), [0, 0.88, 0.76])); DOG.add(M(new THREE.SphereGeometry(0.05, 8, 6), mat('#1c1222'), [0, 0.92, 0.88])); for (const sx of [-1, 1]) { DOG.add(M(new THREE.SphereGeometry(0.045, 8, 6), mat('#1c1222'), [sx * 0.11, 1.02, 0.74])); const e = M(new THREE.CapsuleGeometry(0.08, 0.2, 4, 8), mat('#a47148'), [sx * 0.22, 1.05, 0.45]); e.rotation.z = sx * 0.6; DOG.add(e); } for (const [x, z] of [[-0.18, 0.3], [0.18, 0.3], [-0.18, -0.3], [0.18, -0.3]]) DOG.add(M(new THREE.CapsuleGeometry(0.07, 0.3, 4, 8), dm, [x, 0.22, z])); const tail = new THREE.Group(); tail.position.set(0, 0.75, -0.5); DOG.add(tail); const tl = M(new THREE.CapsuleGeometry(0.05, 0.35, 4, 8), dm, [0, 0.18, -0.05]); tl.rotation.x = -0.6; tail.add(tl); DOG.userData.tail = tail; }
const ARCH = new THREE.Group(); scene.add(ARCH);
{ const a = M(new THREE.TorusGeometry(1.8, 0.12, 10, 32, Math.PI), mat('#ffffff', 0.5)); a.position.y = 1.8; ARCH.add(a); for (const sx of [-1, 1]) ARCH.add(M(new THREE.CylinderGeometry(0.12, 0.12, 1.8, 10), mat('#ffffff'), [sx * 1.8, 0.9, 0])); for (let i = 0; i < 14; i++) { const t = i / 13 * Math.PI; ARCH.add(M(new THREE.SphereGeometry(0.2, 10, 8), mat(['#ff8fab', '#ffffff', '#ffd23f'][i % 3], 0.6), [Math.cos(t) * 1.8, 1.8 + Math.sin(t) * 1.8, 0.05])); } }
// the GIANT HAND (built at unit scale, scaled by K)
function makeHand() {
  const h = new THREE.Group(), sk = mat('#f1d9cf', 0.45);
  const palm = M(new THREE.SphereGeometry(0.5, 32, 24), sk); palm.scale.set(1, 1.15, 0.45); h.add(palm);
  const fingers = []; [[-0.36, 0.42, 0.62], [-0.13, 0.5, 0.75], [0.11, 0.5, 0.72], [0.33, 0.43, 0.6]].forEach(([x, y, l]) => { const g = new THREE.Group(); g.position.set(x, y, 0); const f = M(new THREE.CapsuleGeometry(0.1, l * 0.75, 8, 14), sk, [0, l * 0.45, 0]); g.add(f); h.add(g); fingers.push(g); });
  const th = new THREE.Group(); th.position.set(-0.45, -0.05, 0.08); th.rotation.z = 0.9; const tf = M(new THREE.CapsuleGeometry(0.12, 0.45, 8, 14), sk, [0, 0.3, 0]); th.add(tf); h.add(th);
  const wr = M(new THREE.CylinderGeometry(0.33, 0.4, 1.2, 24), mat('#ff8fab', 0.6), [0, -0.95, 0]); h.add(wr);
  h.userData = { fingers, th }; return h;
}
const HAND = makeHand(); HAND.scale.setScalar(K * 0.55); scene.add(HAND);
function curl(hd, c) { hd.userData.fingers.forEach((g) => (g.rotation.x = c * 1.3)); hd.userData.th.rotation.x = c * 0.6; }
// the GIANT GIRL + her bed, shelf with tea set, window with THE EYE, night-light "square moon"
const GIRL = kid({ skin: '#f1d9cf', hair: '#6b3a1e', style: 'long', bow: '#ff5fa2', top: '#ffb3c6', top2: '#ffffff', legs: '#ffb3c6', shoes: '#ffffff', hands: '#f1d9cf' }); GIRL.userData.sc = K; scene.add(GIRL);
const BEDG = new THREE.Group(); BEDG.position.set(-120, 0, -120); scene.add(BEDG);
{ BEDG.add(box(70, 16, 130, '#ffffff', [0, 8, 0], 0.6)); BEDG.add(box(74, 46, 6, '#c77dff', [0, 23, -66], 0.7)); BEDG.add(box(64, 10, 30, '#ffe0ef', [0, 21, -46], 0.9)); const bl = box(72, 6, 90, '#ffafcc', [0, 19, 18], 0.9); BEDG.add(bl); BEDG.userData.blanket = bl; }
const SHELF = new THREE.Group(); SHELF.position.set(140, 70, -205); scene.add(SHELF);
{ SHELF.add(box(110, 3, 26, '#a47148', [0, 0, 0], 0.7)); for (let i = 0; i < 3; i++) { const c = new THREE.Group(); c.position.set(-18 + i * 14, 1.5, 2); c.add(M(new THREE.CylinderGeometry(2.2, 1.6, 3.2, 20), mat('#ffffff', 0.25), [0, 1.6, 0])); c.add(M(new THREE.TorusGeometry(1.1, 0.35, 8, 16), mat('#ffffff', 0.25), [2.5, 1.8, 0])); c.add(M(new THREE.CylinderGeometry(3.4, 3.4, 0.4, 24), mat('#ffc6ff', 0.3), [0, 0.2, 0])); SHELF.add(c); } const pot = M(new THREE.SphereGeometry(4, 24, 16), mat('#ffffff', 0.25), [25, 5, 0]); SHELF.add(pot); { const sp = M(new THREE.CylinderGeometry(0.6, 1.2, 5, 10), mat('#ffffff', 0.25), [30, 6, 0]); sp.rotation.z = -0.9; SHELF.add(sp); }
  // a toy horse
  const hz = new THREE.Group(); hz.position.set(-42, 1.5, 0); hz.add(box(14, 6, 5, '#ffd23f', [0, 9, 0])); hz.add(box(5, 8, 4, '#ffd23f', [7, 14, 0])); for (const [x, z] of [[-5, -1.5], [5, -1.5], [-5, 1.5], [5, 1.5]]) hz.add(box(1.6, 7, 1.6, '#ffd23f', [x, 3.5, z])); hz.add(box(2, 6, 1, '#e63946', [5, 15, 0])); SHELF.add(hz); }
const NLIGHT = new THREE.Group(); NLIGHT.position.set(-40, 60, -209); scene.add(NLIGHT);
const CLK = tex(256, 256, (g) => { g.fillStyle = '#fff6c4'; g.fillRect(0, 0, 256, 256); g.strokeStyle = '#ffd23f'; g.lineWidth = 16; g.strokeRect(8, 8, 240, 240); g.fillStyle = '#c9a227'; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.beginPath(); g.arc(128 + Math.sin(a) * 90, 128 - Math.cos(a) * 90, 7, 0, 7); g.fill(); } });
{ const f = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), new THREE.MeshStandardMaterial({ map: CLK, emissive: '#fff1b0', emissiveMap: CLK, emissiveIntensity: 0.6 })); NLIGHT.add(f); const hh = M(new THREE.BoxGeometry(1, 8, 0.4), mat('#5c3a21'), [0, 0, 0.5]); hh.geometry.translate(0, 4, 0); NLIGHT.add(hh); const mm = M(new THREE.BoxGeometry(0.7, 11, 0.4), mat('#5c3a21'), [0, 0, 0.7]); mm.geometry.translate(0, 5.5, 0); NLIGHT.add(mm); NLIGHT.userData = { hh, mm }; }
const moonLamp = new THREE.PointLight('#fff1b0', 0, 220, 1.0); moonLamp.position.set(-40, 100, -90); scene.add(moonLamp);
const WIN = new THREE.Group(); WIN.position.set(209, 85, 40); WIN.rotation.y = -Math.PI / 2; scene.add(WIN);
{ WIN.add(box(70, 80, 2, '#ffffff', [0, 0, -1])); const glassC = M(new THREE.PlaneGeometry(64, 74), new THREE.MeshBasicMaterial({ color: '#0d0b26' })); glassC.position.z = 0.2; WIN.add(glassC); WIN.add(box(3, 74, 1, '#ffffff', [0, 0, 0.5])); WIN.add(box(64, 3, 1, '#ffffff', [0, 0, 0.5])); }
const EYE = new THREE.Group(); scene.add(EYE);
{ const IR = tex(512, 512, (g) => { g.fillStyle = '#f7f3ee'; g.fillRect(0, 0, 512, 512); const gr = g.createRadialGradient(256, 256, 30, 256, 256, 150); gr.addColorStop(0, '#0a0a0a'); gr.addColorStop(0.28, '#0a0a0a'); gr.addColorStop(0.3, '#3a7d44'); gr.addColorStop(0.8, '#b7a33a'); gr.addColorStop(1, '#2b3a20'); g.fillStyle = gr; g.beginPath(); g.arc(256, 256, 150, 0, 7); g.fill(); for (let i = 0; i < 80; i++) { const a = i / 80 * Math.PI * 2; g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(256 + Math.cos(a) * 50, 256 + Math.sin(a) * 50); g.lineTo(256 + Math.cos(a) * 148, 256 + Math.sin(a) * 148); g.stroke(); } g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.arc(210, 200, 22, 0, 7); g.fill(); });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(60, 48, 32), new THREE.MeshStandardMaterial({ map: IR, roughness: 0.2, emissive: '#ffffff', emissiveMap: IR, emissiveIntensity: 0.25 })); ball.rotation.y = -Math.PI / 2; EYE.add(ball); EYE.userData.ball = ball;
  const lid = new THREE.Mesh(new THREE.SphereGeometry(62, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.42), mat('#c48b6b', 0.6)); lid.rotation.z = 0; EYE.add(lid); EYE.userData.lid = lid; }
EYE.position.set(300, 85, 40);
const DOLL = kid({ skin: '#ffe0d0', hair: '#ffd23f', style: 'pony', top: '#9bf6ff', legs: '#3a86ff', shoes: '#fff', hands: '#ffe0d0' }); scene.add(DOLL);
// cast
const ME = civ; // the narrator (night watchman)
const NINA = kid({ skin: '#c68642', hair: '#2b1d14', style: 'buns', top: '#ff8fab', top2: '#ffd23f', legs: '#6a4c93', shoes: '#ffffff', hands: '#c68642' }); NINA.userData.sc = 1.0; scene.add(NINA);
const LOST = kid({ skin: '#f1c27d', hair: '#3b2416', style: 'short', top: '#3a86ff', legs: '#264653', shoes: '#fff', hands: '#f1c27d' }); LOST.userData.sc = 1.05; scene.add(LOST);
const FOLK_O = [['#ffdbac', '#7f4f24', 'short', '#2a9d8f', 1.3], ['#8d5524', '#1b1b1b', 'bob', '#e76f51', 1.3], ['#e0ac69', '#3b2416', 'long', '#8338ec', 1.3], ['#f1c27d', '#9a9aa6', 'short', '#6c757d', 1.35], ['#c68642', '#000', 'pony', '#ffbe0b', 1.25], ['#ffdbac', '#d4a373', 'buns', '#ff006e', 1.25], ['#8d5524', '#2b1d14', 'short', '#06d6a0', 1.3]];
const FOLK = FOLK_O.map(([skin, hair, style, top, sc]) => { const k = kid({ skin, hair, style, top, legs: '#2b2d42', shoes: '#fff', hands: skin }); k.userData.sc = sc; scene.add(k); return k; });
const BABY = kid({ skin: '#ffdbac', hair: '#d4a373', style: 'short', top: '#ffffff', legs: '#ffffff', shoes: '#ffffff', hands: '#ffdbac' }); BABY.userData.sc = 0.38; scene.add(BABY);
const veil = M(new THREE.ConeGeometry(0.5, 1.4, 20, 1, true), new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.75, side: THREE.DoubleSide }), [0, -0.2, -0.15]); FOLK[2].userData.head.add(veil); veil.visible = false;
const ROPE = M(new THREE.CylinderGeometry(0.05, 0.05, WH, 8), mat('#c9a66b', 0.8)); scene.add(ROPE);
function shhPose(k, t = 1) { k.userData.arms[1].rotation.set(-2.3 * t, 0, -0.55 * t); }

// ---------- shots (t in seconds, 24 fps)
camera.far = 1200; camera.updateProjectionMatrix();
const C = (p, l, d) => ({ p, l, d });
const popT = (t, a, d = 0.3) => backOut(clamp((t - a) / d));
// the eye in the window: a flat disc (iris texture) + lids, fitted inside the window frame
const EYE2 = new THREE.Group(); EYE2.position.z = 0.5; WIN.add(EYE2);
{ const disc = new THREE.Mesh(new THREE.CircleGeometry(30, 48), EYE.userData.ball.material); EYE2.add(disc); EYE2.userData.disc = disc; const lm = new THREE.MeshBasicMaterial({ color: '#2a1a24' }); const up = new THREE.Mesh(new THREE.PlaneGeometry(64, 40), lm), dn = new THREE.Mesh(new THREE.PlaneGeometry(64, 40), lm); up.position.z = dn.position.z = 0.3; EYE2.add(up, dn); EYE2.userData.up = up; EYE2.userData.dn = dn; }
EYE.visible = false;
function eyeOpen(o) { EYE2.userData.up.position.y = 20 + 18 * o; EYE2.userData.dn.position.y = -20 - 18 * o; }
function reset() {
  for (const o of BASE) o.visible = false;
  for (const o of [CRIB, CUP, DOG, ARCH, HAND, GIRL, DOLL, ME, NINA, LOST, BABY, ROPE, EYE, ...SHARDS, ...FOLK]) o.visible = false;
  for (const o of [ROOM, TOWNWALL, TOWN, BEDG, SHELF, NLIGHT, WIN]) o.visible = true;
  veil.visible = false; ME.userData.watch.visible = false; EYE2.visible = false; HAT.visible = true;
  for (const k of [ME, NINA, LOST, GIRL, DOLL, BABY, ...FOLK]) { k.userData.body.rotation.set(0, 0, 0); k.userData.body.position.set(0, 0, 0); k.userData.head.rotation.set(0, 0, 0); k.rotation.set(0, 0, 0); }
  heroLight.intensity = 0; portalLight.intensity = 0; fill.intensity = 0; moonLamp.intensity = 0; townNight(false); scene.fog.near = 1000; scene.fog.far = 2000;
  ceilMat.emissive.set('#ffffff'); ceilMat.emissiveIntensity = 0.25; renderer.toneMappingExposure = 1.15; curl(HAND, 0); HAND.rotation.set(0, 0, 0);
}
function day() { scene.background = new THREE.Color('#ffe8f0'); hemi.color.set('#fff6ea'); hemi.groundColor.set('#c99a6b'); hemi.intensity = 1.2; key.intensity = 1.6; key.color.set('#fff1dc'); fill.intensity = 0; }
function night() { scene.background = new THREE.Color('#0b0b20'); hemi.color.set('#6b74c9'); hemi.groundColor.set('#1a1033'); hemi.intensity = 0.32; key.intensity = 0.25; key.color.set('#9fb4ff'); townNight(true); moonLamp.intensity = 200; ceilMat.emissiveIntensity = 0.05; }
function pink(k) { hemi.color.lerpColors(new THREE.Color('#fff6ea'), new THREE.Color('#ff9ecb'), k); ceilMat.emissive.lerpColors(new THREE.Color('#ffffff'), new THREE.Color('#ff7eb6'), k); ceilMat.emissiveIntensity = 0.25 + 0.4 * k; }
function stand(k, x, z, ry, e = 'happy', look = 0) { show(k, x, 0, z, ry); setFace(k, e, look); return k; }
function headC(k, dx, dy, dz) { const h = wpos(k.userData.head); return [[h.x + dx, h.y + dy, h.z + dz], [h.x, h.y - 0.05, h.z]]; }
function walk(k, x, z, ry, t, amt = 0.35) { placeK(k, { x, z, ry, ph: t * 7, amt, lean: 0.05 }); }
function notes(t, x, y, n = 4) { for (let i = 0; i < n; i++) { const u = ((t * 0.5 + i / n) % 1); O.globalAlpha = Math.sin(u * Math.PI); O.fillStyle = '#ffd23f'; O.font = '900 90px Arial'; O.fillText(i % 2 ? '♪' : '♫', x + Math.sin(i * 2 + t) * 120, y - u * 360); O.globalAlpha = 1; } }
const lostPos = [2.5, 0, 6];

const SH = [
  // 1 — hook: the narrator, finger on his lips, lamplight on his face
  { a: 0, b: 2.4, run(t) { night(); stand(ME, 0, 12, 0, 'stern'); shhPose(ME); const [p, l] = headC(ME, 0.05, 0.02, 1.35 - t * 0.1); return { cam: C(p, l, 1.3), ap: 0.012, fx: () => { glow(W / 2, H * 0.6, 600, '255,207,107', 0.18); titleLine('A CIDADE DO SILÊNCIO', 300, popT(t, 0.1), 86, '#ffffff'); } }; } },
  // 2 — the town at night from above
  { a: 2.4, b: 4.6, run(t) { night(); const k = prog(t, 2.4, 4.6); return { cam: C([Math.sin(k * 0.4) * 10, 34 - k * 4, 58 - k * 6], [0, 2, 0], 50), ap: 0.0006 }; } },
  // 3 — empty street: a hat on the ground, a swing moving by itself
  { a: 4.6, b: 7.05, run(t) { night(); SWING.userData.seat.rotation.x = Math.sin(t * 2.2) * 0.35; HAT.position.set(4.5, 0, 9.5); return { cam: C([2.2, 1.4, 12.5], [6, 1.4, 8], 5), ap: 0.003 }; } },
  // 4 — the night watchman on top of the bell tower
  { a: 7.05, b: 9.6, run(t) { night(); show(ME, 0, 0, 3, Math.PI + 0.3); setFace(ME, 'stern', 0.5); ME.userData.arms[1].rotation.set(-0.9, 0, 0.2); const a = prog(t, 7.05, 9.6); return { cam: C([-1.0 + a * 0.4, 1.9, 0.6], [0, 1.75, 3], 2.6), ap: 0.006, fx: () => { const p = PV(hand(ME, 1)); glow(p[0], p[1], 160, '255,207,107', 0.5); } }; } },
  // 5 — tiptoeing through the street
  { a: 9.6, b: 12.21, run(t) { night(); const z = lerp(4, 9, prog(t, 9.6, 12.21)); walk(ME, -1, z, 0, t, 0.25); setFace(ME, 'stern'); ME.userData.watch.visible = false; return { cam: C([1.6, 0.5, z + 3.2], [-1, 0.9, z], 3.4), ap: 0.004 }; } },
  // 6 — a baby in a crib; mum: shhh
  { a: 12.21, b: 16.44, run(t) { night(); CRIB.visible = true; CRIB.position.set(-3, 0, 3); show(BABY, -3, 0.86, 3, 0); BABY.rotation.x = -Math.PI / 2; BABY.position.y = 0.95; setFace(BABY, 'happyc'); const m = stand(FOLK[5], -3, 4.4, Math.PI, 'happy'); m.userData.body.rotation.x = 0.35; shhPose(m); const k = prog(t, 12.21, 16.44); return { cam: C([-3 - 1.0 + k * 0.4, 2.5, 0.6 + k * 0.3], [-3, 1.5, 3.6], 3.2), ap: 0.004, fx: () => { if (t > 13.6) titleLine('SHHH...', 360, popT(t, 13.6), 110, '#ffffff'); } }; } },
  // 7 — feet: everyone walks in socks
  { a: 16.44, b: 18.8, run(t) { night(); const z = lerp(3, 6, prog(t, 16.44, 18.8)); walk(ME, 0, z, 0, t, 0.6); return { cam: C([0.9, 0.25, z + 1.1], [0, 0.15, z], 1.3), ap: 0.01 }; } },
  // 8 — the bell has no clapper
  { a: 18.8, b: 20.9, run(t) { night(); TOWER.userData.bell.rotation.z = Math.sin(t * 2.5) * 0.3; heroLight.position.set(-3.5, 14, -3); heroLight.color.set('#ffcf8a'); heroLight.intensity = 25; heroLight.distance = 12; return { cam: C([-1.5, 1.4, -0.5], [-6, 13.6, -6], 13), ap: 0.001 }; } },
  // 9 — the dog wags its tail... silently
  { a: 20.9, b: 23.4, run(t) { night(); DOG.visible = true; DOG.position.set(3, 0, 7); DOG.rotation.y = -0.4; DOG.userData.tail.rotation.y = Math.sin(t * 18) * 0.7; return { cam: C([4.6, 1.0, 9.4], [3, 0.8, 7], 2.8), ap: 0.006 }; } },
  // 10 — the wedding: they say "yes" by blinking
  { a: 23.4, b: 26.83, run(t) { night(); ARCH.visible = true; ARCH.position.set(0, 0, -2); const bl = Math.floor(t * 3) % 2; const b = stand(FOLK[2], -0.6, -1.6, 0.25, bl ? 'happyc' : 'happy'); veil.visible = true; const g = stand(FOLK[0], 0.6, -1.6, -0.25, bl ? 'happy' : 'happyc'); FOLK.slice(3).forEach((k, i) => stand(k, -3 + i * 2, 3.8 + (i % 2) * 0.6, Math.PI, 'happy'));
    const k = prog(t, 23.4, 26.83); return { cam: C([0.4, 2.1, 1.4 - k * 0.4], [0, 2.0, -1.6], 3.0), ap: 0.004, fx: () => { for (let i = 0; i < 26; i++) { const r = rng(i); const u = ((t * 0.2 + r()) % 1); O.fillStyle = ['#ff8fab', '#ffd23f', '#ffffff'][i % 3]; O.globalAlpha = 0.8; O.fillRect(r() * W, u * H, 14, 20); O.globalAlpha = 1; } } }; } },
  // 11 — the great wall around the town
  { a: 26.83, b: 30.5, run(t) { day(); const k = prog(t, 26.83, 30.5); stand(ME, 0, -36, Math.PI, 'worry', 0); ME.userData.head.rotation.x = -0.5; return { cam: C([2.5, 1.4 + k * 3, -30], [0, lerp(1.6, 22, ss(k)), lerp(-36, -45, k)], 8), ap: 0.001 }; } },
  // 12 — the sky turns pink
  { a: 30.5, b: 34.25, run(t) { day(); pink(ss(prog(t, 31, 33.5))); stand(ME, 0, 6, Math.PI, 'surprised'); ME.userData.head.rotation.x = -0.7; return { cam: C([0.6, 0.9, 8.2], [0, 40, -40], 30), ap: 0.0008, fx: () => tint('rgba(255,120,190,A)', 0.12 * ss(prog(t, 31, 33.5))) }; } },
  // 13 — Nina, the loudest girl in town, always humming
  { a: 34.25, b: 38.0, run(t) { day(); stand(NINA, 1, 8, 0.2, 'happyc'); NINA.userData.head.rotation.z = Math.sin(t * 3) * 0.12; const [p, l] = headC(NINA, 0.4, 0, 1.6); return { cam: C(p, l, 1.6), ap: 0.01, fx: () => notes(t, W / 2 + 120, 800) }; } },
  // 14 — every night he covers her mouth while she sleeps
  { a: 38.0, b: 42.77, run(t) { night(); show(NINA, 0, 0.35, 10, 0); NINA.rotation.x = -Math.PI / 2; setFace(NINA, 'happyc'); show(ME, -0.8, 0, 10.6, Math.PI / 2 + 0.2); ME.userData.body.position.y = -0.4; for (const lg of ME.userData.legs) lg.rotation.x = -1.4; setFace(ME, 'worry', 0.6); ME.userData.arms[1].rotation.set(-1.6, 0, -0.1);
    const k = prog(t, 38, 42.77); return { cam: C([lerp(1.4, -0.6, k), 2.3 - k * 0.5, 12.6 - k * 0.6], [-0.2, 0.5, 10.4], 2.6), ap: 0.004, fx: () => notes(t, W / 2, 900, 2) }; } },
  // 15 — a boy drops a glass (slow motion) — CRASH
  { a: 42.77, b: 45.94, run(t) { day(); stand(LOST, ...[lostPos[0], lostPos[2]], 0.4, t < 44.4 ? 'happy' : 'shock'); const k = prog(t, 43.1, 44.4); const h = hand(LOST, 1); CUP.visible = t < 44.4; CUP.position.set(h.x + 0.3, lerp(h.y, 0.2, k * k), h.z + 0.25); CUP.rotation.z = k * 2;
    if (t >= 44.4) SHARDS.forEach((s, i) => { const r = rng(i + 5), u = prog(t, 44.4, 45.0); s.visible = true; s.position.set(h.x + 0.3 + (r() - 0.5) * 1.6 * u, 0.05 + Math.sin(u * Math.PI) * 0.4 * r(), h.z + 0.25 + (r() - 0.5) * 1.6 * u); s.rotation.set(t * 3 + i, i, 0); });
    return { cam: C([lostPos[0] + 2.2, 1.2, lostPos[2] + 3.4], [lostPos[0] + 0.2, 1.0, lostPos[2] + 0.2], 3.8), ap: 0.008, shake: t > 44.4 && t < 44.7 ? 1.4 : 0, fx: () => { if (t > 44.4 && t < 44.55) tint('rgba(255,255,255,A)', 0.6); } }; } },
  // 16 — the sky opens: a giant hand comes down
  { a: 45.94, b: 48.6, run(t) { day(); stand(LOST, lostPos[0], lostPos[2], 0.4, 'shock'); LOST.userData.head.rotation.x = -0.6; const k = prog(t, 45.94, 48.6); HAND.visible = true; HAND.position.set(lostPos[0], lerp(150, 70, ss(k)), lostPos[2]); HAND.rotation.set(Math.PI, 0, 0.2);
    return { cam: C([lostPos[0] - 2, 1.0, lostPos[2] + 4], [lostPos[0], 40, lostPos[2] - 10], 30), ap: 0.0008, fx: () => { const p = P(lostPos[0], 120, lostPos[2]); glow(p[0], p[1], 700, '255,250,220', 0.3); } }; } },
  // 17 — it picks the boy up, gently... and he's gone
  { a: 48.6, b: 51.85, run(t) { day(); const d = ss(prog(t, 48.6, 49.8)), up = ss(prog(t, 50.3, 51.7)); HAND.visible = true; HAND.rotation.set(Math.PI, 0, 0.2); HAND.position.set(lostPos[0], lerp(70, 9, d) + up * 120, lostPos[2]); curl(HAND, prog(t, 49.7, 50.2) * 0.7);
    stand(LOST, lostPos[0], lostPos[2], 0.4, 'shock'); LOST.position.y = up * 120; LOST.visible = up < 0.5; HAT.visible = true;
    return { cam: C([-8, 16, -10], [lostPos[0], 5 + up * 14, lostPos[2]], 22), ap: 0.0008 }; } },
  // 18 — the adults whisper: the sky is angry
  { a: 51.85, b: 54.0, run(t) { day(); FOLK.slice(0, 5).forEach((k, i) => { stand(k, -2 + i * 1.0, 3 + (i % 2) * 0.8, Math.PI + (i - 2) * 0.2, 'worry'); k.userData.head.rotation.x = -0.4; }); return { cam: C([0, 2.0, -1.2], [0, 2.0, 3.4], 4.6), ap: 0.003 }; } },
  // 19 — Nina looks up
  { a: 54.0, b: 56.29, run(t) { day(); stand(NINA, 1, 8, 0, 'stern'); NINA.userData.head.rotation.x = -0.45; const k = prog(t, 54, 56.29); const [p, l] = headC(NINA, -0.5 + k * 0.6, -0.25, 1.9 - k * 0.5); return { cam: C(p, l, 1.7), ap: 0.01 }; } },
  // 20 — "if it was angry, why did it pick him up so gently?"
  { a: 56.29, b: 60.01, run(t) { day(); stand(NINA, 1, 8, 0.3, 'worry'); const [p, l] = headC(NINA, 0.35, 0.02, 1.35 - prog(t, 56.3, 60) * 0.2); return { cam: C(p, l, 1.3), ap: 0.012 }; } },
  // 21 — that night, he climbs the wall
  { a: 60.01, b: 62.19, run(t) { night(); const y = lerp(2, 12, prog(t, 60.01, 62.19)); ROPE.visible = true; ROPE.position.set(0, WH / 2, -44.6); show(ME, 0, y, -44.2, Math.PI); setFace(ME, 'stern'); const ph = Math.sin(t * 8); ME.userData.arms[0].rotation.set(-2.6 + ph * 0.3, 0, 0.1); ME.userData.arms[1].rotation.set(-2.6 - ph * 0.3, 0, -0.1); ME.userData.legs[0].rotation.x = -0.6 + ph * 0.4; ME.userData.legs[1].rotation.x = -0.6 - ph * 0.4;
    heroLight.position.set(1.5, y + 2, -41); heroLight.color.set('#ffcf8a'); heroLight.intensity = 20; heroLight.distance = 10; return { cam: C([2, y + 0.5, -39.5], [0, y + 1.2, -44], 5), ap: 0.002 }; } },
  // 22 — on top: smooth stones with painted flowers
  { a: 62.19, b: 65.0, run(t) { night(); show(ME, 0, WH, -46, Math.PI); setFace(ME, 'surprised', 0); ME.userData.head.rotation.x = 0.4; heroLight.position.set(1.5, WH + 2.5, -43); heroLight.color.set('#ffcf8a'); heroLight.intensity = 14; heroLight.distance = 8; return { cam: C([2.4, WH + 1.8, -42.2], [0, WH + 0.9, -46.4], 4.6), ap: 0.004 }; } },
  // 23 — a river of wool
  { a: 65.0, b: 67.6, run(t) { night(); const k = prog(t, 65, 67.6); return { cam: C([46 + k * 6, WH + 3, 30], [95, 0, 30], 50), ap: 0.0008 }; } },
  // 24 — a square moon that goes tick-tock
  { a: 67.6, b: 70.87, run(t) { night(); NLIGHT.userData.mm.rotation.z = -Math.floor(t * 2) * 0.1; NLIGHT.userData.hh.rotation.z = -2.1; show(ME, 0, WH, -46, Math.PI); setFace(ME, 'surprised'); ME.userData.head.rotation.x = -0.3; const k = prog(t, 67.6, 70.87); return { cam: C([1.5 - k * 3, WH + 1.5 + k * 1.5, -43.5], [-40 + k * 20, 60 - k * 6, -209], 160), ap: 0.0005, bloom: 0.35 }; } },
  // 25 — on the other side: a giant room
  { a: 70.87, b: 75.0, run(t) { night(); show(ME, 0, WH, -46, Math.PI); setFace(ME, 'shock'); show(GIRL, -120, 22, -126, 0); GIRL.rotation.x = -Math.PI / 2; GIRL.scale.setScalar(K); setFace(GIRL, 'happyc'); const k = prog(t, 70.87, 75); return { cam: C([0.8, WH + 2.0 + k * 3, -42 + k * 3], [-60, 20, -140], 100), ap: 0.0006 }; } },
  // 26 — a giant girl, asleep
  { a: 75.0, b: 79.4, run(t) { night(); show(GIRL, -120, 22, -126, 0); GIRL.rotation.x = -Math.PI / 2; GIRL.scale.setScalar(K); setFace(GIRL, 'happyc'); GIRL.userData.head.rotation.z = Math.sin(t * 0.8) * 0.05; const h = wpos(GIRL.userData.head); const k = prog(t, 75, 79.4);
    return { cam: C([h.x + 30 - k * 10, h.y + 28, h.z + 30], [h.x, h.y, h.z], 40), ap: 0.0008 }; } },
  // 27 — the town was her dollhouse
  { a: 79.4, b: 82.46, run(t) { night(); show(GIRL, -120, 22, -126, 0); GIRL.rotation.x = -Math.PI / 2; GIRL.scale.setScalar(K); setFace(GIRL, 'happyc'); const k = ss(prog(t, 79.4, 82.3)); return { cam: C([lerp(20, 150, k), lerp(40, 150, k), lerp(-10, 170, k)], [-20, 0, -40], 150), ap: 0.0004 }; } },
  // 28 — the missing boy, on the shelf: pretend tea, smiling
  { a: 82.46, b: 88.79, run(t) { night(); moonLamp.intensity = 320; show(LOST, SHELF.position.x - 25, SHELF.position.y + 1.5, SHELF.position.z + 5, 0.5); LOST.scale.setScalar(2.4); setFace(LOST, 'happyc'); LOST.userData.arms[1].rotation.set(-1.2, 0, 0.3); const k = prog(t, 82.46, 88.79);
    return { cam: C([SHELF.position.x - 16, SHELF.position.y + 12 - k * 5, SHELF.position.z + 62 - k * 28], [SHELF.position.x - 18, SHELF.position.y + 3, SHELF.position.z], 60 - k * 28), ap: 0.0015 }; } },
  // 29 — she never took them to punish them: she took them to play
  { a: 88.79, b: 93.27, run(t) { night(); moonLamp.intensity = 320; HAND.visible = true; HAND.rotation.set(-0.3, 0, 0); HAND.position.set(SHELF.position.x - 10, SHELF.position.y + 14 + Math.sin(t) * 0.5, SHELF.position.z + 10); curl(HAND, 0.25); const hp = HAND.position; show(LOST, hp.x, hp.y + 1, hp.z + 3, 0.2); LOST.scale.setScalar(2.4); setFace(LOST, 'happyc'); LOST.userData.arms[1].rotation.set(-0.3, 0, 1.2 + Math.sin(t * 6) * 0.3);
    return { cam: C([hp.x + 12, hp.y + 8, hp.z + 26], [hp.x, hp.y + 2, hp.z], 26), ap: 0.0015, fx: () => { const p = P(hp.x, hp.y + 8, hp.z); for (let i = 0; i < 4; i++) { const u = ((t * 0.5 + i / 4) % 1); O.globalAlpha = Math.sin(u * Math.PI); O.fillStyle = '#ff5fa2'; heart2(p[0] + Math.sin(i * 2) * 160, p[1] - u * 300, 30); O.globalAlpha = 1; } } }; } },
  // 30 — she wakes up and picks up her doll
  { a: 93.27, b: 97.23, run(t) { night(); const k = ss(prog(t, 93.3, 94.8)); show(GIRL, -120, 26, -150, 0); GIRL.scale.setScalar(K); GIRL.rotation.x = -Math.PI / 2 * (1 - k); GIRL.position.y = 26 - k * 8; setFace(GIRL, t < 94.5 ? 'happyc' : 'happy'); GIRL.userData.arms[1].rotation.set(-1.4 * k, 0, 0.3); DOLL.visible = true; const hp = hand(GIRL, 1); show(DOLL, hp.x, hp.y - 3, hp.z + 3, 0); DOLL.scale.setScalar(K * 0.28); setFace(DOLL, 'happy');
    const h = wpos(GIRL.userData.head); return { cam: C([h.x + 50, h.y + 10, h.z + 90], [h.x, h.y - 10, h.z], 100), ap: 0.0006 }; } },
  // 31 — the whisper: "Shhh. Don't make noise, or the sky will hear"
  { a: 97.23, b: 101.56, run(t) { night(); show(GIRL, -120, 18, -150, 0); GIRL.scale.setScalar(K); setFace(GIRL, 'worry'); GIRL.userData.head.rotation.set(0.15, 0.2, 0); shhPose(GIRL); GIRL.userData.arms[0].rotation.set(-1.4, 0, 0.5); DOLL.visible = true; const hp = hand(GIRL, 0); show(DOLL, hp.x + 2, hp.y - 4, hp.z + 3, 0.4); DOLL.scale.setScalar(K * 0.28); setFace(DOLL, 'happy');
    const h = wpos(GIRL.userData.head); const k = prog(t, 97.23, 101.56); return { cam: C([h.x + 8, h.y + 2, h.z + 46 - k * 10], [h.x, h.y - 6, h.z], 42), ap: 0.0012 }; } },
  // 32 — through her window: an eye, bigger than everything
  { a: 101.56, b: 106.51, run(t) { night(); EYE2.visible = true; eyeOpen(ss(prog(t, 102.2, 103.2))); EYE2.position.x = Math.sin(t * 0.7) * 4; EYE2.position.y = Math.cos(t * 0.5) * 3; const k = prog(t, 101.56, 106.51);
    return { cam: C([lerp(90, 150, k), 85, 40], [209, 85, 40], lerp(120, 60, k)), ap: 0.0006, bloom: 0.6 }; } },
  // 33 — "There's always someone listening."
  { a: 106.51, b: 999, run(t) { night(); EYE2.visible = true; eyeOpen(1); return { cam: C([180, 85, 40], [209, 85, 40], 30), ap: 0.0006, bloom: 0.7, fx: () => { const k = prog(t, 106.6, 107.6); O.fillStyle = `rgba(0,0,0,${0.75 * k})`; O.fillRect(0, 0, W, H); titleLine('SEMPRE TEM', 760, popT(t, 106.7), 100, '#ffffff'); titleLine('ALGUÉM ESCUTANDO.', 900, popT(t, 107.0), 100, '#ff5fa2'); if (t > 108.6) titleLine('VOCÊ FARIA BARULHO? 👇', 1060, popT(t, 108.6), 60, '#ffd23f'); } }; } },
];

function renderFrame(i) {
  const t = i / 24, f = i * 1.25; reset();
  const sh = SH.find((s) => t >= s.a && t < s.b) || SH[SH.length - 1];
  const R = sh.run(t);
  let [px, py, pz] = R.cam.p; px += Math.sin(t * 1.1) * 0.012 * R.cam.d; py += Math.cos(t * 0.9) * 0.008 * R.cam.d;
  const sk = (R.shake || 0) * 0.03 * Math.max(1, R.cam.d / 6) ** 0.5; const r = rng(i * 7 + 1); px += (r() - 0.5) * sk; py += (r() - 0.5) * sk;
  camera.position.set(px, py, pz); camera.lookAt(...R.cam.l);
  key.position.set(60, 160, 80); key.target.position.set(0, 0, 0); key.target.updateMatrixWorld(); key.shadow.camera.left = -60; key.shadow.camera.right = 60; key.shadow.camera.top = 60; key.shadow.camera.bottom = -60; key.shadow.camera.far = 400; key.shadow.camera.updateProjectionMatrix();
  bloom.strength = R.bloom ?? 0.4; bokeh.uniforms.focus.value = R.cam.d; bokeh.uniforms.aperture.value = R.ap ?? 0.002;
  composer.render();
  O.globalCompositeOperation = 'source-over'; O.globalAlpha = 1; O.drawImage(renderer.domElement, 0, 0);
  if (R.fx) R.fx();
  const v = O.createRadialGradient(W / 2, H * 0.45, W * 0.4, W / 2, H / 2, H * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(5,0,15,.5)'); O.fillStyle = v; O.fillRect(0, 0, W, H);
  return out.toDataURL('image/jpeg', 0.9);
}
window.renderFrame = renderFrame; window.ready = true;
