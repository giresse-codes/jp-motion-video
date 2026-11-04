import {Easing, Img, interpolate, spring, staticFile} from 'remotion';
import {POLICES, PUB_SETUP} from '../config';

// Les 14 micro-animations du montage, affichées sur l'écran du haut (1600 × 960 px logiques).
// Chaque clip reçoit k = secondes depuis son début, d = sa durée, fps. Coupes franches entre clips.
export const ECRAN = {l: 1600, h: 960};
const C = PUB_SETUP.couleurs;
const F = POLICES.texte;
type P = {k: number; d: number; fps: number};
const ressort = (k: number, fps: number, a = 0, cfg = {}) => spring({frame: Math.round((k - a) * fps), fps, config: {stiffness: 180, damping: 13, ...cfg}});
const doux = (k: number, a: number, b: number) => interpolate(k, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.22, 1, 0.36, 1)});
const plein: React.CSSProperties = {position: 'absolute', inset: 0, overflow: 'hidden'};
const texte = (taille: number, poids = 700, coul = '#fff'): React.CSSProperties => ({fontFamily: F, fontWeight: poids, fontSize: taille, color: coul, letterSpacing: '-0.03em', whiteSpace: 'nowrap'});
const bez = (pts: number[], p: number) => {
  const n = (pts.length - 2) / 6, u = Math.min(0.9999, Math.max(0, p)) * n, i = Math.floor(u), s = u - i, o = i * 6, m = 1 - s;
  const [x0, y0, x1, y1, x2, y2, x3, y3] = pts.slice(o, o + 8);
  return [m * m * m * x0 + 3 * m * m * s * x1 + 3 * m * s * s * x2 + s * s * s * x3, m * m * m * y0 + 3 * m * m * s * y1 + 3 * m * s * s * y2 + s * s * s * y3];
};
const chemin = (pts: number[]) => { let d = `M${pts[0]} ${pts[1]}`; for (let o = 2; o < pts.length; o += 6) d += ` C${pts.slice(o, o + 6).join(' ')}`; return d; };

// a. Voiture noire vue du dessus qui trace une ligne lumineuse sur une carte de Douala
const ROUTE = [120, 820, 420, 780, 380, 520, 700, 470, 1020, 420, 980, 200, 1480, 150];
const Carte: React.FC<P> = ({k, d}) => {
  const p = doux(k, 0, d * 0.95);
  const [x, y] = bez(ROUTE, p), [x2, y2] = bez(ROUTE, p + 0.01);
  const ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
  return (
    <div style={{...plein, background: '#0B0B10'}}>
      <svg width={1600} height={960} style={{position: 'absolute', transform: `scale(${1.08 - p * 0.08})`}}>
        {[180, 360, 560, 780, 1000, 1240, 1440].map((v, i) => <path key={i} d={`M${v} 0 L${v + 60} 960`} stroke="#1D1E25" strokeWidth={i % 2 ? 14 : 26} />)}
        {[120, 300, 520, 700, 880].map((v, i) => <path key={i} d={`M0 ${v} L1600 ${v - 40}`} stroke="#1D1E25" strokeWidth={i % 2 ? 12 : 22} />)}
        <path d="M-20 640 Q500 560 800 700 T1620 600" stroke="#191530" strokeWidth={90} fill="none" />
        <path d={chemin(ROUTE)} pathLength={1} stroke={C.violet} strokeWidth={22} strokeLinecap="round" fill="none" strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={0.45} style={{filter: 'blur(10px)'}} />
        <path d={chemin(ROUTE)} pathLength={1} stroke="#F2ECFF" strokeWidth={7} strokeLinecap="round" fill="none" strokeDasharray="1 1" strokeDashoffset={1 - p} />
        <g transform={`translate(${x} ${y}) rotate(${ang})`}>
          <rect x={-60} y={-28} width={120} height={56} rx={22} fill="#030304" stroke="#3A3B44" strokeWidth={3} />
          <rect x={-14} y={-22} width={40} height={44} rx={10} fill="#1B1C24" />
          <circle cx={58} cy={-18} r={6} fill="#F2ECFF" /><circle cx={58} cy={18} r={6} fill="#F2ECFF" />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 70, top: 60, ...texte(54, 600, '#C9C2E8')}}>Douala</div>
    </div>
  );
};

// b. Nuages en vue aérienne, pin « Douala » qui tombe
const Nuages: React.FC<P> = ({k, fps}) => {
  const pin = ressort(k, fps, 0.08, {damping: 9});
  return (
    <div style={{...plein, background: 'radial-gradient(circle at 50% 50%, #9FD3FF, #3DA5FF 70%)'}}>
      {new Array(9).fill(0).map((_, i) => {
        const a = (i * 40 * Math.PI) / 180, r = 260 + (i % 3) * 140 + k * 700;
        return <div key={i} style={{position: 'absolute', left: 800 + Math.cos(a) * r - 260, top: 480 + Math.sin(a) * r * 0.7 - 130, width: 520, height: 260, borderRadius: '50%', background: 'radial-gradient(ellipse, #fff 30%, rgba(255,255,255,0) 70%)', opacity: 0.9, transform: `scale(${1 + k * 1.5})`}} />;
      })}
      <div style={{position: 'absolute', left: 740, top: interpolate(pin, [0, 1], [-260, 330]), width: 120, height: 160}}>
        <svg viewBox="0 0 60 80" width={120} height={160}><path d="M30 78 C8 48 4 36 4 26 A26 26 0 0 1 56 26 C56 36 52 48 30 78Z" fill={C.violet} stroke="#fff" strokeWidth={3} /><circle cx={30} cy={26} r={10} fill="#fff" /></svg>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', opacity: Math.min(1, pin * 2)}}><span style={{...texte(60, 700, C.noir), background: '#fff', padding: '12px 34px', borderRadius: 40}}>Douala</span></div>
    </div>
  );
};

// c. Carte de visite premium sombre « JP Service · Confort » qui pivote en 3D
const Visite: React.FC<P> = ({k, d}) => {
  const p = doux(k, 0, d);
  return (
    <div style={{...plein, background: 'radial-gradient(circle at 50% 40%, #1E1830, #07070A 70%)', perspective: 1400}}>
      <div style={{position: 'absolute', left: 350, top: 220, width: 900, height: 520, borderRadius: 34, background: 'linear-gradient(135deg, #1A1A22, #0C0C10)', border: '2px solid #2E2F38', boxShadow: '0 40px 90px rgba(0,0,0,.7)',
        transform: `rotateY(${interpolate(p, [0, 1], [-38, 14])}deg) rotateX(${interpolate(p, [0, 1], [14, -6])}deg)`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 70, top: 90, ...texte(96)}}>JP Service</div>
        <div style={{position: 'absolute', left: 70, top: 210, ...texte(70, 600, C.violetCalque)}}>· Confort</div>
        <div style={{position: 'absolute', left: 70, bottom: 70, ...texte(34, 600, '#8E9099')}}>Chauffeur privé · Douala</div>
        <i style={{position: 'absolute', top: -100, bottom: -100, width: 160, left: interpolate(p, [0, 1], [-300, 1100]), background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent)', transform: 'rotate(20deg)'}} />
      </div>
    </div>
  );
};

// d. Trois cartes empilées en éventail : « Éco », « Confort », « Aéroport »
const Eventail: React.FC<P> = ({k, fps}) => (
  <div style={{...plein, background: 'linear-gradient(160deg, #1A1030, #07070A)'}}>
    {[['Éco', C.gris, '#fff'], ['Confort', C.violet, '#fff'], ['Aéroport', '#F2F0F7', C.noir]].map(([nom, fond, coul], i) => {
      const s = ressort(k, fps, i * 0.06, {damping: 12});
      return (
        <div key={i} style={{position: 'absolute', left: 560, top: 230, width: 480, height: 600, borderRadius: 36, background: fond, boxShadow: '0 30px 70px rgba(0,0,0,.6)', transformOrigin: '50% 120%',
          transform: `rotate(${(i - 1) * 16 * s}deg) translateY(${(1 - s) * 200}px)`, display: 'flex', alignItems: 'flex-end', padding: 50, boxSizing: 'border-box'}}>
          <span style={texte(78, 700, coul)}>{nom}</span>
        </div>
      );
    })}
  </div>
);

// e. Bulles WhatsApp qui orbitent autour d'une icône voiture (fond violet)
const Whatsapp: React.FC<P> = ({k, fps}) => {
  const s = ressort(k, fps);
  return (
    <div style={{...plein, background: `radial-gradient(circle, #A46BFF, ${C.violet} 45%, #3B1A7A)`}}>
      <div style={{position: 'absolute', left: 660, top: 340, width: 280, height: 280, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s})`, boxShadow: '0 0 80px rgba(255,255,255,.4)'}}>
        <svg viewBox="0 0 48 48" width={150} height={150} fill="none" stroke={C.noir} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 32v-6l4-9c1-2 2-3 5-3h18c3 0 4 1 5 3l4 9v6Z" /><circle cx={14} cy={33} r={4} /><circle cx={34} cy={33} r={4} /></svg>
      </div>
      {new Array(7).fill(0).map((_, i) => {
        const a = (i / 7) * Math.PI * 2 + k * 2.4, r = 330 * s;
        return (
          <div key={i} style={{position: 'absolute', left: 800 + Math.cos(a) * r * 1.3 - 70, top: 480 + Math.sin(a) * r - 50, width: 140, height: 100, borderRadius: 30, borderBottomLeftRadius: 8, background: C.vert, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 12px 30px rgba(0,0,0,.25)'}}>
            {[0, 1, 2].map((j) => <i key={j} style={{width: 14, height: 14, borderRadius: 7, background: '#fff'}} />)}
          </div>
        );
      })}
    </div>
  );
};

// f. Ticket blanc « Réservation confirmée ✓ » qui sort d'une imprimante dessinée au trait
const Ticket: React.FC<P> = ({k, d}) => {
  const p = doux(k, 0.05, d * 0.9);
  return (
    <div style={{...plein, background: '#EDE7FF'}}>
      <div style={{position: 'absolute', left: 430, top: 330 + p * 220, width: 740, height: 360, background: '#fff', boxShadow: '0 20px 50px rgba(60,20,120,.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16}}>
        <span style={texte(54, 700, C.noir)}>Réservation confirmée</span>
        <span style={{...texte(110, 700, C.vert)}}>✓</span>
      </div>
      <svg width={1600} height={960} style={{position: 'absolute', inset: 0}} fill="none" stroke={C.noir} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round">
        <rect x={360} y={150} width={880} height={240} rx={40} fill="#EDE7FF" />
        <path d="M480 150 V80 H1120 V150 M420 380 H1180" />
        <circle cx={1150} cy={230} r={14} fill={C.violet} stroke="none" />
      </svg>
    </div>
  );
};

// g. Colonne violette avec un reçu « 2 500 F / heure » qui monte
const Recu: React.FC<P> = ({k, fps}) => {
  const s = ressort(k, fps, 0, {damping: 15});
  return (
    <div style={{...plein, background: '#07070A'}}>
      <div style={{position: 'absolute', left: 620, width: 360, bottom: 0, height: 960 * s, background: `linear-gradient(${C.violet}, #4A1B9E)`, boxShadow: `0 0 120px ${C.violet}`}} />
      <div style={{position: 'absolute', left: 520, width: 560, top: interpolate(s, [0, 1], [980, 250]), height: 440, background: '#fff', padding: '60px 50px', boxSizing: 'border-box', clipPath: 'polygon(0 0,100% 0,100% 92%,95% 100%,90% 92%,85% 100%,80% 92%,75% 100%,70% 92%,65% 100%,60% 92%,55% 100%,50% 92%,45% 100%,40% 92%,35% 100%,30% 92%,25% 100%,20% 92%,15% 100%,10% 92%,5% 100%,0 92%)'}}>
        <div style={texte(34, 600, '#6E6F78')}>JP Service · Éco</div>
        <div style={{...texte(110, 700, C.noir), marginTop: 30}}>2 500 F</div>
        <div style={{...texte(46, 600, C.violet)}}>/ heure</div>
      </div>
    </div>
  );
};

// h. Fond noir, texte qui se tape lettre par lettre : « Un message. Un chauffeur. »
const Message: React.FC<P> = ({k, d}) => {
  const TXT = 'Un message. Un chauffeur.';
  const n = Math.min(TXT.length, Math.floor((k / (d * 0.85)) * TXT.length));
  return (
    <div style={{...plein, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <span style={texte(96, 600)}>{TXT.slice(0, n)}<span style={{display: 'inline-block', width: 8, height: 100, marginLeft: 8, background: C.violetCalque, verticalAlign: 'middle', opacity: Math.floor(k * 6) % 2 ? 1 : 0.2}} /></span>
    </div>
  );
};

// i. Écran de téléphone : « Votre chauffeur arrive · 6 min »
const Telephone: React.FC<P> = ({k, fps}) => {
  const s = ressort(k, fps);
  return (
    <div style={{...plein, background: 'radial-gradient(circle at 50% 60%, #1B1430, #07070A 70%)'}}>
      <div style={{position: 'absolute', left: 560, top: 60 + (1 - s) * 400, width: 480, height: 900, borderRadius: 70, background: '#000', border: '10px solid #2A2B30', boxSizing: 'border-box', padding: '120px 40px'}}>
        <div style={texte(40, 600, '#A8AAB2')}>Votre chauffeur arrive</div>
        <div style={{...texte(130, 700), marginTop: 20}}>6 min</div>
        <div style={{marginTop: 40, height: 14, borderRadius: 7, background: '#2A2B30', overflow: 'hidden'}}><div style={{width: `${30 + k * 60}%`, height: '100%', background: C.vert}} /></div>
      </div>
    </div>
  );
};

// j. Silhouette de main qui ouvre une portière (forme noire sur fond violet)
const Portiere: React.FC<P> = ({k, d}) => {
  const p = doux(k, 0.05, d);
  return (
    <div style={{...plein, background: C.violet}}>
      <div style={{position: 'absolute', left: 500, top: 140, width: 640, height: 700, background: '#F4EEFF', boxShadow: '0 0 120px #fff'}} />
      <div style={{position: 'absolute', left: 500, top: 140, width: 640, height: 700, background: '#07070A', transformOrigin: '0 50%', transform: `perspective(1200px) rotateY(${-p * 55}deg)`, borderRadius: '0 60px 0 0'}}>
        <div style={{position: 'absolute', right: 70, top: 330, width: 120, height: 26, borderRadius: 13, background: '#2A2B30'}} />
        <svg viewBox="0 0 200 160" width={300} height={240} style={{position: 'absolute', right: -10, top: 250}}><path d="M10 120 C30 70 60 60 90 62 L170 58 C182 58 186 70 176 74 L120 82 L150 86 C162 88 160 100 150 100 L110 104 C90 140 50 150 10 150Z" fill="#000" /></svg>
      </div>
    </div>
  );
};

// k. Avion au trait qui décolle : « Service Aéroport »
const Avion: React.FC<P> = ({k, d}) => {
  const p = doux(k, 0, d), x = 300 + p * 900, y = 700 - p * p * 480;
  return (
    <div style={{...plein, background: 'linear-gradient(#0C0B1A, #07070A)'}}>
      <svg width={1600} height={960} style={{position: 'absolute'}}>
        <path d="M150 760 H1450" stroke="#2A2B30" strokeWidth={6} strokeDasharray="40 30" />
        <g transform={`translate(${x} ${y}) rotate(${-22 * p})`} fill="none" stroke="#fff" strokeWidth={6} strokeLinejoin="round">
          <path d="M-120 0 L80 -10 Q130 -10 130 0 Q130 10 80 10 Z M0 -6 L-40 -90 L-10 -90 L50 -8 M0 6 L-40 90 L-10 90 L50 8 M-110 -2 L-130 -50 L-110 -50 L-80 -4" />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center', ...texte(84)}}>Service Aéroport</div>
    </div>
  );
};

// l. Route vers la mer : « Kribi · Limbé · Yaoundé »
const Route: React.FC<P> = ({k}) => (
  <div style={{...plein, background: 'linear-gradient(#9FD3FF 0%, #3DA5FF 40%, #1D5FA8 48%, #0B0B10 48.2%)'}}>
    <svg width={1600} height={960} style={{position: 'absolute'}}>
      <polygon points="760,462 840,462 1420,960 180,960" fill="#22232A" />
      {new Array(8).fill(0).map((_, i) => {
        const z = ((i / 8 + k * 1.6) % 1), y = 470 + z * z * 520, h = 6 + z * 60, w = 3 + z * 16;
        return <rect key={i} x={800 - w / 2} y={y} width={w} height={h} fill="#E6D23A" />;
      })}
    </svg>
    <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', ...texte(80, 700, '#07070A')}}>Kribi · Limbé · Yaoundé</div>
  </div>
);

// m. Typo cinétique sur fond dégradé clair : « Laissez-vous conduire. »
const Conduire: React.FC<P> = ({k, fps}) => (
  <div style={{...plein, background: 'linear-gradient(120deg, #F3EEFF, #D9CCFF 55%, #CDE9FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34}}>
    {['Laissez-vous', 'conduire.'].map((m, i) => {
      const s = ressort(k, fps, i * 0.22, {damping: 11});
      return <span key={i} style={{...texte(140, 700, i ? C.violet : C.noir), display: 'inline-block', transform: `translateY(${(1 - s) * 160}px) scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * (i ? 8 : -8)}deg)`, opacity: Math.min(1, s * 2)}}>{m}</span>;
    })}
  </div>
);

// n. Carte prix qui se retourne : « Promo Éco 2 500 F/h » → « Confort 3 500 F/h »
const Prix: React.FC<P> = ({k, d, fps}) => {
  const r = spring({frame: Math.round((k - d * 0.45) * fps), fps, config: {stiffness: 160, damping: 14}});
  const face = (titre: string, prix: string, fond: string, coul: string, dos = false): React.ReactNode => (
    <div style={{position: 'absolute', inset: 0, borderRadius: 40, background: fond, backfaceVisibility: 'hidden', transform: dos ? 'rotateY(180deg)' : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
      <span style={texte(60, 600, coul)}>{titre}</span><span style={texte(150, 700, coul)}>{prix}</span>
    </div>
  );
  return (
    <div style={{...plein, background: 'radial-gradient(circle, #1E1830, #07070A 70%)', perspective: 1600}}>
      <div style={{position: 'absolute', left: 400, top: 200, width: 800, height: 560, transformStyle: 'preserve-3d', transform: `rotateY(${r * 180}deg)`}}>
        {face('Promo Éco', '2 500 F/h', C.violet, '#fff')}
        {face('Confort', '3 500 F/h', '#F2F0F7', C.noir, true)}
      </div>
    </div>
  );
};

// Fin : l'écran passe au noir, puis logo, slogan et WhatsApp
export const Fin: React.FC<{k: number; fps: number}> = ({k, fps}) => {
  const R = PUB_SETUP.finRepere, B = PUB_SETUP.temps;
  const l = doux(k, (R.logo - R.noir) * B, (R.logo - R.noir) * B + 0.9);
  const s = doux(k, (R.slogan - R.noir) * B, (R.slogan - R.noir) * B + 0.5), c = doux(k, (R.contact - R.noir) * B, (R.contact - R.noir) * B + 0.5);
  return (
    <div style={{...plein, background: '#000'}}>
      <Img src={staticFile(PUB_SETUP.logo)} style={{position: 'absolute', left: 300, top: 220, width: 1000, opacity: l, filter: `blur(${(1 - l) * 24}px)`, transform: `scale(${1.06 - 0.06 * l})`, mixBlendMode: 'screen'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', ...texte(66, 600), opacity: s, transform: `translateY(${(1 - s) * 20}px)`}}>Rapide. Sûr. Confortable.</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 680, textAlign: 'center', ...texte(48, 600, '#B9BAC2'), opacity: c, transform: `translateY(${(1 - c) * 20}px)`}}>WhatsApp +237 655 394 028</div>
    </div>
  );
};

export const CLIPS: Record<string, React.FC<P>> = {carte: Carte, nuages: Nuages, visite: Visite, eventail: Eventail, whatsapp: Whatsapp, ticket: Ticket, recu: Recu, message: Message, telephone: Telephone, portiere: Portiere, avion: Avion, route: Route, conduire: Conduire, prix: Prix};
