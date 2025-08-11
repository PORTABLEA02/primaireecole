/*
  # Création des utilisateurs de démonstration

  1. Profils utilisateurs
    - Admin principal
    - Directeur
    - Secrétaire  
    - Comptable

  2. Note importante
    - Les utilisateurs doivent être créés dans Supabase Auth
    - Ce script crée seulement les profils étendus
*/

-- Insérer les profils utilisateurs de démonstration
-- Note: Les utilisateurs doivent d'abord être créés dans Supabase Auth

-- Fonction pour créer un profil utilisateur si l'utilisateur existe
CREATE OR REPLACE FUNCTION create_user_profile_if_exists(
  user_email text,
  user_name text,
  user_role text,
  user_permissions text[]
)
RETURNS void AS $$
DECLARE
  user_uuid uuid;
BEGIN
  -- Chercher l'utilisateur par email dans auth.users
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = user_email
  LIMIT 1;

  -- Si l'utilisateur existe, créer son profil
  IF user_uuid IS NOT NULL THEN
    INSERT INTO user_profiles (
      user_id,
      full_name,
      role,
      permissions,
      is_active
    ) VALUES (
      user_uuid,
      user_name,
      user_role,
      user_permissions,
      true
    ) ON CONFLICT (user_id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      permissions = EXCLUDED.permissions,
      updated_at = now();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer les profils pour les utilisateurs de démonstration
SELECT create_user_profile_if_exists(
  'admin@ecoletech.edu',
  'Admin Principal',
  'Admin',
  ARRAY['all']
);

SELECT create_user_profile_if_exists(
  'directeur@ecoletech.edu',
  'Dr. Amadou Sanogo',
  'Directeur',
  ARRAY['students', 'teachers', 'academic', 'reports', 'classes']
);

SELECT create_user_profile_if_exists(
  'secretaire@ecoletech.edu',
  'Mme Fatoumata Keita',
  'Secrétaire',
  ARRAY['students', 'classes']
);

SELECT create_user_profile_if_exists(
  'comptable@ecoletech.edu',
  'M. Ibrahim Coulibaly',
  'Comptable',
  ARRAY['finance', 'reports']
);

-- Nettoyer la fonction temporaire
DROP FUNCTION IF EXISTS create_user_profile_if_exists;