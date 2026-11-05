import {CameraMotionBlur} from '@remotion/motion-blur';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {PUB_SETUP, VIDEO} from '../config';
import {CLIPS, ECRAN, Fin} from './Clips';
import {matrice, projeter, QUAD_HAUT, QUAD_PORTABLE} from './geo';
import {Timeline, TL} from './Timeline';

// « PubSetup » : POV d'un monteur motion design, bureau dans le noir (photo fournie), 14 s, sans voix.
// Macros sur la timeline du portable, recul de caméra à ressort vers le bureau, puis montage de 14 clips JP sur l'écran
// du haut, coupés sur les temps de la musique (140 BPM). Les deux écrans sont incrustés en perspective (corner-pin).
const S = PUB_SETUP, B = S.temps, C = S.couleurs;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const doux = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});

// Calendrier du montage (secondes) : [début, fin, clip]
const MONTAGE = (() => {
  let t = S.montage[0] * B;
  return S.clips.map((c) => { const a = t; t += c.temps * B; return {...c, a, z: t}; });
})();
const clipA = (t: number) => MONTAGE.find((c) => t >= c.a && t < c.z) ?? null;

// ── Caméra virtuelle (fonction pure du temps) ──
type Cam = {fx: number; fy: number; z: number; ax: number; ay: number; az: number};
const vise = (u: number, v: number) => projeter(TL.l, TL.h, QUAD_PORTABLE, u, v);
const BUREAU: Cam = {fx: 540, fy: 1018, z: 1.55, ax: 0, ay: 0, az: 0}; // cadrage serré comme la référence : l'écran du haut prend toute la largeur
const plan = (t: number): Cam => {
  if (t < S.macroDefilement[1] * B) { const [fx, fy] = vise(230, 330); return {fx, fy, z: 9.5, ax: 26, ay: 0, az: -9}; }
  if (t < S.macroCalques[1] * B) {
    const p = doux(t, S.macroCalques[0] * B, S.macroCalques[1] * B), [fx, fy] = vise(lerp(560, 1120, p), lerp(330, 560, p));
    return {fx, fy, z: 7.5, ax: 32, ay: -12, az: -7};
  }
  const p3 = doux(t, S.macroProprietes[0] * B, S.macroProprietes[1] * B), [fx, fy] = vise(lerp(260, 330, p3), 300);
  return {fx, fy, z: lerp(9, 10.2, p3), ax: 18, ay: 6, az: 5};
};
export const camera = (t: number, fps: number): Cam => {
  const r0 = S.recul[0] * B;
  let c: Cam;
  if (t < r0) c = plan(t);
  else {
    // Dolly-out d'un coup, avec ressort (léger dépassement)
    const depart = plan(r0 - 0.001), p = spring({frame: Math.round((t - r0) * fps), fps, config: {stiffness: 120, damping: 13}});
    c = {fx: lerp(depart.fx, BUREAU.fx, p), fy: lerp(depart.fy, BUREAU.fy, p), z: Math.exp(lerp(Math.log(depart.z), Math.log(BUREAU.z), p)), ax: lerp(depart.ax, 0, p), ay: lerp(depart.ay, 0, p), az: lerp(depart.az, 0, p)};
    // Tenue à la main (« filmé au téléphone »)
    c.fx += 3 * Math.sin(t * 1.3); c.fy += 2.5 * Math.sin(t * 1.7 + 1); c.az += 0.18 * Math.sin(t * 0.9);
  }
  return c;
};

// Luminosité de l'écran du haut (pilote la lueur LED et le reflet), lissée après chaque coupe
const lumiere = (t: number) => {
  const i = MONTAGE.findIndex((c) => t >= c.a && t < c.z);
  if (t < S.montage[0] * B) return {lum: t > (S.recul[0] + 0.6) * B ? 0.25 : 0, coul: C.violet};
  if (i < 0) return {lum: 0.15, coul: C.violet};
  const cur = MONTAGE[i], prev = MONTAGE[i - 1] ?? cur;
  return {lum: cur.lum + (prev.lum - cur.lum) * Math.exp(-(t - cur.a) * 12), coul: cur.coul};
};

const PremierClip: React.FC<{fps: number}> = ({fps}) => { const A = CLIPS.carte; return <A k={0} d={1} fps={fps} />; };

const Monde: React.FC<{decalage: number}> = ({decalage}) => {
  const frame = useCurrentFrame() + decalage, {fps} = useVideoConfig(), t = frame / fps;
  const c = camera(t, fps);
  const {lum, coul} = lumiere(t);
  const R = S.finRepere;
  const pulse = t >= R.logo * B ? Math.exp(-(t - R.logo * B) * 2.2) : 0;
  const led = 0.07 + 0.26 * lum + 0.6 * pulse - (t > R.logo * B + 1 ? 0.06 : 0);
  const allume = t >= (S.recul[0] + 0.55) * B;
  const scintille = t < S.montage[0] * B ? (Math.floor(t * 30) % 3 === 0 ? 0.4 : 1) : 1;
  const clip = clipA(t);
  const Clip = clip ? CLIPS[clip.id] : null;
  const debutMontage = S.montage[0] * B;
  const fin = t >= R.noir * B;
  const aberration = t >= S.macroCalques[0] * B && t < S.macroCalques[1] * B ? `drop-shadow(2px 0 0 rgba(255,79,163,.45)) drop-shadow(-2px 0 0 rgba(61,165,255,.45))` : 'none';
  return (
    <AbsoluteFill style={{perspective: 1400, perspectiveOrigin: '540px 960px', filter: aberration}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transformStyle: 'preserve-3d',
        transform: `translate3d(540px, 960px, 0) rotateX(${c.ax}deg) rotateY(${c.ay}deg) rotateZ(${c.az}deg) scale(${c.z}) translate(${-c.fx}px, ${-c.fy}px)`}}>
        <Img src={staticFile(S.photo)} style={{position: 'absolute', left: 0, top: (1920 - 2752 * (1080 / 1536)) / 2, width: 1080, filter: 'brightness(.78) saturate(1.35)'}} />
        {/* Lueur de la bande LED, qui suit la luminosité des clips */}
        <div style={{position: 'absolute', left: -60, top: 330, width: 1200, height: 760, borderRadius: '50%', background: `radial-gradient(ellipse at 50% 45%, ${C.violet}, rgba(139,61,255,0) 65%)`, opacity: led, mixBlendMode: 'screen'}} />
        {/* Écran du haut */}
        <div style={{position: 'absolute', left: 0, top: 0, width: ECRAN.l, height: ECRAN.h, transformOrigin: '0 0', transform: matrice(ECRAN.l, ECRAN.h, QUAD_HAUT), overflow: 'hidden', background: '#000', opacity: allume ? scintille : 0}}>
          {!fin && Clip && clip && <Clip k={t - clip.a} d={clip.z - clip.a} fps={fps} />}
          {!fin && !clip && t < debutMontage && <PremierClip fps={fps} />}
          {fin && <Fin k={t - R.noir * B} fps={fps} />}
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,.06), transparent 40%)'}} />
        </div>
        {/* Écran du portable : la timeline */}
        <div style={{position: 'absolute', left: 0, top: 0, width: TL.l, height: TL.h, transformOrigin: '0 0', transform: matrice(TL.l, TL.h, QUAD_PORTABLE), overflow: 'hidden'}}>
          <Timeline t={t} />
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(170deg, rgba(255,255,255,.05), transparent 50%)'}} />
        </div>
        {/* Reflet de l'écran du haut sur le bureau */}
        <div style={{position: 'absolute', left: 80, top: 1360, width: 920, height: 220, borderRadius: '50%', background: `radial-gradient(ellipse, ${coul}, transparent 70%)`, opacity: allume ? 0.06 + 0.16 * lum : 0, mixBlendMode: 'screen', filter: 'blur(20px)'}} />
      </div>
    </AbsoluteFill>
  );
};

// Habillage « filmé au téléphone » : profondeur de champ en macro, grain, vignettage (aucune légende)
const Habillage: React.FC = () => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig(), t = frame / fps;
  const macro = t < S.recul[0] * B + 0.15;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {macro && (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 560, backdropFilter: 'blur(7px)', WebkitMaskImage: 'linear-gradient(#000, transparent)', maskImage: 'linear-gradient(#000, transparent)'}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 620, backdropFilter: 'blur(7px)', WebkitMaskImage: 'linear-gradient(transparent, #000)', maskImage: 'linear-gradient(transparent, #000)'}} />
        </>
      )}
      <div style={{position: 'absolute', inset: -64, backgroundImage: `url(${staticFile('pubsetup/grain.png')})`, opacity: 0.1, mixBlendMode: 'overlay', transform: `translate(${((frame * 37) % 64) - 32}px, ${((frame * 53) % 64) - 32}px)`}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 55%, rgba(0,0,0,.55) 100%)'}} />
    </AbsoluteFill>
  );
};

const f = (s: number) => Math.round(s * VIDEO.fps);
export const dureePubSetup = f(S.dureeS);
const FIN_MACRO = f(S.montage[0] * B);

export const PubSetup: React.FC = () => (
  <AbsoluteFill style={{background: C.noir}}>
    {/* Flou de mouvement de caméra pendant les macros et le recul, puis rendu direct */}
    <Sequence from={0} durationInFrames={FIN_MACRO} name="macros + recul">
      <CameraMotionBlur shutterAngle={200} samples={6}>
        <Monde decalage={0} />
      </CameraMotionBlur>
    </Sequence>
    <Sequence from={FIN_MACRO} durationInFrames={dureePubSetup - FIN_MACRO} name="bureau + montage">
      <Monde decalage={FIN_MACRO} />
    </Sequence>
    <Habillage />
    <Audio src={staticFile(S.bande)} />
  </AbsoluteFill>
);
