/*
  # Update Video Bucket MIME Types

  ## Overview
  This migration updates the profile-videos storage bucket to accept multiple video formats.
  While videos are converted to MP4 on the client side before upload, accepting multiple
  formats provides flexibility and fallback support.

  ## Changes
  - Updates `allowed_mime_types` for the profile-videos bucket
  - Accepts: MP4, WebM, MOV, AVI, MKV, OGG, 3GP formats

  ## Security
  - Maintains existing RLS policies
  - No changes to access control
  - Client-side conversion to MP4 ensures compatibility
*/

-- Update the profile-videos bucket to accept multiple video formats
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
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
  'video/x-m4v'
]
WHERE id = 'profile-videos';
