import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '../Button';
import { Truck, Shield, Headphones } from 'lucide-react';
import { fadeInUpSlow } from '../../utils/animations';

export const FinalCTASection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const badges = [
    {
      icon: Truck,
      text: 'Livraison 48h',
    },
    {
      icon: Shield,
      text: 'Garantie satisfait ou remboursé',
    },
    {
      icon: Headphones,
      text: 'Support 7j/7',
    },
  ];

  return (
    <section ref={ref} className="relative py-32 bg-gradient-to-b from-warmGray-200 via-beige-200 to-warmGray-200 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-gold-400/20 via-transparent to-transparent" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-gold-500/30 to-transparent rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2 }}
        >
          <motion.div
            variants={fadeInUpSlow}
            initial="initial"
            animate={inView ? 'animate' : 'initial'}
            className="mb-8"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="block text-gold-700 mb-2">
                Prêt à transformer
              </span>
              <span className="block bg-gradient-gold-shimmer bg-clip-text text-transparent">
                votre networking ?
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-xl md:text-2xl text-warmGray-700 mb-12"
          >
            Rejoignez les professionnels qui font la différence
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-12"
          >
            <Link to="/signup">
              <Button
                size="lg"
                variant="gold"
                className="px-12 py-4 text-xl shadow-gold-glow-lg hover:scale-105 transition-transform"
              >
                Commander ma carte noire - 49€
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7, duration: 1 }}
            className="flex flex-wrap justify-center gap-8 text-warmGray-600"
          >
            {badges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-5 h-5 text-gold-600" />
                  <span className="text-sm font-medium">{badge.text}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
    </section>
  );
};
