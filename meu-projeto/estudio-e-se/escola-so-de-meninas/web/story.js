// "E se você fosse o único menino numa escola só de meninas?" — 1050 frames @30fps (voice 35.0 s)
const TOTAL = 1050;
const FLASHES = [609, 851];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const G = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front' }, o);
const B = (x, y, o = {}) => G('boy', x, y, o);
function walkTo(f, f0, f1, a, b) {
  const t = prog(f, f0, f1), e = sstep(t);
  const x = lerp(a[0], b[0], e), y = lerp(a[1], b[1], e);
  return { x, y, walk: t > 0 && t < 1 ? Math.hypot(b[0] - a[0], b[1] - a[1]) * e / 42 : null };
}
const giggle = (f, i) => Math.sin(f * 0.45 + i * 1.7) * 0.06;
const ALLG = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana', 'sofia'].concat(XG);

// classroom: desks in 3 rows; boy in the middle of row 2
const SEATS = [];
[[110, [-760, -380, 0, 380, 760]], [340, [-820, -410, 0, 410, 820]], [580, [-880, -440, 440, 880]]].forEach(([y, xs]) => xs.forEach((x) => SEATS.push([x, y])));
function classroom(f, o = {}) {
  const A = [];
  let gi = 0;
  SEATS.forEach(([x, y], i) => {
    const k = ks(y) / 0.5;
    A.push({ type: 'desk', x, y, s: k, layer: 'front' });
    if (o.boySeat && x === 0 && y === 340) { A.push(B(0, y - 12, Object.assign({ sit: true }, o.boy))); return; }
    if (o.emptyBoy && x === 0 && y === 340) return;
    const w = ALLG[gi++ % ALLG.length];
    const turn = o.turnAt != null ? prog(f, o.turnAt + (i % 4), o.turnAt + 3 + (i % 4)) : 0;
    const target = o.lookAt || [0, 0];
    const lx = clamp((target[0] - x) / 500, -1, 1), ly = clamp((target[1] - (y - 400)) / 600, -1, 1);
    const chat = [Math.sin(f * 0.05 + i) > 0 ? 1 : -1, 0];
    A.push(G(w, x, y - 12, { sit: true, uniform: true, expr: turn > 0.5 ? (o.stareExpr || 'surprised') : (i % 3 ? 'happy' : 'grin'), look: turn > 0.5 ? [lx, ly] : chat, tilt: turn > 0.5 ? lx * 0.12 : giggle(f, i) * 0.5 }));
  });
  return A;
}

const SHOTS = [
  // 1 — hook: the only boy in a class full of girls
  { f0: 0, f1: 96, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 0, x: 0, y: -90, z: 1.55 }, { f: 96, x: 0, y: -110, z: 1.85 }],
    build(f) {
      return { world: { set: 'class' }, actors: classroom(f, { boySeat: true, boy: { expr: f < 30 ? 'surprised' : 'worried', sweat: 1, look: [f < 48 ? -0.8 : 0.8, 0] }, turnAt: -10, lookAt: [0, -100], stareExpr: 'happy' }),
        fx: f > 25 ? [{ type: 'exclaim', x: 0, y: -380, k: backOut(prog(f, 25, 33)) * 0.6 }] : [] };
    } },

  // 2 — first day: walking down the hall with a backpack
  { f0: 97, f1: 138, light: () => 'day', dof: {},
    cam: [{ f: 97, x: -350, y: -420, z: 0.95 }, { f: 138, x: -250, y: -400, z: 1.0 }],
    build(f) {
      const w = walkTo(f, 97, 150, [-800, 260], [-150, 300]);
      const notes = [];
      for (let i = 0; i < 2; i++) { const t = ((f + i * 20) % 40) / 40; notes.push({ type: 'note', x: w.x + 80 + t * 60, y: w.y - 520 - t * 160, a: Math.sin(t * Math.PI), k: 0.7 }); }
      return { world: { set: 'hall' }, actors: [B(w.x, w.y, { walk: w.walk, backpack: 1, expr: 'happy', pose: 'hang' })], fx: notes };
    } },

  // 3 — opens the door: thirty heads turn at once
  { f0: 139, f1: 254, light: () => 'day', dof: {},
    cam: [{ f: 139, x: -700, y: -470, z: 0.66 }, { f: 203, x: -690, y: -460, z: 0.7 }, { f: 212, x: -760, y: -440, z: 0.78, e: 'o' }, { f: 254, x: -1060, y: -380, z: 1.25 }],
    kicks: [{ f: 205, a: 10 }],
    build(f) {
      const door = sstep(prog(f, 143, 156));
      const A = classroom(f, { emptyBoy: true, turnAt: 202, lookAt: [-1200, -300], stareExpr: 'surprised' });
      const w = walkTo(f, 152, 180, [-1250, 40], [-1120, 120]);
      if (f >= 148) A.push(B(w.x, w.y, { walk: w.walk, backpack: 1, expr: f < 205 ? 'happy' : 'worried', pose: f > 182 ? { L: [12, 6], R: [140, 30 + Math.sin(f * 0.6) * 15] } : 'hang', sweat: f > 215 ? 1 : 0, look: [1, 0] }));
      return { world: { set: 'class', door }, actors: A, fx: f >= 205 && f < 230 ? [{ type: 'lines', x: -1120, y: -300, r: 160, k: 1 - prog(f, 205, 230) }] : [] };
    } },

  // 4 — the uniform? plaid skirt
  { f0: 255, f1: 339, light: () => 'day', dof: { room: 4 },
    cam: [{ f: 255, x: 0, y: -230, z: 1.1 }, { f: 339, x: 0, y: -210, z: 1.25 }],
    build(f) {
      const tw = prog(f, 262, 290);
      const sx = Math.cos(tw * Math.PI * 4);
      const fx = [];
      if (f >= 300 && f < 318) fx.push({ type: 'sparkle', x: 0, y: 80, k: 0.7 * Math.sin(prog(f, 300, 318) * Math.PI) }, { type: 'sparkle', x: -320, y: 120, k: 0.5 * Math.sin(prog(f, 302, 318) * Math.PI) }, { type: 'sparkle', x: 320, y: 120, k: 0.5 * Math.sin(prog(f, 304, 318) * Math.PI) });
      return { world: { set: 'class' }, fx, actors: [
        G('lara', -330, 280, { uniform: true, expr: 'happy', pose: 'hips' }),
        G('rita', 0, 330, { uniform: true, expr: 'proud', pose: tw > 0 && tw < 1 ? 'up' : 'hips', sx: Math.abs(sx) < 0.2 ? 0.2 * (sx < 0 ? -1 : 1) : sx, hop: Math.sin(tw * Math.PI) * 30 }),
        G('nina', 330, 280, { uniform: true, expr: 'grin', pose: 'hips', flip: -1 }),
      ] };
    } },

  // 5 — yours came as bermuda shorts, borrowed from the janitor
  { f0: 340, f1: 428, light: () => 'day', dof: { room: 3 },
    cam: [{ f: 340, x: 110, y: -250, z: 1.1 }, { f: 428, x: 130, y: -240, z: 1.2 }],
    build(f) {
      const slip = f < 358 ? 0 : f < 372 ? easeIn(prog(f, 358, 368)) : Math.max(0, 1 - backOut(prog(f, 372, 380)));
      const thumbs = f >= 393;
      return { world: { set: 'class' }, actors: [
        G('bia', -330, 200, { uniform: true, expr: f > 362 ? 'laugh' : 'happy', pose: 'cheeks', tilt: giggle(f, 0) }),
        G('zelador', 360, 140, { s: 0.48, expr: thumbs ? 'grin' : 'happy', pose: thumbs ? { L: [10, 10], R: [150, 25] } : { L: [10, 10], R: [30, -70] }, props: { mop: 1 }, look: [-1, 0] }),
        B(30, 320, { bermuda: slip, expr: slip > 0.3 && f < 380 ? 'shocked' : 'bored', pose: f >= 368 && f < 384 ? 'pillow' : 'hang', look: f > 392 ? [1, -0.2] : [0, 0.6], sweat: f > 360 ? 1 : 0 }),
      ], fx: thumbs && f < 410 ? [{ type: 'sparkle', x: 460, y: -390, k: 0.5 * Math.sin(prog(f, 393, 410) * Math.PI) }] : [] };
    } },

  // 6 — recess: the girls' line is huge; the boys' line has one person
  { f0: 429, f1: 529, light: () => 'day', dof: {},
    cam: [{ f: 429, x: -420, y: -380, z: 0.9 }, { f: 470, x: -300, y: -380, z: 0.92 }, { f: 500, x: 860, y: -330, z: 1.15 }, { f: 529, x: 880, y: -320, z: 1.25 }],
    build(f) {
      const A = [];
      for (let i = 0; i < 11; i++) {
        const x = -620 + i * 105, y = 90 + i * 34;
        A.push(G(ALLG[(i + 3) % ALLG.length], x, y, { uniform: true, expr: i % 3 ? 'bored' : 'stern', pose: i % 2 ? 'hips' : 'hang', bob: Math.max(0, Math.sin(f * 0.3 + i)) * -10, look: [-1, 0] }));
      }
      A.push(B(890, 140, { bermuda: 0, expr: 'happy', look: [-0.6, 0], tilt: Math.sin(f * 0.15) * 0.05 }));
      return { world: { set: 'hall' }, actors: A };
    } },

  // 7 — "You."
  { f0: 530, f1: 564, light: () => 'day', dof: { room: 5 },
    cam: [{ f: 530, x: 890, y: -330, z: 1.9 }, { f: 564, x: 890, y: -340, z: 2.15 }],
    build(f) {
      return { world: { set: 'hall', boyDoor: sstep(prog(f, 534, 546)) }, actors: [B(890, 140, { bermuda: 0, expr: 'proud', pose: { L: [45, -80], R: [100, -40] }, tilt: 0.08 })],
        fx: f >= 540 && f < 556 ? [{ type: 'sparkle', x: 1020, y: -520, k: 0.6 * Math.sin(prog(f, 540, 556) * Math.PI) }] : [] };
    } },

  // 8 — "Seems like a dream"
  { f0: 565, f1: 608, light: () => 'dream', dof: { room: 8 },
    cam: [{ f: 565, x: 890, y: -350, z: 2.2, r: -2 }, { f: 608, x: 890, y: -360, z: 2.45, r: 3 }],
    build(f) {
      const fx = [];
      for (let i = 0; i < 5; i++) { const t = ((f + i * 9) % 45) / 45; fx.push({ type: 'sparkle', x: 890 + Math.sin(i * 2.3) * 220, y: -300 - t * 300, k: 0.4 * Math.sin(t * Math.PI), col: ['#fff59d', '#ffc8dd', '#bde0fe'][i % 3] }); }
      return { world: { set: 'hall', boyDoor: 1 }, actors: [B(890, 140, { bermuda: 0, expr: 'bliss', pose: { L: [150, -60], R: [150, -60] }, tilt: Math.sin(f * 0.1) * 0.08 })], fx };
    } },

  // 9 — until the end-of-year ball
  { f0: 609, f1: 668, light: () => 'party', dof: {},
    cam: [{ f: 609, x: 0, y: -1250, z: 1.05 }, { f: 650, x: 0, y: -420, z: 0.72 }, { f: 668, x: 0, y: -400, z: 0.76 }],
    build(f) {
      const A = [B(0, 330, { s: 0.53, bowtie: 1, expr: 'happy', pose: 'hang', look: [0, -0.4] })];
      [['bia', -560, 180], ['lara', 560, 180], ['rita', -760, 460], ['duda', 760, 460], ['nina', -360, 640], ['joana', 360, 640], ['sofia', -880, 260], ['g3', 880, 260]].forEach(([w, x, y], i) => A.push(G(w, x, y, { expr: 'happy', pose: i % 2 ? 'clap' : 'hang', look: [x < 0 ? 0.8 : -0.8, -0.2], bob: Math.sin(f * 0.4 + i) * 8 })));
      return { world: { set: 'gym' }, actors: A, lights: [{ x: 0, y: -400, r: 900, i: 0.6, col: 'rgba(255,120,200,.2)' }] };
    } },

  // 10 — every girl needs a partner. There is ONE boy.
  { f0: 669, f1: 757, light: () => 'party', dof: { room: 3 },
    cam: [{ f: 669, x: 0, y: -330, z: 0.95 }, { f: 724, x: 0, y: -200, z: 1.25 }, { f: 757, x: 0, y: -150, z: 1.6 }],
    kicks: [{ f: 724, a: 12 }],
    build(f) {
      const A = [B(0, 330, { s: 0.53, bowtie: 1, expr: f < 700 ? 'happy' : f < 722 ? 'surprised' : 'shocked', pose: f > 722 ? 'cheeks' : 'hang', sweat: f > 705 ? 1 : 0, look: f < 722 ? [Math.sin(f * 0.2) > 0 ? 1 : -1, 0] : [0, 0] })];
      const ring = [['bia', -560, 180], ['lara', 560, 180], ['rita', -760, 460], ['duda', 760, 460], ['nina', -360, 640], ['joana', 360, 640], ['sofia', -880, 260], ['g3', 880, 260]];
      ring.forEach(([w, x, y], i) => {
        const c = easeOut(prog(f, 706 + i * 2, 740 + i * 2)) * 0.45;
        const px = lerp(x, x * 0.55, c), py = lerp(y, lerp(y, 330, 0.5), c);
        A.push(G(w, px, py, { expr: f > 698 ? 'grin' : 'happy', pose: f > 698 ? { L: [12, 6], R: [95, -10] } : 'hang', flip: x > 0 ? -1 : 1, look: [x < 0 ? 1 : -1, -0.3], walk: c > 0 && c < 0.44 ? (f - 706) * 0.7 : null }));
      });
      const L = [{ x: 0, y: -400, r: 700, i: 0.5, col: 'rgba(255,120,200,.15)' }];
      if (f >= 722) L.push({ x: 0, y: -120, r: 330, i: 1, col: 'rgba(255,240,180,.45)' });
      return { world: { set: 'gym' }, actors: A, lights: L, fx: f >= 724 && f < 744 ? [{ type: 'exclaim', x: 0, y: -380, k: backOut(prog(f, 724, 732)) * 0.8 }] : [] };
    } },

  // 11 — thirty songs in a row, non-stop
  { f0: 758, f1: 850, light: () => 'party', dof: {},
    cam: [{ f: 758, x: 600, y: -330, z: 0.95 }, { f: 850, x: 580, y: -300, z: 1.0 }],
    build(f) {
      const score = clamp(1 + Math.floor((f - 766) / 2.6), 1, 30);
      const beat = Math.floor((f - 758) / 9);
      const spin = f >= 815;
      const poses = ['up', 'wave', 'hips', 'clap'];
      const partner = ALLG[(beat + (spin ? Math.floor(f / 2) : 0)) % ALLG.length];
      const tired = prog(f, 760, 850);
      const A = [
        B(250, 330, { s: 0.53, bowtie: 1, expr: tired > 0.6 ? 'worried' : 'happy', pose: poses[beat % 4], sweat: tired > 0.3 ? 1 : 0, hop: Math.abs(Math.sin(f * 0.35)) * 25, sx: spin ? Math.cos(f * 0.9) : 1, tilt: Math.sin(f * 0.35) * 0.1 }),
        G(partner, 480, 320, { expr: 'laugh', pose: poses[(beat + 2) % 4], hop: Math.abs(Math.sin(f * 0.35 + 1)) * 25, flip: -1, sx: spin ? Math.cos(f * 0.9 + 1) : 1 }),
      ];
      for (let i = 0; i < 6; i++) A.push(G(ALLG[(beat + 1 + i) % ALLG.length], -120 - i * 120, 230 + (i % 2) * 70, { expr: 'happy', pose: 'clap', look: [1, 0], bob: Math.sin(f * 0.4 + i) * 6 }));
      const fx = spin ? [{ type: 'speed', x: 380, y: -40, dir: 1 }, { type: 'speed', x: 120, y: -150, dir: -1 }] : [];
      if (f % 9 < 3) fx.push({ type: 'note', x: 360 + (beat % 3) * 60, y: -600, k: 0.8 });
      return { world: { set: 'gym', score }, actors: A, lights: [{ x: 360, y: -150, r: 520, i: 0.8, col: 'rgba(255,200,120,.25)' }, { x: 1030, y: -900, r: 360, i: 0.9 }], fx };
    } },

  // 12 — in the end the principal handed you the trophy
  { f0: 851, f1: 934, light: () => 'gold', dof: {},
    cam: [{ f: 851, x: 80, y: -420, z: 0.95 }, { f: 934, x: 40, y: -380, z: 1.3 }],
    build(f) {
      const give = sstep(prog(f, 890, 904));
      const has = f >= 902;
      return { world: { set: 'stage' }, actors: [
        { type: 'podium', x: 420, y: 160, s: 1, layer: 'front' },
        G('diretora', lerp(170, 90, give), 190, { s: 0.48, expr: 'happy', pose: has ? 'clap' : { L: [12, 6], R: [lerp(30, 80, give), -60] }, look: [-1, 0] }),
        B(-130, 200, { s: 0.52, bowtie: 1, expr: has ? 'proud' : 'bored', sweat: has ? 0 : 1, pose: has ? 'pillow' : 'hang', props: has ? { trophy: backOut(prog(f, 902, 910)) } : {}, hop: has ? Math.sin(prog(f, 902, 912) * Math.PI) * 30 : 0, tilt: has ? 0 : -0.1 }),
      ], fx: has ? [{ type: 'confetti', n: 30, x0: -700, w: 1400, y0: -1400, h: 1700, f0: 902 }] : [] };
    } },

  // 13 — "Best student (female) of the year" — certificate insert
  { f0: 935, f1: 985, light: () => 'gold', dof: { room: 6 },
    cam: [{ f: 935, x: -130, y: -380, z: 1.6 }, { f: 952, x: -130, y: -330, z: 2.6, e: 'o' }, { f: 985, x: -130, y: -330, z: 2.8 }],
    kicks: [{ f: 944, a: 10 }],
    build(f) {
      return { world: { set: 'stage' }, actors: [B(-130, 200, { s: 0.52, bowtie: 1, expr: f < 944 ? 'proud' : 'surprised', pose: 'pillow', props: { cert: 1 }, look: [0, 0.8] })] };
    } },

  // 14 — nobody proofread the certificate
  { f0: 986, f1: TOTAL - 1, light: () => 'gold', dof: { room: 2 },
    cam: [{ f: 986, x: 60, y: -440, z: 1.05 }, { f: 1040, x: -110, y: -350, z: 1.75 }, { f: TOTAL - 1, x: -110, y: -350, z: 1.8 }],
    build(f) {
      return { world: { set: 'stage' }, actors: [
        { type: 'podium', x: 420, y: 160, s: 1, layer: 'front' },
        G('diretora', 90, 190, { s: 0.48, expr: 'laugh', pose: { L: [35 + Math.sin(f * 0.9) * 10, -125], R: [35 + Math.sin(f * 0.9) * 10, -125] }, look: [-1, 0] }),
        B(-130, 200, { s: 0.52, bowtie: 1, expr: f < 1000 ? 'surprised' : 'bored', pose: 'pillow', props: { cert: f >= 1010 ? 2 : 1 }, look: f < 1000 ? [0, 0.8] : [0, 0], tilt: f > 1020 ? -0.08 : 0 }),
      ], fx: f >= 1010 && f < 1030 ? [{ type: 'sparkle', x: 60, y: -360, k: 0.5 * Math.sin(prog(f, 1010, 1030) * Math.PI), col: '#ff9fd0' }] : [] };
    } },
];
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
