// "E se você ficasse preso num quarto com dez meninas?" — 1010 frames @30fps
const TOTAL = 1010;
const FLASHES = [729];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const BOY = (o = {}) => Object.assign({ who: 'boy', x: -150, y: -25, s: 0.5, sit: true, layer: 'front' }, o);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const tag = (f, f0, f1, text, y = 260) => (f >= f0 && f < f1 ? [{ type: 'tag', text, k: pop(f, f0) * (1 - prog(f, f1 - 6, f1)), y }] : []);
const say = (f, f0, x, y, text, o = {}) => (f >= f0 ? [Object.assign({ type: 'speech', x, y, text, fs: 52, k: pop(f, f0), tx: 0 }, o)] : []);
const NAMES = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana', 'sofia', 'bia', 'lara', 'rita'];
// ten girls around the boy, in two arcs
const RING = [[-1150, 120], [-850, 40], [550, 40], [850, 120], [1150, 220], [-1300, 360], [-900, 420], [-450, 470], [450, 470], [900, 420]];
function girls(f, o = {}) {
  return RING.map(([x, y], i) => {
    const a = { flip: x > -150 ? -1 : 1, look: o.look || [clamp((-150 - x) / 600, -1, 1), -0.2], expr: o.expr || (i % 2 ? 'grin' : 'happy'), pose: o.pose || 'hang', tilt: Math.sin(f * 0.45 + i * 1.7) * 0.05 };
    if (o.dance) { const d = Math.sin(f * 0.4 + (i % 2) * Math.PI); Object.assign(a, { pose: d > 0 ? 'dance1' : 'dance2', hop: Math.max(0, d) * 30, expr: 'grin' }); }
    if (o.sit) Object.assign(a, { sit: true });
    return G(NAMES[i], x, y, a);
  });
}
CAST.pai = { skin: '#f2caa6', hair: 'cap', hc: '#4a2418', pj: '#3a86ff', pj2: '#9cc5ff', pat: 'none', pants: '#2b2d42', slip: '#3a2a20', adult: true, mustache: true };
const LOOK = { nails: 5, braids: 1 };

const SHOTS = [
  // 1 — hook: locked in with ten girls
  { f0: 0, f1: 106, light: () => 'eve', dof: { room: 2 },
    cam: [{ f: 0, x: -150, y: -360, z: 0.62 }, { f: 106, x: -150, y: -360, z: 0.78 }],
    build(f) { return { world: { set: 'room',  door: 0 }, actors: girls(f, { expr: 'mischief' }).concat([BOY({ expr: 'scared', sweat: 1, look: [Math.sin(f * 0.15), 0] })]), screen: tag(f, 18, 106, '10 MENINAS?! 😳', 260) }; } },
  // 2 — the door is stuck and the key is gone
  { f0: 107, f1: 175, light: () => 'eve', dof: {},
    cam: [{ f: 107, x: -1100, y: -520, z: 0.95 }, { f: 175, x: -1080, y: -520, z: 1.05 }],
    kicks: [{ f: 120, a: 6 }, { f: 130, a: 6 }],
    build(f) { return { world: { set: 'room',  door: 0 }, actors: [G('boy', -1150, 60, { flip: -1, expr: f < 144 ? 'scream' : 'shocked', pose: { L: [12, 6], R: [100, -10 + Math.sin(f * 1.3) * 25] }, sweat: 1 })], fx: say(f, 140, -1000, -850, 'CADÊ A CHAVE?! 🔑'), screen: tag(f, 120, 175, 'EMPERROU 🔒', 260) }; } },
  // 3 — hour 1: pink nails
  { f0: 176, f1: 271, light: () => 'eve', dof: { room: 3 },
    cam: [{ f: 176, x: -150, y: -420, z: 1.3 }, { f: 271, x: -150, y: -430, z: 1.45 }],
    build(f) { const n = Math.min(5, Math.max(0, Math.floor((f - 212) / 6))); return { world: { set: 'room' }, actors: [G('lara', 250, 60, { flip: -1, sit: true, expr: 'happy', look: [-1, 0.3], pose: { L: [12, 6], R: [90, -10] } }), BOY({ nails: n, pose: 'reachR', expr: n < 5 ? 'worried' : 'shocked', look: [1, 0.3], sweat: 1 })], fx: n < 5 && f > 205 ? [{ type: 'sparkle', x: 120, y: -330, k: 0.4 }] : [], screen: tag(f, 180, 271, '1ª HORA: UNHA 💅', 260) }; } },
  // 4 — hour 2: full makeup with glitter
  { f0: 272, f1: 372, light: () => 'eve', dof: { room: 3 },
    cam: [{ f: 272, x: -150, y: -460, z: 1.5 }, { f: 372, x: -150, y: -470, z: 1.7 }],
    build(f) { const br = prog(f, 290, 320); return { world: { set: 'room' }, actors: [BOY({ nails: 5, braids: br > 0.5 ? 1 : 0, expr: 'squint', look: [0, -0.4], pose: 'hang' })], fx: [{ type: 'sparkle', x: -260, y: -560, k: 0.5 * Math.sin(prog(f, 300, 340) * Math.PI) }, { type: 'sparkle', x: -40, y: -620, k: 0.5 * Math.sin(prog(f, 320, 360) * Math.PI) }, { type: 'confetti', n: 30, x0: -600, w: 900, y0: -900, h: 800, f0: 336 }], screen: tag(f, 276, 372, '2ª HORA: GLITTER ✨', 260) }; } },
  // 5 — hour 3: eleven dances
  { f0: 373, f1: 471, light: () => 'party', dof: {},
    cam: [{ f: 373, x: -150, y: -420, z: 0.64 }, { f: 471, x: -150, y: -440, z: 0.74 }],
    build(f) { const d = Math.sin(f * 0.4); return { world: { set: 'room' }, actors: girls(f, { dance: true }).concat([G('boy', -150, 260, Object.assign({ pose: d > 0 ? 'dance1' : 'dance2', hop: Math.max(0, d) * 30, expr: f < 420 ? 'worried' : 'grin', look: [0, 0] }, LOOK))]), screen: tag(f, 377, 471, '3ª HORA: DANCINHA', 260) }; } },
  // 6 — hour 4: they find out you've never watched a soap opera
  { f0: 472, f1: 582, light: () => 'eve', dof: {},
    cam: [{ f: 472, x: -150, y: -400, z: 0.66 }, { f: 520, x: -150, y: -420, z: 0.7 }, { f: 528, x: -150, y: -440, z: 0.9, e: 'o' }, { f: 582, x: -150, y: -440, z: 0.95 }],
    kicks: [{ f: 548, a: 10 }],
    build(f) { return { world: { set: 'room' }, actors: girls(f, { expr: f > 546 ? 'shocked' : 'happy' }).concat([BOY(Object.assign({ expr: 'innocent', look: [0, 0] }, LOOK))]), fx: say(f, 548, -150, -1250, 'NUNCA VIU\nNOVELA?!', { fs: 70 }), screen: tag(f, 476, 546, '4ª HORA...', 260) }; } },
  // 7 — the marathon begins
  { f0: 583, f1: 634, light: () => 'dark', dof: {},
    cam: [{ f: 583, x: -150, y: -400, z: 0.66 }, { f: 634, x: -150, y: -400, z: 0.72 }],
    build(f) { return { world: { set: 'room',  lightOff: true }, actors: girls(f, { sit: true, look: [0, -0.4], expr: 'bliss' }).concat([BOY(Object.assign({ expr: 'surprised', look: [0, -0.4] }, LOOK))]), fx: [{ type: 'popcorn', x: 170, y: 520 }], lights: [{ x: -150, y: -900, r: 1400, i: 1, col: 'rgba(150,180,255,.4)' }], screen: tag(f, 586, 634, 'MARATONA 🍿', 260) }; } },
  // 8 — hour 5: you cry at the end of the episode
  { f0: 635, f1: 728, light: () => 'dark', dof: { room: 3 },
    cam: [{ f: 635, x: -150, y: -440, z: 1.45 }, { f: 728, x: -150, y: -450, z: 1.65 }],
    build(f) { return { world: { set: 'room',  lightOff: true }, actors: [BOY(Object.assign({ expr: 'worried', look: [0, -0.4], sweat: 1, pose: 'cheeks', tilt: Math.sin(f * 0.6) * 0.04 }, LOOK))], lights: [{ x: -150, y: -700, r: 900, i: 1, col: 'rgba(150,180,255,.45)' }], fx: [{ type: 'fear', x: -150, y: -820, k: 0.7 }], screen: tag(f, 640, 728, '5ª HORA: CHOROU 😭', 260) }; } },
  // 9 — the door opens
  { f0: 729, f1: 781, light: () => 'eve', dof: {},
    cam: [{ f: 729, x: -900, y: -520, z: 0.85 }, { f: 781, x: -950, y: -520, z: 0.92 }],
    build(f) { const d = sstep(prog(f, 729, 748)); return { world: { set: 'room',  door: d }, actors: girls(f, { look: [-1, 0], expr: 'surprised' }).slice(0, 6).concat(f > 748 ? [G('pai', -1250, 40, { flip: 1, expr: 'neutral', look: [1, 0] })] : []), fx: f > 748 ? [{ type: 'exclaim', x: -1250, y: -1500, k: pop(f, 750) * 0.7 }] : [] }; } },
  // 10 — dad looks: glitter, bow, pink nails
  { f0: 782, f1: 886, light: () => 'eve', dof: { room: 3 },
    cam: [{ f: 782, x: -700, y: -520, z: 0.92 }, { f: 886, x: -650, y: -520, z: 1.0 }],
    kicks: [{ f: 800, a: 8 }],
    build(f) { const items = f < 821 ? '' : f < 838 ? 'GLITTER ✨' : f < 850 ? 'LAÇO 🎀' : 'UNHA ROSA 💅'; return { world: { set: 'room',  door: 1 }, actors: [G('pai', -1250, 40, { flip: 1, expr: f > 800 ? 'shocked' : 'neutral', look: [1, 0.2] }), G('boy', -350, 220, Object.assign({ flip: -1, expr: 'innocent', look: [-1, -0.3], pose: 'hang' }, LOOK))], fx: f >= 821 ? [{ type: 'sparkle', x: -350, y: -640, k: 0.6 }] : [], screen: items ? [{ type: 'tag', text: items, k: 1, y: 260 }] : [] }; } },
  // 11 — "dad, we need to talk about the soap opera"
  { f0: 887, f1: TOTAL - 1, light: () => 'eve', dof: { room: 3 },
    cam: [{ f: 887, x: -350, y: -460, z: 1.25 }, { f: TOTAL - 1, x: -500, y: -480, z: 1.0 }],
    build(f) { return { world: { set: 'room',  door: 1 }, actors: [G('pai', -1250, 40, { flip: 1, expr: f > 960 ? 'shocked' : 'surprised', look: [1, 0.2] }), G('boy', -350, 220, Object.assign({ flip: -1, expr: 'stern', look: [-1, -0.3], pose: 'point' }, LOOK))], fx: say(f, 910, -350, -1150, 'PAI, A GENTE PRECISA\nCONVERSAR SOBRE A NOVELA.', { fs: 44 }) }; } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
