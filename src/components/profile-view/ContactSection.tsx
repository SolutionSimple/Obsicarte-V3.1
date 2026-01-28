import { Mail, Phone, Globe, MapPin } from 'lucide-react';
import { ContactCard } from '../ContactCard';
import { ProfileSection } from '../ProfileSection';
import type { Profile } from '../../types/database.types';
import { TierType } from '../../config/tier-config';

interface ContactSectionProps {
  profile: Profile;
  tier: TierType | null;
  onLinkClick: (type: string) => void;
}

export function ContactSection({ profile, tier, onLinkClick }: ContactSectionProps) {
  const showLocation = tier === 'emeraude' && profile.location_city;

  return (
    <>
      {showLocation && (
        <ProfileSection delay={0.2}>
          <div className="grid md:grid-cols-2 gap-4">
            <ContactCard
              icon={MapPin}
              label="Localisation"
              value={`${profile.location_city}, ${profile.location_country || 'France'}`}
            />
            {profile.email && (
              <ContactCard
                icon={Mail}
                label="Email"
                value={profile.email}
                href={`mailto:${profile.email}`}
                onClick={() => onLinkClick('email')}
              />
            )}
          </div>
        </ProfileSection>
      )}

      <ProfileSection delay={showLocation ? 0.4 : 0.2}>
        <div className="grid md:grid-cols-2 gap-4">
          {profile.phone && (
            <ContactCard
              icon={Phone}
              label="Téléphone"
              value={profile.phone}
              href={`tel:${profile.phone}`}
              onClick={() => onLinkClick('phone')}
            />
          )}
          {profile.website && (
            <ContactCard
              icon={Globe}
              label="Site web"
              value={profile.website}
              href={profile.website}
              onClick={() => onLinkClick('website')}
            />
          )}
          {!showLocation && profile.email && (
            <ContactCard
              icon={Mail}
              label="Email"
              value={profile.email}
              href={`mailto:${profile.email}`}
              onClick={() => onLinkClick('email')}
            />
          )}
        </div>
      </ProfileSection>
    </>
  );
}
