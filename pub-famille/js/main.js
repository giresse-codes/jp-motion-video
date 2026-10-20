// « Famille à Limbé » — JP Service Express Urbaine (22 s, 9:16, voix off fournie). Style Golden Hour.
// Groupe « Famille » qui s'agite puis se tait, bascule bleu nuit, trajet Douala -> Limbé + timeline cochée,
// voiture qui s'arrête, prix + offre 3 jours, destinations, outro au coucher du soleil, retour à l'image 1.
// La lumière évolue de l'aube au soir. Timeline GSAP en pause, déterministe.

(function () {
  const NS = "http://www.w3.org/2000/svg";
  const svg = (parent, nom, attrs) => {
    const el = document.createElementNS(NS, nom);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    parent.appendChild(el);
    return el;
  };
  // Pseudo-aléatoire déterministe.
  const alea = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  function palmier(parent, x, y, h, couleur) {
    const g = svg(parent, "g", { transform: `translate(${x} ${y})` });
    svg(g, "path", { d: `M0 0 Q${h * 0.12} ${-h * 0.5} ${h * 0.05} ${-h}`, stroke: couleur, "stroke-width": h * 0.05, fill: "none", "stroke-linecap": "round" });
    for (let k = 0; k < 7; k++) {
      const a = -160 + k * 35, r = h * 0.42;
      const ex = h * 0.05 + Math.cos((a * Math.PI) / 180) * r, ey = -h + Math.sin((a * Math.PI) / 180) * r * 0.6 + r * 0.25;
      svg(g, "path", { d: `M${h * 0.05} ${-h} Q${(h * 0.05 + ex) / 2} ${-h - r * 0.3} ${ex} ${ey}`, stroke: couleur, "stroke-width": h * 0.035, fill: "none", "stroke-linecap": "round" });
    }
  }

  function construirePaysage() {
    // Plan lointain : skyline de Douala.
    const loin = document.getElementById("plan-loin");
    let x = 0, i = 0;
    while (x < 1400) {
      const l = 50 + alea(i) * 90, h = 90 + alea(i + 50) * 220;
      svg(loin, "rect", { x, y: 330 - h, width: l, height: h + 40, fill: "rgba(110, 50, 90, .45)" });
      if (alea(i + 9) > 0.6) svg(loin, "rect", { x: x + l / 2 - 3, y: 330 - h - 40, width: 6, height: 40, fill: "rgba(110, 50, 90, .45)" });
      x += l + 6; i++;
    }
    // Plan du milieu : pont du Wouri + palmiers.
    const milieu = document.getElementById("plan-milieu");
    svg(milieu, "rect", { x: 0, y: 340, width: 1400, height: 400, fill: "rgba(150, 70, 90, .35)" });
    svg(milieu, "rect", { x: 0, y: 330, width: 1400, height: 16, fill: "rgba(70, 30, 55, .8)" });
    for (let px = 20; px < 1400; px += 120) {
      svg(milieu, "rect", { x: px, y: 346, width: 14, height: 80, fill: "rgba(70, 30, 55, .8)" });
      svg(milieu, "path", { d: `M${px + 7} 346 Q${px + 67} 400 ${px + 127} 346`, stroke: "rgba(70, 30, 55, .6)", "stroke-width": 6, fill: "none" });
    }
    [90, 420, 980, 1260].forEach((px, k) => palmier(milieu, px, 470, 170 + k * 12, "rgba(70, 28, 50, .85)"));
    // Plan proche : route + palmiers sombres.
    const proche = document.getElementById("plan-proche");
    svg(proche, "rect", { x: 0, y: 470, width: 1400, height: 260, fill: "#3B2232" });
    svg(proche, "rect", { x: 0, y: 462, width: 1400, height: 10, fill: "#5A3445" });
    const tirets = svg(proche, "g", { id: "tirets" });
    for (let px = 0; px < 2800; px += 140) svg(tirets, "rect", { x: px, y: 590, width: 70, height: 8, rx: 4, fill: "#FFC94D", opacity: 0.7 });
    [[-20, 700, 380], [1250, 700, 420]].forEach(([px, py, h]) => palmier(proche, px, py, h, "#24121E"));
  }

  function construireBerline() {
    const v = document.getElementById("berline");
    const defs = svg(v, "defs", {});
    const lg = svg(defs, "linearGradient", { id: "caisse-g", x1: 0, y1: 0, x2: 0, y2: 1 });
    [["0", "#4a3a4a"], [".4", "#1c1418"], ["1", "#07050a"]].forEach(([o, c]) => svg(lg, "stop", { offset: o, "stop-color": c }));
    svg(v, "ellipse", { cx: 410, cy: 268, rx: 400, ry: 16, fill: "rgba(0,0,0,.45)" });
    const caisse = svg(v, "g", { id: "caisse" });
    svg(caisse, "path", { d: "M20 200 Q14 150 60 140 L210 122 Q300 50 400 44 L560 44 Q640 48 700 120 L780 134 Q818 142 816 190 L812 236 Q810 250 790 250 L36 250 Q20 250 20 236Z", fill: "url(#caisse-g)" });
    svg(caisse, "path", { d: "M236 124 Q312 64 400 60 L470 60 L470 124Z", fill: "#3a3040" });
    svg(caisse, "path", { d: "M486 60 L556 60 Q620 64 676 124 L486 124Z", fill: "#3a3040" });
    svg(caisse, "path", { d: "M250 118 Q320 70 400 66", stroke: "rgba(255,200,140,.55)", "stroke-width": 5, fill: "none" });
    svg(caisse, "path", { d: "M40 168 L800 168", stroke: "rgba(255,210,160,.55)", "stroke-width": 3 });
    svg(caisse, "rect", { x: 790, y: 150, width: 24, height: 14, rx: 6, fill: "#FFF3C8" });
    svg(caisse, "rect", { x: 18, y: 152, width: 22, height: 16, rx: 5, fill: "#E10600" });
    const interieur = svg(caisse, "rect", { id: "interieur", x: 302, y: 126, width: 174, height: 116, fill: "#FFD9A0", opacity: 0 });
    const portiere = svg(caisse, "g", { id: "portiere" });
    svg(portiere, "path", { d: "M300 124 L478 124 L478 244 L300 244 Q290 180 300 124Z", fill: "#211820", stroke: "rgba(255,220,180,.18)", "stroke-width": 2 });
    svg(portiere, "rect", { x: 420, y: 176, width: 40, height: 8, rx: 4, fill: "#c9a98a" });
    [180, 650].forEach((cx) => {
      const r = svg(v, "g", { class: "roue", transform: `translate(${cx} 250)` });
      svg(r, "circle", { r: 56, fill: "#0b0709" });
      svg(r, "circle", { r: 32, fill: "#5a4a50" });
      for (let a = 0; a < 5; a++) svg(r, "rect", { x: -4, y: -30, width: 8, height: 28, fill: "#c9b4a0", transform: `rotate(${a * 72})` });
    });
    return interieur;
  }

  function construirePlan() {
    const p = document.getElementById("plan");
    const defs = svg(p, "defs", {});
    const mer = svg(defs, "linearGradient", { id: "mer", x1: 0, y1: 0, x2: 1, y2: 1 });
    svg(mer, "stop", { offset: "0", "stop-color": "#4E7FB8" });
    svg(mer, "stop", { offset: "1", "stop-color": "#7FB0D8" });
    svg(p, "rect", { width: 840, height: 520, fill: "url(#mer)" });
    svg(p, "path", { d: "M180 0 Q140 120 230 200 Q300 260 260 340 Q230 420 330 520 L840 520 L840 0Z", fill: "#F2D6A8" });
    svg(p, "path", { d: "M560 300 Q640 330 700 420 Q720 470 690 520 L760 520 Q790 450 740 370 Q690 300 600 280Z", fill: "#8FB8DC", opacity: 0.8 });
    [[400, 90], [520, 180], [650, 120], [460, 380], [600, 440]].forEach(([x, y], k) => svg(p, "circle", { cx: x, cy: y, r: 40 + k * 6, fill: "#E8C690", opacity: 0.6 }));
    const d = "M700 430 Q610 380 560 300 Q500 210 400 200 Q300 190 270 110";
    svg(p, "path", { d, fill: "none", stroke: "#fff", "stroke-width": 22, "stroke-linecap": "round", opacity: 0.7 });
    const route = svg(p, "path", { d, fill: "none", stroke: "#FFB020", "stroke-width": 12, "stroke-linecap": "round" });
    const chemin = svg(p, "path", { d, fill: "none", stroke: "none" });
    [[700, 430, "Douala"], [270, 110, "Limbé"]].forEach(([x, y, nom]) => {
      svg(p, "circle", { cx: x, cy: y, r: 18, fill: "#2A1A14" });
      svg(p, "circle", { cx: x, cy: y, r: 7, fill: "#FFC94D" });
      const t = svg(p, "text", { x: x + (nom === "Limbé" ? 30 : -30), y: y + 10, "text-anchor": nom === "Limbé" ? "start" : "end", "font-family": "Montserrat", "font-weight": 800, "font-size": 34, fill: "#2A1A14" });
      t.textContent = nom;
    });
    const duree = svg(p, "g", { transform: "translate(40 440)" });
    svg(duree, "rect", { width: 200, height: 56, rx: 28, fill: "rgba(42,26,20,.85)" });
    const td = svg(duree, "text", { x: 100, y: 37, "text-anchor": "middle", "font-family": "Inter", "font-weight": 700, "font-size": 28, fill: "#FFF4E0" });
    td.textContent = "≈ 2 h · 75 km";
    const halo = svg(p, "circle", { r: 30, fill: "rgba(255, 201, 77, .45)" });
    const auto = svg(p, "g", {});
    svg(auto, "rect", { x: -24, y: -13, width: 48, height: 26, rx: 9, fill: "#2A1A14" });
    svg(auto, "rect", { x: 4, y: -9, width: 11, height: 18, rx: 3, fill: "rgba(255,244,224,.7)" });
    return { route, chemin, auto, halo };
  }

  function preparerMots(el) {
    const mots = el.dataset.mots.split("|");
    el.innerHTML = "";
    return mots.map((m) => {
      const s = document.createElement("span");
      s.className = "mot" + (m.startsWith("*") ? " cle" : "");
      s.innerHTML = m.replace(/^\*/, "");
      el.appendChild(s);
      return s;
    });
  }

  window.CONSTRUIRE = function (tl) {
    const T = window.T;
    const $ = (id) => document.getElementById(id);
    const tous = (sel) => Array.from(document.querySelectorAll(sel));
    const phrases = {};
    tous("[data-mots]").forEach((el) => { phrases[el.id] = preparerMots(el); });
    gsap.set(".mot", { opacity: 0 });
    // Chaque mot monte avec un léger flou et une lueur.
    const montrer = (mots, temps) => mots.forEach((m, i) => {
      tl.fromTo(m, { opacity: 0, y: 30, filter: "blur(12px) brightness(1.8)" }, { opacity: 1, y: 0, filter: "blur(0px) brightness(1)", duration: 0.5, ease: "power3.out", immediateRender: false },
        Array.isArray(temps) ? temps[i] : temps + i * 0.16);
    });
    const cacher = (cible, t, d = 0.35) => tl.to(cible, { opacity: 0, y: -30, filter: "blur(10px)", duration: d, ease: "power2.in" }, t);

    construirePaysage();
    const interieur = construireBerline();
    const { route, chemin, auto, halo } = construirePlan();

    // ── Ambiance permanente : nuages, poussière dorée, parallaxe, lumière qui évolue ──
    const nuages = $("nuages"), poussiere = $("poussiere");
    const listeNuages = Array.from({ length: 7 }, (_, i) => {
      const n = document.createElement("div"); n.className = "nuage";
      n.style.width = 160 + alea(i) * 260 + "px"; n.style.top = 120 + alea(i + 20) * 900 + "px";
      nuages.appendChild(n); return n;
    });
    const grains = Array.from({ length: 34 }, () => { const g = document.createElement("div"); g.className = "grain-or"; poussiere.appendChild(g); return g; });
    const horloge = { t: 0 };
    const ambiance = () => {
      const t = horloge.t;
      listeNuages.forEach((n, i) => { n.style.transform = `translateX(${((alea(i + 5) * 1500 + t * (14 + i * 5)) % 1500) - 300}px)`; });
      grains.forEach((g, i) => {
        const x = alea(i) * 1080 + Math.sin(t * 0.6 + i) * 30;
        const y = ((alea(i + 40) * 1700 - t * (25 + alea(i + 80) * 40)) % 1700 + 1700) % 1700 + 100;
        g.style.transform = `translate(${x}px, ${y}px) scale(${0.5 + alea(i + 3)})`;
        g.style.opacity = 0.25 + 0.6 * Math.abs(Math.sin(t * 1.3 + i));
      });
      // Parallaxe : trois vitesses, et la route défile quand on roule.
      $("plan-loin").style.transform = `translateX(${-t * 2}px)`;
      $("plan-milieu").style.transform = `translateX(${-t * 5}px)`;
      $("plan-proche").style.transform = `translateX(${-t * 9}px)`;
    };
    // Retour exact à l'état de l'image 1 en fin de vidéo (boucle).
    tl.fromTo(horloge, { t: 0 }, { t: T.retour, duration: T.retour, ease: "none", onUpdate: ambiance }, 0);
    tl.to(horloge, { t: 0, duration: 0.01, onUpdate: ambiance }, T.retour);
    ambiance();
    tl.fromTo("#tirets", { x: 0 }, { x: -1400, duration: T.retour - T.solution, ease: "none" }, T.solution);
    tl.set("#tirets", { x: 0 }, T.retour);

    // Lumière : aube -> jour doré (soleil qui monte) -> soir (pendant le prix et l'outro).
    tl.fromTo("#soleil", { x: 0, y: 0 }, { x: -260, y: -760, duration: T.prix, ease: "sine.out" }, 0);
    tl.fromTo("#ciel-jour", { opacity: 0 }, { opacity: 1, duration: 3, ease: "sine.inOut" }, 1.5);
    tl.fromTo("#ciel-soir", { opacity: 0 }, { opacity: 0.85, duration: 4, ease: "sine.inOut" }, T.prix);
    tl.to("#soleil", { y: -200, x: -100, duration: T.outro - T.prix, ease: "sine.in" }, T.prix);
    // Caméra qui travelle lentement (léger zoom + glissement).
    tl.fromTo("#camera", { scale: 1, y: 0 }, { scale: 1.06, y: -20, duration: T.retour, ease: "none" }, 0);

    // ════ HOOK : messages qui arrivent vite, puis silence gêné ════
    ["#m1", "#m2", "#m3"].forEach((m, k) => {
      tl.fromTo(m, { opacity: 0, y: 40, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(2.2)", transformOrigin: "0% 100%", immediateRender: false }, T.messages[k + 1]);
    });
    tl.fromTo("#chat", { y: 0 }, { keyframes: [{ y: -6, duration: 0.06 }, { y: 0, duration: 0.1 }] , immediateRender: false}, T.messages[3]);
    tl.to(["#m0", "#m1", "#m2"], { opacity: 0.18, filter: "blur(2px)", duration: 0.5 }, T.seul);
    tl.to("#m3", { scale: 1.06, duration: 0.5, ease: "power2.out", transformOrigin: "0% 100%" }, T.seul);
    tl.fromTo("#m4", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)", immediateRender: false }, T.points);
    tous("#m4 i").forEach((p, i) => tl.fromTo(p, { opacity: 0.25 }, { opacity: 1, duration: 0.3, repeat: 9, yoyo: true, ease: "sine.inOut", immediateRender: false }, T.points + 0.1 + i * 0.15));
    montrer(phrases.texte1, T.texte1);

    // ════ BASCULE bleu nuit ════
    const etoiles = $("etoiles");
    for (let i = 0; i < 40; i++) {
      const e = document.createElement("div"); e.className = "etoile";
      e.style.left = alea(i + 200) * 1080 + "px"; e.style.top = alea(i + 300) * 1300 + "px"; e.style.opacity = 0.3 + alea(i + 400) * 0.7;
      etoiles.appendChild(e);
    }
    tl.fromTo("#nuit", { clipPath: "circle(0% at 50% 100%)" }, { clipPath: "circle(150% at 50% 100%)", duration: 0.7, ease: "power3.inOut" }, T.bascule);
    tl.fromTo("#etoiles", { y: 0 }, { y: -60, duration: 2.6, ease: "none" }, T.bascule);
    tl.set(["#chat", "#texte1"], { opacity: 0 }, T.bascule + 0.7);
    montrer(phrases.texte2, T.texte2);
    tl.to("#nuit", { clipPath: "circle(0% at 50% 0%)", duration: 0.6, ease: "power3.inOut" }, T.solution - 0.1);
    tl.set("#texte2", { opacity: 0 }, T.solution + 0.3);

    // ════ SOLUTION : trajet + timeline qui se coche ════
    const L = chemin.getTotalLength();
    route.setAttribute("stroke-dasharray", `${L} ${L}`);
    const course = { p: 0 };
    const maj = () => {
      const a = chemin.getPointAtLength(course.p * L), b = chemin.getPointAtLength(Math.min(L, course.p * L + 4));
      auto.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${(Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI})`);
      halo.setAttribute("cx", a.x); halo.setAttribute("cy", a.y);
      route.setAttribute("stroke-dashoffset", `${L - course.p * L}`);
    };
    maj();
    tl.fromTo("#carte", { opacity: 0, y: 200, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.3)" }, T.solution);
    tl.fromTo("#timeline", { opacity: 0, y: 200, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.3)" }, T.solution + 0.12);
    tl.fromTo(course, { p: 0 }, { p: 1, duration: T.trajet[1] - T.trajet[0], ease: "power1.inOut", onUpdate: maj }, T.trajet[0]);
    tous(".etape i").forEach((c, k) => {
      tl.to(c, { backgroundColor: "#22C55E", borderColor: "#22C55E", color: "#ffffff", scale: 1.2, duration: 0.15, ease: "power2.out" }, T.coches[k]);
      tl.to(c, { scale: 1, duration: 0.3, ease: "back.out(3)" }, T.coches[k] + 0.15);
      tl.fromTo(c.parentNode, { x: 0 }, { keyframes: [{ x: 10, duration: 0.1 }, { x: 0, duration: 0.2 }], immediateRender: false }, T.coches[k]);
    });
    cacher(["#carte", "#timeline"], T.profitez - 0.15, 0.35);

    // ════ « Vous, vous profitez » : la voiture arrive et s'arrête, portière ════
    tl.fromTo("#voiture", { x: -700 }, { x: 260, duration: T.voiture[1] - T.voiture[0], ease: "power3.out" }, T.voiture[0]);
    const roues = { a: 0 };
    tl.fromTo(roues, { a: 0 }, { a: 1, duration: T.voiture[1] - T.voiture[0], ease: "power3.out", onUpdate: () => {
      tous(".roue").forEach((r, i) => r.setAttribute("transform", `translate(${i ? 650 : 180} 250) rotate(${roues.a * 900})`));
    } }, T.voiture[0]);
    tl.fromTo("#caisse", { y: 0 }, { keyframes: [{ y: 6, duration: 0.12 }, { y: -3, duration: 0.14 }, { y: 0, duration: 0.16 }], immediateRender: false }, T.voiture[1] - 0.05);
    tl.fromTo("#portiere", { svgOrigin: "300 184", scaleX: 1, skewY: 0 }, { scaleX: 0.2, skewY: -6, duration: 0.6, ease: "power2.inOut" }, T.portiere);
    tl.fromTo(interieur, { opacity: 0 }, { opacity: 1, duration: 0.4 }, T.portiere + 0.1);
    tl.fromTo("#phare", { opacity: 0.5 }, { opacity: 1, duration: 0.4, repeat: 3, yoyo: true }, T.voiture[0]);
    montrer(phrases.texte3, T.texte3);
    cacher("#texte3", T.prix - 0.2, 0.3);
    tl.to("#voiture", { x: 1300, duration: 1.4, ease: "power2.in" }, T.bandeau);
    tl.set("#portiere", { scaleX: 1, skewY: 0 }, T.bandeau);
    tl.set(interieur, { opacity: 0 }, T.bandeau);

    // ════ PRIX ════
    tl.fromTo("#prix", { opacity: 0, y: 220, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.3)" }, T.prix);
    tl.fromTo(".prix-montant", { opacity: 0, scale: 0.7, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "back.out(2)", immediateRender: false }, T.montant);
    tl.fromTo("#offre", { opacity: 0, y: 30, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2.4)", immediateRender: false }, T.offre);
    tl.fromTo("#carburant", { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, T.carburant);
    tl.to("#prix", { y: -60, scale: 0.9, duration: 0.6, ease: "power2.inOut" }, T.bandeau - 0.1);

    // ════ Bandeau des destinations ════
    const defile = $("defile");
    const villes = ["Limbé", "Kribi", "Buea", "Yaoundé", "Ouest"];
    for (let r = 0; r < 4; r++) villes.forEach((v) => { defile.insertAdjacentHTML("beforeend", `<span>${v}</span><span class="sep">·</span>`); });
    tl.fromTo("#bandeau", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" }, T.bandeau);
    tl.fromTo("#defile", { x: 0 }, { x: -1100, duration: T.outro - T.bandeau, ease: "none" }, T.bandeau);

    // ════ OUTRO : le soleil se couche derrière le logo qui s'illumine ════
    tl.fromTo("#outro", { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "sine.inOut" }, T.outro);
    tl.set(["#prix", "#bandeau"], { opacity: 0 }, T.outro + 0.7);
    tl.fromTo("#soleil-fin", { y: -260, scale: 1 }, { y: 360, scale: 0.85, duration: T.retour - T.outro, ease: "sine.inOut" }, T.outro);
    tl.fromTo("#logo", { opacity: 0, scale: 0.9, filter: "drop-shadow(0 0 0px rgba(255,220,150,0)) brightness(.6)" },
      { opacity: 1, scale: 1, filter: "drop-shadow(0 0 40px rgba(255,220,150,.9)) brightness(1.1)", duration: 1.2, ease: "power2.out" }, T.outro + 0.3);
    tl.to("#logo", { filter: "drop-shadow(0 0 16px rgba(255,220,150,.5)) brightness(1)", duration: 1.2, ease: "sine.inOut" }, T.outro + 1.6);
    montrer(phrases.slogan, T.slogan);
    tl.fromTo("#contact", { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.8)" }, T.contact);
    tl.fromTo("#contact", { scale: 1 }, { scale: 1.04, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, T.contact + 0.7);

    // ════ RETOUR à l'image 1 : sous l'outro opaque, tout revient à l'état initial, puis l'outro s'efface ════
    const r = T.retour - 0.05;
    tl.set(["#ciel-jour", "#ciel-soir"], { opacity: 0 }, r);
    tl.set("#soleil", { x: 0, y: 0 }, r);
    tl.set("#camera", { scale: 1, y: 0 }, r);
    tl.set("#voiture", { x: -700 }, r);
    tl.set("#chat", { opacity: 1, y: 0 }, r);
    tl.set("#m0", { opacity: 1, filter: "blur(0px)" }, r);
    tl.set(["#m1", "#m2", "#m3", "#m4"], { opacity: 0 }, r);
    tl.set("#m3", { scale: 1 }, r);
    tl.to("#outro", { opacity: 0, duration: 0.4, ease: "sine.inOut" }, T.retour);

    tl.to({}, { duration: T.duree }, 0);
  };
})();
