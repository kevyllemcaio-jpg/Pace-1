// (1) A Terra apaga quando a última luz chega (C3: "escuridão") e acende quando o Sol volta (D1).
//     No estilo "vivo" o lado da noite ainda sai claro, então uma esfera escura cobre a Terra.
// (2) O personagem (de frente, feliz) aparece em pé na Terra quando a fala diz "E você" (Q1).
//     Feito em 3D com formas simples: cabeça branca, olhos grandes, braços e pernas pretos,
//     luvas e tênis brancos, blusão amarelo e calça azul.
export function montar({ THREE, scene, OBJ, tempo, posDe, registrar }) {
  const a0 = tempo('C3:escuridao'), a1 = a0 + 0.5, b0 = tempo('D1+0.1'), b1 = b0 + 0.4;
  const v0 = tempo('Q1.1');
  const suave = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
  const terra = OBJ.terra;

  // ---- escuridão da Terra
  const mat = new THREE.MeshBasicMaterial({ color: 0x02040c, transparent: true, opacity: 0, depthWrite: false });
  const sombra = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 40), mat);
  sombra.renderOrder = -5; sombra.visible = false; scene.add(sombra);

  // ---- personagem
  const C = (c) => new THREE.MeshBasicMaterial({ color: c });
  const branco = C(0xffffff), preto = C(0x0a0a0a), amarelo = C(0xffd21f), azul = C(0x2b4c7e), vermelho = C(0xe0393e);
  const g = new THREE.Group();
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); mesh.scale.set(sx, sy, sz); g.add(mesh); return mesh;
  };
  const S = 2.2;                                  // fora de escala de propósito: o personagem tem que ser visto na tela
  // cabeça e rosto (olhando para +z)
  add(new THREE.SphereGeometry(0.2, 40, 28), branco, 0, 0.92, 0);
  add(new THREE.SphereGeometry(0.058, 24, 18), preto, -0.075, 0.95, 0.165);
  add(new THREE.SphereGeometry(0.058, 24, 18), preto,  0.075, 0.95, 0.165);
  add(new THREE.SphereGeometry(0.02, 12, 10), branco, -0.064, 0.965, 0.2);
  add(new THREE.SphereGeometry(0.02, 12, 10), branco,  0.086, 0.965, 0.2);
  add(new THREE.TorusGeometry(0.06, 0.016, 10, 24, Math.PI), vermelho, 0, 0.87, 0.18, 0, 0, Math.PI); // sorriso
  add(new THREE.BoxGeometry(0.08, 0.012, 0.02), preto, -0.075, 1.04, 0.18, 0, 0, 0.25);
  add(new THREE.BoxGeometry(0.08, 0.012, 0.02), preto,  0.075, 1.04, 0.18, 0, 0, -0.25);
  // pescoço e corpo: blusão amarelo e calça azul
  add(new THREE.CylinderGeometry(0.035, 0.035, 0.08, 14), preto, 0, 0.72, 0);
  add(new THREE.CylinderGeometry(0.17, 0.14, 0.3, 24), amarelo, 0, 0.6, 0);
  add(new THREE.CylinderGeometry(0.14, 0.13, 0.14, 24), azul, 0, 0.36, 0);
  // braços pretos (caem um pouco para fora) e luvas brancas
  for (const s of [-1, 1]) {
    add(new THREE.CylinderGeometry(0.024, 0.024, 0.3, 10), preto, s * 0.22, 0.58, 0, 0, 0, s * 0.35);
    add(new THREE.SphereGeometry(0.06, 16, 12), branco, s * 0.29, 0.42, 0.02);
    // pernas pretas e tênis brancos
    add(new THREE.CylinderGeometry(0.026, 0.026, 0.34, 10), preto, s * 0.07, 0.19, 0, 0, 0, s * -0.06);
    add(new THREE.SphereGeometry(0.1, 20, 14), branco, s * 0.09, 0.05, 0.04, 0, 0, 0, 1.2, 0.5, 1.6);
  }
  g.visible = false; g.scale.setScalar(S); scene.add(g);

  const up = new THREE.Vector3(), dir = new THREE.Vector3(), P = new THREE.Vector3();
  const xa = new THREE.Vector3(), za = new THREE.Vector3(), m4 = new THREE.Matrix4();

  return {
    desenhar(t, { camera }) {
      // escuridão da Terra
      const n = suave((t - a0) / (a1 - a0)) * (1 - suave((t - b0) / (b1 - b0)));
      sombra.visible = n > 0.001 && terra.grupo.visible;
      if (sombra.visible) { sombra.position.copy(terra.grupo.position); sombra.scale.setScalar((terra.raio || 1.6) * 1.02); mat.opacity = 0.84 * n; }

      // personagem: em pé na Terra, no ponto da superfície voltado para a câmera
      const k = suave((t - v0) / 0.35);
      g.visible = k > 0.001;
      if (!g.visible) return;
      P.copy(posDe('terra', t));
      dir.copy(camera.position).sub(P).normalize();
      // de frente para a câmera, ele se perderia no disco da Terra: fica na borda de cima, em pé
      // no alto da Terra, em pé: a cabeça aponta para cima na tela
      const dirla = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      const nrm = dir.clone().multiplyScalar(0.35).addScaledVector(dirla, 0.94).normalize();
      const R = (terra.raio || 1.6);
      const base = P.clone().addScaledVector(nrm, R);      // ponto da superfície, na borda
      up.copy(nrm);
      za.copy(camera.position).sub(base); za.addScaledVector(up, -za.dot(up)).normalize();
      xa.crossVectors(up, za).normalize();
      m4.makeBasis(xa, up, za);
      g.quaternion.setFromRotationMatrix(m4);
      g.position.copy(base);
      g.scale.setScalar(S * (0.35 + 0.65 * k));           // aparece crescendo
      registrar('voce', base.clone().addScaledVector(up, 0.6), 0.6, true);
    },
  };
}
