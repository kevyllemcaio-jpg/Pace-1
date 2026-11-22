// Personagem no estilo "MOTION DESIGN" (cores chapadas; por padrão com cara de desenho 2D: dois tons + contorno;
// proporções normais, rosto simples). Usado no visual "cinema" (luz dourada, neblina, granulado).
//
//   const p = criarPersonagemFlat({ roupa, calca, cabelo, pele, fone, mochila, capacete, cabeloTipo })
//   p.estado = { bracos: 'normal'|'celular'|'cima'|'aponta'|'cabeca'|'aceno'|'mao', expr: 'neutro'|'feliz'|'surpreso'|'serio'|'medo', andar, falando }
//   p.animar(t)   // olha para +z; pés em y = 0; altura ~1,75
import * as THREE from 'three';

// ESTILO.modo = '2d' (padrão): cara de DESENHO 2D — dois tons chapados (luz/sombra, sem degradê)
// e contorno escuro. ESTILO.modo = '3d': sombreado suave, sem contorno.
export const ESTILO = { modo: '2d' };
let rampa2 = null;
function rampa() {
  if (rampa2) return rampa2;
  rampa2 = new THREE.DataTexture(new Uint8Array([200, 200, 200, 255, 255, 255, 255, 255]), 2, 1, THREE.RGBAFormat);
  rampa2.minFilter = rampa2.magFilter = THREE.NearestFilter;
  rampa2.needsUpdate = true;
  return rampa2;
}
const cache = new Map();
export const M = (cor) => {
  const k = ESTILO.modo + cor;
  if (!cache.has(k)) cache.set(k, ESTILO.modo === '2d' ? new THREE.MeshToonMaterial({ color: cor, gradientMap: rampa() }) : new THREE.MeshStandardMaterial({ color: cor, roughness: 0.95, metalness: 0 }));
  return cache.get(k);
};
const B = (cor) => new THREE.MeshBasicMaterial({ color: cor });
export const CONTORNO = new THREE.MeshBasicMaterial({ color: '#2A1E18', side: THREE.BackSide });
/** Contorno de desenho (casco invertido) numa malha — espessura ~constante. */
export function contornar(m, esp = 0.011) {
  if (ESTILO.modo !== '2d' || !m.material || m.material.isMeshBasicMaterial) return m;
  m.geometry.computeBoundingSphere();
  const o = new THREE.Mesh(m.geometry, CONTORNO);
  o.scale.setScalar(1 + esp / Math.max(0.02, m.geometry.boundingSphere.radius));
  o.castShadow = false;
  m.add(o);
  return m;
}
function malha(geo, mat, pos = [0, 0, 0], esc = [1, 1, 1], rot = [0, 0, 0]) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos); m.scale.set(...esc); m.rotation.set(...rot);
  m.castShadow = true; m.receiveShadow = true;
  return contornar(m);
}
const cap = (r, h) => new THREE.CapsuleGeometry(r, h, 6, 16);
const esf = (r) => new THREE.SphereGeometry(r, 28, 20);

export function criarPersonagemFlat(o = {}) {
  const C = { pele: '#E9A97A', roupa: '#F2B705', calca: '#2F4E7A', cabelo: '#5A3A22', tenis: '#F2F2F2', ...o };
  const p = new THREE.Group();
  const corpo = new THREE.Group();
  p.add(corpo);

  const pernas = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(s * 0.1, 0.86, 0);
    g.add(malha(cap(0.075, 0.68), M(C.calca), [0, -0.42, 0]));
    g.add(malha(new THREE.BoxGeometry(0.13, 0.08, 0.26), M(C.tenis), [0, -0.83, 0.05]));
    corpo.add(g);
    return g;
  });
  const tronco = new THREE.Group();
  tronco.position.y = 0.86;
  tronco.add(malha(new THREE.CylinderGeometry(0.17, 0.15, 0.56, 20), M(C.roupa), [0, 0.28, 0], [1.1, 1, 0.72]));
  tronco.add(malha(esf(0.17), M(C.roupa), [0, 0.54, 0], [1.1, 0.45, 0.72]));
  if (o.mochila) {
    tronco.add(malha(new THREE.BoxGeometry(0.3, 0.38, 0.14), M('#2B2B30'), [0, 0.32, -0.19]));
    [-1, 1].forEach((s) => tronco.add(malha(new THREE.BoxGeometry(0.04, 0.42, 0.02), M('#2B2B30'), [s * 0.1, 0.34, 0.13])));
  }
  corpo.add(tronco);

  const bracos = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(s * 0.22, 1.36, 0);
    g.add(malha(cap(0.055, 0.22), M(C.roupa), [0, -0.13, 0]));
    g.add(malha(cap(0.045, 0.26), M(C.pele), [0, -0.42, 0]));
    g.add(malha(esf(0.055), M(C.pele), [0, -0.62, 0], [1, 1.2, 0.8]));
    corpo.add(g);
    return g;
  });
  const celular = new THREE.Group();
  celular.add(malha(new THREE.BoxGeometry(0.08, 0.15, 0.012), M('#16161A')));
  const telaC = new THREE.Mesh(new THREE.PlaneGeometry(0.068, 0.13), B('#8FD0FF'));
  telaC.position.z = 0.008; celular.add(telaC);
  celular.position.set(0.02, -0.66, 0.04);
  celular.rotation.set(-1.35, 0, 0.25);
  bracos[0].add(celular);

  // cabeça: oval lisa, rosto simples (olhos de ponto, sobrancelhas, boca)
  const cabeca = new THREE.Group();
  cabeca.position.y = 1.44;
  corpo.add(cabeca);
  cabeca.add(malha(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 12), M(C.pele), [0, 0.02, 0]));
  cabeca.add(malha(esf(0.15), M(C.pele), [0, 0.2, 0], [1, 1.12, 1]));
  [-1, 1].forEach((s) => cabeca.add(malha(esf(0.035), M(C.pele), [s * 0.15, 0.19, 0], [0.6, 1, 0.8])));
  const tipo = o.cabeloTipo || 'curto';
  if (tipo === 'curto') cabeca.add(malha(esf(0.158), M(C.cabelo), [0, 0.25, -0.012], [1.02, 0.95, 1.02]));
  if (tipo === 'coque') { cabeca.add(malha(esf(0.158), M(C.cabelo), [0, 0.25, -0.015], [1.02, 0.95, 1.02])); cabeca.add(malha(esf(0.07), M(C.cabelo), [0, 0.43, -0.07])); }
  if (tipo === 'careca') cabeca.add(malha(esf(0.155), M(C.cabelo), [0, 0.15, -0.03], [1.03, 0.6, 1.0]));
  // recorte do rosto (a frente da cabeça fica sem cabelo)
  cabeca.add(malha(esf(0.152), M(C.pele), [0, 0.18, 0.012], [0.96, 0.92, 1]));
  const rosto = new THREE.Group();
  rosto.position.set(0, 0.2, 0.15);
  cabeca.add(rosto);
  const olhos = [-1, 1].map((s) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 8), B('#1A1410')); m.position.set(s * 0.055, 0.01, 0); m.scale.z = 0.5; rosto.add(m); return m; });
  const sobr = [-1, 1].map((s) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.011, 0.01), B('#3A2618')); m.position.set(s * 0.055, 0.05, 0); rosto.add(m); return m; });
  const boca = new THREE.Mesh(new THREE.SphereGeometry(0.022, 14, 8), B('#7A2E25'));
  boca.position.set(0, -0.07, -0.004);
  boca.scale.set(1, 0.25, 0.4);
  rosto.add(boca);
  if (o.fone) {
    cabeca.add(malha(new THREE.TorusGeometry(0.17, 0.016, 8, 28, Math.PI), M('#1C1C22'), [0, 0.22, -0.01]));
    [-1, 1].forEach((s) => cabeca.add(malha(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 20), M('#1C1C22'), [s * 0.165, 0.2, 0], [1, 1, 1], [0, 0, Math.PI / 2])));
  }
  const capacete = new THREE.Group();
  capacete.add(malha(new THREE.SphereGeometry(0.18, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), M('#F2C200'), [0, 0, 0], [1, 0.9, 1.05]));
  capacete.add(malha(new THREE.CylinderGeometry(0.22, 0.22, 0.015, 28), M('#F2C200'), [0, 0, 0.02]));
  capacete.position.y = 0.27;
  capacete.visible = !!o.capacete;
  cabeca.add(capacete);

  p.estado = { bracos: 'normal', expr: 'neutro', andar: 0 };
  p.capacete = capacete;
  p.animar = (t) => {
    const e = p.estado;
    const passo = Math.sin(t * 7) * 0.45 * (e.andar || 0);
    pernas[0].rotation.x = passo; pernas[1].rotation.x = -passo;
    corpo.position.y = Math.abs(Math.sin(t * 7)) * 0.025 * (e.andar || 0);
    tronco.rotation.y = Math.sin(t * 7) * 0.05 * (e.andar || 0);
    const [d, es] = bracos;
    d.rotation.set(-passo * 0.7, 0, 0.08); es.rotation.set(passo * 0.7, 0, -0.08);
    switch (e.bracos) {
      case 'celular': d.rotation.set(-1.15, 0, 0.35); break;
      case 'cima': d.rotation.set(0, 0, -2.8); es.rotation.set(0, 0, 2.8); break;
      case 'aponta': d.rotation.set(-1.5, 0, -0.1); break;
      case 'aceno': d.rotation.set(0, 0, -2.5 + Math.sin(t * 10) * 0.35); break;
      case 'cabeca': d.rotation.set(-0.5, 0, 2.6); es.rotation.set(-0.5, 0, -2.6); break;
      case 'mao': d.rotation.set(-1.2, 0, -0.5); break; // mostra a mão (marca)
    }
    celular.visible = e.bracos === 'celular';
    const ex = e.expr;
    olhos.forEach((m) => { m.scale.set(ex === 'surpreso' || ex === 'medo' ? 1.3 : 1, ex === 'surpreso' || ex === 'medo' ? 1.4 : Math.sin(t * 1.2) > 0.985 ? 0.15 : 1, 0.5); });
    sobr.forEach((m, i) => { const s = i === 0 ? -1 : 1; m.position.y = ex === 'surpreso' ? 0.065 : 0.05; m.rotation.z = ex === 'medo' ? s * -0.35 : ex === 'serio' ? s * 0.2 : 0; });
    let bw = 1, bh = 0.25;
    if (ex === 'feliz') { bw = 1.5; bh = 0.5; } else if (ex === 'surpreso' || ex === 'medo') { bw = 0.8; bh = 1.0; }
    if (e.falando) bh = 0.3 + 0.7 * Math.abs(Math.sin(t * 16));
    boca.scale.set(bw, bh, 0.4);
    cabeca.rotation.x = e.bracos === 'celular' ? 0.28 : 0;
    cabeca.rotation.y = e.olharLado || 0;
  };
  p.animar(0);
  return p;
}

/** Bebê enrolado num pano (cueiro), estilo flat. Fica deitado/no colo; olha para +z. */
export function criarBebeFlat({ pele = '#E9A97A', pano = '#E8E1D2' } = {}) {
  const g = new THREE.Group();
  g.add(malha(cap(0.11, 0.26), M(pano), [0, 0, 0], [1, 1, 0.85]));
  g.add(malha(esf(0.15), M(pano), [0, 0.27, -0.02], [1, 1, 0.9]));
  const cab = new THREE.Group();
  cab.position.set(0, 0.25, 0.04);
  cab.add(malha(esf(0.1), M(pele)));
  [-1, 1].forEach((s) => { const o = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 8), B('#1A1410')); o.position.set(s * 0.035, 0.01, 0.095); cab.add(o); });
  [-1, 1].forEach((s) => { const b = new THREE.Mesh(new THREE.CircleGeometry(0.018, 14), new THREE.MeshBasicMaterial({ color: '#F08A7A', transparent: true, opacity: 0.6 })); b.position.set(s * 0.06, -0.03, 0.09); cab.add(b); });
  const boca = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 8), B('#7A2E25')); boca.position.set(0, -0.04, 0.095); cab.add(boca);
  g.add(cab);
  g.cabeca = cab;
  g.boca = boca;
  return g;
}
