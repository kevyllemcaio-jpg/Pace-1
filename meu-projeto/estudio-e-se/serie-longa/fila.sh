#!/bin/bash
cd /root/vid/serie16
./fazer.sh 1 0:.6 "5 LOBOS" "E SÓ UM ESCUDO" > /root/vid/longo1/fazer.log 2>&1; echo "ep1 $(tail -1 /root/vid/longo1/fazer.log)"
./fazer.sh 2 63:.45 "O ESCUDO" "HUMILHOU A ESPADA" > /root/vid/longo2/fazer.log 2>&1; echo "ep2 $(tail -1 /root/vid/longo2/fazer.log)"
./fazer.sh 3 56:.3 "10 MARTELADAS" "PRA SALVAR O ESCUDO" > /root/vid/longo3/fazer.log 2>&1; echo "ep3 $(tail -1 /root/vid/longo3/fazer.log)"
./fazer.sh 4 0:.6 "A FENDA" "CHAMOU O NOME DELE" > /root/vid/longo4/fazer.log 2>&1; echo "ep4 $(tail -1 /root/vid/longo4/fazer.log)"
./fazer.sh 5 0:.6 "A ESPADA" "CONTRA O REI" > /root/vid/longo5/fazer.log 2>&1; echo "ep5 $(tail -1 /root/vid/longo5/fazer.log)"
