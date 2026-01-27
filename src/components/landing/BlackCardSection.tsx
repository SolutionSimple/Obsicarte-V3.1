import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BlackCard3D } from '../BlackCard3D';
import { Card } from '../Card';
import { Sparkles, Shield, Zap, Package } from 'lucide-react';
import { fadeInUpSlow, staggerContainerSlow, staggerItem } from '../../utils/animations';

export const BlackCardSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const features = [
    {
      icon: Sparkles,
      title: 'Matériau premium',
      description: 'Carte PVC noir mat de haute qualité, finition soft-touch',
    },
    {
      icon: Zap,
      title: 'Puce NFC intégrée',
      description: 'Pré-configurée et prête à l\'emploi, aucune configuration nécessaire',
    },
    {
      icon: Shield,
      title: 'Design exclusif',
      description: 'Accents dorés élégants, logo Obsi gravé',
    },
    {
      icon: Package,
      title: 'Livrée chez vous',
      description: 'Emballage premium, livraison sous 48h',
    },
  ];

  return (
    <section ref={ref} className="relative py-32 bg-gradient-to-b from-black via-neutral-950 to-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-spotlight opacity-30" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-gold-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            La carte noire premium
          </h2>
          <p className="text-xl md:text-2xl text-warmGray-300 max-w-3xl mx-auto">
            Une carte qui fait la différence
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <BlackCard3D />
          </motion.div>

          <motion.div
            variants={staggerContainerSlow}
            initial="initial"
            animate={inView ? 'animate' : 'initial'}
            className="space-y-6"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={staggerItem}>
                  <Card variant="dark-premium" hover={true} className="group">
                    <div className="p-6 flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-black" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-warmGray-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 text-gold-400 text-lg">
            <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span>Édition limitée - Commandez la vôtre maintenant</span>
            <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
