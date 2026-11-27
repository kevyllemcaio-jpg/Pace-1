# Peças comuns da mini-série "E se o seu cachorro falasse por 1 dia?" (3 episódios, 9:16).
import sys, os, math
sys.path.insert(0, os.path.expanduser('~/vid/lib'))
from kit import *

XJ, XT, XP = 690, 960, 1230   # posições: Júlia, Thor, Pai (pés em y=1000)
ST_T = .82                     # Thor um pouco menor


def elenco(proj):
    EL = carregar_elenco(proj)
    return EL['thor'], EL['pai'], EL['julia']


def sombra(c, x, w=110):
    c.drawOval(skia.Rect(x - w, 978, x + w, 1020), fp((0, 0, 0), 90, blur=8))


def pessoa(c, t, S, spec, x, fala=None, face=0.0, s=1.0, y=1000, eyes=None, mouth='smile', rest='smile', arms=('down', 'down'), **kw):
    m = S.boca(fala, t, rest) if fala else mouth
    e = eyes or ('closed' if blink(t, 2.5, x * .01) else 'dot')
    draw_char(c, x, y, s, spec, face=face, eyes=e, mouth=m, arms=arms, bob=kw.pop('bob', 1.5 + 1.5 * math.sin(t * 2.3 + x)),
              squash=kw.pop('squash', .05 * math.sin(K(t, S.s0, .25) * math.pi)), **kw)


def close(c, t, S, cen, spec, fala, face, dx=-300, s=2.15, **kw):
    cenario_fundo(c, cen, t, dx)
    pessoa(c, t, S, spec, 960, fala, face=face, s=s, y=1390, **kw)
    add_light(c, 960, 380, 700, '#FFD98A', 30)


def chocolate(c, x, y, rot=0):
    c.save(); c.translate(x, y); c.rotate(rot)
    rect(c, -70, -26, 70, 26, '#5A2E1A', LW * .7, r=6)
    for i in range(4): c.drawLine(-70 + 35 * i, -26, -70 + 35 * i, 26, ink(3, '#3A1C0E'))
    rect(c, -70, -26, -10, 26, '#C8242C', LW * .5, r=4); c.restore()


def microondas(c, x, y):
    rect(c, x - 150, y - 110, x + 150, y, '#DADDE6', LW, r=12); rect(c, x - 130, y - 92, x + 60, y - 18, '#2A3040', LW * .6, r=6)
    for i in range(3): circ(c, x + 104, y - 80 + i * 26, 8, '#8A8A92', LW * .4)


def prova(c, x, y, u, rot=-6):
    c.save(); c.translate(x, y); c.rotate(rot)
    rect(c, -160, -210, 160, 210, '#FFFFFF', LW, r=6)
    label(c, 'PROVA', -120, -150, 54, INK, font=MARKER, skew=0)
    label(c, 'MATEMÁTICA', -120, -100, 34, '#3E6FA8', skew=0)
    for i in range(6): c.drawLine(-120, -40 + i * 40, 120 - (i % 3) * 30, -40 + i * 40, ink(4, '#B8B2A0'))
    c.restore()
    if u > 0: stamp(c, '3', x + 90, y - 90, u, rot=-12, size=170)


def celular_ligacao(c, x, y, t, t0):
    c.save(); c.translate(x, y); c.rotate(-8)
    rect(c, -110, -200, 110, 200, '#16161A', LW, r=26); rect(c, -94, -176, 94, 176, '#2FA25E', 0, r=14)
    circ(c, 0, -80, 46, '#F4EFE2', LW * .5); label(c, 'M', 0, -60, 56, '#2FA25E', font=MARKER, align='center', skew=0)
    label(c, 'MÃE', 0, 20, 48, '#FFFFFF', font=MARKER, align='center', skew=0)
    seg = int(185 + max(0, t - t0)); label(c, f'em ligação  {seg // 60:02d}:{seg % 60:02d}', 0, 66, 26, '#E8FFE8', align='center', skew=0)
    circ(c, 0, 140, 28, '#E04E3A', LW * .5); c.restore()
    if int(t * 2) % 2: add_light(c, x, y, 260, '#7CF29A', 60)
