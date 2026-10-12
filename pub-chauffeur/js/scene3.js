// Scène 3 — LA SOLUTION (solution → fin).
// WhatsApp en gros plan : le message s'écrit, le curseur l'envoie, la réponse confirme.
// Rules : zoom-blur-entrance, typewriter-sync, cursor-click, bubble-pop.

(function () {
  const { groupe, animerGroupe } = window.COMMUN;

  const MESSAGE = "Bonjour, un chauffeur à 18h15, Bonapriso → aéroport, avec 2 valises.";
  const COCHE_VERTE = `<svg viewBox="0 0 24 24" width="30" height="30" style="vertical-align:-6px"><rect width="24" height="24" rx="5" fill="#2fb24c"/><path d="M6 12.5l4 4 8-9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const POINTEUR = `<svg viewBox="0 0 24 24" width="54" height="54"><path d="M5 2l14 11-6.2.8 3.7 7.3-2.6 1.3-3.6-7.4L5 19z" fill="#fff" stroke="#1d1d1f" stroke-width="1.4" stroke-linejoin="round"/></svg>`;

  window.SCENE3 = function (tl, R) {
    // ── Sous-titres (bas) ──
    const zone = document.getElementById("s3-sous-titres");
    const defs = [
      ["Un message suffit.", "suffit."],
      ["Votre chauffeur est confirmé,", "confirmé,"],
      ["il vient vous chercher,", null],
      ["et vous arrivez à l'heure.", "à l'heure."],
      ["Un chauffeur pour la journée.", "journée."],
      ["Vos rendez-vous d'affaires.", "d'affaires."],
      ["Une balade privée dans Douala.", "Douala."],
      ["Un week-end à Limbé ou à Kribi.", "Kribi."],
    ];
    let apres = window.COMMUN.chercher("Un message suffit.")[0];
    const groupes = defs.map(([texte, cle]) => {
      const g = groupe(zone, "sous-titre", texte, apres, cle);
      apres = g.dernier;
      return g;
    });
    groupes.forEach((g, i) => {
      const entree = g.debut - 0.12;
      const sortie = i < groupes.length - 1 ? groupes[i + 1].debut - 0.12 : R.fin - 0.3;
      animerGroupe(tl, g, { entree, sortie });
    });

    // ── Téléphone : entrée en zoom depuis le flash ──
    const tel = document.getElementById("s3-telephone");
    tl.fromTo(tel, { scale: 1.35, y: 120, opacity: 0, filter: "blur(22px)" },
      { scale: 1, y: 0, opacity: 1, filter: "blur(0px)", duration: 0.75, ease: "power3.out" }, R.solution - 0.2);

    // Saisie lettre par lettre, calée sur les sons de frappe.
    const champ = document.getElementById("s3-champ");
    const frappe = { n: 0 };
    const majChamp = () => {
      const n = Math.round(frappe.n);
      champ.innerHTML = n === 0 ? '<span class="vide">Message</span>' : MESSAGE.slice(0, n) + '<span class="curseur-texte"></span>';
    };
    tl.fromTo(frappe, { n: 0 }, { n: MESSAGE.length, duration: R.envoi - R.frappe - 0.2, ease: "none", onUpdate: majChamp }, R.frappe);
    majChamp();

    // Le curseur va sur « envoyer » et clique.
    const pointeur = document.getElementById("s3-pointeur");
    pointeur.innerHTML = POINTEUR;
    const bouton = document.getElementById("s3-envoyer");
    tl.fromTo(pointeur, { x: 760, y: 1500, opacity: 0 }, { x: 830, y: 1210, opacity: 1, duration: 0.55, ease: "power2.out" }, R.envoi - 0.65);
    tl.to(pointeur, { scale: 0.85, duration: 0.07, yoyo: true, repeat: 1 }, R.envoi - 0.07);
    tl.to(bouton, { scale: 0.86, duration: 0.07, yoyo: true, repeat: 1 }, R.envoi - 0.07);
    tl.to(pointeur, { x: 900, y: 1400, opacity: 0, duration: 0.5, ease: "power2.in" }, R.envoi + 0.35);

    // Envoi : le champ se vide, la bulle monte.
    const envoyee = document.getElementById("s3-envoyee");
    // Le champ se vide à l'envoi (second tween sur le même compteur : sûr en recherche avant/arrière).
    tl.fromTo(frappe, { n: MESSAGE.length }, { n: 0, duration: 0.01, ease: "none", onUpdate: majChamp, immediateRender: false }, R.envoi);
    tl.fromTo(envoyee, { y: 140, scale: 0.9, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.6)", immediateRender: false }, R.envoi);
    // « en train d'écrire… » puis la réponse.
    tl.set("#s3-statut-ligne", { opacity: 0 }, R.envoi + 0.35);
    tl.set("#s3-statut-ecrit", { opacity: 1 }, R.envoi + 0.35);
    tl.set("#s3-statut-ligne", { opacity: 1 }, R.reponse);
    tl.set("#s3-statut-ecrit", { opacity: 0 }, R.reponse);
    const recue = document.getElementById("s3-recue");
    tl.fromTo(recue, { y: 40, scale: 0.9, opacity: 0, transformOrigin: "0% 0%" }, { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.6)", immediateRender: false }, R.reponse);
    // Confirmé : coches bleues.
    tl.to("#s3-envoyee .coches", { color: "#34a6dd", duration: 0.2 }, R.confirme);
    tl.fromTo("#s3-recue .coche-verte", { scale: 0.4 }, { scale: 1, duration: 0.45, ease: "back.out(3)", immediateRender: false }, R.confirme);
    // Léger zoom vivant sur la conversation.
    tl.fromTo(tel, { rotation: 0 }, { rotation: -1.5, duration: R.trajet - R.solution, ease: "sine.inOut", immediateRender: false }, R.solution + 0.6);

    return { MESSAGE, COCHE_VERTE };
  };
  window.SCENE3_COCHE = COCHE_VERTE;
})();
