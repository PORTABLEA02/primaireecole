import { supabase } from '../lib/supabase';
import type { Teacher } from '../lib/supabase';

export interface CreateTeacherData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  qualification: string;
  experience: string;
  hireDate: string;
  salary: number;
  emergencyContact: string;
  specializations: string[];
  schoolId?: string;
}

export const teacherService = {
  // Récupérer tous les enseignants avec leurs classes
  async getTeachers() {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        *,
        classes (
          id,
          name,
          levels (name)
        ),
        school_teachers (
          schools (name),
          status,
          contract_type
        )
      `)
      .order('last_name', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Récupérer un enseignant par ID
  async getTeacherById(id: string) {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        *,
        classes (
          id,
          name,
          levels (name),
          student_class_enrollments (
            students (id, first_name, last_name)
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Créer un nouvel enseignant
  async createTeacher(teacherData: CreateTeacherData) {
    const { data, error } = await supabase
      .from('teachers')
      .insert({
        first_name: teacherData.firstName,
        last_name: teacherData.lastName,
        email: teacherData.email,
        phone: teacherData.phone,
        address: teacherData.address,
        qualification: teacherData.qualification,
        experience: teacherData.experience,
        hire_date: teacherData.hireDate,
        salary: teacherData.salary,
        emergency_contact: teacherData.emergencyContact,
        specializations: teacherData.specializations,
        status: 'Actif'
      })
      .select()
      .single();

    if (error) throw error;

    // Si une école est spécifiée, créer la relation école-enseignant
    if (teacherData.schoolId && data) {
      await supabase
        .from('school_teachers')
        .insert({
          school_id: teacherData.schoolId,
          teacher_id: data.id,
          start_date: teacherData.hireDate,
          status: 'Actif'
        });
    }

    return data;
  },

  // Mettre à jour un enseignant
  async updateTeacher(id: string, updates: Partial<Teacher>) {
    const { data, error } = await supabase
      .from('teachers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer un enseignant
  async deleteTeacher(id: string) {
    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Récupérer les enseignants disponibles (sans classe)
  async getAvailableTeachers() {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        *,
        classes (id)
      `)
      .eq('status', 'Actif')
      .filter('classes', 'is', null);

    if (error) throw error;
    return data;
  },

  // Assigner un enseignant à une classe
  async assignTeacherToClass(teacherId: string, classId: string) {
    const { data, error } = await supabase
      .from('classes')
      .update({ teacher_id: teacherId })
      .eq('id', classId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Statistiques des enseignants
  async getTeacherStats() {
    const { data: teachers, error } = await supabase
      .from('teachers')
      .select(`
        *,
        classes (id)
      `);

    if (error) throw error;

    const stats = {
      total: teachers?.length || 0,
      active: teachers?.filter(t => t.status === 'Actif').length || 0,
      withClass: teachers?.filter(t => t.classes && t.classes.length > 0).length || 0,
      available: teachers?.filter(t => t.status === 'Actif' && (!t.classes || t.classes.length === 0)).length || 0,
      averagePerformance: teachers?.reduce((sum, t) => sum + (t.performance_rating || 0), 0) / (teachers?.length || 1)
    };

    return stats;
  }
};