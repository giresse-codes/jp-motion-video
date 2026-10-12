---
workflow: general-video
flow: companion
storyboard: yes
message: "JP Service Express Urbaine rend Douala fluide : rapide, sûr, confortable — réservez sur WhatsApp."
destination: tiktok
aspect: 1080x1920
language: fr
audience: investisseurs et portfolio de motion design
length: 45s
angle: vitrine de marque, ville de Douala en 3D isométrique
---

## Intent

Vidéo vitrine de niveau agence pour convaincre les investisseurs de JP Service Express Urbaine
(transport avec chauffeur à Douala) et servir de pièce maîtresse du portfolio de motion designer.
Doit impressionner dès les 3 premières secondes. « Pousse au maximum tes capacités : c'est la
qualité qui compte, pas la vitesse. » 60 i/s, MP4. Version 1920x1080 horizontale aussi
(présentations investisseurs), faite après validation de la verticale.

Univers : une ville de Douala en 3D isométrique illustrée en HTML/CSS/SVG (transform 3D,
perspective) — routes, immeubles, palmiers, le Wouri et son pont, l'aéroport, véhicules JP Service
qui circulent. Style flat-illustration premium, ombres douces. Caméra vivante (zooms, travellings,
rotations légères, parallaxe), ressorts et easing partout, transitions où le zoom traverse un élément,
détails vivants (nuages, oiseaux, fumée, reflets, piétons). Textes lisibles sur téléphone, zone sûre TikTok.

Scénario validé (storyboard présenté en conversation) :
1. 0–5 s accroche : plongée du ciel, ville qui se construit bloc par bloc, logo qui atterrit avec impact,
   « Rapide. Sûr. Confortable. » mot par mot.
2. 5–11 s problème : carrefour saturé, horloges/stress, véhicule JP qui se faufile, feux au vert, trafic fluide.
3. 11–31 s services : 4 quartiers, cartes glassmorphism qui se déplient en 3D, prix en compteurs —
   Éco 3 000 FCFA/h ; Confort 4 000 FCFA/h avec vue éclatée (Wi-Fi, clim, écran) ; Aéroport Éco 8 000 /
   Confort 10 000 FCFA avec avion qui décolle ; Voyage 50 000 FCFA/jour, offre 3 jours 100 000 FCFA,
   carte du Cameroun avec trajet vers Yaoundé, Kribi et Bafoussam.
4. 31–38 s professionnalisme : véhicule en coupe, chauffeur qui ouvre la porte, badges Ponctuel / Sécurisé / Premium.
5. 38–45 s appel à l'action : ville de nuit illuminée, téléphone isométrique sur WhatsApp,
   « Réservez au +237 655 394 028 » qui s'écrit, ding, logo final et slogan.

## Assets

- ../public/logo.png — logo officiel (rouge néon sur noir) ; garder le rouge d'origine.
- ../public/logo-transparent.png — version détourée du logo.
- assets/voiceoff.mp3 — voix off Piper fr_FR-siwis-medium (texte : ../docs/voix-off.md), en attente de validation à l'écoute.
- assets/musique.mp3 — musique optionnelle si fournie (ducking sous la voix).

## Customizations

- Direction artistique lumineuse (refonte demandée par l'utilisateur, la version tout rouge était trop
  rouge) : fond blanc cassé / crème, bleu nuit profond pour la nuit, jaune doré, orange, turquoise,
  dégradés doux, lumière chaude de fin de journée. Le rouge #E10600 / #FF2D1F reste un accent : logo,
  véhicule JP, prix, bouton WhatsApp, un élément fort par scène. Voir frame.md.
- Vie permanente (js/ambiance.js) : circulation continue, piétons, ombres de nuages, reflets du Wouri,
  pirogues, vols d'oiseaux, poussières dorées (lucioles la nuit).
- Repères reconnaissables de Douala : pont sur le Wouri, Akwa, Bonanjo, aéroport.
- Effets sonores synthétisés et doux (scripts/sfx-doux.py, accordés en fa majeur) : souffles d'air,
  marimba, carillon sur les prix, nappe avant l'appel à l'action, cloche WhatsApp, accord du logo.
  Aucun son agressif (impacts, glitch, klaxons retirés à la demande de l'utilisateur).
- Chaque animation clé calée sur les mots de la voix.

## Notes

- Travail scène par scène : 2-3 images clés + commit après chaque scène ; sans réponse sous 15 min, continuer.
- Rendu final avec npx hyperframes render, vérifié (fluidité, lisibilité, synchro, rien de coupé) avant envoi.
- Dépôt public : aucune clé API ni secret. GSAP et polices embarqués localement (CDN bloqué par le réseau).
