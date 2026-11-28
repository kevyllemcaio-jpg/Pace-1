// 3D "E se você tivesse supervelocidade por 24 horas?" — hero ZÁS (original), night city
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const W = 1080, H = 1920, TOTAL = 1260;
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
const S = [0.06, 2.626, 7.611, 10.286, 13.97, 17.313, 20.204, 21.996, 23.821, 26.379, 30.756, 33.382, 35.274]; const VEND = 38.63;

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

// ---------- extra sets for "Minha mãe jogou Roblox" (original look: pastel toy world, no real platform assets)
// aprons (mom avatar + son as waiter), chef hat, tray
function apron(k, col = '#ffffff', trim = '#ff5fa2') {
  const g = new THREE.Group(); g.add(box(0.44, 0.5, 0.03, col, [0, 0.78, 0.245], 0.7)); g.add(box(0.44, 0.05, 0.035, trim, [0, 1.02, 0.25], 0.7)); g.add(box(0.2, 0.12, 0.04, trim, [0, 0.72, 0.265], 0.7));
  k.userData.body.add(g); g.visible = false; return g;
}
const APRON_M = apron(momG), APRON_S = apron(son, '#1c1a22', '#ffd23f');
const CHEF = new THREE.Group(); CHEF.add(M(new THREE.CylinderGeometry(0.2, 0.2, 0.22, 24), mat('#ffffff', 0.6), [0, 0.42, 0])); CHEF.add(M(new THREE.SphereGeometry(0.27, 24, 16), mat('#ffffff', 0.6), [0, 0.6, 0])); CHEF.position.y = 0.05; momG.userData.head.add(CHEF); CHEF.visible = false;
const TRAY = new THREE.Group(); scene.add(TRAY);
{ TRAY.add(M(new THREE.CylinderGeometry(0.32, 0.32, 0.03, 30), mat('#c0c4cc', 0.25, { metalness: 0.7 }))); TRAY.add(M(new THREE.CylinderGeometry(0.16, 0.16, 0.02, 24), mat('#ffffff', 0.4), [0, 0.03, 0])); const d = M(new THREE.SphereGeometry(0.12, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat('#ffb703', 0.5), [0, 0.04, 0]); TRAY.add(d); }

// STUDIO (avatar editor + shop): turntable in a soft gradient dome at x = GX - 80
const SX0 = GX - 80;
const STUDIO = new THREE.Group(); STUDIO.position.x = SX0; scene.add(STUDIO);
{
  const bg = tex(64, 512, (g) => { const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#7b61ff'); gr.addColorStop(0.6, '#b8a7ff'); gr.addColorStop(1, '#ffd6f5'); g.fillStyle = gr; g.fillRect(0, 0, 64, 512); });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 20), new THREE.MeshBasicMaterial({ map: bg, side: THREE.BackSide })); STUDIO.add(dome);
  const fl = M(new THREE.CircleGeometry(30, 48), mat('#d9ccff', 0.8)); fl.rotation.x = -Math.PI / 2; STUDIO.add(fl);
}
const TURN = new THREE.Group(); STUDIO.add(TURN);
TURN.add(M(new THREE.CylinderGeometry(0.6, 0.65, 0.15, 48), mat('#ffffff', 0.35), [0, 0.075, 0])); TURN.add(M(new THREE.TorusGeometry(0.62, 0.03, 8, 48), mat('#5ef2ff', 0.2, { emissive: '#5ef2ff', emissiveIntensity: 1.5 }), [0, 0.15, 0])).rotation.x = Math.PI / 2;
const HAT = new THREE.Group(); STUDIO.add(HAT); HAT.position.set(0, 1.8, 0);
{ const gold = mat('#ffc300', 0.2, { metalness: 0.9, emissive: '#7a5200', emissiveIntensity: 0.4 }); HAT.add(M(new THREE.CylinderGeometry(0.75, 0.75, 0.06, 40), gold)); HAT.add(M(new THREE.CylinderGeometry(0.45, 0.5, 0.75, 40), gold, [0, 0.4, 0])); HAT.add(M(new THREE.CylinderGeometry(0.505, 0.505, 0.14, 40), mat('#e63946', 0.4), [0, 0.12, 0])); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; HAT.add(M(new THREE.OctahedronGeometry(0.07), mat('#5ef2ff', 0.1, { emissive: '#29c4ff', emissiveIntensity: 1 }), [Math.sin(a) * 0.51, 0.12, Math.cos(a) * 0.51])); } }
const studioLight = new THREE.SpotLight('#ffffff', 0, 20, 0.6, 0.5, 1.2); studioLight.position.set(SX0 + 2, 6, 4); studioLight.target.position.set(SX0, 1, 0); scene.add(studioLight); scene.add(studioLight.target);

// OBBY: floating platforms over lava at x = GX + 70
const OX0 = GX + 70;
const OBBY = new THREE.Group(); OBBY.position.x = OX0; scene.add(OBBY);
const LAVA_C = document.createElement('canvas'); LAVA_C.width = LAVA_C.height = 256; const LG = LAVA_C.getContext('2d');
{ const r = rng(77); LG.fillStyle = '#ff5400'; LG.fillRect(0, 0, 256, 256); for (let i = 0; i < 90; i++) { const x = r() * 256, y = r() * 256, rr = 8 + r() * 26; const g = LG.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, r() < 0.5 ? '#ffd23f' : '#ff9e00'); g.addColorStop(1, 'rgba(255,84,0,0)'); LG.fillStyle = g; LG.beginPath(); LG.arc(x, y, rr, 0, 7); LG.fill(); } }
const LAVA_T = new THREE.CanvasTexture(LAVA_C); LAVA_T.colorSpace = THREE.SRGBColorSpace; LAVA_T.wrapS = LAVA_T.wrapT = THREE.RepeatWrapping; LAVA_T.repeat.set(10, 10);
const lava = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ map: LAVA_T, emissiveMap: LAVA_T, emissive: '#ffffff', emissiveIntensity: 0.9, roughness: 0.6 })); lava.rotation.x = -Math.PI / 2; lava.position.z = -10; OBBY.add(lava);
const PLAT = []; { const cols = ['#ff5fa2', '#5ef2ff', '#8ce95a', '#ffd23f', '#9b5de5', '#ff8fab', '#3a86ff', '#ffffff']; for (let i = 0; i < 9; i++) { const h = [1.0, 1.6, 1.2, 2.0, 1.4, 2.2, 1.6, 2.4, 1.8][i]; const x = Math.sin(i * 1.3) * 1.4; const p = box(i === 0 ? 3 : 1.6, 0.4, i === 0 ? 3 : 1.6, cols[i % cols.length], [x, h, -i * 3.2], 0.4); OBBY.add(p); PLAT.push([OX0 + x, h + 0.2, -i * 3.2]); } }
const obbySky = tex(64, 1024, (g) => { const gr = g.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, '#3a0ca3'); gr.addColorStop(0.6, '#f72585'); gr.addColorStop(1, '#ffb703'); g.fillStyle = gr; g.fillRect(0, 0, 64, 1024); });
const lavaLight = new THREE.PointLight('#ff6a00', 0, 30, 1.2); scene.add(lavaLight);
function jumpPos(u) { const i = Math.min(PLAT.length - 2, Math.floor(u)), fr = u - i; const a = PLAT[i], b = PLAT[i + 1]; return [lerp(a[0], b[0], fr), lerp(a[1], b[1], fr) + Math.sin(fr * Math.PI) * 1.4, lerp(a[2], b[2], fr)]; }

// RESTAURANT: sign + tables + queue of customers in front of the house (GAME coords)
const REST = new THREE.Group(); GAME.add(REST);
{
  const st = tex(512, 128, (g) => { g.fillStyle = '#e63946'; g.beginPath(); g.roundRect(0, 0, 512, 128, 30); g.fill(); g.strokeStyle = '#ffd23f'; g.lineWidth = 10; g.beginPath(); g.roundRect(6, 6, 500, 116, 26); g.stroke(); g.fillStyle = '#ffffff'; g.font = '900 52px Arial Black, Arial'; g.textAlign = 'center'; g.fillText('RESTAURANTE', 256, 62); g.fillStyle = '#ffd23f'; g.font = '900 38px Arial Black, Arial'; g.fillText('DA MÃE ❤', 256, 106); });
  const s = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.05), new THREE.MeshStandardMaterial({ map: st, emissive: '#ffffff', emissiveMap: st, emissiveIntensity: 0.35 })); s.position.set(0, 3.6, HZ0 + 2.56); REST.add(s);
  const numT = (n) => tex(128, 128, (g) => { g.fillStyle = '#ffffff'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); g.fillStyle = '#e63946'; g.font = '900 80px Arial Black, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), 64, 70); });
  [[-4.2, HZ0 + 5, 3], [4.2, HZ0 + 5, 4], [-4.2, HZ0 + 9, 5], [4.2, HZ0 + 9, 6]].forEach(([x, z, n]) => {
    REST.add(M(new THREE.CylinderGeometry(0.75, 0.75, 0.08, 28), mat('#ffffff', 0.5), [x, 0.8, z])); REST.add(M(new THREE.CylinderGeometry(0.08, 0.1, 0.8, 12), mat('#555'), [x, 0.4, z]));
    REST.add(M(new THREE.ConeGeometry(1.4, 0.6, 16, 1, true), mat(n % 2 ? '#ff5fa2' : '#5ef2ff', 0.6, { side: THREE.DoubleSide }), [x, 2.4, z])); REST.add(M(new THREE.CylinderGeometry(0.03, 0.03, 1.7, 8), mat('#555'), [x, 1.55, z]));
    const nb = new THREE.Mesh(new THREE.CircleGeometry(0.28, 24), new THREE.MeshBasicMaterial({ map: numT(n) })); nb.position.set(x, 1.5, z + 0.05); REST.add(nb); if (n === 5) window.T5 = [x, z];
  });
}
const NPC_O = [
  { skin: '#f1c27d', hair: '#2b1d14', style: 'short', top: '#ff595e', legs: '#264653', shoes: '#fff', hands: '#f1c27d' },
  { skin: '#8d5524', hair: '#1b1b1b', style: 'pony', top: '#8ac926', legs: '#3d405b', shoes: '#fff', hands: '#8d5524' },
  { skin: '#ffdbac', hair: '#d4a373', style: 'bob', top: '#1982c4', legs: '#2b2d42', shoes: '#ffd23f', hands: '#ffdbac' },
  { skin: '#c68642', hair: '#3b2416', style: 'short', top: '#ffca3a', legs: '#6a4c93', shoes: '#fff', hands: '#c68642' },
  { skin: '#e0ac69', hair: '#000000', style: 'buns', top: '#ff8fab', legs: '#22223b', shoes: '#fff', hands: '#e0ac69' },
  { skin: '#ffdbac', hair: '#7f4f24', style: 'short', top: '#4cc9f0', legs: '#3a0ca3', shoes: '#ff5fa2', hands: '#ffdbac' },
  { skin: '#8d5524', hair: '#2b1d14', style: 'long', top: '#f15bb5', legs: '#264653', shoes: '#fff', hands: '#8d5524' },
];
const NPCS = NPC_O.map((o) => { const k = kid(o); k.userData.sc = 0.9; scene.add(k); return k; });
const noobKid = NPCS[0];

// ---- 2D UI: chat box, avatar editor panel, shop panel
function chat(lines, k = 1) {
  if (k <= 0.01) return; O.save(); O.globalAlpha = Math.min(1, k); const x = 60, y = 150, w = W - 120, lh = 64, h = 40 + lines.length * lh;
  O.fillStyle = 'rgba(20,10,40,.72)'; O.beginPath(); O.roundRect(x, y, w, h, 28); O.fill(); O.strokeStyle = 'rgba(255,255,255,.6)'; O.lineWidth = 4; O.stroke();
  O.font = '900 40px Inter, Arial Black'; O.textBaseline = 'middle';
  lines.forEach(([name, col, txt], i) => { const yy = y + 40 + i * lh; let xx = x + 30; if (name) { O.fillStyle = col; O.fillText(name + ':', xx, yy); xx += O.measureText(name + ': ').width; } O.fillStyle = name ? '#ffffff' : '#ffd23f'; O.font = name ? '700 40px Inter, Arial' : 'italic 700 38px Inter, Arial'; O.fillText(txt, xx, yy); O.font = '900 40px Inter, Arial Black'; });
  O.restore();
}
function editorUI(t, sel) {
  O.save(); O.fillStyle = 'rgba(255,255,255,.92)'; O.beginPath(); O.roundRect(40, 150, W - 80, 120, 40); O.fill();
  ['CABELO', 'ROUPA', 'ACESSÓRIO'].forEach((s, i) => { const x = 80 + i * 320; O.fillStyle = i === sel ? '#7b61ff' : '#e9e4ff'; O.beginPath(); O.roundRect(x, 175, 280, 70, 35); O.fill(); O.fillStyle = i === sel ? '#fff' : '#4a3aa8'; O.font = '900 38px Inter, Arial Black'; O.textAlign = 'center'; O.textBaseline = 'middle'; O.fillText(s, x + 140, 212); });
  const cols = ['#9b5de5', '#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#f15bb5']; cols.forEach((c, i) => { const x = 110 + i * 172, y = 1640; O.fillStyle = c; O.beginPath(); O.roundRect(x - 60, y - 60, 120, 120, 30); O.fill(); if (i === Math.floor(t * 6) % 6) { O.strokeStyle = '#ffffff'; O.lineWidth = 10; O.stroke(); } });
  O.restore();
}
function shopUI(k, t) {
  if (k <= 0.01) return; O.save(); O.translate(W / 2, 1060); O.scale(k, k); O.fillStyle = 'rgba(255,255,255,.95)'; O.beginPath(); O.roundRect(-420, -150, 840, 300, 50); O.fill(); O.strokeStyle = '#ffc300'; O.lineWidth = 10; O.stroke();
  O.fillStyle = '#2a1046'; O.font = '900 52px Inter, Arial Black'; O.textAlign = 'center'; O.textBaseline = 'middle'; O.fillText('CHAPÉU LENDÁRIO 👑', 0, -80);
  O.fillStyle = '#16a34a'; O.beginPath(); O.roundRect(-300, -10, 600, 120, 60); O.fill(); O.fillStyle = '#ffffff'; O.font = '900 72px Inter, Arial Black'; O.fillText('R$ 800,00', 0, 52); O.restore();
}

// ---------- shots (t in seconds; frames at 30 fps)
const C = (p, l, d) => ({ p, l, d });
const G = (x, y, z) => [GX + x, y, z];
const MX = RX + 0.55, SXp = RX - 0.55, SZ = -0.12;
const TAG = (txt, y, k, size = 120, col = '#ffffff') => titleLine(txt, y, k, size, col);
const popT = (t, a, d = 0.25) => backOut(clamp((t - a) / d));
function reset() {
  for (const o of BASE) o.visible = false;
  for (const o of [ROOM, GAME, TV, CLOCK, mom, momG, son, PAD, MON, GEM, TUB, moonDisc, sunDiscG, DECOR, doormat, STUDIO, OBBY, REST, TRAY, ...NPCS]) o.visible = false;
  APRON_M.visible = APRON_S.visible = CHEF.visible = false; lavaLight.intensity = 0; studioLight.intensity = 0; topCol(momG, '#9b5de5'); HAT.visible = false; TURN.visible = false;
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


function topCol(k, c) { const b = k.userData.body.children; for (const i of [2, 3]) b[i].material.color.set(c); for (const a of k.userData.arms) a.children[0].material.color.set(c); }
function studio(f) { STUDIO.visible = true; scene.background = new THREE.Color('#b8a7ff'); hemi.color.set('#ffffff'); hemi.groundColor.set('#b8a7ff'); hemi.intensity = 0.85; studioLight.intensity = 14; key.intensity = 0.6; scene.fog.near = 60; scene.fog.far = 200; }
function obby(f, t) { OBBY.visible = true; scene.background = obbySky; scene.fog.color.set('#f25c8a'); scene.fog.near = 20; scene.fog.far = 70; hemi.color.set('#ffd6a8'); hemi.groundColor.set('#ff5400'); hemi.intensity = 1.0; key.intensity = 1.2; key.color.set('#ffe0c0'); LAVA_T.offset.set(t * 0.03, t * 0.015); }
function npcLine(n, x0, z0, dz, f, face = 'happy') { for (let i = 0; i < n; i++) { const k = NPCS[i]; show(k, GX + x0 + Math.sin(i * 1.7) * 0.25, 0, z0 + i * dz, Math.PI + Math.sin(i) * 0.3); k.scale.setScalar(0.9); setFace(k, i % 3 === 0 ? 'happyc' : face); k.userData.head.rotation.z = Math.sin(f * 0.15 + i) * 0.08; k.position.y = Math.abs(Math.sin(f * 0.2 + i * 1.3)) * 0.06; } }
function restaurant(f, t) { game(f); REST.visible = true; DECOR.visible = false; }
const SH = [
  // 1 — hook: mom close, headset
  { a: 0, b: 1.4, run(t, f) { room(f); sofa({ me: 'stern' }); mom.userData.head.rotation.set(0.05, 0, Math.sin(t * 6) * 0.04); const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x + 0.1, h.y + 0.02, h.z + 1.75 - t * 0.2], [h.x, h.y - 0.12, h.z], 1.7), ap: 0.012, fx: () => { glow(W / 2, H * 0.55, 700, '127,208,255', 0.18); TAG('MINHA MÃE', 300, popT(t, 0.05), 140, '#ffd23f'); TAG('NO ROBLOX?! 🎮', 460, popT(t, 0.55), 96, '#ff5fa2'); } }; } },
  // 2 — sofa two-shot
  { a: 1.4, b: 2.626, run(t, f) { room(f); sofa({ me: 'stern', se: 'happy', sl: 0.6 }); const k = prog(t, 1.4, 2.626);
    return { cam: C([RX - 0.3 + k * 0.5, 1.55, 3.5 - k * 0.3], [RX, 1.15, SZ], 3.5), ap: 0.004, fx: () => { TAG('1ª VEZ 🎮', 300, popT(t, 1.45), 130, '#8ce95a'); } }; } },
  // 3 — avatar editor: outfit colour cycling fast
  { a: 2.626, b: 4.0, run(t, f) { studio(f); const c = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#f15bb5', '#9b5de5'][Math.floor(t * 6) % 6]; gWho(momG, -80, 0, t * 2.2, { y: 0, e: 'happy' }); topCol(momG, c);
    return { cam: C([SX0 + 0.3, 1.4, 4.6], [SX0, 1.0, 0], 4.6), ap: 0.003, fx: () => { editorUI(t, 1); TAG('20 MINUTOS ⏳', 360, popT(t, 2.7), 110, '#ffffff'); } }; } },
  // 4 — real mom concentrating
  { a: 4.0, b: 5.5, run(t, f) { room(f); sofa({ me: 'stern', ml: Math.sin(t * 3) * 0.4 }); mom.userData.body.rotation.x = 0.12; const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x - 0.4, h.y - 0.05, h.z + 1.7 - prog(t, 4, 5.5) * 0.3], [h.x, h.y - 0.2, h.z], 1.7), ap: 0.01, fx: () => { TAG('🧐', 330, popT(t, 4.1), 170, '#fff'); } }; } },
  // 5 — the avatar is HER, apron included
  { a: 5.5, b: 7.611, run(t, f) { studio(f); gWho(momG, -80, 0, Math.sin(t * 1.5) * 0.5, { y: 0, e: 'happyc' }); APRON_M.visible = true; momG.userData.arms[1].rotation.set(-0.3, 0, 0.9 + Math.sin(t * 8) * 0.2); const k = prog(t, 5.5, 7.611);
    return { cam: C([SX0 + 0.2, 1.45 - k * 0.1, 4.2 - k * 0.8], [SX0, 1.15, 0], 4.2 - k * 0.8), ap: 0.004, fx: () => { const p = P(SX0, 1.3, 0); for (let i = 0; i < 7; i++) sparkle(p[0] + Math.cos(i * 0.9 + t * 2) * 340, p[1] + Math.sin(i * 1.3 + t * 2) * 420, 26 + 14 * Math.sin(t * 6 + i), f); TAG('IGUALZINHA 😂', 300, popT(t, 5.6), 116, '#ffd23f'); TAG('ATÉ O AVENTAL', 450, popT(t, 6.4), 96, '#ffffff'); } }; } },
  // 6 — obby: jumping across platforms over lava
  { a: 7.611, b: 8.9, run(t, f) { obby(f, t); const u = (t - 7.611) * 1.4; const [x, y, z] = jumpPos(u); show(momG, x, y, z, Math.PI); momG.scale.setScalar(1); setFace(momG, 'shock'); runPose(momG, f * 0.4, 1, 0.2); lavaLight.position.set(x, 2, z + 2); lavaLight.intensity = 25;
    return { cam: C([x + 3.2, y + 2.2, z + 4.5], [x, y + 0.5, z - 2], 6), ap: 0.001, fx: () => { hud(f, { label: 'PARKOUR 🔥', items: ['#ff5fa2', '#5ef2ff'] }); TAG('PARKOUR 🔥', 330, popT(t, 7.7), 120, '#ffb703'); embers(f, 0.6, 6); } }; } },
  // 7 — she falls into the lava, counter climbs
  { a: 8.9, b: 10.286, run(t, f) { obby(f, t); const k = prog(t, 8.9, 9.6); const [x0, y0, z0] = PLAT[2]; const x = x0 + 1.2, y = lerp(y0 + 1.5, -1.6, k * k), z = z0 - 1.6; show(momG, x, y, z, Math.PI * 0.8); momG.rotation.z = k * 1.2; setFace(momG, 'shock'); for (const a of momG.userData.arms) a.rotation.set(-2.8, 0, 0); lavaLight.position.set(x, 2, z + 2); lavaLight.intensity = 30;
    const n = Math.min(10, 1 + Math.floor(prog(t, 9.5, 10.25) * 10)); return { cam: C([x + 2.8, 2.6, z + 4.8], [x, Math.max(0.3, y * 0.6), z], 5), ap: 0.002, shake: k >= 1 ? 1.0 : 0.2, fx: () => { hud(f, { label: 'PARKOUR 🔥', hearts: Math.max(0, 10 - n) }); if (k >= 1) { const p = P(x, 0, z); ringFx(p[0], p[1], prog(t, 9.6, 10.0), '255,180,0', 600); tint('rgba(255,60,0,A)', 0.25); } if (t > 9.5) TAG('x' + n, 420, 1 + 0.15 * Math.sin(t * 30), 200, '#ff595e'); embers(f, 0.8, 7); } }; } },
  // 8 — real mom, outraged
  { a: 10.286, b: 12.0, run(t, f) { room(f); sofa({ me: 'stern', pad: false }); mom.userData.arms[0].rotation.set(-1.3, 0, -0.9 - Math.sin(t * 10) * 0.2); mom.userData.arms[1].rotation.set(-1.3, 0, 0.9 + Math.sin(t * 10) * 0.2); mom.userData.body.rotation.x = 0.12; const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x + 0.3, h.y + 0.05, h.z + 1.85], [h.x, h.y - 0.3, h.z], 1.85), ap: 0.009, shake: 0.4, fx: () => { bub(t, 10.33, 'QUEM BOTOU LAVA\nNO MEIO DO CAMINHO?\nISSO É PERIGOSO!', { fs: 50, tx: 50 }); } }; } },
  // 9 — game: respawn... and down again
  { a: 12.0, b: 13.97, run(t, f) { obby(f, t); const tt = (t - 12.0) % 0.9; const [x0, y0, z0] = PLAT[0]; const y = tt < 0.45 ? y0 + Math.sin(tt / 0.45 * Math.PI) * 1.4 : lerp(y0, -1.6, (tt - 0.45) / 0.45); show(momG, x0 + (tt < 0.45 ? tt * 3 : 1.4 + (tt - 0.45)), y, z0 - tt * 2, Math.PI); setFace(momG, 'stern'); for (const a of momG.userData.arms) a.rotation.set(-2.6, 0, 0); lavaLight.position.set(x0, 2, z0 + 2); lavaLight.intensity = 30;
    return { cam: C([x0 + 4.5, 3.2, z0 + 5], [x0 + 1, 1, z0 - 1.5], 6), ap: 0.001, fx: () => { hud(f, { label: 'PARKOUR 🔥', hearts: 0 }); TAG('DE NOVO 🔥', 330, popT(t, 12.05), 120, '#ffb703'); embers(f, 0.8, 8); } }; } },
  // 10 — chat: a kid calls her "noob"
  { a: 13.97, b: 15.6, run(t, f) { game(f); gWho(momG, 1.0, 8, Math.PI, { e: 'happy' }); show(noobKid, GX - 1.2, 0, 7.2, 0.6); noobKid.scale.setScalar(0.9); setFace(noobKid, 'smug'); noobKid.userData.arms[1].rotation.set(-1.4, 0, 0.2); APRON_M.visible = true;
    return { cam: C(G(0.0, 1.9, 12.6), G(-0.1, 1.1, 7.6), 5), ap: 0.002, fx: () => { hud(f, { cross: false }); chat([['PedroGamer07', '#4cc9f0', 'noob kkkkk']], popT(t, 14.4)); } }; } },
  // 11 — son covers his face
  { a: 15.6, b: 17.313, run(t, f) { room(f); sofa({ se: 'worry', me: 'smug', ml: -0.4 }); son.userData.arms[0].rotation.set(-2.5, 0, 0.35); son.userData.arms[1].rotation.set(-2.5, 0, -0.35); const [h] = headCam(son, 0, 0);
    return { cam: C([h.x - 0.3, h.y, h.z + 1.6], [h.x, h.y - 0.1, h.z], 1.6), ap: 0.011, fx: () => { TAG('ELA RESPONDEU... 😬', 330, popT(t, 16.4), 92, '#ffffff'); } }; } },
  // 12 — she types it in the chat
  { a: 17.313, b: 18.8, run(t, f) { game(f); gWho(momG, 1.0, 8, Math.PI - 0.6, { e: 'smug' }); APRON_M.visible = true; momG.userData.arms[1].rotation.set(-1.6, 0, 0.1); show(noobKid, GX - 1.2, 0, 7.2, 0.6); noobKid.scale.setScalar(0.9); setFace(noobKid, 'flat');
    const msg = 'Noob é você. Já fez a lição de casa?'; const n = Math.floor(prog(t, 17.35, 18.6) * msg.length);
    return { cam: C(G(1.6, 1.9, 10.6), G(0.6, 1.4, 8), 2.8), ap: 0.004, fx: () => { hud(f, { cross: false }); chat([['PedroGamer07', '#4cc9f0', 'noob kkkkk'], ['MÃE', '#ff5fa2', msg.slice(0, n) + (Math.floor(f / 6) % 2 ? '|' : '')]], 1); } }; } },
  // 13 — real mom: smug
  { a: 18.8, b: 20.204, run(t, f) { room(f); sofa({ me: 'smug', ml: -0.5 }); mom.userData.head.rotation.set(-0.1, -0.3, 0.12); const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x - 0.3, h.y + 0.05, h.z + 1.7 - prog(t, 18.8, 20.2) * 0.3], [h.x, h.y - 0.15, h.z], 1.7), ap: 0.012, fx: () => { const p = PW(mom.userData.head, 0.05); sparkle(p[0] - 150, p[1] - 30, 40, f); TAG('😎', 330, popT(t, 18.9), 170, '#fff'); } }; } },
  // 14 — the kid leaves the game
  { a: 20.204, b: 21.996, run(t, f) { game(f); const k = prog(t, 20.7, 21.0); gWho(momG, 1.0, 8, Math.PI - 0.6, { e: 'happyc' }); APRON_M.visible = true; if (k < 1) { show(noobKid, GX - 1.2, 0, 7.2, 0.6); noobKid.scale.setScalar(0.9 * (1 - k)); setFace(noobKid, 'shock'); }
    return { cam: C(G(0.6, 1.6, 11.2), G(-0.6, 1.0, 7.4), 3.9), ap: 0.003, fx: () => { hud(f, { cross: false }); const p = P(GX - 1.2, 1.0, 7.2); if (t > 20.7) ringFx(p[0], p[1], prog(t, 20.7, 21.2), '255,255,255', 420); chat([['PedroGamer07', '#4cc9f0', 'noob kkkkk'], ['MÃE', '#ff5fa2', 'Noob é você. Já fez a lição de casa?'], ...(t > 20.8 ? [[null, '', 'PedroGamer07 saiu do jogo.']] : [])], 1); if (t > 20.9) TAG('SAIU 🏃💨', 1100, popT(t, 20.9), 110, '#ffd23f'); } }; } },
  // 15 — the shop: a legendary hat
  { a: 21.996, b: 23.821, run(t, f) { studio(f); HAT.visible = true; HAT.rotation.y = t * 1.6; HAT.position.y = 1.8 + Math.sin(t * 3) * 0.08;
    return { cam: C([SX0, 2.0, 3.2 - prog(t, 22, 23.8) * 0.5], [SX0, 1.95, 0], 3), ap: 0.004, bloom: 0.7, fx: () => { const p = P(SX0, 2.1, 0); for (let i = 0; i < 6; i++) sparkle(p[0] + Math.cos(i + t * 2) * 300, p[1] + Math.sin(i * 1.4 + t * 2) * 260, 28, f); shopUI(popT(t, 22.4), t); TAG('LOJA 🛒', 330, popT(t, 22.05), 120, '#ffffff'); } }; } },
  // 16 — mom's shock
  { a: 23.821, b: 25.1, run(t, f) { room(f); sofa({ me: 'shock' }); mom.userData.head.rotation.x = -0.1; const [h] = headCam(mom, 0, 0); const z = 1 + ss(prog(t, 23.82, 24.0)) * 0.15;
    return { cam: C([h.x + 0.1, h.y, h.z + 1.7 / z], [h.x, h.y - 0.1, h.z], 1.7 / z), ap: 0.012, shake: 0.9, fx: () => { bub(t, 23.85, '800 REAIS NUM\nCHAPÉU QUE NEM\nEXISTE?!', { fs: 54, tx: -40 }); } }; } },
  // 17 — the shop closes with a big X
  { a: 25.1, b: 26.379, run(t, f) { studio(f); HAT.visible = true; HAT.rotation.y = t * 0.4; const k = prog(t, 25.15, 25.4);
    return { cam: C([SX0, 2.0, 2.7], [SX0, 1.95, 0], 2.7), ap: 0.004, fx: () => { shopUI(1, t); O.save(); O.translate(W / 2, 760); O.scale(backOut(k), backOut(k)); O.strokeStyle = '#ff2d55'; O.lineWidth = 46; O.lineCap = 'round'; O.beginPath(); O.moveTo(-260, -260); O.lineTo(260, 260); O.moveTo(260, -260); O.lineTo(-260, 260); O.stroke(); O.restore(); TAG('NEM PENSAR 🙅', 330, popT(t, 25.5), 116, '#ffffff'); } }; } },
  // 18 — one week later: the restaurant
  { a: 26.379, b: 27.9, run(t, f) { restaurant(f, t); const k = prog(t, 26.38, 27.9); npcLine(4, 0, HZ0 + 4.4, 1.3, f);
    return { cam: C(G(Math.sin(-0.5 + k * 0.5) * 15, 6.5 - k * 1.5, HZ0 + 15), G(0, 2.2, HZ0 + 2), 14), ap: 0.0008, fx: () => { hud(f, { cross: false }); TAG('1 SEMANA DEPOIS', 330, popT(t, 26.42), 100, '#ffffff'); } }; } },
  // 19 — the queue at the door
  { a: 27.9, b: 29.3, run(t, f) { restaurant(f, t); npcLine(7, 0, HZ0 + 3.8, 1.2, f, 'happy');
    return { cam: C(G(2.6, 1.3, HZ0 + 13), G(0, 1.4, HZ0 + 5), 6), ap: 0.003, fx: () => { hud(f, { cross: false }); TAG('FILA NA PORTA 😱', 330, popT(t, 27.95), 104, '#ffd23f'); } }; } },
  // 20 — mom-avatar, chef hat, boss at the door
  { a: 29.3, b: 30.756, run(t, f) { restaurant(f, t); gWho(momG, 0, HZ0 + 2.9, 0, { e: 'smug' }); APRON_M.visible = true; CHEF.visible = true; momG.userData.arms[0].rotation.set(-0.2, 0, -0.9); momG.userData.arms[1].rotation.set(-0.2, 0, 0.9); npcLine(3, 0, HZ0 + 4.4, 1.2, f);
    return { cam: C(G(1.3, 1.5, HZ0 + 5.6), G(0, 1.7, HZ0 + 2.9), 2.8), ap: 0.006, fx: () => { hud(f, { cross: false }); TAG('A DONA 👩‍🍳', 330, popT(t, 29.35), 116, '#ff5fa2'); } }; } },
  // 21 — real mom: "Filho! Mesa cinco! Anda!"
  { a: 30.756, b: 32.0, run(t, f) { room(f); sofa({ me: 'stern', pad: false }); mom.userData.body.rotation.x = 0.15; mom.userData.head.rotation.y = -0.5; mom.userData.arms[0].rotation.set(-1.75 - Math.sin(t * 12) * 0.12, 0, -0.5); mom.userData.arms[1].rotation.set(-1.0, 0, 0.5); const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x - 0.5, h.y + 0.05, h.z + 1.85], [h.x - 0.05, h.y - 0.3, h.z], 1.85), ap: 0.009, shake: 0.6, fx: () => { bub(t, 30.8, 'FILHO! MESA CINCO!\nANDA!', { fs: 60, tx: -60 }); } }; } },
  // 22 — the son's avatar runs with the tray
  { a: 32.0, b: 33.382, run(t, f) { restaurant(f, t); const [tx, tz] = window.T5; const k = prog(t, 32.0, 33.3); const x = lerp(0, tx + 0.9, k), z = lerp(HZ0 + 3.0, tz - 0.2, k); placeK(son, { x: GX + x, z, ry: Math.atan2(tx + 0.9, tz - HZ0 - 3.2), ph: f * 0.55, amt: 1, lean: 0.3 }); son.scale.setScalar(0.95); setFace(son, 'worry'); APRON_S.visible = true; son.userData.watch.visible = false;
    son.userData.arms[1].rotation.set(-1.6, 0, 0.2); const hp = hand(son, 1); TRAY.visible = true; TRAY.position.set(hp.x, hp.y + 0.1, hp.z); npcLine(2, -4.2 + 1.2, tz + 0.4, 0, f); NPCS[1].position.x = GX + tx - 1.0;
    return { cam: C(G(x + 2.5, 1.8, z + 3.6), G(x, 1.0, z), 4.4), ap: 0.003, fx: () => { hud(f, { cross: false }); const p = PW(son.userData.head, 0.2); sweat(p[0], p[1], 2, f); TAG('MESA 5 🏃', 330, popT(t, 32.05), 120, '#ffd23f'); } }; } },
  // 23 — delivered: the son bows, tray on the table
  { a: 33.382, b: 34.3, run(t, f) { restaurant(f, t); const [tx, tz] = window.T5; show(son, GX + tx + 0.95, 0, tz + 0.1, -Math.PI / 2); son.scale.setScalar(0.95); setFace(son, 'flat'); APRON_S.visible = true; son.userData.watch.visible = false; son.userData.body.rotation.x = 0.35; TRAY.visible = true; TRAY.position.set(GX + tx, 0.86, tz);
    show(NPCS[1], GX + tx - 1.0, 0, tz, Math.PI / 2); NPCS[1].scale.setScalar(0.9); setFace(NPCS[1], 'happyc');
    return { cam: C(G(tx + 2.8, 1.6, tz + 2.4), G(tx + 0.3, 1.0, tz), 3.4), ap: 0.004, fx: () => { hud(f, { cross: false }); TAG('GARÇOM 🍽️', 330, popT(t, 33.42), 120, '#ffffff'); } }; } },
  // 24 — real son: flat face
  { a: 34.3, b: 35.274, run(t, f) { room(f); sofa({ se: 'flat', sl: 0.9, me: 'happyc' }); holdPad(mom); son.userData.head.rotation.y = 0.5; const [h] = headCam(son, 0, 0);
    return { cam: C([h.x - 0.35, h.y, h.z + 1.5], [h.x, h.y - 0.1, h.z], 1.5), ap: 0.012, fx: () => { TAG('DA MINHA PRÓPRIA MÃE 😐', 330, popT(t, 34.35), 74, '#ffd23f'); } }; } },
  // 25 — both on the sofa + question
  { a: 35.274, b: 99, run(t, f) { room(f); sofa({ me: 'happyc', se: 'flat' }); holdPad(mom); const k = prog(t, 35.27, 42);
    return { cam: C([RX + Math.sin(t * 0.5) * 0.3, 1.45 + k * 0.2, 2.6 - k * 0.4], [RX, 1.15, SZ], 2.7), ap: 0.003, fx: () => { const q = popT(t, 35.3); O.save(); O.fillStyle = 'rgba(20,8,30,.42)'; O.fillRect(0, 0, W, 720 * Math.min(1, q)); O.restore();
      TAG('SUA MÃE', 220, popT(t, 35.3), 120, '#ffffff'); TAG('DOMINARIA? 👑', 380, popT(t, 35.6), 124, '#ffd23f');
      const kk = popT(t, 36.4); if (kk > 0.01) for (const [x, txt, col] of [[W / 2 - 230, 'SIM 😂', '#ff5fa2'], [W / 2 + 230, 'NUNCA 🙅', '#3a86ff']]) { O.save(); O.translate(x, 580); O.scale(kk * (1 + Math.sin(t * 7) * 0.03), kk); O.fillStyle = col; O.strokeStyle = '#1c1222'; O.lineWidth = 10; O.beginPath(); O.roundRect(-195, -72, 390, 144, 40); O.fill(); O.stroke(); O.fillStyle = '#fff'; O.font = '900 66px Inter, Arial Black'; O.textAlign = 'center'; O.textBaseline = 'middle'; O.fillText(txt, 0, 4); O.restore(); }
      if (t > 37.0) TAG('COMENTA 👇', 740, popT(t, 37.0), 74, '#ffd23f'); } }; } },
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
