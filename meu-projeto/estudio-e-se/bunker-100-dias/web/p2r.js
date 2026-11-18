
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
