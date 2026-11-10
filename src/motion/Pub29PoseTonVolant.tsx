// 29. « Pose ton volant. » — ordre direct + objet 3D (15 s).
import type {CSSProperties} from 'react';
import {AbsoluteFill} from 'remotion';
import {Bande, clamp, ease, FinJP, mix, prog, ressort, useT, visibleJusqua} from './commun';
import {POLICES_MOTION as P, TARIFS} from './config';

const C = {fond: '#16181C', ambre: '#F2B04A', blanc: '#FFFFFF', cuir: '#1B1B1D'};

/** Volant premium : jante en cuir avec coutures, branches en métal brossé, moyeu sombre (sans marque). */
const Volant: React.FC<{taille: number}> = ({taille}) => (
  <svg width={taille} height={taille} viewBox="-260 -260 520 520" style={{overflow: 'visible'}}>
    <defs>
      <radialGradient id="p29cuir" cx="50%" cy="50%" r="50%">
        <stop offset="0.78" stopColor="#0C0C0D" />
        <stop offset="0.86" stopColor="#2C2C30" />
        <stop offset="0.92" stopColor="#151517" />
        <stop offset="1" stopColor="#050506" />
      </radialGradient>
      <linearGradient id="p29metal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#E9ECEF" />
        <stop offset="0.35" stopColor="#8E949B" />
        <stop offset="0.55" stopColor="#D5D9DE" />
        <stop offset="1" stopColor="#5E636A" />
      </linearGradient>
      <linearGradient id="p29reflet" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Branches */}
    <path d="M-215 -10 L-70 -30 L-60 30 L-210 40 Z" fill="url(#p29metal)" />
    <path d="M215 -10 L70 -30 L60 30 L210 40 Z" fill="url(#p29metal)" />
    <path d="M-40 60 L40 60 L36 220 L-36 220 Z" fill="url(#p29metal)" />
    {/* Jante en cuir */}
    <circle r="215" fill="none" stroke="url(#p29cuir)" strokeWidth="62" />
    <circle r="215" fill="none" stroke="url(#p29reflet)" strokeWidth="58" />
    <circle r="215" fill="none" stroke="#3A3A3E" strokeWidth="2.5" strokeDasharray="7 7" />
    <circle r="236" fill="none" stroke={C.ambre} strokeOpacity="0.5" strokeWidth="2" strokeDasharray="6 8" />
    {/* Moyeu */}
    <rect x="-95" y="-75" width="190" height="150" rx="56" fill="#111214" stroke="url(#p29metal)" strokeWidth="8" />
    <rect x="-70" y="-50" width="140" height="100" rx="40" fill="#1C1D20" />
    <circle r="22" fill="none" stroke={C.ambre} strokeWidth="4" opacity="0.8" />
  </svg>
);

/** Coussin de siège arrière en cuir capitonné (gros plan). */
const Siege: React.FC<{lumiere: number}> = ({lumiere}) => (
  <svg width="1080" height="1100" viewBox="0 0 1080 1100">
    <defs>
      <linearGradient id="p29siege" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2A2320" />
        <stop offset="1" stopColor="#0E0C0B" />
      </linearGradient>
      <radialGradient id="p29lum" cx="30%" cy="10%" r="80%">
        <stop offset="0" stopColor={C.ambre} stopOpacity={0.45 + lumiere * 0.3} />
        <stop offset="1" stopColor={C.ambre} stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Dossier */}
    <path d="M60 0 L1020 0 L980 470 Q540 520 100 470 Z" fill="url(#p29siege)" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <path key={i} d={`M${170 + i * 148} 20 Q${170 + i * 148 - 6} 250 ${175 + i * 148} 470`} stroke="#0B0908" strokeWidth="10" fill="none" />
    ))}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <path key={`c${i}`} d={`M${182 + i * 148} 20 Q${182 + i * 148 - 6} 250 ${187 + i * 148} 470`} stroke="#6E5A45" strokeWidth="2" strokeDasharray="8 8" fill="none" />
    ))}
    {/* Assise */}
    <path d="M40 520 Q540 470 1040 520 L1080 1100 L0 1100 Z" fill="url(#p29siege)" />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={`a${i}`} d={`M${150 + i * 195} 520 L${90 + i * 225} 1100`} stroke="#0B0908" strokeWidth="12" />
    ))}
    <path d="M40 520 Q540 470 1040 520" stroke="#6E5A45" strokeWidth="3" strokeDasharray="10 9" fill="none" />
    <rect width="1080" height="1100" fill="url(#p29lum)" />
  </svg>
);

const IconeVerre: React.FC<{label: string; on: number; children: React.ReactNode}> = ({label, on, children}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: 0.25 + on * 0.75, transform: `scale(${mix(0.85, 1, on)})`}}>
    <div style={{width: 200, height: 200, borderRadius: 50, background: `linear-gradient(150deg, rgba(242,176,74,${0.25 + on * 0.25}), rgba(242,176,74,0.05))`, border: `2px solid rgba(242,176,74,${0.3 + on * 0.6})`, backdropFilter: 'blur(14px)', boxShadow: on > 0.5 ? `0 0 60px rgba(242,176,74,${on * 0.55})` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg width="110" height="110" viewBox="0 0 100 100" style={{stroke: C.ambre, fill: 'none', strokeWidth: 8, strokeLinecap: 'round'}}>
        {children}
      </svg>
    </div>
    <div style={{fontFamily: P.grotesk, fontWeight: 700, fontSize: 42, color: C.blanc}}>{label}</div>
  </div>
);

export const Pub29PoseTonVolant: React.FC = () => {
  const t = useT();
  const fin = t >= 14.7;
  const th = fin ? t - 14.7 : t;
  // Volant nerveux (bouchon), s'arrête (1,5 – 2 s), se détache et tombe au ralenti (2 – 3,8 s)
  const nerveux = th < 2 ? (Math.sin(th * 7.3) * 34 + Math.sin(th * 13.1) * 14) * (th < 1.5 ? 1 : 1 - ease.out(prog(th, 1.5, 2))) : 0;
  const tombe = fin ? 0 : ease.inOut(prog(t, 2.0, 3.9));
  const atterrit = fin ? 0 : clamp(ressort(t, 3.9, 1.4, 5), 0, 1.06);
  const vy = mix(820, 1330, tombe) + (t >= 3.9 && !fin ? (1 - atterrit) * -30 : 0);
  const rx = mix(0, 68, tombe);
  const rz = nerveux + tombe * 40;
  const s = mix(1, 0.62, tombe);
  // Caméra qui suit la chute : le siège monte depuis le bas
  const siegeY = mix(1700, 760, ease.inOut(prog(t, 2.2, 3.9)));
  const siege = !fin && t >= 2.0;
  const icones = [prog(t, 6.2, 6.5), prog(t, 6.9, 7.2), prog(t, 7.6, 7.9)];
  const ambiance = prog(t, 8.0, 8.6);
  const cta = visibleJusqua(t, 11.0, 14.5, 0.35, 0.2);
  const titre: CSSProperties = {position: 'absolute', left: 120, right: 120, textAlign: 'center', fontFamily: P.grotesk, fontWeight: 700, color: C.blanc, textShadow: '0 6px 30px rgba(0,0,0,0.6)'};
  const flouFond = t < 3.9 && !fin ? 8 : 0;

  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 35%, #2A2D33, ${C.fond} 70%)`, overflow: 'hidden'}}>
      {/* Lumières floues (bokeh) qui défilent vers le haut pendant la chute */}
      {[...Array(10)].map((_, i) => (
        <div key={i} style={{position: 'absolute', left: (i * 211) % 1080 - 60, top: ((i * 377 - (siege ? (t - 2) * 600 : 0)) % 2200 + 2200) % 2200 - 200, width: 120 + (i % 3) * 60, height: 120 + (i % 3) * 60, borderRadius: '50%', background: i % 2 ? 'rgba(242,176,74,0.18)' : 'rgba(255,255,255,0.06)', filter: 'blur(18px)'}} />
      ))}
      {siege ? (
        <div style={{position: 'absolute', left: 0, top: siegeY, filter: `blur(${flouFond}px)`}}>
          <Siege lumiere={ambiance} />
        </div>
      ) : null}
      {/* Ombre du volant sur l'assise */}
      {siege && t >= 3.3 ? <div style={{position: 'absolute', left: 540 - 230, top: 1420, width: 460, height: 120, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', filter: 'blur(22px)', opacity: prog(t, 3.3, 3.9)}} /> : null}
      <div style={{position: 'absolute', left: 540 - 300, top: vy - 300, width: 600, height: 600, transform: `perspective(1600px) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${s})`, filter: `drop-shadow(0 40px 40px rgba(0,0,0,0.6))`}}>
        <Volant taille={600} />
      </div>
      {/* Lumière d'ambiance de l'habitacle */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 20%, rgba(242,176,74,${ambiance * 0.22}), transparent 60%)`}} />

      {/* Icônes en verre ambré autour du siège */}
      {t >= 6.0 && t < 11.2 ? (
        <div style={{position: 'absolute', left: 120, right: 120, top: 380, display: 'flex', justifyContent: 'space-between', opacity: 1 - prog(t, 10.8, 11.2)}}>
          <IconeVerre label="Wi-Fi" on={icones[0]}>
            <path d="M14 42 a50 50 0 0 1 72 0 M26 56 a32 32 0 0 1 48 0 M38 70 a14 14 0 0 1 24 0" />
            <circle cx="50" cy="82" r="4" fill={C.ambre} />
          </IconeVerre>
          <IconeVerre label="Clim" on={icones[1]}>
            <path d="M50 10 V90 M15 30 L85 70 M15 70 L85 30 M40 16 L50 26 L60 16 M40 84 L50 74 L60 84" />
          </IconeVerre>
          <IconeVerre label="Mini écran" on={icones[2]}>
            <rect x="12" y="22" width="76" height="48" rx="6" />
            <path d="M36 84 H64 M50 70 V84" />
          </IconeVerre>
        </div>
      ) : null}

      {/* Textes */}
      {th < 2.0 || fin ? <div style={{...titre, top: 230, fontSize: 120, opacity: fin ? 1 : 1 - prog(t, 1.7, 2.0)}}>Pose ton volant.</div> : null}
      {t >= 3.9 && t < 6.0 ? <div style={{...titre, top: 300, fontSize: 92, opacity: prog(t, 4.0, 4.3) * (1 - prog(t, 5.7, 6.0))}}>Installe-toi <span style={{color: C.ambre}}>derrière.</span></div> : null}
      {t >= 9.0 && t < 11.2 ? (
        <div style={{...titre, top: 760, opacity: prog(t, 9.0, 9.3) * (1 - prog(t, 10.9, 11.2))}}>
          <div style={{fontSize: 96}}>Ton chauffeur conduit.</div>
          <div style={{fontSize: 46, color: C.ambre, marginTop: 24}}>Confort 3 500 F/h · {TARIFS.eco} (promo)</div>
        </div>
      ) : null}

      {/* Appel à l'action : reste jusqu'à la fin */}
      {cta > 0 ? (
        <AbsoluteFill style={{opacity: cta}}>
          <AbsoluteFill style={{background: 'rgba(14,15,18,0.62)'}} />
          <FinJP
            t={t}
            s={{police: P.grotesk, couleur: C.blanc, couleurNumero: C.blanc, accent: C.ambre, tailleNumero: 150}}
            p={(i) => prog(t, 11.1 + i * 0.12, 11.45 + i * 0.12)}
            haut={560}
          />
        </AbsoluteFill>
      ) : null}
      <Bande n={29} />
    </AbsoluteFill>
  );
};
