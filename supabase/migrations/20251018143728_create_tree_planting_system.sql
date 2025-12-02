/*
  # Tree Planting Map System

  1. New Tables
    - `planting_areas`
      - `id` (uuid, primary key)
      - `title` (text) - Name/title of the area
      - `description` (text) - Why tree planting is needed here
      - `latitude` (numeric) - Location latitude
      - `longitude` (numeric) - Location longitude
      - `district` (text) - District name
      - `division` (text) - Division name
      - `problem_type` (text) - Type of environmental problem (deforestation, pollution, etc.)
      - `is_planted` (boolean) - Whether trees have been planted
      - `created_at` (timestamptz) - When area was added
      - `updated_at` (timestamptz) - Last update time

    - `planted_trees`
      - `id` (uuid, primary key)
      - `planting_area_id` (uuid) - Reference to planting_areas
      - `tree_type` (text) - Type of tree planted
      - `planted_by` (uuid) - User who planted the tree
      - `planted_at` (timestamptz) - When tree was planted
      - `notes` (text) - Optional notes about planting

  2. Security
    - Enable RLS on both tables
    - Allow anyone to view planting areas
    - Allow authenticated users to plant trees (insert into planted_trees)
    - Only admins can add/modify planting areas

  3. Important Notes
    - Red flag areas are planting_areas where is_planted = false
    - Green flag areas are planting_areas where is_planted = true
    - When a tree is planted, we insert into planted_trees and update planting_areas.is_planted
*/

-- Create planting_areas table
CREATE TABLE IF NOT EXISTS planting_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  district text NOT NULL,
  division text NOT NULL,
  problem_type text NOT NULL DEFAULT 'Deforestation',
  is_planted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create planted_trees table
CREATE TABLE IF NOT EXISTS planted_trees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  planting_area_id uuid NOT NULL REFERENCES planting_areas(id) ON DELETE CASCADE,
  tree_type text NOT NULL,
  planted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  planted_at timestamptz DEFAULT now(),
  notes text
);

-- Enable RLS
ALTER TABLE planting_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE planted_trees ENABLE ROW LEVEL SECURITY;

-- Policies for planting_areas
CREATE POLICY "Anyone can view planting areas"
  ON planting_areas FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert planting areas"
  ON planting_areas FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update planting areas"
  ON planting_areas FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete planting areas"
  ON planting_areas FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policies for planted_trees
CREATE POLICY "Anyone can view planted trees"
  ON planted_trees FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can plant trees"
  ON planted_trees FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = planted_by);

-- Create function to update is_planted status
CREATE OR REPLACE FUNCTION update_planting_area_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE planting_areas
  SET is_planted = true, updated_at = now()
  WHERE id = NEW.planting_area_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update is_planted when tree is planted
DROP TRIGGER IF EXISTS trigger_update_planting_status ON planted_trees;
CREATE TRIGGER trigger_update_planting_status
  AFTER INSERT ON planted_trees
  FOR EACH ROW
  EXECUTE FUNCTION update_planting_area_status();

-- Insert sample planting areas across Bangladesh
INSERT INTO planting_areas (title, description, latitude, longitude, district, division, problem_type, is_planted) VALUES
  ('Dhanmondi Lake Area', 'High pollution area near lake — needs reforestation to improve air quality', 23.7461, 90.3742, 'Dhaka', 'Dhaka Division', 'Pollution', false),
  ('Chittagong Hill Tracts', 'Deforested area due to illegal logging — urgent reforestation needed', 22.3569, 91.7832, 'Chittagong', 'Chittagong Division', 'Deforestation', false),
  ('Sundarbans Buffer Zone', 'Coastal erosion area — mangrove planting required', 22.2745, 89.1836, 'Khulna', 'Khulna Division', 'Erosion', false),
  ('Rajshahi Barind Tract', 'Dry and barren land — drought-resistant trees needed', 24.3745, 88.6042, 'Rajshahi', 'Rajshahi Division', 'Drought', false),
  ('Sylhet Tea Gardens', 'Soil erosion in hilly areas — tree cover needed', 24.8949, 91.8687, 'Sylhet', 'Sylhet Division', 'Soil Erosion', false),
  ('Cox''s Bazar Beach Area', 'Beach erosion and salt water intrusion — coastal trees needed', 21.4272, 92.0058, 'Cox''s Bazar', 'Chittagong Division', 'Coastal Erosion', false),
  ('Gazipur Industrial Zone', 'Industrial pollution area — air purifying trees needed', 23.9999, 90.4203, 'Gazipur', 'Dhaka Division', 'Industrial Pollution', false),
  ('Barisal River Banks', 'River bank erosion — stabilization through tree planting', 22.7010, 90.3535, 'Barisal', 'Barisal Division', 'River Erosion', false),
  ('Rangpur Agricultural Land', 'Loss of biodiversity — mixed tree plantation needed', 25.7439, 89.2752, 'Rangpur', 'Rangpur Division', 'Biodiversity Loss', false),
  ('Mymensingh Forest Edge', 'Forest degradation — native species reforestation', 24.7471, 90.4203, 'Mymensingh', 'Mymensingh Division', 'Forest Degradation', false);
