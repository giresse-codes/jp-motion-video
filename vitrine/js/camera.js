// Caméra unique (rule hyperframes-animation « 3d-camera-flight ») :
// une lentille (perspective statique sur .stage), un état `cam`, un seul écrivain applyCamera().
// Ordre fixe : translate3d(x,y,z) scale(s) rotateX(rx) rotateZ(rz) — la translation est
// hors des rotations, donc x/y/z restent alignés sur l'écran quel que soit l'angle.
// Le sol est en plus tourné de 45° (CSS statique) pour la vue isométrique.

(function () {
  const PERSPECTIVE = 4200; // grande focale : rendu quasi isométrique
  const RAD = Math.PI / 180;

  // Position (avant perspective) d'un point sol (gx, gy, gz) relatif au centre du sol,
  // pour une rotation caméra donnée et une échelle s.
  function projeter(gx, gy, gz, rx, rz, s) {
    // rotation fixe du sol : 45°
    const c45 = Math.SQRT1_2;
    let x = gx * c45 - gy * c45;
    let y = gx * c45 + gy * c45;
    let z = gz;
    // rotateZ(rz)
    const cz = Math.cos(rz * RAD), sz = Math.sin(rz * RAD);
    [x, y] = [x * cz - y * sz, x * sz + y * cz];
    // rotateX(rx)
    const cx = Math.cos(rx * RAD), sx = Math.sin(rx * RAD);
    [y, z] = [y * cx - z * sx, y * sx + z * cx];
    return { x: x * s, y: y * s, z: z * s };
  }

  // Pose qui place le point sol (px, py) [coordonnées sol absolues] à l'écran en (ox, oy)
  // (décalage depuis le centre de l'image), à profondeur 0, puis recule/avance de `dolly`.
  function viser(px, py, o) {
    const T = window.VILLE.TAILLE;
    const v = projeter(px - T / 2, py - T / 2, o.gz || 0, o.rx, o.rz || 0, o.s);
    return {
      x: (o.ox || 0) - v.x,
      y: (o.oy || 0) - v.y,
      z: -v.z + (o.dolly || 0),
      s: o.s,
      rx: o.rx,
      rz: o.rz || 0,
    };
  }

  function creer(monde) {
    const cam = { x: 0, y: 0, z: 0, s: 1, rx: 0, rz: 0 };
    // Dérive et secousses additives, composées par le même écrivain.
    const derive = { x: 0, y: 0, rz: 0 };
    const secousse = { x: 0, y: 0 };
    function appliquer() {
      monde.style.transform =
        `translate3d(${cam.x + derive.x + secousse.x}px, ${cam.y + derive.y + secousse.y}px, ${cam.z}px) ` +
        `scale(${cam.s}) rotateX(${cam.rx}deg) rotateZ(${cam.rz + derive.rz}deg)`;
    }
    return { cam, derive, secousse, appliquer };
  }

  window.CAMERA = { PERSPECTIVE, projeter, viser, creer };
})();
