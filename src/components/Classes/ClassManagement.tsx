import React from 'react';
import { Plus, Users, Calendar, Settings } from 'lucide-react';
import AddClassModal from './AddClassModal';
import TeacherAssignmentModal from './TeacherAssignmentModal';
import ClassDetailModal from './ClassDetailModal';
import ClassScheduleModal from './ClassScheduleModal';
import ChangeTeacherModal from './ChangeTeacherModal';

const ClassManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = React.useState(false);
  const [showDetailModal, setShowDetailModal] = React.useState(false);
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [showChangeTeacherModal, setShowChangeTeacherModal] = React.useState(false);
  const [selectedClass, setSelectedClass] = React.useState<any>(null);
  const [classes, setClasses] = React.useState([
    { 
      id: '1',
      name: 'Maternelle 1A', 
      level: 'Maternelle', 
      students: 25, 
      capacity: 30, 
      teacher: 'Mme Kone',
      teacherId: 'kone',
      subjects: ['Éveil', 'Langage', 'Graphisme', 'Jeux éducatifs']
    },
    { 
      id: '2',
      name: 'Maternelle 1B', 
      level: 'Maternelle', 
      students: 28, 
      capacity: 30, 
      teacher: 'Mme Diallo',
      teacherId: 'diallo',
      subjects: ['Éveil', 'Langage', 'Graphisme', 'Jeux éducatifs']
    },
    { 
      id: '3',
      name: 'CI A', 
      level: 'CI', 
      students: 32, 
      capacity: 35, 
      teacher: 'M. Traore',
      teacherId: 'traore',
      subjects: ['Français', 'Mathématiques', 'Éveil Scientifique', 'Éducation Civique']
    },
    { 
      id: '4',
      name: 'CP1', 
      level: 'CP', 
      students: 30, 
      capacity: 35, 
      teacher: 'Mlle Coulibaly',
      teacherId: 'coulibaly',
      subjects: ['Français', 'Mathématiques', 'Éveil Scientifique', 'Éducation Civique', 'Dessin']
    },
    { 
      id: '5',
      name: 'CP2', 
      level: 'CP', 
      students: 29, 
      capacity: 35, 
      teacher: 'M. Sangare',
      teacherId: 'sangare',
      subjects: ['Français', 'Mathématiques', 'Éveil Scientifique', 'Éducation Civique', 'Dessin']
    },
    { 
      id: '6',
      name: 'CE1A', 
      level: 'CE1', 
      students: 35, 
      capacity: 40, 
      teacher: 'Mme Toure',
      teacherId: 'toure',
      subjects: ['Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences', 'Éducation Civique']
    },
    { 
      id: '7',
      name: 'CE2B', 
      level: 'CE2', 
      students: 38, 
      capacity: 40, 
      teacher: 'M. Sidibe',
      teacherId: 'sidibe',
      subjects: ['Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences', 'Éducation Civique']
    },
    { 
      id: '8',
      name: 'CM2A', 
      level: 'CM2', 
      students: 42, 
      capacity: 45, 
      teacher: 'M. Ouattara',
      teacherId: 'ouattara',
      subjects: ['Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences', 'Éducation Civique', 'Anglais']
    }
  ]);

  // Liste des enseignants disponibles (ceux qui n'ont pas encore de classe assignée)
  const availableTeachers = [
    { id: 'new-teacher-1', name: 'M. Bakary Diarra', isAvailable: true },
    { id: 'new-teacher-2', name: 'Mme Salimata Keita', isAvailable: true },
    { id: 'new-teacher-3', name: 'M. Abdoulaye Cisse', isAvailable: true },
    { id: 'kone', name: 'Mme Kone', isAvailable: false },
    { id: 'traore', name: 'M. Traore', isAvailable: false },
    { id: 'coulibaly', name: 'Mlle Coulibaly', isAvailable: false }
  ];
  const levels = [
    { name: 'Maternelle', classes: 4, students: 106, color: 'purple' },
    { name: 'CI', classes: 2, students: 64, color: 'blue' },
    { name: 'CP', classes: 4, students: 118, color: 'green' },
    { name: 'CE1', classes: 3, students: 105, color: 'yellow' },
    { name: 'CE2', classes: 3, students: 114, color: 'orange' },
    { name: 'CM1', classes: 3, students: 126, color: 'red' },
    { name: 'CM2', classes: 2, students: 84, color: 'indigo' }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      purple: 'bg-purple-50 text-purple-700',
      blue: 'bg-blue-50 text-blue-700',
      green: 'bg-green-50 text-green-700',
      yellow: 'bg-yellow-50 text-yellow-700',
      orange: 'bg-orange-50 text-orange-700',
      red: 'bg-red-50 text-red-700',
      indigo: 'bg-indigo-50 text-indigo-700'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const handleAddClass = (classData: any) => {
    const newClass = {
      id: (classes.length + 1).toString(),
      name: classData.name,
      level: classData.level,
      students: 0, // Nouvelle classe commence avec 0 élèves
      capacity: classData.capacity,
      teacher: classData.teacherName,
      teacherId: classData.teacherId,
      subjects: classData.subjects,
      classroom: classData.classroom
    };
    
    setClasses(prev => [...prev, newClass]);
    
    // Afficher une notification de succès (optionnel)
    console.log('Nouvelle classe créée:', newClass);
  };

  const handleTeacherAssignment = (assignments: any[]) => {
    // Ici vous pouvez implémenter la logique de sauvegarde des affectations
    console.log('Affectations d\'enseignants:', assignments);
    
    // Simulation de mise à jour des classes
    assignments.forEach(assignment => {
      console.log(`${assignment.teacherName} assigné à ${assignment.className}`);
    });
    
    // Notification de succès
    alert(`${assignments.length} affectation(s) enregistrée(s) avec succès !`);
  };

  const handleManageClass = (classItem: any) => {
    setSelectedClass(classItem);
    setShowDetailModal(true);
  };

  const handleViewSchedule = (classItem: any) => {
    setSelectedClass(classItem);
    setShowScheduleModal(true);
  };

  const handleChangeTeacher = (classItem: any) => {
    setSelectedClass(classItem);
    setShowChangeTeacherModal(true);
  };

  const handleUpdateClass = (updatedClass: any) => {
    setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
  };

  const handleTeacherChange = (classId: string, newTeacherId: string, newTeacherName: string) => {
    setClasses(prev => prev.map(c => 
      c.id === classId 
        ? { ...c, teacherId: newTeacherId, teacher: newTeacherName }
        : c
    ));
    
    // Notification de succès
    alert(`Enseignant changé avec succès pour ${selectedClass?.name} !`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gestion des Classes</h1>
          <p className="text-sm sm:text-base text-gray-600">Organisation des niveaux, classes et emplois du temps</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base">
            <Calendar className="h-4 w-4" />
            <span>Emplois du Temps</span>
          </button>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle Classe</span>
          </button>
        </div>
      </div>

      {/* Levels Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4">
        {levels.map((level, index) => (
          <div key={index} className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getColorClasses(level.color)}`}>
                {level.name}
              </span>
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Classes</span>
                <span className="font-medium text-gray-800">{level.classes}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Élèves</span>
                <span className="font-medium text-gray-800">{level.students}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Liste des Classes</h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-gray-500">Total: {classes.length} classes</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Niveau</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enseignant Titulaire</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effectif</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Taux de Remplissage</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {classes.map((classItem, index) => {
                const fillRate = (classItem.students / classItem.capacity) * 100;
                
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-xs sm:text-sm">
                            {classItem.name.substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-medium text-gray-800">{classItem.name}</p>
                          <p className="text-xs text-gray-500">
                            {classItem.subjects.length} matières
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-3 sm:px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {classItem.level}
                      </span>
                    </td>
                    
                    <td className="px-3 sm:px-6 py-4">
                      <div>
                        <p className="text-sm sm:text-base font-medium text-gray-800">{classItem.teacher}</p>
                        <p className="text-xs text-gray-500">Enseignant unique</p>
                      </div>
                    </td>
                    
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                        <span className="text-sm sm:text-base text-gray-800">
                          {classItem.students}/{classItem.capacity}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              fillRate >= 90 ? 'bg-red-500' : 
                              fillRate >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${fillRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 w-12">
                          {Math.round(fillRate)}%
                        </span>
                      </div>
                    </td>
                    
                 <td className="px-3 sm:px-6 py-4">
  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
    <button 
      onClick={() => handleManageClass(classItem)}
      className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium"
    >
      Gérer Classe
    </button>
    <span className="text-gray-300 hidden sm:inline">|</span>
    <button 
      onClick={() => handleViewSchedule(classItem)}
      className="text-green-600 hover:text-green-800 text-xs sm:text-sm font-medium"
    >
      Planning
    </button>
    <span className="text-gray-300 hidden sm:inline">|</span>
    <button 
      onClick={() => handleChangeTeacher(classItem)}
      className="text-purple-600 hover:text-purple-800 text-xs sm:text-sm font-medium"
    >
      Changer Enseignant
    </button>
  </div>
</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Assignment Modal Trigger */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Affectation des Enseignants</h3>
            <p className="text-sm sm:text-base text-gray-600">Système d'enseignant unique - Un enseignant par classe pour toutes les matières</p>
          </div>
          <button 
            onClick={() => setShowAssignmentModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            Gérer les Affectations
          </button>
        </div>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-100 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-600">Classes sans enseignant</p>
            <p className="text-xl sm:text-2xl font-bold text-red-600">2</p>
          </div>
          <div className="p-4 border border-gray-100 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-600">Enseignants disponibles</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">5</p>
          </div>
          <div className="p-4 border border-gray-100 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-600">Changements ce mois</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">1</p>
          </div>
        </div>
      </div>

      {/* Add Class Modal */}
      <AddClassModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddClass={handleAddClass}
        availableTeachers={availableTeachers}
      />

      {/* Teacher Assignment Modal */}
      <TeacherAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        onAssignTeacher={handleTeacherAssignment}
      />

      {/* Class Detail Modal */}
      {selectedClass && (
        <ClassDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedClass(null);
          }}
          classData={selectedClass}
          onUpdateClass={handleUpdateClass}
        />
      )}

      {/* Class Schedule Modal */}
      {selectedClass && (
        <ClassScheduleModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedClass(null);
          }}
          classData={selectedClass}
        />
      )}

      {/* Change Teacher Modal */}
      {selectedClass && (
        <ChangeTeacherModal
          isOpen={showChangeTeacherModal}
          onClose={() => {
            setShowChangeTeacherModal(false);
            setSelectedClass(null);
          }}
          classData={selectedClass}
          onChangeTeacher={handleTeacherChange}
        />
      )}
    </div>
  );
};

export default ClassManagement;