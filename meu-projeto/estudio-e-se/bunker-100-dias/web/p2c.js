
// ---------- BUNKER (original): concrete room at x = 500, door on the +z wall
const BX = 500;
const BUNKL = []; const BUNK = { add(o) { o.position.x += BX; scene.add(o); BUNKL.push(o); return o; }, set visible(v) { BUNKL.forEach((o) => (o.visible = v)); } };
const CONC = tex(512, 512, (g) => { g.fillStyle = '#8d8a96'; g.fillRect(0, 0, 512, 512); const r = rng(7); for (let i = 0; i < 9000; i++) { const v = 110 + r() * 60; g.fillStyle = `rgba(${v},${v},${v + 10},.18)`; g.fillRect(r() * 512, r() * 512, 2 + r() * 3, 2 + r() * 3); } g.strokeStyle = 'rgba(40,36,50,.35)'; g.lineWidth = 3; for (let y = 0; y < 512; y += 128) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); } for (let i = 0; i < 6; i++) { g.strokeStyle = 'rgba(40,36,50,.25)'; g.lineWidth = 1.5; g.beginPath(); let x = r() * 512, y = r() * 512; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (r() - 0.5) * 60; y += r() * 40; g.lineTo(x, y); } g.stroke(); } });
CONC.wrapS = CONC.wrapT = THREE.RepeatWrapping; CONC.repeat.set(3, 2);
const concM = new THREE.MeshStandardMaterial({ map: CONC, roughness: 0.92 });
{
  const fl = M(new THREE.PlaneGeometry(10, 12), new THREE.MeshStandardMaterial({ color: '#6b6576', roughness: 0.8 })); fl.rotation.x = -Math.PI / 2; BUNK.add(fl);
  const ce = M(new THREE.PlaneGeometry(10, 12), concM); ce.rotation.x = Math.PI / 2; ce.position.y = 3.6; BUNK.add(ce);
  const wall = (w, p, ry) => { const m = M(new THREE.PlaneGeometry(w, 3.6), concM); m.position.set(...p); m.rotation.y = ry; BUNK.add(m); };
  wall(10, [0, 1.8, -6], 0); wall(10, [0, 1.8, 6], Math.PI); wall(12, [-5, 1.8, 0], Math.PI / 2); wall(12, [5, 1.8, 0], -Math.PI / 2);
  for (let i = 0; i < 3; i++) { const p = M(new THREE.CylinderGeometry(0.08, 0.08, 12, 10), mat('#7a6a5a', 0.4, { metalness: 0.6 }), [-3.5 + i * 0.25, 3.4, 0]); p.rotation.x = Math.PI / 2; BUNK.add(p); }
  // hazard stripes along the floor
  const HZ = tex(256, 32, (g) => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#1c1222' : '#ffd23f'; g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32 + 32, 0); g.lineTo(i * 32 + 16, 32); g.lineTo(i * 32 - 16, 32); g.fill(); } });
  const hz = new THREE.Mesh(new THREE.PlaneGeometry(10, 0.25), new THREE.MeshStandardMaterial({ map: HZ })); hz.position.set(0, 0.13, -5.98); BUNK.add(hz);
  // bunk bed (left)
  for (const y of [0.45, 1.55]) { BUNK.add(box(1.0, 0.18, 2.1, '#5c4033', [-4.3, y, -2.5])); BUNK.add(box(0.9, 0.14, 2.0, '#3a86ff', [-4.3, y + 0.15, -2.5], 0.9)); BUNK.add(box(0.5, 0.12, 0.35, '#ffffff', [-4.3, y + 0.28, -3.3], 0.9)); }
  for (const [x, z] of [[-3.8, -1.45], [-4.8, -1.45], [-3.8, -3.55], [-4.8, -3.55]]) BUNK.add(box(0.08, 2.0, 0.08, '#5c4033', [x, 1.0, z]));
  // crate table + mattress
  BUNK.add(box(1.0, 0.6, 0.8, '#a47148', [0.4, 0.3, -0.4], 0.8)); BUNK.add(box(1.8, 0.16, 1.2, '#ff8fab', [-1.2, 0.08, 1.6], 0.9));
  // grandpa's rule on the wall
  const RULE = tex(512, 400, (g) => { g.fillStyle = '#fff3d6'; g.fillRect(0, 0, 512, 400); g.fillStyle = '#c1121f'; g.font = '700 50px "Comic Sans MS", cursive'; g.textAlign = 'center'; g.fillText('REGRA DO VOVÔ:', 256, 80); g.fillStyle = '#1c1222'; g.font = '700 46px "Comic Sans MS", cursive'; g.fillText('1 LATA ABERTA =', 256, 170); g.fillText('1 PERGUNTA', 256, 240); g.fillText('SINCERA! 🥫', 256, 310); });
  const rule = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.86), new THREE.MeshStandardMaterial({ map: RULE, roughness: 0.9 })); rule.position.set(2.2, 2.95, -5.97); BUNK.add(rule); window.RULE_POS = [BX + 2.2, 2.95, -5.97];
  // tally-mark calendar wall (right)
  const CAL = tex(512, 512, (g) => { g.clearRect(0, 0, 512, 512); g.strokeStyle = 'rgba(30,20,40,.85)'; g.lineWidth = 7; g.lineCap = 'round'; for (let k = 0; k < 20; k++) { const x0 = 20 + (k % 5) * 98, y0 = 20 + Math.floor(k / 5) * 120; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(x0 + i * 18, y0); g.lineTo(x0 + i * 18 + 3, y0 + 80); g.stroke(); } g.beginPath(); g.moveTo(x0 - 6, y0 + 60); g.lineTo(x0 + 70, y0 + 16); g.stroke(); } });
  const cal = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), new THREE.MeshBasicMaterial({ map: CAL, transparent: true })); cal.position.set(4.97, 1.8, -2.5); cal.rotation.y = -Math.PI / 2; BUNK.add(cal);
  // radio
  BUNK.add(box(0.5, 0.3, 0.25, '#9b2226', [0.4, 0.75, -0.55], 0.5)); BUNK.add(M(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16), mat('#1c1222'), [0.3, 0.75, -0.42]));
}
// cans (instanced): shelves along the back wall + a mountain in the corner
const CAN_TEX = tex(256, 128, (g) => { g.fillStyle = '#d62828'; g.fillRect(0, 0, 256, 128); g.fillStyle = '#ffd23f'; g.fillRect(0, 44, 256, 40); g.fillStyle = '#d62828'; g.font = '900 30px Arial Black, Arial'; g.textAlign = 'center'; g.fillText('SALSICHA', 128, 74); g.fillStyle = '#e9d8c4'; for (let i = 0; i < 4; i++) { g.beginPath(); g.roundRect(20 + i * 60, 92, 40, 16, 8); g.fill(); } });
const canGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.22, 18);
const canMats = [new THREE.MeshStandardMaterial({ map: CAN_TEX, roughness: 0.35, metalness: 0.3 }), new THREE.MeshStandardMaterial({ color: '#c9ced6', roughness: 0.25, metalness: 0.9 }), new THREE.MeshStandardMaterial({ color: '#c9ced6', roughness: 0.25, metalness: 0.9 })];
const CAN_N = 320, cans = new THREE.InstancedMesh(canGeo, canMats, CAN_N); cans.castShadow = true; cans.receiveShadow = true; BUNK.add(cans);
{
  let i = 0; const r = rng(19);
  for (let sh = 0; sh < 4; sh++) { BUNK.add(box(4.2, 0.06, 0.45, '#6c584c', [2.1 - 1.2, 0.5 + sh * 0.62, -5.7])); for (let k = 0; k < 17 && i < 150; k++, i++) { DUMMY.position.set(-1.1 + k * 0.24, 0.64 + sh * 0.62, -5.7); DUMMY.rotation.set(0, r() * 6, 0); DUMMY.scale.setScalar(1); DUMMY.updateMatrix(); cans.setMatrixAt(i, DUMMY.matrix); } }
  for (let lv = 0; lv < 12 && i < CAN_N; lv++) { const R = 1.5 * (1 - lv / 12); for (let gx = -R; gx <= R && i < CAN_N; gx += 0.23) for (let gz = -R; gz <= R && i < CAN_N; gz += 0.23) { if (gx * gx + gz * gz > R * R) continue; DUMMY.position.set(3.3 + gx + (lv % 2) * 0.11, 0.11 + lv * 0.22, -4.4 + gz * 0.7); DUMMY.rotation.set(r() < 0.12 ? Math.PI / 2 : 0, r() * 6, 0); DUMMY.scale.setScalar(1); DUMMY.updateMatrix(); cans.setMatrixAt(i++, DUMMY.matrix); } }
  for (; i < CAN_N; i++) { DUMMY.scale.setScalar(0); DUMMY.updateMatrix(); cans.setMatrixAt(i, DUMMY.matrix); }
  cans.instanceMatrix.needsUpdate = true;
}
const openCan = new THREE.Group(); { const c = new THREE.Mesh(canGeo, canMats); openCan.add(c); const lid = M(new THREE.CylinderGeometry(0.105, 0.105, 0.012, 18), mat('#e9ecef', 0.2, { metalness: 0.9 }), [0, 0.115, 0]); openCan.add(lid); openCan.userData.lid = lid; for (let i = 0; i < 4; i++) openCan.add(M(new THREE.CapsuleGeometry(0.025, 0.12, 4, 8), mat('#e9a178', 0.5), [-0.045 + i * 0.03, 0.12, 0])); scene.add(openCan); }
// pineapple curtain + toilet (right front corner)
const PINE = tex(512, 512, (g) => { g.fillStyle = '#9be7ff'; g.fillRect(0, 0, 512, 512); for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) { const cx = 50 + x * 104 + (y % 2) * 52, cy = 60 + y * 100; g.fillStyle = '#2d6a4f'; for (let k = -1; k <= 1; k++) { g.beginPath(); g.ellipse(cx + k * 10, cy - 34, 7, 20, k * 0.5, 0, 7); g.fill(); } g.fillStyle = '#ffd23f'; g.beginPath(); g.ellipse(cx, cy, 24, 30, 0, 0, 7); g.fill(); g.strokeStyle = '#e09f1f'; g.lineWidth = 3; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(cx - 22, cy + k * 10); g.lineTo(cx + 22, cy + k * 10 + 8); g.stroke(); } } });
const curtain = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.4, 24, 1), new THREE.MeshStandardMaterial({ map: PINE, side: THREE.DoubleSide, roughness: 0.8 })); curtain.position.set(BX + 3.9, 1.3, 3.2); curtain.rotation.y = -Math.PI / 2; scene.add(curtain);
const curtainBase = curtain.geometry.attributes.position.array.slice();
function curtainWave(f, open = 0) { const p = curtain.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const x = curtainBase[i * 3]; const sq = lerp(1, 0.35, open); p.setX(i, -0.8 + (x + 0.8) * sq); p.setZ(i, Math.sin(x * 9 + f * 0.08) * 0.05 * (1 + open)); } p.needsUpdate = true; curtain.geometry.computeVertexNormals(); }
BUNK.add(M(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 8), mat('#adb5bd', 0.3, { metalness: 0.8 }), [3.9, 2.52, 3.2])).rotation.x = Math.PI / 2;
{ const t = new THREE.Group(); t.position.set(4.5, 0, 3.2); t.add(M(new THREE.CylinderGeometry(0.22, 0.17, 0.42, 20), mat('#ffffff', 0.25), [0, 0.21, 0])); t.add(box(0.42, 0.45, 0.18, '#ffffff', [0.23, 0.6, 0], 0.25)); t.rotation.y = -Math.PI / 2; BUNK.add(t); }
// the vault door (round, on the +z wall, hinge on the left)
function makeVault() {
  const pivot = new THREE.Group(); const d = new THREE.Group(); d.position.x = 1.5; pivot.add(d);
  const steel = mat('#9aa1ad', 0.3, { metalness: 0.85 }), dark = mat('#4a4e57', 0.4, { metalness: 0.8 }), brass = mat('#c9a227', 0.25, { metalness: 0.9 });
  const disc = M(new THREE.CylinderGeometry(1.45, 1.45, 0.35, 48), steel); disc.rotation.x = Math.PI / 2; d.add(disc);
  const ring = M(new THREE.TorusGeometry(1.2, 0.07, 10, 48), dark, [0, 0, 0.19]); d.add(ring);
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; d.add(M(new THREE.SphereGeometry(0.06, 10, 8), dark, [Math.cos(a) * 1.32, Math.sin(a) * 1.32, 0.18])); }
  const wheel = new THREE.Group(); wheel.position.z = 0.32; d.add(wheel); wheel.add(M(new THREE.TorusGeometry(0.42, 0.05, 10, 32), brass));
  for (let i = 0; i < 3; i++) { const s = M(new THREE.BoxGeometry(0.84, 0.06, 0.06), brass); s.rotation.z = i * Math.PI / 3; wheel.add(s); }
  wheel.add(M(new THREE.CylinderGeometry(0.1, 0.1, 0.12, 16), brass)).rotation.x = Math.PI / 2;
  const back = M(new THREE.CylinderGeometry(1.45, 1.45, 0.02, 48), dark, [0, 0, -0.18]); back.rotation.x = Math.PI / 2; d.add(back);
  pivot.userData = { wheel, d }; return pivot;
}
const vault = makeVault(); vault.position.set(BX - 1.5, 1.55, 5.85); vault.rotation.y = Math.PI; scene.add(vault); // seen from inside
const frameV = M(new THREE.TorusGeometry(1.55, 0.16, 12, 48), mat('#5c5f68', 0.4, { metalness: 0.8 }), [BX, 1.55, 5.9]); scene.add(frameV);
const sunLight = new THREE.SpotLight('#fff1c4', 0, 30, 0.7, 0.5, 1.2); sunLight.position.set(BX, 1.6, 8); sunLight.target.position.set(BX, 0, 0); scene.add(sunLight); scene.add(sunLight.target);
const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(1.42, 48), new THREE.MeshBasicMaterial({ color: '#fff6dc' })); sunDisc.position.set(BX, 1.55, 5.95); sunDisc.rotation.y = Math.PI; scene.add(sunDisc);
const lamp = new THREE.PointLight('#ffb35c', 0, 14, 1.4); lamp.position.set(BX, 3.1, 0); scene.add(lamp);
const bulb = M(new THREE.SphereGeometry(0.12, 12, 10), mat('#fff3c4', 0.2, { emissive: '#ffd08a', emissiveIntensity: 3 }), [BX, 3.2, 0]); bulb.castShadow = false; scene.add(bulb);

// ---------- outdoor: the grandpa's bunker entrance (concrete block with a round door) + asteroid
const ENT = new THREE.Group(); ENT.position.set(0, 0, -78); scene.add(ENT);
{ ENT.add(box(6, 4.2, 4, '#7d7a86', [0, 2.1, -2], 0.9)); const v = makeVault(); v.position.set(-1.5, 1.6, 0.05); v.scale.setScalar(0.85); ENT.add(v); ENT.userData.vault = v; ENT.add(M(new THREE.TorusGeometry(1.35, 0.14, 10, 40), mat('#5c5f68', 0.4, { metalness: 0.8 }), [0, 1.6, 0.06])); const sg = tex(256, 64, (g) => { g.fillStyle = '#ffd23f'; g.fillRect(0, 0, 256, 64); g.fillStyle = '#1c1222'; g.font = '900 40px Arial Black'; g.textAlign = 'center'; g.fillText('VOVÔ ☢', 128, 46); }); const s = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), new THREE.MeshBasicMaterial({ map: sg })); s.position.set(0, 3.6, 0.03); ENT.add(s); }
const asteroid = new THREE.Group(); scene.add(asteroid);
{ const rock = M(new THREE.DodecahedronGeometry(6, 1), mat('#5a3a2a', 0.95, { flatShading: true, emissive: '#ff4d00', emissiveIntensity: 0.35 })); asteroid.add(rock); asteroid.userData.rock = rock; }
const SKY_RED = tex(64, 1024, (g) => { const gr = g.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, '#2b0a1a'); gr.addColorStop(0.5, '#8a1c1c'); gr.addColorStop(0.8, '#ff6a00'); gr.addColorStop(1, '#ffc46b'); g.fillStyle = gr; g.fillRect(0, 0, 64, 1024); });

// ---------- characters: the bolinha (civ) and Lívia (original)
const livia = kid({ skin: '#f1d9cf', hair: '#5a2e1a', style: 'long', bow: '#ffd23f', top: '#ff6f91', top2: '#ffc2d1', legs: '#3d405b', shoes: '#ffffff', hands: '#f1d9cf' }); scene.add(livia);
livia.userData.sc = 0.95;
const earbuds = new THREE.Group(); scene.add(earbuds);
function holdHands(a, b, t = 1) { // a's right arm and b's left arm reach toward each other
  a.userData.arms[1].rotation.set(-0.3 * t, 0, 0.18 + 0.55 * t); b.userData.arms[0].rotation.set(-0.3 * t, 0, -0.18 - 0.55 * t);
}
