---
workflow: general-video
flow: automation
storyboard: yes
message: "Certains déplacements ne peuvent pas attendre : JP Service, votre chauffeur privé à Douala, réservé en un message WhatsApp."
destination: tiktok-reels
aspect: 1080x1920
language: fr
audience: "Clientèle exigeante de Douala qui veut un déplacement privé, ponctuel et sûr (vouvoiement)"
length: 40-50s
angle: problème → bascule → solution
---

## Intent

Nouvelle pub verticale pour JP Service Express Urbaine, positionnée comme un chauffeur privé
(pas un taxi) : quand on veut, où on veut. Récit en trois temps calé sur la voix off de
l'utilisateur : la tension d'un départ à l'aéroport (18 h, vol à 20 h, bouchons), la bascule
(« Certains déplacements ne peuvent pas attendre. Ils méritent un chauffeur. »), puis la solution
(un message WhatsApp, chauffeur confirmé, arrivée à l'heure, usages et prix) et une fin fière.

## Assets

- sources/reference.mp4 — vidéo de référence de style (non commitée, marque tierce) : reproduire le style, jamais ses marques.
- sources/voix-perso-brute.wav — voix de l'utilisateur (MP4, remplace la voix Voicebooking), nettoyée par scripts/nettoyer-voix.sh.
- assets/audio/musique.mp3 — « Cinematic Corporate Business Background » (Alex Morgan, Pixabay), fournie par l'utilisateur, libre de droits.
- assets/logo.png — logo JP Service (détouré).

## Customizations

- Style de la référence : fond crème uni #F3EEE6 + léger vignettage, très épuré ; un seul accent rouge (logo) pour le bloc des mots clés et quelques éléments forts ; texte anthracite, mots pas encore prononcés en gris clair.
- Ligne du temps horizontale graduée utilisée comme horloge (18h00 → 19h00).
- Interfaces miniatures réalistes : billet d'avion, carte de Douala, conversation WhatsApp, cartes de services ; apparitions, zooms et sorties doux, ombres légères, flou de profondeur.
- Sous-titres mot par mot en bas (sans-serif grasse), synchronisés sur la voix.
- Transitions : zooms, flous de mouvement, écran noir pour « Ils méritent un chauffeur ».
- Fin sur fond sombre : vagues lumineuses rouges, logo, « Votre chauffeur privé, où vous voulez, quand vous voulez. », « Rapide. Sûr. Confortable. » mot par mot, bouton « RÉSERVER SUR WHATSAPP → » cliqué, puis +237 655 394 028.
- WhatsApp affiché seulement (non lu) pendant « Un message suffit. » et la phrase suivante : « Bonjour, un chauffeur à 18h15, Bonapriso → aéroport, avec 2 valises. » puis « Confirmé ✅ Votre chauffeur arrive à 18h10. »
- Carte de trajet : véhicule privé jusqu'à l'aéroport, « 18h52 ✓ ».
- 4 cartes d'usages en éventail avec illustration : « Un chauffeur pour la journée » · « Vos rendez-vous d'affaires » · « Une balade privée dans Douala » · « Limbé, Kribi, Yaoundé ». Prix discrets : Confort 4 000 FCFA/h, Aéroport dès 8 000 FCFA, Voyage dès 50 000 FCFA/jour.
- Mixage et sound design émotionnels (voir scripts/mixer.py) ; voix toujours au premier plan, ducking.
- Image de couverture 1080×1920 « Votre vol part à 20h. ».

## Notes

- Format : 1080×1920, 30 i/s, H.264 10–15 Mb/s, AAC 48 kHz, 40–50 s, -14 LUFS.
- Zones sûres : rien d'important dans les 250 px du haut, les 400 px du bas, les 150 px de droite ; sous-titres au-dessus de la zone du bas.
- « Il est 18 heures » visible dès la première image.
- Méthode : voix nettoyée + 3 images test, puis piste audio mixée validée AVANT de synchroniser la vidéo ; un commit par scène.
- Réseau filtré : banques de sons en ligne inaccessibles ; sons d'interface uisfx (CC0), le reste fabriqué (scripts/mixer.py).
- Dépôt public : aucune clé, aucun média sans droits ; la référence reste dans sources/ (ignoré).
