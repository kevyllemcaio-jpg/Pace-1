// Personagem "bolinha": cabeça branca redonda, braços e pernas de linha preta, luvas e tênis brancos.
// Roupa do canal: jaqueta amarela e calça azul-escura. Pés em y=0.
import * as THREE from 'three';
import { mat, caixa, malha } from '../mundo.js';

const BRANCO = '#F5F5F5', PRETO = '#141414', AMARELO = '#F2B705', AZUL = '#1F2F4D';

/** Linha grossa entre dois pontos. */
function linha(a, b, r, cor) {
  const m = malha(new THREE.CylinderGeometry(r, r, 1, 12), mat(cor), { sombra: false });
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
  m.position.copy(A.clone().add(B).multiplyScalar(0.5));
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
  m.scale.set(1, B.distanceTo(A), 1);
  return m;
}
const esf = (r, cor, p, s = [1, 1, 1]) => {
  const m = malha(new THREE.SphereGeometry(r, 28, 20), mat(cor), { sombra: false });
  m.position.set(...p); m.scale.set(...s);
  return m;
};

export function bolinha() {
  const g = new THREE.Group();
  // cabeça e rosto
  g.add(esf(0.24, BRANCO, [0, 1.62, 0]));
  g.add(esf(0.045, PRETO, [-0.085, 1.66, 0.2], [0.8, 1.1, 0.6]));  // olhos
  g.add(esf(0.045, PRETO, [0.085, 1.66, 0.2], [0.8, 1.1, 0.6]));
  g.add(caixa(0.12, 0.018, 0.02, mat(PRETO), [-0.085, 1.74, 0.21], { sombra: false })); // sobrancelhas
  g.add(caixa(0.12, 0.018, 0.02, mat(PRETO), [0.085, 1.74, 0.21], { sombra: false }));
  g.add(caixa(0.1, 0.03, 0.02, mat('#C62828'), [0, 1.5, 0.22], { sombra: false }));  // boca
  // jaqueta amarela (tronco curto) e calça azul
  g.add(caixa(0.3, 0.36, 0.16, mat(AMARELO), [0, 1.08, 0], { sombra: false }));
  g.add(caixa(0.26, 0.1, 0.16, mat(AZUL), [0, 0.86, 0], { sombra: false }));
  // braços de linha com luvas
  g.add(linha([-0.15, 1.2, 0], [-0.42, 0.98, 0.05], 0.03, PRETO));
  g.add(linha([-0.42, 0.98, 0.05], [-0.46, 0.7, 0.08], 0.03, PRETO));
  g.add(linha([0.15, 1.2, 0], [0.42, 0.98, 0.05], 0.03, PRETO));
  g.add(linha([0.42, 0.98, 0.05], [0.46, 0.7, 0.08], 0.03, PRETO));
  g.add(esf(0.06, BRANCO, [-0.46, 0.66, 0.08]));
  g.add(esf(0.06, BRANCO, [0.46, 0.66, 0.08]));
  // pernas de linha e tênis brancos
  for (const s of [-1, 1]) {
    g.add(linha([s * 0.08, 0.84, 0], [s * 0.12, 0.2, 0], 0.035, PRETO));
    g.add(esf(0.1, BRANCO, [s * 0.12, 0.1, 0.03], [1.0, 0.6, 1.5]));
  }
  return g;
}
