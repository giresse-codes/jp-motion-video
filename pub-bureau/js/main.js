// « Ton bureau roule » — JP Service Express Urbaine (21,3 s, 9:16, style JP UI, voix off fournie).
// Hook horloge 08:00 + portière, frise 08:05 → 08:35 avec ordinateur dans l'habitacle, notifications cochées,
// progression, bascule bleu nuit (Service Confort), outro, retour à l'horloge. Timeline GSAP en pause ;
// les écrans qui comptent (minuteur, progression, frise, mini-carte) sont des fonctions pures du temps.

(function () {
  const NS = "http://www.w3.org/2000/svg";
  const svg = (parent, nom, attrs) => {
    const el = document.createElementNS(NS, nom);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    parent.appendChild(el);
    return el;
  };
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
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const lisse = (v) => v * v * (3 - 2 * v);
  // Paliers adoucis : [[t, valeur], ...] -> valeur à l'instant t (transition de `d` s après chaque t).
  const paliers = (pts, t, d = 0.5) => pts.reduce((v, [tp, val], i) => (t < tp ? v : v + (val - (i ? pts[i - 1][1] : 0)) * lisse(clamp((t - tp) / d))), 0);

  window.CONSTRUIRE = function (tl) {
    const T = window.T;
    const $ = (id) => document.getElementById(id);
    const tous = (sel) => Array.from(document.querySelectorAll(sel));

    // ---------- Construction ----------
    preparerMots($("hook"), T.hook);
    const titres = T.phrases.map((liste) => {
      const p = document.createElement("div"); p.className = "phrase";
      $("titres").appendChild(p);
      return { p, mots: preparerMots(p, liste) };
    });
    const mots5 = preparerMots($("texte5"), T.texte5);
    const slogan = preparerMots($("slogan"), [[0, "Rapide."], [0, "Sûr."], [0, "*Confortable."]]);
    gsap.set([titres.map((x) => x.mots), mots5, slogan], { opacity: 0 });
    gsap.set("#porte", { rotationY: -70 });

    // Ville qui défile dans la vitre de l'habitacle
    const defile = $("defile");
    for (let x = 0, i = 0; x < 1400; i++) {
      const l = 60 + ((i * 37) % 50), h = 40 + ((i * 53) % 70);
      svg(defile, "rect", { x, y: 120 - h, width: l, height: h, rx: 6, fill: ["#B9CBEF", "#A9BCE6", "#C7D6F3"][i % 3] });
      x += l + 10;
    }
    // Mini-carte de trajet
    const plan = $("plan");
    svg(plan, "rect", { width: 230, height: 170, fill: "#EEF1F6" });
    for (let x = -10; x < 230; x += 60) for (let y = -10; y < 170; y += 54) svg(plan, "rect", { x: x + 8, y: y + 8, width: 46, height: 40, rx: 8, fill: "#fff" });
    const route = svg(plan, "path", { d: "M24 146 Q40 90 100 92 Q160 94 170 50 L206 22", fill: "none", stroke: "#3D5BD9", "stroke-width": 7, "stroke-linecap": "round" });
    svg(plan, "circle", { cx: 206, cy: 22, r: 9, fill: "#fff", stroke: "#22C55E", "stroke-width": 5 });
    const auto = svg(plan, "circle", { r: 9, fill: "#0B1B4D", stroke: "#fff", "stroke-width": 3 });

    // ---------- Horloge : fonctions pures du temps ----------
    const L = route.getTotalLength();
    const fracNoeuds = [480 / 960, 620 / 960, 760 / 960, 900 / 960];
    function maj(t) {
      const tr = t >= T.retour + 0.25 ? 0 : t;
      // minuteur d'appel 00:00 -> 12:00
      const m = Math.round(12 * lisse(clamp((tr - T.notifs[0]) / (T.notifs[1] - T.notifs[0] - 0.4))) * 60);
      $("minuteur").textContent = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
      // productivité par paliers
      const p = paliers([[T.notifs[0] + 0.5, 0.25], [T.notifs[1] + 0.5, 0.5], [T.notifs[2] + 0.5, 0.75], [T.pret, 1]], tr);
      $("prog").style.transform = `scaleX(${p.toFixed(4)})`;
      $("pourcent").textContent = `${Math.round(p * 100)} %`;
      // frise qui se remplit jusqu'au nœud de l'heure dite
      const f = paliers([[T.scene2 + 0.1, fracNoeuds[0]], [T.heures[1], fracNoeuds[1]], [T.heures[2], fracNoeuds[2]], [T.heures[3], fracNoeuds[3]]], tr, 0.4);
      $("remplissage").style.transform = `scaleY(${f.toFixed(4)})`;
      // voiture sur la mini-carte, ville dans la vitre
      const a = route.getPointAtLength(L * lisse(clamp((tr - T.heures[0]) / (T.arrive - T.heures[0]))));
      auto.setAttribute("cx", a.x.toFixed(1)); auto.setAttribute("cy", a.y.toFixed(1));
      defile.style.transform = `translateX(${(-(tr * 90) % 700).toFixed(1)}px)`;
    }
    const horloge = { t: 0 };
    tl.to(horloge, { t: T.duree, duration: T.duree, ease: "none", onUpdate: () => maj(horloge.t) }, 0);
    maj(0);

    // ---------- Animations ----------
    const montrerMots = (mots, liste) => mots.forEach((m, i) => {
      tl.fromTo(m, { opacity: 0, y: 20, filter: "blur(14px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out", immediateRender: false }, liste[i][0]);
    });
    [[0, T.scene2], [T.scene2, T.bascule], [T.outro, T.retour]].forEach(([d, f], i) => {
      tl.fromTo("#camera", { scale: 1 }, { scale: 1.05, duration: f - d, ease: "none", immediateRender: i === 0 }, d);
    });

    // 1. Hook : la portière se ferme avec un clic
    tl.fromTo("#horloge .pt", { scale: 1 }, { scale: 1.5, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, 0.1);
    tl.fromTo(".voiture-cote", { x: 0 }, { x: -12, duration: 1.2, ease: "sine.inOut", immediateRender: false }, 0);
    tl.to("#porte", { rotationY: 0, duration: 0.5, ease: "power3.in" }, T.portiere - 0.5);
    tl.to(".voiture-cote", { y: 6, duration: 0.06, yoyo: true, repeat: 3, ease: "sine.inOut" }, T.portiere);
    tl.fromTo("#clic", { opacity: 0, scale: 0.5, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "back.out(3)", immediateRender: false }, T.portiere);
    tl.to("#clic", { opacity: 0, duration: 0.2 }, T.scene2 - 0.15);

    // 2. Bureau qui roule : frise, habitacle, notifications
    tl.to("#s-hook", { y: -160, opacity: 0, duration: 0.45, ease: "power3.in" }, T.scene2);
    tl.set("#s-bureau", { opacity: 1 }, T.scene2 + 0.1);
    tl.fromTo(".frise", { x: -120, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "back.out(1.4)", immediateRender: false }, T.scene2 + 0.1);
    tl.fromTo(".habitacle", { x: 200, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "back.out(1.4)", immediateRender: false }, T.scene2 + 0.15);
    tl.fromTo(".progression", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, T.scene2 + 0.3);
    tous(".wifi path").forEach((a, i) => tl.fromTo(a, { opacity: 0.25 }, { opacity: 1, duration: 0.35, yoyo: true, repeat: 15, ease: "sine.inOut", immediateRender: false }, T.scene2 + 0.3 + i * 0.12));
    tous(".noeud").forEach((n, i) => {
      tl.to(n.querySelector("i"), { borderColor: "#3D5BD9", backgroundColor: "#3D5BD9", scale: 1.15, duration: 0.3, ease: "back.out(3)" }, T.heures[i]);
      tl.to(n.querySelector("i"), { scale: 1, duration: 0.25 }, T.heures[i] + 0.3);
      tl.to(n.querySelector("b"), { color: "#0B1B4D", duration: 0.3 }, T.heures[i]);
    });
    titres.forEach(({ p, mots }, k) => {
      montrerMots(mots, T.phrases[k]);
      if (k < titres.length - 1) tl.to(p, { opacity: 0, y: -24, filter: "blur(8px)", duration: 0.3, ease: "power2.in" }, T.phrases[k + 1][0][0] - 0.35);
    });
    // écran de l'ordinateur
    const vues = ["#vue-accueil", "#vue-appel", "#vue-mails", "#vue-slide"];
    T.notifs.forEach((t, k) => {
      tl.to(vues[k], { opacity: 0, duration: 0.25 }, t - 0.15);
      tl.fromTo(vues[k + 1], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", immediateRender: false }, t - 0.05);
    });
    ["#m1", "#m2", "#m3"].forEach((m, i) => tl.fromTo(m, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.3, ease: "back.out(2)", immediateRender: false }, T.notifs[1] + 0.1 + i * 0.3));
    tl.fromTo("#vue-slide .barres i", { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, transformOrigin: "50% 100%", duration: 0.4, stagger: 0.12, ease: "back.out(2)", immediateRender: false }, T.notifs[2] + 0.2);
    // notifications : pop puis coche verte
    ["#n0", "#n1", "#n2"].forEach((n, k) => {
      const t = T.notifs[k];
      tl.fromTo(n, { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.8)", immediateRender: false }, t);
      tl.fromTo(`${n} .ok`, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, t + 0.5);
    });
    // 4. Arrivé · Prêt
    tl.fromTo("#badge", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2.4)", immediateRender: false }, T.arrive + 0.05);
    tl.to("#badge", { scale: 1.05, duration: 0.18, yoyo: true, repeat: 1 }, T.pret);
    tl.to(".progression", { scale: 1.03, duration: 0.18, yoyo: true, repeat: 1 }, T.pret + 0.4);

    // 5. Bascule bleu nuit : Service Confort
    tl.fromTo("#nuit", { clipPath: "circle(0% at 50% 100%)" }, { clipPath: "circle(150% at 50% 100%)", duration: 0.6, ease: "power3.inOut", immediateRender: false }, T.bascule);
    montrerMots(mots5, T.texte5);
    tl.fromTo("#texte5", { scale: 1 }, { scale: 1.04, duration: T.outro - T.bascule, ease: "none", immediateRender: false }, T.bascule);
    ["#pa0", "#pa1", "#pa2", "#pa3"].forEach((p, i) => {
      tl.fromTo(p, { opacity: 0, scale: 0.5, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(2.4)", immediateRender: false }, T.pastilles[i]);
    });
    tl.to("#pa3", { scale: 1.08, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, T.pastilles[3] + 0.5);

    // Outro JP UI
    tl.fromTo("#outro", { opacity: 0 }, { opacity: 1, duration: 0.35, immediateRender: false }, T.outro);
    tl.fromTo("#logo", { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)", immediateRender: false }, T.outro + 0.05);
    tl.to("#logo", { scale: 1.04, duration: T.retour - T.outro - 0.65, ease: "none" }, T.outro + 0.65);
    slogan.forEach((m, i) => tl.fromTo(m, { opacity: 0, y: 20, filter: "blur(14px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power3.out", immediateRender: false }, T.slogan + i * 0.14));
    tl.fromTo("#contact", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)", immediateRender: false }, T.contact);

    // Retour à l'horloge 08:00 (boucle)
    tl.fromTo("#retour", { clipPath: "circle(0% at 50% 50%)", opacity: 1 }, { clipPath: "circle(150% at 50% 50%)", duration: 0.25, ease: "power3.in", immediateRender: false }, T.retour);
    const r0 = T.retour + 0.25;
    tl.set(["#outro", "#s-bureau"], { opacity: 0 }, r0);
    tl.set("#nuit", { clipPath: "circle(0% at 50% 100%)" }, r0);
    tl.set("#s-hook", { y: 0, opacity: 1 }, r0);
    tl.set("#porte", { rotationY: -70 }, r0);
    tl.set(".voiture-cote", { x: 0, y: 0 }, r0);
    tl.set("#camera", { scale: 1 }, r0);
    tl.to("#retour", { opacity: 0, duration: T.duree - r0, ease: "power1.out" }, r0);
  };
})();
