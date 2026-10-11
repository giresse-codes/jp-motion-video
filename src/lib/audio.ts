import mots from '../voix-timing.json';
import {AUDIO, VIDEO} from '../config';

type Mot = {startMs: number; endMs: number};

// Plages où la voix parle (les mots séparés de moins de 0,6 s sont fusionnés).
const plages: [number, number][] = [];
for (const m of mots as Mot[]) {
  const dernier = plages[plages.length - 1];
  if (dernier && m.startMs - dernier[1] < 600) dernier[1] = m.endMs;
  else plages.push([m.startMs, m.endMs]);
}

// Volume de la musique à une image donnée : baisse automatique pendant la voix,
// avec des fondus doux avant et après chaque phrase.
export const volumeMusique = (frame: number) => {
  const ms = (frame / VIDEO.fps) * 1000;
  const f = AUDIO.fonduMs;
  let presenceVoix = 0;
  for (const [a, b] of plages) {
    if (ms >= a - f && ms <= b + f) {
      const entree = Math.min(1, (ms - (a - f)) / f);
      const sortie = Math.min(1, (b + f - ms) / f);
      presenceVoix = Math.max(presenceVoix, Math.min(entree, sortie));
    }
  }
  return AUDIO.volumeMusique + (AUDIO.volumeMusiqueSousVoix - AUDIO.volumeMusique) * presenceVoix;
};
