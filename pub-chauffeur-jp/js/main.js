// « Chauffeur JP » — JP Papier (28,8 s, 9:16). Voir frame.md.
// On ne voit pas le visage du chauffeur avant la fin : réveil 05:30 à l'aube, gros plans de mains (clim,
// Wi-Fi, siège, rétroviseur), raccourci sur le plan de Douala, 07:50 au parking, silhouette de dos,
// puis la caméra remonte lentement jusqu'à son sourire. Outro, retour à l'image 1.
(function () {
  const J = window.JPPapier;
  const ENCRE = "#1A1A1A", MOUTARDE = "#F2C230", PEAU = "#6B4430", COSTUME = "#232A3F";

  // Main plate (paume + doigts + manchette), dessinée vers le haut ; renvoie le groupe à positionner.
  function main(parent, x, y, rot = 0, echelle = 1) {
    // Groupe extérieur libre pour les tweens (x/y GSAP), groupe intérieur pour la pose.
    const ext = J.svg(parent, "g", {});
    const g = J.svg(ext, "g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${echelle})` });
    J.svg(g, "rect", { x: -70, y: 70, width: 140, height: 160, rx: 20, fill: COSTUME });
    J.svg(g, "rect", { x: -66, y: 60, width: 132, height: 26, rx: 10, fill: "#F4EFE6" });
    J.svg(g, "rect", { x: -62, y: -40, width: 124, height: 110, rx: 46, fill: PEAU });
    [-48, -16, 16, 48].forEach((fx, k) => J.svg(g, "rect", { x: fx - 15, y: -120 + Math.abs(k - 1.5) * 14, width: 30, height: 100, rx: 15, fill: PEAU }));
    J.svg(g, "rect", { x: 52, y: -50, width: 30, height: 80, rx: 15, fill: PEAU, transform: "rotate(35 67 -10)" });
    return ext;
  }

  window.CONSTRUIRE = function (tl) {
    const T = window.T, P = T.plans;
    const fin = (i) => P[i + 1] ?? T.duree;
    ["#p0", "#p1", "#p2", "#p3", "#p4", "#p5", "#p6", "#p7", "#p8"].forEach((p, i) => J.fondu(tl, p, P[i], fin(i), { premier: i === 0 }));
    tl.to("#brun", { opacity: 0, duration: 0.6 }, P[5] - 0.3);

    // ════ HOOK : réveil 05:30 dans la pénombre, l'aube se lève ════
    J.texteSurligne(tl, { de: 0, a: P[1], classe: "clair", phrases: [[0, 0, "Tous les matins,"], [1.33, 2.63, "à cinq heures et demie,"], [3.0, 4.22, "il est déjà *debout."]] });
    tl.fromTo("#dp", { opacity: 1 }, { opacity: 0.2, duration: 0.5, repeat: 8, yoyo: true, ease: "steps(1)", immediateRender: false }, 0);
    tl.fromTo("#reveil", { scale: 1 }, { scale: 1.08, duration: P[1] + 0.3, ease: "none", immediateRender: true }, 0);
    tl.fromTo("#reveil", { x: 0 }, { keyframes: [{ x: -6, duration: 0.05 }, { x: 6, duration: 0.05 }, { x: 0, duration: 0.05 }], repeat: 2, repeatDelay: 0.1, immediateRender: false }, 0.1);
    tl.fromTo("#aube", { opacity: 0 }, { opacity: 1, duration: P[1], ease: "sine.in", immediateRender: true }, 0);
    tl.to("#aube", { opacity: 0.35, duration: 0.6 }, P[1]);
    tl.to("#aube", { opacity: 0, duration: 0.6 }, P[5] - 0.3);

    // ════ Gros plans de mains (un toutes les ~2 s) ════
    // a) La clim : la main tourne le bouton, un flocon pop.
    const clim = document.getElementById("d-clim");
    J.svg(clim, "rect", { x: 80, y: 260, width: 740, height: 520, rx: 60, fill: "#2A2019" });
    J.svg(clim, "circle", { cx: 450, cy: 520, r: 170, fill: "#3B2E25", stroke: "#5a4636", "stroke-width": 10 });
    const bouton = J.svg(clim, "g", {});
    J.svg(bouton, "circle", { cx: 450, cy: 520, r: 120, fill: "#1a1410" });
    J.svg(bouton, "rect", { x: 442, y: 410, width: 16, height: 60, rx: 8, fill: MOUTARDE });
    for (let k = 0; k < 9; k++) J.svg(clim, "rect", { x: 447, y: 330, width: 6, height: 18, fill: "#8a7a68", transform: `rotate(${-80 + k * 20} 450 520)` });
    const flocon = J.svg(clim, "g", {}); // le flocon est dessiné à sa place (pas de transform : GSAP l'écraserait)
    const floconPose = J.svg(flocon, "g", { transform: "translate(700 330)" });
    J.svg(floconPose, "circle", { r: 70, fill: MOUTARDE });
    [0, 60, 120].forEach((a) => J.svg(floconPose, "path", { d: "M0 -44 V44 M-10 -34 L0 -44 L10 -34 M-10 34 L0 44 L10 34", stroke: ENCRE, "stroke-width": 7, fill: "none", "stroke-linecap": "round", transform: `rotate(${a})` }));
    const mClim = main(clim, 640, 820, -30, 1.1);
    tl.fromTo(mClim, { x: 160, y: 200 }, { x: 0, y: 0, duration: 0.5, ease: "power2.out", immediateRender: false }, P[1]);
    tl.fromTo(bouton, { rotation: 0 }, { rotation: 70, svgOrigin: "450 520", duration: 0.6, ease: "back.out(1.6)", immediateRender: false }, 5.3);
    tl.fromTo(flocon, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, svgOrigin: "700 330", duration: 0.4, ease: "back.out(3)", immediateRender: false }, T.flocon);
    tl.fromTo(flocon, { rotation: 0 }, { rotation: 30, svgOrigin: "700 330", duration: 1.2, ease: "sine.inOut", immediateRender: false }, T.flocon + 0.4);

    // b) Le Wi-Fi : les arcs s'allument un à un.
    const wifi = document.getElementById("d-wifi");
    J.svg(wifi, "rect", { x: 150, y: 300, width: 600, height: 420, rx: 40, fill: "#17110D", stroke: "#5a4636", "stroke-width": 10 });
    const arcs = [[260, "M250 560 A200 200 0 0 1 650 560"], [180, "M310 600 A140 140 0 0 1 590 600"], [100, "M380 640 A70 70 0 0 1 520 640"]].map(([_, d]) =>
      J.svg(wifi, "path", { d, fill: "none", stroke: "#4a3d33", "stroke-width": 30, "stroke-linecap": "round" }));
    J.svg(wifi, "circle", { cx: 450, cy: 670, r: 22, fill: MOUTARDE });
    const lib = J.svg(wifi, "text", { x: 450, y: 840, "text-anchor": "middle", "font-family": "Inter", "font-weight": 700, "font-size": 56, fill: "#F6EEDF" }); lib.textContent = "Wi-Fi activé";
    [arcs[2], arcs[1], arcs[0]].forEach((a, k) => tl.to(a, { attr: { stroke: MOUTARDE }, duration: 0.15 }, T.wifi[k]));
    const mWifi = main(wifi, 760, 960, -20, 0.9);
    tl.fromTo(mWifi, { x: 120, y: 160 }, { x: 0, y: 0, duration: 0.5, ease: "power2.out", immediateRender: false }, P[2]);
    tl.fromTo(lib, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, T.wifi[2] + 0.1);

    // c) Le siège : le chiffon va et vient, cadré sur les mains.
    const siege = document.getElementById("d-siege");
    J.svg(siege, "path", { d: "M170 140 Q450 80 730 140 L760 1000 Q450 1060 140 1000Z", fill: "#2F2620" });
    for (let k = 0; k < 5; k++) J.svg(siege, "path", { d: `M${250 + k * 100} 170 L${235 + k * 108} 980`, stroke: "#3E332B", "stroke-width": 6 });
    const chiffon = J.svg(siege, "g", {});
    J.svg(chiffon, "path", { d: "M-130 -40 Q-60 -90 40 -60 Q140 -30 130 50 Q60 110 -40 80 Q-140 60 -130 -40Z", fill: "#EDE3CF" });
    J.svg(chiffon, "path", { d: "M-80 -20 Q0 -40 80 0", stroke: "#cdbfa6", "stroke-width": 6, fill: "none" });
    main(chiffon, 10, 60, 0, 0.9);
    tl.fromTo(chiffon, { x: 300, y: 600 }, { keyframes: [{ x: 600, duration: 0.35, ease: "sine.inOut" }, { x: 300, duration: 0.35, ease: "sine.inOut" }, { x: 600, duration: 0.35, ease: "sine.inOut" }, { x: 380, duration: 0.35, ease: "sine.inOut" }], immediateRender: true }, P[3]);
    tl.fromTo(chiffon, { y: 600 }, { y: 520, duration: 1.4, ease: "none", immediateRender: false }, P[3]);

    // d) Le rétroviseur : la main l'ajuste, le reflet de l'aube glisse.
    const retro = document.getElementById("d-retro");
    const miroir = J.svg(retro, "g", {});
    J.svg(retro, "rect", { x: 430, y: 0, width: 40, height: 330, fill: "#1a1410" });
    J.svg(miroir, "rect", { x: 110, y: 330, width: 680, height: 260, rx: 120, fill: "#1a1410" });
    const defs = J.svg(retro, "defs", {});
    const lg = J.svg(defs, "linearGradient", { id: "reflet", x1: 0, y1: 0, x2: 1, y2: 0 });
    [["0", "#3B2E25"], [".55", "#E6A564"], ["1", "#3B2E25"]].forEach(([o, c]) => J.svg(lg, "stop", { offset: o, "stop-color": c }));
    const verre = J.svg(miroir, "rect", { x: 135, y: 355, width: 630, height: 210, rx: 100, fill: "url(#reflet)" });
    const mRetro = main(retro, 830, 560, -70, 0.85);
    miroir.appendChild(mRetro);
    tl.fromTo(miroir, { rotation: -9 }, { rotation: 0, svgOrigin: "450 330", duration: 0.8, ease: "power2.inOut", immediateRender: false }, 10.0);
    tl.fromTo(verre, { x: -60 }, { x: 40, duration: 1.6, ease: "none", immediateRender: false }, P[4]);
    J.texteSurligne(tl, { de: P[1], a: P[3], classe: "clair", phrases: [[5.05, 6.69, "Il vérifie la *clim,"], [7.11, 7.69, "le Wi-Fi,"]] });
    J.texteSurligne(tl, { de: P[3], a: P[5], classe: "clair", phrases: [[8.5, 9.49, "il essuie le *siège,"], [9.88, 10.65, "impeccable."]] });

    // ════ Plan de Douala : le grand détour gris, puis le raccourci jaune ════
    const ville = document.getElementById("ville");
    J.svg(ville, "path", { d: "M-20 120 Q260 60 480 160 Q700 260 920 180 L920 -20 L-20 -20Z", fill: "#BFD0D6" });
    for (let k = 0; k < 9; k++) J.svg(ville, "path", { d: `M${-20 + k * 120} 1160 L${60 + k * 105} 220`, stroke: "#DCCFB6", "stroke-width": k % 3 ? 14 : 26 });
    for (let k = 0; k < 8; k++) J.svg(ville, "path", { d: `M-20 ${300 + k * 115} L920 ${260 + k * 120}`, stroke: "#DCCFB6", "stroke-width": k % 3 ? 14 : 26 });
    J.svg(ville, "path", { d: "M160 1000 L160 700 Q160 300 500 300 L740 300", fill: "none", stroke: "#9b8e7b", "stroke-width": 14, "stroke-dasharray": "4 22", "stroke-linecap": "round" });
    const raccourci = J.svg(ville, "path", { d: "M160 1000 L280 870 L270 740 L420 640 L470 500 L620 430 L740 300", fill: "none", stroke: MOUTARDE, "stroke-width": 18, "stroke-linecap": "round", "stroke-linejoin": "round" });
    [[160, 1000, "Chez toi"], [740, 300, "Bureau"]].forEach(([x, y, n]) => {
      J.svg(ville, "circle", { cx: x, cy: y, r: 26, fill: ENCRE });
      J.svg(ville, "circle", { cx: x, cy: y, r: 10, fill: MOUTARDE });
      const t = J.svg(ville, "text", { x, y: y + 70, "text-anchor": "middle", "font-family": "Caveat", "font-weight": 700, "font-size": 52, fill: ENCRE }); t.textContent = n;
    });
    const LR = raccourci.getTotalLength();
    raccourci.setAttribute("stroke-dasharray", `${LR} ${LR}`); raccourci.setAttribute("stroke-dashoffset", LR);
    tl.fromTo(raccourci, { attr: { "stroke-dashoffset": LR } }, { attr: { "stroke-dashoffset": 0 }, duration: T.trace[1] - T.trace[0], ease: "power1.inOut", immediateRender: false }, T.trace[0]);
    tl.fromTo("#ville", { scale: 1.12 }, { scale: 1, transformOrigin: "50% 60%", duration: fin(5) - P[5] + 0.3, ease: "power1.out", immediateRender: false }, P[5] - 0.3);
    J.texteSurligne(tl, { de: P[5], a: P[6], phrases: [[11.85, 14.01, "Il connaît chaque *raccourci de Douala."]] });

    // ════ 07:50 au parking, la voiture déjà garée ════
    J.zoomLent(tl, "#img-parking", P[6], fin(6), { depart: 1.02, arrivee: 1.14, origine: "60% 58%" });
    J.horloge(tl, { parent: "#p6", x: 700, y: 560, taille: 220, heure: [7, 50], de: 14.9 });
    J.texteSurligne(tl, { de: P[6], a: P[7], phrases: [[14.64, 16.25, "Il arrive toujours en *avance."]] });

    // ════ De dos, près de la voiture : on ne connaît pas encore son visage ════
    J.zoomLent(tl, "#img-parking2", P[7], fin(7), { depart: 1.05, arrivee: 1.16, origine: "35% 70%" });
    J.chauffeurJP("#dos", { dos: true });
    J.respiration(tl, "#dos", P[7], fin(7));
    J.texteSurligne(tl, { de: P[7], a: 19.5, phrases: [[17.3, 18.92, "Tu ne connais peut-être pas son *nom."]] });
    J.texteSurligne(tl, { de: 19.5, a: P[8], phrases: [[19.68, 20.73, "Mais c'est grâce à lui"], [21.13, 22.39, "que ta journée commence *bien."]] });

    // ════ Ralenti : la caméra remonte des mains jusqu'au sourire ════
    const c = J.chauffeurJP("#face", { brasLibre: true });
    tl.fromTo("#face", { y: -640, scale: 1.25 }, { y: 0, scale: 1, transformOrigin: "50% 0%", duration: T.revele[1] - T.revele[0], ease: "power1.inOut", immediateRender: false }, T.revele[0]);
    tl.fromTo("#face", { y: 0 }, { y: 30, duration: fin(8) - T.revele[1], ease: "none", immediateRender: false }, T.revele[1]);
    tl.fromTo(c.paupieres, { scaleY: 0 }, { keyframes: [{ scaleY: 1, duration: 0.06 }, { scaleY: 0, duration: 0.09 }], immediateRender: false }, 26.2);
    tl.fromTo(c.tete, { rotation: 0 }, { rotation: 3, svgOrigin: "200 220", duration: 0.7, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, T.revele[1]);
    J.texteSurligne(tl, { de: P[8], a: P[9], phrases: [[23.6, 23.82, "Lui,"], [24.47, 26.31, "c'est ton *chauffeur *JP."]] });

    // ════ Outro, puis retour à l'image 1 (pénombre + réveil) ════
    const outro = J.outroJP(tl, { parent: "#camera", de: P[9] });
    tl.to(outro, { opacity: 0, duration: 0.35, ease: "power2.in" }, T.retour);
    tl.to("#brun", { opacity: 1, duration: 0.35 }, T.retour);
    tl.fromTo("#p0", { opacity: 0 }, { opacity: 1, x: 0, duration: 0.35, immediateRender: false }, T.retour);
    tl.set("#reveil", { scale: 1 }, T.retour);
    J.texteSurligne(tl, { de: T.retour, classe: "clair", phrases: [[T.retour + 0.02, T.retour + 0.06, "Tous les matins,"]] });

    tl.to({}, { duration: T.duree }, 0);
  };
})();
