# lista de cenas do "100 palavras" (Zeca). Coordenadas relativas ao cenário. 1 cena = 1 fala da narração.
def A(x, y, rz=0, pose='normal', face='feliz', cnt=None, sit=None, z=0, walk=None, head=(0, 0, 0), sc=1.0):
    return dict(x=x, y=y, rz=rz, pose=pose, face=face, cnt=cnt, sit=sit, z=z, walk=walk, head=head, sc=sc)
def CU(x, y, z=2.45, d=2.3, dx=0.0, lens=42, tz=None): return ((x + dx, y - d, z), (x, y, tz if tz is not None else z - 0.05), lens)
def MED(x, y, d=5.2, h=1.9, dx=0.0, lens=35, tz=1.6): return ((x + dx, y - d, h), (x, y, tz), lens)
Z94, Z9 = '9.400', '9.000'
SH = [
 # 0 neste mundo... (rua da escola com alunos, câmera alta)
 dict(set='rua', act=dict(zeca=A(-1.5, 6, 10, cnt=Z94, face='neutro', z=0.2), k0=A(1.2, 6.3, -20, 'aceno', 'feliz', z=0.2), k1=A(2.6, 6.6, -30, 'normal', 'feliz', z=0.2), k2=A(-3.4, 6.8, 20, 'aceno', 'sorriso', z=0.2)),
      cam=((0, -6, 6.5), (0, 8, 2.5), 28), ov=[('tag', '100 PALAVRAS POR DIA')]),
 # 1 se gasta todas, zíper
 dict(set='rua', act=dict(prof=A(0, 6, 0, 'abre', 'surpreso', z=0.2, sc=1.12)), cam=CU(0, 6, z=2.45 * 1.12 + 0.2, d=2.6), keys=[{}, dict(prof=dict(face='zip'))], ov=[('tag', 'ATÉ A MEIA-NOITE')]),
 # 2 quatro meses sem falar (quarto, calendário)
 dict(set='quarto', act=dict(zeca=A(-0.6, 4.0, 20, 'normal', 'zipfeliz', cnt=Z94)), cam=((-0.2, 0.6, 2.2), (-1.4, 5, 2.2), 30), ov=[('tag', '4 MESES')]),
 # 3 guardando pra Mariana (corredor, corações)
 dict(set='corredor', act=dict(zeca=A(-0.4, 3, 15, 'normal', 'apaixonado', cnt=Z94), mari=A(0.9, 9, -10, 'normal', 'sorriso', cnt='100')), cam=MED(-0.2, 3, d=4.2, lens=32), ov=[('hearts',)]),
 # 4 quase todo mundo gasta (rua, dois alunos falando)
 dict(set='rua', act=dict(k0=A(-0.6, 6, 25, 'aceno', 'feliz', z=0.2), k1=A(0.7, 6, -25, 'abre', 'feliz', z=0.2)), cam=MED(0, 6, d=5, h=2.3, tz=1.9), ov=[('words',)]),
 # 5 café custa uma palavra
 dict(set='cafe', act=dict(barista=A(0, 3.6, 0, 'segura', 'sorriso'), mae=A(-0.8, 1.6, 200, 'normal', 'feliz')), cam=((1.6, -1.6, 2.2), (0, 2.8, 1.8), 30), ov=[]),
 # 6 "Café."
 dict(set='cafe', act=dict(mae=A(-0.5, 1.6, 180, 'aponta', 'feliz')), cam=((-0.5, 4.6, 2.4), (-0.5, 1.6, 2.35), 38), ov=[('bubble', 'CAFÉ.')]),
 # 7 pras mães basta uma
 dict(set='sala', act=dict(mae=A(1.2, 3.4, -20, 'aponta', 'serio'), k0=A(-1.2, 3.6, 30, 'normal', 'surpreso')), cam=MED(0, 3.5, d=5, lens=32), ov=[]),
 # 8 "Banho!"
 dict(set='sala', act=dict(mae=A(1.2, 3.4, -10, 'aponta', 'serio')), cam=CU(1.2, 3.4, d=2.4), ov=[('bubble', 'BANHO!')]),
 # 9 avô grita com o futebol
 dict(set='sala', act=dict(avo=A(-1.5, 4.5, 40, 'abre', 'serio', sit=0.75)), cam=((-3.2, 1.6, 2.0), (-1.4, 4.5, 2.0), 32), keys=[{}, dict(avo=dict(face='surpreso', pose='cima'))], ov=[('tag', 'DOMINGO'), ('emojis', '⚽')]),
 # 10 professor de matemática acabou
 dict(set='aula', act=dict(prof=A(1.6, 5.6, -15, 'aponta', 'feliz', sc=1.12)), cam=((0.2, 1.8, 2.6), (1.0, 6.2, 2.4), 30), keys=[{}, dict(prof=dict(face='zip', pose='normal'))], ov=[]),
 # 11 ninguém sabe o resultado
 dict(set='aula', act=dict(k0=A(-2.6, 1.0, 200, 'normal', 'surpreso', sit=0.62), k2=A(0, 1.0, 180, 'normal', 'surpreso', sit=0.62), k3=A(2.6, 1.0, 160, 'normal', 'surpreso', sit=0.62)), cam=((0, 5.6, 2.6), (0, 0.6, 1.4), 26), ov=[('qmarks',)]),
 # 12 palavras ficam guardadas
 dict(set='quarto', act=dict(zeca=A(0, 4.2, 0, 'normal', 'sorriso', cnt=Z94)), cam=CU(0, 4.2, d=2.8, z=2.1, tz=1.9), ov=[]),
 # 13 eu tenho 9.400 (close no pulso)
 dict(set='quarto', act=dict(zeca=A(0, 4.2, 0, 'normal', 'feliz', cnt=Z94)), cam=CU(0, 4.2, d=3.0, z=2.0, tz=1.8), ov=[('counter', '9.400')]),
 # 14 todo mundo acha que sou mudo
 dict(set='corredor', act=dict(zeca=A(0, 4, 0, 'normal', 'zipfeliz', cnt=Z94), k0=A(-1.4, 5.4, 30, 'aponta', 'feliz'), k1=A(1.4, 5.6, -30, 'normal', 'surpreso')), cam=MED(0, 4.5, d=5, lens=32), ov=[]),
 # 15 qualquer um diria só três
 dict(set='rua', act=dict(k0=A(-0.5, 6, 20, 'segura', 'feliz', z=0.2), k1=A(0.6, 6, -20, 'normal', 'apaixonado', z=0.2)), cam=MED(0, 6, d=4.6, h=2.4, tz=2.0), ov=[('bubble', 'EU GOSTO DE VOCÊ')]),
 # 16 eu escrevi um discurso
 dict(set='quarto', act=dict(zeca=A(2.4, 3.8, 150, 'segura', 'serio', cnt=Z94, sit=0.7)), cam=((4.0, 2.6, 2.4), (2.3, 4.5, 1.5), 32), ov=[('tag', 'O DISCURSO')], prop=('papel', 2.4, 4.4, 1.2, 'mesa')),
 # 17 9.400 palavras (papel desenrolando)
 dict(set='quarto', act=dict(zeca=A(0, 3.6, 0, 'segura', 'surpreso', cnt=Z94)), cam=MED(0, 3.6, d=4.6, lens=32), ov=[('tag', '9.400 PALAVRAS')], prop=('papel', 0, 3.1, 1.3, 'longo')),
 # 18 com capítulos
 dict(set='quarto', act=dict(zeca=A(0, 3.6, 0, 'segura', 'feliz', cnt=Z94)), cam=CU(0, 3.6, d=2.6), ov=[('chapters',)], prop=('papel', 0, 3.1, 1.3, 'longo')),
 # 19 Mariana mais bonita (corredor, câmera lenta)
 dict(set='corredor', act=dict(mari=A(0, 6, 0, 'normal', 'sorriso', cnt='100'), k1=A(-1.6, 9, 20, 'normal', 'feliz'), k4=A(1.6, 9.5, -20, 'normal', 'feliz')), cam=MED(0, 6, d=4.6, h=1.7, lens=34, tz=1.9), ov=[('sparkles',)]),
 # 20 e a que mais fala
 dict(set='corredor', act=dict(mari=A(0, 6, -10, 'abre', 'feliz', cnt='100'), k1=A(-1.2, 6.8, 30, 'normal', 'surpreso')), cam=CU(0, 6, d=2.6, dx=0.3), ov=[('words',)]),
 # 21 acabam às 7h30
 dict(set='corredor', act=dict(mari=A(0, 6, 0, 'normal', 'zip', cnt='0')), cam=CU(0, 6, d=2.4), ov=[('tag', '7:30')]),
 # 22 última palavra dela é pra mim
 dict(set='corredor', act=dict(zeca=A(-0.8, 4, 25, 'normal', 'apaixonado', cnt=Z94), mari=A(0.8, 4.4, -25, 'aceno', 'feliz', cnt='1')), cam=MED(0, 4.2, d=4.4, lens=34), ov=[('hearts',)]),
 # 23 "Oi, Zeca."
 dict(set='corredor', act=dict(mari=A(0, 4.4, -10, 'aceno', 'feliz', cnt='1')), cam=CU(0, 4.4, d=2.5), keys=[{}, dict(mari=dict(face='zip', pose='normal'))], ov=[('bubble', 'OI, ZECA.')]),
 # 24 segunda, guardou 20
 dict(set='corredor', act=dict(mari=A(0, 5, 0, 'normal', 'sorriso', cnt='20')), cam=CU(0, 5, d=3.0, z=2.0, tz=1.8), ov=[('tag', 'SEGUNDA'), ('counter', '20')]),
 # 25 fala dela de 20 palavras
 dict(set='corredor', act=dict(zeca=A(-0.8, 4, 20, 'normal', 'surpreso', cnt=Z94), mari=A(0.8, 4.2, -20, 'abre', 'feliz', cnt='20')), cam=MED(0, 4.1, d=4.4, lens=34), keys=[{}, dict(mari=dict(pose='aceno', face='sorriso'), zeca=dict(face='apaixonado'))], ov=[('bubble2', 'OI! EU GOSTO MUITO DO SEU MOLETOM.|VOCÊ NUNCA FALA? APOSTO QUE A SUA VOZ É BONITA.|ATÉ MAIS!')]),
 # 26 queria dizer tudo, balancei a cabeça
 dict(set='corredor', act=dict(zeca=A(0, 4, 0, 'normal', 'zipfeliz', cnt=Z94, head=(12, 0, 0))), cam=CU(0, 4, d=2.4), keys=[{}, dict(zeca=dict(head=(-8, 0, 0)))], ov=[('words',)]),
 # 27 terça, cinquenta
 dict(set='escada', act=dict(zeca=A(-0.6, 2.4, 0, 'normal', 'feliz', cnt=Z94, sit=0.6), mari=A(0.6, 2.4, 0, 'abre', 'feliz', cnt='50', sit=0.6)), cam=MED(0, 2.4, d=4.6, h=1.9, tz=1.4, lens=32, dx=-2.8), ov=[('tag', 'TERÇA')]),
 # 28 gato, música, pesadelo palhaços
 dict(set='escada', act=dict(mari=A(0.6, 2.4, -15, 'abre', 'feliz', cnt='50', sit=0.6)), cam=CU(0.6, 2.4, z=2.05, d=2.4, dx=-1.0), keys=[{}, dict(mari=dict(face='apaixonado')), dict(mari=dict(face='medo', pose='cabeca'))], ov=[('emojis', '🐱|🎵|🤡')]),
 # 29 sua vez
 dict(set='escada', act=dict(mari=A(0.6, 2.4, -25, 'aponta', 'sorriso', cnt='1', sit=0.6), zeca=A(-0.6, 2.4, 15, 'normal', 'surpreso', cnt=Z94, sit=0.6)), cam=MED(0, 2.4, d=4.2, h=1.9, tz=1.4, dx=-2.4), ov=[('bubble', 'SUA VEZ.')]),
 # 30 levantei o polegar
 dict(set='escada', act=dict(zeca=A(-0.6, 2.4, 10, 'polegar', 'sorriso', cnt=Z9, sit=0.6)), cam=CU(-0.6, 2.4, z=1.9, d=2.6, tz=1.6, dx=-0.9), ov=[('emojis', '👍')]),
 # 31 ela olhou pro polegar um tempão
 dict(set='escada', act=dict(mari=A(0.6, 2.4, -20, 'normal', 'neutro', cnt='0', sit=0.6), zeca=A(-0.6, 2.4, 10, 'polegar', 'sorriso', cnt=Z9, sit=0.6)), cam=MED(0, 2.4, d=4.0, h=1.9, tz=1.4, dx=-2.2), ov=[('dots',)]),
 # 32 professor perguntou
 dict(set='aula', act=dict(prof=A(1.6, 5.6, -20, 'aponta', 'serio', sc=1.12)), cam=((0.4, 2.2, 2.7), (1.4, 6, 2.6), 32), ov=[('bubble', '48 + 27, ZECA?')]),
 # 33 respondi com mímica
 dict(set='aula', act=dict(zeca=A(0, -0.8, 180, 'cima', 'serio', cnt=Z9)), cam=((0, 3.0, 2.1), (0, -0.8, 2.0), 34), keys=[{}, dict(zeca=dict(pose='abre'))], ov=[]),
 # 34 castigo com mímica
 dict(set='aula', act=dict(prof=A(1.6, 5.6, -10, 'bate', 'serio', sc=1.12)), cam=CU(1.6, 5.6, z=2.7, d=2.8), ov=[('tag', 'CASTIGO')]),
 # 35 quarta, guardou cem
 dict(set='casa', act=dict(mari=A(-0.3, -1.4, 0, 'normal', 'feliz', cnt='100'), zeca=A(-1.6, -1.6, 0, 'normal', 'surpreso', cnt=Z9)), cam=MED(-1, -1.5, d=5, lens=34), ov=[('tag', 'QUARTA')]),
 # 36 veio comigo até em casa
 dict(set='casa', act=dict(mari=A(-0.2, -0.4, 200, 'abre', 'feliz', cnt='60', walk=1.0), zeca=A(-1.6, -0.6, 160, 'normal', 'sorriso', cnt=Z9, walk=2.6)), cam=((-0.9, -5, 2.2), (-0.9, 0, 1.6), 30), keys=[{}, dict(mari=dict(walk=2.2), zeca=dict(walk=0.6))], ov=[('words',)]),
 # 37 na minha porta, as últimas cinco
 dict(set='casa', act=dict(mari=A(-0.2, 1.6, -20, 'normal', 'sorriso', cnt='5'), zeca=A(-1.5, 2.0, 20, 'normal', 'surpreso', cnt=Z9)), cam=MED(-0.8, 1.8, d=4.4, lens=34), ov=[]),
 # 38 "Então... você gosta de mim?"
 dict(set='casa', act=dict(mari=A(-0.2, 1.6, -20, 'segura', 'apaixonado', cnt='5')), cam=CU(-0.2, 1.6, d=2.4, dx=0.3), ov=[('bubble', 'ENTÃO... VOCÊ\nGOSTA DE MIM?')]),
 # 39 boca dela fechou
 dict(set='casa', act=dict(mari=A(-0.2, 1.6, -20, 'normal', 'zip', cnt='0')), cam=CU(-0.2, 1.6, d=2.0, dx=0.2), ov=[]),
 # 40 eu tinha 9.000, não usei nenhuma
 dict(set='casa', act=dict(zeca=A(-1.5, 2.0, 10, 'normal', 'zipsurpreso', cnt=Z9)), cam=CU(-1.5, 2.0, d=2.4), ov=[('tag', '9.000')]),
 # 41 guardando pra sexta (caixa de presente)
 dict(set='casa', act=dict(zeca=A(-1.5, 2.0, 0, 'segura', 'sorriso', cnt=Z9)), cam=CU(-1.5, 2.0, d=3.0, z=2.0, tz=1.8), ov=[('tag', 'SEXTA')], prop=('papel', -1.5, 1.5, 1.4, 'longo')),
 # 42 ela foi embora em silêncio (pôr do sol)
 dict(set='casa', act=dict(mari=A(1.5, -2.5, 120, 'normal', 'triste', cnt='0', walk=1.2), zeca=A(-1.5, 2.0, -30, 'normal', 'triste', cnt=Z9)), cam=((-1.3, 4.5, 2.6), (0.5, -2, 1.4), 30), ov=[], sunset=True),
 # 43 quinta não me deu oi
 dict(set='corredor', act=dict(zeca=A(-0.6, 3, 20, 'aceno', 'feliz', cnt=Z9), mari=A(0.6, 6, 180, 'normal', 'triste', cnt='100')), cam=MED(0, 4, d=5, lens=32), ov=[('tag', 'QUINTA')]),
 # 44 passou do meu lado sem olhar
 dict(set='corredor', act=dict(zeca=A(-0.5, 4, 30, 'normal', 'triste', cnt=Z9), mari=A(0.6, 3.6, 0, 'normal', 'serio', cnt='100', walk=1.5)), cam=MED(0, 3.8, d=4.6, lens=32), ov=[]),
 # 45 sexta, ensaiei na sala de música
 dict(set='musica', act=dict(zeca=A(-0.2, 2.8, 0, 'segura', 'serio', cnt=Z9)), cam=MED(0, 2.8, d=5, lens=30), ov=[('tag', 'SEXTA')], prop=('papel', -0.2, 2.3, 1.4, 'longo')),
 # 46 rádio ligada (NO AR)
 dict(set='musica', act=dict(zeca=A(-0.2, 2.8, 0, 'segura', 'feliz', cnt=Z9)), cam=((0.6, -0.2, 3.0), (0, 5.8, 3.0), 38), ov=[('tag', 'NO AR')], prop=('papel', -0.2, 2.3, 1.4, 'longo')),
 # 47 9.400 palavras ao vivo
 dict(set='musica', act=dict(zeca=A(-0.2, 2.8, 0, 'segura', 'feliz', cnt='6.997')), cam=CU(-0.2, 2.8, d=2.8, z=2.2, tz=2.0), ov=[('tag', 'AO VIVO')], prop=('papel', -0.2, 2.3, 1.4, 'longo')),
 # 48 todos os alto-falantes
 dict(set='alto', act=dict(), cam=((0, 1.6, 2.8), (0, 3.6, 3.0), 30), ov=[('waves',)]),
 # 49 cantina, quadra, diretoria
 dict(set='aula', act=dict(k0=A(-1.2, 1.0, 180, 'normal', 'surpreso', sit=0.62), k1=A(1.2, 1.0, 180, 'normal', 'surpreso', sit=0.62), diretor=A(0, 5.6, 0, 'segura', 'surpreso', sc=1.1)), cam=((0, -3, 2.8), (0, 4, 2.0), 26), keys=[{}, dict(k0=dict(face='apaixonado'), k1=dict(face='feliz'))], ov=[('waves',)]),
 # 50 uma hora e doze minutos
 dict(set='musica', act=dict(zeca=A(-0.2, 2.8, 0, 'segura', 'sorriso', cnt='812')), cam=MED(0, 2.8, d=4.2, lens=34), ov=[('tag', '1H12MIN')], prop=('papel', -0.2, 2.3, 1.4, 'longo')),
 # 51 capítulo 6: sobrancelhas
 dict(set='corredor', act=dict(mari=A(0, 5, 0, 'cabeca', 'surpreso', cnt='100')), cam=CU(0, 5, d=2.3), ov=[('tag', 'CAP. 6: AS SOBRANCELHAS DELA')]),
 # 52 contador zero, boca fechou
 dict(set='musica', act=dict(zeca=A(-0.2, 2.8, 0, 'normal', 'surpreso', cnt='0')), cam=CU(-0.2, 2.8, d=2.6, z=2.1, tz=1.9), keys=[{}, dict(zeca=dict(face='zipsurpreso', pose='normal'))], ov=[]),
 # 53 a escola inteira no corredor
 dict(set='corredor', act=dict(zeca=A(0, 2, 0, 'normal', 'zipsurpreso', cnt='0'), prof=A(-1.6, 7.5, 20, 'normal', 'surpreso', sc=1.12), k0=A(-1.0, 6, 15, 'normal', 'surpreso'), k1=A(1.1, 6.2, -15, 'normal', 'feliz'), k2=A(1.8, 8.2, -20, 'normal', 'surpreso'), k3=A(-2.0, 9, 20, 'normal', 'feliz'), k4=A(0.4, 9.4, 0, 'normal', 'surpreso'), k5=A(-0.4, 7.2, 5, 'normal', 'feliz')),
      cam=((0, -2.6, 2.2), (0, 6, 1.9), 30), ov=[]),
 # 54 Mariana bem na frente
 dict(set='corredor', act=dict(mari=A(0, 5, 0, 'normal', 'serio', cnt='100'), k1=A(-1.3, 6.5, 15, 'normal', 'surpreso'), k3=A(1.3, 6.8, -15, 'normal', 'feliz')), cam=MED(0, 5, d=4.6, lens=34), ov=[]),
 # 55 não falou nada, contador 100
 dict(set='corredor', act=dict(mari=A(0, 5, 0, 'normal', 'serio', cnt='100')), cam=CU(0, 5, d=3.0, z=2.0, tz=1.8), ov=[('counter', '100')]),
 # 56 "9.000 palavras e nunca disse as três"
 dict(set='corredor', act=dict(mari=A(0, 5, 0, 'aponta', 'triste', cnt='88')), cam=CU(0, 5, d=2.5), ov=[('bubble', '9.000 PALAVRAS. E VOCÊ NUNCA\nDISSE AS TRÊS QUE IMPORTAM.')]),
 # 57 namora comigo?
 dict(set='corredor', act=dict(zeca=A(0, 3, 0, 'segura', 'zipfeliz', cnt='0')), cam=MED(0, 3, d=4.2, lens=34), ov=[('tag', 'NAMORA COMIGO?')], prop=('papel', 0, 2.5, 1.4, 'longo')),
 # 58 respondeu 92 vezes
 dict(set='corredor', act=dict(mari=A(0.5, 3.4, -20, 'cima', 'feliz', cnt='8'), zeca=A(-0.6, 3.2, 20, 'normal', 'zipsurpreso', cnt='0')), cam=MED(0, 3.3, d=4.4, lens=34), ov=[('tag', '92 VEZES')]),
 # 59 sim sim sim (todos comemoram)
 dict(set='corredor', act=dict(mari=A(0.5, 3.4, -20, 'cima', 'feliz', cnt='0'), zeca=A(-0.6, 3.2, 20, 'cima', 'zipfeliz', cnt='0'), k0=A(-1.8, 5.5, 20, 'cima', 'feliz'), k1=A(1.8, 5.8, -20, 'cima', 'feliz'), k2=A(0, 7, 0, 'aceno', 'feliz')),
      cam=MED(0, 4, d=5.6, lens=30), ov=[('sim',), ('confetti',)]),
 # 60 meia-noite, palavras voltaram (quarto)
 dict(set='quarto', act=dict(zeca=A(0, 3.6, 0, 'normal', 'surpreso', cnt='100')), cam=((0.2, 0.4, 2.3), (0, 4.8, 2.3), 34), ov=[('tag', '00:00')]),
 # 61 corri e bati na janela (noite)
 dict(set='casa', act=dict(zeca=A(2.0, 1.6, -30, 'bate', 'serio', cnt='100')), cam=((0.4, -2.2, 2.0), (2.6, 2.6, 1.8), 30), ov=[('tag', 'TOC TOC')], night=True),
 # 62 ela abriu, usei três
 dict(set='casa', act=dict(zeca=A(1.6, 2.0, 60, 'normal', 'apaixonado', cnt='100'), mari=A(2.9, 2.55, -60, 'normal', 'surpreso', cnt='100')), cam=((2.2, -2.2, 2.3), (2.25, 2.3, 2.15), 34), ov=[], night=True),
 # 63 te amo Mariana
 dict(set='casa', act=dict(zeca=A(1.6, 2.0, 60, 'normal', 'feliz', cnt='97'), mari=A(2.9, 2.55, -60, 'normal', 'apaixonado', cnt='100')), cam=((2.25, -0.5, 2.45), (2.25, 2.3, 2.35), 40), ov=[('hearts',)], night=True),
 # 64 toda meia-noite as três primeiras são pra ela
 dict(set='casa', act=dict(zeca=A(1.6, 2.0, 60, 'normal', 'apaixonado', cnt='97'), mari=A(2.9, 2.55, -60, 'normal', 'feliz', cnt='100')), cam=((-1.5, -6, 3.6), (2.0, 2.6, 1.8), 28), ov=[('hearts',)], night=True),
]
