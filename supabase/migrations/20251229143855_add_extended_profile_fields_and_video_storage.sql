/*
  # Extended Profile Fields and Video Storage

  ## Overview
  This migration transforms the basic profile into a rich, modular one-page profile system with video introduction capabilities.

  ## New Columns Added to `profiles` Table
  
  ### Presentation Fields
  - `tagline` (varchar 100) - Short catchy phrase displayed under the name
  - `mission_statement` (text) - Detailed mission/pitch section (max 500 chars)
  
  ### Location and Time
  - `location_city` (text) - Selected city from predefined list
  - `location_country` (text) - Auto-detected country based on city
  - `timezone` (text) - Timezone identifier (e.g., "Europe/Paris")
  - `show_local_time` (boolean, default false) - Display real-time local time on profile
  
  ### Online Status
  - `is_online` (boolean, default true) - Show green badge indicating online status
  
  ### Video Introduction
  - `video_url` (text) - URL to uploaded video in Supabase Storage
  - `video_thumbnail_url` (text) - URL to auto-generated thumbnail
  - `video_duration` (integer) - Duration in seconds (max 30)
  - `video_file_size` (bigint) - File size in bytes
  - `total_video_storage` (bigint, default 0) - Total storage used by videos in bytes (max 100MB)
  
  ### Customization
  - `theme_color` (text, default '#C89B3C') - Custom theme color (gold default, Premium feature)

  ## Storage Bucket
  - Creates `profile-videos` bucket for video uploads
  - Public read access
  - Authenticated upload/delete in own folder
  - Max file size: 100MB per file

  ## Security
  - All new columns follow existing RLS policies
  - Storage bucket has restrictive policies for uploads/deletes
  - Public read for videos (shareable profiles)

  ## Data Migration
  - Existing profiles get default values
  - `tagline` initialized from first 100 chars of `bio` if available
  - `mission_statement` initialized from existing `bio`
  - Default timezone set to "Europe/Paris"
*/

-- Add new columns to profiles table
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
    WHERE table_name = 'profiles' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN video_url TEXT;
  END IF;

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

-- Migrate existing data: copy bio to mission_statement and create tagline
UPDATE profiles 
SET 
  mission_statement = COALESCE(bio, ''),
  tagline = CASE 
    WHEN LENGTH(bio) > 100 THEN SUBSTRING(bio FROM 1 FOR 97) || '...'
    ELSE bio
  END
WHERE mission_statement IS NULL;

-- Create storage bucket for profile videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-videos',
  'profile-videos',
  true,
  104857600, -- 100MB in bytes
  ARRAY['video/mp4', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile-videos bucket
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can upload videos to own folder" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own videos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own videos" ON storage.objects;
  DROP POLICY IF EXISTS "Public can view all videos" ON storage.objects;
END $$;

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

-- Allow public read access to all videos (for shareable profiles)
CREATE POLICY "Public can view all videos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'profile-videos');