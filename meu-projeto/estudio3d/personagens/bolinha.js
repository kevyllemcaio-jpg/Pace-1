// Personagem "bolinha" (desenho do autor): cabeça branca lisa, jaqueta amarela cobrindo tronco e braços,
// calça azul cobrindo as pernas, luvas e tênis brancos. Pés em y=0.
import * as THREE from 'three';
import { mat, caixa, malha } from '../mundo.js';

const BRANCO = '#F5F5F5', PRETO = '#141414', AMARELO = '#F2B705', AZUL = '#1F4E9C';

/** Tubo liso entre dois pontos (mangas e pernas). */
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

export function bolinha() {
  const g = new THREE.Group();
  // cabeça lisa
  g.add(esf(0.25, BRANCO, [0, 1.62, 0]));
  g.add(esf(0.05, PRETO, [-0.09, 1.66, 0.215], [0.8, 1.1, 0.5]));  // olhos
  g.add(esf(0.05, PRETO, [0.09, 1.66, 0.215], [0.8, 1.1, 0.5]));
  g.add(caixa(0.1, 0.02, 0.02, mat(PRETO), [0.0, 1.5, 0.245], { sombra: false })); // boca
  // tronco: jaqueta amarela inteira
  const tronco = malha(new THREE.CylinderGeometry(0.19, 0.17, 0.5, 32), mat(AMARELO), { sombra: false });
  tronco.position.set(0, 1.07, 0);
  g.add(tronco);
  // braços: mangas amarelas até o punho, luva branca
  for (const s of [-1, 1]) {
    g.add(tubo([s * 0.19, 1.25, 0], [s * 0.36, 0.95, 0.05], 0.07, AMARELO));
    g.add(tubo([s * 0.36, 0.95, 0.05], [s * 0.4, 0.7, 0.08], 0.065, AMARELO));
    g.add(esf(0.075, BRANCO, [s * 0.41, 0.66, 0.08]));
  }
  // calça azul: quadril e pernas até o tênis
  const quadril = malha(new THREE.CylinderGeometry(0.18, 0.16, 0.2, 32), mat(AZUL), { sombra: false });
  quadril.position.set(0, 0.8, 0);
  g.add(quadril);
  for (const s of [-1, 1]) {
    g.add(tubo([s * 0.1, 0.78, 0], [s * 0.11, 0.2, 0], 0.095, AZUL));
    g.add(esf(0.11, BRANCO, [s * 0.12, 0.09, 0.04], [1.0, 0.6, 1.5]));
  }
  return g;
}
