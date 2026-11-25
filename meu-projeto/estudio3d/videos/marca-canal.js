// Identidade do canal CAIOTYK (mascotes em blocos: ZECA e LIA).
//  - vertical  -> FOTO DE PERFIL (recorte 800x800; tudo no centro por causa do círculo)
//  - --horizontal --2k -> BANNER 2560x1440: logo + elenco dentro da área segura 1546x423 (celular);
//    laterais decoradas aparecem no PC (2560x423) e na TV (imagem inteira).
// Gerar: node estudio3d/render3d.js marca-canal --previa --sem-voz --2k [--horizontal]
import * as THREE from 'three';
import { HORIZONTAL } from '../motor.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { criarAvatarBloco } from '../personagem-bloco.js';
import { ZECA, LIA } from '../personagens-bloco.js';

export const config = { semLegenda: true, musica: false };

function blocoPergunta(cor, s = 1) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  g.fillStyle = cor; g.fillRect(0, 0, 256, 256); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(0, 0, 256, 40); g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(0, 210, 256, 46);
  g.font = '900 180px Inter, sans-serif'; g.textAlign = 'center'; g.lineWidth = 16; g.strokeStyle = 'rgba(0,0,0,.45)'; g.strokeText('?', 128, 192); g.fillStyle = '#fff'; g.fillText('?', 128, 192);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 5, 0.14), new THREE.MeshStandardMaterial({ map: t, roughness: 0.35 }));
  m.scale.setScalar(s); m.castShadow = true; return m;
}
function plataforma(cor) {
  const g = new THREE.Group();
  const topo = new THREE.Mesh(new RoundedBoxGeometry(2.6, 0.35, 2.0, 5, 0.12), new THREE.MeshStandardMaterial({ color: cor, roughness: 0.5 })); topo.receiveShadow = true; g.add(topo);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.2, 1.4, 6), new THREE.MeshStandardMaterial({ color: '#2A1E5C', roughness: 0.8 })); base.position.y = -0.85; g.add(base);
  return g;
}

// fundo (atrás do 3D): luz central, raios, bolinhas desfocadas e estrelinhas
const FUNDO_BANNER = `<div style="position:absolute;inset:0;background:radial-gradient(ellipse 55% 75% at 50% 50%,#9B7BFF 0%,#5B3FD6 35%,#2A1C82 70%,#140C45 100%)"></div>
<div style="position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 50% 52%,rgba(255,255,255,.07) 0deg 6deg,rgba(255,255,255,0) 6deg 18deg);-webkit-mask:radial-gradient(circle at 50% 52%,#000 0%,transparent 62%)"></div>
<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(255,220,140,.45) 0%,rgba(255,200,120,0) 28%)"></div>
${[[90, 160, 46, '#FF5A8A'], [210, 560, 30, '#7FE0FF'], [1180, 130, 40, '#FFD21F'], [1090, 600, 54, '#7CF29A'], [40, 420, 24, '#FFD21F'], [1250, 380, 28, '#FF5A8A'], [520, 90, 18, '#7FE0FF'], [800, 640, 22, '#FFD21F']].map(([x, y, r, c]) => `<div style="position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:${c};opacity:.35;filter:blur(${Math.round(r / 3)}px)"></div>`).join('')}
${Array.from({ length: 70 }, (_, i) => { const x = (i * 197) % 1280, y = (i * 113) % 720, s = 1 + (i % 3); return `<div style="position:absolute;left:${x}px;top:${y}px;width:${s}px;height:${s}px;border-radius:50%;background:#fff;opacity:${0.35 + (i % 4) * 0.15}"></div>`; }).join('')}`;
const FUNDO_PERFIL = `<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 42%,#B49BFF 0%,#6A4BE6 30%,#2F1F8F 62%,#170E52 100%)"></div>
<div style="position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 50% 42%,rgba(255,255,255,.08) 0deg 7deg,rgba(255,255,255,0) 7deg 20deg);-webkit-mask:radial-gradient(circle at 50% 42%,#000 0%,transparent 55%)"></div>`;

const estrela = (x, y, s, cor = '#FFD21F', r = 0) => `<svg style="position:absolute;left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;transform:rotate(${r}deg)" viewBox="0 0 100 100"><path d="M50 0 C55 38 62 45 100 50 C62 55 55 62 50 100 C45 62 38 55 0 50 C38 45 45 38 50 0Z" fill="${cor}" stroke="#140C45" stroke-width="5"/></svg>`;

/** Logotipo CAIOTYK: letras em relevo (camada de sombra/contorno + camada com degradê por cima). */
function logo() {
  const base = 'font-family:Inter,sans-serif;font-weight:900;font-size:112px;letter-spacing:-2px;line-height:1;white-space:nowrap';
  const relevo = Array.from({ length: 9 }, (_, i) => `0 ${i + 1}px 0 #120A3E`).join(',') + ',0 16px 22px rgba(0,0,0,.45)';
  const caixa = 'position:absolute;left:0;right:0;top:262px;text-align:center;transform:rotate(-3deg)';
  return `<div style="${caixa}"><span style="${base};color:#120A3E;-webkit-text-stroke:18px #120A3E;paint-order:stroke fill;text-shadow:${relevo}">CAIOTYK</span></div>
  <div style="${caixa}"><span style="${base};background:linear-gradient(180deg,#FFFFFF 0%,#FFFFFF 52%,#D9E6FF 53%,#BFD3FF 100%);-webkit-background-clip:text;color:transparent">CAIO</span><span style="${base};background:linear-gradient(180deg,#FFF27A 0%,#FFD21F 52%,#FFB000 53%,#FF8A00 100%);-webkit-background-clip:text;color:transparent">TYK</span></div>
  <div style="position:absolute;left:0;right:0;top:396px;text-align:center"><span style="display:inline-block;font-family:Inter,sans-serif;font-weight:900;font-size:21px;letter-spacing:4px;color:#fff;background:#120A3E;border:3px solid #FFD21F;border-radius:999px;padding:9px 24px;box-shadow:0 6px 0 rgba(0,0,0,.35)">ANIMAÇÕES <span style="color:#FFD21F">•</span> HISTÓRIAS <span style="color:#FFD21F">•</span> E SE...?</span></div>
  ${estrela(440, 236, 34, '#FFD21F', 10)}${estrela(948, 262, 26, '#7FE0FF', -8)}${estrela(990, 390, 18, '#FF5A8A')}${estrela(300, 400, 16, '#7CF29A')}`;
}

export function criar(ctx) {
  const { cena, camera } = ctx;
  ctx.renderer.toneMapping = THREE.ACESFilmicToneMapping; ctx.renderer.toneMappingExposure = 1.1;
  ctx.sol.shadow.mapSize.set(2048, 2048);
  const zeca = criarAvatarBloco(ZECA); cena.add(zeca);
  const lia = criarAvatarBloco(LIA); lia.visible = HORIZONTAL; cena.add(lia);
  const contraRoxo = new THREE.DirectionalLight('#B48CFF', 2.6); contraRoxo.position.set(-6, 4, -6); cena.add(contraRoxo);
  const contraAzul = new THREE.DirectionalLight('#7FE0FF', 2.2); contraAzul.position.set(6, 3, -6); cena.add(contraAzul);
  const preenche = new THREE.DirectionalLight('#FFE2C0', 0.9); preenche.position.set(0, 2, 8); cena.add(preenche);
  if (HORIZONTAL) {
    camera.fov = 24; camera.updateProjectionMatrix();
    zeca.scale.setScalar(1.6); zeca.position.set(-3.05, -1.0, 0); zeca.rotation.y = 0.42;
    lia.scale.setScalar(1.6); lia.position.set(3.05, -1.0, 0); lia.rotation.y = -0.42;
    const p1 = plataforma('#3FD3A0'); p1.position.set(-3.05, -1.18, 0); cena.add(p1);
    const p2 = plataforma('#FF7AA8'); p2.position.set(3.05, -1.18, 0); cena.add(p2);
    // blocos "?" nas laterais (aparecem no PC/TV) e alguns atrás
    [[-9.4, 1.9, -2, '#FFC21A', 1.25, 0.4], [-7.0, 0.7, -4, '#7FE0FF', 0.9, 1.1], [-11.6, 0.6, -6, '#FF5A8A', 0.9, 2], [9.4, 1.6, -2, '#7CF29A', 1.25, 0.8], [7.2, 2.3, -4, '#FFC21A', 0.85, 1.6], [11.8, 0.9, -6, '#B07CFF', 0.95, 0.3], [-5.6, 3.9, -8, '#FFC21A', 0.5, 0.9], [5.8, 4.0, -8, '#FF5A8A', 0.5, 2.2], [-7.8, -1.6, -3, '#B07CFF', 0.7, 1.3], [7.9, -1.4, -3, '#7FE0FF', 0.7, 0.5]].forEach(([x, y, z, cor, s, r]) => {
      const b = blocoPergunta(cor, s); b.position.set(x, y, z); b.rotation.set(0.35, r, 0.2); cena.add(b);
    });
  } else {
    camera.fov = 30; camera.updateProjectionMatrix();
    [[-1.05, 2.35, -1.4, '#FFC21A', 0.42, 0.6], [1.1, 2.15, -1.2, '#FF5A8A', 0.38, 1.4], [1.0, 1.05, -1.6, '#7CF29A', 0.34, 2]].forEach(([x, y, z, cor, s, r]) => { const b = blocoPergunta(cor, s); b.position.set(x, y, z); b.rotation.set(0.3, r, 0.2); cena.add(b); });
  }
  const inicial = () => {
    zeca.estado = HORIZONTAL ? { bracos: 'aceno', expr: 'feliz', olharLado: 0.15 } : { bracos: 'normal', expr: 'feliz', inclina: 0.06 };
    lia.estado = { bracos: 'pose', expr: 'feliz', olharLado: -0.15, inclina: -0.05 };
  };
  const sempre = () => {
    cena.background = null; cena.fog = null;
    ctx.hemi.color.set('#FFFFFF'); ctx.hemi.groundColor.set('#5A4AA0'); ctx.hemi.intensity = 1.15;
    ctx.sol.color.set('#FFF4E2'); ctx.sol.intensity = 2.6; ctx.sol.position.set(3, 7, 8); ctx.sol.target.position.set(0, 1, 0);
    if (!ctx.sol.target.parent) cena.add(ctx.sol.target);
    zeca.animar(0.55); lia.animar(0.55);
  };
  const blocos = [{
    dur: 2,
    camera: HORIZONTAL ? { pos: [0, 1.3, 16], alvo: [0, 1.3, 0] } : { pos: [0, 1.6, 3.4], alvo: [0, 1.5, 0] },
    aplicar() {},
    cenario2d: () => (HORIZONTAL ? FUNDO_BANNER : FUNDO_PERFIL),
    camada: () => (HORIZONTAL ? logo() : ''),
  }];
  return { blocos, inicial, sempre };
}
