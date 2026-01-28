import { ReactNode, useState } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { TierType, getTierConfig, TIER_ORDER } from '../config/tier-config';
import { useTierPermissions } from '../hooks/useTierPermissions';
import { TierBadge } from './TierBadge';
import { Button } from './Button';
import clsx from 'clsx';

interface FeatureGateProps {
  children: ReactNode;
  requiredTier: TierType;
  featureName: string;
  description?: string;
  className?: string;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

export function FeatureGate({
  children,
  requiredTier,
  featureName,
  description,
  className,
  fallback,
  showUpgrade = true,
}: FeatureGateProps) {
  const { tier, config } = useTierPermissions();
  const [showModal, setShowModal] = useState(false);

  const hasAccess = tier && TIER_ORDER.indexOf(tier) >= TIER_ORDER.indexOf(requiredTier);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const requiredConfig = getTierConfig(requiredTier);

  return (
    <>
      <div className={clsx('relative', className)}>
        <div className="blur-sm pointer-events-none select-none opacity-40">
          {children}
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-900/90 to-neutral-800/90 backdrop-blur-sm rounded-lg">
          <div className="text-center p-6 max-w-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 mb-4 shadow-gold-md">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-xl font-bold text-warmGray-50 mb-2">
              {featureName}
            </h3>

            {description && (
              <p className="text-warmGray-300 mb-4 text-sm">{description}</p>
            )}

            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-warmGray-400 text-sm">Disponible avec</span>
              <TierBadge tier={requiredTier} variant="compact" />
            </div>

            {showUpgrade && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowModal(true)}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Découvrir {requiredConfig.displayName}
              </Button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <FeatureComparisonModal
          requiredTier={requiredTier}
          currentTier={tier}
          featureName={featureName}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

interface FeatureComparisonModalProps {
  requiredTier: TierType;
  currentTier: TierType | null;
  featureName: string;
  onClose: () => void;
}

function FeatureComparisonModal({
  requiredTier,
  currentTier,
  featureName,
  onClose,
}: FeatureComparisonModalProps) {
  const requiredConfig = getTierConfig(requiredTier);
  const currentConfig = currentTier ? getTierConfig(currentTier) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-warmGray-50">
              Débloquez {featureName}
            </h2>
            <button
              onClick={onClose}
              className="text-warmGray-400 hover:text-warmGray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-warmGray-300 mb-4">
              Cette fonctionnalité est disponible avec le {requiredConfig.displayName}.
            </p>

            {currentConfig && (
              <div className="bg-neutral-800/50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-warmGray-400 text-sm">Votre pack actuel:</span>
                  <TierBadge tier={currentTier!} variant="compact" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-warmGray-400 text-sm">Pack requis:</span>
                  <TierBadge tier={requiredTier} variant="compact" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-warmGray-50">
              Fonctionnalités incluses avec {requiredConfig.displayName}:
            </h3>
            <ul className="space-y-2">
              {requiredConfig.description.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-warmGray-300">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Plus tard
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                window.location.href = '/pricing';
              }}
              className="flex-1"
            >
              Voir les offres
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
