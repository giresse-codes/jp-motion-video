// Scène 5 — l'appel à l'action (≈ 33,8 → 45 s).
// La caméra remonte, Douala bascule dans la nuit et s'illumine ; un téléphone se lève et
// s'ouvre sur WhatsApp ; le numéro s'écrit au rythme de la voix ; ding ; logo final et slogan.
// Rules : 3d-camera-flight (remontée), theme-crossfade-morph (jour → nuit via --nuitee),
// discrete-text-sequence (frappe du numéro calée mot par mot), spring-pop-entrance (logo).

(function () {
  const { mot, finMot } = window.TEMPS;

  window.SCENE5 = function (tl, ctx) {
    const { camera } = ctx;
    const { viser } = window.CAMERA;
    const { cam, appliquer } = camera;
    const R = window.VILLE.REPERES;

    const T = {
      debut: ctx.T4.fin - 0.2,
      reservez: mot("Réservez"),
      whatsapp: mot("WhatsApp"),
      six: mot("six"),
      cinquanteCinq: mot("cinquante-cinq"),
      trenteNeuf: mot("trente-neuf"),
      quarante: mot("quarante"),
      vingtHuit: mot("vingt-huit"),
      finNumero: finMot("vingt-huit"),
      jp: mot("JP", 2),
      votre: mot("votre"),
      notre: mot("notre"),
    };

    // ── La caméra remonte, la ville passe à la nuit et s'allume ──
    tl.to(cam, { ...viser(R.centre.x, R.centre.y - 80, { s: 0.42, rx: 56, rz: -10, oy: 520 }), duration: 1.8, ease: "power3.inOut", onUpdate: appliquer }, T.debut);
    tl.fromTo(document.documentElement, { "--nuitee": 0 }, { "--nuitee": 1, duration: 1.4, ease: "power2.inOut" }, T.debut + 0.3);
    // Pendant toute la fin, lente rotation de la vue (la ville respire).
    tl.to(cam, { ...viser(R.centre.x, R.centre.y - 80, { s: 0.47, rx: 57, rz: -2, oy: 560 }), duration: 45 - (T.debut + 1.8), ease: "sine.inOut", onUpdate: appliquer }, T.debut + 1.8);

    // ── Titre + téléphone ──
    tl.fromTo("#s5-voile", { opacity: 0 }, { opacity: 1, duration: 0.6 }, T.reservez - 0.5);
    tl.fromTo("#s5-titre", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power4.out" }, T.reservez - 0.1);
    tl.fromTo(
      "#telephone",
      { y: 900, rotationX: 38, rotationY: -22, rotationZ: 8, opacity: 0 },
      { y: 0, rotationX: 14, rotationY: -12, rotationZ: 3, opacity: 1, duration: 0.9, ease: "back.out(1.3)" },
      T.reservez - 0.35,
    );
    tl.to("#telephone", { rotationX: 6, rotationY: -6, rotationZ: 1, duration: 3.5, ease: "sine.inOut" }, T.reservez + 0.6);

    // ── Frappe du message, calée sur la voix ──
    // Chaque segment apparaît pendant que la voix le prononce (frappe caractère par caractère).
    const segments = [
      ["Réservez au ", T.whatsapp, T.six - 0.05],
      ["+237 655", T.six, T.trenteNeuf - 0.05],
      [" 39", T.trenteNeuf, T.quarante - 0.02],
      [" 40", T.quarante, T.vingtHuit - 0.02],
      [" 28", T.vingtHuit, T.finNumero],
    ];
    const texte = document.getElementById("message-texte");
    const plan = [];
    let acc = "";
    segments.forEach(([s, a, b]) => {
      for (let i = 1; i <= s.length; i++) plan.push({ t: a + ((b - a) * i) / s.length, texte: acc + s.slice(0, i) });
      acc += s;
    });
    const frappe = { t: 0 };
    tl.fromTo(
      frappe,
      { t: 0 },
      {
        t: 45,
        duration: 45,
        ease: "none",
        onUpdate() {
          // Recherche du dernier état atteint (seek-safe dans les deux sens).
          let courant = "";
          for (const p of plan) if (p.t <= frappe.t) courant = p.texte;
          texte.textContent = courant;
        },
      },
      0,
    );
    // Curseur qui clignote (fonction du temps), puis disparaît à l'envoi.
    const envoi = T.finNumero + 0.15;
    tl.fromTo("#curseur", { opacity: 1 }, { opacity: 0, duration: 0.25, ease: "steps(1)", yoyo: true, repeat: Math.max(0, Math.floor((envoi - T.whatsapp) / 0.25) - 1), immediateRender: false }, T.whatsapp);
    tl.set("#curseur", { opacity: 0 }, envoi);
    tl.fromTo("#bulle-accueil", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)", transformOrigin: "0% 0%" }, T.reservez + 0.2);
    tl.fromTo("#bulle-message", { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)", transformOrigin: "100% 0%" }, T.whatsapp - 0.1);
    // Envoi : ding, coches, petit rebond, flash.
    tl.fromTo("#coches", { opacity: 0 }, { opacity: 1, duration: 0.2 }, envoi);
    tl.fromTo("#bulle-message", { scale: 1 }, { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, envoi);
    tl.fromTo("#s5-flash", { opacity: 0.25 }, { opacity: 0, duration: 0.35, immediateRender: false }, envoi);

    // ── Logo final et slogan ──
    tl.to(["#telephone", "#s5-titre"], { y: 220, opacity: 0, duration: 0.5, ease: "power3.in", stagger: 0.04 }, T.jp - 0.45);
    tl.fromTo(
      "#s5-logo",
      { y: -600, scale: 2.1, opacity: 0, filter: "blur(14px)" },
      { y: 0, scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.35, ease: "power4.in" },
      T.jp - 0.3,
    );
    tl.to("#s5-logo", { scaleY: 0.86, scaleX: 1.06, duration: 0.07, ease: "power2.out" }, T.jp + 0.05);
    tl.to("#s5-logo", { scaleY: 1, scaleX: 1, duration: 0.7, ease: "elastic.out(1.1, 0.4)" }, T.jp + 0.12);
    tl.fromTo("#s5-flash", { opacity: 0.4 }, { opacity: 0, duration: 0.4, immediateRender: false }, T.jp + 0.05);
    tl.fromTo("#s5-mot-1", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power4.out" }, T.votre - 0.05);
    tl.fromTo("#s5-mot-2", { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.8)" }, T.notre - 0.05);
    // Le numéro reste à l'écran jusqu'à la fin (≥ 4 s de lecture).
    tl.fromTo("#s5-numero", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.6)" }, T.jp + 0.5);
    tl.fromTo("#s5-numero", { scale: 1 }, { scale: 1.04, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: 3, immediateRender: false }, T.jp + 1.2);

    return T;
  };
})();
