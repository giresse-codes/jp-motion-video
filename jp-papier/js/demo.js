// Démo des composants JP Papier : sert de modèle de départ pour chaque nouvelle vidéo de la série.
(function () {
  const J = window.JPPapier;
  window.CONSTRUIRE = function (tl) {
    const T = window.T, P = T.plans;
    const fin = (i) => P[i + 1] ?? T.duree;

    // Plans en fondu enchaîné + glissement (le dernier laisse la place à l'outro).
    ["#p-montre", "#p-telephone", "#p-pancarte", "#p-horloge"].forEach((p, i) => J.fondu(tl, p, P[i], fin(i), { premier: i === 0 }));

    // 1. Hook : montre + texte lisible dès l'image 1 (mots calés sur la transcription de la voix).
    J.montre(tl, { parent: "#p-montre", x: 140, y: 640, de: 0, a: P[1] });
    J.flouAvant("#p-montre", { x: -160, y: 1380, largeur: 520, hauteur: 520 });
    J.texteSurligne(tl, { de: 0, a: P[1], phrases: [[0, 0, "Dix heures."], [1.46, 3.1, "Rendez-vous avec un *investisseur."]] });

    // 2. Téléphone : les notifications s'empilent.
    J.telephone(tl, { parent: "#p-telephone", x: 250, y: 540, largeur: 580, de: P[1], heure: "09:42", date: "Mardi 21 octobre", notifications: [
      { t: 4.8, appli: "15", couleur: "#3D5BD9", titre: "Calendrier", texte: "RDV investisseur · 10:00" },
      { t: 5.7, appli: "!", couleur: "#C7811E", titre: "Trafic", texte: "Pont du Wouri : +40 min" },
    ] });
    J.texteSurligne(tl, { de: P[1], a: P[2], phrases: [[4.5, 5.4, "Le téléphone *vibre."]] });

    // 3. Pancarte du chauffeur + note manuscrite.
    J.pancarte(tl, { parent: "#p-pancarte", x: 240, y: 760, de: P[2], a: P[3], texte: "M. Serge" });
    J.noteManuscrite(tl, { parent: "#p-pancarte", x: 470, y: 1250, titre: "Trajet", lignes: ["✓ Bonanjo → Akwa", "✓ Arrivée 09:55"], t: 7.9 });
    J.texteSurligne(tl, { de: P[2], a: P[3], phrases: [[7.4, 8.4, "Son chauffeur l'*attend."]] });

    // 4. Horloge murale.
    const h = J.horloge(tl, { parent: "#p-horloge", x: 340, y: 700, taille: 400, heure: [9, 55], de: P[3] });
    J.zoomLent(tl, h, P[3], fin(3), { depart: 1, arrivee: 1.08, origine: "50% 50%" });
    J.texteSurligne(tl, { de: P[3], a: P[4], phrases: [[9.9, 10.6, "*09:55. Prêt."]] });

    // 5. Outro commune (1,5 s).
    J.outroJP(tl, { parent: "#camera", de: P[4] });

    tl.to({}, { duration: T.duree }, 0);
  };
})();
