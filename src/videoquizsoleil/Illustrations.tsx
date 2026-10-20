// Illustrations « flat » de VideoQuizSoleil : personnages souriants, réveil cartoon, berline,
// avion, nuages, étincelles et confettis. Tout est en SVG, animé à partir de l'image courante `f`.
import {random} from 'remotion';
import {VIDEO_QUIZ_SOLEIL} from '../config';

const P = VIDEO_QUIZ_SOLEIL.palette;

export type Expression = 'sourire' | 'surpris' | 'baille' | 'detendu';

// Personnage (buste + bras) dans une boîte 200×300, la base du buste en bas.
// `brasG` / `brasD` : angle en degrés depuis la verticale (0 = bras le long du corps, 180 = levé).
export const Perso: React.FC<{
  expression?: Expression; haut?: string; peau?: string; tete?: number; brasG?: number; brasD?: number;
  bouche?: number; casquette?: boolean; lunettes?: boolean; largeur?: number;
}> = ({expression = 'sourire', haut = P.turquoise, peau = P.peau, tete = 0, brasG = 12, brasD = 12, bouche = 1, casquette = false, lunettes = false, largeur = 200}) => {
  const bras = (x: number, angle: number, sens: number) => {
    const a = (angle * Math.PI) / 180;
    const ex = x + Math.sin(a) * 78 * sens, ey = 170 + Math.cos(a) * 78;
    return (
      <g>
        <line x1={x} y1={170} x2={ex} y2={ey} stroke={haut} strokeWidth={24} strokeLinecap="round" />
        <circle cx={ex} cy={ey} r={13} fill={peau} />
      </g>
    );
  };
  const yeux = () => {
    if (expression === 'surpris') {
      return [80, 120].map((x) => (
        <g key={x}><circle cx={x} cy={92} r={13} fill="#fff" /><circle cx={x} cy={93} r={6.5} fill={P.encre} /></g>
      ));
    }
    if (expression === 'baille') {
      return [80, 120].map((x) => <path key={x} d={`M${x - 10} 94 Q${x} 99 ${x + 10} 94`} stroke={P.encre} strokeWidth={4.5} fill="none" strokeLinecap="round" />);
    }
    if (expression === 'detendu') {
      return [80, 120].map((x) => <path key={x} d={`M${x - 10} 95 Q${x} 85 ${x + 10} 95`} stroke={P.encre} strokeWidth={5} fill="none" strokeLinecap="round" />);
    }
    return [80, 120].map((x) => <circle key={x} cx={x} cy={92} r={6.5} fill={P.encre} />);
  };
  const boucheEl = () => {
    if (expression === 'surpris') return <ellipse cx={100} cy={122} rx={9} ry={12} fill={P.encre} />;
    if (expression === 'baille') return <ellipse cx={100} cy={122} rx={12} ry={4 + 14 * bouche} fill={P.encre} />;
    return <path d="M82 114 Q100 134 118 114" stroke={P.encre} strokeWidth={5.5} fill="#fff" strokeLinejoin="round" />;
  };
  return (
    <svg width={largeur} height={largeur * 1.5} viewBox="0 0 200 300" overflow="visible">
      {bras(66, brasG, -1)}
      {bras(134, brasD, 1)}
      <rect x={56} y={146} width={88} height={154} rx={40} fill={haut} />
      <rect x={90} y={128} width={20} height={26} rx={8} fill={peau} />
      <g transform={`rotate(${tete} 100 140)`}>
        <circle cx={100} cy={96} r={48} fill={peau} />
        <path d="M54 88 Q56 44 100 44 Q144 44 146 88 Q130 66 100 64 Q70 66 54 88Z" fill={P.encre} />
        {yeux()}
        <circle cx={70} cy={112} r={8} fill="#FF9C8A" opacity={0.6} />
        <circle cx={130} cy={112} r={8} fill="#FF9C8A" opacity={0.6} />
        {boucheEl()}
        {lunettes && (
          <g><rect x={64} y={82} width={30} height={20} rx={8} fill={P.encre} /><rect x={106} y={82} width={30} height={20} rx={8} fill={P.encre} /><line x1={94} y1={90} x2={106} y2={90} stroke={P.encre} strokeWidth={4} /></g>
        )}
        {casquette && (
          <g><path d="M52 76 Q54 40 100 40 Q146 40 148 76Z" fill={P.encre} /><rect x={44} y={70} width={70} height={12} rx={6} fill={P.encre} /><circle cx={100} cy={56} r={6} fill="#E10600" /></g>
        )}
      </g>
    </svg>
  );
};

// Réveil cartoon (≈ 260×280) : corps rond, deux cloches, cadran « 4:30 ».
export const Reveil: React.FC<{heure: string; allume: boolean; largeur?: number}> = ({heure, allume, largeur = 260}) => (
  <svg width={largeur} height={largeur * 1.08} viewBox="0 0 260 280" overflow="visible">
    <path d="M60 236 L40 272 M200 236 L220 272" stroke={P.encre} strokeWidth={14} strokeLinecap="round" />
    <circle cx={64} cy={58} r={40} fill={P.jaune} stroke={P.encre} strokeWidth={8} />
    <circle cx={196} cy={58} r={40} fill={P.jaune} stroke={P.encre} strokeWidth={8} />
    <rect x={122} y={16} width={16} height={30} rx={6} fill={P.encre} />
    <circle cx={130} cy={150} r={112} fill={P.corail} stroke={P.encre} strokeWidth={8} />
    <rect x={44} y={108} width={172} height={88} rx={30} fill="#fff" stroke={P.encre} strokeWidth={6} />
    <text x={130} y={175} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={66} fill={allume ? P.encre : 'rgba(43,45,66,.25)'}>{heure}</text>
    <circle cx={92} cy={226} r={8} fill="#fff" opacity={0.7} />
  </svg>
);

// Berline premium vue de côté (≈ 620×220), avant vers la droite, avec chauffeur et client.
export const Berline: React.FC<{f: number; largeur?: number; client?: boolean; phares?: boolean}> = ({f, largeur = 620, client = true, phares = false}) => {
  const roue = (cx: number) => (
    <g transform={`translate(${cx} 176) rotate(${f * 18})`}>
      <circle r={36} fill={P.encre} />
      <circle r={18} fill="#d9dbe6" />
      <rect x={-3} y={-17} width={6} height={34} fill={P.encre} />
    </g>
  );
  return (
    <svg width={largeur} height={largeur * 0.36} viewBox="0 0 620 224" overflow="visible">
      {phares && <path d="M600 120 L760 80 L760 170Z" fill={P.jaune} opacity={0.75} />}
      <ellipse cx={310} cy={212} rx={290} ry={12} fill="rgba(43,45,66,.18)" />
      <path d="M24 150 Q20 112 60 104 L170 92 Q240 30 320 28 L420 28 Q480 32 520 92 L580 102 Q610 108 608 140 L606 168 Q604 180 590 180 L36 180 Q24 180 24 168Z" fill="#24305E" />
      <path d="M190 94 Q246 46 316 44 L360 44 L360 94Z" fill="#BFE8FF" />
      <path d="M374 44 L420 44 Q468 48 502 94 L374 94Z" fill="#BFE8FF" />
      {/* Passagers aux fenêtres */}
      {client && (
        <g transform="translate(244 40)">
          <circle cx={36} cy={34} r={22} fill={P.peauClaire} />
          <path d="M14 30 Q16 10 36 10 Q56 10 58 30 Q46 22 36 22 Q26 22 14 30Z" fill={P.encre} />
          <path d="M26 38 Q36 48 46 38" stroke={P.encre} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <path d="M26 30 Q30 26 34 30 M40 30 Q44 26 48 30" stroke={P.encre} strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
      )}
      <g transform="translate(398 40)">
        <circle cx={36} cy={34} r={22} fill={P.peau} />
        <path d="M14 26 Q16 6 36 6 Q56 6 58 26Z" fill={P.encre} />
        <rect x={34} y={22} width={34} height={7} rx={3} fill={P.encre} />
        <circle cx={44} cy={32} r={3.5} fill={P.encre} />
        <path d="M34 40 Q42 48 52 40" stroke={P.encre} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      </g>
      <path d="M40 124 L596 124" stroke="rgba(255,255,255,.35)" strokeWidth={4} />
      <rect x={366} y={96} width={8} height={84} fill="rgba(255,255,255,.15)" />
      <rect x={300} y={130} width={36} height={8} rx={4} fill="rgba(255,255,255,.55)" />
      <rect x={588} y={110} width={20} height={14} rx={6} fill={phares ? '#FFF6C8' : '#fff'} />
      <rect x={22} y={112} width={14} height={14} rx={5} fill="#E10600" />
      {roue(150)}
      {roue(480)}
    </svg>
  );
};

// Avion de ligne stylisé, vue de côté, nez vers la gauche (≈ 300×120).
export const Avion: React.FC<{largeur?: number}> = ({largeur = 300}) => (
  <svg width={largeur} height={largeur * 0.4} viewBox="0 0 300 120" overflow="visible">
    <path d="M250 50 L282 6 L300 6 L288 56Z" fill={P.turquoise} />
    <path d="M20 54 Q6 60 20 70 L270 74 Q292 72 292 60 Q290 50 270 48 L40 48 Q28 48 20 54Z" fill="#fff" />
    <path d="M120 66 L190 112 L214 112 L180 64Z" fill="#E6EEF5" />
    <path d="M150 50 L196 20 L212 20 L186 52Z" fill="#E6EEF5" />
    {[60, 84, 108, 132, 156, 180, 204, 228].map((x) => <circle key={x} cx={x} cy={58} r={4} fill={P.turquoise} />)}
    <path d="M22 56 Q30 52 40 52 L40 60 L20 62Z" fill="#BFE8FF" />
  </svg>
);

// Nuage doux.
export const Nuage: React.FC<{largeur: number; couleur?: string}> = ({largeur, couleur = '#fff'}) => (
  <svg width={largeur} height={largeur * 0.5} viewBox="0 0 200 100">
    <path d="M30 90 Q2 90 6 66 Q10 46 34 48 Q38 18 72 18 Q100 2 124 26 Q160 18 166 50 Q196 52 194 74 Q192 90 170 90Z" fill={couleur} />
  </svg>
);

// Étincelles qui montent doucement (particules déterministes).
export const Etincelles: React.FC<{f: number; n?: number; couleur?: string; graine?: string; zone?: [number, number, number, number]}> = ({
  f, n = 18, couleur = '#fff', graine = 'e', zone = [0, 200, 1080, 1300],
}) => (
  <>
    {Array.from({length: n}, (_, i) => {
      const [x0, y0, l, h] = zone;
      const x = x0 + random(`${graine}x${i}`) * l + Math.sin(f * 0.05 + i) * 20;
      const vitesse = 0.6 + random(`${graine}v${i}`) * 1.2;
      const y = y0 + ((random(`${graine}y${i}`) * h - f * vitesse) % h + h) % h;
      const t = 6 + random(`${graine}t${i}`) * 10;
      const scintille = 0.4 + 0.6 * Math.abs(Math.sin(f * 0.12 + i * 1.7));
      return (
        <svg key={i} width={t * 2} height={t * 2} viewBox="-10 -10 20 20" style={{position: 'absolute', left: x, top: y, opacity: scintille}}>
          <path d="M0 -10 Q1.5 -1.5 10 0 Q1.5 1.5 0 10 Q-1.5 1.5 -10 0 Q-1.5 -1.5 0 -10Z" fill={couleur} />
        </svg>
      );
    })}
  </>
);

// Explosion de confettis à partir de (cx, cy), `f` = images depuis l'explosion.
export const Confettis: React.FC<{f: number; cx: number; cy: number; n?: number}> = ({f, cx, cy, n = 70}) => {
  if (f < 0 || f > 70) return null;
  const couleurs = [P.jaune, P.turquoise, P.menthe, P.corail, P.peche, '#fff'];
  return (
    <>
      {Array.from({length: n}, (_, i) => {
        const a = random(`ca${i}`) * Math.PI * 2;
        const v = 18 + random(`cv${i}`) * 26;
        const t = f;
        const x = cx + Math.cos(a) * v * t * 0.9 * Math.exp(-t * 0.03);
        const y = cy + Math.sin(a) * v * t * 0.7 * Math.exp(-t * 0.03) + 0.45 * t * t;
        const rot = t * (8 + random(`cr${i}`) * 14);
        const l = 16 + random(`cl${i}`) * 14;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: l, height: l * 0.5, borderRadius: 4, background: couleurs[i % couleurs.length],
            transform: `rotate(${rot}deg) scaleY(${Math.cos(t * 0.3 + i)})`, opacity: Math.min(1, (70 - f) / 15)}} />
        );
      })}
    </>
  );
};
