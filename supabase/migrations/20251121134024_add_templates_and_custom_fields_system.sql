/*
  # Add Templates and Custom Fields System

  1. Tables Added
    - `profile_templates`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Internal name for the template
      - `label` (text) - Display name
      - `description` (text) - Description shown to users
      - `icon` (text) - Icon identifier
      - `default_fields` (jsonb) - Default custom fields for this template
      - `is_active` (boolean) - Whether template is available
      - `created_at` (timestamptz)

    - `saved_templates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - User who saved this template
      - `name` (text) - User-provided name for saved template
      - `base_template` (text) - Original template this is based on
      - `custom_configuration` (jsonb) - The saved field configuration
      - `created_at` (timestamptz)

  2. Columns Added to `profiles`
    - `sector` (text) - Selected sector/template name
    - `custom_fields` (jsonb) - User's custom fields with values

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users to read templates
    - Add policies for users to manage their own saved templates
    - Limit saved_templates to 1 per user for free tier (enforced in app logic)

  4. Initial Data
    - Insert predefined templates including "Politique" as priority
*/

-- Add columns to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'sector'
  ) THEN
    ALTER TABLE profiles ADD COLUMN sector text DEFAULT 'personnalise';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'custom_fields'
  ) THEN
    ALTER TABLE profiles ADD COLUMN custom_fields jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Create profile_templates table
CREATE TABLE IF NOT EXISTS profile_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  label text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'briefcase',
  default_fields jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profile_templates ENABLE ROW LEVEL SECURITY;

-- Create saved_templates table
CREATE TABLE IF NOT EXISTS saved_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  base_template text DEFAULT 'personnalise',
  custom_configuration jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profile_templates (read-only for all authenticated users)
CREATE POLICY "Anyone can view active templates"
  ON profile_templates FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies for saved_templates
CREATE POLICY "Users can view own saved templates"
  ON saved_templates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved templates"
  ON saved_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved templates"
  ON saved_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved templates"
  ON saved_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert predefined templates
INSERT INTO profile_templates (name, label, description, icon, default_fields, is_active) VALUES
  (
    'politique',
    'Politique',
    'Pour les élus, candidats et responsables politiques',
    'landmark',
    '[
      {"id": "pitch", "label": "Pitch", "type": "textarea", "value": "", "required": true, "order": 0, "isPublic": true, "rows": 4},
      {"id": "programme", "label": "Programme", "type": "textarea", "value": "", "required": true, "order": 1, "isPublic": true, "rows": 10},
      {"id": "parti", "label": "Parti politique", "type": "text", "value": "", "required": false, "order": 2, "isPublic": true},
      {"id": "circonscription", "label": "Circonscription / Mandat", "type": "text", "value": "", "required": false, "order": 3, "isPublic": true},
      {"id": "contact_equipe", "label": "Contact équipe", "type": "email", "value": "", "required": false, "order": 4, "isPublic": false}
    ]'::jsonb,
    true
  ),
  (
    'entreprise',
    'Entreprise',
    'Pour les dirigeants et professionnels en entreprise',
    'building-2',
    '[
      {"id": "entreprise", "label": "Entreprise", "type": "text", "value": "", "required": false, "order": 0, "isPublic": true},
      {"id": "secteur_activite", "label": "Secteur d''activité", "type": "text", "value": "", "required": false, "order": 1, "isPublic": true},
      {"id": "annees_experience", "label": "Années d''expérience", "type": "text", "value": "", "required": false, "order": 2, "isPublic": true}
    ]'::jsonb,
    true
  ),
  (
    'freelance',
    'Freelance',
    'Pour les travailleurs indépendants et consultants',
    'user',
    '[
      {"id": "competences", "label": "Compétences principales", "type": "textarea", "value": "", "required": false, "order": 0, "isPublic": true, "rows": 3},
      {"id": "tarif", "label": "Tarif journalier", "type": "text", "value": "", "required": false, "order": 1, "isPublic": true},
      {"id": "portfolio", "label": "Portfolio", "type": "url", "value": "", "required": false, "order": 2, "isPublic": true}
    ]'::jsonb,
    true
  ),
  (
    'artiste',
    'Artiste',
    'Pour les artistes, créateurs et performeurs',
    'palette',
    '[
      {"id": "discipline", "label": "Discipline artistique", "type": "text", "value": "", "required": false, "order": 0, "isPublic": true},
      {"id": "galerie", "label": "Galerie / Représentation", "type": "text", "value": "", "required": false, "order": 1, "isPublic": true},
      {"id": "expositions", "label": "Expositions récentes", "type": "textarea", "value": "", "required": false, "order": 2, "isPublic": true, "rows": 4}
    ]'::jsonb,
    true
  ),
  (
    'personnalise',
    'Personnalisé',
    'Créez votre propre configuration de champs',
    'settings',
    '[]'::jsonb,
    true
  )
ON CONFLICT (name) DO NOTHING;