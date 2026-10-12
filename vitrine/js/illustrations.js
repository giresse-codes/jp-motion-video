// Illustrations vectorielles générées au montage (déterministes) :
// - vue éclatée isométrique du véhicule Confort (4 couches) ;
// - carte stylisée du Cameroun avec les trajets Voyage.

(function () {
  const NS = "http://www.w3.org/2000/svg";

  // Projection isométrique : x vers le bas-droite, y vers le bas-gauche, z vers le haut.
  const C30 = Math.cos(Math.PI / 6);
  const iso = (x, y, z, ox, oy) => [ox + (x - y) * C30, oy + (x + y) * 0.5 - z];
  const pts = (l) => l.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ");

  // Faces visibles d'une boîte (dessus, face avant-gauche, face avant-droite).
  function boite(x, y, z, L, W, H, couleurs, ox, oy) {
    const P = (a, b, c) => iso(a, b, c, ox, oy);
    const dessus = [P(x, y, z + H), P(x + L, y, z + H), P(x + L, y + W, z + H), P(x, y + W, z + H)];
    const gauche = [P(x, y + W, z), P(x + L, y + W, z), P(x + L, y + W, z + H), P(x, y + W, z + H)];
    const droite = [P(x + L, y, z), P(x + L, y + W, z), P(x + L, y + W, z + H), P(x + L, y, z + H)];
    return (
      `<polygon points="${pts(gauche)}" fill="${couleurs[1]}"/>` +
      `<polygon points="${pts(droite)}" fill="${couleurs[2]}"/>` +
      `<polygon points="${pts(dessus)}" fill="${couleurs[0]}"/>`
    );
  }
  function roue(x, y, ox, oy) {
    const [cx, cy] = iso(x, y, 0, ox, oy);
    return `<ellipse cx="${cx}" cy="${cy}" rx="30" ry="22" fill="#0b0c0f" stroke="#454a55" stroke-width="5"/>` +
      `<ellipse cx="${cx}" cy="${cy}" rx="11" ry="8" fill="#9aa0aa"/>`;
  }

  function svg(contenu, w, h) {
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="${NS}">${contenu}</svg>`;
  }

  function vueEclatee() {
    const L = 330, W = 160, ox = 330, oy = 150;
    // Châssis + roues
    let c = roue(40, 0, ox, oy) + roue(L - 50, 0, ox, oy);
    c += boite(0, 0, 0, L, W, 14, ["#2b2e35", "#1b1d22", "#16181d"], ox, oy);
    c += roue(40, W, ox, oy) + roue(L - 50, W, ox, oy);
    document.getElementById("eclate-chassis").innerHTML = svg(c, 700, 460);

    // Caisse rouge (bas de carrosserie) avec bande blanche
    let k = boite(0, 0, 14, L, W, 46, ["#ff2d1f", "#c20500", "#7a0300"], ox, oy);
    const b1 = [iso(0, W, 34, ox, oy), iso(L, W, 34, ox, oy), iso(L, W, 40, ox, oy), iso(0, W, 40, ox, oy)];
    k += `<polygon points="${pts(b1)}" fill="#F5F2F0"/>`;
    // Phares
    const ph = [iso(L, 20, 40, ox, oy), iso(L, 50, 40, ox, oy), iso(L, 50, 50, ox, oy), iso(L, 20, 50, ox, oy)];
    k += `<polygon points="${pts(ph)}" fill="#fff4e6"/>`;
    document.getElementById("eclate-caisse").innerHTML = svg(k, 700, 460);

    // Habitacle : sièges anthracite, surpiqûres rouges, écran multimédia allumé
    let h = boite(20, 18, 60, L - 40, W - 36, 6, ["#d9cfc0", "#c4b8a6", "#b3a690"], ox, oy);
    [[70, 24], [70, 88], [180, 24], [180, 88]].forEach(([x, y]) => {
      h += boite(x, y, 66, 52, 46, 18, ["#f1e4cc", "#dcc9a9", "#c9b38e"], ox, oy);
      h += boite(x, y, 84, 12, 46, 40, ["#e9d9bb", "#d2bd98", "#bfa67d"], ox, oy);
      const s = [iso(x + 2, y + 22, 85, ox, oy), iso(x + 50, y + 22, 85, ox, oy)];
      h += `<line x1="${s[0][0]}" y1="${s[0][1]}" x2="${s[1][0]}" y2="${s[1][1]}" stroke="#2bb5a8" stroke-width="2"/>`;
    });
    // Tableau de bord + écran
    h += boite(266, 26, 66, 26, W - 52, 26, ["#2b2e35", "#1b1d22", "#16181d"], ox, oy);
    const ecran = [iso(270, 60, 96, ox, oy), iso(270, 100, 96, ox, oy), iso(270, 100, 122, ox, oy), iso(270, 60, 122, ox, oy)];
    h += `<polygon points="${pts(ecran)}" fill="#2bb5a8" opacity="0.9"/>`;
    document.getElementById("eclate-habitacle").innerHTML = svg(h, 700, 460);

    // Toit + vitrage
    let t = "";
    const vitre = [iso(60, 0, 60, ox, oy), iso(260, 0, 60, ox, oy), iso(230, 10, 120, ox, oy), iso(90, 10, 120, ox, oy)];
    const vitreG = [iso(60, W, 60, ox, oy), iso(260, W, 60, ox, oy), iso(230, W - 10, 120, ox, oy), iso(90, W - 10, 120, ox, oy)];
    t += `<polygon points="${pts(vitreG)}" fill="rgba(245,242,240,0.28)" stroke="#F5F2F0" stroke-width="2"/>`;
    t += boite(90, 10, 120, 140, W - 20, 10, ["#e10600", "#a80400", "#6e0300"], ox, oy);
    const bande = [iso(90, W / 2 - 12, 130, ox, oy), iso(230, W / 2 - 12, 130, ox, oy), iso(230, W / 2 + 12, 130, ox, oy), iso(90, W / 2 + 12, 130, ox, oy)];
    t += `<polygon points="${pts(bande)}" fill="#F5F2F0"/>`;
    t += `<polygon points="${pts(vitre)}" fill="rgba(245,242,240,0.18)" stroke="#F5F2F0" stroke-width="2"/>`;
    document.getElementById("eclate-toit").innerHTML = svg(t, 700, 460);
  }

  // Carte stylisée du Cameroun (frontières simplifiées), projection longitude/latitude.
  function carteCameroun() {
    const P = (lon, lat) => [(lon - 8.2) * 110, (13.3 - lat) * 110];
    const frontiere = [
      [8.5, 4.55], [8.95, 4.05], [9.45, 3.85], [9.8, 3.2], [9.88, 2.7], [9.8, 2.3], [11.35, 2.25], [13.3, 2.18],
      [14.6, 2.1], [15.95, 1.8], [16.2, 2.3], [15.4, 3.7], [14.7, 4.3], [14.6, 5.4], [14.55, 6.2], [15.2, 7.4],
      [15.6, 7.7], [14.8, 8.4], [14.2, 9.4], [14.15, 10.0], [15.05, 10.1], [14.9, 11.0], [14.7, 11.8], [14.5, 12.6],
      [14.3, 13.05], [14.05, 12.5], [14.15, 11.8], [13.7, 11.2], [13.3, 10.5], [13.2, 9.8], [12.8, 9.0], [12.4, 8.4],
      [12.1, 7.5], [11.7, 6.9], [11.1, 6.5], [10.8, 7.0], [10.2, 6.9], [9.7, 6.4], [9.3, 6.1], [8.9, 5.7], [8.8, 5.2],
    ].map(([a, b]) => P(a, b));
    const villes = {
      douala: { nom: "Douala", p: P(9.7, 4.05), dx: -30, dy: 46, ancre: "end" },
      yaounde: { nom: "Yaoundé", p: P(11.52, 3.87), dx: 24, dy: 12, ancre: "start" },
      kribi: { nom: "Kribi", p: P(9.91, 2.94), dx: 26, dy: 34, ancre: "start" },
      bafoussam: { nom: "Bafoussam", p: P(10.42, 5.48), dx: 26, dy: -16, ancre: "start" },
    };
    const d = villes.douala.p;
    const courbe = (b, k) => {
      const mx = (d[0] + b[0]) / 2 + k[0], my = (d[1] + b[1]) / 2 + k[1];
      return `M${d[0].toFixed(1)} ${d[1].toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
    };
    let c = `<defs><filter id="lueur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="f"/><feMerge><feMergeNode in="f"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
    c += `<polygon class="pays-fond" points="${pts(frontiere)}"/>`;
    c += `<polygon class="pays" points="${pts(frontiere)}" pathLength="1"/>`;
    c += `<path class="trajet" id="trajet-yaounde" d="${courbe(villes.yaounde.p, [0, -40])}" pathLength="1" filter="url(#lueur)"/>`;
    c += `<path class="trajet" id="trajet-kribi" d="${courbe(villes.kribi.p, [-40, 0])}" pathLength="1" filter="url(#lueur)"/>`;
    c += `<path class="trajet" id="trajet-bafoussam" d="${courbe(villes.bafoussam.p, [-50, 10])}" pathLength="1" filter="url(#lueur)"/>`;
    Object.entries(villes).forEach(([id, v]) => {
      const [x, y] = v.p;
      c += `<g id="ville-${id}" class="ville-point" style="transform-origin:${x.toFixed(1)}px ${y.toFixed(1)}px">` +
        `<circle cx="${x}" cy="${y}" r="${id === "douala" ? 18 : 13}" class="${id === "douala" ? "point-depart" : "point-arrivee"}"/>` +
        `<text x="${x + v.dx}" y="${y + v.dy}" text-anchor="${v.ancre}">${v.nom}</text></g>`;
    });
    document.getElementById("cameroun-svg").innerHTML = c;
  }

  // Véhicule en coupe (scène 4) : la face avant-gauche est ouverte sur l'habitacle,
  // la portière arrière pivote autour de sa charnière (polygone recalculé par porte(angle)).
  const COUPE = { L: 440, W: 210, ox: 520, oy: 210 };
  function polygonePorte(angle) {
    const { W, ox, oy } = COUPE;
    // Portière arrière gauche : x de 250 à 360 (charnière côté avant, x = 360), z de 18 à 118.
    const a = (angle * Math.PI) / 180;
    const xh = 360, larg = 110;
    const coin = (z, ouvert) => {
      const x = xh - larg * Math.cos(ouvert ? a : 0);
      const y = W + larg * Math.sin(ouvert ? a : 0);
      return iso(x, y, z, ox, oy);
    };
    return [iso(xh, W, 18, ox, oy), coin(18, true), coin(118, true), iso(xh, W, 118, ox, oy)];
  }
  function vueCoupe() {
    const { L, W, ox, oy } = COUPE;
    let c = "";
    // Ombre au sol
    const ombreSol = [iso(-20, -20, 0, ox, oy), iso(L + 20, -20, 0, ox, oy), iso(L + 20, W + 60, 0, ox, oy), iso(-20, W + 60, 0, ox, oy)];
    c += `<polygon points="${pts(ombreSol)}" fill="rgba(14,27,46,0.35)"/>`;
    c += roue(70, 0, ox, oy) + roue(L - 80, 0, ox, oy);
    c += boite(0, 0, 0, L, W, 18, ["#2b2e35", "#1b1d22", "#16181d"], ox, oy);
    // Face droite (arrière-droite) pleine, rouge ; face gauche coupée : seulement le bas de caisse.
    const droite = [iso(L, 0, 18, ox, oy), iso(L, W, 18, ox, oy), iso(L, W, 118, ox, oy), iso(L, 0, 118, ox, oy)];
    c += `<polygon points="${pts(droite)}" fill="#a80400"/>`;
    const fond = [iso(0, 0, 18, ox, oy), iso(L, 0, 18, ox, oy), iso(L, 0, 150, ox, oy), iso(0, 0, 150, ox, oy)];
    c += `<polygon points="${pts(fond)}" fill="#efe6d8"/>`;
    // Plancher et sièges visibles par la coupe
    c += boite(10, 10, 18, L - 20, W - 20, 8, ["#d9cfc0", "#c4b8a6", "#b3a690"], ox, oy);
    [[90, 22], [90, 116], [220, 22], [220, 116]].forEach(([x, y]) => {
      c += boite(x, y, 26, 66, 70, 26, ["#f1e4cc", "#dcc9a9", "#c9b38e"], ox, oy);
      c += boite(x, y, 52, 16, 70, 56, ["#e9d9bb", "#d2bd98", "#bfa67d"], ox, oy);
      const s = [iso(x + 4, y + 35, 53, ox, oy), iso(x + 62, y + 35, 53, ox, oy)];
      c += `<line x1="${s[0][0]}" y1="${s[0][1]}" x2="${s[1][0]}" y2="${s[1][1]}" stroke="#2bb5a8" stroke-width="3"/>`;
    });
    // Tableau de bord et écran allumé
    c += boite(340, 24, 26, 40, W - 48, 44, ["#2b2e35", "#1b1d22", "#16181d"], ox, oy);
    const ecran = [iso(345, 70, 72, ox, oy), iso(345, 140, 72, ox, oy), iso(345, 140, 104, ox, oy), iso(345, 70, 104, ox, oy)];
    c += `<polygon points="${pts(ecran)}" fill="#2bb5a8"/>`;
    // Bas de caisse gauche (la coupe) avec liseré blanc
    const bas = [iso(0, W, 18, ox, oy), iso(L, W, 18, ox, oy), iso(L, W, 46, ox, oy), iso(0, W, 46, ox, oy)];
    c += `<polygon points="${pts(bas)}" fill="#c20500"/>`;
    const lis = [iso(0, W, 46, ox, oy), iso(L, W, 46, ox, oy), iso(L, W, 50, ox, oy), iso(0, W, 50, ox, oy)];
    c += `<polygon points="${pts(lis)}" fill="#F5F2F0"/>`;
    // Montants et toit vitré
    [[20, 0], [L - 20, 0], [L - 20, W]].forEach(([x, y]) => {
      const a = iso(x, y, 118, ox, oy), b = iso(x, y, 160, ox, oy);
      c += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#2b2e35" stroke-width="7"/>`;
    });
    const toit = [iso(20, 0, 160, ox, oy), iso(L - 20, 0, 160, ox, oy), iso(L - 20, W, 160, ox, oy), iso(20, W, 160, ox, oy)];
    c += `<polygon points="${pts(toit)}" fill="rgba(200,235,240,0.22)" stroke="#F5F2F0" stroke-width="3"/>`;
    const bande = [iso(20, W / 2 - 14, 161, ox, oy), iso(L - 20, W / 2 - 14, 161, ox, oy), iso(L - 20, W / 2 + 14, 161, ox, oy), iso(20, W / 2 + 14, 161, ox, oy)];
    c += `<polygon points="${pts(bande)}" fill="#F5F2F0"/>`;
    // Roues avant (devant la caisse)
    c += roue(70, W, ox, oy) + roue(L - 80, W, ox, oy);
    // Portière (animée)
    c += `<polygon id="coupe-porte" points="${pts(polygonePorte(0))}" fill="#e10600" stroke="#F5F2F0" stroke-width="3"/>`;
    document.getElementById("coupe-vehicule").innerHTML = svg(c, 1040, 620);
  }

  window.ILLUSTRATIONS = {
    dessiner() {
      vueEclatee();
      carteCameroun();
      vueCoupe();
    },
    porte(angle) {
      document.getElementById("coupe-porte").setAttribute("points", pts(polygonePorte(angle)));
    },
  };
})();
