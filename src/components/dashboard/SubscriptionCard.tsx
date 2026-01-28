import { Gem, Check, ArrowUpCircle } from 'lucide-react';
import { Card, CardContent } from '../Card';
import { Button } from '../Button';
import { TierBadge } from '../TierBadge';
import { useTierPermissions } from '../../hooks/useTierPermissions';
import { useNavigate } from 'react-router-dom';
import { getTierConfig, TIER_ORDER } from '../../config/tier-config';

export function SubscriptionCard() {
  const navigate = useNavigate();
  const {
    tier,
    config,
    getProfileLimit,
    canUpgrade,
    nextTier,
    isFreeTier,
  } = useTierPermissions();

  if (isFreeTier) {
    return (
      <Card variant="dark-premium">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-warmGray-50 mb-2">
              Aucun abonnement actif
            </h3>
            <p className="text-warmGray-400 text-sm mb-4">
              Commandez une carte premium pour débloquer toutes les fonctionnalités
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/pricing')}
              className="w-full"
            >
              Découvrir les offres
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tier || !config) return null;

  const tierConfig = getTierConfig(tier);
  const profileLimit = getProfileLimit();
  const tierIndex = TIER_ORDER.indexOf(tier);

  return (
    <Card variant="dark-premium" className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tierConfig.gradientFrom} ${tierConfig.gradientTo} opacity-20 blur-3xl`} />

      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tierConfig.gradientFrom} ${tierConfig.gradientTo} flex items-center justify-center shadow-lg`}>
              <Gem className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-warmGray-400">Votre Pack</p>
              <TierBadge tier={tier} variant="inline" />
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-warmGray-300">Profils disponibles</span>
            <span className="text-warmGray-50 font-semibold">
              {profileLimit === 'unlimited' ? 'Illimités' : profileLimit}
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${tierConfig.gradientFrom} ${tierConfig.gradientTo}`}
              style={{ width: `${((tierIndex + 1) / TIER_ORDER.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <p className="text-xs font-semibold text-warmGray-300 uppercase tracking-wider">
            Fonctionnalités actives
          </p>
          <div className="grid grid-cols-1 gap-2">
            {tierConfig.description.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-xs text-warmGray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {canUpgrade && nextTier && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/pricing')}
            className="w-full"
          >
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            Upgrader vers {getTierConfig(nextTier).displayName}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
