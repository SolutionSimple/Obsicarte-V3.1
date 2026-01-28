import { motion } from 'framer-motion';
import { Building2, GraduationCap, Palette, Landmark } from 'lucide-react';

interface CardData {
  name: string;
  title: string;
  sector: string;
  color: string;
  icon: typeof Building2;
}

const cards: CardData[] = [
  {
    name: 'Sophie Martin',
    title: 'CEO & Founder',
    sector: 'Entreprise',
    color: 'from-gold-400 to-gold-600',
    icon: Building2,
  },
  {
    name: 'Lucas Bernard',
    title: 'Étudiant en Design',
    sector: 'Étudiants',
    color: 'from-blue-400 to-blue-600',
    icon: GraduationCap,
  },
  {
    name: 'Emma Dubois',
    title: 'Artiste Photographe',
    sector: 'Artistes',
    color: 'from-purple-400 to-pink-500',
    icon: Palette,
  },
  {
    name: 'Pierre Leclerc',
    title: 'Maire',
    sector: 'Élus',
    color: 'from-red-500 to-red-700',
    icon: Landmark,
  },
];

const duplicatedCards = [...cards, ...cards, ...cards];

const Card = ({ data, index }: { data: CardData; index: number }) => {
  const Icon = data.icon;

  return (
    <div
      className="relative flex-shrink-0 w-[280px] h-[440px] mx-4"
      style={{
        perspective: '1000px',
      }}
    >
      <motion.div
        className="w-full h-full rounded-2xl bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 shadow-2xl overflow-hidden"
        initial={{ rotateY: -10 }}
        animate={{
          rotateY: [10, -10, 10],
        }}
        transition={{
          duration: 4,
          delay: index * 0.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-neutral-800/30" />

        <div className="relative h-full p-6 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${data.color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex-1" />

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${data.color} text-white text-xs font-semibold`}>
                {data.sector}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight">
              {data.name}
            </h3>
            <p className="text-warmGray-300 text-sm">
              {data.title}
            </p>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-gold-500/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="absolute inset-0 border border-gold-500/20 rounded-2xl pointer-events-none" />
      </motion.div>
    </div>
  );
};

export const CardRunwayAnimation = () => {
  return (
    <div className="relative w-full overflow-hidden py-12">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />

      <motion.div
        className="flex"
        animate={{
          x: [0, -2800],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicatedCards.map((card, index) => (
          <Card key={index} data={card} index={index} />
        ))}
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-spotlight pointer-events-none" />
    </div>
  );
};
