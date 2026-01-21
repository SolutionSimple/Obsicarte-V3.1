import { motion } from 'framer-motion';

interface StatusBadgeProps {
  isOnline: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function StatusBadge({ isOnline, size = 'md' }: StatusBadgeProps) {
  return (
    <div className="absolute bottom-0 right-0 bg-gray-900 rounded-full p-1">
      <motion.div
        className={`${sizeClasses[size]} rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-gray-500'
        }`}
        animate={
          isOnline
            ? {
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
