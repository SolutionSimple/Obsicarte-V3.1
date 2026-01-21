import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface ContextualLinkProps {
  to: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  external?: boolean;
  variant?: 'default' | 'card';
}

export function ContextualLink({
  to,
  label,
  description,
  icon,
  external = false,
  variant = 'default',
}: ContextualLinkProps) {
  if (variant === 'card') {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className="bg-white border border-amber-200 rounded-lg p-4 hover:border-amber-400 transition-colors shadow-premium-sm"
      >
        <Link to={to} className="flex items-start gap-3">
          {icon && <div className="text-amber-600 mt-1">{icon}</div>}
          <div className="flex-1">
            <h4 className="text-neutral-900 font-semibold mb-1 flex items-center gap-2">
              {label}
              {external ? (
                <ExternalLink className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </h4>
            {description && (
              <p className="text-neutral-600 text-sm">{description}</p>
            )}
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors text-sm font-medium"
    >
      {icon}
      {label}
      {external ? (
        <ExternalLink className="w-4 h-4" />
      ) : (
        <ArrowRight className="w-4 h-4" />
      )}
    </Link>
  );
}
