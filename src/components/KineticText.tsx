import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COULEURS, POLICES} from '../config';

type Entree = 'choc' | 'monte' | 'glisse' | 'lettres';

type Props = {
  texte: string;
  // Image (relative à la séquence) où le mot apparaît.
  a: number;
  entree?: Entree;
  taille?: number;
  couleur?: string;
  neon?: boolean;
  italique?: boolean;
  poids?: number;
  // Image où le texte disparaît (optionnel).
  sortie?: number;
  style?: React.CSSProperties;
};

// Lueur néon : un halo serré pour la netteté, un large pour l'ambiance.
const lueur = (c: string) => `0 0 2px ${c}, 0 0 14px ${c}99, 0 0 40px ${c}66`;

// Typographie animée calée sur la voix : chaque mot entre à l'image `a`.
export const MotAnime: React.FC<Props> = ({
  texte,
  a,
  entree = 'choc',
  taille = 120,
  couleur = COULEURS.blanc,
  neon = false,
  italique = true,
  poids = 900,
  sortie,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - a;
  if (f < 0) return null;

  const ressort = spring({frame: f, fps, config: {damping: 14, stiffness: 180, mass: 0.7}});
  const opaciteSortie =
    sortie === undefined
      ? 1
      : interpolate(frame, [sortie, sortie + 6], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  const flou = interpolate(f, [0, 6], [18, 0], {extrapolateRight: 'clamp'});

  let transform = '';
  if (entree === 'choc') {
    transform = `scale(${interpolate(ressort, [0, 1], [2.4, 1])})`;
  } else if (entree === 'monte') {
    transform = `translateY(${interpolate(ressort, [0, 1], [90, 0])}px)`;
  } else if (entree === 'glisse') {
    transform = `translateX(${interpolate(ressort, [0, 1], [-260, 0])}px) skewX(${interpolate(ressort, [0, 1], [-18, 0])}deg)`;
  }

  const base: React.CSSProperties = {
    fontFamily: POLICES.titre,
    fontWeight: poids,
    fontStyle: italique ? 'italic' : 'normal',
    fontSize: taille,
    lineHeight: 1.02,
    color: couleur,
    letterSpacing: -1,
    textShadow: neon ? lueur(couleur === COULEURS.blanc ? COULEURS.rouge : couleur) : '0 6px 30px rgba(0,0,0,0.6)',
    opacity: Math.min(1, f / 3) * opaciteSortie,
    filter: flou > 0.5 ? `blur(${flou}px)` : undefined,
    transform,
    display: 'inline-block',
    whiteSpace: 'pre',
    ...style,
  };

  if (entree === 'lettres') {
    return (
      <span style={{...base, filter: undefined, opacity: opaciteSortie, transform: undefined}}>
        {[...texte].map((c, i) => {
          const fi = f - i * 1.6;
          const o = interpolate(fi, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const y = interpolate(fi, [0, 7], [40, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <span key={i} style={{display: 'inline-block', opacity: o, transform: `translateY(${y}px)`}}>
              {c}
            </span>
          );
        })}
      </span>
    );
  }

  return <span style={base}>{texte}</span>;
};
