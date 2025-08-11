/*
  # Fonctions RPC pour le système de gestion scolaire

  1. Fonctions utilitaires
    - Mise à jour des paiements élèves
    - Calcul des moyennes
    - Génération de statistiques

  2. Fonctions de calcul
    - Moyennes par classe
    - Classements
    - Statistiques académiques
*/

-- Fonction pour mettre à jour le montant payé d'un élève
CREATE OR REPLACE FUNCTION update_student_payment(
  student_id uuid,
  payment_amount integer
)
RETURNS void AS $$
BEGIN
  UPDATE students 
  SET paid_amount = COALESCE(paid_amount, 0) + payment_amount
  WHERE id = student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour calculer les moyennes d'une classe
CREATE OR REPLACE FUNCTION calculate_class_averages(
  class_id uuid,
  period_id uuid
)
RETURNS TABLE (
  student_id uuid,
  student_name text,
  general_average decimal,
  subject_averages jsonb,
  class_rank integer
) AS $$
BEGIN
  RETURN QUERY
  WITH student_grades AS (
    SELECT 
      s.id,
      s.first_name || ' ' || s.last_name as name,
      g.subject_id,
      sub.name as subject_name,
      AVG(g.grade * g.coefficient) / AVG(g.coefficient) as subject_avg,
      sub.coefficient as subject_coef
    FROM students s
    JOIN grades g ON s.id = g.student_id
    JOIN subjects sub ON g.subject_id = sub.id
    WHERE s.class_id = calculate_class_averages.class_id
      AND g.academic_period_id = calculate_class_averages.period_id
    GROUP BY s.id, s.first_name, s.last_name, g.subject_id, sub.name, sub.coefficient
  ),
  student_averages AS (
    SELECT 
      id,
      name,
      SUM(subject_avg * subject_coef) / SUM(subject_coef) as gen_avg,
      jsonb_object_agg(subject_name, subject_avg) as subj_avgs
    FROM student_grades
    GROUP BY id, name
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
    rs.rank::integer
  FROM ranked_students rs
  ORDER BY rs.rank;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les statistiques d'une classe
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
BEGIN
  -- Compter les élèves
  SELECT COUNT(*) INTO total_students
  FROM students s
  WHERE s.class_id = get_class_statistics.class_id
    AND s.status = 'Actif';

  -- Calculer la moyenne générale de la classe
  WITH class_averages AS (
    SELECT calculate_class_averages.general_average
    FROM calculate_class_averages(get_class_statistics.class_id, get_class_statistics.period_id)
  )
  SELECT AVG(general_average) INTO avg_general
  FROM class_averages;

  -- Calculer le taux de réussite (moyenne >= 10)
  WITH class_averages AS (
    SELECT calculate_class_averages.general_average
    FROM calculate_class_averages(get_class_statistics.class_id, get_class_statistics.period_id)
  )
  SELECT 
    (COUNT(*) FILTER (WHERE general_average >= 10.0) * 100.0 / COUNT(*))
  INTO pass_rate
  FROM class_averages;

  -- Construire le résultat JSON
  result := jsonb_build_object(
    'total_students', total_students,
    'general_average', COALESCE(avg_general, 0),
    'pass_rate', COALESCE(pass_rate, 0),
    'class_id', get_class_statistics.class_id,
    'period_id', get_class_statistics.period_id
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les élèves avec paiements en retard
CREATE OR REPLACE FUNCTION get_outstanding_payments()
RETURNS TABLE (
  student_id uuid,
  student_name text,
  class_name text,
  level_name text,
  outstanding_amount integer,
  total_fees integer,
  payment_status text,
  last_payment_date date
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.first_name || ' ' || s.last_name,
    c.name,
    l.name,
    s.outstanding_amount,
    s.total_fees,
    s.payment_status,
    (
      SELECT MAX(p.payment_date)
      FROM payments p
      WHERE p.student_id = s.id
        AND p.status = 'Confirmé'
    )
  FROM students s
  LEFT JOIN classes c ON s.class_id = c.id
  LEFT JOIN levels l ON c.level_id = l.id
  WHERE s.outstanding_amount > 0
    AND s.status = 'Actif'
  ORDER BY s.outstanding_amount DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les statistiques financières
CREATE OR REPLACE FUNCTION get_financial_stats(
  start_date date DEFAULT NULL,
  end_date date DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
  total_revenue integer;
  total_payments integer;
  payment_methods jsonb;
BEGIN
  -- Définir les dates par défaut (mois actuel)
  IF start_date IS NULL THEN
    start_date := date_trunc('month', CURRENT_DATE);
  END IF;
  
  IF end_date IS NULL THEN
    end_date := CURRENT_DATE;
  END IF;

  -- Calculer le revenu total
  SELECT COALESCE(SUM(amount), 0) INTO total_revenue
  FROM payments
  WHERE payment_date BETWEEN start_date AND end_date
    AND status = 'Confirmé';

  -- Compter les paiements
  SELECT COUNT(*) INTO total_payments
  FROM payments
  WHERE payment_date BETWEEN start_date AND end_date
    AND status = 'Confirmé';

  -- Répartition par méthode de paiement
  SELECT jsonb_object_agg(payment_method, method_total)
  INTO payment_methods
  FROM (
    SELECT 
      payment_method,
      SUM(amount) as method_total
    FROM payments
    WHERE payment_date BETWEEN start_date AND end_date
      AND status = 'Confirmé'
    GROUP BY payment_method
  ) pm;

  -- Construire le résultat
  result := jsonb_build_object(
    'total_revenue', total_revenue,
    'total_payments', total_payments,
    'payment_methods', COALESCE(payment_methods, '{}'::jsonb),
    'period_start', start_date,
    'period_end', end_date
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir le tableau de bord
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS jsonb AS $$
DECLARE
  result jsonb;
  total_students integer;
  total_teachers integer;
  total_classes integer;
  active_year_name text;
  monthly_revenue integer;
  outstanding_count integer;
BEGIN
  -- Élèves actifs
  SELECT COUNT(*) INTO total_students
  FROM students
  WHERE status = 'Actif';

  -- Enseignants actifs
  SELECT COUNT(*) INTO total_teachers
  FROM teachers
  WHERE status = 'Actif';

  -- Classes actives
  SELECT COUNT(*) INTO total_classes
  FROM classes
  WHERE status = 'Actif';

  -- Année scolaire active
  SELECT name INTO active_year_name
  FROM academic_years
  WHERE is_active = true
  LIMIT 1;

  -- Revenus du mois
  SELECT COALESCE(SUM(amount), 0) INTO monthly_revenue
  FROM payments
  WHERE payment_date >= date_trunc('month', CURRENT_DATE)
    AND status = 'Confirmé';

  -- Paiements en retard
  SELECT COUNT(*) INTO outstanding_count
  FROM students
  WHERE outstanding_amount > 0
    AND status = 'Actif';

  -- Construire le résultat
  result := jsonb_build_object(
    'total_students', total_students,
    'total_teachers', total_teachers,
    'total_classes', total_classes,
    'active_year', COALESCE(active_year_name, '2024-2025'),
    'monthly_revenue', monthly_revenue,
    'outstanding_payments', outstanding_count
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;