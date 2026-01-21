import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Check, Loader } from 'lucide-react';
import { Button } from './Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePhotoUploaderProps {
  currentPhotoUrl?: string;
  onPhotoUploaded: (url: string) => void;
}

export function ProfilePhotoUploader({ currentPhotoUrl, onPhotoUploaded }: ProfilePhotoUploaderProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl || null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (stream && videoRef.current && showCamera) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, showCamera]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1280 } }
      });
      setStream(mediaStream);
      setShowCamera(true);
    } catch (err) {
      setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = 400;
    canvas.height = 400;

    const aspectRatio = video.videoWidth / video.videoHeight;
    let sx = 0, sy = 0, sWidth = video.videoWidth, sHeight = video.videoHeight;

    if (aspectRatio > 1) {
      sWidth = video.videoHeight;
      sx = (video.videoWidth - sWidth) / 2;
    } else {
      sHeight = video.videoWidth;
      sy = (video.videoHeight - sHeight) / 2;
    }

    context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, 400, 400);

    canvas.toBlob(async (blob) => {
      if (blob) {
        await uploadPhoto(blob, 'selfie.jpg');
      }
    }, 'image/jpeg', 0.9);

    stopCamera();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Format non supporté. Utilisez JPEG, PNG ou WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Fichier trop volumineux. Maximum 5MB.');
      return;
    }

    const processedBlob = await processImage(file, file.type);
    if (processedBlob) {
      await uploadPhoto(processedBlob, file.name, file.type);
    }
  };

  const processImage = async (file: File, mimeType: string): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }

          const size = 400;
          canvas.width = size;
          canvas.height = size;

          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;

          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

          const outputMimeType = mimeType === 'image/webp' ? 'image/webp' : 'image/jpeg';
          const quality = mimeType === 'image/webp' ? 0.9 : 0.85;

          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            outputMimeType,
            quality
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadPhoto = async (blob: Blob, filename: string, mimeType: string = 'image/jpeg') => {
    if (!user) {
      setError('Vous devez être connecté.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      let fileExt = filename.split('.').pop() || 'jpg';
      if (mimeType === 'image/webp' && fileExt !== 'webp') {
        fileExt = 'webp';
      }

      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, blob, {
          contentType: mimeType === 'image/webp' ? 'image/webp' : 'image/jpeg',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      setPreview(urlData.publicUrl);
      onPhotoUploaded(urlData.publicUrl);

    } catch (err: any) {
      setError(err.message || 'Erreur lors du téléchargement.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-warmGray-700">
        Photo de profil
      </label>

      {preview && (
        <div className="flex justify-center mb-4">
          <div className="relative">
            <img
              src={preview}
              alt="Aperçu"
              className="w-32 h-32 rounded-full object-cover border-4 border-gold-400 shadow-lg"
            />
            <button
              onClick={() => {
                setPreview(null);
                onPhotoUploaded('');
              }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {!showCamera && (
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            fullWidth
          >
            {uploading ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Importer
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={startCamera}
            disabled={uploading}
            fullWidth
          >
            <Camera className="w-4 h-4 mr-2" />
            Selfie
          </Button>
        </div>
      )}

      {showCamera && (
        <div className="space-y-3">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 border-2 border-gold-400 rounded-lg pointer-events-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={stopCamera}
              fullWidth
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={capturePhoto}
              fullWidth
            >
              <Check className="w-4 h-4 mr-2" />
              Capturer
            </Button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}

      <p className="text-xs text-warmGray-500">
        Formats acceptés : JPEG, PNG, WebP. Taille max : 5MB. L'image sera automatiquement recadrée en cercle.
      </p>
    </div>
  );
}
