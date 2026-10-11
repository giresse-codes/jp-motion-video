import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type {Plan} from '../config';
import {estVideo, fichierOuNull} from '../lib/assets';
import {Placeholder} from './Placeholder';

// Zoom appliqué aux vidéos dont le bas porte un filigrane : on ne montre
// que les deux tiers supérieurs de l'image.
const ZOOM_MASQUE = 1.52;

type Props = {
  plan: Plan;
  // Amplitude du zoom lent (Ken Burns) sur la durée du plan.
  amplitude?: number;
  // Dérive horizontale (px) pour l'effet de parallaxe.
  derive?: number;
  // Filtre CSS supplémentaire (étalonnage).
  filtre?: string;
  dureeFrames?: number;
};

// Photo ou extrait vidéo animé en Ken Burns, ou placeholder si le fichier manque.
export const Media: React.FC<Props> = ({
  plan,
  amplitude = 0.12,
  derive = 40,
  filtre,
  dureeFrames,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const duree = dureeFrames ?? durationInFrames;
  const src = fichierOuNull(plan.src);

  const t = interpolate(frame, [0, duree], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const base = (plan.zoom ?? 1.04) * (plan.masquerBas ? ZOOM_MASQUE : 1);
  const scale = base * (1 + amplitude * t);
  const x = interpolate(t, [0, 1], [-derive / 2, derive / 2]);
  const origine = plan.masquerBas
    ? '50% 0%'
    : `${plan.cadrage?.x ?? 50}% ${plan.cadrage?.y ?? 50}%`;

  if (!src) return <Placeholder libelle={plan.libelle} />;

  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: `translateX(${x}px) scale(${scale})`,
    transformOrigin: origine,
    filter: filtre,
  };

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: 'black'}}>
      {estVideo(plan.src) ? (
        <OffthreadVideo
          src={src}
          muted
          trimBefore={Math.round((plan.debutS ?? 0) * fps)}
          style={style}
        />
      ) : (
        <Img src={src} style={style} />
      )}
    </AbsoluteFill>
  );
};
