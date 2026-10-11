import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {COULEURS} from '../config';

// Vignettage + léger grain : donne un rendu « pub TV » à toutes les images.
export const Finition: React.FC = () => {
  const frame = useCurrentFrame();
  const grain = Math.floor(frame / 2);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 85% 70% at 50% 45%, transparent 55%, rgba(0,0,0,0.65) 100%)',
        }}
      />
      <AbsoluteFill style={{opacity: 0.07, mixBlendMode: 'overlay'}}>
        <svg width="100%" height="100%">
          <filter id={`grain-${grain}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={grain} />
          </filter>
          <rect width="100%" height="100%" filter={`url(#grain-${grain})`} />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Dégradé sombre pour garder les textes lisibles sur les images.
export const Assombri: React.FC<{haut?: number; bas?: number}> = ({haut = 0.55, bas = 0.85}) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, rgba(0,0,0,${haut}) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,${bas}) 100%)`,
    }}
  />
);

// Reflet lumineux qui balaie un élément (à placer dans un conteneur overflow:hidden).
export const Reflet: React.FC<{debut: number; duree?: number; largeur?: number}> = ({
  debut,
  duree = 18,
  largeur = 35,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [debut, debut + duree], [-60, 160], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (frame < debut || frame > debut + duree) return null;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(105deg, transparent ${p - largeur}%, rgba(255,255,255,0.75) ${p}%, transparent ${p + largeur / 3}%)`,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }}
    />
  );
};

// Traînées de lumière façon phares de nuit, qui filent à l'écran.
export const Trainees: React.FC<{
  nombre?: number;
  vitesse?: number;
  opacite?: number;
  graine?: string;
  angle?: number;
}> = ({nombre = 14, vitesse = 1, opacite = 0.9, graine = 'trainees', angle = -18}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none', mixBlendMode: 'screen'}}>
      <AbsoluteFill style={{transform: `rotate(${angle}deg) scale(1.6)`}}>
        {new Array(nombre).fill(0).map((_, i) => {
          const r = (k: string) => random(`${graine}-${i}-${k}`);
          const longueur = 300 + r('l') * 700;
          const y = r('y') * height;
          const v = (28 + r('v') * 50) * vitesse;
          const x = ((r('x') * (width + longueur) + frame * v) % (width * 1.8 + longueur)) - longueur;
          const rouge = r('c') > 0.35;
          const epaisseur = 2 + r('e') * 5;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x - width * 0.4,
                top: y,
                width: longueur,
                height: epaisseur,
                borderRadius: epaisseur,
                opacity: opacite * (0.4 + r('o') * 0.6),
                background: `linear-gradient(90deg, transparent, ${rouge ? COULEURS.rougeNeon : '#FFE9D6'})`,
                boxShadow: `0 0 ${12 + epaisseur * 3}px ${rouge ? COULEURS.rouge : '#ffffff'}`,
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Flash blanc/rouge bref, pour ponctuer une coupe.
export const Flash: React.FC<{a: number; duree?: number; couleur?: string; force?: number}> = ({
  a,
  duree = 8,
  couleur = '#ffffff',
  force = 0.8,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [a, a + 1, a + duree], [0, force, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (o <= 0) return null;
  return <AbsoluteFill style={{backgroundColor: couleur, opacity: o, pointerEvents: 'none'}} />;
};

// Route néon en perspective (rappel de la route du logo), en bas de l'écran.
export const RouteNeon: React.FC<{opacite?: number; vitesse?: number; horizon?: number}> = ({
  opacite = 0.55,
  vitesse = 1,
  horizon = 1250,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cx = width / 2;
  const tirets = 12;
  // Les tirets glissent vers le spectateur (progression en perspective).
  const avance = (frame * 0.035 * vitesse) % 1;
  return (
    <AbsoluteFill style={{opacity: opacite, pointerEvents: 'none'}}>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="fondu-route" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask id="masque-route">
            <rect x={0} y={horizon} width={width} height={height - horizon} fill="url(#fondu-route)" />
          </mask>
          <filter id="lueur-route">
            <feGaussianBlur stdDeviation="6" result="flou" />
            <feMerge>
              <feMergeNode in="flou" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g mask="url(#masque-route)" filter="url(#lueur-route)">
          <path
            d={`M ${cx - 30} ${horizon} L ${-width * 0.35} ${height} L ${width * 1.35} ${height} L ${cx + 30} ${horizon} Z`}
            fill={COULEURS.rougeSombre}
            fillOpacity={0.35}
          />
          <line x1={cx - 30} y1={horizon} x2={-width * 0.35} y2={height} stroke={COULEURS.rougeNeon} strokeWidth={6} />
          <line x1={cx + 30} y1={horizon} x2={width * 1.35} y2={height} stroke={COULEURS.rougeNeon} strokeWidth={6} />
          {new Array(tirets).fill(0).map((_, i) => {
            const p = (i + avance) / tirets;
            const z = p * p;
            const y1 = horizon + (height - horizon) * z;
            const y2 = horizon + (height - horizon) * Math.min(1, z + 0.035 + z * 0.08);
            return (
              <line key={i} x1={cx} y1={y1} x2={cx} y2={y2} stroke="white" strokeWidth={2 + z * 14} strokeLinecap="round" />
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// Halo lumineux façon reflet d'objectif, qui traverse l'écran.
export const Halo: React.FC<{debut: number; duree?: number}> = ({debut, duree = 40}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const p = interpolate(frame, [debut, debut + duree], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (p <= 0 || p >= 1) return null;
  const x = interpolate(p, [0, 1], [-0.2, 1.2]) * width;
  const o = Math.sin(p * Math.PI);
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none', opacity: o}}>
      <div
        style={{
          position: 'absolute',
          left: x - 450,
          top: 520,
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,240,220,0.9) 0%, rgba(255,90,40,0.35) 25%, transparent 60%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 965,
          height: 6,
          background: `linear-gradient(90deg, transparent, rgba(255,220,200,0.8) ${(x / width) * 100}%, transparent)`,
          filter: 'blur(2px)',
        }}
      />
    </AbsoluteFill>
  );
};

// Bandes noires cinéma qui entrent en haut et en bas.
export const BandesCinema: React.FC<{hauteur?: number}> = ({hauteur = 130}) => {
  const frame = useCurrentFrame();
  const h = interpolate(frame, [0, 14], [0, hauteur], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: h, background: 'black'}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: h, background: 'black'}} />
    </AbsoluteFill>
  );
};
