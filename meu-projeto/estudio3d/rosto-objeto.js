// Rosto para OBJETOS FALANTES (geladeira, micro-ondas, ...): olhos grandes, sobrancelhas e boca
// que mexe quando o objeto fala. O rosto olha para +z; cole na frente do objeto.
//
// const r = criarRosto({ escala: 1 });  porta.add(r);  r.position.set(x, y, zFrente + 0.01);
// r.estado = { expr: 'feliz'|'bravo'|'chocado'|'sorriso'|'tedio'|'triste', falando: bool, olhar: [x, y] }
// r.animar(t)   // a cada quadro
import * as THREE from 'three';
import { mat, caixa } from './mundo.js';

export function criarRosto({ escala = 1 } = {}) {
  const r = new THREE.Group();
  const branco = mat('#FFFFFF', { unico: true }), preto = mat('#1A1A1A', { unico: true });
  const olhos = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(s * 0.11, 0.08, 0);
    const bola = caixa(0.15, 0.17, 0.02, branco, [0, 0, 0], { sombra: false });
    g.add(caixa(0.19, 0.21, 0.015, preto, [0, 0, -0.008], { sombra: false })); // contorno preto (lê bem em objeto branco)
    const pupila = caixa(0.07, 0.08, 0.02, preto, [0, -0.01, 0.012], { sombra: false });
    const palpebra = caixa(0.16, 0.09, 0.025, mat('#000000', { unico: true, opacidade: 0 }), [0, 0.06, 0.02], { sombra: false });
    g.add(bola, pupila, palpebra);
    r.add(g);
    return { g, pupila, palpebra, bola };
  });
  const sobr = [-1, 1].map((s) => { const o = caixa(0.15, 0.03, 0.02, preto, [s * 0.11, 0.2, 0.01], { sombra: false }); r.add(o); return o; });
  const boca = caixa(0.16, 0.04, 0.02, mat('#5A1A1A'), [0, -0.12, 0.005], { sombra: false });
  const lingua = caixa(0.09, 0.03, 0.02, mat('#E26A6A'), [0, -0.135, 0.012], { sombra: false });
  r.add(boca, lingua);
  r.scale.setScalar(escala);
  r.estado = { expr: 'feliz', falando: false, olhar: [0, 0] };

  r.animar = (t) => {
    const e = r.estado, ex = e.expr;
    const [ox, oy] = e.olhar || [0, 0];
    olhos.forEach((o, i) => {
      o.pupila.position.x = ox * 0.035;
      o.pupila.position.y = -0.01 + oy * 0.04;
      const piscar = Math.sin(t * 1.1 + i * 0.02) > 0.985;
      o.g.scale.y = piscar ? 0.12 : ex === 'chocado' ? 1.25 : 1;
      // pálpebra meio fechada no tédio
      o.palpebra.material.color.set('#B8C4CC');
      o.palpebra.material.opacity = ex === 'tedio' ? 1 : 0;
    });
    sobr.forEach((o, i) => {
      const s = i === 0 ? -1 : 1;
      o.position.y = ex === 'chocado' ? 0.25 : ex === 'tedio' ? 0.17 : 0.2;
      o.rotation.z = ex === 'bravo' ? s * 0.4 : ex === 'triste' ? s * -0.35 : 0;
    });
    let bw = 1, bh = 1;
    if (ex === 'feliz') { bw = 1.2; bh = 1.8; }
    else if (ex === 'chocado') { bw = 0.6; bh = 3; }
    else if (ex === 'sorriso') { bw = 1.4; bh = 0.8; }
    else if (ex === 'triste') { bw = 0.8; bh = 0.7; }
    else if (ex === 'tedio') { bw = 0.9; bh = 0.5; }
    if (e.falando) { bw = 1.05; bh = 1.2 + 2.6 * Math.abs(Math.sin(t * 16)); }
    boca.scale.set(bw, bh, 1);
    lingua.visible = bh > 1.6;
    lingua.position.y = -0.12 - 0.02 * bh * 0.5;
  };
  r.animar(0);
  return r;
}
