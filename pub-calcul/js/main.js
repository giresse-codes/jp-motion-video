// « Fais le calcul » — JP Service Express Urbaine (21,8 s, 9:16, style JP UI, voix off fournie).
// Calculatrice qui s'écrit en direct, trajet et temps perdu, bascule bleu nuit, téléphone avec trois
// validations, comparaison de cartes, outro. Timeline GSAP en pause ; écrans pilotés par une horloge (sûr au seek).

(function () {
  const NS = "http://www.w3.org/2000/svg";
  const svg = (parent, nom, attrs) => {
    const el = document.createElementNS(NS, nom);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    parent.appendChild(el);
    return el;
  };

  // Mots d'une phrase : [[temps, "mot"], ...] (« * » devant un mot = mot clé en bleu vif).
  function preparerMots(el, liste) {
    el.innerHTML = "";
    return liste.map(([, m]) => {
      const s = document.createElement("span");
      s.className = "mot" + (m.startsWith("*") ? " cle" : "");
      s.textContent = m.replace(/^\*/, "");
      el.appendChild(s);
      return s;
    });
  }

  // Petit plan de ville générique : îlots et fleuve.
  function planDeVille(plan, l, h, fleuve) {
    svg(plan, "rect", { width: l, height: h, fill: "#EEF1F6" });
    for (let x = -40; x < l; x += 170) {
      for (let y = -30; y < h; y += 150) svg(plan, "rect", { x: x + 18, y: y + 18, width: 134, height: 114, rx: 18, fill: "#fff" });
    }
    if (fleuve) svg(plan, "path", { d: fleuve, fill: "none", stroke: "#C9DAFF", "stroke-width": 80, "stroke-linecap": "round" });
  }

  function voiture(parent, couleur) {
    const g = svg(parent, "g", {});
    svg(g, "rect", { x: -30, y: -16, width: 60, height: 32, rx: 10, fill: couleur });
    svg(g, "rect", { x: 4, y: -11, width: 14, height: 22, rx: 4, fill: "rgba(255,255,255,.55)" });
    return g;
  }

  // Place une voiture sur un chemin SVG à une fraction p de sa longueur, orientée dans le sens de la route.
  function placer(g, chemin, p) {
    const L = chemin.getTotalLength(), a = chemin.getPointAtLength(Math.max(0, Math.min(L, p * L))), b = chemin.getPointAtLength(Math.min(L, p * L + 2));
    const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    g.setAttribute("transform", `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
  }

  const clamp = (v) => Math.max(0, Math.min(1, v));
  const lisse = (v) => v * v * (3 - 2 * v);

  window.CONSTRUIRE = function (tl) {
    const T = window.T;
    const $ = (id) => document.getElementById(id);

    // ---------- Construction ----------
    preparerMots($("question"), T.question);
    const mots3 = preparerMots($("texte3"), T.texte3), mots4 = preparerMots($("texte4"), T.texte4), mots7 = preparerMots($("texte7"), T.texte7);
    const slogan = preparerMots($("slogan"), [[0, "Rapide."], [0, "Sûr."], [0, "*Confortable."]]);
    gsap.set([mots3, mots4, mots7, slogan], { opacity: 0 });

    const TOUCHES = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "C", "0", ",", "="];
    const centre = {};
    TOUCHES.forEach((k, i) => {
      const d = document.createElement("div");
      d.className = "touche" + ("÷×−".includes(k) ? " op" : k === "=" ? " egal" : "");
      d.textContent = k; d.dataset.k = k;
      $("touches").appendChild(d);
      const col = i % 4, lig = Math.floor(i / 4);
      centre[k] = { el: d, x: 110 + 40 + col * (167 + 24) + 83, y: 560 + 410 + lig * (128 + 24) + 64 };
    });

    // Trajet bloqué (scène 3)
    const plan = $("plan");
    planDeVille(plan, 820, 600, "M-60 430 Q300 340 880 480");
    const route = "M80 110 Q240 130 300 280 Q340 400 470 420 Q620 450 740 560";
    svg(plan, "path", { d: route, fill: "none", stroke: "#fff", "stroke-width": 30, "stroke-linecap": "round" });
    const rouge = svg(plan, "path", { d: route, fill: "none", stroke: "#E10600", "stroke-width": 14, "stroke-linecap": "round" });
    const Lr = rouge.getTotalLength();
    rouge.style.strokeDasharray = Lr; rouge.style.strokeDashoffset = Lr;
    svg(plan, "circle", { cx: 80, cy: 110, r: 14, fill: "#0B1B4D" });
    svg(plan, "circle", { cx: 740, cy: 560, r: 18, fill: "#fff", stroke: "#E10600", "stroke-width": 8 });
    [[0.42, "#B9C1D0"], [0.48, "#B9C1D0"], [0.54, "#B9C1D0"], [0.6, "#B9C1D0"]].forEach(([p, c]) => placer(voiture(plan, c), rouge, p));
    const maVoiture = voiture(plan, "#0B1B4D");

    // Trajet fluide dans le téléphone (scène 5)
    const plan2 = $("plan2");
    planDeVille(plan2, 484, 964, "M-40 640 Q240 560 540 700");
    const route2 = "M90 900 Q120 700 240 640 Q380 570 360 400 Q340 240 400 90";
    svg(plan2, "path", { d: route2, fill: "none", stroke: "#fff", "stroke-width": 26, "stroke-linecap": "round" });
    const bleu = svg(plan2, "path", { d: route2, fill: "none", stroke: "#3D5BD9", "stroke-width": 12, "stroke-linecap": "round" });
    svg(plan2, "circle", { cx: 400, cy: 90, r: 16, fill: "#fff", stroke: "#22C55E", "stroke-width": 8 });
    const voitureJP = voiture(plan2, "#0B1B4D");

    // ---------- Horloge : écrans qui sont des fonctions pures du temps ----------
    const s1 = ["", "5", "50", "500", "5 000", "50 000", "50 000 F", "50 000 F ÷", "50 000 F ÷ 8", "50 000 F ÷ 8 h"];
    const r = ["", "6", "62", "625", "6 250", "6 250 F/h"];
    const fmt = (s) => [Math.floor(s / 3600), Math.floor(s / 60) % 60, Math.floor(s % 60)].map((v) => String(v).padStart(2, "0")).join(":");
    function maj(t) {
      const tc = t >= T.retour + 0.2 ? 0 : t; // pendant le retour, l'écran revient à l'image 1
      const k = T.frappe.filter(([tf]) => tf <= tc).length;
      if (k <= 9) { $("expr").textContent = ""; $("resultat").textContent = s1[k]; $("resultat").style.fontSize = "80px"; }
      else { $("expr").textContent = s1[9] + " ="; $("resultat").textContent = r[k - 10]; $("resultat").style.fontSize = "104px"; }
      const dernier = T.frappe.filter(([tf]) => tf <= tc).pop();
      const tape = dernier && tc - dernier[0] < 0.45;
      $("curseur").style.opacity = tc > T.gros ? 0 : (tape || Math.floor(tc / 0.5) % 2 === 0 ? 1 : 0);
      // compteur de temps perdu (accélère)
      const p = clamp((t - T.compteur[0]) / (T.compteur[1] - T.compteur[0]));
      $("compteur").textContent = fmt(Math.pow(p, 1.5) * 7200);
      // voiture coincée qui avance par à-coups, voiture JP qui roule sans s'arrêter
      const q = clamp((t - 6.9) / 3.0);
      placer(maVoiture, rouge, 0.08 + 0.3 * (q + 0.04 * Math.sin(q * 18)) );
      placer(voitureJP, bleu, 0.05 + 0.85 * lisse(clamp((t - T.telephone) / (T.cartes - T.telephone + 0.3))));
    }
    const horloge = { t: 0 };
    tl.to(horloge, { t: T.duree, duration: T.duree, ease: "none", onUpdate: () => maj(horloge.t) }, 0);
    maj(0);

    // ---------- Animations ----------
    const montrerMots = (mots, liste) => mots.forEach((m, i) => {
      tl.fromTo(m, { opacity: 0, y: 20, filter: "blur(14px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out", immediateRender: false }, liste[i][0]);
    });

    // Caméra : zoom lent 100 % -> 105 %, relancé à chaque scène.
    [[0, T.scene3], [T.scene3, T.bascule], [T.telephone, T.cartes], [T.cartes, T.outro]].forEach(([d, f], i) => {
      tl.fromTo("#camera", { scale: 1 }, { scale: 1.05, duration: f - d, ease: "none", immediateRender: i === 0 }, d);
    });

    // 1-2. Calculatrice : le doigt tape, le résultat grossit, l'étiquette s'accroche
    tl.fromTo("#mention", { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, 2.0);
    tl.fromTo("#doigt", { opacity: 0, x: 700, y: 1500 }, { opacity: 1, x: centre["5"].x, y: centre["5"].y, duration: 0.5, ease: "power2.out", immediateRender: false }, 2.2);
    T.frappe.forEach(([tf, k]) => {
      const c = centre[k];
      if (!c) return;
      tl.to("#doigt", { x: c.x, y: c.y, duration: 0.12, ease: "power2.out" }, tf - 0.12);
      tl.to("#doigt", { scale: 0.8, duration: 0.06, yoyo: true, repeat: 1 }, tf);
      // fromTo explicite : des frappes rapprochées sur la même touche ne la laissent pas enfoncée
      const base = k === "=" ? "#3D5BD9" : "÷×−".includes(k) ? "#E4E9FB" : "#F2F4F8";
      tl.fromTo(c.el, { scale: 1, backgroundColor: base }, { scale: 0.92, backgroundColor: k === "=" ? "#2B47C2" : "#DCE3F7", duration: 0.04, yoyo: true, repeat: 1, immediateRender: false }, tf);
    });
    tl.to("#doigt", { opacity: 0, x: 900, y: 1550, duration: 0.4, ease: "power2.in" }, 4.75);
    tl.fromTo("#resultat", { scale: 1 }, { scale: 1.18, duration: 0.5, ease: "back.out(2.5)", immediateRender: false }, T.gros);
    tl.fromTo("#etiquette", { opacity: 0, scale: 0.4, rotation: -20 }, { opacity: 1, scale: 1, rotation: -5, duration: 0.6, ease: "back.out(2.2)", immediateRender: false }, T.etiquette);
    tl.to("#etiquette", { rotation: -2, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: 1 }, T.etiquette + 0.6);

    // 3. Trajet : itinéraire rouge, compteur, badges +1 h / +2 h
    tl.to("#s-calc", { y: -160, opacity: 0, duration: 0.45, ease: "power3.in" }, T.scene3);
    tl.set("#s-trajet", { opacity: 1 }, T.scene3 + 0.1);
    tl.fromTo("#carte", { y: 500, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.4)", immediateRender: false }, T.scene3 + 0.1);
    montrerMots(mots3, T.texte3);
    tl.to(rouge, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 6.55);
    tl.fromTo("#badge", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.5)", immediateRender: false }, T.badges[0]);
    tl.to("#badge1", { opacity: 0, y: -30, duration: 0.2 }, T.badges[1]);
    tl.fromTo("#badge2", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)", immediateRender: false }, T.badges[1]);
    tl.to("#badge", { scale: 1.12, duration: 0.15, yoyo: true, repeat: 1 }, T.badges[1]);
    tl.fromTo("#perte", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(2)", immediateRender: false }, T.perte);
    tl.to("#compteur", { scale: 1.06, duration: 0.12, yoyo: true, repeat: 1 }, T.compteur[1]);

    // 4. Bascule bleu nuit
    tl.fromTo("#nuit", { clipPath: "circle(0% at 50% 100%)" }, { clipPath: "circle(150% at 50% 100%)", duration: 0.6, ease: "power3.inOut", immediateRender: false }, T.bascule);
    montrerMots(mots4, T.texte4);
    tl.fromTo("#texte4", { scale: 1 }, { scale: 1.04, duration: 2.9, ease: "none", immediateRender: false }, T.bascule);

    // 5. Téléphone : la nuit se referme sur le blanc, trois validations vertes
    tl.set("#s-trajet", { opacity: 0 }, 13.35);
    tl.set("#s-tel", { opacity: 1 }, 13.35);
    tl.to("#nuit", { clipPath: "circle(0% at 50% 50%)", duration: 0.5, ease: "power3.inOut" }, 13.38);
    tl.fromTo("#telephone", { y: 500 }, { y: 0, duration: 0.7, ease: "back.out(1.3)", immediateRender: false }, T.telephone);
    const vs = ["#v0", "#v1", "#v2"];
    vs.forEach((v, k) => {
      const t = T.notifs[k];
      tl.fromTo(v, { y: -220, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", immediateRender: false }, t);
      for (let j = 0; j < k; j++) tl.to(vs[j], { y: (k - j) * 176, scale: 1 - (k - j) * 0.02, duration: 0.5, ease: "back.out(1.4)" }, t);
      tl.to(`${v} .rond`, { fill: "#fff", duration: 0.2 }, t + 0.35);
      tl.to(`${v} .trait`, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, t + 0.38);
      tl.fromTo(`${v} em`, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, t + 0.4);
    });

    // 6-7. Comparaison : deux cartes, « > » vert géant, « Fais le calcul. »
    tl.to("#s-tel", { y: 200, opacity: 0, duration: 0.4, ease: "power3.in" }, T.cartes - 0.1);
    tl.set("#s-comp", { opacity: 1 }, T.cartes);
    tl.fromTo("#c-heure", { opacity: 0, x: -120 }, { opacity: 1, x: 0, duration: 0.6, ease: "back.out(1.6)", immediateRender: false }, T.cartes + 0.05);
    tl.fromTo("#c-chauffeur", { opacity: 0, x: 120 }, { opacity: 1, x: 0, duration: 0.6, ease: "back.out(1.6)", immediateRender: false }, T.carte2);
    tl.to("#prix2", { scale: 1.12, duration: 0.18, yoyo: true, repeat: 1 }, T.prix2);
    tl.fromTo("#superieur", { opacity: 0, scale: 0.2, rotation: -40 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2.6)", immediateRender: false }, T.superieur);
    tl.to("#superieur", { scale: 1.06, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: 2 }, T.superieur + 0.6);
    montrerMots(mots7, T.texte7);

    // Outro JP UI : plein écran bleu nuit, logo grand, slogan, pastille WhatsApp
    tl.fromTo("#outro", { opacity: 0 }, { opacity: 1, duration: 0.35, immediateRender: false }, T.outro);
    tl.fromTo("#logo", { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)", immediateRender: false }, T.outro + 0.05);
    tl.to("#logo", { scale: 1.04, duration: T.duree - T.outro - 0.65, ease: "none" }, T.outro + 0.65);
    slogan.forEach((m, i) => tl.fromTo(m, { opacity: 0, y: 20, filter: "blur(14px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power3.out", immediateRender: false }, T.slogan + i * 0.14));
    tl.fromTo("#contact", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)", immediateRender: false }, T.contact);

    // Retour vers l'image 1 (boucle) : le blanc recouvre, la calculatrice revient à son état initial
    tl.fromTo("#retour", { clipPath: "circle(0% at 50% 50%)", opacity: 1 }, { clipPath: "circle(150% at 50% 50%)", duration: 0.25, ease: "power3.in", immediateRender: false }, T.retour);
    const r0 = T.retour + 0.25;
    tl.set("#outro", { opacity: 0 }, r0);
    tl.set("#s-comp", { opacity: 0 }, r0);
    tl.set("#s-calc", { y: 0, opacity: 1 }, r0);
    tl.set(["#etiquette", "#mention"], { opacity: 0 }, r0);
    tl.set("#resultat", { scale: 1 }, r0);
    tl.set("#camera", { scale: 1 }, r0);
    tl.to("#retour", { opacity: 0, duration: T.duree - r0, ease: "power1.out" }, r0);
  };
})();
