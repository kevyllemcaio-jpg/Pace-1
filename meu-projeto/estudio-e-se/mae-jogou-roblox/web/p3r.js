
// ---------- shots (t in seconds; frames at 30 fps)
const C = (p, l, d) => ({ p, l, d });
const G = (x, y, z) => [GX + x, y, z];
const MX = RX + 0.55, SXp = RX - 0.55, SZ = -0.12;
const TAG = (txt, y, k, size = 120, col = '#ffffff') => titleLine(txt, y, k, size, col);
const popT = (t, a, d = 0.25) => backOut(clamp((t - a) / d));
function reset() {
  for (const o of BASE) o.visible = false;
  for (const o of [ROOM, GAME, TV, CLOCK, mom, momG, son, PAD, MON, GEM, TUB, moonDisc, sunDiscG, DECOR, doormat, STUDIO, OBBY, REST, TRAY, ...NPCS]) o.visible = false;
  APRON_M.visible = APRON_S.visible = CHEF.visible = false; lavaLight.intensity = 0; studioLight.intensity = 0; topCol(momG, '#9b5de5'); HAT.visible = false; TURN.visible = false;
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


function topCol(k, c) { const b = k.userData.body.children; for (const i of [2, 3]) b[i].material.color.set(c); for (const a of k.userData.arms) a.children[0].material.color.set(c); }
function studio(f) { STUDIO.visible = true; scene.background = new THREE.Color('#b8a7ff'); hemi.color.set('#ffffff'); hemi.groundColor.set('#b8a7ff'); hemi.intensity = 0.85; studioLight.intensity = 14; key.intensity = 0.6; scene.fog.near = 60; scene.fog.far = 200; }
function obby(f, t) { OBBY.visible = true; scene.background = obbySky; scene.fog.color.set('#f25c8a'); scene.fog.near = 20; scene.fog.far = 70; hemi.color.set('#ffd6a8'); hemi.groundColor.set('#ff5400'); hemi.intensity = 1.0; key.intensity = 1.2; key.color.set('#ffe0c0'); LAVA_T.offset.set(t * 0.03, t * 0.015); }
function npcLine(n, x0, z0, dz, f, face = 'happy') { for (let i = 0; i < n; i++) { const k = NPCS[i]; show(k, GX + x0 + Math.sin(i * 1.7) * 0.25, 0, z0 + i * dz, Math.PI + Math.sin(i) * 0.3); k.scale.setScalar(0.9); setFace(k, i % 3 === 0 ? 'happyc' : face); k.userData.head.rotation.z = Math.sin(f * 0.15 + i) * 0.08; k.position.y = Math.abs(Math.sin(f * 0.2 + i * 1.3)) * 0.06; } }
function restaurant(f, t) { game(f); REST.visible = true; DECOR.visible = false; }
const SH = [
  // 1 — hook: mom close, headset
  { a: 0, b: 1.4, run(t, f) { room(f); sofa({ me: 'stern' }); mom.userData.head.rotation.set(0.05, 0, Math.sin(t * 6) * 0.04); const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x + 0.1, h.y + 0.02, h.z + 1.75 - t * 0.2], [h.x, h.y - 0.12, h.z], 1.7), ap: 0.012, fx: () => { glow(W / 2, H * 0.55, 700, '127,208,255', 0.18); TAG('MINHA MÃE', 300, popT(t, 0.05), 140, '#ffd23f'); TAG('NO ROBLOX?! 🎮', 460, popT(t, 0.55), 96, '#ff5fa2'); } }; } },
  // 2 — sofa two-shot
  { a: 1.4, b: 2.626, run(t, f) { room(f); sofa({ me: 'stern', se: 'happy', sl: 0.6 }); const k = prog(t, 1.4, 2.626);
    return { cam: C([RX - 0.3 + k * 0.5, 1.55, 3.5 - k * 0.3], [RX, 1.15, SZ], 3.5), ap: 0.004, fx: () => { TAG('1ª VEZ 🎮', 300, popT(t, 1.45), 130, '#8ce95a'); } }; } },
  // 3 — avatar editor: outfit colour cycling fast
  { a: 2.626, b: 4.0, run(t, f) { studio(f); const c = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#f15bb5', '#9b5de5'][Math.floor(t * 6) % 6]; gWho(momG, -80, 0, t * 2.2, { y: 0, e: 'happy' }); topCol(momG, c);
    return { cam: C([SX0 + 0.3, 1.4, 4.6], [SX0, 1.0, 0], 4.6), ap: 0.003, fx: () => { editorUI(t, 1); TAG('20 MINUTOS ⏳', 360, popT(t, 2.7), 110, '#ffffff'); } }; } },
  // 4 — real mom concentrating
  { a: 4.0, b: 5.5, run(t, f) { room(f); sofa({ me: 'stern', ml: Math.sin(t * 3) * 0.4 }); mom.userData.body.rotation.x = 0.12; const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x - 0.4, h.y - 0.05, h.z + 1.7 - prog(t, 4, 5.5) * 0.3], [h.x, h.y - 0.2, h.z], 1.7), ap: 0.01, fx: () => { TAG('🧐', 330, popT(t, 4.1), 170, '#fff'); } }; } },
  // 5 — the avatar is HER, apron included
  { a: 5.5, b: 7.611, run(t, f) { studio(f); gWho(momG, -80, 0, Math.sin(t * 1.5) * 0.5, { y: 0, e: 'happyc' }); APRON_M.visible = true; momG.userData.arms[1].rotation.set(-0.3, 0, 0.9 + Math.sin(t * 8) * 0.2); const k = prog(t, 5.5, 7.611);
    return { cam: C([SX0 + 0.2, 1.45 - k * 0.1, 4.2 - k * 0.8], [SX0, 1.15, 0], 4.2 - k * 0.8), ap: 0.004, fx: () => { const p = P(SX0, 1.3, 0); for (let i = 0; i < 7; i++) sparkle(p[0] + Math.cos(i * 0.9 + t * 2) * 340, p[1] + Math.sin(i * 1.3 + t * 2) * 420, 26 + 14 * Math.sin(t * 6 + i), f); TAG('IGUALZINHA 😂', 300, popT(t, 5.6), 116, '#ffd23f'); TAG('ATÉ O AVENTAL', 450, popT(t, 6.4), 96, '#ffffff'); } }; } },
  // 6 — obby: jumping across platforms over lava
  { a: 7.611, b: 8.9, run(t, f) { obby(f, t); const u = (t - 7.611) * 1.4; const [x, y, z] = jumpPos(u); show(momG, x, y, z, Math.PI); momG.scale.setScalar(1); setFace(momG, 'shock'); runPose(momG, f * 0.4, 1, 0.2); lavaLight.position.set(x, 2, z + 2); lavaLight.intensity = 25;
    return { cam: C([x + 3.2, y + 2.2, z + 4.5], [x, y + 0.5, z - 2], 6), ap: 0.001, fx: () => { hud(f, { label: 'PARKOUR 🔥', items: ['#ff5fa2', '#5ef2ff'] }); TAG('PARKOUR 🔥', 330, popT(t, 7.7), 120, '#ffb703'); embers(f, 0.6, 6); } }; } },
  // 7 — she falls into the lava, counter climbs
  { a: 8.9, b: 10.286, run(t, f) { obby(f, t); const k = prog(t, 8.9, 9.6); const [x0, y0, z0] = PLAT[2]; const x = x0 + 1.2, y = lerp(y0 + 1.5, -1.6, k * k), z = z0 - 1.6; show(momG, x, y, z, Math.PI * 0.8); momG.rotation.z = k * 1.2; setFace(momG, 'shock'); for (const a of momG.userData.arms) a.rotation.set(-2.8, 0, 0); lavaLight.position.set(x, 2, z + 2); lavaLight.intensity = 30;
    const n = Math.min(10, 1 + Math.floor(prog(t, 9.5, 10.25) * 10)); return { cam: C([x + 2.8, 2.6, z + 4.8], [x, Math.max(0.3, y * 0.6), z], 5), ap: 0.002, shake: k >= 1 ? 1.0 : 0.2, fx: () => { hud(f, { label: 'PARKOUR 🔥', hearts: Math.max(0, 10 - n) }); if (k >= 1) { const p = P(x, 0, z); ringFx(p[0], p[1], prog(t, 9.6, 10.0), '255,180,0', 600); tint('rgba(255,60,0,A)', 0.25); } if (t > 9.5) TAG('x' + n, 420, 1 + 0.15 * Math.sin(t * 30), 200, '#ff595e'); embers(f, 0.8, 7); } }; } },
  // 8 — real mom, outraged
  { a: 10.286, b: 12.0, run(t, f) { room(f); sofa({ me: 'stern', pad: false }); mom.userData.arms[0].rotation.set(-1.3, 0, -0.9 - Math.sin(t * 10) * 0.2); mom.userData.arms[1].rotation.set(-1.3, 0, 0.9 + Math.sin(t * 10) * 0.2); mom.userData.body.rotation.x = 0.12; const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x + 0.3, h.y + 0.05, h.z + 1.85], [h.x, h.y - 0.3, h.z], 1.85), ap: 0.009, shake: 0.4, fx: () => { bub(t, 10.33, 'QUEM BOTOU LAVA\nNO MEIO DO CAMINHO?\nISSO É PERIGOSO!', { fs: 50, tx: 50 }); } }; } },
  // 9 — game: respawn... and down again
  { a: 12.0, b: 13.97, run(t, f) { obby(f, t); const tt = (t - 12.0) % 0.9; const [x0, y0, z0] = PLAT[0]; const y = tt < 0.45 ? y0 + Math.sin(tt / 0.45 * Math.PI) * 1.4 : lerp(y0, -1.6, (tt - 0.45) / 0.45); show(momG, x0 + (tt < 0.45 ? tt * 3 : 1.4 + (tt - 0.45)), y, z0 - tt * 2, Math.PI); setFace(momG, 'stern'); for (const a of momG.userData.arms) a.rotation.set(-2.6, 0, 0); lavaLight.position.set(x0, 2, z0 + 2); lavaLight.intensity = 30;
    return { cam: C([x0 + 4.5, 3.2, z0 + 5], [x0 + 1, 1, z0 - 1.5], 6), ap: 0.001, fx: () => { hud(f, { label: 'PARKOUR 🔥', hearts: 0 }); TAG('DE NOVO 🔥', 330, popT(t, 12.05), 120, '#ffb703'); embers(f, 0.8, 8); } }; } },
  // 10 — chat: a kid calls her "noob"
  { a: 13.97, b: 15.6, run(t, f) { game(f); gWho(momG, 1.0, 8, Math.PI, { e: 'happy' }); show(noobKid, GX - 1.2, 0, 7.2, 0.6); noobKid.scale.setScalar(0.9); setFace(noobKid, 'smug'); noobKid.userData.arms[1].rotation.set(-1.4, 0, 0.2); APRON_M.visible = true;
    return { cam: C(G(0.0, 1.9, 12.6), G(-0.1, 1.1, 7.6), 5), ap: 0.002, fx: () => { hud(f, { cross: false }); chat([['PedroGamer07', '#4cc9f0', 'noob kkkkk']], popT(t, 14.4)); } }; } },
  // 11 — son covers his face
  { a: 15.6, b: 17.313, run(t, f) { room(f); sofa({ se: 'worry', me: 'smug', ml: -0.4 }); son.userData.arms[0].rotation.set(-2.5, 0, 0.35); son.userData.arms[1].rotation.set(-2.5, 0, -0.35); const [h] = headCam(son, 0, 0);
    return { cam: C([h.x - 0.3, h.y, h.z + 1.6], [h.x, h.y - 0.1, h.z], 1.6), ap: 0.011, fx: () => { TAG('ELA RESPONDEU... 😬', 330, popT(t, 16.4), 92, '#ffffff'); } }; } },
  // 12 — she types it in the chat
  { a: 17.313, b: 18.8, run(t, f) { game(f); gWho(momG, 1.0, 8, Math.PI - 0.6, { e: 'smug' }); APRON_M.visible = true; momG.userData.arms[1].rotation.set(-1.6, 0, 0.1); show(noobKid, GX - 1.2, 0, 7.2, 0.6); noobKid.scale.setScalar(0.9); setFace(noobKid, 'flat');
    const msg = 'Noob é você. Já fez a lição de casa?'; const n = Math.floor(prog(t, 17.35, 18.6) * msg.length);
    return { cam: C(G(1.6, 1.9, 10.6), G(0.6, 1.4, 8), 2.8), ap: 0.004, fx: () => { hud(f, { cross: false }); chat([['PedroGamer07', '#4cc9f0', 'noob kkkkk'], ['MÃE', '#ff5fa2', msg.slice(0, n) + (Math.floor(f / 6) % 2 ? '|' : '')]], 1); } }; } },
  // 13 — real mom: smug
  { a: 18.8, b: 20.204, run(t, f) { room(f); sofa({ me: 'smug', ml: -0.5 }); mom.userData.head.rotation.set(-0.1, -0.3, 0.12); const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x - 0.3, h.y + 0.05, h.z + 1.7 - prog(t, 18.8, 20.2) * 0.3], [h.x, h.y - 0.15, h.z], 1.7), ap: 0.012, fx: () => { const p = PW(mom.userData.head, 0.05); sparkle(p[0] - 150, p[1] - 30, 40, f); TAG('😎', 330, popT(t, 18.9), 170, '#fff'); } }; } },
  // 14 — the kid leaves the game
  { a: 20.204, b: 21.996, run(t, f) { game(f); const k = prog(t, 20.7, 21.0); gWho(momG, 1.0, 8, Math.PI - 0.6, { e: 'happyc' }); APRON_M.visible = true; if (k < 1) { show(noobKid, GX - 1.2, 0, 7.2, 0.6); noobKid.scale.setScalar(0.9 * (1 - k)); setFace(noobKid, 'shock'); }
    return { cam: C(G(0.6, 1.6, 11.2), G(-0.6, 1.0, 7.4), 3.9), ap: 0.003, fx: () => { hud(f, { cross: false }); const p = P(GX - 1.2, 1.0, 7.2); if (t > 20.7) ringFx(p[0], p[1], prog(t, 20.7, 21.2), '255,255,255', 420); chat([['PedroGamer07', '#4cc9f0', 'noob kkkkk'], ['MÃE', '#ff5fa2', 'Noob é você. Já fez a lição de casa?'], ...(t > 20.8 ? [[null, '', 'PedroGamer07 saiu do jogo.']] : [])], 1); if (t > 20.9) TAG('SAIU 🏃💨', 1100, popT(t, 20.9), 110, '#ffd23f'); } }; } },
  // 15 — the shop: a legendary hat
  { a: 21.996, b: 23.821, run(t, f) { studio(f); HAT.visible = true; HAT.rotation.y = t * 1.6; HAT.position.y = 1.8 + Math.sin(t * 3) * 0.08;
    return { cam: C([SX0, 2.0, 3.2 - prog(t, 22, 23.8) * 0.5], [SX0, 1.95, 0], 3), ap: 0.004, bloom: 0.7, fx: () => { const p = P(SX0, 2.1, 0); for (let i = 0; i < 6; i++) sparkle(p[0] + Math.cos(i + t * 2) * 300, p[1] + Math.sin(i * 1.4 + t * 2) * 260, 28, f); shopUI(popT(t, 22.4), t); TAG('LOJA 🛒', 330, popT(t, 22.05), 120, '#ffffff'); } }; } },
  // 16 — mom's shock
  { a: 23.821, b: 25.1, run(t, f) { room(f); sofa({ me: 'shock' }); mom.userData.head.rotation.x = -0.1; const [h] = headCam(mom, 0, 0); const z = 1 + ss(prog(t, 23.82, 24.0)) * 0.15;
    return { cam: C([h.x + 0.1, h.y, h.z + 1.7 / z], [h.x, h.y - 0.1, h.z], 1.7 / z), ap: 0.012, shake: 0.9, fx: () => { bub(t, 23.85, '800 REAIS NUM\nCHAPÉU QUE NEM\nEXISTE?!', { fs: 54, tx: -40 }); } }; } },
  // 17 — the shop closes with a big X
  { a: 25.1, b: 26.379, run(t, f) { studio(f); HAT.visible = true; HAT.rotation.y = t * 0.4; const k = prog(t, 25.15, 25.4);
    return { cam: C([SX0, 2.0, 2.7], [SX0, 1.95, 0], 2.7), ap: 0.004, fx: () => { shopUI(1, t); O.save(); O.translate(W / 2, 760); O.scale(backOut(k), backOut(k)); O.strokeStyle = '#ff2d55'; O.lineWidth = 46; O.lineCap = 'round'; O.beginPath(); O.moveTo(-260, -260); O.lineTo(260, 260); O.moveTo(260, -260); O.lineTo(-260, 260); O.stroke(); O.restore(); TAG('NEM PENSAR 🙅', 330, popT(t, 25.5), 116, '#ffffff'); } }; } },
  // 18 — one week later: the restaurant
  { a: 26.379, b: 27.9, run(t, f) { restaurant(f, t); const k = prog(t, 26.38, 27.9); npcLine(4, 0, HZ0 + 4.4, 1.3, f);
    return { cam: C(G(Math.sin(-0.5 + k * 0.5) * 15, 6.5 - k * 1.5, HZ0 + 15), G(0, 2.2, HZ0 + 2), 14), ap: 0.0008, fx: () => { hud(f, { cross: false }); TAG('1 SEMANA DEPOIS', 330, popT(t, 26.42), 100, '#ffffff'); } }; } },
  // 19 — the queue at the door
  { a: 27.9, b: 29.3, run(t, f) { restaurant(f, t); npcLine(7, 0, HZ0 + 3.8, 1.2, f, 'happy');
    return { cam: C(G(2.6, 1.3, HZ0 + 13), G(0, 1.4, HZ0 + 5), 6), ap: 0.003, fx: () => { hud(f, { cross: false }); TAG('FILA NA PORTA 😱', 330, popT(t, 27.95), 104, '#ffd23f'); } }; } },
  // 20 — mom-avatar, chef hat, boss at the door
  { a: 29.3, b: 30.756, run(t, f) { restaurant(f, t); gWho(momG, 0, HZ0 + 2.9, 0, { e: 'smug' }); APRON_M.visible = true; CHEF.visible = true; momG.userData.arms[0].rotation.set(-0.2, 0, -0.9); momG.userData.arms[1].rotation.set(-0.2, 0, 0.9); npcLine(3, 0, HZ0 + 4.4, 1.2, f);
    return { cam: C(G(1.3, 1.5, HZ0 + 5.6), G(0, 1.7, HZ0 + 2.9), 2.8), ap: 0.006, fx: () => { hud(f, { cross: false }); TAG('A DONA 👩‍🍳', 330, popT(t, 29.35), 116, '#ff5fa2'); } }; } },
  // 21 — real mom: "Filho! Mesa cinco! Anda!"
  { a: 30.756, b: 32.0, run(t, f) { room(f); sofa({ me: 'stern', pad: false }); mom.userData.body.rotation.x = 0.15; mom.userData.head.rotation.y = -0.5; mom.userData.arms[0].rotation.set(-1.75 - Math.sin(t * 12) * 0.12, 0, -0.5); mom.userData.arms[1].rotation.set(-1.0, 0, 0.5); const [h] = headCam(mom, 0, 0);
    return { cam: C([h.x - 0.5, h.y + 0.05, h.z + 1.85], [h.x - 0.05, h.y - 0.3, h.z], 1.85), ap: 0.009, shake: 0.6, fx: () => { bub(t, 30.8, 'FILHO! MESA CINCO!\nANDA!', { fs: 60, tx: -60 }); } }; } },
  // 22 — the son's avatar runs with the tray
  { a: 32.0, b: 33.382, run(t, f) { restaurant(f, t); const [tx, tz] = window.T5; const k = prog(t, 32.0, 33.3); const x = lerp(0, tx + 0.9, k), z = lerp(HZ0 + 3.0, tz - 0.2, k); placeK(son, { x: GX + x, z, ry: Math.atan2(tx + 0.9, tz - HZ0 - 3.2), ph: f * 0.55, amt: 1, lean: 0.3 }); son.scale.setScalar(0.95); setFace(son, 'worry'); APRON_S.visible = true; son.userData.watch.visible = false;
    son.userData.arms[1].rotation.set(-1.6, 0, 0.2); const hp = hand(son, 1); TRAY.visible = true; TRAY.position.set(hp.x, hp.y + 0.1, hp.z); npcLine(2, -4.2 + 1.2, tz + 0.4, 0, f); NPCS[1].position.x = GX + tx - 1.0;
    return { cam: C(G(x + 2.5, 1.8, z + 3.6), G(x, 1.0, z), 4.4), ap: 0.003, fx: () => { hud(f, { cross: false }); const p = PW(son.userData.head, 0.2); sweat(p[0], p[1], 2, f); TAG('MESA 5 🏃', 330, popT(t, 32.05), 120, '#ffd23f'); } }; } },
  // 23 — delivered: the son bows, tray on the table
  { a: 33.382, b: 34.3, run(t, f) { restaurant(f, t); const [tx, tz] = window.T5; show(son, GX + tx + 0.95, 0, tz + 0.1, -Math.PI / 2); son.scale.setScalar(0.95); setFace(son, 'flat'); APRON_S.visible = true; son.userData.watch.visible = false; son.userData.body.rotation.x = 0.35; TRAY.visible = true; TRAY.position.set(GX + tx, 0.86, tz);
    show(NPCS[1], GX + tx - 1.0, 0, tz, Math.PI / 2); NPCS[1].scale.setScalar(0.9); setFace(NPCS[1], 'happyc');
    return { cam: C(G(tx + 2.8, 1.6, tz + 2.4), G(tx + 0.3, 1.0, tz), 3.4), ap: 0.004, fx: () => { hud(f, { cross: false }); TAG('GARÇOM 🍽️', 330, popT(t, 33.42), 120, '#ffffff'); } }; } },
  // 24 — real son: flat face
  { a: 34.3, b: 35.274, run(t, f) { room(f); sofa({ se: 'flat', sl: 0.9, me: 'happyc' }); holdPad(mom); son.userData.head.rotation.y = 0.5; const [h] = headCam(son, 0, 0);
    return { cam: C([h.x - 0.35, h.y, h.z + 1.5], [h.x, h.y - 0.1, h.z], 1.5), ap: 0.012, fx: () => { TAG('DA MINHA PRÓPRIA MÃE 😐', 330, popT(t, 34.35), 74, '#ffd23f'); } }; } },
  // 25 — both on the sofa + question
  { a: 35.274, b: 99, run(t, f) { room(f); sofa({ me: 'happyc', se: 'flat' }); holdPad(mom); const k = prog(t, 35.27, 42);
    return { cam: C([RX + Math.sin(t * 0.5) * 0.3, 1.45 + k * 0.2, 2.6 - k * 0.4], [RX, 1.15, SZ], 2.7), ap: 0.003, fx: () => { const q = popT(t, 35.3); O.save(); O.fillStyle = 'rgba(20,8,30,.42)'; O.fillRect(0, 0, W, 720 * Math.min(1, q)); O.restore();
      TAG('SUA MÃE', 220, popT(t, 35.3), 120, '#ffffff'); TAG('DOMINARIA? 👑', 380, popT(t, 35.6), 124, '#ffd23f');
      const kk = popT(t, 36.4); if (kk > 0.01) for (const [x, txt, col] of [[W / 2 - 230, 'SIM 😂', '#ff5fa2'], [W / 2 + 230, 'NUNCA 🙅', '#3a86ff']]) { O.save(); O.translate(x, 580); O.scale(kk * (1 + Math.sin(t * 7) * 0.03), kk); O.fillStyle = col; O.strokeStyle = '#1c1222'; O.lineWidth = 10; O.beginPath(); O.roundRect(-195, -72, 390, 144, 40); O.fill(); O.stroke(); O.fillStyle = '#fff'; O.font = '900 66px Inter, Arial Black'; O.textAlign = 'center'; O.textBaseline = 'middle'; O.fillText(txt, 0, 4); O.restore(); }
      if (t > 37.0) TAG('COMENTA 👇', 740, popT(t, 37.0), 74, '#ffd23f'); } }; } },
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
