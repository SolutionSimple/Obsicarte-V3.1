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

export interface UserRole {
  id: string;
  user_id: string;
  role: 'customer' | 'admin' | 'reseller';
  created_at: string;
}

export interface Card {
  id: string;
  card_code: string;
  nfc_uid: string | null;
  status: 'pending' | 'activated' | 'deactivated' | 'shipped';
  profile_id: string | null;
  tier: 'roc' | 'saphir' | 'emeraude';
  order_id: string | null;
  reseller_id: string | null;
  activation_code: string;
  activated_at: string | null;
  shipped_at: string | null;
  created_at: string;
  metadata: Record<string, any>;
}

export interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  shipping_address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  tier: 'roc' | 'saphir' | 'emeraude';
  quantity: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  stripe_payment_intent_id: string | null;
  stripe_customer_id: string | null;
  user_id: string | null;
  notes: string | null;
  created_at: string;
  confirmed_at: string | null;
  shipped_at: string | null;
}

export interface Reseller {
  id: string;
  user_id: string;
  company_name: string;
  contact_email: string;
  contact_phone: string | null;
  commission_rate: number;
  status: 'active' | 'suspended' | 'inactive';
  total_sales: number;
  created_at: string;
  updated_at: string;
}

export interface ActivationBatch {
  id: string;
  batch_name: string;
  tier: 'roc' | 'saphir' | 'emeraude';
  cards_count: number;
  status: 'draft' | 'ready' | 'assigned';
  created_by: string;
  assigned_to_reseller_id: string | null;
  notes: string | null;
  created_at: string;
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
      user_roles: {
        Row: UserRole;
        Insert: Omit<UserRole, 'id' | 'created_at'>;
        Update: Partial<Omit<UserRole, 'id' | 'created_at'>>;
      };
      cards: {
        Row: Card;
        Insert: Omit<Card, 'id' | 'created_at'>;
        Update: Partial<Omit<Card, 'id' | 'created_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at'>;
        Update: Partial<Omit<Order, 'id' | 'created_at'>>;
      };
      resellers: {
        Row: Reseller;
        Insert: Omit<Reseller, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Reseller, 'id' | 'created_at' | 'updated_at'>>;
      };
      activation_batches: {
        Row: ActivationBatch;
        Insert: Omit<ActivationBatch, 'id' | 'created_at'>;
        Update: Partial<Omit<ActivationBatch, 'id' | 'created_at'>>;
      };
    };
  };
};
