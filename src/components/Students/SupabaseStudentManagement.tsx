import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader
} from 'lucide-react';
import { studentService } from '../../services/studentService';
import { levelService } from '../../services/levelService';
import AddStudentModal from './AddStudentModal';

const SupabaseStudentManagement: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    upToDate: 0,
    late: 0,
    partial: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsData, levelsData, statsData] = await Promise.all([
        studentService.getStudents(),
        levelService.getLevels(),
        studentService.getStudentStats()
      ]);
      
      setStudents(studentsData || []);
      setLevels(levelsData || []);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (studentData: any) => {
    try {
      // Trouver le niveau correspondant à la classe
      const level = levels.find(l => l.name === studentData.level);
      if (!level) {
        throw new Error('Niveau non trouvé');
      }

      // Créer l'élève avec les données adaptées
      const newStudentData = {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        gender: studentData.gender,
        dateOfBirth: studentData.dateOfBirth,
        birthPlace: studentData.birthPlace,
        nationality: studentData.nationality,
        motherTongue: studentData.motherTongue,
        religion: studentData.religion,
        bloodType: studentData.bloodType,
        allergies: studentData.allergies,
        medicalInfo: studentData.medicalInfo,
        previousSchool: studentData.previousSchool,
        fatherName: studentData.fatherName,
        fatherPhone: studentData.fatherPhone,
        fatherOccupation: studentData.fatherOccupation,
        motherName: studentData.motherName,
        motherPhone: studentData.motherPhone,
        motherOccupation: studentData.motherOccupation,
        guardianType: studentData.guardianType,
        numberOfSiblings: studentData.numberOfSiblings,
        parentEmail: studentData.parentEmail,
        address: studentData.address,
        emergencyContactName: studentData.emergencyContactName,
        emergencyContactPhone: studentData.emergencyContactPhone,
        emergencyContactRelation: studentData.emergencyContactRelation,
        classId: studentData.classId, // À adapter selon votre logique de classe
        enrollmentDate: studentData.enrollmentDate,
        totalFees: studentData.totalFees,
        initialPayment: studentData.initialPayment,
        transportMode: studentData.transportMode,
        notes: studentData.notes
      };

      await studentService.createStudent(newStudentData);
      await loadData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'élève:', error);
      alert('Erreur lors de l\'ajout de l\'élève');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
      try {
        await studentService.deleteStudent(id);
        await loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.father_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.mother_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.parent_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || student.classes?.name === classFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-50 text-green-700 border-green-200';
      case 'Inactif': return 'bg-red-50 text-red-700 border-red-200';
      case 'Suspendu': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'À jour': return 'bg-green-50 text-green-700';
      case 'En retard': return 'bg-red-50 text-red-700';
      case 'Partiel': return 'bg-yellow-50 text-yellow-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    return today.getFullYear() - birth.getFullYear();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-3">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Chargement des élèves...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Élèves</h1>
          <p className="text-gray-600">Inscriptions, suivi académique et paiements - Connecté à Supabase</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
          
          <button 
            onClick={() => setShowAddStudentModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvel Élève</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Élèves</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paiements à Jour</p>
              <p className="text-2xl font-bold text-green-600">{stats.upToDate}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Retard</p>
              <p className="text-2xl font-bold text-red-600">{stats.late}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paiements Partiels</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.partial}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom d'élève ou parent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select 
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les classes</option>
            {Array.from(new Set(students.map(s => s.classes?.name).filter(Boolean))).map(className => (
              <option key={className} value={className}>{className}</option>
            ))}
          </select>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="Actif">Actif</option>
            <option value="Inactif">Inactif</option>
            <option value="Suspendu">Suspendu</option>
          </select>
          
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filtres</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Liste des Élèves ({filteredStudents.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Élève</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent/Tuteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Situation Financière</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {student.first_name[0]}{student.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{student.first_name} {student.last_name}</p>
                        <p className="text-sm text-gray-500">
                          {student.gender} • {calculateAge(student.date_of_birth)} ans
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {student.classes?.name || 'Non assigné'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-800">
                        {student.father_name && student.mother_name 
                          ? `${student.father_name} / ${student.mother_name}`
                          : student.father_name || student.mother_name || 'Non renseigné'
                        }
                      </p>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {student.father_phone || student.mother_phone || 'Non renseigné'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{student.parent_email}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(student.payment_status)}`}>
                        {student.payment_status}
                      </span>
                      <div className="text-sm text-gray-600">
                        {(student.paid_amount || 0).toLocaleString()}/{student.total_fees.toLocaleString()} FCFA
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-green-600 h-1 rounded-full"
                          style={{ width: `${((student.paid_amount || 0) / student.total_fees) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedStudent(student)}
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
                        onClick={() => handleDeleteStudent(student.id)}
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

        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun élève trouvé</p>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        onAddStudent={handleAddStudent}
      />

      {/* Student Detail Modal - À implémenter */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedStudent.first_name} {selectedStudent.last_name}
                </h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Informations Personnelles</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Sexe:</strong> {selectedStudent.gender}</p>
                    <p><strong>Date de naissance:</strong> {new Date(selectedStudent.date_of_birth).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Lieu de naissance:</strong> {selectedStudent.birth_place}</p>
                    <p><strong>Nationalité:</strong> {selectedStudent.nationality}</p>
                    <p><strong>Langue maternelle:</strong> {selectedStudent.mother_tongue}</p>
                    {selectedStudent.religion && <p><strong>Religion:</strong> {selectedStudent.religion}</p>}
                    {selectedStudent.blood_type && <p><strong>Groupe sanguin:</strong> {selectedStudent.blood_type}</p>}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Informations Familiales</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Type de tuteur:</strong> {selectedStudent.guardian_type}</p>
                    {selectedStudent.father_name && (
                      <p><strong>Père:</strong> {selectedStudent.father_name} ({selectedStudent.father_occupation})</p>
                    )}
                    {selectedStudent.mother_name && (
                      <p><strong>Mère:</strong> {selectedStudent.mother_name} ({selectedStudent.mother_occupation})</p>
                    )}
                    <p><strong>Email:</strong> {selectedStudent.parent_email}</p>
                    <p><strong>Adresse:</strong> {selectedStudent.address}</p>
                    <p><strong>Contact d'urgence:</strong> {selectedStudent.emergency_contact_name} ({selectedStudent.emergency_contact_relation})</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseStudentManagement;