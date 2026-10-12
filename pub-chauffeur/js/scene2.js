// Scène 2 — LA BASCULE (coupure → solution).
// Tout s'arrête net : fond crème vide. « Soyons honnêtes… » puis « Certains déplacements… ne
// peuvent pas attendre. » (bloc rouge). Écran noir : « Ils méritent un chauffeur. », une lueur
// verticale s'allume avec l'impact, puis s'ouvre en flash vers la solution.
// Rules : word-by-word-reveal, hard-cut-to-black, light-streak-reveal.

(function () {
  const { groupe, animerGroupe } = window.COMMUN;

  window.SCENE2 = function (tl, R) {
    const zone = document.getElementById("s2-phrases");
    const g1 = groupe(zone, "phrase", "Soyons honnêtes…", 0);
    const g2 = groupe(zone, "phrase", "Certains déplacements… ne peuvent pas attendre.", g1.dernier, "ne peuvent pas attendre.");
    const g3 = groupe(document.getElementById("s2-phrases-noir"), "phrase sur-noir", "Ils méritent un chauffeur.", g2.dernier);
    g1.el.style.top = "860px";
    g2.el.style.top = "760px";
    g3.el.style.top = "640px";

    // « Soyons honnêtes… » apparaît en gris, se révèle, puis laisse la place.
    animerGroupe(tl, g1, { entree: R.coupure + 0.2, sortie: g2.debut - 0.15 });
    tl.fromTo(g1.el, { y: 20, filter: "blur(10px)" }, { y: 0, filter: "blur(0px)", duration: 0.5, ease: "power3.out", immediateRender: false }, R.coupure + 0.2);
    animerGroupe(tl, g2, { entree: g2.debut - 0.15, sortie: R.noir });
    tl.fromTo(g2.el, { y: 20, filter: "blur(10px)" }, { y: 0, filter: "blur(0px)", duration: 0.5, ease: "power3.out", immediateRender: false }, g2.debut - 0.15);
    // Léger zoom continu pendant la phrase (gravité).
    tl.fromTo(zone, { scale: 1 }, { scale: 1.05, duration: R.noir - R.coupure, ease: "sine.inOut" }, R.coupure);

    // ── Écran noir ──
    const noir = document.getElementById("s2-noir");
    tl.set(noir, { opacity: 1 }, R.noir - 0.04);
    tl.set(zone, { scale: 1 }, R.noir - 0.04);
    animerGroupe(tl, g3, { entree: R.noir - 0.04, couleur: "#fbf8f3" });
    tl.fromTo(g3.el, { scale: 1.08, filter: "blur(6px)" }, { scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out", immediateRender: false }, R.noir);
    // Lueur verticale : s'allume sur l'impact, respire, puis s'ouvre vers la solution.
    const lueur = document.getElementById("s2-lueur");
    tl.fromTo(lueur, { opacity: 0, scaleY: 0.2 }, { opacity: 1, scaleY: 1, duration: 0.5, ease: "power4.out", immediateRender: false }, R.noir);
    tl.to(lueur, { opacity: 0.55, duration: 1.6, ease: "sine.inOut" }, R.noir + 0.6);
    tl.to(g3.el, { opacity: 0, filter: "blur(8px)", duration: 0.45, ease: "power2.in" }, R.solution - 0.75);
    tl.to(lueur, { opacity: 1, scaleX: 260, duration: 0.5, ease: "power3.in" }, R.solution - 0.5);
  };
})();
