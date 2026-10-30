import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {POLICES, PUB_PROMO} from '../config';

// Briques communes de « PubPromo » : ressorts, squash & stretch, typographie cinétique, cartes en verre,
// compteurs, particules. Le temps est toujours exprimé en secondes ABSOLUES de la voix off.
export const C = PUB_PROMO.couleurs;
export const INTER = POLICES.texte;

// Temps absolu (s) dans une scène dont la <Sequence> commence à `debutScene`.
export const useTemps = (debutScene: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {t: frame / fps + debutScene, frame, fps};
};

type Ressort = Partial<{stiffness: number; damping: number; mass: number}>;

// Valeur d'un ressort qui démarre à `a` (s), au temps `t` (s).
export const ressort = (t: number, a: number, fps: number, cfg: Ressort = {}) =>
  spring({frame: Math.round((t - a) * fps), fps, config: {...PUB_PROMO.ressort, ...cfg}});

// Squash & stretch : l'élément s'étire dans le sens du mouvement puis s'écrase à l'arrivée.
export const squash = (t: number, a: number, fps: number, cfg: Ressort = {}, force = 1) => {
  const v = ressort(t, a, fps, cfg);
  const vitesse = v - ressort(t - 1 / fps, a, fps, cfg); // dérivée sur une image
  const s = Math.max(-0.35, Math.min(0.35, vitesse * 6 * force));
  return {v, scaleX: 1 - s * 0.6, scaleY: 1 + s};
};

// Courbe douce 0 → 1 entre a et b (jamais linéaire brute).
export const doux = (t: number, a: number, b: number, easing = Easing.bezier(0.22, 1, 0.36, 1)) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

// Nombre avec espace fine insécable entre les milliers : 10 000.
export const milliers = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, String.fromCharCode(0xa0));

// ── Typographie cinétique : lettres qui rebondissent et s'étirent ──
export const MotCinetique: React.FC<{
  texte: string;
  a: number;
  t: number;
  fps: number;
  taille: number;
  couleur?: string;
  ecart?: number;
  poids?: number;
  style?: React.CSSProperties;
}> = ({texte, a, t, fps, taille, couleur = C.blanc, ecart = 0.028, poids = 700, style}) => (
  <div style={{display: 'flex', justifyContent: 'center', whiteSpace: 'pre', ...style}}>
    {[...texte].map((l, i) => {
      const {v, scaleX, scaleY} = squash(t, a + i * ecart, fps, {stiffness: 200, damping: 14}, 0.7);
      return (
        <span
          key={i}
          style={{
            display: 'inline-block',
            fontFamily: INTER,
            fontWeight: poids,
            fontSize: taille,
            lineHeight: 1,
            letterSpacing: '-0.045em',
            color: couleur,
            opacity: Math.min(1, v * 2),
            transform: `translateY(${(1 - v) * taille * 0.9}px) scale(${scaleX}, ${scaleY})`,
            transformOrigin: '50% 100%',
          }}
        >
          {l}
        </span>
      );
    })}
  </div>
);

// Titre en mots qui apparaissent un par un (style « app premium »).
export const MotsUnParUn: React.FC<{
  mots: {texte: string; a: number; couleur?: string}[];
  t: number;
  fps: number;
  taille: number;
  style?: React.CSSProperties;
}> = ({mots, t, fps, taille, style}) => (
  <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${taille * 0.25}px`, ...style}}>
    {mots.map((m, i) => {
      const v = ressort(t, m.a, fps, {damping: 16});
      return (
        <span
          key={i}
          style={{
            fontFamily: INTER,
            fontWeight: 700,
            fontSize: taille,
            letterSpacing: '-0.04em',
            lineHeight: 1.08,
            color: m.couleur ?? C.blanc,
            opacity: Math.min(1, v * 1.6),
            transform: `translateY(${(1 - v) * 40}px)`,
            filter: `blur(${(1 - Math.min(1, v)) * 10}px)`,
          }}
        >
          {m.texte}
        </span>
      );
    })}
  </div>
);

// Carte en verre dépoli (glassmorphism).
export const Verre: React.FC<{style?: React.CSSProperties; children?: React.ReactNode; dore?: boolean}> = ({style, children, dore}) => (
  <div
    style={{
      position: 'absolute',
      borderRadius: 44,
      background: 'linear-gradient(150deg, rgba(255,255,255,0.11), rgba(255,255,255,0.03))',
      border: `1.5px solid ${dore ? 'rgba(232,176,75,0.55)' : 'rgba(255,255,255,0.14)'}`,
      boxShadow: `0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)${dore ? ', 0 0 60px rgba(232,176,75,0.18)' : ''}`,
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      overflow: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

// Compteur qui défile jusqu'à `cible` (ressort sans rebond).
export const Compteur: React.FC<{cible: number; depart?: number; a: number; t: number; fps: number; style?: React.CSSProperties}> = ({
  cible,
  depart = 0,
  a,
  t,
  fps,
  style,
}) => {
  const v = ressort(t, a, fps, {stiffness: 110, damping: 22});
  return <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>{milliers(depart + (cible - depart) * v)}</span>;
};

// Texte doré avec reflet qui balaie.
export const styleDore = (t: number, a = 0): React.CSSProperties => ({
  backgroundImage: `linear-gradient(100deg, ${C.orSombre} 0%, ${C.or} 30%, ${C.orClair} ${42 + ((t - a) * 40) % 120}%, ${C.or} 70%, ${C.orSombre} 100%)`,
  backgroundSize: '220% 100%',
  backgroundPosition: `${100 - (((t - a) * 45) % 200)}% 0`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
});

// Particules dorées (déterministes) qui jaillissent d'un point puis retombent lentement.
export const Particules: React.FC<{t: number; a: number; x: number; y: number; n?: number; duree?: number}> = ({t, a, x, y, n = 70, duree = 6}) => {
  if (t < a) return null;
  const dt = t - a;
  return (
    <>
      {new Array(n).fill(0).map((_, i) => {
        const ang = (i * 137.5 * Math.PI) / 180;
        const v = 380 + ((i * 97) % 520);
        const amorti = 1 - Math.exp(-dt * 3.2);
        const px = x + Math.cos(ang) * v * amorti;
        const py = y + Math.sin(ang) * v * amorti * 0.8 + dt * dt * 40;
        const vie = Math.max(0, 1 - dt / (duree * (0.6 + ((i * 31) % 40) / 100)));
        const r = 3 + (i % 4) * 2;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px - r,
              top: py - r,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              background: i % 3 ? C.or : C.orClair,
              boxShadow: `0 0 ${r * 3}px ${C.or}`,
              opacity: vie * (0.6 + 0.4 * Math.sin(dt * 6 + i)),
            }}
          />
        );
      })}
    </>
  );
};

// Fond noir profond avec un léger halo.
export const Fond: React.FC<{halo?: string}> = ({halo = 'rgba(255,255,255,0.05)'}) => (
  <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 42%, ${halo}, transparent 62%), ${C.fond}`}} />
);

// Conteneur de scène : sortie nette (léger zoom + flou + fondu) sur les `d` dernières secondes avant `fin`.
export const Sortie: React.FC<{t: number; fin: number; d?: number; children: React.ReactNode}> = ({t, fin, d = 0.3, children}) => {
  const k = doux(t, fin - d, fin, Easing.in(Easing.cubic));
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 1 - k, transform: `scale(${1 + k * 0.08})`, filter: `blur(${k * 14}px)`}}>{children}</div>
  );
};

// Point d'une courbe de Bézier cubique par morceaux [x0,y0, cx1,cy1, cx2,cy2, x1,y1, cx1,cy1, …] au paramètre p ∈ [0, 1].
export const pointBezier = (pts: number[], p: number) => {
  const n = (pts.length - 2) / 6;
  const u = Math.min(n - 1e-6, Math.max(0, p * n));
  const k = Math.floor(u), s = u - k, o = k * 6;
  const [x0, y0, x1, y1, x2, y2, x3, y3] = pts.slice(o, o + 8);
  const m = 1 - s;
  return {
    x: m * m * m * x0 + 3 * m * m * s * x1 + 3 * m * s * s * x2 + s * s * s * x3,
    y: m * m * m * y0 + 3 * m * m * s * y1 + 3 * m * s * s * y2 + s * s * s * y3,
  };
};
export const cheminBezier = (pts: number[]) => {
  let d = `M${pts[0]} ${pts[1]}`;
  for (let o = 2; o < pts.length; o += 6) d += ` C${pts.slice(o, o + 6).join(' ')}`;
  return d;
};
