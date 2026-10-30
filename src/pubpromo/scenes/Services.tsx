import {interpolate} from 'remotion';
import {IconeHorloge} from '../../components/Icones';
import {PUB_PROMO} from '../../config';
import {C, cheminBezier, Compteur, doux, INTER, pointBezier, ressort, Sortie, squash, useTemps} from '../ui';

// 4. Les services dans un écran d'appli façon néobanque : onglets à pastille glissante, panneaux qui défilent en ressort.
// Éco et Confort sans prix (les prix sont révélés dans la promo) ; Aéroport « dès 8 000 FCFA » ; Voyage « 50 000 FCFA/jour ».
const D = PUB_PROMO.scenes.services;
const FIN = PUB_PROMO.scenes.slogan;
const S = PUB_PROMO.services;
const TEL = {x: 200, y: 330, l: 680, h: 1260};
const LARG = TEL.l - 28; // largeur de l'écran

const Titre: React.FC<{titre: string; sous: string}> = ({titre, sous}) => (
  <div style={{padding: '0 44px'}}>
    <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 28, color: C.gris, letterSpacing: '0.02em'}}>{sous}</div>
    <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 76, color: C.blanc, letterSpacing: '-0.045em', marginTop: 6}}>{titre}</div>
  </div>
);

// Pictogrammes animés (fonction du temps local k = secondes depuis l'apparition)
const Picto: React.FC<{nom: string; k: number}> = ({nom, k}) => {
  const trait = {fill: 'none', stroke: C.blanc, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={70} height={70} viewBox="0 0 48 48">
      {nom === 'voiture' && (
        <g {...trait}>
          <path d="M6 32v-6l4-9c1-2 2-3 5-3h18c3 0 4 1 5 3l4 9v6Z" />
          <circle cx={14} cy={33} r={4} fill={C.fond} />
          <circle cx={34} cy={33} r={4} fill={C.fond} />
          <path d="M12 24h24" stroke={C.or} />
        </g>
      )}
      {nom === 'chauffeur' && (
        <g {...trait}>
          <circle cx={24} cy={20} r={8} />
          <path d="M10 42c2-8 8-11 14-11s12 3 14 11" />
          <path d="M14 13c3-5 17-5 20 0l-2 3H16Z" fill={C.or} stroke={C.or} />
        </g>
      )}
      {nom === 'wifi' &&
        [0, 1, 2].map((i) => (
          <path key={i} d={`M${24 - 6 - i * 7} ${30 - 4 - i * 5}a${8 + i * 7} ${8 + i * 7} 0 0 1 ${12 + i * 14} 0`} {...trait}
            stroke={(Math.floor(k * 3) % 4) > i ? C.or : 'rgba(255,255,255,0.35)'} />
        ))}
      {nom === 'wifi' && <circle cx={24} cy={34} r={3} fill={C.blanc} />}
      {nom === 'clim' && (
        <g {...trait} transform={`rotate(${k * 60} 24 24)`}>
          {[0, 60, 120].map((a) => (
            <g key={a} transform={`rotate(${a} 24 24)`}>
              <path d="M24 6v36M19 10l5 4 5-4M19 38l5-4 5 4" />
            </g>
          ))}
        </g>
      )}
      {nom === 'ecran' && (
        <g {...trait}>
          <rect x={6} y={10} width={36} height={24} rx={4} />
          <path d="M18 40h12" />
          <path d="M21 17l9 5-9 5Z" fill={C.or} stroke={C.or} transform={`scale(${1 + 0.08 * Math.sin(k * 6)})`} style={{transformOrigin: '24px 22px'}} />
        </g>
      )}
      {nom === 'premium' && (
        <g {...trait}>
          <path d="M6 34v-6l4-8c1-2 2-3 5-3h18c3 0 4 1 5 3l4 8v6Z" />
          <path d="M24 3l2.5 5 5.5.8-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.5-.8Z" fill={C.or} stroke={C.or} strokeWidth={1.5} transform={`rotate(${Math.sin(k * 3) * 10} 24 10)`} />
        </g>
      )}
    </svg>
  );
};

const Eco: React.FC<{t: number; fps: number}> = ({t, fps}) => (
  <div>
    <Titre sous="SERVICE" titre="Éco" />
    <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 50, padding: '0 34px'}}>
      {S.eco.map((e, i) => {
        const {v, scaleX, scaleY} = squash(t, e.a, fps, {}, 1);
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, height: 150, padding: '0 30px', borderRadius: 36, background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.10)',
            opacity: t < e.a ? 0.25 : 1, transform: `translateX(${(1 - Math.min(1, v)) * 60}px) scale(${scaleX}, ${scaleY})`}}>
            <div style={{width: 96, height: 96, borderRadius: 28, background: t < e.a ? 'rgba(255,255,255,0.06)' : 'rgba(232,176,75,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {i === 2 ? <IconeHorloge taille={66} angle={(t - e.a) * 200} couleur={C.or} /> : <Picto nom={i === 0 ? 'voiture' : 'chauffeur'} k={t - e.a} />}
            </div>
            <span style={{flex: 1, fontFamily: INTER, fontWeight: 700, fontSize: 40, color: C.blanc, letterSpacing: '-0.02em'}}>{e.texte}</span>
            <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 40, color: C.or, opacity: v, transform: `scale(${v})`}}>✓</span>
          </div>
        );
      })}
    </div>
  </div>
);

const Confort: React.FC<{t: number; fps: number}> = ({t, fps}) => (
  <div>
    <Titre sous="SERVICE" titre="Confort" />
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginTop: 50, padding: '0 34px'}}>
      {S.confort.map((e, i) => {
        const {v, scaleX, scaleY} = squash(t, e.a, fps, {}, 1.2);
        return (
          <div key={i} style={{height: 270, borderRadius: 40, background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${t >= e.a ? 'rgba(232,176,75,0.45)' : 'rgba(255,255,255,0.10)'}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22,
            opacity: t < e.a ? 0.25 : 1, transform: `scale(${(0.85 + 0.15 * Math.min(1, v)) * scaleX}, ${(0.85 + 0.15 * Math.min(1, v)) * scaleY})`}}>
            <Picto nom={['wifi', 'clim', 'ecran', 'premium'][i]} k={Math.max(0, t - e.a)} />
            <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 36, color: C.blanc, letterSpacing: '-0.02em'}}>{e.texte}</span>
          </div>
        );
      })}
    </div>
  </div>
);

const VOL = [60, 560, 160, 420, 360, 520, 600, 200];
const Aeroport: React.FC<{t: number; fps: number}> = ({t, fps}) => {
  const p = doux(t, S.debuts[2] + 0.2, S.debuts[2] + 2.4);
  const av = pointBezier(VOL, p), av2 = pointBezier(VOL, Math.min(1, p + 0.01));
  const ang = (Math.atan2(av2.y - av.y, av2.x - av.x) * 180) / Math.PI;
  const v = ressort(t, S.aeroport.compteur, fps);
  return (
    <div>
      <Titre sous="TRANSFERT" titre="Aéroport" />
      <svg width={LARG} height={620} style={{display: 'block', marginTop: 10}}>
        <path d={cheminBezier(VOL)} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round" />
        <path d={cheminBezier(VOL)} pathLength={1} fill="none" stroke={C.or} strokeWidth={5} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
        <circle cx={60} cy={560} r={14} fill={C.blanc} />
        <circle cx={600} cy={200} r={14} fill={C.or} />
        <g transform={`translate(${av.x} ${av.y}) rotate(${ang + 90})`}>
          <path d="M0 -34 C4 -34 5 -28 5 -22 L5 -8 L30 6 L30 13 L5 5 L4 22 L12 28 L12 33 L0 30 L-12 33 L-12 28 L-4 22 L-5 5 L-30 13 L-30 6 L-5 -8 L-5 -22 C-5 -28 -4 -34 0 -34Z" fill={C.blanc} />
        </g>
      </svg>
      <div style={{textAlign: 'center', marginTop: -40, opacity: Math.min(1, v * 2), transform: `translateY(${(1 - v) * 40}px)`}}>
        <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 40, color: C.gris}}>dès </span>
        <Compteur cible={S.aeroport.montant} a={S.aeroport.compteur} t={t} fps={fps} style={{fontFamily: INTER, fontWeight: 700, fontSize: 120, color: C.blanc, letterSpacing: '-0.05em'}} />
        <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 40, color: C.or}}> FCFA</span>
      </div>
    </div>
  );
};

// Cameroun très stylisé (boîte 560 × 620) et villes reliées à Douala.
const CAMEROUN = '300,0 334,58 322,120 364,160 334,212 402,252 432,300 470,330 500,420 540,560 420,604 300,592 200,562 190,502 150,462 106,424 160,382 202,332 252,282 270,202 290,122 270,60';
const VILLES: Record<string, [number, number]> = {Douala: [196, 458], Yaoundé: [306, 470], Buea: [150, 428], Kribi: [206, 528], Limbé: [118, 446]};
const Voyage: React.FC<{t: number; fps: number}> = ({t, fps}) => {
  const [dx, dy] = VILLES.Douala;
  const v = ressort(t, S.voyage.prix, fps);
  return (
    <div>
      <Titre sous="VOYAGES" titre="Hors de Douala" />
      <svg width={LARG} height={640} viewBox="40 -10 560 640" style={{display: 'block', marginTop: 10}}>
        <polygon points={CAMEROUN} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.28)" strokeWidth={3} strokeLinejoin="round" />
        {S.voyage.villes.map((c, i) => {
          const [x, y] = VILLES[c.nom];
          const p = doux(t, c.a, c.a + 0.6);
          const k = ressort(t, c.a + 0.4, fps);
          const gauche = x < dx;
          return (
            <g key={i}>
              <path d={`M${dx} ${dy} Q${(dx + x) / 2} ${Math.min(dy, y) - 60} ${x} ${y}`} pathLength={1} fill="none" stroke={C.or} strokeWidth={4} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
              <circle cx={x} cy={y} r={9 * Math.min(1.3, k)} fill={C.blanc} />
              <text x={x + (gauche ? -16 : 16)} y={y + (c.nom === 'Kribi' ? 36 : c.nom === 'Buea' ? -14 : 8)} textAnchor={gauche ? 'end' : 'start'} fontFamily={INTER} fontWeight={700} fontSize={30} fill={C.blanc} opacity={Math.min(1, k)}>{c.nom}</text>
            </g>
          );
        })}
        <circle cx={dx} cy={dy} r={16} fill={C.rouge} />
        <circle cx={dx} cy={dy} r={16 + ((t * 30) % 22)} fill="none" stroke={C.rouge} strokeWidth={3} opacity={1 - ((t * 30) % 22) / 22} />
        <text x={dx + 24} y={dy + 40} fontFamily={INTER} fontWeight={700} fontSize={30} fill={C.rouge}>Douala</text>
      </svg>
      <div style={{textAlign: 'center', marginTop: -10, opacity: Math.min(1, v * 2), transform: `translateY(${(1 - v) * 40}px)`}}>
        <Compteur cible={S.voyage.montant} a={S.voyage.prix} t={t} fps={fps} style={{fontFamily: INTER, fontWeight: 700, fontSize: 104, color: C.blanc, letterSpacing: '-0.05em'}} />
        <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 38, color: C.or}}> FCFA/jour</span>
        <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 28, color: C.gris, marginTop: 4}}>Véhicule + chauffeur</div>
      </div>
    </div>
  );
};

export const Services: React.FC = () => {
  const {t, fps} = useTemps(D);
  const entree = squash(t, D + 0.02, fps, {damping: 14}, 0.6);
  // Index actif « à ressort » : chaque changement d'onglet ajoute un ressort de 0 à 1
  const actif = S.debuts.slice(1).reduce((s, a) => s + ressort(t, a - 0.25, fps, {damping: 18}), 0);
  const PANNEAUX = [Eco, Confort, Aeroport, Voyage];
  const pill = (LARG - 48) / 4;
  return (
    <Sortie t={t} fin={FIN}>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, rgba(232,176,75,0.08), transparent 60%), ${C.fond}`}} />
      <div style={{position: 'absolute', left: TEL.x, top: TEL.y, width: TEL.l, height: TEL.h, borderRadius: 96, background: '#1B1B1D', padding: 14, boxSizing: 'border-box',
        boxShadow: '0 60px 120px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(255,255,255,0.10)',
        opacity: Math.min(1, entree.v * 1.5), transform: `translateY(${(1 - entree.v) * 300}px) scale(${entree.scaleX}, ${entree.scaleY})`}}>
        <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 82, background: '#0E0E10', overflow: 'hidden'}}>
          {/* Barre d'état + îlot */}
          <div style={{position: 'absolute', top: 26, left: 50, fontFamily: INTER, fontWeight: 600, fontSize: 26, color: C.blanc}}>9:41</div>
          <div style={{position: 'absolute', top: 20, left: '50%', width: 180, height: 46, marginLeft: -90, borderRadius: 24, background: '#000'}} />
          {/* Onglets à pastille glissante */}
          <div style={{position: 'absolute', top: 110, left: 24, right: 24, height: 72, borderRadius: 36, background: 'rgba(255,255,255,0.06)'}}>
            <div style={{position: 'absolute', top: 6, left: 6 + actif * pill, width: pill - 12 + 12, height: 60, borderRadius: 30, background: C.blanc}} />
            {S.onglets.map((o, i) => (
              <div key={o} style={{position: 'absolute', top: 0, left: i * pill + 6, width: pill, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: INTER, fontWeight: 700, fontSize: 22, letterSpacing: '0.04em', color: Math.abs(actif - i) < 0.5 ? C.fond : C.gris}}>{o}</div>
            ))}
          </div>
          {/* Panneaux */}
          {PANNEAUX.map((Panneau, i) => (
            <div key={i} style={{position: 'absolute', top: 230, left: 0, width: LARG, transform: `translateX(${(i - actif) * LARG}px)`, opacity: interpolate(Math.abs(i - actif), [0, 1], [1, 0.2], {extrapolateRight: 'clamp'})}}>
              {Math.abs(i - actif) < 1.2 && <Panneau t={t} fps={fps} />}
            </div>
          ))}
        </div>
      </div>
    </Sortie>
  );
};
