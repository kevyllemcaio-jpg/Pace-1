// Personagem estilo DESENHO ANIMADO (substitui o boneco quadrado): formas redondas, cabeça grande,
// sombreado de desenho (cel shading), contorno preto, olhos grandes com brilho e cores vivas.
// Mesma interface do personagem3d.js, então serve em qualquer vídeo/cenário:
//
//   const p = criarPersonagemToon();                       // "você" (personagem principal)
//   const m = criarPersonagemToon({ estilo: 'mae' });      // a mãe (coque + óculos)
//   p.estado = { bracos: 'normal'|'cima'|'aceno'|'cabeca'|'aponta'|'lado'|'controle',
//                expr: 'feliz'|'sorriso'|'serio'|'surpreso'|'preocupado'|'bravo', falando, andar, pulo }
//   p.animar(t)   // a cada quadro. Olha para +z; pés em y = 0; altura ~1,75.
import * as THREE from 'three';

// ---------- materiais de desenho ----------
let gradiente = null;
function rampa() {
  if (gradiente) return gradiente;
  const d = new Uint8Array([90, 90, 90, 255, 175, 175, 175, 255, 255, 255, 255, 255]);
  gradiente = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat);
  gradiente.minFilter = gradiente.magFilter = THREE.NearestFilter;
  gradiente.needsUpdate = true;
  return gradiente;
}
const cacheToon = new Map();
const toonMat = (cor) => {
  if (!cacheToon.has(cor)) cacheToon.set(cor, new THREE.MeshToonMaterial({ color: cor, gradientMap: rampa() }));
  return cacheToon.get(cor);
};
const CONTORNO = new THREE.MeshBasicMaterial({ color: '#141414', side: THREE.BackSide });

/** Malha de desenho com contorno preto (técnica do "casco invertido"). */
function peca(geo, cor, { pos = [0, 0, 0], esc = [1, 1, 1], rot = [0, 0, 0], linha = 0.018, sombra = true } = {}) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(geo, toonMat(cor));
  m.castShadow = sombra;
  m.receiveShadow = true;
  g.add(m);
  if (linha > 0) {
    geo.computeBoundingSphere();
    const r = geo.boundingSphere.radius;
    const o = new THREE.Mesh(geo, CONTORNO);
    o.scale.setScalar(1 + linha / Math.max(0.05, r));
    g.add(o);
  }
  g.position.set(...pos);
  g.scale.set(...esc);
  g.rotation.set(...rot);
  return g;
}
const esfera = (r, cor, o) => peca(new THREE.SphereGeometry(r, 32, 24), cor, o);
const capsula = (r, h, cor, o) => peca(new THREE.CapsuleGeometry(r, h, 8, 20), cor, o);
const plano = (cor) => new THREE.MeshBasicMaterial({ color: cor });

const COR_PADRAO = {
  pele: '#F6C9A0', cabelo: '#3B2314', roupa: '#FFC21A', roupaDet: '#FF8A00', calca: '#2F5BD3',
  tenis: '#E8322B', sola: '#FFFFFF', olho: '#1A1A1A', iris: '#4A2A12', boca: '#7A1F2B', lingua: '#FF7A8A', bochecha: '#FF8FA0',
};

export function criarPersonagemToon(opcoes = {}) {
  const C = { ...COR_PADRAO, ...(opcoes.cores || {}) };
  const mae = opcoes.estilo === 'mae';
  const p = new THREE.Group();
  const corpo = new THREE.Group();
  p.add(corpo);

  // pernas (pivô no quadril) com tênis arredondado
  const pernas = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(s * 0.11, 0.62, 0);
    g.add(capsula(0.085, 0.36, C.calca, { pos: [0, -0.26, 0] }));
    g.add(esfera(0.12, C.tenis, { pos: [0, -0.56, 0.06], esc: [0.95, 0.62, 1.35] }));
    g.add(peca(new THREE.CylinderGeometry(0.115, 0.12, 0.035, 24), C.sola, { pos: [0, -0.61, 0.06], esc: [0.95, 1, 1.35], linha: 0.012 }));
    corpo.add(g);
    return g;
  });

  // tronco: moletom arredondado com bolso e capuz
  const tronco = new THREE.Group();
  tronco.position.y = 0.62;
  tronco.add(capsula(0.2, 0.22, C.roupa, { pos: [0, 0.24, 0], esc: [1.15, 1, 0.9] }));
  tronco.add(peca(new THREE.BoxGeometry(0.24, 0.1, 0.04), C.roupaDet, { pos: [0, 0.14, 0.17], linha: 0.01 }));
  tronco.add(peca(new THREE.TorusGeometry(0.13, 0.05, 10, 24), C.roupaDet, { pos: [0, 0.5, -0.03], rot: [Math.PI / 2 - 0.25, 0, 0] }));
  if (!mae) [-1, 1].forEach((s) => tronco.add(capsula(0.012, 0.12, '#FFFFFF', { pos: [s * 0.05, 0.38, 0.18], linha: 0.006 })));
  corpo.add(tronco);

  // braços (pivô no ombro): manga + mão redonda
  const bracos = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(s * 0.27, 1.07, 0);
    g.add(capsula(0.07, 0.26, C.roupa, { pos: [0, -0.18, 0] }));
    g.add(esfera(0.075, C.pele, { pos: [0, -0.39, 0] }));
    corpo.add(g);
    return g;
  });

  // cabeça grande
  const cabeca = new THREE.Group();
  cabeca.position.y = 1.14;
  corpo.add(cabeca);
  cabeca.add(capsula(0.06, 0.06, C.pele, { pos: [0, 0.04, 0], linha: 0 })); // pescoço
  cabeca.add(esfera(0.34, C.pele, { pos: [0, 0.36, 0], esc: [1, 0.95, 0.95] }));
  [-1, 1].forEach((s) => cabeca.add(esfera(0.07, C.pele, { pos: [s * 0.33, 0.35, -0.02], esc: [0.6, 1, 0.8] }))); // orelhas
  cabeca.add(esfera(0.04, C.pele, { pos: [0, 0.31, 0.32], linha: 0.008 })); // nariz

  // cabelo
  if (mae) {
    cabeca.add(esfera(0.36, C.cabelo, { pos: [0, 0.42, -0.04], esc: [1.02, 0.92, 0.98] }));
    cabeca.add(esfera(0.15, C.cabelo, { pos: [0, 0.78, -0.08] })); // coque
    [-1, 1].forEach((s) => cabeca.add(capsula(0.1, 0.22, C.cabelo, { pos: [s * 0.3, 0.26, -0.06] })));
  } else {
    cabeca.add(esfera(0.355, C.cabelo, { pos: [0, 0.44, -0.05], esc: [1.02, 0.88, 0.98] }));
    // mechas espetadas para a frente/lado
    [[-0.18, 0.66, 0.16, 0.5], [-0.02, 0.72, 0.18, 0.2], [0.15, 0.68, 0.17, -0.3], [0.26, 0.58, 0.12, -0.7]].forEach(([x, y, z, rz]) =>
      cabeca.add(peca(new THREE.ConeGeometry(0.09, 0.22, 12), C.cabelo, { pos: [x, y, z], rot: [1.1, 0, rz] })));
  }

  // rosto (frente = +z): olhos grandes com brilho, sobrancelhas, bochechas, boca
  const rosto = new THREE.Group();
  rosto.position.set(0, 0.38, 0.29);
  cabeca.add(rosto);
  const olhos = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(s * 0.115, 0.04, 0.025);
    const branco = new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 16), plano('#FFFFFF'));
    branco.scale.set(0.85, 1.1, 0.45);
    const linha = new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 16), CONTORNO);
    linha.scale.set(0.93, 1.18, 0.4);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 14), plano(C.iris));
    iris.scale.set(0.9, 1.1, 0.4);
    iris.position.z = 0.03;
    const pupila = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), plano(C.olho));
    pupila.scale.set(0.9, 1.1, 0.4);
    pupila.position.z = 0.042;
    const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 8), plano('#FFFFFF'));
    brilho.position.set(0.018, 0.025, 0.052);
    const olhar = new THREE.Group();
    olhar.add(iris, pupila, brilho);
    g.add(linha, branco, olhar);
    rosto.add(g);
    return { g, olhar };
  });
  const sobr = [-1, 1].map((s) => {
    const o = capsula(0.018, 0.08, C.cabelo, { pos: [s * 0.115, 0.17, 0.03], rot: [0, 0, Math.PI / 2], linha: 0 });
    rosto.add(o);
    return o;
  });
  [-1, 1].forEach((s) => {
    const b = new THREE.Mesh(new THREE.CircleGeometry(0.045, 20), new THREE.MeshBasicMaterial({ color: C.bochecha, transparent: true, opacity: 0.75 }));
    b.position.set(s * 0.2, -0.07, 0.02);
    b.rotation.y = s * 0.45;
    rosto.add(b);
  });
  const boca = new THREE.Group();
  boca.position.set(0, -0.13, 0.03);
  const bocaM = new THREE.Mesh(new THREE.SphereGeometry(0.06, 24, 12), plano(C.boca));
  bocaM.scale.set(1, 0.35, 0.3);
  const lingua = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 10), plano(C.lingua));
  lingua.position.set(0, -0.012, 0.012);
  lingua.scale.set(1, 0.5, 0.3);
  boca.add(bocaM, lingua);
  rosto.add(boca);
  if (mae) {
    const arm = new THREE.MeshBasicMaterial({ color: '#C2185B' });
    [-1, 1].forEach((s) => {
      const aro = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.012, 8, 24), arm);
      aro.position.set(s * 0.115, 0.04, 0.07);
      aro.scale.set(1, 0.9, 1);
      rosto.add(aro);
    });
    const ponte = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.014, 0.01), arm);
    ponte.position.set(0, 0.06, 0.07);
    rosto.add(ponte);
  }

  p.estado = { bracos: 'normal', expr: 'feliz', andar: 0, pulo: 0 };

  p.animar = (t) => {
    const e = p.estado;
    const passo = Math.sin(t * 9) * 0.6 * (e.andar || 0);
    pernas[0].rotation.x = passo;
    pernas[1].rotation.x = -passo;
    // respiração com "squash & stretch" (vivo, de desenho)
    const resp = Math.sin(t * 3);
    tronco.scale.set(1 - 0.015 * resp, 1 + 0.025 * resp, 1);
    const salto = e.pulo ? Math.abs(Math.sin(t * 7)) * 0.32 * e.pulo : 0;
    corpo.position.y = salto + Math.abs(passo) * 0.04;
    corpo.scale.set(1, 1 + (e.pulo ? 0.05 * Math.sin(t * 14) : 0), 1);

    const [dir, esq] = bracos;
    dir.rotation.set(-passo * 0.8, 0, 0.12);
    esq.rotation.set(passo * 0.8, 0, -0.12);
    switch (e.bracos) {
      case 'cima':
        dir.rotation.set(0, 0, -2.7 + Math.sin(t * 8) * 0.15);
        esq.rotation.set(0, 0, 2.7 - Math.sin(t * 8) * 0.15);
        break;
      case 'aceno':
        dir.rotation.set(0, 0, -2.5 + Math.sin(t * 11) * 0.4);
        break;
      case 'cabeca': // mãos nas bochechas (desespero) — braços curtos de desenho
        dir.rotation.set(0.7, 0, 3.0);
        esq.rotation.set(0.7, 0, -3.0);
        break;
      case 'aponta':
        dir.rotation.set(-1.5, 0, -0.15);
        break;
      case 'lado':
        dir.rotation.set(0, 0, -1.45 + Math.sin(t * 5) * 0.06);
        break;
      case 'controle':
        dir.rotation.set(-1.0, 0, 0.45 + Math.sin(t * 13) * 0.05);
        esq.rotation.set(-1.0, 0, -0.45 - Math.sin(t * 13 + 1) * 0.05);
        break;
    }

    // expressão
    const ex = e.expr;
    const piscar = Math.sin(t * 1.3) > 0.985;
    olhos.forEach((o) => {
      o.g.scale.y = piscar ? 0.1 : ex === 'surpreso' ? 1.2 : ex === 'bravo' ? 0.8 : ex === 'sorriso' ? 0.75 : 1;
      o.g.scale.x = ex === 'surpreso' ? 1.12 : 1;
      o.olhar.scale.setScalar(ex === 'surpreso' ? 0.8 : 1);
    });
    sobr.forEach((o, i) => {
      const s = i === 0 ? -1 : 1;
      o.position.y = ex === 'surpreso' ? 0.22 : ex === 'bravo' ? 0.14 : 0.17;
      o.rotation.z = Math.PI / 2 + (ex === 'preocupado' ? s * 0.35 : ex === 'bravo' ? s * -0.4 : ex === 'serio' ? s * -0.15 : 0);
    });
    let bw = 1, bh = 0.35;
    if (ex === 'feliz') { bw = 1.25; bh = 0.9; }
    else if (ex === 'surpreso') { bw = 0.7; bh = 1.2; }
    else if (ex === 'sorriso') { bw = 1.35; bh = 0.5; }
    else if (ex === 'preocupado') { bw = 0.8; bh = 0.3; }
    else if (ex === 'bravo') { bw = 0.9; bh = 0.25; }
    if (e.falando) { bw = 1.05; bh = 0.35 + 0.9 * Math.abs(Math.sin(t * 17)); }
    bocaM.scale.set(bw, bh, 0.3);
    lingua.visible = bh > 0.6;
    lingua.position.y = -0.03 * bh;
    cabeca.rotation.z = Math.sin(t * 1.7) * 0.04;
    cabeca.rotation.x = e.falando ? Math.sin(t * 6) * 0.05 : 0;
  };
  p.animar(0);
  return p;
}
