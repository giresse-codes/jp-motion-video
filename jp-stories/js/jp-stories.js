// JP Stories — composants réutilisables de la série (voir frame.md).
// Chaque composant crée son DOM et ajoute ses tweens à la timeline GSAP passée en premier argument :
// tout reste déterministe et sûr en recherche avant/arrière (aucun setTimeout, aucun Math.random).
// Composants : texteSurligne, depuisTranscription, montre, horloge, telephone, notification, conversation, pancarte,
// noteManuscrite, outroJP. Aides de plan : fondu, zoomLent, respiration, clignement, flouAvant.

(function () {
  const NS = "http://www.w3.org/2000/svg";
  const C = { encre: "#1A1A1A", moutarde: "#F2C230", carte: "#FBF7EE", creme: "#F6EEDF", brun: "#3B2E25" };
  const svg = (parent, nom, attrs) => {
    const el = document.createElementNS(NS, nom);
    Object.entries(attrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
    parent.appendChild(el);
    return el;
  };
  const div = (parent, classe, html) => {
    const el = document.createElement("div");
    if (classe) el.className = classe;
    if (html != null) el.innerHTML = html;
    parent.appendChild(el);
    return el;
  };
  const $ = (cible) => (typeof cible === "string" ? document.querySelector(cible) : cible);

  // ═══════════════ TexteSurligne ═══════════════
  // Mots répartis au prorata de leur longueur entre `debut` et `fin` d'une phrase (repli sans transcription).
  function repartir(debut, fin, texte) {
    const mots = texte.split(" ").filter(Boolean);
    const poids = mots.map((m) => Math.max(m.replace(/[^\p{L}\d]/gu, "").length, 3) + 2);
    const total = poids.reduce((a, b) => a + b, 0);
    let t = debut;
    return mots.map((m, i) => {
      const d = t;
      t += ((fin - debut) * poids[i]) / total;
      return { text: m.replace("*", ""), start: d, end: t, cle: m.includes("*") }; // « * » où que ce soit dans le mot
    });
  }

  // Transforme une transcription (`hyperframes transcribe` ou scripts/transcrire.py : { words: [{text,start,end}] })
  // en phrases prêtes pour texteSurligne, entre `de` et `a`. `cles` : mots à surligner (sans accents ni ponctuation requis).
  function depuisTranscription(transcription, { de, a, cles = [] }) {
    const norme = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\p{L}\d]/gu, "");
    const voulus = cles.map(norme);
    const mots = (transcription.words || transcription).filter((w) => w.start >= de - 0.05 && w.start < a);
    const phrases = [];
    let cour = [];
    mots.forEach((w) => {
      cour.push({ text: w.text.trim(), start: w.start, end: w.end, cle: voulus.includes(norme(w.text)) });
      if (/[.!?…]$/.test(w.text.trim())) { phrases.push(cour); cour = []; }
    });
    if (cour.length) phrases.push(cour);
    return phrases;
  }

  // Bloc de texte en haut à gauche, mot par mot, mot clé surligné par un trait moutarde qui se dessine.
  // phrases : [[debut, fin, "texte avec *motclé"], ...] ou sortie de depuisTranscription.
  // classe : "" (défaut) | "clair" (fond brun) | "seul" (papier vierge) | "centre" (phrase clé).
  function texteSurligne(tl, { parent = "#legendes", de, a, phrases, classe = "" }) {
    const bloc = div($(parent), "jp-bloc " + classe);
    if (de <= 0) gsap.set(bloc, { opacity: 1 }); // hook lisible dès l'image 1
    else tl.fromTo(bloc, { opacity: 0 }, { opacity: 1, duration: 0.01, immediateRender: false }, de);
    if (a != null) tl.to(bloc, { opacity: 0, y: -16, duration: 0.35, ease: "power2.in" }, a - 0.35);
    phrases.forEach((p) => {
      const mots = typeof p[0] === "number" ? repartir(p[0], p[1], p[2]) : p;
      const ligne = div(bloc, "jp-phrase");
      mots.forEach((w) => {
        const s = document.createElement("span");
        s.className = "jp-mot" + (w.cle ? " jp-cle" : "");
        s.innerHTML = (w.cle ? '<i class="jp-trait"></i>' : "") + w.text;
        ligne.appendChild(s);
        if (w.start <= 0 && w.end <= 0.01) gsap.set(s, { opacity: 1 });
        else tl.fromTo(s, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out", immediateRender: false }, w.start);
        // Mot clé déjà affiché à l'image 1 : son trait est déjà tracé (sinon, sur fond brun ou noir, le mot reste invisible).
        if (w.cle && w.start <= 0 && w.end <= 0.01) gsap.set(s.querySelector(".jp-trait"), { scaleX: 1, rotation: -1 });
        else if (w.cle) {
          tl.fromTo(s.querySelector(".jp-trait"), { scaleX: 0, rotation: -1 }, { scaleX: 1, rotation: -1, duration: 0.45, ease: "power2.out", immediateRender: false },
            Math.max(w.start, 0.6));
        }
      });
    });
    return bloc;
  }

  // ═══════════════ Montre (gros plan) ═══════════════
  // Aiguilles de `depart` à `arrivee` ([h, min]) entre `de` et `a` ; l'anneau moutarde se remplit avec le temps.
  function montre(tl, { parent, x = 140, y = 640, taille = 800, de = 0, a, depart = [9, 50], arrivee = [9, 59.7], anneau = true, zoom = 1.1 }) {
    const el = svg($(parent), "svg", { class: "jp-montre", viewBox: "-400 -400 800 800", width: taille, height: taille });
    el.style.left = x + "px"; el.style.top = y + "px";
    const L = 2 * Math.PI * 350;
    const cercle = anneau ? svg(el, "circle", { r: 350, fill: "none", stroke: C.moutarde, "stroke-width": 26, "stroke-linecap": "round", transform: "rotate(-90)", "stroke-dasharray": `${L} ${L}` }) : null;
    if (anneau) svg(el, "circle", { r: 350, fill: "none", stroke: "rgba(26,26,26,.08)", "stroke-width": 26 });
    svg(el, "circle", { r: 300, fill: C.carte, stroke: C.encre, "stroke-width": 14 });
    for (let i = 0; i < 60; i++) svg(el, "rect", { x: i % 5 ? -2 : -5, y: -280, width: i % 5 ? 4 : 10, height: i % 5 ? 16 : 36, fill: C.encre, transform: `rotate(${i * 6})` });
    [["12", 0, -205], ["3", 210, 22], ["6", 0, 240], ["9", -210, 22]].forEach(([n, tx, ty]) => {
      svg(el, "text", { x: tx, y: ty, "text-anchor": "middle", "font-family": "Inter", "font-weight": 700, "font-size": 64, fill: C.encre }).textContent = n;
    });
    const h = svg(el, "rect", { x: -10, y: -150, width: 20, height: 170, rx: 10, fill: C.encre });
    const m = svg(el, "rect", { x: -7, y: -235, width: 14, height: 255, rx: 7, fill: C.encre });
    const s = svg(el, "rect", { x: -2.5, y: -250, width: 5, height: 290, fill: C.moutarde });
    svg(el, "circle", { r: 16, fill: C.moutarde });
    const d0 = depart[0] * 60 + depart[1], d1 = arrivee[0] * 60 + arrivee[1];
    const temps = { v: d0 };
    const maj = () => {
      const v = temps.v, hh = v / 60, mm = v % 60;
      h.setAttribute("transform", `rotate(${(hh % 12) * 30})`);
      m.setAttribute("transform", `rotate(${mm * 6})`);
      s.setAttribute("transform", `rotate(${Math.floor((mm % 1) * 60) * 6})`);
      if (cercle) cercle.setAttribute("stroke-dashoffset", `${L * (1 - (v - d0) / Math.max(1e-6, d1 - d0))}`);
    };
    maj();
    const duree = (a ?? de + 4) - de;
    tl.fromTo(temps, { v: d0 }, { v: d1, duration: duree, ease: "power1.in", onUpdate: maj, immediateRender: de <= 0 }, de);
    tl.fromTo(el, { scale: 1 }, { scale: zoom, duration: duree + 0.3, ease: "none", immediateRender: de <= 0 }, de);
    return el;
  }

  // ═══════════════ Horloge murale ═══════════════
  function horloge(tl, { parent, x = 720, y = 580, taille = 190, heure = [10, 12], de, fond = C.carte }) {
    const el = svg($(parent), "svg", { class: "jp-horloge", viewBox: "-60 -60 120 120", width: taille, height: taille });
    el.style.left = x + "px"; el.style.top = y + "px";
    svg(el, "circle", { r: 54, fill: fond, stroke: C.encre, "stroke-width": 6 }); // fond : teinte du cadran (ex. rouge pâle = retard)
    for (let i = 0; i < 12; i++) svg(el, "rect", { x: -2, y: -48, width: 4, height: i % 3 ? 7 : 12, fill: C.encre, transform: `rotate(${i * 30})` });
    svg(el, "rect", { x: -3, y: -26, width: 6, height: 30, rx: 3, fill: C.encre, transform: `rotate(${(heure[0] + heure[1] / 60) * 30})` });
    svg(el, "rect", { x: -2, y: -40, width: 4, height: 44, rx: 2, fill: C.encre, transform: `rotate(${heure[1] * 6})` });
    svg(el, "circle", { r: 5, fill: C.moutarde });
    if (de != null) tl.fromTo(el, { scale: 0, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2)", immediateRender: de <= 0 }, de);
    return el;
  }

  // ═══════════════ Téléphone / Notification ═══════════════
  // Une notification seule (bannière), ou empilée dans un téléphone via telephone().
  function notification(tl, { parent, x, y, largeur = 600, t, appli = "•", couleur = "#3D5BD9", titre, texte, heure = "maintenant", libre = true }) {
    const el = div($(parent), "jp-notif" + (libre ? " libre" : ""),
      `<i style="background:${couleur}">${appli}</i><div><b>${titre}</b><span>${texte}</span></div><em>${heure}</em>`);
    if (libre) { el.style.left = x + "px"; el.style.top = y + "px"; el.style.width = largeur + "px"; }
    tl.fromTo(el, { opacity: 0, y: -80, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.7)", immediateRender: t <= 0 }, t);
    return el;
  }
  // Téléphone posé (écran verrouillé) ; les notifications arrivent en haut et poussent les précédentes.
  function telephone(tl, { parent, x = 280, y = 560, largeur = 520, heure = "09:42", date = "Mardi", de, notifications = [] }) {
    const tel = div($(parent), "jp-telephone");
    Object.assign(tel.style, { left: x + "px", top: y + "px", width: largeur + "px", height: Math.round(largeur * 2.05) + "px" });
    const ecran = div(tel, "jp-ecran", `<div class="jp-encoche"></div><div class="jp-heure">${heure}</div><div class="jp-date">${date}</div>`);
    if (de != null) tl.fromTo(tel, { opacity: 0, y: 160, rotation: 4 }, { opacity: 1, y: 0, rotation: 0, duration: 0.7, ease: "back.out(1.4)", immediateRender: de <= 0 }, de);
    const pas = 150, haut = 300;
    const elts = notifications.map((n) => {
      const el = notification(tl, { ...n, parent: ecran, libre: false });
      el.style.top = haut + "px";
      return el;
    });
    // Les précédentes descendent d'un cran à chaque arrivée.
    notifications.forEach((n, k) => { for (let j = 0; j < k; j++) tl.to(elts[j], { y: (k - j) * pas, duration: 0.5, ease: "back.out(1.4)" }, n.t); });
    // Vibration à chaque notification.
    notifications.forEach((n) => tl.fromTo(tel, { x: 0 }, { keyframes: [{ x: -8, duration: 0.04 }, { x: 8, duration: 0.05 }, { x: -5, duration: 0.05 }, { x: 0, duration: 0.05 }], immediateRender: false }, n.t));
    return tel;
  }

  // ═══════════════ Conversation (gros plan téléphone, messagerie générique) ═══════════════
  // messages : [{ t, texte, moi }] ; ecrit : [[debut, fin]] = trois points qui clignotent (l'autre écrit).
  function conversation(tl, { parent, x = 250, y = 520, largeur = 580, de, contact = "JP Service", messages = [], ecrit = [] }) {
    const tel = div($(parent), "jp-telephone");
    Object.assign(tel.style, { left: x + "px", top: y + "px", width: largeur + "px", height: Math.round(largeur * 2.0) + "px" });
    const ecran = div(tel, "jp-ecran jp-chat",
      `<div class="jp-encoche"></div><div class="jp-chat-tete"><i>${contact.slice(0, 2).toUpperCase()}</i><div><b>${contact}</b><span>en ligne</span></div></div>`);
    const fil = div(ecran, "jp-fil");
    if (de != null) tl.fromTo(tel, { opacity: 0, y: 160, rotation: 4 }, { opacity: 1, y: 0, rotation: 0, duration: 0.7, ease: "back.out(1.4)", immediateRender: de <= 0 }, de);
    const evts = [...messages.map((m) => ({ t: m.t, m })), ...ecrit.map(([a, b]) => ({ t: a, points: [a, b] }))].sort((a, b) => a.t - b.t);
    evts.forEach((e) => {
      if (e.m) {
        const b = div(fil, "jp-bulle " + (e.m.moi ? "moi" : "lui"), e.m.texte);
        tl.fromTo(b, { opacity: 0, y: 30, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(2)", transformOrigin: e.m.moi ? "100% 100%" : "0% 100%", immediateRender: e.t <= 0 }, e.t);
      } else {
        const b = div(fil, "jp-bulle lui jp-points", "<i></i><i></i><i></i>");
        const [a, z] = e.points;
        tl.fromTo(b, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.25, immediateRender: a <= 0 }, a);
        Array.from(b.children).forEach((p, i) => tl.fromTo(p, { opacity: 0.25 }, { opacity: 1, duration: 0.3, repeat: Math.max(1, Math.floor((z - a) / 0.3) - 1), yoyo: true, ease: "sine.inOut", immediateRender: false }, a + i * 0.15));
        tl.set(b, { display: "none" }, z);
      }
    });
    return tel;
  }

  // ═══════════════ Pancarte (chauffeur qui attend) ═══════════════
  function pancarte(tl, { parent, x = 240, y = 760, largeur = 600, texte = "M. Serge", sousTexte = "JP Service", de, a }) {
    const el = div($(parent), "jp-pancarte", `<div class="jp-planche"><b>${texte}</b><span>${sousTexte}</span></div><div class="jp-mains"><i></i><i></i></div>`);
    el.style.left = x + "px"; el.style.top = y + "px"; el.style.width = largeur + "px";
    if (de != null) tl.fromTo(el, { opacity: 0, y: 200, rotation: -6 }, { opacity: 1, y: 0, rotation: 0, duration: 0.7, ease: "back.out(1.6)", immediateRender: de <= 0 }, de);
    // Léger balancement : la pancarte est tenue à bout de bras.
    const d = (a ?? de + 3) - de - 0.7;
    if (d > 0) tl.fromTo(el, { rotation: 0 }, { rotation: 2, duration: Math.min(0.9, d / 2), repeat: Math.max(1, Math.floor(d / 0.9) - 1), yoyo: true, ease: "sine.inOut", immediateRender: false }, de + 0.7);
    return el;
  }

  // ═══════════════ Note manuscrite (Caveat) ═══════════════
  function noteManuscrite(tl, { parent, x, y, largeur = 400, titre, lignes = [], t }) {
    const el = div($(parent), "jp-note", (titre ? `<div class="jp-note-titre">${titre}</div>` : "") + lignes.map((l) => `<div>${l}</div>`).join(""));
    Object.assign(el.style, { left: x + "px", top: y + "px", width: largeur + "px" });
    tl.fromTo(el, { opacity: 0, y: 120, rotation: 4 }, { opacity: 1, y: 0, rotation: -4, duration: 0.6, ease: "back.out(1.6)", immediateRender: t <= 0 }, t);
    return el;
  }

  // ═══════════════ OutroJP (1,5 s) ═══════════════
  function outroJP(tl, { parent = "#camera", de, embleme = "assets/images/embleme-jp.png", whatsapp = "+237 655 394 028", badge = null }) {
    const el = div($(parent), "jp-outro");
    div(el, "jp-papier");
    const sig = svg(el, "svg", { class: "jp-signature", viewBox: "-220 -220 440 440", width: 440, height: 440 });
    svg(sig, "circle", { r: 180, fill: "#121212" });
    const LS = 2 * Math.PI * 200;
    const cercle = svg(sig, "circle", { r: 200, fill: "none", stroke: C.moutarde, "stroke-width": 18, "stroke-linecap": "round", transform: "rotate(-100)", "stroke-dasharray": `${LS} ${LS}` });
    const img = document.createElement("img"); img.className = "jp-embleme"; img.src = embleme; el.appendChild(img);
    const marque = div(el, "jp-marque", "JP Service Express <span>Urbaine</span>");
    const ville = div(el, "jp-douala", "Chauffeur privé · Douala");
    const bouton = div(el, "jp-bouton", `WhatsApp · ${whatsapp}`);
    // Badge d'offre facultatif (ex. « Transfert aéroport dès 8 000 FCFA »), posé au-dessus du cercle.
    const offre = badge ? div(el, "jp-badge-offre", badge) : null;
    if (offre) tl.fromTo(offre, { opacity: 0, scale: 0.6, rotation: -6 }, { opacity: 1, scale: 1, rotation: -3, duration: 0.4, ease: "back.out(2.4)", immediateRender: false }, de + 0.3);
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out", immediateRender: false }, de - 0.15);
    tl.fromTo(cercle, { attr: { "stroke-dashoffset": LS } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.6, ease: "power2.inOut", immediateRender: false }, de);
    tl.fromTo(img, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }, de + 0.2);
    tl.fromTo([marque, ville], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.1, ease: "power2.out", immediateRender: false }, de + 0.4);
    tl.fromTo(bouton, { opacity: 0, y: 40, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }, de + 0.7);
    tl.fromTo(bouton, { scale: 1 }, { scale: 1.04, duration: 0.2, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, de + 1.1);
    return el;
  }

  // ═══════════════ Aides de plan ═══════════════
  // Fondu enchaîné avec léger glissement de caméra (jamais de coupe brute).
  function fondu(tl, plan, de, a, { premier = false, dernier = false, glisse = 40 } = {}) {
    plan = $(plan);
    if (premier) gsap.set(plan, { opacity: 1 });
    else tl.fromTo(plan, { opacity: 0, x: glisse }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", immediateRender: false }, de - 0.3);
    if (!dernier) tl.to(plan, { opacity: 0, x: -glisse, duration: 0.6, ease: "power2.in" }, a - 0.3);
  }
  // Zoom lent et continu vers le sujet (origine = point du sujet, en %).
  function zoomLent(tl, el, de, a, { depart = 1.02, arrivee = 1.12, origine = "50% 40%" } = {}) {
    tl.fromTo($(el), { scale: depart, transformOrigin: origine }, { scale: arrivee, duration: a - de + 0.6, ease: "none", immediateRender: de <= 0 }, de - 0.3);
  }
  // Respiration : la couche (personnage détouré) gonfle très légèrement, ancrée en bas.
  function respiration(tl, el, de, a, { ampleur = 0.012, periode = 1.6 } = {}) {
    const n = Math.max(1, Math.floor((a - de) / (periode / 2)) - 1);
    tl.fromTo($(el), { scaleY: 1 }, { scaleY: 1 + ampleur, transformOrigin: "50% 100%", duration: periode / 2, repeat: n, yoyo: true, ease: "sine.inOut", immediateRender: false }, de);
  }
  // Clignement : paupières (ellipses couleur de peau) posées sur les yeux, coordonnées dans `parent`.
  function clignement(tl, { parent, yeux, couleur = "#7a4b32", largeur = 28, hauteur = 18, temps = [] }) {
    const p = $(parent);
    const paupieres = yeux.map(([x, y]) => {
      const e = div(p, "jp-paupiere");
      Object.assign(e.style, { left: x - largeur / 2 + "px", top: y - hauteur / 2 + "px", width: largeur + "px", height: hauteur + "px", background: couleur });
      return e;
    });
    temps.forEach((t) => tl.fromTo(paupieres, { scaleY: 0 }, { keyframes: [{ scaleY: 1, duration: 0.06 }, { scaleY: 0, duration: 0.09 }], immediateRender: false }, t));
    return paupieres;
  }
  // Premier plan flou (silhouette sombre floutée) pour la profondeur.
  function flouAvant(parent, { x, y, largeur, hauteur, couleur = "#5a4636", rayon = "50%" }) {
    const e = div($(parent), "jp-flou-avant");
    Object.assign(e.style, { left: x + "px", top: y + "px", width: largeur + "px", height: hauteur + "px", background: couleur, borderRadius: rayon });
    return e;
  }

  window.JPStories = { C, svg, repartir, depuisTranscription, texteSurligne, montre, horloge, notification, telephone, conversation, pancarte, noteManuscrite, outroJP,
    fondu, zoomLent, respiration, clignement, flouAvant };
})();
