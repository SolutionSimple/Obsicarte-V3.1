import { VideoPlayer } from '../VideoPlayer';
import { ProfileSection } from '../ProfileSection';
import type { Profile } from '../../types/database.types';
import { TierType } from '../../config/tier-config';

interface VideoSectionProps {
  profile: Profile;
  tier: TierType | null;
}

export function VideoSection({ profile, tier }: VideoSectionProps) {
  if (tier === 'roc' || !profile.video_url || !profile.video_thumbnail_url) {
    return null;
  }

  return (
    <ProfileSection delay={0.3}>
      <VideoPlayer
        videoUrl={profile.video_url}
        thumbnailUrl={profile.video_thumbnail_url}
        duration={profile.video_duration || 0}
      />
    </ProfileSection>
  );
}
