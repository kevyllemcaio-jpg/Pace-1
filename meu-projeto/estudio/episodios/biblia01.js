// LIFESTYLE + BÍBLIA — "3 minutos com a Bíblia pra quando a ansiedade aperta" (Filipenses 4:6-7)
// Estética de manhã: luz da janela, café com vapor, Bíblia aberta, caderno com letra à mão, piano calmo.
// Texto citado: Almeida Revista e Corrigida (citação curta de um trecho).

window.FONTE_LEGENDA = 'Playfair, Georgia, serif';
window.LEGENDA_Y = 1610;
window.TRATAR_VOZ = true;
window.TRILHA = 'calma';
const E = [];
const COR = { creme: '#F4EADC', bege: '#E8D5BE', madeira: '#B98A5E', madeira2: '#9C7048', marrom: '#5A4030', salvia: '#9CAF88', tinta: '#3A2E26', dourado: '#C9A24A' };
const SERIF = 'Playfair, Georgia, serif', MAO = 'Caveat, cursive';

// ---------- cenário ----------
function mesaManha(t, { luz = 1, zoom = 1, cy = 1200 } = {}) {
  let s = `<defs><linearGradient id="paredeL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7EFE4"/><stop offset="1" stop-color="#EADBC6"/></linearGradient>` +
    `<linearGradient id="raio" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF4D6" stop-opacity="0.75"/><stop offset="1" stop-color="#FFF4D6" stop-opacity="0"/></linearGradient>` +
    `<filter id="suave"><feGaussianBlur stdDeviation="18"/></filter><filter id="suave6"><feGaussianBlur stdDeviation="6"/></filter></defs>`;
  s += `<rect width="1080" height="1920" fill="url(#paredeL)"/>`;
  // janela com cortina de linho e céu de manhã
  s += `<rect x="560" y="140" width="440" height="640" rx="8" fill="#DCEAF2"/><rect x="560" y="140" width="440" height="640" rx="8" fill="#FFF4D6" opacity="0.45"/>`;
  s += `<path d="M 560 460 L 1000 460 M 780 140 L 780 780" stroke="#FFFFFF" stroke-width="16"/><rect x="545" y="125" width="470" height="670" rx="10" fill="none" stroke="#FFFFFF" stroke-width="22"/>`;
  s += `<path d="M 520 110 Q 560 450 530 820 L 620 820 Q 600 450 610 110 Z" fill="#F2E6D6" opacity="0.95"/><path d="M 545 110 Q 580 450 560 820" fill="none" stroke="#E2D2BC" stroke-width="5"/>`;
  // planta pendurada e quadro com versículo
  s += `<line x1="250" y1="0" x2="250" y2="250" stroke="#B9A07A" stroke-width="4"/><path d="M 190 250 L 310 250 L 290 330 L 210 330 Z" fill="#E8D5BE" stroke="#C8A27A" stroke-width="4"/>`;
  for (let i = 0; i < 9; i++) { const a = -0.4 + i * 0.1; s += `<path d="M ${250 + Math.sin(a) * 30} 330 Q ${250 + Math.sin(a) * 80 + Math.sin(t + i) * 6} ${430 + i * 14} ${250 + Math.sin(a) * 60} ${520 + i * 20}" fill="none" stroke="${COR.salvia}" stroke-width="6"/>`; for (let j = 0; j < 3; j++) s += `<ellipse cx="${250 + Math.sin(a) * (50 + j * 10)}" cy="${380 + i * 14 + j * 50}" rx="14" ry="8" fill="${COR.salvia}" transform="rotate(${30 * (i % 2 ? 1 : -1)} ${250 + Math.sin(a) * (50 + j * 10)} ${380 + i * 14 + j * 50})"/>`; }
  s += `<rect x="90" y="560" width="300" height="220" rx="6" fill="#FBF7F0" stroke="#D9C6AA" stroke-width="10"/><text x="240" y="660" text-anchor="middle" font-family="${MAO}" font-size="52" fill="${COR.tinta}">a paz de Deus</text><text x="240" y="720" text-anchor="middle" font-family="${MAO}" font-size="40" fill="${COR.madeira2}">Fp 4:7</text>`;
  // raios de luz com poeirinha
  s += `<polygon points="560,140 1000,140 760,1920 -200,1920" fill="url(#raio)" opacity="${0.55 * luz}"/>`;
  for (let i = 0; i < 26; i++) { const r = aleatorio(i + 5); const x = 300 + r() * 600, y = ((r() * 1500 + t * (12 + r() * 14)) % 1500) + 200; s += `<circle cx="${x + Math.sin(t + i) * 10}" cy="${y}" r="${1.5 + r() * 2.5}" fill="#FFFFFF" opacity="${0.4 + 0.4 * Math.sin(t * 2 + i)}"/>`; }
  // mesa de madeira
  s += `<rect y="1180" width="1080" height="740" fill="${COR.madeira}"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M 0 ${1210 + i * 80} Q 540 ${1190 + i * 80 + (i % 2 ? 14 : -14)} 1080 ${1210 + i * 80}" fill="none" stroke="${COR.madeira2}" stroke-width="4" opacity="0.5"/>`;
  s += `<rect y="1180" width="1080" height="22" fill="#A97C52"/>`;
  s += `<polygon points="560,1180 1000,1180 900,1920 -100,1920" fill="#FFF4D6" opacity="${0.18 * luz}"/>`;
  return zoom === 1 ? s : camera(s, zoom, 540, cy);
}
function cafe(x, y, esc = 1, t = 0) {
  let s = `<g transform="translate(${x} ${y}) scale(${esc})">`;
  s += `<ellipse cx="0" cy="96" rx="140" ry="22" fill="#000" opacity="0.15"/><ellipse cx="0" cy="88" rx="120" ry="24" fill="#F7F1E8" stroke="#D9C6AA" stroke-width="5"/>`;
  s += `<path d="M -80 -60 L -70 70 Q 0 100 70 70 L 80 -60 Z" fill="#F7F1E8" stroke="#D9C6AA" stroke-width="6"/><path d="M 78 -30 Q 140 -30 130 20 Q 120 60 72 50" fill="none" stroke="#F7F1E8" stroke-width="18"/><path d="M 78 -30 Q 140 -30 130 20 Q 120 60 72 50" fill="none" stroke="#D9C6AA" stroke-width="4"/>`;
  s += `<ellipse cx="0" cy="-60" rx="80" ry="18" fill="#6A4630" stroke="#D9C6AA" stroke-width="5"/><ellipse cx="-10" cy="-62" rx="30" ry="6" fill="#C89A6A" opacity="0.6"/>`;
  for (let i = 0; i < 3; i++) { const k = (t * 0.35 + i / 3) % 1; s += `<path d="M ${-30 + i * 30} ${-90 - k * 260} q ${20 * Math.sin(t + i)} -40 0 -80 q ${-20 * Math.sin(t + i)} -40 0 -80" fill="none" stroke="#FFFFFF" stroke-width="${10 - k * 6}" stroke-linecap="round" opacity="${0.7 * (1 - k)}" filter="url(#suave6)"/>`; }
  return s + `</g>`;
}
// Bíblia aberta; destaque = 0..1 do trecho grifado.
function biblia(x, y, esc = 1, { destaque = 0, rot = -4 } = {}) {
  let s = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${esc})">`;
  s += `<ellipse cx="0" cy="250" rx="420" ry="40" fill="#000" opacity="0.15"/>`;
  s += `<path d="M -420 -240 L -10 -270 L -10 250 L -420 230 Z" fill="#6A3A2A"/><path d="M 420 -240 L 10 -270 L 10 250 L 420 230 Z" fill="#6A3A2A"/>`;
  s += `<path d="M -400 -250 Q -200 -280 0 -250 L 0 240 Q -200 210 -400 236 Z" fill="#FBF6EA" stroke="#D9C6AA" stroke-width="4"/><path d="M 400 -250 Q 200 -280 0 -250 L 0 240 Q 200 210 400 236 Z" fill="#F7F0E0" stroke="#D9C6AA" stroke-width="4"/>`;
  s += `<path d="M 0 -250 L 0 240" stroke="#CDB894" stroke-width="6"/>`;
  s += `<text x="-200" y="-200" text-anchor="middle" font-family="${SERIF}" font-weight="700" font-size="26" fill="${COR.tinta}">FILIPENSES</text><text x="200" y="-200" text-anchor="middle" font-family="${SERIF}" font-weight="700" font-size="26" fill="${COR.tinta}">4</text>`;
  for (let i = 0; i < 14; i++) for (const lado of [-1, 1]) {
    const y0 = -160 + i * 28, w = 300 - (i % 4) * 30;
    const x0 = lado < 0 ? -380 : 30;
    if (lado > 0 && i >= 3 && i <= 6) s += `<rect x="${x0 - 6}" y="${y0 - 12}" width="${(w + 12) * Math.min(1, Math.max(0, destaque * 4 - (i - 3)))}" height="22" fill="#F7D96A" opacity="0.75"/>`;
    s += `<rect x="${x0}" y="${y0 - 5}" width="${w}" height="7" rx="3" fill="#8A7A66" opacity="0.55"/>`;
  }
  s += `<path d="M 160 -270 L 160 -120 L 175 -140 L 190 -120 L 190 -270 Z" fill="#B23A3A"/>`;
  return s + `</g>`;
}
function caderno(x, y, escala, linhas, progresso, t) {
  let s = `<g transform="translate(${x} ${y}) rotate(3) scale(${escala})">`;
  s += `<rect x="-330" y="-430" width="660" height="860" rx="16" fill="#000" opacity="0.15" transform="translate(10 14)"/><rect x="-330" y="-430" width="660" height="860" rx="16" fill="#FCF9F2" stroke="#D9C6AA" stroke-width="5"/>`;
  for (let i = 0; i < 14; i++) s += `<line x1="-290" y1="${-330 + i * 56}" x2="290" y2="${-330 + i * 56}" stroke="#BFD2E0" stroke-width="2.5"/>`;
  s += `<line x1="-240" y1="-430" x2="-240" y2="430" stroke="#E8A0A0" stroke-width="3"/>`;
  for (let i = -9; i <= 9; i++) s += `<circle cx="${i * 34}" cy="-412" r="8" fill="#D9C6AA"/>`;
  let ultimo = null;
  const total = linhas.reduce((a, [txt]) => a + txt.length, 0);
  let resta = Math.floor(progresso * total * 1.05);
  linhas.forEach(([txt, cor], i) => {
    const vis = Math.max(0, Math.min(txt.length, resta));
    resta -= txt.length;
    if (vis <= 0) return;
    const yy = -346 + i * 112;
    s += `<text x="-220" y="${yy}" font-family="${MAO}" font-size="48" fill="${cor || COR.tinta}">${esc(txt.slice(0, vis))}</text>`;
    if (vis < txt.length) ultimo = [-220 + vis * 19, yy];
  });
  if (ultimo) s += `<g transform="translate(${ultimo[0]} ${ultimo[1] - 10}) rotate(35)"><rect x="-9" y="-150" width="18" height="150" rx="6" fill="${COR.tinta}"/><path d="M -9 0 L 0 26 L 9 0 Z" fill="#C9A24A"/></g>`;
  return s + `</g>`;
}
// Cartão de lição (papel com fita adesiva).
function cartaoLicao(lt, t0, num, titulo, sub) {
  if (lt < t0) return '';
  const k = salto(lim((lt - t0) / 0.45));
  return `<g transform="translate(540 ${mix(1500, 640, k)}) rotate(${mix(8, -2, k)})"><rect x="-400" y="-190" width="800" height="380" rx="10" fill="#000" opacity="0.12" transform="translate(10 14)"/>` +
    `<rect x="-400" y="-190" width="800" height="380" rx="10" fill="#FCF9F2"/><rect x="-80" y="-216" width="160" height="50" fill="#E8D5BE" opacity="0.85" transform="rotate(-3)"/>` +
    `<text x="0" y="-80" text-anchor="middle" font-family="${MAO}" font-size="64" fill="${COR.madeira2}">lição ${num}</text>` +
    `<text x="0" y="20" text-anchor="middle" font-family="${SERIF}" font-weight="700" font-size="${Math.min(66, 1050 / titulo.length)}" fill="${COR.tinta}">${esc(titulo)}</text>` +
    `<text x="0" y="100" text-anchor="middle" font-family="${MAO}" font-size="52" fill="${COR.tinta}" opacity="0.8">${esc(sub)}</text></g>`;
}
// Versículo em letreiro elegante, linha a linha.
function versiculo(lt, linhas, t0, passo = 0.9) {
  let s = `<rect x="70" y="250" width="940" height="${120 + linhas.length * 90}" rx="20" fill="#FCF9F2" opacity="0.93"/>`;
  linhas.forEach((l, i) => {
    const op = lim((lt - t0 - i * passo) / 0.6);
    s += `<text x="540" y="${350 + i * 90}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-weight="600" font-size="50" fill="${COR.tinta}" opacity="${op}">${esc(l)}</text>`;
  });
  return s;
}

// ---------- cenas ----------
// 1 — gancho
E.push({
  fala: 'Se a ansiedade apertou hoje, pega um café e fica aqui comigo. São só três minutos.',
  capa: 0.3,
  desenhar(lt, c) {
    let s = mesaManha(lt, { zoom: 1.0 }) + biblia(470, 1520, 1.0) + cafe(880, 1330, 1.0, lt);
    s += `<rect x="60" y="230" width="960" height="430" rx="26" fill="#FCF9F2" opacity="0.9"/>`;
    s += `<text x="540" y="340" text-anchor="middle" font-family="${MAO}" font-size="76" fill="${COR.madeira2}">3 minutos com a Bíblia</text>`;
    s += `<text x="540" y="460" text-anchor="middle" font-family="${SERIF}" font-weight="700" font-size="66" fill="${COR.tinta}">PRA QUANDO A</text>`;
    s += `<text x="540" y="570" text-anchor="middle" font-family="${SERIF}" font-weight="700" font-size="92" fill="#B05A3A">ANSIEDADE APERTA</text>`;
    return s;
  },
});
// 2 — o texto
E.push({
  fala: 'Hoje a gente vai ler Filipenses, capítulo quatro, versículos seis e sete.',
  desenhar(lt, c) {
    let s = mesaManha(lt, { zoom: mix(1.0, 1.35, suave(lt / c.dur)), cy: 1500 }) ;
    s += camera(biblia(470, 1520, 1.0) + cafe(880, 1330, 1.0, lt), mix(1.0, 1.35, suave(lt / c.dur)), 540, 1500);
    s += `<g transform="translate(540 420)"><rect x="-330" y="-80" width="660" height="150" rx="75" fill="#FCF9F2" opacity="0.92"/><text x="0" y="20" text-anchor="middle" font-family="${SERIF}" font-weight="700" font-size="64" fill="${COR.tinta}" opacity="${lim(lt / 0.6)}">Filipenses 4:6-7</text></g>`;
    return s;
  },
});
// 3 — Paulo preso
E.push({
  fala: 'E tem um detalhe que muda tudo: Paulo escreveu essa carta *de dentro de uma prisão*. Sem saber se ia sair vivo.',
  desenhar(lt, c) {
    let s = mesaManha(lt, { luz: 0.4 }) + `<rect width="1080" height="1920" fill="#3A2E26" opacity="0.35"/>`;
    s += `<g transform="translate(540 820)"><rect x="-300" y="-330" width="600" height="660" rx="16" fill="#E8D5BE" stroke="#8A6A4A" stroke-width="10"/>`;
    for (let i = 0; i < 6; i++) s += `<rect x="${-260 + i * 100}" y="-330" width="20" height="660" fill="#5A4030"/>`;
    s += `<rect x="-300" y="-30" width="600" height="20" fill="#5A4030"/><circle cx="0" cy="-150" r="70" fill="#FFF4D6" opacity="0.6" filter="url(#suave)"/></g>`;
    if (lt > c.w('prisão')) s += `<g opacity="${lim((lt - c.w('prisão')) / 0.5)}"><text x="540" y="1340" text-anchor="middle" font-family="${MAO}" font-size="84" fill="#FCF9F2">escrita na prisão</text><text x="540" y="1420" text-anchor="middle" font-family="${MAO}" font-size="56" fill="#E8D5BE">(Roma, por volta do ano 60)</text></g>`;
    return s;
  },
});
// 4 — o versículo
const VERSO = ['"Não estejais inquietos', 'por coisa alguma; antes,', 'as vossas petições sejam', 'em tudo conhecidas diante de Deus,', 'pela oração e súplica,', 'com ação de graças.', 'E a paz de Deus, que excede', 'todo o entendimento, guardará', 'os vossos corações..."'];
E.push({
  fala: 'Não estejais inquietos por coisa alguma; antes, as vossas petições sejam em tudo conhecidas diante de Deus, pela oração e súplica, com ação de graças. E a paz de Deus, que excede todo o entendimento, guardará os vossos corações.',
  semLegenda: true,
  desenhar(lt, c) {
    let s = mesaManha(lt, { zoom: 1.08, cy: 1300 }) + camera(biblia(470, 1520, 1.0, { destaque: lim(lt / c.dur) }) + cafe(880, 1330, 1.0, lt), 1.08, 540, 1300);
    s += versiculo(lt, VERSO, 0.2, (c.dur - 1.5) / VERSO.length);
    s += `<text x="540" y="${350 + VERSO.length * 90 + 10}" text-anchor="middle" font-family="${MAO}" font-size="48" fill="${COR.madeira2}">Filipenses 4:6-7</text>`;
    return s;
  },
});
// 5 — lição 1
E.push({
  fala: 'Primeiro: Paulo não diz finge que não tá preocupado. Ele diz: *transforma a preocupação em oração*. Fala com Deus sobre o problema. Com detalhes.',
  desenhar(lt, c) {
    let s = mesaManha(lt) + biblia(470, 1560, 0.9) + cafe(900, 1380, 0.9, lt);
    s += cartaoLicao(lt, 0.2, 1, 'PREOCUPAÇÃO → ORAÇÃO', 'conta tudo pra Deus, com detalhes');
    return s;
  },
});
// 6 — lição 2
E.push({
  fala: 'Segundo: *com ação de graças*. Antes de pedir, agradece por uma coisa. A gratidão muda o foco do que falta... pro que você já tem.',
  desenhar(lt, c) {
    let s = mesaManha(lt) + biblia(470, 1560, 0.9) + cafe(900, 1380, 0.9, lt);
    s += cartaoLicao(lt, 0.2, 2, 'COMECE AGRADECENDO', 'do que falta → pro que já tem');
    return s;
  },
});
// 7 — lição 3
E.push({
  fala: 'Terceiro: a palavra guardará. Filipos era uma cidade cheia de soldados romanos. A paz de Deus fica como *um soldado de guarda* na porta do seu coração. O problema pode até continuar... mas a paz chega antes da solução.',
  desenhar(lt, c) {
    let s = mesaManha(lt) + biblia(470, 1560, 0.9) + cafe(900, 1380, 0.9, lt);
    s += cartaoLicao(lt, 0.2, 3, 'A PAZ MONTA GUARDA', 'ela chega antes da solução');
    if (lt > c.w('soldado')) s += pulo(`<g transform="translate(860 1080)"><path d="M -70 -90 L 70 -90 L 60 40 Q 0 110 -60 40 Z" fill="#C9A24A" stroke="#8A6A2A" stroke-width="8"/><path d="M -30 -40 L 0 20 L 40 -60" fill="none" stroke="#FCF9F2" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></g>`, lt, 860, 1080, c.w('soldado'));
    return s;
  },
});
// 8 — prática no caderno
const PRATICA = [['hoje:', COR.madeira2], ['1. a prova → "me ajuda, Deus"', '#3A2E26'], ['   obrigado: estudei ontem ✓', '#6A8A5A'], ['2. a conta → "me dá sabedoria"', '#3A2E26'], ['   obrigado: tenho trabalho ✓', '#6A8A5A'], ['3. o futuro → "cuida de mim"', '#3A2E26'], ['   obrigado: tô vivo hoje ✓', '#6A8A5A']];
E.push({
  fala: 'Pra praticar hoje: escreve três preocupações. Do lado de cada uma, uma oração curta... e um motivo de gratidão.',
  desenhar(lt, c) {
    let s = mesaManha(lt, { zoom: 1.12, cy: 1400 }) + camera(cafe(900, 1380, 0.9, lt), 1.12, 540, 1400);
    s += caderno(520, 1040, 1.05, PRATICA, lim(lt / (c.dur - 0.5)), lt);
    return s;
  },
});
// 9 — final
E.push({
  fala: 'Salva esse vídeo pra quando precisar. E me conta nos comentários: qual versículo te acalma?',
  desenhar(lt, c) {
    let s = mesaManha(lt) + biblia(470, 1520, 1.0) + cafe(880, 1330, 1.0, lt);
    s += `<g opacity="${lim(lt / 0.6)}"><rect x="110" y="300" width="860" height="420" rx="26" fill="#FCF9F2" opacity="0.92"/>`;
    s += `<text x="540" y="430" text-anchor="middle" font-family="${MAO}" font-size="80" fill="${COR.madeira2}">salva pra quando precisar</text>`;
    s += `<text x="540" y="560" text-anchor="middle" font-family="${SERIF}" font-weight="700" font-size="56" fill="${COR.tinta}">qual versículo te acalma?</text>`;
    s += `<text x="540" y="650" text-anchor="middle" font-size="60">🤍 👇</text></g>`;
    return s;
  },
});

window.CAPA = () => {
  let s = mesaManha(0.5) + biblia(470, 1520, 1.0, { destaque: 1 }) + cafe(880, 1330, 1.0, 0.5);
  s += `<rect x="60" y="220" width="960" height="470" rx="26" fill="#FCF9F2" opacity="0.92"/>`;
  s += `<text x="540" y="330" text-anchor="middle" font-family="${MAO}" font-size="80" fill="${COR.madeira2}">3 minutos com a Bíblia</text>`;
  s += `<text x="540" y="460" text-anchor="middle" font-family="${SERIF}" font-weight="700" font-size="72" fill="${COR.tinta}">PRA QUANDO A</text>`;
  s += `<text x="540" y="590" text-anchor="middle" font-family="${SERIF}" font-weight="700" font-size="96" fill="#B05A3A">ANSIEDADE APERTA</text>`;
  s += `<text x="540" y="660" text-anchor="middle" font-family="${MAO}" font-size="48" fill="${COR.madeira2}">Filipenses 4:6-7</text>`;
  return s;
};

criarEpisodio(E, { voz: 'pt-BR-ThalitaMultilingualNeural', velocidade: '-4%' });
