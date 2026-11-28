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
const S = [0.06, 2.797, 5.283, 7.982, 10.493, 13.821, 18.683, 22.154, 25.519, 27.257, 29.544, 32.079, 34.059, 36.315, 38.525]; const VEND = 41.35;

// ---------- "Minha mãe jogou Minecraft pela primeira vez" — sets: living room (RX) + original pastel cube world (GX)
const BASE = scene.children.filter((o) => !o.isLight);
const RX = 300, GX = -300;
const ROOM = new THREE.Group(); ROOM.position.x = RX; scene.add(ROOM);
const GAME = new THREE.Group(); GAME.position.x = GX; scene.add(GAME);

// ---- living room: sofa faces +z, TV on the +z side, back wall at z = -1.6
{
  const WOOD = tex(512, 512, (g) => { g.fillStyle = '#b07a4f'; g.fillRect(0, 0, 512, 512); const r = rng(5); for (let y = 0; y < 512; y += 64) { g.fillStyle = `rgba(60,30,10,${0.15 + r() * 0.15})`; g.fillRect(0, y, 512, 3); for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,220,180,${r() * 0.12})`; g.fillRect(r() * 512, y + r() * 60, 40 + r() * 80, 2); } g.fillStyle = 'rgba(60,30,10,.25)'; g.fillRect(r() * 512, y, 3, 64); } });
  WOOD.wrapS = WOOD.wrapT = THREE.RepeatWrapping; WOOD.repeat.set(3, 3);
  const fl = M(new THREE.PlaneGeometry(12, 12), new THREE.MeshStandardMaterial({ map: WOOD, roughness: 0.6 })); fl.rotation.x = -Math.PI / 2; ROOM.add(fl);
  const PAPER = tex(256, 256, (g) => { g.fillStyle = '#f3d9c6'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#e7bfa6'; for (let x = 0; x < 256; x += 32) g.fillRect(x, 0, 12, 256); g.fillStyle = '#ff8fab'; for (let y = 16; y < 256; y += 64) for (let x = 22; x < 256; x += 64) { g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); } });
  PAPER.wrapS = PAPER.wrapT = THREE.RepeatWrapping; PAPER.repeat.set(5, 2);
  const wm = new THREE.MeshStandardMaterial({ map: PAPER, roughness: 0.9 });
  const wall = (w, p, ry) => { const m = M(new THREE.PlaneGeometry(w, 3.2), wm); m.position.set(...p); m.rotation.y = ry; ROOM.add(m); };
  wall(12, [0, 1.6, -1.6], 0); wall(12, [-4, 1.6, 2], Math.PI / 2); wall(12, [4, 1.6, 2], -Math.PI / 2); wall(12, [0, 1.6, 5], Math.PI);
  ROOM.add(box(12, 0.12, 0.04, '#ffffff', [0, 0.06, -1.58]));
  // sofa
  const so = '#4f6d9a', cu = '#6b8cc2';
  ROOM.add(box(2.6, 0.42, 0.95, so, [0, 0.21, -0.25], 0.85)); ROOM.add(box(2.6, 0.85, 0.28, so, [0, 0.62, -0.7], 0.85));
  for (const sx of [-1, 1]) ROOM.add(box(0.26, 0.62, 0.95, so, [sx * 1.4, 0.31, -0.25], 0.85));
  for (const sx of [-1, 1]) { ROOM.add(box(1.22, 0.14, 0.86, cu, [sx * 0.63, 0.49, -0.2], 0.9)); ROOM.add(box(1.15, 0.5, 0.18, cu, [sx * 0.63, 0.82, -0.52], 0.9)); }
  ROOM.add(box(0.42, 0.42, 0.14, '#ffd23f', [-1.12, 0.78, -0.42], 0.9)).rotation.z = 0.3;
  // rug
  const RUG = tex(256, 256, (g) => { g.fillStyle = '#e76f51'; g.fillRect(0, 0, 256, 256); g.strokeStyle = '#f4a261'; g.lineWidth = 14; g.strokeRect(20, 20, 216, 216); g.strokeStyle = '#ffe8d6'; g.lineWidth = 5; g.strokeRect(44, 44, 168, 168); });
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.6), new THREE.MeshStandardMaterial({ map: RUG, roughness: 1 })); rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.01, 1.3); rug.receiveShadow = true; ROOM.add(rug);
  // TV stand + plant + lamp
  ROOM.add(box(2.4, 0.5, 0.5, '#5c4033', [0, 0.25, 3.3], 0.7));
  const pot = M(new THREE.CylinderGeometry(0.2, 0.15, 0.4, 16), mat('#e9c46a'), [-2.2, 0.2, -1.2]); ROOM.add(pot);
  for (let i = 0; i < 7; i++) { const l = M(new THREE.SphereGeometry(0.22, 12, 10), mat('#2a9d8f', 0.6), [-2.2 + Math.sin(i * 2.4) * 0.18, 0.6 + i * 0.09, -1.2 + Math.cos(i * 2.4) * 0.18]); l.scale.set(0.7, 1.3, 0.4); l.rotation.z = Math.sin(i) * 0.6; ROOM.add(l); }
  ROOM.add(M(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8), mat('#333'), [2.1, 0.75, -1.2])); ROOM.add(M(new THREE.ConeGeometry(0.3, 0.35, 20, 1, true), mat('#fff3d6', 0.6, { emissive: '#ffcf8a', emissiveIntensity: 0.6, side: THREE.DoubleSide }), [2.1, 1.6, -1.2]));
  // framed pictures
  for (const [x, c] of [[-1.0, '#ffd6e0'], [0.9, '#cdeac0']]) { ROOM.add(box(0.7, 0.55, 0.04, '#6d4c41', [x, 2.05, -1.57])); ROOM.add(box(0.58, 0.43, 0.05, c, [x, 2.05, -1.56])); }
}
// wall clock (hands set per frame)
const CLOCK = new THREE.Group(); CLOCK.position.set(RX + 2.6, 2.3, -1.56); scene.add(CLOCK);
const CLK_TEX = tex(256, 256, (g) => { g.fillStyle = '#fffaf0'; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill(); g.lineWidth = 12; g.strokeStyle = '#ff5fa2'; g.stroke(); g.fillStyle = '#2a1046'; g.font = '900 34px Arial Black, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; for (let i = 1; i <= 12; i++) { const a = i / 12 * Math.PI * 2; g.fillText(String(i), 128 + Math.sin(a) * 92, 128 - Math.cos(a) * 92); } });
CLOCK.add(new THREE.Mesh(new THREE.CircleGeometry(0.42, 40), new THREE.MeshStandardMaterial({ map: CLK_TEX, roughness: 0.5 })));
const CLK_H = M(new THREE.BoxGeometry(0.04, 0.22, 0.02), mat('#2a1046'), [0, 0, 0.02]), CLK_M = M(new THREE.BoxGeometry(0.03, 0.32, 0.02), mat('#2a1046'), [0, 0, 0.03]);
for (const h of [CLK_H, CLK_M]) { h.geometry.translate(0, h.geometry.parameters.height / 2 - 0.02, 0); CLOCK.add(h); }
function setClock(hh, mm) { CLK_H.rotation.z = -(hh % 12 + mm / 60) / 12 * Math.PI * 2; CLK_M.rotation.z = -mm / 60 * Math.PI * 2; }

// the TV: its screen shows the game (a canvas we redraw)
const TVC = document.createElement('canvas'); TVC.width = 512; TVC.height = 288; const TG = TVC.getContext('2d');
const TV_TEX = new THREE.CanvasTexture(TVC); TV_TEX.colorSpace = THREE.SRGBColorSpace;
const TV = new THREE.Group(); TV.position.set(RX, 1.25, 3.35); TV.rotation.y = Math.PI; scene.add(TV);
TV.add(box(2.1, 1.22, 0.08, '#15131c', [0, 0, -0.02], 0.3));
const tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.98, 1.1), new THREE.MeshBasicMaterial({ map: TV_TEX, toneMapped: false })); tvScreen.position.z = 0.025; TV.add(tvScreen);
function drawTV(mode, f) {
  const g = TG; const night = mode === 'night';
  const gr = g.createLinearGradient(0, 0, 0, 288); gr.addColorStop(0, night ? '#0b1240' : '#69c8ff'); gr.addColorStop(1, night ? '#2a2f7a' : '#c9f0ff'); g.fillStyle = gr; g.fillRect(0, 0, 512, 288);
  if (night) { g.fillStyle = '#fff6d6'; g.beginPath(); g.arc(400, 60, 22, 0, 7); g.fill(); }
  const r = rng(4); for (let i = 0; i < 14; i++) { const x = ((i * 53 + f * 0.6) % 560) - 40, y = 160 + Math.floor(r() * 4) * 18; g.fillStyle = night ? '#1f6b56' : '#6fd6a8'; g.fillRect(x, y, 48, 288 - y); g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(x + 40, y, 8, 288 - y); }
  g.fillStyle = night ? '#7b2cbf' : '#ff9ec7'; g.fillRect(300 + Math.sin(f * 0.05) * 40, 120, 44, 44);
  g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 3; g.beginPath(); g.moveTo(246, 144); g.lineTo(266, 144); g.moveTo(256, 134); g.lineTo(256, 154); g.stroke();
  for (let i = 0; i < 9; i++) { g.fillStyle = 'rgba(30,20,50,.6)'; g.fillRect(130 + i * 28, 258, 24, 24); }
  TV_TEX.needsUpdate = true;
}
const tvLight = new THREE.PointLight('#7fd0ff', 0, 7, 1.3); tvLight.position.set(RX, 1.3, 2.6); scene.add(tvLight);
const roomLamp = new THREE.PointLight('#ffc98a', 0, 9, 1.3); roomLamp.position.set(RX + 2.1, 1.7, -0.9); scene.add(roomLamp);

// ---- characters: the son (bolinha = civ) and MÃE (fixed cast, original)
const MOM_O = { skin: '#e8b894', hair: '#4a2618', style: 'bob', top: '#9b5de5', top2: '#f15bb5', legs: '#2b2d42', shoes: '#ff6f91', hands: '#e8b894', glasses: true, phones: true };
const mom = kid(MOM_O); mom.userData.sc = 1.22; scene.add(mom);
const momG = kid(Object.assign({}, MOM_O, { phones: false })); momG.userData.sc = 1.0; scene.add(momG); // her avatar inside the game
{ // earrings + a little lipstick-pink mouth is handled by the face; add earrings
  for (const k of [mom, momG]) for (const sx of [-1, 1]) { const e = M(new THREE.SphereGeometry(0.035, 10, 8), mat('#ffd23f', 0.2, { metalness: 0.8 }), [sx * 0.3, -0.12, 0.02]); k.userData.head.add(e); }
}
const son = civ;
// game controller
const PAD = new THREE.Group(); scene.add(PAD);
{
  const pm = mat('#2b2d42', 0.35); PAD.add(M(new THREE.BoxGeometry(0.34, 0.07, 0.15), pm)); for (const sx of [-1, 1]) { const g = M(new THREE.CapsuleGeometry(0.055, 0.1, 6, 12), pm, [sx * 0.15, -0.01, 0.07]); g.rotation.x = Math.PI / 2 - 0.4; PAD.add(g); }
  const cols = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4']; cols.forEach((c, i) => PAD.add(M(new THREE.SphereGeometry(0.016, 10, 8), mat(c, 0.3, { emissive: c, emissiveIntensity: 0.4 }), [0.09 + [0, 0.025, 0, -0.025][i], 0.04, [-0.025, 0, 0.025, 0][i]])));
  PAD.add(box(0.06, 0.012, 0.018, '#111', [-0.09, 0.04, 0])); PAD.add(box(0.018, 0.012, 0.06, '#111', [-0.09, 0.04, 0]));
}
function sit(k, x, z, o = {}) {
  show(k, x, 0, z, o.ry || 0); const sc = k.userData.sc || 1; k.userData.body.position.y = 0.56 / sc - 0.55; for (const lg of k.userData.legs) lg.rotation.x = -1.25;
  k.userData.body.rotation.x = o.lean || 0; return k;
}
function holdPad(k, up = 1, tilt = 0) { // both arms forward to the lap; controller between the hands
  k.userData.arms[0].rotation.set(-1.05, 0, -0.55); k.userData.arms[1].rotation.set(-1.05, 0, 0.55);
  const a = hand(k, 0), b = hand(k, 1); PAD.visible = true; PAD.position.set((a.x + b.x) / 2, (a.y + b.y) / 2 + 0.03, (a.z + b.z) / 2 + 0.02);
  PAD.rotation.set(0.5, k.rotation.y, up < 0 ? Math.PI + tilt : tilt); PAD.scale.setScalar(k.userData.sc || 1);
}

// ---- GAME world: pastel toy blocks (original look — flat colours, no pixel textures)
const GSKY = tex(64, 1024, (g) => { const gr = g.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, '#3fa9f5'); gr.addColorStop(0.6, '#8fd3ff'); gr.addColorStop(1, '#e8f8ff'); g.fillStyle = gr; g.fillRect(0, 0, 64, 1024); });
const GSKY_N = tex(64, 1024, (g) => { const gr = g.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, '#05082a'); gr.addColorStop(0.6, '#1a1f5c'); gr.addColorStop(1, '#3d2f7a'); g.fillStyle = gr; g.fillRect(0, 0, 64, 1024); const r = rng(8); g.fillStyle = '#fff'; for (let i = 0; i < 90; i++) g.fillRect(r() * 64, r() * 600, 1, 1); });
const HGT = (x, z) => Math.max(0, Math.round(Math.sin(x * 0.35) * 1.2 + Math.cos(z * 0.3 + 1) * 1.1 + Math.sin((x + z) * 0.18) * 0.8) - 0) * (Math.hypot(x, z) < 12 ? 0 : 1);
const blockGeo = new THREE.BoxGeometry(1, 1, 1);
const GRASS = [];
for (let x = -16; x <= 16; x++) for (let z = -22; z <= 10; z++) { const h = HGT(x, z); for (let y = Math.max(0, h - 1); y <= h; y++) GRASS.push([x, y, z, y === h]); }
const ground = new THREE.InstancedMesh(blockGeo, new THREE.MeshStandardMaterial({ roughness: 0.75 }), GRASS.length); ground.receiveShadow = true; ground.castShadow = true; GAME.add(ground);
{ const r = rng(31); const c = new THREE.Color(); GRASS.forEach(([x, y, z, top], i) => { DUMMY.position.set(x, y - 0.5, z); DUMMY.rotation.set(0, 0, 0); DUMMY.scale.setScalar(1); DUMMY.updateMatrix(); ground.setMatrixAt(i, DUMMY.matrix); c.set(top ? (r() < 0.5 ? '#6fd6a8' : '#62cc9c') : '#d9a066'); c.offsetHSL(0, 0, (r() - 0.5) * 0.05); ground.setColorAt(i, c); }); ground.instanceMatrix.needsUpdate = true; ground.instanceColor.needsUpdate = true; }
// trees: trunk + blossom-leaf cluster
const TREES = [[7, -8], [5, -9], [-8, -12], [8, -3], [-11, -4], [11, -14], [-6, 3], [3, -16]];
const treeObjs = TREES.map(([x, z], i) => { const t = new THREE.Group(); const h = HGT(x, z); t.position.set(x, h, z); for (let k = 0; k < 3; k++) t.add(box(0.8, 1, 0.8, '#b5835a', [0, 0.5 + k, 0], 0.8)); const r = rng(50 + i); for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = 0; c < 2; c++) { if (Math.abs(a) + Math.abs(b) + c > 2 && r() < 0.6) continue; t.add(box(1, 1, 1, r() < 0.25 ? '#ff9ec7' : (r() < 0.5 ? '#3fb67f' : '#4cc38a'), [a, 3.5 + c, b], 0.8)); } GAME.add(t); return t; });
const punchTree = treeObjs[0];
// clouds
const clouds = []; for (let i = 0; i < 8; i++) { const c = new THREE.Group(); const r = rng(70 + i); for (let k = 0; k < 4; k++) c.add(box(2 + r() * 2, 0.6, 1.5 + r() * 1.5, '#ffffff', [k * 1.4 - 2, 0, (r() - 0.5) * 1.2], 1, { emissive: '#ffffff', emissiveIntensity: 0.25 })); c.position.set(-20 + i * 6, 14 + r() * 3, -24 + r() * 20); GAME.add(c); clouds.push(c); }
// the house (built block by block): yellow walls, red roof, blue windows, door gap at z=+2 (front)
const HOUSE = [], ROOF_B = [];
for (let y = 0; y < 3; y++) for (let x = -2; x <= 2; x++) for (let z = -2; z <= 2; z++) { if (Math.abs(x) < 2 && Math.abs(z) < 2) continue; if (z === 2 && x === 0 && y < 2) continue; const win = y === 1 && ((Math.abs(x) === 2 && z === 0) || (z === -2 && x === 0)); HOUSE.push([x, y, z, win]); }
for (let l = 0; l < 3; l++) for (let x = -3 + l; x <= 3 - l; x++) for (let z = -3 + l; z <= 3 - l; z++) ROOF_B.push([x, 3 + l, z]);
const HZ0 = -4; // house centre z in game coords
const houseIM = new THREE.InstancedMesh(blockGeo, new THREE.MeshStandardMaterial({ roughness: 0.6 }), HOUSE.length); houseIM.castShadow = houseIM.receiveShadow = true; GAME.add(houseIM);
const roofIM = new THREE.InstancedMesh(blockGeo, new THREE.MeshStandardMaterial({ roughness: 0.6 }), ROOF_B.length); roofIM.castShadow = roofIM.receiveShadow = true; GAME.add(roofIM);
{ const c = new THREE.Color(); HOUSE.forEach((b, i) => { c.set(b[3] ? '#9be7ff' : ((b[0] + b[1] + b[2]) % 2 ? '#f6d365' : '#f4c95d')); houseIM.setColorAt(i, c); }); ROOF_B.forEach((b, i) => { c.set(i % 2 ? '#e63946' : '#d62f3c'); roofIM.setColorAt(i, c); }); }
function setHouse(k, roof = 1) { // k: 0..1 build progress (blocks drop in order)
  const n = HOUSE.length + ROOF_B.length; const all = [...HOUSE.map((b) => [houseIM, b]), ...ROOF_B.map((b) => [roofIM, b])]; let hi = 0, ri = 0;
  all.forEach(([im, b], j) => { const idx = im === houseIM ? hi++ : ri++; const s = clamp(k * n * 1.0 - j * 0.85, 0, 1); const drop = (1 - ss(s)) * 6; const vis = s > 0 && (im === houseIM || roof);
    DUMMY.position.set(b[0], b[1] + 0.5 + drop, b[2] + HZ0); DUMMY.rotation.set(0, 0, 0); DUMMY.scale.setScalar(vis ? 1 : 0); DUMMY.updateMatrix(); im.setMatrixAt(idx, DUMMY.matrix); });
  houseIM.instanceMatrix.needsUpdate = true; roofIM.instanceMatrix.needsUpdate = true; houseIM.instanceColor.needsUpdate = true; roofIM.instanceColor.needsUpdate = true;
}
const DECOR = new THREE.Group(); GAME.add(DECOR);
{
  const rugT = tex(256, 256, (g) => { g.fillStyle = '#ff8fab'; g.fillRect(0, 0, 256, 256); g.strokeStyle = '#fff'; g.lineWidth = 10; g.strokeRect(24, 24, 208, 208); g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(128, 128, 40, 0, 7); g.fill(); });
  const r = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), new THREE.MeshStandardMaterial({ map: rugT })); r.rotation.x = -Math.PI / 2; r.position.set(0, 0.02, HZ0); DECOR.add(r);
  for (const sx of [-1, 1]) { const c = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1.1), new THREE.MeshStandardMaterial({ color: '#9b5de5', side: THREE.DoubleSide })); c.position.set(sx * 1.48, 1.5, HZ0 + sx * 0.32); c.rotation.y = Math.PI / 2; DECOR.add(c); }
  const vt = tex(256, 96, (g) => { g.fillStyle = '#fff3d6'; g.fillRect(0, 0, 256, 96); g.strokeStyle = '#6d4c41'; g.lineWidth = 8; g.strokeRect(4, 4, 248, 88); g.fillStyle = '#c1121f'; g.font = '900 40px Arial Black, Arial'; g.textAlign = 'center'; g.fillText('VISITAS', 128, 62); });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.38), new THREE.MeshStandardMaterial({ map: vt })); sign.position.set(-1.45, 2.3, HZ0 - 0.6); sign.rotation.y = Math.PI / 2; DECOR.add(sign);
  DECOR.add(box(0.9, 0.3, 1.6, '#ffffff', [-0.9, 0.15, HZ0 - 0.7])); DECOR.add(box(0.85, 0.12, 1.5, '#3a86ff', [-0.9, 0.36, HZ0 - 0.7])); DECOR.add(box(0.5, 0.1, 0.3, '#fff', [-0.9, 0.45, HZ0 - 1.25]));
}
const MAT_T = tex(256, 128, (g) => { g.fillStyle = '#8d6e63'; g.fillRect(0, 0, 256, 128); g.strokeStyle = '#ffd23f'; g.lineWidth = 6; g.strokeRect(8, 8, 240, 112); g.fillStyle = '#ffd23f'; g.font = '900 34px Arial Black, Arial'; g.textAlign = 'center'; g.fillText('BEM-VINDO', 128, 76); });
const doormat = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.7), new THREE.MeshStandardMaterial({ map: MAT_T, roughness: 1 })); doormat.rotation.x = -Math.PI / 2; doormat.position.set(0, 0.02, HZ0 + 3.6); doormat.receiveShadow = true; GAME.add(doormat);
// the night monster (original): round purple blob, one big eye, little teeth, stubby feet
const MON = new THREE.Group(); scene.add(MON);
{
  const pm = mat('#7b2cbf', 0.45); const b = M(new THREE.SphereGeometry(0.75, 32, 24), pm, [0, 1.05, 0]); b.scale.set(1, 1.1, 0.95); MON.add(b);
  const eye = M(new THREE.SphereGeometry(0.3, 24, 16), mat('#ffffff', 0.2), [0, 1.3, 0.6]); MON.add(eye); const pu = M(new THREE.SphereGeometry(0.13, 16, 12), mat('#120a1a', 0.2), [0, 1.3, 0.86]); MON.add(pu); MON.userData.pupil = pu;
  for (let i = 0; i < 5; i++) { const t = M(new THREE.ConeGeometry(0.06, 0.12, 8), mat('#ffffff', 0.3), [-0.24 + i * 0.12, 0.8, 0.66]); t.rotation.x = Math.PI; MON.add(t); }
  const feet = []; for (const sx of [-1, 1]) { const f = M(new THREE.SphereGeometry(0.22, 16, 12), mat('#5a189a', 0.5), [sx * 0.35, 0.16, 0.1]); f.scale.set(1, 0.6, 1.4); MON.add(f); feet.push(f); }
  for (const sx of [-1, 1]) { const h = M(new THREE.ConeGeometry(0.1, 0.35, 12), mat('#ffd23f', 0.3), [sx * 0.35, 1.85, 0]); h.rotation.z = -sx * 0.4; MON.add(h); }
  MON.userData.feet = feet;
}
// diamond + ice-cream tub "chest"
const GEM = M(new THREE.OctahedronGeometry(0.5, 0), mat('#5ef2ff', 0.08, { metalness: 0.3, emissive: '#29c4ff', emissiveIntensity: 0.9, flatShading: true })); GEM.scale.set(1, 1.35, 1); scene.add(GEM);
const TUB = new THREE.Group(); scene.add(TUB);
{
  const lab = tex(512, 160, (g) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, 512, 160); g.fillStyle = '#7f4f24'; g.beginPath(); g.moveTo(0, 0); for (let x = 0; x <= 512; x += 32) g.quadraticCurveTo(x + 16, 40, x + 32, 18); g.lineTo(512, 0); g.fill(); g.fillStyle = '#e63946'; g.font = '900 64px Arial Black, Arial'; g.textAlign = 'center'; g.fillText('SORVETE', 256, 112); g.fillStyle = '#7f4f24'; g.font = '700 30px Arial'; g.fillText('CREME • 2 LITROS', 256, 148); });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.62, 0.9, 40, 1, true), new THREE.MeshStandardMaterial({ map: lab, roughness: 0.4, side: THREE.DoubleSide })); body.position.y = 0.45; body.castShadow = true; TUB.add(body);
  TUB.add(M(new THREE.CylinderGeometry(0.62, 0.62, 0.04, 40), mat('#ffffff', 0.4), [0, 0.02, 0])); TUB.add(M(new THREE.CylinderGeometry(0.72, 0.6, 0.86, 40, 1, true), mat('#fff3d6', 0.6, { side: THREE.BackSide }), [0, 0.45, 0])); TUB.add(M(new THREE.CylinderGeometry(0.7, 0.7, 0.05, 40), mat('#fff0c9', 0.7), [0, 0.78, 0]));
  const lid = new THREE.Group(); lid.position.set(-0.78, 0.92, 0); TUB.add(lid); lid.add(M(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 40), mat('#e63946', 0.35), [0.78, 0.05, 0])); TUB.userData.lid = lid;
}
const gameSun = new THREE.DirectionalLight('#fff2d6', 0); gameSun.castShadow = true; gameSun.shadow.mapSize.set(2048, 2048); Object.assign(gameSun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 0.5, far: 80 }); gameSun.shadow.bias = -0.0006; scene.add(gameSun); scene.add(gameSun.target);
const moonLight = new THREE.PointLight('#9fb4ff', 0, 30, 1.2); scene.add(moonLight);
const moonDisc = M(new THREE.SphereGeometry(1.6, 24, 16), mat('#fff6d6', 0.5, { emissive: '#fff1c4', emissiveIntensity: 1.6 })); moonDisc.castShadow = false; scene.add(moonDisc);
const sunDiscG = M(new THREE.SphereGeometry(2.2, 24, 16), mat('#fff3b0', 0.5, { emissive: '#ffe066', emissiveIntensity: 2.2 })); sunDiscG.castShadow = false; scene.add(sunDiscG);

// ---- 2D game HUD (draws on the overlay)
function hud(f, o = {}) {
  O.save(); O.lineWidth = 14; O.strokeStyle = 'rgba(255,255,255,.9)'; O.beginPath(); O.roundRect(26, 26, W - 52, H - 52, 46); O.stroke();
  O.fillStyle = 'rgba(20,10,40,.6)'; O.beginPath(); O.roundRect(48, 48, 300, 74, 37); O.fill(); O.fillStyle = '#ff5fa2'; O.beginPath(); O.arc(90, 85, 14, 0, 7); O.fill();
  O.fillStyle = '#ffffff'; O.font = '900 38px Inter, Arial Black'; O.textBaseline = 'middle'; O.fillText(o.label || 'MUNDO DA MÃE', 118, 87);
  const n = 9, s = 92, x0 = W / 2 - n * s / 2, y0 = H - 210; for (let i = 0; i < n; i++) { O.fillStyle = 'rgba(20,10,40,.55)'; O.fillRect(x0 + i * s + 4, y0, s - 8, s - 8); O.strokeStyle = i === (o.slot ?? 0) ? '#ffd23f' : 'rgba(255,255,255,.7)'; O.lineWidth = i === (o.slot ?? 0) ? 8 : 4; O.strokeRect(x0 + i * s + 4, y0, s - 8, s - 8); }
  const items = o.items || ['#f6d365', '#e63946', '#9be7ff', '#b5835a']; items.forEach((c, i) => { O.fillStyle = c; O.fillRect(x0 + i * s + 24, y0 + 20, s - 48, s - 48); });
  for (let i = 0; i < 10; i++) { O.fillStyle = i < (o.hearts ?? 10) ? '#ff2d55' : 'rgba(255,255,255,.35)'; heart2(x0 + 30 + i * 46, y0 - 46, 15); }
  if (o.cross !== false) { O.strokeStyle = 'rgba(255,255,255,.85)'; O.lineWidth = 6; O.beginPath(); O.moveTo(W / 2 - 26, H / 2); O.lineTo(W / 2 + 26, H / 2); O.moveTo(W / 2, H / 2 - 26); O.lineTo(W / 2, H / 2 + 26); O.stroke(); }
  O.restore();
}

// ---------- shots (t in seconds; frames at 30 fps)
const C = (p, l, d) => ({ p, l, d });
const G = (x, y, z) => [GX + x, y, z];
const MX = RX + 0.55, SXp = RX - 0.55, SZ = -0.12;
const TAG = (txt, y, k, size = 120, col = '#ffffff') => titleLine(txt, y, k, size, col);
const popT = (t, a, d = 0.25) => backOut(clamp((t - a) / d));
function reset() {
  for (const o of BASE) o.visible = false;
  for (const o of [ROOM, GAME, TV, CLOCK, mom, momG, son, PAD, MON, GEM, TUB, moonDisc, sunDiscG, DECOR, doormat]) o.visible = false;
  son.userData.watch.visible = false; mom.userData.phones.visible = true;
  for (const k of [mom, momG, son]) { k.userData.body.rotation.set(0, 0, 0); k.userData.body.position.set(0, 0, 0); k.userData.head.rotation.set(0, 0, 0); }
  tvLight.intensity = 0; roomLamp.intensity = 0; gameSun.intensity = 0; moonLight.intensity = 0; key.intensity = 0; fill.intensity = 0; heroLight.intensity = 0; portalLight.intensity = 0;
  hemi.intensity = 1.0; renderer.toneMappingExposure = 1.2; scene.fog.near = 40; scene.fog.far = 200;
}
function room(f, night = false) {
  ROOM.visible = TV.visible = CLOCK.visible = true; tvLight.color.set(night ? '#cfe9ff' : '#7fd0ff'); scene.background = new THREE.Color(night ? '#120c22' : '#2a1d2e');
  hemi.color.set(night ? '#d8c8f0' : '#ffe2c4'); hemi.groundColor.set('#3a2533'); hemi.intensity = night ? 0.7 : 0.9;
  roomLamp.intensity = night ? 2.8 : 6; tvLight.intensity = (night ? 4.5 : 4) * (0.85 + 0.15 * Math.sin(f * 0.37) * Math.sin(f * 0.13));
  key.intensity = night ? 0.15 : 0.8; key.color.set(night ? '#8fa0ff' : '#ffe9cf'); fill.intensity = night ? 0.6 : 1.2; fill.color.set(night ? '#ffd9c2' : '#ffd6a8');
  drawTV(night ? 'night' : 'day', f); setClock(night ? 0 : 7, night ? 0 : 40);
}
function sofa(o = {}) {
  sit(son, SXp, SZ); sit(mom, MX, SZ); setFace(son, o.se || 'happy', o.sl || 0); setFace(mom, o.me || 'happy', o.ml || 0);
  son.userData.arms[0].rotation.set(-0.9, 0, -0.4); son.userData.arms[1].rotation.set(-0.9, 0, 0.4);
  if (o.pad !== false) holdPad(mom, o.up ?? 1, o.tilt || 0);
}
function game(f, night = false) {
  GAME.visible = true; scene.background = night ? GSKY_N : GSKY; scene.fog.color.set(night ? '#1a1f5c' : '#bfe9ff'); scene.fog.near = 25; scene.fog.far = 70;
  hemi.color.set(night ? '#5a63c9' : '#ffffff'); hemi.groundColor.set(night ? '#1a1033' : '#7bd389'); hemi.intensity = night ? 0.45 : 1.35;
  gameSun.intensity = night ? 0 : 2.4; gameSun.position.set(GX + 10, 22, 12); gameSun.target.position.set(GX, 0, -4); gameSun.target.updateMatrixWorld();
  moonLight.intensity = night ? 40 : 0; moonLight.position.set(GX + 6, 12, 6);
  clouds.forEach((c, i) => (c.position.x = -22 + ((i * 6 + f * 0.03) % 46)));
  setHouse(1); DECOR.visible = true; doormat.visible = true;
}
function gWho(k, x, z, ry, o = {}) { const y = o.y ?? 0; show(k, GX + x, y, z, ry); k.scale.setScalar(o.sc || 1); setFace(k, o.e || 'happy'); return k; }
function bub(t, a, txt, o = {}) { bubble(W / 2 + (o.x || 0), o.y || 430, txt, popT(t, a), Object.assign({ fs: 54 }, o)); }
function headCam(k, side, dist, dy = 0) { const h = wpos(k.userData.head); return [h, [h.x + side, h.y + dy, h.z + dist]]; }

const SH = [
  // 1 — hook: extreme close of MÃE, headset on, TV glow on the face
  { a: 0, b: 1.4, run(t, f) { room(f); sofa({ me: 'stern' }); mom.userData.head.rotation.set(0.05, 0, Math.sin(t * 6) * 0.04); const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x + 0.1, h.y + 0.02, h.z + 1.75 - t * 0.2], [h.x, h.y - 0.12, h.z], 1.7), ap: 0.012, fx: () => { glow(W / 2, H * 0.55, 700, '127,208,255', 0.18); TAG('MINHA MÃE', 300, popT(t, 0.05), 140, '#ffd23f'); TAG('🎮 1ª VEZ 🎮', 460, popT(t, 0.55), 92, '#ffffff'); } }; } },
  // 2 — sofa two-shot, TV in foreground
  { a: 1.4, b: 2.8, run(t, f) { room(f); sofa({ me: 'stern', se: 'happy', sl: 0.6 }); const k = prog(t, 1.4, 2.8);
    return { cam: C([RX - 0.3 + k * 0.5, 1.55, 3.5 - k * 0.3], [RX, 1.15, SZ], 3.5), ap: 0.004, fx: () => { TAG('MINECRAFT?', 300, popT(t, 1.5), 130, '#8ce95a'); } }; } },
  // 3 — controller upside down
  { a: 2.8, b: 4.1, run(t, f) { room(f); sofa({ me: 'worry', ml: -0.4, up: -1, tilt: Math.sin(t * 5) * 0.15 }); const p = PAD.position;
    return { cam: C([p.x + 0.35, p.y + 0.35, p.z + 0.65], [p.x, p.y, p.z], 0.8), ap: 0.012, fx: () => { bub(t, 2.85, 'FILHO, CADÊ O BOTÃO\nDE LIGAR A PESSOA?', { fs: 50, tx: 60 }); TAG('DE CABEÇA PRA BAIXO 🙃', 1180, popT(t, 3.4), 64, '#ffd23f'); } }; } },
  // 4 — the son's flat face
  { a: 4.1, b: 5.28, run(t, f) { room(f); sofa({ se: 'flat', sl: 0.9, me: 'worry' }); son.userData.head.rotation.y = 0.5; const [h] = headCam(son, 0, 0);
    return { cam: C([h.x - 0.35, h.y, h.z + 1.55 - prog(t, 4.1, 5.28) * 0.2], [h.x, h.y - 0.1, h.z], 1.5), ap: 0.012, fx: () => { TAG('😐', 330, popT(t, 4.3), 170, '#fff'); } }; } },
  // 5 — game: staring at the sky, camera spinning upward
  { a: 5.28, b: 6.6, run(t, f) { game(f); sunDiscG.visible = true; sunDiscG.position.set(GX + 30, 40, -60); const a = t * 1.2;
    return { cam: C([GX + 8, 1.7, 6], [GX + 8 + Math.sin(a) * 10, 3.8 + Math.sin(t * 3) * 1.2, 6 - Math.cos(a) * 10], 20), ap: 0.001, fx: () => { hud(f, { label: 'OLHANDO PRO CÉU' }); TAG('5 MINUTOS... ☁️', 330, popT(t, 5.35), 104, '#ffffff'); } }; } },
  // 6 — real mom tilting her head way back, following the sky
  { a: 6.6, b: 7.98, run(t, f) { room(f); sofa({ me: 'shock', ml: 0 }); mom.userData.head.rotation.x = -0.35 - Math.sin(t * 2) * 0.1; mom.userData.body.rotation.x = -0.12; mom.userData.head.rotation.z = Math.sin(t * 4) * 0.12;
    const [h] = headCam(mom, 0, 0); return { cam: C([h.x + 0.9, h.y - 0.2, h.z + 1.6], [h.x, h.y - 0.05, h.z], 1.8), ap: 0.008, fx: () => {} }; } },
  // 7 — game: she punches a tree
  { a: 7.98, b: 9.3, run(t, f) { game(f); const tp = punchTree.position; gWho(momG, tp.x + 1.25, tp.z + 0.2, -Math.PI / 2, { y: tp.y, e: 'stern' }); const ph = Math.sin(t * 22);
    momG.userData.arms[1].rotation.set(-1.4 - ph * 0.25, 0, 0.1); momG.userData.arms[0].rotation.set(-0.6, 0, -0.3);
    const hit = ph > 0.85; return { cam: C(G(tp.x + 1.4, tp.y + 1.9, tp.z + 4.4), G(tp.x + 0.6, tp.y + 1.4, tp.z), 4.5), ap: 0.002, shake: hit ? 1.0 : 0.2, fx: () => { hud(f, { slot: 3 }); const p = P(GX + tp.x + 0.45, tp.y + 1.3, tp.z + 0.2); if (hit) ringFx(p[0], p[1], 0.4, '255,255,255', 260); for (let i = 0; i < 6; i++) { const r = rng(i + Math.floor(t * 8)); glow(p[0] + (r() - 0.5) * 200, p[1] + (r() - 0.5) * 200, 18, '255,158,199', 0.8); } TAG('SOCO 👊', 300, popT(t, 8.1), 120, '#ffd23f'); } }; } },
  // 8 — real mom: hands to the mouth, guilty
  { a: 9.3, b: 10.49, run(t, f) { room(f); sofa({ me: 'worry', pad: false }); for (const [i, s] of [[0, -1], [1, 1]]) mom.userData.arms[i].rotation.set(-2.3, 0, s * 0.45); PAD.visible = false; const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x - 0.3, h.y - 0.05, h.z + 1.75], [h.x, h.y - 0.22, h.z], 1.8), ap: 0.01, shake: 0.3, fx: () => { sweat(W / 2, H * 0.4, 2, f); } }; } },
  // 9 — "Ai, desculpa, árvore!"
  { a: 10.49, b: 12.1, run(t, f) { room(f); sofa({ me: 'sad', ml: 0.3 }); mom.userData.head.rotation.z = 0.15; const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x + 0.3, h.y + 0.05, h.z + 1.75 - prog(t, 10.49, 12.1) * 0.3], [h.x, h.y - 0.15, h.z], 1.6), ap: 0.012, fx: () => { bub(t, 10.55, 'AI, DESCULPA, ÁRVORE!\nNÃO FOI POR MAL!', { fs: 54, bg: '#ffe0ef', heart: true, tx: -50 }); } }; } },
  // 10 — game: she bows to the tree
  { a: 12.1, b: 13.82, run(t, f) { game(f); const tp = punchTree.position; gWho(momG, tp.x + 1.25, tp.z + 0.2, -Math.PI / 2, { y: tp.y, e: 'happyc' }); momG.userData.body.rotation.x = 0.55 * Math.abs(Math.sin(t * 3)); momG.userData.arms[0].rotation.set(-0.3, 0, -0.1); momG.userData.arms[1].rotation.set(-0.3, 0, 0.1);
    const a = -0.15 + prog(t, 12.1, 13.82) * 0.5; return { cam: C(G(tp.x + 0.6 + Math.sin(a) * 4.5, tp.y + 1.8, tp.z + Math.cos(a) * 4.5), G(tp.x + 0.6, tp.y + 1.4, tp.z), 4.5), ap: 0.002, fx: () => { hud(f); TAG('🙏 PERDÃO 🙏', 300, popT(t, 12.2), 120, '#ff9ec7'); const p = P(GX + tp.x, tp.y + 3, tp.z); for (let i = 0; i < 4; i++) { const u = ((t * 0.7 + i / 4) % 1); O.fillStyle = '#ff2d55'; O.globalAlpha = Math.sin(u * Math.PI); heart2(p[0] + Math.sin(i * 2) * 140, p[1] - u * 260, 26); O.globalAlpha = 1; } } }; } },
  // 11 — game: the house builds itself block by block (orbit)
  { a: 13.82, b: 15.6, run(t, f) { game(f); const k = prog(t, 13.82, 15.4); setHouse(k); gWho(momG, 3.6, HZ0 + 2.5, -0.8, { e: 'happyc' }); momG.userData.arms[1].rotation.set(-1.6 + Math.sin(t * 20) * 0.3, 0, 0.1); const a = -0.5 + k * 1.1;
    return { cam: C(G(Math.sin(a) * 11, 6.5, HZ0 + Math.cos(a) * 11), G(0, 2, HZ0), 11), ap: 0.0008, fx: () => { hud(f, { slot: 0 }); TAG('10 MINUTOS 🏠', 300, popT(t, 13.9), 116, '#ffd23f'); } }; } },
  // 12 — interior (roof off): the rug
  { a: 15.6, b: 17.0, run(t, f) { game(f); setHouse(1, 0); gWho(momG, 0.6, HZ0 + 0.4, Math.PI * 0.85, { e: 'happyc' }); const k = prog(t, 15.6, 17.0);
    return { cam: C(G(0.3 + k * 0.3, 7.2 - k * 0.6, HZ0 + 1.6), G(0, 0.2, HZ0 - 0.4), 6.6), ap: 0.002, fx: () => { hud(f, { slot: 1 }); TAG('TAPETE ✅', 300, popT(t, 15.65), 120, '#ff8fab'); } }; } },
  // 13 — interior: curtains + guest room sign
  { a: 17.0, b: 18.683, run(t, f) { game(f); setHouse(1, 0); gWho(momG, 0.5, HZ0 + 0.5, -Math.PI / 2 - 0.4, { e: 'happyc' }); momG.userData.arms[1].rotation.set(-1.5, 0, 0.3); const k = prog(t, 17.0, 18.683);
    return { cam: C(G(1.0, 5.6 - k * 0.5, HZ0 + 0.8), G(-1.2, 1.4, HZ0 - 0.4), 4.6), ap: 0.003, fx: () => { hud(f, { slot: 2 }); TAG('CORTINA ✅', 280, popT(t, 17.05), 104, '#c77dff'); TAG('QUARTO DE VISITA ✅', 420, popT(t, 17.7), 86, '#ffd23f'); } }; } },
  // 14 — time-lapse: day to night
  { a: 18.683, b: 20.3, run(t, f) { const k = prog(t, 18.683, 20.1); game(f, k > 0.55); const a = k * Math.PI; sunDiscG.visible = k < 0.6; sunDiscG.position.set(GX - 40 + Math.cos(a) * -1 * 0 + k * 80, 30 * Math.sin((1 - k) * Math.PI / 2) + 2, -60); moonDisc.visible = k > 0.4; moonDisc.position.set(GX - 30 + k * 30, 6 + k * 22, -60);
    if (k <= 0.55) { hemi.intensity = lerp(1.35, 0.6, k / 0.55); gameSun.intensity = lerp(2.4, 0.3, k / 0.55); gameSun.color.set('#ff9a5c'); } scene.fog.color.lerpColors(new THREE.Color('#ffb38a'), new THREE.Color('#1a1f5c'), k);
    return { cam: C(G(6, 3.5, HZ0 + 9), G(0, 6, HZ0 - 20), 30), ap: 0.0005, fx: () => { hud(f, { label: 'ANOITECEU 🌙' }); tint('rgba(255,120,60,A)', Math.max(0, 0.25 - k * 0.4)); TAG('🌙 NOITE', 300, popT(t, 19.4), 120, '#ffffff'); } }; } },
  // 15 — night: the first monster walks toward the house
  { a: 20.3, b: 22.154, run(t, f) { game(f, true); moonDisc.visible = true; moonDisc.position.set(GX + 8, 18, -30); const k = prog(t, 20.3, 22.154); MON.visible = true; MON.position.set(GX + 0.3, Math.abs(Math.sin(t * 9)) * 0.15, lerp(9, 1.2, k)); MON.rotation.set(0, Math.PI, Math.sin(t * 9) * 0.08); MON.userData.pupil.position.x = Math.sin(t * 3) * 0.08;
    return { cam: C(G(-2.6, 1.0, 0.5), G(0.3, 1.2, 4), 5), ap: 0.002, shake: 0.5, fx: () => { hud(f, { hearts: 10, label: 'PERIGO!' }); tint('rgba(120,0,60,A)', 0.12 + 0.08 * Math.sin(t * 8)); TAG('O 1º MONSTRO 👾', 300, popT(t, 20.4), 104, '#c77dff'); } }; } },
  // 16 — real mom, stern, finger pointing at the TV
  { a: 22.154, b: 23.8, run(t, f) { room(f, true); sofa({ me: 'stern', pad: false }); mom.userData.body.rotation.x = 0.15; mom.userData.arms[1].rotation.set(-1.75 - Math.sin(t * 9) * 0.1, 0, 0.15); mom.userData.arms[0].rotation.set(-1.0, 0, -0.5); PAD.visible = false; const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x + 0.5, h.y + 0.05, h.z + 1.9], [h.x + 0.05, h.y - 0.3, h.z], 1.9), ap: 0.009, shake: 0.4, fx: () => { bub(t, 22.2, 'Ô MOÇO! LIMPA O PÉ\nANTES DE ENTRAR\nNA MINHA CASA!', { fs: 50, tx: 60 }); } }; } },
  // 17 — game: her avatar at the door pointing; the monster freezes
  { a: 23.8, b: 25.519, run(t, f) { game(f, true); moonDisc.visible = true; moonDisc.position.set(GX - 10, 18, 20); gWho(momG, 0, HZ0 + 2.4, 0, { e: 'stern' }); momG.userData.arms[1].rotation.set(-1.7, 0, 0.1); MON.visible = true; MON.position.set(GX, 0, HZ0 + 4.0); MON.rotation.set(0, Math.PI, 0); MON.userData.pupil.position.set(0, 0, 0); MON.scale.setScalar(1 - 0.08 * ss(prog(t, 24.2, 24.6)));
    return { cam: C(G(4.6, 1.7, HZ0 + 3.4), G(0, 1.2, HZ0 + 3.2), 4.6), ap: 0.003, fx: () => { hud(f); const p = PV(wpos(MON)); TAG('!', p[1] - 380, popT(t, 24.1), 200, '#ffd23f'); } }; } },
  // 18 — and the monster... wiped its feet
  { a: 25.519, b: 27.257, run(t, f) { game(f, true); moonDisc.visible = true; moonDisc.position.set(GX - 10, 18, 20); gWho(momG, 0, HZ0 + 2.3, 0, { e: 'smug' }); momG.userData.arms[0].rotation.set(-0.2, 0, -0.9); momG.userData.arms[1].rotation.set(-0.2, 0, 0.9); MON.visible = true; MON.position.set(GX, 0, HZ0 + 3.6); MON.rotation.set(0, Math.PI, Math.sin(t * 10) * 0.07); MON.scale.setScalar(1);
    MON.userData.feet.forEach((ft, i) => (ft.position.z = 0.1 + Math.sin(t * 14 + i * Math.PI) * 0.22));
    return { cam: C(G(3.6, 1.2, HZ0 + 4.4), G(0, 0.7, HZ0 + 3.3), 3.7), ap: 0.003, fx: () => { hud(f); TAG('LIMPOU O PÉ 🧼', 300, popT(t, 25.9), 104, '#9be7ff'); TAG('FUNCIONOU?!', 450, popT(t, 26.5), 120, '#ffd23f'); } }; } },
  // 19 — the son's face lights up (TV glow)
  { a: 27.257, b: 28.4, run(t, f) { room(f, true); sofa({ se: 'happyc', me: 'happy' }); son.userData.head.rotation.y = 0.1; holdPad(son); const [h] = headCam(son, 0, 0); tvLight.color.set('#9fe8ff'); tvLight.intensity *= 0.6;
    return { cam: C([h.x + 0.25, h.y + 0.03, h.z + 1.45], [h.x, h.y - 0.1, h.z], 1.45), ap: 0.012, fx: () => { glow(W / 2, H * 0.5, 800, '94,242,255', 0.07); } }; } },
  // 20 — game: the diamond, huge and spinning
  { a: 28.4, b: 29.544, run(t, f) { game(f, true); GEM.visible = true; GEM.position.set(GX, 1.6 + Math.sin(t * 4) * 0.1, 4); GEM.rotation.y = t * 3;
    return { cam: C(G(0, 1.8, 6.4 - prog(t, 28.4, 29.544) * 0.6), G(0, 1.6, 4), 2.2), ap: 0.006, bloom: 0.9, fx: () => { hud(f, { items: ['#5ef2ff', '#e63946', '#9be7ff', '#b5835a'] }); const p = PV(GEM.position); for (let i = 0; i < 7; i++) sparkle(p[0] + Math.cos(i * 0.9 + t * 2) * 320, p[1] + Math.sin(i * 1.3 + t * 2) * 380, 30 + 16 * Math.sin(t * 6 + i), f); TAG('DIAMANTE 💎', 300, popT(t, 28.45), 120, '#5ef2ff'); } }; } },
  // 21 — mom: "guarda no pote de sorvete"
  { a: 29.544, b: 30.8, run(t, f) { room(f, true); sofa({ me: 'smug', ml: -0.5 }); mom.userData.head.rotation.y = -0.35; const [h] = headCam(mom, 0, 0); tvLight.color.set('#7fd0ff');
    return { cam: C([h.x - 0.25, h.y + 0.05, h.z + 1.7], [h.x, h.y - 0.15, h.z], 1.7), ap: 0.012, fx: () => { bub(t, 29.6, 'GUARDA NO POTE DE\nSORVETE, QUE É\nMAIS SEGURO.', { fs: 52 }); } }; } },
  // 22 — game: ice-cream tub opens, the diamond drops in
  { a: 30.8, b: 32.079, run(t, f) { game(f, true); TUB.visible = true; TUB.position.set(GX + 3.5, 0, HZ0 + 3.5); TUB.rotation.y = 0.95 + Math.PI; const op = ss(prog(t, 30.85, 31.2)) * (1 - ss(prog(t, 31.75, 31.95))); TUB.userData.lid.rotation.z = op * 1.9; GEM.visible = t < 31.75; GEM.scale.set(0.35, 0.47, 0.35); GEM.position.set(GX + 3.5, 2.4 - ss(prog(t, 31.15, 31.7)) * 1.8, HZ0 + 3.5); GEM.rotation.y = t * 5;
    return { cam: C(G(6.2, 2.6, HZ0 + 7.5), G(3.5, 1.2, HZ0 + 3.5), 4.9), ap: 0.003, shake: t > 31.95 && t < 32.05 ? 1.2 : 0, fx: () => { hud(f, { slot: 4 }); TAG('POTE DE SORVETE 🍦', 300, popT(t, 30.9), 92, '#ffffff'); if (t > 31.95) TAG('🔒 SEGURO', 440, popT(t, 31.95), 96, '#ffd23f'); } }; } },
  // 23 — the wall clock hits midnight
  { a: 32.079, b: 33.1, run(t, f) { room(f, true); sofa({ me: 'happyc' }); setClock(23, 59 + ss(prog(t, 32.2, 32.5))); const c = CLOCK.position;
    return { cam: C([c.x + 0.1, c.y - 0.05, c.z + 1.2 - prog(t, 32.079, 33.1) * 0.25], [c.x, c.y, c.z], 1.1), ap: 0.01, fx: () => { TAG('00:00 🕛', 330, popT(t, 32.45), 140, '#ff5fa2'); } }; } },
  // 24 — the son stands up, arms crossed: bedtime
  { a: 33.1, b: 34.059, run(t, f) { room(f, true); sit(mom, MX, SZ); setFace(mom, 'happyc'); holdPad(mom); show(son, RX - 1.35, 0, 0.55, Math.PI / 2 + 0.2); setFace(son, 'stern'); son.userData.arms[0].rotation.set(-1.25, 0, -0.95); son.userData.arms[1].rotation.set(-1.15, 0, 0.95); son.userData.watch.visible = false;
    return { cam: C([RX - 1.0, 1.45, 3.4], [RX - 0.7, 1.0, 0.3], 3.2), ap: 0.004, fx: () => { TAG('HORA DE DORMIR 😤', 300, popT(t, 33.15), 100, '#ffffff'); } }; } },
  // 25 — mom hugs the controller: "só mais cinco minutinhos!"
  { a: 34.059, b: 35.3, run(t, f) { room(f, true); sofa({ me: 'sad' }); mom.userData.arms[0].rotation.set(-1.5, 0, -1.0); mom.userData.arms[1].rotation.set(-1.5, 0, 1.0); const a = hand(mom, 0), b = hand(mom, 1); PAD.position.set((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2 + 0.05); PAD.rotation.set(1.3, 0, 0); mom.userData.head.rotation.z = Math.sin(t * 7) * 0.08; const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x + 0.15, h.y - 0.1, h.z + 1.9], [h.x, h.y - 0.4, h.z], 1.9), ap: 0.01, fx: () => { bub(t, 34.1, 'SÓ MAIS CINCO\nMINUTINHOS, FILHO!', { fs: 56, bg: '#ffe0ef', heart: true }); for (let i = 0; i < 2; i++) { const p = PW(mom.userData.head, 0.02); glow(p[0] + (i ? 70 : -70), p[1] - 10, 30, '255,255,255', 0.8); } } }; } },
  // 26 — the son's shock
  { a: 35.3, b: 36.315, run(t, f) { room(f, true); sit(mom, MX, SZ); holdPad(mom); show(son, RX - 0.3, 0, 0.9, 0.25); setFace(son, 'shock'); son.userData.watch.visible = false; son.userData.arms[0].rotation.set(-0.3, 0, -0.9); son.userData.arms[1].rotation.set(-0.3, 0, 0.9); const [h] = headCam(son, 0, 0);
    const z = 1 + ss(prog(t, 35.3, 35.5)) * 0.35; return { cam: C([h.x + 0.3 / z, h.y, h.z + 1.6 / z], [h.x, h.y - 0.08, h.z], 1.6 / z), ap: 0.012, shake: 0.8, fx: () => { TAG('😱', 330, popT(t, 35.35), 190, '#fff'); } }; } },
  // 27 — tug of war over the controller
  { a: 36.315, b: 37.5, run(t, f) { room(f, true); sit(mom, MX, SZ); setFace(mom, 'stern'); show(son, RX + 0.35, 0, 0.95, Math.PI); setFace(son, 'stern'); son.userData.watch.visible = false; const w = Math.sin(t * 12) * 0.12; son.position.z = 0.95 + w * 0.6;
    son.userData.arms[0].rotation.set(-1.4, 0, 0.25); son.userData.arms[1].rotation.set(-1.4, 0, -0.25); son.userData.body.rotation.x = -0.25; holdPad(mom); PAD.position.z += 0.25 + w * 0.3; PAD.rotation.set(0.2, 0, w);
    return { cam: C([RX + 2.9, 1.7, 2.6], [RX + 0.4, 0.95, 0.3], 3.4), ap: 0.004, shake: 0.6, fx: () => { const p = PV(PAD.position); dust(p[0], p[1] + 120, (t * 2) % 1, 0.6); } }; } },
  // 28 — the twist: 360 around them
  { a: 37.5, b: 38.525, run(t, f) { room(f, true); sofa({ me: 'happyc', se: 'shock' }); son.userData.head.rotation.y = 0.6; const a = -1.0 + prog(t, 37.5, 38.525) * 2.0;
    return { cam: C([RX + Math.sin(a) * 2.6, 1.5, SZ + Math.cos(a) * 2.6 + 0.2], [RX, 1.2, SZ], 2.6), ap: 0.003, fx: () => { tint('rgba(255,95,162,A)', 0.1); TAG('O JOGO', 300, popT(t, 37.55), 170, '#ffd23f'); TAG('VIROU 🔄', 480, popT(t, 37.75), 170, '#ff5fa2'); } }; } },
  // 29 — both playing together + question
  { a: 38.525, b: 99, run(t, f) { room(f, true); sofa({ me: 'happyc', se: 'happyc' }); holdPad(son); const k = prog(t, 38.525, 44);
    return { cam: C([RX + Math.sin(t * 0.5) * 0.3, 1.45 + k * 0.2, 2.6 - k * 0.4], [RX, 1.15, SZ], 2.7), ap: 0.003, fx: () => { const q = popT(t, 38.6); O.save(); O.fillStyle = 'rgba(20,8,30,.42)'; O.fillRect(0, 0, W, 720 * Math.min(1, q)); O.restore();
      TAG('SUA MÃE', 220, popT(t, 38.6), 120, '#ffffff'); TAG('JOGARIA? 🎮', 380, popT(t, 38.85), 130, '#8ce95a');
      const kk = popT(t, 39.6); if (kk > 0.01) for (const [x, txt, col] of [[W / 2 - 230, 'SIM 😂', '#ff5fa2'], [W / 2 + 230, 'NUNCA 🙅', '#3a86ff']]) { O.save(); O.translate(x, 580); O.scale(kk * (1 + Math.sin(t * 7) * 0.03), kk); O.fillStyle = col; O.strokeStyle = '#1c1222'; O.lineWidth = 10; O.beginPath(); O.roundRect(-195, -72, 390, 144, 40); O.fill(); O.stroke(); O.fillStyle = '#fff'; O.font = '900 66px Inter, Arial Black'; O.textAlign = 'center'; O.textBaseline = 'middle'; O.fillText(txt, 0, 4); O.restore(); }
      if (t > 40.2) TAG('COMENTA 👇', 740, popT(t, 40.2), 74, '#ffd23f'); } }; } },
];

function renderFrame(i) {
  const t = i / 30, f = i; reset(); PAD.visible = false;
  const sh = SH.find((s) => t >= s.a && t < s.b) || SH[SH.length - 1];
  const R = sh.run(t, f);
  let [px, py, pz] = R.cam.p; // gentle drift so nothing is ever static
  px += Math.sin(t * 1.3) * 0.015 * R.cam.d; py += Math.cos(t * 1.1) * 0.01 * R.cam.d;
  const sk = (R.shake || 0) * 0.03 * Math.max(1, R.cam.d / 6) ** 0.5; const r = rng(i * 7 + 1);
  px += (r() - 0.5) * sk; py += (r() - 0.5) * sk; pz += (r() - 0.5) * sk * 0.5;
  camera.position.set(px, py, pz); camera.lookAt(...R.cam.l); camera.rotation.z += (r() - 0.5) * sk * 0.15;
  if (ROOM.visible) { key.position.set(RX + 3, 6, 4); key.target.position.set(RX, 0, 0); } else { key.position.set(px + 6, 18, pz + 4); key.target.position.set(R.cam.l[0], 0, R.cam.l[2]); }
  key.target.updateMatrixWorld(); fill.position.set(px + 0.8, py + 1.2, pz + 0.5);
  bloom.strength = R.bloom ?? 0.45; bokeh.uniforms.focus.value = R.cam.d; bokeh.uniforms.aperture.value = R.ap ?? 0.0025;
  composer.render();
  O.globalCompositeOperation = 'source-over'; O.globalAlpha = 1; O.drawImage(renderer.domElement, 0, 0);
  // quick white pop on every cut (frame 0-1 of each shot) keeps the eye moving
  const c0 = (t - sh.a) * 30; if (c0 < 2 && sh.a > 0) flash(0.25 * (1 - c0 / 2));
  R.fx();
  const v = O.createRadialGradient(W / 2, H * 0.45, W * 0.45, W / 2, H / 2, H * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(10,0,20,.42)'); O.fillStyle = v; O.fillRect(0, 0, W, H);
  return out.toDataURL('image/jpeg', 0.9);
}
window.renderFrame = renderFrame; window.ready = true;
