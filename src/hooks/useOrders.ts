import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Order } from '../types/database.types';

interface UseOrdersOptions {
  status?: Order['status'];
  paymentStatus?: Order['payment_status'];
  userId?: string;
  autoFetch?: boolean;
}

export function useOrders(options: UseOrdersOptions = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.paymentStatus) {
        query = query.eq('payment_status', options.paymentStatus);
      }

      if (options.userId) {
        query = query.eq('user_id', options.userId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getOrder = async (orderId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      return { data, error: null };
    } catch (err) {
      console.error('Error fetching order:', err);
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to fetch order',
      };
    }
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (updateError) throw updateError;

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, ...updates } : order
        )
      );

      return { success: true };
    } catch (err) {
      console.error('Error updating order:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update order',
      };
    }
  };

  const searchOrders = async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: searchError } = await supabase
        .from('orders')
        .select('*')
        .or(`order_number.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%,customer_name.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (searchError) throw searchError;
      setOrders(data || []);
    } catch (err) {
      console.error('Error searching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to search orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchOrders();
    }
  }, [options.status, options.paymentStatus, options.userId]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    getOrder,
    updateOrder,
    searchOrders,
  };
}
