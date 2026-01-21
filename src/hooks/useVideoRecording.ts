import { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  getVideoDuration,
  generateThumbnail,
  MAX_VIDEO_DURATION
} from '../utils/video';

export interface VideoRecordingState {
  uploading: boolean;
  progress: number;
  error: string | null;
}

export function useVideoRecording(userId: string) {
  const [state, setState] = useState<VideoRecordingState>({
    uploading: false,
    progress: 0,
    error: null,
  });

  const uploadRecording = async (blob: Blob) => {
    setState({
      uploading: false,
      progress: 0,
      error: null,
    });

    try {
      const file = new File([blob], `recording-${Date.now()}.webm`, { type: blob.type });

      setState(prev => ({ ...prev, uploading: true, progress: 0 }));

      const duration = await getVideoDuration(file);

      if (duration > MAX_VIDEO_DURATION) {
        setState({
          uploading: false,
          progress: 0,
          error: `La vidéo dépasse la durée maximale de ${MAX_VIDEO_DURATION} secondes.`,
        });
        return null;
      }

      const timestamp = Date.now();
      const videoPath = `${userId}/video_${timestamp}.mp4`;
      const thumbnailPath = `${userId}/thumbnails/thumb_${timestamp}.webp`;

      const thumbnail = await generateThumbnail(file);

      const { error: uploadError } = await supabase.storage
        .from('profile-videos')
        .upload(videoPath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      setState({ uploading: true, progress: 50, error: null });

      const { error: thumbnailError } = await supabase.storage
        .from('profile-videos')
        .upload(thumbnailPath, thumbnail, {
          cacheControl: '3600',
          upsert: false,
        });

      if (thumbnailError) {
        throw thumbnailError;
      }

      const { data: videoData } = supabase.storage
        .from('profile-videos')
        .getPublicUrl(videoPath);

      const { data: thumbnailData } = supabase.storage
        .from('profile-videos')
        .getPublicUrl(thumbnailPath);

      setState({
        uploading: false,
        progress: 100,
        error: null,
      });

      return {
        videoUrl: videoData.publicUrl,
        thumbnailUrl: thumbnailData.publicUrl,
        duration: Math.floor(duration),
        fileSize: file.size,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setState({
        uploading: false,
        progress: 0,
        error: errorMessage,
      });
      return null;
    }
  };

  const deleteVideo = async (videoUrl: string, thumbnailUrl: string) => {
    try {
      const videoPath = videoUrl.split('/profile-videos/')[1];
      const thumbnailPath = thumbnailUrl.split('/profile-videos/')[1];

      if (videoPath) {
        await supabase.storage.from('profile-videos').remove([videoPath]);
      }

      if (thumbnailPath) {
        await supabase.storage.from('profile-videos').remove([thumbnailPath]);
      }

      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  };

  return {
    ...state,
    uploadRecording,
    deleteVideo,
  };
}
