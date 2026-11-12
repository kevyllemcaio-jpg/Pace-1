// ROMANCE DE ESCOLA 3 — O GUARDA-CHUVA (protagonista: Bento)
romance({ voz: 'en-US-AndrewMultilingualNeural', velocidade: '+6%' });
const BENTO = (o) => chibi({ pele: '#C98B62', cabelo: { tipo: 'baguncado', cor: '#2A1E18' }, olhos: '#5A3420', roupa: { camisa: '#2F6DB5', calca: '#2A2238', sapato: '#F4F4F4' }, semente: 9, ...o });
const NINA = (o) => chibi({ pele: '#F0C9A6', cabelo: { tipo: 'longo', cor: '#8A4A20' }, olhos: '#5A7AB0', roupa: { camisa: '#E86A9A', saia: '#3E5C93', calca: '#3E5C93', sapato: '#2A2238' }, semente: 2, ...o });
const GC = guardaChuva(0, -60, 0.55, '#F2577A');
RS.push(
  ganchoR('Uma menina me deu o guarda-chuva dela... e *saiu correndo na chuva*.', [['ELA ME DEU O'], ['GUARDA-CHUVA DELA...'], ['E SAIU NA CHUVA 🌧️', '#F7C531']], BENTO, { fundo: 'chuva', vergonha: 0.8, expr: 'surpreso' }),
  closeR('Saída da escola. Chuva forte. E o Bento... *sem guarda-chuva*.', BENTO, { fundo: 'chuva', expr: 'triste' }),
  duoR('Aí a Nina, do terceiro ano, colocou o guarda-chuva na mão dele... e saiu correndo *na chuva*.', BENTO, NINA, { fundo: 'chuva', exprA: 'surpreso', exprB: 'sorriso', bracoB: 'aponta', segA: GC, bracoA: 'segura' }),
  closeR('Ele nem conseguiu *agradecer*.', BENTO, { fundo: 'chuva', expr: 'vergonha', vergonha: 1, braco: 'segura', segura: GC }),
  closeR('Em casa, ele viu: no cabo, um adesivo. *Nina, terceiro B*. E um número de telefone.', BENTO, { fundo: 'quarto', expr: 'surpreso', extra: (lt, c) => cardH(lt, c, { palavra: 'nina', texto: '🏷️ NINA · 3º B', y: 520 }) }),
  {
    fala: 'Ele digitou: oi, é o menino do guarda-chuva. *E apagou*. Escreveu de novo. Apagou de novo.',
    desenhar(lt, c) {
      const txt = 'oi, é o menino do guarda-chuva 🌂';
      const ciclo = (lt * 0.9) % 2;
      const n = ciclo < 1 ? Math.floor(ciclo * txt.length) : Math.floor((2 - ciclo) * txt.length);
      return fundoTela() + celularUI({ tela: 'chat', nome: 'Nina 3ºB', hora: '19:42', msgs: [] }) +
        `<rect x="90" y="1080" width="900" height="150" rx="40" fill="#FFFFFF" stroke="#2A2238" stroke-width="6"/><text x="130" y="1175" font-family="Oswald, sans-serif" font-size="50" fill="#111">${esc(txt.slice(0, n))}<tspan fill="#2D7FF9">|</tspan></text>`;
    },
  },
  closeR('No dia seguinte, ela faltou. *Gripada*. Por causa da chuva.', BENTO, { fundo: 'patio', expr: 'triste', extra: (lt, c) => cardH(lt, c, { palavra: 'gripada', texto: '🤧 NINA FALTOU', y: 520 }) }),
  votacaoR('O que o Bento faz? A: leva o guarda-chuva e uma sopa na casa dela. B: manda mensagem desejando melhoras.', { rotulo: 'LEVA SOPA NA CASA DELA', emoji: '🍲', quem: BENTO, expr: 'determinado' }, { rotulo: 'MANDA MENSAGEM', emoji: '📱', quem: BENTO, expr: 'vergonha', vergonha: 1 }),
  finalR(BENTO, 'roxo'),
);
fecharRomance({ capa: capaR({ fundo: 'chuva', quem: BENTO, l1: 'O GUARDA-CHUVA', l2: 'ELA SAIU NA CHUVA 🌧️', etiqueta: 'NINA · 3º B', extra: () => guardaChuva(820, 820, 1.0, '#F2577A', 12) }) });
