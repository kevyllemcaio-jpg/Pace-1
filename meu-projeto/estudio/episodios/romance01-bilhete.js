// ROMANCE DE ESCOLA 1 — O BILHETE NO LIVRO (protagonista: Léo)
romance({ voz: 'en-US-AndrewMultilingualNeural', velocidade: '+6%' });
const LEO = (o) => chibi({ pele: '#E8B48C', cabelo: { tipo: 'baguncado', cor: '#5A3A24' }, olhos: '#6B8E3A', roupa: { camisa: '#2BA59A', calca: '#3E5C93', sapato: '#F4F4F4' }, semente: 3, ...o });
const LIA = (o) => chibi({ pele: '#8A5A3C', cabelo: { tipo: 'cacheado', cor: '#1E1612' }, olhos: '#5A3420', tiara: '#F29BB0', roupa: { camisa: '#FFFFFF', saia: '#7A3FB0', calca: '#7A3FB0', sapato: '#2A2238' }, semente: 8, ...o });
RS.push(
  ganchoR('Eu escrevi no canto de um livro da biblioteca... e *alguém respondeu*.', [['ESCREVI NUM LIVRO'], ['DA BIBLIOTECA...'], ['E ALGUÉM RESPONDEU 💌', '#F7C531']], LEO, { fundo: 'biblioteca', vergonha: 0.6 }),
  closeR('O Léo sempre pega o mesmo livro. E numa terça, escreveu a lápis na última página: *alguém mais acha esse final triste?*', LEO, { fundo: 'biblioteca', expr: 'sonhando', extra: (lt, c) => (lt > c.w('alguém') ? pulo(bilhete(540, 560, -4, 'alguém mais acha|esse final triste?'), lt, 540, 560, c.w('alguém')) : '') }),
  closeR('Uma semana depois, tinha uma resposta. Com outra letra: *acho. mas eu mudaria o final.*', LEO, { fundo: 'biblioteca', expr: 'neutro', troca: { palavra: 'resposta', expr: 'surpreso' }, extra: (lt, c) => (lt > c.w('acho') ? pulo(bilhete(540, 560, 3, 'acho.|mas eu mudaria o final.'), lt, 540, 560, c.w('acho')) : '') }),
  {
    fala: 'Os bilhetes viraram conversa. Música preferida. Medo de prova. O sonho dele de ser *arquiteto*.',
    desenhar(lt, c) {
      let s = fr('roxo', lt);
      [['música?|"a que toca|no intervalo"', 'música', 300, 520, -8], ['tenho medo|da prova de física', 'medo', 760, 760, 6], ['vou ser|arquiteto 🏛️', 'arquiteto', 380, 1060, -3]].forEach(([t, p, x, y, r]) => { if (lt > c.w(p)) s += pulo(bilhete(x, y, r, t, 0.9), lt, x, y, c.w(p)); som('pop', c.w(p), 0.6); });
      return s;
    },
  },
  closeR('Até que um dia veio: *sexta, intervalo, banco perto da quadra?*', LEO, { fundo: 'biblioteca', expr: 'surpreso', troca: { palavra: 'sexta', expr: 'vergonha', vergonha: 1 }, extra: (lt, c) => (lt > c.w('sexta') ? pulo(bilhete(540, 560, -3, 'sexta, intervalo,|banco perto da quadra?'), lt, 540, 560, c.w('sexta')) : '') }),
  duoR('Ele foi. E quem tava no banco era a Lia. A menina que senta na frente dele há dois anos... e *nunca disse oi*.', LEO, LIA, { exprA: 'surpreso', exprB: 'vergonha', vgB: 0.8 }),
  closeR('Oi. Eu... sou a que muda os finais.', LIA, { voz: 'mulher', expr: 'vergonha', vergonha: 1, fundo: 'patio' }),
  votacaoR('E agora? A: ele senta e conversa com ela. B: ele entrega um bilhete... e vai embora sorrindo.', { rotulo: 'SENTA E CONVERSA', emoji: '💬', quem: LEO }, { rotulo: 'ENTREGA UM BILHETE', emoji: '💌', quem: LEO, expr: 'vergonha', vergonha: 1 }),
  finalR(LEO, 'roxo'),
);
fecharRomance({ capa: capaR({ fundo: 'roxo', quem: LEO, l1: 'O BILHETE NO LIVRO', l2: 'ELA RESPONDEU 💌', etiqueta: 'BIBLIOTECA', extra: () => bilhete(540, 760, -4, 'acho. mas eu|mudaria o final.', 0.9) }) });
