# mds.py <n>: gera o .md do episódio longo n (precisa do mp4 e capitulos.txt prontos)
import sys, subprocess
n = int(sys.argv[1]); slug = f'escudo-triangular-longo-ep{n}'; d = f'/root/vid/longo{n}'
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{d}/{slug}.mp4'], capture_output=True, text=True).stdout)
durs = f'{int(dur // 60)} min {int(dur % 60):02d} s'; caps = open(f'{d}/capitulos.txt').read().strip()
E = {
1: ('A Invocação', 'Ele foi invocado como herói… e recebeu o PIOR item do reino | O escudo triangular Ep. 1',
    'Invocado com 3 heróis, ele ganhou um escudo rachado (e o reino inteiro riu)', 'Ataque ZERO: o herói do escudo sobreviveu a 5 lobos sozinho',
    'Quatro pessoas do nosso mundo são invocadas pro reino de Valdora. Três ganham espada, lança e arco. O Kai ganha um escudo triangular rachado, com ataque zero.\nHumilhado nas provas, sem grupo e com dez moedas, ele é mandado sozinho pra Floresta Sombria. E aí descobre o segredo do escudo.\n\nResponde as enquetes do vídeo nos comentários!',
    'escudo em gota/triângulo (moda na Europa por volta de 1200); lobos caçam em grupo e cercam a presa; tempo de reação humana (~0,2 s); origem folclórica da palavra goblin; por que cristal brilha.'),
2: ('O Ladrão de Mapas', 'Roubaram o mapa do herói do escudo… e o ladrão virou herói | O escudo triangular Ep. 2',
    'Duelo na praça: escudo contra a espada sagrada', 'O herói do escudo ganhou o duelo sem dar UM golpe',
    'O Kai precisa transformar 10 moedas em 100, protege uma carroça de uma emboscada, descobre que não pode usar outra arma e humilha o Igor num duelo na praça.\nNaquela noite, alguém rouba o fragmento do mapa. E no dia seguinte, o Igor aparece com ele no castelo.\n\nQuem tu acha que roubou? Responde no começo e confere no fim!',
    'peso real de uma espada medieval (1 a 1,5 kg); a lança como arma mais comum dos exércitos; emboscada em curva de rio; tempo de um golpe de espada; por que lago parado vira espelho.'),
3: ('A Ferreira', 'A ferreira que ODIAVA heróis aceitou consertar o escudo… com uma condição | O escudo triangular Ep. 3',
    '10 marteladas pra salvar o escudo triangular', 'A Fenda abriu antes da hora e só o escudo protegeu a vila',
    'Com o escudo a um golpe de quebrar, o Kai e a Lia sobem os Montes de Ferro atrás da Nina, a ferreira que não trabalha pra herói.\nAvalanche, ponte de corda, teste do som, dez marteladas, minas com ar ruim, têmpera e uma habilidade nova: a Barreira. Bem quando a Fenda abre antes do tempo.\n\nO rei sabia da espada? A, B ou C nos comentários!',
    'velocidade de avalanche; ponte inca de capim refeita todo ano; teste de trinca pelo som; força dos ferreiros; canários nas minas; têmpera do aço; fole e oxigênio; origem de "toque de recolher" (couvre-feu).'),
4: ('A Fenda', 'A Fenda chamou o herói do escudo pelo nome… depois de 500 anos | O escudo triangular Ep. 4',
    'Ele refletiu um RAIO com o escudo', 'Os 4 heróis lutaram juntos pela primeira vez',
    'O Igor quer ir pelo Vale Estreito. O mapa do Kai diz que é uma armadilha. Dois grupos, dois caminhos.\nDeserto Rubro, enigma da ruína, tempestade, um verme gigante, o resgate no vale e o guardião da Fenda. E uma voz que diz: escudo… finalmente.\n\nO Kai já esteve nesse mundo? Comenta!',
    'temperatura do deserto de dia e de noite; só ~20% dos desertos são dunas; cacto não é cantil; dunas que cantam; Cruzeiro do Sul; regra do trovão (3 s = 1 km); cabelo arrepiado em tempestade; formação escudo-lança-arco; triângulo na construção.'),
5: ('A Arma Verdadeira', 'O rei INVOCOU o herói do escudo pra ser sacrificado | O escudo triangular Ep. 5 (FINAL)',
    'O herói da espada apontou a espada pro REI', 'A arma verdadeira do escudo triangular (final da temporada 1)',
    'O Kai descobre o livro dos reis de Valdora: a cada 500 anos, a Fenda pede o escudo. Ele é preso, julgado na praça, e quando o rei manda levar ele pra Fenda… o Igor saca a espada.\nA Égide Triangular, o mapa que era um selo e a última pergunta da temporada: voltar pra casa?\n\nSim ou não? Comenta!',
    'fosso de castelo (esgoto, não jacaré); troca da guarda; fechadura de pinos do Egito antigo; reis registravam tudo por escrito; por que o triângulo não deforma.'),
}
nome, tit, a1, a2, desc, fatos = E[n]
subprocess.run(['python3', '/root/vid/serie16/md16.py', slug, str(n), nome, tit, a1, a2, desc, fatos, durs, caps], check=True)
