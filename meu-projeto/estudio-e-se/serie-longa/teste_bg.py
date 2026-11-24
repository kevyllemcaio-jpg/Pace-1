import sys, os; sys.path.insert(0, os.path.expanduser('~/vid/lib')); sys.path.insert(0, '/root/vid/serie16')
import kit; kit.set_formato('16:9'); kit.set_estilo('dia')
import skia, mundo
out = skia.Surface(1920, 1080 * 3 // 1)
big = skia.Surface(1920 * 2 // 2, 1080 * 3 // 1)
names = ['vila', 'floresta', 'salao', 'estrada', 'caverna', 'mapa']
S2 = skia.Surface(1920, 1620)
cv2 = S2.getCanvas()
for i, n in enumerate(names):
    s = skia.Surface(1920, 1080); c = s.getCanvas()
    if n == 'mapa': mundo.mapa(c, 1.0, explorado=('castelo', 'vila', 'floresta'), rota=('castelo', 'floresta'), u=.6, fenda_aberta=True)
    else: getattr(mundo, n)(c, 1.0)
    img = s.makeImageSnapshot(); cv2.save(); cv2.translate((i % 2) * 960, (i // 2) * 540); cv2.scale(.5, .5); cv2.drawImage(img, 0, 0); cv2.restore()
S2.makeImageSnapshot().save('bg.png'); print('ok')
