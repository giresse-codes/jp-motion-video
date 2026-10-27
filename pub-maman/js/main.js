// « Chut, Maman ne sait rien » — JP PAPIER, ambiance de soirée (28 s). Hook dessiné (doigt sur les lèvres), groupe
// « Les enfants », 19:00 et porte qui s'ouvre, chauffeur JP à la portière, trajet de nuit, restaurant, phrase finale,
// outro. La photo fournie (assets/images/maman.jpg, trois panneaux) est recadrée dans le cadre du kit.
// Timeline GSAP en pause, sûre au seek ; lumières dorées et confettis = fonctions pures du temps.
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const $ = (s) => document.querySelector(s);
  const svg = (parent, nom, attrs) => {
    const el = document.createElementNS(NS, nom);
    Object.entries(attrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
    parent.appendChild(el);
    return el;
  };
  function hasard(graine) {
    return function () {
      graine |= 0; graine = (graine + 0x6D2B79F5) | 0;
      let t = Math.imul(graine ^ (graine >>> 15), 1 | graine);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const phrases = (liste) => liste.map((ph) => ph.slice(0, -1).map(([t, m], i) => ({ text: m.replace("*", ""), start: t, end: ph[i + 1][0], cle: m.includes("*") })));
  // Recadrage de la photo source (1696 × 2528) dans le cadre 900 × 1140 : centre (cx, cy), échelle s.
  const cadrage = (cx, cy, s) => ({ x: 450 - cx * s, y: 570 - cy * s, scale: s });

  function dessinerChut(el) {
    el.innerHTML =
      '<defs><radialGradient id="g-peau" cx=".45" cy=".35" r=".75"><stop offset="0" stop-color="#9C6A4A"/><stop offset="1" stop-color="#6B4430"/></radialGradient>' +
      '<linearGradient id="g-doigt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A5A3C"/><stop offset=".55" stop-color="#A87452"/><stop offset="1" stop-color="#7A4E34"/></linearGradient></defs>' +
      '<ellipse cx="300" cy="300" rx="290" ry="340" fill="url(#g-peau)"/>' +
            '<g id="levres"><path d="M150 330 Q225 288 300 312 Q375 288 450 330 Q375 352 300 346 Q225 352 150 330 Z" fill="#5A2621"/>' +
      '<path d="M150 330 Q300 440 450 330 Q375 356 300 352 Q225 356 150 330 Z" fill="#7A3A30"/>' +
      '<path d="M235 380 Q300 398 365 380" stroke="#A85A4C" stroke-width="8" fill="none" stroke-linecap="round" opacity=".7"/></g>' +
      '<g id="doigt"><path d="M262 640 L262 200 Q262 150 300 150 Q338 150 338 200 L338 640 Z" fill="url(#g-doigt)" stroke="#4E2E1F" stroke-width="6"/>' +
      '<path d="M278 186 Q300 166 322 186 L322 222 Q300 232 278 222 Z" fill="#E8C3A8" opacity=".85"/>' +
      '<path d="M276 300 Q300 310 324 300 M276 318 Q300 328 324 318 M276 470 Q300 480 324 470" stroke="#5E3A26" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>' +
      '<ellipse cx="300" cy="660" rx="150" ry="70" fill="#7A4E34"/></g>';
  }

  window.CONSTRUIRE = function (tl) {
    const T = window.T, P = JPPapier, X = T.textes, D = T.duree, pl = T.plans;

    // ---------- Lumières dorées de la soirée (fond) et confettis (fonctions du temps) ----------
    const r = hasard(4), lumieres = [];
    for (let i = 0; i < 26; i++) {
      const d = document.createElement("i"); d.className = "lumiere";
      const t = 30 + r() * 110; Object.assign(d.style, { width: t + "px", height: t + "px", filter: `blur(${(2 + r() * 6).toFixed(1)}px)` });
      $("#lumieres").appendChild(d);
      lumieres.push({ d, x: r() * 1080, y: r() * 1920, a: 0.25 + r() * 0.5, v: 1 + Math.floor(r() * 3), ph: r() });
    }
    const conf = $("#confettis"), confettis = [];
    for (let i = 0; i < 70; i++) {
      const c = svg(conf, "rect", { width: 14 + r() * 12, height: 8 + r() * 8, rx: 2, fill: ["#F2C230", "#F6DE7A", "#FBF7EE"][i % 3], opacity: 0 });
      confettis.push({ c, x: r() * 1080, ph: r(), v: 260 + r() * 260, tour: 200 + r() * 400, oscil: 20 + r() * 40 });
    }
    function anime(t) {
      lumieres.forEach((l) => {
        const p = (t / D) * l.v + l.ph;
        const y = ((l.y - p * 300) % 1920 + 1920) % 1920;
        l.d.style.transform = `translate(${(l.x + Math.sin(p * 6.283) * 30).toFixed(1)}px, ${y.toFixed(1)}px)`;
        l.d.style.opacity = (l.a * (0.6 + 0.4 * Math.sin(p * 12.566))).toFixed(2);
      });
      const t0 = pl[4] + 0.2, actif = t >= t0 && t < pl[5] + 0.6;
      confettis.forEach((q) => {
        if (!actif) { q.c.setAttribute("opacity", 0); return; }
        const dt = t - t0 + q.ph * 1.2, y = -40 + dt * q.v;
        q.c.setAttribute("opacity", y > 1950 ? 0 : 1);
        q.c.setAttribute("x", (q.x + Math.sin(dt * 3 + q.ph * 6) * q.oscil).toFixed(1));
        q.c.setAttribute("y", y.toFixed(1));
        q.c.setAttribute("transform", `rotate(${(dt * q.tour).toFixed(0)} ${(q.x).toFixed(0)} ${y.toFixed(0)})`);
      });
    }
    const horloge = { t: 0 };
    tl.to(horloge, { t: D, duration: D, ease: "none", onUpdate: () => anime(horloge.t) }, 0);
    anime(0);

    // ---------- 1. Hook : « Chut. Maman ne sait rien. » ----------
    dessinerChut($("#chut"));
    gsap.set("#p-chut", { opacity: 1 });
    P.texteSurligne(tl, { de: 0, a: pl[1], classe: "clair", phrases: phrases(X.hook) });
    tl.fromTo("#chut", { scale: 1, transformOrigin: "50% 40%" }, { scale: 1.08, duration: pl[1] + 0.3, ease: "none", immediateRender: true }, 0);
    tl.fromTo("#doigt", { y: 0 }, { y: -10, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, 0.2);
    tl.to("#p-chut", { opacity: 0, duration: 0.5, ease: "power2.in" }, pl[1] - 0.3);

    // ---------- 2. Groupe « Les enfants 🤫 » ----------
    P.fondu(tl, "#p-chat", pl[1], pl[2]);
    P.conversation(tl, { parent: "#p-chat", x: 280, y: 590, largeur: 520, de: pl[1], contact: "Les enfants 🤫", messages: T.messages, ecrit: T.ecrit });
    P.texteSurligne(tl, { de: pl[1], a: pl[2], classe: "clair", phrases: phrases(X.chat) });

    // ---------- 3-4. 19:00, sonnette, porte qui s'ouvre sur Maman, puis le chauffeur à la portière ----------
    P.fondu(tl, "#p-porte", pl[2], pl[3]);
    P.texteSurligne(tl, { de: pl[2], a: pl[3], classe: "clair", phrases: phrases(X.porte) });
    const cMaman = cadrage(800, 420, 1.4), cMaman2 = cadrage(800, 420, 1.5), cChauffeur = cadrage(1180, 420, 1.45), cChauffeur2 = cadrage(1150, 400, 1.6);
    tl.fromTo("#ph-porte", cMaman, { ...cMaman2, duration: T.pano - pl[2], ease: "none", immediateRender: true }, pl[2]);
    tl.to("#ph-porte", { ...cChauffeur, duration: 0.9, ease: "power2.inOut" }, T.pano);
    tl.to("#ph-porte", { ...cChauffeur2, duration: pl[3] - T.pano - 0.9, ease: "none" }, T.pano + 0.9);
    P.horloge(tl, { parent: "#horloge-place", x: 700, y: 560, taille: 230, heure: [7, 0], de: T.horloge - 0.15, fond: "#F2C230" });
    tl.to(".jp-horloge", { opacity: 0, scale: 0.6, duration: 0.3 }, T.ouverture + 0.3);
    tl.fromTo("#sonnette", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.4)", immediateRender: false }, T.sonnette - 0.25);
    tl.fromTo("#sonnette", { x: 0, rotation: 0 }, { x: 6, rotation: 4, duration: 0.05, yoyo: true, repeat: 7, ease: "none", immediateRender: false }, T.sonnette);
    tl.to("#sonnette", { opacity: 0, duration: 0.3 }, T.ouverture + 0.4);
    tl.fromTo("#porte-maison", { rotationY: 0 }, { rotationY: -105, duration: 0.8, ease: "power2.inOut", immediateRender: false }, T.ouverture);
    tl.set("#porte-maison", { opacity: 0 }, T.ouverture + 0.8);
    // « Bonsoir Madame. Vos enfants vous attendent. » en Caveat, petites étincelles dorées
    tl.fromTo("#bonsoir", { opacity: 0, y: 60, rotation: 2 }, { opacity: 1, y: 0, rotation: -3, duration: 0.5, ease: "back.out(1.8)", immediateRender: false }, T.bonsoir[0] - 0.25);
    tl.fromTo("#b1", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "none", immediateRender: false }, T.bonsoir[0]);
    tl.fromTo("#b2", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "none", immediateRender: false }, T.bonsoir[1]);
    const et = $("#etincelles");
    for (let i = 0; i < 16; i++) {
      const x = 140 + r() * 760, y = 1250 + r() * 330, g = svg(et, "g", { opacity: 0 });
      svg(g, "path", { d: `M${x} ${y - 16} L${x + 5} ${y - 5} L${x + 16} ${y} L${x + 5} ${y + 5} L${x} ${y + 16} L${x - 5} ${y + 5} L${x - 16} ${y} L${x - 5} ${y - 5} Z`, fill: "#F2C230" });
      const t0 = T.bonsoir[0] + r() * 2;
      tl.fromTo(g, { opacity: 0, scale: 0.2, svgOrigin: `${x} ${y}` }, { keyframes: [{ opacity: 1, scale: 1.2, duration: 0.25 }, { opacity: 0, scale: 0.4, duration: 0.45 }], svgOrigin: `${x} ${y}`, immediateRender: false }, t0);
    }

    // ---------- 5. Le trajet : lumières de la ville sur son visage, zoom lent ----------
    P.fondu(tl, "#p-trajet", pl[3], pl[4]);
    P.texteSurligne(tl, { de: pl[3], a: pl[4], classe: "clair", phrases: phrases(X.trajet) });
    tl.fromTo("#ph-trajet", cadrage(560, 1240, 1.45), { ...cadrage(600, 1215, 1.75), duration: pl[4] - pl[3] + 0.6, ease: "none", immediateRender: true }, pl[3] - 0.3);
    const reflets = $("#reflets");
    [["#FFB35C", 260], ["#FF6A4D", 200], ["#FFF1D6", 300], ["#7FA7FF", 220], ["#FFD27A", 280]].forEach(([c, t], k) => {
      const d = document.createElement("i");
      Object.assign(d.style, { width: t + "px", height: t + "px", top: (120 + k * 170) + "px", background: c, opacity: 0.55 });
      reflets.appendChild(d);
      const d0 = pl[3] + k * 0.45, n = Math.floor((pl[4] - d0) / 1.8);
      tl.fromTo(d, { x: -400 }, { x: 1200, duration: 1.8, ease: "none", repeat: Math.max(0, n - 1), immediateRender: false }, d0);
    });

    // ---------- 6. Le restaurant : gâteau, confettis jaunes ----------
    P.fondu(tl, "#p-resto", pl[4], pl[5]);
    tl.fromTo("#ph-resto", cadrage(872, 2100, 1.6), { ...cadrage(872, 2110, 1.37), duration: pl[5] - pl[4] + 0.6, ease: "power1.out", immediateRender: true }, pl[4] - 0.3);

    // ---------- 7. Phrase finale, en grand ----------
    P.fondu(tl, "#p-fin", pl[5], T.outro);
    P.texteSurligne(tl, { de: pl[5], a: T.outro, classe: "centre clair", phrases: phrases(X.fin) });

    // ---------- Outro JP PAPIER puis retour au hook ----------
    const outro = P.outroJP(tl, { parent: "#camera", de: T.outro });
    tl.to(outro, { opacity: 0, duration: 0.45, ease: "power2.inOut" }, T.retour);
    tl.fromTo("#p-chut", { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.inOut", immediateRender: false }, T.retour);
    tl.set("#chut", { scale: 1 }, T.retour);
    P.texteSurligne(tl, { de: T.retour, classe: "clair", phrases: phrases(X.hook).map((ph) => ph.map((w) => ({ ...w, start: T.retour, end: T.retour }))) });
  };
})();
