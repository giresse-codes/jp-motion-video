import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import {POLICES} from '../config';

// Polices embarquées dans public/fonts (rendu hors ligne, licence OFL).
const MONTSERRAT = [600, 800, 900].flatMap((w) =>
  (['normal', 'italic'] as const).map((style) => ({w, style})),
);

let charge: Promise<unknown> | null = null;

export const chargerPolices = () => {
  charge ??= Promise.all([
    ...MONTSERRAT.map(({w, style}) =>
      loadFont({
        family: POLICES.titre,
        url: staticFile(`fonts/montserrat-latin-${w}-${style}.woff2`),
        weight: String(w),
        style,
      }),
    ),
    ...[400, 600, 700].map((w) =>
      loadFont({
        family: POLICES.texte,
        url: staticFile(`fonts/inter-latin-${w}-normal.woff2`),
        weight: String(w),
      }),
    ),
  ]);
  return charge;
};
