// 13. « Scratch » — platine vinyle vue du dessus (12 s).
import type {CSSProperties} from 'react';
import {AbsoluteFill} from 'remotion';
import {Bande, clamp, ease, FinJP, LogoJP, mix, prog, useT} from './commun';
import {POLICES_MOTION as P} from './config';

const C = {fond: '#0D0D0F', or: '#F2C230', creme: '#F3EFE6', ambre: '#FFB347', vinyle: '#121214'};
const CX = 540; // centre du disque (repère écran)
const CY = 620;
const R = 400;
const SCRATCHS = [0.3, 3.0, 4.25, 5.5, 6.75];
const MORCEAUX = [
  {n: '01', titre: 'Éco (Remix promo)', prix: '2 500 F/h'},
  {n: '02', titre: 'Confort feat. Wi-Fi & Clim', prix: '3 500 F/h'},
  {n: '03', titre: 'Aéroport (Extended)', prix: 'dès 8 000 F'},
  {n: '04', titre: "Voyage jusqu'à Kribi", prix: '50 000 F/jour'},
];

/** Angle du disque (degrés) : 33 tours ⅓ (200°/s), à-coups de scratch, arrêt progressif à la fin. */
const angle = (t: number) => {
  const w = 200;
  const T0 = 9.5;
  const D = 1.6;
  let a = t < T0 ? w * t : w * T0 + w * (Math.min(t - T0, D) - Math.min(t - T0, D) ** 2 / (2 * D));
  for (const s of SCRATCHS) {
    const p = (t - s) / 0.22;
    if (p > 0 && p < 1) a -= Math.sin(p * Math.PI) * 55;
  }
  return a;
};
const vitesse = (t: number) => (t < 9.5 ? 1 : clamp(1 - (t - 9.5) / 1.6));

const Etiquette: React.FC<{t: number}> = ({t}) => {
  const versLogo = prog(t, 10.0, 10.5);
  const face = t >= 1.0;
  const haut = face ? 'JP SERVICE · FACE A · ' : 'TA PLAYLIST DU JOUR · ';
  return (
    <div style={{position: 'absolute', left: R - 150, top: R - 150, width: 300, height: 300}}>
      <svg width="300" height="300" viewBox="0 0 300 300" style={{position: 'absolute', opacity: 1 - versLogo}}>
        <defs>
          <path id="p13cercle" d="M150 150 m-112 0 a112 112 0 1 1 224 0 a112 112 0 1 1 -224 0" />
          <radialGradient id="p13or" cx="40%" cy="35%">
            <stop offset="0" stopColor="#FFE07A" />
            <stop offset="1" stopColor={C.or} />
          </radialGradient>
        </defs>
        <circle cx="150" cy="150" r="148" fill="url(#p13or)" />
        <circle cx="150" cy="150" r="80" fill="none" stroke="#1112" strokeWidth="2" />
        <text fontFamily={P.grotesk} fontWeight={700} fontSize={face ? 26 : 25} fill="#151515" letterSpacing="2">
          <textPath href="#p13cercle">{haut + haut}</textPath>
        </text>
        <text x="150" y="132" textAnchor="middle" fontFamily={P.grotesk} fontWeight={700} fontSize="30" fill="#151515">
          {face ? 'FACE A' : '★'}
        </text>
        <text x="150" y="190" textAnchor="middle" fontFamily={P.grotesk} fontSize="22" fill="#151515">
          {face ? '33 ⅓ tours' : 'du jour'}
        </text>
      </svg>
      {/* L'étiquette devient le logo JP */}
      <div
        style={{
          position: 'absolute', inset: 0, borderRadius: 150, background: '#0B0B0C', opacity: versLogo,
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 0 0 6px ${C.or}`,
        }}
      >
        {/* Contre-rotation : le logo s'arrête droit quand le disque s'immobilise */}
        <div style={{transform: `rotate(${-angle(12)}deg)`}}>
          <LogoJP largeur={250} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 142, top: 142, width: 16, height: 16, borderRadius: 8, background: '#cfcfcf', boxShadow: 'inset 0 0 3px #000'}} />
    </div>
  );
};

const Disque: React.FC<{t: number}> = ({t}) => {
  const a = angle(t);
  const v = vitesse(t);
  return (
    <div style={{position: 'absolute', left: CX - R, top: CY - R, width: 2 * R, height: 2 * R}}>
      {/* Plateau et ombre */}
      <div style={{position: 'absolute', inset: -22, borderRadius: '50%', background: '#2A2A2E', boxShadow: '0 30px 60px rgba(0,0,0,0.7)'}} />
      {/* Vinyle : sillons */}
      <div
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: `repeating-radial-gradient(circle at 50% 50%, #0c0c0d 0px, #0c0c0d 2px, #1d1d20 3px, #141416 4px)`,
          boxShadow: 'inset 0 0 0 3px #222',
        }}
      />
      {/* Plages entre les morceaux (anneaux plus lisses) */}
      {[0.58, 0.7, 0.82].map((k) => (
        <div key={k} style={{position: 'absolute', inset: R * (1 - k), borderRadius: '50%', border: '3px solid #2b2b30'}} />
      ))}
      {/* Partie qui tourne : étiquette (et son flou de rotation) */}
      <div style={{position: 'absolute', inset: 0, transform: `rotate(${a}deg)`}}>
        <Etiquette t={t} />
      </div>
      {v > 0.3 ? (
        <div style={{position: 'absolute', inset: 0, transform: `rotate(${a - 7}deg)`, opacity: 0.35 * v, filter: 'blur(1.5px)'}}>
          <Etiquette t={t} />
        </div>
      ) : null}
      {/* Reflet fixe de la lumière sur les sillons (le disque tourne dessous) */}
      <div
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%', mixBlendMode: 'screen',
          background: `conic-gradient(from ${-20 + Math.sin(t * 0.8) * 3}deg, rgba(255,190,110,0) 0deg, rgba(255,200,130,0.28) 22deg, rgba(255,190,110,0) 50deg, rgba(255,190,110,0) 180deg, rgba(255,220,170,0.2) 202deg, rgba(255,190,110,0) 230deg)`,
          WebkitMaskImage: `radial-gradient(circle, transparent ${150}px, #000 ${160}px)`,
        }}
      />
    </div>
  );
};

/** Bras de lecture : pivot en haut à droite. levee 0 = posé, 1 = levé. */
const Bras: React.FC<{rot: number; levee: number}> = ({rot, levee}) => {
  const px = 960;
  const py = 160;
  return (
    <>
      <div style={{position: 'absolute', left: px - 70, top: py - 70, width: 140, height: 140, borderRadius: 70, background: 'radial-gradient(circle at 40% 35%, #5a5a60, #1d1d20)', boxShadow: '0 10px 20px #000a'}} />
      <svg width="1080" height="1300" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <g transform={`translate(${px} ${py}) rotate(${rot})`}>
          <g transform={`translate(${12 + levee * 22} ${18 + levee * 26})`} opacity={0.45}>
            <path d="M0 0 L0 560 L-30 600" stroke="#000" strokeWidth="18" fill="none" strokeLinecap="round" style={{filter: 'blur(6px)'}} />
          </g>
          <g transform={`scale(${1 + levee * 0.03})`}>
            <rect x="-14" y="-110" width="28" height="80" rx="8" fill="#3a3a40" />
            <path d="M0 0 L0 560 L-30 600" stroke="#c9c9ce" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M-4 0 L-4 556" stroke="#fff" strokeWidth="3" opacity="0.6" />
            <rect x="-62" y="588" width="64" height="40" rx="6" transform="rotate(-20 -30 608)" fill="#2b2b30" stroke="#888" strokeWidth="2" />
            <circle cx="0" cy="0" r="26" fill="#8a8a90" stroke="#333" strokeWidth="4" />
          </g>
        </g>
      </svg>
    </>
  );
};

export const Pub13Vinyle: React.FC = () => {
  const t = useT();
  // Bras : descend sur le disque (0 – 0,3 s), avance lentement, revient au repos à la fin (boucle)
  const pose = ease.inOut(prog(t, 0, 0.3));
  const retour = ease.inOut(prog(t, 11.4, 11.95));
  const rot = mix(mix(0, 13, pose) + prog(t, 0.3, 11) * 7, 0, retour);
  const levee = Math.max(1 - pose, retour);
  // Caméra : se penche en 3D (1 – 3 s), redevient vue du dessus à la fin
  const pench = ease.inOut(prog(t, 1.0, 2.6)) * (1 - ease.inOut(prog(t, 9.4, 10.2)));
  const ligne = t < 3 ? -1 : Math.min(3, Math.floor((t - 3) / 1.25));
  const liste = prog(t, 2.8, 3.3) * (1 - prog(t, 7.9, 8.2));
  const ecran = prog(t, 8.1, 8.5) * (1 - prog(t, 9.3, 9.6));
  const titre: CSSProperties = {fontFamily: P.grotesk, fontWeight: 700, color: C.creme, textAlign: 'center'};

  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, #2a1d10 0%, ${C.fond} 60%)`, overflow: 'hidden'}}>
      <AbsoluteFill style={{perspective: 1500, perspectiveOrigin: '50% 30%'}}>
        <AbsoluteFill style={{transformOrigin: `${CX}px ${CY}px`, transform: `rotateX(${pench * 36}deg) translateY(${pench * -80}px) scale(${1 + pench * 0.06})`}}>
          {/* Socle de la platine */}
          <div style={{position: 'absolute', left: 40, top: 130, width: 1000, height: 990, borderRadius: 40, background: 'linear-gradient(160deg, #1d1d21, #0f0f11)', boxShadow: '0 40px 80px #000, inset 0 1px 0 #333'}} />
          <Disque t={t} />
          <Bras rot={rot} levee={levee} />
        </AbsoluteFill>
      </AbsoluteFill>
      {/* Profondeur de champ : le haut, plus loin, devient flou quand la caméra se penche */}
      <AbsoluteFill style={{backdropFilter: `blur(${pench * 7}px)`, WebkitMaskImage: 'linear-gradient(180deg, #000 0%, transparent 28%)'}} />
      {/* Lueur ambrée */}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 80% 15%, rgba(255,179,71,0.18), transparent 45%)', mixBlendMode: 'screen'}} />

      {/* Hook */}
      {t < 1.2 ? (
        <div style={{...titre, position: 'absolute', top: 1170, left: 120, right: 120, fontSize: 92, lineHeight: 1.05, opacity: clamp(t * 15) * (1 - prog(t, 0.95, 1.2))}}>
          Ta playlist <span style={{color: C.or}}>du jour</span>
        </div>
      ) : null}
      {t >= 1.0 && t < 3.0 ? (
        <div style={{...titre, position: 'absolute', top: 1220, left: 120, right: 120, fontSize: 60, letterSpacing: 6, color: C.or, opacity: prog(t, 1.2, 1.5) * (1 - prog(t, 2.8, 3.0))}}>
          JP SERVICE · FACE A
        </div>
      ) : null}

      {/* Liste des morceaux, comme une pochette */}
      {liste > 0 ? (
        <div
          style={{
            position: 'absolute', left: 120, right: 120, top: 1110, padding: '28px 34px', borderRadius: 18,
            background: 'linear-gradient(160deg, #1f1a14, #121010)', border: `2px solid ${C.or}55`,
            opacity: liste, transform: `translateY(${(1 - liste) * 60}px)`, boxShadow: '0 20px 50px #000c',
          }}
        >
          <div style={{fontFamily: P.grotesk, fontSize: 26, letterSpacing: 6, color: C.or, marginBottom: 14}}>FACE A · TA PLAYLIST JP</div>
          {MORCEAUX.map((m, i) => {
            const actif = i === ligne;
            return (
              <div key={m.n} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 0', borderTop: i ? '1px solid #ffffff18' : 'none', opacity: actif ? 1 : 0.5}}>
                <div style={{fontFamily: P.grotesk, fontSize: 30, color: actif ? C.or : C.creme, width: 44}}>{m.n}</div>
                <div style={{flex: 1}}>
                  <div style={{fontFamily: P.grotesk, fontWeight: 700, fontSize: 36, color: C.creme, lineHeight: 1.1}}>{m.titre}</div>
                  <div style={{fontFamily: P.grotesk, fontSize: 30, color: C.or}}>{m.prix}</div>
                </div>
                <Egaliseur t={t} actif={actif} />
              </div>
            );
          })}
        </div>
      ) : null}

      {ecran > 0 ? (
        <div style={{...titre, position: 'absolute', top: 1180, left: 120, right: 120, fontSize: 70, lineHeight: 1.1, opacity: ecran, transform: `translateY(${(1 - ecran) * 40}px)`}}>
          Et le <span style={{color: C.or}}>mini écran</span> à bord pour ta vraie playlist.
        </div>
      ) : null}

      {/* Fin qui renvoie */}
      {t >= 9.9 ? (
        <div style={{opacity: 1 - prog(t, 11.65, 11.95)}}>
          <FinJP
            t={t}
            s={{police: P.grotesk, couleur: C.creme, couleurNumero: C.or, accent: C.or, tailleNumero: 140, ombre: '0 4px 20px #000'}}
            p={(i) => prog(t, 10.0 + i * 0.15, 10.35 + i * 0.15)}
            haut={1080}
            sansLogo
            tailleTexte={54}
            ecart={12}
          />
        </div>
      ) : null}
      <Bande n={13} />
    </AbsoluteFill>
  );
};

const Egaliseur: React.FC<{t: number; actif: boolean}> = ({t, actif}) => (
  <div style={{display: 'flex', gap: 5, alignItems: 'flex-end', height: 44, width: 56}}>
    {[0, 1, 2, 3, 4].map((i) => {
      const h = actif ? 8 + Math.abs(Math.sin(t * (7 + i * 2.3) + i * 1.7)) * 36 : 6;
      return <div key={i} style={{width: 7, height: h, borderRadius: 2, background: actif ? C.or : '#555'}} />;
    })}
  </div>
);
