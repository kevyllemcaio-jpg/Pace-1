// corpo.js — personagem "realista" para os especiais: proporções humanas, músculos,
// braços e pernas com cinemática inversa (a mão/o pé vai até o alvo e o cotovelo/joelho dobra sozinho)
// e poses animadas por quadros-chave.
//
// corpo({ x, y, esc, musculo (0 = normal, 1 = brutamontes), energia (0..1 veias brilhando),
//         roupa: 'moletom' | 'shorts', pose, expr, t, olhar: [gx, gy] })
// pose = { maoD:[x,y], maoE:[x,y], peD:[x,y], peE:[x,y], agach (px), qx (px), inclina (px), cabeca (px) }
// Coordenadas da pose: locais, com os pés em y = 0 e o personagem olhando para a câmera.

const CONT = '#24201E';
const PELE_REAL = '#C68E62';
const VEIA_PADRAO = '#FF8A1F';
const corEnergia = () => (typeof window !== 'undefined' && window.COR_ENERGIA) || VEIA_PADRAO;
const corEnergiaClara = () => (typeof window !== 'undefined' && window.COR_ENERGIA_CLARA) || '#FFE2A6';

// ---------- geometria ----------
function ik(a, alvo, l1, l2, lado, preferencia = 'fora') {
  let dx = alvo[0] - a[0], dy = alvo[1] - a[1];
  let d = Math.hypot(dx, dy) || 0.001;
  const max = l1 + l2 - 0.5, min = Math.abs(l1 - l2) + 0.5;
  let t = alvo;
  if (d > max) { t = [a[0] + (dx / d) * max, a[1] + (dy / d) * max]; d = max; }
  if (d < min) d = min;
  const base = Math.atan2(dy, dx);
  const ang = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const c1 = [a[0] + Math.cos(base + ang) * l1, a[1] + Math.sin(base + ang) * l1];
  const c2 = [a[0] + Math.cos(base - ang) * l1, a[1] + Math.sin(base - ang) * l1];
  let e;
  if (preferencia === 'baixo') e = c1[1] > c2[1] ? c1 : c2;
  else if (preferencia === 'cima') e = c1[1] < c2[1] ? c1 : c2;
  else e = lado * (c1[0] - a[0]) > lado * (c2[0] - a[0]) ? c1 : c2; // cotovelo/joelho para fora
  return [e, t];
}
const P = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
function capsula(a, b, ra, rb) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 0.001;
  const nx = -dy / L, ny = dx / L;
  const p1 = [a[0] + nx * ra, a[1] + ny * ra], p2 = [b[0] + nx * rb, b[1] + ny * rb];
  const p3 = [b[0] - nx * rb, b[1] - ny * rb], p4 = [a[0] - nx * ra, a[1] - ny * ra];
  return `M ${P(p1)} L ${P(p2)} A ${rb} ${rb} 0 0 0 ${P(p3)} L ${P(p4)} A ${ra} ${ra} 0 0 0 ${P(p1)} Z`;
}
function elipse(cx, cy, rx, ry, rotGraus = 0) {
  const r = (rotGraus * Math.PI) / 180;
  const p1 = [cx + Math.cos(r) * rx, cy + Math.sin(r) * rx], p2 = [cx - Math.cos(r) * rx, cy - Math.sin(r) * rx];
  return `M ${P(p1)} A ${rx} ${ry} ${rotGraus} 1 0 ${P(p2)} A ${rx} ${ry} ${rotGraus} 1 0 ${P(p1)} Z`;
}
const ponto = (a, b, k) => [mix(a[0], b[0], k), mix(a[1], b[1], k)];
const angulo = (a, b) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
// Formas com contorno único (todas as formas do grupo parecem uma peça só).
function grupo(ds, cor, w = 5) {
  return ds.map((d) => `<path d="${d}" fill="${CONT}" stroke="${CONT}" stroke-width="${2 * w}" stroke-linejoin="round"/>`).join('') +
    ds.map((d) => `<path d="${d}" fill="${cor}"/>`).join('');
}
const linha = (d, cor = CONT, w = 3, op = 0.45) => `<path d="${d}" fill="none" stroke="${cor}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`;

// ---------- poses e animação ----------
function poseBase(m = 0) {
  const sh = esqueletoMedidas(m);
  return { maoD: [sh.sw + 22, -sh.hipH - sh.torso + sh.l1 + sh.l2 - 25], maoE: [-sh.sw - 22, -sh.hipH - sh.torso + sh.l1 + sh.l2 - 25], peD: [sh.hw + 12, 0], peE: [-sh.hw - 12, 0], agach: 0, qx: 0, inclina: 0, cabeca: 0 };
}
function misturaPose(a, b, k) {
  const r = {};
  for (const ch of Object.keys(a)) r[ch] = Array.isArray(a[ch]) ? [mix(a[ch][0], b[ch][0], k), mix(a[ch][1], b[ch][1], k)] : mix(a[ch], b[ch] ?? a[ch], k);
  return r;
}
// quadros = [[tempo, pose], ...] (poses parciais completam a anterior)
function animar(quadros, t, base) {
  let cheia = [];
  let atual = base;
  for (const [tq, p] of quadros) { atual = { ...atual, ...p }; cheia.push([tq, atual]); }
  if (t <= cheia[0][0]) return cheia[0][1];
  for (let i = 0; i < cheia.length - 1; i++) {
    const [t0, p0] = cheia[i], [t1, p1] = cheia[i + 1];
    if (t <= t1) return misturaPose(p0, p1, vaivem((t - t0) / Math.max(0.001, t1 - t0)));
  }
  return cheia[cheia.length - 1][1];
}
// Marcha no lugar / andando: pés alternam e o corpo sobe e desce.
function passo(pose, t, { vel = 7, altura = 34 } = {}) {
  const s = Math.sin(t * vel);
  return { ...pose, peD: [pose.peD[0], pose.peD[1] - Math.max(0, s) * altura], peE: [pose.peE[0], pose.peE[1] - Math.max(0, -s) * altura], agach: pose.agach + Math.abs(s) * 6, qx: pose.qx + s * 4 };
}
// Tremor de câmera após um impacto.
function tremor(svg, lt, t0, forca = 18, dur = 0.45) {
  if (lt < t0 || lt > t0 + dur) return svg;
  const k = 1 - (lt - t0) / dur;
  const dx = Math.sin(lt * 90) * forca * k, dy = Math.cos(lt * 73) * forca * k;
  return `<g transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)})">${svg}</g>`;
}

function esqueletoMedidas(m) {
  return {
    hipH: mix(300, 380, m), torso: mix(225, 290, m), sw: mix(68, 150, m), hw: mix(48, 76, m),
    pesc: mix(26, 34, m), cabR: mix(64, 60, m), l1: mix(128, 170, m), l2: mix(122, 160, m),
  };
}

// ---------- rosto ----------
function rostoReal(c, r, expr, t, olhar, energia, m, semente) {
  const [cx, cy] = c;
  const e = { neutro: [0, 0, 'reta'], raiva: [10, -6, 'dentes'], grito: [12, -8, 'grito'], sorriso: [-4, -4, 'sorriso'], surpreso: [-12, -10, 'o'], triste: [-10, 6, 'triste'], esforco: [12, -4, 'dentes'], confiante: [4, -6, 'canto'], cansado: [-6, 6, 'reta'] }[expr] || [0, 0, 'reta'];
  const [bi, be, boca] = e;
  const piscar = ((t + semente * 0.77) % 3.7) < 0.12;
  let s = '';
  const ey = cy - r * 0.08, ex = r * 0.36;
  for (const lado of [-1, 1]) {
    const x = cx + lado * ex;
    // sobrancelha grossa
    s += `<path d="M ${x - lado * r * 0.18} ${ey - r * 0.22 + bi} L ${x + lado * r * 0.2} ${ey - r * 0.24 + be}" stroke="${CONT}" stroke-width="${mix(7, 10, m)}" stroke-linecap="round"/>`;
    if (piscar) { s += `<path d="M ${x - r * 0.15} ${ey} Q ${x} ${ey + 6} ${x + r * 0.15} ${ey}" fill="none" stroke="${CONT}" stroke-width="4"/>`; continue; }
    s += `<path d="${elipse(x, ey, r * 0.17, r * 0.11)}" fill="#fff" stroke="${CONT}" stroke-width="3.5"/>`;
    const brilha = energia > 0.55;
    s += `<circle cx="${x + olhar[0] * r * 0.06}" cy="${ey + olhar[1] * r * 0.04}" r="${r * 0.085}" fill="${brilha ? corEnergia() : '#3A2A20'}"/>`;
    if (brilha) s += `<circle cx="${x}" cy="${ey}" r="${r * 0.2}" fill="${corEnergia()}" opacity="${0.35 * energia}" filter="url(#brilhoVeia)"/>`;
    s += `<circle cx="${x + olhar[0] * r * 0.06}" cy="${ey + olhar[1] * r * 0.04}" r="${r * 0.04}" fill="${CONT}"/>`;
    s += `<path d="M ${x - r * 0.18} ${ey - r * 0.04} Q ${x} ${ey - r * 0.16} ${x + r * 0.18} ${ey - r * 0.04}" fill="none" stroke="${CONT}" stroke-width="3"/>`;
  }
  // nariz
  s += `<path d="M ${cx - 2} ${ey + r * 0.04} L ${cx - r * 0.1} ${cy + r * 0.28} Q ${cx} ${cy + r * 0.34} ${cx + r * 0.1} ${cy + r * 0.28}" fill="none" stroke="${CONT}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  // boca
  const my = cy + r * 0.52, mw = r * 0.32;
  if (boca === 'dentes') s += `<rect x="${cx - mw}" y="${my - r * 0.08}" width="${mw * 2}" height="${r * 0.16}" rx="5" fill="#fff" stroke="${CONT}" stroke-width="3.5"/><path d="M ${cx - mw} ${my} L ${cx + mw} ${my} M ${cx - mw * 0.4} ${my - r * 0.08} L ${cx - mw * 0.4} ${my + r * 0.08} M ${cx + mw * 0.4} ${my - r * 0.08} L ${cx + mw * 0.4} ${my + r * 0.08}" stroke="${CONT}" stroke-width="2.5"/>`;
  else if (boca === 'grito') s += `<path d="M ${cx - mw * 1.1} ${my - r * 0.1} L ${cx + mw * 1.1} ${my - r * 0.1} L ${cx + mw * 0.7} ${my + r * 0.24} L ${cx - mw * 0.7} ${my + r * 0.24} Z" fill="#5A1A1A" stroke="${CONT}" stroke-width="3.5" stroke-linejoin="round"/><rect x="${cx - mw}" y="${my - r * 0.1}" width="${mw * 2}" height="${r * 0.08}" fill="#fff"/>`;
  else if (boca === 'sorriso') s += `<path d="M ${cx - mw} ${my - 4} Q ${cx} ${my + r * 0.22} ${cx + mw} ${my - 4} Z" fill="#5A1A1A" stroke="${CONT}" stroke-width="3.5" stroke-linejoin="round"/><path d="M ${cx - mw * 0.85} ${my - 2} L ${cx + mw * 0.85} ${my - 2} L ${cx + mw * 0.7} ${my + 5} L ${cx - mw * 0.7} ${my + 5} Z" fill="#fff"/>`;
  else if (boca === 'o') s += `<path d="${elipse(cx, my + 2, r * 0.1, r * 0.14)}" fill="#5A1A1A" stroke="${CONT}" stroke-width="3.5"/>`;
  else if (boca === 'triste') s += `<path d="M ${cx - mw} ${my + 6} Q ${cx} ${my - 8} ${cx + mw} ${my + 6}" fill="none" stroke="${CONT}" stroke-width="4" stroke-linecap="round"/>`;
  else if (boca === 'canto') s += `<path d="M ${cx - mw} ${my + 2} Q ${cx + mw * 0.2} ${my + 6} ${cx + mw} ${my - 8}" fill="none" stroke="${CONT}" stroke-width="4" stroke-linecap="round"/>`;
  else s += `<path d="M ${cx - mw * 0.8} ${my} L ${cx + mw * 0.8} ${my}" stroke="${CONT}" stroke-width="4" stroke-linecap="round"/>`;
  return s;
}

// ---------- veias de energia ----------
function veias(caminhos, energia, t) {
  if (energia <= 0.02) return '';
  const pulso = energia * (0.75 + 0.25 * Math.sin(t * 9));
  const d = caminhos.join(' ');
  return `<path d="${d}" fill="none" stroke="${corEnergia()}" stroke-width="16" stroke-linecap="round" opacity="${0.55 * pulso}" filter="url(#brilhoVeia)"/>` +
    `<path d="${d}" fill="none" stroke="${corEnergia()}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="${pulso}"/>` +
    `<path d="${d}" fill="none" stroke="${corEnergiaClara()}" stroke-width="2" stroke-linecap="round" opacity="${pulso}"/>`;
}
function zigue(a, b, n = 4, amp = 6, sem = 1) {
  let s = `M ${P(a)}`;
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  for (let i = 1; i <= n; i++) {
    const k = i / n, o = i === n ? 0 : Math.sin(i * 2.3 + sem) * amp;
    s += ` L ${P([a[0] + dx * k + nx * o, a[1] + dy * k + ny * o])}`;
  }
  return s;
}

// ---------- o corpo ----------
function corpo(o) {
  const m = o.musculo ?? 0;
  const energia = o.energia ?? 0;
  const t = o.t || 0;
  const sem = o.semente || 3;
  const pele = o.pele || PELE_REAL;
  const roupa = o.roupa || (m > 0.5 ? 'shorts' : 'moletom');
  const M = esqueletoMedidas(m);
  const pose = { ...poseBase(m), ...(o.pose || {}) };
  const resp = Math.sin(t * 2.2 + sem) * mix(2, 4, m);

  // esqueleto
  const quadril = [pose.qx, -M.hipH + pose.agach];
  const qD = [quadril[0] + M.hw * 0.62, quadril[1]], qE = [quadril[0] - M.hw * 0.62, quadril[1]];
  const ombroY = quadril[1] - M.torso + resp;
  const oD = [quadril[0] + pose.inclina + M.sw, ombroY], oE = [quadril[0] + pose.inclina - M.sw, ombroY];
  const pescoco = [quadril[0] + pose.inclina, ombroY - 6];
  const cab = [pescoco[0] + pose.cabeca, pescoco[1] - M.pesc - M.cabR * 0.95];
  const [jD, peD] = ik(qD, pose.peD, M.hipH * 0.52, M.hipH * 0.5, 1);
  const [jE, peE] = ik(qE, pose.peE, M.hipH * 0.52, M.hipH * 0.5, -1);
  const [cD, mD] = ik(oD, pose.maoD, M.l1, M.l2, 1, pose.cotD || 'fora');
  const [cE, mE] = ik(oE, pose.maoE, M.l1, M.l2, -1, pose.cotE || 'fora');

  const corPerna = roupa === 'moletom' ? '#3B5B8C' : pele;
  const corBraco = roupa === 'moletom' ? '#5B6475' : pele;
  let s = `<defs><filter id="brilhoVeia" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter></defs>`;
  s += `<ellipse cx="${pose.qx}" cy="4" rx="${mix(95, 150, m)}" ry="${mix(14, 22, m)}" fill="#000" opacity="0.2"/>`;

  // pernas
  for (const [q, j, p, lado] of [[qE, jE, peE, -1], [qD, jD, peD, 1]]) {
    const coxa = capsula(q, j, mix(30, 52, m), mix(22, 36, m));
    const canela = capsula(j, [p[0], p[1] - 24], mix(21, 34, m), mix(15, 22, m));
    const panturrilha = elipse(...ponto(j, p, 0.35).map((v, i) => (i === 0 ? v + lado * mix(2, 8, m) : v)), mix(20, 38, m), mix(40, 58, m), angulo(j, p) - 90);
    s += grupo([coxa, canela, panturrilha], corPerna);
    if (m > 0.3 && roupa === 'shorts') s += linha(`M ${P(ponto(q, j, 0.3))} Q ${P([ponto(q, j, 0.6)[0] - lado * 14, ponto(q, j, 0.6)[1]])} ${P(ponto(q, j, 0.92))}`);
    // tênis
    const tx = p[0] + lado * 8;
    s += `<path d="M ${tx - 34} ${p[1] - 2} Q ${tx - 36} ${p[1] - 34} ${tx - 6} ${p[1] - 34} L ${tx + 20} ${p[1] - 30} Q ${tx + 44} ${p[1] - 24} ${tx + 42} ${p[1] - 2} Z" fill="${roupa === 'shorts' ? '#14161C' : '#F6F6F4'}" stroke="${CONT}" stroke-width="4" stroke-linejoin="round"/>` +
      `<rect x="${tx - 36}" y="${p[1] - 9}" width="80" height="9" rx="4" fill="${roupa === 'shorts' ? corEnergia() : '#B9BCC2'}" stroke="${CONT}" stroke-width="3"/>`;
  }

  // shorts (tubos sobre as coxas) / cós da calça
  if (roupa === 'shorts') {
    const tubos = [[qE, jE, -1], [qD, jD, 1]].map(([q, j]) => capsula([q[0], q[1] - 18], ponto(q, j, 0.5), mix(34, 58, m), mix(30, 50, m)));
    const quad = `M ${P([qE[0] - M.hw * 0.78, quadril[1] - 34])} L ${P([qD[0] + M.hw * 0.78, quadril[1] - 34])} L ${P([qD[0] + M.hw * 0.5, quadril[1] + 30])} L ${P([qE[0] - M.hw * 0.5, quadril[1] + 30])} Z`;
    s += grupo([...tubos, quad], '#16181E');
    for (const [q, j, l] of [[qE, jE, -1], [qD, jD, 1]]) {
      const a = [q[0] + l * mix(30, 52, m), q[1] - 20], b = [ponto(q, j, 0.5)[0] + l * mix(26, 46, m), ponto(q, j, 0.5)[1]];
      s += `<path d="M ${P(a)} L ${P(b)}" stroke="${corEnergia()}" stroke-width="7" stroke-linecap="round"/>`;
    }
    s += `<rect x="${qE[0] - M.hw * 0.8}" y="${quadril[1] - 40}" width="${(qD[0] - qE[0]) + M.hw * 1.6}" height="16" rx="6" fill="#0E0F13" stroke="${CONT}" stroke-width="4"/>`;
  } else {
    const quad = `M ${P([qE[0] - M.hw * 0.78, quadril[1] - 34])} L ${P([qD[0] + M.hw * 0.78, quadril[1] - 34])} L ${P([qD[0] + M.hw * 0.4, quadril[1] + 24])} L ${P([qE[0] - M.hw * 0.4, quadril[1] + 24])} Z`;
    s += grupo([quad, ...[[qE, jE], [qD, jD]].map(([q, j]) => capsula([q[0], q[1] - 18], ponto(q, j, 0.4), mix(31, 53, m), mix(29, 50, m)))], '#3B5B8C');
  }

  // tronco
  const cintura = quadril[1] - 22;
  const troncoD = `M ${P([oE[0] + 6, ombroY - 4])} Q ${P([pescoco[0], ombroY - 20 - m * 14])} ${P([oD[0] - 6, ombroY - 4])}` +
    ` Q ${P([oD[0] + 12, ombroY + 40])} ${P([oD[0] - M.sw * 0.08, ombroY + M.torso * 0.35])}` +
    ` Q ${P([quadril[0] + M.hw * 1.05, cintura - M.torso * 0.25])} ${P([quadril[0] + M.hw * 0.92, cintura])}` +
    ` L ${P([quadril[0] - M.hw * 0.92, cintura])}` +
    ` Q ${P([quadril[0] - M.hw * 1.05, cintura - M.torso * 0.25])} ${P([oE[0] + M.sw * 0.08, ombroY + M.torso * 0.35])}` +
    ` Q ${P([oE[0] - 12, ombroY + 40])} ${P([oE[0] + 6, ombroY - 4])} Z`;
  // trapézio (pescoço até os ombros)
  const trap = `M ${P([pescoco[0] - M.pesc * 1.1, pescoco[1] - M.pesc * 0.7])} Q ${P([pescoco[0] - M.sw * 0.55, ombroY - 22 - m * 10])} ${P([oE[0] + 10, ombroY + 4])} L ${P([oD[0] - 10, ombroY + 4])} Q ${P([pescoco[0] + M.sw * 0.55, ombroY - 22 - m * 10])} ${P([pescoco[0] + M.pesc * 1.1, pescoco[1] - M.pesc * 0.7])} Z`;
  const corTronco = roupa === 'moletom' ? '#5B6475' : pele;
  if (roupa === 'moletom') s += `<path d="${elipse(pescoco[0], pescoco[1] - 10, M.cabR * 0.95, M.cabR * 0.55)}" fill="#4A5262" stroke="${CONT}" stroke-width="5"/>`; // capuz atrás
  s += grupo([troncoD, trap], corTronco);
  const peitoY = ombroY + M.torso * 0.3;
  if (roupa === 'shorts') {
    // peitoral, abdômen, umbigo
    s += linha(`M ${P([pescoco[0] - 4, ombroY + 14])} L ${P([pescoco[0] - 2, peitoY + 10])}`, CONT, 3, 0.35);
    for (const l of [-1, 1]) s += linha(`M ${P([pescoco[0] + l * 6, peitoY + 12])} Q ${P([pescoco[0] + l * M.sw * 0.55, peitoY + 30])} ${P([pescoco[0] + l * M.sw * 0.82, peitoY - 18])}`, CONT, 4, 0.5);
    const absTopo = peitoY + 34, absFim = cintura - 30;
    for (let i = 0; i < 3; i++) {
      const y = mix(absTopo, absFim, (i + 1) / 3.4);
      s += linha(`M ${P([pescoco[0] - M.hw * 0.55, y])} Q ${P([pescoco[0] - M.hw * 0.25, y + 6])} ${P([pescoco[0] - 4, y])} M ${P([pescoco[0] + 4, y])} Q ${P([pescoco[0] + M.hw * 0.25, y + 6])} ${P([pescoco[0] + M.hw * 0.55, y])}`, CONT, 3, 0.32 + 0.15 * m);
    }
    s += linha(`M ${P([pescoco[0], absTopo - 4])} L ${P([pescoco[0], absFim + 6])}`, CONT, 3, 0.3);
    s += `<circle cx="${pescoco[0]}" cy="${cintura - 16}" r="3" fill="${CONT}" opacity="0.5"/>`;
  } else {
    s += `<path d="M ${P([pescoco[0] - M.hw * 0.7, cintura - 70])} L ${P([pescoco[0] + M.hw * 0.7, cintura - 70])} L ${P([pescoco[0] + M.hw * 0.8, cintura - 6])} L ${P([pescoco[0] - M.hw * 0.8, cintura - 6])} Z" fill="none" stroke="${CONT}" stroke-width="3" opacity="0.4"/>`;
    s += `<path d="M ${pescoco[0] - 12} ${ombroY + 2} L ${pescoco[0] - 14} ${ombroY + 60} M ${pescoco[0] + 12} ${ombroY + 2} L ${pescoco[0] + 14} ${ombroY + 60}" stroke="#E8E8E8" stroke-width="4" stroke-linecap="round"/>`;
  }
  s += veias([zigue([pescoco[0] - 8, ombroY + 18], [oE[0] + 30, peitoY - 10], 4, 5, sem), zigue([pescoco[0] + 8, ombroY + 18], [oD[0] - 30, peitoY - 10], 4, 5, sem + 1), zigue([pescoco[0] + 20, peitoY + 40], [pescoco[0] + M.hw * 0.7, cintura - 20], 4, 6, sem + 2)], roupa === 'shorts' ? energia : 0, t);

  // braços
  for (const [om, co, ma, lado] of [[oE, cE, mE, -1], [oD, cD, mD, 1]]) {
    const deltoide = elipse(om[0] - lado * mix(0, 6, m), om[1] + mix(10, 18, m), mix(26, 54, m), mix(30, 50, m), angulo(om, co) - 90);
    const braco = capsula(om, co, mix(22, 42, m), mix(17, 30, m));
    const biceps = elipse(...ponto(om, co, 0.5), mix(20, 40, m), mix(46, 70, m), angulo(om, co) - 90);
    const antebraco = capsula(co, ma, mix(17, 32, m), mix(13, 22, m));
    const antebracoB = elipse(...ponto(co, ma, 0.3), mix(16, 30, m), mix(36, 56, m), angulo(co, ma) - 90);
    s += grupo([deltoide, braco, biceps, antebraco, antebracoB], corBraco);
    if (roupa === 'shorts') {
      s += linha(`M ${P(ponto(om, co, 0.25))} Q ${P([ponto(om, co, 0.55)[0] + lado * 10, ponto(om, co, 0.55)[1]])} ${P(ponto(om, co, 0.85))}`, CONT, 3, 0.35);
      const pulso = ponto(co, ma, 0.7);
      s += `<path d="${capsula(ponto(co, ma, 0.66), ponto(co, ma, 0.78), mix(15, 25, m), mix(14, 23, m))}" fill="#14161C" stroke="${CONT}" stroke-width="4"/>`;
      s += veias([zigue(ponto(om, co, 0.15), ponto(om, co, 0.9), 5, 6, sem + lado), zigue(ponto(co, ma, 0.1), pulso, 4, 5, sem + 3 + lado)], energia, t);
    } else {
      s += `<path d="${capsula(ponto(co, ma, 0.72), ponto(co, ma, 0.8), mix(15, 25, m), mix(14, 24, m))}" fill="#4A5262" stroke="${CONT}" stroke-width="3"/>`;
    }
    // punho fechado
    s += `<path d="${elipse(ma[0], ma[1], mix(17, 29, m), mix(19, 31, m), angulo(co, ma) - 90)}" fill="${pele}" stroke="${CONT}" stroke-width="5"/>` +
      `<path d="M ${ma[0] - mix(8, 14, m)} ${ma[1] - 3} L ${ma[0] + mix(8, 14, m)} ${ma[1] - 3} M ${ma[0] - mix(8, 14, m)} ${ma[1] + 6} L ${ma[0] + mix(8, 14, m)} ${ma[1] + 6}" stroke="${CONT}" stroke-width="2.5" opacity="0.45"/>`;
  }

  // pescoço e cabeça
  const corPesc = pele;
  s += grupo([capsula([pescoco[0], pescoco[1] + 6], [cab[0], cab[1] + M.cabR * 0.6], mix(20, 34, m), mix(18, 30, m))], corPesc);
  for (const l of [-1, 1]) s += `<path d="${elipse(cab[0] + l * M.cabR * 0.86, cab[1] + 4, M.cabR * 0.14, M.cabR * 0.22)}" fill="${pele}" stroke="${CONT}" stroke-width="4"/>`;
  const r = M.cabR;
  const cabeca = `M ${cab[0] - r * 0.82} ${cab[1] - r * 0.1} Q ${cab[0] - r * 0.86} ${cab[1] - r * 1.05} ${cab[0]} ${cab[1] - r * 1.05} Q ${cab[0] + r * 0.86} ${cab[1] - r * 1.05} ${cab[0] + r * 0.82} ${cab[1] - r * 0.1}` +
    ` Q ${cab[0] + r * (0.8 + 0.08 * m)} ${cab[1] + r * 0.6} ${cab[0] + r * (0.42 + 0.12 * m)} ${cab[1] + r * 0.82} Q ${cab[0]} ${cab[1] + r * 1.0} ${cab[0] - r * (0.42 + 0.12 * m)} ${cab[1] + r * 0.82} Q ${cab[0] - r * (0.8 + 0.08 * m)} ${cab[1] + r * 0.6} ${cab[0] - r * 0.82} ${cab[1] - r * 0.1} Z`;
  s += `<path d="${cabeca}" fill="${pele}" stroke="${CONT}" stroke-width="5" stroke-linejoin="round"/>`;
  // cabelo curto (degradê)
  s += `<path d="M ${cab[0] - r * 0.84} ${cab[1] - r * 0.15} Q ${cab[0] - r * 0.9} ${cab[1] - r * 1.12} ${cab[0]} ${cab[1] - r * 1.12} Q ${cab[0] + r * 0.9} ${cab[1] - r * 1.12} ${cab[0] + r * 0.84} ${cab[1] - r * 0.15} Q ${cab[0] + r * 0.7} ${cab[1] - r * 0.62} ${cab[0]} ${cab[1] - r * 0.66} Q ${cab[0] - r * 0.7} ${cab[1] - r * 0.62} ${cab[0] - r * 0.84} ${cab[1] - r * 0.15} Z" fill="#2B1D16" stroke="${CONT}" stroke-width="4"/>`;
  if (m > 0.3) s += linha(`M ${cab[0] - r * 0.5} ${cab[1] + r * 0.62} Q ${cab[0]} ${cab[1] + r * 0.78} ${cab[0] + r * 0.5} ${cab[1] + r * 0.62}`, CONT, 3, 0.3 * m);
  s += rostoReal(cab, r, o.expr || 'neutro', t, o.olhar || [0, 0], energia, m, sem);
  s += veias([zigue([cab[0] - r * 0.55, cab[1] + r * 0.9], [pescoco[0] - M.pesc * 0.6, pescoco[1] + 10], 3, 4, sem), zigue([cab[0] + r * 0.6, cab[1] - r * 0.4], [cab[0] + r * 0.75, cab[1] + r * 0.2], 3, 3, sem + 5)], roupa === 'shorts' ? energia : 0, t);

  const esc = o.esc || 1;
  return `<g transform="translate(${o.x} ${o.y}) scale(${esc * (o.vira || 1)} ${esc})">${s}</g>`;
}
