// 17. « Douala en miniature » — diorama tilt-shift (15 s).
// Maquette en CSS 3D (boîtes à faces ombrées), caméra virtuelle par images-clés, voiture animée à 12 images/s
// comme un stop-motion, vrai flou de bascule (bandes floues en haut et en bas) et saturation poussée.
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {Bande, clamp, ease, FlecheBas, hasard, LogoJP, mix, prog, ressort, saccade, useT} from './commun';
import {MOTION, POLICES_MOTION as P} from './config';

const C = {beige: '#E9DCC0', ocre: '#D9A65B', blanc: '#F6F2EA', vert: '#6CC46A', route: '#B9BCC0', ciel: '#BFE3FF', table: '#A57B52', socle: '#CFE2B4', eau: '#7CC7E8', sable: '#F1DDA8'};
const FACE = (c: string, k: number) => `color-mix(in srgb, ${c} ${Math.round(k * 100)}%, #1a1410)`;

// ── Primitives 3D (repère du sol : x vers la droite, y vers le spectateur, z vers le haut) ──
const Boite: React.FC<{x: number; y: number; l: number; p: number; h: number; c: string; fenetres?: boolean; z?: number; children?: ReactNode}> = ({x, y, l, p, h, c, fenetres, z = 0, children}) => {
  const motif = fenetres ? `repeating-linear-gradient(90deg, transparent 0 12px, rgba(70,110,140,0.55) 12px 22px), ` : '';
  const motifH = fenetres ? `repeating-linear-gradient(180deg, transparent 0 14px, ${FACE(c, 0.8)} 14px 24px), ` : '';
  const face = (k: number): CSSProperties => ({position: 'absolute', background: `${motifH}${motif}${FACE(c, k)}`, backfaceVisibility: 'visible'});
  return (
    <div style={{position: 'absolute', left: x - l / 2, top: y - p / 2, width: l, height: p, transformStyle: 'preserve-3d', transform: `translateZ(${z}px)`}}>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(30,20,10,0.35)', filter: 'blur(10px)', transform: 'translate(18px, -14px)'}} />
      <div style={{...face(0.78), left: 0, top: p, width: l, height: h, transformOrigin: 'top', transform: 'rotateX(90deg)'}} />
      <div style={{...face(0.62), left: l, top: 0, width: h, height: p, transformOrigin: 'left', transform: 'rotateY(-90deg)'}} />
      <div style={{...face(0.7), left: -h, top: 0, width: h, height: p, transformOrigin: 'right', transform: 'rotateY(90deg)'}} />
      <div style={{position: 'absolute', inset: 0, background: c, transform: `translateZ(${h}px)`, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.25)'}} />
      {children}
    </div>
  );
};

/** Plan vertical debout (pancarte, panneau), face au spectateur. */
const Debout: React.FC<{x: number; y: number; z?: number; l: number; h: number; children: ReactNode; s?: number}> = ({x, y, z = 0, l, h, children, s = 1}) => (
  <div style={{position: 'absolute', left: x - l / 2, top: y, width: l, height: 0, transformStyle: 'preserve-3d', transform: `translateZ(${z}px)`}}>
    <div style={{position: 'absolute', left: 0, bottom: 0, width: l, height: h, transformOrigin: 'bottom', transform: `rotateX(-90deg) scale(${s})`}}>{children}</div>
  </div>
);

const Palmier: React.FC<{x: number; y: number; k?: number}> = ({x, y, k = 1}) => (
  <>
    <div style={{position: 'absolute', left: x - 30 * k, top: y - 30 * k, width: 60 * k, height: 60 * k, borderRadius: '50%', background: 'rgba(30,40,10,0.35)', filter: 'blur(6px)', transform: 'translate(20px,-14px)'}} />
    <Boite x={x} y={y} l={8 * k} p={8 * k} h={70 * k} c="#8A6A44" />
    <div
      style={{
        position: 'absolute', left: x - 34 * k, top: y - 34 * k, width: 68 * k, height: 68 * k, transform: `translateZ(${70 * k}px)`,
        background: `conic-gradient(from 10deg, ${C.vert}, #4FA85A, ${C.vert}, #4FA85A, ${C.vert}, #4FA85A, ${C.vert})`,
        clipPath: 'polygon(50% 0, 60% 38%, 100% 30%, 64% 55%, 85% 100%, 50% 68%, 15% 100%, 36% 55%, 0 30%, 40% 38%)',
      }}
    />
  </>
);

const Etiquette: React.FC<{x: number; y: number; texte: string; s: number; large?: number}> = ({x, y, texte, s, large = 300}) => (
  <Debout x={x} y={y} l={large} h={150} s={clamp(s, 0, 1.3)}>
    <div style={{position: 'absolute', left: large / 2 - 4, bottom: 0, width: 8, height: 90, background: '#7B5B3A'}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: large, height: 64, background: '#FFFDF5', border: '4px solid #3A2E22', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: P.grotesk, fontWeight: 700, fontSize: 32, color: '#2B2219', whiteSpace: 'nowrap', boxShadow: '0 6px 0 rgba(0,0,0,0.2)'}}>
      {texte}
    </div>
  </Debout>
);

// ── Plan de la maquette ──
const IMMEUBLES = Array.from({length: 26}, (_, i) => {
  const cote = i % 2 ? 1 : -1;
  const y = 220 - Math.floor(i / 2) * 200 + hasard(i) * 40;
  const riviere = y < -380 && y > -720;
  const aero = y < -2250;
  if (riviere || aero) return null;
  return {
    x: cote * (190 + hasard(i + 50) * 150),
    y,
    l: 110 + hasard(i + 10) * 90,
    p: 110 + hasard(i + 20) * 70,
    h: 80 + hasard(i + 30) * (Math.abs(y) < 400 ? 300 : 180),
    c: [C.beige, C.ocre, C.blanc, '#E7C9A0', '#F0E6D2'][i % 5],
  };
}).filter((b): b is NonNullable<typeof b> => b !== null && !(b.x < 0 && b.x > -560 && b.y > -260));
const PALMIERS = [[-110, 120], [110, -160], [-110, -880], [110, -1150], [-110, -1500], [110, -1820], [-110, -2100], [-480, -1100], [-640, -1380], [420, 300], [-420, 360]];
const ETIQUETTES = [
  {texte: 'Akwa', x: -150, y: -60, cote: 0},
  {texte: 'Bonapriso', x: 170, y: -950, cote: 0},
  {texte: 'Bonamoussadi', x: -190, y: -1700, cote: 0},
];

// Voiture : position y (repère du sol) en fonction du temps
const yVoiture = (t: number) => {
  if (t >= 14.55) return 150;
  if (t < 1.5) return mix(150, 60, ease.in(prog(t, 0, 1.5)));
  if (t < 5) return mix(60, -2380, ease.inOut(prog(t, 1.5, 5)));
  return mix(-2380, -2560, ease.out(prog(t, 5, 6.2)));
};
const instantPassage = (y: number) => {
  for (let k = 0; k < 600; k++) if (yVoiture(k / 40) <= y + 120) return k / 40;
  return 99;
};

const Voiture: React.FC<{t: number}> = ({t}) => {
  const ts = saccade(t, 12);
  const y = yVoiture(ts);
  const vib = Math.floor(ts * 12) % 2 ? 1 : 0;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d', transform: `translate(${38}px, ${y}px) translateZ(${vib}px)`}}>
      <Boite x={0} y={0} l={52} p={96} h={20} c="#1B1D22" />
      <Boite x={0} y={6} l={44} p={48} h={16} z={20} c="#2B3442" />
      {[[-27, -30], [27, -30], [-27, 30], [27, 30]].map(([wx, wy], i) => (
        <Boite key={i} x={wx} y={wy} l={8} p={22} h={18} c="#0B0B0B" />
      ))}
      <div style={{position: 'absolute', left: -20, top: -50, width: 12, height: 6, background: '#FFF3B0', transform: 'translateZ(14px)', boxShadow: '0 0 12px #FFF3B0'}} />
      <div style={{position: 'absolute', left: 8, top: -50, width: 12, height: 6, background: '#FFF3B0', transform: 'translateZ(14px)', boxShadow: '0 0 12px #FFF3B0'}} />
    </div>
  );
};

// ── Caméra : images-clés (cible x, y, zoom, inclinaison, lacet) ──
type Cle = {t: number; x: number; y: number; z: number; inc: number; lacet: number};
const CLES: Cle[] = [
  {t: 0, x: 40, y: 60, z: 1.55, inc: 56, lacet: -8},
  {t: 1.5, x: 40, y: -20, z: 1.5, inc: 56, lacet: -4},
  {t: 5.0, x: 60, y: -2380, z: 1.35, inc: 58, lacet: 6},
  {t: 7.6, x: 200, y: -2640, z: 1.2, inc: 54, lacet: 12},
  {t: 9.0, x: -250, y: -1350, z: 0.42, inc: 46, lacet: 4},
  {t: 10.2, x: -330, y: -1280, z: 0.62, inc: 50, lacet: -6},
  {t: 11.2, x: -330, y: -1080, z: 1.5, inc: 66, lacet: 0},
  {t: 12.0, x: -330, y: -1080, z: 1.5, inc: 66, lacet: 0},
  {t: 13.0, x: -250, y: -160, z: 1.2, inc: 72, lacet: 0},
  {t: 14.5, x: -250, y: -160, z: 1.26, inc: 72, lacet: 0},
  {t: 14.95, x: 40, y: 60, z: 1.55, inc: 56, lacet: -8},
];
const camera = (t: number) => {
  // Pendant le trajet, la caméra suit la voiture
  if (t >= 1.5 && t < 5) {
    const y = yVoiture(t);
    return {x: mix(40, 60, prog(t, 1.5, 5)), y: y - 40, z: mix(1.5, 1.35, prog(t, 1.5, 5)), inc: mix(56, 58, prog(t, 1.5, 5)), lacet: mix(-4, 6, ease.inOut(prog(t, 1.5, 5)))};
  }
  let i = CLES.findIndex((k) => k.t > t) - 1;
  if (i < 0) i = CLES.length - 2;
  if (t >= CLES[CLES.length - 1].t) return CLES[CLES.length - 1];
  const a = CLES[i];
  const b = CLES[i + 1];
  const p = ease.inOut(prog(t, a.t, b.t));
  return {x: mix(a.x, b.x, p), y: mix(a.y, b.y, p), z: mix(a.z, b.z, p), inc: mix(a.inc, b.inc, p), lacet: mix(a.lacet, b.lacet, p)};
};

const Monde: React.FC<{t: number}> = ({t}) => {
  const allume = t >= 12.6 ? (t < 12.9 ? (Math.floor(t * 20) % 2 ? 1 : 0.3) : 1) : 0;
  return (
    <>
      {/* Table en bois et socle de la maquette */}
      <div style={{position: 'absolute', left: -1300, top: -3600, width: 2600, height: 4400, background: `repeating-linear-gradient(90deg, ${C.table} 0 60px, #9A7049 60px 64px, #AD845B 64px 140px)`, transform: 'translateZ(-30px)'}} />
      <div style={{position: 'absolute', left: -1000, top: -3300, width: 2000, height: 3800, background: C.socle, boxShadow: '0 0 0 14px #8F6B48'}} />
      {/* Fleuve Wouri et pont */}
      <div style={{position: 'absolute', left: -1000, top: -720, width: 2000, height: 330, background: `linear-gradient(180deg, ${C.eau}, #5DB3DB)`}} />
      {/* Routes */}
      <div style={{position: 'absolute', left: -75, top: -2350, width: 150, height: 2850, background: C.route}} />
      <div style={{position: 'absolute', left: -3, top: -2350, width: 6, height: 2850, background: 'repeating-linear-gradient(180deg, #fff 0 30px, transparent 30px 60px)'}} />
      <div style={{position: 'absolute', left: -940, top: -1300, width: 940, height: 130, background: C.route}} />
      <Boite x={0} y={-555} l={190} p={360} h={24} c="#D8D2C4" />
      {[-1, 1].map((s) => (
        <Boite key={s} x={s * 90} y={-555} l={8} p={360} h={18} z={24} c="#F2EEE6" />
      ))}
      {[-660, -450].map((y) => (
        <Boite key={y} x={0} y={y} l={160} p={30} h={60} z={-36} c="#BDB6A6" />
      ))}
      {/* Kribi : plage au bord de la table */}
      <div style={{position: 'absolute', left: -1000, top: -1700, width: 260, height: 900, background: C.sable}} />
      <div style={{position: 'absolute', left: -1000, top: -1700, width: 110, height: 900, background: `linear-gradient(90deg, #3FA9C9, ${C.eau})`}} />
      <Palmier x={-800} y={-1450} k={1.3} />
      <Palmier x={-820} y={-1050} k={1.1} />
      {/* Aéroport miniature */}
      <div style={{position: 'absolute', left: -500, top: -3150, width: 1300, height: 200, background: '#8E9296'}} />
      <div style={{position: 'absolute', left: -460, top: -3053, width: 1220, height: 6, background: 'repeating-linear-gradient(90deg, #fff 0 50px, transparent 50px 100px)'}} />
      <Boite x={300} y={-2720} l={460} p={140} h={90} c={C.blanc} fenetres />
      <Avion t={t} />
      {IMMEUBLES.map((b, i) => (
        <Boite key={i} x={b.x} y={b.y} l={b.l} p={b.p} h={b.h} c={b.c} fenetres />
      ))}
      {PALMIERS.map(([x, y], i) => (
        <Palmier key={i} x={x} y={y} />
      ))}
      {/* Étiquettes sur piquets, qui se lèvent au passage de la voiture */}
      {ETIQUETTES.map((e) => (
        <Etiquette key={e.texte} x={e.x} y={e.y} texte={e.texte} s={ressort(t, instantPassage(e.y), 2.4, 6)} large={e.texte.length * 21 + 50} />
      ))}
      <Etiquette x={300} y={-2600} texte="Aéroport · dès 8 000 F" s={ressort(t, 5.6, 2.4, 6)} large={430} />
      <Etiquette x={-760} y={-1180} texte="Kribi · Voyage 50 000 F/jour" s={ressort(t, 8.6, 2.4, 6)} large={520} />
      {/* Panneau des prix */}
      <Debout x={-330} y={-1000} l={560} h={300} s={clamp(ressort(t, 10.6, 2.2, 6), 0, 1.2)}>
        <div style={{position: 'absolute', left: 120, bottom: 0, width: 14, height: 110, background: '#6A4E33'}} />
        <div style={{position: 'absolute', right: 120, bottom: 0, width: 14, height: 110, background: '#6A4E33'}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: 560, height: 200, background: '#1F4E3D', border: '8px solid #F6F2EA', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: P.grotesk, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.15}}>
          <div style={{fontSize: 44}}>Éco 2 500 F/h</div>
          <div style={{fontSize: 40, color: '#FFE38A'}}>Confort 3 500 F/h (promo)</div>
        </div>
      </Debout>
      {/* Immeuble et panneau publicitaire sur le toit */}
      <Boite x={-250} y={-120} l={320} p={160} h={200} c={C.blanc} fenetres />
      <Debout x={-250} y={-60} z={200} l={640} h={330}>
        <div style={{position: 'absolute', left: 140, bottom: 0, width: 12, height: 50, background: '#333'}} />
        <div style={{position: 'absolute', right: 140, bottom: 0, width: 12, height: 50, background: '#333'}} />
        <div
          style={{
            position: 'absolute', left: 0, top: 0, width: 640, height: 280, background: '#14181F', border: '8px solid #2C323C', borderRadius: 10,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: P.grotesk, fontWeight: 700, textAlign: 'center',
            boxShadow: allume > 0.5 ? '0 0 50px rgba(255,240,180,0.6)' : 'none',
          }}
        >
          <div style={{fontSize: 40, color: '#fff', opacity: allume}}>
            {MOTION.ecris[0]}
            <span style={{color: '#FFE38A'}}>{MOTION.ecris[1]}</span>
            {MOTION.ecris[2]}
          </div>
          <div style={{fontSize: 30, color: '#FFE38A', opacity: allume, marginTop: 6}}>{MOTION.indicatif}</div>
          <div style={{fontSize: 92, color: '#FFE38A', opacity: allume, lineHeight: 1, whiteSpace: 'nowrap'}}>{MOTION.numero}</div>
        </div>
      </Debout>
      <Voiture t={t} />
    </>
  );
};

const Avion: React.FC<{t: number}> = ({t}) => {
  const roule = ease.in(prog(t, 6.0, 8.5));
  const x = mix(-300, 500, roule);
  const z = Math.max(0, roule - 0.6) * 300;
  return (
    <div style={{position: 'absolute', left: x, top: -3050, transformStyle: 'preserve-3d', transform: `translateZ(${z + 6}px)`}}>
      <Boite x={0} y={0} l={180} p={30} h={30} c="#F4F4F4" />
      <Boite x={10} y={0} l={50} p={190} h={8} z={14} c="#DDE3EA" />
      <Boite x={-80} y={0} l={24} p={70} h={6} z={22} c="#DDE3EA" />
      <Boite x={-80} y={0} l={24} p={8} h={46} z={22} c="#5D8FB8" />
    </div>
  );
};

export const Pub17Miniature: React.FC = () => {
  const t = useT();
  const cam = camera(t);
  const fin = prog(t, 12.9, 13.3) * (1 - prog(t, 14.45, 14.7));
  const rebond = Math.abs(Math.sin(t * Math.PI * 2.2));
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.ciel}, #E8F4FF)`, overflow: 'hidden'}}>
      <AbsoluteFill style={{perspective: 1500, perspectiveOrigin: '50% 35%', filter: 'saturate(1.25) contrast(1.04)'}}>
        <div
          style={{
            position: 'absolute', left: 540, top: 1050, width: 0, height: 0, transformStyle: 'preserve-3d',
            transform: `rotateX(${cam.inc}deg) rotateZ(${cam.lacet}deg) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`,
          }}
        >
          <Monde t={t} />
        </div>
      </AbsoluteFill>
      {/* Tilt-shift : flou fort en haut et en bas, bande nette au centre */}
      <AbsoluteFill style={{opacity: 1 - 0.75 * fin, backdropFilter: 'blur(14px)', WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 12%, transparent 36%, transparent 64%, #000 86%, #000 100%)'}} />
      <AbsoluteFill style={{backdropFilter: 'blur(6px)', WebkitMaskImage: 'linear-gradient(180deg, transparent 18%, #000 28%, transparent 40%, transparent 60%, #000 74%, transparent 84%)'}} />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(40,60,80,0.35)'}} />

      {t < 1.6 ? (
        <div style={{position: 'absolute', top: 250, left: 120, right: 120, textAlign: 'center', fontFamily: P.grotesk, fontWeight: 700, fontSize: 92, lineHeight: 1.05, color: '#fff', textShadow: '0 6px 30px rgba(20,40,70,0.55)', opacity: clamp(t * 20) * (1 - prog(t, 1.3, 1.6))}}>
          Douala, <span style={{color: '#FFE38A'}}>en miniature.</span>
        </div>
      ) : null}

      {fin > 0 ? (
        <div style={{position: 'absolute', left: 120, right: 120, top: 1240, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: fin, transform: `translateY(${(1 - fin) * 40}px)`}}>
          <FlecheBas couleur="#FFE38A" rebond={rebond} taille={120} />
          <div style={{fontFamily: P.grotesk, fontWeight: 700, fontSize: 72, color: '#fff', textShadow: '0 6px 26px rgba(20,40,70,0.6)'}}>{MOTION.reserve}</div>
          <LogoJP largeur={300} pastille />
        </div>
      ) : null}
      <Bande n={17} />
    </AbsoluteFill>
  );
};
