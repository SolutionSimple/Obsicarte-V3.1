import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card } from '../Card';
import { Users, Video, FileText, Repeat } from 'lucide-react';
import { fadeInUpSlow, staggerContainerSlow, staggerItem } from '../../utils/animations';

export const FeaturesSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const features = [
    {
      icon: Users,
      title: 'Profils multiples',
      description: 'Créez plusieurs profils professionnels sur une seule carte',
      color: 'from-gold-400 to-gold-600',
    },
    {
      icon: Video,
      title: 'Description texte et vidéo',
      description: 'Présentez-vous en 360° avec texte, bio, et vidéo d\'introduction',
      color: 'from-gold-500 to-gold-700',
    },
    {
      icon: FileText,
      title: 'Stockage de documents',
      description: 'Partagez CV, portfolio, brochures, catalogues',
      color: 'from-gold-400 to-gold-600',
    },
    {
      icon: Repeat,
      title: 'Échange simplifié',
      description: 'Un simple contact, les coordonnées sont échangées instantanément',
      color: 'from-gold-500 to-gold-700',
    },
  ];

  return (
    <section ref={ref} className="relative py-32 bg-gradient-to-b from-beige-50 via-warmGray-50 to-beige-100">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gold-700 mb-6 tracking-tight">
            Un profil, toutes vos facettes
          </h2>
          <p className="text-xl md:text-2xl text-warmGray-700 max-w-3xl mx-auto">
            Bien plus qu'une simple carte de visite
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainerSlow}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          className="grid md:grid-cols-2 gap-8"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={staggerItem}>
                <Card variant="dark-premium" hover={true} className="h-full group">
                  <div className="p-8">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-gold-md`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-warmGray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-warmGray-700 text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
