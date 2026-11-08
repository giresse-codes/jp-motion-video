// 11. « GAME OVER ? » — jeu vidéo 8-bit (12 s).
// Tout est dessiné dans un canevas 216 × 384 agrandi ×5 sans lissage : pixels nets, mise à l'échelle entière.
// Le texte est binarisé (aucun pixel gris d'anticrénelage). Animation à 15 images/s, comme une vraie console.
import {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender} from 'remotion';
import {Bande, LogoJP, saccade, useT} from './commun';
import {MOTION, POLICES_MOTION} from './config';

const W = 216;
const H = 384;
const K = 5;
const C = {fond: '#10142B', fond2: '#1A2148', blanc: '#F4F4F4', jaune: '#FFD23F', vert: '#4BE37A', cyan: '#3DD6F5', ombre: '#070915', gris: '#5A6488'};
const POLICE = POLICES_MOTION.pixel;

// Sprites : une lettre par pixel ('.' = transparent).
const VOITURE = [
  '......WWWWWWWWWWWW..........',
  '.....WCCCCCWCCCCCCW.........',
  '....WCCCCCCWCCCCCCCW........',
  'WWWWWWWWWWWWWWWWWWWWWWWW....',
  'WKKKKKKKKKKKKKKKKKKKKKKKWW..',
  'WKKKKKKKKKKKKKKKKKKKKKKKKKWY',
  'WKKKKKKKKKKKKKKKKKKKKKKKKKKW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  '...WWWW............WWWW.....',
  '..WGKKGW..........WGKKGW....',
  '...WWWW............WWWW.....',
];
const BOUCHON = [
  '....GGGGGGGG..........',
  '...GSSSSGSSSG.........',
  'GGGGGGGGGGGGGGGGGGGG..',
  'GOOOOOOOOOOOOOOOOOOOGG',
  'GOOOOOOOOOOOOOOOOOOOOG',
  'GGGGGGGGGGGGGGGGGGGGGG',
  '..GGG...........GGG...',
];
const MAIN = [
  '...WW.....',
  '..WBBW....',
  '..WBBW....',
  '..WBBWWW..',
  '..WBBWBBWW',
  'WWWBBWBBWBW',
  'WBWBBBBBBBW',
  'WBBBBBBBBBW',
  '.WBBBBBBBW.',
  '..WBBBBBBW.',
  '...WWWWWW..',
];
const COCHE = ['.......V', '......VV', 'V....VV.', 'VV..VV..', '.VVVV...', '..VV....'];
const PIECE = ['..JJJJJ..', '.JJJJJJJ.', 'JJJJJJJWJ', 'JJJJJJWJJ', 'JWJJJWJJJ', 'JJWJWJJJJ', 'JJJWJJJJJ', '.JJJJJJJ.', '..JJJJJ..'];
const PAL: Record<string, string> = {W: C.blanc, C: C.cyan, K: C.ombre, Y: C.jaune, G: C.gris, S: '#8FA0C8', O: '#38406A', B: C.blanc, J: C.jaune, V: C.vert};

const SERVICES = [
  {nom: 'ÉCO', prix: '2 500 F/h', stats: [3, 2, 2]},
  {nom: 'CONFORT', prix: '3 500 F/h', stats: [4, 5, 5]},
  {nom: 'AÉROPORT', prix: 'dès 8000 F', stats: [4, 3, 3]},
  {nom: 'VOYAGE', prix: '50 000 F/j', stats: [5, 4, 4]},
];
const STATS_CONFORT = ['Wi-Fi', 'Clim', 'Mini écran'];

type Ctx = CanvasRenderingContext2D;
const cache = new Map<string, HTMLCanvasElement>();

/** Texte pixel binarisé, mis en cache. */
const glyphe = (txt: string, taille: number, couleur: string) => {
  const cle = `${txt}|${taille}|${couleur}`;
  const deja = cache.get(cle);
  if (deja) return deja;
  const m = document.createElement('canvas').getContext('2d')!;
  m.font = `${taille}px "${POLICE}"`;
  const l = Math.ceil(m.measureText(txt).width) + 2;
  const c = document.createElement('canvas');
  c.width = l;
  c.height = taille + 4;
  const g = c.getContext('2d')!;
  g.font = `${taille}px "${POLICE}"`;
  g.textBaseline = 'top';
  g.fillStyle = '#fff';
  g.fillText(txt, 1, 1);
  const img = g.getImageData(0, 0, c.width, c.height);
  const [r, v, b] = [1, 3, 5].map((i) => parseInt(couleur.slice(i, i + 2), 16));
  for (let i = 0; i < img.data.length; i += 4) {
    const plein = img.data[i + 3] > 110;
    img.data[i] = r;
    img.data[i + 1] = v;
    img.data[i + 2] = b;
    img.data[i + 3] = plein ? 255 : 0;
  }
  g.putImageData(img, 0, 0);
  cache.set(cle, c);
  return c;
};

const texte = (ctx: Ctx, txt: string, x: number, y: number, taille: number, couleur: string, align: 'g' | 'c' = 'c', ombre = true) => {
  const g = glyphe(txt, taille, couleur);
  const gx = Math.round(align === 'c' ? x - g.width / 2 : x);
  if (ombre) ctx.drawImage(glyphe(txt, taille, C.ombre), gx + Math.max(1, taille / 8), Math.round(y) + Math.max(1, taille / 8));
  ctx.drawImage(g, gx, Math.round(y));
};

const sprite = (ctx: Ctx, carte: string[], x: number, y: number, retourne = false, echelle = 1) => {
  carte.forEach((ligne, j) => {
    [...ligne].forEach((ch, i) => {
      if (ch === '.') return;
      ctx.fillStyle = PAL[ch];
      const jj = retourne ? carte.length - 1 - j : j;
      ctx.fillRect(Math.round(x) + i * echelle, Math.round(y) + jj * echelle, echelle, echelle);
    });
  });
};

const rect = (ctx: Ctx, x: number, y: number, l: number, h: number, c: string) => {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(l), Math.round(h));
};
const cadre = (ctx: Ctx, x: number, y: number, l: number, h: number, c: string, e = 2) => {
  rect(ctx, x, y, l, e, c);
  rect(ctx, x, y + h - e, l, e, c);
  rect(ctx, x, y, e, h, c);
  rect(ctx, x + l - e, y, e, h, c);
};
const etoiles = (ctx: Ctx, t: number) => {
  for (let i = 0; i < 40; i++) {
    const x = (i * 53) % W;
    const y = (i * 97) % (H - 60);
    if ((Math.floor(t * 4) + i) % 5 !== 0) rect(ctx, x, y, 1, 1, i % 3 ? C.gris : C.cyan);
  }
};

const gameOver = (ctx: Ctx, t: number, avecQuestion: boolean) => {
  etoiles(ctx, t);
  const clign = Math.floor(t * 6) % 4 !== 3;
  if (clign) {
    texte(ctx, 'GAME', W / 2, 108, 32, C.blanc);
    texte(ctx, 'OVER', W / 2, 146, 32, C.blanc);
  }
  rect(ctx, 40, 190, W - 80, 2, C.cyan);
  if (avecQuestion) texte(ctx, 'Tu conduis', W / 2, 206, 12, C.jaune);
  if (avecQuestion) texte(ctx, 'encore ?', W / 2, 224, 12, C.jaune);
};

function dessiner(ctx: Ctx, tReel: number) {
  const t = saccade(tReel, 15);
  rect(ctx, 0, 0, W, H, C.fond);

  // ── HOOK 0 – 1,5 s ──
  if (t < 1.5) {
    gameOver(ctx, t, t >= 0.1);
    texte(ctx, '- PRESS START -', W / 2, 270, 8, Math.floor(t * 3) % 2 ? C.gris : C.cyan, 'c', false);
    return;
  }
  // ── 1 : CONTINUE ? 1,5 – 3 s ──
  if (t < 3) {
    etoiles(ctx, t);
    texte(ctx, 'CONTINUE ?', W / 2, 84, 16, C.blanc);
    const n = t < 2.0 ? '3' : t < 2.5 ? '2' : '1';
    const pulse = ((t - 1.5) % 0.5) < 0.12 ? 48 : 40;
    texte(ctx, n, W / 2, 126 + (48 - pulse) / 2, pulse, C.jaune);
    const appui = t >= 2.6;
    // Boutons OUI / NON
    rect(ctx, 30, 200, 70, 28, appui && Math.floor(t * 10) % 2 ? C.vert : C.fond2);
    cadre(ctx, 30, 200, 70, 28, C.vert);
    texte(ctx, 'OUI', 65, 210, 8, appui ? C.ombre : C.vert, 'c', false);
    rect(ctx, 116, 200, 70, 28, C.fond2);
    cadre(ctx, 116, 200, 70, 28, C.gris);
    texte(ctx, 'NON', 151, 210, 8, C.gris, 'c', false);
    // Main-curseur qui glisse vers OUI puis appuie
    const a = Math.min(1, (t - 1.7) / 0.8);
    const mx = 150 - Math.max(0, a) * 88;
    const my = 260 - Math.max(0, a) * 36 + (appui ? 2 : 0);
    sprite(ctx, MAIN, mx, my);
    if (appui) texte(ctx, 'OK !', 65, 176, 8, C.vert, 'c');
    return;
  }
  // ── 2 : CHOISIS TON VÉHICULE 3 – 7 s ──
  if (t < 7) {
    texte(ctx, 'CHOISIS TON', W / 2, 26, 12, C.blanc);
    texte(ctx, 'VÉHICULE', W / 2, 44, 12, C.jaune);
    // Curseur : descend carte par carte puis s'arrête sur CONFORT
    const choix = t < 4.5 ? Math.min(3, Math.floor((t - 3.2) / 0.3)) : t < 5.0 ? 2 - Math.floor((t - 4.5) / 0.25) : 1;
    SERVICES.forEach((s, i) => {
      const y = 68 + i * 44;
      const allume = t >= 3.2 + i * 0.3;
      if (!allume) {
        cadre(ctx, 24, y, 168, 38, C.fond2);
        return;
      }
      const sel = i === Math.max(0, choix);
      const fixe = t >= 5.0 && i === 1;
      rect(ctx, 24, y, 168, 38, sel ? '#1F2A5E' : C.fond2);
      cadre(ctx, 24, y, 168, 38, fixe ? (Math.floor(t * 8) % 2 ? C.jaune : C.blanc) : sel ? C.cyan : C.gris);
      texte(ctx, s.nom, 32, y + 6, 8, sel ? C.jaune : C.blanc, 'g', false);
      const gp = glyphe(s.prix, 8, C.vert);
      ctx.drawImage(gp, 186 - gp.width, y + 6);
      s.stats.forEach((v, k) => {
        const max = fixe ? 5 : v;
        for (let q = 0; q < 5; q++) rect(ctx, 32 + k * 52 + q * 9, y + 24, 7, 6, q < max ? [C.vert, C.cyan, C.jaune][k] : '#2A3360');
      });
      if (sel) texte(ctx, '>', 14, y + 15, 8, C.jaune, 'g', false);
    });
    // Stats de CONFORT qui montent au maximum
    if (t >= 5.0) {
      const y0 = 250;
      cadre(ctx, 18, y0, 180, 74, C.cyan);
      rect(ctx, 20, y0 + 2, 176, 70, '#141A3C');
      STATS_CONFORT.forEach((nom, k) => {
        const yy = y0 + 10 + k * 21;
        texte(ctx, nom, 26, yy, 8, C.blanc, 'g', false);
        const plein = Math.max(0, Math.min(8, Math.floor((t - 5.2 - k * 0.35) * 12)));
        for (let q = 0; q < 8; q++) rect(ctx, 114 + q * 9, yy - 1, 7, 9, q < plein ? (plein === 8 ? C.jaune : C.vert) : '#2A3360');
        if (plein === 8 && Math.floor(t * 6) % 2) texte(ctx, 'MAX', 150, yy + 10, 8, C.jaune, 'c', false);
      });
    }
    return;
  }
  // ── 3 : niveau en défilement 7 – 9,5 s ──
  if (t < 9.5) {
    const d = (t - 7) * 110; // défilement du monde
    rect(ctx, 0, 0, W, 300, C.fond);
    etoiles(ctx, t);
    // Ville de Douala en pixels (deux plans de parallaxe)
    for (let i = -1; i < 14; i++) {
      const x = i * 26 - ((d * 0.3) % 26);
      const h = 50 + ((i * 37 + Math.floor((d * 0.3) / 26) * 37) % 60);
      const hh = 50 + (Math.abs(i + Math.floor((d * 0.3) / 26)) * 41) % 70;
      rect(ctx, x, 240 - hh, 22, hh, '#1D2552');
      for (let f = 0; f < hh - 10; f += 9) for (let c = 0; c < 3; c++) if ((i + f + c) % 3) rect(ctx, x + 4 + c * 6, 248 - hh + f, 3, 4, '#3B4A8C');
      void h;
    }
    for (let i = -1; i < 10; i++) {
      const x = i * 30 - (d % 30);
      rect(ctx, x + 12, 236, 4, 30, '#2E7D4F');
      rect(ctx, x + 6, 230, 16, 6, C.vert);
    }
    // Route
    rect(ctx, 0, 266, W, 44, '#262B45');
    for (let i = -1; i < 12; i++) rect(ctx, i * 24 - (d % 24), 286, 12, 3, C.blanc);
    rect(ctx, 0, 310, W, 4, C.vert);
    rect(ctx, 0, 314, W, 70, '#0B0E20');
    // Bouchon à sauter (monde x = 200)
    const xb = 126 - d;
    sprite(ctx, BOUCHON, xb, 254, false, 2);
    sprite(ctx, BOUCHON, xb + 46, 254, false, 2);
    texte(ctx, 'BOUCHON', xb + 45, 228, 8, C.blanc, 'c');
    // Saut de la voiture entre 7,8 et 8,5 s
    const sp = (t - 7.6) / 0.9;
    const saut = sp > 0 && sp < 1 ? Math.sin(sp * Math.PI) * 70 : 0;
    const roue = Math.floor(t * 15) % 2;
    const v = VOITURE.map((l, j) => (j === 9 && roue ? l.replace(/GKKG/g, 'KGGK') : l));
    sprite(ctx, v, 24, 262 - saut, false, 2);
    // Pièces « À L'HEURE »
    [7.45, 8.3, 9.0].forEach((tc, k) => {
      const xp = 60 + (tc - t) * 110;
      const yp = k === 1 ? 176 : 236;
      if (t < tc) sprite(ctx, PIECE, xp, yp + (Math.floor(t * 8) % 2), false, 2);
      else if (t < tc + 0.6) {
        const yy = yp - (t - tc) * 40;
        texte(ctx, "À L'HEURE", 116, yy, 8, C.vert);
        sprite(ctx, COCHE, 66, yy, false, 1);
      }
    });
    // HUD
    const pieces = [7.45, 8.3, 9.0].filter((tc) => t >= tc).length;
    texte(ctx, `SCORE ${String(pieces * 100 + Math.floor((t - 7) * 40) * 10).padStart(6, '0')}`, 12, 18, 8, C.blanc, 'g');
    sprite(ctx, PIECE, 150, 16);
    texte(ctx, `x${pieces}`, 164, 18, 8, C.jaune, 'g');
    texte(ctx, 'NIVEAU : DOUALA', W / 2, 40, 8, C.cyan);
    return;
  }
  // ── 4 : fin qui renvoie 9,5 – 12 s ──
  if (t >= 11.75) {
    gameOver(ctx, t, true);
    return;
  }
  etoiles(ctx, t);
  const tf = t - 9.5;
  const couleurs = [C.jaune, C.vert, C.cyan, C.blanc];
  if (tf < 0.5) {
    texte(ctx, 'LEVEL', W / 2, 140, 24, couleurs[Math.floor(t * 10) % 4]);
    texte(ctx, 'COMPLETE !', W / 2, 172, 16, couleurs[(Math.floor(t * 10) + 1) % 4]);
    return;
  }
  texte(ctx, 'LEVEL COMPLETE !', W / 2, 34, 8, couleurs[Math.floor(t * 6) % 4]);
  if (tf >= 0.5) {
    texte(ctx, 'Écris « JP »', W / 2, 66, 12, C.blanc);
    texte(ctx, 'sur WhatsApp', W / 2, 84, 12, C.blanc);
  }
  if (tf >= 0.7) {
    texte(ctx, MOTION.indicatif, W / 2, 112, 8, C.jaune);
    texte(ctx, '655 394 028', W / 2, 126, 16, C.jaune);
    if (Math.floor(t * 4) % 2) cadre(ctx, 10, 104, W - 20, 44, C.jaune, 1);
  }
  if (tf >= 0.9 && Math.floor(t * 5) % 3 !== 2) {
    // Flèche pixel qui clignote vers le bas
    const y = 160 + (Math.floor(t * 5) % 2) * 4;
    rect(ctx, W / 2 - 4, y, 8, 18, C.vert);
    for (let i = 0; i < 10; i++) rect(ctx, W / 2 - 13 + i, y + 16 + i, 26 - 2 * i, 1, C.vert);
  }
  if (tf >= 1.0) {
    texte(ctx, 'Réserve', W / 2 - 10, 206, 12, C.blanc);
    texte(ctx, 'maintenant', W / 2 - 10, 224, 12, C.blanc);
    // 👇 en emoji dessiné à 16 px puis agrandi ×5 : il devient pixel art comme le reste
    ctx.font = '16px "Noto Color Emoji"';
    ctx.textBaseline = 'top';
    ctx.fillText('👇', 172, 212 + (Math.floor(t * 5) % 2) * 3);
  }
}

export const Pub11GameOver: React.FC = () => {
  const t = useT();
  const ref = useRef<HTMLCanvasElement>(null);
  const [pret, setPret] = useState(false);
  const [handle] = useState(() => delayRender('police pixel'));
  useLayoutEffect(() => {
    document.fonts.load(`8px "${POLICE}"`).then(() => {
      setPret(true);
      continueRender(handle);
    });
  }, [handle]);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx || !pret) return;
    ctx.imageSmoothingEnabled = false;
    dessiner(ctx, t);
  }, [t, pret]);

  // Scintillement d'allumage de l'écran cathodique (hook et retour au GAME OVER)
  const flicker = t < 0.25 ? (Math.floor(t * 30) % 2 ? 1.35 : 0.8) : 1;
  const tf = t - 9.5;
  return (
    <AbsoluteFill style={{background: '#05060D'}}>
      <canvas
        ref={ref}
        width={W}
        height={H}
        style={{width: W * K, height: H * K, imageRendering: 'pixelated', filter: `brightness(${flicker})`}}
      />
      {/* Logo JP, en petit, sur l'écran final */}
      {tf >= 1.1 && t < 11.75 ? (
        <div style={{position: 'absolute', top: 1268, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <LogoJP largeur={300} />
        </div>
      ) : null}
      {/* Scanlines alignées sur la grille de pixels + arrondi d'écran cathodique */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) ${K - 1.5}px, rgba(0,0,0,0.28) ${K - 1.5}px, rgba(0,0,0,0.28) ${K}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          borderRadius: 70,
          boxShadow: 'inset 0 0 140px 30px rgba(0,0,0,0.75), inset 0 0 0 18px #05060D',
          background: 'radial-gradient(ellipse at 50% 45%, rgba(61,214,245,0.07), rgba(0,0,0,0) 60%)',
        }}
      />
      <Bande n={11} />
    </AbsoluteFill>
  );
};
