// VideoQuiz — « Vol à 6 h. Vous faites quoi ? » (21,3 s, 1080×1920, 30 i/s, calée sur la voix off).
// Réveil qui sonne à 4:30, trois cartes A/B/C façon quiz, suspense (A et B barrées, C s'illumine),
// avion + voiture premium + prix du transfert, « Commentez A, B ou C » + WhatsApp, puis retour
// au réveil pour la boucle. Rouge en accent seulement. Textes et repères : VIDEO_QUIZ dans config.ts.
import {AbsoluteFill, Audio, Easing, interpolate, Loop, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {CONTACT, COULEURS, POLICES, VIDEO_QUIZ} from '../config';
import {Finition} from '../components/Effets';
import {IconeAvion, IconeCoche} from '../components/Icones';
import {WhatsAppIcon} from '../components/WhatsAppIcon';
import {Son} from '../components/Son';
import {Voiture} from '../video15/Video15';

const V = VIDEO_QUIZ;
const T = V.temps;
const fps = 30;
const s = (sec: number) => Math.round(sec * fps);
const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const apparition = (f: number, debut: number, duree = 8) => interpolate(f, [debut, debut + duree], [0, 1], {...clampOpts, easing: Easing.out(Easing.cubic)});

const Nuit: React.FC<{teinte?: string}> = ({teinte = '#121a33'}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 95% 60% at 50% 40%, ${teinte} 0%, ${COULEURS.noir} 80%)`}} />
);

// ── Réveil : 4:30 qui sonne, puis la question ──
const Reveil: React.FC<{avecSon?: boolean}> = ({avecSon = true}) => {
  const f = useCurrentFrame();
  // Le réveil tremble par salves (comme une sonnerie) dès la première image.
  const salve = Math.floor(f / 14) % 2 === 0 && f < 70;
  const tremble = salve ? Math.sin(f * 2.6) * 7 : 0;
  const deuxPoints = Math.floor(f / 15) % 2 === 0 ? 1 : 0.25;
  const ligne = (texte: string, debut: number, taille: number, couleur: string) => {
    const p = spring({frame: f - debut, fps, config: {damping: 13, stiffness: 190}});
    return (
      <div style={{fontFamily: POLICES.titre, fontWeight: 900, fontSize: taille, lineHeight: 1.05, letterSpacing: '-0.035em', color: couleur,
        opacity: f >= debut ? 1 : 0, transform: `scale(${0.6 + 0.4 * p})`, textWrap: 'balance'} as React.CSSProperties}>{texte}</div>
    );
  };
  return (
    <AbsoluteFill>
      <Nuit />
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center'}}>
        <div style={{padding: '14px 34px', borderRadius: 40, border: `3px solid ${COULEURS.rouge}`, fontFamily: POLICES.titre, fontWeight: 900, fontSize: 36,
          letterSpacing: '0.12em', color: COULEURS.blanc}}>{V.badge}</div>
      </div>
      {/* Réveil numérique */}
      <div style={{position: 'absolute', left: 150, top: 520, width: 780, height: 400, transform: `rotate(${tremble * 0.4}deg) translateX(${tremble}px)`}}>
        {salve && [-1, 1].map((c) => (
          <svg key={c} width={120} height={240} viewBox="0 0 60 120" style={{position: 'absolute', top: 80, [c < 0 ? 'left' : 'right']: -130, transform: `scaleX(${c})`}}>
            {[0, 1, 2].map((k) => <path key={k} d={`M${48 - k * 16} ${30 - k * 6} Q${30 - k * 16} 60 ${48 - k * 16} ${90 + k * 6}`} fill="none" stroke={COULEURS.blanc} strokeWidth={6} strokeLinecap="round" opacity={0.85 - k * 0.25} />)}
          </svg>
        ))}
        <div style={{position: 'absolute', inset: 0, borderRadius: 80, background: 'linear-gradient(180deg, #232430, #0d0d12)', boxShadow: '0 50px 120px rgba(0,0,0,.7), inset 0 2px 0 rgba(255,255,255,.08)'}} />
        <div style={{position: 'absolute', left: 50, right: 50, top: 50, bottom: 70, borderRadius: 40, background: '#07070a', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: POLICES.titre, fontWeight: 900, fontSize: 250, letterSpacing: '-0.02em', color: COULEURS.rougeNeon, textShadow: `0 0 40px ${COULEURS.rouge}aa`, fontVariantNumeric: 'tabular-nums'}}>
          {V.heure.split(':')[0]}<span style={{opacity: deuxPoints, margin: '0 6px'}}>:</span>{V.heure.split(':')[1]}
        </div>
        <div style={{position: 'absolute', left: 120, bottom: -28, width: 90, height: 40, borderRadius: 12, background: '#16161c'}} />
        <div style={{position: 'absolute', right: 120, bottom: -28, width: 90, height: 40, borderRadius: 12, background: '#16161c'}} />
      </div>
      <div style={{position: 'absolute', left: 80, right: 80, top: 1040, textAlign: 'center'}}>
        {ligne(V.titre[0], s(T.vol - T.reveil), 150, COULEURS.blanc)}
        {ligne(V.titre[1], s(T.question - T.reveil), 96, COULEURS.blanc)}
      </div>
      {avecSon && <Son nom="reveil" a={1} volume={V.sons.reveil} />}
      {avecSon && <Son nom="impact" a={s(T.vol)} volume={0.35} />}
    </AbsoluteFill>
  );
};

// ── Quiz : cartes A, B, C puis suspense et bonne réponse ──
const Quiz: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = T.cartes[0];
  const rel = (sec: number) => s(sec - t0);
  const bonne = spring({frame: f - rel(T.bonne), fps, config: {damping: 11, stiffness: 160}});
  const suspense = interpolate(f, [rel(T.suspense), rel(T.bonne)], [0, 1], clampOpts);
  return (
    <AbsoluteFill>
      <Nuit teinte="#1a1a24" />
      <div style={{position: 'absolute', left: 90, right: 90, top: 300, textAlign: 'center', fontFamily: POLICES.titre, fontWeight: 800, fontSize: 58, color: '#d6d6dc',
        opacity: apparition(f, 0)}}>{V.rappel}</div>
      {V.cartes.map((c, i) => {
        const debut = rel(T.cartes[i]);
        const p = spring({frame: f - debut, fps, config: {damping: 14, stiffness: 170}});
        const estBonne = i === V.bonneReponse;
        const barre = estBonne ? 0 : interpolate(f, [rel(T.barres[i]), rel(T.barres[i]) + 6], [0, 1], {...clampOpts, easing: Easing.out(Easing.cubic)});
        const lumiere = estBonne ? bonne : 0;
        return (
          <div key={c.lettre} style={{position: 'absolute', left: 80, right: 80, top: 480 + i * 270, height: 230, opacity: f >= debut ? p * (1 - 0.55 * barre) : 0,
            transform: `translateX(${(1 - p) * 160}px) scale(${1 + 0.05 * lumiere})`}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: 44, background: lumiere > 0.05 ? COULEURS.blanc : '#18181f',
              border: `3px solid ${lumiere > 0.05 ? COULEURS.rougeNeon : 'rgba(255,255,255,.12)'}`,
              boxShadow: lumiere > 0.05 ? `0 0 ${80 * lumiere}px ${COULEURS.rouge}aa` : '0 30px 70px rgba(0,0,0,.5)'}} />
            <div style={{position: 'absolute', left: 36, top: 45, width: 140, height: 140, borderRadius: 70, background: lumiere > 0.05 ? COULEURS.rouge : COULEURS.blanc,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: POLICES.titre, fontWeight: 900, fontSize: 84,
              color: lumiere > 0.05 ? COULEURS.blanc : '#0b0b0b'}}>{c.lettre}</div>
            <div style={{position: 'absolute', left: 210, right: 40, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: POLICES.titre, fontWeight: 800,
              fontSize: 54, lineHeight: 1.12, color: lumiere > 0.05 ? '#0b0b0b' : COULEURS.blanc}}>{c.texte}</div>
            {!estBonne && (
              <div style={{position: 'absolute', left: 20, right: 20, top: 109, height: 12, borderRadius: 6, background: COULEURS.rougeNeon,
                transform: `scaleX(${barre}) rotate(-3deg)`, transformOrigin: 'left center', boxShadow: `0 0 24px ${COULEURS.rouge}`}} />
            )}
            {estBonne && (
              <div style={{position: 'absolute', right: 30, top: -40, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 26px', borderRadius: 30,
                background: COULEURS.rouge, fontFamily: POLICES.titre, fontWeight: 900, fontSize: 34, letterSpacing: '0.06em', color: COULEURS.blanc,
                opacity: bonne, transform: `scale(${0.5 + 0.5 * bonne})`}}>
                <IconeCoche taille={40} couleur={COULEURS.blanc} />{V.bonneLibelle}
              </div>
            )}
            <Son nom="tic" a={debut} volume={V.sons.tick} />
            <Son nom="pop" a={debut + 1} volume={V.sons.tick * 0.6} />
            {!estBonne && <Son nom="glitch" a={rel(T.barres[i])} volume={V.sons.barre} />}
          </div>
        );
      })}
      {/* Suspense : jauge qui se remplit pendant le silence */}
      <div style={{position: 'absolute', left: 160, right: 160, top: 1320, height: 14, borderRadius: 7, background: 'rgba(255,255,255,.12)',
        opacity: f >= rel(T.suspense) && f < rel(T.bonne) + 12 ? 1 : 0}}>
        <div style={{width: `${suspense * 100}%`, height: '100%', borderRadius: 7, background: COULEURS.blanc}} />
      </div>
      {Array.from({length: 4}, (_, k) => <Son key={k} nom="tic" a={rel(T.suspense) + k * 9} volume={V.sons.tick * 0.7} />)}
      <Son nom="scintillement" a={rel(T.bonne)} volume={V.sons.bonne} />
      <Son nom="impact" a={rel(T.bonne)} volume={V.sons.bonne * 0.8} />
    </AbsoluteFill>
  );
};

// ── Transfert : avion qui décolle, voiture premium qui arrive, prix ──
const Transfert: React.FC = () => {
  const f = useCurrentFrame();
  const vol = interpolate(f, [0, 75], [0, 1], {...clampOpts, easing: Easing.inOut(Easing.quad)});
  const xVoiture = interpolate(f, [6, 40], [-760, 220], {...clampOpts, easing: Easing.out(Easing.cubic)});
  const prix = spring({frame: f - s(T.prix - T.transfert), fps, config: {damping: 10, stiffness: 180}});
  return (
    <AbsoluteFill>
      <Nuit teinte="#14204a" />
      <div style={{position: 'absolute', left: 80, right: 80, top: 300, textAlign: 'center', fontFamily: POLICES.titre, fontWeight: 900, letterSpacing: '-0.035em', color: COULEURS.blanc}}>
        {V.transfert.map((m, i) => (
          <div key={m} style={{fontSize: 118, lineHeight: 1.02, opacity: apparition(f, i * 4, 6), transform: `translateY(${(1 - apparition(f, i * 4, 8)) * 40}px)`}}>{m}</div>
        ))}
      </div>
      {/* Avion : traînée pointillée, décollage vers le haut à droite */}
      <svg width={1080} height={500} style={{position: 'absolute', left: 0, top: 560}}>
        <path d="M-40 420 Q520 380 1120 40" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={6} strokeDasharray="16 18"
          strokeDashoffset={-f * 3} style={{clipPath: `inset(0 ${100 - vol * 100}% 0 0)`}} />
      </svg>
      <div style={{position: 'absolute', left: -40 + vol * 1160 - 90, top: 560 + 420 - 400 * Math.pow(vol, 1.6) - 90, transform: `rotate(${80 - 35 * vol}deg)`}}>
        <IconeAvion taille={180} couleur={COULEURS.blanc} />
      </div>
      {/* Route et voiture */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1130, height: 6, background: '#2b2c35'}} />
      {Array.from({length: 8}, (_, k) => (
        <div key={k} style={{position: 'absolute', top: 1150, left: ((k * 150 - f * 6) % 1200 + 1200) % 1200 - 60, width: 70, height: 8, borderRadius: 4, background: '#3d3e48'}} />
      ))}
      <div style={{position: 'absolute', left: xVoiture, top: 900}}><Voiture largeur={640} /></div>
      {/* Prix */}
      <div style={{position: 'absolute', left: 140, right: 140, top: 1210, height: 230, borderRadius: 50, background: COULEURS.blanc, display: 'flex', alignItems: 'baseline',
        justifyContent: 'center', gap: 18, paddingTop: 58, boxSizing: 'border-box', opacity: prix, transform: `scale(${0.6 + 0.4 * prix})`, boxShadow: '0 40px 100px rgba(0,0,0,.6)'}}>
        <span style={{fontFamily: POLICES.titre, fontWeight: 800, fontSize: 52, color: '#6b6b72'}}>{V.prix.prefixe}</span>
        <span style={{fontFamily: POLICES.titre, fontWeight: 900, fontSize: 140, lineHeight: 1, letterSpacing: '-0.05em', color: '#0b0b0b'}}>{V.prix.montant}</span>
        <span style={{fontFamily: POLICES.titre, fontWeight: 900, fontSize: 56, color: COULEURS.rouge}}>{V.prix.unite}</span>
      </div>
      <Son nom="whoosh" a={2} volume={V.sons.avion} />
      <Son nom="prix" a={s(T.prix - T.transfert)} volume={V.sons.prix} />
    </AbsoluteFill>
  );
};

// ── Commentez A, B ou C + WhatsApp ──
const Commentez: React.FC = () => {
  const f = useCurrentFrame();
  const bulle = spring({frame: f, fps, config: {damping: 10, stiffness: 170}});
  const contact = spring({frame: f - 14, fps, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <Nuit teinte="#2a0a0c" />
      <svg width={200} height={180} viewBox="0 0 60 54" style={{position: 'absolute', left: 440, top: 330, transform: `scale(${bulle})`}}>
        <path d="M10 4h40a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6H26l-12 10v-10h-4a6 6 0 0 1-6-6V10a6 6 0 0 1 6-6z" fill={COULEURS.rouge} />
        {[20, 30, 40].map((x, k) => <circle key={x} cx={x} cy={22} r={3.4} fill={COULEURS.blanc} opacity={0.4 + 0.6 * (Math.floor(f / 6) % 3 === k ? 1 : 0)} />)}
      </svg>
      <div style={{position: 'absolute', left: 80, right: 80, top: 580, textAlign: 'center', fontFamily: POLICES.titre, fontWeight: 900, fontSize: 120, letterSpacing: '-0.035em',
        color: COULEURS.blanc, opacity: apparition(f, 2)}}>{V.commentez[0]}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center', gap: 40}}>
        {V.cartes.map((c, i) => {
          const p = spring({frame: f - 6 - i * 4, fps, config: {damping: 11, stiffness: 190}});
          return (
            <div key={c.lettre} style={{width: 170, height: 170, borderRadius: 85, background: i === V.bonneReponse ? COULEURS.rouge : COULEURS.blanc,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: POLICES.titre, fontWeight: 900, fontSize: 100,
              color: i === V.bonneReponse ? COULEURS.blanc : '#0b0b0b', transform: `scale(${p})`}}>{c.lettre}</div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 1090, height: 140, borderRadius: 70, background: COULEURS.blanc, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22,
        opacity: contact, transform: `translateY(${(1 - contact) * 60}px)`, fontFamily: POLICES.titre, fontWeight: 900, fontSize: 54, color: '#0b0b0b'}}>
        <WhatsAppIcon taille={84} />{CONTACT.indicatif} {CONTACT.numero.join(' ')}
      </div>
      {[0, 1, 2].map((i) => <Son key={i} nom="pop" a={6 + i * 4} volume={V.sons.fin} />)}
      <Son nom="notif" a={14} volume={V.sons.fin} />
    </AbsoluteFill>
  );
};

export const VideoQuiz: React.FC = () => {
  const bloc = (debut: number, fin: number, contenu: React.ReactNode) => (
    <Sequence from={s(debut)} durationInFrames={s(fin) - s(debut)}>{contenu}</Sequence>
  );
  const groove = (debut: number, fin: number) => (
    <Sequence from={s(debut)} durationInFrames={s(fin) - s(debut)}>
      <Loop durationInFrames={s(V.musique.boucleS)}>
        <Audio src={staticFile(V.musique.fichier)} volume={V.musique.volume} />
      </Loop>
    </Sequence>
  );
  return (
    <AbsoluteFill style={{background: COULEURS.noir}}>
      {bloc(T.reveil, T.cartes[0], <Reveil />)}
      {bloc(T.cartes[0], T.transfert, <Quiz />)}
      {bloc(T.transfert, T.commentez, <Transfert />)}
      {bloc(T.commentez, T.boucle, <Commentez />)}
      {bloc(T.boucle, V.dureeS, <Reveil avecSon={false} />)}
      <Finition />
      <Audio src={staticFile(V.voix)} />
      {/* Musique : coupée pendant le réveil et pendant le suspense */}
      {groove(T.cartes[0], T.suspense)}
      {groove(T.bonne, T.boucle)}
    </AbsoluteFill>
  );
};
