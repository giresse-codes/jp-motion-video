import {Intro} from './Intro';
import {Probleme} from './Probleme';
import {Services} from './Services';
import {Professionnalisme} from './Professionnalisme';
import {AVenir} from './AVenir';

export const COMPOSANTS_SCENES = {
  intro: Intro,
  probleme: Probleme,
  services: Services,
  professionnalisme: Professionnalisme,
  appel: () => <AVenir titre="Scène 5 – Appel à l'action" />,
} satisfies Record<string, React.FC>;
