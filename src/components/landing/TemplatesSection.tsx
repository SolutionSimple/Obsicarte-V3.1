import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card } from '../Card';
import { Building2, GraduationCap, Palette, Landmark } from 'lucide-react';
import { fadeInUpSlow, staggerContainerSlow, staggerItem } from '../../utils/animations';

export const TemplatesSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const templates = [
    {
      icon: Building2,
      title: 'Entreprise',
      subtitle: 'Dirigeants, entrepreneurs, commerciaux',
      description: 'Un profil professionnel qui inspire confiance',
      color: 'from-gold-400 to-gold-600',
      iconBg: 'bg-gradient-to-br from-gold-400 to-gold-600',
      features: [
        'Coordonnées complètes',
        'Logo entreprise',
        'Catalogue produits',
        'Collecte de leads',
      ],
    },
    {
      icon: GraduationCap,
      title: 'Étudiants',
      subtitle: 'Stages, alternance, premier emploi',
      description: 'Démarquez-vous avec un profil moderne',
      color: 'from-blue-400 to-blue-600',
      iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600',
      features: [
        'Portfolio en ligne',
        'CV téléchargeable',
        'Compétences',
        'Projets académiques',
      ],
    },
    {
      icon: Palette,
      title: 'Artistes',
      subtitle: 'Créateurs, performeurs, designers',
      description: 'Exposez votre créativité',
      color: 'from-purple-400 to-pink-500',
      iconBg: 'bg-gradient-to-br from-purple-400 to-pink-500',
      features: [
        'Galerie photos/vidéos',
        'Œuvres disponibles',
        'Calendrier expositions',
        'Contact direct',
      ],
    },
    {
      icon: Landmark,
      title: 'Élus',
      subtitle: 'Politiques, élus, candidats',
      description: 'Créez la proximité avec vos électeurs',
      color: 'from-red-500 to-red-700',
      iconBg: 'bg-gradient-to-br from-red-500 to-red-700',
      features: [
        'Programme détaillé',
        'Mandats et réalisations',
        'Actualités',
        'Contact équipe',
      ],
    },
  ];

  return (
    <section ref={ref} className="relative py-32 bg-gradient-to-b from-black via-neutral-950 to-black">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Une carte pour tous les professionnels
          </h2>
          <p className="text-xl md:text-2xl text-warmGray-300 max-w-3xl mx-auto">
            Des exemples d'utilisation, infinies possibilités
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainerSlow}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <motion.div key={template.title} variants={staggerItem}>
                <Card variant="dark-premium" hover={true} className="h-full group">
                  <div className="p-6">
                    <div className={`w-14 h-14 ${template.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-gold-md`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${template.color} text-white text-xs font-bold mb-4`}>
                      {template.title}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">
                      {template.subtitle}
                    </h3>
                    <p className="text-warmGray-400 text-sm mb-4">
                      {template.description}
                    </p>

                    <ul className="space-y-2">
                      {template.features.map((feature) => (
                        <li key={feature} className="flex items-center text-warmGray-300 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${template.color} mr-2`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 1 }}
          className="text-center mt-12"
        >
          <p className="text-warmGray-400 text-lg">
            Et bien plus encore : freelances, consultants, artisans, associations...
          </p>
        </motion.div>
      </div>
    </section>
  );
};
