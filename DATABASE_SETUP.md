# Database Setup Instructions

Due to a technical issue with the automated migration tools, please run this SQL manually in your Supabase SQL Editor.

## How to Run This Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy and paste the SQL below
6. Click "Run" or press Cmd/Ctrl + Enter

## Migration SQL

```sql
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
```

## Verification

After running the migration, verify it worked by running:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'profile_analytics', 'profile_leads', 'subscriptions');
```

You should see all 4 tables listed.
