import {interpolate} from 'remotion';
import {IconeHorloge} from '../../components/Icones';
import {PUB_PROMO} from '../../config';
import {C, Compteur, doux, INTER, milliers, Particules, ressort, Sortie, squash, styleDore, Verre, useTemps} from '../ui';
import {POINT, PointLumineux} from './Pause';

// 7. Révélation promo : le point explose en « PROMOTION » doré (reflet + particules), puis carte ÉCO, l'heure offerte, carte CONFORT.
const D = PUB_PROMO.scenes.promo;
const FIN = PUB_PROMO.scenes.cta;
const P = PUB_PROMO.promo;
const MOT = 'PROMOTION';

// Poussière dorée ambiante, déterministe, qui descend lentement.
const Poussiere: React.FC<{t: number; a: number}> = ({t, a}) => (
  <>
    {new Array(36).fill(0).map((_, i) => {
      const x = (i * 211) % 1080, vitesse = 30 + (i % 5) * 14;
      const y = ((i * 337) % 1920 + (t - a) * vitesse) % 1920;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2, borderRadius: '50%', background: C.or, opacity: (t < a ? 0 : 0.35) * (0.5 + 0.5 * Math.sin(t * 2 + i))}} />;
    })}
  </>
);

// Carte de prix en verre : ancien prix barré qui rétrécit, nouveau prix en ressort (ou en compteur), badge doré.
const CartePrix: React.FC<{t: number; fps: number; nom: string; c: typeof P.eco; compteur?: boolean}> = ({t, fps, nom, c, compteur}) => {
  const entree = squash(t, c.entree, fps, {damping: 13}, 0.8);
  const sortie = doux(t, c.sortie, c.sortie + 0.4);
  const barre = doux(t, c.nouveau - 0.25, c.nouveau + 0.05);
  const retrecit = ressort(t, c.nouveau, fps, {damping: 16});
  const neuf = squash(t, c.nouveau + 0.1, fps, {stiffness: 180, damping: 12}, 1.4);
  const badge = squash(t, c.badge, fps, {damping: 12}, 1.2);
  if (t < c.entree - 0.05 || sortie >= 1) return null;
  return (
    <Verre
      dore
      style={{
        left: 90, top: 560, width: 900, height: 700,
        opacity: Math.min(1, entree.v * 1.5) * (1 - sortie),
        transform: `translateX(${(1 - entree.v) * 700 - sortie * 900}px) scale(${entree.scaleY}, ${entree.scaleX})`,
      }}
    >
      <div style={{position: 'absolute', top: 60, left: 0, right: 0, textAlign: 'center', fontFamily: INTER, fontWeight: 700, fontSize: 30, letterSpacing: '0.18em', color: C.or}}>SERVICE {nom}</div>
      {/* Ancien prix */}
      <div style={{position: 'absolute', top: 140, left: 0, right: 0, textAlign: 'center', transform: `translateY(${-retrecit * 20}px) scale(${1 - retrecit * 0.45})`, opacity: 1 - retrecit * 0.45}}>
        <span style={{position: 'relative', display: 'inline-block', fontFamily: INTER, fontWeight: 700, fontSize: 120, letterSpacing: '-0.05em', color: barre > 0 ? '#8A8A90' : C.blanc}}>
          {milliers(c.ancien)}
          <i style={{position: 'absolute', left: -14, right: -14, top: '52%', height: 12, borderRadius: 6, background: C.rouge, transform: `scaleX(${barre}) rotate(-6deg)`, transformOrigin: '0 50%'}} />
        </span>
      </div>
      {/* Nouveau prix */}
      <div style={{position: 'absolute', top: 290, left: 0, right: 0, textAlign: 'center', opacity: Math.min(1, neuf.v * 2), transform: `translateY(${(1 - neuf.v) * 120}px) scale(${neuf.scaleX}, ${neuf.scaleY})`, transformOrigin: '50% 100%'}}>
        {compteur ? (
          <Compteur cible={c.prix} depart={c.ancien} a={c.nouveau + 0.1} t={t} fps={fps} style={{fontFamily: INTER, fontWeight: 700, fontSize: 190, letterSpacing: '-0.06em', color: C.blanc}} />
        ) : (
          <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 190, letterSpacing: '-0.06em', color: C.blanc}}>{milliers(c.prix)}</span>
        )}
        <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 52, color: C.or}}> FCFA/h</span>
      </div>
      {/* Badge doré */}
      <div style={{position: 'absolute', top: 540, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: t < c.badge ? 0 : 1}}>
        <div style={{padding: '22px 40px', borderRadius: 60, background: `linear-gradient(120deg, ${C.orSombre}, ${C.or} 45%, ${C.orClair})`, fontFamily: INTER, fontWeight: 700, fontSize: 42, color: '#1A1205', letterSpacing: '-0.01em',
          transform: `scale(${badge.v * badge.scaleX}, ${badge.v * badge.scaleY})`, boxShadow: '0 16px 40px rgba(232,176,75,0.35)'}}>
          {c.badgeTexte}
        </div>
      </div>
    </Verre>
  );
};

// L'heure offerte : 10 000 FCFA, 4 horloges, puis une 5e qui tombe (squash & stretch) avec « 1 HEURE OFFERTE ».
const Heures: React.FC<{t: number; fps: number}> = ({t, fps}) => {
  const H = P.heures;
  const entree = ressort(t, H.entree, fps, {damping: 15});
  const sortie = doux(t, H.sortie, H.sortie + 0.4);
  if (t < H.entree - 0.05 || sortie >= 1) return null;
  const pas = 180, x0 = 540 - 2 * pas;
  const cinq = squash(t, H.cinquieme, fps, {stiffness: 180, damping: 9}, 2);
  const offerte = squash(t, H.offerte, fps, {damping: 11}, 1.4);
  const cinqH = t >= H.cinquieme + 0.2;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: (1 - sortie) * Math.min(1, entree * 1.5), transform: `translateX(${(1 - entree) * 400 - sortie * 900}px)`}}>
      <div style={{position: 'absolute', top: 560, left: 0, right: 0, textAlign: 'center'}}>
        <Compteur cible={10000} a={H.entree} t={t} fps={fps} style={{fontFamily: INTER, fontWeight: 700, fontSize: 140, letterSpacing: '-0.05em', color: C.blanc}} />
        <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 52, color: C.or}}> FCFA</span>
      </div>
      <div style={{position: 'absolute', top: 735, left: 0, right: 0, textAlign: 'center', fontFamily: INTER, fontWeight: 700, fontSize: 64, letterSpacing: '-0.03em', color: cinqH ? C.or : C.gris}}>
        = {cinqH ? 5 : 4} heures
      </div>
      {H.horloges.map((a, i) => {
        const s = squash(t, a, fps, {damping: 11}, 1.2);
        return (
          <div key={i} style={{position: 'absolute', left: x0 + i * pas - 75, top: 880, width: 150, height: 150, opacity: t < a ? 0 : 1, transform: `scale(${s.v * s.scaleX}, ${s.v * s.scaleY})`, transformOrigin: '50% 100%'}}>
            <IconeHorloge taille={150} angle={(t - a) * 120} couleur={C.blanc} />
          </div>
        );
      })}
      {/* Emplacement vide puis 5e horloge qui tombe */}
      <div style={{position: 'absolute', left: x0 + 4 * pas - 70, top: 885, width: 140, height: 140, borderRadius: '50%', border: '4px dashed rgba(232,176,75,0.5)', opacity: t < H.cinquieme ? Math.min(1, (t - H.horloges[3]) * 3) : 0}} />
      <div style={{position: 'absolute', left: x0 + 4 * pas - 75, top: 880, width: 150, height: 150, opacity: t < H.cinquieme - 0.02 ? 0 : 1,
        transform: `translateY(${(1 - cinq.v) * -900}px) scale(${cinq.scaleX}, ${cinq.scaleY})`, transformOrigin: '50% 100%', filter: `drop-shadow(0 0 ${30 * offerte.v}px ${C.or})`}}>
        <IconeHorloge taille={150} angle={(t - H.cinquieme) * 120} couleur={C.or} />
      </div>
      {/* Étiquette dorée + brillance */}
      <div style={{position: 'absolute', top: 1110, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: t < H.offerte ? 0 : 1}}>
        <div style={{position: 'relative', overflow: 'hidden', padding: '26px 54px', borderRadius: 26, background: `linear-gradient(120deg, ${C.orSombre}, ${C.or} 45%, ${C.orClair})`,
          fontFamily: INTER, fontWeight: 700, fontSize: 64, letterSpacing: '0.02em', color: '#1A1205', transform: `rotate(-3deg) scale(${offerte.v * offerte.scaleX}, ${offerte.v * offerte.scaleY})`,
          boxShadow: '0 20px 60px rgba(232,176,75,0.45)'}}>
          1 HEURE OFFERTE
          <i style={{position: 'absolute', top: -20, bottom: -20, width: 90, left: interpolate(doux(t, H.offerte + 0.2, H.offerte + 0.9), [0, 1], [-140, 700]), background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)', transform: 'skewX(-20deg)'}} />
        </div>
      </div>
    </div>
  );
};

export const Promo: React.FC = () => {
  const {t, fps} = useTemps(D);
  // Le point se contracte puis explose ; les lettres jaillissent du point (morphing point → mot)
  const contraction = doux(t, P.explosion - 0.25, P.explosion);
  const flash = doux(t, P.explosion, P.explosion + 0.5);
  const haut = ressort(t, P.enHaut, fps, {damping: 16});
  const yMot = interpolate(haut, [0, 1], [POINT.y, 400]);
  const echMot = interpolate(haut, [0, 1], [1, 0.52]);
  return (
    <Sortie t={t} fin={FIN} d={0.35}>
      <div style={{position: 'absolute', inset: 0, background: '#000'}} />
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% ${yMot / 19.2}%, rgba(232,176,75,${0.22 * Math.min(1, flash * 2)}), transparent 55%)`}} />
      <Poussiere t={t} a={P.explosion} />
      {t < P.explosion + 0.05 && <PointLumineux t={t} echelle={1 + contraction * -0.6 + doux(t, D, D + 0.4) * 0} />}
      {/* Onde de choc */}
      {flash > 0 && flash < 1 && (
        <div style={{position: 'absolute', left: POINT.x - 600 * flash, top: POINT.y - 600 * flash, width: 1200 * flash, height: 1200 * flash, borderRadius: '50%', border: `${10 * (1 - flash)}px solid ${C.orClair}`, opacity: 1 - flash}} />
      )}
      <Particules t={t} a={P.explosion} x={POINT.x} y={POINT.y} n={80} duree={4} />
      {/* PROMOTION */}
      <div style={{position: 'absolute', left: 0, right: 0, top: yMot - 85, display: 'flex', justifyContent: 'center', transform: `scale(${echMot})`, transformOrigin: '50% 50%'}}>
        {[...MOT].map((l, i) => {
          const s = squash(t, P.explosion + 0.02 + Math.abs(i - 4) * 0.04, fps, {stiffness: 200, damping: 11}, 1.5);
          const dx = (4 - i) * 105 * (1 - s.v);
          return (
            <span key={i} style={{display: 'inline-block', fontFamily: INTER, fontWeight: 700, fontSize: 168, lineHeight: '170px', letterSpacing: '-0.04em', ...styleDore(t, P.explosion + i * 0.05),
              opacity: t < P.explosion ? 0 : Math.min(1, s.v * 2), transform: `translateX(${dx}px) scale(${s.v * s.scaleX}, ${s.v * s.scaleY})`, filter: `drop-shadow(0 0 30px rgba(232,176,75,0.35))`}}>
              {l}
            </span>
          );
        })}
      </div>
      <CartePrix t={t} fps={fps} nom="ÉCO" c={P.eco} />
      <Heures t={t} fps={fps} />
      <CartePrix t={t} fps={fps} nom="CONFORT" c={P.confort} compteur />
    </Sortie>
  );
};
