// Peças de tela do formato "N dias de…" (ver PADRAO-DIAS.md): contador no canto,
// selo "DIA N" no centro, piscada (microcochilo / apagão) e cartão final com pergunta.
import { suave, salto, lim, mistura } from './motor.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

/**
 * Contador no canto superior esquerdo.
 * hud(lt, { rotulo: 'HORAS ACORDADO', de: 0, ate: 24, dia: 1, limites: [24, 72],
 *          cores: ['#fff', '#FFD21F', '#FF5A4E'], confuso: false, dur: 1.2 })
 * Conta de `de` até `ate` em `dur` s. `confuso` mostra "??" e "DIA N?".
 */
export function hud(lt, o) {
  const { rotulo, de, ate, dia, limites = [10, 20], cores = ['#FFFFFF', '#FFD21F', '#3DDC84'], confuso = false, dur = 1.2 } = o;
  const n = Math.round(mistura(de, ate, suave(lt / dur)));
  const cor = n >= limites[1] ? cores[2] : n >= limites[0] ? cores[1] : cores[0];
  const num = confuso ? '??' : n;
  const d = confuso ? `DIA ${dia}?` : `DIA ${dia}`;
  return `<div style="position:absolute;left:28px;top:34px;background:rgba(10,12,20,.72);border-radius:14px;padding:10px 18px 8px;font-family:Inter,sans-serif">
    <div style="color:#C9D2E3;font-weight:800;font-size:15px;letter-spacing:1px">${esc(rotulo)}</div>
    <div style="display:flex;align-items:baseline;gap:22px"><span style="color:${cor};font-weight:900;font-size:56px;line-height:1">${num}</span>
    <span style="color:#fff;font-weight:900;font-size:22px">${esc(d)}</span></div></div>`;
}

/** Selo grande "DIA N" no centro (aparece e some no começo do bloco). */
export function selo(lt, texto, cor = '#FFD21F') {
  if (lt > 1.3) return '';
  const k = Math.max(0.01, salto(lt / 0.25)), op = 1 - lim((lt - 1.0) / 0.3);
  return `<div style="position:absolute;left:50%;top:430px;transform:translate(-50%,0) scale(${k});opacity:${op};
    border:5px solid ${cor};border-radius:16px;background:rgba(10,12,20,.8);padding:6px 34px;
    color:#fff;font-family:Inter,sans-serif;font-weight:900;font-size:76px;white-space:nowrap">${esc(texto)}</div>`;
}

/** Tela preta por cima (piscada / microcochilo / apagão). op = 0..1 */
export function breu(op) {
  if (op <= 0.001) return '';
  return `<div style="position:absolute;inset:0;background:#000;opacity:${lim(op)}"></div>`;
}

/** Piscada de olho: fecha e abre em `dur` s a partir de `ini` (devolve a opacidade). */
export function piscada(lt, ini, dur = 0.9) {
  const u = (lt - ini) / dur;
  if (u < 0 || u > 1) return 0;
  return u < 0.25 ? u / 0.25 : u < 0.7 ? 1 : 1 - (u - 0.7) / 0.3;
}

/**
 * Cartão final: pergunta para comentar + balão de comentário + chamada extra.
 * finalPergunta(lt, ['QUANTAS HORAS VOCÊ', '*JÁ FICOU ACORDADO?*'], 'ME SEGUE!', tExtra)
 */
export function finalPergunta(lt, linhas, extra, tExtra) {
  const k = Math.max(0.01, salto(lt / 0.35));
  const txt = linhas.map((l) => l.replace(/\*([^*]+)\*/g, '<span style="color:#FFD21F">$1</span>')).join('<br>');
  const ex = extra && lt > tExtra ? `<div style="margin-top:14px;color:#FFD21F;font-size:40px;transform:scale(${Math.max(0.01, salto((lt - tExtra) / 0.3))})">${esc(extra)}</div>` : '';
  return `<div style="position:absolute;left:50%;top:120px;transform:translate(-50%,0) scale(${k});width:600px;text-align:center;
    background:rgba(10,12,20,.82);border-radius:20px;padding:20px 18px;font-family:Inter,sans-serif;font-weight:900;color:#fff;font-size:38px;line-height:1.15">
    ${txt}${ex}
    <div style="position:absolute;right:-14px;bottom:-30px;background:#fff;color:#111;border-radius:16px;padding:0 16px;font-size:40px;line-height:52px">•••</div></div>`;
}
