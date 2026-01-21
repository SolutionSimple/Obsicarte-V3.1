import { supabase } from '../lib/supabase';

type EventType = 'view' | 'vcard_download' | 'link_click';

export async function trackEvent(
  profileId: string,
  eventType: EventType,
  metadata?: Record<string, any>
) {
  const deviceType = getDeviceType();
  const userAgent = navigator.userAgent;
  const referrer = document.referrer;

  await supabase.from('profile_analytics').insert({
    profile_id: profileId,
    event_type: eventType,
    device_type: deviceType,
    user_agent: userAgent,
    referrer: referrer,
    ip_hash: '',
    country_code: '',
    metadata: metadata || {},
  });
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

export async function incrementViewCount(profileId: string) {
  await supabase.rpc('increment_view_count', { profile_id: profileId }).catch(() => {
    supabase
      .from('profiles')
      .select('view_count')
      .eq('id', profileId)
      .single()
      .then(({ data }) => {
        if (data) {
          supabase
            .from('profiles')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', profileId);
        }
      });
  });
}
