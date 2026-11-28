// Teste visual do personagem de desenho (personagem-toon.js): não é um vídeo para postar.
// node estudio3d/render3d.js teste-toon --previa --sem-voz
import * as THREE from 'three';
import { mat, caixa } from '../mundo.js';
import { criarPersonagemToon } from '../personagem-toon.js';

export const config = { musica: false };

export function criar(ctx) {
  const { cena, hemi, sol } = ctx;
  cena.background.set('#7FD3FF');
  hemi.intensity = 1.6;
  sol.intensity = 2.2;
  cena.add(caixa(30, 0.1, 30, mat('#8BD45A'), [0, -0.05, 0]));
  const voce = criarPersonagemToon();
  const mae = criarPersonagemToon({ estilo: 'mae', cores: { roupa: '#9B59D0', roupaDet: '#E84393', calca: '#2C3E8F', cabelo: '#6B3A1F', tenis: '#E84393' } });
  voce.position.set(-0.45, 0, 0); voce.rotation.y = 0.2;
  mae.position.set(0.45, 0, 0); mae.rotation.y = -0.2;
  cena.add(voce, mae);
  // fila de expressões/poses
  const fila = [['cima', 'feliz'], ['cabeca', 'surpreso'], ['aponta', 'bravo'], ['aceno', 'sorriso']].map(([bracos, expr], i) => {
    const p = criarPersonagemToon();
    p.position.set(-1.65 + i * 1.1, 0, -6);
    p.estado = { bracos, expr };
    cena.add(p);
    return p;
  });
  return {
    blocos: [
      { fala: 'a', semLegenda: true, camera: { pos: [0, 1.2, 4.2], alvo: [0, 0.95, 0] }, aplicar() { voce.estado = { bracos: 'aceno', expr: 'feliz' }; mae.estado = { bracos: 'normal', expr: 'sorriso' }; } },
      { fala: 'b', semLegenda: true, corteSeco: true, camera: { pos: [-0.38, 1.45, 1.6], alvo: [-0.45, 1.35, 0] }, aplicar() { voce.estado = { bracos: 'cabeca', expr: 'surpreso' }; } },
      { fala: 'c', semLegenda: true, corteSeco: true, camera: { pos: [0, 1.0, -0.8], alvo: [0, 0.9, -6] }, aplicar() {} },
    ],
    inicial() {},
    sempre(t) { voce.animar(t); mae.animar(t); fila.forEach((p) => p.animar(t)); },
  };
}
