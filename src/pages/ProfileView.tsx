import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/database.types';
import { CardPreview3D } from '../components/CardPreview3D';
import { ProfileSection } from '../components/ProfileSection';
import { SocialButton } from '../components/SocialButton';
import { HeroSection } from '../components/profile-view/HeroSection';
import { ProfileActions } from '../components/profile-view/ProfileActions';
import { TierBanner } from '../components/profile-view/TierBanner';
import { ContactSection } from '../components/profile-view/ContactSection';
import { VideoSection } from '../components/profile-view/VideoSection';
import { SEO } from '../components/SEO';
import { ProfileViewSkeleton } from '../components/Skeleton';
import { downloadVCard } from '../utils/vcard';
import { trackEvent, incrementViewCount } from '../utils/analytics';
import { useToast } from '../contexts/ToastContext';
import { CreditCard, Globe2, Share2 } from 'lucide-react';
import { TierType, SUBSCRIPTION_TO_CARD_TIER, getTierBorderClass } from '../config/tier-config';
import type { SubscriptionTier } from '../config/tier-config';

export function ProfileView() {
  const { username } = useParams<{ username: string }>();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'web' | 'card'>('web');
  const [tier, setTier] = useState<TierType | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .eq('is_active', true)
          .maybeSingle();

        if (error) {
          console.error('Error loading profile:', error);
          setLoading(false);
          return;
        }

        if (data) {
          setProfile(data);

          const subscriptionTier = (data.subscription_tier || 'free') as SubscriptionTier;
          const cardTier = SUBSCRIPTION_TO_CARD_TIER[subscriptionTier];
          setTier(cardTier);

          trackEvent(data.id, 'view').catch(console.warn);
          incrementViewCount(data.id).catch(console.warn);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [username]);

  if (loading) {
    return <ProfileViewSkeleton />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Profil introuvable</h1>
          <p className="text-neutral-600 mb-6">Ce profil n'existe pas ou a été désactivé.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            Retour à l'accueil
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleDownloadContact = async () => {
    downloadVCard(profile);
    trackEvent(profile.id, 'vcard_download').catch(console.warn);
    showToast('Contact enregistré avec succès', 'success');
  };

  const handleShareProfile = async () => {
    const profileUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Profil de ${profile.full_name}`,
          text: profile.tagline || `Découvrez le profil professionnel de ${profile.full_name}`,
          url: profileUrl,
        });
        trackEvent(profile.id, 'profile_share', { method: 'native' }).catch(console.warn);
        showToast('Profil partagé avec succès', 'success');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(profileUrl);
        trackEvent(profile.id, 'profile_share', { method: 'clipboard' }).catch(console.warn);
        showToast('Lien copié dans le presse-papiers', 'success');
      } catch (err) {
        console.error('Error copying:', err);
        showToast('Erreur lors de la copie du lien', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <SEO
        title={`${profile.full_name}${profile.title ? ` - ${profile.title}` : ''} | Obsi`}
        description={profile.tagline || `Découvrez le profil professionnel de ${profile.full_name} sur Obsi`}
        image={profile.profile_photo_url || undefined}
        url={window.location.href}
        type="profile"
      />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="bg-white/95 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold bg-gradient-amber bg-clip-text text-transparent hover:scale-105 transition-transform">
              Obsi
            </Link>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleShareProfile}
                className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-amber-600 font-medium transition-colors rounded-lg hover:bg-amber-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Partager</span>
              </motion.button>
              <Link
                to="/signup"
                className="px-4 py-2 bg-gradient-amber text-white font-medium rounded-lg hover:shadow-lg transition-all"
              >
                Créer mon profil
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-6"
        >
          <div className="flex items-center gap-2 bg-white backdrop-blur-md border border-neutral-200 rounded-full p-1 shadow-sm">
            <motion.button
              onClick={() => setViewMode('web')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === 'web'
                  ? 'bg-gradient-amber text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe2 className="w-4 h-4 inline mr-1.5" />
              Web
            </motion.button>
            <motion.button
              onClick={() => setViewMode('card')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === 'card'
                  ? 'bg-gradient-amber text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CreditCard className="w-4 h-4 inline mr-1.5" />
              Carte
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {viewMode === 'card' ? (
            <motion.div
              key="card-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              <CardPreview3D profile={profile} />
              <div className="mt-8 text-center">
                <ProfileActions onDownloadContact={handleDownloadContact} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="web-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`bg-white border-2 ${getTierBorderClass(tier)} rounded-2xl overflow-hidden shadow-xl`}
            >
              {tier && <TierBanner tier={tier} className="border-b border-neutral-100" />}

              <HeroSection
                fullName={profile.full_name}
                title={profile.title || undefined}
                tagline={profile.tagline || undefined}
                profilePhotoUrl={profile.profile_photo_url || undefined}
                isOnline={profile.is_online || true}
                locationCity={profile.location_city || undefined}
                timezone={profile.timezone || undefined}
                showLocalTime={profile.show_local_time || false}
              />

              <div className="px-6 py-8 space-y-8">
                {profile.mission_statement && (
                  <ProfileSection delay={0.1}>
                    <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-neutral-900 mb-3">Ma Mission</h3>
                      <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                        {profile.mission_statement}
                      </p>
                    </div>
                  </ProfileSection>
                )}

                <VideoSection profile={profile} tier={tier} />

                <ContactSection
                  profile={profile}
                  tier={tier}
                  onLinkClick={(type) => trackEvent(profile.id, 'link_click', { type }).catch(console.warn)}
                />

                {profile.social_links && Object.keys(profile.social_links).length > 0 && (
                  <ProfileSection delay={0.5}>
                    <h3 className="text-center text-sm font-semibold text-amber-600 uppercase tracking-wider mb-4">
                      Me contacter
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                      {profile.social_links.linkedin && (
                        <SocialButton
                          platform="linkedin"
                          url={profile.social_links.linkedin}
                          label="Connect"
                        />
                      )}
                      {profile.social_links.twitter && (
                        <SocialButton
                          platform="twitter"
                          url={profile.social_links.twitter}
                          label="Follow"
                        />
                      )}
                      {profile.social_links.instagram && (
                        <SocialButton
                          platform="instagram"
                          url={profile.social_links.instagram}
                          label="Follow"
                        />
                      )}
                    </div>
                  </ProfileSection>
                )}

                <ProfileSection delay={0.6}>
                  <ProfileActions onDownloadContact={handleDownloadContact} />
                </ProfileSection>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 px-4"
        >
          <Link
            to="/"
            className="text-sm text-neutral-500 hover:text-amber-600 transition-colors inline-block"
          >
            Créez votre propre profil professionnel numérique avec Obsi
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
