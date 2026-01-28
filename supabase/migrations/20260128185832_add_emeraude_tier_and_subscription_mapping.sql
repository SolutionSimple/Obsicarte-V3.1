/*
  # Add Emeraude Tier and Subscription Mapping

  ## Changes
  
  1. Subscription Tiers
    - Update subscription tier constraint to include 'emeraude'
    - This enables the highest tier with unlimited profiles and premium features
  
  2. Profile Table Enhancement
    - Add `subscription_tier` column to profiles for quick tier access
    - Add index for performance on tier-based queries
  
  3. Sync Functions
    - Create function to sync card tier to subscription tier on order completion
    - Create trigger to update profile subscription_tier when user subscription changes
  
  ## Security
    - Maintain existing RLS policies
    - Ensure subscription_tier is only updated via secure functions
*/

-- Drop existing constraint if exists and recreate with emeraude
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'subscriptions_tier_check'
    AND table_name = 'subscriptions'
  ) THEN
    ALTER TABLE subscriptions DROP CONSTRAINT subscriptions_tier_check;
  END IF;
END $$;

-- Add constraint with all tiers including emeraude
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_tier_check 
  CHECK (tier IN ('free', 'premium', 'premium_plus', 'emeraude'));

-- Add subscription_tier column to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_tier'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_tier TEXT DEFAULT 'free';
  END IF;
END $$;

-- Create index on subscription_tier for performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier 
ON profiles(subscription_tier);

-- Create function to get user's current subscription tier
CREATE OR REPLACE FUNCTION get_user_subscription_tier(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_tier TEXT;
BEGIN
  SELECT tier INTO v_tier
  FROM subscriptions
  WHERE user_id = p_user_id
    AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN COALESCE(v_tier, 'free');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update profile subscription tier
CREATE OR REPLACE FUNCTION update_profile_subscription_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- Update all profiles for this user with the new subscription tier
  UPDATE profiles
  SET subscription_tier = NEW.tier
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-update profile subscription_tier
DROP TRIGGER IF EXISTS trigger_update_profile_subscription_tier ON subscriptions;
CREATE TRIGGER trigger_update_profile_subscription_tier
  AFTER INSERT OR UPDATE OF tier, status ON subscriptions
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION update_profile_subscription_tier();

-- Create function to create subscription from card purchase
CREATE OR REPLACE FUNCTION create_subscription_from_card(
  p_user_id UUID,
  p_card_tier TEXT,
  p_stripe_customer_id TEXT DEFAULT NULL,
  p_duration_months INTEGER DEFAULT 12
)
RETURNS UUID AS $$
DECLARE
  v_subscription_id UUID;
  v_subscription_tier TEXT;
  v_period_end TIMESTAMPTZ;
BEGIN
  -- Map card tier to subscription tier
  v_subscription_tier := CASE p_card_tier
    WHEN 'roc' THEN 'premium'
    WHEN 'saphir' THEN 'premium_plus'
    WHEN 'emeraude' THEN 'emeraude'
    ELSE 'free'
  END;
  
  -- Calculate period end (1 year from now by default)
  v_period_end := NOW() + (p_duration_months || ' months')::INTERVAL;
  
  -- Insert or update subscription
  INSERT INTO subscriptions (
    user_id,
    tier,
    status,
    stripe_customer_id,
    current_period_start,
    current_period_end,
    cancel_at_period_end
  ) VALUES (
    p_user_id,
    v_subscription_tier,
    'active',
    p_stripe_customer_id,
    NOW(),
    v_period_end,
    false
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    tier = EXCLUDED.tier,
    status = EXCLUDED.status,
    stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, subscriptions.stripe_customer_id),
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    updated_at = NOW()
  RETURNING id INTO v_subscription_id;
  
  RETURN v_subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill existing profiles with their subscription tier
UPDATE profiles p
SET subscription_tier = COALESCE(
  (SELECT tier FROM subscriptions s 
   WHERE s.user_id = p.user_id 
   AND s.status = 'active' 
   ORDER BY created_at DESC 
   LIMIT 1),
  'free'
)
WHERE subscription_tier IS NULL;
