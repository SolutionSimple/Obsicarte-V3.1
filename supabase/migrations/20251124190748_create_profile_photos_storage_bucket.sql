-- Create Storage Bucket for Profile Photos
--
-- Overview: Creates a Supabase Storage bucket to store user profile photos with proper security policies.
--
-- 1. Bucket Configuration
--    - Bucket name: profile-photos
--    - Public access: Read-only for all users
--    - Maximum file size: 5MB
--    - Allowed file types: JPEG, PNG, WebP
--
-- 2. Security Policies
--    - Authenticated users can upload photos to their own folder (user_id/*)
--    - Authenticated users can update/delete their own photos
--    - Public read access for all uploaded photos
--    - RLS policies enforce user ownership

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view all profile photos" ON storage.objects;

-- Policy: Allow authenticated users to upload photos to their own folder
CREATE POLICY "Users can upload their own profile photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to update their own photos
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

-- Policy: Allow authenticated users to delete their own photos
CREATE POLICY "Users can delete their own profile photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow public read access to all profile photos
CREATE POLICY "Public can view all profile photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-photos');