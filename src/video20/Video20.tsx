// Video20 — « Chauffeur à la journée » (20 s, 1080×1920, 30 i/s).
// Même design system que Video15 (Fond, Legende, Fin réutilisés). Rouge en accent seulement,
// silhouettes plates sans visage. Textes, positions et volumes : VIDEO20 dans config.ts.
import {AbsoluteFill, interpolate, Easing, Sequence, spring, useCurrentFrame} from 'remotion';
import {COULEURS, POLICES, VIDEO20} from '../config';
import {Finition} from '../components/Effets';
import {IconeCoche, IconeHorloge} from '../components/Icones';
import {Son} from '../components/Son';
import {Fin, Fond, Legende, fondu} from '../video15/Video15';

const T = VIDEO20.textes;
const fps = 30;
const s = (sec: number) => Math.round(sec * fps);
const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ── 0–3 s : l'agenda se remplit en cascade ──
const Agenda: React.FC = () => {
  const f = useCurrentFrame();
  const carte = spring({frame: f, fps, config: {damping: 18}});
  return (
    <AbsoluteFill>
      <Fond />
      <div style={{position: 'absolute', left: 110, right: 110, top: 330, height: 860, borderRadius: 48, background: 'linear-gradient(160deg, #1b1b1f, #0b0b0d)',
        border: '1.5px solid rgba(255,255,255,.08)', boxShadow: '0 40px 120px rgba(0,0,0,.7)', opacity: carte, transform: `translateY(${(1 - carte) * 60}px)`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 56, top: 50, fontFamily: POLICES.titre, fontWeight: 800, fontSize: 40, letterSpacing: '0.2em', color: COULEURS.blanc}}>{T.jour}</div>
        <div style={{position: 'absolute', right: 56, top: 50, fontFamily: POLICES.texte, fontWeight: 600, fontSize: 32, color: COULEURS.gris}}>{T.rendezVous.length} / {T.rendezVous.length}</div>
        <div style={{position: 'absolute', left: 56, right: 56, top: 120, height: 1.5, background: 'rgba(255,255,255,.1)'}} />
        {T.rendezVous.map((r, i) => {
          const a = 6 + i * 7;
          const p = spring({frame: f - a, fps, config: {damping: 15, stiffness: 140}});
          return (
            <div key={r.heure} style={{position: 'absolute', left: 56, right: 56, top: 160 + i * 132, height: 112, borderRadius: 24, background: 'rgba(255,255,255,.05)',
              display: 'flex', alignItems: 'center', gap: 30, padding: '0 30px', boxSizing: 'border-box', opacity: p, transform: `translateX(${(1 - p) * 120}px)`}}>
              <div style={{width: 6, height: 60, borderRadius: 3, background: i === 0 ? COULEURS.rougeNeon : 'rgba(255,255,255,.25)'}} />
              <div style={{fontFamily: POLICES.titre, fontWeight: 800, fontSize: 40, color: COULEURS.blanc, width: 130}}>{r.heure}</div>
              <div style={{flex: 1, fontFamily: POLICES.texte, fontWeight: 700, fontSize: 38, color: COULEURS.blanc}}>{r.titre}</div>
              <div style={{fontFamily: POLICES.texte, fontWeight: 600, fontSize: 30, color: COULEURS.gris}}>{r.lieu}</div>
            </div>
          );
        })}
      </div>
      <Legende texte={T.agenda} f={f} entree={22} sortie={s(3) + 6} top={1290} taille={84} />
      {T.rendezVous.map((r, i) => <Son key={r.heure} nom="pop" a={6 + i * 7} volume={VIDEO20.sons.ligne} />)}
    </AbsoluteFill>
  );
};

// Pictos plats du stress (blanc, une touche de rouge au plus).
const Picto: React.FC<{nom: string}> = ({nom}) => {
  if (nom === 'Retard') return <IconeHorloge taille={120} angle={300} couleur={COULEURS.blanc} />;
  return (
    <svg width={120} height={120} viewBox="0 0 120 120">
      {nom === 'Parking' && (
        <g>
          <rect x={14} y={14} width={92} height={92} rx={20} fill="none" stroke="#fff" strokeWidth={7} />
          <text x={60} y={84} textAnchor="middle" fontFamily={POLICES.titre} fontWeight={900} fontSize={64} fill="#fff">P</text>
          <line x1={22} y1={98} x2={98} y2={22} stroke={COULEURS.rougeNeon} strokeWidth={8} strokeLinecap="round" />
        </g>
      )}
      {nom === 'Chaleur' && (
        <g stroke="#fff" strokeWidth={7} strokeLinecap="round" fill="none">
          <circle cx={60} cy={60} r={22} />
          {Array.from({length: 8}, (_, k) => {
            const ang = (k * Math.PI) / 4;
            return <line key={k} x1={60 + Math.cos(ang) * 34} y1={60 + Math.sin(ang) * 34} x2={60 + Math.cos(ang) * 48} y2={60 + Math.sin(ang) * 48} />;
          })}
        </g>
      )}
      {nom === 'Trafic' && (
        <g>
          <rect x={38} y={8} width={44} height={104} rx={16} fill="none" stroke="#fff" strokeWidth={7} />
          <circle cx={60} cy={34} r={10} fill={COULEURS.rougeNeon} />
          <circle cx={60} cy={60} r={10} fill="rgba(255,255,255,.35)" />
          <circle cx={60} cy={86} r={10} fill="rgba(255,255,255,.35)" />
        </g>
      )}
    </svg>
  );
};

// ── 3–8 s : les soucis tombent et s'empilent ──
const PILE = [
  {x: 170, y: 870, rot: -4},
  {x: 550, y: 870, rot: 3},
  {x: 360, y: 600, rot: -2},
  {x: 400, y: 330, rot: 5},
];
const Stress: React.FC = () => {
  const f = useCurrentFrame();
  // Après la chute, la pile s'estompe un peu pour laisser la question au premier plan.
  const recul = interpolate(f, [80, 110], [1, 0.45], clampOpts);
  return (
    <AbsoluteFill>
      <Fond teinte="#140808" />
      <div style={{position: 'absolute', inset: 0, opacity: recul}}>
        {T.stress.map((nom, i) => {
          const a = 6 + i * 13;
          const chute = spring({frame: f - a, fps, config: {damping: 11, stiffness: 120, mass: 0.9}});
          const p = PILE[i];
          const y = interpolate(chute, [0, 1], [-420, p.y]);
          const rot = interpolate(chute, [0, 1], [p.rot * 6, p.rot]);
          return (
            <div key={nom} style={{position: 'absolute', left: p.x, top: y, width: 360, height: 250, borderRadius: 40, background: 'linear-gradient(160deg, #1d1d22, #0e0e11)',
              border: '1.5px solid rgba(255,255,255,.1)', boxShadow: '0 30px 70px rgba(0,0,0,.6)', transform: `rotate(${rot}deg)`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: f >= a ? 1 : 0}}>
              <Picto nom={nom} />
              <div style={{fontFamily: POLICES.titre, fontWeight: 800, fontSize: 40, color: COULEURS.blanc}}>{nom}</div>
            </div>
          );
        })}
      </div>
      <Legende texte={T.question} f={f} entree={72} sortie={s(5) + 6} top={1220} taille={88} />
      {T.stress.map((nom, i) => <Son key={nom} nom="tic" a={14 + i * 13} volume={VIDEO20.sons.chute} />)}
    </AbsoluteFill>
  );
};

// Voiture vue de dessus (silhouette plate).
const VoitureDessus: React.FC = () => (
  <svg width={96} height={50} viewBox="0 0 96 50" style={{position: 'absolute', left: -48, top: -25}}>
    <rect x={2} y={4} width={92} height={42} rx={16} fill="#f2f2f2" />
    <rect x={56} y={9} width={20} height={32} rx={6} fill="#1a1a1e" />
    <rect x={18} y={10} width={16} height={30} rx={5} fill="#1a1a1e" />
    <rect x={2} y={8} width={4} height={8} rx={2} fill={COULEURS.rougeNeon} />
    <rect x={2} y={34} width={4} height={8} rx={2} fill={COULEURS.rougeNeon} />
  </svg>
);

// ── 8–15 s : carte stylisée de Douala, la voiture valide chaque rendez-vous ──
const DEPART = 12;
const ETAPE = 42; // images entre deux rendez-vous
const Carte: React.FC = () => {
  const f = useCurrentFrame();
  const P = VIDEO20.pins;
  const arrivee = (k: number) => DEPART + k * ETAPE;
  // Position de la voiture : segment courant, progression adoucie.
  const seg = Math.min(P.length - 2, Math.max(0, Math.floor((f - DEPART) / ETAPE)));
  const t = interpolate(f, [arrivee(seg), arrivee(seg + 1)], [0, 1], {...clampOpts, easing: Easing.inOut(Easing.cubic)});
  const A = P[seg];
  const B = P[seg + 1];
  const cx = A.x + (B.x - A.x) * t;
  const cy = A.y + (B.y - A.y) * t;
  const angle = (Math.atan2(B.y - A.y, B.x - A.x) * 180) / Math.PI;
  const apparition = interpolate(f, [0, 14], [0, 1], clampOpts);
  const zoom = interpolate(f, [0, s(7)], [1, 1.06], clampOpts);
  const rues = Array.from({length: 14}, (_, i) => i);
  return (
    <AbsoluteFill>
      <Fond teinte="#0f0f12" />
      <div style={{position: 'absolute', left: 0, top: 300, width: 1080, height: 880, opacity: apparition, transform: `scale(${zoom})`}}>
        <svg width={1080} height={880} style={{position: 'absolute', inset: 0}}>
          {/* Rues */}
          {rues.map((i) => <line key={`h${i}`} x1={0} y1={i * 68 + 20} x2={1080} y2={i * 68 + 60} stroke="rgba(255,255,255,.06)" strokeWidth={i % 3 ? 2 : 5} />)}
          {rues.map((i) => <line key={`v${i}`} x1={i * 84 + 40} y1={0} x2={i * 84 - 20} y2={880} stroke="rgba(255,255,255,.06)" strokeWidth={i % 4 ? 2 : 5} />)}
          {/* Le Wouri */}
          <path d="M0 0 L120 0 C150 160 80 300 120 460 C160 620 90 760 130 880 L0 880Z" fill="#14171c" />
          <text x={58} y={440} transform="rotate(-90 58 440)" textAnchor="middle" fontFamily={POLICES.texte} fontWeight={700} fontSize={26} letterSpacing="0.4em" fill="rgba(255,255,255,.25)">{T.fleuve}</text>
          {/* Trajet à venir (pointillés) puis trajet parcouru */}
          <polyline points={P.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth={4} strokeDasharray="10 14" />
          <polyline points={[...P.slice(0, seg + 1), {x: cx, y: cy}].map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={COULEURS.rougeNeon} strokeWidth={7}
            strokeLinejoin="round" strokeLinecap="round" opacity={f >= DEPART ? 1 : 0} style={{filter: `drop-shadow(0 0 10px ${COULEURS.rouge})`}} />
        </svg>
        {/* Pins, noms de quartier et coches */}
        {P.map((p, k) => {
          const coche = spring({frame: f - arrivee(k), fps, config: {damping: 12, stiffness: 160}});
          const gauche = p.x > 540;
          return (
            <div key={k}>
              <div style={{position: 'absolute', left: p.x - 16, top: p.y - 16, width: 32, height: 32, borderRadius: 16, background: COULEURS.noir, border: '5px solid #fff', boxSizing: 'border-box'}} />
              <div style={{position: 'absolute', top: p.y - 64, left: gauche ? undefined : p.x + 30, right: gauche ? 1080 - p.x + 30 : undefined,
                fontFamily: POLICES.texte, fontWeight: 600, fontSize: 30, color: COULEURS.gris, whiteSpace: 'nowrap'}}>
                {T.rendezVous[k].heure} · {T.rendezVous[k].lieu}
              </div>
              <div style={{position: 'absolute', left: p.x - 30, top: p.y - 30, width: 60, height: 60, borderRadius: 30, background: COULEURS.whatsapp,
                display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${coche})`, boxShadow: '0 8px 24px rgba(0,0,0,.5)'}}>
                <IconeCoche taille={36} couleur={COULEURS.blanc} />
              </div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: cx, top: cy, transform: `rotate(${angle}deg)`}}><VoitureDessus /></div>
      </div>
      <Legende texte={T.route} f={f} entree={8} sortie={104} top={1260} taille={76} />
      <div style={{position: 'absolute', left: 90, right: 90, top: 1250, opacity: fondu(f, 108, s(7) + 6, 10), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
        <div style={{fontFamily: POLICES.titre, fontWeight: 800, fontSize: 66, color: COULEURS.blanc, letterSpacing: '-0.02em'}}>{T.offre}</div>
        <div style={{fontFamily: POLICES.titre, fontWeight: 600, fontSize: 46, color: COULEURS.gris}}>{T.service}</div>
        <div style={{fontFamily: POLICES.titre, fontWeight: 900, fontSize: 84, color: COULEURS.blanc, whiteSpace: 'nowrap'}}>{T.prix}</div>
      </div>
      <Son nom="whooshCourt" a={DEPART} volume={VIDEO20.sons.passage} />
      {P.map((_, k) => <Son key={k} nom="tic" a={arrivee(k)} volume={VIDEO20.sons.coche} />)}
    </AbsoluteFill>
  );
};

const Final: React.FC = () => <Fin sortie={s(5) + 30} reservez={T.reservez} />;

export const Video20: React.FC = () => {
  const {scenes} = VIDEO20;
  const bloc = (debut: number, fin: number, C: React.FC) => (
    <Sequence from={s(debut)} durationInFrames={s(fin - debut)}><C /></Sequence>
  );
  return (
    <AbsoluteFill style={{background: COULEURS.noir}}>
      {bloc(scenes.agenda, scenes.stress, Agenda)}
      {bloc(scenes.stress, scenes.carte, Stress)}
      {bloc(scenes.carte, scenes.fin, Carte)}
      {bloc(scenes.fin, VIDEO20.dureeS, Final)}
      <Finition />
    </AbsoluteFill>
  );
};
