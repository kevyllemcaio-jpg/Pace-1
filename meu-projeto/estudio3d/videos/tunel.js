// VÍDEO: "Como um túnel passa debaixo de um rio sem inundar?"
//
// Números conferidos:
//  - Cada 10 m de água somam ~1 atmosfera → a 20 m de fundo, a água empurra com ~2x a pressão do ar.
//  - "Tatuzão" (TBM, tuneladora) cava e monta anéis de concreto pré-moldado logo atrás (ex.: metrô de SP).
//  - Emendas dos anéis têm juntas de borracha; injeta-se argamassa no vão entre o anel e o solo.
//  - Túneis de carro usam ventiladores a jato no teto para tirar fumaça e gases.

import * as THREE from 'three';
import { suave, saida, mistura, lim, cartao, etiqueta, ok, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, cilindro, malha, terreno, agua, ruido, arvore, casa, caminhao, carro } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';

export const config = {
  titulo: ['COMO UM *TÚNEL* PASSA', 'DEBAIXO DE UM *RIO*', 'SEM INUNDAR?'],
};

// ---------- medidas (1 unidade = 1 metro) ----------
const FUNDO = -6, MARGEM = 7.35, ROCHA = -46, BASE = -70;
const R = 4.5;                 // raio do túnel
const YT = -20;                // centro do túnel debaixo do rio
const XH = 25;                 // trecho reto: |x| < 25
const XP = 95;                 // bocas do túnel
const SUB = (MARGEM + 2.45 - YT) / (XP - XH);
const ANG = Math.atan(SUB);
const yc = (x) => (Math.abs(x) <= XH ? YT : YT + (Math.abs(x) - XH) * SUB);
const ang = (x) => (Math.abs(x) <= XH ? 0 : Math.sign(x) * ANG);
const XFURO = 78;              // até onde o furo aparece na vista em corte

function perfil(x) {
  const a = Math.abs(x);
  if (a < 16) return FUNDO;
  if (a < 24) return mistura(FUNDO, MARGEM, suave((a - 16) / 8));
  return MARGEM;
}
function altura(x, z) {
  const a = Math.abs(x), az = Math.abs(z);
  let h = perfil(x);
  h += Math.max(0, a - 115) * 0.5 + lim((a - 115) / 40) * ruido(x * 0.6, z * 0.6) * 10;
  if (a > 27) h += ruido(x, z) * 0.9 * lim((az - 15) / 10);
  // morro por cima da rampa do túnel, cortado na boca
  if (a > 38 && a < XP + 0.5) {
    const morro = yc(x) + R + 1.2;
    const k = suave(1 - (az - 9) / 7) * suave((a - 38) / 10);
    h = Math.max(h, mistura(h, morro, k));
  }
  return h;
}
function corTerreno(y, incl, x, z) {
  if (y < -1) return '#B79C64';
  if (y < 1.3) return '#D9C68E';
  if (incl < 0.72) return '#8E8F8A';
  const r = ruido(x * 3.1, z * 2.7);
  return r > 0.35 ? '#5DB13F' : r < -0.35 ? '#78C850' : '#6CBF47';
}

// faixa (polígono) ao longo do eixo do túnel, entre os deslocamentos d1 e d2 (perpendiculares ao eixo)
function faixa(x1, x2, d1, d2, passo = 1) {
  const cima = [], baixo = [];
  for (let x = x1; x <= x2 + 1e-6; x += passo) {
    const c = Math.cos(ang(x));
    cima.push([x, yc(x) + d2 / c]);
    baixo.push([x, yc(x) + d1 / c]);
  }
  if (x2 - (x1 + Math.floor((x2 - x1) / passo) * passo) > 1e-3) {
    const c = Math.cos(ang(x2));
    cima.push([x2, yc(x2) + d2 / c]);
    baixo.push([x2, yc(x2) + d1 / c]);
  }
  return [...baixo, ...cima.reverse()];
}
const forma = (pts) => new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));

export function criar(ctx) {
  const { cena, cortavel } = ctx;
  const C = (cor, extra = {}) => cortavel(mat(cor, { cortavel: true, ...extra }));

  // ---------- cenário ----------
  cena.add(terreno(altura, corTerreno, { material: C('#ffffff', { vertexColors: true }) }));
  const superficie = agua(46, 600, C('#2C86E0', { opacidade: 0.9, brilho: true, unico: true }));
  cena.add(superficie);
  const solCeu = new THREE.Mesh(new THREE.IcosahedronGeometry(14, 1), mat('#FFE27A', { emissivo: '#FFB800', semNeblina: true }));
  solCeu.position.set(80, 140, -260);
  cena.add(solCeu);

  const asfalto = mat('#3A3D44');
  for (const s of [-1, 1]) {
    cena.add(caixa(60, 0.08, 8, asfalto, [s * (XP + 30), MARGEM + 0.04, 0]));
    for (let x = XP + 3; x < XP + 60; x += 5) cena.add(caixa(2.2, 0.02, 0.2, mat('#F4F4F4'), [s * x, MARGEM + 0.09, 0]));
    // boca do túnel
    const concretoBoca = C('#C9CCD2');
    const g = new THREE.Group();
    g.add(caixa(1.6, 10, 3, concretoBoca, [0, 5, 6.2]));
    g.add(caixa(1.6, 10, 3, concretoBoca, [0, 5, -6.2]));
    g.add(caixa(1.6, 3.2, 15.4, concretoBoca, [0, 10.4, 0]));
    g.add(caixa(1.7, 1, 15.6, C('#F2A623'), [0, 9.2, 0]));
    g.position.set(s * (XP + 0.2), MARGEM - 0.4, 0);
    cena.add(g);
  }

  const casas = [[110, 16, Math.PI], [122, 18, Math.PI], [134, 15, Math.PI], [40, 24, Math.PI], [52, 26, Math.PI], [64, 25, Math.PI], [42, -24, 0], [56, -25, 0], [70, -26, 0], [112, -17, 0], [126, -16, 0]];
  const paredes = ['#F3EBDD', '#FBE3B5', '#DCEBF7', '#F6D6CF'];
  casas.forEach(([x, z, r], i) => cena.add(casa(x, altura(x, z), z, r, paredes[i % 4], i % 3 ? '#D9502F' : '#B8432B', cortavel)));
  cena.add(casa(-40, MARGEM, 22, Math.PI, '#FBE3B5', '#D9502F', cortavel));
  const arvores = [[-50, 26], [-58, 16], [-46, -20], [-34, -22], [-62, -24], [-28, -40], [-70, 32], [34, 30], [86, 28], [44, -32], [92, -24], [30, -34], [-40, 42], [70, 42], [-100, -16], [104, 26], [-60, 8], [60, -10]];
  arvores.forEach(([x, z], i) => cena.add(arvore(x, altura(x, z) - 0.2, z, 0.9 + (i % 3) * 0.2, i, cortavel)));

  // ---------- vista em corte ----------
  const extrudar = (shape, cor) => {
    const m = malha(new THREE.ExtrudeGeometry(shape, { depth: 300, bevelEnabled: false }), mat(cor, { unico: true }), { sombra: false });
    m.position.z = -300;
    m.visible = false;
    cena.add(m);
    return m;
  };
  const ptsTerra = [];
  for (let x = -150; x <= 150; x += 0.5) ptsTerra.push([x, Math.min(altura(x, 0), 40) - 0.06]);
  ptsTerra.push([150, ROCHA], [-150, ROCHA]);
  const formaTerra = forma(ptsTerra);
  formaTerra.holes.push(new THREE.Path(faixa(-XFURO, XFURO, -(R + 0.3), R + 0.3).map(([x, y]) => new THREE.Vector2(x, y))));
  const ptsAgua = [[-20, 0], [20, 0]];
  for (let x = 20; x >= -20; x -= 0.5) ptsAgua.push([x, Math.min(0, perfil(x))]);
  const volumes = [
    extrudar(formaTerra, '#C9A66B'),
    extrudar(forma([[-150, ROCHA], [150, ROCHA], [150, BASE], [-150, BASE]]), '#7C7F87'),
    extrudar(forma(ptsAgua), '#2A78D4'),
  ];
  const detalhes = new THREE.Group();
  for (let i = 0; i < 140; i++) {
    const x = -75 + ((i * 37) % 150), y = ROCHA + 1 + ((i * 13) % 38);
    const fora = Math.abs(y - yc(x)) > R + 1;
    if (y < altura(x, 0) - 1 && fora) detalhes.add(caixa(0.4, 0.4, 0.05, mat('#A9874F'), [x, y, 0.03], { sombra: false }));
  }
  detalhes.visible = false;
  cena.add(detalhes);

  // fundo escuro do buraco ainda sem anéis + "tampa" de terra onde ainda não foi cavado
  const fundoBuraco = malha(new THREE.ShapeGeometry(forma(faixa(-XFURO, XFURO, -(R + 0.3), R + 0.3))), mat('#5A4127', { unico: true }), { sombra: false });
  fundoBuraco.position.z = -R - 0.2;
  fundoBuraco.visible = false;
  cena.add(fundoBuraco);
  const tampaMat = mat('#C9A66B', { unico: true });
  const tampa = new THREE.Mesh(new THREE.BufferGeometry(), tampaMat);
  tampa.position.z = 0.03;
  cena.add(tampa);
  function cavado(xIni, xFim) {
    const pedacos = [];
    if (xIni > -XFURO) pedacos.push(forma(faixa(-XFURO, xIni, -(R + 0.31), R + 0.31)));
    if (xFim < XFURO) pedacos.push(forma(faixa(Math.max(xFim, -XFURO), XFURO, -(R + 0.31), R + 0.31)));
    tampa.geometry.dispose();
    tampa.geometry = pedacos.length ? new THREE.ShapeGeometry(pedacos) : new THREE.BufferGeometry();
  }
  // argamassa injetada em volta do tubo (na face do corte)
  const argamassa = new THREE.Mesh(new THREE.BufferGeometry(), mat('#6E7681', { unico: true }));
  argamassa.position.z = 0.04;
  cena.add(argamassa);
  function definirArgamassa(xFim) {
    argamassa.geometry.dispose();
    if (xFim <= -XFURO + 0.5) { argamassa.geometry = new THREE.BufferGeometry(); return; }
    const x2 = Math.min(xFim, XFURO);
    argamassa.geometry = new THREE.ShapeGeometry([forma(faixa(-XFURO, x2, R + 0.3, R + 1.8)), forma(faixa(-XFURO, x2, -(R + 1.8), -(R + 0.3)))]);
  }

  // ---------- o túnel (anéis) ----------
  const concreto = C('#C3C6CC', { duplo: true });
  const borracha = C('#141414', { duplo: true });
  const geoAnel = new THREE.CylinderGeometry(R, R, 1.42, 22, 1, true);
  const geoJunta = new THREE.CylinderGeometry(R - 0.02, R - 0.02, 0.14, 22, 1, true);
  const aneis = [];
  const passoX = (x) => 1.5 * Math.cos(ang(x));
  for (let x = -XP + 0.7; x < XP; x += passoX(x)) {
    const a = ang(x);
    const anel = malha(geoAnel, concreto);
    anel.position.set(x, yc(x), 0);
    anel.rotation.z = -Math.PI / 2 + a;
    const junta = malha(geoJunta, borracha, { sombra: false });
    junta.position.set(x + 0.75 * Math.cos(a), yc(x) + 0.75 * Math.sin(a), 0);
    junta.rotation.z = -Math.PI / 2 + a;
    cena.add(anel, junta);
    aneis.push({ x, anel, junta });
  }
  // pista e luzes dentro do túnel
  const dentro = new THREE.Group();
  const trechos = [[-XP, -XH], [-XH, XH], [XH, XP]];
  for (const [x1, x2] of trechos) {
    const a = ang((x1 + x2) / 2), xm = (x1 + x2) / 2, len = (x2 - x1) / Math.cos(a);
    const g = new THREE.Group();
    g.position.set(xm, yc(xm), 0);
    g.rotation.z = a;
    g.add(caixa(len, 0.3, 7.4, C('#3A3D44'), [0, -2.55, 0]));
    for (let d = -len / 2 + 2; d < len / 2 - 1; d += 5) g.add(caixa(2.2, 0.02, 0.18, C('#F4F4F4'), [d, -2.39, 0]));
    for (let d = -len / 2 + 3; d < len / 2; d += 6) g.add(caixa(1.4, 0.12, 0.35, C('#FFF4C2', { emissivo: '#FFE08A' }), [d, R - 0.25, 0]));
    dentro.add(g);
  }
  cena.add(dentro);
  for (const x of [-12, 4, 20]) {
    const luz = new THREE.PointLight('#FFF1CC', 90, 28, 1.6);
    luz.position.set(x, YT + 2.5, 0);
    cena.add(luz);
  }

  // ---------- tatuzão (TBM) ----------
  const tbm = new THREE.Group();
  const casco = malha(new THREE.CylinderGeometry(R + 0.12, R + 0.12, 10, 22), mat('#F2A623'));
  casco.rotation.z = -Math.PI / 2;
  tbm.add(casco);
  const cabeca = new THREE.Group();
  cabeca.position.x = 5.35;
  const disco = malha(new THREE.CylinderGeometry(R + 0.05, R + 0.05, 0.7, 22), mat('#5B6270'));
  disco.rotation.z = -Math.PI / 2;
  cabeca.add(disco);
  for (let i = 0; i < 8; i++) {
    const braco = caixa(0.4, 0.5, 2 * R - 0.4, mat('#D9DDE3', { metal: true }), [0.45, 0, 0]);
    braco.rotation.x = (i / 8) * Math.PI;
    cabeca.add(braco);
  }
  tbm.add(cabeca);
  tbm.add(caixa(9, 2.4, 3, mat('#3B6FD8'), [-10, -1.6, 0]));
  tbm.add(caixa(6, 2.0, 2.6, mat('#3B6FD8'), [-17, -1.8, 0]));
  cena.add(tbm);
  function posicionarTbm(frente, t) {
    const a = ang(frente);
    const xm = frente - 5 * Math.cos(a);
    tbm.position.set(xm, yc(xm), 0);
    tbm.rotation.z = ang(xm);
    cabeca.rotation.x = t * 2.2;
  }

  // ---------- vazamento ----------
  const jatos = [-14, -5, 4, 13].map((x) => {
    const j = caixa(0.55, 1, 0.55, mat('#7FD6FF', { emissivo: '#1E6FA8', unico: true }), [x, 0, -0.8], { sombra: false });
    cena.add(j);
    return j;
  });
  const poca = caixa(50, 1, 7, mat('#2F8BE8', { emissivo: '#0B3D7A', unico: true }), [0, 0, -0.5], { sombra: false });
  cena.add(poca);

  // ---------- areia caindo (desabamento) ----------
  const areiaCai = new THREE.Group();
  const pedras = [];
  for (let i = 0; i < 26; i++) {
    const m = caixa(0.6 + (i % 3) * 0.3, 0.5 + (i % 2) * 0.3, 0.6, mat('#B8935A'));
    areiaCai.add(m);
    pedras.push({ m, x: -22 + ((i * 7.3) % 17), z: -3 + ((i * 1.7) % 3), atraso: (i % 9) * 0.12 });
  }
  cena.add(areiaCai);

  // ---------- fumaça e ventiladores ----------
  const fumacaMat = mat('#6B6B6B', { opacidade: 0.42, unico: true });
  const fumaca = [];
  for (let i = 0; i < 46; i++) {
    const m = malha(new THREE.IcosahedronGeometry(1, 0), fumacaMat, { sombra: false });
    fumaca.push({ m, x: -10 + ((i * 11.7) % 40), y: YT - 1.5 + ((i * 0.77) % 4.2), z: -2.6 + ((i * 1.3) % 5.2), nasce: (i % 15) * 0.22, tam: 0.6 + (i % 4) * 0.25 });
    cena.add(m);
  }
  const ventiladores = [];
  for (const x of [-8, 6, 20]) {
    for (const z of [-1.5, 1.5]) {
      const g = new THREE.Group();
      g.position.set(x, YT + R - 1.15, z);
      const corpo = malha(new THREE.CylinderGeometry(0.6, 0.6, 3, 12), mat('#9AA3AE', { metal: true }));
      corpo.rotation.z = -Math.PI / 2;
      g.add(corpo);
      g.add(caixa(0.1, 0.5, 0.15, mat('#555B66'), [0, 0.65, 0]));
      const helice = new THREE.Group();
      helice.position.x = 1.55;
      helice.add(caixa(0.06, 1.05, 0.18, mat('#2A2D33'), [0, 0, 0]));
      helice.add(caixa(0.06, 0.18, 1.05, mat('#2A2D33'), [0, 0, 0]));
      g.add(helice);
      g.helice = helice;
      cena.add(g);
      ventiladores.push(g);
    }
  }
  const carros = [['#2F6FE0', 1.6, 1], ['#E23B3B', -1.6, -1], ['#F2C14E', 1.6, 1]].map(([cor, z, dir]) => {
    const c = carro(cor);
    c.z = z;
    c.dir = dir;
    cena.add(c);
    return c;
  });

  // ---------- personagem e caminhão ----------
  const voce = criarPersonagem();
  voce.scale.setScalar(0.92);
  cena.add(voce);
  const cam = caminhao();
  cena.add(cam);

  function inicial() {
    aneis.forEach(({ anel, junta }) => { anel.visible = false; junta.visible = false; });
    dentro.visible = false;
    tbm.visible = false;
    cavado(-XFURO, -XFURO);
    definirArgamassa(-XFURO);
    jatos.forEach((j) => (j.visible = false));
    poca.visible = false;
    areiaCai.visible = false;
    fumaca.forEach((f) => (f.m.visible = false));
    ventiladores.forEach((v) => (v.visible = false));
    carros.forEach((c) => (c.visible = false));
    cam.visible = false;
    voce.visible = true;
    voce.position.set(-32, MARGEM, 6.4);
    voce.rotation.y = Math.PI / 2;
    voce.scale.setScalar(0.92);
    voce.estado = { bracos: 'normal', expr: 'feliz', andar: 0, pulo: 0 };
  }
  const mostrarAneisAte = (x, juntas = false) =>
    aneis.forEach((a) => { a.anel.visible = a.x < x; a.junta.visible = juntas && a.x < x; });

  // posição do caminhão saindo pela boca da direita
  function caminhaoEm(x) {
    const naRampa = x < XP;
    const y = naRampa ? yc(x) - 2.4 : MARGEM + 0.03;
    cam.position.set(x, y, 1.75);
    cam.rotation.z = naRampa ? ang(x) : 0;
    cam.rodar(x);
  }

  const blocos = [
    {
      fala: 'Como um túnel passa debaixo de um rio sem inundar? Imagina: você precisa ir pra cidade do outro lado, e não tem ponte.',
      destaque: ['túnel', 'rio', 'cidade'],
      camera: { pos: [-37.5, 9.2, 9.8], alvo: [-12, 6.5, -2] },
      cameraFim: { pos: [-28, 30, 66], alvo: [6, 1, -4] },
    },
    {
      fala: 'Então você cava um buraco por baixo do rio.',
      destaque: ['buraco'],
      corte: true,
      camera: { pos: [-14, -9, 44], alvo: [-14, -13, 0] },
      aplicar(lt, b) {
        const k = saida((lt - b.palavra('cava')) / 2.2);
        cavado(-40, mistura(-40, -4, k));
        voce.position.set(mistura(-30, -9, k), YT - R + 0.05, -1.2);
        voce.rotation.y = 0;
        voce.scale.setScalar(2.1);
        voce.estado = { bracos: 'aponta', expr: 'feliz', andar: k < 1 ? 1 : 0 };
      },
    },
    {
      fala: 'Mas a terra lá embaixo é mole... e desaba em cima de você!',
      destaque: ['mole', 'desaba'],
      corte: true,
      camera: { pos: [-15, -10, 40], alvo: [-15, -14, 0] },
      aplicar(lt, b) {
        const td = b.palavra('desaba');
        const k = suave((lt - td) / 1.2);
        cavado(-40, mistura(-4, -24, k));
        areiaCai.visible = lt > td - 0.3;
        pedras.forEach((p) => {
          const tt = Math.max(0, lt - td + 0.3 - p.atraso);
          p.m.position.set(p.x, YT + R - 0.5 - Math.min(2 * R - 1, 14 * tt * tt), p.z);
          p.m.rotation.set(tt * 3, tt * 2, 0);
        });
        const corre = Math.max(0, lt - td);
        voce.position.set(-9 - corre * 7, YT - R + 0.05, -1.2);
        voce.rotation.y = lt > td ? -Math.PI / 2 : 0;
        voce.estado = { bracos: lt > td - 0.6 ? 'cabeca' : 'normal', expr: lt > td - 0.6 ? 'surpreso' : 'preocupado', andar: lt > td ? 1 : 0 };
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('desaba'), 'DESABANDO'),
      sons: [{ em: 'desaba', tipo: 'quebra' }],
    },
    {
      fala: 'Então você usa o tatuzão: uma máquina gigante que cava na frente e já monta anéis de concreto atrás.',
      destaque: ['tatuzão', 'anéis'],
      corte: true,
      camera: (lt, b) => {
        const f = Math.max(-60, Math.min(-2, mistura(-XFURO, -2, suave(lt / b.dur))));
        return { pos: [f - 4, yc(f) + 9, 46], alvo: [f - 2, yc(f) + 3, 0] };
      },
      transicao: 1.6,
      aplicar(lt, b) {
        areiaCai.visible = false;
        voce.visible = false;
        const f = mistura(-XFURO, -2, suave(lt / b.dur));
        tbm.visible = true;
        posicionarTbm(f, lt);
        cavado(-XFURO, f);
        mostrarAneisAte(f - 10);
      },
      camada: (lt, b) => cartao(lt, b.palavra('gigante'), '9 m', 'DE DIÂMETRO'),
    },
    {
      fala: 'Esse é o túnel: um tubo de anéis, um encaixado no outro, de uma margem até a outra.',
      destaque: ['túnel', 'anéis'],
      corte: true,
      camera: { pos: [0, -8, 120], alvo: [0, -12, 0] },
      transicao: 1.8,
      aplicar(lt, b) {
        const f = mistura(-2, XFURO + 12, suave(lt / (b.dur * 0.85)));
        tbm.visible = f < XFURO + 11;
        posicionarTbm(Math.min(f, XFURO + 10), lt + 10);
        cavado(-XFURO, f);
        mostrarAneisAte(f - 10);
        if (f > XFURO + 11) mostrarAneisAte(XP + 1);
      },
    },
    {
      fala: 'Mas a vinte metros de fundo, a água empurra com o dobro da força do ar, e entra pelas emendas.',
      destaque: ['vinte', 'dobro', 'emendas'],
      corte: true,
      camera: { pos: [0, -12, 34], alvo: [0, -16, 0] },
      aplicar(lt, b) {
        tbm.visible = false;
        cavado(-XFURO, XFURO + 1);
        mostrarAneisAte(XP + 1);
        const te = b.palavra('emendas');
        jatos.forEach((j, i) => {
          const k = lim((lt - te + 0.4 - i * 0.15) / 0.3);
          j.visible = k > 0;
          const comp = (2 * R - 2.6) * k * (0.9 + 0.1 * Math.sin(lt * 30 + i));
          j.scale.y = Math.max(0.01, comp);
          j.position.y = YT + R - 0.2 - comp / 2;
        });
        const ag = suave((lt - te) / 3) * 1.4;
        poca.visible = ag > 0.02;
        poca.scale.y = Math.max(0.01, ag);
        poca.position.y = YT - 2.4 + ag / 2;
      },
      camada: (lt, b) => cartao(lt, b.palavra('dobro'), '2x', 'A PRESSÃO DO AR, A 20 m DE FUNDO') + etiqueta(lt, b.palavra('emendas'), 'VAZANDO'),
      sons: [{ em: 'emendas', tipo: 'splash' }],
    },
    {
      fala: 'Então você põe borracha em todas as emendas, e injeta cimento em volta do tubo.',
      destaque: ['borracha', 'cimento'],
      corte: true,
      camera: { pos: [0, -13, 52], alvo: [0, -17, 0] },
      aplicar(lt, b) {
        const tb = b.palavra('borracha'), tc = b.palavra('cimento');
        mostrarAneisAte(XP + 1, lt > tb);
        const seca = suave((lt - tb) / 0.8);
        jatos.forEach((j) => (j.visible = seca < 1 && j.visible));
        jatos.forEach((j) => (j.scale.y = Math.max(0.01, j.scale.y * (1 - seca))));
        const ag = (1 - suave((lt - tb) / 2)) * 1.4;
        poca.visible = ag > 0.02;
        poca.scale.y = Math.max(0.01, ag);
        poca.position.y = YT - 2.4 + ag / 2;
        definirArgamassa(mistura(-XFURO, XFURO, suave((lt - tc) / 2.2)));
      },
    },
    {
      fala: 'Essas são as juntas de vedação. Agora a água fica do lado de fora.',
      destaque: ['juntas', 'vedação', 'fora'],
      corte: true,
      camera: { pos: [-4, -12, 46], alvo: [-4, -17, 0] },
      aplicar() {
        jatos.forEach((j) => (j.visible = false));
        poca.visible = false;
        definirArgamassa(XFURO);
      },
      camada: (lt, b) => ok(lt, b.palavra('fora')),
      sons: [{ em: 'fora', tipo: 'ok' }],
    },
    {
      fala: 'Mas os carros soltam fumaça, e lá dentro não tem vento pra levar embora.',
      destaque: ['fumaça', 'vento'],
      camera: { pos: [-20, YT + 0.4, 2.2], alvo: [10, YT - 0.6, -0.4] },
      transicao: 1.2,
      aplicar(lt, b) {
        dentro.visible = true;
        const tf = b.palavra('carros') - 0.3;
        carros.forEach((c, i) => {
          c.visible = true;
          const x = c.dir > 0 ? -22 + 7 * (lt - tf) - i * 9 : 26 - 7 * (lt - tf);
          c.position.set(x, YT - 2.4, c.z);
          c.rotation.y = c.dir > 0 ? 0 : Math.PI;
          c.rodar(x);
        });
        fumaca.forEach((f) => {
          const k = suave((lt - tf - f.nasce) / 0.8);
          f.m.visible = k > 0.01;
          f.m.position.set(f.x + Math.sin(lt + f.x) * 0.3, f.y + k * 0.6, f.z);
          f.m.scale.setScalar(Math.max(0.01, f.tam * k));
        });
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('fumaça'), 'AR SUJO'),
    },
    {
      fala: 'Então você pendura ventiladores gigantes no teto, que empurram o ar sujo pra fora.',
      destaque: ['ventiladores', 'fora'],
      camera: { pos: [-20, YT + 0.4, 2.2], alvo: [10, YT + 0.6, -0.4] },
      aplicar(lt, b) {
        const tv = b.palavra('ventiladores'), te = b.palavra('empurram');
        ventiladores.forEach((v, i) => {
          v.visible = lt > tv + i * 0.08;
          v.scale.setScalar(Math.max(0.01, saida((lt - tv - i * 0.08) / 0.4)));
          v.helice.rotation.x = lt > te ? (lt - te) * 25 : 0;
        });
        carros.forEach((c) => (c.visible = false));
        fumaca.forEach((f) => {
          const ar = Math.max(0, lt - te);
          f.m.position.x = f.x + ar * ar * 6;
          const k = 1 - suave(ar / 2.5);
          f.m.visible = k > 0.02;
          f.m.scale.setScalar(Math.max(0.01, f.tam * k));
        });
      },
    },
    {
      fala: 'É por isso que todo túnel tem aqueles ventiladores enormes lá em cima.',
      destaque: ['ventiladores'],
      camera: { pos: [-14, YT + 0.8, 1.2], alvo: [6, YT + 2.6, 0] },
      cameraFim: { pos: [2, YT + 0.6, 0.8], alvo: [22, YT + 1.6, 0] },
      transicao: 1.0,
      aplicar(lt) {
        fumaca.forEach((f) => (f.m.visible = false));
        ventiladores.forEach((v) => { v.visible = true; v.scale.setScalar(1); v.helice.rotation.x = lt * 25; });
      },
    },
    {
      fala: 'Agora pode passar. Parabéns: você construiu um túnel!',
      destaque: ['parabéns', 'túnel'],
      camera: { pos: [128, 20, 44], alvo: [96, 8, 0] },
      cameraFim: { pos: [118, 34, 76], alvo: [80, 4, 0] },
      transicao: 0.9,
      aplicar(lt, b) {
        dentro.visible = false;
        cam.visible = true;
        caminhaoEm(mistura(70, 135, suave(lt / b.dur)));
      },
    },
    {
      fala: FALA_FINAL,
      semLegenda: true,
      camera: { pos: [-32, 8.95, 10.6], alvo: [-32, 8.55, 6.4] },
      transicao: 1.8,
      aplicar(lt) {
        cam.visible = false;
        voce.visible = true;
        voce.position.set(-32, MARGEM, 6.4);
        voce.scale.setScalar(0.92);
        voce.rotation.y = 0;
        voce.estado = { bracos: lt > 2.2 ? 'aponta' : lt < 1.2 ? 'cima' : 'aceno', expr: 'feliz', pulo: lt < 1.2 ? 1 : 0 };
      },
      camada: (lt) => textoFinal(lt),
    },
  ];

  return {
    blocos,
    inicial,
    sempre(t, corte) {
      superficie.animar(t);
      volumes.forEach((v) => (v.visible = corte));
      detalhes.visible = corte;
      fundoBuraco.visible = corte;
      tampa.visible = corte;
      argamassa.visible = corte;
      voce.animar(t);
    },
  };
}
