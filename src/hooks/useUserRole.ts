import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types/database.types';

export function useUserRole() {
  const [role, setRole] = useState<'customer' | 'admin' | 'reseller' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setRole(data.role);
      } else {
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role: 'customer' });

        if (!insertError) {
          setRole('customer');
        }
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = role === 'admin';
  const isReseller = role === 'reseller';
  const isCustomer = role === 'customer';

  return {
    role,
    loading,
    isAdmin,
    isReseller,
    isCustomer,
    refetch: fetchUserRole,
  };
}
