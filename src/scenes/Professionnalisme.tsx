import {AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COULEURS, PLANS, TEXTES, ZONE_SURE} from '../config';
import {Assombri, BandesCinema, Finition, Flash, Halo, Reflet} from '../components/Effets';
import {MotAnime} from '../components/KineticText';
import {Media} from '../components/Media';
import {Son} from '../components/Son';
import {reperesDe} from '../lib/scene';

const r = reperesDe('professionnalisme');

// Scène 4 : rythme plus posé, format cinéma, lumière chaude.
// Chauffeur, détails de l'intérieur, porte ouverte, puis la promesse.
export const Professionnalisme: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = TEXTES.professionnalisme;

  const aChauffeurs = r('chauffeurs');
  const aDetail = r('detail');
  const aPorte = r('porte');
  const aMerite = r('merite');

  const coupes = [0, aDetail - 4, aPorte - 4, aMerite - 4, durationInFrames];
  const plans = [PLANS.chauffeur, PLANS.interieur, PLANS.chauffeurPorte, PLANS.vehiculePremium];

  const soulignement = spring({frame: frame - (aMerite + 22), fps, config: {damping: 20}});

  const blocTexte: React.CSSProperties = {
    position: 'absolute',
    left: ZONE_SURE.cotes,
    right: ZONE_SURE.cotes,
    bottom: ZONE_SURE.bas + 60,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  };

  return (
    <AbsoluteFill style={{backgroundColor: COULEURS.noir, overflow: 'hidden'}}>
      {plans.map((plan, i) => (
        <Sequence key={i} from={coupes[i]} durationInFrames={coupes[i + 1] - coupes[i]}>
          <Media
            plan={plan}
            amplitude={0.08}
            derive={i % 2 ? -30 : 30}
            filtre="saturate(1.05) contrast(1.1) sepia(0.12)"
          />
        </Sequence>
      ))}
      {/* Lumière chaude */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(200deg, rgba(255,160,80,0.18) 0%, transparent 50%)',
          mixBlendMode: 'screen',
        }}
      />
      <Assombri haut={0.3} bas={0.92} />
      <Halo debut={aPorte - 6} duree={44} />

      {/* Chauffeurs professionnels / attentifs à chaque détail */}
      {frame < coupes[3] && (
        <div style={blocTexte}>
          <div style={{width: interpolate(frame - aChauffeurs, [0, 12], [0, 140], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), height: 8, background: COULEURS.rougeNeon, boxShadow: `0 0 20px ${COULEURS.rouge}`, borderRadius: 4, marginBottom: 14}} />
          <div style={{display: 'flex', flexWrap: 'wrap', columnGap: 24}}>
            {t.ligne1.split(' ').map((mot, i) => (
              <MotAnime key={mot} texte={mot} a={aChauffeurs + i * 8} entree="monte" taille={96} />
            ))}
          </div>
          <MotAnime texte={t.ligne2} a={aDetail} entree="lettres" taille={58} poids={600} couleur={COULEURS.gris} />
          <div style={{marginTop: 18}}>
            <MotAnime texte={t.porte} a={aPorte} entree="glisse" taille={58} poids={800} couleur={COULEURS.rougeNeon} />
          </div>
        </div>
      )}

      {/* Traité comme vous le méritez */}
      {frame >= coupes[3] && (
        <div style={{...blocTexte, alignItems: 'center', bottom: ZONE_SURE.bas + 120}}>
          <MotAnime texte={t.final1} a={aMerite} entree="monte" taille={88} poids={800} />
          <div style={{position: 'relative', overflow: 'hidden', padding: '0 10px'}}>
            <MotAnime texte={t.final2} a={aMerite + 10} entree="choc" taille={112} couleur={COULEURS.rougeNeon} neon />
            <Reflet debut={aMerite + 26} duree={20} />
          </div>
          <div
            style={{
              width: 520 * soulignement,
              height: 6,
              background: COULEURS.blanc,
              borderRadius: 3,
              boxShadow: `0 0 18px ${COULEURS.rouge}`,
            }}
          />
        </div>
      )}

      <BandesCinema />
      <Flash a={coupes[3]} duree={10} couleur="#FFE2C6" force={0.6} />

      {coupes.slice(1, 4).map((c) => (
        <Son key={c} nom="whooshCourt" a={c - 4} volume={0.5} />
      ))}
      <Son nom="scintillement" a={aPorte - 4} />
      <Son nom="impact" a={aMerite + 9} volume={0.5} />
      <Son nom="scintillement" a={aMerite + 24} volume={0.8} />
      <Finition />
    </AbsoluteFill>
  );
};
