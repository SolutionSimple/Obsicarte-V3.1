import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { supabase } from '../../lib/supabase';
import { CreditCard, ShoppingCart, CheckCircle, Clock } from 'lucide-react';

interface Stats {
  totalCards: number;
  activatedCards: number;
  pendingCards: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalCards: 0,
    activatedCards: 0,
    pendingCards: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        { count: totalCards },
        { count: activatedCards },
        { count: pendingCards },
        { count: totalOrders },
        { count: pendingOrders },
        { count: completedOrders },
      ] = await Promise.all([
        supabase.from('cards').select('*', { count: 'exact', head: true }),
        supabase.from('cards').select('*', { count: 'exact', head: true }).eq('status', 'activated'),
        supabase.from('cards').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      ]);

      setStats({
        totalCards: totalCards || 0,
        activatedCards: activatedCards || 0,
        pendingCards: pendingCards || 0,
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        completedOrders: completedOrders || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Cartes',
      value: stats.totalCards,
      icon: CreditCard,
      color: 'bg-blue-500',
      link: '/admin/cards',
    },
    {
      title: 'Cartes Activées',
      value: stats.activatedCards,
      icon: CheckCircle,
      color: 'bg-green-500',
      link: '/admin/cards?status=activated',
    },
    {
      title: 'Cartes en Attente',
      value: stats.pendingCards,
      icon: Clock,
      color: 'bg-yellow-500',
      link: '/admin/cards?status=pending',
    },
    {
      title: 'Total Commandes',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      link: '/admin/orders',
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble de votre système de cartes Obsi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                to={stat.link}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <Link
                to="/admin/cards/generate"
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <h3 className="font-medium text-gray-900">Générer des cartes</h3>
                <p className="text-sm text-gray-600 mt-1">Créer un nouveau batch de codes d'activation</p>
              </Link>
              <Link
                to="/admin/orders"
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <h3 className="font-medium text-gray-900">Gérer les commandes</h3>
                <p className="text-sm text-gray-600 mt-1">Voir et traiter les commandes en cours</p>
              </Link>
              <Link
                to="/admin/resellers"
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <h3 className="font-medium text-gray-900">Gérer les revendeurs</h3>
                <p className="text-sm text-gray-600 mt-1">Ajouter ou modifier des revendeurs</p>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Taux d'activation</span>
                  <span className="font-medium text-gray-900">
                    {stats.totalCards > 0
                      ? Math.round((stats.activatedCards / stats.totalCards) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${stats.totalCards > 0 ? (stats.activatedCards / stats.totalCards) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Commandes complétées</span>
                  <span className="font-medium text-gray-900">
                    {stats.totalOrders > 0
                      ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${stats.totalOrders > 0 ? (stats.completedOrders / stats.totalOrders) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
