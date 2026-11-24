// "E se o seu diário fosse lido em voz alta na sala?" — frames @30fps (voz atrasada 0.3 s = +9)
const T = (n) => n + 9;
const TOTAL = T(1440);
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
// ---- o diário (fechado / aberto) desenhado como fx ----
function diary(ctx, e, f) {
  ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); const k = (e.s || 1) * (e.k == null ? 1 : e.k); ctx.scale(k, k);
  if (!e.open) {
    rr(ctx, -120, -160, 240, 320, 18); paint(ctx, '#ff5fa2', INK, wink());
    rr(ctx, -120, -160, 40, 320, 10); paint(ctx, '#e2468a', INK, wink(0.7));
    ctx.fillStyle = '#ffffff'; heart(ctx, 20, -20, 46); ctx.strokeStyle = PLUM; ctx.lineWidth = wink(0.7); ctx.stroke();
    rr(ctx, 100, -30, 40, 60, 8); paint(ctx, '#ffd23f', INK, wink(0.6));
    ctx.fillStyle = '#ffffff'; ctx.font = '900 34px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.fillText('DIÁRIO', 10, 100);
  } else {
    for (const sx of [-1, 1]) { rr(ctx, sx < 0 ? -420 : 0, -300, 420, 600, 14); paint(ctx, '#fffaf0', INK, wink()); }
    ctx.strokeStyle = 'rgba(80,120,200,.35)'; ctx.lineWidth = 3;
    for (let i = 0; i < 9; i++) for (const x0 of [-400, 20]) { ctx.beginPath(); ctx.moveTo(x0, -200 + i * 58); ctx.lineTo(x0 + 380, -200 + i * 58); ctx.stroke(); }
    ctx.fillStyle = '#3a2a5a'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = '700 56px Comic Sans MS, Arial';
    (e.left || 'Querido diário,\nhoje a Bia\nsorriu pra\nmim ♡').split('\n').forEach((l, i) => ctx.fillText(l, -395, -220 + i * 70 + 29));
    if (e.right) { const n = e.chars == null ? 999 : e.chars; let used = 0; ctx.fillStyle = e.rcol || '#3a2a5a'; ctx.font = e.rfont || '700 40px Comic Sans MS, Arial';
      e.right.split('\n').forEach((l, i) => { const s = l.slice(0, Math.max(0, n - used)); used += l.length; ctx.fillText(s, 30, -220 + i * 80 + 29); }); }
  }
  ctx.restore();
}
function mirror(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -260, -420, 520, 840, 200); paint(ctx, '#c9e8f5', INK, wink(1.4)); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(-150, -250); ctx.lineTo(-60, -340); ctx.stroke(); ctx.restore(); }
const _dfx = drawFx;
drawFx = function (ctx, fx, f) { _dfx(ctx, (fx || []).filter((e) => !['diary', 'mirror2'].includes(e.type)), f); for (const e of fx || []) { if (e.type === 'diary') diary(ctx, e, f); if (e.type === 'mirror2') mirror(ctx, e, f); } };
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

const SHOTS = [
  // 1 — gancho: a professora lendo o diário rosa na frente da sala
  { f0: 0, f1: T(125), light: () => 'day', dof: {},
    cam: [{ f: 0, x: -260, y: -300, z: 0.78 }, { f: T(125), x: -260, y: -320, z: 0.88 }],
    build(f) { return { world: { set: 'class', board: 'REDAÇÃO:\nMINHAS FÉRIAS' }, actors: classroom(f, { boy: { expr: 'scream', pose: 'cheeks', sweat: 1, look: [0, -0.6] }, kid: { expr: 'laugh', look: [0, -0.6] } }).concat([PROF(-560, -40, { pose: 'read', expr: 'happy', look: [0.6, 0] })]),
      fx: [{ type: 'diary', x: -560, y: -250, s: 0.4, rot: -0.1 }].concat(say(f, T(20), -480, -760, 'QUERIDO DIÁRIO...', { fs: 80 })), screen: tag(f, T(40), T(125), 'MEU DIÁRIO?!', 300) }; } },
  // 2 — esqueceu em cima da carteira
  { f0: T(126), f1: T(212), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(126), x: 0, y: -200, z: 1.2 }, { f: T(212), x: 0, y: -160, z: 1.4 }],
    build(f) { const w = walkTo(f, T(140), T(190), [260, 330], [1500, 330]); return { world: { set: 'class' }, actors: [{ type: 'desk', x: 0, y: 330, s: 1.06, layer: 'front' }, B(w.x, w.y, { walk: w.walk, flip: 1, expr: 'happy', look: [1, 0] })],
      fx: [{ type: 'diary', x: 0, y: 5, s: 0.55, rot: 1.45 }, { type: 'sparkle', x: 0, y: -120, k: 0.7 }], screen: tag(f, T(160), T(212), 'ESQUECEU 😬', 300) }; } },
  // 3 — a professora achou
  { f0: T(213), f1: T(268), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(213), x: 120, y: -150, z: 1.15 }, { f: T(268), x: 120, y: -170, z: 1.3 }],
    build(f) { const up = sstep(prog(f, T(222), T(240))); return { world: { set: 'class' }, actors: [{ type: 'desk', x: 0, y: 330, s: 1.06, layer: 'front' }, PROF(260, 200, { flip: -1, look: [-1, 0.5 - up], expr: up > 0.5 ? 'surprised' : 'neutral', pose: up > 0.5 ? 'read' : 'hang' })],
      fx: [{ type: 'diary', x: lerp(0, 220, up), y: lerp(5, -170, up), s: lerp(0.55, 0.42, up), rot: lerp(1.45, -0.1, up) }].concat(up > 0.9 ? [{ type: 'exclaim', x: 260, y: -620, k: pop(f, T(242)) * 0.8 }] : []) }; } },
  // 4 — achou que era a redação
  { f0: T(269), f1: T(340), light: () => 'day', dof: {},
    cam: [{ f: T(269), x: 100, y: -800, z: 0.75 }, { f: T(340), x: 100, y: -780, z: 0.82 }],
    build(f) { return { world: { set: 'class', board: 'REDAÇÃO:\nMINHAS FÉRIAS' }, actors: [PROF(400, -60, { pose: 'point', flip: -1, expr: 'proud', look: [-1, -0.4] })], fx: [{ type: 'diary', x: 470, y: -330, s: 0.35 }, { type: 'arrow', x: 0, y: -620, k: pop(f, T(285)) }].filter((e) => e.type !== 'arrow' || f > T(285)), screen: tag(f, T(290), T(340), 'ERA A REDAÇÃO?! 📝', 300) }; } },
  // 5 — arruma os óculos e começa
  { f0: T(341), f1: T(396), light: () => 'day', dof: { room: 4 },
    cam: [{ f: T(341), x: 0, y: -230, z: 1.6 }, { f: T(396), x: 0, y: -250, z: 1.85 }],
    build(f) { const adj = f < T(370); return { world: { set: 'class' }, actors: [PROF(0, 200, { pose: adj ? { L: [12, 6], R: [150, 140] } : 'read', expr: adj ? 'mischief' : 'happy', look: [0, 0] })], fx: adj ? [{ type: 'sparkle', x: 40, y: -330, k: 0.6 }] : [{ type: 'diary', x: 0, y: -150, s: 0.4 }], screen: tag(f, T(372), T(396), 'AHAM... 🤓', 300) }; } },
  // 6 — "Querido diário, hoje a Bia sorriu pra mim"
  { f0: T(397), f1: T(497), light: () => 'day', dof: {},
    cam: [{ f: T(397), x: 0, y: -260, z: 0.9 }, { f: T(497), x: 0, y: -250, z: 1.0 }],
    build(f) { return { world: { set: 'class' }, actors: [], fx: [{ type: 'diary', open: true, x: 0, y: -260, s: 1.25 }].concat(f > T(440) ? [{ type: 'hearts', x: 300, y: -560, n: 4 }] : []), screen: tag(f, T(405), T(497), 'QUERIDO DIÁRIO... 💕', 300) }; } },
  // 7 — a sala inteira vira pra Bia
  { f0: T(498), f1: T(571), light: () => 'day', dof: { room: 2 },
    cam: [{ f: T(498), x: -150, y: -260, z: 0.75 }, { f: T(524), x: -150, y: -260, z: 0.75 }, { f: T(530), x: -380, y: -230, z: 1.5, e: 'o' }, { f: T(571), x: -380, y: -240, z: 1.6 }],
    kicks: [{ f: T(528), a: 8 }],
    build(f) { const turn = f > T(524); return { world: { set: 'class' }, actors: classroom(f, { boy: { expr: 'scared', sweat: 1, look: [-1, 0] }, kid: (w, x) => ({ expr: turn ? 'mischief' : 'neutral', look: turn ? [clamp((-380 - x) / 300, -1, 1), 0] : [0, -0.6] }), bia: { expr: turn ? 'bliss' : 'neutral', pose: turn ? 'cheeks' : 'hang', look: [0, -0.5] } }),
      fx: turn ? [{ type: 'hearts', x: -380, y: -520, n: 5 }] : [], screen: tag(f, T(530), T(571), 'OOOOOH 👀', 300) }; } },
  // 8 — você afunda na cadeira
  { f0: T(572), f1: T(637), light: () => 'day', dof: { room: 4 },
    cam: [{ f: T(572), x: 0, y: -150, z: 1.6 }, { f: T(637), x: 0, y: -60, z: 1.75 }],
    build(f) { const s = sstep(prog(f, T(580), T(615))); return { world: { set: 'class' }, actors: [{ type: 'desk', x: 0, y: 330, s: 1.06, layer: 'front' }, B(0, 318 + s * 160, { sit: true, expr: 'scared', pose: 'cheeks', sweat: 1, look: [0, -0.3] })], screen: tag(f, T(600), T(637), 'ME ENTERRA 🫠', 300) }; } },
  // 9 — treinou "oi" no espelho 40 vezes
  { f0: T(638), f1: T(705), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(638), x: 0, y: -280, z: 1.4 }, { f: T(705), x: 0, y: -300, z: 1.55 }],
    build(f) { return { world: { set: 'class' }, actors: [PROF(0, 200, { pose: 'read', expr: 'grin', look: [0, 0] })], fx: [{ type: 'diary', x: 0, y: -150, s: 0.4 }].concat(say(f, T(668), 0, -620, 'TREINEI FALAR OI\nNO ESPELHO...', { fs: 46 })) }; } },
  { f0: T(706), f1: T(773), light: () => 'eve', dof: { room: 3 },
    cam: [{ f: T(706), x: 40, y: -170, z: 1.3 }, { f: T(773), x: 40, y: -180, z: 1.45 }],
    build(f) { const n = Math.min(40, Math.floor(prog(f, T(712), T(740)) * 40) + 1); return { world: { set: 'bedroom' }, actors: [B(-160, 300, { pose: 'wave', expr: n % 2 ? 'grin' : 'happy', look: [1, 0], flip: 1, tilt: Math.sin(f * 0.6) * 0.06 })],
      fx: [{ type: 'mirror2', x: 250, y: -60, s: 0.55 }].concat(say(f, T(712), -160, -520, 'OI, BIA! 👋', { fs: 50 })), screen: [{ type: 'tag', text: `${n}ª VEZ`, k: 1, y: 300 }] }; } },
  // 10 — o Caio cai da cadeira de tanto rir
  { f0: T(774), f1: T(856), light: () => 'day', dof: { room: 2 },
    cam: [{ f: T(774), x: 300, y: -160, z: 0.95 }, { f: T(856), x: 300, y: -150, z: 1.05 }],
    kicks: [{ f: T(792), a: 10 }],
    build(f) { const fall = sstep(prog(f, T(784), T(795))); return { world: { set: 'class' }, actors: classroom(f, { boy: { expr: 'squint', sweat: 1, look: [1, 0] }, kid: (w) => ({ expr: 'laugh', tilt: Math.sin(f * 0.5) * 0.08, look: [0, -0.3] }) }).map((a) => (a.who === 'caio' ? Object.assign(a, { rot: fall * 1.4, y: a.y + fall * 120, sit: fall < 0.5, pose: fall > 0.5 ? 'fallen' : 'cheeks' }) : a)),
      fx: [{ type: 'lines', x: 380, y: -300, r: 260, k: 1 - prog(f, T(795), T(830)) }], screen: tag(f, T(795), T(856), 'KKKKKKKK', 300) }; } },
  // 11 — você tenta pegar o diário
  { f0: T(857), f1: T(922), light: () => 'day', dof: {},
    cam: [{ f: T(857), x: -250, y: -300, z: 0.95 }, { f: T(922), x: -300, y: -320, z: 1.05 }],
    build(f) { const w = walkTo(f, T(860), T(895), [400, 300], [-250, 220]); const up = sstep(prog(f, T(895), T(915))); return { world: { set: 'class' }, actors: [B(w.x, w.y, { walk: w.walk ? w.walk * 1.6 : null, flip: -1, expr: 'scream', pose: up > 0.2 ? 'up' : { L: [40, 60], R: [40, 60] }, look: [-1, -0.6], hop: up * 80 }), PROF(-700, 200, { pose: 'up', expr: 'mischief', look: [1, 0] })],
      fx: [{ type: 'diary', x: -680, y: -640, s: 0.4, rot: Math.sin(f * 0.3) * 0.1 }], screen: tag(f, T(870), T(922), 'DEVOLVE!!', 300) }; } },
  // 12 — a última frase: "amanhã eu conto tudo pra ela"
  { f0: T(923), f1: T(1097), light: () => 'day', dof: { room: 2 },
    cam: [{ f: T(923), x: 100, y: -350, z: 1.0 }, { f: T(1015), x: 50, y: -420, z: 1.3 }, { f: T(1097), x: 50, y: -430, z: 1.4 }],
    build(f) { return { world: { set: 'class' }, actors: [PROF(0, 200, { pose: 'up', expr: 'proud', look: [0, -0.8] }), B(380, 260, { expr: 'scared', pose: 'up', sweat: 1, look: [-1, -0.7], flip: -1, hop: Math.abs(Math.sin(f * 0.35)) * 90 })],
      fx: [{ type: 'diary', x: 0, y: -660, s: 0.4, rot: Math.sin(f * 0.1) * 0.05 }, { type: 'sparkle', x: 0, y: -680, k: 0.7 }].concat(say(f, T(1023), 60, -930, 'AMANHÃ EU CONTO\nTUDO PRA ELA!', { fs: 50 })) }; } },
  // 13 — silêncio
  { f0: T(1098), f1: T(1142), light: () => 'day', dof: {},
    cam: [{ f: T(1098), x: 0, y: -260, z: 0.62 }, { f: T(1142), x: 0, y: -270, z: 0.7 }],
    build(f) { return { world: { set: 'class' }, actors: classroom(f, { boy: { expr: 'shocked', sweat: 1, look: [-0.6, 0] }, kid: () => ({ expr: 'surprised', look: [0, 0] }), bia: { expr: 'surprised', look: [1, 0] } }), screen: tag(f, T(1100), T(1142), 'SILÊNCIO...', 300) }; } },
  // 14 — a Bia levanta, vai até a sua carteira e escreve
  { f0: T(1143), f1: T(1310), light: () => 'day', dof: { room: 2 },
    cam: [{ f: T(1143), x: -200, y: -260, z: 0.8 }, { f: T(1215), x: -120, y: -230, z: 1.3 }, { f: T(1310), x: -120, y: -230, z: 1.45 }],
    build(f) { const w = walkTo(f, T(1150), T(1205), [-380, 110], [-330, 360]); const write = f > T(1225); return { world: { set: 'class' }, actors: classroom(f, { noBia: true, boy: { expr: write ? 'love' : 'shocked', sweat: write ? 0 : 1, look: [-1, 0] }, kid: () => ({ expr: 'surprised', look: [0, 0] }) }).concat([G('bia', w.x, w.y, { walk: w.walk, flip: 1, expr: 'bliss', pose: write ? 'write' : 'hang', look: [1, 0.4] })]),
      fx: write ? [{ type: 'hearts', x: -150, y: -550, n: 4 }] : [] }; } },
  // 15 — "Eu também treinei. Quarenta e uma vezes."
  { f0: T(1311), f1: TOTAL - 1, light: () => 'day', dof: {},
    cam: [{ f: T(1311), x: 0, y: -260, z: 0.9 }, { f: TOTAL - 1, x: 0, y: -260, z: 1.02 }],
    build(f) { const n = Math.floor(prog(f, T(1312), T(1395)) * 40); return { world: { set: 'class' }, actors: [], fx: [{ type: 'diary', open: true, x: 0, y: -260, s: 1.25, left: 'amanhã eu\nconto tudo\npra ela.', right: 'eu também\ntreinei. ♡\n41 vezes.', rcol: '#e2468a', rfont: '700 64px Comic Sans MS, Arial', chars: n }].concat(f > T(1395) ? [{ type: 'hearts', x: 0, y: -720, n: 8 }] : []), screen: tag(f, T(1395), TOTAL, '41 VEZES 💕', 300) }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
