// ROMANCE DE ESCOLA 2 — DUPLA COM O RIVAL
romance();
const DUDA = (o) => chibi({ pele: '#C98B62', cabelo: { tipo: 'coque', cor: '#3A2418' }, olhos: '#5A3420', roupa: { camisa: '#F2C230', saia: '#3E5C93', calca: '#3E5C93', sapato: '#2A2238' }, semente: 4, ...o });
const CAIO = (o) => chibi({ pele: '#F2C6A0', cabelo: { tipo: 'curto', cor: '#2A1E18' }, olhos: '#3A6AB0', oculos: true, roupa: { camisa: '#4A90E2', calca: '#2A2238', sapato: '#F4F4F4' }, semente: 6, ...o });
function espuma(lt, t0) {
  if (lt < t0) return '';
  const k = lim((lt - t0) / 0.6);
  let s = '';
  for (let i = 0; i < 26; i++) { const r = aleatorio(i + 30), a = r() * Math.PI - Math.PI, d = k * (200 + r() * 420); s += `<circle cx="${545 + Math.cos(a) * d}" cy="${1300 + Math.sin(a) * d * 1.2}" r="${20 + r() * 34}" fill="#FFFFFF" stroke="#C0C8D8" stroke-width="4" opacity="${0.9 - k * 0.2}"/>`; }
  return s;
}
const vulcao = `<path d="M 380 1500 L 500 1260 L 590 1260 L 710 1500 Z" fill="#8A5A3C" stroke="#2A2238" stroke-width="7"/><ellipse cx="545" cy="1262" rx="48" ry="12" fill="#D93A3A"/>`;
RS.push(
  ganchoR('Eu tirei o meu maior rival como dupla... e agora *não paro de pensar nele*.', [['TIREI MEU RIVAL'], ['COMO DUPLA...'], ['E AGORA SÓ PENSO NELE', '#F7C531']], DUDA, { fundo: 'sala', vergonha: 1, expr: 'vergonha' }),
  closeR('A Duda e o Caio disputam a maior nota da sala desde o sexto ano. Placar atual: *noventa e oito a noventa e sete*.', DUDA, { fundo: 'sala', expr: 'determinado', extra: (lt, c) => cardH(lt, c, { palavra: 'noventa', texto: 'DUDA 98 × 97 CAIO', cor: '#C33A3A', y: 520 }) }),
  closeR('Aí a professora sorteou as duplas do trabalho de ciências. E saiu: *Duda... e Caio*.', DUDA, { fundo: 'sala', expr: 'neutro', troca: { palavra: 'caio', expr: 'raiva' }, extra: (lt, c) => cardH(lt, c, { palavra: 'caio', texto: '🎲 DUDA + CAIO', y: 520 }) }),
  duoR('Sábado, na casa dela, eles brigaram por tudo. A cor do vulcão. A letra do cartaz. *Até a régua*.', DUDA, CAIO, { fundo: 'quarto', exprA: 'raiva', exprB: 'raiva', falaA: true, falaB: true, extra: () => vulcao }),
  duoR('Aí o vulcão de bicarbonato explodiu. *Na cara dos dois*.', DUDA, CAIO, { fundo: 'quarto', exprA: 'surpreso', exprB: 'surpreso', extra: (lt, c) => tremor(vulcao + espuma(lt, c.w('cara') - 0.3), lt, c.w('cara') - 0.3, 14, 0.5) }),
  duoR('E pela primeira vez em seis anos... *eles riram juntos*.', DUDA, CAIO, { fundo: 'quarto', exprA: 'sorriso', exprB: 'sorriso', coracao: true }),
  closeR('Você ri bonito, sabia?', CAIO, { voz: VOZ_MENINO, expr: 'vergonha', vergonha: 1, fundo: 'quarto' }),
  closeR('A Duda não respondeu. Mas *ficou vermelha* até a hora dele ir embora.', DUDA, { fundo: 'quarto', expr: 'vergonha', vergonha: 1 }),
  votacaoR('E na segunda? A: ela conta tudo pras amigas. B: finge que nada aconteceu.', { rotulo: 'CONTA PRAS AMIGAS', emoji: '🗣️', quem: DUDA, expr: 'sorriso' }, { rotulo: 'FINGE QUE NADA ROLOU', emoji: '🙈', quem: DUDA, expr: 'vergonha', vergonha: 1 }),
  finalR(DUDA),
);
fecharRomance({ capa: capaR({ fundo: 'roxo', quem: DUDA, l1: 'DUPLA COM O RIVAL', l2: 'E AGORA? 😳', etiqueta: '98 × 97' }) });
