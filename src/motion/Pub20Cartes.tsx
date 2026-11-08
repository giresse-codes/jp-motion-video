// 20. « Choisis une carte » — tour de magie (12 s).
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {Bande, clamp, ease, FinJP, mix, prog, ressort, useT} from './commun';
import {POLICES_MOTION as P} from './config';

const C = {tapis: '#0F4A34', carte: '#FAF7EF', dos: '#14213D', or: '#D4AF5F', noir: '#1A1A1A'};
const L = 340;
const H = 476;
const NB = 13;

const ICONES: Record<string, ReactNode> = {
  voiture: (
    <svg viewBox="0 0 100 60" width="150">
      <path d="M8 42 L14 26 Q18 18 28 18 L66 18 Q74 18 80 26 L90 34 Q96 36 96 42 L96 48 L4 48 L4 44 Z" fill={C.dos} />
      <path d="M24 22 L32 22 L32 32 L18 32 Z M36 22 L60 22 L70 32 L36 32 Z" fill="#9EC3E6" />
      <circle cx="26" cy="48" r="9" fill={C.noir} stroke={C.or} strokeWidth="3" />
      <circle cx="76" cy="48" r="9" fill={C.noir} stroke={C.or} strokeWidth="3" />
    </svg>
  ),
  etoile: (
    <svg viewBox="0 0 100 100" width="130">
      <path d="M50 6 L62 38 L96 38 L68 58 L79 92 L50 71 L21 92 L32 58 L4 38 L38 38 Z" fill={C.or} stroke={C.dos} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  ),
  avion: (
    <svg viewBox="0 0 100 100" width="130">
      <path d="M50 4 Q56 4 56 16 L56 40 L94 60 L94 68 L56 58 L56 82 L68 90 L68 96 L50 92 L32 96 L32 90 L44 82 L44 58 L6 68 L6 60 L44 40 L44 16 Q44 4 50 4 Z" fill={C.dos} />
    </svg>
  ),
  palmier: (
    <svg viewBox="0 0 100 100" width="130">
      <path d="M52 96 Q48 70 54 36" stroke="#7A5634" strokeWidth="8" fill="none" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M54 36 q${Math.cos(i * 1.2 - 0.3) * 20} ${-12 + Math.sin(i * 1.2) * 6} ${Math.cos(i * 1.2 - 0.3) * 40} ${Math.sin(i * 1.2) * 18 + 6}`} stroke="#2F7A4A" strokeWidth="9" fill="none" strokeLinecap="round" />
      ))}
      <path d="M14 96 Q50 84 86 96" stroke={C.or} strokeWidth="6" fill="none" />
    </svg>
  ),
};

const AS = [
  {nom: "As d'ÉCO", icone: 'voiture', l1: '2 500 F/h', l2: 'dès 5 h : 2 000 F/h'},
  {nom: 'As de CONFORT', icone: 'etoile', l1: '3 500 F/h', l2: 'Wi-Fi · Clim'},
  {nom: "As d'AÉROPORT", icone: 'avion', l1: 'Éco 8 000 F', l2: 'Confort 10 000 F'},
  {nom: 'As de VOYAGE', icone: 'palmier', l1: '50 000 F/jour', l2: '3 jours : 100 000 F'},
];
const PLACES = [
  [330, 758],
  [750, 758],
  [330, 1298],
  [750, 1298],
];

const Dos: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', inset: 0, borderRadius: 22, background: C.dos, border: '10px solid #FAF7EF', overflow: 'hidden'}}>
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
      <defs>
        <pattern id="p20motif" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="34" height="34" fill={C.dos} />
          <rect x="4" y="4" width="26" height="26" fill="none" stroke={C.or} strokeWidth="2.2" />
          <circle cx="17" cy="17" r="3.4" fill={C.or} />
        </pattern>
      </defs>
      <rect x="14" y="14" width={L - 48} height={H - 48} rx="10" fill="url(#p20motif)" stroke={C.or} strokeWidth="4" />
    </svg>
    {/* Reflet doré qui glisse */}
    <div style={{position: 'absolute', top: -100, bottom: -100, width: 120, left: `${((t * 40) % 220) - 60}%`, background: 'linear-gradient(90deg, transparent, rgba(255,230,160,0.35), transparent)', transform: 'skewX(-20deg)'}} />
  </div>
);

const Face: React.FC<{as: (typeof AS)[number]}> = ({as}) => (
  <div style={{position: 'absolute', inset: 0, borderRadius: 22, background: C.carte, border: `3px solid ${C.or}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, fontFamily: P.capitales, color: C.noir, textAlign: 'center'}}>
    <div style={{position: 'absolute', left: 20, top: 14, fontSize: 52, fontWeight: 700, lineHeight: 1, color: C.dos}}>A</div>
    <div style={{position: 'absolute', right: 20, bottom: 14, fontSize: 52, fontWeight: 700, lineHeight: 1, color: C.dos, transform: 'rotate(180deg)'}}>A</div>
    <div style={{fontSize: 30, fontWeight: 700, color: '#8C6A22', marginTop: 20}}>{as.nom}</div>
    <div style={{height: 140, display: 'flex', alignItems: 'center'}}>{ICONES[as.icone]}</div>
    <div style={{fontFamily: P.grotesk, fontWeight: 700, fontSize: 36}}>{as.l1}</div>
    <div style={{fontFamily: P.grotesk, fontSize: 28, color: '#444'}}>{as.l2}</div>
  </div>
);

/** Carte 3D : centre (x, y), rotation dans le plan, retournement (0 = dos, 180 = face). */
const Carte: React.FC<{x: number; y: number; rot?: number; flip?: number; s?: number; t: number; face?: ReactNode; origine?: string; z?: number}> = ({x, y, rot = 0, flip = 0, s = 1, t, face, origine = '50% 50%', z = 0}) => (
  <div style={{position: 'absolute', left: x - L / 2, top: y - H / 2, width: L, height: H, transformOrigin: origine, transform: `rotate(${rot}deg) scale(${s})`, zIndex: z}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 22, boxShadow: `0 ${10 + (s - 1) * 120}px ${20 + (s - 1) * 160}px rgba(0,0,0,0.45)`}} />
    <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `perspective(1400px) rotateY(${flip}deg)`}}>
      <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden'}}>
        <Dos t={t} />
      </div>
      <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)'}}>{face}</div>
    </div>
  </div>
);

/** Cascade de mélange (tc en secondes depuis son début) puis éventail. */
const Paquet: React.FC<{t: number; tc: number; eventail: number; sortis?: number}> = ({t, tc, eventail, sortis = 0}) => (
  <>
    {Array.from({length: NB}).map((_, i) => {
      const lance = i * 0.04;
      const p = clamp((tc - lance) / 0.36);
      // Cascade : arc de la pile gauche vers la pile droite
      let x = mix(330, 750, ease.inOut(p));
      let y = 1150 - Math.sin(p * Math.PI) * 360 - i * 1.5;
      let rot = mix(-12, 12, p) + Math.sin(p * Math.PI) * 25;
      // Éventail parfait autour d'un pivot bas
      const a = -54 + (i * 108) / (NB - 1);
      const e = ease.out(clamp(eventail * 1.2 - i * 0.015));
      x = mix(x, 540, e);
      y = mix(y, 1150, e);
      rot = mix(rot, a, e);
      const disparait = sortis > 0 ? sortis : 0;
      return (
        <div key={i} style={{opacity: 1 - disparait, transform: `translateY(${disparait * 500}px)`}}>
          <Carte x={x} y={y} rot={rot} t={t} origine="50% 115%" z={i} />
        </div>
      );
    })}
  </>
);

export const Pub20Cartes: React.FC = () => {
  const t = useT();
  const doré: CSSProperties = {fontFamily: P.capitales, fontWeight: 700, color: C.or, textAlign: 'center', textShadow: '0 4px 20px rgba(0,0,0,0.5)'};
  const debut = t < 2.2;
  const finMelange = t >= 11.7;
  const eventail = prog(t, 0.9, 1.4);
  const rassemble = ease.inOut(prog(t, 9.4, 10.0));
  const grande = prog(t, 9.9, 10.5);
  const titre = (txt: string, a: number, b: number, top: number, taille = 84) => {
    const v = prog(t, a, a + 0.25) * (1 - prog(t, b - 0.25, b));
    return v > 0 ? <div style={{...doré, position: 'absolute', zIndex: 50, top, left: 120, right: 120, fontSize: taille, lineHeight: 1.1, opacity: v, transform: `scale(${mix(0.92, 1, v)})`}}>{txt}</div> : null;
  };

  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #17694B 0%, ${C.tapis} 55%, #082A1E 100%)`, overflow: 'hidden'}}>
      <svg width="1080" height="1920" style={{position: 'absolute', opacity: 0.35, mixBlendMode: 'overlay'}}>
        <filter id="p20feutre">
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="2" />
          <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1 0" />
        </filter>
        <rect width="1080" height="1920" filter="url(#p20feutre)" />
      </svg>

      {debut ? <Paquet t={t} tc={t + 0.3} eventail={eventail} sortis={prog(t, 1.6, 2.1)} /> : null}
      {finMelange ? <Paquet t={t} tc={t - 11.7} eventail={0} /> : null}

      {/* Quatre cartes qui sortent de l'éventail, puis se retournent une par une */}
      {t >= 1.5 && t < 10.5 ? (
        <>
          {PLACES.map(([px, py], i) => {
            const k = 4 + i * 1.5;
            const a = -54 + (k * 108) / (NB - 1);
            const sort = ease.inOut(prog(t, 1.5 + i * 0.1, 2.1 + i * 0.1));
            const flipT = 3.2 + i * 1.1;
            const f = ressort(t, flipT, 1.6, 6);
            const flip = clamp(f, 0, 1.15) * 180;
            const leve = Math.sin(clamp((t - flipT) / 0.5) * Math.PI) * 0.12;
            const fond = 8 < t && t < 9.5 ? 0.55 : 1;
            let x = mix(540, px, sort);
            let y = mix(1150, py, sort);
            let rot = mix(a, (i % 2 ? 3 : -3), sort);
            x = mix(x, 540, rassemble);
            y = mix(y, 960, rassemble);
            rot = mix(rot, 0, rassemble);
            return (
              <div key={i} style={{opacity: (t > 9.5 ? 1 - grande : 1) * (t >= 8 && t < 9.5 ? fond : 1)}}>
                <Carte x={x} y={y} rot={rot} flip={mix(flip, 180, rassemble)} s={1 + leve} t={t} face={<Face as={AS[i]} />} z={10 + i} />
              </div>
            );
          })}
        </>
      ) : null}

      {/* Grande carte dorée finale */}
      {t >= 9.9 && t < 11.75 ? <GrandeCarte t={t} /> : null}

      {titre('Choisis une carte.', -0.3, 1.9, 300, 92)}
      {titre("Tu l'as ?", 2.2, 3.2, 300, 92)}
      {titre('Quelle que soit ta carte, tu gagnes.', 8.0, 9.5, 230, 76)}
      <Bande n={20} />
    </AbsoluteFill>
  );
};

const GrandeCarte: React.FC<{t: number}> = ({t}) => {
  const ouvre = ease.outQuint(prog(t, 9.9, 10.4));
  const flip = mix(0, 180, ease.inOut(prog(t, 10.1, 10.6)));
  const sort = 1 - prog(t, 11.5, 11.75);
  const l = 840;
  const h = 1180;
  return (
    <div style={{position: 'absolute', left: 540 - l / 2, top: 360, width: l, height: h, transform: `scale(${mix(0.4, 1, ouvre)})`, opacity: sort}}>
      <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `perspective(2400px) rotateY(${flip}deg)`}}>
        <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 40, background: `linear-gradient(135deg, #8E6A2A, ${C.or} 35%, #F6E2A8 50%, ${C.or} 65%, #8E6A2A)`, boxShadow: '0 40px 80px rgba(0,0,0,0.5)'}} />
        <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 40, background: `linear-gradient(160deg, #F7E7B8, ${C.or} 55%, #B8913F)`, border: `8px solid ${C.carte}`, boxShadow: '0 40px 80px rgba(0,0,0,0.5)', overflow: 'hidden'}}>
          <div style={{position: 'absolute', top: -200, bottom: -200, width: 200, left: `${((t - 10.4) * 90) % 160 - 30}%`, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)', transform: 'skewX(-20deg)'}} />
          <FinJP
            t={t}
            s={{police: P.grotesk, couleur: C.noir, couleurNumero: C.dos, accent: C.dos, tailleNumero: 124, pastilleLogo: true, appel: 'Dis-nous ta carte en commentaire 👇', fleche: (rb) => (
              <svg width="110" height="110" viewBox="0 0 100 100" style={{transform: `translateY(${rb * 20 - 10}px)`}}>
                <path d="M50 8 V78 M18 50 L50 84 L82 50" fill="none" stroke={C.dos} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}}
            p={(i) => prog(t, 10.55 + i * 0.1, 10.85 + i * 0.1)}
            boite={{left: 40, right: 40, top: 150}}
            tailleTexte={56}
            ecart={28}
          />
        </div>
      </div>
    </div>
  );
};
