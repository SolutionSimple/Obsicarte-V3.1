export interface Profile {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  title: string;
  bio: string;
  phone: string;
  email: string;
  website: string;
  profile_photo_url: string;
  video_url: string;
  video_thumbnail_url?: string;
  video_duration?: number;
  video_file_size?: number;
  total_video_storage?: number;
  pdf_url: string;
  social_links: SocialLinks;
  design_template: string;
  qr_customization: QRCustomization;
  lead_collection_enabled: boolean;
  lead_form_fields: LeadFormFields;
  is_active: boolean;
  view_count: number;
  sector: string;
  custom_fields: any[];
  tagline?: string;
  mission_statement?: string;
  location_city?: string;
  location_country?: string;
  timezone?: string;
  show_local_time?: boolean;
  is_online?: boolean;
  theme_color?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  github?: string;
  youtube?: string;
  tiktok?: string;
}

export interface QRCustomization {
  color?: string;
  backgroundColor?: string;
  size?: number;
  includeMargin?: boolean;
}

export interface LeadFormFields {
  name: boolean;
  email: boolean;
  phone: boolean;
  message: boolean;
}

export interface ProfileAnalytics {
  id: string;
  profile_id: string;
  event_type: 'view' | 'vcard_download' | 'link_click';
  device_type: string;
  user_agent: string;
  referrer: string;
  ip_hash: string;
  country_code: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ProfileLead {
  id: string;
  profile_id: string;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  tags: string[];
  notes: string;
  consented_at: string;
  unsubscribed_at: string | null;
  source_url: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: 'free' | 'premium' | 'premium_plus';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      profile_analytics: {
        Row: ProfileAnalytics;
        Insert: Omit<ProfileAnalytics, 'id' | 'created_at'>;
        Update: Partial<Omit<ProfileAnalytics, 'id' | 'created_at'>>;
      };
      profile_leads: {
        Row: ProfileLead;
        Insert: Omit<ProfileLead, 'id' | 'created_at'>;
        Update: Partial<Omit<ProfileLead, 'id' | 'created_at'>>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Subscription, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};
