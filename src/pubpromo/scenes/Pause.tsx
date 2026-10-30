import {PUB_PROMO} from '../../config';
import {C, INTER, ressort, useTemps} from '../ui';

// 6. Noir, pause dramatique : un point lumineux pulse, « Et tenez-vous prêts… ».
const D = PUB_PROMO.scenes.pause;
const P = PUB_PROMO.pause;
export const POINT = {x: 540, y: 900};

// Point doré qui pulse (partagé avec la scène promo, où il explose).
export const PointLumineux: React.FC<{t: number; echelle?: number}> = ({t, echelle = 1}) => {
  const pulse = 1 + 0.18 * Math.sin(t * 5.2);
  const r = 16 * pulse * echelle;
  return (
    <>
      <div style={{position: 'absolute', left: POINT.x - r * 6, top: POINT.y - r * 6, width: r * 12, height: r * 12, borderRadius: '50%', background: `radial-gradient(circle, rgba(232,176,75,0.35), transparent 65%)`}} />
      <div style={{position: 'absolute', left: POINT.x - r, top: POINT.y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: C.orClair, boxShadow: `0 0 ${40 * echelle}px ${C.or}, 0 0 ${90 * echelle}px ${C.or}`}} />
    </>
  );
};

export const Pause: React.FC = () => {
  const {t, fps} = useTemps(D);
  const apparition = ressort(t, D + 0.1, fps, {damping: 20});
  return (
    <div style={{position: 'absolute', inset: 0, background: '#000'}}>
      <PointLumineux t={t} echelle={apparition} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1060, display: 'flex', justifyContent: 'center'}}>
        {[...P.texte].map((l, i) => {
          const k = ressort(t, P.a + i * 0.035, fps, {damping: 20});
          return (
            <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', fontFamily: INTER, fontWeight: 600, fontSize: 56, letterSpacing: '-0.01em', color: '#CFCFD4', opacity: Math.min(1, k * 1.5), filter: `blur(${(1 - Math.min(1, k)) * 8}px)`}}>
              {l}
            </span>
          );
        })}
      </div>
    </div>
  );
};
