
// ---------- shots (t in seconds, 24 fps)
camera.far = 1200; camera.updateProjectionMatrix();
const C = (p, l, d) => ({ p, l, d });
const popT = (t, a, d = 0.3) => backOut(clamp((t - a) / d));
// the eye in the window: a flat disc (iris texture) + lids, fitted inside the window frame
const EYE2 = new THREE.Group(); EYE2.position.z = 0.5; WIN.add(EYE2);
{ const disc = new THREE.Mesh(new THREE.CircleGeometry(30, 48), EYE.userData.ball.material); EYE2.add(disc); EYE2.userData.disc = disc; const lm = new THREE.MeshBasicMaterial({ color: '#2a1a24' }); const up = new THREE.Mesh(new THREE.PlaneGeometry(64, 40), lm), dn = new THREE.Mesh(new THREE.PlaneGeometry(64, 40), lm); up.position.z = dn.position.z = 0.3; EYE2.add(up, dn); EYE2.userData.up = up; EYE2.userData.dn = dn; }
EYE.visible = false;
function eyeOpen(o) { EYE2.userData.up.position.y = 20 + 18 * o; EYE2.userData.dn.position.y = -20 - 18 * o; }
function reset() {
  for (const o of BASE) o.visible = false;
  for (const o of [CRIB, CUP, DOG, ARCH, HAND, GIRL, DOLL, ME, NINA, LOST, BABY, ROPE, EYE, ...SHARDS, ...FOLK]) o.visible = false;
  for (const o of [ROOM, TOWNWALL, TOWN, BEDG, SHELF, NLIGHT, WIN]) o.visible = true;
  veil.visible = false; ME.userData.watch.visible = false; EYE2.visible = false; HAT.visible = true;
  for (const k of [ME, NINA, LOST, GIRL, DOLL, BABY, ...FOLK]) { k.userData.body.rotation.set(0, 0, 0); k.userData.body.position.set(0, 0, 0); k.userData.head.rotation.set(0, 0, 0); k.rotation.set(0, 0, 0); }
  heroLight.intensity = 0; portalLight.intensity = 0; fill.intensity = 0; moonLamp.intensity = 0; townNight(false); scene.fog.near = 1000; scene.fog.far = 2000;
  ceilMat.emissive.set('#ffffff'); ceilMat.emissiveIntensity = 0.25; renderer.toneMappingExposure = 1.15; curl(HAND, 0); HAND.rotation.set(0, 0, 0);
}
function day() { scene.background = new THREE.Color('#ffe8f0'); hemi.color.set('#fff6ea'); hemi.groundColor.set('#c99a6b'); hemi.intensity = 1.2; key.intensity = 1.6; key.color.set('#fff1dc'); fill.intensity = 0; }
function night() { scene.background = new THREE.Color('#0b0b20'); hemi.color.set('#6b74c9'); hemi.groundColor.set('#1a1033'); hemi.intensity = 0.32; key.intensity = 0.25; key.color.set('#9fb4ff'); townNight(true); moonLamp.intensity = 200; ceilMat.emissiveIntensity = 0.05; }
function pink(k) { hemi.color.lerpColors(new THREE.Color('#fff6ea'), new THREE.Color('#ff9ecb'), k); ceilMat.emissive.lerpColors(new THREE.Color('#ffffff'), new THREE.Color('#ff7eb6'), k); ceilMat.emissiveIntensity = 0.25 + 0.4 * k; }
function stand(k, x, z, ry, e = 'happy', look = 0) { show(k, x, 0, z, ry); setFace(k, e, look); return k; }
function headC(k, dx, dy, dz) { const h = wpos(k.userData.head); return [[h.x + dx, h.y + dy, h.z + dz], [h.x, h.y - 0.05, h.z]]; }
function walk(k, x, z, ry, t, amt = 0.35) { placeK(k, { x, z, ry, ph: t * 7, amt, lean: 0.05 }); }
function notes(t, x, y, n = 4) { for (let i = 0; i < n; i++) { const u = ((t * 0.5 + i / n) % 1); O.globalAlpha = Math.sin(u * Math.PI); O.fillStyle = '#ffd23f'; O.font = '900 90px Arial'; O.fillText(i % 2 ? '♪' : '♫', x + Math.sin(i * 2 + t) * 120, y - u * 360); O.globalAlpha = 1; } }
const lostPos = [2.5, 0, 6];

const SH = [
  // 1 — hook: the narrator, finger on his lips, lamplight on his face
  { a: 0, b: 2.4, run(t) { night(); stand(ME, 0, 12, 0, 'stern'); shhPose(ME); const [p, l] = headC(ME, 0.05, 0.02, 1.35 - t * 0.1); return { cam: C(p, l, 1.3), ap: 0.012, fx: () => { glow(W / 2, H * 0.6, 600, '255,207,107', 0.18); titleLine('A CIDADE DO SILÊNCIO', 300, popT(t, 0.1), 86, '#ffffff'); } }; } },
  // 2 — the town at night from above
  { a: 2.4, b: 4.6, run(t) { night(); const k = prog(t, 2.4, 4.6); return { cam: C([Math.sin(k * 0.4) * 10, 34 - k * 4, 58 - k * 6], [0, 2, 0], 50), ap: 0.0006 }; } },
  // 3 — empty street: a hat on the ground, a swing moving by itself
  { a: 4.6, b: 7.05, run(t) { night(); SWING.userData.seat.rotation.x = Math.sin(t * 2.2) * 0.35; HAT.position.set(4.5, 0, 9.5); return { cam: C([2.2, 1.4, 12.5], [6, 1.4, 8], 5), ap: 0.003 }; } },
  // 4 — the night watchman on top of the bell tower
  { a: 7.05, b: 9.6, run(t) { night(); show(ME, 0, 0, 3, Math.PI + 0.3); setFace(ME, 'stern', 0.5); ME.userData.arms[1].rotation.set(-0.9, 0, 0.2); const a = prog(t, 7.05, 9.6); return { cam: C([-1.0 + a * 0.4, 1.9, 0.6], [0, 1.75, 3], 2.6), ap: 0.006, fx: () => { const p = PV(hand(ME, 1)); glow(p[0], p[1], 160, '255,207,107', 0.5); } }; } },
  // 5 — tiptoeing through the street
  { a: 9.6, b: 12.21, run(t) { night(); const z = lerp(4, 9, prog(t, 9.6, 12.21)); walk(ME, -1, z, 0, t, 0.25); setFace(ME, 'stern'); ME.userData.watch.visible = false; return { cam: C([1.6, 0.5, z + 3.2], [-1, 0.9, z], 3.4), ap: 0.004 }; } },
  // 6 — a baby in a crib; mum: shhh
  { a: 12.21, b: 16.44, run(t) { night(); CRIB.visible = true; CRIB.position.set(-3, 0, 3); show(BABY, -3, 0.86, 3, 0); BABY.rotation.x = -Math.PI / 2; BABY.position.y = 0.95; setFace(BABY, 'happyc'); const m = stand(FOLK[5], -3, 4.4, Math.PI, 'happy'); m.userData.body.rotation.x = 0.35; shhPose(m); const k = prog(t, 12.21, 16.44); return { cam: C([-3 - 1.0 + k * 0.4, 2.5, 0.6 + k * 0.3], [-3, 1.5, 3.6], 3.2), ap: 0.004, fx: () => { if (t > 13.6) titleLine('SHHH...', 360, popT(t, 13.6), 110, '#ffffff'); } }; } },
  // 7 — feet: everyone walks in socks
  { a: 16.44, b: 18.8, run(t) { night(); const z = lerp(3, 6, prog(t, 16.44, 18.8)); walk(ME, 0, z, 0, t, 0.6); return { cam: C([0.9, 0.25, z + 1.1], [0, 0.15, z], 1.3), ap: 0.01 }; } },
  // 8 — the bell has no clapper
  { a: 18.8, b: 20.9, run(t) { night(); TOWER.userData.bell.rotation.z = Math.sin(t * 2.5) * 0.3; heroLight.position.set(-3.5, 14, -3); heroLight.color.set('#ffcf8a'); heroLight.intensity = 25; heroLight.distance = 12; return { cam: C([-1.5, 1.4, -0.5], [-6, 13.6, -6], 13), ap: 0.001 }; } },
  // 9 — the dog wags its tail... silently
  { a: 20.9, b: 23.4, run(t) { night(); DOG.visible = true; DOG.position.set(3, 0, 7); DOG.rotation.y = -0.4; DOG.userData.tail.rotation.y = Math.sin(t * 18) * 0.7; return { cam: C([4.6, 1.0, 9.4], [3, 0.8, 7], 2.8), ap: 0.006 }; } },
  // 10 — the wedding: they say "yes" by blinking
  { a: 23.4, b: 26.83, run(t) { night(); ARCH.visible = true; ARCH.position.set(0, 0, -2); const bl = Math.floor(t * 3) % 2; const b = stand(FOLK[2], -0.6, -1.6, 0.25, bl ? 'happyc' : 'happy'); veil.visible = true; const g = stand(FOLK[0], 0.6, -1.6, -0.25, bl ? 'happy' : 'happyc'); FOLK.slice(3).forEach((k, i) => stand(k, -3 + i * 2, 3.8 + (i % 2) * 0.6, Math.PI, 'happy'));
    const k = prog(t, 23.4, 26.83); return { cam: C([0.4, 2.1, 1.4 - k * 0.4], [0, 2.0, -1.6], 3.0), ap: 0.004, fx: () => { for (let i = 0; i < 26; i++) { const r = rng(i); const u = ((t * 0.2 + r()) % 1); O.fillStyle = ['#ff8fab', '#ffd23f', '#ffffff'][i % 3]; O.globalAlpha = 0.8; O.fillRect(r() * W, u * H, 14, 20); O.globalAlpha = 1; } } }; } },
  // 11 — the great wall around the town
  { a: 26.83, b: 30.5, run(t) { day(); const k = prog(t, 26.83, 30.5); stand(ME, 0, -36, Math.PI, 'worry', 0); ME.userData.head.rotation.x = -0.5; return { cam: C([2.5, 1.4 + k * 3, -30], [0, lerp(1.6, 22, ss(k)), lerp(-36, -45, k)], 8), ap: 0.001 }; } },
  // 12 — the sky turns pink
  { a: 30.5, b: 34.25, run(t) { day(); pink(ss(prog(t, 31, 33.5))); stand(ME, 0, 6, Math.PI, 'surprised'); ME.userData.head.rotation.x = -0.7; return { cam: C([0.6, 0.9, 8.2], [0, 40, -40], 30), ap: 0.0008, fx: () => tint('rgba(255,120,190,A)', 0.12 * ss(prog(t, 31, 33.5))) }; } },
  // 13 — Nina, the loudest girl in town, always humming
  { a: 34.25, b: 38.0, run(t) { day(); stand(NINA, 1, 8, 0.2, 'happyc'); NINA.userData.head.rotation.z = Math.sin(t * 3) * 0.12; const [p, l] = headC(NINA, 0.4, 0, 1.6); return { cam: C(p, l, 1.6), ap: 0.01, fx: () => notes(t, W / 2 + 120, 800) }; } },
  // 14 — every night he covers her mouth while she sleeps
  { a: 38.0, b: 42.77, run(t) { night(); show(NINA, 0, 0.35, 10, 0); NINA.rotation.x = -Math.PI / 2; setFace(NINA, 'happyc'); show(ME, -0.8, 0, 10.6, Math.PI / 2 + 0.2); ME.userData.body.position.y = -0.4; for (const lg of ME.userData.legs) lg.rotation.x = -1.4; setFace(ME, 'worry', 0.6); ME.userData.arms[1].rotation.set(-1.6, 0, -0.1);
    const k = prog(t, 38, 42.77); return { cam: C([lerp(1.4, -0.6, k), 2.3 - k * 0.5, 12.6 - k * 0.6], [-0.2, 0.5, 10.4], 2.6), ap: 0.004, fx: () => notes(t, W / 2, 900, 2) }; } },
  // 15 — a boy drops a glass (slow motion) — CRASH
  { a: 42.77, b: 45.94, run(t) { day(); stand(LOST, ...[lostPos[0], lostPos[2]], 0.4, t < 44.4 ? 'happy' : 'shock'); const k = prog(t, 43.1, 44.4); const h = hand(LOST, 1); CUP.visible = t < 44.4; CUP.position.set(h.x + 0.3, lerp(h.y, 0.2, k * k), h.z + 0.25); CUP.rotation.z = k * 2;
    if (t >= 44.4) SHARDS.forEach((s, i) => { const r = rng(i + 5), u = prog(t, 44.4, 45.0); s.visible = true; s.position.set(h.x + 0.3 + (r() - 0.5) * 1.6 * u, 0.05 + Math.sin(u * Math.PI) * 0.4 * r(), h.z + 0.25 + (r() - 0.5) * 1.6 * u); s.rotation.set(t * 3 + i, i, 0); });
    return { cam: C([lostPos[0] + 2.2, 1.2, lostPos[2] + 3.4], [lostPos[0] + 0.2, 1.0, lostPos[2] + 0.2], 3.8), ap: 0.008, shake: t > 44.4 && t < 44.7 ? 1.4 : 0, fx: () => { if (t > 44.4 && t < 44.55) tint('rgba(255,255,255,A)', 0.6); } }; } },
  // 16 — the sky opens: a giant hand comes down
  { a: 45.94, b: 48.6, run(t) { day(); stand(LOST, lostPos[0], lostPos[2], 0.4, 'shock'); LOST.userData.head.rotation.x = -0.6; const k = prog(t, 45.94, 48.6); HAND.visible = true; HAND.position.set(lostPos[0], lerp(150, 70, ss(k)), lostPos[2]); HAND.rotation.set(Math.PI, 0, 0.2);
    return { cam: C([lostPos[0] - 2, 1.0, lostPos[2] + 4], [lostPos[0], 40, lostPos[2] - 10], 30), ap: 0.0008, fx: () => { const p = P(lostPos[0], 120, lostPos[2]); glow(p[0], p[1], 700, '255,250,220', 0.3); } }; } },
  // 17 — it picks the boy up, gently... and he's gone
  { a: 48.6, b: 51.85, run(t) { day(); const d = ss(prog(t, 48.6, 49.8)), up = ss(prog(t, 50.3, 51.7)); HAND.visible = true; HAND.rotation.set(Math.PI, 0, 0.2); HAND.position.set(lostPos[0], lerp(70, 9, d) + up * 120, lostPos[2]); curl(HAND, prog(t, 49.7, 50.2) * 0.7);
    stand(LOST, lostPos[0], lostPos[2], 0.4, 'shock'); LOST.position.y = up * 120; LOST.visible = up < 0.5; HAT.visible = true;
    return { cam: C([-8, 16, -10], [lostPos[0], 5 + up * 14, lostPos[2]], 22), ap: 0.0008 }; } },
  // 18 — the adults whisper: the sky is angry
  { a: 51.85, b: 54.0, run(t) { day(); FOLK.slice(0, 5).forEach((k, i) => { stand(k, -2 + i * 1.0, 3 + (i % 2) * 0.8, Math.PI + (i - 2) * 0.2, 'worry'); k.userData.head.rotation.x = -0.4; }); return { cam: C([0, 2.0, -1.2], [0, 2.0, 3.4], 4.6), ap: 0.003 }; } },
  // 19 — Nina looks up
  { a: 54.0, b: 56.29, run(t) { day(); stand(NINA, 1, 8, 0, 'stern'); NINA.userData.head.rotation.x = -0.45; const k = prog(t, 54, 56.29); const [p, l] = headC(NINA, -0.5 + k * 0.6, -0.25, 1.9 - k * 0.5); return { cam: C(p, l, 1.7), ap: 0.01 }; } },
  // 20 — "if it was angry, why did it pick him up so gently?"
  { a: 56.29, b: 60.01, run(t) { day(); stand(NINA, 1, 8, 0.3, 'worry'); const [p, l] = headC(NINA, 0.35, 0.02, 1.35 - prog(t, 56.3, 60) * 0.2); return { cam: C(p, l, 1.3), ap: 0.012 }; } },
  // 21 — that night, he climbs the wall
  { a: 60.01, b: 62.19, run(t) { night(); const y = lerp(2, 12, prog(t, 60.01, 62.19)); ROPE.visible = true; ROPE.position.set(0, WH / 2, -44.6); show(ME, 0, y, -44.2, Math.PI); setFace(ME, 'stern'); const ph = Math.sin(t * 8); ME.userData.arms[0].rotation.set(-2.6 + ph * 0.3, 0, 0.1); ME.userData.arms[1].rotation.set(-2.6 - ph * 0.3, 0, -0.1); ME.userData.legs[0].rotation.x = -0.6 + ph * 0.4; ME.userData.legs[1].rotation.x = -0.6 - ph * 0.4;
    heroLight.position.set(1.5, y + 2, -41); heroLight.color.set('#ffcf8a'); heroLight.intensity = 20; heroLight.distance = 10; return { cam: C([2, y + 0.5, -39.5], [0, y + 1.2, -44], 5), ap: 0.002 }; } },
  // 22 — on top: smooth stones with painted flowers
  { a: 62.19, b: 65.0, run(t) { night(); show(ME, 0, WH, -46, Math.PI); setFace(ME, 'surprised', 0); ME.userData.head.rotation.x = 0.4; heroLight.position.set(1.5, WH + 2.5, -43); heroLight.color.set('#ffcf8a'); heroLight.intensity = 14; heroLight.distance = 8; return { cam: C([2.4, WH + 1.8, -42.2], [0, WH + 0.9, -46.4], 4.6), ap: 0.004 }; } },
  // 23 — a river of wool
  { a: 65.0, b: 67.6, run(t) { night(); const k = prog(t, 65, 67.6); return { cam: C([46 + k * 6, WH + 3, 30], [95, 0, 30], 50), ap: 0.0008 }; } },
  // 24 — a square moon that goes tick-tock
  { a: 67.6, b: 70.87, run(t) { night(); NLIGHT.userData.mm.rotation.z = -Math.floor(t * 2) * 0.1; NLIGHT.userData.hh.rotation.z = -2.1; show(ME, 0, WH, -46, Math.PI); setFace(ME, 'surprised'); ME.userData.head.rotation.x = -0.3; const k = prog(t, 67.6, 70.87); return { cam: C([1.5 - k * 3, WH + 1.5 + k * 1.5, -43.5], [-40 + k * 20, 60 - k * 6, -209], 160), ap: 0.0005, bloom: 0.35 }; } },
  // 25 — on the other side: a giant room
  { a: 70.87, b: 75.0, run(t) { night(); show(ME, 0, WH, -46, Math.PI); setFace(ME, 'shock'); show(GIRL, -120, 22, -126, 0); GIRL.rotation.x = -Math.PI / 2; GIRL.scale.setScalar(K); setFace(GIRL, 'happyc'); const k = prog(t, 70.87, 75); return { cam: C([0.8, WH + 2.0 + k * 3, -42 + k * 3], [-60, 20, -140], 100), ap: 0.0006 }; } },
  // 26 — a giant girl, asleep
  { a: 75.0, b: 79.4, run(t) { night(); show(GIRL, -120, 22, -126, 0); GIRL.rotation.x = -Math.PI / 2; GIRL.scale.setScalar(K); setFace(GIRL, 'happyc'); GIRL.userData.head.rotation.z = Math.sin(t * 0.8) * 0.05; const h = wpos(GIRL.userData.head); const k = prog(t, 75, 79.4);
    return { cam: C([h.x + 30 - k * 10, h.y + 28, h.z + 30], [h.x, h.y, h.z], 40), ap: 0.0008 }; } },
  // 27 — the town was her dollhouse
  { a: 79.4, b: 82.46, run(t) { night(); show(GIRL, -120, 22, -126, 0); GIRL.rotation.x = -Math.PI / 2; GIRL.scale.setScalar(K); setFace(GIRL, 'happyc'); const k = ss(prog(t, 79.4, 82.3)); return { cam: C([lerp(20, 150, k), lerp(40, 150, k), lerp(-10, 170, k)], [-20, 0, -40], 150), ap: 0.0004 }; } },
  // 28 — the missing boy, on the shelf: pretend tea, smiling
  { a: 82.46, b: 88.79, run(t) { night(); moonLamp.intensity = 320; show(LOST, SHELF.position.x - 25, SHELF.position.y + 1.5, SHELF.position.z + 5, 0.5); LOST.scale.setScalar(2.4); setFace(LOST, 'happyc'); LOST.userData.arms[1].rotation.set(-1.2, 0, 0.3); const k = prog(t, 82.46, 88.79);
    return { cam: C([SHELF.position.x - 16, SHELF.position.y + 12 - k * 5, SHELF.position.z + 62 - k * 28], [SHELF.position.x - 18, SHELF.position.y + 3, SHELF.position.z], 60 - k * 28), ap: 0.0015 }; } },
  // 29 — she never took them to punish them: she took them to play
  { a: 88.79, b: 93.27, run(t) { night(); moonLamp.intensity = 320; HAND.visible = true; HAND.rotation.set(-0.3, 0, 0); HAND.position.set(SHELF.position.x - 10, SHELF.position.y + 14 + Math.sin(t) * 0.5, SHELF.position.z + 10); curl(HAND, 0.25); const hp = HAND.position; show(LOST, hp.x, hp.y + 1, hp.z + 3, 0.2); LOST.scale.setScalar(2.4); setFace(LOST, 'happyc'); LOST.userData.arms[1].rotation.set(-0.3, 0, 1.2 + Math.sin(t * 6) * 0.3);
    return { cam: C([hp.x + 12, hp.y + 8, hp.z + 26], [hp.x, hp.y + 2, hp.z], 26), ap: 0.0015, fx: () => { const p = P(hp.x, hp.y + 8, hp.z); for (let i = 0; i < 4; i++) { const u = ((t * 0.5 + i / 4) % 1); O.globalAlpha = Math.sin(u * Math.PI); O.fillStyle = '#ff5fa2'; heart2(p[0] + Math.sin(i * 2) * 160, p[1] - u * 300, 30); O.globalAlpha = 1; } } }; } },
  // 30 — she wakes up and picks up her doll
  { a: 93.27, b: 97.23, run(t) { night(); const k = ss(prog(t, 93.3, 94.8)); show(GIRL, -120, 26, -150, 0); GIRL.scale.setScalar(K); GIRL.rotation.x = -Math.PI / 2 * (1 - k); GIRL.position.y = 26 - k * 8; setFace(GIRL, t < 94.5 ? 'happyc' : 'happy'); GIRL.userData.arms[1].rotation.set(-1.4 * k, 0, 0.3); DOLL.visible = true; const hp = hand(GIRL, 1); show(DOLL, hp.x, hp.y - 3, hp.z + 3, 0); DOLL.scale.setScalar(K * 0.28); setFace(DOLL, 'happy');
    const h = wpos(GIRL.userData.head); return { cam: C([h.x + 50, h.y + 10, h.z + 90], [h.x, h.y - 10, h.z], 100), ap: 0.0006 }; } },
  // 31 — the whisper: "Shhh. Don't make noise, or the sky will hear"
  { a: 97.23, b: 101.56, run(t) { night(); show(GIRL, -120, 18, -150, 0); GIRL.scale.setScalar(K); setFace(GIRL, 'worry'); GIRL.userData.head.rotation.set(0.15, 0.2, 0); shhPose(GIRL); GIRL.userData.arms[0].rotation.set(-1.4, 0, 0.5); DOLL.visible = true; const hp = hand(GIRL, 0); show(DOLL, hp.x + 2, hp.y - 4, hp.z + 3, 0.4); DOLL.scale.setScalar(K * 0.28); setFace(DOLL, 'happy');
    const h = wpos(GIRL.userData.head); const k = prog(t, 97.23, 101.56); return { cam: C([h.x + 8, h.y + 2, h.z + 46 - k * 10], [h.x, h.y - 6, h.z], 42), ap: 0.0012 }; } },
  // 32 — through her window: an eye, bigger than everything
  { a: 101.56, b: 106.51, run(t) { night(); EYE2.visible = true; eyeOpen(ss(prog(t, 102.2, 103.2))); EYE2.position.x = Math.sin(t * 0.7) * 4; EYE2.position.y = Math.cos(t * 0.5) * 3; const k = prog(t, 101.56, 106.51);
    return { cam: C([lerp(90, 150, k), 85, 40], [209, 85, 40], lerp(120, 60, k)), ap: 0.0006, bloom: 0.6 }; } },
  // 33 — "There's always someone listening."
  { a: 106.51, b: 999, run(t) { night(); EYE2.visible = true; eyeOpen(1); return { cam: C([180, 85, 40], [209, 85, 40], 30), ap: 0.0006, bloom: 0.7, fx: () => { const k = prog(t, 106.6, 107.6); O.fillStyle = `rgba(0,0,0,${0.75 * k})`; O.fillRect(0, 0, W, H); titleLine('SEMPRE TEM', 760, popT(t, 106.7), 100, '#ffffff'); titleLine('ALGUÉM ESCUTANDO.', 900, popT(t, 107.0), 100, '#ff5fa2'); if (t > 108.6) titleLine('VOCÊ FARIA BARULHO? 👇', 1060, popT(t, 108.6), 60, '#ffd23f'); } }; } },
];

function renderFrame(i) {
  const t = i / 24, f = i * 1.25; reset();
  const sh = SH.find((s) => t >= s.a && t < s.b) || SH[SH.length - 1];
  const R = sh.run(t);
  let [px, py, pz] = R.cam.p; px += Math.sin(t * 1.1) * 0.012 * R.cam.d; py += Math.cos(t * 0.9) * 0.008 * R.cam.d;
  const sk = (R.shake || 0) * 0.03 * Math.max(1, R.cam.d / 6) ** 0.5; const r = rng(i * 7 + 1); px += (r() - 0.5) * sk; py += (r() - 0.5) * sk;
  camera.position.set(px, py, pz); camera.lookAt(...R.cam.l);
  key.position.set(60, 160, 80); key.target.position.set(0, 0, 0); key.target.updateMatrixWorld(); key.shadow.camera.left = -60; key.shadow.camera.right = 60; key.shadow.camera.top = 60; key.shadow.camera.bottom = -60; key.shadow.camera.far = 400; key.shadow.camera.updateProjectionMatrix();
  bloom.strength = R.bloom ?? 0.4; bokeh.uniforms.focus.value = R.cam.d; bokeh.uniforms.aperture.value = R.ap ?? 0.002;
  composer.render();
  O.globalCompositeOperation = 'source-over'; O.globalAlpha = 1; O.drawImage(renderer.domElement, 0, 0);
  if (R.fx) R.fx();
  const v = O.createRadialGradient(W / 2, H * 0.45, W * 0.4, W / 2, H / 2, H * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(5,0,15,.5)'); O.fillStyle = v; O.fillRect(0, 0, W, H);
  return out.toDataURL('image/jpeg', 0.9);
}
window.renderFrame = renderFrame; window.ready = true;
