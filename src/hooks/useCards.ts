import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Card } from '../types/database.types';

interface UseCardsOptions {
  status?: Card['status'];
  tier?: Card['tier'];
  resellerId?: string;
  autoFetch?: boolean;
}

export function useCards(options: UseCardsOptions = {}) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.tier) {
        query = query.eq('tier', options.tier);
      }

      if (options.resellerId) {
        query = query.eq('reseller_id', options.resellerId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setCards(data || []);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cards');
    } finally {
      setLoading(false);
    }
  };

  const updateCard = async (cardId: string, updates: Partial<Card>) => {
    try {
      const { error: updateError } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', cardId);

      if (updateError) throw updateError;

      setCards(prevCards =>
        prevCards.map(card =>
          card.id === cardId ? { ...card, ...updates } : card
        )
      );

      return { success: true };
    } catch (err) {
      console.error('Error updating card:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update card',
      };
    }
  };

  const searchCards = async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: searchError } = await supabase
        .from('cards')
        .select('*')
        .or(`card_code.ilike.%${searchTerm}%,activation_code.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (searchError) throw searchError;
      setCards(data || []);
    } catch (err) {
      console.error('Error searching cards:', err);
      setError(err instanceof Error ? err.message : 'Failed to search cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchCards();
    }
  }, [options.status, options.tier, options.resellerId]);

  return {
    cards,
    loading,
    error,
    fetchCards,
    updateCard,
    searchCards,
  };
}
