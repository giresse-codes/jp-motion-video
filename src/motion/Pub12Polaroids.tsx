// 12. « Clic-clac » — polaroids sur un tableau en liège (12 s).
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {Bande, clamp, ease, FinJP, hasard, LogoJP, mix, prog, ressort, useT, Voiture} from './commun';
import {POLICES_MOTION as P} from './config';

const C = {liege: '#D8C3A0', cadre: '#F8F6F0', encre: '#1E2A4A', scotch: '#F5E6A8', ombre: 'rgba(40,25,10,0.45)'};
const L = 440; // largeur d'un polaroid
const PH = 400; // côté de la photo

// ── Photos (formes simples, aucune personne) ──
const PhotoVoiture = () => (
  <div style={{position: 'relative', width: PH, height: PH, overflow: 'hidden'}}>
    <svg width={PH} height={PH} viewBox="0 0 400 400" style={{position: 'absolute'}}>
      <defs>
        <linearGradient id="p12ciel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FC4E8" />
          <stop offset="1" stopColor="#F3DDB0" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#p12ciel)" />
      <rect x="20" y="120" width="70" height="170" fill="#C9B79A" />
      <rect x="100" y="80" width="60" height="210" fill="#B9A688" />
      <rect x="290" y="100" width="90" height="190" fill="#C4B190" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={110 + (i % 2) * 24} y={100 + Math.floor(i / 2) * 50} width="14" height="26" fill="#8C7A60" />
      ))}
      <rect y="290" width="400" height="110" fill="#6E6E72" />
      <rect y="284" width="400" height="10" fill="#BDB7AA" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 110 + 10} y="350" width="60" height="6" fill="#E9E4D6" />
      ))}
    </svg>
    <Voiture largeur={360} style={{position: 'absolute', left: 20, top: 168}} />
  </div>
);
const PhotoAkwa = () => (
  <svg width={PH} height={PH} viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#F4E3B5" />
    <circle cx="300" cy="120" r="46" fill="#F7C548" />
    {[
      [20, 150, 60], [90, 90, 70], [170, 170, 50], [230, 60, 80], [320, 140, 70],
    ].map(([x, y, l], i) => (
      <g key={i}>
        <rect x={x} y={y} width={l} height={330 - y} fill={['#5C6B7E', '#46566B', '#6E7C8E', '#3D4C60', '#56667A'][i]} />
        {Array.from({length: Math.floor((330 - y) / 26)}).map((_, k) => (
          <rect key={k} x={x + 8} y={y + 10 + k * 26} width={l - 16} height="8" fill="#A9C3D9" opacity="0.7" />
        ))}
      </g>
    ))}
    <rect y="330" width="400" height="70" fill="#7A7468" />
    <rect y="360" width="400" height="6" fill="#E8E1CF" />
  </svg>
);
const PhotoSoiree = () => (
  <svg width={PH} height={PH} viewBox="0 0 400 400">
    <defs>
      <linearGradient id="p12nuit" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1C2140" />
        <stop offset="1" stopColor="#4B3B6B" />
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#p12nuit)" />
    <circle cx="90" cy="80" r="26" fill="#F2EBC9" />
    {[[30, 170, 70], [110, 120, 60], [180, 190, 80], [270, 100, 60], [330, 160, 60]].map(([x, y, l], i) => (
      <g key={i}>
        <rect x={x} y={y} width={l} height={330 - y} fill="#15182C" />
        {Array.from({length: 12}).map((_, k) => (
          <rect key={k} x={x + 8 + (k % 3) * ((l - 16) / 3)} y={y + 12 + Math.floor(k / 3) * 30} width="10" height="12" fill={hasard(i * 9 + k) > 0.45 ? '#F6D27A' : '#2A2F4A'} />
        ))}
      </g>
    ))}
    <rect y="330" width="400" height="70" fill="#22243A" />
    {[60, 200, 340].map((x) => (
      <g key={x}>
        <rect x={x} y="250" width="5" height="80" fill="#3A3D57" />
        <circle cx={x + 2} cy="250" r="22" fill="#F6D27A" opacity="0.25" />
        <circle cx={x + 2} cy="250" r="7" fill="#FFF1C2" />
      </g>
    ))}
  </svg>
);
const PhotoKribi = () => (
  <svg width={PH} height={PH} viewBox="0 0 400 400">
    <rect width="400" height="220" fill="#9FD3F0" />
    <circle cx="110" cy="110" r="40" fill="#FFE08A" />
    <rect y="200" width="400" height="90" fill="#3BB3C3" />
    <path d="M0 230 Q100 220 200 232 T400 228" stroke="#E9FAFB" strokeWidth="5" fill="none" opacity="0.8" />
    <path d="M0 290 Q200 260 400 285 L400 400 L0 400 Z" fill="#EBD5A6" />
    <path d="M300 380 Q290 300 250 200" stroke="#6B5132" strokeWidth="12" fill="none" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <path key={i} d={`M250 200 q${Math.cos(i * 1.05) * 50} ${Math.sin(i * 1.05) * 30 - 10} ${Math.cos(i * 1.05) * 90} ${Math.sin(i * 1.05) * 40 + 30}`} stroke="#3F8F4E" strokeWidth="14" fill="none" strokeLinecap="round" />
    ))}
  </svg>
);

/** Polaroid : cadre, photo qui se développe (d de 0 à 1), légende manuscrite écrite (e de 0 à 1). */
const Polaroid: React.FC<{photo: ReactNode; d: number; legende: string[]; e: number; largeur?: number; hauteurPhoto?: number; bas?: ReactNode}> = ({
  photo, d, legende, e, largeur = L, hauteurPhoto = PH, bas,
}) => {
  const k = ease.inOut(clamp(d));
  return (
    <div style={{width: largeur, background: C.cadre, padding: '20px 20px 0', boxShadow: `0 18px 30px ${C.ombre}, 0 2px 4px rgba(0,0,0,0.25)`}}>
      <div style={{position: 'relative', width: largeur - 40, height: hauteurPhoto, overflow: 'hidden', background: '#2B3138'}}>
        <div style={{filter: `blur(${(1 - k) * 12}px) saturate(${0.15 + k * 0.85}) brightness(${1 + (1 - k) * 0.5}) contrast(${0.6 + k * 0.4})`}}>{photo}</div>
        {/* Voile du développement : gris-bleu laiteux qui s'éclaircit */}
        <AbsoluteFill style={{background: '#C9CFC8', opacity: (1 - k) ** 0.8 * 0.95}} />
        <AbsoluteFill style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 40%)'}} />
      </div>
      <div style={{height: bas ? undefined : 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: bas ? '18px 0 22px' : 0}}>
        {bas ??
          legende.map((l, i) => (
            <div
              key={i}
              style={{
                fontFamily: P.main,
                fontWeight: 700,
                fontSize: legende.length > 1 ? 44 : 54,
                lineHeight: 1.05,
                color: C.encre,
                clipPath: `inset(-10px ${100 - clamp(e * legende.length - i) * 100}% -10px -10px)`,
              }}
            >
              {l}
            </div>
          ))}
      </div>
    </div>
  );
};

const Punaise: React.FC<{couleur: string; s: number}> = ({couleur, s}) => (
  <div
    style={{
      position: 'absolute', left: L / 2 - 20, top: -6, width: 40, height: 40, borderRadius: 20,
      background: `radial-gradient(circle at 35% 30%, #fff8, ${couleur} 45%, #0006 100%)`,
      boxShadow: '4px 8px 6px rgba(0,0,0,0.35)', transform: `scale(${s})`, opacity: s > 0 ? 1 : 0,
    }}
  />
);
const Scotch: React.FC<{s: number; rot: number}> = ({s, rot}) => (
  <div
    style={{
      position: 'absolute', left: L / 2 - 80, top: -22, width: 160 * s, height: 46, background: C.scotch,
      opacity: 0.82, transform: `rotate(${rot}deg)`, boxShadow: '0 2px 3px rgba(0,0,0,0.15)',
      clipPath: 'polygon(0 4%, 4% 0, 8% 6%, 12% 0, 100% 0, 96% 50%, 100% 100%, 4% 100%, 0 92%)',
    }}
  />
);

// Disposition sur le liège : centre (x, y), rotation, fixation, arrivée (s), légende
const POSES = [
  {x: 290, y: 470, r: -5, fix: 'punaise', couleur: '#1E2A4A', t: 0, photo: <PhotoVoiture />, leg: ['Ton chauffeur']},
  {x: 790, y: 560, r: 4, fix: 'scotch', couleur: '', t: 3.6, photo: <PhotoAkwa />, leg: ['Akwa, 9 h', 'Éco 2 500 F/h']},
  {x: 300, y: 1020, r: 3, fix: 'punaise', couleur: '#E8C547', t: 4.3, photo: <PhotoSoiree />, leg: ['Soirée', 'Confort 3 500 F/h']},
  {x: 780, y: 1110, r: -4, fix: 'scotch', couleur: '', t: 5.0, photo: <PhotoKribi />, leg: ['Kribi', 'Voyage 50 000 F/jour']},
] as const;
const HAUT_P = PH + 150; // hauteur totale d'un polaroid

const Liege = () => (
  <AbsoluteFill style={{background: C.liege}}>
    <svg width="1080" height="1920" style={{position: 'absolute'}}>
      <filter id="p12liege">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="4" />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.32  0 0 0 0 0.18  0 0 0 1.6 -0.55" />
      </filter>
      <filter id="p12liege2">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="9" />
        <feColorMatrix values="0 0 0 0 0.98  0 0 0 0 0.9  0 0 0 0 0.75  0 0 0 0.9 -0.35" />
      </filter>
      <rect width="1080" height="1920" filter="url(#p12liege2)" />
      <rect width="1080" height="1920" filter="url(#p12liege)" />
    </svg>
    <AbsoluteFill style={{boxShadow: 'inset 0 0 200px rgba(60,35,10,0.45)'}} />
  </AbsoluteFill>
);

export const Pub12Polaroids: React.FC = () => {
  const t = useT();
  const flashDebut = 1 - prog(t, 0.03, 0.4);
  const flashFin = prog(t, 11.8, 11.97);
  const flash = Math.max(t < 0.03 ? 1 : flashDebut, flashFin);
  const fin = prog(t, 9.4, 9.9);

  // Le premier polaroid sort du bas (0–1,2 s) en vibrant, puis rejoint le tableau (3,5 s)
  const sortie = ease.out(prog(t, 0.05, 1.1));
  const vib = t < 1.1 ? Math.sin(t * 90) * 4 * (1 - sortie) : 0;
  const versTableau = ease.inOut(prog(t, 3.3, 3.9));
  const p0 = {
    x: mix(540, POSES[0].x, versTableau) + vib,
    y: mix(mix(2300, 900, sortie), POSES[0].y, versTableau),
    s: mix(1.7, 1, versTableau),
    r: mix(mix(0, -2, sortie), POSES[0].r, versTableau),
  };

  // Fil d'enquête : pointes des fixations, puis post-it
  const pts = [...POSES.map((p) => [p.x, p.y - HAUT_P / 2 + 14]), [540, 1430]];
  const fil = prog(t, 8.0, 9.2);
  const segments = pts.slice(1).map((b, i) => {
    const a = pts[i];
    const mxp = (a[0] + b[0]) / 2;
    const myp = (a[1] + b[1]) / 2 + 60;
    return `M${a[0]} ${a[1]} Q${mxp} ${myp} ${b[0]} ${b[1]}`;
  });

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Liege />
      <AbsoluteFill style={{filter: `blur(${fin * 6}px) brightness(${1 - fin * 0.35})`}}>
        {POSES.map((p, i) => {
          let x: number = p.x, y: number = p.y, s = 1, r: number = p.r, d: number, e: number;
          if (i === 0) {
            ({x, y, s, r} = p0);
            d = prog(t, 1.2, 3.1);
            e = prog(t, 2.5, 3.2);
          } else {
            if (t < p.t) return null;
            // Chute : accélération puis petit rebond, rotation qui se stabilise
            const c = prog(t, p.t, p.t + 0.45);
            const rb = t > p.t + 0.45 ? Math.exp(-(t - p.t - 0.45) * 9) * Math.sin((t - p.t - 0.45) * 30) * 10 : 0;
            y = mix(-500, p.y, c * c) - rb;
            r = p.r + (1 - c) * (i % 2 ? -25 : 25) + rb * 0.3;
            s = mix(1.15, 1, c);
            d = prog(t, p.t + 0.7 + i * 0.1, p.t + 2.4);
            e = prog(t, p.t + 1.6, p.t + 2.4);
          }
          const pose = t >= (i === 0 ? 3.9 : p.t + 0.45);
          const fix = clamp(ressort(t, i === 0 ? 3.9 : p.t + 0.5, 3, 9));
          return (
            <div key={i} style={{position: 'absolute', left: x - L / 2, top: y - HAUT_P / 2, transform: `rotate(${r}deg) scale(${s})`}}>
              <Polaroid photo={p.photo} d={d} legende={[...p.leg]} e={e} />
              {pose && p.fix === 'punaise' ? <Punaise couleur={p.couleur} s={fix} /> : null}
              {pose && p.fix === 'scotch' ? <Scotch s={clamp(fix * 1.3)} rot={-3 + i} /> : null}
            </div>
          );
        })}
        {/* Fil bleu marine et post-it */}
        <svg width="1080" height="1920" style={{position: 'absolute'}}>
          {segments.map((dPath, i) => {
            const part = clamp(fil * segments.length - i);
            return part > 0 ? (
              <path key={i} d={dPath} pathLength={1} stroke={C.encre} strokeWidth={6} fill="none" strokeDasharray="1 1" strokeDashoffset={1 - part} strokeLinecap="round" style={{filter: 'drop-shadow(3px 6px 3px rgba(0,0,0,0.3))'}} />
            ) : null;
          })}
        </svg>
        {t >= 8.6 ? (
          <div
            style={{
              position: 'absolute', left: 540 - 200, top: 1360, width: 400, height: 250, background: '#F7E58A',
              transform: `rotate(-3deg) scale(${ease.back(prog(t, 8.6, 9.0))})`, boxShadow: '0 14px 22px rgba(40,25,10,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              fontFamily: P.marqueur, fontSize: 54, color: C.encre, lineHeight: 1.1, padding: 30,
            }}
          >
            <span style={{clipPath: `inset(-10px ${100 - prog(t, 8.8, 9.3) * 100}% -10px -10px)`}}>Toujours à l&apos;heure.</span>
          </div>
        ) : null}
      </AbsoluteFill>

      {/* Texte du hook */}
      {t < 3.6 ? (
        <div
          style={{
            position: 'absolute', zIndex: 10, top: 200, left: 120, right: 120, textAlign: 'center', fontFamily: P.main, fontWeight: 700,
            fontSize: 92, lineHeight: 1, color: C.encre, opacity: 1 - prog(t, 3.2, 3.6), transform: `rotate(-3deg)`,
            clipPath: `inset(-20px ${100 - prog(t, 0, 0.17) * 100}% -20px -20px)`,
          }}
        >
          Souris, tu ne conduis pas.
        </div>
      ) : null}

      {/* Fin : un dernier polaroid sort, vide, et se développe sur l'appel */}
      {t >= 9.4 ? <PolaroidFin t={t} /> : null}

      <AbsoluteFill style={{background: '#FFFFFF', opacity: flash}} />
      <Bande n={12} />
    </AbsoluteFill>
  );
};

const PolaroidFin: React.FC<{t: number}> = ({t}) => {
  const sortie = ease.out(prog(t, 9.4, 10.0));
  const vib = t < 10 ? Math.sin(t * 90) * 4 * (1 - sortie) : 0;
  const d = prog(t, 9.9, 10.9);
  const largeur = 860;
  const style: CSSProperties = {position: 'absolute', left: 540 - largeur / 2 + vib, top: mix(1950, 400, sortie), transform: `rotate(${mix(4, -1.5, sortie)}deg)`};
  const contenu = (
    <div style={{width: largeur - 40, height: 680, background: C.encre, position: 'relative'}}>
      <FinJP
        t={t}
        s={{police: P.main, policeNumero: P.main, poidsNumero: 700, couleur: C.cadre, couleurNumero: C.scotch, accent: C.scotch, tailleNumero: 150, fleche: (rb) => <FlecheMain rebond={rb} />}}
        p={(i) => prog(t, 10.4 + i * 0.12, 10.8 + i * 0.12)}
        boite={{left: 0, right: 0, top: 40}}
        sansLogo
        tailleTexte={68}
        ecart={14}
      />
    </div>
  );
  return (
    <div style={style}>
      <Polaroid photo={contenu} d={d} legende={[]} e={0} largeur={largeur} hauteurPhoto={680} bas={<LogoJP largeur={280} pastille style={{opacity: prog(t, 10.9, 11.2)}} />} />
    </div>
  );
};

const FlecheMain: React.FC<{rebond: number}> = ({rebond}) => (
  <svg width="120" height="120" viewBox="0 0 100 100" style={{transform: `translateY(${rebond * 20 - 10}px)`}}>
    <path d="M52 6 C46 30 56 52 50 80 M26 56 C36 66 44 74 50 86 C56 72 64 64 76 54" fill="none" stroke={C.scotch} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
