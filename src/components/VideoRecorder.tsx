import { useRef, useState, useEffect, useCallback } from 'react';
import { X, AlertCircle, Video, Camera, StopCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { useVideoRecording } from '../hooks/useVideoRecording';
import { formatFileSize, formatDuration, MAX_VIDEO_DURATION } from '../utils/video';

interface VideoRecorderProps {
  userId: string;
  currentVideoUrl?: string;
  currentThumbnailUrl?: string;
  currentDuration?: number;
  currentFileSize?: number;
  onUploadComplete: (data: {
    videoUrl: string;
    thumbnailUrl: string;
    duration: number;
    fileSize: number;
  }) => void;
  onDelete: () => void;
}

export function VideoRecorder({
  userId,
  currentVideoUrl,
  currentThumbnailUrl,
  currentDuration,
  currentFileSize,
  onUploadComplete,
  onDelete,
}: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const {
    uploading,
    progress,
    error,
    uploadRecording,
    deleteVideo
  } = useVideoRecording(userId);

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

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= MAX_VIDEO_DURATION) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording, stopRecording]);

  const handleDelete = async () => {
    if (currentVideoUrl && currentThumbnailUrl) {
      const success = await deleteVideo(currentVideoUrl, currentThumbnailUrl);
      if (success) {
        setPreviewUrl(null);
        onDelete();
      }
    }
  };

  const startCamera = async (useFacingMode: 'user' | 'environment' = facingMode) => {
    console.log('startCamera called');
    try {
      setCameraError(null);

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Votre navigateur ne supporte pas l\'accès à la caméra. Veuillez utiliser un navigateur moderne.');
      }

      console.log('Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: useFacingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: true
      });
      console.log('Camera access granted');
      setStream(mediaStream);
      setShowCamera(true);
      setFacingMode(useFacingMode);
    } catch (err: any) {
      console.error('Camera error:', err);
      let errorMessage = 'Impossible d\'accéder à la caméra.';

      if (err.name === 'NotAllowedError') {
        errorMessage = 'Accès à la caméra refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'Aucune caméra trouvée sur cet appareil.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'La caméra est déjà utilisée par une autre application.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Impossible d\'utiliser les paramètres demandés pour la caméra.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setCameraError(errorMessage);
      setShowCamera(true);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setIsRecording(false);
    setCameraError(null);
  };

  const switchCamera = async () => {
    if (isRecording) return;
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    await startCamera(newFacingMode);
  };

  const getSupportedMimeType = (): { mimeType: string; extension: string } => {
    const types = [
      { mimeType: 'video/webm;codecs=vp9', extension: 'webm' },
      { mimeType: 'video/webm;codecs=vp8', extension: 'webm' },
      { mimeType: 'video/webm;codecs=h264', extension: 'webm' },
      { mimeType: 'video/webm', extension: 'webm' },
      { mimeType: 'video/mp4;codecs=h264', extension: 'mp4' },
      { mimeType: 'video/mp4', extension: 'mp4' },
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type.mimeType)) {
        return type;
      }
    }

    return { mimeType: '', extension: 'webm' };
  };

  const startRecording = () => {
    if (!stream) return;

    try {
      const { mimeType } = getSupportedMimeType();

      if (!mimeType) {
        setCameraError('Votre navigateur ne supporte pas l\'enregistrement vidéo. Veuillez utiliser un navigateur moderne comme Chrome, Firefox ou Safari.');
        return;
      }

      chunksRef.current = [];

      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || 'video/webm' });

        const result = await uploadRecording(blob);
        if (result) {
          setPreviewUrl(result.videoUrl);
          onUploadComplete(result);
        }
        stopCamera();
      };

      mediaRecorder.onerror = (event: Event) => {
        console.error('MediaRecorder error:', event);
        setCameraError('Une erreur s\'est produite lors de l\'enregistrement. Veuillez réessayer.');
        setIsRecording(false);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setCameraError(null);
    } catch (err: any) {
      console.error('Recording error:', err);
      setCameraError(`Erreur d'enregistrement: ${err.message || 'Impossible de démarrer l\'enregistrement'}`);
      setIsRecording(false);
    }
  };

  const hasVideo = currentVideoUrl || previewUrl;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Vidéo de présentation</h3>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-start space-x-2 text-sm text-gray-400 mb-4">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p>Enregistrez une vidéo de présentation directement depuis votre caméra</p>
            <p>Durée maximale: {MAX_VIDEO_DURATION} secondes</p>
          </div>
        </div>

        {!hasVideo && !showCamera ? (
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                console.log('Button clicked');
                startCamera();
              }}
              disabled={uploading}
              fullWidth
            >
              <Camera className="w-4 h-4 mr-2" />
              Enregistrer une vidéo
            </Button>
          </div>
        ) : showCamera ? (
          <div className="space-y-3">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={!isRecording}
                className="w-full h-full object-cover"
              />

              {!isRecording && (
                <div className="absolute top-4 left-4 flex items-center space-x-2 px-3 py-2 bg-green-600 rounded-full">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-sm font-medium">Caméra prête</span>
                </div>
              )}

              {isRecording && (
                <div className="absolute top-4 left-4 right-4 flex flex-col items-center space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-red-600 rounded-full">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    <span className="text-white text-sm font-medium">
                      {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')} / {Math.floor(MAX_VIDEO_DURATION / 60)}:{(MAX_VIDEO_DURATION % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <div className="w-full max-w-xs bg-gray-800/80 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                    <div
                      className="bg-red-500 h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(recordingDuration / MAX_VIDEO_DURATION) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {recordingDuration >= MAX_VIDEO_DURATION && (
                <div className="absolute top-4 right-4 px-3 py-2 bg-yellow-600 rounded-lg">
                  <span className="text-white text-sm font-medium">Limite atteinte</span>
                </div>
              )}

              {!isRecording && (
                <button
                  onClick={switchCamera}
                  className="absolute bottom-4 right-4 p-3 bg-gray-900/80 hover:bg-gray-800 text-white rounded-full transition-colors backdrop-blur-sm"
                  title={facingMode === 'user' ? 'Basculer vers la caméra arrière' : 'Basculer vers la caméra frontale'}
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}
            </div>

            {cameraError && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{cameraError}</p>
              </div>
            )}

            <div className="space-y-2">
              {!isRecording ? (
                <>
                  <button
                    type="button"
                    onClick={startRecording}
                    className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-lg flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  >
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-red-600 rounded-full" />
                    </div>
                    <span>Démarrer l'enregistrement</span>
                  </button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={stopCamera}
                    fullWidth
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="w-full py-4 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold text-lg flex items-center justify-center space-x-3 transition-all shadow-lg"
                >
                  <StopCircle className="w-6 h-6" />
                  <span>Arrêter l'enregistrement</span>
                </button>
              )}
            </div>
          </div>
        ) : hasVideo ? (
          <div className="space-y-4">
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              <video
                src={previewUrl || currentVideoUrl}
                controls
                className="w-full h-full"
                poster={currentThumbnailUrl}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4 text-gray-400">
                <span className="flex items-center space-x-1">
                  <Video className="w-4 h-4" />
                  <span>{formatDuration(currentDuration || 0)}</span>
                </span>
                <span>{formatFileSize(currentFileSize || 0)}</span>
              </div>
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        ) : null}

        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Upload en cours...</span>
            <span className="text-sm text-yellow-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-yellow-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
