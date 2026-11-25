// Identidade do canal com o mascote ZECA (avatar em blocos):
//  - vertical  -> FOTO DE PERFIL (recortada em quadrado 800x800, tudo no centro por causa do círculo)
//  - --horizontal --2k -> BANNER 2560x1440 (texto e personagem dentro da área segura 1546x423 do centro)
// Gerar: node estudio3d/render3d.js marca-canal --previa --sem-voz --2k [--horizontal]
import * as THREE from 'three';
import { HORIZONTAL } from '../motor.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { criarAvatarBloco } from '../personagem-bloco.js';
import { ZECA } from '../personagens-bloco.js';

export const config = { semLegenda: true, musica: false };
const NOME = 'E SE...?';
const SUB = 'Histórias animadas que você nunca imaginou';

function gradiente(cores, w = 4, h = 512) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, h); cores.forEach(([o, cor]) => gr.addColorStop(o, cor)); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function blocoPergunta(cor = '#FFC21A', s = 1) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  g.fillStyle = cor; g.fillRect(0, 0, 256, 256); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, 200, 256, 56);
  g.font = '900 190px Inter, sans-serif'; g.textAlign = 'center'; g.lineWidth = 18; g.strokeStyle = '#3A2600'; g.strokeText('?', 128, 196); g.fillStyle = '#fff'; g.fillText('?', 128, 196);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 4, 0.12), new THREE.MeshStandardMaterial({ map: t, roughness: 0.45 }));
  m.scale.setScalar(s); m.castShadow = true; return m;
}
function nuvem(cena, pos, s) {
  const g = new THREE.Group(); const mat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.9 });
  [[0, 0, 1], [0.9, -0.1, 0.8], [-0.9, -0.15, 0.75], [0.35, 0.45, 0.7]].forEach(([x, y, r]) => { const m = new THREE.Mesh(new RoundedBoxGeometry(r * 1.6, r * 1.2, r * 1.2, 4, r * 0.4), mat); m.position.set(x, y, 0); g.add(m); });
  g.position.set(...pos); g.scale.setScalar(s); cena.add(g); return g;
}

export function criar(ctx) {
  const { cena, camera } = ctx;
  ctx.renderer.toneMapping = THREE.ACESFilmicToneMapping; ctx.renderer.toneMappingExposure = 1.1;
  ctx.sol.shadow.mapSize.set(2048, 2048);
  const zeca = criarAvatarBloco(ZECA); cena.add(zeca);
  const preenche = new THREE.DirectionalLight('#CFE2FF', 1.1); preenche.position.set(-5, 3, 4); cena.add(preenche);
  const contra = new THREE.DirectionalLight('#FFE7B0', 2.2); contra.position.set(2, 5, -6); cena.add(contra);
  const fundo = HORIZONTAL ? gradiente([[0, '#2E6FF2'], [0.55, '#59B7FF'], [1, '#B8F0FF']]) : gradiente([[0, '#2F7BFF'], [1, '#6FD3FF']]);
  const blocos3d = [];
  if (HORIZONTAL) {
    // chão de plataformas e blocos "?" flutuando
    const chao = new THREE.Mesh(new RoundedBoxGeometry(5, 0.6, 3, 4, 0.12), new THREE.MeshStandardMaterial({ color: '#5BD15B', roughness: 0.6 })); chao.position.set(-1.9, -0.3, 0); chao.receiveShadow = true; cena.add(chao);
    const terra = new THREE.Mesh(new RoundedBoxGeometry(5, 1.4, 3, 4, 0.12), new THREE.MeshStandardMaterial({ color: '#B97A45', roughness: 0.8 })); terra.position.set(-1.9, -1.2, 0); cena.add(terra);
    [[-6.5, 2.2, -3, '#FFC21A', 1.0], [6.4, 2.6, -3, '#FF5A8A', 1.1], [4.2, -0.6, -1.5, '#7CF29A', 0.8], [-9.5, -0.4, -4, '#B07CFF', 1.2], [9.4, 0.4, -4, '#FFC21A', 1.3], [-4.2, 3.4, -5, '#7FE0FF', 0.7]].forEach(([x, y, z, cor, s], i) => { const b = blocoPergunta(cor, s); b.position.set(x, y, z); b.rotation.set(0.3 * i, 0.5 + i, 0.15); cena.add(b); blocos3d.push(b); });
    [[-11, 4.5, -10, 1.6], [11, 5, -12, 2], [0, 6.2, -14, 1.4], [-2, -3.5, -12, 1.8], [7, -3.2, -9, 1.5]].forEach(([x, y, z, s]) => nuvem(cena, [x, y, z], s));
    zeca.position.set(-2.3, 0, 0.3); zeca.rotation.y = 0.35;
    camera.fov = 28; camera.updateProjectionMatrix();
  } else {
    [[-1.1, 2.4, -1.5, '#FFC21A', 0.45], [1.15, 2.2, -1.3, '#FF5A8A', 0.4], [1.0, 1.15, -1.8, '#7CF29A', 0.35]].forEach(([x, y, z, cor, s], i) => { const b = blocoPergunta(cor, s); b.position.set(x, y, z); b.rotation.set(0.3, 0.6 + i, 0.2); cena.add(b); blocos3d.push(b); });
    camera.fov = 30; camera.updateProjectionMatrix();
  }
  const inicial = () => { zeca.estado = HORIZONTAL ? { bracos: 'aceno', expr: 'feliz' } : { bracos: 'normal', expr: 'feliz', inclina: 0.06 }; };
  const sempre = () => {
    cena.background = fundo; cena.fog = null;
    ctx.hemi.color.set('#FFFFFF'); ctx.hemi.groundColor.set('#7A8AA8'); ctx.hemi.intensity = 1.25;
    ctx.sol.color.set('#FFF4E2'); ctx.sol.intensity = 2.6; ctx.sol.position.set(4, 7, 6); ctx.sol.target.position.set(0, 1, 0);
    if (!ctx.sol.target.parent) cena.add(ctx.sol.target);
    zeca.animar(0.55);
  };
  const texto = HORIZONTAL
    ? () => `<div style="position:absolute;left:600px;top:262px;width:430px;font-family:Inter,sans-serif;font-weight:900;color:#fff">
        <div style="font-size:112px;line-height:.95;-webkit-text-stroke:16px #0E1A3A;paint-order:stroke fill;text-shadow:0 8px 0 rgba(0,0,0,.25)">E SE<span style="color:#FFD21F">...?</span></div>
        <div style="margin-top:14px;font-size:27px;line-height:1.15;background:#0E1A3A;border-radius:14px;padding:10px 16px;display:inline-block">${SUB}</div></div>`
    : () => '';
  const blocos = [{
    dur: 2,
    camera: HORIZONTAL ? { pos: [-0.6, 1.6, 12.5], alvo: [-0.6, 1.4, 0] } : { pos: [0, 1.6, 3.4], alvo: [0, 1.5, 0] },
    aplicar() {},
    camada: texto,
  }];
  return { blocos, inicial, sempre };
}
