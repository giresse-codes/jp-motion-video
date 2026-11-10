// 23. « 4 services. 1 numéro. » — chiffres précis, coupes sur le temps (128 BPM), 15 s.
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {Bande, clamp, ease, FlecheBas, hasard, LogoJP, mix, prog, ressort, useT} from './commun';
import {MOTION, POLICES_MOTION as P} from './config';

const C = {fond: '#0A1230', blanc: '#FFFFFF', jaune: '#FFD23F', cyan: '#3DD6F5', ombre: '#1B2A66'};
export const TEMPS_23 = 60 / 128; // un temps
const b = (k: number) => k * TEMPS_23;
const RETOURNE = [b(3), b(5), b(7), b(9)];
export const TAPE_23 = 10.6; // début de frappe du numéro ; un chiffre par demi-temps
const NUMERO = MOTION.numeroComplet; // « +237 655 394 028 »

/** Chiffre « 3D » : extrusion par ombres empilées + face avant dégradée. */
const Chiffre3D: React.FC<{txt: string; taille: number; style?: CSSProperties; couleur?: string}> = ({txt, taille, style, couleur = C.blanc}) => {
  const prof = Math.round(taille / 40);
  const ombres = Array.from({length: prof}, (_, i) => `${i + 1}px ${i + 1}px 0 ${C.ombre}`).join(', ');
  const base: CSSProperties = {fontFamily: P.grotesk, fontWeight: 700, fontSize: taille, lineHeight: 0.9, letterSpacing: -taille * 0.03};
  return (
    <div style={{position: 'relative', ...style}}>
      <div style={{...base, color: C.ombre, textShadow: `${ombres}, ${prof + 10}px ${prof + 20}px 40px rgba(0,0,0,0.6)`}}>{txt}</div>
      <div style={{...base, position: 'absolute', inset: 0, background: `linear-gradient(170deg, #ffffff 0%, ${couleur} 45%, #9fb3e8 100%)`, WebkitBackgroundClip: 'text', color: 'transparent'}}>{txt}</div>
    </div>
  );
};

const ICONES: Record<string, ReactNode> = {
  voiture: <path d="M8 60 L16 40 Q20 30 32 30 L68 30 Q78 30 84 40 L92 60 L92 72 L8 72 Z M24 72 a8 8 0 1 0 0.1 0 M76 72 a8 8 0 1 0 0.1 0" />,
  etoile: <path d="M50 8 L62 38 L94 38 L68 58 L78 90 L50 70 L22 90 L32 58 L6 38 L38 38 Z" />,
  avion: <path d="M50 6 Q56 6 56 18 L56 40 L94 60 L94 68 L56 58 L56 80 L68 88 L68 94 L50 90 L32 94 L32 88 L44 80 L44 58 L6 68 L6 60 L44 40 L44 18 Q44 6 50 6 Z" />,
  palmier: <path d="M48 94 Q46 70 52 40 M52 40 Q30 30 12 44 M52 40 Q70 26 90 40 M52 40 Q40 18 22 16 M52 40 Q64 14 82 16" fill="none" strokeWidth="9" strokeLinecap="round" />,
};
const CARTES = [
  {nom: 'ÉCO', prix: '2 500 F/h', ic: 'voiture'},
  {nom: 'CONFORT', prix: '3 500 F/h', ic: 'etoile'},
  {nom: 'AÉROPORT', prix: '8 000 F', ic: 'avion'},
  {nom: 'VOYAGE', prix: '50 000 F/jour', ic: 'palmier'},
];

const Carte: React.FC<{i: number; t: number}> = ({i, t}) => {
  const c = CARTES[i];
  const flip = clamp(ressort(t, RETOURNE[i], 2.2, 7), 0, 1.15) * 180;
  const face: CSSProperties = {position: 'absolute', inset: 0, borderRadius: 34, backfaceVisibility: 'hidden', display: 'flex', alignItems: 'center', padding: '0 40px', gap: 34};
  return (
    <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `perspective(1600px) rotateX(${180 - flip}deg)`}}>
      <div style={{...face, transform: 'rotateX(180deg)', background: 'linear-gradient(160deg, #1A2A66, #0F1A44)', border: `3px solid ${C.cyan}55`, justifyContent: 'center'}}>
        <div style={{fontFamily: P.grotesk, fontWeight: 700, fontSize: 120, color: `${C.cyan}`, opacity: 0.4}}>{i + 1}</div>
      </div>
      <div style={{...face, background: 'linear-gradient(160deg, #FFFFFF, #E4ECFF)', boxShadow: '0 24px 50px rgba(0,0,0,0.45)'}}>
        <svg width="130" height="130" viewBox="0 0 100 100" style={{flex: '0 0 130px', fill: C.fond, stroke: C.fond}}>
          {ICONES[c.ic]}
        </svg>
        <div>
          <div style={{fontFamily: P.grotesk, fontWeight: 700, fontSize: 46, color: '#4A5888', letterSpacing: 3}}>{c.nom}</div>
          <div style={{fontFamily: P.grotesk, fontWeight: 700, fontSize: i === 3 ? 84 : 100, color: C.fond, lineHeight: 1, letterSpacing: -2}}>{c.prix}</div>
        </div>
      </div>
    </div>
  );
};

export const Pub23QuatreServices: React.FC = () => {
  const t = useT();
  const fin = t >= 14.7;
  const th = fin ? t - 15 : t; // le « 4 » retombe sur la fin, comme à l'image 0
  // Chute du « 4 » : impact à 0,3 s
  const chute = clamp((th + 0.3) / 0.6);
  const y4 = mix(-900, 0, chute * chute);
  const impact = th >= 0.3 ? Math.exp(-(th - 0.3) * 7) : 0;
  const choc = impact * 26;
  const shakeX = Math.sin(t * 90) * choc;
  const shakeY = Math.cos(t * 70) * choc;
  const ecrase = th >= 0.3 ? Math.sin(Math.min(1, (th - 0.3) / 0.25) * Math.PI) * 0.18 : 0;
  const quatre = !fin ? 1 - prog(t, 1.2, 1.5) : 1;

  const cartesVis = t >= 1.2 && t < 7.0;
  const empile = ease.inOut(prog(t, 6.0, 6.5));
  const compresse = ease.in(prog(t, 6.45, 6.75));
  const un = t >= 6.7 && t < 10.6 ? 1 : 0;
  const bulle = ease.back(prog(t, 8.0, 8.5));
  const cta = t >= 10.4 && !fin;
  const nTape = Math.max(0, Math.min(NUMERO.replace(/ /g, '').length, Math.floor((t - TAPE_23) / (TEMPS_23 / 2)) + 1));
  // Numéro tapé chiffre par chiffre (les espaces suivent)
  let compte = 0;
  const numeroTape = [...NUMERO].filter((ch) => (ch === ' ' ? compte < nTape : ++compte <= nTape)).join('');

  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, #16245A, ${C.fond} 70%)`, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${shakeX}px, ${shakeY}px)`}}>
        {/* Le « 4 » géant */}
        {quatre > 0 ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', transform: `translateY(${y4}px) scale(${1 + ecrase}, ${1 - ecrase})`, transformOrigin: '50% 100%', opacity: quatre}}>
            <Chiffre3D txt="4" taille={1000} />
          </div>
        ) : null}
        {/* Poussière lumineuse à l'impact */}
        {th >= 0.3 && th < 1.3
          ? Array.from({length: 40}).map((_, i) => {
              const k = (th - 0.3) / 1.0;
              const a = hasard(i) * Math.PI;
              const v = 200 + hasard(i + 9) * 600;
              return <div key={i} style={{position: 'absolute', left: 540 + Math.cos(a) * v * k * (i % 2 ? 1 : -1), top: 1300 - Math.sin(a) * v * k * 0.6 + k * k * 200, width: 10, height: 10, borderRadius: 5, background: i % 3 ? C.cyan : C.jaune, opacity: 1 - k, boxShadow: `0 0 16px ${C.cyan}`}} />;
            })
          : null}
        {th < 1.6 ? (
          <div style={{position: 'absolute', left: 120, right: 120, top: 1500, textAlign: 'center', fontFamily: P.grotesk, fontWeight: 700, fontSize: 110, color: C.jaune, opacity: clamp((th - 0.08) * 12) * (fin ? 1 : 1 - prog(t, 1.2, 1.5))}}>4 services.</div>
        ) : null}

        {/* Les 4 cartes */}
        {cartesVis
          ? [0, 1, 2, 3].map((i) => {
              const sortie = ease.out(prog(t, 1.2 + i * 0.05, 1.6 + i * 0.05));
              const yRang = 300 + i * 290;
              const y = mix(mix(820, yRang, sortie), 820, empile);
              const s = mix(0.4, 1, sortie) * mix(1, 0.6, compresse);
              return (
                <div key={i} style={{position: 'absolute', left: 120, width: 840, top: y, height: 250, transform: `scale(${s}, ${s * (1 - compresse * 0.7)}) rotate(${(1 - sortie) * (i - 1.5) * 20 + empile * (i - 1.5) * 3}deg)`, opacity: 1 - compresse}}>
                  <Carte i={i} t={t} />
                </div>
              );
            })
          : null}

        {/* Le « 1 » géant, puis la bulle WhatsApp */}
        {un ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', transform: `scale(${mix(0.3, 1, ease.back(prog(t, 6.7, 7.0)))}) scale(${1 - bulle})`, opacity: 1 - bulle}}>
            <Chiffre3D txt="1" taille={1000} couleur={C.jaune} />
          </div>
        ) : null}
        {t >= 7.0 && t < 8.2 ? <div style={{position: 'absolute', left: 120, right: 120, top: 1500, textAlign: 'center', fontFamily: P.grotesk, fontWeight: 700, fontSize: 110, color: C.jaune, opacity: prog(t, 7.0, 7.15) * (1 - prog(t, 7.95, 8.2))}}>1 numéro.</div> : null}
        {t >= 8.0 && t < 10.7 ? (
          <AbsoluteFill style={{opacity: 1 - prog(t, 10.4, 10.7)}}>
            <div style={{position: 'absolute', left: 290, top: 620, width: 500, height: 500, transform: `scale(${bulle})`}}>
              <svg width="500" height="500" viewBox="0 0 100 100">
                <path d="M50 6 A44 44 0 1 1 22 86 L8 94 L14 78 A44 44 0 0 1 50 6 Z" fill={C.blanc} />
                <path d="M34 30 Q30 40 40 54 Q52 70 66 70 L72 64 L64 56 L58 60 Q48 54 42 44 L46 38 L40 28 Z" fill={C.fond} />
              </svg>
            </div>
            {['0 stress', '1 message', "✓ à l'heure"].map((l, i) => {
              const a = (t - 8.2) * 1.6 + (i * 2 * Math.PI) / 3;
              const p = prog(t, 8.3 + i * 0.25, 8.6 + i * 0.25);
              return (
                <div key={l} style={{position: 'absolute', left: 540 + Math.cos(a) * 400 - 170, top: 870 + Math.sin(a) * 420 - 45, width: 340, textAlign: 'center', padding: '18px 0', borderRadius: 50, background: i === 1 ? C.jaune : C.cyan, color: C.fond, fontFamily: P.grotesk, fontWeight: 700, fontSize: 52, opacity: p, transform: `scale(${mix(0.5, 1, p)})`}}>
                  {l}
                </div>
              );
            })}
          </AbsoluteFill>
        ) : null}

        {/* Appel à l'action : le numéro se tape chiffre par chiffre, puis reste */}
        {cta ? (
          <AbsoluteFill style={{opacity: prog(t, 10.4, 10.6) * (1 - prog(t, 14.45, 14.7))}}>
            <div style={{position: 'absolute', left: 120, right: 120, top: 470, textAlign: 'center', fontFamily: P.grotesk, fontWeight: 700, fontSize: 64, color: C.blanc}}>
              {MOTION.ecris[0]}
              <span style={{color: C.jaune}}>{MOTION.ecris[1]}</span>
              {MOTION.ecris[2]}
            </div>
            <div style={{position: 'absolute', left: 60, right: 60, top: 620, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Chiffre3D txt={numeroTape.slice(0, 4) || ' '} taille={110} couleur={C.cyan} />
              <div style={{height: 20}} />
              <Chiffre3D txt={numeroTape.slice(5) || ' '} taille={168} couleur={C.jaune} />
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: prog(t, 11.0, 11.3)}}>
              <FlecheBas couleur={C.jaune} rebond={Math.abs(Math.sin(t * Math.PI * (128 / 60)))} taille={120} />
              <div style={{fontFamily: P.grotesk, fontWeight: 700, fontSize: 66, color: C.blanc}}>{MOTION.reserve}</div>
              <LogoJP largeur={300} />
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      {/* Flash à l'impact */}
      {th >= 0.3 && th < 0.45 ? <AbsoluteFill style={{background: '#fff', opacity: (0.45 - th) * 4}} /> : null}
      <Bande n={23} />
    </AbsoluteFill>
  );
};
