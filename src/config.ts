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
  libelle: 'Réservez sur WhatsApp',
  numero: '+237 655 394 028',
};

// Fichiers attendus dans public/. Un fichier absent est remplacé par un
// placeholder propre (photo) ou ignoré (son), et la vidéo se rend quand même.
export const AUDIO = {
  voix: 'voiceoff.wav',
  musique: 'musique.mp3',
  volumeVoix: 1,
  volumeMusique: 0.55,
  // Volume de la musique pendant que la voix parle.
  volumeMusiqueSousVoix: 0.13,
  // Durée des fondus de la musique autour de la voix (ms).
  fonduMs: 350,
};

export const LOGO = 'logo.png';
// Version détourée générée par scripts/logo-transparent.py (utilisée si présente).
export const LOGO_DETOURE = 'logo-transparent.png';

// Un plan = une photo (images/...) ou un extrait vidéo (videos/...).
// `libelle` sert au placeholder si le fichier manque.
// `debutS` = début de l'extrait dans la vidéo source.
// `cadrage` = point de zoom (en % de l'image), `zoom` = zoom de départ.
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
  aeroport: {
    src: 'images/aeroport.jpg',
    libelle: 'AÉROPORT DE DOUALA',
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
  },
  interieur: {
    src: 'images/interieur.jpg',
    libelle: 'INTÉRIEUR DU VÉHICULE',
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
    plan: PLANS.aeroport,
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
    ligne3: 'Traité comme vous le méritez',
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
  numero: {phrase: 'six cent', secoursS: 48.4},
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
