export type TierType = 'roc' | 'saphir' | 'emeraude';
export type SubscriptionTier = 'free' | 'premium' | 'premium_plus' | 'emeraude';

export const TIER_MAPPING: Record<TierType, SubscriptionTier> = {
  roc: 'premium',
  saphir: 'premium_plus',
  emeraude: 'emeraude',
};

export const SUBSCRIPTION_TO_CARD_TIER: Record<SubscriptionTier, TierType | null> = {
  free: null,
  premium: 'roc',
  premium_plus: 'saphir',
  emeraude: 'emeraude',
};

export interface TierFeatures {
  profiles: number | 'unlimited';
  nfcCard: boolean;
  unlimitedSharing: boolean;
  dynamicQR: boolean;
  videoPitch: boolean;
  crm: boolean;
  advancedAnalytics: boolean;
  customLogo: boolean;
  vipClub: boolean;
  prioritySupport: boolean;
  exclusiveEvents: boolean;
  customThemeColor: boolean;
  videoStorageMB: number;
  customFields: number;
  exportOptions: string[];
}

export interface TierConfig {
  name: string;
  displayName: string;
  icon: string;
  price: string;
  period: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  badgeColor: string;
  features: TierFeatures;
  highlighted: boolean;
  description: string[];
}

export const TIER_CONFIGS: Record<TierType, TierConfig> = {
  roc: {
    name: 'roc',
    displayName: 'Pack Roc',
    icon: 'gem',
    price: '19.90',
    period: '/mois pendant 1 an',
    color: 'gray',
    gradientFrom: 'from-gray-500',
    gradientTo: 'to-gray-700',
    borderColor: 'border-gray-500',
    badgeColor: 'bg-gray-600',
    highlighted: false,
    description: [
      '1 profil personnalisé',
      '1 carte NFC premium',
      'Partage illimité',
      'QR code dynamique',
    ],
    features: {
      profiles: 1,
      nfcCard: true,
      unlimitedSharing: true,
      dynamicQR: true,
      videoPitch: false,
      crm: false,
      advancedAnalytics: false,
      customLogo: false,
      vipClub: false,
      prioritySupport: false,
      exclusiveEvents: false,
      customThemeColor: false,
      videoStorageMB: 0,
      customFields: 3,
      exportOptions: [],
    },
  },
  saphir: {
    name: 'saphir',
    displayName: 'Pack Saphir',
    icon: 'gem',
    price: '24.90',
    period: '/mois pendant 1 an',
    color: 'blue',
    gradientFrom: 'from-[#3B82F6]',
    gradientTo: 'to-[#2563EB]',
    borderColor: 'border-[#3B82F6]',
    badgeColor: 'bg-[#3B82F6]',
    highlighted: true,
    description: [
      'Tout du Pack Roc',
      '3 profils personnalisés',
      'Pitch vidéo intégré',
      'CRM intégré',
      'Statistiques avancées',
    ],
    features: {
      profiles: 3,
      nfcCard: true,
      unlimitedSharing: true,
      dynamicQR: true,
      videoPitch: true,
      crm: true,
      advancedAnalytics: true,
      customLogo: false,
      vipClub: false,
      prioritySupport: false,
      exclusiveEvents: false,
      customThemeColor: true,
      videoStorageMB: 100,
      customFields: 10,
      exportOptions: ['csv'],
    },
  },
  emeraude: {
    name: 'emeraude',
    displayName: 'Pack Emeraude',
    icon: 'gem',
    price: '34.90',
    period: '/mois pendant 1 an',
    color: 'emerald',
    gradientFrom: 'from-emerald-600',
    gradientTo: 'to-emerald-800',
    borderColor: 'border-emerald-600',
    badgeColor: 'bg-emerald-600',
    highlighted: false,
    description: [
      'Tout des Packs Roc & Saphir',
      'Logo personnalisé sur carte',
      'Adhésion au club VIP',
      'Support prioritaire',
      'Accès exclusif aux événements',
    ],
    features: {
      profiles: 'unlimited',
      nfcCard: true,
      unlimitedSharing: true,
      dynamicQR: true,
      videoPitch: true,
      crm: true,
      advancedAnalytics: true,
      customLogo: true,
      vipClub: true,
      prioritySupport: true,
      exclusiveEvents: true,
      customThemeColor: true,
      videoStorageMB: 500,
      customFields: 9999,
      exportOptions: ['csv', 'pdf', 'excel'],
    },
  },
};

export const TIER_ORDER: TierType[] = ['roc', 'saphir', 'emeraude'];

export function getTierConfig(tier: TierType): TierConfig {
  return TIER_CONFIGS[tier];
}

export function getSubscriptionTierConfig(subscriptionTier: SubscriptionTier): TierConfig | null {
  const cardTier = SUBSCRIPTION_TO_CARD_TIER[subscriptionTier];
  return cardTier ? TIER_CONFIGS[cardTier] : null;
}

export function canAccessFeature(
  currentTier: TierType,
  featureKey: keyof TierFeatures
): boolean {
  const config = getTierConfig(currentTier);
  const featureValue = config.features[featureKey];

  if (typeof featureValue === 'boolean') {
    return featureValue;
  }

  return true;
}

export function getProfileLimit(tier: TierType): number | 'unlimited' {
  return getTierConfig(tier).features.profiles;
}

export function canAddProfile(tier: TierType, currentCount: number): boolean {
  const limit = getProfileLimit(tier);
  if (limit === 'unlimited') return true;
  return currentCount < limit;
}

export function getTierIndex(tier: TierType): number {
  return TIER_ORDER.indexOf(tier);
}

export function isHigherTier(tier1: TierType, tier2: TierType): boolean {
  return getTierIndex(tier1) > getTierIndex(tier2);
}

export function getNextTier(currentTier: TierType): TierType | null {
  const currentIndex = getTierIndex(currentTier);
  if (currentIndex >= TIER_ORDER.length - 1) return null;
  return TIER_ORDER[currentIndex + 1];
}

export const FEATURE_COMPARISON_TABLE = [
  {
    feature: 'Profils personnalisés',
    roc: '1',
    saphir: '3',
    emeraude: 'Illimités',
  },
  {
    feature: 'Carte NFC premium',
    roc: true,
    saphir: true,
    emeraude: true,
  },
  {
    feature: 'Partage illimité',
    roc: true,
    saphir: true,
    emeraude: true,
  },
  {
    feature: 'QR code dynamique',
    roc: true,
    saphir: true,
    emeraude: true,
  },
  {
    feature: 'Pitch vidéo intégré',
    roc: false,
    saphir: true,
    emeraude: true,
  },
  {
    feature: 'CRM intégré',
    roc: false,
    saphir: true,
    emeraude: true,
  },
  {
    feature: 'Statistiques avancées',
    roc: false,
    saphir: true,
    emeraude: true,
  },
  {
    feature: 'Logo personnalisé sur carte',
    roc: false,
    saphir: false,
    emeraude: true,
  },
  {
    feature: 'Adhésion au club VIP',
    roc: false,
    saphir: false,
    emeraude: true,
  },
  {
    feature: 'Support prioritaire',
    roc: false,
    saphir: false,
    emeraude: true,
  },
  {
    feature: 'Accès exclusif aux événements',
    roc: false,
    saphir: false,
    emeraude: true,
  },
];

export function getTierBorderClass(tier: TierType | null): string {
  if (!tier) return 'border-gray-200';
  const config = getTierConfig(tier);
  return config.borderColor;
}

export function getTierGradientClass(tier: TierType | null): string {
  if (!tier) return 'from-gray-400 to-gray-600';
  const config = getTierConfig(tier);
  return `${config.gradientFrom} ${config.gradientTo}`;
}

export function getTierBadgeClass(tier: TierType | null): string {
  if (!tier) return 'bg-gray-500';
  const config = getTierConfig(tier);
  return config.badgeColor;
}
