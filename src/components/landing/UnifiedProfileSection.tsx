import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card } from '../Card';
import { Users, Video, FileText, Building2, GraduationCap, Palette } from 'lucide-react';
import { staggerContainerSlow, staggerItem } from '../../utils/animations';

export const UnifiedProfileSection = () => {
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
  ];

  const templates = [
    {
      icon: Building2,
      title: 'Entreprise',
      subtitle: 'Dirigeants, entrepreneurs, commerciaux',
      description: 'Un profil professionnel qui inspire confiance',
      color: 'from-gold-400 to-gold-600',
    },
    {
      icon: GraduationCap,
      title: 'Étudiants',
      subtitle: 'Stages, alternance, premier emploi',
      description: 'Démarquez-vous avec un profil moderne',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Palette,
      title: 'Artistes',
      subtitle: 'Créateurs, performeurs, designers',
      description: 'Exposez votre créativité',
      color: 'from-purple-400 to-pink-500',
    },
  ];

  return (
    <section ref={ref} className="relative py-20">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gold-700 mb-6 tracking-tight">
            Votre identité professionnelle, sans limites
          </h2>
          <p className="text-xl md:text-2xl text-warmGray-700 max-w-3xl mx-auto">
            Bien plus qu'une simple carte de visite
          </p>
        </motion.div>

        <div className="mb-12">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-2xl font-bold text-warmGray-800 mb-6 text-center"
          >
            Vos fonctionnalités
          </motion.h3>

          <motion.div
            variants={staggerContainerSlow}
            initial="initial"
            animate={inView ? 'animate' : 'initial'}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={staggerItem}>
                  <Card variant="dark-premium" hover={true} className="h-full group">
                    <div className="p-5">
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-gold-md`}
                      >
                        <Icon className="w-6 h-6 text-black" />
                      </motion.div>
                      <h4 className="text-xl font-bold text-warmGray-50 mb-3">
                        {feature.title}
                      </h4>
                      <p className="text-warmGray-200 text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-2xl font-bold text-warmGray-800 mb-6 text-center"
          >
            Vos profils
          </motion.h3>

          <motion.div
            variants={staggerContainerSlow}
            initial="initial"
            animate={inView ? 'animate' : 'initial'}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {templates.map((template, index) => {
              const Icon = template.icon;
              return (
                <motion.div
                  key={template.title}
                  variants={staggerItem}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Card variant="dark-premium" hover={true} className="h-full group">
                    <div className="p-5">
                      <div className={`w-10 h-10 bg-gradient-to-br ${template.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-gold-md`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${template.color} text-white text-xs font-bold mb-3`}>
                        {template.title}
                      </div>

                      <h4 className="text-base font-bold text-warmGray-50 mb-2">
                        {template.subtitle}
                      </h4>
                      <p className="text-warmGray-200 text-sm">
                        {template.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 1 }}
          className="text-center mt-10"
        >
          <p className="text-warmGray-600 text-lg">
            Et bien plus encore : freelances, consultants, artisans, associations...
          </p>
        </motion.div>
      </div>
    </section>
  );
};
