import { supabase } from '../lib/supabase';
import type { Student } from '../lib/supabase';

export interface CreateStudentData {
  firstName: string;
  lastName: string;
  gender: 'Masculin' | 'Féminin';
  dateOfBirth: string;
  birthPlace: string;
  nationality: string;
  motherTongue: string;
  religion?: string;
  bloodType?: string;
  allergies?: string;
  medicalInfo?: string;
  previousSchool?: string;
  fatherName?: string;
  fatherPhone?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherPhone?: string;
  motherOccupation?: string;
  guardianType: string;
  numberOfSiblings: number;
  parentEmail: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  classId: string;
  enrollmentDate: string;
  totalFees: number;
  initialPayment: number;
  transportMode: string;
  notes?: string;
}

export const studentService = {
  // Récupérer tous les élèves avec leurs classes
  async getStudents() {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        classes (
          id,
          name,
          levels (name)
        )
      `)
      .order('last_name', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Récupérer un élève par ID
  async getStudentById(id: string) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        classes (
          id,
          name,
          levels (name),
          teachers (first_name, last_name)
        ),
        payments (
          id,
          amount,
          payment_date,
          payment_type,
          payment_method,
          period_description
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Créer un nouvel élève
  async createStudent(studentData: CreateStudentData) {
    const { data, error } = await supabase
      .from('students')
      .insert({
        first_name: studentData.firstName,
        last_name: studentData.lastName,
        gender: studentData.gender,
        date_of_birth: studentData.dateOfBirth,
        birth_place: studentData.birthPlace,
        nationality: studentData.nationality,
        mother_tongue: studentData.motherTongue,
        religion: studentData.religion,
        blood_type: studentData.bloodType,
        allergies: studentData.allergies,
        medical_info: studentData.medicalInfo,
        previous_school: studentData.previousSchool,
        father_name: studentData.fatherName,
        father_phone: studentData.fatherPhone,
        father_occupation: studentData.fatherOccupation,
        mother_name: studentData.motherName,
        mother_phone: studentData.motherPhone,
        mother_occupation: studentData.motherOccupation,
        guardian_type: studentData.guardianType,
        number_of_siblings: studentData.numberOfSiblings,
        parent_email: studentData.parentEmail,
        address: studentData.address,
        emergency_contact_name: studentData.emergencyContactName,
        emergency_contact_phone: studentData.emergencyContactPhone,
        emergency_contact_relation: studentData.emergencyContactRelation,
        class_id: studentData.classId,
        enrollment_date: studentData.enrollmentDate,
        total_fees: studentData.totalFees,
        paid_amount: studentData.initialPayment,
        transport_mode: studentData.transportMode
      })
      .select()
      .single();

    if (error) throw error;

    // Si paiement initial, créer l'enregistrement de paiement
    if (studentData.initialPayment > 0) {
      await supabase
        .from('payments')
        .insert({
          student_id: data.id,
          amount: studentData.initialPayment,
          payment_method: 'Espèces', // Valeur par défaut, à adapter selon vos besoins
          payment_type: 'Inscription',
          payment_date: studentData.enrollmentDate,
          period_description: 'Paiement d\'inscription',
          processed_by: (await supabase.auth.getUser()).data.user?.id
        });
    }

    return data;
  },

  // Mettre à jour un élève
  async updateStudent(id: string, updates: Partial<Student>) {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer un élève
  async deleteStudent(id: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Récupérer les élèves par classe
  async getStudentsByClass(classId: string) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        classes (name, levels (name))
      `)
      .eq('class_id', classId)
      .eq('status', 'Actif')
      .order('last_name', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Rechercher des élèves
  async searchStudents(searchTerm: string) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        classes (name, levels (name))
      `)
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,parent_email.ilike.%${searchTerm}%`)
      .order('last_name', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Statistiques des élèves
  async getStudentStats() {
    const { data: totalStudents, error: totalError } = await supabase
      .from('students')
      .select('id', { count: 'exact' })
      .eq('status', 'Actif');

    const { data: paymentStats, error: paymentError } = await supabase
      .from('students')
      .select('payment_status')
      .eq('status', 'Actif');

    if (totalError || paymentError) {
      throw totalError || paymentError;
    }

    const stats = {
      total: totalStudents?.length || 0,
      upToDate: paymentStats?.filter(s => s.payment_status === 'À jour').length || 0,
      late: paymentStats?.filter(s => s.payment_status === 'En retard').length || 0,
      partial: paymentStats?.filter(s => s.payment_status === 'Partiel').length || 0
    };

    return stats;
  }
};