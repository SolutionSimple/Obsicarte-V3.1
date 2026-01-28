import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CardRunwayAnimation } from '../CardRunwayAnimation';

export const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-beige-200 via-beige-300 to-warmGray-300 overflow-hidden">
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
              duration: 8,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, delay: 1 }}
            className="inline-flex items-center gap-2 bg-gold-500/15 border border-gold-500/40 rounded-full px-5 py-2.5 mb-8 shadow-gold-md"
          >

            <span className="text-gold-700 text-sm font-semibold tracking-wide">
              Creez du lien & Partagez vos informations en un geste
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.5, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-gold-700 mb-8 tracking-tighter"
          >
            Une carte, un geste, un lien
            <motion.span
              className="block bg-gradient-gold-shimmer bg-clip-text text-transparent mt-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Un réseau infini.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-xl md:text-2xl text-warmGray-700 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            La carte de visite premium qui donne accès à votre profil virtuel illimité
          </motion.p>

        

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(234, 179, 8, 0.6)' }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-black text-white border-2 border-gold-500 rounded-lg text-lg font-medium shadow-gold-glow-lg hover:bg-neutral-900 transition-all duration-300"
              >
                Commander ma carte noire
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 1)' }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-transparent text-warmGray-800 border-2 border-warmGray-800 rounded-lg text-lg font-medium hover:shadow-md transition-all duration-300"
              >
                Voir une démo
              </motion.button>
            </Link>
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
