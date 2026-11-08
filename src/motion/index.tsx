// Enregistre les compositions de la série motion design n° 11 à 20.
import {Composition} from 'remotion';
import {PUBS_MOTION} from './config';
import {chargerPolicesMotion} from './polices';
import {Pub11GameOver} from './Pub11GameOver';
import {Pub12Polaroids} from './Pub12Polaroids';

chargerPolicesMotion();

const COMPOSANTS: Partial<Record<number, React.FC>> = {
  11: Pub11GameOver,
  12: Pub12Polaroids,
};

export const CompositionsMotion: React.FC = () => (
  <>
    {PUBS_MOTION.filter((p) => COMPOSANTS[p.n]).map((p) => (
      <Composition key={p.id} id={p.id} component={COMPOSANTS[p.n]!} durationInFrames={p.duree * 30} fps={30} width={1080} height={1920} />
    ))}
  </>
);
