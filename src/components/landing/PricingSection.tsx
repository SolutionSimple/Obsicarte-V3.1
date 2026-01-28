import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Gem, Check, CreditCard, Palette, X } from 'lucide-react';
import { Card, CardContent } from '../Card';
import { Button } from '../Button';
import { staggerContainerSlow, staggerItem } from '../../utils/animations';

export const PricingSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const pricingPlans = [
    {
      name: 'Pack Roc',
      icon: Gem,
      price: '19,90',
      period: '/mois pendant 1 an',
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
      features: [
        'Tout du Pack Roc',
        '3 profils personnalisés',
        'Pitch vidéo intégré',
        'CRM intégré',
        'Statistiques avancées',
      ],
      highlighted: true,
      recommended: true,
      color: 'from-[#0F52BA] to-[#0a3a8a]',
    },
    {
      name: 'Pack Emeraude',
      icon: Gem,
      price: '34,90',
      period: '/mois pendant 1 an',
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

  const additionalServices = [
    {
      name: 'Carte de Remplacement',
      price: '29,90',
      icon: CreditCard,
    },
    {
      name: 'Personnalisation couleur Métal',
      price: '+10',
      icon: Palette,
    },
  ];

  return (
    <section ref={ref} className="relative py-32 bg-gradient-to-b from-beige-100 via-warmGray-100 to-beige-200">
      <div className="absolute inset-0 bg-gradient-radial from-gold-400/10 via-transparent to-transparent opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gold-700 mb-6 tracking-tight">
            Nos Offres
          </h2>
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
                  variant="default"
                  className={`relative ${
                    plan.highlighted
                      ? 'ring-2 ring-[#0F52BA]/50 shadow-xl transform scale-105'
                      : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon className="w-9 h-9 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-warmGray-900 mb-2">
                        {plan.name}
                      </h3>
                    </div>

                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-bold text-gold-700">
                          {plan.price}
                        </span>
                        <span className="text-xl text-warmGray-600">€</span>
                      </div>
                      <p className="text-sm text-warmGray-600 mt-2">
                        {plan.period}
                      </p>
                    </div>

                    <Button
                      variant={plan.highlighted ? "primary" : "secondary"}
                      className="w-full"
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
          className="max-w-5xl mx-auto mb-20"
        >
          <h3 className="text-3xl font-bold text-gold-700 text-center mb-10">
            Comparaison détaillée
          </h3>

          <Card variant="glassmorphism" className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-warmGray-200">
                      <th className="text-left p-4 md:p-6 font-semibold text-warmGray-900 bg-warmGray-50/50">
                        Fonctionnalités
                      </th>
                      <th className="text-center p-4 md:p-6 font-semibold text-warmGray-700 bg-warmGray-50/30">
                        Pack Roc
                      </th>
                      <th className="text-center p-4 md:p-6 font-semibold text-[#0F52BA] bg-[#0F52BA]/5">
                        Pack Saphir
                      </th>
                      <th className="text-center p-4 md:p-6 font-semibold text-emerald-700 bg-emerald-50/30">
                        Pack Emeraude
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warmGray-200">
                    <tr className="hover:bg-warmGray-50/50 transition-colors">
                      <td className="p-4 md:p-6 text-warmGray-700 font-medium">
                        Profils personnalisés
                      </td>
                      <td className="p-4 md:p-6 text-center text-warmGray-700">
                        1
                      </td>
                      <td className="p-4 md:p-6 text-center text-warmGray-700">
                        3
                      </td>
                      <td className="p-4 md:p-6 text-center text-warmGray-700">
                        Illimités
                      </td>
                    </tr>
                    <tr className="hover:bg-warmGray-50/50 transition-colors">
                      <td className="p-4 md:p-6 text-warmGray-700 font-medium">
                        Carte NFC premium
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-warmGray-50/50 transition-colors">
                      <td className="p-4 md:p-6 text-warmGray-700 font-medium">
                        Partage illimité
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-warmGray-50/50 transition-colors">
                      <td className="p-4 md:p-6 text-warmGray-700 font-medium">
                        QR code dynamique
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-warmGray-50/50 transition-colors">
                      <td className="p-4 md:p-6 text-warmGray-700 font-medium">
                        Pitch vidéo intégré
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-warmGray-200 flex items-center justify-center">
                            <X className="w-4 h-4 text-warmGray-400" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-warmGray-50/50 transition-colors">
                      <td className="p-4 md:p-6 text-warmGray-700 font-medium">
                        CRM intégré
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-warmGray-200 flex items-center justify-center">
                            <X className="w-4 h-4 text-warmGray-400" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-warmGray-50/50 transition-colors">
                      <td className="p-4 md:p-6 text-warmGray-700 font-medium">
                        Statistiques avancées
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-warmGray-200 flex items-center justify-center">
                            <X className="w-4 h-4 text-warmGray-400" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-warmGray-50/50 transition-colors">
                      <td className="p-4 md:p-6 text-warmGray-700 font-medium">
                        Logo personnalisé sur carte
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-warmGray-200 flex items-center justify-center">
                            <X className="w-4 h-4 text-warmGray-400" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-warmGray-200 flex items-center justify-center">
                            <X className="w-4 h-4 text-warmGray-400" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-warmGray-50/50 transition-colors">
                      <td className="p-4 md:p-6 text-warmGray-700 font-medium">
                        Adhésion au club VIP
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-warmGray-200 flex items-center justify-center">
                            <X className="w-4 h-4 text-warmGray-400" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-warmGray-200 flex items-center justify-center">
                            <X className="w-4 h-4 text-warmGray-400" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-warmGray-50/50 transition-colors">
                      <td className="p-4 md:p-6 text-warmGray-700 font-medium">
                        Support prioritaire
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-warmGray-200 flex items-center justify-center">
                            <X className="w-4 h-4 text-warmGray-400" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-warmGray-200 flex items-center justify-center">
                            <X className="w-4 h-4 text-warmGray-400" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-warmGray-50/50 transition-colors">
                      <td className="p-4 md:p-6 text-warmGray-700 font-medium">
                        Accès exclusif aux événements
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-warmGray-200 flex items-center justify-center">
                            <X className="w-4 h-4 text-warmGray-400" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-warmGray-200 flex items-center justify-center">
                            <X className="w-4 h-4 text-warmGray-400" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <h3 className="text-3xl font-bold text-gold-700 text-center mb-10">
            Services Additionnels
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {additionalServices.map((service) => {
              const Icon = service.icon;

              return (
                <Card
                  key={service.name}
                  variant="glassmorphism"
                  className="transition-all duration-300 hover:shadow-gold-md"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-warmGray-900 mb-1">
                          {service.name}
                        </h4>
                        <p className="text-2xl font-bold text-gold-700">
                          {service.price}€
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
