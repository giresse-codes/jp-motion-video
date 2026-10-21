# Kit JP PAPIER (HyperFrames)

Composants et modèle de projet pour les vidéos au **style JP PAPIER**. Les règles de design de tous les
styles (COMMUN, JP UI, JP PAPIER, JP PAPIER, JP PREMIUM) sont dans le `frame.md` à la racine du dépôt :
c'est la seule source de vérité. Ce fichier ne documente que le code du kit.

- `js/jp-papier.js` + `css/jp-papier.css` : composants (objet global `JPPapier`).
- `index.html` + `js/demo.js` : démo de chaque composant (point de départ d'une nouvelle vidéo).
- `scripts/nouvelle-video.sh pub-<nom>` : crée une vidéo JP PAPIER (copie le kit et `frame.md`).
- `scripts/transcrire.py` : transcription de secours de la voix (Whisper small via GitHub) au format
  `hyperframes transcribe`, quand Hugging Face est bloqué.
- `scripts/sons.py` : nappe et effets en pistes séparées (positions dans `window.T.sfx`) ; `npm run carve`
  fait baisser la nappe sous la voix (/hyperframes-audio).

## Composants

```yaml
components:
  texte-surligne:
    code: "JPPapier.texteSurligne(tl, { de, a, phrases, classe })"
    description: "Bloc en haut à gauche ; chaque mot apparaît à son horodatage (transcription), le mot clé (« * ») reçoit un trait moutarde qui se dessine de gauche à droite. classe : '' | 'clair' (fond brun) | 'seul' | 'centre'."
  montre:
    code: "JPPapier.montre(tl, { parent, de, a, depart: [9,50], arrivee: [9,59.7] })"
    description: "Gros plan de montre dessinée en SVG ; aiguilles qui avancent, anneau moutarde qui se remplit. Hook typique."
  horloge:
    code: "JPPapier.horloge(tl, { parent, x, y, taille, heure: [10,12], de, fond })"
    description: "Horloge murale qui apparaît avec un rebond ; affiche une heure fixe (retard, avance)."
  telephone:
    code: "JPPapier.telephone(tl, { parent, de, heure, date, notifications: [{ t, appli, couleur, titre, texte }] })"
    description: "Téléphone posé, écran verrouillé ; les notifications arrivent en haut, poussent les précédentes, le téléphone vibre. JPPapier.notification(...) pour une bannière seule."
  conversation:
    code: "JPPapier.conversation(tl, { parent, de, contact, messages: [{ t, texte, moi }], ecrit: [[debut, fin]] })"
    description: "Gros plan téléphone sur une messagerie générique (aucun logo) : bulles moutarde (moi) et carte (lui), trois points qui clignotent pendant que l'autre écrit."
  pancarte:
    code: "JPPapier.pancarte(tl, { parent, texte: 'M. Serge', sousTexte, de, a })"
    description: "Pancarte tenue à deux mains (chauffeur qui attend), texte en Caveat, souligné moutarde, léger balancement."
  chauffeur:
    code: "JPPapier.chauffeurJP(parent, { dos, brasLibre })"
    description: "Chauffeur JP dessiné en code (casquette, costume sombre, sourire), de face ou de dos ; renvoie tête, paupières et bras pour les petits gestes. Provisoire : à remplacer par ses illustrations quand elles existent."
  note:
    code: "JPPapier.noteManuscrite(tl, { parent, x, y, titre, lignes, t })"
    description: "Papier manuscrit en Caveat posé de biais ; pour montrer un dossier, une liste, des chiffres."
  outro:
    code: "JPPapier.outroJP(tl, { parent: '#camera', de, badge })"
    description: "1,5 s : cercle moutarde tracé comme une signature autour de l'emblème JP, « JP Service Express Urbaine » (Urbaine en rouge logo), « Chauffeur privé · Douala », bouton moutarde « WhatsApp · +237 655 394 028 » ; badge d'offre facultatif au-dessus du cercle."
  cadre:
    css: ".jp-cadre (+ .jp-fond-flou, .jp-decoupe)"
    description: "Illustration fournie posée en cadre arrondi (40 px) avec ombre douce, dans la zone utile ; découpe nette devant un décor flouté."
```

## Workflow d'une vidéo

1. `jp-papier/scripts/nouvelle-video.sh pub-<nom>` puis déposer la voix dans `assets/audio/voix.mp3`.
2. Transcrire (`npx hyperframes transcribe assets/audio/voix.mp3`, ou `python3 scripts/transcrire.py assets/audio/voix.mp3`), relire le texte.
3. Écrire `js/temps.js` et `js/main.js` avec les composants ; découper les illustrations nécessaires.
4. `python3 scripts/sons.py` puis `npm run carve`.
5. Avant chaque rendu : `npm run lint`, puis 5 images clés (`npx hyperframes snapshot --at t1,…,t5`).
6. Aperçu basse résolution, rendu final après validation (`npm run rendu`).

## Pièges connus

- Le surlignage utilise `z-index: -1` dans un mot isolé (`isolation: isolate`) : le lint signale `negative_z_index`, c'est attendu.
- Un trait (`.jp-trait`, barrés) ne porte que `scaleX(0)` en CSS : la rotation va dans le tween, sinon GSAP lit mal la matrice et le trait reste invisible.
- Un élément SVG animé par GSAP (x, y, scale, rotation) ne doit pas porter son propre attribut `transform` : l'envelopper dans un groupe et animer le groupe.
- Les clignements demandent les coordonnées des yeux de chaque illustration.
