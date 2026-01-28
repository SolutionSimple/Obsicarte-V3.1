import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../Button';

export const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 navbar-black font-montserrat"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Obsi
              </h1>
              <div className="w-2 h-2 rounded-full bg-gold-500 shadow-gold-glow animate-pulse" />
            </motion.div>
          </Link>

          <div className="flex gap-4">
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 rounded-lg font-medium"
              >
                Se connecter
              </motion.button>
            </Link>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-white text-black hover:bg-white/90 transition-all duration-300 rounded-lg font-medium shadow-md"
              >
                Commencer
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
