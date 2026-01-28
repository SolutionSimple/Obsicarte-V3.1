import { Crown } from 'lucide-react';
import { TierBadge } from '../TierBadge';
import { TierType } from '../../config/tier-config';

interface TierBannerProps {
  tier: TierType;
  className?: string;
}

export function TierBanner({ tier, className }: TierBannerProps) {
  if (tier === 'roc') {
    return null;
  }

  return (
    <div className={`flex items-center justify-center gap-2 py-2 ${className}`}>
      <Crown className="w-4 h-4 text-gold-600" />
      <TierBadge tier={tier} variant="compact" animated={false} />
    </div>
  );
}
