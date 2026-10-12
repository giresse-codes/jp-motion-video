// Scène 1 — accroche (0 → ~5,8 s).
// Rules : 3d-camera-flight (plongée du ciel), spring-pop-entrance (immeubles, palmiers),
// kinetic-beat-slam (slogan : trois entrées différentes), particle-burst (impact du logo).
// Chaque temps fort est calé sur un mot de la voix (window.VOIX).

(function () {
  // Temps (s) du premier mot de la voix dont le texte correspond, à partir d'un index.
  function mot(texte, apres) {
    const liste = window.VOIX.mots;
    const m = liste.find((x, i) => i >= (apres || 0) && x.texte.replace(/[.,:;]/g, "") === texte);
    if (!m) throw new Error("Mot introuvable dans la voix : " + texte);
    return m.debut;
  }

  window.SCENE1 = function (tl, ctx) {
    const { ville, camera } = ctx;
    const { viser } = window.CAMERA;
    const { cam, derive, secousse, appliquer } = camera;
    const R = window.VILLE.REPERES;
    const alea = window.VILLE.prng(7);

    const T = {
      impact: 1.3, // le logo touche le sol sur « Express »
      rapide: mot("Rapide"),
      sur: mot("Sûr"),
      confortable: mot("Confortable"),
    };
    T.sortie = T.confortable + 0.95;

    // ── Caméra : plongée du ciel (vue presque zénithale, lointaine) vers l'isométrique ──
    const POSE_CIEL = viser(R.centre.x, R.centre.y, { s: 0.14, rx: 4, rz: -28 });
    const POSE_VILLE = viser(1430, 1380, { s: 0.5, rx: 56, rz: 0, oy: 300 });
    const POSE_SLOGAN = viser(1480, 1430, { s: 0.56, rx: 57, rz: 5, oy: 330 });
    Object.assign(cam, POSE_CIEL);
    appliquer();
    tl.fromTo(cam, { ...POSE_CIEL }, { ...POSE_VILLE, duration: 2.1, ease: "power4.out", onUpdate: appliquer }, 0.05);
    tl.to(cam, { ...POSE_SLOGAN, duration: T.sortie - 2.3, ease: "power1.inOut", onUpdate: appliquer }, 2.3);
    // Micro-dérive permanente (la caméra ne meurt jamais), finie et déterministe.
    tl.fromTo(derive, { x: 0, y: 0, rz: 0 }, { x: 6, y: -4, rz: 0.4, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: 1, onUpdate: appliquer }, 2.2);

    // ── Nuages qui filent pendant la plongée ──
    const nuages = document.getElementById("nuages");
    for (let i = 0; i < 12; i++) {
      const n = document.createElement("div");
      n.className = "nuage";
      const w = 380 + alea() * 520;
      Object.assign(n.style, {
        width: w + "px",
        height: w * 0.45 + "px",
        left: 540 - w / 2 + (alea() - 0.5) * 900 + "px",
        top: 960 - w * 0.22 + (alea() - 0.5) * 1500 + "px",
      });
      nuages.appendChild(n);
      const dx = (parseFloat(n.style.left) + w / 2 - 540) * 2.4;
      const dy = (parseFloat(n.style.top) + w * 0.22 - 960) * 2.4;
      tl.fromTo(n, { x: 0, y: 0, scale: 1, opacity: 0.9 }, { x: dx, y: dy, scale: 3.2, opacity: 0, duration: 1.2 + alea() * 0.6, ease: "power2.in" }, alea() * 0.25);
    }

    // ── La ville se construit : routes qui se tracent, immeubles qui sortent du sol ──
    const dist = (x, y) => Math.hypot(x - R.centre.x, y - R.centre.y);
    ville.routes.forEach((r) => {
      const prop = r.axe === "y" ? "scaleY" : "scaleX";
      tl.fromTo(r.el, { [prop]: 0 }, { [prop]: 1, duration: 0.9, ease: "power3.out" }, 0.15 + Math.abs(r.pos - 1500) / 3200);
    });
    ville.batiments.forEach((b) => {
      const debut = 0.3 + (dist(b.x, b.y) / 1800) * 1.0;
      tl.fromTo(b.el, { "--h": "0px" }, { "--h": b.h + "px", duration: 0.6, ease: "back.out(1.6)" }, debut);
      tl.fromTo(b.ombre, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" }, debut + 0.1);
    });
    tl.fromTo(ville.cabine, { z: 0 }, { z: 170, duration: 0.6, ease: "back.out(1.6)" }, 0.3 + (dist(2697, 2387) / 1800) * 1.0);
    ville.palmiers.forEach((p) => {
      tl.fromTo(p.el, { "--p": 0 }, { "--p": 1, duration: 0.5, ease: "back.out(2)" }, 1.1 + (dist(p.x, p.y) / 1800) * 0.8);
    });
    // Le trafic apparaît puis roule doucement.
    ville.vehicules.trafic.forEach((v, i) => {
      tl.fromTo(v.el, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.6 + (i % 10) * 0.03);
      const course = 60 + (i % 5) * 18;
      const prop = v.axe === "x" ? "x" : "y";
      tl.fromTo(v.el, { [prop]: 0 }, { [prop]: v.sens * course, duration: 4, ease: "none" }, 1.6);
    });
    tl.fromTo(ville.vehicules.heros, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.6);

    // ── Logo : chute, impact au sol, onde de choc, étincelles ──
    const logo = document.getElementById("s1-logo");
    tl.fromTo(
      logo,
      { y: -760, scale: 2.3, rotation: -7, opacity: 0, filter: "blur(16px)" },
      { y: 0, scale: 1, rotation: 0, opacity: 1, filter: "blur(0px)", duration: 0.32, ease: "power4.in" },
      T.impact - 0.32,
    );
    // Écrasement puis rebond (anticipation / rebond).
    tl.to(logo, { scaleY: 0.84, scaleX: 1.08, duration: 0.07, ease: "power2.out" }, T.impact);
    tl.to(logo, { scaleY: 1, scaleX: 1, duration: 0.7, ease: "elastic.out(1.1, 0.4)" }, T.impact + 0.07);
    tl.fromTo("#s1-onde", { scale: 0.25, opacity: 1 }, { scale: 2.1, opacity: 0, duration: 0.85, ease: "power3.out", immediateRender: false }, T.impact);
    tl.fromTo("#s1-flash", { opacity: 0.45 }, { opacity: 0, duration: 0.35, ease: "power2.out", immediateRender: false }, T.impact);
    const zone = document.getElementById("s1-etincelles");
    for (let i = 0; i < 22; i++) {
      const e = document.createElement("div");
      e.className = "etincelle";
      zone.appendChild(e);
      const ang = (i / 22) * Math.PI * 2 + alea() * 0.3;
      const r = 220 + alea() * 360;
      tl.fromTo(
        e,
        { x: 0, y: 0, opacity: 1, scale: 1 },
        { x: Math.cos(ang) * r, y: Math.sin(ang) * r * 0.55 + 120, opacity: 0, scale: 0.3, duration: 0.7 + alea() * 0.4, ease: "power3.out", immediateRender: false },
        T.impact,
      );
    }
    // Secousse caméra amortie (déterministe : fonction du temps de la tween).
    const choc = { t: 0 };
    tl.fromTo(
      choc,
      { t: 0 },
      {
        t: 1,
        duration: 0.6,
        ease: "none",
        onUpdate() {
          const a = Math.exp(-choc.t * 5) * 18;
          secousse.x = Math.sin(choc.t * 55) * a;
          secousse.y = Math.cos(choc.t * 47) * a * 0.7;
          appliquer();
        },
      },
      T.impact,
    );

    // Le logo remonte un peu pour laisser la place au slogan.
    tl.to(logo, { y: -30, scale: 0.9, duration: 0.6, ease: "power3.inOut" }, T.rapide - 0.45);

    // ── Slogan : trois entrées différentes sur un même battement (kinetic-beat-slam) ──
    const m1 = "#s1-mot-1 .mot";
    const m2 = "#s1-mot-2 .mot";
    const m3 = "#s1-mot-3 .mot";
    // « Rapide. » : slam d'échelle + flou
    tl.fromTo(m1, { scale: 2.6, opacity: 0, filter: "blur(18px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.42, ease: "power4.out" }, T.rapide - 0.06);
    // « Sûr. » : claquement latéral + inclinaison
    tl.fromTo(m2, { x: 760, skewX: -24, opacity: 0 }, { x: 0, skewX: 0, opacity: 1, duration: 0.42, ease: "power4.out" }, T.sur - 0.08);
    // « Confortable. » : montée avec rotation et rebond
    tl.fromTo(m3, { y: 170, rotation: 7, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.55, ease: "back.out(1.7)" }, T.confortable - 0.06);
    tl.fromTo("#s1-flash", { opacity: 0.18 }, { opacity: 0, duration: 0.25, immediateRender: false }, T.rapide);
    tl.fromTo("#s1-flash", { opacity: 0.22 }, { opacity: 0, duration: 0.25, immediateRender: false }, T.sur);

    // Sortie : tout est traversé par la caméra qui plonge vers le carrefour (scène 2).
    tl.to(["#s1-mot-1", "#s1-mot-2", "#s1-mot-3"], { y: -120, scale: 1.25, opacity: 0, duration: 0.45, ease: "power2.in", stagger: 0.05 }, T.sortie);
    tl.to(logo, { y: -260, scale: 1.4, opacity: 0, filter: "blur(10px)", duration: 0.5, ease: "power2.in" }, T.sortie + 0.05);
    tl.to(".voile-haut", { opacity: 0, duration: 0.5 }, T.sortie);

    return T;
  };
})();
