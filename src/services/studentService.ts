import { supabase } from '../lib/supabase';
import type { Student, StudentClassEnrollment } from '../lib/supabase';

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
  enrollmentDate: string;
  transportMode: string;
  notes?: string;
}

export interface EnrollStudentData {
  studentId: string;
  classId: string;
  academicYearId: string;
  totalFees: number;
  initialPayment?: number;
}

export const studentService = {
  // Récupérer tous les élèves avec leurs classes
  async getStudents() {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        student_class_enrollments!inner (
          id,
          total_fees,
          paid_amount,
          outstanding_amount,
          payment_status,
          status,
          classes (
            id,
            name,
            levels (name)
          )
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
        student_class_enrollments (
          id,
          total_fees,
          paid_amount,
          outstanding_amount,
          payment_status,
          status,
          classes (
            id,
            name,
            levels (name),
            teachers (first_name, last_name)
          )
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
        enrollment_date: studentData.enrollmentDate,
        transport_mode: studentData.transportMode
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Inscrire un élève à une classe
  async enrollStudent(enrollmentData: EnrollStudentData) {
    const { data, error } = await supabase
      .from('student_class_enrollments')
      .insert({
        student_id: enrollmentData.studentId,
        class_id: enrollmentData.classId,
        academic_year_id: enrollmentData.academicYearId,
        total_fees: enrollmentData.totalFees,
        paid_amount: enrollmentData.initialPayment || 0,
        enrollment_date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (error) throw error;

    // Si paiement initial, créer l'enregistrement de paiement
    if (enrollmentData.initialPayment && enrollmentData.initialPayment > 0) {
      await supabase
        .from('payments')
        .insert({
          student_id: enrollmentData.studentId,
          enrollment_id: data.id,
          amount: enrollmentData.initialPayment,
          payment_method: 'Espèces',
          payment_type: 'Inscription',
          payment_date: new Date().toISOString().split('T')[0],
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
      .from('student_class_enrollments')
      .select(`
        students (*),
        classes (name, levels (name)),
        total_fees,
        paid_amount,
        outstanding_amount,
        payment_status,
        status
      `)
      .eq('class_id', classId)
      .eq('status', 'Actif');

    if (error) throw error;
    return data;
  },

  // Rechercher des élèves
  async searchStudents(searchTerm: string) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        student_class_enrollments (
          classes (name, levels (name)),
          payment_status,
          outstanding_amount
        )
      `)
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,parent_email.ilike.%${searchTerm}%`)
      .order('last_name', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Statistiques des élèves
  async getStudentStats() {
    const { data: enrollments, error: enrollmentError } = await supabase
      .from('student_class_enrollments')
      .select('payment_status')
      .eq('status', 'Actif');

    if (enrollmentError) {
      throw enrollmentError;
    }

    const stats = {
      total: enrollments?.length || 0,
      upToDate: enrollments?.filter(s => s.payment_status === 'À jour').length || 0,
      late: enrollments?.filter(s => s.payment_status === 'En retard').length || 0,
      partial: enrollments?.filter(s => s.payment_status === 'Partiel').length || 0
    };

    return stats;
  },

  // Transférer un élève vers une autre classe
  async transferStudent(enrollmentId: string, newClassId: string) {
    const { data, error } = await supabase.rpc('transfer_student', {
      enrollment_id: enrollmentId,
      new_class_id: newClassId
    });

    if (error) throw error;
    return data;
  }
};