import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useCards } from '../../hooks/useCards';
import { CardStatusBadge } from '../../components/card/CardStatusBadge';
import { formatShortDate, getTierName } from '../../utils/card-utils';
import { Search, Plus, Download } from 'lucide-react';
import { Card } from '../../types/database.types';

export function AdminCards() {
  const [statusFilter, setStatusFilter] = useState<Card['status'] | 'all'>('all');
  const [tierFilter, setTierFilter] = useState<Card['tier'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { cards, loading, searchCards, fetchCards } = useCards({
    autoFetch: true,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchCards(searchTerm);
    } else {
      fetchCards();
    }
  };

  const filteredCards = cards.filter((card) => {
    if (statusFilter !== 'all' && card.status !== statusFilter) return false;
    if (tierFilter !== 'all' && card.tier !== tierFilter) return false;
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Code Carte', 'Code Activation', 'Tier', 'Statut', 'Date Création'];
    const rows = filteredCards.map((card) => [
      card.card_code,
      card.activation_code,
      getTierName(card.tier),
      card.status,
      formatShortDate(card.created_at),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `obsi-cards-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des cartes</h1>
            <p className="text-gray-600 mt-2">{filteredCards.length} carte(s)</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter CSV
            </button>
            <Link
              to="/admin/cards/generate"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Générer des cartes
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher par code carte ou code activation..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </form>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Card['status'] | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="activated">Activée</option>
              <option value="shipped">Expédiée</option>
              <option value="deactivated">Désactivée</option>
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as Card['tier'] | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="all">Tous les tiers</option>
              <option value="roc">Roc</option>
              <option value="saphir">Saphir</option>
              <option value="emeraude">Émeraude</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-600">Aucune carte trouvée</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code Carte
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code Activation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Création
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCards.map((card) => (
                    <tr key={card.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {card.card_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {card.activation_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getTierName(card.tier)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CardStatusBadge status={card.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatShortDate(card.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/admin/cards/${card.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Voir détails
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
