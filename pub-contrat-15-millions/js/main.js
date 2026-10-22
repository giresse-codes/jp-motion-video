// « Le contrat de 15 millions » — JP PAPIER (116 s, 9:16). Voir frame.md.
// Six actes : hook (le chiffre se brise), l'enjeu, la chute (retard), le retournement, la seconde chance,
// la leçon. Relances (lumière + silence court + musique qui repart) aux débuts des actes 3, 4 et 5.
(function () {
  const J = window.JPPapier;
  const ENCRE = "#1A1A1A", MOUTARDE = "#F2C230";
  const $ = (id) => document.getElementById(id);
  const html = (id, contenu) => { $(id).innerHTML = contenu; return $(id); };
  const cadre = (src, position = "50% 50%", id = "") => `<div class="jp-cadre"><img ${id ? `id="${id}"` : ""} src="assets/images/${src}" style="object-position:${position}" /></div>`;

  window.CONSTRUIRE = function (tl) {
    const T = window.T, P = T.plans;
    const fin = (i) => P[i + 1] ?? T.duree;
    const L = (de, a, phrases, classe = "") => J.texteSurligne(tl, { de, a, phrases, classe });
    // Chiffre qui saute (horloge numérique, compteur…).
    const saute = (el, t) => tl.fromTo(el, { scale: 1 }, { keyframes: [{ scale: 1.15, duration: 0.1 }, { scale: 1, duration: 0.3, ease: "back.out(3)" }], immediateRender: false }, t);
    const texteA = (el, t, texte) => tl.call(() => { el.textContent = texte; }, null, t);

    // ── Contenus des plans ──
    html("p-chiffre", `<svg id="chiffre" class="chiffre" viewBox="0 0 1080 700"><defs>
        <clipPath id="m1"><path d="M0 0 H560 L500 330 L0 380Z"/></clipPath><clipPath id="m2"><path d="M560 0 H1080 V300 L700 360 L500 330Z"/></clipPath>
        <clipPath id="m3"><path d="M0 380 L500 330 L620 700 H0Z"/></clipPath><clipPath id="m4"><path d="M500 330 L700 360 L1080 300 V700 H620Z"/></clipPath></defs>
        ${[1, 2, 3, 4].map((k) => `<g class="morceau" clip-path="url(#m${k})"><text x="480" y="300" text-anchor="middle" font-family="Inter" font-weight="700" font-size="168" letter-spacing="-6" fill="${ENCRE}">15 000 000</text><text x="480" y="460" text-anchor="middle" font-family="Inter" font-weight="700" font-size="120" fill="#5B5246">FCFA</text></g>`).join("")}
        <g id="fissures" fill="none" stroke="${ENCRE}" stroke-width="7" stroke-linecap="round"><path d="M560 0 L530 160 L500 330 L560 520 L620 700"/><path d="M0 380 L240 350 L500 330 L700 360 L1080 300"/><path d="M530 160 L420 120"/><path d="M700 360 L790 470"/></g></svg>
      <div id="poussiere" class="couche"></div>`);
    html("p-ombre", `<img class="ombre-serge" id="ombre-serge" src="assets/images/serge-court.png" />`);
    html("p-dossier", `<div class="dossier"><div class="dos"></div><div class="feuille">Dossier investisseur<br>✓ Business plan<br>✓ Chiffres<br>✓ Projections<br><span style="color:#6b5d4a">Akwa · 10&nbsp;h</span></div><div class="couv" id="couv">DOSSIER</div></div>`);
    html("p-nuit", cadre("serge-nuit.jpg", "50% 62%", "img-nuit") + `<div class="calendrier" id="calendrier"><div class="mois" id="mois">JUIN</div><div class="jour" id="jour">1</div></div><div id="tasses" class="couche"></div>`);
    html("p-bureau", `<div class="jp-cadre"><img class="jp-fond-flou" src="assets/images/decor-bureau.jpg" style="object-position:60% 50%" /></div><img class="silhouette-ngo" src="assets/images/investisseuse-debout.png" /><div class="vitre"></div><div id="montre-zone" class="couche"></div>`);
    html("p-pont", cadre("decor-pont-wouri.jpg", "50% 78%", "img-pont") + `<div class="encart" id="encart-volant"><img src="assets/images/serge-volant.jpg" /><div id="gouttes" class="couche"></div></div><div class="heure-num" id="heure-pont">08:40</div>`);
    html("p-dessus", `<div class="jp-cadre" style="background:#EFE7D7"><svg id="dessus" viewBox="0 0 900 1140" width="900" height="1140"></svg></div><div class="heure-num" id="heure-dessus" style="left:90px;top:1500px">09:52</div><div class="tours" id="tours">1 tour</div>`);
    html("p-retard", cadre("serge-retard.jpg", "50% 40%", "img-retard"));
    html("p-montre", `<div class="jp-cadre"><img class="jp-fond-flou" src="assets/images/decor-bureau.jpg" style="object-position:70% 50%" /><img id="inv-montre" class="jp-decoupe" src="assets/images/investisseuse-montre.png" /></div>
      <div class="bulle-dialogue" id="bulle">Vous avez 5&nbsp;minutes.</div>
      <div class="chrono" id="chrono5" style="left:120px;top:1380px"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="84" fill="#FBF7EE" stroke="#E6DDCB" stroke-width="16"/><circle id="anneau5" cx="100" cy="100" r="84" fill="none" stroke="${MOUTARDE}" stroke-width="16" stroke-linecap="round" transform="rotate(-90 100 100)"/></svg><b id="reste5">5:00</b></div>`);
    html("p-pitch", cadre("serge-pitch-rate.jpg", "50% 45%", "img-pitch"));
    html("p-email", cadre("serge-email.jpg", "50% 55%", "img-email") + `<div class="notif-email" id="notif-email"><i>@</i><div><b>Madame Ngo · e-mail</b><span>Nous ne donnerons pas suite.</span></div></div>`);
    html("p-versions", ["v2", "v3", "v4"].map((v, k) => `<div class="page" id="page${k}" style="transform:rotate(${(k - 1) * 3}deg)"><div class="version">${v}</div>Résumé du projet<br>Marché · cibles<br>Chiffres 2027<br>Besoin : 15 M<br>
      <i class="rature" style="top:140px"></i><i class="rature" style="top:215px"></i><i class="rature" style="top:290px"></i></div>`).join(""));
    html("p-patrick", cadre("ami-patrick.jpg", "50% 40%", "img-patrick"));
    html("p-message", "");
    html("p-voiture", cadre("serge-voiture.jpg", "50% 50%", "img-voiture") + `<div class="etiquettes"><span class="etiquette">Clim</span><span class="etiquette">Wi-Fi</span><span class="etiquette">Calme</span></div>`);
    html("p-portiere", cadre("decor-immeuble.jpg", "30% 60%", "img-immeuble") + `<div class="encart grand" id="encart-portiere"><img src="assets/images/serge-portiere.jpg" /></div>`);
    html("p-fenetre", cadre("ngo-fenetre.jpg", "65% 30%", "img-fenetre"));
    html("p-chrono", `<div class="grand-chrono"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="84" fill="#FBF7EE" stroke="#E6DDCB" stroke-width="12"/><circle id="anneau-grand" cx="100" cy="100" r="84" fill="none" stroke="${MOUTARDE}" stroke-width="12" stroke-linecap="round" transform="rotate(-90 100 100)"/></svg><div class="valeur" id="valeur">5 min</div><i class="barre-5" id="barre-5"></i></div>`);
    html("p-signature", cadre("serge-signature.jpg", "50% 60%", "img-signature") + `<div id="confettis" class="couche"></div>`);
    html("p-fiche", `<div class="fiche"><div class="colonne" id="col-avant"><div class="col-titre">Avant</div>${["10:12", "5 min", "refusé"].map((m) => `<div class="manuscrit">${m}<i class="barre-crayon"></i></div>`).join("")}</div>
      <div class="colonne" id="col-apres"><div class="col-titre">Six mois après</div>${["09:50", "1 h", "signé"].map((m) => `<div class="manuscrit">${m}<i class="coche">✓</i></div>`).join("")}</div></div>`);
    html("p-question", `<div id="interro" class="interro">?</div>`);

    // ── Plans en fondu enchaîné, relances de lumière ──
    const plans = Array.from(document.querySelectorAll(".plan"));
    plans.forEach((p, i) => J.fondu(tl, p, P[i], fin(i), { premier: i === 0 }));
    tl.fromTo("#teinte-froide", { opacity: 0 }, { opacity: 1, duration: 0.6, immediateRender: false }, T.relances[0]);
    tl.to("#teinte-froide", { opacity: 0, duration: 0.8 }, T.relances[1]);
    tl.fromTo("#teinte-doree", { opacity: 0 }, { opacity: 1, duration: 1.2, immediateRender: false }, T.relances[2]);
    T.relances.forEach((t) => tl.fromTo("#camera", { scale: 1.04 }, { scale: 1, duration: 0.8, ease: "power2.out", immediateRender: false }, t));
    // Fond brun : l'ombre du hook, la nuit de l'e-mail, l'intérieur de voiture.
    [[1, 2], [10, 11], [15, 16]].forEach(([a, b]) => { tl.to("#brun", { opacity: 1, duration: 0.6 }, P[a] - 0.3); tl.to("#brun", { opacity: 0, duration: 0.6 }, P[b] - 0.3); });
    // Rideau sombre après le refus.
    tl.to("#rideau", { opacity: 1, duration: 0.5, ease: "power2.in" }, 51.75);
    tl.to("#rideau", { opacity: 0, duration: 0.5 }, P[11]);

    // ════ ACTE 1 — HOOK ════
    const fissures = Array.from(document.querySelectorAll("#fissures path"));
    fissures.forEach((f, k) => {
      const l = f.getTotalLength(); f.setAttribute("stroke-dasharray", `${l} ${l}`);
      const part = k === 0 ? 0.25 : 1; // une première fissure est déjà là à l'image 1
      tl.fromTo(f, { attr: { "stroke-dashoffset": l * (1 - (k === 0 ? 0.25 : 0)) } }, { attr: { "stroke-dashoffset": 0 }, duration: 1.4, ease: "power1.in", immediateRender: true }, 0.2 + k * 0.6);
      void part;
    });
    tl.fromTo("#chiffre", { scale: 1 }, { scale: 1.05, duration: P[1], ease: "none", immediateRender: true }, 0);
    const morceaux = Array.from(document.querySelectorAll(".morceau"));
    morceaux.forEach((m, k) => tl.to(m, { y: 900 + k * 80, x: (k % 2 ? 1 : -1) * 120, rotation: (k % 2 ? 1 : -1) * 18, svgOrigin: "540 350", opacity: 0, duration: 1.6, ease: "power2.in" }, P[1] + k * 0.08));
    tl.to("#fissures", { opacity: 0, duration: 0.3 }, P[1]);
    const poussiere = $("poussiere");
    for (let k = 0; k < 40; k++) {
      const d = document.createElement("div"); d.className = "poussiere";
      Object.assign(d.style, { left: 200 + ((k * 137) % 680) + "px", top: 800 + ((k * 61) % 300) + "px" }); poussiere.appendChild(d);
      tl.fromTo(d, { opacity: 0, y: 0, x: 0 }, { keyframes: [{ opacity: 0.8, duration: 0.2 }, { y: 300 + (k % 5) * 80, x: ((k % 7) - 3) * 40, opacity: 0, duration: 1.6, ease: "power1.in" }], immediateRender: false }, P[1] + (k % 8) * 0.05);
    }
    L(0, P[1], [[0, 0, "Ce contrat valait"], [1.2, 2.69, "*15 millions de francs."]]);
    // Serge de dos dans l'ombre.
    tl.fromTo("#ombre-serge", { opacity: 0, x: 60 }, { opacity: 0.85, x: 0, duration: 1.2, ease: "power2.out", immediateRender: false }, P[1] + 0.5);
    J.zoomLent(tl, "#ombre-serge", P[1], fin(1), { depart: 1, arrivee: 1.06, origine: "50% 80%" });
    L(P[1], P[2], [[3.54, 4.39, "Serge l'a perdu"], [5.2, 6.66, "avant même d'ouvrir la *bouche."]], "clair");
    // Le dossier qu'on ferme.
    tl.fromTo("#couv", { rotationY: -165 }, { rotationY: 0, duration: 0.9, ease: "power2.inOut", immediateRender: true }, 7.7);
    tl.fromTo("#p-dossier .dossier", { scale: 1 }, { scale: 1.06, duration: fin(2) - P[2] + 0.3, ease: "none", immediateRender: false }, P[2] - 0.3);
    L(P[2], P[3], [[7.58, 8.02, "Et le pire,"], [8.76, 10.05, "ce n'était pas à cause du *dossier."]]);

    // ════ ACTE 2 — L'ENJEU ════
    J.zoomLent(tl, "#img-nuit", P[3], fin(3), { depart: 1.02, arrivee: 1.14, origine: "50% 45%" });
    const moisL = ["JUIN", "JUIL.", "AOÛT"];
    for (let k = 0; k < 18; k++) {
      const t = P[3] + 0.3 + k * 0.25;
      texteA($("mois"), t, moisL[Math.floor(k / 6)]);
      texteA($("jour"), t, String(1 + ((k * 5) % 30)));
      tl.fromTo("#calendrier", { rotationX: 0 }, { keyframes: [{ rotationX: -25, duration: 0.08 }, { rotationX: 0, duration: 0.12 }], immediateRender: false }, t);
    }
    const tasses = $("tasses");
    [12.0, 12.8, 13.4, 14.2, 14.9].forEach((t, k) => {
      const s = J.svg(tasses, "svg", { class: "tasse", viewBox: "0 0 90 90" }); s.style.left = 110 + k * 110 + "px";
      J.svg(s, "path", { d: "M12 30 H66 V64 Q66 80 50 80 H28 Q12 80 12 64Z", fill: "#7E9C86" });
      J.svg(s, "path", { d: "M66 40 Q84 40 84 52 Q84 64 66 62", stroke: "#7E9C86", "stroke-width": 7, fill: "none" });
      J.svg(s, "ellipse", { cx: 39, cy: 32, rx: 25, ry: 6, fill: "#3b2a1e" });
      tl.fromTo(s, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(2.4)", immediateRender: false }, t);
    });
    L(P[3], P[4], [[11.32, 12.47, "Trois mois de travail."], [13.18, 14.01, "Des nuits blanches."], [14.81, 15.83, "Un dossier *parfait."]]);
    // Bureau, Madame Ngo floue derrière la vitre, montre jusqu'à 10:00.
    J.montre(tl, { parent: "#montre-zone", x: 80, y: 1000, taille: 560, de: P[4], a: fin(4), depart: [9, 52], arrivee: [10, 0] });
    tl.fromTo(".silhouette-ngo", { x: 0 }, { x: -30, duration: fin(4) - P[4], ease: "sine.inOut", immediateRender: false }, P[4]);
    L(P[4], P[5], [[17.01, 18.67, "Rendez-vous à 10 h à Akwa,"], [19.02, 19.74, "avec Madame Ngo."], [20.39, 21.78, "Celle qui peut tout *changer."]]);

    // ════ ACTE 3 — LA CHUTE ════
    J.zoomLent(tl, "#img-pont", P[5], fin(5), { depart: 1.02, arrivee: 1.1, origine: "50% 70%" });
    tl.fromTo("#encart-volant", { opacity: 0, y: 120 }, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.5)", immediateRender: false }, 24.1);
    const gouttes = $("gouttes");
    [[150, 60], [262, 70], [200, 40]].forEach(([x, y], k) => {
      const g = document.createElement("div"); g.className = "goutte"; Object.assign(g.style, { left: x + "px", top: y + "px" }); gouttes.appendChild(g);
      tl.fromTo(g, { y: 0, opacity: 0 }, { keyframes: [{ opacity: 1, duration: 0.1 }, { y: 70, duration: 0.9, ease: "power1.in" }, { opacity: 0, duration: 0.15 }], repeat: 3, immediateRender: false }, 26.5 + k * 0.4);
    });
    texteA($("heure-pont"), 28.71, "09:30");
    saute("#heure-pont", 28.71);
    L(P[5], 26.0, [[22.74, 23.45, "8 h 40."], [24.13, 25.15, "Serge prend sa voiture."]]);
    L(26.0, P[6], [[26.11, 26.72, "Pont du Wouri&nbsp;:"], [27.35, 27.77, "*bouché."], [28.71, 29.27, "9 h 30."]]);
    // Vue de dessus : il tourne autour du pâté de maisons.
    const dessus = $("dessus");
    J.svg(dessus, "rect", { width: 900, height: 1140, fill: "#E3D8C3" });
    const RX = [-60, 330, 720, 1110], RY = [100, 500, 900, 1300];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) J.svg(dessus, "rect", { x: RX[i] + 65, y: RY[j] + 65, width: RX[i + 1] - RX[i] - 130, height: RY[j + 1] - RY[j] - 130, rx: 26, fill: "#CDBEA2" });
    const GRIS = ["#8C8173", "#A39684", "#6E655A", "#B5A894"]; let g = 0;
    RX.forEach((x) => { for (let y = 30; y < 1140; y += 74) { if (RY.some((r) => Math.abs(r - y) < 90)) continue; [-1, 1].forEach((s) => J.svg(dessus, "rect", { x: x + s * 44 - 17, y: y - 30, width: 34, height: 60, rx: 9, fill: GRIS[g++ % 4] })); } });
    const boucle = "M390 500 H660 Q720 500 720 560 V840 Q720 900 660 900 H390 Q330 900 330 840 V560 Q330 500 390 500Z";
    const trace = J.svg(dessus, "path", { d: boucle, fill: "none", stroke: MOUTARDE, "stroke-width": 12, opacity: 0.85 });
    const chemin = J.svg(dessus, "path", { d: boucle, fill: "none", stroke: "none" });
    const auto = J.svg(dessus, "g", {});
    J.svg(auto, "rect", { x: -38, y: -20, width: 76, height: 40, rx: 12, fill: "#22304F" });
    J.svg(auto, "rect", { x: 8, y: -14, width: 16, height: 28, rx: 5, fill: "rgba(255,255,255,.55)" });
    const LB = chemin.getTotalLength(); trace.setAttribute("stroke-dasharray", `${LB * 3} ${LB * 3}`);
    const tour = { p: 0 };
    const majTour = () => { const s = (tour.p * LB) % LB, a = chemin.getPointAtLength(s), b = chemin.getPointAtLength((s + 5) % LB);
      auto.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${(Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI})`); trace.setAttribute("stroke-dashoffset", `${LB * 3 - Math.min(tour.p, 3) * LB}`); };
    majTour();
    tl.fromTo(tour, { p: 0 }, { p: 3, duration: 38.1 - 34.4, ease: "none", onUpdate: majTour, immediateRender: false }, 34.4);
    [[35.37, "1 tour"], [36.41, "2 tours"], [37.64, "3 tours"]].forEach(([t, txt]) => { texteA($("tours"), t, txt); saute("#tours", t); });
    tl.fromTo("#tours", { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: true }, 35.3);
    saute("#heure-dessus", 31.72);
    L(P[6], P[7], [[31.72, 32.52, "9 h 52."], [33.22, 34.68, "Il tourne pour trouver une *place."], [35.37, 38.09, "Une fois. Deux fois. Trois fois."]]);
    // 10:12 : zoom brusque, demi-seconde de silence.
    J.horloge(tl, { parent: "#p-retard", x: 720, y: 560, taille: 210, heure: [10, 12], de: 38.93 });
    tl.fromTo("#img-retard", { scale: 1.02 }, { scale: 1.25, transformOrigin: "55% 30%", duration: 0.25, ease: "power3.out", immediateRender: false }, 38.93);
    tl.to("#img-retard", { scale: 1.34, duration: fin(7) - 39.2, ease: "none" }, 39.2);
    L(P[7], P[8], [[38.93, 39.7, "*10 h 12."], [40.47, 40.9, "Il entre."], [41.49, 43.75, "Chemise trempée. Souffle court."]]);
    // Madame Ngo, 5 minutes.
    tl.fromTo("#inv-montre", { scale: 1, xPercent: -50 }, { scale: 1.25, xPercent: -50, transformOrigin: "62% 40%", duration: fin(8) - P[8], ease: "power1.inOut", immediateRender: false }, P[8]);
    tl.fromTo("#bulle", { opacity: 0, scale: 0.5, rotation: -6 }, { opacity: 1, scale: 1, rotation: -2, duration: 0.4, ease: "back.out(2.4)", immediateRender: true }, 46.46);
    const LC = 2 * Math.PI * 84, an5 = $("anneau5"); an5.setAttribute("stroke-dasharray", `${LC} ${LC}`);
    const reste = { v: 300 };
    const maj5 = () => { an5.setAttribute("stroke-dashoffset", `${LC * (1 - reste.v / 300)}`); $("reste5").textContent = `${Math.floor(reste.v / 60)}:${String(Math.floor(reste.v % 60)).padStart(2, "0")}`; };
    maj5();
    tl.fromTo("#chrono5", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.4)", immediateRender: true }, 46.6);
    tl.fromTo(reste, { v: 300 }, { v: 0, duration: 48.3 - 46.9, ease: "power1.in", onUpdate: maj5, immediateRender: false }, 46.9);
    L(P[8], P[10], [[44.47, 45.75, "Madame Ngo regarde sa *montre."]]);
    J.zoomLent(tl, "#img-pitch", P[9], fin(9), { depart: 1.05, arrivee: 1.18, origine: "50% 35%" });
    // L'e-mail de refus.
    J.zoomLent(tl, "#img-email", P[10], fin(10), { depart: 1.02, arrivee: 1.14, origine: "50% 50%" });
    tl.fromTo("#notif-email", { opacity: 0, y: -160 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)", immediateRender: true }, 50.5);
    L(P[10], P[11], [[48.37, 49.07, "Trois jours plus tard,"], [49.52, 49.95, "un e-mail&nbsp;:"], [50.55, 51.72, "«&nbsp;Nous ne donnerons pas *suite.&nbsp;»"]], "clair");

    // ════ ACTE 4 — LE RETOURNEMENT ════
    [0, 1, 2].forEach((k) => {
      const t = 53.3 + k * 1.3;
      tl.fromTo(`#page${k}`, { opacity: 0, y: 200, rotation: (k - 1) * 3 + 6 }, { opacity: 1, y: k * -20, rotation: (k - 1) * 3, duration: 0.5, ease: "back.out(1.6)", immediateRender: true }, t);
      document.querySelectorAll(`#page${k} .rature`).forEach((r, j) => tl.fromTo(r, { scaleX: 0, rotation: -2 }, { scaleX: 1, rotation: -2, duration: 0.2, ease: "power1.in", immediateRender: false }, t + 0.5 + j * 0.2));
    });
    L(P[11], P[12], [[52.5, 54.56, "Serge a cru que le problème, c'était son dossier."], [55.29, 57.06, "Il l'a refait *trois fois."]]);
    J.zoomLent(tl, "#img-patrick", P[12], fin(12), { depart: 1.02, arrivee: 1.2, origine: "50% 35%" });
    L(P[12], 61.6, [[57.86, 59.73, "Jusqu'au jour où un ami lui a dit une phrase"], [60.49, 61.08, "qui a tout changé."]]);
    L(61.6, P[13], [[61.93, 63.18, "«&nbsp;Ton dossier est bon, Serge."], [63.91, 65.21, "C'est ton *arrivée qui est mauvaise.&nbsp;»"]], "centre clair");
    tl.to("#img-patrick", { filter: "blur(8px) brightness(.55)", duration: 0.6 }, 61.6);

    // ════ ACTE 5 — LA SECONDE CHANCE (lumière dorée) ════
    L(P[13], P[14], [[66.0, 66.71, "*Six mois plus tard."], [67.36, 68.24, "Une seconde chance."], [68.94, 71.08, "Même bureau. Même Madame Ngo."]], "seul");
    J.conversation(tl, { parent: "#p-message", x: 255, y: 520, largeur: 570, de: P[14], contact: "JP Service",
      messages: [{ t: 74.9, texte: "Un chauffeur demain 8&nbsp;h pour Akwa&nbsp;?", moi: true }, { t: 76.3, texte: "Confirmé ✓<br><small>Service Confort · 4&nbsp;000 FCFA/h</small>", moi: false }], ecrit: [[75.5, 76.3]] });
    L(P[14], 74.2, [[71.87, 73.47, "Mais cette fois, Serge ne *conduit pas."]]);
    L(74.2, P[15], [[74.46, 75.88, "La veille, un seul message."], [76.68, 79.05, "Le matin, son chauffeur l'*attend devant la porte."]]);
    J.zoomLent(tl, "#img-voiture", P[15], fin(15), { depart: 1.02, arrivee: 1.1, origine: "45% 35%" });
    J.horloge(tl, { parent: "#p-voiture", x: 720, y: 560, taille: 200, heure: [9, 20], de: 80.3 });
    document.querySelectorAll("#p-voiture .etiquette").forEach((e, k) => tl.fromTo(e, { opacity: 0, y: 30, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(2.4)", immediateRender: true }, [81.12, 82.17, 84.76][k]));
    L(P[15], P[16], [[80.09, 82.68, "Dans la voiture&nbsp;: la clim, le Wi-Fi."], [83.43, 85.17, "Il relit ses chiffres *calmement."]], "clair");
    tl.fromTo("#encart-portiere", { opacity: 0, x: 500 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", immediateRender: true }, P[16]);
    J.horloge(tl, { parent: "#p-portiere", x: 720, y: 560, taille: 210, heure: [9, 50], de: 86.43, fond: "#CDE6C7" });
    L(P[16], P[17], [[86.43, 87.17, "*9 h 50."], [87.67, 88.4, "La portière s'ouvre."]]);
    // Contrechamp : rack focus de la vitre vers son visage.
    tl.fromTo("#img-fenetre", { filter: "blur(10px)", scale: 1.0 }, { filter: "blur(0px)", scale: 1.22, transformOrigin: "62% 30%", duration: 2.6, ease: "power2.inOut", immediateRender: false }, P[17]);
    L(P[17], P[18], [[89.49, 90.97, "Là-haut, derrière la fenêtre,"], [91.66, 93.45, "Madame Ngo le regarde *arriver."]]);
    // 5 min barré -> 1 h, puis la signature.
    const ang = $("anneau-grand"); ang.setAttribute("stroke-dasharray", `${LC} ${LC}`); ang.setAttribute("stroke-dashoffset", LC * 0.92);
    tl.fromTo("#barre-5", { scaleX: 0, rotation: -8 }, { scaleX: 1, rotation: -8, duration: 0.35, ease: "power1.in", immediateRender: false }, 95.8);
    tl.to("#barre-5", { opacity: 0, duration: 0.2 }, 97.4);
    texteA($("valeur"), 97.55, "1 h");
    saute("#valeur", 97.55);
    tl.fromTo(ang, { attr: { "stroke-dashoffset": LC * 0.92 } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.8, ease: "power2.out", immediateRender: false }, 97.55);
    L(P[18], P[19], [[94.42, 96.73, "Ce jour-là, elle ne lui a pas donné cinq minutes."], [97.55, 98.54, "Elle lui a donné une *heure."]]);
    J.zoomLent(tl, "#img-signature", P[19], fin(19), { depart: 1.02, arrivee: 1.12, origine: "45% 75%" });
    const conf = $("confettis");
    for (let k = 0; k < 24; k++) {
      const c = document.createElement("div"); c.className = "confetti"; Object.assign(c.style, { left: "420px", top: "1330px" }); conf.appendChild(c);
      const a = (k / 24) * Math.PI * 2;
      tl.fromTo(c, { x: 0, y: 0, opacity: 0, rotation: 0 }, { keyframes: [{ opacity: 1, duration: 0.05 }, { x: Math.cos(a) * 220, y: Math.sin(a) * 160 - 120, rotation: 360, duration: 0.7, ease: "power2.out" }, { y: "+=160", opacity: 0, duration: 0.6, ease: "power1.in" }], immediateRender: false }, 99.5);
    }
    L(P[19], P[20], [[99.43, 100.0, "Et la *signature."]]);

    // ════ ACTE 6 — LA LEÇON ════
    document.querySelectorAll("#col-avant .manuscrit").forEach((m, i) => {
      tl.fromTo(m, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, immediateRender: false }, P[20] + 0.1 + i * 0.12);
      tl.fromTo(m.querySelector(".barre-crayon"), { scaleX: 0, rotation: -4 }, { scaleX: 1, rotation: -4, duration: 0.3, ease: "power1.in", immediateRender: false }, 101.6 + i * 0.25);
    });
    document.querySelectorAll("#col-apres .manuscrit").forEach((m, i) => {
      tl.fromTo(m, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, immediateRender: false }, P[20] + 0.5 + i * 0.12);
      tl.fromTo(m.querySelector(".coche"), { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, 102.6 + i * 0.25);
    });
    L(P[20], P[21], [[101.31, 101.88, "Le même homme."], [102.48, 103.13, "Le même dossier."], [104.09, 105.58, "*15 millions de différence."]]);
    L(P[21], P[22], [[106.93, 108.6, "Parce qu'un rendez-vous ne commence pas dans le bureau."], [109.39, 110.38, "Il commence dans la *voiture."]], "centre");
    L(P[22], P[23], [[111.53, 111.9, "Et toi,"], [112.42, 113.84, "combien t'a déjà coûté un *retard"]], "centre");
    tl.fromTo("#interro", { opacity: 0, y: -500 }, { opacity: 1, y: 0, duration: 0.6, ease: "bounce.out", immediateRender: false }, 112.6);
    tl.fromTo("#interro", { y: 0 }, { y: -40, duration: 0.3, repeat: 1, yoyo: true, ease: "power2.out", immediateRender: false }, 113.4);

    // ════ Outro, puis retour à l'image 1 ════
    const outro = J.outroJP(tl, { parent: "#camera", de: P[23] });
    tl.to(outro, { opacity: 0, duration: 0.35, ease: "power2.in" }, T.retour);
    tl.to("#teinte-doree", { opacity: 0, duration: 0.35 }, T.retour);
    tl.fromTo("#p-chiffre", { opacity: 0 }, { opacity: 1, x: 0, duration: 0.35, immediateRender: false }, T.retour);
    morceaux.forEach((m) => tl.set(m, { x: 0, y: 0, rotation: 0, opacity: 1 }, T.retour));
    tl.set("#fissures", { opacity: 1 }, T.retour);
    fissures.forEach((f, k) => { const l = f.getTotalLength(); tl.set(f, { attr: { "stroke-dashoffset": k === 0 ? l * 0.75 : l } }, T.retour); });
    tl.set("#chiffre", { scale: 1 }, T.retour);
    L(T.retour, null, [[T.retour + 0.02, T.retour + 0.06, "Ce contrat valait"]]);

    tl.to({}, { duration: T.duree }, 0);
  };
})();
