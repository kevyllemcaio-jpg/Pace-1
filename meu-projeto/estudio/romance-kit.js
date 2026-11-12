// romance-kit.js — cenas prontas para as histórias de romance de escola (estilo chibi).
// Uso: romance() ; RS.push(...cenas) ; fecharRomance({ capa }).
// Personagens: funções (o) => chibi({...visual, ...o}).

let RS = [];
function romance({ voz = 'pt-BR-ThalitaMultilingualNeural', velocidade = '+4%' } = {}) {
  window.FONTE_LEGENDA = 'Baloo, sans-serif';
  window.LEGENDA_Y = 1560;
  window.TRATAR_VOZ = true;
  window.TRILHA = 'calma';
  window._VOZ_R = { voz, velocidade };
  RS = [];
  return RS;
}
function fecharRomance({ capa }) {
  if (capa) window.CAPA = capa;
  criarEpisodio(RS, window._VOZ_R);
}
const VOZ_MENINO = 'en-US-AndrewMultilingualNeural';

// ---------- fundos ----------
function biblioteca(t) {
  let s = `<rect width="1080" height="1920" fill="#EADCC4"/><rect y="1500" width="1080" height="420" fill="#B98A5E"/>`;
  const cores = ['#B23A3A', '#2F5FA8', '#3B8A5A', '#C9A24A', '#7A3FB0', '#D9773A', '#5A6A7A'];
  for (let p = 0; p < 6; p++) {
    const y = 260 + p * 210;
    s += `<rect x="40" y="${y + 170}" width="1000" height="24" fill="#8A5A3C" stroke="#2A2238" stroke-width="5"/>`;
    const r = aleatorio(p + 3);
    for (let x = 60; x < 1020;) { const w = 24 + r() * 26, h = 110 + r() * 55; s += `<rect x="${x}" y="${y + 170 - h}" width="${w}" height="${h}" rx="3" fill="${cores[Math.floor(r() * 7)]}" stroke="#2A2238" stroke-width="3"/>`; x += w + 3; }
  }
  s += `<polygon points="700,0 1080,0 1080,900 300,1920 100,1920" fill="#FFF4D6" opacity="0.15"/>`;
  return s;
}
function salaAula(t) {
  let s = `<rect width="1080" height="1920" fill="#E8E1D2"/><rect y="1450" width="1080" height="470" fill="#B9A586"/>`;
  s += `<rect x="90" y="300" width="900" height="520" rx="10" fill="#2F5A44" stroke="#6B4228" stroke-width="22"/>`;
  s += `<text x="540" y="430" text-anchor="middle" font-family="Caveat, cursive" font-size="74" fill="#F4F1E6">Trabalho de Ciências</text>`;
  s += `<text x="540" y="540" text-anchor="middle" font-family="Caveat, cursive" font-size="58" fill="#F4F1E6">duplas sorteadas 🎲</text>`;
  s += `<path d="M 200 700 Q 400 650 600 720" fill="none" stroke="#F4F1E6" stroke-width="5" opacity="0.6"/>`;
  for (let i = 0; i < 3; i++) s += `<rect x="${80 + i * 340}" y="1330" width="260" height="34" fill="#C9A06A" stroke="#2A2238" stroke-width="5"/>`;
  return s;
}
function chuvaDia(t) {
  return patio(t, { cantina: false }) + `<rect width="1080" height="1920" fill="#5A6A80" opacity="0.45"/>` + chuvaAnime(t, 90);
}
const FR = {
  patio: (lt) => patio(lt, { cantina: false }),
  corredor: (lt) => corredor(lt),
  quarto: (lt) => quarto(lt, { cartazLinhas: [['SONHOS', '#C33A3A']] }),
  noite: (lt) => quarto(lt, { luz: 0.6, cartazLinhas: [['SONHOS', '#C33A3A']] }),
  biblioteca, sala: salaAula, chuva: chuvaDia,
  rosa: (lt) => fundoDiagonal(lt, { a: '#F29BB0', b: '#C86A9A' }),
  roxo: (lt) => fundoDiagonal(lt, { a: '#7A5AB8', b: '#4A3A8E' }),
};
const fr = (n, lt) => filtroAdesivo() + (typeof n === 'function' ? n(lt) : (FR[n] || FR.patio)(lt));

// ---------- peças ----------
function coracao(x, y, k = 1, cor = '#F2577A') {
  return `<path transform="translate(${x} ${y}) scale(${k})" d="M 0 30 C -60 -10 -40 -70 0 -40 C 40 -70 60 -10 0 30 Z" fill="${cor}" stroke="#2A2238" stroke-width="5"/>`;
}
function coracoes(lt, n = 6) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const r = aleatorio(i + 11), k = (lt * 0.45 + r()) % 1;
    const x = i % 2 ? 70 + r() * 170 : 840 + r() * 170;
    s += `<g opacity="${1 - k}">${coracao(x, 1250 - k * 900, 0.6 + r() * 0.6)}</g>`;
  }
  return s;
}
function bilhete(x, y, rot, texto, escala = 1) {
  const linhas = texto.split('|');
  let s = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${escala})"><rect x="-270" y="-150" width="540" height="300" rx="8" fill="#000" opacity="0.15" transform="translate(8 10)"/><rect x="-270" y="-150" width="540" height="300" rx="8" fill="#FFF9E8" stroke="#2A2238" stroke-width="5"/>`;
  for (let i = 0; i < 5; i++) s += `<line x1="-240" y1="${-90 + i * 52}" x2="240" y2="${-90 + i * 52}" stroke="#BFD2E0" stroke-width="2"/>`;
  linhas.forEach((l, i) => (s += `<text x="0" y="${-30 + i * 64 - (linhas.length - 1) * 20}" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="58" fill="#2A2238">${esc(l)}</text>`));
  return s + `</g>`;
}
function guardaChuva(x, y, escala = 1, cor = '#F2577A', rot = 0) {
  let s = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${escala})"><line x1="0" y1="-200" x2="0" y2="120" stroke="#2A2238" stroke-width="12"/><path d="M 0 120 Q 0 160 -36 160" fill="none" stroke="#2A2238" stroke-width="12" stroke-linecap="round"/>`;
  for (let i = 0; i < 6; i++) { const x0 = -260 + i * 86.6; s += `<path d="M 0 -220 L ${x0} -60 Q ${x0 + 43} -90 ${x0 + 86.6} -60 Z" fill="${i % 2 ? '#FFFFFF' : cor}" stroke="#2A2238" stroke-width="5" stroke-linejoin="round"/>`; }
  return s + `</g>`;
}

// ---------- cenas ----------
// Close grande (cabeça centralizada).
function closeR(fala, quem, { fundo = 'patio', expr = 'neutro', troca, extra, voz, vergonha = 0, olhar = [0, 0], braco = 'baixo', segura, dur } = {}) {
  return {
    fala, voz, dur,
    desenhar(lt, c) {
      const m = troca && lt > c.w(troca.palavra);
      const e = m ? troca.expr : expr;
      const vg = m && troca.vergonha !== undefined ? troca.vergonha : vergonha;
      let s = fr(fundo, lt) + quem({ x: 540, y: 2020, esc: 2.3, expr: e, t: lt, fala: !!voz, vergonha: vg, olhar, braco, segura });
      if (vg > 0.5) s += coracoes(lt);
      if (extra) s += extra(lt, c);
      return s;
    },
  };
}
// Dois personagens lado a lado, um olhando pro outro.
function duoR(fala, a, b, { fundo = 'patio', exprA = 'neutro', exprB = 'neutro', troca, extra, voz, falaA = false, falaB = false, vgA = 0, vgB = 0, bracoA, bracoB, segA, segB, coracao: cor = false } = {}) {
  return {
    fala, voz,
    desenhar(lt, c) {
      const m = troca && lt > c.w(troca.palavra);
      const eA = m && troca.exprA ? troca.exprA : exprA, eB = m && troca.exprB ? troca.exprB : exprB;
      let s = fr(fundo, lt);
      s += a({ x: 300, y: 1780, esc: 1.35, expr: eA, t: lt, olhar: [1, 0], fala: falaA, vergonha: m && troca.vgA !== undefined ? troca.vgA : vgA, braco: bracoA, segura: segA });
      s += b({ x: 790, y: 1780, esc: 1.35, expr: eB, t: lt + 1.1, olhar: [1, 0], vira: -1, fala: falaB, vergonha: m && troca.vgB !== undefined ? troca.vgB : vgB, braco: bracoB, segura: segB });
      if (cor || (m && troca.coracao)) s += coracoes(lt);
      if (extra) s += extra(lt, c);
      return s;
    },
  };
}
function ganchoR(fala, linhas, quem, { fundo = 'patio', expr = 'surpreso', vergonha = 0, extra } = {}) {
  return {
    fala, capa: 0.05,
    desenhar(lt, c) {
      let s = fr(fundo, lt) + quem({ x: 540, y: 2120, esc: 2.3, expr, t: lt, vergonha });
      if (vergonha > 0.5) s += coracoes(lt);
      if (extra) s += extra(lt, c);
      return s + tituloH(linhas);
    },
  };
}
function votacaoR(fala, a, b) {
  return {
    fala, legendaY: 975,
    desenhar(lt, c) {
      let s = filtroAdesivo();
      s += `<svg x="0" y="0" width="1080" height="950" overflow="hidden">${fundoDiagonal(lt, { a: '#F29BB0', b: '#E07AA0' })}${a.quem({ x: 330, y: 1250, esc: 1.35, expr: a.expr || 'feliz', t: lt, vergonha: a.vergonha || 0 })}<text x="800" y="620" text-anchor="middle" font-size="200">${a.emoji}</text></svg>`;
      s += `<svg x="0" y="970" width="1080" height="950" overflow="hidden">${fundoDiagonal(lt, { a: '#7A5AB8', b: '#5A4A9E' })}${b.quem({ x: 330, y: 1250, esc: 1.35, expr: b.expr || 'sorriso', t: lt, vergonha: b.vergonha || 0 })}<text x="800" y="620" text-anchor="middle" font-size="200">${b.emoji}</text></svg>`;
      s += `<rect y="945" width="1080" height="30" fill="#2A2238"/>`;
      s += pulo(`<circle cx="110" cy="120" r="70" fill="#F2577A" stroke="#fff" stroke-width="10"/><text x="110" y="152" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="92" fill="#fff">A</text>` + pilulaRed(a.rotulo, 600, 120, { tam: Math.min(48, 880 / a.rotulo.length) }), lt, 540, 120, c.w('a:') - 0.1);
      s += pulo(`<circle cx="110" cy="1090" r="70" fill="#7A5AB8" stroke="#fff" stroke-width="10"/><text x="110" y="1122" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="92" fill="#fff">B</text>` + pilulaRed(b.rotulo, 600, 1090, { tam: Math.min(48, 880 / b.rotulo.length) }), lt, 540, 1090, c.w('b:') - 0.1);
      return s;
    },
  };
}
function finalR(quem, fundo = 'rosa') {
  return {
    fala: 'Comenta *A* ou *B*. A mais votada vira a parte dois.',
    semLegenda: true,
    desenhar(lt, c) {
      let s = fr(fundo, lt) + quem({ x: 540, y: 2120, esc: 2.3, expr: 'vergonha', vergonha: 1, t: lt }) + coracoes(lt, 8);
      s += pulo(tituloRed('PARTE 2?', 540, 330, { tam: 150 }), lt, 540, 290, 0.1);
      s += pulo(tituloRed('VOCÊ DECIDE 💗', 540, 480, { tam: 100, cor: '#F7C531' }), lt, 540, 450, 0.45);
      s += pulo(pilulaRed('COMENTA A OU B 👇', 540, 620, { tam: 54 }), lt, 540, 620, 0.8);
      return s;
    },
  };
}
function capaR({ fundo = 'rosa', quem, expr = 'vergonha', vergonha = 1, l1, l2, etiqueta, extra }) {
  return () => {
    let s = fr(fundo, 0.4) + quem({ x: 540, y: 2300, esc: 2.4, expr, vergonha, t: 0.4 }) + coracoes(0.4, 7);
    if (extra) s += extra();
    s += tituloRed(l1, 540, 300, { tam: Math.min(140, 1700 / l1.length) });
    s += tituloRed(l2, 540, 440, { tam: Math.min(104, 1500 / l2.length), cor: '#F7C531' });
    if (etiqueta) s += etiquetaH(etiqueta, 790, 1580, '#F2577A');
    return s;
  };
}
