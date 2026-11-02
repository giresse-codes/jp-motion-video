"""Transcription de secours de la voix off (quand `npx hyperframes transcribe` / /media-use ne peut pas
télécharger son modèle : Hugging Face est bloqué dans certains environnements).
Whisper small multilingue (sherpa-onnx, hébergé sur GitHub), phrase par phrase entre les pauses
(ffmpeg silencedetect), mots répartis dans chaque phrase au prorata de leur longueur.
Sortie : transcript.json au format de `hyperframes transcribe` ({"words": [{"text","start","end"}]}),
plus "phrases" pour relire et corriger le texte à la main avant de l'utiliser.
Prérequis : pip install sherpa-onnx ; le modèle (~640 Mo) est téléchargé une fois dans ~/.cache/jp-papier.
Usage : python3 scripts/transcrire.py assets/audio/voix.mp3 [transcript.json]
"""
import json, re, subprocess, sys, tarfile, urllib.request, wave
from pathlib import Path
import numpy as np

MODELE = Path.home() / ".cache" / "jp-papier" / "sherpa-onnx-whisper-small"
URL = "https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-small.tar.bz2"

def modele():
    if not (MODELE / "small-tokens.txt").exists():
        MODELE.parent.mkdir(parents=True, exist_ok=True)
        archive = MODELE.parent / "whisper-small.tar.bz2"
        print("Téléchargement du modèle Whisper small…", file=sys.stderr)
        urllib.request.urlretrieve(URL, archive)
        with tarfile.open(archive) as t:
            t.extractall(MODELE.parent, filter="data")
        archive.unlink()
    return MODELE

def main():
    import sherpa_onnx
    voix, sortie = Path(sys.argv[1]), Path(sys.argv[2] if len(sys.argv) > 2 else "transcript.json")
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(voix), "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768
    duree = len(x) / 16000
    log = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(voix), "-af", "silencedetect=noise=-35dB:d=0.25", "-f", "null", "-"], capture_output=True, text=True).stderr
    debuts = [float(v) for v in re.findall(r"silence_start: ([\d.]+)", log)]
    fins = [float(v) for v in re.findall(r"silence_end: ([\d.]+)", log)]
    segments, t = [], 0.0
    for a, b in zip(debuts, fins):
        if a - t > 0.15: segments.append((t, a))
        t = b
    if duree - t > 0.15: segments.append((t, duree))
    d = modele()
    rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=str(d / "small-encoder.int8.onnx"), decoder=str(d / "small-decoder.int8.onnx"),
                                                     tokens=str(d / "small-tokens.txt"), language="fr", task="transcribe", num_threads=4)
    phrases, mots = [], []
    for a, b in segments:
        s = rec.create_stream(); s.accept_waveform(16000, x[max(0, int((a - 0.1) * 16000)):int((b + 0.1) * 16000)])
        rec.decode_stream(s)
        texte = s.result.text.strip()
        phrases.append({"start": round(a, 2), "end": round(b, 2), "text": texte})
        print(f"{a:6.2f} {b:6.2f}  {texte}")
        liste = texte.split()
        poids = [max(len(re.sub(r"[^\w]", "", m)), 3) + 2 for m in liste]
        c = a
        for m, p in zip(liste, poids):
            f = c + (b - a) * p / max(1, sum(poids))
            mots.append({"text": m, "start": round(c, 3), "end": round(f, 3)})
            c = f
    sortie.write_text(json.dumps({"words": mots, "phrases": phrases}, ensure_ascii=False, indent=1))
    print(f"→ {sortie} ({len(mots)} mots). Relire le texte : la transcription peut se tromper sur les noms propres.")

if __name__ == "__main__":
    main()
