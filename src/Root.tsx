import {AbsoluteFill, Composition} from 'remotion';
import {SCENES, VIDEO} from './config';
import {chargerPolices} from './lib/fonts';
import {debutsScenes, dureesScenes, dureeTotaleFrames} from './lib/timing';
import {COMPOSANTS_SCENES} from './scenes';
import {PisteAudio, Video} from './Video';
import {Video15} from './video15/Video15';
import {Video20} from './video20/Video20';
import {VideoTarifs} from './videotarifs/VideoTarifs';
import {VideoQuiz} from './videoquiz/VideoQuiz';
import {VideoQuizSoleil} from './videoquizsoleil/VideoQuizSoleil';
import {dureePubPromo, PubPromo} from './pubpromo/PubPromo';
import {VIDEO15, VIDEO20, VIDEO_QUIZ, VIDEO_QUIZ_SOLEIL, VIDEO_TARIFS} from './config';

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
    <Composition
      id="Video20"
      component={Video20}
      durationInFrames={VIDEO20.dureeS * VIDEO.fps}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="VideoTarifs"
      component={VideoTarifs}
      durationInFrames={VIDEO_TARIFS.dureeS * VIDEO.fps}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="VideoQuiz"
      component={VideoQuiz}
      durationInFrames={Math.round(VIDEO_QUIZ.dureeS * VIDEO.fps)}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="VideoQuizSoleil"
      component={VideoQuizSoleil}
      durationInFrames={Math.round(VIDEO_QUIZ_SOLEIL.dureeS * VIDEO.fps)}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="PubPromo"
      component={PubPromo}
      durationInFrames={dureePubPromo}
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
