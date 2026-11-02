// Criativos de anúncio do curso (vídeo vertical 1080x1920).
// Cada bloco: fala (narração), clipes (cenas limpas: [video, segundo] — dividem o tempo do bloco),
// e textos por cima: titulo (linhas), cartao [num, sub], etiqueta, botao (CTA).
//
// Regras seguidas (políticas de anúncio): nada de promessa de dinheiro/ganhos; vende a habilidade.

module.exports = {
  // A — gancho de demonstração: "isso foi feito 100% com IA"
  'anuncio-a': {
    blocos: [
      {
        fala: 'Esse vídeo foi feito cem por cento com inteligência artificial.',
        clipes: [['navio', 10.6], ['foguete', 9.5], ['terremoto', 10.6], ['elevador', 48.8]],
        titulo: ['FEITO *100% COM IA*'],
        destaque: ['inteligência', 'artificial'],
      },
      {
        fala: 'Roteiro, cenário 3D, narração, legenda e música. Tudo.',
        clipes: [['tunel', 17], ['descarga', 39], ['energia', 35]],
        destaque: ['3D', 'música'],
      },
      {
        fala: 'Vídeos de "como funciona" prendem a atenção do começo ao fim. E agora você pode fazer os seus.',
        clipes: [['ponte', 13], ['foguete', 37], ['agua', 50]],
        destaque: ['funciona', 'seus'],
      },
      {
        fala: 'No curso Constrói Isso Aí, você aprende o passo a passo: a fórmula do roteiro, o personagem, a thumb, e como gerar o vídeo com IA.',
        clipes: [['aula2', 27], ['aula4', 22]],
        cartao: ['5 AULAS', 'CURTAS E DIRETAS'],
        destaque: ['passo', 'roteiro', 'IA'],
      },
      {
        fala: 'Sem saber programar: você pede em português, e a IA monta o vídeo.',
        clipes: [['aula4', 30]],
        destaque: ['programar', 'português'],
      },
      {
        fala: 'Toque em saiba mais e comece hoje o seu canal.',
        clipes: [['foguete', 62]],
        botao: 'SAIBA MAIS',
        titulo: ['CRIE VÍDEOS 3D', 'COM *IA*'],
        destaque: ['saiba', 'canal'],
      },
    ],
  },

  // B — gancho de curiosidade + "sem câmera, sem edição"
  'anuncio-b': {
    blocos: [
      {
        fala: 'Sabe esses vídeos que mostram por dentro como as coisas funcionam?',
        clipes: [['descarga', 38.5], ['navio', 47]],
        titulo: ['COMO FAZER *ESSES VÍDEOS*?'],
        destaque: ['dentro', 'funcionam'],
      },
      {
        fala: 'Dá pra fazer sem câmera, sem programa de edição e sem saber desenhar.',
        clipes: [['terremoto', 27], ['elevador', 41]],
        etiqueta: 'SEM CÂMERA • SEM EDIÇÃO',
        destaque: ['câmera', 'desenhar'],
      },
      {
        fala: 'A inteligência artificial monta o cenário em 3D, anima o personagem, narra e coloca a legenda sozinha.',
        clipes: [['tunel', 18], ['foguete', 53], ['energia', 35.5]],
        destaque: ['3D', 'sozinha'],
      },
      {
        fala: 'No curso, você aprende o método completo em cinco aulas curtas, com os pedidos prontos pra copiar.',
        clipes: [['aula2', 28], ['aula4', 31]],
        cartao: ['MÉTODO COMPLETO', '5 AULAS + KIT DO ESTÚDIO'],
        destaque: ['método', 'cinco'],
      },
      {
        fala: 'Toque em saiba mais e comece o seu canal.',
        clipes: [['ponte', 70]],
        botao: 'SAIBA MAIS',
        titulo: ['CONSTRÓI *ISSO AÍ!*'],
        destaque: ['saiba', 'canal'],
      },
    ],
  },

  // C — "mini-aula": entrega valor primeiro (ensina a fórmula em 3 passos) e depois oferece o curso.
  //     Estrutura gancho (0-3 s) -> ensino/demonstração -> 1 CTA. Sem promessa de ganhos.
  'anuncio-c': {
    blocos: [
      {
        fala: 'Vou te ensinar em trinta segundos a fórmula desses vídeos que ninguém consegue parar de assistir.',
        clipes: [['aviao', 29], ['semaforo', 24.5]],
        titulo: ['A FÓRMULA DOS', 'VÍDEOS *"COMO FUNCIONA"*'],
        destaque: ['trinta', 'fórmula', 'ninguém'],
      },
      {
        fala: 'Passo um: comece com uma pergunta que todo mundo já se fez. Tipo: como o semáforo sabe que você chegou?',
        clipes: [['semaforo', 0.3], ['semaforo', 26]],
        cartao: ['PASSO 1', 'UMA PERGUNTA CURIOSA'],
        destaque: ['pergunta', 'semáforo'],
      },
      {
        fala: 'Passo dois: construa a resposta peça por peça. Então você põe isso... mas dá um problema... então você resolve.',
        clipes: [['freio', 19], ['freio', 27], ['microondas', 23]],
        cartao: ['PASSO 2', 'CONSTRUA PEÇA POR PEÇA'],
        destaque: ['peça', 'problema', 'resolve'],
      },
      {
        fala: 'Passo três: feche com uma curiosidade. É por isso que a janela do avião é redonda!',
        clipes: [['aviao', 44], ['aviao', 47.5]],
        cartao: ['PASSO 3', '"É POR ISSO QUE..."'],
        destaque: ['curiosidade', 'redonda'],
      },
      {
        fala: 'E o melhor: a inteligência artificial faz o vídeo inteiro com essa fórmula. Roteiro, cenário 3D, narração e música.',
        clipes: [['aula4', 30], ['geladeira', 30]],
        etiqueta: 'SEM CÂMERA • SEM EDIÇÃO',
        destaque: ['inteligência', 'inteiro', '3D'],
      },
      {
        fala: 'No curso Constrói Isso Aí, eu te mostro o passo a passo. Toque em saiba mais e faça o seu primeiro vídeo hoje.',
        clipes: [['aula2', 27], ['semaforo', 57]],
        botao: 'SAIBA MAIS',
        titulo: ['FAÇA O SEU', 'PRIMEIRO *VÍDEO HOJE*'],
        destaque: ['passo', 'saiba', 'hoje'],
      },
    ],
  },
};
