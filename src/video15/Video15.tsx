// Video15 — pub courte « Service aéroport » (15 s, 1080×1920, 30 i/s).
// Réutilise le design system : COULEURS / POLICES / MARQUE / CONTACT, LogoComplet, MotAnime,
// RouteNeon, Trainees, Finition, WhatsAppIcon, IconeAvion, Son. Rouge du logo en accent seulement,
// silhouettes plates sans visage. Textes et durées : VIDEO15 dans config.ts.
import {AbsoluteFill, interpolate, Easing, Sequence, spring, useCurrentFrame} from 'remotion';
import {CONTACT, COULEURS, MARQUE, POLICES, VIDEO15} from '../config';
import {Finition, RouteNeon, Trainees} from '../components/Effets';
import {LogoComplet} from '../components/Logo';
import {MotAnime} from '../components/KineticText';
import {WhatsAppIcon} from '../components/WhatsAppIcon';
import {IconeAvion} from '../components/Icones';
import {Son} from '../components/Son';

const T = VIDEO15.textes;
const fps = 30;
const s = (sec: number) => Math.round(sec * fps);
const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Apparition / disparition douce d'un bloc (images relatives à la séquence).
export const fondu = (f: number, entree: number, sortie: number, d = 8) =>
  interpolate(f, [entree, entree + d, sortie - d, sortie], [0, 1, 1, 0], clampOpts);

export const Fond: React.FC<{teinte?: string}> = ({teinte = '#1a0a0a'}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 60% at 50% 40%, ${teinte} 0%, ${COULEURS.noir} 70%)`}} />
);

// Texte d'accompagnement, toujours dans la zone sûre.
export const Legende: React.FC<{texte: string; f: number; entree: number; sortie: number; top: number; taille?: number}> = ({texte, f, entree, sortie, top, taille = 84}) => {
  const o = fondu(f, entree, sortie, 10);
  const y = interpolate(f, [entree, entree + 14], [30, 0], {...clampOpts, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: 90, right: 90, top, textAlign: 'center', opacity: o, transform: `translateY(${y}px)`,
      fontFamily: POLICES.titre, fontWeight: 800, fontSize: taille, color: COULEURS.blanc, letterSpacing: '-0.02em', whiteSpace: 'pre-line', textShadow: '0 6px 30px rgba(0,0,0,.6)'}}>
      {texte}
    </div>
  );
};

// ── 0–3 s : le réveil 04:30 vibre ──
const Reveil: React.FC = () => {
  const f = useCurrentFrame();
  const vibre = f % 30 < 18; // vibrations par salves
  const dx = vibre ? Math.sin(f * 2.6) * 9 : 0;
  const rot = vibre ? Math.sin(f * 2.1) * 1.4 : 0;
  const entree = spring({frame: f, fps, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <Fond />
      <div style={{position: 'absolute', left: 140, top: 560, width: 800, height: 520, borderRadius: 56, background: 'linear-gradient(160deg, #1b1b1f, #0b0b0d)',
        border: '1.5px solid rgba(255,255,255,.08)', boxShadow: '0 40px 120px rgba(0,0,0,.7)', transform: `translateX(${dx}px) rotate(${rot}deg) scale(${0.9 + 0.1 * entree})`, opacity: entree}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', fontFamily: POLICES.titre, fontWeight: 900, fontSize: 250, letterSpacing: '-0.03em', color: COULEURS.blanc}}>
          {T.heure}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 390, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16,
          fontFamily: POLICES.texte, fontWeight: 600, fontSize: 34, letterSpacing: '0.18em', color: COULEURS.gris}}>
          <span style={{width: 16, height: 16, borderRadius: 8, background: COULEURS.rougeNeon, opacity: 0.4 + 0.6 * (Math.sin(f * 0.5) > 0 ? 1 : 0), boxShadow: `0 0 18px ${COULEURS.rougeNeon}`}} />
          {T.alarme}
        </div>
      </div>
      {/* Arcs de vibration */}
      {[0, 1].map((k) => (
        <svg key={k} width={160} height={300} style={{position: 'absolute', top: 670, left: k ? 950 : -30, opacity: vibre ? 0.5 : 0, transform: k ? 'none' : 'scaleX(-1)'}}>
          {[0, 1, 2].map((i) => <path key={i} d={`M${20 + i * 34} 40 Q${70 + i * 34} 150 ${20 + i * 34} 260`} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={1 - i * 0.3} />)}
        </svg>
      ))}
      <Legende texte={T.vol} f={f} entree={12} sortie={s(3) + 6} top={1220} taille={96} />
      {[0, 30, 60].map((a) => <Son key={a} nom="bip" a={a} volume={VIDEO15.sons.alarme} />)}
    </AbsoluteFill>
  );
};

// Silhouettes plates : voiture (vue de côté) et chauffeur sans visage.
export const Voiture: React.FC<{largeur: number; phares?: boolean}> = ({largeur, phares = true}) => (
  <svg width={largeur} height={largeur * 0.36} viewBox="0 0 500 180">
    <path d="M30 120 L70 70 C90 48 120 40 160 40 L320 40 C350 40 372 50 392 70 L440 112 L478 120 C492 124 496 134 496 146 L496 150 L10 150 L10 134 C10 126 18 120 30 120Z" fill="#0f0f12" stroke="#2a2a30" strokeWidth={3} />
    <path d="M130 108 L162 60 L250 60 L250 108Z M262 60 L330 60 C344 60 356 66 366 76 L396 108 L262 108Z" fill="#23252b" />
    <circle cx={120} cy={152} r={30} fill="#050506" stroke="#33343a" strokeWidth={6} />
    <circle cx={396} cy={152} r={30} fill="#050506" stroke="#33343a" strokeWidth={6} />
    <rect x={12} y={122} width={18} height={10} rx={3} fill={COULEURS.rougeNeon} />
    {phares && <rect x={476} y={124} width={18} height={9} rx={3} fill="#fff4d6" />}
  </svg>
);
const Chauffeur: React.FC<{hauteur: number}> = ({hauteur}) => (
  <svg width={hauteur * 0.4} height={hauteur} viewBox="0 0 80 200">
    <circle cx={40} cy={22} r={17} fill="#16161a" />
    <path d="M14 58 C14 46 26 42 40 42 C54 42 66 46 66 58 L70 128 L56 128 L54 196 L44 196 L40 136 L36 196 L26 196 L24 128 L10 128Z" fill="#16161a" />
  </svg>
);

// ── 3–6 s : la notification, la voiture arrive sur la route lumineuse ──
const Arrivee: React.FC = () => {
  const f = useCurrentFrame();
  const glisse = spring({frame: f - 4, fps, config: {damping: 15, stiffness: 120}});
  const xVoiture = interpolate(f, [24, 66], [-700, 290], {...clampOpts, easing: Easing.out(Easing.cubic)});
  const chauffeur = interpolate(f, [62, 76], [0, 1], clampOpts);
  return (
    <AbsoluteFill>
      <Fond teinte="#140808" />
      <RouteNeon opacite={0.55} vitesse={interpolate(f, [24, 66], [1.6, 0.2], clampOpts)} horizon={1180} />
      <div style={{position: 'absolute', left: xVoiture, top: 1180}}><Voiture largeur={500} /></div>
      <div style={{position: 'absolute', left: 800, top: 1135, opacity: chauffeur}}><Chauffeur hauteur={210} /></div>
      {/* Notification */}
      <div style={{position: 'absolute', left: 90, right: 90, top: 330, height: 190, borderRadius: 40, background: 'rgba(28,28,32,.88)', border: '1px solid rgba(255,255,255,.1)',
        boxShadow: '0 30px 80px rgba(0,0,0,.6)', transform: `translateY(${(1 - glisse) * -320}px)`, display: 'flex', alignItems: 'center', gap: 28, padding: '0 36px', boxSizing: 'border-box'}}>
        <div style={{width: 104, height: 104, borderRadius: 26, background: COULEURS.noir, border: '1px solid rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flex: 'none'}}>
          <LogoComplet largeur={240} style={{transform: 'translateX(68px)'}} />
        </div>
        <div style={{flex: 1}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: POLICES.texte, fontWeight: 600, fontSize: 30, color: COULEURS.gris}}>
            <span>{T.appli}</span><span>{T.maintenant}</span>
          </div>
          <div style={{fontFamily: POLICES.texte, fontWeight: 700, fontSize: 46, color: COULEURS.blanc, marginTop: 8}}>{T.notification}</div>
        </div>
      </div>
      <Son nom="notif" a={6} volume={VIDEO15.sons.notif} />
      <Son nom="whooshCourt" a={26} volume={VIDEO15.sons.passage} />
    </AbsoluteFill>
  );
};

// Silhouette de Douala la nuit (immeubles plats, quelques fenêtres chaudes).
const Ville: React.FC<{f: number}> = ({f}) => {
  const immeubles = Array.from({length: 16}, (_, i) => ({x: i * 72 - 40, w: 60 + ((i * 37) % 40), h: 180 + ((i * 97) % 320)}));
  const dec = -(f * 1.2) % 72;
  return (
    <svg width={1080} height={700} style={{position: 'absolute', left: 0, top: 640}}>
      <g transform={`translate(${dec} 0)`}>
        {immeubles.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={600 - b.h} width={b.w} height={b.h} fill="#0d0d11" />
            {Array.from({length: Math.floor(b.h / 46)}, (_, k) => ((i * 7 + k * 3) % 5 === 0 ? <rect key={k} x={b.x + 12 + (k % 2) * 22} y={620 - b.h + k * 46} width={12} height={16} fill="#ffd9a0" opacity={0.55} /> : null))}
          </g>
        ))}
      </g>
      <rect x={0} y={600} width={1080} height={100} fill="#08080a" />
    </svg>
  );
};

// ── 6–11 s : la voiture file de nuit sur Douala, un avion traverse ──
const Route: React.FC = () => {
  const f = useCurrentFrame();
  const avion = interpolate(f, [12, 96], [-260, 1180], clampOpts);
  const prixO = fondu(f, 66, s(5) + 6, 10);
  return (
    <AbsoluteFill>
      <Fond teinte="#100606" />
      <Trainees nombre={18} vitesse={1.4} opacite={0.75} graine="video15" angle={-14} />
      <div style={{position: 'absolute', left: avion, top: 360 - (avion + 260) * 0.08, transform: 'rotate(90deg)', opacity: 0.85}}><IconeAvion taille={140} /></div>
      <Ville f={f} />
      <div style={{position: 'absolute', left: 290, top: 1180 + Math.sin(f * 0.5) * 2}}><Voiture largeur={500} /></div>
      <div style={{position: 'absolute', left: 0, top: 1310, width: 1080, height: 6, background: `linear-gradient(90deg, transparent, ${COULEURS.rouge}aa, transparent)`, boxShadow: `0 0 30px ${COULEURS.rougeNeon}`}} />
      <Legende texte={T.service} f={f} entree={6} sortie={70} top={1430} taille={80} />
      <div style={{position: 'absolute', left: 90, right: 90, top: 1410, opacity: prixO, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        {T.prix.map((p) => (
          <div key={p.nom} style={{display: 'flex', gap: 22, alignItems: 'baseline', fontFamily: POLICES.titre}}>
            <span style={{fontWeight: 600, fontSize: 52, color: COULEURS.gris}}>{p.nom}</span>
            <span style={{fontWeight: 900, fontSize: 70, color: COULEURS.blanc}}>{p.montant}</span>
          </div>
        ))}
      </div>
      <Son nom="whoosh" a={14} volume={VIDEO15.sons.passage} />
    </AbsoluteFill>
  );
};

// ── 11–15 s : logo, slogan, WhatsApp et numéro ──
// Réutilisée par Video20 (sortie = fin du fondu, en images).
export const Fin: React.FC<{sortie?: number; reservez?: string}> = ({sortie = s(4) + 30, reservez = T.reservez}) => {
  const f = useCurrentFrame();
  const logo = spring({frame: f, fps, config: {damping: 14}});
  const contact = fondu(f, 54, sortie, 10);
  return (
    <AbsoluteFill>
      <Fond teinte="#1c0707" />
      <div style={{position: 'absolute', left: 130, top: 560, opacity: logo, transform: `scale(${0.85 + 0.15 * logo})`}}><LogoComplet largeur={820} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center', gap: 26}}>
        {MARQUE.slogan.map((m, i) => <MotAnime key={m} texte={m} a={12 + i * 10} entree="monte" taille={70} />)}
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 1120, opacity: contact, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, fontFamily: POLICES.texte, fontWeight: 700, fontSize: 52, color: COULEURS.blanc}}>
          <WhatsAppIcon taille={72} />{reservez}
        </div>
        <div style={{fontFamily: POLICES.titre, fontWeight: 900, fontSize: 78, letterSpacing: '0.02em', color: COULEURS.blanc}}>
          {CONTACT.indicatif} {CONTACT.numero.join(' ')}
        </div>
      </div>
      <Son nom="pop" a={2} volume={VIDEO15.sons.logo} />
    </AbsoluteFill>
  );
};

export const Video15: React.FC = () => {
  const {scenes} = VIDEO15;
  const bloc = (debut: number, fin: number, C: React.FC) => (
    <Sequence from={s(debut)} durationInFrames={s(fin - debut)}><C /></Sequence>
  );
  return (
    <AbsoluteFill style={{background: COULEURS.noir}}>
      {bloc(scenes.reveil, scenes.notif, Reveil)}
      {bloc(scenes.notif, scenes.route, Arrivee)}
      {bloc(scenes.route, scenes.fin, Route)}
      {bloc(scenes.fin, VIDEO15.dureeS, Fin)}
      <Finition />
    </AbsoluteFill>
  );
};
