# frame.md — charte de la pub « chauffeur privé »

## Concept

« L'heure qui tourne. » Une feuille crème presque vide, une règle graduée qui sert d'horloge,
et de petites interfaces réelles (billet, carte, WhatsApp) qui passent devant nous comme des
objets posés sur une table. La tension vient du temps ; la solution tient dans un message.

## Couleurs (strictes)

| Rôle            | Valeur    | Usage                                                         |
| --------------- | --------- | ------------------------------------------------------------- |
| Crème (fond)    | `#F3EEE6` | fond de toutes les scènes claires, vignettage léger           |
| Anthracite      | `#1D1D1F` | texte prononcé, graduations principales                       |
| Gris clair      | `#BDB5AA` | mots pas encore prononcés, graduations secondaires            |
| Rouge JP        | `#E10600` | bloc des mots clés, point du trajet, bouton, rares accents    |
| Blanc chaud     | `#FBF8F3` | cartes et interfaces, texte dans le bloc rouge                |
| Nuit            | `#0E0C0C` | écran noir de la bascule, fond de la fin                      |

Un seul accent : le rouge, jamais plus d'un élément rouge fort à la fois. Les interfaces gardent
leurs couleurs fonctionnelles discrètes (vert WhatsApp des bulles, jaune des taxis) mais désaturées.

## Typographie

- Sous-titres et phrases : **Inter 700** (embarquée, `assets/fonts/`), interlettrage -0,02 em,
  56–64 px pour les sous-titres, 84–96 px pour les phrases de bascule au centre.
- Repères de la règle, heures, billet : **Space Mono 400/700** (embarquée par HyperFrames).
- Corps minimum 30 px dans les interfaces (lecture sur téléphone).

## Mise en page (1080×1920)

- Zones sûres : rien d'important au-dessus de y = 250, sous y = 1520, ni à droite de x = 930.
- Sous-titres : bloc centré sur x ∈ [70, 930], ligne de base vers y = 1440.
- Règle-horloge : y = 1190 ; objets posés au-dessus (centre vers y = 760).
- Phrases de bascule : centrées dans x ∈ [80, 920], y ≈ 900.

## Matière et mouvement

- Interfaces : coins 22–28 px, ombre douce `0 30px 60px rgba(40,30,20,.16)`, légère inclinaison 3D.
- Entrées : montée + mise au point (flou → net) `power3.out` 0,5–0,7 s ; sorties : glissement
  latéral avec flou de mouvement `power2.in` 0,35–0,45 s.
- Mots : passent du gris à l'anthracite à l'instant exact où ils sont prononcés ; le bloc rouge
  s'étire derrière les mots clés au fil de la voix.
- Fond toujours vivant : vignettage qui respire, grain très fin, règle qui avance.
