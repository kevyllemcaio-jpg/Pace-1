// ACHE O BOLINHA #1 — @30fps
const TIM = {"st": [1, 190, 444, 531, 797, 878, 1136, 1210, 1479, 1579, 1908, 2017], "en": [171, 290, 497, 643, 844, 982, 1176, 1325, 1545, 1754, 1983, 2188], "tot": 2212};
const ST = TIM.st, EN = TIM.en, TOTAL = TIM.tot;
const FLASHES = [];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const K = (who, x, y, o = {}) => Object.assign({ who, x, y, s: ks(y), layer: 'front', expr: 'neutral' }, o);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const tag = (f, f0, f1, text, y = 220) => (f >= f0 && f < f1 ? [{ type: 'tag', text, k: pop(f, f0) * (1 - prog(f, f1 - 6, f1)), y }] : []);
const big = (f, f0, f1, text, col, y) => (f >= f0 && f < f1 ? [{ type: 'big', text, col, y, k: pop(f, f0, f0 + 10) * (1 - prog(f, f1 - 5, f1)) }] : []);
const KIDS = ['bia', 'lara', 'rita', 'duda', 'nina', 'joana', 'sofia', 'bruno', 'lucas', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'vit'];
const EXZ = ['happy', 'neutral', 'grin', 'surprised', 'laugh', 'innocent', 'bored'];
const PZ = ['hang', 'wave', 'hips', 'point', 'up', 'clap', 'cheeks'];
function crowd(n, seed, area, opts = {}) {
  const out = []; const cols = Math.ceil(Math.sqrt(n * 1.1)), rows = Math.ceil(n / cols);
  for (let i = 0; i < n; i++) {
    const c = i % cols, r = Math.floor(i / cols); const x = lerp(area[0], area[1], (c + 0.5 + (hash(seed + i) - 0.5) * 0.7) / cols), y = lerp(area[2], area[3], (r + 0.5 + (hash(seed + i * 3) - 0.5) * 0.6) / rows);
    out.push({ who: opts.who ? opts.who(i) : KIDS[Math.floor(hash(seed + i * 7) * KIDS.length)], x, y, expr: EXZ[Math.floor(hash(seed + i * 5) * EXZ.length)], pose: PZ[Math.floor(hash(seed + i * 11) * PZ.length)], flip: hash(seed + i * 13) > 0.5 ? 1 : -1, ph: hash(seed + i * 17) * 6 });
  }
  return out;
}
const LV = [
  { set: { set: 'yard' }, n: 26, seed: 11, area: [-1050, 1050, 80, 1150], hero: 17, who: 'boy', light: 'day', z: 0.48, cy: 450 },
  { set: { set: 'street' }, n: 36, seed: 23, area: [-1050, 1050, 60, 1150], hero: 22, who: 'boycap', light: 'day', z: 0.48, cy: 450, decoy: (i) => (i % 3 === 0 ? 'v4' : null) },
  { set: { set: 'vila', mode: 'dia' }, n: 44, seed: 37, area: [-1050, 1050, 60, 1150], hero: 31, who: 'boy', light: 'day', z: 0.48, cy: 450, scarf: true },
  { set: { set: 'vila', mode: 'noite' }, n: 40, seed: 51, area: [-1050, 1050, 60, 1150], hero: 9, who: 'boy', light: 'dark', z: 0.48, cy: 450 },
  { set: { set: 'yard' }, n: 50, seed: 67, area: [-1050, 1050, 60, 1150], hero: 38, who: 'boyr', light: 'day', z: 0.48, cy: 450, allBoy: true },
];
const S = [];
S.push({ f0: 0, f1: EN[0] + 14, light: () => 'day', dof: {}, cam: [{ f: 0, x: 0, y: -300, z: 1.0 }, { f: EN[0], x: 0, y: -320, z: 1.15 }],
  build: (f) => ({ world: { set: 'yard' }, actors: [K('boy', 0, 300, { expr: 'mischief', pose: 'wave', hop: Math.abs(Math.sin(f * 0.15)) * 40 })], screen: big(f, 6, EN[0] + 14, 'ACHE O', '#ffd23f', 560).concat(big(f, 16, EN[0] + 14, 'BOLINHA', '#ff5fa2', 820), tag(f, 60, EN[0] + 14, '5 NÍVEIS · 5 SEGUNDOS', 1500)) }) });
LV.forEach((L, k) => {
  const a = k === 0 ? EN[0] + 15 : ST[2 * k + 1] - 6, sEnd = ST[2 * k + 2], b = k === 4 ? EN[2 * k + 2] + 20 : ST[2 * k + 3] - 7;
  const C = crowd(L.n, L.seed, L.area, { who: L.allBoy ? () => 'boy' : L.decoy ? (i) => L.decoy(i) || KIDS[Math.floor(hash(L.seed + i * 7) * KIDS.length)] : null });
  const H = C[L.hero]; H.who = L.who;
  // ninguém na frente cobre o rosto do Bolinha (ele fica na profundidade certa, sem aparecer por cima de todos)
  for (const c of C) if (c !== H && c.y >= H.y - 40 && c.y - H.y < 520 && Math.abs(c.x - H.x) < 270) c.x = H.x + (c.x >= H.x ? 270 : -270);
  S.push({ f0: a, f1: b, light: () => L.light, dof: {}, kicks: [{ f: sEnd, a: 8 }],
    cam: [{ f: a, x: 0, y: L.cy, z: L.z }, { f: sEnd, x: 0, y: L.cy, z: L.z }, { f: sEnd + 20, x: H.x, y: H.y - 200, z: 1.0, e: 'o' }, { f: b, x: H.x, y: H.y - 210, z: 1.05 }],
    build: (f) => {
      const t = f / FPS, rev = prog(f, sEnd, sEnd + 18), search = f >= EN[2 * k + 1] && f < sEnd;
      const acts = C.map((c, i) => K(c.who, c.x + Math.sin(t * 0.8 + c.ph) * 18, c.y, { expr: i === L.hero && rev > 0 ? 'proud' : c.expr, pose: c.pose, flip: c.flip, hop: Math.max(0, Math.sin(t * 3 + c.ph)) * 14, scarf: L.scarf ? ['#e63946', '#ffd23f', '#3a86ff', '#22b573'][i % 4] : null }));
      const lights = L.light === 'dark' ? [{ x: Math.sin(t * 1.3) * 900, y: 400 + Math.cos(t * 0.9) * 400, r: 520, i: 1, col: 'rgba(255,240,180,.35)' }].concat(rev > 0 ? [{ x: H.x, y: H.y - 150, r: 500 * rev, i: 1 }] : []) : [];
      const clock = search ? [{ type: 'relogio', k: pop(f, EN[2 * k + 1]) * 0.7, n: Math.max(1, 5 - Math.floor((f - EN[2 * k + 1]) / 30)), p: prog(f, EN[2 * k + 1], sEnd) }] : [];
      return { world: L.set, actors: acts, lights, fx: [{ type: 'spot', x: H.x, y: H.y - 180, r: 330, k: rev }, { type: 'seta', x: H.x, y: H.y - 560, k: pop(f, sEnd + 10) }],
        screen: tag(f, a, EN[2 * k + 1] + 10, 'NÍVEL ' + (k + 1) + (k === 4 ? ' · IMPOSSÍVEL' : ''), 220).concat(clock, rev > 0 ? big(f, sEnd + 8, b, 'ACHOU?', '#7bf1a8', 1550) : []) };
    } });
});
S.push({ f0: S[S.length - 1].f1 + 1, f1: TOTAL, light: () => 'day', dof: {}, cam: [{ f: S[S.length - 1].f1 + 1, x: 0, y: -300, z: 1.0 }, { f: TOTAL, x: 0, y: -320, z: 1.15 }],
  build: (f) => ({ world: { set: 'yard' }, actors: [K('boy', 0, 300, { expr: 'grin', pose: 'point' })], screen: big(f, S[S.length - 1].f0 + 6, TOTAL + 1, 'SEU PLACAR?', '#ffd23f', 620).concat(big(f, S[S.length - 1].f0 + 30, TOTAL + 1, '? / 5', '#ff5fa2', 900), tag(f, S[S.length - 1].f0 + 60, TOTAL + 1, 'COMENTA 👇', 1500)) }) });
const SHOTS = S;
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
