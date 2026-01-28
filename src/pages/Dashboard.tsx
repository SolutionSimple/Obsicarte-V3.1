import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfile } from '../hooks/useProfile';
import { useAnalytics } from '../hooks/useAnalytics';
import { useTierPermissions } from '../hooks/useTierPermissions';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { ContextualLink } from '../components/ContextualLink';
import { CardPreview3D } from '../components/CardPreview3D';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { SubscriptionCard } from '../components/dashboard/SubscriptionCard';
import { UpgradePrompt } from '../components/UpgradePrompt';
import QRCode from 'react-qr-code';
import { Edit, Download, Eye, Share2, LogOut, BarChart3, Nfc, ChevronDown, ChevronUp, TrendingUp, Users, MousePointerClick, Lightbulb, Sparkles } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';

export function Dashboard() {
  const { profile, loading } = useProfile();
  const { analytics } = useAnalytics(profile?.id);
  const { signOut } = useAuth();
  const { canUpgrade } = useTierPermissions();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !profile) {
      navigate('/onboarding');
    }
  }, [profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <motion.div
          className="h-12 w-12 border-4 border-amber-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (!profile) return null;

  const profileUrl = `${window.location.origin}/${profile.username}`;

  const handleDownloadQR = (size: 'standard' | 'high' = 'standard') => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    const qrSize = size === 'high' ? 1000 : 400;

    img.onload = () => {
      canvas.width = qrSize;
      canvas.height = qrSize;

      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, qrSize, qrSize);

        const scale = qrSize / 200;
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
      }

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      const sizeLabel = size === 'high' ? '-high-res' : '';
      downloadLink.download = `${profile.username}-qr-code${sizeLabel}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Carte de ${profile.full_name}`,
          text: `Découvrez ma profil professionnel numérique`,
          url: profileUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(profileUrl);
      alert('Lien copié dans le presse-papier !');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="bg-white/95 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50 shadow-premium-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold bg-gradient-amber bg-clip-text text-transparent">Ma carte numérique</h1>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-transparent border border-amber-200 rounded-xl"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-amber rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1">
              <h3 className="text-neutral-900 font-semibold mb-2">Découvrez toutes les fonctionnalités</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Optimisez votre présence professionnelle avec nos outils avancés
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ContextualLink
                  to="/analytics"
                  label="Analytics détaillés"
                  description="Comprendre votre audience"
                  icon={<BarChart3 className="w-4 h-4" />}
                  variant="card"
                />
                <ContextualLink
                  to="/edit"
                  label="Personnalisation"
                  description="Affiner votre profil"
                  icon={<Edit className="w-4 h-4" />}
                  variant="card"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={staggerItem}>
              <Card variant="default" className="bg-white border-neutral-200">
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900">Aperçu de votre carte</h2>
                    <Link to="/edit">
                      <Button variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                    </Link>
                  </div>

                  <CardPreview3D profile={profile} className="mb-6" />

                  <div className="mt-6 pt-6 border-t border-neutral-200 flex gap-3">
                    <Link to={`/${profile.username}`} className="flex-1">
                      <Button variant="outline" fullWidth>
                        <Eye className="w-4 h-4 mr-2" />
                        Aperçu
                      </Button>
                    </Link>
                    <Button variant="outline" onClick={handleShare} fullWidth>
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card variant="default" className="bg-white border-neutral-200">
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-neutral-900">Statistiques en temps réel</h2>
                    <Link to="/analytics">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Voir détails
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="text-center p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200 shadow-premium-md"
                    >
                      <TrendingUp className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                      <p className="text-4xl font-bold text-amber-600">
                        <AnimatedCounter value={analytics?.totalViews || profile.view_count || 0} duration={1.5} />
                      </p>
                      <p className="text-sm text-neutral-600 mt-2">Vues totales</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="text-center p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200 shadow-premium-md"
                    >
                      <Users className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                      <p className="text-4xl font-bold text-amber-600">
                        <AnimatedCounter value={analytics?.totalDownloads || 0} duration={1.5} />
                      </p>
                      <p className="text-sm text-neutral-600 mt-2">Téléchargements</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="text-center p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200 shadow-premium-md"
                    >
                      <MousePointerClick className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                      <p className="text-4xl font-bold text-amber-600">
                        <AnimatedCounter value={analytics?.totalLinkClicks || 0} duration={1.5} />
                      </p>
                      <p className="text-sm text-neutral-600 mt-2">Clics</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {canUpgrade && (
              <motion.div variants={staggerItem}>
                <UpgradePrompt />
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div variants={staggerItem}>
              <SubscriptionCard />
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card variant="default" className="bg-white border-neutral-200">
                <CardContent>
                  <h2 className="text-xl font-bold text-neutral-900 mb-4">Votre QR Code</h2>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-6 rounded-lg border-2 border-amber-500 flex items-center justify-center shadow-amber-glow"
                  >
                    <QRCode
                      id="qr-code"
                      value={profileUrl}
                      size={200}
                      level="H"
                    />
                  </motion.div>

                  <div className="mt-4 space-y-2">
                    <Button fullWidth variant="secondary" onClick={() => handleDownloadQR('standard')}>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger (Standard)
                    </Button>

                    <Button fullWidth variant="outline" onClick={() => handleDownloadQR('high')}>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger (Haute résolution)
                    </Button>

                    <p className="text-xs text-center text-neutral-500 mt-2">
                      Format haute résolution recommandé pour impression professionnelle
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card variant="default" className="bg-white border-neutral-200">
                <CardContent>
                  <h3 className="font-semibold text-amber-600 mb-2">URL de votre profil</h3>
                  <p className="text-sm text-neutral-600 break-all mb-3">{profileUrl}</p>
                  <Button
                    size="sm"
                    fullWidth
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(profileUrl);
                      alert('Lien copié !');
                    }}
                  >
                    Copier le lien
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card variant="default" className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
                <CardContent>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-amber rounded-full flex items-center justify-center shadow-amber-glow flex-shrink-0">
                      <Nfc className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Carte NFC prête à l'emploi</h3>
                      <p className="text-xs text-neutral-500">Zéro configuration requise</p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3 leading-relaxed">
                    Votre carte NFC physique sera pré-configurée avec votre profil et livrée prête à utiliser. Aucune manipulation technique nécessaire.
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <p className="text-xs text-neutral-700 font-medium mb-2">Comment ça marche ?</p>
                    <ul className="text-xs text-neutral-600 space-y-1">
                      <li>✓ Nous configurons votre carte avec votre profil</li>
                      <li>✓ Vous la recevez prête à partager</li>
                      <li>✓ Un simple tap suffit pour échanger vos coordonnées</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
