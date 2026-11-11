// HISTÓRIA 11 — O ESPELHO ATRASADO
historia({ visual: { pele: '#C68E62', pele2: '#A8714C', cabelo: '#1E1612', camisa: '#5B6475' } });
HS.push(
  ganchoH('O reflexo dele tá *três segundos atrasado*. E hoje... o reflexo *piscou primeiro*.', [['MEU REFLEXO TÁ'], ['3 SEGUNDOS'], ['ATRASADO', '#F7C531']], { fundo: 'banheiro' }),
  corpoH('Seis da manhã. O Bruno escova os dentes, olha no espelho... e o reflexo *demora*.', { fundo: 'banheiro', pose: 'base', expr: 'sono', troca: { palavra: 'demora', expr: 'surpreso' }, relogio: '06:00' }),
  closeH('Ele levanta a mão. Um... dois... três... *e aí o reflexo levanta*.', { fundo: 'banheiro', expr: 'surpreso', troca: { palavra: 'levanta', expr: 'panico', suor: true } }),
  closeH('Ele testou o dia inteiro. Sempre três segundos. *Sempre*.', { fundo: 'banheiro', expr: 'determinado', extra: (lt, c) => cardH(lt, c, { palavra: 'três', texto: '3 SEGUNDOS', emoji: '⏱️' }) }),
  closeH('Até que de noite, o reflexo *sorriu sozinho*.', { fundo: 'banheiro', expr: 'neutro', troca: { palavra: 'sorriu', expr: 'panico', suor: true, tremer: true }, extra: (lt, c) => cardH(lt, c, { palavra: 'sorriu', texto: 'SORRIU SOZINHO', emoji: '😊', cor: '#E8344B' }) }),
  closeH('E escreveu no vapor do vidro: *não dorme hoje*.', { fundo: 'banheiro', expr: 'panico', suor: true, extra: (lt, c) => cardH(lt, c, { palavra: 'não', texto: 'NÃO DORME HOJE', cor: '#E8344B' }) }),
  votacaoH('O que ele faz? A: cobre o espelho e vai dormir. B: fica acordado e pergunta por quê.', { rotulo: 'COBRE O ESPELHO', emoji: '🧻' }, { rotulo: 'PERGUNTA POR QUÊ', emoji: '❓', pose: 'aponta', expr: 'determinado' }),
  finalH('banheiro'),
);
fecharHistoria({ capa: capaH({ fundo: 'banheiro', l1: 'MEU REFLEXO', l2: 'SORRIU SOZINHO 😨', etiqueta: '3 SEG' }) });
