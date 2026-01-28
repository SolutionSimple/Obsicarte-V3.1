import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../Button';
import { useScrollPosition } from '../../hooks/useScrollPosition';

export const Navbar = () => {
  const { isScrolled } = useScrollPosition();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 0.8 }}
        className={`
          max-w-5xl w-full rounded-full px-8 h-16
          transition-all duration-500 ease-out pointer-events-auto
          border border-white/10
          ${isScrolled
            ? 'bg-black/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_40px_rgba(234,179,8,0.15)]'
            : 'bg-black/60 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.2),0_0_20px_rgba(234,179,8,0.1)]'
          }
        `}
      >
        <div className="flex justify-between items-center h-full">
          <Link to="/">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Obsi
              </h1>
              <div className="w-2 h-2 rounded-full bg-gold-500 shadow-gold-glow animate-pulse" />
            </motion.div>
          </Link>

          <div className="flex gap-3">
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full font-medium text-sm"
              >
                Se connecter
              </motion.button>
            </Link>
            <Link to="/order">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2 bg-white text-black hover:bg-white/90 transition-all duration-300 rounded-full font-medium shadow-md text-sm"
              >
                Commander
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>
    </div>
  );
};
