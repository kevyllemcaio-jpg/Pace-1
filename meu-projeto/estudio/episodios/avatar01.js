// MISSÃO AVATAR — Parte 1 (personagens originais: Tavinho, Carol, Tio Beto)
// Três da manhã. O Tavinho joga em dupla com a Carol há um ano — ela só conhece o avatar dele (herói perfeito).
// Ela vai passar 30 dias na cidade e quer se conhecer pessoalmente. Ele aceita a missão: ficar igual ao avatar.
// Votação: DENTE ou CABELO.

window.FONTE_LEGENDA = 'Baloo, sans-serif';
window.LEGENDA_Y = 1380;
window.TRATAR_VOZ = 'seco';
window.ENCURTAR_PAUSAS = true;
window.TRILHA = 'alegre';
const TAVINHO = { pele: '#E2A77E', pele2: '#C98A62', cabelo: '#3A2A22', camisa: '#5E8A50', oculos: false, fone: false, estampa: false, sujo: true, olheira: true, rasgado: true, bone: true, boneTexto: 'PRO', boneCor: '#8A8670', boneAba: '#5E5A4A' };
window.VISUAL = TAVINHO;
const E = [];
const cena = (fala, desenhar, o = {}) => E.push({ fala, desenhar, ...o });
const tav = (lt, o = {}) => kyleClose({ x: 540, y: 1150, esc: 1.45, expr: 'neutro', semDente: true, t: lt, ...o });
const tavCorpo = (lt, o = {}) => kyleCorpo({ x: o.x || 540, y: o.y || 1760, esc: o.esc || 0.95, expr: o.expr || 'neutro', t: lt, pose: o.pose || 'base', celular: o.celular, fala: false, olhar: o.olhar || [0, 0], p: o.p, visual: TAVINHO });
const rostoMini = (cx, cy, k, lt, o = {}) => `<g transform="translate(${cx} ${cy}) scale(${k})">${kyleClose({ x: 0.001, y: 0.001, esc: 1, expr: 'neutro', semDente: true, t: lt, ...o })}</g>`;
const avatarMini = (cx, cy, k, lt) => `<g transform="translate(${cx} ${cy}) scale(${k})">${kyleClose({ x: 0.001, y: 0.001, esc: 1, expr: 'feliz', t: lt, barba: false, visual: AVATAR })}</g>`;
const relogio = (lt) => `<rect x="70" y="110" width="250" height="110" rx="14" fill="#1A0E10" stroke="#D7262B" stroke-width="5"/><text x="195" y="192" text-anchor="middle" font-family="Anton, sans-serif" font-size="80" fill="#FF3A3A" opacity="${Math.sin(lt * 4) > -0.6 ? 1 : 0.3}">03:00</text>`;
const CAROL_MSGS = [{ txt: 'GG, parceiro.' }, { txt: 'Vou passar 30 dias na sua cidade.' }, { txt: 'Bora se conhecer pessoalmente?' }];

// 1 — gancho
cena('*Três* da manhã. O Tavinho acabou de *ganhar* a partida.', (lt, c) => {
  let s = quartoGamerBorrado(lt) + `<rect x="200" y="800" width="680" height="900" rx="60" fill="#D7262B" stroke="#1F1A24" stroke-width="10"/>` + tav(lt, { expr: lt > c.w('ganhar') ? 'sorrisao' : 'sono', y: 1200 }) + relogio(lt);
  if (lt > c.w('ganhar')) s += pulo(`<g transform="translate(740 1120) rotate(-8)"><rect x="-90" y="-40" width="180" height="80" rx="20" fill="#F7C531" stroke="#1F1A24" stroke-width="6"/><text x="0" y="22" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="56" fill="#1F1A24">WIN!</text></g>`, lt, 740, 1120, c.w('ganhar'));
  som('caixa', c.w('ganhar'), 0.6);
  return s;
}, { capa: 0.5 });
cena('Aí o celular vibra... e ele pega.', (lt, c) => {
  som('bolha', 0.2, 0.9);
  const pega = lt > c.w('pega');
  return quartoGamer(lt) + tavCorpo(lt, { expr: pega ? 'sorrisao' : 'surpreso', pose: pega ? 'celular' : 'base', celular: pega }) + (lt < c.w('pega') ? `<text x="440" y="760" font-family="Anton, sans-serif" font-size="110" fill="#D7262B" stroke="#1F1A24" stroke-width="8" paint-order="stroke">!</text>` : '');
});
cena('*Vitória.* Como sempre.', (lt) => telaVitoria(lt));
cena('E a Carol manda o de sempre: *GG, parceiro.*', (lt, c) => { som('bolha', c.w('gg'), 0.8); return telaVitoria(lt, { chat: [['Sistema', 'partida encerrada', '#AEB4C2'], ['TavinhoPRO', 'ez kkk', '#5AE0FF'], ...(lt > c.w('gg') ? [['Carol', 'GG, parceiro.', '#FF8AD0']] : [])] }); });
// 2 — o duo
cena('Os dois jogam juntos há *um ano.* Mais de *oitocentas* partidas.', (lt, c) => quartoGamer(lt) + tavCorpo(lt, { expr: 'feliz', pose: 'celular', celular: true }) + cardDuo(lt, 0.1, { tempo: lt > c.w('um') ? '1 ANO' : '0 DIAS', partidas: lt > c.w('oitocentas') ? '812' : '0' }));
cena('Ela conhece a *voz* dele. As *piadas* dele. Até a hora que ele *dorme.*', (lt, c) => quartoGamer(lt) + tavCorpo(lt, { expr: lt > c.w('dorme') ? 'sono' : lt > c.w('piadas') ? 'sorrisao' : 'feliz', pose: 'celular', celular: true }) + checklist(lt, ['A VOZ DELE', 'AS PIADAS', 'QUANDO ELE DORME'], [c.w('voz'), c.w('piadas'), c.w('dorme')]) + (lt > c.w('dorme') ? `<text x="700" y="720" font-family="Anton, sans-serif" font-size="70" fill="#fff" opacity="0.8">Z z</text>` : ''));
cena('Mas ela *nunca* viu o rosto dele. E ele *nunca* viu o dela.', (lt, c) => perfisNunca(lt, c.w('nunca'), c.w('nunca', 1)));
cena('Ela só conhece... o *avatar.*', (lt, c) => holofote(lt, lt > c.w('avatar') ? pulo(`<text x="540" y="900" text-anchor="middle" font-family="Anton, sans-serif" font-size="150" fill="#5A4AFF">???</text>`, lt, 540, 860, 0.1) : `<text x="540" y="900" text-anchor="middle" font-family="Anton, sans-serif" font-size="150" fill="#5A4AFF">???</text>`));
cena('*Cabelo perfeito.* *Ombro largo.* *Sorriso* de comercial de pasta de dente.', (lt, c) => {
  let s = holofote(lt, avatarHeroi(540, 1640, 1.05, lt) + `<rect x="300" y="200" width="480" height="60" rx="30" fill="#141826" stroke="#5AE0FF" stroke-width="4"/><text x="540" y="242" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="32" fill="#5AE0FF">TAVINHO_GOD · NV. 99</text>`);
  s += tagCheck(lt, c.w('cabelo'), 250, 470, 'CABELO PERFEITO') + tagCheck(lt, c.w('ombro'), 840, 760, 'OMBRO LARGO') + tagCheck(lt, c.w('sorriso'), 540, 1060, 'SORRISO DE COMERCIAL');
  if (lt > c.w('sorriso')) s += `<path d="M 600 620 l 12 -30 l 12 30 l 30 12 l -30 12 l -12 30 l -12 -30 l -30 -12 Z" fill="#fff" opacity="${Math.abs(Math.sin(lt * 6))}"/>`;
  return s;
});
// 3 — a mensagem
cena('Até que hoje, a Carol escreve: *vou passar trinta dias na sua cidade.* Bora se conhecer?', (lt, c) => {
  const n = 1 + (lt > c.w('vou')) + (lt > c.w('bora'));
  if (n > 1) som('bolha', c.w('vou'), 0.9); if (n > 2) som('bolha', c.w('bora'), 0.9);
  return chatApp(lt, { nome: 'Carol', msgs: CAROL_MSGS.slice(0, n), digitando: '' }) + (lt > c.w('bora') + 0.5 ? `<g transform="translate(840 1260)">${rostoMini(0, 0, 0.42, lt, { expr: 'panico', suor: true })}</g>` : '');
});
cena('Ele olha pro *avatar*...', (lt) => quartoGamer(lt) + tavCorpo(lt, { x: 400, expr: 'sorrisao', pose: 'celular', celular: true }) + `<rect x="620" y="520" width="340" height="620" rx="24" fill="#141826" stroke="#5AE0FF" stroke-width="5"/><text x="790" y="570" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="28" fill="#5AE0FF">MEU AVATAR</text><g transform="translate(790 1120) scale(0.5)">${avatarHeroi(0, 0, 1, lt)}</g>`);
cena('...e depois pro *espelho.*', (lt) => { som('saida', 0.5, 0.5); return espelho(`<rect x="160" y="220" width="760" height="1380" fill="#4A4E70"/>` + tavCorpo(lt, { y: 1650, esc: 1.0, expr: 'triste' })); });
// 4 — o inventário
cena('O boné *PRO.* Usado desde *dois mil e onze.* Lavado: *nunca.*', (lt, c) => quartoGamerBorrado(lt) + tav(lt, { expr: 'sem_graca', suor: true }) + cartaItem(lt, 0.1, { titulo: 'BONÉ PRO', linhas: [['USADO DESDE:', lt > c.w('dois') ? '2011' : '????', '#F7C531'], ['LAVADO:', lt > c.w('nunca') ? 'NUNCA' : '', '#FF5A6A']] }));
cena('O dente da frente. *Perdido* num pão de queijo.', (lt, c) => quartoGamerBorrado(lt) + tav(lt, { expr: 'sorrisao', esc: 1.9, y: 1250 }) + cartaItem(lt, 0.1, { titulo: 'DENTE DA FRENTE', tag: 'PERDIDO', linhas: [['STATUS:', lt > c.w('perdido') ? 'FICOU NO PÃO DE QUEIJO' : '...', '#FF5A6A']] }));
cena('A camisa do campeonato. *Seis* furos. Defesa: *zero.*', (lt, c) => quartoGamer(lt) + tavCorpo(lt, { esc: 1.25, y: 2100, expr: 'triste' }) + [[470, 1150], [600, 1230], [520, 1330], [640, 1080], [430, 1260], [580, 1400]].slice(0, lt > c.w('seis') ? 6 : 0).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="22" fill="none" stroke="#F7C531" stroke-width="6"/>`).join('') + cartaItem(lt, 0.1, { titulo: 'CAMISA 2011', tag: 'RASGADA', linhas: [['FUROS:', lt > c.w('seis') ? '6' : '', '#F7C531'], ['DEFESA:', lt > c.w('zero') ? '0' : '', '#FF5A6A']] }));
cena('E o chinelo... consertado com *fita isolante.*', (lt, c) => {
  let s = `<rect width="1080" height="1920" fill="#4A4038"/>` + `<g transform="translate(540 1400) scale(2.2)"><path d="M -120 0 Q -130 -60 -60 -70 L 60 -70 Q 130 -60 120 0 Q 100 30 0 30 Q -100 30 -120 0 Z" fill="#3A6AB0" stroke="#1F1A24" stroke-width="6"/><path d="M -40 -70 L 0 -140 L 40 -70" fill="none" stroke="#2A4A80" stroke-width="16"/><rect x="-20" y="-110" width="40" height="30" fill="#1A1A1A" opacity="${lt > c.w('fita') ? 1 : 0}" transform="rotate(-20)"/></g>`;
  return s + cartaItem(lt, 0.1, { titulo: 'CHINELO', tag: 'REMENDADO', linhas: [['REPARO:', lt > c.w('fita') ? 'FITA ISOLANTE' : '', '#F7C531'], ['DURABILIDADE:', lt > c.w('fita') ? '3%' : '', '#FF5A6A']] });
});
cena('Comenta *eu* se você também tá nesse nível.', (lt, c) => quartoGamer(lt) + tavCorpo(lt, { x: 680, expr: 'sorrisao', pose: 'aponta' }) + balaoComenta(lt, 0.2));
// 5 — as ideias
cena('*Primeira ideia:* inventar uma viagem.', (lt) => quartoGamer(lt) + tavCorpo(lt, { expr: 'determinado' }) + `<g transform="translate(860 400)"><circle r="60" fill="#FFF07A" stroke="#1F1A24" stroke-width="6"/><text x="0" y="22" text-anchor="middle" font-family="Anton, sans-serif" font-size="60">1</text></g>`);
cena('Ele escreve: *tô viajando.*', (lt, c) => chatApp(lt, { nome: 'Carol', msgs: CAROL_MSGS, digitando: 'tô viajando'.slice(0, Math.floor(lim((lt - c.w('tô') + 0.2) / 1) * 11)) }));
cena('Aí ele lembra que ela vê ele *online* vinte horas por dia.', (lt, c) => chatApp(lt, { nome: 'Carol', msgs: CAROL_MSGS, digitando: 'tô viajando' }) + (lt > c.w('online') ? pulo(`<rect x="250" y="560" width="580" height="300" rx="24" fill="#141826" stroke="#4AE07A" stroke-width="6"/><text x="540" y="620" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="32" fill="#fff">SEU STATUS</text><circle cx="380" cy="740" r="80" fill="none" stroke="#33303D" stroke-width="20"/><circle cx="380" cy="740" r="80" fill="none" stroke="#4AE07A" stroke-width="20" stroke-dasharray="420 503" transform="rotate(-90 380 740)"/><text x="380" y="756" text-anchor="middle" font-family="Anton, sans-serif" font-size="56" fill="#fff">20h</text><text x="640" y="740" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="40" fill="#4AE07A">● ONLINE</text><text x="640" y="790" text-anchor="middle" font-family="Oswald, sans-serif" font-size="28" fill="#AEB4C2">ela vê tudo</text>`, lt, 540, 710, c.w('online')) : ''));
cena('Apaga.', (lt) => { som('saida', 0.1, 0.8); return chatApp(lt, { nome: 'Carol', msgs: CAROL_MSGS, digitando: 'tô viajando'.slice(0, Math.max(0, 11 - Math.floor(lt * 14))) }); }, { dur: 1.6 });
cena('*Segunda ideia:* mandar uma foto.', (lt) => camSelfie(lt, `<rect x="0" y="0" width="1080" height="1920" fill="#4A4E70"/>` + tav(lt, { expr: 'sorrisao', y: 1100, esc: 1.7 }), 0));
cena('Ele tira *trinta.*', (lt) => { [0.2, 0.7, 1.2, 1.7].forEach((t) => som('pop', t, 0.6)); return camSelfie(lt, `<rect x="0" y="0" width="1080" height="1920" fill="#4A4E70"/>` + tav(lt, { expr: ['sorrisao', 'sem_graca', 'surpreso', 'determinado'][Math.floor(lt * 2) % 4], y: 1100, esc: 1.7, olhar: [Math.sin(lt * 3), 0] }), Math.min(30, 1 + Math.floor(lt * 9))); });
cena('A *melhor* delas...', (lt) => galeria(lt, ['sono', 'sorrisao', 'panico', 'sem_graca', 'surpreso', 'janelinha', 'triste', 'determinado', 'vergonha'].map((e, i) => rostoMini(90 + (i % 3) * 310 + 140, 300 + Math.floor(i / 3) * 400 + 230, 0.62, lt + i, { expr: e, olhar: [Math.sin(i), 0] }))));
cena('Terceira ideia: pedir ajuda pro *Tio Beto.*', (lt) => chatApp(lt, { nome: 'Tio Beto', cor: '#F7C531', sub: 'visto por último hoje', msgs: [] }) + `<g transform="translate(540 700)"><rect x="-220" y="-40" width="440" height="80" rx="20" fill="#F7C531" stroke="#1F1A24" stroke-width="5"/><text x="0" y="16" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="44" fill="#1F1A24">3ª IDEIA: TIO</text></g>`);
cena('Manda a foto dele... e a do *avatar.*', (lt, c) => { som('bolha', 0.4, 0.8); som('bolha', c.w('avatar'), 0.8); return chatApp(lt, { nome: 'Tio Beto', cor: '#F7C531', msgs: [{ eu: true, txt: 'Tio, me ajuda!' }, { eu: true, foto: rostoMini(0, 30, 0.6, lt, { expr: 'sorrisao' }) }, ...(lt > c.w('avatar') ? [{ eu: true, foto: avatarMini(0, 30, 0.6, lt) }] : [])] }); });
cena('O tio responde com um *áudio* de quarenta e sete segundos. Só de *risada.*', (lt, c) => {
  const prog = lim((lt - c.w('risada')) / 3);
  let s = chatApp(lt, { nome: 'Tio Beto', cor: '#F7C531', msgs: [{ eu: true, txt: 'Tio, me ajuda!' }, { eu: true, foto: rostoMini(0, 30, 0.6, lt, { expr: 'sorrisao' }) }, { eu: true, foto: avatarMini(0, 30, 0.6, lt) }, ...(lt > c.w('áudio') ? [{ audio: '0:47', prog }] : [])] });
  if (lt > c.w('risada')) { for (let i = 0; i < 9; i++) { const r = aleatorio(i + 1); s += `<text x="${120 + r() * 700}" y="${700 + r() * 600}" font-family="Anton, sans-serif" font-size="${60 + r() * 30}" fill="#F7C531" stroke="#1F1A24" stroke-width="6" paint-order="stroke" transform="rotate(${-10 + r() * 20} 540 960)" opacity="${lim((lt - c.w('risada') - i * 0.12) / 0.2)}">KKKKK</text>`; } [0, 0.3, 0.6, 0.9, 1.2].forEach((t) => som('pop', c.w('risada') + t, 0.5)); }
  return s;
});
// 6 — a missão
cena('*Trinta* dias.', (lt) => quartoGamer(lt) + tavCorpo(lt, { expr: 'determinado' }) + calendario(lt, 30), { dur: 2 });
cena('Ele aceita a missão: ficar igual ao *próprio avatar.*', (lt, c) => quartoGamer(lt) + tavCorpo(lt, { expr: 'determinado' }) + missao(lt, 0.2, c.w('próprio')));
cena('E responde: *bora.*', (lt, c) => { som('bolha', c.w('bora'), 0.9); return chatApp(lt, { nome: 'Carol', msgs: [...CAROL_MSGS, ...(lt > c.w('bora') ? [{ eu: true, txt: 'Bora.' }] : [])] }); });
cena('Ela manda um *coração.* E logo depois: *mal posso esperar pra ver se você é igual ao avatar.*', (lt, c) => {
  const msgs = [...CAROL_MSGS, { eu: true, txt: 'Bora.' }, ...(lt > c.w('coração') ? [{ coracao: true }] : []), ...(lt > c.w('mal') ? [{ txt: 'Mal posso esperar pra ver se você é igual ao avatar.' }] : [])];
  som('bolha', c.w('coração'), 0.9); som('bolha', c.w('mal'), 0.9);
  return chatApp(lt, { nome: 'Carol', msgs, digitando: '' }) + (lt > c.w('avatar') ? `<g transform="translate(840 1300)">${rostoMini(0, 0, 0.42, lt, { expr: 'panico', suor: true })}</g>` : '');
});
cena('Ele engole *seco.*', (lt, c) => { som('pop', c.w('seco'), 1); return quartoGamerBorrado(lt) + tav(lt, { expr: 'sem_graca', suor: true, esc: 1.8, y: 1200 }) + (lt > c.w('seco') ? pulo(`<text x="720" y="720" font-family="Anton, sans-serif" font-size="120" fill="#F7C531" stroke="#1F1A24" stroke-width="10" paint-order="stroke" transform="rotate(-8 720 720)">GLUP</text>`, lt, 720, 680, c.w('seco')) : ''); });
cena('Saldo na conta: *trinta e oito reais* e setenta.', (lt) => quartoGamer(lt) + tavCorpo(lt, { x: 330, expr: 'triste' }) + avatarHeroi(780, 1760, 0.95, lt) + cardSaldo(lt, 'R$ 38,70'));
cena('Parecido com o avatar: *dois por cento.*', (lt, c) => quartoGamer(lt) + tavCorpo(lt, { x: 330, expr: 'sem_graca' }) + avatarHeroi(780, 1760, 0.95, lt) + cardSaldo(lt, 'R$ 38,70', lt > c.w('dois') ? 2 : 0));
cena('E a primeira missão... quem escolhe é *você.*', (lt) => quartoGamer(lt) + tavCorpo(lt, { expr: 'determinado', pose: 'aponta' }));
cena('Arrumar o *dente*... ou cortar o *cabelo?* Comenta aí.', (lt) => votoDividido(lt, rostoMini(275, 900, 0.62, lt, { expr: 'sorrisao' }), rostoMini(805, 900, 0.62, lt, { expr: 'surpreso' })), { dur: 4.5 });

window.CAPA = () => {
  let s = holofote(0.5, avatarHeroi(760, 1640, 0.85, 0.5)) + tavCorpo(0.5, { x: 300, y: 1700, esc: 0.85, expr: 'sem_graca' });
  s += `<rect x="40" y="120" width="1000" height="330" rx="24" fill="#000" opacity="0.55"/><text x="540" y="250" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="92" fill="#fff" stroke="#1F1A24" stroke-width="10" paint-order="stroke">ELA SÓ CONHECE</text><text x="540" y="380" text-anchor="middle" font-family="Baloo, sans-serif" font-weight="800" font-size="100" fill="#F7C531" stroke="#1F1A24" stroke-width="10" paint-order="stroke">O MEU AVATAR</text>`;
  return s;
};

criarEpisodio(E, { voz: 'pt-BR-AntonioNeural', velocidade: '+12%' });
