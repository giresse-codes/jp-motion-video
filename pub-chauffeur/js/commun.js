// Outils communs : temps des mots, sous-titres mot par mot, règle-horloge.
// Tout est calculé à partir de window.VOIX (scripts/preparer-voix.py) et window.REPERES
// (scripts/mixer.py) : la vidéo et le son partagent exactement les mêmes temps.

(function () {
  const MOTS = window.VOIX.mots;
  const nettoyer = (t) => t.replace(/[.,…!?]+$/, "");

  // Écriture à l'écran d'un mot prononcé (chiffres pour les heures).
  const AFFICHAGE = { "dix-huit": "18", vingt: "20" };

  // Retrouve une suite de mots dans la voix (à partir d'un index) : renvoie leurs indices.
  function chercher(texte, apres = 0) {
    const cible = texte.split(/\s+/).map(nettoyer);
    for (let i = apres; i <= MOTS.length - cible.length; i++) {
      if (cible.every((c, k) => nettoyer(MOTS[i + k].texte) === c)) return cible.map((_, k) => i + k);
    }
    throw new Error("Mot introuvable dans la voix : " + texte);
  }

  // Construit un groupe de mots (sous-titre ou phrase centrée) dans un conteneur.
  // cle : sous-texte mis dans le bloc rouge. Renvoie { el, indices, debut, fin }.
  function groupe(conteneur, classe, texte, apres, cle) {
    const indices = chercher(texte, apres);
    const cles = cle ? chercher(cle, indices[0]) : [];
    const el = document.createElement("div");
    el.className = classe;
    let bloc = null;
    indices.forEach((i, k) => {
      const brut = MOTS[i].texte;
      const affiche = brut.replace(/^[^.,…!?]+/, (m) => AFFICHAGE[m] || m);
      const span = document.createElement("span");
      span.className = "m";
      span.dataset.i = i;
      span.textContent = affiche;
      const dansBloc = cles.includes(i);
      if (dansBloc && !bloc) {
        bloc = document.createElement("span");
        bloc.className = "bloc";
        bloc.innerHTML = '<span class="bloc-fond"></span>';
        if (k > 0) el.appendChild(document.createTextNode(" "));
        el.appendChild(bloc);
      }
      if (!dansBloc && bloc) bloc = null;
      if (k > 0 && !dansBloc) el.appendChild(document.createTextNode(" "));
      if (dansBloc && bloc.childElementCount > 1) bloc.appendChild(document.createTextNode(" "));
      (dansBloc ? bloc : el).appendChild(span);
    });
    conteneur.appendChild(el);
    return {
      el,
      indices,
      cles,
      debut: MOTS[indices[0]].debut,
      fin: MOTS[indices[indices.length - 1]].fin,
      dernier: indices[indices.length - 1],
    };
  }

  // Anime un groupe : apparition, mots gris -> couleur au moment exact, bloc rouge qui s'étire.
  function animerGroupe(tl, g, opts) {
    const { entree, sortie, couleur = "#1d1d1f", couleurBloc = "#fbf8f3" } = opts;
    tl.set(g.el, { opacity: 1 }, entree);
    if (sortie != null) tl.set(g.el, { opacity: 0 }, sortie);
    g.el.querySelectorAll(".m").forEach((s) => {
      const m = MOTS[+s.dataset.i];
      const dansBloc = s.parentElement.classList.contains("bloc");
      tl.to(s, { color: dansBloc ? couleurBloc : couleur, duration: 0.1, ease: "none" }, m.debut);
    });
    g.el.querySelectorAll(".bloc").forEach((b) => {
      const premier = MOTS[+b.querySelector(".m").dataset.i];
      const fond = b.querySelector(".bloc-fond");
      tl.fromTo(fond, { scaleX: 0 }, { scaleX: 1, duration: 0.28, ease: "power3.out", immediateRender: false }, premier.debut - 0.06);
      // Avant d'être prononcés, les mots du bloc sont blanc translucide sur le rouge.
      tl.set(b.querySelectorAll(".m"), { color: "rgba(251,248,243,0.45)" }, premier.debut - 0.06);
    });
  }

  // ── Règle-horloge : graduations à la minute, étiquettes toutes les 15 min ──
  const PX_MINUTE = 26;
  const MIN_DEBUT = 17 * 60 + 30;
  const MIN_FIN = 20 * 60 + 40;
  const TETE_X = 150;

  function regle(parent, { drapeau = "VOL 20:00" } = {}) {
    const zone = document.createElement("div");
    zone.className = "regle";
    const bande = document.createElement("div");
    bande.className = "regle-bande";
    bande.style.width = (MIN_FIN - MIN_DEBUT) * PX_MINUTE + "px";
    bande.innerHTML = '<div class="regle-ligne"></div>';
    for (let m = MIN_DEBUT; m <= MIN_FIN; m++) {
      const x = (m - MIN_DEBUT) * PX_MINUTE;
      const g = document.createElement("div");
      g.className = "graduation" + (m % 15 === 0 ? " forte" : m % 5 === 0 ? " moyenne" : "");
      g.style.left = x + "px";
      bande.appendChild(g);
      if (m % 15 === 0) {
        const l = document.createElement("div");
        l.className = "graduation-label";
        l.style.left = x + "px";
        l.textContent = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
        bande.appendChild(l);
      }
    }
    const d = document.createElement("div");
    d.className = "drapeau-vol";
    d.style.left = (20 * 60 - MIN_DEBUT) * PX_MINUTE + "px";
    d.innerHTML = `<span>${drapeau}</span>`;
    bande.appendChild(d);
    zone.appendChild(bande);
    parent.appendChild(zone);
    return { zone, bande, drapeau: d };
  }
  // Position de la bande pour qu'une minute donnée soit sous la tête de lecture.
  const decalage = (minute) => TETE_X - (minute - MIN_DEBUT) * PX_MINUTE;
  const hhmm = (minute) => {
    const m = Math.floor(minute + 1e-6);
    return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  };

  window.COMMUN = { MOTS, chercher, groupe, animerGroupe, regle, decalage, hhmm, PX_MINUTE };
})();
