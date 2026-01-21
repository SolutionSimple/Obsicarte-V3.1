-- Remove Unwanted Templates - Keep Only Three
--
-- Overview: Deletes all templates except etudiants, professionel, and politique.
--          Updates existing profiles using removed templates to use professionel as default.
--
-- 1. Templates to Keep
--    - etudiants (for students)
--    - professionel (for professionals/entreprise)
--    - politique (for politicians)
--
-- 2. Actions
--    - Update existing profiles using removed templates to professionel
--    - Delete unwanted templates from profile_templates table
--    - Add etudiants template if it doesn't exist
--    - Update entreprise to professionel

-- First, add the etudiants template if it doesn't exist
INSERT INTO profile_templates (name, label, description, icon, default_fields, is_active) VALUES
  (
    'etudiants',
    'Étudiants',
    'Pour les étudiants et jeunes diplômés',
    'graduation-cap',
    '[
      {"id": "formation", "label": "Formation", "type": "text", "value": "", "required": false, "order": 0, "isPublic": true},
      {"id": "ecole", "label": "École / Université", "type": "text", "value": "", "required": false, "order": 1, "isPublic": true},
      {"id": "niveau_etude", "label": "Niveau d''étude", "type": "text", "value": "", "required": false, "order": 2, "isPublic": true},
      {"id": "recherche", "label": "Recherche de", "type": "text", "value": "", "required": false, "order": 3, "isPublic": true}
    ]'::jsonb,
    true
  )
ON CONFLICT (name) DO NOTHING;

-- Add professionel template (rename entreprise to professionel)
INSERT INTO profile_templates (name, label, description, icon, default_fields, is_active) VALUES
  (
    'professionel',
    'Professionnel',
    'Pour les professionnels et dirigeants d''entreprise',
    'building-2',
    '[
      {"id": "entreprise", "label": "Entreprise", "type": "text", "value": "", "required": false, "order": 0, "isPublic": true},
      {"id": "secteur_activite", "label": "Secteur d''activité", "type": "text", "value": "", "required": false, "order": 1, "isPublic": true},
      {"id": "annees_experience", "label": "Années d''expérience", "type": "text", "value": "", "required": false, "order": 2, "isPublic": true}
    ]'::jsonb,
    true
  )
ON CONFLICT (name) DO NOTHING;

-- Update all profiles using entreprise to use professionel
UPDATE profiles
SET sector = 'professionel'
WHERE sector = 'entreprise';

-- Update all profiles using removed templates to use professionel
UPDATE profiles
SET sector = 'professionel'
WHERE sector NOT IN ('etudiants', 'professionel', 'politique');

-- Delete unwanted templates, keeping only etudiants, professionel, and politique
DELETE FROM profile_templates
WHERE name NOT IN ('etudiants', 'professionel', 'politique');