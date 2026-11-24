#!/bin/bash
cd /root/vid/serie16
fazer() { cd /root/vid/s2e$1 && python3 cenas.py tudo > tudo.log 2>&1; cd /root/vid/serie16 && ./capa_v.sh /root/vid/s2e$1 escudo-triangular-t2-ep$2 "$3" "$4" "$5" > /root/vid/s2e$1/capa.log 2>&1; echo "ep$2 $(tail -1 /root/vid/s2e$1/capa.log)"; }
fazer 2 7 "6:.6" "MIL MOEDAS" "PELA CABEÇA DELE"
fazer 3 8 "4:.6" "O ESPIÃO" "VOLTOU"
fazer 4 9 "16:.6" "O ESCUDO OU" "A VIDA DELE?"
fazer 5 10 "11:.6" "O TRIÂNGULO" "FECHOU A FENDA"
