// ALÉM DO PORTAL — Episódio 01: O DIA EM QUE DESAPARECEMOS (anime isekai original, ~7 min)
// Lucas e Helena (17) saem da escola no pôr do sol, entram numa construção abandonada perto da floresta,
// tocam um símbolo mágico e acordam num mundo de fantasia. Uma criatura escamada os persegue,
// uma aventureira os salva... e, num castelo sombrio, alguém já esperava pelos "dois escolhidos".
// Sem narrador: a história é contada pelas falas.

window.LEGENDA_FRASE = true;
window.LEGENDA_Y = 1640;
window.FONTE_LEGENDA = 'Baloo, sans-serif';
window.TRATAR_VOZ = 'seco';
window.ENCURTAR_PAUSAS = true;
window.TRILHA = 'calma';

// ---------- elenco (visual fixo) ----------
const UNIF = { farda: '#2A3A5A', farda2: '#1E2A44', gravata: '#C8283C' };
const CH = {
  lucas: { id: 'lucas', ...UNIF, cabelo: { tipo: 'espetado', cor: '#3A2418', sombra: '#22140C', luz: '#B08060', sobrancelha: '#22140C' }, olhos: '#2E6FD8', olhos2: '#A8E0FF', semente: 1 },
  helena: { id: 'helena', ...UNIF, cabelo: { tipo: 'longo', cor: '#6A3E22', sombra: '#4A2814', luz: '#D8A070', sobrancelha: '#4A2814' }, olhos: '#2E9A4A', olhos2: '#B8F0B0', semente: 2 },
  lyra: { id: 'lyra', farda: '#6A4A30', farda2: '#4A321E', gravata: '#5A2440', cabelo: { tipo: 'longo', cor: '#DDE2F2', sombra: '#A8B0C8', luz: '#FFFFFF', sobrancelha: '#8A90A8' }, olhos: '#8A5AD8', olhos2: '#E0C8FF', semente: 3 },
  vilao: { id: 'vilao', farda: '#120E18', farda2: '#08060C', gravata: '#120E18', pele: '#E8D2CC', pele2: '#D8BCB4', cabelo: { tipo: 'longo', cor: '#141018', sombra: '#08060C', luz: '#5A4A7A', sobrancelha: '#08060C' }, olhos: '#C82030', olhos2: '#FF8A8A', semente: 4 },
};
const V = {
  lucas: { voz: { voz: 'pt-BR-AntonioNeural', velocidade: '+10%' }, cor: '#7FC8FF', rotulo: 'LUCAS' },
  helena: { voz: { voz: 'pt-BR-ThalitaMultilingualNeural', velocidade: '+6%' }, cor: '#9BE89B', rotulo: 'HELENA' },
  lyra: { voz: { voz: 'pt-BR-FranciscaNeural', velocidade: '+2%' }, cor: '#D8B8FF', rotulo: 'AVENTUREIRA' },
  vilao: { voz: { voz: 'pt-BR-AntonioNeural', velocidade: '-8%', tom: '-4Hz' }, cor: '#FF6A6A', rotulo: '???' },
};
const E = [];
const falando = (c, lt) => !!c.fala && c.tempos && c.tempos.length > 0 && lt > c.tempos[0] - 0.05 && lt < c.tempos[c.tempos.length - 1] + 0.3;
function busto(id, lt, o = {}) { return animeBusto({ ...CH[id], t: lt + (CH[id].semente || 0), x: 540, y: 1000, esc: 1.25, ...o }); }

// Cena com fala. tipo: 'close' (quem fala, sozinho), 'dupla' (Lucas à esq., Helena à dir.), ou desenhar próprio.
function F(quem, fala, fundo, o = {}) {
  const v = V[quem];
  E.push({
    fala, dur: o.dur || 0.5, voz: v.voz, corLegenda: v.cor, rotulo: v.rotulo, trilha: o.trilha,
    desenhar(lt, c) {
      if (o.sons) o.sons(lt, c);
      const fl = falando(c, lt);
      let s = fundo(lt, c);
      if (o.desenhar) s += o.desenhar(lt, c, fl);
      else if ((o.tipo || 'close') === 'dupla') {
        const fxL = quem === 'lucas' ? 1.0 : 0.88, fxH = quem === 'helena' ? 1.0 : 0.88;
        s += busto('lucas', lt, { x: 290, y: 1130, esc: 0.86 * fxL, expr: o.eL || 'neutro', fala: quem === 'lucas' && fl, olhar: [0.5, 0], rim: o.rim, corar: o.corarL });
        s += busto('helena', lt, { x: 800, y: 1130, esc: 0.86 * fxH, expr: o.eH || 'neutro', fala: quem === 'helena' && fl, olhar: [-0.5, 0], rim: o.rim, corar: o.corarH });
      } else {
        s += busto(o.quem || quem, lt, { expr: o.e || 'neutro', fala: fl, olhar: o.olhar || [0, 0], rim: o.rim, corar: o.corar, x: o.x || 540, y: o.y || 1000, esc: o.esc || 1.25, brilho: o.brilho });
      }
      if (o.extra) s += o.extra(lt, c);
      s = o.semCam ? s : camLenta(s, lt, c.dur, { z0: 1, z1: o.zoom || 1.05, cx: 540, cy: 900, soco: false });
      if (o.tremer) s = `<g transform="translate(${Math.sin(lt * 61) * o.tremer} ${Math.cos(lt * 53) * o.tremer})">${s}</g>`;
      return s + (o.final ? o.final(lt, c) : '') + acabamento('#000', o.vinheta ?? 0.45);
    },
  });
}
// Cena sem fala (plano de ambiente / ação).
function A(dur, desenhar, extra = {}) { E.push({ dur, desenhar: (lt, c) => desenhar(lt, c) + acabamento('#000', extra.vinheta ?? 0.4), ...extra }); }
const entra = (lt, c, s = 0.4) => `<rect width="1080" height="1920" fill="#000" opacity="${(1 - lim(lt / s)).toFixed(3)}"/>`;
const sai = (lt, c, s = 0.5) => `<rect width="1080" height="1920" fill="#000" opacity="${(1 - lim((c.dur - lt) / s)).toFixed(3)}"/>`;

const ESC = (lt) => ikEscola(lt);
const borrado = (id, lt, fn, d = 6) => fundoCache(id, lt, (t) => `<defs><filter id="b${id}"><feGaussianBlur stdDeviation="${d}"/></filter></defs><g filter="url(#b${id})">${fn(t)}</g>`);
const ESCb = (lt) => borrado('esc', lt, (t) => ikEscola(t));
const CAM = (lt) => ikCaminho(lt);
const CAMb = (lt) => borrado('cam', lt, (t) => ikCaminho(t));
const RUI = (forca) => (lt) => borrado('rui' + forca, lt, (t) => ikRuinaDentro(t, { forca }), 4);
const MUN = (lt) => borrado('mun', lt, (t) => ikMundo(t), 5);
const FLO = (escuro = 0) => (lt) => borrado('flo' + escuro, lt, (t) => ikFloresta(t, { escuro }), 5);
const POR = '#FFB070', VERDE = '#7FFFE0', BRANCO = '#FFFFFF', ROXO = '#B890FF';

// ================= CENA 1 — A ESCOLA =================
A(6, (lt, c) => { som('sino', 0.3, 0.8); return camLenta(ikEscola(lt), lt, c.dur, { z0: 1.12, z1: 1.0, cy: 800, soco: false }) + entra(lt, c, 1); }, { trilha: 'calma' });
A(4.5, (lt) => {
  const hx = mix(760, 620, lim(lt / 3));
  return camLenta(ikEscola(lt, { alunos: true }) + ikPessoaMini(380, 1560, 0.42, lt, { cabelo: '#3A2418' }) + ikPessoaMini(hx, 1500, 0.4, lt, { cabelo: '#6A3E22', longo: true, saia: true, andar: lt < 3, dir: -1 }), lt, 4.5, { z0: 1, z1: 1.08, cx: 500, cy: 1300, soco: false });
});
F('helena', 'Lucas! Você ficou me esperando de novo?', ESCb, { e: 'sorriso', rim: POR });
F('lucas', 'Claro. Alguém tem que garantir que a gênia da sala chegue viva em casa.', ESCb, { e: 'sorriso', rim: POR });
F('helena', 'Gênia da sala? Você dormiu na aula de história inteira.', ESCb, { tipo: 'dupla', eH: 'determinado', eL: 'surpreso', rim: POR });
F('lucas', 'Eu tava pensando. De olhos fechados. É uma técnica avançada.', ESCb, { tipo: 'dupla', eL: 'determinado', eH: 'neutro', rim: POR });
F('helena', 'Técnica avançada de babar no caderno?', ESCb, { e: 'sorriso', rim: POR, zoom: 1.1 });
F('lucas', 'Isso foi um ataque pessoal, Helena.', ESCb, { e: 'triste', rim: POR });
F('helena', 'E na prova de matemática, você tirou quanto mesmo?', ESCb, { tipo: 'dupla', eH: 'sorriso', eL: 'neutro', rim: POR });
F('lucas', 'Próxima pergunta.', ESCb, { e: 'determinado', olhar: [0.8, 0], rim: POR, dur: 1.8 });
F('helena', 'Seis. Ele tirou seis.', ESCb, { e: 'sorriso', rim: POR });
F('lucas', 'Seis e meio! O meio é muito importante!', ESCb, { e: 'grito', rim: POR, tremer: 4 });
// abertura
A(6.5, (lt, c) => {
  som('impacto', 0.2, 0.9);
  let s = camLenta(ikEscola(lt, { alunos: false }), lt, c.dur, { z0: 1.0, z1: 1.1, cy: 700, soco: false }) + `<rect width="1080" height="1920" fill="#1A0E30" opacity="0.55"/>`;
  s += ikParticulas(lt, 40, { cx: 540, cy: 1700, cores: ['#9FD0FF', '#C8A0FF', '#FFE0B0'] });
  const k = 0.9 + 0.1 * suave(lt / 1);
  s += `<g opacity="${lim(lt / 0.6) * (1 - lim((lt - 5.8) / 0.6))}" transform="translate(540 900) scale(${k}) translate(-540 -900)">` +
    `<text x="540" y="880" text-anchor="middle" font-family="Anton, sans-serif" font-size="150" fill="#FFFFFF" stroke="#2A1A5A" stroke-width="14" paint-order="stroke" letter-spacing="6">ALÉM DO PORTAL</text>` +
    `<rect x="240" y="925" width="600" height="6" fill="#B890FF"/>` +
    `<text x="540" y="1000" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="44" fill="#E8DCFF" letter-spacing="5">EPISÓDIO 01</text>` +
    `<text x="540" y="1060" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="46" fill="#FFFFFF" letter-spacing="3">O DIA EM QUE DESAPARECEMOS</text></g>`;
  return s;
}, { trilha: 'epica' });
F('helena', 'Vamos logo, o sol já tá se pondo. Minha mãe me mata se eu chegar tarde de novo.', ESCb, { tipo: 'dupla', eH: 'neutro', eL: 'sorriso', rim: POR, trilha: 'calma' });
F('lucas', 'Pelo atalho perto da floresta, a gente chega em dez minutos.', ESCb, { tipo: 'dupla', eL: 'sorriso', eH: 'neutro', rim: POR });
F('helena', 'Você e seus atalhos...', ESCb, { e: 'triste', olhar: [-0.6, 0], rim: POR });
F('helena', 'E amanhã tem trabalho de biologia. Você fez a sua parte?', ESCb, { tipo: 'dupla', eH: 'determinado', eL: 'neutro', rim: POR });
F('lucas', 'Defina fez.', ESCb, { e: 'sorriso', olhar: [0.8, 0], rim: POR, dur: 1.6 });
F('helena', 'Lucas!', ESCb, { e: 'raiva', rim: POR, tremer: 3, dur: 1.3 });
F('lucas', 'Tô brincando! Mais ou menos brincando.', ESCb, { e: 'sorriso', rim: POR });

// ================= CENA 2 — A CONSTRUÇÃO MISTERIOSA =================
A(5, (lt, c) => {
  const k = lim(lt / 5);
  return camLenta(ikCaminho(lt, { ruinaBrilho: 0.5 }) + ikPessoaMini(mix(180, 330, k), mix(1880, 1640, k), 0.34, lt, { cabelo: '#3A2418', andar: true }) + ikPessoaMini(mix(300, 420, k), mix(1900, 1660, k), 0.33, lt + 0.3, { cabelo: '#6A3E22', longo: true, saia: true, andar: true }), lt, 5, { z0: 1, z1: 1.06, cy: 1300, soco: false }) + entra(lt, c, 0.6);
}, { trilha: 'misterio' });
F('lucas', 'Ei, Helena. Você já tinha visto aquilo ali?', CAMb, { e: 'surpreso', olhar: [0.8, -0.3], rim: POR });
F('helena', 'Aquela construção velha? Tá abandonada desde sempre.', CAMb, { tipo: 'dupla', eH: 'neutro', eL: 'surpreso', rim: POR });
F('lucas', 'Então por que tem uma luz lá dentro?', (lt) => camera(ikCaminho(lt, { ruinaBrilho: 1 }), 2.4, 560, 1010), { desenhar: () => '', semCam: true });
F('helena', 'Deve ser alguém com lanterna. Ou um gato. Ou qualquer coisa que não é da nossa conta.', CAMb, { e: 'determinado', rim: POR });
F('lucas', 'Só uma olhadinha. Rapidinho.', CAMb, { e: 'sorriso', rim: POR, zoom: 1.1 });
F('helena', 'Lucas, não. Da última vez que você falou rapidinho, a gente ficou preso no telhado da escola.', CAMb, { tipo: 'dupla', eH: 'raiva', eL: 'sorriso', rim: POR });
F('lucas', 'E foi a melhor tarde da sua vida. Admite.', CAMb, { e: 'sorriso', rim: POR });
F('helena', 'Foi horrível.', CAMb, { e: 'determinado', corar: true, rim: POR, dur: 1.8 });
F('lucas', 'Tô indo!', (lt) => CAMb(lt), { desenhar: (lt, c, fl) => busto('lucas', lt, { x: mix(540, 900, lim((lt - 0.6) / 0.8)), expr: 'sorriso', fala: fl, rim: POR }) });
F('helena', 'Lucas! Ah, que ótimo. Se você morrer, eu te mato.', CAMb, { e: 'raiva', rim: POR, tremer: 2 });

// interior
A(4.5, (lt, c) => { som('porta', 0.2, 0.5); return camLenta(ikRuinaDentro(lt, { forca: 0.3 }), lt, c.dur, { z0: 1.15, z1: 1.0, cy: 1000, soco: false }) + entra(lt, c, 0.8); });
F('helena', 'Tá. Já vimos. É velho, é sujo e tem cheiro de mofo. Bora embora.', RUI(0.3), { e: 'determinado', rim: ROXO });
F('lucas', 'Olha isso aqui no chão.', RUI(0.35), { e: 'surpreso', olhar: [0, 0.8], rim: ROXO });
A(4, (lt, c) => { som('suspense', 0, 0.4); return camera(ikRuinaDentro(lt, { forca: 0.45 }), mix(1.4, 1.7, lim(lt / 4)), 540, 1560); });
F('helena', 'Que desenho é esse? Parece muito antigo.', RUI(0.45), { tipo: 'dupla', eH: 'surpreso', eL: 'surpreso', rim: ROXO });
F('lucas', 'Tá brilhando sozinho. Não tem nenhuma lâmpada aqui.', RUI(0.45), { e: 'surpreso', rim: ROXO });
F('helena', 'Essas marcas não são de nenhuma língua que eu conheço. E eu conheço muitas.', RUI(0.45), { e: 'determinado', olhar: [0, 0.6], rim: ROXO });
F('lucas', 'Talvez seja um tesouro escondido.', RUI(0.5), { e: 'sorriso', rim: ROXO });
F('helena', 'Ou talvez seja um aviso. Não encosta, Lucas.', RUI(0.5), { e: 'raiva', rim: ROXO, zoom: 1.1 });
F('lucas', 'Eu não vou encostar.', RUI(0.5), { e: 'neutro', olhar: [-0.6, 0], rim: ROXO });
// a mão
A(3, (lt) => {
  const k = lim(lt / 2.6);
  let s = camera(ikRuinaDentro(lt, { forca: 0.5 + k * 0.2 }), 1.6, 540, 1560);
  s += `<g transform="translate(${mix(700, 560, k)} ${mix(1100, 1420, k)}) rotate(-30)"><rect x="-70" y="-500" width="140" height="460" fill="#2A3A5A" stroke="${IK}" stroke-width="8"/><rect x="-74" y="-60" width="148" height="40" fill="#F2F2F8" stroke="${IK}" stroke-width="6"/><path d="M -60 -20 Q -70 90 -20 120 L 40 120 Q 70 90 60 -20 Z" fill="#FCE6D8" stroke="${IK}" stroke-width="7"/><rect x="-20" y="100" width="34" height="90" rx="16" fill="#FCE6D8" stroke="${IK}" stroke-width="6"/></g>`;
  return s;
});
F('helena', 'Você vai encostar.', RUI(0.6), { e: 'raiva', rim: ROXO, dur: 1.8 });
F('lucas', 'Só um pouquinho.', RUI(0.6), { e: 'sorriso', rim: ROXO, dur: 1.6 });

// ================= CENA 3 — O PORTAL =================
A(3.2, (lt) => {
  som('impacto', 0.05, 1); som('suspense', 0.3, 1);
  const k = lim(lt / 3);
  return ikRuinaDentro(lt, { forca: 0.6 + k * 0.4, tremer: 4 + k * 10, particulas: Math.round(20 + k * 60) }) + flashBranco(lt, 0.05, 0.4, '#C8E0FF');
}, { trilha: 'terror' });
F('helena', 'LUCAS! O que você fez?!', (lt) => ikRuinaDentro(lt, { forca: 1, tremer: 8, particulas: 70 }), { e: 'grito', rim: '#9FD0FF', tremer: 6, brilho: null, sons: (lt) => som('rugido', 0, 0.3) });
F('lucas', 'Eu não sei! Eu só encostei!', (lt) => ikRuinaDentro(lt, { forca: 1, tremer: 8, particulas: 80 }), { e: 'grito', rim: '#C8A0FF', tremer: 6 });
F('helena', 'Segura em mim! Não solta!', (lt) => ikRuinaDentro(lt, { forca: 1, tremer: 10, particulas: 90 }), { tipo: 'dupla', eH: 'grito', eL: 'surpreso', rim: '#9FD0FF', tremer: 8 });
F('lucas', 'HELENA!', (lt) => ikRuinaDentro(lt, { forca: 1, tremer: 14, particulas: 100 }) + `<rect width="1080" height="1920" fill="#FFFFFF" opacity="${lim(lt / 1.4) * 0.8}"/>`, { e: 'grito', rim: '#FFFFFF', tremer: 10, dur: 1.8 });
A(3, (lt) => { som('impacto', 0, 1); return `<rect width="1080" height="1920" fill="#FFFFFF"/>`; }, { vinheta: 0 });
A(2.5, (lt) => `<rect width="1080" height="1920" fill="#FFFFFF" opacity="${1 - lim(lt / 2.4)}"/>` + `<rect width="1080" height="1920" fill="#000" opacity="${lim(lt / 2.4)}"/>`, { vinheta: 0, trilha: 'silencio' });

// ================= CENA 4 — UM NOVO MUNDO =================
A(4, (lt) => {
  const abre = lim((lt - 1) / 2) * (1 - (Math.abs(lt - 2.6) < 0.12 ? 1 : 0));
  let s = ikMundo(lt, { campo: false });
  const h = 960 * abre;
  return s + `<rect width="1080" height="${960 - h / 2}" fill="#000"/><rect y="${960 + h / 2}" width="1080" height="${960 - h / 2}" fill="#000"/>` + `<defs><filter id="bA"><feGaussianBlur stdDeviation="${(1 - abre) * 20}"/></filter></defs>`;
}, { trilha: 'calma', vinheta: 0.6 });
F('lucas', 'Ai... minha cabeça...', (lt) => `<defs><filter id="bW"><feGaussianBlur stdDeviation="10"/></filter></defs><g filter="url(#bW)">${ikMundo(lt)}</g>`, { e: 'triste', rim: BRANCO, y: 1080 });
A(4, (lt, c) => camLenta(ikMundo(lt, { cam: 0 }) + ikPessoaMini(430, 1700, 0.3, lt, { cabelo: '#3A2418', deitado: true }) + ikPessoaMini(700, 1760, 0.3, lt, { cabelo: '#6A3E22', longo: true, saia: true, deitado: true }), lt, c.dur, { z0: 1.6, z1: 1.2, cx: 560, cy: 1650, soco: false }));
// a revelação
A(10, (lt, c) => {
  som('ding', 0.4, 0.4);
  const k = vaivem(lt / 10);
  return camera(ikMundo(lt, { cam: k * 200 }), mix(1.7, 1.0, k), 540, mix(1600, 960, k));
}, { trilha: 'epica' });
F('lucas', 'Não... não pode ser.', MUN, { e: 'surpreso', olhar: [0, -0.8], rim: BRANCO, zoom: 1.12 });
F('helena', 'Lucas? Onde... onde a gente tá?', MUN, { e: 'triste', rim: BRANCO });
F('lucas', 'Helena... acho que não estamos mais em casa.', MUN, { tipo: 'dupla', eL: 'surpreso', eH: 'surpreso', rim: BRANCO });
F('helena', 'LUCAS... ONDE DIABOS A GENTE ESTÁ?!', (lt) => ikMundo(lt) + ikVelocidade(lt, '#FFFFFF', 0.25), { e: 'grito', rim: BRANCO, tremer: 5, zoom: 1.15 });
A(3.5, (lt) => { som('rugido', 0.4, 0.5); som('whoosh', 1.2, 1); const x = mix(-500, 1500, lim(lt / 3.2)); return ikMundo(lt, { sombraDragao: Math.max(0, 1 - Math.abs(lt - 1.6) / 1) }) + ikDragao(x, 700, 1.6, lt, '#2A1E44'); });
F('lucas', 'Aquilo era um dragão?!', MUN, { tipo: 'dupla', eL: 'grito', eH: 'surpreso', rim: BRANCO, tremer: 3 });
F('helena', 'Isso não é real. Isso não pode ser real. Deve ser um sonho.', MUN, { e: 'triste', olhar: [0, 0.4], rim: BRANCO });
F('lucas', 'Ai! Não é sonho. Eu me belisquei.', MUN, { e: 'determinado', rim: BRANCO });
F('helena', 'Você beliscou a MIM!', MUN, { e: 'raiva', rim: BRANCO, tremer: 4, sons: () => som('pop', 0.2, 0.7) });
F('lucas', 'Era pra ter certeza!', MUN, { e: 'sorriso', rim: BRANCO });
F('helena', 'Espera. O celular. Sem sinal. Nenhuma barrinha. Nem GPS.', (lt) => MUN(lt) + `<rect width="1080" height="1920" fill="#000" opacity="0.35"/>` + ikCelular(lt), { desenhar: () => '' });
F('lucas', 'O meu também. E a bateria tá em cem por cento. Ela tava em dois.', (lt) => MUN(lt) + `<rect width="1080" height="1920" fill="#000" opacity="0.35"/>` + ikCelular(lt, { bateria: 100 }), { desenhar: () => '' });
F('helena', 'Pensa, Helena, pensa. A gente tocou naquele símbolo, veio a luz, e agora...', MUN, { e: 'determinado', olhar: [-0.5, 0.3], rim: BRANCO });
F('lucas', 'Agora a gente tá num mundo com ilhas voadoras. Tranquilo. Normal. Super normal.', MUN, { e: 'sorriso', rim: BRANCO });
F('helena', 'Precisamos achar alguém. Uma cidade, uma estrada, qualquer coisa.', MUN, { tipo: 'dupla', eH: 'determinado', eL: 'neutro', rim: BRANCO });
F('lucas', 'Aquele castelo ali parece ter gente.', (lt) => camera(ikMundo(lt), 2.2, 700, 760), { desenhar: () => '', semCam: true });
F('helena', 'Aquele castelo tá a uns trinta quilômetros, Lucas.', MUN, { e: 'determinado', rim: BRANCO });
F('lucas', 'Então é melhor a gente começar a andar.', MUN, { e: 'sorriso', rim: BRANCO, zoom: 1.1 });
A(5, (lt, c) => { const k = lim(lt / 5); return camLenta(ikMundo(lt, { cam: k * 120 }) + ikPessoaMini(mix(360, 520, k), 1720, 0.3, lt, { cabelo: '#3A2418', andar: true }) + ikPessoaMini(mix(470, 630, k), 1740, 0.3, lt + 0.4, { cabelo: '#6A3E22', longo: true, saia: true, andar: true }), lt, c.dur, { z0: 1.1, z1: 1.0, cy: 1500, soco: false }); });
F('helena', 'Você percebeu que o ar aqui é diferente? Parece mais leve.', MUN, { e: 'surpreso', olhar: [0, -0.4], rim: BRANCO });
F('lucas', 'Eu percebi que tô com fome. Isso conta?', MUN, { e: 'sorriso', rim: BRANCO });
F('helena', 'A gente pode estar em outro planeta e você pensando em comida.', MUN, { tipo: 'dupla', eH: 'determinado', eL: 'sorriso', rim: BRANCO });
F('lucas', 'É exatamente por isso! E se aqui não tiver coxinha?', MUN, { e: 'grito', rim: BRANCO });
F('helena', 'Você é impossível.', MUN, { e: 'sorriso', rim: BRANCO, dur: 1.8 });
F('lucas', 'Ei... desculpa. Fui eu que toquei naquele símbolo.', MUN, { e: 'triste', olhar: [0, 0.4], rim: BRANCO, zoom: 1.1 });
F('helena', 'Foi mesmo. Mas eu segurei o seu braço. Então a culpa é dos dois.', MUN, { e: 'sorriso', corar: true, rim: BRANCO });
F('lucas', 'A gente vai dar um jeito de voltar. Eu prometo.', MUN, { tipo: 'dupla', eL: 'determinado', eH: 'sorriso', rim: BRANCO });

// ================= CENA 5 — A PRIMEIRA AMEAÇA =================
A(5, (lt, c) => camLenta(ikFloresta(lt, { cam: lt * 60 }) + ikPessoaMini(440, 1760, 0.3, lt, { cabelo: '#3A2418', andar: true }) + ikPessoaMini(620, 1780, 0.3, lt + 0.4, { cabelo: '#6A3E22', longo: true, saia: true, andar: true }), lt, c.dur, { z0: 1, z1: 1.08, cy: 1500, soco: false }) + entra(lt, c, 0.6), { trilha: 'misterio' });
F('helena', 'Até as plantas daqui brilham.', FLO(), { e: 'surpreso', olhar: [0.5, 0.5], rim: VERDE });
F('lucas', 'Olha esse cogumelo! Será que dá pra comer?', FLO(), { e: 'sorriso', rim: VERDE });
F('helena', 'Se você comer isso, eu não vou te carregar.', FLO(), { tipo: 'dupla', eH: 'determinado', eL: 'sorriso', rim: VERDE });
A(2.2, (lt) => { som('galho', 0.2, 1); return ikFloresta(lt, { escuro: 0.2 }) + `<rect width="1080" height="1920" fill="#000" opacity="${lt > 0.2 ? 0.25 : 0}"/>`; }, { trilha: 'terror' });
F('lucas', 'Você ouviu isso?', FLO(0.25), { e: 'surpreso', olhar: [-0.8, 0], rim: VERDE });
F('helena', 'Ouvi. E não foi um esquilo.', FLO(0.25), { e: 'triste', olhar: [0.8, 0], rim: VERDE });
A(3.2, (lt) => { som('folhas', 0.3, 1); som('rosnado', 1.5, 1); return ikFloresta(lt, { escuro: 0.45 }) + ikOlhos(540, 1100, lt, { abre: lim((lt - 1.4) / 0.3), tam: 1.3 }); });
F('helena', 'Lucas... não se mexe.', FLO(0.4), { e: 'surpreso', rim: VERDE, zoom: 1.12 });
A(4, (lt) => {
  som('rugido', 0.4, 1); som('impacto', 0.4, 0.9);
  const k = suave(lt / 0.8);
  return `<g transform="translate(${Math.sin(lt * 50) * (lt > 0.4 && lt < 1.6 ? 12 : 0)} 0)">` + ikFloresta(lt, { escuro: 0.25 }) + ikCriatura(mix(700, 640, k), 1780, mix(0.7, 1.15, k), lt, { rugindo: lt > 0.4 && lt < 2.4 }) + `</g>` + flashBranco(lt, 0.4, 0.2, '#FFE0A0');
});
F('lucas', 'CORRE!', (lt) => ikFloresta(lt, { escuro: 0.2 }) + ikVelocidade(lt, '#FFFFFF', 0.3), { e: 'grito', rim: VERDE, tremer: 6, dur: 1.4, trilha: 'epica' });
// perseguição
A(4, (lt) => {
  som('rosnado', 0.5, 0.8); som('folhas', 0.1, 1); som('folhas', 2, 1);
  return ikFloresta(lt, { cam: lt * 900, correr: true }) + ikPessoaMini(420, 1800, 0.34, lt * 2, { cabelo: '#3A2418', andar: true }) + ikPessoaMini(600, 1820, 0.34, lt * 2 + 0.5, { cabelo: '#6A3E22', longo: true, saia: true, andar: true }) + ikCriatura(mix(-260, -60, (Math.sin(lt * 1.5) + 1) / 2), 1840, 0.62, lt, { rugindo: true });
});
F('helena', 'Por que ela é tão rápida?!', (lt) => ikFloresta(lt, { cam: lt * 900, correr: true }), { e: 'grito', rim: VERDE, tremer: 5, desenhar: (lt, c, fl) => busto('helena', lt, { expr: 'grito', fala: fl, rim: VERDE, y: 1000 + Math.abs(Math.sin(lt * 10)) * 30 }) });
F('lucas', 'Pela esquerda! Vai!', (lt) => ikFloresta(lt, { cam: lt * 900, correr: true }), { e: 'grito', rim: VERDE, tremer: 5, desenhar: (lt, c, fl) => busto('lucas', lt, { expr: 'grito', fala: fl, rim: VERDE, olhar: [-0.8, 0], y: 1000 + Math.abs(Math.sin(lt * 10)) * 30 }) });
A(2.4, (lt) => { som('batida', 0.5, 0.6); const k = lim((lt - 0.4) / 0.4); return ikFloresta(lt, { cam: 600 }) + ikPessoaMini(560, 1800, 0.36, lt, { cabelo: '#6A3E22', longo: true, saia: true, deitado: k > 0.5 }); });
F('helena', 'Ah!', FLO(0.2), { e: 'triste', rim: VERDE, dur: 1.4, y: 1150 });
F('lucas', 'Helena! Pega a minha mão!', FLO(0.2), { e: 'determinado', rim: VERDE, zoom: 1.12 });
A(3, (lt) => { som('rosnado', 0.2, 1); const k = suave(lt / 2.6); return ikFloresta(lt, { cam: 600, escuro: 0.3 }) + ikCriatura(540, 2000, mix(1.2, 1.6, k), lt, { rugindo: true, garra: k }) + `<rect width="1080" height="1920" fill="#000" opacity="0.15"/>`; });
F('lucas', 'Fica atrás de mim!', FLO(0.3), { e: 'raiva', rim: VERDE, tremer: 3, zoom: 1.15 });
F('helena', 'Você tá louco?!', FLO(0.3), { e: 'grito', rim: VERDE, dur: 1.6 });
// a aventureira
A(2.6, (lt) => {
  som('whoosh', 0.2, 1); som('impacto', 0.9, 1);
  const k = lim((lt - 0.3) / 0.6);
  return ikFloresta(lt, { cam: 600, escuro: 0.2 }) + ikCriatura(760, 1900, 1.2, lt, { rugindo: lt < 1 }) + ikAventureiraCorpo(mix(-200, 360, k), mix(900, 1800, k), 0.62, lt, { espada: mix(-60, 40, k) }) + ikCorte(520, 1300, 420, 30, (lt - 0.8) / 0.5) + flashBranco(lt, 0.9, 0.25, '#DFF0FF');
}, { trilha: 'epica' });
F('lyra', 'Abaixem a cabeça!', (lt) => ikFloresta(lt, { cam: 600 }), { e: 'determinado', rim: '#BFE8FF', quem: 'lyra', extra: (lt) => ikEspada(860, 1500, 20 + Math.sin(lt * 2) * 4, 0.9) });

// ================= CENA FINAL — O MISTÉRIO =================
A(4.2, (lt) => {
  som('whoosh', 0.3, 1); som('impacto', 0.6, 1); som('whoosh', 1.6, 1); som('impacto', 1.9, 1); som('rugido', 2.4, 0.9);
  let s = ikFloresta(lt, { cam: 600 }) + ikVelocidade(lt, '#BFE8FF', 0.35) + ikCriatura(560, 1900, 1.3, lt, { rugindo: true, garra: Math.max(0, Math.sin(lt * 3)) * 0.5 });
  s += ikCorte(540, 1200, 480, 0, (lt - 0.3) / 0.5) + ikCorte(540, 1300, 520, 180, (lt - 1.6) / 0.5);
  return `<g transform="translate(${Math.sin(lt * 55) * 10} ${Math.cos(lt * 47) * 8})">${s}</g>` + flashBranco(lt, 0.6, 0.2, '#DFF0FF') + flashBranco(lt, 1.9, 0.2, '#DFF0FF');
});
A(3.6, (lt) => {
  som('impacto', 0.2, 1);
  const k = lim((lt - 0.3) / 0.3);
  return ikFloresta(lt, { cam: 600 }) + ikCriatura(560, 1900, 1.3, lt, { dissolver: lim((lt - 0.8) / 2.4) }) + ikAventureiraCorpo(mix(200, 300, k), 1820, 0.7, lt, { espada: -120 }) + ikCorte(560, 1300, 600, 90, (lt - 0.2) / 0.6) + flashBranco(lt, 0.2, 0.3, '#FFFFFF') + ikParticulas(lt, 40, { cx: 560, cy: 1700, cores: ['#7FFFE0', '#4A8A7A', '#FFFFFF'] });
});
A(3, (lt) => ikFloresta(lt, { cam: 600 }) + ikAventureiraCorpo(540, 1860, 0.85, lt, { espada: mix(-120, 160, lim(lt / 1.5)) }) + ikParticulas(lt, 30, { cx: 540, cy: 1800, cores: ['#7FFFE0', '#FFFFFF'] }), { trilha: 'misterio' });
F('lyra', 'Vocês estão bem? Um escamado da névoa não costuma chegar tão perto da estrada.', FLO(), { e: 'neutro', rim: VERDE, quem: 'lyra' });
F('lucas', 'Um... o quê?', FLO(), { tipo: 'dupla', eL: 'surpreso', eH: 'surpreso', rim: VERDE });
F('lyra', 'Quem são vocês? E por que estão usando roupas de outro mundo?', FLO(), { e: 'determinado', rim: VERDE, quem: 'lyra', zoom: 1.15, olhar: [0, 0.2] });
A(3.4, (lt) => FLO()(lt) + busto('lucas', lt, { x: 290, y: 1130, esc: 0.9, expr: 'surpreso', olhar: [lt > 1 ? 1 : 0, 0], rim: VERDE }) + busto('helena', lt, { x: 800, y: 1130, esc: 0.9, expr: 'surpreso', olhar: [lt > 1.2 ? -1 : 0, 0], rim: VERDE }));
F('helena', 'De outro mundo...?', FLO(), { e: 'surpreso', rim: VERDE, dur: 2 });
F('lucas', 'A gente é do Brasil. De São Paulo. Da... Terra?', FLO(), { e: 'sorriso', olhar: [0.5, 0], rim: VERDE });
F('lyra', 'Terra? Nunca ouvi falar desse reino.', FLO(), { e: 'surpreso', rim: VERDE, quem: 'lyra' });
F('lyra', 'Venham comigo. Quando a noite cai, esta floresta fica pior.', FLO(), { e: 'determinado', rim: VERDE, quem: 'lyra' });
F('helena', 'Pior do que AQUILO?', FLO(), { e: 'grito', rim: VERDE, tremer: 3 });
F('lyra', 'Muito pior.', FLO(0.15), { e: 'neutro', rim: VERDE, quem: 'lyra', zoom: 1.12, dur: 1.8 });
// a câmera se afasta: floresta → castelo sombrio
A(6, (lt, c) => {
  som('suspense', 2, 0.5);
  const k = vaivem(lt / 6);
  const s = k < 0.5 ? camera(ikFloresta(lt, { cam: 600 }), mix(1.0, 0.9, k * 2) < 1 ? 1 : 1, 540, 960) + `<rect width="1080" height="1920" fill="#000" opacity="${k * 2}"/>` : ikCasteloSombrio(lt, { raio: Math.abs(lt - 4.5) < 0.15 ? 1 : 0 }) + `<rect width="1080" height="1920" fill="#000" opacity="${Math.max(0, 1 - (k - 0.5) * 3)}"/>`;
  if (Math.abs(lt - 4.5) < 0.05) som('impacto', lt, 0.6);
  return s;
}, { trilha: 'terror' });
A(4.5, (lt, c) => { som('impacto', 4.3, 0.5); return camera(ikCasteloSombrio(lt, { raio: Math.abs(lt - 1.2) < 0.12 ? 1 : 0 }), mix(1, 2.6, vaivem(lt / 4.5)), 600, 520); });
A(5, (lt) => camLenta(ikSalaEsfera(lt) + ikHomemCostas(540, 1900, 1.2, lt), lt, 5, { z0: 1, z1: 1.1, cy: 1250, soco: false }));
F('vilao', 'Então...', (lt) => ikSalaEsfera(lt, { imagem: `<g transform="translate(540 1250) scale(0.32) translate(-540 -1130)">${busto('lucas', lt, { x: 290, y: 1130, esc: 0.86, expr: 'surpreso' })}${busto('helena', lt, { x: 800, y: 1130, esc: 0.86, expr: 'surpreso' })}</g>` }), { desenhar: () => '', zoom: 1.2 });
F('vilao', 'os dois escolhidos finalmente chegaram.', (lt) => `<rect width="1080" height="1920" fill="#06040A"/>`, { e: 'determinado', brilho: '#FF2040', quem: 'vilao', y: 1050, esc: 1.4, final: (lt) => `<rect width="1080" height="700" fill="#06040A" opacity="0.92"/><rect y="700" width="1080" height="160" fill="#06040A" opacity="0.6"/>`, vinheta: 0.8, sons: () => som('impacto', 0.2, 0.6) });
// fim
A(6, (lt) => {
  let s = `<rect width="1080" height="1920" fill="#000"/>`;
  s += `<g opacity="${lim((lt - 0.5) / 0.6)}"><text x="540" y="880" text-anchor="middle" font-family="Anton, sans-serif" font-size="110" fill="#FFFFFF" letter-spacing="8">CONTINUA...</text>` +
    `<text x="540" y="990" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="46" fill="#B890FF" letter-spacing="4">ALÉM DO PORTAL · EPISÓDIO 02</text>` +
    `<text x="540" y="1140" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="42" fill="#FFD36A">SEGUE PRA NÃO PERDER O PRÓXIMO 🔔</text></g>`;
  return s;
}, { vinheta: 0 });

window.TRILHA_CENAS = {}; E.forEach((c, i) => { if (c.trilha) TRILHA_CENAS[i] = c.trilha; });
if (!TRILHA_CENAS[0]) TRILHA_CENAS[0] = 'calma';

window.CAPA = () => {
  let s = ikMundo(2) + `<rect width="1080" height="1920" fill="#000" opacity="0.15"/>`;
  s += busto('lucas', 1, { x: 300, y: 1250, esc: 0.95, expr: 'surpreso', rim: '#FFFFFF' }) + busto('helena', 1, { x: 790, y: 1250, esc: 0.95, expr: 'grito', rim: '#FFFFFF' });
  s += `<text x="540" y="330" text-anchor="middle" font-family="Anton, sans-serif" font-size="150" fill="#FFFFFF" stroke="#2A1A5A" stroke-width="14" paint-order="stroke" letter-spacing="6">ALÉM DO PORTAL</text>`;
  s += `<text x="540" y="420" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="50" fill="#FFFFFF" stroke="#2A1A5A" stroke-width="8" paint-order="stroke" letter-spacing="3">EP. 01 · O DIA EM QUE DESAPARECEMOS</text>`;
  return s + acabamento('#000', 0.4);
};

criarEpisodio(E, { voz: 'pt-BR-AntonioNeural', velocidade: '+10%' });
