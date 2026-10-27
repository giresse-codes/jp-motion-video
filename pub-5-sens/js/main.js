// « Les 5 sens du trajet parfait » — JP PAPIER (23,5 s). Cinq chapitres ouverts par un grand chiffre au marqueur
// et un pictogramme manuscrit ; la photo fournie (assets/images/passagere.jpg) est recadrée dans le cadre du kit
// pour chaque sens. Timeline GSAP en pause, sûre au seek. Repères : js/temps.js.
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const svg = (parent, nom, attrs) => {
    const el = document.createElementNS(NS, nom);
    Object.entries(attrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
    parent.appendChild(el);
    return el;
  };
  const $ = (s) => document.querySelector(s);
  const ENCRE = "#1A1A1A", MOUTARDE = "#F2C230";

  // Pictogrammes manuscrits (viewBox 0 0 200 200), tracés au feutre.
  const PICTOS = {
    oeil: ["M18 100 Q100 28 182 100 Q100 172 18 100 Z", "M100 68 A32 32 0 1 1 99.9 68", "M60 52 L52 34 M100 42 L100 22 M140 52 L148 34"],
    oreille: ["M128 52 C 100 22 52 40 56 90 C 58 118 80 124 84 146 C 88 168 110 180 126 162", "M104 72 C 84 70 80 98 96 104 C 106 110 104 124 94 128", "M150 70 C 162 84 162 104 150 118"],
    main: ["M72 172 L64 104 C 62 90 78 88 80 100 L84 58 C 84 44 100 44 100 58 L102 46 C 102 32 118 32 118 46 L120 58 C 120 44 136 44 136 58 L138 102 C 144 90 160 96 154 110 L140 150 C 134 166 120 174 102 174 Z", "M100 60 L102 104 M118 60 L118 104"],
    nez: ["M100 36 C 98 78 82 108 72 126 C 64 142 80 154 94 146 C 100 152 110 152 114 146 C 126 152 140 140 130 126", "M86 132 C 90 128 96 130 96 136 M114 136 C 114 130 120 128 124 132"],
    bouche: ["M28 100 C 58 70 84 78 100 90 C 116 78 142 70 172 100 C 142 142 58 142 28 100 Z", "M40 100 C 80 110 120 110 160 100"],
  };
  const ORDRE = ["oeil", "oreille", "main", "nez", "bouche"];
  const NOMS = ["la vue", "l'ouïe", "le toucher", "l'odorat", "le goût"];

  function picto(parent, nom, taille, epaisseur = 9) {
    const s = svg(parent, "svg", { viewBox: "0 0 200 200", width: taille, height: taille });
    const traits = PICTOS[nom].map((d) => svg(s, "path", { d, fill: "none", stroke: ENCRE, "stroke-width": epaisseur, "stroke-linecap": "round", "stroke-linejoin": "round", pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 0 }));
    if (nom === "oeil") svg(s, "circle", { cx: 100, cy: 100, r: 13, fill: ENCRE });
    return { s, traits };
  }

  function rangee(parent, avecCoches) {
    return ORDRE.map((nom, i) => {
      const p = document.createElement("div"); p.className = "picto";
      p.innerHTML = `<span class="num">${i + 1}</span>`;
      parent.appendChild(p);
      const { s, traits } = picto(p, nom, 168);
      const b = document.createElement("b"); b.textContent = NOMS[i]; p.appendChild(b);
      let coche = null;
      if (avecCoches) coche = svg(s, "path", { d: "M48 108 L86 146 L160 60", fill: "none", stroke: MOUTARDE, "stroke-width": 22, "stroke-linecap": "round", "stroke-linejoin": "round", pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1 });
      return { p, traits, coche };
    });
  }

  // Phrases de temps.js ([[t,"mot"],...,[fin]]) -> format de JPPapier.texteSurligne.
  const phrases = (liste) => liste.map((ph) => ph.slice(0, -1).map(([t, m], i) => ({ text: m.replace("*", ""), start: t, end: ph[i + 1][0], cle: m.includes("*") })));

  // Recadrage de la photo source (2000 × 1116) dans le cadre 900 × 1140 : centre (cx, cy), échelle s.
  const cadrage = (cx, cy, s) => ({ x: 450 - cx * s, y: 570 - cy * s, scale: s });

  // Ville plate qui défile derrière la vitre (couches loin / près).
  function ville(el, couleurs, hauteurs, graine) {
    let x = 0, i = graine;
    while (x < 1800) {
      const l = 70 + ((i * 37) % 60), h = hauteurs[0] + ((i * 53) % (hauteurs[1] - hauteurs[0]));
      svg(el, "rect", { x, y: 320 - h, width: l, height: h, fill: couleurs[i % couleurs.length] });
      if (couleurs.length > 2) for (let y = 320 - h + 18; y < 300; y += 34) for (let wx = x + 12; wx < x + l - 18; wx += 26) svg(el, "rect", { x: wx, y, width: 12, height: 16, fill: "rgba(246,238,223,.55)" });
      x += l + 8 + ((i * 11) % 20); i++;
    }
  }

  window.CONSTRUIRE = function (tl) {
    const T = window.T, P = JPPapier, C = T.chapitres;

    // ---------- Hook : les 5 pictogrammes alignés + titre ----------
    gsap.set("#p-hook", { opacity: 1 });
    const hook = rangee($("#rang-hook"), false);
    P.texteSurligne(tl, { de: 0, a: C[0], classe: "hook", phrases: [[{ text: "Les", start: 0, end: 0 }, { text: "5", start: 0, end: 0, cle: true }, { text: "sens", start: 0, end: 0, cle: true }, { text: "du", start: 0, end: 0 }, { text: "trajet", start: 0, end: 0 }, { text: "parfait.", start: 0, end: 0 }]] });
    hook.forEach(({ p }, i) => {
      tl.fromTo(p, { y: 0 }, { y: -26, duration: 0.25, ease: "power2.out", yoyo: true, repeat: 1, immediateRender: false }, 0.3 + i * 0.28);
    });
    tl.fromTo("#rang-hook", { scale: 1 }, { scale: 1.05, duration: C[0] + 0.3, ease: "none", transformOrigin: "50% 50%" }, 0);
    tl.to("#p-hook", { opacity: 0, duration: 0.4, ease: "power2.in" }, C[0] - 0.2);

    // ---------- Ouvertures de chapitre : chiffre au marqueur + pictogramme ----------
    const plans = ["#p-vue", "#p-ouie", "#p-toucher", "#p-odorat", "#p-gout"];
    const fins = [C[1], C[2], C[3], C[4], T.recap];
    ORDRE.forEach((nom, i) => {
      const o = document.createElement("div"); o.className = "ouverture";
      o.innerHTML = '<i class="fond"></i>';
      $("#ouvertures").appendChild(o);
      const ch = svg(o, "svg", { class: "chiffre", viewBox: "0 0 380 460", width: 380, height: 460 });
      const txt = svg(ch, "text", { x: 190, y: 400, "text-anchor": "middle", "font-family": "Caveat", "font-weight": 700, "font-size": 520, fill: MOUTARDE, "fill-opacity": 0, stroke: MOUTARDE, "stroke-width": 14, "stroke-linejoin": "round", "stroke-dasharray": 2600, "stroke-dashoffset": 2600 });
      txt.textContent = String(i + 1);
      const pg = picto(o, nom, 320, 10); pg.s.classList.add("picto-grand");
      const t0 = C[i];
      tl.fromTo(o, { opacity: 0, scale: 0.9, x: 0, y: 0 }, { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out", immediateRender: false }, t0);
      tl.fromTo(txt, { attr: { "stroke-dashoffset": 2600 } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.45, ease: "power1.inOut", immediateRender: false }, t0);
      tl.fromTo(txt, { attr: { "fill-opacity": 0 } }, { attr: { "fill-opacity": 1 }, duration: 0.2, immediateRender: false }, t0 + 0.38);
      tl.fromTo(pg.traits, { attr: { "stroke-dashoffset": 1 } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.4, stagger: 0.08, ease: "power1.inOut", immediateRender: false }, t0 + 0.15);
      // puis le duo se range en badge, en haut à droite du cadre
      tl.to(o, { x: 300, y: -330, scale: 0.3, duration: 0.5, ease: "power3.inOut" }, t0 + 0.75);
      tl.fromTo(o.querySelector(".fond"), { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, t0 + 0.85);
      tl.to(o, { opacity: 0, duration: 0.3 }, fins[i] - 0.3);
      // plan photo du chapitre + texte surligné
      P.fondu(tl, plans[i], t0 + 0.75, fins[i]);
      P.texteSurligne(tl, { de: t0 + 0.1, a: fins[i], phrases: phrases(T.textes[i]) });
    });

    // ---------- 1. Vue : la ville défile derrière la vitre ----------
    const v0 = cadrage(1310, 480, 1.25), v1 = cadrage(1360, 450, 1.36);
    tl.fromTo("#ph-vue", v0, { ...v1, duration: C[1] - C[0], ease: "none", immediateRender: true }, C[0] + 0.5);
    ville($("#ville-loin"), ["#C9D3C4", "#E2D6C2", "#BFC9CF"], [120, 240], 3);
    ville($("#ville-pres"), ["#2E3B55", "#B5654A", "#7E9277", "#E8DCC6"], [150, 300], 7);
    tl.fromTo("#ville-loin", { x: -400 }, { x: 0, duration: C[1] - C[0] + 0.6, ease: "none", immediateRender: false }, C[0] + 0.2);
    tl.fromTo("#ville-pres", { x: -1000 }, { x: 0, duration: C[1] - C[0] + 0.6, ease: "none", immediateRender: false }, C[0] + 0.2);

    // ---------- 2. Ouïe : les klaxons s'effacent, les notes arrivent ----------
    const o0 = cadrage(1500, 520, 1.6), o1 = cadrage(1560, 470, 1.75);
    tl.fromTo("#ph-ouie", o0, { ...o1, duration: C[2] - C[1], ease: "none", immediateRender: true }, C[1] + 0.5);
    const sons = $("#sons");
    [[150, 200], [400, 140], [190, 430]].forEach(([x, y], k) => {
      const g = svg(sons, "g", {}), gi = svg(g, "g", { transform: `translate(${x} ${y})` });
      svg(gi, "path", { d: "M-60 -18 L-20 -18 L30 -50 L30 50 L-20 18 L-60 18 Z", fill: "#FBF7EE", stroke: ENCRE, "stroke-width": 7, "stroke-linejoin": "round" });
      svg(gi, "path", { d: "M50 -30 Q66 0 50 30 M70 -48 Q96 0 70 48", fill: "none", stroke: ENCRE, "stroke-width": 7, "stroke-linecap": "round" });
      const t = svg(gi, "text", { x: -10, y: 92, "text-anchor": "middle", "font-family": "Caveat", "font-weight": 700, "font-size": 56, fill: ENCRE }); t.textContent = "TÛÛT !";
      const n = svg(sons, "g", {}), ni = svg(n, "g", { transform: `translate(${x} ${y})` });
      svg(ni, "ellipse", { cx: -14, cy: 30, rx: 24, ry: 17, fill: MOUTARDE, stroke: ENCRE, "stroke-width": 6, transform: "rotate(-20 -14 30)" });
      svg(ni, "path", { d: "M6 24 L6 -60 C 30 -50 44 -36 34 -14", fill: "none", stroke: ENCRE, "stroke-width": 7, "stroke-linecap": "round", "stroke-linejoin": "round" });
      const tk = T.klaxons[k];
      tl.fromTo(g, { opacity: 0, scale: 0.4, svgOrigin: `${x} ${y}` }, { opacity: 1, scale: 1, svgOrigin: `${x} ${y}`, duration: 0.35, ease: "back.out(2.5)", immediateRender: false }, C[1] + 0.85 + k * 0.15);
      tl.to(g, { rotation: 6, svgOrigin: `${x} ${y}`, duration: 0.12, yoyo: true, repeat: 3, ease: "sine.inOut" }, C[1] + 1.2 + k * 0.15);
      tl.to(g, { opacity: 0, scale: 0.2, filter: "blur(6px)", svgOrigin: `${x} ${y}`, duration: 0.35, ease: "power2.in" }, tk);
      tl.fromTo(n, { opacity: 0, scale: 0.3, y: 20, svgOrigin: `${x} ${y}` }, { opacity: 1, scale: 1, y: 0, svgOrigin: `${x} ${y}`, duration: 0.45, ease: "back.out(2.6)", immediateRender: false }, tk + 0.25);
      tl.to(n, { y: -60, rotation: 8, svgOrigin: `${x} ${y}`, duration: C[2] - tk - 0.7, ease: "sine.inOut" }, tk + 0.7);
    });

    // ---------- 3. Toucher : ondes fraîches de la clim sur la main ----------
    const t0c = cadrage(1230, 735, 1.5), t1c = cadrage(1210, 800, 1.62);
    tl.fromTo("#ph-toucher", t0c, { ...t1c, duration: C[3] - C[2], ease: "none", immediateRender: true }, C[2] + 0.5);
    const ondes = $("#ondes");
    [[520, 0], [640, 0.35], [760, 0.7], [900, 1.05], [1000, 0.2]].forEach(([y, dt], k) => {
      const g = svg(ondes, "g", {});
      svg(g, "path", { d: "M0 0 C 30 -22 60 22 90 0 S 150 -22 180 0 S 240 22 270 0", transform: `translate(0 ${y})`, fill: "none", stroke: "#8EC5FF", "stroke-width": 8, "stroke-linecap": "round", opacity: 0.85 });
      const d0 = C[2] + 1.0 + dt, n = Math.floor((C[3] - d0) / 1.4);
      tl.fromTo(g, { x: -320, opacity: 0 }, { keyframes: [{ opacity: 1, duration: 0.3 }, { opacity: 1, duration: 0.8 }, { opacity: 0, duration: 0.3 }], x: 950, duration: 1.4, ease: "none", repeat: Math.max(0, n - 1), immediateRender: false }, d0);
    });

    // ---------- 4. Odorat : volutes douces dans l'habitacle propre ----------
    const d0c = cadrage(620, 560, 1.3), d1c = cadrage(640, 540, 1.42);
    tl.fromTo("#ph-odorat", d0c, { ...d1c, duration: C[4] - C[3], ease: "none", immediateRender: true }, C[3] + 0.5);
    const vol = $("#volutes");
    [[220, 880, 0], [420, 820, 0.4], [620, 900, 0.8], [330, 640, 1.2], [700, 700, 1.5]].forEach(([x, y, dt]) => {
      const g = svg(vol, "g", {}), gi = svg(g, "g", { transform: `translate(${x} ${y})` });
      const p = svg(gi, "path", { d: "M0 0 C -26 -40 30 -64 8 -104 C -12 -140 40 -160 18 -206", fill: "none", stroke: "#FBF7EE", "stroke-width": 7, "stroke-linecap": "round", pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1, opacity: 0.9 });
      svg(gi, "path", { d: "M30 -150 l6 -14 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 Z", fill: MOUTARDE, opacity: 0.9 });
      const t = C[3] + 1.0 + dt;
      tl.fromTo(p, { attr: { "stroke-dashoffset": 1 } }, { attr: { "stroke-dashoffset": 0 }, duration: 1.0, ease: "sine.out", immediateRender: false }, t);
      tl.fromTo(g, { y: 0, opacity: 0 }, { keyframes: [{ opacity: 1, duration: 0.4 }, { opacity: 1, duration: 1.0 }, { opacity: 0, duration: 0.6 }], y: -120, duration: 2.0, ease: "sine.inOut", immediateRender: false }, t);
    });

    // ---------- 5. Goût : silence, la montre devant l'immeuble, « à l'heure ✓ » ----------
    const g0 = cadrage(1235, 420, 2.1), g1 = cadrage(1225, 410, 2.5);
    tl.fromTo("#ph-gout", g0, { ...g1, duration: T.recap - C[4], ease: "none", immediateRender: true }, C[4] + 0.5);
    P.horloge(tl, { parent: "#horloge-place", x: 650, y: 1190, taille: 290, heure: [9, 0], de: T.horloge - 0.2, fond: MOUTARDE });
    tl.fromTo("#a-l-heure", { opacity: 0, scale: 0.5, rotation: -12 }, { opacity: 1, scale: 1, rotation: -4, duration: 0.45, ease: "back.out(2.4)", immediateRender: false }, T.horloge + 0.2);

    // ---------- Récapitulatif : les 5 pictogrammes cochés en jaune ----------
    P.fondu(tl, "#p-recap", T.recap + 0.1, T.outro);
    const recap = rangee($("#rang-recap"), true);
    recap.forEach(({ coche, p }, i) => {
      tl.fromTo(coche, { attr: { "stroke-dashoffset": 1 } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.25, ease: "power2.out", immediateRender: false }, T.coches[i]);
      tl.fromTo(p, { scale: 1 }, { scale: 1.1, duration: 0.12, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, T.coches[i]);
    });
    tl.fromTo("#rang-recap", { scale: 1 }, { scale: 1.05, duration: T.outro - T.recap, ease: "none", transformOrigin: "50% 50%", immediateRender: false }, T.recap);
    P.texteSurligne(tl, { de: T.recap + 0.1, a: T.outro, phrases: phrases(T.jp) });

    // ---------- Outro JP PAPIER + slogan sur la voix ----------
    const outro = P.outroJP(tl, { parent: "#camera", de: T.outro });
    P.texteSurligne(tl, { de: T.outro, a: T.retour + 0.3, phrases: phrases(T.slogan) });

    // ---------- Retour vers l'image 1 (boucle) ----------
    tl.to(outro, { opacity: 0, duration: 0.45, ease: "power2.inOut" }, T.retour);
    tl.fromTo("#p-hook", { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.inOut", immediateRender: false }, T.retour);
    tl.set("#rang-hook", { scale: 1 }, T.retour);
    P.texteSurligne(tl, { de: T.retour, classe: "hook", phrases: [[{ text: "Les", start: T.retour, end: T.retour }, { text: "5", start: T.retour, end: T.retour, cle: true }, { text: "sens", start: T.retour, end: T.retour, cle: true }, { text: "du", start: T.retour, end: T.retour }, { text: "trajet", start: T.retour, end: T.retour }, { text: "parfait.", start: T.retour, end: T.retour }]] });
  };
})();
