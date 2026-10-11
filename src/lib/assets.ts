import {getStaticFiles, staticFile} from 'remotion';

const fichiers = new Set(getStaticFiles().map((f) => f.name));

// Le fichier existe-t-il dans public/ ?
export const existe = (nom: string) => fichiers.has(nom);

// URL du fichier, ou null s'il manque (le composant affiche alors un placeholder).
export const fichierOuNull = (nom: string) => (existe(nom) ? staticFile(nom) : null);

export const estVideo = (nom: string) => /\.(mp4|mov|webm|m4v)$/i.test(nom);
