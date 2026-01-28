import { getCardStatusColor } from '../../utils/card-utils';

interface CardStatusBadgeProps {
  status: 'pending' | 'activated' | 'deactivated' | 'shipped';
}

const statusLabels = {
  pending: 'En attente',
  activated: 'Activée',
  deactivated: 'Désactivée',
  shipped: 'Expédiée',
};

export function CardStatusBadge({ status }: CardStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCardStatusColor(status)}`}
    >
      {statusLabels[status]}
    </span>
  );
}
