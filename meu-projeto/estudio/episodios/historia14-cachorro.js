// HISTÓRIA 14 — TROQUEI DE CORPO COM O CACHORRO
historia({ visual: { pele: '#E2A77E', pele2: '#C98A62', cabelo: '#5A3A24', camisa: '#FFFFFF' } });
function cachorro(x, y, esc = 1, expr = 'neutro', t = 0) {
  const pisca = (t % 3.3) < 0.12;
  let s = `<g transform="translate(${x} ${y}) scale(${esc})">`;
  s += `<path d="M -150 -120 Q -230 -60 -190 80 Q -160 120 -130 40 Z" fill="#6B4228" stroke="#1F1A24" stroke-width="9"/><path d="M 150 -120 Q 230 -60 190 80 Q 160 120 130 40 Z" fill="#6B4228" stroke="#1F1A24" stroke-width="9"/>`;
  s += `<ellipse cx="0" cy="0" rx="160" ry="170" fill="#C98A4E" stroke="#1F1A24" stroke-width="9"/><ellipse cx="0" cy="80" rx="100" ry="80" fill="#F2DCC0" stroke="#1F1A24" stroke-width="7"/>`;
  for (const l of [-1, 1]) s += pisca ? `<path d="M ${l * 60 - 22} -30 Q ${l * 60} -42 ${l * 60 + 22} -30" fill="none" stroke="#1F1A24" stroke-width="8"/>` : `<circle cx="${l * 60}" cy="-30" r="${expr === 'panico' ? 30 : 24}" fill="#fff" stroke="#1F1A24" stroke-width="6"/><circle cx="${l * 60}" cy="-26" r="12" fill="#1F1A24"/>`;
  s += `<ellipse cx="0" cy="40" rx="34" ry="24" fill="#1F1A24"/>`;
  s += expr === 'panico' ? `<ellipse cx="0" cy="110" rx="26" ry="30" fill="#6E2430" stroke="#1F1A24" stroke-width="6"/>` : `<path d="M -40 100 Q 0 130 40 100" fill="none" stroke="#1F1A24" stroke-width="7"/><path d="M -14 112 Q 0 160 14 112" fill="#E8344B" stroke="#1F1A24" stroke-width="5"/>`;
  return s + `</g>`;
}
const cenaCachorro = (fala, { fundo: f = 'quartoN', expr = 'neutro', extra } = {}) => ({ fala, desenhar(lt, c) { let s = fundo(f, lt) + cachorro(540, 1000 + Math.sin(lt * 3) * 8, 1.6, expr, lt); if (extra) s += extra(lt, c); return s; } });
H.push(
  ganchoH('Ele acordou no corpo do *cachorro*. E o cachorro foi trabalhar *no lugar dele*.', [['ACORDEI NO CORPO'], ['DO MEU CACHORRO'], ['E ELE FOI TRABALHAR', '#F7C531']], { close: false, pose: 'comemora', expr: 'sorrisao', fundo: 'quartoN', extra: (lt) => cachorro(820, 1650, 0.7, 'panico', lt) }),
  cenaCachorro('O Henrique acordou, foi falar bom dia... e saiu um *latido*.', { expr: 'panico', extra: (lt, c) => cardH(lt, c, { palavra: 'latido', texto: 'AU AU?!', emoji: '🐶', cor: '#E8344B' }) }),
  corpoH('No espelho, o corpo dele tava de gravata, tomando café... e *abanando o braço* igual rabo.', { pose: 'comemora', expr: 'sorrisao' }),
  corpoH('O corpo dele pegou o crachá e *foi trabalhar*.', { fundo: 'escritorio', pose: 'base', expr: 'sorrisao', anda: true }),
  chatH('Meio-dia, mensagem do chefe: o Henrique tá diferente hoje. Cheirou o cliente... e *fechou o contrato*.', { nome: 'Chefe', hora: '12:00', msgs: [{ de: 'ela', txt: 'henrique tá diferente hoje' }, { de: 'ela', txt: 'cheirou o cliente kkkk', em: 'cheirou' }, { de: 'ela', txt: 'e FECHOU o contrato 🤝', em: 'fechou' }] }),
  cenaCachorro('E o Henrique de verdade? Preso em casa, sem polegar... *vendo o chefe promover o cachorro*.', { expr: 'neutro', extra: (lt, c) => cardH(lt, c, { palavra: 'promover', texto: 'PROMOVIDO', emoji: '🏆' }) }),
  votacaoH('O que ele faz? A: tenta destrocar hoje. B: deixa o cachorro trabalhar mais um pouco.', { rotulo: 'DESTROCA HOJE', emoji: '🔄' }, { rotulo: 'DEIXA O CACHORRO', emoji: '🐶', pose: 'comemora', expr: 'sorrisao' }),
  finalH('quartoN'),
);
fecharHistoria({ capa: capaH({ fundo: 'quartoN', expr: 'sorrisao', l1: 'VIREI MEU CACHORRO', l2: 'E ELE FOI TRABALHAR 🐶', etiqueta: 'AU AU', extra: () => cachorro(830, 760, 0.6, 'panico', 0.5) }) });
