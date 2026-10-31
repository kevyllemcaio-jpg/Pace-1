// VÍDEO: "Como um prédio aguenta um terremoto?"
//
// Fatos conferidos:
//  - Terremoto de 2011 no Japão (Tohoku): o chão tremeu por ~6 minutos; arranha-céus de Tóquio
//    balançaram bastante, mas não desabaram.
//  - Alvenaria sem armação (tijolo empilhado) é frágil em sismos; concreto armado (aço dentro) é dúctil.
//  - Ressonância: se o tremor bate no ritmo natural do prédio, a oscilação cresce.
//  - Amortecedor de massa sintonizado: a esfera do Taipei 101 pesa 660 toneladas.
//  - Isoladores sísmicos de base (camadas de borracha e aço) desacoplam o prédio do chão.

import * as THREE from 'three';
import { suave, saida, mistura, lim, cartao, etiqueta, ok, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, malha, terreno, arvore } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';

export const config = {
  titulo: ['COMO UM *PRÉDIO*', 'AGUENTA UM', '*TERREMOTO*?'],
};

const N = 20, PE = 3, BASE = 1.2;          // 20 andares, 3 m cada, apoiado 1,2 m acima da fundação
const TOPO = BASE + N * PE;                // ~61 m
const PX = 9, PZ = 17;                     // personagem na calçada

export function criar(ctx) {
  const { cena, cortavel } = ctx;
  const C = (cor, extra = {}) => cortavel(mat(cor, { cortavel: true, ...extra }));

  // tudo que está "no chão" treme junto
  const chao = new THREE.Group();
  cena.add(chao);
  chao.add(terreno(() => 0, (y, i, x, z) => ((Math.floor(x / 8) + Math.floor(z / 8)) % 2 ? '#6CBF47' : '#64B641'), { largura: 500, profundidade: 500, seg: 40, material: mat('#ffffff', { vertexColors: true }) }));
  chao.add(caixa(500, 0.06, 9, mat('#3A3D44'), [0, 0.03, 13]));
  for (let x = -240; x < 240; x += 6) chao.add(caixa(2.4, 0.02, 0.2, mat('#F4F4F4'), [x, 0.07, 13]));
  chao.add(caixa(500, 0.18, 3, C('#C9CCD2'), [0, 0.09, 18.5]));
  [[-34, -2, 30, '#DCEBF7'], [34, 0, 24, '#F6D6CF'], [-58, -8, 42, '#FBE3B5'], [60, -6, 36, '#E3F2D9'], [-20, -46, 50, '#E9E2D0'], [24, -50, 46, '#DCEBF7']].forEach(([x, z, h, cor]) => {
    const g = new THREE.Group();
    g.add(caixa(14, h, 12, C(cor), [0, h / 2, 0]));
    for (let y = 2; y < h - 1; y += 3) for (let k = -2; k <= 2; k++) g.add(caixa(1.4, 1.5, 0.15, C('#8FC8F0', { brilho: true }), [k * 2.6, y, 6.05]));
    g.position.set(x, 0, z);
    chao.add(g);
  });
  [[-16, 22], [18, 22], [-44, 22], [44, 22], [-10, -24], [12, -26]].forEach(([x, z], i) => chao.add(arvore(x, 0, z, 1, i, cortavel)));
  const fundacao = caixa(14, 0.5, 14, mat('#9EA2AA'), [0, 0.25, 0]);
  chao.add(fundacao);
  const solCeu = new THREE.Mesh(new THREE.IcosahedronGeometry(14, 1), mat('#FFE27A', { emissivo: '#FFB800', semNeblina: true }));
  solCeu.position.set(80, 140, -260);
  cena.add(solCeu);

  // ---------- torre de tijolos (1ª tentativa) ----------
  const tijolos = [];
  const torreTij = new THREE.Group();
  for (let n = 0; n < 14; n++) for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) {
    if (a > 0 && a < 3 && b > 0 && b < 3) continue;
    const m = caixa(1.25, 0.62, 1.25, mat((a + b + n) % 2 ? '#C1502E' : '#A9442A'), [0, 0, 0]);
    const p0 = new THREE.Vector3(-1.9 + a * 1.27 + (n % 2) * 0.3, 0.5 + 0.31 + n * 0.64, -1.9 + b * 1.27);
    const s = (a * 7 + b * 13 + n * 3) % 17;
    tijolos.push({ m, p0, v: new THREE.Vector3((p0.x || 0.3) * (0.6 + (s % 5) * 0.2), 1 + (s % 4), (p0.z || 0.3) * (0.6 + (s % 3) * 0.3)), atraso: (13 - n) * 0.04 + (s % 5) * 0.03 });
    torreTij.add(m);
  }
  chao.add(torreTij);
  function tijolosEm(q) {
    for (const t of tijolos) {
      const tt = Math.max(0, q - t.atraso);
      const y = Math.max(0.81, t.p0.y + t.v.y * tt - 4.9 * tt * tt);
      const pare = y <= 0.81 ? 0.35 : 1;
      t.m.position.set(t.p0.x + t.v.x * tt * pare, y, t.p0.z + t.v.z * tt * pare);
      t.m.rotation.set(tt * 2 * pare, 0, tt * 1.5 * pare);
    }
  }

  // ---------- o prédio ----------
  const predio = new THREE.Group();
  cena.add(predio);
  const concreto = mat('#C9CCD2', { unico: true });
  const aco = mat('#3D434C');
  const vidro = C('#8FC8F0', { brilho: true, opacidade: 0.85 });
  const coresAndar = ['#F6D6CF', '#DCEBF7', '#FBE3B5', '#E3F2D9'];
  const andares = [];
  const vergalhoes = [];
  for (let i = 0; i < N; i++) {
    const g = new THREE.Group();
    g.add(caixa(13, 0.4, 13, C('#B9BCC2'), [0, 0.2, 0]));
    for (const x of [-6, 0, 6]) for (const z of [-6, 6]) {
      g.add(caixa(0.9, PE - 0.4, 0.9, (z > 0 ? cortavel(concreto) : concreto), [x, 0.4 + (PE - 0.4) / 2, z]));
      for (const dx of [-0.25, 0.25]) for (const dz of [-0.25, 0.25]) { const r = caixa(0.08, PE - 0.4, 0.08, aco, [x + dx, 0.4 + (PE - 0.4) / 2, z + dz], { sombra: false }); vergalhoes.push(r); g.add(r); }
    }
    g.add(caixa(12.6, PE - 0.4, 0.2, mat(coresAndar[i % 4]), [0, 0.4 + (PE - 0.4) / 2, -6.2]));
    g.add(caixa(12.6, PE - 0.6, 0.12, vidro, [0, 0.4 + (PE - 0.4) / 2, 6.3]));
    for (const s of [-1, 1]) g.add(caixa(0.12, PE - 0.6, 12.6, vidro, [s * 6.3, 0.4 + (PE - 0.4) / 2, 0]));
    predio.add(g);
    andares.push(g);
  }
  const teto = caixa(13.4, 0.6, 13.4, C('#9EA2AA'), [0, 0, 0]);
  predio.add(teto);
  // apoios: pilaretes rígidos ou isoladores de borracha
  const apoios = [], isoladores = [];
  for (const x of [-6, 0, 6]) for (const z of [-6, 0, 6]) {
    const a = caixa(1.1, BASE - 0.5, 1.1, cortavel(mat('#9EA2AA', { unico: true })), [x, 0.5 + (BASE - 0.5) / 2, z]);
    chao.add(a);
    apoios.push(a);
    const iso = new THREE.Group();
    for (let k = 0; k < 5; k++) iso.add(caixa(1.3, 0.13, 1.3, mat(k % 2 ? '#C3C9D2' : '#1E1E22'), [0, -0.33 + k * 0.15, 0]));
    iso.position.set(x, 0.5 + (BASE - 0.5) / 2, z);
    cena.add(iso);
    isoladores.push(iso);
  }
  // amortecedor (bola de aço pendurada no topo)
  const amort = new THREE.Group();
  const bola = malha(new THREE.IcosahedronGeometry(2.3, 1), mat('#E8B53A', { metal: true, brilho: true }));
  amort.add(bola);
  const cabosAmort = [-1, 1].flatMap((sx) => [-1, 1].map((sz) => {
    const m = caixa(0.1, 1, 0.1, aco, [0, 0, 0], { sombra: false });
    amort.add(m);
    return { m, sx, sz };
  }));
  cena.add(amort);

  const voce = criarPersonagem();
  voce.scale.setScalar(1.05);
  chao.add(voce);

  // ---------- estado e física "de desenho" ----------
  let E;
  function inicial() {
    E = { tremor: 0, topo: 0, nAndares: N, raioX: false, amortecedor: false, isolado: false, teaser: 1, tijolos: false, quedaTijolos: -1, escalaPredio: 1 };
    voce.visible = true;
    voce.position.set(PX, 0.18, PZ);
    voce.rotation.y = -0.35;
    voce.estado = { bracos: 'lado', expr: 'feliz' };
    voce.scale.setScalar(1.05);
  }
  const chaoX = (t) => E.tremor * 0.45 * (0.6 * Math.sin(t * 9) + 0.4 * Math.sin(t * 14 + 1));
  function montar(t) {
    const gx = chaoX(t);
    chao.position.x = gx;
    torreTij.visible = E.tijolos;
    if (E.tijolos) tijolosEm(E.quedaTijolos);
    const baseX = E.isolado ? gx * 0.12 : gx;
    predio.visible = E.nAndares > 0;
    concreto.transparent = E.raioX;
    concreto.opacity = E.raioX ? 0.35 : 1;
    vergalhoes.forEach((r) => (r.visible = E.raioX));
    const topoS = E.topo * Math.sin(t * 2.2) * (E.amortecedor ? 0.25 : 1);
    andares.forEach((g, i) => {
      g.visible = i < E.nAndares;
      const h = (i + 0.5) / N;
      g.position.set(baseX + topoS * h ** 1.5, BASE + i * PE, 0);
      g.rotation.z = -topoS * 1.5 * h ** 0.5 / (N * PE) * 1.2;
      g.scale.setScalar(E.escalaPredio);
    });
    teto.visible = E.nAndares >= N;
    teto.position.set(baseX + topoS, BASE + N * PE + 0.3, 0);
    apoios.forEach((a) => (a.visible = !E.isolado));
    isoladores.forEach((iso) => {
      iso.visible = E.isolado;
      iso.position.x = (gx + baseX) / 2 + (iso.userData.x0 ?? (iso.userData.x0 = iso.position.x));
      iso.rotation.z = -(gx - baseX) * 0.35;
    });
    amort.visible = E.amortecedor;
    const xb = baseX + topoS * 0.93 - (E.topo ? Math.sin(t * 2.2) * E.topo * 0.9 : 0);
    amort.position.set(0, 0, 0);
    bola.position.set(xb, TOPO - 8, 0);
    cabosAmort.forEach(({ m, sx, sz }) => {
      const x1 = baseX + topoS * 0.97 + sx * 1.6, y1 = TOPO - 3.4;
      const x2 = xb + sx * 1.0, y2 = TOPO - 8 + 1.6;
      m.position.set((x1 + x2) / 2, (y1 + y2) / 2, sz * 1.0);
      m.scale.y = Math.hypot(x2 - x1, y2 - y1);
      m.rotation.z = Math.atan2(x2 - x1, y1 - y2);
    });
  }

  const apresentar = (lt, b, bracos = 'aponta', expr = 'feliz') => {
    voce.position.set(PX, 0.18, PZ);
    voce.rotation.y = -0.25;
    voce.estado = { bracos, expr, falando: b.falando(lt) };
  };
  const camApresentador = { pos: [PX - 0.6, 2.0, PZ + 4.4], alvo: [PX - 0.1, 1.75, PZ] };

  const blocos = [
    {
      fala: 'Em 2011, o chão do Japão tremeu por seis minutos. Os prédios de Tóquio balançaram... mas não caíram. Como?',
      destaque: ['2011', 'tremeu', 'caíram'],
      corte: (lt) => lt < 2.5,
      camera: { pos: [PX + 2.2, 2.5, PZ + 8.5], alvo: [3, 7.5, 0] },
      cameraFim: { pos: [10, 26, 105], alvo: [0, 26, 0] },
      aplicar(lt, b) {
        E.amortecedor = true;
        E.isolado = true;
        E.tremor = lt > b.palavra('tremeu') ? 0.6 : 0;
        E.topo = E.tremor ? 1.2 : 0;
        E.escalaPredio = 1 - suave((lt - (b.dur - 0.8)) / 0.6) * 0.999;
        voce.estado = { bracos: lt < b.dur * 0.45 ? 'lado' : 'cabeca', expr: lt < b.dur * 0.45 ? 'feliz' : 'surpreso' };
      },
    },
    {
      fala: 'Se você só empilha tijolos e o chão treme... tudo desaba.',
      destaque: ['tijolos', 'desaba'],
      corteSeco: true,
      camera: { pos: [4, 6, 30], alvo: [0, 5, 0] },
      aplicar(lt, b) {
        Object.assign(E, { nAndares: 0, amortecedor: false, isolado: false, escalaPredio: 1, topo: 0, tijolos: true });
        const tt = b.palavra('treme');
        E.tremor = lt > tt - 0.2 ? 1 : 0;
        E.quedaTijolos = lt - b.palavra('desaba') + 0.2;
        voce.estado = { bracos: lt > b.palavra('desaba') ? 'cabeca' : 'normal', expr: 'surpreso' };
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('desaba'), 'DESABOU'),
      sons: [{ em: 'desaba', tipo: 'quebra' }],
    },
    {
      fala: 'Então você faz pilares e vigas de concreto, com barras de aço por dentro, que entortam sem quebrar.',
      destaque: ['concreto', 'aço', 'entortam'],
      corte: true,
      camera: { pos: [6, 22, 96], alvo: [0, 26, 0] },
      transicao: 1.6,
      aplicar(lt, b) {
        Object.assign(E, { tijolos: false, tremor: 0 });
        E.nAndares = Math.round(N * saida((lt - b.palavra('pilares') + 0.3) / 2.2));
        E.raioX = lt > b.palavra('aço') - 0.2 && lt < b.dur - 0.3;
      },
      camada: (lt, b) => cartao(lt, b.palavra('aço'), 'CONCRETO ARMADO', 'AÇO POR DENTRO: DOBRA SEM QUEBRAR'),
    },
    {
      fala: 'Mas no terremoto, o prédio entra no ritmo do chão... e balança cada vez mais.',
      destaque: ['ritmo', 'balança'],
      corte: true,
      camera: { pos: [6, 24, 104], alvo: [0, 28, 0] },
      aplicar(lt, b) {
        Object.assign(E, { nAndares: N, raioX: false, tremor: 0.8 });
        E.topo = mistura(0.5, 5.5, suave((lt - b.palavra('ritmo')) / 2.6));
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('balança'), 'RESSONÂNCIA'),
      sons: [{ em: 'balança', tipo: 'rachando' }],
    },
    {
      fala: 'Então você pendura uma bola de aço gigante lá no topo. Quando o prédio vai pra um lado, a bola vai pro outro, e segura ele.',
      destaque: ['bola', 'topo', 'segura'],
      corte: true,
      corteSeco: true,
      camera: { pos: [0, TOPO - 6, 30], alvo: [0, TOPO - 7, 0] },
      aplicar(lt, b) {
        E.tremor = 0.8;
        E.amortecedor = lt > b.palavra('bola') - 0.2;
        E.topo = mistura(4, 2.2, suave((lt - b.palavra('outro')) / 1.5));
      },
      camada: (lt, b) => ok(lt, b.palavra('segura')),
      sons: [{ em: 'segura', tipo: 'ok' }],
    },
    {
      fala: 'Esse é o amortecedor de massa. O do prédio Taipei 101, em Taiwan, pesa seiscentas e sessenta toneladas!',
      destaque: ['amortecedor', 'Taipei', 'toneladas'],
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) {
        Object.assign(E, { tremor: 0, topo: 0, amortecedor: true });
        apresentar(lt, b, lt < 2.4 ? 'aponta' : 'cima');
      },
      camada: (lt, b) => cartao(lt, b.palavra('seiscentas'), '660 t', 'A BOLA DO TAIPEI 101'),
    },
    {
      fala: 'Mas os andares de baixo ainda levam o tranco todo, direto do chão.',
      destaque: ['baixo', 'tranco'],
      corte: true,
      corteSeco: true,
      camera: { pos: [3, 3.5, 24], alvo: [0, 3, 0] },
      aplicar(lt, b) {
        Object.assign(E, { amortecedor: true, tremor: 1.1, topo: 1.2, isolado: false });
        voce.position.set(PX, 0.18, PZ);
        voce.estado = { bracos: 'cabeca', expr: 'surpreso' };
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('tranco'), 'TRANCO NA BASE'),
      sons: [{ em: 'tranco', tipo: 'baque' }],
    },
    {
      fala: 'Então você apoia o prédio em blocos de borracha. O chão chacoalha embaixo, e o prédio quase nem se mexe.',
      destaque: ['borracha', 'chacoalha', 'mexe'],
      corte: true,
      camera: { pos: [3, 3.2, 21], alvo: [0, 2.6, 0] },
      aplicar(lt, b) {
        E.tremor = 1.1;
        E.isolado = lt > b.palavra('borracha') - 0.2;
        E.topo = E.isolado ? 0.25 : 1.2;
      },
      camada: (lt, b) => cartao(lt, b.palavra('borracha') + 0.3, 'ISOLADORES', 'BORRACHA E AÇO EM CAMADAS'),
    },
    {
      fala: 'Esses são os isoladores sísmicos. É por isso que, no Japão, tem prédio onde a pessoa lá dentro quase nem sente o terremoto.',
      destaque: ['isoladores', 'sísmicos', 'Japão'],
      corte: true,
      camera: { pos: [-2, 9, 34], alvo: [0, 8, 0] },
      cameraFim: { pos: [-4, 28, 70], alvo: [0, 30, 0] },
      aplicar() {
        Object.assign(E, { tremor: 1.1, isolado: true, topo: 0.25 });
      },
      camada: (lt, b) => ok(lt, b.palavra('terremoto')),
    },
    {
      fala: 'Agora pode tremer. Parabéns: você construiu um prédio à prova de terremoto!',
      destaque: ['tremer', 'parabéns', 'terremoto'],
      corteSeco: true,
      camera: { pos: [PX + 4, 5, PZ + 22], alvo: [0, 24, 0] },
      cameraFim: { pos: [PX + 8, 12, PZ + 70], alvo: [0, 30, 0] },
      aplicar(lt, b) {
        Object.assign(E, { tremor: 1, isolado: true, amortecedor: true, topo: 0.4 });
        voce.position.set(PX, 0.18, PZ);
        voce.rotation.y = -0.3;
        const festa = lt > b.palavra('parabens') - 0.2;
        voce.estado = { bracos: festa ? 'cima' : 'normal', expr: 'feliz', pulo: festa ? 1 : 0 };
      },
    },
    {
      fala: FALA_FINAL,
      semLegenda: true,
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) {
        Object.assign(E, { tremor: 0, topo: 0 });
        apresentar(lt, b, lt > 2.4 ? 'aponta' : 'aceno');
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
