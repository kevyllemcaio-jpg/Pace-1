import sys, os
sys.path.insert(0, '/root/vid/serie16')
import motor
from motor import *
from render import Video, main
PROJ = os.path.dirname(os.path.abspath(__file__))
SEQ = motor.montar(os.path.join(PROJ, 'roteiro.txt'))
if __name__ == '__main__':
    main(Video(PROJ, SEQ))
