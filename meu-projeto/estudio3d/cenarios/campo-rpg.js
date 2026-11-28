// Mundo de RPG (cartoon): campo de grama alta que balança com o vento, lago, árvores redondas,
// montanhas com neve, nuvens; objetos mágicos (espada, anel, armadura), capacete de leitura,
// slime azul gelatinoso, criatura sombria gigante, partículas mágicas e o painel do sistema.
// Mesmo visual dos personagens: dois tons chapados + contorno (personagem-flat.js).
import * as THREE from 'three';
import { M, contornar } from '../personagem-flat.js';

let rnd = 3; const r = () => ((rnd = (rnd * 1664525 + 1013904223) >>> 0) / 4294967296);
function malha(geo, mat, pos = [0, 0, 0], esc = [1, 1, 1], rot = [0, 0, 0], contorno = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos); m.scale.set(...esc); m.rotation.set(...rot);
  m.castShadow = true; m.receiveShadow = true;
  return contorno ? contornar(m) : m;
}
const esf = (r0, a = 24, b = 16) => new THREE.SphereGeometry(r0, a, b);
function texCanvas(w, h, desenhar) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  desenhar(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const brilhoTex = (() => { let t; return () => t || (t = texCanvas(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); })); })();

/** Sprite de brilho (aura). */
export function brilho(cor, tam = 1, op = 1) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: brilhoTex(), color: cor, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  s.scale.set(tam, tam, 1);
  return s;
}

/** Árvore redonda de desenho. */
export function arvore(s = 1, cor = '#5DAA3C') {
  const g = new THREE.Group();
  g.add(malha(new THREE.CylinderGeometry(0.16, 0.24, 2.2, 10), M('#7A5232'), [0, 1.1, 0]));
  g.add(malha(esf(1.2), M(cor), [0, 2.8, 0]));
  g.add(malha(esf(0.85), M(cor), [0.75, 2.3, 0.2]));
  g.add(malha(esf(0.8), M(cor), [-0.7, 2.4, -0.1]));
  g.add(malha(esf(0.7), M('#79C04E'), [0.1, 3.5, 0.3]));
  g.scale.setScalar(s);
  return g;
}

/** Grama alta instanciada, balançando ao vento (shader). */
function grama(cena, { cx = 0, cz = 0, raio = 26, n = 36000, evitar = null } = {}) {
  const geo = new THREE.PlaneGeometry(0.07, 0.55, 1, 4);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) { const y = pos.getY(i) + 0.275; pos.setY(i, y); pos.setX(i, pos.getX(i) * (1 - y / 0.6)); }
  const mat = new THREE.MeshToonMaterial({ color: '#ffffff', side: THREE.DoubleSide });
  const uni = { uTempo: { value: 0 } };
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTempo = uni.uTempo;
    sh.vertexShader = 'uniform float uTempo;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      float h = position.y / 0.55; vec4 wp = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      float vento = sin(uTempo * 1.8 + wp.x * 0.35 + wp.z * 0.22) * 0.5 + sin(uTempo * 3.1 + wp.z * 0.9) * 0.2;
      transformed.x += vento * 0.16 * h * h; transformed.z += vento * 0.06 * h * h;`);
  };
  const m = new THREE.InstancedMesh(geo, mat, n);
  const d = new THREE.Object3D(), c = new THREE.Color();
  const cores = ['#5DB33A', '#6CC444', '#4FA132', '#7ACF4C', '#58AD38'];
  let k = 0;
  for (let i = 0; i < n * 3 && k < n; i++) {
    const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * raio;
    const x = cx + Math.cos(a) * rr, z = cz + Math.sin(a) * rr;
    if (evitar && evitar(x, z)) continue;
    d.position.set(x, 0, z); d.rotation.set(0, r() * Math.PI, 0); const s = 0.55 + r() * 0.7, baixa = x * x + z * z < 20 ? 0.55 : 1; d.scale.set(s, s * (0.55 + r() * 0.5) * baixa, s);
    d.updateMatrix(); m.setMatrixAt(k, d.matrix);
    c.set(cores[Math.floor(r() * cores.length)]); m.setColorAt(k, c); k++;
  }
  m.count = k;
  m.receiveShadow = true;
  cena.add(m);
  return uni;
}

/** Nuvem fofinha (sprite). */
function nuvem(cena, pos, tam) {
  const t = texCanvas(256, 128, (g) => { g.fillStyle = '#fff'; [[70, 80, 46], [125, 62, 58], [185, 82, 44], [100, 95, 40], [160, 98, 38]].forEach(([x, y, rr]) => { g.beginPath(); g.arc(x, y, rr, 0, Math.PI * 2); g.fill(); }); g.fillStyle = 'rgba(190,210,230,.55)'; g.fillRect(30, 104, 200, 20); });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, fog: false, depthWrite: false }));
  s.position.set(...pos); s.scale.set(tam, tam / 2, 1); cena.add(s); return s;
}

/** Monta o campo (origem no centro do mundo). Devolve { animar(t), LAGO }. */
export function criarCampo(ctx) {
  const { cena } = ctx;
  rnd = 11;
  const chao = new THREE.Mesh(new THREE.PlaneGeometry(700, 700), M('#5FAE3C')); chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; cena.add(chao);
  // lago
  const LAGO = [-9, -24];
  const lago = new THREE.Mesh(new THREE.CircleGeometry(11, 48), new THREE.MeshStandardMaterial({ color: '#3B9BDB', roughness: 0.15, metalness: 0.15 }));
  lago.rotation.x = -Math.PI / 2; lago.scale.set(1.4, 0.8, 1); lago.position.set(LAGO[0], 0.03, LAGO[1]); lago.receiveShadow = true; cena.add(lago);
  const borda = new THREE.Mesh(new THREE.RingGeometry(10.6, 11.6, 48), M('#C9B58A')); borda.rotation.x = -Math.PI / 2; borda.scale.set(1.4, 0.8, 1); borda.position.set(LAGO[0], 0.025, LAGO[1]); cena.add(borda);
  const reflexos = [];
  for (let i = 0; i < 14; i++) { const b = new THREE.Mesh(new THREE.PlaneGeometry(0.9 + r(), 0.06), new THREE.MeshBasicMaterial({ color: '#E6F6FF', transparent: true, opacity: 0.6 })); b.rotation.x = -Math.PI / 2; b.position.set(LAGO[0] - 9 + r() * 18, 0.05, LAGO[1] - 5 + r() * 10); cena.add(b); reflexos.push(b); }
  // grama alta perto da câmera (fora do lago)
  const dentroLago = (x, z) => ((x - LAGO[0]) / 15.6) ** 2 + ((z - LAGO[1]) / 9) ** 2 < 1;
  const vento = grama(cena, { cx: 0, cz: 0, raio: 30, n: 42000, evitar: dentroLago });
  // trilha de terra
  const trilha = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 60), M('#C9A774')); trilha.rotation.set(-Math.PI / 2, 0, 0.25); trilha.position.set(6, 0.02, -30); cena.add(trilha);
  // árvores
  [[-14, -8, 1.3], [12, -12, 1.5], [-20, -40, 1.8], [18, -30, 1.4], [6, -45, 1.6], [-4, -60, 2], [24, -55, 2], [-30, -20, 1.6], [28, -8, 1.3], [-12, 6, 1.1], [14, 8, 1.2], [-34, -60, 2.2], [36, -40, 2]].forEach(([x, z, s], i) => {
    const a = arvore(s, i % 3 ? '#5DAA3C' : '#4E9A34'); a.position.set(x, 0, z); a.rotation.y = r() * 6; cena.add(a);
  });
  // flores brancas
  for (let i = 0; i < 160; i++) { const x = -18 + r() * 36, z = -20 + r() * 26; if (dentroLago(x, z)) continue; const f = new THREE.Mesh(new THREE.CircleGeometry(0.07, 6), new THREE.MeshBasicMaterial({ color: i % 4 ? '#FFFFFF' : '#FFE14D' })); f.position.set(x, 0.45 + r() * 0.15, z); f.rotation.x = -1.2; cena.add(f); }
  // montanhas com neve
  [[-70, -170, 48, 60, '#8EA6C2'], [-15, -200, 60, 78, '#97AECA'], [50, -180, 50, 64, '#8AA2BE'], [110, -200, 60, 70, '#9AB0CB'], [-130, -190, 55, 58, '#93A9C4'], [10, -150, 34, 40, '#86A0BA']].forEach(([x, z, rr, h, cor]) => {
    const mt = new THREE.Mesh(new THREE.ConeGeometry(rr, h, 7), M(cor)); mt.position.set(x, h / 2 - 2, z); mt.rotation.y = r(); cena.add(mt);
    const neve = new THREE.Mesh(new THREE.ConeGeometry(rr * 0.32, h * 0.32, 7), M('#F4F8FC')); neve.position.set(x, h - 2 - h * 0.16 + 0.3, z); neve.rotation.y = mt.rotation.y; cena.add(neve);
  });
  // morros verdes
  [[-40, -90, 30], [30, -100, 36], [0, -110, 26]].forEach(([x, z, rr]) => { const m = new THREE.Mesh(esf(rr, 32, 16), M('#6DB548')); m.scale.y = 0.3; m.position.set(x, 0, z); cena.add(m); });
  const nuvens = [[-45, 80, -230, 30], [25, 90, -250, 36], [85, 75, -220, 26], [-105, 85, -240, 32]].map(([x, y, z, s]) => nuvem(cena, [x, y, z], s));
  return {
    LAGO,
    animar(t) {
      vento.uTempo.value = t;
      reflexos.forEach((b, i) => { b.material.opacity = 0.25 + 0.4 * Math.abs(Math.sin(t * 1.3 + i)); b.position.x += Math.sin(t + i) * 0.002; });
      nuvens.forEach((n, i) => (n.position.x += 0.01 * (i % 2 ? 1 : 0.6)));
    },
  };
}

/** Slime azul gelatinoso (transparente, brilhante), olhos grandes. Olha para +z. Base em y = 0. */
export function criarSlime() {
  const g = new THREE.Group();
  const corpoMat = new THREE.MeshPhysicalMaterial({ color: '#56C2FF', emissive: '#1C7FE0', emissiveIntensity: 0.35, roughness: 0.15, transparent: true, opacity: 0.78, clearcoat: 1 });
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.32, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.62), corpoMat);
  corpo.scale.set(1, 1.05, 1); corpo.position.y = 0.0; corpo.castShadow = true;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.3, 0.12, 36), corpoMat); base.position.y = -0.17;
  const nucleo = new THREE.Group(); nucleo.position.y = 0.17; nucleo.add(corpo, base);
  const contorno = new THREE.Mesh(corpo.geometry, new THREE.MeshBasicMaterial({ color: '#0E3A66', side: THREE.BackSide })); contorno.scale.setScalar(1.04); corpo.add(contorno);
  const reflexo = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.85 })); reflexo.position.set(-0.14, 0.2, 0.18); reflexo.scale.set(1.4, 0.7, 0.4); nucleo.add(reflexo);
  const olhos = [-1, 1].map((s) => {
    const o = new THREE.Group(); o.position.set(s * 0.1, 0.1, 0.27);
    const branco = new THREE.Mesh(new THREE.SphereGeometry(0.07, 18, 12), new THREE.MeshBasicMaterial({ color: '#fff' })); branco.scale.z = 0.6; o.add(branco);
    const pupila = new THREE.Mesh(new THREE.SphereGeometry(0.042, 14, 10), new THREE.MeshBasicMaterial({ color: '#10141C' })); pupila.position.z = 0.035; pupila.scale.z = 0.5; o.add(pupila);
    const luz = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), new THREE.MeshBasicMaterial({ color: '#fff' })); luz.position.set(0.016, 0.018, 0.06); o.add(luz);
    nucleo.add(o); return o;
  });
  const boca = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 6, 14, Math.PI), new THREE.MeshBasicMaterial({ color: '#0E3A66' })); boca.position.set(0, 0.0, 0.3); boca.rotation.z = Math.PI; nucleo.add(boca);
  const aura = brilho('#5CC8FF', 1.6, 0); aura.position.y = 0.2; g.add(aura);
  g.add(nucleo);
  g.estado = { pulo: 0, poder: 0 };
  g.animar = (t) => {
    const e = g.estado;
    const ciclo = (t * 2.2) % 1;
    const salto = e.pulo ? Math.max(0, Math.sin(ciclo * Math.PI)) * 0.35 * e.pulo : 0;
    const amassa = e.pulo ? (ciclo < 0.12 || ciclo > 0.92 ? 0.82 : 1.06) : 1 + Math.sin(t * 3) * 0.04;
    nucleo.position.y = 0.17 + salto;
    nucleo.scale.set(1 / Math.sqrt(amassa), amassa, 1 / Math.sqrt(amassa));
    corpoMat.emissiveIntensity = 0.35 + e.poder * (1.6 + Math.sin(t * 20) * 0.4);
    aura.material.opacity = e.poder * 0.9; aura.scale.setScalar(1.6 + e.poder * 2.5);
    olhos.forEach((o) => (o.scale.y = e.triste ? 0.4 : Math.sin(t * 0.9) > 0.98 ? 0.15 : 1));
    boca.rotation.z = e.triste ? 0 : Math.PI;
  };
  return g;
}

/** Espada (lâmina para cima). */
export function espada() {
  const g = new THREE.Group();
  g.add(malha(new THREE.BoxGeometry(0.12, 1.1, 0.03), M('#D9E1EA'), [0, 0.75, 0]));
  g.add(malha(new THREE.ConeGeometry(0.085, 0.2, 4), M('#D9E1EA'), [0, 1.4, 0], [1, 1, 0.35], [0, Math.PI / 4, 0]));
  g.add(malha(new THREE.BoxGeometry(0.46, 0.07, 0.1), M('#7A4BC2'), [0, 0.18, 0]));
  g.add(malha(new THREE.CylinderGeometry(0.035, 0.035, 0.3, 10), M('#4A2E2A'), [0, 0, 0]));
  g.add(malha(esf(0.06), M('#B07CFF'), [0, -0.17, 0]));
  return g;
}
/** Anel dourado com pedra. */
export function anel() {
  const g = new THREE.Group();
  g.add(malha(new THREE.TorusGeometry(0.26, 0.05, 14, 40), new THREE.MeshStandardMaterial({ color: '#FFC930', metalness: 0.8, roughness: 0.25 }), [0, 0, 0]));
  g.add(malha(new THREE.OctahedronGeometry(0.09), new THREE.MeshStandardMaterial({ color: '#FF4E6A', emissive: '#A0102A', emissiveIntensity: 0.6 }), [0, 0.3, 0]));
  return g;
}
/** Armadura (peitoral) azul. */
export function armadura() {
  const g = new THREE.Group();
  const azul = M('#3E86E8'), claro = M('#9AD0FF');
  g.add(malha(new THREE.CylinderGeometry(0.32, 0.26, 0.7, 22), azul, [0, 0, 0], [1, 1, 0.65]));
  g.add(malha(esf(0.17), azul, [-0.38, 0.27, 0], [1, 0.8, 1]));
  g.add(malha(esf(0.17), azul, [0.38, 0.27, 0], [1, 0.8, 1]));
  g.add(malha(new THREE.BoxGeometry(0.08, 0.6, 0.05), claro, [0, 0, 0.21]));
  g.add(malha(new THREE.BoxGeometry(0.5, 0.06, 0.05), claro, [0, -0.25, 0.18]));
  return g;
}
/** Capacete de leitura (visor). Encaixa na cabeça do personagem-flat (cabeca.position.y = 1.44). */
export function capaceteLeitura() {
  const g = new THREE.Group();
  g.add(malha(new THREE.SphereGeometry(0.2, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2.1), M('#EEF2F6'), [0, 0.2, -0.01], [1.02, 1.05, 1.05]));
  g.add(malha(new THREE.BoxGeometry(0.3, 0.1, 0.12), M('#1B1F28'), [0, 0.21, 0.13]));
  const tela = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.06), new THREE.MeshBasicMaterial({ color: '#58D2FF' }));
  tela.position.set(0, 0.21, 0.192); g.add(tela);
  [-1, 1].forEach((s) => g.add(malha(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 18), M('#C9D2DC'), [s * 0.2, 0.2, 0], [1, 1, 1], [0, 0, Math.PI / 2])));
  g.tela = tela;
  return g;
}

/** Criatura sombria gigante (silhueta com olhos vermelhos e chifres). Base em y = 0. */
export function criatura() {
  const g = new THREE.Group();
  const escuro = new THREE.MeshBasicMaterial({ color: '#120A1C' });
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 20), escuro); corpo.scale.set(1.2, 1.5, 0.9); corpo.position.y = 12; g.add(corpo);
  const cab = new THREE.Mesh(new THREE.SphereGeometry(5.5, 28, 18), escuro); cab.position.y = 27; g.add(cab);
  [-1, 1].forEach((s) => {
    const ch = new THREE.Mesh(new THREE.ConeGeometry(1.2, 7, 10), escuro); ch.position.set(s * 4, 32, 0); ch.rotation.z = -s * 0.5; g.add(ch);
    const ombro = new THREE.Group(); ombro.position.set(s * 9.5, 20, 0); g.add(ombro);
    const braco = new THREE.Mesh(new THREE.CapsuleGeometry(2.4, 14, 6, 12), escuro); braco.position.set(s * 3.5, -8, 1); braco.rotation.z = s * 0.35; ombro.add(braco);
    [-1, 0, 1].forEach((k) => { const u = new THREE.Mesh(new THREE.ConeGeometry(0.7, 4, 8), escuro); u.position.set(s * 6 + k * 1.2, -17.5, 1.5); u.rotation.x = Math.PI + 0.3; ombro.add(u); });
    (g.ombros ||= []).push(ombro);
    const olho = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 10), new THREE.MeshBasicMaterial({ color: '#FF2A2A', fog: false })); olho.position.set(s * 2, 27.5, 5); olho.scale.set(1.4, 0.6, 0.5); g.add(olho);
    const bo = brilho('#FF3030', 7, 0.9); bo.position.copy(olho.position); g.add(bo);
    (g.olhos ||= []).push(olho, bo);
  });
  const aura = brilho('#8A3CFF', 70, 0.35); aura.position.y = 18; g.add(aura);
  g.aura = aura;
  return g;
}

/** Partículas mágicas flutuando (pontos aditivos) numa caixa em volta de `centro`. */
export function particulas(cena, centro, { n = 160, tam = [10, 6, 10], cor = '#BFE8FF', pt = 0.12 } = {}) {
  const geo = new THREE.BufferGeometry();
  const base = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { base[i * 3] = (r() - 0.5) * tam[0]; base[i * 3 + 1] = r() * tam[1]; base[i * 3 + 2] = (r() - 0.5) * tam[2]; }
  geo.setAttribute('position', new THREE.BufferAttribute(base.slice(), 3));
  const mat = new THREE.PointsMaterial({ map: brilhoTex(), color: cor, size: pt, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
  const p = new THREE.Points(geo, mat); p.position.set(...centro); cena.add(p);
  p.animar = (t) => {
    const a = geo.attributes.position.array;
    for (let i = 0; i < n; i++) { a[i * 3] = base[i * 3] + Math.sin(t * 0.6 + i) * 0.3; a[i * 3 + 1] = (base[i * 3 + 1] + t * 0.25) % tam[1]; a[i * 3 + 2] = base[i * 3 + 2] + Math.cos(t * 0.5 + i * 1.3) * 0.3; }
    geo.attributes.position.needsUpdate = true;
  };
  return p;
}

/** Cone de luz (holofote) aditivo, apontando para baixo. */
export function coneLuz(cor, altura = 6, raio = 1.2) {
  const m = new THREE.Mesh(new THREE.ConeGeometry(raio, altura, 32, 1, true), new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
  m.position.y = altura / 2;
  const g = new THREE.Group(); g.add(m); g.cone = m;
  const disco = new THREE.Mesh(new THREE.CircleGeometry(raio, 32), new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
  disco.rotation.x = -Math.PI / 2; disco.position.y = 0.01; g.add(disco); g.disco = disco;
  return g;
}

/** Anel holográfico no chão (aditivo). */
export function anelHolo(raio = 2.5, cor = '#58D2FF') {
  const g = new THREE.Group();
  [1, 0.8, 0.55].forEach((k, i) => { const m = new THREE.Mesh(new THREE.RingGeometry(raio * k - 0.04, raio * k, 64), new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: 0.7 - i * 0.15, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 2; m.position.y = 0.04; g.add(m); });
  return g;
}

/** Cartão holográfico (moldura azul translúcida) para pôr atrás de um personagem. */
export function cartaoHolo(w = 1.3, h = 2.1) {
  const t = texCanvas(256, 410, (g, W, H) => {
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(120,210,255,.30)'); gr.addColorStop(1, 'rgba(60,150,255,.12)');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(170,235,255,.95)'; g.lineWidth = 6; g.strokeRect(5, 5, W - 10, H - 10);
    g.fillStyle = 'rgba(170,235,255,.9)'; [[0, 0], [W - 28, 0], [0, H - 28], [W - 28, H - 28]].forEach(([x, y]) => g.fillRect(x, y, 28, 28));
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false }));
  return m;
}

/** Painel mágico gigante da praça (lista de classes sorteadas), textura que pode ser redesenhada. */
export function painelMagico(w = 7, h = 9) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 660;
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const g = c.getContext('2d');
  const nomes = ['ARTHUR', 'LÍVIA', 'BRUNO', 'MAYA', 'OTTO', 'NINA', 'RAUL'];
  const classes = ['GUERREIRO', 'MAGA', 'ARQUEIRO', 'CURANDEIRA', 'MONGE', 'LADINA', 'FERREIRO'];
  const desenhar = (k = 0, lendario = -1) => {
    g.clearRect(0, 0, 512, 660);
    g.fillStyle = 'rgba(20,70,140,.72)'; g.fillRect(0, 0, 512, 660);
    g.strokeStyle = '#9FE4FF'; g.lineWidth = 8; g.strokeRect(6, 6, 500, 648);
    g.fillStyle = '#FFFFFF'; g.font = '900 44px Inter, sans-serif'; g.textAlign = 'center'; g.fillText('SISTEMA', 256, 70);
    g.fillStyle = '#9FE4FF'; g.fillRect(40, 92, 432, 4);
    nomes.forEach((n, i) => {
      const y = 150 + i * 72;
      const cl = i === lendario ? 'LENDÁRIO ★' : classes[(i + Math.floor(k)) % classes.length];
      g.textAlign = 'left'; g.font = '800 34px Inter, sans-serif'; g.fillStyle = '#FFFFFF'; g.fillText(n, 40, y);
      g.textAlign = 'right'; g.fillStyle = i === lendario ? '#FFD21F' : '#BFEFFF'; g.fillText(cl, 472, y);
    });
    t.needsUpdate = true;
  };
  desenhar();
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, transparent: true, side: THREE.DoubleSide, fog: false, toneMapped: false }));
  const grupo = new THREE.Group(); grupo.add(m);
  const aura = brilho('#58C8FF', Math.max(w, h) * 1.4, 0.18); aura.position.z = -0.2; grupo.add(aura);
  grupo.desenhar = desenhar;
  return grupo;
}
