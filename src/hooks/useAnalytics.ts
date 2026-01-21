import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AnalyticsData {
  totalViews: number;
  totalDownloads: number;
  totalLinkClicks: number;
  conversionRate: number;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  recentEvents: Array<{
    id: string;
    event_type: string;
    device_type: string;
    created_at: string;
    metadata?: any;
  }>;
}

interface PeriodStats {
  views: number;
  downloads: number;
  clicks: number;
}

interface AnalyticsPeriods {
  today: PeriodStats;
  thisWeek: PeriodStats;
  thisMonth: PeriodStats;
  total: PeriodStats;
}

export function useAnalytics(profileId: string | undefined) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [periods, setPeriods] = useState<AnalyticsPeriods | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileId) {
      setLoading(false);
      return;
    }

    async function fetchAnalytics() {
      try {
        setLoading(true);
        setError(null);

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const { data: allEvents, error: eventsError } = await supabase
          .from('profile_analytics')
          .select('*')
          .eq('profile_id', profileId)
          .order('created_at', { ascending: false });

        if (eventsError) throw eventsError;

        const events = allEvents || [];

        const totalViews = events.filter(e => e.event_type === 'view').length;
        const totalDownloads = events.filter(e => e.event_type === 'vcard_download').length;
        const totalLinkClicks = events.filter(e => e.event_type === 'link_click').length;

        const conversionRate = totalViews > 0 ? (totalDownloads / totalViews) * 100 : 0;

        const deviceBreakdown = {
          mobile: events.filter(e => e.device_type === 'mobile').length,
          desktop: events.filter(e => e.device_type === 'desktop').length,
          tablet: events.filter(e => e.device_type === 'tablet').length,
        };

        const recentEvents = events.slice(0, 20);

        setAnalytics({
          totalViews,
          totalDownloads,
          totalLinkClicks,
          conversionRate,
          deviceBreakdown,
          recentEvents,
        });

        const getStatsForPeriod = (start: Date): PeriodStats => {
          const periodEvents = events.filter(e => new Date(e.created_at) >= start);
          return {
            views: periodEvents.filter(e => e.event_type === 'view').length,
            downloads: periodEvents.filter(e => e.event_type === 'vcard_download').length,
            clicks: periodEvents.filter(e => e.event_type === 'link_click').length,
          };
        };

        setPeriods({
          today: getStatsForPeriod(todayStart),
          thisWeek: getStatsForPeriod(weekStart),
          thisMonth: getStatsForPeriod(monthStart),
          total: {
            views: totalViews,
            downloads: totalDownloads,
            clicks: totalLinkClicks,
          },
        });

      } catch (err: any) {
        console.error('Error fetching analytics:', err);
        setError(err.message || 'Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();

    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [profileId]);

  return { analytics, periods, loading, error };
}
