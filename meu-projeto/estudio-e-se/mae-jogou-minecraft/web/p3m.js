
// ---------- shots (t in seconds; frames at 30 fps)
const C = (p, l, d) => ({ p, l, d });
const G = (x, y, z) => [GX + x, y, z];
const MX = RX + 0.55, SXp = RX - 0.55, SZ = -0.12;
const TAG = (txt, y, k, size = 120, col = '#ffffff') => titleLine(txt, y, k, size, col);
const popT = (t, a, d = 0.25) => backOut(clamp((t - a) / d));
function reset() {
  for (const o of BASE) o.visible = false;
  for (const o of [ROOM, GAME, TV, CLOCK, mom, momG, son, PAD, MON, GEM, TUB, moonDisc, sunDiscG, DECOR, doormat]) o.visible = false;
  son.userData.watch.visible = false; mom.userData.phones.visible = true;
  for (const k of [mom, momG, son]) { k.userData.body.rotation.set(0, 0, 0); k.userData.body.position.set(0, 0, 0); k.userData.head.rotation.set(0, 0, 0); }
  tvLight.intensity = 0; roomLamp.intensity = 0; gameSun.intensity = 0; moonLight.intensity = 0; key.intensity = 0; fill.intensity = 0; heroLight.intensity = 0; portalLight.intensity = 0;
  hemi.intensity = 1.0; renderer.toneMappingExposure = 1.2; scene.fog.near = 40; scene.fog.far = 200;
}
function room(f, night = false) {
  ROOM.visible = TV.visible = CLOCK.visible = true; tvLight.color.set(night ? '#cfe9ff' : '#7fd0ff'); scene.background = new THREE.Color(night ? '#120c22' : '#2a1d2e');
  hemi.color.set(night ? '#d8c8f0' : '#ffe2c4'); hemi.groundColor.set('#3a2533'); hemi.intensity = night ? 0.7 : 0.9;
  roomLamp.intensity = night ? 2.8 : 6; tvLight.intensity = (night ? 4.5 : 4) * (0.85 + 0.15 * Math.sin(f * 0.37) * Math.sin(f * 0.13));
  key.intensity = night ? 0.15 : 0.8; key.color.set(night ? '#8fa0ff' : '#ffe9cf'); fill.intensity = night ? 0.6 : 1.2; fill.color.set(night ? '#ffd9c2' : '#ffd6a8');
  drawTV(night ? 'night' : 'day', f); setClock(night ? 0 : 7, night ? 0 : 40);
}
function sofa(o = {}) {
  sit(son, SXp, SZ); sit(mom, MX, SZ); setFace(son, o.se || 'happy', o.sl || 0); setFace(mom, o.me || 'happy', o.ml || 0);
  son.userData.arms[0].rotation.set(-0.9, 0, -0.4); son.userData.arms[1].rotation.set(-0.9, 0, 0.4);
  if (o.pad !== false) holdPad(mom, o.up ?? 1, o.tilt || 0);
}
function game(f, night = false) {
  GAME.visible = true; scene.background = night ? GSKY_N : GSKY; scene.fog.color.set(night ? '#1a1f5c' : '#bfe9ff'); scene.fog.near = 25; scene.fog.far = 70;
  hemi.color.set(night ? '#5a63c9' : '#ffffff'); hemi.groundColor.set(night ? '#1a1033' : '#7bd389'); hemi.intensity = night ? 0.45 : 1.35;
  gameSun.intensity = night ? 0 : 2.4; gameSun.position.set(GX + 10, 22, 12); gameSun.target.position.set(GX, 0, -4); gameSun.target.updateMatrixWorld();
  moonLight.intensity = night ? 40 : 0; moonLight.position.set(GX + 6, 12, 6);
  clouds.forEach((c, i) => (c.position.x = -22 + ((i * 6 + f * 0.03) % 46)));
  setHouse(1); DECOR.visible = true; doormat.visible = true;
}
function gWho(k, x, z, ry, o = {}) { const y = o.y ?? 0; show(k, GX + x, y, z, ry); k.scale.setScalar(o.sc || 1); setFace(k, o.e || 'happy'); return k; }
function bub(t, a, txt, o = {}) { bubble(W / 2 + (o.x || 0), o.y || 430, txt, popT(t, a), Object.assign({ fs: 54 }, o)); }
function headCam(k, side, dist, dy = 0) { const h = wpos(k.userData.head); return [h, [h.x + side, h.y + dy, h.z + dist]]; }

const SH = [
  // 1 — hook: extreme close of MÃE, headset on, TV glow on the face
  { a: 0, b: 1.4, run(t, f) { room(f); sofa({ me: 'stern' }); mom.userData.head.rotation.set(0.05, 0, Math.sin(t * 6) * 0.04); const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x + 0.1, h.y + 0.02, h.z + 1.75 - t * 0.2], [h.x, h.y - 0.12, h.z], 1.7), ap: 0.012, fx: () => { glow(W / 2, H * 0.55, 700, '127,208,255', 0.18); TAG('MINHA MÃE', 300, popT(t, 0.05), 140, '#ffd23f'); TAG('🎮 1ª VEZ 🎮', 460, popT(t, 0.55), 92, '#ffffff'); } }; } },
  // 2 — sofa two-shot, TV in foreground
  { a: 1.4, b: 2.8, run(t, f) { room(f); sofa({ me: 'stern', se: 'happy', sl: 0.6 }); const k = prog(t, 1.4, 2.8);
    return { cam: C([RX - 0.3 + k * 0.5, 1.55, 3.5 - k * 0.3], [RX, 1.15, SZ], 3.5), ap: 0.004, fx: () => { TAG('MINECRAFT?', 300, popT(t, 1.5), 130, '#8ce95a'); } }; } },
  // 3 — controller upside down
  { a: 2.8, b: 4.1, run(t, f) { room(f); sofa({ me: 'worry', ml: -0.4, up: -1, tilt: Math.sin(t * 5) * 0.15 }); const p = PAD.position;
    return { cam: C([p.x + 0.35, p.y + 0.35, p.z + 0.65], [p.x, p.y, p.z], 0.8), ap: 0.012, fx: () => { bub(t, 2.85, 'FILHO, CADÊ O BOTÃO\nDE LIGAR A PESSOA?', { fs: 50, tx: 60 }); TAG('DE CABEÇA PRA BAIXO 🙃', 1180, popT(t, 3.4), 64, '#ffd23f'); } }; } },
  // 4 — the son's flat face
  { a: 4.1, b: 5.28, run(t, f) { room(f); sofa({ se: 'flat', sl: 0.9, me: 'worry' }); son.userData.head.rotation.y = 0.5; const [h] = headCam(son, 0, 0);
    return { cam: C([h.x - 0.35, h.y, h.z + 1.55 - prog(t, 4.1, 5.28) * 0.2], [h.x, h.y - 0.1, h.z], 1.5), ap: 0.012, fx: () => { TAG('😐', 330, popT(t, 4.3), 170, '#fff'); } }; } },
  // 5 — game: staring at the sky, camera spinning upward
  { a: 5.28, b: 6.6, run(t, f) { game(f); sunDiscG.visible = true; sunDiscG.position.set(GX + 30, 40, -60); const a = t * 1.2;
    return { cam: C([GX + 8, 1.7, 6], [GX + 8 + Math.sin(a) * 10, 3.8 + Math.sin(t * 3) * 1.2, 6 - Math.cos(a) * 10], 20), ap: 0.001, fx: () => { hud(f, { label: 'OLHANDO PRO CÉU' }); TAG('5 MINUTOS... ☁️', 330, popT(t, 5.35), 104, '#ffffff'); } }; } },
  // 6 — real mom tilting her head way back, following the sky
  { a: 6.6, b: 7.98, run(t, f) { room(f); sofa({ me: 'shock', ml: 0 }); mom.userData.head.rotation.x = -0.35 - Math.sin(t * 2) * 0.1; mom.userData.body.rotation.x = -0.12; mom.userData.head.rotation.z = Math.sin(t * 4) * 0.12;
    const [h] = headCam(mom, 0, 0); return { cam: C([h.x + 0.9, h.y - 0.2, h.z + 1.6], [h.x, h.y - 0.05, h.z], 1.8), ap: 0.008, fx: () => {} }; } },
  // 7 — game: she punches a tree
  { a: 7.98, b: 9.3, run(t, f) { game(f); const tp = punchTree.position; gWho(momG, tp.x + 1.25, tp.z + 0.2, -Math.PI / 2, { y: tp.y, e: 'stern' }); const ph = Math.sin(t * 22);
    momG.userData.arms[1].rotation.set(-1.4 - ph * 0.25, 0, 0.1); momG.userData.arms[0].rotation.set(-0.6, 0, -0.3);
    const hit = ph > 0.85; return { cam: C(G(tp.x + 1.4, tp.y + 1.9, tp.z + 4.4), G(tp.x + 0.6, tp.y + 1.4, tp.z), 4.5), ap: 0.002, shake: hit ? 1.0 : 0.2, fx: () => { hud(f, { slot: 3 }); const p = P(GX + tp.x + 0.45, tp.y + 1.3, tp.z + 0.2); if (hit) ringFx(p[0], p[1], 0.4, '255,255,255', 260); for (let i = 0; i < 6; i++) { const r = rng(i + Math.floor(t * 8)); glow(p[0] + (r() - 0.5) * 200, p[1] + (r() - 0.5) * 200, 18, '255,158,199', 0.8); } TAG('SOCO 👊', 300, popT(t, 8.1), 120, '#ffd23f'); } }; } },
  // 8 — real mom: hands to the mouth, guilty
  { a: 9.3, b: 10.49, run(t, f) { room(f); sofa({ me: 'worry', pad: false }); for (const [i, s] of [[0, -1], [1, 1]]) mom.userData.arms[i].rotation.set(-2.3, 0, s * 0.45); PAD.visible = false; const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x - 0.3, h.y - 0.05, h.z + 1.75], [h.x, h.y - 0.22, h.z], 1.8), ap: 0.01, shake: 0.3, fx: () => { sweat(W / 2, H * 0.4, 2, f); } }; } },
  // 9 — "Ai, desculpa, árvore!"
  { a: 10.49, b: 12.1, run(t, f) { room(f); sofa({ me: 'sad', ml: 0.3 }); mom.userData.head.rotation.z = 0.15; const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x + 0.3, h.y + 0.05, h.z + 1.75 - prog(t, 10.49, 12.1) * 0.3], [h.x, h.y - 0.15, h.z], 1.6), ap: 0.012, fx: () => { bub(t, 10.55, 'AI, DESCULPA, ÁRVORE!\nNÃO FOI POR MAL!', { fs: 54, bg: '#ffe0ef', heart: true, tx: -50 }); } }; } },
  // 10 — game: she bows to the tree
  { a: 12.1, b: 13.82, run(t, f) { game(f); const tp = punchTree.position; gWho(momG, tp.x + 1.25, tp.z + 0.2, -Math.PI / 2, { y: tp.y, e: 'happyc' }); momG.userData.body.rotation.x = 0.55 * Math.abs(Math.sin(t * 3)); momG.userData.arms[0].rotation.set(-0.3, 0, -0.1); momG.userData.arms[1].rotation.set(-0.3, 0, 0.1);
    const a = -0.15 + prog(t, 12.1, 13.82) * 0.5; return { cam: C(G(tp.x + 0.6 + Math.sin(a) * 4.5, tp.y + 1.8, tp.z + Math.cos(a) * 4.5), G(tp.x + 0.6, tp.y + 1.4, tp.z), 4.5), ap: 0.002, fx: () => { hud(f); TAG('🙏 PERDÃO 🙏', 300, popT(t, 12.2), 120, '#ff9ec7'); const p = P(GX + tp.x, tp.y + 3, tp.z); for (let i = 0; i < 4; i++) { const u = ((t * 0.7 + i / 4) % 1); O.fillStyle = '#ff2d55'; O.globalAlpha = Math.sin(u * Math.PI); heart2(p[0] + Math.sin(i * 2) * 140, p[1] - u * 260, 26); O.globalAlpha = 1; } } }; } },
  // 11 — game: the house builds itself block by block (orbit)
  { a: 13.82, b: 15.6, run(t, f) { game(f); const k = prog(t, 13.82, 15.4); setHouse(k); gWho(momG, 3.6, HZ0 + 2.5, -0.8, { e: 'happyc' }); momG.userData.arms[1].rotation.set(-1.6 + Math.sin(t * 20) * 0.3, 0, 0.1); const a = -0.5 + k * 1.1;
    return { cam: C(G(Math.sin(a) * 11, 6.5, HZ0 + Math.cos(a) * 11), G(0, 2, HZ0), 11), ap: 0.0008, fx: () => { hud(f, { slot: 0 }); TAG('10 MINUTOS 🏠', 300, popT(t, 13.9), 116, '#ffd23f'); } }; } },
  // 12 — interior (roof off): the rug
  { a: 15.6, b: 17.0, run(t, f) { game(f); setHouse(1, 0); gWho(momG, 0.6, HZ0 + 0.4, Math.PI * 0.85, { e: 'happyc' }); const k = prog(t, 15.6, 17.0);
    return { cam: C(G(0.3 + k * 0.3, 7.2 - k * 0.6, HZ0 + 1.6), G(0, 0.2, HZ0 - 0.4), 6.6), ap: 0.002, fx: () => { hud(f, { slot: 1 }); TAG('TAPETE ✅', 300, popT(t, 15.65), 120, '#ff8fab'); } }; } },
  // 13 — interior: curtains + guest room sign
  { a: 17.0, b: 18.683, run(t, f) { game(f); setHouse(1, 0); gWho(momG, 0.5, HZ0 + 0.5, -Math.PI / 2 - 0.4, { e: 'happyc' }); momG.userData.arms[1].rotation.set(-1.5, 0, 0.3); const k = prog(t, 17.0, 18.683);
    return { cam: C(G(1.0, 5.6 - k * 0.5, HZ0 + 0.8), G(-1.2, 1.4, HZ0 - 0.4), 4.6), ap: 0.003, fx: () => { hud(f, { slot: 2 }); TAG('CORTINA ✅', 280, popT(t, 17.05), 104, '#c77dff'); TAG('QUARTO DE VISITA ✅', 420, popT(t, 17.7), 86, '#ffd23f'); } }; } },
  // 14 — time-lapse: day to night
  { a: 18.683, b: 20.3, run(t, f) { const k = prog(t, 18.683, 20.1); game(f, k > 0.55); const a = k * Math.PI; sunDiscG.visible = k < 0.6; sunDiscG.position.set(GX - 40 + Math.cos(a) * -1 * 0 + k * 80, 30 * Math.sin((1 - k) * Math.PI / 2) + 2, -60); moonDisc.visible = k > 0.4; moonDisc.position.set(GX - 30 + k * 30, 6 + k * 22, -60);
    if (k <= 0.55) { hemi.intensity = lerp(1.35, 0.6, k / 0.55); gameSun.intensity = lerp(2.4, 0.3, k / 0.55); gameSun.color.set('#ff9a5c'); } scene.fog.color.lerpColors(new THREE.Color('#ffb38a'), new THREE.Color('#1a1f5c'), k);
    return { cam: C(G(6, 3.5, HZ0 + 9), G(0, 6, HZ0 - 20), 30), ap: 0.0005, fx: () => { hud(f, { label: 'ANOITECEU 🌙' }); tint('rgba(255,120,60,A)', Math.max(0, 0.25 - k * 0.4)); TAG('🌙 NOITE', 300, popT(t, 19.4), 120, '#ffffff'); } }; } },
  // 15 — night: the first monster walks toward the house
  { a: 20.3, b: 22.154, run(t, f) { game(f, true); moonDisc.visible = true; moonDisc.position.set(GX + 8, 18, -30); const k = prog(t, 20.3, 22.154); MON.visible = true; MON.position.set(GX + 0.3, Math.abs(Math.sin(t * 9)) * 0.15, lerp(9, 1.2, k)); MON.rotation.set(0, Math.PI, Math.sin(t * 9) * 0.08); MON.userData.pupil.position.x = Math.sin(t * 3) * 0.08;
    return { cam: C(G(-2.6, 1.0, 0.5), G(0.3, 1.2, 4), 5), ap: 0.002, shake: 0.5, fx: () => { hud(f, { hearts: 10, label: 'PERIGO!' }); tint('rgba(120,0,60,A)', 0.12 + 0.08 * Math.sin(t * 8)); TAG('O 1º MONSTRO 👾', 300, popT(t, 20.4), 104, '#c77dff'); } }; } },
  // 16 — real mom, stern, finger pointing at the TV
  { a: 22.154, b: 23.8, run(t, f) { room(f, true); sofa({ me: 'stern', pad: false }); mom.userData.body.rotation.x = 0.15; mom.userData.arms[1].rotation.set(-1.75 - Math.sin(t * 9) * 0.1, 0, 0.15); mom.userData.arms[0].rotation.set(-1.0, 0, -0.5); PAD.visible = false; const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x + 0.5, h.y + 0.05, h.z + 1.9], [h.x + 0.05, h.y - 0.3, h.z], 1.9), ap: 0.009, shake: 0.4, fx: () => { bub(t, 22.2, 'Ô MOÇO! LIMPA O PÉ\nANTES DE ENTRAR\nNA MINHA CASA!', { fs: 50, tx: 60 }); } }; } },
  // 17 — game: her avatar at the door pointing; the monster freezes
  { a: 23.8, b: 25.519, run(t, f) { game(f, true); moonDisc.visible = true; moonDisc.position.set(GX - 10, 18, 20); gWho(momG, 0, HZ0 + 2.4, 0, { e: 'stern' }); momG.userData.arms[1].rotation.set(-1.7, 0, 0.1); MON.visible = true; MON.position.set(GX, 0, HZ0 + 4.0); MON.rotation.set(0, Math.PI, 0); MON.userData.pupil.position.set(0, 0, 0); MON.scale.setScalar(1 - 0.08 * ss(prog(t, 24.2, 24.6)));
    return { cam: C(G(4.6, 1.7, HZ0 + 3.4), G(0, 1.2, HZ0 + 3.2), 4.6), ap: 0.003, fx: () => { hud(f); const p = PV(wpos(MON)); TAG('!', p[1] - 380, popT(t, 24.1), 200, '#ffd23f'); } }; } },
  // 18 — and the monster... wiped its feet
  { a: 25.519, b: 27.257, run(t, f) { game(f, true); moonDisc.visible = true; moonDisc.position.set(GX - 10, 18, 20); gWho(momG, 0, HZ0 + 2.3, 0, { e: 'smug' }); momG.userData.arms[0].rotation.set(-0.2, 0, -0.9); momG.userData.arms[1].rotation.set(-0.2, 0, 0.9); MON.visible = true; MON.position.set(GX, 0, HZ0 + 3.6); MON.rotation.set(0, Math.PI, Math.sin(t * 10) * 0.07); MON.scale.setScalar(1);
    MON.userData.feet.forEach((ft, i) => (ft.position.z = 0.1 + Math.sin(t * 14 + i * Math.PI) * 0.22));
    return { cam: C(G(3.6, 1.2, HZ0 + 4.4), G(0, 0.7, HZ0 + 3.3), 3.7), ap: 0.003, fx: () => { hud(f); TAG('LIMPOU O PÉ 🧼', 300, popT(t, 25.9), 104, '#9be7ff'); TAG('FUNCIONOU?!', 450, popT(t, 26.5), 120, '#ffd23f'); } }; } },
  // 19 — the son's face lights up (TV glow)
  { a: 27.257, b: 28.4, run(t, f) { room(f, true); sofa({ se: 'happyc', me: 'happy' }); son.userData.head.rotation.y = 0.1; holdPad(son); const [h] = headCam(son, 0, 0); tvLight.color.set('#9fe8ff'); tvLight.intensity *= 0.6;
    return { cam: C([h.x + 0.25, h.y + 0.03, h.z + 1.45], [h.x, h.y - 0.1, h.z], 1.45), ap: 0.012, fx: () => { glow(W / 2, H * 0.5, 800, '94,242,255', 0.07); } }; } },
  // 20 — game: the diamond, huge and spinning
  { a: 28.4, b: 29.544, run(t, f) { game(f, true); GEM.visible = true; GEM.position.set(GX, 1.6 + Math.sin(t * 4) * 0.1, 4); GEM.rotation.y = t * 3;
    return { cam: C(G(0, 1.8, 6.4 - prog(t, 28.4, 29.544) * 0.6), G(0, 1.6, 4), 2.2), ap: 0.006, bloom: 0.9, fx: () => { hud(f, { items: ['#5ef2ff', '#e63946', '#9be7ff', '#b5835a'] }); const p = PV(GEM.position); for (let i = 0; i < 7; i++) sparkle(p[0] + Math.cos(i * 0.9 + t * 2) * 320, p[1] + Math.sin(i * 1.3 + t * 2) * 380, 30 + 16 * Math.sin(t * 6 + i), f); TAG('DIAMANTE 💎', 300, popT(t, 28.45), 120, '#5ef2ff'); } }; } },
  // 21 — mom: "guarda no pote de sorvete"
  { a: 29.544, b: 30.8, run(t, f) { room(f, true); sofa({ me: 'smug', ml: -0.5 }); mom.userData.head.rotation.y = -0.35; const [h] = headCam(mom, 0, 0); tvLight.color.set('#7fd0ff');
    return { cam: C([h.x - 0.25, h.y + 0.05, h.z + 1.7], [h.x, h.y - 0.15, h.z], 1.7), ap: 0.012, fx: () => { bub(t, 29.6, 'GUARDA NO POTE DE\nSORVETE, QUE É\nMAIS SEGURO.', { fs: 52 }); } }; } },
  // 22 — game: ice-cream tub opens, the diamond drops in
  { a: 30.8, b: 32.079, run(t, f) { game(f, true); TUB.visible = true; TUB.position.set(GX + 3.5, 0, HZ0 + 3.5); TUB.rotation.y = 0.95 + Math.PI; const op = ss(prog(t, 30.85, 31.2)) * (1 - ss(prog(t, 31.75, 31.95))); TUB.userData.lid.rotation.z = op * 1.9; GEM.visible = t < 31.75; GEM.scale.set(0.35, 0.47, 0.35); GEM.position.set(GX + 3.5, 2.4 - ss(prog(t, 31.15, 31.7)) * 1.8, HZ0 + 3.5); GEM.rotation.y = t * 5;
    return { cam: C(G(6.2, 2.6, HZ0 + 7.5), G(3.5, 1.2, HZ0 + 3.5), 4.9), ap: 0.003, shake: t > 31.95 && t < 32.05 ? 1.2 : 0, fx: () => { hud(f, { slot: 4 }); TAG('POTE DE SORVETE 🍦', 300, popT(t, 30.9), 92, '#ffffff'); if (t > 31.95) TAG('🔒 SEGURO', 440, popT(t, 31.95), 96, '#ffd23f'); } }; } },
  // 23 — the wall clock hits midnight
  { a: 32.079, b: 33.1, run(t, f) { room(f, true); sofa({ me: 'happyc' }); setClock(23, 59 + ss(prog(t, 32.2, 32.5))); const c = CLOCK.position;
    return { cam: C([c.x + 0.1, c.y - 0.05, c.z + 1.2 - prog(t, 32.079, 33.1) * 0.25], [c.x, c.y, c.z], 1.1), ap: 0.01, fx: () => { TAG('00:00 🕛', 330, popT(t, 32.45), 140, '#ff5fa2'); } }; } },
  // 24 — the son stands up, arms crossed: bedtime
  { a: 33.1, b: 34.059, run(t, f) { room(f, true); sit(mom, MX, SZ); setFace(mom, 'happyc'); holdPad(mom); show(son, RX - 1.35, 0, 0.55, Math.PI / 2 + 0.2); setFace(son, 'stern'); son.userData.arms[0].rotation.set(-1.25, 0, -0.95); son.userData.arms[1].rotation.set(-1.15, 0, 0.95); son.userData.watch.visible = false;
    return { cam: C([RX - 1.0, 1.45, 3.4], [RX - 0.7, 1.0, 0.3], 3.2), ap: 0.004, fx: () => { TAG('HORA DE DORMIR 😤', 300, popT(t, 33.15), 100, '#ffffff'); } }; } },
  // 25 — mom hugs the controller: "só mais cinco minutinhos!"
  { a: 34.059, b: 35.3, run(t, f) { room(f, true); sofa({ me: 'sad' }); mom.userData.arms[0].rotation.set(-1.5, 0, -1.0); mom.userData.arms[1].rotation.set(-1.5, 0, 1.0); const a = hand(mom, 0), b = hand(mom, 1); PAD.position.set((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2 + 0.05); PAD.rotation.set(1.3, 0, 0); mom.userData.head.rotation.z = Math.sin(t * 7) * 0.08; const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x + 0.15, h.y - 0.1, h.z + 1.9], [h.x, h.y - 0.4, h.z], 1.9), ap: 0.01, fx: () => { bub(t, 34.1, 'SÓ MAIS CINCO\nMINUTINHOS, FILHO!', { fs: 56, bg: '#ffe0ef', heart: true }); for (let i = 0; i < 2; i++) { const p = PW(mom.userData.head, 0.02); glow(p[0] + (i ? 70 : -70), p[1] - 10, 30, '255,255,255', 0.8); } } }; } },
  // 26 — the son's shock
  { a: 35.3, b: 36.315, run(t, f) { room(f, true); sit(mom, MX, SZ); holdPad(mom); show(son, RX - 0.3, 0, 0.9, 0.25); setFace(son, 'shock'); son.userData.watch.visible = false; son.userData.arms[0].rotation.set(-0.3, 0, -0.9); son.userData.arms[1].rotation.set(-0.3, 0, 0.9); const [h] = headCam(son, 0, 0);
    const z = 1 + ss(prog(t, 35.3, 35.5)) * 0.35; return { cam: C([h.x + 0.3 / z, h.y, h.z + 1.6 / z], [h.x, h.y - 0.08, h.z], 1.6 / z), ap: 0.012, shake: 0.8, fx: () => { TAG('😱', 330, popT(t, 35.35), 190, '#fff'); } }; } },
  // 27 — tug of war over the controller
  { a: 36.315, b: 37.5, run(t, f) { room(f, true); sit(mom, MX, SZ); setFace(mom, 'stern'); show(son, RX + 0.35, 0, 0.95, Math.PI); setFace(son, 'stern'); son.userData.watch.visible = false; const w = Math.sin(t * 12) * 0.12; son.position.z = 0.95 + w * 0.6;
    son.userData.arms[0].rotation.set(-1.4, 0, 0.25); son.userData.arms[1].rotation.set(-1.4, 0, -0.25); son.userData.body.rotation.x = -0.25; holdPad(mom); PAD.position.z += 0.25 + w * 0.3; PAD.rotation.set(0.2, 0, w);
    return { cam: C([RX + 2.9, 1.7, 2.6], [RX + 0.4, 0.95, 0.3], 3.4), ap: 0.004, shake: 0.6, fx: () => { const p = PV(PAD.position); dust(p[0], p[1] + 120, (t * 2) % 1, 0.6); } }; } },
  // 28 — the twist: 360 around them
  { a: 37.5, b: 38.525, run(t, f) { room(f, true); sofa({ me: 'happyc', se: 'shock' }); son.userData.head.rotation.y = 0.6; const a = -1.0 + prog(t, 37.5, 38.525) * 2.0;
    return { cam: C([RX + Math.sin(a) * 2.6, 1.5, SZ + Math.cos(a) * 2.6 + 0.2], [RX, 1.2, SZ], 2.6), ap: 0.003, fx: () => { tint('rgba(255,95,162,A)', 0.1); TAG('O JOGO', 300, popT(t, 37.55), 170, '#ffd23f'); TAG('VIROU 🔄', 480, popT(t, 37.75), 170, '#ff5fa2'); } }; } },
  // 29 — both playing together + question
  { a: 38.525, b: 99, run(t, f) { room(f, true); sofa({ me: 'happyc', se: 'happyc' }); holdPad(son); const k = prog(t, 38.525, 44);
    return { cam: C([RX + Math.sin(t * 0.5) * 0.3, 1.45 + k * 0.2, 2.6 - k * 0.4], [RX, 1.15, SZ], 2.7), ap: 0.003, fx: () => { const q = popT(t, 38.6); O.save(); O.fillStyle = 'rgba(20,8,30,.42)'; O.fillRect(0, 0, W, 720 * Math.min(1, q)); O.restore();
      TAG('SUA MÃE', 220, popT(t, 38.6), 120, '#ffffff'); TAG('JOGARIA? 🎮', 380, popT(t, 38.85), 130, '#8ce95a');
      const kk = popT(t, 39.6); if (kk > 0.01) for (const [x, txt, col] of [[W / 2 - 230, 'SIM 😂', '#ff5fa2'], [W / 2 + 230, 'NUNCA 🙅', '#3a86ff']]) { O.save(); O.translate(x, 580); O.scale(kk * (1 + Math.sin(t * 7) * 0.03), kk); O.fillStyle = col; O.strokeStyle = '#1c1222'; O.lineWidth = 10; O.beginPath(); O.roundRect(-195, -72, 390, 144, 40); O.fill(); O.stroke(); O.fillStyle = '#fff'; O.font = '900 66px Inter, Arial Black'; O.textAlign = 'center'; O.textBaseline = 'middle'; O.fillText(txt, 0, 4); O.restore(); }
      if (t > 40.2) TAG('COMENTA 👇', 740, popT(t, 40.2), 74, '#ffd23f'); } }; } },
];

function renderFrame(i) {
  const t = i / 30, f = i; reset(); PAD.visible = false;
  const sh = SH.find((s) => t >= s.a && t < s.b) || SH[SH.length - 1];
  const R = sh.run(t, f);
  let [px, py, pz] = R.cam.p; // gentle drift so nothing is ever static
  px += Math.sin(t * 1.3) * 0.015 * R.cam.d; py += Math.cos(t * 1.1) * 0.01 * R.cam.d;
  const sk = (R.shake || 0) * 0.03 * Math.max(1, R.cam.d / 6) ** 0.5; const r = rng(i * 7 + 1);
  px += (r() - 0.5) * sk; py += (r() - 0.5) * sk; pz += (r() - 0.5) * sk * 0.5;
  camera.position.set(px, py, pz); camera.lookAt(...R.cam.l); camera.rotation.z += (r() - 0.5) * sk * 0.15;
  if (ROOM.visible) { key.position.set(RX + 3, 6, 4); key.target.position.set(RX, 0, 0); } else { key.position.set(px + 6, 18, pz + 4); key.target.position.set(R.cam.l[0], 0, R.cam.l[2]); }
  key.target.updateMatrixWorld(); fill.position.set(px + 0.8, py + 1.2, pz + 0.5);
  bloom.strength = R.bloom ?? 0.45; bokeh.uniforms.focus.value = R.cam.d; bokeh.uniforms.aperture.value = R.ap ?? 0.0025;
  composer.render();
  O.globalCompositeOperation = 'source-over'; O.globalAlpha = 1; O.drawImage(renderer.domElement, 0, 0);
  // quick white pop on every cut (frame 0-1 of each shot) keeps the eye moving
  const c0 = (t - sh.a) * 30; if (c0 < 2 && sh.a > 0) flash(0.25 * (1 - c0 / 2));
  R.fx();
  const v = O.createRadialGradient(W / 2, H * 0.45, W * 0.45, W / 2, H / 2, H * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(10,0,20,.42)'); O.fillStyle = v; O.fillRect(0, 0, W, H);
  return out.toDataURL('image/jpeg', 0.9);
}
window.renderFrame = renderFrame; window.ready = true;
