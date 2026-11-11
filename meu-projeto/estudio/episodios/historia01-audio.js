// HISTÓRIA 1 — O ÁUDIO ERRADO
// Caio (24) grava um áudio xingando o chefe pro melhor amigo... e manda no grupo da empresa.
// O chefe acorda às 5h. São 4h56. Votação: A pede o wi-fi do vizinho / B manda outro áudio antes.

window.FONTE_LEGENDA = 'Baloo, sans-serif';
window.LEGENDA_Y = 1500;
window.TRATAR_VOZ = true;
window.VISUAL = { pele: '#C68E62', pele2: '#A8714C', cabelo: '#2B1D16', camisa: '#2F6DB5', oculos: false, fone: false, estampa: false };
const E = [];

const GRUPO = 'Equipe Vendas 🚀';
function luzCel() {
  return `<defs><radialGradient id="luzC" cx="0.5" cy="0.62" r="0.55"><stop offset="0" stop-color="#7FC3F0" stop-opacity="0.35"/><stop offset="1" stop-color="#0E1430" stop-opacity="0"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#luzC)"/>`;
}
function relogioGrande(txtHora, lt, vermelho = false) {
  return pulo(`<rect x="300" y="110" width="480" height="130" rx="65" fill="#15131A" stroke="${vermelho ? '#E8344B' : '#fff'}" stroke-width="6"/>` +
    `<text x="540" y="205" text-anchor="middle" font-family="Anton, sans-serif" font-size="88" fill="${vermelho ? '#FF5A6A' : '#F7C531'}">${txtHora}</text>`, lt, 540, 175, 0.05, 0.25);
}
function tituloGancho(linhas) {
  return `<rect width="1080" height="${120 + linhas.length * 120}" fill="#0E1430" opacity="0.6"/>` +
    linhas.map(([t, cor], i) => `<text x="540" y="${190 + i * 120}" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="${Math.min(100, 1550 / t.length)}" fill="${cor}" stroke="#15131A" stroke-width="14" paint-order="stroke">${t}</text>`).join('');
}
const audio = (seg) => `🎤 ━━━━━━━━  0:${String(seg).padStart(2, '0')}`;

// 1 — GANCHO
E.push({
  fala: 'Ele mandou um áudio xingando o chefe... no *grupo da empresa*. E o chefe acorda em *quatro minutos*.',
  capa: 0.05,
  desenhar(lt, c) {
    let s = quartoDesfocado(lt) + kyleClose({ x: 540, y: 1150, esc: 1.45, expr: 'panico', suor: true, t: lt }) + luzCel();
    s += tituloGancho([['MANDEI ÁUDIO XINGANDO', '#fff'], ['O CHEFE...', '#fff'], ['NO GRUPO DA EMPRESA', '#F7C531']]);
    return tremor(s, lt, 0.1, 10, 0.4);
  },
});

// 2 — sexta, 23h
E.push({
  fala: 'Sexta, onze da noite. O Caio desabafou com o melhor amigo: um áudio de quarenta e sete segundos falando *tudo* do chefe.',
  desenhar(lt, c) {
    let mundo = quarto(lt, { cartazLinhas: [['SEXTOU', '#C33A3A']] }) + `<rect width="1080" height="1920" fill="#0E1430" opacity="0.3"/>`;
    mundo += kyleCorpo({ x: 540, y: 1680, esc: 1.0, pose: 'celular', celular: true, expr: 'determinado', fala: true, t: lt });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.06, cy: 1150 });
    s += relogioGrande('23:00', lt);
    return s;
  },
});

// 3 — o grupo errado
E.push({
  fala: 'Só que o grupo de cima era o da empresa. *Trinta e oito pessoas*. Incluindo o Seu Paulo.',
  desenhar(lt, c) {
    let s = fundoTela() + celularUI({ tela: 'chat', nome: GRUPO, hora: '23:02', msgs: [{ de: 'ela', txt: 'Paulo: reunião segunda 8h' }, { de: 'eu', txt: audio(47) }] });
    s += pulo(`<g transform="translate(540 1720) rotate(-4)"><rect x="-260" y="-60" width="520" height="120" rx="60" fill="#E8344B" stroke="#15131A" stroke-width="7"/><text x="0" y="24" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="62" fill="#fff">38 PARTICIPANTES</text></g>`, lt, 540, 1720, c.w('trinta'));
    return s;
  },
});

// 4 — ele só percebeu de madrugada
E.push({
  fala: 'Ele só percebeu às quatro e cinquenta e seis da manhã. E o Seu Paulo acorda *todo dia às cinco*.',
  desenhar(lt, c) {
    let s = quartoDesfocado(lt) + kyleClose({ x: 540, y: 980, esc: 1.55, expr: lt > c.w('cinco') ? 'panico' : 'sono', suor: lt > c.w('cinco'), t: lt }) + luzCel();
    s += relogioGrande('04:56', lt, lt > c.w('cinco'));
    return s;
  },
});

// 5 — tenta apagar
E.push({
  fala: 'Ele tenta apagar pra todos... e aparece: *sem conexão*. A internet tinha caído.',
  desenhar(lt, c) {
    let s = fundoTela() + celularUI({ tela: 'chat', nome: GRUPO, hora: '04:57', msgs: [{ de: 'ela', txt: 'Paulo: reunião segunda 8h' }, { de: 'eu', txt: audio(47) }] });
    s += dedo(740, 1180, suave(lt / 0.6));
    if (lt > c.w('sem')) s += pulo(`<rect x="200" y="760" width="680" height="260" rx="30" fill="#fff" stroke="#15131A" stroke-width="6"/><text x="540" y="870" text-anchor="middle" font-size="80">📵</text><text x="540" y="960" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="56" fill="#E8344B">SEM CONEXÃO</text>`, lt, 540, 890, c.w('sem'));
    som('saida', c.w('sem'), 0.8);
    return s;
  },
});

// 6 — já ouviram
E.push({
  fala: 'E duas pessoas *já ouviram*. A Lúcia, do RH, mandou só isso.',
  desenhar(lt, c) {
    const msgs = [{ de: 'eu', txt: audio(47) + '  ✓✓ ouvido por 2' }];
    if (lt > c.w('lúcia')) msgs.push({ de: 'ela', txt: 'Lúcia RH: KKKKKKKKKK' });
    if (lt > c.w('isso')) msgs.push({ de: 'ela', txt: 'Lúcia RH: apaga isso AGORA' });
    som('bolha', c.w('lúcia'), 0.8); som('bolha', c.w('isso'), 0.8);
    return fundoTela() + celularUI({ tela: 'chat', nome: GRUPO, hora: '04:58', msgs });
  },
});

// 7 — o relógio
E.push({
  fala: 'Faltam dois minutos. Celular com *um por cento* de bateria.',
  desenhar(lt, c) {
    let s = quartoDesfocado(lt) + kyleClose({ x: 540, y: 980, esc: 1.6, expr: 'panico', suor: true, t: lt }) + luzCel();
    s += relogioGrande('04:58', lt, true);
    s += pulo(`<g transform="translate(820 1760) rotate(8)"><rect x="-120" y="-55" width="220" height="110" rx="16" fill="#15131A" stroke="#fff" stroke-width="6"/><rect x="100" y="-22" width="22" height="44" rx="6" fill="#fff"/><rect x="-104" y="-39" width="14" height="78" fill="#E8344B"/><text x="20" y="20" text-anchor="middle" font-family="Anton, sans-serif" font-size="56" fill="#E8344B">1%</text></g>`, lt, 820, 1760, c.w('um'));
    return tremor(s, lt, c.w('um'), 8, 0.3);
  },
});

// 8 — votação
E.push({
  fala: 'O que ele faz? A: pede o wi-fi do vizinho pra apagar. B: manda outro áudio pedindo desculpa antes do chefe ouvir.',
  legendaY: 975,
  desenhar(lt, c) {
    let s = `<rect width="1080" height="1920" fill="#E8344B"/><rect width="1080" height="960" fill="#2E3F9E"/>`;
    s += `<svg x="0" y="0" width="1080" height="950" overflow="hidden"><g>${kyleCorpo({ x: 480, y: 930, esc: 0.68, pose: 'aponta', expr: 'determinado', t: lt })}</g><text x="840" y="420" font-size="150">📶</text></svg>`;
    s += `<svg x="0" y="970" width="1080" height="950" overflow="hidden"><g>${kyleCorpo({ x: 480, y: 930, esc: 0.68, pose: 'celular', celular: true, expr: 'vergonha', fala: true, t: lt })}</g><text x="820" y="420" font-size="150">🎤</text></svg>`;
    s += `<rect y="945" width="1080" height="30" fill="#15131A"/>`;
    s += pulo(`<circle cx="120" cy="130" r="72" fill="#2E3F9E" stroke="#fff" stroke-width="10"/><text x="120" y="162" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="96" fill="#fff">A</text>` + pilulaRed('WI-FI DO VIZINHO', 560, 130, { tam: 50 }), lt, 540, 130, c.w('a:') - 0.1);
    s += pulo(`<circle cx="120" cy="1100" r="72" fill="#E8344B" stroke="#fff" stroke-width="10"/><text x="120" y="1132" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="96" fill="#fff">B</text>` + pilulaRed('ÁUDIO DE DESCULPA', 560, 1100, { tam: 50 }), lt, 540, 1100, c.w('b:') - 0.1);
    return s;
  },
});

// 9 — final
E.push({
  fala: 'Comenta *A* ou *B*. A mais votada vira a parte dois.',
  desenhar(lt, c) {
    let s = quartoDesfocado(lt) + kyleClose({ x: 540, y: 1000, esc: 1.5, expr: 'sem_graca', suor: true, t: lt }) + luzCel();
    s += pulo(`<rect x="190" y="200" width="700" height="120" rx="60" fill="#F7C531" stroke="#15131A" stroke-width="6"/><text x="540" y="282" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="64" fill="#15131A">A ou B? 👇</text>`, lt, 540, 260, 0.2);
    s += relogioGrande('04:59', lt, true).replace('y="110"', 'y="360"').replace('y="205"', 'y="455"');
    return s;
  },
});

window.CAPA = () => {
  let s = quartoDesfocado(0.4) + kyleClose({ x: 540, y: 1200, esc: 1.6, expr: 'panico', suor: true, t: 0.4 }) + luzCel();
  s += `<text x="540" y="300" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="130" fill="#fff" stroke="#15131A" stroke-width="18" paint-order="stroke">ÁUDIO ERRADO</text>`;
  s += `<text x="540" y="430" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="88" fill="#F7C531" stroke="#15131A" stroke-width="14" paint-order="stroke">NO GRUPO DA EMPRESA 😱</text>`;
  s += `<g transform="translate(790 1560) rotate(-8)"><rect x="-200" y="-55" width="400" height="110" rx="55" fill="#E8344B" stroke="#15131A" stroke-width="6"/><text x="0" y="22" text-anchor="middle" font-family="Anton, sans-serif" font-size="66" fill="#fff">⏰ 4 MIN</text></g>`;
  return s;
};

criarEpisodio(E, { voz: 'de-DE-FlorianMultilingualNeural', velocidade: '+8%' });
