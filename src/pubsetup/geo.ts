import {PUB_SETUP} from '../config';

// Géométrie du décor : la photo (1536 × 2752) est posée en largeur 1080 dans la vidéo, centrée verticalement.
export const ECHELLE_PHOTO = 1080 / 1536;
export const DECALAGE_Y = (1920 - 2752 * ECHELLE_PHOTO) / 2;
export type Quad = [number, number][];
export const versImage = (q: number[][]): Quad => q.map(([x, y]) => [x * ECHELLE_PHOTO, y * ECHELLE_PHOTO + DECALAGE_Y]);
export const QUAD_HAUT = versImage(PUB_SETUP.ecranHaut);
export const QUAD_PORTABLE = versImage(PUB_SETUP.ecranPortable);

// Homographie rectangle (l × h) → quadrilatère (HG, HD, BD, BG) : coefficients de x = (a u + b v + c) / (g u + k v + 1)…
const coefficients = (l: number, h: number, q: Quad) => {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2, sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / den, k = (dx1 * sy - sx * dy1) / den;
  return {a: (x1 - x0 + g * x1) / l, b: (x3 - x0 + k * x3) / h, c: x0, d: (y1 - y0 + g * y1) / l, e: (y3 - y0 + k * y3) / h, f: y0, g: g / l, k: k / h};
};

// Transform CSS « corner-pin » d'un élément l × h (transform-origin 0 0) posé sur le quadrilatère.
export const matrice = (l: number, h: number, q: Quad) => {
  const {a, b, c, d, e, f, g, k} = coefficients(l, h, q);
  return `matrix3d(${a},${d},0,${g},${b},${e},0,${k},0,0,1,0,${c},${f},0,1)`;
};

// Point (u, v) de l'élément l × h → coordonnées dans l'image (pour viser la caméra).
export const projeter = (l: number, h: number, q: Quad, u: number, v: number): [number, number] => {
  const {a, b, c, d, e, f, g, k} = coefficients(l, h, q);
  const w = g * u + k * v + 1;
  return [(a * u + b * v + c) / w, (d * u + e * v + f) / w];
};
