/*
  # Add Image MIME Types to Video Bucket

  ## Overview
  This migration adds image MIME types to the profile-videos bucket to support
  video thumbnail uploads. Thumbnails are generated as WebP images and stored
  alongside the videos in the same bucket.

  ## Changes
  - Adds image/webp, image/jpeg, and image/png to allowed MIME types
  - Maintains all existing video format support

  ## Security
  - No changes to RLS policies
  - Images are only for thumbnails, not user-facing uploads
*/

-- Add image MIME types for thumbnail support
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
  'video/x-m4v',
  'image/webp',
  'image/jpeg',
  'image/png'
]
WHERE id = 'profile-videos';
