import React, { useState } from 'react';
import { X, Users, BookOpen, User, MapPin, Calendar, Edit, Save, Phone, Mail, Award, Clock, TrendingUp } from 'lucide-react';

interface ClassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: ClassData;
  onUpdateClass: (updatedClass: ClassData) => void;
}

interface ClassData {
  id: string;
  name: string;
  level: string;
  students: number;
  capacity: number;
  teacher: string;
  teacherId: string;
  subjects: string[];
  classroom?: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  parentPhone: string;
  parentEmail: string;
  enrollmentDate: string;
  paymentStatus: 'À jour' | 'En retard' | 'Partiel';
  lastGrade?: number;
  attendance: number;
}

const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  isOpen,
  onClose,
  classData,
  onUpdateClass
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'academic' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(classData);

  // Données d'exemple des élèves de la classe
  const [students] = useState<Student[]>([
    {
      id: '1',
      firstName: 'Kofi',
      lastName: 'Mensah',
      age: 11,
      parentPhone: '+223 70 11 22 33',
      parentEmail: 'mensah.parent@email.com',
      enrollmentDate: '2024-09-01',
      paymentStatus: 'À jour',
      lastGrade: 14.5,
      attendance: 95
    },
    {
      id: '2',
      firstName: 'Aminata',
      lastName: 'Traore',
      age: 10,
      parentPhone: '+223 75 44 55 66',
      parentEmail: 'traore.family@email.com',
      enrollmentDate: '2024-09-01',
      paymentStatus: 'Partiel',
      lastGrade: 16.0,
      attendance: 98
    },
    {
      id: '3',
      firstName: 'Ibrahim',
      lastName: 'Kone',
      age: 11,
      parentPhone: '+223 65 77 88 99',
      parentEmail: 'kone.ibrahim@email.com',
      enrollmentDate: '2024-09-01',
      paymentStatus: 'En retard',
      lastGrade: 12.5,
      attendance: 92
    },
    {
      id: '4',
      firstName: 'Fatoumata',
      lastName: 'Diallo',
      age: 10,
      parentPhone: '+223 78 99 00 11',
      parentEmail: 'diallo.fam@email.com',
      enrollmentDate: '2024-09-01',
      paymentStatus: 'À jour',
      lastGrade: 15.5,
      attendance: 96
    }
  ]);

  const handleSave = () => {
    onUpdateClass(editData);
    setIsEditing(false);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'À jour': return 'bg-green-50 text-green-700';
      case 'En retard': return 'bg-red-50 text-red-700';
      case 'Partiel': return 'bg-yellow-50 text-yellow-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return 'text-green-600';
    if (grade >= 14) return 'text-blue-600';
    if (grade >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const classStats = {
    averageAge: students.reduce((sum, s) => sum + s.age, 0) / students.length,
    averageGrade: students.filter(s => s.lastGrade).reduce((sum, s) => sum + (s.lastGrade || 0), 0) / students.filter(s => s.lastGrade).length,
    averageAttendance: students.reduce((sum, s) => sum + s.attendance, 0) / students.length,
    paymentUpToDate: students.filter(s => s.paymentStatus === 'À jour').length,
    paymentLate: students.filter(s => s.paymentStatus === 'En retard').length,
    paymentPartial: students.filter(s => s.paymentStatus === 'Partiel').length
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">
                  {classData.name.substring(0, 2)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{classData.name}</h2>
                <p className="text-gray-600">{classData.level} • {classData.students}/{classData.capacity} élèves</p>
                <p className="text-sm text-gray-500">Enseignant: {classData.teacher}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 mt-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Élèves ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('academic')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'academic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Académique
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Paramètres
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Vue d'ensemble */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Effectif</p>
                      <p className="text-2xl font-bold text-blue-800">{classData.students}/{classData.capacity}</p>
                    </div>
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(classData.students / classData.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Moyenne Classe</p>
                      <p className="text-2xl font-bold text-green-800">{classStats.averageGrade.toFixed(1)}/20</p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600">Assiduité</p>
                      <p className="text-2xl font-bold text-purple-800">{classStats.averageAttendance.toFixed(0)}%</p>
                    </div>
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600">Âge Moyen</p>
                      <p className="text-2xl font-bold text-orange-800">{classStats.averageAge.toFixed(1)} ans</p>
                    </div>
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Informations de la classe */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Générales</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Niveau:</span>
                      <span className="font-medium">{classData.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enseignant titulaire:</span>
                      <span className="font-medium">{classData.teacher}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salle de classe:</span>
                      <span className="font-medium">Salle 12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Matières enseignées:</span>
                      <span className="font-medium">{classData.subjects.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Situation Financière</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paiements à jour:</span>
                      <span className="font-medium text-green-600">{classStats.paymentUpToDate} élèves</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paiements en retard:</span>
                      <span className="font-medium text-red-600">{classStats.paymentLate} élèves</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paiements partiels:</span>
                      <span className="font-medium text-yellow-600">{classStats.paymentPartial} élèves</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taux de collecte:</span>
                      <span className="font-medium">{Math.round((classStats.paymentUpToDate / students.length) * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matières enseignées */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Matières du Programme</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {classData.subjects.map(subject => (
                    <div key={subject} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="font-medium text-blue-800">{subject}</p>
                      <p className="text-xs text-blue-600">Enseigné par {classData.teacher.split(' ')[1]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Liste des élèves */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Liste des Élèves</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Ajouter Élève
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Élève</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Parent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paiement</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière Note</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assiduité</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {student.firstName[0]}{student.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{student.firstName} {student.lastName}</p>
                              <p className="text-sm text-gray-500">{student.age} ans</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-600">{student.parentPhone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-600">{student.parentEmail}</span>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(student.paymentStatus)}`}>
                            {student.paymentStatus}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          {student.lastGrade ? (
                            <span className={`font-bold ${getGradeColor(student.lastGrade)}`}>
                              {student.lastGrade}/20
                            </span>
                          ) : (
                            <span className="text-gray-400">--</span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  student.attendance >= 95 ? 'bg-green-500' :
                                  student.attendance >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${student.attendance}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{student.attendance}%</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Voir Profil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Suivi académique */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Suivi Académique</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-800 mb-4">Performances par Matière</h4>
                  <div className="space-y-3">
                    {classData.subjects.map(subject => {
                      const randomGrade = 10 + Math.random() * 8; // Simulation
                      return (
                        <div key={subject} className="flex items-center justify-between">
                          <span className="text-gray-700">{subject}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  randomGrade >= 14 ? 'bg-green-500' :
                                  randomGrade >= 12 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${(randomGrade / 20) * 100}%` }}
                              ></div>
                            </div>
                            <span className={`font-medium ${getGradeColor(randomGrade)}`}>
                              {randomGrade.toFixed(1)}/20
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-800 mb-4">Actions Rapides</h4>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left">
                      Saisir des Notes
                    </button>
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-left">
                      Générer Bulletins
                    </button>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-left">
                      Voir Emploi du Temps
                    </button>
                    <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-left">
                      Conseil de Classe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paramètres */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Paramètres de la Classe</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>{isEditing ? 'Annuler' : 'Modifier'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la Classe
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editData.name : classData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacité Maximum
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="50"
                    value={isEditing ? editData.capacity : classData.capacity}
                    onChange={(e) => setEditData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 30 }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Sauvegarder</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditData(classData);
                    }}
                    className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailModal;