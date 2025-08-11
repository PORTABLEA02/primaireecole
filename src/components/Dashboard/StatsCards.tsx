import React from 'react';
import { Users, GraduationCap, DollarSign, AlertTriangle } from 'lucide-react';

interface StatsCardsProps {
  statsData?: Array<{
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
    icon: string;
    color: string;
  }>;
}

const StatsCards: React.FC<StatsCardsProps> = ({ statsData }) => {
  const defaultStatsData = [
    {
      title: 'Élèves Inscrits',
      value: '1,247',
      change: '+12%',
      changeType: 'increase' as const,
      icon: 'Users',
      color: 'blue'
    },
    {
      title: 'Classes Actives',
      value: '42',
      change: '+2',
      changeType: 'increase' as const,
      icon: 'GraduationCap',
      color: 'green'
    },
    {
      title: 'Revenus cette Tranche',
      value: '2,450,000 FCFA',
      change: '+8.5%',
      changeType: 'increase' as const,
      icon: 'DollarSign',
      color: 'yellow'
    },
    {
      title: 'Paiements en Retard',
      value: '183',
      change: '-5%',
      changeType: 'decrease' as const,
      icon: 'AlertTriangle',
      color: 'red'
    }
  ];

  const data = statsData || defaultStatsData;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return Users;
      case 'GraduationCap': return GraduationCap;
      case 'DollarSign': return DollarSign;
      case 'AlertTriangle': return AlertTriangle;
      default: return Users;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {data.map((stat, index) => {
        const Icon = getIcon(stat.icon);
        const colorClasses = {
          blue: 'bg-blue-500 text-blue-600 bg-blue-50',
          green: 'bg-green-500 text-green-600 bg-green-50',
          yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
          red: 'bg-red-500 text-red-600 bg-red-50'
        };

        return (
          <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 break-words">{stat.value}</p>
              </div>
              
              <div className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${colorClasses[stat.color].split(' ')[2]}`}>
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${colorClasses[stat.color].split(' ')[1]}`} />
              </div>
            </div>
            
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 ml-2">par rapport à la tranche précédente</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;