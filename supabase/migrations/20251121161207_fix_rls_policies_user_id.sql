/*
  # Fix RLS Policies - Correct user_id vs id Issue

  ## Problem
  The previous migration incorrectly changed RLS policies to compare `auth.uid() = id`
  when it should be `auth.uid() = user_id`. The `id` column is the profile's UUID,
  but `user_id` is the foreign key to auth.users.

  ## Changes
  1. **Fix profiles table policies**
     - Correct INSERT policy to check `auth.uid() = user_id`
     - Correct UPDATE policy to check `auth.uid() = user_id`
     - Correct DELETE policy to check `auth.uid() = user_id`

  2. **Fix profile_analytics policies**
     - Correct SELECT policy to check `profiles.user_id = auth.uid()`

  3. **Fix profile_leads policies**
     - Correct all policies to check `profiles.user_id = auth.uid()`

  ## Impact
  - Users will now be able to create, update, and delete their own profiles
  - Profile analytics and leads access will work correctly
*/

-- Fix profiles table policies
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

-- Fix profile_analytics table policies
DROP POLICY IF EXISTS "Users can view analytics for their own profiles" ON profile_analytics;

CREATE POLICY "Users can view analytics for their own profiles"
  ON profile_analytics FOR SELECT
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = (SELECT auth.uid())
    )
  );

-- Fix profile_leads table policies
DROP POLICY IF EXISTS "Users can view leads for their own profiles" ON profile_leads;
DROP POLICY IF EXISTS "Users can insert leads to their own profiles" ON profile_leads;
DROP POLICY IF EXISTS "Users can update leads for their own profiles" ON profile_leads;
DROP POLICY IF EXISTS "Users can delete leads from their own profiles" ON profile_leads;

CREATE POLICY "Users can view leads for their own profiles"
  ON profile_leads FOR SELECT
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can insert leads to their own profiles"
  ON profile_leads FOR INSERT
  TO authenticated
  WITH CHECK (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can update leads for their own profiles"
  ON profile_leads FOR UPDATE
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can delete leads from their own profiles"
  ON profile_leads FOR DELETE
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = (SELECT auth.uid())
    )
  );
