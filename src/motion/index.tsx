// Enregistre les compositions de la série motion design n° 11 à 30.
import {Composition} from 'remotion';
import {PUBS_MOTION} from './config';
import {chargerPolicesMotion} from './polices';
import {Pub11GameOver} from './Pub11GameOver';
import {Pub12Polaroids} from './Pub12Polaroids';
import {Pub13Vinyle} from './Pub13Vinyle';
import {Pub14Puzzle} from './Pub14Puzzle';
import {Pub15Meteo} from './Pub15Meteo';
import {Pub16Terminal} from './Pub16Terminal';
import {Pub17Miniature} from './Pub17Miniature';
import {Pub18Sablier} from './Pub18Sablier';
import {Pub19Ascenseur} from './Pub19Ascenseur';
import {Pub20Cartes} from './Pub20Cartes';
import {Pub21Rewind} from './Pub21Rewind';

import {Pub22PasPourLesRiches} from './Pub22PasPourLesRiches';
import {Pub23QuatreServices} from './Pub23QuatreServices';
import {Pub24TelephoneVoiture} from './Pub24TelephoneVoiture';
chargerPolicesMotion();

const COMPOSANTS: Partial<Record<number, React.FC>> = {
  11: Pub11GameOver,
  12: Pub12Polaroids,
  13: Pub13Vinyle,
  14: Pub14Puzzle,
  15: Pub15Meteo,
  16: Pub16Terminal,
  17: Pub17Miniature,
  18: Pub18Sablier,
  19: Pub19Ascenseur,
  20: Pub20Cartes,
  21: Pub21Rewind,
  22: Pub22PasPourLesRiches,
  23: Pub23QuatreServices,
  24: Pub24TelephoneVoiture,
};

export const CompositionsMotion: React.FC = () => (
  <>
    {PUBS_MOTION.filter((p) => COMPOSANTS[p.n]).map((p) => (
      <Composition key={p.id} id={p.id} component={COMPOSANTS[p.n]!} durationInFrames={p.duree * 30} fps={30} width={1080} height={1920} />
    ))}
  </>
);
