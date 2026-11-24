#!/bin/bash
cd /root/b3d && SAMPLES=12 RES=100 OUT=/root/b3d/out python3 render_shots.py all 2>&1 | grep --line-buffered -E "^OK|Error|Traceback" >> /root/b3d/render.log
echo FIM >> /root/b3d/render.log
