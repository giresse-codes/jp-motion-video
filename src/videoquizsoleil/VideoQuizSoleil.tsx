// VideoQuizSoleil — quiz « Vol à 6 h. Vous faites quoi ? » version « matin doré à Douala »
// (20 s, 1080×1920, 30 i/s, calée sur public/audio/quiz-soleil-voix.mp3).
// Chambre pêche + réveil cartoon, cartes A/B/C illustrées sur ciel bleu, roulement + confettis,
// lever de soleil avec berline et avion, « Commentez » sur crème, puis retour au réveil (boucle).
// Fonds clairs uniquement, rouge en petits détails. Textes, couleurs, repères : VIDEO_QUIZ_SOLEIL.
import {AbsoluteFill, Audio, Easing, interpolate, Loop, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {CONTACT, COULEURS, VIDEO_QUIZ_SOLEIL} from '../config';
import {WhatsAppIcon} from '../components/WhatsAppIcon';
import {Son} from '../components/Son';
import {Avion, Berline, Confettis, Etincelles, Nuage, Perso, Reveil} from './Illustrations';

const V = VIDEO_QUIZ_SOLEIL;
const P = V.palette;
const T = V.temps;
const fps = 30;
const s = (sec: number) => Math.round(sec * fps);
const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const POLICE = 'Fredoka';
const ressort = (f: number, debut: number, damping = 10, stiffness = 170) => spring({frame: f - debut, fps, config: {damping, stiffness}});

// Mots qui rebondissent un par un (le mot clé change de couleur à son arrivée).
const MotsRebond: React.FC<{f: number; mots: string[]; debut: number; taille: number; cle?: number; couleurCle?: string; ecart?: number}> = ({
  f, mots, debut, taille, cle = -1, couleurCle = P.corail, ecart = 4,
}) => (
  <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: `0 ${taille * 0.34}px`}}>
    {mots.map((m, i) => {
      const d = debut + i * ecart;
      const p = ressort(f, d, 8, 200);
      const estCle = i === cle;
      return (
        <span key={i} style={{display: 'inline-block', fontFamily: POLICE, fontWeight: 700, fontSize: taille, lineHeight: 1.08, color: estCle ? couleurCle : P.encre,
          opacity: f >= d ? 1 : 0, transform: `translateY(${(1 - p) * 60}px) scale(${0.4 + 0.6 * p}) rotate(${(1 - p) * (i % 2 ? 8 : -8)}deg)`,
          textShadow: '0 6px 0 rgba(255,255,255,.6)', whiteSpace: 'nowrap'}}>{m}</span>
      );
    })}
  </div>
);

// ── Scène 1 : chambre pêche, réveil qui saute, client qui se redresse ──
// `boucle` : dernière image de la vidéo, le client reste allongé pour raccorder avec la première.
const Chambre: React.FC<{avecSon?: boolean; boucle?: boolean}> = ({avecSon = true, boucle = false}) => {
  const f = useCurrentFrame();
  // Réveil : sauts de 10 images, squash à l'atterrissage, stretch en l'air.
  const phase = (f % 10) / 10;
  const saut = Math.sin(phase * Math.PI);
  const ecrase = Math.max(0, 1 - phase * 5) + Math.max(0, phase * 5 - 4);
  const reveilY = -saut * 70;
  const sx = 1 + 0.16 * ecrase - 0.06 * saut, sy = 1 - 0.18 * ecrase + 0.1 * saut;
  const allume = Math.floor(f / 7) % 2 === 0;
  // Client : allongé puis assis d'un bond (image 8), surpris.
  const leve = boucle ? 0 : ressort(f, 8, 8, 160);
  const camera = interpolate(f, [0, s(T.cartes[0])], [1, 1.06], clampOpts);
  const exclamation = boucle ? 0 : ressort(f, 14, 7, 220);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${P.pecheClair} 0%, #FFCBA6 70%, ${P.peche} 100%)`, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${camera})`, transformOrigin: '50% 60%'}}>
        {/* Fenêtre et rayons de soleil */}
        <div style={{position: 'absolute', left: 90, top: 640, width: 300, height: 300, borderRadius: 30, background: `linear-gradient(180deg, ${P.dore}, #FFE9A8)`, border: '14px solid #fff'}}>
          <div style={{position: 'absolute', left: 129, top: 0, bottom: 0, width: 14, background: '#fff'}} />
          <div style={{position: 'absolute', top: 129, left: 0, right: 0, height: 14, background: '#fff'}} />
          <div style={{position: 'absolute', left: 170, top: 40, width: 80, height: 80, borderRadius: 40, background: '#FFF6D6'}} />
        </div>
        <div style={{position: 'absolute', left: 260, top: 640, width: 700, height: 900, background: 'linear-gradient(115deg, rgba(255,250,230,.55), rgba(255,250,230,0) 70%)',
          clipPath: 'polygon(0 0, 22% 0, 100% 100%, 40% 100%)', opacity: 0.7 + 0.15 * Math.sin(f * 0.08)}} />
        {/* Sol */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1300, bottom: 0, background: P.sable}} />
        {/* Lit */}
        <div style={{position: 'absolute', left: 40, top: 1080, width: 620, height: 200, borderRadius: 40, background: P.creme}} />
        <div style={{position: 'absolute', left: 40, top: 1000, width: 40, height: 300, borderRadius: 20, background: '#C98B5E'}} />
        <div style={{position: 'absolute', left: 90, top: 1030, width: 190, height: 80, borderRadius: 40, background: '#fff'}} />
        {/* Client : pivote autour des hanches */}
        <div style={{position: 'absolute', left: 150, top: 830, transformOrigin: '100px 280px', transform: `rotate(${-78 * (1 - leve)}deg)`}}>
          <Perso expression={leve > 0.5 ? 'surpris' : 'detendu'} haut={P.turquoise} brasG={20 + 140 * leve} brasD={20 + 140 * leve} tete={Math.sin(f * 0.5) * 3 * leve} />
        </div>
        <div style={{position: 'absolute', left: 80, top: 1140, width: 600, height: 150, borderRadius: 40, background: P.menthe}} />
        <div style={{position: 'absolute', left: 360, top: 770, fontFamily: POLICE, fontWeight: 700, fontSize: 130, color: P.corail, transform: `scale(${exclamation}) rotate(12deg)`}}>!</div>
        {/* Table et réveil */}
        <div style={{position: 'absolute', left: 700, top: 1110, width: 320, height: 34, borderRadius: 17, background: '#C98B5E'}} />
        <div style={{position: 'absolute', left: 740, top: 1144, width: 26, height: 170, background: '#B07850'}} />
        <div style={{position: 'absolute', left: 954, top: 1144, width: 26, height: 170, background: '#B07850'}} />
        <div style={{position: 'absolute', left: 730, top: 830, transformOrigin: '130px 280px', transform: `translateY(${reveilY}px) scale(${sx}, ${sy}) rotate(${Math.sin(f * 1.3) * 6}deg)`}}>
          <Reveil heure={V.heure} allume={allume} />
        </div>
        {[-1, 1].map((c) => (
          <svg key={c} width={90} height={160} viewBox="0 0 45 80" style={{position: 'absolute', top: 880 + reveilY, left: c < 0 ? 640 : 1000, transform: `scaleX(${c})`, opacity: saut > 0.3 ? 1 : 0.3}}>
            {[0, 1].map((k) => <path key={k} d={`M${36 - k * 14} ${16 - k * 6} Q${20 - k * 14} 40 ${36 - k * 14} ${64 + k * 6}`} fill="none" stroke={P.encre} strokeWidth={5} strokeLinecap="round" />)}
          </svg>
        ))}
        <Etincelles f={f} graine="chambre" couleur="#FFF6D6" zone={[200, 650, 800, 650]} />
      </AbsoluteFill>
      {/* Titre */}
      <div style={{position: 'absolute', left: 60, right: 60, top: 280}}>
        <MotsRebond f={f} mots={V.titre[0]} debut={s(T.vol)} taille={150} cle={2} />
        <div style={{height: 10}} />
        <MotsRebond f={f} mots={V.titre[1]} debut={s(T.question)} taille={104} cle={2} couleurCle={P.turquoise} ecart={3} />
      </div>
      {avecSon && <Son nom="reveil" a={1} volume={V.sons.reveil} />}
      {avecSon && <Son nom="pop" a={8} volume={V.sons.pop} />}
      {avecSon && V.titre.flatMap((l, j) => l.map((_, i) => <Son key={`${j}${i}`} nom="tic" a={s(j ? T.question : T.vol) + i * (j ? 3 : 4)} volume={0.35} />))}
    </AbsoluteFill>
  );
};

// ── Mini illustrations des cartes ──
const IllusAmi: React.FC<{f: number}> = ({f}) => {
  const bouche = 0.5 + 0.5 * Math.sin(f * 0.18);
  return (
    <div style={{position: 'relative', width: 230, height: 220, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 30, top: 10}}>
        <Perso largeur={170} expression="baille" bouche={bouche} haut={P.corail} peau={P.peauClaire} tete={Math.sin(f * 0.35) * 16} brasG={15} brasD={15 + 20 * bouche} />
      </div>
      {[0, 1, 2].map((k) => {
        const t = ((f + k * 14) % 42) / 42;
        return <div key={k} style={{position: 'absolute', left: 170 + t * 30, top: 70 - t * 60, fontFamily: POLICE, fontWeight: 700, fontSize: 26 + k * 6, color: P.encre, opacity: 1 - t}}>z</div>;
      })}
    </div>
  );
};

const IllusTaxi: React.FC<{f: number}> = ({f}) => {
  const passe = ((f % 36) / 36) * 520 - 260;
  return (
    <div style={{position: 'relative', width: 230, height: 220, borderRadius: 34, overflow: 'hidden', background: '#2C3A73'}}>
      <div style={{position: 'absolute', right: 26, top: 22, width: 36, height: 36, borderRadius: 18, boxShadow: '-10px 6px 0 0 #FFF2B8'}} />
      {[[30, 30], [90, 50], [60, 90], [140, 24]].map(([x, y], i) => (
        <div key={i} style={{position: 'absolute', left: x, top: y, width: 6, height: 6, borderRadius: 3, background: '#fff', opacity: 0.4 + 0.6 * Math.abs(Math.sin(f * 0.2 + i))}} />
      ))}
      <div style={{position: 'absolute', left: 64, top: 70}}>
        <Perso largeur={110} expression="sourire" haut={P.jaune} brasD={150 + Math.sin(f * 0.5) * 18} brasG={10} />
      </div>
      <div style={{position: 'absolute', left: passe, top: 160}}><Berline f={f} largeur={170} client={false} phares /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 216, height: 4, background: '#5A6AA8'}} />
    </div>
  );
};

const IllusChauffeur: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'relative', width: 240, height: 220}}>
    <div style={{position: 'absolute', left: 0, top: 80 - Math.abs(Math.sin(f * 0.25)) * 12}}>
      <Berline f={0} largeur={230} client={false} phares={Math.floor(f / 6) % 2 === 0} />
    </div>
    {[0, 1, 2].map((k) => {
      const t = ((f + k * 12) % 36) / 36;
      return <div key={k} style={{position: 'absolute', left: 60 + k * 60, top: 60 - t * 50, width: 16, height: 16, borderRadius: 8, background: '#fff', opacity: 1 - t, transform: `scale(${0.5 + t})`}} />;
    })}
  </div>
);

// ── Scène 2 : ciel bleu, cartes A/B/C, suspense, bonne réponse ──
const Quiz: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = T.cartes[0];
  const rel = (sec: number) => s(sec - t0);
  const zoom = interpolate(f, [rel(T.suspense), rel(T.bonne)], [1, 1.1], {...clampOpts, easing: Easing.in(Easing.quad)})
    - interpolate(f, [rel(T.bonne), rel(T.bonne) + 20], [0, 0.07], clampOpts);
  const bonne = ressort(f, rel(T.bonne), 9, 150);
  const roulement = f >= rel(T.suspense) && f < rel(T.bonne) ? Math.sin(f * 2.4) * 4 : 0;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${P.ciel} 0%, ${P.cielClair} 100%)`, overflow: 'hidden'}}>
      {/* Nuages en parallaxe */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const vitesse = i % 2 ? 1.6 : 0.8;
        const x = ((i * 380 - f * vitesse) % 1500 + 1500) % 1500 - 300;
        return <div key={i} style={{position: 'absolute', left: x, top: 180 + ((i * 337) % 1300), opacity: i % 2 ? 0.95 : 0.6}}><Nuage largeur={i % 2 ? 260 : 180} /></div>;
      })}
      <AbsoluteFill style={{transform: `scale(${zoom}) translateX(${roulement}px)`, transformOrigin: '50% 55%'}}>
        <div style={{position: 'absolute', left: 60, right: 60, top: 270}}>
          <MotsRebond f={f} mots={V.rappel.split(' ')} debut={0} taille={62} ecart={2} cle={-1} />
        </div>
        {V.cartes.map((c, i) => {
          const debut = rel(T.cartes[i]);
          const chute = ressort(f, debut, 9, 140);
          const estBonne = i === V.bonneReponse;
          const sortie = estBonne ? 0 : ressort(f, rel(T.sorties[i]), 14, 120);
          const atterrit = interpolate(f - debut, [8, 12, 18], [0, 1, 0], clampOpts);
          const flotte = Math.sin((f + i * 20) * 0.08) * 6;
          const y = -1500 * (1 - chute) + flotte - (estBonne ? 300 * bonne : 0);
          const echelle = (1 - 0.45 * sortie) * (estBonne ? 1 + 0.12 * bonne : 1);
          const x = estBonne ? 0 : (i === 0 ? -1 : 1) * 1300 * sortie * sortie;
          return (
            <div key={c.lettre} style={{position: 'absolute', left: 60, right: 60, top: 420 + i * 300, height: 270, opacity: f >= debut ? 1 : 0,
              transform: `translate(${x}px, ${y}px) scale(${echelle * (1 + 0.06 * atterrit)}, ${echelle * (1 - 0.08 * atterrit)}) rotate(${(1 - chute) * (i % 2 ? 10 : -10) + sortie * (i ? 25 : -25)}deg)`}}>
              <div style={{position: 'absolute', inset: 0, borderRadius: 50, background: c.couleur, boxShadow: `0 ${18 + 20 * bonne * (estBonne ? 1 : 0)}px 0 rgba(43,45,66,.12), 0 30px 60px rgba(43,45,66,.18)`}} />
              <div style={{position: 'absolute', left: 30, top: 70, width: 130, height: 130, borderRadius: 65, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: POLICE, fontWeight: 700, fontSize: 84, color: P.encre}}>{c.lettre}</div>
              <div style={{position: 'absolute', left: 186, width: 400, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: POLICE, fontWeight: 700,
                fontSize: 50, lineHeight: 1.08, color: P.encre}}>{c.texte}</div>
              <div style={{position: 'absolute', right: 22, top: 22, width: 240, height: 226, borderRadius: 36, background: 'rgba(255,255,255,.45)', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {c.illustration === 'ami' && <IllusAmi f={f - debut} />}
                {c.illustration === 'taxi' && <IllusTaxi f={f - debut} />}
                {c.illustration === 'chauffeur' && <IllusChauffeur f={f - debut} />}
              </div>
              {estBonne && (
                <>
                  <div style={{position: 'absolute', left: 14, top: -50, width: 110, height: 110, borderRadius: 55, background: P.mentheFonce, border: '8px solid #fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${bonne}) rotate(${(1 - bonne) * -90}deg)`}}>
                    <svg width={60} height={60} viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div style={{position: 'absolute', left: 0, right: 0, top: 290, display: 'flex', justifyContent: 'center', opacity: bonne, transform: `translateY(${(1 - bonne) * 40}px)`}}>
                    <div style={{padding: '14px 36px 16px', borderRadius: 40, background: '#fff', fontFamily: POLICE, fontWeight: 700, fontSize: 46, color: P.encre, boxShadow: '0 16px 40px rgba(43,45,66,.15)'}}>
                      {V.bonneLibelle}
                      <div style={{height: 6, width: 120, margin: '4px auto 0', borderRadius: 3, background: COULEURS.rouge}} />
                    </div>
                  </div>
                </>
              )}
              <Son nom="pop" a={debut + 6} volume={V.sons.pop} />
              {!estBonne && <Son nom="whooshCourt" a={rel(T.sorties[i])} volume={V.sons.sortie} />}
            </div>
          );
        })}
      </AbsoluteFill>
      <Confettis f={f - rel(T.bonne)} cx={540} cy={860} />
      <Son nom="roulement" a={rel(T.suspense)} volume={V.sons.roulement} />
      <Son nom="pop" a={rel(T.bonne)} volume={V.sons.bonne} />
      <Son nom="scintillement" a={rel(T.bonne)} volume={V.sons.bonne} />
    </AbsoluteFill>
  );
};

// ── Scène 3 : lever de soleil, berline vers l'aéroport, avion qui décolle, prix ──
const Transfert: React.FC = () => {
  const f = useCurrentFrame();
  const soleil = interpolate(f, [0, 90], [140, 0], {...clampOpts, easing: Easing.out(Easing.cubic)});
  const xVoiture = interpolate(f, [0, 30], [-700, 160], {...clampOpts, easing: Easing.out(Easing.back(1.2))}) + Math.max(0, f - 30) * 1.2;
  const vol = interpolate(f, [12, 80], [0, 1], {...clampOpts, easing: Easing.in(Easing.quad)});
  const ax = 900 - vol * 1150, ay = 1120 - vol * 820;
  const prix = ressort(f, s(T.prix - T.transfert), 7, 200);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${P.peche} 0%, #FFC48A 45%, ${P.dore} 100%)`, overflow: 'hidden'}}>
      {/* Soleil et rayons */}
      <div style={{position: 'absolute', left: 540 - 500, top: 1180 - 500 + soleil, width: 1000, height: 1000, transform: `rotate(${f * 0.4}deg)`,
        background: 'repeating-conic-gradient(rgba(255,255,255,.18) 0deg 8deg, rgba(255,255,255,0) 8deg 22deg)', borderRadius: '50%'}} />
      <div style={{position: 'absolute', left: 540 - 170, top: 1180 - 170 + soleil, width: 340, height: 340, borderRadius: 170, background: '#FFF3C4', boxShadow: '0 0 120px 40px rgba(255,243,196,.7)'}} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: ((i * 420 - f * (0.6 + i * 0.3)) % 1400 + 1400) % 1400 - 260, top: 780 + i * 120, opacity: 0.8}}><Nuage largeur={200 + i * 40} couleur="#FFE6D2" /></div>
      ))}
      {/* Aéroport (tour de contrôle + terminal) */}
      <div style={{position: 'absolute', left: 660, top: 1060, width: 380, height: 120, borderRadius: '30px 30px 0 0', background: '#E9B98C'}} />
      <div style={{position: 'absolute', left: 900, top: 880, width: 50, height: 300, background: '#E2AE80'}} />
      <div style={{position: 'absolute', left: 870, top: 850, width: 110, height: 60, borderRadius: 20, background: '#E2AE80'}} />
      <div style={{position: 'absolute', left: 885, top: 862, width: 80, height: 22, borderRadius: 10, background: '#BFE8FF'}} />
      {/* Avion et traînée blanche */}
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <path d={`M1000 1160 Q${700} ${1100} ${ax + 150} ${ay + 60}`} fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" opacity={vol > 0 ? 0.85 : 0} />
      </svg>
      <div style={{position: 'absolute', left: ax, top: ay, transform: `rotate(${18 + 6 * vol}deg)`, opacity: vol > 0 ? 1 : 0}}><Avion largeur={300} /></div>
      {/* Route */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1180, height: 150, background: '#E7C59C'}} />
      {Array.from({length: 8}, (_, k) => (
        <div key={k} style={{position: 'absolute', top: 1250, left: ((k * 160 - f * 10) % 1280 + 1280) % 1280 - 100, width: 80, height: 10, borderRadius: 5, background: '#fff'}} />
      ))}
      <div style={{position: 'absolute', left: xVoiture, top: 1000 - Math.abs(Math.sin(f * 0.3)) * 3}}><Berline f={f} largeur={620} /></div>
      <Etincelles f={f} graine="soleil" couleur="#FFF6D6" zone={[0, 300, 1080, 800]} n={14} />
      {/* Textes */}
      <div style={{position: 'absolute', left: 60, right: 60, top: 270}}>
        <MotsRebond f={f} mots={V.transfert} debut={0} taille={128} cle={1} ecart={6} />
        <div style={{marginTop: 14, textAlign: 'center', fontFamily: POLICE, fontWeight: 600, fontSize: 34, letterSpacing: '0.18em', color: P.encre, opacity: interpolate(f, [14, 22], [0, 1], clampOpts)}}>
          {V.marque}
          <div style={{height: 6, width: 90, margin: '8px auto 0', borderRadius: 3, background: COULEURS.rouge}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 680, height: 230, borderRadius: 60, background: '#fff', display: 'flex', alignItems: 'baseline', justifyContent: 'center',
        gap: 16, paddingTop: 52, boxSizing: 'border-box', opacity: f >= s(T.prix - T.transfert) ? 1 : 0, boxShadow: '0 24px 0 rgba(43,45,66,.08), 0 30px 70px rgba(150,80,30,.25)',
        transform: `scale(${0.3 + 0.7 * prix}) rotate(${(1 - prix) * -10 + Math.sin(f * 0.15) * 1.5}deg)`}}>
        <span style={{fontFamily: POLICE, fontWeight: 600, fontSize: 56, color: '#8a8070'}}>{V.prix.prefixe}</span>
        <span style={{fontFamily: POLICE, fontWeight: 700, fontSize: 150, lineHeight: 1, color: P.encre}}>{V.prix.montant}</span>
        <span style={{fontFamily: POLICE, fontWeight: 700, fontSize: 60, color: P.corail}}>{V.prix.unite}</span>
      </div>
      <Confettis f={f - s(T.prix - T.transfert)} cx={540} cy={780} n={40} />
      <Son nom="whoosh" a={14} volume={0.35} />
      <Son nom="prix" a={s(T.prix - T.transfert)} volume={V.sons.prix} />
    </AbsoluteFill>
  );
};

// ── Scène 4 : crème, « Commentez A, B ou C », WhatsApp qui pulse ──
const Commentez: React.FC = () => {
  const f = useCurrentFrame();
  const contact = ressort(f, 16, 9, 160);
  const pulse = 1 + 0.04 * Math.sin(f * 0.3);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 60% at 50% 40%, #FFFBF2 0%, ${P.creme} 60%, ${P.sable} 100%)`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 540 - 900, top: 700 - 900, width: 1800, height: 1800, transform: `rotate(${f * 0.3}deg)`,
        background: 'repeating-conic-gradient(rgba(255,201,74,.12) 0deg 10deg, rgba(255,201,74,0) 10deg 24deg)', borderRadius: '50%'}} />
      <Etincelles f={f} graine="fin" couleur={P.dore} zone={[0, 250, 1080, 1100]} n={16} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 360}}>
        <MotsRebond f={f} mots={[V.commentez[0]]} debut={0} taille={140} />
        <div style={{height: 8, width: 160, margin: '6px auto 0', borderRadius: 4, background: COULEURS.rouge, transform: `scaleX(${ressort(f, 6)})`}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 34}}>
        {V.cartes.map((c, i) => {
          const p = ressort(f, 6 + i * 4, 8, 200);
          const saute = Math.abs(Math.sin((f - i * 6) * 0.22)) * 40 * Math.min(1, Math.max(0, (f - 20) / 10));
          return (
            <div key={c.lettre} style={{width: 180, height: 180, borderRadius: 90, background: c.couleur, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: POLICE, fontWeight: 700, fontSize: 104, color: P.encre, transform: `translateY(${-saute}px) scale(${p})`, boxShadow: '0 14px 0 rgba(43,45,66,.1)'}}>{c.lettre}</div>
          );
        })}
      </div>
      {/* Flèche vers les commentaires */}
      <svg width={90} height={110} viewBox="0 0 45 55" style={{position: 'absolute', left: 495, top: 880 + Math.abs(Math.sin(f * 0.2)) * 22, opacity: ressort(f, 12)}}>
        <path d="M22.5 4v38M8 30l14.5 15L37 30" fill="none" stroke={P.corail} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', left: 90, right: 90, top: 1080, height: 150, borderRadius: 75, background: COULEURS.whatsapp, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22,
        opacity: contact, transform: `translateY(${(1 - contact) * 80}px) scale(${pulse})`, fontFamily: POLICE, fontWeight: 700, fontSize: 60, color: '#fff',
        boxShadow: `0 16px 0 #1DA851, 0 0 0 ${10 + 8 * Math.sin(f * 0.3)}px rgba(37,211,102,.2)`}}>
        <WhatsAppIcon taille={86} fond={false} />{CONTACT.indicatif} {CONTACT.numero.join(' ')}
      </div>
      {[0, 1, 2].map((i) => <Son key={i} nom="pop" a={6 + i * 4} volume={V.sons.fin} />)}
      <Son nom="notif" a={16} volume={V.sons.fin} />
    </AbsoluteFill>
  );
};

// ── Sous-titres mot par mot (mots répartis dans chaque phrase au prorata de leur longueur) ──
const normaliser = (m: string) => m.toLowerCase().replace(/[.,:?!’']/g, '').trim();
const MORCEAUX = V.segments.flatMap(({de, a, texte}) => {
  const mots = texte.split(' ');
  const poids = mots.map((m) => Math.max(m.replace(/[^\p{L}\d]/gu, '').length, 3) + 2);
  const total = poids.reduce((x, y) => x + y, 0);
  let t = de;
  const debuts = poids.map((p) => { const d = t; t += ((a - de) * p) / total; return d; });
  const groupes: number[][] = [];
  let cour: number[] = [];
  mots.forEach((m, i) => {
    cour.push(i);
    if (cour.length === 3 || /[,.:?]$/.test(m) || i === mots.length - 1) { groupes.push(cour); cour = []; }
  });
  return groupes.map((g, n) => ({
    debut: debuts[g[0]],
    fin: n + 1 < groupes.length ? debuts[groupes[n + 1][0]] : a + 0.3,
    mots: g.map((i) => ({texte: mots[i], debut: debuts[i], cle: V.motsCles.includes(normaliser(mots[i]).replace(/^cest$/, ''))})),
  }));
}).filter((m) => !V.sansSousTitres.some(([x, y]) => m.debut >= x && m.debut < y));

const SousTitres: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / fps;
  const m = MORCEAUX.find((x) => t >= x.debut && t < x.fin);
  if (!m) return null;
  const entree = ressort(f, s(m.debut), 12, 220);
  return (
    <div style={{position: 'absolute', left: 70, right: 150, top: 1440, display: 'flex', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 18px', padding: '14px 34px 18px', borderRadius: 36, background: 'rgba(255,255,255,.88)',
        boxShadow: '0 12px 30px rgba(43,45,66,.12)', transform: `scale(${0.85 + 0.15 * entree})`}}>
        {m.mots.map((w, i) => {
          const actif = t >= w.debut;
          const p = ressort(f, s(w.debut), 8, 240);
          return (
            <span key={i} style={{display: 'inline-block', fontFamily: POLICE, fontWeight: 700, fontSize: 66, lineHeight: 1.15,
              color: actif && w.cle ? P.corail : P.encre, opacity: actif ? 1 : 0.25, transform: `translateY(${actif ? (1 - p) * 18 : 0}px) scale(${actif ? 0.8 + 0.2 * p : 1})`}}>{w.texte}</span>
          );
        })}
      </div>
    </div>
  );
};

export const VideoQuizSoleil: React.FC = () => {
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
    <AbsoluteFill style={{background: P.creme}}>
      {bloc(T.chambre, T.cartes[0], <Chambre />)}
      {bloc(T.cartes[0], T.transfert, <Quiz />)}
      {bloc(T.transfert, T.commentez, <Transfert />)}
      {bloc(T.commentez, T.boucle, <Commentez />)}
      {bloc(T.boucle, V.dureeS, <Chambre avecSon={false} boucle />)}
      <SousTitres />
      <Audio src={staticFile(V.voix)} />
      {/* Musique : remplacée par le roulement pendant le suspense */}
      {groove(T.chambre, T.suspense)}
      {groove(T.bonne, V.dureeS)}
    </AbsoluteFill>
  );
};
