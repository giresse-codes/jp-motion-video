import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/500-italic.css';
import {Composition} from 'remotion';
import {JPAd} from './JPAd';
import {DURATION, FPS} from './theme';
import {GLOW_DURATION, JPGlow} from './glow/JPGlow';
import {JPPop, POP_DURATION} from './pop/JPPop';

export const Root: React.FC = () => (
  <>
    <Composition id="JPAd" component={JPAd} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
    <Composition id="JPPop" component={JPPop} durationInFrames={POP_DURATION} fps={FPS} width={1080} height={1920} />
    <Composition id="JPGlow" component={JPGlow} durationInFrames={GLOW_DURATION} fps={FPS} width={1080} height={1920} />
  </>
);
