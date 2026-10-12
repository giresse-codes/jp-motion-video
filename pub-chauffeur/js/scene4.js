// Scène 4 — LA FIN (fin → durée).
// Fond sombre, vagues lumineuses rouges qui ondulent ; le logo tombe avec l'impact sur « JP » ;
// slogan mot par mot ; « Rapide. Sûr. Confortable. » avec écho visuel ; le curseur clique
// « RÉSERVER SUR WHATSAPP → » ; le numéro s'écrit.
// Rules : zoom-blur-transition, logo-impact, word-by-word-reveal, echo-trail, cursor-click, typewriter.

(function () {
  const { groupe, animerGroupe } = window.COMMUN;
  const NUMERO = "+237 655 394 028";
  const POINTEUR = `<svg viewBox="0 0 24 24" width="54" height="54"><path d="M5 2l14 11-6.2.8 3.7 7.3-2.6 1.3-3.6-7.4L5 19z" fill="#fff" stroke="#1d1d1f" stroke-width="1.4" stroke-linejoin="round"/></svg>`;

  window.SCENE4 = function (tl, R) {
    const D = R.duree;

    // ── Fond sombre : arrive en zoom depuis l'éventail ──
    tl.fromTo("#s4-fond", { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" }, R.fin - 0.2);

    // ── Vagues : 22 lignes sinusoïdales, phase animée par le temps (déterministe) ──
    const svg = document.getElementById("s4-vagues");
    const N = 22;
    svg.innerHTML = `<defs><linearGradient id="grad-vague" x1="0" x2="1">
        <stop offset="0" stop-color="#e10600" stop-opacity="0"/><stop offset=".25" stop-color="#ff3b1f" stop-opacity=".9"/>
        <stop offset=".75" stop-color="#ff3b1f" stop-opacity=".9"/><stop offset="1" stop-color="#e10600" stop-opacity="0"/></linearGradient></defs>` +
      Array.from({ length: N }, (_, i) => `<path fill="none" stroke="url(#grad-vague)" stroke-width="${i % 4 === 0 ? 2.4 : 1.2}" opacity="${(0.25 + 0.75 * Math.sin((Math.PI * (i + 1)) / (N + 1))).toFixed(2)}"/>`).join("");
    const lignes = [...svg.querySelectorAll("path")];
    const onde = { t: 0 };
    const majOnde = () => {
      const t = onde.t;
      lignes.forEach((p, i) => {
        let d = "";
        for (let x = 0; x <= 1200; x += 30) {
          const y = 320 + (i - N / 2) * 9 +
            Math.sin(x / 190 + t * 0.9 + i * 0.22) * (46 + i * 2) * Math.sin((Math.PI * x) / 1200) +
            Math.sin(x / 70 - t * 1.4 + i * 0.5) * 8;
          d += (x ? " L" : "M") + x + " " + y.toFixed(1);
        }
        p.setAttribute("d", d);
      });
    };
    tl.fromTo(onde, { t: 0 }, { t: D - R.fin, duration: D - R.fin, ease: "none", onUpdate: majOnde }, R.fin - 0.2);
    majOnde();
    tl.fromTo(svg, { opacity: 0, scaleY: 0.3 }, { opacity: 1, scaleY: 1, duration: 1.1, ease: "power3.out" }, R.fin - 0.1);
    // Les vagues montent en intensité sur « Rapide. Sûr. Confortable. ».
    tl.to(svg, { scaleY: 1.25, duration: 0.5, ease: "power2.out" }, R.rapide - 0.1);

    // ── Logo : impact sur « JP » ──
    const logo = document.getElementById("s4-logo");
    tl.fromTo(logo, { scale: 1.6, opacity: 0, filter: "blur(18px)" },
      { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.45, ease: "power4.out" }, R.fin - 0.05);
    tl.fromTo(logo, { y: 0 }, { y: -8, duration: 0.09, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, R.fin + 0.38);

    // ── Slogan mot par mot ──
    const zone = document.getElementById("s4-slogan");
    const g = groupe(zone, "phrase slogan", "Votre chauffeur privé, où vous voulez, quand vous voulez.", 0, "privé,");
    animerGroupe(tl, g, { entree: g.debut - 0.2, couleur: "#fbf8f3" });
    tl.fromTo(g.el, { y: 24, filter: "blur(8px)" }, { y: 0, filter: "blur(0px)", duration: 0.5, ease: "power3.out", immediateRender: false }, g.debut - 0.2);

    // ── Rapide. Sûr. Confortable. : chaque mot claque, avec un écho qui s'éloigne ──
    const mots = [...document.querySelectorAll("#s4-trio span")];
    [R.rapide, R.sur, R.confortable].forEach((t, i) => {
      const m = mots[i];
      const modele = m.cloneNode(true); // fantômes clonés avant tout ajout
      tl.fromTo(m, { opacity: 0, scale: 1.5, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.35, ease: "power3.out" }, t - 0.03);
      // Écho visuel : deux fantômes qui s'agrandissent et s'effacent (comme l'écho sur la voix).
      [0.3, 0.6].forEach((retard, k) => {
        const fantome = modele.cloneNode(true);
        fantome.classList.add("echo");
        fantome.style.position = "absolute";
        m.style.position = "relative";
        fantome.style.left = "0";
        fantome.style.top = "0";
        fantome.style.margin = "0";
        m.appendChild(fantome);
        tl.fromTo(fantome, { opacity: 0, scale: 1 }, { opacity: 0.28 - k * 0.1, scale: 1.08 + k * 0.08, duration: 0.05, immediateRender: false }, t + retard);
        tl.to(fantome, { opacity: 0, scale: 1.2 + k * 0.1, duration: 0.45, ease: "power2.out" }, t + retard + 0.05);
      });
    });

    // ── Bouton cliqué, puis numéro ──
    const bouton = document.getElementById("s4-bouton");
    tl.fromTo(bouton, { y: 40, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.8)" }, R.confortable + 0.5);
    const pointeur = document.getElementById("s4-pointeur");
    pointeur.innerHTML = POINTEUR;
    tl.fromTo(pointeur, { x: 900, y: 1500, opacity: 0 }, { x: 600, y: 1150, opacity: 1, duration: 0.55, ease: "power2.out" }, R.bouton - 0.6);
    tl.to(pointeur, { scale: 0.85, duration: 0.07, yoyo: true, repeat: 1 }, R.bouton - 0.03);
    tl.to(bouton, { scale: 0.95, duration: 0.07, yoyo: true, repeat: 1 }, R.bouton - 0.03);
    tl.fromTo(bouton, { boxShadow: "0 0 60px rgba(225,6,0,0.35)" }, { boxShadow: "0 0 110px rgba(255,59,31,0.75)", duration: 0.25, yoyo: true, repeat: 1, immediateRender: false }, R.bouton);
    tl.to(pointeur, { x: 760, y: 1480, opacity: 0, duration: 0.5, ease: "power2.in" }, R.bouton + 0.5);
    const numero = document.getElementById("s4-numero");
    const frappe = { n: 0 };
    const majNumero = () => (numero.textContent = NUMERO.slice(0, Math.round(frappe.n)));
    tl.fromTo(frappe, { n: 0 }, { n: NUMERO.length, duration: 0.8, ease: "none", onUpdate: majNumero }, R.numero);
    majNumero();
    // Respiration finale du bouton jusqu'à la fin.
    tl.to(bouton, { scale: 1.03, duration: 0.8, yoyo: true, repeat: 2, ease: "sine.inOut" }, R.numero + 0.9);
  };
})();
