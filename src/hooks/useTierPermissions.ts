import { useMemo } from 'react';
import { useSubscription } from './useSubscription';
import {
  TierType,
  SubscriptionTier,
  SUBSCRIPTION_TO_CARD_TIER,
  getTierConfig,
  getSubscriptionTierConfig,
  canAccessFeature,
  canAddProfile,
  getNextTier,
  isHigherTier,
  TierFeatures,
  TierConfig,
} from '../config/tier-config';

export interface TierPermissions {
  tier: TierType | null;
  subscriptionTier: SubscriptionTier;
  config: TierConfig | null;
  isLoading: boolean;

  canAddProfile: (currentCount: number) => boolean;
  canUploadVideo: () => boolean;
  canAccessCRM: () => boolean;
  canAccessAdvancedAnalytics: () => boolean;
  canCustomizeLogo: () => boolean;
  canAccessVIPClub: () => boolean;
  canAccessPrioritySupport: () => boolean;
  canCustomizeTheme: () => boolean;
  canAccessFeature: (featureKey: keyof TierFeatures) => boolean;

  getProfileLimit: () => number | 'unlimited';
  getVideoStorageLimit: () => number;
  getCustomFieldsLimit: () => number;
  getRemainingProfiles: (currentCount: number) => number | 'unlimited';

  nextTier: TierType | null;
  canUpgrade: boolean;
  isFreeTier: boolean;
  isPremiumTier: boolean;
  isPremiumPlusTier: boolean;
  isEmeraudeTier: boolean;
}

export function useTierPermissions(): TierPermissions {
  const { subscription, loading } = useSubscription();

  const subscriptionTier: SubscriptionTier = useMemo(() => {
    if (!subscription || subscription.status !== 'active') {
      return 'free';
    }
    return subscription.tier as SubscriptionTier;
  }, [subscription]);

  const tier: TierType | null = useMemo(() => {
    return SUBSCRIPTION_TO_CARD_TIER[subscriptionTier];
  }, [subscriptionTier]);

  const config: TierConfig | null = useMemo(() => {
    return getSubscriptionTierConfig(subscriptionTier);
  }, [subscriptionTier]);

  const nextTier = useMemo(() => {
    return tier ? getNextTier(tier) : 'roc';
  }, [tier]);

  const permissions: TierPermissions = useMemo(() => {
    const defaultTier: TierType = 'roc';
    const activeTier = tier || defaultTier;
    const activeConfig = config || getTierConfig(defaultTier);

    return {
      tier,
      subscriptionTier,
      config,
      isLoading: loading,

      canAddProfile: (currentCount: number) => {
        if (!tier) return currentCount < 1;
        return canAddProfile(activeTier, currentCount);
      },

      canUploadVideo: () => {
        if (!tier) return false;
        return canAccessFeature(activeTier, 'videoPitch');
      },

      canAccessCRM: () => {
        if (!tier) return false;
        return canAccessFeature(activeTier, 'crm');
      },

      canAccessAdvancedAnalytics: () => {
        if (!tier) return false;
        return canAccessFeature(activeTier, 'advancedAnalytics');
      },

      canCustomizeLogo: () => {
        if (!tier) return false;
        return canAccessFeature(activeTier, 'customLogo');
      },

      canAccessVIPClub: () => {
        if (!tier) return false;
        return canAccessFeature(activeTier, 'vipClub');
      },

      canAccessPrioritySupport: () => {
        if (!tier) return false;
        return canAccessFeature(activeTier, 'prioritySupport');
      },

      canCustomizeTheme: () => {
        if (!tier) return false;
        return canAccessFeature(activeTier, 'customThemeColor');
      },

      canAccessFeature: (featureKey: keyof TierFeatures) => {
        if (!tier) return false;
        return canAccessFeature(activeTier, featureKey);
      },

      getProfileLimit: () => {
        return activeConfig.features.profiles;
      },

      getVideoStorageLimit: () => {
        return activeConfig.features.videoStorageMB;
      },

      getCustomFieldsLimit: () => {
        return activeConfig.features.customFields;
      },

      getRemainingProfiles: (currentCount: number) => {
        const limit = activeConfig.features.profiles;
        if (limit === 'unlimited') return 'unlimited';
        return Math.max(0, limit - currentCount);
      },

      nextTier,
      canUpgrade: nextTier !== null,
      isFreeTier: subscriptionTier === 'free',
      isPremiumTier: subscriptionTier === 'premium',
      isPremiumPlusTier: subscriptionTier === 'premium_plus',
      isEmeraudeTier: subscriptionTier === 'emeraude',
    };
  }, [tier, subscriptionTier, config, loading, nextTier]);

  return permissions;
}
