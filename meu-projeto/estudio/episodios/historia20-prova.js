// HISTÓRIA 20 — A PROVA
historia({ visual: { pele: '#E8B48C', pele2: '#C99470', cabelo: '#8A4A20', camisa: '#2BA59A' } });
const LUCAS = { pele: '#6E452C', pele2: '#56351F', cabelo: '#1E1612', camisa: '#F2C230', oculos: true };
const prova = (lt, c, palavra, nota) => cardH(lt, c, { palavra, texto: `NOTA: ${nota}`, emoji: '📝', cor: nota === '0' ? '#E8344B' : '#1E9E4A' });
HS.push(
  ganchoH('Ele colou a prova inteira do colega. E o colega errou *tudo de propósito*.', [['COLEI A PROVA INTEIRA'], ['E O COLEGA ERROU'], ['TUDO DE PROPÓSITO', '#F7C531']], { fundo: 'patio' }),
  corpoH('Prova final de matemática. Quem tirar menos de cinco *repete o ano*.', { fundo: 'patio', pose: 'cabeca', expr: 'panico' }),
  closeH('O Enzo sentou atrás do Lucas, o melhor aluno da sala. E copiou *tudo*.', { fundo: 'patio', expr: 'determinado', troca: { palavra: 'tudo', expr: 'sorrisao' } }),
  closeH('Uma semana depois, as notas. Enzo... *zero*.', { fundo: 'patio', expr: 'neutro', troca: { palavra: 'zero', expr: 'panico', suor: true, tremer: true }, extra: (lt, c) => prova(lt, c, 'zero', '0') }),
  outroH('E o Lucas? Também zero. Ele olhou pro Enzo e disse: eu sabia que você ia colar.', LUCAS, { fundo: 'patio', expr: 'determinado', extra: (lt, c) => prova(lt, c, 'também', '0') }),
  outroH('Aí o Lucas mostrou o rascunho: tudo certo. Ele errou *de propósito* pra pegar ele.', LUCAS, { fundo: 'patio', expr: 'sorrisao', extra: (lt, c) => cardH(lt, c, { palavra: 'rascunho', texto: 'RASCUNHO: TUDO CERTO', emoji: '✅', cor: '#1E9E4A' }) }),
  closeH('A recuperação é *amanhã*. E o Enzo não sabe nada.', { fundo: 'patio', expr: 'panico', suor: true, extra: (lt, c) => cardH(lt, c, { palavra: 'amanhã', texto: 'RECUPERAÇÃO AMANHÃ', cor: '#E8344B' }) }),
  votacaoH('O que ele faz? A: pede ajuda pro Lucas. B: estuda sozinho a noite toda.', { rotulo: 'PEDE AJUDA PRO LUCAS', emoji: '🤝', expr: 'vergonha' }, { rotulo: 'ESTUDA A NOITE TODA', emoji: '📚', pose: 'cintura', expr: 'determinado' }),
  finalH('patio'),
);
fecharHistoria({ capa: capaH({ fundo: 'patio', l1: 'COLEI A PROVA', l2: 'E ELE ERROU DE PROPÓSITO', etiqueta: 'NOTA 0' }) });
