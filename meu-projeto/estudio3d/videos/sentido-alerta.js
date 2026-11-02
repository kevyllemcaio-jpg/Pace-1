// VÍDEO LONGO (8 min, horizontal): reflexos e tempo de reação.
// Cada bloco tem o cenário do que está sendo falado:
//   sala (mesa com régua) · consultório (reflexo do joelho) · pista de atletismo (largada) · rua (carro)
// Fatos conferidos:
//  - Régua que cai 30 cm: t = raiz(2d/g) ≈ 0,25 s (tempo de reação visual típico: ~0,2 a 0,3 s).
//  - Largada de corrida: reação abaixo de 0,1 s é falsa largada (regra da World Athletics).
//    Um estudo de 2009 já registrou velocistas reagindo em ~0,08 s, então não dizemos "ninguém reage".
//  - Reflexo do joelho: o sinal faz um arco curto pela medula, sem passar pelo cérebro.
//    Não encontrei fonte para o tempo exato, então o vídeo não dá número para ele.
import * as THREE from 'three';
import { cartao, etiqueta, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, cilindro, malha, carro } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';
import { criarRua } from '../cenarios/rua.js';

export const config = {
  titulo: ['E SE VOCÊ', 'SENTISSE O', '*PERIGO* ANTES?'],
  tituloEstilo: 'meio',
  sonsAuto: false,
};

const REGUA_TOPO = 1.45;   // centro da régua antes de cair
const QUEDA_30 = 0.3;
const G = 9.8;
const CORES_CENA = { sala: '#F3E3C8', consultorio: '#E6F0F5', pista: '#1B1F3B', cozinha: '#1F5C5E', rua: '#9ED8FF' };

/** Caminho por pontos: devolve f(u) com u em [0,1) (fecha o ciclo). */
function curva(pontos) {
  const seg = [];
  let total = 0;
  for (let i = 0; i < pontos.length - 1; i++) {
    const a = pontos[i], b = pontos[i + 1];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    seg.push(L);
    total += L;
  }
  return (u) => {
    let d = (((u % 1) + 1) % 1) * total;
    for (let i = 0; i < seg.length; i++) {
      if (d <= seg[i] || i === seg.length - 1) {
        const k = seg[i] ? Math.min(1, d / seg[i]) : 0;
        const a = pontos[i], b = pontos[i + 1];
        return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
      }
      d -= seg[i];
    }
    return pontos[pontos.length - 1];
  };
}

export function criar(ctx) {
  const { cena } = ctx;
  const MED_X = -1.0; // medula (esquema) à esquerda do personagem

  // ---------- grupos de cenário (só um fica visível por vez) ----------
  const corpoG = new THREE.Group();   // personagem, régua, sinal e esquema (aparece sobre qualquer cenário)
  const salaG = new THREE.Group();
  const consG = new THREE.Group();
  const pistaG = new THREE.Group();
  const cozinhaG = new THREE.Group();
  const ruaG = new THREE.Group();
  [corpoG, salaG, consG, pistaG, cozinhaG, ruaG].forEach((g) => cena.add(g));
  criarRua({ cena: ruaG, hemi: ctx.hemi, sol: ctx.sol }, { transversal: false, recuo: 11 });

  const madeira = mat('#B98A5C');

  // sala: mesa de estudo com livros, luminária e janela
  salaG.add(caixa(6, 0.1, 4, mat('#C9A27A'), [0, -0.05, 0.5]));
  salaG.add(caixa(6, 3, 0.1, mat('#F7EBD9'), [0, 1.5, -1.5]));
  salaG.add(caixa(1.0, 1.0, 0.05, mat('#9ED8FF', { brilho: true, emissivo: '#5C8FB0' }), [-1.8, 1.8, -1.44]));
  salaG.add(caixa(1.1, 0.05, 0.6, madeira, [1.6, 0.78, -0.6]));
  for (const [x, z] of [[1.1, -0.85], [2.1, -0.85], [1.1, -0.35], [2.1, -0.35]]) salaG.add(caixa(0.05, 0.76, 0.05, madeira, [x, 0.38, z]));
  salaG.add(caixa(0.5, 0.06, 0.36, mat('#3D6FB0'), [1.45, 0.84, -0.6]));
  salaG.add(caixa(0.5, 0.06, 0.36, mat('#E8322B'), [1.45, 0.9, -0.6]));
  salaG.add(caixa(0.42, 0.05, 0.3, mat('#2DBE60'), [1.5, 0.95, -0.62]));
  salaG.add(cilindro(0.03, 0.5, mat('#2A2D33'), [2.45, 1.03, -1.0], 8));
  salaG.add(caixa(0.3, 0.2, 0.3, mat('#FFD21F', { brilho: true }), [2.45, 1.38, -1.0]));

  // consultório: parede clara, maca, armário e martelo de reflexo sobre a mesa
  consG.add(caixa(6, 0.1, 4, mat('#D6E0E6'), [0, -0.05, 0.5]));
  consG.add(caixa(6, 3, 0.1, mat('#F5FAFC'), [0, 1.5, -1.5]));
  consG.add(caixa(0.9, 1.9, 0.45, mat('#EEF3F6'), [2.6, 0.95, -1.25]));
  consG.add(caixa(1.9, 0.08, 0.7, mat('#9CC9E6'), [1.7, 0.8, -0.6]));
  for (const [x, z] of [[1.1, -0.9], [2.3, -0.9], [1.1, -0.3], [2.3, -0.3]]) consG.add(caixa(0.08, 0.76, 0.08, mat('#8A9AA6', { metal: true }), [x, 0.38, z]));
  consG.add(caixa(0.05, 0.2, 0.05, mat('#3D434C'), [1.2, 0.93, -0.5]));
  const cabeca = malha(new THREE.SphereGeometry(0.07, 10, 8), mat('#E8322B'), { sombra: false });
  cabeca.position.set(1.2, 1.06, -0.5);
  consG.add(cabeca);
  consG.add(caixa(0.45, 0.6, 0.02, mat('#3FA7D6'), [2.6, 1.6, -1.27]));

  // pórtico de luzes de largada (visto de frente, fundo escuro com grade)
  pistaG.add(caixa(14, 0.1, 9, mat('#2A2F55'), [0, -0.05, -1.5]));
  for (let x = -4; x <= 4; x += 0.8) pistaG.add(caixa(0.02, 0.02, 14, mat('#3A4070'), [x, 0.01, -2], { sombra: false }));
  pistaG.add(caixa(3.2, 0.12, 0.3, mat('#5B6390'), [0, 2.6, -3.2]));
  for (const x of [-1.5, 1.5]) pistaG.add(caixa(0.12, 2.6, 0.3, mat('#5B6390'), [x, 1.3, -3.2]));
  const luzesL = [];
  for (let i = 0; i < 5; i++) {
    const l = malha(new THREE.CylinderGeometry(0.13, 0.13, 0.08, 14), mat('#E8322B', { unico: true, emissivo: '#000000', semNeblina: true }), { sombra: false });
    l.rotation.x = Math.PI / 2;
    l.position.set(-1.2 + i * 0.6, 2.45, -3.02);
    pistaG.add(l);
    luzesL.push(l);
  }

  // cozinha: parede verde-azulada, balcão de madeira, prateleira e caneca na borda
  cozinhaG.add(caixa(6, 0.1, 4, mat('#3B3430'), [0, -0.05, 0.5]));
  cozinhaG.add(caixa(6, 3, 0.1, mat('#2F7F80'), [0, 1.5, -1.5]));
  cozinhaG.add(caixa(2.4, 0.9, 0.7, mat('#7A4E2D'), [1.6, 0.45, -0.7]));
  cozinhaG.add(caixa(2.5, 0.06, 0.8, mat('#E6DCC8'), [1.6, 0.93, -0.7]));
  cozinhaG.add(caixa(2.4, 0.08, 0.3, mat('#A8B3BA'), [1.6, 1.9, -1.3]));
  cozinhaG.add(caixa(0.6, 0.5, 0.05, mat('#FFD21F'), [-1.3, 1.6, -1.44]));
  const caneca = new THREE.Group();
  caneca.add(cilindro(0.07, 0.14, mat('#FF7A1A', { unico: true }), [0, 0, 0], 12));
  caneca.position.set(0.9, 1.0, 0.3);
  cozinhaG.add(caneca);

  // ---------- personagem e objetos de cena (sempre no corpoG) ----------
  const voce = criarPersonagem();
  voce.position.set(0, 0.05, 0);
  corpoG.add(voce);

  const regua = new THREE.Group();
  regua.add(caixa(0.06, 0.3, 0.015, mat('#FFF3C4'), [0, 0, 0]));
  for (let i = 0; i <= 10; i++) {
    regua.add(caixa(0.03, 0.004, 0.004, mat('#333333'), [-0.012, -0.15 + i * 0.03, 0.009], { sombra: false }));
  }
  regua.position.set(0.45, REGUA_TOPO, 0.3);
  corpoG.add(regua);

  // esquema da medula e do cérebro, ao lado do personagem
  const schem = new THREE.Group();
  schem.add(cilindro(0.05, 0.9, mat('#E8E2D0'), [MED_X, 1.0, 0.35], 10));
  const cerebro = malha(new THREE.SphereGeometry(0.22, 16, 12), mat('#F4A6B8', { opacidade: 0.5 }), { sombra: false });
  cerebro.position.set(MED_X, 1.72, 0.35);
  schem.add(cerebro);
  corpoG.add(schem);

  const JOELHO = [0.12, 0.42, 0.3];
  const MED_B = [MED_X, 0.55, 0.35], MED_M = [MED_X, 0.95, 0.35], MED_T = [MED_X, 1.45, 0.35], CER = [MED_X, 1.72, 0.35];

  /** Trilha de bolinhas luminosas que andam ao longo de um caminho. */
  function trilha(n, cor, f, vel) {
    const ms = [];
    for (let i = 0; i < n; i++) {
      const m = caixa(0.04, 0.04, 0.04, mat(cor, { unico: true, emissivo: cor }), [0, 0, 0], { sombra: false });
      corpoG.add(m);
      ms.push(m);
    }
    return {
      atualiza(t, visivel) {
        ms.forEach((m, i) => {
          m.visible = visivel;
          if (!visivel) return;
          const [x, y, z] = f(i / n + t * vel);
          m.position.set(x, y, z);
        });
      },
    };
  }
  // sinal sensorial: olho -> pescoço -> cintura -> mão
  const sinal = trilha(18, '#FFD21F', curva([[0, 1.62, 0.36], [0, 1.42, 0.36], [0, 1.12, 0.36], [0.42, 1.12, 0.36]]), 0.35);
  // reflexo: joelho -> medula -> joelho (curto, rápido)
  const reflexo = trilha(12, '#4FF0FF', curva([JOELHO, MED_M, JOELHO]), 1.1);
  // caminho pelo cérebro (apagado): joelho -> medula -> cérebro
  const pelaCabeca = trilha(10, '#9AA3B8', curva([JOELHO, MED_B, MED_T, CER]), 0.25);

  // carro na rua
  const auto = carro('#2F6FE0');
  auto.position.set(-2, 0.03, -2);
  ruaG.add(auto);

  let E;
  function inicial() {
    E = { amb: 'sala', sinal: 'nenhum', queda: null, carroT0: null, caneca: null, largada: null };
    voce.visible = true;
    voce.position.set(0, 0.05, 0);
    voce.rotation.y = 0;
    voce.estado = { bracos: 'lado', expr: 'feliz' };
  }
  function setar(amb, sinalAtivo) {
    E.amb = amb;
    E.sinal = sinalAtivo;
  }
  function yRegua(t) {
    if (!E.queda || t < E.queda.t0) return REGUA_TOPO;
    const tau = (t - E.queda.t0) / E.queda.lento;
    return REGUA_TOPO - Math.min(QUEDA_30, 0.5 * G * tau * tau);
  }
  function montar(t) {
    const amb = E.amb;
    salaG.visible = amb === 'sala';
    consG.visible = amb === 'consultorio';
    pistaG.visible = amb === 'pista';
    cozinhaG.visible = amb === 'cozinha';
    ruaG.visible = amb === 'rua';
    corpoG.visible = amb !== 'rua';
    cena.background.set(CORES_CENA[amb]);
    regua.position.y = yRegua(t);
    if (E.caneca) {
      const tau = Math.max(0, t - E.caneca.t0) / E.caneca.lento;
      caneca.position.y = Math.max(0.07, 1.0 - 4.9 * tau * tau);
    }
    luzesL.forEach((l) => {
      const verde = E.largada != null && t >= E.largada;
      l.material.color.set(verde ? '#2DBE60' : '#E8322B');
      l.material.emissive.set(verde ? '#2DBE60' : '#E8322B');
    });
    schem.visible = E.sinal === 'reflexo';
    sinal.atualiza(t, E.sinal === 'sinal');
    reflexo.atualiza(t, E.sinal === 'reflexo');
    pelaCabeca.atualiza(t, E.sinal === 'reflexo');
    if (E.carroT0 != null) {
      const x = -2 + 5.55 * Math.max(0, t - E.carroT0);
      auto.position.x = x;
      auto.rodar(x);
    }
  }
  const apresentar = (lt, b, bracos = 'aponta', expr = 'feliz') => {
    voce.visible = true;
    voce.position.set(0, 0.05, 0);
    voce.rotation.y = 0;
    voce.estado = { bracos, expr, falando: b.falando(lt) };
  };

  // ---------- roteiro aprovado (sentido de alerta, vertical) ----------
  const cam = {
    rosto: { pos: [0.6, 1.5, 2.2], alvo: [0.0, 1.45, 0.1] },
    sala: { pos: [1.5, 1.1, 4.6], alvo: [0.75, 1.0, 0.1] },
    salaPerto: { pos: [1.4, 1.0, 3.6], alvo: [0.7, 1.05, 0.2] },
    cozinha: { pos: [0.6, 2.3, 3.4], alvo: [0.5, 0.6, 0.2] },
    pista: { pos: [0.4, 0.7, 4.6], alvo: [0.0, 1.5, -2.0] },
    cons: { pos: [-0.4, 1.5, 3.4], alvo: [-0.4, 1.1, 0.2] },
    carro: (lt) => { const x = -2 + 5.55 * lt; return { pos: [x + 1.5, 2.2, 7.0], alvo: [x, 0.9, -2] }; },
  };
  const bl = (fala, amb, sinalAtivo, camera, o = {}) => {
    const b = {
      fala,
      destaque: o.destaque || [],
      corteSeco: o.corte !== false,
      camera,
      aplicar(lt, bb) {
        setar(amb, sinalAtivo);
        if (o.carro) E.carroT0 = bb.inicio;
        if (o.caneca != null) E.caneca = { t0: bb.inicio + o.caneca, lento: 1.5 };
        apresentar(lt, bb, o.pose || 'aponta', o.expr || 'feliz');
      },
    };
    if (o.card) b.camada = (lt) => o.card(lt);
    return b;
  };

  const blocos = [
    bl('E se você sentisse o perigo antes de ele acontecer?', 'sala', 'nenhum', cam.rosto, { pose: 'lado', expr: 'surpreso', destaque: ['perigo', 'antes'] }),
    bl('Você atravessa a rua, e um carro surge da esquina.', 'rua', 'nenhum', cam.carro, { carro: true, destaque: ['carro', 'esquina'], corte: true }),
    bl('Seu corpo já pula pra trás, antes de você entender.', 'sala', 'nenhum', cam.salaPerto, { pose: 'aponta', expr: 'surpreso', destaque: ['pula', 'entender'] }),
    bl('Um copo escorrega da mesa, e a sua mão já está embaixo dele.', 'cozinha', 'nenhum', cam.cozinha, { pose: 'aponta', expr: 'surpreso', caneca: 0.8, destaque: ['copo', 'mão'] }),
    bl('Num jogo, você vê de onde a bola vem, antes de ela sair do pé.', 'pista', 'nenhum', cam.pista, { pose: 'aponta', destaque: ['jogo', 'bola'] }),
    bl('Só que o alarme não desliga. Ele dispara com o barulho da cidade, e com a sombra de um pássaro.', 'pista', 'nenhum', cam.pista, { pose: 'lado', expr: 'preocupado', destaque: ['alarme', 'pássaro'] }),
    bl('Você não dorme direito, porque o corpo nunca sai do modo alerta.', 'sala', 'nenhum', cam.rosto, { pose: 'cabeca', expr: 'serio', destaque: ['não dorme', 'alerta'] }),
    bl('Você ganha velocidade, mas perde o silêncio.', 'sala', 'nenhum', cam.salaPerto, { pose: 'cabeca', expr: 'preocupado', destaque: ['velocidade', 'silêncio'] }),
    bl('E você: aguentaria ouvir o perigo o tempo todo, ou preferia não ouvir nada?', 'sala', 'nenhum', cam.rosto, { pose: 'lado', expr: 'serio', destaque: ['perigo', 'nada'] }),
  ];
  // três sons, cada um uma vez
  blocos[2].sons = [{ em: () => 0.5, tipo: 'whoosh' }];
  blocos[3].sons = [{ em: () => 3.2, tipo: 'tum' }];
  blocos[8].sons = [{ em: () => 3.0, tipo: 'plim' }];

  return { blocos, inicial, sempre(t) { montar(t); voce.animar(t); } };
}
