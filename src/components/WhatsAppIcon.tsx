import {COULEURS} from '../config';

// Pictogramme WhatsApp simplifié (bulle + combiné), dessiné en SVG.
export const WhatsAppIcon: React.FC<{taille: number; fond?: boolean}> = ({taille, fond = true}) => (
  <svg width={taille} height={taille} viewBox="0 0 48 48">
    {fond && <circle cx={24} cy={24} r={24} fill={COULEURS.whatsapp} />}
    <g transform="translate(9 8.5)">
      <path
        d="M15 1.5a13.3 13.3 0 0 0-11.6 19.9L1.5 28.5l7.3-1.9A13.3 13.3 0 1 0 15 1.5Z"
        fill="none"
        stroke="white"
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      <path
        transform="translate(7.4 7) scale(0.62)"
        fill="white"
        d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
      />
    </g>
  </svg>
);
