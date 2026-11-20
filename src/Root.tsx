import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/500-italic.css';
import {Composition} from 'remotion';
import {JPAd} from './JPAd';
import {DURATION, FPS} from './theme';

export const Root: React.FC = () => (
  <Composition id="JPAd" component={JPAd} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
);
