// 18. « Le sablier » (10 s). Sablier et grains de sable dessinés dans un canevas ;
// chaque grain suit une trajectoire qui est une fonction pure du temps (texte, voiture puis flèche formés de sable).
import {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, staticFile} from 'remotion';
import {Bande, clamp, ease, FinJP, hasard, mix, prog, useT} from './commun';
import {MOTION, POLICES_MOTION as P, TARIFS} from './config';

const C = {fond: '#12100E', sable: '#E1B866', creme: '#F3ECDD', bois: '#6B4A2E'};
const N = 6000;
const CENTRE = {x: 540, y: 800};
const HAUT = 470; // demi-hauteur du verre
const LARG = 270; // demi-largeur max
const COL = ['#E1B866', '#EBC77A', '#D2A653', '#F2D898', '#C99A48'];

type Pt = [number, number];
type Cibles = {texte: Pt[]; voiture: Pt[]; fleche: Pt[]};

/** Demi-largeur du verre à la hauteur relative u ∈ [-1, 1] (0 = goulot). */
const demiLargeur = (u: number) => {
  const a = Math.abs(u);
  const bulbe = Math.sin(Math.min(1, a / 0.82) * (Math.PI / 2)) ** 0.9;
  const fin = a > 0.9 ? Math.sqrt(Math.max(0, 1 - ((a - 0.9) / 0.1) ** 2)) : 1;
  return LARG * (0.05 + 0.95 * bulbe) * (0.75 + 0.25 * fin);
};

/** Échantillonne les pixels opaques d'un dessin pour en faire des cibles de grains. */
const echantillonner = (dessin: (g: CanvasRenderingContext2D) => void, pas = 3): Pt[] => {
  const c = document.createElement('canvas');
  c.width = 1080;
  c.height = 1920;
  const g = c.getContext('2d')!;
  dessin(g);
  const d = g.getImageData(0, 0, 1080, 1920).data;
  const pts: Pt[] = [];
  for (let y = 0; y < 1920; y += pas) for (let x = 0; x < 1080; x += pas) if (d[(y * 1080 + x) * 4 + 3] > 128) pts.push([x, y]);
  // mélange déterministe, puis on répète pour avoir exactement N cibles
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(hasard(i * 1.37) * (i + 1));
    [pts[i], pts[j]] = [pts[j], pts[i]];
  }
  return Array.from({length: N}, (_, i) => pts[i % Math.max(1, pts.length)] ?? [540, 960]);
};

const preparer = async (): Promise<Cibles> => {
  await document.fonts.load(`700 100px "${P.serif}"`);
  const img = new Image();
  img.src = staticFile(MOTION.voiture);
  await img.decode();
  const texte = echantillonner((g) => {
    g.fillStyle = '#fff';
    g.font = `700 100px "${P.serif}"`;
    g.textAlign = 'center';
    g.fillText('…dans les', 540, 1040);
    g.fillText('bouchons ?', 540, 1145);
  });
  const voiture = echantillonner((g) => {
    const l = 860;
    const h = (img.height / img.width) * l;
    g.drawImage(img, 540 - l / 2, 760 - h / 2, l, h);
  }, 4);
  const fleche = echantillonner((g) => {
    g.fillStyle = '#fff';
    g.beginPath();
    const y0 = 815;
    g.moveTo(520, y0);
    g.lineTo(560, y0);
    g.lineTo(560, y0 + 70);
    g.lineTo(600, y0 + 70);
    g.lineTo(540, y0 + 130);
    g.lineTo(480, y0 + 70);
    g.lineTo(520, y0 + 70);
    g.closePath();
    g.fill();
  }, 2);
  return {texte, voiture, fleche};
};

/** Position d'un grain à l'instant t (fonction pure). */
const grain = (i: number, t: number, c: Cibles): Pt | null => {
  const k = hasard(i * 7.13);
  // gel 3,5 – 5 s : le temps du sable s'arrête
  const ts = t < 3.5 ? t : t < 5 ? 3.5 : t;
  const nx = CENTRE.x + (k - 0.5) * 6;
  const ny = CENTRE.y + 6;
  const [tx, ty] = c.texte[i];
  // 1) Chute par le goulot vers le texte (1,2 – 3,4 s)
  const emis = 1.15 + 2.0 * (i / N);
  if (ts < emis) return null;
  const vol = 0.42 + k * 0.12;
  let x: number;
  let y: number;
  const pc = clamp((ts - emis) / vol);
  x = mix(nx, tx, ease.inOut(pc) * 0.85 + pc * 0.15);
  y = mix(ny, ty, pc * pc);
  if (t < 5) return [x, y];
  // 2) Remonte à l'envers et forme la voiture (5 – 6,8 s)
  const [vx, vy] = c.voiture[i];
  const dv = 5 + k * 1.0;
  const pv = ease.inOut(clamp((t - dv) / 0.8));
  const tour = Math.sin(pv * Math.PI) * (80 + k * 120);
  x = mix(tx, vx, pv) + Math.cos(i) * tour * 0.6;
  y = mix(ty, vy, pv) - tour;
  if (t < 8.5) {
    // respiration lumineuse de la silhouette
    return [x + Math.sin(t * 3 + i) * 0.8, y + Math.cos(t * 2.4 + i) * 0.8];
  }
  // 3) Se dissout en flèche dorée vers le bas (8,5 – 9,2 s)
  const [fx, fy] = c.fleche[i];
  const pf = ease.inOut(clamp((t - 8.45 - k * 0.3) / 0.5));
  const dérive = Math.sin(pf * Math.PI) * 60;
  return [mix(x, fx, pf) + Math.sin(i * 3.1) * dérive, mix(y, fy, pf) + dérive * 0.4];
};

/** Rotation du sablier : retournement d'un coup avec rebond (0 – 0,6 s), et de nouveau sur la fin (boucle). */
const rotation = (t: number) => {
  if (t >= 9.62) return mix(0, -180, ease.in(prog(t, 9.62, 10)));
  const p = prog(t, 0, 0.55);
  return -180 + 180 * ease.back(p, 2.2);
};
const opaciteSablier = (t: number) => (t < 5 ? 1 : t < 5.6 ? mix(1, 0.25, prog(t, 5, 5.6)) : t < 8.4 ? 0.25 : t < 9.6 ? mix(0.25, 0, prog(t, 8.4, 8.8)) : prog(t, 9.6, 9.75));

function dessiner(g: CanvasRenderingContext2D, t: number, c: Cibles) {
  g.clearRect(0, 0, 1080, 1920);
  // ── Sablier ──
  const op = opaciteSablier(t);
  if (op > 0) {
    g.save();
    g.globalAlpha = op;
    g.translate(CENTRE.x, CENTRE.y);
    g.rotate((rotation(t) * Math.PI) / 180);
    // Sable : tas du haut qui baisse, petit tas en bas (avant la formation du texte)
    const ecoule = t < 0.4 ? 0 : clamp((Math.min(t, 3.5) - 0.4) / 3.1);
    const vertical = t >= 0.55 && t < 9.62;
    // Tas du haut : épaisseur h qui diminue ; collé au fond retourné pendant le retournement, puis glisse vers le goulot
    const h = vertical ? mix(0.62, 0.08, ecoule) : 0.62;
    const glisse = ease.in(prog(t, 0.5, 0.7)) * (t < 9.62 ? 1 : 0);
    const bas = mix(-0.97 + h, -0.05, glisse);
    const haut = bas - h;
    g.fillStyle = C.sable;
    g.beginPath();
    for (let u = haut; u <= bas; u += 0.01) g.lineTo(-demiLargeur(u) + 5, u * HAUT);
    for (let u = bas; u >= haut; u -= 0.01) g.lineTo(demiLargeur(u) - 5, u * HAUT);
    g.closePath();
    g.fill();
    // creux en entonnoir au-dessus du goulot
    g.beginPath();
    for (let u = 0.08; u <= 0.97; u += 0.01) g.lineTo(-demiLargeur(u) + 4, u * HAUT);
    for (let u = 0.97; u >= 0.08; u -= 0.01) g.lineTo(demiLargeur(u) - 4, u * HAUT);
    g.closePath();
    g.save();
    g.clip();
    const tas = vertical ? 30 + ecoule * 45 : 30;
    const grad = g.createLinearGradient(0, HAUT - tas, 0, HAUT);
    grad.addColorStop(0, '#F0D08A');
    grad.addColorStop(1, '#B8893F');
    g.fillStyle = grad;
    g.beginPath();
    g.moveTo(-LARG, HAUT);
    g.quadraticCurveTo(0, HAUT - tas * 2, LARG, HAUT);
    g.fill();
    g.restore();
    // Filet de sable par le goulot
    if (t > 0.45 && t < 3.5) {
      for (let k = 0; k < 90; k++) {
        const yy = ((t * 900 + k * 47) % (HAUT - tas * 0.6)) + 4;
        g.fillStyle = COL[k % 5];
        g.fillRect(Math.sin(k * 3.3 + t * 30) * 2.2 - 1.5, yy, 3, 3);
      }
    }
    // Verre : contour, reflets, réfraction (bandes claires/sombres)
    g.beginPath();
    for (let u = -1; u <= 1.0001; u += 0.01) g.lineTo(-demiLargeur(u), u * HAUT);
    for (let u = 1; u >= -1.0001; u -= 0.01) g.lineTo(demiLargeur(u), u * HAUT);
    g.closePath();
    const verre = g.createLinearGradient(-LARG, 0, LARG, 0);
    verre.addColorStop(0, 'rgba(255,230,190,0.16)');
    verre.addColorStop(0.18, 'rgba(255,255,255,0.03)');
    verre.addColorStop(0.75, 'rgba(255,255,255,0.02)');
    verre.addColorStop(0.92, 'rgba(255,220,170,0.22)');
    verre.addColorStop(1, 'rgba(255,255,255,0.05)');
    g.fillStyle = verre;
    g.fill();
    g.strokeStyle = 'rgba(255,236,200,0.55)';
    g.lineWidth = 4;
    g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.65)';
    g.lineWidth = 6;
    g.lineCap = 'round';
    g.beginPath();
    for (let u = -0.85; u <= -0.35; u += 0.02) g.lineTo(-demiLargeur(u) * 0.78, u * HAUT);
    g.stroke();
    g.beginPath();
    for (let u = 0.4; u <= 0.85; u += 0.02) g.lineTo(-demiLargeur(u) * 0.78, u * HAUT);
    g.stroke();
    // Montants et plateaux en bois
    for (const s of [-1, 1]) {
      const gb = g.createLinearGradient(0, s * HAUT, 0, s * (HAUT + 50));
      gb.addColorStop(0, '#8A6240');
      gb.addColorStop(1, '#4E331E');
      g.fillStyle = gb;
      g.beginPath();
      g.roundRect(-LARG - 50, s > 0 ? HAUT : -HAUT - 50, 2 * LARG + 100, 50, 12);
      g.fill();
      g.fillStyle = '#5E3F25';
      g.fillRect(s * (LARG + 22) - 9, -HAUT, 18, 2 * HAUT);
      g.fillStyle = 'rgba(255,210,150,0.35)';
      g.fillRect(s * (LARG + 22) - 9, -HAUT, 5, 2 * HAUT);
    }
    g.restore();
  }
  // ── Grains libres (texte, voiture, flèche) ──
  if (t > 1.1 && t < 9.75) {
    const alpha = t < 4.8 ? 1 : t < 5.1 ? 1 : 1;
    g.globalAlpha = t > 9.55 ? 1 - prog(t, 9.55, 9.75) : alpha;
    for (let i = 0; i < N; i++) {
      const p = grain(i, t, c);
      if (!p) continue;
      g.fillStyle = COL[i % 5];
      g.fillRect(p[0], p[1], 2.6, 2.6);
    }
    g.globalAlpha = 1;
  }
}

export const Pub18Sablier: React.FC = () => {
  const t = useT();
  const ref = useRef<HTMLCanvasElement>(null);
  const [cibles, setCibles] = useState<Cibles | null>(null);
  const [handle] = useState(() => delayRender('cibles du sable'));
  useLayoutEffect(() => {
    preparer().then((c) => {
      setCibles(c);
      continueRender(handle);
    });
  }, [handle]);
  useLayoutEffect(() => {
    const g = ref.current?.getContext('2d');
    if (g && cibles) dessiner(g, t, cibles);
  }, [t, cibles]);

  const titre = (txt: string, a: number, b: number, top: number, taille = 84) => {
    const v = prog(t, a, a + 0.3) * (1 - prog(t, b - 0.25, b));
    return v > 0 ? (
      <div style={{position: 'absolute', top, left: 120, right: 120, textAlign: 'center', fontFamily: P.serif, fontWeight: 700, fontSize: taille, lineHeight: 1.05, color: C.creme, opacity: v, transform: `translateY(${(1 - v) * 16}px)`, textShadow: '0 4px 30px rgba(0,0,0,0.6)'}}>
        {txt}
      </div>
    ) : null;
  };
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 20% 40%, #3A2A18 0%, ${C.fond} 60%)`}}>
      {/* Lumière chaude latérale */}
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(255,190,110,0.14), transparent 55%)'}} />
      <canvas ref={ref} width={1080} height={1920} style={{position: 'absolute', inset: 0}} />
      {titre('Le temps file…', -0.3, 1.5, 120, 100)}
      {titre('Reprends ton temps.', 6.4, 7.5, 1270, 96)}
      {titre(TARIFS.ecoConfortPromo, 7.5, 8.5, 1280, 64)}
      {t >= 8.45 && t < 9.95 ? (
        <div style={{opacity: 1 - prog(t, 9.7, 9.9)}}>
          <FinJP
            t={t}
            s={{police: P.serif, policeNumero: P.serif, poidsNumero: 700, couleur: C.creme, couleurNumero: C.sable, accent: C.sable, tailleNumero: 170, fleche: () => <div style={{width: 120, height: 120}} />}}
            p={(i) => prog(t, 8.5 + i * 0.1, 8.8 + i * 0.1)}
            haut={430}
            tailleTexte={66}
          />
        </div>
      ) : null}
      <Bande n={18} />
    </AbsoluteFill>
  );
};
