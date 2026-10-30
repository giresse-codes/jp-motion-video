import {interpolate} from 'remotion';
import {PUB_PROMO} from '../../config';
import {C, doux, INTER, MotsUnParUn, squash, Verre, useTemps} from '../ui';

// 2. Trois cartes en verre tombent en ressort (squash & stretch), puis « Vous méritez mieux qu'un simple trajet. ».
// Fin : les cartes se fondent (morphing) en un disque de verre au centre, qui devient le logo à la scène suivante.
const D = PUB_PROMO.scenes.cartes;
const R = PUB_PROMO.cartes;
export const DISQUE = {x: 540, y: 860, taille: 280};

const Icone: React.FC<{nom: string}> = ({nom}) => (
  <svg width={84} height={84} viewBox="0 0 48 48" fill="none" stroke={C.blanc} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
    {nom === 'mallette' && (
      <>
        <rect x={6} y={15} width={36} height={24} rx={5} />
        <path d="M18 15v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4M6 25h36" />
        <circle cx={24} cy={25} r={2.5} fill={C.or} stroke={C.or} />
      </>
    )}
    {nom === 'avion' && <path d="M44 22c0-2-2-3-4-3H30L20 5h-4l5 14H11l-3-4H5l2 9-2 9h3l3-4h10l-5 14h4l10-14h10c2 0 4-1 4-3Z" fill="rgba(232,176,75,0.25)" />}
    {nom === 'palmier' && (
      <>
        <path d="M24 44c0-10 1-18 4-26" />
        <path d="M28 18c-4-6-12-6-16-2 6-1 10 0 16 2ZM28 18c2-7 10-10 15-6-6 0-10 2-15 6ZM28 18c6-2 12 1 13 7-4-4-8-5-13-7ZM28 18c-6 0-11 4-11 9 3-4 7-6 11-9Z" fill="rgba(232,176,75,0.25)" />
        <path d="M6 44h36" />
      </>
    )}
  </svg>
);

export const Cartes: React.FC = () => {
  const {t, fps} = useTemps(D);
  const recul = doux(t, R.meriter - 0.1, R.meriter + 0.5);
  const morphe = doux(t, R.morphe, R.morphe + 0.45);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {R.items.map((c, i) => {
        const {v, scaleX, scaleY} = squash(t, c.a, fps, {stiffness: 180, damping: 12}, 1.2);
        const y0 = 400 + i * 230;
        const y = interpolate(v, [0, 1], [-420, y0]) - recul * (90 + i * 20);
        // Morphing : la carte devient un disque au centre
        const l = interpolate(morphe, [0, 1], [880, DISQUE.taille]);
        const h = interpolate(morphe, [0, 1], [190, DISQUE.taille]);
        const x = interpolate(morphe, [0, 1], [100, DISQUE.x - DISQUE.taille / 2]);
        const yy = interpolate(morphe, [0, 1], [y, DISQUE.y - DISQUE.taille / 2]);
        return (
          <Verre
            key={i}
            style={{
              left: x,
              top: yy,
              width: l,
              height: h,
              borderRadius: interpolate(morphe, [0, 1], [44, DISQUE.taille / 2]),
              opacity: (t < c.a ? 0 : 1) * interpolate(recul, [0, 1], [1, 0.55]) * (i === 0 ? 1 : 1 - morphe * 0.999),
              transform: `scale(${scaleX * (1 - recul * 0.08)}, ${scaleY * (1 - recul * 0.08)})`,
              transformOrigin: '50% 0%',
              display: 'flex',
              alignItems: 'center',
              gap: 34,
              padding: '0 50px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{opacity: 1 - morphe * 2, display: 'flex', alignItems: 'center', gap: 34}}>
              <div style={{width: 120, height: 120, borderRadius: 34, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icone nom={c.icone} />
              </div>
              <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 56, letterSpacing: '-0.03em', color: C.blanc, whiteSpace: 'nowrap'}}>{c.texte}</span>
            </div>
          </Verre>
        );
      })}
      <div style={{position: 'absolute', left: 80, right: 80, top: 1130, opacity: 1 - morphe}}>
        <MotsUnParUn
          t={t}
          fps={fps}
          taille={96}
          mots={[
            {texte: 'Vous', a: R.meriter},
            {texte: 'méritez', a: R.meriter + 0.2},
            {texte: 'mieux', a: R.meriter + 0.45, couleur: C.or},
            {texte: 'qu’un', a: R.meriter + 0.7},
            {texte: 'simple', a: R.meriter + 0.95},
            {texte: 'trajet.', a: R.meriter + 1.25},
          ]}
        />
      </div>
    </div>
  );
};
