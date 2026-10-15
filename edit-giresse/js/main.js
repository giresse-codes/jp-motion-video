// Edit TikTok « GIRESSE » façon edit crush : on flotte dans un tunnel de milliers de sites web,
// un site « héros » apparaît comme la crush, puis le drop enchaîne les coupes sur les temps
// (sites, code, montage, courbes d'animation, appli) — un portfolio qui ne dit pas son nom.
// Une seule horloge calcule tout à partir du temps : déterministe, sûr en recherche avant/arrière.

(function () {
  const PALETTES = [
    ["#fff4ec", "#ff6f91", "#1d1720", "#ffd3dd"], ["#0f0f14", "#ffb8cf", "#ffffff", "#2a2233"], ["#f2efe8", "#1d1d1f", "#1d1d1f", "#d9d3c7"],
    ["#11151f", "#7aa2ff", "#ffffff", "#1d2740"], ["#ffe8d6", "#ff8a3d", "#2b1a10", "#ffc9a3"], ["#e9f7f1", "#1f9d74", "#0f2a22", "#bfe8d8"],
    ["#f3edff", "#7b5cff", "#1c1430", "#d9ccff"], ["#141010", "#ff4d4d", "#ffffff", "#2b1d1d"], ["#fdfbf7", "#c9a96e", "#1b1a17", "#efe5d2"],
    ["#0b1a1f", "#3fd0c9", "#e8ffff", "#123139"], ["#fff0f6", "#d6336c", "#2b0f1c", "#ffc2d9"], ["#1a1a1a", "#f5f5f5", "#f5f5f5", "#333333"],
  ];
  const MOTS_TITRES = ["Studio", "Atelier", "Nova", "Bloom", "Maison", "Pixel", "Lumen", "Vague", "Orbit", "Sable", "Ember", "Flux"];

  // Mini-site généré : 5 mises en page × 12 palettes.
  function site(i, telephone) {
    const [fond, accent, texte, bloc] = PALETTES[i % PALETTES.length];
    const type = i % 5;
    const d = document.createElement("div");
    d.className = "site" + (telephone ? " tel" : "");
    d.style.background = fond;
    let h = `<div class="s-nav"><span class="s-logo" style="background:${accent}"></span>${[40, 34, 46].map((w) => `<i style="width:${w}px;background:${texte}"></i>`).join("")}</div>`;
    const titre = MOTS_TITRES[(i * 7) % MOTS_TITRES.length];
    if (telephone) {
      h += `<div class="s-bloc" style="left:16px;right:16px;top:50px;height:170px;background:${bloc}"></div>
        <div class="s-titre" style="left:18px;top:236px;color:${texte};font-size:28px">${titre}</div>
        <div class="s-ligne" style="left:18px;top:282px;width:150px;background:${texte};opacity:.35"></div>
        <div class="s-ligne" style="left:18px;top:300px;width:110px;background:${texte};opacity:.35"></div>
        <div class="s-bouton" style="left:18px;right:18px;bottom:24px;height:40px;border-radius:20px;background:${accent}"></div>`;
    } else if (type === 0) { // landing
      h += `<div class="s-titre" style="left:24px;top:76px;color:${texte}">${titre}<br><span style="color:${accent}">digital.</span></div>
        <div class="s-ligne" style="left:24px;top:160px;width:170px;background:${texte};opacity:.3"></div>
        <div class="s-ligne" style="left:24px;top:178px;width:130px;background:${texte};opacity:.3"></div>
        <div class="s-bouton" style="left:24px;top:210px;width:110px;background:${accent}"></div>
        <div class="s-bloc" style="right:22px;top:58px;width:200px;height:200px;border-radius:100px;background:${bloc}"></div>`;
    } else if (type === 1) { // boutique
      h += `<div class="s-titre" style="left:24px;top:52px;color:${texte};font-size:22px">${titre} Shop</div>`;
      for (let k = 0; k < 4; k++) h += `<div class="s-bloc" style="left:${24 + k * 110}px;top:96px;width:96px;height:120px;background:${k % 2 ? bloc : accent};opacity:${k % 2 ? 1 : 0.85}"></div><div class="s-ligne" style="left:${24 + k * 110}px;top:228px;width:70px;background:${texte};opacity:.35"></div><div class="s-ligne" style="left:${24 + k * 110}px;top:246px;width:40px;background:${accent}"></div>`;
    } else if (type === 2) { // portfolio
      h += `<div class="s-bloc" style="left:22px;top:52px;width:280px;height:226px;background:${bloc}"></div>
        <div class="s-bloc" style="left:314px;top:52px;width:144px;height:107px;background:${accent};opacity:.8"></div>
        <div class="s-bloc" style="left:314px;top:171px;width:144px;height:107px;background:${texte};opacity:.15"></div>
        <div class="s-titre" style="left:36px;top:226px;color:${texte};font-size:24px">${titre}</div>`;
    } else if (type === 3) { // tableau de bord
      h += `<div class="s-bloc" style="left:0;top:34px;width:90px;bottom:0;border-radius:0;background:${bloc}"></div>`;
      for (let k = 0; k < 6; k++) h += `<div class="s-bloc" style="left:${120 + k * 55}px;bottom:30px;width:34px;height:${40 + ((k * 53) % 140)}px;background:${k === 4 ? accent : texte};opacity:${k === 4 ? 1 : 0.25}"></div>`;
      h += `<div class="s-titre" style="left:120px;top:52px;color:${texte};font-size:22px">${titre} Board</div>`;
    } else { // blog / magazine
      h += `<div class="s-titre" style="left:0;right:0;top:56px;text-align:center;color:${texte};font-size:34px">${titre}</div>
        <div class="s-bloc" style="left:24px;top:110px;width:210px;height:160px;background:${accent};opacity:.85"></div>
        ${[0, 1, 2, 3, 4].map((k) => `<div class="s-ligne" style="left:252px;top:${116 + k * 30}px;width:${200 - (k % 2) * 60}px;background:${texte};opacity:.3"></div>`).join("")}`;
    }
    d.innerHTML = h;
    return d;
  }

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const hasard = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };

  window.CONSTRUIRE = function (tl) {
    const T = window.T, D = T.duree, B = T.temps;
    const $ = (id) => document.getElementById(id);

    // ── Essaim : 216 sites en tunnel ──
    const essaim = $("essaim");
    const ANNEAUX = 24, PAR_ANNEAU = 9, ECART = 300, L = ANNEAUX * ECART, F = 900;
    const sites = [];
    for (let r = 0; r < ANNEAUX; r++) for (let k = 0; k < PAR_ANNEAU; k++) {
      const n = r * PAR_ANNEAU + k, tel = hasard(n * 3.1) < 0.18;
      const e = site(n, tel);
      essaim.appendChild(e);
      const a = (k / PAR_ANNEAU) * Math.PI * 2 + r * 0.45 + hasard(n) * 0.4;
      const rayon = 900 + hasard(n + 7) * 700;
      sites.push({ e, X: Math.cos(a) * rayon, Y: Math.sin(a) * rayon * 1.25, Z: r * ECART + hasard(n + 3) * 120, rot: (hasard(n + 11) - 0.5) * 16, w: tel ? 220 : 480, h: tel ? 440 : 300 });
    }
    // Vitesse de la caméra selon l'énergie du son, intégrée une fois (pas de 1/120 s).
    const temps = B;
    const indiceTemps = (t) => { let i = -1; for (let k = 0; k < temps.length; k++) if (t >= temps[k]) i = k; return i; };
    const PLANS_DROP = ["essaim", "siteA", "code", "siteB", "montage", "essaim", "siteC", "motion", "tel", "siteD", "essaim", "code", "siteA", "montage", "essaim", "siteB", "motion", "siteC", "essaim", "tel", "siteD", "code", "montage", "essaim"];
    const planA = (t) => {
      if (t < T.drop || t >= T.ralenti) return null;
      const i = indiceTemps(t) - indiceTemps(T.drop);
      return { nom: PLANS_DROP[i % PLANS_DROP.length], i, u: t - temps[indiceTemps(t)] };
    };
    function vitesse(t) {
      if (t < T.montee) return 520;
      if (t < T.drop) return 520 + 900 * ((t - T.montee) / (T.drop - T.montee));
      if (t < T.ralenti) { const p = planA(t); return p && p.nom === "essaim" ? 4200 * Math.exp(-p.u * 2.5) + 900 : 900; }
      if (t < T.fin) return 160;
      return 260;
    }
    const PAS = 1 / 120, camZ = [0];
    for (let k = 1; k <= Math.ceil(D / PAS) + 2; k++) camZ.push(camZ[k - 1] + vitesse(k * PAS) * PAS);
    const cam = (t) => { const x = t / PAS, k = Math.floor(x); return camZ[k] + (camZ[k + 1] - camZ[k]) * (x - k); };

    // ── Plans du drop ──
    const zoneP = $("plans");
    const plans = {};
    const grandSite = (i) => { const p = document.createElement("div"); p.className = "plan"; const s = site(i, false); s.style.transform = "scale(2.083)"; s.style.transformOrigin = "0 0"; s.style.borderRadius = "0"; p.appendChild(s); return p; };
    plans.siteA = grandSite(0); plans.siteB = grandSite(3); plans.siteC = grandSite(5); plans.siteD = grandSite(9);
    plans.code = document.createElement("div"); plans.code.className = "plan code";
    plans.code.innerHTML = `<span class="c">// idée → écran</span>\n<span class="k">const</span> <span class="f">projet</span> = <span class="k">await</span> <span class="f">creer</span>({\n  style: <span class="s">"unique"</span>,\n  motion: <span class="k">true</span>,\n  pour: <span class="s">"toi"</span>,\n});\n<span class="f">projet</span>.<span class="f">lancer</span>(); <span class="c">// ✓ en ligne</span>`;
    plans.montage = document.createElement("div"); plans.montage.className = "plan montage";
    plans.montage.innerHTML = `<div class="m-ecran"></div>` + [["#ff8fb1", 0.08, 0.5], ["#ffd59a", 0.3, 0.42], ["#9ad7ff", 0.05, 0.72], ["#b6a3ff", 0.45, 0.3]].map(([c, a, l], k) =>
      `<div class="m-piste" style="top:${490 + k * 58}px;left:${40 + a * 920}px;right:auto;width:${l * 920}px;background:${c};opacity:.85"></div>`).join("") + `<div class="m-tete" id="m-tete"></div>`;
    plans.motion = document.createElement("div"); plans.motion.className = "plan motion";
    plans.motion.innerHTML = `<svg viewBox="0 0 1000 760"><g stroke="#2a2a36" stroke-width="2">${Array.from({ length: 9 }, (_, k) => `<line x1="0" y1="${k * 95}" x2="1000" y2="${k * 95}"/><line x1="${k * 125}" y1="0" x2="${k * 125}" y2="760"/>`).join("")}</g>
      <path id="courbe" d="M60 640 C 360 640 380 120 940 120" fill="none" stroke="#ff9ec4" stroke-width="10" stroke-linecap="round"/>
      <line x1="60" y1="640" x2="360" y2="640" stroke="#ffd59a" stroke-width="4"/><line x1="940" y1="120" x2="380" y2="120" stroke="#ffd59a" stroke-width="4"/>
      <circle cx="60" cy="640" r="16" fill="#fff"/><circle cx="940" cy="120" r="16" fill="#fff"/><circle cx="360" cy="640" r="11" fill="#ffd59a"/><circle cx="380" cy="120" r="11" fill="#ffd59a"/>
      <circle id="bille" r="22" fill="#ff5c8a"/></svg>`;
    plans.tel = document.createElement("div"); plans.tel.className = "plan"; plans.tel.style.background = "transparent"; plans.tel.style.boxShadow = "none";
    { const s = site(10, true); s.style.left = "390px"; s.style.top = "160px"; s.style.transform = "scale(1.9)"; s.style.transformOrigin = "50% 0"; plans.tel.appendChild(s); }
    Object.values(plans).forEach((p) => zoneP.appendChild(p));
    const courbe = plans.motion.querySelector("#courbe"), bille = plans.motion.querySelector("#bille"), Lc = courbe.getTotalLength();

    // ── Horloge unique ──
    const monde = $("monde"), heros = $("heros"), mot = $("mot"), phrase = $("phrase"), flash = $("flash"), grain = $("grain"), lueur = $("lueur");
    function maj(t) {
      const z = cam(t), p = planA(t);
      const enPlan = p && p.nom !== "essaim";
      // Essaim
      sites.forEach((s, n) => {
        let rel = ((s.Z - z) % L + L) % L;
        if (rel < 60) { s.e.style.opacity = "0"; return; }
        const k = F / rel;
        const x = 540 + s.X * k - s.w / 2, y = 960 + s.Y * k - s.h / 2;
        const brume = clamp((L - rel) / 2200) * clamp((rel - 60) / 300);
        s.e.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(k * 0.9).toFixed(3)}) rotate(${s.rot.toFixed(1)}deg)`;
        s.e.style.opacity = (brume * (enPlan ? 0.35 : t >= T.fin ? 0.4 : 1)).toFixed(3);
      });
      essaim.style.filter = enPlan ? "blur(4px)" : t >= T.fin ? "blur(2px)" : "none";
      // Plans
      Object.entries(plans).forEach(([nom, el]) => {
        if (enPlan && p.nom === nom) {
          const punch = 1 + 0.16 * Math.exp(-p.u * 11), sens = p.i % 2 ? 1 : -1;
          el.style.opacity = "1";
          el.style.transform = `translate(${(sens * 18 * Math.exp(-p.u * 6)).toFixed(1)}px, ${(-p.u * 30).toFixed(1)}px) scale(${punch.toFixed(3)}) rotate(${(sens * 2.2).toFixed(2)}deg)`;
        } else el.style.opacity = "0";
      });
      if (enPlan && p.nom === "montage") $("m-tete").style.left = (60 + p.u * 1500) + "px";
      if (enPlan && p.nom === "motion") { const q = courbe.getPointAtLength(clamp(p.u / 0.45) * Lc); bille.setAttribute("cx", q.x); bille.setAttribute("cy", q.y); }
      // Coup sur chaque temps : tremblement, aberration chromatique, flash
      const ib = indiceTemps(t), u = ib >= 0 ? t - temps[ib] : 9;
      const actif = t >= T.drop && t < T.ralenti;
      const force = actif ? Math.exp(-u * 16) : t >= T.montee && t < T.drop ? 0.45 * Math.exp(-u * 14) : 0;
      const sx = (hasard(ib * 1.7) - 0.5) * 36 * force, sy = (hasard(ib * 2.3) - 0.5) * 36 * force;
      const zoomBuild = t >= T.montee && t < T.drop ? 1 + 0.05 * Math.exp(-u * 8) + 0.06 * (t - T.montee) / (T.drop - T.montee) : 1;
      monde.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px) scale(${zoomBuild.toFixed(3)})`;
      const ca = 12 * force;
      // Aberration chromatique sur le seul plan affiché (léger à calculer).
      const chroma = ca > 0.4 ? `drop-shadow(${ca.toFixed(1)}px 0 0 rgba(255,40,90,.55)) drop-shadow(${(-ca).toFixed(1)}px 0 0 rgba(60,200,255,.5))` : "none";
      Object.entries(plans).forEach(([nom, el]) => { el.style.filter = enPlan && p.nom === nom ? chroma : "none"; });
      const mesure = T.mots.some(([tm]) => Math.abs(t - tm) < 0.5 && t >= tm);
      let fl = 0;
      if (t >= T.drop) fl = Math.max(fl, Math.exp(-(t - T.drop) * 5));
      if (actif) fl = Math.max(fl, (mesure ? 0.55 : 0.12) * Math.exp(-u * 18));
      if (t >= T.fin) fl = Math.max(fl, 0.8 * Math.exp(-(t - T.fin) * 6));
      flash.style.opacity = fl.toFixed(3);
      lueur.style.opacity = (0.7 + 0.3 * Math.sin(t * 1.3)).toFixed(3);
      { const g = Math.floor(t * 24); grain.style.transform = `translate(${Math.round(hasard(g) * 60 - 30)}px, ${Math.round(hasard(g + 0.5) * 60 - 30)}px)`; } // grain précalculé, déplacé
      // Phrases douces
      let ph = "", op = 0;
      T.phrases.forEach(([a, b, txt]) => { if (t >= a && t < b) { ph = txt; op = clamp((t - a) / 0.5) * clamp((b - t) / 0.4); } });
      phrase.textContent = ph;
      phrase.style.opacity = op.toFixed(3);
      phrase.style.filter = `blur(${((1 - op) * 10).toFixed(1)}px)`;
      // Mots du portfolio, en flash
      let m = "", om = 0;
      T.mots.forEach(([tm, txt]) => { if (t >= tm && t < tm + 1.0) { m = txt; om = (t - tm < 0.06 || (t - tm > 0.12 && t - tm < 0.16)) ? 1 : clamp((tm + 1.0 - t) / 0.25); } });
      mot.textContent = m;
      mot.style.opacity = om.toFixed(3);
      mot.style.transform = `scale(${(1 + 0.12 * Math.exp(-(t % 1) * 0)).toFixed(3)})`;
    }
    const horloge = { t: 0 };
    tl.fromTo(horloge, { t: 0 }, { t: D, duration: D, ease: "none", onUpdate: () => maj(horloge.t) }, 0);
    maj(0);

    // ── Le site « héros » (la crush) ──
    tl.fromTo(heros, { opacity: 0, scale: 0.35, filter: "blur(18px)", y: 120 }, { opacity: 1, scale: 0.82, filter: "blur(0px)", y: 0, duration: 1.0, ease: "power3.out" }, T.heros);
    tl.to(heros, { scale: 1.0, duration: T.drop - T.heros - 1.0, ease: "power2.in" }, T.heros + 1.0);
    tl.to(heros, { opacity: 0, scale: 1.6, filter: "blur(16px)", duration: 0.18, ease: "power2.in" }, T.drop - 0.12);
    tl.fromTo(heros, { opacity: 0, scale: 0.9, filter: "blur(14px)" }, { opacity: 1, scale: 1.0, filter: "blur(0px)", duration: 0.6, ease: "power2.out", immediateRender: false }, T.ralenti);
    tl.to(heros, { scale: 1.06, duration: T.fin - T.ralenti - 0.3, ease: "sine.inOut" }, T.ralenti + 0.6);
    tl.to(heros, { opacity: 0, y: -260, scale: 0.7, filter: "blur(12px)", duration: 0.35, ease: "power2.in" }, T.fin - 0.3);

    // ── Fin ──
    tl.fromTo("#fin-logo", { opacity: 0, scale: 0.6, filter: "blur(16px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out" }, T.fin);
    tl.fromTo("#fin-nom", { opacity: 0, y: 30, filter: "blur(14px)", letterSpacing: "0.3em" }, { opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "0.02em", duration: 1.0, ease: "power3.out" }, T.fin + 0.35);
    tl.fromTo("#fin-sous", { opacity: 0 }, { opacity: 1, duration: 0.8 }, T.fin + 1.1);
    tl.to(["#fin-logo", "#fin-nom", "#fin-sous"], { opacity: 0, filter: "blur(10px)", duration: 0.8 }, D - 0.9);
  };
})();
