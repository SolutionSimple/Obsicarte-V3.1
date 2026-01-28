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
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.8, delay: 1 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-tight leading-tight">
                Creez du lien & Partagez vos informations en un geste
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-lg md:text-xl text-warmGray-700 leading-relaxed"
            >
              La carte de visite premium qui donne accès à votre profil virtuel
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(234, 179, 8, 0.6)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 bg-black text-white border-2 border-gold-500 rounded-lg text-lg font-medium shadow-gold-glow-lg hover:bg-neutral-900 transition-all duration-300"
                >
                  Commander mon Obsi Carte
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
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 1.2 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-full max-w-md lg:max-w-lg">
              <div className="card-runway-frame">
                <CardRunwayAnimation />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
