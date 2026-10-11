import {Audio, Sequence} from 'remotion';
import {AUDIO, SONS} from '../config';
import {fichierOuNull} from '../lib/assets';

export type NomSon = keyof typeof SONS;

// Joue un effet sonore à l'image `a` (relative à la séquence courante).
export const Son: React.FC<{nom: NomSon; a: number; volume?: number}> = ({nom, a, volume = 1}) => {
  const {fichier, volume: base} = SONS[nom];
  const src = fichierOuNull(fichier);
  if (!src || AUDIO.volumeEffets <= 0) return null;
  return (
    <Sequence from={Math.round(a)} layout="none" name={`son:${nom}`}>
      <Audio src={src} volume={base * volume * AUDIO.volumeEffets} />
    </Sequence>
  );
};
