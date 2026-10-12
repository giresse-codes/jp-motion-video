// Ville de Douala en 3D isométrique (CSS 3D), construite de façon déterministe.
// Toutes les positions sont en « coordonnées sol » : un plan de TAILLE × TAILLE px,
// origine en haut à gauche, posé à plat puis tourné de 45° (vue isométrique).
// Les directions sol : +x = bas-droite à l'écran, +y = bas-gauche, -x = haut-gauche, -y = haut-droite.
// La lumière de fin de journée vient de la gauche (direction sol -x,+y) : faces sud éclairées,
// faces est à l'ombre, ombres portées vers +x,-y.

(function () {
  const TAILLE = 3000;

  // Générateur pseudo-aléatoire à graine (jamais Math.random : rendu déterministe).
  function prng(graine) {
    let a = graine >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Trame routière : avenues verticales (x) et horizontales (y), en coordonnées sol.
  const AVENUES_X = [650, 950, 1250, 1550, 1850, 2150, 2450];
  const AVENUES_Y = [800, 1100, 1400, 1700, 2000, 2300, 2600];
  const LARGEUR_ROUTE = 70;
  const BOULEVARDS = { x: [1550], y: [1700, 1400] }; // bordés de néon

  // Quartiers (rectangles sol) — repères de Douala.
  const QUARTIERS = [
    { id: "bonanjo", nom: "Bonanjo", x0: 650, x1: 1250, y0: 1100, y1: 1700, hMin: 50, hMax: 130 },
    { id: "akwa", nom: "Akwa", x0: 1250, x1: 1850, y0: 800, y1: 1400, hMin: 170, hMax: 430 },
    { id: "centre", nom: "Centre", x0: 1550, x1: 2150, y0: 1400, y1: 2000, hMin: 90, hMax: 230 },
    { id: "bonapriso", nom: "Bonapriso", x0: 650, x1: 1250, y0: 1700, y1: 2300, hMin: 26, hMax: 60 },
    { id: "nord", nom: "Deïdo", x0: 650, x1: 1250, y0: 800, y1: 1100, hMin: 60, hMax: 160 },
    { id: "est", nom: "Bali", x0: 1850, x1: 2150, y0: 800, y1: 1400, hMin: 80, hMax: 200 },
    { id: "sud", nom: "Bonapriso sud", x0: 1250, x1: 1550, y0: 1400, y1: 2300, hMin: 40, hMax: 120 },
    // Périphérie : quartiers résidentiels bas qui prolongent la ville jusqu'à l'horizon.
    { id: "periph", nom: "Périphérie", x0: 0, x1: 3000, y0: 2300, y1: 3000, hMin: 24, hMax: 60 },
    { id: "periph", nom: "Périphérie", x0: 2150, x1: 3000, y0: 0, y1: 3000, hMin: 24, hMax: 70 },
  ];

  // Repères nommés (centres en coordonnées sol), utilisés par la caméra et les étiquettes.
  const REPERES = {
    centre: { x: 1500, y: 1500 },
    carrefour: { x: 1550, y: 1700 },
    akwa: { x: 1550, y: 1100 },
    bonanjo: { x: 950, y: 1400 },
    pagode: { x: 800, y: 1550 },
    pont: { x: 390, y: 1400 },
    bonapriso: { x: 950, y: 2000 },
    aeroport: { x: 2575, y: 2560 },
    sortieEst: { x: 2900, y: 1100 },
  };

  const el = (tag, cls, style) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (style) Object.assign(n.style, style);
    return n;
  };

  // Boîte 3D : toit + face sud + face est (les deux faces visibles en isométrique).
  // `h` est porté par la variable CSS --h, animable (immeubles qui sortent du sol).
  function boite(parent, x, y, w, d, h, options) {
    const o = options || {};
    const b = el("div", "boite " + (o.classe || ""), {
      left: x + "px",
      top: y + "px",
      width: w + "px",
      height: d + "px",
    });
    b.style.setProperty("--h", (o.hDepart ?? h) + "px");
    b.dataset.h = h;
    const toit = el("div", "toit");
    const sud = el("div", "face face-s");
    const est = el("div", "face face-e");
    if (o.fenetres) {
      sud.appendChild(el("div", "fenetres"));
      est.appendChild(el("div", "fenetres"));
      sud.appendChild(el("div", "fenetres-nuit"));
      est.appendChild(el("div", "fenetres-nuit"));
    }
    b.append(toit, sud, est);
    parent.appendChild(b);
    return b;
  }

  // Ombre portée : parallélogramme vers +x,-y, longueur proportionnelle à la hauteur.
  function ombre(parent, x, y, w, d, h) {
    const s = Math.min(160, h * 0.55);
    const o = el("div", "ombre", {
      left: x + "px",
      top: y - s + "px",
      width: w + s + "px",
      height: d + s + "px",
      clipPath: `polygon(0px ${s}px, ${s}px 0px, ${w + s}px 0px, ${w + s}px ${d}px, ${w}px ${d + s}px, 0px ${d + s}px)`,
    });
    parent.appendChild(o);
    return o;
  }

  // Palmier : tronc + palmes sur un plan vertical tourné vers la caméra.
  function palmier(parent, x, y, taille) {
    const p = el("div", "palmier", { left: x + "px", top: y + "px" });
    p.style.setProperty("--t", taille + "px");
    p.innerHTML = `<svg viewBox="0 0 60 100" width="${taille * 0.6}" height="${taille}">
      <path d="M31 100 C30 80 28 60 33 38" stroke="#5a463a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <g fill="#2f5a3c" stroke="#1f3d29" stroke-width="1">
        <path d="M33 38 C20 26 8 30 2 40 C14 34 24 36 33 40Z"/>
        <path d="M33 38 C46 24 56 28 60 38 C48 33 40 35 33 40Z"/>
        <path d="M33 37 C26 20 16 14 8 16 C20 22 27 28 32 39Z"/>
        <path d="M33 37 C40 18 50 12 58 15 C46 22 39 28 34 39Z"/>
        <path d="M33 36 C32 22 34 10 38 4 C37 16 36 26 34 38Z"/>
      </g></svg>`;
    parent.appendChild(p);
    return p;
  }

  // Véhicule : petite boîte. type "jp" = rouge marque avec bande blanche et halo néon.
  function vehicule(parent, x, y, type, orientation, echelle) {
    const k = echelle || 1;
    const horizontal = orientation !== "y";
    const w = (horizontal ? 40 : 20) * k;
    const d = (horizontal ? 20 : 40) * k;
    const v = el("div", "vehicule vehicule-" + type, {
      left: x - w / 2 + "px",
      top: y - d / 2 + "px",
      width: w + "px",
      height: d + "px",
    });
    v.innerHTML = `<div class="halo"></div><div class="caisse"><div class="toit"></div><div class="face face-s"></div><div class="face face-e"></div></div>`;
    v.style.setProperty("--h", (type === "jp" ? 14 : 12) * k + "px");
    parent.appendChild(v);
    return v;
  }

  // Teinte de façade selon le quartier : Akwa vitré (turquoise, bleu nuit), Bonanjo colonial
  // (crème, ocre), centre chaleureux (pêche, ocre), quartiers résidentiels clairs.
  const TEINTES = {
    akwa: ["teinte-verre", "teinte-nuit", "teinte-verre", "teinte-creme"],
    bonanjo: ["teinte-creme", "teinte-ocre", "teinte-creme", "teinte-peche"],
    centre: ["teinte-peche", "teinte-ocre", "teinte-verre", "teinte-creme"],
    est: ["teinte-terre", "teinte-creme", "teinte-nuit"],
    nord: ["teinte-ocre", "teinte-creme", "teinte-terre"],
    bonapriso: ["teinte-creme", "teinte-peche", "teinte-creme"],
    sud: ["teinte-peche", "teinte-creme", "teinte-ocre"],
  };
  function teinte(quartier, h, r) {
    if (h > 260) return r < 0.5 ? "teinte-verre" : "teinte-nuit";
    const l = TEINTES[quartier] || ["teinte-creme", "teinte-ocre", "teinte-peche"];
    return l[Math.floor(r * l.length) % l.length];
  }

  function construire(sol) {
    const alea = prng(20261012);
    const registre = { batiments: [], routes: [], palmiers: [], vehicules: {}, etiquettes: {} };

    // Sol des îlots (trottoirs) puis routes.
    // Sol étendu bien au-delà de la ville : l'horizon se perd dans une brume dorée.
    sol.appendChild(el("div", "terrain-lointain"));
    sol.appendChild(el("div", "terrain"));

    // Fleuve Wouri (bande à l'ouest) avec reflets.
    const fleuve = el("div", "fleuve", { left: "160px", top: "0px", width: "380px", height: TAILLE + "px" });
    for (let i = 0; i < 14; i++) {
      const r = el("div", "reflet", {
        left: 30 + alea() * 300 + "px",
        top: i * 215 + alea() * 80 + "px",
        width: 40 + alea() * 90 + "px",
      });
      fleuve.appendChild(r);
    }
    sol.appendChild(fleuve);
    registre.fleuve = fleuve;

    // Pirogues sur le fleuve.
    registre.pirogues = [0, 1, 2].map((i) => {
      const p = el("div", "pirogue", { left: 250 + i * 70 + "px", top: 600 + i * 900 + "px" });
      sol.appendChild(p);
      return p;
    });

    // Routes.
    AVENUES_X.forEach((x) => {
      const r = el("div", "route route-v" + (BOULEVARDS.x.includes(x) ? " boulevard" : ""), {
        left: x - LARGEUR_ROUTE / 2 + "px",
        top: "700px",
        width: LARGEUR_ROUTE + "px",
        height: "2250px",
      });
      sol.appendChild(r);
      registre.routes.push({ el: r, axe: "y", pos: x });
    });
    AVENUES_Y.forEach((y) => {
      const long = y === 1100 ? TAILLE - 540 : 2460; // l'avenue y=1100 file vers l'est (route du voyage)
      const r = el("div", "route route-h" + (BOULEVARDS.y.includes(y) ? " boulevard" : ""), {
        left: (y === 1400 ? 540 : 560) + "px",
        top: y - LARGEUR_ROUTE / 2 + "px",
        width: (y === 1400 ? 2120 : long) + "px",
        height: LARGEUR_ROUTE + "px",
      });
      sol.appendChild(r);
      registre.routes.push({ el: r, axe: "x", pos: y });
    });
    // Route de la rive gauche (Bonabéri) au-delà du pont.
    const rive = el("div", "route route-h", { left: "0px", top: 1400 - LARGEUR_ROUTE / 2 + "px", width: "160px", height: LARGEUR_ROUTE + "px" });
    sol.appendChild(rive);

    // Pont sur le Wouri : tablier, garde-corps, lampadaires et piles.
    const pont = el("div", "pont", { left: "140px", top: 1400 - 46 + "px", width: "420px", height: "92px" });
    pont.innerHTML = `<div class="tablier"></div><div class="garde garde-n"></div><div class="garde garde-s"></div>`;
    for (let i = 0; i < 7; i++) {
      const l = el("div", "lampadaire", { left: 20 + i * 64 + "px" });
      pont.appendChild(l);
    }
    sol.appendChild(pont);
    registre.pont = pont;
    for (let i = 0; i < 6; i++) boite(sol, 170 + i * 72, 1400 - 10, 14, 20, 26, { classe: "pile" });

    // Immeubles par îlot.
    const ilots = [];
    for (let i = 0; i < AVENUES_X.length - 1; i++)
      for (let j = 0; j < AVENUES_Y.length - 1; j++)
        ilots.push({
          x0: AVENUES_X[i] + LARGEUR_ROUTE / 2 + 12,
          x1: AVENUES_X[i + 1] - LARGEUR_ROUTE / 2 - 12,
          y0: AVENUES_Y[j] + LARGEUR_ROUTE / 2 + 12,
          y1: AVENUES_Y[j + 1] - LARGEUR_ROUTE / 2 - 12,
        });

    // Aucun îlot sur l'emprise de l'aéroport.
    const surAeroport = (il) => il.x1 > 2220 && il.y1 > 1960;
    const quartierDe = (cx, cy) =>
      QUARTIERS.find((q) => cx >= q.x0 && cx < q.x1 && cy >= q.y0 && cy < q.y1) || { id: "divers", hMin: 50, hMax: 140 };

    ilots.forEach((il) => {
      if (surAeroport(il)) return;
      const cx = (il.x0 + il.x1) / 2;
      const cy = (il.y0 + il.y1) / 2;
      const q = quartierDe(cx, cy);
      // La Pagode de Bonanjo occupe tout son îlot.
      if (Math.abs(cx - REPERES.pagode.x) < 150 && Math.abs(cy - REPERES.pagode.y) < 150) {
        const b = boite(sol, il.x0 + 40, il.y0 + 40, il.x1 - il.x0 - 80, il.y1 - il.y0 - 80, 70, { classe: "pagode teinte-creme", fenetres: true, hDepart: 0 });
        const toitP = el("div", "toit-pagode");
        b.appendChild(toitP);
        const o = ombre(sol, il.x0 + 40, il.y0 + 40, il.x1 - il.x0 - 80, il.y1 - il.y0 - 80, 110);
        registre.batiments.push({ el: b, ombre: o, x: cx, y: cy, h: 70, quartier: "bonanjo" });
        registre.pagode = b;
        return;
      }
      // Découpe de l'îlot en 1 à 4 parcelles.
      const residentiel = q.id === "bonapriso" || q.id === "sud" || q.id === "periph";
      const nx = residentiel ? 3 : alea() < 0.5 ? 2 : 1;
      const ny = residentiel ? 3 : alea() < 0.5 ? 2 : 1;
      const pw = (il.x1 - il.x0) / nx;
      const pd = (il.y1 - il.y0) / ny;
      for (let a = 0; a < nx; a++)
        for (let c = 0; c < ny; c++) {
          if (!residentiel && alea() < 0.12) {
            sol.appendChild(el("div", "jardin", { left: il.x0 + a * pw + 10 + "px", top: il.y0 + c * pd + 10 + "px", width: pw - 20 + "px", height: pd - 20 + "px" }));
            const p = palmier(sol, il.x0 + a * pw + pw / 2, il.y0 + c * pd + pd / 2, 60);
            registre.palmiers.push({ el: p, x: il.x0 + a * pw, y: il.y0 + c * pd });
            continue;
          }
          if (residentiel && alea() < 0.25) {
            sol.appendChild(el("div", "jardin", { left: il.x0 + a * pw + 6 + "px", top: il.y0 + c * pd + 6 + "px", width: pw - 12 + "px", height: pd - 12 + "px" }));
            const p = palmier(sol, il.x0 + a * pw + pw / 2, il.y0 + c * pd + pd / 2, 46 + alea() * 18);
            registre.palmiers.push({ el: p, x: il.x0 + a * pw, y: il.y0 + c * pd });
            continue;
          }
          const marge = residentiel ? 10 : 8 + alea() * 14;
          const x = il.x0 + a * pw + marge;
          const y = il.y0 + c * pd + marge;
          const w = pw - 2 * marge;
          const d = pd - 2 * marge;
          const h = Math.round(q.hMin + (q.hMax - q.hMin) * Math.pow(alea(), residentiel ? 1 : 1.6));
          const classe = (residentiel ? "maison" : h > 260 ? "tour" : "immeuble") + " " + teinte(q.id, h, alea());
          const o = ombre(sol, x, y, w, d, h);
          const b = boite(sol, x, y, w, d, h, { classe, fenetres: !residentiel || h > 40, hDepart: 0 });
          registre.batiments.push({ el: b, ombre: o, x: x + w / 2, y: y + d / 2, h, quartier: q.id });
        }
    });

    // Palmiers le long des boulevards.
    for (let i = 0; i < 16; i++) {
      const p = palmier(sol, 1550 - LARGEUR_ROUTE / 2 - 14, 760 + i * 120, 58);
      registre.palmiers.push({ el: p, x: 1550, y: 760 + i * 120 });
    }
    for (let i = 0; i < 12; i++) {
      const p = palmier(sol, 620 + i * 160, 1700 + LARGEUR_ROUTE / 2 + 14, 54);
      registre.palmiers.push({ el: p, x: 620 + i * 160, y: 1700 });
    }

    // Aéroport de Douala : piste, terminal, tour de contrôle.
    const piste = el("div", "piste", { left: "2230px", top: "2600px", width: "700px", height: "90px" });
    sol.appendChild(piste);
    registre.piste = piste;
    const tarmac = el("div", "tarmac", { left: "2260px", top: "2330px", width: "560px", height: "250px" });
    sol.appendChild(tarmac);
    const terminal = boite(sol, 2290, 2350, 330, 110, 60, { classe: "terminal teinte-verre", fenetres: true, hDepart: 0 });
    const oT = ombre(sol, 2290, 2350, 330, 110, 60);
    registre.batiments.push({ el: terminal, ombre: oT, x: 2455, y: 2405, h: 60, quartier: "aeroport" });
    const tour = boite(sol, 2680, 2370, 34, 34, 170, { classe: "tour-controle teinte-creme", hDepart: 0 });
    const oTr = ombre(sol, 2680, 2370, 34, 34, 170);
    registre.batiments.push({ el: tour, ombre: oTr, x: 2697, y: 2387, h: 170, quartier: "aeroport" });
    const cabine = boite(tour, -10, -10, 54, 54, 26, { classe: "cabine" });
    cabine.style.transform = "translateZ(0px)";
    registre.cabine = cabine;
    // Avion (posé sur le tarmac, décolle en scène 3).
    const avion = el("div", "avion", { left: "2300px", top: "2612px" });
    avion.innerHTML = `<svg viewBox="0 0 120 120" width="120" height="120">
      <g fill="#F5F2F0" stroke="#9aa0aa" stroke-width="1.2">
        <path d="M60 4 C64 4 66 10 66 18 L66 46 L112 68 L112 78 L66 66 L66 96 L80 106 L80 112 L60 107 L40 112 L40 106 L54 96 L54 66 L8 78 L8 68 L54 46 L54 18 C54 10 56 4 60 4Z"/>
      </g><path d="M57 14 L63 14 L63 22 L57 22Z" fill="#E10600"/></svg>`;
    sol.appendChild(avion);
    registre.avion = avion;

    // Véhicules : un JP héros + trafic.
    registre.vehicules.heros = vehicule(sol, 1550, 2150, "jp", "y", 1.7);
    registre.vehicules.trafic = [];
    const voies = [
      { axe: "x", pos: 1700, de: 900, a: 2100 },
      { axe: "y", pos: 1550, de: 900, a: 2250 },
      { axe: "x", pos: 1400, de: 700, a: 2100 },
      { axe: "y", pos: 1250, de: 850, a: 2250 },
      { axe: "x", pos: 2000, de: 700, a: 2100 },
      { axe: "y", pos: 1850, de: 850, a: 2250 },
    ];
    voies.forEach((v, iv) => {
      for (let k = 0; k < 5; k++) {
        const t = (k + 0.5) / 5;
        const p = v.de + (v.a - v.de) * t;
        const sens = (k + iv) % 2 ? 1 : -1;
        const decal = sens * 14;
        const x = v.axe === "x" ? p : v.pos + decal;
        const y = v.axe === "x" ? v.pos + decal : p;
        // Taxis jaunes (« gris » historique), voitures blanches et bleues.
        const type = ["gris", "blanc", "gris", "bleu", "gris", "blanc"][(k * 7 + iv * 3) % 6];
        const car = vehicule(sol, x, y, type, v.axe === "x" ? "x" : "y");
        registre.vehicules.trafic.push({ el: car, axe: v.axe, sens, x, y, voie: iv });
      }
    });

    // Feux tricolores du carrefour central.
    registre.feux = [
      [1550 - 50, 1700 - 50],
      [1550 + 50, 1700 - 50],
      [1550 - 50, 1700 + 50],
      [1550 + 50, 1700 + 50],
    ].map(([x, y]) => {
      const f = el("div", "feu", { left: x + "px", top: y + "px" });
      f.innerHTML = `<div class="feu-poteau"><div class="feu-boite"><span class="feu-r"></span><span class="feu-v"></span></div></div>`;
      sol.appendChild(f);
      return f;
    });

    return registre;
  }

  // Panneau vertical tourné vers la caméra (icônes, étiquettes posées dans la ville).
  function panneau(parent, x, y, hauteur, html, classe) {
    const p = el("div", "panneau " + (classe || ""), { left: x + "px", top: y + "px" });
    p.style.setProperty("--z", hauteur + "px");
    p.innerHTML = `<div class="panneau-face">${html}</div>`;
    parent.appendChild(p);
    return p;
  }

  window.VILLE = { TAILLE, REPERES, QUARTIERS, construire, prng, vehicule, panneau, el };
})();
