# jp-motion-video
Il s'agit ici d'un projet de motion design pour une entreprise de transport urbain qui me permettra de travailler et d'améliorer les publicités de l'entreprise 
Projet créé par giresse octobre 2026
test de ma première branche 

## Pub verticale JP Service Express Urbaine (Remotion)

1080×1920, 30 fps, 45 s (1 350 frames). Composition `JPAd`.

```bash
npm install
npm run studio                 # aperçu
npm run render                 # → out/jp-service-pub.mp4 (H.264)
node scripts/stills.mjs 30 200 # captures de contrôle → out/frame-N.png
```

- `src/words.ts` : horodatage mot à mot de la voix (Whisper, orthographe corrigée) → sous-titres + calage des scènes.
- `src/JPAd.tsx` : découpage des scènes (frames), sons (whoosh / tic / pop), sous-titres, fond studio.
- `src/scenes/*` : les 12 scènes. `src/Phone.tsx` : iPhone 3D CSS.
- `assets/voix-off.mp3` : voix d'origine (`voix-off-original.wav`, 49,6 s) avec silences ramenés à 0,42 s max → 44,8 s.
- **Remplaçants à changer** (générés faute de fichiers fournis) : `public/logo.png` (`scripts/gen_images.mjs`),
  `public/voiture-photo.jpg` (illustration, pas une vraie photo), `public/musique.mp3` et `public/sfx/*` (`scripts/gen_audio.py`).
  Remplacez simplement les fichiers dans `public/` puis relancez le rendu.

## Pub « JP Glow » (11 s, style iPhone sombre + pilule vert citron)

Composition `JPGlow` (`src/glow/JPGlow.tsx`) — `npx remotion render JPGlow out/jp-glow-pub.mp4 --codec h264 --crf 18`
Captures : `COMP=JPGlow node scripts/stills.mjs 10 60 130 200 260 320`.
- Référence : `assets/ref-granola.mp4`. Voix : `assets/voix-off-glow.mp3` (9,4 s, non retouchée).
- Musique `public/musique-glow.mp3` et `public/sfx-glow/*` : remplaçants synthétiques (`scripts/gen_audio_glow.py`).
- `public/logo-glow.png` : logo officiel avec le fond noir rendu transparent.

## Pub « JP Pop » (45 s, style Holo : dégradés, collages, 3D)

Composition `JPPop` (`src/pop/`) — `npx remotion render JPPop out/jp-pop-pub.mp4 --codec h264 --crf 18`
Captures : `COMP=JPPop node scripts/stills.mjs 15 150 300 550 700 950 1100 1300`.
- `src/pop/kit.tsx` : palette, mots en dégradé animé, pilules, auras, collage. `src/pop/three.tsx` : mascotte, sphère, bureau (three.js / @remotion/three).
- Référence : `assets/ref-holo.mp4`. Voix : `assets/voix-off-pop.mp3` (original 47,9 s, silences ramenés à 0,48 s max → 43,8 s).
- Musique `public/musique-pop.mp3` et `public/sfx-pop/*` : remplaçants synthétiques (`scripts/gen_audio_pop.py`).
- Palette : gris, kaki, anthracite, noir, blanc + touche de rouge. Photos du client dans `public/pop-img/` (originaux dans `assets/pop-img/`, détourages PNG pour TV, voiture miniature, WhatsApp, étoiles).
