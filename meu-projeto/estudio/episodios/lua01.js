// MARCA DA LUA — Episódio 1: A MORDIDA (série original de lobisomem, ~5 min)
// Vale da Serra. Nico (17, goleiro reserva com asma) e Dudu (melhor amigo) entram na floresta à meia-noite
// pra buscar um drone. Uma criatura de olhos prateados morde o Nico. Nos dias seguintes: audição, olfato,
// força, cura... e a lua cheia é na sexta. Votação: A conta pro professor novo / B se tranca no porão.

window.LEGENDA_Y = 1560;
window.TRATAR_VOZ = true;
const NICO = { pele: '#E2A77E', pele2: '#C98A62', cabelo: '#2B1D16', camisa: '#3E5C93', oculos: false, fone: false, estampa: false };
const DUDU = { pele: '#8A5A3C', pele2: '#6E452C', cabelo: '#1E1612', camisa: '#F2C230', oculos: true, fone: false, estampa: false };
const PROF = { pele: '#E8B48C', pele2: '#C99470', cabelo: '#5A5A62', camisa: '#2A2A3A', oculos: false, fone: false, estampa: false };
const V_NICO = 'en-US-BrianMultilingualNeural';
const V_DUDU = { voz: 'pt-BR-AntonioNeural', velocidade: '+16%' };
const V_PROF = 'de-DE-FlorianMultilingualNeural';
const E = [];

// ---------- helpers ----------
const quartoNico = (lt, o = {}) => quarto(lt, { cartazLinhas: [['GOL', '#2A2A2A'], ['1', '#C33A3A']], ...o });
const quartoNicoBlur = (lt) => `<defs><filter id="dsf"><feGaussianBlur stdDeviation="14"/></filter></defs><g filter="url(#dsf)">${quartoNico(lt)}</g><rect width="1080" height="1920" fill="#0E1430" opacity="0.4"/>`;
const florestaBlur = (lt) => `<defs><filter id="dsf2"><feGaussianBlur stdDeviation="10"/></filter></defs><g filter="url(#dsf2)">${floresta(lt)}</g>`;
function close(fala, visual, { fundo = quartoNicoBlur, expr = 'neutro', voz, troca, lobo = 0, suor = false, extra, tremer, olhar, dur } = {}) {
  return {
    fala, voz, dur,
    desenhar(lt, c) {
      const mudou = troca && lt > c.w(troca.palavra);
      let s = fundo(lt) + kyleClose({ x: 540, y: 1020, esc: 1.5, expr: mudou ? troca.expr : expr, t: lt, visual, fala: !!voz && !mudou, suor: suor || (mudou && troca.suor), lobo: typeof lobo === 'function' ? lobo(lt, c) : lobo, olhar: olhar || [0, 0] });
      if (extra) s += extra(lt, c);
      if (tremer) s = tremor(s, lt, typeof tremer === 'number' ? tremer : c.w(tremer), 14, 0.5);
      return s;
    },
  };
}
function aviso(lt, c, palavra, texto, cor = '#15131A', y = 520) {
  return cardH(lt, c, { palavra, texto, cor, y });
}
function impacto(txt, lt, t0, o = {}) { return textoImpacto(txt, lt, t0, o); }

// ---------- 1 — GANCHO ----------
E.push({
  fala: 'Na sexta, o Nico era só o goleiro reserva. No sábado, ele ouvia o coração das pessoas a *cem metros*.',
  capa: 0.05,
  desenhar(lt, c) {
    let s = floresta(lt, { neblina: 1 }) + kyleClose({ x: 540, y: 1160, esc: 1.45, expr: 'panico', t: lt, visual: NICO, lobo: 0.6, suor: true });
    s += `<rect width="1080" height="480" fill="#000" opacity="0.55"/>`;
    s += `<text x="540" y="180" text-anchor="middle" font-family="Anton, sans-serif" font-size="100" fill="#fff" stroke="#000" stroke-width="10" paint-order="stroke">FUI MORDIDO NA FLORESTA</text>`;
    s += `<text x="540" y="310" text-anchor="middle" font-family="Anton, sans-serif" font-size="96" fill="#D8E8FF" stroke="#000" stroke-width="10" paint-order="stroke">E AGORA EU ESCUTO TUDO</text>`;
    s += `<text x="540" y="420" text-anchor="middle" font-family="Anton, sans-serif" font-size="56" fill="#F7C531" stroke="#000" stroke-width="8" paint-order="stroke">MARCA DA LUA · EPISÓDIO 1</text>`;
    return tremor(s, lt, 0.1, 10, 0.4);
  },
});

// ---------- 2 — Vale da Serra ----------
E.push({
  fala: 'Vale da Serra. Uma cidade pequena, cercada de mata. Onde, há trinta anos, *ninguém entra na floresta* depois que escurece.',
  desenhar(lt, c) {
    let s = ceu('#0B1024', '#2A3A64', 'ceuVS') + `<circle cx="800" cy="360" r="90" fill="#F4F1E0"/>`;
    s += `<path d="M -50 1100 Q 250 700 520 900 Q 760 620 1130 980 L 1130 1920 L -50 1920 Z" fill="#0E1626"/>`;
    for (let i = 0; i < 60; i++) { const r = aleatorio(i + 7); const x = r() * 1080, y = 820 + r() * 300; s += `<path d="M ${x} ${y} l -18 60 l 36 0 Z" fill="#0A111E"/>`; }
    s += casario(-20, 1100, 1700, { semente: 61, alt: [120, 300], escuro: 0.8 });
    s += `<rect y="1700" width="1080" height="220" fill="#0B0F1A"/>`;
    s += `<text x="540" y="250" text-anchor="middle" font-family="Anton, sans-serif" font-size="120" fill="#fff" letter-spacing="8" opacity="${lim(lt / 0.8)}">VALE DA SERRA</text>`;
    return camLenta(s, lt, c.dur, { z0: 1.0, z1: 1.08, cy: 900 });
  },
});

// ---------- 3 — o Nico ----------
E.push({
  fala: 'Esse é o Nico. Dezessete anos. Goleiro reserva do time da escola. E com uma asma que não deixa ele *correr mais de cinco minutos*.',
  desenhar(lt, c) {
    let mundo = quartoNico(lt) + kyleCorpo({ x: 540, y: 1700, esc: 1.0, pose: 'base', expr: 'neutro', t: lt, visual: NICO });
    let s = camLenta(mundo, lt, c.dur, { z0: 1.0, z1: 1.06, cy: 1150 });
    s += aviso(lt, c, 'goleiro', '🧤 GOLEIRO RESERVA', '#3E5C93', 480);
    s += aviso(lt, c, 'asma', '💨 ASMA', '#C33A3A', 680);
    return s;
  },
});

// ---------- 4 — mensagem do Dudu ----------
E.push({
  fala: 'Onze da noite. Mensagem do Dudu, o melhor amigo dele.',
  desenhar(lt, c) {
    const msgs = [{ de: 'ela', txt: 'nico' }];
    if (lt > 1.0) msgs.push({ de: 'ela', txt: 'acorda' });
    if (lt > 1.8) msgs.push({ de: 'ela', txt: 'MEU DRONE CAIU NA FLORESTA 😭' });
    if (lt > 2.5) msgs.push({ de: 'ela', txt: 'vem cmg agora' });
    [1.0, 1.8, 2.5].forEach((t0) => som('bolha', t0, 0.8));
    return fundoTela() + celularUI({ tela: 'chat', nome: 'Dudu 🤓', hora: '23:02', msgs });
  },
  dur: 3.5,
});

// ---------- 5 a 7 — diálogo ----------
E.push(close('Eu tava filmando as luzes estranhas no morro e o drone simplesmente apagou. Ele custou dois anos de mesada, Nico!', DUDU, { voz: V_DUDU, expr: 'panico', fundo: (lt) => fundoNoiteRua(lt) }));
E.push(close('Dudu, é meia-noite. Ninguém entra naquela floresta.', NICO, { voz: V_NICO, expr: 'sono', fundo: quartoNicoBlur }));
E.push(close('Exatamente. Ninguém vai pegar ele antes da gente.', DUDU, { voz: V_DUDU, expr: 'sorrisao', fundo: (lt) => fundoNoiteRua(lt) }));

// ---------- 8 — a caminhada até a trilha ----------
E.push({
  fala: 'Dez minutos depois, os dois estavam na entrada da trilha. Com uma lanterna e um celular com *doze por cento* de bateria.',
  desenhar(lt, c) {
    const cam = lt * 120;
    let s = floresta(lt, { cam, neblina: 0.5 });
    s += kyleCorpo({ x: 400, y: 1700, esc: 0.8, t: lt, visual: NICO, expr: 'triste', p: andarP(lt) });
    s += kyleCorpo({ x: 690, y: 1720, esc: 0.8, t: lt + 0.4, visual: DUDU, expr: 'determinado', p: { ...andarP(lt + 0.4), maoD: [200, -560] } });
    s += lanterna(860, 1270, -25, 1000, 15, Math.sin(lt * 3) * 4);
    s += aviso(lt, c, 'doze', '🔋 12%', '#C33A3A', 420);
    return s;
  },
});

// ---------- 9 — a floresta silenciosa ----------
E.push({
  fala: 'A floresta era mais escura do que eles lembravam. E silenciosa demais. *Nem grilo. Nem vento*.',
  desenhar(lt, c) {
    const cam = 300 + lt * 90;
    let s = floresta(lt, { cam, neblina: 0.9, escuro: 0.15 });
    s += kyleCorpo({ x: 470, y: 1680, esc: 0.62, t: lt, visual: NICO, expr: 'surpreso', p: andarP(lt, 6, 24), olhar: [1, 0] });
    s += kyleCorpo({ x: 650, y: 1690, esc: 0.62, t: lt + 0.3, visual: DUDU, expr: 'neutro', p: { ...andarP(lt + 0.3, 6, 24), maoD: [200, -560] } });
    s += lanterna(790, 1340, -15, 900, 14, Math.sin(lt * 2.5) * 6);
    return camLenta(s, lt, c.dur, { z0: 1.0, z1: 1.08, cy: 1300 });
  },
});

// ---------- 10 — Dudu fala ----------
E.push(close('Tá vendo? Tranquilo. Zero perigo.', DUDU, { voz: V_DUDU, expr: 'sorrisao', fundo: florestaBlur }));

// ---------- 11 — o galho ----------
E.push({
  fala: 'Até que um galho estalou. *Atrás deles*.',
  desenhar(lt, c) {
    const tc = c.w('estalou');
    let s = floresta(lt, { cam: 520, neblina: 1, escuro: 0.2 });
    s += kyleCorpo({ x: 430, y: 1700, esc: 0.75, t: lt, visual: NICO, expr: lt > tc ? 'panico' : 'neutro', pose: lt > tc ? 'cabeca' : 'base', suor: lt > tc });
    s += kyleCorpo({ x: 680, y: 1710, esc: 0.75, t: lt, visual: DUDU, expr: lt > tc ? 'panico' : 'neutro', p: { maoD: [200, -560] } });
    s += impacto('CRAC!', lt, tc, { y: 520, tam: 190, cor: '#F7C531' });
    som('carimbo', tc, 1.1);
    return tremor(s, lt, tc, 12, 0.4);
  },
});

// ---------- 12 — pânico ----------
E.push(close('Os dois congelaram. Ninguém respirava.', NICO, { expr: 'panico', suor: true, fundo: florestaBlur, olhar: [-1, 0] }));

// ---------- 13 — esquilo e drone ----------
E.push({
  fala: 'Era só um esquilo. E logo à frente, piscando no chão... *o drone*.',
  desenhar(lt, c) {
    let s = floresta(lt, { cam: 560 + lt * 40, neblina: 0.8 });
    s += `<g transform="translate(${180 + lt * 140} 1560)"><ellipse cx="0" cy="0" rx="30" ry="20" fill="#8A5A3C"/><path d="M -20 0 Q -60 -40 -40 -70" fill="none" stroke="#8A5A3C" stroke-width="18" stroke-linecap="round"/></g>`;
    s += drone(600, 1250, 1.6, lt);
    s += lanterna(560, 700, 82, 700, 12);
    return s;
  },
});

// ---------- 14 — Dudu feliz ----------
E.push(close('Ele tá vivo! Ele tá vivo! Vem com o papai!', DUDU, { voz: V_DUDU, expr: 'sorrisao', fundo: florestaBlur }));

// ---------- 15 — a gravação ----------
E.push({
  fala: 'O Dudu abriu a última gravação do drone. E na tela... tinha *dois olhos brilhando*.',
  desenhar(lt, c) {
    let s = florestaBlur(lt) + telaDrone(lt, { olhos: lt > c.w('olhos') });
    if (lt > c.w('olhos')) s += `<g transform="translate(540 960)"><circle cx="-15" cy="-40" r="120" fill="none" stroke="#FF3040" stroke-width="10" opacity="${0.6 + 0.4 * Math.sin(lt * 8)}" transform="translate(0 0)"/></g>`;
    return s;
  },
});

// ---------- 16 e 17 — diálogo ----------
E.push(close('Dudu... isso foi gravado há quanto tempo?', NICO, { voz: V_NICO, expr: 'panico', suor: true, fundo: florestaBlur }));
E.push(close('Há... dez segundos.', DUDU, { voz: V_DUDU, expr: 'panico', suor: true, fundo: florestaBlur, tremer: 0.6 }));

// ---------- 18 — a criatura ----------
E.push({
  fala: 'A neblina se abriu. E eles viram. Mais de *dois metros* de altura. Pelo cinza. Olhos prateados.',
  desenhar(lt, c) {
    const ta = c.w('viram');
    let s = floresta(lt, { cam: 620, neblina: 1.4, escuro: 0.1 });
    const k = suave((lt - ta + 0.4) / 1.4);
    s += `<g opacity="${lim(k * 1.2)}">${lobisomem(540, 1700, mix(0.7, 1.05, k), lt, { rugindo: lt > c.w('olhos') })}</g>`;
    s += impacto('2 METROS', lt, c.w('dois'), { y: 380, tam: 150, cor: '#D8E8FF' });
    som('saida', c.w('olhos'), 1);
    return camLenta(s, lt, c.dur, { z0: 1.0, z1: 1.15, cy: 900 });
  },
});

// ---------- 19 — rugido (close) ----------
E.push({
  fala: 'E rugiu.',
  dur: 2.2,
  desenhar(lt, c) {
    let s = floresta(lt, { cam: 620, neblina: 1 }) + loboClose(540, 900, 1.6, lt);
    s += impacto('GRRRAAAH', lt, 0.3, { y: 380, tam: 170, cor: '#D8E8FF' });
    som('carimbo', 0.3, 1.2);
    return tremor(s, lt, 0.3, 26, 1.2);
  },
});

// ---------- 20 — correm ----------
E.push({
  fala: 'Correram. O Dudu na frente, gritando. O Nico atrás... *sem ar*.',
  desenhar(lt, c) {
    const cam = 700 + lt * 600;
    let s = floresta(lt, { cam, neblina: 0.7 });
    s += kyleCorpo({ x: 720, y: 1720, esc: 0.75, t: lt, visual: DUDU, expr: 'panico', suor: true, p: correrP(lt + 0.2) });
    s += kyleCorpo({ x: 360, y: 1720, esc: 0.75, t: lt, visual: NICO, expr: 'panico', suor: true, p: correrP(lt) });
    s += `<g opacity="0.85">${lobisomem(-60 + Math.sin(lt * 3) * 40, 1760, 0.7, lt, { rugindo: true })}</g>`;
    return tremor(s, lt, 0, 6, c.dur);
  },
});

// ---------- 21 — asma ----------
E.push(close('Dudu! Eu não consigo... respirar...', NICO, { voz: V_NICO, expr: 'panico', suor: true, fundo: (lt) => floresta(lt, { cam: 1400, neblina: 1 }), tremer: 0.2 }));

// ---------- 22 — a queda e o ataque ----------
E.push({
  fala: 'Ele tropeçou numa raiz. Caiu. E a criatura *pulou em cima dele*.',
  desenhar(lt, c) {
    const tq = c.w('caiu'), tp = c.w('pulou');
    let s = floresta(lt, { cam: 1500, neblina: 0.9 });
    s += kyleCorpo({ x: 540, y: 1760, esc: 0.8, t: lt, visual: NICO, expr: 'panico', pose: lt > tq ? 'cabeca' : 'base', suor: true, p: lt > tq ? { agach: 220 } : correrP(lt) });
    if (lt > tp) { const k = suave((lt - tp) / 0.5); s += lobisomem(mix(-200, 540, k), mix(1700, 1500, k), mix(0.8, 1.4, k), lt, { rugindo: true, garras: true }); }
    s += flashBranco(lt, tp + 0.5, 0.5);
    som('carimbo', tq, 0.9); som('carimbo', tp + 0.4, 1.2);
    return tremor(s, lt, tp, 22, 1);
  },
});

// ---------- 23 — escuro ----------
E.push({
  fala: 'Uma dor no braço. Um clarão. E *tudo ficou escuro*.',
  desenhar(lt, c) {
    const ap = lim((lt - c.w('escuro')) / 0.6);
    let s = `<rect width="1080" height="1920" fill="#000"/>`;
    s += `<g opacity="${1 - ap}"><circle cx="540" cy="900" r="${300 + Math.sin(lt * 20) * 20}" fill="#C33A3A" opacity="0.4" filter="url(#brilhoLobo2)"/></g>`;
    s += impacto('...', lt, 0.2, { y: 980, tam: 220 });
    return s + `<defs><filter id="brilhoLobo2" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="40"/></filter></defs>`;
  },
});

// ---------- 24 — acorda ----------
E.push({
  fala: 'Ele acordou no próprio quarto. De manhã. Sem lembrar *como voltou pra casa*.',
  desenhar(lt, c) {
    let s = quartoNico(lt) + `<rect width="1080" height="1920" fill="#FFD9A0" opacity="0.18"/>`;
    s += kyleClose({ x: 540, y: 1020, esc: 1.5, expr: lt < 1 ? 'sono' : 'surpreso', t: lt, visual: NICO });
    s += relogioH('07:12', lt);
    return s;
  },
});

// ---------- 25 — a marca ----------
E.push({
  fala: 'No braço, uma marca de mordida. Que *já tinha quase cicatrizado*. Em uma noite.',
  desenhar(lt, c) {
    let s = fundoTela();
    s += `<g transform="translate(540 980) rotate(-12)"><rect x="-500" y="-160" width="1000" height="320" rx="160" fill="${NICO.pele}" stroke="#1F1A24" stroke-width="10"/>`;
    const k = lim((lt - c.w('cicatrizado')) / 1.2);
    for (let i = 0; i < 7; i++) { const a = Math.PI + i * (Math.PI / 6); s += `<ellipse cx="${Math.cos(a) * 120}" cy="${Math.sin(a) * 70 + 10}" rx="${14 - k * 8}" ry="${10 - k * 6}" fill="#B23A3A" opacity="${1 - k * 0.6}"/>`; }
    for (let i = 0; i < 7; i++) { const a = i * (Math.PI / 6); s += `<ellipse cx="${Math.cos(a) * 120}" cy="${Math.sin(a) * 70 - 10}" rx="${14 - k * 8}" ry="${10 - k * 6}" fill="#B23A3A" opacity="${1 - k * 0.6}"/>`; }
    s += `</g>`;
    s += aviso(lt, c, 'cicatrizado', 'CICATRIZOU EM 1 NOITE', '#C33A3A', 420);
    return s;
  },
});

// ---------- 26 — o que o Dudu viu ----------
E.push({
  fala: 'O Dudu jurou que correu pra chamar o pai. Quando voltaram com a lanterna... o Nico *tinha sumido*.',
  desenhar(lt, c) {
    const msgs = [{ de: 'ela', txt: 'VC TÁ VIVO???' }];
    if (lt > c.w('jurou')) msgs.push({ de: 'ela', txt: 'eu corri e chamei meu pai' });
    if (lt > c.w('sumido') - 0.3) msgs.push({ de: 'ela', txt: 'quando voltamos vc tinha SUMIDO' });
    if (lt > c.w('sumido') + 0.8) msgs.push({ de: 'eu', txt: 'eu acordei em casa...' });
    return fundoTela() + celularUI({ tela: 'chat', nome: 'Dudu 🤓', hora: '07:15', msgs });
  },
});

// ---------- 27 — escola barulhenta ----------
E.push({
  fala: 'Segunda-feira. Na escola, tudo estava *alto demais*.',
  desenhar(lt, c) {
    let s = corredor(lt);
    for (let i = 0; i < 4; i++) s += alunoChibi(70 + i, { x: 150 + i * 260, y: 1660, esc: 0.42, expr: 'feliz', t: lt, fala: true });
    s += kyleCorpo({ x: 540, y: 1840, esc: 0.85, t: lt, visual: NICO, pose: 'cabeca', expr: 'panico', p: { agach: 20 } });
    for (let i = 0; i < 4; i++) { const r = ((lt * 0.9 + i / 4) % 1) * 500; s += `<circle cx="540" cy="900" r="${r}" fill="none" stroke="#D8E8FF" stroke-width="8" opacity="${1 - r / 500}"/>`; }
    return s;
  },
});

// ---------- 28 — audição ----------
E.push(close('Ele escutava a conversa da sala ao lado. O relógio do corredor. O *coração do professor* batendo rápido.', NICO, {
  expr: 'surpreso', fundo: (lt) => `<defs><filter id="dsf3"><feGaussianBlur stdDeviation="12"/></filter></defs><g filter="url(#dsf3)">${corredor(lt)}</g>`,
  extra: (lt, c) => {
    const t0 = c.w('coração');
    if (lt < t0) return '';
    const b = 1 + 0.12 * Math.max(0, Math.sin(lt * 9));
    return `<g transform="translate(860 480) scale(${b})"><path d="M 0 40 C -90 -20 -60 -100 0 -60 C 60 -100 90 -20 0 40 Z" fill="#E8344B" stroke="#15131A" stroke-width="7"/></g>`;
  },
}));

// ---------- 29 — olfato ----------
E.push(close('E o cheiro. Ele sabia o que *cada pessoa tinha comido* no café da manhã.', NICO, {
  expr: 'sono', fundo: (lt) => `<defs><filter id="dsf4"><feGaussianBlur stdDeviation="12"/></filter></defs><g filter="url(#dsf4)">${corredor(lt)}</g>`,
  extra: (lt, c) => {
    let s = '';
    ['🥚', '🍞', '☕', '🍌'].forEach((e, i) => { const t0 = c.w('cada') + i * 0.3; if (lt > t0) s += pulo(`<text x="${200 + i * 230}" y="${500 + (i % 2) * 90}" text-anchor="middle" font-size="110">${e}</text>`, lt, 200 + i * 230, 470, t0); });
    for (let i = 0; i < 3; i++) s += `<path d="M ${300 + i * 200} ${780 - ((lt * 60 + i * 40) % 120)} q 30 -30 0 -60 q -30 -30 0 -60" fill="none" stroke="#D8E8FF" stroke-width="7" stroke-linecap="round" opacity="0.6"/>`;
    return s;
  },
}));

// ---------- 30 — treino ----------
E.push({
  fala: 'No treino da tarde, o técnico colocou o reserva no gol. Só pra *completar o time*.',
  desenhar(lt, c) {
    let s = patio(lt, { cantina: false, tarde: 0.6 });
    s += `<rect x="190" y="1180" width="700" height="430" fill="none" stroke="#FFFFFF" stroke-width="22"/>`;
    for (let i = 0; i < 8; i++) s += `<line x1="${200 + i * 90}" y1="1190" x2="${200 + i * 90}" y2="1600" stroke="#fff" stroke-width="3" opacity="0.5"/>`;
    s += kyleCorpo({ x: 540, y: 1720, esc: 0.75, t: lt, visual: NICO, pose: 'cintura', expr: 'neutro' });
    return s;
  },
});

// ---------- 31 — as defesas ----------
E.push({
  fala: 'Ele defendeu tudo. Doze chutes. Sem bombinha. *Sem cansar*.',
  desenhar(lt, c) {
    const fase = Math.floor(lt * 1.6) % 4;
    const lado = [1, -1, 1, -1][fase];
    const k = (lt * 1.6) % 1;
    let s = patio(lt, { cantina: false, tarde: 0.6 });
    s += `<rect x="190" y="1180" width="700" height="430" fill="none" stroke="#FFFFFF" stroke-width="22"/>`;
    s += kyleCorpo({ x: 540 + lado * 160 * Math.sin(k * Math.PI), y: 1720 - 160 * Math.sin(k * Math.PI), esc: 0.75, t: lt, visual: NICO, pose: 'comemora', expr: 'determinado' });
    s += `<circle cx="${540 + lado * (380 - k * 200)}" cy="${1300 + k * 80}" r="34" fill="#fff" stroke="#15131A" stroke-width="6"/>`;
    s += aviso(lt, c, 'doze', '🧤 12 DEFESAS', '#1E9E4A', 420);
    return s;
  },
});

// ---------- 32 — Dudu ----------
E.push(close('Nico. Você nunca pegou nem pênalti da sua avó.', DUDU, { voz: V_DUDU, expr: 'surpreso', fundo: (lt) => patio(lt, { cantina: false, tarde: 0.6 }) }));

// ---------- 33 — os olhos brilham ----------
E.push(close('E quando o atacante gritou na cara dele... os olhos do Nico brilharam. Por um segundo. *Prateados*.', NICO, {
  expr: 'determinado', fundo: (lt) => patio(lt, { cantina: false, tarde: 0.6 }),
  lobo: (lt, c) => { const t0 = c.w('brilharam'); return lt > t0 && lt < t0 + 1.4 ? 0.4 : 0; },
  extra: (lt, c) => flashBranco(lt, c.w('brilharam'), 0.25, '#D8E8FF'),
  tremer: 'brilharam',
}));

// ---------- 34 — o professor viu ----------
E.push({
  fala: 'Alguém viu. O professor novo de história. Que chegou na cidade *naquela mesma semana*.',
  desenhar(lt, c) {
    let s = corredor(lt) + `<rect width="1080" height="1920" fill="#E8833A" opacity="0.1"/>`;
    s += kyleCorpo({ x: 820, y: 1760, esc: 0.9, t: lt, visual: PROF, pose: 'cintura', expr: 'determinado', olhar: [-1, 0] });
    s += `<rect x="40" y="520" width="380" height="460" fill="#BFE3F5" opacity="0.5" stroke="#15131A" stroke-width="8"/>`;
    s += `<g transform="translate(230 820) scale(0.5)">${kyleCorpo({ x: 0, y: 300, esc: 0.6, t: lt, visual: NICO, pose: 'comemora', expr: 'determinado' })}</g>`;
    return camLenta(s, lt, c.dur, { z0: 1.0, z1: 1.1, cx: 800, cy: 1200 });
  },
});
E.push(close('Interessante.', PROF, { voz: V_PROF, expr: 'determinado', dur: 2.4, fundo: (lt) => `<defs><filter id="dsf5"><feGaussianBlur stdDeviation="12"/></filter></defs><g filter="url(#dsf5)">${corredor(lt)}</g>` }));

// ---------- 36 — os livros ----------
E.push({
  fala: 'Naquela noite, o Dudu apareceu com três livros da biblioteca e um calendário. Com um dia marcado em vermelho: *a lua cheia*.',
  desenhar(lt, c) {
    let s = quartoNico(lt, { luz: 0.85 });
    s += kyleCorpo({ x: 300, y: 1740, esc: 0.8, t: lt, visual: DUDU, pose: 'aponta', expr: 'determinado' });
    s += kyleCorpo({ x: 790, y: 1740, esc: 0.8, t: lt, visual: NICO, pose: 'base', expr: 'neutro' });
    ['#7A3A2A', '#2A4A7A', '#4A6A2A'].forEach((cor, i) => (s += `<rect x="${80 + i * 20}" y="${1620 - i * 40}" width="200" height="40" rx="6" fill="${cor}" stroke="#15131A" stroke-width="5"/>`));
    if (lt > c.w('calendário')) s += pulo(calendarioLua(540, 680, 1.1), lt, 540, 680, c.w('calendário'));
    return s;
  },
});

// ---------- 37 e 38 — diálogo ----------
E.push(close('Audição, olfato, força, cura rápida e olho brilhando. Nico... ou você virou super-herói... ou virou lobisomem.', DUDU, { voz: V_DUDU, expr: 'determinado', fundo: quartoNicoBlur }));
E.push(close('Para, Dudu. Lobisomem não existe.', NICO, { voz: V_NICO, expr: 'sem_graca', fundo: quartoNicoBlur }));

// ---------- 39 — as unhas ----------
E.push({
  fala: 'Aí ele olhou pras próprias mãos. E as unhas... *estavam crescendo*.',
  desenhar(lt, c) {
    const k = lim((lt - c.w('crescendo') + 0.5) / 1.5);
    let s = fundoTela();
    s += `<g transform="translate(540 1050)"><path d="M -260 400 L -240 -60 Q -240 -140 -160 -150 L 160 -150 Q 240 -140 240 -60 L 260 400 Z" fill="${NICO.pele}" stroke="#1F1A24" stroke-width="10"/>`;
    for (let i = 0; i < 4; i++) {
      const x = -180 + i * 120;
      s += `<path d="M ${x - 45} -140 L ${x - 45} -420 Q ${x} -480 ${x + 45} -420 L ${x + 45} -140 Z" fill="${NICO.pele}" stroke="#1F1A24" stroke-width="9"/>`;
      s += `<path d="M ${x - 30} -420 Q ${x} ${-470 - k * 110} ${x + 30} -420 Q ${x} -440 ${x - 30} -420 Z" fill="${k > 0.3 ? '#3A3440' : '#F6D5C2'}" stroke="#1F1A24" stroke-width="5"/>`;
    }
    s += `</g>`;
    som('saida', c.w('crescendo'), 0.8);
    return tremor(s, lt, c.w('crescendo'), 8, 1.2);
  },
});

// ---------- 40 — começa ----------
E.push(close('Faltam três dias pra lua cheia. E ele não faz ideia do que vai acontecer quando ela chegar.', NICO, {
  expr: 'panico', suor: true, fundo: (lt) => floresta(lt, { neblina: 1 }),
  lobo: (lt, c) => lim(lt / c.dur) * 0.9,
  tremer: 0.5,
}));

// ---------- 41 — votação ----------
E.push({
  fala: 'O que o Nico faz? A: conta tudo pro professor novo. B: se tranca no porão na sexta, com o Dudu vigiando a porta.',
  legendaY: 975,
  desenhar(lt, c) {
    let s = `<svg x="0" y="0" width="1080" height="950" overflow="hidden">${corredor(lt)}${kyleCorpo({ x: 330, y: 930, esc: 0.62, t: lt, visual: NICO, pose: 'aponta', expr: 'determinado' })}${kyleCorpo({ x: 760, y: 930, esc: 0.62, t: lt, visual: PROF, pose: 'cintura', expr: 'determinado', vira: -1 })}</svg>`;
    s += `<svg x="0" y="970" width="1080" height="950" overflow="hidden"><rect width="1080" height="950" fill="#1A1410"/><rect x="0" y="600" width="1080" height="350" fill="#2A2018"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${120 + i * 200}" y="100" width="22" height="600" fill="#555"/>`).join('')}${kyleCorpo({ x: 540, y: 900, esc: 0.62, t: lt, visual: NICO, pose: 'cabeca', expr: 'panico', lobo: 0.5 })}</svg>`;
    s += `<rect y="945" width="1080" height="30" fill="#000"/>`;
    s += pulo(`<circle cx="120" cy="130" r="72" fill="#2E3F9E" stroke="#fff" stroke-width="10"/><text x="120" y="160" text-anchor="middle" font-family="Anton, sans-serif" font-size="90" fill="#fff">A</text>` + textoImpacto('CONTA PRO PROFESSOR', 1, 0, { x: 600, y: 160, tam: 70, rot: -3 }), lt, 540, 130, c.w('a:') - 0.1);
    s += pulo(`<circle cx="120" cy="1100" r="72" fill="#D7262B" stroke="#fff" stroke-width="10"/><text x="120" y="1130" text-anchor="middle" font-family="Anton, sans-serif" font-size="90" fill="#fff">B</text>` + textoImpacto('SE TRANCA NO PORÃO', 1, 0, { x: 600, y: 1130, tam: 70, rot: -3 }), lt, 540, 1100, c.w('b:') - 0.1);
    return s;
  },
});

// ---------- 42 — final ----------
E.push({
  fala: 'Comenta *A* ou *B*. A mais votada vira o episódio dois de Marca da Lua.',
  semLegenda: true,
  desenhar(lt, c) {
    let s = floresta(lt, { neblina: 1.2 }) + `<rect width="1080" height="1920" fill="#000" opacity="0.4"/>`;
    s += textoImpacto('MARCA DA LUA', lt, 0.1, { y: 760, tam: 170, cor: '#D8E8FF', rot: 0 });
    s += textoImpacto('EPISÓDIO 2', lt, 0.5, { y: 940, tam: 120, rot: 0 });
    s += textoImpacto('COMENTA A OU B 👇', lt, 0.9, { y: 1110, tam: 76, rot: 0, cor: '#F7C531' });
    return s;
  },
});

window.CAPA = () => {
  let s = floresta(0.4, { neblina: 1.2 });
  s += `<g opacity="0.9">${lobisomem(820, 1500, 0.85, 0.4, { rugindo: true })}</g>`;
  s += kyleClose({ x: 420, y: 1250, esc: 1.25, expr: 'panico', suor: true, t: 0.4, visual: NICO, lobo: 0.7 });
  s += `<text x="540" y="260" text-anchor="middle" font-family="Anton, sans-serif" font-size="180" fill="#fff" stroke="#000" stroke-width="16" paint-order="stroke">MARCA DA LUA</text>`;
  s += `<text x="540" y="380" text-anchor="middle" font-family="Anton, sans-serif" font-size="80" fill="#D8E8FF" stroke="#000" stroke-width="10" paint-order="stroke">EPISÓDIO 1 · A MORDIDA</text>`;
  return s;
};

criarEpisodio(E, { voz: 'en-US-AndrewMultilingualNeural', velocidade: '+6%' });
