
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
