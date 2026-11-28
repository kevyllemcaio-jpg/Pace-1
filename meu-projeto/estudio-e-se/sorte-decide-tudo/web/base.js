// 3D "E se sua sorte decidisse tudo?" — RPG world, original characters
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const W = 1080, H = 1920;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
renderer.setSize(W, H); renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, W / H, 0.05, 600);
const out = document.createElement('canvas'); out.width = W; out.height = H; const O = out.getContext('2d');
document.body.appendChild(out);
const mat = (c, r = 0.55, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: r, metalness: 0 }, o));
function M(geo, m, p) { const x = new THREE.Mesh(geo, typeof m === 'string' ? mat(m) : m); x.castShadow = true; x.receiveShadow = true; if (p) x.position.set(...p); return x; }
const box = (w, h, d, c, p, r, o) => M(new THREE.BoxGeometry(w, h, d), mat(c, r ?? 0.7, o), p);
const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), prog = (t, a, b) => clamp((t - a) / (b - a));
const ss = (t) => { t = clamp(t); return t * t * t * (t * (t * 6 - 15) + 10); }, lerp = (a, b, t) => a + (b - a) * t;
const backOut = (t) => { t = clamp(t); const c = 2.2; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const DUMMY = new THREE.Object3D();

// ---------- lights
const hemi = new THREE.HemisphereLight('#d8efff', '#5a8a3a', 1.5); scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff1d6', 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 0.5, far: 80 }); sun.shadow.bias = -0.0005; sun.shadow.radius = 3; scene.add(sun); scene.add(sun.target);
const fxLight = new THREE.PointLight('#ffd23f', 0, 12, 1.5); scene.add(fxLight);
const fxLight2 = new THREE.PointLight('#38d6ff', 0, 12, 1.5); scene.add(fxLight2);

// ---------- post
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.35, 0.5, 0.85); composer.addPass(bloom);
const bokeh = new BokehPass(scene, camera, { focus: 4, aperture: 0.0025, maxblur: 0.008 }); composer.addPass(bokeh);
composer.addPass(new OutputPass());

// ---------- projection + 2D helpers
function wpos(o) { const v = new THREE.Vector3(); o.getWorldPosition(v); return v; }
function P(x, y, z) { const v = new THREE.Vector3(x, y, z).project(camera); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H, v.z]; }
function PW(o, dy = 0) { const v = wpos(o); return P(v.x, v.y + dy, v.z); }
function glow(x, y, R, rgb, a) { if (a <= 0 || R <= 0) return; O.save(); O.globalCompositeOperation = 'lighter'; const g = O.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); O.fillStyle = g; O.fillRect(x - R, y - R, R * 2, R * 2); O.restore(); }
function tint(c, a) { if (a <= 0) return; O.fillStyle = c.replace('A', Math.min(1, a)); O.fillRect(0, 0, W, H); }
function flash(a, rgb = '255,255,255') { if (a > 0) tint(`rgba(${rgb},A)`, a); }
function ringFx(x, y, t, col = '120,220,255', R0 = 1400, sq = 0.35) { if (t <= 0 || t >= 1) return; O.save(); O.globalCompositeOperation = 'lighter'; const R = 40 + t * R0; O.strokeStyle = `rgba(${col},${(1 - t) * 0.9})`; O.lineWidth = 40 * (1 - t) + 4; O.beginPath(); O.ellipse(x, y, R, R * sq, 0, 0, 7); O.stroke(); O.restore(); }
function hLines(I, f, dir = 1) { if (I <= 0) return; const r = rng(Math.floor(f) * 3); O.save(); O.globalCompositeOperation = 'lighter'; for (let i = 0; i < 34; i++) { const y = r() * H, x = r() * W, len = 200 + r() * 600; O.strokeStyle = `rgba(220,235,255,${(0.08 + r() * 0.22) * I})`; O.lineWidth = 1 + r() * 5; O.beginPath(); O.moveTo(x, y); O.lineTo(x - dir * len, y); O.stroke(); } O.restore(); }
function sparkle(x, y, r, rot, col = '#fff59d', a = 1) { O.save(); O.globalAlpha = a; O.translate(x, y); O.rotate(rot); O.beginPath(); for (let i = 0; i < 8; i++) { const rr = i % 2 ? r * 0.3 : r; const an = i * Math.PI / 4; O.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); } O.closePath(); O.fillStyle = col; O.fill(); O.restore(); }
function motes(t, n, rgb, seed = 1, a = 0.7, sp = 40) { const r = rng(seed); O.save(); O.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const x = (r() * W + Math.sin(t * 0.7 + i) * 30), y = ((r() * H - t * sp * (0.5 + r())) % H + H) % H, s = 2 + r() * 5; O.fillStyle = `rgba(${rgb},${a * (0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i)))})`; O.beginPath(); O.arc(x, y, s, 0, 7); O.fill(); } O.restore(); }
const FONT = 'Inter, Arial Black, Arial';
function bigText(txt, y, k, size, fill, rot = -0.04) { if (k <= 0.01) return; O.save(); O.translate(W / 2, y); O.scale(k, k); O.rotate(rot); let s = size; O.font = `900 ${s}px ${FONT}`; while (O.measureText(txt).width > W - 120 && s > 40) { s -= 4; O.font = `900 ${s}px ${FONT}`; } O.textAlign = 'center'; O.textBaseline = 'middle'; O.lineJoin = 'round'; O.lineWidth = s * 0.22; O.strokeStyle = '#0b0a18'; O.strokeText(txt, 6, 8); O.strokeText(txt, 0, 0); O.fillStyle = fill; O.fillText(txt, 0, 0); O.restore(); }
function sceneText(txt, t, t0, fill = '#ffd23f', y = 330, size = 96) { const k = backOut(prog(t, t0, t0 + 0.25)); const sh = t - t0 < 0.3 ? Math.sin(t * 90) * 8 * (1 - (t - t0) / 0.3) : 0; O.save(); O.translate(sh, 0); bigText(txt, y, k, size, fill); O.restore(); }

// ---------- RPG system UI (holographic panels)
function rr(x, y, w, h, r) { O.beginPath(); O.roundRect(x, y, w, h, r); }
function holo(x, y, w, h, k, draw, col = '56,214,255', glitch = 0, t = 0) {
  if (k <= 0.01) return; O.save(); O.translate(x + w / 2, y + h / 2); O.scale(1, Math.min(1, k)); O.translate(-w / 2, -h / 2);
  if (glitch > 0) O.translate((Math.sin(t * 77) + Math.sin(t * 131)) * 14 * glitch, 0);
  O.globalAlpha = Math.min(1, k * 1.4);
  const g = O.createLinearGradient(0, 0, 0, h); g.addColorStop(0, `rgba(${col},.30)`); g.addColorStop(1, `rgba(10,40,80,.55)`);
  O.shadowColor = `rgba(${col},.9)`; O.shadowBlur = 30; rr(0, 0, w, h, 26); O.fillStyle = g; O.fill(); O.lineWidth = 5; O.strokeStyle = `rgba(${col},.95)`; O.stroke(); O.shadowBlur = 0;
  O.strokeStyle = `rgba(255,255,255,.12)`; O.lineWidth = 2; for (let yy = 12; yy < h; yy += 10) { O.beginPath(); O.moveTo(10, yy); O.lineTo(w - 10, yy); O.stroke(); }
  draw(w, h);
  if (glitch > 0) { const r = rng(Math.floor(t * 30)); for (let i = 0; i < 8 * glitch; i++) { O.fillStyle = r() < 0.5 ? 'rgba(255,40,70,.55)' : 'rgba(255,255,255,.4)'; O.fillRect(r() * w, r() * h, 40 + r() * 200, 4 + r() * 14); } }
  O.restore();
}
function uiText(s, x, y, size, col = '#ffffff', align = 'left', w = 800) { O.font = `800 ${size}px ${FONT}`; O.textAlign = align; O.textBaseline = 'middle'; O.fillStyle = col; O.shadowColor = 'rgba(0,0,0,.5)'; O.shadowBlur = 6; O.fillText(s, x, y, w); O.shadowBlur = 0; }
function statPanel(t, k, vals, luckK, glitch = 0) {
  holo(110, 1010, 860, 560, k, (w, h) => {
    uiText('ATRIBUTOS', 50, 60, 46, '#9ff0ff');
    const names = ['FORÇA', 'VELOCIDADE', 'INTELIGÊNCIA', 'RESISTÊNCIA', 'SORTE'];
    names.forEach((n, i) => {
      const y = 140 + i * 82, v = vals[i] ?? 0, luck = i === 4;
      uiText(n, 50, y, 34, luck ? '#ffd23f' : '#ffffff');
      rr(370, y - 16, 330, 32, 16); O.fillStyle = 'rgba(255,255,255,.15)'; O.fill();
      const full = luck ? 330 * clamp(luckK) : 330 * clamp(v / 10);
      if (full > 2) { rr(370, y - 16, full, 32, 16); O.fillStyle = luck ? '#ffd23f' : '#38d6ff'; O.shadowColor = luck ? '#ffd23f' : '#38d6ff'; O.shadowBlur = luck ? 30 : 10; O.fill(); O.shadowBlur = 0; }
      const num = luck ? (luckK > 0 ? String(Math.round(99 * clamp(luckK))) : '?') : (v > 0 ? String(Math.round(v)) : '');
      uiText(num, 790, y, luck ? 52 : 40, luck ? '#ffd23f' : '#ffffff', 'right');
    });
  }, '56,214,255', glitch, t);
}
function notice(t, k, title, sub, col = '255,210,63', y = 700) {
  holo(90, y, 900, 280, k, (w, h) => { O.fillStyle = `rgb(${col})`; O.beginPath(); O.arc(90, 140, 52, 0, 7); O.fill(); uiText('!', 90, 144, 70, '#0b0a18', 'center'); uiText(title, 170, 110, 54, `rgb(${col})`, 'left', 700); uiText(sub, 170, 185, 38, '#ffffff', 'left', 700); }, col);
}
