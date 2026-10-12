# frame.md — charte de la vitrine JP Service Express Urbaine

## Concept

« Douala s'allume. » Une ville isométrique anthracite que les véhicules JP Service traversent
en traçant des lignes néon rouges — la route du logo devient le fil conducteur de toute la vidéo :
là où passe JP, la ville se remet en mouvement.

## Couleurs (strictes)

| Rôle                | Valeur    | Usage                                                          |
| ------------------- | --------- | -------------------------------------------------------------- |
| Nuit (fond)         | `#0B0C0F` | fond général, ciel haut                                        |
| Anthracite          | `#16181D` | sol, routes                                                    |
| Béton               | `#23262D` | faces d'immeubles à l'ombre                                    |
| Acier               | `#343842` | faces d'immeubles éclairées                                    |
| Toit                | `#454A55` | toits                                                          |
| Rouge marque        | `#E10600` | véhicules JP, accents pleins, badges                           |
| Rouge néon          | `#FF2D1F` | lueurs, traînées lumineuses, chiffres clés                     |
| Blanc chaud         | `#F5F2F0` | textes, marquages au sol, fenêtres allumées                    |
| Braise (rare)       | `#FF8A4C` | lumière de fin de journée sur l'horizon et les arêtes, à doser |

Un seul accent : le rouge. Les neutres sont légèrement teintés vers le chaud. Pas de dégradé
linéaire plein écran sur fond sombre (banding H.264) : lueurs radiales uniquement.

## Typographie

- Titres : **Montserrat 900 italique** (embarquée, `assets/fonts/`), même famille de formes que le
  logo (sans géométrique grasse et inclinée). Interlettrage −0,03 em, tailles 110–190 px.
- Données et étiquettes (prix, quartiers, numéro) : **Space Mono 700/400** (embarquée par
  HyperFrames). La tension : la promesse humaine et énergique (italique) contre l'exactitude du
  service (chiffres en chasse fixe).
- Corps minimum 34 px, étiquettes minimum 26 px (lecture sur téléphone).

## Lumière et matière

- Isométrique flat premium : toits clairs, face sud éclairée (lumière chaude venant de la gauche),
  face est dans l'ombre, ombres portées douces au sol.
- Néon rouge : arêtes de boulevards, traînées derrière les véhicules JP, halo sous les véhicules.
- La nuit (scène 5) : fenêtres blanc chaud et rouges, lampadaires, pont illuminé.

## Mouvement

- Caméra unique (rule `3d-camera-flight`) : plongées `power4.out`, repositionnements `power2.inOut`,
  micro-dérive permanente, aucun mouvement linéaire.
- Entrées en ressort (`back.out`, `elastic` léger) avec anticipation ; les textes clés sont lus
  à l'arrêt (≥ 1 s).

## Zones sûres (1080×1920)

Texte important entre y = 250 et y = 1570, marges latérales 70 px.

## À éviter

Bleu, jaune, violet ; texte en dégradé ; liseré gauche sur les cartes ; tout centré sans hiérarchie.
