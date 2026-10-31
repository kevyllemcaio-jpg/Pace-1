# Padrão do canal

Regras que todo vídeo segue. Quem cria um vídeo novo (pessoa ou IA) começa por aqui.

## Estrutura
1. **Abertura = pergunta** (`cenaAbertura`). O primeiro quadro já mostra a pergunta inteira
   ("E SE O SEU *PULO* DOBRASSE TODO DIA?"), porque ele vira a thumb do Short.
2. **Escalada**: uma cena por marco (DIA N + número animado), sempre comparando com algo
   que todo mundo conhece (cesta de basquete, prédio, Torre Eiffel, avião, espaço...).
3. **Virada científica**: "mas a física discorda" / "mas tem um problema" — com o número real.
4. **Final = um texto só** (`cenaFinalIA`): "QUER FAZER VÍDEOS ASSIM COM IA? LINK NA BIO!".
   Uma única chamada (link da bio). Nada de "se inscreva / deixa o like".

## Personagem
- Jaqueta amarela **sem zíper**, calça preta, tênis branco com sola vermelha.
- Cabelo castanho-escuro curto, repartido de lado, com um topete.
- **Sempre caras engraçadas**: troque a expressão a cada cena. Disponíveis:
  `feliz`, `surpreso`, `preocupado`, `dor`, `confiante`, `tedio`, `lingua`, `chocado`,
  `chorando`, `prendendo` + acessórios `oculos`, `suor`.
- Poses: `normal`, `cima`, `aponta`, `cabeca`, `maosRosto`, `aceno`.

## Texto
- Legendas curtas: no máximo ~22 caracteres por linha. `*palavra*` fica amarela.
- Números conferidos (comentário no topo de cada arquivo em `videos/`).

## Comandos
- `npm run previa -- estudio/videos/<video>.js` → um PNG por cena em `saida/`
- `npm run video -- estudio/videos/<video>.js` → MP4 vertical em `saida/`
