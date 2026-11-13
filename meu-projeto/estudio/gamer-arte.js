// gamer-arte.js — desenho do gamer desleixado (estilo do vídeo de referência: traço grosso, magrelo e curvado,
// rosto comprido, nariz grande de ponta vermelha, olhos enormes e desiguais, dentes separados com um faltando,
// cabelo comprido saindo do boné de aba de lado, camiseta verde furada com estampa, moletom remendado e
// chinelo amarrado) e do avatar herói (musculoso, armadura com linhas neon).

const GT = '#1A1620';
const GP = { pele: '#F2C7A2', pele2: '#DFA47E', nariz: '#E89880', cabelo: '#3A2C24', bone: '#BDB6A0', bone2: '#9E977F', aba: '#5C6270', camisa: '#6F9A5A', camisa2: '#57804A', calca: '#A9A9AE', calca2: '#8C8C92' };
const traco = (w = 8) => `stroke="${GT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

// ---------- cabeça (centro do rosto em 0,0; ~ 340 x 520 com o boné) ----------
function gmCabeca({ expr = 'nervoso', t = 0, olhar = [0, 0], suor = false, lagrima = false, fala = false, semBone = false } = {}) {
  const piscar = expr !== 'sono' && ((t * 1.0 + 0.4) % 3.9) < 0.12;
  let s = '';
  // cabelo de trás (mechas compridas saindo pelos lados)
  const mechas = [[-150, -70, -215, 10], [-160, -20, -230, 70], [-150, 30, -205, 120], [-140, 80, -175, 150], [150, -80, 210, -10], [158, -30, 232, 40], [150, 20, 214, 100], [140, 70, 180, 140]];
  for (const [x0, y0, x1, y1] of mechas) s += `<path d="M ${x0} ${y0 - 30} Q ${(x0 + x1) / 2 + (x1 > 0 ? 6 : -6)} ${(y0 + y1) / 2 - 10} ${x1} ${y1} Q ${(x0 + x1) / 2} ${(y0 + y1) / 2 + 20} ${x0} ${y0 + 26} Z" fill="${GP.cabelo}" ${traco(6)}/>`;
  // orelhas
  s += `<path d="M -138 -10 Q -184 -24 -180 22 Q -176 66 -132 58 Z" fill="${GP.pele}" ${traco(7)}/><path d="M -150 6 Q -164 20 -150 40" fill="none" ${traco(4)} opacity="0.6"/>`;
  s += `<path d="M 136 -14 Q 178 -26 176 18 Q 172 60 132 52 Z" fill="${GP.pele}" ${traco(7)}/>`;
  // rosto comprido
  const face = `M -136 -70 Q -142 -178 0 -184 Q 142 -178 138 -70 Q 146 70 98 150 Q 50 214 0 216 Q -56 214 -100 152 Q -146 80 -136 -70 Z`;
  s += `<path d="${face}" fill="${GP.pele}"/><path d="M 60 -170 Q 140 -120 138 -70 Q 146 70 98 150 Q 60 200 10 214 Q 90 150 110 40 Q 120 -60 60 -170 Z" fill="${GP.pele2}" opacity="0.55"/><path d="${face}" fill="none" ${traco(9)}/>`;
  // barba por fazer
  const r = aleatorio(31);
  for (let i = 0; i < 150; i++) { const a = r() * Math.PI, rr = 0.55 + r() * 0.45, x = Math.cos(a) * 126 * rr, y = 80 + Math.sin(a) * 130 * rr; if (y > 210 || (Math.abs(x) < 50 && y < 110)) continue; s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="${GT}" opacity="0.5"/>`; }
  // olhos enormes e desiguais
  const E = { nervoso: [1, -1, 'grande'], feliz: [0.85, -0.6, 'grande'], panico: [1.1, -1.3, 'pequena'], triste: [0.8, 1, 'grande'], sono: [0, 0, ''], determinado: [0.7, 0.8, 'grande'], gulp: [1.05, -1.2, 'pequena'], choro: [0.85, 1, 'grande'] }[expr] || [1, -1, 'grande'];
  const olho = (cx, cy, rx, ry, lado) => {
    let o = '';
    if (piscar || expr === 'sono') return `<path d="M ${cx - rx} ${cy + 6} Q ${cx} ${cy + 26} ${cx + rx} ${cy + 6}" fill="none" ${traco(7)}/>`;
    const k = E[0];
    o += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry * k}" fill="#FFFFFF" ${traco(7)}/>`;
    const pr = E[2] === 'pequena' ? 8 : 12;
    o += `<circle cx="${cx + 4 + olhar[0] * 12}" cy="${cy + 4 + olhar[1] * 10}" r="${pr}" fill="${GT}"/><circle cx="${cx + 8 + olhar[0] * 12}" cy="${cy}" r="3.5" fill="#fff"/>`;
    if (expr === 'triste' || expr === 'choro') o += `<path d="M ${cx - rx} ${cy - ry * 0.4} Q ${cx} ${cy - ry * 0.9} ${cx + rx} ${cy - ry * 0.5} L ${cx + rx} ${cy - ry} L ${cx - rx} ${cy - ry} Z" fill="${GP.pele}" ${traco(6)}/>`;
    if (expr === 'determinado') o += `<path d="M ${cx - rx} ${cy - ry * 0.3} L ${cx + rx} ${cy - ry * 0.55} L ${cx + rx} ${cy - ry - 4} L ${cx - rx} ${cy - ry - 4} Z" fill="${GP.pele}" ${traco(6)}/>`;
    // olheira
    o += `<path d="M ${cx - rx * 0.8} ${cy + ry * k + 8} Q ${cx} ${cy + ry * k + 22} ${cx + rx * 0.8} ${cy + ry * k + 6}" fill="none" stroke="#9A7088" stroke-width="5" opacity="0.7"/>`;
    return o;
  };
  s += olho(-52, -46, 50, 58, -1) + olho(56, -50, 42, 50, 1);
  // sobrancelhas finas
  const sb = E[1];
  s += `<path d="M -100 ${-118 - sb * 12} Q -60 ${-136 - sb * 6} -18 ${-122 + sb * 8}" fill="none" ${traco(8)}/><path d="M 22 ${-126 + sb * 8} Q 62 ${-140 - sb * 6} 100 ${-124 - sb * 12}" fill="none" ${traco(8)}/>`;
  // nariz comprido com ponta vermelha
  s += `<path d="M 4 -30 Q 2 30 18 62 Q -6 82 14 104 Q 46 120 72 98 Q 88 74 60 58 Q 40 20 30 -24" fill="${GP.pele}" ${traco(7)}/><ellipse cx="46" cy="88" rx="24" ry="17" fill="${GP.nariz}" opacity="0.8"/><path d="M 26 98 Q 34 104 40 98" fill="none" ${traco(4)}/>`;
  // boca com dentes separados (um faltando)
  const falando = fala && Math.sin(t * 15) > 0;
  const dentes = (y, larg) => {
    let d = ''; const n = 6;
    for (let i = 0; i < n; i++) { const x = -larg / 2 + (i + 0.5) * (larg / n), w = larg / n - 8; if (i === 3) { d += `<rect x="${x - w / 2}" y="${y}" width="${w}" height="26" fill="#3A0E16"/>`; continue; } d += `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${i === 2 ? 34 : 26}" rx="4" fill="#FFFDF0" ${traco(4)}/>`; }
    return d;
  };
  if (expr === 'sono') s += `<path d="M -40 150 Q 0 166 40 148" fill="none" ${traco(7)}/>`;
  else if (expr === 'triste' || expr === 'choro') s += `<path d="M -50 168 Q 0 136 50 166" fill="none" ${traco(8)}/>`;
  else if (expr === 'gulp') s += `<path d="M -46 156 Q -24 142 0 156 Q 24 170 46 154" fill="none" ${traco(8)}/>`;
  else if (expr === 'panico' || falando) {
    const h = expr === 'panico' ? 70 : 34;
    s += `<path d="M -66 136 Q 0 ${130} 66 132 Q 60 ${136 + h} 0 ${140 + h} Q -60 ${136 + h} -66 136 Z" fill="#6E1E2A" ${traco(8)}/>` + dentes(136, 110);
  } else {
    // sorrisão nervoso
    s += `<path d="M -104 104 Q 0 214 108 98 Q 96 176 0 192 Q -96 180 -104 104 Z" fill="#6E1E2A" ${traco(8)}/>` + dentes(112, 176) + `<path d="M -70 172 Q 0 196 70 170" fill="none" stroke="#C85060" stroke-width="8" opacity="0.6"/>`;
  }
  // suor e lágrimas
  if (suor) { const k = (t * 0.9) % 1; s += `<path d="M 128 ${-120 + k * 50} q 16 26 0 40 q -16 -14 0 -40 Z" fill="#9AD8F8" ${traco(5)}/><path d="M -116 -150 q 14 22 0 34 q -14 -12 0 -34 Z" fill="#9AD8F8" ${traco(5)}/>`; }
  if (lagrima || expr === 'choro') { const k = (t * 0.7) % 1; for (const cx of [-52, 56]) s += `<path d="M ${cx - 10} ${0 + k * 140} q 10 22 0 32 q -10 -10 0 -32 Z" fill="#9AD8F8" ${traco(4)} opacity="${1 - k * 0.7}"/>`; s += `<path d="M -90 20 Q -96 80 -80 120" fill="none" stroke="#9AD8F8" stroke-width="10" opacity="0.7"/>`; }
  // boné de aba pro lado + mechas da frente
  if (!semBone) {
    s += `<g transform="rotate(-9)">`;
    s += `<path d="M -170 -110 Q -186 -320 -10 -336 Q 166 -330 176 -120 Q 0 -160 -170 -110 Z" fill="${GP.bone}" ${traco(9)}/>`;
    s += `<path d="M 40 -330 Q 160 -300 176 -120 Q 120 -134 80 -140 Q 110 -240 40 -330 Z" fill="${GP.bone2}" opacity="0.7"/>`;
    s += `<path d="M 130 -150 Q 250 -150 300 -100 Q 290 -66 250 -70 Q 200 -110 120 -118 Z" fill="${GP.aba}" ${traco(8)}/>`;
    s += `<path d="M -60 -320 L -60 -150 M 60 -324 Q 80 -230 70 -146" fill="none" stroke="${GT}" stroke-width="4" opacity="0.4"/><circle cx="-10" cy="-334" r="12" fill="${GP.bone2}" ${traco(5)}/>`;
    s += `<defs><path id="arcoBone" d="M -130 -200 Q -10 -290 130 -210"/></defs><text font-family="Baloo, sans-serif" font-weight="800" font-size="64" fill="#5A5446" stroke="${GT}" stroke-width="2"><textPath href="#arcoBone" startOffset="50%" text-anchor="middle">GAMER</textPath></text>`;
    s += `<path d="M -120 -250 l 18 8 M -126 -236 l 18 8 M -132 -222 l 18 8" stroke="${GT}" stroke-width="4"/><ellipse cx="90" cy="-270" rx="26" ry="12" fill="#7A6A50" opacity="0.4"/>`;
    s += `</g>`;
  }
  for (const [x0, y0, x1, y1, w] of [[-150, -140, -186, -76, 18], [-126, -140, -140, -60, 16], [-96, -146, -96, -84, 14], [140, -150, 176, -96, 16], [114, -150, 126, -86, 14]]) s += `<path d="M ${x0 - w} ${y0} Q ${(x0 + x1) / 2} ${(y0 + y1) / 2} ${x1} ${y1} Q ${(x0 + x1) / 2 + 8} ${(y0 + y1) / 2} ${x0 + w} ${y0} Z" fill="${GP.cabelo}" ${traco(5)}/>`;
  return s;
}

// ---------- corpo inteiro (pés em x, y; ~1150 px com esc = 1) ----------
const GM_POSES = {
  base: { mD: [150, -300], mE: [-150, -300], cD: [175, -470], cE: [-175, -470] },
  celular: { mD: [40, -470], mE: [-36, -450], cD: [150, -440], cE: [-150, -430] },
  aponta: { mD: [380, -560], mE: [-150, -300], cD: [270, -600], cE: [-175, -470] },
  cabeca: { mD: [110, -1000], mE: [-110, -1000], cD: [230, -760], cE: [-230, -760] },
};
function gmBraco(ombro, cot, mao, pele) {
  const L = (a, b, w) => `<path d="M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}" stroke="${GT}" stroke-width="${w + 14}" stroke-linecap="round"/><path d="M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}" stroke="${pele}" stroke-width="${w}" stroke-linecap="round"/>`;
  return L(ombro, cot, 34) + L(cot, mao, 30) + `<g transform="translate(${mao[0]} ${mao[1]})"><ellipse cx="0" cy="0" rx="36" ry="32" fill="${pele}" ${traco(7)}/>` + [-18, -6, 6, 18].map((x) => `<path d="M ${x} 18 L ${x} 32" ${traco(4)}/>`).join('') + `</g>`;
}
function gmCorpo(o = {}) {
  const t = o.t || 0, P = { ...GM_POSES[o.pose || 'base'], ...(o.p || {}) };
  const resp = Math.sin(t * 2.2) * 4;
  let s = `<g transform="translate(${o.x || 540} ${o.y || 1760}) scale(${o.esc || 1})">`;
  s += `<ellipse cx="0" cy="10" rx="190" ry="24" fill="#000" opacity="0.25"/>`;
  // chinelos e pés
  for (const l of [-1, 1]) {
    const fx = l * 74;
    s += `<path d="M ${fx - 70} 0 Q ${fx - 76} -22 ${fx - 40} -26 L ${fx + 60} -26 Q ${fx + 86} -20 ${fx + 76} 2 Z" fill="#4A6AA8" ${traco(6)}/>`;
    s += `<path d="M ${fx - 50} -24 Q ${fx - 50} -60 ${fx} -62 Q ${fx + 56} -60 ${fx + 62} -24 Z" fill="${GP.pele}" ${traco(6)}/>` + [0, 1, 2, 3].map((i) => `<circle cx="${fx + 30 + i * 9}" cy="-30" r="8" fill="${GP.pele}" ${traco(4)}/>`).join('');
    s += `<path d="M ${fx - 30} -26 L ${fx + 6} -54 L ${fx + 40} -26" fill="none" stroke="#C8C8D0" stroke-width="6"/><path d="M ${fx - 20} -40 l 10 6 l -8 6" fill="none" stroke="#8A8A90" stroke-width="4"/>`;
  }
  // moletom largo com remendos
  s += `<path d="M -150 -420 Q -170 -200 -140 -70 Q -110 -50 -40 -60 Q -20 -240 0 -300 Q 20 -240 40 -60 Q 110 -50 140 -70 Q 170 -200 150 -420 Z" fill="${GP.calca}" ${traco(9)}/>`;
  s += `<path d="M 60 -400 Q 150 -300 140 -70 Q 110 -56 80 -60 Q 100 -200 60 -400 Z" fill="${GP.calca2}" opacity="0.6"/>`;
  s += `<path d="M -150 -90 Q -100 -70 -40 -80 M 40 -80 Q 100 -70 150 -90" fill="none" ${traco(7)}/>`;
  for (const [x, y, w, h, c, r] of [[-120, -300, 54, 60, '#D8503C', -8], [-70, -200, 46, 52, '#E8C040', 6], [80, -260, 50, 56, '#5AAA5A', -4], [100, -150, 44, 50, '#D8503C', 8], [-110, -150, 40, 44, '#4A88C8', 4]]) s += `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${c}" ${traco(5)}/><path d="M ${-w / 2 + 4} ${-h / 2 + 6} L ${w / 2 - 4} ${-h / 2 + 6} M ${-w / 2 + 4} ${h / 2 - 6} L ${w / 2 - 4} ${h / 2 - 6}" stroke="${GT}" stroke-width="3" stroke-dasharray="6 6"/></g>`;
  // tronco curvado (camiseta verde furada)
  s += `<g transform="translate(${resp * 0.3} ${resp})">`;
  const camisa = `M -150 -700 Q -40 -730 40 -728 Q 150 -718 160 -690 Q 182 -560 170 -420 Q 80 -396 0 -398 Q -90 -398 -168 -420 Q -176 -560 -150 -700 Z`;
  s += `<path d="${camisa}" fill="${GP.camisa}"/><path d="M 60 -720 Q 160 -700 170 -420 Q 120 -404 90 -404 Q 130 -560 60 -720 Z" fill="${GP.camisa2}" opacity="0.7"/><path d="${camisa}" fill="none" ${traco(9)}/>`;
  // estampa "EVENTO DE INTERNET 2010"
  s += `<g transform="translate(-20 -560) rotate(-3)"><rect x="-72" y="-70" width="144" height="150" rx="6" fill="#6A8AA0" ${traco(5)}/><rect x="-62" y="-60" width="124" height="130" fill="#8AA8BA" opacity="0.6"/><text x="0" y="-26" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="26" fill="#F4F0D8" stroke="${GT}" stroke-width="2" paint-order="stroke">EVENTO DE</text><text x="0" y="6" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="28" fill="#F4F0D8" stroke="${GT}" stroke-width="2" paint-order="stroke">INTERNET</text><text x="0" y="38" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="28" fill="#F4F0D8" stroke="${GT}" stroke-width="2" paint-order="stroke">2010</text><path d="M -60 52 Q 0 70 60 50" fill="none" stroke="#C8B060" stroke-width="6"/></g>`;
  // furos e manchas
  for (const [x, y, rx, ry] of [[-120, -640, 12, 8], [130, -600, 10, 14], [-100, -470, 14, 10], [110, -460, 9, 7], [60, -650, 8, 6]]) s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#2A2018" ${traco(3)}/>`;
  s += `<ellipse cx="70" cy="-520" rx="20" ry="14" fill="#B8A050" opacity="0.6"/><ellipse cx="-60" cy="-440" rx="16" ry="10" fill="#5A4A30" opacity="0.4"/>`;
  // braços (manga curta rasgada)
  const oE = [-150, -680], oD = [152, -684];
  s += gmBraco(oE, P.cE, P.mE, GP.pele) + gmBraco(oD, P.cD, P.mD, GP.pele);
  for (const [ox, l] of [[oE[0], -1], [oD[0], 1]]) s += `<path d="M ${ox - l * 6} -700 Q ${ox + l * 70} -690 ${ox + l * 76} -600 L ${ox + l * 60} -590 L ${ox + l * 48} -606 L ${ox + l * 30} -588 L ${ox + l * 14} -604 L ${ox - l * 10} -600 Z" fill="${GP.camisa}" ${traco(7)}/>`;
  if (o.celular) { const [hx, hy] = P.mD; s += `<g transform="translate(${hx - 30} ${hy - 30}) rotate(-12)"><rect x="-44" y="-74" width="88" height="148" rx="14" fill="#2A2E36" ${traco(7)}/><rect x="-34" y="-62" width="68" height="120" rx="6" fill="#3A4258"/><path d="M -20 -40 L 20 20 M 10 -50 L -16 40" stroke="#8A9AB8" stroke-width="3" opacity="0.7"/></g><ellipse cx="${hx - 4}" cy="${hy - 6}" rx="30" ry="26" fill="${GP.pele}" ${traco(6)}/>`; }
  // pescoço e cabeça (pra frente, postura curvada)
  s += `<path d="M -28 -760 L -24 -690 L 34 -690 L 36 -760 Z" fill="${GP.pele}" ${traco(7)}/><path d="M -40 -708 Q 0 -684 44 -708" fill="none" ${traco(6)}/>`;
  s += `<g transform="translate(18 -960) scale(0.92) rotate(${o.inclina || 4})">${gmCabeca({ expr: o.expr, t, olhar: o.olhar, suor: o.suor, fala: o.fala, lagrima: o.lagrima })}</g>`;
  s += `</g></g>`;
  return s;
}
// Close: cabeça grande + ombros/estampa.
function gmClose(o = {}) {
  const t = o.t || 0, bob = Math.sin(t * 2) * 5;
  let s = `<g transform="translate(${o.x || 540} ${(o.y || 1150) + bob}) scale(${o.esc || 1.45})">`;
  s += `<path d="M -330 700 Q -320 380 -170 320 Q -60 300 0 300 Q 60 300 170 320 Q 320 380 330 700 Z" fill="${GP.camisa}" ${traco(9)}/><path d="M 120 320 Q 300 380 330 700 L 200 700 Q 220 480 120 320 Z" fill="${GP.camisa2}" opacity="0.7"/>`;
  s += `<path d="M -60 300 Q 0 352 60 300" fill="none" ${traco(8)}/><ellipse cx="-200" cy="460" rx="16" ry="12" fill="#2A2018" ${traco(3)}/><ellipse cx="230" cy="420" rx="10" ry="14" fill="#2A2018" ${traco(3)}/>`;
  s += `<g transform="translate(-30 530) rotate(-3)"><rect x="-110" y="-90" width="220" height="200" rx="8" fill="#6A8AA0" ${traco(6)}/><text x="0" y="-36" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="40" fill="#F4F0D8" stroke="${GT}" stroke-width="3" paint-order="stroke">EVENTO DE</text><text x="0" y="10" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="42" fill="#F4F0D8" stroke="${GT}" stroke-width="3" paint-order="stroke">INTERNET</text><text x="0" y="56" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="42" fill="#F4F0D8" stroke="${GT}" stroke-width="3" paint-order="stroke">2010</text></g>`;
  s += `<path d="M -50 180 L -46 310 L 52 310 L 56 180 Z" fill="${GP.pele}" ${traco(8)}/>`;
  s += gmCabeca({ expr: o.expr, t, olhar: o.olhar, suor: o.suor, fala: o.fala, lagrima: o.lagrima });
  return s + `</g>`;
}
// Rosto pequeno (fotos, galeria, votação).
function gmRosto(cx, cy, k, o = {}) { return `<g transform="translate(${cx} ${cy}) scale(${k})">${gmCabeca(o)}</g>`; }

// ---------- avatar herói ----------
function heroiCabeca({ t = 0, fala = false } = {}) {
  let s = '';
  s += `<path d="M -150 -10 Q -190 -20 -186 24 Q -180 62 -140 56 Z M 150 -10 Q 190 -20 186 24 Q 180 62 140 56 Z" fill="${GP.pele}" ${traco(7)}/>`;
  const face = `M -144 -90 Q -146 -190 0 -196 Q 146 -190 144 -90 Q 150 60 120 140 Q 80 200 0 204 Q -80 200 -120 140 Q -150 60 -144 -90 Z`;
  s += `<path d="${face}" fill="${GP.pele}"/><path d="M 70 -180 Q 146 -140 144 -90 Q 150 60 120 140 Q 90 190 30 202 Q 110 130 120 30 Q 120 -80 70 -180 Z" fill="${GP.pele2}" opacity="0.5"/><path d="${face}" fill="none" ${traco(9)}/>`;
  const r = aleatorio(41); for (let i = 0; i < 90; i++) { const a = r() * Math.PI, rr = 0.6 + r() * 0.4, x = Math.cos(a) * 130 * rr, y = 90 + Math.sin(a) * 110 * rr; if (Math.abs(x) < 60 && y < 140) continue; s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.4" fill="${GT}" opacity="0.4"/>`; }
  for (const [cx, rx] of [[-56, 44], [56, 44]]) s += `<ellipse cx="${cx}" cy="-40" rx="${rx}" ry="40" fill="#fff" ${traco(7)}/><circle cx="${cx + 6}" cy="-34" r="13" fill="${GT}"/><circle cx="${cx + 10}" cy="-38" r="4" fill="#fff"/>`;
  s += `<path d="M -104 -102 Q -60 -126 -16 -104 M 16 -104 Q 60 -126 104 -102" fill="none" ${traco(12)}/>`;
  s += `<path d="M 4 -20 Q 0 40 14 64 Q -4 82 16 96 Q 44 108 62 92 Q 74 74 52 62 Q 36 26 30 -20" fill="${GP.pele}" ${traco(7)}/>`;
  if (fala && Math.sin(t * 15) > 0) s += `<path d="M -60 128 Q 0 120 60 126 Q 50 176 0 180 Q -50 176 -60 128 Z" fill="#6E1E2A" ${traco(7)}/><path d="M -50 130 L 50 130 L 46 146 L -46 146 Z" fill="#fff"/>`;
  else s += `<path d="M -96 104 Q 0 200 98 98 Q 86 160 0 174 Q -86 162 -96 104 Z" fill="#fff" ${traco(8)}/><path d="M -84 118 Q 0 136 86 112" fill="none" stroke="${GT}" stroke-width="3" opacity="0.5"/>` + [-50, -16, 18, 52].map((x) => `<path d="M ${x} 112 L ${x} 150" stroke="${GT}" stroke-width="2.5" opacity="0.35"/>`).join('');
  // topete arrumado
  s += `<path d="M -150 -80 Q -170 -230 -60 -270 Q 20 -320 110 -270 Q 190 -230 150 -80 Q 130 -160 70 -190 Q 20 -150 -40 -190 Q -110 -170 -150 -80 Z" fill="${GP.cabelo}" ${traco(8)}/>`;
  s += `<path d="M -40 -270 Q 40 -340 140 -280 Q 80 -280 40 -240 Z" fill="${GP.cabelo}" ${traco(7)}/><path d="M -60 -240 Q 10 -280 90 -250" fill="none" stroke="#7A6050" stroke-width="8" stroke-linecap="round"/>`;
  return s;
}
function heroiCorpo(x, y, esc, t, o = {}) {
  const N = '#1E2840', N2 = '#141C30', NEON = '#3AD8FF', ROX = '#B06AFF';
  const resp = Math.sin(t * 2) * 4;
  let s = `<g transform="translate(${x} ${y}) scale(${esc})"><ellipse cx="0" cy="10" rx="220" ry="26" fill="#000" opacity="0.25"/>`;
  // pernas e botas
  for (const l of [-1, 1]) {
    s += `<path d="M ${l * 20} -480 L ${l * 130} -470 L ${l * 120} -60 L ${l * 40} -60 Z" fill="${N}" ${traco(8)}/><path d="M ${l * 60} -440 L ${l * 70} -260 L ${l * 60} -120" fill="none" stroke="${NEON}" stroke-width="6"/>`;
    s += `<path d="M ${l * 30} -180 L ${l * 130} -180 L ${l * 140} -10 L ${l * 20} -10 Z" fill="#2A3656" ${traco(8)}/><path d="M ${l * 40} -150 L ${l * 120} -150" stroke="${NEON}" stroke-width="6"/>`;
    s += `<ellipse cx="${l * 76}" cy="-300" rx="40" ry="34" fill="#2A3656" ${traco(6)}/><circle cx="${l * 76}" cy="-300" r="12" fill="${NEON}"/>`;
  }
  s += `<g transform="translate(0 ${resp})">`;
  // tronco em V
  s += `<path d="M -230 -900 Q 0 -940 230 -900 Q 200 -700 120 -480 L -120 -480 Q -200 -700 -230 -900 Z" fill="${N}" ${traco(9)}/>`;
  s += `<path d="M -140 -860 Q -60 -780 -80 -640 M 140 -860 Q 60 -780 80 -640 M -80 -640 L 80 -640 M 0 -820 L 0 -520 M -60 -580 L 60 -580" fill="none" stroke="${NEON}" stroke-width="7"/><path d="M -40 -740 L 0 -700 L 40 -740" fill="none" stroke="${ROX}" stroke-width="7"/>`;
  s += `<rect x="-130" y="-520" width="260" height="50" rx="10" fill="#2A3656" ${traco(7)}/><circle cx="0" cy="-495" r="18" fill="${NEON}"/>`;
  // braços musculosos + ombreiras + luvas
  for (const l of [-1, 1]) {
    const om = [l * 230, -860], co = [l * 290, -650], ma = [l * 262, -440];
    const L = (a, b, w, cor) => `<path d="M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}" stroke="${GT}" stroke-width="${w + 16}" stroke-linecap="round"/><path d="M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}" stroke="${cor}" stroke-width="${w}" stroke-linecap="round"/>`;
    s += L(om, co, 84, GP.pele) + `<ellipse cx="${l * 268}" cy="-760" rx="56" ry="70" fill="${GP.pele}" ${traco(8)}/><path d="M ${l * 240} -800 Q ${l * 290} -770 ${l * 280} -720" fill="none" stroke="${GP.pele2}" stroke-width="10"/>`;
    s += L(co, ma, 70, '#2A3656') + `<path d="M ${l * 282} -600 L ${l * 270} -480" stroke="${NEON}" stroke-width="7"/>`;
    s += `<ellipse cx="${ma[0]}" cy="${ma[1] + 10}" rx="48" ry="42" fill="#2A3656" ${traco(7)}/><path d="M ${ma[0] - 30} ${ma[1] + 24} L ${ma[0] + 30} ${ma[1] + 24}" stroke="${GT}" stroke-width="4"/>`;
    s += `<path d="M ${l * 140} -920 Q ${l * 300} -980 ${l * 336} -820 Q ${l * 270} -770 ${l * 190} -800 Z" fill="#2A3656" ${traco(8)}/><path d="M ${l * 190} -886 Q ${l * 280} -910 ${l * 310} -830" fill="none" stroke="${NEON}" stroke-width="7"/>`;
  }
  s += `<path d="M -50 -960 L -46 -900 L 50 -900 L 54 -960 Z" fill="${GP.pele}" ${traco(7)}/>`;
  s += `<g transform="translate(0 -1150) scale(0.95)">${heroiCabeca({ t, fala: o.fala })}</g>`;
  return s + `</g></g>`;
}
function heroiRosto(cx, cy, k, t = 0) { return `<g transform="translate(${cx} ${cy}) scale(${k})">${heroiCabeca({ t })}</g>`; }
