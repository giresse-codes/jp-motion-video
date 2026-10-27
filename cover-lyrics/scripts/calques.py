"""Calques du montage « cover lyrics » : masque à coins arrondis de l'écran des paroles et halo lumineux dessous.
Usage : python3 scripts/calques.py LARGEUR HAUTEUR RAYON -> medias/masque.png, medias/halo.png
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ICI = Path(__file__).resolve().parent.parent
L, H, R = (int(v) for v in sys.argv[1:4])
MARGE = 40  # place du halo autour de l'écran

masque = Image.new("L", (L, H), 0)
ImageDraw.Draw(masque).rounded_rectangle([0, 0, L - 1, H - 1], radius=R, fill=255)
masque.save(ICI / "medias" / "masque.png")

halo = Image.new("RGBA", (L + 2 * MARGE, H + 2 * MARGE), (0, 0, 0, 0))
d = ImageDraw.Draw(halo)
d.rounded_rectangle([MARGE - 6, MARGE - 6, MARGE + L + 5, MARGE + H + 5], radius=R + 6, fill=(190, 205, 255, 120))
halo = halo.filter(ImageFilter.GaussianBlur(18))
# liseré fin et net par-dessus le flou
ImageDraw.Draw(halo).rounded_rectangle([MARGE - 3, MARGE - 3, MARGE + L + 2, MARGE + H + 2], radius=R + 3, outline=(255, 255, 255, 150), width=3)
halo.save(ICI / "medias" / "halo.png")
print("medias/masque.png, medias/halo.png")
