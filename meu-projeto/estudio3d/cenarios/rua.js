// Cenário de rua/cidade low-poly: avenida ao longo de x (pista principal em z ∈ [-4, 4])
// e rua transversal ao longo de z em x ∈ [-4, 4]. Chão em y = 0.
import * as THREE from 'three';
import { mat, caixa, cilindro, malha, terreno, arvore } from '../mundo.js';

export function criarRua(ctx, { transversal = true, comprimento = 400, recuo = 11 } = {}) {
  const { cena } = ctx;
  cena.add(terreno(() => 0, (y, i, x, z) => ((Math.floor(x / 6) + Math.floor(z / 6)) % 2 ? '#6CBF47' : '#64B641'),
    { largura: 500, profundidade: 500, seg: 40, material: mat('#ffffff', { vertexColors: true }) }));
  const asfalto = mat('#3A3D44');
  cena.add(caixa(comprimento, 0.06, 8, asfalto, [0, 0.03, 0]));
  for (let x = -comprimento / 2; x < comprimento / 2; x += 6) cena.add(caixa(2.6, 0.02, 0.18, mat('#F2C14E'), [x, 0.07, 0], { sombra: false }));
  for (const z of [-5.2, 5.2]) cena.add(caixa(comprimento, 0.2, 2.4, mat('#C9CCD2'), [0, 0.1, z]));
  if (transversal) {
    cena.add(caixa(8, 0.061, 120, asfalto, [0, 0.031, 0]));
    // faixa de pedestre
    for (let i = -3; i <= 3; i++) {
      cena.add(caixa(0.5, 0.02, 3, mat('#F4F4F4'), [5.4 + 0.0, 0.075, i * 1.1 + 0.0], { sombra: false }).rotateY(Math.PI / 2));
    }
  }
  // prédios e árvores ao redor
  const cores = ['#DCEBF7', '#F6D6CF', '#FBE3B5', '#E3F2D9', '#E9E2D0'];
  for (let i = 0; i < 16; i++) {
    const x = -70 + i * 9.5 + (transversal && Math.abs(-70 + i * 9.5) < 7 ? 12 : 0);
    for (const s of [-1, 1]) {
      const h = 6 + ((i * 7 + (s > 0 ? 3 : 0)) % 5) * 3;
      const g = new THREE.Group();
      g.add(caixa(7.5, h, 7, mat(cores[(i + (s > 0 ? 2 : 0)) % 5]), [0, h / 2, 0]));
      for (let y = 1.8; y < h - 0.8; y += 2.6) for (let k = -1; k <= 1; k++) g.add(caixa(1.3, 1.2, 0.12, mat('#8FC8F0', { brilho: true, emissivo: '#000', unico: true }), [k * 2.3, y, s * -3.56]));
      g.position.set(x, 0, s * recuo);
      cena.add(g);
    }
  }
  for (let x = -60; x <= 60; x += 15) for (const s of [-1, 1]) if (!(transversal && Math.abs(x) < 7)) cena.add(arvore(x + 4, 0, s * (recuo - 3.8), 0.8, Math.abs(x) % 3));
  const solCeu = new THREE.Mesh(new THREE.IcosahedronGeometry(14, 1), mat('#FFE27A', { emissivo: '#FFB800', semNeblina: true }));
  solCeu.position.set(80, 140, -260);
  cena.add(solCeu);
  return { solCeu };
}

/** Semáforo de 3 luzes. .definir('verde'|'amarelo'|'vermelho'|null). Cabeça olha para +x por padrão. */
export function semaforo(altura = 4.2) {
  const g = new THREE.Group();
  g.add(cilindro(0.09, altura, mat('#2A2D33'), [0, altura / 2, 0], 8));
  const cab = new THREE.Group();
  cab.position.set(0, altura - 0.2, 0);
  cab.add(caixa(0.32, 1.0, 0.36, mat('#1E1E22'), [0.05, -0.35, 0]));
  const cores = { vermelho: '#FF3A2A', amarelo: '#FFC21A', verde: '#2DE060' };
  const luzes = {};
  ['vermelho', 'amarelo', 'verde'].forEach((n, i) => {
    const m = malha(new THREE.CylinderGeometry(0.11, 0.11, 0.04, 14), mat(cores[n], { unico: true, emissivo: '#000', semNeblina: true }), { sombra: false });
    m.rotation.z = Math.PI / 2;
    m.position.set(0.23, -0.05 - i * 0.3, 0);
    cab.add(m);
    luzes[n] = m;
  });
  g.add(cab);
  g.definir = (ativa) => {
    for (const [n, m] of Object.entries(luzes)) {
      m.material.emissive.set(n === ativa ? cores[n] : '#000000');
      m.material.color.set(n === ativa ? cores[n] : '#333333');
    }
  };
  g.definir('vermelho');
  return g;
}
