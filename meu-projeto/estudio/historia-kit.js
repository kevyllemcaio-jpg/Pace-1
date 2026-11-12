// historia-kit.js — cenas prontas para as histórias curtas (usa cartoon.js, cenarios.js, chibi.js).
// Cada história: historia({ visual }) + HS.push(...cenas) + fecharHistoria({ capa }).

let HS = [];
function historia({ visual = {}, voz = 'en-US-AndrewMultilingualNeural', velocidade = '+8%' } = {}) {
  window.FONTE_LEGENDA = 'Baloo, sans-serif';
  window.LEGENDA_Y = 1500;
  window.TRATAR_VOZ = true;
  window.VISUAL = { oculos: false, fone: false, estampa: false, ...visual };
  window._VOZ_H = { voz, velocidade };
  HS = [];
  return HS;
}
function fecharHistoria({ capa }) {
  if (capa) window.CAPA = capa;
  criarEpisodio(HS, window._VOZ_H);
}

// ---------- fundos ----------
function fundoEscritorio(t) {
  let s = `<rect width="1080" height="1920" fill="#DCE3EA"/><rect y="1400" width="1080" height="520" fill="#9AA6B2"/>`;
  for (let i = 0; i < 3; i++) s += `<rect x="${60 + i * 340}" y="300" width="280" height="420" fill="#BFE0F5" stroke="#1F1A24" stroke-width="8"/><line x1="${200 + i * 340}" y1="300" x2="${200 + i * 340}" y2="720" stroke="#1F1A24" stroke-width="6"/>`;
  s += `<rect x="80" y="1180" width="920" height="40" fill="#8A5A3C" stroke="#1F1A24" stroke-width="7"/><rect x="380" y="1000" width="320" height="180" rx="12" fill="#22262F" stroke="#1F1A24" stroke-width="7"/><rect x="400" y="1020" width="280" height="140" fill="#7FC3F0"/>`;
  return s;
}
function fundoFesta(t) {
  let s = `<rect width="1080" height="1920" fill="#3A2E5E"/><rect y="1400" width="1080" height="520" fill="#2A2244"/>`;
  const cores = ['#F7C531', '#E8344B', '#7FC3F0', '#F29BB0', '#6BEA8E'];
  for (let i = 0; i < 12; i++) { const x = 60 + i * 90, y = 260 + Math.sin(t * 2 + i) * 14 + (i % 3) * 40; s += `<line x1="${x}" y1="${y + 60}" x2="${x + 10}" y2="${y + 200}" stroke="#ddd" stroke-width="3"/><ellipse cx="${x}" cy="${y}" rx="44" ry="56" fill="${cores[i % 5]}" stroke="#1F1A24" stroke-width="6"/>`; }
  for (let i = 0; i < 30; i++) { const r = aleatorio(i + 3); s += `<circle cx="${r() * 1080}" cy="${600 + r() * 700}" r="${4 + r() * 6}" fill="${cores[i % 5]}" opacity="0.7"/>`; }
  return s;
}
function fundoNoiteRua(t) {
  return ceu('#0E1430', '#2E3F6E', 'ceuNR') + `<circle cx="850" cy="300" r="70" fill="#F3EDD3"/>` + casario(-20, 1100, 1500, { semente: 71, alt: [300, 900], escuro: 0.7 }) + `<rect y="1500" width="1080" height="420" fill="#2A2A32"/>`;
}
function fundoBanheiro(t) {
  let s = `<rect width="1080" height="1920" fill="#E6F2F2"/>`;
  for (let y = 0; y < 1920; y += 100) for (let x = (y / 100) % 2 ? 50 : 0; x < 1080; x += 100) s += `<rect x="${x}" y="${y}" width="96" height="96" fill="#D2E8E8"/>`;
  s += `<rect x="190" y="220" width="700" height="900" rx="40" fill="#BFE6F0" stroke="#1F1A24" stroke-width="12"/><path d="M 260 320 L 360 280 M 280 420 L 420 340" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity="0.6"/>`;
  return s;
}
function fundoQuintal(t) {
  return ceu('#7DBDE8', '#D2ECF7', 'ceuQ') + `<rect y="900" width="1080" height="300" fill="#C98A5E"/>` + casario(-20, 1100, 900, { semente: 81, alt: [200, 500] }) + `<rect y="1200" width="1080" height="720" fill="#6BBA66"/>` +
    Array.from({ length: 40 }, (_, i) => { const r = aleatorio(i + 9); const x = r() * 1080, y = 1220 + r() * 680; return `<path d="M ${x} ${y} l 6 -22 l 6 22" fill="none" stroke="#4E9A4A" stroke-width="5"/>`; }).join('');
}
function fundoLago(t) {
  let s = ceu('#9DD0F0', '#E2F3FB', 'ceuL') + `<rect y="1000" width="1080" height="920" fill="#3A8FC8"/>`;
  for (let i = 0; i < 8; i++) s += `<path d="M ${-100 + ((t * 40 + i * 160) % 1300)} ${1100 + i * 100} q 40 -20 80 0 q 40 20 80 0" fill="none" stroke="#9BD0F0" stroke-width="6"/>`;
  return s;
}
const FUNDOS = {
  quarto: (lt) => quartoDesfocado(lt),
  quartoN: (lt) => quarto(lt, { cartazLinhas: null }),
  tela: () => fundoTela(),
  cozinha: (lt) => cozinha(lt, { noite: false, vapor: false }),
  cozinhaNoite: (lt) => cozinha(lt, { noite: true, vapor: false }),
  patio: (lt) => patio(lt, { cantina: false }),
  rua: (lt) => pontoOnibus(lt),
  mercado: (lt) => mercadinho(lt),
  corredor: (lt) => corredor(lt),
  escritorio: fundoEscritorio,
  festa: fundoFesta,
  noite: fundoNoiteRua,
  banheiro: fundoBanheiro,
  quintal: fundoQuintal,
  lago: fundoLago,
};
const fundo = (nome, lt) => (typeof nome === 'function' ? nome(lt) : (FUNDOS[nome] || FUNDOS.quarto)(lt));

// ---------- peças ----------
function luzCelH() {
  return `<defs><radialGradient id="luzH" cx="0.5" cy="0.62" r="0.55"><stop offset="0" stop-color="#7FC3F0" stop-opacity="0.3"/><stop offset="1" stop-color="#0E1430" stop-opacity="0"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#luzH)"/>`;
}
function tituloH(linhas) {
  return `<rect width="1080" height="${120 + linhas.length * 120}" fill="#0E1430" opacity="0.6"/>` +
    linhas.map(([t, cor], i) => `<text x="540" y="${190 + i * 120}" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="${Math.min(112, 1850 / t.length)}" fill="${cor || '#fff'}" stroke="#15131A" stroke-width="14" paint-order="stroke">${esc(t)}</text>`).join('');
}
function relogioH(hora, lt, vermelho = false, y = 110) {
  return pulo(`<rect x="330" y="${y}" width="420" height="116" rx="58" fill="#15131A" stroke="${vermelho ? '#E8344B' : '#fff'}" stroke-width="6"/>` +
    `<text x="540" y="${y + 86}" text-anchor="middle" font-family="Anton, sans-serif" font-size="78" fill="${vermelho ? '#FF5A6A' : '#F7C531'}">${hora}</text>`, lt, 540, y + 58, 0.05, 0.25);
}
// Card grande que pula na palavra: { palavra, texto, emoji, cor, y }
function cardH(lt, c, { palavra, texto, emoji = '', cor = '#15131A', y = 520, x = 540, rot = -4 }) {
  const t0 = typeof palavra === 'number' ? palavra : c.w(palavra || '', 0, 0.3);
  som('pop', t0, 0.8);
  if (lt < t0) return '';
  const tam = Math.min(110, 1300 / (texto.length + (emoji ? 2 : 0)));
  const w = Math.min(980, (texto.length + (emoji ? 2 : 0)) * tam * 0.62 + 120);
  const g = `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="${-w / 2 + 8}" y="-82" width="${w}" height="180" rx="34" fill="#000" opacity="0.3"/>` +
    `<rect x="${-w / 2}" y="-90" width="${w}" height="180" rx="34" fill="#fff" stroke="#15131A" stroke-width="8"/>` +
    `<text x="0" y="${tam * 0.36}" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="${tam}" fill="${cor}">${emoji ? emoji + ' ' : ''}${esc(texto)}</text></g>`;
  return pulo(g, lt, x, y, t0);
}
function etiquetaH(texto, x = 790, y = 1560, cor = '#E8344B') {
  return `<g transform="translate(${x} ${y}) rotate(-8)"><rect x="${-(texto.length * 17 + 50)}" y="-55" width="${texto.length * 34 + 100}" height="110" rx="55" fill="${cor}" stroke="#15131A" stroke-width="6"/><text x="0" y="22" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="58" fill="#fff">${esc(texto)}</text></g>`;
}

// ---------- cenas ----------
// Gancho: close em pânico + título de 3 linhas já no 1º quadro.
function ganchoH(fala, linhas, { fundo: f = 'quarto', expr = 'panico', extra, close = true, pose = 'cabeca' } = {}) {
  return {
    fala, capa: 0.05,
    desenhar(lt, c) {
      let s = fundo(f, lt);
      s += close ? kyleClose({ x: 540, y: 1150, esc: 1.45, expr, suor: true, t: lt }) : kyleCorpo({ x: 540, y: 1880, esc: 0.95, pose, expr, suor: true, t: lt });
      if (extra) s += extra(lt, c);
      s += tituloH(linhas);
      return tremor(s, lt, 0.1, 10, 0.4);
    },
  };
}
// Close do rosto. troca = { palavra, expr } muda a expressão na palavra.
function closeH(fala, { fundo: f = 'quarto', expr = 'neutro', troca, suor = false, extra, relogio, luz = false, olhar } = {}) {
  return {
    fala,
    desenhar(lt, c) {
      const e = troca && lt > c.w(troca.palavra) ? troca.expr : expr;
      let s = fundo(f, lt) + kyleClose({ x: 540, y: 1000, esc: 1.55, expr: e, suor: suor || (troca && lt > c.w(troca.palavra) && troca.suor), t: lt, olhar: olhar || [0, 0], fala: e === 'fala' });
      if (luz) s += luzCelH();
      if (relogio) s += relogioH(relogio, lt, relogio.vermelho);
      if (extra) s += extra(lt, c);
      if (troca && troca.tremer) s = tremor(s, lt, c.w(troca.palavra), 12, 0.4);
      return s;
    },
  };
}
// Corpo inteiro centralizado.
function corpoH(fala, { fundo: f = 'quartoN', pose = 'base', expr = 'neutro', troca, celular = false, extra, relogio, x = 540, anda = false } = {}) {
  return {
    fala,
    desenhar(lt, c) {
      const mudou = troca && lt > c.w(troca.palavra);
      let mundo = fundo(f, lt) + kyleCorpo({ x, y: 1700, esc: 1.0, pose: mudou && troca.pose ? troca.pose : pose, celular, expr: mudou ? troca.expr : expr, suor: mudou, t: lt, p: anda ? { peD: [70, -Math.max(0, Math.sin(lt * 9)) * 30], peE: [-70, -Math.max(0, -Math.sin(lt * 9)) * 30] } : {} });
      let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.05, cy: 1150 });
      if (relogio) s += relogioH(relogio, lt);
      if (extra) s += extra(lt, c);
      return s;
    },
  };
}
// Conversa no celular. msgs = [{ de: 'eu'|'ela', txt, em: 'palavra' }]
function chatH(fala, { nome = 'contato', hora = '00:00', msgs = [], extra } = {}) {
  return {
    fala,
    desenhar(lt, c) {
      const vis = msgs.filter((m) => !m.em || lt > c.w(m.em) - 0.15);
      msgs.forEach((m) => m.em && som('bolha', c.w(m.em) - 0.15, 0.8));
      let s = fundoTela() + celularUI({ tela: 'chat', nome, hora, msgs: vis, digitando: vis.length < msgs.length });
      if (extra) s += extra(lt, c);
      return s;
    },
  };
}
// Votação A/B.
function votacaoH(fala, a, b) {
  return {
    fala, legendaY: 975,
    desenhar(lt, c) {
      let s = `<rect width="1080" height="1920" fill="#E8344B"/><rect width="1080" height="960" fill="#2E3F9E"/>`;
      s += `<svg x="0" y="0" width="1080" height="950" overflow="hidden">${kyleCorpo({ x: 380, y: 930, esc: 0.68, pose: a.pose || 'aponta', celular: a.pose === 'celular', expr: a.expr || 'determinado', t: lt })}<text x="740" y="600" text-anchor="middle" font-size="190">${a.emoji}</text></svg>`;
      s += `<svg x="0" y="970" width="1080" height="950" overflow="hidden">${kyleCorpo({ x: 380, y: 930, esc: 0.68, pose: b.pose || 'cabeca', celular: b.pose === 'celular', expr: b.expr || 'sem_graca', t: lt })}<text x="740" y="600" text-anchor="middle" font-size="190">${b.emoji}</text></svg>`;
      s += `<rect y="945" width="1080" height="30" fill="#15131A"/>`;
      s += pulo(`<circle cx="120" cy="130" r="72" fill="#2E3F9E" stroke="#fff" stroke-width="10"/><text x="120" y="162" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="96" fill="#fff">A</text>` + pilulaRed(a.rotulo, 590, 130, { tam: Math.min(50, 900 / a.rotulo.length) }), lt, 540, 130, c.w('a:') - 0.1);
      s += pulo(`<circle cx="120" cy="1100" r="72" fill="#E8344B" stroke="#fff" stroke-width="10"/><text x="120" y="1132" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="96" fill="#fff">B</text>` + pilulaRed(b.rotulo, 590, 1100, { tam: Math.min(50, 900 / b.rotulo.length) }), lt, 540, 1100, c.w('b:') - 0.1);
      return s;
    },
  };
}
function finalH(f = 'quarto') {
  return {
    fala: 'Comenta *A* ou *B*. A mais votada vira a parte dois.',
    desenhar(lt, c) {
      let s = fundo(f, lt) + kyleClose({ x: 540, y: 1000, esc: 1.5, expr: 'sem_graca', suor: true, t: lt });
      s += pulo(`<rect x="190" y="200" width="700" height="120" rx="60" fill="#F7C531" stroke="#15131A" stroke-width="6"/><text x="540" y="282" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="64" fill="#15131A">A ou B? 👇</text>`, lt, 540, 260, 0.2);
      return s;
    },
  };
}
// Capa padrão: fundo + close + título 2 linhas + etiqueta.
function capaH({ fundo: f = 'quarto', expr = 'panico', l1, l2, cor2 = '#F7C531', etiqueta, extra }) {
  return () => {
    let s = fundo(f, 0.4) + kyleClose({ x: 540, y: 1220, esc: 1.6, expr, suor: true, t: 0.4 });
    if (extra) s += extra();
    s += `<text x="540" y="300" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="${Math.min(150, 1700 / l1.length)}" fill="#fff" stroke="#15131A" stroke-width="18" paint-order="stroke">${esc(l1)}</text>`;
    s += `<text x="540" y="430" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="${Math.min(100, 1750 / l2.length)}" fill="${cor2}" stroke="#15131A" stroke-width="14" paint-order="stroke">${esc(l2)}</text>`;
    if (etiqueta) s += etiquetaH(etiqueta);
    return s;
  };
}

// Close de outro personagem (mesmo traço, outro visual).
function outroH(fala, visual, { fundo: f = 'quarto', expr = 'neutro', extra, falando = true } = {}) {
  return {
    fala,
    desenhar(lt, c) {
      let s = fundo(f, lt) + kyleClose({ x: 540, y: 1000, esc: 1.55, expr, fala: falando, t: lt, visual: { oculos: false, fone: false, estampa: false, ...visual } });
      if (extra) s += extra(lt, c);
      return s;
    },
  };
}
// Dois rostos lado a lado (ex.: gêmeos, eu x outro).
function duploH(fala, visualB, { fundo: f = 'quarto', exprA = 'surpreso', exprB = 'surpreso', extra } = {}) {
  return {
    fala,
    desenhar(lt, c) {
      let s = fundo(f, lt);
      s += `<g transform="translate(-250 0)">${kyleClose({ x: 540, y: 1150, esc: 1.0, expr: exprA, t: lt })}</g>`;
      s += `<g transform="translate(250 0)">${kyleClose({ x: 540, y: 1150, esc: 1.0, expr: exprB, t: lt + 1.3, visual: { oculos: false, fone: false, estampa: false, ...visualB } })}</g>`;
      if (extra) s += extra(lt, c);
      return s;
    },
  };
}
