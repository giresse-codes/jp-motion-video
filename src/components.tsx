import React, {useId} from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SANS, SERIF, SHADOW_CARD} from './theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const useSpring = (at: number, config: Partial<{damping: number; stiffness: number; mass: number}> = {}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - at, fps, config: {damping: 15, stiffness: 120, mass: 0.8, ...config}});
};

/** Filtre SVG de flou directionnel (x, y) — le flou de mouvement de la référence. */
export const DirBlur: React.FC<{
  x?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x = 0, y = 0, children, style}) => {
  const id = 'mb' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const active = x > 0.25 || y > 0.25;
  return (
    <div style={{...style, filter: active ? `url(#${id})` : undefined}}>
      {active && (
        <svg width={0} height={0} style={{position: 'absolute'}}>
          <filter id={id} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={`${x.toFixed(2)} ${y.toFixed(2)}`} />
          </filter>
        </svg>
      )}
      {children}
    </div>
  );
};

/** Un mot qui arrive avec un fort flou de mouvement horizontal (40 px qui se résorbe) ou en rotation légère. */
export const Word: React.FC<{
  at: number;
  children: React.ReactNode;
  serif?: boolean;
  mode?: 'blur' | 'rotate';
  color?: string;
  size?: number;
  dur?: number;
  style?: React.CSSProperties;
}> = ({at, children, serif, mode = 'blur', color = C.black, size, dur = 11, style}) => {
  const frame = useCurrentFrame();
  const f = frame - at;
  const p = interpolate(f, [0, dur], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const op = interpolate(f, [0, 3], [0, 1], clamp);
  const font: React.CSSProperties = serif
    ? {fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: size ? size * 1.1 : '1.1em', letterSpacing: '-0.01em'}
    : {fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: '-0.035em'};
  if (mode === 'rotate') {
    const r = interpolate(p, [0, 1], [14, 0]);
    return (
      <DirBlur
        y={18 * (1 - p)}
        style={{
          display: 'inline-block',
          opacity: op,
          transform: `translateY(${(1 - p) * 40}px) rotate(${r}deg)`,
          transformOrigin: 'left bottom',
          color,
          ...font,
          ...style,
        }}
      >
        {children}
      </DirBlur>
    );
  }
  return (
    <DirBlur
      x={40 * (1 - p)}
      style={{display: 'inline-block', opacity: op, transform: `translateX(${(1 - p) * 70}px)`, color, ...font, ...style}}
    >
      {children}
    </DirBlur>
  );
};

/** Ligne de mots : [texte, frame, serif?] */
export type WordSpec = [string, number, boolean?];
export const Line: React.FC<{
  words: WordSpec[];
  size?: number;
  color?: string;
  mode?: 'blur' | 'rotate';
  align?: 'left' | 'center';
  style?: React.CSSProperties;
}> = ({words, size = 76, color = C.black, mode = 'blur', align = 'center', style}) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: align === 'center' ? 'center' : 'flex-start',
      alignItems: 'baseline',
      columnGap: size * 0.24,
      fontSize: size,
      lineHeight: 1.12,
      ...style,
    }}
  >
    {words.map(([t, at, serif], i) => (
      <Word key={i} at={at} serif={serif} color={color} mode={mode}>
        {t}
      </Word>
    ))}
  </div>
);

/** Mot clé qui claque en blanc sur un bandeau noir. */
export const Banner: React.FC<{at: number; children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({
  at,
  children,
  size = 96,
  style,
}) => {
  const frame = useCurrentFrame();
  const s = useSpring(at, {damping: 11, stiffness: 260, mass: 0.6});
  const f = frame - at;
  const blur = interpolate(f, [0, 6], [24, 0], clamp);
  return (
    <DirBlur
      x={blur}
      style={{
        display: 'inline-block',
        opacity: interpolate(f, [0, 2], [0, 1], clamp),
        transform: `scale(${interpolate(s, [0, 1], [1.6, 1])}) rotate(${interpolate(s, [0, 1], [-6, -1.5])}deg)`,
        ...style,
      }}
    >
      <div
        style={{
          background: C.black,
          color: C.white,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: size,
          letterSpacing: '-0.04em',
          padding: `${size * 0.04}px ${size * 0.2}px ${size * 0.1}px`,
          borderRadius: size * 0.12,
          boxShadow: '0 30px 60px rgba(14,14,16,0.18)',
          lineHeight: 1.05,
        }}
      >
        {children}
      </div>
    </DirBlur>
  );
};

/** Carte blanche arrondie flottante */
export const Card: React.FC<{style?: React.CSSProperties; children?: React.ReactNode; radius?: number}> = ({
  style,
  children,
  radius = 44,
}) => (
  <div style={{background: C.white, borderRadius: radius, boxShadow: SHADOW_CARD, ...style}}>{children}</div>
);

/** Enveloppe de scène : entrée/sortie par flou directionnel. */
export const SceneWrap: React.FC<{
  dur: number;
  children: React.ReactNode;
  inDir?: 'x' | 'y' | 'none';
  outDir?: 'x' | 'y' | 'none';
  inLen?: number;
  outLen?: number;
}> = ({dur, children, inDir = 'y', outDir = 'y', inLen = 9, outLen = 7}) => {
  const frame = useCurrentFrame();
  const pin = inDir === 'none' ? 1 : interpolate(frame, [0, inLen], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const pout = outDir === 'none' ? 0 : interpolate(frame, [dur - outLen, dur], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const bx = (inDir === 'x' ? (1 - pin) * 50 : 0) + (outDir === 'x' ? pout * 60 : 0);
  const by = (inDir === 'y' ? (1 - pin) * 50 : 0) + (outDir === 'y' ? pout * 60 : 0);
  const tx = (inDir === 'x' ? (1 - pin) * 160 : 0) + (outDir === 'x' ? -pout * 220 : 0);
  const ty = (inDir === 'y' ? (1 - pin) * 180 : 0) + (outDir === 'y' ? -pout * 240 : 0);
  return (
    <AbsoluteFill style={{opacity: Math.min(interpolate(pin, [0, 0.3], [0.25, 1], clamp), 1 - pout * 0.9)}}>
      <DirBlur x={bx} y={by} style={{position: 'absolute', inset: 0, transform: `translate(${tx}px, ${ty}px)`}}>
        {children}
      </DirBlur>
    </AbsoluteFill>
  );
};

/** Ombre de contact douce, au sol */
export const FloorShadow: React.FC<{w: number; style?: React.CSSProperties; opacity?: number}> = ({w, style, opacity = 0.22}) => (
  <div
    style={{
      position: 'absolute',
      width: w,
      height: w * 0.12,
      borderRadius: '50%',
      background: `rgba(14,14,16,${opacity})`,
      filter: `blur(${w * 0.09}px)`,
      ...style,
    }}
  />
);
