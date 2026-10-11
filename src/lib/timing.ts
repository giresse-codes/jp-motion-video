import mots from '../voix-timing.json';
import {
  AVANCE_COUPE_S,
  REPERES,
  SCENES,
  TRANSITION_FRAMES,
  VIDEO,
  type Repere,
} from '../config';

type Mot = {text: string; startMs: number; endMs: number};
const MOTS = mots as Mot[];

const normaliser = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');

// Texte transcrit mis bout à bout, avec l'index du mot de chaque caractère.
const texte = MOTS.map((m) => normaliser(m.text)).join('');
const motDuCaractere: number[] = [];
MOTS.forEach((m, i) => {
  for (let c = 0; c < normaliser(m.text).length; c++) motDuCaractere.push(i);
});

export const voixDisponible = MOTS.length > 0;

// Fin de la voix (s), ou null si pas de transcription.
export const finVoixS = voixDisponible ? MOTS[MOTS.length - 1].endMs / 1000 : null;

// Instant (s) où la phrase du repère commence dans la voix.
// Les repères sont cherchés dans l'ordre de la config pour éviter les
// confusions entre deux occurrences du même mot.
const cache = new Map<Repere, number>();
let curseur = 0;
for (const repere of Object.values(REPERES) as Repere[]) {
  const cible = normaliser(repere.phrase);
  const idx = cible ? texte.indexOf(cible, curseur) : -1;
  if (idx >= 0) {
    cache.set(repere, MOTS[motDuCaractere[idx]].startMs / 1000);
    curseur = idx + cible.length;
  } else {
    cache.set(repere, repere.secoursS);
  }
}

export const repereS = (r: Repere) => cache.get(r) ?? r.secoursS;

export const sToFrames = (s: number) => Math.round(s * VIDEO.fps);

export const dureeTotaleFrames = sToFrames(
  finVoixS === null ? VIDEO.dureeSansVoixS : finVoixS + VIDEO.queueApresVoixS,
);

// Coupe (images) entre chaque scène, calée sur la voix. Les transitions
// sont centrées sur ces coupes.
export const coupesScenes = SCENES.map((s) =>
  s.debut === null
    ? 0
    : sToFrames(Math.max(0, repereS(REPERES[s.debut]) - AVANCE_COUPE_S)),
);

const demiTransition = Math.floor(TRANSITION_FRAMES / 2);

// Début absolu (images) de chaque séquence, transition entrante comprise.
export const debutsScenes = coupesScenes.map((c, i) => (i === 0 ? 0 : c - demiTransition));

export const dureesScenes = debutsScenes.map((d, i) =>
  i < SCENES.length - 1
    ? coupesScenes[i + 1] + (TRANSITION_FRAMES - demiTransition) - d
    : dureeTotaleFrames - d,
);

// Repère converti en image relative au début d'une scène.
export const repereDansScene = (r: Repere, indexScene: number) =>
  sToFrames(repereS(r)) - debutsScenes[indexScene];
