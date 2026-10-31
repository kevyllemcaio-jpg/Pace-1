// VÍDEO: "Como a energia chega na sua tomada?"
//
// Fatos conferidos:
//  - Usina hidrelétrica: a água desce pelo conduto, gira a turbina; o gerador converte giro em eletricidade.
//  - Perda nos fios = I²·R (vira calor). Subindo a tensão, a corrente cai e a perda despenca.
//  - No Brasil, transmissão em 138 kV a 800 kV (ex.: 500 kV); distribuição baixada em subestações
//    e no transformador do poste para 127 V / 220 V.
//  - Disjuntor desarma com sobrecorrente, antes do fio superaquecer.

import * as THREE from 'three';
import { suave, saida, mistura, lim, cartao, etiqueta, ok, som, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, cilindro, malha, terreno, ruido, arvore, casa, cano, fluxo } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';

export const config = {
  titulo: ['COMO A *ENERGIA*', 'CHEGA NA SUA', '*TOMADA*?'],
};

const XU = -95;                        // usina
const TORRES = [-62, -20, 22];         // torres de transmissão
const XS = 58;                         // subestação
const XC = 100, ZC = 10;               // casa do personagem
const PX = XC - 6, PZ = 14;            // personagem na calçada

function altura(x, z) {
  let h = 0;
  const dx = x - (XU - 62);
  h += 26 * Math.exp(-(dx * dx) / (2 * 18 * 18)) * Math.exp(-(z * z) / (2 * 40 * 40)); // morro da represa
  h += Math.max(0, Math.abs(z) - 60) * 0.3 + lim((Math.abs(z) - 60) / 30) * ruido(x, z) * 6;
  return h;
}

export function criar(ctx) {
  const { cena, cortavel } = ctx;
  const C = (cor, extra = {}) => cortavel(mat(cor, { cortavel: true, ...extra }));

  cena.add(terreno(altura, (y, incl, x, z) => (incl < 0.8 ? '#8E8F8A' : ruido(x * 3, z * 3) > 0.3 ? '#5DB13F' : '#6CBF47'), { largura: 520, profundidade: 400, seg: 130, material: mat('#ffffff', { vertexColors: true }) }));
  const lago = caixa(26, 0.3, 50, mat('#2C86E0', { brilho: true }), [XU - 64, 24.6, 0], { sombra: false });
  cena.add(lago);
  const solCeu = new THREE.Mesh(new THREE.IcosahedronGeometry(14, 1), mat('#FFE27A', { emissivo: '#FFB800', semNeblina: true }));
  solCeu.position.set(80, 140, -260);
  cena.add(solCeu);
  // rua e casas
  cena.add(caixa(140, 0.06, 7, mat('#3A3D44'), [XC - 20, 0.03, 18]));
  const casas = [];
  [[XC, ZC], [XC + 14, ZC], [XC - 14, ZC], [XC + 28, ZC], [XC - 28, ZC], [XC, ZC + 20], [XC + 16, ZC + 20], [XC - 16, ZC + 20]].forEach(([x, z], i) => {
    const c = casa(x, 0, z, z > ZC ? Math.PI : 0, ['#F3EBDD', '#FBE3B5', '#DCEBF7', '#F6D6CF'][i % 4], '#D9502F', cortavel);
    cena.add(c);
    casas.push(c);
  });
  // janelas que acendem
  const luzes = casas.map((c) => {
    const g = new THREE.Group();
    for (const x of [-1.9, 1.9]) g.add(caixa(1.25, 1.05, 0.05, mat('#FFE9A0', { emissivo: '#FFC94A', unico: true }), [x, 2, 2.66], { sombra: false }));
    c.add(g);
    return g;
  });
  [[XC - 40, 30], [XC + 40, 0], [70, -20], [-30, 25], [-50, -30], [10, -40], [XC + 20, 40]].forEach(([x, z], i) => cena.add(arvore(x, altura(x, z), z, 1, i, cortavel)));

  // ---------- usina ----------
  const usina = new THREE.Group();
  usina.add(caixa(16, 10, 12, C('#E9E2D0', { duplo: true }), [0, 5, 0]));
  usina.add(caixa(16.4, 0.6, 12.4, C('#3E7BD6'), [0, 10.3, 0]));
  const turbina = new THREE.Group();
  turbina.position.set(-3, 3.2, 0);
  const rotor = new THREE.Group();
  for (let i = 0; i < 6; i++) { const p = caixa(0.4, 3, 0.8, mat('#C3C9D2', { metal: true }), [0, 1.5, 0]); const g = new THREE.Group(); g.add(p); g.rotation.z = (i / 6) * Math.PI * 2; rotor.add(g); }
  rotor.add(cilindro(0.6, 1.2, mat('#5B6270'), [0, 0, 0], 10));
  rotor.children[rotor.children.length - 1].rotation.x = Math.PI / 2;
  turbina.add(rotor);
  usina.add(turbina);
  usina.add(caixa(4, 4, 4, mat('#E8322B'), [4, 2.6, 0]));
  usina.add(cilindro(0.35, 6, mat('#5B6270', { metal: true }), [0.5, 3.2, 0], 8));
  usina.children[usina.children.length - 1].rotation.z = Math.PI / 2;
  usina.position.set(XU, 0, 0);
  cena.add(usina);
  const conduto = cano([[XU - 52, 24, 0], [XU - 36, altura(XU - 36, 0) + 1.2, 0], [XU - 20, altura(XU - 20, 0) + 1.2, 0], [XU - 9, 3.2, 0], [XU - 3, 3.2, 0]], 1.0, mat('#7C838E', { metal: true }));
  const aguaConduto = fluxo(conduto, 26, '#7FD6FF', 14);
  cena.add(conduto, aguaConduto);

  // transformador elevador e subestação
  const trafo = (x, z, escala = 1, cor = '#7C838E') => {
    const g = new THREE.Group();
    g.add(caixa(4, 4, 3, mat(cor), [0, 2, 0]));
    for (let i = -1; i <= 1; i++) g.add(caixa(0.2, 3.4, 3.2, mat('#5B6270'), [i * 1.3 + 0.0, 2, 0]));
    for (let i = -1; i <= 1; i++) g.add(cilindro(0.25, 1.6, mat('#C76B3A'), [i * 1.2, 4.8, 0], 8));
    g.position.set(x, 0, z);
    g.scale.setScalar(escala);
    cena.add(g);
    return g;
  };
  const trafoUsina = trafo(XU + 14, 0);
  const subestacao = new THREE.Group();
  [trafo(XS - 4, -4, 1, '#8C939E'), trafo(XS + 4, -4, 1, '#8C939E')].forEach((t) => subestacao.add(t));
  for (let x = XS - 10; x <= XS + 10; x += 2) subestacao.add(caixa(0.08, 2, 0.08, mat('#9AA3AE'), [x, 1, 4]));
  subestacao.add(caixa(20, 0.06, 0.06, mat('#9AA3AE'), [XS, 2, 4]));
  cena.add(subestacao);

  // ---------- torres de transmissão ----------
  const aco = mat('#9AA3AE', { metal: true });
  function torreTransmissao() {
    const g = new THREE.Group();
    const H = 30;
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const perna = caixa(0.35, H, 0.35, aco, [0, H / 2, 0]);
      const p = new THREE.Group();
      p.add(perna);
      p.position.set(sx * 2.6, 0, sz * 2.6);
      p.rotation.set(-sz * 0.075, 0, sx * 0.075);
      g.add(p);
    }
    for (let y = 4; y < H; y += 4.5) {
      const w = 5.2 * (1 - y / H) + 0.8;
      g.add(caixa(w, 0.15, 0.15, aco, [0, y, w / 2]), caixa(w, 0.15, 0.15, aco, [0, y, -w / 2]));
      g.add(caixa(0.15, 0.15, w, aco, [w / 2, y, 0]), caixa(0.15, 0.15, w, aco, [-w / 2, y, 0]));
      const d = caixa(Math.hypot(w, 4.5) * 0.98, 0.1, 0.1, aco, [0, y + 2.25, w / 2]);
      d.rotation.z = Math.atan2(4.5, w);
      g.add(d);
    }
    for (const y of [H - 6, H - 1]) g.add(caixa(0.3, 0.3, 14, aco, [0, y, 0]));
    for (const [y, z] of [[H - 6, -6], [H - 6, 6], [H - 1, 0]]) g.add(cilindro(0.18, 1.4, mat('#BFE3F5', { brilho: true }), [0, y - 0.8, z], 6));
    return g;
  }
  const torres = TORRES.map((x) => { const t = torreTransmissao(); t.position.set(x, altura(x, 0) - 0.3, 0); cena.add(t); return t; });
  // fios (catenária) entre usina -> torres -> subestação
  const pontosLinha = [[XU + 14, 5.5], ...TORRES.map((x) => [x, 30 - 6.8 + altura(x, 0)]), [XS, 5.5]];
  const fiosAlta = [];
  for (const z of [-6, 6, 0]) {
    for (let i = 0; i < pontosLinha.length - 1; i++) {
      const [x1, y1] = pontosLinha[i], [x2, y2] = pontosLinha[i + 1];
      const yz = z === 0 ? 5 : 0;
      const pts = [];
      for (let k = 0; k <= 12; k++) {
        const u = k / 12;
        pts.push([mistura(x1, x2, u), mistura(y1 + yz * (i > 0 ? 1 : 0), y2 + yz * (i < pontosLinha.length - 2 ? 1 : 0), u) - 4 * Math.sin(Math.PI * u), z * (i === 0 || i === pontosLinha.length - 2 ? 0.4 : 1)]);
      }
      const f = cano(pts, 0.1, mat('#2A2D33', { unico: true }));
      cena.add(f);
      const pulsos = fluxo(f, 3, '#FFE14A', 18);
      cena.add(pulsos);
      fiosAlta.push({ f, pulsos });
    }
  }
  // fio simples (1ª tentativa) em postes baixos, da usina até a cidade
  const postesBaixos = [];
  const ptsSimples = [];
  for (let x = XU + 10; x <= XC - 20; x += 25) {
    const p = cilindro(0.18, 8, C('#8C6B4F'), [x, altura(x, 26) + 4, 26], 6);
    cena.add(p);
    postesBaixos.push(p);
    ptsSimples.push([x, altura(x, 26) + 7.8, 26]);
  }
  const matFioSimples = mat('#2A2D33', { unico: true, emissivo: '#000000' });
  const fioSimples = cano(ptsSimples, 0.12, matFioSimples);
  cena.add(fioSimples);
  const calorFio = fluxo(fioSimples, 14, '#FF5A2A', 6);
  cena.add(calorFio);

  // postes da rua com transformador
  const postesRua = [], fiosRua = [];
  for (let x = XS + 12; x <= XC + 12; x += 16) {
    const g = new THREE.Group();
    g.add(cilindro(0.2, 9, mat('#C9CCD2'), [0, 4.5, 0], 8));
    g.add(caixa(2.6, 0.2, 0.2, mat('#C9CCD2'), [0, 8.6, 0]));
    g.position.set(x, 0, 21.5);
    cena.add(g);
    postesRua.push(g);
  }
  for (let i = 0; i < postesRua.length - 1; i++) {
    const x1 = postesRua[i].position.x, x2 = postesRua[i + 1].position.x;
    const pts = [];
    for (let k = 0; k <= 8; k++) pts.push([mistura(x1, x2, k / 8), 8.7 - 0.5 * Math.sin(Math.PI * k / 8), 21.5]);
    const f = cano(pts, 0.05, mat('#2A2D33'));
    cena.add(f);
    fiosRua.push(f);
  }
  const posteTrafo = postesRua.reduce((a, p) => (Math.abs(p.position.x - XC) < Math.abs(a.position.x - XC) ? p : a));
  const tambor = cilindro(0.55, 1.4, mat('#8C939E'), [0.6, 6.9, 0], 10);
  posteTrafo.add(tambor);
  const ramal = cano([[posteTrafo.position.x + 0.6, 7.2, 21.5], [XC - 1.5, 4.5, ZC + 2.6]], 0.04, mat('#2A2D33'));
  cena.add(ramal);
  // quadro de disjuntores na fachada da casa
  const quadro = new THREE.Group();
  quadro.add(caixa(1.0, 1.3, 0.15, mat('#D5D8DE'), [0, 0, 0]));
  const alavancas = [];
  for (let i = 0; i < 3; i++) {
    quadro.add(caixa(0.22, 0.42, 0.06, mat('#2A2D33'), [-0.3 + i * 0.3, 0, 0.1]));
    const a = caixa(0.1, 0.16, 0.08, mat('#E8322B'), [-0.3 + i * 0.3, 0.1, 0.16]);
    quadro.add(a);
    alavancas.push(a);
  }
  quadro.position.set(XC + 2.2, 1.7, ZC + 2.62);
  cena.add(quadro);
  const faisca = caixa(0.6, 0.6, 0.05, mat('#FFE14A', { emissivo: '#FF9F1C' }), [XC + 2.2, 1.7, ZC + 2.8], { sombra: false });
  cena.add(faisca);

  const voce = criarPersonagem();
  voce.scale.setScalar(1.05);
  cena.add(voce);

  const corDia = new THREE.Color('#8CCFFF'), corNoite = new THREE.Color('#2B3A67');
  let E;
  function inicial() {
    E = { usina: true, conduto: 1, gira: true, fioSimples: 0, calor: false, trafoUsina: false, torres: 0, fios: false, subestacao: false, rua: false, luzes: false, noite: 0, desarma: -1 };
    voce.visible = true;
    voce.position.set(PX, 0, PZ);
    voce.rotation.y = -0.6;
    voce.estado = { bracos: 'lado', expr: 'feliz' };
  }
  function montar(t, corte) {
    usina.visible = E.usina;
    rotor.rotation.z = E.gira ? -t * 3 : 0;
    conduto.visible = E.usina;
    aguaConduto.visible = E.usina && E.gira;
    aguaConduto.em(t);
    postesBaixos.forEach((p) => (p.visible = E.fioSimples > 0));
    fioSimples.crescer(E.fioSimples);
    matFioSimples.emissive.set(E.calor ? '#C0300A' : '#000000');
    calorFio.visible = E.calor;
    calorFio.em(t, E.fioSimples);
    trafoUsina.visible = E.trafoUsina;
    torres.forEach((tr, i) => { tr.visible = i < E.torres; tr.scale.y = lim(E.torres - i); });
    fiosAlta.forEach(({ f, pulsos }) => { f.visible = E.fios; pulsos.visible = E.fios; pulsos.em(t); });
    subestacao.visible = E.subestacao;
    postesRua.forEach((p) => (p.visible = E.rua));
    fiosRua.forEach((f) => (f.visible = E.rua));
    ramal.visible = E.rua;
    tambor.visible = E.rua;
    luzes.forEach((l) => (l.visible = E.luzes));
    cena.background.copy(corDia).lerp(corNoite, E.noite);
    cena.fog.color.set('#CDEBFF').lerp(new THREE.Color('#3A4A78'), E.noite);
    ctx.hemi.intensity = 1.5 - 0.8 * E.noite;
    ctx.sol.intensity = 2.4 - 1.9 * E.noite;
    alavancas.forEach((a, i) => (a.position.y = E.desarma >= 0 && i === 1 ? -0.1 : 0.1));
    faisca.visible = E.desarma >= 0 && E.desarma < 0.4;
  }
  const apresentar = (lt, b, bracos = 'aponta', expr = 'feliz') => {
    voce.visible = true;
    voce.position.set(PX, 0, PZ);
    voce.rotation.y = -0.3;
    voce.estado = { bracos, expr, falando: b.falando(lt) };
  };
  const camApresentador = { pos: [PX - 0.9, 2.1, PZ + 4.6], alvo: [PX - 0.2, 1.75, PZ] };

  const blocos = [
    {
      fala: 'A luz que acende no seu quarto pode ter saído de uma usina a centenas de quilômetros. Como ela chega até a tomada?',
      destaque: ['luz', 'usina', 'tomada'],
      camera: { pos: [TORRES[2] + 7.5, 2.3, 32], alvo: [TORRES[2] + 0.5, 8.5, 0] },
      cameraFim: { pos: [-20, 60, 150], alvo: [-10, 5, 0] },
      aplicar(lt, b) {
        Object.assign(E, { torres: 3, fios: true, trafoUsina: true, subestacao: true, rua: true });
        voce.position.set(TORRES[2] + 5.0, altura(TORRES[2] + 5.0, 23), 23);
        voce.rotation.y = 0.15;
        voce.estado = { bracos: lt < b.dur * 0.5 ? 'lado' : 'cima', expr: 'feliz' };
      },
    },
    {
      fala: 'Primeiro, você faz a energia: a água da represa desce por um cano, gira uma turbina, e o gerador transforma esse giro em eletricidade.',
      destaque: ['turbina', 'gerador', 'eletricidade'],
      corte: true,
      corteSeco: true,
      camera: { pos: [XU - 2, 6, 26], alvo: [XU - 2, 4.5, 0] },
      aplicar(lt, b) {
        Object.assign(E, { torres: 0, fios: false, trafoUsina: false, subestacao: false, rua: false });
        voce.visible = false;
      },
      camada: (lt, b) => cartao(lt, b.palavra('gerador'), 'GERADOR', 'GIRO → ELETRICIDADE'),
    },
    {
      fala: 'Então você estica um fio da usina até a cidade.',
      destaque: ['fio', 'cidade'],
      camera: { pos: [-10, 30, 120], alvo: [0, 4, 20] },
      aplicar(lt, b) { E.fioSimples = suave((lt - b.palavra('fio') + 0.2) / 1.6); },
    },
    {
      fala: 'Mas o fio é comprido, esquenta, e boa parte da energia vira calor no caminho.',
      destaque: ['esquenta', 'calor'],
      corteSeco: true,
      camera: { pos: [-6, 10, 42], alvo: [-6, 7, 26] },
      aplicar(lt, b) { E.fioSimples = 1; E.calor = lt > b.palavra('esquenta') - 0.2; },
      camada: (lt, b) => etiqueta(lt, b.palavra('calor'), 'PERDENDO ENERGIA'),
      sons: [{ em: 'esquenta', tipo: 'zap' }],
    },
    {
      fala: 'Então você sobe a voltagem num transformador, pra centenas de milhares de volts. Com menos corrente, o fio quase não esquenta.',
      destaque: ['transformador', 'volts', 'corrente'],
      corteSeco: true,
      camera: { pos: [XU + 24, 7, 18], alvo: [XU + 14, 3.5, 0] },
      aplicar(lt, b) {
        Object.assign(E, { fioSimples: 0, calor: false });
        E.trafoUsina = lt > b.palavra('transformador') - 0.3;
        trafoUsina.scale.setScalar(Math.max(0.01, saida((lt - b.palavra('transformador') + 0.3) / 0.5)));
      },
      camada: (lt, b) => cartao(lt, b.palavra('volts'), '500.000 V', 'MAIS VOLTAGEM = MENOS PERDA NO FIO'),
      sons: [{ em: 'transformador', tipo: 'zap' }],
    },
    {
      fala: 'Essas são as linhas de transmissão, penduradas em torres bem altas, longe de tudo.',
      destaque: ['linhas', 'transmissão', 'torres'],
      camera: { pos: [-70, 14, 70], alvo: [-20, 18, 0] },
      cameraFim: { pos: [-40, 20, 90], alvo: [10, 16, 0] },
      aplicar(lt, b) {
        trafoUsina.scale.setScalar(1);
        E.trafoUsina = true;
        E.torres = 3 * saida((lt - b.palavra('torres') + 0.6) / 1.3);
        E.fios = lt > b.palavra('torres') + 0.6;
      },
    },
    {
      fala: 'Mas essa voltagem toda queimaria qualquer aparelho da sua casa na hora.',
      destaque: ['queimaria', 'casa'],
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) { Object.assign(E, { torres: 3, fios: true }); apresentar(lt, b, 'cabeca', 'surpreso'); },
      camada: (lt, b) => etiqueta(lt, b.palavra('queimaria'), 'PERIGO'),
    },
    {
      fala: 'Então você baixa a voltagem numa subestação, e depois de novo, num transformador em cima do poste da sua rua.',
      destaque: ['subestação', 'poste'],
      camera: { pos: [XS + 10, 18, 60], alvo: [XS + 22, 4, 10] },
      aplicar(lt, b) {
        E.subestacao = lt > b.palavra('subestacao') - 0.3;
        subestacao.scale.setScalar(Math.max(0.01, saida((lt - b.palavra('subestacao') + 0.3) / 0.5)));
        E.rua = lt > b.palavra('poste') - 0.5;
        voce.visible = true;
      },
      camada: (lt, b) => cartao(lt, b.palavra('poste'), '127 V / 220 V', 'A VOLTAGEM QUE CHEGA NA SUA CASA'),
    },
    {
      fala: 'É por isso que tem aquele cilindro pendurado no poste perto da sua casa: é o transformador.',
      destaque: ['cilindro', 'poste', 'transformador'],
      corteSeco: true,
      camera: { pos: [posteTrafo.position.x - 4.5, 2.2, 26.8], alvo: [posteTrafo.position.x - 0.5, 5.2, 21.5] },
      aplicar(lt, b) {
        subestacao.scale.setScalar(1);
        Object.assign(E, { subestacao: true, rua: true });
        voce.visible = true;
        voce.position.set(posteTrafo.position.x - 2.2, 0, 24.5);
        voce.rotation.y = 0.5;
        voce.estado = { bracos: 'cima', expr: 'feliz', falando: false };
      },
    },
    {
      fala: 'E dentro de casa, o disjuntor desliga tudo se passar corrente demais, antes do fio pegar fogo.',
      destaque: ['disjuntor', 'fogo'],
      corteSeco: true,
      camera: { pos: [XC + 2.4, 2.0, ZC + 5.6], alvo: [XC + 2.2, 1.7, ZC + 2.6] },
      aplicar(lt, b) {
        E.luzes = lt < b.palavra('desliga');
        E.desarma = lt > b.palavra('desliga') ? lt - b.palavra('desliga') : -1;
        voce.visible = false;
      },
      camada: (lt, b) => ok(lt, b.palavra('fogo')),
      sons: [{ em: 'desliga', tipo: 'martelo' }],
    },
    {
      fala: 'Agora pode ligar. Parabéns: você levou energia até a tomada!',
      destaque: ['ligar', 'parabéns', 'energia'],
      corteSeco: true,
      camera: { pos: [PX + 4, 3.5, PZ + 16], alvo: [XC - 2, 3, ZC] },
      cameraFim: { pos: [PX + 2, 14, PZ + 40], alvo: [XC - 4, 3, ZC] },
      aplicar(lt, b) {
        E.desarma = -1;
        E.noite = suave(lt / 1.2) * 0.85;
        E.luzes = lt > b.palavra('ligar');
        voce.visible = true;
        voce.position.set(PX, 0, PZ);
        voce.rotation.y = -0.3;
        const festa = lt > b.palavra('parabens') - 0.2;
        voce.estado = { bracos: festa ? 'cima' : 'normal', expr: 'feliz', pulo: festa ? 1 : 0 };
      },
      sons: [{ em: 'ligar', tipo: 'ok' }],
    },
    {
      fala: FALA_FINAL,
      semLegenda: true,
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) {
        E.noite = 0.85;
        E.luzes = true;
        apresentar(lt, b, lt > 2.4 ? 'aponta' : 'aceno');
      },
      camada: (lt) => textoFinal(lt),
    },
  ];

  return {
    blocos,
    inicial,
    sempre(t, corte) {
      montar(t, corte);
      voce.animar(t);
    },
  };
}
