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
