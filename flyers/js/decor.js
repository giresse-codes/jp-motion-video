// Décor commun des flyers : silhouette de ville et marquage de la route (déterministe).
(function () {
  var ville = document.getElementById("ville");
  if (ville) {
    var ns = "http://www.w3.org/2000/svg", x = 0, i = 0, html = "";
    // Deux rangées d'immeubles : la plus lointaine plus claire.
    [["#E9EAEE", 0.55], ["#DADCE1", 1]].forEach(function (rang, r) {
      x = r ? -20 : 10; i = r * 7;
      while (x < 1080) {
        var l = 46 + ((i * 37) % 50), h = (90 + ((i * 53) % 140)) * rang[1] + (r ? 0 : 60);
        html += '<rect x="' + x + '" y="' + (240 - h) + '" width="' + l + '" height="' + h + '" fill="' + rang[0] + '"/>';
        if (r) for (var y = 240 - h + 14; y < 230; y += 22) html += '<rect x="' + (x + 10) + '" y="' + y + '" width="' + (l - 20) + '" height="6" fill="#E9EAEE"/>';
        x += l + 6 + ((i * 17) % 18); i++;
      }
    });
    ville.innerHTML = html;
  }
  var route = document.getElementById("route");
  if (route) for (var k = 0; k < 6; k++) {
    var d = document.createElement("div");
    d.className = "ligne"; d.style.left = (40 + k * 200) + "px";
    route.appendChild(d);
  }
})();
