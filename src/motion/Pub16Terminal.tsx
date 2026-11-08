// 16. « > sudo arrête-de-conduire » — terminal de développeur (12 s).
// Le terminal est une fonction du temps : chaque commande est tapée caractère par caractère à vitesse humaine variable.
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {Bande, clamp, ease, hasard, LogoJP, prog, useT} from './commun';
import {MOTION, POLICES_MOTION as P} from './config';

const C = {fond: '#0B0F14', vert: '#3BFF8A', blanc: '#E8EDF2', cyan: '#4FD1FF', jaune: '#FFD24A', gris: '#6B7685'};
const TAILLE = 36;

type Ligne =
  | {type: 'cmd'; texte: string; debut: number; vitesse: number}
  | {type: 'sortie'; texte: string; a: number; couleur?: string}
  | {type: 'barre'; debut: number; fin: number};

export const SCRIPT_TERMINAL: Ligne[] = [
  {type: 'cmd', texte: 'sudo arrête-de-conduire', debut: 0.05, vitesse: 0.015},
  {type: 'sortie', texte: '[warning] Conducteur fatigué détecté', a: 1.5, couleur: C.jaune},
  {type: 'sortie', texte: 'Installation de jp-service…', a: 2.1},
  {type: 'barre', debut: 3.0, fin: 4.1},
  {type: 'sortie', texte: '✓ chauffeur-pro installé', a: 4.2, couleur: C.vert},
  {type: 'sortie', texte: '✓ wifi@bord · clim · mini-ecran', a: 4.6, couleur: C.vert},
  {type: 'sortie', texte: '✓ ponctualite=true', a: 5.0, couleur: C.vert},
  {type: 'cmd', texte: 'jp reserve --service=confort --heure=9h', debut: 5.5, vitesse: 0.022},
  {type: 'sortie', texte: '+----------------------------------+', a: 6.55, couleur: C.gris},
  {type: 'sortie', texte: '| Service   : Confort              |', a: 6.7},
  {type: 'sortie', texte: '| Tarif     : 3 500 F/h (promo)    |', a: 6.85},
  {type: 'sortie', texte: '| Statut    : ✓ Confirmé           |', a: 7.0},
  {type: 'sortie', texte: '| Chauffeur : en route             |', a: 7.15},
  {type: 'sortie', texte: '+----------------------------------+', a: 7.3, couleur: C.gris},
  {type: 'cmd', texte: 'jp tarifs', debut: 8.0, vitesse: 0.04},
  {type: 'sortie', texte: 'eco 2500/h · confort 3500/h', a: 8.6, couleur: C.cyan},
  {type: 'sortie', texte: 'aeroport 8000+ · voyage 50000/jour', a: 8.75, couleur: C.cyan},
];

/** Instants de frappe de chaque caractère (vitesse variable, pause après les espaces). */
export const instantsFrappe = (texte: string, debut: number, vitesse: number) => {
  const out: number[] = [];
  let tt = debut;
  [...texte].forEach((ch, i) => {
    tt += vitesse * (0.55 + hasard(i * 3.7 + debut) * 1.0) + (ch === ' ' ? vitesse * 1.5 : 0);
    out.push(tt);
  });
  return out;
};
export const tapes = (texte: string, debut: number, vitesse: number, t: number) => instantsFrappe(texte, debut, vitesse).filter((x) => x <= t).length;
const finFrappe = (texte: string, debut: number, vitesse: number) => instantsFrappe(texte, debut, vitesse).at(-1)!;

/** Coloration syntaxique d'une commande. */
const colorer = (txt: string): ReactNode[] =>
  txt.split(/(\s+)/).map((mot, i) => {
    let c = C.blanc;
    if (/^(sudo|jp)$/.test(mot)) c = C.cyan;
    else if (mot.startsWith('--')) {
      const [cle, val] = mot.split('=');
      return (
        <span key={i}>
          <span style={{color: C.jaune}}>{cle}</span>
          {val !== undefined ? <span style={{color: C.blanc}}>=<span style={{color: C.vert}}>{val}</span></span> : null}
        </span>
      );
    } else if (i > 0) c = C.vert;
    return <span key={i} style={{color: c}}>{mot}</span>;
  });

const Curseur: React.FC<{t: number; taille?: number}> = ({t, taille = TAILLE}) => (
  <span style={{display: 'inline-block', width: taille * 0.6, height: taille * 1.05, background: C.vert, verticalAlign: 'text-bottom', opacity: Math.floor(t * 2.2) % 2 ? 0 : 1, boxShadow: `0 0 12px ${C.vert}`}} />
);

const Invite = () => <span style={{color: C.vert}}>{'> '}</span>;

export const Pub16Terminal: React.FC = () => {
  const t = useT();
  const efface = t >= 9.5 && t < 11.75;
  const vide = t >= 11.75; // retour au curseur seul, pour la boucle
  const txt: CSSProperties = {fontFamily: P.mono, fontSize: TAILLE, lineHeight: 1.45, color: C.blanc, whiteSpace: 'pre', textShadow: '0 0 10px rgba(59,255,138,0.25)'};

  const lignes: ReactNode[] = [];
  let curseurPlace = false;
  if (!efface && !vide) {
    for (let i = 0; i < SCRIPT_TERMINAL.length; i++) {
      const l = SCRIPT_TERMINAL[i];
      if (l.type === 'cmd') {
        // L'invite apparaît dès que la sortie précédente est finie
        const prec = SCRIPT_TERMINAL[i - 1];
        const apparition = !prec ? 0 : prec.type === 'sortie' ? prec.a + 0.1 : prec.type === 'barre' ? prec.fin : 0;
        if (t < apparition) break;
        const n = tapes(l.texte, l.debut, l.vitesse, t);
        const enCours = t < finFrappe(l.texte, l.debut, l.vitesse) + 0.25;
        lignes.push(
          <div key={i}>
            <Invite />
            {colorer(l.texte.slice(0, n))}
            {enCours ? <Curseur t={n < l.texte.length ? 0 : t} /> : null}
          </div>,
        );
        if (enCours) {
          curseurPlace = true;
          break;
        }
      } else if (l.type === 'sortie') {
        if (t < l.a) break;
        lignes.push(
          <div key={i} style={{color: l.couleur ?? C.blanc}}>
            {l.texte.includes('[warning]') ? (
              <>
                <span style={{background: C.jaune, color: C.fond, padding: '0 6px'}}>[warning]</span>
                {l.texte.replace('[warning]', '')}
              </>
            ) : l.texte.startsWith('|') ? (
              <>
                <span style={{color: C.gris}}>|</span>
                <span style={{color: C.cyan}}>{l.texte.slice(1, 13)}</span>
                <span style={{color: l.texte.includes('✓') ? C.vert : C.blanc}}>
                  {l.texte.slice(13, -1).split('✓').map((m, k) => (
                    <span key={k}>
                      {k ? <span style={{display: 'inline-block', width: '0.6em', textAlign: 'center'}}>✓</span> : null}
                      {m}
                    </span>
                  ))}
                </span>
                <span style={{color: C.gris}}>|</span>
              </>
            ) : (
              l.texte
            )}
          </div>,
        );
      } else {
        if (t < l.debut) break;
        const p = prog(t, l.debut, l.fin);
        const n = Math.floor(p * 20);
        lignes.push(
          <div key={i}>
            <span style={{color: C.gris}}>[</span>
            <span style={{color: C.vert}}>{'#'.repeat(n)}</span>
            <span style={{color: '#26313D'}}>{'·'.repeat(20 - n)}</span>
            <span style={{color: C.gris}}>]</span> <span style={{color: n === 20 ? C.vert : C.blanc}}>{String(Math.round(p * 100)).padStart(3)} %</span>
          </div>,
        );
      }
    }
    // Invite vide en attente entre deux commandes
    const passees = SCRIPT_TERMINAL.filter((l) => (l.type === 'sortie' ? l.a : l.debut) <= t);
    const derniere = passees[passees.length - 1];
    if (!curseurPlace && derniere && derniere.type === 'sortie' && t > derniere.a + 0.1 && t < 9.5) {
      lignes.push(
        <div key="attente">
          <Invite />
          <Curseur t={t} />
        </div>,
      );
    }
  }
  if (vide || t < 0.05) {
    lignes.push(
      <div key="vide">
        <Invite />
        <Curseur t={vide ? 0 : t} />
      </div>,
    );
  }

  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #121A24, #05070A 75%)'}}>
      {/* Fenêtre de terminal macOS (points gris) */}
      <div style={{position: 'absolute', left: 60, right: 60, top: 200, bottom: 280, borderRadius: 28, transformOrigin: '8% 6%', transform: `scale(${1 + 0.55 * Math.max(1 - ease.inOut(prog(t, 1.3, 2.0)), ease.inOut(prog(t, 11.6, 11.95)))})`, background: C.fond, border: '2px solid #1E2733', boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 80px rgba(59,255,138,0.06)', overflow: 'hidden'}}>
        <div style={{height: 72, background: '#141B24', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16, borderBottom: '1px solid #1E2733'}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{width: 24, height: 24, borderRadius: 12, background: ['#5B6470', '#4A525D', '#3B424C'][i]}} />
          ))}
          <div style={{flex: 1, textAlign: 'center', fontFamily: P.mono, fontSize: 26, color: C.gris, marginRight: 100}}>jp@douala — zsh</div>
        </div>
        <div style={{...txt, padding: '30px 34px'}}>{lignes}</div>
        {efface ? <FinTerminal t={t} /> : null}
        {/* Lignes de balayage très discrètes */}
        <AbsoluteFill style={{background: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.018) 0 2px, transparent 2px 5px)', pointerEvents: 'none'}} />
        {/* Petit glitch à l'effacement */}
        {t >= 9.42 && t < 9.56 ? <AbsoluteFill style={{background: `linear-gradient(180deg, transparent ${hasard(Math.floor(t * 30)) * 80}%, rgba(79,209,255,0.35) 0, rgba(79,209,255,0.35) ${hasard(Math.floor(t * 30)) * 80 + 6}%, transparent 0)`}} /> : null}
      </div>
      <Bande n={16} />
    </AbsoluteFill>
  );
};

export const LIGNES_FIN = [
  {texte: 'Écris « JP » sur WhatsApp', debut: 9.6, vitesse: 0.02},
  {texte: MOTION.indicatif, debut: 10.15, vitesse: 0.03},
  {texte: '655 394 028', debut: 10.3, vitesse: 0.028},
  {texte: '↓ Réserve maintenant ↓', debut: 10.75, vitesse: 0.018},
];

const FinTerminal: React.FC<{t: number}> = ({t}) => {
  const base: CSSProperties = {fontFamily: P.mono, textAlign: 'center', whiteSpace: 'pre', textShadow: '0 0 18px rgba(59,255,138,0.45)'};
  const morceau = (i: number) => {
    const l = LIGNES_FIN[i];
    const n = tapes(l.texte, l.debut, l.vitesse, t);
    return {txt: l.texte.slice(0, n), fini: n === l.texte.length, actif: n > 0 && n < l.texte.length};
  };
  const [a, b, c, d] = [0, 1, 2, 3].map(morceau);
  const rebond = Math.abs(Math.sin(t * Math.PI * 2.2)) * 16;
  return (
    <AbsoluteFill style={{top: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, paddingBottom: 60}}>
      <div style={{...base, fontSize: 52, fontWeight: 700, color: C.blanc}}>
        {a.txt.replace('« JP »', '\u0000').split('\u0000').map((s, i, arr) => (
          <span key={i}>
            {s}
            {i < arr.length - 1 ? <span style={{color: C.cyan}}>« JP »</span> : null}
          </span>
        ))}
        {a.actif ? <Curseur t={0} taille={52} /> : null}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{...base, fontSize: 64, fontWeight: 700, color: C.vert}}>{b.txt}</div>
        <div style={{...base, fontSize: 124, fontWeight: 800, color: C.vert, lineHeight: 1.05}}>
          {c.txt}
          {c.actif ? <Curseur t={0} taille={110} /> : null}
        </div>
      </div>
      <div style={{...base, fontSize: 52, fontWeight: 700, color: C.jaune, transform: `translateY(${d.fini ? rebond : 0}px)`}}>{d.txt}</div>
      <div style={{opacity: clamp((t - 11.1) * 4), marginTop: 16}}>
        <LogoJP largeur={290} />
      </div>
    </AbsoluteFill>
  );
};
