// NÃO ABRA DEPOIS DAS 3H — Episódio 1 (terror em primeira pessoa, cenário iluminado, com o melhor amigo)
// A câmera é a visão do protagonista. Sem narrador: só ele, o Biel (melhor amigo) e quem bate na porta.
// Regras: 1) depois das 3h ninguém entra; 2) o porteiro nunca sobe; 3) sem sombra embaixo da porta = não é gente.

window.LEGENDA_Y = 1600;
window.TRATAR_VOZ = true;
window.TRILHA = 'terror';
// vozes (cada fala com ritmo e tom próprios)
const EU = (velocidade = '+6%', tom = '+0Hz') => ({ voz: 'en-US-AndrewMultilingualNeural', velocidade, tom });
const BIEL_V = (velocidade = '+16%', tom = '+6Hz') => ({ voz: 'pt-BR-AntonioNeural', velocidade, tom });
const V_JORGE = { voz: 'en-US-BrianMultilingualNeural', velocidade: '+2%', tom: '-4Hz' };
const V_PORTEIRO = { voz: 'pt-PT-DuarteNeural', velocidade: '-20%', tom: '-12Hz' };
const V_MAE = { voz: 'pt-BR-FranciscaNeural', velocidade: '-12%', tom: '-6Hz' };
const V_LAURA = { voz: 'pt-BR-ThalitaMultilingualNeural', velocidade: '+16%', tom: '+6Hz' };
const BIEL = { pele: '#8A5A3C', pele2: '#6E452C', cabelo: '#1E1612', camisa: '#F2C230', oculos: false, fone: false, estampa: false };
const JORGE = { pele: '#E8B48C', pele2: '#C99470', cabelo: '#D8D8DC', camisa: '#7A9A5A', oculos: true };
const PORTEIRO = { pele: '#C9946A', pele2: '#A8714C', cabelo: '#2A1E18', camisa: '#2F4A7A', gola: '#F4F4F8', naoPisca: true };
const LAURA = { pele: '#8A5A3C', pele2: '#6E452C', cabelo: '#1E1612', camisa: '#E8A0B8', longo: true, cilios: true };
const REGRAS = [['REGRAS DO 301', '#8A1A1A'], ['1. depois das 3h, ninguém entra'], ['2. o porteiro nunca sobe'], ['3. sem sombra embaixo da porta,'], ['    não é gente.'], ['    — boa sorte', '#8A1A1A']];
const E = [];
const bate = (t0, vol = 1) => som('batida', t0, vol);
const fim = (lt, o) => acabamentoClaro(lt, o);
// Close do Biel falando (sala desfocada atrás).
const biel = (fala, { expr = 'surpreso', voz = BIEL_V(), luz = 1, tremer } = {}) => ({
  fala, voz,
  desenhar(lt, c) {
    let s = salaPOV(lt, { desfoque: 10, luzCorredor: luz }) + kyleClose({ x: 540, y: 1000, esc: 1.5, expr, fala: true, t: lt, visual: BIEL, barba: false });
    if (luz < 1) s += `<rect width="1080" height="1920" fill="#0A0A14" opacity="${0.35 * (1 - luz)}"/>`;
    if (tremer) s = tremor(s, lt, 0, tremer, 99);
    return s + fim(lt);
  },
});

// 1 — gancho
E.push({
  fala: 'Quase três da manhã. Primeira noite no apartamento novo. E alguém tá batendo na porta.',
  voz: EU('+10%'), capa: 0.6,
  desenhar(lt) {
    bate(0.15, 1.1);
    let s = salaPOV(lt, { tremer: lt > 0.15 && lt < 1 ? 4 : 0 });
    s += tituloTerror([['SE BATEREM DEPOIS DAS 3H...'], ['NÃO ABRA', '#E8344B']]);
    return s + fim(lt);
  },
});
E.push(biel('Mano... quem bate na porta essa hora?', { expr: 'surpreso' }));
// 2 — o bilhete
E.push({
  fala: 'Achei esse bilhete atrás da porta. Regra um: depois das três, ninguém entra. Regra dois: o porteiro nunca sobe. Regra três: se não tiver sombra embaixo da porta... não é gente.',
  voz: EU('-2%', '-4Hz'), legendaY: 1720,
  desenhar(lt, c) {
    const v = lim(lt / 0.4) + (lt > c.w('um') ? 1 : 0) + (lt > c.w('dois') ? 1 : 0) + (lt > c.w('três', 1) ? 2 : 0) + (lt > c.w('gente') ? 1 : 0);
    return bilheteRegras(lt, REGRAS, v).replace('fill="#0E0C0A"/><ellipse', 'fill="#B8A07E"/><ellipse') + fim(lt);
  },
});
E.push(biel('Isso aí é pegadinha do antigo morador. Relaxa.', { expr: 'sorrisao', voz: BIEL_V('+10%', '+4Hz') }));
// 3 — Seu Jorge
E.push({
  fala: 'Boa noite, rapaz! Sou o Seu Jorge, do trezentos e dois. Desculpa a hora. Tem um pouquinho de açúcar?',
  voz: V_JORGE,
  desenhar(lt) { bate(0.05, 0.9); return olhoClaro(lt, visitante(JORGE, lt, { expr: 'sorrisao', fala: true })) + fim(lt); },
});
E.push({
  fala: 'Ainda não era três horas. E tinha sombra embaixo da porta. Passei o açúcar pela corrente.',
  voz: EU('+4%'),
  desenhar(lt, c) {
    let s = portaClara(lt, { sombra: true, aberta: lt > c.w('passei') ? 0.45 : 0 });
    if (lt > c.w('passei')) s += `<g transform="translate(${mix(560, 760, lim((lt - c.w('passei')) / 0.8))} 960)"><rect x="-60" y="-80" width="120" height="160" rx="10" fill="#F4F1E6" stroke="#0E0C0A" stroke-width="6"/><text x="0" y="10" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="34" fill="#2A2A2A">AÇÚCAR</text></g>` + maoPOV(700, 1500, -20, 1.1, -1);
    return s + fim(lt);
  },
});
// 4 — três horas
E.push({
  fala: 'Três horas. E a luz do corredor... apagou.',
  voz: EU('-6%', '-6Hz'),
  desenhar(lt, c) { return salaPOV(lt, { luzCorredor: lt > c.w('apagou') ? 0 : 1 }) + fim(lt, { pisc: lt < c.w('apagou') + 0.6 ? 0.5 : 0 }); },
});
// 5 — o porteiro
E.push({
  fala: 'Boa noite. Sou o porteiro. Vim verificar um vazamento. Pode abrir a porta?',
  voz: V_PORTEIRO,
  desenhar(lt) { bate(0.05, 0.9); return olhoClaro(lt, visitante(PORTEIRO, lt, { expr: 'sorrisao', fala: true }), { luz: 0.55 }) + fim(lt, { pisc: 0.4 }); },
});
E.push(biel('Abre aí, mano. É só o porteiro.', { expr: 'neutro', luz: 0, voz: BIEL_V('+8%') }));
E.push({
  fala: 'Não, Biel. O porteiro nunca sobe. Olha embaixo da porta.',
  voz: EU('-8%', '-8Hz'),
  desenhar: (lt) => portaClara(lt, { sombra: false, luzCorredor: 0.6 }) + fim(lt),
});
E.push(biel('Não tem sombra... não tem sombra nenhuma.', { expr: 'panico', luz: 0, voz: BIEL_V('+2%', '+2Hz'), tremer: 4 }));
// 6 — susto
E.push({
  fala: 'Abre.',
  voz: V_PORTEIRO, dur: 2.2,
  desenhar(lt) {
    bate(0.05, 1.3); bate(0.6, 1.3);
    let s = olhoClaro(lt, visitante(PORTEIRO, lt, { expr: 'sorrisao', y: 1240, esc: 2.4 }), { luz: 0.4 });
    s += flashBranco(lt, 0.05, 0.25);
    return tremor(s, lt, 0.05, 24, 1.2) + fim(lt);
  },
});
// 7 — a mãe
E.push({
  fala: 'Filho? É a mãe. Esqueci a chave. Abre pra mim.',
  voz: V_MAE,
  desenhar: (lt) => olhoClaro(lt, '', { luz: 0.45 }) + fim(lt, { pisc: 0.3 }),
});
E.push(biel('Pera... sua mãe não mora em Recife?', { expr: 'panico', luz: 0, voz: BIEL_V('+6%', '+4Hz') }));
E.push({
  fala: 'Mora. E não tinha ninguém no olho mágico.',
  voz: EU('-6%', '-6Hz'),
  desenhar: (lt) => portaClara(lt, { sombra: false, luzCorredor: 0.5 }) + fim(lt),
});
// 8 — a Laura
E.push({
  fala: 'Por favor, abre! Eu sou a Laura, do trezentos e quatro! Tem alguma coisa no corredor! Tá vindo!',
  voz: V_LAURA,
  desenhar(lt) {
    bate(0.05, 1.2); bate(0.9, 1.2); bate(1.8, 1.2);
    return tremor(olhoClaro(lt, visitante(LAURA, lt, { expr: 'panico', fala: true, olhar: [-1, 0] }), { luz: 0.6 }), lt, 0, 6, 9) + fim(lt, { pisc: 0.4 });
  },
});
E.push(biel('Abre, mano! Ela tá chorando!', { expr: 'panico', luz: 0, voz: BIEL_V('+20%', '+8Hz'), tremer: 5 }));
E.push({
  fala: 'Olha a sombra embaixo da porta, Biel. Ela... aparece e some.',
  voz: EU('-10%', '-8Hz'),
  desenhar: (lt) => portaClara(lt, { sombra: 'pisca', luzCorredor: 0.8 }) + fim(lt),
});
// 9 — votação
E.push({
  fala: 'Abre... ou não abre?',
  voz: EU('-12%', '-10Hz'), dur: 4.5,
  desenhar(lt) {
    let s = salaPOV(lt, { sombra: 'pisca', luzCorredor: 0.8 }) + `<rect width="1080" height="1920" fill="#000" opacity="0.5"/>`;
    s += textoImpacto('ABRE', lt, 0.3, { y: 640, tam: 220, cor: '#6BEA8E', rot: -4 });
    s += textoImpacto('OU', lt, 0.8, { y: 860, tam: 130, rot: 0 });
    s += textoImpacto('NÃO ABRE?', lt, 1.1, { y: 1100, tam: 200, cor: '#E8344B', rot: 3 });
    s += textoImpacto('COMENTA 👇', lt, 1.8, { y: 1300, tam: 90, cor: '#F7C531', rot: 0 });
    return s + fim(lt);
  },
});

window.CAPA = () => {
  let s = olhoClaro(0.5, visitante(PORTEIRO, 0.5, { expr: 'sorrisao' }), { luz: 0.55 });
  s += tituloTerror([['NÃO ABRA'], ['DEPOIS DAS 3H', '#E8344B']], 200);
  s += `<g transform="translate(540 1600) rotate(-4)"><rect x="-330" y="-60" width="660" height="120" rx="12" fill="#E6DCC4" stroke="#000" stroke-width="6"/><text x="0" y="22" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="66" fill="#8A1A1A">o porteiro nunca sobe.</text></g>`;
  return s + vinheta(0.5) + granulado(0.5, 0.06);
};

criarEpisodio(E, EU());
