// Avatar 3D no estilo "avatar de jogo em blocos" (tipo Roblox moderno): cabeça quadrada de cantos
// arredondados com rosto "decal", tronco em bloco, braços e pernas retos, mãos e pés em bloco,
// material plástico liso. Personagens originais (veja personagens-bloco.js).
//
//   const p = criarAvatarBloco(opcoes)
//   p.estado = { bracos: 'normal'|'aceno'|'cima'|'aponta'|'cabeca'|'abre'|'corre', expr: 'neutro'|'feliz'|'surpreso'|'serio'|'medo'|'bravo', andar, falando, olharLado }
//   p.animar(t)   // olha para +z; pés em y = 0; altura ~1,8 m
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const U = 0.34; // 1 "stud" do avatar em metros
const caixa = (w, h, d, r = 0.08) => new RoundedBoxGeometry(w, h, d, 4, r);
const cacheMat = new Map();
const plastico = (cor, rough = 0.5) => { const k = cor + rough; if (!cacheMat.has(k)) cacheMat.set(k, new THREE.MeshStandardMaterial({ color: cor, roughness: rough, metalness: 0 })); return cacheMat.get(k); };
function peca(geo, mat, pos = [0, 0, 0], rot = [0, 0, 0]) { const m = new THREE.Mesh(geo, mat); m.position.set(...pos); m.rotation.set(...rot); m.castShadow = true; m.receiveShadow = true; return m; }

/** Rosto desenhado (decal) — uma textura por expressão/boca. */
function texturaRosto({ olhos = '#3B2416', expr = 'neutro', boca = 0, sardas = false, pele = '#F2C29B' }) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  g.clearRect(0, 0, 256, 256);
  const grande = expr === 'surpreso' || expr === 'medo';
  // olhos: oval escuro com íris colorida e dois brilhos
  [-1, 1].forEach((s) => {
    const x = 128 + s * 46, y = 112;
    const rx = grande ? 22 : 19, ry = grande ? 30 : 26;
    g.fillStyle = '#16100C'; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill();
    g.fillStyle = olhos; g.beginPath(); g.ellipse(x, y + 4, rx * 0.72, ry * 0.68, 0, 0, 7); g.fill();
    g.fillStyle = '#16100C'; g.beginPath(); g.ellipse(x, y + 5, rx * 0.36, ry * 0.36, 0, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x - rx * 0.35, y - ry * 0.4, rx * 0.28, ry * 0.22, -0.4, 0, 7); g.fill();
    g.beginPath(); g.arc(x + rx * 0.35, y + ry * 0.35, rx * 0.12, 0, 7); g.fill();
    // sobrancelha
    g.strokeStyle = '#2A1A10'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath();
    const ang = expr === 'bravo' || expr === 'serio' ? s * 0.35 : expr === 'medo' ? -s * 0.35 : 0;
    const by = y - ry - (grande ? 22 : 14);
    g.moveTo(x - 20 * Math.cos(ang), by + s * 20 * Math.sin(ang) * -1); g.lineTo(x + 20 * Math.cos(ang), by - s * 20 * Math.sin(ang) * -1); g.stroke();
  });
  if (sardas) { g.fillStyle = 'rgba(150,80,40,.45)'; [[78, 160], [90, 168], [72, 172], [178, 160], [166, 168], [184, 172]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 4, 0, 7); g.fill(); }); }
  // bochechas
  g.fillStyle = 'rgba(240,110,100,.28)'; [-1, 1].forEach((s) => { g.beginPath(); g.ellipse(128 + s * 70, 168, 18, 10, 0, 0, 7); g.fill(); });
  // boca
  g.fillStyle = '#3A1410'; g.strokeStyle = '#3A1410'; g.lineWidth = 8; g.lineCap = 'round';
  if (boca > 0.15 || grande) {
    const h = grande ? 26 : 10 + boca * 22;
    g.beginPath(); g.ellipse(128, 190, grande ? 16 : 22, h / 2, 0, 0, 7); g.fill();
    g.fillStyle = '#E86A6A'; g.beginPath(); g.ellipse(128, 190 + h * 0.22, grande ? 10 : 14, h * 0.22, 0, 0, 7); g.fill();
  } else if (expr === 'feliz' || expr === 'neutro') {
    g.beginPath(); g.arc(128, 172, expr === 'feliz' ? 30 : 22, 0.2 * Math.PI, 0.8 * Math.PI); g.stroke();
    if (expr === 'feliz') { g.fillStyle = '#3A1410'; g.beginPath(); g.arc(128, 172, 30, 0.2 * Math.PI, 0.8 * Math.PI); g.closePath(); g.fill(); g.fillStyle = '#fff'; g.fillRect(108, 188, 40, 7); }
  } else {
    g.beginPath(); g.moveTo(108, 192); g.quadraticCurveTo(128, expr === 'bravo' ? 182 : 188, 148, 192); g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

export function criarAvatarBloco(o = {}) {
  const C = { pele: '#F2C29B', cabelo: '#3B2416', olhos: '#5B3A1E', camisa: '#2E7DE0', camisa2: '#1D5FB0', calca: '#2D3442', tenis: '#F4F4F4', sola: '#D23B2B', cabeloTipo: 'topete', ...o };
  const p = new THREE.Group();
  const corpo = new THREE.Group(); corpo.scale.setScalar(U); p.add(corpo);

  // pernas (pivô no quadril, y = 2)
  const pernas = [-1, 1].map((s) => {
    const g = new THREE.Group(); g.position.set(s * 0.46, 2, 0); corpo.add(g);
    g.add(peca(caixa(0.9, 1.72, 0.92, 0.16), plastico(C.calca), [0, -0.86, 0]));
    g.add(peca(caixa(0.98, 0.42, 1.12, 0.2), plastico(C.tenis, 0.4), [0, -1.78, 0.08]));
    g.add(peca(caixa(1.0, 0.12, 1.14, 0.06), plastico(C.sola, 0.4), [0, -1.96, 0.08]));
    return g;
  });
  // tronco (R15: parte de cima larga, cintura mais estreita)
  const tronco = new THREE.Group(); tronco.position.y = 2; corpo.add(tronco);
  tronco.add(peca(caixa(2.0, 1.3, 1.0, 0.2), plastico(C.camisa), [0, 1.35, 0]));
  tronco.add(peca(caixa(1.74, 0.85, 0.92, 0.16), plastico(C.camisa), [0, 0.55, 0]));
  tronco.add(peca(caixa(1.78, 0.26, 0.96, 0.1), plastico(C.calca), [0, 0.1, 0])); // cintura
  if (o.capuz !== false) {
    tronco.add(peca(caixa(1.1, 0.5, 0.12, 0.05), plastico(C.camisa2), [0, 0.6, 0.47])); // bolso
    tronco.add(peca(caixa(1.5, 0.35, 0.6, 0.15), plastico(C.camisa2), [0, 2.0, -0.35])); // capuz nas costas
    [-1, 1].forEach((s) => tronco.add(peca(new THREE.CylinderGeometry(0.035, 0.035, 0.6, 8), plastico('#F4F4F4', 0.4), [s * 0.25, 1.55, 0.52])));
  }
  if (o.estampa) {
    const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); o.estampa(g);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.75), new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.5 })); m.position.set(0, 1.35, 0.505); tronco.add(m);
  }
  if (o.mochila) { tronco.add(peca(caixa(1.4, 1.5, 0.6, 0.2), plastico(o.mochila), [0, 1.0, -0.78])); }
  // braços (pivô no ombro) com MÃOS arredondadas e polegar (como os avatares Roblox atuais)
  const bracos = [-1, 1].map((s) => {
    const g = new THREE.Group(); g.position.set(s * 1.43, 3.8, 0); corpo.add(g);
    g.add(peca(caixa(0.84, 1.36, 0.88, 0.2), plastico(C.camisa), [0, -0.6, 0]));
    g.add(peca(caixa(0.86, 0.18, 0.9, 0.08), plastico(C.camisa2), [0, -1.25, 0])); // punho
    const mao = new THREE.Group(); mao.position.set(0, -1.62, 0.02); g.add(mao);
    mao.add(peca(new THREE.SphereGeometry(0.33, 24, 18), plastico(C.pele), [0, 0, 0], [0, 0, 0]));
    mao.children[0].scale.set(1.0, 1.22, 0.85);
    const pol = peca(new THREE.CapsuleGeometry(0.1, 0.16, 6, 12), plastico(C.pele), [-s * 0.2, 0.08, 0.16], [0.4, 0, s * 0.7]); mao.add(pol);
    return g;
  });
  // cabeça clássica: cilindro de cantos bem arredondados, com o rosto curvado acompanhando
  const cabeca = new THREE.Group(); cabeca.position.y = 4.0; corpo.add(cabeca);
  const R = 0.64, H = 1.22, r = 0.22;
  const perfil = [new THREE.Vector2(0, 0)];
  for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + (i / 8) * (Math.PI / 2); perfil.push(new THREE.Vector2(R - r + Math.cos(a) * r, r + Math.sin(a) * r)); }
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * (Math.PI / 2); perfil.push(new THREE.Vector2(R - r + Math.cos(a) * r, H - r + Math.sin(a) * r)); }
  perfil.push(new THREE.Vector2(0, H));
  cabeca.add(peca(new THREE.LatheGeometry(perfil, 48), plastico(C.pele), [0, 0.02, 0]));
  const cacheRosto = new Map();
  const rostoMat = new THREE.MeshStandardMaterial({ transparent: true, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2 });
  const rosto = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.006, R + 0.006, 1.12, 40, 1, true, -1.0, 2.0), rostoMat); rosto.position.set(0, 0.62, 0); cabeca.add(rosto);
  const pegaRosto = (expr, boca) => { const k = expr + '|' + boca; if (!cacheRosto.has(k)) cacheRosto.set(k, texturaRosto({ olhos: C.olhos, expr, boca, sardas: o.sardas, pele: C.pele })); return cacheRosto.get(k); };
  // cabelo (casca arredondada + mechas em bloco)
  const cab = plastico(C.cabelo, 0.55);
  const cabD = new THREE.MeshStandardMaterial({ color: C.cabelo, roughness: 0.55, side: THREE.DoubleSide });
  const cupula = (rr, y, sy = 0.5) => { const m = peca(new THREE.SphereGeometry(rr, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), cab, [0, y, 0]); m.scale.y = sy; return m; };
  const casca = (rr, h, y, abre = 1.9) => peca(new THREE.CylinderGeometry(rr, rr, h, 40, 1, true, Math.PI - abre, abre * 2), cabD, [0, y, 0]);
  if (C.cabeloTipo === 'topete') {
    cabeca.add(cupula(0.7, 1.0, 0.62), casca(0.69, 0.75, 0.75));
    [[-0.4, 0.3], [-0.12, 0.4], [0.16, 0.36], [0.42, 0.24]].forEach(([x, h], i) => cabeca.add(peca(caixa(0.32, h, 0.3, 0.1), cab, [x, 1.36 + h * 0.25, 0.42], [0.55, 0, (i - 1.5) * 0.15])));
  } else if (C.cabeloTipo === 'cacheado') {
    cabeca.add(cupula(0.7, 1.0, 0.62), casca(0.69, 0.6, 0.85));
    for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; cabeca.add(peca(new THREE.SphereGeometry(0.22, 14, 10), cab, [Math.cos(a) * 0.58, 1.28 + Math.sin(i * 1.7) * 0.05, Math.sin(a) * 0.55 - 0.06])); }
  } else if (C.cabeloTipo === 'longo') {
    cabeca.add(cupula(0.71, 1.0, 0.62), casca(0.7, 1.7, 0.4, 2.0));
    cabeca.add(peca(caixa(1.0, 0.24, 0.26, 0.1), cab, [0, 1.16, 0.56], [0.35, 0, 0])); // franja
  }
  if (o.bone) {
    cabeca.add(cupula(0.73, 1.05, 0.7));
    cabeca.add(peca(caixa(1.1, 0.08, 0.7, 0.04), plastico(o.bone), [0, 1.1, 0.85], [0.1, 0, 0]));
  }
  if (o.fone) {
    cabeca.add(peca(new THREE.TorusGeometry(0.78, 0.07, 10, 30, Math.PI), plastico(o.fone, 0.35), [0, 0.72, 0]));
    [-1, 1].forEach((s) => cabeca.add(peca(new THREE.CylinderGeometry(0.26, 0.26, 0.22, 24), plastico(o.fone, 0.35), [s * 0.72, 0.66, 0], [0, 0, Math.PI / 2])));
  }

  p.estado = { bracos: 'normal', expr: 'feliz', andar: 0 };
  Object.assign(p, { cabeca, bracos, pernas, tronco, corpo });
  p.animar = (t) => {
    const e = p.estado;
    const vel = e.correr ? 13 : 7.5;
    const passo = Math.sin(t * vel) * (e.correr ? 0.95 : 0.55) * (e.andar || 0);
    pernas[0].rotation.x = passo; pernas[1].rotation.x = -passo;
    corpo.position.y = Math.abs(Math.sin(t * vel)) * 0.03 * (e.andar || 0);
    const [d, es] = bracos;
    d.rotation.set(-passo, 0, 0.04); es.rotation.set(passo, 0, -0.04);
    switch (e.bracos) {
      case 'aceno': d.rotation.set(0, 0, -2.6 + Math.sin(t * 10) * 0.35); break;
      case 'cima': d.rotation.set(0, 0, -2.75); es.rotation.set(0, 0, 2.75); break;
      case 'aponta': d.rotation.set(-1.55, 0, 0); break;
      case 'cabeca': d.rotation.set(-0.4, 0, 2.5); es.rotation.set(-0.4, 0, -2.5); break;
      case 'abre': d.rotation.set(-0.2, 0, 0.9); es.rotation.set(-0.2, 0, -0.9); break;
      case 'corre': d.rotation.set(-Math.sin(t * 13) * 1.2, 0, 0); es.rotation.set(Math.sin(t * 13) * 1.2, 0, 0); break;
      case 'pose': d.rotation.set(-0.3, 0, -0.5); es.rotation.set(0, 0, -0.25); es.rotation.z = -0.2; break;
    }
    const falando = e.falando ? Math.abs(Math.sin(t * 15)) : 0;
    const boca = Math.round(falando * 3) / 3;
    const novo = pegaRosto(e.expr || 'neutro', boca);
    if (!rostoMat.map) { rostoMat.map = novo; rostoMat.needsUpdate = true; } else rostoMat.map = novo;
    cabeca.rotation.y = e.olharLado || 0;
    cabeca.rotation.z = e.inclina || 0;
  };
  p.animar(0);
  return p;
}
