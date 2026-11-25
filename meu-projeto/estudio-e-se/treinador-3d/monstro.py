import bpy, math
from lib import *
R = math.radians
class Monstro:
    """criatura de gelo original: corcunda, cabeça com cristais, braços longos terminando em agulhas"""
    def __init__(self, name='monstro'):
        self.root = root = empty(name); body = mat('mon_pele', '#5B6FD6', 0.55); dark = mat('mon_esc', '#2E3A86', 0.6)
        gelo = mat('mon_gelo', '#BFEFFF', 0.08, emit='#9BE7FF', es=1.5); olho = mat('mon_olho', '#FFFFFF', 0.2, emit='#7FF6FF', es=12)
        self.hips = empty(name + '_hips', (0, 0, 2.2), root)
        self.legs = []
        for s in (-1, 1):
            hip = empty(f'{name}_hip{s}', (s * 0.55, 0, 0), self.hips); self.legs.append(hip)
            cube(f'{name}_coxa{s}', (0.6, 0.6, 1.2), (0, 0.1, -0.55), body, 0.2, hip, rot=(R(15), 0, 0))
            cube(f'{name}_canela{s}', (0.5, 0.5, 1.1), (0, -0.1, -1.6), dark, 0.18, hip, rot=(R(-15), 0, 0))
            for k in (-1, 0, 1): cube(f'{name}_garraP{s}{k}', (0.12, 0.5, 0.12), (k * 0.18, -0.45, -2.12), gelo, 0.03, hip)
        self.chest = empty(name + '_chest', (0, 0, 0.2), self.hips); self.chest.rotation_euler = (R(25), 0, 0)
        cube(f'{name}_tronco', (1.8, 1.2, 1.8), (0, 0, 0.9), body, 0.35, self.chest)
        cube(f'{name}_barriga', (1.2, 0.2, 1.1), (0, -0.62, 0.7), dark, 0.15, self.chest)
        for i in range(5): cube(f'{name}_espinho{i}', (0.18, 0.18, 0.7), (-0.6 + i * 0.3, 0.55, 1.75), gelo, 0.04, self.chest, rot=(R(-35), 0, 0))
        self.head = empty(name + '_head', (0, -0.3, 1.9), self.chest)
        cube(f'{name}_cabeca', (1.1, 1.0, 0.85), (0, -0.25, 0.35), body, 0.3, self.head)
        cube(f'{name}_mandib', (0.9, 0.7, 0.3), (0, -0.4, -0.05), dark, 0.12, self.head)
        for s in (-1, 1):
            sphere(f'{name}_olho{s}', 0.14, (s * 0.25, -0.75, 0.45), olho, self.head, scale=(1.2, 0.6, 0.8))
            cube(f'{name}_chifre{s}', (0.16, 0.16, 0.8), (s * 0.42, -0.1, 0.95), gelo, 0.04, self.head, rot=(R(-20), R(s * 20), 0))
        self.arms = []; self.needles = []
        for s in (-1, 1):
            sh = empty(f'{name}_ombro{s}', (s * 1.1, 0, 1.4), self.chest); self.arms.append(sh)
            cube(f'{name}_braco{s}', (0.5, 0.5, 1.5), (0, 0, -0.7), body, 0.18, sh)
            el = empty(f'{name}_cot{s}', (0, 0, -1.45), sh); self.arms.append(el)
            cube(f'{name}_antebr{s}', (0.45, 0.45, 1.3), (0, 0, -0.6), dark, 0.16, el)
            nd = empty(f'{name}_agulhaE{s}', (0, 0, -1.25), el); self.needles.append(nd)
            bpy.ops.mesh.primitive_cone_add(radius1=0.14, radius2=0.0, depth=2.6, location=(0, 0, -1.3)); c = bpy.context.object; c.name = f'{name}_agulha{s}'; c.parent = nd; c.rotation_euler = (math.pi, 0, 0)
            c.data.materials.append(gelo); bpy.ops.object.shade_smooth()
        self.pose()
    def pose(self, ombroL=(20, 0, -15), cotL=(-30, 0, 0), ombroR=(20, 0, 15), cotR=(-30, 0, 0), chest=25, head=(0, 0, 0), legs=(0, 0)):
        L, Le, Rr, Re = self.arms
        L.rotation_euler = tuple(R(a) for a in ombroL); Le.rotation_euler = tuple(R(a) for a in cotL)
        Rr.rotation_euler = tuple(R(a) for a in ombroR); Re.rotation_euler = tuple(R(a) for a in cotR)
        self.chest.rotation_euler = (R(chest), 0, 0); self.head.rotation_euler = tuple(R(a) for a in head)
        self.legs[0].rotation_euler = (R(legs[0]), 0, 0); self.legs[1].rotation_euler = (R(legs[1]), 0, 0)
    def place(self, x, y, z=0, rz=0, show=True, sc=1.0):
        self.root.location = (x, y, z); self.root.rotation_euler = (0, 0, R(rz)); self.root.scale = (sc,) * 3; self.root.hide_render = not show
        for c in self.root.children_recursive: c.hide_render = not show
