// isekai.js — cenários e efeitos da série original "ALÉM DO PORTAL" (anime de fantasia).
// Escola no pôr do sol, caminho com a construção abandonada, interior com o círculo mágico,
// portal (energia, partículas, tremor, clarão), mundo de fantasia (ilhas flutuantes, cachoeiras,
// castelo, montanhas, dragões), floresta mágica, criatura escamada, golpes de espada,
// castelo sombrio e a sala da esfera. Personagens de corpo inteiro pequenos para planos abertos.
// Usa anime.js (animeBusto, animeRosto, nuvem, animeDefs...).

const IK = '#1B1424';
const ikR = (n) => aleatorio(n);

// ---------- céus ----------
function ikCeu(t, cores, { estrelas = 0, sol = null } = {}) {
  const id = 'ikc' + cores.join('').replace(/#/g, '');
  let s = animeDefs() + `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">` +
    cores.map((c, i) => `<stop offset="${(i / (cores.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join('') +
    `</linearGradient></defs><rect width="1080" height="1920" fill="url(#${id})"/>`;
  if (estrelas) { const r = ikR(17); for (let i = 0; i < estrelas; i++) s += `<circle cx="${r() * 1080}" cy="${r() * 800}" r="${0.8 + r() * 2.2}" fill="#fff" opacity="${0.3 + 0.5 * Math.abs(Math.sin(t * 1.4 + i))}"/>`; }
  if (sol) s += `<circle cx="${sol[0]}" cy="${sol[1]}" r="${sol[2] * 2.6}" fill="${sol[3]}" opacity="0.35" filter="url(#animeSoft)"/><circle cx="${sol[0]}" cy="${sol[1]}" r="${sol[2]}" fill="${sol[4] || '#FFF4D8'}"/>`;
  return s;
}

// ---------- 1 · escola no pôr do sol ----------
function ikEscola(t, { alunos = true } = {}) {
  let s = ikCeu(t, ['#2E2463', '#B8508A', '#F2875E', '#FFD08A'], { estrelas: 20, sol: [820, 980, 120, '#FFB060', '#FFE8B0'] });
  s += nuvem(180 + t * 6, 420, 1.3, '#F59AB0', 0.7) + nuvem(860 - t * 5, 560, 1.1, '#FFC0A0', 0.65) + nuvem(420 + t * 4, 700, 1.5, '#D86A90', 0.5);
  // árvores ao fundo
  for (let i = 0; i < 9; i++) { const x = i * 140 - 30; s += `<ellipse cx="${x}" cy="${930 + (i % 2) * 30}" rx="120" ry="110" fill="#5A2E50"/>`; }
  // prédio da escola
  s += `<rect x="60" y="640" width="960" height="560" fill="#F0D2BC" stroke="${IK}" stroke-width="7"/>`;
  s += `<rect x="60" y="640" width="960" height="560" fill="#FF9A60" opacity="0.18"/><rect x="560" y="640" width="460" height="560" fill="#7A3A60" opacity="0.22"/>`;
  s += `<path d="M 40 640 L 1040 640 L 1000 600 L 80 600 Z" fill="#8A3A44" stroke="${IK}" stroke-width="6"/>`;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) {
    if (c >= 3 && c <= 4 && r === 2) continue;
    const x = 100 + c * 115, y = 690 + r * 160;
    s += `<rect x="${x}" y="${y}" width="80" height="110" fill="#3A3A6A" stroke="${IK}" stroke-width="5"/><rect x="${x}" y="${y}" width="80" height="110" fill="#FFB070" opacity="${0.25 + 0.4 * ((c + r) % 3 === 0)}"/><line x1="${x + 40}" y1="${y}" x2="${x + 40}" y2="${y + 110}" stroke="${IK}" stroke-width="3"/>`;
  }
  // torre do relógio
  s += `<rect x="440" y="420" width="200" height="230" fill="#E8C4AC" stroke="${IK}" stroke-width="7"/><path d="M 420 420 L 540 330 L 660 420 Z" fill="#8A3A44" stroke="${IK}" stroke-width="6"/>`;
  s += `<circle cx="540" cy="520" r="62" fill="#FFF6E8" stroke="${IK}" stroke-width="6"/><line x1="540" y1="520" x2="540" y2="476" stroke="${IK}" stroke-width="6"/><line x1="540" y1="520" x2="574" y2="532" stroke="${IK}" stroke-width="5"/>`;
  // porta e pátio
  s += `<rect x="455" y="1010" width="170" height="190" fill="#4A2A3A" stroke="${IK}" stroke-width="6"/><line x1="540" y1="1010" x2="540" y2="1200" stroke="${IK}" stroke-width="4"/>`;
  s += `<rect y="1200" width="1080" height="720" fill="#D8A27A"/><rect y="1200" width="1080" height="720" fill="#8A4A6A" opacity="0.25"/>`;
  for (let i = 0; i < 8; i++) s += `<path d="M ${-100 + i * 180} 1920 L ${380 + i * 40} 1200" stroke="#C08A68" stroke-width="4" opacity="0.6"/>`;
  // portão
  s += `<rect x="40" y="1060" width="90" height="520" fill="#B8A898" stroke="${IK}" stroke-width="7"/><rect x="950" y="1060" width="90" height="520" fill="#9A8A7C" stroke="${IK}" stroke-width="7"/>`;
  s += `<rect x="20" y="1030" width="130" height="40" fill="#8A7A6C" stroke="${IK}" stroke-width="6"/><rect x="930" y="1030" width="130" height="40" fill="#8A7A6C" stroke="${IK}" stroke-width="6"/>`;
  s += `<rect x="150" y="1110" width="300" height="56" rx="6" fill="#2A2440" stroke="${IK}" stroke-width="5"/><text x="300" y="1150" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="#FFE6C0">COLÉGIO SÃO GABRIEL</text>`;
  // alunos saindo (silhuetas)
  if (alunos) for (let i = 0; i < 7; i++) {
    const r = ikR(i + 5), dir = i % 2 ? 1 : -1, x = ((r() * 1080 + dir * t * (40 + r() * 30)) % 1200 + 1200) % 1200 - 60, y = 1240 + r() * 160, k = 0.22 + (y - 1240) / 900;
    s += ikPessoaMini(x, y, k, t + i, { cabelo: ['#2A1E18', '#5A3A22', '#141018', '#8A5A2A'][i % 4], roupa: '#2A3A5A', andar: true, dir });
  }
  // luz quente do pôr do sol por cima
  s += `<rect width="1080" height="1920" fill="#FF8A4A" opacity="0.08"/>`;
  return s;
}

// Pessoa pequena de corpo inteiro (planos abertos). k = escala (1 ≈ 900 px de altura).
function ikPessoaMini(x, y, k, t, { cabelo = '#3A2418', roupa = '#2A3A5A', saia = false, longo = false, andar = false, dir = 1, deitado = false, pele = '#F8DCC8', pose = '' } = {}) {
  const sw = andar ? Math.sin(t * 8) * 22 : 0;
  let s = `<g transform="translate(${x} ${y}) scale(${k * dir} ${k})${deitado ? ' rotate(-90)' : ''}">`;
  s += `<ellipse cx="0" cy="6" rx="110" ry="18" fill="#000" opacity="0.18"/>`;
  // pernas
  s += `<path d="M -26 -380 L ${-34 + sw} -10" stroke="${IK}" stroke-width="44" stroke-linecap="round"/><path d="M -26 -380 L ${-34 + sw} -10" stroke="${saia ? pele : '#2A2E3E'}" stroke-width="32" stroke-linecap="round"/>`;
  s += `<path d="M 26 -380 L ${34 - sw} -10" stroke="${IK}" stroke-width="44" stroke-linecap="round"/><path d="M 26 -380 L ${34 - sw} -10" stroke="${saia ? pele : '#2A2E3E'}" stroke-width="32" stroke-linecap="round"/>`;
  s += `<ellipse cx="${-34 + sw}" cy="-6" rx="34" ry="16" fill="#2A1E1A"/><ellipse cx="${34 - sw}" cy="-6" rx="34" ry="16" fill="#2A1E1A"/>`;
  if (saia) s += `<path d="M -80 -420 L 80 -420 L 110 -300 L -110 -300 Z" fill="#3A3A5A" stroke="${IK}" stroke-width="7"/>`;
  // tronco (blazer) e braços
  const ba = pose === 'alto' ? -140 : andar ? -sw * 1.2 : 0;
  s += `<path d="M -80 -660 L 80 -660 L 92 -380 L -92 -380 Z" fill="${roupa}" stroke="${IK}" stroke-width="8"/><path d="M -20 -660 L 0 -600 L 20 -660 Z" fill="#F2F2F8"/>`;
  s += `<path d="M -80 -640 L ${-110 - ba * 0.3} ${-420 + (pose === 'alto' ? -380 : 0)}" stroke="${IK}" stroke-width="38" stroke-linecap="round"/><path d="M -80 -640 L ${-110 - ba * 0.3} ${-420 + (pose === 'alto' ? -380 : 0)}" stroke="${roupa}" stroke-width="26" stroke-linecap="round"/>`;
  s += `<path d="M 80 -640 L ${110 + ba * 0.3} -420" stroke="${IK}" stroke-width="38" stroke-linecap="round"/><path d="M 80 -640 L ${110 + ba * 0.3} -420" stroke="${roupa}" stroke-width="26" stroke-linecap="round"/>`;
  // cabeça
  if (longo) s += `<path d="M -95 -830 Q -120 -620 -90 -560 L 90 -560 Q 120 -620 95 -830 Z" fill="${cabelo}" stroke="${IK}" stroke-width="7"/>`;
  s += `<ellipse cx="0" cy="-760" rx="88" ry="100" fill="${pele}" stroke="${IK}" stroke-width="8"/>`;
  s += `<path d="M -96 -770 Q -100 -880 0 -880 Q 100 -880 96 -770 Q 60 -830 0 -820 Q -60 -830 -96 -770 Z" fill="${cabelo}" stroke="${IK}" stroke-width="7"/>`;
  s += `<ellipse cx="-34" cy="-750" rx="11" ry="16" fill="${IK}"/><ellipse cx="34" cy="-750" rx="11" ry="16" fill="${IK}"/>`;
  return s + `</g>`;
}

// ---------- 2 · caminho e construção abandonada ----------
function ikCaminho(t, { ruinaBrilho = 0.6, cam = 0 } = {}) {
  let s = ikCeu(t, ['#251E55', '#9A4A8A', '#F07A5A', '#FFC07A'], { estrelas: 30, sol: [200, 1060, 90, '#FF9A50', '#FFE0A0'] });
  s += nuvem(700 - t * 4, 520, 1.3, '#E07AA0', 0.6);
  s += `<g transform="translate(${-cam} 0)">`;
  // morros e floresta
  s += `<path d="M -100 1120 Q 200 980 500 1080 Q 800 960 1300 1100 L 1300 1920 L -100 1920 Z" fill="#5A3A6A"/>`;
  const r = ikR(23);
  for (let i = 0; i < 24; i++) { const x = 560 + i * 40 + r() * 30, h = 260 + r() * 200; s += `<path d="M ${x - 50} 1200 L ${x} ${1200 - h} L ${x + 50} 1200 Z" fill="${i % 2 ? '#2A2440' : '#22203A'}"/>`; }
  // construção abandonada
  s += `<g transform="translate(560 1250)">` +
    `<path d="M -230 0 L -230 -380 L -120 -380 L -120 -440 L 60 -440 L 60 -400 L 230 -400 L 230 0 Z" fill="#7A7068" stroke="${IK}" stroke-width="8"/>` +
    `<path d="M -230 -380 L -150 -420 L -100 -380 M 60 -440 L 120 -470 L 160 -400" fill="none" stroke="${IK}" stroke-width="7"/>` +
    `<rect x="-200" y="-380" width="430" height="380" fill="#3A2A4A" opacity="0.35"/>` +
    [[-160, -300], [-40, -300], [100, -300]].map(([x, y]) => `<path d="M ${x} ${y + 100} L ${x} ${y + 30} Q ${x + 40} ${y - 10} ${x + 80} ${y + 30} L ${x + 80} ${y + 100} Z" fill="#141022" stroke="${IK}" stroke-width="6"/>`).join('') +
    `<path d="M -40 -200 L -40 -270 Q 0 -310 40 -270 L 40 -200" fill="none"/>` +
    `<ellipse cx="0" cy="-240" rx="36" ry="40" fill="#9A6AFF" opacity="${ruinaBrilho * (0.6 + 0.4 * Math.sin(t * 3))}" filter="url(#animeGlow)"/>` +
    `<rect x="-60" y="-140" width="120" height="140" fill="#100C1A" stroke="${IK}" stroke-width="6"/>` +
    `<path d="M -230 -120 Q -200 -160 -170 -110 M 180 -300 Q 200 -260 230 -280" stroke="#3A6A3A" stroke-width="12" fill="none"/>` + `</g>`;
  // estrada
  s += `<path d="M -100 1920 Q 300 1450 520 1290 L 600 1290 Q 600 1500 1000 1920 Z" fill="#8A6A7A"/><path d="M 260 1920 Q 460 1500 560 1300" stroke="#E8C8A8" stroke-width="10" stroke-dasharray="40 40" fill="none" opacity="0.6"/>`;
  s += `<rect x="100" y="760" width="16" height="700" fill="#2A2240"/><path d="M 60 800 L 160 800" stroke="#2A2240" stroke-width="10"/><path d="M 108 800 Q 400 860 700 820" stroke="#2A2240" stroke-width="3" fill="none"/>`;
  s += `</g><rect width="1080" height="1920" fill="#FF8A4A" opacity="0.07"/>`;
  return s;
}

// ---------- interior: círculo mágico ----------
function ikCirculo(cx, cy, raio, t, forca = 0.5, achatado = 0.35) {
  const cor1 = '#5AA8FF', cor2 = '#B070FF';
  let s = `<g transform="translate(${cx} ${cy}) scale(1 ${achatado})">`;
  s += `<circle r="${raio * 1.25}" fill="${cor2}" opacity="${0.25 * forca}" filter="url(#animeSoft)"/>`;
  const anel = (r, w, cor, op) => `<circle r="${r}" fill="none" stroke="${cor}" stroke-width="${w}" opacity="${op}"/>`;
  s += `<g transform="rotate(${t * 20})">` + anel(raio, 10, cor1, 0.5 + 0.5 * forca) + anel(raio * 0.86, 4, cor2, 0.4 + 0.6 * forca);
  for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; s += `<rect x="${Math.cos(a) * raio * 0.93 - 8}" y="${Math.sin(a) * raio * 0.93 - 8}" width="16" height="16" transform="rotate(${(a * 180) / Math.PI + 45} ${Math.cos(a) * raio * 0.93} ${Math.sin(a) * raio * 0.93})" fill="${cor1}" opacity="${0.4 + 0.6 * forca}"/>`; }
  s += `</g><g transform="rotate(${-t * 30})">`;
  const pts = []; for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 - Math.PI / 2; pts.push([Math.cos(a) * raio * 0.8, Math.sin(a) * raio * 0.8]); }
  s += `<path d="M ${pts[0]} L ${pts[2]} L ${pts[4]} Z M ${pts[1]} L ${pts[3]} L ${pts[5]} Z" fill="none" stroke="${cor2}" stroke-width="6" opacity="${0.4 + 0.6 * forca}"/>`;
  s += anel(raio * 0.42, 6, cor1, 0.5 + 0.5 * forca) + `</g>`;
  s += `<circle r="${raio * 0.18}" fill="#E8F4FF" opacity="${0.3 + 0.7 * forca}" filter="url(#animeGlow)"/>`;
  return s + `</g>`;
}
function ikRuinaDentro(t, { forca = 0.35, tremer = 0, particulas = 0 } = {}) {
  let s = animeDefs() + `<rect width="1080" height="1920" fill="#16121E"/>`;
  // paredes de pedra
  for (let r = 0; r < 14; r++) for (let c = 0; c < 6; c++) { const x = c * 190 - (r % 2) * 95, y = 200 + r * 80; s += `<rect x="${x}" y="${y}" width="186" height="76" fill="${(r + c) % 3 ? '#2A2434' : '#26202E'}" stroke="#120E18" stroke-width="4"/>`; }
  s += `<rect y="0" width="1080" height="220" fill="#0E0A14"/>`;
  // buraco no teto com raios de luz
  s += `<path d="M 300 0 L 520 0 L 470 120 L 330 90 Z" fill="#FFB070" opacity="0.6"/>`;
  s += `<polygon points="330,90 470,120 760,1500 160,1500" fill="#FFB070" opacity="0.10"/>`;
  for (let i = 0; i < 20; i++) { const r = ikR(i + 60); const x = 240 + r() * 440, y = ((r() * 1300 + t * 20) % 1300) + 150; s += `<circle cx="${x}" cy="${y}" r="${1.5 + r() * 3}" fill="#FFE0B0" opacity="0.55"/>`; }
  // chão
  s += `<path d="M -100 1300 L 1180 1300 L 1180 1920 L -100 1920 Z" fill="#221C2A"/>`;
  for (let i = 0; i < 12; i++) s += `<path d="M ${-200 + i * 140} 1920 L ${360 + i * 30} 1300" stroke="#1A1520" stroke-width="5"/>`;
  s += `<path d="M -100 1500 L 1180 1500 M -100 1700 L 1180 1700" stroke="#1A1520" stroke-width="5"/>`;
  // entulho
  s += `<path d="M 40 1420 L 140 1360 L 230 1410 L 200 1460 L 60 1470 Z" fill="#3A3240" stroke="${IK}" stroke-width="6"/><path d="M 860 1380 L 980 1330 L 1050 1400 L 940 1450 Z" fill="#3A3240" stroke="${IK}" stroke-width="6"/>`;
  s += ikCirculo(540, 1560, 360, t, forca);
  if (forca > 0.5) s += `<rect width="1080" height="1920" fill="#7A50FF" opacity="${(forca - 0.5) * 0.35}"/>`;
  if (particulas) s += ikParticulas(t, particulas);
  return tremer ? `<g transform="translate(${Math.sin(t * 61) * tremer} ${Math.cos(t * 53) * tremer})">${s}</g>` : s;
}
function ikParticulas(t, n = 60, { cx = 540, cy = 1560, cores = ['#9FD0FF', '#C8A0FF', '#FFFFFF'] } = {}) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const r = ikR(i + 300), k = (t * (0.25 + r() * 0.35) + r()) % 1;
    const x = cx + (r() - 0.5) * 900 + Math.sin(t * 2 + i) * 30, y = cy - k * 1400;
    s += `<circle cx="${x}" cy="${y}" r="${(2 + r() * 6) * (1 - k * 0.5)}" fill="${cores[i % cores.length]}" opacity="${(1 - k) * 0.9}"/>`;
  }
  return s;
}

// ---------- 4 · mundo de fantasia ----------
function ikIlha(x, y, k, t, sem, { cachoeira = true, castelo = false } = {}) {
  const r = ikR(sem), by = Math.sin(t * 0.8 + sem) * 10;
  let s = `<g transform="translate(${x} ${y + by}) scale(${k})">`;
  s += `<path d="M -220 0 Q -180 120 -90 210 Q -40 330 0 420 Q 40 300 100 220 Q 190 120 220 0 Z" fill="#6A5A7A" stroke="${IK}" stroke-width="7"/><path d="M 40 0 Q 120 80 140 200 Q 60 260 0 420 Q 40 300 100 220 Q 190 120 220 0 Z" fill="#4A3E5A"/>`;
  s += `<ellipse cx="0" cy="0" rx="230" ry="48" fill="#6CC060" stroke="${IK}" stroke-width="7"/><ellipse cx="-40" cy="-10" rx="140" ry="22" fill="#9AE080" opacity="0.7"/>`;
  for (let i = 0; i < 4; i++) { const tx = -150 + i * 95 + r() * 30; s += `<rect x="${tx - 8}" y="-80" width="16" height="70" fill="#5A3A2A"/><circle cx="${tx}" cy="-100" r="${40 + r() * 16}" fill="${i % 2 ? '#3E9A50' : '#4AAE5C'}" stroke="${IK}" stroke-width="5"/>`; }
  if (castelo) s += `<g transform="translate(60 -40)"><rect x="-50" y="-170" width="100" height="170" fill="#E8E4F0" stroke="${IK}" stroke-width="6"/><path d="M -60 -170 L 0 -250 L 60 -170 Z" fill="#4A6AD0" stroke="${IK}" stroke-width="6"/><rect x="-14" y="-60" width="28" height="60" fill="#3A2A4A"/></g>`;
  if (cachoeira) {
    s += `<rect x="150" y="10" width="40" height="${700}" fill="#BFE8FF" opacity="0.75"/>`;
    for (let i = 0; i < 6; i++) { const yy = ((t * 400 + i * 120) % 700) + 10; s += `<rect x="${156 + (i % 3) * 8}" y="${yy}" width="6" height="60" fill="#FFFFFF" opacity="0.8"/>`; }
    s += `<ellipse cx="170" cy="710" rx="80" ry="30" fill="#FFFFFF" opacity="0.5" filter="url(#animeBlur4)"/>`;
  }
  return s + `</g>`;
}
function ikDragao(x, y, k, t, cor = '#3A2E5A') {
  const asa = Math.sin(t * 6) * 40;
  return `<g transform="translate(${x} ${y}) scale(${k})">` +
    `<path d="M -10 0 Q -120 ${-80 - asa} -260 ${-40 - asa * 1.4} Q -170 ${-10 - asa * 0.5} -150 20 Q -80 10 -10 20 Z" fill="${cor}"/>` +
    `<path d="M 10 0 Q 120 ${-80 - asa} 260 ${-40 - asa * 1.4} Q 170 ${-10 - asa * 0.5} 150 20 Q 80 10 10 20 Z" fill="${cor}"/>` +
    `<ellipse cx="0" cy="12" rx="90" ry="30" fill="${cor}"/><path d="M 80 0 Q 140 -30 170 -10 L 140 10 Z" fill="${cor}"/><path d="M -80 10 Q -180 40 -260 10" stroke="${cor}" stroke-width="16" fill="none" stroke-linecap="round"/></g>`;
}
function ikMundo(t, { cam = 0, campo = true, sombraDragao = 0 } = {}) {
  let s = ikCeu(t, ['#3A7AD8', '#6AB8F0', '#BDE6FF', '#FFF0D8'], { sol: [820, 380, 90, '#FFF0B0', '#FFFBE8'] });
  s += nuvem(160 + t * 10, 300, 1.5, '#FFFFFF', 0.85) + nuvem(900 - t * 7, 520, 1.2, '#FFFFFF', 0.75) + nuvem(500 + t * 5, 760, 1.8, '#F4F8FF', 0.6);
  s += `<g transform="translate(${-cam * 0.3} 0)">`;
  // montanhas
  s += `<path d="M -200 1250 L 120 640 L 300 900 L 520 520 L 760 960 L 980 600 L 1300 1250 Z" fill="#8A90D0"/><path d="M 120 640 L 170 740 L 80 760 Z M 520 520 L 580 640 L 470 650 Z M 980 600 L 1030 700 L 940 710 Z" fill="#FFFFFF"/>`;
  s += `<path d="M -200 1300 L 200 860 L 420 1100 L 700 820 L 1000 1120 L 1300 900 L 1300 1300 Z" fill="#6A72B8"/>`;
  // castelo na montanha
  s += `<g transform="translate(700 840)">` + [[-120, 140], [-50, 220], [30, 180], [100, 120]].map(([x, h]) => `<rect x="${x}" y="${-h}" width="60" height="${h}" fill="#F2EEF8" stroke="${IK}" stroke-width="5"/><path d="M ${x - 8} ${-h} L ${x + 30} ${-h - 70} L ${x + 68} ${-h} Z" fill="#5A7AE0" stroke="${IK}" stroke-width="5"/><rect x="${x + 22}" y="${-h + 40}" width="16" height="26" fill="#3A3A6A"/>`).join('') + `</g>`;
  s += `</g><g transform="translate(${-cam * 0.6} 0)">`;
  s += ikIlha(220, 560, 0.75, t, 3) + ikIlha(900, 760, 0.55, t, 4, { castelo: true }) + ikIlha(540, 300, 0.4, t, 5, { cachoeira: false });
  s += `</g>`;
  // dragões
  s += ikDragao(((t * 90) % 1500) - 200, 460 + Math.sin(t) * 30, 0.5, t) + ikDragao(1200 - ((t * 60 + 500) % 1500), 640, 0.32, t + 1, '#5A3E7A');
  if (campo) {
    s += `<g transform="translate(${-cam} 0)"><path d="M -200 1300 Q 300 1180 700 1260 Q 1000 1200 1400 1290 L 1400 1920 L -200 1920 Z" fill="#5AB050"/>`;
    s += `<path d="M -200 1500 Q 400 1400 1400 1480 L 1400 1920 L -200 1920 Z" fill="#4AA048"/>`;
    const r = ikR(41);
    for (let i = 0; i < 70; i++) { const x = r() * 1500 - 200, y = 1300 + r() * 620, a = Math.sin(t * 2 + i) * 6; s += `<path d="M ${x} ${y} q ${a} -30 ${a * 2} -50" stroke="#3A8A3A" stroke-width="5" fill="none"/>`; if (i % 3 === 0) s += `<circle cx="${x + 10}" cy="${y - 10}" r="7" fill="${['#FFE070', '#FF9AC8', '#FFFFFF'][i % 3]}"/>`; }
    s += `</g>`;
  }
  if (sombraDragao) s += `<rect width="1080" height="1920" fill="#000" opacity="${sombraDragao * 0.35}"/>`;
  return s;
}

// ---------- 5 · floresta mágica ----------
function ikFloresta(t, { cam = 0, escuro = 0, correr = false } = {}) {
  let s = ikCeu(t, ['#0E2A3A', '#1E5A5A', '#2E7A6A']);
  const camada = (sem, esp, cor, larg, k, copa) => {
    const r = ikR(sem), off = ((cam * k) % esp + esp) % esp;
    let c = '';
    for (let x = -esp - off; x < 1080 + esp; x += esp) {
      const xx = x + r() * esp * 0.3, w = larg * (0.8 + r() * 0.5);
      c += `<path d="M ${xx - w / 2} 1920 Q ${xx - w * 0.3} 900 ${xx - w * 0.25} 0 L ${xx + w * 0.25} 0 Q ${xx + w * 0.3} 900 ${xx + w / 2} 1920 Z" fill="${cor}"/>`;
      if (copa) c += `<ellipse cx="${xx}" cy="${120 + r() * 200}" rx="${w * 2.2}" ry="${w * 1.2}" fill="${copa}"/>`;
    }
    return c;
  };
  s += camada(61, 200, '#1A4A4A', 50, 0.25, '#1E5A4A');
  for (let i = 0; i < 5; i++) { const x = 100 + i * 220 + Math.sin(t * 0.5 + i) * 20; s += `<polygon points="${x},0 ${x + 60},0 ${x + 260},1600 ${x + 120},1600" fill="#B8FFE0" opacity="0.07"/>`; }
  s += camada(62, 320, '#123838', 90, 0.55, '#16443C');
  s += `<rect y="1450" width="1080" height="470" fill="#0E2E2A"/><path d="M -100 1500 Q 540 1420 1180 1500 L 1180 1920 L -100 1920 Z" fill="#14403A"/>`;
  // cogumelos e plantas que brilham
  const r = ikR(71);
  for (let i = 0; i < 14; i++) {
    const x = ((r() * 1300 - cam * 1.0) % 1300 + 1300) % 1300 - 100, y = 1480 + r() * 380, k = 0.6 + r() * 0.8, cor = ['#7FFFE0', '#C8A0FF', '#9FD8FF'][i % 3];
    s += `<g transform="translate(${x} ${y}) scale(${k})"><circle cx="0" cy="-40" r="50" fill="${cor}" opacity="0.25" filter="url(#animeGlow)"/><rect x="-8" y="-40" width="16" height="40" fill="#E8F0E0"/><ellipse cx="0" cy="-44" rx="34" ry="20" fill="${cor}" stroke="${IK}" stroke-width="4"/></g>`;
  }
  for (let i = 0; i < 18; i++) { const r2 = ikR(i + 80); s += `<circle cx="${(r2() * 1080 + Math.sin(t + i) * 40)}" cy="${700 + r2() * 900 + Math.cos(t * 1.2 + i) * 30}" r="5" fill="#E8FFB0" opacity="${0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i))}"/>`; }
  s += camada(63, 640, '#081C1C', 170, 1.0, null);
  if (escuro) s += `<rect width="1080" height="1920" fill="#000" opacity="${escuro}"/>`;
  if (correr) for (let i = 0; i < 40; i++) { const r3 = ikR(i + 400), y = r3() * 1920, x = ((r3() * 1400 + t * 2600) % 1400) - 200; s += `<line x1="${x}" y1="${y}" x2="${x + 180 + r3() * 160}" y2="${y}" stroke="#FFFFFF" stroke-width="${2 + r3() * 4}" opacity="0.35"/>`; }
  return s;
}
// Olhos brilhando entre as árvores.
function ikOlhos(x, y, t, { cor = '#FFD040', abre = 1, tam = 1 } = {}) {
  const h = 16 * tam * Math.max(0.05, abre);
  return [-1, 1].map((l) => `<ellipse cx="${x + l * 60 * tam}" cy="${y}" rx="${50 * tam}" ry="${h * 3}" fill="${cor}" opacity="0.3" filter="url(#animeGlow)"/><path d="M ${x + l * 60 * tam - 32 * tam} ${y} Q ${x + l * 60 * tam} ${y - h * 1.6} ${x + l * 60 * tam + 32 * tam} ${y} Q ${x + l * 60 * tam} ${y + h * 1.6} ${x + l * 60 * tam - 32 * tam} ${y} Z" fill="${cor}"/><ellipse cx="${x + l * 60 * tam}" cy="${y}" rx="${5 * tam}" ry="${h * 1.3}" fill="#1A0A00"/>`).join('');
}

// ---------- criatura escamada ----------
function ikCriatura(x, y, k, t, { rugindo = false, garra = 0, dissolver = 0 } = {}) {
  const resp = Math.sin(t * 2.4) * 8, boca = rugindo ? 70 + Math.sin(t * 20) * 10 : 14;
  const E1 = '#1E2A30', E2 = '#2E4A4A', E3 = '#4A8A7A';
  let s = `<g transform="translate(${x} ${y}) scale(${k})" opacity="${1 - dissolver}">`;
  s += `<ellipse cx="0" cy="0" rx="420" ry="50" fill="#000" opacity="0.35"/>`;
  // cauda e corpo
  s += `<path d="M 200 -260 Q 500 -200 560 -40 Q 480 -140 260 -170 Z" fill="${E1}" stroke="${IK}" stroke-width="8"/>`;
  s += `<path d="M -280 -40 Q -320 -420 -60 ${-560 + resp} Q 220 -560 300 -260 Q 340 -60 220 0 Z" fill="${E1}" stroke="${IK}" stroke-width="9"/>`;
  for (let i = 0; i < 26; i++) { const r = ikR(i + 500), xx = -220 + r() * 460, yy = -480 + r() * 440; s += `<path d="M ${xx} ${yy} q 22 -26 44 0 q -22 14 -44 0 Z" fill="${i % 3 ? E2 : E3}" opacity="0.85"/>`; }
  // espinhos nas costas
  for (let i = 0; i < 6; i++) { const xx = -180 + i * 70, yy = -520 + Math.abs(i - 2.5) * 30 + resp; s += `<path d="M ${xx - 22} ${yy + 20} L ${xx} ${yy - 70} L ${xx + 22} ${yy + 20} Z" fill="${E3}" stroke="${IK}" stroke-width="6"/>`; }
  // patas e garras
  for (const [px, lado] of [[-200, -1], [160, 1]]) {
    const lev = lado < 0 ? garra * 260 : 0;
    s += `<path d="M ${px - 50} ${-260 - lev} L ${px - 70} ${-10 - lev} L ${px + 60} ${-10 - lev} L ${px + 50} ${-260 - lev} Z" fill="${E1}" stroke="${IK}" stroke-width="8"/>`;
    for (let g = 0; g < 3; g++) s += `<path d="M ${px - 50 + g * 45} ${-12 - lev} l 12 46 l 14 -46 Z" fill="#E8E0D0" stroke="${IK}" stroke-width="5"/>`;
  }
  // cabeça
  s += `<g transform="translate(-300 ${-430 + resp})">`;
  s += `<path d="M 60 -90 L -150 -60 Q -230 -20 -220 30 L -40 ${30} Q 60 40 100 -10 Z" fill="${E1}" stroke="${IK}" stroke-width="9"/>`;
  s += `<path d="M -220 40 Q -120 ${40 + boca} 40 ${30 + boca * 0.6} L 60 20 L -40 40 Z" fill="${E2}" stroke="${IK}" stroke-width="8"/>`;
  s += `<path d="M -210 32 L -40 38 L -40 ${38 + boca * 0.5} Q -120 ${36 + boca} -210 ${36 + boca * 0.3} Z" fill="#5A0A1A"/>`;
  for (let i = 0; i < 6; i++) { const xx = -200 + i * 30; s += `<path d="M ${xx} 34 l 8 22 l 8 -22 Z" fill="#F4F0E0"/><path d="M ${xx + 6} ${38 + boca * 0.4} l 8 -18 l 8 18 Z" fill="#F4F0E0"/>`; }
  s += `<path d="M 0 -80 Q 60 -200 140 -210 Q 80 -150 60 -70 Z M -60 -76 Q -40 -170 20 -200 Q -10 -130 -10 -70 Z" fill="#3A3A40" stroke="${IK}" stroke-width="6"/>`;
  s += `<path d="M -110 -56 Q -80 -76 -50 -56 Q -80 -40 -110 -56 Z" fill="#FFD040"/><ellipse cx="-80" cy="-56" rx="5" ry="12" fill="#1A0A00"/><ellipse cx="-80" cy="-56" rx="50" ry="30" fill="#FFD040" opacity="0.35" filter="url(#animeGlow)"/>`;
  s += `</g>`;
  if (dissolver) for (let i = 0; i < 50; i++) { const r = ikR(i + 700), kk = dissolver; s += `<rect x="${-300 + r() * 600}" y="${-560 + r() * 560 - kk * 300 * r()}" width="14" height="14" fill="${E3}" opacity="${0.8}"/>`; }
  return s + `</g>`;
}
// Golpe de espada (arco luminoso).
function ikCorte(cx, cy, raio, ang, k, cor = '#BFE8FF') {
  if (k <= 0 || k >= 1) return '';
  const a0 = ((ang - 70) * Math.PI) / 180, a1 = ((ang - 70 + 140 * Math.min(1, k * 1.6)) * Math.PI) / 180;
  const p = (a, r) => `${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
  const op = 1 - Math.max(0, k - 0.5) * 2;
  return `<path d="M ${p(a0, raio)} A ${raio} ${raio} 0 0 1 ${p(a1, raio)} L ${p(a1, raio * 0.82)} A ${raio * 0.82} ${raio * 0.82} 0 0 0 ${p(a0, raio * 0.95)} Z" fill="${cor}" opacity="${op}"/>` +
    `<path d="M ${p(a0, raio)} A ${raio} ${raio} 0 0 1 ${p(a1, raio)}" fill="none" stroke="#FFFFFF" stroke-width="10" opacity="${op}"/>` +
    `<path d="M ${p(a0, raio)} A ${raio} ${raio} 0 0 1 ${p(a1, raio)}" fill="none" stroke="${cor}" stroke-width="40" opacity="${op * 0.4}" filter="url(#animeGlow)"/>`;
}
// Espada na mão (para o busto da aventureira).
function ikEspada(x, y, rot, brilho = 0.6) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-14" y="-620" width="28" height="560" rx="6" fill="#DDE8F4" stroke="${IK}" stroke-width="6"/><path d="M -14 -620 L 0 -680 L 14 -620 Z" fill="#DDE8F4" stroke="${IK}" stroke-width="6"/>` +
    `<rect x="-3" y="-600" width="6" height="520" fill="#FFFFFF"/><rect x="-14" y="-620" width="28" height="560" fill="#9FD8FF" opacity="${brilho * 0.5}" filter="url(#animeGlow)"/>` +
    `<rect x="-80" y="-70" width="160" height="26" rx="10" fill="#C9A24A" stroke="${IK}" stroke-width="6"/><rect x="-16" y="-44" width="32" height="120" rx="10" fill="#5A3A2A" stroke="${IK}" stroke-width="6"/><circle cx="0" cy="86" r="18" fill="#C9A24A" stroke="${IK}" stroke-width="5"/></g>`;
}
// Aventureira de corpo inteiro (pouso / luta).
function ikAventureiraCorpo(x, y, k, t, { espada = 30, capa = 1 } = {}) {
  const sw = Math.sin(t * 3) * 10;
  let s = `<g transform="translate(${x} ${y}) scale(${k})">`;
  s += `<path d="M -90 -640 Q -200 -300 ${-160 - sw * capa} -20 L 160 ${-20 + sw} Q 200 -300 90 -640 Z" fill="#5A2440" stroke="${IK}" stroke-width="8"/>`;
  s += `<path d="M -30 -380 L -90 -10 M 30 -380 L 100 -10" stroke="${IK}" stroke-width="48" stroke-linecap="round"/><path d="M -30 -380 L -90 -10 M 30 -380 L 100 -10" stroke="#3A2A24" stroke-width="34" stroke-linecap="round"/>`;
  s += `<path d="M -80 -660 L 80 -660 L 96 -380 L -96 -380 Z" fill="#6A4A30" stroke="${IK}" stroke-width="8"/><path d="M -96 -420 L 96 -420" stroke="#C9A24A" stroke-width="16"/>`;
  s += `<path d="M -80 -640 L -150 -440" stroke="${IK}" stroke-width="40" stroke-linecap="round"/><path d="M -80 -640 L -150 -440" stroke="#6A4A30" stroke-width="28" stroke-linecap="round"/>`;
  s += `<path d="M 80 -640 L 170 -520" stroke="${IK}" stroke-width="40" stroke-linecap="round"/><path d="M 80 -640 L 170 -520" stroke="#6A4A30" stroke-width="28" stroke-linecap="round"/>`;
  s += ikEspada(180, -520, espada, 0.8);
  s += `<path d="M -100 -840 Q -130 -560 -80 -470 L 80 -470 Q 130 -560 100 -840 Z" fill="#DDE2F2" stroke="${IK}" stroke-width="7"/>`;
  s += `<ellipse cx="0" cy="-760" rx="86" ry="98" fill="#F8DCC8" stroke="${IK}" stroke-width="8"/><path d="M -98 -770 Q -100 -890 0 -888 Q 100 -890 98 -770 Q 40 -840 -20 -810 Q -70 -820 -98 -770 Z" fill="#DDE2F2" stroke="${IK}" stroke-width="7"/>`;
  s += `<path d="M -50 -760 l 34 -8 M 50 -760 l -34 -8" stroke="${IK}" stroke-width="8" stroke-linecap="round"/><ellipse cx="-34" cy="-742" rx="10" ry="14" fill="#8A5AD8"/><ellipse cx="34" cy="-742" rx="10" ry="14" fill="#8A5AD8"/>`;
  return s + `</g>`;
}

// ---------- final: castelo sombrio e a esfera ----------
function ikCasteloSombrio(t, { raio = 0 } = {}) {
  let s = ikCeu(t, ['#08040E', '#1E0E2E', '#3A1A3A'], { estrelas: 70 });
  s += `<circle cx="300" cy="380" r="110" fill="#E8D8F0" opacity="0.9"/><circle cx="300" cy="380" r="260" fill="#C8A0E0" opacity="0.15" filter="url(#animeSoft)"/>`;
  s += nuvem(500 + t * 6, 520, 1.6, '#2A1440', 0.8) + nuvem(200 - t * 4, 700, 1.3, '#1E0E2E', 0.8);
  s += `<path d="M -100 1920 L -100 1300 L 300 1100 L 520 1180 L 700 1020 L 1180 1240 L 1180 1920 Z" fill="#0E0814"/>`;
  s += `<g transform="translate(600 1040)">` + [[-180, 380], [-90, 520], [0, 640], [90, 470], [170, 330]].map(([x, h]) => `<rect x="${x - 38}" y="${-h}" width="76" height="${h}" fill="#140C1C" stroke="#05030A" stroke-width="5"/><path d="M ${x - 48} ${-h} L ${x} ${-h - 110} L ${x + 48} ${-h} Z" fill="#1E1028" stroke="#05030A" stroke-width="5"/>`).join('');
  s += `<rect x="-14" y="-540" width="28" height="44" fill="#FF3050"/><rect x="-14" y="-540" width="28" height="44" fill="#FF3050" opacity="0.7" filter="url(#animeGlow)"/><rect x="76" y="-380" width="22" height="30" fill="#FF7040" opacity="0.8"/></g>`;
  if (raio) s += `<path d="M 820 0 L 760 300 L 840 320 L 740 700" stroke="#E8D8FF" stroke-width="10" fill="none" opacity="${raio}"/><rect width="1080" height="1920" fill="#E8D8FF" opacity="${raio * 0.25}"/>`;
  return s;
}
function ikSalaEsfera(t, { imagem = '' } = {}) {
  let s = animeDefs() + `<rect width="1080" height="1920" fill="#0A0610"/>`;
  for (let i = 0; i < 4; i++) { const x = 40 + i * 300; s += `<rect x="${x}" y="200" width="90" height="1500" fill="#140C1E"/>`; }
  s += `<path d="M 380 0 L 700 0 L 640 400 L 440 400 Z" fill="#2A1438"/>`;
  s += `<rect x="420" y="1450" width="240" height="470" fill="#1E1428" stroke="${IK}" stroke-width="7"/><rect x="380" y="1420" width="320" height="50" fill="#2A1E36" stroke="${IK}" stroke-width="7"/>`;
  s += `<circle cx="540" cy="1250" r="330" fill="#7A50FF" opacity="${0.25 + 0.1 * Math.sin(t * 3)}" filter="url(#animeSoft)"/>`;
  s += `<defs><radialGradient id="esferaG" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#E8E0FF"/><stop offset="0.5" stop-color="#7A50FF"/><stop offset="1" stop-color="#1A0A40"/></radialGradient><clipPath id="esferaC"><circle cx="540" cy="1250" r="190"/></clipPath></defs>`;
  s += `<circle cx="540" cy="1250" r="190" fill="url(#esferaG)" stroke="#C8B0FF" stroke-width="6"/>`;
  if (imagem) s += `<g clip-path="url(#esferaC)" opacity="0.85">${imagem}</g>`;
  s += `<ellipse cx="480" cy="1170" rx="50" ry="30" fill="#FFFFFF" opacity="0.6"/>`;
  for (let i = 0; i < 16; i++) { const a = t * 0.9 + i * 0.4, r = 230 + (i % 3) * 30; s += `<circle cx="${540 + Math.cos(a) * r}" cy="${1250 + Math.sin(a) * r * 0.4}" r="4" fill="#C8B0FF" opacity="0.8"/>`; }
  return s;
}
// Silhueta do homem de preto (de costas, olhando a esfera).
function ikHomemCostas(x, y, k, t) {
  return `<g transform="translate(${x} ${y}) scale(${k})"><path d="M -260 600 L -220 -40 Q -200 -160 -90 -190 L 90 -190 Q 200 -160 220 -40 L 260 600 Z" fill="#06040A"/>` +
    `<ellipse cx="0" cy="-320" rx="120" ry="140" fill="#06040A"/><path d="M -140 -360 Q -150 -500 0 -500 Q 150 -500 140 -360 Q 140 -200 100 -150 L -100 -150 Q -140 -200 -140 -360 Z" fill="#0E0816"/>` +
    `<path d="M -220 -40 Q -200 -160 -90 -190" fill="none" stroke="#7A50FF" stroke-width="6" opacity="0.6"/></g>`;
}
// Celular com "sem serviço".
function ikCelular(t, { bateria = 100, texto = 'SEM SERVIÇO' } = {}) {
  let s = `<g transform="translate(540 980) rotate(-4)"><rect x="-260" y="-480" width="520" height="960" rx="54" fill="#121418" stroke="${IK}" stroke-width="10"/><rect x="-236" y="-456" width="472" height="912" rx="40" fill="#1E2A44"/>`;
  s += `<text x="-200" y="-400" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="#fff">18:42</text><text x="200" y="-400" text-anchor="end" font-family="Oswald, sans-serif" font-weight="700" font-size="30" fill="#fff">${bateria}%</text>`;
  s += `<text x="0" y="-60" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="56" fill="#FF6A7A">${texto}</text>`;
  s += [0, 1, 2, 3].map((i) => `<rect x="${-60 + i * 34}" y="${40 - i * 20}" width="22" height="${30 + i * 20}" rx="4" fill="#3A4258"/>`).join('') + `<path d="M -80 120 L 80 -20" stroke="#FF6A7A" stroke-width="10"/>`;
  s += `<text x="0" y="240" text-anchor="middle" font-family="Oswald, sans-serif" font-size="34" fill="#AFC0E0">GPS: localização desconhecida</text></g>`;
  return s;
}
// Linhas de velocidade em leque (corrida/ação).
function ikVelocidade(t, cor = '#FFFFFF', op = 0.5) {
  let s = '';
  for (let i = 0; i < 50; i++) { const r = ikR(i + 900), a = r() * Math.PI * 2, r0 = 520 + ((t * 900 + r() * 400) % 400); s += `<line x1="${540 + Math.cos(a) * r0}" y1="${960 + Math.sin(a) * r0}" x2="${540 + Math.cos(a) * (r0 + 500)}" y2="${960 + Math.sin(a) * (r0 + 500)}" stroke="${cor}" stroke-width="${3 + r() * 6}" opacity="${op}"/>`; }
  return s;
}
