// Scène 2 — le problème, puis la solution (≈ 5,0 → 11,4 s).
// Rules : 3d-camera-flight (plongée sur le carrefour, poursuite du véhicule JP),
// chromatic-glitch (mots du problème), svg-icon-enrichment (horloges qui tournent),
// spring-pop-entrance (icônes), motion-blur-streak (traînée néon du véhicule JP).

(function () {
  const { mot } = window.TEMPS;

  window.SCENE2 = function (tl, ctx) {
    const { ville, camera } = ctx;
    const { viser } = window.CAMERA;
    const { cam, appliquer } = camera;
    const { vehicule, panneau, el } = window.VILLE;
    const sol = document.getElementById("sol");
    const C = { x: 1550, y: 1700 }; // le carrefour

    const T = {
      plongee: ctx.T1.sortie,
      douala: mot("Douala"),
      bouchons: mot("embouteillages"),
      retards: mot("retards"),
      nous: mot("Nous"),
      changer: mot("changer"),
      ca: mot("ça"),
    };
    T.fin = T.ca + 0.75;

    // ── Caméra ──
    const POSE_CARREFOUR = viser(C.x, C.y, { s: 1.2, rx: 50, rz: 12, oy: 300 });
    const POSE_TENSION = viser(C.x, C.y + 20, { s: 1.32, rx: 48, rz: 16, oy: 320 });
    const POSE_SUIVI = viser(C.x, C.y + 120, { s: 1.25, rx: 50, rz: 10, oy: 260 });
    const POSE_SORTIE = viser(1220, C.y, { s: 1.15, rx: 52, rz: -6, oy: 260 });
    tl.to(cam, { ...POSE_CARREFOUR, duration: 0.95, ease: "power4.out", onUpdate: appliquer }, T.plongee);
    // Lente poussée pendant le problème : la tension monte.
    tl.to(cam, { ...POSE_TENSION, duration: T.nous - (T.plongee + 0.95), ease: "sine.inOut", onUpdate: appliquer }, T.plongee + 0.95);
    tl.to(cam, { ...POSE_SUIVI, duration: T.changer - T.nous, ease: "power2.inOut", onUpdate: appliquer }, T.nous);
    tl.to(cam, { ...POSE_SORTIE, duration: T.fin - T.changer + 0.4, ease: "power2.inOut", onUpdate: appliquer }, T.changer);

    // ── Le trafic ordinaire laisse place au bouchon ──
    ville.vehicules.trafic.forEach((v) => {
      if (v.voie <= 1) tl.to(v.el, { opacity: 0, duration: 0.2 }, T.plongee + 0.3);
    });

    // Files de voitures bloquées sur les quatre approches.
    const files = [];
    const approches = [
      { axe: "x", voie: C.y + 14, depart: C.x - 70, pas: -54, sens: 1 }, // depuis l'ouest
      { axe: "x", voie: C.y - 14, depart: C.x + 70, pas: 54, sens: -1 }, // depuis l'est
      { axe: "y", voie: C.x - 14, depart: C.y - 70, pas: -54, sens: 1 }, // depuis le nord
      { axe: "y", voie: C.x + 14, depart: C.y + 70, pas: 54, sens: -1 }, // depuis le sud
    ];
    approches.forEach((a, ia) => {
      for (let k = 0; k < 7; k++) {
        const p = a.depart + a.pas * k;
        const x = a.axe === "x" ? p : a.voie;
        const y = a.axe === "x" ? a.voie : p;
        const v = vehicule(sol, x, y, ["gris", "blanc", "bleu", "gris"][(k + ia) % 4], a.axe);
        const stop = el("div", "stop");
        v.appendChild(stop);
        files.push({ el: v, stop, axe: a.axe, sens: a.sens, rang: k, approche: ia });
      }
    });
    files.forEach((f, i) => {
      tl.fromTo(f.el, { opacity: 0 }, { opacity: 1, duration: 0.25 }, T.plongee + 0.2 + (i % 7) * 0.02);
      // Feux stop qui clignotent nerveusement.
      tl.fromTo(f.stop, { opacity: 0.25 }, { opacity: 1, duration: 0.35, ease: "sine.inOut", yoyo: true, repeat: 7, immediateRender: false }, T.plongee + 0.4 + (i % 5) * 0.07);
      // Le bouchon avance de quelques centimètres par à-coups.
      const prop = f.axe === "x" ? "x" : "y";
      tl.fromTo(f.el, { [prop]: 0 }, { [prop]: f.sens * 10, duration: 0.5, ease: "power2.inOut", immediateRender: false }, T.bouchons + (i % 4) * 0.15);
      // Feu vert : les files repartent, de l'avant vers l'arrière (onde de démarrage).
      tl.to(f.el, { [prop]: f.sens * 900, duration: 2.2, ease: "power2.in" }, T.changer + 0.15 + f.rang * 0.07 + f.approche * 0.04);
      tl.to(f.stop, { opacity: 0, duration: 0.2 }, T.changer + 0.1 + f.rang * 0.07);
    });

    // ── Icônes de stress au-dessus du bouchon (horloges, alertes) ──
    const horloge = (taille) => `<svg viewBox="0 0 100 100" width="${taille}" height="${taille}">
      <circle cx="50" cy="50" r="44" fill="#ffffff" stroke="#F28C38" stroke-width="8"/>
      <line class="aiguille-g" x1="50" y1="50" x2="50" y2="18" stroke="#14213D" stroke-width="7" stroke-linecap="round"/>
      <line class="aiguille-p" x1="50" y1="50" x2="70" y2="50" stroke="#F28C38" stroke-width="7" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="6" fill="#14213D"/></svg>`;
    const alerte = (taille) => `<svg viewBox="0 0 100 100" width="${taille}" height="${taille}">
      <path d="M50 6 L96 88 L4 88 Z" fill="#F4B942" stroke="#ffffff" stroke-width="5" stroke-linejoin="round"/>
      <rect x="45" y="34" width="10" height="30" rx="4" fill="#14213D"/><circle cx="50" cy="75" r="6" fill="#14213D"/></svg>`;
    const icones = [
      panneau(sol, C.x - 260, C.y + 14, 120, horloge(120), "icone"),
      panneau(sol, C.x + 250, C.y - 14, 150, alerte(110), "icone"),
      panneau(sol, C.x - 14, C.y - 270, 135, horloge(110), "icone"),
      panneau(sol, C.x + 14, C.y + 300, 125, alerte(100), "icone"),
    ];
    icones.forEach((ic, i) => {
      const a = i % 2 ? T.retards : T.bouchons;
      tl.fromTo(ic, { "--p": 0 }, { "--p": 1, duration: 0.45, ease: "back.out(2.4)" }, a + i * 0.08);
      tl.fromTo(ic, { "--p": 1 }, { "--p": 1.18, duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: 5, immediateRender: false }, a + 0.5 + i * 0.08);
      tl.to(ic, { "--p": 0, duration: 0.3, ease: "back.in(2)" }, T.changer + i * 0.05);
      const aig = ic.querySelector(".aiguille-g");
      if (aig) {
        aig.style.transformOrigin = "50px 50px";
        tl.fromTo(aig, { rotation: 0 }, { rotation: 1440, duration: T.changer - a, ease: "none", svgOrigin: "50 50" }, a);
      }
    });

    // ── Le véhicule JP se faufile entre les files, puis tourne vers l'ouest ──
    const jp = ville.vehicules.heros; // posé en (1550, 2150), orienté sur l'axe y
    const trainee1 = el("div", "trainee", { left: C.x - 3 + "px", top: C.y + "px", width: "6px", height: "450px" });
    const trainee2 = el("div", "trainee", { left: "1000px", top: C.y - 17 + "px", width: C.x - 1000 + "px", height: "6px" });
    sol.append(trainee1, trainee2);
    trainee1.style.transformOrigin = "50% 100%";
    trainee2.style.transformOrigin = "100% 50%";
    tl.fromTo(jp, { y: 0 }, { y: -450, duration: T.changer - T.nous + 0.1, ease: "power2.inOut" }, T.nous);
    tl.fromTo(trainee1, { scaleY: 0 }, { scaleY: 1, duration: T.changer - T.nous + 0.1, ease: "power2.inOut" }, T.nous);
    // Petits écarts de trajectoire : il se faufile.
    tl.to(jp, { x: 10, duration: 0.18, ease: "sine.inOut", yoyo: true, repeat: 3 }, T.nous + 0.1);
    tl.to(jp, { rotation: 90, duration: 0.3, ease: "power2.inOut" }, T.changer + 0.05);
    tl.to(jp, { x: -540, y: -461, duration: 1.6, ease: "power2.in" }, T.changer + 0.2);
    tl.fromTo(trainee2, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power2.in" }, T.changer + 0.2);
    tl.to([trainee1, trainee2], { opacity: 0.35, duration: 1.2 }, T.fin);

    // ── Les feux passent au vert en cascade ──
    ville.feux.forEach((f, i) => {
      const r = f.querySelector(".feu-r");
      const v = f.querySelector(".feu-v");
      tl.to(r, { opacity: 0.15, duration: 0.08 }, T.changer + i * 0.06);
      tl.fromTo(v, { backgroundColor: "#2a3a2e", boxShadow: "0 0 0px rgba(61,220,132,0)" }, { backgroundColor: "#3ddc84", boxShadow: "0 0 16px rgba(61,220,132,1)", duration: 0.12, immediateRender: false }, T.changer + i * 0.06);
    });

    // ── Textes ──
    tl.fromTo("#s2-lieu", { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, T.douala - 0.1);
    // Glitch d'entrée : décalages rouge/blanc pilotés par le temps quantifié (déterministe).
    const glitch = (sel, t0) => {
      const etat = { k: 0 };
      tl.fromTo(
        etat,
        { k: 0 },
        {
          k: 1,
          duration: 0.4,
          ease: "none",
          immediateRender: false,
          onUpdate() {
            const pas = Math.floor(etat.k * 10);
            const d = etat.k >= 1 ? 0 : ((pas * 37) % 11) - 5;
            document.querySelector(sel).style.textShadow =
              d === 0 ? "" : `${d * 3}px 0 rgba(242,140,56,0.9), ${-d * 2}px 0 rgba(46,196,182,0.7)`;
          },
        },
        t0,
      );
    };
    tl.fromTo("#s2-mot-1", { x: -120, skewX: 18, opacity: 0 }, { x: 0, skewX: 0, opacity: 1, duration: 0.4, ease: "power4.out" }, T.bouchons - 0.05);
    glitch("#s2-mot-1", T.bouchons - 0.05);
    tl.fromTo("#s2-mot-2", { scale: 1.8, opacity: 0, filter: "blur(12px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.4, ease: "power4.out" }, T.retards - 0.05);
    glitch("#s2-mot-2", T.retards - 0.05);
    tl.fromTo("#s2-horloge .aiguille", { rotation: 0 }, { rotation: 720, duration: T.nous - T.retards, ease: "none", svgOrigin: "50 50" }, T.retards);
    // Le problème est balayé.
    tl.to(["#s2-mot-1", "#s2-mot-2", "#s2-lieu"], { x: -900, opacity: 0, duration: 0.45, ease: "power3.in", stagger: 0.06 }, T.nous - 0.35);
    tl.fromTo("#s2-reponse-1", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, T.nous);
    tl.fromTo("#s2-reponse-2", { scale: 0.4, opacity: 0, rotation: -6 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.55, ease: "back.out(2)" }, T.changer);
    tl.fromTo("#s2-flash", { opacity: 0.3 }, { opacity: 0, duration: 0.3, immediateRender: false }, T.changer);
    tl.to(["#s2-reponse-1", "#s2-reponse-2"], { y: -80, opacity: 0, duration: 0.4, ease: "power2.in" }, T.fin);

    return T;
  };
})();
