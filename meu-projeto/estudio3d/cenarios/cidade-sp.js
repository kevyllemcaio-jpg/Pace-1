// Rua de São Paulo (estilo motion design): calçada de pedra portuguesa preta e branca, asfalto,
// prédios com janelas/sacadas/ar-condicionados, prédio do "piano" com andares numerados,
// ônibus, banca de jornal, árvores, postes e fios.
// Eixos: a rua corre ao longo de z (câmera olhando para -z). Calçada da direita: x de 1 a 4.
// Fachada do prédio principal em x = 4 (virada para a rua, -x). Chão em y = 0.
import * as THREE from 'three';

const cache = new Map();
const M = (cor, o = {}) => { const k = cor + JSON.stringify(o); if (!cache.has(k)) cache.set(k, new THREE.MeshStandardMaterial({ color: cor, roughness: 0.95, ...o })); return cache.get(k); };
function cx(w, h, d, mat, pos, rot = [0, 0, 0]) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(...pos); m.rotation.set(...rot); m.castShadow = true; m.receiveShadow = true;
  return m;
}
function tex(w, h, desenhar, rep = [1, 1]) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  desenhar(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep);
  t.anisotropy = 8;
  return t;
}
let rnd = 1; const r = () => ((rnd = (rnd * 1664525 + 1013904223) >>> 0) / 4294967296);

/** Calçada de pedra portuguesa (ondas pretas e brancas). */
export function texturaCalcada(rep = [2, 8]) {
  return tex(512, 512, (g, w, h) => {
    g.fillStyle = '#E9E4DA'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2A2A2E';
    for (let k = -1; k < 5; k++) {
      g.beginPath();
      for (let x = 0; x <= w; x += 8) { const y = k * 128 + Math.sin((x / w) * Math.PI * 2) * 40; x === 0 ? g.moveTo(x, y) : g.lineTo(x, y); }
      for (let x = w; x >= 0; x -= 8) { const y = k * 128 + 56 + Math.sin((x / w) * Math.PI * 2) * 40; g.lineTo(x, y); }
      g.closePath(); g.fill();
    }
    // juntas das pedrinhas
    g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 1;
    for (let i = 0; i < w; i += 12) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); }
  }, rep);
}
/** Fachada com janelas (andares de 3 m). */
function texturaFachada(cor, colunas, andares, { acesa = 0.25 } = {}) {
  return tex(256, 256 * (andares / colunas), (g, w, h) => {
    g.fillStyle = cor; g.fillRect(0, 0, w, h);
    const cw = w / colunas, ch = h / andares;
    for (let i = 0; i < colunas; i++) for (let j = 0; j < andares; j++) {
      g.fillStyle = r() < acesa ? '#F6D08A' : '#5C6E86';
      g.fillRect(i * cw + cw * 0.18, j * ch + ch * 0.2, cw * 0.64, ch * 0.55);
      g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(i * cw + cw * 0.14, j * ch + ch * 0.76, cw * 0.72, ch * 0.06);
    }
  });
}

/** Ar-condicionado (unidade externa) — também usado na fachada. */
export function arCondicionado(esc = 1) {
  const g = new THREE.Group();
  g.add(cx(0.8, 0.55, 0.3, M('#E8E8E6'), [0, 0, 0]));
  const grade = new THREE.Mesh(new THREE.CircleGeometry(0.2, 24), M('#3A3E44'));
  grade.position.set(-0.12, 0, 0.152); g.add(grade);
  g.scale.setScalar(esc);
  return g;
}

/** Prédio com fachada texturizada e (opcional) sacadas e ar-condicionados. */
export function predioSP(cena, { x, z, w, d, h, cor, sacadas = false, ar = 0, lado = -1 }) {
  const andares = Math.round(h / 3), colunas = Math.max(2, Math.round((lado ? d : w) / 2.2));
  const fach = M('#ffffff', { map: texturaFachada(cor, colunas, andares) });
  const lisa = M(cor);
  const mats = lado === -1 ? [lisa, fach, lisa, lisa, lisa, lisa] : [fach, lisa, lisa, lisa, lisa, lisa]; // fachada virada para a rua
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats);
  m.position.set(x, h / 2, z); m.castShadow = true; m.receiveShadow = true;
  cena.add(m);
  if (sacadas) for (let y = 3; y < h - 2; y += 3) cena.add(cx(0.5, 0.12, d * 0.96, M('#B9AE9A'), [x - w / 2 - 0.25, y, z]));
  for (let i = 0; i < ar; i++) {
    const a = arCondicionado(0.9);
    a.position.set(x - w / 2 - 0.2, 4 + Math.floor(r() * (h / 3 - 2)) * 3, z - d / 2 + 0.6 + r() * (d - 1.2));
    a.rotation.y = -Math.PI / 2;
    cena.add(a);
  }
  return m;
}

/** Ônibus verde genérico. */
export function onibus() {
  const g = new THREE.Group();
  g.add(cx(2.5, 2.9, 11, M('#2F8F5B'), [0, 1.75, 0]));
  g.add(cx(2.52, 1.0, 10.4, M('#2A3A4A'), [0, 2.4, 0]));
  g.add(cx(2.3, 0.9, 0.05, M('#2A3A4A'), [0, 2.4, 5.51]));
  g.add(cx(2.52, 0.3, 11, M('#F2F2F2'), [0, 1.05, 0]));
  [[-1.2, -3.6], [1.2, -3.6], [-1.2, 3.6], [1.2, 3.6]].forEach(([wx, wz]) => { const rd = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.35, 18), M('#1C1C20')); rd.rotation.z = Math.PI / 2; rd.position.set(wx, 0.5, wz); g.add(rd); });
  return g;
}

/** Banca de jornal com revistas coloridas. */
export function banca() {
  const g = new THREE.Group();
  g.add(cx(1.6, 2.2, 2.6, M('#2E7D5B'), [0, 1.1, 0]));
  g.add(cx(1.9, 0.12, 2.9, M('#1F5A41'), [0, 2.26, 0]));
  const rev = tex(256, 256, (c, w, h) => { const cores = ['#E63946', '#F4A261', '#2A9D8F', '#E9C46A', '#8E44AD', '#4D96FF']; for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) { c.fillStyle = cores[(i * 3 + j) % 6]; c.fillRect(i * 32 + 2, j * 42 + 2, 28, 38); } });
  const frente = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.7), M('#ffffff', { map: rev }));
  frente.position.set(-0.81, 1.15, 0); frente.rotation.y = -Math.PI / 2; g.add(frente);
  return g;
}

/** Árvore arredondada. */
export function arvoreSP(cena, x, z, s = 1) {
  cena.add(cx(0.22 * s, 2.2 * s, 0.22 * s, M('#6B4A33'), [x, 1.1 * s, z]));
  const copa = new THREE.Mesh(new THREE.SphereGeometry(1.2 * s, 16, 12), M('#4E8A3E'));
  copa.position.set(x, 2.9 * s, z); copa.scale.y = 0.85; copa.castShadow = true;
  cena.add(copa);
}

/** Poste com fios (catenária) até o próximo poste. */
function fio(cena, a, b, cor = '#1E1E22') {
  const meio = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5); meio.y -= 0.7;
  const curva = new THREE.QuadraticBezierCurve3(a, meio, b);
  cena.add(new THREE.Mesh(new THREE.TubeGeometry(curva, 20, 0.02, 5), M(cor)));
}

/**
 * Monta a rua inteira. Devolve dados úteis (posição do prédio do piano, viga da polia...).
 * O prédio do piano: fachada em x = 4, 12 andares; viga da polia no topo saindo sobre a calçada.
 */
export function criarCidadeSP(ctx) {
  const { cena } = ctx;
  rnd = 7;
  // chão: calçada direita, meio-fio, asfalto, calçada esquerda
  const calc = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 200), M('#ffffff', { map: texturaCalcada([3, 180]) }));
  calc.rotation.x = -Math.PI / 2; calc.position.set(2.5, 0.01, -60); calc.receiveShadow = true; cena.add(calc);
  const calc2 = calc.clone(); calc2.position.x = -7.6; cena.add(calc2);
  cena.add(cx(0.2, 0.18, 200, M('#B9B4AA'), [0.9, 0.09, -60]), cx(0.2, 0.18, 200, M('#B9B4AA'), [-6.0, 0.09, -60]));
  const asf = new THREE.Mesh(new THREE.PlaneGeometry(6.9, 200), M('#4A4A52'));
  asf.rotation.x = -Math.PI / 2; asf.position.set(-2.55, 0, -60); asf.receiveShadow = true; cena.add(asf);
  for (let z = 30; z > -160; z -= 6) cena.add(cx(0.15, 0.01, 2.5, M('#E8E3D2'), [-2.55, 0.01, z]));
  // prédio do piano (12 andares) e vizinhos
  const PIANO = predioSP(cena, { x: 7, z: -4, w: 6, d: 8, h: 36, cor: '#D8C9A8', sacadas: true, ar: 6 });
  const viz = [[7, -14, 6, 10, 48, '#C9B48E'], [7, 7, 6, 8, 27, '#BFC6CF'], [7, -26, 6, 12, 60, '#D9B98C'], [7, -42, 6, 18, 42, '#B8A487'], [7, 18, 6, 12, 33, '#CFC2A9'], [7, -64, 6, 22, 70, '#C2B19A']];
  viz.forEach(([x, z, w, d, h, c]) => predioSP(cena, { x, z, w, d, h, cor: c, sacadas: r() > 0.4, ar: 4 }));
  // lado esquerdo da avenida
  [[-12, -6, 8, 14, 45], [-12, -24, 8, 18, 66], [-12, 10, 8, 14, 30], [-12, -46, 8, 20, 54], [-12, -70, 8, 24, 80]].forEach(([x, z, w, d, h], i) =>
    predioSP(cena, { x, z, w, d, h, cor: ['#C9B48E', '#D6C3A0', '#BDB4A6', '#CDB38F', '#B9AC98'][i], lado: 1, ar: 3 }));
  // números dos andares na fachada do prédio do piano
  for (let a = 3; a <= 6; a++) {
    const t = tex(128, 128, (g) => { g.fillStyle = 'rgba(0,0,0,0)'; g.fillRect(0, 0, 128, 128); g.font = '900 80px Inter, sans-serif'; g.fillStyle = 'rgba(60,45,30,.55)'; g.textAlign = 'center'; g.fillText(`${a}º`, 64, 92); });
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), new THREE.MeshBasicMaterial({ map: t, transparent: true }));
    pl.position.set(3.98, a * 3 + 1.6, -1.2); pl.rotation.y = -Math.PI / 2; cena.add(pl);
  }
  // viga da polia no topo (sai da fachada sobre a calçada)
  cena.add(cx(2.4, 0.25, 0.25, M('#6E737C'), [3.0, 36.3, -4]));
  const roldana = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 20), M('#9AA0A8'));
  roldana.rotation.x = Math.PI / 2; roldana.position.set(2.2, 36.05, -4); cena.add(roldana);
  // ônibus, banca, árvores, postes e fios
  const bus = onibus(); bus.position.set(-1.2, 0, -28); cena.add(bus);
  const bn = banca(); bn.position.set(3.2, 0, 8); cena.add(bn);
  [[-6.6, 4], [-6.6, -14], [-6.6, -34], [1.3, -20], [1.3, -46]].forEach(([x, z]) => arvoreSP(cena, x, z, 1));
  let ant = null;
  for (let z = 14; z > -120; z -= 18) {
    cena.add(cx(0.14, 8, 0.14, M('#5A5E66'), [1.1, 4, z]), cx(1.8, 0.1, 0.1, M('#5A5E66'), [1.1, 7.6, z]));
    const topo = [new THREE.Vector3(0.4, 7.6, z), new THREE.Vector3(1.1, 7.6, z), new THREE.Vector3(1.8, 7.6, z)];
    if (ant) topo.forEach((p, i) => fio(cena, ant[i], p));
    ant = topo;
  }
  // chão distante (some na neblina)
  const longe = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), M('#8A7F74'));
  longe.rotation.x = -Math.PI / 2; longe.position.y = -0.02; cena.add(longe);
  return { POLIA: [2.2, 35.8, -4], CHAO_PIANO: [2.2, 0, -4], predio: PIANO };
}

/** Piano de armário em 3D (frente = +z). Origem na base. */
export function piano3d() {
  const g = new THREE.Group();
  const madeira = M('#6B4430'), escura = M('#3A2418'); // madeira mais clara: lê melhor contra o céu
  g.add(cx(1.45, 1.3, 0.6, madeira, [0, 0.75, 0]));
  g.add(cx(1.5, 0.08, 0.66, escura, [0, 1.44, 0]));
  g.add(cx(1.5, 0.1, 0.42, escura, [0, 0.95, 0.42]));
  g.add(cx(1.36, 0.05, 0.22, M('#F4F1EA'), [0, 1.02, 0.46]));
  for (let i = 0; i < 18; i++) if (i % 7 !== 2 && i % 7 !== 6) g.add(cx(0.04, 0.04, 0.13, escura, [-0.64 + i * 0.075, 1.06, 0.42]));
  g.add(cx(0.12, 0.1, 0.5, escura, [-0.62, 0.05, 0.05]), cx(0.12, 0.1, 0.5, escura, [0.62, 0.05, 0.05]));
  // etiqueta "250 kg"
  const t = tex(256, 128, (c) => { c.fillStyle = '#F4F1EA'; c.fillRect(0, 0, 256, 128); c.fillStyle = '#D23B2B'; c.fillRect(0, 0, 256, 30); c.fillStyle = '#16161A'; c.font = '900 64px Inter, sans-serif'; c.fillText('250 kg', 22, 104); });
  const et = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.25), new THREE.MeshBasicMaterial({ map: t }));
  et.position.set(0.4, 0.55, 0.305); g.add(et);
  return g;
}

/** Balancim (plataforma de obra) com guarda-corpo. */
export function balancim() {
  const g = new THREE.Group();
  const cinza = M('#8A9099');
  g.add(cx(2.4, 0.1, 0.9, M('#6E737C'), [0, 0, 0]));
  g.add(cx(2.4, 0.06, 0.06, cinza, [0, 1.0, 0.42]), cx(2.4, 0.06, 0.06, cinza, [0, 0.5, 0.42]));
  [-1.15, 0, 1.15].forEach((x) => g.add(cx(0.06, 1.0, 0.06, cinza, [x, 0.5, 0.42])));
  g.add(cx(2.4, 0.18, 0.04, M('#F2C200'), [0, 0.1, 0.45]));
  return g;
}

export const corda = (a, b) => {
  const geo = new THREE.CylinderGeometry(0.025, 0.025, 1, 6);
  const m = new THREE.Mesh(geo, M('#C9A36B'));
  m.atualizar = (A, Bp) => {
    const va = new THREE.Vector3(...A), vb = new THREE.Vector3(...Bp);
    m.position.copy(va).add(vb).multiplyScalar(0.5);
    m.scale.y = va.distanceTo(vb);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
  };
  m.atualizar(a, b);
  return m;
};
