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
