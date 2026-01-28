import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutForm } from '../components/order/CheckoutForm';
import { getTierName, getTierPrice, formatPrice } from '../utils/card-utils';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

type Tier = 'roc' | 'saphir' | 'emeraude';

interface OrderData {
  tier: Tier;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

export function OrderCard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderData>({
    tier: (searchParams.get('tier') as Tier) || 'roc',
    quantity: 1,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: {
      street: '',
      city: '',
      postal_code: '',
      country: 'France',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const tierOptions = [
    {
      id: 'roc' as Tier,
      name: 'Roc',
      price: getTierPrice('roc'),
      features: ['Carte NFC premium', 'Profil digital personnalisé', 'QR Code personnalisable', 'Statistiques de base'],
    },
    {
      id: 'saphir' as Tier,
      name: 'Saphir',
      price: getTierPrice('saphir'),
      features: ['Tout de Roc', 'Design templates premium', 'Analytiques avancées', 'Intégrations API'],
    },
    {
      id: 'emeraude' as Tier,
      name: 'Émeraude',
      price: getTierPrice('emeraude'),
      features: ['Tout de Saphir', 'Support prioritaire', 'Personnalisation avancée', 'Fonctionnalités exclusives'],
    },
  ];

  const handleTierChange = (tier: Tier) => {
    setOrderData((prev) => ({ ...prev, tier }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (orderData.quantity < 1 || orderData.quantity > 100) {
      newErrors.quantity = 'Quantité invalide (1-100)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!orderData.customerName.trim()) {
      newErrors.customerName = 'Le nom est requis';
    }
    if (!orderData.customerEmail.trim()) {
      newErrors.customerEmail = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.customerEmail)) {
      newErrors.customerEmail = 'Email invalide';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!orderData.shippingAddress.street.trim()) {
      newErrors.street = 'L\'adresse est requise';
    }
    if (!orderData.shippingAddress.city.trim()) {
      newErrors.city = 'La ville est requise';
    }
    if (!orderData.shippingAddress.postal_code.trim()) {
      newErrors.postal_code = 'Le code postal est requis';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const totalAmount = getTierPrice(orderData.tier) * orderData.quantity;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Commander votre carte Obsi</h1>
          <p className="text-gray-600">Suivez les étapes pour finaliser votre commande</p>
        </div>

        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s <= step
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-16 h-1 ${
                    s < step ? 'bg-gray-900' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Choisissez votre pack</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tierOptions.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => handleTierChange(tier.id)}
                    className={`p-6 border-2 rounded-xl text-left transition-all ${
                      orderData.tier === tier.id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <p className="text-3xl font-bold text-gray-900 mb-4">{formatPrice(tier.price)}</p>
                    <ul className="space-y-2">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantité
                </label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={orderData.quantity}
                  onChange={(e) => setOrderData({ ...orderData, quantity: parseInt(e.target.value) || 1 })}
                  error={errors.quantity}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNext}>
                  Suivant
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Vos informations</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <Input
                    value={orderData.customerName}
                    onChange={(e) => setOrderData({ ...orderData, customerName: e.target.value })}
                    placeholder="Jean Dupont"
                    error={errors.customerName}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={orderData.customerEmail}
                    onChange={(e) => setOrderData({ ...orderData, customerEmail: e.target.value })}
                    placeholder="jean@exemple.com"
                    error={errors.customerEmail}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone (optionnel)
                  </label>
                  <Input
                    type="tel"
                    value={orderData.customerPhone}
                    onChange={(e) => setOrderData({ ...orderData, customerPhone: e.target.value })}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Retour
                </Button>
                <Button onClick={handleNext}>
                  Suivant
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Adresse de livraison</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <Input
                    value={orderData.shippingAddress.street}
                    onChange={(e) => setOrderData({
                      ...orderData,
                      shippingAddress: { ...orderData.shippingAddress, street: e.target.value }
                    })}
                    placeholder="12 rue de la République"
                    error={errors.street}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code postal
                    </label>
                    <Input
                      value={orderData.shippingAddress.postal_code}
                      onChange={(e) => setOrderData({
                        ...orderData,
                        shippingAddress: { ...orderData.shippingAddress, postal_code: e.target.value }
                      })}
                      placeholder="75001"
                      error={errors.postal_code}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <Input
                      value={orderData.shippingAddress.city}
                      onChange={(e) => setOrderData({
                        ...orderData,
                        shippingAddress: { ...orderData.shippingAddress, city: e.target.value }
                      })}
                      placeholder="Paris"
                      error={errors.city}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays
                  </label>
                  <Input
                    value={orderData.shippingAddress.country}
                    onChange={(e) => setOrderData({
                      ...orderData,
                      shippingAddress: { ...orderData.shippingAddress, country: e.target.value }
                    })}
                    placeholder="France"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Retour
                </Button>
                <Button onClick={handleNext}>
                  Suivant
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Paiement</h2>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pack</span>
                    <span className="font-medium">{getTierName(orderData.tier)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantité</span>
                    <span className="font-medium">{orderData.quantity}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Elements stripe={stripePromise}>
                <CheckoutForm orderData={orderData} totalAmount={totalAmount} onBack={handleBack} />
              </Elements>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Annuler la commande
          </Button>
        </div>
      </div>
    </div>
  );
}
