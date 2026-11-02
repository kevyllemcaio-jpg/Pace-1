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
  titulo: ['VOCÊ É MAIS', '*RÁPIDO* QUE', 'UMA RÉGUA?'],
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

  // ---------- roteiro (8 min, horizontal) ----------
  const cam = {
    sala: { pos: [1.5, 1.1, 4.6], alvo: [0.75, 1.0, 0.1] },
    salaPerto: { pos: [1.4, 1.0, 3.6], alvo: [0.7, 1.05, 0.2] },
    sinal: { pos: [1.9, 1.8, 3.2], alvo: [0.1, 1.3, 0.2] },
    cons: { pos: [-0.4, 1.5, 3.4], alvo: [-0.4, 1.1, 0.2] },
    pista: { pos: [0.4, 0.7, 4.6], alvo: [0.0, 1.5, -2.0] },
    cozinha: { pos: [0.6, 2.3, 3.4], alvo: [0.5, 0.6, 0.2] },
    frente: { pos: [0.2, 1.6, 2.8], alvo: [0.0, 1.4, 0.1] },
    final: { pos: [1.5, 1.0, 4.4], alvo: [0, 0.95, 0] },
    carro: (lt) => { const x = -2 + 5.55 * lt; return { pos: [x + 1.5, 2.2, 7.0], alvo: [x, 0.9, -2] }; },
  };
  /** Um bloco do roteiro: ambiente, sinal visual, câmera e extras opcionais. */
  // no formato deitado o personagem fica pequeno: aproxima a câmera (exceto o plano do carro)
  const perto = (c) => (typeof c === 'function' ? c : { alvo: c.alvo, pos: c.alvo.map((v, i) => v + (c.pos[i] - v) * 0.72) });
  const bl = (fala, amb, sinalAtivo, camera0, o = {}) => {
    const camera = perto(camera0);
    const b = {
      fala,
      destaque: o.destaque || [],
      corteSeco: o.corte !== false,
      camera,
      aplicar(lt, bb) {
        setar(amb, sinalAtivo);
        if (o.queda != null) E.queda = { t0: bb.inicio + o.queda, lento: o.lento || 3 };
        if (o.largada != null) E.largada = bb.inicio + o.largada;
        if (o.carro) E.carroT0 = bb.inicio;
        if (o.caneca != null) E.caneca = { t0: bb.inicio + o.caneca, lento: 2 };
        apresentar(lt, bb, o.pose || 'aponta', o.expr || 'feliz');
      },
    };
    if (o.card) b.camada = (lt) => o.card(lt);
    if (o.etiqueta) b.camada = (lt) => etiqueta(lt, o.etiqueta.em, o.etiqueta.texto);
    return b;
  };

  const blocos = [
    // 1. Abertura
    bl('Peça pra alguém soltar uma régua entre os seus dedos. Você consegue pegar antes dela cair muito?', 'sala', 'nenhum', cam.sala, { pose: 'aponta', expr: 'surpreso', destaque: ['régua', 'pegar'] }),
    bl('Neste vídeo a gente responde essa pergunta, mede o seu tempo de reação e entende o que acontece no seu corpo nesse instante.', 'sala', 'nenhum', cam.salaPerto, { destaque: ['tempo de reação'] }),
    bl('Antes, o aviso: você vai precisar de uma régua de trinta centímetros e de um amigo. O teste leva dois minutos.', 'sala', 'nenhum', cam.sala, { destaque: ['trinta centímetros', 'amigo'] }),
    bl('Não tem pegadinha. A física da régua é simples, e o corpo humano é mais interessante do que parece.', 'sala', 'nenhum', cam.salaPerto, { destaque: ['física', 'interessante'] }),
    // 2. Medindo
    bl('Vamos medir. A régua começa com a parte de cima entre os dedos, e o amigo solta sem avisar.', 'sala', 'nenhum', cam.salaPerto, { queda: 2.0, lento: 3, destaque: ['solta', 'sem avisar'] }),
    bl('Quando a régua cai, você fecha a mão. Veja em câmera lenta: ela andou trinta centímetros antes de você pegar.', 'sala', 'nenhum', cam.salaPerto, { destaque: ['câmera lenta', 'trinta'], card: (lt) => cartao(lt, 4.0, '30 CM', 'ANTES DE VOCÊ PEGAR') }),
    bl('A física diz que, numa queda livre, a distância mostra o tempo. Trinta centímetros dão cerca de vinte e cinco centésimos de segundo.', 'sala', 'nenhum', cam.salaPerto, { destaque: ['queda livre', 'vinte e cinco centésimos'], card: (lt) => cartao(lt, 2.0, '0,25 s', 'TEMPO DE REAÇÃO') }),
    bl('A conta é simples: o tempo é a raiz quadrada de duas vezes a distância, dividida pela gravidade.', 'sala', 'nenhum', cam.salaPerto, { destaque: ['raiz quadrada', 'gravidade'] }),
    bl('Em geral, as pessoas ficam perto de dois a três décimos de segundo nessa tarefa visual. Quem é mais rápido, pega antes.', 'sala', 'nenhum', cam.sala, { destaque: ['dois a três décimos'] }),
    bl('Se a régua cair menos, o tempo diminui, mas ainda existe. O cérebro precisa de um caminho até a mão.', 'sala', 'nenhum', cam.salaPerto, { destaque: ['caminho'] }),
    // 3. Caminho do sinal
    bl('Então, o que acontece nesses dois décimos de segundo? Primeiro, o olho vê a régua.', 'sala', 'sinal', cam.sinal, { destaque: ['olho', 'vê'] }),
    bl('A luz vira um sinal elétrico na retina, e esse sinal começa a viajar pelo nervo óptico.', 'sala', 'sinal', cam.sinal, { destaque: ['sinal elétrico', 'nervo óptico'] }),
    bl('Esse sinal sobe até o cérebro. O cérebro reconhece a régua, decide, e manda uma ordem pela medula.', 'sala', 'sinal', cam.sinal, { destaque: ['cérebro', 'decide'] }),
    bl('A ordem desce pelo nervo até a mão, e os músculos dos dedos fecham.', 'sala', 'sinal', cam.sinal, { destaque: ['músculos', 'fecham'], card: (lt) => cartao(lt, 1.5, '120 m/s', 'NO NERVO, NO MÁXIMO') }),
    bl('O sinal é elétrico, e a velocidade depende do tipo de fibra nervosa e da sua espessura.', 'sala', 'sinal', cam.sinal, { destaque: ['fibra nervosa', 'espessura'] }),
    bl('Nas fibras com bainha de mielina, o sinal pula de trecho em trecho, e fica mais rápido.', 'sala', 'sinal', cam.sinal, { destaque: ['mielina', 'pula'] }),
    bl('Cada etapa leva um pouco de tempo. Por isso a reação é sempre maior do que o susto que você sente.', 'sala', 'nenhum', cam.salaPerto, { destaque: ['susto'] }),
    // 4. Carro na rua
    bl('Agora um exemplo de rua. Imagine um carro a oitenta quilômetros por hora. Veja em câmera lenta.', 'rua', 'nenhum', cam.carro, { carro: true, destaque: ['oitenta quilômetros'], corte: true, card: (lt) => cartao(lt, 1.0, '5,5 METROS', 'ANDADOS ANTES DE FREAR') }),
    bl('Em um quarto de segundo, esse carro anda mais de cinco metros. Você ainda nem começou a frear.', 'rua', 'nenhum', cam.carro, { destaque: ['quarto de segundo', 'cinco metros'] }),
    bl('É por isso que se mantém distância do carro da frente. Não é só a velocidade: é o tempo que você leva para reagir.', 'rua', 'nenhum', cam.carro, { destaque: ['distância', 'tempo'] }),
    bl('E o freio também precisa de tempo para agir. Então, a distância até parar é maior do que a distância de reação.', 'rua', 'nenhum', cam.carro, { destaque: ['freio', 'até parar'] }),
    // 5. Reflexo
    bl('Mas o corpo tem um atalho: o reflexo. Quando o médico bate no seu joelho, a perna chuta sozinha.', 'consultorio', 'reflexo', cam.cons, { pose: 'lado', expr: 'serio', destaque: ['atalho', 'sozinha'], etiqueta: { em: 2.0, texto: 'ATALHO NA MEDULA' } }),
    bl('Esse caminho é um arco curto. O sinal chega à medula e volta ao músculo, sem subir até o cérebro.', 'consultorio', 'reflexo', cam.cons, { pose: 'lado', expr: 'serio', destaque: ['arco curto', 'medula'] }),
    bl('Você não decidiu nada. Por isso o reflexo é tão rápido, e é por isso que ele existe: proteger o corpo.', 'consultorio', 'reflexo', cam.cons, { pose: 'lado', destaque: ['não decidiu', 'proteger'] }),
    bl('O reflexo também protege a mão de queimaduras: você solta a panela antes de sentir a dor por inteiro.', 'consultorio', 'reflexo', cam.cons, { pose: 'lado', destaque: ['panela', 'dor'] }),
    bl('Guarde essa ideia: existem dois caminhos, o rápido, que é o reflexo, e o pensado, que passa pelo cérebro.', 'consultorio', 'reflexo', cam.cons, { pose: 'lado', destaque: ['dois caminhos'], card: (lt) => cartao(lt, 1.0, 'MAIS RÁPIDO', 'SEM PASSAR PELO CÉREBRO') }),
    // 6. Largada
    bl('Agora, o limite do treino: a largada de corrida. As luzes acendem, e o atleta precisa sair.', 'pista', 'nenhum', cam.pista, { largada: 3.5, destaque: ['luzes', 'largada'] }),
    bl('Quem sai antes de um décimo de segundo é considerado falsa largada, por regra.', 'pista', 'nenhum', cam.pista, { destaque: ['décimo de segundo', 'falsa largada'], etiqueta: { em: 2.0, texto: 'FALSA LARGADA ABAIXO DE 0,1 s' } }),
    bl('Mas um estudo de 2009 registrou alguns velocistas reagindo em oito centésimos de segundo.', 'pista', 'nenhum', cam.pista, { destaque: ['2009', 'oito centésimos'] }),
    bl('Isso mostra o limite do corpo, e também que o treino faz diferença. O som, por exemplo, costuma ser respondido um pouco mais rápido do que a luz.', 'pista', 'nenhum', cam.pista, { destaque: ['treino', 'som'] }),
    // 7. Susto
    bl('Agora o reflexo do susto. Uma caneca escorrega da borda do balcão.', 'cozinha', 'nenhum', cam.cozinha, { pose: 'aponta', expr: 'surpreso', destaque: ['caneca', 'escorrega'], caneca: 1.2 }),
    bl('Antes de você pensar, a mão já se mexe. O corpo tenta pegar antes que a caneca caia.', 'cozinha', 'nenhum', cam.cozinha, { pose: 'aponta', expr: 'surpreso', destaque: ['antes de você pensar'] }),
    bl('O corpo reage a sinais de perigo antes de você perceber o que aconteceu. Por isso o coração também acelera.', 'cozinha', 'nenhum', cam.cozinha, { pose: 'aponta', destaque: ['perigo', 'coração'] }),
    bl('Com o tempo, a gente se acostuma com algumas situações, e o susto costuma diminuir.', 'sala', 'nenhum', cam.salaPerto, { destaque: ['acostuma'] }),
    // 8. Treinar e recapitular
    bl('Dá pra treinar o reflexo? Dá pra melhorar a sua reação em tarefas específicas, principalmente com prática.', 'sala', 'nenhum', cam.sala, { destaque: ['treinar', 'prática'] }),
    bl('O treino ajuda a prever quando algo vai acontecer. Mas a velocidade do sinal no nervo não muda.', 'sala', 'nenhum', cam.salaPerto, { destaque: ['prever', 'velocidade'] }),
    bl('Então o treino melhora a sua resposta, mas não cria um reflexo sobre-humano.', 'sala', 'nenhum', cam.sala, { destaque: ['não cria'] }),
    bl('Agora é a sua vez: peça pro amigo soltar a régua de novo, e veja se você ficou mais rápido.', 'sala', 'nenhum', cam.salaPerto, { destaque: ['sua vez', 'mais rápido'] }),
    bl('Faça o teste dez vezes, com a mão dominante e depois com a outra. A média mostra o seu tempo real.', 'sala', 'nenhum', cam.sala, { destaque: ['dez vezes', 'média'] }),
    bl('Vamos recapitular: o olho vê, o sinal sobe, o cérebro decide, e a mão responde.', 'sala', 'sinal', cam.sinal, { destaque: ['recapitular'] }),
    bl('E existe o atalho do reflexo, que passa pela medula e é mais rápido do que pensar.', 'consultorio', 'reflexo', cam.cons, { pose: 'lado', destaque: ['atalho'] }),
    // 9. Por que a reação muda
    bl('Até aqui, você viu a reação mais simples: uma luz, um som, uma régua. Agora vem a parte que muda de pessoa para pessoa.', 'sala', 'nenhum', cam.sala, { destaque: ['mais simples', 'muda'] }),
    bl('Imagine que você precisa escolher uma resposta entre duas opções. Agora pense em dez opções. O tempo de decisão aumenta.', 'sala', 'nenhum', cam.salaPerto, { destaque: ['duas opções', 'dez opções'] }),
    bl('Esse efeito tem nome: lei de Hick. Quanto mais opções, mais o cérebro demora para escolher a resposta certa.', 'sala', 'nenhum', cam.salaPerto, { destaque: ['lei de Hick'] }),
    bl('Por isso, num jogo com muitos botões, a resposta fica mais lenta, mesmo com dedos rápidos.', 'sala', 'nenhum', cam.sala, { destaque: ['muitos botões', 'dedos rápidos'] }),
    bl('E a idade também pesa. Em geral, a reação tende a ficar mais lenta com o passar dos anos.', 'sala', 'nenhum', cam.salaPerto, { destaque: ['idade', 'mais lenta'] }),
    bl('Isso não quer dizer que a pessoa perde a capacidade de reagir. O efeito costuma ser gradual, especialmente depois da meia-idade.', 'sala', 'nenhum', cam.sala, { destaque: ['gradual', 'meia-idade'] }),
    // 10. No dia a dia: cansaço, álcool e distração
    bl('Agora, o dia a dia. Cansaço, falta de sono e álcool tendem a aumentar o tempo de reação.', 'rua', 'nenhum', cam.carro, { carro: true, destaque: ['cansaço', 'álcool'] }),
    bl('Isso significa que, numa situação de trânsito, uma reação que parece pequena pode fazer diferença de vários metros.', 'rua', 'nenhum', cam.carro, { destaque: ['vários metros'] }),
    bl('A distração também pesa. Quando a atenção está no celular, o cérebro divide o foco e demora mais para perceber o perigo.', 'rua', 'nenhum', cam.carro, { destaque: ['distração', 'celular'] }),
    bl('Por isso, a reação é também uma questão de atenção. O corpo responde melhor quando o cérebro está presente.', 'rua', 'nenhum', cam.carro, { destaque: ['atenção'] }),
    // 11. Antecipação
    bl('Tem mais um truque, que é a antecipação. Quem prevê o movimento do outro começa a responder antes do sinal chegar.', 'pista', 'nenhum', cam.pista, { destaque: ['antecipação', 'prevê'] }),
    bl('Num jogo de bola, um bom jogador olha o ombro e o quadril do adversário, não só a bola.', 'pista', 'nenhum', cam.pista, { destaque: ['ombro', 'quadril'] }),
    bl('É por isso que atletas treinam com situações parecidas com o jogo real. O treino ensina o cérebro a prever o que vem.', 'pista', 'nenhum', cam.pista, { destaque: ['treinam', 'prever'] }),
    bl('Mas atenção: prever demais também erra. Se a pessoa se antecipa e o movimento não acontece, a resposta sai atrasada.', 'pista', 'nenhum', cam.pista, { destaque: ['prever demais', 'atrasada'] }),
    // 12. Teste de decisão na cozinha
    bl('Vamos fazer um teste de decisão. Uma caneca cai, e você precisa escolher o que fazer: segurar a caneca, ou deixar cair.', 'cozinha', 'nenhum', cam.cozinha, { pose: 'aponta', expr: 'surpreso', caneca: 1.0, destaque: ['teste de decisão'] }),
    bl('Quanto mais coisas você precisa decidir ao mesmo tempo, mais o corpo hesita. Esse é o custo da escolha.', 'cozinha', 'nenhum', cam.cozinha, { destaque: ['hesita', 'custo'] }),
    bl('Em situações reais, a melhor resposta costuma ser a mais simples. Ter um caminho claro ajuda o corpo a reagir.', 'cozinha', 'nenhum', cam.cozinha, { destaque: ['mais simples', 'caminho claro'] }),
    // 13. Resumo do capítulo e pausa
    bl('Resumindo: a reação depende do estímulo, do caminho do sinal, do número de opções, da idade, do sono e da atenção.', 'sala', 'nenhum', cam.sala, { destaque: ['resumindo', 'atenção'] }),
    bl('Não existe um número único para todo mundo. O seu tempo muda com o dia, o cansaço e a situação.', 'sala', 'nenhum', cam.salaPerto, { destaque: ['número único'] }),
    bl('Por isso, o teste da régua só faz sentido se você repetir várias vezes e olhar a média.', 'sala', 'nenhum', cam.sala, { destaque: ['média'] }),
    bl('Antes de terminar, uma pergunta: você acha que um tempo de reação pode ser treinado até o nível de um atleta?', 'sala', 'nenhum', cam.salaPerto, { destaque: ['treinado', 'atleta'] }),
    bl('A resposta depende do tipo de reação. Dá pra melhorar muito a resposta a um estímulo conhecido, mas o limite do sinal no nervo continua.', 'sala', 'nenhum', cam.sala, { destaque: ['estímulo conhecido', 'limite'] }),
    bl('Então, quando alguém disser que tem reflexo sobre-humano, a pergunta certa é: em qual situação?', 'sala', 'nenhum', cam.salaPerto, { destaque: ['sobre-humano', 'situação'] }),
    bl(FALA_FINAL, 'sala', 'nenhum', cam.final, { pose: 'aponta', corte: true, destaque: [] }),
  ];

  return { blocos, inicial, sempre(t) { montar(t); voce.animar(t); } };
}
