import sys, os, math
sys.path.insert(0, os.path.expanduser('~/vid')); sys.path.insert(0, os.path.expanduser('~/vid/lib'))
from thor_comum import *
from render import Video, main

PROJ = os.path.dirname(os.path.abspath(__file__))
THOR, PAI, JULIA = elenco(PROJ)
CL = dict(focus_v=(1010, 620), zoom_v=(.86, .92))
CT = dict(focus_v=(960, 600), zoom_v=(.84, .9))
WIDE = dict(focus_v=(XT, 700), zoom_v=(.64, .7))


def grupo(c, t, S, ej='dot', mj='smile', ep='dot', mp='smile', et='half', mt='smirk', ft=0.0, cen='sala', **kw):
    cenario(c, cen, t, luz=False)
    sombra(c, XJ); pessoa(c, t, S, JULIA, XJ, face=.4, eyes=ej, mouth=mj, **kw.get('j', {}))
    sombra(c, XP); pessoa(c, t, S, PAI, XP, face=-.4, eyes=ep, mouth=mp, **kw.get('p', {}))
    sombra(c, XT, 90); pessoa(c, t, S, THOR, XT, s=ST_T, face=ft, eyes=et, mouth=mt, **kw.get('t', {}))
    cenario_luz(c, cen)


def s_abre(c, t, S):
    grupo(c, t, S, ej='half', mj='flat', ep='half', mp='flat', p={'arms': ('hip', 'hip')})
    counter(c, XT, 330, t, S.at('n1+0.3'), 1.0, 23, fmt='{:.0f}H', size=110, sub='DE FALA')


def s_pai(fala, eyes='dot', rest='smile', **kw):
    def d(c, t, S): close(c, t, S, 'sala', PAI, fala, face=-.6, dx=-600, eyes=eyes, rest=rest, light=1, rim='#FFE6B0', **kw)
    d.__name__ = 'pai_' + fala; return d


def s_thor(fala, eyes='half', rest='smirk', **kw):
    def d(c, t, S): close(c, t, S, 'sala', THOR, fala, face=-.55, s=2.0, eyes=eyes if not blink(t, 2.3) else 'closed', rest=rest, brow=.3, light=-1, rim='#FFE6B0', **kw)
    d.__name__ = 'thor_' + fala; return d


def s_picanha(c, t, S):
    s_thor('t1')(c, t, S)


def s_julia(c, t, S):
    close(c, t, S, 'sala', JULIA, 'j1', face=.6, eyes='dot', rest='flat', brow=.6, brow_tilt=.9, arms=('hip', 'hip'), light=1, rim='#FFE6B0')


def s_olha(c, t, S): grupo(c, t, S, ej='wide', mj='o', ep='half', mp='flat', ft=-.5)


def s_prova(c, t, S):
    table_top(c)
    k = back(K(t, S.s0 + .05, .5), 1.3); prova(c, lerp(-300, 960, k), 560, (t - S.at('t2:fim-1.0')) / .9)


def s_pai_choque(c, t, S):
    close(c, t, S, 'sala', PAI, 'p2', face=.6, dx=-600, eyes='wide', rest='o', brow=1, brow_tilt=.8, arms=(('down', 'present', K(t, S.s0, .3)), 'down'), light=1, rim='#FFE6B0')


def s_celular(c, t, S):
    grupo(c, t, S, ej='wide', mj='o', ep='wide', mp='o', ft=0, p={'sweat': (t - S.s0) * 1.2}, j={'sweat': (t - S.s0)})
    k = back(K(t, S.at('n3') + S.v.dur['n3'] * .45, .4), 1.4)
    if k > 0: c.save(); c.translate(XT, 700); c.scale(k, k); c.translate(-XT, -700); celular_ligacao(c, XT + 10, 640, t, S.s0); c.restore()


SEQ = [
    dict(draw=s_abre, falas=['n1'], tag='SEGUNDA · 8H', **WIDE),
    dict(draw=s_pai('p1', arms=('down', 'present')), falas=['p1'], **CL),
    dict(draw=s_picanha, falas=['t1'], **CT, sfx=[('kaching', 't1+0.2', .5)]),
    dict(draw=s_julia, falas=['j1'], **CL, shake=['j1+0.1']),
    dict(draw=s_olha, falas=['n2'], **WIDE),
    dict(draw=s_prova, falas=['t2'], rot=2, vig=.46, focus_v=(960, 560), zoom_v=(.95, 1.02), sfx=[('paper', 0.1, .8)], shake=['t2:fim-1.0']),
    dict(draw=s_pai_choque, falas=['p2'], **CL, shake=['p2+0.05']),
    dict(draw=s_thor('t3'), falas=['t3'], **CT, sfx=[('ding', 't3:fim-0.3', .5)]),
    dict(draw=s_celular, falas=['n3'], hold=1.2, **WIDE, sfx=[('notif', 'n3+1.0', .7)],
         polaroid=dict(at='n3:fim+0.1', text='A MÃE OUVIU TUDO...', ring=(XT + 10, 640))),
]

if __name__ == '__main__':
    main(Video(PROJ, SEQ))
