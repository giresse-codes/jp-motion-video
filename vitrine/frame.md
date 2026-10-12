# frame.md — charte de la vitrine JP Service Express Urbaine

## Concept

« Douala s'anime. » Une ville isométrique lumineuse, baignée d'une lumière chaude de fin de journée,
où tout bouge en permanence (voitures, piétons, pirogues, oiseaux, nuages). Les véhicules JP
Service, rouges, la traversent : le rouge est la signature, jamais le décor.

## Couleurs

| Rôle                | Valeur    | Usage                                                          |
| ------------------- | --------- | -------------------------------------------------------------- |
| Crème (fond)        | `#F7F1E8` | fonds, voiles derrière les textes, cartes                      |
| Encre               | `#1B2333` | textes sur fond clair                                          |
| Bleu nuit           | `#0E1B2E` | ciel haut, nuit (scène 5), voile de la scène 4                 |
| Jaune doré          | `#F6C445` | mots forts, lumière, traînées, taxis                           |
| Orange              | `#F2994A` | alertes, badges, lumière rasante                               |
| Turquoise           | `#2BB5A8` | Wouri, puces, trajets, accents secondaires                     |
| Rouge marque        | `#E10600` | logo, véhicule JP, prix, bouton WhatsApp (accent seulement)    |
| Rouge néon          | `#FF2D1F` | halo du véhicule JP, numéro final                              |
| Blanc chaud         | `#F5F2F0` | marquages, fenêtres, textes sur fond sombre                    |

Le rouge n'apparaît que sur un élément fort par scène. Couleur dominante variée par scène :
doré (accroche), orange (problème), turquoise/crème (services), bleu nuit (chauffeurs),
nuit étoilée dorée (appel). Dégradés doux radiaux uniquement (pas de banding H.264).

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
- Liseré doré sur les boulevards, traînée dorée derrière le véhicule JP, halo rouge sous lui.
- La nuit (scène 5) : fenêtres blanc chaud et dorées, lampadaires, pont illuminé, lucioles.

## Mouvement

- Caméra unique (rule `3d-camera-flight`) : plongées `power4.out`, repositionnements `power2.inOut`,
  micro-dérive permanente, aucun mouvement linéaire.
- Entrées en ressort (`back.out`, `elastic` léger) avec anticipation ; les textes clés sont lus
  à l'arrêt (≥ 1 s).

## Zones sûres (1080×1920)

Texte important entre y = 250 et y = 1570, marges latérales 70 px.

## À éviter

Bleu, jaune, violet ; texte en dégradé ; liseré gauche sur les cartes ; tout centré sans hiérarchie.
