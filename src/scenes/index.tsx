import {Intro} from './Intro';
import {Probleme} from './Probleme';
import {AVenir} from './AVenir';

export const COMPOSANTS_SCENES = {
  intro: Intro,
  probleme: Probleme,
  services: () => <AVenir titre="Scène 3 – Services" />,
  professionnalisme: () => <AVenir titre="Scène 4 – Professionnalisme" />,
  appel: () => <AVenir titre="Scène 5 – Appel à l'action" />,
} satisfies Record<string, React.FC>;
