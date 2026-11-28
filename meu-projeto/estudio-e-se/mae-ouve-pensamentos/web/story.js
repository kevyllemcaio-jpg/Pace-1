// "E se a sua mãe pudesse ouvir os seus pensamentos?" — @30fps (voz +0.3 s = +9)
const T = (n) => n + 9;
const TOTAL = T(1640);
const FLASHES = [];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
const M = (x, y, o = {}) => G('mom', x, y, Object.assign({ expr: 'happy' }, o));
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const tag = (f, f0, f1, text, y = 300) => (f >= f0 && f < f1 ? [{ type: 'tag', text, k: pop(f, f0) * (1 - prog(f, f1 - 6, f1)), y }] : []);
const say = (f, f0, x, y, text, o = {}) => (f >= f0 && (!o.f1 || f < o.f1) ? [Object.assign({ type: 'speech', x, y, text, fs: 48, k: pop(f, f0), tx: 0 }, o)] : []);
const think = (f, f0, x, y, text, o = {}) => (f >= f0 && (!o.f1 || f < o.f1) ? [Object.assign({ type: 'thought', x, y, w: 640, h: 320, hx: o.hx == null ? x : o.hx, hy: o.hy == null ? y + 300 : o.hy, text, fs: 50, k: pop(f, f0) }, o)] : []);
const ears = (f, x, y) => [{ type: 'waves', x, y, r: 60, col: 'rgba(120,80,255,.9)' }];
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
// vaso colado com fita + pilha de louça
function vase(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); ctx.scale(e.s || 1, e.s || 1);
  ctx.beginPath(); ctx.moveTo(-60, -200); ctx.quadraticCurveTo(-150, -60, -90, 60); ctx.lineTo(90, 60); ctx.quadraticCurveTo(150, -60, 60, -200); ctx.closePath(); paint(ctx, '#3a86ff', INK, wink());
  rr(ctx, -70, -230, 140, 40, 10); paint(ctx, '#2a6fdb', INK, wink(0.8));
  ctx.strokeStyle = PLUM; ctx.lineWidth = wink(0.7); ctx.beginPath(); ctx.moveTo(-90, -120); ctx.lineTo(-20, -60); ctx.lineTo(-60, 10); ctx.moveTo(40, -170); ctx.lineTo(80, -40); ctx.stroke();
  for (const [x, y, r] of [[-50, -90, 0.6], [55, -110, -0.5], [-30, -10, -0.2]]) { ctx.save(); ctx.translate(x, y); ctx.rotate(r); rr(ctx, -70, -16, 140, 32, 4); paint(ctx, 'rgba(255,240,180,.9)', INK, wink(0.5)); ctx.restore(); }
  ctx.restore(); }
function dishes(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y); for (let i = 0; i < e.n; i++) { const x = Math.sin(i * 1.7) * 18 + (i % 2) * 6, y = -i * 30; ell(ctx, x, y, 130, 24); paint(ctx, i % 3 ? '#ffffff' : '#ffd6e0', INK, wink(0.7)); } ctx.restore(); }
function spoon(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); rr(ctx, -8, -90, 16, 140, 8); paint(ctx, '#c0c4cc', INK, wink(0.6)); ell(ctx, 0, -110, 30, 40); paint(ctx, '#d9dde3', INK, wink(0.6)); ctx.restore(); }
const _dfx = drawFx;
drawFx = function (ctx, fx, f) { _dfx(ctx, (fx || []).filter((e) => !['vase', 'dishes', 'spoon'].includes(e.type)), f); for (const e of fx || []) { if (e.type === 'vase') vase(ctx, e); if (e.type === 'dishes') dishes(ctx, e, f); if (e.type === 'spoon') spoon(ctx, e); } };
const TABLE = { type: 'table', x: 0, y: 420, trays: [-250, 250], layer: 'front' };
const ROOM = { set: 'room', tvOn: false, day: 1 };
const _dw = drawWindow;
drawWindow = function (ctx, st, cam, f) { if (!st.day) return _dw(ctx, st, cam, f); const x0 = -850, y0 = -1350, w = 460, h = 620;
  rr(ctx, x0 - 32, y0 - 32, w + 64, h + 64, 14); paint(ctx, '#f6ead2', INK, wink()); ctx.save(); rr(ctx, x0, y0, w, h, 4); ctx.clip();
  const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, '#6ec6ff'); g.addColorStop(1, '#d8f1ff'); ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
  ell(ctx, x0 + 330, y0 + 140, 70, 70); paint(ctx, '#ffd23f', INK, wink(0.8));
  for (const [cx, cy] of [[x0 + 120 + (f * 0.6) % 200, y0 + 260], [x0 + 300, y0 + 420]]) { for (const [dx, r] of [[-50, 40], [0, 55], [50, 40]]) { ell(ctx, cx + dx, cy, r, r * 0.8); paint(ctx, '#ffffff'); } }
  ctx.fillStyle = '#7bc96f'; ctx.fillRect(x0, y0 + h - 120, w, 120); ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = wink(1); ctx.beginPath(); ctx.moveTo(x0 + w / 2, y0); ctx.lineTo(x0 + w / 2, y0 + h); ctx.moveTo(x0, y0 + h / 2); ctx.lineTo(x0 + w, y0 + h / 2); ctx.stroke(); };
const breakfast = (f, boy = {}, mom = {}) => [B(-250, 330, Object.assign({ sit: true, flip: 1, look: [1, 0], expr: 'happy' }, boy)), M(250, 330, Object.assign({ sit: true, flip: -1, look: [-1, 0] }, mom)), TABLE];

const SHOTS = [
  // 1 — gancho: ela ouve tudo
  { f0: 0, f1: T(108), light: () => 'day', dof: { room: 3 },
    cam: [{ f: 0, x: 0, y: -300, z: 1.0 }, { f: T(108), x: 0, y: -310, z: 1.12 }],
    build(f) { return { world: ROOM, actors: breakfast(f, { expr: 'scared', sweat: 1, pose: 'cheeks' }, { expr: 'squint', look: [-1, 0] }), fx: think(f, T(10), -170, -640, 'NÃO PENSA...\nNÃO PENSA!', { hx: -250, hy: -120, shake: 6 }).concat(ears(f, 330, -300)), screen: tag(f, T(40), T(108), 'ELA OUVE TUDO?! 👂') }; } },
  // 2 — café da manhã
  { f0: T(109), f1: T(158), light: () => 'day', dof: {},
    cam: [{ f: T(109), x: 0, y: -500, z: 0.6 }, { f: T(158), x: 0, y: -420, z: 0.75 }],
    build(f) { return { world: ROOM, actors: breakfast(f, { expr: 'bliss' }, { expr: 'happy' }), fx: [{ type: 'sparkle', x: 0, y: 60, k: 0.6 }], screen: tag(f, T(112), T(158), 'CAFÉ DA MANHÃ ☕') }; } },
  // 3 — "fez a lição?"
  { f0: T(159), f1: T(241), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(159), x: 250, y: -200, z: 1.5 }, { f: T(241), x: 250, y: -210, z: 1.65 }],
    build(f) { return { world: ROOM, actors: breakfast(f, {}, { expr: 'mischief', pose: 'point' }), fx: say(f, T(167), 200, -560, 'FEZ A LIÇÃO? 📚', { fs: 46 }) }; } },
  // 4 — "claro que fiz!"
  { f0: T(242), f1: T(327), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(242), x: -250, y: -200, z: 1.5 }, { f: T(327), x: -250, y: -210, z: 1.65 }],
    build(f) { return { world: ROOM, actors: breakfast(f, { expr: 'proud', pose: 'hero' }), fx: say(f, T(277), -250, -560, 'CLARO QUE FIZ! 😎', { fs: 46 }) }; } },
  // 5 — e pensa: nem abri a mochila
  { f0: T(328), f1: T(412), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(328), x: -100, y: -260, z: 1.2 }, { f: T(412), x: -100, y: -280, z: 1.3 }],
    build(f) { return { world: ROOM, actors: breakfast(f, { expr: 'proud', pose: 'hero' }, { expr: f > T(370) ? 'surprised' : 'happy' }), fx: think(f, T(340), -110, -640, 'NEM ABRI A\nMOCHILA 🎒', { hx: -250, hy: -120 }).concat(f > T(360) ? ears(f, 330, -300) : []) }; } },
  // 6 — ela larga a colher
  { f0: T(413), f1: T(469), light: () => 'day', dof: { room: 4 },
    cam: [{ f: T(413), x: 250, y: -200, z: 1.6 }, { f: T(420), x: 250, y: -230, z: 2.0, e: 'o' }, { f: T(469), x: 250, y: -230, z: 2.1 }],
    kicks: [{ f: T(432), a: 10 }],
    build(f) { const d = prog(f, T(420), T(440)); return { world: ROOM, actors: breakfast(f, {}, { expr: 'shocked', pose: 'cheeks' }), fx: [{ type: 'spoon', x: 330, y: lerp(-150, 120, d * d), rot: d * 2.5 }, { type: 'exclaim', x: 250, y: -560, k: pop(f, T(422)) * 0.6 }], screen: tag(f, T(432), T(469), 'PLINC! 🥄') }; } },
  // 7 — tenta pensar em outra coisa
  { f0: T(470), f1: T(548), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(470), x: -250, y: -230, z: 1.5 }, { f: T(548), x: -250, y: -240, z: 1.6 }],
    build(f) { return { world: ROOM, actors: breakfast(f, { expr: 'worried', pose: 'cheeks', sweat: 1, tilt: Math.sin(f * 0.3) * 0.08 }), fx: think(f, T(480), -250, -620, 'OUTRA COISA...\nOUTRA COISA...', { hx: -250, hy: -150, shake: 4 }) }; } },
  // 8 — no jogo novo
  { f0: T(549), f1: T(600), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(549), x: -250, y: -230, z: 1.5 }, { f: T(600), x: -250, y: -240, z: 1.6 }],
    build(f) { return { world: ROOM, actors: breakfast(f, { expr: 'bliss', pose: 'controller', props: { controller: 1 } }), fx: think(f, T(552), -250, -620, 'JOGO NOVO! 🎮', { hx: -250, hy: -150, col: '#fff3b0' }) }; } },
  // 9 — "que jogo novo?"
  { f0: T(601), f1: T(682), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(601), x: 250, y: -200, z: 1.5 }, { f: T(682), x: 250, y: -210, z: 1.7 }],
    build(f) { return { world: ROOM, actors: breakfast(f, {}, { expr: 'squint', look: [-1, 0] }), fx: say(f, T(610), 200, -560, 'QUE JOGO NOVO? 🤨', { fs: 46 }).concat(ears(f, 330, -300)) }; } },
  // 10 — comprado com o dinheiro do lanche
  { f0: T(683), f1: T(798), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(683), x: -120, y: -260, z: 1.2 }, { f: T(798), x: -120, y: -280, z: 1.35 }],
    kicks: [{ f: T(745), a: 6 }],
    build(f) { return { world: ROOM, actors: breakfast(f, { expr: f > T(745) ? 'scream' : 'mischief', pose: 'cheeks', sweat: f > T(745) ? 1 : 0 }, { expr: 'squint' }), fx: think(f, T(692), -110, -660, 'COMPREI COM O\nDINHEIRO DO\nLANCHE 💸', { hx: -250, hy: -150, fs: 42, h: 340 }).concat(f > T(745) ? [{ type: 'money', x: -300, y: -900, k: 1 }] : []) }; } },
  // 11 — ela cruza os braços
  { f0: T(799), f1: T(863), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(799), x: 0, y: -380, z: 0.95 }, { f: T(863), x: 0, y: -380, z: 1.05 }],
    build(f) { const up = sstep(prog(f, T(800), T(815))); return { world: ROOM, actors: [B(-250, 330, { sit: true, flip: 1, expr: 'scared', sweat: 1, look: [1, -0.3] }), M(250, lerp(330, 300, up), { sit: up < 0.5, flip: -1, expr: 'stern', pose: 'hips', look: [-1, 0.2] }), TABLE], fx: [{ type: 'anger', x: 380, y: -560, k: pop(f, T(820)) }] }; } },
  // 12 — pânico: o vaso atrás do sofá
  { f0: T(864), f1: T(1037), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(864), x: -250, y: -260, z: 1.3 }, { f: T(950), x: -250, y: -280, z: 1.45 }, { f: T(962), x: -250, y: -300, z: 1.9, e: 'o' }, { f: T(1037), x: -250, y: -300, z: 2.0 }],
    kicks: [{ f: T(960), a: 12 }],
    build(f) { const vaso = f >= T(960); return { world: ROOM, actors: breakfast(f, { expr: vaso ? 'scream' : 'scared', pose: 'cheeks', sweat: 1, tilt: Math.sin(f * 0.8) * 0.06 }), fx: vaso ? think(f, T(960), -250, -620, 'O VASO QUEBRADO\nATRÁS DO SOFÁ 🏺', { hx: -250, hy: -150, fs: 40, col: '#ffd6d6', shake: 5 }) : think(f, T(870), -250, -620, 'NÃO PENSA NO PIOR!\nNÃO PENSA!', { hx: -250, hy: -150, fs: 40, shake: 8 }), screen: tag(f, T(886), T(960), 'PÂNICO 😱') }; } },
  // 13 — silêncio
  { f0: T(1038), f1: T(1082), light: () => 'day', dof: {},
    cam: [{ f: T(1038), x: 0, y: -380, z: 0.95 }, { f: T(1082), x: 0, y: -380, z: 1.0 }],
    build(f) { const turn = f > T(1060); return { world: ROOM, actors: [B(-250, 330, { sit: true, flip: 1, expr: 'shocked', sweat: 1, look: [1, 0] }), M(250, 300, { flip: turn ? 1 : -1, expr: 'stern', pose: 'hips', look: turn ? [1, 0] : [-1, 0] }), TABLE], screen: tag(f, T(1040), T(1082), 'SILÊNCIO...') }; } },
  // 14 — ela vai até o sofá e puxa
  { f0: T(1083), f1: T(1183), light: () => 'day', dof: {},
    cam: [{ f: T(1083), x: 300, y: -320, z: 0.85 }, { f: T(1140), x: 480, y: -250, z: 1.15 }, { f: T(1183), x: 480, y: -250, z: 1.25 }],
    kicks: [{ f: T(1146), a: 8 }],
    build(f) { const w = walkTo(f, T(1088), T(1140), [-700, 320], [560, 200]); const pull = f > T(1146); return { world: ROOM, actors: [M(w.x, w.y, { walk: w.walk, flip: 1, expr: 'stern', pose: pull ? 'up' : 'hang', look: [1, 0.3], hop: pull ? 30 : 0 })], screen: tag(f, T(1146), T(1183), 'PUXA! 💪') }; } },
  // 15 — acha o vaso colado com fita
  { f0: T(1184), f1: T(1270), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(1184), x: 0, y: -300, z: 1.3 }, { f: T(1270), x: 0, y: -320, z: 1.5 }],
    build(f) { const up = sstep(prog(f, T(1186), T(1205))); return { world: ROOM, actors: [M(0, 250, { expr: 'surprised', pose: 'hold', look: [0, 0.3] })], fx: [{ type: 'vase', x: 0, y: lerp(150, -110, up), s: 0.55 }, { type: 'sparkle', x: 0, y: -600, k: 0.7 }], screen: tag(f, T(1217), T(1270), 'COLADO COM FITA 🩹') }; } },
  // 16 — "eu te amo, mãe"
  { f0: T(1271), f1: T(1425), light: () => 'dream', dof: { room: 4 },
    cam: [{ f: T(1271), x: -250, y: -240, z: 1.4 }, { f: T(1425), x: -250, y: -260, z: 1.7 }],
    build(f) { const big = f >= T(1369); return { world: ROOM, actors: breakfast(f, { expr: big ? 'love' : 'bliss', pose: 'cheeks' }), fx: think(f, T(1300), -250, -650, big ? 'EU TE AMO,\nMÃE! ❤️' : 'PENSA ALTO...', { hx: -250, hy: -150, fs: big ? 56 : 44, col: big ? '#ffd6e0' : '#ffffff' }).concat(big ? [{ type: 'hearts', x: -250, y: -320, n: 8 }] : []) }; } },
  // 17 — ela suspira... funcionou
  { f0: T(1426), f1: T(1525), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(1426), x: 0, y: -330, z: 1.05 }, { f: T(1525), x: 0, y: -340, z: 1.2 }],
    build(f) { const melt = f > T(1450); return { world: ROOM, actors: [B(-150, 320, { expr: 'bliss', pose: melt ? 'cling' : 'cheeks', look: [1, -0.3] }), M(150, 300, { flip: -1, expr: melt ? 'bliss' : 'stern', pose: melt ? 'cheeks' : 'hips', look: [-1, 0.3] })], fx: melt ? [{ type: 'hearts', x: 0, y: -480, n: 6 }] : [], screen: tag(f, T(1478), T(1525), 'FUNCIONOU 🥹') }; } },
  // 18 — mas agora lava a louça do mês
  { f0: T(1526), f1: TOTAL - 1, light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(1526), x: 0, y: -380, z: 1.1 }, { f: T(1560), x: 0, y: -600, z: 0.8 }, { f: TOTAL - 1, x: 0, y: -620, z: 0.78 }],
    build(f) { return { world: ROOM, actors: [B(-220, 330, { expr: 'bored', pose: 'hold', sweat: 1, look: [1, -0.5], tilt: Math.sin(f * 0.4) * 0.05 }), M(420, 300, { flip: -1, expr: 'proud', pose: 'hips', look: [-1, 0] }), Object.assign({}, TABLE, { trays: [] })], fx: [{ type: 'dishes', x: 60, y: 130, n: Math.min(30, 6 + Math.floor(prog(f, T(1530), T(1580)) * 24)) }], screen: tag(f, T(1560), TOTAL, 'LOUÇA DO MÊS INTEIRO 🧽') }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
