// Desenha cada quadro do vídeo. window.setT(t) recebe o tempo em segundos e monta a cena.
(function () {
  const W = 1080;
  const INK = '#1b1b1b';
  const SKIN_BOY = '#7a4a2b', SKIN_BOY_DARK = '#6b3f23';
  const SKIN_AVO = '#d9a77c', SKIN_AVO_DARK = '#cf9a6c';
  const OUT = `stroke="${INK}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"`;

  function estrelas(seed, n, y0, y1) {
    let s = seed, out = '';
    const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < n; i++) {
      const x = r() * W, y = y0 + r() * (y1 - y0), k = 1 + r() * 2.2;
      out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${k.toFixed(1)}" fill="#fff" opacity="${(0.4 + r() * 0.6).toFixed(2)}"/>`;
    }
    return out;
  }

  function sol(cx, cy, r) {
    let rays = '';
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const x1 = cx + Math.cos(a) * (r + 22), y1 = cy + Math.sin(a) * (r + 22);
      const x2 = cx + Math.cos(a) * (r + 70), y2 = cy + Math.sin(a) * (r + 70);
      rays += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffd21f" stroke-width="12" stroke-linecap="round" opacity="0.8"/>`;
    }
    return `<circle cx="${cx}" cy="${cy}" r="${r * 1.5}" fill="#ffb300" opacity="0.18"/>${rays}
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffd21f" ${OUT}/>
      <circle cx="${cx - r * 0.3}" cy="${cy - r * 0.3}" r="${r * 0.35}" fill="#fff6b8" opacity="0.7"/>`;
  }

  function buraco(cx, cy, r, extra = '') {
    return `<ellipse cx="${cx}" cy="${cy}" rx="${r * 2.4}" ry="${r * 0.75}" fill="none" stroke="#ff8a1f" stroke-width="${r * 0.42}" opacity="0.95"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r * 1.9}" ry="${r * 0.6}" fill="none" stroke="#ffd21f" stroke-width="${r * 0.16}" opacity="0.9"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 1.12}" fill="#000"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#000" stroke="#ffd21f" stroke-width="5" opacity="0.9"/>${extra}`;
  }

  function terra(cx, cy, r, modo) {
    if (modo === 'noite' || modo === 'gelo') {
      const base = modo === 'gelo' ? '#2d5c8f' : '#0f1d3d';
      let extra = '';
      if (modo === 'noite') {
        const pts = [[-40, -20], [10, 30], [30, -50], [-15, 55], [55, 10], [-55, 35], [20, -15]];
        extra = pts.map(([x, y]) => `<circle cx="${cx + x * r / 90}" cy="${cy + y * r / 90}" r="${r * 0.022}" fill="#ffd21f"/>`).join('');
      }
      let ice = '';
      if (modo === 'gelo') {
        ice = `<path d="M ${cx - r * 0.85} ${cy - r * 0.2} Q ${cx} ${cy - r * 1.05} ${cx + r * 0.85} ${cy - r * 0.2} Q ${cx} ${cy - r * 0.55} ${cx - r * 0.85} ${cy - r * 0.2} Z" fill="#eaf6ff" opacity="0.95"/>
               <path d="M ${cx - r * 0.7} ${cy + r * 0.45} Q ${cx} ${cy + r * 1.05} ${cx + r * 0.7} ${cy + r * 0.45} Q ${cx} ${cy + r * 0.6} ${cx - r * 0.7} ${cy + r * 0.45} Z" fill="#eaf6ff" opacity="0.95"/>
               <circle cx="${cx}" cy="${cy}" r="${r * 1.04}" fill="none" stroke="#dff3ff" stroke-width="10" opacity="0.6"/>`;
      }
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${base}" ${OUT}/>${ice}${extra}`;
    }
    const sea = '#2f7dd1';
    return `<circle cx="${cx}" cy="${cy}" r="${r * 1.07}" fill="#7fd0ff" opacity="0.35"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${sea}" ${OUT}/>
      <path d="M ${cx - r * 0.6} ${cy - r * 0.3} q ${r * 0.2} ${-r * 0.2} ${r * 0.45} ${-r * 0.05} q ${r * 0.1} ${r * 0.25} ${-r * 0.2} ${r * 0.4} q ${-r * 0.3} ${r * 0.1} ${-r * 0.25} ${-r * 0.35} Z" fill="#4cae4f"/>
      <path d="M ${cx + r * 0.1} ${cy + r * 0.1} q ${r * 0.35} ${-r * 0.1} ${r * 0.5} ${r * 0.3} q ${-r * 0.1} ${r * 0.3} ${-r * 0.4} ${r * 0.25} Z" fill="#4cae4f"/>
      <path d="M ${cx - r * 0.2} ${cy - r * 0.75} q ${r * 0.3} ${-r * 0.1} ${r * 0.4} ${r * 0.15} q ${-r * 0.3} ${r * 0.1} ${-r * 0.4} ${-r * 0.15} Z" fill="#ffffff" opacity="0.85"/>`;
  }

  function fundoEspaco(seed) { return `<rect x="0" y="0" width="${W}" height="1920" fill="#070b1f"/>${estrelas(seed, 90, 0, 1200)}`; }

  function chao(cor) { return `<rect x="0" y="1270" width="${W}" height="650" fill="${cor}"/><rect x="0" y="1262" width="${W}" height="12" fill="${INK}"/>`; }


  function zumbi(x, y, sc, t, ph) {
    const bra = Math.sin(t * 4 + ph) * 6;
    return `<g transform="translate(${x},${y}) scale(${sc})">
      <ellipse cx="0" cy="4" rx="60" ry="12" fill="#000" opacity="0.3"/>
      <rect x="-26" y="-120" width="22" height="118" rx="8" fill="#3d4b3a" ${OUT}/>
      <rect x="4" y="-120" width="22" height="118" rx="8" fill="#3d4b3a" ${OUT}/>
      <rect x="-34" y="-240" width="68" height="130" rx="14" fill="#5c4a6e" ${OUT}/>
      <rect x="-64" y="-226" width="18" height="104" rx="9" fill="#7aa37a" ${OUT} transform="rotate(${-62 + bra} -55 -224)"/>
      <rect x="46" y="-226" width="18" height="104" rx="9" fill="#7aa37a" ${OUT} transform="rotate(${62 - bra} 55 -224)"/>
      <circle cx="0" cy="-290" r="48" fill="#7aa37a" ${OUT}/>
      <path d="M -24 -302 l 12 12 m 0 -12 l -12 12 M 12 -302 l 12 12 m 0 -12 l -12 12" stroke="#111" stroke-width="5" stroke-linecap="round"/>
      <path d="M -40 -330 q 12 -10 24 -2 M 16 -332 q 12 -8 24 2" fill="none" stroke="#3d4b3a" stroke-width="5"/>
      <ellipse cx="0" cy="-262" rx="15" ry="${(6 + 5 * Math.abs(Math.sin(t * 3 + ph))).toFixed(1)}" fill="#2a0d0d" ${OUT}/>
    </g>`;
  }

  function predio(x, w, h, cor) {
    let janelas = '';
    for (let yy = 1262 - h + 40; yy < 1240; yy += 70)
      for (let xx = x + 16; xx < x + w - 30; xx += 46)
        janelas += `<rect x="${xx}" y="${yy}" width="24" height="30" fill="#ffd21f" opacity="${((xx + yy) % 3 ? 0.9 : 0.25).toFixed(2)}"/>`;
    return `<rect x="${x}" y="${1262 - h}" width="${w}" height="${h}" fill="${cor}"/>${janelas}`;
  }

  function cenaZumbi(cena, lt, t) {
    switch (cena) {
      case 'alerta': {
        const piscar = 0.5 + 0.5 * Math.sin(t * 6);
        return `<rect x="0" y="0" width="${W}" height="1920" fill="#1a0c12"/>
          <rect x="0" y="0" width="${W}" height="1920" fill="#ff2a2a" opacity="${(0.08 * piscar).toFixed(3)}"/>
          <rect x="250" y="250" width="580" height="700" rx="50" fill="#111" ${OUT}/>
          <rect x="270" y="270" width="540" height="660" rx="30" fill="#2a0606"/>
          <text x="540" y="460" text-anchor="middle" font-family="Inter" font-weight="900" font-size="104" fill="#ff3b3b">ALERTA</text>
          <text x="540" y="560" text-anchor="middle" font-family="Inter" font-weight="800" font-size="46" fill="#fff">MORDIDAS NA</text>
          <text x="540" y="620" text-anchor="middle" font-family="Inter" font-weight="800" font-size="46" fill="#fff">ZONA CENTRAL</text>
          <circle cx="540" cy="740" r="${(26 + 6 * piscar).toFixed(1)}" fill="#ff3b3b"/>` + chao('#2b2b36');
      }
      case 'rua': {
        const px = 1 + lt * 60;
        let zs = '';
        [0, 1, 2].forEach((i) => { zs += zumbi(((-200 + (i * 380 + t * 90) % 1400)), 1230, 0.55, t, i * 2); });
        return `<rect x="0" y="0" width="${W}" height="1920" fill="#3b2f4f"/>
          ${predio(0, 300, 620, '#4e4a6b')}${predio(300, 260, 470, '#5b4f78')}${predio(560, 320, 700, '#463f5f')}${predio(860, 240, 560, '#574a72')}
          ${zs}` + chao('#4a4a55') + `<rect x="0" y="1262" width="${W}" height="12" fill="${INK}"/>`;
      }
      case 'barricada': {
        let zs = '';
        const n = Math.min(3, 1 + Math.floor(lt * 1.5));
        for (let i = 0; i < n; i++) zs += zumbi(960 + i * 70, 1240, 0.62, t, i);
        return `<rect x="0" y="0" width="${W}" height="1920" fill="#2c2a33"/>
          ${predio(40, 260, 500, '#3c3a4a')}${predio(760, 300, 600, '#3c3a4a')}
          <rect x="60" y="820" width="960" height="34" fill="#8b5a2b" ${OUT}/>
          ${[120, 300, 480, 660, 840].map((x) => `<rect x="${x}" y="700" width="24" height="560" fill="#6b4420" ${OUT}/>`).join('')}
          <rect x="60" y="960" width="960" height="26" fill="#8b5a2b" ${OUT}/>
          <rect x="120" y="1000" width="640" height="26" fill="#a06d36" ${OUT}/>
          <text x="760" y="1080" text-anchor="middle" font-family="Inter" font-weight="900" font-size="60" fill="#fff" opacity="0.7">PÃO · 2 KM</text>
          ${zs}` + chao('#4a4a55');
      }
      case 'horda': {
        let zs = '';
        for (let i = 0; i < 5; i++) {
          const x = ((i * 230 + lt * 70 + 100) % 1300) - 110;
          zs += zumbi(x, 1235 - (i % 2) * 20, 0.7, t, i * 1.3);
        }
        return `<rect x="0" y="0" width="${W}" height="1920" fill="#4a2f3c"/>
          <circle cx="800" cy="330" r="120" fill="#ffb37a" opacity="0.5"/>
          ${predio(0, 380, 700, '#3a2a3a')}${predio(380, 320, 520, '#4a3446')}${predio(700, 380, 680, '#3a2a3a')}
          ${zs}` + chao('#3c3340');
      }
      case 'telhado': {
        return `<rect x="0" y="0" width="${W}" height="1920" fill="#0b1433"/>
          ${estrelas(11, 60, 0, 900)}
          <circle cx="800" cy="260" r="110" fill="#fff6d6" opacity="0.95"/>
          <rect x="0" y="1150" width="${W}" height="120" fill="#2a2e44"/>
          <rect x="120" y="1020" width="170" height="130" fill="#3a3f5c" ${OUT}/>
          <rect x="520" y="980" width="230" height="170" fill="#3a3f5c" ${OUT}/>
          <rect x="860" y="1040" width="180" height="110" fill="#3a3f5c" ${OUT}/>
          <path d="M 240 ${1000 - 0} L 300 880 L 360 1000 Z" fill="#2a2e44"/>` + chao('#2a2e44');
      }
      case 'amanhecer': {
        const k = Math.min(1, lt / 3);
        const sy = 1000 - 260 * k;
        return `<defs><linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d3f7a"/><stop offset="0.6" stop-color="#ff9e6b"/><stop offset="1" stop-color="#ffd28a"/></linearGradient></defs>
          <rect x="0" y="0" width="${W}" height="1920" fill="url(#gA)"/>
          <circle cx="540" cy="${sy}" r="140" fill="#ffd21f" ${OUT}/>
          ${predio(40, 220, 420, '#2a1f35')}${predio(300, 260, 300, '#2a1f35')}${predio(600, 240, 460, '#2a1f35')}${predio(860, 200, 360, '#2a1f35')}` + chao('#3b2f3f');
      }
    }
    return '';
  }

  function cenaBG(cena, lt, t) {
    if (window.MODO === 'zumbi') return cenaZumbi(cena, lt, t);
    const cx = 540, cy = 560;
    switch (cena) {
      case 'sol':
        return fundoEspaco(3) + sol(cx, cy, 190) + chao('#3a3f5e');
      case 'colapso': {
        const k = Math.min(1, lt / 1.2);
        const r = 190 * (1 - k) + 1;
        return fundoEspaco(3) + (k < 1 ? sol(cx, cy, r) : '') + (k > 0.5 ? buraco(cx, cy, 70, '') : '') + chao('#3a3f5e');
      }
      case 'orbita': case 'puxao': {
        const ang = t * 0.9;
        const ex = cx + Math.cos(ang) * 360, ey = cy + Math.sin(ang) * 130;
        const seta = cena === 'puxao' ? `<line x1="${ex}" y1="${ey}" x2="${cx + 90}" y2="${cy + 10}" stroke="#ffd21f" stroke-width="14" stroke-linecap="round"/>
          <polygon points="${cx + 90},${cy + 10} ${cx + 128},${cy - 4} ${cx + 118},${cy + 34}" fill="#ffd21f"/>` : '';
        return fundoEspaco(3) + `<ellipse cx="${cx}" cy="${cy}" rx="360" ry="130" fill="none" stroke="#24e0c9" stroke-width="6" stroke-dasharray="18 14" opacity="0.8"/>
          ${buraco(cx, cy, 70)}${seta}${terra(ex, ey, 38, 'dia')}` + chao('#3a3f5e');
      }
      case 'escala':
        return fundoEspaco(3) + `<circle cx="${cx}" cy="${cy}" r="190" fill="none" stroke="#ffd21f" stroke-width="7" stroke-dasharray="14 12"/>
          ${buraco(cx, cy, 14)}
          <line x1="${cx - 190}" y1="${cy + 230}" x2="${cx + 190}" y2="${cy + 230}" stroke="#fff" stroke-width="7"/>
          <line x1="${cx - 190}" y1="${cy + 210}" x2="${cx - 190}" y2="${cy + 250}" stroke="#fff" stroke-width="7"/>
          <line x1="${cx + 190}" y1="${cy + 210}" x2="${cx + 190}" y2="${cy + 250}" stroke="#fff" stroke-width="7"/>` + chao('#3a3f5e');
      case 'luz': {
        const pulsos = [0, 0.33, 0.66].map((o) => {
          const p = ((lt / 2.6 + o) % 1);
          const x = 250 + p * (790 - 250);
          return `<circle cx="${x}" cy="${cy}" r="16" fill="#fff6b8" stroke="#ffd21f" stroke-width="6"/>`;
        }).join('');
        return fundoEspaco(3) + buraco(260, cy, 60) + terra(790, cy, 38, 'dia') +
          `<line x1="260" y1="${cy}" x2="790" y2="${cy}" stroke="#ffd21f" stroke-width="4" stroke-dasharray="6 14" opacity="0.6"/>` + pulsos + chao('#3a3f5e');
      }
      case 'dia':
        return `<rect x="0" y="0" width="${W}" height="1920" fill="#8fd3ff"/>` + sol(930, 300, 70) + terra(cx, cy, 190, 'dia') + chao('#d7b98e');
      case 'noite':
        return fundoEspaco(7) + terra(cx, cy, 190, 'noite') + chao('#2a2f4a');
      case 'gelo':
        return fundoEspaco(9) + terra(cx, cy, 190, 'gelo') + chao('#2a3a5c');
      case 'volta':
        return fundoEspaco(3) + sol(cx, cy, 190) + chao('#3a3f5e');
      case 'fim':
        return `<rect x="0" y="0" width="${W}" height="1920" fill="#8fd3ff"/>` + sol(180, 300, 60) + terra(cx, cy, 190, 'dia') + chao('#d7b98e');
    }
    return '';
  }

  function menino(x, talk, t) {
    const open = talk ? 0.35 + 0.65 * Math.abs(Math.sin(t * 18)) : 0;
    const boca = talk
      ? `<ellipse cx="0" cy="-420" rx="17" ry="${(6 + 9 * open).toFixed(1)}" fill="#7a1f1f" ${OUT}/>`
      : `<path d="M -22 -425 Q 0 -404 22 -425" fill="none" ${OUT}/>`;
    const bob = Math.sin(t * 5) * 3;
    return `<g transform="translate(${x},${1830 + bob}) scale(0.85)">
      <ellipse cx="0" cy="6" rx="120" ry="22" fill="#000" opacity="0.25"/>
      <rect x="-34" y="-200" width="26" height="190" rx="12" fill="${SKIN_BOY}" ${OUT}/>
      <rect x="8" y="-200" width="26" height="190" rx="12" fill="${SKIN_BOY}" ${OUT}/>
      <ellipse cx="-21" cy="-8" rx="34" ry="16" fill="#fff" ${OUT}/>
      <ellipse cx="21" cy="-8" rx="34" ry="16" fill="#fff" ${OUT}/>
      <rect x="-58" y="-262" width="116" height="78" rx="14" fill="#3a5f9e" ${OUT}/>
      <rect x="-84" y="-362" width="30" height="150" rx="15" fill="${SKIN_BOY}" ${OUT}/>
      <rect x="54" y="-362" width="30" height="150" rx="15" fill="${SKIN_BOY}" ${OUT}/>
      <rect x="-60" y="-372" width="120" height="130" rx="26" fill="#2fa04f" ${OUT}/>
      <rect x="-44" y="-372" width="14" height="136" fill="#d64b3c"/>
      <rect x="30" y="-372" width="14" height="136" fill="#d64b3c"/>
      <polygon points="0,-336 5,-322 19,-322 8,-313 12,-299 0,-308 -12,-299 -8,-313 -19,-322 -5,-322" fill="#fff" stroke="${INK}" stroke-width="3"/>
      <circle cx="-69" cy="-200" r="19" fill="${SKIN_BOY}" ${OUT}/>
      <circle cx="69" cy="-200" r="19" fill="${SKIN_BOY}" ${OUT}/>
      <rect x="-18" y="-392" width="36" height="30" fill="${SKIN_BOY_DARK}"/>
      <circle cx="-58" cy="-512" r="36" fill="#1d140f"/>
      <circle cx="-24" cy="-540" r="40" fill="#1d140f"/>
      <circle cx="18" cy="-540" r="40" fill="#1d140f"/>
      <circle cx="56" cy="-512" r="36" fill="#1d140f"/>
      <circle cx="0" cy="-530" r="48" fill="#1d140f"/>
      <circle cx="-74" cy="-470" r="28" fill="#1d140f"/>
      <circle cx="74" cy="-470" r="28" fill="#1d140f"/>
      <circle cx="-72" cy="-450" r="16" fill="${SKIN_BOY_DARK}" ${OUT}/>
      <circle cx="72" cy="-450" r="16" fill="${SKIN_BOY_DARK}" ${OUT}/>
      <circle cx="0" cy="-455" r="74" fill="${SKIN_BOY}" ${OUT}/>
      <ellipse cx="-26" cy="-460" rx="19" ry="22" fill="#fff" ${OUT} stroke-width="5"/>
      <ellipse cx="26" cy="-460" rx="19" ry="22" fill="#fff" ${OUT} stroke-width="5"/>
      <circle cx="-22" cy="-457" r="10" fill="#111"/>
      <circle cx="30" cy="-457" r="10" fill="#111"/>
      <path d="M -44 -492 Q -26 -502 -8 -492 M 8 -492 Q 26 -502 44 -492" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="-46" cy="-432" r="11" fill="#e0633a" opacity="0.5"/>
      <circle cx="46" cy="-432" r="11" fill="#e0633a" opacity="0.5"/>
      ${boca}
    </g>`;
  }

  function avo(x, talk, t) {
    const open = talk ? 0.35 + 0.65 * Math.abs(Math.sin(t * 16 + 1)) : 0;
    const boca = talk
      ? `<ellipse cx="0" cy="-368" rx="15" ry="${(5 + 8 * open).toFixed(1)}" fill="#7a1f1f" ${OUT}/>`
      : `<path d="M -18 -372 Q 0 -358 18 -372" fill="none" ${OUT}/>`;
    const bob = Math.sin(t * 4.2 + 1) * 3;
    return `<g transform="translate(${x},${1830 + bob}) scale(0.85)">
      <ellipse cx="0" cy="6" rx="120" ry="22" fill="#000" opacity="0.25"/>
      <ellipse cx="-24" cy="-8" rx="26" ry="14" fill="#3b2a20" ${OUT}/>
      <ellipse cx="24" cy="-8" rx="26" ry="14" fill="#3b2a20" ${OUT}/>
      <path d="M -64 -300 L -88 -14 L 88 -14 L 64 -300 Z" fill="#7d5ab5" ${OUT}/>
      <rect x="-94" y="-300" width="26" height="150" rx="13" fill="${SKIN_AVO}" ${OUT}/>
      <rect x="68" y="-300" width="26" height="150" rx="13" fill="${SKIN_AVO}" ${OUT}/>
      <circle cx="-81" cy="-140" r="17" fill="${SKIN_AVO}" ${OUT}/>
      <circle cx="81" cy="-140" r="17" fill="${SKIN_AVO}" ${OUT}/>
      <path d="M -44 -290 L 44 -290 L 58 -120 L -58 -120 Z" fill="#f4f1ea" ${OUT}/>
      <rect x="-26" y="-330" width="52" height="46" rx="8" fill="#f4f1ea" ${OUT}/>
      <rect x="-16" y="-352" width="32" height="30" fill="${SKIN_AVO_DARK}"/>
      <circle cx="0" cy="-415" r="70" fill="${SKIN_AVO}" ${OUT}/>
      <circle cx="0" cy="-495" r="28" fill="#c8c8cc" ${OUT}/>
      <path d="M -68 -415 Q -72 -482 0 -478 Q 72 -482 68 -415 Q 52 -446 0 -440 Q -52 -446 -68 -415 Z" fill="#c8c8cc" ${OUT}/>
      <circle cx="-24" cy="-414" r="6" fill="#111"/>
      <circle cx="24" cy="-414" r="6" fill="#111"/>
      <circle cx="-24" cy="-414" r="20" fill="none" stroke="${INK}" stroke-width="6"/>
      <circle cx="24" cy="-414" r="20" fill="none" stroke="${INK}" stroke-width="6"/>
      <line x1="-4" y1="-414" x2="4" y2="-414" stroke="${INK}" stroke-width="6"/>
      <circle cx="-44" cy="-386" r="9" fill="#e0633a" opacity="0.4"/>
      <circle cx="44" cy="-386" r="9" fill="#e0633a" opacity="0.4"/>
      ${boca}
    </g>`;
  }

  function barraTopo(hud) {
    const pill = (x, w, cor, icone, rotulo, valor) => `
      <div class="hud" style="left:${x}px;width:${w}px;">
        <div class="ico" style="background:${cor}">${icone}</div>
        <div><small>${rotulo}</small><b>${valor}</b></div>
      </div>`;
    return pill(40, 290, '#f2a33a', '◷', 'SISTEMA', 'SOLAR') +
      pill(350, 380, '#2fa04f', '$', hud[0], hud[1]) +
      pill(745, 300, '#8b5cf6', '⌂', 'DISTÂNCIA', '150 MI KM');
  }

  let ultimoHud = null;
  window.setT = function (t) {
    const shots = window.SHOTS;
    let s = shots.find((x) => t >= x.t0 && t < x.t1) || null;
    if (!s) {
      // entre um plano e outro, mantém a cena anterior sem legenda
      s = shots.filter((x) => x.t0 <= t).pop() || shots[0];
    }
    const ativo = t >= s.t0 && t < s.t1;
    const lt = Math.max(0, t - s.t0);
    document.getElementById('bg').innerHTML = cenaBG(s.cena, lt, t);
    document.getElementById('chars').innerHTML = menino(300, ativo && s.quem === 'boy', t) + avo(790, ativo && s.quem === 'avo', t);
    const hudKey = JSON.stringify(s.hud);
    if (hudKey !== ultimoHud) { ultimoHud = hudKey; document.getElementById('hud').innerHTML = barraTopo(s.hud); }
    const cap = document.getElementById('cap');
    cap.innerHTML = ativo ? s.cap : '';
    cap.style.opacity = ativo ? Math.min(1, lt / 0.12).toFixed(2) : '0';
    const b = document.getElementById('bubbles');
    if (ativo) {
      const boy = s.quem === 'boy';
      const left = boy ? 40 : 610;
      const tx = boy ? 300 - 40 : 790 - 610;
      b.innerHTML = `<div class="bubble" style="left:${left}px;top:1235px;--tx:${tx}px">${s.fala}</div>`;
    } else b.innerHTML = '';
    const fx = document.getElementById('fx');
    fx.innerHTML = s.cena === 'volta' && lt < 1.2 ? `<div class="tag" style="top:250px">◀◀ VOLTANDO</div>` : '';
  };
})();
