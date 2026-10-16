// « Samedi à Limbé » — JP Service Express Urbaine (30 s, 9:16, sans voix off).
// Hook, puis la journée en 8 plans (un toutes les 3 s) avec l'heure qui avance, la question
// « Et le retour ? » à 10 s gardée en badge jusqu'à la réponse à 25 s, prix, retour à « Samedi 7 h. ».
// Illustrations plates générées ici (silhouettes sans visage). Timeline GSAP en pause, déterministe.

(function () {
  const CIELS = ["#FFC977", "#8ED4FF", "#3FC0EA", "#47B5EC", "#31A7E2", "#FF7A45", "#6B3F8F", "#0E1A44"];
  const SOLEILS = [[170, 720, 1, "#FFF3B0"], [300, 560, 1, "#FFF3B0"], [520, 440, 1, "#FFF8D0"], [790, 420, 1, "#FFF8D0"], [860, 540, 1, "#FFF3B0"], [540, 990, 1.9, "#FFB347"], [540, 1300, 1, "#FFB347"], [540, 1500, 1, "#FFB347"]];
  const TEXTES = [
    ["Samedi 7&nbsp;h.", "La famille veut aller à Limbé."],
    ["Douala → Limbé", "2&nbsp;h de route."],
    ["La plage.", "Sable noir, mer calme."],
    ["Poisson braisé", "au bord de l'eau."],
    ["Baignade.", "Rires, photos, soleil."],
    ["18&nbsp;h.", "Tout le monde est épuisé."],
    ["Qui reprend le volant&nbsp;?", "2&nbsp;h de route, de nuit…"],
    ["19&nbsp;h.", "La route du retour."],
  ];
  const fmt = (m) => { m = Math.floor(m); const h = Math.floor(m / 60) % 24, mm = m % 60; return `SAM. ${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`; };

  // ── Dessins plats ──
  function silhouette(x, y, h, c, assis) {
    const s = h / 200;
    const corps = assis
      ? `<circle cx="40" cy="70" r="20"/><path d="M18 96 C18 84 62 84 62 96 L66 150 L110 150 L110 172 L44 172 L18 150Z"/>`
      : `<circle cx="40" cy="22" r="19"/><path d="M14 58 C14 46 26 42 40 42 C54 42 66 46 66 58 L70 128 L56 128 L54 198 L44 198 L40 136 L36 198 L26 198 L24 128 L10 128Z"/>`;
    return `<g transform="translate(${x} ${y - h}) scale(${s})" fill="${c}">${corps}</g>`;
  }
  const famille = (x, y, c, assis) => silhouette(x, y, 230, c, assis) + silhouette(x + 95, y, 215, c, assis) + silhouette(x + 185, y, 150, c, assis) + silhouette(x + 250, y, 130, c, assis);
  function voiture(x, y, w, nuit) {
    const s = w / 500;
    const vitres = nuit ? "#FFD27A" : "#2c3440";
    const tetes = nuit ? `<circle cx="205" cy="92" r="15" fill="#3a2a10"/><circle cx="300" cy="96" r="14" fill="#3a2a10" transform="rotate(18 300 96)"/><circle cx="340" cy="98" r="11" fill="#3a2a10"/>` : "";
    const faisceau = nuit ? `<path d="M494 128 L900 70 L900 220Z" fill="#FFE9A8" opacity=".28"/>` : "";
    return `<g transform="translate(${x} ${y}) scale(${s})">${faisceau}
      <path d="M30 120 L70 70 C90 48 120 40 160 40 L320 40 C350 40 372 50 392 70 L440 112 L478 120 C492 124 496 134 496 146 L496 150 L10 150 L10 134 C10 126 18 120 30 120Z" fill="#111114"/>
      <path d="M130 108 L162 60 L250 60 L250 108Z M262 60 L330 60 C344 60 356 66 366 76 L396 108 L262 108Z" fill="${vitres}"/>${tetes}
      <circle cx="120" cy="152" r="30" fill="#050506" stroke="#55565c" stroke-width="7"/><circle cx="396" cy="152" r="30" fill="#050506" stroke="#55565c" stroke-width="7"/>
      <rect x="12" y="122" width="18" height="10" rx="3" fill="#E10600"/><rect x="476" y="124" width="18" height="9" rx="3" fill="#FFF4D6"/></g>`;
  }
  function palmier(x, y, h, c) {
    const s = h / 300;
    return `<g transform="translate(${x} ${y - h}) scale(${s})" fill="${c}"><path d="M70 300 C64 220 72 140 92 70 L100 72 C84 140 78 220 84 300Z"/>
      <path d="M96 70 C60 40 20 50 0 80 C30 62 60 62 96 74Z"/><path d="M96 70 C130 36 170 40 196 70 C164 58 132 60 96 76Z"/>
      <path d="M96 70 C80 30 96 4 130 0 C110 20 104 44 98 74Z"/><path d="M96 70 C60 70 36 100 30 130 C52 104 72 92 98 78Z"/><path d="M96 70 C130 74 158 102 162 134 C142 106 122 92 96 78Z"/></g>`;
  }
  const montagne = (c) => `<path d="M-40 1120 L260 860 L420 760 L520 700 L600 750 L760 860 L1120 1120Z" fill="${c}"/>`;
  const vagues = (y0, y1, c) => { let s = ""; for (let y = y0; y < y1; y += 46) s += `<path class="vague" d="M-120 ${y} q60 -16 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" opacity=".5"/>`; return s; };
  const svg = (contenu) => `<svg width="1080" height="1920" viewBox="0 0 1080 1920">${contenu}</svg>`;

  const PLANS = [
    // 0. Maison, la famille rejoint la voiture
    svg(`<rect x="0" y="1120" width="1080" height="800" fill="#E9CF9B"/>
      <rect x="120" y="780" width="420" height="340" fill="#F6E7C8"/><path d="M90 790 L330 610 L570 790Z" fill="#C8553D"/>
      <rect x="290" y="960" width="80" height="160" rx="8" fill="#7A4A2A"/><rect x="160" y="850" width="90" height="80" rx="8" fill="#2F7FB8"/><rect x="410" y="850" width="90" height="80" rx="8" fill="#2F7FB8"/>
      ${palmier(930, 1120, 380, "#2E7D4F")}${voiture(560, 990, 460)}<g id="fam0">${famille(120, 1230, "#2b2b33")}</g>`),
    // 1. Route, barre de progression Douala -> Limbé
    svg(`${montagne("#7C9BB0")}<rect x="0" y="1060" width="1080" height="860" fill="#5DBB63"/><rect x="0" y="1090" width="1080" height="170" fill="#3a3a40"/>
      <g id="tirets">${Array.from({ length: 14 }, (_, i) => `<rect x="${i * 160 - 160}" y="1170" width="90" height="12" rx="6" fill="#fff"/>`).join("")}</g>
      <g id="palmiers">${Array.from({ length: 8 }, (_, i) => palmier(i * 300 - 200, 1080, 300 + (i % 3) * 50, "#2E7D4F")).join("")}</g>
      <g id="auto1">${voiture(290, 1000, 500)}</g>
      <g transform="translate(140 520)"><rect x="0" y="0" width="800" height="16" rx="8" fill="rgba(0,0,0,.18)"/><rect id="barre" x="0" y="0" width="800" height="16" rx="8" fill="#0b0b0b"/>
      <circle cx="0" cy="8" r="20" fill="#0b0b0b"/><circle cx="800" cy="8" r="20" fill="#0b0b0b"/>
      <text x="0" y="-30" font-family="Montserrat" font-weight="900" font-size="40" fill="#0b0b0b">Douala</text><text x="800" y="-30" text-anchor="end" font-family="Montserrat" font-weight="900" font-size="40" fill="#0b0b0b">Limbé</text></g>`),
    // 2. Plage de sable noir, mont Cameroun
    svg(`${montagne("#6F8797")}<rect x="0" y="900" width="1080" height="240" fill="#1C8FBF"/>${vagues(930, 1120, "#fff")}
      <path d="M0 1120 Q540 1090 1080 1120 L1080 1920 L0 1920Z" fill="#5a4a44"/>
      <g transform="translate(760 880)"><rect x="-6" y="0" width="12" height="380" fill="#222"/><path d="M-200 40 Q0 -90 200 40Z" fill="#FFC400"/><path d="M-200 40 Q-100 -40 -66 40Z M-1 40 Q0 -70 66 40Z" fill="#1B2A6B"/></g>
      <g id="fam2">${famille(170, 1260, "#141414")}</g>`),
    // 3. Repas : poisson braisé, vue de dessus
    svg(`<rect x="0" y="0" width="1080" height="1920" fill="#E7C9A0"/>
      <g id="table"><circle cx="540" cy="840" r="350" fill="#9B6B43"/><circle cx="540" cy="840" r="350" fill="none" stroke="#7A5233" stroke-width="18"/>
      ${[[540, 600], [780, 840], [540, 1080], [300, 840]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="110" fill="#fff"/><circle cx="${x}" cy="${y}" r="86" fill="#F3F3F3"/>` + (i % 2 === 0
        ? `<g transform="translate(${x} ${y}) rotate(${i * 40 - 20})"><ellipse cx="0" cy="0" rx="62" ry="28" fill="#C2702F"/><path d="M58 0 L92 -24 L92 24Z" fill="#C2702F"/><circle cx="-38" cy="-6" r="5" fill="#222"/><path d="M-20 -22 L-14 22 M0 -26 L6 26 M20 -22 L26 22" stroke="#8E4A1C" stroke-width="5"/></g>`
        : `<g transform="translate(${x} ${y})"><path d="M-50 -10 Q0 -60 50 -10" fill="none" stroke="#F2B233" stroke-width="22" stroke-linecap="round"/><path d="M-46 22 Q0 -24 46 22" fill="none" stroke="#E89A1E" stroke-width="22" stroke-linecap="round"/></g>`)).join("")}
      <circle cx="540" cy="840" r="70" fill="#1C8FBF"/><circle cx="540" cy="840" r="50" fill="#5BC0E8"/></g>`),
    // 4. Baignade
    svg(`<rect x="0" y="820" width="1080" height="500" fill="#1E9BD0"/>${vagues(850, 1300, "#fff")}<path d="M0 1300 Q540 1270 1080 1300 L1080 1920 L0 1920Z" fill="#5a4a44"/>
      ${[[220, 1010], [420, 1060], [640, 990], [830, 1050]].map(([x, y], i) => `<g class="nageur" data-i="${i}"><circle cx="${x}" cy="${y}" r="${i > 1 ? 30 : 36}" fill="#141414"/><path d="M${x - 60} ${y + 10} L${x - 30} ${y - 50}" stroke="#141414" stroke-width="16" stroke-linecap="round"/><ellipse cx="${x}" cy="${y + 40}" rx="70" ry="12" fill="#fff" opacity=".6"/></g>`).join("")}
      <g id="ballon"><circle cx="540" cy="900" r="46" fill="#fff"/><path d="M540 854 A46 46 0 0 1 586 900 L540 900Z" fill="#E10600"/><path d="M494 900 A46 46 0 0 1 540 854 L540 900Z" fill="#FFC400"/><path d="M540 946 A46 46 0 0 1 494 900 L540 900Z" fill="#1B2A6B"/></g>`),
    // 5. Coucher de soleil, famille assise
    svg(`<rect x="0" y="1000" width="1080" height="300" fill="#B34A5E"/>${Array.from({ length: 6 }, (_, i) => `<rect x="${380 + (i % 2) * 40}" y="${1020 + i * 40}" width="${320 - i * 40}" height="10" rx="5" fill="#FFB347" opacity=".7"/>`).join("")}
      <path d="M0 1260 Q540 1230 1080 1260 L1080 1920 L0 1920Z" fill="#2a1a20"/>${palmier(80, 1270, 420, "#2a1a20")}<g id="fam5">${famille(330, 1270, "#2a1a20", true)}</g>`),
    // 6. Qui reprend le volant ?
    svg(`<path d="M0 1200 Q540 1170 1080 1200 L1080 1920 L0 1920Z" fill="#2b1d40"/>
      <g id="cle" style="transform-origin: 540px 600px"><circle cx="540" cy="640" r="110" fill="#111" /><circle cx="540" cy="640" r="40" fill="#6B3F8F"/><rect x="510" y="740" width="60" height="300" rx="14" fill="#111"/><rect x="570" y="900" width="60" height="30" fill="#111"/><rect x="570" y="970" width="44" height="30" fill="#111"/>
      <circle cx="540" cy="640" r="128" fill="none" stroke="#FFC400" stroke-width="10" stroke-dasharray="20 22"/></g>
      ${[[250, 620, -14], [820, 560, 12], [800, 900, -8]].map(([x, y, r]) => `<text class="interro" x="${x}" y="${y}" transform="rotate(${r} ${x} ${y})" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="180" fill="#FFC400">?</text>`).join("")}
      ${famille(330, 1300, "#120c1c")}`),
    // 7. Route de nuit, la famille dort, le chauffeur conduit
    svg(`${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 233) % 1080}" cy="${260 + ((i * 137) % 700)}" r="${i % 3 ? 2.5 : 4}" fill="#fff" opacity="${0.4 + (i % 4) * 0.15}"/>`).join("")}
      <circle cx="840" cy="430" r="70" fill="#F4EFD8"/><circle cx="870" cy="410" r="62" fill="#0E1A44"/>
      <rect x="0" y="1060" width="1080" height="860" fill="#0a0f24"/><rect x="0" y="1090" width="1080" height="170" fill="#1d2233"/>
      <g id="tirets7">${Array.from({ length: 14 }, (_, i) => `<rect x="${i * 160 - 160}" y="1170" width="90" height="12" rx="6" fill="#FFC400" opacity=".8"/>`).join("")}</g>
      <g id="palmiers7">${Array.from({ length: 8 }, (_, i) => palmier(i * 300 - 200, 1080, 300 + (i % 3) * 50, "#060914")).join("")}</g>
      <g id="auto7">${voiture(200, 1000, 520, true)}</g>`),
  ];

  window.CONSTRUIRE = function (tl) {
    const T = window.T;
    const $ = (id) => document.getElementById(id);
    const tous = (sel) => Array.from(document.querySelectorAll(sel));
    const P = T.plans;

    // ════ HOOK : lignes qui claquent, couleurs inversées à chaque ligne ════
    const FONDS = ["#FFC400", "#0b0b0b", "#FFC400", "#0b0b0b"];
    tl.set("#hook", { backgroundColor: FONDS[0] }, 0);
    tl.set(".hook", { color: "#0b0b0b" }, 0);
    tous(".ligne").forEach((el, i) => {
      tl.fromTo(el, { opacity: 0, scale: 1.7 }, { opacity: 1, scale: 1, duration: 0.14, ease: "power4.in" }, T.hook[i]);
      tl.set("#hook", { backgroundColor: FONDS[i] }, T.hook[i] + 0.14);
      tl.set(".hook", { color: FONDS[i] === "#0b0b0b" ? "#FFC400" : "#0b0b0b" }, T.hook[i] + 0.14);
      tl.fromTo("#camera", { x: 0, y: 0 }, { keyframes: [{ x: -14, y: 8, duration: 0.04 }, { x: 10, y: -6, duration: 0.05 }, { x: 0, y: 0, duration: 0.07 }] }, T.hook[i] + 0.14);
    });
    tl.set("#hook", { opacity: 0 }, T.coupe);

    // ════ JOURNÉE ════
    tl.set("#journee", { opacity: 1 }, P[0]);
    const zone = $("plans"), st = $("sous-titres");
    PLANS.forEach((html, i) => {
      const d = document.createElement("div"); d.className = "plan"; d.id = "p" + i; d.innerHTML = html; zone.appendChild(d);
      const s = document.createElement("div"); s.className = "sous"; s.id = "s" + i;
      s.innerHTML = `<div class="carte"><div class="s1">${TEXTES[i][0]}</div><div class="s2">${TEXTES[i][1]}</div></div>`; st.appendChild(s);
      const debut = P[i], fin = i < P.length - 1 ? P[i + 1] : T.reponse;
      // Entrée du plan (poussée depuis la droite), sortie vers la gauche.
      tl.fromTo(d, { opacity: 1, x: i ? 1080 : 0 }, { x: 0, duration: i ? 0.4 : 0.01, ease: "power3.out", immediateRender: false }, debut);
      tl.set(d, { opacity: 1 }, debut);
      if (i < P.length - 1) tl.to(d, { x: -540, opacity: 0, duration: 0.4, ease: "power3.in" }, fin);
      tl.to("#ciel", { backgroundColor: CIELS[i], duration: i ? 0.5 : 0.01 }, debut);
      const [sx, sy, sc, scol] = SOLEILS[i];
      tl.to("#soleil", { left: sx, top: sy, scale: sc, backgroundColor: scol, duration: i ? 0.8 : 0.01, ease: "power2.inOut" }, debut);
      tl.fromTo(s, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.6)" }, debut + 0.25);
      tl.to(s, { opacity: 0, y: -20, duration: 0.2 }, fin - 0.2);
      // L'heure avance pendant le plan.
      const h = { m: T.heures[i] };
      tl.fromTo(h, { m: T.heures[i] }, { m: T.heures[i + 1], duration: (i < P.length - 1 ? P[i + 1] : T.fin) - debut, ease: "none",
        onUpdate: () => { $("heure").textContent = fmt(h.m); } }, debut);
    });
    tl.set("#soleil", { opacity: 0 }, P[6] + 0.8);
    tl.to(".ciel-voile", { opacity: 0.25, duration: 0.5 }, P[6]);

    // Petits mouvements dans les plans
    tl.fromTo("#fam0", { x: 0 }, { x: 220, duration: 3, ease: "none" }, P[0]);
    tl.fromTo("#tirets", { x: 0 }, { x: -480, duration: 3, ease: "none" }, P[1]);
    tl.fromTo("#palmiers", { x: 0 }, { x: -300, duration: 3, ease: "none" }, P[1]);
    tl.fromTo("#auto1", { y: 0 }, { y: -4, duration: 0.15, repeat: 19, yoyo: true, ease: "sine.inOut" }, P[1]);
    tl.fromTo("#barre", { attr: { width: 0 } }, { attr: { width: 800 }, duration: 2.6, ease: "power1.inOut" }, P[1] + 0.2);
    tous(".vague").forEach((v, k) => tl.fromTo(v, { x: 0 }, { x: k % 2 ? -120 : 120, duration: 3, ease: "sine.inOut" }, k < 5 ? P[2] : P[4]));
    tl.fromTo("#fam2", { x: 0 }, { x: 60, duration: 3, ease: "none" }, P[2]);
    tl.fromTo("#table", { rotation: -8, svgOrigin: "540 840" }, { rotation: 8, svgOrigin: "540 840", duration: 3, ease: "none" }, P[3]);
    tous(".nageur").forEach((n, k) => tl.fromTo(n, { y: 0 }, { y: -18, duration: 0.5, repeat: 5, yoyo: true, ease: "sine.inOut" }, P[4] + k * 0.12));
    tl.fromTo("#ballon", { y: 0 }, { keyframes: [{ y: -180, duration: 0.5, ease: "power2.out" }, { y: 0, duration: 0.5, ease: "power2.in" }, { y: -120, duration: 0.4, ease: "power2.out" }, { y: 0, duration: 0.4, ease: "power2.in" }] }, P[4] + 0.4);
    tl.fromTo("#cle", { rotation: -18 }, { rotation: 18, duration: 0.75, repeat: 3, yoyo: true, ease: "sine.inOut" }, P[6]);
    tous(".interro").forEach((q, k) => tl.fromTo(q, { opacity: 0, scale: 0.5, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, P[6] + 0.3 + k * 0.25));
    tl.fromTo("#tirets7", { x: 0 }, { x: -1920, duration: T.fin - P[7], ease: "none" }, P[7]);
    tl.fromTo("#palmiers7", { x: 0 }, { x: -1200, duration: T.fin - P[7], ease: "none" }, P[7]);
    tl.fromTo("#auto7", { y: 0 }, { y: -3, duration: 0.2, repeat: 27, yoyo: true, ease: "sine.inOut" }, P[7]);

    // ════ QUESTION OUVERTE à 10 s, gardée en badge jusqu'à 25 s ════
    tl.set("#question", { opacity: 1 }, T.question);
    tl.fromTo("#question div", { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.16, ease: "power4.in", stagger: 0.18 }, T.question);
    tl.set("#question", { opacity: 0 }, T.badge);
    tl.fromTo("#badge", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, T.badge);
    tl.fromTo("#badge", { rotation: 0 }, { keyframes: [{ rotation: -4, duration: 0.08 }, { rotation: 4, duration: 0.08 }, { rotation: 0, duration: 0.08 }] }, P[6] + 0.2);
    tl.to("#badge", { opacity: 0, scale: 0.6, duration: 0.2 }, T.reponse - 0.1);

    // ════ RÉPONSE à 25 s, puis prix ════
    tl.fromTo("#reponse .r1", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, T.reponse);
    tl.set("#reponse", { opacity: 1 }, T.reponse);
    tl.fromTo("#reponse .r2", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, T.reponse + 0.35);
    tl.fromTo("#prix", { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.5)" }, T.prix);
    tl.fromTo("#prix .p2", { scale: 0.8 }, { scale: 1, duration: 0.3, ease: "back.out(2.5)" }, T.prix + 0.5);

    // ════ FIN : retour à « Samedi 7 h. » + CTA ════
    tl.fromTo("#eclair", { opacity: 0.8 }, { opacity: 0, duration: 0.25, immediateRender: false }, T.fin);
    tl.set("#fin", { opacity: 1 }, T.fin);
    tl.set("#journee", { opacity: 0 }, T.fin);
    tl.fromTo(".fin-heure", { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.16, ease: "power4.in" }, T.fin);
    tl.fromTo(".fin-sous", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, T.fin + 0.2);
    tl.fromTo(".bande-logo", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, T.fin + 0.3);
    tl.fromTo(".cta", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.6)" }, T.fin + 0.45);

    tl.to({}, { duration: T.duree }, 0);
  };
})();
