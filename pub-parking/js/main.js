// « Parking à Akwa » — JP Service Express Urbaine (15 s, 9:16, voix off fournie).
// STOP rouge, voiture qui tourne en rond vue de dessus, arrêt sur image + balayage, arrivée premium
// devant la porte, logo + prix + WhatsApp. Sous-titres mot par mot. Timeline GSAP en pause, déterministe.

(function () {
  const NS = "http://www.w3.org/2000/svg";
  const RUES_X = [-180, 300, 780, 1260];
  const RUES_Y = [240, 720, 1200, 1680];
  const LARGEUR_RUE = 150;

  const svg = (parent, nom, attrs) => {
    const el = document.createElementNS(NS, nom);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    parent.appendChild(el);
    return el;
  };

  // Voiture vue de dessus (centrée sur 0,0, avant vers la droite).
  function voitureDessus(parent, couleur, l = 120, h = 58, feux = false) {
    const g = svg(parent, "g", {});
    svg(g, "rect", { x: -l / 2, y: -h / 2, width: l, height: h, rx: 16, fill: couleur });
    svg(g, "rect", { x: l * 0.08, y: -h / 2 + 7, width: l * 0.2, height: h - 14, rx: 6, fill: "rgba(0,0,0,.45)" });
    svg(g, "rect", { x: -l * 0.36, y: -h / 2 + 8, width: l * 0.16, height: h - 16, rx: 5, fill: "rgba(0,0,0,.4)" });
    if (feux) {
      svg(g, "rect", { x: -l / 2 - 2, y: -h / 2 + 4, width: 6, height: 12, rx: 3, fill: "#FF2D1F" });
      svg(g, "rect", { x: -l / 2 - 2, y: h / 2 - 16, width: 6, height: 12, rx: 3, fill: "#FF2D1F" });
      svg(g, "path", { d: `M${l / 2} ${-h / 2 + 6} l140 -40 v52Z M${l / 2} ${h / 2 - 6} l140 40 v-52Z`, fill: "rgba(255,255,255,.08)" });
    }
    return g;
  }

  function construirePlan() {
    const plan = document.getElementById("plan");
    svg(plan, "rect", { x: 0, y: 0, width: 1080, height: 1920, fill: "#2a2b31" });
    // Pâtés de maisons entre les rues.
    for (let i = 0; i < RUES_X.length - 1; i++) {
      for (let j = 0; j < RUES_Y.length - 1; j++) {
        const x0 = RUES_X[i] + LARGEUR_RUE / 2, x1 = RUES_X[i + 1] - LARGEUR_RUE / 2;
        const y0 = RUES_Y[j] + LARGEUR_RUE / 2, y1 = RUES_Y[j + 1] - LARGEUR_RUE / 2;
        svg(plan, "rect", { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: 26, fill: "#121318" });
        svg(plan, "rect", { x: x0 + 30, y: y0 + 30, width: x1 - x0 - 60, height: y1 - y0 - 60, rx: 14, fill: "#17181e" });
      }
    }
    // Marquage central.
    RUES_X.forEach((x) => svg(plan, "line", { x1: x, y1: 0, x2: x, y2: 1920, stroke: "#55565e", "stroke-width": 4, "stroke-dasharray": "40 40" }));
    RUES_Y.forEach((y) => svg(plan, "line", { x1: 0, y1: y, x2: 1080, y2: y, stroke: "#55565e", "stroke-width": 4, "stroke-dasharray": "40 40" }));
    // Voitures garées partout : aucune place libre.
    const GRIS = ["#4d4e55", "#5d5e66", "#3e3f45", "#6b6c73"];
    let k = 0;
    RUES_X.forEach((x) => {
      for (let y = 30; y < 1900; y += 92) {
        if (RUES_Y.some((ry) => Math.abs(ry - y) < 110)) continue;
        [-1, 1].forEach((s) => {
          const g = voitureDessus(plan, GRIS[k++ % 4], 84, 44);
          g.setAttribute("transform", `translate(${x + s * 52} ${y}) rotate(90)`);
        });
      }
    });
    RUES_Y.forEach((y) => {
      for (let x = 30; x < 1080; x += 104) {
        if (RUES_X.some((rx) => Math.abs(rx - x) < 110)) continue;
        [-1, 1].forEach((s) => {
          const g = voitureDessus(plan, GRIS[k++ % 4], 84, 44);
          g.setAttribute("transform", `translate(${x} ${y + s * 52})`);
        });
      }
    });
    // Panneaux « P COMPLET ».
    [[420, 860], [660, 1060], [880, 600]].forEach(([x, y]) => {
      svg(plan, "rect", { x: x - 44, y: y - 44, width: 88, height: 88, rx: 18, fill: "#fff" });
      const t = svg(plan, "text", { x, y: y + 28, "text-anchor": "middle", "font-family": "Montserrat", "font-weight": 900, "font-size": 74, fill: "#1B2A6B" });
      t.textContent = "P";
      svg(plan, "line", { x1: x - 34, y1: y + 34, x2: x + 34, y2: y - 34, stroke: "#E10600", "stroke-width": 12, "stroke-linecap": "round" });
    });
    const nom = svg(plan, "text", { x: 540, y: 965, "text-anchor": "middle", "font-family": "Inter", "font-weight": 700, "font-size": 34, "letter-spacing": 10, fill: "#4a4b53" });
    nom.textContent = "AKWA";
    // Boucle de la voiture autour du pâté central, et sa traînée.
    const d = "M360 720 H720 Q780 720 780 780 V1140 Q780 1200 720 1200 H360 Q300 1200 300 1140 V780 Q300 720 360 720 Z";
    const trace = svg(plan, "path", { d, fill: "none", stroke: "#FF2D1F", "stroke-width": 10, "stroke-linecap": "round", opacity: 0.55 });
    const chemin = svg(plan, "path", { d, fill: "none", stroke: "none" });
    const auto = voitureDessus(plan, "#f4f4f6", 124, 60, true);
    return { chemin, trace, auto };
  }

  // Rue de nuit en vue de côté : façade, porte éclairée, voiture premium.
  function construireRue() {
    const rue = document.getElementById("rue");
    const defs = svg(rue, "defs", {});
    const lg = svg(defs, "linearGradient", { id: "carrosserie", x1: 0, y1: 0, x2: 0, y2: 1 });
    svg(lg, "stop", { offset: "0", "stop-color": "#3a3b42" });
    svg(lg, "stop", { offset: ".45", "stop-color": "#15161a" });
    svg(lg, "stop", { offset: "1", "stop-color": "#050506" });
    const halo = svg(defs, "radialGradient", { id: "halo", cx: ".5", cy: ".5", r: ".5" });
    svg(halo, "stop", { offset: "0", "stop-color": "rgba(255,255,255,.35)" });
    svg(halo, "stop", { offset: "1", "stop-color": "rgba(255,255,255,0)" });
    svg(rue, "rect", { x: 0, y: 0, width: 1080, height: 1920, fill: "#0b0c10" });
    // Façade.
    svg(rue, "rect", { x: 0, y: 640, width: 1080, height: 560, fill: "#15161c" });
    for (let x = 40; x < 1080; x += 260) svg(rue, "rect", { x, y: 690, width: 180, height: 150, rx: 8, fill: "#1d1f27" });
    // Porte d'entrée (là où la voiture doit s'arrêter).
    svg(rue, "ellipse", { cx: 640, cy: 900, rx: 300, ry: 260, fill: "url(#halo)" });
    svg(rue, "rect", { x: 560, y: 880, width: 160, height: 320, rx: 6, fill: "#e9e4dc" });
    svg(rue, "rect", { x: 572, y: 892, width: 136, height: 308, rx: 4, fill: "#c9c1b4" });
    svg(rue, "rect", { x: 530, y: 860, width: 220, height: 20, rx: 4, fill: "#2a2b33" });
    svg(rue, "rect", { x: 690, y: 1040, width: 8, height: 40, rx: 4, fill: "#6d6a64" });
    // Trottoir et chaussée.
    svg(rue, "rect", { x: 0, y: 1200, width: 1080, height: 50, fill: "#24252c" });
    svg(rue, "rect", { x: 0, y: 1250, width: 1080, height: 670, fill: "#0d0e12" });
    svg(rue, "rect", { x: 0, y: 1236, width: 1080, height: 6, fill: "#3a3b44" });
    // Lumière sur le trottoir quand la portière s'ouvre.
    const flaque = svg(rue, "ellipse", { cx: 640, cy: 1262, rx: 260, ry: 26, fill: "rgba(255,255,255,.22)", opacity: 0 });
    // Voiture premium (vue de côté), avant vers la droite, longueur ~820.
    const v = svg(rue, "g", { id: "berline" });
    svg(v, "ellipse", { cx: 410, cy: 268, rx: 400, ry: 18, fill: "rgba(0,0,0,.7)" });
    const caisse = svg(v, "g", { id: "caisse" });
    svg(caisse, "path", { d: "M20 200 Q14 150 60 140 L210 122 Q300 50 400 44 L560 44 Q640 48 700 120 L780 134 Q818 142 816 190 L812 236 Q810 250 790 250 L36 250 Q20 250 20 236Z", fill: "url(#carrosserie)" });
    svg(caisse, "path", { d: "M236 124 Q312 64 400 60 L470 60 L470 124Z", fill: "#262a33" });
    svg(caisse, "path", { d: "M486 60 L556 60 Q620 64 676 124 L486 124Z", fill: "#262a33" });
    svg(caisse, "path", { d: "M40 168 L800 168", stroke: "rgba(220,220,228,.5)", "stroke-width": 3 });
    svg(caisse, "rect", { x: 790, y: 150, width: 24, height: 14, rx: 6, fill: "#fff" });
    svg(caisse, "rect", { x: 18, y: 152, width: 22, height: 16, rx: 5, fill: "#FF2D1F" });
    // Portière arrière (s'ouvre vers le spectateur).
    const portiere = svg(caisse, "g", { id: "portiere" });
    svg(portiere, "path", { d: "M300 124 L478 124 L478 244 L300 244 Q290 180 300 124Z", fill: "#1c1d22", stroke: "rgba(255,255,255,.12)", "stroke-width": 2 });
    svg(portiere, "rect", { x: 420, y: 176, width: 40, height: 8, rx: 4, fill: "#9a9aa2" });
    const interieur = svg(caisse, "rect", { x: 302, y: 126, width: 174, height: 116, fill: "#d8d2c8", opacity: 0 });
    caisse.insertBefore(interieur, portiere);
    [180, 650].forEach((cx) => {
      const r = svg(v, "g", { class: "roue" });
      r.setAttribute("transform", `translate(${cx} 250)`);
      svg(r, "circle", { r: 58, fill: "#050506" });
      svg(r, "circle", { r: 34, fill: "#2b2c32" });
      for (let a = 0; a < 5; a++) svg(r, "rect", { x: -4, y: -32, width: 8, height: 30, fill: "#7a7b82", transform: `rotate(${a * 72})` });
    });
    return { flaque, interieur };
  }

  // Sous-titres : mots répartis dans chaque segment de voix au prorata de leur longueur.
  function construireSousTitres(tl, T) {
    const zone = document.getElementById("sous-titres");
    const masque = (t) => T.sansSousTitres.some(([a, b]) => t >= a && t < b);
    T.segments.forEach(([a, b, texte]) => {
      const mots = texte.split(" ").filter((m) => !/^[:?]$/.test(m) || false);
      const poids = mots.map((m) => Math.max(m.replace(/[^\p{L}\d]/gu, "").length, 3) + 2);
      const total = poids.reduce((s, p) => s + p, 0);
      let t = a;
      const debuts = poids.map((p) => { const d = t; t += ((b - a) * p) / total; return d; });
      // Morceaux de 3 mots au plus, coupés après la ponctuation.
      const morceaux = [];
      let cour = [];
      mots.forEach((m, i) => {
        cour.push(i);
        if (cour.length === 3 || /[,.:?]$/.test(m) || i === mots.length - 1) { morceaux.push(cour); cour = []; }
      });
      morceaux.forEach((idx, n) => {
        const t0 = debuts[idx[0]];
        const t1 = n + 1 < morceaux.length ? debuts[morceaux[n + 1][0]] : b + 0.25;
        if (masque(t0)) return;
        const div = document.createElement("div");
        div.className = "morceau";
        zone.appendChild(div);
        tl.set(div, { opacity: 1 }, t0);
        tl.set(div, { opacity: 0 }, t1);
        idx.forEach((i, k) => {
          const span = document.createElement("span");
          span.className = "mot";
          span.textContent = mots[i].replace(/\s*[:]$/, "");
          div.appendChild(span);
          const td = debuts[i];
          const tf = k + 1 < idx.length ? debuts[idx[k + 1]] : t1;
          tl.fromTo(span, { opacity: 0, y: 24, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.12, ease: "back.out(2.5)", immediateRender: false }, td);
          tl.set(span, { backgroundColor: "#E10600" }, td);
          tl.set(span, { backgroundColor: "rgba(0,0,0,0)" }, Math.min(tf, td + 0.45));
        });
      });
    });
  }

  window.CONSTRUIRE = function (tl) {
    const T = window.T;
    const $ = (id) => document.getElementById(id);
    const tous = (sel) => Array.from(document.querySelectorAll(sel));
    const secousse = (t, f = 1) => tl.fromTo("#camera", { x: 0, y: 0 }, { keyframes: [{ x: -16 * f, y: 9 * f, duration: 0.04 }, { x: 12 * f, y: -7 * f, duration: 0.05 }, { x: 0, y: 0, duration: 0.08 }], immediateRender: false }, t);

    // ════ HOOK : STOP. sur rouge qui flashe ════
    tl.fromTo("#stop", { scale: 2.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.12, ease: "power4.in" }, T.stop);
    secousse(T.stop + 0.12, 1.4);
    [0.24, 0.3, 0.38, 0.44].forEach((t, i) => tl.set("#hook-fond", { backgroundColor: i % 2 ? "#E10600" : "#08080a" }, t));
    tl.fromTo("#stop", { scale: 1 }, { scale: 1.08, duration: 0.8, ease: "none", immediateRender: false }, 0.2);
    tl.set("#hook", { opacity: 0 }, T.titre - 0.02);

    // ════ « 20 MIN POUR UN PARKING ? » ════
    tous(".titre .ligne").forEach((el, i) => {
      tl.fromTo(el, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.13, ease: "power4.in" }, T.titre + i * 0.28);
      secousse(T.titre + i * 0.28 + 0.13, 0.8);
    });
    tl.set("#titre", { opacity: 0 }, T.carte);

    // ════ CARTE : la voiture tourne en rond, le chrono s'emballe ════
    const { chemin, trace, auto } = construirePlan();
    const L = chemin.getTotalLength();
    trace.setAttribute("stroke-dasharray", `${L * 3} ${L * 3}`);
    const course = { p: 0 };
    const majAuto = () => {
      const s = (course.p * L) % L;
      const a = chemin.getPointAtLength(s), b = chemin.getPointAtLength((s + 6) % L);
      const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      auto.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${ang})`);
      trace.setAttribute("stroke-dashoffset", `${L * 3 - Math.min(course.p, 3) * L}`);
    };
    majAuto();
    tl.set("#carte-zone", { opacity: 1 }, T.carte);
    tl.fromTo(course, { p: 0 }, { p: 2.3, duration: T.fige - T.carte, ease: "power1.in", onUpdate: majAuto }, T.carte);
    tl.fromTo("#carte", { scale: 1.25, rotation: 0 }, { scale: 1, rotation: 0, duration: T.zoom - T.carte, ease: "power2.out" }, T.carte);
    // Changement de plan : on se rapproche, le plan bascule.
    tl.fromTo("#carte", { scale: 1.7, rotation: -14 }, { scale: 1.55, rotation: -8, duration: T.fige - T.zoom, ease: "none", immediateRender: false }, T.zoom);
    secousse(T.zoom, 0.6);
    tl.fromTo("#chrono-boite", { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "back.out(2)" }, T.carte + 0.1);
    const chrono = { m: 0 };
    tl.fromTo(chrono, { m: 0 }, { m: 20, duration: T.fige - T.carte - 0.1, ease: "power2.in", onUpdate: () => {
      const tot = Math.round(chrono.m * 60);
      $("chrono").textContent = `${String(Math.floor(tot / 60)).padStart(2, "0")}:${String(tot % 60).padStart(2, "0")}`;
    } }, T.carte + 0.1);
    tl.set("#chrono", { color: "#FF2D1F" }, T.zoom);

    // ════ ARRÊT SUR IMAGE : tout se fige, silence, puis balayage géométrique ════
    tl.set("#carte-zone", { filter: "grayscale(1) brightness(.55)" }, T.fige);
    tl.set("#chrono", { color: "#ffffff" }, T.fige);
    tl.fromTo("#fige", { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.15, ease: "power2.out" }, T.fige);
    tous(".balayage i").forEach((el, i) => {
      tl.fromTo(el, { x: 0 }, { x: 3200, duration: 0.75, ease: "power3.inOut" }, T.balayage + i * 0.06);
    });
    tl.set(["#carte-zone", "#fige"], { opacity: 0 }, T.balayage + 0.36);

    // ════ CALME : la voiture premium s'arrête pile devant la porte ════
    const { flaque, interieur } = construireRue();
    tl.set("#calme", { opacity: 1 }, T.balayage + 0.36);
    tl.fromTo("#rue", { scale: 1.08 }, { scale: 1, duration: T.logo - T.balayage, ease: "power1.out" }, T.balayage + 0.36);
    // Voiture : x de départ hors champ ; à l'arrêt, sa portière arrière (300-478) fait face à la porte (560-720).
    const X_ARRET = 640 - 389;
    tl.fromTo("#berline", { x: -1000, y: 958 }, { x: X_ARRET, y: 958, duration: T.arret - T.arrivee, ease: "power3.out" }, T.arrivee);
    const roues = { a: 0 };
    tl.fromTo(roues, { a: 0 }, { a: 1, duration: T.arret - T.arrivee, ease: "power3.out", onUpdate: () => {
      tous(".roue").forEach((r, i) => { const cx = i ? 650 : 180; r.setAttribute("transform", `translate(${cx} 250) rotate(${roues.a * 1180})`); });
    } }, T.arrivee);
    // Petit plongeon de la suspension à l'arrêt.
    tl.fromTo("#caisse", { y: 0 }, { keyframes: [{ y: 7, duration: 0.12 }, { y: -3, duration: 0.14 }, { y: 0, duration: 0.16 }], immediateRender: false }, T.arret - 0.05);
    tl.fromTo("#portiere", { svgOrigin: "300 184", scaleX: 1, skewY: 0 }, { scaleX: 0.18, skewY: -6, duration: 0.7, ease: "power2.inOut" }, T.portiere);
    tl.fromTo(interieur, { opacity: 0 }, { opacity: 1, duration: 0.4 }, T.portiere + 0.1);
    tl.fromTo(flaque, { opacity: 0 }, { opacity: 1, duration: 0.5 }, T.portiere + 0.2);
    tl.fromTo("#t-descendez", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, T.descendez);
    tl.fromTo("#t-ongere", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, T.onGere);
    tl.set("#calme", { opacity: 0 }, T.logo);

    // ════ FIN : logo, prix, WhatsApp ════
    tl.set("#fin", { opacity: 1 }, T.logo);
    tl.fromTo("#logo", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" }, T.logo);
    tl.fromTo("#sous-logo", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, T.logo + 0.35);
    tl.fromTo("#prix", { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.16, ease: "power4.in" }, T.prix + 0.75);
    secousse(T.prix + 0.91, 0.8);
    tl.fromTo("#cta", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.6)" }, T.cta);
    tl.fromTo("#cta", { scale: 1 }, { keyframes: [{ scale: 1.05, duration: 0.25 }, { scale: 1, duration: 0.3 }], immediateRender: false }, T.cta + 0.5);

    construireSousTitres(tl, T);
    // Horloge maîtresse : garantit la durée totale.
    tl.to({}, { duration: T.duree }, 0);
  };
})();
