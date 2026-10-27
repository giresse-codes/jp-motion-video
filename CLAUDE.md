# JP Service Express Urbaine – publicité motion design

Pub vidéo verticale (1080×1920, 30 i/s, environ 59 s, en français) pour JP Service
Express Urbaine, service de transport avec chauffeur à Douala.
Slogan : « Rapide. Sûr. Confortable. ». Faite avec Remotion 4 (React + TypeScript).
Formats visés : WhatsApp Status, TikTok, Reels.

## Commandes

```bash
npm install
npm run dev                 # Remotion Studio (aperçu interactif)
npm run render              # vidéo complète -> out/jp-service.mp4
npx remotion render Scene3-services out/scene3.mp4   # une scène seule, avec sa voix
npx remotion still JPVideo out/image.png --frame=300  # image fixe
npm run typecheck           # vérification TypeScript
npm run aligner             # recale les textes sur la voix off (voir plus bas)
python3 scripts/logo-transparent.py   # régénère le logo détouré
python3 scripts/generer-sfx.py        # régénère les effets sonores (public/sfx/)
scripts/voix.sh texte.txt voix.mp3    # voix off MP3 avec Piper TTS (modèles dans voix/)
```

Si Remotion ne peut pas télécharger son navigateur (réseau filtré), utilise un
Chromium déjà installé : `REMOTION_CHROME=/chemin/headless_shell npx remotion render ...`.

## Structure

- `src/config.ts` : **seule source** des textes, prix, couleurs, médias, repères de voix
  et durées. Aucune scène ne contient de valeur en dur.
- `src/Video.tsx` : assemble les 5 scènes (`TransitionSeries`) et la piste audio.
- `src/Root.tsx` : composition `JPVideo` + une composition `SceneN-id` par scène (aperçus).
- `src/scenes/` : `Intro`, `Probleme`, `Services`, `Professionnalisme`, `AppelAction`.
- `src/components/` : `Media` (Ken Burns photo/vidéo + placeholder), `KineticText`,
  `Effets` (traînées de lumière, reflets, flashs, route néon, finition), `Transitions`
  (zoom flouté avec aberration chromatique, balayage diagonal), `ServiceCard`, `Logo`,
  `WhatsAppIcon`, `Son` (effet sonore à une image donnée).
- `src/lib/timing.ts` : calcule les débuts de scènes et les repères à partir de
  `src/voix-timing.json`.
- `src/lib/audio.ts` : baisse automatique de la musique pendant la voix.

## Calage sur la voix off

1. `public/voiceoff.wav` est la voix. `scripts/voix-texte.txt` contient son texte,
   **une ligne par segment de parole** (entre deux pauses).
2. `npm run aligner` détecte les pauses avec ffmpeg et écrit l'horodatage de chaque mot
   dans `src/voix-timing.json`. Pas de réseau ni de clé API.
3. Les repères (`REPERES` dans `config.ts`) sont retrouvés dans ce fichier par leur phrase.
   Les coupes entre scènes et l'apparition des textes en découlent automatiquement.

Si la voix change : mets à jour `voix-texte.txt`, relance `npm run aligner`. En cas
d'écart entre le nombre de segments et de lignes, le script affiche les segments
trouvés : ajuste le découpage ou `SEUIL_DB` / `PAUSE_MIN_S`.

## Médias (`public/`)

- `logo.png` (fourni) et `logo-transparent.png` (généré).
- `voiceoff.wav`, `musique.mp3` (optionnelle, baissée sous la voix).
- `sfx/` : effets sonores **synthétisés** par `scripts/generer-sfx.py` (whoosh, impacts,
  glitch, tic, pop, bip…), libres de droits. Déclarés dans `SONS` de `config.ts`,
  placés dans les scènes avec `<Son nom="..." a={image} />`, niveau général
  `AUDIO.volumeEffets`.
- `images/` : photos réelles. Chaque plan est déclaré dans `PLANS` de `config.ts`
  (`cadrage` choisit la partie gardée au recadrage vertical).
  Un fichier absent affiche un placeholder propre : la vidéo se rend toujours.
  `chauffeur-porte.jpg` et `chauffeur-gants.jpg` sont ignorés par git (droits à vérifier).
- `videos/` : extraits vidéo de tiers, **ignorés par git** (droits d'auteur).
  Ne pas les publier sans l'accord de leurs auteurs.
- `fonts/` : Montserrat et Inter (licence OFL), chargées hors ligne.

## Voix off Piper (réutilisable)

`scripts/voix.sh` transforme un fichier texte en MP3 (Piper TTS, hors ligne, normalisé -16 LUFS).
Prérequis : `pip install piper-tts`, ffmpeg, et le modèle dans `voix/` (`<voix>.onnx` +
`<voix>.onnx.json` + `MODEL_CARD`). Voix par défaut `fr_FR-siwis-medium` ; changer avec
`VOIX=fr_FR-upmc-medium`. Réglages : `VITESSE`, `PAUSE`, `LOCUTEUR`. Les `.onnx` ne sont
pas commités. Licence : vérifier le `MODEL_CARD` de chaque voix avant un usage commercial.

## Skills HyperFrames (HeyGen)

Installées dans `.claude/skills/` avec `npx skills add heygen-com/hyperframes -a claude-code --copy`
(versions figées dans `skills-lock.json`, mise à jour : `npx skills update -p`).
**Réservées aux prochains projets.** Cette pub reste en Remotion : ne pas la porter vers
HyperFrames et ne pas suivre le routeur `hyperframes` pour la modifier, sauf demande
explicite. HyperFrames est un autre moteur (compositions HTML + GSAP).
Point d'entrée pour un nouveau projet : `hyperframes` (routeur), puis `hyperframes-animation`,
`hyperframes-keyframes`, `hyperframes-audio`, `hyperframes-core`, `hyperframes-cli`, `media-use`.

## Design system vidéo (`frame.md`, HyperFrames)

`frame.md` (racine) est le design system de toutes les vidéos HyperFrames : section COMMUN + styles
JP UI, JP PAPIER, JP STORIES et JP PREMIUM. Chaque prompt dit « Utilise frame.md, style JP ___ ».

Style **JP PAPIER** (fond papier beige, illustrations, texte en haut à gauche surligné moutarde) :
kit dans `jp-papier/` (`js/jp-papier.js` + `css/jp-papier.css`, objet global `JPPapier` ; référence des
composants dans `jp-papier/README.md` ; démo `index.html`). Nouvelle vidéo :
`jp-papier/scripts/nouvelle-video.sh pub-<nom>`, puis le workflow du README (transcription,
`scripts/sons.py`, `npm run carve`, lint + 5 snapshots avant tout rendu).
Transcription de secours si Hugging Face est bloqué : `python3 scripts/transcrire.py` (Whisper small via GitHub).
Vidéos JP PAPIER : `pub-clarisse/`, `pub-atterrissage/`, `pub-3-moments/`, `pub-chauffeur-jp/`, `pub-5-sens/` (photo fournie recadrée par chapitre).
Vidéos JP UI : `pub-calcul/` (« Fais le calcul ») et `pub-bureau/` (« Ton bureau roule ») : écrans pilotés par une horloge dans `js/main.js`.
Vidéo JP STORIES : `pub-debat/` (dialogue Rodrigue / Nadège, personnages dessinés en SVG dans `js/main.js`).
Vidéo JP PREMIUM « FAQ express » : `pub-faq/` (hook ÉNERGIE, 5 cartes vitrées qui se retournent en LUXE).
Vidéo JP PREMIUM (ambiance LUXE seule) : `pub-luxe/` (« Le vrai luxe », voix espacée dans `assets/audio/voix.wav`, sons ASMR synthétisés par `scripts/sons.py`).

Flyers (images fixes 1080×1350) : `flyers/` (HTML + `css/flyer.css`), rendus PNG avec `flyers/scripts/rendre.sh` dans `flyers/rendus/`.

## Skills Three.js

`.claude/skills/threejs-*` (10 skills : fundamentals, geometry, materials, lighting, textures,
animation, loaders, shaders, postprocessing, interaction), copiés depuis
https://github.com/CloudAI-X/threejs-skills (dossier `skills/`, commit b1c6230, licence MIT
annoncée dans son README). Mise à jour : recloner et recopier ; ne pas utiliser les commandes
d'installation du README, elles pointent vers un autre dépôt.

## Conventions

- Code, commentaires et textes en français.
- Toute nouvelle valeur (texte, prix, couleur, durée, fichier) va dans `config.ts`.
- Textes importants dans la zone de sécurité (`ZONE_SURE`) : ni en haut ni en bas
  sous les boutons de TikTok / Reels.
- Couleurs de marque : rouge néon `#E10600` / `#FF2D1F` sur noir, blanc.
- Un commit par scène ou par changement cohérent. Ne jamais commiter `out/`.
- Dépôt public : aucune clé API, aucun secret, aucun média sans droits.
