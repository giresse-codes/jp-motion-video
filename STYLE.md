# Style « PARDON — DESSIN ANIMÉ » — série « Le pardon divin divin » (MIDIGRAD)

Pour l'utiliser : « Utilise le style de la branche `style-pardon-dessin-anime` ».

Série en 6 épisodes qui raconte le pardon de Dieu, d'Adam jusqu'à aujourd'hui, avec un narrateur, **Wilfried**, toujours présent.

Images de référence (à regarder AVANT de commencer) : `reference/cartoon-1-intro.png`, `reference/cartoon-2-eden.png`, `reference/cartoon-3-autel.png`, `reference/planche-cartoon.png`. Le code qui les a dessinées est dans `reference/apercus-code-source.html` (Canvas 2D) : reprends ses formes, ses couleurs et sa façon de dessiner les personnages comme point de départ, puis fais mieux et anime tout.

## RENDU CHOISI : 3D « dessin animé » (toon 3D) avec de vrais effets
- Les images 2D de `reference/cartoon-*.png` servent pour le DESSIN (personnages, couleurs, décors, mise en page). Le RENDU final est en **3D** : vraie profondeur, caméra qui bouge dans l'espace, lumière et effets animés.
- Référence de rendu : `reference/apercu-anime-autel.mp4` et `reference/apercu-3d-toon.png`, code dans `reference/apercu-3d-toon-source.html` (WebGL fait main). Reprends cette recette avec Three.js et fais beaucoup mieux :
  - **Toon shading** : 2 à 3 paliers de lumière nets (MeshToonMaterial ou shader), contour noir autour de chaque objet (coque inversée ou passe de contours), couleurs franches.
  - **Lumière du jour naturelle** : soleil chaud, ciel bleu avec nuages qui bougent, ombres douces au sol, léger brouillard de profondeur. Jamais de fond noir.
  - **Effets vivants** : feu en particules (cœur jaune-blanc, orange, rouge) qui lèche et vacille, fumée qui monte et se disperse, braises, lumière du feu qui vacille sur les visages, eau qui coule, feuilles et poussière dans le vent, cheveux et vêtements qui bougent.
  - **Personnages vivants** : respiration, clignements, sourcils, bouche synchronisée sur la voix, gestes, marche.
  - **Caméra de cinéma** : travellings, rapprochements, légère profondeur de champ sur le fond.

## L'esprit
- **Dessin animé propre et lumineux**, comme un dessin animé télé moderne : contours noirs épais et réguliers, couleurs franches et naturelles, ombres en paliers nets (cel shading), lumière du jour.
- **Décors riches et dessinés « pour de vrai »** : immeubles avec fenêtres et balcons, palmiers, jardins, tentes, clôtures, ciel avec nuages. Le décor remplit tout l'écran. JAMAIS de fond noir ou vide, jamais d'effet « code ».
- **Personnages originaux** (inventés pour la série, ne copie aucun personnage existant) : grosse tête ronde, grands yeux blancs avec pupilles noires et reflet, sourcils expressifs, petit nez en courbe, bouche qui change selon l'émotion, oreilles, cheveux en forme (crépus, longs, courts). Corps simples, mains rondes.
- Personnages africains / camerounais par défaut pour les gens d'aujourd'hui (peaux brunes de plusieurs teintes), et personnages bibliques aux teintes chaudes.

## Format
- Vertical 9:16, 1080×1920, 30 fps, H.264 CRF 18, yuv420p, AAC 192 kb/s, +faststart.
- Durée : 60 à 120 s par épisode (introduction : 30 à 60 s).
- Voix : Google AI Studio (TTS), une seule voix, celle d'Wilfried. Volume final -14 LUFS, pic max -1 dB.

## Outils
- HyperFrames (ou Remotion avec @remotion/three) + Three.js + GSAP. Scènes 3D toon, particules (Points ou sprites) pour le feu, la fumée et la poussière, post-traitement léger (bloom doux sur le feu, vignette). Textes et médaillon en 2D par-dessus.
- Chaque personnage est découpé en parties animables (tête, yeux, paupières, sourcils, bouche, bras, mains, jambes) pour bouger naturellement : clignements, respiration, gestes, marche.
- Bouche : 5 formes (fermée, petite ouverte, grande ouverte, « o », sourire) synchronisées sur la voix (amplitude + syllabes de la transcription).

## Palette
- Ciel : ~#5EB8F2 → ~#E3F5FB. Herbe : ~#6CC04A / ~#4CAF50. Sable : ~#E9CF9E.
- Encre des contours : ~#1D1A1F. Jaune des titres et mots-clés : ~#FFD23F.
- Couleurs des façades : jaune ~#F4D58D, corail ~#EF8E6A, crème ~#F7F1E3, vert d'eau ~#9BC7A5.

## Caméra et montage (comme un dessin animé télé)
- Décors plus grands que l'écran : la caméra glisse doucement dessus (panoramique), avec 3 à 4 plans de profondeur qui bougent à des vitesses différentes (parallaxe).
- Changement de plan toutes les 2 à 4 s : plan large, plan moyen, gros plan sur un visage qui réagit, gros plan sur un objet (le fruit, la flamme, les mains, la Bible).
- Réactions comiques ou émouvantes sur les visages (yeux qui s'agrandissent, goutte de sueur, larme), petits rebonds à l'apparition des objets.
- Transitions de temps « Remontons à… » : effet de page qui tourne ou de volet coloré, puis titre d'époque dans une étiquette blanche arrondie (« AU COMMENCEMENT », « AU TEMPS DE MOÏSE », « AU TEMPS DU ROI DAVID »…).

## Narrateur WILFRIED (le même dans tous les épisodes)
- Jeune homme camerounais souriant, peau brun foncé, cheveux courts crépus noirs, chemise blanche à boutons, pantalon bleu foncé, chaussures noires, petite Bible marron à tranche dorée dans la main gauche (voir `reference/cartoon-1-intro.png`).
- Il apparaît **en entier** au début (il salue de la main, présente l'épisode) et à la fin (conclusion).
- Pendant les scènes, il est **en bas à gauche dans un médaillon rond** (environ 340 px, double bord noir et jaune, étiquette jaune « WILFRIED » en bas), en buste, devant un petit décor de rue de Douala (voir `reference/cartoon-2-eden.png`). Il parle, cligne des yeux, hoche la tête, réagit à la scène.
- Enregistre ses dessins et animations dans `narrateur/` pour les réutiliser à l'identique.

## Textes à l'écran
- Étiquette d'épisode en haut : pilule blanche, contour noir, texte noir (« ÉPISODE 1 · AU COMMENCEMENT »).
- Sous-titres : en haut de l'image, juste sous l'étiquette (vers 17 à 22 % de la hauteur), 2 lignes maximum, majuscules, police très grasse et arrondie, blanc avec gros contour noir, mot-clé en jaune. Le mot prononcé fait un petit rebond. Quand Wilfried est en entier, les sous-titres passent en bas (vers 88 %).
- Titre de série : « LE PARDON » en jaune avec gros contour noir.
- Versets : carte en parchemin avec contour noir, référence en haut (ex. « GENÈSE 3:6 »), texte Louis Segond 1910 mot pour mot, mots-clés en jaune foncé.

## Règles de représentation
- Adam et Ève toujours habillés de tuniques de feuilles.
- Sacrifices : feu, fumée, prêtre (robe blanche, éphod bleu à pierres de couleur, turban blanc), agneau vivant ; pas de sang ni de violence montrée.
- La croix : émotion par la lumière, le ciel et les visages des témoins ; pas de sang réaliste.
- Jésus : à confirmer avec les pasteurs. Par défaut, de dos ou dans la lumière, sans visage détaillé.
- L'apôtre Paris Talla n'apparaît pas.

## Les 6 épisodes
1. **Au commencement** — Adam et Ève, le péché entre dans le monde (Genèse 2–3, Romains 5:12).
2. **Le sang des sacrifices** — Abel, Moïse et Aaron, les holocaustes, le roi David (Lévitique 17:11, Hébreux 9:22).
3. **La promesse** — les prophètes, Ésaïe annonce le Messie (Ésaïe 7:14, Ésaïe 53).
4. **L'Agneau de Dieu** — Jean-Baptiste, la naissance de Jésus, sa mort à la croix et sa résurrection (Jean 1:29, Jean 19:30).
5. **Jusqu'aux nations** — les disciples prêchent le pardon partout (Luc 24:47, Actes 10:43).
6. **Aujourd'hui** — le pasteur Emmanuel prêche le pardon à tous (2 Corinthiens 5:19-20).

Fin de chaque épisode : logo MIDIGRAD, carte « EUD — Consistoire MIDIGRAD », et « À suivre : épisode n+1 ».
