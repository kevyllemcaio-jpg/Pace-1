// HISTÓRIA 6 — O PIX ERRADO
historia({ visual: { pele: '#E8B48C', pele2: '#C99470', cabelo: '#6B4226', camisa: '#4A90E2' } });
HS.push(
  ganchoH('Ele errou um zero no Pix e mandou *dez mil reais* pra ex. Ela *visualizou*... e não respondeu.', [['ERREI UM ZERO NO PIX'], ['MANDEI R$ 10 MIL'], ['PRA MINHA EX', '#F7C531']], { extra: () => luzCelH() }),
  corpoH('O Lucas ia pagar mil reais de aluguel. Digitou rápido... e saiu um *zero a mais*.', { pose: 'celular', celular: true, expr: 'sono', troca: { palavra: 'zero', expr: 'panico' } }),
  chatH('E a chave salva era a da Camila. *A ex*. Que terminou com ele em março.', { nome: 'Banco • Pix', hora: '10:03', msgs: [{ de: 'eu', txt: 'Pix enviado: R$ 10.000,00 ✅' }, { de: 'eu', txt: 'Para: Camila R.', em: 'camila' }] }),
  closeH('Era o dinheiro de seis meses de aluguel.', { expr: 'panico', suor: true, extra: (lt, c) => cardH(lt, c, { palavra: 'seis', texto: 'SALDO: R$ 4,20', cor: '#E8344B' }) }),
  chatH('Ele mandou mensagem. Ela *visualizou*. Duas horas. Nada.', { nome: 'camila', hora: '12:10', msgs: [{ de: 'eu', txt: 'camila mandei sem querer 😭' }, { de: 'eu', txt: 'pode devolver?? por favor', em: 'visualizou' }] }),
  closeH('Aí ela postou um story: passagem pra *Cancún*.', { expr: 'surpreso', troca: { palavra: 'cancún', expr: 'panico', tremer: true }, extra: (lt, c) => cardH(lt, c, { palavra: 'cancún', texto: 'CANCÚN', emoji: '✈️' }) }),
  votacaoH('O que ele faz? A: vai na porta dela. B: liga pro banco e contesta.', { rotulo: 'VAI NA PORTA DELA', emoji: '🚪' }, { rotulo: 'LIGA PRO BANCO', emoji: '🏦', pose: 'celular' }),
  finalH(),
);
fecharHistoria({ capa: capaH({ l1: 'MANDEI 10 MIL', l2: 'PRA EX SEM QUERER', etiqueta: 'VISUALIZOU', extra: () => luzCelH() }) });
