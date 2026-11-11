// HISTÓRIA 5 — O GÊMEO
historia({ visual: { pele: '#8A5A3C', pele2: '#6E452C', cabelo: '#1E1612', camisa: '#2FA45A' } });
HS.push(
  ganchoH('Ele fez um teste de DNA de brincadeira... e descobriu um *irmão gêmeo*. Que mora na *rua de trás*.', [['FIZ UM TESTE DE DNA'], ['E DESCOBRI UM'], ['IRMÃO GÊMEO', '#F7C531']]),
  corpoH('O Davi ganhou um teste de DNA de aniversário. Mandou a amostra rindo.', { pose: 'celular', celular: true, expr: 'sorrisao' }),
  chatH('Três semanas depois: parente encontrado. Noventa e nove por cento. *Irmão gêmeo*.', { nome: 'DNA Resultados', hora: '09:12', msgs: [{ de: 'ela', txt: 'Seu resultado está pronto ✅' }, { de: 'ela', txt: 'Parente encontrado: 99,9%', em: 'noventa' }, { de: 'ela', txt: 'Relação: IRMÃO GÊMEO', em: 'irmão' }] }),
  closeH('Só que o Davi é *filho único*. Pelo menos achava que era.', { expr: 'surpreso', troca: { palavra: 'achava', expr: 'panico', suor: true } }),
  corpoH('O endereço do gêmeo? Rua de trás. Casa amarela. Ele passa ali *todo dia*.', { fundo: 'noite', pose: 'base', expr: 'determinado', anda: true, extra: (lt, c) => cardH(lt, c, { palavra: 'casa', texto: 'CASA AMARELA', emoji: '🏠' }) }),
  duploH('Ele bateu na porta. A porta abriu... e era a *mesma cara*.', { pele: '#8A5A3C', pele2: '#6E452C', cabelo: '#1E1612', camisa: '#E8344B' }, { fundo: 'noite' }),
  votacaoH('E agora? A: pergunta pra mãe primeiro. B: entra e conversa com o gêmeo.', { rotulo: 'PERGUNTA PRA MÃE', emoji: '👩' }, { rotulo: 'FALA COM O GÊMEO', emoji: '👬', pose: 'aponta', expr: 'determinado' }),
  finalH('noite'),
);
fecharHistoria({ capa: capaH({ l1: 'MEU GÊMEO', l2: 'MORA NA RUA DE TRÁS 😱', etiqueta: '99,9%' }) });
