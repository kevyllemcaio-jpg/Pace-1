// VÍDEO: "Como um avião de 70 toneladas fica no ar?"
// Fatos conferidos:
//  - Sustentação: a asa (perfil curvado + ângulo de ataque) desvia o ar para baixo; pela 3ª lei de
//    Newton o ar empurra a asa para cima (junto com a diferença de pressão em cima/embaixo).
//  - A sustentação cresce com o quadrado da velocidade: jatos médios (737/A320, ~70 t no máx.)
//    decolam por volta de 250-290 km/h.
//  - Flaps aumentam a área/curvatura da asa para gerar sustentação em velocidades menores (pouso/decolagem).
//  - Cantos retos concentram tensão; com a cabine pressurizada a cada voo, a fadiga do metal
//    abre rachaduras nas quinas (lição dos acidentes do Comet, anos 1950). Por isso janelas arredondadas.
import * as THREE from 'three';
import { suave, saida, mistura, lim, cartao, etiqueta, ok, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, cilindro, malha, terreno, arvore } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';

export const config = {
  titulo: ['COMO UM', '*AVIÃO*', 'DE 70 TONELADAS', 'FICA NO *AR*?'],
  tituloEstilo: 'meio',
};

const L = new THREE.Vector3(0, 70, -260);   // "laboratório" da asa, no céu
const WX = 3.3;                              // janela em destaque
const PX = 6, PZ = 21;                       // personagem

function aviao() {
  const g = new THREE.Group();
  const branco = mat('#F4F6F8'), azul = mat('#2F6FE0'), amarelo = mat('#F2C14E'), cinza = mat('#9AA3AE', { metal: true });
  const fus = cilindro(2, 28, branco, [0, 3.6, 0], 18);
  fus.rotation.z = Math.PI / 2;
  g.add(fus);
  const faixa = cilindro(2.03, 28, azul, [0, 3.6, 0], 18);
  faixa.rotation.z = Math.PI / 2;
  faixa.scale.set(1, 1, 0.25);
  faixa.position.y = 3.0;
  g.add(faixa);
  const nariz = malha(new THREE.SphereGeometry(2, 18, 12), branco);
  nariz.scale.set(1.8, 1, 1);
  nariz.position.set(14, 3.6, 0);
  g.add(nariz);
  g.add(caixa(1.2, 0.5, 2.4, mat('#1E2A3A', { brilho: true }), [16, 4.4, 0]));
  const cauda = malha(new THREE.ConeGeometry(2, 7, 18), branco);
  cauda.rotation.z = Math.PI / 2;
  cauda.position.set(-17.5, 3.9, 0);
  cauda.scale.set(1, 1, 1);
  g.add(cauda);
  const deriva = caixa(4.5, 6, 0.4, amarelo, [-17.5, 8, 0]);
  deriva.rotation.z = 0.45;
  g.add(deriva);
  g.add(caixa(3.2, 0.3, 11, branco, [-18.5, 4.4, 0]));
  // asas + flaps
  const flaps = [];
  for (const s of [-1, 1]) {
    const asa = caixa(6, 0.5, 15, branco, [0, 2.4, s * 9.4]);
    asa.rotation.y = s * 0.28;
    g.add(asa);
    const piv = new THREE.Group();
    piv.position.set(-3.2, 2.3, s * 8.0);
    piv.rotation.y = s * 0.28;
    piv.add(caixa(1.8, 0.25, 9.5, cinza, [-0.9, 0, s * 0.6]));
    g.add(piv);
    flaps.push(piv);
    const mot = cilindro(1.1, 4.4, cinza, [2.4, 1.2, s * 6.2], 14);
    mot.rotation.z = Math.PI / 2;
    g.add(mot);
    const boca = cilindro(0.85, 0.1, mat('#22252B'), [4.62, 1.2, s * 6.2], 14);
    boca.rotation.z = Math.PI / 2;
    g.add(boca);
  }
  // trem de pouso
  for (const [x, z] of [[11, 0], [-1, 2.2], [-1, -2.2]]) {
    g.add(caixa(0.25, 1.4, 0.25, cinza, [x, 1.0, z]));
    const r = cilindro(0.5, 0.4, mat('#22252B'), [x, 0.5, z], 12);
    r.rotation.x = Math.PI / 2;
    g.add(r);
  }
  // janelas (quadradas ou redondas)
  const quadradas = new THREE.Group(), redondas = new THREE.Group();
  const vidro = mat('#1E2A3A', { brilho: true });
  for (const s of [-1, 1]) for (let x = -11; x <= 11.5; x += 1.3) {
    const z = s * 1.86;
    quadradas.add(caixa(0.62, 0.62, 0.3, vidro, [x, 4.4, z], { sombra: false }));
    const r = malha(new THREE.CylinderGeometry(0.3, 0.3, 0.3, 16), vidro, { sombra: false });
    r.scale.set(1, 1, 1.35);
    r.rotation.x = Math.PI / 2;
    r.rotation.order = 'XYZ';
    const rr = new THREE.Group();
    rr.add(r);
    r.scale.set(1, 1, 1);
    rr.scale.set(1, 1.3, 1);
    rr.position.set(x, 4.4, z);
    redondas.add(rr);
  }
  g.add(quadradas, redondas);
  g.flaps = flaps;
  g.quadradas = quadradas;
  g.redondas = redondas;
  return g;
}

/** Perfil de asa extrudado (bordo de ataque em -x). */
function perfilAsa() {
  const sh = new THREE.Shape();
  const c = 6;
  sh.moveTo(-c / 2, 0);
  for (let i = 1; i <= 20; i++) {
    const u = i / 20, x = -c / 2 + u * c;
    sh.lineTo(x, 0.62 * c * 0.12 * Math.sqrt(u) * (1 - u) * 3.2);
  }
  for (let i = 19; i >= 1; i--) {
    const u = i / 20, x = -c / 2 + u * c;
    sh.lineTo(x, -0.12 * c * 0.12 * Math.sqrt(u) * (1 - u) * 3.2);
  }
  const geo = new THREE.ExtrudeGeometry(sh, { depth: 5, bevelEnabled: false });
  geo.translate(0, 0, -2.5);
  return malha(geo, mat('#F2C14E'));
}

export function criar(ctx) {
  const { cena } = ctx;
  cena.fog.near = 260; cena.fog.far = 900;
  cena.add(terreno(() => 0, (y, i, x, z) => ((Math.floor(x / 20) + Math.floor(z / 20)) % 2 ? '#6CBF47' : '#64B641'),
    { largura: 1800, profundidade: 900, seg: 60 }));
  cena.add(caixa(1600, 0.08, 46, mat('#3A3D44'), [500, 0.04, 0]));
  for (let x = -280; x < 1300; x += 30) cena.add(caixa(12, 0.02, 0.8, mat('#F4F4F4'), [x, 0.09, 0], { sombra: false }));
  for (const z of [-21.5, 21.5]) cena.add(caixa(1600, 0.02, 0.6, mat('#F4F4F4'), [500, 0.09, z], { sombra: false }));
  // terminal e torre
  cena.add(caixa(70, 10, 18, mat('#DCEBF7'), [-10, 5, -75]));
  for (let x = -40; x <= 20; x += 6) cena.add(caixa(4.4, 5, 0.2, mat('#8FC8F0', { brilho: true }), [x, 5.5, -65.9]));
  cena.add(cilindro(2.4, 26, mat('#E9E2D0'), [40, 13, -70], 10), caixa(8, 4, 8, mat('#8FC8F0', { brilho: true }), [40, 28, -70]));
  for (let x = -120; x <= 300; x += 26) for (const s of [-1, 1]) cena.add(arvore(x, 0, s * (48 + (x % 7)), 1.4, Math.abs(x) % 3));
  // nuvens
  const nuvemMat = mat('#FFFFFF', { semNeblina: true });
  [[L.x - 60, L.y - 6, L.z - 140], [L.x + 55, L.y + 14, L.z - 160], [200, 90, -200], [-60, 80, -220], [400, 110, -150]].forEach(([x, y, z], i) => {
    const n = new THREE.Group();
    for (let k = 0; k < 4; k++) { const b = malha(new THREE.IcosahedronGeometry(4 + k, 0), nuvemMat, { sombra: false }); b.position.set(k * 5 - 7, (k % 2) * 2, 0); n.add(b); }
    n.position.set(x, y, z);
    cena.add(n);
  });

  const av = aviao();
  cena.add(av);
  // janela em destaque: tensão nas quinas e rachaduras
  const tensaoMat = mat('#FF3A2A', { unico: true, emissivo: '#FF2A00', opacidade: 0.9 });
  const tensoes = [], trincas = [];
  const trincaMat = mat('#111111');
  for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const q = caixa(0.18, 0.18, 0.05, tensaoMat, [WX + dx * 0.33, 4.4 + dy * 0.33, 2.03], { sombra: false });
    tensoes.push(q);
    av.add(q);
    const tr = caixa(0.5, 0.035, 0.02, trincaMat, [0, 0, 0], { sombra: false });
    tr.userData = { dx, dy };
    trincas.push(tr);
    av.add(tr);
  }
  // laboratório da asa
  const lab = new THREE.Group();
  lab.position.copy(L);
  cena.add(lab);
  const perfil = perfilAsa();
  perfil.rotation.z = 0.14;
  lab.add(perfil);
  const ar = [];
  const arMat = mat('#4FF0FF', { unico: true, emissivo: '#1FB8D8' });
  const alturas = [-2.7, -1.9, -1.15, 1.1, 1.8, 2.6];
  alturas.forEach((h) => { for (let i = 0; i < 26; i++) { const m = caixa(0.15, 0.15, 0.15, arMat, [0, 0, 0], { sombra: false }); lab.add(m); ar.push({ m, h, i }); } });
  const seta = (cor) => {
    const g = new THREE.Group();
    const m = mat(cor, { unico: true, emissivo: cor });
    const corpo = caixa(0.28, 1, 0.28, m, [0, 0.5, 0], { sombra: false });
    const ponta = malha(new THREE.ConeGeometry(0.42, 0.7, 4), m, { sombra: false });
    g.add(corpo, ponta);
    g.def = (Lh) => { corpo.scale.y = Math.max(0.01, Lh); corpo.position.y = Lh / 2; ponta.position.y = Lh + 0.3; };
    return g;
  };
  const setaSobe = seta('#FFD21F');
  setaSobe.position.set(0, 0.7, 2.7);
  lab.add(setaSobe);
  const setaDesce = seta('#4FF0FF');
  setaDesce.rotation.z = Math.PI;
  setaDesce.position.set(4.6, -0.6, 2.7);
  lab.add(setaDesce);

  const voce = criarPersonagem();
  cena.add(voce);

  let E;
  function inicial() {
    E = { ax: 0, ay: 0, pitch: 0, flaps: 0, quadradas: false, tensao: 0, trinca: 0, vento: 0, desvio: 0, sobe: 0, desce: 0, tFluxo: 0 };
    voce.visible = true;
    voce.position.set(PX, 0.05, PZ);
    voce.rotation.y = -0.4;
    voce.estado = { bracos: 'lado', expr: 'feliz' };
  }
  function montar(t) {
    av.position.set(E.ax, E.ay, 0);
    av.rotation.z = E.pitch;
    av.flaps.forEach((f) => (f.rotation.z = -0.55 * E.flaps));
    av.quadradas.visible = E.quadradas;
    av.redondas.visible = !E.quadradas;
    tensoes.forEach((q, i) => {
      q.visible = E.quadradas && E.tensao > 0.02;
      q.scale.setScalar(0.6 + 0.8 * E.tensao * (0.8 + 0.2 * Math.sin(t * 9 + i)));
    });
    trincas.forEach((tr) => {
      const { dx, dy } = tr.userData;
      const Lc = 0.05 + 0.9 * E.trinca;
      tr.visible = E.quadradas && E.trinca > 0.02;
      tr.scale.x = Lc / 0.5;
      const a = Math.atan2(dy, dx);
      tr.rotation.z = a;
      tr.position.set(WX + dx * 0.31 + Math.cos(a) * Lc / 2, 4.4 + dy * 0.31 + Math.sin(a) * Lc / 2, 2.04);
    });
    // fluxo de ar no laboratório
    ar.forEach(({ m, h, i }) => {
      m.visible = E.vento > 0.02;
      const x = -9 + (((i / 26) * 18 + t * 5.5) % 18);
      const perto = Math.exp(-((x / 3.4) ** 2));
      const bump = h > 0 ? 0.55 * perto * Math.exp(-(h - 1) / 1.6) : -0.15 * perto;
      const desc = -E.desvio * 2.6 * suave((x + 1) / 6) * Math.exp(-Math.abs(h) / 2.6);
      m.position.set(x, h + bump * E.desvio + desc, (h > 0 ? 1 : -1) * 0.2 + 2.6);
      m.scale.setScalar(E.vento);
    });
    setaSobe.visible = E.sobe > 0.02;
    setaSobe.def(3.2 * E.sobe);
    setaDesce.visible = E.desce > 0.02;
    setaDesce.def(1.8 * E.desce);
  }
  const apresentar = (lt, b, bracos = 'aponta', expr = 'feliz') => {
    voce.visible = true;
    voce.position.set(PX, 0.05, PZ);
    voce.rotation.y = -0.4;
    voce.estado = { bracos, expr, falando: b.falando(lt) };
  };
  const camApresentador = { pos: [PX + 2.6, 1.9, PZ + 4.6], alvo: [PX + 0.2, 1.6, PZ] };
  const camLab = { pos: [L.x + 0.5, L.y + 0.3, L.z + 15], alvo: [L.x + 0.5, L.y - 0.2, L.z] };

  const blocos = [
    {
      fala: 'Como um avião de setenta toneladas consegue ficar no ar, sem bater as asas?',
      destaque: ['setenta', 'toneladas', 'ar'],
      camera: { pos: [9.5, 2.4, 28], alvo: [4, 3.4, 0] },
      cameraFim: { pos: [10.5, 2.8, 32], alvo: [3, 3.6, 0] },
      aplicar(lt, b) { E.flaps = 1; apresentar(lt, b, 'aponta', 'surpreso'); voce.position.set(8.4, 0.05, 20.5); voce.rotation.y = 0.5; },
    },
    {
      fala: 'Então você põe uma asa com a frente arredondada, curvadinha em cima, e um pouco inclinada.',
      destaque: ['asa', 'curvadinha', 'inclinada'],
      corteSeco: true,
      camera: camLab,
      cameraFim: { pos: [L.x - 1, L.y + 1.2, L.z + 12], alvo: [L.x, L.y, L.z] },
      aplicar(lt, b) { E.flaps = 0; voce.visible = false; E.vento = 0; },
    },
    {
      fala: 'Quando o ar passa, a asa joga o ar pra baixo... e o ar empurra a asa pra cima.',
      destaque: ['baixo', 'cima'],
      camera: camLab,
      aplicar(lt, b) {
        E.vento = suave(lt / 0.5);
        E.desvio = suave((lt - b.palavra('joga') + 0.2) / 0.8);
        E.desce = suave((lt - b.palavra('baixo') + 0.2) / 0.5);
        E.sobe = suave((lt - b.palavra('cima') + 0.3) / 0.6);
      },
      camada: (lt, b) => cartao(lt, b.palavra('cima'), 'SUSTENTAÇÃO', 'A FORÇA QUE SEGURA O AVIÃO'),
      sons: [{ em: 'cima', tipo: 'zap' }],
    },
    {
      fala: 'Mas com pouco vento, essa força é fraquinha demais pra segurar setenta toneladas.',
      destaque: ['pouco', 'fraquinha'],
      corteSeco: true,
      camera: { pos: [L.x + 7, L.y + 1, L.z + 12], alvo: [L.x, L.y, L.z] },
      aplicar(lt, b) {
        E.vento = 1; E.desvio = 0.25; E.sobe = 0.18; E.desce = 0.1;
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('fraquinha'), 'PRECISA DE MUITO VENTO'),
    },
    {
      fala: 'Então você põe motores enormes, que empurram o avião pela pista, até uns duzentos e oitenta quilômetros por hora.',
      destaque: ['motores', 'duzentos', 'oitenta'],
      corteSeco: true,
      camera: (lt) => ({ pos: [E.ax - 12, 2.6, 24], alvo: [E.ax + 4, 3.5, 0] }),
      aplicar(lt, b) {
        E.vento = 0; E.sobe = 0; E.desce = 0;
        E.ax = 4 * lt * lt;
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('duzentos'), '≈ 280 KM/H'),
      sons: [{ em: 'motores', tipo: 'gargalo' }],
    },
    {
      fala: 'Aí o vento na asa fica tão forte que ele levanta voo!',
      destaque: ['levanta', 'voo'],
      camera: (lt) => ({ pos: [E.ax - 20, 3 + E.ay * 0.5, 40], alvo: [E.ax + 8, E.ay + 5, 0] }),
      aplicar(lt, b) {
        const x0 = 380, v = 78;
        E.ax = x0 + v * lt;
        const r = b.palavra('levanta') - 0.3;
        E.pitch = 0.16 * suave((lt - r) / 0.6);
        E.ay = lt > r ? 9 * (lt - r) ** 1.5 : 0;
        E.flaps = 0.5;
      },
      sons: [{ em: 'levanta', tipo: 'ok' }],
    },
    {
      fala: 'É por isso que, no pouso e na decolagem, a asa abre umas abas atrás: os flaps. Eles deixam a asa maior, pra voar devagar sem cair.',
      destaque: ['flaps', 'maior', 'devagar'],
      corteSeco: true,
      camera: (lt, b) => (lt < b.palavra('flaps') - 0.2 ? camApresentador : { pos: [-12, 7, 28], alvo: [-2, 2.4, 9] }),
      aplicar(lt, b) {
        E.ax = 0; E.ay = 0; E.pitch = 0;
        E.flaps = suave((lt - b.palavra('flaps') + 0.1) / 1.0);
        apresentar(lt, b, 'aponta');
        if (lt >= b.palavra('flaps') - 0.2) voce.visible = false;
      },
      camada: (lt, b) => cartao(lt, b.palavra('flaps'), 'FLAPS', 'A ASA ESTICA PRA VOAR DEVAGAR'),
    },
    {
      fala: 'Mas se a janela tiver cantos retos, a força se acumula nas quinas, e depois de muitos voos o metal racha ali.',
      destaque: ['cantos', 'quinas', 'racha'],
      corteSeco: true,
      camera: { pos: [WX + 0.3, 4.4, 6.2], alvo: [WX, 4.4, 2] },
      aplicar(lt, b) {
        E.flaps = 0; E.quadradas = true;
        E.tensao = suave((lt - b.palavra('acumula') + 0.2) / 0.6);
        E.trinca = suave((lt - b.palavra('racha') + 0.1) / 0.7);
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('racha'), 'FADIGA DO METAL'),
      sons: [{ em: 'racha', tipo: 'rachando' }],
    },
    {
      fala: 'É por isso que a janela de avião é toda arredondada!',
      destaque: ['arredondada'],
      corteSeco: true,
      camera: { pos: [WX + 3.5, 4.6, 8.5], alvo: [WX - 1, 4.3, 2] },
      aplicar(lt, b) { E.quadradas = false; E.tensao = 0; E.trinca = 0; },
      camada: (lt, b) => ok(lt, b.palavra('arredondada')),
      sons: [{ em: 'arredondada', tipo: 'ok' }],
    },
    {
      fala: 'Parabéns: você construiu um avião!',
      destaque: ['parabéns', 'avião'],
      corteSeco: true,
      camera: { pos: [PX + 1.5, 2.2, PZ + 8], alvo: [PX - 3, 3, PZ - 6] },
      aplicar(lt, b) {
        voce.visible = true;
        voce.position.set(PX, 0.05, PZ);
        voce.rotation.y = 0.1;
        voce.estado = { bracos: 'cima', expr: 'feliz', pulo: 1 };
      },
      sons: [{ em: 'parabens', tipo: 'ok' }],
    },
    {
      fala: FALA_FINAL,
      semLegenda: true,
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) { apresentar(lt, b, lt > 2.4 ? 'aponta' : 'aceno'); },
      camada: (lt) => textoFinal(lt),
    },
  ];

  return { blocos, inicial, sempre(t) { montar(t); voce.animar(t); } };
}
