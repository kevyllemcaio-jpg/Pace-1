// ADULT series — "E se você fosse o único homem na aula de dança da academia?" — 1250 frames @30fps
const TOTAL = 1250;
const FLASHES = [];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const tag = (f, f0, f1, text, y = 260) => (f >= f0 && f < f1 ? [{ type: 'tag', text, k: pop(f, f0) * (1 - prog(f, f1 - 6, f1)), y }] : []);
const say = (f, f0, x, y, text, o = {}) => (f >= f0 ? [Object.assign({ type: 'speech', x, y, text, fs: 54, k: pop(f, f0), tx: 0 }, o)] : []);
function walkTo(f, f0, f1, a, b) { const t = prog(f, f0, f1), e = sstep(t); return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e), walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null }; }
// adult women (original): dance-class students + the teacher
const AL = [['#e8b38b', 'long', '#2b1b1e', '#9b5de5'], ['#8b5a3c', 'puffs', '#1e1414', '#ffc93c'], ['#f7d4b6', 'pony', '#d9542b', '#4fd1a1'], ['#c98e66', 'bob', '#3a2314', '#ff7eb6'], ['#f2caa6', 'buns', '#f0c34a', '#ff9f43'], ['#6e432b', 'braids', '#1b1212', '#2ec4b6'], ['#efc29f', 'curly', '#7a4a2a', '#c39bd3']];
AL.forEach(([skin, hair, hc, pj], i) => (CAST['al' + i] = { skin, hair, hc, pj, pj2: '#ffffff', pat: 'none', pants: '#1c1222', slip: '#ffffff', adult: true, dress: true }));
CAST.profa = { skin: '#c98e66', hair: 'pony', hc: '#1b1212', band: '#ffd23f', pj: '#ff006e', pj2: '#ffbe0b', pat: 'none', pants: '#1c1222', slip: '#ffffff', adult: true, dress: true };
const _drawSet21 = drawSet;
drawSet = function (ctx, st, cam, f) {
  if (st.set === 'studio') {
    ctx.fillStyle = '#ffe5ec'; ctx.fillRect(-3000, -2600, 6000, 2600);
    rr(ctx, -2600, -2000, 4200, 1700, 10); paint(ctx, '#d7ecff', INK, wink());
    ctx.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-2400 + i * 700, -2000); ctx.lineTo(-2200 + i * 700, -2000); ctx.lineTo(-2500 + i * 700, -300); ctx.lineTo(-2700 + i * 700, -300); ctx.closePath(); ctx.fill(); }
    rr(ctx, -2600, -900, 4200, 40, 20); paint(ctx, '#c08552', INK, wink());
    for (const x of [-2200, -1000, 200, 1400]) { rr(ctx, x - 12, -900, 24, 600, 6); paint(ctx, '#c08552', INK, wink(0.7)); }
    sign(ctx, 'DANÇA 💃', -500, -2220, 90, '#ffffff', '#ff006e');
    // door (right)
    rr(ctx, 1800, -1500, 700, 1500, [20, 20, 0, 0]); paint(ctx, '#7b2cbf', INK, wink()); ell(ctx, 1900, -720, 24, 24); paint(ctx, '#ffd23f', INK, wink(0.7));
    if (st.locked) { rr(ctx, 1860, -820, 90, 120, 12); paint(ctx, '#adb5bd', INK, wink(0.7)); }
    // speaker with notes
    rr(ctx, -2850, -900, 240, 400, 20); paint(ctx, '#2b2d42', INK, wink()); for (const y of [-800, -620]) { ell(ctx, -2730, y, 70 + Math.sin(f * 0.8) * 6, 70 + Math.sin(f * 0.8) * 6); paint(ctx, '#495057', INK, wink(0.7)); }
    ctx.fillStyle = '#d4a373'; ctx.fillRect(-3000, 0, 6000, 3000); ctx.strokeStyle = 'rgba(120,70,30,.35)'; ctx.lineWidth = wink(0.7); for (let i = -20; i <= 20; i++) { ctx.beginPath(); ctx.moveTo(i * 150 * 0.32, 0); ctx.lineTo(i * 150, 3000); ctx.stroke(); }
    return;
  }
  _drawSet21(ctx, st, cam, f);
};
// the class: rows of women; mode: 'stand' | 'dance' | 'down' | 'turn' | 'laugh'
const SPOTS = [[-1150, 180], [-650, 160], [650, 160], [1150, 180], [-900, 470], [900, 470], [-1500, 420]];
function klass(f, mode, o = {}) {
  return SPOTS.map(([x, y], i) => {
    const d = mode === 'dance' ? Math.sin(f * 0.35 + i) : 0;
    const base = { flip: x > 0 ? -1 : 1, look: o.lookAtHim ? [clamp(-x / 600, -1, 1), 0] : [0, 0.3], expr: o.expr || 'happy' };
    if (mode === 'dance') Object.assign(base, { tilt: d * 0.18, pose: d > 0 ? 'hips' : 'up', expr: 'grin' });
    if (mode === 'down') Object.assign(base, { sit: true, pose: 'hips', expr: 'proud' });
    if (mode === 'laugh') Object.assign(base, { expr: 'laugh', pose: 'cheeks', tilt: Math.sin(f * 0.4 + i) * 0.08 });
    return G('al' + i, x + (mode === 'dance' ? d * 30 : 0), y, base);
  });
}
const HM = (x, y, o = {}) => G('homem', x, y, Object.assign({ expr: 'happy', look: [0, 0] }, o));
const PF = (x, y, o = {}) => G('profa', x, y, Object.assign({ expr: 'happy', look: [0, 0], pose: 'hips' }, o));

const SHOTS = [
  // 1 — hook: the only man in a room full of dancing women
  { f0: 0, f1: 115, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 0, x: 0, y: -380, z: 0.62 }, { f: 115, x: 0, y: -420, z: 0.8 }],
    build(f) { return { world: { set: 'studio' }, actors: klass(f, 'dance').concat([HM(0, 360, { expr: 'scared', sweat: 1, pose: { L: [30, 40], R: [30, 40] }, tilt: Math.sin(f * 0.6) * 0.04 })]), screen: tag(f, 20, 115, 'SÓ EU DE HOMEM?!', 1600) }; } },
  // 2 — you walked in thinking it was weight training
  { f0: 116, f1: 203, light: () => 'day', dof: {},
    cam: [{ f: 116, x: 900, y: -520, z: 0.75 }, { f: 203, x: 600, y: -500, z: 0.8 }],
    build(f) { const w = walkTo(f, 116, 170, [2150, 330], [600, 360]); return { world: { set: 'studio' }, actors: klass(f, 'stand').concat([HM(w.x, w.y, { walk: w.walk, flip: -1, expr: 'proud', pose: f > 172 ? 'flex' : 'hang', look: [-1, 0] })]), fx: f > 175 ? [{ type: 'sparkle', x: 600, y: -900, k: 0.6 * Math.sin(prog(f, 175, 200) * Math.PI) }] : [] }; } },
  // 3 — twenty women turn to look at you at the same time
  { f0: 204, f1: 289, light: () => 'day', dof: {},
    cam: [{ f: 204, x: 0, y: -420, z: 0.62 }, { f: 228, x: 0, y: -420, z: 0.66 }, { f: 234, x: 300, y: -480, z: 0.95, e: 'o' }, { f: 289, x: 450, y: -500, z: 1.05 }],
    kicks: [{ f: 230, a: 10 }],
    build(f) { return { world: { set: 'studio' }, actors: klass(f, 'stand', { lookAtHim: f > 224, expr: f > 224 ? 'surprised' : 'happy' }).concat([HM(600, 360, { flip: -1, expr: f < 230 ? 'proud' : 'shocked', pose: f < 230 ? 'flex' : 'hang', sweat: f > 236 ? 1 : 0 })]), fx: f > 230 ? [{ type: 'exclaim', x: 600, y: -1100, k: pop(f, 230) * 0.7 }] : [] }; } },
  // 4 — the teacher smiles: today is "rebolado" class
  { f0: 290, f1: 386, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 290, x: 0, y: -620, z: 1.05 }, { f: 386, x: 0, y: -640, z: 1.15 }],
    build(f) { return { world: { set: 'studio' }, actors: [PF(0, 340, { expr: f < 320 ? 'happy' : 'mischief', tilt: Math.sin(f * 0.3) * 0.08 })], fx: say(f, 322, 0, -1450, 'HOJE É AULA\nDE REBOLADO! 💃') }; } },
  // 5 — you try to leave, but the door is locked
  { f0: 387, f1: 471, light: () => 'day', dof: {},
    cam: [{ f: 387, x: 1500, y: -560, z: 0.8 }, { f: 471, x: 1650, y: -580, z: 0.95 }],
    kicks: [{ f: 425, a: 6 }, { f: 440, a: 6 }],
    build(f) { const w = walkTo(f, 387, 418, [600, 360], [1750, 330]); return { world: { set: 'studio', locked: f > 420 }, actors: [HM(w.x, w.y, { walk: w.walk ? w.walk * 1.5 : null, flip: 1, expr: f < 420 ? 'scared' : 'scream', pose: f > 420 ? { L: [12, 6], R: [100, -10 + Math.sin(f * 1.2) * 25] } : 'hang', sweat: 1 })], fx: f > 422 ? [{ type: 'lines', x: 1900, y: -720, r: 200, k: 1 - prog(f, 422, 470) }] : [], screen: tag(f, 438, 471, 'TRANCOU 🔒', 300) }; } },
  // 6 — step one: move the hips
  { f0: 472, f1: 544, light: () => 'day', dof: {},
    cam: [{ f: 472, x: 0, y: -440, z: 0.66 }, { f: 544, x: 0, y: -460, z: 0.74 }],
    build(f) { return { world: { set: 'studio' }, actors: klass(f, 'dance').concat([PF(0, 120, { tilt: Math.sin(f * 0.35) * 0.2, pose: 'hips', expr: 'grin' })]), screen: tag(f, 480, 544, 'PASSO 1: QUADRIL 💃', 300) }; } },
  // 7 — your back locks up
  { f0: 545, f1: 596, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 545, x: 0, y: -540, z: 1.1 }, { f: 562, x: 0, y: -560, z: 1.15 }, { f: 566, x: 0, y: -600, z: 1.5, e: 'o' }, { f: 596, x: 0, y: -600, z: 1.55 }],
    kicks: [{ f: 562, a: 14 }],
    build(f) { const lock = f >= 562; return { world: { set: 'studio' }, actors: [HM(0, 360, { tilt: lock ? 0.35 : Math.sin(f * 0.5) * 0.15, pose: lock ? { L: [40, 60], R: [100, 90] } : 'hips', expr: lock ? 'scream' : 'grin', sweat: lock ? 1 : 0 })], fx: lock ? [{ type: 'lines', x: 60, y: -700, r: 220, k: 1 - prog(f, 562, 590) }] : [], screen: tag(f, 562, 596, 'CRACK 🦴', 300) }; } },
  // 8 — step two: all the way down to the floor
  { f0: 597, f1: 675, light: () => 'day', dof: {},
    cam: [{ f: 597, x: 0, y: -400, z: 0.66 }, { f: 675, x: 0, y: -380, z: 0.72 }],
    build(f) { const down = f >= 632; return { world: { set: 'studio' }, actors: klass(f, down ? 'down' : 'dance').concat([PF(0, 120, { sit: down, expr: 'grin', pose: 'hips' })]), screen: tag(f, 605, 675, 'PASSO 2: ATÉ O CHÃO', 300) }; } },
  // 9 — you go down... and don't come back up
  { f0: 676, f1: 772, light: () => 'day', dof: {},
    cam: [{ f: 676, x: 0, y: -400, z: 0.72 }, { f: 772, x: 0, y: -380, z: 0.95 }],
    build(f) { const down = f >= 690; return { world: { set: 'studio' }, actors: klass(f, f > 720 ? 'stand' : 'down', { lookAtHim: f > 720, expr: 'surprised' }).concat([HM(0, 360, { sit: down, expr: f < 720 ? 'proud' : 'scared', sweat: f > 720 ? 1 : 0, pose: f > 720 ? 'up' : 'hips', tilt: f > 720 ? Math.sin(f * 0.8) * 0.05 : 0 })]), screen: tag(f, 730, 772, 'NÃO SOBE MAIS 😵', 300) }; } },
  // 10 — "want a little hand?"
  { f0: 773, f1: 853, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 773, x: 200, y: -560, z: 0.95 }, { f: 853, x: 200, y: -580, z: 1.05 }],
    build(f) { return { world: { set: 'studio' }, actors: [HM(-150, 380, { sit: true, expr: 'worried', look: [1, -0.5], sweat: 1 }), PF(420, 340, { flip: -1, expr: 'mischief', look: [-1, 0.4], pose: { L: [12, 6], R: [80, 20] } })], fx: say(f, 805, 220, -1450, 'QUER UMA\nMÃOZINHA? 😏', { tx: 60 }) }; } },
  // 11 — "I want a crane"
  { f0: 854, f1: 932, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 854, x: -150, y: -360, z: 1.35 }, { f: 932, x: -150, y: -370, z: 1.5 }],
    build(f) { return { world: { set: 'studio' }, actors: [HM(-150, 380, { sit: true, expr: 'scared', look: [1, -0.5], sweat: 1, pose: 'up' })], fx: say(f, 884, -150, -1290, 'QUERO UM\nGUINDASTE 🏗️') }; } },
  // 12 — end of class: "you've got a different groove"
  { f0: 933, f1: 1041, light: () => 'gold', dof: { room: 3 },
    cam: [{ f: 933, x: 0, y: -560, z: 0.9 }, { f: 1041, x: 0, y: -580, z: 1.0 }],
    build(f) { return { world: { set: 'studio' }, actors: [HM(-380, 360, { expr: 'happy', look: [1, 0] }), PF(380, 340, { flip: -1, expr: 'happy', look: [-1, 0], pose: 'hang' })], fx: say(f, 965, 120, -1450, 'VOCÊ TEM UM GINGADO\nDIFERENTE...', { fs: 56, tx: 60 }) }; } },
  // 13 — you're proud
  { f0: 1042, f1: 1102, light: () => 'gold', dof: { room: 3 },
    cam: [{ f: 1042, x: -380, y: -560, z: 1.25 }, { f: 1102, x: -380, y: -580, z: 1.4 }],
    build(f) { return { world: { set: 'studio' }, actors: [HM(-380, 360, { expr: 'proud', look: [1, -0.2], pose: 'flex' })], fx: [{ type: 'sparkle', x: -560, y: -1050, k: 0.6 * Math.sin(prog(f, 1050, 1095) * Math.PI) }, { type: 'sparkle', x: -200, y: -1000, k: 0.6 * Math.sin(prog(f, 1058, 1100) * Math.PI) }] }; } },
  // 14 — "different from anything I've ever seen"
  { f0: 1103, f1: 1199, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 1103, x: 380, y: -580, z: 1.2 }, { f: 1199, x: 380, y: -600, z: 1.3 }],
    build(f) { return { world: { set: 'studio' }, actors: [PF(380, 340, { flip: -1, expr: f > 1160 ? 'squint' : 'happy', look: [-1, 0], pose: 'hips' })], fx: say(f, 1135, 380, -1400, 'DIFERENTE DE TUDO\nQUE EU JÁ VI. 😬', { fs: 50, tx: 60 }) }; } },
  // 15 — not a compliment
  { f0: 1200, f1: TOTAL - 1, light: () => 'day', dof: {},
    cam: [{ f: 1200, x: 0, y: -440, z: 0.7 }, { f: TOTAL - 1, x: 0, y: -460, z: 0.8 }],
    kicks: [{ f: 1206, a: 8 }],
    build(f) { return { world: { set: 'studio' }, actors: klass(f, 'laugh').concat([HM(0, 360, { expr: 'worried', pose: 'hang', sweat: 1, tilt: 0.06 })]), screen: tag(f, 1204, TOTAL, 'NÃO É ELOGIO 😅', 300) }; } },
];
for (const s of SHOTS) {
  const wide = s.cam[0].z < 0.85, dy = wide ? 230 : 330;
  s.cam.forEach((k) => { k.y += dy + 120; if (wide) k.z *= 1.15; });
  const b = s.build; s.build = (f, g) => { const R = b(f, g); (R.fx || []).forEach((e) => { if (['speech', 'sparkle', 'exclaim'].includes(e.type)) e.y += dy + (e.type === 'speech' ? 330 : 120); }); return R; };
}
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
