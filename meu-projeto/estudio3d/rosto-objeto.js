// Rosto de DESENHO para OBJETOS FALANTES (geladeira, micro-ondas, ...): olhos ovais grandes com
// contorno e brilho, sobrancelhas, boca que abre quando o objeto fala. Mesmo estilo do personagem-toon.
// O rosto olha para +z; cole na frente do objeto.
//
// const r = criarRosto({ escala: 1 });  porta.add(r);  r.position.set(x, y, zFrente + 0.01);
// r.estado = { expr: 'feliz'|'bravo'|'chocado'|'sorriso'|'tedio'|'triste', falando: bool, olhar: [x, y] }
// r.animar(t)   // a cada quadro
import * as THREE from 'three';

const basico = (cor) => new THREE.MeshBasicMaterial({ color: cor });
const oval = (r, cor, [sx, sy, sz], pos = [0, 0, 0]) => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 18), basico(cor));
  m.scale.set(sx, sy, sz);
  m.position.set(...pos);
  return m;
};

export function criarRosto({ escala = 1 } = {}) {
  const r = new THREE.Group();
  const olhos = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(s * 0.12, 0.08, 0);
    const contorno = oval(0.1, '#141414', [0.85, 1.05, 0.2]);
    const branco = oval(0.088, '#FFFFFF', [0.85, 1.05, 0.2], [0, 0, 0.006]);
    const olhar = new THREE.Group();
    olhar.add(oval(0.042, '#141414', [0.9, 1.1, 0.2], [0, 0, 0.016]), oval(0.014, '#FFFFFF', [1, 1, 0.3], [0.014, 0.02, 0.022]));
    // pálpebra (cor do objeto é desconhecida: usa um cinza-claro que some quando aberta)
    const palpebra = oval(0.095, '#B8C4CC', [0.88, 0.55, 0.2], [0, 0.05, 0.026]);
    g.add(contorno, branco, olhar, palpebra);
    r.add(g);
    return { g, olhar, palpebra };
  });
  const sobr = [-1, 1].map((s) => {
    const o = new THREE.Mesh(new THREE.CapsuleGeometry(0.016, 0.1, 4, 10), basico('#141414'));
    o.position.set(s * 0.12, 0.22, 0.01);
    r.add(o);
    return o;
  });
  const boca = new THREE.Group();
  boca.position.set(0, -0.13, 0.008);
  const bocaM = oval(0.075, '#7A1F2B', [1, 0.35, 0.15]);
  const contornoB = oval(0.085, '#141414', [1, 0.4, 0.12], [0, 0, -0.004]);
  const lingua = oval(0.04, '#FF7A8A', [1, 0.5, 0.15], [0, -0.02, 0.006]);
  boca.add(contornoB, bocaM, lingua);
  r.add(boca);
  r.scale.setScalar(escala);
  r.estado = { expr: 'feliz', falando: false, olhar: [0, 0] };

  r.animar = (t) => {
    const e = r.estado, ex = e.expr;
    const [ox, oy] = e.olhar || [0, 0];
    olhos.forEach((o, i) => {
      o.olhar.position.set(ox * 0.03, oy * 0.035, 0);
      const piscar = Math.sin(t * 1.1 + i * 0.02) > 0.985;
      o.g.scale.y = piscar ? 0.12 : ex === 'chocado' ? 1.25 : 1;
      o.g.scale.x = ex === 'chocado' ? 1.1 : 1;
      o.palpebra.visible = ex === 'tedio';
    });
    sobr.forEach((o, i) => {
      const s = i === 0 ? -1 : 1;
      o.position.y = ex === 'chocado' ? 0.27 : ex === 'tedio' ? 0.19 : 0.22;
      o.rotation.z = Math.PI / 2 + (ex === 'bravo' ? s * 0.45 : ex === 'triste' ? s * -0.35 : 0);
    });
    let bw = 1, bh = 1;
    if (ex === 'feliz') { bw = 1.2; bh = 2.2; }
    else if (ex === 'chocado') { bw = 0.6; bh = 3.2; }
    else if (ex === 'sorriso') { bw = 1.4; bh = 1.0; }
    else if (ex === 'triste') { bw = 0.8; bh = 0.6; }
    else if (ex === 'tedio') { bw = 0.9; bh = 0.5; }
    else if (ex === 'bravo') { bw = 0.95; bh = 0.7; }
    if (e.falando) { bw = 1.05; bh = 1.0 + 2.6 * Math.abs(Math.sin(t * 16)); }
    boca.scale.set(bw, bh, 1);
    lingua.visible = bh > 1.6;
  };
  r.animar(0);
  return r;
}
