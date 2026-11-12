// DO FUNDO DO POÇO — Episódio 1 (série de transformação, o público escolhe cada passo)
// Cadu (26) perdeu emprego, namorada e apartamento no mesmo mês e se largou por um ano.
// No ônibus, devolve o caderno da Clara; ela sorri pra ele. No caderno: sarau, sábado, 19h. Faltam 5 dias.
historia({ visual: { pele: '#C9946A', pele2: '#A8714C', cabelo: '#3A2A22', camisa: '#6A6A5A', cabeludo: true, barbao: true, sujo: true, olheira: true, moscas: true, rasgado: true } });
const CLARA = { pele: '#F0C9A6', pele2: '#D9AA86', cabelo: '#7A3A2A', camisa: '#E8A0B8', longo: true, cilios: true, batom: true, cabeludo: false, barbao: false, sujo: false, olheira: false, moscas: false, rasgado: false };
const V_CADU = 'en-US-BrianMultilingualNeural';
function medidor(pct, lt, novo = false) {
  const g = `<rect x="90" y="100" width="900" height="130" rx="24" fill="#15131A" stroke="#fff" stroke-width="5"/>` +
    `<text x="130" y="150" font-family="Baloo, sans-serif" font-weight="800" font-size="34" fill="#fff">PRONTO PRA CLARA 💗</text>` +
    `<text x="950" y="150" text-anchor="end" font-family="Baloo, sans-serif" font-weight="800" font-size="34" fill="#F7C531">FALTAM 5 DIAS</text>` +
    `<rect x="130" y="172" width="700" height="30" rx="15" fill="#33303D"/><rect x="130" y="172" width="${Math.max(30, 700 * pct / 100)}" height="30" rx="15" fill="#F2577A"/>` +
    `<text x="950" y="200" text-anchor="end" font-family="Anton, sans-serif" font-size="46" fill="#F2577A">${pct}%</text>`;
  return pulo(g, lt + (novo ? 0 : 10), 540, 165, 0.1);
}
const onibus = (lt) => `<rect width="1080" height="1920" fill="#D9DEE6"/>` +
  [0, 1, 2].map((i) => `<rect x="${60 + i * 340}" y="260" width="300" height="420" rx="30" fill="#9FC8E8" stroke="#2A2238" stroke-width="10"/><g transform="translate(${-((lt * 260 + i * 300) % 1200) + 1100} 560)"><rect x="0" y="-160" width="120" height="160" fill="#B8C8D8"/></g>`).join('') +
  `<rect y="700" width="1080" height="30" fill="#8A93A0"/><rect x="0" y="420" width="1080" height="14" fill="#C9A24A"/><rect y="1400" width="1080" height="520" fill="#5A6070"/>` +
  [180, 900].map((x) => `<rect x="${x}" y="0" width="16" height="1400" fill="#C9C9CF" stroke="#2A2238" stroke-width="4"/>`).join('');
const caderno = (lt, c, palavra) => {
  const t0 = c.w(palavra); if (lt < t0) return '';
  return pulo(`<g transform="translate(540 600) rotate(-5)"><rect x="-260" y="-220" width="520" height="440" rx="14" fill="#F2A0B8" stroke="#2A2238" stroke-width="8"/><rect x="-230" y="-190" width="460" height="380" rx="8" fill="#FFF9EE"/>` +
    `<text x="0" y="-110" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="64" fill="#7A3A2A">Clara ♡</text>` +
    `<text x="0" y="-10" text-anchor="middle" font-family="Caveat, cursive" font-size="50" fill="#2A2238">sarau de poesia</text>` +
    `<text x="0" y="60" text-anchor="middle" font-family="Caveat, cursive" font-size="50" fill="#2A2238">sábado · 19h</text>` +
    `<text x="0" y="130" text-anchor="middle" font-family="Caveat, cursive" font-size="44" fill="#2A2238">Café Aurora</text></g>`, lt, 540, 600, t0);
};
HS.push(
  ganchoH('Ela sorriu pra mim... *mesmo eu estando assim*.', [['ELA SORRIU PRA MIM...'], ['MESMO EU'], ['ESTANDO ASSIM 💗', '#F7C531']], { fundo: onibus, expr: 'vergonha' }),
  closeH('Esse é o Cadu. Vinte e seis anos. Um ano atrás, ele perdeu o emprego, a namorada e o apartamento. *No mesmo mês*.', { fundo: 'rua', expr: 'triste', extra: (lt, c) => cardH(lt, c, { palavra: 'emprego', texto: '💼 ❌   💔 ❌   🏠 ❌', y: 520 }) }),
  corpoH('Desde então, ele desistiu de si mesmo. Cabelo de um ano. Barba de um ano. E a mesma camiseta... *há três semanas*.', { fundo: 'rua', pose: 'base', expr: 'triste', extra: (lt, c) => cardH(lt, c, { palavra: 'três', texto: '👕 MESMA CAMISETA: 21 DIAS', cor: '#C33A3A', y: 520 }) }),
  corpoH('Segunda de manhã. Ônibus lotado. As pessoas se afastavam dele... *sem disfarçar*.', { fundo: onibus, pose: 'base', expr: 'vergonha' }),
  duploH('Aí uma moça deixou cair um caderno. Ele pegou e devolveu. E ela... *sorriu*.', CLARA, { fundo: onibus, exprA: 'vergonha', exprB: 'feliz', extra: (lt, c) => (lt > c.w('sorriu') ? coracoes(lt) : '') }),
  { fala: 'Obrigada, moço. Tenha um ótimo dia.', voz: 'mulher', desenhar: (lt) => onibus(lt) + kyleClose({ x: 540, y: 1000, esc: 1.55, expr: 'feliz', fala: true, t: lt, visual: { oculos: false, fone: false, estampa: false, ...CLARA }, barba: false }) },
  closeH('Fazia um ano que ninguém olhava nos olhos dele. *E ela olhou*.', { fundo: onibus, expr: 'vergonha', extra: (lt) => coracoes(lt) }),
  closeH('Ela desceu. E só depois ele viu: o caderno tinha ficado com ele. Na capa, um nome: *Clara*. E um convite.', { fundo: onibus, expr: 'surpreso', extra: (lt, c) => caderno(lt, c, 'clara') }),
  closeH('Sarau de poesia. Sábado, sete da noite. *Faltam cinco dias*. E hoje ele tá só três por cento pronto.', { fundo: 'rua', expr: 'determinado', extra: (lt, c) => medidor(3, lt, true) }),
  { fala: 'Eu vou devolver esse caderno. Mas não assim.', voz: V_CADU, desenhar: (lt) => fundo('rua', lt) + kyleClose({ x: 540, y: 1000, esc: 1.55, expr: 'determinado', fala: true, t: lt }) + medidor(3, lt) },
  votacaoH('Por onde ele começa? A: banho, barbearia e cortar o cabelo. B: arrumar um emprego primeiro.', { rotulo: 'BARBEARIA E CABELO', emoji: '💈', pose: 'cintura', expr: 'determinado' }, { rotulo: 'ARRUMAR UM EMPREGO', emoji: '💼', pose: 'aponta', expr: 'determinado' }),
  finalH('rua'),
);
fecharHistoria({ capa: capaH({ fundo: onibus, expr: 'vergonha', l1: 'DO FUNDO DO POÇO', l2: 'ATÉ ELA EM 5 DIAS 💗', etiqueta: 'PRONTO: 3%' }) });
