// Desenhos 2D do REINO MEDIEVAL (histórias de fantasia / isekai): céu do amanhecer, castelo,
// casas de enxaimel, bandeiras, quarto de pedra com velas, berço visto de cima, livro antigo
// e as MARCAS de poder (chama, gota, raio, folha e a marca amaldiçoada em forma de olho).
import { LINHA, aleat, pessoa } from './desenho2d.js';

export const ceuAmanhecer = () => `<defs><linearGradient id="amanG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3B2A6B"/><stop offset="45%" stop-color="#E86A5B"/><stop offset="100%" stop-color="#FFC56E"/></linearGradient></defs><rect x="-800" y="-1200" width="2400" height="3600" fill="url(#amanG)"/><circle cx="520" cy="560" r="90" fill="#FFE08A" opacity=".9"/>`;

export const montanhas = (y) => `<path d="M-400 ${y} L-150 ${y - 260} L60 ${y - 80} L260 ${y - 330} L470 ${y - 120} L680 ${y - 300} L1000 ${y} Z" fill="#5B3F7A" stroke="${LINHA}" stroke-width="5" stroke-linejoin="round"/><path d="M260 ${y - 330} L220 ${y - 270} L290 ${y - 280} Z M680 ${y - 300} L640 ${y - 240} L710 ${y - 250} Z" fill="#FFFFFF"/>`;

/** Castelo com torres e bandeiras. */
export function castelo(x, y, t = 0, s = 1) {
  const torre = (tx, h, w = 70) => `<rect x="${tx - w / 2}" y="${-h}" width="${w}" height="${h}" fill="#9AA0B5" stroke="${LINHA}" stroke-width="5"/><path d="M${tx - w / 2 - 10} ${-h} L${tx} ${-h - 80} L${tx + w / 2 + 10} ${-h} Z" fill="#3E5BA9" stroke="${LINHA}" stroke-width="5" stroke-linejoin="round"/>` +
    `<line x1="${tx}" y1="${-h - 80}" x2="${tx}" y2="${-h - 130}" stroke="${LINHA}" stroke-width="4"/><path d="M${tx} ${-h - 130} q${25} ${8 + Math.sin(t * 4 + tx) * 6} ${50} 0 v26 q-25 ${-8 + Math.sin(t * 4 + tx) * 6} -50 0 z" fill="#E63946" stroke="${LINHA}" stroke-width="3"/>` +
    `<rect x="${tx - 9}" y="${-h + 40}" width="18" height="30" rx="9" fill="#2B2B3A"/>`;
  let d = `<g transform="translate(${x},${y}) scale(${s})">`;
  d += `<rect x="-170" y="-190" width="340" height="190" fill="#A7ADC2" stroke="${LINHA}" stroke-width="5"/>`;
  for (let k = 0; k < 9; k++) d += `<rect x="${-170 + k * 40}" y="-215" width="24" height="25" fill="#A7ADC2" stroke="${LINHA}" stroke-width="4"/>`;
  d += torre(-170, 300) + torre(170, 300) + torre(0, 380, 90);
  d += `<path d="M-40 0 V-80 Q0 -125 40 -80 V0 Z" fill="#5A3A22" stroke="${LINHA}" stroke-width="5"/>`;
  return d + '</g>';
}

/** Casa medieval de enxaimel. (x, y) = base esquerda. */
export function casaMedieval(x, y, { w = 150, h = 140, cor = '#F1E3C6', telhado = '#9C3D2E', t = 0 } = {}) {
  let s = `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${cor}" stroke="${LINHA}" stroke-width="5"/>`;
  s += `<line x1="${x}" y1="${y - h / 2}" x2="${x + w}" y2="${y - h / 2}" stroke="#5A3A22" stroke-width="8"/><line x1="${x + w / 3}" y1="${y - h}" x2="${x + w / 3}" y2="${y}" stroke="#5A3A22" stroke-width="8"/><line x1="${x}" y1="${y - h}" x2="${x + w / 3}" y2="${y - h / 2}" stroke="#5A3A22" stroke-width="7"/><line x1="${x + w}" y1="${y - h}" x2="${x + (2 * w) / 3}" y2="${y - h / 2}" stroke="#5A3A22" stroke-width="7"/>`;
  s += `<path d="M${x - 20} ${y - h + 4} L${x + w / 2} ${y - h - 100} L${x + w + 20} ${y - h + 4} Z" fill="${telhado}" stroke="${LINHA}" stroke-width="5" stroke-linejoin="round"/>`;
  s += `<rect x="${x + w / 2 + 8}" y="${y - h / 2 + 10}" width="36" height="${h / 2 - 10}" fill="#5A3A22" stroke="${LINHA}" stroke-width="4"/>`;
  s += `<rect x="${x + 14}" y="${y - h + 18}" width="30" height="30" fill="#FFD76A" opacity="${(0.8 + 0.2 * Math.sin(t * 3 + x)).toFixed(2)}" stroke="${LINHA}" stroke-width="4"/>`;
  return s;
}

/** Quarto de pedra com velas (parede ao fundo, chão em y). */
export function quartoPedra(y, t = 0) {
  const r = aleat(41);
  let s = `<rect x="-800" y="-1200" width="2400" height="${1200 + y}" fill="#5B5466"/>`;
  for (let row = 0; row * 60 < 1200 + y; row++) for (let k = -10; k < 20; k++) {
    const bx = k * 110 + (row % 2) * 55, by = -1200 + row * 60;
    s += `<rect x="${bx}" y="${by}" width="104" height="54" rx="6" fill="${r() > 0.5 ? '#6B6377' : '#625A6E'}" stroke="#3E3848" stroke-width="3"/>`;
  }
  s += `<rect x="-800" y="${y}" width="2400" height="1400" fill="#7A5A40"/>`;
  for (let k = -6; k < 12; k++) s += `<line x1="${k * 120}" y1="${y}" x2="${k * 120 - 80}" y2="${y + 1400}" stroke="#5A4030" stroke-width="5"/>`;
  return s;
}

/** Vela com chama tremulando e brilho. */
export const vela = (x, y, t) => `<circle cx="${x}" cy="${y - 70}" r="${70 + Math.sin(t * 7 + x) * 6}" fill="#FFB347" opacity=".22"/><rect x="${x - 12}" y="${y - 60}" width="24" height="60" rx="4" fill="#F4E9D0" stroke="${LINHA}" stroke-width="4"/><path d="M${x} ${y - 100 - Math.sin(t * 9 + x) * 4} Q${x + 12} ${y - 76} ${x} ${y - 62} Q${x - 12} ${y - 76} ${x} ${y - 100 - Math.sin(t * 9 + x) * 4} Z" fill="#FFB020" stroke="${LINHA}" stroke-width="3"/>`;

/** Cesto/berço de palha visto DE CIMA (fundo da cena do bebê). */
export function bercoDeCima(cx, cy, t = 0) {
  let s = `<ellipse cx="${cx}" cy="${cy}" rx="300" ry="420" fill="#C8955A" stroke="${LINHA}" stroke-width="8"/>`;
  for (let k = 0; k < 14; k++) s += `<ellipse cx="${cx}" cy="${cy}" rx="${300 - k * 4}" ry="${420 - k * 4}" fill="none" stroke="#A9773F" stroke-width="2" stroke-dasharray="18 10" transform="rotate(${k * 6} ${cx} ${cy})"/>`;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="250" ry="370" fill="#F1E6D2" stroke="${LINHA}" stroke-width="5"/>`;
  s += `<path d="M${cx - 230} ${cy + 80} Q${cx} ${cy + 20} ${cx + 230} ${cy + 80} L${cx + 220} ${cy + 300} Q${cx} ${cy + 380} ${cx - 220} ${cy + 300} Z" fill="#9FC9E8" stroke="${LINHA}" stroke-width="5"/>`; // cobertor
  return s;
}

/** Rostos da vila espiando o berço de cima (em volta da borda). medo 0..1 */
export function rostosEspiando(cx, cy, medo = 0, t = 0) {
  const pos = [[-330, -330], [0, -470], [330, -330], [-380, 60], [380, 60]];
  return pos.map(([dx, dy], i) => {
    const x = cx + dx, y = cy + dy, s = 1.1;
    const olhos = medo > 0.5 ? `<circle cx="-20" cy="-4" r="9" fill="#fff" stroke="${LINHA}" stroke-width="3"/><circle cx="20" cy="-4" r="9" fill="#fff" stroke="${LINHA}" stroke-width="3"/><circle cx="-20" cy="-4" r="3" fill="${LINHA}"/><circle cx="20" cy="-4" r="3" fill="${LINHA}"/>` : `<ellipse cx="-20" cy="-4" rx="5" ry="7" fill="${LINHA}"/><ellipse cx="20" cy="-4" rx="5" ry="7" fill="${LINHA}"/>`;
    const boca = medo > 0.5 ? `<ellipse cx="0" cy="26" rx="10" ry="13" fill="#6B1F2B"/>` : `<path d="M-14 20 Q0 34 14 20" fill="none" stroke="${LINHA}" stroke-width="4"/>`;
    const pele = ['#F2C29B', '#C68B59', '#8D5524', '#F6CDA8', '#E0AC69'][i];
    const cab = ['#3B2314', '#1F1A22', '#7A4A1E', '#E8E8E8', '#B5651D'][i];
    return `<g transform="translate(${x},${y + Math.sin(t * 2 + i) * 4}) scale(${s})"><circle r="62" fill="${cab}" stroke="${LINHA}" stroke-width="5"/><circle cy="8" r="52" fill="${pele}" stroke="${LINHA}" stroke-width="5"/>${olhos}${boca}</g>`;
  }).join('');
}

/** Símbolo de uma MARCA (traço brilhante). tipo: 'chama'|'gota'|'raio'|'folha'|'olho'. */
export function marca(tipo, x, y, { s = 1, brilho = 1, t = 0 } = {}) {
  const cor = { chama: '#FF7A1A', gota: '#3FA9FF', raio: '#FFD21F', folha: '#3DDC84', olho: '#B026FF' }[tipo];
  const d = {
    chama: 'M0 -40 Q26 -10 14 14 Q10 30 0 34 Q-10 30 -14 14 Q-26 -10 0 -40 Z M0 4 Q8 16 0 26 Q-8 16 0 4 Z',
    gota: 'M0 -40 Q30 0 24 16 Q16 36 0 36 Q-16 36 -24 16 Q-30 0 0 -40 Z',
    raio: 'M8 -42 L-20 6 L-2 6 L-10 42 L22 -8 L4 -8 Z',
    folha: 'M-30 30 Q-30 -30 30 -36 Q34 26 -30 30 Z M-30 30 L18 -18',
    olho: 'M-46 0 Q0 -40 46 0 Q0 40 -46 0 Z',
  }[tipo];
  const glow = `<circle r="${56 + 6 * Math.sin(t * 5)}" fill="${cor}" opacity="${(0.25 * brilho).toFixed(2)}"/>`;
  let s2 = `<g transform="translate(${x},${y}) scale(${s})">${glow}<path d="${d}" fill="${tipo === 'olho' ? '#140F1C' : cor}" stroke="${tipo === 'olho' ? cor : LINHA}" stroke-width="${tipo === 'olho' ? 6 : 4}" stroke-linejoin="round"/>`;
  if (tipo === 'olho') s2 += `<circle r="15" fill="${cor}"/><circle r="6" fill="#140F1C"/>` + [0, 1, 2, 3, 4, 5].map((k) => { const a = (k / 6) * Math.PI * 2 + t * 0.6; return `<path d="M${Math.cos(a) * 50} ${Math.sin(a) * 30} l${Math.cos(a) * 24} ${Math.sin(a) * 18}" stroke="${cor}" stroke-width="5" stroke-linecap="round"/>`; }).join('');
  return s2 + '</g>';
}

/** Morador 2D com a marca brilhando e o poder saindo dela. */
export function moradorComPoder(x, y, tipo, t, { esc = 0.9, tipoPessoa = 'menino' } = {}) {
  const fx = { chama: (px, py) => [0, 1, 2, 3].map((k) => { const u = (t * 1.2 + k / 4) % 1; return `<circle cx="${px + Math.sin(t * 6 + k) * 10}" cy="${py - u * 110}" r="${(18 * (1 - u) + 4).toFixed(1)}" fill="${u < 0.5 ? '#FFD21F' : '#FF5A1A'}" opacity="${(1 - u).toFixed(2)}"/>`; }).join(''),
    gota: (px, py) => `<path d="M${px - 50} ${py} q50 ${-80 - Math.sin(t * 3) * 20} 100 0" fill="none" stroke="#3FA9FF" stroke-width="12" stroke-linecap="round" opacity=".85"/>` + [0, 1, 2].map((k) => `<circle cx="${px - 40 + k * 40}" cy="${py - 40 - Math.abs(Math.sin(t * 4 + k)) * 40}" r="9" fill="#7CC6FF"/>`).join(''),
    raio: (px, py) => (Math.sin(t * 13) > 0 ? `<path d="M${px} ${py} l-24 -60 l30 10 l-20 -70" fill="none" stroke="#FFF59A" stroke-width="8" stroke-linejoin="round"/>` : ''),
    folha: (px, py) => [0, 1, 2].map((k) => `<path d="M${px + Math.cos(t * 2 + k * 2) * 60} ${py - 40 + Math.sin(t * 2 + k * 2) * 30} q12 -12 24 0 q-12 12 -24 0 z" fill="#3DDC84" stroke="${LINHA}" stroke-width="2"/>`).join('') };
  const hy = y - 255 * esc, hx = x + 50 * esc;
  return pessoa(x, y, tipoPessoa, { esc, expr: 'feliz', braco: 'cima' }) + marca(tipo, hx, hy + 30 * esc, { s: 0.45, t }) + fx[tipo](hx, hy);
}

/** Página de livro antigo com a marca do fim. */
export function livroAntigo(cx, cy, t, k = 1) {
  return `<g transform="translate(${cx},${cy})"><rect x="-320" y="-230" width="640" height="460" rx="20" fill="#5A3A22" stroke="${LINHA}" stroke-width="8"/>
  <path d="M-300 -210 Q-150 -230 0 -205 Q150 -230 300 -210 L300 210 Q150 190 0 214 Q-150 190 -300 210 Z" fill="#EAD9B0" stroke="${LINHA}" stroke-width="5"/>
  <line x1="0" y1="-205" x2="0" y2="214" stroke="#B89A6A" stroke-width="6"/>
  ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<line x1="-260" y1="${-140 + i * 44}" x2="${-60 - (i % 3) * 30}" y2="${-140 + i * 44}" stroke="#9C8460" stroke-width="6" stroke-linecap="round"/>`).join('')}
  ${marca('olho', 150, -60, { s: 1.4, t, brilho: k })}
  <text x="150" y="110" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="40" fill="#5A1A3A" opacity="${k}">A MARCA</text>
  <text x="150" y="160" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="40" fill="#5A1A3A" opacity="${k}">DO FIM</text></g>`;
}
