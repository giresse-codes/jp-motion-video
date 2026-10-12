// Scène 4 — le professionnalisme (≈ 29,4 → 34,8 s).
// La caméra replonge dans Douala jusqu'au véhicule JP ; on « traverse » sa carrosserie pour
// arriver sur la vue en coupe : le chauffeur ouvre la porte, trois badges calés sur la voix.
// Rules : 3d-camera-flight (plongée sur le véhicule), scale-swap-transition (ville → vue en coupe),
// spring-pop-entrance (badges), press-release-spring (geste du chauffeur).

(function () {
  const { mot } = window.TEMPS;

  window.SCENE4 = function (tl, ctx) {
    const { ville, camera } = ctx;
    const { viser } = window.CAMERA;
    const { cam, appliquer } = camera;

    const T = {
      debut: ctx.T3.fin - 0.5,
      chauffeurs: mot("chauffeurs"),
      professionnels: mot("professionnels"),
      ponctuels: mot("ponctuels"),
      attentifs: mot("attentifs"),
      detail: mot("détail"),
    };
    T.fin = T.detail + 0.75;

    // Le véhicule JP s'est garé à l'ouest du carrefour (fin de scène 2) : la caméra y plonge.
    const JP = { x: 1010, y: 1686 };
    tl.to(cam, { ...viser(JP.x, JP.y, { s: 1.1, rx: 50, rz: 10, oy: 300 }), duration: 0.6, ease: "power2.out", onUpdate: appliquer }, T.debut);
    tl.to(cam, { ...viser(JP.x, JP.y, { s: 4.2, rx: 46, rz: 18, oy: 120 }), duration: 0.9, ease: "power4.in", onUpdate: appliquer }, T.debut + 0.5);

    // On traverse la carrosserie : flash rouge, voile, la vue en coupe grandit depuis le centre.
    tl.fromTo("#s4-flash", { opacity: 0.55 }, { opacity: 0, duration: 0.35, immediateRender: false }, T.debut + 1.3);
    tl.fromTo("#s4-voile", { opacity: 0 }, { opacity: 1, duration: 0.3 }, T.debut + 1.2);
    tl.fromTo("#coupe", { scale: 3.4, opacity: 0, filter: "blur(14px)" }, { scale: window.CAMERA.PAYSAGE ? 1.05 : 1.32, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "power4.out" }, T.debut + 1.3);

    // Titre calé sur « chauffeurs professionnels ».
    tl.fromTo("#s4-titre-1", { x: -160, opacity: 0, skewX: 14 }, { x: 0, opacity: 1, skewX: 0, duration: 0.45, ease: "power4.out" }, T.chauffeurs - 0.08);
    tl.fromTo("#s4-titre-2", { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.8)" }, T.professionnels - 0.05);

    // Le chauffeur s'avance, ouvre la portière (rotation 3D projetée), puis invite à monter.
    tl.fromTo("#chauffeur", { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, T.debut + 1.7);
    const porte = { a: 0 };
    tl.fromTo(
      porte,
      { a: 0 },
      { a: 72, duration: 0.85, ease: "back.out(1.4)", onUpdate: () => window.ILLUSTRATIONS.porte(porte.a) },
      T.ponctuels - 0.2,
    );
    // Bras : rotation CSS via --r (pas de mesure SVG par GSAP au montage).
    tl.fromTo("#chauffeur-bras", { "--r": "0deg" }, { "--r": "-55deg", duration: 0.45, ease: "power3.out" }, T.ponctuels - 0.2);
    tl.to("#chauffeur-bras", { "--r": "-20deg", duration: 0.6, ease: "elastic.out(1, 0.5)" }, T.attentifs);

    // Badges, un par mot.
    [
      ["#badge-ponctuel", T.ponctuels],
      ["#badge-securise", T.attentifs],
      ["#badge-premium", T.detail],
    ].forEach(([sel, t]) => {
      tl.fromTo(sel, { scale: 0.3, y: 40, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: "back.out(2.4)" }, t - 0.05);
    });

    // Sortie : tout s'efface vers le haut, la caméra remonte (scène 5 prend le relais).
    tl.to([".s4-titre", ".badges", "#coupe"], { y: -120, opacity: 0, duration: 0.45, ease: "power2.in", stagger: 0.05 }, T.fin - 0.1);
    tl.to("#s4-voile", { opacity: 0, duration: 0.5 }, T.fin);

    return T;
  };
})();
