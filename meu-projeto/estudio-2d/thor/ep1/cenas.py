import sys, os, math
sys.path.insert(0, os.path.expanduser('~/vid')); sys.path.insert(0, os.path.expanduser('~/vid/lib'))
from thor_comum import *
from render import Video, main

PROJ = os.path.dirname(os.path.abspath(__file__))
THOR, PAI, JULIA = elenco(PROJ)


def s_acorda(c, t, S):
    cenario(c, 'sala', t, luz=False)
    acordou = t > S.at('n1') + S.v.dur['n1'] * .8
    sombra(c, XT, 90)
    pessoa(c, t, S, THOR, XT, s=ST_T, face=.2, eyes='wide' if acordou else 'closed', mouth='o' if acordou else 'flat',
           squash=.12 * math.sin(K(t, S.at('n1') + S.v.dur['n1'] * .8, .3) * math.pi), sparkle=0)
    if not acordou:
        for i in range(3):
            k = (t * .6 + i / 3) % 1; label(c, 'z', XT + 60 + k * 70, 520 - k * 140, 50 + 30 * k, '#FFFFFF', font=MARKER, alpha=1 - k, skew=0)
    cenario_luz(c, 'sala')


def s_julia_close(fala, eyes='wide', mouth_rest='o', sweat=False):
    def d(c, t, S):
        close(c, t, S, 'sala', JULIA, fala, face=.6, eyes=eyes, rest=mouth_rest, brow=.8, brow_tilt=-.4,
              arms=('down', ('down', 'chin', K(t, S.s0 + .1, .3))), sweat=(t - S.s0) if sweat else -1, light=1, rim='#FFE6B0')
    d.__name__ = 'julia_' + fala; return d


def s_thor_close(fala, eyes='dot', rest='smirk', dx=-300):
    def d(c, t, S):
        close(c, t, S, 'sala', THOR, fala, face=-.55, s=2.0, dx=dx, eyes=eyes if not blink(t, 2.3) else 'closed', rest=rest, brow=.3, light=-1, rim='#FFE6B0')
    d.__name__ = 'thor_' + fala; return d


def s_familia(c, t, S):
    cenario(c, 'sala', t, luz=False)
    k = ease_out(K(t, S.s0 + .1, 1.4)); ph = (t - S.s0) * 11; anda = k < .98
    for spec, x0, x1, f in ((JULIA, 300, XJ, .5), (PAI, 1620, XP, -.5)):
        x = lerp(x0, x1, k); sombra(c, x)
        pessoa(c, t, S, spec, x, face=f, eyes='wide', mouth='o', legs=walk_legs(ph) if anda else None, bob=7 * abs(math.sin(ph)) if anda else 2)
    sombra(c, XT, 90); pessoa(c, t, S, THOR, XT, s=ST_T, face=0, mouth='smirk', eyes='half')
    cenario_luz(c, 'sala')


def s_pai_close(c, t, S):
    close(c, t, S, 'sala', PAI, 'p1', face=-.6, dx=-600, eyes='wide', rest='o', brow=1, brow_tilt=-.6,
          arms=(('down', 'push', K(t, S.s0, .3)), 'down'), sweat=(t - S.s0) * 1.2, light=1, rim='#FFE6B0')


def s_cozinha(c, t, S):
    cenario(c, 'cozinha', t, luz=False)
    microondas(c, 1060, 610)
    k = K(t, S.at('t3+0.6'), .5)
    if k > 0:
        for i in range(3): chocolate(c, 1180 + i * 40, 590 - i * 34 - 30 * pop(K(t, S.at('t3+0.6') + i * .25, .3)), rot=-8 + i * 6)
    cenario_luz(c, 'cozinha')
    counter(c, 1180, 330, t, S.at('t3:fim-1.2'), .6, 3, fmt='{:.0f}', size=90, sub='BARRAS')


def s_risada(c, t, S):
    cenario(c, 'sala', t, luz=False)
    vira = t > S.at('n3') + S.v.dur['n3'] * .5
    sombra(c, XJ); pessoa(c, t, S, JULIA, XJ, face=.4, eyes='closed', mouth='open', arms=('down', 'hip'), bob=4 * abs(math.sin(t * 9)))
    sombra(c, XP); pessoa(c, t, S, PAI, XP, face=-.4, eyes='half', mouth='flat', arms=('pocket', 'down'))
    sombra(c, XT, 90); pessoa(c, t, S, THOR, XT, s=ST_T, face=-.8 if vira else .2, eyes='half' if vira else 'dot', mouth='smirk')
    cenario_luz(c, 'sala')


def s_final(c, t, S):
    cenario(c, 'sala', t, luz=False)
    sombra(c, XJ); pessoa(c, t, S, JULIA, XJ, face=.4, eyes='wide', mouth='o', sweat=(t - S.s0))
    sombra(c, XP); pessoa(c, t, S, PAI, XP, face=-.4, eyes='wide', mouth='flat', sweat=(t - S.s0) * 1.2)
    sombra(c, XT, 90); pessoa(c, t, S, THOR, XT, s=ST_T, face=0, eyes='half', mouth='smirk', sparkle=(t - S.at('n4+1.2')) / .3 if t > S.at('n4+1.2') else 0)
    cenario_luz(c, 'sala')


SEQ = [
    dict(draw=s_acorda, falas=['n1'], tag='SEGUNDA · 7H', focus_v=(XT, 700), zoom_v=(.95, 1.08), sfx=[('pop', 'n1:fim-0.6', .6)]),
    dict(draw=s_julia_close('j1'), falas=['j1'], focus_v=(1010, 620), zoom_v=(.86, .92), whip=True),
    dict(draw=s_thor_close('t1'), falas=['t1'], focus_v=(960, 640), zoom_v=(.86, .92)),
    dict(draw=s_familia, falas=['n2'], focus_v=(XT, 700), zoom_v=(.64, .7), sfx=[('steps', 0.1, .5)]),
    dict(draw=s_thor_close('t2', eyes='half'), falas=['t2'], focus_v=(960, 640), zoom_v=(.86, .92), whip=True),
    dict(draw=s_pai_close, falas=['p1'], focus_v=(1010, 620), zoom_v=(.86, .92), shake=['p1+0.1']),
    dict(draw=s_cozinha, falas=['t3'], focus_v=((1000, 560), (1180, 520)), zoom_v=(1.0, 1.08), tag='ATRÁS DO MICRO-ONDAS', sfx=[('pop', 't3+0.6', .6), ('pop', 't3+0.85', .6), ('pop', 't3+1.1', .6)]),
    dict(draw=s_risada, falas=['n3'], focus_v=(XT, 700), zoom_v=(.64, .7)),
    dict(draw=s_thor_close('t4', eyes='half', rest='smirk', dx=-900), falas=['t4'], focus_v=(960, 640), zoom_v=(.86, .94), sfx=[('ding', 't4:fim-0.2', .5)]),
    dict(draw=s_julia_close('j2', eyes='wide', mouth_rest='flat', sweat=True), falas=['j2'], focus_v=(1010, 620), zoom_v=(.86, .92), shake=['j2+0.05']),
    dict(draw=s_final, falas=['n4'], hold=1.2, focus_v=(XT, 700), zoom_v=(.66, .74),
         polaroid=dict(at='n4:fim+0.1', text='ELE VÊ TUDO...', ring=(XT, 640))),
]

if __name__ == '__main__':
    main(Video(PROJ, SEQ))
