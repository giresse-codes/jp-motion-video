// Scène 1 — LE BESOIN (0 → coupure).
// La règle-horloge avance de 18:00 à 19:00 en accélérant ; le vol de 20:00 approche.
// Billet + valise, carte de Douala dont les axes vers l'aéroport virent au rouge,
// taxis pleins qui passent sans s'arrêter, compte à rebours qui vire au rouge.
// Rules : timeline-scrub (règle), blur-to-focus-entrance (objets), motion-blur-exit, word-by-word-caption.

(function () {
  const { groupe, animerGroupe, regle, decalage, hhmm } = window.COMMUN;

  const VALISE = `<svg viewBox="0 0 210 300" width="210" height="300">
    <rect x="78" y="6" width="54" height="60" rx="10" fill="none" stroke="#3a3533" stroke-width="10"/>
    <rect x="18" y="56" width="174" height="214" rx="26" fill="#3b3431"/>
    <rect x="18" y="56" width="174" height="214" rx="26" fill="url(#reflet-valise)"/>
    <rect x="56" y="70" width="12" height="186" rx="6" fill="#2a2523"/>
    <rect x="142" y="70" width="12" height="186" rx="6" fill="#2a2523"/>
    <rect x="132" y="96" width="44" height="30" rx="6" fill="#f3eee6"/><rect x="138" y="104" width="30" height="4" fill="#bdb5aa"/><rect x="138" y="112" width="20" height="4" fill="#bdb5aa"/>
    <circle cx="52" cy="282" r="14" fill="#1d1d1f"/><circle cx="158" cy="282" r="14" fill="#1d1d1f"/>
    <defs><linearGradient id="reflet-valise" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  </svg>`;

  const AVION = `<svg viewBox="0 0 24 24"><path fill="#1d1d1f" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>`;

  // Carte stylisée de Douala : le Wouri, les quartiers, les axes vers l'aéroport.
  const CARTE = `<svg viewBox="0 0 820 700" width="820" height="700">
    <rect width="820" height="700" fill="#ece5d9"/>
    <path d="M0 120 C120 150 160 260 140 380 C125 470 60 560 0 600 Z" fill="#cdd6d6"/>
    <path d="M0 150 C95 175 125 265 108 375 C96 455 48 535 0 570" fill="none" stroke="#bccaca" stroke-width="6"/>
    <g stroke="#f7f3ec" stroke-width="10" stroke-linecap="round" fill="none">
      <path d="M200 120 L760 120"/><path d="M180 250 L780 250"/><path d="M170 390 L790 390"/><path d="M190 530 L770 530"/>
      <path d="M260 90 L260 650"/><path d="M400 80 L400 660"/><path d="M540 80 L540 660"/><path d="M680 90 L680 640"/>
    </g>
    <g stroke="#ffffff" stroke-width="20" stroke-linecap="round" fill="none">
      <path id="axe-a" d="M250 470 C330 450 380 420 450 405 C540 385 600 430 690 520"/>
      <path id="axe-b" d="M250 470 C300 560 420 600 540 590 C610 585 650 560 690 520"/>
      <path id="axe-c" d="M230 300 C340 300 470 330 560 400 C620 445 660 480 690 520"/>
    </g>
    <g stroke="#e10600" stroke-width="13" stroke-linecap="round" fill="none" class="bouchons">
      <path data-axe d="M250 470 C330 450 380 420 450 405 C540 385 600 430 690 520"/>
      <path data-axe d="M250 470 C300 560 420 600 540 590 C610 585 650 560 690 520"/>
      <path data-axe d="M230 300 C340 300 470 330 560 400 C620 445 660 480 690 520"/>
    </g>
    <g font-family="Space Mono, monospace" font-size="22" fill="#8c857b" letter-spacing="2">
      <text x="300" y="180">AKWA</text><text x="560" y="200">DEÏDO</text><text x="440" y="490">BALI</text>
      <text x="40" y="660">BONABÉRI</text><text x="32" y="345" fill="#9fb0b0">WOURI</text>
    </g>
    <g>
      <circle cx="250" cy="470" r="20" fill="#1d1d1f"/><circle cx="250" cy="470" r="8" fill="#fbf8f3"/>
      <text x="150" y="430" font-family="Inter" font-weight="700" font-size="26" fill="#1d1d1f">Bonapriso</text>
      <circle cx="690" cy="520" r="30" fill="#fbf8f3" stroke="#1d1d1f" stroke-width="4"/>
      <g transform="translate(672 502) scale(1.5)">${AVION.replace(/<\/?svg[^>]*>/g, "")}</g>
      <text x="604" y="590" font-family="Inter" font-weight="700" font-size="26" fill="#1d1d1f">Aéroport</text>
    </g>
  </svg>`;

  // Taxi de Douala (jaune, désaturé) vu de côté, plein : silhouettes aux vitres, enseigne COMPLET.
  const TAXI = (sens) => `<svg viewBox="0 0 420 190" width="420" height="190" style="transform:scaleX(${sens})">
    <rect x="150" y="10" width="120" height="30" rx="6" fill="#1d1d1f"/>
    <text x="210" y="32" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="17" fill="#f3eee6" style="transform:scaleX(${sens});transform-origin:210px 0">COMPLET</text>
    <path d="M60 110 L110 54 C120 44 132 40 146 40 L282 40 C298 40 310 46 320 58 L362 110 L396 118 C408 122 412 130 412 142 L412 150 L10 150 L10 128 C10 118 18 110 30 110 Z" fill="#e2b33c"/>
    <path d="M118 104 L150 56 L210 56 L210 104 Z M222 56 L284 56 C292 56 298 60 304 66 L334 104 L222 104 Z" fill="#2e3437"/>
    <circle cx="170" cy="82" r="14" fill="#151819"/><path d="M152 104 C152 92 160 88 170 88 C180 88 188 92 188 104 Z" fill="#151819"/>
    <circle cx="258" cy="80" r="14" fill="#151819"/><path d="M240 104 C240 92 248 86 258 86 C268 86 276 92 276 104 Z" fill="#151819"/>
    <circle cx="300" cy="86" r="12" fill="#151819"/><path d="M286 104 C286 96 292 92 300 92 C308 92 314 96 314 104 Z" fill="#151819"/>
    <rect x="10" y="124" width="402" height="8" fill="#1d1d1f" opacity=".15"/>
    <circle cx="96" cy="152" r="30" fill="#1d1d1f"/><circle cx="96" cy="152" r="12" fill="#8c857b"/>
    <circle cx="322" cy="152" r="30" fill="#1d1d1f"/><circle cx="322" cy="152" r="12" fill="#8c857b"/>
    <rect x="392" y="118" width="16" height="10" rx="3" fill="#fff4cf"/>
  </svg>`;

  window.SCENE1 = function (tl, R) {
    const s1 = document.getElementById("s1");
    const fin = R.coupure;

    // ── Règle-horloge + heure courante + compte à rebours ──
    const r = regle(document.getElementById("s1-regle"));
    const heure = document.getElementById("s1-heure");
    const rebours = document.getElementById("s1-rebours-txt");
    const horloge = { minute: 18 * 60 };
    const majHorloge = () => {
      r.bande.style.transform = `translateX(${decalage(horloge.minute).toFixed(1)}px)`;
      heure.textContent = hhmm(horloge.minute);
      const reste = Math.max(0, 20 * 60 - Math.floor(horloge.minute + 1e-6));
      rebours.textContent = `${Math.floor(reste / 60)} h ${String(reste % 60).padStart(2, "0")}`;
    };
    // L'heure avance lentement puis s'emballe (« l'heure qui tourne »).
    tl.fromTo(horloge, { minute: 18 * 60 }, { minute: 19 * 60, duration: fin, ease: "power2.in", onUpdate: majHorloge }, 0);
    majHorloge();

    // ── Sous-titres (bas) ──
    const zone = document.getElementById("s1-sous-titres");
    const g1 = groupe(zone, "sous-titre", "Il est dix-huit heures.", 0, "dix-huit heures.");
    const g2 = groupe(zone, "sous-titre", "Votre vol part à vingt heures.", g1.dernier, "vingt heures.");
    const g3 = groupe(zone, "sous-titre", "Les bouchons. Les taxis pleins. Les bagages.", g2.dernier);
    const g4 = groupe(zone, "sous-titre", "Et l'heure qui tourne.", g3.dernier, "tourne.");
    const groupes = [g1, g2, g3, g4];
    groupes.forEach((g, i) => {
      const entree = i === 0 ? 0 : g.debut - 0.12;
      const sortie = i < groupes.length - 1 ? groupes[i + 1].debut - 0.12 : null;
      animerGroupe(tl, g, { entree, sortie });
    });

    // ── Compte à rebours ──
    const pastille = document.getElementById("s1-rebours");
    tl.fromTo(pastille, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 0.2);
    tl.to(pastille, { backgroundColor: "#e10600", color: "#fbf8f3", duration: 0.25 }, R.tourne);
    tl.to(pastille.querySelector("small"), { color: "rgba(251,248,243,.8)", duration: 0.25 }, R.tourne);
    tl.fromTo(pastille, { scale: 1 }, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, R.tourne);

    // ── Billet + valise ──
    const billet = document.getElementById("s1-billet");
    const valise = document.getElementById("s1-valise");
    valise.innerHTML = VALISE;
    tl.fromTo(billet, { y: 90, rotationX: 24, rotation: -4, opacity: 0, filter: "blur(14px)" },
      { y: 0, rotationX: 0, rotation: -2, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out" }, R.billet - 0.3);
    tl.to(billet, { y: -14, rotation: -1, duration: R.carte - R.billet, ease: "sine.inOut" }, R.billet + 0.4);
    tl.fromTo(valise, { y: -260, rotation: 10, opacity: 0 }, { y: 0, rotation: 4, opacity: 1, duration: 0.5, ease: "bounce.out" }, R.valise - 0.35);
    // Sortie vers la gauche avec flou de mouvement.
    tl.to([billet, valise], { x: -900, opacity: 0, filter: "blur(18px)", duration: 0.42, ease: "power2.in", stagger: 0.05 }, R.carte - 0.42);

    // ── Carte de Douala ──
    const carte = document.getElementById("s1-carte");
    carte.insertAdjacentHTML("afterbegin", CARTE);
    tl.fromTo(carte, { scale: 0.86, y: 60, opacity: 0, filter: "blur(16px)" },
      { scale: 1, y: 0, opacity: 1, filter: "blur(0px)", duration: 0.65, ease: "power3.out" }, R.carte - 0.2);
    carte.querySelectorAll("[data-axe]").forEach((p, i) => {
      const L = p.getTotalLength();
      p.style.strokeDasharray = `${L}`;
      tl.fromTo(p, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.4 + i * 0.3, ease: "power1.inOut" }, R.carte + 0.15 + i * 0.25);
    });
    const puce = carte.querySelector(".puce-trafic");
    tl.fromTo(puce, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" }, R.carte + 0.6);
    // Pendant les bagages, la carte recule pour laisser place aux valises.
    tl.to(carte, { scale: 0.9, y: -40, filter: "blur(3px)", duration: 0.6, ease: "power2.inOut" }, R.bagages - 0.2);

    // ── Taxis pleins qui passent sans s'arrêter ──
    const taxis = [document.getElementById("s1-taxi1"), document.getElementById("s1-taxi2")];
    taxis[0].innerHTML = TAXI(1);
    taxis[1].innerHTML = TAXI(-1);
    tl.fromTo(taxis[0], { x: -520, filter: "blur(6px)" }, { x: 1180, filter: "blur(2px)", duration: 1.05, ease: "power1.inOut" }, R.taxis - 0.2);
    tl.fromTo(taxis[1], { x: 1180, filter: "blur(6px)" }, { x: -560, filter: "blur(2px)", duration: 1.0, ease: "power1.inOut" }, R.taxis + 0.4);

    // ── Les bagages : deux valises tombent et s'empilent ──
    const valises = [document.getElementById("s1-valise2"), document.getElementById("s1-valise3")];
    valises.forEach((v, i) => {
      v.innerHTML = VALISE;
      tl.fromTo(v, { y: -700, rotation: i ? -14 : 12, opacity: 0 }, { y: 0, rotation: i ? -6 : 3, opacity: 1, duration: 0.55, ease: "bounce.out" }, R.bagages - 0.15 + i * 0.18);
    });

    // ── L'heure qui tourne : poussée caméra, tout se tend ──
    tl.fromTo("#s1-scene", { scale: 1 }, { scale: 1.06, duration: fin - R.tourne + 0.2, ease: "power2.in" }, R.tourne - 0.2);
    tl.to(valises, { y: -10, duration: 0.08, yoyo: true, repeat: 5, ease: "none" }, R.tourne + 0.05);
    return s1;
  };
})();
