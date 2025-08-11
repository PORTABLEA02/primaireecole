/*
  # Fonctions RPC mises à jour pour le système de gestion scolaire
  Adaptées à la nouvelle structure avec :
  - student_class_enrollments
  - school_teachers
  - Relations avec schools
*/

-- 1. Fonction pour mettre à jour le paiement d'un élève (version mise à jour)
CREATE OR REPLACE FUNCTION update_student_payment(
  enrollment_id uuid,
  payment_amount integer,
  payment_method text,
  payment_type text,
  notes text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
  new_balance integer;
BEGIN
  -- Ajouter le paiement
  INSERT INTO payments (
    enrollment_id, 
    amount, 
    payment_method, 
    payment_type,
    notes
  ) VALUES (
    update_student_payment.enrollment_id,
    update_student_payment.payment_amount,
    update_student_payment.payment_method,
    update_student_payment.payment_type,
    update_student_payment.notes
  );
  
  -- Mettre à jour le montant payé dans l'inscription
  UPDATE student_class_enrollments
  SET paid_amount = paid_amount + update_student_payment.payment_amount
  WHERE id = update_student_payment.enrollment_id
  RETURNING outstanding_amount INTO new_balance;
  
  -- Retourner le résultat
  result := jsonb_build_object(
    'status', 'success',
    'new_balance', new_balance,
    'payment_status', (
      SELECT payment_status 
      FROM student_class_enrollments 
      WHERE id = update_student_payment.enrollment_id
    )
  );
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'status', 'error',
    'message', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Fonction pour calculer les moyennes d'une classe (version mise à jour)
CREATE OR REPLACE FUNCTION calculate_class_averages(
  class_id uuid,
  period_id uuid
)
RETURNS TABLE (
  student_id uuid,
  student_name text,
  general_average decimal,
  subject_averages jsonb,
  class_rank integer,
  enrollment_id uuid
) AS $$
BEGIN
  RETURN QUERY
  WITH student_grades AS (
    SELECT 
      s.id,
      s.first_name || ' ' || s.last_name as name,
      e.id as enrollment_id,
      g.subject_id,
      sub.name as subject_name,
      AVG(g.grade * g.coefficient) / AVG(g.coefficient) as subject_avg,
      sub.coefficient as subject_coef
    FROM students s
    JOIN student_class_enrollments e ON s.id = e.student_id
    JOIN grades g ON s.id = g.student_id AND e.academic_year_id = g.academic_period_id
    JOIN subjects sub ON g.subject_id = sub.id
    WHERE e.class_id = calculate_class_averages.class_id
      AND g.academic_period_id = calculate_class_averages.period_id
    GROUP BY s.id, s.first_name, s.last_name, e.id, g.subject_id, sub.name, sub.coefficient
  ),
  student_averages AS (
    SELECT 
      id,
      name,
      enrollment_id,
      SUM(subject_avg * subject_coef) / SUM(subject_coef) as gen_avg,
      jsonb_object_agg(subject_name, subject_avg) as subj_avgs
    FROM student_grades
    GROUP BY id, name, enrollment_id
  ),
  ranked_students AS (
    SELECT 
      *,
      RANK() OVER (ORDER BY gen_avg DESC) as rank
    FROM student_averages
  )
  SELECT 
    rs.id,
    rs.name,
    rs.gen_avg,
    rs.subj_avgs,
    rs.rank::integer,
    rs.enrollment_id
  FROM ranked_students rs
  ORDER BY rs.rank;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Fonction pour obtenir les statistiques d'une classe (version mise à jour)
CREATE OR REPLACE FUNCTION get_class_statistics(
  class_id uuid,
  period_id uuid
)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
  total_students integer;
  avg_general decimal;
  pass_rate decimal;
  teacher_info jsonb;
BEGIN
  -- Compter les élèves inscrits dans cette classe pour l'année en cours
  SELECT COUNT(*) INTO total_students
  FROM student_class_enrollments e
  WHERE e.class_id = get_class_statistics.class_id
    AND e.status = 'Actif';

  -- Calculer la moyenne générale de la classe
  WITH class_averages AS (
    SELECT calculate_class_averages.general_average
    FROM calculate_class_averages(get_class_statistics.class_id, get_class_statistics.period_id)
  )
  SELECT AVG(general_average) INTO avg_general
  FROM class_averages;

  -- Calculer le taux de réussite
  WITH class_averages AS (
    SELECT calculate_class_averages.general_average
    FROM calculate_class_averages(get_class_statistics.class_id, get_class_statistics.period_id)
  )
  SELECT 
    (COUNT(*) FILTER (WHERE general_average >= 10.0) * 100.0 / NULLIF(COUNT(*), 0))
  INTO pass_rate
  FROM class_averages;

  -- Informations sur l'enseignant
  SELECT jsonb_build_object(
    'teacher_id', t.id,
    'teacher_name', t.first_name || ' ' || t.last_name,
    'subjects', (
      SELECT jsonb_agg(jsonb_build_object('name', s.name, 'coefficient', s.coefficient))
      FROM subjects s
      JOIN level_subjects ls ON s.id = ls.subject_id
      JOIN classes c ON ls.level_id = c.level_id
      WHERE c.id = get_class_statistics.class_id
    )
  ) INTO teacher_info
  FROM classes c
  JOIN teachers t ON c.teacher_id = t.id
  WHERE c.id = get_class_statistics.class_id;

  -- Construire le résultat JSON
  result := jsonb_build_object(
    'total_students', total_students,
    'general_average', COALESCE(avg_general, 0),
    'pass_rate', COALESCE(pass_rate, 0),
    'teacher_info', COALESCE(teacher_info, '{}'::jsonb),
    'class_id', get_class_statistics.class_id,
    'period_id', get_class_statistics.period_id
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Fonction pour obtenir les élèves avec paiements en retard (version mise à jour)
CREATE OR REPLACE FUNCTION get_outstanding_payments(
  school_id uuid DEFAULT NULL
)
RETURNS TABLE (
  student_id uuid,
  student_name text,
  class_name text,
  level_name text,
  outstanding_amount integer,
  total_fees integer,
  payment_status text,
  last_payment_date date,
  enrollment_id uuid,
  school_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.first_name || ' ' || s.last_name,
    c.name,
    l.name,
    e.outstanding_amount,
    e.total_fees,
    e.payment_status,
    (
      SELECT MAX(p.payment_date)
      FROM payments p
      WHERE p.enrollment_id = e.id
        AND p.status = 'Confirmé'
    ),
    e.id,
    sch.name
  FROM students s
  JOIN student_class_enrollments e ON s.id = e.student_id
  JOIN classes c ON e.class_id = c.id
  JOIN levels l ON c.level_id = l.id
  JOIN schools sch ON c.school_id = sch.id
  WHERE e.outstanding_amount > 0
    AND e.status = 'Actif'
    AND (get_outstanding_payments.school_id IS NULL OR c.school_id = get_outstanding_payments.school_id)
  ORDER BY e.outstanding_amount DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Fonction pour obtenir les statistiques financières (version mise à jour)
CREATE OR REPLACE FUNCTION get_financial_stats(
  school_id uuid DEFAULT NULL,
  start_date date DEFAULT NULL,
  end_date date DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
  total_revenue integer;
  total_payments integer;
  payment_methods jsonb;
  outstanding_total integer;
  by_level jsonb;
BEGIN
  -- Définir les dates par défaut
  IF start_date IS NULL THEN
    start_date := date_trunc('month', CURRENT_DATE);
  END IF;
  
  IF end_date IS NULL THEN
    end_date := CURRENT_DATE;
  END IF;

  -- Calculer le revenu total
  SELECT COALESCE(SUM(p.amount), 0) INTO total_revenue
  FROM payments p
  JOIN student_class_enrollments e ON p.enrollment_id = e.id
  JOIN classes c ON e.class_id = c.id
  WHERE p.payment_date BETWEEN start_date AND end_date
    AND p.status = 'Confirmé'
    AND (get_financial_stats.school_id IS NULL OR c.school_id = get_financial_stats.school_id);

  -- Compter les paiements
  SELECT COUNT(*) INTO total_payments
  FROM payments p
  JOIN student_class_enrollments e ON p.enrollment_id = e.id
  JOIN classes c ON e.class_id = c.id
  WHERE p.payment_date BETWEEN start_date AND end_date
    AND p.status = 'Confirmé'
    AND (get_financial_stats.school_id IS NULL OR c.school_id = get_financial_stats.school_id);

  -- Répartition par méthode de paiement
  SELECT jsonb_object_agg(p.payment_method, method_total)
  INTO payment_methods
  FROM (
    SELECT 
      p.payment_method,
      SUM(p.amount) as method_total
    FROM payments p
    JOIN student_class_enrollments e ON p.enrollment_id = e.id
    JOIN classes c ON e.class_id = c.id
    WHERE p.payment_date BETWEEN start_date AND end_date
      AND p.status = 'Confirmé'
      AND (get_financial_stats.school_id IS NULL OR c.school_id = get_financial_stats.school_id)
    GROUP BY p.payment_method
  ) p;

  -- Montant total en retard
  SELECT COALESCE(SUM(e.outstanding_amount), 0) INTO outstanding_total
  FROM student_class_enrollments e
  JOIN classes c ON e.class_id = c.id
  WHERE e.outstanding_amount > 0
    AND e.status = 'Actif'
    AND (get_financial_stats.school_id IS NULL OR c.school_id = get_financial_stats.school_id);

  -- Répartition par niveau
  SELECT jsonb_object_agg(l.name, level_stats)
  INTO by_level
  FROM (
    SELECT 
      l.name,
      jsonb_build_object(
        'total_paid', SUM(p.amount),
        'total_expected', SUM(e.total_fees),
        'outstanding', SUM(e.outstanding_amount),
        'student_count', COUNT(DISTINCT e.student_id)
      ) as level_stats
    FROM levels l
    JOIN classes c ON l.id = c.level_id
    JOIN student_class_enrollments e ON c.id = e.class_id
    LEFT JOIN payments p ON e.id = p.enrollment_id AND p.status = 'Confirmé'
    WHERE (get_financial_stats.school_id IS NULL OR c.school_id = get_financial_stats.school_id)
    GROUP BY l.name
  ) l;

  -- Construire le résultat
  result := jsonb_build_object(
    'total_revenue', total_revenue,
    'total_payments', total_payments,
    'payment_methods', COALESCE(payment_methods, '{}'::jsonb),
    'outstanding_total', outstanding_total,
    'by_level', COALESCE(by_level, '{}'::jsonb),
    'period_start', start_date,
    'period_end', end_date,
    'school_id', school_id
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Fonction pour obtenir le tableau de bord (version mise à jour)
CREATE OR REPLACE FUNCTION get_dashboard_stats(
  school_id uuid DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
  total_students integer;
  total_teachers integer;
  total_classes integer;
  active_year_name text;
  monthly_revenue integer;
  outstanding_count integer;
  by_level jsonb;
BEGIN
  -- Élèves actifs
  SELECT COUNT(*) INTO total_students
  FROM student_class_enrollments e
  JOIN classes c ON e.class_id = c.id
  WHERE e.status = 'Actif'
    AND (get_dashboard_stats.school_id IS NULL OR c.school_id = get_dashboard_stats.school_id);

  -- Enseignants actifs
  SELECT COUNT(*) INTO total_teachers
  FROM school_teachers st
  WHERE st.status = 'Actif'
    AND (get_dashboard_stats.school_id IS NULL OR st.school_id = get_dashboard_stats.school_id);

  -- Classes actives
  SELECT COUNT(*) INTO total_classes
  FROM classes c
  WHERE c.status = 'Actif'
    AND (get_dashboard_stats.school_id IS NULL OR c.school_id = get_dashboard_stats.school_id);

  -- Année scolaire active
  SELECT name INTO active_year_name
  FROM academic_years
  WHERE is_active = true
  LIMIT 1;

  -- Revenus du mois
  SELECT COALESCE(SUM(p.amount), 0) INTO monthly_revenue
  FROM payments p
  JOIN student_class_enrollments e ON p.enrollment_id = e.id
  JOIN classes c ON e.class_id = c.id
  WHERE p.payment_date >= date_trunc('month', CURRENT_DATE)
    AND p.status = 'Confirmé'
    AND (get_dashboard_stats.school_id IS NULL OR c.school_id = get_dashboard_stats.school_id);

  -- Paiements en retard
  SELECT COUNT(*) INTO outstanding_count
  FROM student_class_enrollments e
  JOIN classes c ON e.class_id = c.id
  WHERE e.outstanding_amount > 0
    AND e.status = 'Actif'
    AND (get_dashboard_stats.school_id IS NULL OR c.school_id = get_dashboard_stats.school_id);

  -- Répartition des élèves par niveau
  SELECT jsonb_object_agg(l.name, student_count)
  INTO by_level
  FROM (
    SELECT 
      l.name,
      COUNT(*) as student_count
    FROM levels l
    JOIN classes c ON l.id = c.level_id
    JOIN student_class_enrollments e ON c.id = e.class_id
    WHERE e.status = 'Actif'
      AND (get_dashboard_stats.school_id IS NULL OR c.school_id = get_dashboard_stats.school_id)
    GROUP BY l.name
  ) l;

  -- Construire le résultat
  result := jsonb_build_object(
    'total_students', total_students,
    'total_teachers', total_teachers,
    'total_classes', total_classes,
    'active_year', COALESCE(active_year_name, '2024-2025'),
    'monthly_revenue', monthly_revenue,
    'outstanding_payments', outstanding_count,
    'students_by_level', COALESCE(by_level, '{}'::jsonb),
    'school_id', school_id
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Nouvelle fonction pour inscrire un élève à une classe
CREATE OR REPLACE FUNCTION enroll_student(
  student_id uuid,
  class_id uuid,
  academic_year_id uuid,
  total_fees integer,
  enrollment_date date DEFAULT CURRENT_DATE
)
RETURNS jsonb AS $$
DECLARE
  enrollment_record student_class_enrollments;
  level_fees integer;
BEGIN
  -- Vérifier si l'élève est déjà inscrit
  IF EXISTS (
    SELECT 1 FROM student_class_enrollments 
    WHERE student_id = enroll_student.student_id 
      AND academic_year_id = enroll_student.academic_year_id
  ) THEN
    RETURN jsonb_build_object(
      'status', 'error',
      'message', 'Student already enrolled for this academic year'
    );
  END IF;

  -- Si total_fees n'est pas fourni, utiliser les frais du niveau
  IF total_fees IS NULL OR total_fees = 0 THEN
    SELECT l.annual_fees INTO level_fees
    FROM classes c
    JOIN levels l ON c.level_id = l.id
    WHERE c.id = enroll_student.class_id;
    
    total_fees := level_fees;
  END IF;

  -- Créer l'inscription
  INSERT INTO student_class_enrollments (
    student_id,
    class_id,
    academic_year_id,
    total_fees,
    enrollment_date
  ) VALUES (
    enroll_student.student_id,
    enroll_student.class_id,
    enroll_student.academic_year_id,
    enroll_student.total_fees,
    enroll_student.enrollment_date
  ) RETURNING * INTO enrollment_record;

  -- Retourner le résultat
  RETURN jsonb_build_object(
    'status', 'success',
    'enrollment_id', enrollment_record.id,
    'payment_status', enrollment_record.payment_status,
    'outstanding_amount', enrollment_record.outstanding_amount
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'status', 'error',
    'message', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Nouvelle fonction pour transférer un élève vers une autre classe
CREATE OR REPLACE FUNCTION transfer_student(
  enrollment_id uuid,
  new_class_id uuid,
  transfer_date date DEFAULT CURRENT_DATE
)
RETURNS jsonb AS $$
DECLARE
  old_class_id uuid;
  student_record students;
  new_enrollment_id uuid;
BEGIN
  -- Récupérer la classe actuelle
  SELECT class_id INTO old_class_id
  FROM student_class_enrollments
  WHERE id = enrollment_id;
  
  -- Vérifier que la nouvelle classe est différente
  IF old_class_id = new_class_id THEN
    RETURN jsonb_build_object(
      'status', 'error',
      'message', 'Student is already in this class'
    );
  END IF;
  
  -- Marquer l'ancienne inscription comme inactive
  UPDATE student_class_enrollments
  SET status = 'Transféré',
      updated_at = now()
  WHERE id = enrollment_id;
  
  -- Créer une nouvelle inscription dans la nouvelle classe
  INSERT INTO student_class_enrollments (
    student_id,
    class_id,
    academic_year_id,
    total_fees,
    paid_amount,
    enrollment_date,
    status
  )
  SELECT 
    student_id,
    new_class_id,
    academic_year_id,
    total_fees,
    paid_amount,
    transfer_date,
    'Actif'
  FROM student_class_enrollments
  WHERE id = enrollment_id
  RETURNING id INTO new_enrollment_id;
  
  -- Mettre à jour la référence de classe dans les bulletins et présences
  UPDATE bulletins
  SET class_id = new_class_id,
      enrollment_id = new_enrollment_id
  WHERE enrollment_id = enrollment_id;
  
  UPDATE attendance
  SET class_id = new_class_id,
      enrollment_id = new_enrollment_id
  WHERE enrollment_id = enrollment_id;
  
  -- Retourner le résultat
  RETURN jsonb_build_object(
    'status', 'success',
    'new_enrollment_id', new_enrollment_id,
    'old_enrollment_id', enrollment_id,
    'transfer_date', transfer_date
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'status', 'error',
    'message', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;