// « FAQ express » — JP Service Express Urbaine (23,8 s, 9:16, style JP PREMIUM, voix off fournie).
// Hook ÉNERGIE (pluie de bulles « ? » en 3D), 5 cartes vitrées qui se retournent en ambiance LUXE (compteur 1/5 … 5/5),
// éventail final « Enregistre pour plus tard », outro projecteur. Timeline GSAP en pause ; la pluie de bulles et le
// compteur sont des fonctions pures du temps (sûrs au seek, boucle parfaite sur la durée totale).

(function () {
  const NS = "http://www.w3.org/2000/svg";
  const $ = (id) => document.getElementById(id);
  const clamp = (v) => Math.max(0, Math.min(1, v));
  function hasard(graine) {
    return function () {
      graine |= 0; graine = (graine + 0x6D2B79F5) | 0;
      let t = Math.imul(graine ^ (graine >>> 15), 1 | graine);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function mots(el, liste) {
    el.innerHTML = "";
    return liste.map(([, m]) => {
      const s = document.createElement("span");
      s.className = "mot" + (m.startsWith("*") ? " cle" : "");
      s.textContent = m.replace(/^\*/, "");
      el.appendChild(s);
      return s;
    });
  }

  const BULLE = '<svg viewBox="0 0 150 130"><defs><linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#FFE7B8"/></linearGradient></defs>' +
    '<path d="M20 8 H130 Q146 8 146 24 V82 Q146 98 130 98 H62 L34 124 L40 98 H20 Q4 98 4 82 V24 Q4 8 20 8 Z" fill="url(#gb)"/>' +
    '<path d="M22 16 H110" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/>' +
    '<text x="75" y="80" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="72" fill="#F08A24">?</text></svg>';
  const ICONES = {
    pompe: '<svg viewBox="0 0 64 64"><rect x="10" y="10" width="28" height="44" rx="5" fill="#0B1B4D"/><rect x="15" y="16" width="18" height="12" rx="2" fill="#F5B82E"/><path d="M38 22 L48 30 V48 Q48 54 53 54 Q58 54 58 48 V24 L52 18" fill="none" stroke="#0B1B4D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="6" y="52" width="36" height="6" rx="3" fill="#0B1B4D"/></svg>',
    wifi: '<svg viewBox="0 0 64 64"><g fill="none" stroke="#0B1B4D" stroke-width="6" stroke-linecap="round"><path d="M8 26 Q32 4 56 26"/><path d="M17 35 Q32 22 47 35"/><path d="M26 44 Q32 39 38 44"/></g><circle cx="32" cy="52" r="4.5" fill="#0B1B4D"/></svg>',
    flocon: '<svg viewBox="0 0 64 64"><g stroke="#3D5BD9" stroke-width="4.5" stroke-linecap="round" fill="none"><path d="M32 6 V58 M9.5 19 L54.5 45 M9.5 45 L54.5 19"/><path d="M24 10 L32 18 L40 10 M24 54 L32 46 L40 54"/></g></svg>',
    bulle: '<svg viewBox="0 0 24 24"><path d="M12 3 C 7 3 3 6.6 3 11 C 3 13.3 4.1 15.3 5.9 16.8 L 5 21 L 9.2 18.6 C 10.1 18.9 11 19 12 19 C 17 19 21 15.4 21 11 C 21 6.6 17 3 12 3 Z" fill="#fff"/></svg>',
    epingle: '<svg viewBox="0 0 64 64"><path d="M24 6 H40 L37 24 Q48 30 48 40 H16 Q16 30 27 24 Z" fill="#E10600"/><path d="M32 40 V60" stroke="#C9CED8" stroke-width="5" stroke-linecap="round"/></svg>',
  };

  window.CONSTRUIRE = function (tl) {
    const T = window.T, D = T.duree;

    // ---------- Pluie de bulles « ? » (fonction pure du temps, période = durée / 10) ----------
    const r = hasard(9), bulles = [];
    for (let i = 0; i < 16; i++) {
      const b = document.createElement("div"); b.className = "bulle-q"; b.innerHTML = BULLE;
      $("pluie").appendChild(b);
      const prof = 0.45 + r() * 0.9; // profondeur : petites et floues au fond
      b.style.filter = prof < 0.7 ? `blur(${((0.7 - prof) * 8).toFixed(1)}px)` : "";
      b.style.zIndex = Math.round(prof * 10);
      bulles.push({ b, x: -40 + r() * 1040, phase: r(), prof, tour: (r() - 0.5) * 2, v: 8 + Math.floor(r() * 4) });
    }
    function pluie(t) {
      bulles.forEach((q) => {
        const p = ((t / D) * q.v + q.phase) % 1;
        const y = -260 + p * 2300, rot = Math.sin((t / D) * Math.PI * 2 * q.v + q.phase * 6) * 35 * q.tour;
        q.b.style.opacity = (y > 120 && y < 560 ? 0.3 : 1).toFixed(2); // bulles estompées derrière le titre
        q.b.style.transform = `translate(${q.x}px, ${y.toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${q.prof.toFixed(2)}) rotateY(${(rot * 1.5).toFixed(1)}deg)`;
      });
    }

    // ---------- Titre, compteur ----------
    const titre = mots($("titre"), T.titre);
    const fin = mots($("texte-fin"), T.texteFin);
    const epingle = document.createElement("span"); epingle.className = "mot"; epingle.innerHTML = ICONES.epingle; $("texte-fin").appendChild(epingle);
    gsap.set([fin, epingle], { opacity: 0 });
    function compteur(t) {
      const n = Math.max(1, T.cartes.filter((c) => c.q - 0.35 <= t).length);
      $("num").textContent = n;
    }
    const horloge = { t: 0 };
    tl.to(horloge, { t: D, duration: D, ease: "none", onUpdate: () => { pluie(horloge.t); compteur(horloge.t); } }, 0);
    pluie(0); compteur(0);

    // ---------- Cartes ----------
    const cartes = T.cartes.map((c, k) => {
      const el = document.createElement("div"); el.className = "carte3d";
      let verso = "";
      if (c.icone === "bouton") verso += `<div class="bouton-wa">${ICONES.bulle}WhatsApp</div>`;
      else if (c.tampon && c.icone === "wifi") verso += `<div class="icones"><div class="tampon" style="width:180px;height:180px;font-size:70px">OUI</div>${ICONES.wifi}${ICONES.flocon}</div>`;
      else if (c.tampon) verso += `<div class="tampon">OUI</div>`;
      else if (c.icone) verso += `<div class="icones">${ICONES[c.icone]}</div>`;
      el.innerHTML = `<div class="tourne">
        <div class="face recto"><span class="etiquette">QUESTION ${k + 1}</span><span class="grand-q">?</span><div class="question">${c.question}</div><i class="reflet"></i></div>
        <div class="face verso"><span class="etiquette">RÉPONSE</span>${verso}<div class="reponse">${c.texte}</div>${c.detail ? `<div class="detail">${c.detail}</div>` : ""}<i class="reflet"></i></div></div>`;
      $("cartes").appendChild(el);
      return el;
    });

    // ---------- Animations ----------
    tl.fromTo("#camera", { scale: 1 }, { scale: 1.04, duration: D, ease: "none", immediateRender: true }, 0);
    tl.fromTo("#rayons", { rotation: 0 }, { rotation: 40, duration: T.luxe + 0.6, ease: "none", immediateRender: true }, 0);
    tl.fromTo("#cercles", { scale: 1 }, { scale: 1.12, duration: 0.6, yoyo: true, repeat: 5, ease: "sine.inOut", immediateRender: true }, 0);
    tl.fromTo("#geant", { scale: 1, rotation: -4 }, { scale: 1.08, rotation: 4, duration: T.luxe, ease: "sine.inOut", immediateRender: true }, 0);
    titre.forEach((m, i) => tl.fromTo(m, { y: 0 }, { y: -18, duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 0.3 + i * 0.22));

    // Bascule ÉNERGIE -> LUXE
    tl.to("#titre", { y: -120, opacity: 0, duration: 0.4, ease: "power2.in" }, T.luxe - 0.1);
    tl.fromTo("#luxe", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "sine.inOut", immediateRender: false }, T.luxe);
    tl.to("#energie", { opacity: 0, duration: 0.5, ease: "sine.inOut" }, T.luxe + 0.1);
    tl.fromTo("#compteur", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(2)", immediateRender: false }, T.cartes[0].q - 0.3);
    T.cartes.forEach((c, k) => tl.fromTo("#num", { scale: 1.6 }, { scale: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, c.q - 0.35));

    cartes.forEach((el, k) => {
      const c = T.cartes[k], sortie = k < 4 ? T.cartes[k + 1].q - 0.45 : T.eventail - 0.3;
      const tourne = el.querySelector(".tourne"), refletR = el.querySelector(".recto .reflet"), refletV = el.querySelector(".verso .reflet");
      tl.fromTo(el, { opacity: 0, x: 760, rotationY: -35, rotationZ: 6 }, { opacity: 1, x: 0, rotationY: 0, rotationZ: 0, duration: 0.55, ease: "power3.out", immediateRender: false }, c.q - 0.35);
      tl.fromTo(el, { y: 0, rotationX: 0 }, { y: -18, rotationX: 4, duration: sortie - c.q, ease: "sine.inOut", immediateRender: false }, c.q + 0.2);
      tl.fromTo(refletR, { left: "-70%" }, { left: "170%", duration: 0.9, ease: "sine.inOut", immediateRender: false }, c.q + 0.2);
      tl.fromTo(tourne, { rotationY: 0 }, { rotationY: 180, duration: 0.65, ease: "back.out(1.3)", immediateRender: false }, c.flip);
      tl.fromTo(refletV, { left: "-70%" }, { left: "170%", duration: 0.9, ease: "sine.inOut", immediateRender: false }, c.flip + 0.4);
      const tampon = el.querySelector(".tampon");
      if (tampon) tl.fromTo(tampon, { scale: 2.4, opacity: 0, rotation: -30 }, { scale: 1, opacity: 1, rotation: -12, duration: 0.35, ease: "power4.in", immediateRender: false }, c.flip + 0.3);
      el.querySelectorAll(".icones svg").forEach((s, i) => tl.fromTo(s, { scale: 0, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2.4)", immediateRender: false }, c.flip + 0.35 + i * 0.12));
      const bouton = el.querySelector(".bouton-wa");
      if (bouton) tl.fromTo(bouton, { scale: 1 }, { scale: 1.08, duration: 0.35, yoyo: true, repeat: Math.floor((sortie - c.flip - 0.6) / 0.35), ease: "sine.inOut", immediateRender: false }, c.flip + 0.6);
      tl.to(el, { opacity: 0, x: -820, rotationY: 35, rotationZ: -6, duration: 0.45, ease: "power2.in" }, sortie);
    });

    // Éventail final : les 5 cartes en mini, « Enregistre pour plus tard 📌 »
    tl.to("#compteur", { opacity: 0, duration: 0.3 }, T.eventail);
    T.cartes.forEach((c, k) => {
      const m = document.createElement("div"); m.className = "mini"; m.innerHTML = `${k + 1}<i>${k + 1}/5</i>`;
      $("eventail").appendChild(m);
      tl.fromTo(m, { opacity: 0, rotation: 0, y: 200 }, { opacity: 1, rotation: (k - 2) * 9, y: Math.abs(k - 2) * 14, duration: 0.6, ease: "back.out(1.6)", immediateRender: false }, T.eventail + k * 0.06);
      tl.to(m, { rotation: (k - 2) * 11, duration: T.outro - T.eventail - 0.7, ease: "sine.inOut" }, T.eventail + 0.7);
    });
    fin.forEach((m, i) => tl.fromTo(m, { opacity: 0, y: 20, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(2.2)", immediateRender: false }, T.texteFin[i][0]));
    tl.fromTo(epingle, { opacity: 0, y: -80, rotation: -30 }, { opacity: 1, y: 0, rotation: 0, duration: 0.45, ease: "bounce.out", immediateRender: false }, T.texteFin[3][0] + 0.3);
    tl.to(["#eventail", "#texte-fin"], { opacity: 0, duration: 0.35 }, T.outro - 0.2);

    // Outro JP PREMIUM : logo sous le projecteur, socle, « La route change avec JP. », WhatsApp
    tl.fromTo("#outro", { opacity: 0 }, { opacity: 1, duration: 0.35, immediateRender: false }, T.outro);
    tl.fromTo("#projecteur", { opacity: 1 }, { keyframes: [{ opacity: 0.3, duration: 0.1 }, { opacity: 1.4, duration: 0.4 }], immediateRender: false }, T.outro);
    tl.fromTo("#logo", { opacity: 0, scale: 1.08, filter: "blur(12px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "power2.out", immediateRender: false }, T.outro + 0.1);
    tl.fromTo("#slogan", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(2)", immediateRender: false }, T.slogan);
    tl.fromTo("#contact", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)", immediateRender: false }, T.contact);

    // Retour vers le hook (boucle)
    tl.to("#outro", { opacity: 0, duration: 0.4 }, T.retour);
    tl.to("#luxe", { opacity: 0, duration: 0.4 }, T.retour);
    tl.to("#energie", { opacity: 1, duration: 0.4 }, T.retour);
    tl.fromTo("#titre", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", immediateRender: false }, T.retour);
    tl.set("#rayons", { rotation: 0 }, T.retour);
    tl.set("#geant", { scale: 1, rotation: -4 }, T.retour);
  };
})();
