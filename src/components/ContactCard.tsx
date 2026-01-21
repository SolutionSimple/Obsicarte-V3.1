import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ContactCardProps {
  icon: LucideIcon;
  label: string;
  value: string | ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function ContactCard({ icon: Icon, label, value, href, onClick, className = '' }: ContactCardProps) {
  const content = (
    <motion.div
      className={`bg-white border border-neutral-200 rounded-xl p-4 shadow-sm transition-all duration-200 ${className}`}
      whileHover={{
        scale: 1.02,
        y: -2,
        borderColor: 'rgb(245, 158, 11)',
        boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.1), 0 8px 10px -6px rgba(245, 158, 11, 0.1)'
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-3">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Icon className="w-5 h-5 text-amber-600 flex-shrink-0" />
        </motion.div>
        <div className="min-w-0">
          <div className="text-sm text-neutral-500 mb-1">{label}</div>
          <div className="text-neutral-900 font-medium truncate">{value}</div>
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block" onClick={onClick}>
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}
