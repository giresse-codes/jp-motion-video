import React, {useEffect, useMemo, useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {continueRender, delayRender, interpolate, useCurrentFrame} from 'remotion';
import {P, cl} from './kit';

const W = 1080;
const H = 1920;
const col = (h: string) => new THREE.Color(h);
// valeurs sRGB brutes (le ShaderMaterial écrit directement en sortie)
const srgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

/* ───────── Mascotte : petite voiture blanche ronde, phares = yeux ───────── */
const Eye: React.FC<{x: number; look: number; blink: number}> = ({x, look, blink}) => (
  <group position={[x, 8, 92]}>
    <mesh scale={[1, blink, 1]}>
      <sphereGeometry args={[27, 32, 32]} />
      <meshStandardMaterial color={P.white} roughness={0.2} emissive={col('#FFF6E8')} emissiveIntensity={0.25} />
    </mesh>
    <mesh position={[look * 6, -2, 20]} scale={[1, blink, 1]}>
      <sphereGeometry args={[13, 24, 24]} />
      <meshStandardMaterial color={P.text} roughness={0.3} />
    </mesh>
    <mesh position={[look * 6 + 5, 4, 31]}>
      <sphereGeometry args={[4, 12, 12]} />
      <meshBasicMaterial color={P.white} />
    </mesh>
  </group>
);

export const Mascot: React.FC<{flame: number; t: number}> = ({flame, t}) => {
  const blink = Math.abs(Math.sin(t / 23)) > 0.97 ? 0.15 : 1;
  const wheelSpin = t * 0.4;
  return (
    <group>
      {/* carrosserie */}
      <mesh scale={[1.32, 0.78, 1]} castShadow>
        <sphereGeometry args={[105, 48, 48]} />
        <meshStandardMaterial color={P.white} roughness={0.35} metalness={0.05} />
      </mesh>
      {/* cabine */}
      <mesh position={[0, 62, -6]} scale={[1, 0.72, 0.9]}>
        <sphereGeometry args={[72, 40, 40]} />
        <meshStandardMaterial color={P.white} roughness={0.3} />
      </mesh>
      {/* pare-brise teinté dégradé */}
      <mesh position={[0, 66, 42]} scale={[0.82, 0.42, 0.35]}>
        <sphereGeometry args={[70, 32, 32]} />
        <meshStandardMaterial color={col(P.v)} roughness={0.15} metalness={0.2} emissive={col(P.p)} emissiveIntensity={0.25} />
      </mesh>
      <Eye x={-48} look={0.3} blink={blink} />
      <Eye x={48} look={0.3} blink={blink} />
      {/* joues */}
      {[-84, 84].map((x) => (
        <mesh key={x} position={[x, -14, 70]} scale={[1, 0.55, 0.4]}>
          <sphereGeometry args={[14, 16, 16]} />
          <meshBasicMaterial color={col(P.p)} transparent opacity={0.55} />
        </mesh>
      ))}
      {/* sourire */}
      <mesh position={[0, -34, 98]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[14, 3.2, 8, 24, Math.PI]} />
        <meshStandardMaterial color={P.text} />
      </mesh>
      {/* roues */}
      {[
        [-88, -62, 44],
        [88, -62, 44],
        [-88, -62, -44],
        [88, -62, -44],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[wheelSpin, Math.PI / 2, 0]}>
          <cylinderGeometry args={[30, 30, 26, 24]} />
          <meshStandardMaterial color={P.text} roughness={0.6} />
        </mesh>
      ))}
      {/* propulseur dégradé (fusée) */}
      <group position={[-150, -10, -10]} rotation={[0, 0, Math.PI / 2]} scale={[1, flame, 1]}>
        <mesh position={[0, 70, 0]}>
          <coneGeometry args={[34, 150, 24]} />
          <meshBasicMaterial color={col(P.o)} transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, 50, 0]}>
          <coneGeometry args={[20, 90, 24]} />
          <meshBasicMaterial color={col('#FFE3C2')} />
        </mesh>
      </group>
    </group>
  );
};

/** Trajectoire de décollage (unités = px, origine au centre de l'écran, y vers le haut) */
export const mascotPath = (t: number) => {
  // t local (frames) depuis le décollage
  const p1 = interpolate(t, [0, 22], [0, 1], {...cl, easing: (x) => 1 - Math.pow(1 - x, 3)});
  const p2 = interpolate(t, [36, 56], [0, 1], {...cl, easing: (x) => x * x});
  const x = interpolate(p1, [0, 1], [-760, -40]) + p2 * 900;
  const y = interpolate(p1, [0, 1], [-1100, 60]) + Math.sin(t / 6) * 12 * (1 - p2) + p2 * 1300;
  return {x, y};
};

export const MascotScene: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  const t = f - start;
  const {x, y} = mascotPath(t);
  const {x: x2, y: y2} = mascotPath(t + 1);
  const ang = Math.atan2(y2 - y, x2 - x);
  const flame = 0.7 + 0.3 * Math.abs(Math.sin(f / 2));
  return (
    <ThreeCanvas width={W} height={H} orthographic camera={{zoom: 1, position: [0, 0, 1200], near: 1, far: 4000}} style={{position: 'absolute', inset: 0}}>
      <ambientLight intensity={0.75} />
      <directionalLight position={[-400, 600, 800]} intensity={1.6} />
      <directionalLight position={[500, -200, 400]} intensity={0.5} color={P.p} />
      <hemisphereLight args={[P.white, P.v, 0.35]} />
      <group position={[x, y, 0]} rotation={[0.25, -0.35, ang * 0.35]} scale={1.5}>
        <Mascot flame={flame} t={f} />
      </group>
    </ThreeCanvas>
  );
};

/* ───────── Sphère 3D en dégradé ───────── */
const sphereVert = `
varying vec3 vN; varying vec3 vP;
void main(){ vN = normalize(normalMatrix*normal); vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
const sphereFrag = `
uniform float uT; uniform vec3 cO; uniform vec3 cP; uniform vec3 cV;
varying vec3 vN; varying vec3 vP;
void main(){
  vec3 p = normalize(vP);
  float a = sin(p.x*2.6 + uT) + sin(p.y*3.1 - uT*0.8) + sin((p.z+p.x)*2.2 + uT*0.6);
  float k = 0.5 + 0.25*a;
  vec3 g = k < 0.5 ? mix(cO, cP, k*2.0) : mix(cP, cV, (k-0.5)*2.0);
  float fres = pow(1.0 - max(dot(vN, vec3(0.0,0.0,1.0)), 0.0), 2.2);
  float light = 0.78 + 0.22*max(dot(vN, normalize(vec3(-0.4,0.6,0.8))), 0.0);
  vec3 pearl = mix(vec3(1.0), g, 0.45 + 0.35*sin(p.y*2.0+uT*0.5));
  vec3 c = mix(pearl*light, vec3(1.0), fres*0.55);
  gl_FragColor = vec4(c, 1.0);
}`;

export const SphereScene: React.FC<{r?: number}> = ({r = 300}) => {
  const f = useCurrentFrame();
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: sphereVert,
        fragmentShader: sphereFrag,
        uniforms: {uT: {value: 0}, cO: {value: srgb(P.o)}, cP: {value: srgb(P.p)}, cV: {value: srgb(P.v)}},
      }),
    [],
  );
  mat.uniforms.uT.value = f / 18;
  return (
    <ThreeCanvas width={W} height={H} orthographic camera={{zoom: 1, position: [0, 0, 1200]}} style={{position: 'absolute', inset: 0}}>
      <mesh rotation={[0.3, f / 40, 0.1]} position={[0, 0, 0]} material={mat}>
        <sphereGeometry args={[r, 96, 96]} />
      </mesh>
    </ThreeCanvas>
  );
};

/* ───────── Bureau 3D jour / nuit ───────── */
const screenTexture = (night: boolean) => {
  const c = document.createElement('canvas');
  c.width = 1200;
  c.height = 700;
  const g = c.getContext('2d')!;
  g.fillStyle = night ? '#111111' : '#FFFFFF';
  g.fillRect(0, 0, 1200, 700);
  const grad = g.createLinearGradient(150, 0, 1050, 0);
  grad.addColorStop(0, P.o);
  grad.addColorStop(0.5, P.p);
  grad.addColorStop(1, P.v);
  g.fillStyle = grad;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  if (night) {
    g.font = '900 150px Inter';
    g.fillText('Et même', 600, 270);
    g.fillText('le soir', 600, 440);
  } else {
    g.font = '900 210px Inter';
    g.fillText('Le jour', 600, 360);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

export const DeskScene: React.FC<{nightAt: number; textSwitch: number}> = ({nightAt, textSwitch}) => {
  const f = useCurrentFrame();
  const n = interpolate(f, [nightAt, nightAt + 10], [0, 1], cl);
  // attendre la police Inter 900 avant de dessiner les textures de l'écran
  const [tex, setTex] = useState<{day: THREE.Texture; night: THREE.Texture} | null>(null);
  const [handle] = useState(() => delayRender('police écran'));
  useEffect(() => {
    document.fonts
      .load('900 120px Inter')
      .catch(() => null)
      .then(() => {
        setTex({day: screenTexture(false), night: screenTexture(true)});
        // laisser React + three dessiner avec les textures avant de capturer
        requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => continueRender(handle), 60)));
      });
  }, [handle]);
  const day = tex?.day;
  const night = tex?.night;
  const bg = col(P.white).lerp(col('#111111'), n);
  const wall = col('#F4F4F6').lerp(col('#1a1a1d'), n);
  const push = interpolate(f, [0, 100], [0, 1], cl);
  const camZ = 6.4 - push * 0.9;
  return (
    <ThreeCanvas
      width={W}
      height={H}
      shadows
      camera={{fov: 40, position: [0.4, 2.4, camZ]}}
      style={{position: 'absolute', inset: 0}}
      onCreated={({camera}) => camera.lookAt(0, 1.75, 0)}
    >
      <color attach="background" args={[bg]} />
      <CamLook z={camZ} />
      <ambientLight intensity={1.0 - n * 0.82} />
      <directionalLight position={[3, 6, 5]} intensity={1.6 * (1 - n * 0.9)} castShadow shadow-mapSize={[1024, 1024]} />
      {/* lampe de bureau (allumée la nuit) */}
      <pointLight position={[-1.45, 2.35, 0.3]} intensity={n * 9} distance={6} color={P.o} castShadow />
      {/* mur + sol */}
      <mesh position={[0, 2.5, -1.2]} receiveShadow>
        <planeGeometry args={[14, 9]} />
        <meshStandardMaterial color={wall} roughness={0.9} emissive={col('#FFFFFF')} emissiveIntensity={0.62 * (1 - n)} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={wall} roughness={0.9} emissive={col('#FFFFFF')} emissiveIntensity={0.62 * (1 - n)} />
      </mesh>
      {/* bureau */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.1, 1.6]} />
        <meshStandardMaterial color={'#F2F2F2'} roughness={0.5} />
      </mesh>
      {[-1.9, 1.9].map((x) => (
        <mesh key={x} position={[x, 0.5, 0]} castShadow>
          <boxGeometry args={[0.08, 1.0, 1.4]} />
          <meshStandardMaterial color={'#DADBDF'} />
        </mesh>
      ))}
      {/* écran */}
      <group position={[0.15, 1.95, -0.25]}>
        <mesh castShadow>
          <boxGeometry args={[2.05, 1.25, 0.07]} />
          <meshStandardMaterial color={'#1b1b1e'} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[1.93, 1.13]} />
          <meshBasicMaterial key={f >= textSwitch ? 'n' : 'd'} map={f >= textSwitch ? night : day} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.78, -0.02]}>
          <boxGeometry args={[0.12, 0.35, 0.06]} />
          <meshStandardMaterial color={'#CFD0D4'} />
        </mesh>
        <mesh position={[0, -0.94, 0.05]}>
          <boxGeometry args={[0.6, 0.03, 0.35]} />
          <meshStandardMaterial color={'#CFD0D4'} />
        </mesh>
      </group>
      {/* clavier + tasse */}
      <mesh position={[0.15, 1.07, 0.45]} castShadow>
        <boxGeometry args={[1.1, 0.04, 0.32]} />
        <meshStandardMaterial color={P.white} />
      </mesh>
      <mesh position={[1.35, 1.17, 0.35]} castShadow>
        <cylinderGeometry args={[0.11, 0.1, 0.24, 24]} />
        <meshStandardMaterial color={P.o} roughness={0.4} />
      </mesh>
      {/* lampe */}
      <group position={[-1.45, 1.05, 0.2]}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.2, 0.05, 24]} />
          <meshStandardMaterial color={'#111111'} />
        </mesh>
        <mesh position={[0, 0.55, 0]} rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.025, 0.025, 1.1, 10]} />
          <meshStandardMaterial color={'#111111'} />
        </mesh>
        <mesh position={[0.12, 1.15, 0.05]} rotation={[0.3, 0, -0.5]}>
          <coneGeometry args={[0.24, 0.3, 24, 1, true]} />
          <meshStandardMaterial color={'#111111'} side={THREE.DoubleSide} emissive={col(P.o)} emissiveIntensity={n * 0.6} />
        </mesh>
      </group>
      {/* étagère + livres */}
      <mesh position={[0.2, 3.35, -1.0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.07, 0.4]} />
        <meshStandardMaterial color={'#E6E7EA'} />
      </mesh>
      {[P.o, P.p, P.v, '#B5B8BE', P.p, P.o, '#111111', P.v].map((c, i) => (
        <mesh key={i} position={[-1.1 + i * 0.17, 3.62, -1.0]} rotation={[0, 0, i === 6 ? 0.18 : 0]} castShadow>
          <boxGeometry args={[0.13, 0.42 + ((i * 7) % 4) * 0.04, 0.3]} />
          <meshStandardMaterial color={c} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[1.25, 3.55, -1.0]} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color={'#B5B8BE'} roughness={0.8} />
      </mesh>
    </ThreeCanvas>
  );
};

/** maintient le regard de la caméra vers l'écran pendant le travelling */
const CamLook: React.FC<{z: number}> = ({z}) => {
  const {camera} = useThree();
  camera.position.set(0.4, 2.4, z);
  camera.lookAt(0, 1.85, 0);
  return null;
};
