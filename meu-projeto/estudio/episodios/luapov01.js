// LUA DE SANGUE — PARTE 1 (formato POV do vídeo de referência: primeira pessoa, sem narrador,
// chats no celular, "PARTE 1" + relógio, cortes rápidos e votação "COMENTA UMA PALAVRA").
// O Lucas corta caminho pela trilha em noite de lua cheia. O "Ryan" aparece na trilha...
// mas o Ryan de verdade manda mensagem dizendo que já está em casa. Um número desconhecido (Isabella)
// avisa: não segue ele. E tem outra coisa atrás do Lucas. SEGUIR ou CORRER?

window.LEGENDA_FRASE = true;
window.LEGENDA_Y = 1470;
window.FONTE_LEGENDA = 'Baloo, sans-serif';
window.TRATAR_VOZ = 'seco';
window.TRILHA = 'terror';

const EU = (velocidade = '+8%', tom = '+0Hz') => ({ voz: 'en-US-AndrewMultilingualNeural', velocidade, tom });
const V_RYAN = { voz: 'en-US-BrianMultilingualNeural', velocidade: '+12%', tom: '+0Hz' };
const V_FALSO = { voz: 'en-US-BrianMultilingualNeural', velocidade: '-10%', tom: '-12Hz' };
const AMARELO = '#FFD36A', VERMELHO = '#FF5A6A';
const RYAN = { pele: '#F2C8A0', pele2: '#D8A880', cabelo: '#E8B84A', camisa: '#1E2A5A' };
const FALSO = { ...RYAN, naoPisca: true };
const E = [];
const cena = (o) => E.push(o);

// ---------- peças ----------
// Trilha em primeira pessoa: floresta com balanço do passo, lanterna do celular e a mão segurando o celular.
function trilha(lt, { anda = true, cam, luz = true, ang = -96, extra = '', frente = '', escuro = 0, mao = true } = {}) {
  const by = anda ? Math.sin(lt * 7) * 12 : 0;
  let s = `<g transform="translate(0 ${by})">` + floresta(lt, { cam: cam ?? (anda ? lt * 90 : 0), neblina: 0.9 }) + extra + `</g>`;
  if (luz) s += lanterna(640, 1640, ang + Math.sin(lt * 1.6) * 3, 1350, 15);
  s += frente;
  if (escuro) s += `<rect width="1080" height="1920" fill="#000" opacity="${escuro}"/>`;
  if (mao) s += celularNaMao(760, 1600 + by * 0.5, luz);
  return s;
}
function celularNaMao(x, y, luz) {
  return maoPOV(x, y + 60, -8, 1.05, 1) +
    `<g transform="translate(${x - 10} ${y - 30}) rotate(-8)"><rect x="-70" y="-130" width="140" height="250" rx="22" fill="#1A1C22" stroke="#0E0D14" stroke-width="8"/>` +
    `<circle cx="-36" cy="-96" r="14" fill="#2A2E38"/>${luz ? `<circle cx="-4" cy="-96" r="11" fill="#FFF6D0"/><circle cx="-4" cy="-96" r="26" fill="#FFF6D0" opacity="0.35"/>` : ''}</g>`;
}
// Olhos brilhando no escuro.
function olhosEscuro(x, y, lt, { cor = '#FFB020', tam = 1, abre = 1 } = {}) {
  const h = 14 * tam * Math.max(0.05, abre);
  return [-1, 1].map((l) => `<ellipse cx="${x + l * 34 * tam}" cy="${y}" rx="${26 * tam}" ry="${h * 2.4}" fill="${cor}" opacity="0.35"/><ellipse cx="${x + l * 34 * tam}" cy="${y}" rx="${12 * tam}" ry="${h}" fill="${cor}"/><ellipse cx="${x + l * 34 * tam}" cy="${y}" rx="${4 * tam}" ry="${h * 0.8}" fill="#2A1200"/>`).join('');
}
const desfocado = (svg) => `<defs><filter id="dsfL"><feGaussianBlur stdDeviation="12"/></filter></defs><g filter="url(#dsfL)">${svg}</g><rect width="1080" height="1920" fill="#000" opacity="0.4"/>`;
const chat = (lt, o, fundo) => celularChat(lt, { ...o, fundo: desfocado(fundo) });
const tremer2 = (s, lt, k = 8) => `<g transform="translate(${Math.sin(lt * 53) * k} ${Math.cos(lt * 47) * k})">${s}</g>`;
// Ryan ao lado (andando junto, cortado embaixo) e o "Ryan" na trilha (de corpo inteiro, lá na frente).
const ryanLado = (lt, o = {}) => andando(RYAN, lt, 250, 2060, 1.15, { expr: 'neutro', olhar: [8, 0], ...o });
const falsoTrilha = (lt, o = {}) => andando(FALSO, lt, o.x || 600, o.y || 1420, o.esc || 0.5, { parado: true, expr: 'sorrisao', olhar: [0, 0], ...o });
// Votação no fim (igual à referência).
function votacao(lt, fundo) {
  let s = desfocado(fundo) + `<rect width="1080" height="1920" fill="#0B0E18" opacity="0.55"/>`;
  s += `<text x="540" y="600" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="110" fill="#fff">O QUE VOCÊ</text>`;
  s += `<text x="540" y="720" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="110" fill="#fff">FARIA?</text>`;
  s += `<text x="540" y="830" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="54" fill="#F7C531">COMENTA UMA PALAVRA 👇</text>`;
  const botao = (y, cor, icone, txt, sub, t0) => pulo(`<rect x="150" y="${y}" width="780" height="170" rx="26" fill="${cor}" stroke="#fff" stroke-width="6"/>` +
    `<text x="220" y="${y + 92}" font-family="Baloo, sans-serif" font-weight="800" font-size="70">${icone}</text>` +
    `<text x="320" y="${y + 92}" font-family="Baloo, sans-serif" font-weight="800" font-size="86" fill="#fff">${txt}</text>` +
    `<text x="322" y="${y + 142}" font-family="Baloo, sans-serif" font-weight="700" font-size="36" fill="#fff" opacity="0.9">${sub}</text>`, lt, 540, y + 85, t0);
  s += botao(920, '#D7262B', '🌲', 'SEGUIR', 'o Ryan pela mata', 0.3);
  s += botao(1130, '#2F6DE0', '🏃', 'CORRER', 'pra rua, sem olhar pra trás', 0.6);
  const k = 1 - lim(lt / 6);
  s += `<rect x="150" y="1350" width="780" height="22" rx="11" fill="#2A2F3E"/><rect x="150" y="1350" width="${780 * k}" height="22" rx="11" fill="${k > 0.3 ? '#F7C531' : '#FF3040'}"/>`;
  s += `<text x="540" y="1450" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="46" fill="#fff">A mais votada decide a PARTE 2</text>`;
  return s;
}
const HD = (h) => hudPOV(1, h);

// ================= 1 · A REGRA =================
cena({
  fala: 'Minha mãe tem uma regra: nunca cortar caminho pela trilha em noite de lua cheia.',
  voz: EU('+6%'), capa: 0.5,
  desenhar: (lt) => trilha(lt, { luz: false, mao: false, extra: ryanLado(lt) }) + HD('20:47'),
});
cena({
  fala: 'Mano, vai pela rua. Lua cheia hoje. Dizem que tem bicho nessa mata.',
  voz: V_RYAN, rotulo: 'RYAN', corLegenda: AMARELO,
  desenhar: (lt, c) => trilha(lt, { luz: false, mao: false, extra: ryanLado(lt, { fala: true, olhar: [14, 0] }) }) + HD('20:48'),
});
cena({
  fala: 'São cinco minutos pela trilha, Ryan. Relaxa.',
  voz: EU('+10%'),
  desenhar: (lt) => trilha(lt, { luz: false, mao: false, extra: ryanLado(lt, { expr: 'triste', olhar: [14, 0] }) }) + HD('20:48'),
});
cena({
  fala: 'Então me avisa quando chegar. Sério.',
  voz: V_RYAN, rotulo: 'RYAN', corLegenda: AMARELO,
  desenhar: (lt) => trilha(lt, { anda: false, luz: false, mao: false, extra: andando(RYAN, lt, 330, 1700, 0.75, { parado: true, pose: 'aponta', fala: true, expr: 'triste', olhar: [10, 0] }) }) + HD('20:49'),
});
// mãe no chat
cena({
  dur: 3.2,
  desenhar(lt) {
    som('bolha', 0.3, 0.8); som('bolha', 1.9, 0.6);
    const m = [{ txt: 'Filho, já tá vindo? 🙏' }, ...(lt > 0.3 ? [{ txt: 'NÃO vem pela floresta hein' }] : []), ...(lt > 1.9 ? [{ eu: true, txt: 'tô indo pela rua mãe 😅' }] : [])];
    return chat(lt, { titulo: 'Mãe ❤️', msgs: m }, trilha(lt)) + HD('20:50');
  },
});

// ================= 2 · A TRILHA =================
cena({
  fala: 'Tá. Cinco minutos. É só uma floresta.',
  voz: EU('+2%', '-2Hz'),
  desenhar: (lt) => { som('grilos', 0, 0.5); return trilha(lt) + HD('20:51'); },
});
cena({
  dur: 3.8,
  desenhar(lt) {
    [0.2, 1.3, 2.4].forEach((t) => som('bolha', t, 0.7));
    const todas = [{ nome: 'Caio', cor: '#7FC3F0', txt: 'alguém ouviu esse uivo??' }, { nome: 'Bia', cor: '#F2A0C8', txt: 'perto da trilha velha 😨' }, { nome: 'Sophie', cor: '#C9A0FF', txt: 'ninguém entra na floresta hoje.' }];
    return chat(lt, { titulo: '3º ANO · SILVERMOON', sub: 'Caio, Bia, Sophie e mais 31', msgs: todas.slice(0, 1 + (lt > 1.3) + (lt > 2.4)) }, trilha(lt)) + HD('20:52');
  },
});
cena({
  fala: 'Quem tá aí?',
  voz: EU('+4%', '+4Hz'), dur: 2.6,
  desenhar: (lt) => { som('galho', 0.05, 1); som('folhas', 0.9, 0.8); return trilha(lt, { anda: false, ang: -96 + Math.sin(lt * 2.5) * 22 }) + HD('20:53'); },
});

// ================= 3 · O "RYAN" =================
cena({
  fala: 'Lucas! Espera aí, vou com você!',
  voz: V_RYAN, rotulo: 'RYAN?', corLegenda: AMARELO,
  desenhar: (lt) => trilha(lt, { anda: false, extra: falsoTrilha(lt, { pose: 'comemora', fala: true }) }) + HD('20:53'),
});
cena({
  fala: 'Ryan? Você não tinha ido pra casa?',
  voz: EU('+8%'),
  desenhar: (lt) => trilha(lt, { anda: false, extra: falsoTrilha(lt, { expr: 'sorrisao' }) }) + HD('20:53'),
});
cena({
  fala: 'Mudei de ideia. Vem, é mais rápido por aqui.',
  voz: V_RYAN, rotulo: 'RYAN?', corLegenda: AMARELO,
  desenhar: (lt) => trilha(lt, { anda: false, extra: falsoTrilha(lt, { pose: 'aponta', fala: true, olhar: [-10, 0] }) }) + HD('20:54'),
});
// o Ryan de verdade
cena({
  dur: 3.4,
  desenhar(lt) {
    som('bolha', 0.4, 1); som('bolha', 1.6, 0.8);
    const m = [{ eu: true, txt: 'blz, chego em 5 min' }, ...(lt > 0.4 ? [{ txt: 'cheguei em casa mano 🏠' }] : []), ...(lt > 1.6 ? [{ txt: 'minha mãe brigou kkkk me avisa qnd chegar' }] : [])];
    return chat(lt, { titulo: 'Ryan 🎮', msgs: m }, trilha(lt, { anda: false, extra: falsoTrilha(lt) })) + HD('20:54');
  },
});
cena({
  fala: 'Se o Ryan tá em casa... quem é esse?',
  voz: EU('-8%', '-6Hz'),
  desenhar: (lt) => { som('coracao', 0, 0.8); return trilha(lt, { anda: false, extra: falsoTrilha(lt, { y: 1440, esc: 0.54 }) }) + vinheta(0.6) + HD('20:54'); },
});
// número desconhecido
cena({
  dur: 4.6,
  desenhar(lt) {
    [0.2, 1.2, 2.4, 3.4].forEach((t) => som('bolha', t, 0.9));
    const todas = [{ txt: 'Lucas. Não segue ele.' }, { txt: 'Não olha nos olhos dele.' }, { eu: true, txt: 'quem é vc??' }, { txt: 'Isabella. Da biologia.' }];
    const n = 1 + (lt > 1.2) + (lt > 2.4) + (lt > 3.4);
    return chat(lt, { titulo: '+55 número desconhecido', sub: 'digitando...', msgs: todas.slice(0, n) }, trilha(lt, { anda: false, extra: falsoTrilha(lt) })) + HD('20:55');
  },
});

// ================= 4 · A PERGUNTA =================
cena({
  fala: 'Por que você parou, Lucas? Com quem você tá falando?',
  voz: V_FALSO, rotulo: 'RYAN?', corLegenda: VERMELHO,
  desenhar: (lt) => trilha(lt, { anda: false, extra: falsoTrilha(lt, { y: 1500, esc: 0.62, fala: true, expr: 'sorrisao', lobo: 0.4 }) }) + vinheta(0.6) + HD('20:55'),
});
cena({
  fala: 'Ryan... qual o nome do seu cachorro?',
  voz: EU('-4%', '-4Hz'),
  desenhar: (lt) => trilha(lt, { anda: false, extra: falsoTrilha(lt, { y: 1500, esc: 0.62, expr: 'neutro', lobo: 0.4 }) }) + vinheta(0.6) + HD('20:55'),
});
cena({
  fala: '...Vem comigo, Lucas.',
  voz: V_FALSO, rotulo: 'RYAN?', corLegenda: VERMELHO,
  desenhar: (lt) => { som('suspense', 0, 0.6); return trilha(lt, { anda: false, extra: falsoTrilha(lt, { y: 1600, esc: 0.75, fala: true, expr: 'sorrisao', lobo: 1 }) }) + vinheta(0.75) + pisca(lt, 0.3) + HD('20:56'); },
});
// tem outro atrás
cena({
  dur: 3,
  desenhar(lt) {
    som('rosnado', 0.2, 1);
    const fera = `<g opacity="0.85">${lobisomem(560, 1700, 0.9, lt, { olhos: '#FFB020' })}</g><rect width="1080" height="1920" fill="#02030A" opacity="0.72"/>` + olhosEscuro(560, 760, lt, { abre: lim((lt - 0.3) / 0.3), tam: 1.3 });
    return tremer2(trilha(lt, { anda: false, cam: 600, ang: -96 + Math.sin(lt * 9) * 6, extra: fera }), lt, lt > 0.3 ? 6 : 0) + vinheta(0.8) + HD('20:56');
  },
});
cena({
  dur: 3,
  desenhar(lt) {
    som('bolha', 0.2, 1); som('bolha', 1.2, 1);
    const m = [{ txt: 'Lucas. Não segue ele.' }, { txt: 'Isabella. Da biologia.' }, ...(lt > 0.2 ? [{ txt: 'Tem outro atrás de você.' }] : []), ...(lt > 1.2 ? [{ txt: 'CORRE PRA RUA. AGORA.' }] : [])];
    return chat(lt, { titulo: 'Isabella', sub: 'online', msgs: m }, trilha(lt, { anda: false, cam: 600 })) + HD('20:56');
  },
});
cena({
  fala: 'Corre pra mim, Lucas! Ele tá vindo!',
  voz: { ...V_FALSO, velocidade: '+6%' }, rotulo: 'RYAN?', corLegenda: VERMELHO,
  desenhar: (lt) => { som('rugido', 0.6, 0.8); return tremer2(trilha(lt, { anda: false, extra: falsoTrilha(lt, { y: 1640, esc: 0.8, pose: 'cabeca', fala: true, expr: 'sorrisao', lobo: 1 }) }) + vinheta(0.75), lt, 5) + HD('20:57'); },
});

// ================= votação =================
cena({
  dur: 6,
  desenhar(lt) { som('impacto', 0.1, 0.8); return votacao(lt, trilha(lt, { anda: false, extra: falsoTrilha(lt, { y: 1640, esc: 0.8, expr: 'sorrisao', lobo: 1 }) })); },
});

window.CAPA = () => {
  let s = trilha(1, { anda: false, extra: falsoTrilha(1, { y: 1600, esc: 0.75, expr: 'sorrisao', lobo: 1, pose: 'aponta' }) }) + vinheta(0.7) + hudPOV(1, '20:56');
  s += `<rect x="40" y="1380" width="1000" height="230" rx="20" fill="#000" opacity="0.6"/><text x="540" y="1480" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="74" fill="#fff" stroke="#0E0D14" stroke-width="10" paint-order="stroke">O RYAN TÁ EM CASA...</text>`;
  s += `<text x="540" y="1580" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="74" fill="${VERMELHO}" stroke="#0E0D14" stroke-width="10" paint-order="stroke">ENTÃO QUEM É ESSE?</text>`;
  return s;
};

criarEpisodio(E, EU());
