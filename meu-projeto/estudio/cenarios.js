// Cenários da série (1080 x 1920). Cada função devolve o SVG do fundo.
// Chão padrão: y ≈ 1440–1920; personagens com pés em y ≈ 1760.

const CORES_PREDIOS = ['#E98AA6', '#F0C75E', '#7FC3D9', '#9AD37E', '#C98AD9', '#F29B6B', '#8FB3E8', '#F2E07A'];

function ceu(cima, baixo, id) {
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cima}"/><stop offset="1" stop-color="${baixo}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#${id})"/>`;
}

// Fileira de casinhas coloridas (morro de Salvador) — sempre igual para a mesma semente.
function casario(x0, x1, base, { semente = 3, alt = [70, 230], escuro = 0, janelas = true } = {}) {
  const r = aleatorio(semente);
  let s = '', x = x0;
  while (x < x1) {
    const w = 60 + r() * 70, h = alt[0] + r() * (alt[1] - alt[0]);
    const cor = CORES_PREDIOS[Math.floor(r() * CORES_PREDIOS.length)];
    s += `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${cor}" stroke="#2A2A2A" stroke-width="2.5"/>`;
    if (janelas) {
      for (let jy = base - h + 18; jy < base - 30; jy += 44)
        for (let jx = x + 12; jx < x + w - 22; jx += 30)
          if (r() > 0.35) s += `<rect x="${jx}" y="${jy}" width="14" height="18" fill="${escuro ? '#FFE9A0' : '#3E4A66'}" opacity="${escuro ? 0.9 : 0.55}"/>`;
    }
    x += w - 4;
  }
  if (escuro) s = `<g opacity="${1 - escuro * 0.35}">${s}</g>`;
  return s;
}

function janela(x, y, w, h, { noite = true, por = false, t = 0, semente = 5 } = {}) {
  let ceuJ = noite ? '#1E2C5E' : por ? '#F2A65A' : '#8CCBF0';
  let s = `<rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" fill="#8A5A3C" stroke="#2A2A2A" stroke-width="4"/>`;
  s += `<svg x="${x}" y="${y}" width="${w}" height="${h}" overflow="hidden"><rect width="${w}" height="${h}" fill="${ceuJ}"/>`;
  if (noite) s += `<circle cx="${w * 0.75}" cy="${h * 0.2}" r="${w * 0.08}" fill="#F3EDD3"/>`;
  else if (por) s += `<circle cx="${w * 0.5}" cy="${h * 0.62}" r="${w * 0.16}" fill="#FFE2A6"/>`;
  else s += `<circle cx="${w * 0.8}" cy="${h * 0.22}" r="${w * 0.08}" fill="#FFE066"/>`;
  s += casario(-10, w + 10, h + 4, { semente, alt: [h * 0.3, h * 0.75], escuro: noite ? 0.6 : 0 });
  s += `</svg>`;
  s += `<rect x="${x + w / 2 - 5}" y="${y}" width="10" height="${h}" fill="#8A5A3C" stroke="#2A2A2A" stroke-width="3"/>`;
  s += `<rect x="${x}" y="${y + h * 0.45}" width="${w}" height="10" fill="#8A5A3C" stroke="#2A2A2A" stroke-width="3"/>`;
  return s;
}

function lampada(x, y0, y, t, acesa = true) {
  const bal = Math.sin(t * 1.6) * 3;
  return `<g transform="rotate(${bal} ${x} ${y0})"><line x1="${x}" y1="${y0}" x2="${x}" y2="${y}" stroke="#2A2A2A" stroke-width="3"/>` +
    `<path d="M ${x - 44} ${y + 34} L ${x - 20} ${y} L ${x + 20} ${y} L ${x + 44} ${y + 34} Z" fill="#4E8F6A" stroke="#2A2A2A" stroke-width="4"/>` +
    `<circle cx="${x}" cy="${y + 40}" r="12" fill="${acesa ? '#FFF2B0' : '#ddd'}"/></g>`;
}

function cartaz(x, y, linhas, rot = -2) {
  let s = `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-90" y="-110" width="180" height="230" fill="#EADFC2" stroke="#2A2A2A" stroke-width="4"/>` +
    `<rect x="-24" y="-124" width="48" height="22" fill="#C9C2B0" opacity="0.9"/>`;
  linhas.forEach(([t, cor], i) => (s += txt(t, 0, -48 + i * 66, { tam: 56, cor })));
  return s + `</g>`;
}

// ---------- QUARTO (noite) ----------
function quarto(t, { luz = 1 } = {}) {
  let s = `<rect width="1080" height="1920" fill="#4B5B8F"/>`;
  s += `<rect y="1460" width="1080" height="460" fill="#3A4670"/><rect y="1452" width="1080" height="16" fill="#2E3860"/>`;
  s += janela(560, 300, 380, 520, { noite: true, semente: 8 });
  // cortina
  s += `<path d="M 520 270 L 600 270 Q 590 600 610 880 L 540 880 Q 520 600 520 270 Z" fill="#C94848" stroke="#2A2A2A" stroke-width="4"/>`;
  s += `<rect x="500" y="262" width="480" height="14" rx="6" fill="#5A3A28"/>`;
  s += cartaz(250, 520, [['META:', '#C33A3A'], ['SAIR', '#2A2A2A'], ['RICO', '#2A2A2A']]);
  // prateleira com livros
  s += `<rect x="90" y="830" width="330" height="18" fill="#7A4E32" stroke="#2A2A2A" stroke-width="3"/>`;
  [['#E0B23A', 40, 90], ['#3BB273', 34, 100], ['#2F6DB5', 30, 84], ['#C04A8E', 38, 96], ['#E06A3A', 30, 70]].forEach(([c, w, h], i, a) => {
    const x = 110 + a.slice(0, i).reduce((acc, b) => acc + b[1] + 4, 0);
    s += `<rect x="${x}" y="${830 - h}" width="${w}" height="${h}" fill="${c}" stroke="#2A2A2A" stroke-width="3"/>`;
  });
  // cama
  s += `<rect x="-20" y="1560" width="420" height="110" rx="20" fill="#7E8DB8" stroke="#2A2A2A" stroke-width="4"/>` +
    `<rect x="20" y="1520" width="170" height="70" rx="26" fill="#DDE3F2" stroke="#2A2A2A" stroke-width="4"/>`;
  // rachadura na parede
  s += `<path d="M 1040 980 L 1010 1030 L 1030 1060 L 1000 1120" fill="none" stroke="#2E3860" stroke-width="4"/>`;
  if (luz < 1) s += `<rect width="1080" height="1920" fill="#0B1030" opacity="${1 - luz}"/>`;
  return s;
}

// ---------- COZINHA ----------
function cozinha(t, { noite = true, mesa = true, vapor = true } = {}) {
  let s = `<rect width="1080" height="1920" fill="#C9BFAE"/>`;
  s += janela(380, 230, 260, 330, { noite, semente: 4 });
  // azulejos
  s += `<rect y="800" width="1080" height="480" fill="#DCE8F2"/>`;
  for (let y = 800; y < 1280; y += 60) for (let x = (y / 60) % 2 ? 30 : 0; x < 1080; x += 60)
    s += `<path d="M ${x} ${y + 18} L ${x + 12} ${y + 30} L ${x} ${y + 42} L ${x - 12} ${y + 30} Z" fill="#9DBBD6"/>`;
  // bancada e pia
  s += `<rect x="40" y="1050" width="520" height="300" fill="#ECEAE4" stroke="#2A2A2A" stroke-width="4"/>` +
    `<rect x="30" y="1030" width="540" height="28" fill="#F8F7F3" stroke="#2A2A2A" stroke-width="4"/>` +
    `<line x1="300" y1="1060" x2="300" y2="1350" stroke="#2A2A2A" stroke-width="3"/>` +
    `<path d="M 230 1030 L 230 960 Q 230 940 260 940 L 280 940" fill="none" stroke="#9A9A9A" stroke-width="10"/>`;
  // fogão + panela
  s += `<rect x="690" y="1040" width="330" height="310" fill="#F1F1EE" stroke="#2A2A2A" stroke-width="4"/>` +
    `<rect x="720" y="1120" width="270" height="200" rx="8" fill="#2E2E2E" stroke="#2A2A2A" stroke-width="4"/>` +
    [760, 820, 880, 940].map((x) => `<circle cx="${x}" cy="1076" r="12" fill="#3A3A3A"/>`).join('') +
    `<rect x="740" y="960" width="200" height="80" rx="10" fill="#9EA3A8" stroke="#2A2A2A" stroke-width="4"/>` +
    `<rect x="720" y="950" width="240" height="18" rx="9" fill="#878C91" stroke="#2A2A2A" stroke-width="4"/>`;
  if (vapor) for (let i = 0; i < 3; i++) {
    const k = ((t * 0.5 + i / 3) % 1);
    s += `<circle cx="${820 + i * 30 + Math.sin(t * 2 + i) * 10}" cy="${930 - k * 160}" r="${14 + k * 16}" fill="#fff" opacity="${0.5 * (1 - k)}"/>`;
  }
  // porta escura à esquerda (de onde o Theo espia)
  s += `<rect x="-10" y="560" width="120" height="900" fill="#2C3346" stroke="#2A2A2A" stroke-width="4"/><rect x="104" y="560" width="22" height="900" fill="#6B4A32" stroke="#2A2A2A" stroke-width="4"/>`;
  // piso xadrez
  s += `<rect y="1350" width="1080" height="570" fill="#BDBDBD"/>`;
  for (let y = 1350; y < 1920; y += 70) for (let x = ((y - 1350) / 70) % 2 ? 70 : 0; x < 1080; x += 140)
    s += `<rect x="${x}" y="${y}" width="70" height="70" fill="#A3A3A3"/>`;
  s += lampada(540, 0, 640, t);
  if (noite) s += `<rect width="1080" height="1920" fill="#14183A" opacity="0.32"/>`;
  return s;
}
// Mesa com toalha xadrez (desenhada na frente dos personagens).
function mesaCozinha(x = 540, y = 1420, w = 700) {
  let s = `<rect x="${x - w / 2 + 40}" y="${y}" width="26" height="330" fill="#5E3F27" stroke="#2A2A2A" stroke-width="4"/>` +
    `<rect x="${x + w / 2 - 66}" y="${y}" width="26" height="330" fill="#5E3F27" stroke="#2A2A2A" stroke-width="4"/>` +
    `<rect x="${x - w / 2}" y="${y - 20}" width="${w}" height="50" fill="#6B4A2E" stroke="#2A2A2A" stroke-width="4"/>`;
  s += `<rect x="${x - w / 2}" y="${y - 44}" width="${w}" height="34" fill="#fff" stroke="#2A2A2A" stroke-width="4"/>`;
  for (let i = 0; i < w / 28; i++) s += `<rect x="${x - w / 2 + i * 28}" y="${y - 44 + (i % 2) * 17}" width="14" height="17" fill="#D9473F" opacity="0.85"/>`;
  return s;
}

// ---------- PÁTIO DO COLÉGIO (dia) ----------
function patio(t, { cantina = true, tarde = 0 } = {}) {
  let s = ceu('#7DBDE8', '#CFE8F5', 'ceuPatio');
  s += `<circle cx="120" cy="330" r="130" fill="#5DAA5A" stroke="#2A2A2A" stroke-width="4"/><circle cx="260" cy="260" r="110" fill="#6BBA66" stroke="#2A2A2A" stroke-width="4"/>`;
  s += `<rect y="420" width="1080" height="820" fill="#F2E5BE" stroke="#2A2A2A" stroke-width="4"/>`;
  s += `<rect y="1120" width="1080" height="130" fill="#2F8F6B"/>`;
  s += txt('COLÉGIO ESTADUAL', 60, 560, { tam: 64, cor: '#2F5F9E', anc: 'start' });
  // mural
  s += `<rect x="60" y="650" width="380" height="290" fill="#FBF8EE" stroke="#2A2A2A" stroke-width="4"/>` + txt('MURAL', 250, 705, { tam: 38, cor: '#C33A3A' }) +
    `<rect x="90" y="730" width="110" height="70" fill="#F5C04A"/><rect x="220" y="730" width="110" height="70" fill="#7DC6E8"/><rect x="110" y="820" width="120" height="80" fill="#F29B6B"/><rect x="250" y="820" width="140" height="80" fill="#C8A8E8"/>`;
  if (cantina) {
    s += `<rect x="620" y="700" width="400" height="90" rx="10" fill="#C8302F" stroke="#2A2A2A" stroke-width="4"/>` + txt('CANTINA', 820, 770, { tam: 62, cor: '#fff' });
    s += `<rect x="640" y="790" width="360" height="380" fill="#3A2F2F" stroke="#2A2A2A" stroke-width="4"/>`;
    const r = aleatorio(9);
    for (let y = 820; y < 1120; y += 70) for (let x = 665; x < 980; x += 62)
      s += `<rect x="${x}" y="${y}" width="40" height="40" rx="5" fill="${CORES_PREDIOS[Math.floor(r() * 8)]}"/>`;
    s += `<rect x="610" y="1160" width="420" height="36" fill="#7A4E32" stroke="#2A2A2A" stroke-width="4"/>`;
  }
  s += `<rect y="1240" width="1080" height="680" fill="#D9D5CC"/>`;
  for (let y = 1240; y < 1920; y += 90) s += `<line x1="0" y1="${y}" x2="1080" y2="${y}" stroke="#C4BFB4" stroke-width="3"/>`;
  for (let x = 0; x < 1080; x += 135) s += `<line x1="${x}" y1="1240" x2="${x}" y2="1920" stroke="#C4BFB4" stroke-width="3"/>`;
  if (tarde) s += `<rect width="1080" height="1920" fill="#E07A2E" opacity="${0.25 * tarde}"/>`;
  return s;
}

// ---------- FACHADA DO COLÉGIO (calor, mar ao fundo) ----------
function fachada(t) {
  let s = ceu('#6FB8EC', '#D6EEF8', 'ceuFach');
  const giro = t * 12;
  s += `<g transform="translate(760 360) rotate(${giro})">` +
    Array.from({ length: 12 }, (_, i) => `<rect x="-6" y="-210" width="12" height="60" rx="6" fill="#F7C531" transform="rotate(${i * 30})"/>`).join('') +
    `</g><circle cx="760" cy="360" r="130" fill="#FFD43B" stroke="#E0A800" stroke-width="5"/>`;
  s += `<rect y="1000" width="1080" height="120" fill="#3AA0C8"/>`;
  s += casario(-20, 360, 1060, { semente: 21, alt: [80, 200] });
  // coqueiro
  s += `<path d="M 930 1500 Q 900 1200 960 1000" fill="none" stroke="#2A2A2A" stroke-width="40" stroke-linecap="round"/><path d="M 930 1500 Q 900 1200 960 1000" fill="none" stroke="#8A6239" stroke-width="30" stroke-linecap="round"/>`;
  for (let i = 0; i < 6; i++) {
    const a = -160 + i * 50 + Math.sin(t * 2 + i) * 4;
    s += `<path d="M 960 1000 q 80 -40 170 20 q -90 -10 -170 -20 Z" transform="rotate(${a} 960 1000)" fill="#3E9E4E" stroke="#2A2A2A" stroke-width="4"/>`;
  }
  // muro e placa
  s += `<rect y="1120" width="1080" height="420" fill="#F2E5BE" stroke="#2A2A2A" stroke-width="4"/>`;
  s += `<rect x="40" y="1150" width="620" height="100" rx="8" fill="#fff" stroke="#2A2A2A" stroke-width="4"/>` + txt('COLÉGIO ESTADUAL', 350, 1222, { tam: 64, cor: '#2F5F9E' });
  s += `<rect x="120" y="1280" width="460" height="260" fill="#AEB5BD" stroke="#2A2A2A" stroke-width="4"/>`;
  for (let x = 140; x < 580; x += 34) s += `<rect x="${x}" y="1280" width="10" height="260" fill="#6F7780"/>`;
  s += `<rect y="1540" width="1080" height="380" fill="#D9D0BC"/>`;
  // calor tremendo
  s += `<g opacity="0.25">` + [0, 1, 2].map((i) => `<path d="M ${200 + i * 300} ${900 + Math.sin(t * 3 + i) * 10} q 30 -30 0 -60 q -30 -30 0 -60" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`).join('') + `</g>`;
  return s;
}

// ---------- MERCADINHO DO BAIRRO ----------
function mercadinho(t) {
  let s = ceu('#7DBDE8', '#D2ECF7', 'ceuMerc');
  s += casario(-20, 1100, 540, { semente: 33, alt: [60, 200] });
  s += `<rect x="-10" y="560" width="110" height="900" fill="#E98AA6" stroke="#2A2A2A" stroke-width="4"/><rect x="980" y="560" width="110" height="900" fill="#7FA6D8" stroke="#2A2A2A" stroke-width="4"/>`;
  s += `<rect x="90" y="520" width="900" height="940" fill="#F2BF3A" stroke="#2A2A2A" stroke-width="4"/>`;
  s += `<rect x="130" y="560" width="820" height="150" rx="12" fill="#2F8F5B" stroke="#2A2A2A" stroke-width="4"/>` +
    txt('MERCADINHO', 540, 640, { tam: 76, cor: '#fff' }) + txt('DO BAIRRO', 540, 694, { tam: 42, cor: '#FFE38A', ls: 4 });
  // toldo
  for (let i = 0; i < 12; i++) {
    const x = 100 + i * 73.3;
    s += `<path d="M ${x} 730 L ${x + 73} 730 L ${x + 73} 770 Q ${x + 36} 810 ${x} 770 Z" fill="${i % 2 ? '#fff' : '#D9393E'}" stroke="#2A2A2A" stroke-width="3"/>`;
  }
  s += `<rect x="90" y="720" width="900" height="14" fill="#B32D2F"/>`;
  // janelas e porta com prateleiras
  for (const x of [140, 800]) s += `<rect x="${x}" y="880" width="140" height="170" fill="#8CC8EE" stroke="#2A2A2A" stroke-width="4"/><line x1="${x + 70}" y1="880" x2="${x + 70}" y2="1050" stroke="#2A2A2A" stroke-width="3"/><line x1="${x}" y1="965" x2="${x + 140}" y2="965" stroke="#2A2A2A" stroke-width="3"/>`;
  s += `<rect x="340" y="840" width="400" height="620" fill="#3A3A3E" stroke="#2A2A2A" stroke-width="4"/>`;
  const r = aleatorio(4);
  for (let y = 880; y < 1400; y += 110) {
    s += `<rect x="350" y="${y + 70}" width="380" height="10" fill="#777"/>`;
    for (let x = 362; x < 720; x += 46) s += `<rect x="${x}" y="${y + 18}" width="34" height="52" rx="4" fill="${CORES_PREDIOS[Math.floor(r() * 8)]}"/>`;
  }
  // caixote de frutas
  s += `<rect x="130" y="1340" width="170" height="110" fill="#B07A45" stroke="#2A2A2A" stroke-width="4"/>` +
    ['#F28C28', '#E8434F', '#F2C230', '#8BC34A'].map((c, i) => `<circle cx="${160 + i * 38}" cy="1330" r="24" fill="${c}" stroke="#2A2A2A" stroke-width="3"/>`).join('');
  s += `<rect y="1460" width="1080" height="460" fill="#D6D2C8"/><rect y="1460" width="1080" height="14" fill="#B9B4A8"/>`;
  return s;
}

// ---------- CORREDOR (fim de tarde) ----------
function corredor(t) {
  let s = `<rect width="1080" height="1920" fill="#D98C55"/>`;
  s += `<rect x="60" y="0" width="60" height="1500" fill="#C27645"/><rect x="960" y="0" width="60" height="1500" fill="#C27645"/>`;
  s += janela(560, 520, 300, 420, { noite: false, por: true, semente: 12 });
  s += `<rect x="190" y="640" width="200" height="160" fill="#B8865A" stroke="#2A2A2A" stroke-width="4"/><rect x="215" y="665" width="70" height="80" fill="#FBF6E6" transform="rotate(-6 250 700)"/><rect x="300" y="690" width="60" height="60" fill="#F5C04A"/>`;
  s += `<rect y="1500" width="1080" height="420" fill="#A9653C"/>`;
  s += `<path d="M 380 1500 L 860 1500 L 1080 1920 L 250 1920 Z" fill="#FFD08A" opacity="0.18"/>`;
  return s;
}

// ---------- PORTÃO DO COLÉGIO (rua, fim de tarde) ----------
function portao(t, { tarde = 0.5 } = {}) {
  let s = ceu(mix(0, 1, tarde) > 0.5 ? '#9DB8D8' : '#86C1E8', '#F2D6A8', 'ceuPort');
  s += casario(300, 1100, 1150, { semente: 41, alt: [160, 520] });
  s += `<rect x="300" y="1150" width="800" height="320" fill="#1E1E24"/>`;
  s += `<rect x="-10" y="980" width="420" height="500" fill="#F2E5BE" stroke="#2A2A2A" stroke-width="4"/>`;
  s += `<rect x="30" y="1010" width="340" height="70" rx="6" fill="#fff" stroke="#2A2A2A" stroke-width="4"/>` + txt('COLÉGIO ESTADUAL', 200, 1060, { tam: 40, cor: '#2F5F9E' });
  s += `<rect x="60" y="1110" width="300" height="370" fill="#9EA6AE" stroke="#2A2A2A" stroke-width="4"/>`;
  for (let x = 75; x < 360; x += 30) s += `<rect x="${x}" y="1110" width="9" height="370" fill="#5E666E"/>`;
  s += `<rect x="-10" y="1400" width="420" height="80" fill="#2F5FA8"/>`;
  s += `<rect y="1480" width="1080" height="150" fill="#CFC8B6"/>`;
  s += `<rect y="1630" width="1080" height="290" fill="#3A3A42"/>`;
  for (let x = -40; x < 1080; x += 180) s += `<rect x="${x + ((t * 30) % 0)}" y="1760" width="100" height="16" fill="#F2C230"/>`;
  s += `<rect width="1080" height="1920" fill="#E8833A" opacity="${0.12 * tarde}"/>`;
  return s;
}

// Carrinho de açaí da Dona Cida (com guarda-sol listrado).
function carrinhoAcai(x, y, t, esc = 1) {
  let s = `<g transform="translate(${x} ${y}) scale(${esc})">`;
  s += `<line x1="0" y1="-560" x2="0" y2="-200" stroke="#2A2A2A" stroke-width="12"/>`;
  const bal = Math.sin(t * 1.3) * 1.5;
  s += `<g transform="rotate(${bal} 0 -640)">`;
  for (let i = 0; i < 6; i++) {
    const x0 = -300 + i * 100, x1 = x0 + 100;
    s += `<path d="M 0 -660 L ${x0} -470 Q ${(x0 + x1) / 2} -440 ${x1} -470 Z" fill="${i % 2 ? '#F2C230' : '#7B2E9E'}" stroke="#2A2A2A" stroke-width="4" stroke-linejoin="round"/>`;
  }
  s += `</g>`;
  s += `</g>`;
  return s;
}
function balcaoAcai(x, y, esc = 1) {
  let s = `<g transform="translate(${x} ${y}) scale(${esc})">`;
  s += `<rect x="-230" y="-250" width="460" height="230" rx="16" fill="#E9ECEF" stroke="#2A2A2A" stroke-width="5"/>`;
  s += `<rect x="-230" y="-190" width="460" height="90" fill="#7B2E9E" stroke="#2A2A2A" stroke-width="4"/>` + txt('AÇAÍ DA CIDA', 0, -126, { tam: 58, cor: '#fff' });
  s += `<rect x="-120" y="-292" width="240" height="44" rx="10" fill="#4A1A63" stroke="#2A2A2A" stroke-width="4"/>`;
  for (const cx of [-160, 160]) s += `<circle cx="${cx}" cy="0" r="40" fill="#333" stroke="#2A2A2A" stroke-width="5"/><circle cx="${cx}" cy="0" r="14" fill="#999"/>`;
  return s + `</g>`;
}
