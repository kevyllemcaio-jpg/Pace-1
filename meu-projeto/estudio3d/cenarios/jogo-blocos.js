// Mundo de um jogo de blocos GENÉRICO (sem personagens, logos ou interface de jogos reais):
// chão de grama em blocos de 1 m, árvores, uma casa que vai sendo construída, um zumbi genérico
// e galinhas. Fica longe da sala (x = OX) e é visto pela câmera do jogo (na TV ou em tela cheia).
//
// const j = criarJogo(ctx, { OX: 300 });
//   j.estado = { quebrado: 0..1, tronco: 0..4, casa: 0..1, noite: 0..1, zumbi: bool, fazenda: bool, semTeto: bool }
//   j.montar(t)          aplica o estado (chamar a cada quadro)
//   j.avatar             personagem dentro do jogo (a mãe)
//   j.P(x, y, z)         converte coordenadas do jogo para o mundo
import * as THREE from 'three';
import { mat, caixa } from '../mundo.js';
import { criarPersonagem } from '../personagem3d.js';

export const CORES_MAE = { roupa: '#8E44AD', roupaEscura: '#6C3483', calca: '#2C3E50', cabelo: '#5A3A22', sola: '#8E44AD' };

export function criarJogo(ctx, { OX = 300 } = {}) {
  const { cena } = ctx;
  const P = (x, y, z) => [OX + x, y, z];
  const grama = mat('#5DBB46'), terra = mat('#8B5A2B'), madeira = mat('#7A4E2A'), folha = mat('#2F8F3A'), tabua = mat('#C8955A'), pedra = mat('#8E9196');
  const bloco = (x, y, z, m, s = 1) => caixa(s, s, s, m, P(x, y + s / 2, z));

  // chão: 16 x 14 blocos (terra com tampa de grama)
  for (let x = -8; x < 8; x++) for (let z = -10; z < 4; z++) {
    cena.add(caixa(1, 0.8, 1, terra, P(x + 0.5, -0.4, z + 0.5), { sombra: false }));
    cena.add(caixa(1, 0.2, 1, grama, P(x + 0.5, 0.1 - 0.1, z + 0.5), { sombra: false }));
  }
  // bloco que ela quebra (com "rachaduras")
  const alvo = new THREE.Group();
  alvo.add(caixa(1, 0.8, 1, terra, [0, 0.4, 0]), caixa(1, 0.2, 1, grama, [0, 0.9, 0]));
  const racha = caixa(1.02, 0.05, 1.02, mat('#1A1A1A', { unico: true, opacidade: 0 }), [0, 0.6, 0], { sombra: false });
  alvo.add(racha);
  alvo.position.set(...P(1.5, 0, -1.5));
  cena.add(alvo);
  const cacos = [];
  for (let i = 0; i < 10; i++) { const c = caixa(0.18, 0.18, 0.18, i % 3 ? terra : grama, [0, 0, 0]); cena.add(c); cacos.push(c); }

  // árvore que ela derruba (4 blocos de tronco) + árvores fixas
  const tronco = [0, 1, 2, 3].map((i) => { const m = bloco(-2.5, i, -2.5, madeira); cena.add(m); return m; });
  const copa = new THREE.Group();
  for (let x = -1; x <= 1; x++) for (let z = -1; z <= 1; z++) for (let y = 0; y < 2; y++) if (!(y === 1 && Math.abs(x) + Math.abs(z) === 2)) copa.add(caixa(1, 1, 1, folha, [x, y + 0.5, z]));
  copa.position.set(...P(-2.5, 4, -2.5));
  cena.add(copa);
  for (const [x, z] of [[-6.5, -7.5], [5.5, -8.5], [6.5, -3.5], [-6.5, 1.5]]) {
    for (let i = 0; i < 4; i++) cena.add(bloco(x, i, z, madeira));
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) cena.add(bloco(x + a, 4, z + b, folha), bloco(x + a, 5, z + b, folha));
  }
  // pedras ao fundo
  for (let x = -8; x < 8; x += 1) cena.add(bloco(x + 0.5, 0, -9.5, pedra), bloco(x + 0.5, 1 + ((x * 7) % 3 === 0 ? 1 : 0), -9.5, pedra));

  // casa 4x4, 3 de altura, SEM PORTA (blocos aparecem na ordem de construção)
  const casa = [];
  const CX = 2.5, CZ = -5.5;
  for (let y = 0; y < 3; y++) for (let i = 0; i < 4; i++) for (const [x, z] of [[i, 0], [3, i], [3 - i, 3], [0, 3 - i]]) {
    const m = bloco(CX + x - 1.5, y, CZ + z - 1.5, tabua);
    m.visible = false;
    cena.add(m);
    if (!casa.some((c) => c.position.equals(m.position))) casa.push(m);
  }
  for (let x = 0; x < 4; x++) for (let z = 0; z < 4; z++) { const m = bloco(CX + x - 1.5, 3, CZ + z - 1.5, madeira); m.visible = false; cena.add(m); casa.push(m); }

  // fazenda: plantação e galinhas
  const fazenda = new THREE.Group();
  for (let x = 0; x < 5; x++) for (let z = 0; z < 3; z++) {
    fazenda.add(caixa(0.98, 0.05, 0.98, mat('#5C3A1E'), [OX - 5.5 + x, 0.21, -1.5 + z]));
    fazenda.add(caixa(0.6, 0.45, 0.6, mat('#D9B23A'), [OX - 5.5 + x, 0.45, -1.5 + z]));
  }
  const galinhas = [];
  for (let i = 0; i < 9; i++) {
    const g = new THREE.Group();
    g.add(caixa(0.4, 0.35, 0.5, mat('#FFFFFF'), [0, 0.35, 0]), caixa(0.25, 0.25, 0.22, mat('#FFFFFF'), [0, 0.6, 0.25]));
    g.add(caixa(0.1, 0.1, 0.12, mat('#E8A33D'), [0, 0.58, 0.41]), caixa(0.08, 0.1, 0.08, mat('#D93A3A'), [0, 0.76, 0.27]));
    g.position.set(OX - 1 + (i % 3) * 1.1, 0.2, 0.2 + Math.floor(i / 3) * 0.9);
    fazenda.add(g);
    galinhas.push(g);
  }
  cena.add(fazenda);

  // zumbi genérico (pele cinza-esverdeada, roupa marrom rasgada)
  const zumbi = criarPersonagem({ cores: { pele: '#9DB08A', roupa: '#6B4E3A', roupaEscura: '#4E3829', calca: '#3A3A3A', cabelo: '#2B2B2B', tenis: '#3A3A3A', sola: '#2B2B2B', bochecha: '#9DB08A', boca: '#3A1A1A' } });
  zumbi.estado = { bracos: 'aponta', expr: 'serio' };
  cena.add(zumbi);

  // avatar da mãe dentro do jogo
  const avatar = criarPersonagem({ estilo: 'mae', cores: CORES_MAE });
  avatar.position.set(...P(0, 0.2, 0));
  cena.add(avatar);

  // céu e luz do jogo (aplicados quando a câmera do jogo renderiza)
  const ceuDia = new THREE.Color('#7EC8FF'), ceuNoite = new THREE.Color('#0B1230');
  const estado = { quebrado: 0, tronco: 0, casa: 0, noite: 0, zumbi: false, fazenda: false, semTeto: false };

  return {
    P, avatar, estado, OX,
    CASA: P(CX, 0, CZ),
    ceu() { return ceuDia.clone().lerp(ceuNoite, estado.noite); },
    montar(t) {
      const e = estado;
      // bloco quebrando: racha escurece, depois some e solta cacos
      racha.material.opacity = Math.min(0.85, e.quebrado * 1.6);
      alvo.visible = e.quebrado < 0.6;
      cacos.forEach((c, i) => {
        const u = (e.quebrado - 0.6) * 2.5;
        c.visible = u > 0 && u < 0.95; // somem antes do fim (não ficam no chão)
        const a = i * 0.63;
        c.position.set(alvo.position.x + Math.cos(a) * u * 0.8, 0.6 + u * 1.2 - u * u * 1.6, alvo.position.z + Math.sin(a) * u * 0.8);
        c.rotation.set(u * 5 + i, u * 3, 0);
      });
      tronco.forEach((m, i) => (m.visible = i >= Math.floor(e.tronco)));
      copa.visible = e.tronco < 4;
      const n = Math.floor(e.casa * casa.length);
      casa.forEach((m, i) => (m.visible = i < n && !(e.semTeto && i >= casa.length - 16)));
      fazenda.visible = e.fazenda;
      galinhas.forEach((g, i) => { g.rotation.y = Math.sin(t * 1.3 + i) * 0.8; g.position.y = 0.2 + Math.abs(Math.sin(t * 6 + i)) * 0.05; });
      zumbi.visible = e.zumbi;
      if (e.zumbi) {
        zumbi.position.set(...P(CX + Math.sin(t * 0.7) * 1.5, 0.2, CZ + 2.6));
        zumbi.rotation.y = Math.PI;
        zumbi.estado = { bracos: 'aponta', expr: 'serio', andar: 0.6 };
      }
      zumbi.animar(t);
      avatar.animar(t);
    },
  };
}
