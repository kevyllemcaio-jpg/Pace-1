// HISTÓRIA 4 — A ALIANÇA NO BOLO
historia({ visual: { pele: '#C68E62', pele2: '#A8714C', cabelo: '#2B1D16', camisa: '#2A2A3A' } });
const SOGRA = { pele: '#E8B48C', pele2: '#C99470', cabelo: '#9A9AA2', camisa: '#B5452F' };
H.push(
  ganchoH('Ele escondeu a aliança no bolo... e a *sogra comeu* o pedaço.', [['ESCONDI A ALIANÇA NO BOLO'], ['E A SOGRA'], ['COMEU O PEDAÇO', '#F7C531']], { fundo: 'festa' }),
  corpoH('Aniversário de namoro. O Rafael escondeu a aliança dentro de uma fatia de bolo de chocolate.', { fundo: 'festa', pose: 'cintura', expr: 'sorrisao', extra: (lt, c) => cardH(lt, c, { palavra: 'aliança', texto: 'NA FATIA DO BOLO', emoji: '💍' }) }),
  closeH('Só que a Dona Célia, a sogra, pegou *justo aquela fatia*.', { fundo: 'festa', expr: 'feliz', troca: { palavra: 'justo', expr: 'panico', suor: true, tremer: true } }),
  outroH('Comeu em duas mordidas e disse: hum, tava *crocante*.', SOGRA, { fundo: 'festa', expr: 'sorrisao', extra: (lt, c) => cardH(lt, c, { palavra: 'crocante', texto: 'TAVA CROCANTE', emoji: '😋' }) }),
  closeH('Crocante. A aliança custou três mil reais. Parcelada em *dez vezes*.', { fundo: 'festa', expr: 'panico', suor: true, extra: (lt, c) => cardH(lt, c, { palavra: 'dez', texto: 'R$ 3.000 EM 10X', cor: '#E8344B' }) }),
  corpoH('E a namorada chega em *cinco minutos*, esperando o pedido.', { fundo: 'festa', pose: 'cabeca', expr: 'panico', relogio: '19:55' }),
  votacaoH('O que ele faz? A: conta tudo e leva a sogra pro hospital. B: pede em casamento com um anel de latinha.', { rotulo: 'CONTA E VAI PRO HOSPITAL', emoji: '🏥' }, { rotulo: 'ANEL DE LATINHA', emoji: '🥫' }),
  finalH('festa'),
);
fecharHistoria({ capa: capaH({ fundo: 'festa', l1: 'A SOGRA COMEU', l2: 'A ALIANÇA 💍', etiqueta: 'R$ 3.000' }) });
