import {COULEURS} from '../config';

export const IconeLieu: React.FC<{taille: number; couleur?: string}> = ({taille, couleur = COULEURS.blanc}) => (
  <svg width={taille} height={taille} viewBox="0 0 24 24" fill={couleur}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
  </svg>
);

// Horloge dont les aiguilles tournent (angle en degrés pour la grande aiguille).
export const IconeHorloge: React.FC<{taille: number; angle: number; couleur?: string}> = ({
  taille,
  angle,
  couleur = COULEURS.rougeNeon,
}) => (
  <svg width={taille} height={taille} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={44} fill="none" stroke={couleur} strokeWidth={7} />
    {new Array(12).fill(0).map((_, i) => (
      <line
        key={i}
        x1={50}
        y1={12}
        x2={50}
        y2={i % 3 === 0 ? 22 : 18}
        stroke={COULEURS.blanc}
        strokeWidth={i % 3 === 0 ? 4 : 2}
        transform={`rotate(${i * 30} 50 50)`}
      />
    ))}
    <line x1={50} y1={50} x2={50} y2={20} stroke={COULEURS.blanc} strokeWidth={5} strokeLinecap="round" transform={`rotate(${angle} 50 50)`} />
    <line x1={50} y1={50} x2={50} y2={30} stroke={couleur} strokeWidth={6} strokeLinecap="round" transform={`rotate(${angle / 12} 50 50)`} />
    <circle cx={50} cy={50} r={5} fill={COULEURS.blanc} />
  </svg>
);

export const IconeCoche: React.FC<{taille: number; couleur?: string}> = ({taille, couleur = COULEURS.rougeNeon}) => (
  <svg width={taille} height={taille} viewBox="0 0 24 24">
    <circle cx={12} cy={12} r={11} fill={couleur} />
    <path d="M7 12.5l3.2 3.2L17.5 8.5" fill="none" stroke="white" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconeAvion: React.FC<{taille: number; couleur?: string}> = ({taille, couleur = COULEURS.blanc}) => (
  <svg width={taille} height={taille} viewBox="0 0 24 24" fill={couleur}>
    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z" />
  </svg>
);
