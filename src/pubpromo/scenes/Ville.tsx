import {PUB_PROMO} from '../../config';
import {C, cheminBezier, doux, MotCinetique, pointBezier, ressort, Sortie, useTemps} from '../ui';

// 1. « Douala ne s'arrête jamais. Vous non plus. » : une route se dessine à travers une ville stylisée.
const D = PUB_PROMO.scenes.ville;
const FIN = PUB_PROMO.scenes.cartes;
const R = PUB_PROMO.ville;

// Route (Bézier cubiques) du bas de l'écran jusqu'à l'horizon de la ville.
const ROUTE = [80, 1640, 360, 1580, 280, 1450, 540, 1400, 800, 1350, 900, 1270, 660, 1200, 460, 1140, 600, 1080, 860, 1050];

// Immeubles déterministes : [x, largeur, hauteur].
const IMMEUBLES: [number, number, number][] = [
  [20, 90, 260], [120, 70, 380], [200, 110, 300], [320, 80, 470], [410, 120, 340], [540, 90, 520], [640, 100, 390],
  [750, 80, 450], [840, 110, 320], [960, 100, 410],
];
const SOL = 1180;

export const Ville: React.FC = () => {
  const {t, fps} = useTemps(D);
  const p = doux(t, 0.1, 2.7);
  const voiture = pointBezier(ROUTE, p);
  return (
    <Sortie t={t} fin={FIN}>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 70%, rgba(232,176,75,0.10), transparent 60%), ${C.fond}`}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {IMMEUBLES.map(([x, l, h], i) => {
          const v = ressort(t, 0.05 + i * 0.05, fps, {damping: 14});
          const hh = h * v;
          return (
            <g key={i} opacity={0.9}>
              <rect x={x} y={SOL - hh} width={l} height={hh} rx={6} fill="#161616" stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
              {new Array(Math.floor(hh / 46)).fill(0).map((_, k) =>
                [0, 1].map((c) => (
                  <rect key={`${k}-${c}`} x={x + 16 + c * (l / 2)} y={SOL - hh + 22 + k * 46} width={l / 2 - 30} height={12} rx={3}
                    fill={(i * 7 + k * 3 + c) % 5 === 0 ? C.or : 'rgba(255,255,255,0.10)'} opacity={(i * 7 + k * 3 + c) % 5 === 0 ? 0.8 : 1} />
                )),
              )}
            </g>
          );
        })}
        <rect x={0} y={SOL} width={1080} height={740} fill={C.fond} />
        {/* Route qui se dessine */}
        <path d={cheminBezier(ROUTE)} pathLength={1} fill="none" stroke="#1E1E1E" strokeWidth={70} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
        <path d={cheminBezier(ROUTE)} pathLength={1} fill="none" stroke={C.or} strokeWidth={5} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={0.9} />
        {/* Phares de la voiture qui suit le tracé */}
        {p > 0.01 && p < 0.995 && (
          <>
            <circle cx={voiture.x} cy={voiture.y} r={34} fill={C.orClair} opacity={0.25} />
            <circle cx={voiture.x} cy={voiture.y} r={12} fill={C.blanc} />
          </>
        )}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 430}}>
        <MotCinetique texte="Douala" a={R.titre} t={t} fps={fps} taille={168} />
        <MotCinetique texte="ne s’arrête jamais." a={R.titre + 0.35} t={t} fps={fps} taille={78} ecart={0.018} style={{marginTop: 18}} />
        <MotCinetique texte="Vous non plus." a={R.vousNonPlus} t={t} fps={fps} taille={96} couleur={C.or} ecart={0.025} style={{marginTop: 70}} />
      </div>
    </Sortie>
  );
};
