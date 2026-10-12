// Scène 3 — les services (≈ 11,4 → 30 s).
// La caméra suit le véhicule JP à travers quatre « quartiers » ; dans chacun, une carte en verre
// se déplie en 3D et son prix défile comme un compteur.
// Rules : 3d-camera-flight (vols entre quartiers, dézoom final), counting-dynamic-scale (prix),
// spring-pop-entrance (icônes), svg-path-draw (trajets sur la carte du Cameroun),
// depth-scatter-assemble inversé pour la vue éclatée du véhicule Confort.

(function () {
  const { mot, finMot } = window.TEMPS;
  const fmt = (n) => Math.round(n).toLocaleString("fr-FR").replace(/\s/g, " ");

  window.SCENE3 = function (tl, ctx) {
    const { ville, camera } = ctx;
    const { viser } = window.CAMERA;
    const { cam, appliquer } = camera;
    const R = window.VILLE.REPERES;

    const T = {
      debut: ctx.T2.fin,
      eco: mot("Éco"),
      ecoPrix: mot("trois"),
      confort: mot("Confort"),
      confortPrix: mot("quatre"),
      wifi: mot("Wi-Fi"),
      clim: mot("climatisation"),
      ecran: mot("écran"),
      aeroport: mot("Aéroport"),
      aeroportPrix: mot("huit"),
      voyager: mot("voyager"),
      cameroun: mot("Cameroun"),
      voyage: mot("Voyage"),
      voyagePrix: mot("cinquante"),
      finVoix: finMot("jour"),
    };
    T.fin = 30.0;

    // ── Utilitaires : dépliage d'une carte en verre, compteur de prix ──
    const deplier = (sel, t) => {
      tl.fromTo(sel, { rotationX: 86, y: 120, opacity: 0 }, { rotationX: 0, y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.3)" }, t);
      if (document.querySelector(`${sel} .carte-ligne`))
        tl.fromTo(`${sel} .carte-ligne`, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.09 }, t + 0.35);
    };
    const replier = (sel, t) => {
      tl.to(sel, { rotationX: -70, y: -160, opacity: 0, duration: 0.45, ease: "power3.in" }, t);
    };
    const compteur = (sel, valeur, t, duree) => {
      const n = document.querySelector(sel);
      const p = { v: 0 };
      n.textContent = fmt(0);
      tl.fromTo(p, { v: 0 }, { v: valeur, duration: duree || 0.9, ease: "power2.out", onUpdate: () => (n.textContent = fmt(p.v)) }, t);
      // Impact d'arrivée : le prix grossit puis se pose.
      tl.fromTo(sel, { scale: 1 }, { scale: 1.14, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1, immediateRender: false }, t + (duree || 0.9) - 0.05);
    };

    // ═════ 1. Éco — Bonapriso (résidentiel) ═════
    tl.to(cam, { ...viser(1020, 1800, { s: 1.15, rx: 54, rz: -12, oy: 420 }), duration: 1.2, ease: "power2.inOut", onUpdate: appliquer }, T.debut - 0.4);
    deplier("#carte-eco", T.eco - 0.15);
    compteur("#carte-eco .compteur", 3000, T.ecoPrix);
    tl.fromTo("#s3-etiquette-1", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, T.eco - 0.3);
    replier("#carte-eco", T.confort - 0.55);
    tl.to("#s3-etiquette-1", { opacity: 0, duration: 0.3 }, T.confort - 0.55);

    // ═════ 2. Confort — vue éclatée du véhicule, Akwa en fond ═════
    tl.to(cam, { ...viser(R.akwa.x, R.akwa.y + 150, { s: 0.95, rx: 56, rz: 8, oy: 520 }), duration: 1.3, ease: "power2.inOut", onUpdate: appliquer }, T.confort - 0.6);
    tl.fromTo("#s3-voile-confort", { opacity: 0 }, { opacity: 1, duration: 0.5 }, T.confort - 0.3);
    // Le véhicule arrive assemblé, puis se décompose en couches (vue éclatée).
    tl.fromTo("#eclate", { y: 260, scale: 0.6, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)" }, T.confort - 0.2);
    const couches = [
      ["#eclate-toit", -230],
      ["#eclate-habitacle", -120],
      ["#eclate-caisse", 0],
      ["#eclate-chassis", 90],
    ];
    couches.forEach(([sel, dy], i) => {
      tl.fromTo(sel, { y: 0 }, { y: dy, duration: 0.7, ease: "power3.inOut" }, T.confortPrix - 0.1 + i * 0.04);
    });
    [
      ["#eq-wifi", T.wifi],
      ["#eq-clim", T.clim],
      ["#eq-ecran", T.ecran],
    ].forEach(([sel, t]) => {
      tl.fromTo(sel, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.6)" }, t - 0.05);
      tl.fromTo(`${sel} .eq-icone`, { rotation: -20 }, { rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" }, t);
    });
    // Ondes Wi-Fi qui pulsent, souffle de clim, écran qui s'allume.
    tl.fromTo("#eq-wifi .onde-wifi", { opacity: 0.2 }, { opacity: 1, duration: 0.25, stagger: 0.12, yoyo: true, repeat: 5, ease: "sine.inOut", immediateRender: false }, T.wifi + 0.3);
    tl.fromTo("#eq-clim .souffle", { x: -14, opacity: 0 }, { x: 14, opacity: 1, duration: 0.6, stagger: 0.15, repeat: 2, ease: "sine.inOut", immediateRender: false }, T.clim + 0.3);
    tl.fromTo("#eq-ecran .lecture", { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "none" }, T.ecran + 0.2);
    deplier("#carte-confort", T.confort + 0.15);
    compteur("#carte-confort .compteur", 4000, T.confortPrix);
    const finConfort = T.aeroport - 0.6;
    tl.to("#eclate", { y: 200, scale: 0.7, opacity: 0, duration: 0.45, ease: "power3.in" }, finConfort);
    replier("#carte-confort", finConfort);
    tl.to("#s3-voile-confort", { opacity: 0, duration: 0.5 }, finConfort + 0.1);

    // ═════ 3. Aéroport — un avion décolle ═════
    tl.to(cam, { ...viser(R.aeroport.x - 80, R.aeroport.y - 60, { s: 1.0, rx: 55, rz: -4, oy: 430 }), duration: 1.3, ease: "power2.inOut", onUpdate: appliquer }, finConfort - 0.1);
    tl.fromTo("#s3-etiquette-3", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, T.aeroport - 0.2);
    // Roulage le long de la piste puis rotation et montée (z) avec ombre qui s'éloigne.
    const avion = ville.avion;
    // Ombre au sol qui reste sur la piste et s'estompe, traînée blanche derrière l'avion.
    const { el } = window.VILLE;
    const sol = document.getElementById("sol");
    const ombreAvion = el("div", "ombre-avion", { left: "2300px", top: "2612px" });
    const trainee = el("div", "trainee-avion", { left: "2300px", top: "2610px" });
    sol.insertBefore(ombreAvion, avion);
    sol.insertBefore(trainee, avion);
    tl.fromTo(avion, { x: 0, z: 0, scale: 1 }, { x: 330, duration: 1.0, ease: "power2.in" }, T.aeroport);
    tl.fromTo(ombreAvion, { x: 0, opacity: 0.6, scale: 1 }, { x: 330, duration: 1.0, ease: "power2.in" }, T.aeroport);
    tl.to(avion, { x: 820, z: 560, scale: 1.7, duration: 1.4, ease: "power1.in" }, T.aeroport + 1.0);
    tl.to(ombreAvion, { x: 980, y: -60, opacity: 0, scale: 0.6, duration: 1.4, ease: "power1.in" }, T.aeroport + 1.0);
    tl.fromTo(trainee, { scaleX: 0, opacity: 0.9 }, { scaleX: 1, duration: 1.4, ease: "power1.in" }, T.aeroport + 1.0);
    tl.to(trainee, { opacity: 0, duration: 1.0 }, T.aeroport + 2.2);
    tl.fromTo("#s3-flash", { opacity: 0.12 }, { opacity: 0, duration: 0.3, immediateRender: false }, T.aeroport + 1.0);
    deplier("#carte-aeroport", T.aeroport + 0.1);
    compteur("#carte-aeroport .compteur", 8000, T.aeroportPrix, 0.7);
    tl.fromTo("#carte-aeroport .option", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.18, ease: "power3.out" }, T.aeroportPrix + 0.5);
    replier("#carte-aeroport", T.voyager - 0.3);
    tl.to("#s3-etiquette-3", { opacity: 0, duration: 0.3 }, T.voyager - 0.3);

    // ═════ 4. Voyage — dézoom vers la carte du Cameroun, trajets tracés ═════
    // Le véhicule JP prend la route de l'est (avenue y = 1100) : la caméra recule très loin.
    // La ville rétrécit vers l'écran exact où Douala apparaîtra sur la carte (ox/oy), vue de dessus.
    const DOUALA_ECRAN = { ox: -241, oy: 279 };
    tl.to(cam, { ...viser(R.centre.x, R.centre.y, { s: 0.07, rx: 0, rz: 0, ...DOUALA_ECRAN }), duration: 1.6, ease: "power3.inOut", onUpdate: appliquer }, T.voyager - 0.35);
    tl.fromTo(".scene-3d", { opacity: 1 }, { opacity: 0, duration: 0.5, ease: "power2.in" }, T.cameroun - 0.35);
    tl.fromTo("#cameroun-fond", { opacity: 0 }, { opacity: 1, duration: 0.6 }, T.cameroun - 0.6);
    tl.fromTo("#cameroun", { opacity: 0, scale: 2.4 }, { opacity: 1, scale: 1, duration: 1.1, ease: "power3.out" }, T.cameroun - 0.6);
    tl.fromTo("#cameroun .pays", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.0, ease: "power2.inOut" }, T.cameroun - 0.6);
    // Points des villes : échelle CSS via --e (la carte est masquée au montage, GSAP n'y mesure
    // pas les boîtes SVG correctement) ; l'origine est fixée en px dans illustrations.js.
    tl.fromTo("#ville-douala", { "--e": 0 }, { "--e": 1, duration: 0.4, ease: "back.out(2.5)" }, T.cameroun - 0.1);
    const trajets = [
      ["#trajet-yaounde", "#ville-yaounde", T.voyage],
      ["#trajet-kribi", "#ville-kribi", T.voyage + 0.7],
      ["#trajet-bafoussam", "#ville-bafoussam", T.voyage + 1.4],
    ];
    trajets.forEach(([trajet, point, t]) => {
      tl.fromTo(trajet, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, t);
      tl.fromTo(point, { "--e": 0 }, { "--e": 1, duration: 0.4, ease: "back.out(2.5)" }, t + 0.8);
    });
    // Le petit véhicule JP parcourt le trajet vers Yaoundé (suit le tracé).
    deplier("#carte-voyage", T.voyage - 0.1);
    compteur("#carte-voyage .compteur", 50000, T.voyagePrix, 1.0);
    tl.fromTo("#carte-voyage .badge", { scale: 0, rotation: -8 }, { scale: 1, rotation: -3, duration: 0.5, ease: "back.out(2.2)" }, T.finVoix + 0.3);
    tl.fromTo("#carte-voyage .mention", { opacity: 0 }, { opacity: 1, duration: 0.4 }, T.finVoix + 0.8);
    // Respiration finale sur la carte avant la transition vers les chauffeurs.
    tl.to("#cameroun", { scale: 1.06, duration: T.fin - T.finVoix, ease: "sine.inOut" }, T.finVoix);
    replier("#carte-voyage", T.fin - 0.6);
    // Retour en ville : on replonge dans Douala sur la carte.
    tl.to("#cameroun", { scale: 5, opacity: 0, duration: 0.7, ease: "power3.in" }, T.fin - 0.5);
    tl.to("#cameroun-fond", { opacity: 0, duration: 0.5 }, T.fin - 0.3);
    tl.to(".scene-3d", { opacity: 1, duration: 0.5, ease: "power2.out" }, T.fin - 0.35);

    return T;
  };
})();
