
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
