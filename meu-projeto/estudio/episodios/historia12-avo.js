// HISTÓRIA 12 — O AVÔ INFLUENCER
historia({ visual: { pele: '#E2A77E', pele2: '#C98A62', cabelo: '#3A2418', camisa: '#2BA59A' } });
const AVO = { pele: '#E8B48C', pele2: '#C99470', cabelo: '#E6E6EA', camisa: '#7A9A5A', oculos: true };
H.push(
  ganchoH('O avô dele, de *oitenta e dois anos*, ganhou *um milhão de seguidores* numa noite. E não sabe como.', [['MEU AVÔ DE 82 ANOS'], ['GANHOU 1 MILHÃO'], ['DE SEGUIDORES', '#F7C531']], { fundo: 'cozinha' }),
  outroH('Esse é o Seu Antônio. Oitenta e dois anos. Ontem ele aprendeu a *postar vídeo*.', AVO, { fundo: 'cozinha', expr: 'sorrisao' }),
  outroH('O primeiro vídeo: ele tentando esquentar o pão com o *ferro de passar*.', AVO, { fundo: 'cozinha', expr: 'determinado', falando: false, extra: (lt, c) => cardH(lt, c, { palavra: 'ferro', texto: 'PÃO NO FERRO', emoji: '🍞' }) }),
  chatH('Doze milhões de views. *Um milhão* de seguidores em uma noite.', { nome: 'notificações', hora: '07:30', msgs: [{ de: 'ela', txt: 'seu vídeo tem 12 mi de views 🔥' }, { de: 'ela', txt: '+1.000.000 seguidores', em: 'milhão' }] }),
  closeH('O neto, o Igor, acordou com marcas ligando. Uma oferece *cinquenta mil reais* por um vídeo.', { fundo: 'cozinha', expr: 'surpreso', troca: { palavra: 'cinquenta', expr: 'sorrisao' }, extra: (lt, c) => cardH(lt, c, { palavra: 'cinquenta', texto: 'R$ 50.000', cor: '#1E9E4A' }) }),
  outroH('Só que o avô diz: eu só posto se for receita da *sua avó*.', AVO, { fundo: 'cozinha', expr: 'determinado', extra: (lt, c) => cardH(lt, c, { palavra: 'avó', texto: 'RECEITA DA VÓ', emoji: '🍲' }) }),
  votacaoH('O que eles fazem? A: aceita a marca. B: segue só com as receitas da avó.', { rotulo: 'ACEITA OS R$ 50 MIL', emoji: '💰', pose: 'comemora', expr: 'sorrisao' }, { rotulo: 'RECEITAS DA VÓ', emoji: '🍲', pose: 'cintura', expr: 'feliz' }),
  finalH('cozinha'),
);
fecharHistoria({ capa: capaH({ fundo: 'cozinha', expr: 'sorrisao', l1: 'MEU AVÔ VIRALIZOU', l2: '1 MILHÃO EM 1 NOITE', etiqueta: '82 ANOS' }) });
