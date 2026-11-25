// criativo animado — curso (gancho, dores, solução, CTA) — @30fps
const B = [0, 78, 144, 208, 278, 333, 427, 549, 622, 701];
const TOTAL = B[B.length - 1];
const FLASHES = [];
const ks = (y) => 0.5 * (0.94 + y / 2500);
const HM2 = (x, y, o = {}) => Object.assign({ who: 'homem', x, y, s: ks(y), layer: 'front', expr: 'neutral' }, o);
const pop = (f, a, b = a + 8) => backOut(prog(f, a, b));
const big = (f, f0, f1, text, col, y) => (f >= f0 && f < f1 ? [{ type: 'big', text, col, y, k: pop(f, f0, f0 + 8) * (1 - prog(f, f1 - 4, f1)) }] : []);
const tag = (f, f0, f1, text, y = 300) => (f >= f0 && f < f1 ? [{ type: 'tag', text, k: pop(f, f0) * (1 - prog(f, f1 - 5, f1)), y }] : []);
const S = [];
function shot(i, o) { const f0 = B[i], f1 = B[i + 1] - 1; o.f0 = f0; o.f1 = f1; o.light = o.light || (() => 'day'); o.dof = o.dof || {}; const c = o.c; o.cam = [{ f: f0, x: c[0][0], y: c[0][1], z: c[0][2] }, { f: f1, x: (c[1] || c[0])[0], y: (c[1] || c[0])[1], z: (c[1] || c[0])[2] }]; const b = o.b; o.build = (f) => b(f, f - f0, f1 - f0); S[i] = o; }
const ROOM = { set: 'room', tvOn: false };
const ITENS = ['Sem precisar\naparecer', 'Sem produto\npróprio', 'Começando\ndo zero', 'Direto do\ncelular'];
shot(0, { c: [[0, -380, 0.95], [0, -400, 1.2]], kicks: [{ f: 4, a: 10 }], b: (f) => ({ world: ROOM, actors: [HM2(-150, 330, { expr: 'surprised', pose: 'card', look: [1, -0.3] })], fx: [{ type: 'moedas', x: 200, y: -300 }, { type: 'interroga', x: 250, y: -900 }], screen: big(f, 2, B[1], 'DÁ PRA COMEÇAR', '#ffd23f', 560).concat(big(f, 12, B[1], 'DO ZERO?', '#ff5fa2', 800)) }) });
shot(1, { c: [[0, -350, 0.8], [0, -360, 0.9]], b: (f) => ({ world: ROOM, actors: [HM2(-150, 380, { expr: 'bored', sit: true, pose: 'controller', look: [1, 0], sweat: 0.6 })], fx: [{ type: 'mesa', x: 250, y: 300, s: 0.8, pilha: 6 + Math.floor((f - B[1]) / 5) }], screen: [{ type: 'dor', text: 'TRABALHA MUITO, GANHA POUCO', k: prog(f, B[1] + 2, B[1] + 10), y: 330 }] }) });
shot(2, { c: [[0, -300, 0.9]], kicks: [{ f: B[2] + 18, a: 8 }], b: (f, l) => ({ world: ROOM, actors: [HM2(0, 330, { expr: l > 18 ? 'worried' : 'happy', pose: l > 18 ? 'cheeks' : 'up' })], fx: [{ type: 'papeis', x: 0, y: 0, n: 3 + Math.floor(l / 8) }, { type: 'xis', x: 0, y: -550, k: prog(l, 16, 26) }], screen: [{ type: 'dor', text: 'TENTOU E NÃO DEU CERTO', k: prog(f, B[2] + 2, B[2] + 10), y: 330 }] }) });
shot(3, { c: [[0, -320, 1.0], [0, -330, 1.12]], b: (f, l) => ({ world: ROOM, actors: [HM2(0, 330, { expr: 'worried', pose: 'cheeks', look: [Math.sin(l * 0.15), -0.3], tilt: Math.sin(l * 0.2) * 0.08 })], fx: [{ type: 'interroga', x: 0, y: -700 }], screen: [{ type: 'dor', text: 'NÃO SABE POR ONDE COMEÇAR', k: prog(f, B[3] + 2, B[3] + 10), y: 330 }] }) });
shot(4, { c: [[0, -350, 0.95], [0, -380, 1.1]], kicks: [{ f: B[4] + 6, a: 10 }], b: (f) => ({ world: ROOM, actors: [HM2(0, 330, { expr: 'grin', pose: 'point', look: [0, 0] })], fx: [{ type: 'sparkle', x: 0, y: -600, k: 0.8 }], screen: big(f, B[4] + 4, B[5], 'ISSO MUDA HOJE', '#7bf1a8', 1450) }) });
FLASHES.push(B[4] + 4);
shot(5, { c: [[0, -250, 0.9], [0, -260, 0.98]], b: (f, l, T) => ({ world: ROOM, actors: [HM2(-470, 380, { expr: 'happy', pose: 'reachR', look: [1, -0.2] })], fx: [{ type: 'celular', x: 230, y: -360, s: 0.85 * pop(f, B[5]), n: 0, items: ITENS }], screen: tag(f, B[5] + 4, B[6], 'MÉTODO PASSO A PASSO', 250) }) });
shot(6, { c: [[120, -360, 1.15], [120, -360, 1.25]], b: (f, l, T) => ({ world: ROOM, actors: [HM2(-470, 380, { expr: 'laugh', pose: 'reachR', look: [1, -0.2] })], fx: [{ type: 'celular', x: 230, y: -360, s: 0.85, n: 0.4 + l / T * 4.2, items: ITENS }] }) });
shot(7, { c: [[0, -350, 0.95], [0, -360, 1.05]], b: (f, l) => ({ world: ROOM, actors: [HM2(0, 330, { expr: 'proud', sit: false, pose: 'hero', hop: Math.abs(Math.sin(l * 0.25)) * 40 })], fx: [{ type: 'celular', x: 520, y: -520, s: 0.4, n: 4, items: ITENS, rot: 0.12 }, { type: 'confetti', x: 0, y: -900 }], screen: tag(f, B[7] + 2, B[8], 'AULAS CURTAS · NO SEU RITMO', 300) }) });
shot(8, { c: [[0, 250, 0.85], [0, 240, 0.9]], b: (f) => ({ world: ROOM, actors: [HM2(0, 330, { expr: 'grin', pose: 'point', look: [0, -0.6] })], screen: [{ type: 'cta', k: prog(f, B[8] + 2, B[8] + 12), text: 'QUERO COMEÇAR', y: 1290, sub: 'TOCA NO LINK 👇' }].concat(big(f, B[8] + 2, TOTAL + 1, 'COMECE HOJE', '#ffd23f', 420)) }) });
const SHOTS = S;
function shotAt(f) { for (const s of SHOTS) if (f >= s.f0 && f <= s.f1) return s; return f < 0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]; }
