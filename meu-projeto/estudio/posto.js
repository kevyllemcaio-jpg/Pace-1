// posto.js — cenários do posto de gasolina 24h (madrugada), em "mundo aberto":
// área das bombas (com carro chegando), loja vista do caixa (porta automática), corredor,
// câmera da loja. Personagens de corpo inteiro andando (kyleCorpo + andarP).

const TPo = '#15131A';

function andando(visual, t, x, y, esc, o = {}) {
  const anda = o.parado ? {} : andarP(t, o.vel || 8, 34);
  return kyleCorpo({ x, y, esc, t, expr: o.expr || 'neutro', pose: o.pose || 'base', fala: o.fala, olhar: o.olhar || [0, 0], vira: o.vira, barba: !!o.barba, celular: o.celular,
    p: { ...anda, ...(o.p || {}) }, visual: { oculos: false, fone: false, estampa: false, ...visual } });
}
function carroPosto(x, y, esc = 1, cor = '#2F6DB5', farol = true) {
  return `<g transform="translate(${x} ${y}) scale(${esc})">` +
    (farol ? `<polygon points="200,-60 700,-160 700,60" fill="#FFF2B0" opacity="0.25"/>` : '') +
    `<path d="M -210 -10 L -190 -80 Q -175 -100 -140 -100 L -60 -100 L -20 -150 Q -5 -162 30 -162 L 120 -162 Q 150 -160 170 -130 L 205 -85 Q 225 -80 225 -50 L 225 -10 Z" fill="${cor}" stroke="${TPo}" stroke-width="7"/>` +
    `<path d="M -10 -145 L 30 -150 L 115 -150 L 160 -100 L -45 -100 Z" fill="#9FC8E8" stroke="${TPo}" stroke-width="5"/><line x1="60" y1="-150" x2="60" y2="-100" stroke="${TPo}" stroke-width="5"/>` +
    [-125, 140].map((cx) => `<circle cx="${cx}" cy="-8" r="40" fill="#1A1A1E"/><circle cx="${cx}" cy="-8" r="16" fill="#9AA3AD"/>`).join('') +
    `<rect x="208" y="-78" width="18" height="16" rx="4" fill="#FFF2B0"/><rect x="-212" y="-70" width="12" height="16" rx="3" fill="#E8344B"/></g>`;
}
// Área externa: cobertura com luzes, bombas, loja ao fundo (vidro iluminado), pista.
function postoFora(t, { carroX = null, dentro = '', luz = 1 } = {}) {
  let s = `<defs><linearGradient id="ceuPo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A0E22"/><stop offset="1" stop-color="#2A3460"/></linearGradient>` +
    `<radialGradient id="luzCob" cx="0.5" cy="0" r="1"><stop offset="0" stop-color="#FFF6D8" stop-opacity="0.55"/><stop offset="1" stop-color="#FFF6D8" stop-opacity="0"/></radialGradient>` +
    `<clipPath id="vitrine"><rect x="200" y="760" width="680" height="320"/></clipPath></defs><rect width="1080" height="1920" fill="url(#ceuPo)"/>`;
  s += `<circle cx="860" cy="200" r="60" fill="#F4F1E0"/>`;
  for (let i = 0; i < 40; i++) { const r = aleatorio(i + 13); s += `<circle cx="${r() * 1080}" cy="${r() * 500}" r="${1 + r() * 2}" fill="#fff" opacity="${0.4 + 0.4 * Math.abs(Math.sin(t + i))}"/>`; }
  for (let i = 0; i < 12; i++) { const x = i * 100 - 20; s += `<path d="M ${x} 760 L ${x + 50} 520 L ${x + 100} 760 Z" fill="#0A1018"/>`; }
  // loja
  s += `<rect x="150" y="640" width="780" height="460" fill="#E8E2D6" stroke="${TPo}" stroke-width="8"/>`;
  s += `<rect x="150" y="640" width="780" height="100" fill="#C0392B"/><text x="540" y="712" text-anchor="middle" font-family="Anton, sans-serif" font-size="70" fill="#FFF6D8" opacity="${0.75 + 0.25 * Math.sin(t * 9) }">CONVENIÊNCIA 24H</text>`;
  s += `<rect x="200" y="760" width="680" height="320" fill="#FFF0C0" stroke="${TPo}" stroke-width="7"/>`;
  s += `<g clip-path="url(#vitrine)">` + [0, 1, 2, 3].map((i) => `<rect x="${220 + i * 170}" y="820" width="120" height="260" fill="#C8B890"/>` + [0, 1, 2].map((j) => `<rect x="${226 + i * 170}" y="${840 + j * 70}" width="108" height="10" fill="#8A7A5A"/>`).join('')).join('') + dentro + `</g>`;
  s += `<line x1="540" y1="760" x2="540" y2="1080" stroke="${TPo}" stroke-width="7"/>`;
  // cobertura
  s += `<rect x="-20" y="380" width="1120" height="90" fill="#F4F1E6" stroke="${TPo}" stroke-width="8"/><rect x="-20" y="430" width="1120" height="22" fill="#C0392B"/>`;
  for (let i = 0; i < 5; i++) s += `<rect x="${60 + i * 230}" y="470" width="120" height="14" rx="6" fill="#FFF6D8"/>`;
  s += `<polygon points="-20,484 1100,484 1300,1500 -220,1500" fill="url(#luzCob)" opacity="${luz}"/>`;
  s += `<rect x="120" y="470" width="30" height="760" fill="#D8D2C4" stroke="${TPo}" stroke-width="6"/><rect x="930" y="470" width="30" height="760" fill="#D8D2C4" stroke="${TPo}" stroke-width="6"/>`;
  // pista
  s += `<rect y="1100" width="1080" height="820" fill="#3A3A42"/>`;
  for (let x = -40; x < 1080; x += 200) s += `<rect x="${x}" y="1700" width="120" height="16" fill="#F2C230"/>`;
  // bombas
  for (const x of [300, 780]) s += `<rect x="${x - 70}" y="1060" width="140" height="240" rx="12" fill="#C0392B" stroke="${TPo}" stroke-width="7"/><rect x="${x - 50}" y="1090" width="100" height="70" rx="6" fill="#1A2A1A"/><text x="${x}" y="1138" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="32" fill="#6BEA8E">5,79</text><rect x="${x - 90}" y="1290" width="180" height="30" rx="6" fill="#8A8A90" stroke="${TPo}" stroke-width="5"/><path d="M ${x + 70} 1180 Q ${x + 120} 1210 ${x + 110} 1280" fill="none" stroke="${TPo}" stroke-width="12"/>`;
  if (carroX !== null) s += carroPosto(carroX, 1560, 1.0, '#2F6DB5');
  return s;
}
// Loja vista do caixa. abre: 0..1 (porta automática). pessoas: svg desenhado entre a porta e o balcão.
function lojaCaixa(t, { abre = 0, pessoas = '', fora = '', bilhete = false, luz = 1 } = {}) {
  let s = `<rect width="1080" height="1920" fill="#E8ECEF"/>`;
  s += `<rect width="1080" height="260" fill="#D8DDE2"/>` + [0, 1, 2].map((i) => `<rect x="${140 + i * 300}" y="160" width="200" height="22" rx="8" fill="#FFFFFF" opacity="${luz}"/>`).join('');
  // piso em perspectiva
  s += `<polygon points="0,1920 360,1100 720,1100 1080,1920" fill="#D0D4D8"/>`;
  for (let i = 1; i < 8; i++) s += `<line x1="${360 - i * 52}" y1="${1100 + i * 117}" x2="${720 + i * 52}" y2="${1100 + i * 117}" stroke="#B8BEC4" stroke-width="3"/>`;
  // porta automática ao fundo, com a área das bombas lá fora
  s += `<rect x="360" y="560" width="360" height="540" fill="#0E1430"/>`;
  s += `<svg x="360" y="560" width="360" height="540" overflow="hidden"><rect width="360" height="540" fill="#1A2448"/><rect y="0" width="360" height="40" fill="#F4F1E6"/><polygon points="0,40 360,40 460,540 -100,540" fill="#FFF6D8" opacity="0.18"/><rect x="40" y="300" width="70" height="140" fill="#C0392B"/><rect x="250" y="300" width="70" height="140" fill="#C0392B"/><rect y="440" width="360" height="100" fill="#3A3A42"/>${fora}</svg>`;
  const d = 180 * lim(abre);
  s += `<rect x="${360 - d}" y="560" width="180" height="540" fill="#BFE0F5" opacity="0.35" stroke="#8A9AA8" stroke-width="8"/><rect x="${540 + d}" y="560" width="180" height="540" fill="#BFE0F5" opacity="0.35" stroke="#8A9AA8" stroke-width="8"/>`;
  s += `<rect x="350" y="540" width="380" height="24" fill="#8A9AA8"/>`;
  // prateleiras em perspectiva (esquerda e direita)
  const cores = ['#E8344B', '#F2C230', '#2F6DB5', '#3BB273', '#E67E22', '#9B59B6'];
  for (const lado of [-1, 1]) {
    const xi = lado < 0 ? 0 : 1080, xf = lado < 0 ? 340 : 740;
    s += `<polygon points="${xi},300 ${xf},560 ${xf},1100 ${xi},1500" fill="${lado < 0 ? '#C8CDD2' : '#BFC4CA'}" stroke="${TPo}" stroke-width="6"/>`;
    for (let p = 0; p < 5; p++) {
      const k = p / 5, y1 = mix(340, 600, k) + p * 0, yA = 300 + p * 240, yB = 560 + p * 108;
      s += `<line x1="${xi}" y1="${yA}" x2="${xf}" y2="${yB}" stroke="#8A9096" stroke-width="6"/>`;
      for (let j = 0; j < 7; j++) { const kk = j / 7, x = mix(xi, xf, kk + 0.04), y = mix(yA, yB, kk + 0.04), h = mix(80, 36, kk); s += `<rect x="${x - (lado < 0 ? 0 : 30 * (1 - kk))}" y="${y - h}" width="${mix(36, 16, kk)}" height="${h}" rx="3" fill="${cores[(p + j) % 6]}"/>`; }
    }
  }
  // geladeira brilhando à direita
  s += `<polygon points="1080,700 900,800 900,1180 1080,1300" fill="#BFE6FF" opacity="0.35"/>`;
  s += pessoas;
  // balcão (primeiro plano) + caixa + bilhete
  s += `<path d="M -40 1440 L 1120 1440 L 1120 1920 L -40 1920 Z" fill="#C0392B" stroke="${TPo}" stroke-width="8"/><rect x="-40" y="1400" width="1160" height="60" fill="#9AA3AD" stroke="${TPo}" stroke-width="8"/>`;
  s += `<g transform="translate(830 1320)"><rect x="-120" y="-80" width="240" height="160" rx="12" fill="#22262F" stroke="${TPo}" stroke-width="7"/><rect x="-96" y="-60" width="192" height="70" rx="6" fill="#1A3A2A"/><text x="0" y="-12" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="38" fill="#6BEA8E">R$ 0,00</text></g>`;
  if (bilhete) s += `<g transform="translate(300 1390) rotate(-6)"><rect x="-160" y="-60" width="320" height="120" fill="#F2E7A8" stroke="${TPo}" stroke-width="5"/><text x="0" y="-8" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="40" fill="#8A1A1A">REGRAS DA</text><text x="0" y="34" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="40" fill="#8A1A1A">MADRUGADA</text></g>`;
  s += punho(260, 1820, 10) + punho(820, 1820, -10, true);
  if (luz < 1) s += `<rect width="1080" height="1920" fill="#000" opacity="${0.6 * (1 - luz)}"/>`;
  return s;
}
// Corredor da loja (vista lateral) com alguém andando.
function corredorLoja(t, pessoas = '') {
  let s = `<rect width="1080" height="1920" fill="#E8ECEF"/><rect width="1080" height="200" fill="#D8DDE2"/>`;
  const cores = ['#E8344B', '#F2C230', '#2F6DB5', '#3BB273', '#E67E22', '#9B59B6'];
  for (let p = 0; p < 6; p++) { const y = 300 + p * 190; s += `<rect x="0" y="${y + 150}" width="1080" height="22" fill="#8A9096"/>`; for (let x = 10; x < 1080; x += 62) s += `<rect x="${x}" y="${y + 50}" width="50" height="100" rx="5" fill="${cores[(p * 3 + x) % 6]}" stroke="${TPo}" stroke-width="3"/>`; }
  s += `<rect y="1460" width="1080" height="460" fill="#D0D4D8"/>`;
  return s + pessoas;
}
// Câmera de segurança da loja (vista de cima), com bonecos pequenos.
function camLoja(t, { hora = '03:33:12', figuras = '' } = {}) {
  let fig = `<rect x="0" y="0" width="860" height="1180" fill="#1E3A26"/>`;
  for (let i = 0; i < 3; i++) fig += `<rect x="${80 + i * 260}" y="200" width="120" height="560" fill="#2A5A36" stroke="#0E2014" stroke-width="5"/>`;
  fig += `<rect x="60" y="900" width="740" height="120" fill="#3A6A46" stroke="#0E2014" stroke-width="5"/><text x="430" y="975" text-anchor="middle" font-family="Oswald, sans-serif" font-size="40" fill="#9FE0B0">CAIXA</text>`;
  fig += `<rect x="340" y="1110" width="180" height="70" fill="#14301C"/>`;
  return monitorCam(t, { titulo: 'CAM 1 · LOJA', hora, cena: 'nenhuma', figura: fig + figuras });
}
