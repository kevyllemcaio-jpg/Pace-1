// PORTARIA 507 — Parte 1 (terror POV do porteiro da noite, no formato do vídeo de referência:
// primeira pessoa, sem narrador, interfone, grupo do condomínio, câmeras e votação no fim).
// A Dona Lurdes do 507 interfona: "minha neta vai chegar, abre só pra ela". A neta chega.
// Mas o 507 está vazio desde março. O interfone toca de novo: "essa não é minha neta".
// A câmera mostra alguém atrás da moça... e o elevador desce sozinho do 5º andar. ABRIR ou ESPERAR?

window.LEGENDA_FRASE = true;
window.LEGENDA_Y = 1000;
window.FONTE_LEGENDA = 'Baloo, sans-serif';
window.TRATAR_VOZ = 'seco';
window.TRILHA = 'terror';

const EU = (velocidade = '+8%', tom = '+0Hz') => ({ voz: 'pt-BR-AntonioNeural', velocidade, tom });
const V_LURDES = { voz: 'pt-BR-FranciscaNeural', velocidade: '-14%', tom: '-8Hz' };
const V_CLARA = { voz: 'pt-BR-ThalitaMultilingualNeural', velocidade: '+8%', tom: '+0Hz' };
const V_ENTREGA = { voz: 'en-US-BrianMultilingualNeural', velocidade: '+10%', tom: '+0Hz' };
const AZUL = '#7FC8FF', LARANJA = '#FFB04A';
const CLARA = { pele: '#E8B48C', pele2: '#C99470', cabelo: '#3A2418', camisa: '#C8504A', longo: true, cilios: true };
const ENTREGADOR = { pele: '#C68E62', pele2: '#A8714C', cabelo: '#2A1E18', camisa: '#D93A3A' };
const E = [];
const cena = (o) => E.push({ dur: 1.2, ...o });
const INTERFONE = { rotulo: 'INTERFONE · 507', corLegenda: AZUL };
const vis = (visual, lt, o = {}) => visitanteVidro(visual, lt, { esc: 0.5, y: 1060, ...o });
const clara = (lt, o = {}) => vis(CLARA, lt, { pose: 'base', expr: 'feliz', ...o });
const GRUPO = { titulo: 'Res. Ipês Amarelos', sub: 'Seu Jorge, Síndico, você e mais 47' };
const JORGE = { nome: 'Seu Jorge 201', cor: '#F28AB0' }, SIND = { nome: 'Síndico', cor: '#6BEA8E' };
const HD = (h) => hudPOV(1, h);
// Selo "507 CHAMANDO" sobre o interfone.
const chamando = (lt) => Math.sin(lt * 10) > -0.3 ? `<g transform="translate(860 1150) rotate(-6)"><rect x="-150" y="-40" width="300" height="72" rx="36" fill="#D7262B" stroke="#fff" stroke-width="5"/><text x="0" y="12" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="40" fill="#fff">507 CHAMANDO</text></g>` : '';
// Câmera do elevador: porta e mostrador do andar.
function camElevador(lt, andar, hora) {
  const fig = `<rect x="230" y="300" width="400" height="760" fill="#1C3A24" stroke="#0E2014" stroke-width="8"/><rect x="236" y="306" width="190" height="748" fill="#24502F"/><rect x="434" y="306" width="190" height="748" fill="#24502F"/>` +
    `<rect x="300" y="150" width="260" height="120" rx="10" fill="#0B1A10" stroke="#3A7A4A" stroke-width="5"/><text x="430" y="245" text-anchor="middle" font-family="Anton, sans-serif" font-size="96" fill="#FF4050">${andar}▼</text>` +
    `<rect x="680" y="600" width="40" height="90" rx="8" fill="#14301C"/><circle cx="700" cy="630" r="10" fill="#FF4050"/>`;
  return monitorCam(lt, { titulo: 'CAM 4 · ELEVADOR', hora, cena: 'elevador', figura: fig });
}
// Câmera da entrada (vista de cima, de fora): a moça na porta... e alguém atrás dela.
function camEntrada(lt, hora, atras) {
  const fig = `<rect x="230" y="250" width="400" height="520" fill="#1C3A24" stroke="#0E2014" stroke-width="8"/><rect x="250" y="470" width="360" height="40" fill="#0E2014"/>` +
    `<g transform="translate(430 980) scale(0.42)"><ellipse cx="0" cy="-640" rx="95" ry="105" fill="#2A5A36"/><path d="M -150 -540 L 150 -540 L 170 -150 L -170 -150 Z" fill="#3A7A4A"/><path d="M -170 -600 Q 0 -760 170 -600 L 200 -300 L -200 -300 Z" fill="#14301C"/><rect x="-140" y="-150" width="110" height="300" fill="#2A5A36"/><rect x="30" y="-150" width="110" height="300" fill="#2A5A36"/></g>` +
    (atras ? `<g transform="translate(${430 + 150} 1060) scale(0.62)" opacity="${atras}"><ellipse cx="0" cy="-820" rx="90" ry="110" fill="#081208"/><path d="M -130 -720 L 130 -720 L 160 -100 L -160 -100 Z" fill="#081208"/><rect x="-120" y="-100" width="90" height="300" fill="#081208"/><rect x="30" y="-100" width="90" height="300" fill="#081208"/><circle cx="-30" cy="-830" r="9" fill="#DFFFE6"/><circle cx="30" cy="-830" r="9" fill="#DFFFE6"/></g>` : '');
  return monitorCam(lt, { titulo: 'CAM 1 · ENTRADA', hora, cena: 'entrada', figura: fig });
}
// Votação no fim (como na referência).
function votacao(lt, fundo) {
  let s = `<defs><filter id="dsfV"><feGaussianBlur stdDeviation="14"/></filter></defs><g filter="url(#dsfV)">${fundo}</g><rect width="1080" height="1920" fill="#0B0E18" opacity="0.7"/>`;
  s += `<text x="540" y="600" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="112" fill="#fff">O QUE VOCÊ</text>`;
  s += `<text x="540" y="720" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="112" fill="#fff">FARIA?</text>`;
  s += `<text x="540" y="830" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="54" fill="#F7C531">COMENTA UMA PALAVRA 👇</text>`;
  const botao = (y, cor, icone, txt, sub, t0) => pulo(`<rect x="150" y="${y}" width="780" height="170" rx="26" fill="${cor}" stroke="#fff" stroke-width="6"/>` +
    `<text x="215" y="${y + 100}" font-family="Baloo, sans-serif" font-weight="800" font-size="68">${icone}</text>` +
    `<text x="320" y="${y + 92}" font-family="Baloo, sans-serif" font-weight="800" font-size="86" fill="#fff">${txt}</text>` +
    `<text x="322" y="${y + 142}" font-family="Baloo, sans-serif" font-weight="700" font-size="36" fill="#fff" opacity="0.9">${sub}</text>`, lt, 540, y + 85, t0);
  s += botao(920, '#D7262B', '🚪', 'ABRIR', 'pra moça entrar', 0.3);
  s += botao(1130, '#2F6DE0', '🛗', 'ESPERAR', 'o elevador chegar', 0.6);
  const k = 1 - lim(lt / 5.5);
  s += `<rect x="150" y="1350" width="780" height="22" rx="11" fill="#2A2F3E"/><rect x="150" y="1350" width="${780 * k}" height="22" rx="11" fill="${k > 0.3 ? '#F7C531' : '#FF3040'}"/>`;
  s += `<text x="540" y="1450" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="46" fill="#fff">A mais votada decide a PARTE 2</text>`;
  return s;
}

// ---------- 1 · o 507 liga ----------
cena({
  fala: 'Portaria, boa noite.', voz: EU('+6%'), capa: 0.6, dur: 1.8,
  desenhar: (lt) => { som('caixa', 0, 0.6); return guarita(lt, { apto: '507', toca: lt < 0.5, maoD: lt < 0.5 ? 'livre' : 'interfone' }) + (lt < 0.5 ? chamando(lt) : '') + HD('00:14'); },
});
cena({
  fala: 'Moço, minha neta vai chegar já já. Pode abrir pra ela, viu?', voz: V_LURDES, ...INTERFONE,
  desenhar: (lt) => guarita(lt, { apto: '507', maoD: 'interfone' }) + HD('00:14'),
});
cena({
  fala: 'Pode deixar, Dona Lurdes.', voz: EU('+10%'),
  desenhar: (lt) => guarita(lt, { apto: '507', maoD: 'interfone' }) + HD('00:14'),
});
cena({
  fala: 'Só pra ela. Pra mais ninguém.', voz: { ...V_LURDES, velocidade: '-20%' }, ...INTERFONE,
  desenhar: (lt) => guarita(lt, { apto: '507', maoD: 'interfone', luzRua: 0.8 }) + HD('00:14'),
});
// grupo do condomínio
cena({
  dur: 3.4,
  desenhar(lt) {
    som('bolha', 0.2, 0.8); som('bolha', 1.6, 0.8);
    const m = [{ ...JORGE, txt: 'alguém tá arrastando móvel no 5º andar a essa hora???' }, ...(lt > 1.6 ? [{ ...SIND, txt: 'Pessoal, respeitem o horário de silêncio.' }] : [])];
    return celularChat(lt, { ...GRUPO, msgs: m }) + HD('00:15');
  },
});
// mãe
cena({
  dur: 2.6,
  desenhar(lt) {
    som('bolha', 0.3, 0.8);
    return celularChat(lt, { titulo: 'Mãe ❤️', msgs: [{ txt: 'Filho, já jantou? Teu tio disse que aí de noite é tranquilo 🙏' }] }) + HD('00:15');
  },
});
// câmera do corredor
cena({
  fala: 'A luz do quinto andar tá piscando.', voz: EU('+2%'),
  desenhar: (lt) => monitorCam(lt, { titulo: 'CAM 3 · CORREDOR 5º ANDAR', hora: '00:15:31', cena: 'corredor', figura: Math.sin(lt * 23) > 0.2 ? '' : '<rect width="860" height="1180" fill="#000" opacity="0.6"/>' }) + HD('00:15'),
});
// entregador (normal)
cena({
  fala: 'Entrega pro 302! Deixo aqui?', voz: V_ENTREGA, rotulo: 'ENTREGADOR', corLegenda: LARANJA,
  desenhar: (lt) => guarita(lt, { visitante: vis(ENTREGADOR, lt, { pose: 'acena', expr: 'feliz', fala: true }) }) + HD('00:16'),
});
cena({
  fala: 'Pode deixar.', voz: EU('+10%'),
  desenhar: (lt) => guarita(lt, { visitante: vis(ENTREGADOR, lt, { pose: 'base', expr: 'feliz' }) }) + HD('00:16'),
});

// ---------- 2 · a neta ----------
cena({
  fala: 'Boa noite! Sou a neta da Dona Lurdes, do 507. Ela tá me esperando.', voz: V_CLARA, rotulo: 'MOÇA NA PORTA', corLegenda: LARANJA,
  desenhar: (lt) => guarita(lt, { visitante: clara(lt, { pose: 'acena', fala: true }) }) + HD('00:17'),
});
cena({
  fala: 'Ah, ela avisou sim. Só um minuto.', voz: EU('+10%'),
  desenhar: (lt) => guarita(lt, { visitante: clara(lt) }) + HD('00:17'),
});
cena({
  dur: 3.8,
  desenhar(lt) {
    som('bolha', 0.2, 0.9); som('bolha', 1.8, 0.9);
    const m = [{ ...SIND, txt: 'Pessoal, respeitem o horário de silêncio.' }, ...(lt > 0.2 ? [{ ...JORGE, txt: 'a Dona Lurdes do 507 não tinha se mudado?' }] : []), ...(lt > 1.8 ? [{ ...SIND, txt: 'Mudou em março. O 507 tá vazio.' }] : [])];
    return celularChat(lt, { ...GRUPO, msgs: m, fundo: `<defs><filter id="dsfP2"><feGaussianBlur stdDeviation="10"/></filter></defs><g filter="url(#dsfP2)">${guarita(lt, { visitante: clara(lt) })}</g><rect width="1080" height="1920" fill="#000" opacity="0.35"/>` }) + HD('00:17');
  },
});
cena({
  fala: 'Vazio...? Então quem me ligou do 507?', voz: EU('-6%', '-4Hz'),
  desenhar: (lt) => { som('coracao', 0, 0.6); return guarita(lt, { visitante: clara(lt, { expr: 'neutro' }) }) + vinheta(0.6) + HD('00:18'); },
});

// ---------- 3 · o 507 de novo ----------
cena({
  dur: 1.6,
  desenhar: (lt) => { som('caixa', 0, 0.7); return guarita(lt, { apto: '507', toca: true, visitante: clara(lt, { expr: 'neutro' }) }) + chamando(lt) + HD('00:18'); },
});
cena({
  fala: 'Ela chegou, né? Não abre. Essa não é minha neta.', voz: V_LURDES, ...INTERFONE,
  desenhar: (lt) => guarita(lt, { apto: '507', maoD: 'interfone', luzRua: 0.7, visitante: clara(lt, { expr: 'neutro' }) }) + pisca(lt, 0.3) + HD('00:18'),
});
cena({
  fala: 'Dona Lurdes... a senhora não tinha se mudado?', voz: EU('+4%'),
  desenhar: (lt) => guarita(lt, { apto: '507', maoD: 'interfone', luzRua: 0.7, visitante: clara(lt, { expr: 'neutro' }) }) + HD('00:18'),
});
cena({
  fala: 'Não abre pra ninguém, moço.', voz: { ...V_LURDES, velocidade: '-22%', tom: '-14Hz' }, ...INTERFONE,
  desenhar: (lt) => guarita(lt, { apto: '507', maoD: 'interfone', luzRua: 0.6, visitante: clara(lt, { expr: 'neutro' }) }) + pisca(lt, 0.4) + HD('00:19'),
});
cena({
  fala: 'Moço? Com quem você tá falando? Abre, tá frio aqui.', voz: V_CLARA, rotulo: 'MOÇA NA PORTA', corLegenda: LARANJA,
  desenhar: (lt) => guarita(lt, { luzRua: 0.7, visitante: clara(lt, { pose: 'aponta', expr: 'neutro', fala: true, y: 1100, esc: 0.56 }) }) + HD('00:19'),
});

// ---------- 4 · as câmeras ----------
cena({
  fala: 'A câmera da entrada... tem alguém atrás dela.', voz: EU('-8%', '-6Hz'),
  desenhar: (lt, c) => { som('suspense', 0.2, 0.5); return camEntrada(lt, '00:19:42', lim((lt - c.w('alguém')) / 0.4)) + HD('00:19'); },
});
cena({
  dur: 3,
  desenhar(lt) {
    som('bolha', 0.3, 1);
    const m = [{ txt: 'Filho, já jantou? Teu tio disse que aí de noite é tranquilo 🙏' }, { eu: true, txt: 'Tranquilo, mãe 😊' }, ...(lt > 0.3 ? [{ txt: 'Teu tio mandou avisar: se o 507 interfonar de madrugada, NÃO ATENDE.' }] : [])];
    return celularChat(lt, { titulo: 'Mãe ❤️', msgs: m }) + HD('00:20');
  },
});
cena({
  fala: '...Eu já atendi.', voz: EU('-12%', '-8Hz'),
  desenhar: (lt) => guarita(lt, { luzRua: 0.6, visitante: clara(lt, { expr: 'neutro', olhar: [0, 0] }) }) + vinheta(0.7) + HD('00:20'),
});
cena({
  fala: 'Tô descendo. Fica longe da porta.', voz: { ...V_LURDES, velocidade: '-18%', tom: '-12Hz' }, ...INTERFONE,
  desenhar: (lt, c) => camElevador(lt, lt < c.dur * 0.35 ? 5 : lt < c.dur * 0.7 ? 4 : 3, '00:20:15') + HD('00:20'),
});
cena({
  fala: 'Abre! Tem alguém atrás de mim! Abre essa porta!', voz: { ...V_CLARA, velocidade: '+16%', tom: '+4Hz' }, rotulo: 'MOÇA NA PORTA', corLegenda: LARANJA,
  desenhar(lt) {
    som('batida', 0.1, 1); som('batida', 1.2, 1);
    const tr = Math.sin(lt * 50) * 8;
    return `<g transform="translate(${tr} 0)">` + guarita(lt, { luzRua: 0.5, visitante: clara(lt, { pose: 'cabeca', expr: 'panico', fala: true, y: 1180, esc: 0.68 }) }) + `</g>` + pisca(lt, 0.3) + HD('00:20');
  },
});
cena({
  dur: 2.2,
  desenhar: (lt) => camElevador(lt, lt < 1 ? 2 : 1, '00:20:31') + HD('00:20'),
});

// ---------- votação ----------
cena({
  dur: 5.5,
  desenhar(lt) { som('impacto', 0.1, 0.8); return votacao(lt, guarita(lt, { luzRua: 0.5, visitante: clara(lt, { pose: 'cabeca', expr: 'panico', y: 1180, esc: 0.68 }) })); },
});

window.CAPA = () => {
  let s = guarita(0.5, { apto: '507', toca: true, luzRua: 0.6, visitante: clara(0.5, { pose: 'acena', y: 1100, esc: 0.56 }) }) + chamando(0.1) + HD('00:18');
  s += `<rect x="40" y="1380" width="1000" height="230" rx="20" fill="#000" opacity="0.6"/><text x="540" y="1480" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="74" fill="#fff" stroke="#0E0D14" stroke-width="10" paint-order="stroke">O 507 TÁ VAZIO...</text>`;
  s += `<text x="540" y="1580" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="74" fill="#FF5A6A" stroke="#0E0D14" stroke-width="10" paint-order="stroke">E ACABOU DE INTERFONAR</text>`;
  return s;
};

criarEpisodio(E, EU());
