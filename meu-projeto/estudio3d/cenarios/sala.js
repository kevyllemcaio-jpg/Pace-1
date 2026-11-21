// Sala low-poly com TV (usada nos vídeos da "mãe"). Chão em y = 0, TV na parede do fundo (z = -1.5).
// A tela da TV mostra o que uma segunda câmera vê (ex.: o mundo do jogo de blocos).
//
// const s = criarSala(ctx);
//   s.tela.material.map = renderTarget.texture   (o vídeo liga a tela)
//   s.luz(k)      0 = noite (só a TV ilumina), 1 = dia
//   s.TV          centro da tela [x, y, z]
import * as THREE from 'three';
import { mat, caixa, cilindro } from '../mundo.js';

export function criarSala(ctx) {
  const { cena, hemi, sol } = ctx;
  cena.add(caixa(8, 0.04, 6, mat('#B98A5C'), [0, -0.02, 0.8], { sombra: false }));
  for (let x = -3.8; x < 4; x += 0.35) cena.add(caixa(0.015, 0.005, 6, mat('#A57A50'), [x, 0.002, 0.8], { sombra: false }));
  cena.add(caixa(8, 3.4, 0.1, mat('#E9DCC4'), [0, 1.7, -1.6]));
  cena.add(caixa(8, 0.14, 0.04, mat('#C7B596'), [0, 0.07, -1.53]));
  cena.add(caixa(0.1, 3.4, 6, mat('#E2D3B8'), [-3, 1.7, 0.8]));
  // quadro e janela
  cena.add(caixa(0.7, 0.5, 0.03, mat('#2F5D9E'), [-1.7, 2.1, -1.53]), caixa(0.58, 0.38, 0.02, mat('#7FC4E8'), [-1.7, 2.1, -1.51]));
  const vidro = caixa(1.0, 1.0, 0.03, mat('#9ED8FF', { unico: true, emissivo: '#9ED8FF' }), [1.9, 1.9, -1.53], { sombra: false });
  cena.add(vidro, caixa(1.1, 0.06, 0.06, mat('#FFFFFF'), [1.9, 2.42, -1.5]), caixa(1.1, 0.06, 0.06, mat('#FFFFFF'), [1.9, 1.38, -1.5]), caixa(0.05, 1.0, 0.05, mat('#FFFFFF'), [1.9, 1.9, -1.5]));
  // rack + TV
  cena.add(caixa(1.9, 0.45, 0.45, mat('#5A3E2B'), [0, 0.225, -1.3]));
  cena.add(caixa(1.62, 0.95, 0.06, mat('#121316'), [0, 1.08, -1.42]));
  const tela = new THREE.Mesh(new THREE.PlaneGeometry(1.52, 0.86), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
  tela.position.set(0, 1.08, -1.385);
  cena.add(tela);
  const luzTV = new THREE.PointLight('#9FD0FF', 2.5, 4, 1.3);
  luzTV.position.set(0, 1.1, -0.9);
  cena.add(luzTV);
  // planta e luminária
  cena.add(cilindro(0.16, 0.35, mat('#C0643D'), [-1.25, 0.175, -1.25], 8));
  cena.add(caixa(0.4, 0.5, 0.4, mat('#3E9A4F'), [-1.25, 0.6, -1.25]));
  cena.add(cilindro(0.025, 1.5, mat('#2A2B30'), [1.25, 0.75, -1.2], 6), cilindro(0.18, 0.22, mat('#FFE9B0', { emissivo: '#B89A50' }), [1.25, 1.55, -1.2], 8));
  // sofá (de costas para a câmera "de trás", virado para a TV)
  const sofa = mat('#C0392B');
  cena.add(caixa(2.0, 0.42, 0.8, sofa, [0, 0.21, 1.9]), caixa(2.0, 0.6, 0.2, sofa, [0, 0.62, 2.25]));
  cena.add(caixa(0.2, 0.55, 0.8, sofa, [-1.05, 0.38, 1.9]), caixa(0.2, 0.55, 0.8, sofa, [1.05, 0.38, 1.9]));
  // tapete
  cena.add(caixa(2.6, 0.01, 1.6, mat('#3F6FB0'), [0, 0.005, 0.5], { sombra: false }));

  const diaC = new THREE.Color('#9ED8FF'), noiteC = new THREE.Color('#14203F');
  const fundoDia = new THREE.Color('#F6E7C8'), fundoNoite = new THREE.Color('#1A1F33');
  return {
    tela,
    TV: [0, 1.08, -1.385],
    luz(k) {
      hemi.intensity = 0.25 + 1.0 * k;
      sol.intensity = 0.1 + 1.6 * k;
      sol.position.set(3, 7, 6);
      vidro.material.color.copy(noiteC).lerp(diaC, k);
      vidro.material.emissive.copy(noiteC).lerp(diaC, k).multiplyScalar(0.5);
      cena.background.copy(fundoNoite).lerp(fundoDia, k);
      cena.fog.color.copy(cena.background);
    },
  };
}
