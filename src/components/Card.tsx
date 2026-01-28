import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cardHover } from '../utils/animations';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'premium' | 'glassmorphism' | 'glassmorphism-dark' | 'dark-premium';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Card({
  children,
  variant = 'default',
  hover = true,
  className = '',
  onClick,
}: CardProps) {
  const baseStyles = 'rounded-xl overflow-hidden';

  const variants = {
    default: 'bg-white border border-neutral-200 shadow-premium-sm',
    premium:
      'bg-gradient-to-br from-white to-neutral-50 border border-amber-200 shadow-premium-md relative before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-amber before:-z-10',
    glassmorphism:
      'bg-white/70 backdrop-blur-md border border-white/20 shadow-premium-lg',
    'glassmorphism-dark':
      'bg-black/60 backdrop-blur-md border border-gold-500/20 shadow-gold-md hover:border-gold-500/40 hover:shadow-gold-glow transition-all duration-300',
    'dark-premium':
      'bg-gradient-to-br from-neutral-900 to-black border border-gold-500/20 shadow-gold-md hover:border-gold-500/40 hover:shadow-gold-glow transition-all duration-300',
  };

  const Component = hover ? motion.div : 'div';
  const hoverProps = hover
    ? {
        variants: cardHover,
        initial: 'rest',
        whileHover: 'hover',
        whileTap: 'tap',
      }
    : {};

  return (
    <Component
      className={clsx(baseStyles, variants[variant], className, onClick && 'cursor-pointer')}
      onClick={onClick}
      {...hoverProps}
    >
      {children}
    </Component>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={clsx('p-6 border-b border-neutral-200', className)}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={clsx('p-6', className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={clsx('p-6 bg-neutral-50 border-t border-neutral-200', className)}>
      {children}
    </div>
  );
}
