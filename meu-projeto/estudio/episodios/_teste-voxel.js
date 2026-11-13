const E = [];
let SC = null; const PS = {};
function montar() {
  SC = cenaBase('por');
  SC.add(chao(34, 'grama'));
  SC.add(floresta3D(30, 0.05, 5, 14));
  SC.add(casa3D(5, -9, { rot: -0.4 }));
  ['lucas', 'isabella', 'ryan', 'sophie'].forEach((id) => { PS[id] = criarPersonagem(ELENCO[id]); SC.add(PS[id].raiz); });
}
E.push({ dur: 1, desenhar(lt) {
  if (!SC) montar();
  const xs = { lucas: -1.65, isabella: -0.55, ryan: 0.55, sophie: 1.65 };
  pose(PS.lucas, { t: 0.5, x: xs.lucas, expr: 'neutro', olhar: [8, 0] });
  pose(PS.isabella, { t: 0.5, x: xs.isabella, expr: 'sorriso', olhar: [-6, 0] });
  pose(PS.ryan, { t: 0.5, x: xs.ryan, expr: 'sorriso', acenar: true });
  pose(PS.sophie, { t: 0.5, x: xs.sophie, expr: 'neutro', olhar: [-10, 0] });
  render3D(SC, { pos: [0, 1.7, 13.5], alvo: [0, 1.25, 0], fov: 36 });
  return `<text x="540" y="200" text-anchor="middle" font-family="Anton, sans-serif" font-size="110" fill="#fff" stroke="#2A0810" stroke-width="10" paint-order="stroke">LUA DE SANGUE</text>`;
}});
criarEpisodio(E, {});
