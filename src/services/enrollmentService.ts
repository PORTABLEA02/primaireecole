import { supabase } from '../lib/supabase';
import type { StudentClassEnrollment } from '../lib/supabase';

export interface CreateEnrollmentData {
  studentId: string;
  classId: string;
  academicYearId: string;
  totalFees: number;
  initialPayment?: number;
  enrollmentDate?: string;
}

export const enrollmentService = {
  // Récupérer toutes les inscriptions avec détails
  async getEnrollments(academicYearId?: string) {
    let query = supabase
      .from('student_class_enrollments')
      .select(`
        *,
        students (
          id,
          first_name,
          last_name,
          gender,
          date_of_birth,
          parent_email,
          father_phone,
          mother_phone
        ),
        classes (
          id,
          name,
          levels (name),
          teachers (first_name, last_name)
        ),
        academic_years (name)
      `)
      .order('created_at', { ascending: false });

    if (academicYearId) {
      query = query.eq('academic_year_id', academicYearId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Récupérer les inscriptions d'un élève
  async getStudentEnrollments(studentId: string) {
    const { data, error } = await supabase
      .from('student_class_enrollments')
      .select(`
        *,
        classes (
          name,
          levels (name),
          teachers (first_name, last_name)
        ),
        academic_years (name),
        payments (
          id,
          amount,
          payment_date,
          payment_type,
          payment_method
        )
      `)
      .eq('student_id', studentId)
      .order('enrollment_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Créer une nouvelle inscription
  async createEnrollment(enrollmentData: CreateEnrollmentData) {
    const { data, error } = await supabase
      .from('student_class_enrollments')
      .insert({
        student_id: enrollmentData.studentId,
        class_id: enrollmentData.classId,
        academic_year_id: enrollmentData.academicYearId,
        total_fees: enrollmentData.totalFees,
        paid_amount: enrollmentData.initialPayment || 0,
        enrollment_date: enrollmentData.enrollmentDate || new Date().toISOString().split('T')[0]
      })
      .select(`
        *,
        students (first_name, last_name),
        classes (name, levels (name))
      `)
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
          payment_date: enrollmentData.enrollmentDate || new Date().toISOString().split('T')[0],
          period_description: 'Paiement d\'inscription',
          processed_by: (await supabase.auth.getUser()).data.user?.id
        });
    }

    return data;
  },

  // Mettre à jour une inscription
  async updateEnrollment(id: string, updates: Partial<StudentClassEnrollment>) {
    const { data, error } = await supabase
      .from('student_class_enrollments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Transférer un élève vers une autre classe
  async transferStudent(enrollmentId: string, newClassId: string, transferDate?: string) {
    const { data, error } = await supabase.rpc('transfer_student', {
      enrollment_id: enrollmentId,
      new_class_id: newClassId,
      transfer_date: transferDate || new Date().toISOString().split('T')[0]
    });

    if (error) throw error;
    return data;
  },

  // Suspendre une inscription
  async suspendEnrollment(id: string, reason?: string) {
    const { data, error } = await supabase
      .from('student_class_enrollments')
      .update({ 
        status: 'Suspendu',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Réactiver une inscription
  async reactivateEnrollment(id: string) {
    const { data, error } = await supabase
      .from('student_class_enrollments')
      .update({ 
        status: 'Actif',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Statistiques des inscriptions
  async getEnrollmentStats(academicYearId?: string) {
    let query = supabase
      .from('student_class_enrollments')
      .select('status, payment_status');

    if (academicYearId) {
      query = query.eq('academic_year_id', academicYearId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      active: data?.filter(e => e.status === 'Actif').length || 0,
      suspended: data?.filter(e => e.status === 'Suspendu').length || 0,
      transferred: data?.filter(e => e.status === 'Transféré').length || 0,
      paymentUpToDate: data?.filter(e => e.payment_status === 'À jour').length || 0,
      paymentLate: data?.filter(e => e.payment_status === 'En retard').length || 0,
      paymentPartial: data?.filter(e => e.payment_status === 'Partiel').length || 0
    };

    return stats;
  }
};