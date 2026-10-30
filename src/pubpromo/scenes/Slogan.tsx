import {PUB_PROMO} from '../../config';
import {C, Fond, MotCinetique, Sortie, useTemps} from '../ui';

// 5. « Rapide. Sûr. Confortable. » : trois mots cinétiques en ressort.
const D = PUB_PROMO.scenes.slogan;
const FIN = PUB_PROMO.scenes.pause;

export const Slogan: React.FC = () => {
  const {t, fps} = useTemps(D);
  const [a, b, c] = PUB_PROMO.slogan;
  return (
    <Sortie t={t} fin={FIN} d={0.35}>
      <Fond />
      <div style={{position: 'absolute', left: 0, right: 0, top: 600}}>
        <MotCinetique texte={a.mot} a={a.a} t={t} fps={fps} taille={170} ecart={0.035} />
        <MotCinetique texte={b.mot} a={b.a} t={t} fps={fps} taille={170} ecart={0.035} style={{marginTop: 40}} />
        <MotCinetique texte={c.mot} a={c.a} t={t} fps={fps} taille={128} ecart={0.03} couleur={C.or} style={{marginTop: 60}} />
      </div>
    </Sortie>
  );
};
