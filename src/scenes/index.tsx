import {Intro} from './Intro';
import {Probleme} from './Probleme';
import {Services} from './Services';
import {AVenir} from './AVenir';

export const COMPOSANTS_SCENES = {
  intro: Intro,
  probleme: Probleme,
  services: Services,
  professionnalisme: () => <AVenir titre="Scène 4 – Professionnalisme" />,
  appel: () => <AVenir titre="Scène 5 – Appel à l'action" />,
} satisfies Record<string, React.FC>;
