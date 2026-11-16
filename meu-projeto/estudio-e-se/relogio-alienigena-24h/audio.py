import numpy as np, wave
SR = 44100; DUR = 60.0; N = int(DUR*SR); rng = np.random.default_rng(93)
exec(open('synth.py').read())
mus = np.zeros(N); sfx = np.zeros(N); F = lambda f: f/30
exec(open('fx.py').read())
def morph():
    tt = t_(0.9); f = 300 * 2 ** (tt/0.9*2.5); x = np.sin(2*np.pi*np.cumsum(f)/SR) * 0.5 + noise_band(0.9, 600, 6000) * 0.5 * (tt/0.9)
    return np.concatenate([x * (tt/0.9), boom()[:int(0.8*SR)] * 0.9])
def beep(f0=1800): return note(f0, 0.12, 'bell', 0.05)
def roar(d=1.6):
    tt = t_(d); f = 70 + 25*np.sin(2*np.pi*6*tt); x = np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*0.4 + noise_band(d, 80, 1500)*0.8
    return x * np.minimum(1, tt/0.15) * np.minimum(1, (d-tt)/0.4)
def fireball():
    tt = t_(0.6); return noise_band(0.6, 200, 3000) * np.sin(np.pi*tt/0.6) + 0.3*noise_band(0.6, 3000, 8000) * np.exp(-tt*5)
# hook
put(mus, riser(1.6), 0, 0.4); put(sfx, crackle(2.0, 50), 0, 0.4); put(mus, boom(), F(61), 1.0); put(sfx, roar(1.6), F(72), 0.7)
stabs(F(61), F(121), 140, [38], 0.8)
# meteor
pad(F(121), F(294), [50, 57, 62], 0.1); put(sfx, rev(whoosh(1.4)), F(160) - 1.4, 0.7); put(mus, boom(), F(160), 1.0); put(sfx, crackle(1.0, 60), F(160), 0.3)
for k in range(6): put(mus, note(midi([74, 79, 81, 86, 81, 79][k]), 0.6, 'bell', 0.3), F(209) + k*0.45, 0.12)
put(sfx, ting(2637), F(259), 0.4); put(sfx, thud()*0.5, F(332), 0.5); put(sfx, ting(3136), F(332), 0.4)
put(sfx, riser(0.6), F(340) - 0.1, 0.4); put(mus, lowhit(), F(342), 0.6)
pad(F(294), F(410), [50, 54, 57, 62], 0.11)
# transformations
for f in [410, 590, 846, 1049, 1068, 1089, 1106]: put(sfx, morph(), F(f) - 0.9, 0.6)
for f in [396, 582, 838, 1040]: put(sfx, beep(), F(f), 0.5)
stabs(F(410), F(552), 130, [38, 41], 1.0); put(sfx, thud(), F(498), 0.6)
stabs(F(590), F(698), 150, [43, 41], 1.0); for_ = [put(sfx, whoosh(0.4), F(f) - 0.1, 0.5) for f in [601, 615, 630, 651, 665, 680]]
# ground shakes + monster
put(mus, hum(F(829) - F(698), 41), F(698), 0.45); put(sfx, noise_band(1.6, 30, 300) * np.minimum(1, t_(1.6)/0.3), F(704), 0.6)
for k in range(10): put(mus, taiko(), F(748) + k*0.32, 0.6)
put(mus, boom(), F(752), 0.9); put(sfx, roar(1.4), F(792), 0.8); put(sfx, shatter(), F(804), 0.4)
# fire
stabs(F(846), F(924), 150, [36, 39], 1.0)
for f in [860, 874, 888, 902]: put(sfx, fireball(), F(f), 0.6); put(sfx, boom()[:int(0.6*SR)], F(f + 14), 0.4)
put(sfx, rev(whoosh(0.6)), F(930), 0.5); put(sfx, thud(), F(944), 0.6); put(mus, riser(1.4), F(950), 0.5); put(sfx, roar(1.6), F(988), 0.9)
pad(F(924), F(1012), [48, 51, 55, 60], 0.12)
# rapid switching
stabs(F(1012), F(1189), 165, [38, 41, 43, 36], 1.1)
put(sfx, thud(), F(1061), 0.6)
for k in range(6): put(sfx, thud()*0.4, F(1068) + k*0.12, 0.5)
put(sfx, boing(), F(1082), 0.4); put(sfx, boom(), F(1100), 0.7); put(sfx, whoosh(0.5), F(1136), 0.6); put(sfx, boom(), F(1165), 0.9)
# red alarm
for k in range(int((F(1368) - F(1189)) / 0.4)): put(sfx, beep(1400 if k % 2 else 1100), F(1189) + k*0.4, 0.5)
put(mus, hum(F(1398) - F(1189), 49), F(1189), 0.4); pad(F(1264), F(1398), [45, 48, 52], 0.12)
put(mus, riser(F(1398) - F(1321)), F(1321), 0.6)
# colosso
put(mus, boom(), F(1398), 1.0); put(sfx, morph(), F(1421) - 0.9, 0.6); put(mus, boom(), F(1421), 0.9)
for k in range(4): put(mus, note(midi([62, 66, 69, 74][k]), 1.4, 'brass'), F(1430) + k*0.18, 0.22)
stabs(F(1440), F(1524), 120, [38, 43], 1.15)
put(sfx, rev(whoosh(0.5)), F(1534) - 0.3, 0.6); put(mus, boom(), F(1540), 1.0); put(sfx, shatter(), F(1540), 0.4)
put(sfx, roar(1.0), F(1569), 0.6); put(mus, boom(), F(1600), 1.0); put(sfx, noise_band(2.0, 30, 400) * np.exp(-t_(2.0)*1.5), F(1600), 0.6)
# glow again + finale
put(sfx, ting(2637), F(1648), 0.5); put(sfx, ting(3136), F(1652), 0.4)
pad(F(1621), 59.8, [50, 57, 62, 66, 69], 0.13); stabs(F(1682), 59.4, 120, [38, 43, 45, 41], 1.0)
put(mus, boom(), 58.9, 0.8)
wr('music.wav', mus); wr('sfx.wav', sfx); print('ok')
