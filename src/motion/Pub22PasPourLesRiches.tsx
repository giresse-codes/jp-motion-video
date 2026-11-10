// 22. « Ce n'est pas pour les riches » — contre-pied + révélation de prix (16 s).
import type {CSSProperties} from 'react';
import {AbsoluteFill} from 'remotion';
import {Bande, clamp, ease, FinJP, hasard, mix, prog, ressort, useT, visibleJusqua} from './commun';
import {POLICES_MOTION as P} from './config';

const C = {noir: '#0B0B0C', or: '#E3C26B', blanc: '#FFFFFF', menthe: '#3EE6A8'};
const NB = 56; // pièces de la grande pile
const RESTE = 5; // pièces qui restent
const EP = 15; // épaisseur d'une pièce (px)
const SOL = 1240;
const prixF = (n: number) => `${Math.round(n).toLocaleString('fr-FR').replace(/ | /g, ' ')} F`;

const Piece: React.FC<{x: number; y: number; r?: number; s?: number; o?: number; ecrase?: number}> = ({x, y, r = 0, s = 1, o = 1, ecrase = 0}) => (
  <div style={{position: 'absolute', left: x - 150, top: y - 50, width: 300, height: 100 + EP, transform: `rotate(${r}deg) scale(${s}, ${s * (1 - ecrase * 0.8)})`, transformOrigin: '50% 100%', opacity: o}}>
    <div style={{position: 'absolute', left: 0, top: EP, width: 300, height: 100, borderRadius: '50%', background: 'linear-gradient(90deg, #7A5C1E, #C9A24B 30%, #F5DC8E 50%, #B48A35 75%, #6E5219)'}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 300, height: 100, borderRadius: '50%', background: 'radial-gradient(ellipse at 40% 35%, #FFF1BE, #E3C26B 45%, #A9822F 100%)', boxShadow: 'inset 0 0 0 8px rgba(120,90,30,0.55), inset 0 0 0 14px rgba(255,236,170,0.35)'}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'repeating-linear-gradient(100deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 6px)'}} />
    </div>
  </div>
);

export const Pub22PasPourLesRiches: React.FC = () => {
  const t = useT();
  const boucle = t >= 15.7; // image 0 sur la fin
  const th = boucle ? 0 : t;
  const gros: CSSProperties = {fontFamily: P.grotesk, fontWeight: 700, letterSpacing: -3, lineHeight: 1};

  // ── Hook ──
  const riches = ressort(th, 0.3, 3, 9);
  const barre = prog(th, 1.2, 1.35);
  const faux = th >= 1.3 ? ease.back(prog(th, 1.3, 1.5), 2.5) : 0;
  const hook = th < 1.75 ? 1 - prog(th, 1.55, 1.75) : 0;

  // ── Pièces ──
  const pile = t >= 1.5 && t < 11.6;
  const effondre = prog(t, 2.6, 3.4);
  const fond = prog(t, 3.2, 3.9);
  const pilesY = (i: number) => SOL - i * EP;
  const montee = ease.out(prog(t, 1.5, 2.3));

  // ── Prix ──
  const compteur = t < 4.2 ? 0 : t < 5.4 ? mix(0, 2500, ease.out(prog(t, 4.2, 5.4))) : t < 7.2 ? 2500 : mix(2500, 2000, ease.inOut(prog(t, 7.2, 7.9)));
  const etiquette = prog(t, 4.0, 4.3) * (1 - prog(t, 9.3, 9.6));
  const tampon = t >= 8.2 ? ressort(t, 8.2, 2.5, 8) : 0;
  const carte = prog(t, 9.5, 9.8) * (1 - prog(t, 11.4, 11.7));
  const flip = ease.inOut(prog(t, 9.7, 10.3)) * 180;
  const cta = visibleJusqua(t, 11.5, 15.65);

  return (
    <AbsoluteFill style={{background: C.noir, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, rgba(227,194,107,0.16), transparent 60%)'}} />

      {/* Hook */}
      {hook > 0 ? (
        <div style={{position: 'absolute', left: 100, right: 100, top: 560, opacity: hook}}>
          <div style={{...gros, fontSize: 96, color: C.blanc, whiteSpace: 'nowrap'}}>Un chauffeur privé,</div>
          <div style={{position: 'relative', marginTop: 30, display: 'inline-block', opacity: clamp(riches * 3), transform: `scale(${mix(1.6, 1, clamp(riches, 0, 1.1))})`, transformOrigin: 'left center'}}>
            <div style={{...gros, fontSize: 84, color: C.or, whiteSpace: 'nowrap'}}>c&apos;est pour les riches.</div>
            <div style={{position: 'absolute', left: -10, top: '52%', height: 22, width: `${barre * 104}%`, background: C.blanc, borderRadius: 11, transform: 'rotate(-3deg)', boxShadow: '0 4px 0 rgba(0,0,0,0.4)'}} />
          </div>
          {faux > 0 ? (
            <div style={{...gros, position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontSize: 260, color: C.menthe, transform: `translateY(${(1 - clamp(faux)) * -400}px) scale(${faux}) rotate(-6deg)`, textShadow: '0 20px 60px rgba(62,230,168,0.45)'}}>
              FAUX.
            </div>
          ) : null}
        </div>
      ) : null}
      {boucle ? (
        <div style={{position: 'absolute', left: 100, right: 100, top: 560}}>
          <div style={{...gros, fontSize: 96, color: C.blanc, whiteSpace: 'nowrap'}}>Un chauffeur privé,</div>
        </div>
      ) : null}

      {/* Pile de pièces : ce que tu imagines, puis la réalité */}
      {pile ? (
        <AbsoluteFill style={{opacity: 1 - prog(t, 11.3, 11.6), transform: `translateX(${t > 4 ? -170 * ease.inOut(prog(t, 3.8, 4.4)) : 0}px)`}}>
          <div style={{position: 'absolute', left: 390, top: SOL + 60, width: 300, height: 60, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', filter: 'blur(14px)'}} />
          {Array.from({length: NB}).map((_, i) => {
            const apparition = clamp(montee * NB - i);
            if (apparition <= 0) return null;
            if (i < RESTE) return <Piece key={i} x={540} y={pilesY(i)} />;
            // chute : vers la gauche ou la droite, rebond puis fonte
            const k = hasard(i * 3.3);
            const debut = 2.6 + (NB - i) * 0.006;
            const p = clamp((t - debut) / 0.6);
            if (t < debut) return <Piece key={i} x={540 + Math.sin(i * 1.7) * 3} y={pilesY(i) - (1 - apparition) * 60} o={apparition} />;
            const dir = k > 0.5 ? 1 : -1;
            const x = 540 + dir * (120 + k * 360) * p;
            const y = mix(pilesY(i), SOL + 20 - k * 40, p * p);
            return <Piece key={i} x={x} y={y} r={dir * p * (90 + k * 200)} s={mix(1, 0.7, p)} o={1 - fond} ecrase={clamp((t - debut - 0.6) * 3)} />;
          })}
          {/* Étiquette « Ce que tu imagines » */}
          {t < 3.0 ? (
            <div style={{position: 'absolute', left: 700, top: 480, padding: '18px 28px', background: C.blanc, color: C.noir, fontFamily: P.grotesk, fontWeight: 700, fontSize: 40, borderRadius: 12, transform: `rotate(6deg) scale(${ease.back(prog(t, 1.9, 2.2))})`, opacity: 1 - effondre * 3}}>
              Ce que tu imagines
            </div>
          ) : null}
          {/* Étiquette de prix sur la petite pile */}
          {etiquette > 0 ? (
            <div style={{position: 'absolute', left: 690, top: 700, width: 470, opacity: etiquette, transform: `scale(${mix(0.8, 1, etiquette)})`, transformOrigin: 'left center'}}>
              <div style={{fontFamily: P.grotesk, fontSize: 40, color: C.or, marginBottom: 10}}>{t < 7.2 ? 'La réalité :' : 'Dès 5 h :'}</div>
              <div style={{...gros, fontSize: 130, color: C.blanc}}>{prixF(compteur)}</div>
              <div style={{...gros, fontSize: 60, color: C.blanc, marginTop: 6}}>/ heure</div>
              <div style={{fontFamily: P.grotesk, fontSize: 36, color: C.menthe, marginTop: 20}}>Service Éco · promo</div>
            </div>
          ) : null}
          {tampon > 0 && t < 9.6 ? (
            <div style={{position: 'absolute', left: 170, top: 520, padding: '22px 34px', border: `10px solid ${C.menthe}`, borderRadius: 18, color: C.menthe, fontFamily: P.grotesk, fontWeight: 700, fontSize: 64, lineHeight: 1, textAlign: 'center', transform: `rotate(-10deg) scale(${mix(2.2, 1, clamp(tampon, 0, 1.2))})`, opacity: clamp(tampon * 2) * (1 - prog(t, 9.3, 9.6))}}>
              1 HEURE<br />OFFERTE
              <div style={{fontSize: 30, marginTop: 12, fontWeight: 400}}>5 h pour 10 000 F</div>
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {/* Carte en verre qui se retourne */}
      {carte > 0 ? (
        <div style={{position: 'absolute', left: 150, top: 560, width: 780, height: 560, opacity: carte}}>
          <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `perspective(1600px) rotateY(${flip}deg)`}}>
            <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 40, background: 'linear-gradient(140deg, rgba(227,194,107,0.35), rgba(255,255,255,0.06))', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...gros, fontSize: 90, color: C.or}}>
              Et le Confort ?
            </div>
            <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 40, background: 'linear-gradient(140deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05))', border: '2px solid rgba(255,255,255,0.45)', boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14}}>
              <div style={{...gros, fontSize: 96, color: C.blanc}}>Confort</div>
              <div style={{...gros, fontSize: 120, color: C.or}}>3 500 F/h</div>
              <div style={{fontFamily: P.grotesk, fontSize: 48, color: C.menthe}}>Wi-Fi · Clim</div>
              <div style={{position: 'absolute', top: 0, bottom: 0, width: 160, left: `${mix(-30, 120, prog(t, 10.2, 10.9))}%`, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)', transform: 'skewX(-18deg)'}} />
            </div>
          </div>
        </div>
      ) : null}

      {/* Appel à l'action : reste jusqu'à la fin */}
      {cta > 0 ? (
        <AbsoluteFill style={{opacity: cta}}>
          <div style={{...gros, position: 'absolute', left: 120, right: 120, top: 260, textAlign: 'center', fontSize: 92, color: C.or}}>Le luxe, à ton prix.</div>
          <FinJP
            t={t}
            s={{police: P.grotesk, couleur: C.blanc, couleurNumero: C.blanc, accent: C.menthe, tailleNumero: 150}}
            p={(i) => prog(t, 11.8 + i * 0.12, 12.15 + i * 0.12)}
            haut={560}
          />
        </AbsoluteFill>
      ) : null}
      <Bande n={22} />
    </AbsoluteFill>
  );
};
