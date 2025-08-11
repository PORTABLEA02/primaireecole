import React from 'react';
import { Clock, Users, DollarSign, BookOpen, AlertCircle } from 'lucide-react';

interface RecentActivitiesProps {
  activities?: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    time: string;
    user?: string;
  }>;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  const defaultActivities = [
    {
      id: '1',
      type: 'inscription',
      title: 'Nouvelle inscription',
      description: 'Kofi Mensah inscrit en CM2A',
      time: 'Il y a 2 heures',
      user: 'Mme Keita'
    },
    {
      id: '2',
      type: 'paiement',
      title: 'Paiement reçu',
      description: '1ère Tranche - Fatima Diallo (CE1B) - 150,000 FCFA',
      time: 'Il y a 3 heures',
      user: 'M. Coulibaly'
    },
    {
      id: '3',
      type: 'notes',
      title: 'Notes saisies',
      description: 'Mathématiques - CM1A (32 élèves) par M. Traore',
      time: 'Il y a 5 heures',
      user: 'M. Traore'
    }
  ];

  const data = activities || defaultActivities;

  const getIcon = (type: string) => {
    switch (type) {
      case 'students':
      case 'inscription': return Users;
      case 'payments':
      case 'paiement': return DollarSign;
      case 'grades':
      case 'notes': return BookOpen;
      case 'alerte': return AlertCircle;
      default: return Users;
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">Activités Récentes</h2>
        <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">
          Voir tout
        </button>
      </div>
      
      <div className="space-y-4">
        {data.map((activity, index) => {
          const Icon = getIcon(activity.type);
          const color = activity.type === 'paiement' ? 'green' : 
                      activity.type === 'notes' ? 'purple' : 
                      activity.type === 'alerte' ? 'orange' : 'blue';
          
          return (
            <div key={activity.id} className="flex items-start space-x-3 sm:space-x-4 p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${getColorClasses(color)}`}>
                <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-xs sm:text-sm">{activity.title}</p>
                <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">{activity.description}</p>
                
                <div className="flex items-center mt-1 sm:mt-2 text-xs text-gray-500">
                  <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivities;