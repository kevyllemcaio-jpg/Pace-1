
// ---------- "O gigante atrás da gente" — one endless cliff, blocky climbers, one continuous camera
const BASE = scene.children.filter((o) => !o.isLight);
camera.far = 1500; camera.near = 0.02; camera.updateProjectionMatrix();
// rock wall (z = 0, facing +z)
const ROCK = tex(1024, 1024, (g) => { g.fillStyle = '#b07a4a'; g.fillRect(0, 0, 1024, 1024); const r = rng(5); for (let i = 0; i < 2600; i++) { const v = r(); g.fillStyle = v < 0.5 ? `rgba(90,50,25,${0.12 + r() * 0.15})` : `rgba(230,180,130,${0.08 + r() * 0.12})`; g.beginPath(); g.ellipse(r() * 1024, r() * 1024, 6 + r() * 40, 3 + r() * 14, r() * 3, 0, 7); g.fill(); } g.strokeStyle = 'rgba(60,30,15,.45)'; g.lineWidth = 3; for (let i = 0; i < 30; i++) { let x = r() * 1024, y = r() * 1024; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 8; k++) { x += (r() - 0.5) * 70; y += r() * 50; g.lineTo(x, y); } g.stroke(); } });
ROCK.wrapS = ROCK.wrapT = THREE.RepeatWrapping; ROCK.repeat.set(5, 14);
const WALL = M(new THREE.PlaneGeometry(60, 260), new THREE.MeshStandardMaterial({ map: ROCK, roughness: 0.95 })); WALL.position.set(0, 90, 0); scene.add(WALL);
// colorful holds, ropes, ledges (the hanging town, y -10..45)
const HOLD_N = 420; const holds = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 0.1, 0.14), new THREE.MeshStandardMaterial({ roughness: 0.5 }), HOLD_N); scene.add(holds);
{ const r = rng(17), c = new THREE.Color(), cols = ['#ff5fa2', '#ffd23f', '#4cc9f0', '#8ce95a', '#c77dff', '#ff8c42']; for (let i = 0; i < HOLD_N; i++) { DUMMY.position.set((r() - 0.5) * 24, -12 + r() * 64, 0.06); DUMMY.rotation.set(0, 0, r() * 3); DUMMY.scale.set(1 + r(), 1, 1); DUMMY.updateMatrix(); holds.setMatrixAt(i, DUMMY.matrix); c.set(cols[i % 6]); holds.setColorAt(i, c); } holds.instanceMatrix.needsUpdate = true; holds.instanceColor.needsUpdate = true; }
const ropeM = mat('#d9b77e', 0.85);
for (const x of [-9, -6.5, -3.2, -0.6, 1.6, 3.4, 5.4, 8, 10.5]) { const r = M(new THREE.CylinderGeometry(0.035, 0.035, 80, 6), ropeM, [x, 20, 0.12]); scene.add(r); for (let y = -12; y < 58; y += 1.4) scene.add(M(new THREE.SphereGeometry(0.07, 8, 6), ropeM, [x, y, 0.12])); }
const LEDGES = [[4, 5.6, 1.6], [-3, 7.4, 2.0], [-5, 15.4, 1.6], [2, 18.4, 1.6], [6, 16.4, 1.6], [-1.5, 21.0, 1.4]];
for (const [x, y, w] of LEDGES) scene.add(box(w, 0.12, 0.5, '#7a4a28', [x, y, 0.25], 0.9));
// hammocks (curved nets) with sleepers
function hammock(x, y) { const g = new THREE.Group(); g.position.set(x, y, 0.45); const net = M(new THREE.CylinderGeometry(0.42, 0.42, 1.8, 16, 1, true, Math.PI * 0.5, Math.PI), new THREE.MeshStandardMaterial({ color: '#ff8fab', roughness: 0.8, side: THREE.DoubleSide })); net.rotation.z = Math.PI / 2; g.add(net); for (const sx of [-1, 1]) g.add(M(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 4), ropeM, [sx * 1.0, 0.35, -0.2])); scene.add(g); return g; }
const HAMMOCKS = [hammock(-5, 16.6), hammock(2, 19.6), hammock(6, 17.6)];
// clouds below (the only "ground")
const CLOUDS = new THREE.Group(); scene.add(CLOUDS);
{ const r = rng(9), cm = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, emissive: '#ffffff', emissiveIntensity: 0.15 }); for (let i = 0; i < 70; i++) { const s = M(new THREE.SphereGeometry(3 + r() * 5, 16, 12), cm, [(r() - 0.5) * 70, -14 - r() * 8, (r() - 0.2) * 40]); s.scale.y = 0.55; s.castShadow = false; CLOUDS.add(s); } }
// holes in perfect rows (the tiny people's pegs), y 95..122
const HOLE_N = 1400; const holes = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 8), mat('#2a160a', 0.9), HOLE_N); scene.add(holes);
{ let i = 0; for (let row = 0; row < 70 && i < HOLE_N; row++) for (let c = 0; c < 20 && i < HOLE_N; c++, i++) { DUMMY.position.set(-0.95 + c * 0.1 + (row % 2) * 0.05, 95 + row * 0.4, 0.004); DUMMY.rotation.set(Math.PI / 2, 0, 0); DUMMY.scale.setScalar(1); DUMMY.updateMatrix(); holes.setMatrixAt(i, DUMMY.matrix); } holes.instanceMatrix.needsUpdate = true; }
// the tiny people's ledge at y 122.5 (everything x0.07)
const TY = 122.5, TS = 0.07;
const TINY = new THREE.Group(); TINY.position.set(0.55, TY, 0); scene.add(TINY);
TINY.add(box(0.6, 0.012, 0.09, '#7a4a28', [0, 0, 0.045], 0.9));
for (const x of [-0.25, 0.05]) { const n = M(new THREE.CylinderGeometry(0.03, 0.03, 0.13, 12, 1, true, Math.PI * 0.5, Math.PI), new THREE.MeshStandardMaterial({ color: '#4cc9f0', side: THREE.DoubleSide }), [x, 0.09, 0.05]); n.rotation.z = Math.PI / 2; TINY.add(n); }
const TPEOPLE = [];
// cast (blocky)
const B = (o, sc = 1) => { const k = blocky(o); k.userData.sc = sc; scene.add(k); return k; };
const ME = B({ skin: '#f4eef2', top: '#F2B705', top2: '#d99e00', legs: '#1F4E9C', shoes: '#ffffff', hands: '#ffffff' });
const NINA = B({ skin: '#c68642', hair: '#2b1d14', style: 'buns', top: '#ff8fab', top2: '#ffd23f', legs: '#6a4c93', shoes: '#ffffff', hands: '#c68642' });
const ORLANDO = B({ skin: '#e0ac69', hair: '#d9d9d9', style: 'short', fringe: false, top: '#6c757d', top2: '#adb5bd', legs: '#3d405b', shoes: '#5c3a21', hands: '#e0ac69', glasses: true }, 1.15);
const FOLK = [
  ['#ffdbac', '#7f4f24', 'short', '#2a9d8f', 1.15], ['#8d5524', '#1b1b1b', 'bob', '#e76f51', 1.15], ['#e0ac69', '#3b2416', 'long', '#8338ec', 1.1], ['#f1c27d', '#2b1d14', 'short', '#ffbe0b', 0.9],
  ['#c68642', '#000', 'pony', '#06d6a0', 0.9], ['#ffdbac', '#d4a373', 'buns', '#ff006e', 0.9], ['#8d5524', '#2b1d14', 'short', '#3a86ff', 0.9], ['#ffdbac', '#9a6a3a', 'bob', '#ef476f', 1.15],
  ['#f1c27d', '#3b2416', 'short', '#118ab2', 1.1], ['#e0ac69', '#000', 'long', '#ffd166', 1.1],
].map(([skin, hair, style, top, sc]) => B({ skin, hair, style, top, legs: '#2b2d42', shoes: '#fff', hands: skin }, sc));
const BABY = B({ skin: '#ffdbac', hair: '#d4a373', style: 'short', top: '#ffffff', legs: '#ffffff', shoes: '#ffffff', hands: '#ffdbac' }, 0.4);
const PACK = box(0.5, 0.5, 0.3, '#e76f51', [0, 0, 0], 0.7); scene.add(PACK);
const APPLE = M(new THREE.SphereGeometry(0.11, 14, 10), mat('#e63946', 0.4)); scene.add(APPLE);
const BOARD = box(0.7, 0.5, 0.04, '#2f5d50', [0, 0, 0], 0.8); scene.add(BOARD);
const TIE = M(new THREE.CylinderGeometry(0.02, 0.02, 1.0, 6), mat('#ff5fa2', 0.6)); scene.add(TIE); // rope ME→Nina
// the GIANT below (a blocky giant, grey hoodie) + its hand
const GIANT = B({ skin: '#d8a27a', hair: '#3b2416', style: 'short', top: '#7d8597', top2: '#5c677d', legs: '#33415c', shoes: '#222', hands: '#d8a27a' }, 16);
const GHAND = new THREE.Group(); scene.add(GHAND);
{ const sk = mat('#d8a27a', 0.45); const RBx = (w, h, d, r) => new RoundedBoxGeometry(w, h, d, 3, r); GHAND.add(M(RBx(1, 1.1, 0.4, 0.12), sk)); for (let i = 0; i < 4; i++) GHAND.add(M(RBx(0.22, 0.75, 0.3, 0.08), sk, [-0.36 + i * 0.24, 0.9, 0])); const th = M(RBx(0.25, 0.6, 0.3, 0.08), sk, [-0.62, 0.15, 0.05]); th.rotation.z = 0.7; GHAND.add(th); GHAND.add(M(RBx(0.9, 0.8, 0.5, 0.1), mat('#7d8597', 0.6), [0, -0.85, 0])); }
GHAND.scale.setScalar(9);
const lantern = new THREE.PointLight('#ffcf8a', 0, 9, 1.4); scene.add(lantern);
const tinyLight = new THREE.PointLight('#ffd23f', 0, 1.2, 1.5); scene.add(tinyLight);
function climbPose(k, t, sp = 6, amt = 1) { const s = Math.sin(t * sp); k.userData.arms[0].rotation.set(-2.7 + s * 0.35 * amt, 0, 0.15); k.userData.arms[1].rotation.set(-2.7 - s * 0.35 * amt, 0, -0.15); k.userData.legs[0].rotation.x = -0.5 - s * 0.35 * amt; k.userData.legs[1].rotation.x = -0.5 + s * 0.35 * amt; }
function onWall(k, x, y, t, o = {}) { show(k, x, y, o.z ?? 0.55, Math.PI); if (o.sc) k.scale.setScalar(o.sc); climbPose(k, t + (o.ph || 0), o.sp || 5, o.amt ?? 0.6); setFace(k, o.e || 'happy', o.look || 0); if (o.look3) k.userData.head.rotation.set(o.look3[0], o.look3[1], 0); return k; }
