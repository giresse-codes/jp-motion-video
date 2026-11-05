import {Easing, interpolate} from 'remotion';
import {POLICES, PUB_SETUP} from '../config';

// Fausse timeline After Effects (1280 × 880 px logiques), affichée sur l'écran du portable puis filmée en macro.
// Tout est fonction du temps t (s) : défilement des calques, valeurs des propriétés, images-clés, tête de lecture.
export const TL = {l: 1280, h: 880, gauche: 470, haut: 80, rang: 24};
const C = PUB_SETUP.couleurs;
const COULEURS = [C.vert, C.jaune, C.rose, C.violetCalque, C.bleu];
const NOMS = ['Voiture_noire', 'Carte_Douala', 'Trace_lumineuse', 'Pin_Douala', 'Nuages', 'Carte_visite', 'Cartes_Eco', 'Cartes_Confort', 'Cartes_Aeroport', 'Bulle_WhatsApp',
  'Ticket', 'Imprimante', 'Recu_2500', 'Texte_message', 'Telephone', 'Portiere', 'Main', 'Avion', 'Route_Kribi', 'Mer', 'Titre_conduire', 'Carte_prix', 'Logo_JP', 'Slogan', 'Fond', 'Lueur_LED', 'Camera', 'Null_1', 'Ajustement'];
const N = 110;
const DEPLIE = 54; // calque déplié (propriétés) : visible là où la liste se pose après le défilement du hook
const B = PUB_SETUP.temps;
const POLICE = POLICES.texte;
const D = PUB_SETUP.macroProprietes[0] * B; // début de la macro sur les propriétés

// Calque déterministe i : début, longueur (en px de timeline), couleur ; escalier vers le bas à droite.
const calque = (i: number) => ({nom: NOMS[i % NOMS.length] + (i >= NOMS.length ? ` ${Math.floor(i / NOMS.length) + 1}` : ''), debut: (i * 23) % 420 + (i % 7) * 8, long: 70 + ((i * 37) % 160), coul: COULEURS[(i * 3) % 5]});

const fmt = (v: number) => v.toFixed(1).replace('.', ',');
const PROPRIETES = (t: number) => {
  const k = Math.max(0, t - D);
  return [
    ['Point d’ancrage', `${fmt(960)}, ${fmt(540)}`],
    ['Position', `${fmt(540 + Math.sin(k * 9) * 180 + k * 60)}, ${fmt(960 - k * 140)}`],
    ['Échelle', `${fmt(100 + k * 38)}, ${fmt(100 + k * 38)} %`],
    ['Rotation', `0x ${k * 47 >= 0 ? '+' : ''}${fmt(k * 47)}°`],
    ['Opacité', `${Math.round(Math.min(100, 20 + k * 110))} %`],
  ];
};

export const Timeline: React.FC<{t: number; h?: number}> = ({t, h = TL.h}) => {
  // Défilement : très rapide pendant le hook, puis la liste se pose
  const defil = interpolate(t, [0, PUB_SETUP.macroDefilement[1] * B], [0, 1180], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const tete = TL.gauche + 40 + ((t * 70) % (TL.l - TL.gauche - 60));
  const tc = Math.floor(t * 30), code = `0;00;${String(Math.floor(tc / 30)).padStart(2, '0')};${String(tc % 30).padStart(2, '0')}`;
  const props = PROPRIETES(t);
  const rangs = [] as React.ReactNode[];
  for (let i = 0; i < N; i++) {
    const y = TL.haut + i * TL.rang - defil + (i > DEPLIE ? props.length * TL.rang : 0);
    if (y < TL.haut - TL.rang || y > h) continue;
    const c = calque(i), x = TL.gauche + 20 + c.debut, actif = tete >= x && tete <= x + c.long;
    rangs.push(
      <div key={i} style={{position: 'absolute', left: 0, top: y, width: TL.l, height: TL.rang - 2}}>
        <div style={{position: 'absolute', left: 8, top: 5, width: 12, height: 12, background: '#55575F', borderRadius: 2}} />
        <div style={{position: 'absolute', left: 28, top: 5, width: 12, height: 12, background: c.coul, borderRadius: 2}} />
        <div style={{position: 'absolute', left: 50, top: 3, fontFamily: POLICE, fontWeight: 600, fontSize: 13, color: '#8E9099'}}>{i + 1}</div>
        <div style={{position: 'absolute', left: 80, top: 3, fontFamily: POLICE, fontWeight: 600, fontSize: 14, color: actif ? '#E8E9EE' : '#A8AAB2', whiteSpace: 'nowrap'}}>{c.nom}</div>
        <div style={{position: 'absolute', left: 300, top: 6, width: 150, height: 10, borderRadius: 2, background: '#33343A'}} />
        <div style={{position: 'absolute', left: x, top: 2, width: c.long, height: TL.rang - 6, borderRadius: 3, background: c.coul, opacity: actif ? 1 : 0.62, boxShadow: actif ? `0 0 14px ${c.coul}` : 'none'}} />
      </div>,
    );
    if (i === DEPLIE) {
      // Calque déplié : ses propriétés de transformation, avec valeurs qui changent et images-clés qui apparaissent
      props.forEach(([nom, val], j) => {
        const yy = y + (j + 1) * TL.rang;
        const cles = [0.12, 0.3, 0.48, 0.66].filter((d) => t >= D + d + j * 0.04);
        rangs.push(
          <div key={`p${j}`} style={{position: 'absolute', left: 0, top: yy, width: TL.l, height: TL.rang - 2, background: '#232429'}}>
            <div style={{position: 'absolute', left: 96, top: 3, fontFamily: POLICE, fontWeight: 600, fontSize: 14, color: '#A8AAB2'}}>{nom}</div>
            <div style={{position: 'absolute', left: 260, top: 3, fontFamily: POLICE, fontWeight: 600, fontSize: 14, color: C.bleu, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>{val}</div>
            {cles.map((d, k) => (
              <div key={k} style={{position: 'absolute', left: TL.gauche + 60 + k * 120 + j * 14, top: 5, width: 11, height: 11, background: C.jaune, transform: `rotate(45deg) scale(${Math.min(1, (t - (D + d + j * 0.04)) * 12)})`}} />
            ))}
          </div>,
        );
      });
    }
  }
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: TL.l, height: h, background: '#1C1D21', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: TL.l, height: 40, background: '#26272C', borderBottom: '1px solid #33343A'}}>
        <div style={{position: 'absolute', left: 14, top: 10, fontFamily: POLICE, fontWeight: 600, fontSize: 15, color: '#E8E9EE'}}>JP_Pub_Douala ×</div>
        <div style={{position: 'absolute', left: 200, top: 10, fontFamily: POLICE, fontWeight: 600, fontSize: 15, color: '#8E9099'}}>Montage_14_clips</div>
        <div style={{position: 'absolute', right: 20, top: 8, fontFamily: POLICE, fontWeight: 700, fontSize: 18, color: C.bleu, fontVariantNumeric: 'tabular-nums'}}>{code}</div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 40, width: TL.gauche, height: h - 40, background: PUB_SETUP.couleurs.gris}} />
      <div style={{position: 'absolute', left: TL.gauche, top: 40, right: 0, height: 36, background: '#232429'}}>
        {new Array(14).fill(0).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 40 + i * 56, top: 6, fontFamily: POLICE, fontWeight: 600, fontSize: 12, color: '#7D7F88'}}>{String(i).padStart(2, '0')}s</div>
        ))}
      </div>
      {rangs}
      <div style={{position: 'absolute', left: tete, top: 40, width: 2, height: h, background: C.bleu, boxShadow: `0 0 8px ${C.bleu}`}} />
      <div style={{position: 'absolute', left: tete - 7, top: 62, width: 16, height: 14, background: C.bleu, borderRadius: 3}} />
    </div>
  );
};
