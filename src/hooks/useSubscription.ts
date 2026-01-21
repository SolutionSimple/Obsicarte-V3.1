import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Subscription } from '../types/database.types';
import { FIELD_LIMITS, SAVED_TEMPLATE_LIMITS } from '../types/custom-fields.types';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    async function fetchSubscription() {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user!.id)
          .maybeSingle();

        if (error) throw error;
        setSubscription(data);
      } catch (err) {
        console.error('Failed to fetch subscription:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [user]);

  const tier = subscription?.tier || 'free';

  const maxCustomFields = FIELD_LIMITS[tier as keyof typeof FIELD_LIMITS] || FIELD_LIMITS.free;
  const maxSavedTemplates = SAVED_TEMPLATE_LIMITS[tier as keyof typeof SAVED_TEMPLATE_LIMITS] || SAVED_TEMPLATE_LIMITS.free;

  const canAddCustomField = (currentCount: number): boolean => {
    return currentCount < maxCustomFields;
  };

  const canSaveTemplate = (currentCount: number): boolean => {
    return currentCount < maxSavedTemplates;
  };

  return {
    subscription,
    loading,
    tier,
    maxCustomFields,
    maxSavedTemplates,
    canAddCustomField,
    canSaveTemplate,
  };
}
