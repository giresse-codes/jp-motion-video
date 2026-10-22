// « Le débat » — JP STORIES (51 s, 9:16). Voir frame.md.
// Rodrigue (gauche) et Nadège (droite) débattent ; chaque réplique s'écrit mot par mot dans une bulle au-dessus de
// celui qui parle (net, légèrement zoomé ; l'autre est flou et réagit). Calculatrice vitrée au centre :
// 4 × 2 500 = 10 000 puis 5 × 2 000 = 10 000, « = » géant + confettis. Carte score « Arnaque ? » → « Bon plan ✓ ».
// Fin : Rodrigue tend son téléphone, outro WhatsApp, retour à l'image 1.
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const NUIT = "#0B1B4D", MOUTARDE = "#F5A524", VERT = "#22C55E", ENCRE = "#1A1A1A", GRIS = "#BDB8AE";
  const NOMS = { R: "RODRIGUE", N: "NADÈGE" };

  const el = (parent, tag, attrs = {}) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    parent.appendChild(e);
    return e;
  };
  // Espaces insécables : « 2 000 », « l'heure ? »
  const insecable = (s) => s.replace(/(\d) (\d{3})/g, "$1 $2").replace(/ ([?!:;…])/g, " $1");

  // ════ Personnages plats, en couches (aucun attribut transform sur les groupes animés) ════
  function personnage(svg, qui) {
    const R = qui === "R";
    const peau = R ? "#6B4129" : "#8A5434", ombre = R ? "#4E2E1C" : "#6A3E25";
    const defs = el(svg, "defs");
    // Motif du vêtement : pois (Rodrigue) ou wax stylisé (Nadège)
    const motif = el(defs, "pattern", { id: "motif-" + qui, width: R ? 40 : 56, height: R ? 40 : 56, patternUnits: "userSpaceOnUse" });
    if (R) {
      el(motif, "rect", { width: 40, height: 40, fill: "#1F3A8A" });
      el(motif, "circle", { cx: 10, cy: 10, r: 5, fill: "#fff", opacity: 0.85 });
      el(motif, "circle", { cx: 30, cy: 30, r: 5, fill: "#fff", opacity: 0.85 });
    } else {
      el(motif, "rect", { width: 56, height: 56, fill: "#15803D" });
      el(motif, "circle", { cx: 28, cy: 28, r: 14, fill: MOUTARDE });
      el(motif, "circle", { cx: 28, cy: 28, r: 6, fill: NUIT });
      el(motif, "path", { d: "M0 0 L10 0 L0 10Z M56 56 L46 56 L56 46Z M56 0 L56 10 L46 0Z M0 56 L0 46 L10 56Z", fill: "#E8E1D0" });
    }
    const wax = el(defs, "pattern", { id: "wax-" + qui, width: 48, height: 48, patternUnits: "userSpaceOnUse" });
    el(wax, "rect", { width: 48, height: 48, fill: MOUTARDE });
    el(wax, "path", { d: "M24 6 L42 24 L24 42 L6 24Z", fill: "#D9473B" });
    el(wax, "circle", { cx: 24, cy: 24, r: 7, fill: NUIT });

    const corps = el(svg, "g");
    // Bras le long du corps (manches)
    el(corps, "path", { d: "M-150 0 Q-215 120 -200 340 L-140 340 Q-150 170 -110 60Z", fill: `url(#motif-${qui})` });
    el(corps, "path", { d: "M150 0 Q215 120 200 340 L140 340 Q150 170 110 60Z", fill: `url(#motif-${qui})` });
    // Cou + buste
    el(corps, "rect", { x: -34, y: -90, width: 68, height: 80, rx: 20, fill: ombre });
    el(corps, "path", { d: "M-170 340 L-166 50 Q-158 -22 -82 -36 L82 -36 Q158 -22 166 50 L170 340Z", fill: `url(#motif-${qui})` });
    if (R) el(corps, "path", { d: "M-46 -36 L0 34 L46 -36 L24 -36 L0 6 L-24 -36Z", fill: "#fff" });
    else {
      el(corps, "path", { d: "M-60 -34 Q0 40 60 -34Z", fill: peau });
      el(corps, "path", { d: "M-150 220 L150 220 L152 250 L-152 250Z", fill: NUIT, opacity: 0.9 });
    }

    // Bras croisés (cachés au départ)
    const croises = el(corps, "g", { opacity: 0 });
    el(croises, "rect", { x: -175, y: 120, width: 330, height: 74, rx: 37, fill: `url(#motif-${qui})`, stroke: "rgba(0,0,0,.4)", "stroke-width": 7 });
    el(croises, "rect", { x: -150, y: 160, width: 330, height: 70, rx: 35, fill: `url(#motif-${qui})`, stroke: "rgba(0,0,0,.45)", "stroke-width": 7 });
    el(croises, "circle", { cx: 150, cy: 150, r: 30, fill: peau });
    el(croises, "circle", { cx: -150, cy: 200, r: 30, fill: peau });

    // Bras qui tend le téléphone (Rodrigue, vers le centre)
    let telephone = null;
    if (R) {
      telephone = el(svg, "g", { opacity: 0 });
      el(telephone, "path", { d: "M120 20 L250 -70", stroke: `url(#motif-R)`, "stroke-width": 64, "stroke-linecap": "round", fill: "none" });
      el(telephone, "rect", { x: 225, y: -250, width: 110, height: 200, rx: 18, fill: NUIT });
      el(telephone, "rect", { x: 235, y: -236, width: 90, height: 160, rx: 10, fill: "#fff" });
      el(telephone, "rect", { x: 245, y: -220, width: 62, height: 26, rx: 13, fill: VERT });
      el(telephone, "rect", { x: 255, y: -184, width: 60, height: 22, rx: 11, fill: "#E5E7EB" });
      el(telephone, "rect", { x: 245, y: -152, width: 70, height: 50, rx: 10, fill: "#F3F4F6" });
      el(telephone, "text", { x: 280, y: -120, "text-anchor": "middle", "font-family": "Inter", "font-weight": 700, "font-size": 20, fill: NUIT }).textContent = "+237";
      el(telephone, "circle", { cx: 262, cy: -72, r: 34, fill: peau });
    }

    // Tête
    const tete = el(svg, "g");
    if (!R) el(tete, "path", { d: "M-70 -220 Q-110 -150 -96 -40 L96 -40 Q110 -150 70 -220Z", fill: "#1A1A1A" });
    el(tete, "circle", { cx: -92, cy: -150, r: 19, fill: peau });
    el(tete, "circle", { cx: 92, cy: -150, r: 19, fill: peau });
    el(tete, "ellipse", { cx: 0, cy: -160, rx: 90, ry: 105, fill: peau });
    if (R) {
      el(tete, "path", { d: "M-92 -180 Q-96 -282 0 -280 Q96 -282 92 -180 Q84 -232 0 -230 Q-84 -232 -92 -180Z", fill: ENCRE });
      el(tete, "path", { d: "M-84 -140 Q-76 -52 0 -54 Q76 -52 84 -140 Q66 -84 0 -86 Q-66 -84 -84 -140Z", fill: ENCRE, opacity: 0.88 });
    } else {
      el(tete, "path", { d: "M-102 -176 Q-130 -318 0 -332 Q136 -318 104 -172 Q66 -230 0 -230 Q-66 -230 -102 -176Z", fill: `url(#wax-N)` });
      el(tete, "ellipse", { cx: 70, cy: -300, rx: 46, ry: 34, fill: `url(#wax-N)`, stroke: "rgba(0,0,0,.15)", "stroke-width": 3 });
      el(tete, "circle", { cx: -94, cy: -118, r: 15, fill: "none", stroke: "#E9B23A", "stroke-width": 6 });
      el(tete, "circle", { cx: 94, cy: -118, r: 15, fill: "none", stroke: "#E9B23A", "stroke-width": 6 });
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
    [-1, 1].forEach((s) => el(sourcils, "path", { d: `M${s * 56} -194 Q${s * 36} ${R ? -206 : -210} ${s * 14} -198`, stroke: ENCRE, "stroke-width": R ? 11 : 8, fill: "none", "stroke-linecap": "round" }));
    el(tete, "path", { d: "M-2 -152 Q-16 -122 -6 -118 Q2 -115 12 -120", stroke: ombre, "stroke-width": 6, fill: "none", "stroke-linecap": "round" });
    const bouche = el(tete, "g");
    el(bouche, "ellipse", { cx: 0, cy: -96, rx: 28, ry: 20, fill: R ? "#3B0F0F" : "#5E1420" });
    el(bouche, "ellipse", { cx: 0, cy: -84, rx: 14, ry: 7, fill: "#D9473B" });
    const sourire = el(tete, "path", { d: "M-32 -108 Q0 -82 32 -108", stroke: R ? "#3B0F0F" : "#7A1F2B", "stroke-width": 7, fill: "none", "stroke-linecap": "round", opacity: 0 });

    return { corps, croises, telephone, tete, yeux, rieurs, sourcils, bouche, sourire };
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
      // Clignements
      for (let t = q === "R" ? 2.2 : 3.4; t < T.duree - 1; t += 3.7) tl.to(p.yeux, { keyframes: [{ scaleY: 0.1, duration: 0.07 }, { scaleY: 1, duration: 0.09 }] }, t);
    });
    tl.fromTo("#camera", { scale: 1 }, { scale: 1.035, duration: T.outro, ease: "none", immediateRender: true }, 0);

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
          const sp = s.lastChild;
          tl.fromTo(sp, { color: GRIS }, { color: ENCRE, duration: 0.12, immediateRender: i === 0 }, t);
          if (cle) tl.fromTo(s.firstChild, { scale: 0, rotation: -6 }, { scale: 1, rotation: -2, duration: 0.3, ease: "back.out(2.5)", immediateRender: i === 0 }, t);
          if (i === 0) motsPremiere.push(s);
          // Bouche : s'ouvre et se ferme à chaque mot
          tl.to(P[q].bouche, { keyframes: [{ scaleY: 1, duration: Math.max(0.06, d * 0.45) }, { scaleY: 0.22, duration: Math.max(0.06, d * 0.45) }] }, t);
          t += d;
        });
      });
      bulles.push({ b, q, de: phrases[0][0] });
    });
    bulles.forEach(({ b, q, de }, i) => {
      const entree = i === 0 ? 0 : de - 0.3;
      if (i === 0) tl.set(b, { opacity: 1, scale: 1, y: 0 }, 0);
      else tl.fromTo(b, { opacity: 0, scale: 0.6, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(2)", immediateRender: false }, entree);
      const suite = bulles[i + 1] ? bulles[i + 1].de - 0.35 : T.outro;
      tl.to(b, { opacity: 0, scale: 0.85, y: -20, duration: 0.25, ease: "power2.in" }, suite);
      if (i > 0 && bulles[i - 1].q !== q) focus(q, de - 0.4);
    });

    // ── Réactions ──
    const sourcils = (q, t, d = 1, h = -14) => tl.to(P[q].sourcils, { keyframes: [{ y: h, duration: 0.18, ease: "back.out(3)" }, { y: h, duration: d }, { y: 0, duration: 0.25 }] }, t);
    const rire = (q, t, d = 0.8) => {
      const p = P[q];
      tl.set(p.rieurs, { opacity: 1 }, t); tl.set(p.yeux, { opacity: 0 }, t);
      tl.to(p.bouche, { keyframes: [{ scaleY: 1.1, duration: 0.1 }, { scaleY: 0.6, duration: 0.1 }, { scaleY: 1.1, duration: 0.1 }, { scaleY: 0.6, duration: 0.1 }, { scaleY: 1, duration: 0.1 }, { scaleY: 0.22, duration: 0.15 }] }, t);
      tl.to(p.tete, { keyframes: [{ rotation: -5, y: -6, duration: 0.14 }, { rotation: 4, duration: 0.14 }, { rotation: -4, duration: 0.14 }, { rotation: 3, duration: 0.14 }, { rotation: 0, y: 0, duration: 0.2 }] }, t);
      tl.set(p.rieurs, { opacity: 0 }, t + d); tl.set(p.yeux, { opacity: 1 }, t + d);
    };
    const croiser = (q, t, fin) => {
      tl.fromTo(P[q].croises, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)", immediateRender: false }, t);
      tl.to(P[q].croises, { opacity: 0, y: 40, duration: 0.25 }, fin);
    };
    const hoche = (q, t) => tl.to(P[q].tete, { keyframes: [{ y: 10, duration: 0.15 }, { y: 0, duration: 0.15 }, { y: 8, duration: 0.15 }, { y: 0, duration: 0.15 }] }, t);
    const penche = (q, t, r, d) => tl.to(P[q].tete, { keyframes: [{ rotation: r, duration: 0.3, ease: "power2.out" }, { rotation: r, duration: d }, { rotation: 0, duration: 0.3 }] }, t);

    T.rires.R.forEach((t) => rire("R", t, 0.5));
    T.rires.N.forEach((t) => rire("N", t, 0.7));
    sourcils("N", 2.75, 1.8);                 // « 2 000 francs ? » : Nadège hausse les sourcils
    croiser("R", 6.9, 24.5);                  // Rodrigue croise les bras jusqu'au calcul
    penche("R", 9.85, -7, 0.7);               // soupir
    sourcils("R", 15.71, 0.8, -12);           // « Ça fait combien ? »
    hoche("N", 18.45);                        // « Bien. »
    sourcils("R", 22.3, 1.4, -10);
    sourcils("R", 29.25, 2.3, -22);           // surprise
    tl.to(P.R.tete, { keyframes: [{ y: -14, rotation: -3, duration: 0.2 }, { y: -14, duration: 1.8 }, { y: 0, rotation: 0, duration: 0.3 }] }, 29.25);
    penche("N", 32.24, 6, 1.4);               // fière
    tl.to(P.N.sourire, { opacity: 1, duration: 0.2 }, 32.2);
    tl.to(P.N.sourire, { opacity: 0, duration: 0.2 }, 37.7);
    tl.to(div.R, { x: 40, rotation: 4, duration: 0.4, ease: "power2.out" }, 34.7); // il chuchote, se penche vers elle
    tl.to(div.R, { x: 0, rotation: 0, duration: 0.4 }, 37.4);
    sourcils("N", 35.2, 1.4, -12);
    sourcils("R", 39.1, 1.2, -16);
    tl.to(P.N.sourire, { opacity: 1, duration: 0.2 }, 41.4);
    sourcils("N", 41.5, 1.2, -12);
    // Rodrigue tend son téléphone
    tl.fromTo(P.R.telephone, { opacity: 0, rotation: 50 }, { opacity: 1, rotation: 0, svgOrigin: "120 20", duration: 0.45, ease: "back.out(1.8)", immediateRender: false }, T.tel);
    tl.to(P.R.telephone, { keyframes: [{ y: -8, duration: 0.4 }, { y: 0, duration: 0.4 }], repeat: 1 }, T.tel + 0.5);

    // ── Carte score (hook), puis verdict ──
    const points = document.querySelectorAll("#points i");
    tl.fromTo("#carte", { scale: 0.96 }, { scale: 1.02, duration: T.carte, ease: "sine.inOut", immediateRender: true }, 0);
    tl.fromTo("#mot-arnaque", { rotation: -2 }, { keyframes: [{ rotation: 2, duration: 0.5 }, { rotation: -2, duration: 0.5 }], repeat: 6, immediateRender: true }, 0);
    tl.to("#carte", { x: -1000, opacity: 0, duration: 0.5, ease: "power2.in" }, T.carte);
    tl.fromTo("#carte", { x: -1000, opacity: 0, scale: 1 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, T.verdict);
    tl.fromTo("#barre", { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power2.out", immediateRender: false }, T.verdict + 0.35);
    tl.to("#mot-arnaque", { y: 160, rotation: 16, opacity: 0, duration: 0.5, ease: "power2.in" }, T.verdict + 0.75);
    tl.fromTo("#mot-bonplan", { opacity: 0, scale: 0.4, rotation: -8 }, { opacity: 1, scale: 1, rotation: -2, duration: 0.45, ease: "back.out(2.6)", immediateRender: false }, T.verdict + 0.95);
    points.forEach((p, k) => {
      tl.to(p, { backgroundColor: VERT, borderColor: VERT, scale: 1.25, duration: 0.12 }, T.verdict + 1.1 + k * 0.12);
      tl.to(p, { scale: 1, duration: 0.2 }, T.verdict + 1.22 + k * 0.12);
    });
    tl.to("#carte", { y: -40, opacity: 0, duration: 0.35 }, T.outro);

    // ── Calculatrice ──
    const TOUCHES = ["7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "C", "0", "h", "="];
    const zoneT = document.getElementById("touches"), touche = {};
    TOUCHES.forEach((k) => { const d = document.createElement("div"); d.className = "touche" + ("×−+=".includes(k) ? " op" : ""); d.textContent = k; zoneT.appendChild(d); touche[k] = d; });
    const appuie = (k, t) => tl.to(touche[k], { keyframes: [{ scale: 0.86, backgroundColor: "#FFE3A8", duration: 0.07 }, { scale: 1, backgroundColor: "#FFFFFF", duration: 0.18 }] }, t);
    const tape = (texte, t0, d) => { const c = [...texte].filter((c) => touche[c]); c.forEach((c, i) => appuie(c, t0 + (d * i) / Math.max(1, c.length))); };

    tl.fromTo("#calc", { x: 900, opacity: 0, rotation: 6 }, { x: 0, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(1.4)", immediateRender: false }, T.carte + 0.1);
    tl.to("#calc", { keyframes: [{ y: -8, duration: 1.2, ease: "sine.inOut" }, { y: 0, duration: 1.2, ease: "sine.inOut" }], repeat: 12 }, T.carte + 0.8);
    tl.to("#calc", { x: 900, opacity: 0, rotation: 6, duration: 0.5, ease: "power2.in" }, T.verdict);

    // Écran : fonction pure du temps (sûre au seek)
    const E = { titre: document.getElementById("calc-titre"), hist: document.getElementById("calc-hist"), expr: document.getElementById("calc-expr"), res: document.getElementById("calc-res") };
    const frappe = (t, t0, d, s) => (t < t0 ? "" : s.slice(0, Math.ceil(Math.min(1, (t - t0) / d) * s.length)));
    const ecran = (t) => {
      let titre = "PACK ÉCO · 4 H", hist = "", expr = "", res = "", vert = false;
      if (t >= T.c4) expr = "4 h";
      if (t >= T.c2500) expr = "4" + frappe(t, T.c2500, 0.7, " × 2 500");
      if (t >= T.cq) res = "= ?";
      if (t >= T.c10a) res = "= 10 000";
      if (t >= T.c5) { titre = "PACK ÉCO · 5 H"; hist = "4 × 2 500 = 10 000"; expr = "5 h"; res = ""; }
      if (t >= T.c2000) hist += "\ndès 5 h : 2 000 /h";
      if (t >= T.cmul) expr = frappe(t, T.cmul, 1.6, "5 × 2 000");
      if (t >= T.cmul + 1.8) res = "= ?";
      if (t >= T.c10b) res = "= 10 000";
      if (t >= T.egal) { hist = "4 h → 10 000\n5 h → 10 000"; vert = true; }
      if (t >= T.confort) { titre = "CONFORT · CLIM + WI-FI"; hist = ""; expr = ""; res = ""; vert = false; }
      if (t >= T.c3500) { hist = "1 à 4 h"; res = "3 500 /h"; }
      if (t >= T.c3000) { hist = "1 à 4 h : 3 500 /h"; expr = "dès 5 h"; res = "3 000 /h"; vert = true; }
      E.titre.textContent = titre; E.hist.textContent = hist; E.expr.textContent = expr; E.res.textContent = res;
      E.res.style.color = vert ? VERT : "#fff";
    };
    const horloge = { t: 0 };
    ecran(0);
    tl.fromTo(horloge, { t: 0 }, { t: T.duree, duration: T.duree, ease: "none", onUpdate: () => ecran(horloge.t), immediateRender: true }, 0);
    appuie("4", T.c4); appuie("h", T.c4 + 0.2);
    tape("×2500", T.c2500, 0.7); appuie("=", T.cq);
    appuie("C", T.c5 - 0.1); appuie("5", T.c5 + 0.3); appuie("h", T.c5 + 0.5);
    tape("5×2000", T.cmul, 1.6); appuie("=", T.cmul + 1.8);
    appuie("C", T.confort); appuie("=", T.c3500); appuie("=", T.c3000);
    [T.c10a, T.c10b, T.c3000].forEach((t) => tl.fromTo("#calc-res", { scale: 1.35 }, { scale: 1, duration: 0.4, ease: "back.out(3)", transformOrigin: "100% 60%", immediateRender: false }, t));

    // « = » géant qui clignote + confettis
    tl.fromTo("#egal", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.4)", immediateRender: false }, T.egal);
    tl.to("#egal", { keyframes: [{ opacity: 0.25, scale: 0.9, duration: 0.15 }, { opacity: 1, scale: 1.08, duration: 0.15 }], repeat: 4 }, T.egal + 0.35);
    tl.to("#egal", { opacity: 0, scale: 1.3, duration: 0.3 }, T.cadeau - 0.2);
    const conf = document.getElementById("confettis"), COUL = [MOUTARDE, VERT, NUIT, "#D9473B", "#60A5FA"];
    for (let k = 0; k < 70; k++) {
      const c = document.createElement("div"); c.className = "confetti"; c.style.background = COUL[k % 5]; conf.appendChild(c);
      const ang = (k * 137.5 * Math.PI) / 180, v = 260 + ((k * 53) % 320);
      const x = Math.cos(ang) * v, y = Math.sin(ang) * v * 0.8 - 220;
      tl.fromTo(c, { x: 0, y: 0, rotation: 0, opacity: 1, scale: 0.6 + (k % 3) * 0.3 },
        { keyframes: [{ x: x, y: y, rotation: (k % 2 ? 1 : -1) * 240, duration: 0.55, ease: "power2.out" }, { y: y + 700, x: x * 1.15, rotation: (k % 2 ? 1 : -1) * 620, opacity: 0, duration: 1.3, ease: "power1.in" }], immediateRender: false }, T.meme + (k % 7) * 0.02);
    }
    // Sticker « 5e heure offerte »
    tl.fromTo("#sticker", { opacity: 0, scale: 2, rotation: 14 }, { opacity: 1, scale: 1, rotation: -6, duration: 0.35, ease: "back.out(2)", immediateRender: false }, T.cadeau + 0.9);
    tl.to("#sticker", { opacity: 0, y: 30, duration: 0.3 }, T.confort - 0.2);

    // ── Outro WhatsApp ──
    // Les deux restent visibles et nets ; Nadège dicte le numéro
    tl.to([div.R, div.N], { filter: "blur(0px)", scale: 1, opacity: 1, x: 0, duration: 0.4 }, T.outro);
    [[43.56, 44.12], [44.46, 46.08], [46.35, 47.66], [47.87, 48.76]].forEach(([a, z]) => {
      const n = Math.max(1, Math.round((z - a) / 0.2));
      tl.to(P.N.bouche, { keyframes: Array.from({ length: n }, () => [{ scaleY: 0.9, duration: (z - a) / n / 2 }, { scaleY: 0.22, duration: (z - a) / n / 2 }]).flat() }, a);
    });
    tl.to(".logo", { opacity: 0, duration: 0.3 }, T.outro);
    tl.fromTo("#outro", { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, T.outro + 0.2);
    tl.fromTo(".outro-logo", { scale: 0.4, rotation: -10 }, { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)", immediateRender: false }, T.outro + 0.2);
    tl.fromTo(".outro-slogan", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", immediateRender: false }, T.outro + 0.5);
    tl.fromTo(".bouton-wa", { y: 60, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)", immediateRender: false }, T.outro + 0.7);
    ["#n1", "#n2", "#n3"].forEach((n, k) => tl.fromTo(n, { opacity: 0.25, y: 10 }, { opacity: 1, y: 0, duration: 0.25, ease: "back.out(3)", immediateRender: false }, T.num[k]));
    tl.to(".bouton-wa", { keyframes: [{ scale: 1.05, duration: 0.4, ease: "sine.inOut" }, { scale: 1, duration: 0.4, ease: "sine.inOut" }], repeat: 2 }, 48.9);
    tl.to(".outro-logo", { keyframes: [{ y: -10, duration: 1.2, ease: "sine.inOut" }, { y: 0, duration: 1.2, ease: "sine.inOut" }], repeat: 2 }, T.outro + 0.8);

    // ── Retour à l'image 1 (boucle) ──
    const R0 = T.retour;
    tl.to("#outro", { opacity: 0, duration: 0.3 }, R0);
    tl.to(".logo", { opacity: 1, duration: 0.3 }, R0);
    tl.set("#camera", { scale: 1 }, R0);
    tl.set(P.R.telephone, { opacity: 0 }, R0);
    tl.set(P.N.sourire, { opacity: 0 }, R0);
    tl.set("#barre", { scaleX: 0 }, R0);
    tl.set("#mot-arnaque", { y: 0, rotation: -2, opacity: 1 }, R0);
    tl.set("#mot-bonplan", { opacity: 0 }, R0);
    tl.set(points, { backgroundColor: "rgba(0,0,0,0)", borderColor: "#D9D4CA" }, R0);
    tl.set(points[0], { backgroundColor: "#F08A80", borderColor: "#F08A80" }, R0);
    tl.fromTo("#carte", { x: 0, y: 0, opacity: 0, scale: 0.96 }, { opacity: 1, duration: 0.3, immediateRender: false }, R0);
    tl.to(div.R, { filter: "blur(0px)", scale: 1.06, opacity: 1, y: 0, duration: 0.3 }, R0);
    tl.to(div.N, { filter: "blur(5px)", scale: 0.95, opacity: 0.82, y: 0, duration: 0.3 }, R0);
    tl.set(motsPremiere.map((s) => s.lastChild), { color: GRIS }, R0);
    motsPremiere.forEach((s) => { if (s.firstChild.className === "fond") tl.set(s.firstChild, { scale: 0 }, R0); });
    tl.fromTo(bulles[0].b, { opacity: 0, scale: 0.9, y: 0 }, { opacity: 1, scale: 1, duration: 0.3, immediateRender: false }, R0);

    tl.to({}, { duration: T.duree }, 0);
  };
})();
