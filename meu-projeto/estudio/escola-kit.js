// escola-kit.js — personagens (cabeça branca redonda, o estilo do Léo) e cenários da escola
// para o vídeo "E SE você SALVASSE a sua escola?" (formato horizontal 1920x1080).

const EW = 1920, EH = 1080;

// Figura de corpo inteiro (origem = centro da cabeça; pés em y ≈ 540 locais).
function figura(p = {}) {
  const q = { x: 960, y: 900, esc: 0.8, t: 0, expr: 'neutro', fala: false, olhar: [0, 0], cabelo: '#B0502A', roupa: '#141414',
    calca: '#0E0E0E', sapato: '#FFFFFF', capuz: false, longo: false, espetado: true, oculos: false, bone: null, capacete: null,
    saia: null, pose: 'base', mochila: false, ...p };
  const falar = q.fala && Math.sin(q.t * 15) > 0;
  const bob = Math.sin(q.t * 2.2) * 3;
  let s = `<g transform="translate(${q.x} ${q.y - 546 * q.esc + bob}) scale(${q.esc})">`;
  s += `<ellipse cx="0" cy="546" rx="170" ry="20" fill="#000" opacity="0.28"/>`;
  // pernas e sapatos
  if (q.saia) {
    s += `<path d="M -120 380 L -150 520 L 150 520 L 120 380 Z" fill="${q.saia}" stroke="#111" stroke-width="5"/>`;
    s += `<rect x="-78" y="506" width="56" height="34" rx="12" fill="${q.sapato}" stroke="#111" stroke-width="5"/><rect x="22" y="506" width="56" height="34" rx="12" fill="${q.sapato}" stroke="#111" stroke-width="5"/>`;
  } else {
    s += `<path d="M -130 380 L -140 520 L -20 520 L -4 380 Z" fill="${q.calca}"/><path d="M 4 380 L 20 520 L 140 520 L 130 380 Z" fill="${q.calca}"/>`;
    s += `<ellipse cx="-72" cy="536" rx="62" ry="26" fill="${q.sapato}" stroke="#111" stroke-width="6"/><ellipse cx="72" cy="536" rx="62" ry="26" fill="${q.sapato}" stroke="#111" stroke-width="6"/>`;
  }
  if (q.mochila) s += `<rect x="-232" y="160" width="120" height="210" rx="30" fill="#2A2A2A" stroke="#0A0A0A" stroke-width="6"/><rect x="-220" y="250" width="96" height="70" rx="14" fill="#1E1E1E" stroke="#0A0A0A" stroke-width="4"/>`;
  // tronco
  s += `<path d="M -150 300 Q -165 190 -100 165 L 100 165 Q 165 190 150 300 L 150 380 L -150 380 Z" fill="${q.roupa}" stroke="${q.capuz ? '#000' : '#222'}" stroke-width="3"/>`;
  if (q.capuz) {
    s += `<path d="M -95 170 Q 0 120 95 170 L 80 200 Q 0 160 -80 200 Z" fill="${q.roupa}" stroke="#0A2A80" stroke-width="3"/>`;
    s += `<line x1="-26" y1="180" x2="-30" y2="262" stroke="#E8E8E8" stroke-width="5" stroke-linecap="round"/><line x1="26" y1="180" x2="30" y2="262" stroke="#E8E8E8" stroke-width="5" stroke-linecap="round"/>`;
    s += `<circle cx="-30" cy="266" r="6" fill="#E8E8E8"/><circle cx="30" cy="266" r="6" fill="#E8E8E8"/>`;
    s += `<path d="M -92 300 Q -92 282 -70 282 L 70 282 Q 92 282 92 300 L 92 330 Q 0 350 -92 330 Z" fill="#1E1E1E" stroke="#000" stroke-width="4"/>`;
  }
  // braços
  if (q.pose === 'aponta') {
    s += `<ellipse cx="-188" cy="300" rx="44" ry="120" fill="${q.roupa}" transform="rotate(12 -188 300)"/>`;
    s += `<ellipse cx="0" cy="0" rx="44" ry="120" fill="${q.roupa}" transform="translate(205 205) rotate(-62)"/>`;
  } else {
    s += `<ellipse cx="-188" cy="300" rx="44" ry="120" fill="${q.roupa}" transform="rotate(12 -188 300)"/>`;
    s += `<ellipse cx="188" cy="300" rx="44" ry="120" fill="${q.roupa}" transform="rotate(-12 188 300)"/>`;
  }
  // pescoço
  s += `<rect x="-40" y="130" width="80" height="60" rx="20" fill="#F3F3F3"/>`;
  // cabelo comprido atrás
  if (q.longo) s += `<path d="M -165 -40 Q -205 120 -172 300 L 172 300 Q 205 120 165 -40 Z" fill="${q.cabelo}" stroke="#2A1A10" stroke-width="5"/>`;
  // cabeça
  s += `<circle cx="0" cy="0" r="150" fill="#FFFFFF" stroke="#E4E4E4" stroke-width="3"/>`;
  if (!q.capacete) {
    s += `<path d="M -150 -10 Q -178 -160 -50 -168 Q -30 -230 30 -196 Q 120 -214 152 -60 Q 118 -108 70 -118 Q 36 -86 0 -120 Q -92 -112 -150 -10 Z" fill="${q.cabelo}"/>`;
    if (q.espetado) s += `<path d="M -150 -150 L -196 -206 L -120 -176 Z M -70 -190 L -92 -262 L -28 -204 Z M 16 -206 L 36 -290 L 66 -200 Z M 92 -176 L 150 -232 L 136 -150 Z M -14 -214 L 2 -262 L 22 -212 Z" fill="${q.cabelo}" stroke="#3A2010" stroke-width="5" stroke-linejoin="round"/>`;
  }
  if (q.capacete) s += `<path d="M -168 -20 Q -172 -200 0 -200 Q 172 -200 168 -20 Z" fill="${q.capacete}" stroke="#111" stroke-width="6"/><rect x="-170" y="-30" width="340" height="24" rx="10" fill="#FFFFFF" stroke="#111" stroke-width="5"/>`;
  if (q.bone) s += `<path d="M -160 -60 Q -160 -190 0 -190 Q 160 -190 160 -60 Z" fill="${q.bone}" stroke="#111" stroke-width="5"/><path d="M 100 -80 L 240 -60 L 230 -30 L 100 -40 Z" fill="${q.bone}" stroke="#111" stroke-width="5"/>`;
  // sobrancelhas
  const sb = { neutro: [-58, -60], feliz: [-68, -68], panico: [-86, -86], surpreso: [-86, -86], triste: [-62, -84], bravo: [-88, -50], determinado: [-88, -50] }[q.expr] || [-58, -60];
  const [bo, bi] = sb;
  s += `<path d="M -98 ${bo} Q -60 ${(bo + bi) / 2 - 16} -20 ${bi}" fill="none" stroke="#141414" stroke-width="18" stroke-linecap="round"/>`;
  s += `<path d="M 98 ${bo} Q 60 ${(bo + bi) / 2 - 16} 20 ${bi}" fill="none" stroke="#141414" stroke-width="18" stroke-linecap="round"/>`;
  // olhos
  const [rx, ry] = { neutro: [30, 38], feliz: [30, 30], panico: [30, 46], surpreso: [30, 46], triste: [30, 34], bravo: [30, 30], determinado: [30, 32] }[q.expr] || [30, 38];
  const [ox, oy] = q.olhar;
  for (const sx of [-1, 1]) {
    const ex = sx * 55, ey = -6;
    s += `<ellipse cx="${ex + ox * 8}" cy="${ey + oy * 6}" rx="${rx}" ry="${ry}" fill="#0B0B0B"/>`;
    s += `<circle cx="${ex + ox * 8 - 10}" cy="${ey - 14 + oy * 6}" r="9" fill="#FFFFFF"/><circle cx="${ex + ox * 8 - 30 * sx * -0.3}" cy="${ey + 12}" r="4.5" fill="#FFFFFF"/>`;
  }
  if (q.oculos) {
    s += `<circle cx="-55" cy="-6" r="48" fill="none" stroke="#111" stroke-width="8"/><circle cx="55" cy="-6" r="48" fill="none" stroke="#111" stroke-width="8"/><line x1="-7" y1="-10" x2="7" y2="-10" stroke="#111" stroke-width="7"/>`;
  }
  // bochechas
  s += `<ellipse cx="-96" cy="52" rx="20" ry="11" fill="#FF8FA0" opacity="0.35"/><ellipse cx="96" cy="52" rx="20" ry="11" fill="#FF8FA0" opacity="0.35"/>`;
  // nariz
  s += `<path d="M -6 22 Q -12 34 2 36" fill="none" stroke="#3A3A3A" stroke-width="6" stroke-linecap="round"/>`;
  // boca
  if (falar) s += `<ellipse cx="0" cy="104" rx="26" ry="18" fill="#5B1717" stroke="#111" stroke-width="7"/>`;
  else if (q.expr === 'feliz') s += `<path d="M -52 80 Q 0 132 52 80 Z" fill="#5B1717" stroke="#111" stroke-width="8" stroke-linejoin="round"/>`;
  else if (q.expr === 'panico' || q.expr === 'surpreso') s += `<ellipse cx="0" cy="108" rx="22" ry="30" fill="#5B1717" stroke="#111" stroke-width="7"/>`;
  else if (q.expr === 'triste') s += `<path d="M -44 118 Q 0 84 44 118" fill="none" stroke="#111" stroke-width="8" stroke-linecap="round"/>`;
  else if (q.expr === 'bravo' || q.expr === 'determinado') s += `<path d="M -44 104 Q 0 98 44 104" fill="none" stroke="#111" stroke-width="8" stroke-linecap="round"/>`;
  else s += `<path d="M -36 104 L 36 104" fill="none" stroke="#111" stroke-width="8" stroke-linecap="round"/>`;
  return s + `</g>`;
}

// Presets de personagens
const LEO = { capuz: true, mochila: true };       // Léo: moletom preto com capuz, mochila, cabelo castanho-alaranjado espetado
const ANA = { cabelo: '#3B2A3A', roupa: '#7A3B6E', calca: '#2B2B3A', oculos: true, longo: true, espetado: false, sapato: '#222' };
const BIA = { cabelo: '#D8903A', roupa: '#F2A0C8', calca: '#3A3A5A', longo: true, espetado: false, sapato: '#222' };
const NILTON = { cabelo: '#555', roupa: '#5A6A4A', calca: '#3A3A3A', bone: '#5A6A4A', espetado: false, sapato: '#222' };
const BOMBEIRO = { cabelo: '#222', roupa: '#E26A1A', calca: '#222', capacete: '#D7262B', espetado: false, sapato: '#111' };
const DIRETOR = { cabelo: '#9A9A9A', roupa: '#2B2B2B', calca: '#1A1A1A', espetado: false, sapato: '#111' };
const COLEGA = (cor, c2) => ({ cabelo: c2, roupa: cor, calca: '#2E2E3E', espetado: false, sapato: '#222' });

// Close (cabeça grande, meio corpo) para falas
const close = (p) => figura({ x: 960, y: 560, esc: 1.45, ...p });

// ---------- cenários ----------
function lerp(a, b, t) { return a + (b - a) * t; }
function parede(lt) {
  return `<rect width="${EW}" height="${EH}" fill="#2A3350"/>`;
}
// Paredes com armários azuis em perspectiva (corredor)
function armarios() {
  let s = '';
  for (let i = 0; i < 6; i++) {
    const t0 = i / 6, t1 = (i + 0.78) / 6;
    const topo = (t) => [720 * t, 120 + 180 * t], base = (t) => [720 * t, EH - 460 * t];
    const a = topo(t0), b = topo(t1), c = base(t1), d = base(t0);
    s += `<polygon points="${a} ${b} ${c} ${d}" fill="#2F5FC8" stroke="#0E2060" stroke-width="4"/>`;
    s += `<line x1="${(a[0] + b[0]) / 2}" y1="${(a[1] + b[1]) / 2 + 60}" x2="${(c[0] + d[0]) / 2}" y2="${(c[1] + d[1]) / 2 - 70}" stroke="#0E2060" stroke-width="5"/>`;
  }
  for (let i = 0; i < 6; i++) {
    const t0 = i / 6, t1 = (i + 0.78) / 6;
    const topo = (t) => [EW - 720 * t, 120 + 180 * t], base = (t) => [EW - 720 * t, EH - 460 * t];
    const a = topo(t0), b = topo(t1), c = base(t1), d = base(t0);
    s += `<polygon points="${a} ${b} ${c} ${d}" fill="#2F5FC8" stroke="#0E2060" stroke-width="4"/>`;
    s += `<line x1="${(a[0] + b[0]) / 2}" y1="${(a[1] + b[1]) / 2 + 60}" x2="${(c[0] + d[0]) / 2}" y2="${(c[1] + d[1]) / 2 - 70}" stroke="#0E2060" stroke-width="5"/>`;
  }
  return s;
}
// Chama: vários tongues de fogo subindo de (x, y)
function fogo(lt, x, y, w, h, k = 1) {
  let s = '';
  const n = Math.max(3, Math.round(w / 60));
  for (let i = 0; i < n; i++) {
    const fx = x + (i + 0.5) * (w / n);
    const hh = h * (0.55 + 0.45 * Math.abs(Math.sin(lt * 7 + i * 1.7))) * k;
    s += `<path d="M ${fx - w / n * 0.6} ${y + h} Q ${fx - w / n * 0.5} ${y + h - hh * 0.5} ${fx} ${y + h - hh} Q ${fx + w / n * 0.5} ${y + h - hh * 0.5} ${fx + w / n * 0.6} ${y + h} Z" fill="#FF7A1A" opacity="0.93"/>`;
    s += `<path d="M ${fx - w / n * 0.3} ${y + h} Q ${fx} ${y + h - hh * 0.5} ${fx + w / n * 0.05} ${y + h - hh * 0.62} Q ${fx + w / n * 0.3} ${y + h - hh * 0.3} ${fx + w / n * 0.3} ${y + h} Z" fill="#FFD84D" opacity="0.9"/>`;
  }
  return s;
}
// Fumaça subindo
function fumaca(lt, x, y, n = 7, cor = '#3A3A44') {
  let s = '';
  for (let i = 0; i < n; i++) {
    const k = ((lt * 0.12 + i / n) % 1);
    const cx = x + Math.sin(i * 2.3 + lt) * 80, cy = y - k * 520, r = 70 + k * 150;
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${cor}" opacity="${0.55 * (1 - k)}"/>`;
  }
  return s;
}
// Corredor da escola (fogo opcional no fundo)
function corredor(lt, o = {}) {
  let s = `<rect width="${EW}" height="${EH}" fill="#2A3350"/>`;
  s += `<polygon points="0,0 ${EW},0 1200,300 720,300" fill="#1B2236"/>`;
  for (const [x, y, w] of [[220, 40, 260], [640, 90, 110], [980, 90, 110], [1400, 40, 260]]) s += `<rect x="${x}" y="${y}" width="${w}" height="14" fill="#FFF6D8" opacity="${o.luz ?? 1}"/>`;
  s += `<polygon points="0,120 720,300 720,620 0,${EH}" fill="#33466E"/><polygon points="${EW},120 1200,300 1200,620 ${EW},${EH}" fill="#33466E"/>`;
  s += armarios();
  s += `<rect x="720" y="300" width="480" height="320" fill="#222C48"/>`;
  s += `<rect x="880" y="380" width="160" height="240" fill="#2E3A5C" stroke="#111" stroke-width="5"/>`;
  s += `<polygon points="0,${EH} ${EW},${EH} 1200,620 720,620" fill="#5A4A44"/>`;
  s += `<line x1="0" y1="${EH - 40}" x2="${EW}" y2="${EH - 40}" stroke="#776660" stroke-width="3" opacity="0.5"/>`;
  if (o.fogo) {
    s += `<rect x="720" y="300" width="480" height="320" fill="#FF8A3A" opacity="${0.25 + 0.1 * Math.sin(lt * 5)}"/>`;
    s += fogo(lt, 760, 380, 400, 240, o.fogo);
    s += fogo(lt, 1380, 430, 260, 170, o.fogo * 0.8);
    s += fumaca(lt, 960, 300, 8, '#4A4048');
  }
  if (o.escuro) s += `<rect width="${EW}" height="${EH}" fill="#000" opacity="${o.escuro}"/>`;
  return s;
}
// Sala de química em chamas
function laboratorio(lt, fogoK = 1) {
  let s = `<rect width="${EW}" height="${EH}" fill="#C9D2DE"/>`;
  for (let i = 0; i < 12; i++) for (let j = 0; j < 6; j++) s += `<rect x="${i * 170}" y="${j * 90}" width="168" height="88" fill="#D8E0EA" opacity="0.6"/>`;
  s += `<rect x="0" y="720" width="${EW}" height="360" fill="#6A5A50"/><rect x="0" y="700" width="${EW}" height="28" fill="#4A3A34"/>`;
  s += `<rect x="180" y="560" width="1560" height="150" fill="#8A6A4A" stroke="#4A3220" stroke-width="6"/>`;
  s += `<rect x="180" y="540" width="1560" height="30" fill="#A8845A" stroke="#4A3220" stroke-width="5"/>`;
  s += `<path d="M 540 560 L 540 380 L 620 380 L 620 560 Z" fill="#B8E4F0" opacity="0.7" stroke="#2A6A80" stroke-width="6"/>`;
  s += `<path d="M 1240 560 L 1240 380 L 1320 380 L 1320 560 Z" fill="#B8E4F0" opacity="0.7" stroke="#2A6A80" stroke-width="6"/>`;
  s += `<path d="M 1000 560 Q 990 500 1010 470 L 1040 470 Q 1060 500 1050 560 Z" fill="#E8F4FF" stroke="#2A6A80" stroke-width="5"/>`;
  s += fogo(lt, 760, 380, 460, 200, fogoK);
  s += fumaca(lt, 980, 400, 9, '#3A3A44');
  return s;
}
// Pátio noturno com caminhão de bombeiros
function patio(lt, o = {}) {
  let s = `<rect width="${EW}" height="${EH}" fill="#0C1230"/>`;
  for (let i = 0; i < 40; i++) { const r = aleatorio(i + 3); s += `<circle cx="${r() * EW}" cy="${r() * 420}" r="${1 + r() * 2}" fill="#FFF" opacity="${0.3 + 0.5 * Math.abs(Math.sin(lt + i))}"/>`; }
  s += `<rect x="0" y="260" width="${EW}" height="560" fill="#2B2F45"/>`;
  for (let i = 0; i < 16; i++) for (let j = 0; j < 3; j++) {
    const lit = (i * 7 + j * 3) % 5 !== 0;
    s += `<rect x="${60 + i * 118}" y="${320 + j * 110}" width="60" height="70" fill="${o.fogo && i > 5 && i < 11 && j < 2 ? '#FF8A3A' : (lit ? '#FFE49A' : '#1A2038')}"/>`;
  }
  if (o.fogo) s += fogo(lt, 700, 540, 520, 300, o.fogo) + fumaca(lt, 960, 520, 8, '#3A3A44');
  s += `<rect x="0" y="820" width="${EW}" height="260" fill="#1E3A2A"/><rect x="0" y="812" width="${EW}" height="16" fill="#4A4A55"/>`;
  // caminhão de bombeiros
  s += `<g transform="translate(1440 640) scale(0.78)"><rect x="0" y="120" width="420" height="200" rx="18" fill="#D7262B" stroke="#111" stroke-width="6"/><rect x="300" y="60" width="130" height="260" rx="20" fill="#D7262B" stroke="#111" stroke-width="6"/><rect x="330" y="90" width="80" height="80" rx="10" fill="#9ADCFF" stroke="#111" stroke-width="4"/><circle cx="80" cy="330" r="50" fill="#222"/><circle cx="330" cy="330" r="50" fill="#222"/><circle cx="210" cy="330" r="50" fill="#222"/>`;
  const piscar = Math.sin(lt * 12) > 0;
  s += `<rect x="150" y="96" width="110" height="26" rx="10" fill="${piscar ? '#FF3040' : '#3A6AFF'}"/><rect x="170" y="56" width="70" height="20" rx="8" fill="${piscar ? '#3A6AFF' : '#FF3040'}"/></g>`;
  if (o.escuro) s += `<rect width="${EW}" height="${EH}" fill="#000" opacity="${o.escuro}"/>`;
  return s;
}
// Corredor do fundo (ou pátio) com ajuste de câmera: cena simples de texto
function escuro(o) { return o > 0.001 ? `<rect width="${EW}" height="${EH}" fill="#000" opacity="${o}"/>` : ''; }

// ---------- cenários extras (mesma assinatura: (lt, o) com o.fogo opcional) ----------
// Sala de aula: lousa, carteiras, janela
function sala(lt, o = {}) {
  let s = `<rect width="${EW}" height="${EH}" fill="#E8E0C8"/>`;
  s += `<rect x="0" y="0" width="${EW}" height="120" fill="#D8CCA8"/>`;
  s += `<rect x="560" y="140" width="800" height="300" rx="10" fill="#2E4A3A" stroke="#6A4A2A" stroke-width="20"/>`;
  s += `<line x1="640" y1="260" x2="1000" y2="260" stroke="#E8F0E0" stroke-width="5" opacity="0.6"/><line x1="640" y1="320" x2="900" y2="320" stroke="#E8F0E0" stroke-width="5" opacity="0.6"/>`;
  s += `<rect x="1500" y="140" width="300" height="360" fill="#A8D8F0" stroke="#6A4A2A" stroke-width="14"/><line x1="1650" y1="140" x2="1650" y2="500" stroke="#6A4A2A" stroke-width="10"/>`;
  s += `<polygon points="0,${EH} ${EW},${EH} ${EW},700 0,700" fill="#C8B090"/><line x1="0" y1="700" x2="${EW}" y2="700" stroke="#A89070" stroke-width="6"/>`;
  for (const x of [200, 420, 1250]) s += `<rect x="${x}" y="760" width="260" height="22" rx="6" fill="#8A6A4A" stroke="#3A2A1A" stroke-width="5"/><rect x="${x + 110}" y="782" width="20" height="120" fill="#3A2A1A"/>`;
  if (o.fogo) s += `<rect x="1500" y="140" width="300" height="360" fill="#FF8A3A" opacity="${0.35 * o.fogo}"/>` + fumaca(lt, 1650, 200, 6, '#4A4048');
  return s;
}
// Escada de emergência: degraus subindo e corrimão
function escada(lt, o = {}) {
  let s = `<rect width="${EW}" height="${EH}" fill="#2A3350"/>`;
  s += `<rect x="0" y="0" width="${EW}" height="260" fill="#1B2236"/>`;
  for (let i = 0; i < 9; i++) s += `<polygon points="${200 + i * 60},${980 - i * 70} ${1700 - i * 60},${980 - i * 70} ${1700 - i * 60},${1040 - i * 70} ${200 + i * 60},${1040 - i * 70}" fill="#6A6A78" stroke="#3A3A48" stroke-width="5"/>`;
  s += `<line x1="180" y1="980" x2="1000" y2="360" stroke="#B0B8C8" stroke-width="12"/><line x1="180" y1="1040" x2="1000" y2="420" stroke="#B0B8C8" stroke-width="12"/>`;
  s += `<rect x="1500" y="120" width="260" height="110" rx="10" fill="#2AAA5A" stroke="#111" stroke-width="6"/><text x="1630" y="190" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="54" fill="#FFF">SAÍDA</text>`;
  if (o.fogo) s += fumaca(lt, 1000, 200, 6, '#4A4048') + fogo(lt, 1200, 320, 300, 170, o.fogo * 0.6);
  return s;
}
// Auditório: palco com cortina vermelha
function auditorio(lt, o = {}) {
  let s = `<rect width="${EW}" height="${EH}" fill="#1A1420"/>`;
  s += `<rect x="260" y="180" width="1400" height="560" fill="#2A1A24"/>`;
  s += `<polygon points="0,0 380,0 420,900 0,900" fill="#8A1A2A"/><polygon points="${EW},0 ${EW - 380},0 ${EW - 420},900 ${EW},900" fill="#8A1A2A"/>`;
  for (let i = 0; i < 6; i++) s += `<line x1="${60 + i * 60}" y1="0" x2="${80 + i * 60}" y2="900" stroke="#6A1020" stroke-width="10"/><line x1="${EW - 60 - i * 60}" y1="0" x2="${EW - 80 - i * 60}" y2="900" stroke="#6A1020" stroke-width="10"/>`;
  s += `<polygon points="260,740 1660,740 1760,1080 160,1080" fill="#6A4A2A"/>`;
  for (let i = 0; i < 6; i++) s += `<circle cx="${400 + i * 200}" cy="200" r="22" fill="#FFE8A0" opacity="${0.5 + 0.3 * Math.sin(lt * 3 + i)}"/>`;
  if (o.fogo) s += `<polygon points="0,0 380,0 420,900 0,900" fill="#FF7A1A" opacity="${0.3 * o.fogo}"/>` + fogo(lt, 0, 620, 380, 300, o.fogo * 0.7) + fumaca(lt, 960, 240, 6, '#3A3038');
  return s;
}
