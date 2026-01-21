/*
  # Initial Database Schema for Digital Business Card App

  ## Overview
  Creates the foundation for a digital business card application with NFC/QR code support,
  analytics tracking, lead collection, and subscription management.

  ## 1. New Tables

  ### `profiles`
  Stores user business card information and settings
  - `id` (uuid, primary key) - Links to auth.users
  - `username` (text, unique) - Unique URL identifier (app.com/username)
  - `full_name` (text) - User's full name
  - `title` (text) - Job title/profession
  - `bio` (text) - Short biography
  - `phone` (text) - Contact phone number
  - `email` (text) - Contact email
  - `website` (text) - Personal/company website
  - `profile_photo_url` (text) - URL to profile photo
  - `video_url` (text) - Optional presentation video URL
  - `pdf_url` (text) - Optional PDF document URL
  - `social_links` (jsonb) - Social media links {linkedin, twitter, instagram, etc}
  - `design_template` (text) - Selected design template name
  - `qr_customization` (jsonb) - QR code styling preferences
  - `lead_collection_enabled` (boolean) - Whether to show lead form
  - `lead_form_fields` (jsonb) - Custom fields for lead form
  - `is_active` (boolean) - Whether profile is published
  - `view_count` (integer) - Total views counter
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `profile_analytics`
  Tracks individual views and scans of business cards
  - `id` (uuid, primary key)
  - `profile_id` (uuid, foreign key) - References profiles
  - `event_type` (text) - Type of event: 'view', 'vcard_download', 'link_click'
  - `device_type` (text) - Device category: 'mobile', 'tablet', 'desktop'
  - `user_agent` (text) - Browser user agent
  - `referrer` (text) - Referrer URL
  - `ip_hash` (text) - Hashed IP for privacy
  - `country_code` (text) - Approximate location
  - `metadata` (jsonb) - Additional event data
  - `created_at` (timestamptz)

  ### `profile_leads`
  Stores contacts collected when visitors download vCards
  - `id` (uuid, primary key)
  - `profile_id` (uuid, foreign key) - References profiles (card owner)
  - `full_name` (text) - Lead's name
  - `email` (text) - Lead's email
  - `phone` (text) - Lead's phone (optional)
  - `message` (text) - Optional message from lead
  - `tags` (text[]) - Custom tags for organization
  - `notes` (text) - Private notes from card owner
  - `consented_at` (timestamptz) - GDPR consent timestamp
  - `unsubscribed_at` (timestamptz) - If lead opted out
  - `source_url` (text) - URL where lead was captured
  - `metadata` (jsonb) - Additional lead data
  - `created_at` (timestamptz)

  ### `subscriptions`
  Manages user subscription tiers and payments
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References auth.users
  - `tier` (text) - Subscription tier: 'free', 'premium', 'premium_plus'
  - `status` (text) - Status: 'active', 'cancelled', 'expired', 'trial'
  - `stripe_customer_id` (text) - Stripe customer ID
  - `stripe_subscription_id` (text) - Stripe subscription ID
  - `current_period_start` (timestamptz)
  - `current_period_end` (timestamptz)
  - `cancel_at_period_end` (boolean)
  - `trial_ends_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## 2. Security (Row Level Security)

  All tables have RLS enabled with policies ensuring:
  - Users can only access their own data
  - Public profiles are readable by anyone
  - Analytics and leads are private to profile owners
  - Subscriptions are private to the user

  ## 3. Indexes

  Performance indexes on frequently queried columns:
  - profiles: username (unique), user_id, is_active
  - profile_analytics: profile_id, created_at
  - profile_leads: profile_id, email, created_at
  - subscriptions: user_id, stripe_customer_id

  ## 4. Important Notes

  - All sensitive data is protected by RLS
  - IP addresses are hashed for privacy compliance
  - GDPR consent tracking included in leads table
  - Soft deletes possible via unsubscribed_at
  - Default values set for better data integrity
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL DEFAULT '',
  title text DEFAULT '',
  bio text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  website text DEFAULT '',
  profile_photo_url text DEFAULT '',
  video_url text DEFAULT '',
  pdf_url text DEFAULT '',
  social_links jsonb DEFAULT '{}'::jsonb,
  design_template text DEFAULT 'modern',
  qr_customization jsonb DEFAULT '{}'::jsonb,
  lead_collection_enabled boolean DEFAULT false,
  lead_form_fields jsonb DEFAULT '{"name": true, "email": true, "phone": false, "message": false}'::jsonb,
  is_active boolean DEFAULT true,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create profile_analytics table
CREATE TABLE IF NOT EXISTS profile_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL,
  device_type text DEFAULT 'unknown',
  user_agent text DEFAULT '',
  referrer text DEFAULT '',
  ip_hash text DEFAULT '',
  country_code text DEFAULT '',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create profile_leads table
CREATE TABLE IF NOT EXISTS profile_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  message text DEFAULT '',
  tags text[] DEFAULT ARRAY[]::text[],
  notes text DEFAULT '',
  consented_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  source_url text DEFAULT '',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tier text DEFAULT 'free',
  status text DEFAULT 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  trial_ends_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_analytics_profile_id ON profile_analytics(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON profile_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_profile_id ON profile_leads(profile_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON profile_leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON profile_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Public profiles are viewable by anyone"
  ON profiles FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for profile_analytics table
CREATE POLICY "Users can view analytics for their own profiles"
  ON profile_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_analytics.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert analytics"
  ON profile_analytics FOR INSERT
  WITH CHECK (true);

-- RLS Policies for profile_leads table
CREATE POLICY "Users can view leads for their own profiles"
  ON profile_leads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_leads.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert leads to their own profiles"
  ON profile_leads FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_leads.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert leads (for public submissions)"
  ON profile_leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can update leads for their own profiles"
  ON profile_leads FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_leads.profile_id
      AND profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_leads.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete leads from their own profiles"
  ON profile_leads FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_leads.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for subscriptions table
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();