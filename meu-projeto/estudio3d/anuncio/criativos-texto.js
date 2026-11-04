// Roteiros dos criativos SÓ DE TEXTO (renderizados por anuncio/texto.js).
// Cada bloco: fala (narração), destaque/vermelho/verde (cores das palavras), extras na tela
// (numero, grande, item, carimbo, botao, tag, aviso — `em` = palavra em que aparece) e sons.
//
// Regras de anúncio (Meta): nada de promessa de ganho ou de renda. Fala dos caminhos reais
// (com os requisitos verdadeiros) e vende a HABILIDADE. Fatos conferidos:
//  - YouTube (receita de anúncios nos Shorts): 1.000 inscritos + 10 milhões de views válidas em 90 dias.
//  - Curso: 5 aulas curtas + kit do estúdio; não precisa programar; IA paga à parte.

module.exports = {
  // D — "dá dinheiro? dá, mas não do jeito que te contam" (só texto + efeitos)
  'anuncio-d': {
    blocos: [
      {
        fala: 'Vídeo de animação feito com IA dá dinheiro? Dá. Mas não do jeito que te contam.',
        destaque: ['animação', 'ia', 'dinheiro'],
        verde: ['dá'],
        vermelho: ['contam'],
        tremer: true,
        icone: 'play',
        brilho: '#FFD21F',
        extras: [
          { tipo: 'tag', texto: 'VÍDEOS DE ANIMAÇÃO COM IA', em: 0 },
          { tipo: 'carimbo', texto: 'NÃO DO JEITO QUE TE CONTAM', em: 'mas', topo: 300 },
        ],
        sons: [{ em: 0, tipo: 'impacto' }, { em: 'da', tipo: 'moeda' }, { em: 'mas', tipo: 'dia' }],
      },
      {
        fala: 'O YouTube só paga Shorts depois de mil inscritos e dez milhões de views em noventa dias.',
        destaque: ['youtube', 'mil', 'milhoes'],
        brilho: '#FF4D4D',
        icone: 'play',
        extras: [
          { tipo: 'numero', ate: 1000, sub: 'INSCRITOS', em: 'mil', topo: 180, tam: 140 },
          { tipo: 'numero', ate: 10, sufixo: ' MI', sub: 'DE VIEWS EM 90 DIAS', em: 'dez', topo: 450, tam: 140, cor: '#FFD21F' },
        ],
        sons: [{ em: 'mil', tipo: 'dia' }, { em: 'dez', tipo: 'dia' }],
      },
      {
        fala: 'Por isso, quem começa a ganhar primeiro vende a habilidade: faz vídeos animados pra lojas, escolas e outros criadores.',
        destaque: ['habilidade', 'vende'],
        verde: ['ganhar'],
        brilho: '#3DDC84',
        icone: 'loja',
        extras: [
          { tipo: 'grande', linhas: ['VENDER', '*VÍDEOS*'], em: 'vende', topo: 200, tam: 130, cor: '#3DDC84', sub: 'PRA LOJAS • ESCOLAS • CRIADORES' },
        ],
        sons: [{ em: 'vende', tipo: 'moeda' }, { em: 'lojas', tipo: 'pop' }],
      },
      {
        fala: 'Pra isso, você precisa de três coisas: um roteiro que prende, um personagem, e um jeito rápido de produzir.',
        destaque: ['três', 'roteiro', 'personagem', 'rápido'],
        brilho: '#4DA3FF',
        icone: 'lista',
        semPalavras: false,
        topoPalavras: 960,
        tamPalavras: 60,
        extras: [
          { tipo: 'item', n: '1', texto: 'ROTEIRO QUE *PRENDE*', em: 'roteiro', topo: 260 },
          { tipo: 'item', n: '2', texto: 'UM *PERSONAGEM*', em: 'personagem', topo: 400 },
          { tipo: 'item', n: '3', texto: 'PRODUÇÃO *RÁPIDA*', em: 'rapido', topo: 540 },
        ],
        sons: [{ em: 'roteiro', tipo: 'pop' }, { em: 'personagem', tipo: 'pop' }, { em: 'rapido', tipo: 'pop' }],
      },
      {
        fala: 'No curso Constrói Isso Aí, você aprende o método completo, em cinco aulas curtas, com o kit do estúdio pronto.',
        destaque: ['constrói', 'isso', 'aí', 'cinco', 'kit'],
        brilho: '#B57BFF',
        icone: 'claquete',
        extras: [
          { tipo: 'grande', linhas: ['CONSTRÓI', '*ISSO AÍ!*'], em: 'curso', topo: 170, tam: 120 },
          { tipo: 'grande', linhas: ['5 AULAS + KIT'], em: 'cinco', topo: 480, tam: 70, cor: '#3DDC84' },
        ],
        sons: [{ em: 'curso', tipo: 'impacto', vol: 0.45 }, { em: 'cinco', tipo: 'plim' }],
      },
      {
        fala: 'Sem câmera, sem edição, e sem saber programar: você pede em português, e a IA monta o vídeo.',
        destaque: ['português', 'ia'],
        vermelho: ['câmera', 'edição', 'programar'],
        brilho: '#FF8A3D',
        icone: 'camera',
        extras: [
          { tipo: 'carimbo', texto: 'SEM CÂMERA', em: 'camera', topo: 200 },
          { tipo: 'carimbo', texto: 'SEM EDIÇÃO', em: 'edicao', topo: 330 },
          { tipo: 'carimbo', texto: 'SEM PROGRAMAR', em: 'programar', topo: 460 },
        ],
        sons: [{ em: 'camera', tipo: 'baque' }, { em: 'edicao', tipo: 'baque' }, { em: 'programar', tipo: 'baque' }],
      },
      {
        fala: 'Não é dinheiro fácil. É uma habilidade, e constância.',
        destaque: ['habilidade', 'constância'],
        vermelho: ['fácil'],
        brilho: '#FF4D4D',
        icone: 'grafico',
        corIcone: '#FFD21F',
        topoIcone: 200,
        topoPalavras: 560,
        tamPalavras: 84,
        sons: [{ em: 'nao', tipo: 'dia' }],
      },
      {
        fala: 'Toque em saiba mais, e faça o seu primeiro vídeo hoje.',
        destaque: ['saiba', 'mais', 'hoje'],
        brilho: '#2DBE60',
        pausa: 1.2,
        extras: [
          { tipo: 'grande', linhas: ['FAÇA O SEU', 'PRIMEIRO *VÍDEO*'], em: 0, topo: 170, tam: 84 },
          { tipo: 'botao', texto: 'SAIBA MAIS', em: 'saiba', topo: 520 },
          { tipo: 'aviso', texto: 'Resultados dependem de dedicação. Sem garantia de ganhos. Assinatura da IA cobrada à parte.', em: 0 },
        ],
        sons: [{ em: 'saiba', tipo: 'plim' }, { em: 'hoje', tipo: 'ok' }],
      },
    ],
  },
};
