import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { buttonHover } from '../utils/animations';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'gold' | 'gold-outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

  const variants = {
    primary: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-premium-md hover:shadow-premium-lg font-semibold',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 shadow-premium-sm',
    outline: 'border-2 border-amber-500/50 hover:border-amber-500 text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 shadow-premium-sm',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-premium-md',
    gold: 'bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black shadow-gold-lg hover:shadow-gold-glow font-bold transition-all duration-300',
    'gold-outline': 'border-2 border-gold-500/50 hover:border-gold-500 text-gold-400 hover:text-gold-300 hover:bg-gold-500/10 shadow-gold-sm hover:shadow-gold-md transition-all duration-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      className={clsx(baseStyles, variants[variant], sizes[size], widthClass, className)}
      disabled={disabled || loading}
      variants={buttonHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <motion.div
            className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
          <span>Chargement...</span>
        </div>
      ) : (
        children
      )}
      <motion.div
        className="absolute inset-0 bg-white opacity-0 hover:opacity-10"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
}
