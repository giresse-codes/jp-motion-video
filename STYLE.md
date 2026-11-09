# Style « PARDON 3D » — série « Le pardon de Jésus-Christ » (MIDIGRAD)

Pour l'utiliser : « Utilise le style de la branche `style-pardon-3d` ».

Série en 6 épisodes qui raconte le pardon de Dieu, d'Adam jusqu'à aujourd'hui, avec un narrateur, **Aurélien**, toujours présent en bas de l'image.

## Références (décrites ici, fichiers non stockés)
1. **Court-métrage « style Pixar »** (un petit singe et un distributeur de boissons) : c'est le LOOK visé. Personnages aux formes douces et très expressifs (gros yeux, sourcils, bouche), lumière dorée de fin de journée, profondeur de champ forte, gros plans sur les visages et les objets, plans très courts.
2. **Vidéo 3D « low-poly »** (personnage et petit robot sur un bureau) : éclairage de cinéma la nuit, fond flou avec bokeh, décor qui apparaît d'abord en fil de fer puis se remplit, sous-titres sur 2 lignes avec un mot-clé en couleur.
3. **Lemo-Opuscar** (plugin Claude Code de 66 styles de film) : outil possible pour le montage et les transitions. Installation : `claude plugin marketplace add lemomo-ai/lemo-opuscar` puis `claude plugin install lemo-opuscar@lemolab`.

Aperçus faits à la main (esquisses, rendu bien inférieur au rendu final) : `reference/apercu-3d-1-eden.png`, `reference/apercu-3d-2-autel.png`, `reference/apercu-3d-3-croix.png`.

## Deux façons de produire
Un vrai rendu « Pixar » (fourrure, peau, lumière réaliste) ne se fait pas avec du code Three.js seul. On choisit donc l'un de ces deux modes pour toute la série :

- **Mode A — look Pixar (recommandé)** : les plans animés sont générés avec **Veo** (Google AI Pro, dans Gemini ou Flow), à partir des prompts de plans fournis pour chaque épisode (clips de 8 s, 9:16). Claude Code fait ensuite tout le reste : montage, narrateur Aurélien, sous-titres, cartes de versets, titres, transitions, musique, mixage.
- **Mode B — tout en code** : Claude Code construit les scènes en 3D (Three.js, ou Blender en script s'il est installé sur le PC). Personnages stylisés inspirés de Pixar : formes rondes, gros yeux, peau douce (MeshPhysicalMaterial, subsurface simulé), éclairage chaud, ombres douces, profondeur de champ et bokeh. Moins réaliste que le mode A, mais gratuit et parfaitement constant d'un épisode à l'autre.

## Format
- Vertical 9:16, 1080×1920, 30 fps, H.264 CRF 18, yuv420p, AAC 192 kb/s, +faststart.
- Durée : 60 à 120 s par épisode.
- Voix : Google AI Studio (TTS), une seule voix, celle d'Aurélien. Volume final -14 LUFS, pic max -1 dB.

## Look
- Lumière de cinéma : dorée de fin de journée (Éden, Galilée), lumière du feu la nuit (sacrifices), lumière froide et pluvieuse (la chute, Golgotha avant la mort), lever de soleil éclatant (résurrection, pardon).
- Profondeur de champ forte, fond flou avec bokeh, poussière dans la lumière, grain très léger, vignette douce.
- L'histoire se lit dans la lumière : plus sombre au moment du péché, de plus en plus lumineuse jusqu'au pardon.
- Palette commune : or chaud ~#FFC846, orange ~#FF9628, bleu nuit ~#0E1A4A, blanc cassé ~#F5F3EE, rouge profond ~#A3161B (avec retenue).

## Caméra et montage
- Plans courts (2 à 4 s), toujours en mouvement : travelling lent, rapprochement vers un visage, gros plan macro sur un objet (le fruit, la flamme, les mains, la pierre roulée), plan large d'établissement à chaque nouveau lieu.
- Transitions de temps « Remontons à… » : le décor se dessine en fil de fer doré puis se remplit, ou la lumière balaie l'image et révèle l'époque suivante. Un titre d'époque apparaît (« AU COMMENCEMENT », « AU TEMPS DE MOÏSE », « AU TEMPS DU ROI DAVID », « 700 ANS AVANT JÉSUS-CHRIST », etc.).

## Narrateur AURÉLIEN (le même dans tous les épisodes)
- Jeune homme camerounais souriant, chemise blanche, pantalon sombre, petite Bible à la main. Style 3D stylisé (formes douces, gros yeux expressifs), créé par Claude Code (Three.js) et enregistré pour être réutilisé à l'identique.
- Il apparaît en entier au début (il présente l'épisode) et à la fin (appel, conclusion).
- Pendant le reste de l'épisode, il est **en bas à gauche**, en buste, dans un médaillon rond d'environ 320 px (bord doré fin, ombre douce), au-dessus de la zone sûre TikTok (bas à 1700 px). Il regarde parfois la scène, montre du doigt, ouvre sa Bible sur les versets.
- Bouche animée sur la voix (amplitude de l'audio et syllabes de la transcription), clignements, hochements, sourcils selon le ton.

## Sous-titres
- 2 lignes maximum, centrés, à environ 64 % de la hauteur (au-dessus du médaillon d'Aurélien).
- Majuscules, Montserrat Black, blanc avec ombre douce. Le mot-clé de la phrase en couleur (or, orange ou cyan clair). Le mot prononcé grossit légèrement (karaoké).

## Versets
- Louis Segond 1910, mot pour mot. Carte façon parchemin doré qui se déroule, référence en haut (ex. « GENÈSE 3:6 »), mots-clés en orange.

## Règles de représentation
- Adam et Ève toujours habillés (pagnes et tuniques de feuilles), jamais de nudité.
- Sacrifices : feu, fumée, prêtre, agneau vivant ; pas de sang ni de violence montrée.
- La croix : émotion par la lumière, le ciel et les visages des témoins ; pas de sang réaliste.
- Jésus : à confirmer avec les pasteurs. Par défaut, il est montré de dos, en silhouette ou dans la lumière, sans visage détaillé.
- L'apôtre Paris Talla n'apparaît pas.

## Les 6 épisodes
1. **Au commencement** — Adam et Ève, le péché entre dans le monde (Genèse 2–3, Romains 5:12).
2. **Le sang des sacrifices** — Abel, Moïse et Aaron, les holocaustes, le roi David (Lévitique 17:11, Hébreux 9:22).
3. **La promesse** — les prophètes, Ésaïe annonce le Messie (Ésaïe 7:14, Ésaïe 53).
4. **L'Agneau de Dieu** — Jean-Baptiste, la naissance de Jésus, sa mort à la croix et sa résurrection (Jean 1:29, Jean 19:30).
5. **Jusqu'aux nations** — les disciples prêchent le pardon partout (Luc 24:47, Actes 10:43).
6. **Aujourd'hui** — le pasteur Emmanuel prêche le pardon à tous (2 Corinthiens 5:19-20).

Fin de chaque épisode : logo MIDIGRAD, carte « EUD — Consistoire MIDIGRAD », et « À suivre : épisode n+1 ».

## Modèle de prompt (épisode)
« VIDÉO "Le pardon" — épisode N. Utilise le style de la branche `style-pardon-3d` (lis STYLE.md). Mode A ou B. Voix : audio/aurelien.mp3. Texte : texte-voixoff.txt. Plans : … (liste fournie). Rends d'abord 3 images fixes, puis le rendu complet sur la branche `video-pardon-episode-N`. »
