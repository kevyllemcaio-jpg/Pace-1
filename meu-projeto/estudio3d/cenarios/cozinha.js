// Cenário de cozinha low-poly (usado nos vídeos do micro-ondas e da geladeira).
// Origem: chão em y = 0; parede do fundo em z = -0.9; tudo centrado em x = 0.
import * as THREE from 'three';
import { mat, caixa, cilindro, malha } from '../mundo.js';

export function criarCozinha(ctx, { semBancadaCentro = false } = {}) {
  const { cena } = ctx;
  cena.background.set('#F6E7C8');
  cena.fog.color.set('#F6E7C8');
  // piso xadrez
  for (let i = -6; i < 6; i++) for (let j = -2; j < 6; j++) {
    cena.add(caixa(0.6, 0.04, 0.6, mat((i + j) % 2 ? '#E9E2D0' : '#C9B79A'), [i * 0.6 + 0.3, -0.02, j * 0.6 + 0.3], { sombra: false }));
  }
  // paredes com azulejo
  cena.add(caixa(8, 3.2, 0.1, mat('#F3EBDD'), [0, 1.6, -0.95]));
  for (let x = -3.9; x < 4; x += 0.3) for (let y = 0.95; y < 1.95; y += 0.3) cena.add(caixa(0.28, 0.28, 0.02, mat(Math.round((x + y) * 10) % 2 ? '#DCEBF7' : '#CFE3F3'), [x + 0.15, y + 0.15, -0.89], { sombra: false }));
  cena.add(caixa(0.1, 3.2, 6, mat('#EFE4D2'), [-4, 1.6, 2]));
  // janela
  cena.add(caixa(1.3, 0.9, 0.06, mat('#9ED8FF', { brilho: true, emissivo: '#5C8FB0' }), [2.6, 2.05, -0.88]));
  cena.add(caixa(1.42, 0.08, 0.1, mat('#FFFFFF'), [2.6, 2.54, -0.86]), caixa(1.42, 0.08, 0.1, mat('#FFFFFF'), [2.6, 1.56, -0.86]));
  // bancadas laterais
  const madeira = mat('#B98A5C'), tampo = mat('#3D434C');
  for (const x of [-2.2, 2.2]) {
    cena.add(caixa(2.2, 0.86, 0.6, madeira, [x, 0.43, -0.6]));
    cena.add(caixa(2.24, 0.06, 0.64, tampo, [x, 0.89, -0.6]));
    for (const dx of [-0.55, 0.55]) cena.add(caixa(0.95, 0.7, 0.02, mat('#C99B6D'), [x + dx, 0.45, -0.29]), caixa(0.12, 0.03, 0.03, mat('#9AA3AE', { metal: true }), [x + dx, 0.65, -0.27]));
    cena.add(caixa(2.2, 0.7, 0.35, madeira, [x, 2.45, -0.75]));
  }
  // vaso de planta e chaleira
  cena.add(cilindro(0.12, 0.2, mat('#C0643D'), [-3, 1.02, -0.6], 8));
  const folha = malha(new THREE.IcosahedronGeometry(0.2, 0), mat('#4CAF50'));
  folha.position.set(-3, 1.28, -0.6);
  cena.add(folha);
  cena.add(cilindro(0.13, 0.22, mat('#E8322B'), [1.6, 1.03, -0.6], 10));
  // luz quente da cozinha
  const luz = new THREE.PointLight('#FFE6B8', 5, 8, 1.6);
  luz.position.set(0, 2.8, 1.2);
  cena.add(luz);
  ctx.hemi.intensity = 1.05;
  ctx.sol.intensity = 1.7;
  ctx.sol.position.set(4, 8, 6);
  return { madeira, tampo };
}
