import sys, os, math
sys.path.insert(0, os.path.expanduser('~/vid')); sys.path.insert(0, os.path.expanduser('~/vid/lib'))
from thor_comum import *
from render import Video, main

PROJ = os.path.dirname(os.path.abspath(__file__))
THOR, PAI, JULIA = elenco(PROJ)
CL = dict(focus_v=(1010, 620), zoom_v=(.86, .92))
CT = dict(focus_v=(960, 600), zoom_v=(.84, .9))
WIDE = dict(focus_v=(XT, 700), zoom_v=(.64, .7))


def grupo(c, t, S, ej='dot', mj='smile', ep='dot', mp='smile', et='dot', mt='smile', ft=0.0, xj=XJ, **kw):
    cenario(c, 'quarto', t, luz=False)
    sombra(c, xj); pessoa(c, t, S, JULIA, xj, face=.4, eyes=ej, mouth=mj, **kw.get('j', {}))
    sombra(c, XP); pessoa(c, t, S, PAI, XP, face=-.4, eyes=ep, mouth=mp, **kw.get('p', {}))
    sombra(c, XT, 90); pessoa(c, t, S, THOR, XT, s=ST_T, face=ft, eyes=et, mouth=mt, **kw.get('t', {}))
    cenario_luz(c, 'quarto')


def relogio_grande(c, t, txt, piscar=False):
    if piscar and int(t * 3) % 2: return
    poplabel(c, txt, XT, 330, t, 0, size=120, v='#FF6B6B', rot=0, font=MARKER)


def s_abre(c, t, S):
    grupo(c, t, S, ej='dot', mj='flat', ep='dot', mp='flat')
    relogio_grande(c, t, '23:00')


def s_julia(c, t, S):
    close(c, t, S, 'quarto', JULIA, 'j1', face=.6, eyes='dot', rest='smile', brow=-.2, arms=('down', 'hold'), light=1, rim='#FFE6B0')


def s_thor(fala, eyes='dot', rest='smile', **kw):
    def d(c, t, S): close(c, t, S, 'quarto', THOR, fala, face=-.55, s=2.0, eyes=eyes if not blink(t, 2.3) else 'closed', rest=rest, brow=.2, light=-1, rim='#FFE6B0', **kw)
    d.__name__ = 'thor_' + fala; return d


def s_prende(c, t, S): grupo(c, t, S, ej='wide', mj='o', ep='wide', mp='o', et='dot', mt='flat')


def s_lista(c, t, S):
    s_thor('t2', eyes='half', rest='smirk')(c, t, S)
    for i, (w, txt) in enumerate((('ração', 'RAÇÃO: RUIM'), ('banho', 'BANHO: PIOR'), ('carteiro', 'CARTEIRO: ?!'))):
        poplabel(c, txt, 960, 230 + i * 100, t, S.at('t2') + S.v.dur['t2'] * (0.02 + i * .3), size=72, rot=-4 + i * 3)


def s_pai(c, t, S):
    close(c, t, S, 'quarto', PAI, 'p1', face=-.6, dx=-600, eyes='dot', rest='flat', brow=.4, brow_tilt=-.3, arms=('down', 'present'), light=1, rim='#FFE6B0')


def s_abraco(c, t, S):
    grupo(c, t, S, ej='closed', mj='smile', ep='closed', mp='flat', et='closed', mt='smile', xj=XT - 150,
          j={'arms': ('hold', 'hold')}, p={'sweat': (t - S.s0) * .9, 'arms': ('chin', 'down')})


def s_relogio(c, t, S):
    grupo(c, t, S, ej='wide', mj='o', ep='wide', mp='o', et='wide', mt='o')
    meia = t > S.at('n4') + S.v.dur['n4'] * .35
    relogio_grande(c, t, '00:00' if meia else '23:59', piscar=meia)


def s_final(c, t, S):
    grupo(c, t, S, ej='wide', mj='flat', ep='wide', mp='flat', et='dot', mt='smile')


SEQ = [
    dict(draw=s_abre, falas=['n1'], tag='SEGUNDA · 23H', **WIDE, sfx=[('relogio', 0.2, .6)]),
    dict(draw=s_julia, falas=['j1'], **CL),
    dict(draw=s_thor('t1', eyes='half', rest='smirk'), falas=['t1'], **CT),
    dict(draw=s_prende, falas=['n2'], **WIDE, hold=.5),
    dict(draw=s_lista, falas=['t2'], **CT, sfx=[('pop', 't2+0.1', .5)]),
    dict(draw=s_pai, falas=['p1'], **CL),
    dict(draw=lambda c, t, S: s_thor('t3', sparkle=(t - S.at('t3:fim-0.4')) / .3 if t > S.at('t3:fim-0.4') else 0)(c, t, S), falas=['t3'], **CT, sfx=[('brilho', 't3:fim-0.4', .6)]),
    dict(draw=s_abraco, falas=['n3'], **WIDE),
    dict(draw=s_thor('t4', eyes='dot', rest='smile'), falas=['t4'], **CT),
    dict(draw=s_relogio, falas=['n4'], **WIDE, sfx=[('relogio', 'n4+0.3', .7)], shake=['n4+1.2']),
    dict(draw=s_thor('t5', eyes='dot', rest='flat'), falas=['t5'], **CT, hold=.6),
    dict(draw=s_final, falas=['n5'], hold=1.4, **WIDE, polaroid=dict(at='n5:fim+0.1', text='O QUE ELE IA CONTAR?', ring=(XT, 640))),
]

if __name__ == '__main__':
    main(Video(PROJ, SEQ))
