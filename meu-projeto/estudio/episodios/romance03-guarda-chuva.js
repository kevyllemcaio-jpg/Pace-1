// ROMANCE DE ESCOLA 3 — O GUARDA-CHUVA
romance();
const NINA = (o) => chibi({ pele: '#F0C9A6', cabelo: { tipo: 'longo', cor: '#8A4A20' }, olhos: '#5A7AB0', roupa: { camisa: '#E86A9A', saia: '#3E5C93', calca: '#3E5C93', sapato: '#2A2238' }, semente: 2, ...o });
const BENTO = (o) => chibi({ pele: '#C98B62', cabelo: { tipo: 'baguncado', cor: '#2A1E18' }, olhos: '#5A3420', roupa: { camisa: '#2F6DB5', calca: '#2A2238', sapato: '#F4F4F4' }, semente: 9, ...o });
const GC = guardaChuva(0, -60, 0.55, '#F2577A');
RS.push(
  ganchoR('Um garoto me deu o guarda-chuva dele... e *saiu correndo na chuva*.', [['ELE ME DEU O'], ['GUARDA-CHUVA DELE...'], ['E SAIU NA CHUVA 🌧️', '#F7C531']], NINA, { fundo: 'chuva', vergonha: 0.8, expr: 'surpreso' }),
  closeR('Saída da escola. Chuva forte. E a Nina... *sem guarda-chuva*.', NINA, { fundo: 'chuva', expr: 'triste' }),
  duoR('Aí o Bento, do terceiro ano, colocou o guarda-chuva na mão dela... e saiu correndo *na chuva*.', NINA, BENTO, { fundo: 'chuva', exprA: 'surpreso', exprB: 'sorriso', bracoB: 'aponta', segA: GC, bracoA: 'segura' }),
  closeR('Ela nem conseguiu *agradecer*.', NINA, { fundo: 'chuva', expr: 'vergonha', vergonha: 1, braco: 'segura', segura: GC }),
  closeR('Em casa, ela viu: no cabo, um adesivo. *Bento, terceiro B*. E um número de telefone.', NINA, { fundo: 'quarto', expr: 'surpreso', extra: (lt, c) => cardH(lt, c, { palavra: 'bento', texto: '🏷️ BENTO · 3º B', y: 520 }) }),
  {
    fala: 'Ela digitou: oi, é a menina do guarda-chuva. *E apagou*. Escreveu de novo. Apagou de novo.',
    desenhar(lt, c) {
      const txt = 'oi, é a menina do guarda-chuva 🌂';
      const ciclo = (lt * 0.9) % 2;
      const n = ciclo < 1 ? Math.floor(ciclo * txt.length) : Math.floor((2 - ciclo) * txt.length);
      return fundoTela() + celularUI({ tela: 'chat', nome: 'Bento 3ºB', hora: '19:42', msgs: [] }) +
        `<rect x="90" y="1080" width="900" height="150" rx="40" fill="#FFFFFF" stroke="#2A2238" stroke-width="6"/><text x="130" y="1175" font-family="Oswald, sans-serif" font-size="50" fill="#111">${esc(txt.slice(0, n))}<tspan fill="#2D7FF9">|</tspan></text>`;
    },
  },
  closeR('No dia seguinte, ele faltou. *Gripado*. Por causa da chuva.', NINA, { fundo: 'patio', expr: 'triste', extra: (lt, c) => cardH(lt, c, { palavra: 'gripado', texto: '🤧 BENTO FALTOU', y: 520 }) }),
  votacaoR('O que a Nina faz? A: leva o guarda-chuva e uma sopa na casa dele. B: manda mensagem desejando melhoras.', { rotulo: 'LEVA SOPA NA CASA DELE', emoji: '🍲', quem: NINA, expr: 'determinado' }, { rotulo: 'MANDA MENSAGEM', emoji: '📱', quem: NINA, expr: 'vergonha', vergonha: 1 }),
  finalR(NINA),
);
fecharRomance({ capa: capaR({ fundo: 'chuva', quem: NINA, l1: 'O GUARDA-CHUVA', l2: 'ELE SAIU NA CHUVA 🌧️', etiqueta: 'BENTO · 3º B', extra: () => guardaChuva(820, 820, 1.0, '#F2577A', 12) }) });
