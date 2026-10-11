import {Img} from 'remotion';
import {LOGO, LOGO_DETOURE} from '../config';
import {fichierOuNull} from '../lib/assets';

// Dimensions du fichier logo.png fourni (bannière horizontale sur fond noir).
const LOGO_L = 1080;
const LOGO_H = 291;
// Zone de l'emblème (cercle + route + voiture) dans la bannière.
const EMBLEME = {x: 30, y: 18, l: 290, h: 268};

// On préfère la version détourée. À défaut, le logo d'origine (fond noir)
// est fusionné en mode « screen », ce qui fait disparaître le noir.
const logo = (): {src: string | null; fusion: React.CSSProperties} => {
  const detoure = fichierOuNull(LOGO_DETOURE);
  if (detoure) return {src: detoure, fusion: {}};
  return {src: fichierOuNull(LOGO), fusion: {mixBlendMode: 'screen'}};
};

export const Embleme: React.FC<{largeur: number; style?: React.CSSProperties}> = ({
  largeur,
  style,
}) => {
  const {src, fusion} = logo();
  const k = largeur / EMBLEME.l;
  if (!src) return <PastilleSecours taille={largeur} />;
  return (
    <div
      style={{
        width: largeur,
        height: EMBLEME.h * k,
        overflow: 'hidden',
        position: 'relative',
        // La route de l'emblème est coupée net en bas de l'image source : on l'estompe.
        maskImage: 'linear-gradient(180deg, black 78%, transparent 100%)',
        ...fusion,
        ...style,
      }}
    >
      <Img
        src={src}
        style={{
          position: 'absolute',
          width: LOGO_L * k,
          height: LOGO_H * k,
          left: -EMBLEME.x * k,
          top: -EMBLEME.y * k,
          maxWidth: 'none',
        }}
      />
    </div>
  );
};

export const LogoComplet: React.FC<{largeur: number; style?: React.CSSProperties}> = ({
  largeur,
  style,
}) => {
  const {src, fusion} = logo();
  if (!src) return <PastilleSecours taille={largeur / 3} />;
  return (
    <Img
      src={src}
      style={{width: largeur, height: (largeur * LOGO_H) / LOGO_L, ...fusion, ...style}}
    />
  );
};

// Utilisé seulement si logo.png manque.
const PastilleSecours: React.FC<{taille: number}> = ({taille}) => (
  <div
    style={{
      width: taille,
      height: taille,
      borderRadius: '50%',
      border: `${taille / 14}px solid #E10600`,
      boxShadow: '0 0 40px #E10600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Montserrat',
      fontWeight: 900,
      fontStyle: 'italic',
      fontSize: taille / 3,
    }}
  >
    JP
  </div>
);
