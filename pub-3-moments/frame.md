---
version: 1
name: JP Stories — Frame (série vidéo JP Service Express Urbaine)
description: >
  Système de design de la série « JP Stories » : récits illustrés verticaux pour JP Service Express
  Urbaine (chauffeur privé, Douala). Illustrations plates fournies, papier beige texturé, texte noir
  en haut à gauche qui s'écrit mot par mot sur la voix, un seul accent vif (jaune moutarde),
  rouge du logo réservé à l'outro. Chaque nouvelle vidéo de la série part de ce fichier.
unit: le cadre — 1080×1920 (9:16), 30 i/s
principle: les atomes sont sacrés · la mise en page est libre · le texte suit la voix

colors:
  papier-1: "#E9E2D3"        # haut du dégradé papier
  papier-2: "#D9CFBC"        # bas du dégradé papier
  brun: "#3B2E25"            # scènes d'intérieur de voiture et de nuit
  encre: "#1A1A1A"           # tout le texte sur papier
  encre-2: "#5B5246"         # texte secondaire (sous-titres, dates)
  creme: "#F6EEDF"           # texte sur fond brun
  carte: "#FBF7EE"           # surfaces claires : notes, cadrans, notifications
  moutarde: "#F2C230"        # SEULE couleur vive : surlignage, anneaux, coches, boutons
  rouge-logo: "#E10600"      # uniquement dans l'outro (« Urbaine »)

typography:
  texte:        { fontFamily: "Inter", px: 58, weight: 700, lineHeight: 1.22, tracking: "-0.02em", color: "encre" }   # plage 52–64 px
  texte-seul:   { fontFamily: "Inter", px: 80, weight: 700, lineHeight: 1.2, color: "encre" }    # plan de transition sur papier vierge
  phrase-cle:   { fontFamily: "Inter", px: 92, weight: 700, lineHeight: 1.1, color: "encre" }    # phrase clé centrée
  secondaire:   { fontFamily: "Inter", px: 44, weight: 600, lineHeight: 1.2, color: "encre-2" }
  manuscrit:    { fontFamily: "Caveat", px: 46, weight: 700, lineHeight: 1.25, color: "encre" }  # notes, fiches (jusqu'à 104 px sur une pancarte)
  chiffre:      { fontFamily: "Inter", px: 120, weight: 700, tracking: "-0.04em", color: "encre" } # heure d'écran, compteurs

spacing:
  marge: "60px"              # gauche et haut du texte
  texte-haut: "220px"        # sous l'interface TikTok du haut
  zone-utile: "x 60–960 px, y 520–1660 px"   # cadres d'illustration sous le texte
  sure-bas: "250px"          # rien d'important sous y = 1670
  sure-droite: "120px"       # rien d'important à droite de x = 960

components:
  texte-surligne:
    code: "JPStories.texteSurligne(tl, { de, a, phrases, classe })"
    description: "Bloc en haut à gauche ; chaque mot apparaît à son horodatage (transcription), le mot clé (« * ») reçoit un trait moutarde qui se dessine de gauche à droite. classe : '' | 'clair' (fond brun) | 'seul' | 'centre'."
  montre:
    code: "JPStories.montre(tl, { parent, de, a, depart: [9,50], arrivee: [9,59.7] })"
    description: "Gros plan de montre dessinée en SVG ; aiguilles qui avancent, anneau moutarde qui se remplit. Hook typique."
  horloge:
    code: "JPStories.horloge(tl, { parent, x, y, taille, heure: [10,12], de, fond })"
    description: "Horloge murale qui apparaît avec un rebond ; affiche une heure fixe (retard, avance)."
  telephone:
    code: "JPStories.telephone(tl, { parent, de, heure, date, notifications: [{ t, appli, couleur, titre, texte }] })"
    description: "Téléphone posé, écran verrouillé ; les notifications arrivent en haut, poussent les précédentes, le téléphone vibre. JPStories.notification(...) pour une bannière seule."
  conversation:
    code: "JPStories.conversation(tl, { parent, de, contact, messages: [{ t, texte, moi }], ecrit: [[debut, fin]] })"
    description: "Gros plan téléphone sur une messagerie générique (aucun logo) : bulles moutarde (moi) et carte (lui), trois points qui clignotent pendant que l'autre écrit."
  pancarte:
    code: "JPStories.pancarte(tl, { parent, texte: 'M. Serge', sousTexte, de, a })"
    description: "Pancarte tenue à deux mains (chauffeur qui attend), texte en Caveat, souligné moutarde, léger balancement."
  note:
    code: "JPStories.noteManuscrite(tl, { parent, x, y, titre, lignes, t })"
    description: "Papier manuscrit en Caveat posé de biais ; pour montrer un dossier, une liste, des chiffres."
  outro:
    code: "JPStories.outroJP(tl, { parent: '#camera', de, badge })"
    description: "1,5 s : cercle moutarde tracé comme une signature autour de l'emblème JP, « JP Service Express Urbaine » (Urbaine en rouge logo), « Chauffeur privé · Douala », bouton moutarde « WhatsApp · +237 655 394 028 » ; badge d'offre facultatif au-dessus du cercle."
  cadre:
    css: ".jp-cadre (+ .jp-fond-flou, .jp-decoupe)"
    description: "Illustration fournie posée en cadre arrondi (40 px) avec ombre douce, dans la zone utile ; découpe nette devant un décor flouté."
---

# JP Stories — Frame

## Overview

JP Stories raconte de petites histoires vraies de Douala (un rendez-vous raté, un trajet serein) comme
un **livre illustré qui s'anime**. Le papier beige porte tout ; les illustrations plates fournies
(`assets/`) sont les acteurs ; le texte noir s'écrit en haut à gauche au rythme exact de la voix,
avec un trait de marqueur jaune moutarde sur le mot qui compte. Ton : calme, chaleureux, rassurant,
premium sans être froid. Une idée par plan.

**Caractéristiques clés :**
- Fond papier beige (dégradé `papier-1` → `papier-2`), grain subtil, vignettage léger. Intérieur de voiture et nuit : `brun`.
- Illustrations fournies, jamais redessinées ; animées par couches (respiration, clignement, petits gestes) et par la caméra.
- Texte Inter Bold `encre`, 52–64 px, en haut à gauche (marge 60 px), mot par mot, calé sur la transcription.
- Un seul accent vif : `moutarde`. Le rouge du logo n'existe que dans l'outro.
- Objets dessinés en code pour rythmer : montre, téléphone, pancarte, horloge ; notes manuscrites en Caveat.

## The Frame

- 1080×1920, 30 i/s. Texte : x 60, y 220, largeur 840. Illustration : cadre x 60–960, y 520–1660.
- Zone sûre TikTok : rien d'important sous y = 1670 (250 px) ni à droite de x = 960 (120 px).
- **Image 1 = hook lisible** (elle sert de miniature) : le texte et le sujet du hook sont déjà à l'écran à t = 0.
- **Boucle** : la dernière image doit pouvoir enchaîner sur l'image 1 (outro qui s'efface sur le hook, ou hook identique).

## Colors

`papier-1/2` est le sol ; `encre` pour tout texte sur papier, `creme` sur `brun`. `moutarde` est la seule
couleur saturée : surlignage, anneaux de chrono, coches, boutons, soulignés. Les couleurs des
illustrations fournies ne comptent pas comme accents. `rouge-logo` : uniquement dans l'outro.
Interdits : noir pur en aplat de fond, autres accents vifs, dégradés colorés.

## Typography

- Inter Bold (700) pour le récit, Inter SemiBold (600) pour le secondaire. Casse de phrase, jamais tout en majuscules.
- Caveat Bold pour l'écriture à la main (notes, fiches, pancartes, barrés au crayon).
- Le mot clé de chaque phrase est surligné ; un seul mot clé par phrase.
- Le texte reprend **les mots exacts de la voix** : chaque mot apparaît quand il est prononcé.

## Depth & Surface

- Premier plan flou (`flouAvant` : silhouette sombre floutée, dossier de chaise), sujet net, arrière-plan flouté (`.jp-fond-flou`).
- Cadres : rayon 40 px, ombre chaude douce. Notes : rayon 10 px, posées de biais (−4°).
- Rack focus : passer le flou du fond au sujet (`filter: blur`) au lieu de couper.

## Components

Tous dans `js/jp-stories.js` (+ `css/jp-stories.css`), déterministes, ajoutés à la timeline GSAP :
`texteSurligne` (+ `depuisTranscription`), `montre`, `horloge`, `telephone` / `notification`, `conversation`, `pancarte`,
`noteManuscrite`, `outroJP`. Aides : `fondu`, `zoomLent`, `respiration`, `clignement`, `flouAvant`.
La démo `index.html` / `js/demo.js` montre chacun en situation.

## Frame Treatments

- **Hook** : gros plan d'objet (montre, téléphone) + phrase courte déjà lisible.
- **Récit** : illustration en cadre, zoom lent vers le sujet, texte en haut à gauche.
- **Intérieur / nuit** : fond `brun`, texte `creme` (le mot clé reste en `encre` sur son trait moutarde).
- **Transition temporelle** (« Le mois suivant ») : papier vierge, texte seul (`classe: "seul"`).
- **Leçon** : fiche à deux colonnes en Caveat, « avant » barré au crayon, « après » coché moutarde.
- **Phrase clé** : centrée, grande (`classe: "centre"`), un seul mot surligné.
- **Outro** : `outroJP`, 1,5 s.

## Composition Rules

- Une idée par plan ; un plan dure au moins le temps de lire son texte (1,5 s minimum).
- **Rien de figé plus de 1,5 s** : zoom lent continu sur chaque plan, respiration des personnages, clignements, petits gestes, objets qui bougent.
- Personnages animés **par couches** : découper (rembg) le personnage du décor, puis la tête / les bras si un geste est nécessaire ; paupières posées avec `clignement`.
- Transitions douces uniquement : fondu enchaîné + glissement (`fondu`), rack focus, ou transition shader discrète (voir `/hyperframes-animation`). **Jamais de coupe brute.**
- Gros plans d'objets pour rythmer, environ un toutes les 8 à 10 s.

## Audio

- Trois pistes séparées : **voix** (`data-audio-group="voix"`), **nappe** (`data-audio-group="musique"`), **sfx** (`data-audio-group="sfx"`).
- La nappe baisse sous la voix avec le **voiceover carve** de `/hyperframes-audio` : `npm run carve` (écrit `data-fx-carve`, `data-fx-chain` et `data-automation` sur la piste nappe). À relancer si la voix ou la nappe change.
- SFX feutrés uniquement : tic-tac, klaxons lointains, portière, clic, crayon, souffle doux (`scripts/sons.py`, positions dans `window.T.sfx`).

## Workflow (chaque vidéo)

1. `scripts/nouvelle-video.sh pub-<nom>` puis déposer la voix dans `assets/audio/voix.mp3`.
2. Transcrire avec `/media-use` (`npx hyperframes transcribe assets/audio/voix.mp3`). Si le modèle ne se télécharge pas : `python3 scripts/transcrire.py assets/audio/voix.mp3`. Relire le texte (noms propres).
3. Écrire `js/temps.js` (plans, mots, sfx) et `js/main.js` avec les composants ; découper les illustrations nécessaires.
4. `python3 scripts/sons.py` puis `npm run carve`.
5. **Avant chaque rendu** : `npm run lint`, puis 5 images clés (`npx hyperframes snapshot --at t1,t2,t3,t4,t5`) envoyées pour validation.
6. Aperçu basse résolution, puis rendu final (`npm run rendu`) seulement après validation.

## Pre-Render Self-Audit

- [ ] Image 1 : hook lisible ; dernière image enchaîne sur l'image 1.
- [ ] Chaque mot apparaît quand il est prononcé ; un mot clé surligné par phrase.
- [ ] Moutarde = seule couleur vive ; rouge logo seulement dans l'outro.
- [ ] Rien dans les 250 px du bas ni les 120 px de droite.
- [ ] Aucun plan figé plus de 1,5 s ; aucune coupe brute.
- [ ] Nappe carvée sous la voix ; SFX discrets.
- [ ] Lint sans erreur ; 5 images clés validées.

## Known Gaps

- Le surlignage utilise `z-index: -1` dans un mot isolé (`isolation: isolate`) : le lint signale `negative_z_index`, c'est attendu.
- Un trait (`.jp-trait`, barrés) ne doit porter que `scaleX(0)` en CSS : la rotation va dans le tween, sinon GSAP lit mal la matrice et le trait reste invisible.
- Les clignements demandent les coordonnées des yeux de chaque illustration (à relever une fois par personnage).
