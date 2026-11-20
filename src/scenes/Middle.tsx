import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Banner, Card, clamp, DirBlur, FloorShadow, Line, Word, useSpring} from '../components';
import {Phone} from '../Phone';
import {C, SANS, SERIF} from '../theme';

/** Scène 3 : logo JP avec apparition à ressort */
export const LogoScene: React.FC<{tagline?: {at: number; text: string}[]}> = ({tagline}) => {
  const t = useCurrentFrame();
  const s = useSpring(0, {damping: 9, stiffness: 160, mass: 0.7});
  const ring = useSpring(2, {damping: 22, stiffness: 50});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          position: 'absolute',
          width: 760,
          height: 760,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.5)',
          clipPath: `circle(${ring * 50}% at 50% 50%)`,
          transform: `translateY(${tagline ? -60 : 0}px)`,
          boxShadow: '0 60px 120px rgba(14,14,16,0.06)',
        }}
      />
      <DirBlur
        x={interpolate(t, [0, 7], [30, 0], clamp)}
        style={{
          transform: `translateY(${tagline ? -60 : 0}px) scale(${interpolate(s, [0, 1], [0.45, 1]) * (1 + t * 0.0012)}) rotate(${interpolate(s, [0, 1], [-8, 0])}deg)`,
          opacity: interpolate(t, [0, 3], [0, 1], clamp),
        }}
      >
        <Img src={staticFile('logo.png')} style={{width: 760}} />
      </DirBlur>
      {tagline && (
        <div
          style={{
            position: 'absolute',
            top: 1340,
            left: 120,
            right: 120,
            display: 'flex',
            justifyContent: 'center',
            columnGap: 22,
          }}
        >
          {tagline.map((w, i) => (
            <Word key={i} at={w.at} color={C.gray} size={60} mode="rotate" style={{fontWeight: 600, letterSpacing: '-0.02em'}}>
              {w.text}
            </Word>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Scène 4 : carte blanche flottante « Votre chauffeur privé, à Douala » */
export const CardScene: React.FC = () => {
  const t = useCurrentFrame();
  const s = useSpring(0, {damping: 14, stiffness: 110});
  const bob = Math.sin(t / 14) * 8;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1800}}>
      <FloorShadow w={700} opacity={0.12} style={{top: 1290, left: 190}} />
      <div
        style={{
          transform: `translateY(${interpolate(s, [0, 1], [260, -40]) + bob}px) rotateX(${interpolate(s, [0, 1], [38, 6]) + Math.sin(t / 20) * 2}deg) rotateZ(${interpolate(s, [0, 1], [-6, -1.2])}deg)`,
        }}
      >
        <Card style={{width: 840, padding: '64px 70px 72px', boxSizing: 'border-box'}}>
          <Word at={0} color={C.gray} size={34} style={{fontWeight: 600, letterSpacing: '-0.01em'}}>
            Chauffeur premium
          </Word>
          <div style={{marginTop: 18}}>
            <Line
              align="left"
              size={96}
              words={[
                ['Votre', 1],
                ['chauffeur', 10],
                ['privé,', 20, true],
              ]}
            />
            <Line align="left" size={96} words={[['à', 42], ['Douala', 46]]} />
          </div>
          <div style={{display: 'flex', gap: 14, marginTop: 34}}>
            {['24 h/24', 'Ponctuel', 'Discret'].map((x, i) => (
              <div
                key={x}
                style={{
                  opacity: interpolate(t, [50 + i * 4, 56 + i * 4], [0, 1], clamp),
                  transform: `translateY(${interpolate(t, [50 + i * 4, 58 + i * 4], [20, 0], clamp)}px)`,
                  border: `2px solid ${C.black}`,
                  borderRadius: 40,
                  padding: '10px 26px',
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: 30,
                  color: C.black,
                }}
              >
                {x}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

/** Écran de conversation WhatsApp (monochrome) */
const Chat: React.FC<{w: number}> = ({w}) => {
  const t = useCurrentFrame();
  const b1 = useSpring(36, {damping: 13, stiffness: 160});
  const b2 = useSpring(72, {damping: 12, stiffness: 170});
  const b3 = useSpring(126, {damping: 13, stiffness: 160});
  const typing = t > 50 && t < 72;
  const fs = w * 0.047;
  const bubble = (mine: boolean): React.CSSProperties => ({
    alignSelf: mine ? 'flex-end' : 'flex-start',
    background: mine ? C.black : C.white,
    color: mine ? C.white : C.black,
    borderRadius: w * 0.05,
    borderBottomRightRadius: mine ? 6 : w * 0.05,
    borderBottomLeftRadius: mine ? w * 0.05 : 6,
    padding: `${w * 0.028}px ${w * 0.04}px`,
    fontSize: fs,
    fontWeight: 600,
    maxWidth: '78%',
    boxShadow: '0 6px 16px rgba(14,14,16,0.08)',
  });
  return (
    <div style={{position: 'absolute', inset: 0, background: '#EEF0F2', fontFamily: SANS}}>
      <div
        style={{
          paddingTop: w * 0.14,
          paddingBottom: w * 0.03,
          paddingLeft: w * 0.05,
          background: C.white,
          display: 'flex',
          alignItems: 'center',
          gap: w * 0.03,
          borderBottom: '1px solid #D9DBDE',
        }}
      >
        <div
          style={{
            width: w * 0.11,
            height: w * 0.11,
            borderRadius: '50%',
            background: C.black,
            color: C.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: w * 0.04,
          }}
        >
          JP
        </div>
        <div>
          <div style={{fontWeight: 700, fontSize: w * 0.048, color: C.black}}>JP Service</div>
          <div style={{fontWeight: 500, fontSize: w * 0.034, color: C.gray}}>{typing ? 'écrit…' : 'en ligne'}</div>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: w * 0.03, padding: w * 0.05}}>
        <div style={{alignSelf: 'center', fontSize: w * 0.032, color: C.gray, fontWeight: 600}}>Aujourd’hui</div>
        <div style={{...bubble(true), opacity: b1, transform: `translateY(${(1 - b1) * 40}px) scale(${0.8 + 0.2 * b1})`, transformOrigin: 'right bottom'}}>
          Un chauffeur demain 9 h ?
        </div>
        {typing && (
          <div style={{...bubble(false), display: 'flex', gap: 8, padding: `${w * 0.035}px ${w * 0.045}px`}}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{width: 12, height: 12, borderRadius: 6, background: C.gray, opacity: 0.4 + 0.6 * Math.abs(Math.sin((t + i * 4) / 5))}} />
            ))}
          </div>
        )}
        {t >= 72 && (
          <div style={{...bubble(false), opacity: b2, transform: `translateY(${(1 - b2) * 40}px) scale(${0.8 + 0.2 * b2})`, transformOrigin: 'left bottom'}}>
            ✓ Confirmé
            <div style={{fontSize: w * 0.034, color: C.gray, fontWeight: 500, marginTop: 4}}>Demain · 9 h 00</div>
          </div>
        )}
        {t >= 126 && (
          <div style={{...bubble(true), opacity: b3, transform: `translateY(${(1 - b3) * 40}px) scale(${0.8 + 0.2 * b3})`, transformOrigin: 'right bottom'}}>
            Parfait, merci !
          </div>
        )}
      </div>
    </div>
  );
};

/** Scène 5 : Réservez en un seul message / Sans application à télécharger, ni compte à créer + conversation */
export const WhatsAppScene: React.FC = () => {
  const t = useCurrentFrame();
  const W = 400;
  const H = W * 2.04;
  const ph = useSpring(2, {damping: 15, stiffness: 80});
  const outA = interpolate(t, [94, 102], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  return (
    <AbsoluteFill>
      {/* Titre A */}
      {t < 104 && (
        <DirBlur
          y={outA * 40}
          style={{position: 'absolute', top: 170, left: 120, right: 120, opacity: 1 - outA, transform: `translateY(${-outA * 120}px)`}}
        >
          <Line
            size={80}
            words={[
              ['Réservez', 0],
              ['en', 14],
              ['un', 20],
              ['seul', 28],
              ['message', 32, true],
            ]}
          />
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 14}}>
            <Word at={60} size={64}>
              sur
            </Word>
            <Banner at={66} size={78}>
              WhatsApp
            </Banner>
          </div>
        </DirBlur>
      )}
      {/* Titre B */}
      {t >= 100 && (
        <div style={{position: 'absolute', top: 190, left: 120, right: 120}}>
          <Line size={70} words={[['Sans', 102], ['application', 108], ['à', 120], ['télécharger', 124]]} />
          <Line size={70} style={{marginTop: 6}} words={[['ni', 152], ['compte', 157], ['à', 163], ['créer.', 166, true]]} />
        </div>
      )}
      <FloorShadow w={380} opacity={0.2 * ph} style={{left: 540 - 190, top: 1570}} />
      <AbsoluteFill style={{perspective: 2000}}>
        <div style={{position: 'absolute', left: 540 - W / 2, top: 600, width: W, height: H, perspective: 2000}}>
          <Phone
            w={W}
            transform={`translateY(${interpolate(ph, [0, 1], [900, 0]) + Math.sin(t / 16) * 6}px) rotateX(${interpolate(ph, [0, 1], [40, 8])}deg) rotateY(${interpolate(ph, [0, 1], [-30, 0]) + Math.sin(t / 30) * 7}deg) rotateZ(${interpolate(ph, [0, 1], [12, 0])}deg)`}
          >
            <Chat w={W} />
          </Phone>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Scène 6 : rupture — vraie photo plein écran légèrement désaturée */
export const PhotoScene: React.FC<{dur: number}> = ({dur}) => {
  const t = useCurrentFrame();
  const z = interpolate(t, [0, dur], [1.14, 1.02]);
  return (
    <AbsoluteFill style={{background: C.black}}>
      <Img
        src={staticFile('voiture-photo.jpg')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${z}) translateX(${interpolate(t, [0, dur], [-14, 14])}px)`,
          filter: 'saturate(0.55) contrast(1.04)',
        }}
      />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(14,14,16,0.35) 0%, rgba(14,14,16,0) 30%)'}} />
      <div style={{position: 'absolute', top: 150, left: 120}}>
        <Word at={6} color={C.white} size={44} style={{fontWeight: 600, letterSpacing: '-0.01em'}}>
          Samedi · 9 h 00
        </Word>
      </div>
      <div style={{position: 'absolute', top: 214, left: 120, fontFamily: SERIF}}>
        <Word at={40} color={C.white} size={44} serif>
          à l’heure.
        </Word>
      </div>
    </AbsoluteFill>
  );
};
