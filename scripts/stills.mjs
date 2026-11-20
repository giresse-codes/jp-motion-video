// Captures de contrôle (bundle unique) : node scripts/stills.mjs [frames...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'path';
const frames = (process.argv.slice(2).length ? process.argv.slice(2) : ['30', '200', '450', '700', '900', '1100', '1300']).map(Number);
const browserExecutable = process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'JPAd', browserExecutable});
for (const frame of frames) {
  await renderStill({serveUrl, composition, frame, output: `out/frame-${frame}.png`, browserExecutable, imageFormat: 'png'});
  console.log('frame', frame);
}
