import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {PUB_SETUP} from '../config';
import {CLIPS, ECRAN, Fin} from './Clips';
import {clipA} from './PubSetup';

// « PubSetupYoutube » : uniquement l'animation (les 14 clips JP puis le logo), en plein cadre 1920 × 1080,
// sans bureau, sans interface ni timeline. Commence au début du montage ; même bande-son, décalée d'autant.
const S = PUB_SETUP, B = S.temps;
export const YOUTUBE = {l: 1920, h: 1080};
export const DEBUT_YOUTUBE = Math.round(S.montage[0] * B * 30) - 3; // 3 images d'avance pour garder l'impact du drop
export const dureePubSetupYoutube = Math.round(S.dureeS * 30) - DEBUT_YOUTUBE;
const ECHELLE = Math.max(YOUTUBE.l / ECRAN.l, YOUTUBE.h / ECRAN.h); // remplit le cadre (léger rognage haut/bas)

export const PubSetupYoutube: React.FC = () => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig();
  const t = (frame + DEBUT_YOUTUBE) / fps;
  const clip = clipA(t), Clip = clip ? CLIPS[clip.id] : null, A = CLIPS.carte;
  const fin = t >= S.finRepere.noir * B;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: (YOUTUBE.l - ECRAN.l * ECHELLE) / 2, top: (YOUTUBE.h - ECRAN.h * ECHELLE) / 2, width: ECRAN.l, height: ECRAN.h, transformOrigin: '0 0', transform: `scale(${ECHELLE})`, overflow: 'hidden'}}>
        {!fin && Clip && clip && <Clip k={t - clip.a} d={clip.z - clip.a} fps={fps} />}
        {!fin && !clip && <A k={0} d={1} fps={fps} />}
        {fin && <Fin k={t - S.finRepere.noir * B} fps={fps} />}
      </div>
      <Audio src={staticFile(S.bande)} startFrom={DEBUT_YOUTUBE} />
    </AbsoluteFill>
  );
};
