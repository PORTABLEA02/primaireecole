export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      academic_periods: {
        Row: {
          academic_year_id: string | null
          created_at: string
          end_date: string
          id: string
          name: string
          order_number: number
          start_date: string
          type: string | null
        }
        Insert: {
          academic_year_id?: string | null
          created_at?: string
          end_date: string
          id?: string
          name: string
          order_number: number
          start_date: string
          type?: string | null
        }
        Update: {
          academic_year_id?: string | null
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          order_number?: number
          start_date?: string
          type?: string | null
        }
      }
      academic_years: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          start_date?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
      }
      attendance: {
        Row: {
          attendance_date: string
          class_id: string | null
          created_at: string
          id: string
          reason: string | null
          recorded_by: string | null
          status: string | null
          student_id: string | null
        }
        Insert: {
          attendance_date?: string
          class_id?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          recorded_by?: string | null
          status?: string | null
          student_id?: string | null
        }
        Update: {
          attendance_date?: string
          class_id?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          recorded_by?: string | null
          status?: string | null
          student_id?: string | null
        }
      }
      bulletins: {
        Row: {
          academic_period_id: string | null
          class_id: string | null
          class_rank: number | null
          conduct_grade: string | null
          decision: string | null
          general_average: number | null
          generated_at: string
          generated_by: string | null
          id: string
          pdf_url: string | null
          sent_to_parents: boolean | null
          student_id: string | null
          teacher_comment: string | null
          total_students: number | null
        }
        Insert: {
          academic_period_id?: string | null
          class_id?: string | null
          class_rank?: number | null
          conduct_grade?: string | null
          decision?: string | null
          general_average?: number | null
          generated_at?: string
          generated_by?: string | null
          id?: string
          pdf_url?: string | null
          sent_to_parents?: boolean | null
          student_id?: string | null
          teacher_comment?: string | null
          total_students?: number | null
        }
        Update: {
          academic_period_id?: string | null
          class_id?: string | null
          class_rank?: number | null
          conduct_grade?: string | null
          decision?: string | null
          general_average?: number | null
          generated_at?: string
          generated_by?: string | null
          id?: string
          pdf_url?: string | null
          sent_to_parents?: boolean | null
          student_id?: string | null
          teacher_comment?: string | null
          total_students?: number | null
        }
      }
      classes: {
        Row: {
          academic_year_id: string | null
          capacity: number
          classroom: string | null
          created_at: string
          id: string
          level_id: string | null
          name: string
          status: string | null
          teacher_id: string | null
          updated_at: string
        }
        Insert: {
          academic_year_id?: string | null
          capacity?: number
          classroom?: string | null
          created_at?: string
          id?: string
          level_id?: string | null
          name: string
          status?: string | null
          teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          academic_year_id?: string | null
          capacity?: number
          classroom?: string | null
          created_at?: string
          id?: string
          level_id?: string | null
          name?: string
          status?: string | null
          teacher_id?: string | null
          updated_at?: string
        }
      }
      grades: {
        Row: {
          academic_period_id: string | null
          class_id: string | null
          coefficient: number | null
          created_at: string
          created_by: string | null
          evaluation_date: string
          evaluation_title: string | null
          evaluation_type: string | null
          grade: number
          id: string
          student_id: string | null
          subject_id: string | null
          teacher_comment: string | null
          updated_at: string
        }
        Insert: {
          academic_period_id?: string | null
          class_id?: string | null
          coefficient?: number | null
          created_at?: string
          created_by?: string | null
          evaluation_date?: string
          evaluation_title?: string | null
          evaluation_type?: string | null
          grade: number
          id?: string
          student_id?: string | null
          subject_id?: string | null
          teacher_comment?: string | null
          updated_at?: string
        }
        Update: {
          academic_period_id?: string | null
          class_id?: string | null
          coefficient?: number | null
          created_at?: string
          created_by?: string | null
          evaluation_date?: string
          evaluation_title?: string | null
          evaluation_type?: string | null
          grade?: number
          id?: string
          student_id?: string | null
          subject_id?: string | null
          teacher_comment?: string | null
          updated_at?: string
        }
      }
      level_subjects: {
        Row: {
          id: string
          is_mandatory: boolean | null
          level_id: string | null
          subject_id: string | null
        }
        Insert: {
          id?: string
          is_mandatory?: boolean | null
          level_id?: string | null
          subject_id?: string | null
        }
        Update: {
          id?: string
          is_mandatory?: boolean | null
          level_id?: string | null
          subject_id?: string | null
        }
      }
      levels: {
        Row: {
          annual_fees: number
          created_at: string
          description: string | null
          id: string
          max_age: number
          min_age: number
          name: string
          order_number: number
          updated_at: string
        }
        Insert: {
          annual_fees?: number
          created_at?: string
          description?: string | null
          id?: string
          max_age: number
          min_age: number
          name: string
          order_number: number
          updated_at?: string
        }
        Update: {
          annual_fees?: number
          created_at?: string
          description?: string | null
          id?: string
          max_age?: number
          min_age?: number
          name?: string
          order_number?: number
          updated_at?: string
        }
      }
      payments: {
        Row: {
          amount: number
          bank_details: string | null
          created_at: string
          id: string
          mobile_number: string | null
          notes: string | null
          payment_date: string
          payment_method: string
          payment_type: string
          period_description: string | null
          processed_by: string | null
          reference_number: string | null
          status: string | null
          student_id: string | null
        }
        Insert: {
          amount: number
          bank_details?: string | null
          created_at?: string
          id?: string
          mobile_number?: string | null
          notes?: string | null
          payment_date?: string
          payment_method: string
          payment_type: string
          period_description?: string | null
          processed_by?: string | null
          reference_number?: string | null
          status?: string | null
          student_id?: string | null
        }
        Update: {
          amount?: number
          bank_details?: string | null
          created_at?: string
          id?: string
          mobile_number?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: string
          payment_type?: string
          period_description?: string | null
          processed_by?: string | null
          reference_number?: string | null
          status?: string | null
          student_id?: string | null
        }
      }
      schedules: {
        Row: {
          academic_year_id: string | null
          class_id: string | null
          classroom: string | null
          created_at: string
          day_of_week: string
          end_time: string
          id: string
          notes: string | null
          start_time: string
          subject_id: string | null
          teacher_id: string | null
          updated_at: string
        }
        Insert: {
          academic_year_id?: string | null
          class_id?: string | null
          classroom?: string | null
          created_at?: string
          day_of_week: string
          end_time: string
          id?: string
          notes?: string | null
          start_time: string
          subject_id?: string | null
          teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          academic_year_id?: string | null
          class_id?: string | null
          classroom?: string | null
          created_at?: string
          day_of_week?: string
          end_time?: string
          id?: string
          notes?: string | null
          start_time?: string
          subject_id?: string | null
          teacher_id?: string | null
          updated_at?: string
        }
      }
      schools: {
        Row: {
          address: string
          created_at: string
          director: string
          email: string
          founded_year: string | null
          id: string
          logo_url: string | null
          motto: string | null
          name: string
          phone: string
          student_capacity: number | null
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          director: string
          email: string
          founded_year?: string | null
          id?: string
          logo_url?: string | null
          motto?: string | null
          name: string
          phone: string
          student_capacity?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          director?: string
          email?: string
          founded_year?: string | null
          id?: string
          logo_url?: string | null
          motto?: string | null
          name?: string
          phone?: string
          student_capacity?: number | null
          updated_at?: string
        }
      }
      students: {
        Row: {
          address: string
          allergies: string | null
          birth_place: string
          blood_type: string | null
          class_id: string | null
          created_at: string
          date_of_birth: string
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relation: string
          enrollment_date: string
          father_name: string | null
          father_occupation: string | null
          father_phone: string | null
          first_name: string
          gender: string
          guardian_type: string | null
          id: string
          last_name: string
          medical_info: string | null
          mother_name: string | null
          mother_occupation: string | null
          mother_phone: string | null
          mother_tongue: string
          nationality: string
          number_of_siblings: number | null
          outstanding_amount: number | null
          paid_amount: number | null
          parent_email: string
          payment_status: string | null
          previous_school: string | null
          religion: string | null
          status: string | null
          total_fees: number
          transport_mode: string | null
          updated_at: string
        }
        Insert: {
          address: string
          allergies?: string | null
          birth_place: string
          blood_type?: string | null
          class_id?: string | null
          created_at?: string
          date_of_birth: string
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relation: string
          enrollment_date?: string
          father_name?: string | null
          father_occupation?: string | null
          father_phone?: string | null
          first_name: string
          gender: string
          guardian_type?: string | null
          id?: string
          last_name: string
          medical_info?: string | null
          mother_name?: string | null
          mother_occupation?: string | null
          mother_phone?: string | null
          mother_tongue?: string
          nationality?: string
          number_of_siblings?: number | null
          paid_amount?: number | null
          parent_email: string
          previous_school?: string | null
          religion?: string | null
          status?: string | null
          total_fees?: number
          transport_mode?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          allergies?: string | null
          birth_place?: string
          blood_type?: string | null
          class_id?: string | null
          created_at?: string
          date_of_birth?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          emergency_contact_relation?: string
          enrollment_date?: string
          father_name?: string | null
          father_occupation?: string | null
          father_phone?: string | null
          first_name?: string
          gender?: string
          guardian_type?: string | null
          id?: string
          last_name?: string
          medical_info?: string | null
          mother_name?: string | null
          mother_occupation?: string | null
          mother_phone?: string | null
          mother_tongue?: string
          nationality?: string
          number_of_siblings?: number | null
          paid_amount?: number | null
          parent_email?: string
          previous_school?: string | null
          religion?: string | null
          status?: string | null
          total_fees?: number
          transport_mode?: string | null
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          coefficient: number | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          coefficient?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          coefficient?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
      }
      teachers: {
        Row: {
          address: string | null
          created_at: string
          email: string
          emergency_contact: string
          experience: string
          first_name: string
          hire_date: string
          id: string
          last_name: string
          performance_rating: number | null
          phone: string
          qualification: string
          salary: number
          specializations: string[] | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          emergency_contact: string
          experience: string
          first_name: string
          hire_date: string
          id?: string
          last_name: string
          performance_rating?: number | null
          phone: string
          qualification: string
          salary?: number
          specializations?: string[] | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          emergency_contact?: string
          experience?: string
          first_name?: string
          hire_date?: string
          id?: string
          last_name?: string
          performance_rating?: number | null
          phone?: string
          qualification?: string
          salary?: number
          specializations?: string[] | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          is_active: boolean | null
          last_login: string | null
          permissions: string[] | null
          phone: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          permissions?: string[] | null
          phone?: string | null
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          permissions?: string[] | null
          phone?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}