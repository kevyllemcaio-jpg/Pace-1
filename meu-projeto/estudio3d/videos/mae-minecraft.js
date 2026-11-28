// VÍDEO (Short, ~45 s): "Minha mãe jogou Minecraft pela primeira vez" — história com a MÃE (elenco fixo).
// Lições de retenção aplicadas: rosto em close no 1º quadro; algo que qualquer pessoa entende (mãe +
// videogame); começo rápido; mudança visual a cada 2–3 s (sala <-> jogo); sem pedido de inscrição no
// meio; final com pergunta para comentar.
// O jogo mostrado é um jogo de blocos GENÉRICO (cenarios/jogo-blocos.js): sem personagens, logos ou
// interface do jogo real.
import * as THREE from 'three';
import { suave, lim, mistura, cartao, etiqueta, som } from '../motor.js';
import { criarPersonagem } from '../personagem3d.js';
import { criarSala } from '../cenarios/sala.js';
import { criarJogo, CORES_MAE } from '../cenarios/jogo-blocos.js';
import { finalPergunta } from '../formato-dias.js';

const MAE = 'pt-BR-FranciscaNeural';

export const config = {
  titulo: ['MINHA MÃE JOGOU', '*MINECRAFT*', 'PELA 1ª VEZ'],
  velocidade: '+14%',
  musica: false,
};

export function criar(ctx) {
  const { cena, renderer } = ctx;
  const sala = criarSala(ctx);
  const jogo = criarJogo(ctx, { OX: 300 });
  const { P } = jogo;

  // a tela da TV mostra a câmera do jogo
  const rt = new THREE.WebGLRenderTarget(640, 360);
  sala.tela.material.map = rt.texture;
  sala.tela.material.needsUpdate = true;
  const camJogo = new THREE.PerspectiveCamera(55, 16 / 9, 0.1, 200);

  // elenco: a mãe (fixa) e "eu" (personagem principal do canal)
  const mae = criarPersonagem({ estilo: 'mae', cores: CORES_MAE });
  const eu = criarPersonagem();
  cena.add(mae, eu);
  const controle = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.05, 0.12), new THREE.MeshStandardMaterial({ color: '#1E1E22' }));
  cena.add(controle);
  // luz suave de frente para o rosto da mãe (ela fica de costas para o sol da sala)
  const luzRosto = new THREE.PointLight('#FFE6CC', 2.2, 3, 1.2);
  luzRosto.position.set(0.25, 1.9, -0.5);
  cena.add(luzRosto);

  let E;
  function inicial() {
    E = { luzSala: 1, verJogo: false, camJ: null, tremor: 0 };
    Object.assign(jogo.estado, { quebrado: 0, tronco: 0, casa: 0, noite: 0, zumbi: false, fazenda: false, semTeto: false });
    mae.position.set(0.25, 0, 0.6);
    mae.rotation.set(0, Math.PI, 0);
    mae.estado = { bracos: 'controle', expr: 'surpreso' };
    eu.position.set(-1.25, 0, 1.2);
    eu.rotation.set(0, 2.4, 0);
    eu.estado = { bracos: 'normal', expr: 'feliz' };
    jogo.avatar.position.set(...P(0, 0.1, 0));
    jogo.avatar.rotation.set(0, Math.PI, 0);
    jogo.avatar.estado = { bracos: 'normal', expr: 'feliz' };
  }
  const fala = (lt, b, p, bracos, expr, extra = {}) => { p.estado = { bracos, expr, falando: b.falando(lt), ...extra }; };
  const soco = (t) => (Math.sin(t * 14) > 0 ? 'aponta' : 'normal');

  // câmeras da sala (a mãe olha para a TV, de costas para a câmera "de trás")
  const close = { pos: [0.25, 1.85, -1.05], alvo: [0.25, 1.62, 0.6] };
  const closeLado = { pos: [-0.6, 1.85, -0.8], alvo: [0.25, 1.62, 0.6] };
  const ombro = { pos: [1.15, 2.05, 2.9], alvo: [0, 1.1, -1.4] };
  const geral = { pos: [-0.3, 1.95, 5.8], alvo: [-0.5, 1.2, 0.8] };
  // câmeras do jogo (posição do olho e alvo, em coordenadas do jogo)
  const cj = (pos, alvo) => ({ pos: P(...pos), alvo: P(...alvo) });
  const tremer = (pose, k, t) => (k <= 0 ? pose : { pos: pose.pos.map((v, i) => v + Math.sin(t * (60 + i * 7)) * 0.02 * k), alvo: pose.alvo });

  function sempre(t) {
    jogo.montar(t);
    mae.animar(t);
    eu.animar(t);
    // controle nas mãos da mãe (na frente da barriga, virado para a TV)
    controle.position.set(mae.position.x, 1.18, mae.position.z - 0.38);
    controle.rotation.set(0.3, 0, Math.sin(t * 13) * 0.05);
    controle.visible = mae.estado.bracos === 'controle';
    // 1) jogo -> textura da TV (céu e luz do jogo)
    const noite = jogo.estado.noite;
    sala.luz(1 - 0.75 * noite);
    const cam = E.camJ || cj([0.9, 2.6, 3.4], [0, 1, -2]);
    camJogo.position.set(...cam.pos);
    camJogo.lookAt(...cam.alvo);
    const fundo = cena.background.clone();
    cena.background.copy(jogo.ceu());
    renderer.setRenderTarget(rt);
    renderer.render(cena, camJogo);
    renderer.setRenderTarget(null);
    // 2) luz/fundo da cena principal
    if (E.verJogo) cena.background.copy(jogo.ceu());
    else { cena.background.copy(fundo); sala.luz(E.luzSala); }
  }
  // bloco mostrado em tela cheia dentro do jogo
  const noJogo = (pose) => (lt, b) => { E.camJ = pose; return pose; };

  const blocos = [
    {
      // 1º quadro: rosto da mãe em close, surpresa, com o título
      fala: 'Minha mãe jogou Minecraft pela primeira vez.',
      destaque: ['mãe', 'minecraft'],
      semLegenda: true,
      camera: (lt) => (lt < 1.6 ? close : ombro),
      aplicar(lt, b) { fala(lt, b, mae, 'controle', 'surpreso'); },
      sons: [{ em: () => 0.02, tipo: 'impacto' }, { em: () => 1.6, tipo: 'whoosh' }],
    },
    {
      fala: 'No primeiro minuto, ela quebrou um bloco.',
      destaque: ['quebrou', 'bloco'],
      corteSeco: true,
      camera: (lt, b) => { E.verJogo = true; return noJogo(cj([3.0, 2.6, 3.6], [1.5, 0.9, -0.8]))(lt, b); },
      aplicar(lt, b) {
        E.verJogo = true;
        jogo.avatar.position.set(...P(1.5, 0.1, 0.1));
        jogo.estado.quebrado = suave((lt - b.palavra('quebrou') + 0.2) / 1.1);
        jogo.avatar.estado = { bracos: jogo.estado.quebrado < 0.6 && lt > 0.3 ? soco(lt) : 'cima', expr: 'feliz' };
      },
      sons: [{ em: 'quebrou', tipo: 'martelo' }, { em: 'quebrou', depois: 0.3, tipo: 'martelo' }, { em: 'bloco', tipo: 'quebra' }],
    },
    {
      fala: 'Ai, desculpa!',
      voz: MAE,
      destaque: ['desculpa'],
      corteSeco: true,
      camera: closeLado,
      aplicar(lt, b) { E.verJogo = false; jogo.estado.quebrado = 1; fala(lt, b, mae, 'cabeca', 'preocupado'); },
      camada: (lt) => som(lt, 0.1, 'DESCULPA!', 1.2),
    },
    {
      fala: 'Depois, achou uma árvore e foi derrubando com a mão.',
      destaque: ['árvore', 'mão'],
      corteSeco: true,
      camera: (lt, b) => noJogo(lt < b.dur * 0.55 ? cj([0.6, 2.2, 1.8], [-2.5, 2.0, -2.5]) : cj([-1.0, 1.5, 1.6], [-2.5, 1.5, -2.3]))(lt, b),
      aplicar(lt, b) {
        E.verJogo = true;
        jogo.avatar.position.set(...P(-2.5, 0.1, -1.3));
        const ini = b.palavra('derrubando');
        jogo.estado.tronco = Math.max(0, Math.min(4, (lt - ini) * 2.6));
        jogo.avatar.estado = { bracos: lt > ini - 0.3 ? soco(lt) : 'normal', expr: 'serio' };
      },
      sons: [{ em: 'derrubando', tipo: 'martelo' }, { em: 'derrubando', depois: 0.4, tipo: 'martelo' }, { em: 'derrubando', depois: 0.8, tipo: 'martelo' }, { em: 'mao', tipo: 'martelo' }],
    },
    {
      fala: 'Cadê o machado? Isso machuca!',
      voz: MAE,
      destaque: ['machado', 'machuca'],
      corteSeco: true,
      camera: (lt) => (lt < 1.1 ? ombro : close),
      aplicar(lt, b) { E.verJogo = false; jogo.estado.tronco = 4; E.camJ = cj([-1.0, 1.5, 1.6], [-2.5, 1.5, -2.3]); fala(lt, b, mae, lt < 1.1 ? 'controle' : 'cabeca', 'preocupado'); },
      sons: [{ em: () => 1.1, tipo: 'whoosh' }],
    },
    {
      fala: 'Construiu a primeira casa. Sem porta.',
      destaque: ['casa', 'porta'],
      corteSeco: true,
      camera: (lt, b) => noJogo(cj([-1.5, 7, 5.5], [2.0, 1.0, -4.8]))(lt, b),
      aplicar(lt, b) {
        E.verJogo = true;
        jogo.avatar.position.set(...P(0.4, 0.1, -2.6));
        jogo.avatar.rotation.y = 2.36;
        jogo.estado.casa = lim((lt - 0.2) / (b.palavra('sem') - 0.3));
        jogo.avatar.estado = { bracos: jogo.estado.casa < 1 ? soco(lt) : 'cima', expr: 'feliz' };
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('porta'), 'SEM PORTA'),
      sons: [0.3, 0.6, 0.9, 1.2, 1.5].map((d) => ({ em: () => d, tipo: 'pop' })).concat([{ em: 'porta', tipo: 'dia' }]),
    },
    {
      fala: 'Aí escureceu.',
      destaque: ['escureceu'],
      corteSeco: true,
      camera: (lt, b) => noJogo(cj([2.5, 1.4, 1.5], [2.5, 1.4, -3.5]))(lt, b),
      aplicar(lt, b) {
        E.verJogo = true;
        jogo.estado.casa = 1;
        jogo.avatar.position.set(...P(4.6, 0.1, -2.6));
        jogo.estado.noite = suave((lt - b.palavra('escureceu') + 0.1) / 0.6);
        jogo.estado.zumbi = jogo.estado.noite > 0.5;
      },
      sons: [{ em: 'escureceu', tipo: 'impacto' }, { em: 'escureceu', depois: 0.3, tipo: 'tensao' }],
    },
    {
      fala: 'Socorro! Tem um bicho lá fora!',
      voz: MAE,
      destaque: ['socorro', 'bicho'],
      corteSeco: true,
      camera: (lt) => tremer(close, 1 - lim(lt / 1.2), lt),
      aplicar(lt, b) {
        E.verJogo = false;
        Object.assign(jogo.estado, { casa: 1, noite: 1, zumbi: true });
        E.camJ = cj([2.5, 1.4, 1.5], [2.5, 1.4, -3.5]);
        fala(lt, b, mae, 'cabeca', 'surpreso');
      },
      camada: (lt) => som(lt, 0.05, 'AAAH!', 1.0),
      sons: [{ em: () => 0.02, tipo: 'glitch' }],
    },
    {
      fala: 'Ela se trancou dentro da casa sem porta, e adorou.',
      destaque: ['trancou', 'adorou'],
      corteSeco: true,
      camera: (lt, b) => noJogo(cj([2.5, 11, 0.5], [2.5, 0, -5.4]))(lt, b),
      aplicar(lt, b) {
        E.verJogo = true;
        Object.assign(jogo.estado, { casa: 1, noite: 1, zumbi: true, semTeto: true });
        jogo.avatar.position.set(...jogo.CASA);
        jogo.avatar.position.y = 0.1;
        jogo.avatar.rotation.y = Math.PI;
        jogo.avatar.estado = { bracos: lt > b.palavra('adorou') ? 'cima' : 'normal', expr: 'feliz', pulo: lt > b.palavra('adorou') ? 0.6 : 0 };
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('adorou'), 'SEM PORTA = SEM ZUMBI'),
      sons: [{ em: 'trancou', tipo: 'baque' }, { em: 'adorou', tipo: 'ok' }],
    },
    {
      fala: 'Tá vendo? Por isso eu não fiz porta.',
      voz: MAE,
      destaque: ['porta'],
      corteSeco: true,
      camera: closeLado,
      aplicar(lt, b) { E.verJogo = false; Object.assign(jogo.estado, { casa: 1, noite: 1, zumbi: true }); fala(lt, b, mae, 'aponta', 'sorriso'); },
      sons: [{ em: 'porta', tipo: 'brilho' }],
    },
    {
      fala: 'Três horas depois, eu chamei pra jantar. Ela ainda tava jogando.',
      destaque: ['três', 'jantar', 'jogando'],
      corteSeco: true,
      camera: (lt, b) => (lt < b.palavra('ela') ? geral : ombro),
      aplicar(lt, b) {
        E.verJogo = false;
        E.luzSala = 0.25;
        Object.assign(jogo.estado, { casa: 1, noite: 1, zumbi: true });
        fala(lt, b, eu, lt < b.palavra('ela') ? 'aceno' : 'cabeca', lt < b.palavra('ela') ? 'feliz' : 'surpreso');
        mae.estado = { bracos: 'controle', expr: 'serio' };
      },
      camada: (lt, b) => cartao(lt, b.palavra('tres'), '3 HORAS', 'DEPOIS'),
      sons: [{ em: 'tres', tipo: 'tique' }, { em: 'tres', depois: 0.25, tipo: 'tique' }, { em: 'tres', depois: 0.5, tipo: 'tique' }, { em: 'ela', tipo: 'whoosh' }],
    },
    {
      fala: 'Hoje ela tem uma fazenda, nove galinhas, e não me deixa entrar na casa dela.',
      destaque: ['fazenda', 'galinhas', 'entrar'],
      corteSeco: true,
      camera: (lt, b) => noJogo(lt < b.palavra('nao') ? cj([-1, 3.2, 4.6], [-2, 0.4, 0]) : cj([2.5, 2.2, -0.4], [2.5, 1.2, -5.5]))(lt, b),
      aplicar(lt, b) {
        E.verJogo = true;
        Object.assign(jogo.estado, { casa: 1, noite: 0, zumbi: false, fazenda: true });
        const porta = lt > b.palavra('nao');
        jogo.avatar.position.set(...(porta ? P(2.5, 0.1, -3.4) : P(-3.2, 0.1, 1.8)));
        jogo.avatar.rotation.y = porta ? 0 : -2.6;
        jogo.avatar.estado = { bracos: porta ? 'aponta' : 'cima', expr: porta ? 'serio' : 'feliz' };
      },
      camada: (lt, b) => etiqueta(lt, b.palavra('entrar'), 'PROIBIDO ENTRAR'),
      sons: [{ em: 'galinhas', tipo: 'pop' }, { em: 'galinhas', depois: 0.15, tipo: 'pop' }, { em: 'nao', tipo: 'whoosh' }, { em: 'entrar', tipo: 'baque' }],
    },
    {
      fala: 'E a sua mãe, já jogou videogame? Comenta aí!',
      semLegenda: true,
      corteSeco: true,
      camera: geral,
      aplicar(lt, b) {
        E.verJogo = false;
        E.luzSala = 1;
        Object.assign(jogo.estado, { casa: 1, fazenda: true });
        eu.rotation.y = mistura(2.4, 0.5, suave(lt / 0.6));
        eu.estado = { bracos: 'aceno', expr: 'feliz', falando: b.falando(lt) };
        mae.rotation.y = mistura(Math.PI, 0.4, suave(lt / 0.6));
        mae.estado = { bracos: 'aceno', expr: 'feliz' };
      },
      camada: (lt, b) => finalPergunta(lt, ['E A SUA MÃE,', '*JÁ JOGOU VIDEOGAME?*'], 'COMENTA AÍ! 👇', b.palavra('comenta')),
      sons: [{ em: () => 0.02, tipo: 'pop' }, { em: 'comenta', tipo: 'plim' }],
    },
  ];

  return { blocos, inicial, sempre };
}
