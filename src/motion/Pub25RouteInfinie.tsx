// 25. « La route infinie » — ruban de Möbius en forme de ∞, boucle parfaite (15 s).
// Rendu 3D maison dans un canevas : la route est une bande de Möbius (demi-tour de torsion par circuit) posée sur
// une lemniscate ; triangles texturés triés par profondeur. La voiture parcourt exactement 2 circuits en 15 s
// (une fois sur chaque face) : l'image 450 est identique à l'image 0.
import {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender} from 'remotion';
import {Bande, clamp, ease, FinJP, mix, prog, useT} from './commun';
import {POLICES_MOTION as P} from './config';

type V = [number, number, number];
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: V, k: number): V => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a: V): V => mul(a, 1 / Math.hypot(a[0], a[1], a[2]));
const lerpV = (a: V, b: V, k: number): V => [mix(a[0], b[0], k), mix(a[1], b[1], k), mix(a[2], b[2], k)];

const C = {ciel1: '#2A1B4A', ciel2: '#F2A65A', route: '#34353C', blanc: '#FFFFFF'};
const A = 34; // taille de la lemniscate
const HZ = 6; // écart vertical au croisement
const LARG = 4.6; // demi-largeur de la route
const VOIE = 1.15; // position latérale de la voiture
const DUREE = 15;
const N = 420; // segments par circuit
const PPU = 26; // pixels de texture par unité

// ── Ligne centrale (u ∈ [0, 2π)) et table des longueurs ──
const centre = (u: number): V => {
  const d = 1 + Math.sin(u) ** 2;
  return [(A * Math.cos(u)) / d, (A * Math.sin(u) * Math.cos(u)) / d, HZ * Math.sin(u)];
};
const TABLE = (() => {
  const n = 6000;
  const l = [0];
  for (let i = 1; i <= n; i++) {
    const a = centre(((i - 1) / n) * 2 * Math.PI);
    const b = centre((i / n) * 2 * Math.PI);
    l.push(l[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]));
  }
  return l;
})();
const LC = TABLE[TABLE.length - 1]; // longueur d'un circuit
const uDeL = (l: number) => {
  const ll = ((l % LC) + LC) % LC;
  let lo = 0;
  let hi = TABLE.length - 1;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (TABLE[m] <= ll) lo = m;
    else hi = m;
  }
  const k = (ll - TABLE[lo]) / (TABLE[hi] - TABLE[lo] || 1);
  return ((lo + k) / (TABLE.length - 1)) * 2 * Math.PI;
};

/** Repère de la route à l'abscisse curviligne l (l ∈ [0, 2·LC) : deux faces). */
const repere = (l: number) => {
  const u = uDeL(l);
  const p = centre(u);
  const T = unit(sub(centre(u + 1e-3), centre(u - 1e-3)));
  const N0 = unit(sub([0, 0, 1], mul(T, T[2])));
  const B0 = cross(T, N0);
  const phi = (Math.PI * l) / LC; // demi-tour de torsion par circuit
  const W = add(mul(B0, Math.cos(phi)), mul(N0, Math.sin(phi)));
  const Nr = add(mul(B0, -Math.sin(phi)), mul(N0, Math.cos(phi)));
  return {p, T, W, Nr};
};

// ── Mouvement de la voiture : vitesse qui augmente vers 9–11 s ; exactement 2 circuits en 15 s ──
const vitesseRel = (t: number) => 1 + 0.7 * Math.exp(-(((t - 10) / 1.3) ** 2));
const INTEG = (() => {
  const n = 3000;
  const arr = [0];
  for (let i = 1; i <= n; i++) arr.push(arr[i - 1] + vitesseRel(((i - 0.5) / n) * DUREE) * (DUREE / n));
  return arr;
})();
const distance = (t: number) => {
  const x = clamp(t / DUREE) * (INTEG.length - 1);
  const i = Math.min(INTEG.length - 2, Math.floor(x));
  const v = mix(INTEG[i], INTEG[i + 1], x - i);
  return (v / INTEG[INTEG.length - 1]) * 2 * LC;
};

// Marquages : t = instant où la voiture roule dessus (visibles devant elle ~1 s avant)
const MARQUAGES: {t: number; lignes: string[]}[] = [
  {t: 2.9, lignes: ['ÉCO', '2 500 F/h']},
  {t: 5.5, lignes: ['CONFORT', '3 500 F/h']},
  {t: 8.0, lignes: ['AÉROPORT', 'KRIBI', 'LIMBÉ']},
  {t: 10.3, lignes: ['TOUJOURS', "À L'HEURE"]},
];

const texture = () => {
  const L = Math.ceil(2 * LC * PPU);
  const H = Math.ceil(2 * LARG * PPU);
  const c = document.createElement('canvas');
  c.width = L;
  c.height = H;
  const g = c.getContext('2d')!;
  g.fillStyle = C.route;
  g.fillRect(0, 0, L, H);
  // grain d'asphalte
  for (let i = 0; i < L * 0.6; i++) {
    g.fillStyle = `rgba(255,255,255,${0.03 + (i % 7) * 0.006})`;
    g.fillRect((i * 97) % L, (i * 31) % H, 2, 2);
  }
  g.fillStyle = '#ECECEC';
  g.fillRect(0, 6, L, 6);
  g.fillRect(0, H - 12, L, 6);
  for (let x = 0; x < L; x += 90) g.fillRect(x, H / 2 - 3, 50, 6);
  // Mots peints : lettres étirées dans le sens de la marche (comme un vrai marquage)
  g.fillStyle = '#F5F5F0';
  for (const m of MARQUAGES) {
    const x0 = distance(m.t) * PPU;
    m.lignes.forEach((ligne, k) => {
      g.save();
      const x = x0 + 60 + (m.lignes.length - 1 - k) * 0 + k * 120;
      g.translate(x, H / 2);
      g.rotate(Math.PI / 2);
      let taille = 70;
      g.font = `700 ${taille}px "${P.grotesk}"`;
      const w = g.measureText(ligne).width;
      if (w > H * 0.86) taille *= (H * 0.86) / w;
      g.font = `700 ${taille}px "${P.grotesk}"`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.scale(1, 1.9);
      g.fillText(ligne, 0, 0);
      g.restore();
    });
  }
  return c;
};

type Cam = {eye: V; fwd: V; right: V; up: V};
const camera = (eye: V, cible: V, haut: V): Cam => {
  const fwd = unit(sub(cible, eye));
  const right = unit(cross(fwd, haut));
  const up = cross(right, fwd);
  return {eye, fwd, right, up};
};
const F = 980;
const CX = 540;
let CY = 1010;
const projeter = (cam: Cam, p: V) => {
  const d = sub(p, cam.eye);
  const z = dot(d, cam.fwd);
  return {x: CX + (F * dot(d, cam.right)) / z, y: CY - (F * dot(d, cam.up)) / z, z};
};

const chase = (d: number) => {
  const r = repere(d);
  const voiture = add(r.p, mul(r.W, VOIE));
  const derriere = repere(d - 4);
  const eye = add(add(add(derriere.p, mul(derriere.W, VOIE)), mul(r.T, -5)), mul(r.Nr, 3.6));
  const cible = add(add(voiture, mul(r.T, 7)), mul(r.Nr, 0.4));
  return {eye, cible, haut: r.Nr};
};
const LOIN = {eye: [0, -40, 95] as V, cible: [0, 3, 0] as V, haut: [0, 1, 0] as V};

function dessiner(g: CanvasRenderingContext2D, t: number, tex: HTMLCanvasElement) {
  const d = distance(t);
  // Caméra : poursuite, puis vue d'ensemble (11–14,67 s), puis retour exact à la poursuite
  const k = ease.inOut(prog(t, 10.9, 11.9)) * (1 - ease.inOut(prog(t, 14.62, 15)));
  const ch = chase(d);
  CY = mix(1010, 500, k);
  const cam = camera(lerpV(ch.eye, LOIN.eye, k), lerpV(ch.cible, LOIN.cible, k), unit(lerpV(ch.haut, LOIN.haut, k)));

  // Ciel : dégradé orienté selon le roulis de la caméra
  const roulis = Math.atan2(dot([0, 0, 1], cam.right), dot([0, 0, 1], cam.up));
  g.save();
  g.translate(540, 960);
  g.rotate(roulis);
  const ciel = g.createLinearGradient(0, -1400, 0, 1400);
  ciel.addColorStop(0, C.ciel1);
  ciel.addColorStop(0.55, '#8A4E78');
  ciel.addColorStop(1, C.ciel2);
  g.fillStyle = ciel;
  g.fillRect(-1600, -1600, 3200, 3200);
  const soleil = g.createRadialGradient(0, 700, 0, 0, 700, 700);
  soleil.addColorStop(0, 'rgba(255,214,150,0.9)');
  soleil.addColorStop(1, 'rgba(255,214,150,0)');
  g.fillStyle = soleil;
  g.fillRect(-1600, -100, 3200, 1700);
  g.restore();

  // ── Triangles de la route (une seule géométrie ; la face visible choisit la texture) ──
  const tris: {z: number; dessin: () => void}[] = [];
  const TW = tex.width;
  const TH = tex.height;
  const pts: {s: number; bords: [V, V]; n: V}[] = [];
  for (let i = 0; i <= N; i++) {
    const l = (i / N) * LC;
    const r = repere(l);
    pts.push({s: l, bords: [add(r.p, mul(r.W, -LARG)), add(r.p, mul(r.W, LARG))], n: r.Nr});
  }
  const SOUS = 3;
  for (let i = 0; i < N; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const m = mul(add(add(a.bords[0], a.bords[1]), add(b.bords[0], b.bords[1])), 0.25);
    const pm = projeter(cam, m);
    if (pm.z < 0.5) continue;
    const faceA = dot(a.n, sub(cam.eye, m)) > 0;
    // coordonnées de texture : face A = l ∈ [0, LC), face B = l + LC avec v inversé
    const xa = ((faceA ? a.s : a.s + LC) * PPU) % TW;
    let xb = ((faceA ? b.s : b.s + LC) * PPU) % TW;
    if (xb < xa) xb += TW;
    for (let j = 0; j < SOUS; j++) {
      const v0 = j / SOUS;
      const v1 = (j + 1) / SOUS;
      const q = [lerpV(a.bords[0], a.bords[1], v0), lerpV(a.bords[0], a.bords[1], v1), lerpV(b.bords[0], b.bords[1], v1), lerpV(b.bords[0], b.bords[1], v0)].map((p) => projeter(cam, p));
      if (q.some((p) => p.z < 0.3)) continue;
      const ty = (v: number) => (faceA ? v : 1 - v) * TH;
      const src = [
        [xa, ty(v0)],
        [xa, ty(v1)],
        [xb, ty(v1)],
        [xb, ty(v0)],
      ];
      const z = (q[0].z + q[1].z + q[2].z + q[3].z) / 4;
      tris.push({
        z,
        dessin: () => {
          triangle(g, tex, src[0], src[1], src[2], q[0], q[1], q[2]);
          triangle(g, tex, src[0], src[2], src[3], q[0], q[2], q[3]);
        },
      });
    }
    // Tranche du ruban (épaisseur) visible de loin
    tris.push({
      z: pm.z + 0.01,
      dessin: () => {
        const e = [a.bords[1], b.bords[1]].map((p) => projeter(cam, p));
        if (e[0].z < 1 || e[1].z < 1) return;
        g.strokeStyle = 'rgba(255,220,180,0.35)';
        g.lineWidth = Math.min(5, Math.max(1, 160 / pm.z));
        g.beginPath();
        g.moveTo(e[0].x, e[0].y);
        g.lineTo(e[1].x, e[1].y);
        g.stroke();
      },
    });
  }

  // ── Voiture (boîte noire, vitres, phares blancs, feux ambre) ──
  const r = repere(d);
  const base = add(r.p, mul(r.W, VOIE));
  const coin = (av: number, lat: number, h: number): V => add(add(add(base, mul(r.T, av)), mul(r.W, lat)), mul(r.Nr, h));
  const boite = (l0: number, l1: number, w: number, h0: number, h1: number, couleurs: [string, string, string]) => {
    const faces: [V[], string][] = [
      [[coin(l0, -w, h1), coin(l1, -w, h1), coin(l1, w, h1), coin(l0, w, h1)], couleurs[0]],
      [[coin(l0, -w, h0), coin(l0, w, h0), coin(l0, w, h1), coin(l0, -w, h1)], couleurs[1]],
      [[coin(l1, -w, h0), coin(l1, w, h0), coin(l1, w, h1), coin(l1, -w, h1)], couleurs[1]],
      [[coin(l0, -w, h0), coin(l1, -w, h0), coin(l1, -w, h1), coin(l0, -w, h1)], couleurs[2]],
      [[coin(l0, w, h0), coin(l1, w, h0), coin(l1, w, h1), coin(l0, w, h1)], couleurs[2]],
    ];
    for (const [poly, col] of faces) {
      const q = poly.map((p) => projeter(cam, p));
      if (q.some((p) => p.z < 0.3)) continue;
      const z = Math.max(...q.map((p) => p.z)) - 0.05;
      tris.push({z, dessin: () => polygone(g, q, col)});
    }
  };
  boite(-1.25, 1.25, 0.62, 0.05, 0.62, ['#1A1B20', '#0E0F12', '#16171B']);
  boite(-0.75, 0.55, 0.55, 0.62, 1.05, ['#20232B', '#3B4A66', '#2E3A52']);
  // feux
  for (const lat of [-0.45, 0.45]) {
    const arr = projeter(cam, coin(-1.27, lat, 0.4));
    const av = projeter(cam, coin(1.27, lat, 0.4));
    if (arr.z > 0.3) tris.push({z: arr.z - 0.2, dessin: () => lueur(g, arr.x, arr.y, 520 / arr.z, 'rgba(255,170,60,0.9)')});
    if (av.z > 0.3) tris.push({z: av.z - 0.2, dessin: () => lueur(g, av.x, av.y, 700 / av.z, 'rgba(255,255,235,0.95)')});
  }
  tris.sort((x, y) => y.z - x.z);
  for (const tr of tris) tr.dessin();
}

const polygone = (g: CanvasRenderingContext2D, q: {x: number; y: number}[], col: string) => {
  g.fillStyle = col;
  g.beginPath();
  q.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
  g.closePath();
  g.fill();
};
const lueur = (g: CanvasRenderingContext2D, x: number, y: number, r: number, col: string) => {
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, col);
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr;
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
};
/** Triangle texturé (transformation affine source → écran, découpé par le triangle). */
const triangle = (g: CanvasRenderingContext2D, img: HTMLCanvasElement, s0: number[], s1: number[], s2: number[], d0: {x: number; y: number}, d1: {x: number; y: number}, d2: {x: number; y: number}) => {
  const [x0, y0] = s0;
  const [x1, y1] = s1;
  const [x2, y2] = s2;
  const det = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
  if (Math.abs(det) < 1e-6) return;
  const a = ((d1.x - d0.x) * (y2 - y0) - (d2.x - d0.x) * (y1 - y0)) / det;
  const b = ((d1.y - d0.y) * (y2 - y0) - (d2.y - d0.y) * (y1 - y0)) / det;
  const c = ((d2.x - d0.x) * (x1 - x0) - (d1.x - d0.x) * (x2 - x0)) / det;
  const d = ((d2.y - d0.y) * (x1 - x0) - (d1.y - d0.y) * (x2 - x0)) / det;
  const e = d0.x - a * x0 - c * y0;
  const f = d0.y - b * x0 - d * y0;
  g.save();
  g.beginPath();
  // léger débord pour éviter les fentes entre triangles
  const cx = (d0.x + d1.x + d2.x) / 3;
  const cy = (d0.y + d1.y + d2.y) / 3;
  const ex = (p: {x: number; y: number}) => [p.x + Math.sign(p.x - cx) * 0.8, p.y + Math.sign(p.y - cy) * 0.8];
  const [p0, p1, p2] = [ex(d0), ex(d1), ex(d2)];
  g.moveTo(p0[0], p0[1]);
  g.lineTo(p1[0], p1[1]);
  g.lineTo(p2[0], p2[1]);
  g.closePath();
  g.clip();
  g.setTransform(a, b, c, d, e, f);
  g.drawImage(img, 0, 0);
  g.restore();
};

export const Pub25RouteInfinie: React.FC = () => {
  const t = useT();
  const ref = useRef<HTMLCanvasElement>(null);
  const [tex, setTex] = useState<HTMLCanvasElement | null>(null);
  const [handle] = useState(() => delayRender('texture de la route'));
  useLayoutEffect(() => {
    document.fonts.load(`700 70px "${P.grotesk}"`).then(() => {
      setTex(texture());
      continueRender(handle);
    });
  }, [handle]);
  useLayoutEffect(() => {
    const g = ref.current?.getContext('2d');
    if (g && tex) {
      g.setTransform(1, 0, 0, 1, 0, 0);
      dessiner(g, t, tex);
    }
  }, [t, tex]);
  const cta = clamp((t - 11.3) / 0.4) * (1 - clamp((t - 14.45) / 0.2));
  const hook = t < 1.5 ? 1 - prog(t, 1.25, 1.5) : prog(t, 14.67, 15);
  return (
    <AbsoluteFill style={{background: C.ciel1}}>
      <canvas ref={ref} width={1080} height={1920} style={{position: 'absolute', inset: 0}} />
      {/* Grain chaud et vignettage */}
      <AbsoluteFill style={{boxShadow: 'inset 0 0 260px rgba(20,8,40,0.6)'}} />
      {hook > 0 ? (
        <div style={{position: 'absolute', top: 220, left: 120, right: 120, textAlign: 'center', fontFamily: P.grotesk, fontWeight: 700, fontSize: 92, lineHeight: 1.05, color: '#fff', textShadow: '0 6px 30px rgba(20,8,40,0.6)', opacity: hook}}>
          Regarde jusqu&apos;au bout.
        </div>
      ) : null}
      {cta > 0 ? (
        <AbsoluteFill style={{opacity: cta}}>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 38%, rgba(20,10,40,0.55) 50%, rgba(20,10,40,0.55) 85%, transparent)'}} />
          <FinJP
            t={t}
            s={{police: P.grotesk, couleur: '#fff', couleurNumero: '#fff', accent: C.ciel2, tailleNumero: 150, ombre: '0 6px 30px rgba(20,8,40,0.7)'}}
            p={(i) => prog(t, 11.4 + i * 0.12, 11.75 + i * 0.12)}
            haut={880}
          />
        </AbsoluteFill>
      ) : null}
      <Bande n={25} />
    </AbsoluteFill>
  );
};
