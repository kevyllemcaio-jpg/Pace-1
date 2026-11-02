// Boneco "bolinha" sem roupa: cabeça branca lisa, braços e pernas pretos grossos, luvas e tênis brancos.
import * as THREE from 'three';
import { mat, malha } from '../mundo.js';

const BRANCO = '#F5F5F5', PRETO = '#141414';

function tubo(a, b, r, cor) {
  const m = malha(new THREE.CylinderGeometry(r, r, 1, 28), mat(cor), { sombra: false });
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
  m.position.copy(A.clone().add(B).multiplyScalar(0.5));
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
  m.scale.set(1, B.distanceTo(A), 1);
  return m;
}
const esf = (r, cor, p, s = [1, 1, 1]) => {
  const m = malha(new THREE.SphereGeometry(r, 32, 24), mat(cor), { sombra: false });
  m.position.set(...p); m.scale.set(...s);
  return m;
};

export function bolinhaStick() {
  const g = new THREE.Group();
  g.add(esf(0.25, BRANCO, [0, 1.62, 0]));                                  // cabeça lisa
  g.add(esf(0.05, PRETO, [-0.09, 1.66, 0.215], [0.8, 1.1, 0.5]));          // olhos
  g.add(esf(0.05, PRETO, [0.09, 1.66, 0.215], [0.8, 1.1, 0.5]));
  g.add(tubo([0, 1.37, 0], [0, 0.85, 0], 0.045, PRETO));                    // tronco de linha
  for (const s of [-1, 1]) {
    g.add(tubo([0, 1.25, 0], [s * 0.32, 1.0, 0.05], 0.035, PRETO));         // braços
    g.add(tubo([s * 0.32, 1.0, 0.05], [s * 0.38, 0.72, 0.08], 0.032, PRETO));
    g.add(esf(0.075, BRANCO, [s * 0.39, 0.67, 0.08]));                       // luva
    g.add(tubo([0, 0.85, 0], [s * 0.12, 0.42, 0], 0.04, PRETO));            // pernas
    g.add(tubo([s * 0.12, 0.42, 0], [s * 0.14, 0.1, 0], 0.04, PRETO));
    g.add(esf(0.11, BRANCO, [s * 0.15, 0.08, 0.04], [1.0, 0.6, 1.5]));      // tênis
  }
  return g;
}
