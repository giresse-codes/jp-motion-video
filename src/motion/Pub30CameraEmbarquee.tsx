// 30. « Caméra embarquée » — trajet de nuit vu du pare-brise, interface de caméra (18 s). Aucun visage, aucun personnage.
// La route est dessinée en perspective dans un canevas (lampadaires, immeubles éclairés, bokeh) ; l'interface est en DOM.
import {useLayoutEffect, useRef} from 'react';
import type {CSSProperties} from 'react';
import {AbsoluteFill} from 'remotion';
import {Bande, clamp, ease, FinJP, hasard, mix, prog, useT, visibleJusqua} from './commun';
import {POLICES_MOTION as P, TARIFS} from './config';

const C = {nuit: '#0B1022', ambre: '#F4B860', blanc: '#FFFFFF'};
const F = 900;
const HORIZON = 900;

/** Vitesse (m/s) : 14 m/s, ralentit jusqu'à l'arrêt (8 – 10,3 s), repart pour la boucle (13,5 – 18 s). */
const vitesse = (t: number) => (t < 8 ? 14 : t < 10.3 ? 14 * (1 - ease.inOut(prog(t, 8, 10.3))) : t < 13.5 ? 0 : 14 * ease.inOut(prog(t, 13.5, 15.5)));
const DIST = (() => {
  const n = 1800;
  const a = [0];
  for (let i = 1; i <= n; i++) a.push(a[i - 1] + vitesse(((i - 0.5) / n) * 18) * (18 / n));
  return a;
})();
const distance = (t: number) => {
  const x = clamp(t / 18) * (DIST.length - 1);
  const i = Math.min(DIST.length - 2, Math.floor(x));
  return mix(DIST[i], DIST[i + 1], x - i);
};
/** Courbure : virage à gauche entre 5 et 8 s. */
const courbure = (t: number) => Math.sin(prog(t, 5, 8) * Math.PI) * 0.0022;
const ARRET = distance(10.3) + 22; // l'entrée éclairée est à 22 m devant l'arrêt

function dessiner(g: CanvasRenderingContext2D, t: number) {
  const D = distance(t);
  const k = courbure(t);
  const roulis = -k * 2600; // degrés
  const vib = vitesse(t) > 1 ? (hasard(Math.floor(t * 30)) - 0.5) * 3 : 0;
  g.save();
  g.clearRect(0, 0, 1080, 1920);
  g.translate(540, HORIZON + vib);
  g.rotate((roulis * Math.PI) / 180);
  g.translate(-540, -HORIZON);
  // Ciel nocturne et lueur de la ville
  const ciel = g.createLinearGradient(0, -400, 0, HORIZON);
  ciel.addColorStop(0, '#05081A');
  ciel.addColorStop(1, '#22284A');
  g.fillStyle = ciel;
  g.fillRect(-400, -400, 1880, HORIZON + 400);
  const sol = g.createLinearGradient(0, HORIZON, 0, 2300);
  sol.addColorStop(0, '#141829');
  sol.addColorStop(1, '#07090F');
  g.fillStyle = sol;
  g.fillRect(-400, HORIZON, 1880, 1800);

  const proj = (x: number, y: number, z: number) => {
    const xr = x + k * z * z; // la route se courbe
    return {x: 540 + (F * xr) / z, y: HORIZON + (F * (1.25 - y)) / z, s: F / z};
  };
  // Immeubles éclairés (de loin à près)
  for (let z = 140; z > 4; z -= 1) {
    const idx = Math.floor((D + z) / 9);
    if ((D + z) % 9 > 1) continue;
    for (const cote of [-1, 1]) {
      const h = 8 + hasard(idx * 3 + (cote > 0 ? 1 : 0)) * 22;
      const x = cote * (9 + hasard(idx + 7) * 3);
      const a = proj(x, 0, z);
      const b = proj(x, h, z);
      const l = 8 * a.s;
      g.fillStyle = '#0D1124';
      g.fillRect(cote > 0 ? a.x : a.x - l, b.y, l, a.y - b.y);
      for (let wy = 1; wy < h - 1; wy += 2.2) {
        for (let wx = 0; wx < 3; wx++) {
          if (hasard(idx * 31 + wy * 7 + wx + cote) > 0.55) {
            const p = proj(x + cote * (0.8 + wx * 2.4), wy, z);
            g.fillStyle = hasard(idx + wy + wx) > 0.3 ? 'rgba(244,184,96,0.85)' : 'rgba(220,230,255,0.7)';
            g.fillRect(p.x, p.y - 1.2 * p.s, 1.3 * p.s, 1.1 * p.s);
          }
        }
      }
    }
  }
  // Entrée éclairée de l'arrivée (à droite)
  const zE = ARRET - D;
  if (zE > 3 && zE < 160) {
    const a = proj(7.5, 0, zE);
    const b = proj(7.5, 6, zE);
    const l = 12 * a.s;
    g.fillStyle = '#1A1F38';
    g.fillRect(a.x - l * 0.2, b.y - 3 * a.s, l, a.y - b.y + 3 * a.s);
    const pg = g.createRadialGradient(a.x + l * 0.3, a.y - 1.5 * a.s, 0, a.x + l * 0.3, a.y - 1.5 * a.s, 5 * a.s);
    pg.addColorStop(0, 'rgba(255,214,150,0.95)');
    pg.addColorStop(1, 'rgba(255,214,150,0)');
    g.fillStyle = pg;
    g.fillRect(a.x - 4 * a.s, a.y - 7 * a.s, 10 * a.s, 9 * a.s);
    g.fillStyle = '#FFE2AE';
    g.fillRect(a.x + l * 0.15, a.y - 2.6 * a.s, 1.8 * a.s, 2.6 * a.s);
  }
  // Chaussée : bandes de 1 m, marquage central en tirets, bordures
  for (let z = 120; z > 1.2; z -= z > 30 ? 2 : 0.5) {
    const dz = z > 30 ? 2 : 0.5;
    const a = proj(-4, 0, z);
    const b = proj(4, 0, z);
    const c = proj(-4, 0, z - dz);
    const d = proj(4, 0, z - dz);
    g.fillStyle = '#1B1E2B';
    g.beginPath();
    g.moveTo(a.x, a.y);
    g.lineTo(b.x, b.y);
    g.lineTo(d.x, d.y);
    g.lineTo(c.x, c.y);
    g.fill();
    if ((D + z) % 10 < 4) {
      const q = [proj(-0.08, 0, z), proj(0.08, 0, z), proj(0.08, 0, z - dz), proj(-0.08, 0, z - dz)];
      g.fillStyle = 'rgba(235,235,230,0.8)';
      g.beginPath();
      q.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
      g.fill();
    }
    for (const bx of [-4, 4]) {
      const e1 = proj(bx, 0, z);
      const e2 = proj(bx, 0, z - dz);
      g.strokeStyle = 'rgba(200,200,210,0.5)';
      g.lineWidth = Math.max(1, 0.12 * e2.s);
      g.beginPath();
      g.moveTo(e1.x, e1.y);
      g.lineTo(e2.x, e2.y);
      g.stroke();
    }
  }
  // Lampadaires (tous les 25 m) et leur halo
  for (let i = Math.floor(D / 25); i < Math.floor(D / 25) + 7; i++) {
    const z = i * 25 + 12 - D;
    if (z < 1.5) continue;
    for (const cote of [-1, 1]) {
      const pied = proj(cote * 5.2, 0, z);
      const tete = proj(cote * 4.4, 7, z);
      g.strokeStyle = '#2A3048';
      g.lineWidth = Math.max(1, 0.18 * pied.s);
      g.beginPath();
      g.moveTo(pied.x, pied.y);
      g.lineTo(tete.x + cote * 0.6 * pied.s, tete.y);
      g.lineTo(tete.x, tete.y);
      g.stroke();
      const r = Math.min(260, 1.6 * tete.s + 10);
      const halo = g.createRadialGradient(tete.x, tete.y, 0, tete.x, tete.y, r);
      halo.addColorStop(0, 'rgba(255,220,160,0.95)');
      halo.addColorStop(0.15, 'rgba(244,184,96,0.55)');
      halo.addColorStop(1, 'rgba(244,184,96,0)');
      g.fillStyle = halo;
      g.fillRect(tete.x - r, tete.y - r, 2 * r, 2 * r);
      // flaque de lumière au sol
      const fl = proj(cote * 3.5, 0, z);
      const rf = 2.8 * fl.s;
      const sg = g.createRadialGradient(fl.x, fl.y, 0, fl.x, fl.y, rf);
      sg.addColorStop(0, 'rgba(244,184,96,0.22)');
      sg.addColorStop(1, 'rgba(244,184,96,0)');
      g.fillStyle = sg;
      g.fillRect(fl.x - rf, fl.y - rf * 0.4, 2 * rf, rf * 0.8);
    }
  }
  // Phares d'une voiture qui croise (blanc, de temps en temps)
  const zc = 90 - ((t * 32) % 120);
  if (zc > 3 && t < 8) {
    for (const dx of [-3.0, -1.9]) {
      const p = proj(dx, 0.6, zc);
      const r = Math.min(300, 1.4 * p.s + 6);
      const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      gr.addColorStop(0, 'rgba(255,255,255,0.95)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr;
      g.fillRect(p.x - r, p.y - r, 2 * r, 2 * r);
    }
  }
  g.restore();
  // Capot du véhicule en bas (reflet ambré)
  const capot = g.createLinearGradient(0, 1680, 0, 1920);
  capot.addColorStop(0, '#05060A');
  capot.addColorStop(1, '#000');
  g.fillStyle = capot;
  g.beginPath();
  g.moveTo(-20, 1920);
  g.quadraticCurveTo(540, 1640, 1100, 1920);
  g.fill();
}

const heure = (t: number) => {
  const pts: [number, number][] = [[0, 47], [2.5, 52], [4.0, 58], [10.3, 66], [18, 70]];
  let m = 47;
  for (let i = 0; i < pts.length - 1; i++) if (t >= pts[i][0] && t <= pts[i + 1][0]) m = mix(pts[i][1], pts[i + 1][1], (t - pts[i][0]) / (pts[i + 1][0] - pts[i][0]));
  const mm = Math.floor(m);
  return `${mm >= 60 ? 23 : 22}:${String(mm % 60).padStart(2, '0')}`;
};

export const Pub30CameraEmbarquee: React.FC = () => {
  const t = useT();
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const g = ref.current?.getContext('2d');
    if (g) dessiner(g, t);
  }, [t]);
  const glitch = t >= 11 && t < 11.45;
  const modeJP = prog(t, 11.4, 11.7) * (1 - prog(t, 13.2, 13.5));
  const cta = visibleJusqua(t, 13.5, 17.7, 0.35, 0.25);
  const kmh = Math.round(vitesse(t) * 3.6);
  const ui: CSSProperties = {fontFamily: P.mono, fontWeight: 700, color: C.blanc, textShadow: '0 2px 8px rgba(0,0,0,0.8)'};
  const journal = [
    {a: 1.8, txt: '22:47 · départ Akwa'},
    {a: 2.8, txt: '22:52 · clim 22 °C'},
    {a: 3.8, txt: '22:58 · Wi-Fi connecté'},
    {a: 9.0, txt: '23:06 · arrivée ✓'},
  ].filter((l) => t >= l.a && t < 11);
  const lieu = t < 8 ? 'DOUALA · AKWA' : 'DOUALA · BONAPRISO';

  return (
    <AbsoluteFill style={{background: C.nuit, overflow: 'hidden'}}>
      <canvas ref={ref} width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: glitch ? `hue-rotate(${hasard(Math.floor(t * 30)) * 60}deg) saturate(1.6)` : undefined, transform: glitch ? `translateX(${(hasard(Math.floor(t * 30) + 3) - 0.5) * 60}px)` : undefined}} />
      {/* Grain, vignettage grand-angle */}
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity: 0.16, mixBlendMode: 'screen'}}>
        <filter id="p30grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed={Math.floor(t * 30) % 97} />
        </filter>
        <rect width="1080" height="1920" filter="url(#p30grain)" />
      </svg>
      <AbsoluteFill style={{boxShadow: 'inset 0 0 260px 60px rgba(0,0,0,0.85)', borderRadius: 60}} />

      {/* Interface de caméra embarquée */}
      <div style={{...ui, position: 'absolute', left: 70, top: 120, fontSize: 44, display: 'flex', alignItems: 'center', gap: 14}}>
        <span style={{display: 'inline-block', width: 26, height: 26, borderRadius: 13, background: C.blanc, opacity: Math.floor(t * 2) % 2 ? 0.25 : 1}} />
        REC
      </div>
      <div style={{...ui, position: 'absolute', right: 70, top: 112, fontSize: 64}}>{heure(t)}</div>
      <div style={{...ui, position: 'absolute', right: 70, top: 190, fontSize: 30, opacity: 0.85}}>{lieu}</div>
      <div style={{...ui, position: 'absolute', left: 70, bottom: 300, fontSize: 30, opacity: 0.85}}>
        <span style={{fontSize: 72}}>{String(kmh).padStart(2, '0')}</span> km/h
      </div>
      {['left', 'right'].map((cote) => (
        <div key={cote} style={{position: 'absolute', [cote]: 40, top: 90, width: 70, height: 70, [`border${cote === 'left' ? 'Left' : 'Right'}`]: '4px solid rgba(255,255,255,0.7)', borderTop: '4px solid rgba(255,255,255,0.7)'}} />
      ))}
      {['left', 'right'].map((cote) => (
        <div key={`b${cote}`} style={{position: 'absolute', [cote]: 40, bottom: 270, width: 70, height: 70, [`border${cote === 'left' ? 'Left' : 'Right'}`]: '4px solid rgba(255,255,255,0.7)', borderBottom: '4px solid rgba(255,255,255,0.7)'}} />
      ))}

      {/* Hook */}
      {t < 1.6 || t >= 17.7 ? (
        <div style={{position: 'absolute', left: 120, right: 120, top: 300, textAlign: 'center', opacity: t < 1.6 ? 1 - prog(t, 1.35, 1.6) : prog(t, 17.7, 17.95)}}>
          <div style={{...ui, fontFamily: P.grotesk, fontSize: 70, lineHeight: 1.1}}>Caméra embarquée : trajet n° 1 284</div>
          <div style={{...ui, fontSize: 28, opacity: 0.7, marginTop: 12}}>illustration</div>
        </div>
      ) : null}

      {/* Journal de bord */}
      {journal.length ? (
        <div style={{position: 'absolute', left: 120, top: 330, display: 'flex', flexDirection: 'column', gap: 16, opacity: 1 - prog(t, 10.8, 11)}}>
          {journal.map((l) => (
            <div key={l.txt} style={{...ui, fontSize: 42, padding: '12px 22px', background: 'rgba(5,8,20,0.55)', borderLeft: `6px solid ${l.txt.includes('arrivée') ? '#7CF0B0' : C.ambre}`, opacity: prog(t, l.a, l.a + 0.15), transform: `translateX(${(1 - ease.out(prog(t, l.a, l.a + 0.25))) * -60}px)`}}>
              {l.txt}
            </div>
          ))}
          {t >= 9.6 ? <div style={{...ui, fontFamily: P.grotesk, fontSize: 64, marginTop: 20, opacity: prog(t, 9.6, 9.9)}}>Trajet sans souci</div> : null}
        </div>
      ) : null}

      {/* Mini-carte : itinéraire vers Bonapriso */}
      {t >= 5 && t < 9 ? (
        <div style={{position: 'absolute', right: 120, top: 330, width: 360, height: 360, borderRadius: 24, background: 'rgba(5,8,20,0.7)', border: '2px solid rgba(255,255,255,0.35)', opacity: prog(t, 5, 5.3) * (1 - prog(t, 8.7, 9))}}>
          <svg width="360" height="360" viewBox="0 0 100 100">
            {[20, 40, 60, 80].map((v) => (
              <g key={v} stroke="rgba(255,255,255,0.1)" strokeWidth="2">
                <line x1={v} y1="0" x2={v} y2="100" />
                <line x1="0" y1={v} x2="100" y2={v} />
              </g>
            ))}
            <path d="M20 86 L20 60 Q20 46 34 46 L64 46 Q78 46 78 32 L78 16" fill="none" stroke={C.ambre} strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - prog(t, 5.2, 8.6)} />
            <circle cx="78" cy="16" r="5" fill={C.blanc} />
          </svg>
          <div style={{...ui, position: 'absolute', left: 18, bottom: 14, fontSize: 24}}>→ BONAPRISO</div>
        </div>
      ) : null}

      {/* Mode JP après le glitch */}
      {modeJP > 0 ? (
        <div style={{position: 'absolute', left: 120, right: 120, top: 640, padding: '40px 36px', borderRadius: 30, background: 'rgba(5,8,20,0.75)', border: `3px solid ${C.ambre}`, textAlign: 'center', opacity: modeJP, transform: `scale(${mix(0.9, 1, modeJP)})`}}>
          <div style={{...ui, fontSize: 34, color: C.ambre, letterSpacing: 6}}>MODE JP</div>
          <div style={{...ui, fontFamily: P.grotesk, fontSize: 64, marginTop: 14}}>Service Confort</div>
          <div style={{...ui, fontFamily: P.grotesk, fontSize: 56, color: C.ambre}}>3 500 F/h (promo)</div>
          <div style={{...ui, fontFamily: P.grotesk, fontSize: 46, marginTop: 10}}>{TARIFS.eco}</div>
        </div>
      ) : null}

      {/* Appel à l'action, avec l'interface autour */}
      {cta > 0 ? (
        <AbsoluteFill style={{opacity: cta}}>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 15%, rgba(5,8,20,0.7) 28%, rgba(5,8,20,0.7) 82%, transparent)'}} />
          <FinJP
            t={t}
            s={{police: P.grotesk, couleur: C.blanc, couleurNumero: C.blanc, accent: C.ambre, tailleNumero: 150, ombre: '0 4px 20px rgba(0,0,0,0.7)'}}
            p={(i) => prog(t, 13.6 + i * 0.12, 13.95 + i * 0.12)}
            haut={540}
          />
        </AbsoluteFill>
      ) : null}
      <Bande n={30} />
    </AbsoluteFill>
  );
};
