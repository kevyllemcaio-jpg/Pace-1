// HISTÓRIA 7 — O MATCH É A PROFESSORA
historia({ visual: { pele: '#C98B62', pele2: '#A8714C', cabelo: '#3A2418', camisa: '#9B59B6' } });
const JULIA = { pele: '#F0C9A6', pele2: '#D9AA86', cabelo: '#8A4A20', camisa: '#F2C230' };
H.push(
  ganchoH('Ele mandou oi, linda no aplicativo... e hoje ela entrou na sala. É a *professora nova*.', [['MANDEI "OI, LINDA"'], ['NO APLICATIVO...'], ['ERA MINHA PROFESSORA', '#F7C531']], { fundo: 'patio' }),
  chatH('Domingo à noite, o Pedro deu match com a Júlia. Ela respondeu. Ele chamou pra sair *sexta*.', { nome: 'júlia, 26', hora: '22:40', msgs: [{ de: 'eu', txt: 'oi linda 😏' }, { de: 'ela', txt: 'oi kkk tudo bem?', em: 'respondeu' }, { de: 'eu', txt: 'bora sair sexta?', em: 'sexta' }] }),
  corpoH('Segunda, oito da manhã. Aula de física.', { fundo: 'patio', pose: 'base', expr: 'sono', relogio: '08:00' }),
  outroH('A porta abre... e entra a Júlia. Professora substituta. *Até o fim do ano*.', JULIA, { fundo: 'patio', expr: 'feliz', falando: false, extra: (lt, c) => cardH(lt, c, { palavra: 'professora', texto: 'PROFESSORA NOVA', emoji: '👩‍🏫' }) }),
  closeH('Ela olhou pra ele. Ele olhou pro chão. E ela disse: Pedro... *vai no quadro*.', { fundo: 'patio', expr: 'vergonha', troca: { palavra: 'quadro', expr: 'panico', suor: true, tremer: true } }),
  closeH('E a prova é sexta. *O mesmo dia do encontro*.', { fundo: 'patio', expr: 'panico', suor: true, extra: (lt, c) => cardH(lt, c, { palavra: 'prova', texto: 'PROVA SEXTA', emoji: '📝' }) }),
  votacaoH('O que ele faz? A: desfaz o match. B: aparece no encontro mesmo assim.', { rotulo: 'DESFAZ O MATCH', emoji: '❌', pose: 'celular' }, { rotulo: 'VAI NO ENCONTRO', emoji: '🌹', pose: 'cintura', expr: 'determinado' }),
  finalH('patio'),
);
fecharHistoria({ capa: capaH({ fundo: 'patio', l1: 'MEU MATCH', l2: 'É MINHA PROFESSORA 😳', etiqueta: 'PROVA SEXTA' }) });
