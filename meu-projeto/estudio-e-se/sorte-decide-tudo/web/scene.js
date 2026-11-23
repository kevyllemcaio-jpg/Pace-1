
// ================= SETS =================
const SKY_DAY = tex(64, 1024, (g) => { const gr = g.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, '#3f8fe0'); gr.addColorStop(0.55, '#8cc8f2'); gr.addColorStop(1, '#e6f6ff'); g.fillStyle = gr; g.fillRect(0, 0, 64, 1024); });
const SKY_GOLD = tex(64, 1024, (g) => { const gr = g.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, '#4b5fb0'); gr.addColorStop(0.5, '#f2a36b'); gr.addColorStop(1, '#ffe0a8'); g.fillStyle = gr; g.fillRect(0, 0, 64, 1024); });
const SKY_DARK = tex(64, 1024, (g) => { const gr = g.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, '#0b0820'); gr.addColorStop(0.6, '#2a1748'); gr.addColorStop(1, '#5a2a4a'); g.fillStyle = gr; g.fillRect(0, 0, 64, 1024); });

// ---- meadow (origin)
const MEADOW = new THREE.Group(); scene.add(MEADOW);
const GRASS_TEX = tex(512, 512, (g) => { g.fillStyle = '#5dbb46'; g.fillRect(0, 0, 512, 512); const r = rng(4); for (let i = 0; i < 5000; i++) { g.fillStyle = r() < 0.5 ? `rgba(40,110,30,${0.2 + r() * 0.3})` : `rgba(150,220,90,${0.15 + r() * 0.3})`; g.fillRect(r() * 512, r() * 512, 2 + r() * 3, 6 + r() * 10); } });
GRASS_TEX.wrapS = GRASS_TEX.wrapT = THREE.RepeatWrapping; GRASS_TEX.repeat.set(40, 40);
const ground = M(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ map: GRASS_TEX, roughness: 0.95 })); ground.rotation.x = -Math.PI / 2; MEADOW.add(ground);
const BLADE_N = 5000; const blades = new THREE.InstancedMesh(new THREE.ConeGeometry(0.035, 0.42, 3), mat('#ffffff', 0.8), BLADE_N); blades.castShadow = false; blades.receiveShadow = true; MEADOW.add(blades);
const BL = []; { const r = rng(12), c = new THREE.Color(); for (let i = 0; i < BLADE_N; i++) { const a = r() * 7, d = Math.sqrt(r()) * 14; BL.push([Math.cos(a) * d, Math.sin(a) * d - 2, r() * 7, 0.6 + r() * 0.9]); c.set(['#4aa83a', '#6cc94f', '#3d8f31', '#8bd860'][i % 4]); blades.setColorAt(i, c); } blades.instanceColor.needsUpdate = true; }
function sway(t, wind = 1) { for (let i = 0; i < BLADE_N; i++) { const [x, z, ph, s] = BL[i]; DUMMY.position.set(x, 0.18 * s, z); DUMMY.rotation.set(Math.sin(t * 2 + ph + x * 0.3) * 0.25 * wind, 0, Math.cos(t * 1.6 + ph) * 0.15 * wind); DUMMY.scale.set(1, s, 1); DUMMY.updateMatrix(); blades.setMatrixAt(i, DUMMY.matrix); } blades.instanceMatrix.needsUpdate = true; }
const flowers = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 8, 6), mat('#ffffff', 0.5), 260); MEADOW.add(flowers);
{ const r = rng(13), c = new THREE.Color(); for (let i = 0; i < 260; i++) { const a = r() * 7, d = 1.5 + r() * 13; DUMMY.position.set(Math.cos(a) * d, 0.32, Math.sin(a) * d - 2); DUMMY.scale.setScalar(1); DUMMY.rotation.set(0, 0, 0); DUMMY.updateMatrix(); flowers.setMatrixAt(i, DUMMY.matrix); c.set(['#ffffff', '#ffe066', '#ff8fab'][i % 3]); flowers.setColorAt(i, c); } flowers.instanceColor.needsUpdate = true; }
function tree(x, z, s, seed) { const g = new THREE.Group(); const r = rng(seed); g.add(M(new THREE.CylinderGeometry(0.18, 0.26, 1.8, 10), mat('#7a5233', 0.9), [0, 0.9, 0])); const cols = ['#3f9a3a', '#56b347', '#2f8a37']; for (let i = 0; i < 4; i++) g.add(M(new THREE.SphereGeometry(0.9 + r() * 0.5, 18, 14), mat(cols[i % 3], 0.8), [(r() - 0.5) * 1.2, 2.3 + r() * 1.0, (r() - 0.5) * 1.2])); g.position.set(x, 0, z); g.scale.setScalar(s); MEADOW.add(g); return g; }
{ const r = rng(21); for (let i = 0; i < 34; i++) { const a = r() * Math.PI * 2, d = 9 + r() * 30; const x = Math.cos(a) * d, z = Math.sin(a) * d - 6; if (Math.abs(x) < 4 && z > -8 && z < 6) continue; tree(x, z, 0.8 + r() * 0.8, 100 + i); } }
for (const [x, z, s] of [[-6, -14, 1.1], [7, -17, 1.2], [-11, -9, 1], [12, -8, 0.9], [-3, -20, 1.3], [4, -24, 1.2]]) tree(x, z, s, 300 + x);
const lake = M(new THREE.CircleGeometry(9, 48), new THREE.MeshStandardMaterial({ color: '#4fb3e8', roughness: 0.08, metalness: 0.35 })); lake.rotation.x = -Math.PI / 2; lake.position.set(8, 0.03, -16); lake.scale.set(1.6, 1, 1); MEADOW.add(lake);
{ const r = rng(31); for (let i = 0; i < 11; i++) { const x = -150 + i * 30 + r() * 10, z = -120 - r() * 40, h = 30 + r() * 35, rad = 18 + r() * 16; const m = M(new THREE.ConeGeometry(rad, h, 7), mat(['#7d93b8', '#8ea3c4', '#6f85ab'][i % 3], 0.95, { flatShading: true }), [x, h / 2 - 2, z]); m.castShadow = false; MEADOW.add(m); const cap = M(new THREE.ConeGeometry(rad * 0.36, h * 0.36, 7), mat('#f4f8ff', 0.8, { flatShading: true }), [x, h - 2 - h * 0.18 + 0.3, z]); cap.castShadow = false; MEADOW.add(cap); } }
const ROCK = M(new THREE.DodecahedronGeometry(0.16), mat('#8a8a90', 0.9, { flatShading: true }), [0.35, 0.1, 0.5]); MEADOW.add(ROCK);

// ---- town (x = 300)
const TX = 300;
const TOWN = new THREE.Group(); TOWN.position.x = TX; scene.add(TOWN);
const COBBLE = tex(512, 512, (g) => { g.fillStyle = '#b9a88e'; g.fillRect(0, 0, 512, 512); const r = rng(5); for (let y = 0; y < 512; y += 32) for (let x = (y / 32) % 2 * 24; x < 512; x += 48) { g.fillStyle = `rgb(${150 + r() * 50},${135 + r() * 45},${110 + r() * 40})`; g.beginPath(); g.roundRect(x + 2, y + 2, 44, 28, 8); g.fill(); } });
COBBLE.wrapS = COBBLE.wrapT = THREE.RepeatWrapping; COBBLE.repeat.set(16, 16);
const plaza = M(new THREE.PlaneGeometry(120, 120), new THREE.MeshStandardMaterial({ map: COBBLE, roughness: 0.9 })); plaza.rotation.x = -Math.PI / 2; TOWN.add(plaza);
const WALL_TEX = tex(256, 256, (g) => { g.fillStyle = '#f2e6cf'; g.fillRect(0, 0, 256, 256); g.strokeStyle = '#6b4a32'; g.lineWidth = 14; g.strokeRect(0, 0, 256, 256); g.beginPath(); g.moveTo(0, 128); g.lineTo(256, 128); g.moveTo(0, 0); g.lineTo(256, 256); g.stroke(); g.fillStyle = '#8ecae6'; g.fillRect(70, 150, 50, 60); g.fillRect(150, 150, 50, 60); g.strokeStyle = '#6b4a32'; g.lineWidth = 6; g.strokeRect(70, 150, 50, 60); g.strokeRect(150, 150, 50, 60); });
function house(x, z, ry, w, h, roofCol) { const g = new THREE.Group(); g.add(M(new THREE.BoxGeometry(w, h, 4), new THREE.MeshStandardMaterial({ map: WALL_TEX, roughness: 0.9 }), [0, h / 2, 0])); const roof = M(new THREE.ConeGeometry(w * 0.78, 2.6, 4), mat(roofCol, 0.8, { flatShading: true }), [0, h + 1.3, 0]); roof.rotation.y = Math.PI / 4; roof.scale.z = 4 / w * 1.1; g.add(roof); g.add(box(1.1, 2, 0.1, '#6b4a32', [0, 1, 2.02], 0.8)); g.position.set(x, 0, z); g.rotation.y = ry; TOWN.add(g); }
{ const cols = ['#c0392b', '#8e5a2b', '#a0522d', '#b5651d', '#7b3f00']; let i = 0; for (const x of [-16, -10, -4, 4, 10, 16]) house(x, -16, 0, 5.4, 4 + (i % 3), cols[i++ % 5]); for (const z of [-10, -3, 4, 11]) { house(-14, z, Math.PI / 2, 5.4, 4 + (i % 2), cols[i++ % 5]); house(14, z, -Math.PI / 2, 5.4, 4 + (i % 3), cols[i++ % 5]); } }
// the big magic panel on a stone arch
const ARCH = new THREE.Group(); ARCH.position.set(0, 0, -11); TOWN.add(ARCH);
for (const sx of [-1, 1]) ARCH.add(box(1.2, 7.5, 1.2, '#9a9286', [sx * 4.2, 3.75, 0], 0.95));
ARCH.add(box(9.6, 1.2, 1.4, '#8a8276', [0, 8, 0], 0.95));
const panelMat = new THREE.MeshStandardMaterial({ color: '#0e4a6e', emissive: '#38d6ff', emissiveIntensity: 0.9, transparent: true, opacity: 0.85, roughness: 0.2 });
const PANEL = M(new THREE.PlaneGeometry(7, 6), panelMat, [0, 4.2, 0.2]); PANEL.castShadow = false; ARCH.add(PANEL);
// crowd of young people in line
const CROWD = [];
const CR = [['#f1d9cf', '#2b1b1e', 'long', '#2ec4b6'], ['#a86f52', '#1e1414', 'short', '#3a86ff'], ['#f6e0d4', '#d9542b', 'pony', '#ff5fa2'], ['#7b4a33', '#1b1212', 'short', '#6a994e'], ['#efd2c2', '#5a3a22', 'buns', '#ffbe0b'], ['#c99273', '#3a2314', 'short', '#8338ec'], ['#f1c27d', '#2b1d14', 'bob', '#e76f51'], ['#8d5524', '#000', 'short', '#118ab2']];
CR.forEach(([skin, hair, style, top], i) => { const k = kid({ skin, hair, style, top, legs: '#3d405b', shoes: '#2a2a2a', hands: skin }); k.scale.setScalar(1.1); k.userData.sc = 1.1; scene.add(k); CROWD.push(k); });

// ================= CHARACTERS =================
const HERO = kid({ skin: '#f1c9a5', hair: '#3b2416', style: 'short', top: '#d8c3a0', top2: '#c2a97e', legs: '#6b4a32', shoes: '#3b2a20', hands: '#f1c9a5' }); HERO.userData.sc = 1.15; scene.add(HERO);
const RING = M(new THREE.TorusGeometry(0.06, 0.02, 10, 24), mat('#ffd23f', 0.2, { metalness: 0.9, emissive: '#ffb703', emissiveIntensity: 0.4 }), [0, -0.46, 0]); RING.rotation.x = Math.PI / 2; HERO.userData.arms[1].add(RING);
const HELMET = new THREE.Group(); HERO.userData.head.add(HELMET);
{ const sh = M(new THREE.SphereGeometry(0.34, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.55), mat('#f4f6fa', 0.25, { metalness: 0.2 })); sh.scale.set(1, 1.28, 1); sh.rotation.x = -0.15; HELMET.add(sh); const vis = M(new THREE.SphereGeometry(0.33, 32, 12, Math.PI / 2 - 0.9, 1.8, Math.PI * 0.34, 0.28), new THREE.MeshStandardMaterial({ color: '#0b3b5a', emissive: '#38d6ff', emissiveIntensity: 0.7, side: THREE.DoubleSide })); vis.scale.set(1.06, 1.28, 1.06); HELMET.add(vis); for (const sx of [-1, 1]) HELMET.add(M(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 18), mat('#dfe5ee', 0.3), [sx * 0.33, 0, 0])).rotation.z = Math.PI / 2; }
// NB: .add() returns the parent; the rotation line above rotates HELMET by 90° — fixed right after:
HELMET.rotation.set(0, 0, 0); HELMET.children.slice(2).forEach((c) => { c.rotation.z = Math.PI / 2; });

// assassin: dark kid + hood + shadowed face + two daggers
const ASS_FACE = tex(256, 256, (g) => { g.fillStyle = 'rgba(8,6,12,.96)'; g.fillRect(0, 0, 256, 150); g.fillStyle = '#ff2d3a'; g.shadowColor = '#ff2d3a'; g.shadowBlur = 20; for (const x of [88, 168]) { g.beginPath(); g.ellipse(x, 120, 14, 6, 0, 0, 7); g.fill(); } g.shadowBlur = 0; g.fillStyle = '#121218'; g.fillRect(0, 150, 256, 106); g.strokeStyle = '#26262e'; g.lineWidth = 6; for (let y = 165; y < 256; y += 22) { g.beginPath(); g.moveTo(20, y); g.lineTo(236, y + 6); g.stroke(); } });
const ASSASSIN = kid({ skin: '#c68e6a', top: '#1a1a22', top2: '#2a2a33', legs: '#15151b', shoes: '#0e0e12', hands: '#1a1a22' }); ASSASSIN.userData.sc = 1.25; scene.add(ASSASSIN);
ASSASSIN.userData.faceMat.map = ASS_FACE;
{ const hood = M(new THREE.SphereGeometry(0.37, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.66), mat('#121218', 0.7, { side: THREE.DoubleSide })); hood.scale.set(1, 1.3, 1.05); hood.rotation.x = -0.45; ASSASSIN.userData.head.add(hood); const tip = M(new THREE.ConeGeometry(0.2, 0.35, 16), mat('#121218', 0.7), [0, 0.2, -0.38]); tip.rotation.x = -1.2; ASSASSIN.userData.head.add(tip); }
const DAGGERS = [];
for (const i of [0, 1]) { const d = new THREE.Group(); d.add(M(new THREE.BoxGeometry(0.035, 0.42, 0.012), mat('#dfe6ee', 0.15, { metalness: 0.9 }), [0, 0.26, 0])); d.add(box(0.16, 0.03, 0.04, '#7a5a3c', [0, 0.05, 0], 0.6)); d.add(box(0.04, 0.12, 0.04, '#3b2a20', [0, -0.03, 0], 0.6)); d.position.set(0, -0.48, 0.04); ASSASSIN.userData.arms[i].add(d); DAGGERS.push(d); }

// slime
const SLIME = new THREE.Group(); scene.add(SLIME);
const slimeMat = new THREE.MeshStandardMaterial({ color: '#3fa9f5', emissive: '#1c6fd1', emissiveIntensity: 0.45, roughness: 0.08, transparent: true, opacity: 0.86 });
const SLB = M(new THREE.SphereGeometry(0.32, 32, 24), slimeMat, [0, 0.26, 0]); SLB.scale.set(1.1, 0.82, 1.05); SLIME.add(SLB);
SLIME.add(M(new THREE.SphereGeometry(0.07, 12, 10), mat('#ffffff', 0.1, { emissive: '#ffffff', emissiveIntensity: 0.6 }), [-0.13, 0.42, 0.18]));
for (const sx of [-1, 1]) { const e = M(new THREE.SphereGeometry(0.075, 16, 12), mat('#0b0a18', 0.1), [sx * 0.11, 0.3, 0.29]); e.scale.set(1, 1.2, 0.6); SLIME.add(e); SLIME.add(M(new THREE.SphereGeometry(0.022, 8, 6), mat('#ffffff', 0.1, { emissive: '#ffffff', emissiveIntensity: 1 }), [sx * 0.11 + 0.025, 0.33, 0.33])); }

// the three magic objects
const SWORD = new THREE.Group(); scene.add(SWORD);
SWORD.add(M(new THREE.BoxGeometry(0.09, 0.9, 0.025), mat('#dfe6ee', 0.15, { metalness: 0.9, emissive: '#7b2cbf', emissiveIntensity: 0.3 }), [0, 0.35, 0]));
SWORD.add(box(0.36, 0.06, 0.08, '#c9a227', [0, -0.12, 0], 0.3)); SWORD.add(box(0.06, 0.24, 0.06, '#4a2c1a', [0, -0.27, 0], 0.6)); SWORD.add(M(new THREE.SphereGeometry(0.05, 12, 10), mat('#c9a227', 0.3), [0, -0.41, 0]));
const BIGRING = M(new THREE.TorusGeometry(0.22, 0.06, 16, 40), mat('#ffd23f', 0.15, { metalness: 0.95, emissive: '#ffb703', emissiveIntensity: 0.6 })); scene.add(BIGRING);
const GEM = M(new THREE.OctahedronGeometry(0.08), mat('#ff3b6b', 0.1, { emissive: '#ff3b6b', emissiveIntensity: 1.2 }), [0, 0.27, 0]); BIGRING.add(GEM);
const ARMOR = new THREE.Group(); scene.add(ARMOR);
{ const am = mat('#2f6fd6', 0.25, { metalness: 0.7, emissive: '#1846a0', emissiveIntensity: 0.3 }); const tor = M(new THREE.CapsuleGeometry(0.26, 0.24, 6, 18), am); tor.scale.z = 0.8; ARMOR.add(tor); for (const sx of [-1, 1]) ARMOR.add(M(new THREE.SphereGeometry(0.15, 16, 12), am, [sx * 0.3, 0.18, 0])); ARMOR.add(box(0.36, 0.06, 0.26, '#ffd23f', [0, -0.1, 0.02], 0.3)); }

// glowing class silhouettes (scene 5)
const SIL = []; [['#ff8c42', 'sword'], ['#c77dff', 'staff'], ['#7bdc6a', 'bow']].forEach(([c, prop]) => { const k = kid({ skin: c, hair: c, style: 'short', top: c, legs: c, shoes: c, hands: c }); const gm = new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }); if (prop === 'sword') k.userData.arms[1].add(M(new THREE.BoxGeometry(0.06, 0.8, 0.02), gm, [0, -0.8, 0.1])); if (prop === 'staff') k.userData.arms[1].add(M(new THREE.CylinderGeometry(0.03, 0.03, 1.6, 8), gm, [0, -0.5, 0.1])); if (prop === 'bow') k.userData.arms[0].add(M(new THREE.TorusGeometry(0.4, 0.02, 6, 20, Math.PI), gm, [0, -0.5, 0.1])); k.traverse((o) => { if (o.isMesh) { o.material = gm; o.castShadow = false; } }); k.scale.setScalar(1.6); scene.add(k); SIL.push(k); });
const COLUMN = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 30, 32, 1, true), new THREE.MeshBasicMaterial({ color: '#ffe9a0', transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(COLUMN);
const WAVE = new THREE.Mesh(new THREE.TorusGeometry(1, 0.08, 8, 64), new THREE.MeshBasicMaterial({ color: '#8ff7ff', transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })); WAVE.rotation.x = Math.PI / 2; scene.add(WAVE);

// the giant shadow creature (scene 8)
const BEAST = new THREE.Group(); scene.add(BEAST);
{ const bm = mat('#1b1426', 0.85); const body = M(new THREE.SphereGeometry(5, 32, 24), bm, [0, 6, 0]); body.scale.set(1.2, 1.1, 0.9); BEAST.add(body); const head = M(new THREE.SphereGeometry(2.8, 32, 24), bm, [0, 12.5, 1.2]); BEAST.add(head); for (const sx of [-1, 1]) { const h = M(new THREE.ConeGeometry(0.7, 4, 12), mat('#3a2a40', 0.6), [sx * 2.1, 15, 0.6]); h.rotation.z = -sx * 0.6; BEAST.add(h); const arm = M(new THREE.CapsuleGeometry(1.2, 5, 8, 16), bm, [sx * 6, 6, 1]); arm.rotation.z = sx * 0.4; BEAST.add(arm); const eye = M(new THREE.SphereGeometry(0.42, 16, 12), new THREE.MeshBasicMaterial({ color: '#ffe14a' }), [sx * 1.0, 13, 3.6]); eye.scale.set(1.4, 0.7, 0.5); BEAST.add(eye); } }
BEAST.traverse((o) => { if (o.isMesh) o.castShadow = false; });

// ================= POSES =================
function stand(k) { const u = k.userData; for (const l of u.legs) l.rotation.set(0, 0, 0); u.arms[0].rotation.set(0, 0, -0.18); u.arms[1].rotation.set(0, 0, 0.18); u.body.rotation.set(0, 0, 0); u.body.position.set(0, 0, 0); u.head.rotation.set(0, 0, 0); }
function put(k, x, y, z, ry = 0) { k.visible = true; k.position.set(x, y, z); k.rotation.set(0, ry, 0); k.scale.setScalar(k.userData.sc || 1.15); stand(k); return k; }
function face(k, e) { if (k === ASSASSIN) return; k.userData.faceMat.map = faceTex(e, 0); }
function breathe(k, t, a = 1) { k.userData.body.position.y = Math.sin(t * 2.2) * 0.012 * a; k.userData.head.rotation.z = Math.sin(t * 1.3) * 0.04 * a; }
function blinkE(e, t, ph = 0) { return ((t + ph) % 3.1) < 0.12 ? 'happyc' : e; }
const ALL = [MEADOW, TOWN, ...CROWD, HERO, ASSASSIN, SLIME, SWORD, BIGRING, ARMOR, ...SIL, COLUMN, WAVE, BEAST];
function reset() { ALL.forEach((o) => { o.visible = false; }); HELMET.visible = false; RING.visible = false; fxLight.intensity = 0; fxLight2.intensity = 0; slimeMat.emissiveIntensity = 0.45; }
function setMeadow(mode = 'day') { MEADOW.visible = true; scene.background = mode === 'dark' ? SKY_DARK : mode === 'gold' ? SKY_GOLD : SKY_DAY; scene.fog = new THREE.Fog(mode === 'dark' ? '#2a1748' : mode === 'gold' ? '#f2c08a' : '#cfeaff', 40, 220); hemi.color.set(mode === 'dark' ? '#6a5a9a' : '#d8efff'); hemi.groundColor.set(mode === 'dark' ? '#1a1a2a' : '#5a8a3a'); hemi.intensity = mode === 'dark' ? 0.6 : 1.5; sun.color.set(mode === 'gold' ? '#ffc98a' : mode === 'dark' ? '#9a8acf' : '#fff1d6'); sun.intensity = mode === 'dark' ? 0.7 : 2.4; }
function setTown() { TOWN.visible = true; scene.background = SKY_DAY; scene.fog = new THREE.Fog('#cfeaff', 30, 160); hemi.color.set('#d8efff'); hemi.groundColor.set('#8a7a5a'); hemi.intensity = 1.5; sun.color.set('#fff1d6'); sun.intensity = 2.3; }
function crowdLine(t, look = 0) { CROWD.forEach((k, i) => { const x = TX - 3.4 + (i % 4) * 2.2 + (i > 3 ? 1.1 : 0), z = -2.2 + Math.floor(i / 4) * 2.2; put(k, x, 0, z, Math.PI + (look ? Math.atan2(TX - x, -z) * 0 : 0)); breathe(k, t + i); face(k, blinkE('happy', t, i * 0.4)); }); }

// ================= TAKES =================
const SHOT = {};
const C = (px, py, pz, lx, ly, lz, fo = 4) => [px, py, pz, lx, ly, lz, fo];
function cam(a, b, u) { const e = ss(u); return a.map((v, i) => lerp(v, b[i], e)); }
let FX = [];  // overlay callbacks for this frame

SHOT['1a'] = (u, t, lt) => { setMeadow(); sway(t); put(HERO, 0, 0.18, 0, 0); HERO.rotation.x = -Math.PI / 2; HERO.position.z = 0.9; face(HERO, lt < 1.4 ? 'flat' : lt < 2.4 ? 'shock' : 'worry');
  FX.push(() => { sceneText('E SE SUA SORTE', t, 0.4, '#ffffff', 300, 92); sceneText('DECIDISSE TUDO?', t, 0.7, '#ffd23f', 410, 100); motes(t, 30, '255,255,220', 3, 0.5, 20); });
  return cam(C(0, 11, 3.2, 0, 0, -0.2, 11), C(0, 2.6, 1.9, 0, 0.2, 0.2, 2.4), u); };
SHOT['1b'] = (u, t, lt) => { setMeadow(); sway(t); put(HERO, 0, 0, 0, lerp(-2.4, 0.25, ss(u))); breathe(HERO, t); HERO.userData.head.rotation.y = Math.sin(t * 1.4) * 0.3; face(HERO, blinkE(u < 0.5 ? 'shock' : 'happy', t));
  const a = lerp(0.6, -0.5, u); FX.push(() => motes(t, 30, '255,255,220', 4, 0.45, 20)); return [Math.sin(a) * 5, 1.7, Math.cos(a) * 5, 0, 1.3, -1, 5]; };
SHOT['1c'] = (u, t, lt) => { setMeadow(); sway(t); put(HERO, 0, 0, 0, 0); const trip = prog(lt, 0.55, 0.9); const U = HERO.userData;
  U.arms[0].rotation.set(lerp(0, -2.6, trip), 0, lerp(-1.1, -0.5, trip)); U.arms[1].rotation.set(lerp(0, -2.4, trip), 0, lerp(1.1, 0.5, trip)); U.body.rotation.x = lerp(-0.12, 0.55, trip); U.legs[1].rotation.x = -0.9 * trip; face(HERO, trip > 0 ? 'shock' : 'smug');
  FX.push(() => { if (lt > 0.6) sceneText('INÚTIL?', t, TAKE0 + 0.6, '#ff5fa2', 330, 130); });
  return cam(C(0.2, 1.9, 3.6, 0, 1.6, 0, 3.6), C(0.1, 1.85, 2.9, 0, 1.5, 0, 2.9), clamp(u * 1.4)); };
SHOT['2a'] = (u, t, lt) => { setTown(); crowdLine(t); panelMat.emissiveIntensity = 0.8 + Math.sin(t * 4) * 0.2;
  FX.push(() => { const p = P(TX, 4.2, -10.8); glow(p[0], p[1], 500, '56,214,255', 0.35); }); return cam(C(TX - 7, 2.2, 7, TX - 1, 3.2, -6, 9), C(TX + 2.5, 2.4, 5, TX, 3.6, -8, 9), u); };
function panelText(lines, col = '#ffffff') { const p = P(TX, 4.6, -10.8); if (p[2] > 1) return; const s = Math.abs(P(TX + 3.5, 4.6, -10.8)[0] - p[0]) / 3.5; lines.forEach((ln, i) => { O.save(); O.font = `900 ${Math.round(ln[1] * s * 0.62)}px ${FONT}`; O.textAlign = 'center'; O.textBaseline = 'middle'; O.fillStyle = ln[2] || col; O.shadowColor = ln[2] || '#38d6ff'; O.shadowBlur = 24; O.fillText(ln[0], p[0], p[1] + ln[3] * s, s * 6.4); O.restore(); }); }
SHOT['2b'] = (u, t, lt) => { setTown(); crowdLine(t); const A = CROWD[1]; put(A, TX, 0, -6.4, Math.PI); A.userData.head.rotation.x = -0.25; face(A, lt > 1.2 ? 'sad' : 'happy'); panelMat.emissiveIntensity = 1.1;
  FX.push(() => { panelText([['18 ANOS', 0.7, '#9ff0ff', -1.4], ['CLASSE ALEATÓRIA', 0.55, '#ffffff', -0.5]]); if (lt > 1.2) panelText([['FAZENDEIRO', 0.75, '#ffd23f', 0.8]]); sceneText('CLASSE ALEATÓRIA!', t, TAKE0 + 0.3, '#ffd23f', 300, 92); });
  return cam(C(TX + 4.6, 2.0, 0.6, TX, 3.6, -10, 11), C(TX + 3.4, 2.2, -0.8, TX, 3.8, -10, 9), u); };
SHOT['2c'] = (u, t, lt) => { setTown(); crowdLine(t); const B = CROWD[2]; put(B, TX, 0, -6.4, 0.3); const j = Math.max(0, Math.sin(prog(lt, 0.7, 1.4) * Math.PI)); B.position.y = j * 0.5; B.userData.arms[0].rotation.set(-2.8 * prog(lt, 0.6, 0.9), 0, -0.3); B.userData.arms[1].rotation.set(-2.8 * prog(lt, 0.6, 0.9), 0, 0.3); face(B, lt > 0.6 ? 'happyc' : 'shock');
  CROWD.forEach((k, i) => { if (k !== B && lt > 0.9) { k.userData.arms[1].rotation.set(-2.6, 0, 0.3); k.position.y = Math.max(0, Math.sin(t * 9 + i)) * 0.15; face(k, 'happyc'); } }); fxLight.position.set(TX, 3, -5.5); fxLight.intensity = 8 * prog(lt, 0.5, 0.8);
  FX.push(() => { if (lt > 0.5) notice(t, prog(lt, 0.5, 0.8), 'CLASSE: LENDÁRIO!', 'SORTE ABSURDA', '255,210,63', 330); const p = PW(B.userData.head); const r = rng(Math.floor(t * 12)); for (let i = 0; i < 40; i++) sparkle(p[0] + (r() - 0.5) * 600, ((r() * 900 + lt * 600 * (0.5 + r())) % 1100) + p[1] - 700, 10 + r() * 16, t * 3 + i, i % 2 ? '#ffd23f' : '#fff3b0', prog(lt, 0.5, 0.8)); glow(p[0], p[1], 520, '255,210,63', 0.45 * prog(lt, 0.5, 0.8)); });
  return cam(C(TX - 1.4, 1.7, -3.0, TX, 2.3, -6.4, 3.5), C(TX - 0.9, 1.8, -3.6, TX, 2.4, -6.4, 2.9), u); };
function heroFront(t) { put(HERO, TX, 0, -6.4, 0); breathe(HERO, t); }
function floatObjs(t, yb, sp = 1) { [[SWORD, -0.85], [BIGRING, 0], [ARMOR, 0.85]].forEach(([o, dx], i) => { o.visible = true; o.position.set(TX + dx, yb + Math.sin(t * 2 + i) * 0.06, -5.2); o.rotation.set(0, t * 1.2 * sp + i, i === 1 ? 0.3 : 0); o.scale.setScalar(1); }); }
function objAuras(a = 1) { [[SWORD, '199,125,255'], [BIGRING, '255,210,63'], [ARMOR, '76,160,255']].forEach(([o, c]) => { if (!o.visible) return; const p = PW(o); if (p[2] < 1) glow(p[0], p[1], 260 * o.scale.x, c, 0.5 * a); }); }
SHOT['3a'] = (u, t, lt) => { setTown(); heroFront(t); HERO.userData.head.rotation.x = -0.35; face(HERO, blinkE('shock', t)); floatObjs(t, lerp(4.6, 2.4, ss(prog(lt, 0, 2.2))));
  FX.push(() => { objAuras(); motes(t, 40, '255,240,200', 7, 0.6, 30); sceneText('ESCOLHA SEU DESTINO!', t, TAKE0 + 0.5, '#ffd23f', 300, 92); });
  return cam(C(TX, 1.3, -1.6, TX, 2.0, -6.4, 4.8), C(TX, 1.7, -2.4, TX, 2.6, -5.2, 2.8), u); };
SHOT['3b'] = (u, t, lt) => { setTown(); heroFront(t); floatObjs(t, 2.4); FX.push(() => { objAuras(1.1); motes(t, 40, '255,240,200', 8, 0.6, 30); });
  const x = lerp(-1.3, 1.3, ss(u)); return [TX + x, 2.45, -3.7, TX + x * 0.6, 2.4, -5.2, 1.5]; };
SHOT['3c'] = (u, t, lt) => { setTown(); heroFront(t); floatObjs(t, 2.4, 0.3); const U = HERO.userData; const reach = prog(lt, 0.2, 1.2), grab = prog(lt, 1.3, 1.7);
  U.arms[1].rotation.set(-1.5 * reach, Math.sin(lt * 3) * 0.3 * (1 - grab), 0.1); face(HERO, grab > 0 ? 'happyc' : 'worry');
  if (grab > 0) { const h = wpos(U.arms[1].children[1]); BIGRING.position.lerp(h, grab); BIGRING.scale.setScalar(lerp(1, 0.25, grab)); SWORD.scale.setScalar(1 - grab); ARMOR.scale.setScalar(1 - grab); }
  if (grab >= 1) { BIGRING.visible = false; RING.visible = true; }
  FX.push(() => { objAuras(1 - grab * 0.5); if (grab > 0) { const p = PW(U.arms[1].children[1]); glow(p[0], p[1], 300, '255,210,63', 0.7 * Math.sin(grab * Math.PI) + 0.2); } });
  return cam(C(TX + 0.9, 2.0, -3.4, TX + 0.1, 2.2, -5.4, 1.9), C(TX + 0.5, 1.9, -3.9, TX + 0.1, 2.0, -5.6, 1.6), u); };
function heroHelmet(t) { heroFront(t); HELMET.visible = true; RING.visible = true; }
SHOT['4a'] = (u, t, lt) => { setTown(); heroHelmet(t); face(HERO, 'flat'); FX.push(() => statPanel(t, prog(lt, 0.6, 1.2), [0, 0, 0, 0, 0], 0)); return cam(C(TX, 1.95, -3.4, TX, 1.9, -6.4, 3), C(TX, 1.85, -4.2, TX, 1.75, -6.4, 2.2), u); };
SHOT['4b'] = (u, t, lt) => { setTown(); heroHelmet(t); const k = (i) => prog(lt, 0.2 + i * 0.55, 0.6 + i * 0.55); face(HERO, lt > 1.6 ? 'worry' : 'flat'); HERO.userData.head.rotation.x = 0.08 * Math.sin(lt * 2);
  FX.push(() => statPanel(t, 1, [3 * k(0), 4 * k(1), 5 * k(2), 2 * k(3)], 0)); return cam(C(TX + 0.5, 1.9, -4.0, TX, 1.8, -6.4, 2.4), C(TX + 0.3, 1.85, -4.3, TX, 1.75, -6.4, 2.1), u); };
SHOT['4c'] = (u, t, lt) => { setTown(); heroHelmet(t); const L = prog(lt, 0.3, 1.3); face(HERO, L > 0.6 ? 'shock' : 'worry');
  FX.push(() => { statPanel(t, 1, [3, 4, 5, 2], L); if (L >= 1) { const bl = Math.floor(t * 6) % 2; glow(W / 2, 1370, 500, '255,210,63', bl ? 0.35 : 0.15); sceneText('SORTE: 99!', t, TAKE0 + 1.35, '#ffd23f', 330, 140); } });
  const z = lerp(-4.3, -5.0, ss(prog(lt, 1.3, 1.6))); return [TX, 1.85, z, TX, 1.78, -6.4, Math.abs(-6.4 - z) - 0.3]; };
SHOT['5a'] = (u, t, lt) => { setTown(); put(HERO, TX, 0, -6.4, 0); RING.visible = true; const U = HERO.userData; U.arms[0].rotation.set(0, 0, -0.7); U.arms[1].rotation.set(0, 0, 0.7); U.head.rotation.x = -0.2; face(HERO, 'shock');
  COLUMN.visible = true; COLUMN.position.set(TX, 15, -6.4); COLUMN.material.opacity = 0.06 + 0.03 * Math.sin(t * 6); fxLight.intensity = 0;
  SIL.forEach((k, i) => { put(k, TX - 3 + i * 3, 0, -9.2, 0); k.scale.setScalar(1.6); k.userData.arms[1].rotation.set(-0.6, 0, 0.3); breathe(k, t + i); k.children[0].traverse((o) => { if (o.material) o.material.opacity = 0.5 * prog(lt, 0.5 + i * 0.6, 1.2 + i * 0.6); }); });
  FX.push(() => { motes(t, 60, '255,240,180', 9, 0.8, 80); const p = PW(U.head); glow(p[0], p[1] + 200, 600, '255,240,180', 0.18); });
  const a = lerp(-0.5, 0.5, u); return [TX + Math.sin(a) * 6.5, 2.3, -6.4 + Math.cos(a) * 6.5, TX, 2.4, -7.2, 6.5]; };
SHOT['5b'] = (u, t, lt) => { setTown(); put(HERO, TX, 0, -6.4, 0); RING.visible = true; const U = HERO.userData; U.arms[1].rotation.set(-2.0, 0, 0.6); face(HERO, 'shock'); COLUMN.visible = true; COLUMN.position.set(TX, 15, -6.4);
  FX.push(() => { statPanel(t, 1, [3, 4, 5, 2], 1, 1); tint('rgba(255,30,60,A)', 0.12 + 0.08 * Math.sin(t * 40)); uiText('ERRO ERRO ERRO', W / 2, 980, 54, '#ff2d3a', 'center'); });
  const sh = Math.sin(t * 70) * 0.05 + Math.sin(t * 53) * 0.04; return [TX + sh, 2.0 + sh, -2.6, TX, 1.9 + sh, -6.4, 3.8]; };
SHOT['5c'] = (u, t, lt) => { setTown(); put(HERO, TX, 0, -6.4, 0); RING.visible = true; const U = HERO.userData; const k = prog(lt, 0.35, 0.6); U.arms[0].rotation.set(0, 0, -1.4 * k - 0.2); U.arms[1].rotation.set(0, 0, 1.4 * k + 0.2); face(HERO, 'happyc'); COLUMN.visible = true; COLUMN.position.set(TX, 15, -6.4); COLUMN.material.opacity = 0.07; fxLight.position.set(TX, 2.5, -5.6); fxLight.color.set('#ffd23f'); fxLight.intensity = 4;
  FX.push(() => { flash(0.9 * (1 - prog(lt, 0.3, 0.55)) * prog(lt, 0.05, 0.3)); const p = PW(U.head); glow(p[0], p[1] + 150, 700, '255,210,63', 0.25); const r = rng(5); for (let i = 0; i < 30; i++) sparkle(r() * W, (r() * H + lt * 300) % H, 12 + r() * 14, t * 2 + i, '#ffd23f', 0.8 * k); if (lt > 0.4) notice(t, prog(lt, 0.4, 0.7), 'CLASSE SECRETA', 'DESBLOQUEADA!', '255,210,63', 360); });
  return cam(C(TX, 2.0, -3.6, TX, 2.0, -6.4, 2.8), C(TX, 2.4, -1.4, TX, 2.2, -6.4, 5), prog(lt, 0.35, 1.4)); };
SHOT['6a'] = (u, t, lt) => { setMeadow('gold'); sway(t); put(HERO, 0, 0, 0, 0); RING.visible = true; const U = HERO.userData; U.arms[1].rotation.set(-1.5, 0, 0.6); U.head.rotation.x = 0.25; U.head.rotation.y = -0.3; face(HERO, 'happyc');
  const r = ss(prog(lt, 0.4, 1.8)); put(ASSASSIN, 0.9, lerp(-2.4, 0, r), -3.2, -0.2);
  FX.push(() => { const p = PW(U.arms[1].children[1]); glow(p[0], p[1], 160, '255,210,63', 0.6); if (lt > 1.2) sceneText('PERIGO!', t, TAKE0 + 1.2, '#ff2d3a', 330, 130); });
  return [0.1, 1.75, 2.6, 0.3, 1.6, -1, lerp(2.6, 5.8, ss(prog(lt, 0.8, 1.8)))]; };
SHOT['6b'] = (u, t, lt) => { setMeadow('gold'); sway(t); put(ASSASSIN, 0.9, 0, -3.2, 0.1); const U = ASSASSIN.userData; U.arms[0].rotation.set(-1.3, 0, -0.5); U.arms[1].rotation.set(-1.3, 0, 0.5); DAGGERS.forEach((d, i) => d.rotation.set(0, 0, t * 14 * (i ? 1 : -1))); U.head.rotation.z = Math.sin(lt * 2) * 0.12;
  FX.push(() => { const p = PW(U.head); glow(p[0] - 24, p[1], 60, '255,45,58', 0.6); glow(p[0] + 24, p[1], 60, '255,45,58', 0.6); }); return cam(C(0.8, 1.0, -0.4, 0.9, 2.3, -3.2, 3), C(0.85, 1.4, -1.4, 0.9, 2.3, -3.2, 1.9), u); };
function slimeAt(x, z, t, hop = 0, sc = 1) { SLIME.visible = true; const ph = (t * 2.2) % 1; const y = hop ? Math.sin(ph * Math.PI) * 0.45 * hop : 0; const sq = hop ? (ph < 0.1 || ph > 0.9 ? 0.8 : 1.05) : 1 + Math.sin(t * 4) * 0.04; SLIME.position.set(x, y, z); SLIME.scale.set(sc / Math.sqrt(sq), sc * sq, sc / Math.sqrt(sq)); SLIME.rotation.set(0, Math.atan2(-x, -z) * 0.6, 0); }
SHOT['6c'] = (u, t, lt) => { setMeadow('gold'); sway(t); put(HERO, 0, 0, 0, 0); RING.visible = true; face(HERO, 'worry'); put(ASSASSIN, 0.9, 0, -3.2, 0.1);
  const k = ss(prog(lt, 0, 3.4)); slimeAt(lerp(-2.6, -0.3, k), lerp(-0.4, 0.55, k), t, k < 1 ? 1 : 0);
  FX.push(() => { const p = PW(SLB); glow(p[0], p[1], 160, '63,169,245', 0.35); if (lt > 3.6 && (lt % 1.6) < 0.15) { /* blink */ } });
  return cam(C(0.9, 0.35, 2.2, -0.6, 0.35, 0, 2.2), C(0.5, 0.45, 1.9, -0.3, 0.4, 0.4, 1.6), u); };
SHOT['7a'] = (u, t, lt) => { setMeadow('gold'); sway(t, 2); const d = ss(prog(lt, 0.15, 1.0)); put(ASSASSIN, lerp(3.2, -3.2, d), 0, lerp(-2.6, 1.4, d), -2.2); ASSASSIN.userData.arms[1].rotation.set(-2.2, 0, 0.3); ASSASSIN.userData.body.rotation.x = 0.4;
  put(HERO, 0, 0, 0, 0.4); RING.visible = true; const dodge = Math.sin(clamp(lt / 1.3) * Math.PI); HERO.userData.body.rotation.z = 0.7 * dodge; HERO.position.x = -0.4 * dodge; HERO.userData.arms[0].rotation.set(-2.4 * dodge, 0, -0.4); face(HERO, 'shock'); slimeAt(-0.3, 0.55, t);
  FX.push(() => { hLines(1 - prog(lt, 0.9, 1.4), t * 24, -1); const p = PW(HERO.userData.arms[1].children[1]); glow(p[0], p[1], 220, '255,210,63', 0.7 * dodge); });
  return [0, 1.3, 5.4 - u * 0.6, 0, 1.2, 0, 5.2]; };
SHOT['7b'] = (u, t, lt) => { setMeadow('gold'); sway(t, 1.5); put(HERO, -0.2, 0, -0.2, 0.3); RING.visible = true; face(HERO, 'shock'); put(ASSASSIN, -2.6, 0, 1.8, 1.0); ASSASSIN.userData.arms[1].rotation.set(-1.4, 0, 0.3);
  const g = prog(lt, 0.2, 2.2); slimeAt(-0.3, 0.9, t, 0, lerp(1, 2.0, ss(g))); slimeMat.emissiveIntensity = 0.45 + 2.5 * g; fxLight2.position.set(-0.3, 0.6, 1.2); fxLight2.intensity = 10 * g;
  FX.push(() => { const p = PW(SLB); glow(p[0], p[1], 300 + 400 * g, '120,220,255', 0.5 * g + 0.2); motes(t, 50, '140,230,255', 11, 0.8 * g, 120); });
  const a = lerp(0.9, -0.2, u); return [-0.3 + Math.sin(a) * 2.6, 0.5, 0.9 + Math.cos(a) * 2.6, -0.3, 0.6, 0.9, 2.6]; };
SHOT['7c'] = (u, t, lt) => { setMeadow('gold'); sway(t, 2.5); put(HERO, -0.2, 0, -0.2, 0.3); RING.visible = true; face(HERO, 'shock'); const b = prog(lt, 0.15, 1.2);
  put(ASSASSIN, lerp(-2.6, -9, ss(b)), Math.sin(b * Math.PI) * 2.2, lerp(1.8, 6, ss(b)), 1.0); ASSASSIN.rotation.z = b * 5; slimeAt(-0.3, 0.9, t, 0, lerp(2, 1.2, b)); slimeMat.emissiveIntensity = 3 - 2 * b;
  WAVE.visible = b > 0 && b < 1; WAVE.position.set(-0.3, 0.3, 0.9); WAVE.scale.setScalar(0.5 + b * 9); WAVE.material.opacity = 0.9 * (1 - b);
  FX.push(() => { flash(0.6 * (1 - prog(lt, 0.15, 0.5)), '140,230,255'); if (lt > 1.0) notice(t, prog(lt, 1.0, 1.3), 'HABILIDADE: ???', 'NÃO IDENTIFICADA', '56,214,255', 1000); if (lt > 0.4) sceneText('HABILIDADE DESCONHECIDA!', t, TAKE0 + 0.4, '#8ff7ff', 300, 84); });
  const sh = (1 - prog(lt, 0.15, 0.9)) * 0.08 * Math.sin(t * 80); return [0.8 + sh, 1.6 + sh, 5.2, -0.5, 1.0, 0.5, 5]; };
SHOT['8a'] = (u, t, lt) => { setMeadow('dark'); sway(t, 0.6); put(HERO, 0, 0, 0, Math.PI); RING.visible = true; slimeAt(-0.6, -0.3, t, 0, 0.9); SLIME.rotation.y = Math.PI;
  BEAST.visible = true; BEAST.position.set(0, lerp(-14, -1, ss(prog(lt, 0, 2.0))), -24); BEAST.rotation.set(0, 0, Math.sin(t) * 0.03);
  FX.push(() => { const e = P(0, BEAST.position.y + 13, -20.4); glow(e[0], e[1], 260, '255,225,74', 0.4); }); const sh = Math.sin(t * 50) * 0.03 * (1 - u);
  return cam(C(0.3 + sh, 1.4, 2.6, 0, 3, -20, 3), C(0, 2.2, 8, 0, 6.5, -20, 8), u); };
SHOT['8b'] = (u, t, lt) => { setMeadow('dark'); sway(t, 0.6); put(HERO, 0, 0, 0, 0); RING.visible = true; face(HERO, 'stern'); const U = HERO.userData; U.arms[1].rotation.set(-0.9, 0, 0.4); BEAST.visible = true; BEAST.position.set(0, -1, -24);
  const sh = wpos(U.arms[1]); const j = ss(prog(lt, 0, 0.6)); SLIME.visible = true; SLIME.position.set(lerp(-0.6, sh.x + 0.05, j), lerp(0, sh.y + 0.12, j) + Math.sin(j * Math.PI) * 0.6, lerp(-0.3, sh.z, j)); SLIME.scale.setScalar(0.45); SLIME.rotation.set(0, 0, 0);
  fxLight.position.set(0.4, 1.3, 0.6); fxLight.color.set('#ffd23f'); fxLight.intensity = 1.5;
  FX.push(() => { const p = PW(U.arms[1].children[1]); glow(p[0], p[1], 200, '255,210,63', 0.5); notice(t, prog(lt, 0.5, 0.8), 'NÍVEL ???', 'DESBLOQUEADO', '255,210,63', 1050); sceneText('O VERDADEIRO PODER!', t, TAKE0 + 0.3, '#ffd23f', 300, 96); });
  return cam(C(0, 1.7, 3.4, 0, 1.6, 0, 3.4), C(0, 1.75, 2.5, 0, 1.6, 0, 2.5), u); };
SHOT['8c'] = (u, t, lt) => { setMeadow('dark'); const L = TAKE1 - TAKE0; const creature = lt > L - 2.6;
  if (!creature) { put(HERO, 0, 0, 0, 0); RING.visible = true; face(HERO, 'stern'); fxLight.position.set(0.3, 2.2, 1.2); fxLight.color.set('#ffd23f'); fxLight.intensity = 2; BEAST.visible = true; BEAST.position.set(0, -1, -24);
    FX.push(() => { const p = PW(HERO.userData.head); glow(p[0], p[1] + 10, 260, '255,210,63', 0.35 + 0.1 * Math.sin(t * 8)); });
    const k = ss(clamp(lt / (L - 2.6))); return [0, 2.05, lerp(2.2, 1.25, k), 0, 2.0, 0, lerp(2.2, 1.25, k)]; }
  BEAST.visible = true; BEAST.position.set(0, -1, -24); const k = lt - (L - 2.6);
  FX.push(() => { const blink = (k > 0.9 && k < 1.05); if (blink) tint('rgba(0,0,0,A)', 0.6); if (k > 1.2) { O.fillStyle = `rgba(0,0,0,${0.6 * prog(k, 1.2, 1.6)})`; O.fillRect(0, 0, W, H); bigText('PARTE 2?', 900, backOut(prog(k, 1.3, 1.6)), 150, '#ffd23f'); } });
  return [0, 12.3, -15 - k * 0.3, 0, 12.4, -24, 4]; };

// ================= FRAME =================
let TAKE0 = 0, TAKE1 = 0;
function renderFrame(i) {
  const t = i / 24; reset(); FX = [];
  let k = TAKES.findIndex((x) => t >= x[1] && t < x[2]); if (k < 0) k = TAKES.length - 1;
  const [id, a, b] = TAKES[k]; TAKE0 = a; TAKE1 = b; const lt = t - a, u = clamp(lt / (b - a));
  const c = SHOT[id](u, t, lt);
  camera.position.set(c[0], c[1], c[2]); camera.lookAt(c[3], c[4], c[5]);
  sun.position.set(c[3] + 10, c[4] + 18, c[5] + 12); sun.target.position.set(c[3], 0, c[5]); sun.target.updateMatrixWorld();
  bokeh.uniforms.focus.value = c[6]; bokeh.uniforms.aperture.value = c[6] < 2.5 ? 0.005 : 0.0022;
  composer.render();
  O.globalCompositeOperation = 'source-over'; O.globalAlpha = 1; O.drawImage(renderer.domElement, 0, 0);
  FX.forEach((fn) => { O.save(); fn(); O.restore(); });
  // quick whoosh-zoom transition at each take start (feels like a cut with energy)
  if (lt < 0.12 && k > 0) { const img = O.getImageData(0, 0, 1, 1); O.save(); O.globalAlpha = 0.25 * (1 - lt / 0.12); O.fillStyle = '#ffffff'; O.fillRect(0, 0, W, H); O.restore(); }
  const v = O.createRadialGradient(W / 2, H * 0.45, W * 0.45, W / 2, H / 2, H * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(5,5,20,.42)'); O.fillStyle = v; O.fillRect(0, 0, W, H);
  return out.toDataURL('image/jpeg', 0.9);
}
window.renderFrame = renderFrame; window.ready = true;
