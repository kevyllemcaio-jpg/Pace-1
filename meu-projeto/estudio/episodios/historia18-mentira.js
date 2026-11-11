// HISTÓRIA 18 — 24 HORAS SEM MENTIR
historia({ visual: { pele: '#E2A77E', pele2: '#C98A62', cabelo: '#2B1D16', camisa: '#2FA45A' } });
const SOGRA = { pele: '#C98B62', pele2: '#A8714C', cabelo: '#3A2418', camisa: '#E86A5A' };
const choque = (lt, c, palavra) => { const t0 = c.w(palavra); som('carimbo', t0, 1); if (lt < t0 || lt > t0 + 0.5) return ''; return `<rect width="1080" height="1920" fill="#7FE0FF" opacity="${0.5 * (1 - (lt - t0) / 0.5)}"/><text x="540" y="560" text-anchor="middle" font-size="200">⚡</text>`; };
HS.push(
  ganchoH('Uma pulseira dá *choque* toda vez que ele mente. E hoje é o *almoço com a família da namorada*.', [['TOMO CHOQUE'], ['QUANDO MINTO'], ['NO ALMOÇO COM A SOGRA', '#F7C531']], { fundo: 'cozinha', extra: (lt, c) => (lt % 1.2 < 0.15 ? `<rect width="1080" height="1920" fill="#7FE0FF" opacity="0.35"/>` : '') }),
  corpoH('O Diego ganhou uma pulseira de presente. Disse que tinha adorado... e *tomou um choque*.', { pose: 'cintura', expr: 'sorrisao', troca: { palavra: 'choque', expr: 'panico', pose: 'cabeca' }, extra: (lt, c) => choque(lt, c, 'choque') }),
  closeH('No manual: ela só sai do braço depois de *vinte e quatro horas*.', { expr: 'surpreso', extra: (lt, c) => cardH(lt, c, { palavra: 'vinte', texto: 'TRAVADA POR 24H', emoji: '⌚' }) }),
  outroH('Meio-dia. A sogra serve o prato e pergunta: *gostou da comida*?', SOGRA, { fundo: 'cozinha', expr: 'sorrisao' }),
  closeH('A comida tava salgada. *Muito* salgada.', { fundo: 'cozinha', expr: 'sem_graca', suor: true, extra: (lt, c) => cardH(lt, c, { palavra: 'salgada', texto: 'SALGADA', emoji: '🧂', cor: '#E8344B' }) }),
  closeH('E a família inteira tá olhando, *esperando a resposta*.', { fundo: 'cozinha', expr: 'panico', suor: true }),
  votacaoH('O que ele fala? A: a verdade. B: mente e aguenta o choque.', { rotulo: 'FALA A VERDADE', emoji: '🗣️', expr: 'vergonha' }, { rotulo: 'MENTE E TOMA CHOQUE', emoji: '⚡', pose: 'cabeca', expr: 'panico' }),
  finalH('cozinha'),
);
fecharHistoria({ capa: capaH({ fundo: 'cozinha', l1: 'TOMO CHOQUE', l2: 'QUANDO EU MINTO ⚡', etiqueta: 'ALMOÇO COM A SOGRA' }) });
