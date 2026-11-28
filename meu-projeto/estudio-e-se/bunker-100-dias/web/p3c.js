
// ---------- shots
const T = (f) => f / 30;
const C = (p, l, d) => ({ p, l, d });
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const hero = civ;
function reset() {
  STREET.visible = false; ROOF.visible = false; TUNNEL.visible = false; portal.visible = false; rain.visible = false; shards.visible = false; runaway.visible = false;
  cracks.forEach((c) => (c.visible = false)); cars.forEach((c) => (c.visible = false));
  for (const o of [...FORMS, ...zghosts, ...peds, monster, meteor, crater, bigCrater, watchItem, ...fireballs, debris, livia, openCan, ENT, asteroid]) o.visible = false;
  for (const o of [BUNK, curtain, vault, frameV, sunDisc]) o.visible = true;
  hero.userData.watch.visible = false; HFN = null; scene.background = SKY;
  heroLight.intensity = 0; heroLight.distance = 10; portalLight.intensity = 0; meteorLight.intensity = 0; watchLight.intensity = 0; sunLight.intensity = 0; boomL(0);
  fill.intensity = 1.2; fill.color.set('#ffb27a'); hemi.intensity = 0.55; hemi.color.set('#b39cff'); key.intensity = 0.25; scene.fog.near = 30; scene.fog.far = 170; scene.fog.color.set('#2a0f55');
  lamp.intensity = 7; lamp.color.set('#ffb35c'); bulb.visible = true; vault.rotation.y = Math.PI; vault.userData.wheel.rotation.z = 0; sunDisc.material.color.set('#1c1a22');
  curtainWave(0, 0); renderer.toneMappingExposure = 1.25;
}
function boomL(i) { heroLight.intensity = i; }
function indoor() { STREET.visible = false; }
const HX0 = BX - 0.38, LX0 = BX + 0.38;
function pair(z, o = {}) { // both standing side by side facing +z (toward the door)
  const h = show(hero, o.hx ?? HX0, 0, z, o.hry ?? 0); h.scale.setScalar(1); hero.userData.watch.visible = false;
  const l = show(livia, o.lx ?? LX0, 0, o.lz ?? z, o.lry ?? 0); l.scale.setScalar(0.95);
  setFace(hero, o.he || 'happy', o.hl || 0); setFace(livia, o.le || 'happy', o.ll || 0); return [h, l];
}
const TAGS = (txt, y, k, size = 120, col = '#ffffff') => titleLine(txt, y, k, size, col);

const SHOTS = [
  // 1 — hook: 100 days in a bunker with your crush
  { f0: 0, f1: 55, run(f) { pair(1.0, { he: f < 20 ? 'shock' : 'worry', le: 'happy', ll: -0.5 }); hero.userData.head.rotation.y = Math.sin(f * 0.2) * 0.08;
    return { cam: C([BX + Math.sin(T(f)) * 0.15, 1.6, 3.1 - prog(f, 0, 55) * 0.5], [BX, 1.55, 1.0], 2.3), ap: 0.004, shake: f < 6 ? 1.5 : 0.1, fx: () => { if (f < 5) tint('rgba(255,255,255,A)', 1 - f / 5); TAGS('100 DIAS', 260, pop(f, 32), 150, '#ffd23f'); } }; } },
  // 2 — ...with the person you like
  { f0: 56, f1: 108, run(f) { pair(1.0, { he: 'worry', le: f > 75 ? 'blush' : 'happy', ll: -0.6 }); livia.userData.head.rotation.set(0, -0.4, 0.08);
    const h = wpos(livia.userData.head); return { cam: C([h.x + 0.25, h.y + 0.05, h.z + 1.25 - prog(f, 56, 108) * 0.2], [h.x, h.y - 0.05, h.z], 1.25), ap: 0.008, fx: () => { if (f > 75) { const p = PV(h); for (let i = 0; i < 5; i++) { const t = ((f * 0.02 + i / 5) % 1); glow(p[0] + Math.sin(i * 2 + f * 0.05) * 260, p[1] - 200 - t * 500, 50, '255,95,162', Math.sin(t * Math.PI) * 0.6); } } TAGS('SEU CRUSH', 260, pop(f, 66), 140, '#ff5fa2'); } }; } },
  // 3 — and only 300 cans of sausage
  { f0: 109, f1: 160, run(f) { const k = prog(f, 109, 160); return { cam: C([BX + 2.0 - k * 0.3, 0.35 + k * 1.6, -2.2 + k * 0.4], [BX + 3.4, 0.6 + k * 0.2, -4.4], 3), ap: 0.003, fx: () => { TAGS('300 LATAS 🥫', 280, pop(f, 126), 130, '#ffd23f'); } }; } },
  // 4 — the giant door closes
  { f0: 161, f1: 192, run(f) { pair(0.8, { he: 'shock', le: 'shock' }); hero.userData.head.rotation.y = Math.PI * 0; const t = ss(prog(f, 161, 182)); vault.rotation.y = Math.PI - 1.7 * (1 - t); vault.userData.wheel.rotation.z = t * 4; sunDisc.material.color.set(t < 0.95 ? '#c9a878' : '#1c1a22'); sunLight.intensity = 10 * (1 - t); lamp.intensity = 4;
    return { cam: C([BX + 2.6, 1.4, 2.4], [BX - 0.2, 1.5, 5.9], 4.2), bloom: 0.2, ap: 0.002, shake: f >= 182 ? 2.6 * (1 - prog(f, 182, 192)) : 0.2, fx: () => { if (f >= 182) { const p = P(BX, 0.3, 5.8); dust(p[0], p[1], prog(f, 182, 200), 1.4); } if (t < 1) { const p = P(BX, 1.55, 5.95); glow(p[0], p[1], 600 * (1 - t), '255,240,200', 0.6 * (1 - t)); } } }; } },
  // 5 — an asteroid was heading for Earth
  { f0: 193, f1: 272, run(f) { STREET.visible = true; BUNK.visible = false; curtain.visible = vault.visible = frameV.visible = sunDisc.visible = false; scene.background = SKY_RED; scene.fog.color.set('#5a1a1a'); key.intensity = 1.4; hemi.intensity = 1.2; hemi.color.set('#ff9a6b');
    traffic(T(f)); const t = prog(f, 193, 272); asteroid.visible = true; asteroid.position.set(lerp(-60, -20, t), lerp(140, 70, t), -260 + t * 40); asteroid.rotation.set(f * 0.01, f * 0.013, 0); asteroid.scale.setScalar(1 + t * 0.6);
    return { cam: C([1.5, 1.2, -10], [-8, 40, -120], 60), ap: 0.0008, shake: 0.4 + t * 1.2, fx: () => { const p = PV(asteroid.position); for (let j = 1; j < 12; j++) glow(p[0] - j * 70, p[1] - j * 60, 260 - j * 14, j % 2 ? '255,120,20' : '255,200,80', 0.5); glow(p[0], p[1], 420, '255,140,30', 0.6); tint('rgba(255,60,0,A)', 0.12 + 0.08 * Math.sin(f * 0.3)); embers(f, 0.6, 3); } }; } },
  // 6 — everybody ran
  { f0: 273, f1: 303, run(f) { STREET.visible = true; BUNK.visible = false; curtain.visible = vault.visible = frameV.visible = sunDisc.visible = false; scene.background = SKY_RED; scene.fog.color.set('#5a1a1a'); key.intensity = 1.4; hemi.intensity = 1.2; hemi.color.set('#ff9a6b'); parkCars();
    peds.forEach((p, i) => placeK(p, { x: [-3, 2, -1, 3.4, 0.6, -2.2][i], z: -40 + (f - 273) * 0.25 + i * 1.6, ry: 0, ph: f * 0.4 + i, amt: 1, lean: 0.3 })); peds.forEach((p) => setFace(p, 'shock'));
    return { cam: C([0.4, 1.1, -26], [0, 1.6, -36], 8), ap: 0.002, shake: 1.2, fx: () => { tint('rgba(255,60,0,A)', 0.15); embers(f, 0.7, 4); } }; } },
  // 7 — but you remembered grandpa's secret bunker (running hand in hand)
  { f0: 304, f1: 391, run(f) { STREET.visible = true; BUNK.visible = false; curtain.visible = vault.visible = frameV.visible = sunDisc.visible = false; scene.background = SKY_RED; scene.fog.color.set('#5a1a1a'); key.intensity = 1.4; hemi.intensity = 1.2; hemi.color.set('#ff9a6b'); parkCars(); ENT.visible = true;
    const z = -58 - (f - 304) * 0.2; placeK(hero, { x: -0.4, z, ry: Math.PI, ph: f * 0.4, amt: 1, lean: 0.35 }); hero.userData.watch.visible = false; placeK(livia, { x: 0.4, z: z + 0.3, ry: Math.PI, ph: f * 0.4 + 1.2, amt: 1, lean: 0.35 }); livia.scale.setScalar(0.95); holdHands(livia, hero, 1); setFace(hero, 'stern'); setFace(livia, 'worry');
    const op = ss(prog(f, 360, 385)); ENT.userData.vault.rotation.y = -1.5 * op;
    return { cam: C([1.8, 1.3, z + 3.2], [0, 1.4, z - 6], 4), ap: 0.002, shake: 0.6, fx: () => { tint('rgba(255,60,0,A)', 0.12); embers(f, 0.6, 5); } }; } },
  // 8 — you went into the shelter (door slams behind)
  { f0: 392, f1: 445, run(f) { const w = prog(f, 392, 418); const z = lerp(5.2, 2.0, ss(w)); pair(z, { he: 'worry', le: 'worry' }); hero.rotation.y = Math.PI; livia.rotation.y = Math.PI; if (w < 1) { runPose(hero, f * 0.4, 1, 0.3); runPose(livia, f * 0.4 + 1, 1, 0.3); holdHands(livia, hero); }
    const t = ss(prog(f, 418, 432)); vault.rotation.y = Math.PI - 1.7 * (1 - t); sunDisc.material.color.set(t < 0.95 ? '#c98a4a' : '#1c1a22'); sunLight.intensity = 8 * (1 - t); lamp.intensity = 0; bulb.visible = false;
    return { cam: C([BX + 0.5, 1.3, -0.8], [BX, 1.4, 4.5], 4), ap: 0.002, shake: f >= 432 ? 2.4 * (1 - prog(f, 432, 445)) : 0.3, fx: () => { if (f >= 432) { const p = P(BX, 0.3, 5.8); dust(p[0], p[1], prog(f, 432, 450), 1.4); } } }; } },
  // 9 — the lamp flickers on
  { f0: 446, f1: 490, run(f) { pair(2.0, { he: 'happy', le: 'happy', hl: -0.5, ll: 0.5 }); hero.rotation.y = Math.PI * 0.85; livia.rotation.y = -Math.PI * 0.85; const on = f > 452 && !(f > 458 && f < 462); lamp.intensity = on ? 7 : 0; bulb.visible = on;
    const a = lerp(-0.6, 0.6, prog(f, 446, 490)); return { cam: C([BX + Math.sin(a) * 3.5, 2.4, 2.0 + Math.cos(a) * 3.5 - 3.5], [BX, 1.0, -2], 6), ap: 0.0015, fx: () => {} }; } },
  // 10 — the bathroom: a pineapple curtain
  { f0: 491, f1: 559, run(f) { curtainWave(f, 0); pair(1.8, { he: 'happy', le: 'happy', hl: 0.6, ll: 0.6 }); hero.rotation.y = Math.PI / 2 + 0.3; livia.rotation.y = Math.PI / 2 + 0.3; const k = prog(f, 491, 559);
    return { cam: C([BX + 1.8 + k * 0.6, 1.5, 1.2 + k * 0.6], [BX + 3.9, 1.3, 3.2], 2.6 - k * 0.5), ap: 0.004, fx: () => { TAGS('🍍 BANHEIRO?! 🍍', 280, pop(f, 530), 110, '#ffd23f'); } }; } },
  { f0: 560, f1: 590, run(f) { pair(1.8, { he: 'blush', le: 'blush' }); hero.rotation.y = 0.5; livia.rotation.y = -0.5; hero.userData.arms[1].rotation.set(-2.4, 0, -0.3); livia.userData.arms[0].rotation.set(-2.2, 0, 0.4);
    return { cam: C([BX, 1.55, 3.3], [BX, 1.55, 1.8], 1.5), ap: 0.006, fx: () => { titleLine('😳😳', 300, pop(f, 562), 150, '#ffffff'); } }; } },
  // 11 — grandpa's rule
  { f0: 591, f1: 717, run(f) { const [x, y, z] = window.RULE_POS; const k = prog(f, 591, 717); return { cam: C([x - 0.2 + k * 0.1, y, z + 1.9 - k * 0.7], [x, y, z], 1.9 - k * 0.7), ap: 0.006, fx: () => {} }; } },
  // 12 — you open the first can
  { f0: 718, f1: 789, run(f) { pair(1.0, { he: f < 735 ? 'happy' : 'happyc', le: 'happy', hl: 0.3 }); openCan.visible = true; const hp = hand(hero, 1); openCan.position.set(hp.x + 0.05, hp.y + 0.12, hp.z + 0.12); hero.userData.arms[1].rotation.set(-1.2, 0, 0.1); const t = prog(f, 735, 760); openCan.userData.lid.position.set(t * 0.3, 0.115 + Math.sin(t * Math.PI) * 0.4, 0); openCan.userData.lid.rotation.z = t * 6;
    const c = wpos(openCan); return { cam: C([c.x + 0.35, c.y + 0.3, c.z + 0.6], [c.x, c.y, c.z], 0.75), ap: 0.012, shake: f >= 735 && f < 742 ? 0.6 : 0, fx: () => { if (f >= 735) { const p = PV(c); ringFx(p[0], p[1] - 40, prog(f, 735, 752), '255,210,63', 500, 0.6); smoke(p[0], p[1] - 80, f, 4, 0.5, '255,255,255', 0.25); } TAGS('LATA Nº 1', 280, pop(f, 738), 110, '#ffd23f'); } }; } },
  // 13 — "have you ever liked someone from our school?"
  { f0: 790, f1: 871, run(f) { pair(1.0, { he: 'worry', le: 'happy', hl: 0.6 }); hero.userData.head.rotation.y = 0.35; const h = wpos(hero.userData.head);
    return { cam: C([h.x - 0.35, h.y + 0.05, h.z + 1.2 - prog(f, 790, 871) * 0.2], [h.x, h.y - 0.05, h.z], 1.2), ap: 0.009, fx: () => { bubble(W / 2, 330, 'VOCÊ JÁ GOSTOU DE\nALGUÉM DA NOSSA\nESCOLA?', pop(f, 794), { fs: 54, tx: -60 }); } }; } },
  // 14 — she looks straight at you... and smiles
  { f0: 872, f1: 958, run(f) { pair(1.0, { he: 'worry', le: f < 917 ? 'smug' : 'happyc', ll: -0.8 }); livia.userData.head.rotation.set(0, -0.5, 0); const h = wpos(livia.userData.head); lamp.intensity = 7; renderer.toneMappingExposure = 1.35;
    return { cam: C([h.x - 0.75, h.y + 0.02, h.z + 0.85], [h.x, h.y - 0.02, h.z], 1.1), ap: 0.01, fx: () => { if (f >= 917) { const p = PV(h); for (let i = 0; i < 6; i++) { const t = ((f * 0.02 + i / 6) % 1); glow(p[0] + Math.sin(i * 2 + f * 0.05) * 300, p[1] - 150 - t * 600, 60, '255,95,162', Math.sin(t * Math.PI) * 0.7); } } } }; } },
  // 15 — after 30 days: a routine
  { f0: 959, f1: 1054, run(f) { pair(-1.5, { he: 'happy', le: 'happy', hx: BX + 3.2, lx: BX + 3.6, hry: -Math.PI / 2, lry: -Math.PI / 2 }); const k = prog(f, 959, 1054);
    return { cam: C([BX + 2.0 - k * 0.4, 1.7, -0.2 - k * 0.8], [BX + 4.95, 1.8, -2.5], 3.2), ap: 0.003, fx: () => { TAGS('DIA 30', 270, pop(f, 975), 150, '#ffd23f'); } }; } },
  // 16 — sharing the food
  { f0: 1055, f1: 1086, run(f) { const [h, l] = pair(-0.4, { he: 'happyc', le: 'happy', hx: BX - 0.25, lx: BX + 1.05, hry: Math.PI / 2, lry: -Math.PI / 2, hl: 0.5, ll: -0.5 }); [h, l].forEach((k) => { k.userData.body.position.y = -0.43; for (const lg of k.userData.legs) lg.rotation.x = -1.4; }); h.userData.arms[1].rotation.set(-1.3, 0, 0); openCan.visible = true; openCan.position.set(BX + 0.4, 0.72, -0.4);
    return { cam: C([BX + 0.4, 1.3, 1.3], [BX + 0.4, 0.9, -0.4], 1.8), ap: 0.005, fx: () => {} }; } },
  // 17 — laughing on the floor
  { f0: 1087, f1: 1107, run(f) { const [h, l] = pair(1.6, { he: 'happyc', le: 'happyc', hx: BX - 1.6, lx: BX - 0.8 }); for (const k of [h, l]) { k.rotation.set(-Math.PI / 2, 0, 0); k.position.y = 0.3; k.userData.body.rotation.z = Math.sin(f * 0.8) * 0.06; }
    return { cam: C([BX - 1.2, 3.2, 2.6], [BX - 1.2, 0.2, 0.6], 3.2), ap: 0.003, fx: () => {} }; } },
  // 18 — listening to music, one earbud each
  { f0: 1108, f1: 1150, run(f) { const [h, l] = pair(1.0, { he: 'happyc', le: 'happyc' }); h.userData.head.rotation.z = 0.12 + Math.sin(f * 0.25) * 0.06; l.userData.head.rotation.z = -0.12 - Math.sin(f * 0.25) * 0.06;
    return { cam: C([BX, 1.6, 2.6], [BX, 1.6, 1.0], 1.6), ap: 0.006, fx: () => { const a = PW(h.userData.head, 0), b = PW(l.userData.head, 0); O.strokeStyle = '#ffffff'; O.lineWidth = 5; O.beginPath(); O.moveTo(a[0] + 110, a[1] + 10); O.quadraticCurveTo((a[0] + b[0]) / 2, a[1] + 420, b[0] - 110, b[1] + 10); O.stroke(); for (let i = 0; i < 4; i++) { const t = ((f * 0.025 + i / 4) % 1); O.globalAlpha = Math.sin(t * Math.PI); O.fillStyle = '#ffd23f'; O.font = '900 80px Arial'; O.fillText(i % 2 ? '♪' : '♫', W / 2 - 200 + i * 120, a[1] - 200 - t * 300); O.globalAlpha = 1; } } }; } },
  // 19 — looking at each other in silence
  { f0: 1151, f1: 1176, run(f) { const [h, l] = pair(1.0, { he: 'blush', le: 'blush', hl: 0.8, ll: -0.8 }); h.rotation.y = 0.6; l.rotation.y = -0.6; lamp.intensity = 5;
    return { cam: C([BX, 1.62, 2.1 - prog(f, 1151, 1176) * 0.2], [BX, 1.62, 1.0], 1.1), ap: 0.009, fx: () => {} }; } },
  // 20 — day 99: you were going to confess... she asked first
  { f0: 1177, f1: 1333, run(f) { const [h, l] = pair(1.0, { he: f < 1260 ? 'worry' : 'shock', le: f < 1278 ? 'blush' : 'stern', hl: 0.8, ll: -0.8 }); h.rotation.y = 0.75; l.rotation.y = -0.75; lamp.intensity = 3.5; lamp.color.set('#ff9a5c'); hemi.intensity = 0.35;
    const k = prog(f, 1177, 1333); return { cam: C([BX + 0.15, 1.65, 2.6 - k * 0.9], [BX, 1.62, 1.0], 1.6 - k * 0.6), ap: 0.008, shake: f > 1290 ? 0.2 : 0, fx: () => { TAGS('DIA 99', 270, pop(f, 1187) * (1 - prog(f, 1240, 1250)), 160, '#ff5fa2'); tint('rgba(30,0,40,A)', 0.15); } }; } },
  // 21 — "if we leave tomorrow... will you still want to be with me?"
  { f0: 1334, f1: 1477, run(f) { const [h, l] = pair(1.0, { he: f < 1440 ? 'worry' : 'shock', le: 'blush', hl: 0.8, ll: -0.8 }); h.rotation.y = 0.75; l.rotation.y = -0.75; lamp.intensity = 3.5; lamp.color.set('#ff9a5c'); hemi.intensity = 0.35;
    const tgt = f < 1440 ? livia : hero; const hh = wpos(tgt.userData.head); const side = tgt === livia ? -1 : 1; const beat = f >= 1440 ? 1 + Math.abs(Math.sin(f * 0.25)) * 0.05 : 1;
    return { cam: C([hh.x + side * 0.55 / beat, hh.y + 0.02, hh.z + 0.85 / beat], [hh.x, hh.y, hh.z], 1.0), ap: 0.011, fx: () => { if (f < 1440) bubble(W / 2, 330, 'SE A GENTE SAIR DAQUI\nAMANHÃ... VOCÊ AINDA VAI\nQUERER FICAR COMIGO?', pop(f, 1336), { fs: 46, bg: '#ffe0ef', heart: true }); else { TAGS('. . .', 300, pop(f, 1446), 150, '#ffffff'); tint('rgba(255,95,162,A)', 0.08 * Math.abs(Math.sin(f * 0.25))); } } }; } },
  // 22 — the door opens: sunlight pours in
  { f0: 1478, f1: 1590, run(f) { const [h, l] = pair(3.6, { he: 'shock', le: 'shock' }); h.rotation.y = 0; l.rotation.y = 0; const t = ss(prog(f, 1480, 1570)); vault.rotation.y = Math.PI - 1.6 * t; vault.userData.wheel.rotation.z = -t * 5; sunDisc.material.color.set(t > 0.02 ? '#c9a878' : '#1c1a22'); sunLight.intensity = 12 * t; lamp.intensity = 2; renderer.toneMappingExposure = 1.25 + t * 0.1;
    return { cam: C([BX + 0.3, 1.0, 0.6 + prog(f, 1478, 1590) * 0.8], [BX, 1.7, 5.9], 4.5), bloom: 0.2, ap: 0.002, fx: () => { const p = P(BX, 1.55, 5.95); glow(p[0], p[1], 300 + 700 * t, '255,240,200', 0.35 * t); for (let i = 0; i < 30; i++) { const r = rng(i); const x = p[0] + (r() - 0.5) * 900, y = p[1] + (r() - 0.5) * 1100 + Math.sin(f * 0.03 + i) * 40; glow(x, y, 6, '255,255,230', 0.8 * t); } } }; } },
  // 23 — two options... (golden light, almost holding hands)
  { f0: 1591, f1: 1705, run(f) { const [h, l] = pair(4.2, { he: 'blush', le: 'happy', hl: 0.8, ll: -0.8 }); h.rotation.y = 0.7; l.rotation.y = -0.7; holdHands(h, l, 0.7 + 0.3 * ss(prog(f, 1650, 1690))); vault.rotation.y = Math.PI - 1.6; sunDisc.material.color.set('#c9a878'); sunLight.intensity = 12; lamp.intensity = 2.5; renderer.toneMappingExposure = 1.35;
    const a = lerp(-0.5, 0.5, prog(f, 1591, 1705)); return { cam: C([BX + Math.sin(a) * 1.3, 1.55, 5.45], [BX, 1.5, 4.2], 1.4), bloom: 0.25, ap: 0.005, fx: () => { const p = P(BX, 1.55, 5.95); glow(p[0], p[1], 900, '255,230,180', 0.2); } }; } },
  // 24 — final question
  { f0: 1706, f1: TOTAL - 1, run(f) { const [h, l] = pair(4.2, { he: 'blush', le: 'blush', hl: 0.8, ll: -0.8 }); h.rotation.y = 0.75; l.rotation.y = -0.75; holdHands(h, l, 1); vault.rotation.y = Math.PI - 1.6; sunDisc.material.color.set('#c9a878'); sunLight.intensity = 12; lamp.intensity = 2.5; renderer.toneMappingExposure = 1.35;
    const k = prog(f, 1706, 1829); return { cam: C([BX + Math.sin(T(f) * 0.4) * 0.3, 1.1 + k * 0.15, 5.5], [BX, 1.65, 4.2], 1.4), bloom: 0.25, ap: 0.003, fx: () => { const p = P(BX, 1.55, 5.95); glow(p[0], p[1], 900, '255,230,180', 0.2); O.save(); O.fillStyle = 'rgba(30,0,30,.35)'; O.fillRect(0, 0, W, 760 * Math.min(1, pop(f, 1708))); O.restore();
      TAGS('VOCÊ BEIJARIA', 220, pop(f, 1712), 104, '#ffffff'); TAGS('SEU CRUSH? 💋', 370, pop(f, 1730), 120, '#ff5fa2');
      const kk = pop(f, 1765); if (kk > 0.01) for (const [x, txt, col] of [[W / 2 - 230, 'SIM ❤', '#ff5fa2'], [W / 2 + 230, 'NÃO 💔', '#3a86ff']]) { O.save(); O.translate(x, 580); O.scale(kk * (1 + Math.sin(f * 0.25) * 0.03), kk); O.fillStyle = col; O.strokeStyle = '#1c1222'; O.lineWidth = 10; O.beginPath(); O.roundRect(-190, -75, 380, 150, 40); O.fill(); O.stroke(); O.fillStyle = '#ffffff'; O.font = '900 76px Inter, Arial Black'; O.textAlign = 'center'; O.textBaseline = 'middle'; O.fillText(txt, 0, 4); O.restore(); }
      if (f > 1780) titleLine('COMENTA 👇', 720, pop(f, 1782), 70, '#ffd23f'); } }; } },
];

function renderFrame(f) {
  reset();
  const sh = SHOTS.find((s) => f >= s.f0 && f <= s.f1) || SHOTS[SHOTS.length - 1];
  const R = sh.run(f);
  const DR = [[560, 590], [718, 789], [872, 958], [1055, 1086], [1334, 1477]].some(([a, b]) => f >= a && f <= b);
  if (DR) { R.cam.p = [R.cam.p[0] + Math.sin(f * 0.09) * 0.06 * R.cam.d, R.cam.p[1] + Math.cos(f * 0.07) * 0.03 * R.cam.d, R.cam.p[2] - Math.sin(f * 0.05) * 0.04 * R.cam.d]; for (const k of [hero, livia]) if (k.visible) { k.userData.head.rotation.z += Math.sin(f * 0.12 + (k === hero ? 0 : 2)) * 0.05; k.userData.head.rotation.x += Math.sin(f * 0.08) * 0.03; } }
  let [px, py, pz] = R.cam.p; const sk = (R.shake || 0) * 0.03 * Math.max(1, R.cam.d / 6) ** 0.5; const r = rng(f * 7 + 1);
  px += (r() - 0.5) * sk; py += (r() - 0.5) * sk; pz += (r() - 0.5) * sk * 0.5;
  camera.position.set(px, py, pz); camera.lookAt(...R.cam.l); camera.rotation.z += (r() - 0.5) * sk * 0.15;
  key.position.set(px + 6, 18, pz + 4); key.target.position.set(R.cam.l[0], 0, R.cam.l[2]); key.target.updateMatrixWorld();
  fill.position.set(px + 0.8, py + 1.5, pz + 0.5);
  bloom.strength = R.bloom ?? 0.5; bokeh.uniforms.focus.value = R.cam.d; bokeh.uniforms.aperture.value = R.ap ?? 0.0025;
  composer.render();
  O.globalCompositeOperation = 'source-over'; O.globalAlpha = 1;
  O.drawImage(renderer.domElement, 0, 0);
  R.fx();
  const v = O.createRadialGradient(W / 2, H * 0.45, W * 0.42, W / 2, H / 2, H * 0.72); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(10,0,20,.5)'); O.fillStyle = v; O.fillRect(0, 0, W, H);
  return out.toDataURL('image/jpeg', 0.9);
}
window.renderFrame = renderFrame; window.ready = true;
