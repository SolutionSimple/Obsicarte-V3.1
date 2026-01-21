import { useState } from 'react';
import { Play } from 'lucide-react';
import { formatDuration } from '../utils/video';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
}

export function VideoPlayer({ videoUrl, thumbnailUrl, duration }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full h-full"
          onEnded={() => setPlaying(false)}
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden group"
      style={{
        backgroundImage: `url(${thumbnailUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />

      <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 rounded-full text-white text-sm font-medium">
        VIDEO INTRO
      </div>

      <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 rounded-full text-white text-sm font-medium">
        {formatDuration(duration)}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
          <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
        </div>
      </div>
    </button>
  );
}
