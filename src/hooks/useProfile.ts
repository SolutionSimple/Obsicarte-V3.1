import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/database.types';
import { useAuth } from '../contexts/AuthContext';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user!.id)
          .maybeSingle();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return { error: 'No user or profile found' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, ...updates });
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      return { error: errorMessage };
    }
  };

  const createProfile = async (data: {
    username: string;
    full_name: string;
    title?: string;
    email?: string;
    phone?: string;
    sector?: string;
    custom_fields?: any[];
  }) => {
    if (!user) return { error: 'No user found' };

    try {
      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          username: data.username,
          full_name: data.full_name,
          title: data.title || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: '',
          website: '',
          profile_photo_url: '',
          video_url: '',
          pdf_url: '',
          social_links: {},
          design_template: 'modern',
          qr_customization: {},
          lead_collection_enabled: false,
          lead_form_fields: { name: true, email: true, phone: false, message: false },
          is_active: true,
          view_count: 0,
          sector: data.sector || 'personnalise',
          custom_fields: data.custom_fields || [],
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(newProfile);

      await supabase.from('subscriptions').insert({
        user_id: user.id,
        tier: 'free',
        status: 'active',
      });

      return { error: null, profile: newProfile };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile';
      return { error: errorMessage, profile: null };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    createProfile,
  };
}
