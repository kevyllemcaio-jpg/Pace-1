// Visual "CINEMA" (motion design 3D): luz dourada de fim de tarde, céu em degradê com sol,
// neblina quente, granulado de filme + vinheta + correção de cor, legenda em caixa alta.
import * as THREE from 'three';

/** Textura de degradê vertical (céu). */
export function texturaCeu(cores) {
  const c = document.createElement('canvas');
  c.width = 4; c.height = 512;
  const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 512);
  cores.forEach(([o, cor]) => gr.addColorStop(o, cor));
  g.fillStyle = gr; g.fillRect(0, 0, 4, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Luz de fim de tarde (dourada). modo: 'tarde' | 'dia' | 'vela' | 'noite' */
export function luzCinema(ctx, modo = 'tarde') {
  const { cena, hemi, sol } = ctx;
  const P = (luzCinema.cache ||= {
    tarde: { ceu: [[0, '#6F8FB8'], [0.45, '#E9A77A'], [0.75, '#F6C68C'], [1, '#F9D9A8']], nevoa: '#E7B48A', perto: 18, longe: 150, hemiC: '#FFE6C4', hemiG: '#8A7488', hi: 1.55, solC: '#FFC98A', si: 3.0, solP: [-30, 22, -60] },
    dia: { ceu: [[0, '#7FB2E5'], [0.6, '#CFE3F2'], [1, '#F2E6CF']], nevoa: '#DCCFB8', perto: 25, longe: 220, hemiC: '#FFF4E2', hemiG: '#9AAA8A', hi: 1.6, solC: '#FFF3DC', si: 2.7, solP: [30, 50, 30] },
    campo: { ceu: [[0, '#4E8FD8'], [0.5, '#9CC8EE'], [0.8, '#D6EAF6'], [1, '#EEF4EA']], nevoa: '#CFE2EE', perto: 45, longe: 330, hemiC: '#F4FAFF', hemiG: '#7FA060', hi: 1.7, solC: '#FFF1D6', si: 2.6, solP: [25, 45, 30] },
    noite: { ceu: [[0, '#0C0A1E'], [0.55, '#2A1840'], [0.85, '#5A2A4A'], [1, '#7A3A3A']], nevoa: '#2A1A3A', perto: 30, longe: 260, hemiC: '#8A8AD0', hemiG: '#2A2A3A', hi: 0.9, solC: '#B8A0FF', si: 1.1, solP: [-20, 30, 20] },
    vela: { ceu: [[0, '#2A2230'], [1, '#4A3A3A']], nevoa: '#3A2C2A', perto: 4, longe: 22, hemiC: '#FFC28C', hemiG: '#4A3A44', hi: 0.95, solC: '#FFB870', si: 1.6, solP: [3, 4, 3] },
  })[modo];
  if (!P.tex) P.tex = texturaCeu(P.ceu);
  cena.background = P.tex;
  if (!cena.fog || !cena.fog.isFog) cena.fog = new THREE.Fog(P.nevoa, P.perto, P.longe);
  cena.fog.color.set(P.nevoa); cena.fog.near = P.perto; cena.fog.far = P.longe;
  hemi.color.set(P.hemiC); hemi.groundColor.set(P.hemiG); hemi.intensity = P.hi;
  sol.color.set(P.solC); sol.intensity = P.si;
  // o sol acompanha o "mundo" atual (origem em `centro`), para a sombra cair no lugar certo
  const c = ctx.centro || [0, 0, 0];
  sol.position.set(c[0] + P.solP[0], c[1] + P.solP[1], c[2] + P.solP[2]);
  sol.target.position.set(...c);
  if (!sol.target.parent) cena.add(sol.target);
  if (!luzCinema.sombraOk) { Object.assign(sol.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 300 }); sol.shadow.camera.updateProjectionMatrix(); luzCinema.sombraOk = true; }
  return P;
}

/** Brilho do sol (sprite) para aparecer no céu. */
export function brilhoSol(cena, pos, tam = 30, cor = '#FFE2A8') {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,240,1)'); gr.addColorStop(0.2, 'rgba(255,230,170,.9)'); gr.addColorStop(1, 'rgba(255,200,120,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), color: cor, transparent: true, depthWrite: false, fog: false }));
  s.position.set(...pos); s.scale.set(tam, tam, 1);
  cena.add(s);
  return s;
}

/** Camada por cima de tudo: granulado de filme, vinheta, tom quente e o estilo da legenda. */
export function filme(t, { tom = 'rgba(255,170,90,.10)', escuro = 0 } = {}) {
  const seed = Math.floor(t * 24) % 50;
  return `<style>
  .legenda { font-family: Inter, sans-serif !important; font-weight: 900 !important; text-transform: uppercase; letter-spacing: .5px; font-size: 40px !important;
    -webkit-text-stroke: 0 !important; color: #fff !important; text-shadow: 0 2px 0 rgba(0,0,0,.55), 0 0 14px rgba(0,0,0,.45); }
  .legenda .destaque { color: #FFC21A !important; }
  .titulo { text-transform: uppercase; }
  </style>
  <div style="position:absolute;inset:0;background:${tom};mix-blend-mode:overlay;pointer-events:none"></div>
  <svg style="position:absolute;inset:0;width:720px;height:1280px;opacity:.10;mix-blend-mode:overlay;pointer-events:none" viewBox="0 0 720 1280"><filter id="gr${seed}"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${seed}"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1 0"/></filter><rect width="720" height="1280" filter="url(#gr${seed})"/></svg>
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 62%, rgba(30,15,5,.32) 100%);pointer-events:none"></div>
  ${escuro > 0 ? `<div style="position:absolute;inset:0;background:#000;opacity:${Math.min(1, escuro)}"></div>` : ''}`;
}

/** Número/rótulo colado num ponto 3D (ex.: "80 km/h" ao lado do objeto caindo). */
export function rotulo3d(camera, pos, html, { dx = 60, dy = -40 } = {}) {
  const v = new THREE.Vector3(...pos).project(camera);
  if (v.z > 1) return '';
  const x = (v.x + 1) * 360 + dx, y = (1 - v.y) * 640 + dy;
  return `<div style="position:absolute;left:${x}px;top:${y}px;transform:translate(-50%,-50%);font-family:Inter,sans-serif;font-weight:900;color:#FFC21A;font-size:44px;text-shadow:0 2px 0 rgba(0,0,0,.5);white-space:nowrap">${html}</div>`;
}

/** Mostrador de ponteiro (balança / velocímetro) em SVG. */
export function mostrador(x, y, valor, max, txt, { r = 120, unidade = '' } = {}) {
  const a = -220 + 260 * Math.min(1, valor / max);
  const marcas = Array.from({ length: 11 }, (_, i) => { const ang = ((-220 + i * 26) * Math.PI) / 180; return `<line x1="${Math.cos(ang) * r * 0.78}" y1="${Math.sin(ang) * r * 0.78}" x2="${Math.cos(ang) * r * 0.9}" y2="${Math.sin(ang) * r * 0.9}" stroke="#333" stroke-width="4"/>`; }).join('');
  const pa = (a * Math.PI) / 180;
  return `<svg style="position:absolute;left:0;top:0;width:720px;height:1280px" viewBox="0 0 720 1280"><g transform="translate(${x},${y})">
  <circle r="${r}" fill="#F4F1EA" stroke="#9AA0A8" stroke-width="10"/>${marcas}
  <line x1="0" y1="0" x2="${Math.cos(pa) * r * 0.75}" y2="${Math.sin(pa) * r * 0.75}" stroke="#D23B2B" stroke-width="6" stroke-linecap="round"/><circle r="10" fill="#333"/>
  <rect x="-62" y="${r * 0.3}" width="124" height="52" rx="8" fill="#16161A"/><text x="0" y="${r * 0.3 + 38}" text-anchor="middle" font-family="Inter,sans-serif" font-weight="900" font-size="34" fill="#FFC21A">${txt}<tspan font-size="18">${unidade}</tspan></text></g></svg>`;
}
