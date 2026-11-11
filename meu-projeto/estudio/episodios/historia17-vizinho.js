// HISTÓRIA 17 — O VIZINHO DE CIMA
historia({ visual: { pele: '#8A5A3C', pele2: '#6E452C', cabelo: '#1E1612', camisa: '#5B6475' } });
const quartoEscuro = (lt) => quarto(lt, { luz: 0.5, cartazLinhas: null });
const barulho = (lt, c, palavra, txt) => { const t0 = c.w(palavra); if (lt < t0) return ''; som('carimbo', t0, 0.7); return pulo(`<text x="540" y="560" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="120" fill="#F7C531" stroke="#15131A" stroke-width="14" paint-order="stroke">${txt}</text>`, lt, 540, 520, t0); };
HS.push(
  ganchoH('Todo dia ele escuta barulho no apartamento de cima. O problema: o prédio *só tem um andar*.', [['TEM BARULHO NO'], ['APARTAMENTO DE CIMA'], ['O PRÉDIO É TÉRREO', '#F7C531']], { fundo: quartoEscuro }),
  closeH('Três da manhã. *Passos*. Alguém andando de um lado pro outro, bem em cima da cama.', { fundo: quartoEscuro, expr: 'sono', troca: { palavra: 'passos', expr: 'surpreso' }, relogio: '03:00', extra: (lt, c) => barulho(lt, c, 'passos', 'TUM... TUM...') }),
  corpoH('O Caio subiu na laje com a lanterna. *Nada*. Só telha e poeira.', { fundo: 'noite', pose: 'aponta', expr: 'determinado', troca: { palavra: 'nada', expr: 'surpreso' } }),
  closeH('Desceu, deitou... e o barulho voltou. *Mais forte*. Arrastando um móvel.', { fundo: quartoEscuro, expr: 'surpreso', troca: { palavra: 'mais', expr: 'panico', suor: true, tremer: true }, extra: (lt, c) => barulho(lt, c, 'arrastando', 'CRRRRR') }),
  closeH('De manhã, tinha um bilhete embaixo da porta: *para de olhar pra cima*.', { fundo: 'quartoN', expr: 'panico', suor: true, extra: (lt, c) => cardH(lt, c, { palavra: 'para', texto: 'PARA DE OLHAR PRA CIMA', cor: '#E8344B' }) }),
  votacaoH('O que ele faz? A: chama a polícia. B: sobe de novo hoje à noite.', { rotulo: 'CHAMA A POLÍCIA', emoji: '🚓', pose: 'celular' }, { rotulo: 'SOBE DE NOVO', emoji: '🔦', pose: 'aponta', expr: 'determinado' }),
  finalH(quartoEscuro),
);
fecharHistoria({ capa: capaH({ fundo: quartoEscuro, l1: 'O VIZINHO DE CIMA', l2: 'NUM PRÉDIO DE 1 ANDAR 😨', etiqueta: '3H DA MANHÃ' }) });
