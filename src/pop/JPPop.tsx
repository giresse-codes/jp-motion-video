import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {DirBlur} from '../components';
import {
  Aura,
  cl,
  Collage,
  FONT,
  fit,
  GiantWord,
  GRAD_STATIC,
  GradText,
  gridLayout,
  ICONS,
  LogoPlate,
  P,
  Pill,
  rgba,
  ringLayout,
  useGradBg,
  usePop,
} from './kit';
import {DeskScene, mascotPath, SphereScene} from './three';

export const POP_DURATION = 1350;

/* Voix resserrée (assets/voix-off-pop.mp3, 43,8 s) — débuts de mots en frames (30 fps) :
 Toi 7 · oui toi 26 · tu as quelque part où aller 57–83 · une réunion 98 · un rendez-vous 120 · une idée 142
 qui ne peut pas attendre 152 · Wow 202 · Avec JP Service Express Urbaine 235–286 · ton chauffeur privé s'occupe de tout 293–334
 Éco 348 · Confort 375 · Aéroport 398 · Voyage 427 · Kribi 457 · Limbé 479 · Yaoundé 504 · Buea 530
 On t'y conduit 559 · tu actives le mode chauffeur 592–625 · et tu te détends le jour 640 · et même le soir 692–724
 Et la promo 737 · 10 000 francs 765 · pour 5 heures de chauffeur 807 · Service Éco 2 500 F l'heure 862 · Confort 3 500 F 943
 Écris JP sur WhatsApp 1000 · +237 1054 · 655 1089 · 394 1126 · 028 1158 · JP Service Express Urbaine 1191
 rapide 1243 · sûr 1268 · confortable 1292 (fin 1309) */

const Word: React.FC<{at: number; children: React.ReactNode; size: number; active?: boolean; color?: string}> = ({at, children, size, active, color}) => {
  const f = useCurrentFrame();
  const s = usePop(at, {damping: 11, stiffness: 220});
  const t = f - at;
  return (
    <DirBlur
      x={interpolate(t, [0, 7], [22, 0], cl)}
      style={{
        display: 'inline-block',
        opacity: t >= 0 ? 1 : 0,
        transform: `translateY(${(1 - s) * 40}px) scale(${0.6 + 0.4 * s})`,
      }}
    >
      {active ? (
        <GradText size={size}>{children}</GradText>
      ) : (
        <span style={{fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: '-0.05em', color: color ?? P.text, lineHeight: 1}}>{children}</span>
      )}
    </DirBlur>
  );
};

/* ───────── 1. HOOK ───────── */
const HookToi: React.FC<{shrinkAt?: number}> = ({shrinkAt = 9999}) => {
  const f = useCurrentFrame();
  const s = usePop(1, {damping: 8, stiffness: 150, mass: 0.8});
  const shrink = interpolate(f, [shrinkAt, shrinkAt + 6], [0, 1], {...cl, easing: Easing.in(Easing.cubic)});
  const size = fit('Toi.', 800);
  return (
    <AbsoluteFill>
      <Aura x={540} y={960} w={900 * Math.max(0.2, s)} h={1100 * Math.max(0.2, s)} opacity={0.45 * s * (1 - shrink)} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 960 - size * 0.56,
          textAlign: 'center',
          transform: `scale(${s * (1 - shrink * 0.85)})`,
          opacity: f >= 1 ? 1 - shrink : 0,
        }}
      >
        <GradText size={size}>Toi.</GradText>
      </div>
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame(); // local = global + 9
  const pill = usePop(35, {damping: 9, stiffness: 200});
  const up = usePop(64, {damping: 14, stiffness: 160});
  return (
    <AbsoluteFill>
      <HookToi shrinkAt={33} />
      {f >= 34 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 960 - 90 - up * 220, display: 'flex', justifyContent: 'center', transform: `scale(${pill})`}}>
          <Pill h={180} size={92}>
            Oui, toi.
          </Pill>
        </div>
      )}
      <div style={{position: 'absolute', top: 980, left: 70, right: 70, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 26, rowGap: 6}}>
        {(
          [
            ['Tu', 66],
            ['as', 69],
            ['quelque', 71],
            ['part', 76],
            ['où', 83],
            ['aller.', 88, true],
          ] as [string, number, boolean?][]
        ).map(([w, at, act]) => (
          <Word key={w} at={at} size={112} active={act}>
            {w}
          </Word>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ───────── 2. Collage « une idée » ───────── */
const IDEA_LAYOUT = ringLayout(20, 540, 960, 430, 720, 0.4).map((c) =>
  Math.abs(c.y - 960) < 230 ? {...c, y: 960 + Math.sign(c.y - 960 || 1) * (230 + Math.abs(c.y - 960) * 0.5)} : c,
);
const Swap: React.FC<{items: [string, number][]; size: number; y: number}> = ({items, size, y}) => {
  const f = useCurrentFrame();
  let idx = -1;
  items.forEach(([, at], i) => f >= at && (idx = i));
  return (
    <>
      {items.map(([t, at], i) => {
        const end = items[i + 1]?.[1] ?? 99999;
        if (f < at || f >= end + 6) return null;
        const pin = interpolate(f, [at, at + 7], [0, 1], {...cl, easing: Easing.out(Easing.back(2))});
        const pout = interpolate(f, [end, end + 6], [0, 1], cl);
        const [art, ...rest] = t.split(' ');
        return (
          <DirBlur
            key={t}
            y={(1 - pin) * 26 + pout * 26}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: y - size * 0.6,
              textAlign: 'center',
              opacity: Math.min(pin * 2, 1 - pout),
              transform: `translateY(${(1 - pin) * 90 - pout * 90}px)`,
              zIndex: 20,
            }}
          >
            <span style={{fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: '-0.05em', color: P.text}}>{art} </span>
            <GradText size={size}>{rest.join(' ')}</GradText>
          </DirBlur>
        );
      })}
      {idx < 0 ? null : null}
    </>
  );
};

const IdeaScene: React.FC = () => {
  const f = useCurrentFrame();
  const sub = usePop(57);
  return (
    <AbsoluteFill>
      <Aura x={540} y={960} w={760} h={620} opacity={0.32} />
      <Collage at={3} layout={IDEA_LAYOUT} implodeAt={92} />
      <Swap
        size={128}
        y={930}
        items={[
          ['une réunion', 3],
          ['un rendez-vous', 25],
          ['une idée', 47],
        ]}
      />
      <div
        style={{
          position: 'absolute',
          top: 1040,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 54,
          letterSpacing: '-0.03em',
          color: P.text,
          opacity: f >= 57 ? 1 : 0,
          transform: `scale(${sub})`,
          zIndex: 21,
        }}
      >
        qui ne peut pas attendre.
      </div>
    </AbsoluteFill>
  );
};

/* ───────── 3. Wow ───────── */
const WowScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{transform: `scale(${1 + f * 0.004})`}}>
      <Aura x={540} y={960} w={1000} h={900} opacity={0.4} />
      <GiantWord text="Wow." at={0} width={990} />
    </AbsoluteFill>
  );
};

/* ───────── 4. JP Service + logo + mascotte ───────── */
const JPScene: React.FC = () => {
  const f = useCurrentFrame();
  const pill = usePop(1, {damping: 12, stiffness: 180});
  const typedN = Math.max(0, Math.min(10, Math.floor((f - 3) / 2.4) + 1));
  const logo = usePop(29, {damping: 10, stiffness: 150});
  const toTop = usePop(26, {damping: 15, stiffness: 140});
  // traînée dégradée de la mascotte
  const start = 55;
  const pts: string[] = [];
  for (let t = Math.max(0, f - start - 16); t <= f - start; t += 1) {
    const {x, y} = mascotPath(t);
    pts.push(`${540 + x - 130},${960 - y + 10}`);
  }
  return (
    <AbsoluteFill>
      <Aura x={540} y={520} w={900} h={520} opacity={0.3} />
      {/* pilule dégradée qui tape « JP Service » */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: interpolate(toTop, [0, 1], [870, 330]),
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${pill * (1 - 0.35 * toTop)})`,
        }}
      >
        <Pill h={190} size={104} style={{minWidth: 700, justifyContent: 'flex-start'}}>
          {'JP Service'.slice(0, typedN)}
          <span style={{display: 'inline-block', width: 7, height: 104, background: P.white, marginLeft: 8, opacity: Math.floor(f / 7) % 2 ? 0.3 : 1}} />
        </Pill>
      </div>
      {f >= 28 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', transform: `scale(${logo}) rotate(${(1 - logo) * -8}deg)`}}>
          <LogoPlate w={820} />
        </div>
      )}
      {/* traînée */}
      {pts.length > 1 && (
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: 'blur(6px)'}}>
          <defs>
            <linearGradient id="trail" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor={P.v} stopOpacity="0" />
              <stop offset="0.5" stopColor={P.p} />
              <stop offset="1" stopColor={P.o} />
            </linearGradient>
          </defs>
          <polyline points={pts.join(' ')} fill="none" stroke="url(#trail)" strokeWidth={70} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
        </svg>
      )}
      {f >= start && f < start + 60 && (() => {
        const {x, y} = mascotPath(f - start);
        const n2 = mascotPath(f - start + 1);
        const ang = (Math.atan2(-(n2.y - y), n2.x - x) * 180) / Math.PI;
        const spd = Math.hypot(n2.x - x, n2.y - y);
        return (
          <DirBlur
            x={Math.min(18, spd * 0.35)}
            style={{
              position: 'absolute',
              left: 540 + x - 230,
              top: 960 - y - 120,
              width: 460,
              transform: `rotate(${ang * 0.6}deg)`,
            }}
          >
            <Img src={staticFile('pop-img/voiture-jouet.png')} style={{width: 460, transform: 'scaleX(-1)', filter: `drop-shadow(0 30px 30px ${rgba(P.v, 0.3)})`}} />
          </DirBlur>
        );
      })()}
      <div style={{position: 'absolute', top: 1330, left: 60, right: 60, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 22}}>
        <Word at={58} size={86}>
          ton
        </Word>
        <Word at={60} size={86}>
          chauffeur
        </Word>
        <Word at={64} size={86} active>
          privé
        </Word>
        <div style={{flexBasis: '100%', height: 0}} />
        <Word at={73} size={86}>
          s’occupe
        </Word>
        <Word at={77} size={86}>
          de
        </Word>
        <Word at={79} size={86}>
          tout.
        </Word>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── 5. Liste en roue + carte téléphone ───────── */
const SERVICES = [
  {name: 'Éco', price: '2 500 F/h', sub: 'Berline confortable', icon: 'car', img: 'voiture-photo.jpg', fit: 'cover'},
  {name: 'Confort', price: '3 500 F/h', sub: 'Wi-Fi · Clim · Mini écran', icon: 'star', img: 'pop-img/tv.png', fit: 'contain'},
  {name: 'Aéroport', price: 'dès 8 000 F', sub: 'Transfert Douala', icon: 'plane', img: '', fit: 'cover'},
  {name: 'Voyage', price: '50 000 F/jour', sub: 'Kribi · Limbé · Yaoundé', icon: 'palm', img: 'pop-img/kribi-plage.jpg', fit: 'cover'},
];
const WHEEL = ['Mariage', 'Navette', 'Éco', 'Confort', 'Aéroport', 'Voyage', 'Pack 5 h', 'Événement'];
const WheelScene: React.FC = () => {
  const f = useCurrentFrame();
  const sw = [3, 30, 53, 82];
  let a = 0;
  sw.forEach((s, i) => f >= s && (a = i));
  // position animée (spring) de la roue
  let pos = 0;
  sw.forEach((s, i) => {
    if (i === 0) return;
    const p = interpolate(f, [s, s + 9], [0, 1], {...cl, easing: Easing.out(Easing.back(1.6))});
    pos += p;
  });
  const center = 2 + pos;
  const ROW = 120;
  const card = usePop(sw[a], {damping: 11, stiffness: 200});
  const svc = SERVICES[a];
  const enter = usePop(0, {damping: 14, stiffness: 160});
  return (
    <AbsoluteFill>
      <Aura x={790} y={960} w={560} h={900} opacity={0.42} />
      {/* liste */}
      <div style={{position: 'absolute', left: 90, top: 960, width: 560, perspective: 900}}>
        {WHEEL.map((w, i) => {
          const d = i - center;
          const ang = d * 22;
          const y = Math.sin((ang * Math.PI) / 180) * ROW * 2.6;
          const isA = Math.abs(d) < 0.5;
          const op = interpolate(Math.abs(d), [0, 3.2], [1, 0], cl);
          return (
            <div
              key={w}
              style={{
                position: 'absolute',
                left: 0,
                top: y - 55,
                transform: `rotateX(${-ang}deg) translateX(${(1 - enter) * -300}px)`,
                opacity: op * enter,
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 96,
                letterSpacing: '-0.05em',
                color: isA ? P.text : P.gray,
                whiteSpace: 'nowrap',
              }}
            >
              <div style={{width: 30, height: 30, borderRadius: 15, background: P.red, opacity: isA ? 1 : 0, transform: `scale(${isA ? card : 0})`}} />
              {w}
            </div>
          );
        })}
      </div>
      {/* carte téléphone */}
      <div
        style={{
          position: 'absolute',
          left: 640,
          top: 960 - 330,
          width: 360,
          height: 660,
          borderRadius: 56,
          background: P.white,
          border: `10px solid ${P.text}`,
          boxSizing: 'border-box',
          boxShadow: `0 50px 100px ${rgba(P.p, 0.3)}, 0 20px 40px ${rgba(P.v, 0.18)}`,
          overflow: 'hidden',
          transform: `translateY(${(1 - enter) * 600}px) rotate(${4 - enter * 4 + Math.sin(f / 20) * 1.5}deg)`,
        }}
      >
        <div style={{position: 'absolute', top: 14, left: '50%', width: 100, height: 28, marginLeft: -50, borderRadius: 14, background: P.text}} />
        <div key={a} style={{position: 'absolute', inset: 0, padding: '80px 30px 30px', transform: `translateY(${(1 - card) * 120}px)`, opacity: Math.min(1, card * 2)}}>
          {svc.img ? (
            <div style={{width: '100%', height: 170, borderRadius: 26, overflow: 'hidden', background: svc.fit === 'contain' ? P.white : '#eee', boxShadow: `0 16px 30px ${rgba(P.v, 0.2)}`}}>
              <Img src={staticFile(svc.img)} style={{width: '100%', height: '100%', objectFit: svc.fit as 'cover' | 'contain'}} />
            </div>
          ) : (
            <div style={{width: '100%', height: 170, borderRadius: 26, background: GRAD_STATIC, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 16px 30px ${rgba(P.v, 0.2)}`}}>
              <svg viewBox="0 0 100 100" width={96} height={96}>
                {ICONS[svc.icon]}
              </svg>
            </div>
          )}
          <div style={{marginTop: 24, fontFamily: FONT, fontWeight: 900, fontSize: 56, letterSpacing: '-0.05em', color: P.text}}>{svc.name}</div>
          <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 24, color: P.gray, marginTop: 6}}>{svc.sub}</div>
          <div style={{marginTop: 26}}>
            <GradText size={svc.price.length > 11 ? 42 : svc.price.length > 9 ? 52 : 62}>{svc.price}</GradText>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 36,
              left: 30,
              right: 30,
              height: 84,
              borderRadius: 42,
              background: P.text,
              color: P.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 30,
            }}
          >
            Réserver
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── 6. Sphère + villes en orbite ───────── */
const CITY_IMG: Record<string, string> = {Kribi: 'kribi-gites.jpg', Yaoundé: 'yaounde.jpg', Buea: 'buea.jpg', Ouest: 'ouest.jpg'};
const CityCard: React.FC<{name: string}> = ({name}) => {
  const img = CITY_IMG[name];
  return (
    <div
      style={{
        position: 'relative',
        margin: '0 auto',
        width: 720,
        height: 400,
        borderRadius: 44,
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${P.p}, ${P.v})`,
        boxShadow: `0 40px 80px ${rgba(P.v, 0.25)}`,
      }}
    >
      {img && <Img src={staticFile(`pop-img/${img}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(17,17,17,0) 45%, rgba(17,17,17,0.72) 100%)'}} />
      <div style={{position: 'absolute', left: 40, bottom: 28, display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT, fontWeight: 900, fontSize: 84, letterSpacing: '-0.05em', color: P.white}}>
        <div style={{width: 22, height: 22, borderRadius: 11, background: P.red}} />
        {name}
      </div>
    </div>
  );
};
const CITIES: [string, number][] = [
  ['Kribi', 5],
  ['Limbé', 27],
  ['Yaoundé', 52],
  ['Buea', 78],
  ['Ouest', 88],
];
const SphereSceneWrap: React.FC = () => {
  const f = useCurrentFrame();
  const s = usePop(0, {damping: 12, stiffness: 120});
  let active = -1;
  CITIES.forEach(([, at], i) => f >= at && (active = i));
  const label = (i: number, front: boolean) => {
    const [name, at] = CITIES[i];
    const a = (i / CITIES.length) * Math.PI * 2 + f / 26;
    const z = Math.sin(a);
    if (front !== z >= 0) return null;
    const x = 540 + Math.cos(a) * 400;
    const y = 960 + Math.sin(a) * 150 - Math.cos(a) * 120;
    const p = interpolate(f - at, [0, 8], [0, 1], {...cl, easing: Easing.out(Easing.back(2.2))});
    const sc = (0.75 + 0.3 * z) * p;
    const isA = i === active;
    return (
      <div
        key={name}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: `translate(-50%,-50%) scale(${sc * (isA ? 1.18 : 1)})`,
          opacity: p,
          filter: z < 0 ? 'blur(2px)' : undefined,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 28px',
          borderRadius: 40,
          background: P.white,
          boxShadow: `0 18px 40px ${rgba(P.p, 0.25)}`,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: '-0.03em',
          color: P.text,
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{width: 18, height: 18, borderRadius: 9, background: P.red}} />
        {name}
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Aura x={540} y={960} w={760} h={900} opacity={0.3} />
      {CITIES.map((_, i) => label(i, false))}
      <AbsoluteFill style={{transform: `scale(${s})`}}>
        <SphereScene r={340} />
      </AbsoluteFill>
      {CITIES.map((_, i) => label(i, true))}
      {/* grande ville active en haut */}
      <div style={{position: 'absolute', top: 150, left: 0, right: 0, height: 420}}>
        {CITIES.map(([name, at], i) => {
          const end = CITIES[i + 1]?.[1] ?? 9999;
          if (f < at || f >= end + 5) return null;
          const pin = interpolate(f, [at, at + 7], [0, 1], {...cl, easing: Easing.out(Easing.back(2))});
          const pout = interpolate(f, [end, end + 5], [0, 1], cl);
          return (
            <DirBlur key={name} y={(1 - pin) * 20 + pout * 20} style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', opacity: Math.min(1, pin * 2) * (1 - pout), transform: `translateY(${(1 - pin) * 70 - pout * 70}px)`}}>
              <CityCard name={name} />
            </DirBlur>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ───────── 7. Interrupteur ON ───────── */
const GRID = gridLayout(4, 6, 760, 980, 540, 830);
const SwitchScene: React.FC = () => {
  const f = useCurrentFrame();
  const CLICK = 51;
  const k = usePop(CLICK, {damping: 13, stiffness: 260});
  const appear = usePop(0, {damping: 11, stiffness: 160});
  const on = f >= CLICK;
  const lbl = usePop(CLICK + 2);
  const trackCol = on ? P.text : P.gray;
  return (
    <AbsoluteFill>
      {on && <Collage at={CLICK} layout={GRID} cx={540} cy={830} />}
      <div style={{position: 'absolute', top: 400, left: 60, right: 60, display: 'flex', justifyContent: 'center', columnGap: 26, zIndex: 30}}>
        <Word at={4} size={120}>
          On t’y
        </Word>
        <Word at={10} size={120} active>
          conduit.
        </Word>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 540 - 230,
          top: 900,
          width: 460,
          height: 240,
          borderRadius: 120,
          background: trackCol,
          transform: `scale(${appear * (1 + (on ? 0.06 * Math.sin(Math.min(1, (f - CLICK) / 8) * Math.PI) : 0))})`,
          boxShadow: on ? `0 30px 80px ${rgba(P.text, 0.35)}` : '0 30px 60px rgba(17,17,17,0.12)',
          zIndex: 30,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20 + k * 220,
            width: 200,
            height: 200,
            borderRadius: 100,
            background: P.white,
            boxShadow: '0 12px 30px rgba(17,17,17,0.22)',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1200,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 72,
          letterSpacing: '-0.045em',
          color: P.text,
          zIndex: 30,
          opacity: f >= CLICK + 2 ? 1 : 0,
          transform: `scale(${lbl})`,
        }}
      >
        Mode chauffeur : <span style={{color: P.red}}>ON</span>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── 9. Compteur + barres ───────── */
const CounterScene: React.FC = () => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [4, 30], [0, 10000], {...cl, easing: Easing.out(Easing.cubic)}) / 50) * 50;
  const txt = v.toLocaleString('fr-FR').replace(/ | |,/g, ' ');
  const head = usePop(2);
  const land = usePop(30, {damping: 8, stiffness: 260});
  const sub = usePop(72);
  const bars = [0.25, 0.38, 0.3, 0.5, 0.45, 0.66, 0.6, 0.82, 1];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${head})`}}>
        <Pill h={120} size={58}>
          Et la promo ?
        </Pill>
      </div>
      {/* barres dégradées qui montent */}
      <div style={{position: 'absolute', left: 40, right: 40, bottom: 0, height: 900, display: 'flex', alignItems: 'flex-end', gap: 14}}>
        {bars.map((b, i) => {
          const g = interpolate(f, [6 + i * 3, 30 + i * 3], [0, 1], {...cl, easing: Easing.out(Easing.back(1.4))});
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${b * 100 * g}%`,
                borderRadius: '24px 24px 0 0',
                background: `linear-gradient(180deg, ${P.v} 0%, ${P.p} 55%, ${P.o} 100%)`,
                opacity: 0.9,
                boxShadow: `0 -10px 40px ${rgba(P.p, 0.25)}`,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 230,
          letterSpacing: '-0.06em',
          color: P.text,
          fontVariantNumeric: 'tabular-nums',
          transform: `scale(${f >= 30 ? 0.9 + 0.1 * land : 1})`,
        }}
      >
        {txt} F
      </div>
      <div
        style={{
          position: 'absolute',
          top: 830,
          left: 60,
          right: 60,
          textAlign: 'center',
          fontFamily: FONT,
          opacity: f >= 72 ? 1 : 0,
          transform: `scale(${sub})`,
        }}
      >
        <div style={{fontWeight: 900, fontSize: 70, letterSpacing: '-0.045em', color: P.text}}>= 5 heures de chauffeur</div>
        <div style={{fontWeight: 700, fontSize: 42, color: P.text, opacity: 0.55, marginTop: 10}}>(Éco, dès 5 h : 2 000 F/h)</div>
      </div>
    </AbsoluteFill>
  );
};

const PriceScene: React.FC = () => {
  const f = useCurrentFrame();
  const items: [string, string, number][] = [
    ['Service Éco', '2 500 F/h', 7],
    ['Service Confort', '3 500 F/h', 88],
  ];
  const springs = [usePop(items[0][2], {damping: 9, stiffness: 170}), usePop(items[1][2], {damping: 9, stiffness: 170})];
  return (
    <AbsoluteFill>
      <Aura x={540} y={960} w={900} h={760} opacity={0.35} />
      {items.map(([lab, price, at], i) => {
        const end = items[i + 1]?.[2] ?? 9999;
        if (f < at - 1 || f >= end + 6) return null;
        const s = springs[i];
        const pout = interpolate(f, [end, end + 6], [0, 1], cl);
        const size = 170; // taille fixe : « 3 500 F/h » tient dans la largeur même pendant le rebond
        return (
          <DirBlur key={lab} x={pout * 40} style={{position: 'absolute', inset: 0, opacity: 1 - pout, transform: `translateX(${-pout * 300}px)`}}>
            <div style={{position: 'absolute', top: 700, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${s})`}}>
              <Pill h={120} size={56}>
                {lab}
              </Pill>
            </div>
            <div style={{position: 'absolute', top: 880, left: 0, right: 0, textAlign: 'center', transform: `scale(${s}) rotate(${(1 - s) * -6}deg)`}}>
              <GradText size={size}>{price}</GradText>
            </div>
            <div style={{position: 'absolute', top: 880 + size * 1.1, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 48, color: P.text, opacity: s}}>
              {i === 0 ? 'l’heure' : 'l’heure · promo'}
            </div>
          </DirBlur>
        );
      })}
    </AbsoluteFill>
  );
};

/* ───────── 10. CTA ───────── */
const Digit: React.FC<{ch: string; at: number; size: number}> = ({ch, at, size}) => {
  const f = useCurrentFrame();
  const s = usePop(at, {damping: 8, stiffness: 280, mass: 0.5});
  return (
    <span style={{display: 'inline-block', transform: `scale(${f >= at ? s : 0}) translateY(${(1 - s) * 30}px)`, fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: '-0.04em', color: P.text, width: ch === ' ' ? size * 0.25 : undefined}}>
      {ch === ' ' ? ' ' : ch}
    </span>
  );
};
export const DIGIT_POPS: number[] = [];
const numGroups: [string, number][] = [
  ['+237', 59],
  ['655', 94],
  ['394', 131],
  ['028', 163],
];
numGroups.forEach(([g, at]) => g.split('').forEach((_, j) => DIGIT_POPS.push(995 + at + j * 3)));

const CTAScene: React.FC = () => {
  const f = useCurrentFrame();
  const pill = usePop(5, {damping: 9, stiffness: 160});
  const arrow = usePop(172, {damping: 9, stiffness: 180});
  const wa = usePop(14, {damping: 8, stiffness: 200});
  const bg = useGradBg();
  return (
    <AbsoluteFill>
      <Aura x={540} y={520} w={1000} h={600} opacity={0.35} />
      <div style={{position: 'absolute', top: 300, left: 50, right: 50, display: 'flex', justifyContent: 'center', transform: `scale(${pill}) rotate(${(1 - pill) * -5}deg)`}}>
        <Pill h={330} size={104} style={{flexDirection: 'column', lineHeight: 1.05, width: 980, padding: 0}}>
          <div>Écris «&nbsp;JP&nbsp;»</div>
          <div>sur WhatsApp</div>
        </Pill>
      </div>
      <div style={{position: 'absolute', left: 30, top: 230, transform: `scale(${wa}) rotate(${(1 - wa) * -30 - 8}deg)`}}>
        <Img src={staticFile('pop-img/whatsapp.png')} style={{width: 190, filter: `drop-shadow(0 20px 30px ${rgba(P.v, 0.3)})`}} />
      </div>
      <div style={{position: 'absolute', top: 760, left: 0, right: 0, textAlign: 'center'}}>
        {'+237'.split('').map((c, j) => (
          <Digit key={'a' + j} ch={c} at={59 + j * 3} size={130} />
        ))}
      </div>
      <div style={{position: 'absolute', top: 920, left: 0, right: 0, textAlign: 'center', whiteSpace: 'nowrap'}}>
        {numGroups.slice(1).flatMap(([g, at], gi) => [
          ...g.split('').map((c, j) => <Digit key={gi + '-' + j} ch={c} at={at + j * 3} size={150} />),
          gi < 2 ? <Digit key={gi + 's'} ch=" " at={at} size={150} /> : null,
        ])}
      </div>
      <div style={{position: 'absolute', top: 1180, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: f >= 172 ? 1 : 0, transform: `scale(${arrow})`}}>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 70, letterSpacing: '-0.045em', color: P.text}}>
          Réserve maintenant <span style={{fontFamily: 'Noto Color Emoji'}}>👇</span>
        </div>
        <svg width={120} height={170} viewBox="0 0 120 170" style={{marginTop: 16, transform: `translateY(${Math.sin(f / 4) * 14}px)`}}>
          <defs>
            <linearGradient id="arr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={P.red} />
              <stop offset="1" stopColor={P.red} />
            </linearGradient>
          </defs>
          <path d="M60 10 L60 140 M18 100 L60 150 L102 100" fill="none" stroke="url(#arr)" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{width: 0, height: 0, ...bg}} />
      </div>
    </AbsoluteFill>
  );
};

/* ───────── 11. Outro ───────── */
const OutroScene: React.FC = () => {
  const f = useCurrentFrame();
  const s = usePop(6, {damping: 10, stiffness: 140});
  const out = interpolate(f, [147, 155], [0, 1], {...cl, easing: Easing.in(Easing.cubic)});
  const words: [string, number][] = [
    ['Rapide.', 58],
    ['Sûr.', 83],
    ['Confortable.', 107],
  ];
  let act = -1;
  words.forEach(([, at], i) => f >= at && (act = i));
  return (
    <AbsoluteFill style={{opacity: 1 - out, transform: `scale(${1 - out * 0.4})`, filter: out > 0 ? `blur(${out * 16}px)` : undefined}}>
      <Aura x={540} y={860} w={900} h={600} opacity={0.35 * s} />
      <div style={{position: 'absolute', top: 720, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${s}) rotate(${(1 - s) * 6}deg)`}}>
        <LogoPlate w={860} />
      </div>
      <div style={{position: 'absolute', top: 1110, left: 40, right: 40, display: 'flex', justifyContent: 'center', columnGap: 22}}>
        {words.map(([w, at], i) => (
          <Word key={w} at={at} size={78} active={i === act} color={P.gray}>
            {w}
          </Word>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ───────── Composition ───────── */
const S: React.FC<{from: number; to: number; children: React.ReactNode; name: string}> = ({from, to, children, name}) => (
  <Sequence from={from} durationInFrames={to - from} name={name}>
    {children}
  </Sequence>
);

const sfx = (file: string, frames: number[], vol: number, len = 20) =>
  frames.map((fr) => (
    <Sequence key={file + fr} from={fr} durationInFrames={len}>
      <Audio src={staticFile(`sfx-pop/${file}.wav`)} volume={vol} />
    </Sequence>
  ));

export const JPPop: React.FC = () => (
  <AbsoluteFill style={{background: P.white}}>
    <Sequence from={-9} durationInFrames={105} name="1 Hook">
      <Hook />
    </Sequence>
    <S from={96} to={202} name="2 Idée">
      <IdeaScene />
    </S>
    <S from={202} to={235} name="3 Wow">
      <WowScene />
    </S>
    <S from={235} to={345} name="4 JP Service">
      <JPScene />
    </S>
    <S from={345} to={452} name="5 Roue">
      <WheelScene />
    </S>
    <S from={452} to={555} name="6 Sphère">
      <SphereSceneWrap />
    </S>
    <S from={555} to={635} name="7 Interrupteur">
      <SwitchScene />
    </S>
    <S from={635} to={735} name="8 Bureau">
      <DeskScene nightAt={60} textSwitch={68} />
    </S>
    <S from={735} to={855} name="9 Compteur">
      <CounterScene />
    </S>
    <S from={855} to={995} name="9b Prix">
      <PriceScene />
    </S>
    <S from={995} to={1185} name="10 CTA">
      <CTAScene />
    </S>
    <S from={1185} to={1340} name="11 Outro">
      <OutroScene />
    </S>
    {/* boucle : « Toi. » commence à apparaître (identique à la frame 0) */}
    <Sequence from={1340} durationInFrames={10} name="Boucle">
      <HookToi />
    </Sequence>

    {/* SON */}
    <Audio src={staticFile('voix-off-pop.mp3')} />
    <Audio src={staticFile('musique-pop.mp3')} volume={0.25} />
    {sfx('pop', [0, 26, 57, 98, 120, 142, 202, 237, 264, 293, 348, 375, 398, 427, 457, 479, 504, 530, 540, 559, 737, 765, 807, 862, 943, 1000, 1167, 1191, 1243, 1268, 1292], 0.35, 8)}
    {sfx('pop', DIGIT_POPS, 0.22, 6)}
    {sfx('whoosh', [96, 187, 345, 452, 606, 855, 995], 0.45, 20)}
    {sfx('click', [606], 0.7, 8)}
    {sfx('whoosh', [288, 318], 0.5, 20)}
    {sfx('tick', Array.from({length: 13}, (_, i) => 739 + i * 2), 0.4, 3)}
  </AbsoluteFill>
);
