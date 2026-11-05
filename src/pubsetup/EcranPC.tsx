import {CameraMotionBlur} from '@remotion/motion-blur';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {POLICES, PUB_SETUP, VIDEO} from '../config';
import {CLIPS, ECRAN, Fin} from './Clips';
import {clipA} from './PubSetup';
import {Timeline, TL} from './Timeline';

// « PubSetupEcran » : la même pub, mais enregistrée DANS l'ordinateur : l'interface de montage en plein cadre
// (panneau d'aperçu qui joue le montage JP en haut, timeline en dessous), sans le bureau ni la pièce.
// Macros = zooms dans l'interface, puis recul sur toute la fenêtre. Même musique, mêmes repères (PUB_SETUP).
const S = PUB_SETUP, B = S.temps, C = S.couleurs;
const FEN = {l: 1280, h: 2276, menu: 44, apercu: 860}; // fenêtre logique ; 1280 × 0,84375 = 1080 de large
const K = 1080 / FEN.l;
const VUE = {x: 40, y: FEN.menu + 56, l: 1200, h: 720}; // zone de l'aperçu de composition
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const doux = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
const F = POLICES.texte;

// Caméra : point visé (coordonnées de la timeline) et zoom ; pas de rotation (enregistrement d'écran)
type Cam = {fx: number; fy: number; z: number};
const vise = (u: number, v: number): [number, number] => [u * K, (v + FEN.apercu) * K];
const ENTIER: Cam = {fx: 540, fy: 960, z: 1};
const plan = (t: number): Cam => {
  if (t < S.macroDefilement[1] * B) { const [fx, fy] = vise(230, 330); return {fx, fy, z: 4.2}; }
  if (t < S.macroCalques[1] * B) {
    const p = doux(t, S.macroCalques[0] * B, S.macroCalques[1] * B), [fx, fy] = vise(lerp(640, 1060, p), lerp(330, 560, p));
    return {fx, fy, z: 3.4};
  }
  const p3 = doux(t, S.macroProprietes[0] * B, S.macroProprietes[1] * B), [fx, fy] = vise(lerp(150, 210, p3), 262);
  return {fx, fy, z: lerp(3.8, 4.3, p3)};
};
const camera = (t: number, fps: number): Cam => {
  const r0 = S.recul[0] * B;
  if (t < r0) return plan(t);
  const d = plan(r0 - 0.001), p = spring({frame: Math.round((t - r0) * fps), fps, config: {stiffness: 120, damping: 14}});
  return {fx: lerp(d.fx, ENTIER.fx, p), fy: lerp(d.fy, ENTIER.fy, p), z: Math.exp(lerp(Math.log(d.z), 0, p))};
};

const MENUS = ['Fichier', 'Édition', 'Composition', 'Calque', 'Effet', 'Animation', 'Affichage', 'Fenêtre', 'Aide'];

const Fenetre: React.FC<{decalage: number}> = ({decalage}) => {
  const frame = useCurrentFrame() + decalage, {fps} = useVideoConfig(), t = frame / fps;
  const c = camera(t, fps);
  const clip = clipA(t), Clip = clip ? CLIPS[clip.id] : null, A = CLIPS.carte;
  const fin = t >= S.finRepere.noir * B;
  const tc = Math.floor(t * 30), code = `0;00;${String(Math.floor(tc / 30)).padStart(2, '0')};${String(tc % 30).padStart(2, '0')}`;
  return (
    <AbsoluteFill style={{background: C.noir, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: FEN.l, height: FEN.h, transformOrigin: '0 0',
        transform: `translate(540px, 960px) scale(${c.z}) translate(${-c.fx}px, ${-c.fy}px) scale(${K})`}}>
        {/* Barre de menus */}
        <div style={{position: 'absolute', left: 0, top: 0, width: FEN.l, height: FEN.menu, background: '#16171B', display: 'flex', alignItems: 'center', gap: 26, paddingLeft: 24, boxSizing: 'border-box'}}>
          {MENUS.map((m) => <span key={m} style={{fontFamily: F, fontWeight: 600, fontSize: 17, color: '#A8AAB2'}}>{m}</span>)}
        </div>
        {/* Panneau d'aperçu de composition : il joue le montage JP */}
        <div style={{position: 'absolute', left: 0, top: FEN.menu, width: FEN.l, height: FEN.apercu - FEN.menu, background: '#1A1B1F', borderBottom: '2px solid #33343A'}}>
          <div style={{position: 'absolute', left: 14, top: 12, fontFamily: F, fontWeight: 600, fontSize: 16, color: '#E8E9EE'}}>Composition : JP_Pub_Douala ×</div>
          <div style={{position: 'absolute', left: VUE.x, top: 56, width: VUE.l, height: VUE.h, background: '#000', overflow: 'hidden', boxShadow: '0 0 0 1px #3A3B42'}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: ECRAN.l, height: ECRAN.h, transformOrigin: '0 0', transform: `scale(${VUE.l / ECRAN.l})`}}>
              {!fin && Clip && clip && <Clip k={t - clip.a} d={clip.z - clip.a} fps={fps} />}
              {!fin && !clip && <A k={0} d={1} fps={fps} />}
              {fin && <Fin k={t - S.finRepere.noir * B} fps={fps} />}
            </div>
          </div>
          <div style={{position: 'absolute', left: VUE.x, top: 56 + VUE.h + 12, display: 'flex', gap: 24, fontFamily: F, fontWeight: 600, fontSize: 15, color: '#8E9099'}}>
            <span>100 %</span><span>Intégrale</span><span style={{color: C.bleu, fontVariantNumeric: 'tabular-nums'}}>{code}</span>
          </div>
        </div>
        {/* Timeline */}
        <div style={{position: 'absolute', left: 0, top: FEN.apercu, width: TL.l, height: FEN.h - FEN.apercu}}>
          <Timeline t={t} h={FEN.h - FEN.apercu} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const f = (s: number) => Math.round(s * VIDEO.fps);
export const dureePubSetupEcran = f(S.dureeS);
const FIN_ZOOMS = f(S.montage[0] * B);

export const PubSetupEcran: React.FC = () => (
  <AbsoluteFill style={{background: C.noir}}>
    <Sequence from={0} durationInFrames={FIN_ZOOMS} name="zooms + recul">
      <CameraMotionBlur shutterAngle={200} samples={6}>
        <Fenetre decalage={0} />
      </CameraMotionBlur>
    </Sequence>
    <Sequence from={FIN_ZOOMS} durationInFrames={dureePubSetupEcran - FIN_ZOOMS} name="interface entière">
      <Fenetre decalage={FIN_ZOOMS} />
    </Sequence>
    <Audio src={staticFile(S.bande)} />
  </AbsoluteFill>
);
