/*
  # Fix Security and Performance Issues

  ## Changes Made

  1. **Add Missing Index**
     - Add index on `saved_templates.user_id` for foreign key performance

  2. **Optimize RLS Policies**
     - Replace `auth.uid()` with `(select auth.uid())` in all RLS policies
     - This prevents re-evaluation for each row and improves query performance
     - Affects tables: profiles, profile_analytics, profile_leads, subscriptions, saved_templates

  3. **Fix Function Search Paths**
     - Set explicit search_path for functions to prevent security issues
     - Affects: update_updated_at_column, increment_view_count

  4. **Remove Unused Indexes**
     - Drop indexes that are not being used by queries
     - Reduces storage overhead and maintenance cost

  ## Security Impact
     - All policies remain functionally identical
     - Performance significantly improved at scale
     - Function security hardened with explicit search paths
*/

-- 1. Add missing index for saved_templates foreign key
CREATE INDEX IF NOT EXISTS idx_saved_templates_user_id ON saved_templates(user_id);

-- 2. Drop and recreate RLS policies with optimized auth.uid() calls

-- profiles table policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = id);

-- profile_analytics table policies
DROP POLICY IF EXISTS "Users can view analytics for their own profiles" ON profile_analytics;

CREATE POLICY "Users can view analytics for their own profiles"
  ON profile_analytics FOR SELECT
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE id = (select auth.uid())
    )
  );

-- profile_leads table policies
DROP POLICY IF EXISTS "Users can view leads for their own profiles" ON profile_leads;
DROP POLICY IF EXISTS "Users can insert leads to their own profiles" ON profile_leads;
DROP POLICY IF EXISTS "Users can update leads for their own profiles" ON profile_leads;
DROP POLICY IF EXISTS "Users can delete leads from their own profiles" ON profile_leads;

CREATE POLICY "Users can view leads for their own profiles"
  ON profile_leads FOR SELECT
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE id = (select auth.uid())
    )
  );

CREATE POLICY "Users can insert leads to their own profiles"
  ON profile_leads FOR INSERT
  TO authenticated
  WITH CHECK (
    profile_id IN (
      SELECT id FROM profiles WHERE id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update leads for their own profiles"
  ON profile_leads FOR UPDATE
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE id = (select auth.uid())
    )
  )
  WITH CHECK (
    profile_id IN (
      SELECT id FROM profiles WHERE id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete leads from their own profiles"
  ON profile_leads FOR DELETE
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE id = (select auth.uid())
    )
  );

-- subscriptions table policies
DROP POLICY IF EXISTS "Users can view their own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON subscriptions;

CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own subscription"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- saved_templates table policies
DROP POLICY IF EXISTS "Users can view own saved templates" ON saved_templates;
DROP POLICY IF EXISTS "Users can insert own saved templates" ON saved_templates;
DROP POLICY IF EXISTS "Users can update own saved templates" ON saved_templates;
DROP POLICY IF EXISTS "Users can delete own saved templates" ON saved_templates;

CREATE POLICY "Users can view own saved templates"
  ON saved_templates FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own saved templates"
  ON saved_templates FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own saved templates"
  ON saved_templates FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own saved templates"
  ON saved_templates FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- 3. Fix function search paths
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

-- 4. Remove unused indexes
DROP INDEX IF EXISTS idx_profiles_is_active;
DROP INDEX IF EXISTS idx_analytics_profile_id;
DROP INDEX IF EXISTS idx_analytics_created_at;
DROP INDEX IF EXISTS idx_leads_profile_id;
DROP INDEX IF EXISTS idx_leads_email;
DROP INDEX IF EXISTS idx_leads_created_at;
