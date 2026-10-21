// « Clarisse — 3 000 FCFA » — JP Stories (26,4 s, 9:16). Voir frame.md.
// Hook : Clarisse imagine un convoi officiel ; téléphone « Combien pour un chauffeur ? » ; la réponse pop
// (3 000 FCFA/h) ; sa journée de courses cochée sur un mini plan ; question finale ; outro ; retour à l'image 1.
(function () {
  const J = window.JPStories;
  const ENCRE = "#1A1A1A", MOUTARDE = "#F2C230", CARTE = "#FBF7EE";

  // Bulle de pensée : nuage + petites bulles vers la tête de Clarisse, convoi officiel dedans.
  function construirePensee(tl) {
    const p = document.getElementById("pensee");
    const nuage = J.svg(p, "g", { id: "nuage" });
    J.svg(nuage, "path", { d: "M120 470 Q40 470 50 390 Q20 300 110 270 Q110 160 230 160 Q290 70 420 100 Q520 40 620 110 Q760 100 780 220 Q880 260 850 370 Q870 470 760 480 Q700 560 560 520 Q440 580 330 520 Q220 560 120 470Z",
      fill: CARTE, stroke: ENCRE, "stroke-width": 6, "stroke-linejoin": "round" });
    [[150, 560, 30], [95, 615, 18]].forEach(([x, y, r], i) => J.svg(p, "circle", { cx: x, cy: y, r, fill: CARTE, stroke: ENCRE, "stroke-width": 6, class: "petite-bulle", id: `pb${i}` }));
    // Route et convoi (berlines noires, fanions moutarde, motard en tête).
    const scene = J.svg(nuage, "g", { id: "convoi-scene" });
    J.svg(scene, "path", { d: "M90 420 L800 420", stroke: "#C9BCA2", "stroke-width": 26, "stroke-linecap": "round" });
    const convoi = J.svg(scene, "g", { id: "convoi" });
    const berline = (x) => {
      const g = J.svg(convoi, "g", { transform: `translate(${x} 0)` });
      J.svg(g, "path", { d: "M0 400 Q0 380 20 376 L50 372 Q72 346 104 344 L150 344 Q176 346 192 370 L214 374 Q230 378 230 396 L230 404 L0 404Z", fill: "#22201E" });
      J.svg(g, "path", { d: "M62 372 Q80 354 104 352 L124 352 L124 372Z M132 352 L150 352 Q170 354 184 372 L132 372Z", fill: "#8E8A84" });
      [46, 182].forEach((c) => J.svg(g, "circle", { cx: c, cy: 404, r: 16, fill: "#111" }));
      // Deux fanions sur les ailes avant.
      const f = J.svg(g, "g", { class: "fanion" });
      J.svg(f, "line", { x1: 205, y1: 372, x2: 205, y2: 330, stroke: ENCRE, "stroke-width": 3 });
      J.svg(f, "path", { d: "M205 330 L232 337 L205 345Z", fill: MOUTARDE });
      return g;
    };
    [140, 390].forEach(berline);
    const moto = J.svg(convoi, "g", { transform: "translate(640 0)" });
    J.svg(moto, "circle", { cx: 20, cy: 404, r: 14, fill: "#111" });
    J.svg(moto, "circle", { cx: 80, cy: 404, r: 14, fill: "#111" });
    J.svg(moto, "path", { d: "M20 404 L50 380 L80 404 M44 380 L56 352", stroke: "#22201E", "stroke-width": 8, fill: "none", "stroke-linecap": "round" });
    J.svg(moto, "circle", { cx: 58, cy: 342, r: 12, fill: "#22201E" });
    const titre = J.svg(nuage, "text", { x: 450, y: 250, "text-anchor": "middle", "font-family": "Caveat", "font-weight": 700, "font-size": 64, fill: ENCRE });
    titre.textContent = "Cortège officiel";
    return convoi;
  }

  // Mini plan de Douala : le Wouri, quelques îlots, trois arrêts reliés par l'itinéraire.
  function construireVille() {
    const v = document.getElementById("ville");
    J.svg(v, "path", { d: "M-20 90 Q200 40 380 120 Q560 200 920 130 L920 -20 L-20 -20Z", fill: "#BFD0D6" });
    const nom = J.svg(v, "text", { x: 110, y: 60, "font-family": "Caveat", "font-weight": 700, "font-size": 40, fill: "#4E6A74" }); nom.textContent = "le Wouri";
    for (let x = 30; x < 900; x += 150) for (let y = 190; y < 500; y += 120) J.svg(v, "rect", { x, y, width: 120, height: 90, rx: 16, fill: "#E2D6BF" });
    const arrets = [[150, 420, "Marché"], [450, 250, "Pressing"], [760, 400, "Supermarché"]];
    const d = "M150 420 Q260 300 450 250 Q640 200 760 400";
    J.svg(v, "path", { d, fill: "none", stroke: "#fff", "stroke-width": 22, "stroke-linecap": "round" });
    const route = J.svg(v, "path", { d, fill: "none", stroke: MOUTARDE, "stroke-width": 12, "stroke-linecap": "round" });
    const chemin = J.svg(v, "path", { d, fill: "none", stroke: "none" });
    const pins = arrets.map(([x, y, n], k) => {
      const g = J.svg(v, "g", { id: `arret${k}` });
      J.svg(g, "circle", { cx: x, cy: y, r: 28, fill: ENCRE, class: "fond-pin" });
      const c = J.svg(g, "path", { d: `M${x - 12} ${y} l8 9 l16 -18`, stroke: ENCRE, "stroke-width": 6, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", class: "coche" });
      const t = J.svg(v, "text", { x, y: y - 44, "text-anchor": "middle", "font-family": "Inter", "font-weight": 700, "font-size": 30, fill: ENCRE }); t.textContent = n;
      return { g, c };
    });
    const auto = J.svg(v, "g", {});
    J.svg(auto, "rect", { x: -24, y: -13, width: 48, height: 26, rx: 9, fill: ENCRE });
    J.svg(auto, "rect", { x: 5, y: -9, width: 11, height: 18, rx: 3, fill: "rgba(251,247,238,.75)" });
    return { route, chemin, auto, pins };
  }

  window.CONSTRUIRE = function (tl) {
    const T = window.T, P = T.plans;
    const fin = (i) => P[i + 1] ?? T.duree;
    ["#p1", "#p2", "#p3", "#p4", "#p5"].forEach((p, i) => J.fondu(tl, p, P[i], fin(i), { premier: i === 0 }));
    tl.to("#brun", { opacity: 1, duration: 0.6 }, P[3] - 0.3);
    tl.to("#brun", { opacity: 0, duration: 0.6 }, P[4] - 0.3);

    // ════ 1. HOOK : la bulle de pensée est déjà là à l'image 1 ════
    J.texteSurligne(tl, { de: 0, a: P[1], phrases: [[0, 0, "Clarisse pensait qu'un chauffeur privé,"], [2.83, 4.25, "c'était pour les *ministres."]] });
    const convoi = construirePensee(tl);
    tl.fromTo(convoi, { x: 0 }, { x: -60, duration: P[1], ease: "none", immediateRender: true }, 0);
    document.querySelectorAll(".fanion path").forEach((f) => tl.fromTo(f, { scaleY: 1 }, { scaleY: 0.6, svgOrigin: "205 337", duration: 0.25, repeat: 19, yoyo: true, ease: "sine.inOut", immediateRender: false }, 0));
    tl.fromTo("#nuage", { y: 0 }, { y: -8, duration: 1.2, repeat: 3, yoyo: true, ease: "sine.inOut", immediateRender: false }, 0);
    tl.fromTo("#pensee", { scale: 1 }, { scale: 1.05, transformOrigin: "50% 60%", duration: P[1] + 0.3, ease: "none", immediateRender: true }, 0);
    J.respiration(tl, "#reve", 0, P[1]);
    // Sur « ministres » : la bulle se gonfle d'un coup.
    tl.to("#nuage", { scale: 1.06, svgOrigin: "450 320", duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" }, 3.75);

    // ════ 2. Téléphone : « Combien pour un chauffeur ? » puis l'autre écrit ════
    J.conversation(tl, { parent: "#p2", x: 255, y: 520, largeur: 570, de: P[1], contact: "JP Service",
      messages: [{ t: T.envoi, texte: "Combien pour un chauffeur&nbsp;?", moi: true }], ecrit: [T.ecrit] });
    J.texteSurligne(tl, { de: P[1], a: P[2], phrases: [[5.04, 6.87, "Puis elle a demandé le *prix."]] });

    // ════ 3. La réponse pop en grand ; Clarisse surprise, zoom rapide ════
    tl.fromTo("#reponse", { opacity: 0, scale: 0.4, rotation: -6 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2.2)", immediateRender: false }, T.reponse);
    tl.fromTo("#trait-prix", { scaleX: 0, rotation: -1 }, { scaleX: 1, rotation: -1, duration: 0.45, ease: "power2.out", immediateRender: false }, T.reponse + 0.35);
    tl.fromTo("#surprise", { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.6)", immediateRender: false }, P[2]);
    tl.fromTo("#surprise", { scale: 1 }, { scale: 1.16, duration: 0.3, ease: "power3.out", immediateRender: false }, T.reponse + 0.1); // zoom rapide
    tl.to("#surprise", { scale: 1.22, duration: fin(2) - T.reponse - 0.4, ease: "none" }, T.reponse + 0.4);
    tl.fromTo("#eclats", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(3)", immediateRender: false }, T.reponse + 0.15);
    tl.fromTo("#reponse", { y: 0 }, { y: -8, duration: 1, repeat: 3, yoyo: true, ease: "sine.inOut", immediateRender: false }, T.reponse + 0.5);
    J.texteSurligne(tl, { de: P[2], a: P[3], phrases: [[9.27, 10.77, "*3 000 francs de l'heure."], [11.43, 13.47, "Voiture et chauffeur compris."]] });

    // ════ 4. La journée : trois arrêts cochés, Clarisse détendue à l'arrière ════
    const { route, chemin, auto, pins } = construireVille();
    const L = chemin.getTotalLength();
    route.setAttribute("stroke-dasharray", `${L} ${L}`);
    const course = { p: 0 };
    const maj = () => {
      const a = chemin.getPointAtLength(course.p * L), b = chemin.getPointAtLength(Math.min(L, course.p * L + 4));
      auto.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${(Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI})`);
      route.setAttribute("stroke-dashoffset", `${L - course.p * L}`);
    };
    maj();
    tl.fromTo(course, { p: 0 }, { p: 1, duration: T.arrets[2] - T.arrets[0], ease: "power1.inOut", onUpdate: maj, immediateRender: false }, T.arrets[0]);
    pins.forEach(({ g, c }, k) => {
      tl.to(g.querySelector(".fond-pin"), { attr: { fill: MOUTARDE, r: 32 }, duration: 0.2 }, T.arrets[k]);
      tl.fromTo(g, { scale: 1 }, { scale: 1.2, svgOrigin: `${g.querySelector("circle").getAttribute("cx")} ${g.querySelector("circle").getAttribute("cy")}`, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, T.arrets[k]);
    });
    J.zoomLent(tl, "#detendue", P[3], fin(3), { depart: 1.02, arrivee: 1.1, origine: "45% 35%" });
    tl.fromTo("#lumiere", { x: 0 }, { x: 1500, duration: 1.6, repeat: 3, ease: "none", immediateRender: false }, P[3]);
    J.texteSurligne(tl, { de: P[3], a: P[4], classe: "clair", phrases: [[14.72, 15.24, "Samedi,"], [15.84, 18.11, "elle a fait toutes ses *courses…"], [18.81, 20.54, "sans attendre un seul taxi."]] });

    // ════ 5. Question finale + point d'interrogation qui rebondit ════
    J.texteSurligne(tl, { de: P[4], a: P[5], classe: "centre", phrases: [[21.67, 22.06, "Et toi,"], [22.81, 23.97, "tu pensais que c'était *combien"]] });
    tl.fromTo("#interro", { opacity: 0, y: -500 }, { opacity: 1, y: 0, duration: 0.6, ease: "bounce.out", immediateRender: false }, 22.9);
    tl.fromTo("#interro", { scaleX: 1, scaleY: 1 }, { keyframes: [{ scaleX: 1.12, scaleY: 0.86, duration: 0.1 }, { scaleX: 1, scaleY: 1, duration: 0.25, ease: "back.out(3)" }], immediateRender: false }, 23.45);
    tl.fromTo("#interro", { y: 0 }, { y: -40, duration: 0.3, repeat: 1, yoyo: true, ease: "power2.out", immediateRender: false }, 23.85);

    // ════ 6. Outro JP (1,5 s), puis retour à l'image 1 pour la boucle ════
    const outro = J.outroJP(tl, { parent: "#camera", de: P[5] });
    tl.to(outro, { opacity: 0, duration: 0.35, ease: "power2.in" }, T.retour);
    tl.set(convoi, { x: 0 }, T.retour);
    tl.set("#pensee", { scale: 1 }, T.retour);
    tl.fromTo("#p1", { opacity: 0 }, { opacity: 1, x: 0, duration: 0.35, immediateRender: false }, T.retour);
    J.texteSurligne(tl, { de: T.retour, phrases: [[T.retour, T.retour + 0.01, "Clarisse pensait qu'un chauffeur privé,"]] });

    tl.to({}, { duration: T.duree }, 0);
  };
})();
