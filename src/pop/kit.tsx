import React from 'react';
import {fitText} from '@remotion/layout-utils';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {DirBlur} from '../components';

/* ───────── Palette stricte ───────── */
/* Palette professionnelle : gris, kaki, noir, blanc + un zeste de rouge.
   (o / p / v = les 3 teintes du dégradé signature : kaki clair → kaki → anthracite) */
export const P = {
  white: '#FFFFFF',
  o: '#B9AE86',
  p: '#7F7656',
  v: '#2A2A2C',
  text: '#111111',
  gray: '#B5B8BE',
  red: '#C8102E',
};
export const FONT = "'Inter', system-ui, sans-serif";
export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const GRAD = `linear-gradient(90deg, ${P.o}, ${P.p}, ${P.v}, ${P.p}, ${P.o})`;
export const GRAD_STATIC = `linear-gradient(90deg, ${P.o} 0%, ${P.p} 50%, ${P.v} 100%)`;
export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** spring vif avec rebond */
export const usePop = (at: number, cfg: Partial<{damping: number; stiffness: number; mass: number}> = {}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: {damping: 10, stiffness: 190, mass: 0.7, ...cfg}});
};

/** Fond du dégradé animé (glisse en continu) */
export const useGradBg = (speed = 1.6): React.CSSProperties => {
  const f = useCurrentFrame();
  return {backgroundImage: GRAD, backgroundSize: '200% 100%', backgroundPosition: `${(f * speed) % 200}% 0`};
};

/** Texte rempli du dégradé animé */
export const GradText: React.FC<{children: React.ReactNode; size: number; weight?: number; style?: React.CSSProperties}> = ({
  children,
  size,
  weight = 900,
  style,
}) => {
  const bg = useGradBg();
  return (
    <span
      style={{
        ...bg,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        fontFamily: FONT,
        fontWeight: weight,
        fontSize: size,
        letterSpacing: '-0.055em',
        lineHeight: 1,
        display: 'inline-block',
        whiteSpace: 'nowrap',
        paddingRight: size * 0.04,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** taille pour remplir la largeur */
export const fit = (text: string, width = 960, weight = 900, max = 900) =>
  Math.min(max, fitText({text, withinWidth: width, fontFamily: 'Inter', fontWeight: String(weight), letterSpacing: '-0.055em'}).fontSize);

/** Mot géant qui remplit la largeur avec un rebond à ressort */
export const GiantWord: React.FC<{text: string; at: number; width?: number; y?: number; out?: number}> = ({text, at, width = 960, y = 960, out = 9999}) => {
  const f = useCurrentFrame();
  const s = usePop(at, {damping: 9, stiffness: 160});
  const size = fit(text, width);
  const o = interpolate(f, [out, out + 6], [0, 1], cl);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: y - size * 0.55,
        textAlign: 'center',
        transform: `scale(${s * (1 - o * 0.6)})`,
        opacity: (f >= at ? 1 : 0) * (1 - o),
        filter: o > 0 ? `blur(${o * 20}px)` : undefined,
      }}
    >
      <GradText size={size}>{text}</GradText>
    </div>
  );
};

/** Aura : tache de dégradé floue en traînées verticales (signature de la référence) */
export const Aura: React.FC<{x: number; y: number; w: number; h: number; opacity?: number; style?: React.CSSProperties}> = ({x, y, w, h, opacity: op0 = 0.75, style}) => {
  const opacity = op0 * 0.75;
  const bg = useGradBg(1);
  return (
    <DirBlur
      x={26}
      y={70}
      style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, opacity, pointerEvents: 'none', ...style}}
    >
      <div style={{width: '100%', height: '100%', borderRadius: '50%', ...bg, backgroundSize: '100% 100%', backgroundImage: `linear-gradient(120deg, ${P.o}, ${P.gray} 50%, ${P.p})`}} />
    </DirBlur>
  );
};

/** Pilule dégradée */
export const Pill: React.FC<{children: React.ReactNode; h?: number; size?: number; style?: React.CSSProperties; padX?: number}> = ({
  children,
  h = 150,
  size = 64,
  style,
  padX,
}) => {
  const bg = useGradBg();
  return (
    <div
      style={{
        ...bg,
        height: h,
        borderRadius: h / 2,
        padding: `0 ${padX ?? h * 0.42}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: P.white,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '-0.035em',
        whiteSpace: 'nowrap',
        boxShadow: `0 30px 70px ${rgba(P.p, 0.35)}, 0 10px 24px ${rgba(P.v, 0.2)}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Logo officiel (fond noir) présenté sur une plaque noire — le texte du logo est blanc */
export const LogoPlate: React.FC<{w?: number}> = ({w = 820}) => (
  <div
    style={{
      width: w,
      padding: `${w * 0.04}px ${w * 0.035}px ${w * 0.03}px`,
      boxSizing: 'border-box',
      background: '#111111',
      borderRadius: w * 0.06,
      boxShadow: `0 40px 90px ${rgba(P.p, 0.28)}, 0 16px 40px ${rgba(P.v, 0.18)}`,
    }}
  >
    <Img src={staticFile('logo-glow.png')} style={{width: '100%', display: 'block'}} />
  </div>
);

/* ───────── Icônes ───────── */
const st = {fill: 'none', stroke: '#fff', strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
export const ICONS: Record<string, React.ReactNode> = {
  wifi: (
    <>
      <path d="M12 40 Q50 6 88 40" {...st} />
      <path d="M25 55 Q50 32 75 55" {...st} />
      <circle cx="50" cy="76" r="7" fill="#fff" />
    </>
  ),
  plane: <path d="M50 10 L56 40 L88 56 L88 64 L56 56 L54 78 L64 86 L64 92 L50 88 L36 92 L36 86 L46 78 L44 56 L12 64 L12 56 L44 40 Z" fill="#fff" />,
  pin: (
    <>
      <path d="M50 92 C50 92 20 60 20 40 A30 30 0 0 1 80 40 C80 60 50 92 50 92 Z" fill="#fff" />
      <circle cx="50" cy="40" r="11" fill={P.p} />
    </>
  ),
  clock: (
    <>
      <circle cx="50" cy="50" r="34" {...st} />
      <path d="M50 30 L50 52 L64 60" {...st} />
    </>
  ),
  snow: (
    <>
      {[0, 60, 120].map((a) => (
        <path key={a} d="M50 14 L50 86" {...st} transform={`rotate(${a} 50 50)`} />
      ))}
    </>
  ),
  star: <path d="M50 10 L61 38 L91 39 L67 58 L76 88 L50 71 L24 88 L33 58 L9 39 L39 38 Z" fill="#fff" />,
  palm: (
    <>
      <path d="M52 92 C54 70 52 52 46 38" {...st} />
      <path d="M46 38 C30 26 18 30 10 38 M46 38 C40 20 52 12 64 12 M46 38 C62 28 78 32 88 42" {...st} />
      <path d="M10 92 L90 92" {...st} />
    </>
  ),
  car: (
    <>
      <path d="M10 66 L10 54 C10 48 14 46 20 45 L30 32 C33 28 38 26 44 26 L62 26 C68 26 72 29 75 33 L84 45 C88 46 90 49 90 54 L90 66 Z" fill="#fff" />
      <circle cx="30" cy="68" r="9" fill={P.v} stroke="#fff" strokeWidth="5" />
      <circle cx="70" cy="68" r="9" fill={P.v} stroke="#fff" strokeWidth="5" />
    </>
  ),
};

/* ───────── Cartes du collage ───────── */
export type CardSpec =
  | {k: 'photo'; pos: string; zoom: number}
  | {k: 'img'; src: string; ratio: number; cut?: boolean; label?: string}
  | {k: 'icon'; icon: string; label?: string; grad: number}
  | {k: 'bubble'; text: string; me?: boolean}
  | {k: 'place'; text: string; sub: string}
  | {k: 'stat'; big: string; small: string};

const grads = [
  `linear-gradient(135deg, ${P.o}, ${P.p})`,
  `linear-gradient(135deg, ${P.p}, ${P.v})`,
  `linear-gradient(135deg, #3a3a3d, ${P.text})`,
  `linear-gradient(160deg, ${P.gray}, ${P.p})`,
];

export const CollageCard: React.FC<{spec: CardSpec; w: number}> = ({spec, w}) => {
  const r = w * 0.14;
  const shadow = `0 ${w * 0.12}px ${w * 0.3}px ${rgba(P.p, 0.22)}, 0 ${w * 0.04}px ${w * 0.1}px ${rgba(P.v, 0.12)}`;
  if (spec.k === 'photo')
    return (
      <div style={{width: w, height: w * 1.15, borderRadius: r, overflow: 'hidden', boxShadow: shadow, background: '#eee'}}>
        <Img
          src={staticFile('voiture-photo.jpg')}
          style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: spec.pos, transform: `scale(${spec.zoom})`}}
        />
      </div>
    );
  if (spec.k === 'img')
    return spec.cut ? (
      <Img
        src={staticFile(`pop-img/${spec.src}`)}
        style={{width: w * spec.ratio, display: 'block', filter: `drop-shadow(0 ${w * 0.08}px ${w * 0.12}px ${rgba(P.v, 0.28)})`}}
      />
    ) : (
      <div style={{position: 'relative', width: w * spec.ratio, height: w, borderRadius: r, overflow: 'hidden', boxShadow: shadow, background: '#eee'}}>
        <Img src={staticFile(`pop-img/${spec.src}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        {spec.label && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              padding: `${w * 0.18}px ${w * 0.08}px ${w * 0.06}px`,
              background: 'linear-gradient(180deg, rgba(17,17,17,0) 0%, rgba(17,17,17,0.7) 100%)',
              color: P.white,
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: w * 0.13,
              letterSpacing: '-0.02em',
            }}
          >
            {spec.label}
          </div>
        )}
      </div>
    );
  if (spec.k === 'icon')
    return (
      <div
        style={{
          width: w,
          height: w,
          borderRadius: r,
          background: grads[spec.grad % 4],
          boxShadow: shadow,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: w * 0.04,
        }}
      >
        <svg viewBox="0 0 100 100" width={w * 0.5} height={w * 0.5}>
          {ICONS[spec.icon]}
        </svg>
        {spec.label && <div style={{fontFamily: FONT, fontWeight: 800, fontSize: w * 0.14, color: '#fff', letterSpacing: '-0.03em'}}>{spec.label}</div>}
      </div>
    );
  if (spec.k === 'bubble')
    return (
      <div
        style={{
          maxWidth: w * 1.6,
          padding: `${w * 0.1}px ${w * 0.14}px`,
          borderRadius: w * 0.16,
          borderBottomRightRadius: spec.me ? w * 0.03 : w * 0.16,
          borderBottomLeftRadius: spec.me ? w * 0.16 : w * 0.03,
          background: spec.me ? grads[1] : P.white,
          color: spec.me ? P.white : P.text,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: w * 0.15,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
          boxShadow: shadow,
        }}
      >
        {spec.text}
      </div>
    );
  if (spec.k === 'place')
    return (
      <div style={{width: w * 1.25, padding: w * 0.12, borderRadius: r, background: P.white, boxShadow: shadow, boxSizing: 'border-box', fontFamily: FONT}}>
        <div style={{width: w * 0.3, height: w * 0.3, borderRadius: w * 0.08, background: grads[0], display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg viewBox="0 0 100 100" width={w * 0.2} height={w * 0.2}>
            {ICONS.pin}
          </svg>
        </div>
        <div style={{marginTop: w * 0.08, fontWeight: 800, fontSize: w * 0.16, color: P.text, letterSpacing: '-0.03em', lineHeight: 1.05}}>{spec.text}</div>
        <div style={{marginTop: w * 0.03, fontWeight: 600, fontSize: w * 0.1, color: P.gray}}>{spec.sub}</div>
      </div>
    );
  return (
    <div style={{width: w * 1.1, padding: w * 0.12, borderRadius: r, background: P.white, boxShadow: shadow, boxSizing: 'border-box', fontFamily: FONT, textAlign: 'center'}}>
      <GradText size={w * 0.34}>{spec.big}</GradText>
      <div style={{fontWeight: 700, fontSize: w * 0.11, color: P.text, marginTop: w * 0.04}}>{spec.small}</div>
    </div>
  );
};

export const COLLAGE: CardSpec[] = [
  {k: 'photo', pos: '45% 55%', zoom: 1},
  {k: 'img', src: 'tv.png', ratio: 1.55, cut: true},
  {k: 'bubble', text: 'Un chauffeur demain 9 h ?', me: true},
  {k: 'img', src: 'kribi-plage.jpg', ratio: 1.45, label: 'Kribi'},
  {k: 'img', src: 'whatsapp.png', ratio: 0.8, cut: true},
  {k: 'img', src: 'yaounde.jpg', ratio: 1, label: 'Yaoundé'},
  {k: 'img', src: 'etoiles.png', ratio: 1.7, cut: true},
  {k: 'icon', icon: 'snow', label: 'Clim', grad: 1},
  {k: 'bubble', text: '✓ Confirmé'},
  {k: 'img', src: 'telephones.jpg', ratio: 0.8},
  {k: 'img', src: 'buea.jpg', ratio: 0.78, label: 'Buea'},
  {k: 'img', src: 'voiture-jouet.png', ratio: 1.6, cut: true},
  {k: 'place', text: 'Aéroport de Douala', sub: 'Transfert'},
  {k: 'img', src: 'ouest.jpg', ratio: 1, label: 'Ouest'},
  {k: 'photo', pos: '30% 60%', zoom: 1.5},
  {k: 'img', src: 'kribi-gites.jpg', ratio: 1.05, label: 'Gîtes de Kribi'},
  {k: 'icon', icon: 'wifi', label: 'Wi-Fi', grad: 2},
  {k: 'stat', big: '6 min', small: 'Chauffeur en route'},
  {k: 'bubble', text: 'Akwa → Bonapriso', me: true},
  {k: 'icon', icon: 'clock', label: '24 h/24', grad: 0},
];

/** Collage qui explose depuis le centre puis flotte en parallaxe */
export const Collage: React.FC<{
  at: number;
  cx?: number;
  cy?: number;
  layout: {x: number; y: number; w: number; d: number; r: number}[];
  implodeAt?: number;
  cards?: CardSpec[];
}> = ({at, cx = 540, cy = 960, layout, implodeAt = 99999, cards = COLLAGE}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      {layout.map((L, i) => {
        const delay = (i % 7) * 1.2;
        const s = spring({frame: f - at - delay, fps, config: {damping: 11, stiffness: 120, mass: 0.7}});
        const imp = interpolate(f, [implodeAt + (i % 5), implodeAt + 10 + (i % 5)], [0, 1], {...cl, easing: Easing.in(Easing.cubic)});
        const k = s * (1 - imp);
        const drift = (f - at) * (0.15 + L.d * 0.35);
        const x = cx + (L.x - cx) * k + Math.sin((f + i * 23) / 28) * 10 * L.d;
        const y = cy + (L.y - cy) * k - drift * 0.4 * (f > at ? 1 : 0) + Math.cos((f + i * 17) / 31) * 10 * L.d;
        const vel = Math.max(interpolate(f - at - delay, [0, 10], [1, 0], cl), imp > 0 && imp < 1 ? 1 - Math.abs(imp - 0.5) * 2 : 0);
        const ang = Math.atan2(L.y - cy, L.x - cx);
        const bx = Math.abs(Math.cos(ang)) * 22 * vel;
        const by = Math.abs(Math.sin(ang)) * 22 * vel;
        return (
          <DirBlur
            key={i}
            x={bx + (1 - L.d) * 2.5}
            y={by + (1 - L.d) * 2.5}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%,-50%) scale(${0.2 + 0.8 * k}) rotate(${L.r * k + Math.sin((f + i * 11) / 40) * 3}deg)`,
              opacity: f >= at + delay ? Math.min(1, k * 3) : 0,
              zIndex: Math.round(L.d * 10),
            }}
          >
            <CollageCard spec={cards[i % cards.length]} w={L.w} />
          </DirBlur>
        );
      })}
    </AbsoluteFill>
  );
};

/** Disposition en anneau (parallaxe : d = profondeur 0..1) */
export const ringLayout = (n: number, cx = 540, cy = 960, rx = 430, ry = 640, seed = 1) =>
  Array.from({length: n}).map((_, i) => {
    const a = (i / n) * Math.PI * 2 + seed;
    const jitter = ((i * 37) % 10) / 10;
    const d = ((i * 53) % 10) / 10;
    return {
      x: cx + Math.cos(a) * rx * (0.85 + jitter * 0.3),
      y: cy + Math.sin(a) * ry * (0.85 + jitter * 0.25),
      w: 150 + d * 90,
      d,
      r: ((i * 29) % 24) - 12,
    };
  });

/** Disposition en grille autour d'une zone centrale libre */
export const gridLayout = (cols = 4, rows = 6, freeW = 640, freeH = 520, cx = 540, cy = 960) => {
  const out: {x: number; y: number; w: number; d: number; r: number}[] = [];
  const cw = 1080 / cols;
  const ch = 1920 / rows;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const x = cw * (c + 0.5);
      const y = ch * (r + 0.5);
      if (Math.abs(x - cx) < freeW / 2 && Math.abs(y - cy) < freeH / 2) continue;
      const i = r * cols + c;
      out.push({x, y, w: 170 + ((i * 31) % 4) * 15, d: ((i * 47) % 10) / 10, r: ((i * 13) % 14) - 7});
    }
  return out;
};
