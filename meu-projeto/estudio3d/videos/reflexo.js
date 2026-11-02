// VÍDEO: "Você consegue pegar uma régua antes dela cair?"
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
const REGUA_PEGA = 1.15;   // onde a mão pega (30 cm abaixo)
const QUEDA_30 = 0.3;
const G = 9.8;

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

  // Duas "cenas" separadas: o corpo (régua, sinal, reflexo) e a rua (carro em câmera lenta).
  const corpoG = new THREE.Group();
  cena.add(corpoG);
  const ruaG = new THREE.Group();
  cena.add(ruaG);
  criarRua({ cena: ruaG, hemi: ctx.hemi, sol: ctx.sol }, { transversal: false, recuo: 11 });

  // ---------- corpo ----------
  corpoG.add(caixa(60, 0.1, 60, mat('#6CBF47'), [0, -0.05, 0]));
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

  // ---------- rua ----------
  const auto = carro('#2F6FE0');
  auto.position.set(-2, 0.03, -2);
  ruaG.add(auto);

  let E;
  function inicial() {
    E = { modo: 'corpo', sinal: 'nenhum', queda: null, carroT0: null };
    voce.visible = true;
    voce.position.set(0, 0.05, 0);
    voce.rotation.y = 0;
    voce.estado = { bracos: 'lado', expr: 'feliz' };
  }
  function setar(modo, sinalAtivo) {
    E.modo = modo;
    E.sinal = sinalAtivo;
  }
  function yRegua(t) {
    if (!E.queda || t < E.queda.t0) return REGUA_TOPO;
    const tau = (t - E.queda.t0) / E.queda.lento;
    return REGUA_TOPO - Math.min(QUEDA_30, 0.5 * G * tau * tau);
  }
  function montar(t) {
    corpoG.visible = E.modo === 'corpo';
    ruaG.visible = E.modo === 'rua';
    regua.position.y = yRegua(t);
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
      camera: { pos: [1.6, 1.1, 4.6], alvo: [0.2, 0.95, 0.1] },
      aplicar(lt, b) {
        setar('corpo', 'nenhum');
        E.queda = null;
        apresentar(lt, b, 'aponta', 'surpreso');
      },
    },
    {
      fala: 'Com uma régua de trinta centímetros, a sua reação leva uns vinte e cinco centésimos de segundo. Veja em câmera lenta.',
      destaque: ['trinta', 'vinte e cinco', 'câmera lenta'],
      corteSeco: true,
      camera: { pos: [1.4, 1.0, 3.6], alvo: [0.3, 1.05, 0.2] },
      aplicar(lt, b) {
        setar('corpo', 'nenhum');
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
        setar('corpo', 'sinal');
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
        setar('corpo', 'reflexo');
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
        setar('corpo', 'reflexo');
        apresentar(lt, b, 'lado', 'feliz');
      },
      camada: (lt) => cartao(lt, 1.0, 'MAIS RÁPIDO', 'SEM PASSAR PELO CÉREBRO'),
    },
    {
      fala: 'E tem um limite: numa largada de corrida, quem sai antes de um décimo de segundo é considerado falsa largada, porque quase ninguém reage tão rápido.',
      destaque: ['limite', 'décimo', 'falsa largada'],
      corteSeco: true,
      camera: { pos: [1.2, 1.2, 2.0], alvo: [0.4, 1.1, 0.2] },
      aplicar(lt, b) {
        setar('corpo', 'nenhum');
        apresentar(lt, b, 'aponta', 'surpreso');
      },
      camada: (lt) => etiqueta(lt, 3.5, 'FALSA LARGADA ABAIXO DE 0,1 s'),
    },
    {
      fala: 'É por isso que você se assusta, e a mão se mexe antes de você perceber!',
      destaque: ['assusta', 'antes', 'perceber'],
      corteSeco: true,
      camera: { pos: [0.2, 1.6, 2.8], alvo: [0.0, 1.4, 0.1] },
      aplicar(lt, b) {
        setar('corpo', 'nenhum');
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
        setar('corpo', 'nenhum');
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
        setar('corpo', 'nenhum');
        apresentar(lt, b, lt > 2.4 ? 'aponta' : 'aceno');
      },
      camada: (lt) => textoFinal(lt),
    },
  ];

  return { blocos, inicial, sempre(t) { montar(t); voce.animar(t); } };
}
