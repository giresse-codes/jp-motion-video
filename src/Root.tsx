import {AbsoluteFill, Composition} from 'remotion';
import {SCENES, VIDEO} from './config';
import {chargerPolices} from './lib/fonts';
import {debutsScenes, dureesScenes, dureeTotaleFrames} from './lib/timing';
import {COMPOSANTS_SCENES} from './scenes';
import {PisteAudio, Video} from './Video';
import {Video15} from './video15/Video15';
import {VIDEO15} from './config';

chargerPolices();

// Une scène seule avec sa portion de voix off, pour les aperçus.
const apercu = (i: number) => {
  const Scene = COMPOSANTS_SCENES[SCENES[i].id];
  const Apercu: React.FC = () => (
    <AbsoluteFill>
      <Scene />
      <PisteAudio decalage={debutsScenes[i]} />
    </AbsoluteFill>
  );
  return Apercu;
};

export const Root: React.FC = () => (
  <>
    <Composition
      id="JPVideo"
      component={Video}
      durationInFrames={dureeTotaleFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="Video15"
      component={Video15}
      durationInFrames={VIDEO15.dureeS * VIDEO.fps}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    {SCENES.map((s, i) => (
      <Composition
        key={s.id}
        id={`Scene${i + 1}-${s.id}`}
        component={apercu(i)}
        durationInFrames={dureesScenes[i]}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    ))}
  </>
);
