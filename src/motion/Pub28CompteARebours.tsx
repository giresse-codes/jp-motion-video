// 28. « 3… 2… 1… » — compte à rebours écrasé, style néo-brutaliste (15 s).
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {Bande, clamp, ease, hasard, LogoJP, mix, prog, useT, Voiture} from './commun';
import {MOTION, POLICES_MOTION as P} from './config';

const C = {blanc: '#FFFFFF', noir: '#0A0A0A', jaune: '#FFD000', gris: '#E9E9E9'};
const BORD = 8;
const SOL = 1250; // bas des chiffres
export const CHUTES_28 = [0.45, 1.9, 3.4]; // impacts des « 3 », « 2 », « 1 »
const DUREE_CHUTE = 0.6;

const ombre = (d = 16): CSSProperties => ({boxShadow: `${d}px ${d}px 0 ${C.jaune}`, border: `${BORD}px solid ${C.noir}`});

/** Hauteur au-dessus du sol pendant la chute (gravité) puis petits rebonds amortis ; squash à l'impact. */
const chute = (t: number, impact: number) => {
  const d = t - impact;
  if (d < 0) {
    const k = clamp(1 + d / DUREE_CHUTE); // 0 en haut, 1 au sol
    return {y: -(1 - k * k) * 900, sx: 1 - (1 - k) * 0.1, sy: 1 + (1 - k) * 0.15};
  }
  const rebond = Math.abs(Math.sin(d * 9)) * 120 * Math.exp(-d * 6);
  const ecrase = Math.exp(-d * 14) * 0.28;
  return {y: -rebond, sx: 1 + ecrase, sy: 1 - ecrase};
};

const Chiffre: React.FC<{txt: string; y: number; sx: number; sy: number; x?: number; r?: number; clip?: string; o?: number}> = ({txt, y, sx, sy, x = 0, r = 0, clip, o = 1}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: SOL - 900, height: 900, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${sx}, ${sy})`, transformOrigin: '50% 100%', clipPath: clip, opacity: o}}>
    <div style={{fontFamily: P.grotesk, fontWeight: 700, fontSize: 1000, lineHeight: 0.78, color: C.noir, WebkitTextStroke: `${BORD}px ${C.noir}`, textShadow: `34px 34px 0 ${C.jaune}`}}>{txt}</div>
  </div>
);

// Éclats : le chiffre découpé en 9 morceaux (grille déformée), chacun projeté avec gravité
const MORCEAUX = Array.from({length: 9}, (_, i) => {
  const c = i % 3;
  const l = Math.floor(i / 3);
  const j = (k: number) => (hasard(i * 7 + k) - 0.5) * 8;
  const x0 = c * 33.3 + (c ? j(1) : 0);
  const x1 = (c + 1) * 33.3 + (c < 2 ? j(2) : 0);
  const y0 = l * 33.3 + (l ? j(3) : 0);
  const y1 = (l + 1) * 33.3 + (l < 2 ? j(4) : 0);
  return {clip: `polygon(${x0}% ${y0}%, ${x1}% ${y0 + j(5)}%, ${x1}% ${y1}%, ${x0}% ${y1 + j(6)}%)`, vx: (c - 1) * 700 + j(7) * 60, vy: -900 - hasard(i) * 700, vr: j(8) * 60};
});
const Eclats: React.FC<{txt: string; d: number}> = ({txt, d}) => (
  <>
    {MORCEAUX.map((m, i) => (
      <Chiffre key={i} txt={txt} clip={m.clip} x={m.vx * d} y={m.vy * d + 2600 * d * d} r={m.vr * d * 10} sx={1} sy={1} o={1 - clamp((d - 0.5) * 2)} />
    ))}
  </>
);

const Etiquette: React.FC<{x: number; y: number; t0: number; t: number; children: ReactNode; r: number}> = ({x, y, t0, t, children, r}) => {
  const c = chute(t, t0);
  if (t < t0 - DUREE_CHUTE) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y + c.y * 0.9, width: 400, padding: '22px 0', textAlign: 'center', background: C.blanc, ...ombre(14), fontFamily: P.grotesk, fontWeight: 700, fontSize: 46, lineHeight: 1.05, color: C.noir, transform: `rotate(${r}deg) scale(${c.sx}, ${c.sy})`}}>
      {children}
    </div>
  );
};

export const Pub28CompteARebours: React.FC = () => {
  const t = useT();
  const fin = t >= 14.7;
  const th = fin ? t - 15 : t;
  // Voiture : glisse de la droite (4,5 s), pousse le « 1 », freine net (5,3 s)
  const arrivee = ease.out(prog(t, 4.5, 5.3));
  const vx = mix(1500, 540, arrivee);
  const plonge = t >= 5.25 && t < 5.8 ? Math.sin(((t - 5.25) / 0.55) * Math.PI) * -3 : 0;
  const pousse = Math.max(0, 540 + 470 - vx); // le « 1 » est poussé quand l'avant de la voiture l'atteint
  const etiquettesSortent = ease.in(prog(t, 10.2, 10.6));
  const cta = t >= 10.4 && !fin ? prog(t, 10.4, 10.7) * (1 - prog(t, 14.45, 14.7)) : 0;
  const rebond = Math.abs(Math.sin(t * Math.PI * 2.2));

  const chiffres: ReactNode[] = [];
  if (th < CHUTES_28[1]) {
    const c = chute(th, CHUTES_28[0]);
    chiffres.push(<Chiffre key="3" txt="3" {...c} />);
  } else if (t < CHUTES_28[1] + 1) chiffres.push(<Eclats key="e3" txt="3" d={t - CHUTES_28[1]} />);
  if (t >= CHUTES_28[1] - DUREE_CHUTE && t < CHUTES_28[2] && !fin) chiffres.push(<Chiffre key="2" txt="2" {...chute(t, CHUTES_28[1])} />);
  else if (t >= CHUTES_28[2] && t < CHUTES_28[2] + 1) chiffres.push(<Eclats key="e2" txt="2" d={t - CHUTES_28[2]} />);
  if (t >= CHUTES_28[2] - DUREE_CHUTE && t < 6 && !fin) {
    const c = chute(t, CHUTES_28[2]);
    chiffres.push(<Chiffre key="1" txt="1" {...c} x={-pousse} r={-pousse * 0.05} />);
  }

  const titre: CSSProperties = {position: 'absolute', left: 120, right: 120, textAlign: 'center', fontFamily: P.grotesk, fontWeight: 700, color: C.noir};
  return (
    <AbsoluteFill style={{background: C.blanc, overflow: 'hidden'}}>
      {/* Trame de points discrète */}
      <AbsoluteFill style={{backgroundImage: `radial-gradient(${C.gris} 3px, transparent 3px)`, backgroundSize: '44px 44px'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: SOL, height: BORD, background: C.noir, opacity: t < 10.4 || fin ? 1 : 0}} />
      {chiffres}
      {(th < 4.5 || fin) ? <div style={{...titre, top: 210, fontSize: 56, zIndex: 5}}><span style={{background: C.blanc, padding: '4px 14px', border: `4px solid ${C.noir}`}}>Ton chauffeur arrive dans…</span></div> : null}

      {/* Voiture */}
      {t >= 4.5 && t < 10.6 ? (
        <div style={{position: 'absolute', left: vx - 430, top: SOL - 395, transform: `rotate(${plonge}deg) translateY(${etiquettesSortent * 900}px)`, transformOrigin: '20% 100%'}}>
          <div style={{position: 'absolute', left: 60, right: 60, bottom: -10, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', filter: 'blur(8px)'}} />
          <Voiture largeur={860} />
          {t < 5.6 ? <div style={{position: 'absolute', left: 860, top: 330, width: 200 * (1 - prog(t, 5.0, 5.6)), height: 12, background: C.noir, opacity: 0.25}} /> : null}
        </div>
      ) : null}
      {t >= 5.4 && t < 10.5 ? <div style={{...titre, top: 300, fontSize: 150, opacity: prog(t, 5.4, 5.55)}}><span style={{background: C.jaune, padding: '0 24px', ...ombre(12)}}>Déjà là.</span></div> : null}

      {/* Étiquettes qui tombent autour de la voiture */}
      {t >= 5.6 && t < 10.7 ? (
        <AbsoluteFill style={{transform: `translateY(${etiquettesSortent * 1400}px)`}}>
          <Etiquette x={120} y={560} t0={6.4} t={t} r={-3}>ÉCO<br />2 500 F/h</Etiquette>
          <Etiquette x={560} y={600} t0={7.2} t={t} r={2}>CONFORT<br />3 500 F/h</Etiquette>
          <Etiquette x={120} y={1330} t0={8.0} t={t} r={2}>AÉROPORT<br />dès 8 000 F</Etiquette>
          <Etiquette x={560} y={1360} t0={8.8} t={t} r={-2}>VOYAGE<br />50 000 F/jour</Etiquette>
        </AbsoluteFill>
      ) : null}

      {/* Appel à l'action : reste jusqu'à la fin */}
      {cta > 0 ? (
        <AbsoluteFill style={{opacity: cta}}>
          <div style={{position: 'absolute', left: 120, right: 120, top: 330, padding: '34px 30px', background: C.jaune, ...ombre(18), textAlign: 'center', fontFamily: P.grotesk, fontWeight: 700, fontSize: 56, whiteSpace: 'nowrap', color: C.noir, transform: `scale(${mix(0.7, 1, ease.back(prog(t, 10.5, 10.8)))})`}}>
            Écris «&nbsp;JP&nbsp;» sur WhatsApp
          </div>
          <div style={{position: 'absolute', left: 60, right: 60, top: 560, textAlign: 'center', fontFamily: P.grotesk, fontWeight: 700, color: C.noir, opacity: prog(t, 10.7, 10.9)}}>
            <div style={{fontSize: 90}}>{MOTION.indicatif}</div>
            <div style={{fontSize: 170, lineHeight: 0.95, letterSpacing: -6, whiteSpace: 'nowrap', textShadow: `10px 10px 0 ${C.jaune}`}}>{MOTION.numero}</div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, opacity: prog(t, 10.9, 11.1)}}>
            <svg width="190" height="200" viewBox="0 0 100 106" style={{transform: `translateY(${rebond * 26 - 13}px)`, filter: `drop-shadow(12px 12px 0 ${C.jaune})`}}>
              <path d="M34 4 H66 V54 H90 L50 100 L10 54 H34 Z" fill={C.noir} />
            </svg>
            <div style={{fontFamily: P.grotesk, fontWeight: 700, fontSize: 72, color: C.noir}}>{MOTION.reserve}</div>
            <LogoJP largeur={300} pastille />
          </div>
        </AbsoluteFill>
      ) : null}
      <Bande n={28} />
    </AbsoluteFill>
  );
};
