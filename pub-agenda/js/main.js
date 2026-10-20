// « Pas une minute au volant » — JP Service Express Urbaine (23 s, 9:16, voix off fournie). Style Pop Énergie.
// Agenda qui se coche + mini plan, « 4 RENDEZ-VOUS », « ET PAS UNE SEULE MINUTE AU VOLANT », bascule bleu nuit
// « LE SECRET ? », chauffeur à la journée + puces + prix, phrase finale, outro confettis, retour à l'image 1.
// Timeline GSAP en pause, déterministe.

(function () {
  const NS = "http://www.w3.org/2000/svg";
  const svg = (parent, nom, attrs) => {
    const el = document.createElementNS(NS, nom);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    parent.appendChild(el);
    return el;
  };
  const alea = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const C = { jaune: "#FFD23F", turquoise: "#2EC4B6", bleu: "#3A86FF", creme: "#FFF8E7", nuit: "#0B1B4D", encre: "#1A1A2E" };
  // Les quatre arrêts du mini plan (coordonnées dans la carte, origine en haut à gauche).
  const ARRETS = [[130, 300, "Bonanjo"], [330, 130, "Bonapriso"], [560, 280, "Banque"], [740, 120, "Dîner"]];

  window.CONSTRUIRE = function (tl) {
    const T = window.T;
    const $ = (id) => document.getElementById(id);
    const tous = (sel, r = document) => Array.from(r.querySelectorAll(sel));
    gsap.set(".mot", { opacity: 0 });

    // Mot qui claque : arrive en grand, s'écrase, rebondit.
    const claque = (el, t) => {
      tl.fromTo(el, { opacity: 0, scale: 2.2, scaleY: 2.2 }, { opacity: 1, scale: 1, duration: 0.12, ease: "power4.in", immediateRender: false }, t);
      tl.fromTo(el, { scaleX: 1, scaleY: 1 }, { keyframes: [{ scaleX: 1.18, scaleY: 0.78, duration: 0.06 }, { scaleX: 0.94, scaleY: 1.08, duration: 0.08 }, { scaleX: 1, scaleY: 1, duration: 0.1 }], immediateRender: false }, t + 0.12);
    };
    const marqueur = (el, t) => tl.fromTo(el.querySelector(".marqueur"), { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: "power2.out", immediateRender: false }, t);
    const sticker = (sel, t) => tl.fromTo(sel, { opacity: 0, scale: 0, rotation: -30 }, { opacity: 1, scale: 1, rotation: 8, duration: 0.5, ease: "back.out(3)", immediateRender: false }, t);
    const flotte = (sel, t, d) => tl.fromTo(sel, { y: 0 }, { y: -18, rotation: -6, duration: d / 2, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, t);
    const fond = (couleur, t) => tl.set("#fond", { backgroundColor: couleur }, t);
    const punch = (t, f = 1.06) => tl.fromTo("#camera", { scale: f }, { scale: 1, duration: 0.35, ease: "power3.out", immediateRender: false }, t);
    // Balayage coloré : trois bandes obliques, la dernière a la couleur du fond suivant.
    const balayage = (t, couleurs) => tous(".balayage i").forEach((el, i) => {
      tl.set(el, { backgroundColor: couleurs[i] }, t);
      tl.fromTo(el, { x: 0 }, { x: 3000, duration: 0.55, ease: "power3.inOut", immediateRender: false }, t + i * 0.05);
    });

    // ════ HOOK : agenda, créneaux en cascade, coches, voiture qui saute ════
    const plan = $("plan");
    svg(plan, "rect", { width: 840, height: 430, fill: "#EAF6F4" });
    for (let x = -30; x < 840; x += 150) for (let y = -40; y < 430; y += 130) svg(plan, "rect", { x: x + 16, y: y + 16, width: 118, height: 98, rx: 18, fill: "#fff" });
    svg(plan, "path", { d: `M${ARRETS.map((a) => a.slice(0, 2).join(" ")).join(" L")}`, fill: "none", stroke: C.bleu, "stroke-width": 10, "stroke-dasharray": "4 22", "stroke-linecap": "round" });
    ARRETS.forEach(([x, y, nom], k) => {
      svg(plan, "circle", { cx: x, cy: y, r: 22, fill: C.encre, id: `arret${k}` });
      const t = svg(plan, "text", { x, y: y + 62, "text-anchor": "middle", "font-family": "Inter", "font-weight": 700, "font-size": 28, fill: C.encre });
      t.textContent = nom;
    });
    const posAuto = (k) => ({ x: ARRETS[k][0] - 38, y: ARRETS[k][1] - 80 });
    gsap.set("#auto", posAuto(0));
    const creneaux = tous(".creneau");
    const fonds = [C.jaune, C.turquoise, C.bleu, C.creme];
    creneaux.forEach((c, k) => {
      const t = T.creneaux[k];
      if (k) fond(fonds[k], t);
      // Le premier créneau est déjà là à l'image 1 (miniature lisible).
      if (k === 0) gsap.set(c, { opacity: 1 });
      else tl.fromTo(c, { opacity: 0, x: 120, scale: 0.9 }, { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: "back.out(2.2)", immediateRender: false }, t);
      if (k) punch(t, 1.04);
      const coche = c.querySelector("i");
      tl.to(coche, { backgroundColor: "#22C55E", borderColor: "#22C55E", color: "#fff", scale: 1.25, duration: 0.12 }, T.coches[k]);
      tl.to(coche, { scale: 1, duration: 0.3, ease: "back.out(3)" }, T.coches[k] + 0.12);
      tl.to(`#arret${k}`, { attr: { fill: "#22C55E", r: 26 }, duration: 0.2 }, T.coches[k]);
      if (k) {
        // Saut de la voiture vers l'arrêt suivant (arc).
        const a = posAuto(k - 1), b = posAuto(k);
        tl.to("#auto", { keyframes: [{ x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - 90, duration: 0.18, ease: "power2.out" }, { x: b.x, y: b.y, duration: 0.18, ease: "power2.in" }] }, T.coches[k] - 0.36);
        tl.fromTo("#auto", { scaleY: 1, scaleX: 1 }, { keyframes: [{ scaleY: 0.7, scaleX: 1.25, duration: 0.06 }, { scaleY: 1, scaleX: 1, duration: 0.15, ease: "back.out(3)" }], immediateRender: false }, T.coches[k]);
      }
    });
    tl.fromTo("#compteur", { scale: 1 }, { keyframes: [{ scale: 1.06, duration: 0.1 }, { scale: 1, duration: 0.2 }], repeat: 3, repeatDelay: 1.6, immediateRender: false }, T.coches[0]);
    tl.fromTo("#agenda", { y: 0 }, { y: -12, duration: 3.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);
    tl.set("#agenda", { opacity: 0 }, T.rdv[0] + 0.3);

    // ════ 4 RENDEZ-VOUS ════
    balayage(T.rdv[0] - 0.2, [C.bleu, C.jaune, C.turquoise]);
    fond(C.turquoise, T.rdv[0] + 0.1);
    tl.set("#rdv", { opacity: 1 }, T.rdv[0] + 0.25);
    claque("#quatre", T.rdv[1]);
    claque("#rendezvous", T.rdv[2]);
    sticker("#s-montre", T.rdv[1] + 0.2);
    flotte("#s-montre", T.rdv[1] + 0.7, 0.8);
    tl.set("#rdv", { opacity: 0 }, T.volant[0] + 0.25);

    // ════ ET PAS UNE SEULE MINUTE AU VOLANT ════
    balayage(T.volant[0] - 0.2, [C.jaune, C.creme, C.bleu]);
    fond(C.bleu, T.volant[0] + 0.1);
    tl.set("#volant", { opacity: 1 }, T.volant[0] + 0.25);
    tous("#volant .mot").forEach((m, i) => claque(m, T.volant[i + 1]));
    marqueur(tous("#volant .cle")[0], T.volant[7] + 0.15);
    sticker("#s-voiture", T.volant[5]);
    tl.fromTo("#zero", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(3)", immediateRender: false }, T.volant[7] + 0.1);
    punch(T.volant[7], 1.08);
    tl.set("#volant", { opacity: 0 }, T.bascule + 0.5);

    // ════ BASCULE bleu nuit : LE SECRET ? ════
    tl.fromTo("#nuit", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(120% at 50% 50%)", duration: 0.5, ease: "power3.inOut" }, T.bascule);
    tl.set("#secret", { opacity: 1 }, T.bascule + 0.2);
    tous("#secret .mot").forEach((m, i) => claque(m, T.secret[i]));
    marqueur(tous("#secret .cle")[0], T.secret[1]);
    tl.fromTo("#secret .pile-mots", { rotation: 0 }, { rotation: -3, duration: 0.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, T.secret[1]);
    tl.set("#secret", { opacity: 0 }, T.solution + 0.3);

    // ════ SOLUTION : chauffeur à la journée, puces, prix ════
    balayage(T.solution - 0.15, [C.turquoise, C.jaune, C.creme]);
    tl.set("#nuit", { clipPath: "circle(0% at 50% 50%)" }, T.solution + 0.3);
    fond(C.creme, T.solution + 0.15);
    tl.set("#solution", { opacity: 1 }, T.solution + 0.25);
    tl.fromTo("#solution .offre", { y: 300, scale: 0.9 }, { y: 0, scale: 1, duration: 0.6, ease: "back.out(1.6)" }, T.solution + 0.25);
    tl.fromTo("#s-chauffeur", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(3)" }, T.solution + 0.4);
    tous(".offre-titre .mot").forEach((m, i) => claque(m, T.carte[i]));
    marqueur(tous(".offre-titre .cle")[0], T.carte[5] + 0.15);
    fond(C.turquoise, T.puces[0]);
    tous(".puce").forEach((p, k) => {
      tl.fromTo(p, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.5)", immediateRender: false }, T.puces[k] - 0.05);
      tl.to(p, { backgroundColor: "#22C55E", color: "#ffffff", scale: 1.1, duration: 0.12 }, T.puces[k] + 0.1);
      tl.to(p, { scale: 1, duration: 0.3, ease: "back.out(3)" }, T.puces[k] + 0.22);
      tl.to(p.querySelector("b"), { color: "#ffffff", duration: 0.12 }, T.puces[k] + 0.1);
    });
    sticker("#s-valise", T.puces[0] + 0.1);
    sticker("#s-billets", T.prix + 0.1);
    flotte("#s-valise", T.puces[0] + 0.6, 1.4);
    fond(C.jaune, T.prix);
    tl.fromTo("#prix", { opacity: 0, y: 80, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(2.5)" }, T.prix);
    punch(T.prix, 1.05);
    tl.set("#solution", { opacity: 0 }, T.final + 0.25);

    // ════ TEXTE FINAL ════
    balayage(T.final - 0.15, [C.bleu, C.turquoise, C.jaune]);
    fond(C.jaune, T.final + 0.1);
    tl.set("#final", { opacity: 1 }, T.final + 0.2);
    tous("#final .mot").forEach((m, i) => claque(m, T.mots[i]));
    // Le mot clé est trop long pour 140 px : on l'ajuste à la largeur utile.
    tl.set("#final .cle", { fontSize: 104 }, 0);
    marqueur(tous("#final .cle")[0], T.mots[6] + 0.2);
    punch(T.mots[6], 1.07);
    tl.set("#final", { opacity: 0 }, T.outro + 0.25);

    // ════ OUTRO : confettis autour du logo, slogan, bouton qui pulse ════
    balayage(T.outro - 0.15, [C.jaune, C.turquoise, C.bleu]);
    fond(C.bleu, T.outro + 0.1);
    tl.set("#outro", { opacity: 1 }, T.outro + 0.2);
    tl.fromTo("#logo", { opacity: 0, scale: 0.4, rotation: -8 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2.2)" }, T.outro + 0.25);
    const zone = $("confettis");
    const couleurs = [C.jaune, C.turquoise, "#fff", "#FF8FAB", C.creme, "#E10600"];
    const conf = Array.from({ length: 70 }, (_, i) => {
      const d = document.createElement("div"); d.className = "confetti"; d.style.background = couleurs[i % couleurs.length]; zone.appendChild(d); return d;
    });
    const explosion = { t: 0 };
    tl.fromTo(explosion, { t: 0 }, { t: 2.6, duration: 2.6, ease: "none", onUpdate: () => {
      const t = explosion.t;
      conf.forEach((d, i) => {
        const a = alea(i) * Math.PI * 2, v = 600 + alea(i + 9) * 900;
        const x = 540 + Math.cos(a) * v * (1 - Math.exp(-t * 2.2)) / 1.6;
        const y = 760 + Math.sin(a) * v * (1 - Math.exp(-t * 2.2)) / 1.6 + 260 * t * t;
        d.style.transform = `translate(${x}px, ${y}px) rotate(${t * (300 + alea(i + 4) * 500)}deg) scaleY(${Math.cos(t * 6 + i)})`;
        d.style.opacity = t < 0.02 ? 0 : Math.max(0, 1 - t / 2.6);
      });
    } }, T.outro + 0.35);
    tous("#slogan .mot").forEach((m, i) => claque(m, T.slogan + i * 0.22));
    tl.fromTo("#contact", { opacity: 0, y: 60, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(2.4)" }, T.contact);
    tl.fromTo("#contact", { scale: 1 }, { scale: 1.06, duration: 0.3, yoyo: true, repeat: 5, ease: "sine.inOut", immediateRender: false }, T.contact + 0.5);

    // ════ RETOUR : un dernier balayage recouvre l'outro et découvre l'image 1 (agenda remis à zéro) ════
    balayage(T.retour - 0.05, [C.turquoise, C.bleu, C.jaune]);
    const r = T.retour + 0.2;
    fond(C.jaune, r);
    tl.set("#outro", { opacity: 0 }, r);
    tl.set("#agenda", { opacity: 1, y: 0 }, r);
    tl.set(creneaux.slice(1), { opacity: 0 }, r);
    tl.set(tous(".creneau i"), { backgroundColor: "rgba(0,0,0,0)", borderColor: "#e2e0d8", color: "rgba(0,0,0,0)", scale: 1 }, r);
    ARRETS.forEach((_, k) => tl.set(`#arret${k}`, { attr: { fill: C.encre, r: 22 } }, r));
    tl.set("#auto", { ...posAuto(0), scaleX: 1, scaleY: 1 }, r);
    tl.set("#camera", { scale: 1 }, r);

    tl.to({}, { duration: T.duree }, 0);
  };
})();
