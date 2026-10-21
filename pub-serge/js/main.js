// « L'histoire de Serge » — JP Service Express Urbaine (57 s, 9:16, voix off fournie). Storytelling illustré.
// 13 plans en fondus enchaînés, illustrations fournies (assets/images) animées par zoom lent, respiration
// et petits mouvements ; texte en haut à gauche mot par mot avec surlignage moutarde. Timeline GSAP en pause.

(function () {
  const NS = "http://www.w3.org/2000/svg";
  const svg = (parent, nom, attrs) => {
    const el = document.createElementNS(NS, nom);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    parent.appendChild(el);
    return el;
  };
  const alea = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const MOUTARDE = "#F2C230", ENCRE = "#1A1A1A";

  // Cadran d'horloge (rayon 50) ; renvoie les aiguilles pour les animer.
  function cadran(el, heures, minutes) {
    svg(el, "circle", { r: 54, fill: "#FBF7EE", stroke: ENCRE, "stroke-width": 6 });
    for (let i = 0; i < 12; i++) svg(el, "rect", { x: -2, y: -48, width: 4, height: i % 3 ? 7 : 12, fill: ENCRE, transform: `rotate(${i * 30})` });
    const h = svg(el, "rect", { x: -3, y: -26, width: 6, height: 30, rx: 3, fill: ENCRE, transform: `rotate(${(heures + minutes / 60) * 30})` });
    const m = svg(el, "rect", { x: -2, y: -40, width: 4, height: 44, rx: 2, fill: ENCRE, transform: `rotate(${minutes * 6})` });
    svg(el, "circle", { r: 5, fill: MOUTARDE });
    return { h, m };
  }

  window.CONSTRUIRE = function (tl) {
    const T = window.T;
    const $ = (id) => document.getElementById(id);
    const tous = (sel, r = document) => Array.from(r.querySelectorAll(sel));
    const S = T.scenes;
    const fin = (i) => S[i + 1] ?? T.duree;

    // ── Texte mot par mot (mots répartis dans chaque phrase au prorata de leur longueur) ──
    const zone = $("legendes");
    T.blocs.forEach((b) => {
      const bloc = document.createElement("div");
      bloc.className = "bloc " + (b.classe || "");
      zone.appendChild(bloc);
      if (b.de === 0) gsap.set(bloc, { opacity: 1 }); // hook lisible dès l'image 1
      else tl.fromTo(bloc, { opacity: 0 }, { opacity: 1, duration: 0.01, immediateRender: false }, b.de);
      tl.to(bloc, { opacity: 0, y: -16, duration: 0.35, ease: "power2.in" }, b.a - 0.35);
      b.phrases.forEach(([a, z, texte]) => {
        const ligne = document.createElement("div"); ligne.className = "phrase"; bloc.appendChild(ligne);
        const mots = texte.split(" ");
        const poids = mots.map((m) => Math.max(m.replace(/[^\p{L}\d]/gu, "").length, 3) + 2);
        const total = poids.reduce((x, y) => x + y, 0);
        let t = a;
        mots.forEach((m, i) => {
          const s = document.createElement("span");
          const cle = m.startsWith("*");
          s.className = "mot" + (cle ? " cle" : "");
          s.innerHTML = (cle ? '<i class="trait"></i>' : "") + m.replace(/^\*/, "");
          ligne.appendChild(s);
          if (z === a) gsap.set(s, { opacity: 1 }); // déjà lisible à l'image 1
          else tl.fromTo(s, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out", immediateRender: false }, t);
          if (cle) tl.fromTo(s.querySelector(".trait"), { scaleX: 0, rotation: -1 }, { scaleX: 1, rotation: -1, duration: 0.45, ease: "power2.out", immediateRender: false }, Math.max(t, 0.6));
          t += ((z - a) * poids[i]) / total;
        });
      });
    });

    // ── Plans : fondus enchaînés + léger glissement de caméra, zoom lent continu ──
    tous(".plan").forEach((p, i) => {
      const d = S[i], f = fin(i);
      if (i === 0) gsap.set(p, { opacity: 1 });
      else tl.fromTo(p, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", immediateRender: false }, d - 0.3);
      if (i < S.length - 1) tl.to(p, { opacity: 0, x: -40, duration: 0.6, ease: "power2.in" }, f - 0.3);
      const img = p.querySelector(".cadre img:not(.fond-flou):not(.decoupe):not(#img-retard)");
      if (img) tl.fromTo(img, { scale: 1.02 }, { scale: 1.12, duration: f - d + 0.6, ease: "none" }, d - 0.3);
    });
    // Fond brun chaud pour l'intérieur de voiture.
    tl.to("#brun", { opacity: 1, duration: 0.6 }, S[7] - 0.3);
    tl.to("#brun", { opacity: 0, duration: 0.6 }, S[8] - 0.3);

    // ════ 1. HOOK : la montre approche de 10:00, l'anneau jaune se remplit ════
    const montre = $("montre");
    const anneau = svg(montre, "circle", { r: 350, fill: "none", stroke: MOUTARDE, "stroke-width": 26, "stroke-linecap": "round", transform: "rotate(-90)" });
    svg(montre, "circle", { r: 350, fill: "none", stroke: "rgba(26,26,26,.08)", "stroke-width": 26 });
    svg(montre, "circle", { r: 300, fill: "#FBF7EE", stroke: ENCRE, "stroke-width": 14 });
    for (let i = 0; i < 60; i++) svg(montre, "rect", { x: i % 5 ? -2 : -5, y: -280, width: i % 5 ? 4 : 10, height: i % 5 ? 16 : 36, fill: ENCRE, transform: `rotate(${i * 6})` });
    [["12", 0, -205], ["3", 210, 22], ["6", 0, 240], ["9", -210, 22]].forEach(([n, x, y]) => {
      const t = svg(montre, "text", { x, y, "text-anchor": "middle", "font-family": "Inter", "font-weight": 700, "font-size": 64, fill: ENCRE }); t.textContent = n;
    });
    const aigH = svg(montre, "rect", { x: -10, y: -150, width: 20, height: 170, rx: 10, fill: ENCRE });
    const aigM = svg(montre, "rect", { x: -7, y: -235, width: 14, height: 255, rx: 7, fill: ENCRE });
    const aigS = svg(montre, "rect", { x: -2.5, y: -250, width: 5, height: 290, fill: MOUTARDE });
    svg(montre, "circle", { r: 16, fill: MOUTARDE });
    const L = 2 * Math.PI * 350;
    anneau.setAttribute("stroke-dasharray", `${L} ${L}`);
    const heure = { m: 50 };
    const majMontre = () => {
      const m = heure.m;
      aigH.setAttribute("transform", `rotate(${(9 + m / 60) * 30})`);
      aigM.setAttribute("transform", `rotate(${m * 6})`);
      aigS.setAttribute("transform", `rotate(${Math.floor((m % 1) * 60) * 6})`);
      anneau.setAttribute("stroke-dashoffset", `${L * (1 - (m - 50) / 10)}`);
    };
    majMontre();
    tl.fromTo(heure, { m: 50 }, { m: 59.7, duration: S[1], ease: "power1.in", onUpdate: majMontre }, 0);
    tl.fromTo("#montre", { scale: 1 }, { scale: 1.1, duration: S[1] + 0.3, ease: "none" }, 0);

    // ════ 2. Serge la nuit : lampe qui vacille, note du dossier ════
    tl.fromTo("#lampe", { opacity: 0.7 }, { opacity: 1, duration: 0.5, repeat: 5, yoyo: true, ease: "sine.inOut" }, S[1]);
    tl.fromTo("#note-dossier", { opacity: 0, y: 120, rotation: 4 }, { opacity: 1, y: 0, rotation: -4, duration: 0.6, ease: "back.out(1.6)" }, 5.3);
    tl.to("#note-dossier", { y: -10, duration: 1.2, ease: "sine.inOut" }, 5.9);

    // ════ 3. Pont du Wouri : la circulation avance à peine, Serge transpire ════
    tl.fromTo("#img-pont", { yPercent: 0 }, { yPercent: -3, duration: fin(2) - S[2], ease: "none" }, S[2]);
    tl.fromTo("#encart-volant", { opacity: 0, y: 120, rotation: -8 }, { opacity: 1, y: 0, rotation: -3, duration: 0.6, ease: "back.out(1.5)" }, 8.6);
    tl.fromTo("#encart-volant img", { scale: 1 }, { scale: 1.08, duration: 2.3, ease: "none" }, 8.6);
    const gouttes = $("gouttes");
    [[150, 60], [262, 70], [200, 40]].forEach(([x, y], k) => {
      const g = document.createElement("div"); g.className = "goutte"; g.style.left = x + "px"; g.style.top = y + "px"; gouttes.appendChild(g);
      tl.fromTo(g, { y: 0, opacity: 0 }, { keyframes: [{ opacity: 1, duration: 0.1 }, { y: 70, duration: 0.9, ease: "power1.in" }, { opacity: 0, duration: 0.15 }], repeat: 1, immediateRender: false }, 8.8 + k * 0.35);
    });

    // ════ 4. Vue de dessus : la voiture tourne, le chrono monte à 20 min ════
    const dessus = $("dessus");
    svg(dessus, "rect", { width: 900, height: 1180, fill: "#E3D8C3" });
    const RX = [-60, 330, 720, 1110], RY = [120, 520, 920, 1320];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const x0 = RX[i] + 65, x1 = RX[i + 1] - 65, y0 = RY[j] + 65, y1 = RY[j + 1] - 65;
      svg(dessus, "rect", { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: 26, fill: "#CDBEA2" });
      svg(dessus, "rect", { x: x0 + 26, y: y0 + 26, width: x1 - x0 - 52, height: y1 - y0 - 52, rx: 14, fill: "#D6C8AE" });
    }
    const GRIS = ["#8C8173", "#A39684", "#6E655A", "#B5A894"];
    let k = 0;
    RX.forEach((x) => { for (let y = 40; y < 1180; y += 74) { if (RY.some((r) => Math.abs(r - y) < 90)) continue; [-1, 1].forEach((s) => svg(dessus, "rect", { x: x + s * 44 - 17, y: y - 30, width: 34, height: 60, rx: 9, fill: GRIS[k++ % 4] })); } });
    RY.forEach((y) => { for (let x = 30; x < 900; x += 82) { if (RX.some((r) => Math.abs(r - x) < 90)) continue; [-1, 1].forEach((s) => svg(dessus, "rect", { x: x - 30, y: y + s * 44 - 17, width: 60, height: 34, rx: 9, fill: GRIS[k++ % 4] })); } });
    const boucle = "M390 520 H660 Q720 520 720 580 V860 Q720 920 660 920 H390 Q330 920 330 860 V580 Q330 520 390 520Z";
    const trace = svg(dessus, "path", { d: boucle, fill: "none", stroke: MOUTARDE, "stroke-width": 12, "stroke-linecap": "round", opacity: 0.85 });
    const chemin = svg(dessus, "path", { d: boucle, fill: "none", stroke: "none" });
    const auto = svg(dessus, "g", {});
    svg(auto, "rect", { x: -38, y: -20, width: 76, height: 40, rx: 12, fill: "#22304F" });
    svg(auto, "rect", { x: 8, y: -14, width: 16, height: 28, rx: 5, fill: "rgba(255,255,255,.55)" });
    const LB = chemin.getTotalLength();
    trace.setAttribute("stroke-dasharray", `${LB * 2} ${LB * 2}`);
    const tour = { p: 0 };
    const majTour = () => {
      const s = (tour.p * LB) % LB, a = chemin.getPointAtLength(s), b = chemin.getPointAtLength((s + 5) % LB);
      auto.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${(Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI})`);
      trace.setAttribute("stroke-dashoffset", `${LB * 2 - Math.min(tour.p, 2) * LB}`);
    };
    majTour();
    tl.fromTo(tour, { p: 0 }, { p: 2.2, duration: fin(3) - S[3] + 0.3, ease: "none", onUpdate: majTour }, S[3] - 0.3);
    const LC = 2 * Math.PI * 84;
    $("anneau-chrono").setAttribute("stroke-dasharray", `${LC} ${LC}`);
    const chrono = { m: 0 };
    const majChrono = () => { $("minutes").textContent = Math.round(chrono.m); $("anneau-chrono").setAttribute("stroke-dashoffset", `${LC * (1 - chrono.m / 20)}`); };
    majChrono();
    tl.fromTo(chrono, { m: 0 }, { m: 20, duration: 1.6, ease: "power2.in", onUpdate: majChrono }, 11.1);
    tl.fromTo("#chrono", { scale: 1 }, { keyframes: [{ scale: 1.12, duration: 0.12 }, { scale: 1, duration: 0.3, ease: "back.out(3)" }], immediateRender: false }, 12.7);

    // ════ 5. Serge arrive : horloge 10:12, respiration essoufflée ════
    cadran($("horloge1"), 10, 12);
    tl.fromTo("#horloge1", { scale: 0, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2)" }, 13.4);
    tl.fromTo("#img-retard", { scale: 1.02 }, { scale: 1.1, duration: 15.4 - S[4] + 0.3, ease: "none" }, S[4] - 0.3);
    tl.fromTo("#img-retard", { y: 0 }, { y: -5, duration: 0.35, repeat: 13, yoyo: true, ease: "sine.inOut", immediateRender: false }, S[4]); // essoufflé
    // Zoom vers le visage sur « chemise froissée, front qui transpire ».
    tl.to("#img-retard", { scale: 1.32, transformOrigin: "55% 32%", duration: 2.4, ease: "power2.inOut" }, 15.4);

    // ════ 6. L'investisseuse regarde sa montre (zoom lent sur le poignet) ════
    tl.fromTo("#inv-montre", { scale: 1, xPercent: -50 }, { scale: 1.25, xPercent: -50, transformOrigin: "62% 40%", duration: fin(5) - S[5], ease: "power1.inOut" }, S[5]);
    tl.fromTo("#inv-montre", { y: 0 }, { y: -4, duration: 0.9, repeat: 3, yoyo: true, ease: "sine.inOut", immediateRender: false }, S[5]);

    // ════ 8. Intérieur de voiture : lumières de rue qui passent, étiquettes ════
    tl.fromTo("#lumiere-rue", { x: 0 }, { x: 1700, duration: 1.6, repeat: 4, ease: "none" }, S[7]);
    tl.fromTo("#img-voiture", { y: 0 }, { y: -3, duration: 0.25, repeat: 29, yoyo: true, ease: "sine.inOut", immediateRender: false }, S[7]);
    tous(".etiquette").forEach((e, i) => tl.fromTo(e, { opacity: 0, y: 30, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(2.4)", immediateRender: false }, T.puces[i]));

    // ════ 9. Devant l'immeuble : la voiture arrive, portière, 09:55 ════
    tl.fromTo("#encart-portiere", { opacity: 0, x: 500, rotation: 6 }, { opacity: 1, x: 0, rotation: 2, duration: 0.9, ease: "power3.out" }, S[8]);
    tl.fromTo("#encart-portiere img", { scale: 1 }, { scale: 1.08, duration: fin(8) - S[8], ease: "none" }, S[8]);
    cadran($("horloge2"), 9, 55);
    tl.fromTo("#badge-heure", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.4)" }, 32.45);

    // ════ 10. L'investisseuse se lève et sourit ════
    tl.fromTo("#inv-debout", { y: 120, scale: 0.96, xPercent: -50 }, { y: 0, scale: 1, xPercent: -50, duration: 0.9, ease: "power2.out" }, 37.6);
    tl.fromTo("#inv-debout", { rotation: 0 }, { rotation: 1.2, transformOrigin: "50% 100%", duration: 0.8, repeat: 3, yoyo: true, ease: "sine.inOut", immediateRender: false }, 38.0);

    // ════ 11. La leçon : avant barré au crayon, après coché en jaune ════
    tous("#col-avant .manuscrit").forEach((m, i) => {
      tl.fromTo(m, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, immediateRender: false }, S[10] + 0.1 + i * 0.12);
      tl.fromTo(m.querySelector(".barre"), { scaleX: 0, rotation: -4 }, { scaleX: 1, rotation: -4, duration: 0.3, ease: "power1.in", immediateRender: false }, T.barres[i]);
    });
    tous("#col-apres .manuscrit").forEach((m, i) => {
      tl.fromTo(m, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, immediateRender: false }, S[10] + 0.5 + i * 0.12);
      tl.fromTo(m.querySelector(".coche"), { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, T.coches[i]);
    });
    tl.fromTo(".fiche", { scale: 1 }, { scale: 1.05, duration: fin(10) - S[10], ease: "none" }, S[10]);

    // ════ 13. Outro : cercle moutarde tracé comme une signature, logo, bouton ════
    const LS = 2 * Math.PI * 200;
    $("cercle-jaune").setAttribute("stroke-dasharray", `${LS} ${LS}`);
    tl.fromTo("#cercle-jaune", { attr: { "stroke-dashoffset": LS } }, { attr: { "stroke-dashoffset": 0 }, duration: 1.1, ease: "power2.inOut" }, S[12]);
    tl.fromTo("#embleme", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" }, S[12] + 0.5);
    tl.fromTo("#marque", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, T.marque);
    tl.fromTo("#douala", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, T.douala);
    tl.fromTo("#bouton", { opacity: 0, y: 40, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2)" }, T.whatsapp);
    tl.fromTo("#bouton", { scale: 1 }, { scale: 1.04, duration: 0.6, repeat: 4, yoyo: true, ease: "sine.inOut", immediateRender: false }, T.whatsapp + 0.6);
    tl.fromTo(".signature, #embleme", { y: 0 }, { y: -10, duration: 2, repeat: 2, yoyo: true, ease: "sine.inOut", immediateRender: false }, S[12] + 1.2);

    tl.to({}, { duration: T.duree }, 0);
  };
})();
