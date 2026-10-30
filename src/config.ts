// Configuration centrale de la pub JP Service Express Urbaine.
// Tous les textes, prix, couleurs, médias et durées se modifient ici :
// les scènes ne contiennent aucune valeur écrite en dur.

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  // Silence ajouté après la fin de la voix pour laisser le logo final à l'écran.
  queueApresVoixS: 2.2,
  // Durée utilisée tant qu'il n'y a pas de voix off.
  dureeSansVoixS: 58,
};

// Zone de sécurité TikTok / Reels / Status : aucun texte important dehors.
export const ZONE_SURE = {haut: 250, bas: 350, cotes: 70};

export const COULEURS = {
  // Couleurs reprises du logo (rouge néon sur fond noir).
  rouge: '#E10600',
  rougeNeon: '#FF2D1F',
  rougeSombre: '#5A0400',
  noir: '#060606',
  noirDoux: '#121212',
  blanc: '#FFFFFF',
  gris: '#BDBDBD',
  whatsapp: '#25D366',
};

export const POLICES = {
  titre: 'Montserrat',
  texte: 'Inter',
  // Police arrondie (OFL) des vidéos lumineuses (VideoQuizSoleil).
  arrondie: 'Fredoka',
};

export const MARQUE = {
  nomLigne1: 'JP Service Express',
  nomLigne2: 'Urbaine',
  slogan: ['Rapide.', 'Sûr.', 'Confortable.'],
  signature: 'Votre trajet, notre priorité.',
};

export const CONTACT = {
  libelle1: 'Réservez',
  libelle2: 'sur WhatsApp',
  indicatif: '+237',
  // Groupes de chiffres affichés un par un, au rythme de la voix.
  numero: ['655', '394', '028'],
};

// Fichiers attendus dans public/. Un fichier absent est remplacé par un
// placeholder propre (photo) ou ignoré (son), et la vidéo se rend quand même.
export const AUDIO = {
  voix: 'voiceoff.wav',
  musique: 'musique.mp3',
  volumeVoix: 1,
  // Niveau général des effets sonores (0 = coupés).
  volumeEffets: 1,
  volumeMusique: 0.55,
  // Volume de la musique pendant que la voix parle.
  volumeMusiqueSousVoix: 0.13,
  // Durée des fondus de la musique autour de la voix (ms).
  fonduMs: 350,
};

// Effets sonores synthétisés par scripts/generer-sfx.py (public/sfx/).
// `volume` est relatif ; AUDIO.volumeEffets règle le niveau général.
export const SONS = {
  whoosh: {fichier: 'sfx/whoosh.wav', volume: 0.55},
  whooshCourt: {fichier: 'sfx/whoosh-court.wav', volume: 0.45},
  impact: {fichier: 'sfx/impact.wav', volume: 0.7},
  boom: {fichier: 'sfx/boom.wav', volume: 0.8},
  montee: {fichier: 'sfx/montee.wav', volume: 0.45},
  scintillement: {fichier: 'sfx/scintillement.wav', volume: 0.35},
  glitch: {fichier: 'sfx/glitch.wav', volume: 0.4},
  tic: {fichier: 'sfx/tic.wav', volume: 0.45},
  neon: {fichier: 'sfx/neon.wav', volume: 0.4},
  pop: {fichier: 'sfx/pop.wav', volume: 0.35},
  prix: {fichier: 'sfx/prix.wav', volume: 0.4},
  bip: {fichier: 'sfx/bip.wav', volume: 0.35},
  notif: {fichier: 'sfx/notif.wav', volume: 0.5},
  reveil: {fichier: 'sfx/reveil.wav', volume: 0.35},
  roulement: {fichier: 'sfx/roulement.wav', volume: 0.4},
};

export const LOGO = 'logo.png';
// Version détourée générée par scripts/logo-transparent.py (utilisée si présente).
export const LOGO_DETOURE = 'logo-transparent.png';

// Un plan = une photo (images/...) ou un extrait vidéo (videos/...).
// `libelle` sert au placeholder si le fichier manque.
// `debutS` = début de l'extrait dans la vidéo source.
// `cadrage` = partie de l'image gardée au recadrage et point de zoom (en %),
// `zoom` = zoom de départ.
export type Plan = {
  src: string;
  libelle: string;
  debutS?: number;
  cadrage?: {x: number; y: number};
  zoom?: number;
  // Vitesse de lecture d'une vidéo (0.5 = ralenti), pour tenir dans le plan.
  vitesse?: number;
  // Masque les filigranes de la vidéo source en zoomant vers le haut.
  masquerBas?: boolean;
};

export const PLANS = {
  // Scène 2 : Douala, embouteillages, retards
  embouteillage: {
    src: 'videos/douala-ville.mp4',
    libelle: 'DOUALA – CIRCULATION',
    debutS: 21.4,
    vitesse: 0.8,
    masquerBas: true,
  },
  retards: {
    src: 'videos/douala-ville.mp4',
    libelle: 'DOUALA – NUIT',
    debutS: 36.2,
    masquerBas: true,
    zoom: 1.3,
  },
  casseTete: {
    src: 'videos/douala-ville.mp4',
    libelle: 'DOUALA – CONDUITE DE NUIT',
    debutS: 12.2,
    masquerBas: true,
  },
  sereinite: {
    src: 'videos/douala-aerien.mp4',
    libelle: 'DOUALA – VUE AÉRIENNE',
    debutS: 1.0,
  },
  // Scène 3 : une photo par service
  eco: {
    src: 'videos/douala-ville.mp4',
    libelle: 'VÉHICULE ÉCO',
    debutS: 28.9,
    vitesse: 0.6,
    masquerBas: true,
  },
  confort: {
    src: 'videos/douala-ville.mp4',
    libelle: 'VÉHICULE CONFORT',
    debutS: 31.6,
    vitesse: 0.6,
    masquerBas: true,
  },
  // Le panneau / bâtiment est remonté au-dessus de la carte (zoom ancré en bas).
  aeroportEntree: {
    src: 'images/aeroport-entree.jpg',
    libelle: 'AÉROPORT – ENTRÉE',
    cadrage: {x: 55, y: 100},
    zoom: 1.3,
  },
  aeroportParvis: {
    src: 'images/aeroport-parvis.jpg',
    libelle: 'AÉROPORT – PARVIS',
    cadrage: {x: 50, y: 100},
    zoom: 1.2,
  },
  aeroportTerminal: {
    src: 'images/aeroport-terminal.jpg',
    libelle: 'AÉROPORT – TERMINAL',
    cadrage: {x: 50, y: 20},
  },
  voyage: {
    src: 'videos/douala-ville.mp4',
    libelle: 'ROUTE – VOYAGE',
    debutS: 25.15,
    vitesse: 0.5,
    masquerBas: true,
  },
  voyageRoute: {
    src: 'videos/douala-aerien.mp4',
    libelle: 'ROUTE – VUE AÉRIENNE',
    debutS: 11.1,
  },
  // Scène 4 : professionnalisme
  chauffeurPorte: {
    src: 'images/chauffeur-porte.jpg',
    libelle: 'CHAUFFEUR QUI OUVRE LA PORTE',
    cadrage: {x: 62, y: 40},
  },
  chauffeur: {
    src: 'images/chauffeur-gants.jpg',
    libelle: 'CHAUFFEUR PROFESSIONNEL',
    cadrage: {x: 80, y: 45},
    zoom: 1.1,
  },
  vehiculePremium: {
    src: 'videos/douala-ville.mp4',
    libelle: 'VÉHICULE PREMIUM',
    debutS: 33.4,
    vitesse: 0.45,
    masquerBas: true,
  },
  interieur: {
    src: 'images/chauffeur-gants.jpg',
    libelle: 'INTÉRIEUR DU VÉHICULE',
    cadrage: {x: 26, y: 55},
    zoom: 1.15,
  },
  // Scène 5 : fond de l'appel à l'action
  nuit: {
    src: 'videos/douala-aerien.mp4',
    libelle: 'DOUALA – VUE AÉRIENNE',
    debutS: 11.1,
    vitesse: 0.3,
  },
} satisfies Record<string, Plan>;

export type Service = {
  id: 'eco' | 'confort' | 'aeroport' | 'voyage';
  nom: string;
  accroche: string;
  // Prix principal, animé en compteur.
  prix: number;
  unite: string;
  prixPrefixe?: string;
  avantages: string[];
  badge?: string;
  mention?: string;
  // Un ou plusieurs plans (la durée est partagée entre eux).
  plan: Plan | Plan[];
};

export const SERVICES: Service[] = [
  {
    id: 'eco',
    nom: 'Éco',
    accroche: 'Le confort au juste prix',
    prix: 3000,
    unite: 'FCFA / heure',
    avantages: [
      'Véhicule confortable',
      'Chauffeur professionnel',
      'Ponctualité',
    ],
    plan: PLANS.eco,
  },
  {
    id: 'confort',
    nom: 'Confort',
    accroche: 'Le premium, tout simplement',
    prix: 4000,
    unite: 'FCFA / heure',
    avantages: [
      'Wi-Fi à bord',
      'Climatisation',
      'Écran YouTube · musique · USB',
      'Véhicule premium',
    ],
    plan: PLANS.confort,
  },
  {
    id: 'aeroport',
    nom: 'Aéroport',
    accroche: 'Votre vol, sans stress',
    prix: 8000,
    prixPrefixe: 'dès',
    unite: 'FCFA',
    avantages: ['Éco : 8 000 FCFA', 'Confort : 10 000 FCFA'],
    plan: [PLANS.aeroportEntree, PLANS.aeroportParvis, PLANS.aeroportTerminal],
  },
  {
    id: 'voyage',
    nom: 'Voyage',
    accroche: 'Partout au Cameroun',
    prix: 50000,
    unite: 'FCFA / jour',
    avantages: ['Chauffeur dédié', 'Départ quand vous voulez'],
    badge: 'Offre 3 jours : 100 000 FCFA',
    mention: 'Carburant à la charge du client',
    plan: [PLANS.voyage, PLANS.voyageRoute],
  },
];

export const TEXTES = {
  probleme: {
    mot1: 'Embouteillages',
    mot2: 'Retards',
    mot3: 'Casse-tête',
    lieu: 'Douala',
    question1: 'Et si vous voyagiez',
    question2: "l'esprit tranquille ?",
  },
  professionnalisme: {
    ligne1: 'Chauffeurs professionnels',
    ligne2: 'Attentifs à chaque détail',
    porte: 'Votre porte, ouverte pour vous',
    final1: 'Traité comme',
    final2: 'vous le méritez',
  },
};

// Repères de la voix off. Chaque repère est retrouvé automatiquement dans
// src/voix-timing.json (transcription locale, `npm run transcribe`).
// `secoursS` est utilisé si le repère est introuvable ou sans voix.
export type Repere = {phrase: string; secoursS: number};

export const REPERES = {
  // Scène 1
  marque: {phrase: 'JP Service', secoursS: 0.35},
  rapide: {phrase: 'Rapide', secoursS: 2.42},
  sur: {phrase: 'Sûr', secoursS: 3.38},
  confortable: {phrase: 'Confortable', secoursS: 4.21},
  // Scène 2
  douala: {phrase: 'À Douala', secoursS: 5.62},
  embouteillages: {phrase: 'embouteillages', secoursS: 6.8},
  retards: {phrase: 'retards', secoursS: 7.6},
  casseTete: {phrase: 'casse-tête', secoursS: 9.7},
  etSi: {phrase: 'Et si vous', secoursS: 11.0},
  tranquille: {phrase: 'tranquille', secoursS: 12.2},
  // Scène 3
  eco: {phrase: 'Avec le service Éco', secoursS: 13.71},
  ecoPrix: {phrase: 'trois mille', secoursS: 15.1},
  ecoAvantages: {phrase: 'profitez', secoursS: 16.3},
  confort: {phrase: 'Envie de plus', secoursS: 19.43},
  confortPrix: {phrase: 'quatre mille', secoursS: 21.9},
  confortAvantages: {phrase: 'Wi-Fi', secoursS: 23.2},
  aeroport: {phrase: 'Un vol', secoursS: 26.98},
  aeroportPrix: {phrase: 'huit mille', secoursS: 29.6},
  voyage: {phrase: 'pour vos voyages', secoursS: 31.4},
  voyagePrix: {phrase: 'cinquante mille', secoursS: 34.78},
  voyageBadge: {phrase: 'cent mille', secoursS: 36.7},
  // Scène 4
  chauffeurs: {phrase: 'Des chauffeurs', secoursS: 38.58},
  detail: {phrase: 'attentifs', secoursS: 40.14},
  porte: {phrase: 'qui vous ouvrent', secoursS: 41.7},
  merite: {phrase: 'Ici', secoursS: 43.29},
  // Scène 5
  reservez: {phrase: 'Réservez', secoursS: 46.08},
  numero: {phrase: 'six cent', secoursS: 48.24},
  numero2: {phrase: 'trente-neuf', secoursS: 49.65},
  numero3: {phrase: 'quarante', secoursS: 50.5},
  numero4: {phrase: 'vingt-huit', secoursS: 51.4},
  logoFinal: {phrase: 'JP Service Express', secoursS: 52.94},
  signature: {phrase: 'votre trajet', secoursS: 54.84},
} satisfies Record<string, Repere>;

// Ordre des scènes et repère de début de chacune.
export const SCENES = [
  {id: 'intro', debut: null},
  {id: 'probleme', debut: 'douala'},
  {id: 'services', debut: 'eco'},
  {id: 'professionnalisme', debut: 'chauffeurs'},
  {id: 'appel', debut: 'reservez'},
] as const;

// Avance des coupes sur la voix (s) : l'image change juste avant la phrase.
export const AVANCE_COUPE_S = 0.25;

// Durée des transitions entre scènes (images).
export const TRANSITION_FRAMES = 14;

// ── Video15 : pub courte « Service aéroport » (15 s) ──
// Temps en secondes ; chaque texte reste lisible au moins 2 s.
export const VIDEO15 = {
  dureeS: 15,
  scenes: {reveil: 0, notif: 3, route: 6, fin: 11},
  textes: {
    heure: '04:30',
    alarme: 'ALARME · VOL 06:00',
    vol: 'Vol à 6 h.',
    appli: 'JP Service',
    notification: 'Votre chauffeur est arrivé.',
    maintenant: 'maintenant',
    service: 'SERVICE AÉROPORT',
    prix: [
      {nom: 'Éco', montant: '8 000 FCFA'},
      {nom: 'Confort', montant: '10 000 FCFA'},
    ],
    reservez: 'Réservez sur WhatsApp',
  },
  // Effets sonores doux (déjà dans public/sfx), volumes bas.
  sons: {alarme: 0.5, notif: 0.7, passage: 0.5, logo: 0.4},
};

// ── Video20 : « Chauffeur à la journée » (20 s) ──
export const VIDEO20 = {
  dureeS: 20,
  scenes: {agenda: 0, stress: 3, carte: 8, fin: 15},
  textes: {
    jour: 'MARDI',
    rendezVous: [
      {heure: '08:30', titre: 'Client', lieu: 'Akwa'},
      {heure: '10:00', titre: 'Banque', lieu: 'Bonanjo'},
      {heure: '12:30', titre: 'Déjeuner', lieu: 'Bonapriso'},
      {heure: '15:00', titre: 'Réunion', lieu: 'Bali'},
      {heure: '17:30', titre: 'Livraison', lieu: 'Deïdo'},
    ],
    agenda: '5 rendez-vous.\n1 journée.',
    stress: ['Parking', 'Chaleur', 'Trafic', 'Retard'],
    question: 'Et si vous ne conduisiez pas ?',
    route: "Votre chauffeur s'occupe de la route.",
    offre: 'Chauffeur à la journée',
    service: 'Service Confort',
    prix: '4 000 FCFA/h',
    fleuve: 'WOURI',
    reservez: 'Réservez sur WhatsApp',
  },
  // Position des 5 rendez-vous sur la carte (repère 1080×880, posé à top 300).
  pins: [
    {x: 230, y: 170}, {x: 770, y: 280}, {x: 330, y: 470}, {x: 800, y: 630}, {x: 440, y: 790},
  ],
  sons: {ligne: 0.3, chute: 0.3, coche: 0.45, passage: 0.35, logo: 0.4},
};

// ── VideoTarifs : « Combien coûte un chauffeur privé à Douala ? » (20 s) ──
export const VIDEO_TARIFS = {
  dureeS: 20,
  // Débuts (s) : hook, 3 cartes toutes les 4 s, récap, fin, retour du hook (boucle).
  temps: {hook: 0, cartes: [2, 6, 10], recap: 14, fin: 17, retour: 19.3},
  hook: ['COMBIEN COÛTE', 'UN CHAUFFEUR', 'PRIVÉ', 'À DOUALA\u00a0?'],
  hookFort: 2, // ligne mise en avant (grande, en rouge)
  cartes: [
    {nom: 'ÉCO', prefixe: '', montant: 3000, unite: 'FCFA/h', detail: 'Simple, propre, à l’heure.', icone: 'voiture', interruption: 'zoom'},
    {nom: 'CONFORT', prefixe: '', montant: 4000, unite: 'FCFA/h', detail: 'Wi-Fi · Clim · Mini écran', icone: 'confort', interruption: 'balayage'},
    {nom: 'AÉROPORT', prefixe: 'dès', montant: 8000, unite: 'FCFA', detail: 'Douala ⇄ aéroport, sans stress.', icone: 'avion', interruption: 'compteur'},
  ],
  recap: 'Récap',
  enregistrez: ['Enregistrez cette vidéo', 'pour la prochaine fois'],
  whatsapp: 'WhatsApp',
  sons: {hook: 0.5, carte: 0.55, balayage: 0.45, compteur: 0.3, fin: 0.4},
};

// ── VideoQuiz : « Vol à 6 h. Vous faites quoi ? » (quiz A/B/C, calé sur la voix off) ──
// Repères (s) issus des pauses de public/audio/quiz-voix.mp3 (ffmpeg silencedetect).
// La voix dure 21,08 s : la vidéo fait 21,3 s pour ne pas la couper.
export const VIDEO_QUIZ = {
  dureeS: 21.3,
  voix: 'audio/quiz-voix.mp3',
  musique: {fichier: 'audio/quiz-groove.wav', boucleS: 4, volume: 0.13},
  temps: {
    reveil: 0, vol: 1.42, question: 3.44,
    cartes: [4.75, 6.91, 9.84],
    suspense: 12.32, barres: [12.5, 12.9], bonne: 13.51,
    transfert: 15.47, prix: 17.1,
    commentez: 18.84, boucle: 20.95,
  },
  heure: '4:30',
  badge: 'QUESTION RAPIDE',
  titre: ['VOL À 6\u00a0H.', 'VOUS FAITES QUOI\u00a0?'],
  rappel: 'Vol à 6\u00a0h. Vous faites quoi\u00a0?',
  cartes: [
    {lettre: 'A', texte: 'Vous réveillez un ami'},
    {lettre: 'B', texte: 'Vous cherchez un taxi dans le noir'},
    {lettre: 'C', texte: 'Votre chauffeur vous attend déjà en bas'},
  ],
  bonneReponse: 2,
  bonneLibelle: 'BONNE RÉPONSE',
  transfert: ['TRANSFERT', 'AÉROPORT'],
  prix: {prefixe: 'dès', montant: '8\u00a0000', unite: 'FCFA'},
  commentez: ['Commentez', 'A, B ou C'],
  sons: {reveil: 1, tick: 0.6, barre: 0.5, bonne: 0.5, avion: 0.4, prix: 0.45, fin: 0.4},
};

// ── VideoQuizSoleil : même quiz, direction artistique « matin doré à Douala » ──
// Lumineuse et joyeuse : fonds clairs et chauds, jamais de noir, rouge seulement en petits détails.
// Repères (s) issus des pauses de public/audio/quiz-soleil-voix.mp3 (ffmpeg silencedetect, voix de 18,6 s).
export const VIDEO_QUIZ_SOLEIL = {
  dureeS: 20,
  voix: 'audio/quiz-soleil-voix.mp3',
  musique: {fichier: 'audio/quiz-groove.wav', boucleS: 4, volume: 0.14},
  palette: {
    creme: '#FFF4E3', sable: '#F6DDB6', ciel: '#8ED6FF', cielClair: '#D8F2FF',
    peche: '#FFB38A', pecheClair: '#FFD9BC', dore: '#FFC94A', jaune: '#FFD23F',
    turquoise: '#2EC4C9', menthe: '#5EDCA8', mentheFonce: '#1FA971', corail: '#FF7A3D',
    encre: '#2B2D42', peau: '#8D5A3B', peauClaire: '#B07A55',
  },
  temps: {
    chambre: 0, vol: 1.19, question: 3.13,
    cartes: [4.07, 5.96, 8.33],
    suspense: 10.63, sorties: [10.8, 11.1], bonne: 11.68,
    transfert: 13.4, prix: 15.05,
    commentez: 16.41, boucle: 19.6,
  },
  segments: [
    {de: 0, a: 0.89, texte: 'Question rapide.'},
    {de: 1.19, a: 2.67, texte: 'Votre vol est à 6 heures du matin.'},
    {de: 3.13, a: 3.65, texte: 'Vous faites quoi ?'},
    {de: 4.07, a: 4.29, texte: 'A'},
    {de: 4.6, a: 5.58, texte: 'vous réveillez un ami.'},
    {de: 5.96, a: 6.3, texte: 'B'},
    {de: 6.59, a: 8.03, texte: 'vous cherchez un taxi dans le noir.'},
    {de: 8.33, a: 8.71, texte: 'C'},
    {de: 8.99, a: 10.63, texte: 'votre chauffeur vous attend déjà en bas.'},
    {de: 11.68, a: 13.14, texte: 'La bonne réponse, c’est C.'},
    {de: 13.4, a: 16.18, texte: 'Transfert aéroport JP Service, dès 8 000 francs.'},
    {de: 16.41, a: 18.39, texte: 'Dites-moi en commentaire, vous auriez choisi quoi ?'},
  ],
  // Mots colorés dans les sous-titres (comparés sans ponctuation ni majuscules).
  motsCles: ['6 heures', 'quoi', 'ami', 'taxi', 'noir', 'chauffeur', 'c', 'aéroport', '8 000', 'commentaire'],
  // Fenêtres sans sous-titres (le grand titre dit déjà la phrase).
  sansSousTitres: [[1.19, 4.07]] as [number, number][],
  heure: '4:30',
  titre: [['VOL', 'À', '6 H.'], ['VOUS', 'FAITES', 'QUOI ?']],
  rappel: 'Vol à 6 h. Vous faites quoi ?',
  cartes: [
    {lettre: 'A', texte: 'Réveiller un ami', couleur: '#FFD23F', illustration: 'ami'},
    {lettre: 'B', texte: 'Chercher un taxi dans le noir', couleur: '#2EC4C9', illustration: 'taxi'},
    {lettre: 'C', texte: 'Votre chauffeur vous attend déjà', couleur: '#5EDCA8', illustration: 'chauffeur'},
  ],
  bonneReponse: 2,
  bonneLibelle: 'BONNE RÉPONSE',
  transfert: ['Transfert', 'aéroport'],
  marque: 'JP SERVICE EXPRESS URBAINE',
  prix: {prefixe: 'dès', montant: '8 000', unite: 'FCFA'},
  commentez: ['Commentez', 'A, B ou C'],
  sons: {reveil: 1, pop: 0.6, sortie: 0.4, roulement: 1, bonne: 0.5, prix: 0.45, fin: 0.45},
};

// ════ « PubPromo » : pub promo 1080×1920 calée sur public/voixoff-promo.mp3 (src/pubpromo/) ════
// Tous les repères sont en secondes ABSOLUES dans la voix off (mesurés : transcription Whisper + silencedetect).
// Pour recaler : modifier ici, les scènes et les sons suivent.
export const PUB_PROMO = {
  voix: 'voixoff-promo.mp3',
  dureeS: 63.5,
  couleurs: {fond: '#0A0A0A', blanc: '#FFFFFF', gris: '#8E8E93', or: '#E8B04B', orClair: '#F8DC9B', orSombre: '#9A6A1C', rouge: '#E10600', vert: '#25D366'},
  // Ressort de base (consigne : stiffness 180, damping 12).
  ressort: {stiffness: 180, damping: 12, mass: 1},
  // Début de chaque scène (une <Sequence> par scène, jusqu'au début de la suivante).
  scenes: {ville: 0, cartes: 2.9, logo: 9.5, services: 13.2, slogan: 31.1, pause: 34.6, promo: 36.35, cta: 55.65},
  ville: {titre: 0.05, vousNonPlus: 1.96},
  cartes: {
    items: [
      {texte: 'Rendez-vous d’affaires', icone: 'mallette', a: 3.02},
      {texte: 'Vol à prendre', icone: 'avion', a: 4.45},
      {texte: 'Week-end à Kribi', icone: 'palmier', a: 6.02},
    ],
    meriter: 7.3,
    morphe: 9.0,
  },
  logo: {chute: 9.74, nom: 10.4, chauffeur: 11.55},
  services: {
    onglets: ['ÉCO', 'CONFORT', 'AÉROPORT', 'VOYAGE'],
    debuts: [13.39, 17.14, 21.09, 23.56],
    eco: [{texte: 'Véhicule confortable', a: 14.42}, {texte: 'Chauffeur professionnel', a: 15.72}, {texte: 'Ponctualité', a: 16.35}],
    confort: [{texte: 'Wi-Fi', a: 18.32}, {texte: 'Climatisation', a: 18.95}, {texte: 'Écran à bord', a: 20.05}, {texte: 'Véhicule premium', a: 20.45}],
    aeroport: {montant: 8000, compteur: 22.0},
    voyage: {villes: [{nom: 'Yaoundé', a: 24.7}, {nom: 'Buea', a: 25.5}, {nom: 'Kribi', a: 26.3}, {nom: 'Limbé', a: 27.0}], montant: 50000, prix: 29.3},
  },
  slogan: [{mot: 'Rapide.', a: 31.33}, {mot: 'Sûr.', a: 32.39}, {mot: 'Confortable.', a: 33.32}],
  pause: {texte: 'Et tenez-vous prêts…', a: 34.88},
  promo: {
    explosion: 37.75,
    enHaut: 38.75,
    eco: {entree: 38.85, nouveau: 39.6, badge: 43.2, sortie: 44.9, ancien: 3000, prix: 2500, badgeTexte: 'Dès 5 h : 2 000 FCFA/h'},
    heures: {entree: 45.0, horloges: [45.9, 46.15, 46.4, 46.65], cinquieme: 47.5, offerte: 48.61, sortie: 49.45},
    confort: {entree: 49.6, nouveau: 51.0, badge: 54.3, sortie: 55.5, ancien: 4000, prix: 3500, badgeTexte: 'Dès 5 h : 3 000 FCFA/h'},
  },
  cta: {bouton: 55.82, groupes: [{texte: '655', a: 57.6}, {texte: '394', a: 59.11}, {texte: '028', a: 60.76}], logo: 61.4, fondu: 62.6},
  // Effets sonores discrets [temps (s), nom dans SONS, volume relatif].
  sons: [
    [0.0, 'whoosh', 0.6], [3.02, 'pop', 0.9], [4.45, 'pop', 0.9], [6.02, 'pop', 0.9], [7.3, 'whooshCourt', 0.8], [9.0, 'whooshCourt', 0.7],
    [9.74, 'impact', 0.45], [13.2, 'whoosh', 0.6], [14.42, 'tic', 0.7], [15.72, 'tic', 0.7], [16.35, 'tic', 0.7],
    [17.14, 'whooshCourt', 0.7], [18.32, 'tic', 0.7], [18.95, 'tic', 0.7], [20.05, 'tic', 0.7], [20.45, 'tic', 0.7],
    [21.09, 'whooshCourt', 0.7], [22.0, 'prix', 0.8], [23.56, 'whooshCourt', 0.7], [24.7, 'bip', 0.6], [25.5, 'bip', 0.6],
    [26.3, 'bip', 0.6], [27.0, 'bip', 0.6], [29.3, 'prix', 0.8], [31.33, 'pop', 0.8], [32.39, 'pop', 0.8], [33.32, 'pop', 0.9],
    [34.6, 'montee', 0.7], [37.75, 'boom', 0.5], [37.8, 'scintillement', 0.9], [39.6, 'prix', 0.8], [43.2, 'tic', 0.7],
    [44.9, 'whooshCourt', 0.7], [45.9, 'tic', 0.5], [46.15, 'tic', 0.5], [46.4, 'tic', 0.5], [46.65, 'tic', 0.5], [47.5, 'pop', 1],
    [48.61, 'scintillement', 1], [49.5, 'whooshCourt', 0.7], [51.0, 'prix', 0.8], [54.3, 'tic', 0.7], [55.82, 'notif', 0.8],
    [57.6, 'tic', 0.6], [59.11, 'tic', 0.6], [60.76, 'tic', 0.6], [62.6, 'whoosh', 0.5],
  ] as [number, 'whoosh' | 'whooshCourt' | 'impact' | 'boom' | 'montee' | 'scintillement' | 'tic' | 'pop' | 'prix' | 'bip' | 'notif', number][],
};
