// Série « motion design » n° 11 à 20 : textes, prix, polices, durées et captures.
// Les repères de son sont dans scripts/motion-sons.py (mêmes secondes que les scènes de chaque pub).

export const MOTION = {
  marge: 120,
  basLibre: 250,
  voiture: 'motion/voiture.png',
  ecris: ['Écris ', '« JP »', ' sur WhatsApp'] as const,
  indicatif: '+237',
  numero: '655 394 028',
  numeroComplet: '+237 655 394 028',
  reserve: 'Réserve maintenant 👇',
};

export const TARIFS = {
  eco: 'Éco 2 500 F/h',
  confort: 'Confort 3 500 F/h',
  ecoConfortPromo: 'Éco 2 500 F/h · Confort 3 500 F/h (promo)',
  aeroport: 'Aéroport dès 8 000 F',
  voyage: 'Voyage 50 000 F/jour',
};

// Polices embarquées (public/fonts/motion, OFL sauf Permanent Marker : Apache 2.0).
export const POLICES_MOTION = {
  pixel: 'Press Start 2P',
  main: 'Caveat',
  marqueur: 'Permanent Marker',
  mono: 'JetBrains Mono',
  serif: 'Cormorant Garamond',
  capitales: 'Cinzel',
  grotesk: 'Space Grotesk',
};

/** id, durée (s) et images à capturer de chaque pub (repris du document de prompts). */
export const PUBS_MOTION = [
  {n: 11, id: 'Motion11-GameOver', duree: 12, captures: [5, 80, 180, 260, 330]},
  {n: 12, id: 'Motion12-Polaroids', duree: 12, captures: [5, 60, 180, 270, 330]},
  {n: 13, id: 'Motion13-Vinyle', duree: 12, captures: [5, 60, 150, 270, 330]},
  {n: 14, id: 'Motion14-Puzzle', duree: 12, captures: [5, 90, 180, 250, 330]},
  {n: 15, id: 'Motion15-Meteo', duree: 12, captures: [5, 60, 130, 220, 330]},
  {n: 16, id: 'Motion16-Terminal', duree: 12, captures: [5, 60, 150, 260, 330]},
  {n: 17, id: 'Motion17-Miniature', duree: 15, captures: [5, 100, 200, 300, 380, 430]},
  {n: 18, id: 'Motion18-Sablier', duree: 10, captures: [5, 60, 130, 200, 280]},
  {n: 19, id: 'Motion19-Ascenseur', duree: 10, captures: [5, 40, 120, 200, 280]},
  {n: 20, id: 'Motion20-Cartes', duree: 12, captures: [5, 60, 160, 260, 330]},
] as const;
