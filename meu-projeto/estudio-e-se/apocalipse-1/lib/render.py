"""Linha do tempo + render por tomada (com retomada) + junção. Importado pelo cenas.py de cada vídeo.
CLI (via cenas.py):  info | estilos [I:FRAC] | storyboard | elenco | stills I:FRAC ... | tudo | render IDX N | audio | juntar | final
Qualidade: padrão "rapida" (720p). QUALIDADE=alta (ou "qualidade": "alta" no roteiro.json) = 1080p.
"""
import os, sys, json, math, random, subprocess, hashlib
import numpy as np, skia, soundfile as sf
import kit
from kit import *

GAP0, GAP, CARD_DUR = 0.3, 0.26, 1.5


class Shot:
    def __init__(self, i, d, v):
        self.i, self.d, self.v = i, d, v
        self.falas = d.get('falas', [])
    def at(self, e):  # 1.2 = seg. após início da tomada | 'n3' início da fala | 'n3+0.2' | 'n3:fim-0.1'
        if isinstance(e, (int, float)): return self.s0 + e
        e = e.replace(' ', ''); off = 0.0
        for sg in ('+', '-'):
            if sg in e[1:]:
                k = e.rindex(sg); off = float(e[k:]); e = e[:k]; break
        if e.endswith(':fim'): k = e[:-4]; return self.v.cue[k] + self.v.dur[k] + off
        return self.v.cue[e] + off
    def u(self, t): return (t - self.s0) / max(self.s1 - self.s0, 1e-6)
    def boca(self, key, t, rest='smile', mapping=None):  # boca pelo volume do áudio; None se não está falando
        m = self.v.mouth(key, t)
        if m is None: return rest
        return (mapping or {'open': 'open', 'mid': 'mid', 'closed': rest})[m]
    def falando(self, key, t): return self.v.mouth(key, t) is not None


class Video:
    def __init__(self, proj, seq, fps=FPS):
        self.proj = os.path.abspath(proj); self.A = f'{self.proj}/audio'
        self.R = json.load(open(f'{self.proj}/roteiro.json', encoding='utf8'))
        info = json.load(open(f'{self.A}/falas.json', encoding='utf8'))
        self.dur = {k: v['dur'] for k, v in info.items()}; self.voz = {k: v['voz'] for k, v in info.items()}
        self.txt = {k: v['texto'] for k, v in info.items()}; self.ext = {k: v.get('externo', False) for k, v in info.items()}
        self.cue = {}; self.shots = []; cur = 0.0; self._mouth = {}
        for i, d in enumerate(seq):
            S = Shot(i, d, self); S.s0 = cur
            cont = bool(S.falas) and all(self.ext.get(k) is True for k in S.falas)  # narração externa: pausas já vêm no áudio
            cur += 0 if cont else GAP0
            if not S.falas: cur += d.get('dur', CARD_DUR)
            for k in S.falas: self.cue[k] = round(cur, 3); cur += self.dur[k] + (0 if self.ext.get(k) is True else GAP)
            cur += d.get('hold', 0 if cont else 0.12); cur = max(cur, S.s0 + d.get('min', 0)); cur = round(cur * fps) / fps
            S.s1 = cur; self.shots.append(S)
        self.shots[-1].s1 = round((cur + 0.5) * fps) / fps; self.end = self.shots[-1].s1
        self.fmt = os.environ.get('FORMATO') or self.R.get('formato', '16:9'); self.OW, self.OH = kit.set_formato(self.fmt); self._util = {}
        self.estilo = os.environ.get('ESTILO') or self.R.get('estilo', 'noturno'); kit.set_estilo(self.estilo)
        self.rapido = (os.environ.get('QUALIDADE') or self.R.get('qualidade', 'rapida')) == 'rapida'  # padrão: modo rápido (720p); "alta" = 1080p
        kit.ESCALA = self.q = 2 / 3 if self.rapido else 1.0; self.PW, self.PH = int(round(self.OW * self.q / 2)) * 2, int(round(self.OH * self.q / 2)) * 2
        self.legendas = self.R.get('legendas', self.OW / self.OH < 1.5)  # padrão: legendas ligadas fora do 16:9
        self.OUT = f"{self.proj}/tomadas_{self.fmt.replace(':', 'x')}"; os.makedirs(self.OUT, exist_ok=True)
        self.video = f"{self.proj}/video_{self.fmt.replace(':', 'x')}.mp4"

    def mouth(self, key, t):
        if key not in self.cue: return None
        if key not in self._mouth: self._mouth[key] = mouth_track(f'{self.A}/{key}.wav')
        i = int(round((t - self.cue[key]) * FPS)); tr = self._mouth[key]
        return tr[i] if 0 <= i < len(tr) else None

    def _sig(self, S):  # muda se o tempo ou o código da tomada mudar -> re-render
        import inspect
        src = inspect.getsource(S.d['draw']) if 'draw' in S.d else ''
        d = {k: v for k, v in S.d.items() if k != 'draw'}
        kit = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'kit.py'), encoding='utf8').read()
        return hashlib.md5(f"{self.fmt}{self.q}{self.estilo}{self.legendas}{S.s0}{S.s1}{json.dumps(d, default=str, sort_keys=True)}{src}{kit}".encode()).hexdigest()[:10]

    # ------------------------------------------------ desenho de um quadro
    def frame(self, S, f, surf):
        c = surf.getCanvas(); d = S.d; t = f / FPS; OW, OH = self.OW, self.OH; V = OW / OH < 1.5  # 9:16, 1:1 e 4:5 usam focus_v/zoom_v
        n0, n1 = int(round(S.s0 * FPS)), int(round(S.s1 * FPS)); e = ease((f - n0) / max(n1 - n0 - 1, 1))
        card = 'card' in d
        z0, z1 = d.get('zoom_v' if V else 'zoom', d.get('zoom', (1.0, 1.03) if card else (1.0, 1.07)))
        fo = d.get('focus_v' if V else 'focus', d.get('focus', (960, 540))); f0, f1 = (fo, fo) if isinstance(fo[0], (int, float)) else fo
        z = lerp(z0, z1, e); fx, fy = lerp(f0[0], f1[0], e), lerp(f0[1], f1[1], e)
        zb = 0.0; tw = tsig = rz = 0.0
        if self.R.get('transicao') == 'zoom':  # troca de cena com movimento de câmera, um tipo diferente a cada corte
            NT = 7; TIPOS = ('entra', 'lado', 'sai', 'gira', 'lado2', 'entra', 'gira2', 'sai')
            def mov(tipo, u, saindo):
                nonlocal z, zb, tw, tsig, rz
                if tipo == 'entra': z *= (1 + 0.9 * u * u) if saindo else (1 + 0.6 * u * u); zb = max(zb, u)
                elif tipo == 'sai': z *= (1 - 0.42 * u * u) if saindo else (1 - 0.3 * u * u); zb = max(zb, u)
                elif tipo in ('lado', 'lado2'):
                    sd = 1 if tipo == 'lado' else -1; tw += (-sd if saindo else sd) * u * u * 1100 * OW / 1920; tsig = max(tsig, u * 46 * OW / 1920)
                else:
                    sd = 1 if tipo == 'gira' else -1; rz += (sd if saindo else -sd) * u * u * 28; z *= 1 + 0.45 * u * u; zb = max(zb, u * .8)
            if S.i < len(self.shots) - 1 and n1 - f <= NT: mov(TIPOS[(S.i + 1) % len(TIPOS)], (NT - (n1 - f)) / NT, True)
            if S.i > 0 and f - n0 < NT: mov(TIPOS[S.i % len(TIPOS)], 1 - (f - n0) / NT, False)
        bs = max(OW / W, OH / H); zz = z * bs  # escala "cobrir": o mundo 1920x1080 preenche qualquer formato
        S.view = (fx - OW / 2 / zz, fy - OH / 2 / zz, fx + OW / 2 / zz, fy + OH / 2 / zz); S.vertical = V
        wx = sig = shx = shy = 0; k_ = OW / 1920
        prev = self.shots[S.i - 1].d if S.i > 0 else {}
        if d.get('whip') and n1 - f <= 5: wx = -((6 - (n1 - f)) ** 2) * 34 * k_; sig = (6 - (n1 - f)) * 16 * k_
        if prev.get('whip') and f - n0 < 4: wx = (4 - (f - n0)) ** 2 * 52 * k_; sig = (4 - (f - n0)) * 18 * k_
        wx += tw; sig = max(sig, tsig)
        for sh in d.get('shake', []):
            ts = S.at(sh)
            if ts <= t < ts + .35: k = 1 - (t - ts) / .35; shx = 16 * k * math.sin(t * 90); shy = 12 * k * math.cos(t * 77)
        c.resetMatrix(); c.scale(self.q, self.q)  # desenha em coordenadas de 1080p; o modo rápido só reduz os pixels
        c.clear(C((0, 0, 0))); c.save()
        if card:
            c.translate(OW / 2 + wx, OH / 2); c.scale(z, z); c.translate(-OW / 2, -OH / 2)
            txt = d['card'] or (self.txt[S.falas[0]] if S.falas else '')
            if S.falas: k = S.falas[0]; card_text(c, txt, t, self.cue[k], self.fala_util(k) - .15)
            else: card_text(c, txt, t, S.s0 + .25, 1.0)
        else:
            c.translate(OW / 2 + wx + shx, OH / 2 + shy); c.rotate(rz); c.scale(zz, zz); c.rotate(d.get('rot', 0) * (e - .5)); c.translate(-fx, -fy)
            d['draw'](c, t, S)
        c.restore()
        if not card: finish(surf, bloom=d.get('bloom', .40)); vignette(c, d.get('vig', .64))
        if zb > 0.02:  # borrão de zoom (cópias ampliadas em cima)
            img = surf.makeImageSnapshot(); c.save(); c.resetMatrix()
            for j in range(1, 10):
                sc_ = 1 + zb * 0.024 * j; c.save(); c.translate(self.PW / 2, self.PH / 2); c.scale(sc_, sc_); c.translate(-self.PW / 2, -self.PH / 2)
                c.drawImage(img, 0, 0, skia.SamplingOptions(skia.FilterMode.kLinear), fp((0, 0, 0), 255 * .42 * zb / j ** .5)); c.restore()
            c.restore()
        if d.get('topo') and not (S.i > 0 and self.shots[S.i - 1].d.get('topo') == d['topo']): topo(c, d['topo'], t - S.s0)  # só quando o assunto muda
        if d.get('tag'): tag(c, d['tag'], (t - S.s0 - .2) / 1.0)
        for lw_ in d.get('lower', []):  # ("NOME|subtítulo", quando[, x, y]); x,y só valem no 16:9
            nm, _, sb = lw_[0].partition('|'); x_, y_ = (lw_[2], lw_[3]) if len(lw_) > 3 and OW == 1920 and OH == 1080 else (70, OH * (.68 if OH > OW else .72 if self.legendas else .86))
            lower_third(c, nm, sb, t - S.at(lw_[1]), x_, y_)
        if self.legendas and not card:
            for k in S.falas:
                legenda(c, self.txt[k], t, self.cue[k], self.fala_util(k), estilo=self.R.get('legenda_estilo'))
        pol = d.get('polaroid')
        if pol and t >= S.at(pol['at']):
            FL = S.at(pol['at']); img = surf.makeImageSnapshot(); c.clear(C((12, 12, 22))); k = ease_out((t - FL) / .32)
            c.save(); c.translate(OW / 2, OH / 2 - 56 * k); c.rotate(-4.0 * k); sc = 1 - .33 * k; c.scale(sc, sc)
            c.drawRect(skia.Rect(-OW / 2 - 30, -OH / 2 - 30, OW / 2 + 70, OH / 2 + 200), fp((0, 0, 0), 120, blur=30))
            c.drawRect(skia.Rect(-OW / 2 - 44, -OH / 2 - 44, OW / 2 + 44, OH / 2 + 170), fp('#F7F2E6'))
            c.drawImageRect(img, skia.Rect(-OW / 2, -OH / 2, OW / 2, OH / 2), skia.SamplingOptions(skia.FilterMode.kLinear))
            c.drawRect(skia.Rect(-OW / 2, -OH / 2, OW / 2, OH / 2), ink(4, INK, 160))
            if pol.get('ring') and t > FL + .3:  # anel vermelho em volta do personagem (coordenadas do cenário)
                rx, ry = pol['ring']; hxs = (rx - fx) * zz; hys = (ry - fy) * zz; cu = min((t - FL - .3) / .4, 1)
                rg = skia.Path(); rg.addArc(skia.Rect(hxs - 185 * zz, hys - 190 * zz, hxs + 195 * zz, hys + 175 * zz), -110, 352.0 * ease(cu)); c.drawPath(rg, ink(18, RED))
            if t > FL + .68:
                txt_ = pol.get('text', ''); sz = fit(txt_, 118, OW - 80, FONT_HAND)
                label(c, txt_, -OW / 2 + 40, OH / 2 + 128, sz, RED, font=FONT_HAND, skew=0, alpha=min((t - FL - .68) / .12, 1))
            c.restore(); fl = max(0, 1 - (t - FL) / .22)
            if fl > 0: c.drawRect(skia.Rect(0, 0, OW, OH), fp('#FFFFFF', 255 * fl))
        if sig:
            img = surf.makeImageSnapshot(); c.save(); c.resetMatrix(); c.clear(C((0, 0, 0)))
            bp = skia.Paint(); bp.setImageFilter(skia.ImageFilters.Blur(sig * self.q, 0.01, skia.TileMode.kClamp)); c.drawImage(img, 0, 0, skia.SamplingOptions(), bp); c.restore()

    def fala_util(self, k):  # duração da fala sem o silêncio do fim (para cartões e legendas)
        if k not in self._util:
            s, sr = sf.read(f'{self.A}/{k}.wav'); s = s.mean(1) if s.ndim > 1 else s
            idx = np.where(np.abs(s) > 0.02 * (np.abs(s).max() + 1e-9))[0]; self._util[k] = (idx[-1] / sr) if len(idx) else self.dur[k]
        return self._util[k]

    def render(self, i):
        S = self.shots[i]; out = f'{self.OUT}/{i:03d}.mp4'; sig = self._sig(S)
        if os.path.exists(out) and os.path.exists(out + '.sig') and open(out + '.sig').read() == sig:
            print('pula', i, '(já pronta)', flush=True); return
        n0, n1 = int(round(S.s0 * FPS)), int(round(S.s1 * FPS)); surf = skia.Surface(self.PW, self.PH); tmp = out + '.tmp.mp4'
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgra', '-s', f'{self.PW}x{self.PH}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for f in range(n0, n1):
            self.frame(S, f, surf); p.stdin.write(surf.makeImageSnapshot().toarray(colorType=skia.kBGRA_8888_ColorType).tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, out); open(out + '.sig', 'w').write(sig); print('feita', i, flush=True)
        else: print('ERRO na tomada', i, flush=True)

    def still(self, i, frac):
        S = self.shots[i]; f = int(round((S.s0 + (S.s1 - S.s0) * frac) * FPS)); surf = skia.Surface(self.PW, self.PH)
        self.frame(S, min(f, int(round(S.s1 * FPS)) - 1), surf); os.makedirs(f'{self.proj}/stills', exist_ok=True)
        fn = f'{self.proj}/stills/s{i:03d}_{int(frac * 100):02d}.png'; surf.makeImageSnapshot().save(fn, skia.kPNG); return fn

    def folha(self, files, out):  # folha de contato 3 colunas
        from PIL import Image
        tw = 640 if self.OW >= self.OH else 360; th = int(tw * self.OH / self.OW); cols = 3 if self.OW >= self.OH else 5
        ims = [Image.open(f).resize((tw, th)) for f in files]; rows = (len(ims) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * tw, rows * th), 'black')
        for k, im in enumerate(ims): sheet.paste(im, ((k % cols) * tw, (k // cols) * th))
        sheet.save(out); return out

    def _fonte(self, size):
        from PIL import ImageFont
        return ImageFont.truetype(kit.FD + 'Kalam-Bold.ttf', size)

    def estilos(self, alvo=None):  # folha com o mesmo quadro em todos os estilos, numerados
        from PIL import Image, ImageDraw
        if alvo: i, frac = int(alvo.split(':')[0]), float(alvo.split(':')[1])
        else: i, frac = next(S.i for S in self.shots if 'draw' in S.d), .6
        atual = self.estilo; ims = []
        for n, nome in enumerate(kit.ESTILOS, 1):
            kit.set_estilo(nome); fn = self.still(i, frac); im = Image.open(fn).convert('RGB')
            tw = 480 if self.OW >= self.OH else 300; im = im.resize((tw, int(tw * self.OH / self.OW)))
            d = ImageDraw.Draw(im); f = self._fonte(30 if tw > 400 else 24)
            d.rectangle([0, 0, tw, 44], fill=(10, 12, 26)); d.text((12, 4), f"{n}. {kit.ESTILOS[nome]['nome']}", font=f, fill=(255, 240, 200))
            ims.append(im)
        kit.set_estilo(atual)
        cols = 3; w, h = ims[0].size; rows = (len(ims) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * w + (cols + 1) * 8, rows * h + (rows + 1) * 8), (30, 30, 36))
        for k, im in enumerate(ims): sheet.paste(im, (8 + (k % cols) * (w + 8), 8 + (k // cols) * (h + 8)))
        out = f'{self.proj}/estilos.png'; sheet.save(out); return out

    def storyboard(self):  # uma miniatura por tomada, com número, tempo e fala
        from PIL import Image, ImageDraw
        tw = 420 if self.OW >= self.OH else 240; th = int(tw * self.OH / self.OW); cap = 120; f = self._fonte(22); fb = self._fonte(24)
        cards = []
        for S in self.shots:
            im = Image.open(self.still(S.i, .9 if 'card' in S.d else .65)).convert('RGB').resize((tw, th))
            box = Image.new('RGB', (tw, th + cap), (248, 244, 232)); box.paste(im, (0, 0)); d = ImageDraw.Draw(box)
            d.text((8, th + 4), f"#{S.i}  {S.s0:.1f}–{S.s1:.1f}s", font=fb, fill=(150, 30, 40))
            txt = ' '.join(self.txt[k] for k in S.falas) or (S.d.get('card') or '(sem fala)')
            words = txt.split(); lines = ['']
            for w in words:
                if d.textlength((lines[-1] + ' ' + w).strip(), font=f) > tw - 16: lines.append(w)
                else: lines[-1] = (lines[-1] + ' ' + w).strip()
            for j, ln in enumerate(lines[:3]): d.text((8, th + 34 + j * 27), ln + ('…' if j == 2 and len(lines) > 3 else ''), font=f, fill=(30, 30, 36))
            cards.append(box)
        cols = 4 if self.OW >= self.OH else 6; w, h = cards[0].size; rows = (len(cards) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * w + (cols + 1) * 10, rows * h + (rows + 1) * 10), (30, 30, 36))
        for k, im in enumerate(cards): sheet.paste(im, (10 + (k % cols) * (w + 10), 10 + (k // cols) * (h + 10)))
        out = f'{self.proj}/storyboard.png'; sheet.save(out); return out

    def checar_elenco(self, falhar=False):
        """Se o roteiro.json tem elenco do editor, todo personagem desenhado precisa vir dele (ou ser marcado figurante=True)."""
        el = self.R.get('elenco')
        if not el: return True
        kit.USADOS.clear(); surf = skia.Surface(64, 64)
        for S in self.shots:
            if 'draw' in S.d: self.frame(S, int(round((S.s0 + S.s1) / 2 * FPS)), surf)
        fora = kit.USADOS.count(None); usados = {n for n in kit.USADOS if n and n != 'figurante'}; sobra = [n for n in el if n not in usados]
        ok = fora == 0
        if not ok: print(f'ATENÇÃO: {fora} personagem(ns) desenhado(s) fora do elenco do editor. Use EL["nome"] no cenas.py (ou figurante=True para extras).')
        if sobra: print('(info) do elenco, não entraram em cena:', ', '.join(sobra), '— normal se a história não precisa deles; NÃO acrescente personagem só para usar o elenco')
        if ok: print('elenco ok:', ', '.join(sorted(usados)) or '(nenhum personagem)')
        if falhar and not ok and not os.environ.get('FORCAR'): sys.exit('render cancelado: corrija o cenas.py (ou rode com FORCAR=1)')
        return ok

    def juntar(self):
        lst = f'{self.OUT}/lista.txt'
        with open(lst, 'w') as f:
            for i in range(len(self.shots)):
                if not os.path.exists(f'{self.OUT}/{i:03d}.mp4'): sys.exit(f'falta a tomada {i}: rode render de novo')
                f.write(f"file '{self.OUT}/{i:03d}.mp4'\n")
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', self.video], check=True)
        print(os.path.basename(self.video), 'ok')

    def final(self, nome=None):
        nome = nome or f"final_{self.fmt.replace(':', 'x')}.mp4"
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', self.video, '-i', f'{self.proj}/mix.wav', '-map', '0:v', '-map', '1:a',
                        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', f'{self.proj}/{nome}'], check=True)
        print(f'{nome} ok')


_V = None
def _render_global(i): _V.render(i)  # os processos filhos herdam o vídeo (fork), sem copiar nada


def main(v, argv=None):
    global _V; _V = v
    a = argv or sys.argv[1:]; cmd = a[0] if a else 'info'
    if cmd == 'info':
        for S in v.shots: print(f"{S.i:3d} {S.s0:7.2f}-{S.s1:7.2f}  {('CARTÃO ' + str(S.d['card'])) if 'card' in S.d else S.d['draw'].__name__:28s} {' '.join(S.falas)}")
        print(f'duração {v.end:.1f} s ({v.end / 60:.1f} min) | {len(v.shots)} tomadas | formato {v.fmt} ({v.PW}x{v.PH}{", modo rápido" if v.rapido else ""}) | estilo {v.estilo} | legendas {v.legendas}')
    elif cmd == 'stills':
        fs = [v.still(int(x.split(':')[0]), float(x.split(':')[1])) for x in a[1:]]
        print(v.folha(fs, f'{v.proj}/stills/folha.png'))
    elif cmd == 'tudo':  # render com todos os processadores + áudio + junção + final, num comando só
        import multiprocessing as mp, time
        v.checar_elenco(falhar=True)
        n = max(1, os.cpu_count() or 1); t0 = time.time()
        ordem = sorted(range(len(v.shots)), key=lambda i: -(v.shots[i].s1 - v.shots[i].s0))  # as mais longas primeiro: divide melhor
        with mp.get_context('fork').Pool(n) as pool:
            for k, _ in enumerate(pool.imap_unordered(_render_global, ordem), 1): print(f'{k}/{len(ordem)} tomadas | {time.time() - t0:.0f} s', flush=True)
        import audio; audio.mix(v); v.juntar(); v.final()
        print(f'pronto em {(time.time() - t0) / 60:.1f} min | {v.PW}x{v.PH} | {"rápido (720p)" if v.rapido else "alta (1080p)"}')
    elif cmd == 'render':
        idx, n = int(a[1]), int(a[2])
        for i in range(len(v.shots)):
            if i % n == idx: v.render(i)
        print('terminou worker', idx, flush=True)
    elif cmd == 'estilos': print(v.estilos(a[1] if len(a) > 1 else None))
    elif cmd == 'storyboard': print(v.storyboard()); v.checar_elenco()
    elif cmd == 'elenco': v.checar_elenco()
    elif cmd == 'juntar': v.juntar()
    elif cmd == 'audio':
        import audio; audio.mix(v)
    elif cmd == 'final': v.final()
