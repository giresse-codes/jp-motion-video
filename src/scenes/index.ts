import {Intro} from './Intro';
import {Probleme} from './Probleme';
import {Services} from './Services';
import {Professionnalisme} from './Professionnalisme';
import {AppelAction} from './AppelAction';

export const COMPOSANTS_SCENES = {
  intro: Intro,
  probleme: Probleme,
  services: Services,
  professionnalisme: Professionnalisme,
  appel: AppelAction,
} satisfies Record<string, React.FC>;
