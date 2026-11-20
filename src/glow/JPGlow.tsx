import React from 'react';
import {interpolate as morph} from 'flubber';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {DirBlur} from '../components';

/* ───────── Palette stricte ───────── */
export const G = {
  bg1: '#121110',
  bg2: '#1C1814',
  ui: '#1E1E20',
  text: '#F2F2F2',
  lime: '#B8F24A',
};
const SANS = "'Inter', system-ui, sans-serif";
const SERIF = "'Playfair Display', 'Liberation Serif', serif";
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const txt = (a: number) => `rgba(242,242,242,${a})`;
const limeA = (a: number) => `rgba(184,242,74,${a})`;
const GLOW = `drop-shadow(0 0 5px ${limeA(0.85)}) drop-shadow(0 0 16px ${limeA(0.35)})`;

/* ───────── Voix (Whisper, s) ─────────
 Votre chauffeur 0.34–1.10 · est déjà en route 1.96–2.94 · Akwa 4.03 · Aéroport 5.02 · à l'heure 6.22–6.73
 JP Service Express Urbaine 7.71–9.11 */
export const GLOW_DURATION = 330;

/* ───────── Téléphone (unités monde) ───────── */
const PW = 900;
const PH = 1836;
const RING = 11;
const BEZEL = 17;
const SW = PW - 2 * (RING + BEZEL); // largeur écran 844
const ISL_TOP = 30; // haut de l'îlot dans l'écran
const ISL_H = 74;
const ISL_CY = -PH / 2 + RING + BEZEL + ISL_TOP + ISL_H / 2; // centre îlot (monde)

/* ───────── Timeline (frames) ───────── */
const T = {
  pillOn: 8,
  textIn: 15,
  expand: 45,
  pullBack: [45, 100],
  screenWake: 50,
  app: 104,
  leave: 198,
  morph: [212, 228],
  prices: 216,
  condense: [230, 238],
  logo: 236,
  cta1: 254,
  cta2: 266,
  back: [304, 326],
};

/** Caméra : échelle + translation du « monde » (le téléphone est centré à l'origine). */
const closeY = 640 - 960 - 1.6 * ISL_CY; // îlot à y=640 à l'écran en gros plan
const camera = (f: number) => {
  // retour vers le gros plan (boucle) : identique à la frame 0 à la fin
  if (f >= T.back[0]) {
    const p = interpolate(f, [T.back[0], T.back[1]], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
    return {s: 1.6, x: 0, y: closeY + (1 - p) * 60, rx: 8, ry: 0, blur: (1 - p) * 26, op: p};
  }
  const pb = interpolate(f, T.pullBack, [0, 1], {...cl, easing: ease});
  let s = interpolate(pb, [0, 1], [1.6, 0.94]);
  let y = interpolate(pb, [0, 1], [closeY - f * 0.3, 20]);
  let rx = interpolate(pb, [0, 1], [8, 4]);
  let ry = 0;
  if (f >= 100) {
    // léger travelling vers le contenu qui s'écrit
    const p = interpolate(f, [100, 196], [0, 1], {...cl, easing: Easing.inOut(Easing.sin)});
    s = interpolate(p, [0, 1], [0.94, 1.08]);
    y = interpolate(p, [0, 1], [20, -60]);
    rx = 4 - p * 2;
    ry = Math.sin(f / 40) * 3;
  }
  // le téléphone recule dans le noir pendant que la pilule s'en échappe
  const lv = interpolate(f, [T.leave, T.leave + 26], [0, 1], {...cl, easing: Easing.in(Easing.cubic)});
  s *= 1 - 0.35 * lv;
  y += lv * 120;
  return {s, x: 0, y, rx: rx * (1 - lv), ry: ry * (1 - lv), blur: lv * 26, op: 1 - lv};
};

/* ───────── Fond : noir brun chaud + reflets ambrés flous ───────── */
const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  // la lueur verte n'apparaît qu'avec la pilule flottante
  const limeGlow = interpolate(f, [200, 214, 232, 240], [0, 1, 1, 0.3], cl) * interpolate(f, [300, 312], [1, 0], cl);
  const blobs = [
    {x: 120, y: 420, r: 760, a: 0.13},
    {x: 980, y: 1250, r: 820, a: 0.1},
    {x: 860, y: 260, r: 520, a: 0.07},
    {x: 200, y: 1650, r: 640, a: 0.08},
  ];
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${G.bg2} 0%, ${G.bg1} 70%)`, overflow: 'hidden'}}>
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.x - b.r / 2 + Math.sin(f / 60 + i * 2) * 30,
            top: b.y - b.r / 2 + Math.cos(f / 70 + i) * 30,
            width: b.r,
            height: b.r,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,168,84,${b.a}) 0%, rgba(255,168,84,0) 65%)`,
            filter: 'blur(40px)',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: 540 - 520,
          top: 860 - 520,
          width: 1040,
          height: 1040,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${limeA(0.1)} 0%, ${limeA(0)} 60%)`,
          opacity: limeGlow,
          filter: 'blur(30px)',
        }}
      />
    </AbsoluteFill>
  );
};

/* ───────── Barres audio vertes ───────── */
const Bars: React.FC<{h: number; n?: number}> = ({h, n = 5}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: h * 0.11, height: h, filter: GLOW}}>
      {Array.from({length: n}).map((_, i) => {
        const v = 0.3 + 0.7 * Math.abs(Math.sin(f / 3.1 + i * 1.7) * Math.cos(f / 5.3 + i));
        return <div key={i} style={{width: h * 0.13, height: h * v, borderRadius: h, background: G.lime}} />;
      })}
    </div>
  );
};

const CarIcon: React.FC<{w: number; color?: string}> = ({w, color = G.lime}) => (
  <svg viewBox="0 0 64 28" width={w} height={(w * 28) / 64}>
    <path
      d="M4 20 C4 16 6 15 10 14 L20 12 C24 7 29 5 34 5 L44 5 C49 6 53 9 56 13 L59 14 C61 15 62 17 62 20 L62 22 L4 22 Z"
      fill={color}
    />
    <circle cx="17" cy="22" r="5" fill={G.bg1} stroke={color} strokeWidth="2.5" />
    <circle cx="49" cy="22" r="5" fill={G.bg1} stroke={color} strokeWidth="2.5" />
  </svg>
);

/* ───────── Pilule (Dynamic Island) dans l'écran ───────── */
const Island: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = (at: number, d = 16, st = 120) => spring({frame: f - at, fps, config: {damping: d, stiffness: st, mass: 0.8}});
  const on = sp(T.pillOn, 18, 140);
  const ex = sp(T.expand, 17, 90); // s'élargit + barre de progression
  const cp = sp(T.app - 6, 18, 110); // redevient compacte
  const isOn = f >= T.pillOn && f < T.leave && f < T.back[0];
  const w = isOn ? interpolate(on, [0, 1], [250, 560]) + ex * 130 - cp * 390 : 250;
  const h = isOn ? ISL_H + ex * 100 * (1 - cp) : ISL_H;
  const textP = interpolate(f, [T.textIn, T.textIn + 10], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const prog = interpolate(f, [T.expand + 4, T.app - 8], [0, 1], {...cl, easing: Easing.inOut(Easing.quad)});
  const full = isOn ? 1 - cp : 0;
  return (
    <div
      style={{
        position: 'absolute',
        top: ISL_TOP,
        left: '50%',
        width: w,
        height: h,
        marginLeft: -w / 2,
        borderRadius: 60,
        background: isOn ? `linear-gradient(180deg, #2a2a2d 0%, ${G.ui} 60%, #171719 100%)` : '#000',
        boxShadow: isOn
          ? `inset 0 0 0 2px rgba(242,242,242,${0.22 * on}), inset 0 2px 0 rgba(242,242,242,0.12), 0 10px 40px rgba(0,0,0,0.6), 0 0 ${40 * on}px ${limeA(0.12 * on)}`
          : 'none',
        overflow: 'hidden',
        opacity: f >= T.leave && f < T.back[0] ? 0 : 1,
      }}
    >
      {isOn && (
        <>
          {/* rangée 1 : barres + texte */}
          <div style={{position: 'absolute', top: 0, left: 30, right: 30, height: ISL_H, display: 'flex', alignItems: 'center', gap: 20}}>
            <div style={{opacity: on}}>
              <Bars h={34} />
            </div>
            <DirBlur
              x={(1 - textP) * 28}
              style={{
                opacity: textP * full,
                transform: `translateX(${(1 - textP) * 60}px)`,
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 27,
                color: G.text,
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em',
              }}
            >
              Votre chauffeur arrive <span style={{color: txt(0.45)}}>·</span> <span style={{color: G.lime}}>6 min</span>
            </DirBlur>
          </div>
          {/* rangée 2 : progression avec la voiture */}
          <div style={{position: 'absolute', top: ISL_H + 14, left: 40, right: 40, height: 60, opacity: ex * full}}>
            <div style={{position: 'absolute', top: 34, left: 0, right: 0, height: 6, borderRadius: 3, background: txt(0.12)}} />
            <div
              style={{
                position: 'absolute',
                top: 34,
                left: 0,
                width: `${prog * 100}%`,
                height: 6,
                borderRadius: 3,
                background: G.lime,
                boxShadow: `0 0 12px ${limeA(0.6)}`,
              }}
            />
            <div style={{position: 'absolute', top: 2, left: `calc(${prog * 100}% - ${prog * 58}px)`, filter: GLOW}}>
              <CarIcon w={58} />
            </div>
            <div style={{position: 'absolute', top: 44, right: -6, width: 14, height: 14, borderRadius: 7, border: `3px solid ${txt(0.5)}`}} />
          </div>
          {/* compacte : voiture + 6 min */}
          {cp > 0.05 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 26px',
                opacity: cp,
              }}
            >
              <div style={{filter: GLOW}}>
                <CarIcon w={44} />
              </div>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 26, color: G.lime, filter: GLOW}}>6 min</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* ───────── Écrans ───────── */
const typed = (f: number, text: string, start: number, fpc: number) => text.slice(0, Math.max(0, Math.floor((f - start) / fpc) + 1) * (f >= start ? 1 : 0));

// planning de frappe (frame de départ, frames par caractère)
const LINES = {
  l1a: {t: 'Akwa', at: 121, fpc: 2},
  l1b: {t: ' → Aéroport', at: 150, fpc: 1.5},
  l2: {t: 'Service Confort', at: 168, fpc: 0.8},
  l3: {t: 'Wi-Fi · Clim · Mini écran', at: 181, fpc: 0.4},
};
export const KEY_FRAMES: number[] = (() => {
  const out: number[] = [];
  Object.values(LINES).forEach(({t, at, fpc}) => {
    for (let i = 0; i < t.length; i++) {
      const k = Math.round(at + i * fpc);
      if (t[i] !== ' ' && (out.length === 0 || k - out[out.length - 1] >= 2)) out.push(k);
    }
  });
  return out;
})();
const CONFIRM = 190;
const TOGGLE = 174;

const Caret: React.FC<{show: boolean}> = ({show}) => {
  const f = useCurrentFrame();
  return show ? <span style={{display: 'inline-block', width: 4, height: '0.9em', marginLeft: 4, background: G.lime, verticalAlign: '-0.08em', opacity: Math.floor(f / 8) % 2 ? 0.25 : 1}} /> : null;
};

const AppScreen: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const l1 = typed(f, LINES.l1a.t, LINES.l1a.at, LINES.l1a.fpc) + typed(f, LINES.l1b.t, LINES.l1b.at, LINES.l1b.fpc);
  const l2 = typed(f, LINES.l2.t, LINES.l2.at, LINES.l2.fpc);
  const l3 = typed(f, LINES.l3.t, LINES.l3.at, LINES.l3.fpc);
  const caretOn = f < LINES.l1b.at + 20 ? 1 : f < LINES.l3.at ? 2 : 3;
  const conf = spring({frame: f - CONFIRM, fps, config: {damping: 11, stiffness: 180, mass: 0.6}});
  const tg = spring({frame: f - TOGGLE, fps, config: {damping: 16, stiffness: 140}});
  const head = interpolate(f, [T.app, T.app + 12], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const chip: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 22px',
    borderRadius: 40,
    border: `2px solid ${txt(0.14)}`,
    fontFamily: SANS,
    fontWeight: 600,
    fontSize: 27,
    color: txt(0.85),
  };
  const lineStyle = (size: number, a: number): React.CSSProperties => ({fontFamily: SANS, fontWeight: 600, fontSize: size, color: txt(a), letterSpacing: '-0.015em', minHeight: size * 1.3});
  return (
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, #19181a 0%, ${G.bg1} 100%)`, padding: '150px 64px 0', boxSizing: 'border-box'}}>
      <div style={{position: 'absolute', top: 44, left: 70, fontFamily: SANS, fontWeight: 600, fontSize: 30, color: G.text}}>9:41</div>
      <div style={{position: 'absolute', top: 48, right: 70, display: 'flex', gap: 8, alignItems: 'flex-end'}}>
        {[10, 15, 20, 25].map((h) => (
          <div key={h} style={{width: 6, height: h, borderRadius: 2, background: G.text}} />
        ))}
        <div style={{marginLeft: 10, width: 46, height: 22, borderRadius: 7, border: `2px solid ${txt(0.6)}`, padding: 2, boxSizing: 'border-box'}}>
          <div style={{width: '75%', height: '100%', borderRadius: 3, background: G.text}} />
        </div>
      </div>
      <div style={{opacity: head, transform: `translateY(${(1 - head) * 30}px)`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', color: txt(0.6), fontFamily: SANS, fontSize: 40, marginBottom: 34}}>
          <span>‹</span>
          <span>•••</span>
        </div>
        <div style={{fontFamily: SERIF, fontWeight: 400, fontSize: 92, color: G.text, letterSpacing: '-0.01em', lineHeight: 1.05}}>Votre trajet</div>
        <div style={{display: 'flex', gap: 14, marginTop: 30}}>
          <div style={chip}>
            <svg width="26" height="26" viewBox="0 0 24 24">
              <rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke={txt(0.7)} strokeWidth="2" />
              <path d="M3 10 H21 M8 3 V7 M16 3 V7" stroke={txt(0.7)} strokeWidth="2" />
            </svg>
            Aujourd’hui · 9 h 00
          </div>
          <div style={chip}>
            <div style={{width: 26, height: 26, borderRadius: 13, background: G.ui, border: `2px solid ${txt(0.3)}`, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>JP</div>
            Chauffeur
          </div>
        </div>
      </div>
      <div style={{marginTop: 66, display: 'flex', flexDirection: 'column', gap: 22}}>
        <div style={{...lineStyle(52, 1), fontWeight: 700}}>
          {l1}
          <Caret show={caretOn === 1 && f >= LINES.l1a.at - 6} />
        </div>
        <div style={lineStyle(40, 0.72)}>
          {l2}
          <Caret show={caretOn === 2} />
        </div>
        <div style={lineStyle(40, 0.72)}>
          {l3}
          <Caret show={caretOn === 3 && f < CONFIRM} />
        </div>
        <div
          style={{
            marginTop: 18,
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '16px 30px 16px 18px',
            borderRadius: 50,
            background: G.ui,
            boxShadow: `inset 0 0 0 2px ${limeA(0.35 * conf)}, 0 0 ${30 * conf}px ${limeA(0.18 * conf)}`,
            opacity: f >= CONFIRM ? 1 : 0,
            transform: `scale(${0.7 + 0.3 * conf})`,
            transformOrigin: 'left center',
          }}
        >
          <div style={{width: 46, height: 46, borderRadius: 23, background: G.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: GLOW}}>
            <svg width="28" height="28" viewBox="0 0 24 24">
              <path d="M5 12.5 L10 17 L19 7" fill="none" stroke={G.bg1} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="24" strokeDashoffset={24 * (1 - Math.min(1, conf * 1.3))} />
            </svg>
          </div>
          <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: G.text}}>
            Confirmé <span style={{color: G.lime}}>✓</span>
          </span>
        </div>
      </div>
      {/* bascule Éco / Confort */}
      <div
        style={{
          position: 'absolute',
          bottom: 150,
          left: '50%',
          width: 480,
          marginLeft: -240,
          height: 92,
          borderRadius: 46,
          background: G.ui,
          boxShadow: `inset 0 0 0 2px ${txt(0.1)}`,
          opacity: head,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8 + tg * 232,
            width: 224,
            height: 76,
            borderRadius: 38,
            background: 'linear-gradient(180deg, #3a3a3e, #2b2b2e)',
            boxShadow: `inset 0 1px 0 ${txt(0.18)}, 0 6px 16px rgba(0,0,0,0.5)`,
          }}
        />
        {['Éco', 'Confort'].map((l, i) => (
          <div
            key={l}
            style={{
              position: 'absolute',
              top: 0,
              left: i * 240,
              width: 240,
              height: 92,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 30,
              color: txt(i === 1 ? 0.4 + 0.6 * tg : 1 - 0.6 * tg),
            }}
          >
            {l}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', bottom: 26, left: '50%', width: 280, marginLeft: -140, height: 9, borderRadius: 5, background: txt(0.7)}} />
    </div>
  );
};

const LockScreen: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: `radial-gradient(120% 70% at 30% 20%, #2a231c 0%, ${G.bg1} 70%)`, textAlign: 'center', fontFamily: SANS, color: G.text}}>
    <div style={{marginTop: 210, fontSize: 36, fontWeight: 600, color: txt(0.7)}}>samedi 21 novembre</div>
    <div style={{fontSize: 210, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1}}>9:41</div>
  </div>
);

const Screen: React.FC = () => {
  const f = useCurrentFrame();
  const wake = interpolate(f, [T.screenWake, T.screenWake + 14], [0, 1], cl) * interpolate(f, [T.back[0], T.back[0] + 1], [1, 0], cl);
  const toApp = interpolate(f, [T.app - 8, T.app + 4], [0, 1], {...cl, easing: ease});
  return (
    <div style={{position: 'absolute', inset: 0, background: '#050505', overflow: 'hidden', borderRadius: 128}}>
      <div style={{position: 'absolute', inset: 0, opacity: wake}}>
        {toApp < 1 && (
          <DirBlur y={toApp * 30} style={{position: 'absolute', inset: 0, opacity: 1 - toApp, transform: `scale(${1 + toApp * 0.06})`}}>
            <LockScreen />
          </DirBlur>
        )}
        {toApp > 0 && (
          <DirBlur y={(1 - toApp) * 30} style={{position: 'absolute', inset: 0, opacity: toApp, transform: `scale(${1.06 - toApp * 0.06})`}}>
            <AppScreen />
          </DirBlur>
        )}
      </div>
      <Island />
      {/* reflets sur le verre */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(118deg, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.02) 22%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 72%, rgba(255,220,180,0.035) 100%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{position: 'absolute', left: -200, top: -260, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,190,120,0.07) 0%, rgba(255,190,120,0) 60%)'}} />
    </div>
  );
};

/** iPhone photoréaliste (cadre titane, liseré ambré, verre) */
const IPhone: React.FC = () => (
  <div style={{position: 'absolute', left: -PW / 2, top: -PH / 2, width: PW, height: PH}}>
    {/* ombre portée */}
    <div style={{position: 'absolute', left: 60, right: 60, bottom: -60, height: 120, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', filter: 'blur(50px)'}} />
    {/* boutons */}
    <div style={{position: 'absolute', left: -7, top: 300, width: 9, height: 80, borderRadius: 4, background: 'linear-gradient(90deg,#5a524a,#2a2622)'}} />
    <div style={{position: 'absolute', left: -7, top: 420, width: 9, height: 140, borderRadius: 4, background: 'linear-gradient(90deg,#5a524a,#2a2622)'}} />
    <div style={{position: 'absolute', left: -7, top: 590, width: 9, height: 140, borderRadius: 4, background: 'linear-gradient(90deg,#5a524a,#2a2622)'}} />
    <div style={{position: 'absolute', right: -7, top: 470, width: 9, height: 210, borderRadius: 4, background: 'linear-gradient(270deg,#5a524a,#2a2622)'}} />
    {/* cadre titane */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 156,
        background: 'linear-gradient(90deg, #2c2824 0%, #6a6058 3%, #2a2622 7%, #1d1b19 50%, #2a2622 93%, #5e554d 97%, #2c2824 100%)',
        boxShadow: '0 0 0 1px rgba(255,200,150,0.10), inset 0 2px 1px rgba(255,220,190,0.25), inset 0 -2px 1px rgba(0,0,0,0.6), 0 80px 160px rgba(0,0,0,0.65)',
      }}
    />
    {/* bezel noir */}
    <div style={{position: 'absolute', inset: RING, borderRadius: 146, background: '#030303', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.05)'}} />
    <div style={{position: 'absolute', inset: RING + BEZEL}}>
      <Screen />
    </div>
  </div>
);

/* ───────── Pilule flottante → silhouette de voiture ───────── */
const CAPSULE =
  'M175 75 L545 75 C586.4 75 620 108.6 620 150 C620 191.4 586.4 225 545 225 L175 225 C133.6 225 100 191.4 100 150 C100 108.6 133.6 75 175 75 Z';
const CAR =
  'M40 205 C40 180 60 168 95 162 L205 150 C245 112 300 92 360 90 L470 92 C520 96 560 125 595 152 L640 160 C668 166 680 182 680 205 L680 215 C680 222 674 226 666 226 L600 226 C596 196 576 180 552 180 C528 180 508 196 504 226 L240 226 C236 196 216 180 192 180 C168 180 148 196 144 226 L54 226 C46 226 40 222 40 215 Z';
const WINDOW = 'M232 150 C262 120 305 105 355 104 L455 105 C492 108 522 126 546 150 Z';
const morpher = morph(CAPSULE, CAR, {maxSegmentLength: 4});
const SVG_SCALE = 1.15;
const CX = 540;
const CY = 860;

const FloatingPill: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.leave || f >= T.back[0] + 4) return null;
  // position de départ : l'îlot compact à l'écran au moment du départ
  const c0 = camera(T.leave);
  const sx = 540 + c0.x;
  const sy = 960 + c0.y + c0.s * ISL_CY;
  const p = interpolate(f, [T.leave, T.morph[0] - 2], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
  const x = interpolate(p, [0, 1], [sx, CX]);
  const y = interpolate(p, [0, 1], [sy, CY]) - Math.sin(p * Math.PI) * 90;
  const w = interpolate(p, [0, 1], [300 * c0.s, 520 * SVG_SCALE]);
  const h = interpolate(p, [0, 1], [ISL_H * c0.s, 150 * SVG_SCALE]);
  const domOut = interpolate(f, [T.morph[0] - 2, T.morph[0] + 3], [1, 0], cl);
  const m = interpolate(f, T.morph, [0, 1], {...cl, easing: ease});
  const wheels = interpolate(f, [T.morph[1] - 4, T.morph[1] + 6], [0, 1], cl);
  const cond = interpolate(f, T.condense, [0, 1], {...cl, easing: Easing.in(Easing.cubic)});
  const svgOn = f >= T.morph[0] - 2 && f < T.condense[1];
  const breathe = 1 + Math.sin(f / 9) * 0.01;
  const pricesP = interpolate(f, [T.prices, T.prices + 10], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const dot = interpolate(f, [T.condense[0] + 4, T.condense[1], T.logo + 10], [0, 1, 0], cl);
  return (
    <AbsoluteFill>
      {/* pilule DOM qui s'échappe de l'écran */}
      {domOut > 0 && (
        <DirBlur
          y={Math.sin(p * Math.PI) * 14}
          style={{
            position: 'absolute',
            left: x - w / 2,
            top: y - h / 2,
            width: w,
            height: h,
            borderRadius: h / 2,
            background: `linear-gradient(180deg, #2a2a2d 0%, ${G.ui} 60%, #171719 100%)`,
            boxShadow: `inset 0 0 0 2px rgba(242,242,242,0.22), 0 30px 80px rgba(0,0,0,0.7), 0 0 60px ${limeA(0.14)}`,
            opacity: domOut,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: h * 0.25,
          }}
        >
          <Bars h={h * 0.42} n={7} />
          <div style={{width: h * 0.08, height: h * 0.08, borderRadius: h, background: txt(0.6)}} />
          <div style={{width: h * 0.26, height: h * 0.26, borderRadius: h * 0.05, background: txt(0.55)}} />
        </DirBlur>
      )}
      {/* morphing pilule → voiture (contour vert citron, glow) */}
      {svgOn && (
        <svg
          width={720 * SVG_SCALE}
          height={300 * SVG_SCALE}
          viewBox="0 0 720 300"
          style={{
            position: 'absolute',
            left: CX - (720 * SVG_SCALE) / 2,
            top: CY - 150 * SVG_SCALE,
            overflow: 'visible',
            transform: `scale(${(1 - cond * 0.98) * breathe})`,
            transformOrigin: `${360 * SVG_SCALE}px ${150 * SVG_SCALE}px`,
            opacity: 1 - interpolate(cond, [0.7, 1], [0, 1], cl),
          }}
        >
          <defs>
            <filter id="limeGlow" x="-30%" y="-60%" width="160%" height="220%">
              <feGaussianBlur stdDeviation="9" result="b1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b2" />
              <feMerge>
                <feMergeNode in="b1" />
                <feMergeNode in="b2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g transform="translate(0,0)" filter="url(#limeGlow)">
            <path d={morpher(m)} fill={limeA(0.05 + 0.03 * (1 - m))} stroke={G.lime} strokeWidth={4.5} strokeLinejoin="round" opacity={0.95} />
            <path d={WINDOW} fill="none" stroke={G.lime} strokeWidth={3} opacity={0.75 * wheels} />
            {[192, 552].map((cx) => (
              <circle
                key={cx}
                cx={cx}
                cy={226}
                r={30}
                fill="none"
                stroke={G.lime}
                strokeWidth={4.5}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - wheels}
              />
            ))}
          </g>
        </svg>
      )}
      {/* tarifs, en petit */}
      {f < T.condense[1] && (
        <DirBlur
          x={(1 - pricesP) * 24}
          style={{
            position: 'absolute',
            top: CY + 210,
            left: 120,
            right: 120,
            textAlign: 'center',
            opacity: pricesP * (1 - cond),
            transform: `translateY(${(1 - pricesP) * 20}px)`,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 33,
            color: txt(0.78),
            letterSpacing: '0.005em',
          }}
        >
          Éco 2 500 F/h <span style={{color: txt(0.35)}}>·</span> Confort 3 500 F/h <span style={{color: G.lime}}>(promo)</span>
        </DirBlur>
      )}
      {/* point lumineux */}
      {dot > 0 && (
        <div
          style={{
            position: 'absolute',
            left: CX - 14,
            top: CY - 14,
            width: 28,
            height: 28,
            borderRadius: 14,
            background: '#F2F2F2',
            boxShadow: `0 0 18px 6px ${limeA(0.9)}, 0 0 70px 20px ${limeA(0.35)}`,
            transform: `scale(${0.4 + dot * 0.8})`,
            opacity: dot,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/* ───────── Appel à l'action ───────── */
const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < T.logo - 2 || f >= T.back[0] + 14) return null;
  const s = spring({frame: f - T.logo, fps, config: {damping: 18, stiffness: 90, mass: 0.9}});
  const out = interpolate(f, [T.back[0], T.back[0] + 12], [0, 1], {...cl, easing: Easing.in(Easing.cubic)});
  const c1 = interpolate(f, [T.cta1, T.cta1 + 10], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const num = '+237 655 394 028';
  const nTyped = num.slice(0, Math.max(0, Math.min(num.length, Math.floor((f - T.cta2) / 1.4) + 1)));
  return (
    <AbsoluteFill>
      <DirBlur
        y={out * 30}
        style={{position: 'absolute', inset: 0, opacity: 1 - out, transform: `translateY(${-out * 160}px) scale(${1 - out * 0.3})`, transformOrigin: '50% 45%'}}
      >
        <div
          style={{
            position: 'absolute',
            left: 120,
            right: 120,
            top: CY - 115,
            display: 'flex',
            justifyContent: 'center',
            filter: `blur(${(1 - s) * 16}px)`,
            opacity: interpolate(s, [0, 0.3], [0, 1], cl),
            transform: `scale(${0.7 + 0.3 * s})`,
          }}
        >
          <Img src={staticFile('logo-glow.png')} style={{width: 840}} />
        </div>
        <DirBlur
          x={(1 - c1) * 26}
          style={{
            position: 'absolute',
            top: CY + 200,
            left: 100,
            right: 100,
            textAlign: 'center',
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 50,
            color: G.text,
            letterSpacing: '-0.015em',
            opacity: c1,
            transform: `translateX(${(1 - c1) * 50}px)`,
          }}
        >
          Écris «&nbsp;JP&nbsp;» sur WhatsApp
        </DirBlur>
        <div
          style={{
            position: 'absolute',
            top: CY + 290,
            left: 60,
            right: 60,
            textAlign: 'center',
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 84,
            color: G.text,
            letterSpacing: '-0.03em',
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'pre',
          }}
        >
          {f >= T.cta2 ? nTyped : ''}
          <span style={{opacity: 0}}>{num.slice(nTyped.length)}</span>
        </div>
      </DirBlur>
    </AbsoluteFill>
  );
};
export const NUM_KEYS = Array.from({length: 16}, (_, i) => Math.round(T.cta2 + i * 1.4)).filter((_, i) => '+237 655 394 028'[i] !== ' ').filter((_, i) => i % 2 === 0);

/* ───────── Profondeur de champ : bords flous ───────── */
const DepthOfField: React.FC = () => {
  const f = useCurrentFrame();
  const c = camera(f);
  if (c.op < 0.02) return null;
  const strength = interpolate(c.s, [0.9, 1.6], [12, 26], cl);
  const inner = interpolate(c.s, [0.9, 1.6], [62, 30], cl);
  const mask = `radial-gradient(ellipse 62% 48% at 50% ${f < 100 || f >= T.back[0] ? 40 : 48}%, transparent ${inner}%, black 100%)`;
  return (
    <AbsoluteFill
      style={{
        backdropFilter: `blur(${strength}px)`,
        WebkitBackdropFilter: `blur(${strength}px)`,
        WebkitMaskImage: mask,
        maskImage: mask,
        opacity: c.op,
      }}
    />
  );
};

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: 0.09, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="1080" height="1920">
        <filter id="grainF">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 12} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="1080" height="1920" filter="url(#grainF)" />
      </svg>
    </AbsoluteFill>
  );
};

export const JPGlow: React.FC = () => {
  const f = useCurrentFrame();
  const c = camera(f);
  return (
    <AbsoluteFill style={{background: G.bg1}}>
      <Backdrop />
      {c.op > 0.01 && (
        <AbsoluteFill style={{perspective: 2600, perspectiveOrigin: '50% 40%'}}>
          <div
            style={{
              position: 'absolute',
              left: 540,
              top: 960,
              transform: `translate(${c.x}px, ${c.y}px) scale(${c.s}) rotateX(${c.rx}deg) rotateY(${c.ry}deg)`,
              filter: c.blur > 0.3 ? `blur(${c.blur}px)` : undefined,
              opacity: c.op,
            }}
          >
            <IPhone />
          </div>
        </AbsoluteFill>
      )}
      <DepthOfField />
      <FloatingPill />
      <CTA />
      {/* vignette */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
      <Grain />

      {/* SON */}
      <Audio src={staticFile('voix-off-glow.mp3')} />
      <Audio src={staticFile('musique-glow.mp3')} volume={0.35} />
      <Sequence from={T.pillOn} durationInFrames={12}>
        <Audio src={staticFile('sfx-glow/bip.wav')} volume={0.4} />
      </Sequence>
      {[...KEY_FRAMES, ...NUM_KEYS].map((k) => (
        <Sequence key={'k' + k} from={k} durationInFrames={3}>
          <Audio src={staticFile('sfx-glow/key.wav')} volume={0.3} />
        </Sequence>
      ))}
      {[T.app - 8, T.leave, T.morph[0], T.condense[0], T.back[0]].map((w) => (
        <Sequence key={'w' + w} from={w} durationInFrames={27}>
          <Audio src={staticFile('sfx-glow/whoosh.wav')} volume={0.45} />
        </Sequence>
      ))}
      <Sequence from={T.logo - 4} durationInFrames={GLOW_DURATION - T.logo + 4}>
        <Audio src={staticFile('sfx-glow/drone.wav')} volume={0.5} />
      </Sequence>
    </AbsoluteFill>
  );
};
