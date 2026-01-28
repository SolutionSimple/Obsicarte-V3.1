import { getPaymentStatusColor } from '../../utils/card-utils';

interface PaymentStatusBadgeProps {
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
}

const statusLabels = {
  pending: 'En attente',
  succeeded: 'Payé',
  failed: 'Échoué',
  refunded: 'Remboursé',
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(status)}`}
    >
      {statusLabels[status]}
    </span>
  );
}
