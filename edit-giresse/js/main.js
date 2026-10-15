// Edit TikTok « GIRESSE » — dev, monteur, designer. La cheerleader, c'est l'informatique.
// Style de la référence : noir, voile de feu orange, logo + nom en serif, pilules lumineuses,
// curseur, texte qui s'écrit avec les dernières lettres orange, pluie de code, carte de site en verre
// inclinée, « fond bleu », signature finale en lettres qui tombent. Tout est calé sur window.T.

(function () {
  const P1 = "Je veux un site pour mon travail de dev & motion design.";
  const P2 = "Je veux un fond bleu.";
  const P3 = "Ajoute mes projets.";
  const SOUS_TITRES = [
    "Ma cheerleader ? L'informatique.",
    "Toujours là quand je code.",
    "Elle compile mes idées.",
    "Elle ne me lâche jamais, même à 3 h du mat'.",
    "Ctrl + S. Toujours.",
  ];
  const PILULES = [
    ["Créer", '<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" fill="none" stroke="#fff" stroke-width="2"/>'],
    ["Coder", '<path d="M8 6l-6 6 6 6M16 6l6 6-6 6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>'],
    ["Designer", '<path d="M3 21l3-1 12-12-2-2L4 18zM14 6l4 4" fill="none" stroke="#fff" stroke-width="2"/>'],
    ["Monter", '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="#fff" stroke-width="2"/><path d="M10 9l5 3-5 3z" fill="#fff"/>'],
    ["Déployer", '<path d="M12 3c4 3 5 7 4 11l-4 4-4-4c-1-4 0-8 4-11zM9 18l-3 3M15 18l3 3" fill="none" stroke="#fff" stroke-width="2"/>'],
  ];
  const TAGS = ["HTML", "CSS", "JavaScript", "Python", "React", "After Effects", "Premiere Pro", "Figma"];
  const PROJETS = [
    ["Site web", "HTML · CSS · JavaScript", '<path d="M30 30l-18 18 18 18M70 30l18 18-18 18M58 22L42 74" fill="none" stroke="#9fc0ff" stroke-width="7" stroke-linecap="round"/>'],
    ["Montage vidéo", "Premiere Pro · CapCut", '<rect x="10" y="22" width="80" height="52" rx="8" fill="none" stroke="#9fc0ff" stroke-width="6"/><path d="M42 36l18 12-18 12z" fill="#9fc0ff"/><path d="M10 84h80" stroke="#9fc0ff" stroke-width="6" stroke-dasharray="8 6"/>'],
    ["Motion design", "After Effects · HyperFrames", '<path d="M12 78C30 20 70 80 88 22" fill="none" stroke="#9fc0ff" stroke-width="6"/><circle cx="12" cy="78" r="7" fill="#9fc0ff"/><circle cx="88" cy="22" r="7" fill="#9fc0ff"/><path d="M12 78L40 30M88 22L60 70" stroke="#9fc0ff" stroke-width="3" stroke-dasharray="4 5"/>'],
  ];
  const CODE = [
    ['<span style="color:#ff9f43">const</span> giresse = <span style="color:#7ee787">() =></span> motion(design);', ""],
    ['<span style="color:#79c0ff">git</span> push origin main', ""],
    ['&lt;<span style="color:#ff7b72">div</span> class=<span style="color:#a5d6ff">"hero"</span>&gt;', ""],
    ['<span style="color:#7ee787">npm</span> run build  <span style="color:#7ee787">✓</span>', ""],
    ['gsap.to(<span style="color:#a5d6ff">".carte"</span>, { rotationY: <span style="color:#ff9f43">-14</span> })', ""],
    ['<span style="color:#d2a8ff">def</span> rendu(frame): <span style="color:#ff9f43">return</span> frame', ""],
    ['@keyframes <span style="color:#ffa657">feu</span> { to { opacity: 1 } }', ""],
    ['ffmpeg -i edit.mp4 -c:v libx264 tiktok.mp4', ""],
  ];
  const POINTEUR = `<svg viewBox="0 0 24 24" width="64" height="64"><path d="M5 2l14 11-6.2.8 3.7 7.3-2.6 1.3-3.6-7.4L5 19z" fill="#fff" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  window.CONSTRUIRE = function (tl) {
    const T = window.T;
    const $ = (id) => document.getElementById(id);
    const D = T.duree;

    // ── Texte qui s'écrit : dernières lettres en dégradé orange pendant l'écriture ──
    const ecrire = (txt, p, classeQueue = "queue", n = 6) => {
      const k = Math.round(txt.length * clamp(p));
      if (k >= txt.length && p >= 1) return txt.replace(/&/g, "&amp;");
      const vu = txt.slice(0, k);
      const a = vu.slice(0, Math.max(0, vu.length - n)).replace(/&/g, "&amp;");
      const b = vu.slice(Math.max(0, vu.length - n)).replace(/&/g, "&amp;");
      return `${a}<span class="${classeQueue}">${b}</span>`;
    };

    // ── Horloge unique : feu, saisie, sous-titres, pluie de code ──
    const flammes = [$("flamme-1"), $("flamme-2"), $("flamme-3")];
    const saisie = $("saisie-texte"), st = $("st"), pluie = $("pluie");
    const colonnes = Array.from({ length: 9 }, (_, i) => {
      const pre = document.createElement("pre");
      pre.innerHTML = Array.from({ length: 14 }, (_, k) => CODE[(i * 3 + k) % CODE.length][0]).join("\n");
      pre.style.left = (-120 + i * 150) + "px";
      pluie.appendChild(pre);
      return pre;
    });
    function maj(t) {
      flammes.forEach((f, i) => {
        const a = Math.sin(t * (0.9 + i * 0.25) + i * 2) * (8 + i * 3), s = 1 + 0.06 * Math.sin(t * 1.7 + i);
        const dx = Math.sin(t * 0.7 + i) * 40, dy = Math.cos(t * 0.6 + i * 1.3) * 50;
        f.setAttribute("transform", `translate(${dx.toFixed(1)} ${dy.toFixed(1)}) rotate(${a.toFixed(2)} 600 900) scale(${s.toFixed(3)})`);
      });
      // Saisie
      let html = '<span class="vide">Demande à GIRESSE…</span>';
      if (t >= T.saisie1 && t < T.envoi1) html = ecrire(P1, (t - T.saisie1) / (T.saisie1Fin - T.saisie1));
      else if (t >= T.saisie2 && t < T.envoi2) html = ecrire(P2, (t - T.saisie2) / (T.saisie2Fin - T.saisie2));
      else if (t >= T.saisie3 && t < T.saisie3Fin + 0.15) html = ecrire(P3, (t - T.saisie3) / (T.saisie3Fin - T.saisie3));
      saisie.innerHTML = html;
      // Sous-titres
      let s = "";
      T.st.forEach(([a, b], i) => {
        const suivant = i < T.st.length - 1 ? T.st[i + 1][0] : b + 0.6;
        if (t >= a - 0.05 && t < Math.min(b + 0.35, suivant - 0.02)) s = ecrire(SOUS_TITRES[i], (t - a) / Math.max(0.35, (b - a) * 0.6), "queue", 5);
      });
      st.innerHTML = s;
      // Pluie de code
      colonnes.forEach((c, i) => {
        c.style.transform = `translateY(${((-900 + ((t * (1400 + i * 120)) % 2600)) - 400).toFixed(0)}px)`;
      });
    }
    const horloge = { t: 0 };
    tl.fromTo(horloge, { t: 0 }, { t: D, duration: D, ease: "none", onUpdate: () => maj(horloge.t) }, 0);
    maj(0);
    tl.fromTo("#feu", { opacity: 0.35 }, { opacity: 1, duration: 1.6, ease: "power2.out" }, 0);

    // ── Intro : logo + nom (lettres en serif qui se dévoilent) ──
    tl.fromTo("#logo", { opacity: 0, scale: 0.6, filter: "blur(20px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out" }, T.logo);
    const nom = $("nom");
    nom.innerHTML = "GIRESSE".split("").map((l) => `<span>${l}</span>`).join("");
    tl.fromTo("#nom span", { opacity: 0, y: 40, filter: "blur(12px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power3.out", stagger: 0.09 }, T.nom);
    tl.to("#logo", { scale: 0.5, y: -300, duration: 0.5, ease: "power3.inOut" }, T.chips - 0.2);
    tl.to("#nom", { scale: 0.6, y: -330, duration: 0.5, ease: "power3.inOut" }, T.chips - 0.2);

    // ── Pilules qui claquent sur les temps, le curseur clique « Coder » ──
    const zoneP = $("pilules");
    zoneP.style.top = "880px";
    const pils = PILULES.map(([nomP, ic]) => {
      const p = document.createElement("div");
      p.className = "pilule";
      p.innerHTML = `<svg viewBox="0 0 24 24">${ic}</svg>${nomP}`;
      zoneP.appendChild(p);
      return p;
    });
    const quand = [T.temps[0], T.temps[1], T.temps[2], T.temps[3], T.temps[3] + 0.12];
    pils.forEach((p, i) => tl.fromTo(p, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.5)" }, quand[i]));
    const coder = pils[1];
    const r = coder.getBoundingClientRect();
    const pointeur = $("pointeur");
    pointeur.innerHTML = POINTEUR;
    tl.fromTo(pointeur, { x: 860, y: 1500, opacity: 0 }, { x: r.left + r.width / 2 - 8, y: r.top + r.height / 2 - 4, opacity: 1, duration: 0.6, ease: "power2.out" }, T.survol - 0.5);
    tl.to(coder, { backgroundColor: "rgba(255,122,26,0.28)", boxShadow: "0 0 44px rgba(255,160,60,0.95), inset 0 0 20px rgba(255,170,90,0.5)", duration: 0.15 }, T.survol);
    tl.to(pointeur, { scale: 0.85, duration: 0.06, yoyo: true, repeat: 1 }, T.clic - 0.03);
    tl.to(coder, { scale: 0.92, duration: 0.06, yoyo: true, repeat: 1 }, T.clic - 0.03);
    tl.to(pointeur, { opacity: 0, duration: 0.25 }, T.clic + 0.2);
    tl.to(["#logo", "#nom", "#pilules"], { opacity: 0, y: "-=80", filter: "blur(10px)", duration: 0.3, ease: "power2.in" }, T.clic + 0.05);

    // ── Saisie : apparaît pour chaque demande ──
    const boite = $("saisie");
    boite.style.height = "280px";
    [[T.clic + 0.05, T.pluie1 - 0.05], [T.saisie2 - 0.2, T.bleu + 0.1], [T.saisie3 - 0.15, T.projets[0] - 0.05]].forEach(([a, b]) => {
      tl.fromTo(boite, { opacity: 0, y: 80, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power3.out", immediateRender: false }, a);
      tl.to(boite, { opacity: 0, y: 60, duration: 0.2, ease: "power2.in" }, b);
    });
    tl.set(boite, { opacity: 0 }, 0);
    [T.envoi1, T.envoi2, T.saisie3Fin + 0.08].forEach((t) => tl.to("#saisie-envoyer", { scale: 0.82, duration: 0.07, yoyo: true, repeat: 1 }, t - 0.05));

    // ── Pluie de code (transition) ──
    [[T.pluie1, T.carte], [T.pluie2, T.fin]].forEach(([a, b]) => {
      tl.fromTo(pluie, { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(3px)", duration: 0.25, immediateRender: false }, a);
      tl.to(pluie, { opacity: 0, filter: "blur(14px)", duration: 0.3 }, b - 0.3);
    });

    // ── Carte du site en verre, inclinée en 3D ──
    const carte = $("carte");
    tl.fromTo(carte, { opacity: 0, rotationY: -50, rotationX: 18, z: -700, scale: 0.7, filter: "blur(14px)" },
      { opacity: 1, rotationY: -16, rotationX: 7, z: 0, scale: 1, filter: "blur(0px)", duration: 0.65, ease: "power3.out" }, T.carte);
    tl.to(carte, { rotationY: -5, rotationX: 3, duration: T.projets[0] - T.carte - 0.7, ease: "sine.inOut" }, T.carte + 0.65);
    // Pulsation sur les temps forts (montage).
    window.T.st.forEach(([a]) => tl.fromTo(carte, { scale: 1 }, { scale: 1.035, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, a));

    // Fond bleu
    tl.to("#carte-bleu", { opacity: 1, duration: 0.35, ease: "power2.inOut" }, T.bleu);
    tl.to(carte, { borderColor: "rgba(170,200,255,0.75)", boxShadow: "0 0 80px rgba(47,107,255,0.65), 0 40px 100px rgba(0,0,0,0.6)", duration: 0.35 }, T.bleu);
    tl.fromTo("#feu", { filter: "saturate(1.15) hue-rotate(0deg)" }, { filter: "saturate(1.3) hue-rotate(200deg)", duration: 0.5, ease: "power2.inOut", immediateRender: false }, T.bleu);
    tl.to("#feu", { filter: "saturate(1.15) hue-rotate(0deg)", duration: 0.6, ease: "power2.inOut" }, T.fin - 0.4);

    // Compétences qui claquent sur les temps
    const zoneT = $("tags");
    TAGS.forEach((nomT, i) => {
      const e = document.createElement("span");
      e.className = "tag";
      e.textContent = nomT;
      zoneT.appendChild(e);
      tl.fromTo(e, { opacity: 0, scale: 0.4, y: 14 }, { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "back.out(2.6)", immediateRender: false }, T.tags[i]);
    });

    // ── Projets en éventail ──
    tl.to(carte, { scale: 0.78, y: -140, opacity: 0.35, filter: "blur(6px)", duration: 0.4, ease: "power2.inOut" }, T.projets[0] - 0.1);
    const zoneJ = $("projets");
    const EVENTAIL = [{ x: -230, r: -8, y: 40 }, { x: 0, r: 0, y: 0 }, { x: 230, r: 8, y: 40 }];
    PROJETS.forEach(([titre, sous, ic], i) => {
      const c = document.createElement("div");
      c.className = "projet";
      c.innerHTML = `<div class="projet-visuel"><svg viewBox="0 0 100 100" width="170" height="170">${ic}</svg></div><div class="projet-titre">${titre}</div><div class="projet-sous">${sous}</div>`;
      c.style.zIndex = i === 1 ? 3 : 2;
      zoneJ.appendChild(c);
      tl.fromTo(c, { opacity: 0, x: 0, y: 900, rotation: 0, scale: 0.9 },
        { opacity: 1, x: EVENTAIL[i].x, y: EVENTAIL[i].y, rotation: EVENTAIL[i].r, scale: 0.92, duration: 0.45, ease: "power3.out" }, T.projets[i]);
    });
    // Plongée dans le code puis noir.
    tl.to(["#projets", "#carte"], { scale: 2.2, opacity: 0, filter: "blur(20px)", duration: 0.5, ease: "power3.in" }, T.pluie2);

    // ── Fin : logo + « Built with GIRESSE. » en lettres qui tombent ──
    tl.fromTo("#fin-logo", { opacity: 0, scale: 0.3, filter: "blur(14px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.55, ease: "back.out(1.8)" }, T.fin);
    const sig = $("signature");
    sig.innerHTML = "Built with GIRESSE.".split("").map((l) => `<span>${l === " " ? " " : l}</span>`).join("");
    sig.querySelectorAll("span").forEach((s, i) => {
      const rot = ((i * 37) % 50) - 25;
      tl.fromTo(s, { opacity: 0, y: -260 - (i % 4) * 60, rotation: rot, filter: "blur(6px)" },
        { opacity: 1, y: 0, rotation: 0, filter: "blur(0px)", duration: 0.55, ease: "bounce.out" }, T.lettres + i * 0.045);
    });
    tl.to("#fin-logo", { scale: 1.06, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" }, T.lettres + 1.2);
  };
})();
