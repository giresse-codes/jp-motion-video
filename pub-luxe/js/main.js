// « Le vrai luxe » — JP PREMIUM, ambiance LUXE. Tout est dessiné ici (SVG + CSS 3D) puis animé sur une seule
// timeline GSAP en pause, sûre au seek. Repères dans js/temps.js (window.T).
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var $ = function (s) { return document.querySelector(s); };
  // Hasard déterministe (mulberry32) : même image à chaque rendu.
  function hasard(graine) {
    return function () {
      graine |= 0; graine = (graine + 0x6D2B79F5) | 0;
      var t = Math.imul(graine ^ (graine >>> 15), 1 | graine);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function el(nom, attrs, parent) {
    var e = document.createElementNS(NS, nom);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  // ---------- 1. Poignée chromée ----------
  function poignee() {
    var svg = $("#poignee-svg"), r = hasard(11);
    svg.innerHTML =
      '<defs>' +
      '<linearGradient id="g-carro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1C40"/><stop offset=".45" stop-color="#081230"/><stop offset="1" stop-color="#03070F"/></linearGradient>' +
      '<linearGradient id="g-chrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7F9FC"/><stop offset=".22" stop-color="#AEB6C6"/><stop offset=".48" stop-color="#252C3C"/><stop offset=".62" stop-color="#4A5366"/><stop offset=".8" stop-color="#D5DBE6"/><stop offset="1" stop-color="#596277"/></linearGradient>' +
      '<radialGradient id="g-creux" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#000"/><stop offset=".8" stop-color="#02050C"/><stop offset="1" stop-color="#0B1430"/></radialGradient>' +
      '<linearGradient id="g-balaye" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="g-perle" cx=".38" cy=".32" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".25" stop-color="#9FB4E0" stop-opacity=".25"/><stop offset=".8" stop-color="#050A18" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/></radialGradient>' +
      '<filter id="f-flou18"><feGaussianBlur stdDeviation="18"/></filter><filter id="f-flou4"><feGaussianBlur stdDeviation="4"/></filter>' +
      '<clipPath id="c-poignee"><rect x="250" y="896" width="580" height="116" rx="58"/></clipPath>' +
      '</defs>' +
      '<rect width="1080" height="1920" fill="url(#g-carro)"/>' +
      // reflets de carrosserie : ligne de caisse et bande de lumière douce
      '<path id="bande" d="M -100 700 C 300 640 780 640 1180 590" stroke="#BFD0FF" stroke-opacity=".22" stroke-width="70" fill="none" filter="url(#f-flou18)"/>' +
      '<path d="M -20 660 C 300 615 780 615 1100 575" stroke="#fff" stroke-opacity=".28" stroke-width="2.5" fill="none"/>' +
      '<path d="M -20 1300 C 400 1340 700 1340 1100 1290" stroke="#fff" stroke-opacity=".08" stroke-width="2" fill="none"/>' +
      // creux de la poignée
      '<ellipse cx="540" cy="965" rx="380" ry="118" fill="url(#g-creux)"/>' +
      '<ellipse cx="540" cy="965" rx="380" ry="118" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>' +
      '<rect x="250" y="1004" width="580" height="30" rx="15" fill="#000" opacity=".7" filter="url(#f-flou4)"/>' +
      // poignée chromée
      '<rect x="250" y="896" width="580" height="116" rx="58" fill="url(#g-chrome)"/>' +
      '<rect x="285" y="903" width="510" height="6" rx="3" fill="#fff" opacity=".8"/>' +
      '<circle cx="770" cy="954" r="14" fill="#11161F" stroke="#C9D0DC" stroke-width="2" opacity=".85"/>' +
      '<g clip-path="url(#c-poignee)"><rect id="balaye" x="-300" y="860" width="200" height="200" fill="url(#g-balaye)" transform="skewX(-22)"/></g>' +
      '<g id="perles"></g>';
    var perles = $("#perles");
    for (var i = 0; i < 34; i++) {
      var x = r() * 1080, y = 180 + r() * 1500;
      if (y > 820 && y < 1110) continue; // pas sur la poignée
      var rr = 4 + r() * 11;
      el("ellipse", { cx: x, cy: y, rx: rr, ry: rr * 1.12, fill: "url(#g-perle)" }, perles);
    }
  }

  // ---------- 2. Siège en cuir et main ----------
  function cuir() {
    var svg = $("#cuir-svg");
    svg.innerHTML =
      '<defs>' +
      '<radialGradient id="g-coussin" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="#5A1C26"/><stop offset=".6" stop-color="#2E0C13"/><stop offset="1" stop-color="#12050A"/></radialGradient>' +
      '<pattern id="p-matelasse" width="170" height="170" patternUnits="userSpaceOnUse">' +
      '<rect width="170" height="170" fill="#12050A"/><polygon points="85,0 170,85 85,170 0,85" fill="url(#g-coussin)"/>' +
      '<polygon points="0,-85 85,0 0,85 -85,0" fill="url(#g-coussin)"/><polygon points="170,-85 255,0 170,85 85,0" fill="url(#g-coussin)"/><polygon points="0,85 85,170 0,255 -85,170" fill="url(#g-coussin)"/><polygon points="170,85 255,170 170,255 85,170" fill="url(#g-coussin)"/>' +
      '<polygon points="85,9 161,85 85,161 9,85" fill="none" stroke="#E8C9B8" stroke-opacity=".38" stroke-width="2" stroke-dasharray="7 6"/>' +
      '<circle cx="85" cy="70" r="2.2" fill="#000" opacity=".5"/><circle cx="72" cy="85" r="2.2" fill="#000" opacity=".5"/><circle cx="98" cy="85" r="2.2" fill="#000" opacity=".5"/><circle cx="85" cy="100" r="2.2" fill="#000" opacity=".5"/>' +
      '</pattern>' +
      '<radialGradient id="g-lumiere" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#FFE9DA" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>' +
      '<linearGradient id="g-peau" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A4E37"/><stop offset=".5" stop-color="#4E3022"/><stop offset="1" stop-color="#24150F"/></linearGradient>' +
      '<filter id="f-ombre" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="26"/></filter>' +
      '</defs>' +
      '<g id="siege"><rect x="-200" y="-200" width="1480" height="2320" fill="url(#p-matelasse)"/>' +
      '<path d="M -50 1560 C 300 1500 780 1500 1130 1560 L 1130 2000 L -50 2000 Z" fill="#14060A"/>' +
      '<path d="M -50 1560 C 300 1500 780 1500 1130 1560" stroke="#E8C9B8" stroke-opacity=".35" stroke-width="3" stroke-dasharray="9 7" fill="none"/>' +
      '<rect width="1080" height="1920" fill="url(#g-lumiere)"/></g>' +
      '<ellipse id="ombre-main" cx="560" cy="1330" rx="260" ry="80" fill="#000" opacity="0" filter="url(#f-ombre)"/>' +
      '<g id="main"><g transform="translate(250 800) scale(1.45)">' +
      '<path id="main-forme" fill="url(#g-peau)" stroke="#FFD9BF" stroke-opacity=".35" stroke-width="1.6" d="' +
      'M150 -900 L140 0 C138 80 128 130 112 170 C 90 200 62 250 58 300 C 55 325 75 330 88 312 C 102 290 112 262 122 240 ' +
      'L 118 400 C 117 425 137 440 150 430 C 158 422 160 410 160 395 L 162 250 ' +
      'L 166 430 C 166 458 190 468 204 455 C 210 448 211 438 211 425 L 212 252 ' +
      'L 216 410 C 216 436 238 444 252 432 C 258 426 258 416 258 405 L 257 250 ' +
      'L 262 362 C 263 386 284 392 294 380 C 299 374 299 366 298 356 L 294 230 C 292 170 275 90 262 0 L 268 -900 Z"/>' +
      '<path d="M150 60 C 160 120 170 170 190 210" stroke="#FFD9BF" stroke-opacity=".18" stroke-width="10" fill="none" stroke-linecap="round"/>' +
      '</g></g>';
  }

  // ---------- 3. Clim ----------
  function clim() {
    var svg = $("#clim-svg"), html = '<defs><filter id="f-glace"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '<linearGradient id="g-lame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8EDF5"/><stop offset=".5" stop-color="#3A4256"/><stop offset="1" stop-color="#AAB3C4"/></linearGradient></defs>';
    html += '<g id="flocon" filter="url(#f-glace)" stroke="#E4F2FF" stroke-width="7" stroke-linecap="round" fill="none"><g transform="translate(280 230)">';
    for (var i = 0; i < 6; i++) {
      html += '<g transform="rotate(' + i * 60 + ')"><path d="M0 0 V-120"/><path d="M0 -70 L-26 -96 M0 -70 L26 -96"/><path d="M0 -36 L-18 -54 M0 -36 L18 -54"/></g>';
    }
    html += '<circle r="12" fill="#E4F2FF" stroke="none"/></g></g>';
    for (var k = 0; k < 4; k++) html += '<rect x="90" y="' + (405 + k * 30) + '" width="380" height="14" rx="7" fill="url(#g-lame)" opacity=".85"/>';
    svg.innerHTML = html;
    // particules d'air froid (dans la page, devant la carte)
    var part = $("#particules"), r = hasard(5);
    for (var p = 0; p < 70; p++) {
      el("circle", { cx: 360 + r() * 360, cy: 1080 + r() * 40, r: 2 + r() * 5, fill: "#D7EBFF", opacity: 0, "data-dx": (r() - .5) * 560, "data-dy": 160 + r() * 520, "data-t": r() }, part);
    }
  }

  // ---------- 4. Wi-Fi ----------
  function wifi() {
    var svg = $("#wifi-svg");
    var arc = function (rr) {
      var a0 = -135 * Math.PI / 180, a1 = -45 * Math.PI / 180;
      return "M " + (280 + rr * Math.cos(a0)) + " " + (380 + rr * Math.sin(a0)) + " A " + rr + " " + rr + " 0 0 1 " + (280 + rr * Math.cos(a1)) + " " + (380 + rr * Math.sin(a1));
    };
    svg.innerHTML = '<defs><filter id="f-lueur"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
      '<g filter="url(#f-lueur)" stroke="#FFFFFF" stroke-width="24" stroke-linecap="round" fill="none">' +
      '<circle class="onde" cx="280" cy="380" r="20" fill="#fff" stroke="none" opacity=".12"/>' +
      '<path class="onde" d="' + arc(85) + '" opacity=".12"/><path class="onde" d="' + arc(150) + '" opacity=".12"/><path class="onde" d="' + arc(215) + '" opacity=".12"/></g>';
    bokeh($("#bokeh-wifi"), 18, 21, ["#FFB35C", "#FF6A4D", "#FFF1D6"], 0.35);
  }

  function bokeh(conteneur, n, graine, couleurs, opa) {
    var r = hasard(graine);
    for (var i = 0; i < n; i++) {
      var d = document.createElement("i"), t = 40 + r() * 200, c = couleurs[Math.floor(r() * couleurs.length)];
      d.className = "bokeh";
      d.style.cssText = "left:" + (r() * 1180 - 50) + "px;top:" + (r() * 2000 - 40) + "px;width:" + t + "px;height:" + t + "px;" +
        "background:radial-gradient(circle, " + c + " 0%, " + c + "AA 45%, " + c + "00 70%);opacity:" + (opa * (0.5 + r() * 0.5)).toFixed(2) + ";filter:blur(" + (2 + r() * 6).toFixed(1) + "px)";
      conteneur.appendChild(d);
    }
  }

  // ---------- 5. Pluie sur la vitre ----------
  function pluie() {
    var ville = $("#ville-floue");
    ville.style.background = "linear-gradient(180deg, #050914 0%, #0B1430 55%, #1A1020 100%)";
    bokeh(ville, 46, 8, ["#FFB35C", "#FF4A3D", "#FFF2D6", "#7FA7FF", "#FFD27A"], 0.75);
    var svg = $("#vitre-svg"), r = hasard(17);
    var html = '<defs><radialGradient id="g-goutte" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".2" stop-color="#fff" stop-opacity=".18"/><stop offset=".75" stop-color="#000" stop-opacity=".25"/><stop offset="1" stop-color="#fff" stop-opacity=".45"/></radialGradient></defs>';
    for (var i = 0; i < 95; i++) {
      var rr = 3 + Math.pow(r(), 2) * 16;
      html += '<ellipse cx="' + (r() * 1080).toFixed(0) + '" cy="' + (r() * 1920).toFixed(0) + '" rx="' + rr.toFixed(1) + '" ry="' + (rr * 1.15).toFixed(1) + '" fill="url(#g-goutte)"/>';
    }
    for (var c = 0; c < 6; c++) {
      var x = 120 + c * 160 + r() * 60, y = 200 + r() * 700;
      html += '<g class="coulee" data-y="' + y.toFixed(0) + '" data-d="' + (300 + r() * 350).toFixed(0) + '">' +
        '<rect class="trainee" x="' + (x - 3) + '" y="' + y.toFixed(0) + '" width="6" height="0" rx="3" fill="#fff" opacity=".18"/>' +
        '<ellipse class="tete" cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" rx="13" ry="16" fill="url(#g-goutte)"/></g>';
    }
    svg.innerHTML = html;
  }

  // ---------- Textes ----------
  function mots(cible, liste, cle) {
    var p = $(cible); p.innerHTML = "";
    liste.forEach(function (m, i) {
      var s = document.createElement("span"); s.className = "m";
      if (m[2].indexOf(cle) === 0) { var e = document.createElement("em"); e.textContent = m[2]; s.appendChild(e); } else s.textContent = m[2];
      p.appendChild(s);
      if (cible === "#texte1" && m[2] === "luxe") p.appendChild(document.createElement("br"));
      else if (i < liste.length - 1) p.appendChild(document.createTextNode(" "));
    });
    return p.querySelectorAll(".m");
  }

  function fondu(tl, sortant, entrant, t, d) {
    d = d || 0.6;
    if (sortant) tl.to(sortant, { opacity: 0, duration: d, ease: "sine.inOut" }, t);
    if (entrant) tl.to(entrant, { opacity: 1, duration: d, ease: "sine.inOut" }, t);
  }

  window.CONSTRUIRE = function (tl) {
    var T = window.T;
    poignee(); cuir(); clim(); wifi(); pluie();
    var m1 = mots("#texte1", T.mots1, "luxe"), m2 = mots("#texte2", T.mots2, "faire");
    gsap.set(m1, { opacity: 0.45 });
    gsap.set(m2, { opacity: 0, filter: "blur(10px)" });
    tl.set({}, {}, T.duree); // durée totale

    // 1. Poignée : poussée lente, reflet qui glisse, mots qui s'éclairent sur la voix
    tl.fromTo("#cam1", { scale: 1.45, x: 0 }, { scale: 1.55, x: -20, duration: 2.9, ease: "sine.inOut" }, 0);
    tl.fromTo("#balaye", { attr: { x: -300 } }, { attr: { x: 1150 }, duration: 2.2, ease: "sine.inOut" }, 0.15);
    tl.fromTo("#bande", { x: -60 }, { x: 60, duration: 2.9, ease: "sine.inOut" }, 0);
    T.mots1.forEach(function (m, i) { tl.to(m1[i], { opacity: 1, duration: 0.6, ease: "sine.out" }, m[0]); });
    tl.to("#texte1", { opacity: 0, filter: "blur(8px)", duration: 0.6, ease: "sine.in" }, 2.15);

    // 2. Cuir : la main se pose doucement, le cuir cède un peu
    fondu(tl, "#p1", "#p2", 2.25);
    gsap.set("#cuir-svg", { transformPerspective: 1600, rotationX: 16, transformOrigin: "50% 60%" });
    tl.fromTo("#cam2", { scale: 1.32 }, { scale: 1.42, duration: 2.1, ease: "none" }, 2.25);
    tl.fromTo("#main", { y: -760 }, { y: 0, duration: 0.95, ease: "power2.out", immediateRender: false }, T.main);
    tl.fromTo("#ombre-main", { opacity: 0 }, { opacity: 0.75, duration: 0.95, ease: "power2.out", immediateRender: false }, T.main);
    tl.to("#main-forme", { scaleY: 0.985, scaleX: 1.01, transformOrigin: "50% 100%", duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 1 }, 3.2);
    tl.to("#siege", { scale: 1.01, transformOrigin: "50% 66%", duration: 0.8, ease: "sine.inOut" }, 3.25);

    // 3. Clim : carte de verre qui pivote, flocon, souffle de particules
    fondu(tl, "#p2", "#p3", 3.75);
    tl.fromTo("#verre-clim", { rotationY: -18, rotationX: 9 }, { rotationY: 10, rotationX: -4, duration: 2.1, ease: "sine.inOut", immediateRender: false }, 3.75);
    tl.fromTo("#verre-clim .reflet", { left: "-80%" }, { left: "190%", duration: 1.4, ease: "sine.inOut", immediateRender: false }, 4.0);
    tl.fromTo("#flocon", { rotation: 0, svgOrigin: "280 230", opacity: 0.5 }, { rotation: 40, svgOrigin: "280 230", opacity: 1, duration: 2.0, ease: "sine.out", immediateRender: false }, 3.8);
    document.querySelectorAll("#particules circle").forEach(function (c) {
      var t0 = 3.95 + parseFloat(c.dataset.t) * 0.9;
      tl.fromTo(c, { x: 0, y: 0, opacity: 0 }, { keyframes: [{ opacity: 0.85, duration: 0.25 }, { opacity: 0, duration: 0.95 }], x: c.dataset.dx, y: c.dataset.dy, duration: 1.2, ease: "sine.out", immediateRender: false }, t0);
    });

    // 4. Wi-Fi : les ondes s'allument une à une
    fondu(tl, "#p3", "#p4", 5.25);
    tl.fromTo("#verre-wifi", { rotationY: 16, rotationX: -6 }, { rotationY: -10, rotationX: 5, duration: 2.0, ease: "sine.inOut", immediateRender: false }, 5.25);
    tl.fromTo("#verre-wifi .reflet", { left: "-80%" }, { left: "190%", duration: 1.4, ease: "sine.inOut", immediateRender: false }, 5.6);
    tl.fromTo("#bokeh-wifi", { x: 0, scale: 1 }, { x: -40, scale: 1.06, duration: 2.0, ease: "none", immediateRender: false }, 5.25);
    document.querySelectorAll("#wifi-svg .onde").forEach(function (o, i) { tl.to(o, { opacity: 1, duration: 0.5, ease: "sine.out" }, T.wifi[i]); });

    // 5. Pluie sur la vitre
    fondu(tl, "#p4", "#p5", 6.75);
    tl.fromTo("#cam5", { scale: 1 }, { scale: 1.1, duration: 2.0, ease: "none", immediateRender: false }, 6.75);
    tl.fromTo("#ville-floue", { x: 0 }, { x: -50, duration: 2.0, ease: "none", immediateRender: false }, 6.75);
    document.querySelectorAll(".coulee").forEach(function (g, i) {
      var y = +g.dataset.y, d = +g.dataset.d, t0 = 6.9 + i * 0.15;
      tl.to(g.querySelector(".tete"), { attr: { cy: y + d }, duration: 1.6, ease: "power1.in" }, t0);
      tl.to(g.querySelector(".trainee"), { attr: { height: d }, duration: 1.6, ease: "power1.in" }, t0);
    });

    // 6. « … c'est de ne rien faire. » puis une seconde de silence
    fondu(tl, "#p5", "#p6", 8.1);
    T.mots2.forEach(function (m, i) { tl.to(m2[i], { opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "sine.out" }, m[0] - 0.1); });
    tl.fromTo("#texte2", { scale: 1 }, { scale: 1.05, duration: 2.6, ease: "none", immediateRender: false }, 8.1);

    // 7. La voiture glisse sous le projecteur, phares qui s'allument
    fondu(tl, "#p6", "#p7", 10.15);
    tl.fromTo("#proj7", { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "sine.inOut", immediateRender: false }, 10.2);
    tl.fromTo("#auto", { x: 760, scale: 0.98 }, { x: 0, scale: 1, duration: T.arret - T.voiture, ease: "power3.out", immediateRender: false }, T.voiture);
    tl.to("#auto", { scale: 1.035, duration: 13.9 - T.arret, ease: "none" }, T.arret);
    tl.fromTo(["#phare", "#faisceau"], { opacity: 0 }, { keyframes: [{ opacity: 0.6, duration: 0.12 }, { opacity: 0.25, duration: 0.1 }, { opacity: 1, duration: 0.6 }], immediateRender: false }, T.phares);
    tl.fromTo("#mot1", { opacity: 0, filter: "blur(10px)", letterSpacing: "0em" }, { opacity: 1, filter: "blur(0px)", letterSpacing: "0.04em", duration: 0.9, ease: "sine.out", immediateRender: false }, T.mot1 - 0.1);
    tl.fromTo("#mot2", { opacity: 0, filter: "blur(10px)", letterSpacing: "0em" }, { opacity: 1, filter: "blur(0px)", letterSpacing: "0.04em", duration: 0.9, ease: "sine.out", immediateRender: false }, T.mot2 - 0.1);

    // 8. Outro sobre : logo sous le projecteur
    fondu(tl, "#p7", "#p8", T.outro - 0.15);
    tl.fromTo("#proj8", { opacity: 0.3 }, { opacity: 1, duration: 1.2, ease: "sine.inOut", immediateRender: false }, T.outro);
    tl.fromTo("#logo", { opacity: 0, filter: "blur(14px)", scale: 1.05 }, { opacity: 1, filter: "blur(0px)", scale: 1, duration: 1.3, ease: "sine.out", immediateRender: false }, T.outro + 0.1);
    tl.to("#logo", { scale: 0.98, duration: T.duree - T.outro - 1.4, ease: "none" }, T.outro + 1.4);
    tl.fromTo("#ligne", { opacity: 0, letterSpacing: "0.26em" }, { opacity: 1, letterSpacing: "0.34em", duration: 1.0, ease: "sine.out", immediateRender: false }, T.ligne - 0.1);
    tl.fromTo("#wa", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, ease: "sine.out", immediateRender: false }, T.wa);

    // Retour à la poignée (image 1) pour la boucle
    tl.set("#texte1", { opacity: 1, filter: "blur(0px)" }, T.retour - 0.5);
    tl.set(m1, { opacity: 0.45 }, T.retour - 0.5);
    tl.set("#balaye", { attr: { x: -300 } }, T.retour - 0.5);
    tl.set("#bande", { x: -60 }, T.retour - 0.5);
    tl.fromTo("#cam1", { scale: 1.5, x: 10 }, { scale: 1.45, x: 0, duration: T.duree - T.retour, ease: "sine.out", immediateRender: false }, T.retour);
    fondu(tl, "#p8", "#p1", T.retour, 0.55);
  };
})();
