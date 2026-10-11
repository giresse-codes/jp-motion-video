import {AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {COULEURS, SERVICES, type Plan} from '../config';
import {Assombri, Finition, Trainees} from '../components/Effets';
import {IconeAvion} from '../components/Icones';
import {Media} from '../components/Media';
import {Son} from '../components/Son';
import {ServiceCard} from '../components/ServiceCard';
import {BandeBalayage} from '../components/Transitions';
import {reperesDe, type CleRepere} from '../lib/scene';

const r = reperesDe('services');

// Repères de la voix pour chaque service : début, prix, avantages, badge.
const REPERES_SERVICES: Record<
  (typeof SERVICES)[number]['id'],
  {debut: CleRepere; prix: CleRepere; avantages: CleRepere; avantagesDecal?: number; badge?: CleRepere}
> = {
  eco: {debut: 'eco', prix: 'ecoPrix', avantages: 'ecoAvantages'},
  confort: {debut: 'confort', prix: 'confortPrix', avantages: 'confortAvantages'},
  aeroport: {debut: 'aeroport', prix: 'aeroportPrix', avantages: 'aeroportPrix', avantagesDecal: 14},
  voyage: {debut: 'voyage', prix: 'voyagePrix', avantages: 'voyagePrix', avantagesDecal: 12, badge: 'voyageBadge'},
};

// Scène 3 : une carte animée par service, sur une photo en Ken Burns.
export const Services: React.FC = () => {
  const {durationInFrames} = useVideoConfig();

  // Coupe entre deux services juste avant la phrase qui les annonce.
  const debuts = SERVICES.map((s, i) => (i === 0 ? 0 : r(REPERES_SERVICES[s.id].debut) - 6));
  const fins = [...debuts.slice(1), durationInFrames];

  return (
    <AbsoluteFill style={{backgroundColor: COULEURS.noir, overflow: 'hidden'}}>
      {SERVICES.map((service, i) => {
        const rep = REPERES_SERVICES[service.id];
        const d = debuts[i];
        const duree = fins[i] - d;
        const aPrix = r(rep.prix) - d;
        const aAvantages = r(rep.avantages) - d + (rep.avantagesDecal ?? 0);
        // Les avantages se répartissent jusqu'à la fin du plan (ou le badge).
        const finAvantages = (rep.badge ? r(rep.badge) - d : duree - 30) - aAvantages;
        const ecart = Math.max(6, Math.min(22, Math.floor(finAvantages / service.avantages.length)));
        const aCarte = Math.max(4, Math.min(12, aPrix - 14));
        const aBadge = rep.badge ? r(rep.badge) - d : undefined;
        return (
          <Sequence key={service.id} from={d} durationInFrames={duree}>
            <PlansService plans={([] as Plan[]).concat(service.plan)} duree={duree} sens={i % 2 ? -1 : 1} />
            <Assombri haut={0.5} bas={0.9} />
            {service.id === 'aeroport' && <AvionQuiPasse />}
            {service.id === 'voyage' && <Trainees nombre={10} vitesse={1.4} opacite={0.5} graine="voyage" angle={-8} />}
            <ServiceCard
              service={service}
              numero={i + 1}
              total={SERVICES.length}
              aCarte={aCarte}
              aPrix={aPrix}
              aAvantages={aAvantages}
              ecartAvantages={ecart}
              aBadge={aBadge}
            />
            <Son nom="whooshCourt" a={aCarte - 2} />
            <Son nom="prix" a={aPrix + 19} />
            {service.avantages.map((_, k) => (
              <Son key={k} nom="pop" a={aAvantages + k * ecart} />
            ))}
            {aBadge !== undefined && <Son nom="impact" a={aBadge} volume={0.7} />}
            {service.id === 'aeroport' && <Son nom="whoosh" a={0} volume={0.8} />}
          </Sequence>
        );
      })}
      {debuts.slice(1).map((c) => (
        <BandeBalayage key={c} coupe={c} />
      ))}
      {debuts.slice(1).map((c) => (
        <Son key={c} nom="whoosh" a={c - 8} />
      ))}
      <Finition />
    </AbsoluteFill>
  );
};

// Un avion traverse le haut de l'écran sur le plan Aéroport.
const AvionQuiPasse: React.FC = () => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const x = interpolate(frame, [0, 70], [-260, width + 260], {extrapolateRight: 'clamp'});
  const y = interpolate(frame, [0, 70], [480, 200]);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'rotate(62deg)',
        filter: `drop-shadow(0 0 20px ${COULEURS.rouge})`,
      }}
    >
      <IconeAvion taille={200} />
    </div>
  );
};

// Enchaîne les plans d'un service en coupes franches, durée partagée.
const PlansService: React.FC<{plans: Plan[]; duree: number; sens: number}> = ({plans, duree, sens}) => {
  const part = Math.ceil(duree / plans.length);
  return (
    <>
      {plans.map((plan, j) => (
        <Sequence key={j} from={j * part} durationInFrames={part}>
          <Media plan={plan} amplitude={0.16} derive={70 * sens} filtre="saturate(1.1) contrast(1.08)" />
        </Sequence>
      ))}
    </>
  );
};
