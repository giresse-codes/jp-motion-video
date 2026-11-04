"""Images de « Bento » (Pillow, hors ligne) :
- assets/images/voiture-noire.png : la voiture détourée du projet (../assets/voiture-jp.png) assombrie en noir laqué.
- assets/images/photo-voiture.jpg : « photo studio » 1300 × 2300 (moitié de la taille du mur, 2600 × 4600) avec la voiture
  noire au centre, sol réfléchissant et lumière douce. Les dos des tuiles en montrent chacun un morceau au flip final.
Usage (depuis le projet) : python3 scripts/images.py
"""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageDraw
import numpy as np

ICI = Path(__file__).resolve().parent.parent
src = Image.open(ICI.parent / "assets" / "voiture-jp.png").convert("RGBA")

# Voiture noire : désaturée, assombrie, contraste relevé (les reflets restent).
rgb, a = src.convert("RGB"), src.getchannel("A")
g = ImageOps.grayscale(rgb)
g = ImageEnhance.Brightness(ImageEnhance.Contrast(g).enhance(1.35)).enhance(0.62)
noire = Image.merge("RGBA", (g, g, g, a))
noire.save(ICI / "assets" / "images" / "voiture-noire.png")

# Photo studio (palette : gris du fond vers le noir des tuiles sombres)
L, H = 1300, 2300
y, x = np.mgrid[0:H, 0:L]
r = np.sqrt(((x - L / 2) / (L * 0.75)) ** 2 + ((y - H * 0.47) / (H * 0.5)) ** 2)
v = np.clip(1 - r, 0, 1) ** 1.6
c0, c1 = np.array([0x0E, 0x0F, 0x0F]), np.array([0x5A, 0x5C, 0x5C])
img = (c0 + (c1 - c0) * v[..., None]).astype(np.uint8)
photo = Image.fromarray(img, "RGB").convert("RGBA")
larg = 1180
car = noire.resize((larg, round(noire.height * larg / noire.width)), Image.LANCZOS)
cx, cy = (L - larg) // 2, int(H * 0.47 - car.height * 0.55)
# Reflet au sol : voiture retournée, estompée
refl = ImageOps.flip(car)
alpha = np.asarray(refl.getchannel("A"), dtype=np.float32)
alpha *= np.linspace(0.32, 0.0, refl.height)[:, None] ** 1.0  # estompé vers le bas
refl.putalpha(Image.fromarray(alpha.astype(np.uint8), "L"))
photo.alpha_composite(refl.filter(ImageFilter.GaussianBlur(3)), (cx, cy + car.height - 18))
ombre = Image.new("RGBA", (larg, 80), (0, 0, 0, 0))
ImageDraw.Draw(ombre).ellipse([20, 10, larg - 20, 70], fill=(0, 0, 0, 200))
photo.alpha_composite(ombre.filter(ImageFilter.GaussianBlur(18)), (cx, cy + car.height - 60))
photo.alpha_composite(car, (cx, cy))
photo.convert("RGB").save(ICI / "assets" / "images" / "photo-voiture.jpg", quality=88)
print("voiture-noire.png, photo-voiture.jpg")
