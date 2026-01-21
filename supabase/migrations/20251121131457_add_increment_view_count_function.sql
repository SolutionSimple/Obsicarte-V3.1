/*
  # Ajouter la fonction RPC increment_view_count

  1. Nouvelle fonction
    - `increment_view_count(profile_id UUID)` - Incrémente le compteur de vues d'un profil
    - Utilise SECURITY DEFINER pour permettre l'exécution sans authentification
    - Retourne void (pas de valeur de retour)

  2. Sécurité
    - La fonction est définie avec SECURITY DEFINER pour contourner RLS
    - Elle opère uniquement sur la colonne view_count
    - Ne permet pas de modifications non autorisées
*/

CREATE OR REPLACE FUNCTION increment_view_count(profile_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = profile_id;
END;
$$;
