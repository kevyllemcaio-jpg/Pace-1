// Interface do SISTEMA de RPG (HTML por cima do 3D): CSS das legendas, painéis holográficos,
// barras de atributo, etiquetas presas em pontos 3D, texto grande da cena e efeito glitch.
import * as THREE from 'three';
import { lim, salto } from './motor.js';

export const CSS = `<style>
.legenda{text-transform:uppercase;font-family:Inter,sans-serif;font-weight:900;font-size:52px;letter-spacing:.5px}
.hud{position:absolute;font-family:Inter,sans-serif;color:#fff;font-weight:800;border:3px solid #9AE6FF;border-radius:18px;
 background:linear-gradient(180deg,rgba(46,128,214,.62),rgba(18,62,140,.62));box-shadow:0 0 32px rgba(80,190,255,.75),inset 0 0 22px rgba(140,225,255,.35);padding:22px 26px}
.hud .t{font-size:26px;letter-spacing:3px;color:#BFF0FF;margin-bottom:12px}
.hud .l{display:flex;align-items:center;gap:14px;font-size:24px;margin:9px 0}
.hud .l span:first-child{width:200px}
.hud .bar{flex:1;height:16px;border-radius:9px;background:rgba(255,255,255,.18);overflow:hidden}
.hud .bar i{display:block;height:100%;background:#7FE0FF;border-radius:9px}
.hud .n{width:56px;text-align:right}
.tela{position:absolute;left:30px;right:30px;top:150px;text-align:center;font-family:Inter,sans-serif;font-weight:900;font-size:58px;line-height:1.1;color:#fff;-webkit-text-stroke:11px #111;paint-order:stroke fill;text-transform:uppercase}
.tela b{color:#FFD21F}
.tag{position:absolute;font-family:Inter,sans-serif;font-weight:900;font-size:24px;color:#fff;padding:8px 16px;border-radius:12px;border:3px solid #9AE6FF;background:rgba(20,70,150,.7);box-shadow:0 0 20px rgba(80,190,255,.7);white-space:nowrap;transform:translate(-50%,-100%)}
</style>`;
export const vinheta = `<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 60%,rgba(0,10,30,.35) 100%);pointer-events:none"></div>`;
/** Texto grande no topo (o "texto na tela" da cena), entra com um pulo. */
export const textoTela = (txt, lt, ini = 0) => (lt < ini ? '' : `<div class="tela" style="transform:scale(${Math.max(0.01, salto((lt - ini) / 0.35))})">${txt}</div>`);
/** Painel do sistema: abre (escala) e fecha. */
export function painel(lt, dur, conteudo, { top = 260, left = 70, w = 580, abre = 0, fecha = null, borda = '#9AE6FF' } = {}) {
  if (lt < abre) return '';
  const fim = fecha ?? dur - 0.25;
  const k = lt > fim ? 1 - lim((lt - fim) / 0.2) : salto((lt - abre) / 0.3);
  if (k <= 0.01) return '';
  return `<div class="hud" style="top:${top}px;left:${left}px;width:${w}px;border-color:${borda};transform:scale(${k},${Math.min(1, k * 1.3)});transform-origin:50% 50%">${conteudo}</div>`;
}
export const linhaAtr = (nome, v, max, cor = '#7FE0FF', txt = v) => `<div class="l"><span>${nome}</span><div class="bar"><i style="width:${Math.min(100, (v / max) * 100)}%;background:${cor}"></i></div><span class="n">${txt}</span></div>`;
export const tag = (camera, pos, html, cor = '#9AE6FF') => {
  const v = new THREE.Vector3(...pos).project(camera);
  if (v.z > 1) return '';
  return `<div class="tag" style="left:${(v.x + 1) * 360}px;top:${(1 - v.y) * 640}px;border-color:${cor}">${html}</div>`;
};
export const glitch = (txt, t) => txt.split('').map((c, i) => (c !== ' ' && Math.sin(t * 40 + i * 7) > 0.6 ? '#$%&?!@'[(i + Math.floor(t * 20)) % 7] : c)).join('');
