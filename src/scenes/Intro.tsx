import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COULEURS, MARQUE, ZONE_SURE} from '../config';
import {Finition, Flash, RouteNeon, Trainees} from '../components/Effets';
import {MotAnime} from '../components/KineticText';
import {Embleme} from '../components/Logo';
import {Son} from '../components/Son';
import {reperesDe, secousse} from '../lib/scene';

const r = reperesDe('intro');

// Scène 1 : le logo s'allume comme une enseigne néon, puis le slogan
// tombe mot par mot sur la voix (« Rapide. Sûr. Confortable. »).
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();

  const aMarque = Math.max(6, r('marque'));
  const mots = [r('rapide'), r('sur'), r('confortable')];

  // Allumage néon de l'emblème : quelques clignotements puis stable.
  const f = frame - aMarque;
  const clignote = f < 0 ? 0 : f < 14 ? [1, 0.2, 1, 0.1, 0.9, 1, 0.4, 1][Math.floor(f / 1.8)] ?? 1 : 1;
  const apparition = spring({frame: f, fps, config: {damping: 16, stiffness: 120}});
  const pulsation = 1 + Math.sin(frame / 7) * 0.015;

  // Le bloc marque remonte pour laisser la place au slogan.
  const montee = spring({frame: frame - (mots[0] - 10), fps, config: {damping: 18, stiffness: 90}});
  const yMarque = interpolate(montee, [0, 1], [0, -200]);
  const echelleMarque = interpolate(montee, [0, 1], [1, 0.78]);

  // Une secousse de caméra à chaque mot du slogan.
  const choc = mots.reduce(
    (acc, a) => {
      const s = secousse(frame, a, 12);
      return {x: acc.x + s.x, y: acc.y + s.y};
    },
    {x: 0, y: 0},
  );

  const ligne = interpolate(frame, [0, aMarque + 4], [0, 1], {extrapolateRight: 'clamp'});
  const vitesseTrainees = interpolate(frame, [0, 20, 60], [3, 1.6, 0.6], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: COULEURS.noir, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 40% at 50% 38%, ${COULEURS.rougeSombre} 0%, transparent 70%)`,
          opacity: 0.25 + 0.75 * apparition,
        }}
      />
      <RouteNeon opacite={0.6 * apparition} vitesse={vitesseTrainees} />
      <Trainees nombre={18} vitesse={vitesseTrainees} opacite={0.55} graine="intro" />

      <AbsoluteFill style={{transform: `translate(${choc.x}px, ${choc.y}px)`}}>
        {/* Ligne néon qui traverse l'écran avant l'allumage */}
        <div
          style={{
            position: 'absolute',
            top: 760,
            left: (width * (1 - ligne)) / 2,
            width: width * ligne,
            height: 4,
            background: COULEURS.rougeNeon,
            boxShadow: `0 0 30px ${COULEURS.rouge}, 0 0 80px ${COULEURS.rouge}`,
            opacity: interpolate(frame, [aMarque, aMarque + 12], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        />

        <AbsoluteFill
          style={{
            alignItems: 'center',
            paddingTop: ZONE_SURE.haut + 90,
            transform: `translateY(${yMarque}px) scale(${echelleMarque})`,
          }}
        >
          <div
            style={{
              opacity: clignote,
              transform: `scale(${interpolate(apparition, [0, 1], [0.55, 1]) * pulsation})`,
              filter: `drop-shadow(0 0 ${30 * clignote}px ${COULEURS.rouge})`,
            }}
          >
            <Embleme largeur={600} />
          </div>
          <div style={{textAlign: 'center', marginTop: 40, position: 'relative', overflow: 'hidden', padding: '0 20px'}}>
            <MotAnime texte={MARQUE.nomLigne1} a={aMarque + 8} entree="lettres" taille={96} />
            <br />
            <MotAnime
              texte={MARQUE.nomLigne2}
              a={aMarque + 26}
              entree="glisse"
              taille={136}
              couleur={COULEURS.rougeNeon}
              neon
            />
          </div>
        </AbsoluteFill>

        {/* Slogan mot par mot */}
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: ZONE_SURE.bas + 40,
            gap: 6,
          }}
        >
          {MARQUE.slogan.map((mot, i) => (
            <div key={mot} style={{height: 150, display: 'flex', alignItems: 'center'}}>
              <MotAnime
                texte={mot}
                a={mots[i]}
                entree="choc"
                taille={136}
                couleur={i === 1 ? COULEURS.rougeNeon : COULEURS.blanc}
                neon={i === 1}
              />
            </div>
          ))}
        </AbsoluteFill>
      </AbsoluteFill>

      {mots.map((a, i) => (
        <Flash key={i} a={a} duree={6} couleur={i === 1 ? COULEURS.rouge : '#fff'} force={0.35} />
      ))}
      <Flash a={aMarque} duree={10} couleur={COULEURS.rouge} force={0.5} />

      <Son nom="whooshCourt" a={0} volume={0.7} />
      <Son nom="neon" a={aMarque - 2} />
      <Son nom="impact" a={aMarque} volume={0.6} />
      <Son nom="scintillement" a={aMarque + 24} />
      {mots.map((a, i) => (
        <Son key={i} nom="impact" a={a - 1} volume={0.65 + i * 0.12} />
      ))}
      <Finition />
    </AbsoluteFill>
  );
};
