// VÍDEO: "E se você sentisse o perigo antes de ele acontecer?" (Short, vertical)
// Cada frase narrada aparece na tela no momento em que é dita.
// Cenas: rua (carro e pulo), cozinha (copo quebra e a cena volta no tempo), campo (bola),
// rua com pássaro, quarto (cansaço e silêncio). O personagem olha para a câmera nas falas de contato.
import * as THREE from 'three';
import { cartao, etiqueta, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, cilindro, malha, carro } from '../mundo.js';
import { criarRua } from '../cenarios/rua.js';

export const config = {
  titulo: ['E SE SEUS', 'REFLEXOS FOSSEM', '*SOBRE-HUMANOS*?'],
  tituloEstilo: 'meio',
  sonsAuto: false, // só os 3 sons escolhidos, cada um uma vez
};

const CORES_CENA = { rua: '#9ED8FF', cozinha: '#1F5C5E', campo: '#8ED6FF', quarto: '#2B2E4A' };
const CALCADA_LONGE = -5.8, CALCADA_PERTO = 5.8; // calçada de cada lado da rua (z)
const smooth = (x) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };

// ---------- stickman fortinho (estilo deste vídeo) ----------
const up = new THREE.Vector3(0, 1, 0);
function segmento(mesh, a, b) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
  const d = B.clone().sub(A);
  mesh.position.copy(A.clone().add(B).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(up, d.clone().normalize());
  mesh.scale.set(1, d.length(), 1);
}
const POSES = {
  normal: { D: [0.36, 0.92, 0.05], E: [-0.36, 0.92, 0.05] },
  lado: { D: [0.62, 1.18, 0.05], E: [-0.3, 0.95, 0.05] },
  aponta: { D: [0.2, 1.25, 0.8], E: [-0.36, 0.92, 0.05] },
  cima: { D: [0.55, 1.85, 0], E: [-0.55, 1.85, 0] },
  aceno: { D: [0.6, 1.7, 0.05], E: [-0.36, 0.92, 0.05] },
  cabeca: { D: [0.3, 1.5, 0.15], E: [-0.3, 1.5, 0.15] },
};
function stickman() {
  // personagem de óculos redondos, com as roupas da casa (camisa amarela sem zíper, calça preta, tênis branco com sola vermelha)
  const g = new THREE.Group();
  const corpo = new THREE.Group();
  g.add(corpo);
  const PELE = '#E8B48A', PELE_SOMBRA = '#D39B70', CABELO = '#3B2416', CABELO_CLARO = '#4E3320', JAQUETA = '#F2B705', GOLA = '#D99A04', CALCA = '#161616', TENIS = '#F4F4F4', SOLA = '#C62828', OLHO = '#1A1A1A', ARMACAO = '#1E1E1E', BOCA = '#8B2D2D';
  const M = (c) => mat(c, { unico: false });
  const peca = (geo, cor, pos, rot = null, sc = null) => {
    const m = malha(geo, M(cor), { sombra: false });
    m.position.set(...pos);
    if (rot) m.rotation.set(...rot);
    if (sc) m.scale.set(...sc);
    corpo.add(m);
    return m;
  };
  const esf = (r, cor, pos, sc = [1, 1, 1]) => peca(new THREE.SphereGeometry(r, 28, 20), cor, pos, null, sc);
  // ----- tronco e quadril -----
  peca(new THREE.CylinderGeometry(0.2, 0.165, 0.5, 32), JAQUETA, [0, 1.03, 0]);
  peca(new THREE.CylinderGeometry(0.115, 0.125, 0.06, 24), GOLA, [0, 1.3, 0]);
  peca(new THREE.CylinderGeometry(0.165, 0.155, 0.2, 32), CALCA, [0, 0.79, 0]);
  // ----- pescoço, cabeça e rosto -----
  peca(new THREE.CylinderGeometry(0.075, 0.08, 0.14, 20), PELE_SOMBRA, [0, 1.4, 0]);
  esf(0.19, PELE, [0, 1.6, 0.02], [0.96, 1.06, 0.96]);
  esf(0.035, PELE, [-0.19, 1.6, 0], [0.5, 1, 0.9]);
  esf(0.035, PELE, [0.19, 1.6, 0], [0.5, 1, 0.9]);
  esf(0.03, PELE, [0, 1.56, 0.205], [0.9, 1.2, 1.1]);
  // cabelo em camadas: calota, franja e nuca
  esf(0.21, CABELO, [0, 1.7, -0.03], [1.0, 0.7, 1.04]);
  esf(0.19, CABELO_CLARO, [0.02, 1.7, 0.1], [0.9, 0.26, 0.5]);
  esf(0.17, CABELO, [0, 1.56, -0.13], [0.95, 0.55, 0.45]);
  // sobrancelhas, óculos redondos e hastes
  peca(new THREE.BoxGeometry(0.07, 0.012, 0.01), CABELO, [-0.075, 1.7, 0.2]);
  peca(new THREE.BoxGeometry(0.07, 0.012, 0.01), CABELO, [0.075, 1.7, 0.2]);
  for (const x of [-0.075, 0.075]) {
    peca(new THREE.TorusGeometry(0.055, 0.012, 12, 28), ARMACAO, [x, 1.6, 0.225]);
    esf(0.022, OLHO, [x, 1.6, 0.232]);
  }
  peca(new THREE.BoxGeometry(0.05, 0.012, 0.012), ARMACAO, [0, 1.61, 0.225]);
  peca(new THREE.BoxGeometry(0.012, 0.012, 0.15), ARMACAO, [-0.15, 1.61, 0.15]);
  peca(new THREE.BoxGeometry(0.012, 0.012, 0.15), ARMACAO, [0.15, 1.61, 0.15]);
  const boca = peca(new THREE.BoxGeometry(0.085, 0.02, 0.02), BOCA, [0, 1.52, 0.228]);
  // ----- pernas e tênis -----
  const pernas = [];
  for (const x of [-0.1, 0.1]) {
    const coxa = malha(new THREE.CylinderGeometry(0.075, 0.07, 1, 20), M(CALCA), { sombra: false });
    const canela = malha(new THREE.CylinderGeometry(0.062, 0.05, 1, 20), M(CALCA), { sombra: false });
    corpo.add(coxa, canela);
    const pe = peca(new THREE.SphereGeometry(0.1, 20, 14), TENIS, [x + 0.02, 0.07, 0.04], null, [1.0, 0.55, 1.6]);
    peca(new THREE.SphereGeometry(0.06, 16, 10), SOLA, [x + 0.02, 0.025, 0.05], null, [1.1, 0.2, 1.8]);
    pernas.push({ coxa, canela, a: [x, 0.78, 0], k: [x * 1.2, 0.42, 0.0], b: [x * 1.1, 0.1, 0.0] });
  }
  // ----- braços: ombro -> cotovelo -> punho, mão com dedos -----
  const ombros = { D: [0.27, 1.22, 0], E: [-0.27, 1.22, 0] };
  const bracos = {};
  for (const k of ['D', 'E']) {
    const sup = malha(new THREE.CylinderGeometry(0.06, 0.055, 1, 20), M(JAQUETA), { sombra: false });
    const ant = malha(new THREE.CylinderGeometry(0.055, 0.05, 1, 20), M(JAQUETA), { sombra: false });
    const cotovelo = esf(0.058, JAQUETA, [0, 0, 0]);
    const mao = esf(0.07, PELE, [0, 0, 0], [1, 0.9, 0.8]);
    const polegar = esf(0.028, PELE, [0, 0, 0]);
    corpo.add(sup, ant);
    bracos[k] = { sup, ant, cotovelo, mao, polegar };
  }
  g.corpo = corpo; g.boca = boca; g.olhos = []; g.ombros = ombros; g.bracos = bracos; g.pernas = pernas;
  g.estado = { bracos: 'normal', expr: 'feliz' };
  g.traverse((o) => { if (o.isMesh) { o.receiveShadow = false; o.castShadow = false; } });
  g.animar = (t) => {
    const e = g.estado || {};
    const p = POSES[e.bracos] || POSES.normal;
    for (const k of ['D', 'E']) {
      const { sup, ant, cotovelo, mao, polegar } = g.bracos[k];
      const a = ombros[k], m = p[k];
      const c = [(a[0] + m[0]) / 2 + (k === 'D' ? 0.05 : -0.05), (a[1] + m[1]) / 2 - 0.06, (a[2] + m[2]) / 2 + 0.04];
      segmento(sup, a, c);
      segmento(ant, c, m);
      cotovelo.position.set(...c);
      mao.position.set(...m);
      polegar.position.set(m[0] + (k === 'D' ? 0.05 : -0.05), m[1] + 0.03, m[2] + 0.03);
    }
    g.pernas.forEach((pn) => { segmento(pn.coxa, pn.a, pn.k); segmento(pn.canela, pn.k, pn.b); });
    const sobe = e.pulo ? 0.12 * Math.abs(Math.sin(t * 6)) : 0;
    corpo.position.y = sobe + 0.008 * Math.sin(t * 3);
    const abertura = { feliz: 0.6, sorriso: 0.9, serio: 0.35, surpreso: 2.2, preocupado: 1.3 }[e.expr] || 0.6;
    boca.scale.y = e.falando ? abertura * (0.6 + 0.6 * Math.abs(Math.sin(t * 20))) : abertura;
  };
  return g;
}
// ---------- carro redondinho ----------
function carroRedondo(cor) {
  const g = new THREE.Group();
  g.add(caixa(4.2, 0.6, 1.9, mat(cor), [0, 0.7, 0]));
  const cabine = malha(new THREE.SphereGeometry(1, 16, 12), mat(cor), { sombra: false });
  cabine.scale.set(1.0, 0.55, 0.9);
  cabine.position.set(-0.2, 1.25, 0);
  g.add(cabine);
  const vidro = malha(new THREE.SphereGeometry(1, 14, 10), mat('#9BE3FF'), { sombra: false });
  vidro.scale.set(0.8, 0.4, 0.78);
  vidro.position.set(-0.2, 1.3, 0);
  g.add(vidro);
  for (const x of [1.3, -1.3]) for (const z of [0.98, -0.98]) {
    const roda = cilindro(0.42, 0.3, mat('#222222'), [x, 0.42, z], 16);
    roda.rotation.x = Math.PI / 2;
    g.add(roda);
  }
  g.rodar = () => {};
  return g;
}

export function criar(ctx) {
  const { cena } = ctx;
  const ruaG = new THREE.Group(), cozG = new THREE.Group(), campoG = new THREE.Group(), quartoG = new THREE.Group(), corpoG = new THREE.Group();
  [ruaG, cozG, campoG, quartoG, corpoG].forEach((g) => cena.add(g));

  // ---------- rua (carro e pássaro) ----------
  criarRua({ cena: ruaG, hemi: ctx.hemi, sol: ctx.sol }, { transversal: false, recuo: 16 });
  const auto = carroRedondo('#FFB300');
  auto.rotation.y = Math.PI;
  auto.position.set(0, 0.03, -2);
  ruaG.add(auto);
  // sombra de pássaro passando pelo chão (escura e transparente)
  const sombra = malha(new THREE.CircleGeometry(0.7, 16), mat('#0B0B12', { opacidade: 0.35, semNeblina: true }), { sombra: false });
  sombra.rotation.x = -Math.PI / 2;
  sombra.scale.set(1.6, 0.6, 1);
  sombra.position.set(0, 0.06, CALCADA_PERTO);
  ruaG.add(sombra);

  // ---------- cozinha (caneca) ----------
  cozG.add(caixa(6, 0.1, 4, mat('#3B3430'), [0, -0.05, 0.5]));
  cozG.add(caixa(6, 3, 0.1, mat('#2F7F80'), [0, 1.5, -1.5]));
  cozG.add(caixa(2.6, 0.9, 0.7, mat('#7A4E2D'), [1.2, 0.45, -0.7]));
  cozG.add(caixa(2.7, 0.06, 0.8, mat('#E6DCC8'), [1.2, 0.93, -0.7]));
  cozG.add(caixa(0.9, 0.5, 0.05, mat('#FFD21F'), [-1.3, 1.6, -1.44]));
  const caneca = new THREE.Group();
  caneca.add(cilindro(0.07, 0.14, mat('#FF7A1A', { unico: true }), [0, 0, 0], 12));
  caneca.position.set(0.8, 1.0, 0.0);
  cozG.add(caneca);
  const CACO_X = 0.8;
  const cacos = [];
  for (let i = 0; i < 6; i++) {
    const c = caixa(0.05, 0.05, 0.05, mat('#FF7A1A', { unico: true }), [0, 0, 0], { sombra: false });
    cozG.add(c);
    cacos.push(c);
  }
  const VX = [-0.5, 0.4, -0.2, 0.6, 0.1, -0.4], VY = [0.3, 0.5, 0.2, 0.4, 0.6, 0.1], VZ = [0.2, -0.3, 0.4, -0.1, 0.3, -0.2];

  // ---------- campo (bola rolando) ----------
  campoG.add(caixa(16, 0.1, 10, mat('#4CAF50'), [0, -0.05, -1]));
  campoG.add(caixa(0.08, 0.02, 10, mat('#FFFFFF'), [-5, 0.01, -1], { sombra: false }));
  campoG.add(caixa(0.08, 0.02, 10, mat('#FFFFFF'), [5, 0.01, -1], { sombra: false }));
  campoG.add(caixa(0.12, 1.2, 0.12, mat('#FFFFFF'), [-6, 0.6, -1]));
  const bola = malha(new THREE.SphereGeometry(0.22, 14, 10), mat('#FFFFFF'), { sombra: false });
  bola.position.set(-9, 0.22, 0);
  campoG.add(bola);

  // ---------- quarto (bocejo) ----------
  quartoG.add(caixa(6, 0.1, 4, mat('#5A4636'), [0, -0.05, 0.5]));
  quartoG.add(caixa(6, 3, 0.1, mat('#3A3F6B'), [0, 1.5, -1.5]));
  quartoG.add(caixa(2.4, 0.5, 1.4, mat('#4C7DD6'), [-1.6, 0.25, -0.7]));
  quartoG.add(caixa(2.4, 0.2, 1.4, mat('#F4F4F4'), [-1.6, 0.6, -0.7]));
  quartoG.add(caixa(0.6, 0.18, 0.4, mat('#FFFFFF'), [-2.1, 0.8, -1.1]));
  quartoG.add(cilindro(0.04, 0.5, mat('#2A2D33'), [1.8, 0.9, -1.0], 8));
  quartoG.add(caixa(0.35, 0.25, 0.35, mat('#FFD21F', { brilho: true }), [1.8, 1.25, -1.0]));

  // ---------- personagem ----------
  const voce = stickman();
  corpoG.add(voce);

  let E;
  function inicial() {
    E = { amb: 'rua', mov: 'parado', t0: 0, tB: null, tC: null };
    voce.visible = true;
    voce.position.set(0, 0.05, CALCADA_PERTO);
    voce.rotation.y = 0;
    voce.estado = { bracos: 'lado', expr: 'feliz' };
  }
  function setar(amb, mov, t0, pose, expr) {
    E.amb = amb; E.mov = mov; E.t0 = t0;
    voce.estado = { bracos: pose || 'normal', expr: expr || 'feliz' };
  }

  function montar(t) {
    const lt = t - E.t0;
    const amb = E.amb;
    ruaG.visible = amb === 'rua';
    cozG.visible = amb === 'cozinha';
    campoG.visible = amb === 'campo';
    quartoG.visible = amb === 'quarto';
    cena.background.set(CORES_CENA[amb]);

    // carro: entra devagar pela direita, e depois passa em alta velocidade
    let carroX = null;
    if (E.tB != null && t >= E.tB) {
      if (E.tC == null || t < E.tC) carroX = 24 - 4.6 * (t - E.tB);
      else carroX = 8 - 20 * (t - E.tC);
      if (E.tC != null && t > E.tC + 4.5) carroX = null;
    }
    if (carroX != null && amb === 'rua') { auto.visible = true; auto.position.x = carroX; auto.rodar(carroX); } else auto.visible = false;

    // personagem
    voce.visible = true;
    voce.position.set(0, 0.05, CALCADA_PERTO);
    voce.rotation.y = 0;
    if (E.mov === 'hook') {
      // olha direto para a câmera
    } else if (E.mov === 'andar') {
      voce.rotation.y = Math.PI;
      voce.position.z = CALCADA_PERTO - (CALCADA_PERTO - 0.6) * smooth(lt / 1.8);
    } else if (E.mov === 'parar') {
      voce.position.z = 0.6;
      voce.rotation.y = Math.PI / 2 * smooth(lt / 0.4); // vira para o carro
    } else if (E.mov === 'pulo') {
      const k = smooth(lt / 0.3);
      voce.position.z = 0.6 + (CALCADA_PERTO - 0.6) * k;
      voce.position.y = 0.05 + 0.25 * Math.sin(Math.PI * Math.min(1, lt / 0.3));
      voce.rotation.y = Math.PI / 2 * (1 - smooth(lt / 0.4));
    } else if (E.mov === 'copo') {
      voce.position.set(0, 0.05, 0);
      voce.rotation.y = 0;
      copo(lt, 'queda');
    } else if (E.mov === 'copo_volta') {
      voce.position.set(0, 0.05, 0);
      voce.rotation.y = 0;
      copo(lt, 'volta');
    } else if (E.mov === 'bola') {
      voce.position.set(0, 0.05, 0);
      voce.rotation.y = -Math.PI / 2 * smooth((lt - 0.2) / 0.5); // vira para o lado de onde a bola vem
      bola.position.set(Math.min(0.2, -9 + Math.max(0, lt - 0.8) * 5.8), 0.22, 0);
    } else if (E.mov === 'passaro') {
      voce.position.set(0, 0.05, CALCADA_PERTO);
      voce.rotation.y = 0.35 * Math.sin(Math.min(1, lt) * 12) * (lt < 1.2 ? 1 : 0);
      sombra.visible = true;
      sombra.position.x = -7 + 14 * Math.min(1, Math.max(0, (lt - 0.6) / 2.2));
      sombra.position.z = CALCADA_PERTO;
    } else if (E.mov === 'pega') {
      voce.position.set(0, 0.05, 0);
      voce.rotation.y = 0;
      caneca.visible = true;
      caneca.position.set(CACO_X, Math.max(0.55, 1.0 - 12 * lt * lt), 0);
      cacos.forEach((c) => (c.visible = false));
    } else if (E.mov === 'bocejo') {
      voce.position.set(0, 0.05, 0);
      voce.rotation.y = 0;
    } else if (E.mov === 'ouvidos') {
      voce.position.set(0, 0.05, 0);
      voce.rotation.y = 0;
    }
    if (E.mov !== 'passaro') sombra.visible = false;
    if (E.mov !== 'bola') bola.position.set(-9, 0.22, 0);
  }

  /** Cena da caneca: cai, quebra (copo) e, depois, volta no tempo e é pega. */
  function copo(lt, fase) {
    let sec = lt;
    if (fase === 'volta') {
      if (lt < 0.9) sec = 0.9 - lt; // a cena volta: os cacos juntam e a caneca sobe
      else {
        const tq = lt - 0.9; // depois, cai de novo e é pega antes de tocar o chão
        caneca.visible = true;
        caneca.position.set(CACO_X, Math.max(0.55, 1.0 - 12 * tq * tq), 0);
        cacos.forEach((c) => (c.visible = false));
        return;
      }
    }
    if (sec < 0.45) {
      caneca.visible = true;
      caneca.position.set(CACO_X, Math.max(0.07, 1.0 - 4.59 * sec * sec), 0);
      cacos.forEach((c) => (c.visible = false));
    } else {
      caneca.visible = false;
      const u = Math.min(1, (sec - 0.45) / 0.45);
      cacos.forEach((c, i) => {
        c.visible = true;
        c.position.set(CACO_X + VX[i] * 0.35 * u, 0.07 + VY[i] * 0.3 * Math.sin(Math.PI * u) + 0.02, VZ[i] * 0.35 * u);
      });
    }
  }

  const camRosto = { pos: [0.0, 1.55, 9.0], alvo: [0.0, 1.4, 5.8] };
  const blocos = [
    { fala: 'E se você visse o mundo em câmera lenta?', destaque: ['câmera lenta'], corteSeco: true, camera: camRosto,
      aplicar(lt, b) { setar('rua', 'hook', b.inicio, 'normal', 'surpreso'); }, sons: [{ em: () => 0.2, tipo: 'brilho' }] },
    { fala: 'Uma bola de tênis vem na sua direção.', destaque: ['bola de tênis'], corteSeco: true, camera: { pos: [-3.0, 1.6, 5.0], alvo: [-1.0, 1.0, 0.0] },
      aplicar(lt, b) { setar('campo', 'bola', b.inicio, 'aponta', 'serio'); }, sons: [{ em: () => 0.8, tipo: 'martelo' }] },
    { fala: 'Você estende a mão e pega, antes de ela chegar.', destaque: ['pega', 'antes'], corteSeco: true, camera: { pos: [0.6, 2.2, 3.6], alvo: [0.4, 0.9, 0.2] },
      aplicar(lt, b) { setar('cozinha', 'pega', b.inicio, 'aponta', 'feliz'); }, sons: [{ em: () => 0.6, tipo: 'pop' }] },
    { fala: 'Só que o barulho da cidade chega alto demais.', destaque: ['barulho', 'alto demais'], corteSeco: true, camera: camRosto,
      aplicar(lt, b) { setar('rua', 'parado', b.inicio, 'lado', 'preocupado'); }, camada: (lt) => etiqueta(lt, 0.3, 'BARULHO ALTO DEMAIS') },
    { fala: 'Você não dorme, porque o corpo nunca desliga.', destaque: ['não dorme', 'desliga'], corteSeco: true, camera: { pos: [0.6, 1.5, 3.0], alvo: [0, 1.3, 0] },
      aplicar(lt, b) { setar('quarto', 'bocejo', b.inicio, 'cabeca', 'serio'); } },
    { fala: 'Você trocaria a sua velocidade pela paz?', destaque: ['velocidade', 'paz'], corteSeco: true, camera: camRosto,
      aplicar(lt, b) { setar('rua', 'hook', b.inicio, 'normal', 'serio'); }, sons: [{ em: () => 1.0, tipo: 'plim' }] },
  ];

  return { blocos, inicial, sempre(t) { montar(t); voce.animar(t); } };
}
