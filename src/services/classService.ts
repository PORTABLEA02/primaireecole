import { supabase } from '../lib/supabase';
import type { Class } from '../lib/supabase';

export interface CreateClassData {
  name: string;
  levelId: string;
  teacherId?: string;
  capacity: number;
  classroom?: string;
}

export const classService = {
  // Récupérer toutes les classes avec leurs informations complètes
  async getClasses() {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        levels (
          id,
          name,
          description,
          annual_fees
        ),
        teachers (
          id,
          first_name,
          last_name,
          email,
          phone
        ),
        students (id),
        academic_years (name)
      `)
      .eq('status', 'Actif')
      .order('name', { ascending: true });

    if (error) throw error;

    // Transformer les données pour correspondre au format attendu
    return data?.map(cls => ({
      ...cls,
      student_count: cls.students?.length || 0,
      level_name: cls.levels?.name || '',
      teacher_name: cls.teachers ? `${cls.teachers.first_name} ${cls.teachers.last_name}` : 'Non assigné',
      subjects: [] // À récupérer séparément si nécessaire
    }));
  },

  // Récupérer une classe par ID avec tous les détails
  async getClassById(id: string) {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        levels (
          id,
          name,
          description,
          annual_fees,
          level_subjects (
            subjects (id, name, coefficient)
          )
        ),
        teachers (
          id,
          first_name,
          last_name,
          email,
          phone,
          qualification,
          experience
        ),
        students (
          id,
          first_name,
          last_name,
          gender,
          date_of_birth,
          parent_email,
          father_phone,
          mother_phone,
          payment_status,
          outstanding_amount
        ),
        academic_years (name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Créer une nouvelle classe
  async createClass(classData: CreateClassData) {
    // Récupérer l'année scolaire active
    const { data: activeYear } = await supabase
      .from('academic_years')
      .select('id')
      .eq('is_active', true)
      .single();

    const { data, error } = await supabase
      .from('classes')
      .insert({
        name: classData.name,
        level_id: classData.levelId,
        teacher_id: classData.teacherId,
        capacity: classData.capacity,
        classroom: classData.classroom,
        academic_year_id: activeYear?.id,
        status: 'Actif'
      })
      .select(`
        *,
        levels (name),
        teachers (first_name, last_name)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Mettre à jour une classe
  async updateClass(id: string, updates: Partial<Class>) {
    const { data, error } = await supabase
      .from('classes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer une classe
  async deleteClass(id: string) {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Changer l'enseignant d'une classe
  async changeClassTeacher(classId: string, newTeacherId: string) {
    const { data, error } = await supabase
      .from('classes')
      .update({ teacher_id: newTeacherId })
      .eq('id', classId)
      .select(`
        *,
        teachers (first_name, last_name)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer les classes sans enseignant
  async getClassesWithoutTeacher() {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        levels (name),
        students (id)
      `)
      .is('teacher_id', null)
      .eq('status', 'Actif');

    if (error) throw error;
    return data;
  },

  // Statistiques des classes
  async getClassStats() {
    const { data: classes, error } = await supabase
      .from('classes')
      .select(`
        *,
        students (id),
        teachers (id)
      `)
      .eq('status', 'Actif');

    if (error) throw error;

    const stats = {
      total: classes?.length || 0,
      withTeacher: classes?.filter(c => c.teachers).length || 0,
      withoutTeacher: classes?.filter(c => !c.teachers).length || 0,
      totalStudents: classes?.reduce((sum, c) => sum + (c.students?.length || 0), 0) || 0,
      averageSize: classes?.length ? 
        (classes.reduce((sum, c) => sum + (c.students?.length || 0), 0) / classes.length) : 0
    };

    return stats;
  }
};