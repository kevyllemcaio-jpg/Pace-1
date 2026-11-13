// PORTARIA 1203 — Parte 1 (terror POV do porteiro da noite, no formato do vídeo de referência)
// Primeiro turno. Regras do síndico. O 1203 está vazio há 3 anos e interfona. A câmera mostra alguém
// subindo a escada com a mesma jaqueta dele. O Biel (melhor amigo) aparece na porta... mas manda mensagem
// dizendo que está em casa. O QUE VOCÊ FARIA?

window.LEGENDA_FRASE = true;
window.LEGENDA_Y = 1470;
window.FONTE_LEGENDA = 'Baloo, sans-serif';
window.TRATAR_VOZ = true;
window.TRILHA = 'terror';
const EU = (velocidade = '+6%', tom = '+0Hz') => ({ voz: 'en-US-AndrewMultilingualNeural', velocidade, tom });
const V_1203 = { voz: 'pt-BR-FranciscaNeural', velocidade: '-18%', tom: '-14Hz' };
const V_ENTREGA = { voz: 'en-US-BrianMultilingualNeural', velocidade: '+10%', tom: '+0Hz' };
const V_BIEL = { voz: 'pt-BR-AntonioNeural', velocidade: '+14%', tom: '+6Hz' };
const V_BIEL_FALSO = { voz: 'pt-BR-AntonioNeural', velocidade: '-20%', tom: '-14Hz' };
const AZUL = '#7FC8FF', ROXO = '#C8A0FF', LARANJA = '#FFB04A';
const BIEL = { pele: '#8A5A3C', pele2: '#6E452C', cabelo: '#1E1612', camisa: '#F2C230' };
const BIEL_FALSO = { ...BIEL, naoPisca: true };
const ENTREGADOR = { pele: '#C68E62', pele2: '#A8714C', cabelo: '#2A1E18', camisa: '#D93A3A' };
const E = [];
const cena = (o) => E.push(o);
const vis = (visual, lt, o = {}) => visitanteVidro(visual, lt, { esc: 0.5, y: 1060, ...o });
const sacola = `<g transform="translate(700 860)"><path d="M -40 -40 L 40 -40 L 48 50 L -48 50 Z" fill="#F4F1E6" stroke="#15131A" stroke-width="5"/><path d="M -20 -40 Q -20 -70 0 -70 Q 20 -70 20 -40" fill="none" stroke="#15131A" stroke-width="5"/></g>`;

// 1 — gancho
cena({
  fala: 'O 1203 tá vazio há três anos. E acabou de interfonar.',
  voz: EU('+8%'), capa: 0.8,
  desenhar: (lt) => guarita(lt, { apto: '1203', toca: true }) + hudPOV(1, '00:12') + granulado(lt, 0.05),
});
// 2 — regras no grupo
cena({
  fala: 'Primeiro turno como porteiro. O síndico deixou as regras no grupo.',
  voz: EU('+4%'),
  desenhar(lt) {
    const msgs = [{ nome: 'Síndico', cor: '#6BEA8E', txt: '1) ninguém sobe sem ser anunciado' }, { nome: 'Síndico', cor: '#6BEA8E', txt: '2) o 1203 está vazio há 3 anos' }, { nome: 'Síndico', cor: '#6BEA8E', txt: '3) se o 1203 interfonar, NÃO ATENDA' }];
    const n = Math.min(3, Math.floor(lt / 0.8) + 1);
    for (let i = 0; i < n; i++) som('bolha', i * 0.8, 0.6);
    return celularChat(lt, { titulo: 'Cond. Monte Azul', sub: 'Síndico, você e mais 58', msgs: msgs.slice(0, n) }) + hudPOV(1, '00:12');
  },
});
// 3 — o Biel
cena({
  fala: 'E o Biel, meu melhor amigo, prometeu passar aqui com um lanche.',
  voz: EU('+8%'),
  desenhar(lt) {
    som('bolha', 0.4, 0.7);
    return celularChat(lt, { titulo: 'Biel 🍗', msgs: [{ txt: 'primeiro dia de porteiro kkkk' }, ...(lt > 0.4 ? [{ txt: 'chego aí 00:30 com coxinha 🍗' }] : []), ...(lt > 1.5 ? [{ eu: true, txt: 'fechou, te espero' }] : [])] }) + hudPOV(1, '00:14');
  },
});
// 4 — entregador (normal)
cena({
  fala: 'Entrega pro 702! Deixo aqui?',
  voz: V_ENTREGA, rotulo: 'ENTREGADOR', corLegenda: ROXO,
  desenhar: (lt) => guarita(lt, { visitante: vis(ENTREGADOR, lt, { pose: 'acena', expr: 'feliz', fala: true }) }) + hudPOV(1, '00:16'),
});
cena({
  fala: 'Pode deixar no balcão, valeu.',
  voz: EU('+10%'),
  desenhar: (lt) => guarita(lt, { visitante: vis(ENTREGADOR, lt, { pose: 'base', expr: 'feliz' }) }) + hudPOV(1, '00:16'),
});
// 5 — o 1203 de novo
cena({
  fala: 'Aí o 1203 tocou de novo. E eu... atendi.',
  voz: EU('-4%', '-4Hz'),
  desenhar: (lt, c) => guarita(lt, { apto: '1203', toca: lt < c.w('atendi'), maoD: lt > c.w('atendi') ? 'interfone' : 'livre' }) + hudPOV(1, '00:21') + granulado(lt, 0.05),
});
cena({
  fala: 'Moço... tem alguém subindo a escada. Não deixa ele chegar no décimo segundo andar.',
  voz: V_1203, rotulo: 'INTERFONE · 1203', corLegenda: AZUL,
  desenhar: (lt) => guarita(lt, { apto: '1203', maoD: 'interfone', luzRua: 0.6 }) + hudPOV(1, '00:21') + pisca(lt, 0.4) + granulado(lt, 0.06),
});
cena({
  fala: 'Quem tá falando? Esse apartamento tá vazio.',
  voz: EU('+12%', '+4Hz'),
  desenhar: (lt) => guarita(lt, { apto: '1203', maoD: 'interfone', luzRua: 0.6 }) + hudPOV(1, '00:22'),
});
// 6 — a câmera da escada
cena({
  fala: 'A câmera da escada mostrava alguém subindo. De costas. Com a mesma jaqueta que eu tô usando.',
  voz: EU('-6%', '-6Hz'),
  desenhar(lt, c) {
    const k = lim(lt / c.dur);
    const y = mix(1040, 560, k), e = mix(1.0, 0.6, k);
    const fig = `<g transform="translate(430 ${y}) scale(${e})"><ellipse cx="0" cy="-330" rx="70" ry="80" fill="#0E2014"/><path d="M -110 -260 L 110 -260 L 120 -20 L -120 -20 Z" fill="#2F4A7A"/><rect x="-100" y="-20" width="80" height="200" fill="#0E2014"/><rect x="20" y="-20" width="80" height="200" fill="#0E2014"/></g>`;
    return monitorCam(lt, { titulo: 'CAM 2 · ESCADA', hora: '00:23:41', cena: 'escada', figura: fig }) + hudPOV(1, '00:23');
  },
});
// 7 — o Biel chega
cena({
  fala: 'Abre aí, mano! Trouxe coxinha!',
  voz: V_BIEL, rotulo: 'BIEL', corLegenda: LARANJA,
  desenhar: (lt) => guarita(lt, { visitante: vis(BIEL, lt, { pose: 'acena', expr: 'sorrisao', fala: true }) + sacola }) + hudPOV(1, '00:30'),
});
// 8 — a mensagem
cena({
  fala: 'Aí o celular vibrou. Era o Biel.',
  voz: EU('-2%'),
  desenhar(lt) {
    som('bolha', 0.5, 0.9);
    return celularChat(lt, { titulo: 'Biel 🍗', msgs: [{ txt: 'chego aí 00:30 com coxinha 🍗' }, { eu: true, txt: 'fechou, te espero' }, ...(lt > 0.5 ? [{ txt: 'mano foi mal, não vou conseguir passar hoje 😩 tô em casa' }] : [])] }) + hudPOV(1, '00:30');
  },
});
// 9 — o falso Biel
cena({
  fala: 'Abre, mano. Tá frio aqui fora.',
  voz: V_BIEL_FALSO, rotulo: 'BIEL?', corLegenda: '#FF5A6A',
  desenhar(lt) {
    let s = guarita(lt, { luzRua: 0.5, visitante: vis(BIEL_FALSO, lt, { pose: 'aponta', expr: 'sorrisao', y: 1120, esc: 0.6, olhar: [0, 0] }) });
    return s + hudPOV(1, '00:31') + pisca(lt, 0.5) + granulado(lt, 0.07);
  },
});
// 10 — o que você faria?
cena({
  fala: 'O que você faria?',
  voz: EU('-12%', '-10Hz'), semLegenda: true, dur: 4,
  desenhar(lt) {
    let s = guarita(lt, { luzRua: 0.4, visitante: vis(BIEL_FALSO, lt, { pose: 'aponta', expr: 'sorrisao', y: 1140, esc: 0.62 }) }) + `<rect width="1080" height="1920" fill="#000" opacity="0.55"/>`;
    s += textoImpacto('O QUE VOCÊ', lt, 0.1, { y: 560, tam: 130, rot: 0 });
    s += textoImpacto('FARIA?', lt, 0.4, { y: 720, tam: 170, rot: 0, cor: '#FF5A6A' });
    s += textoImpacto('ABRE ou NÃO ABRE 👇', lt, 1.0, { y: 1500, tam: 70, rot: 0, cor: '#F7C531' });
    return s + granulado(lt, 0.06);
  },
});

window.CAPA = () => {
  let s = guarita(0.5, { apto: '1203', toca: true, luzRua: 0.5, visitante: vis(BIEL_FALSO, 0.5, { pose: 'aponta', expr: 'sorrisao', y: 1120, esc: 0.6 }) }) + hudPOV(1, '00:31');
  s += `<rect x="40" y="1380" width="1000" height="230" rx="20" fill="#000" opacity="0.6"/><text x="540" y="1480" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="76" fill="#fff" stroke="#0E0D14" stroke-width="10" paint-order="stroke">O 1203 TÁ VAZIO...</text>`;
  s += `<text x="540" y="1580" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="76" fill="#FF5A6A" stroke="#0E0D14" stroke-width="10" paint-order="stroke">E ACABOU DE INTERFONAR</text>`;
  return s;
};

criarEpisodio(E, EU());
