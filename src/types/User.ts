export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Directeur' | 'Secrétaire' | 'Enseignant' | 'Comptable';
  permissions: string[];
  avatar?: string;
  schoolId: string; // Nouvelle propriété
  isActive: boolean;
  createdDate: string;
  lastLogin?: string;
}

export interface Teacher {
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
  schoolId: string; // Nouvelle propriété
}

export interface Student {
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
  schoolId: string; // Nouvelle propriété
  paymentHistory: Array<{
    date: string;
    amount: number;
    description: string;
    method: string;
  }>;
}