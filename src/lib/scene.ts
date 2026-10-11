import {REPERES, SCENES} from '../config';
import {repereDansScene} from './timing';

type IdScene = (typeof SCENES)[number]['id'];
export type CleRepere = keyof typeof REPERES;

// Renvoie une fonction qui donne l'image d'un repère de la voix,
// relative au début de la scène.
export const reperesDe = (id: IdScene) => {
  const index = SCENES.findIndex((s) => s.id === id);
  return (cle: CleRepere) => repereDansScene(REPERES[cle], index);
};

// Petit tremblement de caméra qui s'amortit après un impact à l'image `a`.
export const secousse = (frame: number, a: number, force = 14) => {
  const f = frame - a;
  if (f < 0 || f > 14) return {x: 0, y: 0};
  const amort = Math.exp(-f / 4);
  return {
    x: Math.sin(f * 2.7) * force * amort,
    y: Math.cos(f * 3.3) * force * 0.7 * amort,
  };
};
