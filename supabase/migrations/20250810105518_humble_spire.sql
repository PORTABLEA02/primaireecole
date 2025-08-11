/*
  SCHÉMA COMPLET MIS À JOUR - SYSTÈME DE GESTION SCOLAIRE
  Contient les modifications demandées :
  - Table student_class_enrollments
  - Table school_teachers
  - Liens vers schools pour user_profiles, classes, subjects
  - Suppression des champs financiers de students
*/

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des écoles
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  director text NOT NULL,
  founded_year text,
  student_capacity integer DEFAULT 1500,
  motto text,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des années scolaires
CREATE TABLE IF NOT EXISTS academic_years (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des périodes (trimestres/semestres)
CREATE TABLE IF NOT EXISTS academic_periods (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  academic_year_id uuid REFERENCES academic_years(id) ON DELETE CASCADE,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  type text CHECK (type IN ('Trimestre', 'Semestre')) DEFAULT 'Trimestre',
  order_number integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Table des niveaux scolaires
CREATE TABLE IF NOT EXISTS levels (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  min_age integer NOT NULL,
  max_age integer NOT NULL,
  annual_fees integer NOT NULL DEFAULT 0,
  order_number integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des matières
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  coefficient integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table de liaison niveau-matière
CREATE TABLE IF NOT EXISTS level_subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_id uuid REFERENCES levels(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  is_mandatory boolean DEFAULT true,
  UNIQUE(level_id, subject_id)
);

-- Table des enseignants
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  address text,
  qualification text NOT NULL,
  experience text NOT NULL,
  hire_date date NOT NULL,
  salary integer NOT NULL DEFAULT 150000,
  emergency_contact text NOT NULL,
  specializations text[] DEFAULT '{}',
  status text CHECK (status IN ('Actif', 'Inactif', 'Congé')) DEFAULT 'Actif',
  performance_rating decimal(2,1) DEFAULT 4.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table de relation écoles-enseignants
CREATE TABLE IF NOT EXISTS school_teachers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date,
  status text CHECK (status IN ('Actif', 'Inactif', 'Congé')) DEFAULT 'Actif',
  contract_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(school_id, teacher_id)
);

-- Table des classes
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  level_id uuid REFERENCES levels(id) ON DELETE RESTRICT,
  teacher_id uuid REFERENCES teachers(id) ON DELETE SET NULL,
  academic_year_id uuid REFERENCES academic_years(id) ON DELETE CASCADE,
  capacity integer NOT NULL DEFAULT 30,
  classroom text,
  status text CHECK (status IN ('Actif', 'Inactif')) DEFAULT 'Actif',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(name, academic_year_id, school_id)
);

-- Table des élèves
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  gender text CHECK (gender IN ('Masculin', 'Féminin')) NOT NULL,
  date_of_birth date NOT NULL,
  birth_place text NOT NULL,
  nationality text NOT NULL DEFAULT 'Malienne',
  mother_tongue text NOT NULL DEFAULT 'Bambara',
  religion text,
  blood_type text,
  allergies text,
  medical_info text,
  previous_school text,
  
  -- Informations familiales
  father_name text,
  father_phone text,
  father_occupation text,
  mother_name text,
  mother_phone text,
  mother_occupation text,
  guardian_type text CHECK (guardian_type IN ('Parents', 'Tuteur', 'Famille élargie', 'Autre')) DEFAULT 'Parents',
  number_of_siblings integer DEFAULT 0,
  
  -- Contact et adresse
  parent_email text NOT NULL,
  address text NOT NULL,
  emergency_contact_name text NOT NULL,
  emergency_contact_phone text NOT NULL,
  emergency_contact_relation text NOT NULL,
  
  -- Informations scolaires
  enrollment_date date NOT NULL DEFAULT CURRENT_DATE,
  transport_mode text DEFAULT 'À pied',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table d'inscription des élèves aux classes
CREATE TABLE IF NOT EXISTS student_class_enrollments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  academic_year_id uuid REFERENCES academic_years(id) ON DELETE CASCADE,
  
  -- Informations financières
  total_fees integer NOT NULL DEFAULT 0,
  paid_amount integer DEFAULT 0,
  outstanding_amount integer GENERATED ALWAYS AS (total_fees - paid_amount) STORED,
  payment_status text GENERATED ALWAYS AS (
    CASE 
      WHEN paid_amount >= total_fees THEN 'À jour'
      WHEN paid_amount > 0 THEN 'Partiel'
      ELSE 'En retard'
    END
  ) STORED,
  
  enrollment_date date NOT NULL DEFAULT CURRENT_DATE,
  status text CHECK (status IN ('Actif', 'Inactif', 'Suspendu', 'Transféré')) DEFAULT 'Actif',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, class_id, academic_year_id)
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  enrollment_id uuid REFERENCES student_class_enrollments(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  payment_method text CHECK (payment_method IN ('Espèces', 'Mobile Money', 'Virement Bancaire')) NOT NULL,
  payment_type text CHECK (payment_type IN ('Inscription', 'Scolarité', 'Cantine', 'Transport', 'Fournitures', 'Autre')) NOT NULL,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  period_description text,
  reference_number text,
  mobile_number text,
  bank_details text,
  notes text,
  status text CHECK (status IN ('Confirmé', 'En attente', 'Annulé')) DEFAULT 'Confirmé',
  processed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Table des notes
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  academic_period_id uuid REFERENCES academic_periods(id) ON DELETE CASCADE,
  grade decimal(4,2) NOT NULL CHECK (grade >= 0 AND grade <= 20),
  coefficient integer DEFAULT 1,
  evaluation_type text CHECK (evaluation_type IN ('devoir', 'composition', 'interrogation')) DEFAULT 'devoir',
  evaluation_title text,
  evaluation_date date NOT NULL DEFAULT CURRENT_DATE,
  teacher_comment text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des emplois du temps
CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  day_of_week text CHECK (day_of_week IN ('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi')) NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  classroom text,
  academic_year_id uuid REFERENCES academic_years(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(class_id, day_of_week, start_time, academic_year_id)
);

-- Table des présences
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  enrollment_id uuid REFERENCES student_class_enrollments(id) ON DELETE CASCADE,
  attendance_date date NOT NULL DEFAULT CURRENT_DATE,
  status text CHECK (status IN ('Présent', 'Absent', 'Retard', 'Absent justifié')) DEFAULT 'Présent',
  reason text,
  recorded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, attendance_date)
);

-- Table des bulletins générés
CREATE TABLE IF NOT EXISTS bulletins (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  academic_period_id uuid REFERENCES academic_periods(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  enrollment_id uuid REFERENCES student_class_enrollments(id) ON DELETE CASCADE,
  general_average decimal(4,2),
  class_rank integer,
  total_students integer,
  conduct_grade text,
  teacher_comment text,
  decision text CHECK (decision IN ('Admis', 'Redouble', 'En cours')),
  generated_by uuid REFERENCES auth.users(id),
  generated_at timestamptz DEFAULT now(),
  pdf_url text,
  sent_to_parents boolean DEFAULT false,
  UNIQUE(student_id, academic_period_id)
);

-- Table des profils utilisateurs étendus
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text CHECK (role IN ('Admin', 'Directeur', 'Secrétaire', 'Enseignant', 'Comptable')) NOT NULL,
  permissions text[] DEFAULT '{}',
  phone text,
  avatar_url text,
  last_login timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des logs d'activité
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_enrollment ON payments(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_subject_period ON grades(subject_id, academic_period_id);
CREATE INDEX IF NOT EXISTS idx_schedules_class_day ON schedules(class_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON student_class_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class_year ON student_class_enrollments(class_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_school_teachers_teacher ON school_teachers(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_school ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_subjects_school ON subjects(school_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_school ON user_profiles(school_id);

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_academic_years_updated_at BEFORE UPDATE ON academic_years FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_levels_updated_at BEFORE UPDATE ON levels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON student_class_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_school_teachers_updated_at BEFORE UPDATE ON school_teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour logger les activités
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_logs (user_id, action, table_name, record_id, old_values, new_values)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers pour les logs
CREATE TRIGGER log_students_activity AFTER INSERT OR UPDATE OR DELETE ON students FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_teachers_activity AFTER INSERT OR UPDATE OR DELETE ON teachers FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_classes_activity AFTER INSERT OR UPDATE OR DELETE ON classes FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_payments_activity AFTER INSERT OR UPDATE OR DELETE ON payments FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_grades_activity AFTER INSERT OR UPDATE OR DELETE ON grades FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_enrollments_activity AFTER INSERT OR UPDATE OR DELETE ON student_class_enrollments FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_school_teachers_activity AFTER INSERT OR UPDATE OR DELETE ON school_teachers FOR EACH ROW EXECUTE FUNCTION log_activity();

-- Enable RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulletins ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Politiques RLS (exemples principaux)
CREATE POLICY "Authenticated users can read schools" ON schools FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage schools" ON schools FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'Admin')
);

CREATE POLICY "Users can read their school data" ON user_profiles FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR school_id IN (
    SELECT school_id FROM user_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Teachers can manage their classes" ON classes FOR ALL TO authenticated USING (
  teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'Admin')
);

-- Politique pour les inscriptions
CREATE POLICY "Authorized users can manage enrollments" ON student_class_enrollments FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND ('academic' = ANY(permissions) OR role IN ('Admin', 'Directeur', 'Secrétaire'))
);