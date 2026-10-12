// Scène 3 — LA SOLUTION (solution → fin).
// WhatsApp en gros plan : le message s'écrit, le curseur l'envoie, la réponse confirme.
// Rules : zoom-blur-entrance, typewriter-sync, cursor-click, bubble-pop.

(function () {
  const { groupe, animerGroupe } = window.COMMUN;

  const MESSAGE = "Bonjour, un chauffeur à 18h15, Bonapriso → aéroport, avec 2 valises.";
  const COCHE_VERTE = `<svg viewBox="0 0 24 24" width="30" height="30" style="vertical-align:-6px"><rect width="24" height="24" rx="5" fill="#2fb24c"/><path d="M6 12.5l4 4 8-9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const POINTEUR = `<svg viewBox="0 0 24 24" width="54" height="54"><path d="M5 2l14 11-6.2.8 3.7 7.3-2.6 1.3-3.6-7.4L5 19z" fill="#fff" stroke="#1d1d1f" stroke-width="1.4" stroke-linejoin="round"/></svg>`;

  // Carte du trajet : approche vers Bonapriso puis route jusqu'à l'aéroport.
  const CARTE_TRAJET = `<svg viewBox="0 0 840 760" width="840" height="760">
    <rect width="840" height="760" fill="#ece5d9"/>
    <path d="M0 160 C120 190 170 300 150 420 C135 520 70 610 0 650 Z" fill="#cdd6d6"/>
    <g stroke="#f7f3ec" stroke-width="10" stroke-linecap="round" fill="none">
      <path d="M200 170 L780 170"/><path d="M180 300 L800 300"/><path d="M190 600 L780 600"/>
      <path d="M300 130 L300 700"/><path d="M460 130 L460 710"/><path d="M620 130 L620 700"/>
    </g>
    <path id="route-approche" d="M270 130 C270 230 280 330 290 420" fill="none" stroke="none"/>
    <path d="M290 420 C380 400 450 360 540 380 C630 400 660 480 700 560" fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round"/>
    <path id="route-aeroport" d="M290 420 C380 400 450 360 540 380 C630 400 660 480 700 560" fill="none" stroke="none"/>
    <path id="route-trace" d="M290 420 C380 400 450 360 540 380 C630 400 660 480 700 560" fill="none" stroke="#e10600" stroke-width="10" stroke-linecap="round"/>
    <g font-family="Space Mono, monospace" font-size="22" fill="#8c857b" letter-spacing="2">
      <text x="330" y="250">AKWA</text><text x="500" y="460">BALI</text><text x="34" y="390" fill="#9fb0b0">WOURI</text>
    </g>
    <circle cx="290" cy="420" r="20" fill="#1d1d1f"/><circle cx="290" cy="420" r="8" fill="#fbf8f3"/>
    <text x="196" y="470" font-family="Inter" font-weight="700" font-size="26" fill="#1d1d1f">Bonapriso</text>
    <g id="s3-pin-arrivee"><circle cx="700" cy="560" r="30" fill="#fbf8f3" stroke="#1d1d1f" stroke-width="4"/>
      <path transform="translate(682 542) scale(1.5)" fill="#1d1d1f" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></g>
    <text x="612" y="632" font-family="Inter" font-weight="700" font-size="26" fill="#1d1d1f">Aéroport</text>
    <g id="voiture"><g transform="translate(-30 -15)">
      <rect width="60" height="30" rx="9" fill="#1d1d1f"/><rect x="34" y="4" width="12" height="22" rx="3" fill="#5d6a73"/>
      <rect x="10" y="5" width="9" height="20" rx="3" fill="#5d6a73"/><rect x="56" y="5" width="4" height="6" rx="1" fill="#fff4cf"/><rect x="56" y="19" width="4" height="6" rx="1" fill="#fff4cf"/>
    </g></g>
  </svg>`;

  // Illustrations des 4 usages (palette de la charte, un seul accent rouge par carte).
  const ILLUS_JOURNEE = `<svg viewBox="0 0 352 270" width="352" height="270">
    <circle cx="176" cy="150" r="88" fill="#fbf8f3" stroke="#1d1d1f" stroke-width="6"/>
    ${Array.from({ length: 12 }, (_, k) => { const a = (k * 30 * Math.PI) / 180; return `<line x1="${176 + 74 * Math.sin(a)}" y1="${150 - 74 * Math.cos(a)}" x2="${176 + 82 * Math.sin(a)}" y2="${150 - 82 * Math.cos(a)}" stroke="#1d1d1f" stroke-width="4"/>`; }).join("")}
    <path d="M176 150 A60 60 0 1 1 116 150" fill="none" stroke="#e10600" stroke-width="10" stroke-linecap="round"/>
    <line x1="176" y1="150" x2="176" y2="102" stroke="#1d1d1f" stroke-width="7" stroke-linecap="round"/>
    <line x1="176" y1="150" x2="214" y2="168" stroke="#1d1d1f" stroke-width="7" stroke-linecap="round"/>
    <text x="40" y="58" font-family="Space Mono, monospace" font-weight="700" font-size="24" fill="#8c857b">08:00</text>
    <text x="244" y="58" font-family="Space Mono, monospace" font-weight="700" font-size="24" fill="#8c857b">18:00</text>
  </svg>`;
  const ILLUS_AFFAIRES = `<svg viewBox="0 0 352 270" width="352" height="270">
    <rect x="40" y="70" width="60" height="170" fill="#d9d1c4"/><rect x="250" y="40" width="70" height="200" fill="#d9d1c4"/>
    ${[0, 1, 2, 3, 4, 5].map((k) => `<rect x="52" y="${86 + k * 24}" width="36" height="10" fill="#efe8dd"/><rect x="262" y="${58 + k * 28}" width="46" height="10" fill="#efe8dd"/>`).join("")}
    <rect x="106" y="120" width="140" height="104" rx="14" fill="#1d1d1f"/>
    <path d="M150 120 v-18 a10 10 0 0 1 10 -10 h32 a10 10 0 0 1 10 10 v18" fill="none" stroke="#1d1d1f" stroke-width="10"/>
    <rect x="106" y="160" width="140" height="8" fill="#3a3533"/><rect x="166" y="154" width="20" height="20" rx="4" fill="#e10600"/>
    <rect x="20" y="240" width="312" height="6" fill="#bdb5aa"/>
  </svg>`;
  const ILLUS_BALADE = `<svg viewBox="0 0 352 270" width="352" height="270">
    <rect y="170" width="352" height="100" fill="#cdd6d6"/>
    <path d="M0 150 L352 150" stroke="#1d1d1f" stroke-width="8"/>
    ${[30, 100, 170, 240, 310].map((x) => `<line x1="${x}" y1="150" x2="${x}" y2="200" stroke="#1d1d1f" stroke-width="7"/>`).join("")}
    <path d="M0 150 Q88 112 176 150 Q264 112 352 150" fill="none" stroke="#8c857b" stroke-width="4"/>
    <rect x="200" y="128" width="54" height="20" rx="6" fill="#e10600"/>
    <path d="M60 150 C58 110 62 80 72 60" stroke="#5a463a" stroke-width="7" fill="none"/>
    <g fill="#2f6b4a"><path d="M72 60 C54 46 34 50 24 62 C40 56 56 58 72 64Z"/><path d="M72 60 C90 44 110 48 120 60 C104 55 88 58 72 64Z"/><path d="M72 58 C66 38 54 30 44 32 C58 38 66 46 70 60Z"/></g>
    <text x="196" y="236" font-family="Space Mono, monospace" font-weight="700" font-size="22" fill="#6f8b8b">WOURI</text>
  </svg>`;
  const ILLUS_VOYAGE = `<svg viewBox="0 0 352 270" width="352" height="270">
    <path d="M176 250 C120 200 260 150 190 100 C150 72 180 50 176 40" fill="none" stroke="#1d1d1f" stroke-width="22" stroke-linecap="round"/>
    <path d="M176 250 C120 200 260 150 190 100 C150 72 180 50 176 40" fill="none" stroke="#fbf8f3" stroke-width="3" stroke-dasharray="10 12"/>
    ${[["Limbé", 60, 150], ["Kribi", 250, 200], ["Yaoundé", 210, 62]].map(([n, x, y], k) => `<circle cx="${x}" cy="${y}" r="11" fill="${k === 2 ? "#e10600" : "#1d1d1f"}"/><text x="${x + 18}" y="${y + 8}" font-family="Inter" font-weight="700" font-size="24" fill="#1d1d1f">${n}</text>`).join("")}
  </svg>`;
  const USAGES = [
    { titre: "Un chauffeur pour la journée", illus: ILLUS_JOURNEE, prix: "Confort · <b>4 000 FCFA/h</b>" },
    { titre: "Vos rendez-vous d'affaires", illus: ILLUS_AFFAIRES },
    { titre: "Une balade privée dans Douala", illus: ILLUS_BALADE },
    { titre: "Limbé, Kribi, Yaoundé", illus: ILLUS_VOYAGE, prix: "Voyage · dès <b>50 000 FCFA/jour</b>" },
  ];

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

    // ════ Trajet : prise en charge à Bonapriso, puis route jusqu'à l'aéroport ════
    const { regle, decalage, hhmm } = window.COMMUN;
    const trajet = document.getElementById("s3-trajet");
    trajet.insertAdjacentHTML("afterbegin", CARTE_TRAJET);
    const route = trajet.querySelector("#route-aeroport");
    const approche = trajet.querySelector("#route-approche");
    const trace = trajet.querySelector("#route-trace");
    const voiture = trajet.querySelector("#voiture");
    const Lr = route.getTotalLength(), La = approche.getTotalLength();
    trace.style.strokeDasharray = `${Lr}`;
    trace.style.strokeDashoffset = `${Lr}`;
    const poser = (chemin, L, p) => {
      const a = chemin.getPointAtLength(Math.max(0, Math.min(L, p * L)));
      const b = chemin.getPointAtLength(Math.max(0, Math.min(L, p * L + 2)));
      const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      voiture.setAttribute("transform", `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
    };
    const pos = { approche: 0, route: 0 };
    const majVoiture = () => {
      if (pos.route > 0) {
        poser(route, Lr, pos.route);
        trace.style.strokeDashoffset = `${(Lr * (1 - pos.route)).toFixed(1)}`;
      } else {
        poser(approche, La, pos.approche);
        trace.style.strokeDashoffset = `${Lr}`;
      }
    };
    majVoiture();
    const depart = R.trajet + 1.5; // « et vous arrivez à l'heure »
    // Sortie du téléphone, entrée de la carte du trajet.
    tl.to(tel, { scale: 0.7, x: -700, opacity: 0, filter: "blur(16px)", duration: 0.45, ease: "power2.in" }, R.trajet - 0.4);
    tl.fromTo(trajet, { scale: 0.88, x: 500, opacity: 0, filter: "blur(16px)" },
      { scale: 1, x: 0, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out" }, R.trajet - 0.2);
    tl.fromTo(pos, { approche: 0 }, { approche: 1, duration: 1.0, ease: "power2.inOut", onUpdate: majVoiture }, R.trajet);
    tl.fromTo(pos, { route: 0 }, { route: 1, duration: R.arrivee - depart, ease: "power1.inOut", onUpdate: majVoiture, immediateRender: false }, depart);
    // État et heure du trajet.
    const etat = document.getElementById("s3-etat");
    const hTrajet = document.getElementById("s3-heure-trajet");
    const rT = regle(document.getElementById("s3-regle"));
    const bandeT = rT.bande, hS3 = document.getElementById("s3-heure");
    const horlogeT = { minute: 18 * 60 + 8 };
    const majH = () => {
      hTrajet.textContent = hhmm(horlogeT.minute).replace(":", "h");
      bandeT.style.transform = `translateX(${decalage(horlogeT.minute).toFixed(1)}px)`;
      hS3.textContent = hhmm(horlogeT.minute);
    };
    tl.fromTo(horlogeT, { minute: 18 * 60 + 8 }, { minute: 18 * 60 + 10, duration: 1.0, ease: "none", onUpdate: majH }, R.trajet);
    tl.fromTo(horlogeT, { minute: 18 * 60 + 10 }, { minute: 18 * 60 + 15, duration: depart - R.trajet - 1.0, ease: "none", onUpdate: majH, immediateRender: false }, R.trajet + 1.0);
    tl.fromTo(horlogeT, { minute: 18 * 60 + 15 }, { minute: 18 * 60 + 52, duration: R.arrivee - depart, ease: "power1.inOut", onUpdate: majH, immediateRender: false }, depart);
    majH();
    etat.innerHTML = '<span id="s3-etat-1">Votre chauffeur arrive</span><span id="s3-etat-2" style="position:absolute;left:0;top:0;opacity:0;white-space:nowrap">En route vers l\'aéroport</span><span id="s3-etat-3" style="position:absolute;left:0;top:0;opacity:0;white-space:nowrap">Arrivé à l\'heure</span>';
    tl.set("#s3-etat-1", { opacity: 0 }, depart);
    tl.set("#s3-etat-2", { opacity: 1 }, depart);
    tl.set("#s3-etat-2", { opacity: 0 }, R.arrivee);
    tl.set("#s3-etat-3", { opacity: 1 }, R.arrivee);
    tl.fromTo(trajet.querySelector(".heure-arrivee .ok"), { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(3)", immediateRender: false }, R.arrivee);
    tl.fromTo(trajet.querySelector(".heure-arrivee"), { scale: 1 }, { scale: 1.12, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, R.arrivee);
    tl.fromTo("#s3-pin-arrivee", { scale: 1 }, { scale: 1.35, duration: 0.2, yoyo: true, repeat: 1, transformOrigin: "50% 50%", immediateRender: false }, R.arrivee);
    // Règle-horloge pendant le trajet : le vol de 20:00 reste loin.
    tl.to("#s3-horloge", { opacity: 1, duration: 0.4 }, R.trajet - 0.1);
    tl.to("#s3-horloge", { opacity: 0, duration: 0.3 }, R.cartes[0] - 0.35);
    tl.to(trajet, { scale: 0.8, y: -120, opacity: 0, filter: "blur(14px)", duration: 0.45, ease: "power2.in" }, R.cartes[0] - 0.4);

    // ════ Cartes d'usages en éventail ════
    const zoneU = document.getElementById("s3-usages");
    const EVENTAIL = [
      { x: -190, y: 50, r: -11 },
      { x: -64, y: 14, r: -4 },
      { x: 64, y: 14, r: 4 },
      { x: 190, y: 50, r: 11 },
    ];
    const cartes = USAGES.map((u, i) => {
      const c = document.createElement("div");
      c.className = "objet carte-ui usage";
      c.innerHTML = `<div class="usage-illus">${u.illus}</div><div class="usage-num">0${i + 1} / 04</div>
        <div class="usage-titre">${u.titre}</div>${u.prix ? `<div class="usage-prix">${u.prix}</div>` : ""}`;
      zoneU.appendChild(c);
      return c;
    });
    cartes.forEach((c, i) => {
      const t = R.cartes[i];
      // Entrée : monte du bas, se pose au centre, légèrement agrandie.
      tl.fromTo(c, { x: 0, y: 1400, rotation: 8 - i * 4, scale: 1.05, opacity: 0, filter: "blur(10px)" },
        { x: 0, y: -30, rotation: 0, scale: 1.05, opacity: 1, filter: "blur(0px)", duration: 0.55, ease: "power3.out" }, t);
      // Dès que la suivante arrive, elle rejoint sa place dans l'éventail.
      const suivante = i < 3 ? R.cartes[i + 1] : R.fin - 1.2;
      tl.to(c, { x: EVENTAIL[i].x, y: EVENTAIL[i].y, rotation: EVENTAIL[i].r, scale: 0.86, duration: 0.6, ease: "power3.inOut" }, suivante - 0.05);
    });
    // Sortie : l'éventail file vers la caméra (zoom flou) pour la bascule vers la fin.
    tl.to(cartes, { scale: 2.4, opacity: 0, filter: "blur(24px)", duration: 0.5, ease: "power3.in", stagger: 0.03 }, R.fin - 0.5);

    return { MESSAGE, COCHE_VERTE };
  };
  window.SCENE3_COCHE = COCHE_VERTE;
})();
