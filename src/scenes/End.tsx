import React from 'react';
import QRCode from 'qrcode';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Banner, Card, clamp, DirBlur, FloorShadow, Line, Word, useSpring} from '../components';
import {LockScreen, Phone} from '../Phone';
import {C, SANS, SERIF, SHADOW_SOFT} from '../theme';

const ic = {fill: 'none', stroke: C.black, strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
const Icons: Record<string, React.ReactNode> = {
  wifi: (
    <svg viewBox="0 0 100 100" width={120} height={120}>
      <path d="M12 40 Q50 6 88 40" {...ic} />
      <path d="M25 55 Q50 32 75 55" {...ic} />
      <path d="M38 70 Q50 59 62 70" {...ic} />
      <circle cx="50" cy="82" r="6" fill={C.black} />
    </svg>
  ),
  clim: (
    <svg viewBox="0 0 100 100" width={120} height={120}>
      {[0, 60, 120].map((a) => (
        <g key={a} transform={`rotate(${a} 50 50)`}>
          <path d="M50 10 L50 90" {...ic} />
          <path d="M40 18 L50 28 L60 18 M40 82 L50 72 L60 82" {...ic} strokeWidth={6} />
        </g>
      ))}
    </svg>
  ),
  screen: (
    <svg viewBox="0 0 100 100" width={120} height={120}>
      <rect x="12" y="18" width="76" height="50" rx="8" {...ic} />
      <path d="M50 68 L50 82 M34 84 L66 84" {...ic} />
      <path d="M44 34 L60 43 L44 52 Z" fill={C.black} />
    </svg>
  ),
  door: (
    <svg viewBox="0 0 100 100" width={120} height={120}>
      <path d="M22 88 L22 26 Q22 14 36 12 L78 12 L78 88 Z" {...ic} />
      <path d="M22 50 L78 50" {...ic} strokeWidth={5} />
      <path d="M58 60 L70 60" {...ic} />
      <path d="M86 30 Q96 50 86 70" {...ic} strokeWidth={5} />
    </svg>
  ),
};

/** Scène 7 : 4 cartes blanches en éventail */
export const AmenitiesScene: React.FC = () => {
  const t = useCurrentFrame();
  const cards: {icon: string; label: React.ReactNode; at: number}[] = [
    {icon: 'wifi', label: 'Wi-Fi', at: 8},
    {icon: 'clim', label: 'Clim', at: 29},
    {icon: 'screen', label: 'Mini écran', at: 61},
    {
      icon: 'door',
      label: (
        <>
          Porte <span style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: '1.12em'}}>ouverte</span>
        </>
      ),
      at: 98,
    },
  ];
  const fan = [-21, -7, 7, 21];
  const xs = [-285, -95, 95, 285];
  const ys = [70, 8, 8, 70];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 220, left: 120, right: 120}}>
        <Line size={84} words={[['Le', 2], ['confort', 7, true], ['à', 14], ['bord.', 18]]} />
      </div>
      <FloorShadow w={820} opacity={0.12} style={{left: 130, top: 1420}} />
      <div style={{position: 'absolute', left: 540, top: 1010, transform: `rotate(${Math.sin(t / 30) * 1.5}deg) translateY(${Math.sin(t / 22) * 6}px)`}}>
        {cards.map((c, i) => {
          const f = t - c.at;
          const s = useSpring(c.at, {damping: 13, stiffness: 130, mass: 0.8});
          const blur = interpolate(f, [0, 8], [36, 0], clamp);
          return (
            <DirBlur
              key={i}
              y={blur}
              style={{
                position: 'absolute',
                left: -135,
                top: -185,
                opacity: interpolate(f, [0, 3], [0, 1], clamp),
                transform: `translate(${xs[i]}px, ${interpolate(s, [0, 1], [700, ys[i]])}px) rotate(${interpolate(s, [0, 1], [fan[i] * 2.4, fan[i] * (1 + Math.sin((t + i * 9) / 26) * 0.06)])}deg)`,
                transformOrigin: '50% 140%',
                zIndex: i,
              }}
            >
              <Card
                radius={36}
                style={{
                  width: 270,
                  height: 370,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '62px 16px 44px',
                  boxSizing: 'border-box',
                }}
              >
                {Icons[c.icon]}
                <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, letterSpacing: '-0.03em', color: C.black, textAlign: 'center', lineHeight: 1.05}}>
                  {c.label}
                </div>
              </Card>
            </DirBlur>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Check: React.FC<{size: number; p: number}> = ({size, p}) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <path
      d="M28 52 L44 67 L73 36"
      fill="none"
      stroke={C.white}
      strokeWidth={10}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={80}
      strokeDashoffset={80 * (1 - p)}
    />
  </svg>
);

/** Scène 8 : carte de tampons « Pack Éco » */
export const StampsScene: React.FC = () => {
  const t = useCurrentFrame();
  const cs = useSpring(0, {damping: 15, stiffness: 100});
  const ticks = [14, 26, 38, 50, 63];
  const label = useSpring(70, {damping: 11, stiffness: 160});
  const press = interpolate(t, [80, 84, 90], [1, 0.95, 1], clamp);
  return (
    <AbsoluteFill style={{perspective: 1800}}>
      <div style={{position: 'absolute', top: 200, left: 120, right: 120}}>
        <Line size={84} words={[['Service', 5], ['Éco', 10, true]]} />
      </div>
      <FloorShadow w={760} opacity={0.12} style={{left: 160, top: 1400}} />
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 440,
          transform: `translateY(${interpolate(cs, [0, 1], [700, 0]) + Math.sin(t / 15) * 6}px) rotateX(${interpolate(cs, [0, 1], [50, 4])}deg) rotateZ(${interpolate(cs, [0, 1], [8, 0.8])}deg)`,
        }}
      >
        <Card style={{width: 840, padding: '56px 60px 56px', boxSizing: 'border-box'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: SANS}}>
            <div style={{fontWeight: 700, fontSize: 40, letterSpacing: '-0.02em', color: C.black}}>Pack Éco</div>
            <div style={{fontWeight: 600, fontSize: 28, color: C.gray, border: `2px solid ${C.gray}`, borderRadius: 30, padding: '6px 18px'}}>Promo</div>
          </div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 22, marginTop: 18, fontFamily: SANS}}>
            <div style={{fontWeight: 800, fontSize: 112, letterSpacing: '-0.05em', color: C.black}}>
              2 500 F<span style={{fontSize: 52, letterSpacing: '-0.02em'}}>/h</span>
            </div>
            <div style={{fontWeight: 600, fontSize: 40, color: C.gray, textDecoration: 'line-through'}}>3 000 F</div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 40}}>
            {ticks.map((at, i) => {
              const p = useSpring(at, {damping: 12, stiffness: 220, mass: 0.6});
              const last = i === 4;
              const halo = interpolate(t - at, [0, 22], [0, 1], clamp);
              return (
                <div key={i} style={{position: 'relative', width: 128, height: 128}}>
                  {last && t >= at && (
                    <>
                      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `3px solid ${C.gray}`, transform: `scale(${1 + halo * 0.9})`, opacity: 1 - halo}} />
                      <div style={{position: 'absolute', inset: -14, borderRadius: '50%', background: 'rgba(139,143,150,0.22)', transform: `scale(${0.8 + 0.25 * Math.min(1, halo * 2)})`, opacity: Math.min(1, halo * 3)}} />
                    </>
                  )}
                  <div style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `3px solid ${C.gray}`, opacity: 0.6}} />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: C.black,
                      transform: `scale(${p})`,
                      boxShadow: '0 12px 24px rgba(14,14,16,0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {last ? (
                      <div style={{color: C.white, fontFamily: SANS, fontWeight: 800, fontSize: 40, opacity: interpolate(t - at, [4, 10], [0, 1], clamp)}}>1 h</div>
                    ) : (
                      <Check size={96} p={interpolate(t - at, [2, 9], [0, 1], clamp)} />
                    )}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: 140,
                      width: '100%',
                      textAlign: 'center',
                      fontFamily: SANS,
                      fontWeight: 600,
                      fontSize: 26,
                      color: C.gray,
                    }}
                  >
                    {i + 1} h
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 56, height: 74}}>
            <div
              style={{
                opacity: label,
                transform: `translateY(${(1 - label) * 30}px) scale(${0.7 + 0.3 * label})`,
                transformOrigin: 'right center',
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 46,
                letterSpacing: '-0.03em',
                color: C.black,
              }}
            >
              1 heure <span style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: 54}}>offerte</span>
            </div>
          </div>
          <div
            style={{
              marginTop: 26,
              background: C.black,
              color: C.white,
              borderRadius: 28,
              height: 116,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 44,
              letterSpacing: '-0.02em',
              transform: `scale(${press})`,
              boxShadow: '0 20px 40px rgba(14,14,16,0.2)',
            }}
          >
            Réserver 5 h
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

/** Chiffre qui défile verticalement avec flou */
const Roll: React.FC<{values: string[]; switches: number[]; size: number}> = ({values, switches, size}) => {
  const t = useCurrentFrame();
  let idx = 0;
  switches.forEach((s, i) => {
    if (t >= s) idx = i + 1;
  });
  const lastSwitch = idx > 0 ? switches[idx - 1] : -100;
  const p = interpolate(t - lastSwitch, [0, 9], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'relative', height: size * 1.08, overflow: 'hidden'}}>
      {idx > 0 && p < 1 && (
        <DirBlur y={p * 18} style={{position: 'absolute', transform: `translateY(${-p * size}px)`, opacity: 1 - p}}>
          {values[idx - 1]}
        </DirBlur>
      )}
      <DirBlur y={(1 - p) * 18} style={{position: 'absolute', transform: `translateY(${(1 - p) * size}px)`}}>
        {values[idx]}
      </DirBlur>
    </div>
  );
};

/** Scène 9 : trois cartes graphiques en perspective */
export const PricesScene: React.FC = () => {
  const t = useCurrentFrame();
  const s = useSpring(0, {damping: 16, stiffness: 90});
  const sw = [18, 33];
  const pts = [
    [70, 70],
    [260, 175],
    [450, 280],
  ];
  const seg = (a: number, b: number) => interpolate(t, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const prog = [1, seg(18, 28), seg(33, 43)];
  // path lissé
  const d = `M${pts[0][0]} ${pts[0][1]} C ${pts[0][0] + 90} ${pts[0][1]}, ${pts[1][0] - 90} ${pts[1][1]}, ${pts[1][0]} ${pts[1][1]} C ${pts[1][0] + 90} ${pts[1][1]}, ${pts[2][0] - 90} ${pts[2][1]}, ${pts[2][0]} ${pts[2][1]}`;
  const total = (prog[1] + prog[2]) / 2;
  const labels = ['Prix normal', 'Promo', 'Dès 5 h'];
  const active = t >= 33 ? 2 : t >= 18 ? 1 : 0;
  const conf = useSpring(76, {damping: 14, stiffness: 120});
  const swing = interpolate(conf, [0, 1], [0, -10]);

  const side = (x: number, ry: number, title: string, value: string) => (
    <div
      style={{
        position: 'absolute',
        left: x < 0 ? 10 : 1080 - 10 - 460,
        top: 660,
        transform: `translateY(${(1 - s) * 500}px) rotateY(${ry * 0.7 + swing}deg) scale(0.82)`,
        filter: 'blur(4px)',
        opacity: 0.75 * s,
      }}
    >
      <Card radius={36} style={{width: 460, height: 620, padding: 44, boxSizing: 'border-box', fontFamily: SANS}}>
        <div style={{fontWeight: 600, fontSize: 30, color: C.gray}}>{title}</div>
        <div style={{fontWeight: 800, fontSize: 92, letterSpacing: '-0.05em', color: C.black, marginTop: 8}}>{value}</div>
        <div style={{marginTop: 60, display: 'flex', alignItems: 'flex-end', gap: 22, height: 240}}>
          {[0.5, 0.7, 0.45, 0.9, 0.65].map((h, i) => (
            <div key={i} style={{flex: 1, height: `${h * 100}%`, background: i === 3 ? C.black : '#D9DBDE', borderRadius: 10}} />
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 170, left: 120, right: 120}}>
        <Line size={76} words={[['Dès', 0], ['5', 4], ['h,', 7], ['encore', 12], ['moins', 18, true], ['cher.', 23]]} />
      </div>
      <FloorShadow w={760} opacity={0.12} style={{left: 160, top: 1380}} />
      <AbsoluteFill style={{perspective: 1600, perspectiveOrigin: '50% 45%'}}>
        {side(-330, 42, 'Éco', '2 500 F')}
        {side(330, -42, 'Confort', '3 500 F')}
        <div
          style={{
            position: 'absolute',
            left: 540 - 300,
            top: 560,
            transform: `translateY(${interpolate(s, [0, 1], [700, 0]) + Math.sin(t / 16) * 6}px) rotateY(${interpolate(s, [0, 1], [-40, -8]) + swing}deg) rotateX(${interpolate(s, [0, 1], [30, 6])}deg)`,
          }}
        >
          <Card radius={40} style={{width: 600, height: 760, padding: '48px 50px', boxSizing: 'border-box', fontFamily: SANS}}>
            <div style={{fontWeight: 600, fontSize: 32, color: C.gray}}>Tarif horaire · Éco</div>
            <div style={{fontWeight: 800, fontSize: 124, letterSpacing: '-0.05em', color: C.black, marginTop: 6}}>
              <Roll values={['3 000 F', '2 500 F', '2 000 F']} switches={sw} size={124} />
            </div>
            <svg width={500} height={380} style={{marginTop: 20, overflow: 'visible'}}>
              <defs>
                <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={C.gray} stopOpacity={0.28} />
                  <stop offset="1" stopColor={C.gray} stopOpacity={0} />
                </linearGradient>
                <clipPath id="reveal">
                  <rect x={0} y={0} width={70 + 380 * total} height={400} />
                </clipPath>
              </defs>
              {[70, 175, 280].map((y) => (
                <line key={y} x1={20} x2={490} y1={y} y2={y} stroke="#D9DBDE" strokeWidth={2} />
              ))}
              <path d={`${d} L ${pts[2][0]} 330 L ${pts[0][0]} 330 Z`} fill="url(#area)" clipPath="url(#reveal)" />
              <path d={d} fill="none" stroke={C.black} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - total} />
              {pts.map(([x, y], i) => {
                const on = prog[i] >= 0.98;
                const big = i === active;
                return (
                  <g key={i} opacity={on ? 1 : 0}>
                    {big && <circle cx={x} cy={y} r={30} fill={C.gray} opacity={0.25} />}
                    <circle cx={x} cy={y} r={big ? 16 : 10} fill={big ? C.black : C.white} stroke={C.black} strokeWidth={5} />
                  </g>
                );
              })}
              {labels.map((l, i) => (
                <text
                  key={l}
                  x={pts[i][0]}
                  y={372}
                  textAnchor="middle"
                  fontFamily="Inter"
                  fontWeight={i === active ? 700 : 600}
                  fontSize={28}
                  fill={i === active ? C.black : C.gray}
                >
                  {l}
                </text>
              ))}
            </svg>
          </Card>
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 1440,
          left: 120,
          right: 120,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 22,
        }}
      >
        <Word at={76} size={64} serif>
          Confort :
        </Word>
        <Word at={84} size={64}>
          3 500 F/h
        </Word>
        <div
          style={{
            opacity: interpolate(t, [94, 100], [0, 1], clamp),
            transform: `scale(${interpolate(t, [94, 102], [0.6, 1], clamp)})`,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 28,
            color: C.white,
            background: C.gray,
            borderRadius: 30,
            padding: '6px 18px',
          }}
        >
          Promo
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Scène 10 : rangée de 5 téléphones alignés */
export const DestinationsScene: React.FC<{dur: number}> = ({dur}) => {
  const t = useCurrentFrame();
  const names = ['Aéroport', 'Kribi', 'Limbé', 'Yaoundé', 'Buea'];
  const ats = [11, 60, 82, 101, 112];
  const W = 150;
  const H = W * 2.04;
  let active = -1;
  ats.forEach((a, i) => {
    if (t >= a) active = i;
  });
  const fall = interpolate(t, [dur - 14, dur], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 260, left: 120, right: 120}}>
        <Line size={84} words={[['Aéroport', 11], ['ou', 34], ['voyage', 41, true]]} />
      </div>
      <AbsoluteFill style={{perspective: 1600}}>
        {names.map((n, i) => {
          const s = useSpring(i * 3, {damping: 14, stiffness: 120});
          const on = useSpring(ats[i], {damping: 12, stiffness: 180});
          const isActive = i === active;
          const x = 120 + i * ((840 - W) / 4);
          const fy = fall * (900 + i * 120);
          return (
            <React.Fragment key={n}>
              <FloorShadow w={W} opacity={0.2} style={{left: x, top: 1240 + 0 * on, opacity: 1 - fall}} />
              <div
                style={{
                  position: 'absolute',
                  left: x,
                  top: 880,
                  width: W,
                  height: H,
                  perspective: 1200,
                  transform: `translateY(${interpolate(s, [0, 1], [800, 0]) - on * 34 * (isActive ? 1 : 0.35) + fy + Math.sin((t + i * 7) / 14) * 4}px) scale(${1 + (isActive ? 0.12 : 0) * on}) rotate(${fall * (i - 2) * 18}deg)`,
                  zIndex: isActive ? 5 : 1,
                }}
              >
                <DirBlur y={fall * 30}>
                  <Phone w={W} depth={10} transform={`rotateY(${(i - 2) * -8 + Math.sin((t + i * 5) / 20) * 4}deg) rotateX(6deg)`}>
                    <LockScreen w={W} date="sam. 21 nov.">
                      <div
                        style={{
                          marginTop: 22,
                          opacity: interpolate(t - ats[i], [0, 5], [0, 1], clamp),
                          transform: `translateY(${interpolate(t - ats[i], [0, 8], [12, 0], clamp)}px)`,
                        }}
                      >
                        <svg viewBox="0 0 24 24" width={30} height={30}>
                          <path d="M12 2 C7 2 4 6 4 10 c0 6 8 12 8 12 s8-6 8-12 c0-4-3-8-8-8 z" fill={C.white} />
                          <circle cx="12" cy="10" r="3" fill={C.black} />
                        </svg>
                      </div>
                    </LockScreen>
                  </Phone>
                </DirBlur>
                <div
                  style={{
                    position: 'absolute',
                    top: H + 26,
                    width: W + 40,
                    left: -20,
                    textAlign: 'center',
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: 30,
                    letterSpacing: '-0.02em',
                    color: isActive ? C.black : C.gray,
                    opacity: interpolate(t - ats[i], [0, 5], [0, 1], clamp) * (1 - fall),
                  }}
                >
                  {n}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const QR: React.FC<{size: number}> = ({size}) => {
  const qr = QRCode.create('https://wa.me/237655394028?text=JP', {errorCorrectionLevel: 'M'});
  const n = qr.modules.size;
  const cell = size / n;
  const isFinder = (r: number, c: number) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const dots: React.ReactNode[] = [];
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (qr.modules.get(r, c) && !isFinder(r, c))
        dots.push(<circle key={`${r}-${c}`} cx={c * cell + cell / 2} cy={r * cell + cell / 2} r={cell * 0.42} fill={C.black} />);
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x * cell + cell * 0.5} y={y * cell + cell * 0.5} width={cell * 6} height={cell * 6} rx={cell * 1.6} fill="none" stroke={C.black} strokeWidth={cell} />
      <rect x={(x + 2) * cell} y={(y + 2) * cell} width={cell * 3} height={cell * 3} rx={cell * 0.9} fill={C.black} />
    </g>
  );
  return (
    <svg width={size} height={size}>
      {dots}
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
    </svg>
  );
};

/** Scène 11 : appel à l'action */
export const CTAScene: React.FC = () => {
  const t = useCurrentFrame();
  const qr = useSpring(60, {damping: 13, stiffness: 110});
  const zoom = 1 + t * 0.00018;
  const groups: [string, number][] = [
    ['655', 112],
    ['394', 155],
    ['028', 197],
  ];
  return (
    <AbsoluteFill style={{transform: `scale(${zoom})`}}>
      <div style={{position: 'absolute', top: 200 - Math.min(t, 60) * 0.5, left: 120, right: 120}}>
        <Line size={88} words={[['Écrivez', 2], ['JP', 14, true]]} />
        <Line size={88} words={[['sur', 29], ['WhatsApp', 44]]} />
      </div>
      <div style={{position: 'absolute', top: 520, left: 100, right: 100, textAlign: 'center', fontFamily: SANS, color: C.black}}>
        <Word at={70} size={96} style={{fontWeight: 800, letterSpacing: '-0.04em'}}>
          +237
        </Word>
        <div style={{display: 'flex', justifyContent: 'center', columnGap: 30, marginTop: -6}}>
          {groups.map(([g, at]) => {
            const pulse = useSpring(at, {damping: 9, stiffness: 200});
            return (
              <div key={g} style={{transform: `scale(${1 + 0.08 * Math.sin(Math.PI * Math.min(1, (t - at) / 12)) * (t > at ? 1 : 0)})`}}>
                <Word at={at} size={150} style={{fontWeight: 800, letterSpacing: '-0.055em', opacity: pulse > 0 ? 1 : 0}}>
                  {g}
                </Word>
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 540 - 170,
          top: 920,
          transform: `translateY(${interpolate(qr, [0, 1], [500, 0]) + Math.sin(t / 18) * 8}px) rotate(${interpolate(qr, [0, 1], [14, -3]) + Math.sin(t / 26) * 2}deg)`,
          opacity: interpolate(t, [60, 64], [0, 1], clamp),
        }}
      >
        <Card radius={40} style={{width: 340, padding: 30, boxSizing: 'border-box', boxShadow: SHADOW_SOFT}}>
          <QR size={280} />
          <div style={{marginTop: 14, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 26, color: C.gray}}>Scannez · WhatsApp</div>
        </Card>
      </div>
      <div style={{position: 'absolute', top: 1400, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        {t >= 205 && (
          <Banner at={205} size={104}>
            dès maintenant
          </Banner>
        )}
      </div>
    </AbsoluteFill>
  );
};
