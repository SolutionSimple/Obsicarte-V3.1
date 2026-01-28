import { Gem } from 'lucide-react';
import { TierType, getTierConfig } from '../config/tier-config';
import clsx from 'clsx';

interface TierBadgeProps {
  tier: TierType;
  variant?: 'compact' | 'inline' | 'large' | 'profile';
  className?: string;
  showIcon?: boolean;
  animated?: boolean;
}

export function TierBadge({
  tier,
  variant = 'inline',
  className,
  showIcon = true,
  animated = true,
}: TierBadgeProps) {
  const config = getTierConfig(tier);

  const variantClasses = {
    compact: 'px-2 py-0.5 text-xs',
    inline: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base',
    profile: 'px-3 py-1.5 text-sm',
  };

  const iconSizes = {
    compact: 'w-3 h-3',
    inline: 'w-4 h-4',
    large: 'w-5 h-5',
    profile: 'w-4 h-4',
  };

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        'bg-gradient-to-r shadow-md',
        config.gradientFrom,
        config.gradientTo,
        'text-white',
        variantClasses[variant],
        animated && 'transition-all duration-300 hover:shadow-lg hover:scale-105',
        className
      )}
    >
      {showIcon && <Gem className={iconSizes[variant]} />}
      <span>{config.displayName}</span>
    </div>
  );
}
