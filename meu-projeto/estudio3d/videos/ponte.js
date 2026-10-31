// VÍDEO: "Como uma ponte aguenta um caminhão sem cair?"
// Formato: construção passo a passo em 2ª pessoa ("Então você põe..."), câmera
// contínua, legenda palavra por palavra, cartões com números.
//
// Números conferidos:
//  - Viga com carga no meio: flecha ∝ vão³ (δ = P·L³ / 48·E·I) → vão 3x menor = 27x menos envergadura.
//  - Erosão em volta dos pilares (socavação) é uma das maiores causas de queda de pontes.
//  - Concreto dilata ~0,000012 por °C → 100 m × 30 °C = 3,6 cm.

import * as THREE from 'three';
import { suave, saida, mistura, lim, cartao, etiqueta, ok, som, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, cilindro, malha, em, terreno, agua, ruido, arvore, casa, caminhao, carro, respingos } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';

export const config = {
  titulo: ['COMO UMA *PONTE*', 'AGUENTA UM *CAMINHÃO*', 'SEM CAIR?'],
};

// ---------- medidas (1 unidade = 1 metro) ----------
const FUNDO = -6;          // leito do rio
const MARGEM = 7.35;       // topo das margens = topo da pista
const AREIA_BASE = -16;    // fim da areia, começo da rocha
const ROCHA_BASE = -44;
const PX = 26 / 3;         // posição dos pilares: x = ±8,67 (3 vãos iguais)
const Y_LAJE = 6.6;        // centro das lajes de concreto
const PISTA = 7.35;        // topo do asfalto
const VAO = 52 / 3;

function perfil(x) {
  const a = Math.abs(x);
  if (a < 16) return FUNDO;
  if (a < 24) return mistura(FUNDO, MARGEM, suave((a - 16) / 8));
  return MARGEM;
}
function altura(x, z) {
  const a = Math.abs(x);
  let h = perfil(x);
  h += Math.max(0, a - 80) * 0.5 + lim((a - 80) / 40) * ruido(x * 0.6, z * 0.6) * 10;
  if (a > 27) h += ruido(x, z) * 0.9 * lim((Math.abs(z) - 9) / 10);
  return h;
}
function corTerreno(y, incl, x, z) {
  if (y < -1) return '#B79C64';
  if (y < 1.3) return '#D9C68E';
  if (incl < 0.78) return '#8E8F8A';
  const r = ruido(x * 3.1, z * 2.7);
  return r > 0.35 ? '#5DB13F' : r < -0.35 ? '#78C850' : '#6CBF47';
}

export function criar(ctx) {
  const { cena, cortavel } = ctx;
  const C = (cor, extra = {}) => cortavel(mat(cor, { cortavel: true, ...extra }));

  // ---------- cenário ----------
  cena.add(terreno(altura, corTerreno, { material: C('#ffffff', { vertexColors: true }) }));
  const superficie = agua(46, 600, C('#2C86E0', { opacidade: 0.9, brilho: true, unico: true }));
  cena.add(superficie);

  const solSky = new THREE.Mesh(new THREE.IcosahedronGeometry(14, 1), mat('#FFE27A', { emissivo: '#FFB800', semNeblina: true }));
  solSky.position.set(80, 140, -260);
  cena.add(solSky);

  // estradas nas margens
  const asfalto = mat('#3A3D44');
  for (const s of [-1, 1]) {
    cena.add(caixa(110, 0.08, 8, asfalto, [s * 79, MARGEM + 0.04, 0]));
    for (let x = 27; x < 134; x += 5) cena.add(caixa(2.2, 0.02, 0.2, mat('#F4F4F4'), [s * x, MARGEM + 0.09, 0]));
  }

  // cidade do outro lado + casa do personagem
  const casas = [[38, 16, Math.PI], [48, 18, Math.PI], [60, 15, Math.PI], [72, 17, Math.PI], [40, -15, 0], [53, -16, 0], [66, -14, 0], [80, -17, 0], [45, 32, Math.PI], [62, 33, Math.PI], [50, -32, 0], [70, -31, 0]];
  const paredes = ['#F3EBDD', '#FBE3B5', '#DCEBF7', '#F6D6CF'];
  casas.forEach(([x, z, r], i) => cena.add(casa(x, MARGEM, z, r, paredes[i % 4], i % 3 ? '#D9502F' : '#B8432B', cortavel)));
  cena.add(casa(-40, MARGEM, 15, Math.PI, '#FBE3B5', '#D9502F', cortavel));
  const arvores = [[-50, 24], [-58, 12], [-46, -16], [-34, -20], [-62, -22], [-28, -40], [-70, 30], [34, 26], [56, 26], [86, 24], [44, -24], [92, -22], [30, -30], [-40, 40], [70, 42], [-85, -10], [100, 5]];
  arvores.forEach(([x, z], i) => cena.add(arvore(x, altura(x, z) - 0.2, z, 0.9 + (i % 3) * 0.2, i, cortavel)));

  // ---------- vista em corte: água, areia e rocha ----------
  const extrudar = (pontos, cor) => {
    const forma = new THREE.Shape(pontos.map(([x, y]) => new THREE.Vector2(x, y)));
    const m = malha(new THREE.ExtrudeGeometry(forma, { depth: 300, bevelEnabled: false }), mat(cor, { unico: true }), { sombra: false });
    m.position.z = -300;
    m.visible = false;
    cena.add(m);
    return m;
  };
  const ptsAreia = [];
  for (let x = -150; x <= 150; x += 0.5) ptsAreia.push([x, altura(x, 0) - 0.06]);
  ptsAreia.push([150, AREIA_BASE], [-150, AREIA_BASE]);
  const ptsAgua = [[-20, 0], [20, 0]];
  for (let x = 20; x >= -20; x -= 0.5) ptsAgua.push([x, Math.min(0, perfil(x))]);
  const volumes = [
    extrudar(ptsAreia, '#CFAE72'),
    extrudar([[-150, AREIA_BASE], [150, AREIA_BASE], [150, ROCHA_BASE], [-150, ROCHA_BASE]], '#7C7F87'),
    extrudar(ptsAgua, '#2A78D4'),
  ];
  // trincas da rocha e grãos da areia (desenhados na face do corte)
  const detalhes = new THREE.Group();
  const linha = (x1, y1, x2, y2, cor, esp = 0.18) => {
    const dx = x2 - x1, dy = y2 - y1;
    const m = caixa(Math.hypot(dx, dy), esp, 0.05, mat(cor), [(x1 + x2) / 2, (y1 + y2) / 2, 0.03], { sombra: false });
    m.rotation.z = Math.atan2(dy, dx);
    detalhes.add(m);
  };
  for (const [x, y] of [[-30, -22], [-14, -30], [3, -20], [18, -27], [-4, -36], [30, -34], [-24, -38]]) {
    linha(x, y, x + 3, y - 2, '#4F525A'); linha(x + 3, y - 2, x + 5, y - 1.2, '#4F525A'); linha(x + 3, y - 2, x + 3.6, y - 4, '#4F525A');
  }
  for (let i = 0; i < 70; i++) {
    const x = -60 + ((i * 37) % 120), y = AREIA_BASE + 1 + ((i * 13) % 9);
    if (y < altura(x, 0) - 0.8) detalhes.add(caixa(0.35, 0.35, 0.05, mat('#B8955B'), [x, y, 0.03], { sombra: false }));
  }
  detalhes.visible = false;
  cena.add(detalhes);

  // buraco da erosão em volta do pilar esquerdo (desenhado na face do corte)
  const buracoMat = mat('#2A78D4', { unico: true });
  const buraco = new THREE.Mesh(new THREE.BufferGeometry(), buracoMat);
  buraco.position.z = 0.06;
  cena.add(buraco);
  function definirBuraco(k) {
    buraco.visible = k > 0.01;
    if (!buraco.visible) return;
    const forma = new THREE.Shape();
    const a = 1.5 + 3.5 * k, b = 0.2 + 3.6 * k;
    forma.moveTo(-PX - a, FUNDO + 0.01);
    for (let i = 0; i <= 24; i++) {
      const ang = Math.PI + (i / 24) * Math.PI;
      forma.lineTo(-PX + a * Math.cos(ang), FUNDO + 0.01 + b * Math.sin(ang));
    }
    buraco.geometry.dispose();
    buraco.geometry = new THREE.ShapeGeometry(forma);
  }

  // ---------- a ponte ----------
  const concreto = mat('#B9BCC2');
  // 1ª tentativa: uma viga só, de margem a margem (dobra e quebra)
  const vigaGeo = new THREE.BoxGeometry(52, 1.2, 8, 52, 1, 1);
  const vigaBase = Float32Array.from(vigaGeo.attributes.position.array);
  const viga = malha(vigaGeo, concreto);
  cena.add(viga);
  function curvar(flecha) {
    const p = vigaGeo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = vigaBase[i * 3];
      p.setY(i, vigaBase[i * 3 + 1] - flecha * (1 - (x / 26) ** 2));
    }
    p.needsUpdate = true;
    vigaGeo.computeVertexNormals();
  }
  const metades = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(s * 24, Y_LAJE, 0);
    g.add(caixa(26, 1.2, 8, concreto, [-s * 11, 0, 0]));
    cena.add(g);
    return g;
  });

  // pilares (com estacas e bloco de fundação)
  const pilares = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(s * PX, FUNDO, 0);
    g.add(caixa(2.4, 12, 6.4, concreto, [0, 6, 0]));
    g.add(caixa(3.4, 0.6, 8.2, mat('#A9ACB3'), [0, 11.7, 0]));
    const fundacao = new THREE.Group();
    fundacao.add(caixa(4.6, 1.3, 8.2, mat('#9EA2AA'), [0, -0.65, 0]));
    const estacas = [];
    for (const ex of [-1.3, 1.3]) {
      for (const ez of [-2.6, 2.6]) {
        const e = new THREE.Group();
        e.position.set(ex, -1.3, ez);
        e.add(cilindro(0.42, 18, mat('#6F7884', { metal: true }), [0, -9, 0]));
        fundacao.add(e);
        estacas.push(e);
      }
    }
    g.add(fundacao);
    g.fundacao = fundacao;
    g.estacas = estacas;
    cena.add(g);
    return g;
  });

  // lajes da pista (3 vãos)
  const lajes = [-1, 0, 1].map((k) => {
    const g = new THREE.Group();
    g.add(caixa(VAO, 1.2, 8, concreto, [0, 0, 0]));
    g.add(caixa(VAO, 0.15, 7.3, mat('#3A3D44'), [0, 0.675, 0]));
    for (const z of [-3.85, 3.85]) g.add(caixa(VAO, 0.9, 0.25, mat('#D5D8DE'), [0, 1.2, z]));
    for (let x = -VAO / 2 + 1.5; x < VAO / 2 - 1; x += 4) g.add(caixa(2, 0.02, 0.18, mat('#F4F4F4'), [x, 0.76, 0]));
    g.xBase = k * VAO;
    cena.add(g);
    return g;
  });

  // junta de dilatação entre a laje do meio e a da direita (x = +8,67)
  const metal = mat('#C3C9D2', { metal: true, brilho: true });
  const pente = (lado) => {
    const g = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const z = -3.3 + i * 0.6 + (lado > 0 ? 0.3 : 0);
      g.add(caixa(0.75, 0.12, 0.32, metal, [lado * -0.3, 0.69, z]));
    }
    g.add(caixa(0.5, 0.06, 7.3, metal, [lado * 0.1, 0.71, 0]));
    return g;
  };
  const penteEsq = pente(1);   // preso na laje do meio (ponta direita)
  penteEsq.position.x = VAO / 2 - 0.1;
  lajes[1].add(penteEsq);
  const penteDir = pente(-1);  // preso na laje da direita (ponta esquerda)
  penteDir.position.x = -VAO / 2 + 0.1;
  lajes[2].add(penteDir);
  // trincas no asfalto
  const trincas = new THREE.Group();
  const trinca = (x1, z1, x2, z2) => {
    const m = caixa(Math.hypot(x2 - x1, z2 - z1), 0.04, 0.12, mat('#111111'), [(x1 + x2) / 2, PISTA + 0.35, (z1 + z2) / 2], { sombra: false });
    m.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
    trincas.add(m);
  };
  [[7.2, -3, 7.8, -2], [7.8, -2, 7.4, -0.8], [7.4, -0.8, 8.1, 0.6], [8.1, 0.6, 7.6, 2.2], [9.6, -2.6, 10.2, -1.4], [10.2, -1.4, 9.7, 0.2], [9.7, 0.2, 10.4, 1.8]].forEach((t) => trinca(...t));
  cena.add(trincas);

  // ---------- veículos, personagem, efeitos ----------
  const cam = caminhao();
  cena.add(cam);
  const auto = carro('#2F6FE0');
  cena.add(auto);
  const splash = respingos(40, '#E8F6FF', [0, 0.5, 1.7], { vel: 10 });
  cena.add(splash);
  const voce = criarPersonagem();
  voce.scale.setScalar(0.92);
  cena.add(voce);

  const corCeuNormal = new THREE.Color('#8CCFFF'), corCeuCalor = new THREE.Color('#FFC27A');
  function calor(k) {
    cena.background.copy(corCeuNormal).lerp(corCeuCalor, k);
    cena.fog.color.set('#CDEBFF').lerp(new THREE.Color('#FFE0B5'), k);
    ctx.hemi.color.set('#ffffff').lerp(new THREE.Color('#FFD9A8'), k);
    solSky.scale.setScalar(1 + 1.2 * k);
    solSky.position.set(mistura(80, 30, k), mistura(140, 70, k), mistura(-260, -200, k));
  }

  function inicial() {
    viga.visible = false;
    curvar(0);
    viga.position.set(0, Y_LAJE, 0);
    metades.forEach((m) => { m.visible = false; m.rotation.z = 0; });
    pilares.forEach((p, i) => {
      p.visible = false;
      p.scale.y = 0.001;
      p.position.y = FUNDO;
      p.rotation.z = 0;
      p.fundacao.visible = false;
      p.estacas.forEach((e) => (e.scale.y = 0.001));
    });
    lajes.forEach((l) => { l.visible = false; l.position.set(l.xBase, Y_LAJE, 0); l.rotation.z = 0; });
    penteEsq.visible = penteDir.visible = false;
    penteEsq.scale.setScalar(1);
    penteDir.scale.setScalar(1);
    trincas.visible = false;
    definirBuraco(0);
    cam.visible = true;
    cam.position.set(-46, PISTA + 0.03, 1.75);
    cam.rotation.set(0, 0, 0);
    cam.rodar(0);
    auto.visible = false;
    auto.corpo.position.y = 0;
    splash.em(-1);
    voce.position.set(-32, MARGEM, 6.4);
    voce.rotation.y = Math.PI / 2;
    voce.estado = { bracos: 'normal', expr: 'feliz', andar: 0, pulo: 0 };
    calor(0);
  }

  // Carro do "tum-tum": posição em função do tempo do bloco
  const VEL_CARRO = 8.5;
  const xCarro = (lt, b) => -14 + VEL_CARRO * Math.max(0, lt - (b.palavra('carro') - 0.9));
  const tempoEixo = (b, offset) => b.palavra('carro') - 0.9 + (PX - offset + 14) / VEL_CARRO;

  const blocos = [
    {
      fala: 'Como uma ponte aguenta um caminhão sem cair? Imagina: você mora de um lado do rio, e a cidade fica do outro.',
      destaque: ['ponte', 'caminhão', 'rio', 'cidade'],
      camera: { pos: [-37.5, 9.2, 9.8], alvo: [-12, 6.5, -2] },
      cameraFim: { pos: [-30, 32, 62], alvo: [6, 2, -4] },
    },
    {
      fala: 'Então você põe uma viga de concreto atravessada no rio.',
      destaque: ['viga', 'concreto'],
      camera: { pos: [0, 15, 58], alvo: [0, 4, 0] },
      aplicar(lt, b) {
        viga.visible = true;
        viga.position.y = mistura(42, Y_LAJE, saida((lt - b.palavra('viga')) / 1.2));
      },
      sons: [{ em: (b) => b.palavra('viga') + 1.0, tipo: 'baque' }],
    },
    {
      fala: 'Mas quando o caminhão passa, a viga enverga no meio... e quebra!',
      destaque: ['enverga', 'quebra'],
      camera: { pos: [3, 11, 42], alvo: [0, 4, 0] },
      aplicar(lt, b) {
        const tc = b.palavra('caminhao'), te = b.palavra('enverga'), tq = b.palavra('quebra');
        const x = mistura(-46, 0, suave((lt - tc + 0.6) / (te - tc + 0.9)));
        const flecha = 2.2 * suave((lt - te) / Math.max(0.3, tq - te));
        cam.position.x = x;
        cam.rodar(x + 46);
        if (lt < tq) {
          viga.visible = true;
          curvar(flecha);
          const naViga = Math.abs(x) < 26 ? flecha * (1 - (x / 26) ** 2) : 0;
          cam.position.y = (Math.abs(x) < 26 ? Y_LAJE + 0.6 : PISTA + 0.03) - naViga;
        } else {
          viga.visible = false;
          const k = saida((lt - tq) / 0.7);
          metades[0].visible = metades[1].visible = true;
          metades[0].rotation.z = -0.55 * k;
          metades[1].rotation.z = 0.55 * k;
          const kc = suave((lt - tq) / 0.8);
          cam.position.y = Y_LAJE + 0.6 - flecha - 8.5 * kc;
          cam.rotation.z = -0.3 * kc;
          splash.em(lt - tq - 0.45);
        }
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('enverga'), 'ENVERGANDO'),
      sons: [{ em: 'quebra', tipo: 'quebra' }, { em: 'quebra', depois: 0.5, tipo: 'splash' }],
    },
    {
      fala: 'Então você põe pilares no meio do rio, pra segurar a viga em pedaços menores. Esses são os pilares.',
      destaque: ['pilares', 'menores'],
      camera: { pos: [0, 19, 54], alvo: [0, 3, 0] },
      aplicar(lt, b) {
        viga.visible = false;
        metades.forEach((m) => (m.visible = false));
        splash.em(-1);
        cam.position.set(-46, PISTA + 0.03, 1.75);
        cam.rotation.set(0, 0, 0);
        const tp = b.palavra('pilares'), ts = b.palavra('segurar');
        pilares.forEach((p) => { p.visible = true; p.scale.y = Math.max(0.001, saida((lt - tp) / 1.0)); });
        lajes.forEach((l, k) => {
          const ini = ts + k * 0.35;
          l.visible = lt > ini;
          l.position.y = mistura(34, Y_LAJE, saida((lt - ini) / 0.9));
        });
      },
      camada: (lt, b) => cartao(lt, b.palavra('menores'), '27x', 'MENOS ENVERGADURA COM UM VÃO 3x MENOR'),
      sons: [0, 0.35, 0.7].map((d) => ({ em: (b) => b.palavra('segurar') + d + 0.75, tipo: 'baque' })),
    },
    {
      fala: 'Mas a correnteza bate no pilar e vai cavando a areia em volta dele.',
      destaque: ['correnteza', 'cavando'],
      corte: true,
      camera: { pos: [-8.7, -1.5, 30], alvo: [-8.7, -5.5, 0] },
      aplicar(lt, b) { definirBuraco(suave((lt - b.palavra('cavando')) / 2.2)); },
      camada: (lt, b) => etiqueta(lt, b.palavra('cavando'), 'EROSÃO'),
    },
    {
      fala: 'Sem areia embaixo, o pilar afunda, entorta, e leva a ponte junto.',
      destaque: ['afunda', 'entorta'],
      corte: true,
      camera: { pos: [-5, 1, 42], alvo: [-5, -2.5, 0] },
      aplicar(lt, b) {
        const k = suave((lt - b.palavra('afunda')) / 1.4);
        const p = pilares[0];
        p.rotation.z = 0.12 * k;
        p.position.y = FUNDO - 1.6 * k;
        const ang = Math.atan(1.6 / VAO) * k;
        lajes[0].rotation.z = -ang;
        lajes[0].position.y = Y_LAJE - 0.8 * k;
        lajes[1].rotation.z = ang;
        lajes[1].position.y = Y_LAJE - 0.8 * k;
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('afunda'), 'AFUNDANDO'),
      sons: [{ em: 'afunda', tipo: 'rachando' }],
    },
    {
      fala: 'Então você crava estacas de aço bem fundo, passando da areia, até chegar na rocha.',
      destaque: ['estacas', 'rocha'],
      corte: true,
      camera: { pos: [-8.7, -10, 50], alvo: [-8.7, -13, 0] },
      aplicar(lt, b) {
        definirBuraco(0);
        pilares[0].rotation.z = 0;
        pilares[0].position.y = FUNDO;
        lajes.forEach((l) => { l.rotation.z = 0; l.position.y = Y_LAJE; });
        const te = b.palavra('estacas'), tr = b.palavra('rocha');
        const k = saida((lt - te) / Math.max(1, tr - te + 0.3));
        pilares.forEach((p) => {
          p.fundacao.visible = lt > te - 0.3;
          p.estacas.forEach((e) => (e.scale.y = Math.max(0.001, k)));
        });
      },
      camada: (lt, b) => cartao(lt, b.palavra('rocha'), '18 m', 'DE ESTACA ABAIXO DO RIO'),
      sons: [0, 0.5, 1.0, 1.5].map((d) => ({ em: (b) => b.palavra('estacas') + d, tipo: 'martelo' })),
    },
    {
      fala: 'Essas são as fundações. Agora a água pode levar a areia, que o pilar não sai do lugar.',
      destaque: ['fundações', 'lugar'],
      corte: true,
      camera: { pos: [-8.7, -6, 40], alvo: [-8.7, -8.5, 0] },
      aplicar(lt, b) { definirBuraco(suave((lt - b.palavra('levar')) / 2)); },
      camada: (lt, b) => ok(lt, b.palavra('lugar')),
      sons: [{ em: 'lugar', tipo: 'ok' }],
    },
    {
      fala: 'Mas no verão, o sol esquenta o concreto, e a ponte cresce. Isso mesmo: ela estica!',
      destaque: ['sol', 'cresce', 'estica'],
      camera: { pos: [16, 11.5, 14], alvo: [PX, 7.2, 0] },
      transicao: 1.8,
      aplicar(lt, b) {
        definirBuraco(0);
        calor(suave((lt - b.palavra('sol')) / 1.5));
        const k = suave((lt - b.palavra('cresce')) / 1.0);
        lajes[1].rotation.z = 0.04 * k;
        lajes[1].position.y = Y_LAJE + 0.25 * k;
        lajes[2].rotation.z = -0.04 * k;
        lajes[2].position.y = Y_LAJE + 0.25 * k;
        trincas.visible = lt > b.palavra('estica');
      },
      camada: (lt, b) => cartao(lt, b.palavra('cresce'), '+3,6 cm', 'A CADA 100 m DE PONTE NUM DIA QUENTE') + etiqueta(lt, b.palavra('estica'), 'RACHANDO'),
      sons: [{ em: 'estica', tipo: 'rachando' }],
    },
    {
      fala: 'Então você deixa uma fresta entre os pedaços da pista, com dentes de metal que se encaixam.',
      destaque: ['fresta', 'dentes'],
      camera: { pos: [12.6, 10.2, 7.8], alvo: [PX, 7.3, 0] },
      aplicar(lt, b) {
        calor(1 - suave(lt / 1.2));
        trincas.visible = false;
        lajes.forEach((l) => { l.rotation.z = 0; l.position.y = Y_LAJE; });
        const tf = b.palavra('fresta'), td = b.palavra('dentes');
        const vai = suave((lt - tf) / 0.8);
        const respira = lt > td + 0.8 ? 0.16 * Math.sin((lt - td - 0.8) * 2.6) : 0;
        lajes[1].position.x = -(0.35 + respira) * vai;
        lajes[2].position.x = lajes[2].xBase + (0.35 + respira) * vai;
        penteEsq.visible = penteDir.visible = lt > td;
        const kd = Math.max(0.01, saida((lt - td) / 0.5));
        penteEsq.scale.set(1, kd, 1);
        penteDir.scale.set(1, kd, 1);
      },
    },
    {
      fala: 'Essa é a junta de dilatação. É por isso que, quando você passa de carro numa ponte, sente aquele tum-tum.',
      destaque: ['junta', 'dilatação', 'tum-tum'],
      camera: (lt, b) => {
        const x = Math.min(xCarro(lt, b), 22);
        return { pos: [x - 9, 11.5, 14], alvo: [x + 3, 7.4, 1.0] };
      },
      transicao: 1.6,
      aplicar(lt, b) {
        lajes[1].position.x = -0.35;
        lajes[2].position.x = lajes[2].xBase + 0.35;
        penteEsq.visible = penteDir.visible = true;
        penteEsq.scale.setScalar(1);
        penteDir.scale.setScalar(1);
        const x = xCarro(lt, b);
        auto.visible = true;
        auto.position.set(x, PISTA + 0.03, 1.75);
        auto.rodar(x);
        const bump = [1.3, -1.3].reduce((s, o) => s + Math.max(0, 1 - Math.abs(x + o - PX) / 0.5), 0);
        auto.corpo.position.y = 0.14 * bump;
        auto.corpo.rotation.z = 0.02 * bump;
      },
      camada: (lt, b) => som(lt, tempoEixo(b, 1.3), 'TUM-TUM!', 1.1),
      sons: [{ em: (b) => tempoEixo(b, 1.3), tipo: 'tum' }, { em: (b) => tempoEixo(b, -1.3), tipo: 'tum' }],
    },
    {
      fala: 'Agora pode passar o caminhão. Parabéns: você construiu uma ponte!',
      destaque: ['caminhão', 'parabéns', 'ponte'],
      camera: { pos: [-44, 13, 28], alvo: [-18, 7, 0] },
      cameraFim: { pos: [-14, 40, 86], alvo: [4, 3, 0] },
      aplicar(lt, b) {
        auto.visible = false;
        const x = mistura(-46, 80, suave(lt / b.dur) * 0.85 + (lt / b.dur) * 0.15);
        cam.position.x = x;
        cam.rodar(x + 46);
        voce.rotation.y = mistura(Math.PI / 2, Math.PI * 0.2, suave(lt / 1));
        if (lt > b.palavra('parabens') - 0.2) voce.estado = { bracos: 'cima', expr: 'feliz', pulo: 1 };
      },
    },
    {
      fala: FALA_FINAL,
      semLegenda: true,
      camera: { pos: [-32, 8.95, 10.6], alvo: [-32, 8.55, 6.4] },
      transicao: 1.6,
      aplicar(lt) {
        cam.visible = false;
        voce.rotation.y = 0;
        voce.estado = { bracos: lt > 2.2 ? 'aponta' : 'aceno', expr: 'feliz', pulo: 0 };
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
      buraco.visible = buraco.visible && corte;
      voce.animar(t);
    },
  };
}
