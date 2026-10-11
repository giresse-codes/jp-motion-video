// Cale le texte de la voix off sur l'audio, sans réseau ni clé API.
// 1. ffmpeg détecte les silences de public/<voix> ;
// 2. chaque segment de parole reçoit la ligne correspondante de voix-texte.txt ;
// 3. les mots sont répartis dans le segment au prorata de leur longueur.
// Résultat : src/voix-timing.json (un objet par mot, en millisecondes).
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const ROOT = process.cwd();
const voix = path.join(ROOT, 'public', process.argv[2] ?? 'voiceoff.wav');
const SEUIL = process.env.SEUIL_DB ?? '-38dB';
const PAUSE_MIN = process.env.PAUSE_MIN_S ?? '0.18';

const lignes = fs
  .readFileSync(path.join(ROOT, 'scripts', 'voix-texte.txt'), 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'));

// silencedetect écrit ses résultats sur stderr.
const {stderr: sortie} = spawnSync(
  'ffmpeg',
  ['-hide_banner', '-i', voix, '-af', `silencedetect=noise=${SEUIL}:d=${PAUSE_MIN}`, '-f', 'null', '-'],
  {encoding: 'utf8'},
);

const duree = Number(/Duration: (\d+):(\d+):([\d.]+)/.exec(sortie).slice(1).reduce((a, v) => a * 60 + Number(v), 0));
const debuts = [...sortie.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
const fins = [...sortie.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));

// Segments de parole = intervalles entre les silences.
const segments = [];
let curseur = 0;
debuts.forEach((d, i) => {
  if (d - curseur > 0.05) segments.push([curseur, d]);
  curseur = fins[i] ?? duree;
});
if (duree - curseur > 0.05) segments.push([curseur, duree]);

if (segments.length !== lignes.length) {
  console.error(
    `${segments.length} segments de parole détectés pour ${lignes.length} lignes de texte.\n` +
      'Ajuste le découpage de voix-texte.txt ou SEUIL_DB / PAUSE_MIN_S.\n' +
      segments.map(([a, b]) => `${a.toFixed(2)}-${b.toFixed(2)}`).join('  '),
  );
  process.exit(1);
}

const mots = [];
segments.forEach(([a, b], i) => {
  const ws = lignes[i].split(/\s+/);
  const poids = ws.map((w) => Math.max(1, w.replace(/[^\p{L}\p{N}]/gu, '').length) + 1);
  const total = poids.reduce((s, p) => s + p, 0);
  let t = a;
  ws.forEach((w, j) => {
    const d = ((b - a) * poids[j]) / total;
    mots.push({text: w, startMs: Math.round(t * 1000), endMs: Math.round((t + d) * 1000)});
    t += d;
  });
});

fs.writeFileSync(path.join(ROOT, 'src', 'voix-timing.json'), JSON.stringify(mots, null, 1) + '\n');
segments.forEach(([a, b], i) => console.log(`${a.toFixed(2)}–${b.toFixed(2)}  ${lignes[i]}`));
