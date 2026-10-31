// Peças low-poly reutilizáveis: materiais, caixas, terreno facetado, água,
// árvores, casas, caminhão e carro.

import * as THREE from 'three';

const cacheMat = new Map();
/** Material facetado (flat shading). Use opcoes.cortavel com ctx.cortavel para sumir na vista em corte. */
export function mat(cor, opcoes = {}) {
  const chave = cor + JSON.stringify(opcoes);
  if (!opcoes.unico && cacheMat.has(chave)) return cacheMat.get(chave);
  const m = new THREE.MeshStandardMaterial({
    color: cor, flatShading: true, roughness: opcoes.brilho ? 0.35 : 0.92, metalness: opcoes.metal ? 0.55 : 0,
    transparent: opcoes.opacidade != null, opacity: opcoes.opacidade ?? 1, vertexColors: !!opcoes.vertexColors,
    emissive: opcoes.emissivo || '#000000', side: opcoes.duplo ? THREE.DoubleSide : THREE.FrontSide,
    fog: opcoes.semNeblina ? false : true,
  });
  if (!opcoes.unico) cacheMat.set(chave, m);
  return m;
}

export function malha(geo, material, { sombra = true } = {}) {
  const m = new THREE.Mesh(geo, material);
  m.castShadow = sombra;
  m.receiveShadow = true;
  return m;
}

/** Posiciona um objeto e devolve ele mesmo. */
export function em(obj, x, y, z) {
  obj.position.set(x, y, z);
  return obj;
}

export function caixa(w, h, d, material, [x, y, z] = [0, 0, 0], opcoes) {
  const m = malha(new THREE.BoxGeometry(w, h, d), material, opcoes);
  m.position.set(x, y, z);
  return m;
}

export function cilindro(r, h, material, [x, y, z] = [0, 0, 0], lados = 8) {
  const m = malha(new THREE.CylinderGeometry(r, r, h, lados), material);
  m.position.set(x, y, z);
  return m;
}

// Ruído suave determinístico (para morros e variação de cor).
export function ruido(x, z) {
  const s = (a, b) => Math.sin(a * 0.071 + b * 0.043) * 0.5 + Math.sin(a * 0.023 - b * 0.057) * 0.35 + Math.sin((a + b) * 0.13) * 0.15;
  return s(x, z);
}

/**
 * Terreno facetado.
 * @param {(x,z)=>number} altura  função de altura
 * @param {(y, inclinacao, x, z)=>string} cor  cor de cada triângulo
 */
export function terreno(altura, cor, { largura = 600, profundidade = 600, seg = 150, material } = {}) {
  let geo = new THREE.PlaneGeometry(largura, profundidade, seg, seg);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, altura(pos.getX(i), pos.getZ(i)));
  geo = geo.toNonIndexed();
  geo.computeVertexNormals();
  const p = geo.attributes.position, n = geo.attributes.normal;
  const cores = new Float32Array(p.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < p.count; i += 3) {
    const y = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3;
    const x = (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3;
    const z = (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3;
    c.set(cor(y, n.getY(i), x, z));
    for (let k = 0; k < 3; k++) cores.set([c.r, c.g, c.b], (i + k) * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  const m = malha(geo, material || mat('#ffffff', { vertexColors: true }), { sombra: false });
  return m;
}

/** Superfície da água com ondinhas (chame .animar(t) a cada quadro). */
export function agua(largura, profundidade, material, [x, y, z] = [0, 0, 0]) {
  const geo = new THREE.PlaneGeometry(largura, profundidade, Math.round(largura / 2), Math.round(profundidade / 3));
  geo.rotateX(-Math.PI / 2);
  const base = Float32Array.from(geo.attributes.position.array);
  const m = malha(geo, material, { sombra: false });
  m.position.set(x, y, z);
  m.animar = (t) => {
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const bx = base[i * 3], bz = base[i * 3 + 2];
      p.setY(i, 0.13 * Math.sin(bx * 0.6 + t * 1.6) + 0.1 * Math.sin(bz * 0.35 + t * 2.3));
    }
    p.needsUpdate = true;
    geo.computeVertexNormals();
  };
  return m;
}

export function arvore(x, y, z, escala = 1, tipo = 0, cortavel = (m) => m) {
  const g = new THREE.Group();
  const tronco = cilindro(0.35, 2.4, cortavel(mat('#7A4E2D', { cortavel: true })), [0, 1.2, 0], 5);
  g.add(tronco);
  const verde = cortavel(mat(['#3E9A3A', '#4FB043', '#2F7F35'][tipo % 3], { cortavel: true }));
  if (tipo % 2 === 0) {
    g.add(em(malha(new THREE.ConeGeometry(1.9, 4.2, 6), verde), 0, 3.8, 0));
    g.add(em(malha(new THREE.ConeGeometry(1.4, 3, 6), verde), 0, 5.4, 0));
  } else {
    g.add(em(malha(new THREE.IcosahedronGeometry(2.1, 0), verde), 0, 3.6, 0));
  }
  g.position.set(x, y, z);
  g.scale.setScalar(escala);
  g.rotation.y = x * 1.7 + z;
  return g;
}

export function casa(x, y, z, rot = 0, corParede = '#F3EBDD', corTelhado = '#D9502F', cortavel = (m) => m) {
  const g = new THREE.Group();
  const parede = cortavel(mat(corParede, { cortavel: true }));
  g.add(caixa(6, 3.6, 5, parede, [0, 1.8, 0]));
  const forma = new THREE.Shape([new THREE.Vector2(-3.5, 0), new THREE.Vector2(3.5, 0), new THREE.Vector2(0, 2.4)]);
  const telhado = malha(new THREE.ExtrudeGeometry(forma, { depth: 5.8, bevelEnabled: false }), cortavel(mat(corTelhado, { cortavel: true })));
  telhado.position.set(0, 3.6, -2.9);
  g.add(telhado);
  g.add(caixa(1.1, 2, 0.15, cortavel(mat('#7A4E2D', { cortavel: true })), [0, 1, 2.55]));
  const vidro = cortavel(mat('#9ED8FF', { cortavel: true, brilho: true }));
  g.add(caixa(1.2, 1, 0.15, vidro, [-1.9, 2, 2.55]));
  g.add(caixa(1.2, 1, 0.15, vidro, [1.9, 2, 2.55]));
  g.position.set(x, y, z);
  g.rotation.y = rot;
  return g;
}

function rodas(g, xs, zMeia, r, y) {
  const pneu = mat('#1E1E22');
  const lista = [];
  for (const x of xs) {
    for (const s of [-1, 1]) {
      const w = malha(new THREE.CylinderGeometry(r, r, 0.45, 10), pneu);
      w.rotation.x = Math.PI / 2;
      w.position.set(x, y, s * zMeia);
      g.add(w);
      lista.push(w);
    }
  }
  return lista;
}

/** Caminhão: frente para +x. .rodar(dist) gira as rodas. */
export function caminhao(corCabine = '#E23B3B') {
  const g = new THREE.Group();
  const corpo = new THREE.Group();
  corpo.add(caixa(2.6, 2.5, 2.6, mat(corCabine), [3.6, 1.95, 0]));
  corpo.add(caixa(0.12, 1.0, 2.2, mat('#2A3B55', { brilho: true }), [4.92, 2.5, 0]));
  corpo.add(caixa(7.2, 3.0, 2.7, mat('#F4F4F6'), [-1.4, 2.25, 0]));
  corpo.add(caixa(7.2, 0.35, 2.7, mat(corCabine), [-1.4, 0.75, 0]));
  corpo.add(caixa(0.3, 0.3, 0.5, mat('#FFE9A0', { emissivo: '#665500' }), [4.92, 1.2, 0.9]));
  corpo.add(caixa(0.3, 0.3, 0.5, mat('#FFE9A0', { emissivo: '#665500' }), [4.92, 1.2, -0.9]));
  g.add(corpo);
  const rs = rodas(g, [3.6, -2.6, -4.0], 1.2, 0.6, 0.6);
  g.rodar = (dist) => rs.forEach((w) => (w.rotation.y = -dist / 0.6));
  g.corpo = corpo;
  return g;
}

/** Carro pequeno: frente para +x. */
export function carro(cor = '#2F6FE0') {
  const g = new THREE.Group();
  const corpo = new THREE.Group();
  corpo.add(caixa(4.2, 0.9, 1.9, mat(cor), [0, 0.85, 0]));
  corpo.add(caixa(2.3, 0.75, 1.75, mat(cor), [-0.3, 1.65, 0]));
  corpo.add(caixa(0.1, 0.6, 1.6, mat('#2A3B55', { brilho: true }), [0.86, 1.65, 0]));
  g.add(corpo);
  const rs = rodas(g, [1.3, -1.3], 0.85, 0.42, 0.42);
  g.rodar = (dist) => rs.forEach((w) => (w.rotation.y = -dist / 0.42));
  g.corpo = corpo;
  return g;
}

/** Partículas simples (respingos, poeira). .em(t) posiciona no instante t (s) após o início. */
export function respingos(n, cor, origem, { vel = 9, tam = 0.35, gravidade = 18, semente = 1 } = {}) {
  const g = new THREE.Group();
  let s = semente;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const ps = [];
  for (let i = 0; i < n; i++) {
    const m = caixa(tam, tam, tam, mat(cor));
    const a = r() * Math.PI * 2;
    ps.push({ m, vx: Math.cos(a) * vel * (0.3 + r() * 0.7), vz: Math.sin(a) * vel * (0.3 + r() * 0.7), vy: vel * (0.8 + r() * 0.8) });
    g.add(m);
  }
  g.em = (t) => {
    g.visible = t > 0 && t < 2.2;
    for (const p of ps) {
      p.m.position.set(origem[0] + p.vx * t * 0.4, origem[1] + p.vy * t - 0.5 * gravidade * t * t, origem[2] + p.vz * t * 0.4);
      p.m.visible = p.m.position.y > origem[1] - 1;
      p.m.rotation.set(t * 5, t * 3, 0);
    }
  };
  g.visible = false;
  return g;
}

/**
 * Cano que passa pelos pontos dados. .crescer(k) mostra só a fração k (0..1) do comprimento.
 * .pontoEm(u) devolve a posição na fração u do comprimento.
 */
export function cano(pontos, raio, material) {
  const g = new THREE.Group();
  const ps = pontos.map((p) => new THREE.Vector3(...p));
  const segs = [];
  let total = 0;
  for (let i = 0; i < ps.length - 1; i++) {
    const a = ps[i], b = ps[i + 1];
    const dir = b.clone().sub(a);
    const len = dir.length();
    dir.normalize();
    const m = malha(new THREE.CylinderGeometry(raio, raio, 1, 10), material);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    const junta = malha(new THREE.SphereGeometry(raio * 1.08, 10, 6), material);
    junta.position.copy(a);
    g.add(m, junta);
    segs.push({ a, dir, len, ini: total, m, junta });
    total += len;
  }
  g.comprimento = total;
  g.pontoEm = (u) => {
    const d = Math.min(Math.max(u, 0), 1) * total;
    const s = segs.find((x) => d <= x.ini + x.len) || segs[segs.length - 1];
    return s.a.clone().addScaledVector(s.dir, d - s.ini);
  };
  g.crescer = (k) => {
    const d = k * total;
    g.visible = k > 0.001;
    for (const s of segs) {
      const f = Math.min(Math.max((d - s.ini) / s.len, 0), 1);
      s.m.visible = f > 0;
      s.junta.visible = d >= s.ini;
      s.m.scale.y = Math.max(f * s.len, 0.001);
      s.m.position.copy(s.a).addScaledVector(s.dir, (f * s.len) / 2);
    }
  };
  g.crescer(1);
  return g;
}

/** Bolinhas correndo dentro de um cano (mostra o sentido da água). .em(t, k) — k = fração já construída. */
export function fluxo(canoObj, n, cor, vel = 6) {
  const g = new THREE.Group();
  const bolas = [];
  for (let i = 0; i < n; i++) {
    const m = caixa(0.32, 0.32, 0.32, mat(cor, { emissivo: cor, unico: true }), [0, 0, 0], { sombra: false });
    g.add(m);
    bolas.push(m);
  }
  g.material = (c) => bolas.forEach((b) => { b.material.color.set(c); b.material.emissive.set(c); });
  g.em = (t, k = 1) => {
    bolas.forEach((b, i) => {
      const u = ((i / n + (t * vel) / canoObj.comprimento) % 1 + 1) % 1;
      b.visible = u <= k;
      b.position.copy(canoObj.pontoEm(u));
      b.position.y += canoObj.raioFluxo || 0;
    });
  };
  return g;
}

/**
 * Tanque de concreto aberto em cima, centrado em z = 0 (para a vista em corte).
 * As paredes somem na frente (cortáveis); a água fica só na metade de trás, então
 * no corte aparece o "aquário" por dentro. .nivel(h), .corAgua(c).
 */
export function tanque(x, y, larg, alt, prof, cortavel) {
  const g = new THREE.Group();
  g.position.set(x, y, 0);
  const parede = cortavel(mat('#C9CCD2', { cortavel: true, duplo: true }));
  const e = 0.4;
  g.add(caixa(larg, e, prof, parede, [0, e / 2, 0]));
  g.add(caixa(e, alt, prof, parede, [-larg / 2 + e / 2, alt / 2, 0]));
  g.add(caixa(e, alt, prof, parede, [larg / 2 - e / 2, alt / 2, 0]));
  g.add(caixa(larg, alt, e, parede, [0, alt / 2, -prof / 2 + e / 2]));
  g.add(caixa(larg, alt, e, parede, [0, alt / 2, prof / 2 - e / 2]));
  const matAgua = mat('#5FB2E8', { unico: true, brilho: true, opacidade: 0.55 });
  const agua = caixa(larg - 2 * e, 1, prof / 2 - e, matAgua, [0, 0, -(prof / 2 - e) / 2], { sombra: false });
  const topo = malha(new THREE.PlaneGeometry(larg - 2 * e, prof - 2 * e), cortavel(mat('#5FB2E8', { unico: true, brilho: true, cortavel: true, opacidade: 0.95 })), { sombra: false });
  topo.rotation.x = -Math.PI / 2;
  g.add(agua, topo);
  g.nivel = (h) => {
    agua.visible = topo.visible = h > 0.02;
    agua.scale.y = Math.max(h - e, 0.01);
    agua.position.y = e + (h - e) / 2;
    topo.position.y = h;
  };
  g.corAgua = (c) => { matAgua.color.set(c); topo.material.color.set(c); };
  g.nivel(alt - 0.6);
  g.interno = { larg: larg - 2 * e, prof: prof - 2 * e, e };
  return g;
}
