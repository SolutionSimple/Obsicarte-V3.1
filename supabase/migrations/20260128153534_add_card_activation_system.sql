/*
  # Card Activation System - Complete Database Schema

  ## Overview
  This migration creates the complete database schema for the Obsi card activation and management system.
  It supports direct sales, reseller management, and salon mode activations.

  ## New Tables

  ### 1. `user_roles`
  Stores user role information for access control
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users, unique)
  - `role` (text: customer, admin, reseller)
  - `created_at` (timestamptz)

  ### 2. `resellers`
  Stores reseller/partner information
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users, unique)
  - `company_name` (text)
  - `contact_email` (text)
  - `contact_phone` (text, nullable)
  - `commission_rate` (numeric)
  - `status` (text: active, suspended, inactive)
  - `total_sales` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `orders`
  Stores customer orders for cards
  - `id` (uuid, primary key)
  - `order_number` (text, unique, format: ORD-YYYYMMDD-XXXX)
  - `customer_email` (text)
  - `customer_name` (text)
  - `customer_phone` (text)
  - `shipping_address` (jsonb: street, city, postal_code, country)
  - `tier` (text: roc, saphir, emeraude)
  - `quantity` (integer)
  - `total_amount` (integer, in cents)
  - `status` (text: pending, confirmed, shipped, completed, cancelled)
  - `payment_status` (text: pending, succeeded, failed, refunded)
  - `stripe_payment_intent_id` (text, nullable)
  - `stripe_customer_id` (text, nullable)
  - `user_id` (uuid, foreign key to auth.users, nullable)
  - `notes` (text, nullable)
  - `created_at` (timestamptz)
  - `confirmed_at` (timestamptz, nullable)
  - `shipped_at` (timestamptz, nullable)

  ### 4. `cards`
  Stores physical card information and activation status
  - `id` (uuid, primary key)
  - `card_code` (text, unique, format: OBSI-XXXX-XXXX-XXXX)
  - `nfc_uid` (text, nullable, unique if present)
  - `status` (text: pending, activated, deactivated, shipped)
  - `profile_id` (uuid, foreign key to profiles, nullable)
  - `tier` (text: roc, saphir, emeraude)
  - `order_id` (uuid, foreign key to orders, nullable)
  - `reseller_id` (uuid, foreign key to resellers, nullable)
  - `activation_code` (text, unique, format: XXXX-XXXX)
  - `activated_at` (timestamptz, nullable)
  - `shipped_at` (timestamptz, nullable)
  - `created_at` (timestamptz)
  - `metadata` (jsonb, for additional info)

  ### 5. `activation_batches`
  Tracks batches of generated activation codes
  - `id` (uuid, primary key)
  - `batch_name` (text)
  - `tier` (text: roc, saphir, emeraude)
  - `cards_count` (integer)
  - `status` (text: draft, ready, assigned)
  - `created_by` (uuid, foreign key to auth.users)
  - `assigned_to_reseller_id` (uuid, foreign key to resellers, nullable)
  - `notes` (text, nullable)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Admins have full access to all tables
  - Customers can only view their own orders and cards
  - Resellers can view their assigned cards and their own profile
  - Strict validation on all policies
*/

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('customer', 'admin', 'reseller')),
  created_at timestamptz DEFAULT now()
);

-- Create resellers table (before cards, since cards references it)
CREATE TABLE IF NOT EXISTS resellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  commission_rate numeric DEFAULT 0 CHECK (commission_rate >= 0 AND commission_rate <= 100),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
  total_sales integer DEFAULT 0 CHECK (total_sales >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table (before cards, since cards references it)
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text,
  shipping_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  tier text NOT NULL CHECK (tier IN ('roc', 'saphir', 'emeraude')),
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  total_amount integer NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'completed', 'cancelled')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'succeeded', 'failed', 'refunded')),
  stripe_payment_intent_id text,
  stripe_customer_id text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  shipped_at timestamptz
);

-- Create cards table (after orders and resellers)
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_code text UNIQUE NOT NULL,
  nfc_uid text UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'activated', 'deactivated', 'shipped')),
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  tier text NOT NULL CHECK (tier IN ('roc', 'saphir', 'emeraude')),
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  reseller_id uuid REFERENCES resellers(id) ON DELETE SET NULL,
  activation_code text UNIQUE NOT NULL,
  activated_at timestamptz,
  shipped_at timestamptz,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create activation_batches table
CREATE TABLE IF NOT EXISTS activation_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_name text NOT NULL,
  tier text NOT NULL CHECK (tier IN ('roc', 'saphir', 'emeraude')),
  cards_count integer NOT NULL CHECK (cards_count > 0),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'assigned')),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to_reseller_id uuid REFERENCES resellers(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cards_activation_code ON cards(activation_code);
CREATE INDEX IF NOT EXISTS idx_cards_status ON cards(status);
CREATE INDEX IF NOT EXISTS idx_cards_profile_id ON cards(profile_id);
CREATE INDEX IF NOT EXISTS idx_cards_reseller_id ON cards(reseller_id);
CREATE INDEX IF NOT EXISTS idx_cards_order_id ON cards(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_resellers_user_id ON resellers(user_id);

-- Enable Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE resellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_batches ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is reseller
CREATE OR REPLACE FUNCTION is_reseller()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'reseller'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get reseller_id for current user
CREATE OR REPLACE FUNCTION get_current_reseller_id()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT id FROM resellers
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all user roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Users can view their own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert user roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update user roles"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for cards
CREATE POLICY "Admins can view all cards"
  ON cards FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Users can view their own cards"
  ON cards FOR SELECT
  TO authenticated
  USING (profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Resellers can view their assigned cards"
  ON cards FOR SELECT
  TO authenticated
  USING (is_reseller() AND reseller_id = get_current_reseller_id());

CREATE POLICY "Admins can insert cards"
  ON cards FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update cards"
  ON cards FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete cards"
  ON cards FOR DELETE
  TO authenticated
  USING (is_admin());

-- RLS Policies for orders
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR customer_email IN (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can insert orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for resellers
CREATE POLICY "Admins can view all resellers"
  ON resellers FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Resellers can view their own profile"
  ON resellers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can insert resellers"
  ON resellers FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update resellers"
  ON resellers FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for activation_batches
CREATE POLICY "Admins can view all batches"
  ON activation_batches FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Resellers can view their assigned batches"
  ON activation_batches FOR SELECT
  TO authenticated
  USING (is_reseller() AND assigned_to_reseller_id = get_current_reseller_id());

CREATE POLICY "Admins can insert batches"
  ON activation_batches FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update batches"
  ON activation_batches FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());