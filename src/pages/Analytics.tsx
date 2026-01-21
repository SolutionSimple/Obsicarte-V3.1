import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfile } from '../hooks/useProfile';
import { useAnalytics } from '../hooks/useAnalytics';
import { Button } from '../components/Button';
import { Breadcrumb } from '../components/Breadcrumb';
import { ContextualLink } from '../components/ContextualLink';
import { Card, CardContent } from '../components/Card';
import { AnimatedCounter } from '../components/AnimatedCounter';
import {
  ArrowLeft,
  Eye,
  Download,
  MousePointerClick,
  TrendingUp,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  Clock,
  Edit,
  Share2,
} from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';

export function Analytics() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { analytics, periods, loading, error } = useAnalytics(profile?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center">
        <motion.div
          className="h-12 w-12 border-4 border-gold-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center p-4">
        <Card variant="glassmorphism" className="max-w-md">
          <CardContent>
            <p className="text-red-400 text-center">{error}</p>
            <Button onClick={() => navigate('/dashboard')} variant="outline" fullWidth className="mt-4">
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics || !periods) return null;

  const deviceTotal = analytics.deviceBreakdown.mobile + analytics.deviceBreakdown.desktop + analytics.deviceBreakdown.tablet;
  const mobilePercent = deviceTotal > 0 ? (analytics.deviceBreakdown.mobile / deviceTotal) * 100 : 0;
  const desktopPercent = deviceTotal > 0 ? (analytics.deviceBreakdown.desktop / deviceTotal) * 100 : 0;
  const tabletPercent = deviceTotal > 0 ? (analytics.deviceBreakdown.tablet / deviceTotal) * 100 : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getEventLabel = (eventType: string) => {
    switch (eventType) {
      case 'view':
        return 'Vue';
      case 'vcard_download':
        return 'Téléchargement';
      case 'link_click':
        return 'Clic';
      default:
        return eventType;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      <nav className="bg-navy-900/80 backdrop-blur-md border-b border-gold-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-warmGray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour</span>
            </button>
            <h1 className="text-xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              Statistiques détaillées
            </h1>
            <div className="w-24" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: 'Tableau de bord', href: '/dashboard' },
            { label: 'Statistiques' }
          ]}
          className="mb-6"
        />

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ContextualLink
            to="/edit"
            label="Optimiser votre profil"
            description="Améliorer vos informations pour plus de visibilité"
            icon={<Edit className="w-5 h-5" />}
            variant="card"
          />
          <ContextualLink
            to="/dashboard"
            label="Partager votre carte"
            description="Diffuser votre profil sur vos réseaux"
            icon={<Share2 className="w-5 h-5" />}
            variant="card"
          />
          <ContextualLink
            to={`/${profile?.username}`}
            label="Voir votre profil public"
            description="Découvrir comment les visiteurs vous voient"
            icon={<Eye className="w-5 h-5" />}
            variant="card"
          />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          <motion.div variants={staggerItem}>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-gold-400" />
              Vue d'ensemble
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Card variant="glassmorphism" className="bg-navy-800/50 border-gold-500/20">
                <CardContent className="text-center p-6">
                  <Eye className="w-8 h-8 text-gold-400 mx-auto mb-3" />
                  <p className="text-4xl font-bold text-gold-400 mb-2">
                    <AnimatedCounter value={analytics.totalViews} duration={1.5} />
                  </p>
                  <p className="text-sm text-warmGray-300">Vues totales</p>
                </CardContent>
              </Card>

              <Card variant="glassmorphism" className="bg-navy-800/50 border-gold-500/20">
                <CardContent className="text-center p-6">
                  <Download className="w-8 h-8 text-gold-400 mx-auto mb-3" />
                  <p className="text-4xl font-bold text-gold-400 mb-2">
                    <AnimatedCounter value={analytics.totalDownloads} duration={1.5} />
                  </p>
                  <p className="text-sm text-warmGray-300">Téléchargements</p>
                </CardContent>
              </Card>

              <Card variant="glassmorphism" className="bg-navy-800/50 border-gold-500/20">
                <CardContent className="text-center p-6">
                  <MousePointerClick className="w-8 h-8 text-gold-400 mx-auto mb-3" />
                  <p className="text-4xl font-bold text-gold-400 mb-2">
                    <AnimatedCounter value={analytics.totalLinkClicks} duration={1.5} />
                  </p>
                  <p className="text-sm text-warmGray-300">Clics sur liens</p>
                </CardContent>
              </Card>

              <Card variant="glassmorphism" className="bg-navy-800/50 border-gold-500/20">
                <CardContent className="text-center p-6">
                  <TrendingUp className="w-8 h-8 text-gold-400 mx-auto mb-3" />
                  <p className="text-4xl font-bold text-gold-400 mb-2">
                    {analytics.conversionRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-warmGray-300">Taux conversion</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div variants={staggerItem}>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-gold-400" />
              Par période
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: "Aujourd'hui", data: periods.today, icon: Clock },
                { label: 'Cette semaine', data: periods.thisWeek, icon: Calendar },
                { label: 'Ce mois', data: periods.thisMonth, icon: Calendar },
                { label: 'Total', data: periods.total, icon: TrendingUp },
              ].map((period) => (
                <Card key={period.label} variant="glassmorphism" className="bg-navy-800/50 border-gold-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <period.icon className="w-5 h-5 text-gold-400" />
                      <h3 className="font-semibold text-white">{period.label}</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-warmGray-300">Vues</span>
                        <span className="text-lg font-bold text-white">{period.data.views}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-warmGray-300">Téléchargements</span>
                        <span className="text-lg font-bold text-white">{period.data.downloads}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-warmGray-300">Clics</span>
                        <span className="text-lg font-bold text-white">{period.data.clicks}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div variants={staggerItem}>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-gold-400" />
              Répartition par appareil
            </h2>
            <Card variant="glassmorphism" className="bg-navy-800/50 border-gold-500/20">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-gold-400" />
                        <span className="text-white font-medium">Mobile</span>
                      </div>
                      <span className="text-warmGray-300">
                        {analytics.deviceBreakdown.mobile} ({mobilePercent.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-navy-700 rounded-full h-3">
                      <div
                        className="bg-gradient-gold h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${mobilePercent}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-gold-400" />
                        <span className="text-white font-medium">Desktop</span>
                      </div>
                      <span className="text-warmGray-300">
                        {analytics.deviceBreakdown.desktop} ({desktopPercent.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-navy-700 rounded-full h-3">
                      <div
                        className="bg-gradient-gold h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${desktopPercent}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Tablet className="w-5 h-5 text-gold-400" />
                        <span className="text-white font-medium">Tablette</span>
                      </div>
                      <span className="text-warmGray-300">
                        {analytics.deviceBreakdown.tablet} ({tabletPercent.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-navy-700 rounded-full h-3">
                      <div
                        className="bg-gradient-gold h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${tabletPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-gold-400" />
              Événements récents
            </h2>
            <Card variant="glassmorphism" className="bg-navy-800/50 border-gold-500/20">
              <CardContent className="p-6">
                {analytics.recentEvents.length === 0 ? (
                  <p className="text-center text-warmGray-400 py-8">Aucun événement enregistré</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.recentEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 bg-navy-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gold-400 rounded-full" />
                          <span className="text-white font-medium">{getEventLabel(event.event_type)}</span>
                          <span className="text-sm text-warmGray-400 capitalize">{event.device_type}</span>
                        </div>
                        <span className="text-sm text-warmGray-400">{formatDate(event.created_at)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
