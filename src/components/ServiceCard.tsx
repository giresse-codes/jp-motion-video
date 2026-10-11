import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COULEURS, POLICES, type Service} from '../config';
import {Reflet} from './Effets';
import {IconeCoche} from './Icones';

type Props = {
  service: Service;
  numero: number;
  total: number;
  // Images (relatives à la séquence) où chaque élément apparaît.
  aCarte: number;
  aPrix: number;
  aAvantages: number;
  ecartAvantages: number;
  aBadge?: number;
};

const formatPrix = (n: number) => Math.round(n).toLocaleString('fr-FR').replace(/\s/g, ' ');

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Carte de service en verre dépoli : nom, prix en compteur, avantages cochés.
export const ServiceCard: React.FC<Props> = ({
  service,
  numero,
  total,
  aCarte,
  aPrix,
  aAvantages,
  ecartAvantages,
  aBadge,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entree = spring({frame: frame - aCarte, fps, config: {damping: 15, stiffness: 140, mass: 0.8}});
  // Faux flou de mouvement pendant le glissement d'entrée.
  const vitesse = Math.abs(1 - entree);
  const prix = interpolate(frame, [aPrix, aPrix + 20], [0, service.prix], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const impactPrix = spring({frame: frame - (aPrix + 20), fps, config: {damping: 8, stiffness: 200}});

  if (frame < aCarte) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        bottom: 370,
        transform: `translateX(${(1 - entree) * 900}px) skewX(${(1 - entree) * -12}deg)`,
        filter: vitesse > 0.02 ? `blur(${vitesse * 14}px)` : undefined,
        opacity: Math.min(1, entree * 2),
      }}
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 44,
          padding: '44px 52px 48px',
          background: 'linear-gradient(160deg, rgba(30,30,30,0.72) 0%, rgba(8,8,8,0.82) 100%)',
          backdropFilter: 'blur(18px)',
          border: '2px solid rgba(255,255,255,0.14)',
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.04), 0 0 60px ${COULEURS.rouge}33`,
        }}
      >
        {/* Liseré rouge néon à gauche */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 40,
            bottom: 40,
            width: 10,
            borderRadius: 10,
            background: COULEURS.rougeNeon,
            boxShadow: `0 0 24px ${COULEURS.rouge}`,
          }}
        />
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div
            style={{
              fontFamily: POLICES.texte,
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: 8,
              color: COULEURS.rougeNeon,
            }}
          >
            SERVICE
          </div>
          <div style={{fontFamily: POLICES.texte, fontWeight: 600, fontSize: 28, color: COULEURS.gris, letterSpacing: 2}}>
            {String(numero).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        </div>
        <div
          style={{
            fontFamily: POLICES.titre,
            fontWeight: 900,
            fontStyle: 'italic',
            fontSize: 132,
            lineHeight: 1,
            color: COULEURS.blanc,
            marginTop: 6,
            letterSpacing: -2,
          }}
        >
          {service.nom}
        </div>
        <div style={{fontFamily: POLICES.texte, fontWeight: 400, fontSize: 36, color: COULEURS.gris, marginTop: 6}}>
          {service.accroche}
        </div>

        {/* Prix */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 18,
            marginTop: 28,
            opacity: interpolate(frame, [aPrix - 2, aPrix + 2], [0, 1], clamp),
            transform: `scale(${1 + impactPrix * 0.06 - (frame > aPrix + 20 ? 0.06 : 0)})`,
            transformOrigin: 'left center',
          }}
        >
          {service.prixPrefixe && (
            <span style={{fontFamily: POLICES.titre, fontWeight: 800, fontStyle: 'italic', fontSize: 50, color: COULEURS.blanc}}>
              {service.prixPrefixe}
            </span>
          )}
          <span
            style={{
              fontFamily: POLICES.titre,
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: 116,
              color: COULEURS.rougeNeon,
              textShadow: `0 0 2px ${COULEURS.rougeNeon}, 0 0 26px ${COULEURS.rouge}aa`,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatPrix(prix)}
          </span>
          <span style={{fontFamily: POLICES.titre, fontWeight: 800, fontSize: 40, color: COULEURS.blanc}}>
            {service.unite}
          </span>
        </div>

        {/* Avantages */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 26}}>
          {service.avantages.map((av, i) => {
            const a = aAvantages + i * ecartAvantages;
            const p = spring({frame: frame - a, fps, config: {damping: 16, stiffness: 160}});
            return (
              <div
                key={av}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 60}px)`,
                  fontFamily: POLICES.texte,
                  fontWeight: 600,
                  fontSize: 42,
                  color: COULEURS.blanc,
                }}
              >
                <IconeCoche taille={46} />
                {av}
              </div>
            );
          })}
        </div>

        {service.badge && aBadge !== undefined && (
          <div
            style={{
              marginTop: 30,
              display: 'inline-block',
              padding: '16px 28px',
              borderRadius: 18,
              background: COULEURS.rouge,
              boxShadow: `0 0 40px ${COULEURS.rouge}`,
              fontFamily: POLICES.titre,
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: 44,
              color: COULEURS.blanc,
              transform: `scale(${spring({frame: frame - aBadge, fps, config: {damping: 9, stiffness: 180}})}) rotate(-2deg)`,
              transformOrigin: 'left center',
            }}
          >
            {service.badge}
          </div>
        )}
        {service.mention && (
          <div
            style={{
              marginTop: 22,
              fontFamily: POLICES.texte,
              fontWeight: 600,
              fontSize: 32,
              color: COULEURS.gris,
              fontStyle: 'italic',
              opacity: interpolate(frame, [(aBadge ?? aAvantages) + 8, (aBadge ?? aAvantages) + 16], [0, 1], clamp),
            }}
          >
            * {service.mention}
          </div>
        )}
        <Reflet debut={aCarte + 14} duree={22} />
      </div>
    </div>
  );
};
