import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, success, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="w-full">
        {label && (
          <motion.label
            className={clsx(
              'block text-sm font-medium mb-1 transition-colors',
              isFocused ? 'text-amber-600' : 'text-neutral-700',
              error && 'text-red-600'
            )}
            animate={{ y: isFocused ? -2 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
        <div className="relative">
          <motion.input
            ref={ref}
            className={clsx(
              'w-full px-4 py-2.5 rounded-lg transition-all duration-200',
              'border-2 focus:outline-none',
              error
                ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20 bg-white'
                : success
                ? 'border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-500/20 bg-white'
                : 'border-neutral-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-white',
              'text-neutral-900 placeholder:text-neutral-500',
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            animate={{
              scale: isFocused ? 1.01 : 1,
            }}
            transition={{ duration: 0.2 }}
            {...props}
          />
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
              </motion.div>
            )}
            {success && !error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10, x: -5 }}
              animate={{
                opacity: 1,
                y: 0,
                x: 0,
              }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5"
            >
              <motion.span
                animate={{ x: [-2, 2, -2, 2, 0] }}
                transition={{ duration: 0.4 }}
              >
                {error}
              </motion.span>
            </motion.p>
          )}
          {helperText && !error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-1.5 text-sm text-neutral-600"
            >
              {helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';
