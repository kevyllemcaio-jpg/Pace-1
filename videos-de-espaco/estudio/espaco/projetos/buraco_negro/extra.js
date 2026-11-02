// A Terra apaga quando a última luz chega (C3: "escuridão") e acende quando o Sol volta (D1).
// No estilo "vivo" o lado da noite ainda é claro, então uma esfera escura cobre a Terra (sem gravar profundidade).
export function montar({ THREE, scene, OBJ, tempo }) {
  const a0 = tempo('C3:escuridao'), a1 = a0 + 0.5, b0 = tempo('D1+0.1'), b1 = b0 + 0.4;
  const suave = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
  const terra = OBJ.terra;
  const mat = new THREE.MeshBasicMaterial({ color: 0x02040c, transparent: true, opacity: 0, depthWrite: false });
  const sombra = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 40), mat);
  sombra.renderOrder = -5; sombra.visible = false; scene.add(sombra);
  return {
    desenhar(t) {
      const n = suave((t - a0) / (a1 - a0)) * (1 - suave((t - b0) / (b1 - b0)));
      sombra.visible = n > 0.001 && terra.grupo.visible;
      if (!sombra.visible) return;
      sombra.position.copy(terra.grupo.position);
      sombra.scale.setScalar((terra.raio || 1.6) * 1.02);
      mat.opacity = 0.84 * n;
    },
  };
}
