// « Soir de match » — JP STORIES, format DÉBAT (36,2 s, 9:16). Voir frame.md. Mise en page et composants de pub-debat.
// 100 % dialogue, sans narrateur : Hervé (gauche, maillot et écharpe vert-rouge-jaune) veut aller au stade,
// Patrick (droite, polo noir) a la solution. Aucun logo d'équipe, de fédération ni de stade : couleurs seulement.
// Zone centrale : carte « STADE ? » + ballon → trajet bouché « +2 h » → télé et nuage de pluie → schéma 3 étapes
// → stade de nuit (photo floutée) et voiture JP au point de rendez-vous → « STADE ✓ ». Cadrages : large, gros plan Patrick,
// plan serré sur le schéma, plan à deux final. Fin : outro, retour à l'image 1.
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const NUIT = "#0B1B4D", MOUTARDE = "#F5A524", VERT = "#22C55E", ENCRE = "#1A1A1A", GRIS = "#BDB8AE";
  const V = "#15803D", R = "#D9473B", J = "#F5C518"; // vert-rouge-jaune
  const NBSP = String.fromCharCode(160);
  const NOMS = { H: "HERVÉ", P: "PATRICK" };
  const COTE = { H: "gauche", P: "droite" };

  const el = (parent, tag, attrs = {}) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    parent.appendChild(e);
    return e;
  };
  // Espaces insécables : « 2 h », « ça ? » ; « _ » dans temps.js = espace insécable voulu (mot clé en deux mots)
  const insecable = (s) => s.replace(/_/g, NBSP).replace(/(\d) h\b/g, "$1" + NBSP + "h").replace(/ ([?!:;…])/g, NBSP + "$1");

  // ════ Personnages plats, en couches (aucun attribut transform sur les groupes animés) ════
  function personnage(svg, qui) {
    const H = qui === "H";
    const peau = H ? "#D9A27C" : "#E0B08C", ombre = H ? "#B5805A" : "#BC8A66", CHEV = H ? "#3A2618" : "#2A1D15";
    const tissu = H ? V : "#16181D";
    const defs = el(svg, "defs");
    const ech = el(defs, "pattern", { id: "echarpe-" + qui, width: 60, height: 60, patternUnits: "userSpaceOnUse" });
    [[0, V], [20, R], [40, J]].forEach(([y, c]) => el(ech, "rect", { y, width: 60, height: 20, fill: c }));

    const corps = el(svg, "g");
    const bras = el(corps, "g");
    [-1, 1].forEach((s) => {
      el(bras, "path", { d: `M${s * 150} 0 Q${s * 200} 60 ${s * 196} 130 L${s * 136} 130 Q${s * 140} 80 ${s * 110} 60Z`, fill: tissu });
      if (H) el(bras, "path", { d: `M${s * 196} 124 L${s * 136} 124 L${s * 136} 134 L${s * 196} 134Z`, fill: J });
      el(bras, "path", { d: `M${s * 194} 130 Q${s * 205} 240 ${s * 190} 340 L${s * 140} 340 Q${s * 140} 230 ${s * 138} 130Z`, fill: peau });
    });
    el(corps, "rect", { x: -34, y: -90, width: 68, height: 80, rx: 20, fill: ombre });
    el(corps, "path", { d: "M-170 340 L-166 50 Q-158 -22 -82 -36 L82 -36 Q158 -22 166 50 L170 340Z", fill: tissu });
    if (H) {
      // Maillot : panneau rouge, bande jaune, col en V ; écharpe rayée autour du cou
      el(corps, "path", { d: "M-80 100 L80 100 L90 340 L-90 340Z", fill: R });
      el(corps, "path", { d: "M-166 60 L166 60 L168 104 L-168 104Z", fill: J });
      el(corps, "path", { d: "M-40 -36 L0 20 L40 -36Z", fill: J });
      el(corps, "path", { d: "M-74 -40 Q0 10 74 -40 L80 -12 Q0 40 -80 -12Z", fill: `url(#echarpe-${qui})` });
      el(corps, "path", { d: "M-80 -20 L-118 330 L-68 334 L-44 0Z M80 -20 L118 330 L68 334 L44 0Z", fill: `url(#echarpe-${qui})` });
    } else {
      // Polo noir : col, patte de boutonnage
      el(corps, "path", { d: "M-60 -38 L-6 18 L-24 -38Z M60 -38 L6 18 L24 -38Z", fill: "#2B2E36", stroke: "#0A0B0E", "stroke-width": 3 });
      el(corps, "rect", { x: -12, y: -10, width: 24, height: 110, rx: 6, fill: "#22252C" });
      [20, 60].forEach((y) => el(corps, "circle", { cx: 0, cy: y, r: 5, fill: "#5A5F6B" }));
    }

    // Bras levés poings serrés (Hervé), mains sur les oreilles (Patrick) : cachés au départ
    let leves = null, oreilles = null;
    if (H) {
      leves = el(svg, "g", { opacity: 0 });
      [-1, 1].forEach((s) => {
        el(leves, "path", { d: `M${s * 140} 10 L${s * 205} -130 L${s * 222} -220`, stroke: peau, "stroke-width": 50, "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none" });
        el(leves, "path", { d: `M${s * 140} 10 L${s * 184} -90`, stroke: tissu, "stroke-width": 70, "stroke-linecap": "round", fill: "none" });
        el(leves, "rect", { x: s * 224 - 30, y: -272, width: 60, height: 62, rx: 22, fill: peau, stroke: ombre, "stroke-width": 4 });
      });
    } else {
      oreilles = el(svg, "g", { opacity: 0 });
      [-1, 1].forEach((s) => {
        el(oreilles, "path", { d: `M${s * 150} 20 L${s * 200} -60 L${s * 118} -150`, stroke: peau, "stroke-width": 46, "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none" });
        el(oreilles, "path", { d: `M${s * 150} 20 L${s * 190} -40`, stroke: tissu, "stroke-width": 66, "stroke-linecap": "round", fill: "none" });
        el(oreilles, "ellipse", { cx: s * 106, cy: -152, rx: 30, ry: 38, fill: peau, stroke: ombre, "stroke-width": 4 });
      });
    }

    // Tête
    const tete = el(svg, "g");
    el(tete, "circle", { cx: -92, cy: -150, r: 19, fill: peau });
    el(tete, "circle", { cx: 92, cy: -150, r: 19, fill: peau });
    el(tete, "ellipse", { cx: 0, cy: -160, rx: 90, ry: 105, fill: peau });
    if (H) {
      el(tete, "path", { d: "M-84 -150 Q-78 -62 0 -60 Q78 -62 84 -150 Q70 -92 0 -94 Q-70 -92 -84 -150Z", fill: CHEV, opacity: 0.35 }); // barbe de trois jours
      el(tete, "path", { d: "M-90 -184 Q-96 -276 0 -274 Q96 -276 90 -184 Q80 -236 0 -238 Q-80 -236 -90 -184Z", fill: CHEV });
    } else el(tete, "path", { d: "M-90 -180 Q-100 -270 -10 -284 Q70 -290 96 -230 Q92 -200 90 -180 Q78 -240 10 -238 Q-70 -238 -90 -180Z", fill: CHEV });
    const dx = H ? 4 : -4;
    const yeux = el(tete, "g");
    [-34, 34].forEach((x) => {
      el(yeux, "ellipse", { cx: x, cy: -166, rx: 16, ry: 14, fill: "#fff" });
      el(yeux, "circle", { cx: x + dx, cy: -165, r: 8, fill: ENCRE });
    });
    const rieurs = el(tete, "g", { opacity: 0 });
    [-34, 34].forEach((x) => el(rieurs, "path", { d: `M${x - 18} -160 Q${x} -184 ${x + 18} -160`, stroke: ENCRE, "stroke-width": 8, fill: "none", "stroke-linecap": "round" }));
    const sourcils = el(tete, "g");
    [-1, 1].forEach((s) => el(sourcils, "path", { d: `M${s * 56} -194 Q${s * 36} -208 ${s * 14} -198`, stroke: CHEV, "stroke-width": 10, fill: "none", "stroke-linecap": "round" }));
    el(tete, "path", { d: "M-2 -152 Q-16 -122 -6 -118 Q2 -115 12 -120", stroke: ombre, "stroke-width": 6, fill: "none", "stroke-linecap": "round" });
    const bouche = el(tete, "g");
    el(bouche, "ellipse", { cx: 0, cy: -96, rx: 28, ry: 20, fill: "#4A1414" });
    el(bouche, "ellipse", { cx: 0, cy: -84, rx: 14, ry: 7, fill: "#D9473B" });
    const sourire = el(tete, "path", { d: "M-32 -108 Q0 -82 32 -108", stroke: "#6B1F1F", "stroke-width": 7, fill: "none", "stroke-linecap": "round", opacity: 0 });
    // Lunettes de soleil (Patrick), cachées au départ
    let lunettes = null;
    if (!H) {
      lunettes = el(tete, "g", { opacity: 0 });
      [-36, 36].forEach((x) => el(lunettes, "rect", { x: x - 32, y: -186, width: 64, height: 42, rx: 14, fill: "#0A0B0E" }));
      el(lunettes, "path", { d: "M-6 -172 Q0 -178 6 -172 M-68 -176 L-92 -170 M68 -176 L92 -170", stroke: "#0A0B0E", "stroke-width": 6, fill: "none" });
      [-36, 36].forEach((x) => el(lunettes, "path", { d: `M${x - 20} -176 L${x - 4} -176`, stroke: "#fff", "stroke-width": 5, "stroke-linecap": "round", opacity: 0.6 }));
    }

    return { corps, bras, leves, oreilles, tete, yeux, rieurs, sourcils, bouche, sourire, lunettes };
  }

  // ════ Décors ════
  const etoile = (parent, coul) => { const s = el(parent, "svg", { viewBox: "-22 -22 44 44", class: "etoile" }); el(s, "path", { d: "M0 -20 Q3 -3 20 0 Q3 3 0 20 Q-3 3 -20 0 Q-3 -3 0 -20Z", fill: coul }); return s; };

  function decorBallon(svg) {
    el(svg, "circle", { r: 50, fill: "#fff", stroke: ENCRE, "stroke-width": 5 });
    el(svg, "path", { d: "M0 -16 L15 -5 L9 13 L-9 13 L-15 -5Z", fill: ENCRE });
    [[0, -46], [44, -14], [27, 38], [-27, 38], [-44, -14]].forEach(([x, y]) => el(svg, "circle", { cx: x, cy: y, r: 11, fill: ENCRE }));
    el(svg, "path", { d: "M0 -16 L0 -36 M15 -5 L34 -11 M9 13 L21 30 M-9 13 L-21 30 M-15 -5 L-34 -11", stroke: ENCRE, "stroke-width": 4 });
  }

  function decorTrajet(svg) {
    el(svg, "rect", { width: 700, height: 440, fill: "#EEF2E6" });
    [[30, 30, 260, 150], [420, 170, 250, 120], [120, 280, 200, 140], [430, 320, 240, 100]].forEach(([x, y, w, h]) => el(svg, "rect", { x, y, width: w, height: h, rx: 16, fill: "#E2E6DA" }));
    const d = "M80 380 L80 250 Q80 220 110 220 L330 220 Q360 220 360 190 L360 120 Q360 90 390 90 L560 90";
    el(svg, "path", { d, stroke: "#fff", "stroke-width": 34, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" });
    const rouge = el(svg, "path", { d, stroke: "#E10600", "stroke-width": 16, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": 900, "stroke-dashoffset": 900 });
    // Bouchon : petites voitures arrêtées
    [[150, 220], [200, 220], [250, 220], [360, 170], [360, 130]].forEach(([x, y]) => el(svg, "rect", { x: x - 16, y: y - 11, width: 32, height: 22, rx: 6, fill: "#9CA3AF", stroke: "#fff", "stroke-width": 3 }));
    el(svg, "rect", { x: 284, y: 207, width: 40, height: 26, rx: 7, fill: R, stroke: "#fff", "stroke-width": 3 }); // la voiture de Patrick
    // Maison au départ, stade à l'arrivée (générique, sans logo)
    el(svg, "polygon", { points: "50,350 80,322 110,350", fill: "#9A3B26" });
    el(svg, "rect", { x: 56, y: 350, width: 48, height: 40, fill: "#F3E6CF" });
    el(svg, "ellipse", { cx: 612, cy: 92, rx: 62, ry: 38, fill: V });
    el(svg, "ellipse", { cx: 612, cy: 90, rx: 40, ry: 20, fill: "#5BE38C" });
    el(svg, "path", { d: "M554 98 V70 Q612 40 670 70 V98", stroke: NUIT, "stroke-width": 7, fill: "none" });
    return rouge;
  }

  function decorPanneau(svg) {
    el(svg, "rect", { x: 150, y: 200, width: 20, height: 100, fill: "#6B7280" });
    el(svg, "rect", { x: 20, y: 0, width: 280, height: 210, rx: 26, fill: "#2563EB", stroke: "#fff", "stroke-width": 8 });
    el(svg, "text", { x: 160, y: 118, "text-anchor": "middle", "font-family": "Archivo Black", "font-size": 120, fill: "#fff" }).textContent = "P";
    el(svg, "rect", { x: 34, y: 136, width: 252, height: 58, rx: 12, fill: "#E10600" });
    el(svg, "text", { x: 160, y: 176, "text-anchor": "middle", "font-family": "Archivo Black", "font-size": 30, fill: "#fff" }).textContent = "COMPLET";
  }

  function decorTele(svg) {
    el(svg, "rect", { width: 700, height: 440, fill: "#F1E4CF" });
    el(svg, "rect", { y: 340, width: 700, height: 100, fill: "#D8C3A0" });
    el(svg, "rect", { x: 200, y: 250, width: 300, height: 70, rx: 10, fill: "#8B5A2B" });
    el(svg, "rect", { x: 170, y: 60, width: 360, height: 210, rx: 18, fill: "#111" });
    el(svg, "rect", { x: 186, y: 76, width: 328, height: 178, rx: 8, fill: V });
    el(svg, "path", { d: "M350 76 V254 M186 165 H514", stroke: "#fff", "stroke-width": 4, opacity: 0.7 });
    el(svg, "circle", { cx: 350, cy: 165, r: 26, stroke: "#fff", "stroke-width": 4, fill: "none", opacity: 0.7 });
    [[260, 130, R], [300, 200, R], [420, 150, J], [460, 210, J]].forEach(([x, y, c]) => el(svg, "circle", { cx: x, cy: y, r: 7, fill: c }));
    // Canapé vu de dos, mini-Hervé avachi
    el(svg, "rect", { x: 150, y: 330, width: 400, height: 110, rx: 30, fill: "#7C4A2D" });
    const mini = el(svg, "g");
    el(mini, "path", { d: "M300 440 Q300 380 350 376 Q400 380 400 440Z", fill: V });
    el(mini, "path", { d: "M318 386 L310 440 L326 440 L334 384Z M382 386 L390 440 L374 440 L366 384Z", fill: `url(#echarpe-H)` });
    el(mini, "ellipse", { cx: 352, cy: 350, rx: 34, ry: 38, fill: "#D9A27C" });
    el(mini, "path", { d: "M318 344 Q318 308 352 308 Q386 308 386 344 Q372 326 352 326 Q332 326 318 344Z", fill: "#3A2618" });
    // Nuage de pluie au-dessus de lui
    const nuage = el(svg, "g");
    [[320, 270, 34], [356, 256, 42], [394, 272, 32]].forEach(([cx, cy, r]) => el(nuage, "circle", { cx, cy, r, fill: "#8C97A8" }));
    el(nuage, "rect", { x: 292, y: 268, width: 130, height: 36, rx: 18, fill: "#8C97A8" });
    const gouttes = el(svg, "g");
    [[310, 0], [340, 0.3], [370, 0.15], [400, 0.45], [325, 0.6], [385, 0.75]].forEach(([x]) => el(gouttes, "path", { d: `M${x} 312 L${x - 4} 326`, stroke: "#60A5FA", "stroke-width": 5, "stroke-linecap": "round" }));
    return { nuage, gouttes, mini };
  }

  function decorStade(svg) {
    const lum = el(svg, "g");
    el(lum, "polygon", { points: "90,0 0,0 0,90 260,440 420,440", fill: "#fff", opacity: 0.12 });
    el(lum, "polygon", { points: "610,0 700,0 700,90 440,440 280,440", fill: "#fff", opacity: 0.12 });
    el(svg, "rect", { y: 370, width: 700, height: 70, fill: "rgba(10,14,24,.75)" });
    // Point de rendez-vous fixé
    const rdv = el(svg, "g", { opacity: 0 });
    el(rdv, "path", { d: "M540 300 Q512 262 512 240 Q512 212 540 212 Q568 212 568 240 Q568 262 540 300Z", fill: MOUTARDE, stroke: "#fff", "stroke-width": 5 });
    el(rdv, "circle", { cx: 540, cy: 240, r: 10, fill: NUIT });
    el(rdv, "rect", { x: 450, y: 150, width: 180, height: 46, rx: 23, fill: NUIT });
    el(rdv, "text", { x: 540, y: 181, "text-anchor": "middle", "font-family": "JetBrains Mono", "font-weight": 700, "font-size": 22, fill: "#fff" }).textContent = "POINT RDV";
    // Voiture JP
    const auto = el(svg, "g");
    el(auto, "polygon", { points: "448,330 560,300 560,370", fill: "#FFF1B8", opacity: 0.45 });
    el(auto, "path", { d: "M250 370 L252 336 Q255 322 274 320 L310 314 L340 286 Q348 280 360 280 L420 280 Q432 280 440 290 L458 314 Q472 318 474 332 L476 370Z", fill: NUIT, stroke: "#fff", "stroke-width": 3 });
    el(auto, "path", { d: "M350 292 L378 292 L378 314 L326 314Z M388 292 L420 292 Q426 292 432 300 L442 314 L388 314Z", fill: "#9CC3E6" });
    el(auto, "text", { x: 382, y: 352, "text-anchor": "middle", "font-family": "Archivo Black", "font-size": 24, fill: MOUTARDE }).textContent = "JP";
    el(auto, "circle", { cx: 466, cy: 340, r: 8, fill: "#FFF1B8" });
    [300, 430].forEach((cx) => el(auto, "circle", { cx, cy: 372, r: 22, fill: "#111", stroke: "#555", "stroke-width": 6 }));
    return { lum, rdv, auto };
  }

  window.CONSTRUIRE = function (tl) {
    const T = window.T;
    const P = { H: personnage(document.getElementById("svg-H"), "H"), P: personnage(document.getElementById("svg-P"), "P") };
    const div = { H: document.getElementById("perso-H"), P: document.getElementById("perso-P") };

    // ── États de départ (image 1) ──
    ["H", "P"].forEach((q) => {
      const p = P[q];
      tl.set(p.bouche, { scaleY: 0.22, svgOrigin: "0 -106" }, 0);
      tl.set(p.tete, { svgOrigin: "0 -40", rotation: 0, y: 0 }, 0);
      tl.set(p.yeux, { svgOrigin: "0 -166", scaleY: 1 }, 0);
      tl.fromTo(p.corps, { scaleY: 1 }, { scaleY: 1.012, svgOrigin: "0 340", duration: 1.6, repeat: Math.floor(T.duree / 1.6) - 1, yoyo: true, ease: "sine.inOut", immediateRender: true }, q === "H" ? 0 : 0.5);
      for (let t = q === "H" ? 2.4 : 3.4; t < T.duree - 1; t += 3.7) tl.to(p.yeux, { keyframes: [{ scaleY: 0.1, duration: 0.07 }, { scaleY: 1, duration: 0.09 }] }, t);
    });

    // ── Cadrages : point (px, py) fixe, échelle s (origine 0 0) ──
    const cad = (s, px = 540, py = 900) => ({ scale: s, x: px * (1 - s), y: py * (1 - s) });
    const cam = (t, s, px, py, d = 0.45, ease = "power3.inOut") => tl.to("#camera", { ...cad(s, px, py), duration: d, ease }, t);
    tl.fromTo("#camera", cad(1, 540, 1000), { ...cad(1.04, 540, 1000), duration: 2.9, ease: "none", immediateRender: true }, 0);
    cam(2.95, 1, 540, 1000, 0.35);
    cam(T.zoom, 1.3, 760, 1150, 0.5, "power3.out");          // gros plan sur Patrick
    cam(12.6, 1, 760, 1150, 0.35);
    cam(T.etapes, 1.08, 540, 262, 0.5);                      // plan serré sur le schéma
    cam(T.stade - 0.1, 1, 540, 262, 0.4);
    cam(T.chant - 0.2, 1.06, 540, 1250, 0.6);                // plan à deux pour la chute
    cam(T.outro, 1, 540, 1250, 0.4);

    // ── Focus : celui qui parle est net et zoomé, l'autre flou ──
    const NET = { filter: "blur(0px)", scale: 1.06, opacity: 1 }, FLOU = { filter: "blur(5px)", scale: 0.95, opacity: 0.82 };
    const focus = (q, t, d = 0.35) => { tl.to(div[q], { ...NET, duration: d, ease: "power2.out" }, t); tl.to(div[q === "H" ? "P" : "H"], { ...FLOU, duration: d, ease: "power2.out" }, t); };
    tl.set(div.H, NET, 0); tl.set(div.P, FLOU, 0);

    // ── Bulles mot par mot ──
    const zone = document.getElementById("bulles");
    const bulles = [], motsPremiere = [];
    T.repliques.forEach(([q, phrases], i) => {
      const b = document.createElement("div");
      b.className = "bulle " + COTE[q];
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
          // Hook : l'étiquette « ce soir » est déjà posée sur l'image 1
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

    // Hook : Hervé bras levés, poings serrés, il sautille
    tl.set(P.H.leves, { opacity: 1 }, 0); tl.set(P.H.bras, { opacity: 0 }, 0); tl.set(P.H.sourire, { opacity: 1 }, 0);
    tl.fromTo(P.H.leves, { y: 0 }, { y: -18, duration: 0.325, yoyo: true, repeat: 7, ease: "sine.inOut", immediateRender: true }, 0);
    tl.fromTo(div.H, { y: 0 }, { y: -14, duration: 0.325, yoyo: true, repeat: 7, ease: "sine.inOut", immediateRender: true }, 0);
    tl.to(P.H.leves, { opacity: 0, duration: 0.2 }, 2.85); tl.to(P.H.bras, { opacity: 1, duration: 0.2 }, 2.85); tl.to(P.H.sourire, { opacity: 0, duration: 0.2 }, 2.85);
    sourcils("P", 1.2, 1.4, -14);              // « avec ta voiture ? »
    sourcils("H", 4.6, 2.4, -10);
    // « comme des vieux » : Hervé s'avachit
    tl.to(div.H, { y: 26, duration: 0.4, ease: "power2.out" }, 8.4); tl.to(div.H, { y: 0, duration: 0.35 }, 10.3);
    penche("H", 8.4, -10, 1.4);
    tl.to(P.H.sourcils, { rotation: 8, svgOrigin: "0 -200", duration: 0.2 }, 8.4); tl.to(P.H.sourcils, { rotation: 0, duration: 0.2 }, 10.2);
    // « comme des patrons » : Patrick remet ses lunettes de soleil
    tl.fromTo(P.P.lunettes, { opacity: 0, y: -110 }, { opacity: 1, y: 0, duration: 0.45, ease: "back.out(2.2)", immediateRender: false }, T.lunettes);
    tl.to(P.P.sourire, { opacity: 1, duration: 0.2 }, T.lunettes + 0.3); tl.to(P.P.sourire, { opacity: 0, duration: 0.2 }, 13.6);
    penche("P", T.lunettes + 0.3, -5, 1.4);
    sourcils("H", 11.3, 1.6, -16);
    sourcils("H", 14.9, 2.4, -12); hoche("H", 17.2);
    penche("P", 18.3, 6, 1.1);
    sourcils("H", 21.0, 1.8, -12); hoche("H", 23.3);

    // ── Étoiles et ballon (hook) ──
    const ze = document.getElementById("etoiles");
    [[110, 330, J], [960, 360, R], [150, 680, V], [920, 670, J], [70, 520, R], [1000, 520, V]].forEach(([x, y, c], k) => {
      const s = etoile(ze, c);
      tl.set(s, { x, y }, 0);
      tl.fromTo(s, { opacity: 0, scale: 0.3, rotation: 0 }, { opacity: 1, scale: 1.1, rotation: 45, duration: 0.35, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: true }, k * 0.15);
      tl.to(s, { opacity: 0, duration: 0.2 }, 2.9);
    });
    decorBallon(document.getElementById("ballon"));
    tl.set("#ballon", { opacity: 1 }, 0);
    [0.3, 0.95, 1.6, 2.25].forEach((t, k) => {
      tl.fromTo("#ballon", { y: 0, scaleY: 1, rotation: k * 90 }, { keyframes: [{ y: -130, scaleY: 1, duration: 0.3, ease: "power2.out" }, { y: 0, duration: 0.3, ease: "power2.in" }, { scaleY: 0.82, duration: 0.03 }, { scaleY: 1, duration: 0.02 }], rotation: k * 90 + 90, transformOrigin: "50% 100%", immediateRender: k === 0 }, t - 0.65 < 0 ? 0 : t - 0.65);
    });
    tl.to("#ballon", { x: 400, y: -200, rotation: 540, opacity: 0, duration: 0.45, ease: "power2.in" }, 2.9);

    // ── Carte d'état ──
    tl.fromTo("#carte", { rotation: -1.5 }, { keyframes: [{ rotation: 1.5, duration: 0.3 }, { rotation: -1.5, duration: 0.3 }], repeat: 3, immediateRender: true }, 0);
    tl.to("#carte", { x: -1000, opacity: 0, duration: 0.4, ease: "power2.in" }, T.trajet - 0.15);
    tl.fromTo("#carte", { x: 1000, opacity: 0, rotation: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, T.stadeOk);
    tl.to("#grand", { opacity: 0, duration: 0.01 }, T.stadeOk);
    tl.fromTo("#carte-ok", { opacity: 0, scale: 0.4, rotation: -8 }, { opacity: 1, scale: 1, rotation: -2, duration: 0.45, ease: "back.out(2.6)", immediateRender: false }, T.stadeOk + 0.35);
    tl.to("#carte", { y: -40, opacity: 0, duration: 0.35 }, T.outro);

    // ── 2. Trajet bouché : route rouge, « +2 h », panneau « PARKING COMPLET » qui tombe ──
    const rouge = decorTrajet(document.getElementById("svg-trajet"));
    decorPanneau(document.getElementById("panneau"));
    tl.fromTo("#trajet", { opacity: 0, x: 900, rotation: 4 }, { opacity: 1, x: 0, rotation: -1, duration: 0.5, ease: "back.out(1.5)", immediateRender: false }, T.trajet);
    tl.fromTo(rouge, { attr: { "stroke-dashoffset": 900 } }, { attr: { "stroke-dashoffset": 0 }, duration: 1.5, ease: "power1.inOut", immediateRender: false }, T.route);
    tl.fromTo("#compteur", { opacity: 0, scale: 0.4, rotation: 10 }, { opacity: 1, scale: 1, rotation: 4, duration: 0.3, ease: "back.out(2.6)", immediateRender: false }, T.plus2h[0]);
    tl.to("#compteur", { keyframes: [{ scale: 1.15, duration: 0.15 }, { scale: 1, duration: 0.2 }] }, T.plus2h[1]);
    tl.fromTo("#panneau", { opacity: 1, y: -700, rotation: -30 }, { y: 0, rotation: -12, duration: 0.45, ease: "bounce.out", immediateRender: false }, T.parking - 0.25);
    tl.to(["#trajet", "#compteur", "#panneau"], { x: -1000, opacity: 0, duration: 0.4, ease: "power2.in" }, T.tele - 0.2);

    // ── 3. Télé : Hervé avachi, nuage de pluie ──
    const tele = decorTele(document.getElementById("svg-tele"));
    tl.fromTo("#tele", { opacity: 0, x: 900 }, { opacity: 1, x: 0, duration: 0.45, ease: "back.out(1.4)", immediateRender: false }, T.tele);
    tl.fromTo(tele.nuage, { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(2)", immediateRender: false }, 8.5);
    tl.fromTo(tele.gouttes, { opacity: 0, y: 0 }, { opacity: 1, y: 30, duration: 0.35, repeat: 4, ease: "none", immediateRender: false }, 8.8);
    tl.fromTo(tele.mini, { rotation: 0 }, { rotation: -6, svgOrigin: "350 440", duration: 0.4, immediateRender: false }, 8.6);
    tl.to("#tele", { x: -1000, opacity: 0, duration: 0.4, ease: "power2.in" }, T.zoom - 0.15);

    // Étincelles autour de Patrick (lunettes)
    const zx = document.getElementById("eclats");
    [[600, 1020, J], [880, 1000, "#fff"], [920, 1180, J], [580, 1220, "#fff"], [760, 960, J]].forEach(([x, y, c], k) => {
      const s = etoile(zx, c); s.setAttribute("class", "eclat");
      tl.fromTo(s, { x, y, opacity: 0, scale: 0.2, rotation: 0 }, { opacity: 1, scale: 1.2, rotation: 90, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, T.lunettes + 0.4 + k * 0.12);
    });

    // ── 5. Schéma en 3 étapes ──
    const etapes = document.querySelectorAll(".etape");
    etapes.forEach((e, k) => {
      tl.fromTo(e, { opacity: 0, x: 120 }, { opacity: 1, x: 0, duration: 0.35, ease: "back.out(1.8)", immediateRender: false }, T.etapes + k * 0.12);
      const t = T.lumieres[k];
      tl.to(e.querySelector("i"), { backgroundColor: VERT, duration: 0.15 }, t);
      tl.to(e.querySelector("b"), { color: NUIT, duration: 0.15 }, t);
      tl.fromTo(e.querySelector("span"), { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, t);
      tl.to(e, { keyframes: [{ scale: 1.04, duration: 0.12 }, { scale: 1, duration: 0.18 }] }, t);
    });
    tl.to("#etapes", { x: -1000, opacity: 0, duration: 0.4, ease: "power2.in" }, T.stade - 0.2);

    // ── 6. Stade de nuit : la voiture JP arrive au point de rendez-vous ──
    const stade = decorStade(document.getElementById("svg-stade"));
    tl.fromTo("#stade", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)", immediateRender: false }, T.stade);
    tl.fromTo(".stade .photo", { backgroundPosition: "40% 50%" }, { backgroundPosition: "60% 50%", duration: T.stadeOk - T.stade, ease: "none", immediateRender: false }, T.stade);
    tl.fromTo(stade.lum, { opacity: 0.6 }, { opacity: 1, duration: 0.6, yoyo: true, repeat: 7, ease: "sine.inOut", immediateRender: false }, T.stade);
    tl.fromTo(stade.auto, { x: -520 }, { x: 0, duration: 1.0, ease: "power3.out", immediateRender: false }, T.arrivee);
    tl.fromTo(stade.rdv, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.35, ease: "back.out(2.6)", immediateRender: false }, T.rdv);
    tl.to("#stade", { x: -1000, opacity: 0, duration: 0.4, ease: "power2.in" }, T.stadeOk - 0.15);

    // ── 7. Chute : Hervé chante (notes), Patrick se bouche les oreilles en riant ──
    tl.set(P.H.leves, { opacity: 1, y: 0 }, T.chant); tl.set(P.H.bras, { opacity: 0 }, T.chant);
    tl.set(P.H.rieurs, { opacity: 1 }, T.chant); tl.set(P.H.yeux, { opacity: 0 }, T.chant);
    tl.to(P.H.tete, { keyframes: [{ rotation: -7, duration: 0.4, ease: "sine.inOut" }, { rotation: 7, duration: 0.4, ease: "sine.inOut" }], repeat: 6 }, T.chant);
    tl.fromTo(P.H.leves, { y: 0 }, { y: -16, duration: 0.4, yoyo: true, repeat: 13, ease: "sine.inOut", immediateRender: false }, T.chant);
    const zn = document.getElementById("notes");
    for (let k = 0; k < 10; k++) {
      const n = document.createElement("div"); n.className = "note"; n.textContent = k % 2 ? "♫" : "♪";
      n.style.color = [V, R, NUIT, MOUTARDE][k % 4]; zn.appendChild(n);
      const x0 = 300, y0 = 1180, dx = 80 + ((k * 57) % 260), dy = 260 + ((k * 43) % 200);
      tl.fromTo(n, { x: x0, y: y0, opacity: 0, scale: 0.4, rotation: -20 },
        { keyframes: [{ opacity: 1, scale: 1, x: x0 + dx * 0.3, y: y0 - 80, duration: 0.35, ease: "back.out(2)" }, { x: x0 + dx, y: y0 - dy, rotation: 20, opacity: 0, duration: 1.4, ease: "sine.out" }], immediateRender: false }, T.chant + 0.1 + k * 0.6);
    }
    tl.fromTo(P.P.oreilles, { opacity: 0 }, { opacity: 1, duration: 0.15, immediateRender: false }, T.oreilles - 0.3);
    tl.set(P.P.bras, { opacity: 0 }, T.oreilles - 0.3);
    tl.set(P.P.rieurs, { opacity: 1 }, T.oreilles + 1.2); tl.set(P.P.yeux, { opacity: 0 }, T.oreilles + 1.2);
    tl.to(P.P.sourire, { opacity: 1, duration: 0.2 }, T.oreilles + 1.2);
    tl.to(P.P.tete, { keyframes: [{ rotation: -5, duration: 0.15 }, { rotation: 5, duration: 0.15 }], repeat: 5 }, T.oreilles + 1.2);
    tl.to(div.P, { ...NET, scale: 1, duration: 0.3 }, T.outro); tl.to(div.H, { ...NET, scale: 1, duration: 0.3 }, T.outro);

    // ── Compteur « +2 h » (fonction pure du temps, sûre au seek) ──
    const compteur = document.getElementById("compteur"), sous = document.getElementById("carte-sous");
    const horloge = (t) => {
      const [a, z] = T.plus2h, m = Math.round(Math.min(1, Math.max(0, (t - a) / (z - a))) * 120);
      compteur.textContent = m >= 120 ? "+2 h" : `+${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}`;
      const ok = t >= T.stadeOk && t < T.retour;
      sous.textContent = ok ? "DÉPOSE · ATTENTE · RETOUR" : "VOITURE ? TAXI ? TÉLÉ ?";
      sous.style.color = ok ? VERT : "#8A867E";
    };
    const temps = { t: 0 };
    horloge(0);
    tl.fromTo(temps, { t: 0 }, { t: T.duree, duration: T.duree, ease: "none", onUpdate: () => horloge(temps.t), immediateRender: true }, 0);

    // ── Outro WhatsApp (les deux restent en bas) ──
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
    tl.set("#grand", { opacity: 1 }, R0);
    tl.set("#carte-ok", { opacity: 0 }, R0);
    tl.fromTo("#carte", { x: 0, y: 0, opacity: 0, rotation: -1.5 }, { opacity: 1, duration: 0.3, immediateRender: false }, R0);
    tl.fromTo("#ballon", { x: 0, y: 0, rotation: 0, opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, R0);
    tl.set([P.P.oreilles, P.P.lunettes, P.P.sourire, P.P.rieurs, P.H.rieurs], { opacity: 0 }, R0);
    tl.set([P.P.bras, P.P.yeux, P.H.yeux, P.H.sourire], { opacity: 1 }, R0);
    tl.set([P.H.tete, P.P.tete], { rotation: 0 }, R0);
    tl.to(div.H, { ...NET, y: 0, duration: 0.3 }, R0); tl.to(div.P, { ...FLOU, duration: 0.3 }, R0);
    tl.set(motsPremiere.map((s) => s.lastChild), { color: GRIS }, R0);
    tl.fromTo(bulles[0].b, { opacity: 0, scale: 0.9, y: 0 }, { opacity: 1, scale: 1, duration: 0.3, immediateRender: false }, R0);

    tl.to({}, { duration: T.duree }, 0);
  };
})();
