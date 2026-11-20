import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp, SceneWrap} from './components';
import {HookText, Intro} from './scenes/Intro';
import {CardScene, LogoScene, PhotoScene, WhatsAppScene} from './scenes/Middle';
import {AmenitiesScene, CTAScene, DestinationsScene, PricesScene, StampsScene} from './scenes/End';
import {C, SANS, SAFE_BOTTOM} from './theme';
import {SENTENCES, wf} from './words';

/** Studio gris perle : dégradé + grands cercles flous très légers (6 %) */
const Background: React.FC = () => {
  const f = useCurrentFrame();
  const circles = [
    {x: 120, y: 380, r: 640, c: C.black},
    {x: 960, y: 760, r: 720, c: C.white},
    {x: 300, y: 1320, r: 760, c: C.black},
    {x: 900, y: 1700, r: 620, c: C.white},
    {x: 560, y: 960, r: 900, c: C.white},
  ];
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.bgTop} 0%, ${C.bgBottom} 100%)`, overflow: 'hidden'}}>
      {circles.map((k, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: k.x - k.r / 2 + Math.sin(f / 90 + i * 1.7) * 40,
            top: k.y - k.r / 2 + Math.cos(f / 110 + i) * 40,
            width: k.r,
            height: k.r,
            borderRadius: '50%',
            background: k.c,
            opacity: 0.06,
            filter: 'blur(70px)',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/** Sous-titres mot à mot générés depuis les horodatages de la voix. */
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const idx = SENTENCES.findIndex((s, i) => {
    const start = s[0][1] - 0.1;
    const next = SENTENCES[i + 1];
    const end = Math.min(s[s.length - 1][2] + 0.5, next ? next[0][1] - 0.12 : 99);
    return t >= start && t < end;
  });
  if (idx < 0 || frame < 8 || frame >= 1340) return null;
  const s = SENTENCES[idx];
  const onPhoto = frame >= 375 && frame < 474;
  const end = s[s.length - 1][2];
  const fadeOut = interpolate(t, [end + 0.3, end + 0.5], [1, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: SAFE_BOTTOM + 22,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: 11,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 36,
        letterSpacing: '-0.01em',
        opacity: fadeOut,
      }}
    >
      {s.map(([w, st], i) => {
        const p = interpolate(t, [st - 0.02, st + 0.12], [0, 1], clamp);
        const speaking = t >= st && (i === s.length - 1 ? t < end + 0.1 : t < s[i + 1][1]);
        return (
          <span
            key={i}
            style={{
              opacity: p,
              transform: `translateY(${(1 - p) * 10}px)`,
              display: 'inline-block',
              color: onPhoto ? C.white : speaking ? C.black : C.gray,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// Découpage (frames), calé sur la voix
export const T = {
  intro: [0, 96],
  logo: [96, 132],
  card: [132, 198],
  whatsapp: [194, 375],
  photo: [375, 474],
  amenities: [474, 603],
  stamps: [603, 696],
  prices: [692, 843],
  destinations: [843, 969],
  cta: [969, 1210],
  outro: [1204, 1343],
  loop: [1343, 1350],
};

const WHOOSH = [62, 92, 128, 196, 296, 371, 470, 599, 696, 710, 725, 839, 965, 1200, 1338];
const TIC = [242, 272, 618, 630, 642, 654, 667];
const POP = [96, 482, 503, 535, 572, 674, 1204];

const Seq: React.FC<{r: number[]; children: React.ReactNode; name: string}> = ({r, children, name}) => (
  <Sequence from={r[0]} durationInFrames={r[1] - r[0]} name={name}>
    {children}
  </Sequence>
);

export const JPAd: React.FC = () => {
  const d = (k: keyof typeof T) => T[k][1] - T[k][0];
  return (
    <AbsoluteFill style={{background: C.bgBottom}}>
      <Background />

      {/* 1-2 : hook + iPhone (temps local décalé de 6 frames pour la boucle) */}
      <Sequence from={-6} durationInFrames={T.intro[1] + 6} name="Intro">
        <SceneWrap dur={T.intro[1] + 6} inDir="none" outDir="x">
          <Intro />
        </SceneWrap>
      </Sequence>
      <Seq r={T.logo} name="Logo">
        <SceneWrap dur={d('logo')} inDir="none" outDir="y">
          <LogoScene />
        </SceneWrap>
      </Seq>
      <Seq r={T.card} name="Carte">
        <SceneWrap dur={d('card')} inDir="y" outDir="x">
          <CardScene />
        </SceneWrap>
      </Seq>
      <Seq r={T.whatsapp} name="WhatsApp">
        <SceneWrap dur={d('whatsapp')} inDir="x" outDir="x">
          <WhatsAppScene />
        </SceneWrap>
      </Seq>
      <Seq r={T.photo} name="Photo">
        <SceneWrap dur={d('photo')} inDir="x" outDir="x" inLen={7}>
          <PhotoScene dur={d('photo')} />
        </SceneWrap>
      </Seq>
      <Seq r={T.amenities} name="Confort">
        <SceneWrap dur={d('amenities')} inDir="x" outDir="y">
          <AmenitiesScene />
        </SceneWrap>
      </Seq>
      <Seq r={T.stamps} name="Tampons">
        <SceneWrap dur={d('stamps')} inDir="y" outDir="x">
          <StampsScene />
        </SceneWrap>
      </Seq>
      <Seq r={T.prices} name="Prix">
        <SceneWrap dur={d('prices')} inDir="x" outDir="y">
          <PricesScene />
        </SceneWrap>
      </Seq>
      <Seq r={T.destinations} name="Destinations">
        <SceneWrap dur={d('destinations')} inDir="y" outDir="none">
          <DestinationsScene dur={d('destinations')} />
        </SceneWrap>
      </Seq>
      <Seq r={T.cta} name="CTA">
        <SceneWrap dur={d('cta')} inDir="y" outDir="y">
          <CTAScene />
        </SceneWrap>
      </Seq>
      <Seq r={T.outro} name="Outro">
        <SceneWrap dur={d('outro')} inDir="none" outDir="y" outLen={6}>
          <LogoScene
            tagline={[
              {at: wf(14, 0) - T.outro[0], text: 'Rapide.'},
              {at: wf(14, 1) - T.outro[0], text: 'Sûr.'},
              {at: wf(14, 2) - T.outro[0], text: 'Confortable.'},
            ]}
          />
        </SceneWrap>
      </Seq>
      {/* boucle : la dernière frame reproduit la frame 0 */}
      <Sequence from={T.loop[0]} durationInFrames={T.loop[1] - T.loop[0]} name="Boucle">
        <HookText />
      </Sequence>

      <Captions />

      {/* SON */}
      <Audio src={staticFile('voix-off.mp3')} />
      <Audio src={staticFile('musique.mp3')} volume={0.2} />
      {WHOOSH.map((f) => (
        <Sequence key={'w' + f} from={f} durationInFrames={24}>
          <Audio src={staticFile('sfx/whoosh.wav')} volume={0.35} />
        </Sequence>
      ))}
      {TIC.map((f) => (
        <Sequence key={'t' + f} from={f} durationInFrames={6}>
          <Audio src={staticFile('sfx/tic.wav')} volume={0.45} />
        </Sequence>
      ))}
      {POP.map((f) => (
        <Sequence key={'p' + f} from={f} durationInFrames={9}>
          <Audio src={staticFile('sfx/pop.wav')} volume={0.25} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
