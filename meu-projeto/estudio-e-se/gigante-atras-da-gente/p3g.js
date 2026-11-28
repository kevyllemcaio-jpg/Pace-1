
// ---------- one continuous shot: camera keyframes + world state by time (24 fps)
for (let i = 0; i < 8; i++) { const o = [['#ffdbac', '#7f4f24', 'short', '#3a86ff'], ['#c68642', '#000', 'buns', '#ff8fab'], ['#8d5524', '#1b1b1b', 'short', '#8ce95a'], ['#f1c27d', '#3b2416', 'long', '#c77dff'], ['#e0ac69', '#000', 'pony', '#ffd23f'], ['#ffdbac', '#d4a373', 'short', '#ff5fa2'], ['#8d5524', '#2b1d14', 'bob', '#4cc9f0'], ['#f1c27d', '#3b2416', 'short', '#ff8c42']][i]; const k = blocky({ skin: o[0], hair: o[1], style: o[2], top: o[3], legs: '#2b2d42', shoes: '#fff', hands: o[0] }); k.userData.sc = TS; scene.add(k); TPEOPLE.push(k); }
const TROPE = M(new THREE.CylinderGeometry(0.0015, 0.0015, 0.06, 4), mat('#ff5fa2')); scene.add(TROPE);
const yME = (t) => (t < 62.1 ? 3 + t * 0.02 : t < 80 ? lerp(3 + 62.1 * 0.02, TY - 1.0, ss(prog(t, 62.1, 79.5))) : TY - 1.0);
const yN = (t) => 5.0 + Math.min(t, 62.1) * 0.02;
const ORL = [4, 5.68];
// camera keys: [t, px,py,pz, lx,ly,lz, focus]
const KEYS = (() => {
  const m = (t) => yME(t), K = [];
  K.push([0, 0.5, m(0) + 1.75, 2.4, 0, m(0) + 1.62, 0.55, 1.9]);
  K.push([2.3, 1.2, m(2.3) + 0.6, 6.5, 0, -12, 2, 14]);
  K.push([4.64, 4, 3, 15, 0, 9, 0, 14]);
  K.push([8, 2.2, 6.5, 9, 0, 8, 0, 9]);
  K.push([10.38, -1.6, 8.6, 5.2, -3, 8.4, 0.5, 5]);
  K.push([12.4, 5.2, 12.4, 5.4, 4, 12, 0.5, 5]);
  K.push([14.4, 0.5, 18.4, 8.4, 0.5, 17.4, 0.5, 8]);
  K.push([16.06, 0.2, 21.6, 5.4, -1.5, 21.2, 0.5, 5]);
  K.push([21.3, -0.6, 21.5, 3.4, -1.5, 21.3, 0.9, 2.6]);
  K.push([22.09, 2, 12, 12, 0, -14, 2, 22]);
  K.push([24.6, 1, -3, 10, 0, -14, 6, 10]);
  K.push([26.33, 2.0, m(26.33) + 1.6, 5.2, 0.45, m(26.33) + 2.0, 0.4, 5]);
  K.push([29.2, 1.9, m(29.2) + 2.4, 4.6, 0.45, m(29.2) + 2.3, 0.4, 4.4]);
  K.push([31.45, 1.9, yN(31.45) + 1.75, 2.8, 0.9, yN(31.45) + 1.62, 0.55, 2.3]);
  K.push([35.0, 1.7, yN(35) + 1.7, 3.0, 0.9, yN(35) + 1.62, 0.55, 2.5]);
  K.push([36.19, 1.2, 9, 9, 0, 60, 0, 30]);
  K.push([39.2, 2.5, 3, 15, 0, -16, 7, 20]);
  K.push([43.03, 6.8, 6.8, 6.2, 4, 6.4, 0.3, 6]);
  K.push([46.4, 5.6, 7.3, 3.8, 4, 7.2, 0.4, 3.6]);
  K.push([49.8, 5.4, 7.4, 3.2, 4, 7.3, 0.5, 3]);
  K.push([52.25, 8, 6, 16, 3, 3, 0, 16]);
  K.push([57.4, 6.5, 6.4, 11, 3.6, 5, 0, 10]);
  K.push([59.16, 1.9, yN(59.16) + 1.75, 2.8, 0.9, yN(59.16) + 1.62, 0.55, 2.3]);
  for (let t = 62.1; t <= 80.01; t += 2.2) { const k = prog(t, 67.33, 73.89) * (1 - prog(t, 73.89, 76)); K.push([t, lerp(2.6, 0.9, k), m(t) + lerp(1.6, 1.4, k), lerp(7, 2.4, k), 0, m(t) + 1.4 + k * 0.4, 0, lerp(7, 2.4, k)]); }
  K.push([80.35, -0.7, TY + 0.5, 2.4, 0.5, TY + 0.15, 0.1, 2.4]);
  K.push([83.53, 0.95, TY + 0.16, 0.8, 0.55, TY + 0.04, 0.05, 0.78]);
  K.push([87.0, 0.75, TY + 0.1, 0.48, 0.45, TY + 0.05, 0.05, 0.47]);
  K.push([90.39, 0.5, TY + 0.08, 0.32, 0.33, TY + 0.03, 0.05, 0.3]);
  K.push([93.0, 0.42, TY + 0.04, 0.13, 1.0, TY + 0.6, 0.8, 0.95]);
  K.push([96.63, 0.45, TY + 0.03, 0.11, 1.0, TY + 0.62, 0.85, 1.0]);
  K.push([100.58, 2.6, TY + 0.9, 4.6, 0.8, TY + 0.3, 0.5, 4.6]);
  K.push([104.5, 18, 70, 175, 0, 40, 0, 175]);
  K.push([112, 20, 66, 195, 0, 38, 0, 195]);
  return K;
})();
function camAt(t) { // Catmull-Rom through the keys, eased per span
  let i = 0; while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++;
  const a = KEYS[Math.max(0, i - 1)], b = KEYS[i], c = KEYS[i + 1], d = KEYS[Math.min(KEYS.length - 1, i + 2)];
  const u = ss(clamp((t - b[0]) / (c[0] - b[0])));
  return [1, 2, 3, 4, 5, 6, 7].map((j) => lerp(b[j], c[j], u));
}
function reset() {
  for (const o of BASE) o.visible = false;
  for (const o of [ME, NINA, ORLANDO, BABY, PACK, APPLE, BOARD, TIE, GIANT, GHAND, TROPE, ...FOLK, ...TPEOPLE]) o.visible = false;
  for (const k of [ME, NINA, ORLANDO, BABY, GIANT, ...FOLK, ...TPEOPLE]) { k.userData.body.rotation.set(0, 0, 0); k.userData.body.position.set(0, 0, 0); k.userData.head.rotation.set(0, 0, 0); }
  heroLight.intensity = 0; portalLight.intensity = 0; fill.intensity = 0; lantern.intensity = 0; tinyLight.intensity = 0;
}
function world(t, f) {
  const night = t >= 62.1; const nk = ss(prog(t, 60.5, 63.5));
  scene.background = new THREE.Color().lerpColors(new THREE.Color('#9fd8ff'), new THREE.Color('#0b1030'), nk);
  scene.fog.color.copy(scene.background); scene.fog.near = 30; scene.fog.far = lerp(140, 110, nk);
  /*late*/ if (false) { scene.fog.near = 250; scene.fog.far = 700; hemi.intensity = lerp(0.55, 0.95, prog(t, 101, 104)); key.intensity = lerp(0.35, 0.9, prog(t, 101, 104)); }
  hemi.color.lerpColors(new THREE.Color('#fff4e0'), new THREE.Color('#5d6bd6'), nk); hemi.groundColor.set('#8a5a3a'); hemi.intensity = lerp(1.1, 0.55, nk);
  key.color.lerpColors(new THREE.Color('#fff0d6'), new THREE.Color('#9fb4ff'), nk); key.intensity = lerp(1.7, 0.35, nk);
  if (t > 101) { scene.fog.near = 250; scene.fog.far = 700; hemi.intensity = lerp(0.55, 0.95, prog(t, 101, 104)); key.intensity = lerp(0.35, 0.9, prog(t, 101, 104)); }
  CLOUDS.children.forEach((c, i) => (c.position.x += Math.sin(t * 0.1 + i) * 0.004));
  // the hanging town (day)
  const yme = yME(t);
  onWall(ME, t >= 78 ? lerp(0, 1.0, prog(t, 78, 80)) : 0, yme, t, { e: t < 2.3 ? 'worry' : night ? 'stern' : 'happy', sp: night && t < 80 ? 9 : 4, amt: night && t < 80 ? 1 : 0.5, look3: t < 2.3 ? [0.25, 2.5] : t >= 80.35 ? [0.7, 0] : null });
  if (t >= 80.35) { ME.position.z = lerp(0.55, 0.9, prog(t, 80.35, 83)); ME.userData.arms[1].rotation.set(-1.2, 0, 0.2); ME.userData.arms[0].rotation.set(-2.6, 0, 0.1); ME.userData.head.rotation.set(0.55, 0, 0); setFace(ME, t < 96.6 ? 'surprised' : 'shock'); }
  if (!night) {
    onWall(NINA, 0.9, yN(t), t, { ph: 1, sp: 3, amt: 0.4, e: t > 31.4 && t < 36.2 ? 'happyc' : t > 59 ? 'stern' : 'happy', look3: (t > 31.4 && t < 36.2) || t > 59 ? [0.15, 2.4] : null });
    TIE.visible = true; TIE.position.set(0.45, (yme + yN(t)) / 2 + 1.0, 0.45); TIE.scale.y = (yN(t) - yme + 0.8); TIE.rotation.z = -0.35;
    // eaters, school rope + teacher, sleepers, parent with baby
    onWall(FOLK[0], -3.2, 7.0, t, { amt: 0.1, e: 'happyc' }); FOLK[0].userData.arms[1].rotation.set(-1.4, 0, -0.6); APPLE.visible = true; { const h = hand(FOLK[0], 1); APPLE.position.set(h.x, h.y + 0.1, h.z + 0.1); }
    onWall(FOLK[1], -2.4, 6.8, t, { amt: 0.1, e: 'happy', look3: [0, 0.5] });
    [3, 4, 5, 6].forEach((j, i) => onWall(FOLK[j], 3.4, 10.4 + i * 0.9, t, { ph: i, amt: 0.2, e: 'happy', look3: [0, 0.5] }));
    onWall(FOLK[7], 4.6, 12.2, t, { amt: 0.1, e: 'stern', look3: [0, -0.6] }); BOARD.visible = true; BOARD.position.set(4.2, 13.4, 0.5);
    HAMMOCKS.forEach((hm, i) => { hm.rotation.z = Math.sin(t * 0.8 + i) * 0.04; const k = [FOLK[9], FOLK[2], null][i]; if (!k) return; show(k, hm.position.x - 0.6, hm.position.y - 0.1, 0.5, 0); k.rotation.set(0, 0, -Math.PI / 2); k.scale.setScalar(0.9); setFace(k, 'happyc'); hm.rotation.z = Math.sin(t * 0.8 + i) * 0.04; });
    onWall(FOLK[8], -1.5, 20.2, t, { amt: 0.3, e: 'happy' }); // parent
    PACK.visible = true; PACK.position.set(-1.5, 21.0, 0.98); show(BABY, -1.5, 21.15, 1.1, 0); BABY.scale.setScalar(0.4); setFace(BABY, 'happy'); BABY.userData.arms[0].rotation.set(-2.6, 0, 0.3); BABY.userData.arms[1].rotation.set(-2.6, 0, -0.3);
    // old Orlando: sits on his ledge from 43s, waves, and is gone after the hand passes
    const gone = t > 55.2;
    if (!gone) { show(ORLANDO, ORL[0], ORL[1], 0.6, t > 43 ? 0 : Math.PI); ORLANDO.scale.setScalar(1.15); if (t > 43) { ORLANDO.userData.body.position.y = -0.42; for (const lg of ORLANDO.userData.legs) lg.rotation.x = -1.4; ORLANDO.userData.arms[1].rotation.set(-0.3, 0, 2.4 + Math.sin(t * 6) * 0.3); setFace(ORLANDO, 'happyc'); } else { climbPose(ORLANDO, t, 2, 0.3); } }
  }
  // the giant below, always looking up
  GIANT.visible = t < 62.1 || t > 100;
  show(GIANT, 2, -46 + Math.sin(t * 0.4) * 0.8, 10, Math.PI); GIANT.scale.setScalar(16); climbPose(GIANT, t * 0.3, 1, 0.4); GIANT.userData.head.rotation.set(-1.1, 0, 0); setFace(GIANT, 'stern');
  // the hand passes over Orlando's ledge
  if (t > 52.25 && t < 58) { GHAND.visible = true; const k = prog(t, 52.6, 57.4); GHAND.scale.setScalar(6); GHAND.position.set(lerp(10, 2, k), lerp(-10, 9, Math.sin(k * Math.PI) * 0.6 + k * 0.4), 1.6); GHAND.rotation.set(-0.3, 0, lerp(0.6, -0.4, k)); }
  // night: lantern on the climber; the tiny people above
  if (night) { lantern.position.set(1.2, yme + 2.4, 3.2); lantern.intensity = t > 80 ? 0.5 : 1.6; }
  const tinyOn = t > 79;
  if (tinyOn) {
    tinyLight.position.set(0.55, TY + 0.12, 0.22); tinyLight.intensity = 0.05;
    TPEOPLE.forEach((k, i) => { const x = 0.55 - 0.22 + i * 0.06, y = TY + (i % 3) * 0.05 - 0.04; show(k, x, y, 0.04, Math.PI); k.scale.setScalar(TS); climbPose(k, t + i, 6, 0.6); setFace(k, 'happy'); });
    const boy = TPEOPLE[0], girl = TPEOPLE[1]; show(boy, 0.3, TY - 0.06, 0.04, Math.PI); boy.scale.setScalar(TS); show(girl, 0.36, TY - 0.03, 0.04, Math.PI); girl.scale.setScalar(TS);
    boy.userData.arms[1].rotation.set(-1.4 + Math.sin(t * 8) * 0.2, 0, -0.6); TROPE.visible = true; TROPE.position.set(0.33, TY + 0.02, 0.06); TROPE.rotation.z = 1.1;
    if (t > 88.6) { boy.userData.head.rotation.set(0.9, 2.6, 0); setFace(boy, 'shock'); }
  }
  return { night };
}

function renderFrame(i) {
  const t = i / 24, f = i * 1.25; reset();
  const W0 = world(t, f);
  const c = camAt(t); camera.position.set(c[0], c[1], c[2]); camera.lookAt(c[3], c[4], c[5]);
  key.position.set(c[3] + 12, c[4] + 20, 25); key.target.position.set(c[3], c[4], 0); key.target.updateMatrixWorld();
  Object.assign(key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 0.5, far: 80 }); key.shadow.camera.updateProjectionMatrix();
  bloom.strength = W0.night ? 0.55 : 0.3; bokeh.uniforms.focus.value = c[6]; bokeh.uniforms.aperture.value = c[6] < 1 ? 0.004 : c[6] < 4 ? 0.006 : 0.002;
  composer.render();
  O.globalCompositeOperation = 'source-over'; O.globalAlpha = 1; O.drawImage(renderer.domElement, 0, 0);
  // the buzz (73.9–90): fine wavering lines
  if (t > 74.5 && t < 90) { const a = Math.min(1, prog(t, 74.5, 76)) * (1 - prog(t, 88, 90)); O.strokeStyle = `rgba(255,255,255,${0.25 * a})`; O.lineWidth = 2; for (let k = 0; k < 5; k++) { O.beginPath(); for (let x = 0; x <= W; x += 20) O.lineTo(x, H * 0.3 + k * 120 + Math.sin(x * 0.05 + t * 30 + k) * 6); O.stroke(); } }
  if (t < 1.4) titleLine('O GIGANTE', 300, backOut(clamp(t / 0.3)), 120, '#ffffff');
  if (t > 105.6) { const k = prog(t, 105.6, 107.2); O.fillStyle = `rgba(0,0,0,${0.7 * k})`; O.fillRect(0, 0, W, H); titleLine('QUEM EU ALCANÇO...', 820, backOut(clamp((t - 106) / 0.3)), 84, '#ffffff'); titleLine('SOME PRA SEMPRE.', 960, backOut(clamp((t - 106.8) / 0.3)), 92, '#ff5fa2'); }
  const v = O.createRadialGradient(W / 2, H * 0.45, W * 0.42, W / 2, H / 2, H * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(10,5,20,.45)'); O.fillStyle = v; O.fillRect(0, 0, W, H);
  return out.toDataURL('image/jpeg', 0.9);
}
window.renderFrame = renderFrame; window.ready = true;
