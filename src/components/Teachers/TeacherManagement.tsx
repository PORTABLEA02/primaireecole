import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Calendar, 
  Phone, 
  Mail, 
  BookOpen, 
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Award,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import AddTeacherModal from './AddTeacherModal';
import { useAcademicYear } from '../../contexts/AcademicYearContext';

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subjects: string[];
  assignedClass: string | null;
  status: 'Actif' | 'Inactif' | 'Congé';
  experience: string;
  qualification: string;
  hireDate: string;
  salary: number;
  address: string;
  emergencyContact: string;
  specializations: string[];
  performanceRating: number;
}

interface Absence {
  id: string;
  teacherId: string;
  teacher: string;
  date: string;
  endDate?: string;
  reason: string;
  status: 'En attente' | 'Approuvée' | 'Refusée';
  substitute: string;
  documents?: string[];
  comments?: string;
}

const TeacherManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'absences' | 'performance'>('list');
  const { currentAcademicYear } = useAcademicYear();
  const [teachers, setTeachers] = useState<Teacher[]>([

    {
      id: '1',
      firstName: 'Moussa',
      lastName: 'Traore',
      email: 'mtraore@ecoletech.edu',
      phone: '+223 70 11 22 33',
      subjects: ['Français', 'Mathématiques', 'Éveil Scientifique', 'Éducation Civique'],
      assignedClass: 'CI A',
      status: 'Actif',
      experience: '8 ans',
      qualification: 'Licence en Pédagogie',
      hireDate: '2016-09-01',
      salary: 180000,
      address: 'Quartier Hippodrome, Bamako',
      emergencyContact: '+223 65 44 33 22',
      specializations: ['Mathématiques', 'Sciences'],
      performanceRating: 4.5
    },
    {
      id: '2',
      firstName: 'Aminata',
      lastName: 'Kone',
      email: 'akone@ecoletech.edu',
      phone: '+223 75 44 55 66',
      subjects: ['Éveil', 'Langage', 'Graphisme', 'Jeux éducatifs'],
      assignedClass: 'Maternelle 1A',
      status: 'Actif',
      experience: '12 ans',
      qualification: 'CAP Petite Enfance',
      hireDate: '2012-09-01',
      salary: 160000,
      address: 'Quartier ACI 2000, Bamako',
      emergencyContact: '+223 70 55 44 33',
      specializations: ['Petite Enfance', 'Psychologie Enfantine'],
      performanceRating: 4.8
    },
    {
      id: '3',
      firstName: 'Ibrahim',
      lastName: 'Sidibe',
      email: 'isidibe@ecoletech.edu',
      phone: '+223 65 77 88 99',
      subjects: ['Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences', 'Éducation Civique'],
      assignedClass: 'CE2B',
      status: 'Actif',
      experience: '5 ans',
      qualification: 'Licence en Lettres Modernes',
      hireDate: '2019-09-01',
      salary: 170000,
      address: 'Quartier Magnambougou, Bamako',
      emergencyContact: '+223 76 88 99 00',
      specializations: ['Littérature', 'Histoire'],
      performanceRating: 4.2
    },
    {
      id: '4',
      firstName: 'Fatoumata',
      lastName: 'Coulibaly',
      email: 'fcoulibaly@ecoletech.edu',
      phone: '+223 78 99 00 11',
      subjects: [],
      assignedClass: null,
      status: 'Actif',
      experience: '3 ans',
      qualification: 'Licence en Sciences de l\'Éducation',
      hireDate: '2021-09-01',
      salary: 150000,
      address: 'Quartier Lafiabougou, Bamako',
      emergencyContact: '+223 65 11 22 33',
      specializations: ['Pédagogie', 'Psychologie'],
      performanceRating: 4.0
    },
    {
      id: '5',
      firstName: 'Sekou',
      lastName: 'Sangare',
      email: 'ssangare@ecoletech.edu',
      phone: '+223 70 33 44 55',
      subjects: ['Français', 'Mathématiques', 'Sciences', 'Histoire-Géographie', 'Éducation Civique'],
      assignedClass: 'CM1A',
      status: 'Congé',
      experience: '15 ans',
      qualification: 'Maîtrise en Sciences Naturelles',
      hireDate: '2009-09-01',
      salary: 200000,
      address: 'Quartier Badalabougou, Bamako',
      emergencyContact: '+223 75 66 77 88',
      specializations: ['Sciences Naturelles', 'Environnement'],
      performanceRating: 4.7
    }
  ]);

  // Classes disponibles (sans enseignant assigné)
  const availableClasses = [
    'Maternelle 2A',
    'Maternelle 2B', 
    'CI B',
    'CP3',
    'CE1C',
    'CE2C',
    'CM1B',
    'CM2B'
  ];

  const absences: Absence[] = [
    {
      id: '1',
      teacherId: '1',
      teacher: 'M. Moussa Traore',
      date: '2024-10-15',
      endDate: '2024-10-17',
      reason: 'Congé maladie',
      status: 'Approuvée',
      substitute: 'Mlle Fatoumata Coulibaly',
      documents: ['certificat_medical.pdf'],
      comments: 'Grippe saisonnière, repos recommandé'
    },
    {
      id: '2',
      teacherId: '2',
      teacher: 'Mme Aminata Kone',
      date: '2024-10-12',
      endDate: '2024-10-12',
      reason: 'Formation continue',
      status: 'Approuvée',
      substitute: 'M. Sekou Sangare',
      comments: 'Formation sur les nouvelles méthodes pédagogiques'
    },
    {
      id: '3',
      teacherId: '3',
      teacher: 'M. Ibrahim Sidibe',
      date: '2024-10-10',
      reason: 'Affaire personnelle',
      status: 'En attente',
      substitute: '-',
      comments: 'Demande urgente'
    }
  ];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-50 text-green-700 border-green-200';
      case 'Inactif': return 'bg-red-50 text-red-700 border-red-200';
      case 'Congé': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAddTeacher = (teacherData: any) => {
    const newTeacher: Teacher = {
      id: (teachers.length + 1).toString(),
      firstName: teacherData.firstName,
      lastName: teacherData.lastName,
      email: teacherData.email,
      phone: teacherData.phone,
      subjects: teacherData.subjects,
      assignedClass: teacherData.assignedClass,
      status: 'Actif',
      experience: teacherData.experience,
      qualification: teacherData.qualification,
      hireDate: teacherData.hireDate,
      salary: teacherData.salary,
      address: teacherData.address,
      emergencyContact: teacherData.emergencyContact,
      specializations: teacherData.specializations,
      performanceRating: 4.0 // Note par défaut pour un nouvel enseignant
      academicYear: currentAcademicYear
    };
    
    setTeachers(prev => [...prev, newTeacher]);
    
    // Notification de succès (optionnel)
    console.log('Nouvel enseignant ajouté:', newTeacher);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const TeacherDetailModal = ({ teacher, onClose }: { teacher: Teacher; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">
                  {teacher.firstName[0]}{teacher.lastName[0]}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {teacher.firstName} {teacher.lastName}
                </h2>
                <p className="text-gray-600">{teacher.qualification}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {renderStars(teacher.performanceRating)}
                  <span className={`font-medium ${getPerformanceColor(teacher.performanceRating)}`}>
                    {teacher.performanceRating}/5
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informations personnelles */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Personnelles</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{teacher.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{teacher.phone}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-gray-400 mt-1">🏠</span>
                    <span className="text-gray-700">{teacher.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">🚨</span>
                    <span className="text-gray-700">{teacher.emergencyContact}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Spécialisations</h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.specializations.map((spec, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Professionnelles</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(teacher.status)}`}>
                      {teacher.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Classe assignée:</span>
                    <span className="font-medium text-gray-800">
                      {teacher.assignedClass || 'Aucune'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expérience:</span>
                    <span className="font-medium text-gray-800">{teacher.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date d'embauche:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(teacher.hireDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salaire:</span>
                    <span className="font-medium text-gray-800">
                      {teacher.salary.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Matières Enseignées</h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects.length > 0 ? (
                    teacher.subjects.map((subject, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {subject}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">Aucune matière assignée</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Modifier
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Assigner Classe
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Enseignants</h1>
          <p className="text-gray-600">Personnel enseignant, affectations et suivi des performances</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Planning</span>
          </button>
          
          <button 
            onClick={() => setShowAddTeacherModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvel Enseignant</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Enseignants</p>
              <p className="text-2xl font-bold text-gray-800">{teachers.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-green-600">
                {teachers.filter(t => t.status === 'Actif').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avec Classe</p>
              <p className="text-2xl font-bold text-blue-600">
                {teachers.filter(t => t.assignedClass).length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-orange-600">
                {teachers.filter(t => !t.assignedClass && t.status === 'Actif').length}
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Moyenne Perf.</p>
              <p className="text-2xl font-bold text-purple-600">
                {(teachers.reduce((sum, t) => sum + t.performanceRating, 0) / teachers.length).toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Liste des Enseignants
            </button>
            <button
              onClick={() => setActiveTab('absences')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'absences'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Absences ({absences.filter(a => a.status === 'En attente').length})
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'performance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Performances
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'list' && (
            <>
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email ou téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="Congé">En congé</option>
                </select>
                
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filtres</span>
                </button>
              </div>

              {/* Teachers Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enseignant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe Assignée</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expérience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTeachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {teacher.firstName[0]}{teacher.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{teacher.firstName} {teacher.lastName}</p>
                              <p className="text-sm text-gray-500">{teacher.qualification}</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-600">{teacher.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-600">{teacher.email}</span>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          {teacher.assignedClass ? (
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                              {teacher.assignedClass}
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-sm">
                              Disponible
                            </span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 text-gray-600">{teacher.experience}</td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {renderStars(teacher.performanceRating)}
                            <span className={`font-medium ${getPerformanceColor(teacher.performanceRating)}`}>
                              {teacher.performanceRating}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(teacher.status)}`}>
                            {teacher.status}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => setSelectedTeacher(teacher)}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                              title="Voir détails"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'absences' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Gestion des Absences</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Nouvelle Demande
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enseignant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raison</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remplaçant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {absences.map((absence) => (
                      <tr key={absence.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{absence.teacher}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {absence.endDate ? 
                            `${new Date(absence.date).toLocaleDateString('fr-FR')} - ${new Date(absence.endDate).toLocaleDateString('fr-FR')}` :
                            new Date(absence.date).toLocaleDateString('fr-FR')
                          }
                        </td>
                        <td className="px-6 py-4 text-gray-600">{absence.reason}</td>
                        <td className="px-6 py-4 text-gray-600">{absence.substitute}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            absence.status === 'Approuvée' 
                              ? 'bg-green-50 text-green-700'
                              : absence.status === 'Refusée'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-yellow-50 text-yellow-700'
                          }`}>
                            {absence.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {absence.status === 'En attente' && (
                            <div className="flex items-center space-x-2">
                              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                                Approuver
                              </button>
                              <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                                Refuser
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Évaluation des Performances</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {teacher.firstName[0]}{teacher.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{teacher.firstName} {teacher.lastName}</p>
                        <p className="text-sm text-gray-500">{teacher.assignedClass || 'Disponible'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Performance Globale</span>
                        <div className="flex items-center space-x-2">
                          {renderStars(teacher.performanceRating)}
                          <span className={`font-medium ${getPerformanceColor(teacher.performanceRating)}`}>
                            {teacher.performanceRating}/5
                          </span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            teacher.performanceRating >= 4.5 ? 'bg-green-500' :
                            teacher.performanceRating >= 4.0 ? 'bg-blue-500' :
                            teacher.performanceRating >= 3.5 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(teacher.performanceRating / 5) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Expérience: {teacher.experience} • Salaire: {teacher.salary.toLocaleString()} FCFA
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Teacher Detail Modal */}
      {selectedTeacher && (
        <TeacherDetailModal 
          teacher={selectedTeacher} 
          onClose={() => setSelectedTeacher(null)} 
        />
      )}

      {/* Add Teacher Modal */}
      <AddTeacherModal
        isOpen={showAddTeacherModal}
        onClose={() => setShowAddTeacherModal(false)}
        onAddTeacher={handleAddTeacher}
        availableClasses={availableClasses}
      />
    </div>
  );
};

export default TeacherManagement;