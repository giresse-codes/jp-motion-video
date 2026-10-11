import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CONTACT, COULEURS, MARQUE, PLANS, POLICES} from '../config';
import {Finition, Flash, RouteNeon, Trainees} from '../components/Effets';
import {MotAnime} from '../components/KineticText';
import {LogoComplet} from '../components/Logo';
import {Media} from '../components/Media';
import {WhatsAppIcon} from '../components/WhatsAppIcon';
import {reperesDe} from '../lib/scene';

const r = reperesDe('appel');

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Scène 5 : appel à l'action. Icône WhatsApp, numéro très lisible
// (affiché groupe par groupe sur la voix, puis fixe jusqu'à la fin), logo final.
export const AppelAction: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const aReservez = r('reservez');
  const aGroupes = [r('numero'), r('numero2'), r('numero3')];
  const aLogo = r('logoFinal');
  const aSignature = r('signature');

  const entreeIcone = spring({frame: frame - (aReservez - 6), fps, config: {damping: 11, stiffness: 140}});
  const pulsation = 1 + Math.max(0, Math.sin((frame - aReservez) / 6)) * 0.05;
  // Passage au logo final : l'icône et l'accroche s'effacent vers le haut.
  const versLogo = spring({frame: frame - (aLogo - 8), fps, config: {damping: 18, stiffness: 110}});
  const entreeLogo = spring({frame: frame - aLogo, fps, config: {damping: 14, stiffness: 120}});
  const entreeNumero = spring({frame: frame - (aGroupes[0] - 8), fps, config: {damping: 15, stiffness: 150}});

  return (
    <AbsoluteFill style={{backgroundColor: COULEURS.noir, overflow: 'hidden'}}>
      {/* Fond : ville floutée et teintée rouge */}
      <AbsoluteFill style={{opacity: 0.45, filter: 'blur(10px) saturate(0.4) brightness(0.55)'}}>
        <Media plan={PLANS.nuit} amplitude={0.1} derive={0} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(90% 55% at 50% 40%, ${COULEURS.rouge}55 0%, ${COULEURS.noir}cc 70%)`,
        }}
      />
      <RouteNeon opacite={0.5} vitesse={1.2} horizon={1380} />
      <Trainees nombre={16} vitesse={1.2} opacite={0.5} graine="appel" />

      {/* Icône WhatsApp + « Réservez sur WhatsApp » */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          paddingTop: 360,
          opacity: 1 - versLogo,
          transform: `translateY(${-versLogo * 160}px) scale(${1 - versLogo * 0.2})`,
        }}
      >
        <div style={{position: 'relative', transform: `scale(${entreeIcone * pulsation})`}}>
          {[0, 1, 2].map((k) => {
            const f = (frame - aReservez + k * 14) % 42;
            return (
              <div
                key={k}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: `6px solid ${COULEURS.whatsapp}`,
                  transform: `scale(${1 + f / 30})`,
                  opacity: frame < aReservez ? 0 : interpolate(f, [0, 42], [0.7, 0]),
                }}
              />
            );
          })}
          <div style={{filter: `drop-shadow(0 0 40px ${COULEURS.whatsapp}88)`}}>
            <WhatsAppIcon taille={250} />
          </div>
        </div>
        <div style={{marginTop: 50, textAlign: 'center'}}>
          <MotAnime texte={CONTACT.libelle1} a={aReservez} entree="choc" taille={112} />
          <br />
          <MotAnime texte={CONTACT.libelle2} a={aReservez + 26} entree="glisse" taille={84} poids={800} couleur={COULEURS.whatsapp} />
        </div>
      </AbsoluteFill>

      {/* Logo final + signature */}
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 430}}>
        <div
          style={{
            opacity: entreeLogo,
            transform: `scale(${interpolate(entreeLogo, [0, 1], [1.4, 1])})`,
            filter: `blur(${(1 - entreeLogo) * 12}px)`,
          }}
        >
          <LogoComplet largeur={980} />
        </div>
        <div style={{marginTop: 40, display: 'flex', gap: 22}}>
          {MARQUE.signature.split(', ').map((morceau, i, tous) => (
            <MotAnime
              key={morceau}
              texte={i < tous.length - 1 ? `${morceau},` : morceau}
              a={aSignature + i * 30}
              entree="monte"
              taille={58}
              poids={800}
              couleur={i === tous.length - 1 ? COULEURS.rougeNeon : COULEURS.blanc}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* Numéro : grand, contrasté, fixe jusqu'à la fin */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          top: 1090,
          opacity: entreeNumero,
          transform: `translateY(${(1 - entreeNumero) * 120}px)`,
        }}
      >
        <div
          style={{
            borderRadius: 40,
            padding: '30px 30px 38px',
            background: COULEURS.blanc,
            boxShadow: `0 0 0 6px ${COULEURS.rouge}, 0 0 70px ${COULEURS.rouge}aa, 0 30px 60px rgba(0,0,0,0.5)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <WhatsAppIcon taille={64} />
            <span style={{fontFamily: POLICES.titre, fontWeight: 800, fontSize: 52, color: COULEURS.noir}}>
              {CONTACT.indicatif}
            </span>
          </div>
          <div style={{display: 'flex', gap: 24, marginTop: 4}}>
            {CONTACT.numero.map((groupe, i) => {
              const p = spring({frame: frame - aGroupes[i], fps, config: {damping: 10, stiffness: 220}});
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: POLICES.titre,
                    fontWeight: 900,
                    fontSize: 122,
                    lineHeight: 1.05,
                    color: COULEURS.rouge,
                    letterSpacing: 2,
                    fontVariantNumeric: 'tabular-nums',
                    opacity: interpolate(frame - aGroupes[i], [0, 3], [0, 1], clamp),
                    transform: `scale(${interpolate(p, [0, 1], [1.8, 1])})`,
                    display: 'inline-block',
                  }}
                >
                  {groupe}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <Flash a={aGroupes[0]} duree={6} force={0.25} />
      <Flash a={aLogo} duree={12} couleur={COULEURS.rouge} force={0.55} />
      <Finition />
    </AbsoluteFill>
  );
};
