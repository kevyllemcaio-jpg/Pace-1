import bpy, math, random
from lib import *
from chars import img_mat
R = math.radians; TXN = lambda n: f'/root/b3d/tx_{n}.png'
SN = {}
def snowmat(): return mat('neve', '#EEF3FA', 0.55)
def pine(name, x, y, z=0, h=5.0):
    g = mat('pinho', '#2F6B4F', 0.8); nv = snowmat()
    cyl(name + 't', 0.2, 1.0, (x, y, z + 0.5), mat('tronco', '#5A3A22', 0.9), bevel=0)
    for k, (rr, hh) in enumerate(((1.6, 2.2), (1.25, 1.9), (0.9, 1.6))):
        bpy.ops.mesh.primitive_cone_add(radius1=rr * h / 5, depth=hh * h / 5, location=(x, y, z + 1.0 + k * 1.1 * h / 5 + hh * h / 10)); c = bpy.context.object; c.name = f'{name}c{k}'; c.data.materials.append(g if k % 2 == 0 else nv)
def house(name, x, y, w=5, d=5, h=4, col='#E9C46A', face=1):
    winm = bpy.data.materials.get('janela') or mat('janela', '#2B2B40', 0.15, emit='#FFD9A0', es=0)
    cube(name, (w, d, h), (x, y, h / 2), mat('casa' + col, col, 0.8), 0.04)
    for s in (-1, 1): cube(f'{name}tel{s}', (w / 2 * 1.25, d + 0.6, 0.35), (x + s * w * 0.28, y, h + 0.85), snowmat(), 0.12, rot=(0, R(s * -35), 0))
    cube(f'{name}fr', (w * 0.95, 0.3, 1.5), (x, y - d / 2 - 0.1 + d * 0, h + 0.6), mat('casa' + col, col, 0.8), 0.02)
    fx = x - face * (w / 2 + 0.02)
    for j in (-1, 1): cube(f'{name}jan{j}', (0.1, 1.1, 1.1), (fx, y + j * 1.3, 2.3), winm, 0.02)
    cube(f'{name}porta', (0.1, 1.1, 2.0), (fx, y, 1.0), mat('portaN', '#7A3B2E', 0.6), 0.02)
def build_neve():
    # ---------- CIDADE (ox=0): rua ao longo de +y, montanha ao fundo
    plane('neveC', (200, 300), (0, 60, 0), snowmat())
    plane('rua', (7, 120), (0, 40, 0.01), img_mat('ruaN', TXN('rua_neve'), 0.6, alpha=False))
    cols = ['#E9C46A', '#F4A6B8', '#A8DADC', '#B5E48C', '#F4A261', '#CDB4DB', '#FFD6A5']
    for i in range(9):
        for s in (-1, 1): house(f'casa{s}_{i}', s * 8.0, 2 + i * 7, 5, 5.5, 4 + (i % 3) * 0.6, cols[(i * 2 + (s > 0)) % 7], face=s)
    for i in range(7):
        for s in (-1, 1):
            cyl(f'poste{s}{i}', 0.08, 4, (s * 4.2, i * 8 - 2, 2), mat('posteN', '#2B2B33', 0.4), bevel=0)
            sphere(f'lampN{s}{i}', 0.28, (s * 4.2, i * 8 - 2, 4.1), mat('lampN', '#FFF4D0', 0.3, emit='#FFD58A', es=0))
            bpy.ops.object.light_add(type='POINT', location=(s * 4.0, i * 8 - 2, 3.9)); L = bpy.context.object; L.name = f'luzposte{s}{i}'; L.data.energy = 0; L.data.color = (1, 0.8, 0.5); L.data.shadow_soft_size = 0.4
    red = mat('torii', '#D62828', 0.45); blk = mat('toriiP', '#1C1C22', 0.5)
    for s in (-1, 1): cyl(f'arcoP{s}', 0.32, 6.2, (s * 3.3, 10, 3.1), red)
    cube('arcoV1', (9.2, 0.6, 0.45), (0, 10, 6.3), red, 0.05); cube('arcoV0', (9.8, 0.7, 0.3), (0, 10, 6.75), blk, 0.05); cube('arcoV2', (7.6, 0.4, 0.35), (0, 10, 5.3), red, 0.04)
    for s in (-1, 1): sphere(f'lanterna{s}', 0.32, (s * 2.4, 10, 4.7), mat('lanterna', '#FFE7A8', 0.3, emit='#FFC46B', es=0), scale=(1, 1, 1.3))
    bpy.ops.object.light_add(type='POINT', location=(0, 9.5, 4.6)); L = bpy.context.object; L.name = 'luzarco'; L.data.energy = 0; L.data.color = (1, 0.75, 0.45)
    bpy.ops.mesh.primitive_cone_add(radius1=70, depth=75, location=(0, 170, 30), vertices=10); m = bpy.context.object; m.name = 'montanha'; m.data.materials.append(mat('montanha', '#DCE6F2', 0.7))
    fm = mat('fendaM', '#2A0A06', 0.5, emit='#FF6A1A', es=0)
    for k, (dx, z0, ang, wd) in enumerate(((0, 46, 18, 2.4), (2.2, 36, -22, 2.0), (-0.4, 26, 15, 1.6), (1.4, 17, -12, 1.2))):
        rr = 70 * (67.5 - z0) / 75; cube(f'fenda{k}', (wd, 2.0, 11), (dx, 170 - rr + 0.6, z0), fm, 0, rot=(R(-43), R(ang), 0))
    rnd = random.Random(3)
    for i in range(70): pine(f'pin{i}', rnd.uniform(-90, 90), rnd.uniform(75, 110), 0, rnd.uniform(5, 9))
    for i in range(14): pine(f'pinL{i}', rnd.choice((-1, 1)) * rnd.uniform(13, 30), rnd.uniform(-8, 70), 0, rnd.uniform(4, 7))
    cyl('posteCartaz', 0.12, 3.6, (-4.4, 4, 1.8), mat('madeiraP', '#6B4226', 0.7))
    plane('cartaz', (1.2, 1.6), (-4.4, 3.86, 2.3), img_mat('cartaz', TXN('cartaz'), 0.6, alpha=False), rot=(R(90), 0, 0))
    cube('banco', (2.2, 0.7, 0.12), (2.2, 15, 0.6), mat('madeiraP', '#6B4226', 0.7), 0.03)
    for s in (-1, 1): cube(f'bancoP{s}', (0.12, 0.6, 0.6), (2.2 + s * 0.9, 15, 0.3), mat('posteN', '#2B2B33', 0.4), 0.02)
    SN['cidade'] = dict(ox=0)
    # ---------- FLORESTA / ESCADARIA (ox=300)
    ox = 300; gelo = mat('geloDeg', '#CFEFFF', 0.08, 0.0); nv = snowmat()
    plane('neveF', (120, 160), (ox, 40, 0), nv)
    for i in range(34): cube(f'deg{i}', (3.6, 0.9, 0.42 * (i + 1)), (ox, 4 + i * 0.85, 0.21 * (i + 1)), gelo, 0.03)
    for s in (-1, 1):
        cube(f'encosta{s}', (8, 34 * 0.85 + 6, 14.5), (ox + s * 6.0, 4 + 17 * 0.85, 7.2 - 7.2), nv, 0.3, rot=(R(26), 0, 0))
    for i in range(30): pine(f'pinF{i}', ox + rnd.choice((-1, 1)) * rnd.uniform(4, 14), rnd.uniform(0, 34), 0, rnd.uniform(5, 8))
    top = 34 * 0.42; ty = 4 + 34 * 0.85 + 4
    plane('platô', (30, 20), (ox, ty + 6, top), nv)
    tr = img_mat('troncoT', TXN('tronco'), 0.8, alpha=False)
    cube('cabana', (7, 5, 3.6), (ox, ty + 5, top + 1.8), tr, 0.05)
    for s in (-1, 1): cube(f'cabTel{s}', (4.4, 6, 0.5), (ox + s * 1.9, ty + 5, top + 4.4), nv, 0.15, rot=(0, R(s * -32), 0))
    cube('cabPorta', (1.2, 0.1, 2.2), (ox, ty + 2.45, top + 1.1), mat('portaN', '#7A3B2E', 0.6), 0.02)
    for s in (-1, 1): cube(f'cabJan{s}', (1.1, 0.1, 1.0), (ox + s * 2.2, ty + 2.45, top + 2.0), bpy.data.materials['janela'], 0.02)
    cube('chamine', (0.7, 0.7, 2), (ox + 2, ty + 6, top + 5), mat('pedraC', '#8A8A92', 0.8), 0.05)
    SN['escada'] = dict(ox=ox, top=top, ty=ty)
    # ---------- CACHOEIRA CONGELADA (ox=360)
    ox = 360; plane('neveW', (60, 60), (ox, 10, 0.004), nv)
    cube('paredao', (20, 4, 16), (ox, 9, 8), mat('rochaGelo', '#9FB8D6', 0.4), 0.3)
    for i in range(26): bpy.ops.mesh.primitive_cone_add(radius1=rnd.uniform(0.2, 0.5), depth=rnd.uniform(1.5, 5), location=(ox + rnd.uniform(-9, 9), 6.9, rnd.uniform(9, 15)), rotation=(math.pi, 0, 0)); c = bpy.context.object; c.data.materials.append(gelo)
    agua = img_mat('agua', TXN('agua'), 0.05, emit=0.6, alpha=False); SN['agua'] = agua
    plane('quedaAgua', (4.5, 16), (ox, 6.95, 8), agua, rot=(R(90), 0, 0))
    cyl('poco', 3.2, 0.2, (ox, 4.5, 0.1), mat('pocoGelo', '#A8DDF5', 0.05), bevel=0.05)
    SN['cachoeira'] = dict(ox=ox)
    # ---------- PONTE (ox=420)
    ox = 420; plane('fundoBarranco', (60, 60), (ox, 10, -12), mat('neveFundo', '#C9D6E6', 0.8))
    for s in (-1, 1): cube(f'barranco{s}', (40, 14, 14), (ox, 10 + s * 13, -7), nv, 0.3)
    for i in range(16):
        if i in (8, 9) and False: continue
        cube(f'tabua{i}', (2.0, 0.42, 0.1), (ox, 3 + i * 0.75, -0.05 - 0.6 * math.sin(math.pi * i / 15)), mat('tabua', '#9C6B3E', 0.8), 0.02)
    for s in (-1, 1):
        for i in range(15): cyl(f'corda{s}{i}', 0.04, 0.8, (ox + s * 1.05, 3.35 + i * 0.75, 0.9 - 0.6 * math.sin(math.pi * (i + 0.5) / 15)), mat('corda', '#E0B060', 0.8), rot=(R(90), 0, 0), bevel=0)
    for i in range(12): pine(f'pinP{i}', ox + rnd.uniform(-18, 18), rnd.choice((-1, 1)) * rnd.uniform(14, 20) + 10, 0, rnd.uniform(4, 7))
    SN['ponte'] = dict(ox=ox)
    # ---------- CAMPO (ox=480) para as mãos na neve
    ox = 480; plane('neveCampo', (60, 60), (ox, 10, 0.004), nv)
    cube('cabana2', (7, 5, 3.6), (ox + 4, 14, 1.8), tr, 0.05)
    for s in (-1, 1): cube(f'cab2Tel{s}', (4.4, 6, 0.5), (ox + 4 + s * 1.9, 14, 4.4), nv, 0.15, rot=(0, R(s * -32), 0))
    for i in range(14): pine(f'pinC{i}', ox + rnd.uniform(-20, 20), rnd.uniform(18, 30), 0, rnd.uniform(5, 8))
    SN['campo'] = dict(ox=ox)
    # ---------- JANELAS (ox=540): parede com 3 janelas e quartos iluminados atrás
    ox = 540; wall = mat('paredeJ', '#E9D8B4', 0.8); plane('neveJ', (40, 30), (ox, 0, 0), nv)
    for k in range(3):
        cx = ox - 4.2 + k * 4.2
        for (dx, dz, w, h) in ((0, 0.5, 4.2, 1.0), (0, 3.85, 4.2, 1.7)): cube(f'pj{k}{dz}', (w, 0.4, h), (cx + dx, 3, dz), wall, 0)
        for s in (-1, 1): cube(f'pjs{k}{s}', (0.6, 0.4, 2.4), (cx + s * 1.8, 3, 2.2), wall, 0)
        for (dx, dz, w, h) in ((0, 1.05, 3.0, 0.12), (0, 3.35, 3.0, 0.12), (0, 2.2, 0.1, 2.4)): cube(f'pjf{k}{dx}{dz}', (w, 0.2, h), (cx + dx, 2.85, dz), mat('branco', '#F5F5F5', 0.5), 0.02)
        cube(f'quarto{k}', (4, 3, 0.1), (cx, 5, 4.6), mat('tetoQ', '#F0E6D6', 0.8), 0); cube(f'quartoF{k}', (4, 0.2, 4.6), (cx, 6.4, 2.3), mat('parQ' + str(k), ['#F4A6B8', '#A8DADC', '#B5E48C'][k], 0.8), 0)
        bpy.ops.object.light_add(type='POINT', location=(cx, 4.8, 3.6)); L = bpy.context.object; L.data.energy = 220; L.data.color = (1, 0.8, 0.55)
    SN['janelas'] = dict(ox=ox)
