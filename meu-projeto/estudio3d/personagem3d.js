// Personagem principal em 3D low-poly (o "você" dos vídeos).
// Jaqueta amarela sem zíper, calça preta, tênis branco com sola vermelha,
// cabelo castanho-escuro curto repartido de lado. Olha para +z; pés em y = 0.
//
// Uso:  const p = criarPersonagem();  cena.add(p);
//       p.estado = { bracos: 'normal'|'cima'|'aceno'|'cabeca'|'aponta'|'lado', expr: 'feliz'|'sorriso'|'serio'|'surpreso'|'preocupado', andar: 0..1, pulo: 0..1 }
//       p.animar(t)   // a cada quadro

import * as THREE from 'three';
import { mat, caixa } from './mundo.js';

const COR = {
  pele: '#F0C49C', roupa: '#FFC21A', roupaEscura: '#E0A000', calca: '#1D1D22',
  cabelo: '#3A2416', tenis: '#FFFFFF', sola: '#D93A3A', olho: '#1A1A1A', boca: '#7A2626', bochecha: '#F29A86',
};

export function criarPersonagem() {
  const p = new THREE.Group();
  const corpo = new THREE.Group();
  p.add(corpo);

  // Pernas (pivô no quadril) com tênis
  const pernas = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(s * 0.115, 0.92, 0);
    g.add(caixa(0.19, 0.82, 0.22, mat(COR.calca), [0, -0.41, 0]));
    g.add(caixa(0.2, 0.11, 0.33, mat(COR.tenis), [0, -0.86, 0.04]));
    g.add(caixa(0.2, 0.04, 0.33, mat(COR.sola), [0, -0.9, 0.04]));
    corpo.add(g);
    return g;
  });

  // Tronco: jaqueta lisa (sem zíper) com barra e gola
  const tronco = new THREE.Group();
  tronco.position.y = 0.9;
  tronco.add(caixa(0.54, 0.62, 0.3, mat(COR.roupa), [0, 0.32, 0]));
  tronco.add(caixa(0.55, 0.08, 0.31, mat(COR.roupaEscura), [0, 0.04, 0]));
  tronco.add(caixa(0.26, 0.06, 0.32, mat(COR.roupaEscura), [0, 0.61, 0.0]));
  corpo.add(tronco);

  // Braços (pivô no ombro). O lado direito do personagem é -x.
  const bracos = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(s * 0.345, 1.47, 0);
    g.add(caixa(0.15, 0.56, 0.17, mat(COR.roupa), [0, -0.26, 0]));
    g.add(caixa(0.13, 0.13, 0.13, mat(COR.pele), [0, -0.6, 0]));
    corpo.add(g);
    return g;
  });

  // Cabeça
  const cabeca = new THREE.Group();
  cabeca.position.y = 1.56;
  cabeca.add(caixa(0.15, 0.08, 0.15, mat(COR.pele), [0, 0.02, 0]));
  cabeca.add(caixa(0.42, 0.42, 0.38, mat(COR.pele), [0, 0.25, 0]));
  cabeca.add(caixa(0.06, 0.07, 0.05, mat(COR.pele), [0, 0.22, 0.21]));
  // orelhas
  cabeca.add(caixa(0.05, 0.1, 0.07, mat(COR.pele), [-0.225, 0.25, 0]));
  cabeca.add(caixa(0.05, 0.1, 0.07, mat(COR.pele), [0.225, 0.25, 0]));
  // cabelo: topo, nuca, laterais, franja varrida para o lado e topete
  const cab = mat(COR.cabelo);
  cabeca.add(caixa(0.45, 0.11, 0.41, cab, [0, 0.49, -0.005]));
  cabeca.add(caixa(0.45, 0.3, 0.07, cab, [0, 0.34, -0.19]));
  cabeca.add(caixa(0.04, 0.17, 0.3, cab, [-0.225, 0.37, -0.04]));
  cabeca.add(caixa(0.04, 0.17, 0.3, cab, [0.225, 0.37, -0.04]));
  const franja = caixa(0.34, 0.09, 0.07, cab, [0.04, 0.43, 0.19]);
  franja.rotation.z = -0.22;
  cabeca.add(franja);
  const topete = caixa(0.1, 0.09, 0.12, cab, [-0.06, 0.56, 0.06]);
  topete.rotation.set(0.3, 0, 0.35);
  cabeca.add(topete);

  // Rosto (frente = +z)
  const rosto = new THREE.Group();
  rosto.position.z = 0.192;
  cabeca.add(rosto);
  const olhos = [-1, 1].map((s) => {
    const o = caixa(0.055, 0.075, 0.02, mat(COR.olho), [s * 0.09, 0.28, 0], { sombra: false });
    rosto.add(o);
    return o;
  });
  const sobr = [-1, 1].map((s) => {
    const o = caixa(0.1, 0.025, 0.02, mat(COR.cabelo), [s * 0.09, 0.355, 0.002], { sombra: false });
    rosto.add(o);
    return o;
  });
  [-1, 1].forEach((s) => rosto.add(caixa(0.06, 0.03, 0.01, mat(COR.bochecha), [s * 0.14, 0.2, 0], { sombra: false })));
  const boca = caixa(0.12, 0.035, 0.02, mat(COR.boca), [0, 0.13, 0], { sombra: false });
  rosto.add(boca);
  corpo.add(cabeca);

  p.estado = { bracos: 'normal', expr: 'feliz', andar: 0, pulo: 0 };

  p.animar = (t) => {
    const e = p.estado;
    const passo = Math.sin(t * 9) * 0.55 * (e.andar || 0);
    pernas[0].rotation.x = passo;
    pernas[1].rotation.x = -passo;
    tronco.scale.y = 1 + 0.012 * Math.sin(t * 3);
    corpo.position.y = (e.pulo ? Math.abs(Math.sin(t * 7)) * 0.35 * e.pulo : 0) + Math.abs(passo) * 0.05;

    // braços: [dir, esq] — rotation.x (frente/cima) e rotation.z (para o lado)
    const [dir, esq] = bracos;
    dir.rotation.set(-passo * 0.8, 0, 0.06);
    esq.rotation.set(passo * 0.8, 0, -0.06);
    switch (e.bracos) {
      case 'cima':
        dir.rotation.set(0, 0, -2.75 + Math.sin(t * 8) * 0.12);
        esq.rotation.set(0, 0, 2.75 - Math.sin(t * 8) * 0.12);
        break;
      case 'aceno':
        dir.rotation.set(0, 0, -2.5 + Math.sin(t * 11) * 0.35);
        break;
      case 'cabeca':
        dir.rotation.set(-2.5, 0, -0.55);
        esq.rotation.set(-2.5, 0, 0.55);
        break;
      case 'aponta':
        dir.rotation.set(-1.45, 0, -0.25);
        break;
      case 'lado': // aponta para o lado direito do personagem (-x), braço esticado
        dir.rotation.set(0, 0, -1.5 + Math.sin(t * 5) * 0.06);
        break;
    }

    // expressão
    const ex = e.expr;
    olhos.forEach((o) => (o.scale.y = ex === 'surpreso' ? 1.5 : 1));
    // piscada
    if (Math.sin(t * 1.3) > 0.985) olhos.forEach((o) => (o.scale.y = 0.15));
    sobr.forEach((o, i) => {
      const s = i === 0 ? -1 : 1;
      o.position.y = ex === 'surpreso' ? 0.38 : 0.355;
      o.rotation.z = ex === 'preocupado' ? s * -0.35 : ex === 'serio' ? s * 0.25 : 0;
    });
    if (ex === 'surpreso') { boca.scale.set(0.7, 2.6, 1); }
    else if (ex === 'feliz') { boca.scale.set(1.35, 1.7, 1); }
    else if (ex === 'preocupado') { boca.scale.set(0.8, 1, 1); }
    else if (ex === 'sorriso') { boca.scale.set(1.5, 1.15, 1); }
    else boca.scale.set(1, 1, 1);
    cabeca.rotation.z = Math.sin(t * 1.7) * 0.03;
  };
  p.animar(0);
  return p;
}
