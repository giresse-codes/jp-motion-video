// « 4 h 30 et personne » — JP Service Express Urbaine (20 s, 9:16, voix off fournie). Série « UI storytelling ».
// Hook réveil 4:30 + vol, notifications du problème, bascule bleu nuit, trajet + validations + prix,
// outro commune. Timeline GSAP en pause, déterministe.

(function () {
  const NS = "http://www.w3.org/2000/svg";
  const svg = (parent, nom, attrs) => {
    const el = document.createElementNS(NS, nom);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    parent.appendChild(el);
    return el;
  };

  // Découpe un élément [data-mots] en mots (« * » devant un mot = mot clé en bleu vif).
  function preparerMots(el) {
    const mots = el.dataset.mots.split("|");
    el.innerHTML = "";
    return mots.map((m) => {
      const s = document.createElement("span");
      s.className = "mot" + (m.startsWith("*") ? " cle" : "");
      s.innerHTML = m.replace(/^\*/, "");
      el.appendChild(s);
      return s;
    });
  }

  window.CONSTRUIRE = function (tl) {
    const T = window.T;
    const $ = (id) => document.getElementById(id);
    const tous = (sel) => Array.from(document.querySelectorAll(sel));

    // Mots : flou + transparent -> nets, glissement de 20 px vers le haut.
    const montrerMots = (mots, t, ecart = 0.14) => mots.forEach((m, i) => {
      tl.fromTo(m, { opacity: 0, y: 20, filter: "blur(14px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out", immediateRender: false }, t + i * ecart);
    });
    const cacher = (cible, t, d = 0.3) => tl.to(cible, { opacity: 0, y: -30, filter: "blur(10px)", duration: d, ease: "power2.in" }, t);
    const phrases = {};
    tous("[data-mots]").forEach((el) => { phrases[el.id] = preparerMots(el); });
    gsap.set(".mot", { opacity: 0 });

    // Caméra : zoom lent 100 % -> 106 % sur toute la vidéo (repris après la bascule).
    tl.fromTo("#camera", { scale: 1 }, { scale: 1.06, duration: T.bascule, ease: "none" }, 0);
    tl.fromTo("#camera", { scale: 1 }, { scale: 1.06, duration: T.duree - T.bascule, ease: "none", immediateRender: false }, T.bascule);

    // ════ HOOK : réveil qui vibre, notification du vol (déjà lisible à l'image 1) ════
    tl.fromTo("#reveil", { x: 0, rotation: 0 }, { keyframes: [{ x: -10, rotation: -1.5, duration: 0.05 }, { x: 10, rotation: 1.5, duration: 0.05 }, { x: 0, rotation: 0, duration: 0.05 }],
      repeat: 9, repeatDelay: 0.12 }, 0);
    tl.fromTo("#ondes i", { scale: 0.85, opacity: 0.6 }, { scale: 1.15, opacity: 0.15, duration: 0.3, repeat: 9, yoyo: true, ease: "sine.inOut" }, 0);
    tl.fromTo("#dp", { opacity: 1 }, { opacity: 0.2, duration: 0.25, repeat: 5, yoyo: true, ease: "steps(1)" }, 0.3);
    tl.fromTo("#n-vol", { scale: 1 }, { keyframes: [{ scale: 1.04, duration: 0.15 }, { scale: 1, duration: 0.3, ease: "back.out(2)" }] }, T.vol);

    // ════ PROBLÈME : le réveil monte, les notifications s'empilent (la plus récente en haut) ════
    tl.to("#reveil", { y: -230, scale: 0.42, duration: 0.6, ease: "power3.inOut" }, T.probleme - 0.2);
    tl.to("#ondes", { opacity: 0, duration: 0.3 }, T.probleme - 0.2);
    tl.to("#pile", { y: -440, duration: 0.6, ease: "power3.inOut" }, T.probleme - 0.2);
    const pile = ["#n-vol", "#n-appel", "#n-taxi"];
    T.notifs.forEach((t, k) => {
      const n = pile[k + 1];
      tl.fromTo(n, { y: -260, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)", immediateRender: false }, t);
      for (let j = 0; j <= k; j++) tl.to(pile[j], { y: (k + 1 - j) * 176, scale: 1 - (k + 1 - j) * 0.02, duration: 0.6, ease: "back.out(1.4)" }, t);
    });
    montrerMots(phrases.texte1, T.texte1, 0.22);

    // ════ BASCULE bleu nuit ════
    tl.fromTo("#nuit", { clipPath: "circle(0% at 50% 100%)" }, { clipPath: "circle(150% at 50% 100%)", duration: 0.65, ease: "power3.inOut" }, T.bascule);
    tl.set(["#hook", "#pile", "#texte1"], { opacity: 0 }, T.bascule + 0.65);
    montrerMots(phrases.texte2, T.texte2, 0.2);

    // ════ SOLUTION : trajet, chauffeur arrivé, puces, prix ════
    tl.to("#nuit", { clipPath: "circle(0% at 50% 0%)", duration: 0.55, ease: "power3.inOut" }, T.solution - 0.1);
    tl.set("#texte2", { opacity: 0 }, T.solution + 0.3);
    const plan = $("plan");
    svg(plan, "rect", { width: 820, height: 760, fill: "#EEF1F6" });
    for (let x = -40; x < 820; x += 170) for (let y = -30; y < 760; y += 150) svg(plan, "rect", { x: x + 18, y: y + 18, width: 134, height: 114, rx: 18, fill: "#fff" });
    const d = "M120 650 Q150 470 310 450 Q480 430 500 300 Q520 170 690 150";
    svg(plan, "path", { d, fill: "none", stroke: "#fff", "stroke-width": 34, "stroke-linecap": "round" });
    const bleu = svg(plan, "path", { d, fill: "none", stroke: "#3D5BD9", "stroke-width": 18, "stroke-linecap": "round" });
    const chemin = svg(plan, "path", { d, fill: "none", stroke: "none" });
    svg(plan, "circle", { cx: 690, cy: 150, r: 26, fill: "#0B1B4D" });
    svg(plan, "circle", { cx: 690, cy: 150, r: 10, fill: "#fff" });
    const nom = svg(plan, "text", { x: 690, y: 100, "text-anchor": "middle", "font-family": "Inter", "font-weight": 700, "font-size": 30, fill: "#0B1B4D" });
    nom.textContent = "Chez vous";
    const auto = svg(plan, "g", {});
    svg(auto, "rect", { x: -30, y: -16, width: 60, height: 32, rx: 10, fill: "#0B1B4D" });
    svg(auto, "rect", { x: 4, y: -11, width: 14, height: 22, rx: 4, fill: "rgba(255,255,255,.55)" });
    const L = chemin.getTotalLength();
    bleu.setAttribute("stroke-dasharray", `${L} ${L}`);
    const course = { p: 0 };
    const maj = () => {
      const a = chemin.getPointAtLength(course.p * L), b = chemin.getPointAtLength(Math.min(L, course.p * L + 4));
      auto.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${(Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI})`);
      bleu.setAttribute("stroke-dashoffset", `${-course.p * L}`);
    };
    maj();
    tl.fromTo("#ecran", { opacity: 0, y: 220, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.3)" }, T.solution);
    tl.fromTo(course, { p: 0 }, { p: 1, duration: T.trajet[1] - T.trajet[0], ease: "power1.inOut", onUpdate: maj }, T.trajet[0]);
    tl.fromTo("#arrive", { opacity: 0, y: 40, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2)" }, T.arrive);
    tous(".puce").forEach((p, k) => {
      tl.fromTo(p, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }, T.arrive + 0.3 + k * 0.1);
      tl.to(p, { backgroundColor: "#22C55E", color: "#ffffff", scale: 1.08, duration: 0.18, ease: "power2.out" }, T.puces[k]);
      tl.to(p, { scale: 1, duration: 0.25, ease: "back.out(2)" }, T.puces[k] + 0.18);
      tl.to(p.querySelector("b"), { color: "#ffffff", duration: 0.18 }, T.puces[k]);
    });
    tl.fromTo("#prix", { opacity: 0, y: 300 }, { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.4)" }, T.prix);
    tous(".prix-lignes div").forEach((el, k) => tl.fromTo(el, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, T.prix + 0.35 + k * 0.15));
    // Doigt qui tape sur « Confort ».
    tl.fromTo("#doigt", { opacity: 0, x: 900, y: 1640 }, { opacity: 1, x: 720, y: 1460, duration: 0.4, ease: "power2.out" }, T.tap - 0.45);
    tl.to("#doigt", { scale: 0.75, duration: 0.08, yoyo: true, repeat: 1 }, T.tap);
    tl.to(".prix-lignes div:last-child", { backgroundColor: "#E8EDFF", scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 }, T.tap);
    tl.to(".prix-lignes div:last-child", { boxShadow: "inset 0 0 0 4px #3D5BD9", duration: 0.2 }, T.tap + 0.1);
    tl.to("#doigt", { opacity: 0, duration: 0.3 }, T.tap + 0.4);
    // Mouvement continu jusqu'à l'outro.
    tl.to(["#ecran", "#puces", "#prix"], { y: -10, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: 1 }, T.tap + 0.4);

    // ════ OUTRO commune ════
    tl.fromTo("#outro", { opacity: 0, clipPath: "circle(0% at 50% 50%)" }, { opacity: 1, clipPath: "circle(120% at 50% 50%)", duration: 0.6, ease: "power3.inOut" }, T.outro);
    tl.fromTo("#logo-boite", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power3.out" }, T.outro + 0.2);
    tl.fromTo("#logo", { scale: 1.15, filter: "blur(12px)" }, { scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }, T.outro + 0.2);
    tl.fromTo("#reflet", { x: 0 }, { x: 1100, duration: 0.7, ease: "power2.inOut" }, T.outro + 0.8);
    montrerMots(phrases.slogan, T.slogan, 0.16);
    tl.fromTo("#contact", { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.8)" }, T.contact);
    tl.fromTo("#contact", { scale: 1 }, { scale: 1.04, duration: 0.6, yoyo: true, repeat: 2, ease: "sine.inOut", immediateRender: false }, T.contact + 0.6);
    // Retour vers l'image 1 : le blanc revient, puis le hook (réveil + vol) réapparaît.
    tl.fromTo("#retour", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(120% at 50% 50%)", duration: 0.3, ease: "power2.in" }, T.retour);

    tl.to({}, { duration: T.duree }, 0);
  };
})();
