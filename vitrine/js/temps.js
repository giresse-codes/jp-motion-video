// Placement de la voix off dans le film.
// La voix (assets/voiceoff.mp3, 36,8 s) est découpée en 5 sections, coupées au milieu des
// pauses, et posée sur les scènes du film de 45 s. Les mêmes valeurs sont reprises dans les
// balises <audio id="voix-…"> de index.html (data-media-start / data-start / data-duration).
(function () {
  const SECTIONS = [
    { id: "accroche", debutVoix: 0.0, finVoix: 3.84, debutFilm: 0.9 },
    { id: "probleme", debutVoix: 3.84, finVoix: 9.02, debutFilm: 5.6 },
    { id: "services", debutVoix: 9.02, finVoix: 23.91, debutFilm: 11.5 },
    { id: "chauffeurs", debutVoix: 23.91, finVoix: 27.59, debutFilm: 30.0 },
    { id: "appel", debutVoix: 27.59, finVoix: 36.8, debutFilm: 35.3 },
  ];

  // Temps de la voix -> temps du film.
  function tFilm(t) {
    const s = SECTIONS.find((x) => t >= x.debutVoix && t < x.finVoix) || SECTIONS[SECTIONS.length - 1];
    return s.debutFilm + (t - s.debutVoix);
  }

  // Début (temps film) du n-ième mot de la voix égal à `texte` (n = 1 par défaut).
  function mot(texte, n) {
    const propre = (s) => s.replace(/[.,:;!?]/g, "");
    const trouves = window.VOIX.mots.filter((m) => propre(m.texte) === texte);
    const m = trouves[(n || 1) - 1];
    if (!m) throw new Error("Mot introuvable dans la voix : " + texte + " #" + (n || 1));
    return tFilm(m.debut);
  }
  function finMot(texte, n) {
    const propre = (s) => s.replace(/[.,:;!?]/g, "");
    const m = window.VOIX.mots.filter((x) => propre(x.texte) === texte)[(n || 1) - 1];
    if (!m) throw new Error("Mot introuvable dans la voix : " + texte);
    return tFilm(m.fin);
  }

  window.TEMPS = { SECTIONS, tFilm, mot, finMot };
})();
