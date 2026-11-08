import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import {POLICES_MOTION as P} from './config';

const FICHIERS: [string, string, string][] = [
  [P.pixel, 'press-start-2p-latin-400-normal', '400'],
  [P.main, 'caveat-latin-400-normal', '400'],
  [P.main, 'caveat-latin-700-normal', '700'],
  [P.marqueur, 'permanent-marker-latin-400-normal', '400'],
  [P.mono, 'jetbrains-mono-latin-400-normal', '400'],
  [P.mono, 'jetbrains-mono-latin-700-normal', '700'],
  [P.mono, 'jetbrains-mono-latin-800-normal', '800'],
  [P.serif, 'cormorant-garamond-latin-700-normal', '700'],
  [P.capitales, 'cinzel-latin-700-normal', '700'],
  [P.grotesk, 'space-grotesk-latin-400-normal', '400'],
  [P.grotesk, 'space-grotesk-latin-700-normal', '700'],
];

let charge: Promise<unknown> | null = null;
export const chargerPolicesMotion = () => {
  charge ??= Promise.all(
    FICHIERS.map(([family, f, weight]) => loadFont({family, url: staticFile(`fonts/motion/${f}.woff2`), weight})),
  );
  return charge;
};
