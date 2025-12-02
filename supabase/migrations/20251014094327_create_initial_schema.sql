/*
  # Eco Track Bangladesh - Initial Database Schema

  ## Overview
  This migration sets up the complete database structure for the Eco Track Bangladesh application,
  a sustainability tracking platform for users in Bangladesh.

  ## New Tables

  ### 1. `profiles`
  User profile information linked to auth.users
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `quiz_scores`
  Stores user quiz results and scores
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `score` (integer)
  - `total_questions` (integer)
  - `quiz_data` (jsonb) - stores questions and answers
  - `completed_at` (timestamptz)

  ### 3. `carbon_footprints`
  Tracks carbon footprint calculations
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `electricity_kwh` (numeric)
  - `transportation_km` (numeric)
  - `transportation_type` (text)
  - `waste_kg` (numeric)
  - `total_co2_kg` (numeric)
  - `category` (text) - Low/Medium/High
  - `calculated_at` (timestamptz)

  ### 4. `daily_challenges`
  User progress on daily eco challenges
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `challenge_name` (text)
  - `completed` (boolean)
  - `completed_at` (timestamptz)
  - `challenge_date` (date)

  ### 5. `community_posts`
  User-generated eco ideas and comments
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `content` (text)
  - `likes` (integer)
  - `created_at` (timestamptz)

  ### 6. `blog_posts`
  Environmental articles and content
  - `id` (uuid, primary key)
  - `title` (text)
  - `content` (text)
  - `image_url` (text)
  - `author` (text)
  - `published_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 7. `eco_locations`
  Map markers for eco-friendly places in Bangladesh
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `category` (text) - recycling center, park, etc.
  - `city` (text)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Policies for authenticated users to manage their own data
  - Public read access for blog posts and eco locations
  - Authenticated read/write for community posts
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create quiz_scores table
CREATE TABLE IF NOT EXISTS quiz_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL DEFAULT 0,
  quiz_data jsonb,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz scores"
  ON quiz_scores FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz scores"
  ON quiz_scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create carbon_footprints table
CREATE TABLE IF NOT EXISTS carbon_footprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  electricity_kwh numeric DEFAULT 0,
  transportation_km numeric DEFAULT 0,
  transportation_type text DEFAULT '',
  waste_kg numeric DEFAULT 0,
  total_co2_kg numeric NOT NULL,
  category text NOT NULL,
  calculated_at timestamptz DEFAULT now()
);

ALTER TABLE carbon_footprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own carbon footprints"
  ON carbon_footprints FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own carbon footprints"
  ON carbon_footprints FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create daily_challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_name text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  challenge_date date DEFAULT CURRENT_DATE
);

ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily challenges"
  ON daily_challenges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily challenges"
  ON daily_challenges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily challenges"
  ON daily_challenges FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily challenges"
  ON daily_challenges FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view community posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert community posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own community posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own community posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  author text DEFAULT 'Eco Track Team',
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

-- Create eco_locations table
CREATE TABLE IF NOT EXISTS eco_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  category text NOT NULL,
  city text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE eco_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view eco locations"
  ON eco_locations FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, image_url, author) VALUES
('Climate Change Impact on Bangladesh', 'Bangladesh is one of the most climate-vulnerable countries in the world. Rising sea levels threaten coastal communities, while extreme weather events are becoming more frequent. This article explores the challenges and solutions for building climate resilience in Bangladesh.', 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg', 'Dr. Rashid Ahmed'),
('Plastic Pollution in Bangladesh Rivers', 'Our rivers are facing a severe plastic pollution crisis. From Dhaka to Chittagong, plastic waste clogs waterways and harms aquatic life. Learn about initiatives to reduce plastic use and promote sustainable alternatives across Bangladesh.', 'https://images.pexels.com/photos/3856033/pexels-photo-3856033.jpeg', 'Ayesha Khan'),
('Solar Energy Revolution in Rural Bangladesh', 'Solar home systems have transformed rural Bangladesh, bringing clean electricity to millions. This success story showcases how renewable energy can drive sustainable development and improve lives in off-grid communities.', 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg', 'Md. Karim')
ON CONFLICT DO NOTHING;

-- Insert sample eco locations
INSERT INTO eco_locations (name, description, latitude, longitude, category, city) VALUES
('Dhaka Recycling Center', 'Main recycling facility accepting paper, plastic, and metal waste', 23.8103, 90.4125, 'Recycling Center', 'Dhaka'),
('Ramna Park', 'Historic green space in the heart of Dhaka, perfect for eco-walks', 23.7379, 90.3958, 'Park', 'Dhaka'),
('Chittagong Beach Cleanup Point', 'Regular beach cleanup initiative meeting point', 22.3569, 91.7832, 'Cleanup Site', 'Chittagong'),
('Botanical Garden Mirpur', 'National botanical garden with diverse plant species', 23.8069, 90.3635, 'Park', 'Dhaka'),
('Sylhet Tea Garden', 'Organic tea plantation promoting sustainable agriculture', 24.8949, 91.8687, 'Eco Farm', 'Sylhet')
ON CONFLICT DO NOTHING;