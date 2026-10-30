import {LogoComplet} from '../../components/Logo';
import {WhatsAppIcon} from '../../components/WhatsAppIcon';
import {PUB_PROMO} from '../../config';
import {C, doux, Fond, INTER, MotsUnParUn, ressort, squash, useTemps} from '../ui';

// 8. Bouton WhatsApp vert en ressort, « Réservez maintenant », numéro par groupes, logo en bas, fondu au noir.
const D = PUB_PROMO.scenes.cta;
const R = PUB_PROMO.cta;

export const Cta: React.FC = () => {
  const {t, fps} = useTemps(D);
  const bouton = squash(t, R.bouton, fps, {stiffness: 180, damping: 10}, 1.4);
  const logo = ressort(t, R.logo, fps, {damping: 16});
  const noir = doux(t, R.fondu, PUB_PROMO.dureeS - 0.05);
  const pouls = t > R.bouton + 1 ? 1 + 0.025 * Math.sin((t - R.bouton) * 5) : 1;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Fond halo="rgba(37,211,102,0.10)" />
      <div style={{position: 'absolute', left: 60, right: 60, top: 520}}>
        <MotsUnParUn t={t} fps={fps} taille={100} mots={[{texte: 'Réservez', a: D + 0.15}, {texte: 'maintenant', a: D + 0.4, couleur: C.or}]} />
      </div>
      <div style={{position: 'absolute', left: 130, top: 770, width: 820, height: 190, borderRadius: 95, background: C.vert, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30,
        boxShadow: `0 30px 80px rgba(37,211,102,0.35), inset 0 2px 0 rgba(255,255,255,0.35)`,
        opacity: t < R.bouton ? 0 : 1, transform: `scale(${bouton.v * bouton.scaleX * pouls}, ${bouton.v * bouton.scaleY * pouls})`}}>
        <WhatsAppIcon taille={110} fond={false} />
        <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 70, color: C.blanc, letterSpacing: '-0.03em'}}>WhatsApp</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1030, display: 'flex', justifyContent: 'center', gap: 22}}>
        {[{texte: '+237', a: R.bouton + 0.3}, ...R.groupes].map((g, i) => {
          const s = squash(t, g.a, fps, {damping: 11}, 1.3);
          return (
            <span key={i} style={{display: 'inline-block', fontFamily: INTER, fontWeight: 700, fontSize: 86, letterSpacing: '-0.03em', color: i === 0 ? C.gris : C.blanc, fontVariantNumeric: 'tabular-nums',
              opacity: t < g.a ? 0.12 : 1, transform: `translateY(${(1 - Math.min(1, s.v)) * 30}px) scale(${s.scaleX}, ${s.scaleY})`, transformOrigin: '50% 100%'}}>
              {g.texte}
            </span>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1300, display: 'flex', justifyContent: 'center', opacity: logo, transform: `translateY(${(1 - logo) * 40}px)`}}>
        <LogoComplet largeur={640} />
      </div>
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: noir}} />
    </div>
  );
};
