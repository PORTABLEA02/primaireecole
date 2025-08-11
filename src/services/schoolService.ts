import { supabase } from '../lib/supabase';
import type { School, SchoolTeacher } from '../lib/supabase';

export interface CreateSchoolData {
  name: string;
  address: string;
  phone: string;
  email: string;
  director: string;
  foundedYear?: string;
  studentCapacity?: number;
  motto?: string;
  logoUrl?: string;
}

export interface AssignTeacherToSchoolData {
  schoolId: string;
  teacherId: string;
  startDate: string;
  contractType?: string;
}

export const schoolService = {
  // Récupérer toutes les écoles
  async getSchools() {
    const { data, error } = await supabase
      .from('schools')
      .select(`
        *,
        classes (id),
        school_teachers (
          teachers (id, first_name, last_name)
        ),
        user_profiles (id)
      `)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Récupérer une école par ID
  async getSchoolById(id: string) {
    const { data, error } = await supabase
      .from('schools')
      .select(`
        *,
        classes (
          id,
          name,
          capacity,
          student_class_enrollments (id)
        ),
        school_teachers (
          teachers (
            id,
            first_name,
            last_name,
            email,
            phone,
            qualification,
            status
          ),
          status,
          contract_type,
          start_date,
          end_date
        ),
        subjects (id, name),
        user_profiles (id, full_name, role)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Créer une nouvelle école
  async createSchool(schoolData: CreateSchoolData) {
    const { data, error } = await supabase
      .from('schools')
      .insert({
        name: schoolData.name,
        address: schoolData.address,
        phone: schoolData.phone,
        email: schoolData.email,
        director: schoolData.director,
        founded_year: schoolData.foundedYear,
        student_capacity: schoolData.studentCapacity || 1500,
        motto: schoolData.motto,
        logo_url: schoolData.logoUrl
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mettre à jour une école
  async updateSchool(id: string, updates: Partial<School>) {
    const { data, error } = await supabase
      .from('schools')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Assigner un enseignant à une école
  async assignTeacherToSchool(assignmentData: AssignTeacherToSchoolData) {
    const { data, error } = await supabase
      .from('school_teachers')
      .insert({
        school_id: assignmentData.schoolId,
        teacher_id: assignmentData.teacherId,
        start_date: assignmentData.startDate,
        contract_type: assignmentData.contractType,
        status: 'Actif'
      })
      .select(`
        *,
        teachers (first_name, last_name),
        schools (name)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Retirer un enseignant d'une école
  async removeTeacherFromSchool(schoolId: string, teacherId: string, endDate?: string) {
    const { data, error } = await supabase
      .from('school_teachers')
      .update({
        status: 'Inactif',
        end_date: endDate || new Date().toISOString().split('T')[0]
      })
      .eq('school_id', schoolId)
      .eq('teacher_id', teacherId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer les enseignants d'une école
  async getSchoolTeachers(schoolId: string) {
    const { data, error } = await supabase
      .from('school_teachers')
      .select(`
        *,
        teachers (
          id,
          first_name,
          last_name,
          email,
          phone,
          qualification,
          experience,
          status,
          classes (name)
        )
      `)
      .eq('school_id', schoolId)
      .eq('status', 'Actif')
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Statistiques d'une école
  async getSchoolStats(schoolId: string) {
    const { data, error } = await supabase.rpc('get_dashboard_stats', {
      school_id: schoolId
    });

    if (error) throw error;
    return data;
  }
};