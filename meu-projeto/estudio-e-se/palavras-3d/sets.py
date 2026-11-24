import bpy, math
from lib import *
from chars import img_mat
R = math.radians
TX = lambda n: f'/root/b3d/tx_{n}.png'
SETS = {}
def area(loc, energy, size=2.0, col=(1, 0.96, 0.9), rot=(0, 0, 0), name='L'):
    bpy.ops.object.light_add(type='AREA', location=loc, rotation=rot); L = bpy.context.object; L.name = name; L.data.energy = energy; L.data.size = size; L.data.color = col; return L
def point(loc, energy, col=(1, 0.85, 0.6), r=0.2):
    bpy.ops.object.light_add(type='POINT', location=loc); L = bpy.context.object; L.data.energy = energy; L.data.color = col; L.data.shadow_soft_size = r; return L
def room(ox, w, d, h, wall, floor_m, ceil='#F3F0EA', back=True):
    plane('floor%d' % ox, (w, d), (ox, d / 2 - 2, 0), floor_m)
    plane('ceil%d' % ox, (w, d), (ox, d / 2 - 2, h), mat('ceil' + ceil, ceil, 0.9), rot=(math.pi, 0, 0))
    wm = mat('wall' + wall, wall, 0.85)
    cube('wl%d' % ox, (0.2, d, h), (ox - w / 2, d / 2 - 2, h / 2), wm, 0); cube('wr%d' % ox, (0.2, d, h), (ox + w / 2, d / 2 - 2, h / 2), wm, 0)
    if back: cube('wb%d' % ox, (w, 0.2, h), (ox, d - 2, h / 2), wm, 0)
    cube('wf%d' % ox, (w, 0.2, h), (ox, -6, h / 2), wm, 0)   # parede atrás da câmera (reflexos)
    return wm
def build_all():
    # ---------- A: RUA DA ESCOLA (ox=0), dia
    ox = 0
    plane('asf', (60, 14), (ox, -2, 0.0), img_mat('asf', TX('asfalto'), 0.75, alpha=False, repeat=6))
    for i in range(-14, 15): cube(f'faixa{i}', (1.2, 0.15, 0.01), (ox + i * 2.2, -2, 0.005), mat('faixa', '#F2F2F2', 0.6), 0)
    cube('calc', (60, 4, 0.2), (ox, 6.5, 0.1), mat('calc', '#BDB8B0', 0.8), 0.02)
    plane('gramaA', (60, 30), (ox, 23, 0.19), img_mat('grama', TX('grama'), 0.9, alpha=False, repeat=12))
    tj = img_mat('tijolo', TX('tijolo'), 0.85, alpha=False, repeat=4)
    cube('escola', (22, 6, 9), (ox, 14, 4.6), tj, 0.05); cube('telh', (23, 7, 0.6), (ox, 14, 9.3), mat('telh', '#7A3B2E', 0.7), 0.1)
    cube('torre', (5, 6.2, 12), (ox, 13.8, 6), tj, 0.05)
    plane('placa', (6, 1.2), (ox, 10.65, 7.6), img_mat('placa', TX('placa'), 0.5, alpha=False), rot=(math.pi / 2, 0, 0))
    for i in range(-4, 5):
        if i == 0: continue
        for j in range(2): cube(f'jan{i}{j}', (1.4, 0.1, 1.8), (ox + i * 2.4, 10.95, 2.6 + j * 3.2), mat('vidro', '#A8D8F0', 0.05, emit='#CFEFFF', es=0.4), 0.02)
    cube('portaE', (2.6, 0.2, 3.4), (ox, 10.9, 1.9), mat('portaE', '#2B4C8C', 0.4), 0.03)
    for i in (-1, 1):
        t = cyl(f'tronco{i}', 0.25, 3, (ox + i * 9, 8.5, 1.6), mat('tronco', '#6B4226', 0.9)); sphere(f'copa{i}', 1.8, (ox + i * 9, 8.5, 4.2), mat('copa', '#3E9B4F', 0.8))
    SETS['rua'] = dict(ox=ox, sun=True)
    # ---------- B: QUARTO (ox=60), noite
    ox = 60
    room(ox, 8, 8, 4, '#3D5BA9', img_mat('mad', TX('madeira'), 0.5, alpha=False, repeat=3), ceil='#2E4687')
    plane('cidadeB', (4.4, 3.3), (ox, 5.85, 2.4), img_mat('cidade', TX('cidade'), 0.5, emit=1.2, alpha=False), rot=(math.pi / 2, 0, 0))
    for i in (-1, 1): cube(f'jfr{i}', (0.15, 0.2, 3.5), (ox + i * 2.25, 5.85, 2.4), mat('branco', '#F5F5F5', 0.5), 0.02)
    cube('jfrH', (4.6, 0.2, 0.15), (ox, 5.85, 4.1), mat('branco', '#F5F5F5', 0.5), 0.02); cube('jfrB', (4.8, 0.4, 0.18), (ox, 5.75, 0.68), mat('branco', '#F5F5F5', 0.5), 0.02)
    cube('mesaB', (2.4, 1.1, 0.12), (ox + 2.4, 4.6, 1.1), mat('mesa', '#8A5A33', 0.6), 0.03)
    for dx in (-1.1, 1.1): cube(f'pmesa{dx}', (0.1, 1, 1.05), (ox + 2.4 + dx, 4.6, 0.52), mat('mesa', '#8A5A33', 0.6), 0.02)
    cyl('abaj', 0.08, 0.7, (ox + 3.2, 4.8, 1.5), mat('abajb', '#333333', 0.4)); cyl('cupula', 0.35, 0.4, (ox + 3.2, 4.8, 1.95), mat('cupula', '#FFF2C8', 0.6, emit='#FFE1A0', es=3))
    point((ox + 3.2, 4.6, 1.8), 120, (1, 0.8, 0.5))
    cube('cama', (2.2, 3.4, 0.6), (ox - 2.6, 3.5, 0.3), mat('camab', '#E9E4DA', 0.7), 0.1); cube('colcha', (2.25, 2.4, 0.15), (ox - 2.6, 3.0, 0.65), mat('colcha', '#E63946', 0.8), 0.05)
    plane('cal', (0.9, 1.05), (ox - 2.3, 5.85, 2.6), img_mat('calN', TX('cal_novembro'), 0.6, alpha=False), rot=(math.pi / 2, 0, 0))
    area((ox, 1, 3.8), 120, 3, (0.6, 0.7, 1.0), name='luaB')
    SETS['quarto'] = dict(ox=ox)
    # ---------- C: CORREDOR (ox=120)
    ox = 120
    plane('floorC', (6.4, 40), (ox, 10, 0), img_mat('tiles', '/root/b3d/tiles.png', 0.22, alpha=False, repeat=6))
    plane('ceilC', (6.4, 40), (ox, 10, 4.2), mat('ceilC', '#F3F0EA', 0.9), rot=(math.pi, 0, 0))
    wc = mat('wallC', '#EDE3CF', 0.8); cube('wlC', (0.2, 40, 4.4), (ox - 3.2, 10, 2.2), wc, 0); cube('wrC', (0.2, 40, 4.4), (ox + 3.2, 10, 2.2), wc, 0); cube('wfC', (6.4, 0.2, 4.4), (ox, -10, 2.2), wc, 0)
    cols = ['#E63946', '#FF8A1F', '#FFD23F', '#22B573', '#3A86FF', '#8338EC']
    for side in (-1, 1):
        for i in range(24):
            y = -8 + i * 1.05; c = cols[(i + (side > 0) * 3) % 6]
            cube(f'lk{side}_{i}', (0.5, 1.0, 2.8), (ox + side * 2.85, y, 1.4), mat('lk' + c, c, 0.35), 0.03)
            for k in range(4): cube(f'v{side}{i}{k}', (0.02, 0.6, 0.05), (ox + side * 2.59, y, 2.4 - k * 0.12), mat('vent', '#1c1c22', 0.6), 0)
            cube(f'h{side}{i}', (0.04, 0.08, 0.3), (ox + side * 2.58, y + 0.32, 1.4), mat('handle', '#cfd3da', 0.2, 0.9), 0.01)
    for i in range(9):
        cube(f'lampC{i}', (1.6, 0.5, 0.06), (ox, -8 + i * 5, 4.15), mat('lampm', '#ffffff', 0.5, emit='#fff6e8', es=14), 0.01)
        area((ox, -8 + i * 5, 4.0), 240, 1.6)
    cube('winC', (4.8, 0.1, 2.6), (ox, 29, 2.2), mat('winC', '#cfeaff', 0.1, emit='#dff3ff', es=6), 0)
    SETS['corredor'] = dict(ox=ox)
    # ---------- D: CAFÉ (ox=180)
    ox = 180
    room(ox, 9, 8, 4, '#F2D7B6', img_mat('madD', TX('madeira'), 0.45, alpha=False, repeat=3), ceil='#E8D2B2')
    cube('balcao', (5, 1, 1.1), (ox, 2.8, 0.55), mat('balc', '#6B3E26', 0.5), 0.05); cube('tampo', (5.2, 1.2, 0.1), (ox, 2.8, 1.15), mat('tampo', '#EDEDED', 0.25), 0.03)
    cube('maq', (0.9, 0.6, 1.0), (ox + 1.4, 3.0, 1.7), mat('maq', '#B8BDC6', 0.25, 0.7), 0.05)
    for i in range(4): cyl(f'xic{i}', 0.12, 0.18, (ox - 1.6 + i * 0.4, 2.7, 1.29), mat('xic', '#FFFFFF', 0.3))
    plane('menu', (2.4, 1.8), (ox, 5.85, 2.7), img_mat('menu', TX('menu'), 0.5, alpha=False), rot=(math.pi / 2, 0, 0))
    for i in range(7): cube(f'tld{i}', (1.3, 0.8, 0.08), (ox - 3.9 + i * 1.3, 1.6, 3.4), mat('tld' + str(i % 2), '#22B573' if i % 2 else '#FFFFFF', 0.7), 0.02, rot=(R(-20), 0, 0))
    area((ox, 1, 3.8), 300, 3, (1, 0.9, 0.75)); point((ox - 2, 4, 3), 150)
    SETS['cafe'] = dict(ox=ox)
    # ---------- E: SALA (ox=240)
    ox = 240
    room(ox, 9, 8, 4, '#F6E7C9', img_mat('madE', TX('madeira'), 0.5, alpha=False, repeat=3), ceil='#F2E6D0')
    cube('sofa', (3, 1.1, 0.6), (ox - 1.5, 4.6, 0.4), mat('sofa', '#2A9D8F', 0.8), 0.15); cube('sofaB', (3, 0.35, 1.2), (ox - 1.5, 5.15, 0.75), mat('sofa', '#2A9D8F', 0.8), 0.15)
    for i in (-1, 1): cube(f'sofaA{i}', (0.35, 1.1, 0.9), (ox - 1.5 + i * 1.5, 4.6, 0.6), mat('sofa', '#2A9D8F', 0.8), 0.12)
    cube('tvrack', (2.2, 0.6, 0.7), (ox + 2.6, 5.3, 0.35), mat('rack', '#5A3A22', 0.6), 0.04)
    cube('tv', (2.2, 0.12, 1.3), (ox + 2.6, 5.4, 1.5), mat('tvb', '#111111', 0.3), 0.03)
    tvm = img_mat('tvfut', TX('tvfut'), 0.4, emit=2.2, alpha=False); SETS['tvmat'] = tvm
    plane('tela', (2.0, 1.12), (ox + 2.6, 5.33, 1.5), tvm, rot=(math.pi / 2, 0, 0))
    plane('tapete', (4, 2.6), (ox, 3, 0.01), mat('tapete', '#E9C46A', 0.9))
    area((ox, 1, 3.8), 260, 3, (1, 0.9, 0.75)); point((ox + 2.6, 4.6, 1.5), 60, (0.6, 0.9, 1))
    SETS['sala'] = dict(ox=ox)
    # ---------- F: AULA (ox=300)
    ox = 300
    room(ox, 10, 9, 4.2, '#F2E3C6', img_mat('tilesF', '/root/b3d/tiles.png', 0.35, alpha=False, repeat=4), ceil='#F5F1E8')
    cube('quadroM', (5.4, 0.12, 2.4), (ox, 6.85, 2.4), mat('qmold', '#7A4A2A', 0.6), 0.03)
    plane('quadro', (5.0, 2.1), (ox, 6.78, 2.4), img_mat('quadro', TX('quadro'), 0.8, alpha=False), rot=(math.pi / 2, 0, 0))
    cyl('relF', 0.45, 0.08, (ox + 3.6, 6.85, 3.4), mat('relF', '#FFFFFF', 0.4), rot=(R(90), 0, 0))
    for i in range(3):
        for j in range(2): cube(f'cart{i}{j}', (1.3, 0.8, 0.08), (ox - 2.6 + i * 2.6, 1.0 - j * 1.8, 1.0), mat('cart', '#C98E5A', 0.5), 0.03); cube(f'cartp{i}{j}', (1.2, 0.7, 0.9), (ox - 2.6 + i * 2.6, 1.0 - j * 1.8, 0.48), mat('cartp', '#3A86FF', 0.5), 0.03)
    area((ox - 4, 3, 3), 600, 3, (1, 0.92, 0.75), rot=(0, R(-70), 0)); area((ox, 2, 4.0), 200, 4)
    SETS['aula'] = dict(ox=ox)
    # ---------- G: MÚSICA / RÁDIO (ox=360)
    ox = 360
    room(ox, 9, 8, 4, '#E8D9C4', img_mat('madG', TX('madeira'), 0.5, alpha=False, repeat=3), ceil='#EFE6D8')
    plane('chaoAz', (5, 4), (ox, 3, 0.01), mat('carpete', '#2A4C9E', 0.9))
    plane('noar', (1.6, 0.5), (ox, 5.85, 3.2), img_mat('noar', TX('noar'), 0.4, emit=3, alpha=False), rot=(math.pi / 2, 0, 0))
    for i in range(2): cube(f'prat{i}', (4, 0.4, 0.08), (ox, 5.7, 2.2 + i * 0.6), mat('prat', '#6B4226', 0.6), 0.02)
    cyl('micst', 0.03, 1.4, (ox + 0.6, 2.6, 0.7), mat('micst', '#333333', 0.3)); sphere('mic', 0.12, (ox + 0.6, 2.5, 1.45), mat('mic', '#555555', 0.3, 0.6))
    for i in range(3): cube(f'cad{i}', (0.6, 0.6, 0.08), (ox - 2.5 + i * 0.8, 4.6, 0.6), mat('cadG', '#1D3E8A', 0.5), 0.03)
    redL = point((ox, 5.4, 3.2), 40, (1, 0.2, 0.2)); area((ox, 1, 3.8), 260, 3)
    SETS['musica'] = dict(ox=ox)
    # ---------- H: ESCADA DA ESCOLA (ox=420), exterior
    ox = 420
    plane('chaoH', (30, 20), (ox, 4, 0), mat('pedraH', '#C9C3B8', 0.8))
    for i in range(4): cube(f'deg{i}', (8, 0.6, 0.3), (ox, 2 + i * 0.6, 0.15 + i * 0.3), mat('degrau', '#D8D2C6', 0.8), 0.02)
    cube('paredeH', (14, 0.4, 7), (ox, 4.8, 3.5), mat('parH', '#E9DCC0', 0.8), 0.02)
    for i in (-1, 1): cube(f'colH{i}', (0.6, 0.6, 5), (ox + i * 3.4, 4.3, 3.7), mat('colH', '#F2EBDD', 0.7), 0.05)
    for i in range(-2, 3): cube(f'janH{i}', (1.6, 0.1, 1.4), (ox + i * 2.6, 4.55, 4.6), mat('vidro', '#A8D8F0', 0.05), 0.02)
    SETS['escada'] = dict(ox=ox, sun=True)
    # ---------- I: CASA (ox=480), exterior
    ox = 480
    plane('chaoI', (30, 20), (ox, 4, 0), img_mat('gramaI', TX('grama'), 0.9, alpha=False, repeat=8))
    cube('calcI', (3, 6, 0.06), (ox - 1, 0, 0.03), mat('calcI', '#C9B79C', 0.8), 0.01)
    cube('casa', (12, 6, 6), (ox, 6, 3), mat('casaI', '#F4A6B8', 0.8), 0.04)
    cube('portaI', (1.6, 0.2, 2.8), (ox - 1, 2.95, 1.4), mat('portaI', '#E0661A', 0.5), 0.03); sphere('maçaneta', 0.07, (ox - 0.4, 2.82, 1.35), mat('mac', '#F2C14E', 0.2, 0.9))
    cube('janI', (2.2, 0.1, 1.6), (ox + 2.8, 2.98, 1.9), mat('janI', '#2B2B40', 0.1, emit='#FFE7B0', es=0.0), 0.02)
    for dx in (-1.15, 1.15): cube(f'janIf{dx}', (0.12, 0.25, 1.8), (ox + 2.8 + dx, 2.92, 1.9), mat('branco', '#F5F5F5', 0.5), 0.02)
    cube('janIb', (2.5, 0.35, 0.12), (ox + 2.8, 2.85, 1.05), mat('branco', '#F5F5F5', 0.5), 0.02); cube('janIt', (2.5, 0.3, 0.12), (ox + 2.8, 2.9, 2.8), mat('branco', '#F5F5F5', 0.5), 0.02)
    cyl('posteI', 0.06, 3.6, (ox + 5.4, 1.5, 1.8), mat('poste', '#222222', 0.4)); sphere('lampI', 0.25, (ox + 5.4, 1.5, 3.7), mat('lampI', '#FFF6D0', 0.3, emit='#FFE7B0', es=8))
    SETS['lampI'] = point((ox + 5.4, 1.3, 3.5), 0, (1, 0.85, 0.6), 0.3); SETS['janIlight'] = point((ox + 2.8, 3.6, 1.9), 0, (1, 0.8, 0.5))
    SETS['casa'] = dict(ox=ox, sun=True)
    # ---------- J: ALTO-FALANTE (ox=540): parede com caixa de som
    ox = 540
    room(ox, 8, 6, 4, '#F2E3C6', mat('chaoJ', '#9AA0A8', 0.4), ceil='#F5F1E8', back=True)
    cube('caixa', (1.4, 0.6, 1.0), (ox, 3.65, 3.0), mat('caixa', '#2B2B33', 0.4), 0.06)
    cyl('cone', 0.35, 0.06, (ox, 3.33, 3.0), mat('cone', '#9A9AA6', 0.6), rot=(R(90), 0, 0)); cyl('cone2', 0.12, 0.08, (ox, 3.3, 3.0), mat('cone2', '#444444', 0.4), rot=(R(90), 0, 0))
    for side in (-1, 1):
        for i in range(5): c = cols[(i + (side > 0)) % 6]; cube(f'lkJ{side}{i}', (1.0, 0.5, 2.6), (ox + side * (1.0 + i * 1.05), 3.65, 1.3), mat('lk' + c, c, 0.35), 0.03)
    area((ox, 0, 3.8), 300, 3)
    SETS['alto'] = dict(ox=ox)
