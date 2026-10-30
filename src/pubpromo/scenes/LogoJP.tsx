import {interpolate} from 'remotion';
import {Embleme} from '../../components/Logo';
import {PUB_PROMO} from '../../config';
import {C, INTER, MotCinetique, ressort, Sortie, squash, Verre, useTemps} from '../ui';
import {DISQUE} from './Cartes';

// 3. Le disque de verre (issu des cartes) reçoit le logo en squash & stretch, puis « Votre chauffeur privé ».
const D = PUB_PROMO.scenes.logo;
const FIN = PUB_PROMO.scenes.services;
const R = PUB_PROMO.logo;
const NOM = 'JP SERVICE EXPRESS URBAINE';

export const LogoJP: React.FC = () => {
  const {t, fps} = useTemps(D);
  const {v, scaleX, scaleY} = squash(t, R.chute, fps, {stiffness: 180, damping: 10}, 1.6);
  const halo = ressort(t, R.chute, fps, {damping: 20});
  return (
    <Sortie t={t} fin={FIN}>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 45%, rgba(225,6,0,${0.12 * halo}), transparent 45%)`}} />
      <Verre
        style={{
          left: DISQUE.x - DISQUE.taille / 2,
          top: DISQUE.y - DISQUE.taille / 2,
          width: DISQUE.taille,
          height: DISQUE.taille,
          borderRadius: '50%',
          transform: `scale(${(1 + halo * 0.15) * scaleX}, ${(1 + halo * 0.15) * scaleY})`,
          transformOrigin: '50% 100%',
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 ${60 * halo}px rgba(225,6,0,${0.35 * halo})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{transform: `translateY(${(1 - v) * -420}px) scale(${interpolate(v, [0, 1], [0.4, 1])})`, opacity: Math.min(1, v * 3)}}>
          <Embleme largeur={230} />
        </div>
      </Verre>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1100}}>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          {[...NOM].map((l, i) => {
            const k = ressort(t, R.nom + i * 0.02, fps, {damping: 15});
            return (
              <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', fontFamily: INTER, fontWeight: 700, fontSize: 44, letterSpacing: '0.08em', color: C.blanc, opacity: Math.min(1, k * 2), transform: `translateY(${(1 - k) * 30}px)`}}>
                {l}
              </span>
            );
          })}
        </div>
        <MotCinetique texte="Votre chauffeur privé." a={R.chauffeur} t={t} fps={fps} taille={92} couleur={C.or} ecart={0.022} style={{marginTop: 60}} />
      </div>
    </Sortie>
  );
};
