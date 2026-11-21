
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
