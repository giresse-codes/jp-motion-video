# Style « LE DÉBAT » (JP Stories)

Style extrait de la vidéo de référence `apercu-debat.mp4`.
Pour l'utiliser : « Utilise le style enregistré dans la branche `style-debat` ».

## Format technique
- Vertical 9:16, 540×960 (à rendre en 1080×1920 pour la publication)
- 30 images/seconde, H.264 + AAC
- Durée de référence : ~51 s
- Rendu image par image puis encodage avec ffmpeg (libx264)

## Concept
Un débat entre deux personnages qui se répondent en dialogue. Une idée reçue
(« Arnaque ? ») est démontée par un calcul affiché à l'écran, puis la vidéo
se conclut sur un appel à l'action (WhatsApp). Les voix off pilotent tout :
chaque réplique = une bulle + une animation de l'élément du haut.

## Mise en page (de haut en bas)
1. Logo de la marque (icône arrondie, fond noir), centré en haut
2. Pastille « • LE DÉBAT » (fond blanc, police mono, majuscules, espacées)
3. Zone visuelle centrale, qui change selon la scène :
   - carte de verdict (« ARNAQUE ? » en rouge, puis « BON PLAN ✓ » en vert,
     avec des points de progression 5 étapes)
   - calculatrice (écran bleu nuit, touches blanches, touches orange + et −)
   - fin : logo grand + slogan + bouton WhatsApp vert
4. Bulle de dialogue (fond blanc, ombre douce, coins très arrondis) avec
   le nom du personnage en petit, en mono et en majuscules, au-dessus du texte
5. Deux personnages à mi-corps, côte à côte, en bas
6. Pastille « JP STORIES » (bleu nuit, texte blanc, mini icône voiture)

## Palette
- Fond : blanc cassé / crème avec quadrillage très léger (papier millimétré)
- Bleu nuit (écran calculatrice, pastille) : ~#0B1B5C
- Orange (touches, surlignage, bandeau) : ~#F5A623
- Rouge (verdict « ARNAQUE ») : ~#D93025
- Vert (verdict « BON PLAN », bouton WhatsApp) : ~#1FA855
- Texte : presque noir ; texte déjà dit ou secondaire en gris clair

## Typographie
- Texte des bulles : sans-serif très gras (type Inter / Plus Jakarta), gros
- Étiquettes, pastilles, écran de calculatrice : monospace (type JetBrains Mono),
  majuscules, espacement des lettres large
- Mots-clés d'une réplique surlignés dans un rectangle orange arrondi
  (ex. « Éco », « 5 », « 10 000 », « Confort »)
- Mots pas encore prononcés en gris clair, qui passent au noir en suivant
  la voix off (effet karaoké)

## Personnages
- Illustration plate, vectorielle, sans contour, peau brune, visages simples
  (yeux ronds, sourcils expressifs)
- Rodrigue : homme barbu, pull bleu à pois blancs
- Nadège : femme, foulard orange à motifs, boucles d'oreilles dorées,
  robe verte à motifs jaunes/orange
- Celui qui ne parle pas est flou et en retrait ; celui qui parle est net
- Le locuteur change d'expression selon la réplique (surpris, sceptique, souriant)
- À la fin, Rodrigue tient un téléphone affichant « +237 »

## Animations et rythme
- Entrée des éléments : fondu + léger glissement vertical, ressort doux
- Le texte de la bulle se révèle mot à mot, calé sur la voix off
- Calculatrice : chiffres qui s'écrivent, puis le résultat apparaît
  (ex. « 4 × 2 500 = ? » puis « = 10 000 »)
- Moment de bascule : le signe « = » grossit dans un disque orange, avec
  confettis, puis un bandeau orange incliné (« 5e HEURE OFFERTE ») entre par la droite
- Verdict : la carte rouge « ARNAQUE ? » est remplacée par la carte verte « BON PLAN ✓ »
- Fin : logo + slogan « Rapide. Sûr. Confortable. » (dernier mot surligné
  en orange) + bouton WhatsApp avec le numéro
- Une scène change à chaque réplique (environ toutes les 2 à 4 secondes)

## Structure type d'une vidéo (51 s)
1. Accroche : une affirmation choquante (« Arnaque ? »)
2. Le sceptique pose l'objection avec un chiffre
3. L'experte répond en posant le calcul, étape par étape
4. Révélation : le résultat qui retourne l'argument (bascule, confettis)
5. Seconde objection, seconde réponse chiffrée
6. Verdict « BON PLAN »
7. Appel à l'action : numéro WhatsApp + slogan

## Modèle de prompt à réutiliser
> Crée une vidéo verticale 9:16 dans le style « LE DÉBAT » (voir STYLE.md,
> branche `style-debat`). Sujet : [sujet]. Personnages : Rodrigue (sceptique)
> et Nadège (experte). Voix off : [fichiers audio]. Éléments du haut :
> [calculatrice / verdict / autre]. Appel à l'action : [numéro / texte].
> Cale chaque bulle et chaque animation sur le texte de la voix off.
