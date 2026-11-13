// voxel.js — mundo 3D em blocos (estética voxel original) para a série LUA DE SANGUE.
// Personagens articulados (cabeça, tronco, braços, pernas) com texturas em pixel art,
// rosto com expressões (piscar, falar, sorrir, triste, surpreso, olhos de lobo), cabelo em blocos,
// cenários (grama, árvores, casas, escola, rua, lua), luz cinematográfica e câmera.
// Usa three.js (estudio/vendor/three.min.js, MIT).

const U = 1 / 16; // 1 "pixel" do personagem em unidades do mundo (cabeça = 8 px = 0,5)
let R3 = null;    // { renderer, scene, camera }

function iniciar3D() {
  if (R3) return R3;
  const canvas = document.getElementById('gl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(1080, 1920, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const camera = new THREE.PerspectiveCamera(38, 1080 / 1920, 0.05, 400);
  R3 = { renderer, camera, cenas: {} };
  return R3;
}
// Desenha a cena e devolve '' (a sobreposição SVG fica por cima do canvas).
function render3D(scene, cam) {
  const r = iniciar3D();
  if (cam) { r.camera.position.set(...cam.pos); r.camera.lookAt(...cam.alvo); if (cam.fov) { r.camera.fov = cam.fov; r.camera.updateProjectionMatrix(); } }
  r.renderer.render(scene, r.camera);
  return '';
}

// ---------- texturas em pixel art ----------
const CACHE_TEX = {};
function textura(chave, w, h, desenha) {
  if (CACHE_TEX[chave]) return CACHE_TEX[chave];
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  desenha(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  CACHE_TEX[chave] = t;
  return t;
}
function px(g, x, y, cor, w = 1, h = 1) { g.fillStyle = cor; g.fillRect(x, y, w, h); }
function ruido(g, w, h, cores, semente = 1, dens = 0.35) {
  const r = aleatorio(semente);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (r() < dens) px(g, x, y, cores[Math.floor(r() * cores.length)]);
}
const MAT = {};
function mat(chave, tex, o = {}) {
  if (MAT[chave]) return MAT[chave];
  MAT[chave] = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0, transparent: !!o.transparente, alphaTest: o.transparente ? 0.5 : 0, emissive: o.emissivo || 0x000000, emissiveMap: o.emissivo ? tex : null, emissiveIntensity: o.emissivo ? 1 : 0 });
  return MAT[chave];
}
function matCor(cor, o = {}) {
  const k = 'cor' + cor + (o.emissivo || '');
  if (!MAT[k]) MAT[k] = new THREE.MeshStandardMaterial({ color: cor, roughness: 0.9, emissive: o.emissivo || 0x000000, emissiveIntensity: o.emissivo ? 1.2 : 0 });
  return MAT[k];
}
// Caixa com 6 texturas (ordem three: +x, -x, +y, -y, +z frente, -z costas).
function caixa(w, h, d, mats) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w * U, h * U, d * U), mats);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

// ---------- rosto (16x16) ----------
// st: { expr: neutro|sorriso|triste|surpreso|bravo|apaixonado|medo, piscar, fala, lobo (0..1) }
function desenhaRosto(g, C, st) {
  const P = C.pele, Ps = C.peleSombra || sombrear(C.pele, 0.85);
  px(g, 0, 0, P, 16, 16);
  // sombra suave no queixo e laterais
  px(g, 0, 14, Ps, 16, 2); px(g, 0, 0, Ps, 1, 16); px(g, 15, 0, Ps, 1, 16);
  // cabelo da frente (franja): alturas por coluna
  const fr = C.franja || [5, 5, 4, 4, 3, 3, 4, 3, 3, 4, 3, 3, 4, 4, 5, 5];
  for (let x = 0; x < 16; x++) for (let y = 0; y < fr[x]; y++) px(g, x, y, C.cabelo[(x * 7 + y * 3) % C.cabelo.length]);
  if (C.capuz) { px(g, 0, 0, C.capuz, 16, 1); px(g, 0, 0, C.capuz, 1, 16); px(g, 15, 0, C.capuz, 1, 16); }
  const e = st.expr || 'neutro';
  const lobo = st.lobo || 0;
  // sobrancelhas (linha 6/7)
  const sb = C.sobrancelha || sombrear(C.cabelo[0], 0.7);
  const bS = { bravo: [[3, 7], [4, 6], [5, 6]], triste: [[3, 6], [4, 6], [5, 7]], surpreso: [[3, 5], [4, 5], [5, 5]], medo: [[3, 6], [4, 5], [5, 6]] }[e] || [[3, 6], [4, 6], [5, 6]];
  for (const [x, y] of bS) { px(g, x, y, sb); px(g, 15 - x, y, sb); }
  // olhos (colunas 3-5 e 10-12, linhas 8-9)
  const iris = lobo > 0.5 ? (C.olhoLobo || '#FFD23A') : C.olhos;
  const irisEsc = lobo > 0.5 ? '#B8860B' : sombrear(C.olhos, 0.6);
  if (st.piscar || e === 'sorriso' && st.olhosFechados) {
    for (const x0 of [3, 10]) px(g, x0, 9, '#2A1E1A', 3, 1);
  } else {
    const alto = e === 'surpreso' || e === 'medo' ? 3 : 2;
    for (const [x0, lado] of [[3, -1], [10, 1]]) {
      const yb = 10 - alto;
      px(g, x0, yb, '#FFFFFF', 3, alto);
      const xi = lado < 0 ? x0 + 1 : x0;
      px(g, xi, yb, iris, 2, alto);
      px(g, xi + (lado < 0 ? 1 : 0), yb + alto - 1, irisEsc, 1, 1);
      px(g, xi + (lado < 0 ? 0 : 1), yb, '#FFFFFF', 1, 1); // brilho
      if (C.cilios) px(g, x0 - (lado < 0 ? 1 : -3), yb, '#2A1E1A', 1, 1);
    }
  }
  if (e === 'apaixonado' || st.corar) { px(g, 2, 11, '#F2A0A8', 2, 1); px(g, 12, 11, '#F2A0A8', 2, 1); }
  // nariz
  px(g, 7, 11, Ps, 2, 1);
  // boca
  const B = '#7A3A32', D = '#3A1A18';
  if (st.fala) { px(g, 6, 12, D, 4, 2); px(g, 6, 12, '#FFFFFF', 4, 1); }
  else if (e === 'sorriso' || e === 'apaixonado') { px(g, 5, 12, B); px(g, 10, 12, B); px(g, 6, 13, B, 4, 1); }
  else if (e === 'triste' || e === 'medo') { px(g, 6, 12, B, 4, 1); px(g, 5, 13, B); px(g, 10, 13, B); }
  else if (e === 'surpreso') px(g, 7, 12, D, 2, 2);
  else if (e === 'bravo') px(g, 6, 13, B, 4, 1);
  else px(g, 6, 13, B, 4, 1);
  if (lobo > 0.6) { px(g, 6, 14, '#FFFFFF'); px(g, 9, 14, '#FFFFFF'); }
}
function sombrear(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * k)), g = Math.min(255, Math.round(((n >> 8) & 255) * k)), b = Math.min(255, Math.round((n & 255) * k));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function texCabeca(C, lado, st) {
  const chave = `cab-${C.id}-${lado}-${lado === 'frente' ? [st.expr, st.piscar, st.fala, st.lobo > 0.5, st.corar].join(',') : ''}`;
  return textura(chave, 16, 16, (g) => {
    if (lado === 'frente') return desenhaRosto(g, C, st);
    const P = C.pele;
    px(g, 0, 0, P, 16, 16);
    const H = C.cabelo;
    if (lado === 'topo' || lado === 'costas') { px(g, 0, 0, H[0], 16, 16); ruido(g, 16, 16, H, C.id.length * 3 + (lado === 'topo' ? 1 : 2), 0.5); if (lado === 'costas' && !C.longo) px(g, 0, 13, P, 16, 3); }
    else if (lado === 'lado') {
      px(g, 0, 0, H[0], 16, 6); px(g, 8, 0, H[0], 8, C.longo ? 16 : 12); ruido(g, 16, 6, H, 7, 0.5);
      px(g, 5, 8, sombrear(P, 0.8), 2, 3); // orelha
      if (C.longo) px(g, 0, 0, H[0], 16, 16), ruido(g, 16, 16, H, 9, 0.5);
    } else px(g, 0, 0, sombrear(P, 0.8), 16, 16);
    if (C.capuz && lado !== 'baixo') { px(g, 0, 0, C.capuz, 16, 16); ruido(g, 16, 16, [sombrear(C.capuz, 1.25), sombrear(C.capuz, 0.85)], 11, 0.25); }
  });
}

// ---------- roupas ----------
function texTronco(C, lado) {
  return textura(`tro-${C.id}-${lado}`, 16, 24, (g) => C.desenhaTronco(g, lado));
}
function texBraco(C, lado) {
  return textura(`bra-${C.id}-${lado}`, 8, 24, (g) => C.desenhaBraco(g, lado));
}
function texPerna(C, lado) {
  return textura(`per-${C.id}-${lado}`, 8, 24, (g) => C.desenhaPerna(g, lado));
}

// ---------- personagem ----------
// Cria o modelo; atualiza com pose(p, {...}).
function criarPersonagem(C) {
  const raiz = new THREE.Group();
  const quadril = new THREE.Group(); quadril.position.y = 12 * U; raiz.add(quadril);
  const lados = ['lado', 'lado', 'topo', 'baixo', 'frente', 'costas'];
  const tronco = caixa(8, 12, 4, ['lado', 'lado', 'topo', 'baixo', 'frente', 'costas'].map((l) => mat(`tro-${C.id}-${l}`, texTronco(C, l))));
  tronco.position.y = 6 * U; quadril.add(tronco);
  const pescoco = new THREE.Group(); pescoco.position.y = 12 * U; quadril.add(pescoco);
  const st0 = { expr: 'neutro' };
  const cabeca = caixa(8, 8, 8, lados.map((l) => new THREE.MeshStandardMaterial({ map: texCabeca(C, l, st0), roughness: 0.9 })));
  cabeca.position.y = 4 * U; pescoco.add(cabeca);
  // camada de cabelo/capuz em blocos
  const extra = new THREE.Group(); cabeca.add(extra);
  (C.blocosCabelo || []).forEach(([x, y, z, w, h, d, cor]) => { const b = caixa(w, h, d, matCor(cor)); b.position.set(x * U, y * U, z * U); extra.add(b); });
  const membro = (w, texFn, x, y) => {
    const piv = new THREE.Group(); piv.position.set(x * U, y * U, 0);
    const m = caixa(w, 12, 4, ['lado', 'lado', 'topo', 'baixo', 'frente', 'costas'].map((l) => mat(`${texFn.name}-${C.id}-${l}`, texFn(C, l))));
    m.position.y = -6 * U; piv.add(m);
    return piv;
  };
  const bracoE = membro(C.bracoFino ? 3 : 4, texBraco, -(4 + (C.bracoFino ? 1.5 : 2)), 12); quadril.add(bracoE);
  const bracoD = membro(C.bracoFino ? 3 : 4, texBraco, 4 + (C.bracoFino ? 1.5 : 2), 12); quadril.add(bracoD);
  const pernaE = membro(4, texPerna, -2, 0); quadril.add(pernaE);
  const pernaD = membro(4, texPerna, 2, 0); quadril.add(pernaD);
  // cabelo comprido (painel atrás) e extras do tronco
  (C.blocosCorpo || []).forEach(([x, y, z, w, h, d, cor]) => { const b = caixa(w, h, d, matCor(cor)); b.position.set(x * U, y * U, z * U); quadril.add(b); });
  // olhos brilhando (lobo)
  const brilho = new THREE.Group(); cabeca.add(brilho);
  for (const lx of [-2.5, 2.5]) { const b = new THREE.Mesh(new THREE.BoxGeometry(1.6 * U, 0.8 * U, 0.2 * U), matCor('#FFD23A', { emissivo: '#FFB800' })); b.position.set(lx * U, -0.5 * U, 4.12 * U); brilho.add(b); }
  brilho.visible = false;
  raiz.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { C, raiz, quadril, tronco, pescoco, cabeca, bracoE, bracoD, pernaE, pernaD, brilho, st: '' };
}
// Pose/animação. o: { t, x, z, rot (graus), andar (velocidade 0..1), correr, olhar: [yaw, pitch] graus,
//   expr, fala, lobo, corar, bracoE/bracoD: [rotX, rotZ] graus, agachar, maoNoRosto }
function pose(p, o = {}) {
  const t = o.t || 0;
  const r = Math.PI / 180;
  p.raiz.position.set(o.x || 0, o.y || 0, o.z || 0);
  p.raiz.rotation.y = (o.rot || 0) * r;
  const v = o.correr ? 1 : o.andar || 0;
  const fase = t * (o.correr ? 13 : 8);
  const amp = (o.correr ? 55 : 32) * v;
  const balanco = Math.sin(fase) * amp * r;
  p.pernaE.rotation.x = balanco; p.pernaD.rotation.x = -balanco;
  p.bracoE.rotation.x = -balanco * 0.9; p.bracoD.rotation.x = balanco * 0.9;
  p.bracoE.rotation.z = -3 * r; p.bracoD.rotation.z = 3 * r;
  p.quadril.position.y = 12 * U + Math.abs(Math.sin(fase)) * (o.correr ? 1.4 : 0.6) * U * (v > 0 ? 1 : 0) - (o.agachar || 0) * U;
  p.tronco.rotation.x = (o.correr ? 10 : 0) * r;
  // respiração e idle
  const resp = Math.sin(t * 2.1) * 0.25 * U;
  p.pescoco.position.y = 12 * U + resp;
  if (o.bracoE) { p.bracoE.rotation.x = o.bracoE[0] * r; p.bracoE.rotation.z = o.bracoE[1] * r; }
  if (o.bracoD) { p.bracoD.rotation.x = o.bracoD[0] * r; p.bracoD.rotation.z = o.bracoD[1] * r; }
  if (o.acenar) { p.bracoD.rotation.z = 150 * r + Math.sin(t * 9) * 18 * r; p.bracoD.rotation.x = 0; }
  const [yaw, pitch] = o.olhar || [Math.sin(t * 0.6) * 4, 0];
  p.cabeca.rotation.y = yaw * r; p.cabeca.rotation.x = pitch * r;
  // rosto (troca a textura da frente quando o estado muda)
  const piscar = o.piscar ?? (((t + (p.C.semente || 1) * 0.73) % 3.7) < 0.12);
  const st = { expr: o.expr || 'neutro', piscar, fala: o.fala && Math.sin(t * 15) > 0, lobo: o.lobo || 0, corar: o.corar };
  const chave = [st.expr, st.piscar, st.fala, st.lobo > 0.5, st.corar].join(',');
  if (chave !== p.st) { p.cabeca.material[4].map = texCabeca(p.C, 'frente', st); p.cabeca.material[4].needsUpdate = true; p.st = chave; }
  p.brilho.visible = (o.lobo || 0) > 0.5;
  return p;
}

// ---------- cenário ----------
function texBloco(tipo) {
  return textura('bloco-' + tipo, 16, 16, (g) => {
    const T = {
      grama: ['#5FA04A', ['#4E8E3A', '#6BB255', '#57983F']], terra: ['#7A5434', ['#6A4628', '#8A6240', '#5E3E22']],
      pedra: ['#7E7E84', ['#6E6E74', '#8E8E94', '#66666C']], madeira: ['#A87A4A', ['#946A3E', '#B88A58']], tronco: ['#6A4A2E', ['#5A3E24', '#7A5838']],
      folha: ['#2F6A2A', ['#28601F', '#3A7A33', '#24561C']], tijolo: ['#A8523A', ['#944632']], asfalto: ['#3A3A40', ['#34343A', '#44444A']],
      telhado: ['#7A2E2A', ['#6A2622', '#8A3632']], vidro: ['#9FC8E8', ['#B8DAF0']], calcada: ['#B8B2A8', ['#A8A298', '#C4BEB4']],
    }[tipo] || ['#888', ['#777']];
    px(g, 0, 0, T[0], 16, 16); ruido(g, 16, 16, T[1], tipo.length * 5, tipo === 'vidro' ? 0.1 : 0.45);
    if (tipo === 'tijolo') { for (let y = 0; y < 16; y += 4) { px(g, 0, y, '#C8B8A8', 16, 1); for (let x = (y / 4) % 2 ? 4 : 0; x < 16; x += 8) px(g, x, y, '#C8B8A8', 1, 4); } }
    if (tipo === 'madeira') for (let y = 0; y < 16; y += 4) px(g, 0, y, '#7A5430', 16, 1);
    if (tipo === 'grama') { px(g, 0, 0, '#6BB255', 16, 2); }
  });
}
// Blocos instanciados (muitos cubos 1x1x1 do mesmo tipo).
function blocos(tipo, posicoes, o = {}) {
  const m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat('mb-' + tipo + (o.emissivo || ''), texBloco(tipo), o), posicoes.length);
  const d = new THREE.Object3D();
  posicoes.forEach(([x, y, z], i) => { d.position.set(x, y, z); d.updateMatrix(); m.setMatrixAt(i, d.matrix); });
  m.castShadow = o.sombra !== false; m.receiveShadow = true;
  return m;
}
function chao(raio, tipo = 'grama', y = -0.5) {
  const pos = [];
  for (let x = -raio; x <= raio; x++) for (let z = -raio; z <= raio; z++) pos.push([x, y, z]);
  return blocos(tipo, pos, { sombra: false });
}
function arvore(x, z, h = 5, semente = 1) {
  const g = new THREE.Group();
  const tr = []; for (let y = 0; y < h; y++) tr.push([x, y + 0.5, z]);
  g.add(blocos('tronco', tr));
  const r = aleatorio(semente), fl = [];
  for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) for (let dy = 0; dy < 3; dy++) {
    if (Math.abs(dx) + Math.abs(dz) + dy > 4 || (Math.abs(dx) === 2 && Math.abs(dz) === 2 && r() < 0.7)) continue;
    fl.push([x + dx, h - 0.5 + dy, z + dz]);
  }
  g.add(blocos('folha', fl));
  return g;
}
function floresta3D(raio, densidade = 0.06, semente = 3, vazio = 3) {
  const g = new THREE.Group(), r = aleatorio(semente);
  for (let x = -raio; x <= raio; x += 3) for (let z = -raio; z <= raio; z += 3) {
    if (Math.abs(x) < vazio && Math.abs(z) < vazio) continue;
    if (r() < densidade * 9) g.add(arvore(x + Math.floor(r() * 2), z + Math.floor(r() * 2), 4 + Math.floor(r() * 4), Math.floor(r() * 1000)));
  }
  return g;
}
function lua3D(cor = '#FFF4D6', pos = [-20, 28, -60], tam = 6) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.BoxGeometry(tam, tam, 0.5), new THREE.MeshBasicMaterial({ color: cor }));
  m.position.set(...pos); g.add(m);
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(tam * 3, tam * 3), new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: 0.12 }));
  halo.position.set(pos[0], pos[1], pos[2] - 0.5); g.add(halo);
  return g;
}
function estrelas(n = 400, semente = 7) {
  const r = aleatorio(semente), p = [];
  for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, e = 0.15 + r() * 1.2; p.push(Math.cos(a) * 120 * Math.cos(e), 120 * Math.sin(e), Math.sin(a) * 120 * Math.cos(e)); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({ color: '#ffffff', size: 0.5, sizeAttenuation: true }));
}
// Casa simples em blocos (paredes de madeira/tijolo, telhado, janelas iluminadas e porta).
function casa3D(x, z, { w = 7, d = 6, h = 4, parede = 'madeira', luz = true, rot = 0 } = {}) {
  const g = new THREE.Group(), par = [], vid = [], tel = [];
  for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) for (let y = 0; y < h; y++) {
    if (i > 0 && i < w - 1 && j > 0 && j < d - 1) continue;
    const janela = y === 2 && j === 0 && (i === 1 || i === w - 2);
    const porta = j === 0 && i === Math.floor(w / 2) && y < 2;
    if (porta) continue;
    (janela ? vid : par).push([i - w / 2 + 0.5, y + 0.5, j - d / 2 + 0.5]);
  }
  for (let k = 0; k <= Math.ceil(d / 2); k++) for (let i = -1; i <= w; i++) { tel.push([i - w / 2 + 0.5, h + k + 0.5, -d / 2 + k]); tel.push([i - w / 2 + 0.5, h + k + 0.5, d / 2 - k]); }
  g.add(blocos(parede, par));
  g.add(blocos('telhado', tel));
  if (vid.length) g.add(blocos('vidro', vid, { emissivo: luz ? '#FFC870' : undefined }));
  if (luz) { const l = new THREE.PointLight('#FFB860', 3, 8); l.position.set(0, 2, -d / 2 - 0.5); g.add(l); }
  g.position.set(x, 0, z); g.rotation.y = rot;
  return g;
}
// Cena-base com céu, neblina e luzes. hora: 'noite'|'por'|'dia'|'luaSangue'
function cenaBase(hora = 'noite') {
  const sc = new THREE.Scene();
  const C = { noite: ['#0B1230', '#3A5AA8', '#C8D8FF', 0.6], por: ['#F2A65A', '#FFD0A0', '#FFF0D8', 1.4], dia: ['#8CCBF0', '#FFFFFF', '#FFF8E8', 1.8], luaSangue: ['#2A0810', '#A0303A', '#FF7A7A', 0.9] }[hora];
  sc.background = new THREE.Color(C[0]);
  sc.fog = new THREE.FogExp2(C[0], hora === 'dia' ? 0.01 : hora === 'por' ? 0.014 : 0.025);
  sc.add(new THREE.HemisphereLight(C[1], '#1A1410', hora === 'dia' ? 1.1 : 0.55));
  const sol = new THREE.DirectionalLight(C[2], C[3]);
  sol.position.set(-12, 20, 10); sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048); Object.assign(sol.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 80 });
  sol.shadow.bias = -0.0005;
  sc.add(sol);
  if (hora !== 'dia') sc.add(estrelas());
  return sc;
}

// ---------- elenco (visual fixo de cada personagem) ----------
const ELENCO = {};
function personagemDef(C) { ELENCO[C.id] = C; return C; }

personagemDef({
  id: 'lucas', semente: 1, pele: '#E8B896', olhos: '#2EA8F0', olhoLobo: '#FFD23A',
  cabelo: ['#4A3426', '#5E422E', '#7A5A40', '#3A281C'], capuz: '#26262C',
  franja: [3, 4, 5, 4, 5, 6, 4, 5, 6, 4, 5, 6, 4, 5, 4, 3],
  // mechas espetadas saindo do capuz
  blocosCabelo: [[-2, 4.6, 4.1, 2, 1.4, 0.6, '#5E422E'], [1, 4.4, 4.1, 2, 1.2, 0.6, '#7A5A40'], [-3.6, 3.6, 4.1, 1, 2, 0.6, '#4A3426'], [3.4, 3.4, 4.1, 1, 2, 0.6, '#3A281C'],
    [0, 4.4, -0.2, 8.6, 0.9, 8.6, '#26262C'], [-4.3, 0, -0.2, 0.8, 8.6, 8.6, '#26262C'], [4.3, 0, -0.2, 0.8, 8.6, 8.6, '#26262C'], [0, 0, -4.4, 8.6, 8.6, 0.8, '#26262C']],
  desenhaTronco(g, l) {
    px(g, 0, 0, '#26262C', 16, 24); ruido(g, 16, 24, ['#3A3A44', '#4C4C58', '#1E1E24'], 21, 0.28);
    if (l === 'frente') {
      for (let y = 6; y < 22; y += 4) for (let x = (y / 4) % 2 ? 2 : 0; x < 16; x += 4) px(g, x, y, '#5A5A66', 2, 2);
      px(g, 4, 2, '#E8E8F0', 1, 9); px(g, 11, 2, '#E8E8F0', 1, 9); px(g, 4, 11, '#2F8FE8', 1, 2); px(g, 11, 11, '#2F8FE8', 1, 2);
      px(g, 3, 14, '#1E1E24', 10, 1); px(g, 3, 14, '#1E1E24', 1, 6); px(g, 12, 14, '#1E1E24', 1, 6); // bolso canguru
      px(g, 0, 22, '#1E1E24', 16, 2);
    }
  },
  desenhaBraco(g, l) { px(g, 0, 0, '#26262C', 8, 24); ruido(g, 8, 24, ['#3A3A44', '#4C4C58'], 22, 0.3); px(g, 0, 17, '#1E1E24', 8, 2); px(g, 0, 19, '#E8B896', 8, 5); px(g, 0, 23, '#D8A886', 8, 1); },
  desenhaPerna(g, l) { px(g, 0, 0, '#1E1E26', 8, 24); ruido(g, 8, 24, ['#2A2A34'], 23, 0.3); px(g, 0, 19, '#2A2A30', 8, 5); px(g, 0, 22, '#E8E8F0', 8, 2); },
});
personagemDef({
  id: 'isabella', semente: 2, pele: '#F2C6A6', olhos: '#3AA84A', cilios: true, longo: true, bracoFino: true,
  cabelo: ['#7A4A2A', '#8A5634', '#6A3E22', '#9A6440'],
  franja: [6, 5, 4, 3, 3, 2, 2, 2, 3, 3, 2, 2, 3, 4, 5, 6],
  blocosCabelo: [[0, 4.5, -0.3, 8.8, 1, 8.8, '#7A4A2A'], [-4.4, -1, 0.6, 1, 10, 7.4, '#8A5634'], [4.4, -1, 0.6, 1, 10, 7.4, '#7A4A2A']],
  // cabelo comprido caindo nas costas e nos ombros
  blocosCorpo: [[0, 8, -2.6, 9, 14, 1.4, '#7A4A2A'], [-4.6, 10, 1.4, 1.4, 6, 2, '#8A5634'], [4.6, 10, 1.4, 1.4, 6, 2, '#6A3E22']],
  desenhaTronco(g, l) {
    px(g, 0, 0, '#4CAF50', 16, 24); ruido(g, 16, 24, ['#43A047', '#57B85B'], 31, 0.25);
    if (l === 'frente') { px(g, 5, 0, '#F4F4F0', 6, 2); px(g, 6, 2, '#F4F4F0', 4, 1); px(g, 1, 0, '#7A4E2A', 2, 24); px(g, 13, 0, '#7A4E2A', 2, 24); }
    if (l === 'costas') { px(g, 2, 2, '#7A4E2A', 12, 14); px(g, 3, 4, '#8A5E3A', 10, 2); }
    px(g, 0, 20, '#2F5FA8', 16, 4);
  },
  desenhaBraco(g) { px(g, 0, 0, '#4CAF50', 8, 6); px(g, 0, 6, '#F4F4F0', 8, 2); px(g, 0, 8, '#F2C6A6', 8, 16); px(g, 0, 23, '#E2B696', 8, 1); },
  desenhaPerna(g) { px(g, 0, 0, '#2F5FA8', 8, 24); ruido(g, 8, 24, ['#3A6AB8', '#284E90'], 33, 0.3); px(g, 0, 20, '#F4F4F0', 8, 4); px(g, 0, 22, '#C83A3A', 8, 2); },
});
personagemDef({
  id: 'ryan', semente: 3, pele: '#F2C8A0', olhos: '#2E6FD8',
  cabelo: ['#E8B84A', '#F2C85A', '#C8963A', '#D8A846'],
  franja: [5, 5, 4, 4, 4, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5],
  blocosCabelo: [[0, 4.5, 0, 8.6, 1.2, 8.6, '#E8B84A'], [-1.5, 5.4, 1.5, 3, 1, 3, '#F2C85A'], [2, 5.3, -1, 2.6, 1, 3, '#C8963A']],
  desenhaTronco(g, l) {
    px(g, 0, 0, '#1E2A5A', 16, 24); ruido(g, 16, 24, ['#24326A', '#18224C'], 41, 0.25);
    if (l === 'frente') { px(g, 5, 0, '#F4F4F0', 6, 24); for (let x = 5; x < 11; x += 2) px(g, x, 0, '#D93A3A', 1, 24); px(g, 4, 0, '#C8A040', 1, 24); px(g, 11, 0, '#C8A040', 1, 24); px(g, 13, 5, '#C8A040', 1, 1); }
    px(g, 0, 21, '#3A2A4A', 16, 3);
  },
  desenhaBraco(g) { px(g, 0, 0, '#1E2A5A', 8, 20); px(g, 0, 4, '#D93A3A', 8, 3); px(g, 0, 7, '#F4F4F0', 8, 1); px(g, 0, 15, '#D93A3A', 8, 3); px(g, 0, 20, '#F2C8A0', 8, 4); },
  desenhaPerna(g) { px(g, 0, 0, '#3A2A4A', 8, 24); ruido(g, 8, 24, ['#46345A', '#2E2240'], 43, 0.3); px(g, 0, 21, '#1A1A20', 8, 3); },
});
personagemDef({
  id: 'sophie', semente: 4, pele: '#F0D6C6', olhos: '#9AA0B0', cilios: true, longo: true, bracoFino: true,
  cabelo: ['#6A2A9A', '#7E3CB0', '#55207E', '#8A4ABA'],
  franja: [7, 7, 6, 5, 5, 4, 4, 5, 6, 3, 3, 4, 5, 6, 7, 7],
  blocosCabelo: [[0, 4.5, -0.3, 8.8, 1, 8.8, '#6A2A9A'], [-4.4, -2, 0.6, 1, 12, 7.4, '#7E3CB0'], [4.4, -2, 0.6, 1, 12, 7.4, '#55207E']],
  blocosCorpo: [[0, 7, -2.6, 9, 16, 1.4, '#6A2A9A'], [-4.6, 9, 1.4, 1.4, 8, 2, '#7E3CB0'], [4.6, 9, 1.4, 1.4, 8, 2, '#55207E']],
  desenhaTronco(g, l) {
    px(g, 0, 0, '#3A3A40', 16, 24); ruido(g, 16, 24, ['#2E2E34', '#46464C'], 51, 0.25);
    if (l === 'frente') { px(g, 4, 0, '#121216', 8, 24); px(g, 6, 7, '#E8E4F0', 3, 1); px(g, 5, 8, '#E8E4F0', 2, 4); px(g, 6, 12, '#E8E4F0', 3, 1); px(g, 7, 9, '#121216', 1, 2); }
    px(g, 0, 21, '#121216', 16, 3);
  },
  desenhaBraco(g) { px(g, 0, 0, '#3A3A40', 8, 20); ruido(g, 8, 20, ['#2E2E34'], 52, 0.3); px(g, 0, 18, '#121216', 8, 2); px(g, 0, 20, '#F0D6C6', 8, 4); },
  desenhaPerna(g) { px(g, 0, 0, '#121216', 8, 24); px(g, 2, 6, '#E8E4F0', 3, 1); px(g, 1, 7, '#E8E4F0', 4, 1); px(g, 4, 13, '#E8E4F0', 3, 1); px(g, 0, 21, '#2A2A30', 8, 3); },
});
