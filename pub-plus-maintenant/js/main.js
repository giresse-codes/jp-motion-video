// « Plus maintenant » — JP Service Express Urbaine (15 s, 9:16, sans voix off).
// Hook qui claque, écran divisé du chaos, balayage géométrique, calme premium, boucle + CTA.
// Tout part de window.T : timeline GSAP en pause, déterministe, sûre en recherche avant/arrière.

(function () {
  const GRIS = ["#4a4a50", "#5c5c63", "#3d3d42", "#6a6a70", "#545459"];
  const VOIES = [70, 190, 310, 430];
  const lisse = (v) => v * v * (3 - 2 * v);

  window.CONSTRUIRE = function (tl) {
    const T = window.T;
    const $ = (id) => document.getElementById(id);
    const tous = (sel) => Array.from(document.querySelectorAll(sel));

    // ════ HOOK : chaque ligne claque, la caméra tressaille, coupure sèche ════
    // Chaque ligne inverse les couleurs : jaune/noir, noir/jaune… (coupes franches, pas de fondu).
    const FONDS = ["#FFC400", "#0b0b0b", "#FFC400", "#0b0b0b"];
    tl.set("#fond-hook", { backgroundColor: FONDS[0] }, 0);
    tl.set("#hook", { color: "#0b0b0b" }, 0);
    tous(".ligne").forEach((el, i) => {
      tl.set("#fond-hook", { backgroundColor: FONDS[i] }, T.hook[i] + 0.14);
      tl.set("#hook", { color: FONDS[i] === "#0b0b0b" ? "#FFC400" : "#0b0b0b" }, T.hook[i] + 0.14);
      tl.fromTo(el, { opacity: 0, scale: 1.7 }, { opacity: 1, scale: 1, duration: 0.14, ease: "power4.in" }, T.hook[i]);
      tl.fromTo("#camera", { x: 0, y: 0 }, { keyframes: [{ x: -14, y: 8, duration: 0.04 }, { x: 10, y: -6, duration: 0.05 }, { x: 0, y: 0, duration: 0.07 }] }, T.hook[i] + 0.14);
    });
    tl.set("#hook", { opacity: 0 }, T.coupe);
    tl.set("#fond-hook", { opacity: 0 }, T.coupe);

    // ════ CHAOS : bouchon gris à gauche, compteur et jauge à droite ════
    const bouchon = $("bouchon");
    VOIES.slice(1).forEach((x) => { const v = document.createElement("div"); v.className = "voie"; v.style.left = x - 62 + "px"; bouchon.appendChild(v); });
    const autos = [];
    VOIES.forEach((x, k) => {
      for (let j = 0; j < 9; j++) {
        const a = document.createElement("div");
        a.className = "auto";
        a.style.background = GRIS[(k * 3 + j) % GRIS.length];
        a.style.left = x - 48 + (j % 2 ? 4 : -4) + "px";
        bouchon.appendChild(a);
        autos.push({ el: a, y: -200 + j * 220 + k * 47, k });
      }
    });
    const avance = { t: 0 };
    const majAutos = () => {
      autos.forEach((a) => {
        // Accordéon : chaque voie avance par à-coups, puis s'arrête.
        const t = avance.t + a.k * 0.37;
        const pas = Math.floor(t / 0.9) * 18 + lisse(Math.min(1, (t % 0.9) / 0.35)) * 18;
        a.el.style.transform = `translateY(${a.y + pas}px)`;
      });
    };
    tl.fromTo(avance, { t: 0 }, { t: 4, duration: 4, ease: "none", onUpdate: majAutos }, T.chaos);
    tl.set("#chaos", { opacity: 1 }, T.chaos);
    tl.fromTo("#bouchon", { x: -540 }, { x: 0, duration: 0.3, ease: "power3.out" }, T.chaos);
    tl.fromTo(".droite", { x: 540 }, { x: 0, duration: 0.3, ease: "power3.out" }, T.chaos);
    const cpt = { n: 0 };
    tl.fromTo(cpt, { n: 0 }, { n: 180, duration: T.balayage - T.chaos, ease: "power3.in",
      onUpdate: () => { $("compteur").textContent = Math.round(cpt.n); } }, T.chaos);
    tl.fromTo("#jauge", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, T.jauge);
    const st = { p: 0 };
    tl.fromTo(st, { p: 0 }, { p: 1, duration: T.balayage - T.jauge, ease: "none", onUpdate: () => {
      const monte = 1 - Math.pow(1 - Math.min(1, st.p * 1.3), 3);
      const angle = -80 + 150 * monte + Math.sin(st.p * 60) * 4 * st.p;
      $("aiguille").style.transform = `rotate(${angle}deg)`;
    } }, T.jauge);

    // ════ RUPTURE : trois pans obliques balaient le chaos, puis silence ════
    tous(".balayage i").forEach((el, i) => {
      tl.fromTo(el, { x: 0 }, { x: 3000, duration: 0.7, ease: "power3.inOut" }, T.balayage + i * 0.07);
    });
    tl.set("#chaos", { opacity: 0 }, T.balayage + 0.32);
    tl.set("#bleu", { opacity: 1 }, T.balayage + 0.4);
    tl.set("#bleu", { opacity: 0 }, T.boucle);
    // Une lueur chaude s'ouvre là où la porte va s'entrebâiller.
    tl.fromTo("#lueur", { opacity: 0, height: 0, top: 760, left: 750 }, { opacity: 1, height: 760, top: 380, duration: 0.6, ease: "power2.out" }, T.lueur);
    tl.to("#lueur", { opacity: 0, duration: 0.3 }, T.calme + 0.2);

    // ════ CALME : porte qui s'ouvre, chauffeur, textes ════
    tl.fromTo("#calme", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power1.out" }, T.calme);
    tl.fromTo("#calme", { scale: 1 }, { scale: 1.05, duration: T.boucle - T.calme, ease: "none" }, T.calme);
    tl.fromTo("#porte", { rotationY: 0 }, { rotationY: -80, duration: 1.1, ease: "power2.inOut" }, T.porte);
    tl.fromTo("#ambiance", { opacity: 0 }, { opacity: 1, duration: 0.8 }, T.porte + 0.6);
    tl.fromTo("#chauffeur", { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, T.porte + 0.3);
    tl.fromTo("#texte1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, T.texte1);
    tl.to("#texte1", { opacity: 0, y: -20, duration: 0.25 }, T.texte2 - 0.3);
    tous(".atout").forEach((el, i) => {
      tl.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, T.texte2 + i * 0.15);
    });
    tl.set("#calme", { opacity: 0 }, T.boucle);

    // ════ BOUCLE + CTA ════
    tl.set("#fin", { opacity: 1 }, T.boucle);
    tl.fromTo("#rappel", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.18, ease: "power3.out" }, T.boucle + 0.05);
    tl.set("#rappel", { opacity: 0 }, T.plus - 0.05);
    tl.set("#fin-fond", { background: "radial-gradient(80% 55% at 50% 40%, #24398f 0%, #1B2A6B 55%, #0d1538 100%)" }, T.plus);
    tl.fromTo("#plus", { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.14, ease: "power4.in" }, T.plus);
    tl.fromTo("#camera", { x: 0, y: 0 }, { keyframes: [{ x: -16, y: 9, duration: 0.04 }, { x: 11, y: -7, duration: 0.05 }, { x: 0, y: 0, duration: 0.08 }] }, T.plus + 0.14);
    tl.fromTo("#trait", { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: "power3.out" }, T.plus + 0.2);
    tl.fromTo("#logo", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, T.plus + 0.15);
    tl.fromTo("#cta", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.6)" }, T.cta);

    // Horloge maîtresse : garantit la durée totale.
    tl.to({}, { duration: T.duree }, 0);
  };
})();
