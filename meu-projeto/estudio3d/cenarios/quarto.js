// Cenário de quarto low-poly (formato "N dias de…", ver PADRAO-DIAS.md).
// Chão em y = 0, parede do fundo em z = -1.55. Escrivaninha com computador à esquerda,
// cama à direita, e no centro da parede uma JANELA (dia/noite) ou um MURAL.
// Personagem fica em torno de (0.28, 0, -0.35).
//
// const q = criarQuarto(ctx, { janela: true });
//   q.luz(k)          0 = breu, 1 = quarto aceso (chamar a cada quadro)
//   q.ceu(k)          janela: 0 = noite (lua), 1 = dia (sol)
//   q.tela(k)         brilho do monitor (0..1)
//   q.ondular(t, a)   paredes "se mexendo" (alucinação), a = intensidade
//   q.CAMA            posição do colchão [x, y, z]
import * as THREE from 'three';
import { mat, caixa, cilindro, malha } from '../mundo.js';

export function criarQuarto(ctx, { janela = true } = {}) {
  const { cena, hemi, sol } = ctx;
  cena.add(caixa(7, 0.04, 5, mat('#5E4330'), [0, -0.02, 0.6], { sombra: false }));
  for (let x = -3.2; x < 3.4; x += 0.4) cena.add(caixa(0.02, 0.005, 5, mat('#4A3424'), [x, 0.002, 0.6], { sombra: false }));
  cena.add(caixa(7, 3.4, 0.1, mat('#3A4668'), [0, 1.7, -1.55]));
  const listras = [];
  for (let x = -3.2; x < 3.4; x += 0.5) {
    const l = caixa(0.06, 3.4, 0.02, mat('#33405F'), [x, 1.7, -1.49], { sombra: false });
    l.userData.x = x;
    cena.add(l);
    listras.push(l);
  }
  cena.add(caixa(7, 0.12, 0.04, mat('#2A3350'), [0, 0.06, -1.48]));

  // escrivaninha + computador
  const madeira = mat('#8B6B4A');
  const DX = -0.62;
  cena.add(caixa(0.9, 0.05, 0.55, madeira, [DX, 0.76, -1.15]));
  for (const [x, z] of [[-0.4, -0.24], [0.4, -0.24], [-0.4, 0.24], [0.4, 0.24]]) cena.add(caixa(0.05, 0.74, 0.05, madeira, [DX + x, 0.37, -1.15 + z]));
  cena.add(caixa(0.62, 0.4, 0.04, mat('#17181C'), [DX, 1.13, -1.3]));
  cena.add(caixa(0.06, 0.14, 0.06, mat('#17181C'), [DX, 0.85, -1.3]), caixa(0.24, 0.02, 0.14, mat('#17181C'), [DX, 0.79, -1.3]));
  const telaM = caixa(0.56, 0.34, 0.01, mat('#2E8BFF', { unico: true, emissivo: '#2E8BFF' }), [DX, 1.13, -1.275], { sombra: false });
  cena.add(telaM);
  cena.add(caixa(0.36, 0.015, 0.12, mat('#2A2B30'), [DX, 0.79, -1.0]));
  // caneca de café
  cena.add(cilindro(0.045, 0.1, mat('#F3F3F3'), [DX + 0.33, 0.83, -1.0], 10));
  const luzTela = new THREE.PointLight('#5AA8FF', 3, 3.2, 1.4);
  luzTela.position.set(DX, 1.15, -0.95);
  cena.add(luzTela);
  // cadeira
  cena.add(caixa(0.42, 0.06, 0.42, mat('#C0392B'), [DX, 0.46, -0.62]), caixa(0.42, 0.5, 0.06, mat('#C0392B'), [DX, 0.74, -0.42]));
  cena.add(cilindro(0.03, 0.42, mat('#2A2B30'), [DX, 0.22, -0.62], 6));
  // cama
  cena.add(caixa(1.1, 0.42, 1.9, mat('#2F5D9E'), [1.55, 0.21, -0.55]), caixa(0.5, 0.12, 0.3, mat('#F3F3F3'), [1.55, 0.48, -1.3]));
  // luz do teto
  const luzQuarto = new THREE.PointLight('#FFE2B0', 0, 9, 1.3);
  luzQuarto.position.set(0, 3.0, 1.0);
  cena.add(luzQuarto);

  // janela no centro da parede (céu de dia / de noite)
  let vidro = null, astro = null;
  if (janela) {
    cena.add(caixa(1.3, 0.95, 0.05, mat('#EDEDED'), [0.15, 2.38, -1.49]));
    vidro = caixa(1.16, 0.81, 0.02, mat('#8CCFFF', { unico: true, emissivo: '#8CCFFF' }), [0.15, 2.38, -1.46], { sombra: false });
    cena.add(vidro);
    cena.add(caixa(0.04, 0.81, 0.03, mat('#EDEDED'), [0.15, 2.38, -1.44]), caixa(1.16, 0.04, 0.03, mat('#EDEDED'), [0.15, 2.38, -1.44]));
    astro = malha(new THREE.IcosahedronGeometry(0.1, 1), mat('#FFD54A', { unico: true, emissivo: '#FFD54A' }), { sombra: false });
    astro.position.set(0.45, 2.6, -1.43);
    cena.add(astro);
  }

  const escuro = new THREE.Color('#06080F'), claro = new THREE.Color('#2C3550');
  const diaC = new THREE.Color('#8CCFFF'), noiteC = new THREE.Color('#0D1530');
  const solC = new THREE.Color('#FFD54A'), luaC = new THREE.Color('#E8ECF5');
  return {
    DX,
    CAMA: [1.55, 0.44, -0.55],
    luz(k) {
      hemi.intensity = 0.06 + 1.0 * k;
      sol.intensity = 0.03 + 1.3 * k;
      sol.position.set(2, 6, 5);
      luzQuarto.intensity = 6 * k;
      cena.background.copy(escuro).lerp(claro, k);
      cena.fog.color.copy(cena.background);
    },
    ceu(k) {
      if (!vidro) return;
      vidro.material.color.copy(noiteC).lerp(diaC, k);
      vidro.material.emissive.copy(noiteC).lerp(diaC, k).multiplyScalar(0.6);
      astro.material.color.copy(luaC).lerp(solC, k);
      astro.material.emissive.copy(luaC).lerp(solC, k).multiplyScalar(0.8);
    },
    tela(k) {
      luzTela.intensity = 3.2 * k;
      telaM.material.emissiveIntensity = 0.25 + 0.9 * k;
    },
    ondular(t, a) {
      listras.forEach((l, i) => {
        l.position.x = l.userData.x + a * 0.12 * Math.sin(t * 2.2 + i * 0.9);
        l.rotation.z = a * 0.08 * Math.sin(t * 1.7 + i);
      });
    },
  };
}
