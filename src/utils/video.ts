export const MAX_VIDEO_DURATION = 20;
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
export const MAX_STORAGE_PER_USER = 100 * 1024 * 1024;

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/avi',
  'video/x-m4v',
  'video/3gpp',
  'video/3gpp2',
  'video/x-matroska',
  'video/mkv',
  'video/ogg'
];

export interface VideoValidationResult {
  valid: boolean;
  error?: string;
}

export async function validateVideo(file: File): Promise<VideoValidationResult> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const acceptedExtensions = ['mp4', 'webm', 'mov', 'avi', 'm4v', '3gp', '3g2', 'mkv', 'ogg'];

  if (file.type && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
    if (!fileExtension || !acceptedExtensions.includes(fileExtension)) {
      return {
        valid: false,
        error: 'Format non supporté. Utilisez MP4, WebM, MOV, AVI, MKV ou OGG.',
      };
    }
  }

  if (!file.type && (!fileExtension || !acceptedExtensions.includes(fileExtension))) {
    return {
      valid: false,
      error: 'Format non supporté. Utilisez MP4, WebM, MOV, AVI, MKV ou OGG.',
    };
  }

  if (file.size > MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: `La vidéo dépasse la taille maximale de ${MAX_VIDEO_SIZE / 1024 / 1024}MB.`,
    };
  }

  try {
    const duration = await getVideoDuration(file);
    if (duration > MAX_VIDEO_DURATION) {
      return {
        valid: false,
        error: `La vidéo dépasse la durée maximale de ${MAX_VIDEO_DURATION} secondes.`,
      };
    }
  } catch (error) {
    return {
      valid: false,
      error: 'Impossible de lire la vidéo. Vérifiez le format du fichier.',
    };
  }

  return { valid: true };
}

export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
    };

    video.src = URL.createObjectURL(file);
  });
}

export async function generateThumbnail(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.currentTime = 2;

    video.onloadeddata = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          window.URL.revokeObjectURL(video.src);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate thumbnail'));
          }
        },
        'image/webp',
        0.8
      );
    };

    video.onerror = () => {
      reject(new Error('Failed to load video for thumbnail'));
    };

    video.src = URL.createObjectURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
