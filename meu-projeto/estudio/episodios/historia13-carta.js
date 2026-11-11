// HISTÓRIA 13 — A CARTA DE 1998
historia({ visual: { pele: '#8A5A3C', pele2: '#6E452C', cabelo: '#1E1612', camisa: '#F2C230' } });
const cartaVelha = (lt, c, palavra) => {
  const t0 = c.w(palavra);
  if (lt < t0) return '';
  return pulo(`<g transform="translate(540 600) rotate(-5)"><rect x="-260" y="-200" width="520" height="400" rx="10" fill="#E8D9B0" stroke="#1F1A24" stroke-width="8"/>` +
    [-120, -60, 0, 60, 120].map((y) => `<line x1="-200" y1="${y}" x2="200" y2="${y}" stroke="#B5A07A" stroke-width="5"/>`).join('') +
    `<text x="0" y="-140" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="48" fill="#6B4228">11/11 · MATHEUS</text></g>`, lt, 540, 600, t0);
};
H.push(
  ganchoH('Ele achou uma carta enterrada no quintal. Endereçada a ele. Com a data de *hoje*.', [['ACHEI UMA CARTA DE 1998'], ['ENDEREÇADA A MIM'], ['COM A DATA DE HOJE', '#F7C531']], { fundo: 'quintal' }),
  corpoH('O Matheus cavou o quintal pra plantar uma árvore. A pá bateu numa *lata*.', { fundo: 'quintal', pose: 'base', expr: 'determinado', troca: { palavra: 'lata', expr: 'surpreso' } }),
  closeH('Dentro, uma carta de mil novecentos e noventa e oito. Ele nasceu em *dois mil*.', { fundo: 'quintal', expr: 'surpreso', extra: (lt, c) => cartaVelha(lt, c, 'dentro') }),
  closeH('Escrito: Matheus, onze de novembro. *Não atende o telefone* às três da tarde.', { fundo: 'quintal', expr: 'panico', suor: true, extra: (lt, c) => cardH(lt, c, { palavra: 'atende', texto: 'NÃO ATENDE ÀS 15H', emoji: '📵', cor: '#E8344B' }) }),
  closeH('São duas e cinquenta e nove. E o celular *começa a tocar*.', { fundo: 'quintal', expr: 'neutro', troca: { palavra: 'tocar', expr: 'panico', suor: true, tremer: true }, relogio: '14:59' }),
  votacaoH('O que ele faz? A: atende. B: deixa tocar.', { rotulo: 'ATENDE', emoji: '📞', pose: 'celular', expr: 'determinado' }, { rotulo: 'DEIXA TOCAR', emoji: '🔇' }),
  finalH('quintal'),
);
fecharHistoria({ capa: capaH({ fundo: 'quintal', l1: 'CARTA DE 1998', l2: 'COM O MEU NOME ✉️', etiqueta: 'NÃO ATENDE' }) });
