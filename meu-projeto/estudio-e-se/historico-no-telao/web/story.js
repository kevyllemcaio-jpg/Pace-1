// "E se o seu histórico aparecesse no telão?" — frames @30fps (voz atrasada 0.3 s = +9)
const T = (n) => n + 9;
const TOTAL = T(1405);
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

// ---- telão sobre o quadro ----
const HIST = ['como parecer mais alto na foto', 'crush respondeu só com 😐 e agora', 'como desligar o projetor rápido'];
function telao(ctx, e, f) {
  ctx.save(); rr(ctx, -500, -1480, 1000, 620, 10); paint(ctx, '#ffffff', INK, wink());
  rr(ctx, -500, -1480, 1000, 70, [10, 10, 0, 0]); paint(ctx, '#dfe3ea', INK, wink(0.6));
  for (let i = 0; i < 3; i++) { ell(ctx, -460 + i * 34, -1445, 11, 11); paint(ctx, ['#ff5f57', '#febc2e', '#28c840'][i]); }
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  if (e.mode === 'slide') { ctx.fillStyle = '#3a0ca3'; ctx.font = '900 74px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.fillText('SISTEMA SOLAR', 0, -1250); ell(ctx, -250, -1050, 70, 70); paint(ctx, '#ffd23f', INK, wink(0.7)); for (let i = 0; i < 4; i++) { ell(ctx, -100 + i * 110, -1050, 22 + i * 4, 22 + i * 4); paint(ctx, ['#e76f51', '#3a86ff', '#2a9d8f', '#f4a261'][i], INK, wink(0.5)); } }
  else if (e.mode === 'hist') {
    ctx.fillStyle = '#1c1222'; ctx.font = '900 54px Arial Black, Arial'; ctx.fillText('🕘 HISTÓRICO', -460, -1350);
    HIST.forEach((h, i) => { if (i >= (e.n || 0)) return; const y = -1240 + i * 120, on = e.hi === i; if (on) { rr(ctx, -480, y - 50, 960, 100, 14); paint(ctx, '#fff3b0', '#ffd23f', wink(1)); } ctx.fillStyle = on ? '#d62839' : '#3a3a4a'; ctx.font = `${on ? 900 : 700} 46px Arial`; ctx.fillText('🔍 ' + h, -460, y); });
  } else if (e.mode === 'vol') {
    ctx.fillStyle = '#1c1222'; ctx.font = '900 120px Arial'; ctx.textAlign = 'center'; ctx.fillText('🔊', -330, -1170);
    rr(ctx, -200, -1200, 620, 60, 30); paint(ctx, '#e5e7eb', INK, wink(0.6)); rr(ctx, -200, -1200, 620 * (e.v || 0), 60, 30); paint(ctx, '#e63946', INK, wink(0.6));
    ctx.font = '900 60px Arial Black, Arial'; ctx.fillStyle = '#e63946'; ctx.fillText(Math.round((e.v || 0) * 100) + '%', 110, -1040);
  } else if (e.mode === 'audio') {
    ctx.fillStyle = '#1c1222'; ctx.font = '900 50px Arial Black, Arial'; ctx.fillText('🚿 cantando_no_banho.mp3', -460, -1350);
    ctx.strokeStyle = '#3a86ff'; ctx.lineWidth = 14; ctx.lineCap = 'round';
    for (let i = 0; i < 38; i++) { const h = 30 + Math.abs(Math.sin(i * 0.7 + f * 0.5)) * 150 * (0.5 + 0.5 * Math.sin(i * 0.3)); ctx.beginPath(); ctx.moveTo(-450 + i * 24, -1110 - h / 2); ctx.lineTo(-450 + i * 24, -1110 + h / 2); ctx.stroke(); }
    ctx.fillStyle = '#e63946'; ctx.font = '900 44px Arial'; ctx.fillText('▶ 0:0' + (Math.floor(f / 30) % 10) + ' / 3:47', -460, -930);
  }
  ctx.restore();
}
function phone(ctx, e, f) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot || 0); ctx.scale(e.s || 1, e.s || 1); rr(ctx, -70, -130, 140, 260, 24); paint(ctx, '#1c1222', INK, wink()); rr(ctx, -56, -110, 112, 210, 12); paint(ctx, e.glow ? '#7cc6ff' : '#3a86ff');
  if (e.cable) { ctx.strokeStyle = '#1c1222'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, 130); ctx.quadraticCurveTo(e.cable[0] / 2, 400, e.cable[0], e.cable[1]); ctx.stroke(); } ctx.restore(); }
function tenCard(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(-0.08); ctx.scale(e.k, e.k); rr(ctx, -260, -300, 520, 600, 16); paint(ctx, '#ffffff', INK, wink()); ctx.fillStyle = '#d62839'; ctx.font = '900 300px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('10', 0, -60); ell(ctx, 0, -60, 220, 190); ctx.strokeStyle = '#d62839'; ctx.lineWidth = 14; ctx.stroke(); if (e.sub) { ctx.font = '900 46px Arial Black, Arial'; ctx.fillStyle = '#3a0ca3'; ctx.fillText('CRIATIVIDADE', 0, 200); } ctx.restore(); }
const _dfx = drawFx;
drawFx = function (ctx, fx, f) { const own = ['telao', 'phone', 'ten']; _dfx(ctx, (fx || []).filter((e) => !own.includes(e.type)), f); for (const e of fx || []) { if (e.type === 'telao') telao(ctx, e, f); if (e.type === 'phone') phone(ctx, e, f); if (e.type === 'ten') tenCard(ctx, e); } };
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


const ME = (x, y, o = {}) => B(x, y, Object.assign({ expr: 'happy', look: [-1, 0], flip: -1 }, o));
const CLASS = (f, o = {}) => classroom(f, Object.assign({ noBoy: true }, o)).filter((a) => !(o.open && a.x >= 380 && a.y <= 110));
const WIDE = (f0, f1) => [{ f: f0, x: 200, y: -640, z: 0.72 }, { f: f1, x: 220, y: -660, z: 0.8 }];
const TEL = (f0, f1) => [{ f: f0, x: 0, y: -1170, z: 1.0 }, { f: f1, x: 0, y: -1170, z: 1.08 }];
const SHOTS = [
  { f0: 0, f1: T(121), light: () => 'day', dof: {}, cam: WIDE(0, T(121)),
    build(f) { return { world: { set: 'class' }, actors: CLASS(f, { open: 1, kid: () => ({ expr: 'laugh', look: [0, -0.8] }) }).concat([ME(650, -20, { expr: 'scream', pose: 'cheeks', sweat: 1, look: [-1, -0.6] })]), fx: [{ type: 'telao', mode: 'hist', n: 3, hi: Math.floor(f / 20) % 3 }], screen: tag(f, T(30), T(121), 'MEU HISTÓRICO?! 📱', 300) }; } },
  { f0: T(122), f1: T(194), light: () => 'day', dof: {}, cam: WIDE(T(122), T(194)),
    build(f) { return { world: { set: 'class' }, actors: CLASS(f, { open: 1, kid: () => ({ expr: 'bored', look: [0, -0.8] }) }).concat([ME(650, -20, { expr: 'proud', pose: 'hero' }), PROF(-720, -40, { flip: 1, look: [1, 0] })]), fx: [{ type: 'telao', mode: 'slide' }], screen: tag(f, T(125), T(194), 'APRESENTAÇÃO 📊', 300) }; } },
  { f0: T(195), f1: T(280), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(195), x: 600, y: -260, z: 1.5 }, { f: T(280), x: 600, y: -270, z: 1.7 }],
    build(f) { const plug = prog(f, T(206), T(240)); return { world: { set: 'class' }, actors: [ME(650, -20, { expr: 'happy', pose: 'hold', look: [0, 0.4] })], fx: [{ type: 'phone', x: 650, y: -190, s: 0.5, cable: [lerp(-200, -500, plug), 200] }].concat(f > T(240) ? [{ type: 'sparkle', x: 600, y: -260, k: 0.6 }] : []), screen: tag(f, T(240), T(280), 'CONECTOU 🔌', 300) }; } },
  { f0: T(281), f1: T(393), light: () => 'day', dof: {},
    cam: [{ f: T(281), x: 0, y: -1100, z: 0.8 }, { f: T(330), x: 0, y: -1100, z: 0.8 }, { f: T(340), x: 0, y: -1170, z: 1.0, e: 'o' }, { f: T(393), x: 0, y: -1170, z: 1.05 }],
    kicks: [{ f: T(332), a: 10 }],
    build(f) { const h = f >= T(330); return { world: { set: 'class' }, actors: CLASS(f), fx: [{ type: 'telao', mode: h ? 'hist' : 'slide', n: h ? Math.min(3, Math.floor(prog(f, T(332), T(370)) * 3) + 1) : 0 }], screen: tag(f, T(334), T(393), 'ERA O HISTÓRICO 😱', 300) }; } },
  { f0: T(394), f1: T(512), light: () => 'day', dof: {}, cam: TEL(T(394), T(512)),
    build(f) { return { world: { set: 'class' }, actors: [], fx: [{ type: 'telao', mode: 'hist', n: 3, hi: f > T(425) ? 0 : -1 }], screen: tag(f, T(400), T(512), 'PESQUISA 1 🔍', 300) }; } },
  { f0: T(513), f1: T(561), light: () => 'day', dof: { room: 2 },
    cam: [{ f: T(513), x: 0, y: -260, z: 0.75 }, { f: T(561), x: 0, y: -260, z: 0.85 }],
    build(f) { return { world: { set: 'class' }, actors: CLASS(f, { kid: () => ({ expr: 'laugh', tilt: Math.sin(f * 0.5) * 0.08, look: [0, -0.8] }) }), screen: tag(f, T(515), T(561), 'KKKKKK', 300) }; } },
  { f0: T(562), f1: T(699), light: () => 'day', dof: {}, cam: TEL(T(562), T(699)),
    build(f) { return { world: { set: 'class' }, actors: [], fx: [{ type: 'telao', mode: 'hist', n: 3, hi: f > T(590) ? 1 : -1 }], screen: tag(f, T(565), T(699), 'PESQUISA 2 💬', 300) }; } },
  { f0: T(700), f1: T(764), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(700), x: -380, y: -220, z: 1.4 }, { f: T(730), x: -380, y: -230, z: 1.55 }, { f: T(731), x: 600, y: -280, z: 1.55 }, { f: T(764), x: 600, y: -290, z: 1.65 }],
    build(f) { if (f <= T(730)) return { world: { set: 'class' }, actors: CLASS(f, { bia: { expr: 'mischief', look: [1, -0.2], flip: 1 } }), fx: [{ type: 'hearts', x: -380, y: -520, n: 3 }] };
      return { world: { set: 'class' }, actors: [ME(650, -20, { expr: 'scared', pose: 'cheeks', sweat: 1, look: [-1, 0.3] })], screen: tag(f, T(733), T(764), 'ELA VIU 😳', 300) }; } },
  { f0: T(765), f1: T(876), light: () => 'day', dof: {}, cam: TEL(T(765), T(876)),
    build(f) { return { world: { set: 'class' }, actors: [], fx: [{ type: 'telao', mode: 'hist', n: 3, hi: f > T(790) ? 2 : -1 }], screen: tag(f, T(768), T(876), 'PESQUISA 3 🙈', 300) }; } },
  { f0: T(877), f1: T(964), light: () => 'day', dof: { room: 4 },
    cam: [{ f: T(877), x: 650, y: -230, z: 1.7 }, { f: T(964), x: 650, y: -240, z: 1.9 }],
    build(f) { return { world: { set: 'class' }, actors: [ME(650, -20, { expr: 'scream', pose: 'hold', sweat: 1, look: [0, 0.5], tilt: Math.sin(f * 1.3) * 0.06 })], fx: [{ type: 'phone', x: 650 + Math.sin(f * 2) * 8, y: -190, s: 0.5, glow: f % 6 < 3 }, { type: 'lines', x: 650, y: -230, r: 220, k: 0.8 }], screen: tag(f, T(887), T(964), 'APERTA TUDO!!', 300) }; } },
  { f0: T(965), f1: T(1029), light: () => 'day', dof: {}, cam: TEL(T(965), T(1029)),
    kicks: [{ f: T(991), a: 12 }],
    build(f) { return { world: { set: 'class' }, actors: [], fx: [{ type: 'telao', mode: 'vol', v: sstep(prog(f, T(968), T(991))) }], screen: tag(f, T(991), T(1029), 'VOLUME MÁXIMO 🔊', 300) }; } },
  { f0: T(1030), f1: T(1144), light: () => 'day', dof: {},
    cam: [{ f: T(1030), x: 0, y: -1170, z: 1.0 }, { f: T(1090), x: 0, y: -1100, z: 0.85 }, { f: T(1144), x: 0, y: -800, z: 0.62 }],
    build(f) { return { world: { set: 'class' }, actors: CLASS(f, { open: 1, kid: () => ({ expr: 'surprised', look: [0, -0.8] }) }).concat([ME(650, -20, { expr: 'scream', pose: 'cheeks', sweat: 1 })]), fx: [{ type: 'telao', mode: 'audio' }, { type: 'note', x: 300, y: -800, a: 0.8, k: 0.8 }, { type: 'note', x: -300, y: -760, a: 0.8, k: 0.8 }], screen: tag(f, T(1060), T(1144), '🎤 LÁ LÁ LÁÁÁ 🚿', 300) }; } },
  { f0: T(1145), f1: T(1189), light: () => 'day', dof: {}, cam: WIDE(T(1145), T(1189)),
    build(f) { return { world: { set: 'class' }, actors: CLASS(f, { open: 1, kid: () => ({ expr: 'surprised', look: [0, -0.4] }) }).concat([ME(650, -20, { expr: 'shocked', sweat: 1 })]), fx: [{ type: 'telao', mode: 'audio' }], screen: tag(f, T(1147), T(1189), 'SILÊNCIO...', 300) }; } },
  { f0: T(1190), f1: T(1261), light: () => 'day', dof: { room: 2 },
    cam: [{ f: T(1190), x: 0, y: -300, z: 0.65 }, { f: T(1261), x: 0, y: -320, z: 0.75 }],
    build(f) { return { world: { set: 'class' }, actors: CLASS(f, { kid: () => ({ expr: 'grin', pose: 'clap', look: [0, -0.6], tilt: Math.sin(f * 0.6) * 0.05 }) }), fx: [{ type: 'confetti', x: 0, y: -900, k: 1 }], screen: tag(f, T(1223), T(1261), 'APLAUSOS 👏👏', 300) }; } },
  { f0: T(1262), f1: T(1340), light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(1262), x: -150, y: -280, z: 1.2 }, { f: T(1340), x: -150, y: -300, z: 1.35 }],
    build(f) { return { world: { set: 'class' }, actors: [PROF(-300, 200, { flip: 1, expr: 'proud', pose: 'point', look: [1, 0] }), ME(250, 230, { expr: 'surprised', look: [-1, 0] })], fx: f > T(1294) ? [{ type: 'ten', x: -60, y: -560, k: pop(f, T(1295)) * 0.6 }] : [] }; } },
  { f0: T(1341), f1: TOTAL - 1, light: () => 'day', dof: { room: 3 },
    cam: [{ f: T(1341), x: 0, y: -380, z: 1.1 }, { f: TOTAL - 1, x: 0, y: -400, z: 1.25 }],
    build(f) { return { world: { set: 'class' }, actors: [ME(150, 230, { expr: 'squint', pose: 'hips', look: [-1, -0.3] })], fx: [{ type: 'ten', x: -200, y: -520, k: 0.6, sub: true }], screen: tag(f, T(1350), TOTAL, 'EM... CRIATIVIDADE? 🎨', 300) }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
