#!/bin/bash
# fazer.sh <n> <tomada:frac> "<linha1>" "<linha2>" : renderiza, faz capa sem legenda e junta
set -e; D=/root/vid/longo$1; SLUG=escudo-triangular-longo-ep$1; cd $D
python3 cenas.py tudo > tudo.log 2>&1
python3 - <<'PY'
import json; R=json.load(open('roteiro.json')); R['legendas']=False; json.dump(R,open('roteiro.json','w'),ensure_ascii=False,indent=1)
PY
python3 cenas.py stills $2 > /dev/null 2>&1
python3 - <<'PY'
import json; R=json.load(open('roteiro.json')); R['legendas']=True; json.dump(R,open('roteiro.json','w'),ensure_ascii=False,indent=1)
PY
I=$(echo $2 | cut -d: -f1); F=$(echo $2 | cut -d: -f2 | sed 's/^\.//'); ST=$(ls -t stills | grep "^s$(printf %03d $I)_" | head -1)
/root/vid/serie16/capa16.sh $D $SLUG $ST "$3" "$4"
python3 /root/vid/serie16/capitulos.py $D > capitulos.txt 2>/dev/null
echo PRONTO $SLUG
