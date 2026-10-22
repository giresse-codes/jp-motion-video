// « Promo JP Service » — style JP PREMIUM (35 s, 9:16). Voir frame.md.
// Hook STOP (ÉNERGIE), tampon GRANDE PROMOTION, carte PACK ÉCO + calculatrice, rétention (5 h = même prix),
// révélation (5e heure offerte), bascule LUXE : PACK CONFORT + voiture, récap en éventail, outro, retour au STOP.
// Prix exacts : Éco 2 500 FCFA/h (4 h = 10 000), 2 000 FCFA/h dès 5 h ; Confort 3 500 FCFA/h (4 h = 14 000), 3 000 dès 5 h.
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const $ = (id) => document.getElementById(id);
  const tous = (sel) => Array.from(document.querySelectorAll(sel));
  const svg = (parent, nom, attrs) => { const el = document.createElementNS(NS, nom); Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); parent.appendChild(el); return el; };

  // Mots répartis dans chaque phrase au prorata de leur longueur (horodatage des phrases : transcription).
  function repartir(debut, fin, texte) {
    const mots = texte.split(" ").filter(Boolean);
    const poids = mots.map((m) => Math.max(m.replace(/[^\p{L}\d]/gu, "").length, 3) + 2);
    const total = poids.reduce((a, b) => a + b, 0);
    let t = debut;
    return mots.map((m, i) => { const d = t; t += ((fin - debut) * poids[i]) / total; return { texte: m.replace("*", ""), t: d, cle: m.includes("*") }; });
  }

  window.CONSTRUIRE = function (tl) {
    const T = window.T, P = T.plans;
    const fin = (i) => P[i + 1] ?? T.duree;

    // Bloc de texte : les mots arrivent en rotation et en échelle (Poppins), le mot clé en rouge (ou or en LUXE).
    const texte = (de, a, phrases, classe = "") => {
      const bloc = document.createElement("div"); bloc.className = "bloc " + classe; $("textes").appendChild(bloc);
      if (de <= 0) gsap.set(bloc, { opacity: 1 }); else tl.fromTo(bloc, { opacity: 0 }, { opacity: 1, duration: 0.01, immediateRender: false }, de);
      if (a != null) tl.to(bloc, { opacity: 0, scale: 0.9, duration: 0.25, ease: "power2.in" }, a - 0.25);
      phrases.forEach(([d, f, txt]) => {
        const ligne = document.createElement("div"); ligne.className = "phrase"; bloc.appendChild(ligne);
        repartir(d, f, txt).forEach((w, i) => {
          const s = document.createElement("span"); s.className = "mot" + (w.cle ? " cle" : ""); s.innerHTML = w.texte; ligne.appendChild(s);
          if (d === f) gsap.set(s, { opacity: 1 });
          else tl.fromTo(s, { opacity: 0, scale: 1.7, rotation: i % 2 ? 10 : -10 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.28, ease: "back.out(2.2)", immediateRender: false }, w.t);
        });
      });
      return bloc;
    };
    const claque = (el, t, f = 1.25) => tl.fromTo(el, { scale: 1 }, { keyframes: [{ scale: f, duration: 0.09 }, { scale: 1, duration: 0.3, ease: "back.out(3)" }], immediateRender: false }, t);
    const secousse = (t, a = 14) => tl.fromTo("#camera", { x: 0, y: 0 }, { keyframes: [{ x: -a, y: a * 0.6, duration: 0.04 }, { x: a * 0.8, y: -a * 0.5, duration: 0.05 }, { x: 0, y: 0, duration: 0.08 }], immediateRender: false }, t);
    const changer = (el, t, html) => tl.call(() => { el.innerHTML = html; }, null, t);

    // ── Plans (coupes vives mais jamais brutes : fondus courts + mouvements) ──
    tous(".plan").forEach((p, i) => {
      if (i === 0) gsap.set(p, { opacity: 1 });
      else tl.fromTo(p, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out", immediateRender: false }, P[i] - 0.1);
      if (i < P.length - 1) tl.to(p, { opacity: 0, scale: 0.94, duration: 0.3, ease: "power2.in" }, fin(i) - 0.2);
    });
    // ── Ambiances : ÉNERGIE (0-23 s), LUXE (23-31 s), ÉNERGIE pour le récap, LUXE pour l'outro ──
    tl.fromTo("#cercles", { scale: 1 }, { scale: 1.12, duration: 0.47, repeat: 48, yoyo: true, ease: "sine.inOut", immediateRender: true }, 0);
    tl.fromTo("#rayons", { rotation: 0 }, { rotation: 60, duration: T.duree, ease: "none", immediateRender: true }, 0);
    [[0, "JP"], [3.0, "PROMO"], [8.0, "ÉCO"], [13.4, "5 H"], [18.7, "OFFERT"], [31.0, "JP"]].forEach(([t, mot]) => {
      changer($("mot-geant"), t, mot);
      tl.fromTo("#mot-geant", { xPercent: 8 }, { xPercent: -8, duration: 5, ease: "none", immediateRender: t === 0 }, t);
    });
    tl.to("#luxe", { opacity: 1, duration: 0.5 }, P[5] - 0.25);
    tl.to("#luxe", { opacity: 0, duration: 0.4 }, P[6] - 0.2);
    tl.to("#luxe", { opacity: 1, duration: 0.4 }, P[7] - 0.2);
    tl.to("#luxe", { opacity: 0, duration: 0.3 }, T.retour);
    tl.fromTo("#projecteur", { opacity: 0.6, scaleX: 0.8 }, { opacity: 1, scaleX: 1, duration: 1.2, ease: "power2.out", immediateRender: false }, P[5]);
    // Caméra : léger zoom continu (perspective) sur toute la vidéo.
    tl.fromTo("#camera", { scale: 1 }, { scale: 1.04, duration: T.duree, ease: "none", immediateRender: true }, 0);

    // ════ 1. HOOK : la main va appuyer sur « Réserver », un panneau STOP tombe ════
    const main = $("main");
    svg(main, "rect", { x: -70, y: 120, width: 140, height: 160, rx: 20, fill: "#0B1B4D" });
    svg(main, "rect", { x: -66, y: 110, width: 132, height: 24, rx: 10, fill: "#FFF4DE" });
    svg(main, "rect", { x: -62, y: 0, width: 124, height: 120, rx: 46, fill: "#7A4A30" });
    svg(main, "rect", { x: -18, y: -150, width: 36, height: 170, rx: 18, fill: "#7A4A30" }); // index tendu
    [-50, 26, 52].forEach((x) => svg(main, "rect", { x: x - 14, y: -10, width: 28, height: 60, rx: 14, fill: "#6A3E28" }));
    tl.fromTo("#main", { x: 120, y: 160, rotation: -18 }, { x: 0, y: 0, rotation: -18, duration: 0.5, ease: "power2.out", immediateRender: true }, 0);
    tl.fromTo("#stop", { y: -900, rotation: -14 }, { y: 0, rotation: 0, duration: 0.32, ease: "power3.in", immediateRender: true }, T.stop);
    tl.fromTo("#stop", { scaleY: 1 }, { keyframes: [{ scaleY: 0.86, scaleX: 1.08, duration: 0.07 }, { scaleY: 1, scaleX: 1, duration: 0.3, ease: "back.out(3)" }], immediateRender: false }, T.stop + 0.32);
    secousse(T.stop + 0.32, 18);
    tl.to("#main", { x: 160, y: 120, duration: 0.3, ease: "power2.out" }, T.stop + 0.35); // la main recule
    tl.fromTo("#stop", { rotation: 0 }, { rotation: 3, duration: 0.6, repeat: 3, yoyo: true, ease: "sine.inOut", immediateRender: false }, 0.9);
    texte(0, 0.72, [[0, 0, "ATTENDS&nbsp;!"]], "geant");
    texte(0.72, P[1], [[0.72, 2.73, "Ne réserve pas ton chauffeur avant d'avoir vu *ça."]]);

    // ════ 2. Flash blanc, tampon GRANDE PROMOTION + onde de choc ════
    tl.fromTo("#flash", { opacity: 0 }, { keyframes: [{ opacity: 1, duration: 0.06 }, { opacity: 0, duration: 0.3 }], immediateRender: false }, T.flash - 0.05);
    tl.fromTo("#tampon", { scale: 3, rotation: -60, opacity: 0 }, { scale: 1, rotation: -12, opacity: 1, duration: 0.3, ease: "power4.in", immediateRender: false }, T.tampon);
    secousse(T.tampon + 0.3, 20);
    tl.fromTo("#onde", { scale: 0, opacity: 0.9 }, { scale: 40, opacity: 0, duration: 0.8, ease: "power2.out", immediateRender: false }, T.tampon + 0.3);
    tl.fromTo("#tampon", { scale: 1 }, { scale: 1.04, duration: 0.47, repeat: 9, yoyo: true, ease: "sine.inOut", immediateRender: false }, T.tampon + 0.7);
    texte(P[1], 6.0, [[3.02, 5.67, "Chez JP Service, c'est la grande *promo."]]);
    texte(6.0, P[2], [[6.07, 7.64, "Plus tu roules, moins tu *paies."]]);

    // ════ 3. Carte PACK ÉCO : 3 000 barré, 2 500 tombe ; calculatrice 4 h × 2 500 = 10 000 ════
    tl.fromTo("#carte-eco", { rotationY: -100, rotationX: 20, z: -400, opacity: 0 }, { rotationY: 0, rotationX: 0, z: 0, opacity: 1, duration: 0.8, ease: "back.out(1.4)", immediateRender: true }, T.carte1);
    tl.fromTo("#carte-eco", { rotationY: 0 }, { rotationY: 8, rotationX: -4, duration: 1.4, repeat: 2, yoyo: true, ease: "sine.inOut", immediateRender: false }, T.carte1 + 0.8);
    tl.fromTo("#carte-eco .reflet", { x: 0 }, { x: 1400, duration: 1.0, repeat: 2, repeatDelay: 0.8, ease: "power2.inOut", immediateRender: false }, T.carte1 + 0.5);
    tl.fromTo("#neuf-eco", { opacity: 0 }, { opacity: 0, duration: 0.01, immediateRender: true }, 0);
    tl.fromTo("#barre-eco", { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power2.in", immediateRender: true }, T.barre1);
    tl.fromTo("#neuf-eco", { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "bounce.out", immediateRender: false }, T.prix1);
    tl.fromTo("#calc", { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(2)", immediateRender: true }, T.calc);
    texte(P[2], 9.15, [[8.11, 8.91, "*Pack Éco&nbsp;:"]]);
    texte(9.15, P[3], [[9.21, 13.04, "4 heures à 2&nbsp;500 francs l'heure au lieu de 3&nbsp;000, soit *10&nbsp;000 francs."]]);

    // ════ 4. Rétention : zoom sur la calculatrice, 5 h × 2 000 = … 10 000 ════
    const calc2 = $("calc2");
    tl.fromTo(calc2, { opacity: 1, y: 0, scale: 1 }, { y: -560, scale: 1.22, duration: 0.8, ease: "power3.inOut", immediateRender: false }, P[3]);
    changer($("c-h2"), T.h5, "5&nbsp;h"); claque("#c-h2", T.h5, 1.4);
    changer($("c-p2"), T.p2000, "2&nbsp;000"); claque("#c-p2", T.p2000, 1.4);
    const compteur = { v: 0 };
    tl.fromTo(compteur, { v: 0 }, { v: 10000, duration: T.compteur[1] - T.compteur[0], ease: "power2.out", immediateRender: false,
      onUpdate: () => { $("c-r2").innerHTML = String(Math.round(compteur.v / 100) * 100).replace(/\B(?=(\d{3})+(?!\d))/g, "&nbsp;"); } }, T.compteur[0]);
    claque("#c-r2", T.compteur[1], 1.5);
    texte(P[3], 14.75, [[13.5, 14.43, "Maintenant, regarde *bien."]]);
    texte(14.75, P[4], [[14.82, 15.81, "À partir de *5&nbsp;heures,"], [16.15, 18.28, "2&nbsp;000 francs l'heure. Cinq heures&nbsp;?"]]);

    // ════ 5. Révélation : 4 h = 10 000 = 5 h ; la 5e heure s'ouvre comme un cadeau ════
    tl.fromTo(".resultat", { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.12, ease: "back.out(2)", immediateRender: false }, P[4]);
    tl.fromTo("#egal", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, T.egal);
    tl.fromTo("#egal", { opacity: 1 }, { opacity: 0.25, duration: 0.18, repeat: 5, yoyo: true, ease: "steps(1)", immediateRender: false }, T.egal + 0.4);
    tl.fromTo("#cadeau", { y: 300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }, T.cadeau - 0.6);
    tl.fromTo("#couvercle", { rotation: 0, y: 0 }, { rotation: -35, y: -140, x: -60, duration: 0.45, ease: "back.out(2)", immediateRender: false }, T.cadeau);
    const conf = $("confettis"), couleurs = ["#F5B82E", "#FFE08A", "#F08A24", "#FFF4DE", "#E10600"];
    for (let k = 0; k < 40; k++) {
      const c = document.createElement("div"); c.className = "confetti"; c.style.background = couleurs[k % 5]; Object.assign(c.style, { left: "530px", top: "1180px" }); conf.appendChild(c);
      const a = -Math.PI / 2 + ((k / 40) - 0.5) * 2.6, v = 300 + (k % 7) * 60;
      tl.fromTo(c, { x: 0, y: 0, opacity: 0, rotation: 0 }, { keyframes: [{ opacity: 1, duration: 0.05 }, { x: Math.cos(a) * v, y: Math.sin(a) * v, rotation: 540, duration: 0.6, ease: "power2.out" }, { y: "+=500", opacity: 0, duration: 0.9, ease: "power1.in" }], immediateRender: false }, T.cadeau + 0.1);
    }
    texte(P[4], 21.45, [[18.77, 19.88, "*10&nbsp;000 francs."], [20.15, 21.28, "Oui, le même prix&nbsp;!"]]);
    texte(21.45, P[5], [[21.55, 22.8, "La *cinquième heure est offerte."]]);

    // ════ 6. Bascule LUXE : PACK CONFORT sous le projecteur, la voiture glisse derrière ════
    tl.fromTo("#voiture", { x: -1100, opacity: 0.0 }, { x: 0, opacity: 1, duration: 1.4, ease: "power3.out", immediateRender: true }, T.voiture);
    tl.fromTo("#phares", { opacity: 0 }, { keyframes: [{ opacity: 1, duration: 0.1 }, { opacity: 0.3, duration: 0.1 }, { opacity: 1, duration: 0.2 }], immediateRender: false }, T.voiture + 1.4);
    tl.fromTo("#carte-confort", { rotationY: 100, z: -400, opacity: 0 }, { rotationY: 0, z: 0, opacity: 1, duration: 0.8, ease: "back.out(1.4)", immediateRender: true }, T.carte2);
    tl.fromTo("#carte-confort", { rotationY: 0 }, { rotationY: -7, rotationX: 4, duration: 1.5, repeat: 3, yoyo: true, ease: "sine.inOut", immediateRender: false }, T.carte2 + 0.8);
    tl.fromTo("#carte-confort .reflet", { x: 0 }, { x: 1400, duration: 1.0, repeat: 2, repeatDelay: 1.2, ease: "power2.inOut", immediateRender: false }, T.carte2 + 0.6);
    tl.fromTo("#neuf-conf", { opacity: 0 }, { opacity: 0, duration: 0.01, immediateRender: true }, 0);
    tl.fromTo("#barre-conf", { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power2.in", immediateRender: true }, T.barre2);
    tl.fromTo("#neuf-conf", { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "bounce.out", immediateRender: false }, T.barre2 + 0.25);
    tl.fromTo("#badge5h", { opacity: 0, scale: 0.4, rotation: -8 }, { opacity: 1, scale: 1, rotation: -2, duration: 0.4, ease: "back.out(2.6)", immediateRender: false }, T.badge5h);
    tous(".pastille").forEach((e, k) => tl.to(e, { color: "#ffffff", backgroundColor: "rgba(34,197,94,.85)", borderColor: "rgba(34,197,94,1)", scale: 1.08, duration: 0.18 }, T.pastilles[k]));
    texte(P[5], 24.6, [[23.19, 24.45, "Tu préfères le *confort&nbsp;?"]], "luxe");
    texte(24.6, 28.3, [[24.74, 25.92, "3&nbsp;500 l'heure,"], [26.18, 28.09, "et *3&nbsp;000 dès cinq heures."]], "luxe");
    texte(28.3, P[6], [[28.42, 30.77, "Wi-Fi, clim, véhicule *premium."]], "luxe");

    // ════ 7. Récap : cartes en éventail, étoile rouge DÈS 2 000 FCFA/HEURE ════
    const pts = Array.from({ length: 24 }, (_, k) => { const r = k % 2 ? 62 : 98, a = (k / 24) * Math.PI * 2 - Math.PI / 2; return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }).join(" ");
    $("poly-etoile").setAttribute("points", pts);
    tl.fromTo("#mini-eco", { rotation: 0, x: 0 }, { rotation: -12, x: -210, duration: 0.5, ease: "back.out(1.8)", immediateRender: false }, P[6]);
    tl.fromTo("#mini-conf", { rotation: 0, x: 0, y: 0 }, { rotation: 8, x: 130, y: 80, duration: 0.5, ease: "back.out(1.8)", immediateRender: false }, P[6] + 0.05);
    tl.fromTo("#etoile", { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2.4)", immediateRender: false }, P[6] + 0.25);
    tl.fromTo("#etoile", { scale: 1 }, { scale: 1.08, duration: 0.25, repeat: 3, yoyo: true, ease: "sine.inOut", immediateRender: false }, P[6] + 0.7);
    texte(P[6], P[7], [[31.13, 32.13, "Douala et *environs."]]);

    // ════ 8. Outro PREMIUM : projecteur sur le logo, bouton WhatsApp qui pulse ════
    tl.fromTo("#logo", { opacity: 0, scale: 0.85, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, P[7]);
    tl.fromTo("#slogan", { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, P[7] + 0.3);
    tl.fromTo("#whatsapp", { opacity: 0, y: 50, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }, P[7] + 0.5);
    tl.fromTo("#whatsapp", { scale: 1, boxShadow: "0 0 0 0px rgba(34,197,94,.55)" }, { scale: 1.06, boxShadow: "0 0 0 34px rgba(34,197,94,0)", duration: 0.35, repeat: 4, yoyo: true, ease: "sine.inOut", immediateRender: false }, P[7] + 0.9);
    texte(P[7], T.retour, [[32.53, 33.63, "Réserve vite sur *WhatsApp."]], "luxe");

    // ════ Retour au STOP pour la boucle (état de l'image 1) ════
    tl.to("#p-outro", { opacity: 0, duration: 0.3 }, T.retour);
    tl.fromTo("#p-hook", { opacity: 0 }, { opacity: 1, scale: 1, duration: 0.3, immediateRender: false }, T.retour);
    tl.set("#stop", { y: 0, rotation: 0, scaleX: 1, scaleY: 1 }, T.retour);
    tl.set("#main", { x: 0, y: 0, rotation: -18 }, T.retour);
    changer($("mot-geant"), T.retour, "JP");
    texte(T.retour, null, [[T.retour + 0.02, T.retour + 0.05, "ATTENDS&nbsp;!"]], "geant");

    tl.to({}, { duration: T.duree }, 0);
  };
})();
