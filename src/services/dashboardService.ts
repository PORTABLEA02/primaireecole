import { supabase } from '../lib/supabase';

export const dashboardService = {
  // Récupérer les statistiques du tableau de bord
  async getDashboardStats(schoolId?: string) {
    const { data, error } = await supabase.rpc('get_dashboard_stats', {
      school_id: schoolId || null
    });
    
    if (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      // Retourner des valeurs par défaut en cas d'erreur
      return {
        total_students: 0,
        total_teachers: 0,
        total_classes: 0,
        active_year: '2024-2025',
        monthly_revenue: 0,
        outstanding_payments: 0
      };
    }
    
    return data;
  },

  // Récupérer les activités récentes
  async getRecentActivities(limit: number = 10) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        id,
        action,
        table_name,
        created_at,
        user_profiles (full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erreur lors de la récupération des activités:', error);
      return [];
    }

    return data?.map(log => ({
      id: log.id,
      type: log.table_name || 'système',
      title: log.action,
      description: `Action sur ${log.table_name}`,
      time: new Date(log.created_at).toLocaleString('fr-FR'),
      user: log.user_profiles?.full_name || 'Système'
    })) || [];
  },

  // Récupérer la répartition académique
  async getAcademicOverview() {
    const { data, error } = await supabase
      .from('levels')
      .select(`
        name,
        classes (
          id,
          student_class_enrollments (id)
        )
      `)
      .order('order_number', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération de la répartition académique:', error);
      return [];
    }

    return data?.map(level => ({
      level: level.name,
      students: level.classes?.reduce((sum, cls) => sum + (cls.student_class_enrollments?.length || 0), 0) || 0,
      classes: level.classes?.length || 0,
      trend: 'up', // À calculer selon vos besoins
      percentage: Math.random() * 10 // Simulation, à remplacer par un vrai calcul
    })) || [];
  }
};