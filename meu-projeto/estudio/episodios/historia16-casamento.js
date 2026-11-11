// HISTÓRIA 16 — CASAMENTO ERRADO
historia({ visual: { pele: '#E8B48C', pele2: '#C99470', cabelo: '#6B4226', camisa: '#2A2A3A' } });
HS.push(
  ganchoH('Ele entrou no casamento errado... e agora tem que fazer o *discurso do padrinho*.', [['ENTREI NO CASAMENTO'], ['ERRADO...'], ['E VIREI PADRINHO', '#F7C531']], { fundo: 'festa' }),
  corpoH('O casamento do primo era no salão azul. O Gustavo entrou no *salão vermelho*.', { fundo: 'festa', pose: 'base', expr: 'feliz', anda: true }),
  closeH('Ninguém conhecia ninguém. E todo mundo achou que ele era o *padrinho atrasado*.', { fundo: 'festa', expr: 'surpreso', extra: (lt, c) => cardH(lt, c, { palavra: 'padrinho', texto: 'O PADRINHO CHEGOU!', emoji: '🤵' }) }),
  corpoH('Comeu, dançou, tirou foto com a noiva... até o DJ anunciar: com a palavra... *o padrinho*!', { fundo: 'festa', pose: 'comemora', expr: 'sorrisao', troca: { palavra: 'padrinho', expr: 'panico', pose: 'cabeca' }, extra: (lt, c) => cardH(lt, c, { palavra: 'padrinho', texto: 'COM A PALAVRA...', emoji: '🎤' }) }),
  closeH('Ele não sabe nem o *nome do noivo*.', { fundo: 'festa', expr: 'panico', suor: true }),
  closeH('E duzentas pessoas tão olhando pra ele, *em silêncio*.', { fundo: 'festa', expr: 'sem_graca', suor: true, extra: (lt, c) => cardH(lt, c, { palavra: 'duzentas', texto: '200 PESSOAS', emoji: '👀' }) }),
  votacaoH('O que ele faz? A: inventa um discurso. B: confessa no microfone.', { rotulo: 'INVENTA UM DISCURSO', emoji: '🎤', pose: 'aponta', expr: 'determinado' }, { rotulo: 'CONFESSA TUDO', emoji: '😳' }),
  finalH('festa'),
);
fecharHistoria({ capa: capaH({ fundo: 'festa', l1: 'CASAMENTO ERRADO', l2: 'E EU SOU O PADRINHO 🎤', etiqueta: 'DISCURSO' }) });
