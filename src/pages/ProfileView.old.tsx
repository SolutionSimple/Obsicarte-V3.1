import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/database.types';
import type { CustomField } from '../types/custom-fields.types';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { CardPreview3D } from '../components/CardPreview3D';
import { CustomFieldDisplay } from '../components/CustomFieldDisplay';
import { downloadVCard } from '../utils/vcard';
import { trackEvent, incrementViewCount } from '../utils/analytics';
import { fadeInUp } from '../utils/animations';
import { Mail, Phone, Globe, Download, ExternalLink, Linkedin, Twitter, Instagram, Facebook, ArrowLeft, CreditCard, Globe2 } from 'lucide-react';

export function ProfileView() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'web' | 'card'>('web');

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
          console.error('Erreur lors du chargement du profil:', error);
          setLoading(false);
          return;
        }

        if (data) {
          setProfile(data);

          trackEvent(data.id, 'view').catch(err =>
            console.warn('Erreur analytics (trackEvent):', err)
          );
          incrementViewCount(data.id).catch(err =>
            console.warn('Erreur analytics (incrementViewCount):', err)
          );
        }
      } catch (err) {
        console.error('Erreur inattendue:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
        <motion.div
          className="h-12 w-12 border-4 border-gold-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Profil introuvable</h1>
          <p className="text-warmGray-300">Ce profil n'existe pas ou a été désactivé.</p>
        </motion.div>
      </div>
    );
  }

  const handleDownloadContact = async () => {
    downloadVCard(profile);
    trackEvent(profile.id, 'vcard_download').catch(err =>
      console.warn('Erreur analytics (vcard_download):', err)
    );
  };

  const socialIcons: Record<string, any> = {
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
    facebook: Facebook,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      <div className="max-w-4xl mx-auto px-3 py-8 sm:px-4 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 sm:gap-2 text-warmGray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Retour</span>
          </button>

          <motion.div
            className="flex items-center gap-1.5 bg-navy-800/50 backdrop-blur-md border border-gold-500/20 rounded-full p-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              onClick={() => setViewMode('web')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                viewMode === 'web'
                  ? 'bg-gradient-gold text-navy-900 shadow-gold-glow'
                  : 'text-warmGray-300 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1 sm:mr-1.5" />
              <span className="hidden xs:inline">Vue </span>Web
            </motion.button>
            <motion.button
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                viewMode === 'card'
                  ? 'bg-gradient-gold text-navy-900 shadow-gold-glow'
                  : 'text-warmGray-300 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1 sm:mr-1.5" />
              <span className="hidden xs:inline">Vue </span>Carte
            </motion.button>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {viewMode === 'card' ? (
            <motion.div
              key="card-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <CardPreview3D profile={profile} />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 sm:mt-8 text-center px-4"
              >
                <Button size="lg" onClick={handleDownloadContact} variant="secondary" className="w-full sm:w-auto">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-sm sm:text-base">Enregistrer dans les contacts</span>
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="web-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="glassmorphism" className="bg-navy-800/50 border-gold-500/20 overflow-hidden">
                {profile.profile_photo_url && (
                  <div className="h-32 sm:h-48 bg-gradient-institutional relative">
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: 'reverse',
                      }}
                      style={{
                        backgroundImage:
                          'radial-gradient(circle, rgba(200, 155, 60, 0.2) 0%, transparent 50%)',
                        backgroundSize: '100% 100%',
                      }}
                    />
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      src={profile.profile_photo_url}
                      alt={profile.full_name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gold-400 absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 object-cover shadow-gold-glow"
                    />
                  </div>
                )}

                <div className={profile.profile_photo_url ? 'pt-16 sm:pt-20 px-4 sm:px-8 pb-6 sm:pb-8' : 'p-4 sm:p-8'}>
                  <div className="text-center mb-6 sm:mb-8">
                    {!profile.profile_photo_url && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-gold rounded-full flex items-center justify-center text-navy-900 text-3xl sm:text-4xl font-bold mx-auto mb-4 shadow-gold-glow"
                      >
                        {profile.full_name.charAt(0)}
                      </motion.div>
                    )}
                    <motion.h1
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                      className="text-3xl sm:text-4xl font-bold text-white mb-2"
                    >
                      {profile.full_name}
                    </motion.h1>
                    {profile.title && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg sm:text-xl text-gold-300"
                      >
                        {profile.title}
                      </motion.p>
                    )}
                  </div>

                  {profile.bio && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center text-warmGray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base"
                    >
                      {profile.bio}
                    </motion.p>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-md mx-auto mb-6 sm:mb-8"
                  >
                    <Button
                      fullWidth
                      size="lg"
                      variant="secondary"
                      onClick={handleDownloadContact}
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="text-sm sm:text-base">Enregistrer dans les contacts</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto mb-6 sm:mb-8"
                  >
                    {profile.email && (
                      <motion.a
                        whileHover={{ scale: 1.02, y: -2 }}
                        href={`mailto:${profile.email}`}
                        className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-navy-700/50 hover:bg-navy-700 rounded-lg transition-colors border border-gold-500/20"
                        onClick={() => trackEvent(profile.id, 'link_click', { type: 'email', value: profile.email }).catch(err =>
                          console.warn('Erreur analytics (link_click):', err)
                        )}
                      >
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-warmGray-400">Email</p>
                          <p className="text-white font-medium text-sm sm:text-base truncate">{profile.email}</p>
                        </div>
                      </motion.a>
                    )}

                    {profile.phone && (
                      <motion.a
                        whileHover={{ scale: 1.02, y: -2 }}
                        href={`tel:${profile.phone}`}
                        className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-navy-700/50 hover:bg-navy-700 rounded-lg transition-colors border border-gold-500/20"
                        onClick={() => trackEvent(profile.id, 'link_click', { type: 'phone', value: profile.phone }).catch(err =>
                          console.warn('Erreur analytics (link_click):', err)
                        )}
                      >
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-warmGray-400">Téléphone</p>
                          <p className="text-white font-medium text-sm sm:text-base truncate">{profile.phone}</p>
                        </div>
                      </motion.a>
                    )}

                    {profile.website && (
                      <motion.a
                        whileHover={{ scale: 1.02, y: -2 }}
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-navy-700/50 hover:bg-navy-700 rounded-lg transition-colors sm:col-span-2 border border-gold-500/20"
                        onClick={() => trackEvent(profile.id, 'link_click', { type: 'website' }).catch(err =>
                          console.warn('Erreur analytics (link_click):', err)
                        )}
                      >
                        <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-warmGray-400">Site web</p>
                          <p className="text-white font-medium text-sm sm:text-base truncate">{profile.website}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-warmGray-400" />
                      </motion.a>
                    )}
                  </motion.div>

                  {profile.social_links && Object.keys(profile.social_links).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h3 className="text-center text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">
                        Me contacter
                      </h3>
                      <div className="flex justify-center gap-4">
                        {Object.entries(profile.social_links).map(([platform, url], index) => {
                          const Icon = socialIcons[platform];
                          if (!Icon || !url) return null;

                          return (
                            <motion.a
                              key={platform}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.7 + index * 0.1 }}
                              whileHover={{ scale: 1.15, rotate: 5 }}
                              href={url as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-gold rounded-full flex items-center justify-center transition-all shadow-gold-glow"
                              onClick={() => trackEvent(profile.id, 'link_click', { type: platform }).catch(err =>
                                console.warn('Erreur analytics (link_click):', err)
                              )}
                            >
                              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-navy-900" />
                            </motion.a>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {profile.custom_fields && profile.custom_fields.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="mt-6 sm:mt-8"
                    >
                      {profile.sector === 'politique' ? (
                        <div className="space-y-6 sm:space-y-8">
                          {profile.custom_fields
                            .filter((field: CustomField) => field.isPublic && field.value)
                            .sort((a: CustomField, b: CustomField) => a.order - b.order)
                            .map((field: CustomField) => {
                              if (field.id === 'pitch') {
                                return (
                                  <div key={field.id} className="bg-gradient-to-r from-navy-700 to-navy-800 border-l-4 border-gold-500 rounded-lg p-4 sm:p-6 shadow-premium-md">
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                                      {field.label}
                                    </h3>
                                    <p className="text-base sm:text-lg text-warmGray-300 leading-relaxed">
                                      {field.value}
                                    </p>
                                  </div>
                                );
                              }

                              if (field.id === 'programme') {
                                return (
                                  <div key={field.id} className="bg-navy-700/50 border border-gold-500/20 rounded-lg p-4 sm:p-6">
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                                      {field.label}
                                    </h3>
                                    <div className="prose prose-sm max-w-none">
                                      <p className="text-warmGray-300 whitespace-pre-wrap leading-relaxed">
                                        {field.value}
                                      </p>
                                    </div>
                                  </div>
                                );
                              }

                              return <CustomFieldDisplay key={field.id} field={field} />;
                            })}
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-center text-xs sm:text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4 sm:mb-6">
                            Informations complémentaires
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
                            {profile.custom_fields
                              .filter((field: CustomField) => field.isPublic && field.value)
                              .sort((a: CustomField, b: CustomField) => a.order - b.order)
                              .map((field: CustomField) => (
                                <CustomFieldDisplay key={field.id} field={field} />
                              ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {profile.video_url && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="mt-6 sm:mt-8"
                    >
                      <h3 className="text-center text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">
                        Voir ma présentation
                      </h3>
                      <div className="aspect-video rounded-lg overflow-hidden border-2 border-gold-500/30">
                        <iframe
                          src={profile.video_url}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6 sm:mt-8 px-4"
        >
          <a
            href="/"
            className="text-xs sm:text-sm text-warmGray-400 hover:text-gold-400 transition-colors inline-block"
          >
            Créez votre propre profil professionnel numérique
          </a>
        </motion.div>
      </div>
    </div>
  );
}
