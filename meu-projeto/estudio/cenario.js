// Cenários reutilizáveis por todos os vídeos (céu, espaço, nuvens, avião, Terra...).

function gradiente(id, paradas) {
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${paradas
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join('')}</linearGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
}

function espaco(semente) {
  const r = aleatorio(semente);
  let s = `<rect width="${W}" height="${H}" fill="#05060F"/>`;
  for (let i = 0; i < 160; i++) {
    s += `<circle cx="${r() * W}" cy="${r() * H}" r="${0.8 + r() * 2.4}" fill="#fff" opacity="${0.3 + r() * 0.7}"/>`;
  }
  return s;
}

function paredeListrada(y0, y1, base, listra) {
  let s = `<rect y="${y0}" width="${W}" height="${y1 - y0}" fill="${base}"/>`;
  for (let x = 0; x < W; x += 90) s += `<rect x="${x}" y="${y0}" width="45" height="${y1 - y0}" fill="${listra}"/>`;
  return s;
}

function piso() {
  let s = `<rect y="${CHAO}" width="${W}" height="${H - CHAO}" fill="#B98350"/>`;
  for (let y = CHAO + 60; y < H; y += 70) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#9C6A3C" stroke-width="4"/>`;
  return s + `<rect y="${CHAO - 22}" width="${W}" height="22" fill="#7E5129"/>`;
}

function porta(x, y, w, h) {
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#9C6B3E" stroke="#1A1A1A" stroke-width="6"/>` +
    `<rect x="${x + w * 0.14}" y="${y + h * 0.06}" width="${w * 0.72}" height="${h * 0.38}" fill="none" stroke="#7A4E28" stroke-width="6"/>` +
    `<rect x="${x + w * 0.14}" y="${y + h * 0.52}" width="${w * 0.72}" height="${h * 0.4}" fill="none" stroke="#7A4E28" stroke-width="6"/>` +
    `<circle cx="${x + w * 0.85}" cy="${y + h * 0.5}" r="${w * 0.045}" fill="#F2C14E" stroke="#1A1A1A" stroke-width="4"/>`
  );
}

function skyline(semente, cor, hMin, hMax, janelas, base = CHAO) {
  const r = aleatorio(semente);
  let s = '';
  let x = -20;
  while (x < W) {
    const w = 40 + r() * 70;
    const h = hMin + r() * (hMax - hMin);
    s += `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${cor}"/>`;
    if (janelas) {
      for (let yy = base - h + 12; yy < base - 10; yy += 22) {
        for (let xx = x + 8; xx < x + w - 10; xx += 18) {
          if (r() < 0.45) s += `<rect x="${xx}" y="${yy}" width="7" height="9" fill="#FFD86B" opacity="0.9"/>`;
        }
      }
    }
    x += w + 4;
  }
  return s;
}

function nuvem(x, y, e, op = 0.95) {
  return `<g transform="translate(${x} ${y}) scale(${e})" opacity="${op}" fill="#fff"><circle cx="0" cy="0" r="40"/><circle cx="45" cy="-18" r="50"/><circle cx="95" cy="0" r="38"/><rect x="0" y="0" width="95" height="38"/></g>`;
}

function aviao(x, y, e) {
  return (
    `<g transform="translate(${x} ${y}) scale(${e})" stroke="#1A1A1A" stroke-width="3.5" stroke-linejoin="round">` +
    `<path d="M-20,-4 L-42,-36 L-28,-36 L8,-4 Z" fill="#C9D3E0"/>` +
    `<ellipse cx="0" cy="0" rx="72" ry="13" fill="#F4F7FB"/>` +
    `<path d="M-62,-4 L-80,-32 L-67,-32 L-46,-6 Z" fill="#E04848"/>` +
    `<path d="M-6,3 L-32,42 L-14,42 L26,3 Z" fill="#C9D3E0"/>` +
    `<g fill="#5AA9E6" stroke="none">${[-30, -15, 0, 15, 30].map((wx) => `<circle cx="${wx}" cy="-3" r="3"/>`).join('')}</g>` +
    `</g>`
  );
}

function terra(cx, cy, r, giro = 0) {
  const continentes = [
    'M-0.55,-0.45 C-0.25,-0.7 0.1,-0.45 0.0,-0.15 C-0.1,0.15 -0.45,0.1 -0.55,-0.45 Z',
    'M0.15,0.05 C0.45,-0.05 0.6,0.3 0.4,0.55 C0.25,0.75 0.05,0.45 0.15,0.05 Z',
    'M-0.75,0.2 C-0.55,0.1 -0.4,0.35 -0.5,0.5 C-0.65,0.6 -0.85,0.45 -0.75,0.2 Z',
    'M0.35,-0.65 C0.6,-0.6 0.75,-0.35 0.55,-0.25 C0.35,-0.2 0.2,-0.5 0.35,-0.65 Z',
  ];
  return (
    `<defs><clipPath id="clipTerra"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>` +
    `<radialGradient id="atm"><stop offset="0.85" stop-color="#6EC1FF" stop-opacity="0.55"/><stop offset="1" stop-color="#6EC1FF" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="sombraTerra" cx="0.3" cy="0.3" r="0.9"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient></defs>` +
    `<circle cx="${cx}" cy="${cy}" r="${r * 1.09}" fill="url(#atm)"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#2D78D2"/>` +
    `<g clip-path="url(#clipTerra)"><g transform="translate(${cx + giro * r} ${cy}) scale(${r})" fill="#4CAF50">${continentes
      .map((d) => `<path d="${d}"/>`)
      .join('')}</g>` +
    `<ellipse cx="${cx}" cy="${cy - r * 0.95}" rx="${r * 0.45}" ry="${r * 0.12}" fill="#fff"/>` +
    `<ellipse cx="${cx}" cy="${cy + r * 0.97}" rx="${r * 0.4}" ry="${r * 0.1}" fill="#fff"/></g>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#sombraTerra)" stroke="#1A1A1A" stroke-width="5"/>`
  );
}

// ---------- cenas ----------
