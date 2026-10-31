// VÍDEO: "Como um navio de aço não afunda?"
//
// Fatos conferidos:
//  - Aço ≈ 7,85 g/cm³ (≈ 7,8x a água) → um bloco maciço afunda.
//  - Empuxo (Arquimedes): força para cima igual ao peso da água deslocada. O navio é oco,
//    então a densidade média (aço + ar) fica menor que a da água.
//  - Peso baixo (lastro/quilha) baixa o centro de gravidade e o navio se endireita sozinho.
//  - Compartimentos estanques: o Titanic (1912) tinha 16; as anteparas não iam até o convés
//    de cima, e a água passou por cima de uma para outra conforme a proa afundava.

import * as THREE from 'three';
import { suave, saida, mistura, lim, cartao, etiqueta, ok, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, malha, respingos } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';

export const config = {
  titulo: ['COMO UM *NAVIO*', 'DE AÇO NÃO', '*AFUNDA*?'],
};

const FUNDO_MAR = -16;
const L = 34;          // comprimento do casco (sem a proa)
const BOCA = 8;        // largura
const PX = 15.5, PZ = 25; // personagem no píer, de frente para o navio

export function criar(ctx) {
  const { cena, cortavel } = ctx;
  const C = (cor, extra = {}) => cortavel(mat(cor, { cortavel: true, ...extra }));

  // ---------- mar ----------
  const geoMar = new THREE.PlaneGeometry(700, 700, 140, 140);
  geoMar.rotateX(-Math.PI / 2);
  const baseMar = Float32Array.from(geoMar.attributes.position.array);
  const mar = malha(geoMar, C('#2C86E0', { brilho: true, opacidade: 0.92, unico: true }), { sombra: false });
  cena.add(mar);
  let ondaForte = 0;
  function animarMar(t) {
    const p = geoMar.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = baseMar[i * 3], z = baseMar[i * 3 + 2];
      p.setY(i, 0.18 * Math.sin(x * 0.25 + t * 1.3) + 0.14 * Math.sin(z * 0.2 + t * 1.7) + ondaForte * 1.6 * Math.sin(z * 0.12 - t * 2.2));
    }
    p.needsUpdate = true;
    geoMar.computeVertexNormals();
  }
  // ilhas ao longe
  for (const [x, z, r, h] of [[-140, -220, 60, 26], [90, -260, 70, 34], [220, -180, 40, 18]]) {
    const ilha = malha(new THREE.ConeGeometry(r, h, 9), mat('#5DB13F'));
    ilha.position.set(x, h / 2 - 3, z);
    cena.add(ilha);
  }
  const solCeu = new THREE.Mesh(new THREE.IcosahedronGeometry(14, 1), mat('#FFE27A', { emissivo: '#FFB800', semNeblina: true }));
  solCeu.position.set(80, 140, -260);
  cena.add(solCeu);
  // corte: água por dentro e fundo de areia
  const volAgua = caixa(300, -FUNDO_MAR, 300, mat('#2A78D4', { unico: true }), [0, FUNDO_MAR / 2, -150], { sombra: false });
  const volAreia = caixa(300, 10, 300, mat('#CFAE72', { unico: true }), [0, FUNDO_MAR - 5, -150], { sombra: false });
  cena.add(volAgua, volAreia);

  // píer
  const pier = new THREE.Group();
  pier.add(caixa(4, 0.4, 26, C('#9C6B3E'), [PX, 1.0, PZ + 10]));
  for (let z = PZ - 2; z < PZ + 22; z += 4) for (const dx of [-1.8, 1.8]) pier.add(caixa(0.4, 4, 0.4, C('#7A4E2D'), [PX + dx, -0.8, z]));
  cena.add(pier);

  // ---------- o navio ----------
  const navio = new THREE.Group();
  const casco = new THREE.Group();
  navio.add(casco);
  const vermelho = C('#B23A2E', { duplo: true }), azul = C('#1F3B5C', { duplo: true });
  casco.add(caixa(L, 0.3, BOCA, vermelho, [0, -3, 0]));
  for (const z of [-BOCA / 2, BOCA / 2]) {
    casco.add(caixa(L, 3, 0.3, vermelho, [0, -1.5, z]));
    casco.add(caixa(L, 3, 0.3, azul, [0, 1.5, z]));
  }
  casco.add(caixa(0.3, 6, BOCA, vermelho, [-L / 2, 0, 0]));
  casco.add(caixa(0.3, 6, BOCA, azul, [L / 2, 0, 0]));
  const proa = (cor, y0) => {
    const forma = new THREE.Shape([new THREE.Vector2(L / 2, -BOCA / 2), new THREE.Vector2(L / 2 + 5, 0), new THREE.Vector2(L / 2, BOCA / 2)]);
    const g = new THREE.ExtrudeGeometry(forma, { depth: 3, bevelEnabled: false });
    g.rotateX(-Math.PI / 2);
    const m = malha(g, cor);
    m.position.y = y0;
    return m;
  };
  casco.add(proa(vermelho, -3), proa(azul, 0));
  // convés, ponte de comando e contêineres
  const conves = new THREE.Group();
  conves.add(caixa(L, 0.25, BOCA, C('#7C838E'), [0, 3, 0]));
  conves.add(caixa(6, 5, 7, C('#F4F4F6'), [-12.5, 5.6, 0]));
  conves.add(caixa(6.4, 0.4, 7.4, C('#1F3B5C'), [-12.5, 8.3, 0]));
  conves.add(caixa(5.8, 0.9, 0.1, C('#2A3B55', { brilho: true }), [-12.5, 7.2, 3.55]));
  conves.add(caixa(1.4, 3, 1.4, C('#E8322B'), [-14, 9.5, 0]));
  const coresCont = ['#E8322B', '#2F6FE0', '#F2C14E', '#2DBE60', '#F28C28'];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) conves.add(caixa(3.6, 2.4, 3.2, C(coresCont[(i + j) % 5]), [-6 + i * 4, 4.35 + j * 2.45, (i % 2 ? 1.7 : -1.7) * (j ? -1 : 1)]));
  navio.add(conves);
  // interior (na vista em corte): "ar"
  const ar = malha(new THREE.PlaneGeometry(L - 0.6, 5.7), mat('#E6F4FF', { unico: true, emissivo: '#4A6A88' }), { sombra: false });
  ar.receiveShadow = false;
  ar.position.set(0, -0.05, 0.02);
  navio.add(ar);
  // lastro
  const lastro = new THREE.Group();
  for (let i = 0; i < 8; i++) lastro.add(caixa(3.4, 0.9, 3.6, mat('#4A505A'), [-13 + i * 3.7, -2.4, -1.9]));
  navio.add(lastro);
  // anteparas (paredes internas) e água entrando
  const XS_ANT = [-8.5, 0, 8.5];
  const anteparas = XS_ANT.map((x) => {
    const m = caixa(0.3, 5.7, BOCA - 0.4, C('#9AA3AE', { duplo: true }), [x, -0.05, 0]);
    navio.add(m);
    return m;
  });
  const agMat = mat('#2A78D4', { unico: true });
  const salas = [[-L / 2 + 0.2, -8.5], [-8.5, 0], [0, 8.5], [8.5, L / 2 - 0.2]].map(([a, b]) => {
    const m = caixa(b - a - 0.3, 1, 0.1, agMat, [(a + b) / 2, 0, 0.05], { sombra: false });
    navio.add(m);
    return m;
  });
  const enche = (i, h) => { const m = salas[i]; m.visible = h > 0.02; m.scale.y = Math.max(0.01, h); m.position.y = -2.85 + h / 2; };
  const furo = caixa(1.2, 0.5, 0.2, mat('#111111'), [12, -3, 0.1], { sombra: false });
  navio.add(furo);
  cena.add(navio);

  // empuxo: setas amarelas embaixo do casco
  const setas = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const g = new THREE.Group();
    g.add(caixa(0.5, 2, 0.3, mat('#FFD21F', { emissivo: '#7A5A00' }), [0, -1, 0]));
    const ponta = malha(new THREE.ConeGeometry(0.75, 1.1, 4), mat('#FFD21F', { emissivo: '#7A5A00' }));
    ponta.position.y = 0.5;
    g.add(ponta);
    g.position.set(-14 + i * 5.6, -5, 0.4);
    setas.add(g);
  }
  cena.add(setas);

  // bloco de aço maciço
  const bloco = caixa(2.4, 2.4, 2.4, mat('#6E7682', { metal: true }), [0, 0, 0]);
  cena.add(bloco);
  const splash = respingos(30, '#E8F6FF', [0, 0.3, 0.5], { vel: 8 });
  cena.add(splash);

  const voce = criarPersonagem();
  voce.scale.setScalar(1.05);
  cena.add(voce);

  let estadoNavio;
  function inicial() {
    estadoNavio = { y: 0, roll: 0, pitch: 0, x: 0, escala: 1 };
    navio.visible = true;
    lastro.visible = false;
    anteparas.forEach((a) => { a.visible = false; a.scale.y = 1; a.position.y = -0.05; });
    salas.forEach((_, i) => enche(i, 0));
    furo.visible = false;
    setas.visible = false;
    bloco.visible = false;
    splash.em(-1);
    ondaForte = 0;
    voce.visible = true;
    voce.position.set(PX, 1.2, PZ);
    voce.rotation.y = 0.35;
    voce.estado = { bracos: 'lado', expr: 'feliz' };
  }
  const apresentar = (lt, b, bracos = 'aponta', expr = 'feliz') => {
    voce.position.set(PX, 1.2, PZ);
    voce.rotation.y = 0.15;
    voce.estado = { bracos, expr, falando: b.falando(lt) };
  };
  const camApresentador = { pos: [PX + 0.5, 3.0, PZ + 4.3], alvo: [PX - 0.3, 2.65, PZ] };

  const blocos = [
    {
      fala: 'Um parafuso de aço afunda na hora. Mas um navio, com milhares de toneladas de aço, flutua. Como?',
      destaque: ['afunda', 'navio', 'flutua'],
      camera: { pos: [15.2, 3.6, 34], alvo: [12, 3.6, 0] },
      cameraFim: { pos: [6, 9, 70], alvo: [0, 0, 0] },
      aplicar(lt, b) {
        const k = 1 - suave((lt - (b.dur - 0.8)) / 0.6);
        estadoNavio.escala = Math.max(0.01, k);
        voce.estado = { bracos: lt < b.dur * 0.55 ? 'lado' : 'normal', expr: 'surpreso', falando: false };
      },
    },
    {
      fala: 'Se você joga um bloco de aço na água, ele afunda: o aço é quase oito vezes mais pesado que a água.',
      destaque: ['bloco', 'afunda', 'oito'],
      corte: true,
      corteSeco: true,
      camera: { pos: [0, -4, 30], alvo: [0, -6.5, 0] },
      aplicar(lt, b) {
        navio.visible = false;
        const tj = b.palavra('joga');
        bloco.visible = lt > tj;
        const q = Math.max(0, lt - tj);
        const yAr = 10 - 0.5 * 9.8 * q * q;
        const tAgua = Math.sqrt(10 / 4.9);
        bloco.position.set(0, q < tAgua ? yAr : Math.max(FUNDO_MAR + 1.2, -2.2 * (q - tAgua) * 1.0 - (q - tAgua) ** 2 * 1.4), 0);
        bloco.rotation.set(q * 0.4, q * 0.3, 0);
        splash.em(q - tAgua);
      },
      camada: (lt, b) => cartao(lt, b.palavra('oito'), '7,8x', 'O AÇO É MAIS PESADO QUE A ÁGUA'),
      sons: [{ em: (b) => b.palavra('joga') + Math.sqrt(10 / 4.9), tipo: 'splash' }],
    },
    {
      fala: 'Então você abre o mesmo aço numa casca oca, cheia de ar por dentro.',
      destaque: ['casca', 'oca', 'ar'],
      corte: true,
      camera: { pos: [0, 0, 66], alvo: [0, -1.5, 0] },
      aplicar(lt, b) {
        const k = suave((lt - b.palavra('casca') + 0.3) / 1.4);
        bloco.visible = k < 0.5;
        bloco.scale.setScalar(Math.max(0.01, 1 - k * 2));
        navio.visible = k > 0.05;
        estadoNavio.escala = Math.max(0.01, k);
        estadoNavio.y = mistura(-3, 0, k);
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('ar'), 'AR POR DENTRO'),
    },
    {
      fala: 'Aí a água empurra o casco pra cima, com a força do peso de toda a água que ele tira do lugar. Esse é o empuxo.',
      destaque: ['empurra', 'empuxo'],
      corte: true,
      camera: { pos: [0, -3, 56], alvo: [0, -3, 0] },
      aplicar(lt, b) {
        bloco.visible = false;
        estadoNavio.escala = 1;
        setas.visible = lt > b.palavra('empurra') - 0.2;
        setas.children.forEach((s, i) => (s.position.y = -5.4 + 0.4 * Math.sin(lt * 5 + i)));
      },
      camada: (lt, b) => cartao(lt, b.palavra('empuxo'), 'EMPUXO', 'A ÁGUA EMPURRA O NAVIO PRA CIMA'),
    },
    {
      fala: 'Resumindo: o navio flutua porque, com todo esse ar dentro, ele fica mais leve que a água do mesmo tamanho.',
      destaque: ['flutua', 'leve'],
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) {
        setas.visible = false;
        apresentar(lt, b, lt < 2.5 ? 'lado' : 'aponta');
      },
    },
    {
      fala: 'Mas aí vem uma onda forte de lado... e o navio vira!',
      destaque: ['onda', 'vira'],
      corteSeco: true,
      camera: { pos: [52, 6, 7], alvo: [0, 2, 0] },
      aplicar(lt, b) {
        voce.estado = { bracos: 'normal', expr: 'feliz' };
        ondaForte = suave((lt - b.palavra('onda') + 0.3) / 1);
        estadoNavio.roll = 1.35 * suave((lt - b.palavra('vira') + 0.4) / 1.1);
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('vira'), 'VIRANDO'),
      sons: [{ em: 'vira', tipo: 'splash' }],
    },
    {
      fala: 'Então você põe peso bem no fundo do casco, como um joão-bobo.',
      destaque: ['peso', 'fundo', 'joão-bobo'],
      corte: true,
      corteSeco: true,
      camera: { pos: [0, -1, 50], alvo: [0, -2, 0] },
      aplicar(lt, b) {
        ondaForte = 0;
        estadoNavio.roll = 0;
        const tp = b.palavra('peso');
        lastro.visible = lt > tp;
        lastro.children.forEach((m, i) => (m.position.y = mistura(6, -2.4, saida((lt - tp - i * 0.12) / 0.6))));
      },
      sons: [{ em: (b) => b.palavra('peso') + 0.6, tipo: 'baque' }],
    },
    {
      fala: 'Esse é o lastro: se o navio inclina, o peso puxa ele de volta, e ele fica de pé sozinho.',
      destaque: ['lastro', 'sozinho'],
      corteSeco: true,
      camera: { pos: [52, 6, 7], alvo: [0, 2, 0] },
      aplicar(lt, b) {
        lastro.visible = true;
        lastro.children.forEach((m) => (m.position.y = -2.4));
        ondaForte = 0.6;
        estadoNavio.roll = 0.75 * Math.cos(lt * 2.4) * Math.exp(-lt * 0.45);
      },
      camada: (lt, b) => cartao(lt, b.palavra('lastro'), 'LASTRO', 'PESO NO FUNDO = NAVIO DE PÉ') + ok(lt, b.palavra('sozinho')),
      sons: [{ em: 'sozinho', tipo: 'ok' }],
    },
    {
      fala: 'Mas se o casco furar, a água entra... e enche o navio inteiro.',
      destaque: ['furar', 'enche'],
      corte: true,
      corteSeco: true,
      camera: { pos: [0, -1, 62], alvo: [0, -2, 0] },
      aplicar(lt, b) {
        ondaForte = 0;
        estadoNavio.roll = 0;
        const tf = b.palavra('furar');
        furo.visible = lt > tf;
        const k = suave((lt - tf - 0.3) / 2.6);
        salas.forEach((_, i) => enche(i, 5.6 * k));
        estadoNavio.y = -6 * suave((lt - tf - 1.2) / 2.5);
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('furar'), 'FUROU'),
      sons: [{ em: 'furar', tipo: 'splash' }],
    },
    {
      fala: 'Então você divide o casco em salas fechadas. Se uma enche, as outras seguram o navio boiando.',
      destaque: ['salas', 'fechadas', 'boiando'],
      corte: true,
      camera: { pos: [0, 0, 62], alvo: [0, -1.5, 0] },
      aplicar(lt, b) {
        estadoNavio.y = 0;
        salas.forEach((_, i) => enche(i, 0));
        const ts = b.palavra('salas');
        anteparas.forEach((a, i) => { a.visible = lt > ts + i * 0.2; a.scale.y = Math.max(0.01, saida((lt - ts - i * 0.2) / 0.4)); });
        const te = b.palavra('enche');
        furo.visible = lt > te - 0.3;
        const k = suave((lt - te) / 1.8);
        enche(3, 5.6 * k);
        estadoNavio.y = -0.7 * k;
        estadoNavio.pitch = -0.03 * k;
      },
      camada: (lt, b) => ok(lt, b.palavra('boiando')),
      sons: [{ em: 'boiando', tipo: 'ok' }],
    },
    {
      fala: 'Foi isso que deu errado no Titanic: as paredes não iam até o teto, e a água foi passando por cima, de sala em sala.',
      destaque: ['Titanic', 'teto', 'sala'],
      corte: true,
      camera: { pos: [6, -1, 58], alvo: [6, -2, 0] },
      aplicar(lt, b) {
        anteparas.forEach((a) => { a.visible = true; a.scale.y = 0.55; a.position.y = -2.95 + (5.7 * 0.55) / 2; });
        const k = (i) => suave((lt - 0.5 - i * 1.2) / 1.3);
        enche(3, 5.6 * k(0));
        enche(2, 5.6 * k(1));
        enche(1, 5.6 * k(2));
        furo.visible = true;
        estadoNavio.pitch = -0.12 * suave(lt / b.dur);
        estadoNavio.y = -3 * suave(lt / b.dur);
      },
      camada: (lt, b) => cartao(lt, b.palavra('Titanic'), '1912', 'TITANIC: AS PAREDES ERAM BAIXAS DEMAIS'),
    },
    {
      fala: 'Agora pode navegar. Parabéns: você construiu um navio!',
      destaque: ['navegar', 'parabéns', 'navio'],
      corteSeco: true,
      camera: { pos: [PX + 3, 4.5, PZ + 14], alvo: [8, 3, 0] },
      cameraFim: { pos: [PX - 6, 14, PZ + 46], alvo: [-6, 2, 0] },
      aplicar(lt, b) {
        salas.forEach((_, i) => enche(i, 0));
        furo.visible = false;
        anteparas.forEach((a) => { a.scale.y = 1; a.position.y = -0.05; });
        estadoNavio.pitch = 0;
        estadoNavio.y = 0;
        estadoNavio.x = -22 * suave(lt / b.dur);
        voce.position.set(PX, 1.2, PZ);
        voce.rotation.y = -0.3;
        const festa = lt > b.palavra('parabens') - 0.2;
        voce.estado = { bracos: festa ? 'cima' : 'aceno', expr: 'feliz', pulo: festa ? 1 : 0 };
      },
    },
    {
      fala: FALA_FINAL,
      semLegenda: true,
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) {
        estadoNavio.x = -22;
        apresentar(lt, b, lt > 2.4 ? 'aponta' : 'aceno');
      },
      camada: (lt) => textoFinal(lt),
    },
  ];

  return {
    blocos,
    inicial,
    sempre(t, corte) {
      animarMar(t);
      volAgua.visible = volAreia.visible = corte;
      ar.visible = corte;
      navio.position.set(estadoNavio.x, estadoNavio.y + 0.15 * Math.sin(t * 1.4), 0);
      navio.rotation.set(estadoNavio.roll, 0, estadoNavio.pitch + 0.01 * Math.sin(t * 1.1));
      navio.scale.setScalar(estadoNavio.escala);
      voce.animar(t);
    },
  };
}
