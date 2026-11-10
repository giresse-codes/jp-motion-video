// 26. « Épisode n/4 » — série « 1 service = 1 épisode » (20 s). Même générique, même mise en page ;
// seuls le numéro, le titre, les étapes, les tarifs et l'épisode suivant changent (données EPISODES).
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {Bande, clamp, ease, FinJP, mix, prog, ressort, useT, visibleJusqua} from './commun';
import {POLICES_MOTION as P} from './config';

const C = {nuit: '#0A1430', blanc: '#FFFFFF', jaune: '#F5C400', bleu: '#2F6BFF', gris: '#8C9AC4'};

type Icone = 'tel' | 'voiture' | 'avion' | 'palmier' | 'horloge' | 'etoile';
export type Episode = {
  n: number;
  titre: string;
  etapes: {quand: string; quoi: string; icone: Icone}[];
  tarifs: {nom: string; prix: string}[];
  inclus: string[];
  suivant: string; // texte du teaser
};

export const EPISODES: Record<number, Episode> = {
  1: {
    n: 1,
    titre: 'AÉROPORT',
    etapes: [
      {quand: 'La veille', quoi: 'tu réserves sur WhatsApp', icone: 'tel'},
      {quand: '04:30', quoi: 'ton chauffeur est en bas', icone: 'voiture'},
      {quand: '05:10', quoi: "dépose à l'aéroport", icone: 'avion'},
    ],
    tarifs: [
      {nom: 'ÉCO', prix: '8 000 F'},
      {nom: 'CONFORT', prix: '10 000 F'},
    ],
    inclus: ['Chauffeur professionnel', 'Véhicule propre', 'Horaires respectés'],
    suivant: 'Épisode 2 : VOYAGE → abonne-toi pour ne pas le rater',
  },
  2: {
    n: 2,
    titre: 'VOYAGE',
    etapes: [
      {quand: 'La veille', quoi: 'tu réserves sur WhatsApp', icone: 'tel'},
      {quand: '06:00', quoi: 'départ de Douala', icone: 'voiture'},
      {quand: '09:00', quoi: 'arrivée à Kribi', icone: 'palmier'},
    ],
    tarifs: [
      {nom: '1 JOUR', prix: '50 000 F'},
      {nom: '3 JOURS', prix: '100 000 F'},
    ],
    inclus: ['Chauffeur professionnel', 'Véhicule propre', 'Horaires respectés'],
    suivant: 'Épisode 3 : ÉCO → abonne-toi pour ne pas le rater',
  },
  3: {
    n: 3,
    titre: 'ÉCO',
    etapes: [
      {quand: 'Le matin', quoi: 'tu écris « JP » sur WhatsApp', icone: 'tel'},
      {quand: '08:00', quoi: 'ton chauffeur est en bas', icone: 'voiture'},
      {quand: 'Toute la journée', quoi: 'tu paies à l’heure', icone: 'horloge'},
    ],
    tarifs: [
      {nom: "À L'HEURE", prix: '2 500 F'},
      {nom: 'DÈS 5 H', prix: '2 000 F/h'},
    ],
    inclus: ['Chauffeur professionnel', 'Véhicule propre', 'Horaires respectés'],
    suivant: 'Épisode 4 : CONFORT → abonne-toi pour ne pas le rater',
  },
  4: {
    n: 4,
    titre: 'CONFORT',
    etapes: [
      {quand: 'Avant', quoi: 'tu écris « JP » sur WhatsApp', icone: 'tel'},
      {quand: 'À l’heure dite', quoi: 'le chauffeur t’ouvre la porte', icone: 'voiture'},
      {quand: 'À bord', quoi: 'Wi-Fi, clim et mini écran', icone: 'etoile'},
    ],
    tarifs: [
      {nom: "À L'HEURE", prix: '3 500 F'},
      {nom: 'DÈS 5 H', prix: '3 000 F/h'},
    ],
    inclus: ['Chauffeur professionnel', 'Véhicule propre', 'Horaires respectés'],
    suivant: 'Série complète : revois les 4 épisodes',
  },
};

const ICONES: Record<Icone, ReactNode> = {
  tel: <path d="M30 6 h40 a8 8 0 0 1 8 8 v72 a8 8 0 0 1 -8 8 h-40 a8 8 0 0 1 -8 -8 v-72 a8 8 0 0 1 8 -8 Z M44 84 h12" fill="none" strokeWidth="8" strokeLinecap="round" />,
  voiture: <path d="M10 62 L18 42 Q22 32 34 32 L66 32 Q76 32 82 42 L90 62 L90 74 L10 74 Z M28 74 a8 8 0 1 0 0.1 0 M72 74 a8 8 0 1 0 0.1 0" />,
  avion: <path d="M50 6 Q56 6 56 18 L56 40 L94 60 L94 68 L56 58 L56 80 L68 88 L68 94 L50 90 L32 94 L32 88 L44 80 L44 58 L6 68 L6 60 L44 40 L44 18 Q44 6 50 6 Z" />,
  palmier: <path d="M48 94 Q46 70 52 40 M52 40 Q30 30 12 44 M52 40 Q70 26 90 40 M52 40 Q40 18 22 16 M52 40 Q64 14 82 16" fill="none" strokeWidth="9" strokeLinecap="round" />,
  horloge: <path d="M50 8 a42 42 0 1 1 -0.1 0 Z M50 24 V52 L68 62" fill="none" strokeWidth="9" strokeLinecap="round" />,
  etoile: <path d="M50 8 L62 38 L94 38 L68 58 L78 90 L50 70 L22 90 L32 58 L6 38 L38 38 Z" />,
};
const Ic: React.FC<{i: Icone; taille: number; couleur: string}> = ({i, taille, couleur}) => (
  <svg width={taille} height={taille} viewBox="0 0 100 100" style={{fill: couleur, stroke: couleur}}>
    {ICONES[i]}
  </svg>
);

/** Cases d'épisodes en haut (identité de la série). */
const Cases: React.FC<{n: number; t: number; suivantClignote: boolean}> = ({n, t, suivantClignote}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center', gap: 18}}>
    {[1, 2, 3, 4].map((k) => {
      const allume = k <= n;
      const clign = suivantClignote && k === n + 1 && Math.floor(t * 3) % 2 === 0;
      return (
        <div key={k} style={{width: 92, height: 92, borderRadius: 18, border: `4px solid ${allume || clign ? C.jaune : '#2A3A6A'}`, background: allume ? C.jaune : clign ? `${C.jaune}33` : 'transparent', color: allume ? C.nuit : clign ? C.jaune : '#3D4E80', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: P.grotesk, fontWeight: 700, fontSize: 48}}>
          {k}
        </div>
      );
    })}
  </div>
);

const Generique: React.FC<{ep: Episode; th: number}> = ({ep, th}) => {
  const badge = clamp(ressort(th, 0.0, 2.4, 8), 0, 1.15);
  const titre = clamp(ressort(th, 0.1, 2.2, 7), 0, 1.15);
  const taille = ep.titre.length > 6 ? 170 : 210;
  return (
    <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, paddingBottom: 120}}>
      <div style={{padding: '18px 36px', borderRadius: 18, background: C.jaune, color: C.nuit, fontFamily: P.grotesk, fontWeight: 700, fontSize: 88, letterSpacing: 4, transform: `scale(${mix(1.8, 1, Math.min(1, badge))})`, opacity: clamp(badge * 4)}}>
        ÉPISODE {ep.n}/4
      </div>
      <div style={{fontFamily: P.grotesk, fontWeight: 700, fontSize: taille, letterSpacing: -6, color: C.blanc, lineHeight: 1, transform: `translateY(${(1 - Math.min(1, titre)) * 80}px) scale(${mix(0.7, 1, Math.min(1, titre))})`, opacity: clamp(titre * 3)}}>{ep.titre}</div>
      <div style={{width: mix(0, 700, ease.out(prog(th, 0.4, 0.9))), height: 10, borderRadius: 5, background: C.bleu}} />
    </AbsoluteFill>
  );
};

export const fabriquerEpisode = (numero: number, idSon: number) => {
  const ep = EPISODES[numero];
  const Comp: React.FC = () => {
    const t = useT();
    const boucle = t >= 19.7;
    const th = boucle ? t - 19.7 : t;
    const gen = th < 1.5 ? 1 - prog(th, 1.3, 1.6) : 0;
    const chrono = prog(t, 1.5, 1.8) * (1 - prog(t, 4.8, 5.1));
    const tarifs = prog(t, 5.0, 5.2) * (1 - prog(t, 8.8, 9.1));
    const inclus = prog(t, 9.0, 9.2) * (1 - prog(t, 11.8, 12.0));
    const cta = visibleJusqua(t, 12.0, 19.45, 0.3, 0.25);
    const teaser = visibleJusqua(t, 15.0, 19.45, 0.4, 0.25);
    const titre: CSSProperties = {fontFamily: P.grotesk, fontWeight: 700, color: C.blanc};
    return (
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, #13245A, ${C.nuit} 70%)`, overflow: 'hidden'}}>
        {/* Lignes de piste en fond */}
        <AbsoluteFill style={{background: 'repeating-linear-gradient(90deg, transparent 0 178px, rgba(47,107,255,0.08) 178px 180px)'}} />
        <Cases n={ep.n} t={t} suivantClignote={t >= 15 && t < 19.7} />
        {gen > 0 ? <AbsoluteFill style={{opacity: gen}}><Generique ep={ep} th={th} /></AbsoluteFill> : null}

        {/* Chronologie verticale, comme un plan de vol */}
        {chrono > 0 ? (
          <AbsoluteFill style={{opacity: chrono}}>
            <div style={{...titre, position: 'absolute', left: 120, top: 330, fontSize: 44, color: C.jaune, letterSpacing: 4}}>{ep.titre} · LE DÉROULÉ</div>
            <div style={{position: 'absolute', left: 197, top: 520, width: 6, height: mix(0, 760, ease.inOut(prog(t, 1.7, 4.2))), background: C.bleu, borderRadius: 3}} />
            {ep.etapes.map((e, i) => {
              const a = 1.8 + i * 1.0;
              const p = ease.back(prog(t, a, a + 0.35));
              const on = t >= a + 0.2;
              return (
                <div key={i} style={{position: 'absolute', left: 120, right: 120, top: 470 + i * 360, display: 'flex', alignItems: 'center', gap: 40, opacity: clamp(p * 2), transform: `translateX(${(1 - p) * 80}px)`}}>
                  <div style={{flex: '0 0 160px', height: 160, borderRadius: 80, background: on ? C.jaune : '#1A2A5A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: on ? `0 0 50px ${C.jaune}66` : 'none'}}>
                    <Ic i={e.icone} taille={86} couleur={on ? C.nuit : C.gris} />
                  </div>
                  <div>
                    <div style={{...titre, fontSize: 72, color: on ? C.jaune : C.gris, fontFamily: P.mono}}>{e.quand}</div>
                    <div style={{...titre, fontSize: 48, fontWeight: 400, lineHeight: 1.15}}>{e.quoi}</div>
                  </div>
                </div>
              );
            })}
          </AbsoluteFill>
        ) : null}

        {/* Tarifs : deux cartes d'embarquement */}
        {tarifs > 0 ? (
          <AbsoluteFill style={{opacity: tarifs}}>
            <div style={{...titre, position: 'absolute', left: 120, right: 120, top: 360, fontSize: 100, textAlign: 'center'}}>LES TARIFS</div>
            {ep.tarifs.map((x, i) => {
              const p = clamp(ressort(t, 5.3 + i * 0.6, 1.6, 6), 0, 1.1);
              return (
                <div key={x.nom} style={{position: 'absolute', left: 120, width: 840, top: 600 + i * 420, height: 340, transform: `perspective(1600px) translateX(${(1 - Math.min(1, p)) * (i ? -900 : 900)}px) rotateY(${(1 - Math.min(1, p)) * (i ? 40 : -40)}deg) rotate(${i ? 1.5 : -1.5}deg)`}}>
                  <CarteEmbarquement nom={x.nom} prix={x.prix} titre={ep.titre} />
                </div>
              );
            })}
          </AbsoluteFill>
        ) : null}

        {/* Inclus */}
        {inclus > 0 ? (
          <AbsoluteFill style={{opacity: inclus}}>
            <div style={{...titre, position: 'absolute', left: 120, right: 120, top: 400, fontSize: 110, textAlign: 'center', color: C.jaune}}>Inclus</div>
            {ep.inclus.map((x, i) => {
              const p = ease.back(prog(t, 9.4 + i * 0.5, 9.75 + i * 0.5));
              return (
                <div key={x} style={{position: 'absolute', left: 120, right: 120, top: 640 + i * 230, display: 'flex', alignItems: 'center', gap: 36, opacity: clamp(p * 2), transform: `scale(${mix(0.85, 1, p)})`}}>
                  <svg width="120" height="120" viewBox="-60 -60 120 120" style={{flex: '0 0 120px'}}>
                    <circle r="54" fill={C.bleu} />
                    <path d="M-24 2 L-8 18 L26 -18" stroke="#fff" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(p)} />
                  </svg>
                  <div style={{...titre, fontSize: 60, lineHeight: 1.1}}>{x}</div>
                </div>
              );
            })}
          </AbsoluteFill>
        ) : null}

        {/* Appel à l'action (reste jusqu'à la fin) + teaser de l'épisode suivant */}
        {cta > 0 ? (
          <AbsoluteFill style={{opacity: cta}}>
            <FinJP
              t={t}
              s={{police: P.grotesk, couleur: C.blanc, couleurNumero: C.blanc, accent: C.jaune, tailleNumero: 150}}
              p={(i) => prog(t, 12.1 + i * 0.12, 12.45 + i * 0.12)}
              haut={340}
              ecart={22}
            />
          </AbsoluteFill>
        ) : null}
        {teaser > 0 ? (
          <div style={{position: 'absolute', left: 120, right: 120, top: 1430, padding: '24px 30px', borderRadius: 24, border: `3px solid ${C.jaune}`, background: '#0F1D45', opacity: teaser, transform: `translateY(${(1 - teaser) * 60}px)`, ...titre, fontSize: 42, lineHeight: 1.2, textAlign: 'center'}}>
            {ep.suivant}
          </div>
        ) : null}
        <Bande n={idSon} />
      </AbsoluteFill>
    );
  };
  return Comp;
};

const CarteEmbarquement: React.FC<{nom: string; prix: string; titre: string}> = ({nom, prix, titre}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', borderRadius: 30, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}}>
    <div style={{flex: 1, background: '#FFFFFF', padding: '34px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: P.mono, fontWeight: 700, fontSize: 28, color: '#5A6690', letterSpacing: 2}}>
        <span>CARTE JP</span>
        <span>{titre}</span>
      </div>
      <div style={{fontFamily: P.grotesk, fontWeight: 700, fontSize: 64, color: C.nuit, letterSpacing: 2}}>{nom}</div>
      <div style={{fontFamily: P.grotesk, fontWeight: 700, fontSize: 104, color: C.bleu, lineHeight: 1, letterSpacing: -3}}>{prix}</div>
    </div>
    {/* Talon détachable */}
    <div style={{flex: '0 0 200px', background: C.jaune, borderLeft: '6px dashed #0A1430', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16}}>
      <div style={{width: 120, height: 120, background: `repeating-linear-gradient(90deg, ${C.nuit} 0 6px, transparent 6px 10px, ${C.nuit} 10px 12px, transparent 12px 18px)`}} />
      <div style={{fontFamily: P.mono, fontWeight: 800, fontSize: 30, color: C.nuit}}>JP</div>
    </div>
  </div>
);

export const Pub26Episode1 = fabriquerEpisode(1, 26);
export const Pub26Episode2 = fabriquerEpisode(2, 262);
export const Pub26Episode3 = fabriquerEpisode(3, 263);
export const Pub26Episode4 = fabriquerEpisode(4, 264);
