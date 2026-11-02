// VÍDEO: "Você consegue pegar uma régua antes dela cair?"
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
  titulo: ['VOCÊ CONSEGUE', 'PEGAR UMA', 'RÉGUA *ANTES*', 'DE CAIR?'],
  tituloEstilo: 'meio',
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

  const blocos = [
    {
      fala: 'Peça pra alguém soltar uma régua entre os seus dedos. Você consegue pegar antes dela cair muito?',
      destaque: ['régua', 'pegar', 'cair'],
      camera: { pos: [1.5, 1.1, 4.6], alvo: [0.75, 1.0, 0.1] },
      aplicar(lt, b) {
        setar('sala', 'nenhum');
        E.queda = null;
        apresentar(lt, b, 'aponta', 'surpreso');
      },
    },
    {
      fala: 'Com uma régua de trinta centímetros, a sua reação leva uns vinte e cinco centésimos de segundo. Veja em câmera lenta.',
      destaque: ['trinta', 'vinte e cinco', 'câmera lenta'],
      corteSeco: true,
      camera: { pos: [1.4, 1.0, 3.6], alvo: [0.7, 1.05, 0.2] },
      aplicar(lt, b) {
        setar('sala', 'nenhum');
        E.queda = { t0: b.inicio + 0.8, lento: 3 };
        apresentar(lt, b, 'aponta', 'feliz');
      },
      camada: (lt) => cartao(lt, 1.8, '0,25 s', 'TEMPO DE REAÇÃO'),
    },
    {
      fala: 'O sinal viaja pelo nervo a até cento e vinte metros por segundo. Ele sobe até o cérebro, e só então a mão fecha.',
      destaque: ['nervo', 'cérebro', 'mão'],
      corteSeco: true,
      camera: { pos: [1.9, 1.8, 3.2], alvo: [0.1, 1.3, 0.2] },
      aplicar(lt, b) {
        setar('sala', 'sinal');
        apresentar(lt, b, 'aponta', 'serio');
      },
      camada: (lt) => cartao(lt, 2.0, '120 m/s', 'SINAL NO NERVO, NO MÁXIMO'),
    },
    {
      fala: 'Imagine um carro a oitenta quilômetros por hora. Veja em câmera lenta: nesse tempo, ele já andou mais de cinco metros, sem você frear.',
      destaque: ['oitenta', 'cinco metros', 'frear'],
      corteSeco: true,
      camera: (lt) => {
        const x = -2 + 5.55 * lt;
        return { pos: [x + 1.5, 2.2, 7.0], alvo: [x, 0.9, -2] };
      },
      aplicar(lt, b) {
        setar('rua', 'nenhum');
        E.carroT0 = b.inicio;
      },
      camada: (lt) => cartao(lt, 1.0, '5,5 METROS', 'ANDADOS ANTES DE FREAR'),
    },
    {
      fala: 'Mas o corpo tem um atalho: o reflexo. Quando o médico bate no seu joelho, a perna chuta sozinha, sem o cérebro decidir nada.',
      destaque: ['atalho', 'sozinha'],
      corteSeco: true,
      camera: { pos: [-0.4, 1.5, 3.4], alvo: [-0.4, 1.1, 0.2] },
      aplicar(lt, b) {
        setar('consultorio', 'reflexo');
        apresentar(lt, b, 'lado', 'serio');
      },
      camada: (lt) => etiqueta(lt, 2.0, 'ATALHO NA MEDULA'),
    },
    {
      fala: 'Esse caminho curto é bem mais rápido do que pensar, porque o sinal nem sobe até o cérebro.',
      destaque: ['curto', 'mais rápido', 'cérebro'],
      corteSeco: true,
      camera: { pos: [-0.4, 1.5, 3.4], alvo: [-0.4, 1.1, 0.2] },
      aplicar(lt, b) {
        setar('consultorio', 'reflexo');
        apresentar(lt, b, 'lado', 'feliz');
      },
      camada: (lt) => cartao(lt, 1.0, 'MAIS RÁPIDO', 'SEM PASSAR PELO CÉREBRO'),
    },
    {
      fala: 'E tem um limite: numa largada de corrida, quem sai antes de um décimo de segundo é considerado falsa largada, porque quase ninguém reage tão rápido.',
      destaque: ['limite', 'décimo', 'falsa largada'],
      corteSeco: true,
      camera: { pos: [0.4, 0.7, 4.6], alvo: [0.0, 1.5, -2.0] },
      aplicar(lt, b) {
        setar('pista', 'nenhum');
        E.largada = b.inicio + 2.0;
        apresentar(lt, b, 'aponta', 'surpreso');
      },
      camada: (lt) => etiqueta(lt, 3.5, 'FALSA LARGADA ABAIXO DE 0,1 s'),
    },
    {
      fala: 'É por isso que você se assusta, e a mão se mexe antes de você perceber!',
      destaque: ['assusta', 'antes', 'perceber'],
      corteSeco: true,
      camera: { pos: [0.6, 2.3, 3.4], alvo: [0.5, 0.6, 0.2] },
      aplicar(lt, b) {
        setar('cozinha', 'nenhum');
        E.caneca = { t0: b.inicio + 0.6, lento: 2 };
        apresentar(lt, b, 'aponta', 'surpreso');
      },
      camada: (lt) => etiqueta(lt, 1.0, 'ANTES DE PERCEBER'),
    },
    {
      fala: 'Parabéns: você construiu um reflexo!',
      destaque: ['parabéns', 'reflexo'],
      corteSeco: true,
      camera: { pos: [1.8, 1.8, 3.2], alvo: [0, 1.3, 0] },
      aplicar(lt, b) {
        setar('sala', 'nenhum');
        voce.visible = true;
        voce.position.set(0, 0.05, 0);
        voce.rotation.y = 0;
        voce.estado = { bracos: 'cima', expr: 'feliz', pulo: 1 };
      },
    },
    {
      fala: FALA_FINAL,
      semLegenda: true,
      corteSeco: true,
      camera: { pos: [1.5, 1.0, 4.4], alvo: [0, 0.95, 0] },
      aplicar(lt, b) {
        setar('sala', 'nenhum');
        apresentar(lt, b, lt > 2.4 ? 'aponta' : 'aceno');
      },
      camada: (lt) => textoFinal(lt),
    },
  ];

  return { blocos, inicial, sempre(t) { montar(t); voce.animar(t); } };
}
