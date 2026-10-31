// VÍDEO: "Como a água chega limpinha na sua torneira?"
//
// Números/fatos conferidos:
//  - Tratamento convencional: coagulação/floculação (sulfato de alumínio junta a sujeira em flocos),
//    decantação (flocos afundam), filtração (areia + cascalho), desinfecção com cloro.
//  - Pressão da água: cada 10 m de altura de água ≈ 1 atmosfera (≈ 1 kgf/cm²).
//  - Por isso reservatórios ficam no alto e a caixa d'água das casas fica no telhado.

import * as THREE from 'three';
import { suave, saida, mistura, lim, cartao, etiqueta, ok, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, cilindro, malha, terreno, agua, ruido, arvore, casa, cano, fluxo, tanque } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';

export const config = {
  titulo: ['COMO A *ÁGUA* CHEGA', 'LIMPINHA NA SUA', '*TORNEIRA*?'],
};

const FUNDO = -6, MARGEM = 7.35;
const TORRE_X = -118;
const morroTorre = (x, z) => 18 * Math.exp(-((x - TORRE_X) ** 2 + z ** 2) / (2 * 16 ** 2));

function perfil(x) {
  const a = Math.abs(x);
  if (a < 16) return FUNDO;
  if (a < 24) return mistura(FUNDO, MARGEM, suave((a - 16) / 8));
  return MARGEM;
}
function altura(x, z) {
  const a = Math.abs(x);
  let h = perfil(x);
  if (x > 0) h += Math.max(0, a - 80) * 0.5 + lim((a - 80) / 40) * ruido(x * 0.6, z * 0.6) * 10;
  else h += Math.max(0, a - 150) * 0.5;
  if (a > 27 && !(x < -40 && x > -100 && Math.abs(z) < 12)) h += ruido(x, z) * 0.6 * lim((Math.abs(z) - 6) / 10);
  if (x < -90) h += morroTorre(x, z);
  return h;
}
function corTerreno(y, incl, x, z) {
  if (y < -1) return '#B79C64';
  if (y < 1.3) return '#D9C68E';
  if (incl < 0.78) return '#8E8F8A';
  const r = ruido(x * 3.1, z * 2.7);
  return r > 0.35 ? '#5DB13F' : r < -0.35 ? '#78C850' : '#6CBF47';
}
const chao = (x, z) => altura(x, z);

export function criar(ctx) {
  const { cena, cortavel } = ctx;
  const C = (cor, extra = {}) => cortavel(mat(cor, { cortavel: true, ...extra }));

  // ---------- cenário ----------
  cena.add(terreno(altura, corTerreno, { material: C('#ffffff', { vertexColors: true }) }));
  const rio = agua(46, 600, C('#5F9488', { opacidade: 0.92, brilho: true, unico: true }));
  cena.add(rio);
  const solCeu = new THREE.Mesh(new THREE.IcosahedronGeometry(14, 1), mat('#FFE27A', { emissivo: '#FFB800', semNeblina: true }));
  solCeu.position.set(80, 140, -260);
  cena.add(solCeu);

  // solo para a vista em corte
  const pts = [];
  for (let x = -160; x <= 150; x += 0.5) pts.push([x, altura(x, 0) - 0.06]);
  pts.push([150, -30], [-160, -30]);
  const solo = malha(new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y))), { depth: 300, bevelEnabled: false }), mat('#B9915A', { unico: true }), { sombra: false });
  solo.position.z = -300;
  solo.visible = false;
  cena.add(solo);

  // cidade (lado esquerdo) — casas com caixa d'água azul no telhado
  const casas = [];
  const posCasas = [[-48, 30, Math.PI], [-60, 31, Math.PI], [-72, 29, Math.PI], [-84, 31, Math.PI], [-52, -26, 0], [-66, -27, 0], [-80, -25, 0], [-56, 44, Math.PI], [-74, 45, Math.PI], [-62, -40, 0]];
  const paredes = ['#F3EBDD', '#FBE3B5', '#DCEBF7', '#F6D6CF'];
  posCasas.forEach(([x, z, r], i) => {
    const c = casa(x, chao(x, z), z, r, paredes[i % 4], i % 3 ? '#D9502F' : '#B8432B', cortavel);
    const cx = cilindro(0.95, 1.2, C('#2E6FD8'), [1.2, 6.3, 0.6], 10);
    c.add(cx);
    c.caixa = cx;
    cena.add(c);
    casas.push(c);
  });
  const arvores = [[-30, 34], [-40, 46], [-96, 20], [-100, -30], [-34, -36], [-44, -46], [40, 20], [55, -22], [70, 30], [36, -40], [-140, 30], [-138, -28], [-92, 50], [62, 50]];
  arvores.forEach(([x, z], i) => cena.add(arvore(x, chao(x, z) - 0.2, z, 0.9 + (i % 3) * 0.2, i, cortavel)));

  // ---------- torneira do personagem ----------
  const TX = -36, TZ = 18;
  const torneira = new THREE.Group();
  torneira.position.set(TX, MARGEM, TZ);
  torneira.add(caixa(0.35, 1.9, 0.35, C('#C9CCD2'), [0, 0.95, 0]));
  torneira.add(caixa(0.18, 0.18, 0.7, C('#B9C0CA', { metal: true }), [0, 1.75, 0.35]));
  torneira.add(caixa(1.2, 0.8, 1.2, C('#8C6B4F'), [0, 0.4, 0.8]));
  const copo = new THREE.Group();
  copo.position.set(0, 0.8, 0.7);
  copo.add(malha(new THREE.CylinderGeometry(0.22, 0.18, 0.5, 12, 1, true), C('#E8F6FF', { opacidade: 0.4, duplo: true, unico: true }), { sombra: false }));
  const aguaCopo = malha(new THREE.CylinderGeometry(0.2, 0.17, 1, 12), C('#8A6A3A', { unico: true }), { sombra: false });
  copo.add(aguaCopo);
  torneira.add(copo);
  const jato = cilindro(0.05, 0.9, C('#8A6A3A', { unico: true }), [0, 1.2, 0.7], 6);
  jato.castShadow = false;
  torneira.add(jato);
  cena.add(torneira);
  function copoCom(nivel, cor, jorrando) {
    aguaCopo.visible = nivel > 0.02;
    aguaCopo.scale.y = Math.max(0.01, nivel * 0.45);
    aguaCopo.position.y = -0.23 + (nivel * 0.45) / 2;
    aguaCopo.material.color.set(cor);
    jato.visible = jorrando;
    jato.material.color.set(cor);
  }

  // ---------- canos ----------
  const metalCano = C('#9AA3AE', { metal: true });
  const azulCano = C('#3E7BD6');
  const M = MARGEM + 0.6;
  const canoDireto = cano([[-18, -0.4, -6], [-24, M, -6], [-24, M, TZ - 1], [TX, M, TZ - 1], [TX, MARGEM + 1.75, TZ - 0.2]], 0.35, metalCano);
  const fluxoDireto = fluxo(canoDireto, 26, '#8A6A3A', 5);
  // rio -> estação
  const canoEstacao = cano([[-18, -0.4, -8], [-24, M, -8], [-46, M, -8], [-46, MARGEM + 5.6, -8], [-48.5, MARGEM + 5.6, -8], [-48.5, MARGEM + 5.6, -3]], 0.4, metalCano);
  const fluxoEstacao = fluxo(canoEstacao, 24, '#8A6A3A', 5);
  const bomba = new THREE.Group();
  bomba.add(caixa(4, 3, 4, C('#E9E2D0'), [0, 1.5, 0]));
  bomba.add(caixa(4.4, 0.5, 4.4, C('#3E7BD6'), [0, 3.2, 0]));
  bomba.position.set(-27.5, MARGEM, -12);
  cena.add(canoDireto, fluxoDireto, canoEstacao, fluxoEstacao, bomba);

  // ---------- estação de tratamento (3 tanques em linha, centrados em z = 0) ----------
  const tA = tanque(-56, MARGEM, 14, 5.5, 10, cortavel); // floculação + decantação
  const tB = tanque(-71, MARGEM, 10, 6, 10, cortavel);   // filtro
  const tC = tanque(-84, MARGEM, 9, 5, 10, cortavel);    // cloro
  cena.add(tA, tB, tC);
  const ligacoes = [cano([[-49.6 - 13, MARGEM + 5.9, -3], [-49.6 - 13, MARGEM + 6.4, -3], [-66, MARGEM + 6.4, -3], [-66, MARGEM + 5.9, -3]], 0.3, metalCano),
    cano([[-76, MARGEM + 1, -5.3], [-76, MARGEM + 0.6, -6.2], [-79.5, MARGEM + 0.6, -6.2], [-79.5, MARGEM + 4, -5.3]], 0.3, metalCano)];
  cena.add(...ligacoes);
  const estacao = [tA, tB, tC, ...ligacoes];

  // flocos de sujeira (tanque A, metade de trás)
  const flocos = [];
  for (let i = 0; i < 60; i++) {
    const m = caixa(0.35, 0.35, 0.35, mat('#5E3F22'), [0, 0, 0], { sombra: false });
    flocos.push({ m, x: -62 + ((i * 7.31) % 12), y: MARGEM + 1 + ((i * 1.37) % 3.8), z: -0.5 - ((i * 0.93) % 4), g: i % 6 });
    cena.add(m);
  }
  // camadas do filtro (tanque B): cascalho e areia
  const filtro = new THREE.Group();
  const larB = tB.interno.larg, profB = tB.interno.prof / 2;
  filtro.add(caixa(larB, 1.3, profB, mat('#8C8C8C'), [-71, MARGEM + 0.4 + 0.65, -profB / 2], { sombra: false }));
  filtro.add(caixa(larB, 1.6, profB, mat('#E3C98F'), [-71, MARGEM + 1.7 + 0.8, -profB / 2], { sombra: false }));
  for (let i = 0; i < 30; i++) filtro.add(caixa(0.3, 0.25, 0.05, mat(i % 2 ? '#6F6F6F' : '#C9AE76'), [-75.5 + ((i * 3.1) % 9), MARGEM + 0.6 + ((i * 0.47) % 2.9), 0.03], { sombra: false }));
  cena.add(filtro);
  const gotas = [];
  for (let i = 0; i < 18; i++) {
    const m = caixa(0.25, 0.25, 0.25, mat('#9ED8FF', { emissivo: '#2A6FA8' }), [0, 0, 0], { sombra: false });
    gotas.push({ m, x: -75 + ((i * 2.3) % 8), z: -0.6 - ((i * 0.7) % 3.5), fase: (i * 0.37) % 1 });
    cena.add(m);
  }
  // germes e cloro (tanque C)
  const germes = [];
  for (let i = 0; i < 16; i++) {
    const m = malha(new THREE.IcosahedronGeometry(0.32, 0), mat('#4FD04F', { emissivo: '#1E6B1E' }), { sombra: false });
    germes.push({ m, x: -87.5 + ((i * 2.9) % 7), y: MARGEM + 1 + ((i * 0.83) % 3), z: -0.6 - ((i * 1.1) % 3.6) });
    cena.add(m);
  }
  const cloro = new THREE.Group();
  cloro.add(cilindro(0.9, 2.2, C('#E8E05A'), [0, 1.1, 0], 12));
  cloro.add(caixa(0.5, 0.3, 0.5, C('#555B66'), [0, 2.35, 0]));
  cloro.position.set(-84, MARGEM + 5, -3.2);
  cena.add(cloro);
  const pingos = [0, 1, 2].map(() => {
    const m = caixa(0.2, 0.3, 0.2, mat('#D7E85A', { emissivo: '#6B7A00' }), [0, 0, 0], { sombra: false });
    cena.add(m);
    return m;
  });

  // ---------- caixa d'água no morro ----------
  const topoMorro = chao(TORRE_X, 0);
  const torre = new THREE.Group();
  torre.position.set(TORRE_X, topoMorro, 0);
  for (const [x, z] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) torre.add(caixa(0.6, 12, 0.6, C('#C9CCD2'), [x, 6, z]));
  torre.add(caixa(7, 0.4, 0.4, C('#C9CCD2'), [0, 6, 3]));
  torre.add(caixa(7, 0.4, 0.4, C('#C9CCD2'), [0, 6, -3]));
  torre.add(malha(new THREE.CylinderGeometry(5, 5, 7, 20, 1, true), C('#E9EEF4', { duplo: true }), {}));
  torre.children[torre.children.length - 1].position.y = 15.5;
  const fundoTorre = cilindro(5, 0.4, C('#C9CCD2'), [0, 12.2, 0], 20);
  torre.add(fundoTorre);
  const tampaTorre = malha(new THREE.ConeGeometry(5.3, 2, 20), C('#3E7BD6'));
  tampaTorre.position.y = 20;
  torre.add(tampaTorre);
  const aguaTorre = malha(new THREE.CylinderGeometry(4.8, 4.8, 1, 20, 1, false, Math.PI / 2, Math.PI), mat('#5FB2E8', { duplo: true, unico: true }), { sombra: false });
  torre.add(aguaTorre);
  cena.add(torre);
  function nivelTorre(k) {
    aguaTorre.visible = k > 0.01;
    aguaTorre.scale.y = Math.max(0.01, 6.4 * k);
    aguaTorre.position.y = 12.4 + (6.4 * k) / 2;
  }
  const ptsSobe = [[-90, M, -6]];
  for (let x = -94; x >= TORRE_X + 4; x -= 4) ptsSobe.push([x, chao(x, -6) + 0.6, -6]);
  ptsSobe.push([TORRE_X + 2, topoMorro + 0.6, -6], [TORRE_X + 2, topoMorro + 13, -6], [TORRE_X + 2, topoMorro + 13, -3.5]);
  const canoTorre = cano([[-88.5, MARGEM + 1, -4], [-90, M, -6], ...ptsSobe.slice(1)], 0.4, azulCano);
  const fluxoTorre = fluxo(canoTorre, 30, '#9ED8FF', 6);
  const ptsDesce = [[TORRE_X - 2, topoMorro + 13, 3.5], [TORRE_X - 2, topoMorro + 0.6, 6]];
  for (let x = TORRE_X + 2; x <= -96; x += 4) ptsDesce.push([x, chao(x, 6) + 0.6, Math.min(TZ - 1, 6 + (x - TORRE_X) * 0.5)]);
  ptsDesce.push([-92, M, TZ - 1], [TX, M, TZ - 1], [TX, MARGEM + 1.75, TZ - 0.2]);
  const canoCidade = cano(ptsDesce, 0.4, azulCano);
  const fluxoCidade = fluxo(canoCidade, 50, '#9ED8FF', 9);
  cena.add(canoTorre, fluxoTorre, canoCidade, fluxoCidade);

  // ---------- personagem ----------
  const voce = criarPersonagem();
  voce.scale.setScalar(0.92);
  cena.add(voce);
  const PX = TX + 1.3, PZ = TZ + 1.6;

  function inicial() {
    canoDireto.crescer(0); fluxoDireto.visible = false;
    canoEstacao.crescer(0); fluxoEstacao.visible = false;
    bomba.visible = false;
    estacao.forEach((o) => (o.visible = false));
    tA.corAgua('#8A6A3A'); tB.corAgua('#9CC7D8'); tC.corAgua('#7CC4F0');
    flocos.forEach((f) => (f.m.visible = false));
    filtro.visible = false;
    gotas.forEach((g) => (g.m.visible = false));
    germes.forEach((g) => (g.m.visible = false));
    cloro.visible = false;
    pingos.forEach((p) => (p.visible = false));
    torre.visible = false;
    torre.scale.y = 1;
    nivelTorre(0);
    canoTorre.crescer(0); fluxoTorre.visible = false;
    canoCidade.crescer(0); fluxoCidade.visible = false;
    copoCom(0, '#8A6A3A', false);
    voce.position.set(-30, MARGEM, 4);
    voce.rotation.y = Math.PI / 2;
    voce.estado = { bracos: 'normal', expr: 'feliz', andar: 0, pulo: 0 };
    rio.material.color.set('#5F9488');
  }
  const naTorneira = (estado, rot = -Math.PI / 4) => {
    voce.position.set(PX, MARGEM, PZ);
    voce.rotation.y = rot;
    voce.estado = estado;
  };

  const blocos = [
    {
      fala: 'Como a água chega limpinha na sua torneira? Imagina: você mora numa cidade, e a única água por perto é a do rio.',
      destaque: ['água', 'torneira', 'rio'],
      camera: { pos: [-36, 11.2, 8.2], alvo: [-6, 2.5, -4] },
      cameraFim: { pos: [-62, 38, 74], alvo: [-40, 4, -4] },
    },
    {
      fala: 'Então você puxa a água do rio com uma bomba, e manda por um cano direto pra sua casa.',
      destaque: ['bomba', 'cano'],
      camera: { pos: [-12, 15, 36], alvo: [-28, 7, 4] },
      aplicar(lt, b) {
        bomba.visible = lt > b.palavra('bomba') - 0.3;
        bomba.scale.setScalar(Math.max(0.01, saida((lt - b.palavra('bomba') + 0.3) / 0.4)));
        const k = suave((lt - b.palavra('cano')) / 1.6);
        canoDireto.crescer(k);
        fluxoDireto.visible = k > 0.05;
        fluxoDireto.em(lt, k);
      },
    },
    {
      fala: 'Mas a água do rio é barrenta, cheia de terra e de bichinhos que você nem consegue ver.',
      destaque: ['barrenta', 'bichinhos'],
      camera: { pos: [TX + 1.9, MARGEM + 2.4, TZ + 7], alvo: [TX + 0.9, MARGEM + 1.2, TZ + 0.9] },
      transicao: 1.6,
      aplicar(lt, b) {
        canoDireto.crescer(1);
        fluxoDireto.visible = true;
        fluxoDireto.em(lt + 10);
        copoCom(suave(lt / 2.2), '#8A6A3A', lt < 2.4);
        naTorneira({ bracos: lt > b.palavra('barrenta') ? 'cabeca' : 'normal', expr: lt > b.palavra('barrenta') ? 'preocupado' : 'feliz' });
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('barrenta'), 'ÁGUA SUJA'),
    },
    {
      fala: 'Então você leva a água pra um tanque, e mistura um pó que faz a sujeira grudar em bolinhas.',
      destaque: ['tanque', 'bolinhas'],
      corte: true,
      camera: { pos: [-57, 11.8, 19], alvo: [-57, 10.2, -1] },
      transicao: 1.8,
      aplicar(lt, b) {
        canoDireto.crescer(0); fluxoDireto.visible = false;
        copoCom(0, '#8A6A3A', false);
        voce.position.set(-30, MARGEM, 4);
        voce.rotation.y = Math.PI / 2;
        voce.estado = { bracos: 'normal', expr: 'feliz' };
        bomba.visible = true; bomba.scale.setScalar(1);
        const tt = b.palavra('tanque');
        tA.visible = lt > tt - 0.4;
        tA.scale.y = Math.max(0.01, saida((lt - tt + 0.4) / 0.6));
        const k = suave((lt - tt) / 1.2);
        canoEstacao.crescer(k);
        fluxoEstacao.visible = k > 0.05;
        fluxoEstacao.em(lt, k);
        const tb = b.palavra('bolinhas');
        const junta = suave((lt - b.palavra('sujeira')) / 1.6);
        flocos.forEach((f) => {
          f.m.visible = lt > b.palavra('mistura');
          const cx = -62 + f.g * 2.2, cy = MARGEM + 2.5 + (f.g % 2) * 1.2;
          f.m.position.set(mistura(f.x, cx + (f.x % 1), junta), mistura(f.y, cy + (f.y % 1) * 0.6, junta), f.z);
          f.m.scale.setScalar(1 + junta * 0.6);
        });
      },
    },
    {
      fala: 'As bolinhas ficam pesadas e afundam. Essa é a decantação.',
      destaque: ['afundam', 'decantação'],
      corte: true,
      camera: { pos: [-57, 11.4, 17], alvo: [-57, 9.8, -1] },
      aplicar(lt, b) {
        const k = suave((lt - b.palavra('afundam') + 0.3) / 2);
        flocos.forEach((f) => {
          const cx = -62 + f.g * 2.2 + (f.x % 1);
          const cy = MARGEM + 2.5 + (f.g % 2) * 1.2 + (f.y % 1) * 0.6;
          f.m.position.set(cx, mistura(cy, MARGEM + 0.6 + (f.y % 1) * 0.3, k), f.z);
        });
        tA.corAgua(new THREE.Color('#8A6A3A').lerp(new THREE.Color('#9CC7D8'), k).getStyle());
      },
    },
    {
      fala: 'Mas ainda sobra sujeira bem fininha. Então você passa a água por um filtro de areia e pedra.',
      destaque: ['fininha', 'filtro', 'areia'],
      corte: true,
      camera: { pos: [-71, 11.8, 18], alvo: [-71, 10.2, -1] },
      aplicar(lt, b) {
        const tf = b.palavra('filtro');
        tB.visible = filtro.visible = ligacoes[0].visible = lt > tf - 0.3;
        tB.scale.y = Math.max(0.01, saida((lt - tf + 0.3) / 0.6));
        tB.nivel(5.4);
        gotas.forEach((g) => {
          g.m.visible = lt > tf + 0.5;
          const u = ((lt * 0.5 + g.fase) % 1);
          g.m.position.set(g.x, MARGEM + 4.6 - u * 4.2, g.z);
          g.m.material.color.set(u > 0.35 ? '#BFF0FF' : '#9CC7D8');
        });
      },
    },
    {
      fala: 'Mas mesmo transparente, a água ainda pode ter germes. Então você põe cloro, que mata quase todos.',
      destaque: ['germes', 'cloro'],
      corte: true,
      camera: { pos: [-84, 11.8, 18], alvo: [-84, 10.4, -1] },
      aplicar(lt, b) {
        tC.visible = ligacoes[1].visible = true;
        const tg = b.palavra('germes'), tcl = b.palavra('cloro');
        const morre = suave((lt - tcl - 0.5) / 1.4);
        germes.forEach((g, i) => {
          g.m.visible = lt > tg - 0.2 && morre < 0.98;
          g.m.position.set(g.x + Math.sin(lt * 3 + i) * 0.25, g.y + Math.cos(lt * 2.5 + i) * 0.2, g.z);
          g.m.rotation.set(lt * 2 + i, lt * 1.5, 0);
          g.m.scale.setScalar(Math.max(0.01, (1 - morre) * saida((lt - tg + 0.2) / 0.4)));
        });
        cloro.visible = lt > tcl - 0.3;
        pingos.forEach((p, i) => {
          const u = ((lt - tcl) * 1.3 + i / 3) % 1;
          p.visible = lt > tcl;
          p.position.set(-84, MARGEM + 4.8 - u * 1.4, -3.2);
        });
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('germes'), 'GERMES') + ok(lt, b.palavra('todos')),
      sons: [{ em: 'todos', tipo: 'ok' }],
    },
    {
      fala: 'Essa é a estação de tratamento de água.',
      destaque: ['estação', 'tratamento'],
      camera: { pos: [-62, 24, 38], alvo: [-68, 7, -2] },
      transicao: 1.6,
      aplicar() {
        estacao.forEach((o) => { o.visible = true; o.scale.y = 1; });
        filtro.visible = true;
        flocos.forEach((f) => (f.m.visible = false));
        gotas.forEach((g) => (g.m.visible = false));
        pingos.forEach((p) => (p.visible = false));
        cloro.visible = true;
        tA.corAgua('#9CC7D8'); tB.corAgua('#B5E2F5'); tC.corAgua('#7CC4F0');
      },
    },
    {
      fala: 'Mas a água não sobe sozinha até as casas. Então você bombeia ela pra uma caixa d\'água bem no alto do morro.',
      destaque: ['sobe', 'caixa', 'alto'],
      corte: true,
      camera: { pos: [-112, 36, 46], alvo: [-118, 34, 0] },
      transicao: 1.8,
      aplicar(lt, b) {
        const tc = b.palavra('caixa');
        torre.visible = lt > tc - 0.5;
        torre.scale.y = Math.max(0.01, saida((lt - tc + 0.5) / 0.8));
        const k = suave((lt - b.palavra('bombeia')) / 1.5);
        canoTorre.crescer(k);
        fluxoTorre.visible = k > 0.05;
        fluxoTorre.em(lt, k);
        nivelTorre(suave((lt - tc - 0.6) / 2.5) * 0.9);
      },
    },
    {
      fala: 'Lá de cima, a gravidade empurra a água pelos canos até a sua torneira. Cada dez metros de altura dão a força de uma atmosfera.',
      destaque: ['gravidade', 'torneira', 'dez'],
      camera: { pos: [-70, 46, 96], alvo: [-80, 12, 8] },
      transicao: 1.8,
      aplicar(lt, b) {
        canoTorre.crescer(1);
        fluxoTorre.visible = true;
        fluxoTorre.em(lt + 20);
        nivelTorre(0.9);
        const k = suave((lt - b.palavra('gravidade') + 0.2) / 2.2);
        canoCidade.crescer(k);
        fluxoCidade.visible = k > 0.05;
        fluxoCidade.em(lt, k);
      },
      camada: (lt, b) => cartao(lt, b.palavra('dez'), '10 m', 'DE ALTURA = 1 ATMOSFERA DE PRESSÃO'),
    },
    {
      fala: 'É por isso que a caixa d\'água da sua casa fica lá em cima, no telhado.',
      destaque: ['caixa', 'telhado'],
      camera: { pos: [-50, 15, 52], alvo: [-60, 10, 31] },
      transicao: 1.6,
      aplicar(lt) {
        canoCidade.crescer(1);
        fluxoCidade.visible = true;
        fluxoCidade.em(lt + 20);
        const pulso = 1 + 0.12 * Math.max(0, Math.sin(lt * 6));
        casas.forEach((c) => c.caixa.scale.setScalar(pulso));
      },
    },
    {
      fala: 'Agora pode abrir a torneira. Parabéns: você levou água limpa pra cidade inteira!',
      destaque: ['torneira', 'parabéns', 'limpa'],
      camera: { pos: [TX + 1.9, MARGEM + 2.4, TZ + 7], alvo: [TX + 0.9, MARGEM + 1.2, TZ + 0.9] },
      transicao: 1.6,
      aplicar(lt, b) {
        casas.forEach((c) => c.caixa.scale.setScalar(1));
        rio.material.color.set('#5F9488');
        copoCom(suave(lt / 2), '#BFEFFF', lt < 2.2);
        const festa = lt > b.palavra('parabens') - 0.2;
        naTorneira({ bracos: festa ? 'cima' : 'normal', expr: 'feliz', pulo: festa ? 1 : 0 }, festa ? -0.2 : -Math.PI / 4);
      },
      sons: [{ em: 'parabens', tipo: 'ok' }],
    },
    {
      fala: FALA_FINAL,
      semLegenda: true,
      camera: { pos: [PX, 8.95, PZ + 4.2], alvo: [PX, 8.55, PZ] },
      transicao: 1.4,
      aplicar(lt) {
        copoCom(1, '#BFEFFF', false);
        naTorneira({ bracos: lt > 2.2 ? 'aponta' : 'aceno', expr: 'feliz', pulo: 0 }, 0);
      },
      camada: (lt) => textoFinal(lt),
    },
  ];

  return {
    blocos,
    inicial,
    sempre(t, corte) {
      rio.animar(t);
      solo.visible = corte;
      voce.animar(t);
    },
  };
}
