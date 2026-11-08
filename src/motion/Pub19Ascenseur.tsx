// 19. « Ding ! » — l'ascenseur (10 s).
import type {CSSProperties} from 'react';
import {AbsoluteFill} from 'remotion';
import {Bande, clamp, ease, FinJP, mix, prog, useT, Voiture} from './commun';
import {POLICES_MOTION as P} from './config';

const C = {acier: '#9CA3AB', cadre: '#15171A', ambre: '#FFB547', or: '#D9B46A', marbre: '#ECE6DC', texte: '#15171A'};
const PORTE = {x: 170, y: 430, l: 740, h: 1150};
const ETAGES = ['8', '7', '6', '5', '4', '3', '2', '1', 'RDC'];

/** Étage affiché : défile vite (0 – 1,9 s), RDC ensuite, repart à 8 sur la fin (boucle). */
const etage = (t: number) => {
  if (t >= 9.7) return '8';
  if (t < 1.9) return ETAGES[Math.min(7, Math.floor(t / 0.24))];
  return 'RDC';
};

/** Ouverture des portes (0 = fermées, 1 = ouvertes), avec inertie. */
const ouverture = (t: number) => {
  const o = t < 3 ? 0 : t < 4.7 ? ease.inOut(prog(t, 3, 4.7)) : 1;
  const f = t < 7.5 ? 0 : ease.inOut(prog(t, 7.5, 8.6));
  const amorti = t > 4.7 && t < 5.3 ? Math.sin((t - 4.7) * 18) * Math.exp(-(t - 4.7) * 9) * 0.02 : 0;
  return clamp(o - f + amorti, 0, 1.02);
};

const Acier: React.FC<{style?: CSSProperties; t: number; decalage?: number}> = ({style, t, decalage = 0}) => (
  <div style={{position: 'absolute', overflow: 'hidden', background: C.acier, ...style}}>
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}} preserveAspectRatio="none">
      <filter id="p19brosse">
        <feTurbulence type="fractalNoise" baseFrequency="0.9 0.006" numOctaves="2" seed="3" />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 -0.12" />
      </filter>
      <rect width="100%" height="100%" filter="url(#p19brosse)" />
    </svg>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.18), rgba(255,255,255,0.06) 40%, rgba(0,0,0,0.12))'}} />
    {/* Reflet qui glisse sur l'acier */}
    <div style={{position: 'absolute', top: -200, bottom: -200, width: 260, left: `${((t * 18 + decalage) % 160) - 30}%`, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)', transform: 'skewX(-18deg)', filter: 'blur(10px)'}} />
  </div>
);

const Hall: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: '#E9DFCF'}}>
    {/* Mur du fond et porte vitrée */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1180, background: 'linear-gradient(180deg, #E8DCC8, #D9CAB0)'}} />
    <div style={{position: 'absolute', left: 250, width: 580, top: 470, height: 640, background: 'linear-gradient(180deg, #CFE6F7 0%, #F8E7C2 55%, #C9C2B4 56%, #A9A398 100%)', border: '14px solid #2A2724', overflow: 'hidden', boxShadow: '0 0 60px rgba(255,236,190,0.8)'}}>
      {/* Lumière du matin */}
      <div style={{position: 'absolute', right: 40, top: 30, width: 120, height: 120, borderRadius: 60, background: 'radial-gradient(circle, #FFF6D8, rgba(255,230,160,0))'}} />
      <div style={{position: 'absolute', left: 276, top: 0, bottom: 0, width: 8, background: '#2A2724'}} />
      <Voiture largeur={500} style={{position: 'absolute', left: 30, top: 340}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,0.35), transparent 35%, transparent 60%, rgba(255,255,255,0.2) 70%, transparent 80%)'}} />
    </div>
    {/* Sol en marbre poli, en perspective */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 1180, bottom: 0, perspective: 600, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, #D9CFC0, ${C.marbre} 40%, #F4EFE7)`}} />
      <svg width="1080" height="740" style={{position: 'absolute', inset: 0}}>
        <filter id="p19marbre">
          <feTurbulence type="turbulence" baseFrequency="0.012 0.05" numOctaves="4" seed="8" />
          <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.36  -3 0 0 0 1.5" />
        </filter>
        <rect width="1080" height="740" filter="url(#p19marbre)" opacity="0.6" />
        {/* Joints des dalles en perspective (point de fuite au centre de la porte vitrée) */}
        {Array.from({length: 15}).map((_, i) => (
          <line key={i} x1={540 + (i - 7) * 40} y1={0} x2={540 + (i - 7) * 420} y2={740} stroke="#A99D8A" strokeWidth="3" />
        ))}
        {[18, 50, 100, 175, 290, 460, 700].map((y) => (
          <line key={y} x1={0} y1={y} x2={1080} y2={y} stroke="#A99D8A" strokeWidth="3" />
        ))}
      </svg>
      {/* Reflet de la porte vitrée sur le sol */}
      <div style={{position: 'absolute', left: 300, width: 480, top: 0, height: 360, background: 'linear-gradient(180deg, rgba(255,240,200,0.55), transparent)', filter: 'blur(14px)'}} />
    </div>
    {/* Appliques chaudes */}
    {[150, 930].map((x) => (
      <div key={x} style={{position: 'absolute', left: x - 120, top: 300, width: 240, height: 500, background: 'radial-gradient(ellipse at 50% 30%, rgba(255,200,120,0.55), transparent 65%)'}} />
    ))}
    <div style={{opacity: 0.9 + Math.sin(t * 2) * 0.02}} />
  </AbsoluteFill>
);

const Plaque: React.FC<{txt: string; p: number}> = ({txt, p}) => (
  <div
    style={{
      width: 700, padding: '22px 0', borderRadius: 10, textAlign: 'center', fontFamily: P.capitales, fontWeight: 700, fontSize: 40,
      color: '#3A2A0E', background: `linear-gradient(135deg, #8E6A2A, ${C.or} 30%, #F6E2A8 50%, ${C.or} 70%, #8E6A2A)`,
      boxShadow: '0 12px 30px rgba(40,25,5,0.45), inset 0 2px 0 rgba(255,255,255,0.5)', textShadow: '0 1px 0 rgba(255,240,200,0.6)',
      opacity: clamp(p * 1.5), transform: `translateY(${(1 - ease.back(p)) * 40}px) scale(${mix(0.9, 1, p)})`,
    }}
  >
    {txt}
  </div>
);

export const Pub19Ascenseur: React.FC = () => {
  const t = useT();
  const o = ouverture(t);
  // Caméra : avance dans le hall (4,6 – 7,4 s), recule pendant la fermeture
  const avance = ease.inOut(prog(t, 4.6, 7.4)) * (1 - ease.inOut(prog(t, 7.4, 8.2)));
  const zoomDecor = 1 + avance * 1.5;
  const zoomHall = 1 + avance * 0.55;
  const ding = t >= 1.9 && t < 2.4;
  const fin = t >= 8.2;
  const appel = fin ? (Math.floor(t * 3) % 2 ? 1 : 0.55) : 0.15;
  const ox = PORTE.x + PORTE.l / 2;
  const oy = PORTE.y + PORTE.h / 2;
  const graver: CSSProperties = {fontFamily: P.grotesk, fontWeight: 700, color: C.texte, textAlign: 'center', textShadow: '0 2px 0 rgba(255,255,255,0.45), 0 -1px 0 rgba(0,0,0,0.25)'};

  return (
    <AbsoluteFill style={{background: C.cadre, overflow: 'hidden'}}>
      <AbsoluteFill style={{transformOrigin: `${ox}px ${oy}px`, transform: `scale(${zoomHall})`, filter: `blur(${avance > 0.9 ? 0 : 0}px)`}}>
        <Hall t={t} />
      </AbsoluteFill>
      <AbsoluteFill style={{transformOrigin: `${ox}px ${oy}px`, transform: `scale(${zoomDecor})`}}>
        {/* Mur du palier (pierre sombre) avec l'ouverture de la cabine */}
        {[
          {left: 0, top: 0, width: 1080, height: PORTE.y - 30},
          {left: 0, top: PORTE.y + PORTE.h + 30, width: 1080, height: 1920 - PORTE.y - PORTE.h - 30},
          {left: 0, top: 0, width: PORTE.x - 30, height: 1920},
          {left: PORTE.x + PORTE.l + 30, top: 0, width: 1080 - PORTE.x - PORTE.l - 30, height: 1920},
        ].map((r, i) => (
          <div key={i} style={{position: 'absolute', ...r, background: 'linear-gradient(180deg, #2A2C30, #1C1E21)'}} />
        ))}
        {/* Cadre noir */}
        <div style={{position: 'absolute', left: PORTE.x - 30, top: PORTE.y - 30, width: PORTE.l + 60, height: PORTE.h + 30, border: `30px solid ${C.cadre}`, borderBottom: 'none', boxShadow: '0 0 0 3px #3A3D42'}} />
        {/* Portes coulissantes */}
        <div style={{position: 'absolute', left: PORTE.x, top: PORTE.y, width: PORTE.l, height: PORTE.h, overflow: 'hidden'}}>
          <Acier t={t} style={{left: -(PORTE.l / 2) * o, top: 0, width: PORTE.l / 2, height: PORTE.h, borderRight: '2px solid #6E747B', boxShadow: '8px 0 20px rgba(0,0,0,0.35)'}} />
          <Acier t={t} decalage={40} style={{left: PORTE.l / 2 + (PORTE.l / 2) * o, top: 0, width: PORTE.l / 2, height: PORTE.h, borderLeft: '2px solid #C8CDD3', boxShadow: '-8px 0 20px rgba(0,0,0,0.35)'}} />
        </div>
        {/* Seuil */}
        <div style={{position: 'absolute', left: PORTE.x - 30, top: PORTE.y + PORTE.h, width: PORTE.l + 60, height: 30, background: 'linear-gradient(180deg, #B9BEC4, #6E747B)'}} />
        {/* Afficheur d'étage ambre */}
        <div style={{position: 'absolute', left: 390, top: 250, width: 300, height: 130, borderRadius: 14, background: '#0B0B0C', border: '4px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, boxShadow: ding ? `0 0 60px ${C.ambre}88` : 'none'}}>
          <div style={{fontFamily: P.mono, fontWeight: 800, fontSize: 40, color: C.ambre, opacity: etage(t) === 'RDC' ? 0.25 : 1, textShadow: `0 0 14px ${C.ambre}`}}>▼</div>
          <div style={{fontFamily: P.mono, fontWeight: 800, fontSize: 96, color: C.ambre, textShadow: `0 0 18px ${C.ambre}, 0 0 40px ${C.ambre}88`, letterSpacing: 4}}>{etage(t)}</div>
        </div>
        {/* Bouton d'appel ↓ */}
        <div style={{position: 'absolute', left: 952, top: 920, width: 96, height: 170, borderRadius: 14, background: 'linear-gradient(180deg, #A9B0B8, #7E858D)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(0,0,0,0.5)'}}>
          <div style={{width: 66, height: 66, borderRadius: 33, background: '#1A1C1F', border: `4px solid ${fin ? C.ambre : '#555'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: P.mono, fontWeight: 800, fontSize: 40, color: C.ambre, opacity: 0.4 + appel * 0.6, boxShadow: fin ? `0 0 ${30 * appel}px ${C.ambre}` : 'none'}}>
            ↓
          </div>
        </div>
      </AbsoluteFill>

      {/* Hook gravé sur les portes */}
      {t < 3.1 ? (
        <div style={{...graver, position: 'absolute', left: PORTE.x + 50, right: 1080 - PORTE.x - PORTE.l + 50, top: 640, fontSize: 84, lineHeight: 1.05, opacity: clamp(t * 20) * (1 - prog(t, 2.8, 3.1))}}>
          Ton chauffeur t&apos;attend en bas.
        </div>
      ) : null}
      {ding ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center', fontFamily: P.grotesk, fontWeight: 700, fontSize: 70, color: C.ambre, opacity: 1 - prog(t, 2.1, 2.4), transform: `scale(${1 + prog(t, 1.9, 2.4) * 0.3})`, textShadow: `0 0 20px ${C.ambre}`}}>
          DING !
        </div>
      ) : null}

      {/* Plaques dorées dans le hall */}
      {t >= 5.4 && t < 7.9 ? (
        <div style={{position: 'absolute', left: 190, top: 330, display: 'flex', flexDirection: 'column', gap: 26, opacity: 1 - prog(t, 7.5, 7.9)}}>
          {['Confort · 3 500 F/h (promo)', 'Wi-Fi · Clim · Mini écran', 'Porte ouverte pour vous'].map((x, i) => (
            <Plaque key={x} txt={x} p={prog(t, 5.5 + i * 0.4, 5.9 + i * 0.4)} />
          ))}
        </div>
      ) : null}

      {/* Fin sur les portes fermées */}
      {t >= 8.4 && t < 9.95 ? (
        <div style={{opacity: 1 - prog(t, 9.65, 9.9)}}>
          <FinJP
            t={t}
            s={{police: P.grotesk, couleur: C.texte, couleurNumero: C.texte, accent: '#8A4F00', tailleNumero: 116, ombre: graver.textShadow as string, pastilleLogo: true}}
            p={(i) => prog(t, 8.45 + i * 0.1, 8.75 + i * 0.1)}
            haut={540}
            tailleTexte={56}
          />
        </div>
      ) : null}
      <Bande n={19} />
    </AbsoluteFill>
  );
};
