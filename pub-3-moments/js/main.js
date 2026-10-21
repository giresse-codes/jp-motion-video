// « 3 moments où tu vas regretter de conduire » — JP Stories (32,3 s, 9:16, liste numérotée). Voir frame.md.
// Hook : grand « 3 » tracé au marqueur ; trois moments (mariage, rendez-vous, Kribi) avec numéro jaune et
// progression ●○○ → ●●○ → ●●● ; phrase finale ; outro ; retour à l'image 1.
(function () {
  const J = window.JPStories;
  const MOUTARDE = "#F2C230", ENCRE = "#1A1A1A";

  window.CONSTRUIRE = function (tl) {
    const T = window.T, P = T.plans;
    const fin = (i) => P[i + 1] ?? T.duree;
    ["#p0", "#p1", "#p2", "#p3", "#p4"].forEach((p, i) => J.fondu(tl, p, P[i], fin(i), { premier: i === 0 }));

    // ════ HOOK : le « 3 » se dessine au marqueur, le texte est déjà lisible ════
    const trait = document.getElementById("trait-trois");
    const L = trait.getTotalLength();
    trait.setAttribute("stroke-dasharray", `${L} ${L}`);
    tl.fromTo(trait, { attr: { "stroke-dashoffset": L * 0.45 } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.9, ease: "power2.inOut", immediateRender: true }, 0);
    tl.fromTo("#trois", { scale: 1, rotation: -4 }, { scale: 1.08, rotation: 0, transformOrigin: "50% 50%", duration: P[1] + 0.3, ease: "none", immediateRender: true }, 0);
    J.texteSurligne(tl, { de: 0, a: P[1], phrases: [[0, 0, "Trois moments où tu vas *regretter"], [1.9, 3.45, "d'avoir conduit toi-même."]] });

    // ── Numéro jaune + progression (pendant les trois moments) ──
    tl.fromTo(["#numero", "#progression"], { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, P[1]);
    tl.to(["#numero", "#progression"], { opacity: 0, duration: 0.3 }, P[4] - 0.2);
    tl.to("#legendes", { y: 140, duration: 0.4, ease: "power2.inOut" }, P[1] - 0.2);
    tl.to("#legendes", { y: 0, duration: 0.4, ease: "power2.inOut" }, P[4] - 0.2);
    const chiffres = document.querySelectorAll("#numero span"), points = document.querySelectorAll("#progression i");
    [P[1], P[2], P[3]].forEach((t, k) => {
      if (k) tl.to(chiffres[k - 1], { opacity: 0, y: -40, duration: 0.25 }, t - 0.1);
      tl.fromTo(chiffres[k], { opacity: 0, y: 40, scale: 0.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(2.6)", immediateRender: false }, t + 0.05);
      tl.fromTo("#numero", { scale: 1 }, { keyframes: [{ scale: 1.15, duration: 0.12 }, { scale: 1, duration: 0.3, ease: "back.out(3)" }], immediateRender: false }, t + 0.05);
      tl.to(points[k], { backgroundColor: MOUTARDE, borderColor: MOUTARDE, scale: 1.3, duration: 0.15 }, t + 0.1);
      tl.to(points[k], { scale: 1, duration: 0.3, ease: "back.out(3)" }, t + 0.25);
    });

    // ════ ① Mariage : guirlandes qui scintillent, il regarde sa montre ════
    J.zoomLent(tl, "#img-mariage", P[1], fin(1), { depart: 1.02, arrivee: 1.18, origine: "45% 55%" });
    const scintille = document.getElementById("scintille");
    for (let k = 0; k < 26; k++) {
      const e = document.createElement("div"); e.className = "etincelle";
      Object.assign(e.style, { left: 40 + ((k * 263) % 820) + "px", top: 20 + ((k * 97) % 230) + "px" });
      scintille.appendChild(e);
      tl.fromTo(e, { opacity: 0.15, scale: 0.6 }, { opacity: 1, scale: 1.2, duration: 0.35 + (k % 4) * 0.1, repeat: 9, yoyo: true, ease: "sine.inOut", immediateRender: false }, P[1] + (k % 6) * 0.13);
    }
    // Gros plan montre sur « pas surveiller l'heure » : 23:40 -> 23:58.
    const m = J.montre(tl, { parent: "#montre-zone", x: 420, y: 1060, taille: 560, de: T.montre, a: fin(1), depart: [23, 40], arrivee: [23, 58] });
    tl.fromTo(m, { opacity: 0, scale: 0.4, rotation: -20 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2)", immediateRender: true }, T.montre);
    J.texteSurligne(tl, { de: P[1], a: 7.9, phrases: [[4.34, 4.54, "Un."], [5.46, 7.18, "Le mariage de ton meilleur ami."]] });
    J.texteSurligne(tl, { de: 7.9, a: P[2], phrases: [[8.05, 9.09, "Tu veux *danser jusqu'au bout,"], [9.57, 11.43, "pas surveiller l'heure pour reprendre la route."]] });

    // ════ ② Rendez-vous : Serge en retard, horloge 10:12 sur fond rouge pâle ════
    J.zoomLent(tl, "#img-retard", P[2], fin(2), { depart: 1.02, arrivee: 1.2, origine: "55% 30%" });
    J.horloge(tl, { parent: "#p2", x: 700, y: 640, taille: 220, heure: [10, 12], de: T.horloge, fond: "#F4CFC8" });
    const gouttes = document.getElementById("gouttes");
    [[560, 300], [610, 330], [585, 270]].forEach(([x, y], k) => {
      const g = document.createElement("div"); g.className = "goutte"; Object.assign(g.style, { left: x + "px", top: y + "px" }); gouttes.appendChild(g);
      tl.fromTo(g, { y: 0, opacity: 0 }, { keyframes: [{ opacity: 1, duration: 0.1 }, { y: 80, duration: 0.9, ease: "power1.in" }, { opacity: 0, duration: 0.15 }], repeat: 1, immediateRender: false }, 16.6 + k * 0.35);
    });
    J.texteSurligne(tl, { de: P[2], a: 16.3, phrases: [[12.7, 12.97, "Deux."], [13.9, 15.7, "Le rendez-vous qui peut tout changer."]] });
    J.texteSurligne(tl, { de: 16.3, a: P[3], phrases: [[16.58, 17.67, "Tu arrives en sueur,"], [17.97, 19.22, "et la première *impression est ratée."]] });

    // ════ ③ Kribi : la route se déroule, le compteur tourne jusqu'à 3 h, puis la plage ════
    const route = document.getElementById("route");
    J.svg(route, "rect", { width: 900, height: 1060, fill: "#E8DCC4" });
    J.svg(route, "path", { d: "M0 300 Q300 260 450 300 Q650 350 900 290 L900 0 L0 0Z", fill: "#CFE0E4" });
    const chemin = J.svg(route, "path", { d: "M450 1100 Q200 900 420 720 Q640 560 380 430 Q220 350 470 300", fill: "none", stroke: "#4A3B30", "stroke-width": 90, "stroke-linecap": "round" });
    const ligne = J.svg(route, "path", { d: "M450 1100 Q200 900 420 720 Q640 560 380 430 Q220 350 470 300", fill: "none", stroke: MOUTARDE, "stroke-width": 8, "stroke-dasharray": "30 30" });
    [[120, 820], [760, 660], [160, 500], [720, 420]].forEach(([x, y]) => {
      J.svg(route, "path", { d: `M${x} ${y} q8 -90 4 -150`, stroke: "#5b4a3a", "stroke-width": 10, fill: "none" });
      J.svg(route, "circle", { cx: x + 4, cy: y - 160, r: 46, fill: "#7C8F6A" });
    });
    const LR = chemin.getTotalLength();
    [chemin, ligne].forEach((el) => { el.setAttribute("stroke-dasharray", el === ligne ? "30 30" : `${LR} ${LR}`); });
    chemin.setAttribute("stroke-dashoffset", LR);
    tl.fromTo(chemin, { attr: { "stroke-dashoffset": LR } }, { attr: { "stroke-dashoffset": 0 }, duration: T.plage - P[3], ease: "power1.inOut", immediateRender: false }, P[3]);
    tl.fromTo(ligne, { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": -300 }, duration: T.plage - P[3], ease: "none", immediateRender: false }, P[3]);
    tl.fromTo("#compteur", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.4)", immediateRender: false }, 21.8);
    const LC = 2 * Math.PI * 84, anneau = document.getElementById("anneau-h");
    anneau.setAttribute("stroke-dasharray", `${LC} ${LC}`);
    const h = { v: 0 };
    const majH = () => { document.getElementById("heures").textContent = `${Math.floor(h.v)} h`; anneau.setAttribute("stroke-dashoffset", `${LC * (1 - h.v / 3)}`); };
    majH();
    tl.fromTo(h, { v: 0 }, { v: 3, duration: T.compteur[1] - T.compteur[0], ease: "power1.in", onUpdate: majH, immediateRender: false }, T.compteur[0]);
    tl.to("#compteur", { opacity: 0, duration: 0.3 }, T.plage);
    tl.to("#img-plage", { opacity: 1, duration: 0.6, ease: "power1.inOut" }, T.plage);
    tl.fromTo("#img-plage", { scale: 1.12 }, { scale: 1.02, duration: fin(3) - T.plage + 0.3, ease: "none", immediateRender: false }, T.plage); // on recule : on respire
    J.texteSurligne(tl, { de: P[3], a: 23.3, phrases: [[20.59, 20.88, "Trois."], [21.74, 22.63, "Le week-end à Kribi."]] });
    J.texteSurligne(tl, { de: 23.3, a: P[4], phrases: [[23.51, 24.33, "Trois heures de volant"], [25.01, 26.24, "au lieu de trois heures de *repos."]] });

    // ════ Phrase finale seule ════
    J.texteSurligne(tl, { de: P[4], a: P[5], classe: "centre", phrases: [[27.38, 28.42, "Le jour où ça compte,"], [28.83, 30.13, "laisse quelqu'un *conduire pour toi."]] });

    // ════ Outro, puis retour à l'image 1 ════
    const outro = J.outroJP(tl, { parent: "#camera", de: P[5] });
    tl.to(outro, { opacity: 0, duration: 0.35, ease: "power2.in" }, T.retour);
    tl.fromTo("#p0", { opacity: 0 }, { opacity: 1, x: 0, duration: 0.35, immediateRender: false }, T.retour);
    tl.set("#trois", { scale: 1, rotation: -4 }, T.retour);
    J.texteSurligne(tl, { de: T.retour, phrases: [[T.retour + 0.02, T.retour + 0.06, "Trois moments où tu vas *regretter"]] });

    tl.to({}, { duration: T.duree }, 0);
  };
})();
