// Captures et rendus de la série motion design n° 11 à 20.
// Usage : node scripts/motion-rendu.mjs 11 12 ...        -> captures (out/motion/pubN-fXXX.png + planche)
//         node scripts/motion-rendu.mjs --video 11 12 ... -> captures + MP4 H.264 (out/motion/pubN.mp4)
//         node scripts/motion-rendu.mjs --frames 0,100 11 -> images choisies seulement
// Navigateur : REMOTION_CHROME=/chemin/headless_shell si Remotion ne peut pas télécharger le sien.
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import {mkdirSync, readFileSync} from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const video = args.includes('--video');
const iF = args.indexOf('--frames');
const framesChoisies = iF >= 0 ? args[iF + 1].split(',').map(Number) : null;
const nums = args.filter((a, i) => /^\d+$/.test(a) && (iF < 0 || i !== iF + 1)).map(Number);
const cfg = readFileSync('src/motion/config.ts', 'utf8');
const pubs = [...cfg.matchAll(/\{n: (\d+), id: '([^']+)', duree: (\d+), captures: \[([^\]]+)\]\}/g)].map((m) => ({
  n: +m[1], id: m[2], captures: m[4].split(',').map(Number),
}));
const browserExecutable = process.env.REMOTION_CHROME ?? null;
const sortie = path.resolve('out/motion');
mkdirSync(sortie, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
for (const n of nums) {
  const p = pubs.find((x) => x.n === n);
  const composition = await selectComposition({serveUrl, id: p.id, browserExecutable});
  const images = [];
  for (const frame of framesChoisies ?? p.captures) {
    const output = `${sortie}/pub${n}-f${String(frame).padStart(3, '0')}.png`;
    await renderStill({serveUrl, composition, frame, output, browserExecutable, imageFormat: 'png'});
    images.push(output);
  }
  // Planche : captures côte à côte, réduites
  if (images.length > 1)
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...images.flatMap((i) => ['-i', i]), '-filter_complex',
      `${images.map((_, i) => `[${i}]scale=360:-1[v${i}]`).join(';')};${images.map((_, i) => `[v${i}]`).join('')}hstack=inputs=${images.length}`,
      `${sortie}/pub${n}-planche.jpg`]);
  console.log(`pub ${n} : captures ok`);
  if (video) {
    await renderMedia({serveUrl, composition, codec: 'h264', crf: 18, outputLocation: `${sortie}/pub${n}.mp4`, browserExecutable,
      onProgress: ({progress}) => process.stdout.write(`\rpub ${n} : ${Math.round(progress * 100)} %`)});
    console.log(`\npub ${n} : vidéo ok`);
  }
}
