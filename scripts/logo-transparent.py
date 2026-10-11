"""Crée public/logo-transparent.png à partir de public/logo.png (fond noir).

Le noir devient transparent ; les couleurs sont « dé-prémultipliées » pour
garder l'éclat néon. Rendu identique à un mode de fusion « screen » sur noir.
Usage : python3 scripts/logo-transparent.py
"""
import numpy as np
from PIL import Image

src = np.asarray(Image.open("public/logo.png").convert("RGB")).astype(np.float32) / 255
alpha = src.max(axis=2, keepdims=True)
# Le grain gris très sombre du fond disparaît complètement.
alpha = np.clip((alpha - 0.06) / 0.94, 0, 1)
# Idem pour le grain gris peu saturé en bas de l'image (ni texte ni néon).
saturation = src.max(axis=2, keepdims=True) - src.min(axis=2, keepdims=True)
gris_sombre = (saturation < 0.12) & (src.max(axis=2, keepdims=True) < 0.5)
alpha = np.where(gris_sombre, 0, alpha)
rgb = np.where(alpha > 0, np.clip(src / np.maximum(alpha, 1e-4), 0, 1), 0)
out = np.concatenate([rgb, alpha], axis=2)
Image.fromarray((out * 255).round().astype(np.uint8), "RGBA").save("public/logo-transparent.png")
print("public/logo-transparent.png créé")
