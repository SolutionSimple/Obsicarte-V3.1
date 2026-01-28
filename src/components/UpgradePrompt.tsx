import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { useTierPermissions } from '../hooks/useTierPermissions';
import { getTierConfig } from '../config/tier-config';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { TierBadge } from './TierBadge';

interface UpgradePromptProps {
  className?: string;
  compact?: boolean;
}

export function UpgradePrompt({ className, compact = false }: UpgradePromptProps) {
  const { nextTier, canUpgrade, tier } = useTierPermissions();

  if (!canUpgrade || !nextTier) {
    return null;
  }

  const nextConfig = getTierConfig(nextTier);

  if (compact) {
    return (
      <Card variant="dark-premium" className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-warmGray-50">
                  Passez au {nextConfig.displayName}
                </p>
                <p className="text-xs text-warmGray-400">
                  Débloquez de nouvelles fonctionnalités
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => (window.location.href = '/pricing')}
            >
              Découvrir
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="dark-premium" className={className}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0 shadow-gold-md">
            <Sparkles className="w-7 h-7 text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-warmGray-50">
                Passez au niveau supérieur
              </h3>
              <TierBadge tier={nextTier} variant="compact" />
            </div>

            <p className="text-warmGray-300 mb-4">
              Découvrez toutes les fonctionnalités premium du {nextConfig.displayName} pour seulement{' '}
              <span className="text-gold-400 font-semibold">{nextConfig.price}€</span>
              {nextConfig.period}
            </p>

            <div className="space-y-2 mb-6">
              <p className="text-sm font-semibold text-warmGray-200 mb-3">
                Nouvelles fonctionnalités débloquées:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {nextConfig.description.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-warmGray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => (window.location.href = '/pricing')}
                className="flex-1 sm:flex-initial"
              >
                Upgrader maintenant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="secondary"
                onClick={() => (window.location.href = '/pricing')}
                className="flex-1 sm:flex-initial"
              >
                Comparer les offres
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
