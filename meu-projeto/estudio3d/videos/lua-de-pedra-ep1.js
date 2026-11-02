// LUA DE PEDRA — Episódio 1: "A pedreira". Série original em estilo de blocos (vertical).
import * as THREE from 'three';
import { cartao, etiqueta } from '../motor.js';
import { mat, caixa, malha } from '../mundo.js';

export const config = {
  titulo: ['LUA DE PEDRA', 'EP. 1', '*A PEDREIRA*'],
  tituloEstilo: 'meio',
  sonsAuto: false,
};

const CEU = '#0E1638';
const smooth = (x) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };

/** Personagem em blocos (feito de cubos). Pés em y=0. */
function personagem({ cabelo, camisa, calca, tenis, cor = '#E0A574', bone = null, lanterna = false }) {
  const g = new THREE.Group();
  const add = (w, h, d, c, p) => { const m = caixa(w, h, d, mat(c), p, { sombra: false }); g.add(m); return m; };
  add(0.42, 0.42, 0.42, cor, [0, 1.55, 0]);              // cabeça
  add(0.44, 0.12, 0.44, cabelo, [0, 1.78, 0]);            // cabelo
  add(0.07, 0.07, 0.02, '#111111', [-0.1, 1.58, 0.22]);   // olhos
  add(0.07, 0.07, 0.02, '#111111', [0.1, 1.58, 0.22]);
  add(0.5, 0.55, 0.26, camisa, [0, 1.05, 0]);             // tronco
  add(0.16, 0.55, 0.16, camisa, [-0.34, 1.05, 0]);        // braços
  const bd = add(0.16, 0.55, 0.16, camisa, [0.34, 1.05, 0]);
  add(0.15, 0.12, 0.15, cor, [-0.34, 0.7, 0]);            // mãos
  add(0.15, 0.12, 0.15, cor, [0.34, 0.7, 0]);
  add(0.5, 0.34, 0.26, calca, [0, 0.55, 0]);              // quadril
  add(0.22, 0.5, 0.24, calca, [-0.13, 0.25, 0]);          // pernas
  add(0.22, 0.5, 0.24, calca, [0.13, 0.25, 0]);
  add(0.24, 0.1, 0.3, tenis, [-0.13, 0.05, 0.03]);        // tênis
  add(0.24, 0.1, 0.3, tenis, [0.13, 0.05, 0.03]);
  if (bone) add(0.46, 0.1, 0.46, bone, [0, 1.86, 0]), add(0.3, 0.04, 0.2, bone, [0, 1.82, 0.3]);
  if (lanterna) add(0.14, 0.18, 0.14, '#FFD21F', [0.34, 0.5, 0.2]);
  g.bd = bd;
  return g;
}

export function criar(ctx) {
  const { cena } = ctx;
  const cenaG = new THREE.Group();
  cena.add(cenaG);

  // chão de blocos de grama (xadrez de dois verdes)
  for (let x = -12; x < 12; x++) for (let z = -12; z < 10; z++) {
    cenaG.add(caixa(1, 0.2, 1, mat((x + z) % 2 ? '#5FA83A' : '#55973A'), [x + 0.5, -0.1, z + 0.5], { sombra: false }));
  }
  // árvores de blocos
  const arvore = (x, z) => {
    cenaG.add(caixa(0.4, 1.6, 0.4, mat('#6B4A2B'), [x, 0.8, z]));
    cenaG.add(caixa(1.8, 1.0, 1.8, mat('#2E7D32'), [x, 2.0, z]));
    cenaG.add(caixa(1.2, 0.8, 1.2, mat('#3C9A3F'), [x, 2.9, z]));
  };
  [[-6, -9], [-3, -10], [4, -9], [7, -10], [-8, -4], [8, -5]].forEach(([x, z]) => arvore(x, z));
  // cerca de madeira
  for (let x = -5; x <= -1; x++) {
    cenaG.add(caixa(0.2, 0.9, 0.2, mat('#8D6E4B'), [x, 0.45, -2.5]));
  }
  cenaG.add(caixa(4.4, 0.12, 0.12, mat('#A0825A'), [-3, 0.6, -2.5]));
  cenaG.add(caixa(4.4, 0.12, 0.12, mat('#A0825A'), [-3, 0.3, -2.5]));
  // parede de pedra da pedreira, com portão de ferro no meio
  for (let x = -5; x <= 5; x++) for (let y = 0; y < 4; y++) {
    if (Math.abs(x) <= 1 && y < 2.5) continue; // espaço do portão
    cenaG.add(caixa(1, 1, 1, mat(['#8A8F98', '#7A7F88', '#9097A0'][(x + y + 9) % 3]), [x, y + 0.5, -6]));
  }
  const portao = new THREE.Group();
  portao.add(caixa(2.0, 2.4, 0.2, mat('#3A3E48'), [0, 1.2, -5.9]));
  for (let i = -0.8; i <= 0.8; i += 0.4) portao.add(caixa(0.06, 2.4, 0.08, mat('#23262E'), [i, 1.2, -5.8]));
  portao.position.set(0, 0, 0);
  cenaG.add(portao);

  // lua cheia
  const lua = malha(new THREE.SphereGeometry(3.2, 24, 18), mat('#FFF4C2', { semNeblina: true, emissivo: '#FFE9A0' }), { sombra: false });
  lua.position.set(0, 13, -34);
  cena.add(lua);

  // Leo e Seu Abel
  const leo = personagem({ cabelo: '#4A2F1B', camisa: '#8F9399', calca: '#2F4D7A', tenis: '#D7261E' });
  cena.add(leo);
  const abel = personagem({ cabelo: '#BDBDBD', camisa: '#6B4A2B', calca: '#2B2B2B', tenis: '#3E2F20', bone: '#2E7D32', lanterna: true, cor: '#D9A070' });
  cena.add(abel);

  // vulto (animal da floresta, em blocos escuros)
  const vulto = new THREE.Group();
  vulto.add(caixa(1.2, 0.6, 0.5, mat('#1A1A22'), [0, 0.6, 0], { sombra: false }));
  vulto.add(caixa(0.5, 0.5, 0.5, mat('#1A1A22'), [0.8, 0.85, 0], { sombra: false }));
  vulto.add(caixa(0.2, 0.2, 0.2, mat('#FFD21F'), [1.05, 0.95, 0.12], { sombra: false }));
  vulto.add(caixa(0.2, 0.2, 0.2, mat('#FFD21F'), [1.05, 0.95, -0.12], { sombra: false }));
  cena.add(vulto);

  let E;
  function inicial() {
    E = { t0: 0, cena: 'lua' };
    leo.position.set(0, 0, 0); abel.position.set(7, 0, -5.2); vulto.visible = false;
  }
  function montar(t) {
    const lt = t - E.t0;
    cena.background.set(CEU);
    leo.position.set(0, 0, 0);
    leo.rotation.y = 0;
    abel.visible = false;
    vulto.visible = false;
    portao.rotation.y = 0;
    portao.position.set(0, 0, 0);
    if (E.cena === 'floresta') {
      vulto.visible = true;
      vulto.position.set(-2.6 + 4.2 * smooth((lt - 0.5) / 2.0), 0, -3.5);
    }
    if (E.cena === 'pedreira') {
      abel.visible = true;
      abel.position.set(7 - 5.6 * smooth(lt / 2.0), 0, -5.2 + 0.0);
      if (lt > 2.2) portao.rotation.y = 0; // portão fechado
    }
    if (E.cena === 'uivo') {
      abel.visible = true;
      abel.position.set(1.6, 0, -5.2);
      const sac = Math.sin(lt * 60) * 0.02 * Math.min(1, lt * 2);
      portao.position.x = sac;
      portao.rotation.z = sac * 0.5;
    }
  }
  const at = (cena_, b, lt, t) => { E.cena = cena_; E.t0 = b.inicio; };

  const blocos = [
    { fala: 'Na minha cidade, algumas coisas só acontecem quando a lua está cheia.', destaque: ['lua', 'cheia'], corteSeco: true,
      camera: { pos: [0, 1.9, 9], alvo: [0, 2.6, -6] },
      aplicar(lt, b) { E.cena = 'lua'; E.t0 = b.inicio; } },
    { fala: 'Quem está aí?', destaque: ['está aí'], corteSeco: true,
      camera: { pos: [0.5, 1.4, 6], alvo: [-1, 1.2, -3] },
      aplicar(lt, b) { E.cena = 'floresta'; E.t0 = b.inicio; }, sons: [{ em: () => 0.4, tipo: 'motor' }] },
    { fala: 'Não entra aí de noite.', destaque: ['não entra'], corteSeco: true,
      camera: { pos: [-2.5, 1.4, 5], alvo: [1, 1.3, -5] },
      aplicar(lt, b) { E.cena = 'pedreira'; E.t0 = b.inicio; }, sons: [{ em: () => 1.9, tipo: 'baque' }] },
    { fala: 'Eu devia ter escutado.', destaque: ['escutado'], corteSeco: true,
      camera: { pos: [0, 1.2, 4], alvo: [0, 1.6, -6] },
      aplicar(lt, b) { E.cena = 'uivo'; E.t0 = b.inicio; }, sons: [{ em: () => 0.2, tipo: 'uivo' }],
      camada: (lt) => etiqueta(lt, 1.0, 'CONTINUA...') },
  ];

  return { blocos, inicial, sempre(t) { montar(t); } };
}
