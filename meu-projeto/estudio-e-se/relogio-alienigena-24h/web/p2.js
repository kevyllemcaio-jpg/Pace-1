
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
