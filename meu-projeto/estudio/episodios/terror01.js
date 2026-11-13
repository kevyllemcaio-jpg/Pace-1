// NÃO ABRA DEPOIS DAS 3H — Episódio 1 (terror em primeira pessoa, sem narrador)
// A câmera é a visão do protagonista. Só ele fala (pensando alto, lendo, sussurrando) e os visitantes falam do lado de fora.
// Regras: 1) depois das 3h ninguém entra; 2) o porteiro nunca sobe; 3) sem sombra embaixo da porta = não é gente.

window.LEGENDA_Y = 1580;
window.TRATAR_VOZ = false;
window.TRILHA = 'terror';
const EU = { voz: 'pt-BR-AntonioNeural', velocidade: '+4%' };
const V_JORGE = { voz: 'en-US-BrianMultilingualNeural', velocidade: '+0%' };
const V_PORTEIRO = { voz: 'en-US-AndrewMultilingualNeural', velocidade: '-22%' };
const V_MAE = { voz: 'pt-BR-FranciscaNeural', velocidade: '-12%' };
const V_LAURA = { voz: 'pt-BR-ThalitaMultilingualNeural', velocidade: '+14%' };
const JORGE = { pele: '#E8B48C', pele2: '#C99470', cabelo: '#D8D8DC', camisa: '#7A9A5A', oculos: true };
const PORTEIRO = { pele: '#C9946A', pele2: '#A8714C', cabelo: '#2A1E18', camisa: '#2F4A7A', gola: '#F4F4F8', naoPisca: true };
const LAURA = { pele: '#8A5A3C', pele2: '#6E452C', cabelo: '#1E1612', camisa: '#E8A0B8', longo: true, cilios: true };
const REGRAS = [['REGRAS DO 301', '#8A1A1A'], ['1. depois das 3h, ninguém entra'], ['2. o porteiro nunca sobe'], ['3. sem sombra embaixo da porta,'], ['    não é gente.'], ['    — boa sorte', '#8A1A1A']];
const E = [];
const bate = (t0, vol = 1) => som('batida', t0, vol);

// 1 — gancho (batida já no primeiro segundo)
E.push({
  fala: 'Primeira noite no apartamento novo. E alguém tá batendo na porta.',
  voz: EU, capa: 0.6,
  desenhar(lt, c) {
    bate(0.15, 1.1);
    let s = portaPOV(lt, { sombra: true, tremer: lt > 0.15 && lt < 1 ? 5 : 0 });
    s += tituloTerror([['SE BATEREM DEPOIS DAS 3H...'], ['NÃO ABRA', '#E8344B']]);
    return s + acabamentoT(lt);
  },
});
// 2 — o bilhete
E.push({
  fala: 'Achei esse bilhete colado atrás da porta. Regra um: depois das três, ninguém entra. Regra dois: o porteiro nunca sobe. Regra três: se não tiver sombra embaixo da porta... não é gente.',
  voz: EU, legendaY: 1700,
  desenhar(lt, c) {
    const v = lim(lt / 0.4) + (lt > c.w('um') ? 1 : 0) + (lt > c.w('dois') ? 1 : 0) + (lt > c.w('três', 1) ? 2 : 0) + (lt > c.w('gente') ? 1 : 0);
    return bilheteRegras(lt, REGRAS, v) + acabamentoT(lt);
  },
});
// 3 — relógio
E.push({
  fala: 'Duas e cinquenta e oito. Que tipo de prédio tem regra assim?',
  voz: EU,
  desenhar: (lt) => celularPOV(lt, '02:58') + acabamentoT(lt),
});
// 4 — batida
E.push({
  fala: 'Bateram de novo.',
  voz: EU, dur: 2.4,
  desenhar(lt) { bate(0.1); return portaPOV(lt, { sombra: true, tremer: lt < 0.9 ? 4 : 0 }) + acabamentoT(lt); },
});
// 5 — Seu Jorge
E.push({
  fala: 'Boa noite, rapaz! Sou o Seu Jorge, do trezentos e dois. Desculpa a hora. Tem um pouquinho de açúcar?',
  voz: V_JORGE,
  desenhar: (lt) => olhoMagico(lt, visitante(JORGE, lt, { expr: 'sorrisao', fala: true })) + acabamentoT(lt),
});
// 6 — ele confere
E.push({
  fala: 'Ainda não era três horas. E tinha sombra embaixo da porta. Passei o açúcar pela corrente.',
  voz: EU,
  desenhar(lt, c) {
    let s = portaPOV(lt, { sombra: true, aberta: lt > c.w('passei') ? 0.45 : 0 });
    if (lt > c.w('passei')) s += `<g transform="translate(${mix(560, 760, lim((lt - c.w('passei')) / 0.8))} 960)"><rect x="-60" y="-80" width="120" height="160" rx="10" fill="#F4F1E6" stroke="#0E0C0A" stroke-width="6"/><text x="0" y="10" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="34" fill="#2A2A2A">AÇÚCAR</text></g>` + maoPOV(700, 1500, -20, 1.1, -1);
    return s + acabamentoT(lt);
  },
});
// 7 — três horas
E.push({
  fala: 'Três horas. A luz do corredor apagou.',
  voz: EU,
  desenhar(lt, c) {
    const luz = lt > c.w('apagou') ? 0 : 1;
    return celularPOV(lt, '03:00') + (luz ? '' : `<rect width="1080" height="1920" fill="#000" opacity="0.4"/>`) + acabamentoT(lt, { pisc: 0.8 });
  },
});
// 8 — o porteiro
E.push({
  fala: 'Boa noite. Sou o porteiro. Vim verificar um vazamento. Pode abrir a porta?',
  voz: V_PORTEIRO,
  desenhar(lt) { bate(0.05, 0.9); return olhoMagico(lt, visitante(PORTEIRO, lt, { expr: 'sorrisao', fala: true, olhar: [0, 0] }), { luz: 0.35 }) + acabamentoT(lt, { pisc: 0.5 }); },
});
// 9 — sem sombra
E.push({
  fala: 'O porteiro nunca sobe. Olhei pra baixo. E embaixo da porta... *não tinha sombra nenhuma*.',
  voz: EU,
  desenhar(lt, c) {
    const t0 = c.w('não', 1);
    let s = portaPOV(lt, { sombra: false, luzCorredor: 0.6 });
    if (lt > t0) s = tremor(s, lt, t0, 10, 0.5);
    return s + acabamentoT(lt);
  },
});
// 10 — susto
E.push({
  fala: 'Abre.',
  voz: V_PORTEIRO, dur: 2.2,
  desenhar(lt) {
    bate(0.05, 1.3); bate(0.6, 1.3);
    let s = olhoMagico(lt, visitante(PORTEIRO, lt, { expr: 'sorrisao', y: 1240, esc: 2.4 }), { luz: 0.25 });
    s += flashBranco(lt, 0.05, 0.25);
    return tremor(s, lt, 0.05, 24, 1.2) + acabamentoT(lt);
  },
});
// 11 — a mãe
E.push({
  fala: 'Filho? É a mãe. Esqueci a chave. Abre pra mim.',
  voz: V_MAE,
  desenhar: (lt) => olhoMagico(lt, '', { luz: 0.3 }) + acabamentoT(lt, { pisc: 0.4 }),
});
E.push({
  fala: 'Não tinha ninguém no olho mágico. E a minha mãe mora em Recife. Ela nem sabe esse endereço.',
  voz: EU,
  desenhar: (lt) => portaPOV(lt, { sombra: false, luzCorredor: 0.4 }) + acabamentoT(lt),
});
// 12 — a Laura
E.push({
  fala: 'Por favor, abre! Eu sou a Laura, do trezentos e quatro! Tem alguma coisa no corredor! Tá vindo!',
  voz: V_LAURA,
  desenhar(lt) {
    bate(0.05, 1.2); bate(0.9, 1.2); bate(1.8, 1.2);
    return tremor(olhoMagico(lt, visitante(LAURA, lt, { expr: 'panico', fala: true, olhar: [-1, 0] }), { luz: 0.45 }), lt, 0, 6, 9) + acabamentoT(lt, { pisc: 0.5 });
  },
});
// 13 — a sombra pisca
E.push({
  fala: 'Olhei embaixo da porta. A sombra... *aparece e some*.',
  voz: EU,
  desenhar: (lt) => portaPOV(lt, { sombra: 'pisca', luzCorredor: 0.7 }) + acabamentoT(lt),
});
// 14 — votação
E.push({
  fala: 'Abre... ou não abre?',
  voz: EU, dur: 4.5,
  desenhar(lt) {
    let s = portaPOV(lt, { sombra: 'pisca', luzCorredor: 0.7 }) + `<rect width="1080" height="1920" fill="#000" opacity="0.55"/>`;
    s += textoImpacto('ABRE', lt, 0.3, { y: 640, tam: 220, cor: '#6BEA8E', rot: -4 });
    s += textoImpacto('OU', lt, 0.8, { y: 860, tam: 130, rot: 0 });
    s += textoImpacto('NÃO ABRE?', lt, 1.1, { y: 1100, tam: 200, cor: '#E8344B', rot: 3 });
    s += textoImpacto('COMENTA 👇', lt, 1.8, { y: 1300, tam: 90, cor: '#F7C531', rot: 0 });
    return s + acabamentoT(lt);
  },
});

window.CAPA = () => {
  let s = olhoMagico(0.5, visitante(PORTEIRO, 0.5, { expr: 'sorrisao' }), { luz: 0.35 });
  s += tituloTerror([['NÃO ABRA'], ['DEPOIS DAS 3H', '#E8344B']], 200);
  s += `<g transform="translate(540 1600) rotate(-4)"><rect x="-330" y="-60" width="660" height="120" rx="12" fill="#E6DCC4" stroke="#000" stroke-width="6"/><text x="0" y="22" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="66" fill="#8A1A1A">o porteiro nunca sobe.</text></g>`;
  return s + vinheta() + granulado(0.5);
};

criarEpisodio(E, EU);
