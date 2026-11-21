// VÍDEO (Short, ~40 s) — formato OBJETOS FALANTES: "Se a sua geladeira falasse".
// A geladeira conta, do ponto de vista dela, o que você faz às 3 da manhã; o micro-ondas comenta.
// Roteiro original. Fato conferido: com a porta aberta o ar gelado escapa e o compressor
// trabalha mais para recuperar a temperatura; a geladeira funciona 24 h por dia.
// Retenção: rosto em close no 1º quadro, troca visual a cada 2–3 s, sem pedido de inscrição
// no meio, final com pergunta para comentar.
import * as THREE from 'three';
import { suave, lim, mistura, etiqueta, cartao, som } from '../motor.js';
import { mat, caixa, cilindro, malha } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';
import { criarCozinha } from '../cenarios/cozinha.js';
import { criarRosto } from '../rosto-objeto.js';
import { finalPergunta } from '../formato-dias.js';

const MICRO = 'pt-BR-FranciscaNeural';

export const config = {
  titulo: ['SE A SUA', '*GELADEIRA*', 'FALASSE...'],
  velocidade: '+12%',
};

export function criar(ctx) {
  const { cena, hemi, sol } = ctx;
  criarCozinha(ctx);

  // ---------- geladeira com rosto ----------
  const L = 0.9, A = 2.0, PR = 0.72, ZF = -0.2; // largura, altura, profundidade, frente
  const branco = mat('#F2F5F8');
  const corpo = new THREE.Group();
  corpo.add(caixa(0.04, A, PR, branco, [-L / 2, A / 2, ZF - PR / 2]), caixa(0.04, A, PR, branco, [L / 2, A / 2, ZF - PR / 2]));
  corpo.add(caixa(L, 0.04, PR, branco, [0, A, ZF - PR / 2]), caixa(L, 0.06, PR, branco, [0, 0.05, ZF - PR / 2]));
  corpo.add(caixa(L, A, 0.04, mat('#DDE8F0'), [0, A / 2, ZF - PR]));
  for (const y of [0.55, 0.95, 1.4]) corpo.add(caixa(L - 0.08, 0.015, PR - 0.1, mat('#CFE8F7', { opacidade: 0.7 }), [0, y, ZF - PR / 2]));
  cena.add(corpo);
  // comida: pote velho (com mofo), garrafa vazia, frutas
  const pote = new THREE.Group();
  pote.add(cilindro(0.09, 0.1, mat('#E9E2D0'), [0, 0.05, 0], 10), cilindro(0.095, 0.025, mat('#3E9A4F'), [0, 0.11, 0], 10));
  const mofo = [];
  for (let i = 0; i < 6; i++) { const m = malha(new THREE.IcosahedronGeometry(0.025, 0), mat('#7FBF3F')); m.position.set(Math.cos(i) * 0.06, 0.13, Math.sin(i) * 0.06); pote.add(m); mofo.push(m); }
  pote.position.set(-0.22, 0.57, ZF - 0.55);
  cena.add(pote);
  const garrafa = cilindro(0.05, 0.3, mat('#BFE3F5', { opacidade: 0.45 }), [0.25, 0.97 + 0.15, ZF - 0.3], 10);
  cena.add(garrafa, cilindro(0.02, 0.04, mat('#2F6FE0'), [0.25, 1.29, ZF - 0.3], 8));
  [[-0.25, 1.0], [-0.12, 1.0]].forEach(([x, y]) => cena.add(malha(new THREE.IcosahedronGeometry(0.06, 1), mat('#E8322B')).translateX(x).translateY(y + 0.06).translateZ(ZF - 0.4)));
  cena.add(caixa(0.2, 0.25, 0.12, mat('#FFFFFF'), [0.1, 1.41 + 0.125, ZF - 0.45]));
  const luzDentro = new THREE.PointLight('#DDF2FF', 0, 3, 1.2);
  luzDentro.position.set(0, 1.5, ZF - 0.25);
  cena.add(luzDentro);
  // porta (pivô na dobradiça esquerda) com o rosto
  const porta = new THREE.Group();
  porta.position.set(-L / 2, 0, ZF);
  porta.add(caixa(L, A - 0.04, 0.06, mat('#F7F9FB'), [L / 2, A / 2, 0.03]));
  porta.add(caixa(0.04, 0.6, 0.05, mat('#9AA3AE', { metal: true }), [L - 0.08, 1.0, 0.08]));
  const rostoG = criarRosto({ escala: 1.7 });
  rostoG.position.set(L / 2, 1.42, 0.065);
  porta.add(rostoG);
  // imãs de geladeira
  porta.add(caixa(0.08, 0.08, 0.02, mat('#FFD21F'), [0.18, 0.8, 0.065]), caixa(0.07, 0.07, 0.02, mat('#2DBE60'), [0.3, 0.68, 0.065]));
  cena.add(porta);
  // ar gelado escapando
  const ar = [];
  for (let i = 0; i < 18; i++) { const m = malha(new THREE.IcosahedronGeometry(0.05, 0), mat('#CFEFFF', { opacidade: 0.55, unico: true }), { sombra: false }); cena.add(m); ar.push(m); }

  // ---------- micro-ondas com rosto (bancada da direita) ----------
  const micro = new THREE.Group();
  micro.add(caixa(0.6, 0.36, 0.4, mat('#2A2B30'), [0, 0.18, 0]));
  micro.add(caixa(0.4, 0.28, 0.02, mat('#1C3B4A', { emissivo: '#0B2230' }), [-0.06, 0.18, 0.205]));
  micro.add(caixa(0.12, 0.28, 0.02, mat('#3A3C44'), [0.22, 0.18, 0.205]));
  const rostoM = criarRosto({ escala: 0.85 });
  rostoM.position.set(-0.06, 0.2, 0.22);
  micro.add(rostoM);
  micro.position.set(1.55, 0.92, -0.6);
  cena.add(micro);

  // ---------- você (de pijama) ----------
  const voce = criarPersonagem({ cores: { roupa: '#5B7DB1', roupaEscura: '#46669A', calca: '#5B7DB1', tenis: '#E9E2D0', sola: '#C9B79A' } });
  cena.add(voce);

  let E;
  function inicial() {
    E = { porta: 0, noite: 1, ar: false, mofo: 0, voce: false, garrafaVazia: false };
    voce.position.set(0.35, 0, 0.75);
    voce.rotation.set(0, Math.PI, 0);
    voce.estado = { bracos: 'normal', expr: 'serio' };
    rostoG.estado = { expr: 'tedio', falando: false };
    rostoM.estado = { expr: 'tedio', falando: false };
  }
  // quem fala em cada bloco mexe a boca
  const gel = (lt, b, expr, olhar = [0, 0]) => { rostoG.estado = { expr, falando: b.falando(lt), olhar }; };
  const mic = (lt, b, expr, olhar = [-1, 0]) => { rostoM.estado = { expr, falando: b.falando(lt), olhar }; };

  function sempre(t) {
    const k = E.noite;
    hemi.intensity = mistura(1.05, 0.28, k);
    sol.intensity = mistura(1.7, 0.12, k);
    cena.background.set(k > 0.5 ? '#1B2238' : '#F6E7C8');
    cena.fog.color.copy(cena.background);
    porta.rotation.y = -E.porta;
    luzDentro.intensity = 6 * lim(E.porta / 0.4);
    voce.visible = E.voce;
    mofo.forEach((m, i) => m.scale.setScalar(Math.max(0.01, E.mofo * (1 + 0.15 * Math.sin(t * 4 + i)))));
    garrafa.material.opacity = E.garrafaVazia ? 0.2 : 0.45;
    ar.forEach((m, i) => {
      const u = (t * 0.6 + i / 18) % 1;
      m.visible = E.ar;
      m.position.set(-0.3 + (i % 6) * 0.12, 0.4 + (i % 3) * 0.45 - u * 0.3, ZF + 0.1 + u * 0.9);
      m.scale.setScalar(0.6 + u);
    });
    rostoG.animar(t);
    rostoM.animar(t);
    voce.animar(t);
  }

  // câmeras
  const closeG = { pos: [0, 1.45, 2.1], alvo: [0, 1.5, ZF] };
  const closeFinal = { pos: [0, 1.3, 2.3], alvo: [0, 1.72, ZF] };
  const closeM = { pos: [1.3, 1.3, 0.9], alvo: [1.5, 1.12, -0.6] };
  const cozinha = { pos: [1.7, 1.7, 3.4], alvo: [0.2, 1.1, -0.3] };
  const dentro = { pos: [0.05, 1.5, ZF - 0.5], alvo: [0.35, 1.45, 0.75] };
  const prateleira = { pos: [-0.1, 0.82, 0.2], alvo: [-0.2, 0.62, ZF - 0.55] };

  const blocos = [
    {
      // 1º quadro: o "rosto" da geladeira em close, com o título
      fala: 'Eu sou a sua geladeira. E eu preciso te contar umas coisas.',
      destaque: ['geladeira', 'contar'],
      semLegenda: true,
      camera: closeG,
      cameraFim: { pos: [0, 1.45, 1.75], alvo: [0, 1.5, ZF] },
      aplicar(lt, b) { E.noite = 0; gel(lt, b, lt < 1 ? 'chocado' : 'bravo'); },
      sons: [{ em: () => 0.02, tipo: 'impacto' }],
    },
    {
      fala: 'Três da manhã. Você abre a porta, olha, olha, e fecha. Sem pegar nada.',
      destaque: ['três', 'nada'],
      corteSeco: true,
      camera: (lt, b) => (lt < b.palavra('olha') || lt > b.palavra('fecha') ? cozinha : dentro),
      aplicar(lt, b) {
        E.voce = true;
        E.noite = 1;
        const abre = b.palavra('abre'), fecha = b.palavra('fecha');
        E.porta = lt < fecha ? 1.3 * suave((lt - abre + 0.2) / 0.5) : 1.3 * (1 - suave((lt - fecha) / 0.4));
        voce.estado = { bracos: lt > abre - 0.3 && lt < fecha ? 'aponta' : 'normal', expr: 'serio' };
        gel(lt, b, 'tedio');
      },
      camada: (lt, b) => cartao(lt, 0.2, '3:00', 'DA MANHÃ'),
      sons: [{ em: 'tres', tipo: 'tique' }, { em: 'tres', depois: 0.3, tipo: 'tique' }, { em: 'abre', tipo: 'whoosh' }, { em: 'fecha', tipo: 'baque' }],
    },
    {
      fala: 'Dez minutos depois, você volta. Achando que apareceu comida nova.',
      destaque: ['volta', 'nova'],
      corteSeco: true,
      camera: (lt, b) => (lt < b.palavra('achando') ? closeG : dentro),
      aplicar(lt, b) {
        E.voce = true;
        const ach = b.palavra('achando');
        E.porta = lt < ach ? 0 : 1.3 * suave((lt - ach) / 0.4);
        voce.estado = { bracos: 'normal', expr: 'surpreso' };
        gel(lt, b, lt < ach ? 'chocado' : 'bravo');
      },
      camada: (lt, b) => som(lt, b.palavra('volta'), 'DE NOVO?!', 1.2),
      sons: [{ em: 'volta', tipo: 'dia' }, { em: 'achando', tipo: 'whoosh' }],
    },
    {
      fala: 'Ele faz isso comigo também. Fica olhando a pizza girar.',
      voz: MICRO,
      destaque: ['pizza', 'girar'],
      corteSeco: true,
      camera: closeM,
      aplicar(lt, b) { E.porta = 0; E.voce = false; mic(lt, b, 'tedio'); gel(0, { falando: () => false }, 'tedio', [1, 0]); },
      sons: [{ em: 'pizza', tipo: 'plim' }],
    },
    {
      fala: 'E toda vez que a porta fica aberta, o ar gelado escapa, e o meu motor trabalha dobrado.',
      destaque: ['aberta', 'escapa', 'dobrado'],
      corteSeco: true,
      camera: (lt, b) => (lt < b.palavra('motor') ? cozinha : closeG),
      aplicar(lt, b) {
        const motor = b.palavra('motor');
        E.voce = lt < motor;
        E.porta = lt < motor ? 1.3 * suave((lt - 0.2) / 0.5) : 0;
        E.ar = lt < motor && lt > b.palavra('escapa') - 0.4;
        voce.estado = { bracos: 'aponta', expr: 'serio' };
        gel(lt, b, lt < motor ? 'bravo' : 'chocado');
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('dobrado'), 'MOTOR TRABALHANDO DOBRADO'),
      sons: [{ em: 'escapa', tipo: 'passagem' }, { em: 'motor', tipo: 'motor' }],
    },
    {
      fala: 'Aquele pote de feijão lá no fundo? Tá aqui desde março.',
      destaque: ['feijão', 'março'],
      corteSeco: true,
      camera: prateleira,
      aplicar(lt, b) { E.voce = false; E.porta = 1.4; E.ar = false; E.mofo = suave((lt - b.palavra('desde')) / 0.5); gel(lt, b, 'tedio'); },
      camada: (lt, b) => etiqueta(lt, b.palavra('marco'), 'DESDE MARÇO'),
      sons: [{ em: 'marco', tipo: 'dia' }],
    },
    {
      fala: 'Ninguém tem coragem de abrir.',
      voz: MICRO,
      destaque: ['coragem'],
      corteSeco: true,
      camera: closeM,
      aplicar(lt, b) { E.porta = 0; E.mofo = 1; mic(lt, b, 'chocado'); },
      sons: [{ em: 'coragem', tipo: 'tum' }],
    },
    {
      fala: 'E a garrafa de água? Você devolve vazia.',
      destaque: ['garrafa', 'vazia'],
      corteSeco: true,
      camera: (lt, b) => (lt < b.palavra('voce') ? { pos: [0.3, 1.2, 0.5], alvo: [0.25, 1.12, ZF - 0.3] } : closeG),
      aplicar(lt, b) {
        const v = b.palavra('voce');
        E.porta = lt < v ? 1.4 : 0;
        E.garrafaVazia = true;
        gel(lt, b, 'bravo');
      },
      camada: (lt, b) => som(lt, b.palavra('vazia'), 'SÉRIO?', 1.0),
      sons: [{ em: 'vazia', tipo: 'baque' }],
    },
    {
      fala: 'Mas tudo bem. Eu trabalho vinte e quatro horas por dia, sem folga, só pra sua comida não estragar.',
      destaque: ['vinte', 'folga', 'estragar'],
      corteSeco: true,
      camera: closeG,
      cameraFim: { pos: [0.3, 1.55, 2.3], alvo: [0.1, 1.3, ZF] },
      aplicar(lt, b) { E.porta = 0; E.noite = 0; gel(lt, b, lt < b.palavra('trabalho') ? 'triste' : 'sorriso'); mic(0, { falando: () => false }, 'sorriso', [-1, 0]); },
      camada: (lt, b) => cartao(lt, b.palavra('vinte'), '24 HORAS', 'POR DIA, SEM FOLGA'),
      sons: [{ em: 'vinte', tipo: 'brilho' }],
    },
    {
      fala: 'Então, faz um favor: fecha a porta. E comenta aí: o que a sua geladeira diria de você?',
      semLegenda: true,
      corteSeco: true,
      camera: closeFinal,
      aplicar(lt, b) { E.noite = 0; gel(lt, b, lt < b.palavra('comenta') ? 'bravo' : 'feliz'); },
      camada: (lt, b) => (lt < b.palavra('comenta')
        ? som(lt, b.palavra('fecha'), 'FECHA A PORTA!', 3)
        : finalPergunta(lt - b.palavra('comenta'), ['O QUE A SUA GELADEIRA', '*DIRIA DE VOCÊ?*'], 'COMENTA AÍ! 👇', 0.8)),
      sons: [{ em: 'fecha', tipo: 'baque' }, { em: 'comenta', tipo: 'pop' }],
    },
  ];

  return { blocos, inicial, sempre };
}
