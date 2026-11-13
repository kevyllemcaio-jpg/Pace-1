// POSTO 24H — Parte 1 (terror POV em "mundo aberto": bombas, loja, corredor, câmera)
// Vini trabalha na madrugada da conveniência de um posto; o Gui foi fazer companhia.
// Regras da madrugada: depois das 3h33, olhe a câmera antes de atender; se a pessoa não aparecer na câmera,
// não venda nada e não olhe nos olhos; nunca saia do caixa até amanhecer.
// Às 3h33 entra um motoqueiro de capacete preto. Na câmera, ele não aparece. E o Gui também não vê ninguém.

window.LEGENDA_FRASE = true;
window.LEGENDA_Y = 1600;
window.FONTE_LEGENDA = 'Baloo, sans-serif';
window.TRATAR_VOZ = true;
window.TRILHA = 'terror';
const EU = (velocidade = '+6%', tom = '+0Hz') => ({ voz: 'en-US-AndrewMultilingualNeural', velocidade, tom });
const V_GUI = (velocidade = '+14%', tom = '+6Hz') => ({ voz: 'pt-BR-AntonioNeural', velocidade, tom });
const V_CAMINHONEIRO = { voz: 'en-US-BrianMultilingualNeural', velocidade: '+0%', tom: '-6Hz' };
const V_MOTO = { voz: 'pt-PT-DuarteNeural', velocidade: '-22%', tom: '-16Hz' };
const VERDE = '#7FE0A0', AMARELO = '#FFD25A', VERMELHO = '#FF5A6A';
const VINI = { pele: '#E2A77E', pele2: '#C98A62', cabelo: '#2B1D16', camisa: '#C0392B' };
const GUI = { pele: '#8A5A3C', pele2: '#6E452C', cabelo: '#1E1612', camisa: '#2BA59A' };
const CAMINHONEIRO = { pele: '#C68E62', pele2: '#A8714C', cabelo: '#5A5A62', camisa: '#4A6A8A' };
const MOTO = { pele: '#C68E62', cabelo: '#111', camisa: '#1A1A1E', capacete: true, naoPisca: true };
const E = [];
const cena = (o) => E.push(o);
const ding = (t0) => som('ding', t0, 0.9);
// pessoa entrando pela porta e vindo até o caixa (perspectiva)
function entrando(visual, lt, t0, dur, o = {}) {
  const k = lim((lt - t0) / dur);
  const y = mix(1090, o.yFim || 1420, k), e = mix(0.3, o.escFim || 0.62, k);
  return andando(visual, lt, 540 + (o.dx || 0) * (1 - k), y, e, { parado: k >= 1, ...o });
}
const fim = (lt, p = 0) => (p ? pisca(lt, p) : '') + granulado(lt, 0.05);

// 1 — gancho: o posto de fora
cena({
  fala: 'Turno da madrugada num posto no meio da estrada. E hoje o Gui veio me fazer companhia.',
  voz: EU('+8%'), capa: 0.4,
  desenhar(lt) {
    const x = mix(-300, 330, suave(lt / 2.2));
    let s = postoFora(lt, { carroX: x, dentro: andando(VINI, lt, 720, 1078, 0.22, { parado: true }) });
    s += andando(GUI, lt, mix(380, 560, lim((lt - 2.2) / 2)), 1520, 0.55, { parado: lt < 2.2 || lt > 4.2 });
    return s + hudPOV(1, '02:58') + fim(lt);
  },
});
// 2 — Gui no corredor
cena({
  fala: 'Mano, esse posto no meio do nada às três da manhã é muito sinistro.',
  voz: V_GUI(), rotulo: 'GUI', corLegenda: AMARELO,
  desenhar: (lt) => corredorLoja(lt, andando(GUI, lt, mix(200, 760, lim(lt / 3)), 1820, 0.95, { expr: 'sorrisao', fala: true })) + hudPOV(1, '02:59') + fim(lt),
});
// 3 — as regras
cena({
  fala: 'O gerente deixou um bilhete no caixa. Depois das três e trinta e três, olhe a câmera antes de atender. Se a pessoa não aparecer na câmera, não venda nada. E nunca saia do caixa.',
  voz: EU('-2%', '-4Hz'),
  desenhar(lt, c) {
    const R = [['REGRAS DA MADRUGADA', '#8A1A1A'], ['1. depois das 3h33, olhe a câmera'], ['    antes de atender'], ['2. não apareceu na câmera?'], ['    não venda nada'], ['3. nunca saia do caixa', '#8A1A1A']];
    const v = lim(lt / 0.4) + (lt > c.w('depois') ? 2 : 0) + (lt > c.w('se') ? 2 : 0) + (lt > c.w('nunca') ? 1 : 0);
    return bilheteRegras(lt, R, v).replace('fill="#0E0C0A"/><ellipse', 'fill="#C0392B"/><ellipse') + hudPOV(1, '03:00') + fim(lt);
  },
});
// 4 — caminhoneiro (normal)
cena({
  fala: 'Às três e quinze, um caminhoneiro entrou.',
  voz: EU('+6%'),
  desenhar(lt) { ding(0.2); return lojaCaixa(lt, { abre: Math.sin(lim(lt / 2.6) * Math.PI), bilhete: true, pessoas: entrando(CAMINHONEIRO, lt, 0.3, 2.2, { expr: 'feliz' }) }) + hudPOV(1, '03:15') + fim(lt); },
});
cena({
  fala: 'Boa noite, filho! Um café e a chave do banheiro, por favor.',
  voz: V_CAMINHONEIRO, rotulo: 'CAMINHONEIRO', corLegenda: VERDE,
  desenhar: (lt) => lojaCaixa(lt, { bilhete: true, pessoas: andando(CAMINHONEIRO, lt, 540, 1420, 0.62, { parado: true, expr: 'sorrisao', fala: true, pose: 'aponta' }) }) + hudPOV(1, '03:15') + fim(lt),
});
// 5 — 3h33
cena({
  fala: 'Três e trinta e três. As luzes da pista piscaram.',
  voz: EU('-6%', '-6Hz'),
  desenhar: (lt) => postoFora(lt, { luz: Math.sin(lt * 20) > 0 ? 1 : 0.2, dentro: andando(VINI, lt, 720, 1078, 0.22, { parado: true }) }) + hudPOV(1, '03:33') + fim(lt, 0.5),
});
// 6 — o motoqueiro entra
cena({
  fala: 'E entrou um motoqueiro. Capacete preto. Ele não tirou o capacete.',
  voz: EU('-4%', '-6Hz'),
  desenhar(lt) { ding(0.2); return lojaCaixa(lt, { abre: Math.sin(lim(lt / 3) * Math.PI), bilhete: true, luz: 0.85, pessoas: entrando(MOTO, lt, 0.3, 2.6, { vel: 5 }) }) + hudPOV(1, '03:33') + fim(lt, 0.3); },
});
cena({
  fala: 'Um energético. O de sempre.',
  voz: V_MOTO, rotulo: 'MOTOQUEIRO', corLegenda: VERMELHO,
  desenhar: (lt) => lojaCaixa(lt, { bilhete: true, luz: 0.8, pessoas: andando(MOTO, lt, 540, 1420, 0.62, { parado: true }) }) + hudPOV(1, '03:34') + fim(lt, 0.3),
});
// 7 — a câmera
cena({
  fala: 'Olhei pra câmera, como dizia a regra. Lá tava eu no caixa. O Gui no corredor. E na minha frente... ninguém.',
  voz: EU('-8%', '-8Hz'),
  desenhar: (lt) => camLoja(lt, { hora: '03:34:20', figuras: andando(VINI, lt, 430, 1110, 0.28, { parado: true }) + andando(GUI, lt, 330, mix(560, 800, lim(lt / 4)), 0.26, {}) }) + hudPOV(1, '03:34') + fim(lt),
});
// 8 — o Gui
cena({
  fala: 'Vini... com quem você tá falando?',
  voz: V_GUI('+0%', '+2Hz'), rotulo: 'GUI', corLegenda: AMARELO,
  desenhar: (lt) => corredorLoja(lt, andando(GUI, lt, 540, 1820, 0.95, { parado: true, expr: 'panico', fala: true })) + hudPOV(1, '03:34') + fim(lt),
});
// 9 — a ameaça
cena({
  fala: 'Você vai me vender... ou vai sair do caixa?',
  voz: V_MOTO, rotulo: 'MOTOQUEIRO', corLegenda: VERMELHO,
  desenhar(lt) {
    let s = lojaCaixa(lt, { bilhete: true, luz: 0.7, pessoas: andando(MOTO, lt, 540, mix(1420, 1700, suave(lt / 2)), mix(0.62, 1.0, suave(lt / 2)), { parado: true, pose: 'aponta' }) });
    return tremor(s, lt, 1.5, 10, 0.6) + hudPOV(1, '03:35') + fim(lt, 0.4);
  },
});
// 10 — o que você faria
cena({
  fala: 'O que você faria?',
  voz: EU('-12%', '-10Hz'), semLegenda: true, dur: 4,
  desenhar(lt) {
    let s = lojaCaixa(lt, { bilhete: true, luz: 0.6, pessoas: andando(MOTO, lt, 540, 1700, 1.0, { parado: true }) }) + `<rect width="1080" height="1920" fill="#000" opacity="0.55"/>`;
    s += textoImpacto('O QUE VOCÊ', lt, 0.1, { y: 560, tam: 130, rot: 0 });
    s += textoImpacto('FARIA?', lt, 0.4, { y: 720, tam: 170, rot: 0, cor: VERMELHO });
    s += textoImpacto('VENDE ou SAI DO CAIXA 👇', lt, 1.0, { y: 1500, tam: 62, rot: 0, cor: '#F7C531' });
    return s + fim(lt);
  },
});

window.CAPA = () => {
  let s = lojaCaixa(0.5, { bilhete: true, luz: 0.8, abre: 0.6, pessoas: andando(MOTO, 0.5, 540, 1420, 0.62, { parado: true }) }) + hudPOV(1, '03:33');
  s += `<rect x="40" y="1080" width="1000" height="250" rx="20" fill="#000" opacity="0.65"/><text x="540" y="1190" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="70" fill="#fff" stroke="#0E0D14" stroke-width="10" paint-order="stroke">ELE NÃO APARECE</text>`;
  s += `<text x="540" y="1290" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="70" fill="#FF5A6A" stroke="#0E0D14" stroke-width="10" paint-order="stroke">NA CÂMERA 📹</text>`;
  return s;
};

criarEpisodio(E, EU());
