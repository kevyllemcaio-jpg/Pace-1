// VÍDEO: "7 dias sem dormir?" — formato "N dias de…" (ver PADRAO-DIAS.md)
// Fatos conferidos:
//  - 24 h acordado prejudica o desempenho tanto quanto ~0,10% de álcool no sangue
//    (Dawson & Reid, Nature, 1997) -> "reflexos de quem bebeu".
//  - Privação de sono causa microcochilos (apagões de alguns segundos, às vezes de olho aberto),
//    lapsos de memória, irritabilidade e, depois de 2–3 dias, distorções visuais e alucinações.
//  - Randy Gardner, 17 anos, 1964 (San Diego): 11 dias acordado (264 h). No 4º dia achou que
//    era Paul Lowe, jogador de futebol americano. Depois dormiu cerca de 14 horas seguidas.
//  - O Guinness deixou de registrar recordes de privação de sono por serem perigosos.
import * as THREE from 'three';
import { suave, lim, mistura, cartao, etiqueta, som } from '../motor.js';
import { mat, malha } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';
import { criarQuarto } from '../cenarios/quarto.js';
import { hud, selo, breu, piscada, finalPergunta } from '../formato-dias.js';

export const config = {
  titulo: ['7 DIAS', 'SEM *DORMIR*?'],
  musica: false,
};

// contador "HORAS ACORDADO": branco -> amarelo (24 h) -> vermelho (72 h)
const H = (lt, de, ate, dia, confuso = false) =>
  hud(lt, { rotulo: 'HORAS ACORDADO', de, ate, dia, limites: [24, 72], cores: ['#FFFFFF', '#FFD21F', '#FF5A4E'], confuso });

export function criar(ctx) {
  const { cena } = ctx;
  const q = criarQuarto(ctx, { janela: true });

  // alucinações: formas coloridas flutuando
  const visoes = [];
  const coresV = ['#B57BFF', '#3DDC84', '#FF8A3D', '#4DA3FF', '#FF5A4E', '#FFD21F'];
  for (let i = 0; i < 12; i++) {
    const m = malha(new THREE.IcosahedronGeometry(0.06 + (i % 3) * 0.03, 0), mat(coresV[i % 6], { unico: true, emissivo: coresV[i % 6], opacidade: 0.85 }), { sombra: false });
    cena.add(m);
    visoes.push(m);
  }

  const voce = criarPersonagem();
  cena.add(voce);
  const PX = 0.28, PZ = -0.35;

  let E;
  function inicial() {
    E = { luz: 0.9, ceu: 1, tela: 1, aluc: 0, deitado: false };
    voce.visible = true;
    voce.position.set(PX, 0, PZ);
    voce.rotation.set(0, -0.15, 0);
    voce.estado = { bracos: 'normal', expr: 'feliz' };
  }
  const pose = (lt, b, bracos, expr, extra = {}) => { voce.estado = { bracos, expr, falando: b.falando(lt), ...extra }; };

  function montar(t) {
    q.luz(lim(E.luz));
    q.ceu(lim(E.ceu));
    q.tela(E.tela);
    q.ondular(t, E.aluc);
    visoes.forEach((m, i) => {
      m.visible = E.aluc > 0.05;
      const a = i * 0.52;
      m.position.set(0.25 + Math.cos(t * 0.6 + a) * (0.9 + (i % 3) * 0.25), 1.3 + Math.sin(t * 0.9 + a * 1.7) * 0.7, -0.9 + (i % 4) * 0.25);
      m.rotation.set(t + i, t * 1.3, 0);
      m.scale.setScalar(Math.max(0.01, E.aluc * (0.8 + 0.3 * Math.sin(t * 3 + i))));
    });
    if (E.deitado) {
      voce.position.set(q.CAMA[0], q.CAMA[1], 0.3);
      voce.rotation.set(-Math.PI / 2, 0, 0);
    } else {
      voce.position.set(PX, 0, PZ);
      voce.rotation.set(0, -0.15, 0);
    }
  }

  const cam = { pos: [0.05, 1.55, 4.4], alvo: [0.05, 1.5, -0.6] };
  const camPerto = { pos: [0.15, 1.5, 3.2], alvo: [0.1, 1.45, -0.6] };
  const camCama = { pos: [0.6, 2.2, 2.4], alvo: [1.3, 0.6, -0.5] };
  const dia = { em: 'dia', tipo: 'dia' };

  const blocos = [
    {
      // GANCHO — 1º quadro = capa
      fala: 'E se você ficasse sete dias sem dormir? Nem um cochilo.',
      destaque: ['sete', 'dormir', 'cochilo'],
      semLegenda: true,
      camera: cam,
      aplicar(lt, b) {
        const pisca = lt > 0.6 && lt < 2.4 && Math.floor((lt - 0.6) / 0.3) % 2 === 0;
        Object.assign(E, { luz: pisca ? 0.05 : 0.9, ceu: pisca ? 0 : 1, aluc: pisca ? 1 : 0 });
        pose(lt, b, lt < 2.4 ? 'aponta' : 'cabeca', lt < 2.4 ? 'surpreso' : 'preocupado');
      },
      sons: [{ em: () => 0.02, tipo: 'impacto' }, { em: () => 0.6, tipo: 'whoosh' }, { em: () => 1.8, tipo: 'whoosh' }],
    },
    {
      fala: 'Dia um. Nas primeiras horas, nada demais. Café, celular, tudo sob controle.',
      destaque: ['café', 'controle'],
      corteSeco: true,
      camera: camPerto,
      cameraFim: cam,
      aplicar(lt, b) {
        Object.assign(E, { luz: 0.9, ceu: 1, aluc: 0 });
        pose(lt, b, lt > b.palavra('controle') ? 'cima' : 'normal', 'feliz');
      },
      camada: (lt) => H(lt, 0, 16, 1) + selo(lt, 'DIA 1'),
      sons: [{ em: () => 0, tipo: 'impacto' }, dia],
    },
    {
      fala: 'Mas com vinte e quatro horas acordado, os seus reflexos ficam iguais aos de quem bebeu.',
      destaque: ['vinte', 'reflexos', 'bebeu'],
      camera: cam,
      aplicar(lt, b) {
        Object.assign(E, { luz: mistura(0.9, 0.45, suave(lt / 1.5)), ceu: 1 - suave(lt / 1.5) });
        pose(lt, b, lt > b.palavra('reflexos') ? 'cabeca' : 'normal', lt > b.palavra('reflexos') ? 'surpreso' : 'serio');
      },
      camada: (lt, b) => H(lt, 16, 24, 1) + cartao(lt, b.palavra('bebeu') - 0.2, '24 HORAS', 'REFLEXOS DE QUEM BEBEU'),
    },
    {
      fala: 'Dia dois. O cérebro começa a desligar sozinho: microcochilos de poucos segundos, de olho aberto.',
      destaque: ['desligar', 'microcochilos', 'aberto'],
      camera: camPerto,
      aplicar(lt, b) {
        Object.assign(E, { luz: 0.8, ceu: 0.85 });
        pose(lt, b, 'normal', 'serio');
      },
      camada: (lt, b) => H(lt, 24, 36, 2) + selo(lt, 'DIA 2') + etiqueta(lt, b.palavra('microcochilos'), 'MICROCOCHILO')
        + breu(piscada(lt, b.palavra('desligar') + 0.3, 0.8) + piscada(lt, b.palavra('aberto') + 0.1, 1.0)),
      sons: [dia, { em: 'desligar', depois: 0.3, tipo: 'whoosh' }],
    },
    {
      fala: 'Você esquece o que ia falar no meio da frase, e qualquer coisa te irrita.',
      destaque: ['esquece', 'irrita'],
      camera: cam,
      aplicar(lt, b) {
        Object.assign(E, { luz: 0.7, ceu: 0.6 });
        pose(lt, b, lt > b.palavra('irrita') ? 'cabeca' : 'normal', lt > b.palavra('irrita') ? 'preocupado' : 'serio');
      },
      camada: (lt, b) => H(lt + 5, 36, 36, 2) + som(lt, b.palavra('meio'), '...?', 1.2),
    },
    {
      fala: 'Dia três. As paredes parecem se mexer, e você vê coisas que não estão lá.',
      destaque: ['paredes', 'mexer', 'coisas'],
      camera: camPerto,
      aplicar(lt, b) {
        Object.assign(E, { luz: 0.3, ceu: 0, aluc: suave((lt - b.palavra('paredes')) / 1.2) });
        pose(lt, b, lt > b.palavra('coisas') ? 'aponta' : 'normal', 'surpreso');
      },
      camada: (lt) => H(lt, 36, 60, 3) + selo(lt, 'DIA 3'),
      sons: [dia, { em: 'paredes', tipo: 'tensao' }],
    },
    {
      fala: 'Dia quatro. Você já não sabe o que é real e o que é sonho.',
      destaque: ['real', 'sonho'],
      camera: cam,
      aplicar(lt, b) {
        Object.assign(E, { luz: 0.55, ceu: 0.7, aluc: 1 });
        pose(lt, b, 'cabeca', 'preocupado');
      },
      camada: (lt, b) => H(lt, 60, 84, 4) + selo(lt, 'DIA 4') + breu(piscada(lt, b.palavra('sonho') + 0.2, 0.9)),
      sons: [dia],
    },
    {
      fala: 'Dia cinco? Ou seis? Você conta as horas, mas os números não fazem mais sentido.',
      destaque: ['números', 'sentido'],
      camera: camPerto,
      aplicar(lt, b) {
        Object.assign(E, { luz: 0.25, ceu: 0, aluc: 0.8 });
        pose(lt, b, 'normal', 'serio');
      },
      camada: (lt) => H(lt, 84, 120, 5, true) + selo(lt, 'DIA 5?'),
      sons: [dia, { em: 'numeros', tipo: 'tensao' }],
    },
    {
      fala: 'Dia sete. Você deita, e apaga na hora.',
      destaque: ['apaga'],
      corteSeco: true,
      camera: camCama,
      aplicar(lt, b) {
        const apaga = b.palavra('apaga');
        Object.assign(E, { ceu: 0, aluc: 0, deitado: lt > b.palavra('deita') - 0.1, luz: mistura(0.35, 0.03, suave((lt - apaga) / 0.4)), tela: 1 - suave((lt - apaga) / 0.4) });
        pose(lt, b, 'normal', 'serio');
      },
      camada: (lt, b) => H(lt, 150, 168, 7) + selo(lt, 'DIA 7', '#FF5A4E') + som(lt, b.palavra('apaga') + 0.5, 'Z Z Z', 2),
      sons: [dia, { em: 'apaga', tipo: 'impacto' }],
    },
    {
      fala: 'Parece exagero? Em 1964, um estudante de dezessete anos ficou onze dias acordado. No quarto dia, jurou que era um jogador de futebol famoso.',
      destaque: ['exagero', 'onze', 'jogador'],
      corteSeco: true,
      camera: cam,
      aplicar(lt, b) {
        Object.assign(E, { luz: 0.9, ceu: 1, aluc: 0, tela: 1, deitado: false });
        pose(lt, b, lt < b.palavra('em') ? 'cabeca' : 'normal', lt < b.palavra('em') ? 'surpreso' : 'serio');
      },
      camada: (lt, b) => cartao(lt, b.palavra('onze'), '11 DIAS', 'ESTADOS UNIDOS · 1964 · 264 HORAS ACORDADO')
        + etiqueta(lt, b.palavra('jogador'), 'ACHOU QUE ERA OUTRA PESSOA'),
    },
    {
      fala: 'Quando terminou, dormiu catorze horas seguidas. E o Guinness parou de registrar esse recorde, porque é perigoso demais.',
      destaque: ['catorze', 'perigoso'],
      camera: camPerto,
      aplicar(lt, b) {
        Object.assign(E, { luz: 0.9, ceu: 1 });
        pose(lt, b, lt > b.palavra('guinness') ? 'aponta' : 'normal', lt > b.palavra('perigoso') ? 'preocupado' : 'serio');
      },
      camada: (lt, b) => cartao(lt, b.palavra('catorze'), '14 HORAS', 'DE SONO SEGUIDO DEPOIS') + etiqueta(lt, b.palavra('perigoso'), 'PERIGOSO DEMAIS: NÃO TENTE'),
    },
    {
      fala: 'Comenta aí: quantas horas você já ficou sem dormir? E me segue pra mais!',
      semLegenda: true,
      corteSeco: true,
      camera: camPerto,
      aplicar(lt, b) { Object.assign(E, { luz: 0.9, ceu: 1 }); pose(lt, b, lt > b.palavra('segue') ? 'aponta' : 'aceno', 'feliz'); },
      camada: (lt, b) => finalPergunta(lt, ['QUANTAS HORAS VOCÊ', '*JÁ FICOU SEM DORMIR?*'], 'ME SEGUE!', b.palavra('segue')),
      sons: [{ em: () => 0.02, tipo: 'pop' }, { em: 'segue', tipo: 'plim' }],
    },
  ];

  return { blocos, inicial, sempre(t) { montar(t); voce.animar(t); } };
}
