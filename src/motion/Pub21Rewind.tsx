// 21. « REWIND » — le résultat d'abord (18 s). La vidéo commence par l'arrivée, rembobine tout, puis rejoue en x2.
// L'histoire est une fonction d'un temps de récit τ ∈ [0, 1] ; le montage ne fait que faire varier τ (à l'envers, arrêt, x2).
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {Bande, clamp, ease, FinJP, hasard, mix, prog, useT, visibleJusqua} from './commun';
import {POLICES_MOTION as P, TARIFS} from './config';

const C = {fond: '#F6F5F1', noir: '#111111', vert: '#22C55E', bleu: '#2F6BFF', gris: '#D9D7D0', gris2: '#8A8880'};
const MESSAGE = 'Bonjour, un chauffeur à 7 h 30 ?';
const ROUTE: [number, number][] = [[230, 1350], [230, 1120], [470, 1120], [470, 900], [820, 900], [820, 640], [600, 640], [600, 470]];

/** Temps de récit τ en fonction du temps de la vidéo. */
const recit = (t: number) => {
  if (t < 1.5) return 1;
  if (t < 4) return mix(1, 0.45, prog(t, 1.5, 4));
  if (t < 6) return mix(0.45, 0.3, prog(t, 4, 6));
  if (t < 8) return mix(0.3, 0, prog(t, 6, 8));
  if (t < 9) return 0;
  if (t < 13) return prog(t, 9, 13);
  return 1;
};
const enRewind = (t: number) => t >= 0.6 && t < 8;
const heure = (tau: number) => {
  const m = Math.round(mix(30, 58, clamp((tau - 0.45) / 0.45)));
  return `07:${String(m).padStart(2, '0')}`;
};

const Telephone: React.FC<{tau: number}> = ({tau}) => {
  const n = Math.round(clamp(tau / 0.17) * MESSAGE.length);
  const envoye = tau >= 0.18;
  const confirme = clamp((tau - 0.21) / 0.04);
  return (
    <div style={{position: 'absolute', left: 230, top: 330, width: 620, height: 1180, borderRadius: 80, background: C.noir, padding: 22, boxShadow: '0 40px 80px rgba(0,0,0,0.25)'}}>
      <div style={{width: '100%', height: '100%', borderRadius: 60, background: '#ECE9E1', overflow: 'hidden', position: 'relative'}}>
        <div style={{height: 130, background: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 20, padding: '30px 34px 0', fontFamily: P.grotesk, fontWeight: 700, fontSize: 34, color: C.noir}}>
          <div style={{width: 64, height: 64, borderRadius: 32, background: C.noir, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26}}>JP</div>
          JP Service
        </div>
        <div style={{position: 'absolute', left: 30, right: 30, top: 200, display: 'flex', flexDirection: 'column', gap: 24}}>
          {n > 0 && envoye ? (
            <div style={{alignSelf: 'flex-end', maxWidth: 440, background: '#D9F8E5', borderRadius: '28px 28px 6px 28px', padding: '20px 26px', fontFamily: P.grotesk, fontSize: 36, color: C.noir}}>
              {MESSAGE} <span style={{color: C.bleu, fontSize: 24}}>✓✓</span>
            </div>
          ) : null}
          {confirme > 0 ? (
            <div style={{alignSelf: 'flex-start', background: '#fff', borderRadius: '28px 28px 28px 6px', padding: '20px 26px', fontFamily: P.grotesk, fontWeight: 700, fontSize: 38, color: C.vert, opacity: confirme, transform: `translateY(${(1 - confirme) * 60}px)`}}>
              ✓ Réservation confirmée
            </div>
          ) : null}
        </div>
        {/* Zone de saisie : le message se tape (ou se « dé-tape ») */}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 30, minHeight: 90, borderRadius: 45, background: '#fff', padding: '22px 30px', fontFamily: P.grotesk, fontSize: 34, color: C.noir}}>
          {!envoye ? (
            <>
              {MESSAGE.slice(0, n)}
              <span style={{display: 'inline-block', width: 3, height: 38, background: C.bleu, verticalAlign: 'middle', marginLeft: 2}} />
            </>
          ) : (
            <span style={{color: C.gris2}}>Message</span>
          )}
        </div>
      </div>
    </div>
  );
};

const Portiere: React.FC<{tau: number}> = ({tau}) => {
  const p = clamp((tau - 0.3) / 0.15);
  const ouvert = p < 0.45 ? Math.sin((p / 0.45) * Math.PI) : 0; // s'ouvre puis se referme
  const clim = tau * 2600; // l'icône tourne à l'envers quand τ diminue
  return (
    <>
      <svg width="1080" height="1920" style={{position: 'absolute'}}>
        {/* Carrosserie stylisée vue de côté */}
        <rect x="120" y="760" width="840" height="420" rx="70" fill={C.noir} />
        <path d="M260 760 L380 560 L760 560 L880 760 Z" fill={C.noir} />
        <path d="M300 750 L400 590 L560 590 L560 750 Z" fill="#CFE0FF" />
        <path d="M590 750 L590 590 L740 590 L840 750 Z" fill="#CFE0FF" />
        <circle cx="300" cy="1180" r="95" fill="#2A2A2A" stroke={C.gris} strokeWidth="14" />
        <circle cx="780" cy="1180" r="95" fill="#2A2A2A" stroke={C.gris} strokeWidth="14" />
        {/* Portière qui pivote (perspective simulée par l'échelle horizontale) */}
        <g transform={`translate(560 0) scale(${1 - ouvert * 0.75} 1) translate(-560 0)`}>
          <rect x="560" y="560" width="300" height="600" rx="24" fill="#2B2B2B" stroke={C.gris2} strokeWidth="4" />
          <path d="M590 750 L590 590 L740 590 L840 750 Z" fill="#B9CFF5" />
          <rect x="600" y="820" width="70" height="16" rx="8" fill={C.gris} />
        </g>
      </svg>
      {/* Icône de clim */}
      <div style={{position: 'absolute', left: 390, top: 1340, width: 300, height: 300, borderRadius: 150, background: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width="200" height="200" viewBox="-50 -50 100 100" style={{transform: `rotate(${clim}deg)`}}>
          {[0, 60, 120].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <line x1="0" y1="-40" x2="0" y2="40" stroke={C.bleu} strokeWidth="7" strokeLinecap="round" />
              <path d="M-10 -32 L0 -22 L10 -32 M-10 32 L0 22 L10 32" stroke={C.bleu} strokeWidth="6" fill="none" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 1660, textAlign: 'center', fontFamily: P.grotesk, fontWeight: 700, fontSize: 40, color: C.noir}}>Clim · 22 °C</div>
    </>
  );
};

const longueurs = ROUTE.slice(1).map((b, i) => Math.hypot(b[0] - ROUTE[i][0], b[1] - ROUTE[i][1]));
const total = longueurs.reduce((a, b) => a + b, 0);
const surRoute = (p: number): [number, number] => {
  let d = p * total;
  for (let i = 0; i < longueurs.length; i++) {
    if (d <= longueurs[i]) {
      const k = d / longueurs[i];
      return [mix(ROUTE[i][0], ROUTE[i + 1][0], k), mix(ROUTE[i][1], ROUTE[i + 1][1], k)];
    }
    d -= longueurs[i];
  }
  return ROUTE[ROUTE.length - 1];
};

const Carte: React.FC<{tau: number}> = ({tau}) => {
  const p = clamp((tau - 0.45) / 0.45);
  const [vx, vy] = surRoute(p);
  const chemin = `M${ROUTE.map((q) => q.join(' ')).join(' L')}`;
  return (
    <>
      <svg width="1080" height="1920" style={{position: 'absolute'}}>
        {Array.from({length: 7}).map((_, i) => (
          <rect key={`h${i}`} x="0" y={380 + i * 180} width="1080" height="34" fill="#E6E3DA" />
        ))}
        {Array.from({length: 5}).map((_, i) => (
          <rect key={`v${i}`} x={120 + i * 230} y="300" width="34" height="1320" fill="#E6E3DA" />
        ))}
        {Array.from({length: 18}).map((_, i) => (
          <rect key={`b${i}`} x={170 + (i % 4) * 230} y={430 + Math.floor(i / 4) * 180} width={160} height={110} rx="12" fill={hasard(i) > 0.7 ? '#DDEFD9' : '#EEECE6'} />
        ))}
        <path d={chemin} fill="none" stroke="#C9D7FF" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        <path d={chemin} fill="none" stroke={C.bleu} strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
        <circle cx={ROUTE[0][0]} cy={ROUTE[0][1]} r="26" fill="#fff" stroke={C.noir} strokeWidth="8" />
        <circle cx={ROUTE[ROUTE.length - 1][0]} cy={ROUTE[ROUTE.length - 1][1]} r="30" fill={C.vert} stroke="#fff" strokeWidth="8" />
        <g transform={`translate(${vx} ${vy})`}>
          <circle r="54" fill={C.bleu} opacity="0.18" />
          <rect x="-30" y="-30" width="60" height="60" rx="16" fill={C.noir} />
          <path d="M-14 6 L0 -12 L14 6" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 120, top: 1480, fontFamily: P.grotesk, fontWeight: 700, fontSize: 40, color: C.noir}}>Départ</div>
      <div style={{position: 'absolute', left: 640, top: 420, fontFamily: P.grotesk, fontWeight: 700, fontSize: 40, color: C.vert}}>Arrivée</div>
    </>
  );
};

const Coche: React.FC<{tau: number; claque: number}> = ({tau, claque}) => {
  const p = clamp((tau - 0.9) / 0.1);
  const s = mix(0.2, 1, ease.back(p)) * mix(1.25, 1, claque);
  return (
    <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, paddingBottom: 120}}>
      <svg width="560" height="560" viewBox="-60 -60 120 120" style={{transform: `scale(${s})`, opacity: clamp(p * 3)}}>
        <circle r="56" fill={C.vert} />
        <path d="M-26 2 L-8 20 L28 -18" stroke="#fff" strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(p * 1.4)} />
      </svg>
      <div style={{fontFamily: P.grotesk, fontWeight: 700, fontSize: 150, letterSpacing: -4, color: C.noir, lineHeight: 1, opacity: clamp(p * 2)}}>ARRIVÉ ✓</div>
      <div style={{fontFamily: P.mono, fontWeight: 800, fontSize: 210, color: C.noir, lineHeight: 1, opacity: clamp(p * 2)}}>07:58</div>
    </AbsoluteFill>
  );
};

const Histoire: React.FC<{tau: number; claque: number}> = ({tau, claque}) => {
  let scene: ReactNode;
  if (tau < 0.3) scene = <Telephone tau={tau} />;
  else if (tau < 0.45) scene = <Portiere tau={tau} />;
  else if (tau < 0.9) scene = <Carte tau={tau} />;
  else scene = tau >= 0.93 ? <Coche tau={tau} claque={claque} /> : <Carte tau={0.9} />;
  return (
    <AbsoluteFill>
      {scene}
      {tau >= 0.45 && tau < 0.93 ? (
        <div style={{position: 'absolute', right: 120, top: 260, fontFamily: P.mono, fontWeight: 800, fontSize: 80, color: C.noir}}>{heure(tau)}</div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Pub21Rewind: React.FC = () => {
  const t = useT();
  // Boucle : on rejoue l'image 0 sur les 10 dernières images
  const tb = t >= 17.67 ? t - 17.67 : t;
  const tau = t >= 17.67 ? 1 : recit(t);
  const claque = 1 - clamp(tb / 0.18);
  const rw = enRewind(tb);
  const jitter = rw ? (hasard(Math.floor(t * 30)) - 0.5) * 14 : 0;
  const tremble = tb >= 0.6 && tb < 1.5 ? Math.sin(t * 80) * 10 * (1 - prog(tb, 1.2, 1.5)) : 0;
  const lecture = t >= 9 && t < 13;
  const cta = visibleJusqua(t, 13.5, 17.6);
  const flou = rw ? 3 : lecture ? 1.2 : 0;
  const decal = rw ? 6 : lecture ? 2 : 0;
  const badge: CSSProperties = {position: 'absolute', top: 120, left: 120, padding: '14px 28px', borderRadius: 14, background: C.noir, color: '#fff', fontFamily: P.mono, fontWeight: 800, fontSize: 50, letterSpacing: 2};

  return (
    <AbsoluteFill style={{background: C.fond, overflow: 'hidden'}}>
      <svg width="0" height="0" style={{position: 'absolute'}}>
        {/* Effet VHS : décalage du canal bleu (pas de frange rouge) + flou de mouvement horizontal */}
        <filter id="p21vhs" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={`${flou} 0`} result="flou" />
          <feColorMatrix in="flou" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="rg" />
          <feColorMatrix in="flou" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
          <feOffset in="b" dx={decal} dy="0" result="b2" />
          <feBlend in="rg" in2="b2" mode="screen" />
        </filter>
      </svg>
      <AbsoluteFill style={{filter: rw || lecture ? 'url(#p21vhs)' : undefined, transform: `translate(${jitter + tremble}px, 0)`, opacity: 1 - cta}}>
        <Histoire tau={tau} claque={claque} />
      </AbsoluteFill>

      {/* Habillage VHS */}
      {rw || lecture ? (
        <>
          <AbsoluteFill style={{background: 'repeating-linear-gradient(180deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 5px)', opacity: rw ? 1 : 0.5}} />
          {rw ? <div style={{position: 'absolute', left: 0, right: 0, top: ((t * 900) % 2200) - 200, height: 90, background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.55), rgba(47,107,255,0.15), transparent)', transform: `translateX(${jitter * 3}px)`}} /> : null}
        </>
      ) : null}
      {rw ? <div style={{...badge, opacity: Math.floor(t * 4) % 2 ? 1 : 0.75}}>◀◀ REWIND</div> : null}
      {t >= 8 && t < 9 ? <div style={{...badge}}>{t < 8.5 ? '■ STOP' : '▶ PLAY'}</div> : null}
      {lecture ? <div style={{...badge, background: C.bleu}}>▶▶ x2</div> : null}
      {t >= 8.3 && t < 9.8 ? (
        <div style={{position: 'absolute', left: 120, right: 120, top: 1560, textAlign: 'center', fontFamily: P.grotesk, fontWeight: 700, fontSize: 90, color: C.noir, opacity: prog(t, 8.3, 8.5) * (1 - prog(t, 9.5, 9.8))}}>Tout ça…</div>
      ) : null}
      {t >= 12.3 && t < 13.7 ? (
        <div style={{position: 'absolute', left: 120, right: 120, top: 1560, textAlign: 'center', fontFamily: P.grotesk, fontWeight: 700, fontSize: 84, color: C.bleu, opacity: prog(t, 12.3, 12.5) * (1 - prog(t, 13.4, 13.7))}}>
          …en un seul message.
        </div>
      ) : null}

      {/* Appel à l'action : reste jusqu'à la fin */}
      {cta > 0 ? (
        <AbsoluteFill style={{opacity: cta}}>
          <FinJP
            t={t}
            s={{police: P.grotesk, couleur: C.noir, couleurNumero: C.noir, accent: C.bleu, tailleNumero: 150, pastilleLogo: true, fleche: (rb) => <FlecheV rebond={rb} />}}
            p={(i) => prog(t, 13.5 + i * 0.12, 13.85 + i * 0.12)}
            haut={420}
          />
          <div style={{position: 'absolute', left: 120, right: 120, top: 1300, textAlign: 'center', fontFamily: P.grotesk, fontSize: 38, color: C.gris2, opacity: prog(t, 14.2, 14.5)}}>{TARIFS.ecoConfortPromo}</div>
          <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <svg width="110" height="110" viewBox="-60 -60 120 120">
              <circle r="56" fill={C.vert} />
              <path d="M-26 2 L-8 20 L28 -18" stroke="#fff" strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </AbsoluteFill>
      ) : null}
      <Bande n={21} />
    </AbsoluteFill>
  );
};

const FlecheV: React.FC<{rebond: number}> = ({rebond}) => (
  <svg width="110" height="110" viewBox="0 0 100 100" style={{transform: `translateY(${rebond * 22 - 11}px)`}}>
    <path d="M50 8 V78 M18 50 L50 84 L82 50" fill="none" stroke={C.vert} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
