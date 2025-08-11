import { supabase } from '../lib/supabase';
import type { Level, Subject } from '../lib/supabase';

export const levelService = {
  // Récupérer tous les niveaux avec leurs matières
  async getLevels() {
    const { data, error } = await supabase
      .from('levels')
      .select(`
        *,
        level_subjects (
          subjects (
            id,
            name,
            coefficient,
            description
          )
        )
      `)
      .order('order_number', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Récupérer un niveau par ID
  async getLevelById(id: string) {
    const { data, error } = await supabase
      .from('levels')
      .select(`
        *,
        level_subjects (
          subjects (
            id,
            name,
            coefficient,
            description
          )
        ),
        classes (
          id,
          name,
          students (id)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer toutes les matières
  async getSubjects() {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        level_subjects (
          levels (name)
        )
      `)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Récupérer les matières d'un niveau
  async getLevelSubjects(levelId: string) {
    const { data, error } = await supabase
      .from('level_subjects')
      .select(`
        subjects (
          id,
          name,
          coefficient,
          description
        )
      `)
      .eq('level_id', levelId)
      .eq('is_mandatory', true);

    if (error) throw error;
    return data?.map(ls => ls.subjects).filter(Boolean);
  },

  // Créer un nouveau niveau
  async createLevel(levelData: Omit<Level, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('levels')
      .insert(levelData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Créer une nouvelle matière
  async createSubject(subjectData: Omit<Subject, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('subjects')
      .insert(subjectData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Associer une matière à un niveau
  async addSubjectToLevel(levelId: string, subjectId: string, isMandatory: boolean = true) {
    const { data, error } = await supabase
      .from('level_subjects')
      .insert({
        level_id: levelId,
        subject_id: subjectId,
        is_mandatory: isMandatory
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Retirer une matière d'un niveau
  async removeSubjectFromLevel(levelId: string, subjectId: string) {
    const { error } = await supabase
      .from('level_subjects')
      .delete()
      .eq('level_id', levelId)
      .eq('subject_id', subjectId);

    if (error) throw error;
  }
};