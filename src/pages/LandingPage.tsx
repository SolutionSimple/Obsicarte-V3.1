import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Footer } from '../components/Footer';
import { HeroCardStack } from '../components/HeroCardStack';
import { QrCode, Share2, BarChart3, Smartphone, Sparkles, TrendingUp, Building2, GraduationCap, Landmark } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';

export function LandingPage() {
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [targetsRef, targetsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [stepsRef, stepsInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="min-h-screen bg-white">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="bg-white/95 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50 shadow-premium-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.h1
              className="text-2xl font-bold bg-gradient-amber bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Obsi
            </motion.h1>
            <div className="flex gap-4">
              <Link to="/login">
                <Button variant="outline">Se connecter</Button>
              </Link>
              <Link to="/signup">
                <Button variant="secondary">Commencer</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <main>
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-30"
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
                'radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)',
              backgroundSize: '100% 100%',
            }}
          />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 mb-6"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-amber-700 text-sm font-medium">
                  Pour professionnels, étudiants et politiciens
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 tracking-tighter"
              >
                Votre identité professionnelle,
                <motion.span
                  className="block bg-gradient-amber bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  redéfinie pour l'excellence
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg md:text-xl text-neutral-600 mb-8 leading-relaxed"
              >
                Carte de visite numérique avec QR code et carte NFC pré-configurée. Templates adaptés à votre secteur,
                profil modifiable à tout moment. Recevez votre carte prête à l'emploi, suivez vos statistiques.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12"
              >
                <Link to="/signup">
                  <Button size="lg" variant="secondary" className="px-8 w-full sm:w-auto">
                    Créer ma carte premium
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="px-8 w-full sm:w-auto">
                    Voir une démo
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                ref={statsRef}
                initial={{ opacity: 0 }}
                animate={statsInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0"
              >
                {[
                  { value: '1,247+', label: 'Professionnels' },
                  { value: '98%', label: 'Satisfaction' },
                  { value: '<2s', label: 'Chargement' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={statsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                    className="text-center lg:text-left"
                  >
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-amber bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-neutral-500">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div
              className="order-1 lg:order-2 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, type: 'spring' }}
            >
              <div className="w-full max-w-lg h-[400px] md:h-[500px]">
                <HeroCardStack />
              </div>
            </motion.div>
          </div>
        </section>

        <section ref={featuresRef} className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-white to-neutral-50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
                Fonctionnalités premium
              </h2>
              <p className="text-xl text-neutral-600">
                Tout ce dont vous avez besoin pour impressionner
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate={featuresInView ? 'animate' : 'initial'}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                {
                  icon: QrCode,
                  title: 'QR Code premium',
                  desc: 'QR codes haute résolution avec design personnalisable et téléchargement instantané',
                  color: 'from-amber-500 to-amber-600',
                  iconColor: 'text-black',
                },
                {
                  icon: Share2,
                  title: 'Partage intelligent',
                  desc: 'Partagez par lien, QR code, ou carte NFC pré-programmée avec suivi en temps réel',
                  color: 'from-amber-400 to-amber-500',
                  iconColor: 'text-black',
                },
                {
                  icon: BarChart3,
                  title: 'Analytics avancés',
                  desc: 'Tableau de bord complet avec statistiques détaillées et insights actionnables',
                  color: 'from-amber-500 to-amber-600',
                  iconColor: 'text-black',
                },
                {
                  icon: Smartphone,
                  title: 'Expérience mobile',
                  desc: 'Interface optimisée mobile-first avec support PWA pour accès offline',
                  color: 'from-amber-600 to-amber-700',
                  iconColor: 'text-black',
                },
              ].map((feature, index) => (
                <motion.div key={feature.title} variants={staggerItem}>
                  <Card
                    variant="glassmorphism"
                    className="h-full bg-white border-neutral-200 backdrop-blur-xl shadow-premium-sm"
                  >
                    <div className="p-6">
                      <motion.div
                        className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                      </motion.div>
                      <h3 className="text-xl font-bold text-neutral-900 mb-2">{feature.title}</h3>
                      <p className="text-neutral-600 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section ref={targetsRef} className="py-20 relative">
          <div className="absolute inset-0 bg-neutral-50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={targetsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
                Conçu pour vos besoins
              </h2>
              <p className="text-xl text-neutral-600">
                Des templates adaptés à votre secteur d'activité
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate={targetsInView ? 'animate' : 'initial'}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: Building2,
                  title: 'Professionnels & Entreprises',
                  desc: 'Dirigeants, commerciaux, consultants. Créez une image professionnelle qui inspire confiance avec un profil sobre et efficace.',
                  color: 'from-blue-500 to-blue-600',
                  features: ['Coordonnées complètes', 'Logo entreprise', 'Collecte de leads', 'Analytics détaillés'],
                },
                {
                  icon: GraduationCap,
                  title: 'Étudiants & Jeunes diplômés',
                  desc: 'Formation, stages, alternance. Démarquez-vous avec un profil moderne et dynamique qui met en valeur vos compétences.',
                  color: 'from-green-500 to-green-600',
                  features: ['Portfolio en ligne', 'Compétences', 'Recherche stage', 'CV téléchargeable'],
                },
                {
                  icon: Landmark,
                  title: 'Politiciens & Élus',
                  desc: 'Candidats, élus, responsables politiques. Un profil institutionnel qui inspire confiance et proximité avec vos électeurs.',
                  color: 'from-red-500 to-red-600',
                  features: ['Programme détaillé', 'Mandats', 'Contact équipe', 'Actualités'],
                },
              ].map((target, index) => (
                <motion.div key={target.title} variants={staggerItem}>
                  <Card
                    variant="glassmorphism"
                    className="h-full bg-white border-neutral-200 backdrop-blur-xl hover:border-amber-300 transition-colors shadow-premium-sm"
                  >
                    <div className="p-8">
                      <motion.div
                        className={`w-16 h-16 bg-gradient-to-br ${target.color} rounded-2xl flex items-center justify-center mb-6`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <target.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-neutral-900 mb-3">{target.title}</h3>
                      <p className="text-neutral-600 leading-relaxed mb-6">{target.desc}</p>
                      <ul className="space-y-2">
                        {target.features.map((feature) => (
                          <li key={feature} className="flex items-center text-neutral-600 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={targetsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-center mt-12"
            >
              <p className="text-warmGray-300 text-lg">
                Et bien plus encore : freelances, artistes, artisans, associations...
              </p>
            </motion.div>
          </div>
        </section>

        <section ref={stepsRef} className="bg-neutral-50 py-20 border-y border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={stepsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
                Démarrez en 3 étapes
              </h2>
              <p className="text-xl text-neutral-600">Créez votre profil en moins de 2 minutes</p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate={stepsInView ? 'animate' : 'initial'}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  num: '1',
                  title: 'Créez votre profil',
                  desc: 'Remplissez vos informations professionnelles. Photo, coordonnées, liens sociaux et bien plus.',
                },
                {
                  num: '2',
                  title: 'Personnalisez votre design',
                  desc: 'Choisissez parmi nos templates premium ou créez votre propre style institutionnel.',
                },
                {
                  num: '3',
                  title: 'Recevez votre carte NFC',
                  desc: 'Carte physique pré-configurée livrée prête à l\'emploi. Partagez vos coordonnées en un tap.',
                },
              ].map((step, index) => (
                <motion.div key={step.num} variants={staggerItem} className="text-center">
                  <motion.div
                    className="w-20 h-20 bg-gradient-amber rounded-full flex items-center justify-center text-3xl font-bold text-black mx-auto mb-6 shadow-amber-glow"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    {step.num}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3">{step.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={stepsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-center mt-16"
            >
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="px-10">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Commencer maintenant
                </Button>
              </Link>
              <p className="text-neutral-500 text-sm mt-4">
                Aucune carte bancaire requise • Essai gratuit illimité
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
