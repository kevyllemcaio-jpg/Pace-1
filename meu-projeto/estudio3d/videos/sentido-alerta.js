// VÍDEO: "E se você sentisse o perigo antes de ele acontecer?" (Short, vertical)
// Cada frase narrada aparece na tela no momento em que é dita.
// Cenas: rua (carro e pulo), cozinha (copo quebra e a cena volta no tempo), campo (bola),
// rua com pássaro, quarto (cansaço e silêncio). O personagem olha para a câmera nas falas de contato.
import * as THREE from 'three';
import { cartao, etiqueta, textoFinal, FALA_FINAL } from '../motor.js';
import { mat, caixa, cilindro, malha, carro } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';
import { criarRua } from '../cenarios/rua.js';

export const config = {
  titulo: ['E SE VOCÊ', 'SENTISSE O', '*PERIGO* ANTES?'],
  tituloEstilo: 'meio',
  sonsAuto: false, // só os 3 sons escolhidos, cada um uma vez
};

const CORES_CENA = { rua: '#9ED8FF', cozinha: '#1F5C5E', campo: '#8ED6FF', quarto: '#2B2E4A' };
const CALCADA_LONGE = -5.8, CALCADA_PERTO = 5.8; // calçada de cada lado da rua (z)
const smooth = (x) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };

export function criar(ctx) {
  const { cena } = ctx;
  const ruaG = new THREE.Group(), cozG = new THREE.Group(), campoG = new THREE.Group(), quartoG = new THREE.Group(), corpoG = new THREE.Group();
  [ruaG, cozG, campoG, quartoG, corpoG].forEach((g) => cena.add(g));

  // ---------- rua (carro e pássaro) ----------
  criarRua({ cena: ruaG, hemi: ctx.hemi, sol: ctx.sol }, { transversal: false, recuo: 16 });
  const auto = carro('#E8322B');
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
  const voce = criarPersonagem();
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
    // 0. gancho, olhando para a câmera
    { fala: 'E se você sentisse o perigo antes de ele acontecer?', destaque: ['perigo', 'antes'], corteSeco: true, camera: camRosto,
      aplicar(lt, b) { setar('rua', 'hook', b.inicio, 'normal', 'surpreso'); }, },
    // 1. atravessa
    { fala: 'Você atravessa a rua.', destaque: ['atravessa'], corteSeco: true, camera: { pos: [1.5, 1.4, 9.5], alvo: [0, 1.2, 2.0] },
      aplicar(lt, b) { setar('rua', 'andar', b.inicio, 'lado', 'feliz'); }, },
    // 2. carro surge
    { fala: 'E um carro surge da esquina.', destaque: ['carro', 'esquina'], corteSeco: true, camera: { pos: [5.5, 1.3, 9.0], alvo: [9.5, 1.0, -2.0] },
      aplicar(lt, b) { setar('rua', 'parar', b.inicio, 'aponta', 'surpreso'); E.tB = b.inicio; }, },
    // 3. pula antes do carro chegar (o carro passa em alta velocidade)
    { fala: 'Seu corpo já pula pra trás, antes de você entender.', destaque: ['pula', 'entender'], corteSeco: true, camera: { pos: [2.5, 1.6, 10.0], alvo: [0.0, 1.1, 4.5] },
      aplicar(lt, b) { setar('rua', 'pulo', b.inicio, 'lado', 'surpreso'); E.tC = b.inicio; }, sons: [{ em: () => 0.35, tipo: 'whoosh' }] },
    // 4. copo cai e quebra
    { fala: 'Um copo escorrega da mesa.', destaque: ['copo', 'escorrega'], corteSeco: true, camera: { pos: [0.6, 2.2, 3.6], alvo: [0.4, 0.9, 0.2] },
      aplicar(lt, b) { setar('cozinha', 'copo', b.inicio, 'aponta', 'surpreso'); }, sons: [{ em: () => 0.45, tipo: 'tum' }] },
    // 5. a cena volta no tempo e a mão pega
    { fala: 'E a sua mão já está embaixo dele.', destaque: ['mão', 'embaixo'], corteSeco: true, camera: { pos: [0.6, 2.2, 3.6], alvo: [0.4, 0.9, 0.2] },
      aplicar(lt, b) { setar('cozinha', 'copo_volta', b.inicio, 'aponta', 'feliz'); } },
    // 6. bola: ele vê de onde ela vem
    { fala: 'Num jogo, você vê de onde a bola vem, antes de ela sair do pé.', destaque: ['jogo', 'bola'], corteSeco: true, camera: { pos: [-3.0, 1.6, 5.0], alvo: [-1.0, 1.0, 0.0] },
      aplicar(lt, b) { setar('campo', 'bola', b.inicio, 'aponta', 'serio'); } },
    // 7. o alarme não desliga
    { fala: 'Só que o alarme não desliga.', destaque: ['alarme', 'não desliga'], corteSeco: true, camera: camRosto,
      aplicar(lt, b) { setar('rua', 'parado', b.inicio, 'normal', 'preocupado'); } },
    // 8. dispara com a cidade e com o pássaro
    { fala: 'Ele dispara com o barulho da cidade, e com a sombra de um pássaro.', destaque: ['dispara', 'pássaro'], corteSeco: true, camera: { pos: [0.0, 1.6, 9.0], alvo: [0.0, 1.3, 5.8] },
      aplicar(lt, b) { setar('rua', 'passaro', b.inicio, 'normal', 'preocupado'); } },
    // 9. não dorme direito
    { fala: 'Você não dorme direito, porque o corpo nunca sai do modo alerta.', destaque: ['não dorme', 'alerta'], corteSeco: true, camera: { pos: [0.6, 1.5, 3.0], alvo: [0, 1.3, 0] },
      aplicar(lt, b) { setar('quarto', 'bocejo', b.inicio, 'cabeca', 'serio'); } },
    // 10. ganha velocidade, perde o silêncio
    { fala: 'Você ganha velocidade, mas perde o silêncio.', destaque: ['velocidade', 'silêncio'], corteSeco: true, camera: { pos: [0.6, 1.5, 3.0], alvo: [0, 1.3, 0] },
      aplicar(lt, b) { setar('quarto', 'ouvidos', b.inicio, 'cabeca', 'preocupado'); } },
    // 11. pergunta final, olhando para a câmera
    { fala: 'E você: aguentaria ouvir o perigo o tempo todo, ou preferia não ouvir nada?', destaque: ['perigo', 'nada'], corteSeco: true, camera: camRosto,
      aplicar(lt, b) { setar('rua', 'hook', b.inicio, 'normal', 'serio'); }, sons: [{ em: () => 1.0, tipo: 'plim' }] },
  ];

  return { blocos, inicial, sempre(t) { montar(t); voce.animar(t); } };
}
