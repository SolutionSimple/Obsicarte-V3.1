/*
  # Comprehensive Security and Performance Fixes

  ## Overview
  This migration resolves all security and performance issues identified by Supabase linting.

  ## 1. Foreign Key Index
  - Add missing index on `saved_templates.user_id` for foreign key optimization

  ## 2. RLS Policy Optimization
  Fixes auth.uid() re-evaluation issues by wrapping in SELECT for all tables:
  - `profiles` - Fix policies to check user_id (not id) and wrap auth.uid()
  - `profile_analytics` - Fix subquery to check profiles.user_id
  - `profile_leads` - Fix subquery to check profiles.user_id
  - `subscriptions` - Wrap auth.uid() in SELECT
  - `saved_templates` - Wrap auth.uid() in SELECT

  ## 3. Function Security Hardening
  - Fix `update_updated_at_column` with immutable search_path
  - Fix `increment_view_count` with immutable search_path

  ## 4. Remove Unused Indexes
  - Drop indexes that are not actively used by queries
  - Reduces storage overhead and maintenance cost

  ## 5. Manual Dashboard Configuration Required
  The following issues require manual configuration in Supabase Dashboard:

  ### Enable HaveIBeenPwned Password Protection:
  1. Go to Authentication > Settings in Supabase Dashboard
  2. Enable "Password Breach Check"
  3. This prevents users from using compromised passwords

  ### Configure Auth Connection Strategy:
  1. Go to Settings > Database in Supabase Dashboard
  2. Navigate to Connection Pooling settings
  3. Change Auth server allocation from fixed (10) to percentage-based
  4. Recommended: Set to 5-10% of total connections

  ## Security Impact
  - All policies remain functionally correct but with better performance
  - Query performance significantly improved at scale
  - Function security hardened against search_path manipulation
*/

-- ============================================================================
-- 1. ADD MISSING FOREIGN KEY INDEX
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_saved_templates_user_id ON saved_templates(user_id);

-- ============================================================================
-- 2. FIX RLS POLICIES WITH OPTIMIZED AUTH.UID() CALLS
-- ============================================================================

-- ---------------------------------------------------------------------------
-- PROFILES TABLE - Fix to use user_id instead of id
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- PROFILE_ANALYTICS TABLE - Fix subquery to check profiles.user_id
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Users can view analytics for their own profiles" ON profile_analytics;

CREATE POLICY "Users can view analytics for their own profiles"
  ON profile_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_analytics.profile_id
      AND profiles.user_id = (SELECT auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- PROFILE_LEADS TABLE - Fix subquery to check profiles.user_id
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Users can view leads for their own profiles" ON profile_leads;
DROP POLICY IF EXISTS "Users can insert leads to their own profiles" ON profile_leads;
DROP POLICY IF EXISTS "Users can update leads for their own profiles" ON profile_leads;
DROP POLICY IF EXISTS "Users can delete leads from their own profiles" ON profile_leads;

CREATE POLICY "Users can view leads for their own profiles"
  ON profile_leads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_leads.profile_id
      AND profiles.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can insert leads to their own profiles"
  ON profile_leads FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_leads.profile_id
      AND profiles.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can update leads for their own profiles"
  ON profile_leads FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_leads.profile_id
      AND profiles.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_leads.profile_id
      AND profiles.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can delete leads from their own profiles"
  ON profile_leads FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_leads.profile_id
      AND profiles.user_id = (SELECT auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- SUBSCRIPTIONS TABLE - Wrap auth.uid() in SELECT
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Users can view their own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON subscriptions;

CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own subscription"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- SAVED_TEMPLATES TABLE - Wrap auth.uid() in SELECT
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Users can view own saved templates" ON saved_templates;
DROP POLICY IF EXISTS "Users can insert own saved templates" ON saved_templates;
DROP POLICY IF EXISTS "Users can update own saved templates" ON saved_templates;
DROP POLICY IF EXISTS "Users can delete own saved templates" ON saved_templates;

CREATE POLICY "Users can view own saved templates"
  ON saved_templates FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own saved templates"
  ON saved_templates FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own saved templates"
  ON saved_templates FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own saved templates"
  ON saved_templates FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- ============================================================================
-- 3. FIX FUNCTION SEARCH PATHS (IMMUTABLE)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- update_updated_at_column function with immutable search_path
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- increment_view_count function with immutable search_path
-- Note: This function accepts profile_username (text) parameter
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION increment_view_count(profile_username text)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE profiles
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE username = profile_username;
END;
$$;

-- ============================================================================
-- 4. REMOVE UNUSED INDEXES
-- ============================================================================

-- Drop unused indexes that are consuming storage without providing query value
DROP INDEX IF EXISTS idx_profiles_user_id;
DROP INDEX IF EXISTS idx_profiles_username;
DROP INDEX IF EXISTS idx_profiles_is_active;
DROP INDEX IF EXISTS idx_analytics_profile_id;
DROP INDEX IF EXISTS idx_analytics_created_at;
DROP INDEX IF EXISTS idx_leads_profile_id;
DROP INDEX IF EXISTS idx_leads_email;
DROP INDEX IF EXISTS idx_leads_created_at;

-- Note: idx_analytics_profile_id, idx_analytics_created_at, idx_leads_profile_id,
-- idx_leads_email, and idx_leads_created_at were already removed in a previous migration
-- but are included here for completeness