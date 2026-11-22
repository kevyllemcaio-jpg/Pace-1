// Reino medieval (estilo motion design 3D): morro com castelo, vila de casas de enxaimel,
// barracas de mercado, rio; quarto de pedra com velas; MÃO em close com a MARCA brilhando; livro antigo.
import * as THREE from 'three';

const cache = new Map();
const M = (cor, o = {}) => { const k = cor + JSON.stringify(o); if (!cache.has(k)) cache.set(k, new THREE.MeshStandardMaterial({ color: cor, roughness: 0.95, ...o })); return cache.get(k); };
function cx(w, h, d, mat, pos, rot = [0, 0, 0]) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(...pos); m.rotation.set(...rot); m.castShadow = true; m.receiveShadow = true; return m; }
function tex(w, h, f) { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }

/** Telhado em prisma. */
function telhado(w, d, h, mat) {
  const s = new THREE.Shape(); s.moveTo(-w / 2 - 0.2, 0); s.lineTo(0, h); s.lineTo(w / 2 + 0.2, 0); s.lineTo(-w / 2 - 0.2, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: d + 0.4, bevelEnabled: false });
  g.translate(0, 0, -(d + 0.4) / 2);
  const m = new THREE.Mesh(g, mat); m.castShadow = true; return m;
}
/** Casa de enxaimel (madeira aparente). */
export function casaEnxaimel({ w = 4, d = 4, h = 5, cor = '#EFE2C6', telhadoCor = '#B5543B' } = {}) {
  const g = new THREE.Group();
  const parede = tex(256, 256, (c, W, H) => { c.fillStyle = cor; c.fillRect(0, 0, W, H); c.strokeStyle = '#5A3A22'; c.lineWidth = 14; c.strokeRect(0, 0, W, H); c.beginPath(); c.moveTo(0, H / 2); c.lineTo(W, H / 2); c.moveTo(W / 3, 0); c.lineTo(W / 3, H); c.moveTo((2 * W) / 3, 0); c.lineTo((2 * W) / 3, H); c.moveTo(0, 0); c.lineTo(W / 3, H / 2); c.moveTo(W, 0); c.lineTo((2 * W) / 3, H / 2); c.stroke(); c.fillStyle = '#3E5A7A'; c.fillRect(W * 0.1, H * 0.12, W * 0.16, H * 0.22); c.fillRect(W * 0.74, H * 0.12, W * 0.16, H * 0.22); c.fillStyle = '#5A3A22'; c.fillRect(W * 0.42, H * 0.6, W * 0.16, H * 0.4); });
  g.add(cx(w, h, d, M('#ffffff', { map: parede }), [0, h / 2, 0]));
  const t = telhado(w, d, h * 0.55, M(telhadoCor)); t.position.y = h; g.add(t);
  return g;
}
/** Torre redonda com teto cônico e bandeira. */
function torre(r, h, pos) {
  const g = new THREE.Group();
  const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.05, h, 20), M('#C9C2B4')); c.position.y = h / 2; c.castShadow = true; g.add(c);
  const tc = new THREE.Mesh(new THREE.ConeGeometry(r * 1.25, r * 2.4, 20), M('#3E5BA9')); tc.position.y = h + r * 1.2; tc.castShadow = true; g.add(tc);
  g.add(cx(0.05, 1.6, 0.05, M('#3A3A3A'), [0, h + r * 2.4 + 0.8, 0]), cx(0.9, 0.5, 0.03, M('#D23B2B'), [0.45, h + r * 2.4 + 1.3, 0]));
  g.position.set(...pos);
  return g;
}
export function castelo3d() {
  const g = new THREE.Group();
  g.add(cx(10, 6, 7, M('#D2CBBD'), [0, 3, 0]));
  for (let i = -4; i <= 4; i += 1.4) g.add(cx(0.7, 0.8, 0.7, M('#D2CBBD'), [i, 6.4, 3.3]));
  g.add(torre(1.4, 10, [-5, 0, 3.5]), torre(1.4, 10, [5, 0, 3.5]), torre(1.8, 14, [0, 0, -1]), torre(1.2, 9, [-5, 0, -3.5]), torre(1.2, 9, [5, 0, -3.5]));
  g.add(cx(2, 3, 0.2, M('#5A3A22'), [0, 1.5, 3.55]));
  return g;
}
/** Reino: morro com castelo, vila, rio e floresta. */
export function criarReino(ctx) {
  const { cena } = ctx;
  const chao = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), M('#7FA35A')); chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; cena.add(chao);
  const morro = new THREE.Mesh(new THREE.SphereGeometry(30, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), M('#86A862')); morro.scale.y = 0.35; morro.position.set(0, 0, -70); morro.receiveShadow = true; cena.add(morro);
  const cast = castelo3d(); cast.position.set(0, 10.2, -70); cast.scale.setScalar(1.3); cena.add(cast);
  // muralha
  for (let a = 0; a < Math.PI * 2; a += 0.12) cena.add(cx(3.2, 2.4, 0.8, M('#CFC6B6'), [Math.cos(a) * 22, 6.5 - Math.abs(Math.sin(a)) * 0, -70 + Math.sin(a) * 22], [0, -a, 0]));
  // vila (casas espalhadas no morro e na frente)
  const cores = [['#EFE2C6', '#B5543B'], ['#E8D3A8', '#8C4A2F'], ['#F2E8D6', '#A33F2E'], ['#E4D1B0', '#6B4A33']];
  let k = 0;
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2, rr = 14 + (i % 3) * 4;
    const c = cores[k++ % 4];
    const casa = casaEnxaimel({ w: 3 + (i % 2), d: 3, h: 3.5 + (i % 3), cor: c[0], telhadoCor: c[1] });
    casa.position.set(Math.cos(a) * rr, 4.2 + (rr < 16 ? 2 : 0), -70 + Math.sin(a) * rr); casa.rotation.y = -a + Math.PI / 2; cena.add(casa);
  }
  // rua do mercado (perto da câmera)
  const praca = new THREE.Mesh(new THREE.PlaneGeometry(30, 40), M('#B9A07A')); praca.rotation.x = -Math.PI / 2; praca.position.set(0, 0.01, -10); praca.receiveShadow = true; cena.add(praca);
  [[-8, -6, 0.5], [8, -8, -0.4], [-9, -18, 0.3], [9, -20, -0.2], [-7, 4, 0.6], [8, 3, -0.6]].forEach(([x, z, r], i) => { const c = casaEnxaimel({ w: 5, d: 5, h: 6 + (i % 2) * 2, cor: cores[i % 4][0], telhadoCor: cores[i % 4][1] }); c.position.set(x, 0, z); c.rotation.y = r; cena.add(c); });
  [[-3, -4], [3, -9]].forEach(([x, z], i) => { // barracas
    cena.add(cx(2.4, 1, 1.2, M('#8A6040'), [x, 0.5, z]));
    const tol = tex(64, 64, (c) => { for (let j = 0; j < 8; j++) { c.fillStyle = j % 2 ? '#F2F2F2' : (i ? '#2F6FB2' : '#D23B2B'); c.fillRect(j * 8, 0, 8, 64); } });
    cena.add(cx(2.8, 0.1, 1.8, M('#ffffff', { map: tol }), [x, 2.2, z], [0.25, 0, 0]));
    [-1.2, 1.2].forEach((dx) => cena.add(cx(0.08, 2.2, 0.08, M('#5A3A22'), [x + dx, 1.1, z + 0.6])));
  });
  // rio
  const rio = new THREE.Mesh(new THREE.PlaneGeometry(8, 300), M('#4F8FC0', { roughness: 0.4 })); rio.rotation.x = -Math.PI / 2; rio.rotation.z = 0.5; rio.position.set(40, 0.03, -60); cena.add(rio);
  // floresta
  for (let i = 0; i < 70; i++) { const x = -120 + ((i * 37) % 240), z = -150 + ((i * 53) % 120); if (Math.abs(x) < 35 && z > -100) continue; const t = new THREE.Mesh(new THREE.ConeGeometry(2.2, 6, 8), M('#3F6B3A')); t.position.set(x, 3, z); t.castShadow = true; cena.add(t); }
  return { CASTELO: [0, 18, -70] };
}

/** Quarto de pedra com velas (luz quente). */
export function criarQuartoPedra(ctx) {
  const { cena } = ctx;
  const pedra = tex(512, 512, (c, W, H) => { c.fillStyle = '#6E6474'; c.fillRect(0, 0, W, H); for (let y = 0; y < H; y += 48) for (let x = -(y % 96 ? 48 : 0); x < W; x += 96) { c.fillStyle = ['#7A7080', '#706678', '#655C6D'][(x + y) % 3 === 0 ? 0 : (x * y) % 2 ? 1 : 2]; c.fillRect(x + 3, y + 3, 90, 42); } });
  pedra.wrapS = pedra.wrapT = THREE.RepeatWrapping; pedra.repeat.set(3, 2);
  cena.add(cx(14, 8, 0.3, M('#ffffff', { map: pedra }), [0, 4, -4]), cx(0.3, 8, 10, M('#ffffff', { map: pedra }), [-6, 4, 0]), cx(0.3, 8, 10, M('#ffffff', { map: pedra }), [6, 4, 0]));
  cena.add(cx(14, 0.2, 12, M('#6B4A33'), [0, -0.1, 0]));
  const velas = [];
  [[-2.6, 1.2, -3.4], [2.8, 1.4, -3.4], [-4.5, 1.0, -1]].forEach(([x, y, z]) => {
    cena.add(cx(0.18, 0.5, 0.18, M('#F2EAD6'), [x, y - 0.25, z]));
    const ch = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), new THREE.MeshBasicMaterial({ color: '#FFC24A' })); ch.scale.y = 1.8; ch.position.set(x, y + 0.12, z); cena.add(ch);
    const l = new THREE.PointLight('#FFB060', 3, 8, 1.6); l.position.set(x, y + 0.4, z); cena.add(l); velas.push([ch, l]);
  });
  cena.add(cx(2.4, 0.12, 1.4, M('#5A3A22'), [0, 0.9, -3]), cx(0.15, 0.9, 0.15, M('#5A3A22'), [-1, 0.45, -3]), cx(0.15, 0.9, 0.15, M('#5A3A22'), [1, 0.45, -3]));
  return { animar(t) { velas.forEach(([ch, l], i) => { ch.scale.y = 1.8 + Math.sin(t * 11 + i) * 0.25; l.intensity = 3 + Math.sin(t * 13 + i * 2) * 0.5; }); } };
}

/** Textura da marca brilhante. tipo: 'chama'|'gota'|'raio'|'terra'|'olho'. */
export function texturaMarca(tipo) {
  const cor = { chama: '#FF8A2A', gota: '#3FB6FF', raio: '#FFE04A', terra: '#C98A3A', olho: '#B44BFF' }[tipo];
  return tex(256, 256, (c) => {
    c.translate(128, 128); c.strokeStyle = cor; c.lineWidth = 12; c.lineCap = 'round'; c.lineJoin = 'round'; c.shadowColor = cor; c.shadowBlur = 24;
    c.beginPath();
    if (tipo === 'chama') { c.moveTo(0, -80); c.quadraticCurveTo(60, -20, 34, 40); c.quadraticCurveTo(0, 80, -34, 40); c.quadraticCurveTo(-60, -20, 0, -80); c.moveTo(0, 0); c.quadraticCurveTo(18, 30, 0, 50); c.quadraticCurveTo(-18, 30, 0, 0); }
    if (tipo === 'gota') { c.moveTo(0, -80); c.quadraticCurveTo(70, 10, 40, 50); c.quadraticCurveTo(0, 90, -40, 50); c.quadraticCurveTo(-70, 10, 0, -80); c.moveTo(-20, 30); c.quadraticCurveTo(0, 55, 25, 30); }
    if (tipo === 'raio') { c.moveTo(20, -85); c.lineTo(-40, 10); c.lineTo(-2, 10); c.lineTo(-22, 85); c.lineTo(42, -15); c.lineTo(6, -15); c.closePath(); }
    if (tipo === 'terra') { c.moveTo(-70, 60); c.lineTo(0, -70); c.lineTo(70, 60); c.closePath(); c.moveTo(-30, 60); c.lineTo(0, 0); c.lineTo(30, 60); }
    if (tipo === 'olho') { c.moveTo(-90, 0); c.quadraticCurveTo(0, -80, 90, 0); c.quadraticCurveTo(0, 80, -90, 0); c.moveTo(28, 0); c.arc(0, 0, 28, 0, Math.PI * 2); for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; c.moveTo(Math.cos(a) * 100, Math.sin(a) * 70); c.lineTo(Math.cos(a) * 122, Math.sin(a) * 88); } }
    c.stroke();
  });
}

/** Mão aberta em close (palma para +z) com a marca no centro. */
export function maoComMarca(tipo, { pele = '#E9A97A' } = {}) {
  const g = new THREE.Group();
  const P = M(pele);
  const palma = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 24), P); palma.scale.set(0.92, 1.0, 0.3); palma.castShadow = true; g.add(palma); // palma arredondada
  const borda = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.7, 6, 12), P); borda.rotation.z = Math.PI / 2; borda.position.y = -0.5; g.add(borda);
  [[-0.33, 0.85, 0.75, 0.1], [-0.11, 0.95, 0.85, 0.03], [0.11, 0.92, 0.82, -0.03], [0.33, 0.8, 0.68, -0.1]].forEach(([x, y, h, rz]) => { const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, h - 0.2, 6, 12), P); f.position.set(x, y, 0); f.rotation.z = rz; f.castShadow = true; g.add(f); });
  const pol = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.45, 6, 12), P); pol.position.set(-0.6, -0.05, 0.05); pol.rotation.z = 0.8; g.add(pol);
  const marca = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), new THREE.MeshBasicMaterial({ map: texturaMarca(tipo), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  marca.position.set(0, 0.02, 0.16); g.add(marca);
  const luz = new THREE.PointLight({ chama: '#FF8A2A', gota: '#3FB6FF', raio: '#FFE04A', terra: '#C98A3A', olho: '#B44BFF' }[tipo], 2.5, 3, 1.5); luz.position.set(0, 0, 0.6); g.add(luz);
  g.marca = marca; g.luz = luz;
  return g;
}

/** Livro antigo aberto com "A MARCA DO FIM". */
export function livroAntigo3d() {
  const g = new THREE.Group();
  g.add(cx(2.6, 0.12, 1.8, M('#5A3A22'), [0, 0, 0]));
  const pag = tex(512, 360, (c, W, H) => { c.fillStyle = '#EAD9B0'; c.fillRect(0, 0, W, H); c.fillStyle = '#B89A6A'; c.fillRect(W / 2 - 3, 0, 6, H); c.strokeStyle = '#9C8460'; c.lineWidth = 6; for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(30, 50 + i * 40); c.lineTo(200 - (i % 3) * 30, 50 + i * 40); c.stroke(); } c.strokeStyle = '#6A1A8A'; c.lineWidth = 8; c.beginPath(); c.moveTo(300, 120); c.quadraticCurveTo(384, 60, 468, 120); c.quadraticCurveTo(384, 180, 300, 120); c.stroke(); c.beginPath(); c.arc(384, 120, 22, 0, 7); c.stroke(); c.fillStyle = '#5A1A3A'; c.font = '700 34px Georgia, serif'; c.textAlign = 'center'; c.fillText('A MARCA', 384, 240); c.fillText('DO FIM', 384, 285); });
  const p = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.68), new THREE.MeshStandardMaterial({ map: pag, roughness: 1 }));
  p.rotation.x = -Math.PI / 2; p.position.y = 0.07; g.add(p);
  return g;
}
