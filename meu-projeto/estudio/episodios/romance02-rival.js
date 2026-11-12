// ROMANCE DE ESCOLA 2 — DUPLA COM A RIVAL (protagonista: Caio)
romance({ voz: 'en-US-AndrewMultilingualNeural', velocidade: '+6%' });
const CAIO = (o) => chibi({ pele: '#F2C6A0', cabelo: { tipo: 'curto', cor: '#2A1E18' }, olhos: '#3A6AB0', oculos: true, roupa: { camisa: '#4A90E2', calca: '#2A2238', sapato: '#F4F4F4' }, semente: 6, ...o });
const DUDA = (o) => chibi({ pele: '#C98B62', cabelo: { tipo: 'coque', cor: '#3A2418' }, olhos: '#5A3420', roupa: { camisa: '#F2C230', saia: '#3E5C93', calca: '#3E5C93', sapato: '#2A2238' }, semente: 4, ...o });
function espuma(lt, t0) {
  if (lt < t0) return '';
  const k = lim((lt - t0) / 0.6);
  let s = '';
  for (let i = 0; i < 26; i++) { const r = aleatorio(i + 30), a = r() * Math.PI - Math.PI, d = k * (200 + r() * 420); s += `<circle cx="${545 + Math.cos(a) * d}" cy="${1300 + Math.sin(a) * d * 1.2}" r="${20 + r() * 34}" fill="#FFFFFF" stroke="#C0C8D8" stroke-width="4" opacity="${0.9 - k * 0.2}"/>`; }
  return s;
}
const vulcao = `<path d="M 380 1500 L 500 1260 L 590 1260 L 710 1500 Z" fill="#8A5A3C" stroke="#2A2238" stroke-width="7"/><ellipse cx="545" cy="1262" rx="48" ry="12" fill="#D93A3A"/>`;
RS.push(
  ganchoR('Eu tirei a minha maior rival como dupla... e agora *não paro de pensar nela*.', [['TIREI MINHA RIVAL'], ['COMO DUPLA...'], ['E AGORA SÓ PENSO NELA', '#F7C531']], CAIO, { fundo: 'sala', vergonha: 1, expr: 'vergonha' }),
  closeR('O Caio e a Duda disputam a maior nota da sala desde o sexto ano. Placar atual: *noventa e oito a noventa e sete*. Pra ela.', CAIO, { fundo: 'sala', expr: 'determinado', extra: (lt, c) => cardH(lt, c, { palavra: 'noventa', texto: 'DUDA 98 × 97 CAIO', cor: '#C33A3A', y: 520 }) }),
  closeR('Aí a professora sorteou as duplas do trabalho de ciências. E saiu: *Caio... e Duda*.', CAIO, { fundo: 'sala', expr: 'neutro', troca: { palavra: 'duda', expr: 'raiva' }, extra: (lt, c) => cardH(lt, c, { palavra: 'duda', texto: '🎲 CAIO + DUDA', y: 520 }) }),
  duoR('Sábado, na casa dele, eles brigaram por tudo. A cor do vulcão. A letra do cartaz. *Até a régua*.', CAIO, DUDA, { fundo: 'quarto', exprA: 'raiva', exprB: 'raiva', falaA: true, falaB: true, extra: () => vulcao }),
  duoR('Aí o vulcão de bicarbonato explodiu. *Na cara dos dois*.', CAIO, DUDA, { fundo: 'quarto', exprA: 'surpreso', exprB: 'surpreso', extra: (lt, c) => tremor(vulcao + espuma(lt, c.w('cara') - 0.3), lt, c.w('cara') - 0.3, 14, 0.5) }),
  duoR('E pela primeira vez em seis anos... *eles riram juntos*.', CAIO, DUDA, { fundo: 'quarto', exprA: 'sorriso', exprB: 'sorriso', coracao: true }),
  closeR('Você ri bonito, sabia?', DUDA, { voz: 'mulher', expr: 'vergonha', vergonha: 1, fundo: 'quarto' }),
  closeR('O Caio não respondeu. Mas *ficou vermelho* até a hora dela ir embora.', CAIO, { fundo: 'quarto', expr: 'vergonha', vergonha: 1 }),
  votacaoR('E na segunda? A: ele conta tudo pros amigos. B: finge que nada aconteceu.', { rotulo: 'CONTA PROS AMIGOS', emoji: '🗣️', quem: CAIO, expr: 'sorriso' }, { rotulo: 'FINGE QUE NADA ROLOU', emoji: '🙈', quem: CAIO, expr: 'vergonha', vergonha: 1 }),
  finalR(CAIO, 'roxo'),
);
fecharRomance({ capa: capaR({ fundo: 'roxo', quem: CAIO, l1: 'DUPLA COM A RIVAL', l2: 'E AGORA? 😳', etiqueta: '98 × 97' }) });
