// 14. « La pièce manquante » — puzzle 3D (12 s).
// Pièces générées (tenons et mortaises aléatoires mais fixes), image découpée par clipPath, caméra CSS 3D.
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Bande, clamp, ease, FinJP, hasard, mix, prog, useT} from './commun';
import {MOTION, POLICES_MOTION as P, TARIFS} from './config';

const C = {fond: '#2B3445', jaune: '#FFD873', blanc: '#FFFFFF', carton: '#8B6F4E', cartonSombre: '#5E4932'};
const COLS = 5;
const ROWS = 7;
const S = 160;
const PW = COLS * S; // 800
const PHt = ROWS * S; // 1120
const TROU = {c: 2, r: 3};
const ORIGINE = {x: (1080 - PW) / 2, y: 330};
const MOTS: Record<string, string> = {'1,1': 'réunion', '3,2': 'aéroport', '1,5': 'dîner', '3,6': 'Kribi'};

// Signe des tenons : h[r][c] = bord sous la ligne r (+1 = vers le bas), v[r][c] = bord à droite de la colonne c (+1 = vers la droite)
const h = Array.from({length: ROWS - 1}, (_, r) => Array.from({length: COLS}, (_, c) => (hasard(r * 13 + c * 7 + 1) > 0.5 ? 1 : -1)));
const v = Array.from({length: ROWS}, (_, r) => Array.from({length: COLS - 1}, (_, c) => (hasard(r * 17 + c * 5 + 101) > 0.5 ? 1 : -1)));

/** Bord de A à B ; le tenon sort à gauche du sens de parcours (sens horaire = vers l'extérieur) si sg = +1. */
const bord = (ax: number, ay: number, bx: number, by: number, sg: number) => {
  if (!sg) return `L${bx} ${by}`;
  const dx = bx - ax;
  const dy = by - ay;
  const nx = dy * sg; // normale vers l'extérieur (repère écran)
  const ny = -dx * sg;
  const p = (u: number, w: number) => `${(ax + dx * u + nx * w).toFixed(1)} ${(ay + dy * u + ny * w).toFixed(1)}`;
  return [
    `L${p(0.36, 0)}`,
    `C${p(0.4, 0)} ${p(0.44, 0.06)} ${p(0.4, 0.12)}`,
    `C${p(0.34, 0.24)} ${p(0.66, 0.24)} ${p(0.6, 0.12)}`,
    `C${p(0.56, 0.06)} ${p(0.6, 0)} ${p(0.64, 0)}`,
    `L${bx} ${by}`,
  ].join(' ');
};
const chemin = (c: number, r: number) => {
  const x0 = c * S;
  const y0 = r * S;
  const x1 = x0 + S;
  const y1 = y0 + S;
  const haut = r === 0 ? 0 : -h[r - 1][c];
  const droite = c === COLS - 1 ? 0 : v[r][c];
  const bas = r === ROWS - 1 ? 0 : h[r][c];
  const gauche = c === 0 ? 0 : -v[r][c - 1];
  return `M${x0} ${y0} ${bord(x0, y0, x1, y0, haut)} ${bord(x1, y0, x1, y1, droite)} ${bord(x1, y1, x0, y1, bas)} ${bord(x0, y1, x0, y0, gauche)} Z`;
};
const PIECES = Array.from({length: ROWS * COLS}, (_, i) => ({c: i % COLS, r: Math.floor(i / COLS), d: chemin(i % COLS, Math.floor(i / COLS))}));

/** Image imprimée sur le puzzle : route ensoleillée de Douala, voiture noire. */
const Image: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="p14ciel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7EC3EC" />
        <stop offset="1" stopColor="#FBE3B0" />
      </linearGradient>
      <linearGradient id="p14route" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8A8C8E" />
        <stop offset="1" stopColor="#4D5056" />
      </linearGradient>
    </defs>
    <rect width={PW} height={PHt} fill="url(#p14ciel)" />
    <circle cx="610" cy="170" r="74" fill={C.jaune} />
    <circle cx="610" cy="170" r="110" fill={C.jaune} opacity="0.25" />
    {[[20, 300, 90], [120, 250, 70], [200, 320, 60], [500, 270, 80], [590, 310, 70], [680, 240, 100]].map(([x, y, l], i) => (
      <rect key={i} x={x} y={y} width={l} height={470 - y} fill={['#C9B699', '#B7A585', '#D4C3A6', '#BCAA8B', '#CDBB9C', '#AE9C7E'][i]} />
    ))}
    <rect y="460" width={PW} height={PHt - 460} fill="#7DA35A" />
    <path d={`M350 460 L450 460 L${PW + 120} ${PHt} L-120 ${PHt} Z`} fill="url(#p14route)" />
    <path d={`M330 460 L350 460 L-120 ${PHt} L-200 ${PHt} Z`} fill="#E6D8B8" />
    <path d={`M450 460 L470 460 L${PW + 200} ${PHt} L${PW + 120} ${PHt} Z`} fill="#E6D8B8" />
    {[0, 1, 2, 3, 4].map((i) => {
      const y = 480 + i ** 1.7 * 42;
      const w = 4 + i * 4;
      return <rect key={i} x={400 - w / 2} y={y} width={w} height={14 + i * 16} fill="#F4F1E8" />;
    })}
    {[[60, 520, 1], [740, 520, 1], [140, 470, 0.6], [660, 470, 0.6]].map(([x, y, k], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${k})`}>
        <path d="M0 0 Q-10 -120 10 -230" stroke="#6E5536" strokeWidth="16" fill="none" />
        {[0, 1, 2, 3, 4, 5].map((j) => (
          <path key={j} d={`M10 -230 q${Math.cos(j * 1.05) * 60} ${Math.sin(j * 1.05) * 30 - 20} ${Math.cos(j * 1.05) * 110} ${Math.sin(j * 1.05) * 50 + 30}`} stroke="#3E8A45" strokeWidth="18" strokeLinecap="round" fill="none" />
        ))}
      </g>
    ))}
    <image href={staticFile(MOTION.voiture)} x="110" y="560" width="580" height="279" />
  </g>
);

const Mot: React.FC<{c: number; r: number; txt: string; taille?: number}> = ({c, r, txt, taille = 24}) => (
  <text
    x={c * S + S / 2}
    y={r * S + S / 2 + taille / 3}
    textAnchor="middle"
    fontFamily={P.grotesk}
    fontWeight={700}
    fontSize={taille}
    fill="#fff"
    stroke="#1d2433"
    strokeWidth={5}
    paintOrder="stroke"
    transform={`rotate(${(hasard(c + r * 3) - 0.5) * 10} ${c * S + S / 2} ${r * S + S / 2})`}
  >
    {txt}
  </text>
);

/** Une pièce : tranche de carton, image découpée, liseré d'ombre. */
const Piece: React.FC<{c: number; r: number; d: string; ombre?: number}> = ({c, r, d, ombre = 0}) => (
  <g>
    {ombre > 0 ? <path d={d} fill="#000" opacity={0.35} transform={`translate(${ombre * 0.6} ${ombre})`} style={{filter: `blur(${4 + ombre * 0.3}px)`}} /> : null}
    <path d={d} fill={C.cartonSombre} transform="translate(0 7)" />
    <path d={d} fill={C.carton} transform="translate(0 3.5)" />
    <g clipPath={`url(#p14c${c}-${r})`}>
      <Image />
      {MOTS[`${c},${r}`] ? <Mot c={c} r={r} txt={MOTS[`${c},${r}`]} /> : null}
      {c === TROU.c && r === TROU.r ? <Mot c={c} r={r} txt="Ton chauffeur" taille={22} /> : null}
      <rect x={c * S - 40} y={r * S - 40} width={S + 80} height={S + 80} fill="url(#p14grain)" opacity="0.18" />
    </g>
    <path d={d} fill="none" stroke="#1d1a14" strokeOpacity="0.45" strokeWidth="2" />
    <path d={d} fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="1" transform="translate(-1 -1)" />
  </g>
);

const Defs = () => (
  <defs>
    {PIECES.map((p) => (
      <clipPath key={`${p.c}-${p.r}`} id={`p14c${p.c}-${p.r}`}>
        <path d={p.d} />
      </clipPath>
    ))}
    <pattern id="p14grain" width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="#fff" />
      <circle cx="2" cy="2" r="1" fill="#000" />
      <circle cx="5" cy="4.5" r="0.7" fill="#000" />
    </pattern>
    <radialGradient id="p14lueur">
      <stop offset="0" stopColor={C.jaune} stopOpacity="0.95" />
      <stop offset="1" stopColor={C.jaune} stopOpacity="0" />
    </radialGradient>
  </defs>
);

export const Pub14Puzzle: React.FC = () => {
  const t = useT();
  const hc = TROU.c * S + S / 2;
  const hr = TROU.r * S + S / 2;

  // Caméra : biais 3D qui glisse, survol (1,5–4 s), retour de face (6,5–7,5 s), retour au biais à la fin (boucle)
  const face = ease.inOut(prog(t, 6.4, 7.4)) * (1 - ease.inOut(prog(t, 11.5, 11.97)));
  const survol = ease.inOut(prog(t, 0, 4.2));
  const camX = mix(mix(30, -50, survol), 0, face);
  const camY = mix(mix(140, -40, survol), 0, face);
  const rotX = mix(38, 0, face);
  const rotZ = mix(mix(-10, 6, survol), 0, face);
  const zoom = mix(mix(1.2, 1.1, survol), 1, face);

  // Pièce manquante : tombe en tournoyant (4–5,3 s), hésite (5,3–5,8 s), s'emboîte à 5,8 s
  const chute = prog(t, 4.0, 5.3);
  const hesite = prog(t, 5.3, 5.8);
  const pose = t >= 5.8;
  const hauteur = pose ? 0 : t < 5.3 ? mix(900, 70, ease.out(chute)) : mix(70, 0, ease.in(hesite)) + Math.sin(hesite * Math.PI * 3) * 14 * (1 - hesite);
  const spin = pose ? 0 : t < 5.3 ? (1 - ease.out(chute)) * 540 : Math.sin(hesite * Math.PI * 2) * 6;
  const tumble = pose ? 0 : (1 - ease.out(chute)) * 300;
  const enJeu = t >= 4.0 && t < 9.0;
  const onde = prog(t, 5.8, 6.8);

  // Fin : pièces qui se soulèvent puis s'envolent ; elles reviennent en place sur la dernière demi-seconde
  const souleve = ease.out(prog(t, 9.0, 9.4)) * (1 - ease.out(prog(t, 11.5, 11.95)));
  const envol = ease.in(prog(t, 9.35, 9.9)) * (1 - ease.out(prog(t, 11.5, 11.95)));
  const trouVisible = t < 5.8 || t >= 11.5;

  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, #3A4660 0%, ${C.fond} 70%)`, overflow: 'hidden'}}>
      <AbsoluteFill style={{perspective: 1800, perspectiveOrigin: '50% 40%'}}>
        <div
          style={{
            position: 'absolute', left: ORIGINE.x, top: ORIGINE.y, width: PW, height: PHt, transformStyle: 'preserve-3d',
            transform: `translate(${camX}px, ${camY}px) scale(${zoom}) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`,
          }}
        >
          <svg width={PW} height={PHt} style={{position: 'absolute', overflow: 'visible'}}>
            <Defs />
            {/* Plateau sous le puzzle */}
            <rect x={-30} y={-30} width={PW + 60} height={PHt + 60} rx={18} fill="#222A38" opacity={1 - clamp(envol * 2)} />
            {trouVisible ? (
              <g>
                <path d={PIECES[TROU.r * COLS + TROU.c].d} fill="#161B26" />
                <circle cx={hc} cy={hr} r={150 + Math.sin(t * 5) * 8} fill="url(#p14lueur)" opacity={0.35} />
              </g>
            ) : null}
            {PIECES.map((p) => {
              if (p.c === TROU.c && p.r === TROU.r && (!pose || t >= 11.5)) return null;
              const k = hasard(p.c * 3.1 + p.r * 7.7);
              const dx = (p.c - 2) * 260 * envol + (k - 0.5) * 300 * envol;
              const dy = -souleve * (10 + k * 20) + (p.r - 3) * 260 * envol - 300 * envol;
              const rot = (k - 0.5) * 80 * envol;
              const op = 1 - clamp(envol * 1.4);
              if (op <= 0) return null;
              return (
                <g key={`${p.c}-${p.r}`} opacity={op} transform={`translate(${dx} ${dy}) rotate(${rot} ${p.c * S + S / 2} ${p.r * S + S / 2})`}>
                  <Piece c={p.c} r={p.r} d={p.d} ombre={souleve * 12 + envol * 30} />
                </g>
              );
            })}
            {/* Onde lumineuse qui traverse le puzzle à l'emboîtement */}
            {onde > 0 && onde < 1 ? (
              <circle cx={hc} cy={hr} r={onde * 1100} fill="none" stroke={C.jaune} strokeWidth={60 * (1 - onde) + 6} opacity={(1 - onde) * 0.8} style={{mixBlendMode: 'screen', filter: 'blur(8px)'}} />
            ) : null}
            {t >= 5.8 && t < 6.2 ? <circle cx={hc} cy={hr} r={120} fill="#fff" opacity={(6.2 - t) * 1.5} style={{filter: 'blur(20px)'}} /> : null}
          </svg>
          {/* Pièce manquante, au-dessus du plateau (vraie 3D) */}
          {enJeu && !pose ? (
            <div
              style={{
                position: 'absolute', left: TROU.c * S - 40, top: TROU.r * S - 40, width: S + 80, height: S + 80,
                transform: `translateZ(${hauteur}px) rotateZ(${spin}deg) rotateX(${tumble}deg) rotateY(${tumble * 0.6}deg)`,
              }}
            >
              <svg width={S + 80} height={S + 80} viewBox={`${TROU.c * S - 40} ${TROU.r * S - 40} ${S + 80} ${S + 80}`} style={{overflow: 'visible'}}>
                <Defs />
                <Piece c={TROU.c} r={TROU.r} d={PIECES[TROU.r * COLS + TROU.c].d} />
              </svg>
            </div>
          ) : null}
          {/* Ombre de la pièce qui tombe, de plus en plus nette */}
          {enJeu && !pose ? (
            <div style={{position: 'absolute', left: hc - 90, top: hr - 90, width: 180, height: 180, borderRadius: 40, background: '#000', opacity: 0.45 * (1 - hauteur / 900), filter: `blur(${8 + hauteur / 18}px)`}} />
          ) : null}
        </div>
      </AbsoluteFill>
      {/* Profondeur de champ en vue de biais */}
      <AbsoluteFill style={{backdropFilter: `blur(${(1 - face) * 6}px)`, WebkitMaskImage: 'linear-gradient(180deg, #000 0%, transparent 22%, transparent 82%, #000 100%)'}} />

      <Titre visible={t < 4.0 ? clamp(t * 12) * (1 - prog(t, 3.6, 4.0)) : 0} top={170}>
        Il manque une pièce à <span style={{color: C.jaune}}>ta journée.</span>
      </Titre>
      <Titre visible={prog(t, 7.2, 7.6) * (1 - prog(t, 8.9, 9.2))} top={1500} taille={52}>
        {TARIFS.eco} · <span style={{color: C.jaune}}>{TARIFS.confort} (promo)</span>
      </Titre>

      {t >= 9.5 && t < 11.95 ? (
        <div style={{opacity: 1 - prog(t, 11.5, 11.8)}}>
          <FinJP
            t={t}
            s={{police: P.grotesk, couleur: C.blanc, couleurNumero: C.jaune, accent: C.jaune, tailleNumero: 150, ombre: '0 6px 24px rgba(0,0,0,0.5)'}}
            p={(i) => prog(t, 9.6 + i * 0.13, 10.0 + i * 0.13)}
            haut={540}
            entree={(p) => ({opacity: clamp(p * 1.5), transform: `translateY(${(1 - ease.back(p)) * -60}px) rotate(${(1 - p) * -6}deg)`, clipPath: `polygon(0 0, ${p * 140}% 0, ${p * 140 - 20}% 100%, 0 100%)`})}
          />
        </div>
      ) : null}
      <Bande n={14} />
    </AbsoluteFill>
  );
};

const Titre: React.FC<{visible: number; top: number; taille?: number; children: ReactNode}> = ({visible, top, taille = 76, children}) => {
  if (visible <= 0) return null;
  const st: CSSProperties = {
    position: 'absolute', top, left: 120, right: 120, textAlign: 'center', fontFamily: P.grotesk, fontWeight: 700,
    fontSize: taille, lineHeight: 1.08, color: C.blanc, textShadow: '0 6px 24px rgba(0,0,0,0.55)', opacity: visible,
    transform: `translateY(${(1 - visible) * 20}px)`,
  };
  return <div style={st}>{children}</div>;
};
