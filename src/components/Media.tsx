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

// Vidéos dont le bas porte un filigrane : on zoome pour que le bas visible
// de l'image s'arrête au-dessus du filigrane (fraction de la hauteur source).
const ZOOM_MASQUE = 1.52;
const BAS_VISIBLE = 0.665;

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
  // Avec un zoom s et une origine oy, le bas visible vaut oy + (1 - oy) / s :
  // on choisit oy pour qu'il reste sur BAS_VISIBLE pendant tout le zoom.
  const origineMasque = Math.max(0, (BAS_VISIBLE - 1 / scale) / (1 - 1 / scale));
  const origine = plan.masquerBas
    ? `${plan.cadrage?.x ?? 50}% ${origineMasque * 100}%`
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
          playbackRate={plan.vitesse ?? 1}
          trimBefore={Math.round((plan.debutS ?? 0) * fps)}
          style={style}
        />
      ) : (
        <Img src={src} style={style} />
      )}
    </AbsoluteFill>
  );
};
