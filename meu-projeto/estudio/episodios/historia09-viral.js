// HISTÓRIA 9 — O VÍDEO DA FESTA
historia({ visual: { pele: '#6E452C', pele2: '#56351F', cabelo: '#1E1612', camisa: '#E24B4B' } });
HS.push(
  ganchoH('Ele acordou com *dois milhões de views*... num vídeo dançando que ele *não lembra* de ter gravado.', [['ACORDEI COM 2 MILHÕES'], ['DE VIEWS NUM VÍDEO'], ['QUE EU NÃO LEMBRO', '#F7C531']], { extra: () => luzCelH() }),
  closeH('Domingo, meio-dia. O celular do Thiago *não para de vibrar*.', { expr: 'sono', troca: { palavra: 'vibrar', expr: 'surpreso', tremer: true }, relogio: '12:00', luz: true }),
  chatH('Doze mil seguidores novos. O vídeo dele *viralizou*.', { nome: 'notificações', hora: '12:01', msgs: [{ de: 'ela', txt: '+12.000 novos seguidores' }, { de: 'ela', txt: 'seu vídeo viralizou 🔥 2,1 mi', em: 'viralizou' }] }),
  corpoH('No vídeo, ele tá em cima da mesa, dançando com um *abajur na cabeça*.', { fundo: 'festa', pose: 'comemora', expr: 'sorrisao', extra: (lt, c) => cardH(lt, c, { palavra: 'abajur', texto: 'ABAJUR NA CABEÇA', emoji: '💡' }) }),
  closeH('O problema: a festa era do *chefe dele*. E ele tinha dito que tava doente.', { expr: 'surpreso', troca: { palavra: 'doente', expr: 'panico', suor: true }, extra: (lt, c) => cardH(lt, c, { palavra: 'doente', texto: 'ATESTADO', emoji: '🤒', cor: '#E8344B' }) }),
  chatH('Aí chega a mensagem: bom dia, Thiago. *Melhorou da febre*?', { nome: 'Chefe', hora: '12:04', msgs: [{ de: 'ela', txt: 'bom dia thiago' }, { de: 'ela', txt: 'melhorou da febre? 🙂', em: 'melhorou' }] }),
  votacaoH('O que ele faz? A: assume e vira influencer. B: diz que é um sósia.', { rotulo: 'ASSUME E VIRA INFLUENCER', emoji: '🕺', pose: 'comemora', expr: 'sorrisao' }, { rotulo: 'DIZ QUE É UM SÓSIA', emoji: '🕵️' }),
  finalH(),
);
fecharHistoria({ capa: capaH({ l1: '2 MILHÕES DE VIEWS', l2: 'E EU NÃO LEMBRO 😱', etiqueta: 'VIRALIZEI', extra: () => luzCelH() }) });
