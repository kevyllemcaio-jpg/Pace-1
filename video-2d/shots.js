// Roteiro e cenas do vídeo. Cada "shot" tem um tempo (em segundos), a cena de fundo, a legenda,
// quem fala (boy = o menino; avo = a senhora) e o que aparece na barra do topo.
// Mesma ideia do vídeo "E se o Sol virasse um buraco negro?": o Sol vira buraco negro, a Terra continua
// na órbita, mas a luz e o frio levam oito minutos e um pouco mais para chegar.
window.SHOTS = [
  { t0: 0.0,  t1: 3.1,  cena: 'sol',     quem: 'boy', fala: 'E se o Sol virasse um buraco negro agora?',
    cap: 'E SE O <em>SOL</em> VIROSSE UM <em>BURACO NEGRO</em> AGORA?', hud: ['SOL', 'ESTÁVEL'] },
  { t0: 3.3,  t1: 5.2,  cena: 'colapso',  quem: 'boy', fala: 'A Terra ia ser engolida?',
    cap: 'A TERRA IA SER <em>ENGOLIDA</em>?', hud: ['SOL', 'COLAPSANDO'] },
  { t0: 5.4,  t1: 6.2,  cena: 'orbita',   quem: 'avo', fala: 'Não.',
    cap: 'NÃO.', hud: ['TERRA', 'ÓRBITA MANTIDA'] },
  { t0: 6.3,  t1: 9.2,  cena: 'orbita',   quem: 'avo', fala: 'Ela continua girando no mesmo caminho.',
    cap: 'ELA CONTINUA NO <em>MESMO CAMINHO</em>', hud: ['TERRA', 'ÓRBITA MANTIDA'] },
  { t0: 9.4,  t1: 14.6, cena: 'puxao',    quem: 'boy', fala: 'O buraco teria a mesma massa do Sol, então puxaria a Terra com a mesma força.',
    cap: 'MESMA <em>MASSA</em>, MESMO <em>PUXÃO</em>', hud: ['PUXÃO', 'IGUAL AO SOL'] },
  { t0: 14.8, t1: 18.9, cena: 'escala',   quem: 'boy', fala: 'Só que o Sol inteiro ia caber numa bola de uns seis quilômetros.',
    cap: 'CABERIA NUMA BOLA DE <em>6 KM</em>', hud: ['SOL CABE EM', '6 KM'] },
  { t0: 19.2, t1: 21.2, cena: 'orbita',   quem: 'avo', fala: 'Mas o problema não é o puxão.',
    cap: 'MAS O PROBLEMA NÃO É O <em>PUXÃO</em>', hud: ['TERRA', 'ÓRBITA MANTIDA'] },
  { t0: 21.6, t1: 25.1, cena: 'luz',      quem: 'boy', fala: 'É que a luz do Sol leva oito minutos pra chegar aqui.',
    cap: 'A LUZ LEVA <em>OITO MINUTOS</em>', hud: ['LUZ DO SOL', '8 MIN 20 S'] },
  { t0: 25.3, t1: 28.5, cena: 'dia',      quem: 'avo', fala: 'Então, por oito minutos, o dia continua.',
    cap: 'O DIA <em>CONTINUA</em>', hud: ['DIA', 'NORMAL'] },
  { t0: 29.0, t1: 30.9, cena: 'noite',    quem: 'avo', fala: 'Depois, escuridão.',
    cap: 'DEPOIS, <em>ESCURIDÃO</em>', hud: ['LUZ', 'ZERO'] },
  { t0: 31.6, t1: 34.5, cena: 'gelo',     quem: 'avo', fala: 'E sem luz, o mar começa a congelar.',
    cap: 'O MAR COMEÇA A <em>CONGELAR</em>', hud: ['TEMPERATURA', 'CAINDO'] },
  { t0: 34.8, t1: 38.4, cena: 'volta',    quem: 'boy', fala: 'Calma: o Sol é leve demais pra virar buraco negro.',
    cap: 'O SOL É <em>LEVE DEMAIS</em>', hud: ['SOL', 'DE VOLTA'] },
  { t0: 38.6, t1: 42.2, cena: 'fim',      quem: 'boy', fala: 'E você, ia perceber nos primeiros oito minutos?',
    cap: 'E VOCÊ, IA PERCEBER NOS PRIMEIROS <em>OITO MINUTOS</em>?', hud: ['DIA', 'NORMAL'] },
];
window.TOTAL = 44.0;
