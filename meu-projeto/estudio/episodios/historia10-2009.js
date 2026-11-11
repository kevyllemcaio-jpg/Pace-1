// HISTÓRIA 10 — ACORDOU EM 2009
historia({ visual: { pele: '#E8B48C', pele2: '#C99470', cabelo: '#2B1D16', camisa: '#F28C28' } });
const quarto2009 = (lt) => quarto(lt, { cartazLinhas: [['ROCK', '#2A2A2A'], ['2009', '#C33A3A']] });
HS.push(
  ganchoH('Ele dormiu com trinta anos... e acordou com *quinze*. Em *dois mil e nove*. Sabendo tudo que vai acontecer.', [['DORMI COM 30 ANOS'], ['E ACORDEI'], ['EM 2009', '#F7C531']]),
  closeH('O Rafa foi dormir cansado, numa terça qualquer.', { expr: 'sono', relogio: '23:40' }),
  corpoH('Acordou no quarto de quando era adolescente. Pôster de banda, *celular de flip*...', { fundo: quarto2009, pose: 'cabeca', expr: 'surpreso', extra: (lt, c) => cardH(lt, c, { palavra: 'celular', texto: 'CELULAR DE FLIP', emoji: '📱' }) }),
  closeH('A mãe gritou da cozinha: Rafael, *vai perder a prova*!', { fundo: quarto2009, expr: 'surpreso', troca: { palavra: 'perder', expr: 'panico', tremer: true } }),
  closeH('Ele sabe quais empresas vão explodir. E sabe que a Ana... *vai se mudar* em um mês.', { fundo: quarto2009, expr: 'sonhador', troca: { palavra: 'mudar', expr: 'triste' }, extra: (lt, c) => cardH(lt, c, { palavra: 'mudar', texto: 'ANA SE MUDA EM 30 DIAS', emoji: '💔' }) }),
  votacaoH('O que ele faz? A: investe tudo pra ficar rico. B: se declara pra Ana antes dela ir.', { rotulo: 'INVESTE E FICA RICO', emoji: '💰', pose: 'comemora', expr: 'sorrisao' }, { rotulo: 'SE DECLARA PRA ANA', emoji: '💌', pose: 'cintura', expr: 'vergonha' }),
  finalH(quarto2009),
);
fecharHistoria({ capa: capaH({ l1: 'ACORDEI EM 2009', l2: 'SABENDO DE TUDO 🤯', etiqueta: '15 ANOS DE NOVO' }) });
