// « Le jour J » — JP STORIES, format DÉBAT (34 s, 9:16). Voir frame.md. Mise en page et composants de pub-debat.
// 100 % dialogue, sans narrateur : Ryan (gauche) panique le matin du concours, Maman Odette (droite) a déjà tout prévu.
// Chaque réplique s'écrit mot par mot dans une bulle au-dessus de celui qui parle (net, zoomé ; l'autre est flou et réagit).
// Zone centrale : carte d'état « CONCOURS 07:00 » → porte d'école + cahiers → téléphone → tableau noir → voiture → « à l'heure ».
// Cadrages : plan large, gros plan sur Maman, plan serré sur le téléphone, plan à deux pour le câlin. Fin : outro, retour à l'image 1.
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const NUIT = "#0B1B4D", MOUTARDE = "#F5A524", VERT = "#22C55E", ENCRE = "#1A1A1A", GRIS = "#BDB8AE";
  const NOMS = { R: "RYAN", N: "MAMAN ODETTE" };

  const el = (parent, tag, attrs = {}) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    parent.appendChild(e);
    return e;
  };
  // Espaces insécables : « 6 h 15 », « taxi ? »
  const insecable = (s) => s.replace(/(\d) h (\d)/g, "$1 h $2").replace(/(\d) h\b/g, "$1 h").replace(/ ([?!:;…])/g, " $1");

  // ════ Personnages plats, en couches (aucun attribut transform sur les groupes animés) ════
  function personnage(svg, qui) {
    const R = qui === "R";
    const peau = R ? "#5A3522" : "#7A4A30", ombre = R ? "#3F2416" : "#5C3420";
    const defs = el(svg, "defs");
    // Chemise d'uniforme beige (Ryan) ou wax bleu (Maman Odette)
    const tissu = R ? "#D9C29C" : `url(#wax-${qui})`;
    const wax = el(defs, "pattern", { id: "wax-" + qui, width: 60, height: 60, patternUnits: "userSpaceOnUse" });
    el(wax, "rect", { width: 60, height: 60, fill: "#1E40AF" });
    el(wax, "circle", { cx: 30, cy: 30, r: 15, fill: "none", stroke: "#E8E1D0", "stroke-width": 5 });
    el(wax, "circle", { cx: 30, cy: 30, r: 6, fill: MOUTARDE });
    el(wax, "path", { d: "M0 0 Q8 8 0 16 M60 44 Q52 52 60 60 M44 0 Q52 8 60 0 M0 60 Q8 52 16 60", stroke: "#93C5FD", "stroke-width": 4, fill: "none" });
    const foulard = el(defs, "pattern", { id: "foulard-" + qui, width: 44, height: 44, patternUnits: "userSpaceOnUse" });
    el(foulard, "rect", { width: 44, height: 44, fill: "#1D4ED8" });
    el(foulard, "path", { d: "M22 4 L40 22 L22 40 L4 22Z", fill: "none", stroke: "#DBEAFE", "stroke-width": 4 });
    el(foulard, "circle", { cx: 22, cy: 22, r: 5, fill: "#fff" });

    const corps = el(svg, "g");
    if (R) {
      // Manches courtes + avant-bras, chemise, col, boutons, poche à écusson, bretelles du sac à dos
      [-1, 1].forEach((s) => {
        el(corps, "path", { d: `M${s * 150} 0 Q${s * 200} 60 ${s * 196} 130 L${s * 136} 130 Q${s * 140} 80 ${s * 110} 60Z`, fill: tissu });
        el(corps, "path", { d: `M${s * 194} 130 Q${s * 205} 240 ${s * 190} 340 L${s * 140} 340 Q${s * 140} 230 ${s * 138} 130Z`, fill: peau });
      });
      el(corps, "rect", { x: -34, y: -90, width: 68, height: 80, rx: 20, fill: ombre });
      el(corps, "path", { d: "M-170 340 L-166 50 Q-158 -22 -82 -36 L82 -36 Q158 -22 166 50 L170 340Z", fill: tissu });
      el(corps, "path", { d: "M-50 -38 L-4 22 L-14 -38Z M50 -38 L4 22 L14 -38Z", fill: "#EADBBE", stroke: "#B89E74", "stroke-width": 3 });
      [60, 130, 200, 270].forEach((y) => el(corps, "circle", { cx: 0, cy: y, r: 6, fill: "#F3EBDD" }));
      el(corps, "rect", { x: 46, y: 70, width: 70, height: 80, rx: 6, fill: "#CDB386" });
      el(corps, "path", { d: "M62 86 L100 86 L100 110 Q81 128 62 110Z", fill: "#3D5BD9", stroke: "#fff", "stroke-width": 3 });
      el(corps, "path", { d: "M-112 -30 L-100 340 M112 -30 L100 340", stroke: "#3A3550", "stroke-width": 30, "stroke-linecap": "round" });
    } else {
      [-1, 1].forEach((s) => el(corps, "path", { d: `M${s * 150} 0 Q${s * 215} 120 ${s * 200} 340 L${s * 140} 340 Q${s * 150} 170 ${s * 110} 60Z`, fill: tissu }));
      el(corps, "rect", { x: -34, y: -90, width: 68, height: 80, rx: 20, fill: ombre });
      el(corps, "path", { d: "M-170 340 L-166 50 Q-158 -22 -82 -36 L82 -36 Q158 -22 166 50 L170 340Z", fill: tissu });
      el(corps, "path", { d: "M-60 -34 Q0 40 60 -34Z", fill: peau });
      el(corps, "path", { d: "M-60 -34 Q0 40 60 -34", fill: "none", stroke: MOUTARDE, "stroke-width": 8 });
    }

    // Bras du câlin (Maman entoure Ryan), caché au départ
    let calin = null;
    if (!R) {
      calin = el(svg, "g", { opacity: 0 });
      el(calin, "path", { d: "M-130 30 Q-270 -40 -400 30", stroke: tissu, "stroke-width": 62, "stroke-linecap": "round", fill: "none" });
      el(calin, "circle", { cx: -404, cy: 34, r: 30, fill: peau });
    }

    // Tête
    const tete = el(svg, "g");
    el(tete, "circle", { cx: -92, cy: -150, r: 19, fill: peau });
    el(tete, "circle", { cx: 92, cy: -150, r: 19, fill: peau });
    el(tete, "ellipse", { cx: 0, cy: -160, rx: 90, ry: 105, fill: peau });
    if (R) {
      el(tete, "path", { d: "M-90 -186 Q-94 -274 0 -272 Q94 -274 90 -186 Q82 -236 0 -238 Q-82 -236 -90 -186Z", fill: ENCRE });
    } else {
      el(tete, "path", { d: "M-102 -176 Q-130 -318 0 -332 Q136 -318 104 -172 Q66 -230 0 -230 Q-66 -230 -102 -176Z", fill: `url(#foulard-N)` });
      el(tete, "path", { d: "M10 -310 Q70 -350 110 -300 Q80 -270 30 -280Z", fill: `url(#foulard-N)`, stroke: "rgba(0,0,0,.18)", "stroke-width": 3 });
      el(tete, "circle", { cx: -94, cy: -116, r: 12, fill: MOUTARDE });
      el(tete, "circle", { cx: 94, cy: -116, r: 12, fill: MOUTARDE });
    }
    // Yeux (clignement), yeux rieurs (^ ^)
    const dx = R ? 4 : -4; // regard vers l'autre
    const yeux = el(tete, "g");
    [-34, 34].forEach((x) => {
      el(yeux, "ellipse", { cx: x, cy: -166, rx: 16, ry: 14, fill: "#fff" });
      el(yeux, "circle", { cx: x + dx, cy: -165, r: 8, fill: ENCRE });
      if (!R) el(yeux, "path", { d: `M${x - 18} -176 L${x - 24} -184 M${x + 18} -176 L${x + 24} -184`, stroke: ENCRE, "stroke-width": 4, "stroke-linecap": "round" });
    });
    const rieurs = el(tete, "g", { opacity: 0 });
    [-34, 34].forEach((x) => el(rieurs, "path", { d: `M${x - 18} -160 Q${x} -184 ${x + 18} -160`, stroke: ENCRE, "stroke-width": 8, fill: "none", "stroke-linecap": "round" }));
    const sourcils = el(tete, "g");
    [-1, 1].forEach((s) => el(sourcils, "path", { d: `M${s * 56} -194 Q${s * 36} ${R ? -206 : -210} ${s * 14} -198`, stroke: ENCRE, "stroke-width": R ? 10 : 8, fill: "none", "stroke-linecap": "round" }));
    el(tete, "path", { d: "M-2 -152 Q-16 -122 -6 -118 Q2 -115 12 -120", stroke: ombre, "stroke-width": 6, fill: "none", "stroke-linecap": "round" });
    const bouche = el(tete, "g");
    el(bouche, "ellipse", { cx: 0, cy: -96, rx: 28, ry: 20, fill: R ? "#3B0F0F" : "#5E1420" });
    el(bouche, "ellipse", { cx: 0, cy: -84, rx: 14, ry: 7, fill: "#D9473B" });
    const sourire = el(tete, "path", { d: "M-32 -108 Q0 -82 32 -108", stroke: R ? "#3B0F0F" : "#7A1F2B", "stroke-width": 7, fill: "none", "stroke-linecap": "round", opacity: 0 });
    // Sourire en coin (Maman) ou gouttes de sueur (Ryan paniqué)
    const coin = R ? null : el(tete, "path", { d: "M-24 -104 Q8 -96 34 -122", stroke: "#7A1F2B", "stroke-width": 7, fill: "none", "stroke-linecap": "round", opacity: 0 });
    let gouttes = null;
    if (R) {
      gouttes = el(tete, "g", { opacity: 0 });
      el(gouttes, "path", { d: "M84 -236 Q70 -212 84 -204 Q98 -212 84 -236Z", fill: "#7CC4FF" });
      el(gouttes, "path", { d: "M-100 -214 Q-110 -196 -100 -190 Q-90 -196 -100 -214Z", fill: "#7CC4FF" });
    }

    return { corps, calin, tete, yeux, rieurs, sourcils, bouche, sourire, coin, gouttes };
  }

  // ════ Décors des vignettes ════
  function decorPorte(svg) {
    el(svg, "rect", { width: 520, height: 400, fill: "#FBE3BD" });
    el(svg, "rect", { x: 40, y: 80, width: 440, height: 320, fill: "#E8D5B5" });
    el(svg, "rect", { x: 20, y: 56, width: 480, height: 40, rx: 8, fill: "#B4532A" });
    el(svg, "rect", { x: 120, y: 112, width: 280, height: 50, rx: 12, fill: NUIT });
    el(svg, "text", { x: 260, y: 145, "text-anchor": "middle", "font-family": "JetBrains Mono", "font-weight": 700, "font-size": 22, fill: "#fff", "letter-spacing": 2 }).textContent = "CENTRE D'EXAMEN";
    [[62, 190], [384, 190]].forEach(([x, y]) => { el(svg, "rect", { x, y, width: 74, height: 90, rx: 6, fill: "#9CC3E6" }); el(svg, "path", { d: `M${x + 37} ${y} V${y + 90} M${x} ${y + 45} H${x + 74}`, stroke: "#E8D5B5", "stroke-width": 6 }); });
    el(svg, "rect", { x: 170, y: 180, width: 180, height: 210, fill: "#2A2118" });
    const g = el(svg, "g"), d = el(svg, "g");
    el(g, "rect", { x: 170, y: 180, width: 90, height: 210, fill: "#3D5BD9", stroke: NUIT, "stroke-width": 4 });
    el(g, "circle", { cx: 248, cy: 290, r: 6, fill: MOUTARDE });
    el(d, "rect", { x: 260, y: 180, width: 90, height: 210, fill: "#3D5BD9", stroke: NUIT, "stroke-width": 4 });
    el(d, "circle", { cx: 272, cy: 290, r: 6, fill: MOUTARDE });
    el(svg, "rect", { y: 388, width: 520, height: 12, fill: "#A8A29A" });
    const clac = el(svg, "text", { x: 260, y: 300, "text-anchor": "middle", "font-family": "Archivo Black", "font-size": 92, fill: "#E10600", stroke: "#fff", "stroke-width": 10, "paint-order": "stroke", opacity: 0 });
    clac.textContent = "CLAC !";
    return { g, d, clac };
  }

  function decorVoiture(svg) {
    const defs = el(svg, "defs");
    const ciel = el(defs, "linearGradient", { id: "ciel", x1: 0, y1: 0, x2: 0, y2: 1 });
    el(ciel, "stop", { offset: 0, "stop-color": "#22305F" });
    el(ciel, "stop", { offset: 1, "stop-color": "#F4A261" });
    el(svg, "rect", { width: 680, height: 400, fill: "url(#ciel)" });
    el(svg, "rect", { y: 312, width: 680, height: 88, fill: "#4B4F5C" });
    el(svg, "path", { d: "M0 350 H680", stroke: "#F5F3EE", "stroke-width": 6, "stroke-dasharray": "40 30", opacity: 0.6 });
    el(svg, "polygon", { points: "20,130 190,48 360,130", fill: "#9A3B26" });
    el(svg, "rect", { x: 40, y: 126, width: 300, height: 190, fill: "#E9DCC3" });
    el(svg, "rect", { x: 155, y: 206, width: 70, height: 110, rx: 6, fill: "#6B4129" });
    [[66, 170], [254, 170]].forEach(([x, y]) => el(svg, "rect", { x, y, width: 60, height: 52, rx: 6, fill: "#FFD27A" }));
    const auto = el(svg, "g");
    const faisceau = el(auto, "polygon", { points: "640,282 760,230 760,350", fill: "#FFF1B8", opacity: 0.55 });
    el(auto, "path", { d: "M360 318 L362 268 Q366 250 390 246 L440 238 L480 200 Q490 192 506 192 L590 192 Q606 192 616 204 L640 238 Q656 244 658 262 L660 318Z", fill: NUIT });
    el(auto, "path", { d: "M488 208 L522 208 L522 240 L458 240Z M534 208 L592 208 Q600 208 606 216 L622 240 L534 240Z", fill: "#9CC3E6" });
    el(auto, "text", { x: 512, y: 290, "text-anchor": "middle", "font-family": "Archivo Black", "font-size": 30, fill: MOUTARDE }).textContent = "JP";
    el(auto, "circle", { cx: 646, cy: 280, r: 12, fill: "#FFF1B8" });
    [420, 600].forEach((cx) => { el(auto, "circle", { cx, cy: 320, r: 30, fill: "#111" }); el(auto, "circle", { cx, cy: 320, r: 12, fill: "#9CA3AF" }); });
    const bips = [[520, 150], [610, 100]].map(([x, y]) => {
      const t = el(svg, "text", { x, y, "text-anchor": "middle", "font-family": "Archivo Black", "font-size": 54, fill: MOUTARDE, stroke: NUIT, "stroke-width": 8, "paint-order": "stroke", opacity: 0 });
      t.textContent = "BIP !";
      return t;
    });
    return { auto, faisceau, bips };
  }

  window.CONSTRUIRE = function (tl) {
    const T = window.T;
    const P = { R: personnage(document.getElementById("svg-R"), "R"), N: personnage(document.getElementById("svg-N"), "N") };
    const div = { R: document.getElementById("perso-R"), N: document.getElementById("perso-N") };

    // ── États de départ (image 1) ──
    ["R", "N"].forEach((q) => {
      const p = P[q];
      tl.set(p.bouche, { scaleY: 0.22, svgOrigin: "0 -106" }, 0);
      tl.set(p.tete, { svgOrigin: "0 -40", rotation: 0, y: 0 }, 0);
      tl.set(p.yeux, { svgOrigin: "0 -166", scaleY: 1 }, 0);
      // Respiration douce (rien de figé)
      tl.fromTo(p.corps, { scaleY: 1 }, { scaleY: 1.012, svgOrigin: "0 340", duration: 1.6, repeat: Math.floor(T.duree / 1.6) - 1, yoyo: true, ease: "sine.inOut", immediateRender: true }, q === "R" ? 0 : 0.5);
      for (let t = q === "R" ? 2.2 : 3.4; t < T.duree - 1; t += 3.7) tl.to(p.yeux, { keyframes: [{ scaleY: 0.1, duration: 0.07 }, { scaleY: 1, duration: 0.09 }] }, t);
    });

    // ── Cadrages : point (px, py) fixe, échelle s (origine 0 0) ──
    const cad = (s, px = 540, py = 900) => ({ scale: s, x: px * (1 - s), y: py * (1 - s) });
    const cam = (t, s, px, py, d = 0.45, ease = "power3.inOut") => tl.to("#camera", { ...cad(s, px, py), duration: d, ease }, t);
    tl.fromTo("#camera", cad(1, 540, 1000), { ...cad(1.05, 540, 1000), duration: 6.4, ease: "none", immediateRender: true }, 0); // tension du hook
    cam(6.5, 1, 540, 1000, 0.4);
    cam(T.zoom, 1.3, 790, 1150, 0.5, "power3.out");        // gros plan sur Maman
    cam(13.3, 1, 790, 1150, 0.4);
    cam(T.tel, 1.08, 540, 262, 0.5);                        // plan serré sur le téléphone
    cam(T.tableau - 0.1, 1, 540, 262, 0.4);
    cam(T.calin, 1.06, 540, 1250, 0.6);                     // plan à deux pour le câlin
    cam(T.outro, 1, 540, 1250, 0.4);

    // ── Focus : celui qui parle est net et zoomé, l'autre flou ──
    const focus = (q, t, d = 0.35) => {
      const o = q === "R" ? "N" : "R";
      tl.to(div[q], { filter: "blur(0px)", scale: 1.06, opacity: 1, duration: d, ease: "power2.out" }, t);
      tl.to(div[o], { filter: "blur(5px)", scale: 0.95, opacity: 0.82, duration: d, ease: "power2.out" }, t);
    };
    tl.set(div.R, { filter: "blur(0px)", scale: 1.06, opacity: 1 }, 0);
    tl.set(div.N, { filter: "blur(5px)", scale: 0.95, opacity: 0.82 }, 0);

    // ── Bulles mot par mot ──
    const zone = document.getElementById("bulles");
    const bulles = [];
    const motsPremiere = [];
    T.repliques.forEach(([q, phrases], i) => {
      const b = document.createElement("div");
      b.className = "bulle " + (q === "R" ? "gauche" : "droite");
      b.innerHTML = `<span class="qui">${NOMS[q]}</span>`;
      zone.appendChild(b);
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
          // Hook : l'étiquette « taxi » est déjà posée sur l'image 1
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

    // Ryan paniqué (hook) : il tremble, sourcils hauts, gouttes de sueur
    tl.set(P.R.gouttes, { opacity: 1 }, 0);
    tl.fromTo(P.R.gouttes, { y: 0 }, { y: 14, duration: 0.9, repeat: 6, ease: "power1.in", immediateRender: true }, 0);
    tl.to(P.R.gouttes, { opacity: 0, duration: 0.3 }, 10.9);
    tl.set(P.R.sourcils, { y: -16 }, 0);
    tl.to(P.R.sourcils, { y: 0, duration: 0.3 }, 4.2);
    tl.fromTo(div.R, { x: 0 }, { keyframes: [{ x: -7, duration: 0.06 }, { x: 7, duration: 0.06 }, { x: 0, duration: 0.06 }], repeat: 20, immediateRender: true }, 0);
    sourcils("N", 1.2, 1.5, -12);              // Maman l'écoute, calme
    hoche("N", 5.75);                          // « Respire ! »
    sourcils("R", 6.8, 3.6, -18);              // « ils ferment la porte »
    penche("N", 8.9, -6, 1.6);                 // compatissante
    // « Qui t'a dit… ? » : sourire en coin de Maman, « ? » au-dessus de Ryan
    tl.fromTo(P.N.coin, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, T.zoom + 0.1);
    tl.to(P.N.coin, { opacity: 0, duration: 0.2 }, 13.5);
    penche("N", T.zoom + 0.1, 5, 1.8);
    tl.fromTo("#question", { opacity: 0, scale: 0.3, rotation: -20 }, { opacity: 1, scale: 1, rotation: 8, duration: 0.4, ease: "back.out(3)", immediateRender: false }, 11.6);
    tl.to("#question", { keyframes: [{ rotation: -8, y: -10, duration: 0.4, ease: "sine.inOut" }, { rotation: 8, y: 0, duration: 0.4, ease: "sine.inOut" }], repeat: 1 }, 12.0);
    tl.to("#question", { opacity: 0, scale: 0.6, duration: 0.25 }, 13.4);
    sourcils("R", 11.6, 1.6, -12);
    penche("R", 11.7, -7, 1.4);
    sourcils("R", T.m2, 1.4, -16);             // « Confirmé ✓ »
    tl.to(P.R.tete, { keyframes: [{ y: -14, duration: 0.2 }, { y: -14, duration: 0.8 }, { y: 0, duration: 0.3 }] }, 17.42); // « Tu as fait ça ? »
    penche("N", 18.6, 6, 2.8);                 // fière
    montre(P.N.sourire, 18.6, 22.2);
    hoche("R", 21.5);
    // « BIP ! » : les deux tournent la tête vers la rue
    penche("R", 22.3, 7, 0.9);
    penche("N", 22.3, 5, 0.6);
    hoche("N", 24.06);                         // « Va. »

    // Câlin final : ils se rapprochent, Maman l'entoure, yeux rieurs, petits cœurs
    const C = T.calin;
    tl.to(div.R, { x: 110, rotation: 5, filter: "blur(0px)", scale: 1.04, opacity: 1, duration: 0.5, ease: "power3.out" }, C);
    tl.to(div.N, { x: -110, rotation: -4, filter: "blur(0px)", scale: 1.04, opacity: 1, duration: 0.5, ease: "power3.out" }, C);
    tl.fromTo(P.N.calin, { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: false }, C + 0.3);
    ["R", "N"].forEach((q) => {
      tl.set(P[q].rieurs, { opacity: 1 }, C + 0.3); tl.set(P[q].yeux, { opacity: 0 }, C + 0.3);
      tl.to(P[q].sourire, { opacity: 1, duration: 0.2 }, C + 0.3);
    });
    tl.to(P.R.tete, { rotation: 9, duration: 0.4, ease: "power2.out" }, C + 0.3);
    tl.to(P.N.tete, { rotation: -6, duration: 0.4, ease: "power2.out" }, C + 0.3);
    const zc = document.getElementById("coeurs"), COUL = ["#E8505B", MOUTARDE, "#F472B6"];
    for (let k = 0; k < 10; k++) {
      const c = document.createElementNS(NS, "svg");
      c.setAttribute("viewBox", "0 0 32 30"); c.setAttribute("class", "coeur");
      el(c, "path", { d: "M16 29 C-6 14 2 -4 16 7 C30 -4 38 14 16 29Z", fill: COUL[k % 3] });
      zc.appendChild(c);
      const x0 = 500 + ((k * 67) % 360) - 180, y0 = 1200, dx = ((k * 41) % 300) - 150;
      tl.fromTo(c, { x: x0, y: y0, scale: 0.4, opacity: 0, rotation: (k % 2 ? 12 : -12) },
        { keyframes: [{ opacity: 1, scale: 0.9 + (k % 3) * 0.25, y: y0 - 80, duration: 0.35, ease: "back.out(2)" }, { x: x0 + dx, y: y0 - 200 - (k % 4) * 40, opacity: 0, rotation: (k % 2 ? -10 : 10), duration: 1.6, ease: "sine.out" }], immediateRender: false }, C + 0.5 + k * 0.18);
    }

    // ── 1. Carte d'état : horloge qui tourne (fonction pure du temps, sûre au seek) ──
    const grad = document.getElementById("graduations");
    for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; el(grad, "line", { x1: Math.sin(a) * 60, y1: -Math.cos(a) * 60, x2: Math.sin(a) * 68, y2: -Math.cos(a) * 68, stroke: NUIT, "stroke-width": k % 3 ? 3 : 6 }); }
    const A = { h: document.getElementById("aiguille-h"), m: document.getElementById("aiguille-m"), s: document.getElementById("aiguille-s"),
      heure: document.getElementById("heure"), sous: document.getElementById("carte-sous") };
    const horloge = (t) => {
      const fin = t >= T.alheure && t < T.retour;
      const min = fin ? 45 : t < T.heure2 || t >= T.retour ? 58 : 59, h = fin ? 6 : 5;
      A.h.setAttribute("transform", `rotate(${((h + min / 60) / 12) * 360})`);
      A.m.setAttribute("transform", `rotate(${min * 6})`);
      A.s.setAttribute("transform", `rotate(${fin ? 0 : (t * 240) % 360})`);
      A.heure.textContent = `0${h}:${min}`;
      A.sous.textContent = fin ? "ARRIVÉE 06:45" : "PAS UN SEUL TAXI";
      A.sous.style.color = fin ? VERT : "#D9473B";
    };
    const temps = { t: 0 };
    horloge(0);
    tl.fromTo(temps, { t: 0 }, { t: T.duree, duration: T.duree, ease: "none", onUpdate: () => horloge(temps.t), immediateRender: true }, 0);
    tl.fromTo("#carte", { rotation: -1.5 }, { keyframes: [{ rotation: 1.5, duration: 0.25 }, { rotation: -1.5, duration: 0.25 }], repeat: 11, immediateRender: true }, 0);
    tl.to("#carte", { x: -1000, opacity: 0, duration: 0.45, ease: "power2.in" }, T.porte - 0.2);
    // Retour de la carte : « ✓ À L'HEURE »
    tl.fromTo("#carte", { x: 1000, opacity: 0, rotation: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, T.alheure - 0.1);
    tl.to("#heure", { opacity: 0, y: 40, duration: 0.2 }, T.alheure - 0.1);
    tl.fromTo("#alheure", { opacity: 0, scale: 0.4, rotation: -8 }, { opacity: 1, scale: 1, rotation: -2, duration: 0.45, ease: "back.out(2.6)", immediateRender: false }, T.alheure + 0.35);
    tl.to("#carte", { y: -40, opacity: 0, duration: 0.35 }, T.outro);

    // ── 2. Porte d'école qui se ferme + cahiers qui tremblent ──
    const porte = decorPorte(document.getElementById("svg-porte"));
    tl.set(porte.g, { svgOrigin: "170 285", scaleX: 0.14 }, 0);
    tl.set(porte.d, { svgOrigin: "350 285", scaleX: 0.14 }, 0);
    tl.fromTo("#porte", { opacity: 0, x: 300, rotation: 4 }, { opacity: 1, x: 0, rotation: -2, duration: 0.5, ease: "back.out(1.6)", immediateRender: false }, T.porte);
    tl.to([porte.g, porte.d], { scaleX: 1, duration: 0.55, ease: "power3.in" }, T.clac - 0.55);
    tl.fromTo(porte.clac, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2, ease: "back.out(3)", immediateRender: false }, T.clac);
    tl.to(porte.clac, { opacity: 0, duration: 0.3 }, T.clac + 1.2);
    tl.to("#porte", { keyframes: [{ x: -10, duration: 0.05 }, { x: 10, duration: 0.05 }, { x: -6, duration: 0.05 }, { x: 0, duration: 0.05 }] }, T.clac);
    tl.fromTo("#cahiers", { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(2)", immediateRender: false }, T.cahiers - 0.2);
    tl.to("#pile", { keyframes: [{ rotation: -2.5, x: -4, duration: 0.07 }, { rotation: 2.5, x: 4, duration: 0.07 }], repeat: 13, transformOrigin: "50% 100%" }, T.cahiers + 0.2);
    tl.to("#pile", { rotation: 0, x: 0, duration: 0.1 }, T.cahiers + 2.2);
    tl.to("#porte", { x: -900, opacity: 0, duration: 0.4, ease: "power2.in" }, T.zoom - 0.1);
    tl.to("#cahiers", { x: 600, opacity: 0, duration: 0.4, ease: "power2.in" }, T.zoom - 0.1);

    // ── 4. Téléphone : la conversation d'hier soir ──
    tl.fromTo("#telephone", { opacity: 0, y: 500 }, { opacity: 1, y: 0, duration: 0.55, ease: "back.out(1.3)", immediateRender: false }, T.tel);
    tl.fromTo("#m1", { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, T.m1);
    montre("#m-points", T.m1 + 0.6, T.m2 - 0.1);
    tl.to("#m-points i", { keyframes: [{ y: -8, duration: 0.15 }, { y: 0, duration: 0.15 }], stagger: 0.1, repeat: 1 }, T.m1 + 0.7);
    tl.fromTo("#m2", { opacity: 0, y: 30, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(2.6)", immediateRender: false }, T.m2);
    tl.to("#telephone", { y: 600, opacity: 0, duration: 0.45, ease: "power2.in" }, T.tableau - 0.25);

    // ── 5. Tableau noir : « x + y » barré, remplacé par le trajet ──
    tl.fromTo("#tableau", { opacity: 0, scale: 0.85, rotation: -3 }, { opacity: 1, scale: 1, rotation: -1, duration: 0.5, ease: "back.out(1.8)", immediateRender: false }, T.tableau);
    tl.fromTo("#rature", { scaleX: 0, rotation: -4 }, { scaleX: 1, rotation: -4, duration: 0.3, ease: "power2.out", immediateRender: false }, T.rature);
    tl.to("#maths", { opacity: 0.35, y: -30, scale: 0.7, duration: 0.4, ease: "power2.inOut" }, T.trajet - 0.1);
    tl.fromTo("#trajet", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.4)", immediateRender: false }, T.trajet);
    tl.to("#tableau", { x: -1000, opacity: 0, duration: 0.4, ease: "power2.in" }, T.voiture - 0.2);

    // ── 6. Petit klaxon : la voiture devant la maison, phares allumés ──
    const voit = decorVoiture(document.getElementById("svg-voiture"));
    tl.fromTo("#voiture", { opacity: 0, x: 1000 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, T.voiture);
    tl.fromTo(voit.auto, { x: 260 }, { x: 0, duration: 0.8, ease: "power3.out", immediateRender: false }, T.voiture + 0.1);
    tl.fromTo(voit.faisceau, { opacity: 0.35 }, { opacity: 0.75, duration: 0.5, yoyo: true, repeat: 7, ease: "sine.inOut", immediateRender: false }, T.voiture + 0.3);
    T.bips.forEach((t, k) => {
      tl.fromTo(voit.bips[k], { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, svgOrigin: k ? "610 85" : "520 135", duration: 0.2, ease: "back.out(3)", immediateRender: false }, t);
      tl.to(voit.bips[k], { opacity: 0, duration: 0.3 }, t + 0.9);
      tl.to(voit.auto, { keyframes: [{ y: -4, duration: 0.06 }, { y: 0, duration: 0.08 }] }, t);
    });
    tl.to("#voiture", { x: -1000, opacity: 0, duration: 0.4, ease: "power2.in" }, T.alheure - 0.2);

    // ── Outro WhatsApp (le câlin reste en bas) ──
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
    tl.set("#camera", cad(1, 540, 1000), R0);
    tl.set("#heure", { opacity: 1, y: 0 }, R0);
    tl.set("#alheure", { opacity: 0 }, R0);
    tl.fromTo("#carte", { x: 0, y: 0, opacity: 0, rotation: -1.5 }, { opacity: 1, duration: 0.3, immediateRender: false }, R0);
    tl.set(P.N.calin, { opacity: 0 }, R0);
    ["R", "N"].forEach((q) => { tl.set(P[q].rieurs, { opacity: 0 }, R0); tl.set(P[q].yeux, { opacity: 1 }, R0); tl.set(P[q].sourire, { opacity: 0 }, R0); });
    tl.set([P.R.tete, P.N.tete], { rotation: 0 }, R0);
    tl.set(P.R.sourcils, { y: -16 }, R0);
    tl.to(P.R.gouttes, { opacity: 1, duration: 0.3 }, R0);
    tl.to(div.R, { x: 0, rotation: 0, filter: "blur(0px)", scale: 1.06, opacity: 1, duration: 0.3 }, R0);
    tl.to(div.N, { x: 0, rotation: 0, filter: "blur(5px)", scale: 0.95, opacity: 0.82, duration: 0.3 }, R0);
    tl.set(motsPremiere.map((s) => s.lastChild), { color: GRIS }, R0);
    tl.fromTo(bulles[0].b, { opacity: 0, scale: 0.9, y: 0 }, { opacity: 1, scale: 1, duration: 0.3, immediateRender: false }, R0);

    tl.to({}, { duration: T.duree }, 0);
  };
})();
