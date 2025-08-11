import React, { useState } from 'react';
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
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  BookOpen,
  User
} from 'lucide-react';
import AddStudentModal from './AddStudentModal';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'Masculin' | 'Féminin';
  nationality: string;
  birthPlace: string;
  religion?: string;
  bloodType?: string;
  motherTongue: string;
  fatherName: string;
  fatherPhone: string;
  fatherOccupation: string;
  motherName: string;
  motherPhone: string;
  motherOccupation: string;
  guardianType: string;
  numberOfSiblings: number;
  transportMode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  dateOfBirth: string;
  class: string;
  level: string;
  parentEmail: string;
  address: string;
  enrollmentDate: string;
  status: 'Actif' | 'Inactif' | 'Suspendu';
  paymentStatus: 'À jour' | 'En retard' | 'Partiel';
  outstandingAmount: number;
  totalFees: number;
  paidAmount: number;
  lastPayment?: string;
  paymentHistory: Array<{
    date: string;
    amount: number;
    description: string;
    method: string;
  }>;
}

const StudentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [students, setStudents] = useState<Student[]>([
    // ... (vos données d'étudiants restent inchangées)
  ]);

  const classes = ['Maternelle 1A', 'Maternelle 1B', 'CI A', 'CP1', 'CP2', 'CE1A', 'CE1B', 'CE2A', 'CE2B', 'CM1A', 'CM2A'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.motherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.fatherPhone.includes(searchTerm) ||
                         student.motherPhone.includes(searchTerm);
    const matchesClass = classFilter === 'all' || student.class === classFilter;
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

  const handleAddStudent = (studentData: any) => {
    const newStudent: Student = {
      id: (students.length + 1).toString(),
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      gender: studentData.gender,
      nationality: studentData.nationality,
      birthPlace: studentData.birthPlace,
      religion: studentData.religion,
      bloodType: studentData.bloodType,
      motherTongue: studentData.motherTongue,
      fatherName: studentData.fatherName,
      fatherPhone: studentData.fatherPhone,
      fatherOccupation: studentData.fatherOccupation,
      motherName: studentData.motherName,
      motherPhone: studentData.motherPhone,
      motherOccupation: studentData.motherOccupation,
      guardianType: studentData.guardianType,
      numberOfSiblings: studentData.numberOfSiblings,
      transportMode: studentData.transportMode,
      emergencyContactName: studentData.emergencyContactName,
      emergencyContactPhone: studentData.emergencyContactPhone,
      emergencyContactRelation: studentData.emergencyContactRelation,
      dateOfBirth: studentData.dateOfBirth,
      class: studentData.class,
      level: studentData.level,
      parentEmail: studentData.parentEmail,
      address: studentData.address,
      enrollmentDate: studentData.enrollmentDate,
      status: 'Actif',
      paymentStatus: studentData.initialPayment >= studentData.totalFees ? 'À jour' : 
                    studentData.initialPayment > 0 ? 'Partiel' : 'En retard',
      outstandingAmount: studentData.totalFees - studentData.initialPayment,
      totalFees: studentData.totalFees,
      paidAmount: studentData.initialPayment,
      lastPayment: studentData.initialPayment > 0 ? new Date().toISOString().split('T')[0] : undefined,
      paymentHistory: studentData.initialPayment > 0 ? [
        {
          date: new Date().toISOString().split('T')[0],
          amount: studentData.initialPayment,
          description: 'Paiement d\'inscription',
          method: studentData.paymentMethod
        }
      ] : []
    };
    
    setStudents(prev => [...prev, newStudent]);
    
    // Notification de succès (optionnel)
    console.log('Nouvel élève ajouté:', newStudent);
  };

  const StudentDetailModal = ({ student, onClose }: { student: Student; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">
                  {student.firstName[0]}{student.lastName[0]}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-gray-600">{student.class} • {student.level} • {student.gender}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getPaymentStatusColor(student.paymentStatus)}`}>
                  {student.paymentStatus}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Eye className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informations personnelles */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Personnelles</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">👤</span>
                    <span className="text-gray-700">{student.gender}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">
                      Né(e) le {new Date(student.dateOfBirth).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">🌍</span>
                    <span className="text-gray-700">{student.birthPlace}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">🏳️</span>
                    <span className="text-gray-700">Nationalité {student.nationality}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">🗣️</span>
                    <span className="text-gray-700">Langue: {student.motherTongue}</span>
                  </div>
                  {student.religion && (
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400">🕌</span>
                      <span className="text-gray-700">{student.religion}</span>
                    </div>
                  )}
                  {student.bloodType && (
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400">🩸</span>
                      <span className="text-gray-700">Groupe {student.bloodType}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">🚌</span>
                    <span className="text-gray-700">{student.transportMode}</span>
                  </div>
                  {student.numberOfSiblings > 0 && (
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400">👨‍👩‍👧‍👦</span>
                      <span className="text-gray-700">{student.numberOfSiblings} frère(s)/sœur(s)</span>
                    </div>
                  )}
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <span className="text-gray-700">{student.address}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Parent/Tuteur</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Type de tuteur:</span>
                    <span className="font-medium text-gray-800 ml-2">{student.guardianType}</span>
                  </div>
                  
                  {student.fatherName && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Père</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Nom:</strong> {student.fatherName}</p>
                        <p><strong>Téléphone:</strong> {student.fatherPhone}</p>
                        <p><strong>Profession:</strong> {student.fatherOccupation}</p>
                      </div>
                    </div>
                  )}
                  
                  {student.motherName && (
                    <div className="p-3 bg-pink-50 rounded-lg">
                      <h4 className="font-medium text-pink-800 mb-2">Mère</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Nom:</strong> {student.motherName}</p>
                        <p><strong>Téléphone:</strong> {student.motherPhone}</p>
                        <p><strong>Profession:</strong> {student.motherOccupation}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Contact d'Urgence</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Nom:</strong> {student.emergencyContactName}</p>
                      <p><strong>Téléphone:</strong> {student.emergencyContactPhone}</p>
                      <p><strong>Relation:</strong> {student.emergencyContactRelation}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Email principal:</span>
                    <span className="font-medium text-gray-800">{student.parentEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations financières */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Situation Financière</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total à payer:</span>
                      <span className="font-bold text-gray-800">{student.totalFees.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-600">Payé:</span>
                      <span className="font-bold text-green-600">{student.paidAmount.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-600">Reste à payer:</span>
                      <span className="font-bold text-red-600">{student.outstandingAmount.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Historique des Paiements</h4>
                    {student.paymentHistory.length > 0 ? (
                      student.paymentHistory.map((payment, index) => (
                        <div key={index} className="p-3 mb-2 bg-gray-50 rounded-lg">
                          <div className="flex justify-between">
                            <span className="font-medium">{payment.date}</span>
                            <span className="text-green-600 font-bold">{payment.amount.toLocaleString()} FCFA</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {payment.description} • {payment.method}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p>Aucun paiement enregistré</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Modifier
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <span>Enregistrer Paiement</span>
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
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Élèves</h1>
          <p className="text-gray-600">Inscriptions, suivi académique et paiements par tranches</p>
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
              <p className="text-2xl font-bold text-gray-800">{students.length}</p>
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
              <p className="text-2xl font-bold text-green-600">
                {students.filter(s => s.paymentStatus === 'À jour').length}
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
              <p className="text-sm text-gray-600">En Retard</p>
              <p className="text-2xl font-bold text-red-600">
                {students.filter(s => s.paymentStatus === 'En retard').length}
              </p>
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
              <p className="text-2xl font-bold text-yellow-600">
                {students.filter(s => s.paymentStatus === 'Partiel').length}
              </p>
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
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
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
          <h2 className="text-lg font-semibold text-gray-800">Liste des Élèves</h2>
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
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{student.firstName} {student.lastName}</p>
                        <p className="text-sm text-gray-500">
                          {student.gender} • {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()} ans
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {student.class}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-800">
                        {student.fatherName && student.motherName 
                          ? `${student.fatherName} / ${student.motherName}`
                          : student.fatherName || student.motherName || 'Non renseigné'
                        }
                      </p>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {student.fatherPhone || student.motherPhone || 'Non renseigné'}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(student.paymentStatus)}`}>
                        {student.paymentStatus}
                      </span>
                      <div className="text-sm text-gray-600">
                        {student.paidAmount.toLocaleString()}/{student.totalFees.toLocaleString()} FCFA
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-green-600 h-1 rounded-full"
                          style={{ width: `${(student.paidAmount / student.totalFees) * 100}%` }}
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
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        onAddStudent={handleAddStudent}
      />
    </div>
  );
};

export default StudentManagement;