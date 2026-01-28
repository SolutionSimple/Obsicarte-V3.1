import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Breadcrumb } from '../components/Breadcrumb';
import { ContextualLink } from '../components/ContextualLink';
import { CustomFieldsManager } from '../components/CustomFieldsManager';
import { ProfilePhotoUploader } from '../components/ProfilePhotoUploader';
import { VideoRecorder } from '../components/VideoRecorder';
import { CitySelector } from '../components/CitySelector';
import type { CustomField, ProfileTemplate } from '../types/custom-fields.types';
import { ArrowLeft, Save, Eye, BarChart3, Lightbulb } from 'lucide-react';

export function ProfileEditor() {
  const { profile, updateProfile } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [templateFields, setTemplateFields] = useState<CustomField[]>([]);

  const [formData, setFormData] = useState({
    full_name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    website: '',
    profile_photo_url: '',
    video_url: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    facebook: '',
    tagline: '',
    mission_statement: '',
    location_city: '',
    location_country: '',
    timezone: '',
    show_local_time: false,
    is_online: true,
    theme_color: '#C89B3C',
    video_thumbnail_url: '',
    video_duration: 0,
    video_file_size: 0,
    total_video_storage: 0,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        email: profile.email || '',
        phone: profile.phone || '',
        website: profile.website || '',
        profile_photo_url: profile.profile_photo_url || '',
        video_url: profile.video_url || '',
        linkedin: profile.social_links?.linkedin || '',
        twitter: profile.social_links?.twitter || '',
        instagram: profile.social_links?.instagram || '',
        facebook: profile.social_links?.facebook || '',
        tagline: profile.tagline || '',
        mission_statement: profile.mission_statement || '',
        location_city: profile.location_city || '',
        location_country: profile.location_country || '',
        timezone: profile.timezone || 'Europe/Paris',
        show_local_time: profile.show_local_time || false,
        is_online: profile.is_online !== undefined ? profile.is_online : true,
        theme_color: profile.theme_color || '#C89B3C',
        video_thumbnail_url: profile.video_thumbnail_url || '',
        video_duration: profile.video_duration || 0,
        video_file_size: profile.video_file_size || 0,
        total_video_storage: profile.total_video_storage || 0,
      });
      setCustomFields(profile.custom_fields || []);

      async function fetchTemplateFields() {
        try {
          const { data } = await supabase
            .from('profile_templates')
            .select('default_fields')
            .eq('name', profile.sector)
            .maybeSingle();

          if (data?.default_fields) {
            setTemplateFields(data.default_fields);
          }
        } catch (err) {
          console.error('Error fetching template fields:', err);
        }
      }

      if (profile.sector) {
        fetchTemplateFields();
      }
    }
  }, [profile]);

  useEffect(() => {
    if (!saving && formData && profile) {
      const timer = setTimeout(async () => {
        const social_links = {
          ...(formData.linkedin && { linkedin: formData.linkedin }),
          ...(formData.twitter && { twitter: formData.twitter }),
          ...(formData.instagram && { instagram: formData.instagram }),
          ...(formData.facebook && { facebook: formData.facebook }),
        };

        await updateProfile({
          full_name: formData.full_name,
          title: formData.title,
          bio: formData.bio,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          profile_photo_url: formData.profile_photo_url,
          video_url: formData.video_url,
          social_links,
          custom_fields: customFields,
          tagline: formData.tagline,
          mission_statement: formData.mission_statement,
          location_city: formData.location_city,
          location_country: formData.location_country,
          timezone: formData.timezone,
          show_local_time: formData.show_local_time,
          is_online: formData.is_online,
          theme_color: formData.theme_color,
          video_thumbnail_url: formData.video_thumbnail_url,
          video_duration: formData.video_duration,
          video_file_size: formData.video_file_size,
          total_video_storage: formData.total_video_storage,
        });

        setSaveMessage('Enregistré');
        setTimeout(() => setSaveMessage(''), 2000);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [formData, customFields]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaveMessage('Enregistrement...');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-beige-200 via-warmGray-200 to-beige-200 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-gold-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige-200 via-warmGray-200 to-beige-200">
      <nav className="bg-white border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-warmGray-700 hover:text-gold-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour au tableau de bord
            </button>
            {saveMessage && (
              <span className="text-sm text-green-600 font-medium">{saveMessage}</span>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: 'Tableau de bord', href: '/dashboard' },
            { label: 'Modifier le profil' }
          ]}
          className="mb-6"
        />

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ContextualLink
            to={`/${profile.username}`}
            label="Prévisualiser votre carte"
            description="Voir comment les autres verront votre profil"
            icon={<Eye className="w-5 h-5" />}
            variant="card"
          />
          <ContextualLink
            to="/analytics"
            label="Voir mes statistiques"
            description="Suivre les performances de votre carte"
            icon={<BarChart3 className="w-5 h-5" />}
            variant="card"
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-warmGray-900 mb-6">Éditer le profil</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-warmGray-900 mb-4">Informations de base</h3>
                <div className="space-y-4">
                  <Input
                    label="Nom complet"
                    value={formData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    required
                  />

                  <Input
                    label="Titre / Profession"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="ex: Responsable Marketing"
                  />

                  <div>
                    <label className="block text-sm font-medium text-warmGray-700 mb-1">
                      Biographie
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-warmGray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      placeholder="Parlez de vous..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-warmGray-900 mb-4">Coordonnées</h3>
                <div className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />

                  <Input
                    label="Téléphone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />

                  <Input
                    label="Site web"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="https://votresite.com"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-warmGray-900 mb-4">Médias</h3>
                <div className="space-y-4">
                  <ProfilePhotoUploader
                    currentPhotoUrl={formData.profile_photo_url}
                    onPhotoUploaded={(url) => handleChange('profile_photo_url', url)}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-warmGray-900 mb-4">Présentation Étendue</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-warmGray-700 mb-1">
                      Phrase d'accroche
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => handleChange('tagline', e.target.value)}
                      maxLength={100}
                      placeholder="Une phrase courte et percutante..."
                      className="w-full px-4 py-2 border border-warmGray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                    <div className="text-xs text-warmGray-500 mt-1">
                      {formData.tagline.length}/100 caractères
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-warmGray-700 mb-1">
                      Mission / Pitch
                    </label>
                    <textarea
                      value={formData.mission_statement}
                      onChange={(e) => handleChange('mission_statement', e.target.value)}
                      maxLength={500}
                      rows={6}
                      className="w-full px-4 py-2 border border-warmGray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      placeholder="Décrivez votre mission, vos valeurs, ce qui vous anime..."
                    />
                    <div className="text-xs text-warmGray-500 mt-1">
                      {formData.mission_statement.length}/500 caractères
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-warmGray-900 mb-4">Localisation</h3>
                <div className="space-y-4">
                  <CitySelector
                    value={formData.location_city}
                    timezone={formData.timezone}
                    country={formData.location_country}
                    onChange={(city, timezone, country) => {
                      setFormData(prev => ({
                        ...prev,
                        location_city: city,
                        timezone,
                        location_country: country,
                      }));
                      setSaveMessage('Enregistrement...');
                    }}
                  />

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.show_local_time}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, show_local_time: e.target.checked }));
                        setSaveMessage('Enregistrement...');
                      }}
                      className="w-4 h-4 text-gold-600 border-warmGray-300 rounded focus:ring-gold-500"
                    />
                    <span className="text-sm text-warmGray-700">
                      Afficher mon heure locale sur le profil
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <VideoRecorder
                  userId={user?.id || ''}
                  currentVideoUrl={formData.video_url}
                  currentThumbnailUrl={formData.video_thumbnail_url}
                  currentDuration={formData.video_duration}
                  currentFileSize={formData.video_file_size}
                  onUploadComplete={(data) => {
                    setFormData(prev => ({
                      ...prev,
                      video_url: data.videoUrl,
                      video_thumbnail_url: data.thumbnailUrl,
                      video_duration: data.duration,
                      video_file_size: data.fileSize,
                      total_video_storage: prev.total_video_storage + data.fileSize,
                    }));
                    setSaveMessage('Enregistrement...');
                  }}
                  onDelete={() => {
                    setFormData(prev => ({
                      ...prev,
                      video_url: '',
                      video_thumbnail_url: '',
                      video_duration: 0,
                      total_video_storage: prev.total_video_storage - prev.video_file_size,
                      video_file_size: 0,
                    }));
                    setSaveMessage('Enregistrement...');
                  }}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-warmGray-900 mb-4">Options d'affichage</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_online}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, is_online: e.target.checked }));
                        setSaveMessage('Enregistrement...');
                      }}
                      className="w-4 h-4 text-gold-600 border-warmGray-300 rounded focus:ring-gold-500"
                    />
                    <span className="text-sm text-warmGray-700">
                      Afficher comme en ligne (badge vert sur la photo de profil)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-warmGray-900 mb-4">Réseaux sociaux</h3>
                <div className="space-y-4">
                  <Input
                    label="LinkedIn"
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />

                  <Input
                    label="Twitter"
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => handleChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/username"
                  />

                  <Input
                    label="Instagram"
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => handleChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/username"
                  />

                  <Input
                    label="Facebook"
                    type="url"
                    value={formData.facebook}
                    onChange={(e) => handleChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/username"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-warmGray-200">
                <CustomFieldsManager
                  fields={customFields}
                  onChange={setCustomFields}
                  templateFields={templateFields}
                />
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-warmGray-900 mb-4">Aperçu en direct</h2>
              <p className="text-sm text-warmGray-500 mb-6">Voici à quoi ressemble votre profil pour les visiteurs</p>

              <div className="bg-gradient-to-br from-gold-50 to-warmGray-50 rounded-lg p-6 border border-gold-500/20">
                {formData.profile_photo_url ? (
                  <div className="flex justify-center mb-4">
                    <img
                      src={formData.profile_photo_url}
                      alt={formData.full_name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 bg-gradient-gold rounded-full flex items-center justify-center text-black text-3xl font-bold">
                      {formData.full_name.charAt(0) || '?'}
                    </div>
                  </div>
                )}

                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-warmGray-900">{formData.full_name || 'Votre nom'}</h3>
                  {formData.title && <p className="text-lg text-warmGray-600">{formData.title}</p>}
                </div>

                {formData.bio && (
                  <p className="text-center text-warmGray-700 mb-4 text-sm leading-relaxed">
                    {formData.bio}
                  </p>
                )}

                <div className="space-y-2">
                  {formData.email && (
                    <div className="bg-white rounded-lg p-3 text-sm">
                      <span className="text-warmGray-500">Email: </span>
                      <span className="text-warmGray-900">{formData.email}</span>
                    </div>
                  )}
                  {formData.phone && (
                    <div className="bg-white rounded-lg p-3 text-sm">
                      <span className="text-warmGray-500">Téléphone : </span>
                      <span className="text-warmGray-900">{formData.phone}</span>
                    </div>
                  )}
                  {formData.website && (
                    <div className="bg-white rounded-lg p-3 text-sm">
                      <span className="text-warmGray-500">Site web : </span>
                      <span className="text-gold-600">{formData.website}</span>
                    </div>
                  )}
                </div>

                {(formData.linkedin || formData.twitter || formData.instagram || formData.facebook) && (
                  <div className="mt-4 pt-4 border-t border-warmGray-200">
                    <p className="text-xs text-center text-warmGray-500 mb-2">RÉSEAUX SOCIAUX</p>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {formData.linkedin && <span className="px-2 py-1 bg-gold-100 text-gold-800 rounded text-xs">LinkedIn</span>}
                      {formData.twitter && <span className="px-2 py-1 bg-gold-100 text-gold-800 rounded text-xs">Twitter</span>}
                      {formData.instagram && <span className="px-2 py-1 bg-gold-100 text-gold-800 rounded text-xs">Instagram</span>}
                      {formData.facebook && <span className="px-2 py-1 bg-gold-100 text-gold-800 rounded text-xs">Facebook</span>}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Button
                  fullWidth
                  onClick={() => navigate(`/${profile.username}`)}
                  variant="black-gold"
                >
                  Voir le profil complet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
