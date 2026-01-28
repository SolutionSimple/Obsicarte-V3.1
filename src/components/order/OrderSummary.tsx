import { Order } from '../../types/database.types';
import { formatPrice, getTierName } from '../../utils/card-utils';

interface OrderSummaryProps {
  order: Order;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Récapitulatif de commande</h3>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Pack</span>
          <span className="font-medium text-gray-900">{getTierName(order.tier)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Quantité</span>
          <span className="font-medium text-gray-900">{order.quantity}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Client</span>
          <span className="font-medium text-gray-900">{order.customer_name}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Email</span>
          <span className="font-medium text-gray-900">{order.customer_email}</span>
        </div>

        {order.customer_phone && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Téléphone</span>
            <span className="font-medium text-gray-900">{order.customer_phone}</span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-base font-bold text-gray-900">{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {order.shipping_address && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Adresse de livraison</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{order.shipping_address.street}</p>
            <p>{order.shipping_address.postal_code} {order.shipping_address.city}</p>
            <p>{order.shipping_address.country}</p>
          </div>
        </div>
      )}
    </div>
  );
}
