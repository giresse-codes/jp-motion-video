import {Fragment} from 'react';
import {AbsoluteFill, Audio, Sequence} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {AUDIO, COULEURS, SCENES, TRANSITION_FRAMES} from './config';
import {balayage, zoomFlou} from './components/Transitions';
import {fichierOuNull} from './lib/assets';
import {volumeMusique} from './lib/audio';
import {dureesScenes} from './lib/timing';
import {COMPOSANTS_SCENES} from './scenes';

// Transition qui mène à chaque scène (la première n'en a pas).
const TRANSITIONS = [null, zoomFlou, zoomFlou, balayage, zoomFlou];

// Voix off et musique, avec baisse automatique de la musique sous la voix.
export const PisteAudio: React.FC<{decalage?: number}> = ({decalage = 0}) => {
  const voix = fichierOuNull(AUDIO.voix);
  const musique = fichierOuNull(AUDIO.musique);
  return (
    <>
      {voix && (
        <Sequence from={-decalage} layout="none">
          <Audio src={voix} volume={AUDIO.volumeVoix} />
        </Sequence>
      )}
      {musique && (
        <Audio
          src={musique}
          trimBefore={decalage}
          volume={(f) => volumeMusique(f + decalage)}
          loop
        />
      )}
    </>
  );
};

export const Video: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COULEURS.noir}}>
    <TransitionSeries>
      {SCENES.map((s, i) => {
        const Scene = COMPOSANTS_SCENES[s.id];
        const transition = TRANSITIONS[i];
        return (
          <Fragment key={s.id}>
            {transition && (
              <TransitionSeries.Transition
                presentation={transition()}
                timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={dureesScenes[i]}>
              <Scene />
            </TransitionSeries.Sequence>
          </Fragment>
        );
      })}
    </TransitionSeries>
    <PisteAudio />
  </AbsoluteFill>
);

