import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, User, MapPin, Plus, Edit, Trash2 } from 'lucide-react';

interface ClassScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: {
    name: string;
    level: string;
    teacher: string;
    subjects: string[];
  };
}

interface ScheduleItem {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  room: string;
}

const ClassScheduleModal: React.FC<ClassScheduleModalProps> = ({
  isOpen,
  onClose,
  classData
}) => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    {
      id: '1',
      day: 'Lundi',
      startTime: '08:00',
      endTime: '09:00',
      subject: 'Français',
      room: 'Salle 12'
    },
    {
      id: '2',
      day: 'Lundi',
      startTime: '09:00',
      endTime: '10:00',
      subject: 'Mathématiques',
      room: 'Salle 12'
    },
    {
      id: '3',
      day: 'Lundi',
      startTime: '10:30',
      endTime: '11:30',
      subject: 'Sciences',
      room: 'Salle 12'
    },
    {
      id: '4',
      day: 'Mardi',
      startTime: '08:00',
      endTime: '09:00',
      subject: 'Histoire-Géographie',
      room: 'Salle 12'
    },
    {
      id: '5',
      day: 'Mardi',
      startTime: '09:00',
      endTime: '10:00',
      subject: 'Français',
      room: 'Salle 12'
    }
  ]);

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    day: '',
    startTime: '',
    endTime: '',
    subject: '',
    room: 'Salle 12'
  });

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const timeSlots = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00'];

  const getScheduleForSlot = (day: string, timeSlot: string) => {
    return schedule.find(item => 
      item.day === day && 
      `${item.startTime}-${item.endTime}` === timeSlot
    );
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Français': 'bg-green-100 text-green-800 border-green-200',
      'Mathématiques': 'bg-blue-100 text-blue-800 border-blue-200',
      'Sciences': 'bg-purple-100 text-purple-800 border-purple-200',
      'Histoire-Géographie': 'bg-orange-100 text-orange-800 border-orange-200',
      'Éducation Civique': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Anglais': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const addCourse = () => {
    if (newCourse.day && newCourse.startTime && newCourse.endTime && newCourse.subject) {
      const course: ScheduleItem = {
        id: Date.now().toString(),
        ...newCourse
      };
      
      setSchedule(prev => [...prev, course]);
      setNewCourse({
        day: '',
        startTime: '',
        endTime: '',
        subject: '',
        room: 'Salle 12'
      });
      setShowAddCourse(false);
    }
  };

  const removeCourse = (courseId: string) => {
    setSchedule(prev => prev.filter(c => c.id !== courseId));
  };

  const totalHours = schedule.length;
  const subjectHours = schedule.reduce((acc, item) => {
    acc[item.subject] = (acc[item.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Emploi du Temps - {classData.name}</h2>
                <p className="text-gray-600">{classData.level} • Enseignant: {classData.teacher}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Heures/Semaine</p>
                  <p className="text-2xl font-bold text-blue-800">{totalHours}h</p>
                </div>
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Matières</p>
                  <p className="text-2xl font-bold text-green-800">{Object.keys(subjectHours).length}</p>
                </div>
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Enseignant</p>
                  <p className="text-lg font-bold text-purple-800">Unique</p>
                </div>
                <User className="h-6 w-6 text-purple-600" />
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">Salle</p>
                  <p className="text-lg font-bold text-orange-800">Salle 12</p>
                </div>
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Emploi du temps */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-medium text-gray-800">Planning Hebdomadaire</h3>
              <button
                onClick={() => setShowAddCourse(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter Cours</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">
                      Horaires
                    </th>
                    {days.map(day => (
                      <th key={day} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {timeSlots.map((timeSlot, timeIndex) => (
                    <tr key={timeIndex} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-700 bg-gray-50">
                        {timeSlot}
                      </td>
                      {days.map(day => {
                        const scheduleItem = getScheduleForSlot(day, timeSlot);
                        
                        return (
                          <td key={day} className="px-2 py-2 text-center">
                            {timeSlot === '12:00-14:00' ? (
                              <div className="h-20 flex items-center justify-center bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                                <span className="text-yellow-700 font-medium">Pause</span>
                              </div>
                            ) : scheduleItem ? (
                              <div className={`p-3 rounded-lg border-2 ${getSubjectColor(scheduleItem.subject)} relative group`}>
                                <div className="font-medium text-sm mb-1">{scheduleItem.subject}</div>
                                <div className="text-xs opacity-75 mb-1">{classData.teacher.split(' ')[1]}</div>
                                <div className="text-xs opacity-60 flex items-center justify-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {scheduleItem.room}
                                </div>
                                
                                {/* Actions sur hover */}
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => removeCourse(scheduleItem.id)}
                                    className="p-1 bg-white rounded shadow-sm hover:bg-red-50"
                                  >
                                    <Trash2 className="h-3 w-3 text-red-600" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setShowAddCourse(true)}
                                className="w-full h-20 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors flex items-center justify-center group"
                              >
                                <Plus className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Répartition des matières */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Répartition Horaire par Matière</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(subjectHours).map(([subject, hours]) => (
                <div key={subject} className={`p-4 rounded-lg border-2 ${getSubjectColor(subject)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{subject}</span>
                    <span className="text-sm font-bold">{hours}h</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                    <div 
                      className="bg-current h-2 rounded-full opacity-60"
                      style={{ width: `${(hours / totalHours) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1 opacity-75">
                    {Math.round((hours / totalHours) * 100)}% du temps
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Modal d'ajout de cours */}
          {showAddCourse && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
              <div className="bg-white rounded-xl max-w-md w-full">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800">Ajouter un Cours</h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jour</label>
                    <select
                      value={newCourse.day}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, day: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner un jour</option>
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Début</label>
                      <input
                        type="time"
                        value={newCourse.startTime}
                        onChange={(e) => setNewCourse(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fin</label>
                      <input
                        type="time"
                        value={newCourse.endTime}
                        onChange={(e) => setNewCourse(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Matière</label>
                    <select
                      value={newCourse.subject}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner une matière</option>
                      {classData.subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salle</label>
                    <input
                      type="text"
                      value={newCourse.room}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, room: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowAddCourse(false)}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={addCourse}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Système d'enseignant unique - {classData.teacher} enseigne toutes les matières
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Exporter PDF
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassScheduleModal;