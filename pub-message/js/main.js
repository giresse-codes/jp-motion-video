// « Un seul message » — JP PREMIUM, 20 s, 9:16. Voir frame.md. Langage visuel repris de la référence (pas son contenu) :
// fond noir bleuté et lueurs qui respirent, trait de lumière, bulle WhatsApp qui devient un téléphone 3D incliné,
// mots-clés d'un seul mot, carte de Douala avec un arc A → B, cartes 3D qui se retournent, compteur de prix,
// cadre lumineux sur une silhouette de voiture, explosion de rayons fins sur le logo, point bleu qui s'éteint.
// Tout est piloté par la timeline (sûr au seek) ; les textes qui changent sont des fonctions pures du temps.
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const BLEU = "#2F6BFF", BLEU_C = "#8FB0FF", BLANC = "#F4F7FF", VERT = "#2ED47A";
  const NBSP = String.fromCharCode(160);
  const el = (parent, tag, attrs = {}) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    parent.appendChild(e);
    return e;
  };
  const insecable = (s) => s.replace(/(\d) (\d{3})/g, "$1" + NBSP + "$2").replace(/ ([?!:;])/g, NBSP + "$1");
  const milliers = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  const $ = (s) => document.querySelector(s);

  // Petites icônes au trait (cartes ÉCO / CONFORT)
  const ICONES = {
    voiture: '<path d="M6 32v-6l4-9c1-2 2-3 5-3h18c3 0 4 1 5 3l4 9v6Z"/><circle cx="14" cy="33" r="4"/><circle cx="34" cy="33" r="4"/>',
    ecran: '<rect x="6" y="10" width="36" height="24" rx="4"/><path d="M18 40h12"/><path d="M21 17l9 5-9 5Z" fill="#8FB0FF"/>',
    wifi: '<path d="M8 20a23 23 0 0 1 32 0M13 26a15 15 0 0 1 22 0M18 32a8 8 0 0 1 12 0"/><circle cx="24" cy="37" r="2.5" fill="#F4F7FF"/>',
    clim: '<path d="M24 6v36M8.4 15l31.2 18M8.4 33l31.2-18M19 10l5 4 5-4M19 38l5-4 5 4"/>',
    porte: '<path d="M12 42V8h20v34"/><path d="M32 8l8 4v30l-8-2" fill="rgba(143,176,255,.25)"/><circle cx="28" cy="26" r="1.8" fill="#F4F7FF"/>',
  };
  const icone = (nom, label) => `<div><span><svg viewBox="0 0 48 48" width="58" height="58" fill="none" stroke="#F4F7FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${ICONES[nom]}</svg></span>${label}</div>`;

  window.CONSTRUIRE = function (tl) {
    const T = window.T;
    const D = T.duree;

    // ── Fond : lueurs qui respirent, particules lentes, grain (fonctions du temps) ──
    tl.fromTo("#lueur1", { scale: 0.9, opacity: 0.55 }, { scale: 1.15, opacity: 1, duration: 2.4, yoyo: true, repeat: Math.ceil(D / 2.4), ease: "sine.inOut", immediateRender: true }, 0);
    tl.fromTo("#lueur2", { scale: 1.1, opacity: 0.9 }, { scale: 0.88, opacity: 0.5, duration: 2.9, yoyo: true, repeat: Math.ceil(D / 2.9), ease: "sine.inOut", immediateRender: true }, 0);
    const zp = $("#particules"), parts = [];
    for (let i = 0; i < 40; i++) { const p = document.createElement("div"); p.className = "particule"; zp.appendChild(p); parts.push(p); }
    const grain = $(".grain");

    // ── Sous-titres mot par mot (temps des phrases mesurés, mots répartis au prorata de leur longueur) ──
    const zs = $("#sous-titres"), phrases = [];
    T.phrases.forEach(([a, z, texte], k) => {
      const mots = insecable(texte).split(" ");
      const total = mots.reduce((s, m) => s + m.length, 0);
      let t = a;
      const spans = mots.map((m) => { const s = document.createElement("span"); s.className = "st"; s.textContent = m; const d = ((z - a) * m.length) / total; const r = { s, a: t }; t += d; return r; });
      const fin = Math.min(z + 0.7, T.phrases[k + 1] ? T.phrases[k + 1][0] - 0.08 : z + 0.9);
      phrases.push({ spans, a, fin });
    });
    const sousTitres = (t) => {
      const ph = phrases.find((p) => t >= p.a - 0.05 && t < p.fin);
      if (zs._ph !== ph) { zs.textContent = ""; if (ph) ph.spans.forEach(({ s }) => zs.appendChild(s)); zs._ph = ph; }
      if (ph) ph.spans.forEach(({ s, a }) => { const k = Math.min(1, Math.max(0, (t - a) / 0.12)); s.style.opacity = k; s.style.transform = `translateY(${(1 - k) * 14}px)`; s.style.color = t < a + 0.25 ? BLEU_C : BLANC; });
    };

    // ── Mot-clé d'un seul mot (Réserve. / Confirme. / Roule.) ──
    const MOTS = [[T.reserve, "Réserve."], [T.confirme, "Confirme."], [T.roule, "Roule."]];
    const mot = $("#mot");
    MOTS.forEach(([a], i) => tl.fromTo(mot, { scale: 1.5, opacity: 0, filter: "blur(14px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.28, ease: "back.out(2.2)", immediateRender: false }, a));
    tl.to(mot, { opacity: 0, y: -30, duration: 0.25 }, 5.8);

    // ── Compteur de prix ──
    const num = $("#prix-num"), nomPrix = $("#prix-nom");
    const prix = (t) => {
      const confort = t >= 9.5;
      const pas = (confort ? T.pasConfort : T.pasEco).filter((p) => t >= p).length;
      return { nom: confort ? "CONFORT" : "ÉCO", v: (confort ? 4000 : 3000) - pas * 100 };
    };

    // ── Carte de Douala : arc A → B et voiture qui le suit ──
    const svg = $("#svg-carte");
    el(svg, "rect", { width: 500, height: 1000, fill: "#070C26" });
    for (let x = 40; x < 500; x += 92) el(svg, "path", { d: `M${x} 0 L${x + 30} 1000`, stroke: "rgba(143,176,255,.10)", "stroke-width": 10 });
    for (let y = 60; y < 1000; y += 110) el(svg, "path", { d: `M0 ${y} L500 ${y - 20}`, stroke: "rgba(143,176,255,.08)", "stroke-width": 8 });
    el(svg, "path", { d: "M-20 560 Q160 520 260 600 Q360 680 520 640", stroke: "rgba(47,107,255,.35)", "stroke-width": 46, fill: "none" });
    el(svg, "text", { x: 250, y: 200, "text-anchor": "middle", "font-family": "Inter", "font-weight": 700, "font-size": 26, "letter-spacing": 8, fill: "rgba(143,176,255,.6)" }).textContent = "DOUALA";
    const A = [120, 800], B = [380, 300], Cq = [60, 380];
    el(svg, "path", { d: `M${A} Q${Cq} ${B}`, stroke: "rgba(143,176,255,.18)", "stroke-width": 6, fill: "none", "stroke-dasharray": "4 14", "stroke-linecap": "round" });
    const arc = el(svg, "path", { d: `M${A} Q${Cq} ${B}`, stroke: BLEU_C, "stroke-width": 7, fill: "none", "stroke-linecap": "round", pathLength: 1, "stroke-dasharray": "1 1", "stroke-dashoffset": 1, style: "filter: drop-shadow(0 0 8px #2F6BFF)" });
    [[A, "A"], [B, "B"]].forEach(([[x, y], l]) => { el(svg, "circle", { cx: x, cy: y, r: 22, fill: BLEU, stroke: "#fff", "stroke-width": 5 }); el(svg, "text", { x, y: y + 9, "text-anchor": "middle", "font-family": "Poppins", "font-weight": 800, "font-size": 24, fill: "#fff" }).textContent = l; });
    const auto = el(svg, "g", { opacity: 0 });
    el(auto, "rect", { x: -26, y: -16, width: 52, height: 32, rx: 10, fill: "#fff" });
    el(auto, "rect", { x: 8, y: -12, width: 12, height: 24, rx: 4, fill: BLEU });
    const quad = (p) => { const m = 1 - p; return [m * m * A[0] + 2 * m * p * Cq[0] + p * p * B[0], m * m * A[1] + 2 * m * p * Cq[1] + p * p * B[1]]; };
    const posAuto = (t) => {
      const [a, z] = T.arc, p = Math.min(1, Math.max(0, (t - a) / (z - a))), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const [x, y] = quad(e), [x2, y2] = quad(Math.min(1, e + 0.01));
      auto.setAttribute("transform", `translate(${x} ${y}) rotate(${(Math.atan2(y2 - y, x2 - x) * 180) / Math.PI})`);
    };

    // ── Horloge unique : fonctions pures du temps ──
    const temps = { t: 0 };
    const horloge = (t) => {
      parts.forEach((p, i) => { const x = (i * 263) % 1080 + Math.sin(t * 0.5 + i) * 20, y = 1920 - (((i * 397) % 1920) + t * (14 + (i % 5) * 6)) % 1920; p.style.transform = `translate(${x}px, ${y}px)`; p.style.opacity = 0.25 + 0.35 * Math.sin(t * 1.3 + i); });
      const f = Math.floor(t * 30); grain.style.transform = `translate(${((f * 37) % 40) - 20}px, ${((f * 53) % 40) - 20}px)`;
      sousTitres(t);
      mot.textContent = (MOTS.filter(([a]) => t >= a).pop() || MOTS[0])[1];
      const { nom, v } = prix(t); nomPrix.textContent = nom; num.textContent = milliers(v) + NBSP + "F";
      posAuto(t);
    };
    horloge(0);
    tl.fromTo(temps, { t: 0 }, { t: D, duration: D, ease: "none", onUpdate: () => horloge(temps.t), immediateRender: true }, 0);

    // ── 1. Noir, lueur qui s'ouvre, bulle WhatsApp, trait de lumière ──
    tl.fromTo("#halo", { scale: 0.15, opacity: 0 }, { scale: 0.55, opacity: 0.7, duration: 1.1, ease: "power2.out", immediateRender: true }, 0);
    tl.fromTo("#trait", { scaleX: 0, opacity: 1, rotation: -2 }, { scaleX: 1, duration: 0.7, ease: "power3.out", immediateRender: true }, T.ligne);
    tl.fromTo("#tel", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.5)", immediateRender: false }, T.bulle);
    tl.to("#tel", { y: -10, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, T.bulle + 0.45);

    // ── 2. Le halo grandit, la bulle devient un téléphone 3D incliné de 8° qui flotte ──
    const TP = T.telephone;
    tl.to("#halo", { scale: 1.1, opacity: 0.55, duration: 0.8, ease: "power2.out" }, TP);
    tl.to("#trait", { opacity: 0, duration: 0.4 }, TP + 0.2);
    tl.to("#bulle-wa", { opacity: 0, scale: 0.6, duration: 0.2 }, TP);
    tl.to("#tel", { width: 500, height: 1000, marginLeft: -250, marginTop: -500, borderRadius: 66, rotation: -8, rotationY: -14, rotationX: 8, duration: 0.6, ease: "back.out(1.4)" }, TP);
    tl.fromTo("#ecran", { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, TP + 0.4);
    tl.to("#tel", { y: -18, duration: 1.2, yoyo: true, repeat: 3, ease: "sine.inOut" }, TP + 0.6);

    // ── 3. « Réserve. » + bulle client, « Confirme. » + bulle JP avec pastille verte ──
    tl.fromTo("#b-client", { opacity: 0, y: 30, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, T.client);
    tl.fromTo("#b-points", { opacity: 0 }, { opacity: 1, duration: 0.15, immediateRender: false }, T.client + 0.45);
    tl.to("#b-points i", { y: -8, duration: 0.12, yoyo: true, repeat: 3, stagger: 0.06 }, T.client + 0.5);
    tl.to("#b-points", { opacity: 0, duration: 0.1 }, T.jp - 0.05);
    tl.fromTo("#b-jp", { opacity: 0, y: 30, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(2.4)", immediateRender: false }, T.jp);
    tl.fromTo("#b-jp .ok", { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, T.jp + 0.1);

    // ── 4. « Roule. » : le téléphone bascule sur la carte de Douala, l'arc se trace, la voiture le suit ──
    tl.to("#tel", { rotationY: 76, duration: 0.18, ease: "power2.in" }, T.roule);
    tl.set("#chat", { opacity: 0 }, T.roule + 0.18);
    tl.set("#carte", { opacity: 1 }, T.roule + 0.18);
    tl.fromTo("#tel", { rotationY: -104 }, { rotationY: -14, duration: 0.35, ease: "back.out(1.4)", immediateRender: false }, T.roule + 0.18);
    tl.fromTo(arc, { attr: { "stroke-dashoffset": 1 } }, { attr: { "stroke-dashoffset": 0 }, duration: T.arc[1] - T.arc[0], ease: "power1.inOut", immediateRender: false }, T.arc[0]);
    tl.fromTo(auto, { opacity: 0 }, { opacity: 1, duration: 0.15, immediateRender: false }, T.arc[0]);
    tl.to("#tel", { scale: 0.3, y: -300, opacity: 0, duration: 0.3, ease: "power2.in" }, 5.82);
    tl.to("#halo", { scale: 0.8, opacity: 0.4, duration: 0.5 }, 5.9);

    // ── 5. Deux cartes 3D qui se retournent : ÉCO puis CONFORT ──
    const zc = $("#cartes");
    [["ÉCO", ["voiture", "Voiture"], ["ecran", "Mini écran"]], ["CONFORT", ["wifi", "Wi-Fi"], ["clim", "Clim"], ["porte", "Porte ouverte"]]].forEach(([nom, ...ics], k) => {
      const c = document.createElement("div"); c.className = "carte3d"; c.style.top = (430 + k * 450) + "px";
      c.innerHTML = `<div class="face"><h3>${nom}</h3><div class="icones">${ics.map(([n, l]) => icone(n, l)).join("")}</div><i class="reflet"></i></div><div class="face dos"><img src="assets/images/logo-transparent.png" alt="" /></div>`;
      zc.appendChild(c);
      const a = k ? T.confort : T.eco;
      // Pas d'opacité sur la carte : elle aplatirait la 3D (le dos et la face se verraient en même temps)
      tl.set(c, { visibility: "visible" }, a - 0.3);
      tl.fromTo(c, { rotationY: 180, rotationX: 10, y: 300, scale: 0.6, transformPerspective: 1600 }, { y: 0, scale: 1, duration: 0.3, ease: "back.out(1.6)", immediateRender: false }, a - 0.3);
      tl.to(c, { rotationY: 0, rotationX: 0, duration: 0.6, ease: "back.out(1.6)" }, a);
      tl.fromTo(c.querySelector(".reflet"), { left: -200 }, { left: 900, duration: 0.6, ease: "power2.inOut", immediateRender: false }, a + 0.45);
      tl.to(c, { y: -10, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, a + 0.6);
      tl.to(c, { x: k ? 1100 : -1100, rotationY: k ? -30 : 30, duration: 0.35, ease: "power2.in" }, 7.45 + k * 0.06);
      tl.set(c, { visibility: "hidden" }, 7.85);
    });

    // ── 6. Compteur : 3 000 F → 2 500 F, 4 000 F → 3 500 F, pastilles, « GRANDE PROMO » ──
    tl.fromTo(["#prix-nom", "#prix-num"], { opacity: 0, scale: 0.6, filter: "blur(16px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.35, ease: "back.out(2)", immediateRender: false }, T.compteur);
    [...T.pasEco, ...T.pasConfort].forEach((p) => tl.fromTo("#prix-num", { y: -16 }, { y: 0, duration: 0.14, ease: "power2.out", immediateRender: false }, p));
    const claque = (t) => tl.fromTo("#tag", { opacity: 0, scale: 2.2, rotation: -10 }, { opacity: 1, scale: 1, rotation: -3, duration: 0.25, ease: "back.out(3)", immediateRender: false }, t);
    claque(T.tag1);
    tl.to("#tag", { opacity: 0, scale: 0.8, duration: 0.2 }, 9.42);
    tl.fromTo("#prix-nom", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.25, immediateRender: false }, 9.5);
    tl.to("#prix-num", { keyframes: [{ scale: 0.85, opacity: 0.4, duration: 0.08 }, { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(2)" }] }, 9.45);
    claque(T.tag2);
    T.pastilles.forEach((a, i) => tl.fromTo("#past" + (i + 1), { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(2)", immediateRender: false }, a));
    tl.fromTo("#badge", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.5)", immediateRender: false }, T.badge);
    tl.to("#badge", { scale: 1.07, duration: 0.18, yoyo: true, repeat: 3, ease: "sine.inOut" }, T.badge + 0.3);
    tl.to("#prix", { opacity: 0, scale: 0.94, duration: 0.35, ease: "power2.in" }, T.silhouette - 0.1);

    // ── 7. Tout s'éteint sauf un cadre lumineux qui se referme sur la silhouette d'une voiture noire ──
    const sa = $("#svg-auto");
    el(sa, "path", { d: "M40 210 L44 160 Q50 132 90 126 L200 112 L290 52 Q312 38 344 38 L500 38 Q530 38 550 58 L610 112 Q662 120 668 152 L672 210Z", fill: "#04060F", stroke: "rgba(143,176,255,.75)", "stroke-width": 3 });
    el(sa, "path", { d: "M300 62 L370 62 L370 112 L230 112Z M384 62 L500 62 Q512 62 522 74 L556 112 L384 112Z", fill: "#0B1230" });
    [170, 540].forEach((cx) => { el(sa, "circle", { cx, cy: 212, r: 44, fill: "#02030A", stroke: "rgba(143,176,255,.6)", "stroke-width": 3 }); el(sa, "circle", { cx, cy: 212, r: 16, fill: "#0B1230" }); });
    el(sa, "path", { d: "M660 140 L672 150", stroke: "#fff", "stroke-width": 6, "stroke-linecap": "round" });
    el(sa, "circle", { cx: 52, cy: 150, r: 6, fill: "#E3141B" });
    tl.to("#halo", { opacity: 0.12, duration: 0.4 }, T.silhouette);
    tl.fromTo("#silhouette", { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, T.silhouette);
    tl.fromTo("#cadre", { scale: 1.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.0, ease: "power3.inOut", immediateRender: false }, T.cadre - 0.6);
    tl.fromTo("#svg-auto", { scale: 0.92, x: -40 }, { scale: 1.04, x: 20, duration: 2.0, ease: "sine.inOut", immediateRender: false }, T.silhouette);
    tl.to("#cadre", { boxShadow: "0 0 60px rgba(143,176,255,1), inset 0 0 50px rgba(47,107,255,.8)", duration: 0.3, yoyo: true, repeat: 1 }, T.cadre + 0.5);

    // ── 8. Explosion de lumière (rayons fins), logo, slogan, WhatsApp, Douala ──
    const E = T.explosion, zr = $("#rayons");
    for (let i = 0; i < 64; i++) {
      const r = document.createElement("div"); r.className = "rayon"; zr.appendChild(r);
      const l = 0.55 + ((i * 37) % 45) / 100;
      tl.fromTo(r, { rotation: (i * 360) / 64 + (i % 3) * 2, scaleX: 0, opacity: 1 }, { scaleX: l, opacity: 0, duration: 0.9, ease: "power3.out", immediateRender: false }, E + (i % 4) * 0.02);
    }
    tl.to("#silhouette", { opacity: 0, scale: 1.2, duration: 0.25 }, E - 0.05);
    tl.fromTo("#halo", { scale: 0.3, opacity: 1 }, { scale: 1.3, opacity: 0.45, duration: 0.9, ease: "power2.out", immediateRender: false }, E);
    tl.fromTo("#logo", { opacity: 0, scale: 0.7, filter: "blur(18px) drop-shadow(0 0 30px rgba(47,107,255,.6))" }, { opacity: 1, scale: 1, filter: "blur(0px) drop-shadow(0 0 30px rgba(47,107,255,.6))", duration: 0.6, ease: "back.out(1.6)", immediateRender: false }, E + 0.05);
    tl.to("#logo", { y: -10, duration: 1.3, yoyo: true, repeat: 3, ease: "sine.inOut" }, E + 0.7);
    document.querySelectorAll("#slogan span").forEach((s, i) => tl.fromTo(s, { opacity: 0, y: 40, scale: 1.3 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(2.5)", immediateRender: false }, T.slogan[i]));
    tl.fromTo("#wa", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35, ease: "back.out(2)", immediateRender: false }, T.whatsapp);
    tl.fromTo("#douala", { opacity: 0, letterSpacing: "0.8em" }, { opacity: 1, letterSpacing: "0.4em", duration: 0.5, ease: "power2.out", immediateRender: false }, T.douala);

    // ── 9. Un point bleu qui s'éteint ──
    tl.to(["#fin", "#halo"], { opacity: 0, duration: 0.35, ease: "power2.in" }, T.point - 0.05);
    tl.to(["#lueur1", "#lueur2", "#particules"], { opacity: 0, duration: 0.6 }, T.point);
    tl.fromTo("#point", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2)", immediateRender: false }, T.point + 0.1);
    tl.to("#point", { scale: 1.4, duration: 0.2, yoyo: true, repeat: 1, ease: "sine.inOut" }, T.point + 0.35);
    tl.to("#point", { opacity: 0, scale: 0.2, duration: 0.3, ease: "power2.in" }, D - 0.4);

    tl.to({}, { duration: D }, 0);
  };
})();
