// lobo.js — peças da série "MARCA DA LUA" (original): floresta com profundidade e neblina,
// lanterna, lobisomem de corpo inteiro e em close, drone, marca de mordida, lua e andar.

// Floresta noturna em camadas. cam = deslocamento da câmera (parallax ao andar).
function floresta(t, { cam = 0, lua = true, neblina = 0.6, escuro = 0 } = {}) {
  let s = `<defs><linearGradient id="ceuF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070F"/><stop offset="1" stop-color="#18223A"/></linearGradient>` +
    `<radialGradient id="luaG" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#F4F1E0" stop-opacity="0.55"/><stop offset="1" stop-color="#F4F1E0" stop-opacity="0"/></radialGradient>` +
    `<filter id="nevoa"><feGaussianBlur stdDeviation="30"/></filter></defs><rect width="1080" height="1920" fill="url(#ceuF)"/>`;
  const r0 = aleatorio(3);
  for (let i = 0; i < 50; i++) s += `<circle cx="${r0() * 1080}" cy="${r0() * 700}" r="${0.8 + r0() * 2}" fill="#fff" opacity="${0.3 + 0.4 * Math.abs(Math.sin(t + i))}"/>`;
  if (lua) s += `<circle cx="760" cy="380" r="300" fill="url(#luaG)"/><circle cx="760" cy="380" r="110" fill="#F4F1E0"/><circle cx="730" cy="350" r="22" fill="#DCD8C2"/><circle cx="790" cy="420" r="14" fill="#DCD8C2"/>`;
  // 3 camadas de árvores (longe -> perto)
  const camada = (sem, esp, cor, larg, base, k, galhos) => {
    let c = '';
    const r = aleatorio(sem);
    const off = ((cam * k) % esp + esp) % esp;
    for (let x = -esp - off; x < 1080 + esp; x += esp) {
      const xx = x + r() * esp * 0.4, w = larg * (0.7 + r() * 0.6);
      c += `<path d="M ${xx - w / 2} 2000 L ${xx - w * 0.35} 0 L ${xx + w * 0.35} 0 L ${xx + w / 2} 2000 Z" fill="${cor}"/>`;
      if (galhos) for (let g = 0; g < 3; g++) { const gy = 300 + r() * 900, ld = r() > 0.5 ? 1 : -1; c += `<path d="M ${xx} ${gy} L ${xx + ld * (80 + r() * 120)} ${gy - 60 - r() * 80}" stroke="${cor}" stroke-width="${10 + r() * 10}" stroke-linecap="round"/>`; }
    }
    return c;
  };
  s += camada(11, 120, '#1C2840', 34, 0, 0.2, false);
  s += `<rect width="1080" height="1920" fill="#2A3A5A" opacity="0.25"/>`;
  s += camada(12, 230, '#111A2C', 60, 0, 0.5, true);
  s += `<rect y="1500" width="1080" height="420" fill="#0B1220"/><path d="M 300 1920 Q 520 1600 560 1500 L 620 1500 Q 700 1600 860 1920 Z" fill="#1A2234"/>`;
  // neblina rasteira
  if (neblina) for (let i = 0; i < 6; i++) { const x = ((i * 300 + t * 30 - cam * 0.6) % 1600 + 1600) % 1600 - 260; s += `<ellipse cx="${x}" cy="${1420 + (i % 3) * 90}" rx="380" ry="90" fill="#B8C8E8" opacity="${0.18 * neblina}" filter="url(#nevoa)"/>`; }
  s += camada(13, 520, '#05080F', 120, 0, 1.0, true);
  // vagalumes
  for (let i = 0; i < 10; i++) { const r = aleatorio(i + 40); s += `<circle cx="${(r() * 1080 + Math.sin(t + i) * 30)}" cy="${900 + r() * 600 + Math.cos(t * 1.3 + i) * 20}" r="4" fill="#E8FF9A" opacity="${0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i))}"/>`; }
  if (escuro) s += `<rect width="1080" height="1920" fill="#000" opacity="${escuro}"/>`;
  return s;
}
// Facho de lanterna saindo de (x, y) para um ângulo.
function lanterna(x, y, ang = -10, alcance = 900, abertura = 18, oscila = 0) {
  const a = ((ang + oscila) * Math.PI) / 180, w = (abertura * Math.PI) / 180;
  const p1 = [x + Math.cos(a - w) * alcance, y + Math.sin(a - w) * alcance], p2 = [x + Math.cos(a + w) * alcance, y + Math.sin(a + w) * alcance];
  return `<defs><radialGradient id="facho" cx="${x}" cy="${y}" r="${alcance}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFF6D0" stop-opacity="0.55"/><stop offset="1" stop-color="#FFF6D0" stop-opacity="0"/></radialGradient></defs>` +
    `<polygon points="${x},${y} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}" fill="url(#facho)"/>`;
}
// Parâmetros de pose para andar (usar em kyleCorpo p:).
function andarP(t, vel = 8, amp = 34) {
  const s = Math.sin(t * vel);
  return { peD: [70 + s * 40, -Math.max(0, s) * amp], peE: [-70 - s * 40, -Math.max(0, -s) * amp], maoD: [150 - s * 60, -330], maoE: [-150 - s * 60, -330], agach: Math.abs(s) * 8 };
}
function correrP(t) { return andarP(t, 16, 70); }

// Lobisomem de corpo inteiro (pés em x, y). ~ 1150 px de altura com esc = 1.
function lobisomem(x, y, esc = 1, t = 0, { olhos = '#D8E8FF', garras = false, rugindo = false } = {}) {
  const resp = Math.sin(t * 2.2) * 8;
  const pelo = (pts, cor) => `<path d="M ${pts.map((p) => p.join(' ')).join(' L ')} Z" fill="${cor}" stroke="#05060A" stroke-width="7" stroke-linejoin="round"/>`;
  let s = `<g transform="translate(${x} ${y}) scale(${esc})">`;
  s += `<ellipse cx="0" cy="0" rx="260" ry="34" fill="#000" opacity="0.4"/>`;
  // pernas (dobradas, tipo de lobo)
  s += pelo([[-150, -520], [-200, -300], [-120, -180], [-170, -20], [-90, 0], [-60, -160], [-100, -320], [-60, -500]], '#3A3640');
  s += pelo([[150, -520], [200, -300], [120, -180], [170, -20], [90, 0], [60, -160], [100, -320], [60, -500]], '#2E2A34');
  s += `<g transform="translate(0 ${resp})">`;
  // tronco peludo
  s += pelo([[-230, -900], [-270, -760], [-240, -720], [-260, -600], [-200, -560], [-180, -480], [-90, -470], [0, -440], [90, -470], [180, -480], [200, -560], [260, -600], [240, -720], [270, -760], [230, -900], [120, -960], [0, -950], [-120, -960]], '#45404C');
  s += `<path d="M -110 -880 Q 0 -820 110 -880 Q 90 -700 0 -640 Q -90 -700 -110 -880 Z" fill="#5A5462" opacity="0.8"/>`;
  // braços longos com garras
  for (const l of [-1, 1]) {
    s += pelo([[l * 220, -900], [l * 320, -760], [l * 340, -560], [l * 300, -380], [l * 260, -380], [l * 270, -560], [l * 240, -720], [l * 180, -860]], '#3A3640');
    for (let g = 0; g < 4; g++) s += `<path d="M ${l * (262 + g * 12)} -382 L ${l * (258 + g * 16)} ${-320 + (garras ? 10 : 0)} L ${l * (272 + g * 12)} -380 Z" fill="#E8E4D8" stroke="#05060A" stroke-width="4"/>`;
  }
  // cabeça de lobo
  s += `<g transform="translate(0 -1000)">`;
  s += pelo([[-150, -60], [-190, -230], [-110, -140], [-60, -170], [0, -160], [60, -170], [110, -140], [190, -230], [150, -60], [170, 30], [100, 90], [0, 110], [-100, 90], [-170, 30]], '#4E4856');
  s += `<path d="M -70 20 Q 0 0 70 20 L 50 150 Q 0 ${rugindo ? 230 : 180} -50 150 Z" fill="#5E5868" stroke="#05060A" stroke-width="7"/>`;
  s += `<ellipse cx="0" cy="40" rx="30" ry="18" fill="#05060A"/>`;
  if (rugindo) s += `<path d="M -46 130 Q 0 220 46 130 Z" fill="#5A0A14" stroke="#05060A" stroke-width="5"/>` + [-30, -12, 12, 30].map((xx) => `<path d="M ${xx - 6} 132 L ${xx} 160 L ${xx + 6} 132 Z" fill="#fff"/>`).join('');
  for (const l of [-1, 1]) s += `<path d="M ${l * 40} -40 L ${l * 110} -60 L ${l * 90} -20 Z" fill="${olhos}"/><path d="M ${l * 40} -40 L ${l * 110} -60 L ${l * 90} -20 Z" fill="${olhos}" filter="url(#brilhoLobo2)" opacity="0.9"/>`;
  s += `</g></g></g>`;
  return `<defs><filter id="brilhoLobo2" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="9"/></filter></defs>` + s;
}
// Close da cabeça do lobisomem (centro em x, y).
function loboClose(x, y, esc, t, { rugindo = true } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${esc}) translate(0 1000)">${lobisomem(0, 0, 1, t, { rugindo }).replace(/<ellipse cx="0" cy="0" rx="260"[^>]*>/, '')}</g>`;
}
// Tela do controle do drone com gravação granulada.
function telaDrone(t, { olhos = true, x = 540, y = 960 } = {}) {
  let s = `<g transform="translate(${x} ${y})"><rect x="-440" y="-330" width="880" height="660" rx="40" fill="#1A1C22" stroke="#000" stroke-width="10"/>`;
  s += `<svg x="-400" y="-290" width="800" height="560" overflow="hidden"><rect width="800" height="560" fill="#1E2A22"/>`;
  const r = aleatorio(Math.floor(t * 20));
  for (let i = 0; i < 6; i++) s += `<rect x="${i * 140 + r() * 30}" y="0" width="${40 + r() * 20}" height="560" fill="#14201A"/>`;
  for (let i = 0; i < 300; i++) s += `<rect x="${r() * 800}" y="${r() * 560}" width="3" height="3" fill="#9FBFA8" opacity="${r() * 0.5}"/>`;
  if (olhos) s += `<ellipse cx="350" cy="250" rx="16" ry="9" fill="#E8F4FF"/><ellipse cx="420" cy="250" rx="16" ry="9" fill="#E8F4FF"/><ellipse cx="385" cy="250" rx="90" ry="40" fill="#E8F4FF" opacity="0.15"/>`;
  s += `<text x="30" y="50" font-family="Oswald, sans-serif" font-weight="700" font-size="34" fill="#FF3040">● REC</text><text x="770" y="50" text-anchor="end" font-family="Oswald, sans-serif" font-size="30" fill="#fff">00:00:10</text></svg>`;
  return s + `</g>`;
}
function drone(x, y, esc = 1, t = 0, luz = true) {
  return `<g transform="translate(${x} ${y}) scale(${esc})"><rect x="-70" y="-24" width="140" height="48" rx="14" fill="#2A2E36" stroke="#000" stroke-width="5"/>` +
    [-1, 1].map((l) => `<line x1="${l * 60}" y1="0" x2="${l * 130}" y2="-30" stroke="#2A2E36" stroke-width="12"/><ellipse cx="${l * 130}" cy="-36" rx="50" ry="8" fill="#666" stroke="#000" stroke-width="3"/>`).join('') +
    (luz ? `<circle cx="0" cy="0" r="9" fill="#FF3040" opacity="${Math.sin(t * 6) > 0 ? 1 : 0.2}"/>` : '') + `</g>`;
}
// Calendário com a lua cheia marcada.
function calendarioLua(x, y, esc = 1) {
  let s = `<g transform="translate(${x} ${y}) scale(${esc})"><rect x="-200" y="-220" width="400" height="440" rx="18" fill="#FBFAF5" stroke="#1F1A24" stroke-width="8"/><rect x="-200" y="-220" width="400" height="80" rx="18" fill="#C33A3A"/>`;
  s += `<text x="0" y="-162" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="44" fill="#fff">OUTUBRO</text>`;
  for (let i = 0; i < 20; i++) { const cx = -160 + (i % 5) * 80, cy = -90 + Math.floor(i / 5) * 80; const lua = i === 17; s += lua ? `<circle cx="${cx}" cy="${cy}" r="30" fill="#F4F1E0" stroke="#C33A3A" stroke-width="6"/>` : `<text x="${cx}" y="${cy + 12}" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="30" fill="#555">${i + 1}</text>`; }
  return s + `</g>`;
}
