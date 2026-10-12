// Ambiance — la vie permanente de Douala pendant tout le film (0 → 45 s).
// Circulation qui ne s'arrête jamais, piétons sur les trottoirs, ombres de nuages qui glissent,
// reflets du Wouri, pirogues, vols d'oiseaux et poussières dorées dans la lumière.
// Un seul « moteur » (tween 0 → 45 s, ease none) calcule toutes les positions à partir du
// temps : déterministe, sans Math.random, juste à n'importe quel instant de recherche.

(function () {
  const L_ROUTE = 70;
  const DUREE = 45;

  window.AMBIANCE = function (tl, ctx) {
    const { ville, T2, T5 } = ctx;
    const { el, vehicule, prng } = window.VILLE;
    const sol = document.getElementById("sol");
    const alea = prng(4521);
    const set = (e, x, y) => (e.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`);
    const boucle = (v, l) => ((v % l) + l) % l;
    const fondu = (p, l) => Math.min(1, p / 90, (l - p) / 90); // apparition / disparition aux bouts

    // ── Circulation : le trafic de la ville + des voitures sur d'autres avenues ──
    const VOIES = [
      { axe: "x", pos: 1700, de: 560, a: 2560 }, { axe: "y", pos: 1550, de: 760, a: 2900 },
      { axe: "x", pos: 1400, de: 560, a: 2640 }, { axe: "y", pos: 1250, de: 760, a: 2900 },
      { axe: "x", pos: 2000, de: 560, a: 2560 }, { axe: "y", pos: 1850, de: 760, a: 2900 },
      { axe: "x", pos: 1100, de: 560, a: 2900 }, { axe: "x", pos: 2300, de: 560, a: 2560 },
      { axe: "y", pos: 950, de: 760, a: 2900 }, { axe: "y", pos: 2150, de: 760, a: 2900 },
    ];
    const voitures = ville.vehicules.trafic.map((v, i) => ({ ...v, vitesse: 70 + (i % 4) * 14 }));
    [6, 7, 8, 9].forEach((iv) => {
      const v = VOIES[iv];
      for (let k = 0; k < 4; k++) {
        const sens = (k + iv) % 2 ? 1 : -1;
        const p = v.de + (v.a - v.de) * ((k + 0.3) / 4);
        const x = v.axe === "x" ? p : v.pos + sens * 14;
        const y = v.axe === "x" ? v.pos + sens * 14 : p;
        const type = ["gris", "blanc", "bleu", "gris"][(k + iv) % 4];
        voitures.push({ el: vehicule(sol, x, y, type, v.axe), axe: v.axe, sens, x, y, voie: iv, vitesse: 65 + k * 12 });
      }
    });
    voitures.forEach((v) => {
      const voie = VOIES[v.voie];
      v.l = voie.a - voie.de;
      v.p0 = (v.axe === "x" ? v.x : v.y) - voie.de;
      v.corps = v.el.querySelector(".caisse");
    });
    // Les nouvelles voitures apparaissent avec la ville.
    voitures.slice(ville.vehicules.trafic.length).forEach((v, i) => {
      tl.fromTo(v.el, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.7 + (i % 8) * 0.04);
    });
    // Les voies du carrefour, vidées pendant le bouchon, se remplissent après le feu vert.
    ville.vehicules.trafic.forEach((v, i) => {
      if (v.voie <= 1) tl.to(v.el, { opacity: 1, duration: 0.5 }, T2.changer + 2.6 + (i % 5) * 0.1);
    });

    // ── Piétons : petites silhouettes debout qui marchent sur les trottoirs ──
    const COULEURS = ["#f2a541", "#2bb5a8", "#ffffff", "#e8604c", "#3d5a80", "#f6d365"];
    const pietons = [];
    const TROTTOIRS = [
      { axe: "x", pos: 1700 - L_ROUTE / 2 - 9, de: 700, a: 2400 }, { axe: "x", pos: 1700 + L_ROUTE / 2 + 9, de: 700, a: 2400 },
      { axe: "y", pos: 1550 + L_ROUTE / 2 + 9, de: 800, a: 2500 }, { axe: "y", pos: 1550 - L_ROUTE / 2 - 22, de: 800, a: 2500 },
      { axe: "x", pos: 1400 - L_ROUTE / 2 - 9, de: 700, a: 2400 }, { axe: "x", pos: 1400 + L_ROUTE / 2 + 9, de: 700, a: 2400 },
      { axe: "y", pos: 1250 + L_ROUTE / 2 + 9, de: 900, a: 2400 }, { axe: "y", pos: 1850 - L_ROUTE / 2 - 9, de: 900, a: 2400 },
    ];
    TROTTOIRS.forEach((tr, it) => {
      for (let k = 0; k < 7; k++) {
        const p = el("div", "pieton");
        const c = COULEURS[(k * 5 + it) % COULEURS.length];
        p.innerHTML = `<svg viewBox="0 0 10 22" width="9" height="20"><circle cx="5" cy="3.2" r="2.6" fill="#4a3428"/>` +
          `<path d="M1.6 8 Q5 5.6 8.4 8 L8 15 L2 15Z" fill="${c}"/><path class="jambes" d="M3 15 L2.4 21.6 M7 15 L7.6 21.6" stroke="#2d3142" stroke-width="2" stroke-linecap="round"/></svg>`;
        sol.appendChild(p);
        const l = tr.a - tr.de;
        const p0 = l * ((k + alea() * 0.6) / 7);
        p.style.left = (tr.axe === "x" ? tr.de : tr.pos) + "px";
        p.style.top = (tr.axe === "x" ? tr.pos : tr.de) + "px";
        pietons.push({ el: p, axe: tr.axe, l, p0, sens: (k + it) % 2 ? 1 : -1, vitesse: 11 + alea() * 9, phase: alea() * 6 });
        tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.9 + (k % 7) * 0.05);
      }
    });

    // ── Ombres de nuages qui glissent sur la ville (disparaissent la nuit) ──
    const nuages = [0, 1, 2, 3, 4].map((i) => {
      const n = el("div", "ombre-nuage", { left: "0px", top: "0px", width: 700 + i * 120 + "px", height: 420 + i * 60 + "px" });
      sol.appendChild(n);
      return { el: n, x0: 300 + i * 620, y0: 400 + ((i * 1370) % 2400) };
    });

    // ── Reflets du Wouri qui scintillent, pirogues qui dérivent ──
    const reflets = [...ville.fleuve.querySelectorAll(".reflet")].map((r, i) => ({ el: r, phase: i * 1.7, ampl: 10 + (i % 4) * 6 }));

    // ── Écran : poussières dorées et oiseaux ──
    const ecran = el("div", "ambiance-ecran");
    document.getElementById("monde-clip").appendChild(ecran);
    const poussieres = Array.from({ length: 26 }, (_, i) => {
      const d = el("div", "poussiere");
      const taille = 3 + (i % 4) * 1.5;
      d.style.width = d.style.height = taille + "px";
      ecran.appendChild(d);
      return { el: d, x: alea() * 100, y0: alea() * 100, v: 1.2 + alea() * 1.8, phase: alea() * 6, op: 0.35 + alea() * 0.4 };
    });
    // Vols d'oiseaux (de jour seulement) : départ, durée, hauteur (% écran), sens.
    const VOLS = [[2.4, 6.5, 16, 1], [13.2, 6, 22, -1], [24.5, 5.5, 14, 1]];
    VOLS.forEach(([t0, d, h, sens], iv) => {
      const vol = el("div", "vol-oiseaux");
      vol.style.top = h + "%";
      for (let k = 0; k < 5; k++) {
        const o = el("div", "oiseau");
        o.style.left = [0, 34, 60, 22, 88][k] + "px";
        o.style.top = [0, 18, 6, 40, 26][k] + "px";
        o.innerHTML = `<svg viewBox="0 0 24 10" width="22" height="9"><path d="M1 5 Q6 0 12 6 Q18 0 23 5" fill="none" stroke="#2d3142" stroke-width="2" stroke-linecap="round"/></svg>`;
        vol.appendChild(o);
        tl.fromTo(o, { scaleY: 1 }, { scaleY: -0.5, duration: 0.18, ease: "sine.inOut", yoyo: true, repeat: Math.floor(d / 0.18) - 1, immediateRender: false }, t0 + k * 0.05);
      }
      ecran.appendChild(vol);
      tl.fromTo(vol, { left: sens > 0 ? "-18%" : "112%", y: 0, opacity: 0 },
        { left: sens > 0 ? "112%" : "-18%", y: -90, opacity: 1, duration: d, ease: "none", immediateRender: iv === 0 }, t0);
      tl.set(vol, { opacity: 0 }, t0 + d);
    });

    // ── Le moteur : toutes les positions à l'instant t ──
    const moteur = { t: 0 };
    function maj() {
      const t = moteur.t;
      voitures.forEach((v) => {
        const p = boucle(v.p0 + v.sens * v.vitesse * t, v.l);
        const d = p - v.p0;
        if (v.axe === "x") set(v.el, d, 0); else set(v.el, 0, d);
        v.corps.style.opacity = fondu(p, v.l).toFixed(2);
      });
      pietons.forEach((pi) => {
        const p = boucle(pi.p0 + pi.sens * pi.vitesse * t, pi.l);
        if (pi.axe === "x") set(pi.el, p, 0); else set(pi.el, 0, p);
        pi.el.style.setProperty("--pas", Math.sin(t * 9 + pi.phase).toFixed(2));
      });
      nuages.forEach((n) => set(n.el, n.x0 + t * 22 - 500, n.y0 + t * 9 - 300));
      reflets.forEach((r) => {
        r.el.style.translate = `${(Math.sin(t * 0.9 + r.phase) * r.ampl).toFixed(1)}px 0px`;
        r.el.style.opacity = (0.45 + 0.55 * Math.abs(Math.sin(t * 1.3 + r.phase))).toFixed(2);
      });
      ville.pirogues.forEach((p, i) => set(p, Math.sin(t * 0.4 + i) * 22, t * (8 + i * 3) * (i % 2 ? -1 : 1)));
      poussieres.forEach((d) => {
        const y = boucle(d.y0 - d.v * t, 110) - 5;
        const x = d.x + Math.sin(t * 0.5 + d.phase) * 2.5;
        d.el.style.left = x.toFixed(2) + "%";
        d.el.style.top = y.toFixed(2) + "%";
        d.el.style.opacity = (d.op * (0.6 + 0.4 * Math.sin(t * 1.7 + d.phase))).toFixed(2);
      });
    }
    tl.fromTo(moteur, { t: 0 }, { t: DUREE, duration: DUREE, ease: "none", onUpdate: maj }, 0);
    maj();

    // La nuit : les oiseaux sont rentrés, les nuages s'effacent, les poussières deviennent lucioles.
    tl.to(nuages.map((n) => n.el), { opacity: 0, duration: 1.2 }, T5.debut + 0.3);
    tl.to(poussieres.map((d) => d.el), { backgroundColor: "#ffd27a", boxShadow: "0 0 10px 3px rgba(255,190,90,0.7)", duration: 1.2 }, T5.debut + 0.5);
  };
})();
