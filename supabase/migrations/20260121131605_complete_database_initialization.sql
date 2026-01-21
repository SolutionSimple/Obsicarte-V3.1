/*
  # Complete Database Initialization

  ## Overview
  This migration ensures all required database elements are in place for the application to function correctly.

  ## 1. Missing Profile Columns
  Adds extended profile fields that were missing:
  - `tagline` (varchar 100) - Short catchy phrase
  - `mission_statement` (text) - Detailed mission/pitch
  - `location_city` (text) - Selected city
  - `location_country` (text) - Country based on city
  - `timezone` (text) - Timezone identifier
  - `show_local_time` (boolean) - Display local time
  - `is_online` (boolean) - Online status badge
  - `video_thumbnail_url` (text) - Video thumbnail URL
  - `video_duration` (integer) - Video duration in seconds
  - `video_file_size` (bigint) - Video file size in bytes
  - `total_video_storage` (bigint) - Total video storage used
  - `theme_color` (text) - Custom theme color

  ## 2. Storage Buckets
  Creates two public storage buckets:
  - `profile-photos` - For profile pictures (5MB max, images only)
  - `profile-videos` - For video introductions (100MB max, videos + thumbnails)

  ## 3. Storage Security Policies
  Implements RLS policies for both buckets:
  - Authenticated users can upload/update/delete their own files
  - Public read access for all files (shareable profiles)
  - Files organized by user_id folders

  ## Security
  - All operations use IF NOT EXISTS to be idempotent
  - RLS policies enforce user ownership
  - Public read access for profile sharing
  - Validates profile_id in analytics and leads
*/

-- ============================================================================
-- 1. ADD MISSING COLUMNS TO PROFILES TABLE
-- ============================================================================

DO $$ 
BEGIN
  -- Presentation fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'tagline'
  ) THEN
    ALTER TABLE profiles ADD COLUMN tagline VARCHAR(100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'mission_statement'
  ) THEN
    ALTER TABLE profiles ADD COLUMN mission_statement TEXT;
  END IF;

  -- Location and time
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'location_city'
  ) THEN
    ALTER TABLE profiles ADD COLUMN location_city TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'location_country'
  ) THEN
    ALTER TABLE profiles ADD COLUMN location_country TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'timezone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN timezone TEXT DEFAULT 'Europe/Paris';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'show_local_time'
  ) THEN
    ALTER TABLE profiles ADD COLUMN show_local_time BOOLEAN DEFAULT false;
  END IF;

  -- Online status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_online'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_online BOOLEAN DEFAULT true;
  END IF;

  -- Video fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'video_thumbnail_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN video_thumbnail_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'video_duration'
  ) THEN
    ALTER TABLE profiles ADD COLUMN video_duration INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'video_file_size'
  ) THEN
    ALTER TABLE profiles ADD COLUMN video_file_size BIGINT DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'total_video_storage'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_video_storage BIGINT DEFAULT 0;
  END IF;

  -- Customization
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'theme_color'
  ) THEN
    ALTER TABLE profiles ADD COLUMN theme_color TEXT DEFAULT '#C89B3C';
  END IF;
END $$;

-- ============================================================================
-- 2. CREATE STORAGE BUCKETS
-- ============================================================================

-- Create profile-photos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create profile-videos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-videos',
  'profile-videos',
  true,
  104857600, -- 100MB in bytes
  ARRAY[
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'video/avi',
    'video/x-matroska',
    'video/mkv',
    'video/ogg',
    'video/3gpp',
    'video/3gpp2',
    'video/x-m4v',
    'image/webp',
    'image/jpeg',
    'image/png'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. STORAGE RLS POLICIES FOR PROFILE-PHOTOS
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view all profile photos" ON storage.objects;

-- Allow authenticated users to upload photos to their own folder
CREATE POLICY "Users can upload their own profile photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to update their own photos
CREATE POLICY "Users can update their own profile photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to delete their own photos
CREATE POLICY "Users can delete their own profile photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow public read access to all profile photos
CREATE POLICY "Public can view all profile photos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'profile-photos');

-- ============================================================================
-- 4. STORAGE RLS POLICIES FOR PROFILE-VIDEOS
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload videos to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own videos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view all videos" ON storage.objects;

-- Allow authenticated users to upload videos to their own folder
CREATE POLICY "Users can upload videos to own folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to update their own videos
CREATE POLICY "Users can update own videos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'profile-videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to delete their own videos
CREATE POLICY "Users can delete own videos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow public read access to all videos
CREATE POLICY "Public can view all videos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'profile-videos');

-- ============================================================================
-- 5. ADD INDEXES FOR PERFORMANCE (IF MISSING)
-- ============================================================================

-- Index for profile_analytics.profile_id
CREATE INDEX IF NOT EXISTS idx_profile_analytics_profile_id 
  ON profile_analytics(profile_id);

-- Index for profile_leads.profile_id
CREATE INDEX IF NOT EXISTS idx_profile_leads_profile_id 
  ON profile_leads(profile_id);

-- Index for profiles.user_id
CREATE INDEX IF NOT EXISTS idx_profiles_user_id 
  ON profiles(user_id);

-- Index for profiles.username (for public profile lookups)
CREATE INDEX IF NOT EXISTS idx_profiles_username 
  ON profiles(username);
