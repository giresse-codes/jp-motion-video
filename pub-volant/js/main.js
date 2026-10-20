// « Plus jamais au volant » — JP Service Express Urbaine (23 s, 9:16, voix off fournie).
// UI storytelling : notifications qui s'empilent, trajet bloqué, bascule bleu nuit, trois étapes
// (écrire, il arrive, vous travaillez), téléphone confirmé, outro logo. Timeline GSAP en pause.

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
    el.innerHTML = "";
    return el.dataset.mots.split("|").map((m) => {
      const s = document.createElement("span");
      s.className = "mot" + (m.startsWith("*") ? " cle" : "");
      s.textContent = m.replace(/^\*/, "");
      el.appendChild(s);
      return s;
    });
  }

  // Petit plan de ville générique : îlots, fleuve, routes.
  function planDeVille(plan, l, h, fleuve) {
    svg(plan, "rect", { width: l, height: h, fill: "#EEF1F6" });
    for (let x = -40; x < l; x += 170) {
      for (let y = -30; y < h; y += 150) svg(plan, "rect", { x: x + 18, y: y + 18, width: 134, height: 114, rx: 18, fill: "#fff" });
    }
    if (fleuve) svg(plan, "path", { d: fleuve, fill: "none", stroke: "#C9DAFF", "stroke-width": 90, "stroke-linecap": "round" });
  }

  function voitureDessus(parent, couleur) {
    const g = svg(parent, "g", {});
    svg(g, "rect", { x: -30, y: -16, width: 60, height: 32, rx: 10, fill: couleur });
    svg(g, "rect", { x: 4, y: -11, width: 14, height: 22, rx: 4, fill: "rgba(255,255,255,.55)" });
    return g;
  }

  window.CONSTRUIRE = function (tl) {
    const T = window.T;
    const $ = (id) => document.getElementById(id);
    const tous = (sel, racine = document) => Array.from(racine.querySelectorAll(sel));

    // Mots : flou + transparent -> nets, léger glissement vers le haut.
    const montrerMots = (mots, t, ecart = 0.12) => mots.forEach((m, i) => {
      tl.fromTo(m, { opacity: 0, y: 34, filter: "blur(14px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out", immediateRender: false }, t + i * ecart);
    });
    const cacher = (cible, t, d = 0.3) => tl.to(cible, { opacity: 0, y: -30, filter: "blur(10px)", duration: d, ease: "power2.in" }, t);
    const phrases = {};
    tous("[data-mots]").forEach((el) => { phrases[el.id || el.dataset.mots] = preparerMots(el); });
    gsap.set(".mot", { opacity: 0 });
    const titres = tous(".titre").map((el) => phrases[el.dataset.mots]);

    // Caméra : zoom lent et continu, relancé à chaque scène.
    [0, T.bascule, T.etapes, T.telephone, T.outro].forEach((d, i, a) => {
      const f = a[i + 1] ?? T.duree;
      tl.fromTo("#camera", { scale: 1 }, { scale: 1.035, duration: f - d, ease: "none", immediateRender: i === 0 }, d);
    });

    // ════ SCÈNE 1 : notifications qui tombent et s'empilent (la plus récente en haut) ════
    const notifs = ["#n0", "#n1", "#n2"];
    notifs.forEach((n, k) => {
      const t = T.notifs[k];
      tl.fromTo(n, { y: -260, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)", immediateRender: k === 0 }, t);
      for (let j = 0; j < k; j++) {
        tl.to(notifs[j], { y: (k - j) * 176, scale: 1 - (k - j) * 0.02, duration: 0.6, ease: "back.out(1.4)" }, t);
      }
    });
    montrerMots(phrases.texte1, T.texte1, 0.14);

    // ════ SCÈNE 2 : les notifications montent, la carte de trajet arrive ════
    tl.to("#pile", { y: -760, opacity: 0, duration: 0.6, ease: "power3.in" }, T.scene2);
    cacher("#texte1", T.scene2);
    const plan = $("plan");
    planDeVille(plan, 820, 640, "M-60 470 Q300 380 880 520");
    // Itinéraire bloqué (rouge qui clignote) sur le pont.
    svg(plan, "path", { d: "M90 120 Q230 140 300 300 Q340 420 470 450 Q620 480 740 600", fill: "none", stroke: "#fff", "stroke-width": 30, "stroke-linecap": "round" });
    const rouge = svg(plan, "path", { d: "M90 120 Q230 140 300 300 Q340 420 470 450 Q620 480 740 600", fill: "none", stroke: "#E10600", "stroke-width": 16, "stroke-linecap": "round", "stroke-dasharray": "2 26" });
    svg(plan, "circle", { cx: 90, cy: 120, r: 18, fill: "#0B1B4D" });
    svg(plan, "circle", { cx: 740, cy: 600, r: 22, fill: "#0B1B4D" });
    const auto = voitureDessus(plan, "#0B1B4D");
    auto.setAttribute("transform", "translate(318 340) rotate(62)");
    tl.fromTo("#carte", { opacity: 0, y: 260, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.4)" }, T.carte);
    tl.fromTo(rouge, { opacity: 1 }, { opacity: 0.25, duration: 0.3, repeat: 9, yoyo: true, ease: "sine.inOut" }, T.carte + 0.4);
    tl.fromTo("#badge40", { scale: 0, rotation: -12 }, { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.6)" }, T.carte + 0.6);
    tl.fromTo(auto, { x: 0 }, { keyframes: [{ x: 2, duration: 0.05 }, { x: -2, duration: 0.05 }, { x: 0, duration: 0.05 }], repeat: 6, repeatDelay: 0.3 }, T.carte + 0.8);
    montrerMots(phrases.texte2, T.texte2, 0.13);

    // ════ SCÈNE 3 : bascule plein écran bleu nuit ════
    tl.fromTo("#nuit", { clipPath: "circle(0% at 50% 100%)" }, { clipPath: "circle(150% at 50% 100%)", duration: 0.65, ease: "power3.inOut" }, T.bascule);
    tl.set(["#carte", "#texte2"], { opacity: 0 }, T.bascule + 0.65);
    montrerMots(phrases.texte3, T.texte3, 0.3);

    // ════ SCÈNE 4 : les trois étapes ════
    tl.to("#nuit", { clipPath: "circle(0% at 50% 0%)", duration: 0.55, ease: "power3.inOut" }, T.etapes - 0.1);
    tl.set("#texte3", { opacity: 0 }, T.etapes + 0.3);
    tl.set("#entete", { opacity: 1 }, T.etape[0]);
    tl.fromTo("#pastille", { scale: 0 }, { scale: 1, duration: 0.5, ease: "back.out(2.2)" }, T.etape[0]);
    tous("#pastille span").forEach((el, k) => {
      tl.fromTo(el, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: "back.out(1.8)", immediateRender: false }, T.etape[k]);
      if (k < 2) tl.to(el, { yPercent: -100, opacity: 0, duration: 0.3, ease: "power2.in" }, T.etape[k + 1] - 0.05);
      montrerMots(titres[k], T.etape[k] + 0.05, 0.12);
      const st = tous(".soustitre")[k];
      tl.fromTo(st, { opacity: 0, y: 20, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power2.out", immediateRender: false }, T.etape[k] + 0.3);
      if (k < 2) { cacher(titres[k], T.etape[k + 1] - 0.15, 0.2); cacher(st, T.etape[k + 1] - 0.15, 0.2); }
    });
    tl.fromTo("#ecran", { opacity: 0, y: 220, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.3)" }, T.etape[0]);

    // ① La conversation se tape en direct.
    tl.set("#chat", { opacity: 1 }, T.etape[0]);
    const message = $("bulle-moi").textContent;
    const frappe = { n: 0 };
    tl.fromTo(frappe, { n: 0 }, { n: message.length, duration: T.frappe[1] - T.frappe[0], ease: "none",
      onUpdate: () => { $("frappe").textContent = message.slice(0, Math.round(frappe.n)).slice(-26); } }, T.frappe[0]);
    tl.set("#frappe", { textContent: "" }, T.envoi + 0.05);
    tl.fromTo("#doigt", { opacity: 0, x: 980, y: 1500, scale: 1 }, { opacity: 1, x: 860, y: 1390, duration: 0.35, ease: "power2.out" }, T.envoi - 0.4);
    tl.to("#doigt", { scale: 0.75, duration: 0.08, yoyo: true, repeat: 1 }, T.envoi - 0.05);
    tl.to("#envoyer", { scale: 0.88, duration: 0.08, yoyo: true, repeat: 1 }, T.envoi - 0.05);
    tl.to("#doigt", { opacity: 0, duration: 0.25 }, T.envoi + 0.25);
    tl.fromTo("#bulle-moi", { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.8)", transformOrigin: "100% 100%" }, T.envoi);
    tl.fromTo("#points", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.2 }, T.envoi + 0.12);
    tous("#points i").forEach((p, i) => tl.fromTo(p, { y: 0 }, { y: -8, duration: 0.15, yoyo: true, repeat: 1, ease: "sine.inOut" }, T.envoi + 0.15 + i * 0.07));
    tl.set("#points", { display: "none" }, T.reponse);
    tl.fromTo("#bulle-lui", { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.8)", transformOrigin: "0% 100%" }, T.reponse);

    // ② La conversation devient une carte de trajet.
    const plan2 = $("plan2");
    planDeVille(plan2, 820, 820, null);
    const d2 = "M110 700 Q140 520 300 500 Q470 480 500 340 Q530 200 700 170";
    svg(plan2, "path", { d: d2, fill: "none", stroke: "#fff", "stroke-width": 34, "stroke-linecap": "round" });
    const bleu = svg(plan2, "path", { d: d2, fill: "none", stroke: "#3D5BD9", "stroke-width": 18, "stroke-linecap": "round" });
    const chemin = svg(plan2, "path", { d: d2, fill: "none", stroke: "none" });
    svg(plan2, "circle", { cx: 700, cy: 170, r: 26, fill: "#0B1B4D" });
    svg(plan2, "circle", { cx: 700, cy: 170, r: 10, fill: "#fff" });
    const nom = svg(plan2, "text", { x: 700, y: 120, "text-anchor": "middle", "font-family": "Inter", "font-weight": 700, "font-size": 30, fill: "#0B1B4D" });
    nom.textContent = "Bonapriso";
    const auto2 = voitureDessus(plan2, "#0B1B4D");
    const L = chemin.getTotalLength();
    bleu.setAttribute("stroke-dasharray", `${L} ${L}`);
    const course = { p: 0 };
    const majAuto2 = () => {
      const a = chemin.getPointAtLength(course.p * L), b = chemin.getPointAtLength(Math.min(L, course.p * L + 4));
      const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      auto2.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${ang})`);
      bleu.setAttribute("stroke-dashoffset", `${-course.p * L}`);
    };
    majAuto2();
    tl.to("#chat", { opacity: 0, scale: 0.94, filter: "blur(10px)", duration: 0.35 }, T.etape[1] - 0.1);
    tl.fromTo("#trajet", { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }, T.etape[1]);
    tl.fromTo(course, { p: 0 }, { p: 1, duration: T.trajet[1] - T.trajet[0], ease: "power1.inOut", onUpdate: majAuto2 }, T.trajet[0]);
    tl.fromTo("#arrive", { opacity: 0, y: 40, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2)" }, T.arrive);

    // ③ La carte devient l'intérieur du véhicule, les puces s'allument.
    tl.to("#trajet", { opacity: 0, scale: 0.94, filter: "blur(10px)", duration: 0.35 }, T.etape[2] - 0.1);
    tl.fromTo("#interieur", { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }, T.etape[2]);
    tl.fromTo("#interieur svg", { y: 0 }, { y: -18, duration: 2.6, ease: "sine.inOut" }, T.etape[2]);
    tl.fromTo("#mini-ecran", { opacity: 1 }, { opacity: 0.55, duration: 0.5, repeat: 5, yoyo: true }, T.etape[2]);
    tous(".puce").forEach((p, k) => {
      tl.fromTo(p, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }, T.etape[2] + 0.2 + k * 0.08);
      tl.to(p, { backgroundColor: "#22C55E", color: "#ffffff", scale: 1.08, duration: 0.18, ease: "power2.out" }, T.puces[k]);
      tl.to(p, { scale: 1, duration: 0.25, ease: "back.out(2)" }, T.puces[k] + 0.18);
      tl.to(p.querySelector("b"), { color: "#ffffff", duration: 0.18 }, T.puces[k]);
    });

    // ════ SCÈNE 5 : le téléphone glisse en avant ════
    cacher("#entete", T.telephone - 0.1, 0.3);
    tl.to("#ecran", { scale: 0.9, opacity: 0.35, filter: "blur(8px)", duration: 0.6, ease: "power2.out" }, T.telephone);
    tl.fromTo("#telephone", { opacity: 0, y: 520, scale: 0.86 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, T.telephone);
    montrerMots(phrases.texte5, T.texte5, 0.13);
    tl.fromTo("#badge5", { opacity: 0, y: 40, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2)" }, T.badge5);

    // ════ SCÈNE 6 : outro bleu nuit, logo qui se construit ════
    tl.fromTo("#outro", { opacity: 0, clipPath: "circle(0% at 50% 50%)" }, { opacity: 1, clipPath: "circle(120% at 50% 50%)", duration: 0.6, ease: "power3.inOut" }, T.outro);
    tl.fromTo("#logo-boite", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power3.out" }, T.outro + 0.2);
    tl.fromTo("#logo", { scale: 1.15, filter: "blur(12px)" }, { scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }, T.outro + 0.2);
    tl.fromTo("#reflet", { x: 0 }, { x: 1100, duration: 0.7, ease: "power2.inOut" }, T.outro + 0.8);
    montrerMots(phrases.slogan, T.slogan, 0.16);
    tl.fromTo("#contact", { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.8)" }, T.contact);
    // Retour au blanc : la dernière image raccorde avec la première (fond blanc vide).
    tl.fromTo("#retour", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(120% at 50% 50%)", duration: 0.28, ease: "power2.in" }, T.retour);

    // Horloge maîtresse : garantit la durée totale.
    tl.to({}, { duration: T.duree }, 0);
  };
})();
