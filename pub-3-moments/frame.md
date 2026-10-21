# frame.md — Design system vidéo · JP Service Express Urbaine

Chaque prompt de vidéo commence par : « Utilise frame.md, style JP ___ ».
Les règles de la section COMMUN s'appliquent à TOUS les styles.

## COMMUN (tous les styles)

- Format : vertical 9:16, 1080x1920, 30 fps.
- Zone sûre TikTok : rien d'important dans les 250 px du bas ni dans les 120 px de droite.
- Image 1 = le hook déjà lisible (elle sert aussi de miniature).
- Dernière image = enchaînement possible vers l'image 1 (boucle).
- Voix off : voiceover.mp3. Le texte à l'écran est calé MOT PAR MOT sur la voix, grâce à la transcription du fichier (/media-use). Ne jamais deviner le timing.
- Audio : la musique baisse automatiquement quand la voix parle (/hyperframes-audio). SFX discrets et synchronisés.
- Mouvement : rien ne reste figé plus de 1,5 s.
- Textes lisibles au moins 1,5 s. Accents français corrects. Prix et numéros exacts.
- Interfaces génériques : aucun logo WhatsApp, Google, Apple ou autre marque.
- Assets : images dans assets/ (ne pas redessiner les personnages fournis). Logo : assets/logo-jp.png.
- Infos fixes :
  - Slogan : « Rapide. Sûr. Confortable. »
  - WhatsApp : +237 655 394 028
  - Éco 3 000 FCFA/h · Confort 4 000 FCFA/h (Wi-Fi, clim, mini écran, véhicule premium)
  - Aéroport : Éco 8 000 FCFA · Confort 10 000 FCFA
  - Voyage : 50 000 FCFA/jour · 3 jours 100 000 FCFA · carburant à la charge du client
  - Zone : Douala et environs · Voyages : Yaoundé, Kribi, Limbé, Buea, Ouest
- Vérification : avant chaque rendu final, lancer lint + snapshot de 5 images clés pour validation. Prévisualisation basse résolution d'abord.
- Outro par défaut (1,5 à 2 s) : logo JP, « Rapide. Sûr. Confortable. », « WhatsApp · +237 655 394 028 ». Chaque style peut l'habiller à sa façon (voir ci-dessous).

## STYLE JP UI

Inspiration : pub « Trois Coups ». Pour : pubs courtes et claires (problème → solution en 3 étapes).

- Fond blanc pur, ombres douces sous chaque élément.
- Texte bleu nuit #0B1B4D, mot clé de chaque phrase en bleu vif #3D5BD9. Police Inter (ou SF Pro) Bold, centrée.
- Texte mot par mot : chaque mot passe de flou + transparent à net, avec un glissement de 20 px vers le haut.
- Rouge du logo UNIQUEMENT pour les badges de problème (« +40 min »). Vert #22C55E pour les validations ✓.
- Le récit passe par des interfaces réalistes : notifications noires arrondies qui s'empilent, cartes de trajet avec itinéraire, conversation de messagerie qui s'écrit en direct, téléphone qui glisse au premier plan.
- Interfaces toujours REMPLIES et vivantes : jamais d'écran vide (voiture qui bouge, puces qui s'allument, éléments qui se cochent).
- Structure type : problème (notifications) → bascule plein écran bleu nuit (« Avec JP Service… ») → 3 étapes numérotées (pastille bleu nuit + titre + sous-titre gris) → téléphone avec réservation confirmée → outro.
- Mouvement : ressorts doux, empilements, zoom caméra lent (100 % → 106 %), doigt qui tape sur les boutons.
- SFX : tick (notifications), pop (validations), whoosh (bascules).
- Outro : plein écran bleu nuit, logo JP GRAND et centré (au moins 60 % de la largeur), slogan, pastille blanche WhatsApp.

## STYLE JP PAPIER

Inspiration : Mr Amadou. Pour : histoires avec émotion et leçon (avant / cette fois / leçon), POV, listes.

- Fond beige chaud texturé façon papier (#E9E2D3 → #D9CFBC), vignettage léger, grain subtil. Scènes de nuit ou d'intérieur de voiture : brun chaud #3B2E25.
- Personnages et décors : illustrations plates fournies dans assets/ (palette bleu marine, terracotta, vert sauge, crème). Animés par couches : respiration, clignement des yeux, petits gestes.
- Profondeur : premier plan flou, sujet net, arrière-plan légèrement flou. Zoom caméra lent et continu vers le sujet, rack focus.
- Texte EN HAUT À GAUCHE, marge 60 px, Inter Bold #1A1A1A, 52-64 px, mot par mot. Le mot clé est surligné par un trait de marqueur jaune moutarde #F2C230 qui se dessine de gauche à droite.
- Jaune moutarde = seule couleur vive (anneau de chrono, surlignages, boutons). Rouge du logo JP seulement dans l'outro.
- Gros plans d'objets dessinés en code pour rythmer : montre, horloge, téléphone, pancarte, dossier. Notes manuscrites en police Caveat.
- Transitions douces : fondu enchaîné, glissement de caméra, shader transition discrète. Jamais de coupe brutale.
- Narration au « tu », ton conteur intime.
- SFX feutrés et réalistes : klaxons lointains, tic-tac, portière, clic.
- Outro : logo JP dans un cercle jaune moutarde (façon signature), « Chauffeur privé · Douala », bouton jaune « WhatsApp · +237 655 394 028 ».

## STYLE JP STORIES

Inspiration : Saran. Pour : duels entre deux personnages, tutoriels en étapes, « dans la tête du client ».

- Fond blanc cassé #F5F3EE avec une fine grille de papier millimétré à peine visible.
- Logo JP petit, en haut au centre, présent sur toute la vidéo.
- Badge de série en bas au centre : pastille bleu nuit « JP STORIES » avec une petite icône voiture.
- Personnages illustrés plats (assets/), vêtements à motifs discrets (pois, wax stylisé), animés par couches.
- Les personnages INTERAGISSENT avec des interfaces posées à côté d'eux (conversation de messagerie, carte de trajet, notifications), avec des ombres douces.
- Texte centré sous le logo, Inter Bold : la phrase s'écrit en gris clair, puis les mots passent en noir au rythme de la voix. Mot clé dans une étiquette orange-moutarde #F5A524 qui se pose comme un sticker.
- Étiquettes de contexte en police mono (JetBrains Mono, majuscules, 18 px) dans une pastille : « • SUR WHATSAPP », « • DANS LA TÊTE DU CLIENT », « • ÉTAPE 2 », « • 05:00 · LINDA ».
- Barre d'étapes en bas : 4 icônes rondes bleu nuit #0B1B4D avec un libellé, qui s'allument une par une.
- Cartes score pour les comparaisons : avatar + note (rouge doux pour une mauvaise note, vert #22C55E pour une bonne), points qui se remplissent.
- Citation choc : capitales condensées (Archivo Black), un mot barré en rouge qui tombe, remplacé par le bon mot surligné.
- Couleurs : bleu nuit, orange-moutarde, vert validation. Rouge du logo seulement pour les erreurs et les mots barrés.
- Mouvement : ressorts doux, glissements horizontaux, zooms.
- Outro : logo JP centré, « Rapide. Sûr. Confortable. », bouton WhatsApp, badge « JP STORIES » qui reste en bas.

## STYLE JP PREMIUM

Inspiration : Warner (Maxit) + Raycast. Pour : présenter les services, les prix, les offres.

- Deux ambiances qui ALTERNENT (le contraste donne la vie) :
  - ÉNERGIE : fond en cercles concentriques qui pulsent (doré #F5B82E → orange #F08A24 → crème), rayons de lumière qui tournent, mot GÉANT en arrière-plan (« JP », « CONFORT », « DOUALA ») en gris translucide, coupé par les bords de l'écran.
  - LUXE : fond bleu nuit très profond #070D1F, halo rouge-bordeaux doux venu du logo, projecteur blanc venu du haut, effet verre dépoli (glassmorphism), reflets.
- Objets en 3D brillante : cartes de service façon cartes bancaires (ÉCO, CONFORT, AÉROPORT, VOYAGE), avec icône, prix et reflet qui glisse, qui volent, tournent en perspective et s'empilent en éventail. Téléphone 3D qui pivote et montre une conversation de réservation. Voiture 3D (assets/) qui glisse avec des phares qui s'allument.
- Carrousel sous projecteur : les tuiles défilent horizontalement, celle du centre s'allume et grossit, les autres restent dans l'ombre et le flou.
- Grille de pastilles vitrées qui défilent en diagonale (« Aéroport », « Wi-Fi », « Clim », « Kribi », « Limbé », « À l'heure », « Chauffeur pro »…), une pastille s'allume au centre.
- Typo : Poppins ExtraBold très grande, mots qui arrivent en rotation et en échelle, parfois inclinés. En ambiance LUXE : Inter Medium blanc, sobre.
- Rythme rapide : coupe ou mouvement majeur toutes les 1 à 1,5 s, synchronisé sur le beat. Caméra 3D (perspective, parallax, travelling).
- Transitions : flash blanc (npx hyperframes add flash-through-white), zoom à travers un objet, shader transitions.
- Son : beat afro/amapiano moderne, whoosh, impacts.
- Outro : projecteur sur le logo JP posé sur un socle blanc, lueur, « La route change avec JP. » puis WhatsApp +237 655 394 028.
