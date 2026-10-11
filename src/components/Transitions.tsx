import {AbsoluteFill, interpolate} from 'remotion';
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from '@remotion/transitions';
import {COULEURS} from '../config';

type SansProps = Record<string, never>;

// Zoom rapide flouté : la scène sortante fonce vers la caméra,
// la scène entrante arrive du fond.
const ZoomFlou: React.FC<TransitionPresentationComponentProps<SansProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const sortante = presentationDirection === 'exiting';
  const scale = sortante ? interpolate(p, [0, 1], [1, 1.9]) : interpolate(p, [0, 1], [0.6, 1]);
  const flou = sortante ? interpolate(p, [0, 1], [0, 26]) : interpolate(p, [0, 1], [26, 0]);
  const opacite = sortante ? 1 : interpolate(p, [0, 0.45, 1], [0, 1, 1]);
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        filter: flou > 0.5 ? `blur(${flou}px) brightness(${1 + flou / 40})` : undefined,
        opacity: opacite,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const zoomFlou = (): TransitionPresentation<SansProps> => ({
  component: ZoomFlou,
  props: {},
});

// Balayage diagonal : une bande rouge néon traverse l'écran et révèle
// la scène suivante.
const Balayage: React.FC<TransitionPresentationComponentProps<SansProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  if (presentationDirection === 'exiting') {
    const x = interpolate(p, [0, 1], [0, -18]);
    return (
      <AbsoluteFill style={{transform: `translateX(${x}%)`, filter: `blur(${p * 8}px)`}}>
        {children}
      </AbsoluteFill>
    );
  }
  // Position du bord de la révélation (en % de la largeur, diagonale de 30 %).
  const bord = interpolate(p, [0, 1], [130, -30]);
  const masque = `polygon(${bord}% 0%, 140% 0%, 140% 100%, ${bord - 30}% 100%)`;
  const bande = (decal: number, ep: number) =>
    `polygon(${bord + decal}% 0%, ${bord + decal + ep}% 0%, ${bord + decal + ep - 30}% 100%, ${bord + decal - 30}% 100%)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: masque}}>{children}</AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: bande(-9, 9),
          backgroundColor: COULEURS.rouge,
          boxShadow: `0 0 80px ${COULEURS.rougeNeon}`,
        }}
      />
      <AbsoluteFill style={{clipPath: bande(-11, 1.2), backgroundColor: COULEURS.blanc}} />
    </AbsoluteFill>
  );
};

export const balayage = (): TransitionPresentation<SansProps> => ({
  component: Balayage,
  props: {},
});
