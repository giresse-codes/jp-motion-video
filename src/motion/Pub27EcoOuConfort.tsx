// 27. « Éco ou Confort ? » — sondage (15 s). Symétrie parfaite gauche / droite, aucun faux pourcentage.
import type {CSSProperties} from 'react';
import {AbsoluteFill} from 'remotion';
import {Bande, clamp, ease, FinJP, prog, ressort, useT, visibleJusqua} from './commun';
import {POLICES_MOTION as P} from './config';

const C = {menthe: '#3EE6A8', violet: '#7C5CFF', noir: '#0E0E10', blanc: '#FFFFFF'};
const ECO = ['2 500 F/h (promo)', 'Dès 5 h : 2 000 F/h', 'Mini écran', 'Idéal au quotidien'];
const CONFORT = ['3 500 F/h (promo)', 'Dès 5 h : 3 000 F/h', 'Wi-Fi + clim + mini écran', "Le chauffeur t'ouvre la porte"];
const LIGNES_T = [1.7, 2.7, 3.7, 4.7]; // une ligne de chaque côté, en même temps

/** Bouton 3D (cylindre vu de 3/4) : `sortie` 0 = dans le sol, 1 = sorti ; `appui` 0 → 1 enfoncé. */
const Bouton: React.FC<{x: number; texte: string; couleur: string; sortie: number; appui: number}> = ({x, texte, couleur, sortie, appui}) => {
  const L = 330;
  const haut = 120 * clamp(sortie) * (1 - appui * 0.7);
  return (
    <div style={{position: 'absolute', left: x - L / 2, top: 440, width: L, height: 300}}>
      {/* Socle */}
      <div style={{position: 'absolute', left: -20, right: -20, top: 150, height: 130, borderRadius: '50%', background: '#1B1B20', boxShadow: '0 30px 50px rgba(0,0,0,0.6), inset 0 6px 0 #2A2A31'}} />
      {/* Corps du cylindre */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 160 - haut, height: haut + 50, background: `linear-gradient(90deg, color-mix(in srgb, ${couleur} 55%, #000), ${couleur} 45%, color-mix(in srgb, ${couleur} 70%, #000))`, borderRadius: '0 0 50% 50% / 0 0 50px 50px'}} />
      {/* Dessus */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 110 - haut, height: 100, borderRadius: '50%', background: `radial-gradient(ellipse at 45% 35%, color-mix(in srgb, ${couleur} 60%, #fff), ${couleur} 60%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: P.grotesk, fontWeight: 700, fontSize: 52, color: C.noir, letterSpacing: 1, boxShadow: appui > 0.5 ? `0 0 60px ${couleur}` : 'none'}}>
        {texte}
      </div>
    </div>
  );
};

export const Pub27EcoOuConfort: React.FC = () => {
  const t = useT();
  const boucle = t >= 14.7;
  const th = boucle ? t - 15 : t;
  const sortie = clamp(ressort(th, 0.0, 1.8, 7), 0, 1.12);
  const appui = t >= 9 && !boucle ? ease.inOut(prog(t, 9.2, 9.45)) * (1 - ease.inOut(prog(t, 9.6, 9.8))) + (t >= 9.8 ? ease.inOut(prog(t, 10.0, 10.2)) * 0.6 : 0) : 0;
  const colonnes = prog(t, 1.5, 1.7) * (1 - prog(t, 10.8, 11.1));
  const sondage = prog(t, 6.0, 6.3) * (1 - prog(t, 8.8, 9.1));
  const cta = visibleJusqua(t, 11.0, 14.5, 0.35, 0.2);
  const pouls = 1 + Math.abs(Math.sin(t * Math.PI * 2)) * 0.12;
  const titre: CSSProperties = {position: 'absolute', left: 120, right: 120, textAlign: 'center', fontFamily: P.grotesk, fontWeight: 700, color: C.blanc};

  return (
    <AbsoluteFill style={{background: C.noir, overflow: 'hidden'}}>
      {/* Deux moitiés colorées, noir au centre */}
      <AbsoluteFill style={{background: `linear-gradient(90deg, ${C.menthe}55 0%, ${C.menthe}10 42%, ${C.noir} 50%, ${C.violet}10 58%, ${C.violet}66 100%)`}} />
      <div style={{position: 'absolute', left: 538, top: 0, bottom: 0, width: 4, background: 'linear-gradient(180deg, transparent, #ffffff22, transparent)'}} />

      <div style={{...titre, top: 220, fontSize: 88, whiteSpace: 'nowrap'}}>Tu choisis lequel ?</div>
      <Bouton x={290} texte="ÉCO" couleur={C.menthe} sortie={sortie} appui={appui} />
      <Bouton x={790} texte="CONFORT" couleur={C.violet} sortie={sortie} appui={appui} />
      <div style={{position: 'absolute', left: 540 - 70, top: 520, width: 140, height: 140, borderRadius: 70, background: C.blanc, color: C.noir, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: P.grotesk, fontWeight: 700, fontSize: 56, transform: `scale(${pouls * clamp(sortie)})`, boxShadow: '0 0 40px rgba(255,255,255,0.35)'}}>OU</div>

      {/* Comparatif, ligne par ligne des deux côtés */}
      {colonnes > 0 ? (
        <AbsoluteFill style={{opacity: colonnes}}>
          {[0, 1, 2, 3].map((i) => {
            const p = ease.back(prog(t, LIGNES_T[i], LIGNES_T[i] + 0.3));
            const ligne = (txt: string, cote: -1 | 1, couleur: string): React.ReactNode => (
              <div style={{position: 'absolute', top: 820 + i * 140, [cote < 0 ? 'left' : 'right']: 110, width: 410, minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '10px 16px', boxSizing: 'border-box', borderRadius: 22, border: `3px solid ${couleur}`, background: `${couleur}22`, fontFamily: P.grotesk, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.blanc, opacity: clamp(p * 2), transform: `translateX(${(1 - p) * cote * 120}px)`}}>
                {txt}
              </div>
            );
            return (
              <div key={i}>
                {ligne(ECO[i], -1, C.menthe)}
                {ligne(CONFORT[i], 1, C.violet)}
              </div>
            );
          })}
        </AbsoluteFill>
      ) : null}

      {/* Barre de sondage qui oscille (aucun chiffre) */}
      {sondage > 0 ? (
        <div style={{position: 'absolute', left: 120, right: 120, top: 1400, opacity: sondage}}>
          {(() => {
            const part = 0.5 + Math.sin((t - 6) * 3.4) * 0.22 * Math.min(1, (t - 6) * 2);
            return (
              <div style={{height: 70, borderRadius: 35, overflow: 'hidden', display: 'flex', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
                <div style={{width: `${part * 100}%`, background: C.menthe}} />
                <div style={{width: 10, background: C.blanc}} />
                <div style={{flex: 1, background: C.violet}} />
              </div>
            );
          })()}
          <div style={{textAlign: 'center', marginTop: 30, fontFamily: P.grotesk, fontWeight: 700, fontSize: 64, color: C.blanc}}>Vote en commentaire 👇</div>
        </div>
      ) : null}
      {t >= 9.2 && t < 11.1 ? <div style={{...titre, top: 1420, fontSize: 80, opacity: prog(t, 9.4, 9.6) * (1 - prog(t, 10.8, 11.1))}}>Les deux sont dispos.</div> : null}

      {/* Appel à l'action : reste jusqu'à la fin */}
      {cta > 0 ? (
        <AbsoluteFill style={{opacity: cta}}>
          <FinJP
            t={t}
            s={{
              police: P.grotesk,
              couleur: C.blanc,
              couleurNumero: C.blanc,
              accent: C.menthe,
              tailleNumero: 150,
              ecris: (
                <>
                  Écris <span style={{color: C.menthe}}>«&nbsp;ÉCO&nbsp;»</span> ou <span style={{color: C.violet}}>«&nbsp;CONFORT&nbsp;»</span>
                  <br />
                  sur WhatsApp
                </>
              ),
            }}
            p={(i) => prog(t, 11.1 + i * 0.12, 11.45 + i * 0.12)}
            haut={790}
            tailleTexte={56}
            ecart={20}
          />
        </AbsoluteFill>
      ) : null}
      <Bande n={27} />
    </AbsoluteFill>
  );
};
