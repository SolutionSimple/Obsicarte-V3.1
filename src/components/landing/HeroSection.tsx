import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '../Button';
import { CardRunwayAnimation } from '../CardRunwayAnimation';
import { Wifi } from 'lucide-react';
import { fadeInUpSlow } from '../../utils/animations';

export const HeroSection = () => {
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-warmGray-50 via-beige-100 to-beige-200 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-gold-400/10 via-transparent to-transparent opacity-40" />

      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-gold-500 shadow-gold-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-200, 0],
              opacity: [0, 0.9, 0],
            }}
            transition={{
              duration: 6,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-gold-500/15 border border-gold-500/40 rounded-full px-5 py-2.5 mb-8 shadow-gold-md"
          >
            <Wifi className="w-4 h-4 text-gold-600 animate-pulse" />
            <span className="text-gold-700 text-sm font-semibold tracking-wide">
              Carte Noire NFC Premium
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUpSlow}
            initial="initial"
            animate="animate"
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-gold-700 mb-8 tracking-tighter"
          >
            Une carte noire.
            <motion.span
              className="block bg-gradient-gold-shimmer bg-clip-text text-transparent mt-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              Un réseau infini.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-xl md:text-2xl text-warmGray-700 mb-6 max-w-3xl mx-auto leading-relaxed"
          >
            La carte de visite premium qui donne accès à votre profil virtuel illimité
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-base md:text-lg text-warmGray-600 mb-12 max-w-2xl mx-auto"
          >
            Une carte physique noire élégante + Un profil numérique sans limites + Un réseau simplifié
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
          >
            <Link to="/signup">
              <Button size="lg" variant="gold" className="px-10 text-lg shadow-gold-glow-lg">
                Commander ma carte noire
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="gold-outline" className="px-10 text-lg">
                Voir une démo
              </Button>
            </Link>
          </motion.div>

          <motion.div
            ref={statsRef}
            initial={{ opacity: 0 }}
            animate={statsInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 1 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-20"
          >
            {[
              { value: '2.500+', label: 'Professionnels' },
              { value: '100%', label: 'NFC' },
              { value: '∞', label: 'Réseau illimité' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.3 + index * 0.15, duration: 0.8 }}
                className="text-center group"
              >
                <div className="relative inline-block">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-gold-shimmer bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-30 blur-2xl transition-opacity" />
                </div>
                <div className="text-sm md:text-base text-warmGray-600 uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1.2 }}
        >
          <CardRunwayAnimation />
        </motion.div>
      </div>
    </section>
  );
};
