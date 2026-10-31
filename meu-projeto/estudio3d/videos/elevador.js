// VÍDEO: "Como um elevador sobe e desce sem cair?"
//
// Fatos conferidos:
//  - Elevador de tração: cabine e contrapeso pendurados no mesmo cabo, passando por uma polia
//    no alto (casa de máquinas). O contrapeso costuma pesar a cabine + 40–50% da carga máxima,
//    então o motor só vence a diferença.
//  - Elevadores usam vários cabos de aço (normalmente 4 a 8), com grande margem de segurança.
//  - Freio de segurança: se a cabine passa da velocidade, garras travam nos trilhos-guia.
//    Elisha Otis demonstrou o freio em 1854, em Nova York, mandando cortar o cabo da plataforma.

import * as THREE from 'three';
import { suave, saida, mistura, lim, cartao, etiqueta, ok, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, cilindro, malha, terreno, arvore, respingos } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';

export const config = {
  titulo: ['COMO UM *ELEVADOR*', 'SOBE E DESCE', 'SEM *CAIR*?'],
};

// ---------- medidas (m) ----------
const ANDARES = 10, PE = 3;            // 10 andares de 3 m
const TOPO = ANDARES * PE;             // 30 m
const S = 31.6;                        // centro da polia
const XC = -0.9, XP = 1.3, XPOLIA = 0.2, RPOLIA = 1.1;
const LCABO = 32;
const ycp = (yc) => 2 * S - 5.2 - LCABO - yc; // altura do contrapeso para a cabine em yc

export function criar(ctx) {
  const { cena, cortavel } = ctx;
  const C = (cor, extra = {}) => cortavel(mat(cor, { cortavel: true, ...extra }));

  // ---------- chão, rua e vizinhança ----------
  cena.add(terreno((x, z) => 0, (y, i, x, z) => ((Math.floor(x / 6) + Math.floor(z / 6)) % 2 ? '#6CBF47' : '#64B641'),
    { largura: 400, profundidade: 400, seg: 40, material: mat('#ffffff', { vertexColors: true }) }));
  cena.add(caixa(400, 0.06, 9, mat('#3A3D44'), [0, 0.03, 13]));
  for (let x = -190; x < 190; x += 6) cena.add(caixa(2.4, 0.02, 0.2, mat('#F4F4F4'), [x, 0.07, 13]));
  cena.add(caixa(400, 0.18, 2.5, C('#C9CCD2'), [0, 0.09, 7.6]));
  const vizinhos = [[-24, 0, 22, '#DCEBF7'], [24, 0, 16, '#F6D6CF'], [-44, -6, 30, '#FBE3B5'], [44, -4, 26, '#E3F2D9'], [-14, -34, 40, '#E9E2D0'], [18, -36, 34, '#DCEBF7']];
  vizinhos.forEach(([x, z, h, cor]) => {
    const g = new THREE.Group();
    g.add(caixa(14, h, 12, C(cor), [0, h / 2, 0]));
    for (let y = 2; y < h - 1; y += 3) for (let k = -2; k <= 2; k++) g.add(caixa(1.4, 1.5, 0.15, C('#8FC8F0', { brilho: true }), [k * 2.6, y, 6.05]));
    g.position.set(x, 0, z);
    cena.add(g);
  });
  [[-12, 18], [12, 19], [-30, 19], [30, 18], [-50, 20], [50, 19], [8, -20], [-8, -22]].forEach(([x, z], i) => cena.add(arvore(x, 0, z, 1, i, cortavel)));
  const solCeu = new THREE.Mesh(new THREE.IcosahedronGeometry(14, 1), mat('#FFE27A', { emissivo: '#FFB800', semNeblina: true }));
  solCeu.position.set(80, 140, -260);
  cena.add(solCeu);

  // ---------- o prédio (cortável na frente) ----------
  const predio = new THREE.Group();
  const fachada = C('#E9E2D0'), vidro = C('#8FC8F0', { brilho: true }), laje = C('#D6D1C6');
  const coresAndar = ['#F6D6CF', '#DCEBF7', '#FBE3B5', '#E3F2D9'];
  for (let i = 0; i <= ANDARES; i++) {
    const y = i * PE;
    // laje com o buraco do poço
    predio.add(caixa(5.6, 0.3, 12, laje, [-5.2, y, 0]));
    predio.add(caixa(5.6, 0.3, 12, laje, [5.2, y, 0]));
    predio.add(caixa(4.8, 0.3, 4.25, laje, [0, y, -3.875]));
    predio.add(caixa(4.8, 0.3, 4.25, laje, [0, y, 3.875]));
    if (i < ANDARES) {
      predio.add(caixa(16, PE - 0.3, 0.3, mat(coresAndar[i % 4]), [0, y + PE / 2, -5.85])); // parede do fundo (interna)
      predio.add(caixa(0.3, PE - 0.3, 12, fachada, [-7.85, y + PE / 2, 0]));
      predio.add(caixa(0.3, PE - 0.3, 12, fachada, [7.85, y + PE / 2, 0]));
      predio.add(caixa(16, PE - 0.3, 0.3, fachada, [0, y + PE / 2, 5.85]));
      for (const x of [-5.5, -2.8, 2.8, 5.5]) predio.add(caixa(1.6, 1.4, 0.12, vidro, [x, y + 1.6, 6.05]));
      for (const z of [-3, 3]) for (const s of [-1, 1]) predio.add(caixa(0.12, 1.4, 1.8, vidro, [s * 8.05, y + 1.6, z]));
    }
  }
  // poço do elevador (paredes) e casa de máquinas
  predio.add(caixa(4.8, TOPO, 0.2, mat('#BFC3CA'), [0, TOPO / 2, -1.85]));
  predio.add(caixa(0.2, TOPO, 3.5, C('#BFC3CA'), [-2.4, TOPO / 2, 0]));
  predio.add(caixa(0.2, TOPO, 3.5, C('#BFC3CA'), [2.4, TOPO / 2, 0]));
  predio.add(caixa(5.2, 3.4, 0.2, mat('#C9CCD2'), [0, TOPO + 1.85, -2.0]));
  predio.add(caixa(0.2, 3.4, 4.2, C('#C9CCD2'), [-2.6, TOPO + 1.85, 0]));
  predio.add(caixa(0.2, 3.4, 4.2, C('#C9CCD2'), [2.6, TOPO + 1.85, 0]));
  predio.add(caixa(5.4, 0.25, 4.4, C('#B9BCC2'), [0, TOPO + 3.6, 0]));
  predio.add(caixa(5.2, 0.2, 4.0, C('#C9CCD2'), [0, TOPO + 1.85, 2.0]));
  // porta de entrada
  predio.add(caixa(2.4, 2.4, 0.15, C('#7A4E2D'), [4.8, 1.35, 6.05]));
  cena.add(predio);

  // ---------- peças do elevador ----------
  // cabine
  const cabine = new THREE.Group();
  const paredeCab = C('#C9CED6', { duplo: true, metal: true });
  cabine.add(caixa(2.2, 0.15, 2.4, mat('#5B6270'), [0, 0.075, 0]));
  cabine.add(caixa(2.2, 2.5, 0.08, mat('#C89B6D'), [0, 1.3, -1.16]));
  cabine.add(caixa(1.9, 0.08, 0.1, mat('#E6E9EE', { metal: true }), [0, 1.0, -1.08]));
  cabine.add(caixa(0.08, 2.5, 2.4, paredeCab, [-1.06, 1.3, 0]));
  cabine.add(caixa(0.08, 2.5, 2.4, paredeCab, [1.06, 1.3, 0]));
  cabine.add(caixa(2.2, 0.15, 2.4, paredeCab, [0, 2.6, 0]));
  cabine.add(caixa(1.05, 2.4, 0.08, C('#9AA3AE', { metal: true }), [-0.53, 1.3, 1.16]));
  cabine.add(caixa(1.05, 2.4, 0.08, C('#9AA3AE', { metal: true }), [0.53, 1.3, 1.16]));
  cabine.add(caixa(0.6, 0.06, 0.6, mat('#FFF6D8', { emissivo: '#FFE9A0' }), [0, 2.52, 0]));
  cabine.add(caixa(1.6, 0.25, 0.4, mat('#4A505A'), [0, 2.8, 0]));
  // garras do freio de segurança (embaixo, dos dois lados, nos trilhos)
  const garras = [-1, 1].map((s) => {
    const g = caixa(0.32, 0.45, 0.5, mat('#E8322B'), [s * 1.2, 0.0, 0]);
    cabine.add(g);
    return g;
  });
  cena.add(cabine);

  // contrapeso (pilha de blocos)
  const contrapeso = new THREE.Group();
  for (let i = 0; i < 6; i++) contrapeso.add(caixa(1.0, 0.36, 1.3, mat(i % 2 ? '#5E6672' : '#6E7682'), [0, 0.2 + i * 0.38, 0]));
  contrapeso.add(caixa(1.15, 2.4, 0.1, mat('#3D434C'), [0, 1.2, -0.7]));
  contrapeso.add(caixa(0.8, 0.2, 0.3, mat('#3D434C'), [0, 2.4, 0]));
  cena.add(contrapeso);

  // motor e polia (casa de máquinas)
  const motor = new THREE.Group();
  const polia = new THREE.Group();
  polia.position.set(XPOLIA, S, 0);
  const roda = malha(new THREE.CylinderGeometry(RPOLIA, RPOLIA, 0.6, 18), mat('#7C838E', { metal: true }));
  roda.rotation.x = Math.PI / 2;
  polia.add(roda);
  polia.add(caixa(0.3, 2 * RPOLIA - 0.2, 0.62, mat('#4A505A'), [0, 0, 0]));
  polia.add(caixa(2 * RPOLIA - 0.2, 0.3, 0.62, mat('#4A505A'), [0, 0, 0]));
  motor.add(polia);
  motor.add(caixa(1.4, 1.4, 1.2, mat('#2F7FD8'), [XPOLIA, S - 0.2, -1.2]));
  motor.add(caixa(3.2, 0.5, 1.8, mat('#3D434C'), [XPOLIA, TOPO + 0.4, -0.4]));
  cena.add(motor);

  // trilhos-guia
  const trilhos = new THREE.Group();
  for (const x of [XC - 1.25, XC + 1.25, XP - 0.62, XP + 0.62]) trilhos.add(caixa(0.12, TOPO, 0.22, mat('#8C939E', { metal: true }), [x, TOPO / 2, 0]));
  cena.add(trilhos);

  // cabos (até 6), dos dois lados da polia
  const ZCABOS = [-0.25, -0.15, -0.05, 0.05, 0.15, 0.25];
  const matCabo = mat('#2A2D33');
  const cabos = ZCABOS.map((z) => {
    const ladoCab = caixa(0.06, 1, 0.06, matCabo, [0, 0, z], { sombra: false });
    const ladoCp = caixa(0.06, 1, 0.06, matCabo, [0, 0, z], { sombra: false });
    cena.add(ladoCab, ladoCp);
    return { ladoCab, ladoCp, z };
  });
  const segmento = (m, x, y1, y2) => {
    m.visible = y2 - y1 > 0.05;
    m.scale.y = Math.max(0.01, y2 - y1);
    m.position.x = x;
    m.position.y = (y1 + y2) / 2;
  };
  const poeira = respingos(30, '#D6D1C6', [XC, 0.3, 0.4], { vel: 5, tam: 0.25, gravidade: 12 });
  cena.add(poeira);

  // ---------- personagem ----------
  const voce = criarPersonagem();
  voce.scale.setScalar(0.92);
  cena.add(voce);

  // estado do elevador, montado a cada quadro
  let E;
  function inicial() {
    E = { cabine: false, yc: 0, contrapeso: false, ycp: null, motor: false, nCabos: 0, cortado: false, trilhos: false, garras: false, travado: false, tremor: 0 };
    voce.visible = true;
    voce.position.set(1.35, 0.15, 1.6);
    voce.rotation.y = 0.3;
    voce.scale.setScalar(1.12);
    voce.estado = { bracos: 'lado', expr: 'feliz' };
    poeira.em(-1);
  }
  function montar(t) {
    cabine.visible = E.cabine;
    cabine.position.set(XC + (E.tremor ? Math.sin(t * 60) * 0.03 * E.tremor : 0), E.yc + 0.15, 0);
    garras.forEach((g, i) => {
      g.visible = E.garras;
      g.position.x = (i ? 1 : -1) * (E.travado ? 1.18 : 1.25);
      g.material.color.set(E.travado ? '#FFB020' : '#E8322B');
    });
    const ycpAtual = E.ycp ?? ycp(E.yc);
    contrapeso.visible = E.contrapeso;
    contrapeso.position.set(XP, ycpAtual + 0.15, 0);
    motor.visible = E.motor;
    motor.position.x = E.tremor ? Math.sin(t * 50) * 0.04 * E.tremor : 0;
    polia.rotation.z = -(E.yc / RPOLIA);
    trilhos.visible = E.trilhos;
    cabos.forEach((c, i) => {
      const tem = i < E.nCabos && E.motor;
      const topoCab = E.cabine ? E.yc + 0.15 + 2.95 : S;
      if (!tem) { c.ladoCab.visible = c.ladoCp.visible = false; return; }
      if (E.cortado) segmento(c.ladoCab, XC + 0.05 * Math.sin(t * 20 + i), S - 3, S);
      else segmento(c.ladoCab, XC + 0.12 * (i - 2.5) * 0.15, topoCab, S);
      if (E.contrapeso) segmento(c.ladoCp, XP, E.cortado ? S - 3 : ycpAtual + 0.15 + 2.5, S);
      else c.ladoCp.visible = false;
    });
  }

  const blocos = [
    {
      // THUMB: elevador em corte no centro + personagem apontando; depois a câmera abre
      fala: 'Como um elevador sobe e desce sem cair? Imagina: você mora no último andar de um prédio, e subir de escada todo dia cansa.',
      destaque: ['elevador', 'cair', 'escada'],
      corte: true,
      camera: { pos: [-0.25, 3.7, 11.6], alvo: [-0.25, 4.3, 0] },
      cameraFim: { pos: [0, 17, 66], alvo: [0, 16, 0] },
      aplicar(lt, b) {
        const some = 1 - suave((lt - (b.dur - 0.9)) / 0.7); // peças "desmontam" no fim
        Object.assign(E, { cabine: some > 0.02, yc: 0, contrapeso: some > 0.02, motor: some > 0.02, nCabos: 6, trilhos: some > 0.02, garras: false });
        cabine.scale.setScalar(Math.max(0.01, some));
        contrapeso.scale.setScalar(Math.max(0.01, some));
        trilhos.scale.set(1, Math.max(0.01, some), 1);
        voce.estado = { bracos: lt < b.dur * 0.5 ? 'lado' : 'normal', expr: 'feliz' };
        if (lt > b.dur * 0.5) voce.rotation.y = 0.9;
      },
    },
    {
      fala: 'Então você põe uma caixa dentro de um poço, e puxa ela lá de cima com um cabo de aço.',
      destaque: ['caixa', 'poço', 'cabo'],
      corte: true,
      camera: { pos: [0, 16, 58], alvo: [0, 16, 0] },
      aplicar(lt, b) {
        cabine.scale.setScalar(1);
        contrapeso.scale.setScalar(1);
        trilhos.scale.set(1, 1, 1);
        const tc = b.palavra('caixa'), tm = b.palavra('cima');
        Object.assign(E, { cabine: lt > tc - 0.2, motor: lt > tm - 0.3, nCabos: lt > b.palavra('cabo') ? 1 : 0, contrapeso: false, trilhos: false });
        cabine.scale.setScalar(Math.max(0.01, saida((lt - tc + 0.2) / 0.4)));
        voce.visible = false;
        voce.scale.setScalar(0.92);
      },
    },
    {
      fala: 'Mas pra levantar a cabine cheia de gente, o motor faz força demais, e gasta muita energia.',
      destaque: ['força', 'energia'],
      corte: true,
      camera: { pos: [0, 14, 46], alvo: [0, 15, 0] },
      aplicar(lt, b) {
        Object.assign(E, { cabine: true, motor: true, nCabos: 1, contrapeso: false });
        E.yc = 6 * suave(lt / b.dur);
        E.tremor = lt > b.palavra('força') - 0.3 ? 1 : 0;
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('força'), 'PESADO DEMAIS'),
      sons: [{ em: 'força', tipo: 'rachando' }],
    },
    {
      fala: 'Então, do outro lado do cabo, você pendura um peso que equilibra a cabine.',
      destaque: ['peso', 'equilibra'],
      corte: true,
      camera: { pos: [0, 18, 52], alvo: [0, 17, 0] },
      aplicar(lt, b) {
        E.tremor = 0;
        const tp = b.palavra('pendura');
        Object.assign(E, { cabine: true, motor: true, nCabos: 1, contrapeso: lt > tp - 0.2 });
        // o contrapeso desce do teto até a posição de equilíbrio
        E.yc = 6;
        E.ycp = lt < tp + 1.2 ? mistura(TOPO + 6, ycp(6), saida((lt - tp + 0.2) / 1.2)) : null;
        contrapeso.scale.setScalar(1);
      },
      sons: [{ em: (b) => b.palavra('pendura') + 1.0, tipo: 'baque' }],
    },
    {
      fala: 'Esse é o contrapeso. Agora o motor só precisa vencer a diferença, e gasta bem menos energia.',
      destaque: ['contrapeso', 'menos'],
      corte: true,
      camera: { pos: [0, 16, 50], alvo: [0, 15, 0] },
      aplicar(lt, b) {
        E.ycp = null;
        Object.assign(E, { cabine: true, motor: true, nCabos: 1, contrapeso: true });
        E.yc = mistura(6, 21, suave(lt / b.dur));
      },
      camada: (lt, b) => cartao(lt, b.palavra('contrapeso'), 'CABINE + 50%', 'DA CARGA MÁXIMA: O PESO DO CONTRAPESO') + ok(lt, b.palavra('menos')),
      sons: [{ em: 'menos', tipo: 'ok' }],
    },
    {
      fala: 'Mas se o cabo arrebentar, a cabine despenca poço abaixo!',
      destaque: ['arrebentar', 'despenca'],
      corte: true,
      camera: { pos: [0, 12, 50], alvo: [0, 13, 0] },
      aplicar(lt, b) {
        Object.assign(E, { cabine: true, motor: true, nCabos: 1, contrapeso: true });
        const ta = b.palavra('arrebentar');
        const q = Math.max(0, lt - ta);
        E.cortado = lt > ta;
        E.yc = Math.max(0, 21 - 0.5 * 9.8 * q * q);
        E.ycp = E.cortado ? Math.max(0, ycp(21) - 0.5 * 9.8 * q * q) : null;
        const tChao = ta + Math.sqrt(21 / 4.9);
        poeira.em(lt - tChao);
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('arrebentar'), 'CABO ARREBENTOU'),
      sons: [{ em: 'arrebentar', tipo: 'quebra' }, { em: (b) => b.palavra('arrebentar') + Math.sqrt(21 / 4.9), tipo: 'baque' }],
    },
    {
      fala: 'Então você põe vários cabos de aço, e cada um, sozinho, já aguentaria a cabine.',
      destaque: ['vários', 'sozinho'],
      corte: true,
      camera: { pos: [0.2, 25, 22], alvo: [0.2, 27, 0] },
      transicao: 1.6,
      aplicar(lt, b) {
        poeira.em(-1);
        E.cortado = false;
        E.ycp = null;
        E.yc = 21;
        const tv = b.palavra('varios');
        E.nCabos = 1 + Math.min(5, Math.floor(Math.max(0, lt - tv) / 0.25));
        Object.assign(E, { cabine: true, motor: true, contrapeso: true });
      },
      camada: (lt, b) => cartao(lt, b.palavra('varios') + 1.3, '6 CABOS', 'DE AÇO SEGURANDO A MESMA CABINE'),
    },
    {
      fala: 'E ainda põe um freio de emergência: se a cabine descer rápido demais, umas garras travam no trilho.',
      destaque: ['freio', 'garras', 'trilho'],
      corte: true,
      camera: { pos: [XC + 0.4, 21.6, 13], alvo: [XC, 21.2, 0] },
      transicao: 1.6,
      aplicar(lt, b) {
        Object.assign(E, { cabine: true, motor: true, contrapeso: true, nCabos: 6, trilhos: lt > b.palavra('freio') - 0.3, garras: lt > b.palavra('garras') - 0.3 });
        trilhos.scale.set(1, Math.max(0.01, saida((lt - b.palavra('freio') + 0.3) / 0.8)), 1);
        // demonstração: desce rápido e trava
        const td = b.palavra('rapido');
        const q = Math.max(0, lt - td);
        const parada = 1.1;
        E.travado = lt > b.palavra('travam');
        E.yc = 21 - (E.travado ? 0.5 * 9.8 * Math.min(q, 0.5) ** 2 : 0.5 * 9.8 * Math.min(q, 0.5) ** 2);
        E.yc = Math.max(21 - parada, E.yc);
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('travam'), 'TRAVOU!'),
      sons: [{ em: 'travam', tipo: 'martelo' }],
    },
    {
      fala: 'Esse é o freio de segurança. Em 1854, Elisha Otis mandou cortar o cabo na frente do público... e não caiu.',
      destaque: ['segurança', 'Otis', 'caiu'],
      corte: true,
      camera: { pos: [XC + 0.6, 21.5, 11], alvo: [XC, 21.2, 0] },
      transicao: 1.4,
      aplicar(lt, b) {
        Object.assign(E, { cabine: true, motor: true, contrapeso: true, trilhos: true, garras: true });
        trilhos.scale.set(1, 1, 1);
        const tc = b.palavra('cortar');
        E.cortado = lt > tc + 0.4;
        E.nCabos = 6;
        const q = Math.max(0, lt - tc - 0.4);
        E.travado = q > 0.35;
        E.yc = 18 - 0.5 * 9.8 * Math.min(q, 0.35) ** 2;
        E.ycp = E.cortado ? null : null;
        voce.visible = true;
        voce.position.set(XC, E.yc + 0.15 + 2.95, 0.2);
        voce.rotation.y = 0;
        voce.estado = { bracos: E.travado ? 'cima' : 'normal', expr: E.cortado && !E.travado ? 'surpreso' : 'feliz', pulo: 0 };
      },
      camada: (lt, b) => cartao(lt, b.palavra('1854') || b.palavra('mil'), '1854', 'NOVA YORK: O FREIO DE OTIS É APRESENTADO'),
      sons: [{ em: 'cortar', depois: 0.4, tipo: 'quebra' }, { em: 'cortar', depois: 0.75, tipo: 'martelo' }],
    },
    {
      fala: 'Agora pode subir. Parabéns: você construiu um elevador!',
      destaque: ['subir', 'parabéns', 'elevador'],
      corte: true,
      camera: (lt, b) => {
        const yc = mistura(0, 27, suave(lt / (b.dur * 0.85)));
        return { pos: [XC + 0.3, yc + 1.9, 9.5], alvo: [XC, yc + 1.3, 0] };
      },
      transicao: 1.4,
      aplicar(lt, b) {
        Object.assign(E, { cabine: true, motor: true, contrapeso: true, trilhos: true, garras: true, nCabos: 6, cortado: false, travado: false, ycp: null });
        E.yc = mistura(0, 27, suave(lt / (b.dur * 0.85)));
        voce.visible = true;
        voce.position.set(XC, E.yc + 0.15, 0.2);
        voce.rotation.y = 0;
        const festa = lt > b.palavra('parabens') - 0.2;
        voce.estado = { bracos: festa ? 'cima' : 'normal', expr: 'feliz', pulo: festa ? 1 : 0 };
      },
    },
    {
      fala: FALA_FINAL,
      semLegenda: true,
      corte: true,
      camera: { pos: [XC, 27 + 1.75, 4.6], alvo: [XC, 27 + 1.45, 0.2] },
      transicao: 1.2,
      aplicar(lt) {
        Object.assign(E, { cabine: true, motor: true, contrapeso: true, trilhos: true, garras: true, nCabos: 6, yc: 27 });
        voce.visible = true;
        voce.position.set(XC, 27.15, 0.2);
        voce.rotation.y = 0;
        voce.estado = { bracos: lt > 2.2 ? 'aponta' : 'aceno', expr: 'feliz', pulo: 0 };
      },
      camada: (lt) => textoFinal(lt),
    },
  ];

  return {
    blocos,
    inicial,
    sempre(t) {
      montar(t);
      voce.animar(t);
    },
  };
}
