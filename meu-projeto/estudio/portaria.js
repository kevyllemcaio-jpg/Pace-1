// portaria.js — terror POV do porteiro da noite: guarita em olho-de-peixe, mesa, interfone,
// porta de vidro para a rua, mãos do protagonista, celular escuro com chats, monitor de câmera,
// selo "PARTE N" e relógio.

const PEL_M = '#C9946A';
const TR_P = '#15131A';

// Visitante do lado de fora do vidro (corpo inteiro).
function visitanteVidro(visual, t, o = {}) {
  return kyleCorpo({ x: o.x || 540, y: o.y || 1040, esc: o.esc || 0.62, pose: o.pose || 'base', expr: o.expr || 'neutro', t, fala: o.fala, olhar: o.olhar || [0, 0], barba: !!o.barba, p: o.p, visual: { oculos: false, fone: false, estampa: false, ...visual } });
}

// Guarita. o: { visitante (svg dentro do vidro), apto (número no visor do interfone), toca (interfone tocando),
//              maoD: 'interfone'|'livre'|'celular', luzRua, ruaVazia }
function guarita(t, o = {}) {
  const toca = o.toca && Math.sin(t * 14) > 0;
  let s = `<defs><clipPath id="vidro"><rect x="250" y="330" width="580" height="740"/></clipPath>` +
    `<radialGradient id="poste" cx="0.5" cy="0.1" r="0.7"><stop offset="0" stop-color="#FFE9A0" stop-opacity="0.55"/><stop offset="1" stop-color="#FFE9A0" stop-opacity="0"/></radialGradient></defs>`;
  // paredes (azul-acinzentado) com teto curvo (olho-de-peixe)
  s += `<rect width="1080" height="1920" fill="#5E6A86"/>`;
  s += `<path d="M -60 0 L 1140 0 L 1140 220 Q 540 120 -60 220 Z" fill="#3A4258"/><path d="M -60 220 Q 540 120 1140 220" fill="none" stroke="#2A3044" stroke-width="10"/>`;
  s += `<path d="M -60 1090 Q 540 1050 1140 1090 L 1140 1240 L -60 1240 Z" fill="#2E7A78"/>`;
  s += `<path d="M 160 240 Q 120 700 150 1100" fill="none" stroke="#4A5470" stroke-width="10"/><path d="M 920 240 Q 960 700 930 1100" fill="none" stroke="#4A5470" stroke-width="10"/>`;
  // porta de vidro + rua
  s += `<rect x="240" y="320" width="600" height="760" rx="6" fill="#2A3044"/>`;
  s += `<g clip-path="url(#vidro)"><rect x="250" y="330" width="580" height="740" fill="#1A2448"/>`;
  s += `<circle cx="380" cy="420" r="34" fill="#F4F1E0"/>`;
  for (let i = 0; i < 40; i++) { const r = aleatorio(i + 3); s += `<circle cx="${250 + r() * 580}" cy="${340 + r() * 300}" r="${1 + r() * 2}" fill="#fff" opacity="0.6"/>`; }
  { const r = aleatorio(9); let x = 250; while (x < 830) { const w = 50 + r() * 70, h = 140 + r() * 220; s += `<rect x="${x}" y="${920 - h}" width="${w}" height="${h}" fill="#26315E"/>`; for (let j = 0; j < 5; j++) if (r() > 0.45) s += `<rect x="${x + 8 + r() * (w - 20)}" y="${920 - h + 15 + r() * (h - 40)}" width="9" height="12" fill="#F2C55A"/>`; x += w + 6; } }
  s += `<rect x="250" y="920" width="580" height="150" fill="#3A3A42"/><rect x="250" y="980" width="580" height="12" fill="#C9A24A" opacity="0.6"/>`;
  s += `<rect x="690" y="560" width="10" height="400" fill="#141824"/><path d="M 695 560 Q 695 530 660 530" fill="none" stroke="#141824" stroke-width="8"/><circle cx="655" cy="540" r="12" fill="#FFE9A0"/>`;
  s += `<rect x="250" y="330" width="580" height="740" fill="url(#poste)" opacity="${o.luzRua ?? 1}"/>`;
  if (o.visitante) s += o.visitante;
  s += `<path d="M 300 360 L 380 360 L 300 700 Z" fill="#FFFFFF" opacity="0.08"/></g>`;
  s += `<rect x="536" y="320" width="8" height="760" fill="#2A3044"/><rect x="510" y="640" width="12" height="120" rx="6" fill="#B8B8C0"/><rect x="558" y="640" width="12" height="120" rx="6" fill="#B8B8C0"/>`;
  // relógio e mural
  s += `<g transform="translate(965 430)"><circle r="48" fill="#F4F1E6" stroke="${TR_P}" stroke-width="7"/><line x1="0" y1="0" x2="0" y2="-30" stroke="${TR_P}" stroke-width="6"/><line x1="0" y1="0" x2="${Math.cos(t * 0.5) * 22}" y2="${Math.sin(t * 0.5) * 22}" stroke="#C33A3A" stroke-width="4"/></g>`;
  s += `<g transform="translate(70 520) rotate(-4)"><rect x="-10" y="0" width="150" height="190" fill="#A8794A" stroke="${TR_P}" stroke-width="6"/><rect x="10" y="20" width="50" height="60" fill="#F4F1E6"/><rect x="72" y="30" width="50" height="50" fill="#F2D35A"/><rect x="20" y="100" width="90" height="60" fill="#F4F1E6"/></g>`;
  // mesa curva
  s += `<path d="M -80 1300 Q 540 1110 1160 1300 L 1160 1920 L -80 1920 Z" fill="#B8784A" stroke="${TR_P}" stroke-width="8"/>`;
  s += `<path d="M -80 1330 Q 540 1140 1160 1330" fill="none" stroke="#8A5630" stroke-width="10" opacity="0.6"/>`;
  // livro de ocorrências
  s += `<g transform="translate(260 1420) rotate(-8)"><rect x="-200" y="-120" width="400" height="240" rx="8" fill="#2F4A7A" stroke="${TR_P}" stroke-width="6"/><rect x="-185" y="-105" width="370" height="210" fill="#F4F1E6"/>` + [-60, -20, 20, 60].map((y) => `<line x1="-160" y1="${y}" x2="160" y2="${y}" stroke="#BFC8D8" stroke-width="4"/>`).join('') + `</g>`;
  // interfone
  s += `<g transform="translate(800 1300) rotate(-6)"><rect x="-170" y="-90" width="340" height="180" rx="16" fill="#22262F" stroke="${TR_P}" stroke-width="7"/>`;
  s += `<rect x="-140" y="-70" width="120" height="50" rx="6" fill="${toca ? '#3A0A10' : '#0A1A10'}"/><text x="-80" y="-34" text-anchor="middle" font-family="Anton, sans-serif" font-size="38" fill="${toca ? '#FF4050' : '#3BD16F'}">${o.apto || '----'}</text>`;
  for (let i = 0; i < 12; i++) s += `<rect x="${10 + (i % 4) * 36}" y="${-66 + Math.floor(i / 4) * 40}" width="28" height="30" rx="5" fill="#3A3F4A"/>`;
  if (toca) s += `<circle cx="140" cy="-70" r="12" fill="#FF4050"/>`;
  s += `</g>`;
  // mãos
  const m = o.maoD || 'livre';
  s += punho(300, 1790, 10);
  if (m === 'interfone') s += fone(780, 1600, -18, t);
  else if (m === 'livre') s += punho(800, 1790, -10, true);
  return s;
}
function punho(x, y, rot, espelho = false) {
  const k = espelho ? -1 : 1;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k} 1)"><path d="M -110 260 L -90 30 L 110 30 L 120 260 Z" fill="#2F4A7A" stroke="${TR_P}" stroke-width="8"/>` +
    `<rect x="-110" y="-110" width="220" height="160" rx="50" fill="${PEL_M}" stroke="${TR_P}" stroke-width="8"/>` +
    [-70, -24, 22, 68].map((dx) => `<rect x="${dx - 22}" y="-150" width="44" height="80" rx="20" fill="${PEL_M}" stroke="${TR_P}" stroke-width="7"/>`).join('') +
    `<path d="M -110 -40 Q -150 -10 -120 30" fill="${PEL_M}" stroke="${TR_P}" stroke-width="7"/></g>`;
}
// Fone do interfone na mão direita, com fio enrolado.
function fone(x, y, rot, t) {
  let fio = `M ${x - 60} ${y + 40}`;
  for (let i = 1; i <= 16; i++) fio += ` q ${i % 2 ? 26 : -26} -18 ${(i % 2 ? 6 : -6)} -32`;
  return `<path d="${fio}" fill="none" stroke="#111" stroke-width="6" transform="translate(-30 -420) rotate(8 ${x} ${y})"/>` +
    `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M -40 -360 Q -60 -400 -20 -420 L 50 -420 Q 80 -400 60 -360 L 40 120 Q 30 170 -20 170 Q -50 160 -50 120 Z" fill="#22262F" stroke="#000" stroke-width="8"/>` +
    [0, 1, 2, 3].map((i) => `<circle cx="${(i % 2) * 22}" cy="${-380 + Math.floor(i / 2) * 22}" r="5" fill="#555"/>`).join('') + `</g>` + punho(x + 30, y + 120, rot, true);
}
// Celular escuro na mão (chat). msgs: [{ nome, cor, txt, eu }]
function celularChat(t, { titulo, sub = 'online', msgs = [], fundo } = {}) {
  let s = fundo || `<defs><filter id="dsfP"><feGaussianBlur stdDeviation="10"/></filter></defs><g filter="url(#dsfP)">${guarita(t)}</g><rect width="1080" height="1920" fill="#000" opacity="0.35"/>`;
  s += `<g transform="translate(540 960) rotate(-5)"><rect x="-330" y="-640" width="660" height="1220" rx="60" fill="#0E0F14" stroke="#000" stroke-width="10"/><rect x="-306" y="-616" width="612" height="1172" rx="44" fill="#151922"/>`;
  s += `<rect x="-306" y="-560" width="612" height="120" fill="#1C2130"/><circle cx="-230" cy="-500" r="34" fill="#3A4258"/><text x="-180" y="-508" font-family="Oswald, sans-serif" font-weight="700" font-size="34" fill="#fff">${esc(titulo)}</text><text x="-180" y="-470" font-family="Oswald, sans-serif" font-size="24" fill="#8A93A8">${esc(sub)}</text>`;
  let y = 480 - msgs.length * 150;
  for (const m of msgs) {
    const linhas = []; let at = '';
    for (const w of m.txt.split(' ')) { if ((at + ' ' + w).trim().length > 24 && at) { linhas.push(at); at = w; } else at = (at + ' ' + w).trim(); }
    linhas.push(at);
    const h = 40 + linhas.length * 40 + (m.nome ? 34 : 0), w = 440, x0 = m.eu ? 280 - w : -280;
    s += `<rect x="${x0}" y="${y}" width="${w}" height="${h}" rx="20" fill="${m.eu ? '#1F6E4A' : '#232A38'}"/>`;
    if (m.nome) s += `<text x="${x0 + 22}" y="${y + 36}" font-family="Oswald, sans-serif" font-weight="700" font-size="26" fill="${m.cor || '#7FC3F0'}">${esc(m.nome)}</text>`;
    linhas.forEach((l, i) => (s += `<text x="${x0 + 22}" y="${y + (m.nome ? 74 : 46) + i * 40}" font-family="Oswald, sans-serif" font-size="32" fill="#EDEFF5">${esc(l)}</text>`));
    y += h + 22;
  }
  s += `</g>` + `<g transform="translate(180 1640) rotate(28)"><rect x="-40" y="-180" width="80" height="260" rx="40" fill="${PEL_M}" stroke="${TR_P}" stroke-width="8"/></g>` + punho(860, 1820, -14, true);
  return s;
}
// Monitor de câmera de segurança (verde). cena: 'escada'|'corredor'|'entrada'; figura: svg extra.
function monitorCam(t, { titulo = 'CAM 2 · ESCADA', hora = '00:15:10', cena = 'escada', figura = '' } = {}) {
  let s = `<rect width="1080" height="1920" fill="#0B0D10"/><rect x="70" y="200" width="940" height="1300" rx="40" fill="#1A1E24" stroke="#000" stroke-width="10"/>`;
  s += `<svg x="110" y="240" width="860" height="1180" overflow="hidden"><rect width="860" height="1180" fill="#16301E"/>`;
  if (cena === 'escada') {
    for (let i = 0; i < 12; i++) { const y = 1180 - i * 95, w = 860 - i * 50; s += `<rect x="${(860 - w) / 2}" y="${y - 95}" width="${w}" height="95" fill="${i % 2 ? '#2A5A36' : '#24502F'}" stroke="#0E2014" stroke-width="4"/>`; }
    s += `<path d="M 80 1180 L 330 0 M 780 1180 L 530 0" stroke="#3A7A4A" stroke-width="10"/>`;
  } else {
    s += `<polygon points="0,0 300,420 300,820 0,1180" fill="#24502F"/><polygon points="860,0 560,420 560,820 860,1180" fill="#24502F"/><polygon points="0,1180 300,820 560,820 860,1180" fill="#2A5A36"/><rect x="300" y="420" width="260" height="400" fill="#1C3A24"/><rect x="380" y="560" width="100" height="260" fill="#14301C"/>`;
    s += `<ellipse cx="430" cy="120" rx="120" ry="24" fill="#9FE0B0" opacity="0.7"/>`;
  }
  s += figura;
  for (let y = 0; y < 1180; y += 6) s += `<rect y="${y}" width="860" height="2" fill="#000" opacity="0.18"/>`;
  const r = aleatorio(Math.floor(t * 20));
  for (let i = 0; i < 140; i++) s += `<rect x="${r() * 860}" y="${r() * 1180}" width="3" height="3" fill="#BFFFD0" opacity="${r() * 0.4}"/>`;
  s += `<rect x="20" y="20" width="${titulo.length * 19 + 30}" height="56" rx="6" fill="#0B1A10"/><text x="36" y="60" font-family="Oswald, sans-serif" font-weight="700" font-size="34" fill="#DFFFE6">${esc(titulo)}</text>`;
  s += `<text x="740" y="60" font-family="Oswald, sans-serif" font-weight="700" font-size="34" fill="#DFFFE6">REC</text><circle cx="826" cy="48" r="12" fill="#FF3040" opacity="${Math.sin(t * 6) > 0 ? 1 : 0.2}"/>`;
  s += `<rect x="620" y="90" width="220" height="50" rx="6" fill="#0B1A10"/><text x="730" y="127" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="32" fill="#DFFFE6">${hora}</text></svg>`;
  s += `<circle cx="540" cy="1460" r="8" fill="#3BD16F"/><rect x="460" y="1500" width="160" height="300" fill="#1A1E24"/>`;
  return s;
}
// Selo "PARTE N" e relógio no topo.
function hudPOV(parte, hora) {
  return `<g transform="translate(140 130) rotate(-4)"><rect x="-110" y="-44" width="220" height="88" rx="10" fill="#D7262B" stroke="#fff" stroke-width="5"/><text x="0" y="16" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="50" fill="#fff">PARTE ${parte}</text></g>` +
    `<rect x="840" y="96" width="180" height="70" rx="12" fill="#0E0F14" stroke="#3A3F4A" stroke-width="3"/><text x="930" y="146" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="44" fill="#fff">${hora}</text>`;
}
