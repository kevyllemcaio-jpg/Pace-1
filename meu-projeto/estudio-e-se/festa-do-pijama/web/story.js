// "E se você fosse o único menino na festa do pijama?" — 1122 frames @30fps (voice 37.4 s)
const TOTAL = 1122;
const FLASHES = [336, 1018];
const ks = (y) => 0.5 * (0.94 + y / 2500); // floor depth scale

const BOY = (o = {}) => Object.assign({ who: 'boy', x: -150, y: -25, s: 0.5, sit: true, layer: 'front' }, o);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);

function walkTo(f, f0, f1, a, b) {
  const t = prog(f, f0, f1), e = sstep(t);
  const x = lerp(a[0], b[0], e), y = lerp(a[1], b[1], e);
  const dist = Math.hypot(b[0] - a[0], b[1] - a[1]) * e;
  return { x, y, walk: t > 0 && t < 1 ? dist / 42 : null };
}
const giggle = (f, i) => Math.sin(f * 0.45 + i * 1.7) * 0.06;
const sqLand = (f, fl) => (f >= fl ? Math.exp(-(f - fl) / 3) * Math.cos((f - fl) * 0.9) * 0.18 : 0);

// world position of the boy's right hand for a given arm angle (for camera targeting)
function handWorld(a1, a2, ox, oy, s) {
  const j = armJoints(1, a1, a2, [132, -535]);
  return [ox + j.h[0] * s, oy + j.h[1] * s];
}

const SHOTS = [
  // 1 — hook: the only boy, girls closing in
  { f0: 0, f1: 85, light: () => 'eve', dof: { room: 2, front: 9 },
    cam: [{ f: 0, x: -150, y: -300, z: 1.75 }, { f: 85, x: -150, y: -330, z: 2.05 }],
    build(f) {
      const shock = f >= 22 && f < 44;
      return {
        world: {},
        front: [{ type: 'popcorn', x: 170, y: 520 }],
        actors: [
          G('bia', -400, -70, { layer: 'back', expr: 'grin', pose: 'wave', look: [0.6, 0.2], tilt: giggle(f, 0) }),
          G('rita', 110, -70, { layer: 'back', expr: 'mischief', pose: 'hips', look: [-0.8, 0.3], tilt: giggle(f, 1) }),
          BOY({ pose: 'controller', props: { controller: 1 }, expr: shock ? 'shocked' : f < 22 ? 'surprised' : 'worried', look: [f < 50 ? -0.8 : 0.8, -0.1], sweat: f > 30 ? 1 : 0, hop: shock ? 10 * Math.sin(prog(f, 22, 32) * Math.PI) : 0 }),
          G('lara', -470, 260, { expr: 'grin', pose: 'pillow', props: { pillow: '#ffd23f' }, look: [1, -0.4], tilt: 0.1 + giggle(f, 2) }),
          G('duda', 150, 270, { expr: 'mischief', pose: 'point', flip: -1, look: [1, -0.4], tilt: -0.1 + giggle(f, 3) }),
        ],
        fx: f > 22 ? [{ type: 'exclaim', x: -150, y: -560, k: backOut(prog(f, 22, 30)) * 0.7 }] : [],
      };
    } },

  // 2 — Friday night, sister opens the door, six friends march in
  { f0: 86, f1: 192, light: () => 'eve', dof: {},
    cam: [{ f: 86, x: -560, y: -440, z: 0.62 }, { f: 192, x: -540, y: -400, z: 0.68 }],
    build(f) {
      const door = sstep(prog(f, 122, 136));
      const A = [];
      A.push(G('bia', -1000, 150, { expr: 'happy', pose: f > 138 ? 'wave' : 'hang', look: [-1, 0], flip: -1 }));
      const T = [[-1080, 400], [-860, 260], [-690, 470], [-930, 600], [-520, 330], [-760, 660]];
      ['lara', 'rita', 'duda', 'nina', 'joana', 'sofia'].forEach((w, i) => {
        const fi = 140 + i * 6;
        if (f < fi) return;
        const p = walkTo(f, fi, fi + 30, [-1250, 30], T[i]);
        const arrived = f > fi + 30;
        A.push(G(w, p.x, p.y, { walk: p.walk, expr: arrived ? (i % 2 ? 'grin' : 'happy') : 'happy', pose: arrived ? (i % 2 ? 'up' : 'wave') : 'hang', look: [0.6, 0], hop: arrived ? Math.max(0, Math.sin((f - fi - 30) * 0.4)) * 12 : 0 }));
      });
      const scared = f > 150;
      A.push(BOY({ pose: 'controller', props: { controller: 1 }, expr: f < 146 ? 'happy' : scared ? 'worried' : 'surprised', look: [-1, 0], sweat: f > 160 ? 1 : 0 }));
      return { world: { door }, actors: A, fx: f > 150 ? [{ type: 'exclaim', x: -150, y: -560, k: backOut(prog(f, 150, 158)) * 0.9 }] : [] };
    } },

  // 3 — mom: "behave"
  { f0: 193, f1: 262, light: () => 'eve', dof: { room: 3 },
    cam: [{ f: 193, x: -400, y: -440, z: 1.18 }, { f: 262, x: -380, y: -420, z: 1.32 }],
    build(f) {
      const wag = f >= 226 && f <= 248 ? Math.sin((f - 226) * 0.9) : 0;
      const nod = f >= 238 && f <= 256 ? Math.sin((f - 238) * 0.7) * 0.08 : 0;
      return {
        world: { door: 0 },
        actors: [
          G('bia', -930, 120, { expr: 'laugh', pose: 'clap', tilt: giggle(f, 0) }),
          G('lara', -800, 60, { expr: 'laugh', pose: 'cheeks', tilt: giggle(f, 1) }),
          G('mom', -600, 260, { s: 0.5, expr: 'stern', pose: { L: [45, -80], R: [95 + wag * 10, -5 + wag * 30] }, look: [1, 0.2], tilt: f > 198 && f < 210 ? -0.05 : 0 }),
          BOY({ pose: 'controller', props: { controller: 1 }, expr: 'innocent', look: [-0.9, -0.2], tilt: nod }),
        ],
      };
    } },

  // 4 — he just wanted to play in peace
  { f0: 263, f1: 335, light: () => 'eve', dof: { front: 12 },
    cam: [{ f: 263, x: 320, y: -330, z: 0.95 }, { f: 335, x: 260, y: -320, z: 1.06 }],
    build(f) {
      const notes = [];
      for (let i = 0; i < 3; i++) { const t = ((f - 263 + i * 18) % 54) / 54; notes.push({ type: 'note', x: -60 + i * 50 + t * 80, y: -560 - t * 260, a: Math.sin(t * Math.PI), k: 0.9, col: ['#3a0ca3', '#d62839', '#2d6a4f'][i] }); }
      return {
        world: {},
        front: [{ type: 'popcorn', x: -380, y: 640 }],
        actors: [BOY({ pose: { L: [20, -110 + Math.sin(f * 1.3) * 4], R: [20, -110 + Math.cos(f * 1.1) * 4] }, props: { controller: 1 }, expr: 'bliss', tilt: Math.sin(f * 0.12) * 0.07 })],
        fx: notes,
      };
    } },

  // 5 — ten minutes later (clock spin) → whip down → nails painted pink
  { f0: 336, f1: 430, light: () => 'eve', dof: { room: 0 },
    cam: [
      { f: 336, x: 0, y: -1300, z: 3.1, r: -4 }, { f: 366, x: 0, y: -1300, z: 3.35, r: 3 },
      { f: 378, x: 70, y: -272, z: 4.2, r: 0, e: 'o' }, { f: 404, x: 72, y: -270, z: 4.4 },
      { f: 428, x: -60, y: -330, z: 2.3 }],
    build(f) {
      const nails = f < 383 ? 0 : Math.min(5, Math.floor((f - 383) / 4) + 1);
      const [hx, hy] = handWorld(76, 14, -150, -25, 0.5);
      const fx = [];
      if (f >= 374 && f < 408) {
        const i = clamp(Math.floor((f - 381) / 4), 0, 3);
        const fa = -0.75 + i * 0.5, tip = [hx + Math.cos(fa) * 30, hy + Math.sin(fa) * 30];
        const dip = Math.sin(((f - 381) % 4) / 4 * Math.PI) * 4;
        const enter = easeOut(prog(f, 374, 382));
        fx.push({ type: 'brushHand', x: tip[0] + 30 + (1 - enter) * 200, y: tip[1] - 6 - dip, rot: -0.12, sc: 0.3 });
      }
      for (let i = 0; i < 4; i++) { const fd = 383 + i * 4 + 3; if (f >= fd && f < fd + 10) { const fa = -0.75 + i * 0.5; fx.push({ type: 'sparkle', x: hx + Math.cos(fa) * 40, y: hy + Math.sin(fa) * 40 - 8, k: 0.25 * Math.sin(prog(f, fd, fd + 10) * Math.PI), col: '#ff9fd0' }); } }
      return {
        world: { clock: 50 + sstep(prog(f, 338, 368)) * 70 },
        actors: [BOY({ pose: 'reachR', nails, expr: f > 404 ? 'shocked' : 'worried', look: [1, 0.3], sweat: f > 404 ? 1 : 0 })],
        fx,
      };
    } },

  // 6 — another one braids his "hair"
  { f0: 431, f1: 484, light: () => 'eve', dof: { room: 6 },
    cam: [{ f: 431, x: -140, y: -430, z: 2.5, r: -2 }, { f: 484, x: -145, y: -440, z: 2.8, r: 2.5 }],
    build(f) {
      const braids = 0.5 * prog(f, 439, 447) + 0.5 * prog(f, 453, 461);
      const fx = [];
      for (const [fp, sx] of [[443, -1], [457, 1]]) if (f >= fp && f < fp + 10) fx.push({ type: 'sparkle', x: -150 + sx * 175, y: -470, k: 0.5 * Math.sin(prog(f, fp, fp + 10) * Math.PI), col: '#ff9fd0' });
      return {
        world: {},
        actors: [
          G('rita', -20, -150, { s: 0.47, layer: 'back', expr: 'grin', pose: { L: [80, 30], R: [20, -150] }, look: [-0.8, 0.6], tilt: -0.1 }),
          BOY({ pose: 'hang', nails: 5, braids, expr: 'squint', look: [0, -1], tilt: f > 441 && f < 450 ? -0.06 : f > 455 && f < 464 ? 0.06 : 0 }),
        ],
        fx,
      };
    } },

  // 7 — he's the official judge of the runway show
  { f0: 485, f1: 580, light: () => 'eve', dof: {},
    cam: [{ f: 485, x: 170, y: -200, z: 0.8 }, { f: 580, x: 140, y: -190, z: 0.9 }],
    build(f) {
      const cardT = sstep(prog(f, 544, 552));
      const w = walkTo(f, 488, 566, [250, 120], [250, 760]);
      const clap = (i) => ({ L: [35 + Math.sin(f * 0.9 + i) * 10, -125], R: [35 + Math.sin(f * 0.9 + i) * 10, -125] });
      const fx = [];
      for (let i = 0; i < 3; i++) { const fp = 495 + i * 28; if (f >= fp && f < fp + 14) fx.push({ type: 'sparkle', x: 250 + (i - 1) * 220, y: 300 + i * 160, k: 0.6 * Math.sin(prog(f, fp, fp + 14) * Math.PI) }); }
      return {
        world: { runway: true, noRug: true },
        front: [{ type: 'plant', x: 1150, y: 1150 }],
        actors: [
          BOY({ pose: mixPose('hang', 'card', cardT), props: { card: cardT > 0.5 }, plaque: prog(f, 521, 530), braids: 1, nails: 5, expr: f > 552 ? 'bored' : 'neutral', look: [1, 0.4] }),
          G('duda', 720, 200, { expr: 'grin', pose: clap(0) }),
          G('bia', 590, 330, { expr: 'happy', pose: clap(1) }),
          G('sofia', -380, 380, { expr: 'grin', pose: clap(2) }),
          G('lara', 720, 560, { expr: 'laugh', pose: clap(3) }),
          G('nina', w.x + Math.sin(f * 0.25) * 10, w.y, { walk: w.walk, expr: 'proud', pose: 'hips' }),
          G('joana', -170, 620, { expr: 'happy', pose: clap(4) }),
        ],
        fx,
      };
    } },

  // 8 — he tries to run away
  { f0: 581, f1: 625, light: () => 'eve', dof: {},
    cam: [{ f: 581, x: -200, y: -310, z: 1.05 }, { f: 598, x: -330, y: -260, z: 1.0 }, { f: 625, x: -860, y: -270, z: 1.0, e: 'l' }],
    build(f) {
      let b;
      const base = { braids: 1, plaque: 1, nails: 5, expr: 'worried', sweat: 1, look: [-1, 0] };
      if (f < 590) b = BOY(Object.assign({}, base, { sq: 0.14 * prog(f, 581, 588), pose: 'hang' }));
      else if (f < 600) { const t = prog(f, 590, 600); b = G('boy', lerp(-150, -340, t), lerp(-25, 230, t) - Math.sin(t * Math.PI) * 140, Object.assign({}, base, { s: 0.5, pose: 'up', sq: -0.1 })); }
      else { const t = prog(f, 600, 625); b = G('boy', lerp(-340, -960, t), lerp(230, 210, t), Object.assign({}, base, { s: 0.5, walk: (f - 600) * 0.85, pose: { L: [30, -60], R: [30, -60] }, sq: f < 603 ? sqLand(f, 600) : 0 })); }
      const fx = [];
      if (f >= 600) fx.push({ type: 'speed', x: b.x + 120, y: b.y - 220, dir: 1 }, { type: 'dust', x: b.x + 90, y: b.y, k: 0.8, a: 0.8 });
      if (f >= 599 && f < 610) fx.push({ type: 'dust', x: -340, y: 230, k: 1 + prog(f, 599, 610), a: 1 - prog(f, 599, 610) });
      return { world: {}, actors: [b], fx };
    } },

  // 9 — they lock the door with pillows
  { f0: 626, f1: 694, light: () => 'eve', dof: {},
    cam: [{ f: 626, x: -1100, y: -390, z: 1.0 }, { f: 694, x: -1090, y: -410, z: 1.08 }],
    kicks: [636, 642, 648, 654, 660].map((k) => ({ f: k, a: 5 })),
    build(f) {
      const T = [[-1370, -30], [-1130, -30], [-1250, -165], [-1390, -300], [-1115, -300], [-1250, -435], [-1380, -570], [-1120, -570], [-1250, -705], [-1250, -840]];
      const cols = ['#ffd23f', '#4cc9f0', '#ff7eb6', '#52b788', '#c77dff', '#ff9f43', '#ef5350', '#4cc9f0', '#ffd23f', '#ff7eb6'];
      const pillows = T.map((tg, i) => {
        const fl = 634 + Math.round(i * 2.8), fs = fl - 12;
        if (f < fs) return { t: 0 };
        const t = prog(f, fs, fl);
        const sx = -520 + hash(i) * 80, sy = -950 + hash(i + 5) * 200;
        const x = lerp(sx, tg[0], t), y = lerp(sy, tg[1], t) - Math.sin(t * Math.PI) * 260;
        return { t: 1, x, y, rot: (1 - t) * (4 + i) + (hash(i + 2) - 0.5) * 0.25, col: cols[i], sq: sqLand(f, fl) };
      });
      const sk = walkTo(f, 626, 636, [-900, 210], [-1000, 210]);
      const fx = [];
      if (f < 640) fx.push({ type: 'dust', x: sk.x + 60, y: 215, k: 0.8, a: 1 - prog(f, 626, 640) });
      T.forEach((tg, i) => { const fl = 634 + Math.round(i * 2.8); if (f >= fl && f < fl + 8) fx.push({ type: 'dust', x: tg[0], y: tg[1] + 70, k: 0.7 + prog(f, fl, fl + 8) * 0.5, a: 1 - prog(f, fl, fl + 8) }); });
      const A = [BOY({ x: sk.x, y: 210, sit: false, braids: 1, plaque: 1, nails: 5, sweat: 1, expr: f < 646 ? 'surprised' : 'shocked', pose: f < 646 ? 'hang' : 'cheeks', look: [-1, -0.3], hop: f >= 646 && f < 656 ? Math.sin(prog(f, 646, 656) * Math.PI) * 30 : 0 })];
      if (f >= 664) {
        const p = walkTo(f, 664, 684, [-560, 330], [-700, 330]), q = walkTo(f, 668, 688, [-520, 470], [-640, 470]);
        A.push(G('bia', p.x, p.y, { walk: p.walk, expr: 'mischief', pose: 'hips', look: [-1, 0] }));
        A.push(G('lara', q.x, q.y, { walk: q.walk, expr: 'grin', pose: 'clap', look: [-1, 0] }));
      }
      return { world: { pillows }, actors: A, fx };
    } },

  // 10 — lights out, horror stories with flashlights
  { f0: 695, f1: 777, light: (f) => (f < 705 ? 'eve' : 'dark'), dof: {},
    cam: [{ f: 695, x: 60, y: -260, z: 0.95 }, { f: 777, x: 20, y: -240, z: 1.08 }],
    build(f) { return circleScene(f, 'stories'); } },

  // 11 — who screams loudest? YOU.
  { f0: 778, f1: 860, light: () => 'dark', dof: {},
    cam: [{ f: 778, x: 20, y: -240, z: 1.08 }, { f: 822, x: 0, y: -120, z: 2.9 }, { f: 829, x: 0, y: -105, z: 3.15, e: 'o' }, { f: 846, x: 0, y: -115, z: 3.0 }, { f: 860, x: 0, y: -150, z: 2.3 }],
    kicks: [{ f: 828, a: 28 }],
    build(f) { return circleScene(f, 'scream'); } },

  // 12a — something scratches the window
  { f0: 861, f1: 906, light: () => 'dark', dof: {},
    cam: [{ f: 861, x: -620, y: -1010, z: 1.9, r: 0 }, { f: 906, x: -620, y: -1050, z: 2.55, r: 5 }],
    build(f) {
      return { world: { curtain: 1, curtainLit: 1, curtainSway: 0.3, paw: f >= 872 ? sstep(prog(f, 879, 902)) : null }, actors: [], lights: [{ x: -620, y: -1040, r: 560, i: 1, col: 'rgba(150,180,255,.35)' }] };
    } },

  // 12b — everybody hides behind him
  { f0: 907, f1: 975, light: () => 'dark', dof: { room: 5 },
    cam: [{ f: 907, x: 0, y: -130, z: 1.5 }, { f: 975, x: 0, y: -115, z: 1.8 }],
    build(f) {
      const from = { bia: [-470, 230], lara: [-380, 470], rita: [-200, 120], duda: [200, 120], nina: [380, 470], joana: [470, 230] };
      const to = { bia: [-175, 300, -0.28], lara: [180, 300, 0.28], rita: [-110, 270, -0.15], duda: [115, 270, 0.15], nina: [-235, 318, -0.35], joana: [240, 318, 0.35] };
      const A = [], L = [];
      Object.keys(from).forEach((w, i) => {
        const fi = 906 + i * 3, t = easeOut(prog(f, fi, fi + 14));
        const x = lerp(from[w][0], to[w][0], t) + (t >= 1 ? Math.sin(f * 2.1 + i) * 3 : 0), y = lerp(from[w][1], to[w][1], t);
        const a = G(w, x, y, { expr: 'scared', pose: 'flash', props: { flashlight: 1 }, tilt: to[w][2] * t, look: [-to[w][0] / 240, -0.6], walk: t > 0 && t < 1 ? (f - fi) * 0.9 : null });
        A.push(a);
        const hp = headPos(a); L.push({ x: hp[0], y: hp[1], r: 120, i: 0.75 });
      });
      const b = G('boy', 0, 330, { s: 0.52, braids: 1, plaque: 1, nails: 5, sweat: f > 925 ? 1 : 0, expr: f < 925 ? 'surprised' : f < 944 ? 'scared' : 'worried', look: f < 944 ? [-0.9, -0.5] : [0, 0], pose: 'hang', sq: f >= 944 && f < 952 ? -0.06 : 0 });
      A.push(b);
      const hb = headPos(b); L.push({ x: hb[0], y: hb[1], r: 200, i: 0.95 });
      L.push({ x: -620, y: -1040, r: 520, i: 0.7, col: 'rgba(150,180,255,.3)' });
      return { world: { curtain: 1, curtainLit: 1 }, actors: A, lights: L, fx: f > 926 ? [{ type: 'fear', x: 230, y: -260 }] : [] };
    } },

  // 13 — it was just the cat
  { f0: 976, f1: 1017, light: () => 'dark', dof: {},
    cam: [{ f: 976, x: -620, y: -960, z: 2.35 }, { f: 1017, x: -620, y: -940, z: 2.1 }],
    build(f) {
      const meow = f >= 986 && f <= 1000 ? Math.sin(prog(f, 986, 1000) * Math.PI) : 0;
      return {
        world: { curtain: 1 - sstep(prog(f, 974, 985)), curtainLit: 1, cat: { x: -620, y: -742, s: 0.55, meow, happy: f > 1003, tilt: f > 1003 ? 0.15 : 0 } },
        actors: [], lights: [{ x: -620, y: -1000, r: 600, i: 1, col: 'rgba(160,190,255,.35)' }],
        fx: f >= 990 && f < 1006 ? [{ type: 'sparkle', x: -520, y: -1000, k: 0.5 * Math.sin(prog(f, 990, 1006) * Math.PI) }] : [],
      };
    } },

  // 14 — the hero of the night. With pink nails.
  { f0: 1018, f1: TOTAL - 1, light: () => 'gold', dof: { room: 2 },
    cam: (() => { const h = handWorld(168, 0, -150, -150, 0.52); return [{ f: 1018, x: -150, y: -440, z: 1.05 }, { f: 1045, x: -150, y: -470, z: 1.22 }, { f: 1090, x: h[0] - 6, y: h[1] - 10, z: 3.9 }, { f: TOTAL - 1, x: h[0] - 6, y: h[1] - 14, z: 4.1 }]; })(),
    build(f) {
      const hero = springAt(f, 1039, 0.8);
      const pose = mixPose('hang', 'hero', clamp(hero, 0, 1.15));
      const A = [];
      const spots = [['bia', -560, 250], ['lara', 300, 260], ['rita', -400, 440], ['duda', 120, 470], ['nina', -760, 520], ['joana', 560, 450], ['sofia', -120, 600]];
      spots.forEach(([w, x, y], i) => A.push(G(w, x, y, { expr: i % 2 ? 'laugh' : 'grin', pose: 'up', hop: Math.max(0, Math.sin(f * 0.32 + i * 1.3)) * 45, look: [x < -150 ? 0.7 : -0.7, -0.8] })));
      A.push(BOY({ x: -150, y: -150, s: 0.52, sit: false, noShadow: true, cape: true, braids: 1, plaque: 1, nails: 5, pose, expr: f < 1036 ? 'happy' : 'proud', sq: f >= 1031 && f < 1039 ? 0.12 * prog(f, 1031, 1037) : 0 }));
      A.push({ who: 'cat', x: 480, y: -255, s: 0.36, happy: true, layer: 'front', cat: true });
      const fx = [{ type: 'confetti', n: 40, x0: -900, w: 1500, y0: -1500, h: 2200, f0: 1018 }];
      const h = handWorld(168, 0, -150, -150, 0.52);
      if (f >= 1090) for (let i = 0; i < 3; i++) fx.push({ type: 'sparkle', x: h[0] + (i - 1) * 38, y: h[1] - 45 - (i % 2) * 12, k: 0.14 * (0.6 + 0.4 * Math.sin(f * 0.3 + i * 2)), col: '#ff9fd0' });
      return { world: {}, actors: A, fx };
    } },
];

// shared setup for shots 10–11: circle on the rug in the dark
function circleScene(f, mode) {
  const ring = [['bia', -470, 230], ['lara', -380, 470], ['rita', -200, 120], ['duda', 200, 120], ['nina', 380, 470], ['joana', 470, 230]];
  const A = [], L = [];
  const lightsOff = f >= 705;
  ring.forEach(([w, x, y], i) => {
    const on = f >= 716 + i * 3;
    const boo = mode === 'stories' && w === 'bia' && f >= 746 && f < 766;
    const jump = mode === 'scream' && f >= 828 && f < 840;
    let look = [x < 0 ? 0.8 : -0.8, -0.3];
    if (mode === 'scream' && f < 800) look = [Math.sin(f * 0.2 + i) > 0 ? 1 : -1, 0];
    const a = G(w, x, y, {
      expr: jump ? 'shocked' : boo ? 'grin' : on ? 'spooky' : 'grin',
      pose: boo ? 'boo' : on ? 'flash' : 'hang', props: { flashlight: on ? 1 : 0 },
      hop: jump ? Math.sin(prog(f, 828, 840) * Math.PI) * 40 : boo ? Math.sin(prog(f, 746, 756) * Math.PI) * 25 : 0, look,
    });
    A.push(a);
    if (on && lightsOff) { const hp = headPos(a); L.push({ x: hp[0], y: hp[1] - 10, r: 175, i: 0.95 }); }
  });
  A.push(G('sofia', 630, 120, { expr: f < 705 ? 'mischief' : 'spooky', pose: f < 712 ? { L: [12, 6], R: [168, 0] } : 'hang', look: [1, -1] }));
  const scream = mode === 'scream' && f >= 826;
  const scared = mode === 'stories' && f >= 748;
  const b = G('boy', 0, 330, {
    s: 0.52, braids: 1, braidUp: scream && f < 850, plaque: 1, nails: 5,
    expr: scream ? (f < 852 ? 'scream' : 'worried') : scared ? 'scared' : f >= 705 ? 'worried' : 'neutral',
    pose: scream && f < 852 ? 'cheeks' : 'hang', look: mode === 'scream' && f > 800 && f < 826 ? [0, 0] : [-0.5, 0],
    hop: scream ? Math.max(0, Math.sin(prog(f, 826, 842) * Math.PI)) * 50 : scared && f < 760 ? Math.sin(prog(f, 750, 760) * Math.PI) * 25 : 0,
    sweat: f > 720 ? 1 : 0,
  });
  A.push(b);
  if (lightsOff && (mode === 'scream' && f >= 800 || f >= 748)) { const hb = headPos(b); L.push({ x: hb[0], y: hb[1], r: 190, i: 0.95 }); }
  if (lightsOff) L.push({ x: -620, y: -1040, r: 480, i: 0.6, col: 'rgba(150,180,255,.3)' });
  const fx = [];
  if (scream && f < 856) fx.push({ type: 'lines', x: 0, y: -90, r: 150, k: 0.6 + 0.4 * Math.sin(f * 1.5) });
  return { world: { lightOff: f >= 703, curtain: 1 }, actors: A, lights: L, fx };
}

function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
