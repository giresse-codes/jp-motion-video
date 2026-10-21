// « POV : tu atterris à 23 h » — JP Papier (23,9 s, 9:16, vue subjective). Voir frame.md.
// Écran noir + ding, hall d'arrivée (photo fournie) qui avance en POV avec des « Taxi ? » de tous côtés,
// rack focus sur le chauffeur JP et sa pancarte, gros plan (il prend la valise), départ de nuit, outro + badge.
(function () {
  const J = window.JPPapier;
  const ENCRE = "#1A1A1A", MOUTARDE = "#F2C230", PEAU = "#6B4430", COSTUME = "#232A3F";

  // Chauffeur JP en illustration plate (400×600) : casquette, costume sombre, sourire.
  // Renvoie les paupières (clignement), le bras droit (geste) et la tête (petits mouvements).
  function chauffeur(parent, { brasLibre = false } = {}) {
    const s = J.svg(document.querySelector(parent), "svg", { viewBox: "0 0 400 600", width: "100%", height: "100%", overflow: "visible" });
    const corps = J.svg(s, "g", {});
    J.svg(corps, "path", { d: "M60 600 L70 330 Q80 260 150 248 L250 248 Q320 260 330 330 L340 600Z", fill: COSTUME });
    J.svg(corps, "path", { d: "M170 250 L200 330 L230 250Z", fill: "#F4EFE6" });
    J.svg(corps, "path", { d: "M193 262 L207 262 L212 330 L200 350 L188 330Z", fill: "#1b1f2c" });
    J.svg(corps, "path", { d: "M150 250 L200 360 L175 600 M250 250 L200 360", stroke: "#1a2030", "stroke-width": 4, fill: "none" });
    J.svg(corps, "rect", { x: 182, y: 205, width: 36, height: 50, rx: 14, fill: PEAU });
    const tete = J.svg(s, "g", { id: "tete" });
    J.svg(tete, "ellipse", { cx: 200, cy: 150, rx: 66, ry: 76, fill: PEAU });
    J.svg(tete, "ellipse", { cx: 134, cy: 158, rx: 11, ry: 17, fill: PEAU });
    J.svg(tete, "ellipse", { cx: 266, cy: 158, rx: 11, ry: 17, fill: PEAU });
    J.svg(tete, "path", { d: "M136 120 Q140 70 200 66 Q260 70 264 120 L264 104 Q250 50 200 48 Q150 50 136 104Z", fill: "#1d1513" });
    // Casquette de chauffeur.
    J.svg(tete, "path", { d: "M128 104 Q130 52 200 46 Q270 52 272 104Z", fill: COSTUME });
    J.svg(tete, "rect", { x: 122, y: 98, width: 156, height: 16, rx: 8, fill: "#151a28" });
    J.svg(tete, "circle", { cx: 200, cy: 78, r: 9, fill: MOUTARDE });
    // Yeux, sourcils, sourire, barbe courte.
    [172, 228].forEach((x) => {
      J.svg(tete, "ellipse", { cx: x, cy: 150, rx: 9, ry: 10, fill: "#fff" });
      J.svg(tete, "circle", { cx: x + 1, cy: 151, r: 5.5, fill: ENCRE });
      J.svg(tete, "path", { d: `M${x - 16} 130 Q${x} 122 ${x + 16} 130`, stroke: "#1d1513", "stroke-width": 6, fill: "none", "stroke-linecap": "round" });
    });
    const paupieres = [172, 228].map((x) => J.svg(tete, "ellipse", { cx: x, cy: 146, rx: 11, ry: 12, fill: PEAU, transform: `translate(0 0)`, style: "transform-box: fill-box; transform-origin: 50% 0%; transform: scaleY(0)" }));
    J.svg(tete, "path", { d: "M196 160 Q200 178 192 182", stroke: "#4a2c1e", "stroke-width": 4, fill: "none", "stroke-linecap": "round" });
    J.svg(tete, "path", { d: "M164 192 Q200 222 236 192 Q200 206 164 192Z", fill: "#fff", stroke: "#3a2016", "stroke-width": 4, "stroke-linejoin": "round" });
    J.svg(tete, "path", { d: "M150 196 Q200 250 250 196 Q246 222 200 228 Q154 222 150 196Z", fill: "#1d1513", opacity: 0.55 });
    // Bras : levés vers la pancarte, ou le droit libre pour prendre la valise.
    const brasG = J.svg(s, "g", {});
    J.svg(brasG, "path", { d: "M90 300 Q40 380 120 430", stroke: COSTUME, "stroke-width": 52, fill: "none", "stroke-linecap": "round" });
    J.svg(brasG, "circle", { cx: 128, cy: 432, r: 26, fill: PEAU });
    const brasD = J.svg(s, "g", { style: "transform-box: view-box; transform-origin: 310px 300px" });
    if (brasLibre) {
      J.svg(brasD, "path", { d: "M310 300 Q350 420 300 560", stroke: COSTUME, "stroke-width": 52, fill: "none", "stroke-linecap": "round" });
      J.svg(brasD, "circle", { cx: 298, cy: 572, r: 28, fill: PEAU });
    } else {
      J.svg(brasD, "path", { d: "M310 300 Q360 380 280 430", stroke: COSTUME, "stroke-width": 52, fill: "none", "stroke-linecap": "round" });
      J.svg(brasD, "circle", { cx: 272, cy: 432, r: 26, fill: PEAU });
    }
    return { svg: s, tete, paupieres, brasD };
  }

  // Ville de nuit : immeubles aux fenêtres chaudes, lampadaires, route en perspective, voiture qui s'éloigne.
  function construireNuit() {
    const n = document.getElementById("nuit");
    J.svg(n, "rect", { width: 1080, height: 1920, fill: "#2A2019" });
    J.svg(n, "rect", { width: 1080, height: 1100, fill: "#3B2E25" });
    const lune = J.svg(n, "circle", { cx: 820, cy: 640, r: 60, fill: "#F3E6C8", opacity: 0.9 });
    let x = -20, i = 0;
    const fenetres = [];
    while (x < 1100) {
      const l = 90 + ((i * 53) % 90), h = 260 + ((i * 97) % 300);
      J.svg(n, "rect", { x, y: 1100 - h, width: l, height: h, fill: i % 2 ? "#1E1712" : "#241B15" });
      for (let fy = 1100 - h + 30; fy < 1080; fy += 46) for (let fx = x + 16; fx < x + l - 20; fx += 32) {
        if (((fx * 7 + fy * 3 + i) % 5) < 2) fenetres.push(J.svg(n, "rect", { x: fx, y: fy, width: 14, height: 20, fill: "#F2C46A", opacity: 0.8 }));
      }
      x += l + 8; i++;
    }
    // Route vers le point de fuite.
    J.svg(n, "path", { d: "M540 1100 L1080 1920 L0 1920Z", fill: "#1A1410" });
    for (let k = 0; k < 7; k++) {
      const t0 = k / 7, t1 = (k + 0.5) / 7;
      const y0 = 1100 + 820 * t0 * t0, y1 = 1100 + 820 * t1 * t1;
      J.svg(n, "path", { d: `M${540 - 6 * t0} ${y0} L${540 + 6 * t0} ${y0} L${540 + 14 * t1} ${y1} L${540 - 14 * t1} ${y1}Z`, fill: MOUTARDE, opacity: 0.6 });
    }
    [[200, 1500], [880, 1500], [330, 1250], [750, 1250]].forEach(([lx, ly], k) => {
      J.svg(n, "rect", { x: lx - 4, y: ly - 260 * (k < 2 ? 1 : 0.6), width: 8, height: 260 * (k < 2 ? 1 : 0.6), fill: "#120d0a" });
      J.svg(n, "circle", { cx: lx, cy: ly - 260 * (k < 2 ? 1 : 0.6), r: k < 2 ? 70 : 44, fill: "rgba(242,196,106,.25)" });
    });
    // Voiture vue de l'arrière (part du bas, rapetisse vers le point de fuite).
    const v = J.svg(n, "g", { id: "voiture-nuit" });
    J.svg(v, "path", { d: "M-150 0 L-140 -80 Q-120 -150 -60 -160 L60 -160 Q120 -150 140 -80 L150 0 Q150 30 120 30 L-120 30 Q-150 30 -150 0Z", fill: "#151515" });
    J.svg(v, "path", { d: "M-105 -90 Q-90 -140 -50 -145 L50 -145 Q90 -140 105 -90Z", fill: "#3a3a40" });
    [-110, 110].forEach((fx) => J.svg(v, "rect", { x: fx - 28, y: -50, width: 56, height: 18, rx: 8, fill: "#FFB347" }));
    [-110, 110].forEach((fx) => J.svg(v, "ellipse", { cx: fx, cy: -40, rx: 60, ry: 26, fill: "rgba(255,179,71,.28)" }));
    return { fenetres, lune };
  }

  window.CONSTRUIRE = function (tl) {
    const T = window.T, P = T.plans;
    const fin = (i) => P[i + 1] ?? T.duree;

    // ════ 1. HOOK : écran noir, ding de cabine, texte déjà lisible ════
    J.texteSurligne(tl, { de: 0, a: 2.4, classe: "clair", phrases: [[0, 0, "POV&nbsp;: tu *atterris à 23 h."]] });
    J.texteSurligne(tl, { de: 2.4, a: P[1], classe: "clair", phrases: [[2.51, 4.16, "Ton avion vient d'atterrir à *Douala."]] });
    tl.to("#noir", { opacity: 0, duration: 0.9, ease: "power1.inOut" }, P[1] - 0.4);
    tl.set("#hall", { opacity: 1 }, P[1] - 0.4);

    // ════ 2. Hall en POV : on avance, ça bouge, « Taxi ? » de tous côtés ════
    tl.fromTo(["#hall-flou", "#hall-net"], { scale: 1.0 }, { scale: 1.16, duration: P[2] - P[1] + 0.4, ease: "none", immediateRender: false }, P[1] - 0.4);
    tl.fromTo("#hall", { x: 0, y: 0, rotation: 0 }, { keyframes: Array.from({ length: 14 }, (_, k) => ({ x: Math.sin(k * 1.7) * 6, y: Math.cos(k * 2.3) * 5, rotation: Math.sin(k * 1.1) * 0.4, duration: 0.5, ease: "sine.inOut" })), immediateRender: false }, P[1]);
    const zone = document.getElementById("taxis");
    T.taxis.forEach((t, k) => {
      const b = document.createElement("div");
      b.className = "bulle-taxi"; b.textContent = "Taxi ?";
      const x = 80 + ((k * 337) % 700), y = 640 + ((k * 211) % 800);
      Object.assign(b.style, { left: x + "px", top: y + "px" });
      zone.appendChild(b);
      tl.fromTo(b, { opacity: 0, scale: 0.4, rotation: k % 2 ? 8 : -8 }, { opacity: 1, scale: 1, rotation: k % 2 ? 3 : -3, duration: 0.25, ease: "back.out(2.6)", immediateRender: false }, t);
      tl.to(b, { opacity: 0, scale: 0.8, duration: 0.25, ease: "power2.in" }, Math.min(t + 0.9, P[2] - 0.2));
    });
    J.fondu(tl, "#p2", P[1], P[2]);
    J.texteSurligne(tl, { de: P[1], a: 8.4, phrases: [[5.52, 6.14, "Il fait *chaud."], [6.79, 7.68, "Tu es épuisé."]] });
    J.texteSurligne(tl, { de: 8.4, a: P[2], phrases: [[8.6, 10.52, "Tout le monde te crie&nbsp;: *« Taxi ? Taxi ? »"]] });

    // ════ 3. Rack focus : la foule s'efface, le chauffeur JP net au centre, le nom s'écrit ════
    tl.to("#hall-flou", { filter: "blur(16px) brightness(.75)", duration: 1.0, ease: "power2.inOut" }, P[2]);
    tl.to("#hall-net", { opacity: 0, duration: 0.8 }, P[2]);
    J.fondu(tl, "#p3", P[2], P[3]);
    const c1 = chauffeur("#chauffeur-plein");
    tl.fromTo("#chauffeur-plein", { filter: "blur(14px)", opacity: 0, scale: 0.92 }, { filter: "blur(0px)", opacity: 1, scale: 1, duration: 1.0, ease: "power2.out", immediateRender: false }, P[2] + 0.2);
    const panneau = J.pancarte(tl, { parent: "#p3", x: 260, y: 1060, largeur: 560, texte: "M. Essomba", sousTexte: "JP Service", de: P[2] + 0.5, a: P[3] });
    const nom = panneau.querySelector("b");
    tl.fromTo(nom, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: T.nom[1] - T.nom[0], ease: "none", immediateRender: true }, T.nom[0]);
    J.zoomLent(tl, "#chauffeur-plein", P[2], P[3], { depart: 1, arrivee: 1.06, origine: "50% 30%" });
    tl.fromTo(c1.tete, { rotation: 0 }, { rotation: 3, svgOrigin: "200 220", duration: 0.8, repeat: 4, yoyo: true, ease: "sine.inOut", immediateRender: false }, P[2] + 0.6);
    [14.9, 16.3].forEach((t) => tl.fromTo(c1.paupieres, { scaleY: 0 }, { keyframes: [{ scaleY: 1, duration: 0.06 }, { scaleY: 0, duration: 0.09 }], immediateRender: false }, t));
    J.texteSurligne(tl, { de: P[2], a: P[3], phrases: [[12.14, 12.51, "Et puis…"], [13.39, 15.56, "tu vois ton *nom sur une pancarte."]] });

    // ════ 4. Gros plan : il sourit et prend la valise ════
    J.fondu(tl, "#p4", P[3], P[4]);
    const c2 = chauffeur("#chauffeur-proche", { brasLibre: true });
    tl.fromTo("#chauffeur-proche", { scale: 1.05 }, { scale: 1.14, duration: P[4] - P[3] + 0.3, ease: "none", immediateRender: false }, P[3] - 0.3);
    tl.fromTo(c2.brasD, { rotation: -25 }, { rotation: 0, duration: 0.7, ease: "power2.out", immediateRender: false }, T.valise - 0.7);
    tl.fromTo("#poignee", { x: 0, y: 0, rotation: 0 }, { x: 120, y: -90, rotation: 6, duration: 0.6, ease: "power2.inOut", immediateRender: false }, T.valise);
    tl.fromTo(c2.paupieres, { scaleY: 0 }, { keyframes: [{ scaleY: 1, duration: 0.06 }, { scaleY: 0, duration: 0.09 }], immediateRender: false }, 17.6);
    J.texteSurligne(tl, { de: P[3], a: P[4], phrases: [[17.3, 18.11, "Ton chauffeur t'*attend."]] });

    // ════ 5. Plan large de nuit : la voiture s'éloigne, la ville scintille ════
    tl.to("#hall", { opacity: 0, duration: 0.6 }, P[4] - 0.3);
    J.fondu(tl, "#p5", P[4], P[5]);
    const { fenetres, lune } = construireNuit();
    tl.fromTo("#voiture-nuit", { x: 540, y: 1840, scale: 1.4 }, { x: 540, y: 1150, scale: 0.12, duration: P[5] - P[4] + 0.2, ease: "power2.in", immediateRender: true }, P[4]);
    fenetres.forEach((f, k) => { if (k % 4 === 0) tl.fromTo(f, { opacity: 0.8 }, { opacity: 0.25, duration: 0.6, repeat: 3, yoyo: true, ease: "sine.inOut", immediateRender: false }, P[4] + (k % 7) * 0.15); });
    tl.fromTo("#nuit", { scale: 1 }, { scale: 1.05, transformOrigin: "50% 57%", duration: P[5] - P[4] + 0.3, ease: "none", immediateRender: false }, P[4]);
    J.texteSurligne(tl, { de: P[4], a: P[5], classe: "clair", phrases: [[19.37, 21.36, "C'est ça, rentrer à la *maison."]] });

    // ════ 6. Outro + badge, puis retour à l'image 1 (noir + texte du hook) ════
    J.outroJP(tl, { parent: "#camera", de: P[5], badge: "Transfert aéroport dès 8&nbsp;000 FCFA" });
    tl.to("#noir", { opacity: 1, duration: 0.35, ease: "power2.in" }, T.retour);
    tl.set(document.querySelector(".jp-outro"), { opacity: 0 }, T.retour + 0.35);
    J.texteSurligne(tl, { de: T.retour, classe: "clair", phrases: [[T.retour + 0.05, T.retour + 0.1, "POV&nbsp;: tu *atterris à 23 h."]] });

    tl.to({}, { duration: T.duree }, 0);
  };
})();
