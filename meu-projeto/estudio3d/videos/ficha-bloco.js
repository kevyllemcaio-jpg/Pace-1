// Ficha de referência de um personagem em blocos: fundo neutro, corpo inteiro, frente / 3/4 / expressões.
// Gera PNG: node estudio3d/render3d.js ficha-bloco --previa --sem-voz
import * as THREE from 'three';
import { criarAvatarBloco } from '../personagem-bloco.js';
import { ZECA } from '../personagens-bloco.js';

export const config = { semLegenda: true, musica: false };
const P = ZECA;

export function criar(ctx) {
  const { cena, camera } = ctx;
  camera.fov = 30; camera.updateProjectionMatrix();
  ctx.renderer.toneMapping = THREE.ACESFilmicToneMapping; ctx.renderer.toneMappingExposure = 1.15;
  ctx.sol.shadow.mapSize.set(2048, 2048);
  const c = document.createElement('canvas'); c.width = 4; c.height = 512; const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#EEF1F6'); gr.addColorStop(1, '#C9CFDA'); g.fillStyle = gr; g.fillRect(0, 0, 4, 512);
  const fundo = new THREE.CanvasTexture(c); fundo.colorSpace = THREE.SRGBColorSpace;
  const chao = new THREE.Mesh(new THREE.CircleGeometry(2.2, 64), new THREE.MeshStandardMaterial({ color: '#D9DEE7', roughness: 0.8 })); chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; cena.add(chao);
  const av = criarAvatarBloco(P); cena.add(av);
  const preenche = new THREE.DirectionalLight('#DDE8FF', 1.2); preenche.position.set(-4, 3, 3); cena.add(preenche);
  const contra = new THREE.DirectionalLight('#FFFFFF', 1.6); contra.position.set(0, 4, -5); cena.add(contra);
  const inicial = () => { av.rotation.set(0, 0, 0); av.estado = { bracos: 'normal', expr: 'feliz' }; };
  const sempre = () => {
    cena.background = fundo; cena.fog = null;
    ctx.hemi.color.set('#FFFFFF'); ctx.hemi.groundColor.set('#8A93A6'); ctx.hemi.intensity = 1.3;
    ctx.sol.color.set('#FFF6EA'); ctx.sol.intensity = 2.4; ctx.sol.position.set(3, 6, 5); ctx.sol.target.position.set(0, 0.9, 0);
    if (!ctx.sol.target.parent) cena.add(ctx.sol.target);
    av.animar(1);
  };
  const nome = (txt, sub) => `<div style="position:absolute;left:0;right:0;top:70px;text-align:center;font-family:Inter,sans-serif;font-weight:900;color:#1D2330"><div style="font-size:64px">${txt}</div><div style="font-size:26px;color:#5A6478;margin-top:4px">${sub}</div></div>`;
  const blocos = [
    { dur: 2, camera: { pos: [0, 1.05, 5.6], alvo: [0, 0.95, 0] }, aplicar() { av.rotation.y = 0; av.estado = { bracos: 'normal', expr: 'feliz' }; }, camada: () => nome(P.nome.toUpperCase(), 'FRENTE') },
    { dur: 2, camera: { pos: [0, 1.05, 5.6], alvo: [0, 0.95, 0] }, aplicar() { av.rotation.y = -0.65; av.estado = { bracos: 'aceno', expr: 'feliz' }; }, camada: () => nome(P.nome.toUpperCase(), '3/4 · ACENANDO') },
    { dur: 2, camera: { pos: [0, 1.05, 5.6], alvo: [0, 0.95, 0] }, aplicar() { av.rotation.y = Math.PI; av.estado = { bracos: 'normal', expr: 'feliz' }; }, camada: () => nome(P.nome.toUpperCase(), 'COSTAS') },
    ...['feliz', 'surpreso', 'bravo', 'medo'].map((ex) => ({ dur: 2, camera: { pos: [0, 1.62, 1.9], alvo: [0, 1.6, 0] }, aplicar() { av.rotation.y = 0; av.estado = { bracos: ex === 'medo' ? 'cabeca' : ex === 'bravo' ? 'normal' : ex === 'surpreso' ? 'abre' : 'cima', expr: ex }; }, camada: () => nome(ex.toUpperCase(), 'EXPRESSÃO') })),
  ];
  blocos.forEach((b) => (b.corteSeco = true));
  return { blocos, inicial, sempre };
}
