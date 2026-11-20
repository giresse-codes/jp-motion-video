import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {clamp, DirBlur, FloorShadow, Word, useSpring} from '../components';
import {LockScreen, Notification, Phone} from '../Phone';
import {C} from '../theme';

/**
 * Le texte du hook. Le temps local t = frame + 6 (la vidéo démarre au milieu de l'entrée
 * de « Offrez-vous », ce qui permet de reproduire exactement la frame 0 à la fin pour la boucle).
 * Mots calés sur la voix : Offrez-vous 0.0 s, une 0.52, raison 0.64, de 1.04, ne 1.2, plus 1.3, conduire 1.56.
 */
export const HookText: React.FC<{exitAt?: number}> = ({exitAt = 9999}) => {
  const t = useCurrentFrame();
  const o = 6; // décalage
  const out = interpolate(t, [exitAt, exitAt + 9], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const hl = interpolate(t, [62, 74], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <DirBlur
        y={out * 40}
        style={{
          position: 'absolute',
          top: 470,
          left: 120,
          right: 120,
          opacity: 1 - out,
          transform: `translateY(${-out * 160}px)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            columnGap: 20,
            fontSize: 80,
            maxWidth: 700,
            margin: '0 auto',
            lineHeight: 1.1,
          }}
        >
          <Word at={0 + o - 6}>Offrez-vous</Word>
          <Word at={16 + o}>une</Word>
          <Word at={19 + o}>raison</Word>
          <Word at={31 + o}>de</Word>
        </div>
        <div style={{marginTop: 18, display: 'flex', justifyContent: 'center'}}>
          <div style={{position: 'relative', display: 'inline-flex', columnGap: 22, fontSize: 92, padding: '0 10px'}}>
            {/* sélection de texte gris clair */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 14,
                bottom: 2,
                width: `${hl * 100}%`,
                background: 'rgba(139,143,150,0.30)',
                borderRadius: 4,
              }}
            />
            {hl > 0 && (
              <>
                <div style={{position: 'absolute', left: -2, top: 6, bottom: -4, width: 4, background: C.black, opacity: Math.min(1, hl * 3)}}>
                  <div style={{position: 'absolute', top: -10, left: -6, width: 16, height: 16, borderRadius: 8, background: C.black}} />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: `calc(${hl * 100}% - 2px)`,
                    top: 6,
                    bottom: -4,
                    width: 4,
                    background: C.black,
                    opacity: Math.min(1, hl * 3),
                  }}
                >
                  <div style={{position: 'absolute', bottom: -10, left: -6, width: 16, height: 16, borderRadius: 8, background: C.black}} />
                </div>
              </>
            )}
            <Word at={36 + o} serif>
              ne
            </Word>
            <Word at={39 + o} serif>
              plus
            </Word>
            <Word at={47 + o} serif>
              conduire
            </Word>
          </div>
        </div>
      </DirBlur>
    </AbsoluteFill>
  );
};

/** Scènes 1 + 2 : hook, chute de l'iPhone, redressement, cercle, notification. Temps local t = frame + 6. */
export const Intro: React.FC = () => {
  const t = useCurrentFrame();
  const W = 440;
  const H = W * 2.04;
  const drop = useSpring(40, {damping: 14, stiffness: 70, mass: 1});
  const up = useSpring(68, {damping: 16, stiffness: 90, mass: 0.9});
  const circle = useSpring(72, {damping: 20, stiffness: 60});
  const circle2 = useSpring(76, {damping: 20, stiffness: 60});
  const notif = useSpring(82, {damping: 14, stiffness: 140});

  // chute en tournant, puis redressement au centre
  const y0 = interpolate(drop, [0, 1], [-1700, 380]);
  const y = interpolate(up, [0, 1], [y0, 40]);
  const rz = interpolate(up, [0, 1], [interpolate(drop, [0, 1], [70, -13]), 0]);
  const ry = interpolate(up, [0, 1], [interpolate(drop, [0, 1], [-80, 30]), 0]) + Math.sin(t / 18) * 3 * up;
  const rx = interpolate(up, [0, 1], [interpolate(drop, [0, 1], [40, 14]), 0]);
  const sc = interpolate(up, [0, 1], [0.78, 1.0]);
  const vel = Math.abs(interpolate(t, [40, 52], [1, 0], clamp)) * (t >= 40 ? 1 : 0);

  return (
    <AbsoluteFill>
      {/* grand cercle gris qui s'ouvre derrière (masque circulaire) */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            position: 'absolute',
            width: 1300,
            height: 1300,
            borderRadius: '50%',
            background: 'rgba(139,143,150,0.42)',
            clipPath: `circle(${circle * 50}% at 50% 50%)`,
            transform: `translateY(40px) scale(${1 + Math.sin(t / 25) * 0.01})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 900,
            height: 900,
            borderRadius: '50%',
            background: 'rgba(14,14,16,0.62)',
            clipPath: `circle(${circle2 * 50}% at 50% 50%)`,
            transform: 'translateY(40px)',
          }}
        />
      </AbsoluteFill>

      <HookText exitAt={70} />

      {/* ombre de contact */}
      <FloorShadow
        w={420}
        opacity={0.18 * drop}
        style={{left: 540 - 210, top: 960 + y + H / 2 * sc - 10, transform: `scaleX(${1 - 0.25 * (1 - up)})`}}
      />
      <AbsoluteFill style={{perspective: 2200, alignItems: 'center', justifyContent: 'center'}}>
        <DirBlur y={vel * 26} style={{position: 'absolute', width: W, height: H, perspective: 2200, transform: `translateY(${y}px)`}}>
          <Phone w={W} transform={`scale(${sc}) rotateZ(${rz}deg) rotateY(${ry}deg) rotateX(${rx}deg)`}>
            <LockScreen w={W}>
              <DirBlur
                y={(1 - notif) * 20}
                style={{opacity: interpolate(notif, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - notif) * -60}px) scale(${0.9 + 0.1 * notif})`}}
              >
                <Notification w={W} title="JP Service" body="Votre chauffeur est en route" />
              </DirBlur>
            </LockScreen>
          </Phone>
        </DirBlur>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
