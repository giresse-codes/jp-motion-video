import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COULEURS, POLICES} from '../config';

// Remplace proprement une photo pas encore fournie.
export const Placeholder: React.FC<{libelle: string}> = ({libelle}) => {
  const frame = useCurrentFrame();
  const decalage = interpolate(frame, [0, 300], [0, 240]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 70% at 30% 25%, ${COULEURS.rougeSombre} 0%, ${COULEURS.noirDoux} 55%, ${COULEURS.noir} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.18,
          backgroundImage: `repeating-linear-gradient(-35deg, transparent 0 46px, ${COULEURS.rouge} 46px 48px)`,
          backgroundPosition: `${decalage}px 0`,
        }}
      />
      <AbsoluteFill
        style={{alignItems: 'center', justifyContent: 'center', gap: 28}}
      >
        <svg width={150} height={150} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 7h3l2-2.5h6L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
            stroke={COULEURS.blanc}
            strokeOpacity={0.55}
            strokeWidth={1.2}
          />
          <circle cx={12} cy={12.5} r={3.6} stroke={COULEURS.rougeNeon} strokeWidth={1.2} />
        </svg>
        <div
          style={{
            fontFamily: POLICES.texte,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: 6,
            color: COULEURS.blanc,
            opacity: 0.6,
            textAlign: 'center',
            padding: '0 120px',
          }}
        >
          PHOTO À VENIR
          <br />
          <span style={{color: COULEURS.rougeNeon, opacity: 1}}>{libelle}</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
