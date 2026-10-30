import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Son} from '../components/Son';
import {PUB_PROMO, VIDEO} from '../config';
import {Cartes} from './scenes/Cartes';
import {Cta} from './scenes/Cta';
import {LogoJP} from './scenes/LogoJP';
import {Pause} from './scenes/Pause';
import {Promo} from './scenes/Promo';
import {Services} from './scenes/Services';
import {Slogan} from './scenes/Slogan';
import {Ville} from './scenes/Ville';
import {C} from './ui';

// « PubPromo » : pub verticale 1080×1920 calée sur public/voixoff-promo.mp3.
// Style « app premium » (noir profond, verre dépoli, compteurs) + motion design physique (ressorts, squash & stretch).
// Une scène = une <Sequence> ; tous les repères (secondes absolues) sont dans PUB_PROMO (src/config.ts).
const SCENES = [
  {id: 'ville', C: Ville},
  {id: 'cartes', C: Cartes},
  {id: 'logo', C: LogoJP},
  {id: 'services', C: Services},
  {id: 'slogan', C: Slogan},
  {id: 'pause', C: Pause},
  {id: 'promo', C: Promo},
  {id: 'cta', C: Cta},
] as const;

const f = (s: number) => Math.round(s * VIDEO.fps);

export const dureePubPromo = f(PUB_PROMO.dureeS);

export const PubPromo: React.FC = () => (
  <AbsoluteFill style={{background: C.fond}}>
    {SCENES.map(({id, C: Scene}, i) => {
      const debut = PUB_PROMO.scenes[id];
      const fin = i < SCENES.length - 1 ? PUB_PROMO.scenes[SCENES[i + 1].id] : PUB_PROMO.dureeS;
      return (
        <Sequence key={id} name={id} from={f(debut)} durationInFrames={f(fin) - f(debut)}>
          <Scene />
        </Sequence>
      );
    })}
    <Audio src={staticFile(PUB_PROMO.voix)} />
    {PUB_PROMO.sons.map(([s, nom, v], i) => (
      <Son key={i} nom={nom} a={f(s)} volume={v} />
    ))}
  </AbsoluteFill>
);
