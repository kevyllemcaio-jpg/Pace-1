// Desenho 2D em SVG para histórias narradas (estilo livro ilustrado): céu, vila em palafitas,
// névoa animada, mar, personagens 2D com contorno e a mão com o nome escrito.
// Tudo é desenhado num quadro de 720 x 1280 (o mesmo da camada de textos do motor):
//   camada: (lt, b) => tela2d(svgDaCena, { zoom, x, y })
import { lim, suave } from './motor.js';

export const LINHA = '#1B1B2B';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// gerador pseudoaleatório com semente (mesmo resultado em todo quadro)
export function aleat(semente) {
  let s = semente >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** Envolve a cena num SVG de tela cheia com "câmera" (zoom/pan), vinheta e granulado leve. */
export function tela2d(conteudo, { zoom = 1, x = 360, y = 640, escuro = 0 } = {}) {
  const tx = 360 - x * zoom, ty = 640 - y * zoom;
  return `<svg viewBox="0 0 720 1280" width="720" height="1280" style="position:absolute;left:0;top:0">
  <defs>
    <radialGradient id="vinheta" cx="50%" cy="48%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".65"/></radialGradient>
    <radialGradient id="brilhoLuz"><stop offset="0%" stop-color="#FFD98A" stop-opacity=".9"/><stop offset="100%" stop-color="#FFD98A" stop-opacity="0"/></radialGradient>
    <linearGradient id="nevoaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#C9D3E0" stop-opacity=".0"/><stop offset="35%" stop-color="#C9D3E0" stop-opacity=".75"/><stop offset="100%" stop-color="#9AA7B8" stop-opacity=".95"/></linearGradient>
  </defs>
  <g transform="translate(${tx},${ty}) scale(${zoom})">${conteudo}</g>
  <rect width="720" height="1280" fill="url(#vinheta)"/>
  ${escuro > 0 ? `<rect width="720" height="1280" fill="#000" opacity="${lim(escuro)}"/>` : ''}
</svg>`;
}

/** Céu noturno com lua e estrelas (cobre uma área grande para permitir pan). */
export function ceu(t, { lua = true, cor1 = '#0E1630', cor2 = '#2B3B63' } = {}) {
  const r = aleat(7);
  let s = `<defs><linearGradient id="ceuG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${cor1}"/><stop offset="100%" stop-color="${cor2}"/></linearGradient></defs>
  <rect x="-800" y="-1200" width="2400" height="3600" fill="url(#ceuG)"/>`;
  for (let i = 0; i < 90; i++) {
    const x = -400 + r() * 1500, y = -600 + r() * 1300, a = 0.35 + 0.65 * Math.abs(Math.sin(t * (0.6 + r()) + i));
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.8 + r() * 1.8).toFixed(1)}" fill="#fff" opacity="${a.toFixed(2)}"/>`;
  }
  if (lua) s += `<circle cx="560" cy="170" r="70" fill="#F4EBC8"/><circle cx="535" cy="155" r="12" fill="#E2D6AA"/><circle cx="585" cy="195" r="8" fill="#E2D6AA"/><circle cx="560" cy="170" r="110" fill="#F4EBC8" opacity=".08"/>`;
  return s;
}

/** Mar escuro ao fundo (linha do horizonte em y). */
export const mar = (t, y = 980) => `<rect x="-800" y="${y}" width="2400" height="1600" fill="#1A2744"/>` +
  [0, 1, 2, 3].map((i) => `<path d="M-800 ${y + 25 + i * 40} ${Array.from({ length: 30 }, (_, k) => `Q ${-760 + k * 80} ${y + 15 + i * 40 + Math.sin(t * 1.5 + k + i) * 6} ${-720 + k * 80} ${y + 25 + i * 40}`).join(' ')}" fill="none" stroke="#2E4270" stroke-width="3"/>`).join('');

/** Casa sobre palafitas. (x, y) = canto inferior esquerdo do piso da casa. */
export function casa(x, y, { w = 150, h = 110, cor = '#B5654A', telhado = '#5B2E2A', janela = true, t = 0, chao = 1200 } = {}) {
  let s = '';
  // pernas de pau
  for (const px of [x + 12, x + w / 2, x + w - 12]) s += `<rect x="${px - 6}" y="${y}" width="12" height="${chao - y}" fill="#5A4030" stroke="${LINHA}" stroke-width="3"/>`;
  s += `<line x1="${x + 12}" y1="${y + 60}" x2="${x + w - 12}" y2="${y + 160}" stroke="#5A4030" stroke-width="7"/><line x1="${x + w - 12}" y1="${y + 60}" x2="${x + 12}" y2="${y + 160}" stroke="#5A4030" stroke-width="7"/>`;
  // plataforma, paredes e telhado
  s += `<rect x="${x - 14}" y="${y - 10}" width="${w + 28}" height="14" rx="3" fill="#7A5A40" stroke="${LINHA}" stroke-width="3"/>`;
  s += `<rect x="${x}" y="${y - 10 - h}" width="${w}" height="${h}" fill="${cor}" stroke="${LINHA}" stroke-width="4"/>`;
  for (let i = 1; i < 5; i++) s += `<line x1="${x}" y1="${y - 10 - (h * i) / 5}" x2="${x + w}" y2="${y - 10 - (h * i) / 5}" stroke="${LINHA}" stroke-opacity=".25" stroke-width="2"/>`;
  s += `<path d="M${x - 16} ${y - 8 - h} L${x + w / 2} ${y - 10 - h - 70} L${x + w + 16} ${y - 8 - h} Z" fill="${telhado}" stroke="${LINHA}" stroke-width="4" stroke-linejoin="round"/>`;
  if (janela) {
    const a = 0.75 + 0.25 * Math.sin(t * 3 + x);
    s += `<circle cx="${x + w / 2}" cy="${y - 10 - h / 2}" r="55" fill="url(#brilhoLuz)" opacity="${(a * 0.6).toFixed(2)}"/>`;
    s += `<rect x="${x + w / 2 - 22}" y="${y - 10 - h / 2 - 22}" width="44" height="40" rx="4" fill="#FFD76A" opacity="${a.toFixed(2)}" stroke="${LINHA}" stroke-width="4"/><line x1="${x + w / 2}" y1="${y - 10 - h / 2 - 22}" x2="${x + w / 2}" y2="${y - 10 - h / 2 + 18}" stroke="${LINHA}" stroke-width="3"/>`;
  }
  return s;
}

/** Escada de cordas/madeira entre y1 (topo) e y2 (base). */
export function escada(x, y1, y2) {
  let s = `<line x1="${x - 18}" y1="${y1}" x2="${x - 18}" y2="${y2}" stroke="#6B4A30" stroke-width="6"/><line x1="${x + 18}" y1="${y1}" x2="${x + 18}" y2="${y2}" stroke="#6B4A30" stroke-width="6"/>`;
  for (let y = y1 + 20; y < y2; y += 34) s += `<line x1="${x - 18}" y1="${y}" x2="${x + 18}" y2="${y}" stroke="#8A6040" stroke-width="6"/>`;
  return s;
}

/** Ponte de corda entre dois pontos. */
export const ponte = (x1, y1, x2, y2) => {
  const mx = (x1 + x2) / 2, my = Math.max(y1, y2) + 40;
  let s = `<path d="M${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}" fill="none" stroke="#6B4A30" stroke-width="5"/><path d="M${x1} ${y1 - 30} Q ${mx} ${my - 30} ${x2} ${y2 - 30}" fill="none" stroke="#6B4A30" stroke-width="3"/>`;
  for (let i = 1; i < 10; i++) { const u = i / 10, x = x1 + (x2 - x1) * u, y = (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * my + u * u * y2; s += `<rect x="${x - 6}" y="${y - 4}" width="12" height="8" fill="#8A6040"/>`; }
  return s;
};

/** Lanterna pendurada com brilho. */
export const lanterna = (x, y, t) => `<line x1="${x}" y1="${y - 40}" x2="${x}" y2="${y - 12}" stroke="${LINHA}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${60 + 6 * Math.sin(t * 4 + x)}" fill="url(#brilhoLuz)" opacity=".7"/><rect x="${x - 12}" y="${y - 14}" width="24" height="30" rx="6" fill="#FFD76A" stroke="${LINHA}" stroke-width="3"/>`;

/** Névoa animada: topo em y (sobe quando y diminui). */
export function nevoa(t, y, { opacidade = 1, largura = 2400, x0 = -800 } = {}) {
  let s = '';
  for (let c = 0; c < 3; c++) {
    const yy = y + c * 30, n = 24, passo = largura / n;
    let d = `M${x0} ${yy + 2000} L${x0} ${yy}`;
    for (let k = 0; k <= n; k++) d += ` Q ${x0 + k * passo + passo / 2} ${yy + Math.sin(t * (0.7 + c * 0.2) + k * 1.3 + c) * 22 - 18} ${x0 + (k + 1) * passo} ${yy}`;
    d += ` L${x0 + largura + passo} ${yy + 2000} Z`;
    s += `<path d="${d}" fill="url(#nevoaG)" opacity="${(opacidade * (0.55 + c * 0.2)).toFixed(2)}"/>`;
  }
  // fiapos subindo
  const r = aleat(3);
  for (let i = 0; i < 14; i++) {
    const px = x0 + 800 + r() * 900, u = (t * 0.15 + r()) % 1;
    s += `<ellipse cx="${(px + Math.sin(t + i) * 20).toFixed(1)}" cy="${(y - u * 160).toFixed(1)}" rx="${30 + r() * 40}" ry="10" fill="#D9E1EC" opacity="${(opacidade * 0.35 * (1 - u)).toFixed(2)}"/>`;
  }
  return s;
}

/**
 * Personagem 2D (vista de frente). tipo: 'menino' | 'menina' | 'velho'.
 * o = { esc, expr: 'feliz'|'medo'|'serio'|'vazio'|'grito', braco: 'baixo'|'cima'|'aponta'|'orelhas', olhar: -1..1, andar: t }
 */
export function pessoa(x, y, tipo, o = {}) {
  const { esc = 1, expr = 'serio', braco = 'baixo', olhar = 0, andar = 0, virado = 1 } = o;
  const P = {
    menino: { pele: '#F2C29B', roupa: '#2A9D8F', calca: '#4A3B33', cabelo: '#3B2314', alt: 1 },
    menina: { pele: '#F6CDA8', roupa: '#F4E3C1', calca: '#6B4F8A', cabelo: '#1F1A22', alt: 0.82, lenco: '#E63946' },
    velho: { pele: '#E8B48E', roupa: '#7D8597', calca: '#4A4E5A', cabelo: '#E8E8E8', alt: 1 },
  }[tipo];
  const a = P.alt;
  const passo = Math.sin(andar * 8) * 10;
  let s = `<g transform="translate(${x},${y}) scale(${esc * virado},${esc})">`;
  // pernas
  s += `<rect x="-22" y="${-90 * a}" width="18" height="${90 * a}" rx="8" fill="${P.calca}" stroke="${LINHA}" stroke-width="4" transform="rotate(${passo} -13 ${-90 * a})"/>`;
  s += `<rect x="4" y="${-90 * a}" width="18" height="${90 * a}" rx="8" fill="${P.calca}" stroke="${LINHA}" stroke-width="4" transform="rotate(${-passo} 13 ${-90 * a})"/>`;
  // corpo
  const ct = -90 * a - 110 * a;
  s += `<rect x="-40" y="${ct}" width="80" height="${118 * a}" rx="26" fill="${P.roupa}" stroke="${LINHA}" stroke-width="4"/>`;
  // braços
  const ombro = ct + 22;
  const bracoPath = (lado) => {
    const sx = lado * 34;
    const ang = braco === 'cima' ? lado * -150 : braco === 'aponta' && lado > 0 ? -95 : braco === 'orelhas' ? lado * -140 : lado * 12;
    return `<g transform="rotate(${ang} ${sx} ${ombro})"><rect x="${sx - 10}" y="${ombro}" width="20" height="${82 * a}" rx="10" fill="${P.roupa}" stroke="${LINHA}" stroke-width="4"/><circle cx="${sx}" cy="${ombro + 82 * a}" r="13" fill="${P.pele}" stroke="${LINHA}" stroke-width="4"/></g>`;
  };
  s += bracoPath(-1) + bracoPath(1);
  if (P.lenco) s += `<path d="M-34 ${ct + 4} Q0 ${ct + 26} 34 ${ct + 4} L30 ${ct - 6} Q0 ${ct + 10} -30 ${ct - 6} Z" fill="${P.lenco}" stroke="${LINHA}" stroke-width="3"/><path d="M14 ${ct + 12} l16 40 l-22 -6 Z" fill="${P.lenco}" stroke="${LINHA}" stroke-width="3"/>`;
  // cabeça
  const hc = ct - 52;
  if (tipo === 'menina') s += `<circle cx="-50" cy="${hc - 6}" r="20" fill="${P.cabelo}" stroke="${LINHA}" stroke-width="4"/><circle cx="50" cy="${hc - 6}" r="20" fill="${P.cabelo}" stroke="${LINHA}" stroke-width="4"/>`;
  s += `<circle cx="0" cy="${hc}" r="54" fill="${P.pele}" stroke="${LINHA}" stroke-width="4"/>`;
  if (tipo === 'menino') s += `<path d="M-54 ${hc - 6} Q-50 ${hc - 62} 0 ${hc - 60} Q48 ${hc - 62} 56 ${hc - 8} Q30 ${hc - 34} 8 ${hc - 26} Q-10 ${hc - 40} -24 ${hc - 24} Q-40 ${hc - 34} -54 ${hc - 6} Z" fill="${P.cabelo}" stroke="${LINHA}" stroke-width="4" stroke-linejoin="round"/>`;
  if (tipo === 'menina') s += `<path d="M-54 ${hc} Q-54 ${hc - 60} 0 ${hc - 58} Q54 ${hc - 60} 54 ${hc} Q30 ${hc - 30} 0 ${hc - 34} Q-30 ${hc - 30} -54 ${hc} Z" fill="${P.cabelo}" stroke="${LINHA}" stroke-width="4"/>`;
  if (tipo === 'velho') {
    s += `<path d="M-40 ${hc + 18} Q0 ${hc + 90} 40 ${hc + 18} Q20 ${hc + 34} 0 ${hc + 30} Q-20 ${hc + 34} -40 ${hc + 18} Z" fill="${P.cabelo}" stroke="${LINHA}" stroke-width="4"/>`;
    if (!o.semChapeu) s += `<rect x="-62" y="${hc - 44}" width="124" height="14" rx="6" fill="#6B4A30" stroke="${LINHA}" stroke-width="4"/><rect x="-36" y="${hc - 84}" width="72" height="44" rx="10" fill="#6B4A30" stroke="${LINHA}" stroke-width="4"/>`;
  }
  // rosto
  const ox = olhar * 8;
  if (expr === 'vazio') {
    s += `<circle cx="${-20 + ox}" cy="${hc}" r="9" fill="#fff" stroke="${LINHA}" stroke-width="3"/><circle cx="${20 + ox}" cy="${hc}" r="9" fill="#fff" stroke="${LINHA}" stroke-width="3"/>`;
  } else {
    const ry = expr === 'medo' || expr === 'grito' ? 9 : 6;
    s += `<ellipse cx="${-20 + ox}" cy="${hc}" rx="5" ry="${ry}" fill="${LINHA}"/><ellipse cx="${20 + ox}" cy="${hc}" rx="5" ry="${ry}" fill="${LINHA}"/>`;
    s += `<circle cx="${-18 + ox}" cy="${hc - 3}" r="1.8" fill="#fff"/><circle cx="${22 + ox}" cy="${hc - 3}" r="1.8" fill="#fff"/>`;
  }
  if (expr === 'medo') s += `<path d="M-32 ${hc - 22} L-10 ${hc - 16} M32 ${hc - 22} L10 ${hc - 16}" stroke="${LINHA}" stroke-width="4" stroke-linecap="round"/>`;
  s += `<circle cx="-34" cy="${hc + 18}" r="8" fill="#F28C8C" opacity=".55"/><circle cx="34" cy="${hc + 18}" r="8" fill="#F28C8C" opacity=".55"/>`;
  const boca = { feliz: `<path d="M-14 ${hc + 22} Q0 ${hc + 36} 14 ${hc + 22}" fill="none" stroke="${LINHA}" stroke-width="4" stroke-linecap="round"/>`,
    vazio: `<path d="M-12 ${hc + 24} Q0 ${hc + 32} 12 ${hc + 24}" fill="none" stroke="${LINHA}" stroke-width="3" stroke-linecap="round"/>`,
    medo: `<ellipse cx="0" cy="${hc + 28}" rx="8" ry="10" fill="#6B1F2B" stroke="${LINHA}" stroke-width="3"/>`,
    grito: `<ellipse cx="0" cy="${hc + 28}" rx="12" ry="16" fill="#6B1F2B" stroke="${LINHA}" stroke-width="3"/>`,
    serio: `<line x1="-10" y1="${hc + 26}" x2="10" y2="${hc + 26}" stroke="${LINHA}" stroke-width="4" stroke-linecap="round"/>` }[expr] || '';
  s += boca + '</g>';
  return s;
}

/** Mão aberta em close com uma palavra escrita a tinta (a tinta "aparece" com k 0..1). */
export function maoComNome(x, y, nome, { escala = 1, k = 1, pele = '#F2C29B', tremor = 0, t = 0 } = {}) {
  const dx = tremor * Math.sin(t * 40) * 3;
  const dedos = [[-95, -150, -14], [-38, -190, -4], [22, -192, 4], [80, -160, 14]].map(([fx, fy, r]) =>
    `<rect x="${fx - 24}" y="${fy}" width="48" height="190" rx="24" fill="${pele}" stroke="${LINHA}" stroke-width="6" transform="rotate(${r} ${fx} ${fy + 160})"/>`).join('');
  const letras = nome.length;
  const mostra = Math.ceil(letras * lim(k));
  return `<g transform="translate(${x + dx},${y}) scale(${escala})">${dedos}
    <path d="M-150 60 Q-170 -30 -120 -40 L-60 20 Z" fill="${pele}" stroke="${LINHA}" stroke-width="6" transform="rotate(-25 -120 0)"/>
    <ellipse cx="0" cy="60" rx="150" ry="140" fill="${pele}" stroke="${LINHA}" stroke-width="6"/>
    <path d="M-80 20 Q-20 60 40 30 M-60 110 Q0 90 70 120" fill="none" stroke="#C9926E" stroke-width="4" stroke-linecap="round"/>
    <text x="0" y="90" text-anchor="middle" font-family="'Patrick Hand','Comic Sans MS',cursive" font-size="92" fill="#1E2A6E" opacity=".9" transform="rotate(-6 0 70)">${esc(nome.slice(0, mostra))}</text>
  </g>`;
}

/** Vagalumes/partículas no ar. */
export function particulas(t, { n = 24, cor = '#FFE9A6', semente = 11, area = [0, 0, 720, 1280] } = {}) {
  const r = aleat(semente);
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = area[0] + r() * area[2] + Math.sin(t * (0.5 + r()) + i) * 20, y = area[1] + ((r() * area[3] - t * (8 + r() * 14)) % area[3] + area[3]) % area[3];
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.5 + r() * 2.5).toFixed(1)}" fill="${cor}" opacity="${(0.3 + 0.5 * Math.abs(Math.sin(t * 2 + i))).toFixed(2)}"/>`;
  }
  return s;
}

/** Balão de fala desenhado à mão. */
export function balao(x, y, texto, { tam = 40, cor = '#fff' } = {}) {
  const w = Math.max(120, texto.length * tam * 0.58 + 50);
  return `<g transform="translate(${x},${y})"><path d="M${-w / 2} -40 Q${-w / 2} -80 ${-w / 2 + 40} -80 L${w / 2 - 40} -80 Q${w / 2} -80 ${w / 2} -40 Q${w / 2} 0 ${w / 2 - 40} 0 L20 0 L0 30 L-6 0 L${-w / 2 + 40} 0 Q${-w / 2} 0 ${-w / 2} -40 Z" fill="${cor}" stroke="${LINHA}" stroke-width="5"/>
  <text x="0" y="-26" text-anchor="middle" font-family="Inter,sans-serif" font-weight="900" font-size="${tam}" fill="${LINHA}">${esc(texto)}</text></g>`;
}

/** Texto curto de narrador/placa no topo da tela (fora da câmera). */
export const placa = (texto, k = 1) => `<div style="position:absolute;left:0;right:0;top:110px;text-align:center;font-family:Inter,sans-serif;font-weight:900;font-size:40px;color:#F4EBC8;opacity:${lim(k)};-webkit-text-stroke:7px #0E1630;paint-order:stroke fill;letter-spacing:1px">${esc(texto)}</div>`;

export { suave };
