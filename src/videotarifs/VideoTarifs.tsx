// VideoTarifs — « Combien coûte un chauffeur privé à Douala ? » (20 s, 1080×1920, 30 i/s).
// Hook plein écran, 3 cartes de prix toutes les 4 s (chacune avec sa rupture : zoom, balayage,
// compteur), récap à enregistrer, CTA WhatsApp, retour au hook pour la boucle.
// Rouge en accent seulement. Textes, prix et volumes : VIDEO_TARIFS dans config.ts.
import {AbsoluteFill, interpolate, Easing, Sequence, spring, useCurrentFrame} from 'remotion';
import {CONTACT, COULEURS, POLICES, VIDEO_TARIFS} from '../config';
import {Finition} from '../components/Effets';
import {IconeAvion} from '../components/Icones';
import {WhatsAppIcon} from '../components/WhatsAppIcon';
import {Son} from '../components/Son';
import {Voiture} from '../video15/Video15';

const V = VIDEO_TARIFS;
const fps = 30;
const s = (sec: number) => Math.round(sec * fps);
const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const milliers = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
// Fonds teintés par carte (profonds, pour laisser la carte blanche et le rouge ressortir).
const TEINTES = ['#26262c', '#3a0d12', '#0f1c45'];

const Fond: React.FC<{teinte: string}> = ({teinte}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 95% 65% at 50% 42%, ${teinte} 0%, ${COULEURS.noir} 78%)`}} />
);

// ── Hook : texte plein écran, zoom rapide ──
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 8], [2.3, 1], {...clampOpts, easing: Easing.out(Easing.cubic)}) * interpolate(f, [8, 60], [1, 1.07], clampOpts);
  const secousse = f >= 8 && f < 14 ? Math.sin(f * 3.1) * 10 : 0;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 55% at 50% 50%, #2a0507 0%, ${COULEURS.noir} 72%)`}}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        transform: `translateX(${secousse}px) scale(${zoom})`}}>
        {V.hook.map((ligne, i) => {
          const fort = i === V.hookFort;
          const o = interpolate(f, [i * 2, i * 2 + 3], [0, 1], clampOpts);
          return (
            <div key={ligne} style={{opacity: o, fontFamily: POLICES.titre, fontWeight: 900, fontSize: fort ? 250 : 98, lineHeight: fort ? 1 : 1.08,
              letterSpacing: '-0.035em', color: fort ? COULEURS.rougeNeon : COULEURS.blanc, textShadow: fort ? `0 0 60px ${COULEURS.rouge}66` : 'none', whiteSpace: 'nowrap'}}>
              {ligne}
            </div>
          );
        })}
      </div>
      <Son nom="impact" a={7} volume={V.sons.hook} />
    </AbsoluteFill>
  );
};

// ── Icônes animées des cartes ──
const IconeVoiture: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'relative', width: 620, height: 260}}>
    <div style={{position: 'absolute', left: 50, top: 18 + Math.sin(f * 0.6) * 3}}><Voiture largeur={520} /></div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 232, height: 8, overflow: 'hidden'}}>
      {Array.from({length: 8}, (_, i) => (
        <div key={i} style={{position: 'absolute', top: 0, left: ((i * 110 - f * 14) % 880 + 880) % 880 - 110, width: 60, height: 8, borderRadius: 4, background: '#c9c9cf'}} />
      ))}
    </div>
  </div>
);

const IconeConfort: React.FC<{f: number}> = ({f}) => {
  const tuile = (i: number, contenu: React.ReactNode) => {
    const p = spring({frame: f - 10 - i * 6, fps, config: {damping: 12, stiffness: 160}});
    return (
      <div key={i} style={{width: 180, height: 180, borderRadius: 40, background: '#f3f3f5', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`}}>
        {contenu}
      </div>
    );
  };
  const onde = (k: number) => 0.35 + 0.65 * (Math.sin(f * 0.25 - k) > 0 ? 1 : 0.3);
  return (
    <div style={{display: 'flex', gap: 34}}>
      {tuile(0, (
        <svg width={110} height={110} viewBox="0 0 48 48">
          {[0, 1, 2].map((k) => <path key={k} d={['M6 18a26 26 0 0 1 36 0', 'M12 25a17 17 0 0 1 24 0', 'M18 32a8 8 0 0 1 12 0'][k]} fill="none" stroke="#111" strokeWidth={4.5} strokeLinecap="round" opacity={onde(2 - k)} />)}
          <circle cx={24} cy={38} r={3.8} fill={COULEURS.rouge} />
        </svg>
      ))}
      {tuile(1, (
        <svg width={110} height={110} viewBox="0 0 48 48" style={{transform: `rotate(${f * 2}deg)`}}>
          <g stroke="#111" strokeWidth={4.5} strokeLinecap="round" fill="none"><path d="M24 5v38M7.5 14.5l33 19M7.5 33.5l33-19" /><path d="M19 9l5 5 5-5M19 39l5-5 5 5" /></g>
        </svg>
      ))}
      {tuile(2, (
        <svg width={120} height={110} viewBox="0 0 52 48">
          <rect x={4} y={6} width={44} height={30} rx={5} fill="#111" />
          <rect x={8} y={10} width={36} height={22} rx={2} fill={`rgba(225,6,0,${0.55 + 0.45 * Math.abs(Math.sin(f * 0.15))})`} />
          <path d="M22 15l9 6-9 6Z" fill="#fff" /><rect x={20} y={38} width={12} height={5} rx={2} fill="#111" />
        </svg>
      ))}
    </div>
  );
};

const IconeVol: React.FC<{f: number}> = ({f}) => {
  const p = interpolate(f, [4, 50], [0, 1], {...clampOpts, easing: Easing.inOut(Easing.cubic)});
  const x = -260 + 520 * p, y = 70 - Math.sin(p * Math.PI) * 90 - p * 40;
  return (
    <div style={{position: 'relative', width: 620, height: 260}}>
      <svg width={620} height={260} style={{position: 'absolute', inset: 0}}>
        <path d="M50 220 Q310 20 570 140" fill="none" stroke="#d0d0d6" strokeWidth={6} strokeDasharray="14 16" strokeDashoffset={-f * 2} />
        <circle cx={50} cy={220} r={12} fill="#111" /><circle cx={570} cy={140} r={12} fill={COULEURS.rouge} />
      </svg>
      <div style={{position: 'absolute', left: 310 + x - 75, top: 130 + y - 75, transform: `rotate(${70 - p * 40}deg)`}}><IconeAvion taille={150} couleur="#111" /></div>
    </div>
  );
};

// ── Carte de prix, avec sa rupture d'entrée ──
const Carte: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const c = V.cartes[i];
  let transform = '', clip = 'none', flash = 0;
  if (c.interruption === 'zoom') {
    const z = interpolate(f, [0, 9], [1.45, 1], {...clampOpts, easing: Easing.out(Easing.cubic)});
    transform = `scale(${z}) translateX(${f < 12 && f > 8 ? Math.sin(f * 3) * 8 : 0}px)`;
    flash = interpolate(f, [0, 7], [0.75, 0], clampOpts);
  } else if (c.interruption === 'balayage') {
    const r = interpolate(f, [0, 12], [100, 0], {...clampOpts, easing: Easing.inOut(Easing.cubic)});
    clip = `inset(0 ${r}% 0 0 round 56px)`;
  } else {
    const y = interpolate(f, [0, 9], [420, 0], {...clampOpts, easing: Easing.out(Easing.back(1.4))});
    transform = `translateY(${y}px)`;
  }
  // Compteur qui défile (carte AÉROPORT) ; sinon prix fixe.
  const montant = c.interruption === 'compteur'
    ? Math.round(interpolate(f, [6, 42], [0, c.montant], {...clampOpts, easing: Easing.out(Easing.cubic)}) / 100) * 100
    : c.montant;
  const bande = interpolate(f, [0, 14], [-1500, 1500], {...clampOpts, easing: Easing.inOut(Easing.cubic)});
  const prixPunch = c.interruption === 'compteur' ? interpolate(f, [42, 46, 52], [1, 1.08, 1], clampOpts) : 1;
  return (
    <AbsoluteFill>
      <Fond teinte={TEINTES[i]} />
      <div style={{position: 'absolute', left: 80, right: 80, top: 400, height: 1020, borderRadius: 56, background: COULEURS.blanc, transform, clipPath: clip,
        boxShadow: '0 50px 120px rgba(0,0,0,.6)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 54, top: 54, padding: '14px 30px', borderRadius: 30, background: COULEURS.rouge, color: COULEURS.blanc,
          fontFamily: POLICES.titre, fontWeight: 900, fontSize: 46, letterSpacing: '0.06em'}}>{c.nom}</div>
        <div style={{position: 'absolute', right: 60, top: 70, fontFamily: POLICES.texte, fontWeight: 700, fontSize: 34, color: '#9a9aa2'}}>{i + 1} / {V.cartes.length}</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 180, height: 280, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          {c.icone === 'voiture' && <IconeVoiture f={f} />}
          {c.icone === 'confort' && <IconeConfort f={f} />}
          {c.icone === 'avion' && <IconeVol f={f} />}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 500, textAlign: 'center', transform: `scale(${prixPunch})`}}>
          {c.prefixe && <div style={{fontFamily: POLICES.titre, fontWeight: 800, fontSize: 58, color: '#6b6b72', marginBottom: -10}}>{c.prefixe}</div>}
          <div style={{fontFamily: POLICES.titre, fontWeight: 900, fontSize: 230, lineHeight: 1, letterSpacing: '-0.05em', color: '#0b0b0b', fontVariantNumeric: 'tabular-nums'}}>{milliers(montant)}</div>
          <div style={{fontFamily: POLICES.titre, fontWeight: 900, fontSize: 76, color: COULEURS.rouge, marginTop: 6}}>{c.unite}</div>
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, bottom: 60, textAlign: 'center', fontFamily: POLICES.texte, fontWeight: 700, fontSize: 42, color: '#55555c'}}>{c.detail}</div>
      </div>
      {c.interruption === 'balayage' && (
        <div style={{position: 'absolute', top: -200, height: 2320, width: 260, left: 410 + bande, background: COULEURS.rougeNeon, transform: 'skewX(-18deg)', boxShadow: `0 0 80px ${COULEURS.rouge}`}} />
      )}
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
      <Son nom="impact" a={0} volume={V.sons.carte} />
      {c.interruption === 'balayage' && <Son nom="whooshCourt" a={0} volume={V.sons.balayage} />}
      {c.interruption === 'compteur' && Array.from({length: 9}, (_, k) => <Son key={k} nom="tic" a={6 + k * 4} volume={V.sons.compteur} />)}
      {c.interruption === 'compteur' && <Son nom="prix" a={42} volume={V.sons.fin} />}
    </AbsoluteFill>
  );
};

// ── Récap à enregistrer ──
const Recap: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fond teinte="#2a0a0c" />
      <div style={{position: 'absolute', left: 90, right: 90, top: 400, textAlign: 'center', fontFamily: POLICES.titre, fontWeight: 900, fontSize: 110, letterSpacing: '-0.03em', color: COULEURS.blanc,
        opacity: interpolate(f, [0, 6], [0, 1], clampOpts)}}>
        {V.recap}
        <div style={{width: interpolate(f, [4, 16], [0, 220], clampOpts), height: 10, borderRadius: 5, background: COULEURS.rouge, margin: '18px auto 0'}} />
      </div>
      {V.cartes.map((c, i) => {
        const p = spring({frame: f - 8 - i * 7, fps, config: {damping: 15, stiffness: 150}});
        return (
          <div key={c.nom} style={{position: 'absolute', left: 90, right: 90, top: 640 + i * 200, height: 160, borderRadius: 40, background: COULEURS.blanc,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 46px', boxSizing: 'border-box',
            opacity: p, transform: `translateX(${(1 - p) * 300}px)`}}>
            <span style={{fontFamily: POLICES.titre, fontWeight: 900, fontSize: 46, color: COULEURS.rouge, letterSpacing: '0.04em'}}>{c.nom}</span>
            <span style={{fontFamily: POLICES.titre, fontWeight: 900, fontSize: 58, color: '#0b0b0b', whiteSpace: 'nowrap'}}>
              {c.prefixe && <span style={{fontSize: 36, color: '#6b6b72', fontWeight: 800}}>{c.prefixe} </span>}{milliers(c.montant)} <span style={{fontSize: 34, color: '#6b6b72'}}>{c.unite}</span>
            </span>
          </div>
        );
      })}
      {V.cartes.map((c, i) => <Son key={c.nom} nom="pop" a={8 + i * 7} volume={V.sons.fin} />)}
    </AbsoluteFill>
  );
};

// ── Fin : enregistrez + WhatsApp ──
const Fin: React.FC = () => {
  const f = useCurrentFrame();
  const tape = spring({frame: f - 8, fps, config: {damping: 9, stiffness: 180}});
  const plein = interpolate(f, [10, 14], [0, 1], clampOpts);
  const contact = spring({frame: f - 16, fps, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <Fond teinte="#1f1f25" />
      <svg width={200} height={240} viewBox="0 0 50 60" style={{position: 'absolute', left: 440, top: 380, transform: `scale(${0.8 + 0.2 * tape})`}}>
        <path d="M8 4h34a3 3 0 0 1 3 3v49l-20-13-20 13V7a3 3 0 0 1 3-3z" fill={plein ? COULEURS.rouge : 'none'} stroke={COULEURS.blanc} strokeWidth={4} strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', left: 80, right: 80, top: 690, textAlign: 'center', fontFamily: POLICES.titre, fontWeight: 900, color: COULEURS.blanc,
        opacity: interpolate(f, [0, 6], [0, 1], clampOpts), transform: `translateY(${interpolate(f, [0, 8], [30, 0], clampOpts)}px)`}}>
        <div style={{fontSize: 86, letterSpacing: '-0.03em', lineHeight: 1.08, textWrap: 'balance'} as React.CSSProperties}>{V.enregistrez[0]}</div>
        <div style={{fontSize: 64, color: '#d8d8de', marginTop: 10}}>{V.enregistrez[1]}</div>
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 1060, height: 140, borderRadius: 70, background: COULEURS.blanc, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22,
        opacity: contact, transform: `translateY(${(1 - contact) * 60}px)`, fontFamily: POLICES.titre, fontWeight: 900, fontSize: 54, color: '#0b0b0b'}}>
        <WhatsAppIcon taille={84} />{CONTACT.indicatif} {CONTACT.numero.join(' ')}
      </div>
      <Son nom="pop" a={8} volume={V.sons.fin} />
    </AbsoluteFill>
  );
};

export const VideoTarifs: React.FC = () => {
  const {temps} = V;
  const bloc = (debut: number, fin: number, C: React.FC) => (
    <Sequence from={s(debut)} durationInFrames={s(fin) - s(debut)}><C /></Sequence>
  );
  const cartes = temps.cartes.map((debut, i) => {
    const C: React.FC = () => <Carte i={i} />;
    return <Sequence key={i} from={s(debut)} durationInFrames={s(temps.cartes[i + 1] ?? temps.recap) - s(debut)}><C /></Sequence>;
  });
  return (
    <AbsoluteFill style={{background: COULEURS.noir}}>
      {bloc(temps.hook, temps.cartes[0], Hook)}
      {cartes}
      {bloc(temps.recap, temps.fin, Recap)}
      {bloc(temps.fin, temps.retour, Fin)}
      {bloc(temps.retour, V.dureeS, Hook)}
      <Finition />
    </AbsoluteFill>
  );
};
