import { getOrderStatusColor } from '../../utils/card-utils';

interface OrderStatusBadgeProps {
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
}

const statusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  completed: 'Complétée',
  cancelled: 'Annulée',
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(status)}`}
    >
      {statusLabels[status]}
    </span>
  );
}
