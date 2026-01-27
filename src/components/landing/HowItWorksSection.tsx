import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ShoppingBag, UserPlus, Share2 } from 'lucide-react';
import { fadeInUpSlow, staggerContainerSlow, staggerItem } from '../../utils/animations';

export const HowItWorksSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const steps = [
    {
      num: '1',
      icon: ShoppingBag,
      title: 'Commandez votre carte noire',
      description: 'Recevez votre carte NFC pré-configurée sous 48h dans un emballage premium',
    },
    {
      num: '2',
      icon: UserPlus,
      title: 'Créez votre profil virtuel',
      description: 'Ajoutez vos infos, vidéo, documents en 2 minutes depuis votre smartphone',
    },
    {
      num: '3',
      icon: Share2,
      title: 'Partagez et développez votre réseau',
      description: 'Un geste suffit pour échanger vos coordonnées et développer votre réseau',
    },
  ];

  return (
    <section ref={ref} className="relative py-32 bg-gradient-to-b from-beige-100 via-warmGray-50 to-beige-50">
      <div className="absolute inset-0 bg-gradient-radial from-gold-400/10 via-transparent to-transparent opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gold-700 mb-6 tracking-tight">
            Comment ça marche ?
          </h2>
          <p className="text-xl md:text-2xl text-warmGray-700">
            En 3 étapes simples
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainerSlow}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          className="relative"
        >
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold-500 via-gold-400 to-gold-500 hidden md:block" />

          <div className="space-y-24">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.num}
                  variants={staggerItem}
                  className={`grid md:grid-cols-2 gap-8 items-center ${
                    isEven ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`${isEven ? 'md:text-right md:pr-16' : 'md:pl-16 md:col-start-2'}`}>
                    <motion.div
                      className={`inline-flex items-center gap-4 mb-6 ${
                        isEven ? 'md:flex-row-reverse' : ''
                      }`}
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold-glow text-2xl font-bold text-white">
                        {step.num}
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-warmGray-100 to-beige-100 border border-gold-500/40 flex items-center justify-center shadow-gold-sm">
                        <Icon className="w-8 h-8 text-gold-600" />
                      </div>
                    </motion.div>

                    <h3 className="text-3xl font-bold text-warmGray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-lg text-warmGray-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className={`${isEven ? 'md:col-start-2' : 'md:col-start-1 md:row-start-1'}`}>
                    <div className="relative">
                      <div className="aspect-square rounded-3xl bg-gradient-to-br from-warmGray-100 to-beige-100 border border-gold-500/30 shadow-gold-md overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-radial from-gold-400/10 to-transparent opacity-30" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon className="w-32 h-32 text-gold-500/40" />
                        </div>
                      </div>
                      <div className="absolute -z-10 inset-0 bg-gradient-to-br from-gold-500/30 to-transparent blur-3xl" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
