import React, { useState } from 'react';
import { X, DollarSign, User, Calendar, CreditCard, Smartphone, Building, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { useAcademicYear } from '../../contexts/AcademicYearContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPayment: (paymentData: PaymentData) => void;
}

interface Student {
  id: string;
  name: string;
  class: string;
  level: string;
  outstandingAmount: number;
  lastPayment?: string;
  parentPhone?: string;
}

interface PaymentData {
  studentId: string;
  studentName: string;
  studentClass: string;
  amount: number;
  method: 'Espèces' | 'Mobile Money' | 'Virement Bancaire';
  type: 'Inscription' | 'Mensualité' | 'Cantine' | 'Transport' | 'Fournitures' | 'Autre';
  month?: string;
  reference?: string;
  mobileNumber?: string;
  bankDetails?: string;
  notes?: string;
  date: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onAddPayment }) => {
  const [step, setStep] = useState<'student' | 'payment' | 'confirmation'>('student');
  const [searchTerm, setSearchTerm] = useState('');
  const { currentAcademicYear } = useAcademicYear();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [paymentData, setPaymentData] = useState<Partial<PaymentData>>({
    amount: 0,
    method: 'Espèces',
    type: 'Mensualité',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Données d'exemple des élèves
  const students: Student[] = [
    {
      id: '1',
      name: 'Kofi Mensah',
      class: 'CM2A',
      level: 'CM2',
      outstandingAmount: 45000,
      lastPayment: '2024-09-15',
      parentPhone: '+223 70 11 22 33'
    },
    {
      id: '2',
      name: 'Fatima Diallo',
      class: 'CE1B',
      level: 'CE1',
      outstandingAmount: 40000,
      lastPayment: '2024-10-01',
      parentPhone: '+223 75 44 55 66'
    },
    {
      id: '3',
      name: 'Amadou Kone',
      class: 'CP2',
      level: 'CP',
      outstandingAmount: 35000,
      lastPayment: '2024-08-30',
      parentPhone: '+223 65 77 88 99'
    },
    {
      id: '4',
      name: 'Aissata Ba',
      class: 'CE2A',
      level: 'CE2',
      outstandingAmount: 42000,
      lastPayment: '2024-09-20',
      parentPhone: '+223 78 99 00 11'
    },
    {
      id: '5',
      name: 'Ibrahim Traore',
      class: 'CM1A',
      level: 'CM1',
      outstandingAmount: 0,
      lastPayment: '2024-10-10',
      parentPhone: '+223 70 33 44 55'
    }
  ];

  const paymentTypes = [
    { value: 'Inscription', label: 'Frais d\'inscription', amount: 50000 },
    { value: 'Scolarité', label: 'Paiement de scolarité (tranche)', amount: 0 },
    { value: 'Cantine', label: 'Frais de cantine', amount: 25000 },
    { value: 'Transport', label: 'Frais de transport', amount: 15000 },
    { value: 'Fournitures', label: 'Fournitures scolaires', amount: 20000 },
    { value: 'Autre', label: 'Autre paiement', amount: 0 }
  ];

  // Frais de scolarité annuels par niveau
  const scolariteAnnuelle = {
    'Maternelle': 300000,
    'CI': 350000,
    'CP': 350000,
    'CE1': 400000,
    'CE2': 400000,
    'CM1': 450000,
    'CM2': 450000
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedStudent) {
      newErrors.student = 'Veuillez sélectionner un élève';
    }

    if (!paymentData.amount || paymentData.amount <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }

    if (paymentData.method === 'Mobile Money' && !paymentData.mobileNumber) {
      newErrors.mobileNumber = 'Numéro de téléphone requis pour Mobile Money';
    }

    if (paymentData.method === 'Virement Bancaire' && !paymentData.bankDetails) {
      newErrors.bankDetails = 'Détails bancaires requis pour le virement';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setPaymentData(prev => ({
      ...prev,
      studentId: student.id,
      studentName: student.name,
      studentClass: student.class
    }));
    setStep('payment');
  };

  const handlePaymentTypeChange = (type: string) => {
    const paymentType = paymentTypes.find(pt => pt.value === type);
    if (type === 'Scolarité') {
      // Pour la scolarité, on ne prédéfinit pas le montant
      setPaymentData(prev => ({
        ...prev,
        type: type as PaymentData['type'],
        amount: 0
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        type: type as PaymentData['type'],
        amount: paymentType?.amount || 0
      }));
    }
  };

  const handleSubmit = () => {
    if (validatePayment() && selectedStudent) {
      const completePaymentData: PaymentData = {
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        studentClass: selectedStudent.class,
        amount: paymentData.amount!,
        method: paymentData.method!,
        type: paymentData.type!,
        date: paymentData.date!,
        month: paymentData.month,
        reference: paymentData.reference,
        mobileNumber: paymentData.mobileNumber,
        bankDetails: paymentData.bankDetails,
        notes: paymentData.notes
      };

      onAddPayment(completePaymentData);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep('student');
    setSelectedStudent(null);
    setPaymentData({
      amount: 0,
      method: 'Espèces',
      type: 'Mensualité',
      academicYear: currentAcademicYear,
      date: new Date().toISOString().split('T')[0]
    });
    setSearchTerm('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Nouveau Paiement</h2>
                <p className="text-gray-600">
                  {step === 'student' && 'Sélectionner un élève'}
                  {step === 'payment' && 'Détails du paiement'}
                  {step === 'confirmation' && 'Confirmation'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mt-6 space-x-4">
            <div className={`flex items-center space-x-2 ${step === 'student' ? 'text-blue-600' : step === 'payment' || step === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'student' ? 'bg-blue-100' : step === 'payment' || step === 'confirmation' ? 'bg-green-100' : 'bg-gray-100'}`}>
                1
              </div>
              <span className="text-sm font-medium">Élève</span>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-blue-600' : step === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'payment' ? 'bg-blue-100' : step === 'confirmation' ? 'bg-green-100' : 'bg-gray-100'}`}>
                2
              </div>
              <span className="text-sm font-medium">Paiement</span>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step === 'confirmation' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'confirmation' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                3
              </div>
              <span className="text-sm font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Student Selection */}
          {step === 'student' && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un élève par nom ou classe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleStudentSelect(student)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.class} • {student.level}</p>
                          {student.parentPhone && (
                            <p className="text-xs text-gray-500">📱 {student.parentPhone}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {student.outstandingAmount > 0 ? (
                          <div>
                            <p className="text-lg font-bold text-red-600">
                              {student.outstandingAmount.toLocaleString()} FCFA
                            </p>
                            <p className="text-xs text-red-500">Montant dû</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-lg font-bold text-green-600">À jour</p>
                            <p className="text-xs text-green-500">Aucun impayé</p>
                          </div>
                        )}
                        {student.lastPayment && (
                          <p className="text-xs text-gray-400 mt-1">
                            Dernier: {new Date(student.lastPayment).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Payment Details */}
          {step === 'payment' && selectedStudent && (
            <div className="space-y-6">
              {/* Selected Student Info */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800">{selectedStudent.name}</h3>
                    <p className="text-sm text-blue-600">{selectedStudent.class} • {selectedStudent.level}</p>
                  </div>
                  <button
                    onClick={() => setStep('student')}
                    className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Changer
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de Paiement *
                  </label>
                  <select
                    value={paymentData.type}
                    onChange={(e) => handlePaymentTypeChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {paymentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label} {type.amount > 0 && `(${type.amount.toLocaleString()} FCFA)`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant (FCFA) *
                  </label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.amount ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>

                {/* Month (for Mensualité) */}
                {paymentData.type === 'Scolarité' && (
                  <div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">Information Scolarité</h4>
                      {selectedStudent && (
                        <div className="space-y-2 text-sm text-blue-700">
                          <p><strong>Classe:</strong> {selectedStudent.class}</p>
                          <p><strong>Frais annuels:</strong> {scolariteAnnuelle[selectedStudent.level as keyof typeof scolariteAnnuelle]?.toLocaleString() || 'Non défini'} FCFA</p>
                          <p><strong>Déjà payé:</strong> {(selectedStudent.outstandingAmount > 0 ? 
                            (scolariteAnnuelle[selectedStudent.level as keyof typeof scolariteAnnuelle] - selectedStudent.outstandingAmount) : 
                            scolariteAnnuelle[selectedStudent.level as keyof typeof scolariteAnnuelle]
                          )?.toLocaleString()} FCFA</p>
                          <p><strong>Reste à payer:</strong> {selectedStudent.outstandingAmount.toLocaleString()} FCFA</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description de la tranche (optionnel)
                      </label>
                      <input
                        type="text"
                        value={paymentData.month || ''}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, month: e.target.value }))}
                        placeholder="Ex: 1ère tranche, Paiement partiel octobre..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Payment Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de Paiement *
                  </label>
                  <input
                    type="date"
                    value={paymentData.date}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Méthode de Paiement *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'Espèces', label: 'Espèces', icon: DollarSign, color: 'green' },
                    { value: 'Mobile Money', label: 'Mobile Money', icon: Smartphone, color: 'blue' },
                    { value: 'Virement Bancaire', label: 'Virement Bancaire', icon: Building, color: 'purple' }
                  ].map(method => {
                    const Icon = method.icon;
                    const isSelected = paymentData.method === method.value;
                    
                    return (
                      <div
                        key={method.value}
                        onClick={() => setPaymentData(prev => ({ ...prev, method: method.value as PaymentData['method'] }))}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? `border-${method.color}-500 bg-${method.color}-50` 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-5 w-5 ${isSelected ? `text-${method.color}-600` : 'text-gray-400'}`} />
                          <span className={`font-medium ${isSelected ? `text-${method.color}-800` : 'text-gray-700'}`}>
                            {method.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Fields based on Payment Method */}
              {paymentData.method === 'Mobile Money' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={paymentData.mobileNumber || ''}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                    placeholder="+223 XX XX XX XX"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.mobileNumber ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
                </div>
              )}

              {paymentData.method === 'Virement Bancaire' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Référence Bancaire *
                  </label>
                  <input
                    type="text"
                    value={paymentData.bankDetails || ''}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, bankDetails: e.target.value }))}
                    placeholder="Numéro de référence ou RIB"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.bankDetails ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.bankDetails && <p className="text-red-500 text-sm mt-1">{errors.bankDetails}</p>}
                </div>
              )}

              {/* Reference Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de Référence (Optionnel)
                </label>
                <input
                  type="text"
                  value={paymentData.reference || ''}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, reference: e.target.value }))}
                  placeholder="Référence interne ou reçu"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optionnel)
                </label>
                <textarea
                  value={paymentData.notes || ''}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Commentaires ou informations supplémentaires..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirmation' && selectedStudent && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Paiement Enregistré</h3>
                <p className="text-gray-600">Le paiement a été enregistré avec succès</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-4">Récapitulatif du Paiement</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Élève:</span>
                    <span className="font-medium">{selectedStudent.name} ({selectedStudent.class})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{paymentData.type}</span>
                  </div>
                  {paymentData.month && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mois:</span>
                      <span className="font-medium">{paymentData.month}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant:</span>
                    <span className="font-bold text-green-600">{paymentData.amount?.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Méthode:</span>
                    <span className="font-medium">{paymentData.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(paymentData.date!).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {step === 'payment' && (
                <button
                  onClick={() => setStep('student')}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleClose}
                className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {step === 'confirmation' ? 'Fermer' : 'Annuler'}
              </button>
              
              {step === 'payment' && (
                <button
                  onClick={() => {
                    if (validatePayment()) {
                      setStep('confirmation');
                      handleSubmit();
                    }
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Enregistrer Paiement</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;