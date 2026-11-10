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
import {Pub25RouteInfinie} from './Pub25RouteInfinie';
import {Pub26Episode1} from './Pub26Episode';
import {Pub26Episode2} from './Pub26Episode';
import {Pub26Episode3} from './Pub26Episode';
import {Pub26Episode4} from './Pub26Episode';
import {Pub27EcoOuConfort} from './Pub27EcoOuConfort';
import {Pub28CompteARebours} from './Pub28CompteARebours';
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
  25: Pub25RouteInfinie,
  26: Pub26Episode1,
  262: Pub26Episode2,
  263: Pub26Episode3,
  264: Pub26Episode4,
  27: Pub27EcoOuConfort,
  28: Pub28CompteARebours,
};

export const CompositionsMotion: React.FC = () => (
  <>
    {PUBS_MOTION.filter((p) => COMPOSANTS[p.n]).map((p) => (
      <Composition key={p.id} id={p.id} component={COMPOSANTS[p.n]!} durationInFrames={p.duree * 30} fps={30} width={1080} height={1920} />
    ))}
  </>
);
