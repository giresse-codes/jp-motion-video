// « Bento » — JP Service Express Urbaine, 20 s, 9:16, sans voix. Langage visuel d'un mur de widgets (grille bento, 3D,
// lumière studio) : UNE seule scène 3D, un mur de 2 600 × 4 600 px filmé par une caméra virtuelle qui glisse sans coupe.
// La caméra, le flou de mouvement, la profondeur de champ, les ombres, les reflets et tous les compteurs sont des fonctions
// pures du temps (sûres au seek). Les grands mouvements tombent sur les temps de la musique (116 BPM, voir js/temps.js).
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const CLAIR = "#F4F4F4", SOMBRE = "#0E0F0F", CITRON = "#A6D200", ORANGE = "#E8582A", FLUO = "#12E21A", BLEU = "#2F7BF6", G2 = "#B2B4B4";
  const NBSP = String.fromCharCode(160);
  const milliers = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const E = (nom) => gsap.parseEase(nom);
  const MUR = { l: 2600, h: 4600 };

  // ════ Le mur : 7 tuiles de contenu + 23 tuiles de remplissage = 30 tuiles ════
  const TUILES = [
    { id: "gps", x: 60, y: 560, l: 1520, h: 940, ton: "clair" },
    { id: "vol", x: 1640, y: 560, l: 900, h: 520, ton: "sombre" },
    { id: "appel", x: 1640, y: 1140, l: 900, h: 360, ton: "clair" },
    { id: "auto", x: 60, y: 1560, l: 2480, h: 700, ton: "vert" },
    { id: "horloge", x: 60, y: 2320, l: 940, h: 560, ton: "clair" },
    { id: "promo", x: 60, y: 2940, l: 940, h: 700, ton: "clair" },
    { id: "cal", x: 1060, y: 2320, l: 1480, h: 1320, ton: "sombre" },
  ];
  const RANGEES = [[60, 190, [420, 560, 380, 500, 380]], [310, 190, [560, 380, 440, 420, 440]], [3700, 240, [600, 520, 640, 540]], [3970, 240, [440, 520, 380, 500, 400]], [4240, 240, [560, 700, 480, 560]]];
  let n = 0;
  RANGEES.forEach(([y, h, largeurs]) => { let x = 60; largeurs.forEach((l) => { TUILES.push({ id: "r" + n, x, y, l, h, ton: (n * 7) % 3 === 0 ? "sombre" : "clair" }); x += l + 60; n++; }); });

  // ════ Contenus des tuiles (tailles en pixels du mur) ════
  const svgIcone = (d, taille = 56, coul = SOMBRE) => `<svg viewBox="0 0 48 48" width="${taille}" height="${taille}" fill="none" stroke="${coul}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ICO = {
    wifi: '<path d="M8 20a23 23 0 0 1 32 0M13 26a15 15 0 0 1 22 0M18 32a8 8 0 0 1 12 0"/><circle cx="24" cy="37" r="2.5" fill="#0E0F0F"/>',
    clim: '<path d="M24 6v36M8.4 15l31.2 18M8.4 33l31.2-18M19 10l5 4 5-4M19 38l5-4 5 4"/>',
    ecran: '<rect x="6" y="10" width="36" height="24" rx="4"/><path d="M18 40h12M21 17l9 5-9 5Z"/>',
    tel: '<path d="M14 6h-4a4 4 0 0 0-4 4c0 18 14 32 32 32a4 4 0 0 0 4-4v-4l-9-4-4 4c-5-2-9-6-11-11l4-4Z"/>',
  };
  const JOURS = []; // calendrier de novembre 2026 (le 1er est un dimanche), semaines du lundi au dimanche
  [26, 27, 28, 29, 30, 31].forEach((d) => JOURS.push({ d, hors: true }));
  for (let d = 1; d <= 30; d++) JOURS.push({ d });
  [1, 2, 3, 4, 5, 6].forEach((d) => JOURS.push({ d, hors: true }));
  const TRAJETS = [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 23, 24, 25, 26, 27];

  const CONTENU = {
    cal: () => `<div class="titre">Mes trajets</div><div class="pilule" style="right:250px">Novembre</div><div class="pilule" style="right:70px">2026</div>
      <div class="cal-grille">${["L", "M", "M", "J", "V", "S", "D"].map((j) => `<div class="jour-sem">${j}</div>`).join("")}
      ${JOURS.map((j) => `<div class="jour${j.hors ? " hors" : ""}" ${!j.hors && TRAJETS.includes(j.d) ? `data-trajet="${j.d}"` : ""}><i class="rond"></i><span>${j.d}</span></div>`).join("")}</div>`,
    promo: () => `<svg class="eclair" viewBox="0 0 48 48"><path d="M27 3 9 28h13l-3 17 20-27H25Z" fill="${ORANGE}"/></svg><div class="titre promo-titre">Promo Éco</div>
      <div class="ancien" id="ancien">3${NBSP}000 F/h<i></i></div><div class="prix"><span id="prix">3${NBSP}000</span><small> F/h</small></div>
      <div class="barres"><b>${"<u></u>".repeat(5)}</b>${"<i></i>".repeat(5)}</div><div class="des5h" id="des5h">dès 5 h : 2${NBSP}000 F/h</div>`,
    horloge: () => `<svg class="cadran" id="cadran" viewBox="-230 -230 460 460"></svg><div class="depart" id="depart">Départ</div><div class="depart-heure" id="depart-heure">07:45</div>`,
    auto: () => `<div class="titre auto-titre">JP Service · Confort</div><div class="pourcent"><span id="pourcent">0</span><small> %</small></div>
      <div class="jauge"><i id="jauge"></i></div><div class="statut" id="statut">Votre chauffeur arrive</div>
      <div class="voiture" id="voiture"><img src="assets/images/voiture-noire.png" alt="" /><i class="brillance" id="brillance"></i></div>`,
    gps: () => `<svg id="carte" viewBox="0 0 1520 940" width="1520" height="940" style="position:absolute;inset:0"></svg>`,
    appel: () => `<div class="titre appel-nom">Votre chauffeur</div><div class="appel-heure">07:44</div>
      <div class="icones-appel"><i></i><i></i></div><div class="raccrocher" title="raccrocher"></div><div class="decrocher" id="decrocher">${svgIcone(ICO.tel, 84)}</div>`,
    vol: () => `<div class="titre">Prochain trajet</div><div class="trajet"><div class="etape" id="et1"><i></i>Douala</div><div class="ligne-vol" id="ligne-vol"></div><div class="etape" id="et2"><i></i>Aéroport</div></div>`,
  };

  window.CONSTRUIRE = function (tl) {
    const T = window.T, D = T.duree;
    const mur = document.getElementById("mur"), objectif = document.getElementById("objectif");
    const amorce = document.createElement("div"); amorce.className = "amorce"; mur.appendChild(amorce);
    const HX = MUR.l / 2, HY = MUR.h / 2;

    // ── Création des tuiles : face (contenu) + dos (morceau de la photo de la voiture) ──
    TUILES.forEach((t, i) => {
      const d = document.createElement("div");
      d.className = `tuile ${t.ton}`;
      Object.assign(d.style, { left: t.x + "px", top: t.y + "px", width: t.l + "px", height: t.h + "px" });
      d.innerHTML = `<div class="face"><div class="contenu">${CONTENU[t.id] ? CONTENU[t.id]() : ""}</div><i class="reflet"></i></div><div class="dos" style="background-position:${-t.x}px ${-t.y}px"></div>`;
      mur.appendChild(d);
      t.el = d; t.face = d.firstChild; t.reflet = d.querySelector(".reflet");
      t.cx = t.x + t.l / 2; t.cy = t.y + t.h / 2;
      t.z = CONTENU[t.id] ? 40 : ((i * 5) % 4) * 22 - 10; // profondeurs différentes : parallaxe
    });
    const tuile = Object.fromEntries(TUILES.filter((t) => CONTENU[t.id]).map((t) => [t.id, t]));
    // Avion et pastilles : hors de la face (ils sortent de la tuile)
    const avion = document.createElement("div"); avion.className = "avion";
    avion.innerHTML = `<svg viewBox="-34 -34 68 68" width="150" height="150"><path d="M0 -30 C4 -30 5 -24 5 -18 L5 -6 L28 8 L28 14 L5 6 L4 20 L11 25 L11 30 L0 27 L-11 30 L-11 25 L-4 20 L-5 6 L-28 14 L-28 8 L-5 -6 L-5 -18 C-5 -24 -4 -30 0 -30Z" fill="${CLAIR}"/></svg>`;
    tuile.vol.el.appendChild(avion);
    const PAST = [["wifi", "Wi-Fi", 1270], ["clim", "Clim", 1700], ["ecran", "Mini écran", 2060]].map(([ic, txt, x]) => {
      const p = document.createElement("div"); p.className = "pastille"; p.style.left = x + "px"; p.innerHTML = svgIcone(ICO[ic], 50) + txt; tuile.auto.el.appendChild(p); return p;
    });

    // ════ Caméra virtuelle (fonction pure du temps) ════
    const VUE = {
      mur: { fx: 1300, fy: 2300, s: 0.345 }, cal: { fx: 1800, fy: 2990, s: 0.7 }, promo: { fx: 530, fy: 3290, s: 0.98 },
      horloge: { fx: 530, fy: 2600, s: 1.04 }, dedans: { fx: 1300, fy: 1910, s: 2.5 }, auto: { fx: 1330, fy: 1910, s: 0.47 },
      gps: { fx: 820, fy: 1030, s: 0.74 }, appel: { fx: 2090, fy: 1320, s: 1.12 }, vol: { fx: 2090, fy: 820, s: 1.0 },
    };
    // Itinéraire GPS (coordonnées de la tuile) : la caméra suit le point bleu en travelling
    const ROUTE = [190, 790, 320, 700, 250, 560, 430, 520, 610, 480, 640, 360, 830, 330, 1010, 300, 1110, 220, 1320, 170];
    const bez = (pts, p) => {
      const nseg = (pts.length - 2) / 6, u = clamp(p, 0, 0.99999) * nseg, k = Math.floor(u), s = u - k, o = k * 6, m = 1 - s;
      const [x0, y0, x1, y1, x2, y2, x3, y3] = pts.slice(o, o + 8);
      return [m * m * m * x0 + 3 * m * m * s * x1 + 3 * m * s * s * x2 + s * s * s * x3, m * m * m * y0 + 3 * m * m * s * y1 + 3 * m * s * s * y2 + s * s * s * y3];
    };
    const pTrace = (t) => E("power1.inOut")(clamp((t - T.trace[0]) / (T.trace[1] - T.trace[0])));
    const point = (t) => { const [x, y] = bez(ROUTE, pTrace(t)); return { fx: tuile.gps.x + x, fy: tuile.gps.y + y }; };
    const SEG = [ // [début, fin, vue (ou fonction), courbe, rotationY]
      [T.plongee, T.plongee + 0.6, VUE.cal, "expo.inOut", 0],
      [T.virage, T.virage + 0.55, VUE.promo, "back.inOut(1.2)", 15],
      [T.horloge, T.horloge + 0.45, VUE.horloge, "back.inOut(1.2)", 0],
      [T.traverse, T.traverse + 0.26, VUE.dedans, "expo.in", 0],
      [T.traverse + 0.26, T.traverse + 0.7, VUE.auto, "expo.out", 0],
      [T.gps, T.gps + 0.45, VUE.gps, "back.inOut(1.1)", 0],
      [T.trace[0], T.trace[1] + 0.1, (t) => ({ ...point(t), s: 0.98 }), "power2.inOut", 0],
      [T.appel, T.appel + 0.42, VUE.appel, "back.inOut(1.2)", 0],
      [T.vol, T.vol + 0.4, VUE.vol, "back.inOut(1.2)", 0],
      [T.recul, T.recul + 0.5, VUE.mur, "expo.inOut", 0],
    ];
    const camera = (t) => {
      let c = { ...VUE.mur, ry: 0 };
      for (const [a, z, vue, courbe, ry] of SEG) {
        if (t < a) break;
        const p = E(courbe)(clamp((t - a) / (z - a)));
        const cible = typeof vue === "function" ? vue(Math.min(t, z)) : vue;
        c = { fx: lerp(c.fx, cible.fx, p), fy: lerp(c.fy, cible.fy, p), s: lerp(c.s, cible.s, p), ry: lerp(c.ry, ry, p) };
      }
      // Vie : légère dérive permanente, et choc de caméra quand les tuiles se figent
      c.fx += 12 * Math.sin(t * 0.9); c.fy += 9 * Math.sin(t * 0.7 + 1);
      const k = t - T.fige;
      if (k > 0) c.s *= 1 + 0.035 * Math.exp(-k * 7) * Math.sin(k * 38);
      return c;
    };
    const ACTIVE = [["cal", 1.4, 3.3], ["promo", 3.35, 5.3], ["horloge", 5.35, 6.85], ["auto", 7.0, 10.5], ["gps", 10.55, 12.55], ["appel", 12.6, 14.1], ["vol", 14.15, 15.6]];

    // ── Rendu de la caméra, des ombres, des reflets et de la profondeur de champ ──
    const appliquer = (t) => {
      const c = camera(t), p = camera(t - 1 / 30);
      mur.style.transform = `translate3d(540px, 900px, 0) rotateX(14deg) rotateY(${c.ry}deg) rotateZ(-3deg) scale3d(${c.s}, ${c.s}, ${c.s}) translate3d(${-c.fx}px, ${-c.fy}px, 0)`;
      const v = Math.hypot((c.fx - p.fx) * c.s, (c.fy - p.fy) * c.s) + Math.abs(c.s - p.s) * 1800 + Math.abs(c.ry - p.ry) * 30;
      objectif.style.filter = v > 14 ? `blur(${Math.min(9, (v - 14) * 0.09).toFixed(2)}px)` : "none";
      const act = (ACTIVE.find(([, a, z]) => t >= a && t < z) || [null])[0];
      const dof = clamp((c.s - 0.5) / 0.3) * (act ? 1 : 0);
      TUILES.forEach((u) => {
        const dx = clamp((u.cx - c.fx) * 0.02, -40, 40), dy = 40 + clamp((u.cy - c.fy) * 0.01, -20, 20);
        u.face.style.boxShadow = `${dx.toFixed(1)}px ${dy.toFixed(1)}px 90px rgba(14,15,15,.16), ${(dx / 4).toFixed(1)}px ${(dy / 4).toFixed(1)}px 22px rgba(14,15,15,.08)`;
        u.face.style.filter = u.id === act || dof === 0 ? "none" : `blur(${(2.6 * dof).toFixed(2)}px)`;
        u.reflet.style.left = `${clamp(30 - ((u.cx - c.fx) / 1400) * 70, -60, 110)}%`;
      });
    };

    // ════ Contenus animés (fonctions pures du temps) ════
    const prix = document.getElementById("prix"), pourcent = document.getElementById("pourcent"), statut = document.getElementById("statut");
    const cadran = document.getElementById("cadran");
    const el = (p, tag, a = {}) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
    el(cadran, "circle", { r: 226, fill: "#EDEDED" });
    el(cadran, "circle", { r: 212, fill: CLAIR });
    for (let i = 0; i < 60; i++) { const a = (i * Math.PI) / 30, r1 = i % 5 ? 196 : 184; el(cadran, "line", { x1: Math.sin(a) * r1, y1: -Math.cos(a) * r1, x2: Math.sin(a) * 204, y2: -Math.cos(a) * 204, stroke: i % 5 ? G2 : SOMBRE, "stroke-width": i % 5 ? 2 : 5 }); }
    [["XII", 0], ["III", 90], ["VI", 180], ["IX", 270]].forEach(([txt, a]) => { const r = (a * Math.PI) / 180; el(cadran, "text", { x: Math.sin(r) * 150, y: -Math.cos(r) * 150 + 15, "text-anchor": "middle", "font-family": "Inter", "font-weight": 600, "font-size": 42, fill: SOMBRE }).textContent = txt; });
    const fantomes = [0.32, 0.18, 0.09].map((o) => el(cadran, "line", { x1: 0, y1: 20, x2: 0, y2: -168, stroke: SOMBRE, "stroke-width": 10, "stroke-linecap": "round", opacity: 0 }));
    const aH = el(cadran, "line", { x1: 0, y1: 22, x2: 0, y2: -112, stroke: SOMBRE, "stroke-width": 16, "stroke-linecap": "round" });
    const aM = el(cadran, "line", { x1: 0, y1: 24, x2: 0, y2: -170, stroke: SOMBRE, "stroke-width": 10, "stroke-linecap": "round" });
    const aS = el(cadran, "line", { x1: 0, y1: 34, x2: 0, y2: -186, stroke: ORANGE, "stroke-width": 4, "stroke-linecap": "round" });
    el(cadran, "circle", { r: 13, fill: ORANGE });
    const aiguilles = (t) => {
      const a = T.horloge + 0.1, z = T.arret;
      let m, h, s, vit = 0;
      if (t < a) { m = 60; h = 305; s = (t * 36) % 360; }
      else if (t < z) { const p = (t - a) / (z - a), e = E("power2.in")(p); m = 60 + 2010 * e; h = 305 + 287.5 * e; s = m * 2.6; vit = p; }
      else { const k = t - z, rebond = 7 * Math.exp(-k * 18) * Math.sin(k * 60); m = 270 + 1800 + rebond; h = 232.5 + 360 + rebond / 12; s = 0 + rebond * 2; }
      aM.setAttribute("transform", `rotate(${m})`); aH.setAttribute("transform", `rotate(${h})`); aS.setAttribute("transform", `rotate(${s})`);
      fantomes.forEach((f, i) => { f.setAttribute("transform", `rotate(${m - (i + 1) * 9 * vit * 3})`); f.setAttribute("opacity", (vit * [0.32, 0.18, 0.09][i]).toFixed(2)); });
    };
    const compteurs = (t) => {
      const [a, z] = T.compteur, p = E("power2.out")(clamp((t - a) / (z - a)));
      prix.textContent = milliers(Math.round((3000 - 500 * p) / 10) * 10);
      const [pa, pz] = T.pourcent, q = E("power1.inOut")(clamp((t - pa) / (pz - pa)));
      pourcent.textContent = String(Math.round(q * 100));
      const arrive = t >= T.arrive;
      if (statut._arrive !== arrive) { statut.innerHTML = arrive ? "Arrivé <b>✓</b>" : "Votre chauffeur arrive"; statut._arrive = arrive; }
    };
    // Carte GPS
    const carte = document.getElementById("carte");
    el(carte, "rect", { width: 1520, height: 940, fill: CLAIR });
    [[0, 610, 1520, 520], [120, 0, 260, 940], [560, 0, 700, 940], [930, 0, 900, 940], [1250, 0, 1380, 940], [0, 260, 1520, 300], [0, 420, 1520, 360], [0, 840, 1520, 800]].forEach(([x1, y1, x2, y2], i) =>
      el(carte, "line", { x1, y1, x2, y2, stroke: i % 2 ? "#E6E6E6" : "#DCDDDD", "stroke-width": i % 3 ? 26 : 40, "stroke-linecap": "round" }));
    let dR = `M${ROUTE[0]} ${ROUTE[1]}`; for (let o = 2; o < ROUTE.length; o += 6) dR += ` C${ROUTE.slice(o, o + 6).join(" ")}`;
    el(carte, "path", { d: dR, stroke: "#DCDDDD", "stroke-width": 30, fill: "none", "stroke-linecap": "round" });
    const trace = el(carte, "path", { d: dR, stroke: SOMBRE, "stroke-width": 16, fill: "none", "stroke-linecap": "round", pathLength: 1, "stroke-dasharray": "1 1", "stroke-dashoffset": 1 });
    [[ROUTE[0], ROUTE[1], "Akwa", -40, 70], [ROUTE[18], ROUTE[19], "Bonapriso", -150, -120]].forEach(([x, y, nom, ox, oy]) => {
      el(carte, "circle", { cx: x, cy: y, r: 22, fill: SOMBRE });
      const g = document.createElement("div"); g.className = "etiquette-lieu"; g.textContent = nom; g.style.left = x + ox + "px"; g.style.top = y + oy + "px"; carte.parentNode.appendChild(g);
    });
    const halo = el(carte, "circle", { r: 46, fill: BLEU, opacity: 0.18 });
    const bleu = el(carte, "circle", { r: 22, fill: BLEU, stroke: "#fff", "stroke-width": 7 });
    const gps = (t) => {
      const p = pTrace(t); trace.setAttribute("stroke-dashoffset", 1 - p);
      const [x, y] = bez(ROUTE, p); [halo, bleu].forEach((c) => { c.setAttribute("cx", x); c.setAttribute("cy", y); });
      halo.setAttribute("r", 40 + 10 * Math.sin(t * 8));
    };

    const temps = { t: 0 };
    const horloge = (t) => { appliquer(t); aiguilles(t); compteurs(t); gps(t); };
    horloge(0);
    tl.fromTo(temps, { t: 0 }, { t: D, duration: D, ease: "none", onUpdate: () => horloge(temps.t), immediateRender: true }, 0);

    // ════ 1. HOOK : une petite tuile noire pulse puis explose en 30 tuiles qui se figent en grille ════
    tl.fromTo(amorce, { scale: 1 }, { keyframes: [{ scale: 1.18, duration: 0.12, ease: "power2.out" }, { scale: 0.94, duration: 0.14, ease: "power2.in" }, { scale: 1, duration: 0.1 }], immediateRender: true }, T.pulse);
    tl.to(amorce, { scale: 1.5, duration: 0.06 }, T.explosion - 0.06);
    tl.set(amorce, { visibility: "hidden" }, T.explosion);
    TUILES.forEach((u, i) => {
      const r = ((i * 7919) % 1000) / 1000;
      tl.set(u.el, { visibility: "visible" }, T.explosion);
      tl.fromTo(u.el, { x: HX - u.cx, y: HY - u.cy, z: 300 + r * 700, scale: 0.06, rotation: (r - 0.5) * 180, rotationX: 0 },
        { x: 0, y: 0, z: u.z, scale: 1, rotation: 0, duration: 0.5 + r * 0.12, ease: "back.out(1.25)", immediateRender: false }, T.explosion + r * 0.06);
    });

    // ════ 2. Calendrier : les jours se remplissent en cascade ════
    const jours = [...document.querySelectorAll("[data-trajet]")];
    jours.forEach((j, k) => {
      const t = T.cascade[0] + (k * (T.cascade[1] - T.cascade[0])) / (jours.length - 1);
      tl.fromTo(j.firstChild, { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2.4)", immediateRender: false }, t);
      tl.fromTo(j.lastChild, { color: CLAIR }, { color: SOMBRE, duration: 0.1, immediateRender: false }, t + 0.05);
    });

    // ════ 3. Promo Éco : 5 barres orange, 3 000 F barré, compteur jusqu'à 2 500 F/h, ligne « dès 5 h » ════
    document.querySelectorAll(".barres i").forEach((b, k) => tl.fromTo(b, { scaleY: 0 }, { scaleY: 1, duration: 0.42, ease: "back.out(2.2)", immediateRender: false }, T.barres[k]));
    tl.fromTo("#ancien", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.25, immediateRender: false }, T.barre - 0.05);
    tl.fromTo("#ancien i", { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "power3.out", immediateRender: false }, T.barre);
    tl.set("#ancien", { opacity: 0 }, 0);
    tl.fromTo("#des5h", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)", immediateRender: false }, T.des5h);

    // ════ 4. Horloge : « Départ 07:45 » à l'arrêt net ════
    tl.set(["#depart", "#depart-heure"], { opacity: 0 }, 0);
    tl.fromTo(["#depart", "#depart-heure"], { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.3, ease: "back.out(2)", stagger: 0.06, immediateRender: false }, T.arret + 0.05);

    // ════ 5. Voiture : entrée glissée, reflet qui balaie, 0 → 100 %, « Arrivé ✓ », pastilles en 3D ════
    tl.fromTo("#voiture", { x: 900, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "back.out(1.1)", immediateRender: true }, T.voitureEntre);
    tl.fromTo("#brillance", { backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0", duration: 0.9, ease: "power2.inOut", immediateRender: true }, T.reflet);
    tl.fromTo("#jauge", { scaleX: 0 }, { scaleX: 1, duration: T.pourcent[1] - T.pourcent[0], ease: "power1.inOut", immediateRender: true }, T.pourcent[0]);
    tl.to("#jauge", { keyframes: [{ scaleX: 1.04, duration: 0.12, ease: "power2.out" }, { scaleX: 1, duration: 0.25, ease: "back.out(2)" }] }, T.pourcent[1]);
    tl.to(statut, { opacity: 0, y: -16, duration: 0.15 }, T.arrive - 0.15);
    tl.fromTo(statut, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(2.5)", immediateRender: false }, T.arrive);
    PAST.forEach((p, k) => {
      tl.fromTo(p, { opacity: 0, z: 0, y: 40, scale: 0.6 }, { opacity: 1, z: 180, y: -30, scale: 1, duration: 0.5, ease: "back.out(2)", immediateRender: false }, T.pastilles[k]);
      tl.to(p, { y: -44, duration: 0.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, T.pastilles[k] + 0.5);
      tl.to(p, { opacity: 0, duration: 0.2 }, T.recul);
    });

    // ════ 7. Appel : bouton vert qui pulse ════
    tl.fromTo("#decrocher", { scale: 1, boxShadow: "0 0 0 0 rgba(18,226,26,.45)" }, { scale: 1.07, boxShadow: "0 0 0 34px rgba(18,226,26,0)", duration: 0.42, repeat: 3, ease: "sine.out", immediateRender: false }, T.appel + 0.25);

    // ════ 8. Prochain trajet : Douala → Aéroport, l'avion décolle et sort de la tuile ════
    tl.set(["#et1", "#et2"], { opacity: 0 }, 0);
    tl.fromTo("#et1", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.25, ease: "back.out(2)", immediateRender: false }, T.vol + 0.15);
    tl.fromTo("#ligne-vol", { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: "power2.out", immediateRender: true }, T.vol + 0.35);
    tl.fromTo("#et2", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.25, ease: "back.out(2)", immediateRender: false }, T.vol + 0.6);
    tl.fromTo(avion, { x: 0, y: 0, z: 0, rotation: 0, scale: 1 }, { x: 520, y: -640, z: 260, rotation: 28, scale: 1.5, duration: 0.8, ease: "power2.in", immediateRender: true }, T.decolle);
    tl.set(avion, { visibility: "hidden" }, T.decolle + 0.8);

    // ════ 9. Recul, puis toutes les tuiles se retournent en vague (domino de haut en bas) : la photo de la voiture ════
    const [f0, f1] = T.flip;
    TUILES.forEach((u) => tl.to(u.el, { rotationX: -180, duration: 0.5, ease: "back.out(1.15)" }, f0 + ((u.y / MUR.h) * (f1 - f0 - 0.5)) + (u.x / MUR.l) * 0.06));

    // ════ 10. La photo se fragmente, les tuiles tombent dans le noir ; logo, slogan, WhatsApp ════
    TUILES.forEach((u, i) => {
      const r = ((i * 4271) % 1000) / 1000;
      tl.to(u.el, { y: 2600 + r * 900, rotation: (r - 0.5) * 70, rotationX: -180 - 40 - r * 60, z: -200 + r * 400, duration: 1.0, ease: "power2.in" }, T.chute + r * 0.35);
    });
    tl.fromTo("#noir", { opacity: 0 }, { opacity: 1, duration: 0.55, ease: "power2.inOut", immediateRender: false }, T.chute + 0.05);
    tl.fromTo("#logo", { opacity: 0, scale: 1.08, filter: "blur(26px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.0, ease: "power3.out", immediateRender: false }, T.logo);
    tl.fromTo("#slogan", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, T.slogan);
    tl.fromTo("#contact", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, T.whatsapp);
    tl.to("#logo", { scale: 1.02, duration: 1.4, ease: "sine.inOut" }, T.logo + 1.0);

    tl.to({}, { duration: D }, 0);
  };
})();
