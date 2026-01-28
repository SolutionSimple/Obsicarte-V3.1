import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { ActivationCodeDisplay } from '../components/card/ActivationCodeDisplay';
import { supabase } from '../lib/supabase';

export function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const paymentIntentId = searchParams.get('payment_intent');

  useEffect(() => {
    if (paymentIntentId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [paymentIntentId]);

  const fetchOrderDetails = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .maybeSingle();

      if (orderError) throw orderError;

      if (orderData) {
        setOrder(orderData);

        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*')
          .eq('order_id', orderData.id);

        if (cardsError) throw cardsError;
        setCards(cardsData || []);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Commande non trouvée</h1>
          <p className="text-gray-600 mb-6">
            Nous n'avons pas pu trouver votre commande. Si vous avez des questions, contactez notre support.
          </p>
          <Button onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p className="text-lg text-gray-600 mb-6">
            Merci pour votre achat. Votre commande {order.order_number} a été traitée avec succès.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Vos codes d'activation
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Utilisez ces codes pour activer vos cartes Obsi
            </p>

            <div className="space-y-4">
              {cards.map((card, index) => (
                <div key={card.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">
                    Carte {index + 1} - {card.card_code}
                  </div>
                  <ActivationCodeDisplay code={card.activation_code} size="sm" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Link to={`/activate?code=${cards[0]?.activation_code}&email=${encodeURIComponent(order.customer_email)}`}>
              <Button className="w-full">
                Activer ma carte maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <p className="text-sm text-gray-600">
              Un email de confirmation avec vos codes d'activation a été envoyé à{' '}
              <span className="font-medium">{order.customer_email}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochaines étapes</h3>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </span>
              <div>
                <p className="font-medium text-gray-900">Activez votre carte</p>
                <p className="text-sm text-gray-600">
                  Utilisez le code d'activation pour activer votre carte et créer votre profil
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </span>
              <div>
                <p className="font-medium text-gray-900">Personnalisez votre profil</p>
                <p className="text-sm text-gray-600">
                  Ajoutez vos informations, photo, liens et personnalisez votre carte digitale
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </span>
              <div>
                <p className="font-medium text-gray-900">Recevez votre carte physique</p>
                <p className="text-sm text-gray-600">
                  Votre carte NFC sera expédiée sous 2-3 jours ouvrés
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
