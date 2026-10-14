// Pub « destinations » — JP Service Express Urbaine (25 s, sans voix off).
// Style de la référence transposé : éclaboussure liquide rouge, barre de recherche en verre où la
// question s'écrit, carrousel de photos en orbite, destinations mises en avant une à une, glissement
// vers une page blanche où le texte se défloute mot à mot, bouton cliqué, conversation, fin.
// Tout est calculé à partir du temps (window.T) : déterministe, sûr en recherche avant/arrière.

(function () {
  const PHOTOS = {
    limbe: "assets/photos/limbe.jpg", yaounde: "assets/photos/yaounde.jpg", buea: "assets/photos/buea.jpg",
    kribi: "assets/photos/kribi.jpg", ouest: "assets/photos/ouest.jpg", douala: "assets/photos/douala.jpg",
  };
  const DESTINATIONS = [
    { cle: "limbe", nom: "Limbé", region: "Sud-Ouest · la mer" },
    { cle: "yaounde", nom: "Yaoundé", region: "Centre · la capitale" },
    { cle: "buea", nom: "Buéa", region: "Sud-Ouest · le mont Cameroun" },
    { cle: "kribi", nom: "Kribi", region: "Sud · les plages" },
    { cle: "ouest", nom: "l'Ouest", region: "Ouest · les chefferies" },
  ];
  const Q1 = "Tu recherches une destination ?";
  const Q2 = "Ou tu programmes un voyage ?";
  const CX = 510, CY = 1080; // centre de la barre de recherche
  const POINTEUR = `<svg viewBox="0 0 24 24" width="60" height="60"><path d="M5 2l14 11-6.2.8 3.7 7.3-2.6 1.3-3.6-7.4L5 19z" fill="#fff" stroke="#17171a" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lisse = (v) => v * v * (3 - 2 * v);

  window.CONSTRUIRE = function (tl) {
    const T = window.T;
    const $ = (id) => document.getElementById(id);

    // ════ Éclaboussure rouge (forme organique calculée) ════
    const forme = $("splash-forme");
    const goutte = (x, y, r) => `M${(x + r).toFixed(1)} ${y.toFixed(1)}a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(-2 * r).toFixed(1)} 0a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(2 * r).toFixed(1)} 0z`;
    const etat = { R: 0, t: 0 };
    function majSplash() {
      const { R, t } = etat;
      if (R <= 0.5) { forme.setAttribute("d", ""); return; }
      const N = 28, pts = [];
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2;
        const r = R * (1 + 0.14 * Math.sin(3 * a + 6 * t + 1) + 0.07 * Math.sin(5 * a - 9 * t) + 0.05 * Math.sin(9 * a + 4 * t));
        pts.push([CX + r * Math.cos(a), CY + r * Math.sin(a) * 1.12]);
      }
      // Courbe lisse fermée (Catmull-Rom -> Bézier).
      let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
      for (let i = 0; i < N; i++) {
        const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
      }
      // Gouttelettes projetées autour.
      for (let k = 0; k < 7; k++) {
        const a = k * 0.9 + 0.4, dist = R * (1.25 + 0.12 * Math.sin(t * 3 + k)), rr = Math.max(0, R * (0.07 + 0.03 * (k % 3)));
        d += goutte(CX + dist * Math.cos(a), CY + dist * Math.sin(a) * 1.12, rr);
      }
      forme.setAttribute("d", d);
    }
    tl.fromTo(etat, { t: 0 }, { t: T.page, duration: T.page, ease: "none", onUpdate: majSplash }, 0);
    tl.fromTo(etat, { R: 0 }, { R: 300, duration: 0.55, ease: "back.out(1.7)", onUpdate: majSplash }, 0.05);
    tl.fromTo(etat, { R: 300 }, { R: 1700, duration: T.couvert - 0.6, ease: "power2.in", onUpdate: majSplash, immediateRender: false }, 0.6);
    majSplash();
    tl.fromTo("#reflets", { x: -120 }, { x: 160, duration: T.page, ease: "none" }, 0);

    // ════ Barre de recherche ════
    const boite = $("recherche");
    tl.fromTo(boite, { scale: 0.32, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.0, ease: "power3.out" }, 0.15);
    const champ = $("recherche-texte");
    function texteA(t) {
      const tape = (txt, t0, t1) => txt.slice(0, Math.round(txt.length * clamp((t - t0) / (t1 - t0))));
      let html, frappe = false;
      if (t < T.q1) html = '<span class="vide">Où veux-tu aller ?</span>';
      else if (t < T.efface) { html = tape(Q1, T.q1, T.q1Fin); frappe = t < T.q1Fin; }
      else if (t < T.q2) { html = Q1.slice(0, Math.round(Q1.length * (1 - clamp((t - T.efface) / 0.2)))); frappe = true; }
      else if (t < T.dest[0]) { html = tape(Q2, T.q2, T.q2Fin); frappe = t < T.q2Fin; }
      else {
        let i = 0;
        while (i < T.dest.length - 1 && t >= T.dest[i + 1]) i++;
        const nom = DESTINATIONS[i].nom, ecrit = tape("À " + nom + " ?", T.dest[i], T.dest[i] + 0.3);
        frappe = t < T.dest[i] + 0.3;
        html = ecrit.length > 2 ? "À " + `<span class="rouge">${ecrit.slice(2, 2 + nom.length)}</span>` + ecrit.slice(2 + nom.length) : ecrit;
      }
      const curseur = t >= T.q1 && (frappe || Math.floor(t * 2.2) % 2 === 0) ? '<span class="curseur-texte"></span>' : "";
      champ.innerHTML = html + curseur;
    }
    // Petite pression sur « envoyer » à chaque question.
    [T.q1Fin + 0.15, T.q2Fin + 0.15].forEach((t) => tl.to("#recherche-envoyer", { scale: 0.86, duration: 0.08, yoyo: true, repeat: 1 }, t));

    // ════ Carrousel de photos en orbite ════
    const orbite = $("orbite");
    const cles = ["limbe", "yaounde", "buea", "kribi", "ouest", "douala"];
    const vignettes = Array.from({ length: 12 }, (_, i) => {
      const v = document.createElement("div");
      v.className = "vignette-photo";
      v.style.backgroundImage = `url(${PHOTOS[cles[i % 6]]})`;
      orbite.appendChild(v);
      return v;
    });
    boite.style.zIndex = 3;
    orbite.style.zIndex = "auto";
    function majOrbite(t) {
      vignettes.forEach((v, i) => {
        const k = lisse(clamp((t - T.orbite - i * 0.05) / 0.7));
        const sortie = lisse(clamp((t - (T.destFin - 0.2)) / 0.45));
        const a = (i / 12) * Math.PI * 2 + (t - T.orbite) * 0.55;
        const prof = Math.sin(a); // 1 = devant
        const rx = 440 * k * (1 + 0.6 * sortie), ry = 560 * k * (1 + 0.6 * sortie);
        const x = CX + rx * Math.cos(a) - 85, y = CY + ry * prof * 0.92 - 107;
        const echelle = (0.62 + 0.38 * (prof + 1) / 2) * (0.4 + 0.6 * k);
        const attenue = t >= T.dest[0] - 0.2 && t < T.destFin ? 0.55 : 1;
        v.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${echelle.toFixed(3)}) rotate(${(Math.cos(a) * 6).toFixed(1)}deg)`;
        v.style.opacity = (k * attenue * (1 - sortie)).toFixed(3);
        v.style.filter = `blur(${((1 - prof) * 1.6 + (attenue < 1 ? 5 : 0)).toFixed(1)}px)`;
        v.style.zIndex = prof > 0.2 ? 4 : 1;
      });
    }
    texteA(0); majOrbite(0);
    // Une seule horloge écrit le texte de la recherche et la position des vignettes.
    const horloge = { t: 0 };
    tl.fromTo(horloge, { t: 0 }, { t: T.page, duration: T.page, ease: "none", onUpdate: () => { texteA(horloge.t); majOrbite(horloge.t); } }, 0);

    // ════ Destinations mises en avant ════
    const modele = $("destination");
    DESTINATIONS.forEach((d, i) => {
      const c = i === 0 ? modele : modele.cloneNode(true);
      if (i) modele.parentNode.insertBefore(c, modele.nextSibling);
      c.id = "destination-" + i;
      c.style.backgroundImage = `url(${PHOTOS[d.cle]})`;
      c.style.zIndex = 5;
      c.querySelector(".destination-nom").textContent = d.nom;
      c.querySelector(".destination-region").textContent = d.region;
      c.querySelector(".destination-num").textContent = `0${i + 1} / 05`;
      const t0 = T.dest[i];
      tl.fromTo(c, { opacity: 0, scale: 0.35, y: 520, rotation: i % 2 ? 8 : -8, filter: "blur(12px)" },
        { opacity: 1, scale: 1, y: 0, rotation: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out" }, t0);
      tl.to(c, { scale: 1.05, duration: 0.45, ease: "none" }, t0 + 0.45);
      tl.to(c, { opacity: 0, scale: 0.86, y: -90, filter: "blur(10px)", duration: 0.2, ease: "power2.in" }, t0 + 0.8);
    });

    // ════ Glissement vers la page blanche ════
    tl.to(boite, { x: -760, opacity: 0, filter: "blur(10px)", duration: 0.5, ease: "power3.inOut" }, T.page);
    tl.fromTo("#page", { x: 1080 }, { x: 0, duration: 0.55, ease: "power3.inOut" }, T.page);

    // Mots qui se défloutent un à un.
    function mots(conteneur, texte, cles = [], bloc = null) {
      conteneur.innerHTML = "";
      const liste = [];
      let blocEl = null;
      texte.split(" ").forEach((m, i, tous) => {
        const s = document.createElement("span");
        s.className = "m" + (cles.includes(m.replace(/[.,]/g, "")) ? " cle" : "");
        s.textContent = m;
        if (bloc && bloc.includes(i)) {
          if (!blocEl) {
            blocEl = document.createElement("span");
            blocEl.className = "bloc-rouge";
            blocEl.innerHTML = '<span class="bloc-rouge-fond"></span>';
            conteneur.appendChild(blocEl);
          } else blocEl.appendChild(document.createTextNode(" "));
          blocEl.appendChild(s);
        } else {
          conteneur.appendChild(s);
        }
        if (i < tous.length - 1 && !(bloc && bloc.includes(i) && bloc.includes(i + 1))) conteneur.appendChild(document.createTextNode(" "));
        liste.push(s);
      });
      return liste;
    }
    const titre = mots($("titre-solution"), "Nous sommes la solution.", [], [2, 3]);
    tl.fromTo(titre, { opacity: 0, y: 40, filter: "blur(14px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out", stagger: 0.12 }, T.solution);
    tl.fromTo("#titre-solution .bloc-rouge-fond", { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: "power3.out", immediateRender: false }, T.solution + 0.3);
    tl.to("#titre-solution", { y: -160, opacity: 0, filter: "blur(10px)", duration: 0.35, ease: "power2.in" }, T.engagement - 0.3);

    tl.fromTo("#marque-ligne", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, T.engagement);
    const engage = mots($("engagement"), "JP Service Express Urbaine s'engage comme moyen de transport qui allie confort et sécurité.", ["confort", "sécurité"]);
    tl.fromTo(engage, { opacity: 0, y: 26, filter: "blur(12px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power2.out", stagger: 0.075 }, T.engagement + 0.1);
    tl.fromTo("#engagement .cle", { scale: 1 }, { scale: 1.08, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false, stagger: 0.25 }, T.engagement + 1.35);

    tl.fromTo("#simple", { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power3.out" }, T.simple);
    tl.fromTo("#bouton-wa", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, T.bouton);
    const pointeur = $("pointeur");
    pointeur.innerHTML = POINTEUR;
    tl.fromTo(pointeur, { x: 900, y: 1700, opacity: 0 }, { x: 520, y: 1306, opacity: 1, duration: 0.6, ease: "power2.out" }, T.clic - 0.65);
    tl.to(pointeur, { scale: 0.85, duration: 0.07, yoyo: true, repeat: 1 }, T.clic - 0.03);
    tl.to("#bouton-wa", { scale: 0.94, duration: 0.07, yoyo: true, repeat: 1 }, T.clic - 0.03);
    tl.fromTo("#onde", { opacity: 0.9, scale: 1 }, { opacity: 0, scale: 14, duration: 0.6, ease: "power2.out", immediateRender: false }, T.clic);
    tl.to(pointeur, { opacity: 0, x: 640, y: 1500, duration: 0.4, ease: "power2.in" }, T.clic + 0.25);

    // ════ Conversation : message, confirmation, on vient te chercher ════
    tl.to(["#marque-ligne", "#engagement", "#simple", "#bouton-wa"], { y: -220, opacity: 0, filter: "blur(10px)", duration: 0.35, ease: "power2.in", stagger: 0.03 }, T.chat - 0.3);
    tl.fromTo("#chat", { y: 1700, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, T.chat);
    const bulle = (id, t) => tl.fromTo(id, { opacity: 0, y: 30, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.8)", immediateRender: false }, t);
    bulle("#bulle-1", T.bulle1);
    tl.set("#ecrit", { opacity: 1 }, T.ecrit);
    tl.set("#ecrit", { opacity: 0 }, T.bulle2);
    tl.fromTo("#ecrit span", { y: 0 }, { y: -8, duration: 0.15, yoyo: true, repeat: 3, stagger: 0.08, immediateRender: false }, T.ecrit);
    bulle("#bulle-2", T.bulle2);
    bulle("#bulle-3", T.bulle3);
    [["#etape-1", T.bulle1, T.bulle2], ["#etape-2", T.bulle2, T.bulle3], ["#etape-3", T.bulle3, null]].forEach(([id, a, b]) => {
      tl.fromTo(id, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }, a);
      if (b) tl.to(id, { opacity: 0, y: -30, duration: 0.2 }, b - 0.05);
    });

    // ════ Fin ════
    tl.fromTo("#anneau", { opacity: 1, scale: 0 }, { opacity: 0, scale: 260, duration: 0.7, ease: "power2.out" }, T.fin - 0.05);
    tl.fromTo("#fin-fond", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, T.fin);
    tl.fromTo("#logo-fin", { opacity: 0, scale: 1.4, filter: "blur(16px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "power4.out" }, T.logo);
    tl.fromTo("#accroche-fin", { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out" }, T.accroche);
    tl.fromTo("#qualites", { opacity: 0 }, { opacity: 1, duration: 0.4 }, T.accroche + 0.35);
    tl.fromTo("#pastille-fin", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, T.pastille);
    tl.to("#pastille-fin", { scale: 1.04, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }, T.pastille + 0.6);
  };
})();
