import { useState } from 'react';

interface ActivationResult {
  success: boolean;
  message?: string;
  profileId?: string;
  shouldOnboard?: boolean;
}

export function useCardActivation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activateCard = async (
    activationCode: string,
    email: string
  ): Promise<ActivationResult> => {
    setLoading(true);
    setError(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/activate-card`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            activationCode,
            email,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Activation failed');
      }

      const data = await response.json();

      return {
        success: true,
        message: data.message,
        profileId: data.profileId,
        shouldOnboard: data.shouldOnboard,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Activation failed';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    activateCard,
    loading,
    error,
  };
}
