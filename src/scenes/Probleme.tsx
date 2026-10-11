import {AbsoluteFill, interpolate, random, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {COULEURS, PLANS, POLICES, TEXTES, ZONE_SURE} from '../config';
import {Assombri, Finition, Flash, Trainees} from '../components/Effets';
import {IconeHorloge, IconeLieu} from '../components/Icones';
import {MotAnime} from '../components/KineticText';
import {Media} from '../components/Media';
import {reperesDe, secousse} from '../lib/scene';

const r = reperesDe('probleme');

// Étalonnage « stress » : désaturé, contrasté, assombri.
const GRADE_STRESS = 'saturate(0.4) contrast(1.3) brightness(0.62)';

// Décalage rouge/cyan façon glitch, actif juste après l'apparition du mot.
const glitch = (frame: number, a: number) => {
  const f = frame - a;
  const actif = f >= 0 && (f < 10 || (f % 23 < 2));
  if (!actif) return '0 8px 30px rgba(0,0,0,0.7)';
  const dx = (random(`g-${frame}`) - 0.5) * 22;
  return `${dx}px 0 ${COULEURS.rougeNeon}, ${-dx}px 0 #19E3FF, 0 8px 30px rgba(0,0,0,0.7)`;
};

// Scène 2 : Douala bloquée (embouteillages, retards), puis la promesse
// d'un trajet serein avec retour brutal de la couleur.
export const Probleme: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = TEXTES.probleme;

  const aLieu = r('douala');
  const aEmb = r('embouteillages');
  const aRet = r('retards');
  const aCasse = r('casseTete');
  const aEtSi = r('etSi');
  const aTranquille = r('tranquille');

  // Plans successifs (coupe juste avant chaque mot).
  const coupes = [0, aRet - 3, aCasse - 3, aEtSi - 4, durationInFrames];
  const plans = [PLANS.embouteillage, PLANS.retards, PLANS.casseTete, PLANS.sereinite];

  const choc = [aEmb, aRet, aCasse].reduce(
    (acc, a) => {
      const s = secousse(frame, a, 16);
      return {x: acc.x + s.x, y: acc.y + s.y};
    },
    {x: 0, y: 0},
  );
  // Retour de la couleur sur le dernier plan.
  const couleur = interpolate(frame, [coupes[3], coupes[3] + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const motCentre: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 820,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
  };

  return (
    <AbsoluteFill style={{backgroundColor: COULEURS.noir, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${choc.x}px, ${choc.y}px) scale(1.03)`}}>
        {plans.map((plan, i) => (
          <Sequence key={i} from={coupes[i]} durationInFrames={coupes[i + 1] - coupes[i]}>
            <Media
              plan={plan}
              amplitude={i === 3 ? 0.1 : 0.22}
              derive={i % 2 ? -60 : 60}
              filtre={
                i === 3
                  ? `saturate(${0.3 + couleur * 0.9}) brightness(${0.8 + couleur * 0.25})`
                  : GRADE_STRESS
              }
            />
          </Sequence>
        ))}
      </AbsoluteFill>

      {/* Voile rouge sur les plans « stress » */}
      <AbsoluteFill
        style={{
          backgroundColor: COULEURS.rouge,
          mixBlendMode: 'multiply',
          opacity: frame < coupes[3] ? 0.35 : 0,
        }}
      />
      <Assombri haut={0.6} bas={0.75} />
      {frame < coupes[3] && <Trainees nombre={8} vitesse={2.2} opacite={0.35} graine="probleme" />}

      {/* « Douala » : étiquette de lieu */}
      <Sequence from={aLieu} durationInFrames={coupes[3] - aLieu}>
        <div
          style={{
            position: 'absolute',
            top: ZONE_SURE.haut + 40,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '16px 34px',
              borderRadius: 60,
              backgroundColor: COULEURS.rouge,
              boxShadow: `0 0 40px ${COULEURS.rouge}`,
              fontFamily: POLICES.titre,
              fontWeight: 800,
              fontSize: 46,
              letterSpacing: 6,
              color: COULEURS.blanc,
              transform: `scale(${interpolate(frame - aLieu, [0, 8], [0.4, 1], {extrapolateRight: 'clamp'})})`,
            }}
          >
            <IconeLieu taille={44} />
            {t.lieu.toUpperCase()}
          </div>
        </div>
      </Sequence>

      {/* Mots du problème, un à la fois */}
      <div style={motCentre}>
        {frame < aRet && (
          <MotAnime texte={t.mot1} a={aEmb} taille={116} style={{textShadow: glitch(frame, aEmb)}} />
        )}
        {frame >= aRet && frame < aCasse && (
          <>
            <div style={{opacity: interpolate(frame - aRet, [0, 4], [0, 1], {extrapolateRight: 'clamp'})}}>
              <IconeHorloge taille={180} angle={(frame - aRet) * 38} />
            </div>
            <MotAnime texte={t.mot2} a={aRet} taille={150} style={{textShadow: glitch(frame, aRet)}} />
          </>
        )}
        {frame >= aCasse && frame < coupes[3] && (
          <MotAnime
            texte={t.mot3}
            a={aCasse}
            taille={150}
            couleur={COULEURS.rougeNeon}
            style={{textShadow: glitch(frame, aCasse)}}
          />
        )}
      </div>

      {/* La promesse */}
      {frame >= coupes[3] && (
        <>
          <AbsoluteFill
            style={{
              background: 'radial-gradient(70% 22% at 50% 52%, rgba(0,0,0,0.6) 0%, transparent 100%)',
            }}
          />
          <div style={{...motCentre, top: 830, gap: 8}}>
            <div style={{display: 'flex', gap: 26, justifyContent: 'center', alignItems: 'baseline', flexWrap: 'wrap', padding: '0 60px'}}>
              {t.question1.split(' ').map((mot, i, mots) => (
                <MotAnime
                  key={mot}
                  texte={mot}
                  a={Math.round(aEtSi + ((aTranquille - aEtSi - 10) * i) / mots.length)}
                  entree="monte"
                  taille={i === mots.length - 1 ? 120 : 84}
                  poids={i === mots.length - 1 ? 900 : 800}
                />
              ))}
            </div>
            <MotAnime texte={t.question2} a={aTranquille - 8} entree="choc" taille={88} couleur={COULEURS.rougeNeon} neon />
          </div>
        </>
      )}

      <Flash a={aEmb} duree={5} force={0.3} />
      <Flash a={coupes[1]} duree={5} force={0.45} />
      <Flash a={coupes[2]} duree={5} couleur={COULEURS.rouge} force={0.5} />
      <Flash a={coupes[3]} duree={12} force={0.9} />
      <Finition />
    </AbsoluteFill>
  );
};
