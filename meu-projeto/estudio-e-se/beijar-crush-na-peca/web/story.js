// "E se você tivesse que beijar a sua crush na peça?" — frames @30fps (voz atrasada 0.3 s = +9)
const T = (n) => n + 9;
const TOTAL = T(1625);
const FLASHES = [];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const tag = (f, f0, f1, text, y = 260) => (f >= f0 && f < f1 ? [{ type: 'tag', text, k: pop(f, f0) * (1 - prog(f, f1 - 6, f1)), y }] : []);
const say = (f, f0, x, y, text, o = {}) => (f >= f0 && (!o.f1 || f < o.f1) ? [Object.assign({ type: 'speech', x, y, text, fs: 54, k: pop(f, f0), tx: 0 }, o)] : []);
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
CAST.prof = Object.assign({}, CAST.diretora, { pj: '#3a86ff', pj2: '#9cc3ff', pants: '#1d3a7a', hc: '#5a3420' });
CAST.caio = { skin: '#8b5a3c', hair: 'cap', hc: '#1b1212', pj: '#2ec4b6', pj2: '#ffffff', pat: 'none', pants: '#1b4332', slip: '#ffffff', hand: '#8b5a3c' };

// ---- adereços ----
function crown(ctx, x, y, k = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.beginPath(); ctx.moveTo(-70, 30); ctx.lineTo(-80, -40); ctx.lineTo(-40, 0); ctx.lineTo(0, -60); ctx.lineTo(40, 0); ctx.lineTo(80, -40); ctx.lineTo(70, 30); ctx.closePath(); paint(ctx, '#ffd23f', INK, wink(0.8)); ell(ctx, 0, 10, 12, 12); paint(ctx, '#e63946'); ctx.restore(); }
function wand(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); rr(ctx, -8, 0, 16, 220, 8); paint(ctx, '#ffffff', INK, wink(0.6)); ctx.fillStyle = '#ffd23f'; star(ctx, 0, 0, 50); ctx.strokeStyle = INK; ctx.lineWidth = wink(0.6); ctx.stroke(); ctx.restore(); }
function cardbed(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); rr(ctx, -360, -120, 720, 120, 10); paint(ctx, '#c9a26b', INK, wink()); rr(ctx, -380, -300, 60, 300, 8); paint(ctx, '#b88a50', INK, wink()); ctx.fillStyle = '#7a5530'; ctx.font = '700 40px Comic Sans MS, Arial'; ctx.textAlign = 'center'; ctx.fillText('CAMA REAL', 0, -50); rr(ctx, -300, -160, 200, 60, 30); paint(ctx, '#ffffff', INK, wink(0.6)); ctx.restore(); }
function pillowface(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); rr(ctx, -150, -100, 300, 200, 60); paint(ctx, '#ffffff', INK, wink()); ctx.strokeStyle = '#e2468a'; ctx.lineWidth = 8; ell(ctx, -45, -20, 14, 14); ctx.stroke(); ell(ctx, 45, -20, 14, 14); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 20, 40, 0.2, Math.PI - 0.2); ctx.stroke(); ctx.fillStyle = '#e2468a'; ctx.font = '700 34px Comic Sans MS'; ctx.textAlign = 'center'; ctx.fillText('BIA', 0, 80); ctx.restore(); }
function camphone(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y); rr(ctx, -80, -140, 160, 280, 24); paint(ctx, '#1c1222', INK, wink()); rr(ctx, -64, -120, 128, 220, 12); paint(ctx, '#3a86ff'); if (f % 30 < 15) { ell(ctx, 40, -100, 12, 12); paint(ctx, '#ff2d55'); } ctx.restore(); }
function rolelist(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -300, -360, 600, 720, 12); paint(ctx, '#fffaf0', INK, wink()); ctx.fillStyle = '#3a0ca3'; ctx.textAlign = 'center'; ctx.font = '900 50px Arial Black, Arial'; ctx.fillText('A BELA ADORMECIDA', 0, -280);
  ctx.textAlign = 'left'; ctx.font = '700 44px Comic Sans MS, Arial'; (e.lines || []).forEach((l, i) => { ctx.fillStyle = l.hi ? '#d62839' : '#1c1222'; if (l.hi) { rr(ctx, -280, -175 + i * 90, 560, 70, 10); paint(ctx, '#fff3b0'); ctx.fillStyle = '#d62839'; } ctx.fillText(l.t, -260, -140 + i * 90); }); ctx.restore(); }
const _dfx = drawFx;
drawFx = function (ctx, fx, f) { const own = ['crown', 'wand', 'cardbed', 'pillowface', 'camphone', 'rolelist']; _dfx(ctx, (fx || []).filter((e) => !own.includes(e.type)), f);
  for (const e of fx || []) { if (e.type === 'crown') crown(ctx, e.x, e.y, e.k); if (e.type === 'wand') wand(ctx, e); if (e.type === 'cardbed') cardbed(ctx, e); if (e.type === 'pillowface') pillowface(ctx, e); if (e.type === 'camphone') camphone(ctx, e, f); if (e.type === 'rolelist') rolelist(ctx, e); } };
const _dp = drawProp;
drawProp = function (ctx, a, f) { if (a.type === 'bedprop') { cardbed(ctx, { x: a.x, y: a.by }); return; } _dp(ctx, a, f); };
const BED = { type: 'bedprop', x: 260, y: 120, by: 300, layer: 'front' };
const LYING = (o = {}) => G('bia', 560, 185, Object.assign({ rot: -1.5, expr: 'bliss', pose: 'hang', s: ks(185) }, o));
const CR = (x, y, s) => ({ type: 'crown', x, y: y - 1040 * s, k: s * 1.6 });
// ---- sala ----
const SEATS = [];
[[110, [-760, -380, 0, 380, 760]], [340, [-820, -410, 0, 410, 820]], [580, [-880, -440, 440, 880]]].forEach(([y, xs]) => xs.forEach((x) => SEATS.push([x, y])));
const KIDS = ['bia', 'lara', 'rita', 'caio', 'duda', 'nina', 'joana', 'sofia', 'g1', 'g3', 'g5', 'g7', 'g9'];
const BIA_SEAT = [-380, 110];
function classroom(f, o = {}) {
  const A = []; let gi = 0;
  SEATS.forEach(([x, y], i) => {
    A.push({ type: 'desk', x, y, s: ks(y) / 0.5, layer: 'front' });
    if (x === 0 && y === 340) { if (!o.noBoy) A.push(B(0, y - 12 + (o.sink || 0), Object.assign({ sit: true }, o.boy))); return; }
    const w = x === BIA_SEAT[0] && y === BIA_SEAT[1] ? 'bia' : KIDS[1 + (gi++ % (KIDS.length - 1))];
    if (w === 'bia' && o.noBia) return;
    const def = { sit: true, expr: 'neutral', look: [clamp((0 - x) / 500, -1, 1), 0.3], pose: 'hang', flip: x > 0 ? -1 : 1 };
    const per = typeof o.kid === 'function' ? o.kid(w, x, y, i) : (o.kid || {});
    A.push(G(w, x, y - 12, Object.assign(def, per, w === 'bia' ? o.bia || {} : {})));
  });
  return A;
}
const PROF = (x, y, o = {}) => G('prof', x, y, Object.assign({ expr: 'happy', look: [0.5, 0.2] }, o));


const STAGE = { set: 'stage', banner: 'A BELA ADORMECIDA' };
const PRINCE = (x, y, o = {}) => B(x, y, Object.assign({ cape: '#3a0ca3', expr: 'happy' }, o));
const SHOTS = [
  // 1 — gancho: no palco, o príncipe se abaixando pra princesa
  { f0: 0, f1: T(119), light: () => 'eve', lights: [{ x: 0, y: -300, r: 900, i: 1 }], dof: {},
    cam: [{ f: 0, x: 80, y: -200, z: 1.0 }, { f: T(119), x: 40, y: -210, z: 1.2 }],
    build(f) { return { world: STAGE, actors: [BED, LYING(), PRINCE(-230, 260, { expr: 'scared', sweat: 1, tilt: 0.3, look: [1, 0.5] })], fx: [CR(-230, 260, ks(260)), { type: 'hearts', x: -100, y: -450, n: 4 }], screen: tag(f, T(30), T(119), 'BEIJAR A CRUSH?! 😳') }; } },
  // 2 — a professora distribui os papéis
  { f0: T(120), f1: T(205), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(120), x: 0, y: -260, z: 1.0 }, { f: T(205), x: 0, y: -270, z: 1.1 }],
    build(f) { return { world: { set: 'class', board: 'TEATRO:\nA BELA ADORMECIDA' }, actors: [PROF(-250, 200, { pose: 'read', expr: 'happy', look: [1, 0] })], fx: [{ type: 'rolelist', x: 180, y: -350, s: 0.75, lines: [{ t: 'PRINCESA: ...' }, { t: 'PRÍNCIPE: ...' }, { t: 'DRAGÃO: CAIO' }, { t: 'ÁRVORE 1: LARA' }] }], screen: tag(f, T(140), T(205), 'OS PAPÉIS 📜') }; } },
  // 3 — a Bia é a princesa
  { f0: T(206), f1: T(266), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(206), x: -380, y: -220, z: 1.5 }, { f: T(266), x: -380, y: -230, z: 1.7 }],
    build(f) { return { world: { set: 'class' }, actors: classroom(f, { bia: { expr: 'proud', pose: 'cheeks', look: [0, -0.4] } }), fx: [CR(-380, 98, ks(98)), { type: 'sparkle', x: -380, y: -400, k: 0.8 }], screen: tag(f, T(225), T(266), 'PRINCESA: BIA 👑') }; } },
  // 4 — e o príncipe é você
  { f0: T(267), f1: T(338), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(267), x: 0, y: -200, z: 1.5 }, { f: T(295), x: 0, y: -200, z: 1.5 }, { f: T(300), x: 0, y: -180, z: 2.1, e: 'o' }, { f: T(338), x: 0, y: -180, z: 2.2 }],
    kicks: [{ f: T(300), a: 12 }],
    build(f) { const me = f >= T(300); return { world: { set: 'class' }, actors: classroom(f, { boy: { expr: me ? 'shocked' : 'neutral', pose: me ? 'cheeks' : 'hang', sweat: me ? 1 : 0, look: [0, -0.4] } }), fx: me ? [{ type: 'exclaim', x: 0, y: -480, k: pop(f, T(300)) * 0.6 }] : [], screen: tag(f, T(300), T(338), 'PRÍNCIPE: VOCÊ 🫵') }; } },
  // 5 — na cena final o príncipe beija a princesa
  { f0: T(339), f1: T(440), light: () => 'day', dof: {},
    cam: [{ f: T(339), x: 180, y: -350, z: 1.25 }, { f: T(440), x: 180, y: -380, z: 1.45 }],
    build(f) { return { world: { set: 'class' }, actors: [PROF(-250, 200, { pose: 'point', expr: 'mischief', look: [1, -0.3] })], fx: [{ type: 'rolelist', x: 180, y: -350, s: 0.75, lines: [{ t: 'PRINCESA: BIA' }, { t: 'PRÍNCIPE: VOCÊ' }, { t: 'CENA FINAL:', hi: f > T(345) }, { t: 'O BEIJO 💋', hi: f > T(389) }] }] }; } },
  // 6 — a sala inteira faz uuuh
  { f0: T(441), f1: T(525), light: () => 'day', dof: { room: 2 },
    cam: [{ f: T(441), x: 0, y: -260, z: 0.62 }, { f: T(525), x: 0, y: -280, z: 0.72 }],
    build(f) { return { world: { set: 'class' }, actors: classroom(f, { boy: { expr: 'scream', pose: 'cheeks', sweat: 1 }, kid: () => ({ expr: 'mischief', pose: 'point', look: [0, 0], tilt: Math.sin(f * 0.4) * 0.05 }), bia: { expr: 'bliss', pose: 'cheeks' } }), fx: [{ type: 'hearts', x: -380, y: -350, n: 4 }], screen: tag(f, T(489), T(525), 'UUUUUUH 😏') }; } },
  // 7 — a semana treinando com o travesseiro
  { f0: T(526), f1: T(633), light: () => 'eve', dof: { room: 3 },
    cam: [{ f: T(526), x: 0, y: -250, z: 1.3 }, { f: T(633), x: 0, y: -260, z: 1.45 }],
    build(f) { const d = Math.floor(prog(f, T(530), T(625)) * 7); return { world: { set: 'bedroom', sun: 0.2 }, actors: [PRINCE(-160, 300, { expr: d % 2 ? 'love' : 'scared', pose: 'hold', look: [1, 0], tilt: Math.sin(f * 0.15) * 0.1 })], fx: [{ type: 'pillowface', x: 140, y: -230, rot: Math.sin(f * 0.15) * 0.1 }, CR(-160, 300, ks(300))], screen: [{ type: 'tag', text: ['SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO', 'DOMINGO'][Math.min(6, d)], k: 1, y: 300 }] }; } },
  // 8 — chega o grande dia, teatro lotado
  { f0: T(634), f1: T(746), light: () => 'eve', lights: [{ x: 0, y: -300, r: 1100, i: 1 }], dof: {},
    cam: [{ f: T(634), x: 0, y: -400, z: 0.55 }, { f: T(746), x: 0, y: -380, z: 0.62 }],
    build(f) { return { world: STAGE, actors: [PRINCE(-500, 200, { expr: 'scared', sweat: 1, look: [0, 0.6] }), G('bia', 500, 200, { expr: 'happy', flip: -1 })], fx: [CR(-500, 200, ks(200)), CR(500, 200, ks(200)), { type: 'confetti', x: 0, y: -900, k: 0.5 }], screen: tag(f, T(693), T(746), 'TEATRO LOTADO 🎭') }; } },
  // 9 — sua mãe filmando na primeira fila
  { f0: T(747), f1: T(831), light: () => 'eve', lights: [{ x: 0, y: 0, r: 900, i: 0.9 }], dof: {},
    cam: [{ f: T(747), x: 0, y: 600, z: 1.1 }, { f: T(831), x: 0, y: 580, z: 1.25 }],
    build(f) { return { world: STAGE, actors: [G('mom', 0, 1100, { expr: 'proud', pose: 'hold', look: [0, -0.6] })], fx: [{ type: 'camphone', x: 40, y: 860 }, { type: 'hearts', x: 0, y: 560, n: 3 }], screen: tag(f, T(764), T(831), 'MÃE FILMANDO 📱') }; } },
  // 10 — a Bia deita na cama de papelão
  { f0: T(832), f1: T(910), light: () => 'eve', lights: [{ x: 160, y: -100, r: 800, i: 1 }], dof: {},
    cam: [{ f: T(832), x: 300, y: -150, z: 1.1 }, { f: T(910), x: 300, y: -160, z: 1.25 }],
    build(f) { const lay = sstep(prog(f, T(845), T(870))); return { world: STAGE, actors: [BED, LYING({ rot: -1.5 * lay, expr: lay > 0.5 ? 'bliss' : 'happy' })], fx: lay < 0.3 ? [CR(560, 185, ks(185))] : [], screen: tag(f, T(870), T(910), 'CAMA DE PAPELÃO 📦') }; } },
  // 11 — você se abaixa devagar... mais perto... mais perto
  { f0: T(911), f1: T(1070), light: () => 'eve', lights: [{ x: 0, y: -200, r: 700, i: 1 }], dof: {},
    cam: [{ f: T(911), x: 0, y: -200, z: 1.2 }, { f: T(976), x: -80, y: -180, z: 1.5 }, { f: T(1023), x: -40, y: -170, z: 1.7 }, { f: T(1070), x: -40, y: -170, z: 1.9 }],
    build(f) { const lean = sstep(prog(f, T(920), T(1060))); return { world: STAGE, actors: [BED, LYING(), PRINCE(-260 + lean * 70, 260, { expr: 'scared', sweat: 1, tilt: 0.1 + lean * 0.4, look: [1, 0.6], pose: 'hang' })], fx: [CR(-260 + lean * 70, 260, ks(260)), { type: 'hearts', x: -100, y: -400, n: 2 + Math.floor(lean * 6) }], screen: tag(f, T(976), T(1022), 'MAIS PERTO...').concat(tag(f, T(1023), T(1070), 'MAIS PERTO... 😳')) }; } },
  // 12 — você desmaia
  { f0: T(1071), f1: T(1209), light: () => 'eve', lights: [{ x: 0, y: -100, r: 900, i: 1 }], dof: {},
    cam: [{ f: T(1071), x: -40, y: -170, z: 1.9 }, { f: T(1100), x: -40, y: -170, z: 1.9 }, { f: T(1144), x: -150, y: -60, z: 0.9, e: 'o' }, { f: T(1209), x: -150, y: -60, z: 0.95 }],
    kicks: [{ f: T(1144), a: 16 }],
    build(f) { const fall = sstep(prog(f, T(1102), T(1144))); return { world: STAGE, actors: [BED, LYING({ expr: f > T(1150) ? 'surprised' : 'bliss' }), PRINCE(-190, 260, { expr: fall > 0.3 ? 'spooky' : 'scared', sweat: 1, tilt: 0.5 * (1 - fall), rot: fall * -1.5, look: [0, 0] })], fx: (f > T(1144) ? [{ type: 'dust', x: -450, y: 260, t: prog(f, T(1144), T(1180)) }, { type: 'lines', x: -450, y: 150, r: 300, k: 1 - prog(f, T(1144), T(1180)) }] : [{ type: 'sparkle', x: -100, y: -400, k: 0.6 }]), screen: tag(f, T(1102), T(1209), 'DESMAIOU 😵') }; } },
  // 13 — a plateia acha que é parte da peça
  { f0: T(1210), f1: T(1292), light: () => 'eve', lights: [{ x: 0, y: 0, r: 1200, i: 0.8 }], dof: {},
    cam: [{ f: T(1210), x: 0, y: 500, z: 0.75 }, { f: T(1292), x: 0, y: 480, z: 0.85 }],
    build(f) { return { world: STAGE, actors: [G('mom', -300, 1100, { expr: 'surprised', pose: 'hold', look: [0, -0.6] }), G('g2', 300, 1100, { expr: 'surprised', look: [0, -0.6] })], fx: [{ type: 'camphone', x: -260, y: 860 }], screen: tag(f, T(1214), T(1292), 'FAZ PARTE? 🤔') }; } },
  // 14 — a Bia levanta e encosta a varinha: "acorda, príncipe!"
  { f0: T(1293), f1: T(1459), light: () => 'eve', lights: [{ x: 0, y: -100, r: 900, i: 1 }], dof: {},
    cam: [{ f: T(1293), x: -300, y: -120, z: 1.0 }, { f: T(1459), x: -380, y: -140, z: 1.2 }],
    build(f) { const up = sstep(prog(f, T(1300), T(1325))), tap = f > T(1330); return { world: STAGE, actors: [BED, PRINCE(-190, 260, { expr: f > T(1400) ? 'love' : 'spooky', rot: -1.5, look: [0, 0] }), G('bia', lerp(300, -330, up), 230, { expr: 'mischief', pose: tap ? 'point' : 'hang', flip: -1, look: [-1, 0.6], walk: up > 0 && up < 1 ? f * 0.5 : null })], fx: [CR(lerp(300, -330, up), 230, ks(230))].concat(tap ? [{ type: 'wand', x: -560, y: 60, rot: -2.4 }, { type: 'sparkle', x: -640, y: 120, k: 0.8 }] : []).concat(say(f, T(1393), -330, -480, 'ACORDA, PRÍNCIPE! ✨', { fs: 46 })) }; } },
  // 15 — aplausos de pé
  { f0: T(1460), f1: T(1515), light: () => 'eve', lights: [{ x: 0, y: 0, r: 1300, i: 1 }], dof: {},
    cam: [{ f: T(1460), x: 0, y: -200, z: 0.6 }, { f: T(1515), x: 0, y: -220, z: 0.66 }],
    build(f) { return { world: STAGE, actors: [PRINCE(-250, 200, { expr: 'shocked', look: [0, 0.6] }), G('bia', 250, 200, { expr: 'proud', pose: 'clap', flip: -1 })], fx: [{ type: 'confetti', x: 0, y: -900, k: 1 }, CR(-250, 200, ks(200)), CR(250, 200, ks(200))], screen: tag(f, T(1462), T(1515), 'APLAUSOS DE PÉ 👏') }; } },
  // 16 — agora a escola inteira te chama de Bela Adormecida
  { f0: T(1516), f1: TOTAL - 1, light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(1516), x: 0, y: -260, z: 0.62 }, { f: TOTAL - 1, x: 0, y: -280, z: 0.75 }],
    build(f) { return { world: { set: 'class', board: 'BELA\nADORMECIDA 😴' }, actors: classroom(f, { boy: { expr: 'squint', pose: 'cheeks', sweat: 1 }, kid: () => ({ expr: 'laugh', look: [0, 0], tilt: Math.sin(f * 0.4) * 0.05 }), bia: { expr: 'bliss', pose: 'cheeks' } }), fx: [CR(0, 328, ks(328))], screen: tag(f, T(1560), TOTAL, 'BELA ADORMECIDA 😴') }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
