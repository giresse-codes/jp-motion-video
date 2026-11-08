// Briques communes de la série « motion design » n° 11 à 20 (sans voix, sans personnage).
// Chaque pub est une fonction pure du temps t (en secondes) : aucune valeur ne dépend de l'image précédente.
import {Audio, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CSSProperties, ReactNode} from 'react';
import {MOTION} from './config';
import {fichierOuNull} from '../lib/assets';

// ── Temps et courbes ──
export const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** Avancement 0 → 1 de t entre a et b (borné). */
export const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const ease = {
  out: (x: number) => 1 - (1 - x) ** 3,
  in: (x: number) => x ** 3,
  inOut: (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
  outQuint: (x: number) => 1 - (1 - x) ** 5,
  back: (x: number, k = 1.7) => 1 + (k + 1) * (x - 1) ** 3 + k * (x - 1) ** 2,
};
/** Ressort amorti : 0 avant t0, puis oscille autour de 1. */
export const ressort = (t: number, t0: number, freq = 2.2, amort = 7) => {
  if (t <= t0) return 0;
  const d = t - t0;
  return 1 - Math.exp(-amort * d) * Math.cos(2 * Math.PI * freq * d);
};
/** Temps arrondi à n images par seconde (animation « par images », stop-motion). */
export const saccade = (t: number, ips: number) => Math.floor(t * ips) / ips;
/** Pseudo-aléatoire déterministe dans [0, 1[. */
export const hasard = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** Apparition : fondu + montée, avancement p ∈ [0, 1]. */
export const monte = (p: number, dy = 40): CSSProperties => ({
  opacity: clamp(p * 1.4),
  transform: `translateY(${(1 - ease.back(p, 1.4)) * dy}px)`,
});

// ── Médias ──
export const Bande: React.FC<{n: number}> = ({n}) => {
  const src = fichierOuNull(`motion/pub${n}.wav`);
  return src ? <Audio src={src} /> : null;
};

/** Logo JP (version détourée : texte blanc). Sur fond clair, on le pose sur une pastille sombre. */
export const LogoJP: React.FC<{largeur?: number; pastille?: boolean; style?: CSSProperties}> = ({
  largeur = 300,
  pastille = false,
  style,
}) => {
  const src = fichierOuNull('logo-transparent.png') ?? staticFile('logo.png');
  const img = <Img src={src} style={{width: largeur, display: 'block'}} />;
  if (!pastille) return <div style={style}>{img}</div>;
  return (
    <div
      style={{
        background: 'rgba(12,12,14,0.92)',
        borderRadius: 18,
        padding: '10px 18px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        ...style,
      }}
    >
      {img}
    </div>
  );
};

export const Voiture: React.FC<{largeur: number; style?: CSSProperties}> = ({largeur, style}) => (
  <Img src={staticFile(MOTION.voiture)} style={{width: largeur, display: 'block', ...style}} />
);

// ── Fin commune qui renvoie vers JP ──
export type StyleFin = {
  police: string;
  policeNumero?: string;
  poidsNumero?: number;
  couleur: string;
  couleurNumero: string;
  accent: string;
  ombre?: string;
  pastilleLogo?: boolean;
  /** Ligne d'appel sous la flèche (par défaut « Réserve maintenant 👇 »). */
  appel?: string;
  /** Flèche personnalisée ; reçoit le rebond (0 → 1). */
  fleche?: (rebond: number) => ReactNode;
  tailleNumero?: number;
};

/** Bloc final : « Écris « JP » sur WhatsApp », numéro en très gros, flèche animée, logo en petit.
 *  `p(i)` donne l'avancement d'apparition de la ligne i (0 → 1) : chaque pub choisit son rythme. */
export const FinJP: React.FC<{
  t: number;
  s: StyleFin;
  p: (i: number) => number;
  haut?: number;
  entree?: (p: number, i: number) => CSSProperties;
  /** Remplace le positionnement du bloc (pour le poser dans un cadre). */
  boite?: CSSProperties;
  sansLogo?: boolean;
  /** Taille de la première ligne (« Écris « JP » sur WhatsApp »). */
  tailleTexte?: number;
  ecart?: number;
}> = ({t, s, p, haut = 560, entree = (v) => monte(v), boite, sansLogo, tailleTexte = 62, ecart = 26}) => {
  const rebond = Math.abs(Math.sin(t * Math.PI * 2.2));
  const txt: CSSProperties = {
    fontFamily: s.police,
    color: s.couleur,
    textShadow: s.ombre,
    textAlign: 'center',
    lineHeight: 1.1,
  };
  const tn = s.tailleNumero ?? 150;
  return (
    <div
      style={{
        position: 'absolute',
        left: MOTION.marge,
        right: MOTION.marge,
        top: haut,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: ecart,
        ...boite,
      }}
    >
      <div style={{...txt, fontSize: tailleTexte, fontWeight: 700, ...entree(p(0), 0)}}>
        {MOTION.ecris[0]}
        <span style={{color: s.accent}}>{MOTION.ecris[1]}</span>
        {MOTION.ecris[2]}
      </div>
      <div style={{...entree(p(1), 1), display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{...txt, fontFamily: s.policeNumero ?? s.police, fontSize: tn * 0.5, fontWeight: s.poidsNumero ?? 800, color: s.couleurNumero, letterSpacing: 4}}>
          {MOTION.indicatif}
        </div>
        <div
          style={{
            ...txt,
            fontFamily: s.policeNumero ?? s.police,
            fontSize: tn,
            fontWeight: s.poidsNumero ?? 900,
            color: s.couleurNumero,
            whiteSpace: 'nowrap',
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          {MOTION.numero}
        </div>
      </div>
      <div style={{...entree(p(2), 2), height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {s.fleche ? s.fleche(rebond) : <FlecheBas couleur={s.accent} rebond={rebond} />}
      </div>
      <div style={{...txt, fontSize: tailleTexte, fontWeight: 800, ...entree(p(3), 3)}}>{s.appel ?? MOTION.reserve}</div>
      {sansLogo ? null : (
        <div style={{marginTop: 20, ...entree(p(4), 4)}}>
          <LogoJP largeur={300} pastille={s.pastilleLogo} />
        </div>
      )}
    </div>
  );
};

export const FlecheBas: React.FC<{couleur: string; rebond: number; taille?: number}> = ({couleur, rebond, taille = 110}) => (
  <svg width={taille} height={taille} viewBox="0 0 100 100" style={{transform: `translateY(${rebond * 22 - 11}px)`}}>
    <path d="M50 8 V78 M18 50 L50 84 L82 50" fill="none" stroke={couleur} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
