import { supabase } from '../lib/supabase';

export interface CreateScheduleData {
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  classroom?: string;
  notes?: string;
}

export const scheduleService = {
  // Récupérer l'emploi du temps d'une classe
  async getClassSchedule(classId: string) {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        subjects (name),
        teachers (first_name, last_name),
        classes (name)
      `)
      .eq('class_id', classId)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Récupérer l'emploi du temps d'un enseignant
  async getTeacherSchedule(teacherId: string) {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        subjects (name),
        classes (name, levels (name))
      `)
      .eq('teacher_id', teacherId)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Récupérer l'occupation d'une salle
  async getClassroomSchedule(classroom: string) {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        subjects (name),
        teachers (first_name, last_name),
        classes (name)
      `)
      .eq('classroom', classroom)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Créer un nouveau créneau
  async createSchedule(scheduleData: CreateScheduleData) {
    // Récupérer l'année scolaire active
    const { data: activeYear } = await supabase
      .from('academic_years')
      .select('id')
      .eq('is_active', true)
      .single();

    const { data, error } = await supabase
      .from('schedules')
      .insert({
        class_id: scheduleData.classId,
        subject_id: scheduleData.subjectId,
        teacher_id: scheduleData.teacherId,
        day_of_week: scheduleData.dayOfWeek,
        start_time: scheduleData.startTime,
        end_time: scheduleData.endTime,
        classroom: scheduleData.classroom,
        notes: scheduleData.notes,
        academic_year_id: activeYear?.id
      })
      .select(`
        *,
        subjects (name),
        teachers (first_name, last_name),
        classes (name)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Mettre à jour un créneau
  async updateSchedule(id: string, updates: Partial<CreateScheduleData>) {
    const { data, error } = await supabase
      .from('schedules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer un créneau
  async deleteSchedule(id: string) {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Vérifier les conflits d'horaire
  async checkScheduleConflicts(
    teacherId: string,
    dayOfWeek: string,
    startTime: string,
    endTime: string,
    excludeId?: string
  ) {
    let query = supabase
      .from('schedules')
      .select('*')
      .eq('teacher_id', teacherId)
      .eq('day_of_week', dayOfWeek)
      .or(`start_time.lte.${endTime},end_time.gte.${startTime}`);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data && data.length > 0;
  },

  // Générer automatiquement l'emploi du temps pour une classe
  async generateClassSchedule(classId: string) {
    // Cette fonction pourrait implémenter une logique de génération automatique
    // basée sur les matières du niveau et les disponibilités
    
    const { data: classInfo, error: classError } = await supabase
      .from('classes')
      .select(`
        *,
        levels (
          level_subjects (
            subjects (id, name, coefficient)
          )
        ),
        teachers (id)
      `)
      .eq('id', classId)
      .single();

    if (classError) throw classError;

    // Logique de génération automatique à implémenter
    // Pour l'instant, retourner les informations de la classe
    return classInfo;
  }
};