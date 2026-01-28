import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Gem, Check, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { staggerContainerSlow, staggerItem } from '../utils/animations';
import { SEO } from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';

export function Pricing() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const navigate = useNavigate();
  const { user } = useAuth();

  const pricingPlans = [
    {
      name: 'Pack Roc',
      icon: Gem,
      price: '19,90',
      period: '/mois pendant 1 an',
      tier: 'roc',
      features: [
        '1 profil personnalisé',
        '1 carte NFC premium',
        'Partage illimité',
        'QR code dynamique',
      ],
      highlighted: false,
      color: 'from-gray-500 to-gray-700',
    },
    {
      name: 'Pack Saphir',
      icon: Gem,
      price: '24,90',
      period: '/mois pendant 1 an',
      tier: 'saphir',
      features: [
        'Tout du Pack Roc',
        '3 profils personnalisés',
        'Pitch vidéo intégré',
        'CRM intégré',
        'Statistiques avancées',
      ],
      highlighted: true,
      recommended: true,
      color: 'from-[#3B82F6] to-[#2563EB]',
    },
    {
      name: 'Pack Emeraude',
      icon: Gem,
      price: '34,90',
      period: '/mois pendant 1 an',
      tier: 'emeraude',
      features: [
        'Tout des Packs Roc & Saphir',
        'Logo personnalisé sur carte',
        'Adhésion au club VIP',
        'Support prioritaire',
        'Accès exclusif aux événements',
      ],
      highlighted: false,
      color: 'from-emerald-600 to-emerald-800',
    },
  ];

  const handleSelectPlan = (tier: string) => {
    navigate(`/order-card?tier=${tier}`);
  };

  return (
    <div className="min-h-screen bg-warmGray-50">
      <SEO
        title="Nos Offres - Obsi"
        description="Découvrez nos packs premium avec cartes NFC intelligentes. Choisissez l'offre qui vous correspond."
      />

      <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-8 border-b border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-warmGray-300 hover:text-warmGray-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </button>
        </div>
      </div>

      <section ref={ref} className="relative py-20">
        <div className="absolute inset-0 bg-gradient-radial from-gold-400/10 via-transparent to-transparent opacity-30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gold-700 mb-6 tracking-tight">
              Nos Offres
            </h1>
            <p className="text-xl md:text-2xl text-warmGray-700">
              Choisissez le pack qui vous correspond
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainerSlow}
            initial="initial"
            animate={inView ? 'animate' : 'initial'}
            className="grid md:grid-cols-3 gap-8 mb-20"
          >
            {pricingPlans.map((plan) => {
              const Icon = plan.icon;

              return (
                <motion.div
                  key={plan.name}
                  variants={staggerItem}
                  className="relative"
                >
                  {plan.recommended && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-gold-md">
                        Recommandé
                      </span>
                    </div>
                  )}

                  <Card
                    variant="dark-premium"
                    className={`relative h-full ${
                      plan.highlighted
                        ? 'ring-2 ring-[#3B82F6]/50 shadow-xl transform scale-105'
                        : ''
                    }`}
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex flex-col items-center text-center mb-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                          <Icon className="w-9 h-9 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-warmGray-50 mb-2">
                          {plan.name}
                        </h3>
                      </div>

                      <div className="text-center mb-6">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-5xl font-bold text-gold-400">
                            {plan.price}
                          </span>
                          <span className="text-xl text-warmGray-300">€</span>
                        </div>
                        <p className="text-sm text-warmGray-300 mt-2">
                          {plan.period}
                        </p>
                      </div>

                      <ul className="space-y-3 mb-6 flex-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-warmGray-300 text-sm">
                            <Check className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        variant={plan.highlighted ? "primary" : "secondary"}
                        className="w-full"
                        onClick={() => handleSelectPlan(plan.tier)}
                      >
                        Choisir ce pack
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gold-700 text-center mb-10">
              Comparaison détaillée
            </h2>

            <Card variant="dark-premium" className="overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-700">
                        <th className="text-left p-4 md:p-6 font-semibold text-warmGray-50 bg-neutral-800/30">
                          Fonctionnalités
                        </th>
                        <th className="text-center p-4 md:p-6 font-semibold text-warmGray-200 bg-neutral-800/30">
                          Pack Roc
                        </th>
                        <th className="text-center p-4 md:p-6 font-semibold text-[#3B82F6] bg-[#3B82F6]/20">
                          Pack Saphir
                        </th>
                        <th className="text-center p-4 md:p-6 font-semibold text-emerald-400 bg-emerald-900/20">
                          Pack Emeraude
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-700">
                      {[
                        { label: 'Profils personnalisés', roc: '1', saphir: '3', emeraude: 'Illimités' },
                        { label: 'Carte NFC premium', roc: true, saphir: true, emeraude: true },
                        { label: 'Partage illimité', roc: true, saphir: true, emeraude: true },
                        { label: 'QR code dynamique', roc: true, saphir: true, emeraude: true },
                        { label: 'Pitch vidéo intégré', roc: false, saphir: true, emeraude: true },
                        { label: 'CRM intégré', roc: false, saphir: true, emeraude: true },
                        { label: 'Statistiques avancées', roc: false, saphir: true, emeraude: true },
                        { label: 'Logo personnalisé sur carte', roc: false, saphir: false, emeraude: true },
                        { label: 'Adhésion au club VIP', roc: false, saphir: false, emeraude: true },
                        { label: 'Support prioritaire', roc: false, saphir: false, emeraude: true },
                        { label: 'Accès exclusif aux événements', roc: false, saphir: false, emeraude: true },
                      ].map((row, index) => (
                        <tr key={index} className="hover:bg-neutral-800/30 transition-colors">
                          <td className="p-4 md:p-6 text-warmGray-100 font-medium">
                            {row.label}
                          </td>
                          {['roc', 'saphir', 'emeraude'].map((tier) => {
                            const value = row[tier as keyof typeof row];
                            return (
                              <td key={tier} className="p-4 md:p-6 text-center">
                                {typeof value === 'boolean' ? (
                                  <div className="flex justify-center">
                                    <div className={`w-6 h-6 rounded-full ${value ? 'bg-gradient-to-br from-gold-400 to-gold-600' : 'bg-neutral-700'} flex items-center justify-center`}>
                                      {value ? (
                                        <Check className="w-4 h-4 text-white" />
                                      ) : (
                                        <X className="w-4 h-4 text-warmGray-500" />
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-warmGray-200">{value}</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
