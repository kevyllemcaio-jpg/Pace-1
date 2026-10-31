// VÍDEO: "Como funciona a descarga da privada?"
//
// Fatos conferidos:
//  - O vaso tem um sifão (cano em forma de S/curva) que sempre guarda água: o "fecho hídrico",
//    que bloqueia o cheiro e os gases do esgoto.
//  - Na descarga, a caixa solta muita água de uma vez; ela enche o sifão acima da curva e o
//    escoamento puxa o resto junto (efeito sifão). Quando entra ar, o sifão "quebra" (gargarejo).
//  - A boia sobe com o nível da caixa e fecha a válvula de entrada quando enche.

import * as THREE from 'three';
import { suave, saida, mistura, lim, cartao, etiqueta, ok, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, cilindro, malha } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';

export const config = {
  titulo: ['COMO FUNCIONA A', '*DESCARGA* DA', '*PRIVADA*?'],
};

// ---------- desenho em corte do vaso (metros; o vaso olha para +x) ----------
const CERAMICA = [[-0.32, 0], [0.2, 0], [0.22, 0.1], [0.36, 0.28], [0.4, 0.4], [0.4, 0.43], [-0.32, 0.43]];
const BACIA = [[-0.2, 0.43], [0.35, 0.43], [0.33, 0.36], [0.22, 0.24], [0.06, 0.17], [-0.06, 0.15], [-0.14, 0.18], [-0.19, 0.3]];
// sifão: sobe da saída da bacia até a crista e desce até o chão
const SIFAO = [[-0.15, 0.2], [-0.2, 0.25], [-0.235, 0.27], [-0.265, 0.24], [-0.265, 0.12], [-0.25, 0.0]];
const CRISTA = 0.25;               // nível normal da água (altura da crista do sifão)
const LARG = 0.055;
const CAIXA = { x0: -0.42, x1: -0.08, y0: 0.47, y1: 0.86 };

// corta um polígono pela linha y = nivel (mantém a parte de baixo)
function abaixoDe(pol, nivel) {
  const saida_ = [];
  for (let i = 0; i < pol.length; i++) {
    const a = pol[i], b = pol[(i + 1) % pol.length];
    const ain = a[1] <= nivel, bin = b[1] <= nivel;
    if (ain) saida_.push(a);
    if (ain !== bin) {
      const k = (nivel - a[1]) / (b[1] - a[1]);
      saida_.push([a[0] + (b[0] - a[0]) * k, nivel]);
    }
  }
  return saida_;
}
// polígono "grosso" em volta de uma linha (para canos)
function engrossar(pts, w) {
  const esq = [], dir = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0];
    const n = Math.hypot(nx, ny) || 1;
    nx /= n; ny /= n;
    esq.push([pts[i][0] + nx * w / 2, pts[i][1] + ny * w / 2]);
    dir.push([pts[i][0] - nx * w / 2, pts[i][1] - ny * w / 2]);
  }
  return [...esq, ...dir.reverse()];
}
const forma = (pts) => new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
const ESCALA = 1; // tamanho real

export function criar(ctx) {
  const { cena, cortavel } = ctx;
  const C = (cor, extra = {}) => cortavel(mat(cor, { cortavel: true, ...extra }));

  // ---------- banheiro ----------
  cena.background.set('#CFE8F7');
  const azulejo = (x, y, z, w, h, rot = 0, cor1 = '#E8F1F7', cor2 = '#D6E6F0', corta = false) => {
    const g = new THREE.Group();
    for (let i = 0; i < w / 0.5; i++) for (let j = 0; j < h / 0.5; j++) {
      const m = caixa(0.48, 0.48, 0.03, corta ? C((i + j) % 2 ? cor1 : cor2) : mat((i + j) % 2 ? cor1 : cor2), [i * 0.5 + 0.25 - w / 2, j * 0.5 + 0.25, 0], { sombra: false });
      g.add(m);
    }
    g.position.set(x, y, z);
    g.rotation.y = rot;
    return g;
  };
  cena.add(azulejo(0, 0, -1.2, 6, 3));                  // parede do fundo
  cena.add(azulejo(-2.2, 0, 0, 4, 3, Math.PI / 2));     // parede lateral
  const piso = caixa(6, 0.1, 5, mat('#B8C4CC'), [0, -0.05, 0.6]);
  cena.add(piso);
  const subsolo = caixa(6, 1.2, 3, mat('#8A7356', { unico: true }), [0, -0.65, -1.4], { sombra: false });
  cena.add(subsolo);
  // pia ao fundo
  cena.add(caixa(0.8, 0.12, 0.5, C('#FFFFFF'), [1.5, 0.85, -0.9]));
  cena.add(caixa(0.2, 0.85, 0.2, C('#FFFFFF'), [1.5, 0.42, -0.95]));

  // ---------- vaso 3D (vista normal) ----------
  const vaso3d = new THREE.Group();
  const branco = C('#FAFAFA', { brilho: true });
  vaso3d.add(caixa(0.36, 0.3, 0.32, branco, [-0.02, 0.15, 0]));
  const bacia = malha(new THREE.CylinderGeometry(0.24, 0.18, 0.16, 12), branco);
  bacia.position.set(0.08, 0.36, 0);
  vaso3d.add(bacia);
  const assento = malha(new THREE.TorusGeometry(0.2, 0.035, 6, 14), C('#F0F0F0'));
  assento.rotation.x = Math.PI / 2;
  assento.position.set(0.09, 0.45, 0);
  vaso3d.add(assento);
  vaso3d.add(caixa(0.3, 0.4, 0.46, branco, [-0.25, 0.66, 0]));
  vaso3d.add(caixa(0.32, 0.04, 0.48, branco, [-0.25, 0.88, 0]));
  vaso3d.add(cilindro(0.04, 0.02, C('#C3C9D2', { metal: true }), [-0.25, 0.91, 0]));
  vaso3d.scale.setScalar(ESCALA);
  cena.add(vaso3d);

  // ---------- desenho em corte (lâmina em z = 0) ----------
  const corteG = new THREE.Group();
  corteG.scale.setScalar(ESCALA);
  cena.add(corteG);
  const lamina = (pts, cor, z, unico = false) => {
    const m = malha(new THREE.ShapeGeometry(forma(pts)), mat(cor, { unico }), { sombra: false });
    m.position.z = z;
    m.receiveShadow = false;
    corteG.add(m);
    return m;
  };
  lamina(CERAMICA, '#F4F6F8', 0.0);
  lamina([[CAIXA.x0, CAIXA.y0 - 0.04], [CAIXA.x1, CAIXA.y0 - 0.04], [CAIXA.x1, CAIXA.y1], [CAIXA.x0, CAIXA.y1]], '#F4F6F8', 0.0);
  lamina(BACIA, '#3A3F48', 0.002);
  const tuboSifao = lamina(engrossar(SIFAO, LARG), '#3A3F48', 0.002);
  lamina([[CAIXA.x0 + 0.02, CAIXA.y0], [CAIXA.x1 - 0.02, CAIXA.y0], [CAIXA.x1 - 0.02, CAIXA.y1 - 0.02], [CAIXA.x0 + 0.02, CAIXA.y1 - 0.02]], '#3A3F48', 0.002);
  // ligação caixa -> bacia (canal da borda)
  lamina(engrossar([[-0.18, CAIXA.y0], [-0.18, 0.43]], 0.05), '#3A3F48', 0.002);
  // esgoto no chão
  lamina(engrossar([[-0.25, 0.0], [-0.25, -0.18], [-0.12, -0.3], [0.6, -0.3]], 0.09), '#6E7682', 0.001);
  lamina(engrossar([[-0.25, 0.0], [-0.25, -0.18], [-0.12, -0.3], [0.6, -0.3]], 0.06), '#2A2D33', 0.002);
  // contorno amarelo do sifão (destaque)
  const destaqueSifao = lamina(engrossar(SIFAO, LARG + 0.03), '#FFD21F', 0.0015, true);
  destaqueSifao.material.emissive = new THREE.Color('#8A6A00');

  // água (geometrias refeitas a cada quadro)
  const matAgua = mat('#3EA6F0', { unico: true, emissivo: '#0E4C80' });
  const mkAgua = (z) => {
    const m = new THREE.Mesh(new THREE.BufferGeometry(), matAgua);
    m.position.z = z;
    corteG.add(m);
    return m;
  };
  const aguaBacia = mkAgua(0.004), aguaSifao = mkAgua(0.004), aguaCaixa = mkAgua(0.004), jato = mkAgua(0.005);
  const definir = (m, pols) => {
    m.geometry.dispose();
    const ok_ = pols.filter((p) => p && p.length >= 3);
    m.geometry = ok_.length ? new THREE.ShapeGeometry(ok_.map(forma)) : new THREE.BufferGeometry();
  };
  function agua({ bacia: nb, sifao, caixa: nc, jorrando, bolhas }) {
    definir(aguaBacia, [abaixoDe(BACIA, nb)]);
    // sifão: "parado" = cheio até a crista; "cheio" = tudo (sifonando); fração = quanto do trecho de descida
    const pols = [];
    for (let i = 0; i < SIFAO.length - 1; i++) {
      const seg = engrossar([SIFAO[i], SIFAO[i + 1]], LARG - 0.012);
      const descendo = i >= 2;
      if (!descendo) pols.push(abaixoDe(seg, Math.max(nb, CRISTA)));
      else if (sifao > 0 && (i - 2) / 3 < sifao) pols.push(seg);
    }
    definir(aguaSifao, pols);
    definir(aguaCaixa, nc > CAIXA.y0 + 0.005 ? [[[CAIXA.x0 + 0.02, CAIXA.y0], [CAIXA.x1 - 0.02, CAIXA.y0], [CAIXA.x1 - 0.02, nc], [CAIXA.x0 + 0.02, nc]]] : []);
    definir(jato, jorrando ? [engrossar([[-0.18, CAIXA.y0], [-0.18, 0.42], [-0.12, 0.3]], 0.035)] : []);
    bolhaG.visible = !!bolhas;
  }
  // tampinha (flapper), boia e válvula de entrada
  const tampinha = new THREE.Group();
  tampinha.position.set(-0.21, CAIXA.y0 + 0.01, 0.006);
  const tampaM = malha(new THREE.ShapeGeometry(forma([[0, 0], [0.07, 0], [0.07, 0.025], [0, 0.025]])), mat('#C0392B'), { sombra: false });
  tampinha.add(tampaM);
  corteG.add(tampinha);
  const boia = new THREE.Group();
  const boiaBola = malha(new THREE.CircleGeometry(0.035, 12), mat('#E8322B'), { sombra: false });
  boia.add(boiaBola);
  const braco = malha(new THREE.ShapeGeometry(forma([[0, -0.004], [0.11, -0.004], [0.11, 0.004], [0, 0.004]])), mat('#9AA3AE'), { sombra: false });
  boia.add(braco);
  boia.position.z = 0.007;
  corteG.add(boia);
  lamina([[CAIXA.x0 + 0.04, CAIXA.y0], [CAIXA.x0 + 0.06, CAIXA.y0], [CAIXA.x0 + 0.06, CAIXA.y1 - 0.06], [CAIXA.x0 + 0.04, CAIXA.y1 - 0.06]], '#9AA3AE', 0.006);
  const torneirinha = mkAgua(0.006);
  // sujeira descendo e cheiro do esgoto
  const sujeira = [0, 1, 2, 3].map((i) => {
    const m = malha(new THREE.CircleGeometry(0.018 + (i % 2) * 0.008, 6), mat('#7A5A3A'), { sombra: false });
    m.position.z = 0.008;
    corteG.add(m);
    return m;
  });
  const bolhaG = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const b = malha(new THREE.CircleGeometry(0.012, 8), mat('#FFFFFF'), { sombra: false });
    b.position.set(-0.265, 0.05 + i * 0.04, 0.009);
    bolhaG.add(b);
  }
  corteG.add(bolhaG);
  const cheiro = [0, 1, 2].map((i) => {
    const m = malha(new THREE.ShapeGeometry(forma(engrossar([[0, 0], [0.02, 0.03], [-0.01, 0.06], [0.02, 0.09]], 0.012))), mat('#7BD35A', { emissivo: '#2E6B1E' }), { sombra: false });
    m.position.z = 0.009;
    corteG.add(m);
    return m;
  });
  // ponto ao longo do sifão (u de 0 a 1)
  const comp = [];
  let total = 0;
  for (let i = 0; i < SIFAO.length - 1; i++) { const d = Math.hypot(SIFAO[i + 1][0] - SIFAO[i][0], SIFAO[i + 1][1] - SIFAO[i][1]); comp.push(d); total += d; }
  function noSifao(u) {
    let d = lim(u) * total;
    for (let i = 0; i < comp.length; i++) {
      if (d <= comp[i]) { const k = d / comp[i]; return [SIFAO[i][0] + (SIFAO[i + 1][0] - SIFAO[i][0]) * k, SIFAO[i][1] + (SIFAO[i + 1][1] - SIFAO[i][1]) * k]; }
      d -= comp[i];
    }
    return SIFAO[SIFAO.length - 1];
  }

  const voce = criarPersonagem();
  cena.add(voce);

  let E;
  function inicial() {
    E = { bacia: CRISTA, sifao: 0, caixa: 0.78, jorrando: false, bolhas: false, tampa: 0, caixaVisivel: true, destaque: false, cheiro: -1, sujeira: -1, torneira: false };
    voce.visible = true;
    voce.position.set(0.58, 0, -0.55);
    voce.rotation.y = -0.1;
    voce.estado = { bracos: 'lado', expr: 'feliz' };
  }
  function montar(t, corte) {
    vaso3d.visible = true;
    corteG.visible = corte;
    subsolo.visible = corte;
    agua(E);
    tampinha.rotation.z = E.tampa * 1.2;
    const nb = Math.max(CAIXA.y0 + 0.05, E.caixa);
    boia.position.set(-0.36, nb, 0.007);
    boiaBola.position.set(0.11, 0, 0);
    braco.rotation.z = 0;
    definir(torneirinha, E.torneira ? [[[CAIXA.x0 + 0.06, CAIXA.y1 - 0.08], [CAIXA.x0 + 0.075, CAIXA.y1 - 0.08], [CAIXA.x0 + 0.075, nb], [CAIXA.x0 + 0.06, nb]]] : []);
    destaqueSifao.visible = E.destaque && Math.sin(t * 8) > -0.3;
    cheiro.forEach((m, i) => {
      const k = E.cheiro;
      m.visible = k >= 0;
      const u = ((k * 0.6 + i / 3) % 1);
      m.position.set(0.3 - u * 0.5, -0.3 + 0.01 + Math.sin(u * 6) * 0.01, 0.009);
      if (u > 0.9) m.visible = false;
    });
    sujeira.forEach((m, i) => {
      const k = E.sujeira - i * 0.08;
      m.visible = E.sujeira >= 0 && k < 1.05;
      if (k < 0) m.position.set(0.05 + i * 0.04, E.bacia - 0.01, 0.008);
      else { const [x, y] = noSifao(k); m.position.set(x, y, 0.008); }
    });
  }

  const apresentar = (lt, b, bracos = 'lado', expr = 'feliz') => {
    voce.visible = true;
    voce.position.set(0.78, 0, 0.35);
    voce.rotation.y = -0.2;
    voce.estado = { bracos, expr, falando: b.falando(lt) };
  };
  const camCorte = { pos: [0, 0.46, 1.45], alvo: [0, 0.44, 0] };
  const camApresentador = { pos: [0.55, 1.25, 3.3], alvo: [0.45, 0.98, 0.2] };

  const blocos = [
    {
      fala: 'Você aperta um botão, e tudo some. Mas pra onde vai? E por que sempre sobra água no fundo do vaso?',
      destaque: ['some', 'água', 'fundo'],
      corte: true,
      camera: { pos: [0.12, 1.0, 3.7], alvo: [0.12, 1.0, 0] },
      aplicar(lt, b) {
        voce.estado = { bracos: lt < b.dur * 0.5 ? 'lado' : 'normal', expr: lt < b.dur * 0.5 ? 'feliz' : 'surpreso', falando: false };
        E.sujeira = lt > 2 ? -1 : -1;
      },
    },
    {
      fala: 'Olha por dentro: depois da bacia, o cano sobe, faz uma curva, e depois desce.',
      destaque: ['sobe', 'curva', 'desce'],
      corte: true,
      corteSeco: true,
      camera: camCorte,
      aplicar(lt, b) {
        voce.visible = false;
        E.destaque = lt > b.palavra('sobe') - 0.3;
      },
    },
    {
      fala: 'Essa curva sempre guarda um pouco de água. Ela tampa o cano, e não deixa o cheiro do esgoto subir.',
      destaque: ['água', 'cheiro', 'esgoto'],
      corte: true,
      camera: { pos: [-0.05, 0.25, 1.18], alvo: [-0.05, 0.23, 0] },
      aplicar(lt, b) {
        E.destaque = lt < b.palavra('agua');
        E.cheiro = lt > b.palavra('cheiro') - 0.5 ? (lt - b.palavra('cheiro') + 0.5) : -1;
      },
      camada: (lt, b) => cartao(lt, b.palavra('tampa'), 'FECHO HÍDRICO', 'A ÁGUA PARADA BLOQUEIA O CHEIRO') + ok(lt, b.palavra('subir')),
    },
    {
      fala: 'Esse é o sifão. É por isso que sempre tem água no fundo do vaso!',
      destaque: ['sifão', 'fundo'],
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) {
        E.cheiro = -1;
        apresentar(lt, b, lt < 1.6 ? 'lado' : 'aponta');
      },
    },
    {
      fala: 'Mas só essa água não leva nada embora. Então você põe uma caixa em cima, cheia de água.',
      destaque: ['caixa', 'cheia'],
      corte: true,
      corteSeco: true,
      camera: camCorte,
      aplicar(lt, b) {
        voce.visible = false;
        E.sujeira = 0 - 0.001;
        E.sujeira = -0.0001;
      },
    },
    {
      fala: 'Quando você aperta, uma tampinha abre lá embaixo, e a caixa despeja tudo de uma vez no vaso.',
      destaque: ['tampinha', 'despeja'],
      corte: true,
      camera: camCorte,
      aplicar(lt, b) {
        const ta = b.palavra('aperta');
        E.tampa = suave((lt - ta) / 0.4);
        const k = suave((lt - b.palavra('despeja') + 0.3) / 1.6);
        E.caixa = mistura(0.78, CAIXA.y0, k);
        E.jorrando = k > 0.02 && k < 0.98;
        E.bacia = mistura(CRISTA, 0.36, k);
        E.sujeira = -0.0001;
      },
      sons: [{ em: 'aperta', tipo: 'martelo' }, { em: 'despeja', tipo: 'descarga' }],
    },
    {
      fala: 'A água enche a curva até o topo, e escorre pro outro lado. Aí ela puxa todo o resto junto: é o efeito sifão!',
      destaque: ['topo', 'puxa', 'sifão'],
      corte: true,
      camera: { pos: [-0.02, 0.28, 1.14], alvo: [-0.02, 0.25, 0] },
      aplicar(lt, b) {
        Object.assign(E, { caixa: CAIXA.y0, jorrando: false, tampa: 1 });
        const te = b.palavra('escorre'), tp = b.palavra('puxa');
        E.sifao = lim((lt - te + 0.3) / 0.8);
        const dren = suave((lt - tp) / 2.2);
        E.bacia = mistura(0.36, 0.16, dren);
        E.sujeira = lt > tp ? (lt - tp) * 0.55 : -0.0001;
      },
      camada: (lt, b) => cartao(lt, b.palavra('sifao', 1) || b.palavra('efeito'), 'EFEITO SIFÃO', 'A ÁGUA QUE DESCE PUXA A QUE SOBE'),
    },
    {
      fala: 'Quando entra ar no cano, o sifão quebra. É aquele barulho de gargarejo no final.',
      destaque: ['ar', 'gargarejo'],
      corte: true,
      camera: { pos: [-0.09, 0.18, 1.0], alvo: [-0.09, 0.15, 0] },
      aplicar(lt, b) {
        E.sujeira = 2;
        E.bacia = 0.16;
        E.sifao = lt < b.palavra('quebra') ? 1 : 1 - lim((lt - b.palavra('quebra')) / 0.6);
        E.bolhas = lt > b.palavra('ar') - 0.2 && lt < b.palavra('gargarejo') + 1.2;
      },
      sons: [{ em: 'gargarejo', tipo: 'gargalo' }],
    },
    {
      fala: 'E aí uma boia sobe junto com a água da caixa, e fecha a torneira sozinha quando enche.',
      destaque: ['boia', 'sozinha'],
      corte: true,
      camera: { pos: [-0.11, 0.61, 1.05], alvo: [-0.11, 0.59, 0] },
      aplicar(lt, b) {
        Object.assign(E, { sifao: 0, bolhas: false, tampa: 0 });
        const k = suave((lt - 0.3) / (b.palavra('enche') - 0.3));
        E.caixa = mistura(CAIXA.y0, 0.78, k);
        E.bacia = mistura(0.16, CRISTA, k);
        E.torneira = k < 0.99;
      },
      camada: (lt, b) => ok(lt, b.palavra('enche')),
      sons: [{ em: 'enche', tipo: 'ok' }],
    },
    {
      fala: 'Parabéns: agora você sabe como funciona a descarga!',
      destaque: ['parabéns', 'descarga'],
      corteSeco: true,
      camera: { pos: [0.4, 1.2, 4.1], alvo: [0.4, 1.0, 0] },
      aplicar(lt, b) {
        E.torneira = false;
        E.caixa = 0.78;
        voce.visible = true;
        voce.position.set(0.78, 0, 0.35);
        voce.rotation.y = -0.2;
        voce.estado = { bracos: 'cima', expr: 'feliz', pulo: 1, falando: false };
      },
    },
    {
      fala: FALA_FINAL,
      semLegenda: true,
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) {
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
