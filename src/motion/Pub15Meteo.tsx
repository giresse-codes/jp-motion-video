// 15. « Bulletin météo » (12 s) : orage, essuie-glace géant, grand soleil.
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {Bande, clamp, ease, FinJP, hasard, mix, prog, ressort, useT} from './commun';
import {POLICES_MOTION as P, TARIFS} from './config';

const C = {orage: '#1C2A4A', orage2: '#33456B', clair: '#7FB8F0', clair2: '#D4EAFB', soleil: '#FFC93C', blanc: '#FFFFFF'};
const PIVOT = {x: 540, y: 2080};
const ECLAIRS = [0, 11.9];

const Pluie: React.FC<{t: number}> = ({t}) => (
  <svg width="1080" height="1920" style={{position: 'absolute'}}>
    {[0, 1, 2].map((couche) => {
      const n = [70, 55, 35][couche];
      const vit = [1500, 2100, 2800][couche];
      const lg = [28, 46, 70][couche];
      const op = [0.25, 0.4, 0.6][couche];
      return Array.from({length: n}).map((_, i) => {
        const k = couche * 1000 + i;
        const x0 = hasard(k) * 1300 - 110;
        const y = ((hasard(k + 0.5) * 2200 + t * vit) % 2200) - 140;
        const x = x0 - y * 0.18;
        return <line key={k} x1={x} y1={y} x2={x - lg * 0.18} y2={y + lg} stroke="#CFE0FF" strokeWidth={couche + 1.5} strokeLinecap="round" opacity={op} />;
      });
    })}
  </svg>
);

const Eclair: React.FC<{t: number}> = ({t}) => {
  const e = ECLAIRS.map((te) => t - te).find((d) => d >= 0 && d < 0.14);
  if (e === undefined) return null;
  const flash = e < 0.034 ? 0.6 : e < 0.067 ? 0.35 : 0;
  return (
    <>
      <svg width="1080" height="1920" style={{position: 'absolute'}}>
        <path d="M640 -20 L560 330 L640 350 L500 760 L590 780 L430 1220" stroke="#fff" strokeWidth={14} fill="none" strokeLinejoin="bevel" style={{filter: 'drop-shadow(0 0 30px #9fc4ff) drop-shadow(0 0 60px #6fa0ff)'}} />
        <path d="M560 330 L470 520 M590 780 L700 960" stroke="#fff" strokeWidth={6} fill="none" opacity={0.8} />
      </svg>
      <AbsoluteFill style={{background: '#E8F0FF', opacity: flash}} />
    </>
  );
};

const Verre: React.FC<{style?: CSSProperties; children: ReactNode}> = ({style, children}) => (
  <div
    style={{
      position: 'absolute', left: 120, right: 120, borderRadius: 44, padding: '44px 48px',
      background: 'linear-gradient(150deg, rgba(255,255,255,0.32), rgba(255,255,255,0.12))',
      border: '2px solid rgba(255,255,255,0.45)', backdropFilter: 'blur(26px) saturate(1.3)',
      boxShadow: '0 30px 60px rgba(10,20,50,0.35), inset 0 1px 0 rgba(255,255,255,0.6)', ...style,
    }}
  >
    {children}
  </div>
);

const IconePluie: React.FC<{t: number}> = ({t}) => (
  <svg width="220" height="200" viewBox="0 0 220 200">
    {[0, 1, 2, 3].map((i) => {
      const y = ((t * 180 + i * 37) % 70) + 120;
      return <line key={i} x1={60 + i * 34} y1={y} x2={54 + i * 34} y2={y + 22} stroke="#BFE0FF" strokeWidth={9} strokeLinecap="round" opacity={1 - (y - 120) / 70} />;
    })}
    <path d="M50 120 a40 40 0 0 1 10 -78 a52 52 0 0 1 98 6 a36 36 0 0 1 12 72 Z" fill="#E9F1FB" />
  </svg>
);

const Soleil: React.FC<{t: number; taille: number}> = ({t, taille}) => (
  <svg width={taille} height={taille} viewBox="-100 -100 200 200" style={{overflow: 'visible'}}>
    <g transform={`rotate(${t * 20})`}>
      {Array.from({length: 12}).map((_, i) => (
        <rect key={i} x="-6" y="-96" width="12" height="28" rx="6" fill={C.soleil} transform={`rotate(${i * 30})`} />
      ))}
    </g>
    <circle r="56" fill={C.soleil} />
    <circle r="56" fill="url(#p15s)" />
    <defs>
      <radialGradient id="p15s" cx="35%" cy="30%">
        <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

const Horloge: React.FC<{t: number}> = ({t}) => (
  <svg width="84" height="84" viewBox="-50 -50 100 100">
    <circle r="42" fill="none" stroke="#fff" strokeWidth="8" />
    <line y2="-26" stroke={C.soleil} strokeWidth="8" strokeLinecap="round" transform={`rotate(${t * 360})`} />
    <line y2="-18" stroke="#fff" strokeWidth="8" strokeLinecap="round" transform={`rotate(${t * 30})`} />
  </svg>
);
const Thermo: React.FC<{p: number}> = ({p}) => (
  <svg width="84" height="84" viewBox="0 0 100 100">
    <rect x="38" y="8" width="24" height="60" rx="12" fill="none" stroke="#fff" strokeWidth="7" />
    <circle cx="50" cy="78" r="16" fill="#8FD3FF" />
    <rect x="45" y={68 - p * 48} width="10" height={p * 48 + 4} fill="#8FD3FF" />
  </svg>
);
const Wifi: React.FC<{t: number}> = ({t}) => (
  <svg width="84" height="84" viewBox="0 0 100 100">
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${50 - 14 - i * 14} ${72 - 10 - i * 12} a${14 + i * 14} ${14 + i * 14} 0 0 1 ${2 * (14 + i * 14)} 0`} fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity={Math.floor(t * 4) % 4 > i ? 1 : 0.3} />
    ))}
    <circle cx="50" cy="76" r="7" fill="#fff" />
  </svg>
);

export const Pub15Meteo: React.FC = () => {
  const t = useT();
  // Essuie-glace : balaie de -80° à +80° (3,5 – 4,6 s), puis revient au repos
  const balai = ease.inOut(prog(t, 3.5, 4.6));
  const retourBalai = ease.inOut(prog(t, 4.6, 5.2));
  const phi = mix(-82, 82, balai) + retourBalai * 0;
  const balaiVisible = t >= 3.45 && t < 5.25;
  const phiAff = t < 4.6 ? phi : mix(82, 100, retourBalai);
  // Ciel dégagé : révélé derrière l'essuie-glace ; l'orage revient sur la dernière demi-seconde (boucle)
  const retourOrage = prog(t, 11.6, 11.85);
  const ouvert = t < 3.5 ? 0 : t < 4.6 ? balai * 164 + 6 : 360;
  const masque = t >= 4.6 ? 'none' : `conic-gradient(from -90deg at ${PIVOT.x}px ${PIVOT.y}px, #000 0deg, #000 ${ouvert}deg, transparent ${ouvert + 0.3}deg)`;
  const masqueInverse = t >= 4.6 ? 'linear-gradient(transparent, transparent)' : `conic-gradient(from -90deg at ${PIVOT.x}px ${PIVOT.y}px, transparent 0deg, transparent ${ouvert}deg, #000 ${ouvert + 0.3}deg)`;
  const lever = ease.out(prog(t, 4.2, 5.4));

  const carte1 = prog(t, 1.0, 1.35) * (1 - prog(t, 3.3, 3.55));
  const carte2 = prog(t, 5.0, 5.4) * (1 - prog(t, 8.8, 9.1));
  const lignes = [
    {ic: <Horloge t={t} />, txt: <>Chances d&apos;arriver à l&apos;heure : <b style={{color: C.soleil}}>100 %</b></>},
    {ic: <Thermo p={prog(t, 6.0, 6.8)} />, txt: <>Température dans la voiture : <b style={{color: '#BFE6FF'}}>22 °C</b> (clim)</>},
    {ic: <Wifi t={t} />, txt: <>Vent : <b style={{color: C.soleil}}>Wi-Fi à bord</b></>},
  ];
  const txt: CSSProperties = {fontFamily: P.grotesk, color: C.blanc, textShadow: '0 4px 18px rgba(10,20,50,0.35)'};

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.orage}}>
      {/* Ciel d'orage + pluie (côté pas encore essuyé) */}
      <AbsoluteFill style={{WebkitMaskImage: masqueInverse, opacity: t >= 4.6 ? 0 : 1}}>
        <AbsoluteFill style={{background: `linear-gradient(180deg, #0F1830 0%, ${C.orage} 45%, ${C.orage2} 100%)`}} />
        <Nuages t={t} sombre />
        <Pluie t={t} />
      </AbsoluteFill>
      {/* Ciel dégagé */}
      <AbsoluteFill style={{WebkitMaskImage: masque, opacity: t >= 3.5 ? 1 : 0}}>
        <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.clair} 0%, ${C.clair2} 100%)`}} />
        <div style={{position: 'absolute', left: 600, top: mix(1500, 150, lever)}}>
          <div style={{position: 'absolute', left: -200, top: -200, width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,214,90,0.55), rgba(255,214,90,0) 65%)'}} />
          <Soleil t={t} taille={240} />
        </div>
        <Nuages t={t} />
      </AbsoluteFill>
      {/* Retour de l'orage pour la boucle */}
      {retourOrage > 0 ? (
        <AbsoluteFill style={{opacity: retourOrage}}>
          <AbsoluteFill style={{background: `linear-gradient(180deg, #0F1830 0%, ${C.orage} 45%, ${C.orage2} 100%)`}} />
          <Nuages t={t} sombre />
          <Pluie t={t} />
        </AbsoluteFill>
      ) : null}

      {/* Essuie-glace géant */}
      {balaiVisible ? (
        <div style={{position: 'absolute', left: PIVOT.x - 20, top: PIVOT.y - 2300, width: 40, height: 2300, transformOrigin: '50% 100%', transform: `rotate(${phiAff}deg)`}}>
          <div style={{position: 'absolute', left: 6, top: 0, width: 28, height: 2300, background: 'linear-gradient(90deg, #111, #3a3a3a, #111)', borderRadius: 14}} />
          <div style={{position: 'absolute', left: -8, top: 60, width: 18, height: 2000, background: '#050505', borderRadius: 9}} />
          <div style={{position: 'absolute', left: -60, top: 60, width: 50, height: 2000, background: 'linear-gradient(90deg, rgba(220,235,255,0), rgba(220,235,255,0.35))', filter: 'blur(6px)'}} />
        </div>
      ) : null}

      <Eclair t={t} />

      {/* Hook */}
      {t < 1.2 ? (
        <div style={{...txt, position: 'absolute', top: 300, left: 120, right: 120, textAlign: 'center', fontWeight: 700, fontSize: 92, whiteSpace: 'nowrap', lineHeight: 1, opacity: clamp(t * 20) * (1 - prog(t, 1.0, 1.2))}}>
          Météo de Douala :
        </div>
      ) : null}

      {/* Carte orage */}
      {carte1 > 0 ? (
        <Verre style={{top: 520, opacity: carte1, transform: `scale(${mix(0.9, 1, ressort(t, 1.0, 1.6, 6))})`, textAlign: 'center'}}>
          <div style={{...txt, fontSize: 34, letterSpacing: 6, opacity: 0.8}}>DOUALA · AUJOURD&apos;HUI</div>
          <div style={{display: 'flex', justifyContent: 'center', margin: '10px 0'}}>
            <IconePluie t={t} />
          </div>
          <div style={{...txt, fontSize: 96, fontWeight: 700}}>Averses</div>
          <div style={{height: 2, background: 'rgba(255,255,255,0.35)', margin: '30px 0'}} />
          <div style={{...txt, fontSize: 52, fontWeight: 700, opacity: prog(t, 1.8, 2.1)}}>
            Taxis disponibles : <span style={{color: C.soleil, fontSize: 70}}>0 %</span>
          </div>
          <div style={{...txt, fontSize: 32, opacity: prog(t, 2.4, 2.7) * 0.85, marginTop: 8}}>(on a cherché partout 🙃)</div>
        </Verre>
      ) : null}

      {/* Carte soleil */}
      {carte2 > 0 ? (
        <Verre style={{top: 440, background: 'linear-gradient(150deg, rgba(25,60,120,0.5), rgba(25,60,120,0.3))', opacity: carte2, transform: `scale(${mix(0.9, 1, ressort(t, 5.0, 1.6, 6))})`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24}}>
            <Soleil t={t} taille={110} />
            <div>
              <div style={{...txt, fontSize: 30, letterSpacing: 5, opacity: 0.85}}>PRÉVISIONS JP</div>
              <div style={{...txt, fontSize: 72, fontWeight: 700}}>Grand soleil</div>
            </div>
          </div>
          {lignes.map((l, i) => {
            const p = ease.back(prog(t, 5.6 + i * 0.7, 5.95 + i * 0.7));
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '22px 0', borderTop: '2px solid rgba(255,255,255,0.3)', opacity: clamp(p * 2), transform: `translateX(${(1 - p) * 80}px)`}}>
                <div style={{flex: '0 0 84px'}}>{l.ic}</div>
                <div style={{...txt, fontSize: 44, lineHeight: 1.15}}>{l.txt}</div>
              </div>
            );
          })}
        </Verre>
      ) : null}

      {/* Fin qui renvoie */}
      {t >= 9.0 && t < 11.75 ? (
        <div style={{opacity: 1 - prog(t, 11.55, 11.75)}}>
          <Verre style={{top: 400, height: 1080, background: 'linear-gradient(150deg, rgba(20,45,90,0.55), rgba(20,45,90,0.35))', opacity: prog(t, 9.0, 9.3)}}>
            <span />
          </Verre>
          <FinJP
            t={t}
            s={{police: P.grotesk, couleur: C.blanc, couleurNumero: C.soleil, accent: C.soleil, tailleNumero: 150, ombre: '0 4px 18px rgba(5,15,40,0.5)'}}
            p={(i) => prog(t, 9.2 + i * 0.13, 9.55 + i * 0.13)}
            haut={470}
          />
          <Bandeau t={t} />
        </div>
      ) : null}
      <Bande n={15} />
    </AbsoluteFill>
  );
};

const Nuages: React.FC<{t: number; sombre?: boolean}> = ({t, sombre}) => (
  <>
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute', left: ((hasard(i + 3) * 1500 + t * (20 + i * 6)) % 1600) - 400, top: 40 + hasard(i + 9) * 900,
          width: 500 + hasard(i) * 300, height: 200 + hasard(i + 1) * 80,
          borderRadius: '50%', background: sombre ? '#0B1226' : '#FFFFFF', opacity: sombre ? 0.55 : 0.55, filter: 'blur(50px)',
        }}
      />
    ))}
  </>
);

/** Bandeau télé qui défile (au-dessus des 250 px libres du bas). */
const Bandeau: React.FC<{t: number}> = ({t}) => {
  const msg = `${TARIFS.ecoConfortPromo}  ·  `;
  const e = ease.out(prog(t, 9.1, 9.5));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1560, height: 96, display: 'flex', transform: `translateY(${(1 - e) * 140}px)`}}>
      <div style={{flex: '0 0 210px', background: C.soleil, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: P.grotesk, fontWeight: 700, fontSize: 36, color: '#13213F', zIndex: 2}}>
        MÉTÉO JP
      </div>
      <div style={{flex: 1, background: '#13213F', overflow: 'hidden', display: 'flex', alignItems: 'center'}}>
        <div style={{whiteSpace: 'nowrap', fontFamily: P.grotesk, fontWeight: 700, fontSize: 40, color: '#fff', transform: `translateX(${-(t - 9) * 260}px)`}}>
          {msg.repeat(4)}
        </div>
      </div>
    </div>
  );
};
