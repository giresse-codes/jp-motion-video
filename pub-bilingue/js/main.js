// « Bienvenue à Douala / Welcome to Douala » — JP Service Express Urbaine (23,3 s, 9:16, style JP UI bilingue).
// Carte d'embarquement DLA + tampon, séjour en 4 cartes avec prix, carte de trajet Aéroport → Bonanjo → Akwa → Kribi,
// bascule bleu nuit, conversation en anglais, outro bilingue. Français en gros (bleu nuit), anglais dessous (gris, italique).
// Timeline GSAP en pause ; la voiture sur la carte est une fonction pure du temps.

(function () {
  const NS = "http://www.w3.org/2000/svg";
  const $ = (id) => document.getElementById(id);
  const svg = (parent, nom, attrs) => {
    const el = document.createElementNS(NS, nom);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    parent.appendChild(el);
    return el;
  };
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const lisse = (v) => v * v * (3 - 2 * v);

  // Bloc bilingue : FR mot par mot (« * » = mot clé en bleu vif), EN en une phrase dessous.
  function bilingue(el, { fr, en }) {
    el.innerHTML = "";
    const l1 = document.createElement("div"); l1.className = "fr"; el.appendChild(l1);
    const mots = fr.map(([, m]) => {
      const s = document.createElement("span");
      s.className = "mot" + (m.startsWith("*") ? " cle" : "");
      s.textContent = m.replace(/^\*/, "");
      l1.appendChild(s);
      return s;
    });
    const l2 = document.createElement("div"); l2.className = "en"; l2.textContent = en[1]; el.appendChild(l2);
    return { mots, en: l2 };
  }

  const ICONES = {
    avion: '<svg viewBox="0 0 64 64"><path d="M6 36 L26 30 L38 8 L46 10 L40 30 L56 26 L60 32 L40 40 L46 56 L40 58 L28 42 L8 44 Z" fill="#fff"/></svg>',
    hotel: '<svg viewBox="0 0 64 64"><g fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"><path d="M8 50 V18 M8 36 H56 V50 M8 44 H56"/><path d="M14 36 V30 Q14 26 18 26 H26 Q30 26 30 30 V36"/><path d="M32 36 V28 Q32 24 36 24 H50 Q56 24 56 30 V36"/></g></svg>',
    mallette: '<svg viewBox="0 0 64 64"><g fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"><rect x="8" y="20" width="48" height="34" rx="6"/><path d="M24 20 V14 Q24 10 28 10 H36 Q40 10 40 14 V20 M8 34 H56"/></g></svg>',
    palmier: '<svg viewBox="0 0 64 64"><g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M32 58 Q34 40 30 22"/><path d="M30 22 Q18 12 6 18 M30 22 Q42 10 56 16 M30 22 Q22 26 16 38 M30 22 Q42 26 46 38"/><path d="M8 58 H56"/></g></svg>',
  };
  const SEJOUR = [
    { fr: "Aéroport", en: "Airport", prix: "8 000 F", sous: "", icone: "avion" },
    { fr: "Hôtel", en: "Hotel", prix: "", sous: "", icone: "hotel" },
    { fr: "Réunions", en: "Meetings", prix: "2 500 F/h", sous: "per hour", icone: "mallette" },
    { fr: "Kribi", en: "Weekend", prix: "50 000 F/jour", sous: "per day", icone: "palmier" },
  ];

  window.CONSTRUIRE = function (tl) {
    const T = window.T;

    // ---------- Construction ----------
    const hook = bilingue($("t-hook"), T.hook);
    const blocs2 = T.textes2.map((t) => { const d = document.createElement("div"); d.className = "bi"; $("t-sejour").appendChild(d); return { d, ...bilingue(d, t) }; });
    const nuit = bilingue($("t-nuit"), T.texte4);
    const fin = bilingue($("t-outro"), T.texte6);
    gsap.set([blocs2.map((b) => [b.mots, b.en]), nuit.mots, nuit.en, fin.mots, fin.en], { opacity: 0 });
    const cartes = SEJOUR.map((c, i) => {
      const d = document.createElement("div"); d.className = "sejour"; d.style.top = i * 196 + "px";
      d.innerHTML = `<i class="ico">${ICONES[c.icone]}</i><div class="noms"><b>${c.fr}</b><em>${c.en}</em></div><div class="prix">${c.prix}${c.sous ? `<em>${c.sous}</em>` : ""}</div>`;
      $("pile").appendChild(d);
      return d;
    });

    // Carte de trajet stylisée de Douala
    const plan = $("plan");
    svg(plan, "rect", { width: 820, height: 760, fill: "#EEF1F6" });
    for (let x = -40; x < 820; x += 150) for (let y = -30; y < 760; y += 130) svg(plan, "rect", { x: x + 16, y: y + 16, width: 118, height: 98, rx: 16, fill: "#fff" });
    svg(plan, "path", { d: "M-40 120 Q160 60 260 150 Q330 220 300 330 Q280 420 120 470 L-40 520", fill: "none", stroke: "#C9DAFF", "stroke-width": 70, "stroke-linecap": "round" });
    const d = "M700 560 Q560 520 470 450 Q400 400 330 380 Q380 300 420 220 Q300 420 200 560 L120 720";
    svg(plan, "path", { d, fill: "none", stroke: "#fff", "stroke-width": 30, "stroke-linecap": "round", "stroke-linejoin": "round" });
    const route = svg(plan, "path", { d, fill: "none", stroke: "#3D5BD9", "stroke-width": 14, "stroke-linecap": "round", "stroke-linejoin": "round" });
    const L = route.getTotalLength();
    route.style.strokeDasharray = L; route.style.strokeDashoffset = L;
    const etapes = [[700, 560, "Aéroport", "Airport"], [330, 380, "Bonanjo", ""], [420, 220, "Akwa", ""], [120, 720, "Kribi →", "Kribi road"]];
    const reperes = etapes.map(([x, y, n, e]) => {
      const g = svg(plan, "g", {});
      svg(g, "circle", { cx: x, cy: y, r: 16, fill: "#fff", stroke: "#0B1B4D", "stroke-width": 7 });
      const lx = x > 600 ? x - 30 : x + 28, anc = x > 600 ? "end" : "start";
      const t = svg(g, "text", { x: lx, y: y - 22, "text-anchor": anc, "font-family": "Inter", "font-weight": 700, "font-size": 36, fill: "#0B1B4D" }); t.textContent = n;
      if (e) { const t2 = svg(g, "text", { x: lx, y: y + 16, "text-anchor": anc, "font-family": "Inter", "font-weight": 600, "font-style": "italic", "font-size": 26, fill: "#8A909C" }); t2.textContent = e; }
      return g;
    });
    const auto = svg(plan, "g", {});
    svg(auto, "rect", { x: -30, y: -16, width: 60, height: 32, rx: 10, fill: "#0B1B4D" });
    svg(auto, "rect", { x: 4, y: -11, width: 14, height: 22, rx: 4, fill: "rgba(255,255,255,.55)" });

    // ---------- Horloge : la voiture suit l'itinéraire ----------
    function maj(t) {
      const p = lisse(clamp((t - (T.carte + 0.5)) / (T.bascule - T.carte - 0.6)));
      const a = route.getPointAtLength(L * p), b = route.getPointAtLength(Math.min(L, L * p + 2));
      auto.setAttribute("transform", `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${(Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI).toFixed(1)})`);
      route.style.strokeDashoffset = (L * (1 - lisse(clamp((t - T.carte - 0.2) / 0.9)))).toFixed(1);
    }
    const horloge = { t: 0 };
    tl.to(horloge, { t: T.duree, duration: T.duree, ease: "none", onUpdate: () => maj(horloge.t) }, 0);
    maj(0);

    // ---------- Animations ----------
    const montrer = (bloc, texte) => {
      bloc.mots.forEach((m, i) => tl.fromTo(m, { opacity: 0, y: 20, filter: "blur(14px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out", immediateRender: false }, texte.fr[i][0]));
      tl.fromTo(bloc.en, { opacity: 0, y: 20, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power3.out", immediateRender: false }, texte.en[0]);
    };
    [[0, T.scene2], [T.scene2, T.bascule], [T.telephone, T.outro], [T.outro, T.retour]].forEach(([a, b], i) => {
      tl.fromTo("#camera", { scale: 1 }, { scale: 1.05, duration: b - a, ease: "none", immediateRender: i === 0 }, a);
    });

    // 1. Hook : la carte d'embarquement glisse, tampon BIENVENUE / WELCOME
    tl.fromTo("#billet", { x: 0, rotation: -2 }, { x: -24, rotation: 1, duration: T.scene2, ease: "sine.inOut", immediateRender: true }, 0);
    tl.fromTo("#tampon", { opacity: 0, scale: 2.2, rotation: -40 }, { opacity: 1, scale: 1, rotation: -14, duration: 0.35, ease: "power4.in", immediateRender: false }, 0.3);
    tl.to("#billet", { y: 8, duration: 0.06, yoyo: true, repeat: 1 }, 0.65);

    // 2. Séjour : 4 cartes qui s'empilent, l'anglais s'allume en écho
    tl.to("#s-hook", { y: -160, opacity: 0, duration: 0.45, ease: "power3.in" }, T.scene2);
    tl.set("#s-sejour", { opacity: 1 }, T.scene2 + 0.1);
    T.textes2.forEach((t, k) => { montrer(blocs2[k], t); tl.to(blocs2[k].d, { opacity: 0, y: -24, filter: "blur(8px)", duration: 0.3, ease: "power2.in" }, t.fin); });
    cartes.forEach((c, i) => {
      tl.fromTo(c, { opacity: 0, x: 260, scale: 0.9 }, { opacity: 1, x: 0, scale: 1, duration: 0.55, ease: "back.out(1.6)", immediateRender: false }, T.cartes[i] - 0.1);
      tl.to(c.querySelector("em"), { color: "#3D5BD9", duration: 0.25 }, T.echos[i]);
      tl.to(c, { scale: 1.04, duration: 0.18, yoyo: true, repeat: 1, ease: "sine.inOut" }, T.echos[i]);
    });

    // 3. Carte de trajet
    tl.to("#pile", { y: -200, opacity: 0, duration: 0.45, ease: "power3.in" }, T.carte - 0.2);
    tl.fromTo("#carte", { opacity: 0, y: 400 }, { opacity: 1, y: 0, duration: 0.65, ease: "back.out(1.3)", immediateRender: false }, T.carte);
    reperes.forEach((g, i) => tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, T.carte + 0.4 + i * 0.5));

    // 4. Bascule bleu nuit
    tl.fromTo("#nuit", { clipPath: "circle(0% at 50% 100%)" }, { clipPath: "circle(150% at 50% 100%)", duration: 0.6, ease: "power3.inOut", immediateRender: false }, T.bascule);
    montrer(nuit, T.texte4);
    tl.fromTo("#t-nuit", { scale: 1 }, { scale: 1.04, duration: T.telephone - T.bascule, ease: "none", immediateRender: false }, T.bascule);

    // 5. Téléphone : conversation en anglais
    tl.set("#s-sejour", { opacity: 0 }, T.telephone - 0.1);
    tl.set("#s-tel", { opacity: 1 }, T.telephone - 0.1);
    tl.to("#nuit", { clipPath: "circle(0% at 50% 50%)", duration: 0.5, ease: "power3.inOut" }, T.telephone - 0.05);
    tl.fromTo("#telephone", { y: 500 }, { y: 0, duration: 0.7, ease: "back.out(1.3)", immediateRender: false }, T.telephone + 0.05);
    tl.fromTo("#msg", { opacity: 0, y: 30, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, transformOrigin: "100% 100%", duration: 0.4, ease: "back.out(2)", immediateRender: false }, T.message);
    tl.fromTo("#points", { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, T.ecrit[0]);
    document.querySelectorAll("#points i").forEach((p, i) => tl.fromTo(p, { opacity: 0.25 }, { opacity: 1, duration: 0.25, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, T.ecrit[0] + i * 0.12));
    tl.set("#points", { display: "none" }, T.ecrit[1]);
    tl.fromTo("#rep", { opacity: 0, y: 30, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, transformOrigin: "0% 100%", duration: 0.45, ease: "back.out(2)", immediateRender: false }, T.reponse);
    tl.fromTo("#rep .ok", { scale: 1 }, { scale: 1.12, duration: 0.18, yoyo: true, repeat: 1, immediateRender: false }, T.reponse + 0.45);

    // 6. Outro bilingue
    tl.fromTo("#outro", { opacity: 0 }, { opacity: 1, duration: 0.35, immediateRender: false }, T.outro);
    tl.fromTo("#logo", { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)", immediateRender: false }, T.outro + 0.05);
    montrer(fin, T.texte6);
    tl.fromTo("#contact", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)", immediateRender: false }, T.contact);
    tl.to("#contact", { scale: 1.04, duration: 0.25, yoyo: true, repeat: 1, ease: "sine.inOut" }, T.contact + 1.2);

    // Retour vers la carte d'embarquement (boucle)
    tl.fromTo("#retour", { clipPath: "circle(0% at 50% 50%)", opacity: 1 }, { clipPath: "circle(150% at 50% 50%)", duration: 0.2, ease: "power3.in", immediateRender: false }, T.retour);
    const r0 = T.retour + 0.2;
    tl.set(["#outro", "#s-tel"], { opacity: 0 }, r0);
    tl.set("#s-hook", { y: 0, opacity: 1 }, r0);
    tl.set("#billet", { x: 0, rotation: -2, y: 0 }, r0);
    tl.set("#tampon", { opacity: 0 }, r0);
    tl.set("#camera", { scale: 1 }, r0);
    tl.to("#retour", { opacity: 0, duration: T.duree - r0, ease: "power1.out" }, r0);
  };
})();
