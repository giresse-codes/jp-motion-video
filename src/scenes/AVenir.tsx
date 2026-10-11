import {AbsoluteFill} from 'remotion';
import {COULEURS, POLICES} from '../config';

// Écran provisoire pour une scène pas encore construite.
export const AVenir: React.FC<{titre: string}> = ({titre}) => (
  <AbsoluteFill
    style={{
      backgroundColor: COULEURS.noirDoux,
      alignItems: 'center',
      justifyContent: 'center',
      color: COULEURS.gris,
      fontFamily: POLICES.titre,
      fontSize: 60,
      fontWeight: 800,
    }}
  >
    {titre}
  </AbsoluteFill>
);
