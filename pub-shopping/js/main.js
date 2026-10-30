// « Samedi shopping » — JP STORIES, format DÉBAT à trois (46,5 s, 9:16). Voir frame.md. Mise en page et composants de pub-debat.
// 100 % dialogue, sans narrateur : Sandrine (centre) organise la sortie, Murielle (gauche) veut tout acheter, Joëlle (droite) doute.
// Chaque réplique s'écrit mot par mot dans une bulle au-dessus de celle qui parle (nette, zoomée ; les autres sont floues et réagissent).
// Zone centrale : carte d'état « SORTIE ? » → mini carte (4 arrêts) → sacs qui tombent → 4 taxis + soleil → voiture JP qui fait le tour
// → calculatrice → coffre qui avale les sacs → « SORTIE ✓ ». Cadrages : plan large, gros plan Murielle, plan serré calculatrice, plan à deux final.
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const NUIT = "#0B1B4D", MOUTARDE = "#F5A524", VERT = "#22C55E", ENCRE = "#1A1A1A", GRIS = "#BDB8AE", ROUGE = "#E10600";
  const NOMS = { S: "SANDRINE", M: "MURIELLE", J: "JOËLLE" };
  const COTE = { S: "centre", M: "gauche", J: "droite" };
  const QUI = ["S", "M", "J"];

  const el = (parent, tag, attrs = {}) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    parent.appendChild(e);
    return e;
  };
  // Espaces insécables : « 2 000 », « 5 h », « comment ? »
  const insecable = (s) => s.replace(/(\d) (\d{3})/g, "$1 $2").replace(/(\d) h\b/g, "$1 h").replace(/ ([?!:;…])/g, " $1");

  // ════ Personnages plats, en couches (aucun attribut transform sur les groupes animés) ════
  // M : robe orange, cheveux longs en queue, lunettes de soleil sur la tête. S : chemise verte, carré. J : chemise rose, chignon.
  const STYLES = {
    M: { peau: "#6B3F27", ombre: "#4E2C1A", tissu: "#F26B1D", col: null, cheveux: "queue" },
    S: { peau: "#5C3A24", ombre: "#43291A", tissu: "#2FA35B", col: "#E9F7EE", cheveux: "carre" },
    J: { peau: "#6E4128", ombre: "#50301D", tissu: "#F49AC1", col: "#FCE4F0", cheveux: "chignon" },
  };
  function personnage(svg, qui) {
    const st = STYLES[qui], { peau, ombre, tissu } = st, CHEV = "#24160F";
    const corps = el(svg, "g");
    const bras = el(corps, "g");
    [-1, 1].forEach((s) => {
      el(bras, "path", { d: `M${s * 150} 0 Q${s * 200} 60 ${s * 196} 130 L${s * 136} 130 Q${s * 140} 80 ${s * 110} 60Z`, fill: tissu });
      el(bras, "path", { d: `M${s * 194} 130 Q${s * 205} 240 ${s * 190} 340 L${s * 140} 340 Q${s * 140} 230 ${s * 138} 130Z`, fill: peau });
    });
    el(corps, "rect", { x: -34, y: -90, width: 68, height: 80, rx: 20, fill: ombre });
    el(corps, "path", { d: "M-170 340 L-166 50 Q-158 -22 -82 -36 L82 -36 Q158 -22 166 50 L170 340Z", fill: tissu });
    if (st.col) {
      el(corps, "path", { d: "M-56 -38 L-4 30 L-16 -38Z M56 -38 L4 30 L16 -38Z", fill: st.col, stroke: "rgba(0,0,0,.15)", "stroke-width": 3 });
      [70, 140, 210, 280].forEach((y) => el(corps, "circle", { cx: 0, cy: y, r: 6, fill: st.col }));
    } else {
      el(corps, "path", { d: "M-70 -36 Q0 50 70 -36Z", fill: peau });
      el(corps, "path", { d: "M-96 -30 L130 300", stroke: "#7A4A2A", "stroke-width": 14, "stroke-linecap": "round" });
      el(corps, "rect", { x: 96, y: 270, width: 70, height: 56, rx: 10, fill: "#7A4A2A" });
    }

    // Bras levés (Sandrine), bras qui tient Murielle (Joëlle) : cachés au départ
    let leves = null, tient = null;
    if (qui === "S") {
      leves = el(svg, "g", { opacity: 0 });
      [-1, 1].forEach((s) => {
        el(leves, "path", { d: `M${s * 140} 10 L${s * 210} -170 L${s * 236} -300`, stroke: peau, "stroke-width": 54, "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none" });
        el(leves, "path", { d: `M${s * 140} 10 L${s * 186} -100`, stroke: tissu, "stroke-width": 72, "stroke-linecap": "round", fill: "none" });
        el(leves, "circle", { cx: s * 240, cy: -318, r: 34, fill: peau });
      });
    }
    if (qui === "J") {
      tient = el(svg, "g", { opacity: 0 });
      el(tient, "path", { d: "M-140 30 Q-240 80 -330 96", stroke: peau, "stroke-width": 50, "stroke-linecap": "round", fill: "none" });
      el(tient, "path", { d: "M-140 30 L-206 62", stroke: tissu, "stroke-width": 68, "stroke-linecap": "round", fill: "none" });
      el(tient, "circle", { cx: -336, cy: 98, r: 30, fill: peau });
    }

    // Tête
    const tete = el(svg, "g");
    if (st.cheveux === "carre") el(tete, "path", { d: "M-114 -66 Q-134 -300 0 -302 Q134 -300 114 -66 Q96 -56 86 -80 L86 -150 L-86 -150 L-86 -80 Q-96 -56 -114 -66Z", fill: CHEV });
    if (st.cheveux === "queue") {
      el(tete, "path", { d: "M-104 -130 Q-124 -300 0 -300 Q124 -300 104 -130Z", fill: CHEV });
      el(tete, "path", { d: "M-70 -262 Q-190 -220 -170 -40 Q-160 60 -120 130 Q-130 10 -112 -130Z", fill: CHEV });
    }
    if (st.cheveux === "chignon") {
      el(tete, "circle", { cx: 0, cy: -292, r: 44, fill: CHEV });
      el(tete, "ellipse", { cx: 0, cy: -258, rx: 34, ry: 12, fill: ROUGE });
    }
    el(tete, "circle", { cx: -92, cy: -150, r: 19, fill: peau });
    el(tete, "circle", { cx: 92, cy: -150, r: 19, fill: peau });
    el(tete, "ellipse", { cx: 0, cy: -160, rx: 90, ry: 105, fill: peau });
    if (st.cheveux === "carre") el(tete, "path", { d: "M-94 -170 Q-92 -272 0 -272 Q92 -272 94 -170 Q70 -230 20 -226 Q-40 -240 -94 -170Z", fill: CHEV });
    else el(tete, "path", { d: "M-92 -174 Q-96 -280 0 -280 Q96 -280 92 -174 Q70 -238 0 -240 Q-70 -238 -92 -174Z", fill: CHEV });
    if (st.cheveux === "queue") {
      [-34, 34].forEach((x) => el(tete, "ellipse", { cx: x, cy: -262, rx: 30, ry: 18, fill: "#2B2B2B", stroke: MOUTARDE, "stroke-width": 4 }));
      [-94, 94].forEach((x) => el(tete, "circle", { cx: x, cy: -112, r: 14, fill: "none", stroke: "#E9B23A", "stroke-width": 5 }));
    } else [-94, 94].forEach((x) => el(tete, "circle", { cx: x, cy: -122, r: 7, fill: "#F3EBDD" }));
    // Yeux (clignement), yeux rieurs (^ ^)
    const dx = qui === "M" ? 4 : qui === "J" ? -4 : 0;
    const yeux = el(tete, "g");
    [-34, 34].forEach((x) => {
      el(yeux, "ellipse", { cx: x, cy: -166, rx: 16, ry: 14, fill: "#fff" });
      el(yeux, "circle", { cx: x + dx, cy: -165, r: 8, fill: ENCRE });
      el(yeux, "path", { d: `M${x - 18} -176 L${x - 24} -184 M${x + 18} -176 L${x + 24} -184`, stroke: ENCRE, "stroke-width": 4, "stroke-linecap": "round" });
    });
    const rieurs = el(tete, "g", { opacity: 0 });
    [-34, 34].forEach((x) => el(rieurs, "path", { d: `M${x - 18} -160 Q${x} -184 ${x + 18} -160`, stroke: ENCRE, "stroke-width": 8, fill: "none", "stroke-linecap": "round" }));
    const sourcils = el(tete, "g");
    [-1, 1].forEach((s) => el(sourcils, "path", { d: `M${s * 56} -194 Q${s * 36} -210 ${s * 14} -198`, stroke: ENCRE, "stroke-width": 8, fill: "none", "stroke-linecap": "round" }));
    el(tete, "path", { d: "M-2 -152 Q-16 -122 -6 -118 Q2 -115 12 -120", stroke: ombre, "stroke-width": 6, fill: "none", "stroke-linecap": "round" });
    const bouche = el(tete, "g");
    el(bouche, "ellipse", { cx: 0, cy: -96, rx: 28, ry: 20, fill: "#5E1420" });
    el(bouche, "ellipse", { cx: 0, cy: -84, rx: 14, ry: 7, fill: "#D9473B" });
    const sourire = el(tete, "path", { d: "M-32 -108 Q0 -82 32 -108", stroke: "#7A1F2B", "stroke-width": 7, fill: "none", "stroke-linecap": "round", opacity: 0 });
    const gouttes = el(tete, "g", { opacity: 0 });
    el(gouttes, "path", { d: "M84 -236 Q70 -212 84 -204 Q98 -212 84 -236Z", fill: "#7CC4FF" });
    el(gouttes, "path", { d: "M-100 -214 Q-110 -196 -100 -190 Q-90 -196 -100 -214Z", fill: "#7CC4FF" });

    return { corps, bras, leves, tient, tete, yeux, rieurs, sourcils, bouche, sourire, gouttes };
  }

  // ════ Décors ════
  const ARRETS = [{ x: 130, y: 120, nom: "AKWA" }, { x: 590, y: 110, nom: "BONAPRISO" }, { x: 600, y: 350, nom: "MARCHÉ DES FLEURS" }, { x: 160, y: 360, nom: "COIFFURE" }];
  function decorPlan(svg) {
    el(svg, "rect", { width: 760, height: 470, fill: "#EEF2E6" });
    el(svg, "path", { d: "M-20 230 Q200 200 380 250 Q560 300 780 240", stroke: "#9CC9E8", "stroke-width": 46, fill: "none" });
    ["M60 0 L80 470", "M380 0 L370 470", "M700 0 L680 470", "M0 110 L760 100", "M0 360 L760 370"].forEach((d) => el(svg, "path", { d, stroke: "#fff", "stroke-width": 26, fill: "none" }));
    const boucle = ARRETS.map((a) => `${a.x},${a.y}`).join(" ");
    el(svg, "polygon", { points: boucle, fill: "none", stroke: "#D9D4CA", "stroke-width": 10, "stroke-dasharray": "2 18", "stroke-linecap": "round" });
    const route = el(svg, "polygon", { points: boucle, fill: "none", stroke: MOUTARDE, "stroke-width": 10, "stroke-linejoin": "round", opacity: 0 });
    const pins = ARRETS.map((a, k) => {
      const g = el(svg, "g");
      const rond = el(g, "circle", { cx: a.x, cy: a.y, r: 24, fill: "#B9B4AA", stroke: "#fff", "stroke-width": 6 });
      el(g, "text", { x: a.x, y: a.y + 8, "text-anchor": "middle", "font-family": "Archivo Black", "font-size": 22, fill: "#fff" }).textContent = k + 1;
      const w = a.nom.length * 15 + 30, lx = Math.min(740 - w, Math.max(20, a.x - w / 2)), ly = a.y + (a.y < 200 ? 36 : -84);
      const etiq = el(g, "g", { opacity: 0.35 });
      el(etiq, "rect", { x: lx, y: ly, width: w, height: 46, rx: 23, fill: NUIT });
      el(etiq, "text", { x: lx + w / 2, y: ly + 31, "text-anchor": "middle", "font-family": "JetBrains Mono", "font-weight": 700, "font-size": 21, fill: "#fff" }).textContent = a.nom;
      return { rond, etiq };
    });
    const auto = el(svg, "g", { opacity: 0 });
    el(auto, "rect", { x: -38, y: -24, width: 76, height: 48, rx: 14, fill: NUIT, stroke: "#fff", "stroke-width": 5 });
    el(auto, "text", { x: 0, y: 9, "text-anchor": "middle", "font-family": "Archivo Black", "font-size": 24, fill: MOUTARDE }).textContent = "JP";
    return { route, pins, auto };
  }

  function voitureJP(svg) {
    el(svg, "ellipse", { cx: 240, cy: 214, rx: 210, ry: 16, fill: "rgba(11,27,77,.15)" });
    el(svg, "path", { d: "M30 190 L32 140 Q36 120 64 116 L130 108 L180 60 Q192 50 212 50 L330 50 Q350 50 362 64 L400 108 Q440 114 446 136 L450 190Z", fill: NUIT });
    el(svg, "path", { d: "M192 70 L236 70 L236 106 L152 106Z M250 70 L330 70 Q340 70 348 80 L370 106 L250 106Z", fill: "#9CC3E6" });
    el(svg, "text", { x: 250, y: 160, "text-anchor": "middle", "font-family": "Archivo Black", "font-size": 40, fill: MOUTARDE }).textContent = "JP";
    el(svg, "circle", { cx: 440, cy: 150, r: 12, fill: "#FFF1B8" });
    [110, 370].forEach((cx) => { el(svg, "circle", { cx, cy: 192, r: 36, fill: "#111" }); el(svg, "circle", { cx, cy: 192, r: 15, fill: "#9CA3AF" }); });
  }

  function taxiSVG(parent) {
    const s = el(parent, "svg", { viewBox: "0 0 200 110", width: 200, height: 110 });
    el(s, "path", { d: "M14 88 L16 60 Q18 48 34 46 L60 42 L84 18 Q90 12 102 12 L148 12 Q158 12 164 20 L182 44 Q194 48 194 62 L194 88Z", fill: "#F7C600" });
    el(s, "rect", { x: 104, y: 2, width: 40, height: 12, rx: 4, fill: NUIT });
    el(s, "path", { d: "M94 24 L118 24 L118 44 L72 44Z M128 24 L152 24 L168 44 L128 44Z", fill: "#9CC3E6" });
    el(s, "path", { d: "M16 64 H194", stroke: ENCRE, "stroke-width": 5, "stroke-dasharray": "10 10" });
    [56, 156].forEach((cx) => el(s, "circle", { cx, cy: 90, r: 16, fill: "#111" }));
  }

  function decorSoleil(svg) {
    const rayons = el(svg, "g");
    for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; el(rayons, "path", { d: `M${Math.sin(a) * 70} ${-Math.cos(a) * 70} L${Math.sin(a) * 108} ${-Math.cos(a) * 108}`, stroke: "#F59E0B", "stroke-width": 14, "stroke-linecap": "round" }); }
    el(svg, "circle", { r: 58, fill: "#FBBF24", stroke: "#F59E0B", "stroke-width": 8 });
    el(svg, "path", { d: "M-22 -8 Q-14 -18 -6 -8 M6 -8 Q14 -18 22 -8 M-20 18 Q0 32 20 18", stroke: "#B45309", "stroke-width": 6, fill: "none", "stroke-linecap": "round" });
    return rayons;
  }

  function decorCoffre(svg) {
    el(svg, "rect", { width: 600, height: 420, fill: "#E9EEF6" });
    el(svg, "rect", { y: 360, width: 600, height: 60, fill: "#B8BFCC" });
    el(svg, "path", { d: "M60 360 L70 190 Q76 160 110 156 L490 156 Q524 160 530 190 L540 360Z", fill: NUIT });
    el(svg, "rect", { x: 120, y: 176, width: 360, height: 120, rx: 14, fill: "#1A1410" });          // ouverture du coffre
    el(svg, "rect", { x: 70, y: 300, width: 460, height: 30, rx: 8, fill: "#16245E" });
    [[78, 210], [482, 210]].forEach(([x, y]) => el(svg, "rect", { x, y, width: 40, height: 70, rx: 10, fill: ROUGE }));
    el(svg, "rect", { x: 250, y: 316, width: 100, height: 34, rx: 6, fill: "#fff" });
    el(svg, "text", { x: 300, y: 342, "text-anchor": "middle", "font-family": "Archivo Black", "font-size": 24, fill: NUIT }).textContent = "JP";
    [130, 470].forEach((cx) => el(svg, "rect", { x: cx - 40, y: 356, width: 80, height: 40, rx: 10, fill: "#111" }));
    const hayon = el(svg, "g");
    el(hayon, "path", { d: "M110 170 L490 170 L486 300 L114 300Z", fill: "#2B3F8F", stroke: "#0B1B4D", "stroke-width": 6 });
    el(hayon, "rect", { x: 160, y: 186, width: 280, height: 60, rx: 12, fill: "#9CC3E6" });
    // Hayon relevé (coffre ouvert)
    const ouvert = el(svg, "g", { opacity: 0 });
    el(ouvert, "path", { d: "M110 170 L490 170 L470 40 L130 40Z", fill: "#2B3F8F", stroke: "#0B1B4D", "stroke-width": 6 });
    el(ouvert, "rect", { x: 170, y: 58, width: 260, height: 50, rx: 12, fill: "#16245E" });
    return { hayon, ouvert };
  }

  const SAC_COUL = [["#E8505B", "#fff"], [MOUTARDE, NUIT], ["#3D5BD9", "#fff"], [VERT, "#fff"], ["#F472B6", "#fff"], [NUIT, MOUTARDE], ["#F26B1D", "#fff"], ["#60A5FA", NUIT]];
  function sacSVG(parent, k) {
    const [c, l] = SAC_COUL[k % SAC_COUL.length];
    const s = el(parent, "svg", { viewBox: "0 0 150 170", width: 150, height: 170, class: "sac" });
    el(s, "path", { d: "M50 52 V36 Q50 14 75 14 Q100 14 100 36 V52", fill: "none", stroke: ENCRE, "stroke-width": 8, "stroke-linecap": "round" });
    el(s, "path", { d: "M18 50 H132 L142 164 H8Z", fill: c, stroke: "rgba(0,0,0,.2)", "stroke-width": 4 });
    el(s, "text", { x: 75, y: 122, "text-anchor": "middle", "font-family": "Archivo Black", "font-size": 30, fill: l }).textContent = ["SALE", "♥", "JP", "%", "NEW", "★", "WAX", "OK"][k % 8];
    return s;
  }

  window.CONSTRUIRE = function (tl) {
    const T = window.T;
    const P = {}, div = {};
    QUI.forEach((q) => { P[q] = personnage(document.getElementById("svg-" + q), q); div[q] = document.getElementById("perso-" + q); });

    // ── États de départ (image 1) ──
    QUI.forEach((q, i) => {
      const p = P[q];
      tl.set(p.bouche, { scaleY: 0.22, svgOrigin: "0 -106" }, 0);
      tl.set(p.tete, { svgOrigin: "0 -40", rotation: 0, y: 0 }, 0);
      tl.set(p.yeux, { svgOrigin: "0 -166", scaleY: 1 }, 0);
      tl.fromTo(p.corps, { scaleY: 1 }, { scaleY: 1.012, svgOrigin: "0 340", duration: 1.6, repeat: Math.floor(T.duree / 1.6) - 1, yoyo: true, ease: "sine.inOut", immediateRender: true }, i * 0.4);
      for (let t = 2.2 + i * 1.1; t < T.duree - 1; t += 3.7) tl.to(p.yeux, { keyframes: [{ scaleY: 0.1, duration: 0.07 }, { scaleY: 1, duration: 0.09 }] }, t);
    });

    // ── Cadrages : point (px, py) fixe, échelle s (origine 0 0) ──
    const cad = (s, px = 540, py = 900) => ({ scale: s, x: px * (1 - s), y: py * (1 - s) });
    const cam = (t, s, px, py, d = 0.45, ease = "power3.inOut") => tl.to("#camera", { ...cad(s, px, py), duration: d, ease }, t);
    tl.fromTo("#camera", cad(1, 540, 1100), { ...cad(1.04, 540, 1100), duration: 5.8, ease: "none", immediateRender: true }, 0);
    cam(5.85, 1, 540, 1100, 0.4);
    cam(7.2, 1.18, 200, 1350, 0.6);                        // gros plan sur Murielle sous les sacs
    cam(10.5, 1, 200, 1350, 0.45);
    cam(T.calc, 1.08, 540, 262, 0.5);                      // plan serré sur la calculatrice
    cam(T.coffre - 0.1, 1, 540, 262, 0.4);
    cam(T.tient - 0.1, 1.1, 420, 1400, 0.6);                // plan à deux : Murielle et Joëlle
    cam(T.outro, 1, 420, 1400, 0.4);

    // ── Focus : celle qui parle est nette et zoomée, les autres floues ──
    const NET = { filter: "blur(0px)", scale: 1.06, opacity: 1 }, FLOU = { filter: "blur(4px)", scale: 0.95, opacity: 0.85 };
    const focus = (q, t, d = 0.35) => QUI.forEach((o) => tl.to(div[o], { ...(o === q ? NET : FLOU), duration: d, ease: "power2.out" }, t));
    QUI.forEach((o) => tl.set(div[o], o === "S" ? NET : FLOU, 0));

    // ── Bulles mot par mot ──
    const zone = document.getElementById("bulles");
    const bulles = [], motsPremiere = [];
    T.repliques.forEach(([q, phrases], i) => {
      const b = document.createElement("div");
      b.className = "bulle " + COTE[q];
      b.innerHTML = `<span class="qui">${NOMS[q]}</span>`;
      zone.appendChild(b);
      if (q === "S") tl.set(b, { xPercent: -50 }, 0);
      phrases.forEach(([a, z, texte]) => {
        const mots = insecable(texte).split(" ");
        const total = mots.reduce((s, m) => s + m.replace("*", "").length, 0);
        let t = a;
        mots.forEach((m) => {
          const cle = m.startsWith("*"), txt = m.replace("*", "");
          const s = document.createElement("span");
          s.className = "mot";
          s.innerHTML = (cle ? '<i class="fond"></i>' : "") + `<span>${txt}</span>`;
          b.appendChild(s); b.appendChild(document.createTextNode(" "));
          const d = ((z - a) * txt.length) / total;
          tl.fromTo(s.lastChild, { color: GRIS }, { color: ENCRE, duration: 0.12, immediateRender: i === 0 }, t);
          // Hook : l'étiquette « Akwa » est déjà posée sur l'image 1
          if (cle && i === 0) tl.set(s.firstChild, { scale: 1, rotation: -2 }, 0);
          else if (cle) tl.fromTo(s.firstChild, { scale: 0, rotation: -6 }, { scale: 1, rotation: -2, duration: 0.3, ease: "back.out(2.5)", immediateRender: false }, t);
          if (i === 0) motsPremiere.push(s);
          tl.to(P[q].bouche, { keyframes: [{ scaleY: 1, duration: Math.max(0.06, d * 0.45) }, { scaleY: 0.22, duration: Math.max(0.06, d * 0.45) }] }, t);
          t += d;
        });
      });
      bulles.push({ b, q, de: phrases[0][0] });
    });
    bulles.forEach(({ b, q, de }, i) => {
      if (i === 0) tl.set(b, { opacity: 1, scale: 1, y: 0 }, 0);
      else tl.fromTo(b, { opacity: 0, scale: 0.6, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(2)", immediateRender: false }, de - 0.3);
      const suite = bulles[i + 1] ? bulles[i + 1].de - 0.35 : T.outro;
      tl.to(b, { opacity: 0, scale: 0.85, y: -20, duration: 0.25, ease: "power2.in" }, suite);
      if (i > 0 && bulles[i - 1].q !== q) focus(q, de - 0.4);
    });

    // ── Réactions ──
    const sourcils = (q, t, d = 1, h = -14) => tl.to(P[q].sourcils, { keyframes: [{ y: h, duration: 0.18, ease: "back.out(3)" }, { y: h, duration: d }, { y: 0, duration: 0.25 }] }, t);
    const hoche = (q, t) => tl.to(P[q].tete, { keyframes: [{ y: 10, duration: 0.15 }, { y: 0, duration: 0.15 }, { y: 8, duration: 0.15 }, { y: 0, duration: 0.15 }] }, t);
    const penche = (q, t, r, d) => tl.to(P[q].tete, { keyframes: [{ rotation: r, duration: 0.3, ease: "power2.out" }, { rotation: r, duration: d }, { rotation: 0, duration: 0.3 }] }, t);
    const montre = (cible, t, fin, d = 0.2) => { tl.fromTo(cible, { opacity: 0 }, { opacity: 1, duration: d, immediateRender: false }, t); tl.to(cible, { opacity: 0, duration: d }, fin); };
    const rire = (q, t, d = 0.8) => {
      const p = P[q];
      tl.set(p.rieurs, { opacity: 1 }, t); tl.set(p.yeux, { opacity: 0 }, t);
      tl.to(p.tete, { keyframes: [{ rotation: -5, y: -6, duration: 0.14 }, { rotation: 4, duration: 0.14 }, { rotation: -4, duration: 0.14 }, { rotation: 0, y: 0, duration: 0.2 }] }, t);
      tl.set(p.rieurs, { opacity: 0 }, t + d); tl.set(p.yeux, { opacity: 1 }, t + d);
    };

    // Hook : Sandrine bras levés, qui sautille ; les copines sourient
    tl.set(P.S.leves, { opacity: 1 }, 0); tl.set(P.S.bras, { opacity: 0 }, 0);
    tl.fromTo(P.S.leves, { y: 0 }, { y: -16, duration: 0.3, yoyo: true, repeat: 17, ease: "sine.inOut", immediateRender: true }, 0);
    tl.fromTo(div.S, { y: 0 }, { y: -12, duration: 0.3, yoyo: true, repeat: 17, ease: "sine.inOut", immediateRender: true }, 0);
    tl.set(P.S.sourire, { opacity: 1 }, 0);
    tl.to(P.S.leves, { opacity: 0, duration: 0.2 }, 5.75); tl.to(P.S.bras, { opacity: 1, duration: 0.2 }, 5.75);
    tl.to(P.S.sourire, { opacity: 0, duration: 0.2 }, 5.75);
    montre(P.M.sourire, 0, 6.0); montre(P.J.sourire, 0, 2.6);
    sourcils("J", 2.6, 2.2, -12);              // Joëlle sceptique
    // Murielle sous les sacs
    rire("S", 9.2, 0.9); rire("J", 9.5, 0.8);
    tl.set(P.M.gouttes, { opacity: 1 }, 9.0); tl.to(P.M.gouttes, { opacity: 0, duration: 0.3 }, 10.6);
    // Joëlle et le soleil
    tl.to(P.J.gouttes, { opacity: 1, duration: 0.2 }, T.soleil + 0.2); tl.to(P.J.gouttes, { opacity: 0, duration: 0.3 }, 17.4);
    tl.fromTo(P.J.gouttes, { y: 0 }, { y: 14, duration: 0.8, repeat: 2, ease: "power1.in", immediateRender: false }, T.soleil + 0.2);
    sourcils("M", 12.5, 1.6, -12); penche("S", 13.6, -6, 1.6);
    sourcils("J", 17.6, 1.5, -16); sourcils("M", 17.6, 1.5, -12);    // « Un seul chauffeur »
    hoche("S", 19.98);
    penche("J", 23.58, 7, 1.4); rire("M", 24.4, 0.8); tl.to(P.S.sourire, { opacity: 1, duration: 0.2 }, 24.0); tl.to(P.S.sourire, { opacity: 0, duration: 0.2 }, 25.6);
    sourcils("J", T.c10, 1.2, -12); sourcils("M", T.c3333, 1.2, -14);
    hoche("J", T.moins + 0.3); hoche("M", T.moins + 0.5);

    // Chute : Murielle saute de joie, Joëlle lui tient le bras en riant, Sandrine s'écarte en souriant
    tl.fromTo(div.M, { y: 0 }, { y: -90, duration: 0.28, yoyo: true, repeat: 13, ease: "power2.out", immediateRender: false }, T.saut);
    tl.to(P.M.sourire, { opacity: 1, duration: 0.2 }, T.saut);
    tl.set(P.M.rieurs, { opacity: 1 }, T.saut); tl.set(P.M.yeux, { opacity: 0 }, T.saut);
    tl.to(div.S, { x: 210, ...FLOU, scale: 0.9, duration: 0.5, ease: "power2.inOut" }, T.tient - 0.4);
    tl.to(div.J, { x: -250, ...NET, duration: 0.5, ease: "power2.inOut" }, T.tient - 0.4);
    tl.to(div.M, { x: 40, ...NET, duration: 0.5, ease: "power2.inOut" }, T.tient - 0.4);
    tl.fromTo(P.J.tient, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, T.tient + 0.05);
    tl.set(P.J.rieurs, { opacity: 1 }, T.tient + 0.6); tl.set(P.J.yeux, { opacity: 0 }, T.tient + 0.6);
    tl.to(P.J.sourire, { opacity: 1, duration: 0.2 }, T.tient + 0.6); tl.to(P.S.sourire, { opacity: 1, duration: 0.2 }, T.tient);
    tl.to(P.J.tete, { keyframes: [{ rotation: -6, duration: 0.15 }, { rotation: 4, duration: 0.15 }], repeat: 5 }, T.tient + 0.6);

    // ── Carte d'état (fonction pure du temps pour ses textes) ──
    const C = { nom: document.getElementById("carte-nom"), grand: document.getElementById("grand"), sous: document.getElementById("carte-sous") };
    const nbSacs = (t) => T.chutes.filter((c) => t >= c).length;
    const carte = (t) => {
      const sacs = t >= T.sacsCarte - 0.5 && t < T.taxis, fin = t >= T.sortieOk - 0.3 && t < T.retour;
      C.nom.textContent = sacs ? "SACS DE MURIELLE" : "SAMEDI SHOPPING";
      C.grand.innerHTML = sacs ? `SACS <em>× ${nbSacs(t)}</em>` : "SORTIE <em>?</em>";
      C.sous.textContent = sacs ? "QUI LES PORTE ?" : fin ? "4 ARRÊTS · SACS AU COFFRE" : "4 ARRÊTS · 3 COPINES";
      C.sous.style.color = sacs ? "#D9473B" : fin ? VERT : "#8A867E";
    };
    // ── Mini carte : arrêts allumés, voiture JP qui fait le tour (fonction pure du temps) ──
    const plan = decorPlan(document.getElementById("svg-plan"));
    const posAuto = (u) => { u = ((u % 4) + 4) % 4; const k = Math.floor(u), f = u - k, a = ARRETS[k], b = ARRETS[(k + 1) % 4]; return [a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f]; };
    const tourAuto = (t) => {
      const [a, z] = T.tour;
      const u = t < a ? 0 : t < z ? ((t - a) / (z - a)) * 4 : 4 + ((t - z) / 5) * 4;
      const [x, y] = posAuto(u);
      plan.auto.setAttribute("transform", `translate(${x} ${y})`);
    };
    const temps = { t: 0 };
    const horloge = (t) => { carte(t); tourAuto(t); ecran(t); };

    tl.fromTo("#carte", { rotation: -1.5 }, { keyframes: [{ rotation: 1.5, duration: 0.3 }, { rotation: -1.5, duration: 0.3 }], repeat: 2, immediateRender: true }, 0);
    tl.to("#carte", { x: -1000, opacity: 0, duration: 0.4, ease: "power2.in" }, T.plan - 0.15);
    tl.fromTo("#carte", { x: 1000, opacity: 0, rotation: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, T.sacsCarte);
    tl.to("#carte", { keyframes: [{ x: -6, duration: 0.04 }, { x: 6, duration: 0.04 }, { x: 0, duration: 0.04 }] }, T.chutes[0]);
    T.chutes.forEach((c) => tl.fromTo("#grand em", { scale: 1.4 }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, c));
    tl.to("#carte", { x: -1000, opacity: 0, duration: 0.4, ease: "power2.in" }, T.taxis - 0.2);
    tl.fromTo("#carte", { x: 1000, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, T.sortieOk - 0.3);
    tl.set("#grand", { opacity: 0 }, T.sortieOk - 0.3);
    tl.fromTo("#carte-ok", { opacity: 0, scale: 0.4, rotation: -8 }, { opacity: 1, scale: 1, rotation: -2, duration: 0.45, ease: "back.out(2.6)", immediateRender: false }, T.sortieOk + 0.1);
    tl.to("#carte", { y: -40, opacity: 0, duration: 0.35 }, T.outro);

    // ── 2. Mini carte : 4 arrêts qui s'allument ──
    tl.fromTo("#plan", { opacity: 0, x: 900, rotation: 4 }, { opacity: 1, x: 0, rotation: -1, duration: 0.5, ease: "back.out(1.5)", immediateRender: false }, T.plan);
    T.arrets.forEach((t, k) => {
      tl.to(plan.pins[k].rond, { attr: { fill: MOUTARDE }, duration: 0.15 }, t);
      tl.fromTo(plan.pins[k].rond, { attr: { r: 24 } }, { attr: { r: 34 }, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, t);
      tl.to(plan.pins[k].etiq, { opacity: 1, duration: 0.2 }, t);
    });
    tl.to("#plan", { x: -900, opacity: 0, duration: 0.4, ease: "power2.in" }, T.sacsCarte - 0.15);

    // ── 3. Les sacs tombent sur Murielle, « BOUM » ──
    const zs = document.getElementById("sacs");
    const PILE = [[40, 1500, -8], [180, 1490, 7], [20, 1360, 10], [170, 1350, -6], [95, 1420, 3], [0, 1230, -14], [200, 1220, 12], [100, 1290, -4]];
    const sacs = PILE.map(([x, y, r], k) => {
      const s = sacSVG(zs, k);
      tl.fromTo(s, { x: x + 40, y: -260, rotation: r * 3, opacity: 1 }, { x, y, rotation: r, duration: 0.42, ease: "power2.in", immediateRender: false }, T.chutes[k] - 0.42);
      tl.to(s, { keyframes: [{ scaleY: 0.86, scaleX: 1.08, duration: 0.07 }, { scaleY: 1, scaleX: 1, duration: 0.12 }], transformOrigin: "50% 100%" }, T.chutes[k]);
      const boum = document.createElement("div"); boum.className = "boum"; boum.textContent = k % 2 ? "BOUM !" : "PAF !"; zs.appendChild(boum);
      const bx = 300 + (k % 3) * 30, by = 1150 + (k % 4) * 70;
      tl.fromTo(boum, { x: bx, y: by, opacity: 0, scale: 0.4, rotation: k % 2 ? 8 : -8 }, { opacity: 1, scale: 1, duration: 0.15, ease: "back.out(3)", immediateRender: false }, T.chutes[k]);
      tl.to(boum, { opacity: 0, y: by - 40, duration: 0.25 }, T.chutes[k] + 0.4);
      return s;
    });
    tl.to(div.M, { keyframes: [{ scaleY: 0.94, duration: 0.08 }, { scaleY: 1.06 * 1, duration: 0.15 }] }, T.chutes[7]);

    // ── 4. Quatre taxis, badges rouges, soleil brûlant au-dessus de Joëlle ──
    const zt = document.getElementById("taxis");
    const POS = [[130, 290], [440, 290], [130, 530], [440, 530]];
    const taxis = POS.map(([x, y], k) => {
      const d = document.createElement("div"); d.className = "taxi"; d.style.left = x + "px"; d.style.top = y + "px";
      taxiSVG(d);
      const b = document.createElement("div"); b.className = "badge-r"; b.textContent = k % 2 ? "NÉGOCIER" : "ATTENDRE"; d.appendChild(b);
      zt.appendChild(d);
      tl.fromTo(d, { opacity: 0, scale: 0.5, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(2.2)", immediateRender: false }, T.taxis + k * 0.12);
      tl.to(d, { keyframes: [{ scale: 1.1, duration: 0.1 }, { scale: 1, duration: 0.15 }] }, T.x4 + k * 0.15);
      tl.fromTo(b, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(3)", immediateRender: false }, (k % 2 ? T.negocier : T.attendre) + (k > 1 ? 0.3 : 0));
      // « Un seul chauffeur » : les 4 taxis convergent au centre et s'effacent
      tl.to(d, { keyframes: [{ x: k % 2 ? 6 : -6, duration: 0.05 }, { x: 0, duration: 0.05 }], repeat: 2 }, T.non);
      tl.to(d, { x: 300 - x, y: 400 - y, scale: 0.4, opacity: 0, duration: 0.45, ease: "power3.in" }, T.fusion);
      return d;
    });
    const rayons = decorSoleil(document.getElementById("svg-soleil"));
    tl.fromTo("#soleil", { opacity: 0, scale: 0.3, y: -100 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(2)", immediateRender: false }, T.soleil);
    tl.fromTo(rayons, { rotation: 0 }, { rotation: 90, svgOrigin: "0 0", duration: 3, ease: "none", immediateRender: false }, T.soleil);
    tl.fromTo("#soleil", { scale: 1 }, { scale: 1.1, duration: 0.4, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, T.soleil + 0.5);
    tl.to("#soleil", { opacity: 0, y: -80, duration: 0.35 }, T.fusion);
    voitureJP(document.getElementById("svg-auto"));
    tl.fromTo("#auto-jp", { opacity: 0, scale: 0.3, rotation: -8 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.2)", immediateRender: false }, T.fusion + 0.4);
    tl.to("#auto-jp", { keyframes: [{ y: -10, duration: 0.25 }, { y: 0, duration: 0.25 }], repeat: 1 }, T.fusion + 0.9);
    tl.to("#auto-jp", { scale: 0.3, opacity: 0, y: -60, duration: 0.4, ease: "power2.in" }, T.plan2 - 0.1);

    // ── 5. La voiture JP fait le tour des 4 arrêts ──
    tl.fromTo("#plan", { opacity: 0, x: 0, scale: 0.85, rotation: -1 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)", immediateRender: false }, T.plan2);
    tl.fromTo(plan.route, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, T.plan2 + 0.3);
    tl.fromTo(plan.auto, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, T.plan2 + 0.3);
    tl.fromTo("#ministre", { opacity: 0, scale: 2, rotation: 14 }, { opacity: 1, scale: 1, rotation: -6, duration: 0.35, ease: "back.out(2)", immediateRender: false }, T.ministre);
    tl.to(["#plan", "#ministre"], { x: -900, opacity: 0, duration: 0.4, ease: "power2.in" }, T.calc - 0.2);

    // ── 6. Calculatrice : 5 h × 2 000 = 10 000 F, ÷ 3 = 3 333 F chacune, « < 3 500 F » ──
    const TOUCHES = ["7", "8", "9", "×", "4", "5", "6", "÷", "1", "2", "3", "+", "C", "0", "h", "="];
    const zoneT = document.getElementById("touches"), touche = {};
    TOUCHES.forEach((k) => { const d = document.createElement("div"); d.className = "touche" + ("×÷+=".includes(k) ? " op" : ""); d.textContent = k; zoneT.appendChild(d); touche[k] = d; });
    const fondTouche = (k) => ("×÷+=".includes(k) ? "rgba(245,165,36,0.9)" : "rgba(255,255,255,0.75)");
    const appuie = (k, t) => tl.fromTo(touche[k], { scale: 1, backgroundColor: fondTouche(k) }, { keyframes: [{ scale: 0.86, backgroundColor: "#FFE3A8", duration: 0.07 }, { scale: 1, backgroundColor: fondTouche(k), duration: 0.18 }], immediateRender: false }, t);
    const tape = (texte, t0, d) => { const c = [...texte].filter((c) => touche[c]); c.forEach((c, i) => appuie(c, t0 + (d * i) / Math.max(1, c.length))); };
    const E = { hist: document.getElementById("calc-hist"), expr: document.getElementById("calc-expr"), res: document.getElementById("calc-res") };
    const frappe = (t, t0, d, s) => (t < t0 ? "" : s.slice(0, Math.ceil(Math.min(1, (t - t0) / d) * s.length)));
    function ecran(t) {
      let hist = "", expr = "", res = "", vert = false;
      if (t >= T.c2000) hist = "dès 5 h : 2 000 F /h";
      if (t >= T.cmul) expr = frappe(t, T.cmul, 0.9, "5 h × 2 000");
      if (t >= T.c10) res = "= 10 000 F";
      if (t >= T.cdiv) { hist = "5 h × 2 000 = 10 000 F"; expr = frappe(t, T.cdiv, 1.4, "10 000 ÷ 3"); res = ""; }
      if (t >= T.c3333) { res = "= 3 333 F"; expr = "10 000 ÷ 3 · chacune"; }
      if (t >= T.moins) vert = true;
      E.hist.textContent = hist; E.expr.textContent = expr; E.res.textContent = res;
      E.res.style.color = vert ? VERT : "#fff";
    }
    horloge(0);
    tl.fromTo(temps, { t: 0 }, { t: T.duree, duration: T.duree, ease: "none", onUpdate: () => horloge(temps.t), immediateRender: true }, 0);
    tl.fromTo("#calc", { x: 900, opacity: 0, rotation: 6 }, { x: 0, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(1.4)", immediateRender: false }, T.calc);
    tl.to("#calc", { keyframes: [{ y: -8, duration: 1.2, ease: "sine.inOut" }, { y: 0, duration: 1.2, ease: "sine.inOut" }], repeat: 2 }, T.calc + 0.7);
    tape("5h×2000", T.cmul, 0.9); appuie("=", T.c10);
    appuie("C", T.cdiv - 0.15); tape("10000÷3", T.cdiv, 1.4); appuie("=", T.c3333);
    [T.c10, T.c3333].forEach((t) => tl.fromTo("#calc-res", { scale: 1.35 }, { scale: 1, duration: 0.4, ease: "back.out(3)", transformOrigin: "100% 60%", immediateRender: false }, t));
    tl.fromTo("#sticker", { opacity: 0, scale: 2, rotation: 14 }, { opacity: 1, scale: 1, rotation: -6, duration: 0.35, ease: "back.out(2)", immediateRender: false }, T.moins);
    tl.to("#sticker", { keyframes: [{ scale: 1.08, duration: 0.3 }, { scale: 1, duration: 0.3 }], repeat: 1 }, T.moins + 0.5);
    tl.to(["#calc", "#sticker"], { x: 900, opacity: 0, duration: 0.45, ease: "power2.in" }, T.coffre - 0.2);

    // ── 7. Le coffre s'ouvre et avale tous les sacs de Murielle ──
    const { hayon, ouvert } = decorCoffre(document.getElementById("svg-coffre"));
    tl.fromTo("#coffre", { opacity: 0, y: 400 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.4)", immediateRender: false }, T.coffre);
    tl.set(hayon, { opacity: 0 }, T.coffre + 0.35); tl.set(ouvert, { opacity: 1 }, T.coffre + 0.35);
    tl.fromTo(ouvert, { y: 30 }, { y: 0, duration: 0.3, ease: "back.out(2)", immediateRender: false }, T.coffre + 0.35);
    // centre de l'ouverture du coffre (repère de la caméra)
    const cx = 224 + 16 + 300 - 75, cy = 290 + 16 + 236 - 85;
    sacs.forEach((s, k) => tl.to(s, { x: cx, y: cy, rotation: (k % 2 ? 1 : -1) * 200, scale: 0.35, duration: 0.5, ease: "power2.in" }, T.aspire + k * 0.1));
    sacs.forEach((s, k) => tl.to(s, { opacity: 0, duration: 0.08 }, T.aspire + k * 0.1 + 0.5));
    tl.set(ouvert, { opacity: 0 }, T.ferme); tl.set(hayon, { opacity: 1 }, T.ferme);
    tl.to("#coffre", { keyframes: [{ y: 8, duration: 0.06 }, { y: 0, duration: 0.1 }] }, T.ferme);
    tl.to("#coffre", { x: -900, opacity: 0, duration: 0.4, ease: "power2.in" }, T.sortieOk - 0.4);

    // ── Outro WhatsApp (Murielle et Joëlle restent en bas) ──
    tl.to(".logo", { opacity: 0, duration: 0.3 }, T.outro);
    tl.fromTo("#outro", { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, T.outro + 0.2);
    tl.fromTo(".outro-logo", { scale: 0.4, rotation: -10 }, { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)", immediateRender: false }, T.outro + 0.2);
    tl.fromTo(".outro-slogan", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", immediateRender: false }, T.outro + 0.5);
    tl.fromTo(".bouton-wa", { y: 60, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)", immediateRender: false }, T.outro + 0.7);
    tl.fromTo(".bouton-wa .num", { opacity: 0.25, y: 10 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.18, ease: "back.out(3)", immediateRender: false }, T.outro + 1.0);
    tl.to(".bouton-wa", { keyframes: [{ scale: 1.05, duration: 0.4, ease: "sine.inOut" }, { scale: 1, duration: 0.4, ease: "sine.inOut" }], repeat: 2 }, T.outro + 2.0);
    tl.to(".outro-logo", { keyframes: [{ y: -10, duration: 1.1, ease: "sine.inOut" }, { y: 0, duration: 1.1, ease: "sine.inOut" }] }, T.outro + 0.8);

    // ── Retour à l'image 1 (boucle) ──
    const R0 = T.retour;
    tl.to("#outro", { opacity: 0, duration: 0.3 }, R0);
    tl.to(".logo", { opacity: 1, duration: 0.3 }, R0);
    tl.set("#camera", cad(1, 540, 1100), R0);
    tl.set("#grand", { opacity: 1 }, R0);
    tl.set("#carte-ok", { opacity: 0 }, R0);
    tl.fromTo("#carte", { x: 0, y: 0, opacity: 0, rotation: -1.5 }, { opacity: 1, duration: 0.3, immediateRender: false }, R0);
    tl.set(P.J.tient, { opacity: 0 }, R0);
    QUI.forEach((q) => { tl.set(P[q].rieurs, { opacity: 0 }, R0); tl.set(P[q].yeux, { opacity: 1 }, R0); tl.set(P[q].tete, { rotation: 0 }, R0); });
    tl.set([P.J.sourire], { opacity: 0 }, R0);
    tl.set([P.S.sourire, P.M.sourire], { opacity: 1 }, R0);
    tl.set(P.S.bras, { opacity: 0 }, R0); tl.set(P.S.leves, { opacity: 1, y: 0 }, R0);
    QUI.forEach((q) => tl.to(div[q], { x: 0, y: 0, ...(q === "S" ? NET : FLOU), duration: 0.3 }, R0));
    tl.set(motsPremiere.map((s) => s.lastChild), { color: GRIS }, R0);
    tl.fromTo(bulles[0].b, { opacity: 0, scale: 0.9, y: 0 }, { opacity: 1, scale: 1, duration: 0.3, immediateRender: false }, R0);

    tl.to({}, { duration: T.duree }, 0);
  };
})();
