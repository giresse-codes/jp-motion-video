// 24. « La voiture sort du téléphone » — image « attends… quoi ? » (16 s).
// Téléphone en CSS 3D, voiture en 2,5D (assets/voiture.png) avec ombre de contact, écran déformé comme de l'eau.
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Bande, clamp, ease, FinJP, hasard, mix, prog, ressort, useT, visibleJusqua, Voiture} from './commun';
import {MOTION, POLICES_MOTION as P, TARIFS} from './config';

const C = {studio: '#E9EAEC', studio2: '#C9CCD1', noir: '#0E0F12', cyan: '#22D3EE', blanc: '#FFFFFF'};
const TL = 640; // téléphone : largeur
const TH = 1300; // hauteur

const Ecran: React.FC<{t: number; cta: boolean}> = ({t, cta}) => {
  const envoi = ease.out(prog(t % 16, 0.15, 0.45));
  return (
    <div style={{position: 'absolute', inset: 18, borderRadius: 56, overflow: 'hidden', background: '#0B141A'}}>
      {!cta ? (
        <>
          <div style={{height: 150, background: '#1F2C34', display: 'flex', alignItems: 'flex-end', gap: 20, padding: '0 30px 22px', fontFamily: P.grotesk, fontWeight: 700, fontSize: 40, color: '#E9EDEF'}}>
            <div style={{width: 72, height: 72, borderRadius: 36, background: C.cyan, color: C.noir, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30}}>JP</div>
            JP Service
          </div>
          <div style={{position: 'absolute', right: 26, top: mix(1100, 220, envoi), opacity: envoi, maxWidth: 500, background: '#005C4B', color: '#E9EDEF', padding: '22px 28px', borderRadius: '30px 30px 8px 30px', fontFamily: P.grotesk, fontSize: 42}}>
            Un chauffeur, maintenant ? <span style={{color: '#53BDEB', fontSize: 28}}>✓✓</span>
          </div>
        </>
      ) : null}
    </div>
  );
};

const Telephone: React.FC<{t: number; rx: number; s: number; y: number; vague: number; cta: ReactNode}> = ({t, rx, s, y, vague, cta}) => (
  <div style={{position: 'absolute', left: 540 - TL / 2, top: 960 - TH / 2 + y, width: TL, height: TH, transform: `perspective(2200px) rotateX(${rx}deg) scale(${s})`, transformOrigin: '50% 60%'}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 74, background: 'linear-gradient(150deg, #2A2C31, #0B0C0E)', boxShadow: `0 ${30 + rx}px ${60 + rx}px rgba(30,35,45,0.45)`}} />
    <div style={{position: 'absolute', inset: 0, filter: vague > 0.01 ? 'url(#p24eau)' : undefined}}>
      <Ecran t={t} cta={Boolean(cta)} />
    </div>
    {cta ? <div style={{position: 'absolute', inset: 18, borderRadius: 56, overflow: 'hidden'}}>{cta}</div> : null}
    {/* Reflet sur la vitre */}
    <div style={{position: 'absolute', inset: 18, borderRadius: 56, background: 'linear-gradient(125deg, rgba(255,255,255,0.18), transparent 35%)', pointerEvents: 'none'}} />
    {/* Ondes à la surface de l'écran */}
    {vague > 0.01
      ? [0, 1, 2].map((k) => {
          const r = ((t * 2 + k / 3) % 1) * 700;
          return <div key={k} style={{position: 'absolute', left: TL / 2 - r / 2, top: TH * 0.55 - r / 2, width: r, height: r, borderRadius: '50%', border: `4px solid rgba(34,211,238,${0.6 * vague * (1 - r / 700)})`}} />;
        })
      : null}
  </div>
);

export const Pub24TelephoneVoiture: React.FC = () => {
  const t = useT();
  // Téléphone : à plat (incliné) au début, se relève face caméra pour l'appel, se recouche sur la fin (boucle)
  const releve = ease.inOut(prog(t, 10.6, 11.4)) * (1 - ease.inOut(prog(t, 15.6, 15.97)));
  const rx = mix(52, 0, releve);
  const sortie = ease.inOut(prog(t, 1.5, 4.5));
  const rentre = ease.inOut(prog(t, 10.0, 10.7));
  const sTel = mix(mix(1, 0.42, sortie), 1, rentre) * mix(1, 1.18, releve);
  const yTel = mix(mix(120, 420, sortie), 120, rentre) * (1 - releve) + releve * 30;
  const vague = clamp(prog(t, 0.7, 0.9) * (1 - prog(t, 1.6, 2.2)) + prog(t, 9.9, 10.1) * (1 - prog(t, 10.7, 11.0)));

  // Voiture : sort de l'écran (0,8 s), grandit jusqu'à la taille réelle, dérape au centre (4,5 – 6 s)
  const nait = ease.out(prog(t, 0.8, 1.5));
  const derape = prog(t, 4.5, 6.0);
  const voitureVisible = t >= 0.8 && t < 10.7;
  const orbite = Math.sin(prog(t, 1.5, 4.5) * Math.PI) * 14;
  let largeur = mix(120, 300, nait);
  let vx = 540;
  let vy = 1120;
  let rot = 0;
  if (t >= 1.5) {
    largeur = mix(300, 940, sortie);
    vy = mix(1120, 1020, sortie);
    vx = 540 + orbite * 6;
  }
  if (t >= 4.5) {
    const k = ease.out(derape);
    vx = mix(540 + 260, 540, k);
    vy = mix(1020, 1180, k);
    rot = Math.sin(derape * Math.PI * 2.2) * 7 * (1 - derape);
  }
  if (t >= 10.0) {
    largeur = mix(940, 80, rentre);
    vy = mix(1180, 1130, rentre);
  }
  const hauteur = largeur * (378 / 786);
  const flouMouvement = t >= 4.5 && t < 5.4 ? 6 * (1 - prog(t, 4.5, 5.4)) : 0;
  const pastilles = ['Wi-Fi', 'Clim', 'Mini écran'];
  const cta = visibleJusqua(t, 10.9, 15.6, 0.3, 0.3);

  const titre: CSSProperties = {position: 'absolute', left: 120, right: 120, textAlign: 'center', fontFamily: P.grotesk, fontWeight: 700, color: C.noir};
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${C.studio} 0%, ${C.studio2} 85%)`, overflow: 'hidden'}}>
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <filter id="p24eau">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed={Math.floor(t * 12) % 50} />
          <feDisplacementMap in="SourceGraphic" scale={vague * 36} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <Telephone
        t={t}
        rx={rx}
        s={sTel}
        y={yTel}
        vague={vague}
        cta={
          cta > 0 ? (
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0B141A, #10232B)', opacity: cta}}>
              <FinJP
                t={t}
                s={{police: P.grotesk, couleur: C.blanc, couleurNumero: C.blanc, accent: C.cyan, tailleNumero: 104}}
                p={(i) => prog(t, 11.2 + i * 0.12, 11.5 + i * 0.12)}
                boite={{left: 30, right: 30, top: 170}}
                tailleTexte={42}
                ecart={30}
              />
            </div>
          ) : null
        }
      />

      {/* Ombre de contact et fumée du dérapage */}
      {voitureVisible ? (
        <>
          <div style={{position: 'absolute', left: vx - largeur * 0.45, top: vy + hauteur * 0.36, width: largeur * 0.9, height: hauteur * 0.16, borderRadius: '50%', background: 'rgba(15,20,30,0.55)', filter: `blur(${10 + largeur / 60}px)`, opacity: t < 1.5 ? nait : 1}} />
          {t >= 4.5 && t < 6.5
            ? Array.from({length: 14}).map((_, i) => {
                const k = clamp((t - 4.5 - i * 0.05) / 1.2);
                if (k <= 0 || k >= 1) return null;
                return <div key={i} style={{position: 'absolute', left: vx + 120 + i * 18 + k * 120, top: vy + hauteur * 0.2 - k * 120 - hasard(i) * 60, width: 80 + k * 160, height: 80 + k * 160, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', filter: 'blur(20px)', opacity: (1 - k) * 0.8}} />;
              })
            : null}
          <div style={{position: 'absolute', left: vx - largeur / 2, top: vy - hauteur / 2, width: largeur, filter: `blur(${flouMouvement}px) drop-shadow(0 18px 18px rgba(0,0,0,0.25))`, transform: `rotate(${rot}deg) translateY(${t < 1.5 ? (1 - nait) * 40 : 0}px) scaleX(${1 - Math.abs(orbite) / 200})`, opacity: t < 1.5 ? clamp(nait * 2) : 1}}>
            <Voiture largeur={largeur} />
            {/* Reflet qui glisse sur la carrosserie */}
            <div style={{position: 'absolute', inset: 0, background: `linear-gradient(110deg, transparent ${mix(10, 70, prog(t, 2, 4.5))}%, rgba(255,255,255,0.35) ${mix(15, 75, prog(t, 2, 4.5))}%, transparent ${mix(22, 82, prog(t, 2, 4.5))}%)`, WebkitMaskImage: `url(${staticFile(MOTION.voiture)})`, WebkitMaskSize: '100% 100%', mixBlendMode: 'screen'}} />
          </div>
        </>
      ) : null}

      {/* Lueur de la portière arrière et pastilles qui en sortent */}
      {t >= 5.8 && t < 10.2 ? (
        <>
          <div style={{position: 'absolute', left: 540 + 940 * 0.12 - 120, top: 1180 - 140, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, ${C.cyan}66, transparent 65%)`, opacity: 0.7 * prog(t, 5.8, 6.1) * (1 - prog(t, 9.8, 10.2))}} />
          {pastilles.map((x, i) => {
            const p = clamp(ressort(t, 6.0 + i * 0.25, 1.8, 6), 0, 1.15);
            const px = mix(540 + 110, 200 + i * 340, Math.min(1, p));
            const py = mix(1150, 1500, Math.min(1, p));
            return (
              <div key={x} style={{position: 'absolute', left: px - 150, top: py, width: 300, textAlign: 'center', padding: '20px 0', borderRadius: 60, background: C.noir, color: C.cyan, fontFamily: P.grotesk, fontWeight: 700, fontSize: 44, transform: `scale(${p})`, opacity: clamp(p * 3) * (1 - prog(t, 9.8, 10.1)), boxShadow: `0 14px 30px rgba(0,0,0,0.25), 0 0 30px ${C.cyan}55`}}>
                {x}
              </div>
            );
          })}
        </>
      ) : null}

      {/* Textes */}
      {t < 1.6 ? <div style={{...titre, top: 200, fontSize: 84, opacity: clamp(t * 15) * (1 - prog(t, 1.3, 1.6))}}>Commande envoyée…</div> : null}
      {t >= 15.6 ? <div style={{...titre, top: 200, fontSize: 84, opacity: prog(t, 15.7, 15.97)}}>Commande envoyée…</div> : null}
      {t >= 7.0 && t < 10.2 ? (
        <>
          <div style={{...titre, top: 380, fontSize: 96, opacity: prog(t, 7.0, 7.3) * (1 - prog(t, 9.9, 10.2))}}>Livrée à ta porte.</div>
          <div style={{position: 'absolute', left: 120, right: 120, top: 560, height: 120, perspective: 1200, opacity: prog(t, 7.6, 7.8) * (1 - prog(t, 9.9, 10.2))}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: 24, background: C.noir, color: C.blanc, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: P.grotesk, fontWeight: 700, fontSize: 40, transform: `perspective(1200px) rotateX(${(1 - ease.back(prog(t, 7.6, 8.1))) * 90}deg)`}}>
              Confort 3 500 F/h · <span style={{color: C.cyan, marginLeft: 12}}>{TARIFS.eco} (promo)</span>
            </div>
          </div>
        </>
      ) : null}
      <Bande n={24} />
    </AbsoluteFill>
  );
};
