// KYLE — Episódio 2: O DENTE (~40 s, gancho nos 2 primeiros segundos)
// Escolha: DENTISTA. Custa R$ 300, ele tem R$ 47. Vende o violão por R$ 250 + o que tem. Dente novo: 2% -> 15%.
// Reviravolta: a Manu pede pra ouvir ele tocar violão no reencontro. Votação: RECOMPRA x VIZINHO.

window.FONTE_LEGENDA = 'Baloo, sans-serif';
window.LEGENDA_Y = 1500;
window.TRATAR_VOZ = false;
const E = [];

function luz() { return `<defs><radialGradient id="luzCel" cx="0.5" cy="0.62" r="0.55"><stop offset="0" stop-color="#7FC3F0" stop-opacity="0.3"/><stop offset="1" stop-color="#0E1430" stop-opacity="0"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#luzCel)"/>`; }
function violao(x, y, esc = 1, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${esc})"><rect x="-14" y="-330" width="28" height="240" fill="#6B4228" stroke="#1F1A24" stroke-width="6"/><rect x="-24" y="-370" width="48" height="56" rx="8" fill="#4A2E1C" stroke="#1F1A24" stroke-width="6"/>` +
    `<path d="M 0 -110 C -110 -120 -110 -20 -60 0 C -130 30 -110 150 0 150 C 110 150 130 30 60 0 C 110 -20 110 -120 0 -110 Z" fill="#D9923A" stroke="#1F1A24" stroke-width="7"/><circle cx="0" cy="10" r="32" fill="#3A2418" stroke="#1F1A24" stroke-width="5"/></g>`;
}
function titulo(linhas) {
  return `<rect width="1080" height="${120 + linhas.length * 120}" fill="#0E1430" opacity="0.6"/>` +
    linhas.map(([t, cor], i) => `<text x="540" y="${190 + i * 120}" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="${Math.min(108, 1800 / t.length)}" fill="${cor || '#fff'}" stroke="#15131A" stroke-width="14" paint-order="stroke">${esc(t)}</text>`).join('');
}
function etiqueta(texto, lt, t0, cor = '#E8344B', y = 1250) {
  if (lt < t0) return '';
  som('pop', t0, 0.8);
  return pulo(`<g transform="translate(540 ${y}) rotate(-5)"><rect x="${-(texto.length * 19 + 50)}" y="-60" width="${texto.length * 38 + 100}" height="120" rx="60" fill="${cor}" stroke="#15131A" stroke-width="7"/><text x="0" y="24" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="64" fill="#fff">${esc(texto)}</text></g>`, lt, 540, y, t0);
}

// 1 — GANCHO (conflito em 1 segundo)
E.push({
  fala: 'Vocês escolheram dentista. Custa trezentos reais. E o Kyle tem *quarenta e sete*.',
  capa: 0.05,
  desenhar(lt, c) {
    let s = quartoDesfocado(lt) + kyleClose({ x: 540, y: 1180, esc: 1.45, expr: 'sem_graca', semDente: true, suor: true, t: lt }) + luz();
    s += titulo([['DENTISTA: R$ 300'], ['EU TENHO: R$ 47', '#FF5A6A'], ['PARTE 2 🦷', '#F7C531']]);
    return s;
  },
});
// 2 — selfie
E.push({
  fala: 'E a Manu acabou de pedir: *manda uma selfie atual*.',
  desenhar(lt, c) {
    som('bolha', 0.3, 0.9);
    return fundoTela() + celularUI({ tela: 'chat', nome: 'manu.reis', hora: '09:14', msgs: lt > 0.3 ? [{ de: 'ela', txt: 'bom diaaa' }, { de: 'ela', txt: 'manda uma selfie atual 😂' }] : [{ de: 'ela', txt: 'bom diaaa' }] });
  },
});
// 3 — pânico
E.push({
  fala: 'Com essa janela no dente? *Nem pensar*.',
  desenhar(lt, c) {
    let s = quartoDesfocado(lt) + kyleClose({ x: 540, y: 1000, esc: 1.7, expr: 'janelinha', semDente: true, vergonha: 0.8, suor: true, t: lt });
    return tremor(s, lt, c.w('nem'), 12, 0.4);
  },
});
// 4 — o violão
E.push({
  fala: 'Aí ele olhou pro violão encostado no canto. E anunciou: *vende-se, trezentos reais*.',
  desenhar(lt, c) {
    let s = quarto(lt, { cartazLinhas: [['LEVEL', '#2A2A2A'], ['UP', '#C33A3A']] }) + violao(300, 1500, 1.0, -8);
    s += kyleCorpo({ x: 680, y: 1700, esc: 0.95, pose: lt > c.w('vende') ? 'celular' : 'aponta', celular: lt > c.w('vende'), expr: 'triste', semDente: true, t: lt });
    return s + etiqueta('VENDE-SE · R$ 300', lt, c.w('vende'), '#E8344B', 560);
  },
});
// 5 — vendeu
E.push({
  fala: 'Vendeu em dez minutos. Por *duzentos e cinquenta*. Somando os quarenta e sete... deu.',
  desenhar(lt, c) {
    som('caixa', c.w('duzentos'), 1);
    return fundoTela() + celularUI({ tela: 'chat', nome: 'comprador', hora: '09:31', msgs: [{ de: 'ela', txt: 'fecho por 250 agora' }, ...(lt > c.w('duzentos') ? [{ de: 'eu', txt: 'fechado 😔' }] : [])] }) + etiqueta('R$ 250 + R$ 47 = R$ 297', lt, c.w('somando'), '#1E9E4A', 1650);
  },
});
// 6 — dente novo
E.push({
  fala: 'Três dias depois... dente novo.',
  desenhar(lt, c) {
    const t0 = c.w('dente');
    let s = quartoDesfocado(lt, false) + kyleClose({ x: 540, y: 1000, esc: 1.6, expr: lt > t0 ? 'sorrisao' : 'sem_graca', semDente: lt < t0, t: lt });
    s += flashBranco(lt, t0, 0.35);
    for (let i = 0; i < 4; i++) if (lt > t0) { const k = ((lt - t0) * 1.2 + i / 4) % 1; s += `<text x="${380 + i * 110}" y="${1240 - k * 120}" font-size="60" opacity="${1 - k}">✨</text>`; }
    som('carimbo', t0, 0.8);
    return s;
  },
});
// 7 — barra sobe
E.push({
  fala: 'Parecido com o Kyle de 2015: de dois... pra *quinze por cento*.',
  desenhar(lt, c) {
    const pct = Math.round(mix(2, 15, suave((lt - c.w('quinze')) / 0.8)));
    let s = quartoDesfocado(lt, false) + kyleClose({ x: 540, y: 1060, esc: 1.5, expr: 'sorrisao', t: lt });
    som('caixa', c.w('quinze'), 0.9);
    return s + hudReencontro(27, pct, lt, true);
  },
});
// 8 — a reviravolta
E.push({
  fala: 'Aí chegou mensagem da Manu: *você ainda toca violão, né? Quero ouvir no reencontro*.',
  desenhar(lt, c) {
    som('bolha', c.w('você') - 0.1, 0.9);
    let s = fundoTela() + celularUI({ tela: 'chat', nome: 'manu.reis', hora: '21:02', msgs: lt > c.w('você') - 0.1 ? [{ de: 'ela', txt: 'vc ainda toca violão né??' }, { de: 'ela', txt: 'quero ouvir no reencontro 🎸' }] : [] });
    return tremor(s, lt, c.w('reencontro'), 10, 0.4);
  },
});
// 9 — votação (estilo do ep. 1)
E.push({
  fala: 'E o violão... *já foi vendido*. Comenta uma palavra: *recompra* ou *vizinho*?',
  legendaY: 1560,
  desenhar(lt, c) {
    let s = `<rect width="1080" height="1920" fill="#E8344B"/><path d="M 0 0 L 600 0 L 480 1920 L 0 1920 Z" fill="#F2B233"/><path d="M 600 0 L 480 1920" stroke="#fff" stroke-width="12"/>`;
    s += hudReencontro(27, 15, lt);
    s += `<rect x="300" y="250" width="480" height="84" rx="16" fill="#15131A" stroke="#fff" stroke-width="4"/><text x="540" y="308" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="38" fill="#fff">COMENTE UMA PALAVRA</text>`;
    [[280, 'RECOMPRA', 'O DELE DE VOLTA', '💸', c.w('recompra')], [810, 'VIZINHO', 'PEDE EMPRESTADO', '🏠', c.w('vizinho')]].forEach(([x, t1, t2, ic, t0]) => {
      s += pulo(`<text x="${x}" y="470" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="88" fill="#fff" stroke="#15131A" stroke-width="12" paint-order="stroke">${t1}</text>` +
        `<text x="${x}" y="522" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="34" fill="#fff">${t2}</text>` +
        `<text x="${x}" y="680" text-anchor="middle" font-size="110">${ic}</text>` +
        `<g transform="translate(${x} 1080) scale(0.78)">${kyleCabeca({ expr: 'sorrisao', t: lt, semente: x })}</g>`, lt, x, 800, t0);
      som('pop', t0, 0.8);
    });
    return s + `<circle cx="540" cy="560" r="62" fill="#15131A" stroke="#fff" stroke-width="6"/><text x="540" y="580" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="52" fill="#F7C531">OU</text>`;
  },
});
// 10 — segue
E.push({
  fala: 'Segue pra ver o episódio três.',
  semLegenda: true,
  dur: 2.5,
  desenhar(lt) {
    return quartoDesfocado(lt, false) + kyleClose({ x: 540, y: 1060, esc: 1.5, expr: 'sorrisao', t: lt }) +
      pulo(`<rect x="190" y="230" width="700" height="120" rx="60" fill="#F7C531" stroke="#15131A" stroke-width="6"/><text x="540" y="310" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="60" fill="#15131A">SEGUE PRO EP. 3 👉</text>`, lt, 540, 290, 0.1);
  },
});

window.CAPA = () => {
  let s = quartoDesfocado(0.4) + kyleClose({ x: 540, y: 1200, esc: 1.7, expr: 'janelinha', semDente: true, vergonha: 0.7, suor: true, t: 0.4 });
  s += `<text x="540" y="300" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="150" fill="#fff" stroke="#15131A" stroke-width="18" paint-order="stroke">PARTE 2</text>`;
  s += `<text x="540" y="430" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="92" fill="#F7C531" stroke="#15131A" stroke-width="14" paint-order="stroke">R$ 300 NO DENTE 🦷</text>`;
  s += `<g transform="translate(790 1580) rotate(-8)"><rect x="-200" y="-55" width="400" height="110" rx="55" fill="#E8344B" stroke="#15131A" stroke-width="6"/><text x="0" y="22" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="56" fill="#fff">TENHO R$ 47</text></g>`;
  return s;
};

criarEpisodio(E, { voz: 'pt-BR-AntonioNeural', velocidade: '+12%' });
