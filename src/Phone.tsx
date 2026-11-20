import React from 'react';
import {C, SANS} from './theme';

/**
 * iPhone noir en 3D (CSS 3D) : plusieurs couches empilées en Z donnent l'épaisseur
 * visible quand le téléphone tourne. Le parent applique rotateX/Y/Z.
 */
export const Phone: React.FC<{
  w?: number;
  children?: React.ReactNode;
  transform?: string;
  style?: React.CSSProperties;
  depth?: number;
}> = ({w = 440, children, transform = '', style, depth = 22}) => {
  const h = w * 2.04;
  const r = w * 0.165;
  const layers = 9;
  return (
    <div style={{position: 'absolute', width: w, height: h, transformStyle: 'preserve-3d', transform, ...style}}>
      {/* épaisseur : tranches métalliques */}
      {Array.from({length: layers}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: r,
            background: i === layers - 1 ? '#1b1c1f' : i % 2 ? '#2a2b2f' : '#232427',
            transform: `translateZ(${-(i + 1) * (depth / layers)}px)`,
          }}
        />
      ))}
      {/* face avant */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: r,
          background: 'linear-gradient(135deg, #3a3b40 0%, #0E0E10 30%, #0E0E10 70%, #2c2d31 100%)',
          padding: w * 0.032,
          boxSizing: 'border-box',
          transform: 'translateZ(0.5px)',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: r - w * 0.03,
            overflow: 'hidden',
            background: C.black,
          }}
        >
          {children}
          {/* Dynamic Island */}
          <div
            style={{
              position: 'absolute',
              top: w * 0.03,
              left: '50%',
              width: w * 0.28,
              height: w * 0.075,
              marginLeft: -w * 0.14,
              background: '#000',
              borderRadius: w,
            }}
          />
          {/* reflet */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
      {/* boutons latéraux */}
      <div style={{position: 'absolute', right: -w * 0.012, top: h * 0.28, width: w * 0.014, height: h * 0.11, background: '#2a2b2f', borderRadius: 4}} />
      <div style={{position: 'absolute', left: -w * 0.012, top: h * 0.22, width: w * 0.014, height: h * 0.06, background: '#2a2b2f', borderRadius: 4}} />
      <div style={{position: 'absolute', left: -w * 0.012, top: h * 0.31, width: w * 0.014, height: h * 0.06, background: '#2a2b2f', borderRadius: 4}} />
    </div>
  );
};

/** Écran verrouillé « 9:41 » */
export const LockScreen: React.FC<{w: number; children?: React.ReactNode; date?: string}> = ({
  w,
  children,
  date = 'samedi 21 novembre',
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(180deg, rgba(139,143,150,0.55) 0%, rgba(139,143,150,0.18) 40%, ${C.black} 85%)`,
      backgroundColor: C.black,
      fontFamily: SANS,
      color: C.white,
      textAlign: 'center',
    }}
  >
    <div style={{marginTop: w * 0.2, fontSize: w * 0.05, fontWeight: 600, opacity: 0.85}}>{date}</div>
    <div style={{fontSize: w * 0.24, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, marginTop: w * 0.005}}>9:41</div>
    {children}
    <div
      style={{
        position: 'absolute',
        bottom: w * 0.03,
        left: '50%',
        width: w * 0.32,
        marginLeft: -w * 0.16,
        height: w * 0.012,
        borderRadius: 9,
        background: C.white,
        opacity: 0.85,
      }}
    />
  </div>
);

/** Notification iOS monochrome */
export const Notification: React.FC<{w: number; title: string; body: string; style?: React.CSSProperties}> = ({
  w,
  title,
  body,
  style,
}) => (
  <div
    style={{
      margin: `${w * 0.08}px ${w * 0.045}px 0`,
      background: 'rgba(255,255,255,0.82)',
      borderRadius: w * 0.06,
      padding: `${w * 0.035}px ${w * 0.04}px`,
      display: 'flex',
      alignItems: 'center',
      gap: w * 0.03,
      color: C.black,
      textAlign: 'left',
      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      ...style,
    }}
  >
    <div
      style={{
        width: w * 0.1,
        height: w * 0.1,
        borderRadius: w * 0.025,
        background: C.black,
        color: C.white,
        fontWeight: 800,
        fontSize: w * 0.042,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        letterSpacing: '-0.05em',
        flexShrink: 0,
      }}
    >
      JP
    </div>
    <div style={{flex: 1, minWidth: 0}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: w * 0.04, fontWeight: 700}}>
        <span>{title}</span>
        <span style={{fontWeight: 500, color: C.gray, fontSize: w * 0.032}}>maintenant</span>
      </div>
      <div style={{fontSize: w * 0.038, fontWeight: 500, marginTop: 2}}>{body}</div>
    </div>
  </div>
);
