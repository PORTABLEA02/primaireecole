/*
  # Données initiales pour le système de gestion scolaire

  1. Configuration de base
    - École par défaut
    - Année scolaire active
    - Niveaux et matières
    - Utilisateurs de démonstration

  2. Données de test
    - Classes avec enseignants
    - Élèves d'exemple
    - Quelques paiements et notes
*/

-- Insérer l'école par défaut
INSERT INTO schools (name, address, phone, email, director, founded_year, student_capacity, motto)
VALUES (
  'École Technique Moderne',
  'Quartier ACI 2000, Bamako, Mali',
  '+223 20 22 33 44',
  'contact@ecoletech.edu.ml',
  'Dr. Amadou Sanogo',
  '2010',
  1500,
  'Excellence, Innovation, Intégrité'
) ON CONFLICT DO NOTHING;

-- Insérer l'année scolaire active
INSERT INTO academic_years (name, start_date, end_date, is_active)
VALUES ('2024-2025', '2024-10-01', '2025-06-30', true)
ON CONFLICT DO NOTHING;

-- Insérer les périodes
WITH current_year AS (
  SELECT id FROM academic_years WHERE name = '2024-2025' LIMIT 1
)
INSERT INTO academic_periods (academic_year_id, name, start_date, end_date, type, order_number)
SELECT 
  current_year.id,
  period_name,
  start_date::date,
  end_date::date,
  'Trimestre',
  order_num
FROM current_year,
(VALUES 
  ('Trimestre 1', '2024-10-01', '2024-12-20', 1),
  ('Trimestre 2', '2025-01-08', '2025-03-28', 2),
  ('Trimestre 3', '2025-04-07', '2025-06-30', 3)
) AS periods(period_name, start_date, end_date, order_num)
ON CONFLICT DO NOTHING;

-- Insérer les niveaux scolaires
INSERT INTO levels (name, description, min_age, max_age, annual_fees, order_number)
VALUES 
  ('Maternelle', 'Éducation préscolaire pour les tout-petits', 3, 5, 300000, 1),
  ('CI', 'Cours d''Initiation - Première année du primaire', 6, 7, 350000, 2),
  ('CP', 'Cours Préparatoire', 7, 8, 350000, 3),
  ('CE1', 'Cours Élémentaire 1ère année', 8, 9, 400000, 4),
  ('CE2', 'Cours Élémentaire 2ème année', 9, 10, 400000, 5),
  ('CM1', 'Cours Moyen 1ère année', 10, 11, 450000, 6),
  ('CM2', 'Cours Moyen 2ème année', 11, 12, 450000, 7)
ON CONFLICT (name) DO NOTHING;

-- Insérer les matières
INSERT INTO subjects (name, description, coefficient)
VALUES 
  ('Français', 'Langue française, lecture, écriture, expression', 4),
  ('Mathématiques', 'Calcul, géométrie, résolution de problèmes', 4),
  ('Sciences', 'Sciences naturelles, physique, chimie', 2),
  ('Histoire-Géographie', 'Histoire du Mali et du monde, géographie', 2),
  ('Éducation Civique', 'Citoyenneté, valeurs civiques et morales', 1),
  ('Anglais', 'Langue anglaise de base', 2),
  ('Éveil', 'Éveil sensoriel et cognitif', 1),
  ('Langage', 'Développement du langage oral', 1),
  ('Graphisme', 'Développement de la motricité fine', 1),
  ('Jeux éducatifs', 'Apprentissage par le jeu', 1),
  ('Motricité', 'Développement moteur', 1),
  ('Éveil Scientifique', 'Initiation aux sciences', 2),
  ('Dessin', 'Expression artistique', 1)
ON CONFLICT DO NOTHING;

-- Associer les matières aux niveaux
WITH level_subject_mapping AS (
  SELECT 
    l.id as level_id,
    s.id as subject_id,
    l.name as level_name,
    s.name as subject_name
  FROM levels l
  CROSS JOIN subjects s
  WHERE 
    (l.name = 'Maternelle' AND s.name IN ('Éveil', 'Langage', 'Graphisme', 'Jeux éducatifs', 'Motricité')) OR
    (l.name = 'CI' AND s.name IN ('Français', 'Mathématiques', 'Éveil Scientifique', 'Éducation Civique', 'Dessin')) OR
    (l.name = 'CP' AND s.name IN ('Français', 'Mathématiques', 'Éveil Scientifique', 'Éducation Civique', 'Dessin')) OR
    (l.name = 'CE1' AND s.name IN ('Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences', 'Éducation Civique', 'Dessin')) OR
    (l.name = 'CE2' AND s.name IN ('Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences', 'Éducation Civique', 'Dessin')) OR
    (l.name = 'CM1' AND s.name IN ('Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences', 'Éducation Civique', 'Anglais', 'Dessin')) OR
    (l.name = 'CM2' AND s.name IN ('Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences', 'Éducation Civique', 'Anglais', 'Dessin'))
)
INSERT INTO level_subjects (level_id, subject_id, is_mandatory)
SELECT level_id, subject_id, true
FROM level_subject_mapping
ON CONFLICT (level_id, subject_id) DO NOTHING;