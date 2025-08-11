import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import StatsCards from './StatsCards';
import RecentActivities from './RecentActivities';
import QuickActions from './QuickActions';
import AcademicOverview from './AcademicOverview';

const SupabaseDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [academicData, setAcademicData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activitiesData, academicOverview] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentActivities(),
        dashboardService.getAcademicOverview()
      ]);
      
      setStats(statsData);
      setActivities(activitiesData);
      setAcademicData(academicOverview);
    } catch (error) {
      console.error('Erreur lors du chargement du tableau de bord:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-3">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Chargement du tableau de bord...</span>
        </div>
      </div>
    );
  }

  // Adapter les données pour les composants existants
  const adaptedStatsData = [
    {
      title: 'Élèves Inscrits',
      value: stats?.total_students?.toString() || '0',
      change: '+12%',
      changeType: 'increase',
      icon: 'Users',
      color: 'blue'
    },
    {
      title: 'Classes Actives',
      value: stats?.total_classes?.toString() || '0',
      change: '+2',
      changeType: 'increase',
      icon: 'GraduationCap',
      color: 'green'
    },
    {
      title: 'Revenus ce Mois',
      value: `${stats?.monthly_revenue?.toLocaleString() || '0'} FCFA`,
      change: '+8.5%',
      changeType: 'increase',
      icon: 'DollarSign',
      color: 'yellow'
    },
    {
      title: 'Paiements en Retard',
      value: stats?.outstanding_payments?.toString() || '0',
      change: '-5%',
      changeType: 'decrease',
      icon: 'AlertTriangle',
      color: 'red'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Tableau de Bord</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Vue d'ensemble de l'année scolaire {stats?.active_year || '2024-2025'} - Connecté à Supabase
          </p>
        </div>
        <button 
          onClick={loadDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>Actualiser</span>
        </button>
      </div>

      {/* Indicateur de connexion Supabase */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-800 font-medium">Connecté à Supabase</span>
          <span className="text-green-600 text-sm">• Données en temps réel</span>
        </div>
      </div>

      <StatsCards statsData={adaptedStatsData} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <AcademicOverview academicData={academicData} />
          <RecentActivities activities={activities} />
        </div>
        
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default SupabaseDashboard;