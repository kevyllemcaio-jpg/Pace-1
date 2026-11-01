// VÍDEO: "Como a geladeira gela sem ter gelo?"
// Fatos conferidos:
//  - Ao evaporar, um líquido absorve calor (por isso álcool na mão dá sensação de frio).
//  - O fluido refrigerante evapora no evaporador (dentro), roubando calor dos alimentos;
//    o compressor comprime o gás (fica mais quente); no condensador (grade atrás) ele solta
//    o calor para o ambiente e volta a ser líquido; um tubo fino (capilar) baixa a pressão e o ciclo recomeça.
//  - Por isso a parte de trás é quente e a geladeira precisa de espaço da parede para ventilar.
//  - A borracha da porta tem ímã, que mantém a vedação.
import * as THREE from 'three';
import { suave, saida, mistura, lim, cartao, etiqueta, ok, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, cilindro, malha, cano } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';
import { criarCozinha } from '../cenarios/cozinha.js';

export const config = {
  titulo: ['COMO A', '*GELADEIRA*', 'GELA SEM', 'TER *GELO*?'],
  tituloEstilo: 'meio',
};

const L = 0.92, A = 2.0, P = 0.8;     // largura, altura, profundidade
const DIV = 1.45;                      // divisória freezer
const PX = 0.85, PZ = 0.05;

export function criar(ctx) {
  const { cena, cortavel } = ctx;
  const C = (cor, extra = {}) => cortavel(mat(cor, { cortavel: true, ...extra }));
  criarCozinha(ctx);

  // ---------- geladeira ----------
  const casca = C('#F4F6F8', { duplo: true });
  const gel = new THREE.Group();
  gel.add(caixa(0.04, A, P, casca, [-L / 2, A / 2, 0]), caixa(0.04, A, P, casca, [L / 2, A / 2, 0]));
  gel.add(caixa(L, 0.04, P, casca, [0, A, 0]), caixa(L, 0.06, P, casca, [0, 0.08, 0]));
  gel.add(caixa(L, 0.04, P, casca, [0, DIV, 0]));
  gel.add(caixa(L, A, 0.04, mat('#E3EEF7'), [0, A / 2, -P / 2]));
  // interior: prateleiras e comida
  for (const y of [0.55, 0.95]) gel.add(caixa(L - 0.08, 0.015, P - 0.12, mat('#CFE8F7', { opacidade: 0.6, unico: true }), [0, y, -0.03]));
  const comida = new THREE.Group();
  [[-0.28, 0.12, '#2DBE60'], [-0.12, 0.12, '#E8322B'], [0.05, 0.12, '#F2C14E']].forEach(([x, y, cor]) => comida.add(cilindro(0.045, 0.28, mat(cor), [x, 0.11 + 0.14, -0.15], 10)));
  comida.add(caixa(0.14, 0.24, 0.1, mat('#FFFFFF'), [0.25, 0.68, -0.15]), caixa(0.2, 0.06, 0.14, mat('#F2C14E'), [-0.2, 0.59, -0.1]));
  [[-0.2, 1.0], [-0.1, 1.0], [0.0, 1.0]].forEach(([x, y]) => comida.add(malha(new THREE.IcosahedronGeometry(0.05, 1), mat('#E8322B')).translateX(x).translateY(y).translateZ(-0.1)));
  comida.add(caixa(0.3, 0.06, 0.22, mat('#BFE3F5'), [0.0, 1.52, -0.08]));
  gel.add(comida);
  // portas
  const portaG = new THREE.Group(), portaF = new THREE.Group();
  portaG.position.set(-L / 2, 0, P / 2);
  portaG.add(caixa(L, DIV - 0.08, 0.05, C('#F4F6F8'), [L / 2, (DIV + 0.08) / 2, 0.025]));
  portaG.add(caixa(0.04, 0.5, 0.05, C('#9AA3AE', { metal: true }), [L - 0.08, 1.0, 0.07]));
  const borracha = caixa(L, 0.03, 0.03, C('#2A2D33'), [L / 2, 0.12, -0.01]);
  const borracha2 = caixa(0.03, DIV - 0.12, 0.03, C('#2A2D33'), [L - 0.02, (DIV + 0.08) / 2, -0.01]);
  portaG.add(borracha, borracha2);
  portaF.position.set(-L / 2, 0, P / 2);
  portaF.add(caixa(L, A - DIV - 0.02, 0.05, C('#F4F6F8'), [L / 2, (A + DIV) / 2, 0.025]));
  portaF.add(caixa(0.04, 0.3, 0.05, C('#9AA3AE', { metal: true }), [L - 0.08, DIV + 0.2, 0.07]));
  gel.add(portaG, portaF);
  // gelo/geada no freezer
  const geada = caixa(L - 0.06, 0.04, 0.02, mat('#FFFFFF', { emissivo: '#BFE3F5', unico: true }), [0, DIV + 0.48, -0.36]);
  gel.add(geada);
  cena.add(gel);

  // ---------- circuito do gás ----------
  const pts = [[0.2, 0.22, -0.56], [0.36, 0.3, -0.47]];
  for (let i = 0; i < 6; i++) { const y = 0.35 + i * 0.27; pts.push([i % 2 ? -0.36 : 0.36, y, -0.47], [i % 2 ? -0.36 : 0.36, y + 0.13, -0.47]); }
  pts.push([-0.36, 1.96, -0.47], [-0.34, 1.9, -0.33]);
  for (let i = 0; i < 4; i++) { const y = 1.88 - i * 0.1; pts.push([i % 2 ? -0.34 : 0.34, y, -0.33]); }
  pts.push([0.34, 1.55, -0.36], [0.4, 0.4, -0.42], [0.25, 0.22, -0.56]);
  const circuito = cano(pts, 0.016, mat('#B87333', { metal: true }));
  cena.add(circuito);
  const nPart = 70;
  const particulas = [];
  for (let i = 0; i < nPart; i++) { const m = caixa(0.028, 0.028, 0.028, mat('#ffffff', { unico: true, emissivo: '#000' }), [0, 0, 0], { sombra: false }); cena.add(m); particulas.push(m); }
  // compressor e grade do condensador
  const compressor = new THREE.Group();
  compressor.add(malha(new THREE.CapsuleGeometry(0.11, 0.1, 4, 10), mat('#1E1E22')));
  compressor.position.set(0.18, 0.2, -0.6);
  cena.add(compressor);
  const grade = new THREE.Group();
  for (let y = 0.35; y < 1.95; y += 0.06) grade.add(caixa(0.8, 0.008, 0.008, mat('#5B6270'), [0, y, -0.49], { sombra: false }));
  cena.add(grade);
  const calorAtras = [];
  for (let i = 0; i < 16; i++) { const m = caixa(0.05, 0.05, 0.05, mat('#FF7A3A', { emissivo: '#C0300A', opacidade: 0.7, unico: true }), [0, 0, 0], { sombra: false }); cena.add(m); calorAtras.push(m); }
  // ar frio escapando
  const arFrio = [];
  for (let i = 0; i < 18; i++) { const m = malha(new THREE.IcosahedronGeometry(0.05, 0), mat('#CFEFFF', { opacidade: 0.55, unico: true }), { sombra: false }); cena.add(m); arFrio.push(m); }

  const voce = criarPersonagem();
  cena.add(voce);

  let E;
  function inicial() {
    E = { fluxo: 0, gelado: 0, compressor: false, quente: 0, geada: 0, porta: 0, frio: false, ima: false };
    voce.visible = true;
    voce.position.set(PX, 0, PZ);
    voce.rotation.y = -0.25;
    voce.estado = { bracos: 'lado', expr: 'feliz' };
  }
  const corParticula = (u) => {
    const c = new THREE.Color();
    if (u < 0.08) return c.set('#FF3A1A');                       // saindo do compressor: bem quente
    if (u < 0.55) return c.set('#FF3A1A').lerp(new THREE.Color('#FFB020'), (u - 0.08) / 0.47); // esfriando na grade
    if (u < 0.82) return c.set('#3EA6F0');                        // evaporador: gelado
    return c.set('#3EA6F0').lerp(new THREE.Color('#9AA3AE'), (u - 0.82) / 0.18);
  };
  function montar(t) {
    particulas.forEach((m, i) => {
      const u = ((i / nPart + t * 0.12) % 1);
      m.visible = E.fluxo > 0 && u <= E.fluxo;
      m.position.copy(circuito.pontoEm(u));
      const c = corParticula(u);
      m.material.color.copy(c);
      m.material.emissive.copy(c).multiplyScalar(0.5);
    });
    comida.children.forEach((m) => m.material && m.material.emissive && m.material.emissive.set(E.gelado > 0.5 ? '#0B2A44' : '#000000'));
    geada.scale.y = Math.max(0.01, E.geada * 3);
    geada.visible = E.geada > 0.02;
    compressor.position.x = 0.18 + (E.compressor ? Math.sin(t * 60) * 0.006 : 0);
    calorAtras.forEach((m, i) => {
      const u = ((t * 0.35 + i / 16) % 1);
      m.visible = E.quente > 0.05;
      m.position.set(-0.35 + (i % 8) * 0.1, 0.4 + u * 1.7, -0.6 - u * 0.15);
      m.scale.setScalar(Math.max(0.01, E.quente * (1 - u)));
    });
    portaG.rotation.y = -E.porta;
    arFrio.forEach((m, i) => {
      const u = ((t * 0.5 + i / 18) % 1);
      m.visible = E.frio;
      m.position.set(-0.2 + (i % 6) * 0.1, 0.3 + (i % 3) * 0.25 - u * 0.25, 0.45 + u * 0.7);
      m.scale.setScalar(0.6 + u);
    });
    [borracha, borracha2].forEach((b) => b.material.emissive.set(E.ima && Math.sin(t * 10) > 0 ? '#2DBE60' : '#000000'));
  }
  const apresentar = (lt, b, bracos = 'lado', expr = 'feliz') => {
    voce.visible = true;
    voce.position.set(PX, 0, PZ);
    voce.rotation.y = -0.25;
    voce.estado = { bracos, expr, falando: b.falando(lt) };
  };
  const camFrente = { pos: [0, 1.15, 2.9], alvo: [0, 1.1, 0] };
  const camApresentador = { pos: [PX - 0.5, 1.45, PZ + 3.1], alvo: [PX - 0.4, 1.3, 0] };
  const camTras = { pos: [1.15, 1.25, -0.8], alvo: [-0.1, 1.05, -0.5] };

  const blocos = [
    {
      fala: 'Ela deixa tudo gelado o dia inteiro, sem ter nenhum gelo lá dentro. Como? E por que a parte de trás dela é quente?',
      destaque: ['gelado', 'gelo', 'quente'],
      corte: true,
      camera: { pos: [0.35, 1.25, 3.6], alvo: [0.3, 1.15, 0] },
      cameraFim: { pos: [0, 1.3, 2.4], alvo: [0, 1.2, 0] },
      aplicar(lt, b) { E.fluxo = 1; E.gelado = 1; E.geada = 1; },
    },
    {
      fala: 'Primeiro, um truque da natureza: quando um líquido vira gás, ele rouba calor. É por isso que álcool na mão dá aquele friozinho.',
      destaque: ['gás', 'calor', 'álcool'],
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) { apresentar(lt, b, lt > 3 ? 'aponta' : 'cabeca', 'surpreso'); },
      camada: (lt, b) => etiqueta(lt, b.palavra('rouba'), 'EVAPORAR = ROUBAR CALOR'),
    },
    {
      fala: 'Então você passa um líquido especial por canos dentro da geladeira. Ele evapora, e rouba o calor da comida.',
      destaque: ['canos', 'evapora', 'calor'],
      corte: true, corteSeco: true,
      camera: camFrente,
      aplicar(lt, b) {
        voce.visible = false;
        E.fluxo = lim((lt - b.palavra('canos') + 0.3) / 1.8);
        E.gelado = suave((lt - b.palavra('rouba')) / 1);
        E.geada = suave((lt - b.palavra('evapora')) / 2);
      },
      camada: (lt, b) => cartao(lt, b.palavra('evapora'), 'EVAPORADOR', 'O CANO GELADO DENTRO DO FREEZER'),
    },
    {
      fala: 'Mas agora esse gás está cheio de calor, e precisa jogar esse calor fora.',
      destaque: ['calor', 'fora'],
      corte: true,
      camera: { pos: [0.2, 1.5, 1.5], alvo: [0, 1.6, -0.3] },
      aplicar(lt, b) { E.fluxo = 1; E.gelado = 1; E.geada = 1; },
      camada: (lt, b) => etiqueta(lt, b.palavra('calor'), 'GÁS QUENTE'),
    },
    {
      fala: 'Então você põe um compressor, que aperta o gás, e uma grade atrás, onde ele solta o calor pra cozinha e volta a ser líquido.',
      destaque: ['compressor', 'grade', 'líquido'],
      corteSeco: true,
      camera: camTras,
      aplicar(lt, b) {
        Object.assign(E, { fluxo: 1, gelado: 1, geada: 1 });
        E.compressor = lt > b.palavra('compressor') - 0.2;
        E.quente = suave((lt - b.palavra('grade')) / 1.2);
      },
      camada: (lt, b) => cartao(lt, b.palavra('grade'), 'CONDENSADOR', 'A GRADE QUENTE ATRÁS DA GELADEIRA'),
      sons: [{ em: 'compressor', tipo: 'zap' }],
    },
    {
      fala: 'É por isso que a parte de trás da geladeira é quente, e ela não pode ficar colada na parede.',
      destaque: ['quente', 'parede'],
      corteSeco: true,
      camera: camApresentador,
      aplicar(lt, b) { Object.assign(E, { compressor: true, quente: 1 }); apresentar(lt, b, 'lado'); },
      camada: (lt, b) => ok(lt, b.palavra('parede')),
    },
    {
      fala: 'Mas toda vez que a porta fica mal fechada, o ar gelado escapa, e o motor trabalha dobrado.',
      destaque: ['porta', 'escapa'],
      corteSeco: true,
      camera: { pos: [1.4, 1.15, 2.6], alvo: [0.05, 0.85, 0.3] },
      aplicar(lt, b) {
        voce.visible = false;
        Object.assign(E, { quente: 0, compressor: true });
        E.porta = 0.35 * suave((lt - b.palavra('porta') + 0.3) / 0.6);
        E.frio = lt > b.palavra('escapa') - 0.4;
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('escapa'), 'AR GELADO ESCAPANDO'),
    },
    {
      fala: 'Então você põe uma borracha com ímã na porta: ela gruda sozinha, e não deixa o frio sair.',
      destaque: ['borracha', 'ímã', 'frio'],
      camera: { pos: [1.2, 1.0, 1.9], alvo: [0.25, 0.75, 0.4] },
      aplicar(lt, b) {
        E.porta = 0.35 * (1 - suave((lt - b.palavra('gruda') + 0.2) / 0.4));
        E.frio = E.porta > 0.05;
        E.ima = lt > b.palavra('ima') - 0.2;
      },
      camada: (lt, b) => ok(lt, b.palavra('frio')),
      sons: [{ em: 'gruda', tipo: 'baque' }],
    },
    {
      fala: 'Parabéns: você construiu uma geladeira!',
      destaque: ['parabéns', 'geladeira'],
      corteSeco: true,
      camera: { pos: [0.45, 1.3, 4.0], alvo: [0.35, 1.1, 0] },
      aplicar(lt, b) {
        Object.assign(E, { porta: 0, frio: false, ima: false, fluxo: 1, gelado: 1 });
        voce.visible = true;
        voce.position.set(PX, 0, PZ);
        voce.rotation.y = -0.2;
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
